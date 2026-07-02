-- ==============================================================
-- MIGRASI 002: Membuat Tabel Appointments, Medical Records
--              & Points History + Trigger Poin/Tier
-- Database: Supabase (PostgreSQL)
-- 
-- Cara menjalankan:
-- 1. Buka https://supabase.com/dashboard
-- 2. Pilih project: jfpzpwowhuaewxkkxooj
-- 3. Masuk ke SQL Editor
-- 4. Copy paste seluruh isi file ini
-- 5. Jalankan (Run)
--
-- ⚠️  DEPENDENCY: Migration 001 harus sudah dijalankan terlebih dahulu
--     karena tabel ini memiliki foreign key ke customers, orders, services, users.
--
-- ⚠️  CATATAN TENTANG RLS:
--     Sama seperti migration 001, bagian RLS masih di-comment karena
--     aplikasi masih menggunakan anon key langsung. Aktifkan setelah
--     migrasi ke Supabase Auth JWT (lihat rencana v3 di PRD).
-- ==============================================================

-- ==============================================================
-- BAGIAN 1: TABEL appointments (Janji Temu)
-- ==============================================================

CREATE TABLE IF NOT EXISTS appointments (
  id                BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id       BIGINT REFERENCES customers(id) ON DELETE SET NULL,
  service_id        BIGINT REFERENCES services(id) ON DELETE SET NULL,
  user_id           BIGINT REFERENCES users(id) ON DELETE SET NULL,
  patient_name      TEXT NOT NULL,
  appointment_date  DATE NOT NULL,
  appointment_time  TIME,
  doctor_name       TEXT,
  status            TEXT DEFAULT 'scheduled'
                    CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
  source            TEXT DEFAULT 'guest'
                    CHECK (source IN ('guest', 'member', 'admin')),
  notes             TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger updated_at untuk appointments
DROP TRIGGER IF EXISTS trigger_appointments_updated_at ON appointments;
CREATE TRIGGER trigger_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================
-- BAGIAN 2: TABEL medical_records (Rekam Medis Pasien)
-- ==============================================================

CREATE TABLE IF NOT EXISTS medical_records (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id     BIGINT REFERENCES customers(id) ON DELETE CASCADE,
  order_id        BIGINT REFERENCES orders(id) ON DELETE SET NULL,
  tooth_number    INTEGER,
  diagnosis       TEXT NOT NULL,
  treatment       TEXT,
  notes           TEXT,
  record_date     DATE DEFAULT CURRENT_DATE,
  created_by      BIGINT REFERENCES users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger updated_at untuk medical_records
DROP TRIGGER IF EXISTS trigger_medical_records_updated_at ON medical_records;
CREATE TRIGGER trigger_medical_records_updated_at
  BEFORE UPDATE ON medical_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================
-- BAGIAN 3: TABEL points_history (Riwayat Poin Loyalitas)
-- ==============================================================

CREATE TABLE IF NOT EXISTS points_history (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id     BIGINT REFERENCES customers(id) ON DELETE CASCADE,
  order_id        BIGINT REFERENCES orders(id) ON DELETE SET NULL,
  points          INTEGER NOT NULL,
  type            TEXT CHECK (type IN ('earned', 'redeemed', 'expired', 'bonus')),
  description     TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================
-- BAGIAN 4: TRIGGER — Update Tier & Total Orders/S spent 
--            Otomatis Saat Poin Berubah
-- ==============================================================

CREATE OR REPLACE FUNCTION update_customer_tier()
RETURNS TRIGGER AS $$
BEGIN
  -- Update tier, total_orders, dan total_spent berdasarkan poin
  UPDATE customers SET
    tier = CASE
      WHEN NEW.points >= 5000 THEN 'platinum'
      WHEN NEW.points >= 2000 THEN 'gold'
      WHEN NEW.points >= 500  THEN 'silver'
      ELSE 'regular'
    END,
    total_orders = (
      SELECT COUNT(*) FROM orders WHERE customer_id = NEW.id
    ),
    total_spent = (
      SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE customer_id = NEW.id
    )
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_customer_tier ON customers;
CREATE TRIGGER trigger_update_customer_tier
  AFTER UPDATE OF points ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_customer_tier();

-- ==============================================================
-- BAGIAN 5: TRIGGER — Tambah Poin Otomatis Saat 
--            Order Berstatus 'completed'
-- ==============================================================

CREATE OR REPLACE FUNCTION add_points_on_order_completed()
RETURNS TRIGGER AS $$
DECLARE
  v_points INTEGER;
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS DISTINCT FROM 'completed') THEN
    -- 1 poin per Rp1.000 (FLOOR untuk pembulatan ke bawah)
    v_points := FLOOR(NEW.total_amount / 1000);
    
    -- Cegah poin negatif
    IF v_points < 0 THEN
      v_points := 0;
    END IF;
    
    -- Simpan ke points_history
    INSERT INTO points_history (customer_id, order_id, points, type, description)
    VALUES (NEW.customer_id, NEW.id, v_points, 'earned', 
            'Poin dari transaksi #' || NEW.id);
    
    -- Update poin di tabel customers
    UPDATE customers SET points = points + v_points
    WHERE id = NEW.customer_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_add_points_on_completed ON orders;
CREATE TRIGGER trigger_add_points_on_completed
  AFTER UPDATE OF status ON orders
  FOR EACH ROW
  WHEN (NEW.status = 'completed')
  EXECUTE FUNCTION add_points_on_order_completed();

-- ==============================================================
-- BAGIAN 6: TRIGGER — Tambah Poin Saat Order Baru Langsung 
--            Berstatus 'completed' (INSERT)
-- ==============================================================

CREATE OR REPLACE FUNCTION add_points_on_order_insert_completed()
RETURNS TRIGGER AS $$
DECLARE
  v_points INTEGER;
BEGIN
  IF NEW.status = 'completed' THEN
    v_points := FLOOR(NEW.total_amount / 1000);
    
    IF v_points < 0 THEN
      v_points := 0;
    END IF;
    
    INSERT INTO points_history (customer_id, order_id, points, type, description)
    VALUES (NEW.customer_id, NEW.id, v_points, 'earned',
            'Poin dari transaksi #' || NEW.id);
    
    UPDATE customers SET points = points + v_points
    WHERE id = NEW.customer_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_add_points_on_insert_completed ON orders;
CREATE TRIGGER trigger_add_points_on_insert_completed
  AFTER INSERT ON orders
  FOR EACH ROW
  WHEN (NEW.status = 'completed')
  EXECUTE FUNCTION add_points_on_order_insert_completed();

-- ==============================================================
-- BAGIAN 7: INDEXES untuk performa query
-- ==============================================================

-- Appointments
CREATE INDEX IF NOT EXISTS idx_appointments_customer_id   ON appointments(customer_id);
CREATE INDEX IF NOT EXISTS idx_appointments_service_id    ON appointments(service_id);
CREATE INDEX IF NOT EXISTS idx_appointments_user_id       ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date          ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status        ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_source        ON appointments(source);

-- Medical Records
CREATE INDEX IF NOT EXISTS idx_medical_records_customer_id ON medical_records(customer_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_order_id    ON medical_records(order_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_date        ON medical_records(record_date);

-- Points History
CREATE INDEX IF NOT EXISTS idx_points_history_customer_id  ON points_history(customer_id);
CREATE INDEX IF NOT EXISTS idx_points_history_order_id     ON points_history(order_id);
CREATE INDEX IF NOT EXISTS idx_points_history_type         ON points_history(type);

-- ==============================================================
-- BAGIAN 8: ROW LEVEL SECURITY (RLS) — DIKOMMENTAR
--            Aktifkan setelah migrasi ke Supabase Auth JWT
-- ==============================================================

-- ╔══════════════════════════════════════════════════════════════╗
-- ║  UNCOMMENT BAGIAN INI SETELAH MIGRASI KE SUPABASE AUTH     ║
-- ║  (ketika menggunakan @supabase/supabase-js + JWT login)    ║
-- ╚══════════════════════════════════════════════════════════════╝

-- /*
-- ========== APPOINTMENTS ==========
-- ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
-- 
-- DROP POLICY IF EXISTS "Admin SELECT all appointments" ON appointments;
-- CREATE POLICY "Admin SELECT all appointments" ON appointments
--   FOR SELECT USING (
--     (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
--   );
-- 
-- DROP POLICY IF EXISTS "Member SELECT own appointments" ON appointments;
-- CREATE POLICY "Member SELECT own appointments" ON appointments
--   FOR SELECT USING (
--     customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
--   );
-- 
-- DROP POLICY IF EXISTS "Guest INSERT appointments" ON appointments;
-- CREATE POLICY "Guest INSERT appointments" ON appointments
--   FOR INSERT WITH CHECK (
--     auth.role() = 'anon'
--   );
-- 
-- DROP POLICY IF EXISTS "Admin INSERT appointments" ON appointments;
-- CREATE POLICY "Admin INSERT appointments" ON appointments
--   FOR INSERT WITH CHECK (
--     (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
--   );
-- 
-- DROP POLICY IF EXISTS "Admin UPDATE appointments" ON appointments;
-- CREATE POLICY "Admin UPDATE appointments" ON appointments
--   FOR UPDATE USING (
--     (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
--   );
-- 
-- DROP POLICY IF EXISTS "Admin DELETE appointments" ON appointments;
-- CREATE POLICY "Admin DELETE appointments" ON appointments
--   FOR DELETE USING (
--     (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
--   );
-- 
-- ========== MEDICAL RECORDS ==========
-- ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
-- 
-- DROP POLICY IF EXISTS "Admin ALL medical_records" ON medical_records;
-- CREATE POLICY "Admin ALL medical_records" ON medical_records
--   FOR ALL USING (
--     (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
--   );
-- 
-- DROP POLICY IF EXISTS "Member SELECT own medical_records" ON medical_records;
-- CREATE POLICY "Member SELECT own medical_records" ON medical_records
--   FOR SELECT USING (
--     customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
--   );
-- 
-- ========== POINTS HISTORY ==========
-- ALTER TABLE points_history ENABLE ROW LEVEL SECURITY;
-- 
-- DROP POLICY IF EXISTS "Admin ALL points_history" ON points_history;
-- CREATE POLICY "Admin ALL points_history" ON points_history
--   FOR ALL USING (
--     (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
--   );
-- 
-- DROP POLICY IF EXISTS "Member SELECT own points" ON points_history;
-- CREATE POLICY "Member SELECT own points" ON points_history
--   FOR SELECT USING (
--     customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
--   );
-- 
-- ========== ORDERS (tambahan untuk Guest) ==========
-- DROP POLICY IF EXISTS "Guest INSERT orders" ON orders;
-- CREATE POLICY "Guest INSERT orders" ON orders
--   FOR INSERT WITH CHECK (
--     auth.role() = 'anon'
--   );
-- 
-- ========== CUSTOMERS (tambahan untuk Guest) ==========
-- DROP POLICY IF EXISTS "Guest INSERT customers" ON customers;
-- CREATE POLICY "Guest INSERT customers" ON customers
--   FOR INSERT WITH CHECK (
--     auth.role() = 'anon'
--   );
-- */

-- ==============================================================
-- BAGIAN 9: SEED DATA — Sample Appointments (untuk development)
-- ==============================================================

INSERT INTO appointments (patient_name, appointment_date, appointment_time, doctor_name, status, source, notes)
SELECT
  'Pasien Demo ' || gs AS patient_name,
  CURRENT_DATE + (gs % 30)::INT AS appointment_date,
  CASE (gs % 4)
    WHEN 0 THEN '09:00'::TIME
    WHEN 1 THEN '10:30'::TIME
    WHEN 2 THEN '13:00'::TIME
    WHEN 3 THEN '14:30'::TIME
  END AS appointment_time,
  CASE (gs % 3)
    WHEN 0 THEN 'drg. Fauzan, Sp.RKG'
    WHEN 1 THEN 'drg. Sarah Amelia'
    WHEN 2 THEN 'drg. Budi Hartono, Sp.Ort'
  END AS doctor_name,
  CASE (gs % 4)
    WHEN 0 THEN 'scheduled'
    WHEN 1 THEN 'completed'
    WHEN 2 THEN 'cancelled'
    WHEN 3 THEN 'scheduled'
  END AS status,
  'guest' AS source,
  'Data seed development' AS notes
FROM generate_series(1, 10) AS gs;
