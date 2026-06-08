import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

// TAMBAHAN: Lazy load untuk halaman CRM baru dengan komponen Radix UI
const CrmPage = lazy(() => import('./pages/CrmPage'));

// DIUBAH: diarahkan ke folder components/Components bukan pages/Components
const ComponentsPage = lazy(() => import('./components/Components'));

// --- Lazy Load Error Page ---
const NotFound = lazy(() => import('./components/Error404'));

// Loading Fallback Komponen Sementara (Bisa disesuaikan dengan Spinner/Skeleton bawaan proyek)
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
          {/* Auth Group 
            Menggunakan AuthLayout untuk Login & Register 
          */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Main App Group 
            Menggunakan MainLayout (Sidebar + Header)
          */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/appointments" element={<Appointment />} />
            <Route path="/reports" element={<Reports />} />
            
            {/* TAMBAHAN RUTE BARU: Diakses melalui URL http://localhost:5173/crm */}
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