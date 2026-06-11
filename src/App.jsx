import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; // TAMBAHAN: Import Navigate
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// --- Lazy Load Auth Pages ---
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));

// --- Lazy Load Main Pages ---
const Dashboard = lazy(() => import('./pages/DashboardPage'));
const Calendar = lazy(() => import('./pages/CalendarPage'));
const Patients = lazy(() => import('./pages/PatientsPage'));
const Appointment = lazy(() => import('./pages/AppointmentPage'));
const Reports = lazy(() => import('./pages/ReportsPage'));

// Lazy load untuk halaman CRM dengan komponen Radix UI
const CrmPage = lazy(() => import('./pages/CrmPage'));

// Diarahkan ke folder components/Components bukan pages/Components
const ComponentsPage = lazy(() => import('./components/Components'));

// TAMBAHAN: Lazy load untuk halaman Guest (Tampilan Pasien Publik)
const GuestPage = lazy(() => import('./pages/GuestPage'));

// --- Lazy Load Error Page ---
const NotFound = lazy(() => import('./components/Error404'));

// Loading Fallback Komponen Sementara
const PageLoading = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50 text-sm text-gray-500 font-medium">
    Memuat halaman...
  </div>
);

function App() {
  return (
    <BrowserRouter>
      {/* Membungkus rute dengan Suspense karena menggunakan lazy loading */}
      <Suspense fallback={<PageLoading />}>
        <Routes>
          
          {/* PENGALIHAN UTAMA: 
            Jika user membuka http://localhost:5173/, otomatis dialihkan ke halaman /login 
          */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* TAMBAHAN RUTE BARU (GUEST/PASIEN):
            Diletakkan di luar layout agar tampil penuh tanpa sidebar admin.
            Bisa diakses lewat URL: http://localhost:5173/guest
          */}
          <Route path="/guest" element={<GuestPage />} />

          {/* Auth Group 
            Menggunakan AuthLayout untuk Login & Register 
          */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Main App Group (ADMIN)
            Menggunakan MainLayout (Sidebar + Header internal klinik)
            SESUAIKAN DI SINI: Mengubah rute penampung utama menjadi /dashboard
          */}
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/appointments" element={<Appointment />} />
            <Route path="/reports" element={<Reports />} />
            
            {/* Halaman CRM Manajemen Khusus Admin */}
            <Route path="/crm" element={<CrmPage />} />
            
            <Route path="/components" element={<ComponentsPage />} />
          </Route>

          {/* 404 Page 
            Menangkap semua path yang tidak terdaftar
          */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;