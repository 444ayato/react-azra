-- ==============================================================
-- MIGRASI 005: PRD v3 — Full Schema Restructure
-- Database: Supabase (PostgreSQL)
--
-- 🔴 PENTING — BACA SEBELUM MENJALANKAN:
--   Migration ini MENGGANTI schema lama (tabel BIGINT) dengan
--   schema baru (UUID + auth.users). Semua tabel lama akan
--   DROP jika ada.
--
--   Table mapping:
--     users       → profiles (UUID, FK auth.users)
--     customers   → patients (UUID)
--     orders      → (dihapus, diganti via CRM)
--     points_history → points (UUID, 1-to-1 dengan profiles)
--     appointments  → appointments (UUID, diremake)
--     medical_records → medical_records (UUID, diremake)
--     services    → services (tetap dipertahankan, BIGINT)
--
-- Cara menjalankan:
--   1. Buka https://supabase.com/dashboard
--   2. Pilih project: jfpzpwowhuaewxkkxooj
--   3. Masuk ke SQL Editor
--   4. HAPUS / NONAKTIFKAN semua triggers & policies dulu
--      yang mereferensi tabel lama.
--   5. Copy paste seluruh isi file ini
--   6. Jalankan (Run)
-- ==============================================================

-- ==============================================================
-- BAGIAN 0: NONAKTIFKAN RLS LAMA & DROP TABEL LAMA
-- ==============================================================

-- Nonaktifkan RLS di tabel lama
ALTER TABLE IF EXISTS customers DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS orders DISPLAY ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS points_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS appointments DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS medical_records DISABLE ROW LEVEL SECURITY;

-- Drop policies lama
DROP POLICY IF EXISTS "Admin ALL customers" ON customers;
DROP POLICY IF EXISTS "Member SELECT customers" ON customers;
DROP POLICY IF EXISTS "Member UPDATE customers" ON customers;
DROP POLICY IF EXISTS "Guest INSERT customers" ON customers;
DROP POLICY IF EXISTS "Admin ALL orders" ON orders;
DROP POLICY IF EXISTS "Member SELECT orders" ON orders;
DROP POLICY IF EXISTS "Member INSERT orders" ON orders;
DROP POLICY IF EXISTS "Guest INSERT orders" ON orders;
DROP POLICY IF EXISTS "Admin ALL appointments" ON appointments;
DROP POLICY IF EXISTS "Member SELECT appointments" ON appointments;
DROP POLICY IF EXISTS "Member INSERT appointments" ON appointments;
DROP POLICY IF EXISTS "Guest INSERT appointments" ON appointments;
DROP POLICY IF EXISTS "Admin ALL medical_records" ON medical_records;
DROP POLICY IF EXISTS "Member SELECT medical_records" ON medical_records;
DROP POLICY IF EXISTS "Admin ALL points_history" ON points_history;
DROP POLICY IF EXISTS "Member SELECT points_history" ON points_history;
DROP POLICY IF EXISTS "Admin ALL users" ON users;
DROP POLICY IF EXISTS "Member SELECT users" ON users;
DROP POLICY IF EXISTS "Member UPDATE users" ON users;
DROP POLICY IF EXISTS "Guest INSERT users" ON users;

-- Drop triggers lama
DROP TRIGGER IF EXISTS trigger_update_customer_tier ON customers;
DROP TRIGGER IF EXISTS trigger_add_points_on_completed ON orders;
DROP TRIGGER IF EXISTS trigger_add_points_on_insert_completed ON orders;

-- Drop function lama
DROP FUNCTION IF EXISTS update_customer_tier();
DROP FUNCTION IF EXISTS add_points_on_order_completed();
DROP FUNCTION IF EXISTS add_points_on_order_insert_completed();

-- Drop tabel lama (urutkan berdasarkan FK)
DROP TABLE IF EXISTS points_history CASCADE;
DROP TABLE IF EXISTS medical_records CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ==============================================================
-- BAGIAN 1: TABEL profiles (Ekstensi Data User Auth)
-- ==============================================================

CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================
-- BAGIAN 2: TABEL points (Sistem Poin & Tiering)
-- ==============================================================

CREATE TABLE points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    total_points INT DEFAULT 0,
    current_tier TEXT DEFAULT 'Bronze' CHECK (current_tier IN ('Bronze', 'Silver', 'Gold')),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trigger_points_updated_at
    BEFORE UPDATE ON points
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================
-- BAGIAN 3: TABEL patients (Konsolidasi CRM)
-- ==============================================================

CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trigger_patients_updated_at
    BEFORE UPDATE ON patients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================
-- BAGIAN 4: TABEL appointments (Reservasi)
-- ==============================================================

CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    service_name TEXT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trigger_appointments_updated_at
    BEFORE UPDATE ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================
-- BAGIAN 5: TABEL medical_records (Rekam Medis)
-- ==============================================================

CREATE TABLE medical_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    dentist_name TEXT NOT NULL,
    diagnosis TEXT NOT NULL,
    treatment TEXT NOT NULL,
    points_awarded INT DEFAULT 100,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trigger_medical_records_updated_at
    BEFORE UPDATE ON medical_records
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================
-- BAGIAN 6: ROW LEVEL SECURITY (RLS)
-- ==============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE points ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;

-- ===== PROFILES =====
CREATE POLICY "Users view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users insert own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Admin full access profiles"
    ON profiles FOR ALL
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ===== POINTS =====
CREATE POLICY "Users view own points"
    ON points FOR SELECT
    USING (auth.uid() = profile_id);

CREATE POLICY "Admin full access points"
    ON points FOR ALL
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ===== PATIENTS =====
CREATE POLICY "Public insert patients"
    ON patients FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Members view own patient data"
    ON patients FOR SELECT
    USING (profile_id = auth.uid());

CREATE POLICY "Admin full access patients"
    ON patients FOR ALL
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ===== APPOINTMENTS =====
CREATE POLICY "Anyone insert appointments"
    ON appointments FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Members view own appointments"
    ON appointments FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM patients
        WHERE patients.id = appointments.patient_id
        AND patients.profile_id = auth.uid()
    ));

CREATE POLICY "Admin full access appointments"
    ON appointments FOR ALL
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ===== MEDICAL RECORDS =====
CREATE POLICY "Members view own medical records"
    ON medical_records FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM patients
        WHERE patients.id = medical_records.patient_id
        AND patients.profile_id = auth.uid()
    ));

CREATE POLICY "Admin full access medical records"
    ON medical_records FOR ALL
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ==============================================================
-- BAGIAN 7: TRIGGER — Otomatisasi Poin & Tier
-- ==============================================================

CREATE OR REPLACE FUNCTION handle_points_and_tiering()
RETURNS TRIGGER AS $$
DECLARE
    target_profile_id UUID;
    current_total INT;
    new_tier TEXT;
BEGIN
    -- Cari profile_id dari patient ini
    SELECT profile_id INTO target_profile_id FROM patients WHERE id = NEW.patient_id;

    IF target_profile_id IS NOT NULL THEN
        -- Inisialisasi baris points jika belum ada
        INSERT INTO points (profile_id, total_points, current_tier)
        VALUES (target_profile_id, 0, 'Bronze')
        ON CONFLICT (profile_id) DO NOTHING;

        -- Tambah poin
        UPDATE points
        SET total_points = total_points + NEW.points_awarded,
            updated_at = NOW()
        WHERE profile_id = target_profile_id
        RETURNING total_points INTO current_total;

        -- Logika Tier: Bronze < 300, Silver >= 300, Gold >= 700
        IF current_total >= 700 THEN
            new_tier := 'Gold';
        ELSIF current_total >= 300 THEN
            new_tier := 'Silver';
        ELSE
            new_tier := 'Bronze';
        END IF;

        UPDATE points SET current_tier = new_tier WHERE profile_id = target_profile_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_medical_record_added
    AFTER INSERT ON medical_records
    FOR EACH ROW
    EXECUTE FUNCTION handle_points_and_tiering();

-- ==============================================================
-- BAGIAN 8: INDEXES
-- ==============================================================

CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_points_profile_id ON points(profile_id);
CREATE INDEX IF NOT EXISTS idx_points_tier ON points(current_tier);
CREATE INDEX IF NOT EXISTS idx_patients_profile_id ON patients(profile_id);
CREATE INDEX IF NOT EXISTS idx_patients_phone ON patients(phone);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_medical_records_patient_id ON medical_records(patient_id);

-- ==============================================================
-- BAGIAN 9: VERIFIKASI
-- ==============================================================

-- SELECT schemaname, tablename, policyname, permissive, roles, cmd
-- FROM pg_policies
-- WHERE tablename IN ('profiles','points','patients','appointments','medical_records')
-- ORDER BY tablename, policyname;
