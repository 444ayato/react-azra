import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// --- TAMBAHAN: Lazy Load Halaman Landing Page Baru ---
const LandingPage = lazy(() => import('./pages/LandingPage'));

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

// --- TAMBAHAN BARU: Lazy Load Halaman Otomatisasi (6.2 & 6.3) ---
const AutomationPage = lazy(() => import('./pages/AutomationPage'));

// Diarahkan ke folder components/Components bukan pages/Components
const ComponentsPage = lazy(() => import('./components/Components'));

// Tampilan Pasien Publik (GUEST)
const GuestPage = lazy(() => import('./pages/GuestPage'));

// TAMBAHAN: Lazy load untuk tampilan halaman setelah login MEMBER
const MemberPage = lazy(() => import('./pages/MemberPage'));

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
          
          {/* SEKARANG SUDAH ADA LANDING PAGE DI SINI 🚀 */}
          <Route path="/" element={<LandingPage />} />

          {/* RUTE GUEST (PASIEN PUBLIK): */}
          <Route path="/guest" element={<GuestPage />} />

          {/* RUTE MEMBER RESMI: */}
          <Route path="/member" element={<MemberPage />} />

          {/* Auth Group */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Main App Group (ADMIN) */}
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/appointments" element={<Appointment />} />
            <Route path="/reports" element={<Reports />} />
            
            {/* Halaman CRM Manajemen Khusus Admin */}
            <Route path="/crm" element={<CrmPage />} />
            
            {/* RUTE BARU: Halaman Otomatisasi Pemasaran & Layanan Khusus Admin */}
            <Route path="/automation" element={<AutomationPage />} />
            
            <Route path="/components" element={<ComponentsPage />} />
          </Route>

          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;