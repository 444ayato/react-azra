# Panduan Migrasi ke Supabase Auth JWT

**Tujuan:** Agar RLS policies untuk role Admin & Member berfungsi dengan `auth.uid()`.

---

## Masalah

Saat ini aplikasi menggunakan **custom auth**:
- Login/register via Axios langsung ke tabel `users`
- Session disimpan di `localStorage` sebagai `userSession`
- Semua request menggunakan **anon key** (bukan JWT user)
- `users.id` bertipe `BIGINT`, sedangkan `auth.uid()` mengembalikan `UUID`

Akibatnya, `auth.uid()` di Supabase RLS selalu mengembalikan `null` dan tidak bisa di-cast ke BIGINT.
Setelah RLS di-enable (migration 003):
- ✅ **Guest flow** (INSERT appointments, customers) — **berfungsi** karena pakai `auth.role() = 'anon'`
- ❌ **Admin flow** (SELECT/INSERT/UPDATE/DELETE semua data) — **blokade total**
- ❌ **Member flow** (melihat data sendiri) — **blokade total**

Migration 003 telah menambahkan kolom `auth_id UUID` ke tabel `users` sebagai jembatan antara Supabase Auth UUID dan `users.id` BIGINT.

---

## Langkah Migrasi

### 1. Install `@supabase/supabase-js`

```bash
npm install @supabase/supabase-js
```

### 2. Buat Supabase Client (`src/services/supabaseClient.js`)

```javascript
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jfpzpwowhuaewxkkxooj.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_8UYDCCB2kUYQVGE0gMIwnA_6ngP9JmU';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

### 3. Update `src/services/userService.js`

Ganti login/register dari Axios ke Supabase Auth.
**PENTING:** Gunakan kolom `auth_id` untuk menyimpan UUID dari Supabase Auth, bukan `id`.

```javascript
import { supabase } from './supabaseClient';

export const userService = {
  registerUser: async (userData) => {
    // 1. Daftar ke Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email.trim().toLowerCase(),
      password: userData.password,
    });
    if (authError) throw new Error(authError.message);

    // 2. Simpan data user ke tabel users
    //    auth_id → UUID dari Supabase Auth (bukan id yang BIGINT)
    const { error: dbError } = await supabase
      .from('users')
      .insert({
        auth_id: authData.user.id,      // UUID → auth_id (UUID column) ✅
        username: userData.username,
        email: userData.email.trim().toLowerCase(),
        password: userData.password,     // ⚠️ Sementara, idealnya hapus kolom password
        role: userData.role || 'member',
      });
    if (dbError) throw new Error(dbError.message);

    return authData;
  },

  loginUser: async (email, password) => {
    // Login via Supabase Auth → otomatis dapat JWT
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: password,
    });
    if (error) throw new Error('Email atau Password salah!');

    // Ambil data user dari tabel users berdasarkan auth_id (UUID)
    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', data.user.id)       // Cari berdasarkan auth_id ✅
      .single();

    if (!userData) throw new Error('User tidak ditemukan di database.');

    // Seragamkan role
    if (userData.role === 'user') userData.role = 'member';

    return userData;
  },

  logoutUser: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  },
};
```

### 4. Update `src/services/api.js` — Ganti Axios dengan Supabase Client

Semua service perlu di-update dari `api.get('/table?...')` → `supabase.from('table').select('*')`.

```javascript
// src/services/api.js — REGENERATE total
import { supabase } from './supabaseClient';

// Tidak perlu Axios lagi — semua query via supabase.from()
export default supabase;
```

### 5. Update Semua Service Files

Contoh perubahan per service:

| Service | Axios (lama) | Supabase (baru) |
|---------|-------------|-----------------|
| `appointmentService.getAllAppointments()` | `api.get('/appointments?order=...')` | `supabase.from('appointments').select('*').order('appointment_date', { ascending: false })` |
| `customerService.getCustomerByUserId(userId)` | `api.get(\`/customers?user_id=eq.${userId}\`)` | `supabase.from('customers').select('*').eq('user_id', userId).single()` |
| `servicesService.getAllServices()` | `api.get('/services?is_active=eq.true')` | `supabase.from('services').select('*').eq('is_active', true)` |
| `appointmentService.createAppointment(data)` | `api.post('/appointments', data)` | `supabase.from('appointments').insert(data)` |

### 6. Update Login.jsx — Hapus localStorage Session

Session dikelola otomatis oleh Supabase Auth:

```javascript
// Login.jsx — setelah login sukses
const user = await userService.loginUser(email, password);
// JWT otomatis tersimpan di supabase.auth session
// TIDAK PERLU localStorage.setItem('userSession', ...)
```

Untuk membaca session di halaman lain (misal MemberPage):

```javascript
import { supabase } from '../services/supabaseClient';

const { data: { session } } = await supabase.auth.getSession();
const user = session?.user;

if (!session) {
  // Redirect ke login
  navigate('/login');
}
```

### 7. Service Layer — Best Practice dengan Supabase

**Sebelum** (Axios — tiap request kirim anon key):
```javascript
// appointmentService.js
export const getAllAppointments = async () => {
  const response = await api.get('/appointments?order=appointment_date.desc');
  return response.data;
};
```

**Sesudah** (Supabase — JWT otomatis dari session):
```javascript
// appointmentService.js
import { supabase } from './supabaseClient';

export const getAllAppointments = async () => {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .order('appointment_date', { ascending: false });
  if (error) throw error;
  return data;
};
```

### 8. Hapus Kolom `password` dari `users` Table (Opsional — Setelah Stabil)

Setelah migrasi stabil, password bisa dihapus karena autentikasi sudah ditangani Supabase Auth:

```sql
ALTER TABLE users DROP COLUMN IF EXISTS password;
```

---

## Uji Coba Setelah Migrasi

1. Buka aplikasi → coba login sebagai admin
2. Buka halaman CRM → harus bisa melihat semua data
3. Buka halaman Member → harus bisa melihat data sendiri
4. Buka Guest → reservasi tamu tetap berfungsi
5. Buka Supabase Dashboard → SQL Editor → jalankan:

```sql
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies
WHERE tablename IN ('customers','services','orders','appointments','medical_records','points_history','users')
ORDER BY tablename, policyname;
```

---

## Rollback (Jika Gagal)

Nonaktifkan RLS sementara:

```sql
ALTER TABLE customers       DISABLE ROW LEVEL SECURITY;
ALTER TABLE services        DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders          DISABLE ROW LEVEL SECURITY;
ALTER TABLE appointments    DISABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE points_history  DISABLE ROW LEVEL SECURITY;
ALTER TABLE users           DISABLE ROW LEVEL SECURITY;
```
