-- ==============================================================
-- MIGRASI 001: Membuat Tabel Customers, Services & Orders
-- Database: Supabase (PostgreSQL)
-- 
-- Cara menjalankan:
-- 1. Buka https://supabase.com/dashboard
-- 2. Pilih project: jfpzpwowhuaewxkkxooj
-- 3. Masuk ke SQL Editor
-- 4. Copy paste seluruh isi file ini
-- 5. Jalankan (Run)
--
-- ⚠️  CATATAN PENTING TENTANG RLS:
--     Aplikasi saat ini menggunakan anon key langsung (lihat src/services/api.js).
--     Dengan setup ini, semua request ke Supabase dianggap sebagai user ANONYMOUS.
--     Fungsi auth.uid() dan auth.role() hanya berfungsi dengan Supabase Auth JWT.
--
--     OPSI YANG DIREKOMENDASIKAN:
--     A. (Jangka pendek) Abaikan bagian RLS — jalankan hanya CREATE TABLE, TRIGGER,
--        dan SEED DATA. Kontrol akses dilakukan di level aplikasi (React).
--     B. (Jangka panjang) Migrasikan ke Supabase Auth, gunakan
--        supabase.auth.signInWithPassword() dari @supabase/supabase-js,
--        maka auth.uid() akan otomatis bekerja.
--
--     Pilih Opsi A untuk development hari ini.
-- ==============================================================

-- ==============================================================
-- BAGIAN 1: HELPER FUNCTION — updated_at trigger
-- ==============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================
-- BAGIAN 2: TABEL customers
-- ==============================================================

CREATE TABLE IF NOT EXISTS customers (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id       BIGINT REFERENCES users(id) ON DELETE SET NULL,
  full_name     TEXT NOT NULL,
  email         TEXT,
  phone         TEXT,
  address       TEXT,
  birth_date    DATE,
  gender        TEXT CHECK (gender IN ('L', 'P')),
  points        INTEGER DEFAULT 0,
  tier          TEXT DEFAULT 'regular' CHECK (tier IN ('regular', 'silver', 'gold', 'platinum')),
  total_orders  INTEGER DEFAULT 0,
  total_spent   NUMERIC(12,2) DEFAULT 0,
  notes         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger updated_at untuk customers
DROP TRIGGER IF EXISTS trigger_customers_updated_at ON customers;
CREATE TRIGGER trigger_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================
-- BAGIAN 3: TABEL services
-- ==============================================================

CREATE TABLE IF NOT EXISTS services (
  id               BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name             TEXT NOT NULL,
  description      TEXT,
  price            NUMERIC(12,2) NOT NULL,
  duration_minutes INTEGER,
  category         TEXT,
  is_active        BOOLEAN DEFAULT TRUE,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger updated_at untuk services
DROP TRIGGER IF EXISTS trigger_services_updated_at ON services;
CREATE TRIGGER trigger_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================
-- BAGIAN 4: TABEL orders
-- ==============================================================

CREATE TABLE IF NOT EXISTS orders (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id   BIGINT REFERENCES customers(id) ON DELETE SET NULL,
  service_id    BIGINT REFERENCES services(id) ON DELETE SET NULL,
  user_id       BIGINT REFERENCES users(id) ON DELETE SET NULL,
  status        TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  total_amount  NUMERIC(12,2) NOT NULL,
  points_earned INTEGER DEFAULT 0,
  notes         TEXT,
  order_date    DATE DEFAULT CURRENT_DATE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger updated_at untuk orders
DROP TRIGGER IF EXISTS trigger_orders_updated_at ON orders;
CREATE TRIGGER trigger_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================
-- BAGIAN 5: ROW LEVEL SECURITY (RLS) — UNTUK SETUP SAAT INI
-- ==============================================================
--
-- ⚠️  Dengan setup anon key, ENABLE RLS akan MEMBLOKIR SEMUA akses
--     karena auth.uid() mengembalikan null untuk user anonymous.
--
--     Untuk development, JANGAN aktifkan RLS dulu.
--     Cukup jalankan script CREATE TABLE + SEED tanpa bagian ini.
--
--     Ketika sudah migrasi ke Supabase Auth, gunakan script di
--     BAGIAN 5B (comment) untuk mengaktifkan RLS.
--
-- ==============================================================

-- ╔══════════════════════════════════════════════════════════════╗
-- ║  UNCOMMENT BAGIAN INI SETELAH MIGRASI KE SUPABASE AUTH     ║
-- ║  (ketika menggunakan @supabase/supabase-js + JWT login)    ║
-- ╚══════════════════════════════════════════════════════════════╝

-- /*
-- Aktifkan RLS di semua tabel
-- ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE services  ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE orders    ENABLE ROW LEVEL SECURITY;
-- 
-- ---------- CUSTOMERS ----------
-- 
-- DROP POLICY IF EXISTS "Admin dapat membaca semua customers" ON customers;
-- CREATE POLICY "Admin dapat membaca semua customers" ON customers
--   FOR SELECT
--   USING (
--     (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
--   );
-- 
-- DROP POLICY IF EXISTS "Member membaca data dirinya sendiri" ON customers;
-- CREATE POLICY "Member membaca data dirinya sendiri" ON customers
--   FOR SELECT
--   USING (
--     user_id = auth.uid()
--   );
-- 
-- DROP POLICY IF EXISTS "Admin dapat membuat customers" ON customers;
-- CREATE POLICY "Admin dapat membuat customers" ON customers
--   FOR INSERT
--   WITH CHECK (
--     (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
--   );
-- 
-- DROP POLICY IF EXISTS "Admin dapat mengupdate customers" ON customers;
-- CREATE POLICY "Admin dapat mengupdate customers" ON customers
--   FOR UPDATE
--   USING (
--     (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
--   );
-- 
-- DROP POLICY IF EXISTS "Admin dapat menghapus customers" ON customers;
-- CREATE POLICY "Admin dapat menghapus customers" ON customers
--   FOR DELETE
--   USING (
--     (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
--   );
-- 
-- ---------- SERVICES ----------
-- 
-- DROP POLICY IF EXISTS "Semua user dapat membaca services" ON services;
-- CREATE POLICY "Semua user dapat membaca services" ON services
--   FOR SELECT
--   USING (
--     auth.role() = 'authenticated'
--   );
-- 
-- DROP POLICY IF EXISTS "Admin dapat membuat services" ON services;
-- CREATE POLICY "Admin dapat membuat services" ON services
--   FOR INSERT
--   WITH CHECK (
--     (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
--   );
-- 
-- DROP POLICY IF EXISTS "Admin dapat mengupdate services" ON services;
-- CREATE POLICY "Admin dapat mengupdate services" ON services
--   FOR UPDATE
--   USING (
--     (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
--   );
-- 
-- DROP POLICY IF EXISTS "Admin dapat menghapus services" ON services;
-- CREATE POLICY "Admin dapat menghapus services" ON services
--   FOR DELETE
--   USING (
--     (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
--   );
-- 
-- ---------- ORDERS ----------
-- 
-- DROP POLICY IF EXISTS "Admin dapat membaca semua orders" ON orders;
-- CREATE POLICY "Admin dapat membaca semua orders" ON orders
--   FOR SELECT
--   USING (
--     (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
--   );
-- 
-- DROP POLICY IF EXISTS "Member membaca orders miliknya" ON orders;
-- CREATE POLICY "Member membaca orders miliknya" ON orders
--   FOR SELECT
--   USING (
--     customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
--   );
-- 
-- DROP POLICY IF EXISTS "Admin dapat membuat orders" ON orders;
-- CREATE POLICY "Admin dapat membuat orders" ON orders
--   FOR INSERT
--   WITH CHECK (
--     (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
--   );
-- 
-- DROP POLICY IF EXISTS "Member dapat membuat orders sendiri" ON orders;
-- CREATE POLICY "Member dapat membuat orders sendiri" ON orders
--   FOR INSERT
--   WITH CHECK (
--     customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
--   );
-- 
-- DROP POLICY IF EXISTS "Admin dapat mengupdate orders" ON orders;
-- CREATE POLICY "Admin dapat mengupdate orders" ON orders
--   FOR UPDATE
--   USING (
--     (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
--   );
-- 
-- DROP POLICY IF EXISTS "Admin dapat menghapus orders" ON orders;
-- CREATE POLICY "Admin dapat menghapus orders" ON orders
--   FOR DELETE
--   USING (
--     (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
--   );
-- */

-- ==============================================================
-- BAGIAN 6: SEED DATA — Layanan Klinik Gigi
-- ==============================================================

INSERT INTO services (name, description, price, duration_minutes, category) VALUES
  ('Pemeriksaan Gigi Umum',           'Konsultasi dan pemeriksaan kondisi gigi dan mulut secara menyeluruh',                         100000,  30, 'Umum'),
  ('Pembersihan Karang Gigi (Scaling)','Prosedur scaling untuk membersihkan karang dan plak gigi',                                  250000,  60, 'Perawatan'),
  ('Penambalan Komposit Estetis',     'Penambalan gigi dengan bahan komposit sewarna gigi',                                       350000,  60, 'Restorasi'),
  ('Pencabutan Gigi Biasa',           'Pencabutan gigi permanen dengan anestesi lokal',                                           200000,  45, 'Bedah'),
  ('Pencabutan Gigi Bungsu (Odonektomi)','Pencabutan gigi bungsu impaksi dengan prosedur bedah minor',                           800000,  120, 'Bedah'),
  ('Pemasangan Brackets Ortodonti',   'Pemasangan bracket untuk perawatan behel gigi (per rahang)',                               3000000, 120, 'Ortodonti'),
  ('Kontrol Behel (Adjustment)',      'Penyesuaian dan pengencangan behel secara berkala',                                        300000,  45, 'Ortodonti'),
  ('Bleaching Gigi (Putihkan)',       'Perawatan pemutihan gigi dengan bahan aman',                                               500000,  90, 'Estetika'),
  ('Veneer Gigi (per gigi)',          'Pemasangan veneer porselen untuk estetika gigi depan',                                    1500000, 120, 'Estetika'),
  ('Perawatan Saluran Akar',          'Perawatan saraf gigi (root canal) untuk gigi berlubang parah',                             600000,  90, 'Restorasi'),
  ('Pasang Mahkota Gigi (Crown)',     'Pemasangan crown porselen untuk melindungi gigi yang rapuh',                               2000000, 120, 'Restorasi'),
  ('Gigi Tiruan Sebagian (GTS)',      'Pembuatan gigi tiruan lepasan sebagian',                                                   1200000, null, 'Prostodonsia'),
  ('Cabut Gigi Anak',                 'Pencabutan gigi susu pada anak-anak',                                                       100000,  30, 'Pedodonti'),
  ('Topikal Fluoride',                'Aplikasi fluoride untuk pencegahan karies pada anak',                                      80000,   20, 'Pedodonti'),
  ('Sinar Rontgen Panoramik',         'Foto rontgen panoramic untuk diagnosis menyeluruh',                                        200000,  15, 'Diagnostik');

-- ==============================================================
-- BAGIAN 7 (OPSIONAL): INDEXES untuk performa query
-- ==============================================================

CREATE INDEX IF NOT EXISTS idx_customers_user_id    ON customers(user_id);
CREATE INDEX IF NOT EXISTS idx_customers_tier       ON customers(tier);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id   ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_service_id    ON orders(service_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id       ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status        ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_date    ON orders(order_date);
CREATE INDEX IF NOT EXISTS idx_services_category    ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_is_active   ON services(is_active);
