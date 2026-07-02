# Product Requirements Document (PRD)
## Azra Dental Care — Sistem Manajemen CRM Klinik Gigi

**Versi Dokumen:** 1.0  
**Tanggal:** 2 Juli 2026  
**Status:** Draft — Siap Implementasi  
**Stack Teknologi:** React JS, Supabase (PostgreSQL), Tailwind CSS, Radix UI  

---

## Daftar Isi

1. [Ringkasan Eksekutif](#1-ringkasan-eksekutif)
2. [Evolusi Fungsionalitas (v1–v3)](#2-evolusi-fungsionalitas-v1v3)
3. [Arsitektur Halaman & Role](#3-arsitektur-halaman--role)
4. [Desain Database](#4-desain-database)
5. [Relasi Antar Tabel](#5-relasi-antar-tabel)
6. [Row Level Security (RLS)](#6-row-level-security-rls)
7. [Sistem Poin, Riwayat & Tier Member](#7-sistem-poin-riwayat--tier-member)
8. [Rencana Implementasi Bertahap](#8-rencana-implementasi-bertahap)
9. [Lampiran: Status Proyek Saat Ini](#9-lampiran-status-proyek-saat-ini)

---

## 1. Ringkasan Eksekutif

Azra Dental Care membutuhkan sistem Customer Relationship Management (CRM) terintegrasi yang melayani tiga kelompok pengguna:

| Role | Deskripsi | Akses |
|------|-----------|-------|
| **Guest** | Pengunjung publik (tanpa login) | Landing page, katalog harga, form reservasi |
| **Member** | Pasien terdaftar (login) | Portal personal, odontogram, booking prioritas, riwayat & poin |
| **Admin** | Staf klinik (login) | Dashboard, CRUD data, CRM pasien, laporan |

**Tujuan:** Menggantikan data statis (JSON) dengan database Supabase, mengotomatiskan pencatatan rekam medis, dan memberikan pengalaman loyalitas bertingkat bagi member.

---

## 2. Evolusi Fungsionalitas (v1–v3)

### v1 — Foundation (Landing Pages & Auth)

| Fitur | Status |
|-------|--------|
| Register akun member | ✅ **Sudah** (via userService.registerUser) |
| Login dengan role-based redirect | ✅ **Sudah** (admin → /dashboard, member → /member) |
| GuestPage — Landing publik statis | ✅ **Sudah** (4 layanan hardcoded, form modal reservasi) |
| MemberPage — Portal member | ✅ **Sudah** (odontogram, booking form, invoice history) |
| CrmPage — CRUD user admin | ✅ **Sudah** (users table via Axios + Supabase REST) |
| Routing & layout | ✅ **Sudah** (MainLayout admin, AuthLayout, Guest, Member) |

**Database:** Tabel `users`, `customers`, `services`, `orders` sudah ada.

### v2 — CRM Sinkronisasi Cloud & Landing Page Dinamis

| Fitur | Prioritas |
|-------|-----------|
| GuestPage: data layanan dari tabel `services` Supabase (tidak hardcoded) | 🔜 **v2** |
| GuestPage: form reservasi POST ke tabel `orders` & `appointments` | 🔜 **v2** |
| MemberPage: data booking/diagnosa dari tabel `orders` & `customers` | 🔜 **v2** |
| MemberPage: poin & tier otomatis dari database | 🔜 **v2** |
| CrmPage: CRUD appointments & patients (bukan hanya users) | 🔜 **v2** |
| Halaman publik `/guest` dengan Hero Section & CTA konversi | 🔜 **v2** |

### v3 — Gamifikasi, Riwayat Medis & Premium

| Fitur | Prioritas |
|-------|-----------|
| Sistem poin otomatis (setiap transaksi + poin) | 🔜 **v3** |
| Tier member otomatis (Bronze/Silver/Gold berdasarkan poin) | 🔜 **v3** |
| Riwayat rekam medis lengkap per pasien (odontogram digital) | 🔜 **v3** |
| Invoice & histori pembayaran tersimpan di database | 🔜 **v3** |
| Notifikasi status appointment (Scheduled/Completed/Canceled) | 🔜 **v3** |
| Dashboard admin: grafik pendapatan & kunjungan | 🔜 **v3** |
| Proteksi RLS penuh (migrasi ke Supabase Auth JWT) | 🔜 **v3** |

---

## 3. Arsitektur Halaman & Role

### 3.1 GuestPage (Landing Publik)

```
┌─────────────────────────────────────────────┐
│ NAVBAR: Logo Azra + [Panel Admin →]         │
├─────────────────────────────────────────────┤
│ HERO SECTION                                │
│ "Solusi Rawat Gigi Tanpa Antre Lama"        │
│ Sub-headline + CTA                          │
├─────────────────────────────────────────────┤
│ KATALOG TARIF LAYANAN (dari tabel services) │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│ │ Scaling  │ │ Tambal   │ │ Cabut    │ ... │
│ │ Rp350rb  │ │ Rp450rb  │ │ Rp2.5jt  │    │
│ │ [Ambil   │ │ [Ambil   │ │ [Ambil   │    │
│ │  Jadwal] │ │  Jadwal] │ │  Jadwal] │    │
│ └──────────┘ └──────────┘ └──────────┘    │
├─────────────────────────────────────────────┤
│ SIDEBAR: Jam Operasional, Alamat, Telepon   │
├─────────────────────────────────────────────┤
│ FORM RESERVASI (Modal Dialog)               │
│ - Nama Lengkap                              │
│ - Pilih Layanan                             │
│ - Tanggal Kunjungan                         │
│ - [Konfirmasi → INSERT ke appointments]     │
└─────────────────────────────────────────────┘
```

**Perubahan v2:** Ganti data hardcoded dengan `api.get('/services')`. Form reservasi mengirim `POST /appointments` dan `POST /orders`.

### 3.2 MemberPage (Portal Terautentikasi)

```
┌──────────────────────────────────────────────────────┐
│ NAVBAR: Logo + Sapaan "Halo, {Nama Pasien}" + [Logout]│
├──────────────────────────────────────────────────────┤
│ BANNER TIER MEMBER  │  PROGRES TREATMENT STEPPER     │
│ - Nama & ID Pasien  │  Step 1: ✅ Cetak 3D           │
│ - Tier: Gold        │  Step 2: 🔄 Fabrikasi Bracket  │
│ - Poin: 2,450       │  Step 3: ⬜ Fitting Klinis     │
│ - Progress bar →    │                                 │
│   Platinum (78%)    │                                 │
├──────────────────────────────────────────────────────┤
│ ODONTOGRAM INTERAKTIF                                 │
│ [Gigi Atas] [Gigi Bawah] — Klik untuk detail diagnosa │
├──────────────────────────────────────────────────────┤
│ FORM BOOKING PRIORITAS  │  INVOICE & RIWAYAT          │
│ - Tanggal               │  Tabel transaksi            │
│ - Pilih Dokter          │  - Tanggal, Tindakan, Biaya │
│ - [Ambil Antrean VIP]   │  - Status (Lunas/Pending)   │
│                         │  Kartu Asuransi Terverifikasi│
└──────────────────────────────────────────────────────┘
```

**Perubahan v2–v3:** Ganti semua data statis dengan fetch dari Supabase berdasarkan `user_id`. Poin & tier ditampilkan dari tabel `customers`.

### 3.3 CrmPage (Admin)

```
┌──────────────────────────────────────────────┐
│ HEADER: Sistem Manajemen CRM Pasien          │
├──────────────────────────────────────────────┤
│ NOTIFIKASI STATUS                             │
├──────────────────────────────────────────────┤
│ REGISTRASI TINDAKAN MEDIS                    │
│ - Pilih Layanan (Radix Select)               │
│ - Status Asuransi (Radix Switch)             │
│ - [Validasi & Simpan ke CRM]                 │
│   → Modal Konfirmasi (Radix Dialog)          │
├──────────────────────────────────────────────┤
│ CRUD DATA USER (tabel users)                 │
│ Form [Tambah/Edit] + Tabel Data              │
├──────────────────────────────────────────────┤
│ [v2] CRUD DATA APPOINTMENTS (tabel orders)   │
│ [v2] CRUD DATA PATIENTS (tabel customers)    │
└──────────────────────────────────────────────┘
```

---

## 4. Desain Database

### 4.1 Tabel `users` (Sudah Ada)

| Kolom | Tipe | Constraint | Keterangan |
|-------|------|-----------|------------|
| `id` | BIGINT | PK, GENERATED ALWAYS AS IDENTITY | ID unik user |
| `username` | TEXT | NOT NULL | Nama lengkap |
| `email` | TEXT | UNIQUE | Email login |
| `password` | TEXT | NOT NULL | Plaintext (⚠️ sementara, nanti migrasi ke Supabase Auth) |
| `role` | TEXT | CHECK ('admin', 'member') | Hak akses |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | |

### 4.2 Tabel `customers` / Pasien (Sudah Ada)

| Kolom | Tipe | Constraint | Keterangan |
|-------|------|-----------|------------|
| `id` | BIGINT | PK, GENERATED ALWAYS AS IDENTITY | |
| `user_id` | BIGINT | FK → users(id) ON DELETE SET NULL | Hubungan ke akun login |
| `full_name` | TEXT | NOT NULL | Nama lengkap pasien |
| `email` | TEXT | | Email kontak |
| `phone` | TEXT | | Nomor telepon |
| `address` | TEXT | | Alamat |
| `birth_date` | DATE | | Tanggal lahir |
| `gender` | TEXT | CHECK ('L', 'P') | Jenis kelamin |
| `points` | INTEGER | DEFAULT 0 | Poin loyalitas |
| `tier` | TEXT | DEFAULT 'regular' CHECK ('regular','silver','gold','platinum') | Status tier |
| `total_orders` | INTEGER | DEFAULT 0 | Total kunjungan |
| `total_spent` | NUMERIC(12,2) | DEFAULT 0 | Total pembelanjaan |
| `notes` | TEXT | | Catatan medis |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | |

### 4.3 Tabel `services` / Layanan (Sudah Ada)

| Kolom | Tipe | Constraint | Keterangan |
|-------|------|-----------|------------|
| `id` | BIGINT | PK, GENERATED ALWAYS AS IDENTITY | |
| `name` | TEXT | NOT NULL | Nama layanan |
| `description` | TEXT | | Deskripsi |
| `price` | NUMERIC(12,2) | NOT NULL | Harga |
| `duration_minutes` | INTEGER | | Durasi pengerjaan |
| `category` | TEXT | | Kategori (Umum, Bedah, Ortodonti, dll) |
| `is_active` | BOOLEAN | DEFAULT TRUE | Status aktif |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | |

**Seed data:** 15 layanan gigi sudah diisi (scaling, tambal, cabut, behel, veneer, dll).

### 4.4 Tabel `orders` / Pemesanan (Sudah Ada)

| Kolom | Tipe | Constraint | Keterangan |
|-------|------|-----------|------------|
| `id` | BIGINT | PK, GENERATED ALWAYS AS IDENTITY | |
| `customer_id` | BIGINT | FK → customers(id) ON DELETE SET NULL | Pasien |
| `service_id` | BIGINT | FK → services(id) ON DELETE SET NULL | Layanan |
| `user_id` | BIGINT | FK → users(id) ON DELETE SET NULL | Admin yang memproses |
| `status` | TEXT | DEFAULT 'pending' CHECK ('pending','confirmed','in_progress','completed','cancelled') | Status order |
| `total_amount` | NUMERIC(12,2) | NOT NULL | Total biaya |
| `points_earned` | INTEGER | DEFAULT 0 | Poin diperoleh |
| `notes` | TEXT | | Catatan |
| `order_date` | DATE | DEFAULT CURRENT_DATE | Tanggal order |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | |

### 4.5 Tabel `appointments` / Janji Temu (BARU — v2)

```sql
CREATE TABLE appointments (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id     BIGINT REFERENCES customers(id) ON DELETE SET NULL,
  service_id      BIGINT REFERENCES services(id) ON DELETE SET NULL,
  user_id         BIGINT REFERENCES users(id) ON DELETE SET NULL,
  patient_name    TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME,
  doctor_name     TEXT,
  status          TEXT DEFAULT 'scheduled' 
                  CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
  source          TEXT DEFAULT 'guest' 
                  CHECK (source IN ('guest', 'member', 'admin')),
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.6 Tabel `medical_records` / Rekam Medis (BARU — v3)

```sql
CREATE TABLE medical_records (
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
```

### 4.7 Tabel `points_history` / Riwayat Poin (BARU — v3)

```sql
CREATE TABLE points_history (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id     BIGINT REFERENCES customers(id) ON DELETE CASCADE,
  order_id        BIGINT REFERENCES orders(id) ON DELETE SET NULL,
  points          INTEGER NOT NULL,
  type            TEXT CHECK (type IN ('earned', 'redeemed', 'expired', 'bonus')),
  description     TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 5. Relasi Antar Tabel

```
┌──────────┐       ┌──────────────┐       ┌──────────┐
│  users   │1───*│  customers   │1───*│  orders   │
│ (admin/  │       │ (patients)   │       │           │
│  member) │       │              │       │           │
└──────────┘       └──────────────┘       └─────┬─────┘
      │                  │                        │
      │                  │                        │
      │                  │ 1───*  ┌──────────┐    │
      │                  ├────────│ points_  │    │
      │                  │        │ history  │    │
      │                  │        └──────────┘    │
      │                  │                        │
      │                  │ 1───*  ┌──────────┐    │
      │                  ├────────│ medical_ │    │
      │                  │        │ records  │    │
      │                  │        └──────────┘    │
      │                  │                        │
      │                  │ 1───*  ┌──────────┐    │
      │                  ├────────│ appoint- │    │
      │                  │        │ ments    │    │
      │                  │        └──────────┘    │
      │                  │                        │
      │                  │  *───1  ┌──────────┐    │
      │                  └────────│ services │←───┘
      │                           │          │
      │                   *───1   └──────────┘
      └──────────────────────────┘
```

### Ringkasan Relasi

| Dari | Ke | Tipe | Melalui |
|------|----|------|---------|
| `users` | `customers` | 1-to-* | `customers.user_id` |
| `users` | `orders` | 1-to-* | `orders.user_id` |
| `users` | `appointments` | 1-to-* | `appointments.user_id` |
| `users` | `medical_records` | 1-to-* | `medical_records.created_by` |
| `customers` | `orders` | 1-to-* | `orders.customer_id` |
| `customers` | `appointments` | 1-to-* | `appointments.customer_id` |
| `customers` | `medical_records` | 1-to-* | `medical_records.customer_id` |
| `customers` | `points_history` | 1-to-* | `points_history.customer_id` |
| `services` | `orders` | 1-to-* | `orders.service_id` |
| `services` | `appointments` | 1-to-* | `appointments.service_id` |
| `orders` | `medical_records` | 1-to-1 | `medical_records.order_id` |

---

## 6. Row Level Security (RLS)

### 6.1 Strategi Implementasi RLS

**Kondisi Saat Ini:** Aplikasi menggunakan anon key langsung (via Axios). Semua request dianggap sebagai user ANONYMOUS. `auth.uid()` tidak berfungsi.

**Rekomendasi (v3):** Migrasikan ke Supabase Auth JWT.

### 6.2 RLS Policy — Tabel `customers`

```sql
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Admin: SELECT semua
CREATE POLICY "Admin SELECT all customers" ON customers
  FOR SELECT USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- Member: SELECT hanya data dirinya sendiri
CREATE POLICY "Member SELECT own data" ON customers
  FOR SELECT USING (
    user_id = auth.uid()
  );

-- Guest: INSERT (untuk registrasi landing page)
CREATE POLICY "Guest INSERT customers" ON customers
  FOR INSERT WITH CHECK (
    auth.role() = 'anon'
  );

-- Admin: INSERT, UPDATE, DELETE
CREATE POLICY "Admin INSERT customers" ON customers
  FOR INSERT WITH CHECK (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Admin UPDATE customers" ON customers
  FOR UPDATE USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Admin DELETE customers" ON customers
  FOR DELETE USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );
```

### 6.3 RLS Policy — Tabel `appointments`

```sql
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Admin: SELECT semua
CREATE POLICY "Admin SELECT all appointments" ON appointments
  FOR SELECT USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- Member: SELECT appointment miliknya
CREATE POLICY "Member SELECT own appointments" ON appointments
  FOR SELECT USING (
    customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
  );

-- Guest: INSERT (reservasi dari landing page)
CREATE POLICY "Guest INSERT appointments" ON appointments
  FOR INSERT WITH CHECK (
    auth.role() = 'anon'
  );

-- Admin: INSERT, UPDATE, DELETE
CREATE POLICY "Admin INSERT appointments" ON appointments
  FOR INSERT WITH CHECK (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Admin UPDATE appointments" ON appointments
  FOR UPDATE USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Admin DELETE appointments" ON appointments
  FOR DELETE USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );
```

### 6.4 RLS Policy — Tabel `orders`

```sql
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Admin: semua akses
CREATE POLICY "Admin ALL orders" ON orders
  FOR ALL USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- Member: SELECT, INSERT (orders miliknya)
CREATE POLICY "Member SELECT own orders" ON orders
  FOR SELECT USING (
    customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
  );

-- Guest: INSERT (untuk guest checkout)
CREATE POLICY "Guest INSERT orders" ON orders
  FOR INSERT WITH CHECK (
    auth.role() = 'anon'
  );
```

### 6.5 RLS Policy — Tabel `medical_records` & `points_history`

```sql
-- === MEDICAL RECORDS ===
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin ALL medical_records" ON medical_records
  FOR ALL USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Member SELECT own medical_records" ON medical_records
  FOR SELECT USING (
    customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
  );

-- === POINTS HISTORY ===
ALTER TABLE points_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin ALL points_history" ON points_history
  FOR ALL USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Member SELECT own points" ON points_history
  FOR SELECT USING (
    customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
  );
```

### 6.6 Proteksi Data Private — Matriks Akses

| Data | Admin | Member (dirinya) | Guest |
|------|-------|------------------|-------|
| Data profil pasien | ✅ CRUD | ✅ SELECT | ❌ |
| Riwayat medis | ✅ CRUD | ✅ SELECT | ❌ |
| Riwayat poin | ✅ CRUD | ✅ SELECT | ❌ |
| Data appointment | ✅ CRUD | ✅ SELECT | ✅ INSERT (reservasi) |
| Data orders | ✅ CRUD | ✅ SELECT | ✅ INSERT |
| Data services | ✅ CRUD | ✅ SELECT | ✅ SELECT |

---

## 7. Sistem Poin, Riwayat & Tier Member

### 7.1 Aturan Kalkulasi Poin

| Item | Poin |
|------|------|
| Setiap Rp1.000 pembelanjaan | 1 poin |
| Bonus pendaftaran pertama | 100 poin |
| Bonus ulang tahun | 50 poin |
| Referral member baru | 75 poin |

### 7.2 Tier Member

| Tier | Minimal Poin | Diskon |
|------|-------------|--------|
| **Bronze** | 0 poin | 0% |
| **Silver** | 500 poin | 5% |
| **Gold** | 2.000 poin | 10% |
| **Platinum** | 5.000 poin | 20% |

### 7.3 Trigger PostgreSQL — Update Tier Otomatis

```sql
CREATE OR REPLACE FUNCTION update_customer_tier()
RETURNS TRIGGER AS $$
BEGIN
  -- Update tier berdasarkan poin
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

CREATE TRIGGER trigger_update_customer_tier
  AFTER UPDATE OF points ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_customer_tier();
```

### 7.4 Trigger — Tambah Poin Otomatis Saat Order Completed

```sql
CREATE OR REPLACE FUNCTION add_points_on_order_completed()
RETURNS TRIGGER AS $$
DECLARE
  v_points INTEGER;
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    -- 1 poin per Rp1.000
    v_points := FLOOR(NEW.total_amount / 1000);
    
    -- Simpan ke points_history
    INSERT INTO points_history (customer_id, order_id, points, type, description)
    VALUES (NEW.customer_id, NEW.id, v_points, 'earned', 
            'Poin dari transaksi #' || NEW.id);
    
    -- Update poin di customers
    UPDATE customers SET points = points + v_points
    WHERE id = NEW.customer_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_add_points_on_completed
  AFTER UPDATE OF status ON orders
  FOR EACH ROW
  WHEN (NEW.status = 'completed')
  EXECUTE FUNCTION add_points_on_order_completed();
```

---

## 8. Rencana Implementasi Bertahap

### Tahap 1 — Database Migration & Service Layer (Estimasi: 2 hari)

| Task | Detail |
|------|--------|
| 1.1 | Jalankan SQL migration: buat tabel `appointments`, `medical_records`, `points_history` |
| 1.2 | Buat service Supabase baru: `appointmentService.js`, `customerService.js` |
| 1.3 | Update `api.js` jika perlu tambahan endpoint |
| 1.4 | Update file `userService.js` dengan validasi dan error handling |

### Tahap 2 — GuestPage Landing Dinamis (Estimasi: 2 hari)

| Task | Detail |
|------|--------|
| 2.1 | Ganti data hardcoded layanan dengan fetch dari `api.get('/services')` |
| 2.2 | Tambah field tanggal reservasi di form GuestPage |
| 2.3 | Submit reservasi → `POST /appointments` + buat customer jika belum ada |
| 2.4 | Tampilkan Hero Section dengan headline lebih atraktif |
| 2.5 | Tambah CTA konversi (WhatsApp/telepon) |

### Tahap 3 — MemberPage Sinkron Database (Estimasi: 2 hari)

| Task | Detail |
|------|--------|
| 3.1 | Fetch data pasien dari `customers` berdasarkan user yang login |
| 3.2 | Tampilkan poin, tier, total kunjungan dari database |
| 3.3 | Submit booking prioritas → `POST /appointments` |
| 3.4 | Tampilkan riwayat transaksi dari `orders` |
| 3.5 | Tampilkan data odontogram dari `medical_records` |

### Tahap 4 — CrmPage Lengkap (Estimasi: 2 hari)

| Task | Detail |
|------|--------|
| 4.1 | Tambah tab "Appointments" untuk CRUD janji temu |
| 4.2 | Tambah tab "Patients" untuk CRUD data pasien (customers) |
| 4.3 | Form registrasi medis → insert ke `orders` + `appointments` |
| 4.4 | Validasi input dan error handling |

### Tahap 5 — Sistem Poin & Tier (Estimasi: 1 hari)

| Task | Detail |
|------|--------|
| 5.1 | Jalankan trigger SQL untuk poin & tier |
| 5.2 | Tampilkan poin & tier di MemberPage |
| 5.3 | Tampilkan riwayat poin di MemberPage |

### Tahap 6 — Proteksi RLS & Keamanan (Estimasi: 1 hari)

| Task | Detail |
|------|--------|
| 6.1 | Migrasi login ke Supabase Auth JWT |
| 6.2 | Ganti Axios anon key dengan `supabase-js` client |
| 6.3 | Aktifkan RLS di semua tabel |
| 6.4 | Update service layer untuk menggunakan session JWT |

### Tahap 7 — Final Testing & Deployment (Estimasi: 1 hari)

| Task | Detail |
|------|--------|
| 7.1 | Unit test untuk service layer |
| 7.2 | E2E test alur Guest → Reservasi → CRM |
| 7.3 | E2E test alur Member → Booking → Cek Poin |
| 7.4 | Deploy ke Vercel |

---

## 9. Lampiran: Status Proyek Saat Ini

### Sudah Tersedia

| Komponen | Status | Catatan |
|----------|--------|---------|
| Autentikasi | ✅ | Login/Register via users table, session di localStorage |
| Routing | ✅ | Guest, Member, Admin dipisah |
| Sidebar Admin | ✅ | Dashboard, Calendar, Patients, Appointments, Reports, CRM |
| Halaman Guest | ✅ | Landing dengan 4 layanan hardcoded + modal reservasi |
| Halaman Member | ✅ | Odontogram interaktif + booking form + invoice |
| Halaman CRM | ✅ | CRUD users + Radix UI component |
| Database Supabase | ✅ | Tabel users, customers, services, orders |
| Seed Data | ✅ | 15 layanan gigi |

### Belum Tersedia (Perlu Dibangun)

| Komponen | Prioritas |
|----------|-----------|
| GuestPage: data services dinamis dari Supabase | v2 |
| GuestPage: form reservasi POST ke database | v2 |
| MemberPage: data dari database (bukan hardcoded) | v2 |
| MemberPage: poin & tier real dari database | v2 |
| CrmPage: CRUD appointments & patients | v2 |
| Tabel appointments | v2 |
| Tabel medical_records | v3 |
| Tabel points_history | v3 |
| Trigger poin & tier otomatis | v3 |
| RLS penuh dengan Supabase Auth | v3 |
| Notifikasi & reminder | v3 |

---

> **Dokumen ini disusun sebagai acuan implementasi untuk AI Coding Agent.**
> Setiap bagian dapat langsung digunakan sebagai prompt untuk mengimplementasikan fitur terkait.
