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

// --- Lazy Load Error Page ---
const NotFound = lazy(() => import('./components/Error404'));

function App() {
  return (
    <BrowserRouter>
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
        </Route>

        {/* 404 Page 
          Menangkap semua path yang tidak terdaftar
        */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;