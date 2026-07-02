-- ==============================================================
-- MIGRASI 003: Row Level Security (RLS) — Semua Tabel
-- Database: Supabase (PostgreSQL)
--
-- Cara menjalankan:
-- 1. Buka https://supabase.com/dashboard
-- 2. Pilih project: jfpzpwowhuaewxkkxooj
-- 3. Masuk ke SQL Editor
-- 4. Copy paste seluruh isi file ini → Run
--
-- ⚠️  DEPENDENCY: Migration 001 & 002 harus sudah dijalankan.
--
-- ==============================================================
-- ⚠️  PENTING — DUA TAHAP AKTIVASI:
-- ==============================================================
--
-- TAHAP A (Guest Flow — Bisa Langsung Dijalankan Sekarang):
--   Policy untuk role 'anon' (Guest) sudah bisa berfungsi dengan
--   setup anon key saat ini. Guest bisa:
--   • Melihat katalog services
--   • Mendaftar (INSERT) ke tabel customers
--   • Membuat reservasi (INSERT) ke appointments
--
-- TAHAP B (Admin & Member — Butuh Supabase Auth JWT):
--   Policy untuk 'authenticated' membutuhkan JWT dari Supabase Auth.
--   Saat ini app menggunakan custom auth (localStorage + users table)
--   dengan anon key — ini TIDAK kompatibel dengan auth.uid().
--
--   ✅ Guest INSERT langsung berfungsi setelah RLS di-enable.
--   ⏳ Admin & Member SELECT/UPDATE/DELETE baru berfungsi setelah
--      app migrasi ke @supabase/supabase-js + signInWithPassword().
--
--   Lihat file 004_migrate_to_supabase_auth.md untuk panduan migrasi.
--
-- ==============================================================

-- ==============================================================
-- BAGIAN 0: PERSIAPAN — Tambah kolom auth_id ke tabel users
-- ==============================================================
--
-- ⚠️  KRITIS: auth.uid() mengembalikan UUID, sedangkan users.id BIGINT.
--      Casting langsung (auth.uid()::BIGINT) akan crash.
--      Solusi: kolom auth_id UUID yang merujuk ke auth.users(id).
--

ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL;

-- ==============================================================
-- BAGIAN 1: ENABLE RLS — Semua Tabel
-- ==============================================================

ALTER TABLE IF EXISTS customers       ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS services        ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS orders          ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS appointments    ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS points_history  ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS users           ENABLE ROW LEVEL SECURITY;

-- ==============================================================
-- BAGIAN 2: TABEL customers
-- ==============================================================

-- Admin: SELECT, INSERT, UPDATE, DELETE
DROP POLICY IF EXISTS "Admin ALL customers" ON customers;
CREATE POLICY "Admin ALL customers" ON customers
  FOR ALL USING (
    auth.role() = 'authenticated'
    AND (SELECT role FROM users WHERE auth_id = auth.uid()) = 'admin'
  );

-- Member: SELECT data dirinya sendiri
DROP POLICY IF EXISTS "Member SELECT customers" ON customers;
CREATE POLICY "Member SELECT customers" ON customers
  FOR SELECT USING (
    auth.role() = 'authenticated'
    AND user_id = (SELECT id FROM users WHERE auth_id = auth.uid())
  );

-- Member: UPDATE data dirinya sendiri (alamat, no telepon, dll)
DROP POLICY IF EXISTS "Member UPDATE customers" ON customers;
CREATE POLICY "Member UPDATE customers" ON customers
  FOR UPDATE USING (
    auth.role() = 'authenticated'
    AND user_id = (SELECT id FROM users WHERE auth_id = auth.uid())
  ) WITH CHECK (
    auth.role() = 'authenticated'
    AND user_id = (SELECT id FROM users WHERE auth_id = auth.uid())
  );

-- Guest: INSERT (registrasi dari landing page / form reservasi)
DROP POLICY IF EXISTS "Guest INSERT customers" ON customers;
CREATE POLICY "Guest INSERT customers" ON customers
  FOR INSERT WITH CHECK (
    auth.role() = 'anon'
  );

-- ==============================================================
-- BAGIAN 3: TABEL services
-- ==============================================================

-- Semua role: SELECT (katalog publik & internal)
DROP POLICY IF EXISTS "All SELECT services" ON services;
CREATE POLICY "All SELECT services" ON services
  FOR SELECT USING (
    auth.role() IN ('anon', 'authenticated')
  );

-- Admin: INSERT
DROP POLICY IF EXISTS "Admin INSERT services" ON services;
CREATE POLICY "Admin INSERT services" ON services
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated'
    AND (SELECT role FROM users WHERE auth_id = auth.uid()) = 'admin'
  );

-- Admin: UPDATE
DROP POLICY IF EXISTS "Admin UPDATE services" ON services;
CREATE POLICY "Admin UPDATE services" ON services
  FOR UPDATE USING (
    auth.role() = 'authenticated'
    AND (SELECT role FROM users WHERE auth_id = auth.uid()) = 'admin'
  );

-- Admin: DELETE
DROP POLICY IF EXISTS "Admin DELETE services" ON services;
CREATE POLICY "Admin DELETE services" ON services
  FOR DELETE USING (
    auth.role() = 'authenticated'
    AND (SELECT role FROM users WHERE auth_id = auth.uid()) = 'admin'
  );

-- ==============================================================
-- BAGIAN 4: TABEL orders
-- ==============================================================

-- Admin: ALL operations
DROP POLICY IF EXISTS "Admin ALL orders" ON orders;
CREATE POLICY "Admin ALL orders" ON orders
  FOR ALL USING (
    auth.role() = 'authenticated'
    AND (SELECT role FROM users WHERE auth_id = auth.uid()) = 'admin'
  );

-- Member: SELECT orders miliknya
DROP POLICY IF EXISTS "Member SELECT orders" ON orders;
CREATE POLICY "Member SELECT orders" ON orders
  FOR SELECT USING (
    auth.role() = 'authenticated'
    AND customer_id IN (
      SELECT id FROM customers
      WHERE user_id = (SELECT id FROM users WHERE auth_id = auth.uid())
    )
  );

-- Member: INSERT orders (booking layanan)
DROP POLICY IF EXISTS "Member INSERT orders" ON orders;
CREATE POLICY "Member INSERT orders" ON orders
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated'
    AND customer_id IN (
      SELECT id FROM customers
      WHERE user_id = (SELECT id FROM users WHERE auth_id = auth.uid())
    )
  );

-- Guest: INSERT orders (guest checkout dari landing page)
DROP POLICY IF EXISTS "Guest INSERT orders" ON orders;
CREATE POLICY "Guest INSERT orders" ON orders
  FOR INSERT WITH CHECK (
    auth.role() = 'anon'
  );

-- ==============================================================
-- BAGIAN 5: TABEL appointments
-- ==============================================================

-- Admin: ALL operations
DROP POLICY IF EXISTS "Admin ALL appointments" ON appointments;
CREATE POLICY "Admin ALL appointments" ON appointments
  FOR ALL USING (
    auth.role() = 'authenticated'
    AND (SELECT role FROM users WHERE auth_id = auth.uid()) = 'admin'
  );

-- Member: SELECT appointment miliknya
DROP POLICY IF EXISTS "Member SELECT appointments" ON appointments;
CREATE POLICY "Member SELECT appointments" ON appointments
  FOR SELECT USING (
    auth.role() = 'authenticated'
    AND customer_id IN (
      SELECT id FROM customers
      WHERE user_id = (SELECT id FROM users WHERE auth_id = auth.uid())
    )
  );

-- Member: INSERT appointment (booking prioritas dari portal member)
DROP POLICY IF EXISTS "Member INSERT appointments" ON appointments;
CREATE POLICY "Member INSERT appointments" ON appointments
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated'
    AND customer_id IN (
      SELECT id FROM customers
      WHERE user_id = (SELECT id FROM users WHERE auth_id = auth.uid())
    )
  );

-- Guest: INSERT appointment (reservasi dari landing page publik)
DROP POLICY IF EXISTS "Guest INSERT appointments" ON appointments;
CREATE POLICY "Guest INSERT appointments" ON appointments
  FOR INSERT WITH CHECK (
    auth.role() = 'anon'
  );

-- ==============================================================
-- BAGIAN 6: TABEL medical_records
-- ==============================================================

-- Admin: ALL operations
DROP POLICY IF EXISTS "Admin ALL medical_records" ON medical_records;
CREATE POLICY "Admin ALL medical_records" ON medical_records
  FOR ALL USING (
    auth.role() = 'authenticated'
    AND (SELECT role FROM users WHERE auth_id = auth.uid()) = 'admin'
  );

-- Member: SELECT rekam medis miliknya
DROP POLICY IF EXISTS "Member SELECT medical_records" ON medical_records;
CREATE POLICY "Member SELECT medical_records" ON medical_records
  FOR SELECT USING (
    auth.role() = 'authenticated'
    AND customer_id IN (
      SELECT id FROM customers
      WHERE user_id = (SELECT id FROM users WHERE auth_id = auth.uid())
    )
  );

-- ==============================================================
-- BAGIAN 7: TABEL points_history
-- ==============================================================

-- Admin: ALL operations
DROP POLICY IF EXISTS "Admin ALL points_history" ON points_history;
CREATE POLICY "Admin ALL points_history" ON points_history
  FOR ALL USING (
    auth.role() = 'authenticated'
    AND (SELECT role FROM users WHERE auth_id = auth.uid()) = 'admin'
  );

-- Member: SELECT riwayat poin miliknya
DROP POLICY IF EXISTS "Member SELECT points_history" ON points_history;
CREATE POLICY "Member SELECT points_history" ON points_history
  FOR SELECT USING (
    auth.role() = 'authenticated'
    AND customer_id IN (
      SELECT id FROM customers
      WHERE user_id = (SELECT id FROM users WHERE auth_id = auth.uid())
    )
  );

-- ==============================================================
-- BAGIAN 8: TABEL users (Sistem Autentikasi)
-- ==============================================================

-- Admin: ALL operations (mengelola akun)
DROP POLICY IF EXISTS "Admin ALL users" ON users;
CREATE POLICY "Admin ALL users" ON users
  FOR ALL USING (
    auth.role() = 'authenticated'
    AND (SELECT role FROM users WHERE auth_id = auth.uid()) = 'admin'
  );

-- Member: SELECT data dirinya sendiri
DROP POLICY IF EXISTS "Member SELECT users" ON users;
CREATE POLICY "Member SELECT users" ON users
  FOR SELECT USING (
    auth.role() = 'authenticated'
    AND auth_id = auth.uid()
  );

-- Member: UPDATE password & profil sendiri
DROP POLICY IF EXISTS "Member UPDATE users" ON users;
CREATE POLICY "Member UPDATE users" ON users
  FOR UPDATE USING (
    auth.role() = 'authenticated'
    AND auth_id = auth.uid()
  ) WITH CHECK (
    auth.role() = 'authenticated'
    AND auth_id = auth.uid()
  );

-- Guest: INSERT (registrasi akun baru)
DROP POLICY IF EXISTS "Guest INSERT users" ON users;
CREATE POLICY "Guest INSERT users" ON users
  FOR INSERT WITH CHECK (
    auth.role() = 'anon'
  );

-- ==============================================================
-- BAGIAN 9: VERIFIKASI — Cek daftar policy yang aktif
-- ==============================================================

-- Jalankan query berikut untuk melihat status RLS:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
-- FROM pg_policies
-- WHERE tablename IN ('customers','services','orders','appointments','medical_records','points_history','users')
-- ORDER BY tablename, policyname;
