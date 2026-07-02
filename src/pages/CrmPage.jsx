import React, { useState, useEffect } from 'react';
import * as Select from '@radix-ui/react-select';
import * as Dialog from '@radix-ui/react-dialog';
import * as Switch from '@radix-ui/react-switch';
import { Check, ChevronDown, ShieldAlert, UserCheck, X, Users, CalendarDays, Activity, Loader2, Trash2, Edit3 } from 'lucide-react';
import { userService } from '../services/userService';
import { appointmentService } from '../services/appointmentService';
import { customerService } from '../services/customerService';
import { servicesService, formatRupiah } from '../services/servicesService';
import api from '../services/api';

// ========================
// TAB DEFINITIONS
// ========================
const TABS = [
  { id: 'registration', label: 'Registrasi', icon: Activity },
  { id: 'users',        label: 'Users',      icon: Users },
  { id: 'appointments', label: 'Appointments', icon: CalendarDays },
  { id: 'patients',     label: 'Patients',    icon: Users },
];

// ========================
// FORMAT HELPERS
// ========================
const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
};

const statusBadge = (status) => {
  const map = {
    scheduled:  'bg-blue-50 text-blue-600',
    completed:  'bg-emerald-50 text-emerald-600',
    cancelled:  'bg-red-50 text-red-500',
    no_show:    'bg-amber-50 text-amber-600',
    pending:    'bg-amber-50 text-amber-600',
    confirmed:  'bg-blue-50 text-blue-600',
    in_progress: 'bg-indigo-50 text-indigo-600',
  };
  const labels = {
    scheduled: 'Scheduled', completed: 'Completed', cancelled: 'Cancelled',
    no_show: 'No Show', pending: 'Pending', confirmed: 'Confirmed', in_progress: 'In Progress',
  };
  return (
    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md ${map[status] || 'bg-gray-50 text-gray-500'}`}>
      {labels[status] || status}
    </span>
  );
};

export default function CrmPage() {
  // ================= TAB STATE =================
  const [activeTab, setActiveTab] = useState('registration');
  const [message, setMessage] = useState('');

  // ================= REGISTRATION STATE =================
  const [statusAsuransi, setStatusAsuransi] = useState(false);
  const [layananTerpilih, setLayananTerpilih] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [servicesList, setServicesList] = useState([]);

  // ================= USERS STATE =================
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('member');
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [editUserId, setEditUserId] = useState(null);

  // ================= APPOINTMENTS STATE =================
  const [appointments, setAppointments] = useState([]);
  const [loadingAppts, setLoadingAppts] = useState(false);

  // ================= PATIENTS STATE =================
  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(false);

  // ================= INITIAL FETCHES =================
  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await servicesService.getAllServices();
        setServicesList(data);
      } catch { /* silent */ }
    };
    loadServices();
    loadAllUsers();
  }, []);

  // ================= REGISTRATION HANDLERS =================
  const handleRegisterToCRM = async () => {
    try {
      setMessage(`✅ Tindakan "${layananTerpilih}" berhasil diregistrasikan ke sistem CRM.`);
      setIsDialogOpen(false);
    } catch (err) {
      setMessage('❌ Gagal registrasi: ' + (err.message || 'Unknown error'));
    }
  };

  // ================= USERS CRUD =================
  const loadAllUsers = async () => {
    setLoadingUsers(true);
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch { setMessage('Failed to load users.'); }
    finally { setLoadingUsers(false); }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault(); setMessage('');
    try {
      if (isEditingUser) {
        await api.patch(`/users?id=eq.${editUserId}`, { username, email, password, role });
        setMessage('✅ User updated!');
      } else {
        await userService.registerUser({ username, email, password, role });
        setMessage('✅ New user added!');
      }
      resetUserForm(); loadAllUsers();
    } catch (err) { setMessage('❌ ' + (err.message || 'Operation failed.')); }
  };

  const handleEditUser = (user) => {
    setIsEditingUser(true); setEditUserId(user.id);
    setUsername(user.username); setEmail(user.email); setPassword(user.password); setRole(user.role);
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user account?')) return;
    try { await api.delete(`/users?id=eq.${id}`); setMessage('🗑️ User deleted.'); loadAllUsers(); }
    catch { setMessage('❌ Failed to delete user.'); }
  };

  const resetUserForm = () => {
    setIsEditingUser(false); setEditUserId(null);
    setUsername(''); setEmail(''); setPassword(''); setRole('member');
  };

  // ================= APPOINTMENTS CRUD =================
  const loadAppointments = async () => {
    setLoadingAppts(true);
    try {
      const data = await appointmentService.getAllAppointments();
      setAppointments(data);
    } catch { setMessage('Failed to load appointments.'); }
    finally { setLoadingAppts(false); }
  };

  const handleUpdateApptStatus = async (id, newStatus) => {
    try {
      await appointmentService.updateAppointmentStatus(id, newStatus);
      setMessage(`✅ Appointment #${id} → ${newStatus}`);
      loadAppointments();
    } catch { setMessage('❌ Failed to update appointment.'); }
  };

  const handleDeleteAppt = async (id) => {
    if (!window.confirm('Delete this appointment?')) return;
    try { await appointmentService.deleteAppointment(id); setMessage('🗑️ Appointment deleted.'); loadAppointments(); }
    catch { setMessage('❌ Failed to delete appointment.'); }
  };

  // ================= PATIENTS CRUD =================
  const loadPatients = async () => {
    setLoadingPatients(true);
    try {
      const data = await customerService.getAllCustomers();
      setPatients(data);
    } catch { setMessage('Failed to load patients.'); }
    finally { setLoadingPatients(false); }
  };

  const handleDeletePatient = async (id) => {
    if (!window.confirm('Delete this patient record?')) return;
    try { await customerService.deleteCustomer(id); setMessage('🗑️ Patient deleted.'); loadPatients(); }
    catch { setMessage('❌ Failed to delete patient.'); }
  };

  // Load tab data on tab change
  useEffect(() => {
    if (activeTab === 'appointments') loadAppointments();
    if (activeTab === 'patients') loadPatients();
  }, [activeTab]);

  // ================= RENDER =================
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-[#011632] tracking-tight">Sistem Manajemen CRM Pasien</h1>
        <p className="text-xs text-gray-400 mt-1">Kelola data users, appointments, dan pasien terintegrasi Supabase</p>
      </div>

      {/* NOTIFICATION */}
      {message && (
        <div className="p-3.5 bg-blue-50 border border-blue-100 text-blue-700 rounded-xl font-medium text-sm shadow-xs flex items-center gap-2">
          <span>{message}</span>
          <button onClick={() => setMessage('')} className="ml-auto text-blue-400 hover:text-blue-600 cursor-pointer">✕</button>
        </div>
      )}

      {/* TAB NAVIGATION */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white text-[#011632] shadow-xs'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* ========== TAB: REGISTRATION ========== */}
      {activeTab === 'registration' && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-[#011632]">Registrasi Tindakan Medis</h2>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#011632]">Pilih Tindakan Medis</label>
            <Select.Root value={layananTerpilih} onValueChange={setLayananTerpilih}>
              <Select.Trigger className="w-full md:w-[380px] flex items-center justify-between px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1376f8]/20 focus:border-[#1376f8] transition-all text-left">
                <Select.Value placeholder="Pilih jenis penanganan gigi..." />
                <Select.Icon><ChevronDown className="w-4 h-4 text-gray-400" /></Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className="overflow-hidden bg-white rounded-xl border border-gray-200 shadow-lg z-50 p-1 min-w-[280px] md:min-w-[380px]">
                  <Select.Viewport className="p-1 space-y-0.5">
                    {servicesList.length > 0 ? servicesList.map((item) => (
                      <Select.Item key={item.id} value={item.name}
                        className="flex items-center justify-between px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50 cursor-pointer focus:bg-gray-50 focus:outline-none select-none"
                      >
                        <Select.ItemText>
                          <span>{item.name}</span>
                          <span className="ml-2 text-[10px] text-gray-400">{formatRupiah(item.price)}</span>
                        </Select.ItemText>
                        <Select.ItemIndicator><Check className="w-4 h-4 text-[#17bf28]" /></Select.ItemIndicator>
                      </Select.Item>
                    )) : (
                      <div className="px-3 py-4 text-xs text-gray-400 text-center">Memuat layanan...</div>
                    )}
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 max-w-[380px]">
            <div className="space-y-0.5">
              <label className="text-sm font-semibold text-[#011632]">Metode Jaminan Asuransi</label>
              <p className="text-xs text-gray-500">Aktifkan jika menggunakan jaminan kesehatan / BPJS</p>
            </div>
            <Switch.Root
              checked={statusAsuransi}
              onCheckedChange={setStatusAsuransi}
              className="w-11 h-6 bg-gray-200 rounded-full relative data-[state=checked]:bg-[#1376f8] transition-colors outline-none cursor-pointer"
            >
              <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[22px]" />
            </Switch.Root>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <Dialog.Trigger asChild>
                <button type="button" className="bg-[#1376f8] hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all active:scale-95 shadow-sm cursor-pointer">
                  Validasi & Simpan ke CRM
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50" />
                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-md p-6 z-50 focus:outline-none">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2.5 text-amber-600">
                      <ShieldAlert className="w-5 h-5" />
                      <Dialog.Title className="text-lg font-bold text-[#011632]">Konfirmasi Registrasi</Dialog.Title>
                    </div>
                    <Dialog.Close className="text-gray-400 hover:text-gray-600 outline-none cursor-pointer"><X className="w-5 h-5" /></Dialog.Close>
                  </div>
                  <Dialog.Description className="text-sm text-gray-600 space-y-3 leading-relaxed" as="div">
                    <p>Sistem CRM mendeteksi entri rekam medis baru:</p>
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs space-y-1.5 text-gray-700 font-mono">
                      <div>• Tindakan: <span className="font-bold text-[#011632]">{layananTerpilih || 'Belum Dipilih'}</span></div>
                      <div>• Asuransi: <span className="font-bold text-[#011632]">{statusAsuransi ? 'AKTIF (BPJS/Kemitraan)' : 'TIDAK AKTIF (Mandiri)'}</span></div>
                    </div>
                  </Dialog.Description>
                  <div className="flex justify-end gap-3 pt-5 mt-4 border-t border-gray-100">
                    <Dialog.Close asChild>
                      <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition cursor-pointer">Periksa Kembali</button>
                    </Dialog.Close>
                    <button onClick={handleRegisterToCRM} className="bg-[#17bf28] hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-1.5 cursor-pointer">
                      <UserCheck className="w-4 h-4" /> Ya, Daftarkan Pasien
                    </button>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </div>
      )}

      {/* ========== TAB: USERS ========== */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <form onSubmit={handleUserSubmit} className="p-6 bg-white rounded-2xl border border-gray-100 shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-[#011632]">{isEditingUser ? '✏️ Edit Account Data' : '➕ Add New Account'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Full Name</label>
                <input type="text" placeholder="Full Name" value={username} onChange={e => setUsername(e.target.value)} required className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-blue-100" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Email</label>
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-blue-100" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Password</label>
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required={!isEditingUser} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-blue-100" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Role</label>
                <select value={role} onChange={e => setRole(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer">
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl text-sm font-medium shadow-sm transition-colors cursor-pointer">
                  {isEditingUser ? 'Update' : 'Save'}
                </button>
                {isEditingUser && (
                  <button type="button" onClick={resetUserForm} className="bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-xl text-sm font-medium transition-colors cursor-pointer">Cancel</button>
                )}
              </div>
            </div>
          </form>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-base font-bold text-[#011632]">Database Accounts</h3>
              <button onClick={loadAllUsers} className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer">↻ Refresh</button>
            </div>
            {loadingUsers ? (
              <div className="p-10 text-center text-sm text-gray-400 font-medium flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-400 font-bold uppercase tracking-wider">
                      <th className="p-4">ID</th>
                      <th className="p-4">Full Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-gray-600 divide-y divide-gray-50">
                    {users.length === 0 ? (
                      <tr><td colSpan="5" className="p-6 text-center text-gray-400">No records found.</td></tr>
                    ) : (
                      users.map(u => (
                        <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="p-4 font-medium text-gray-400">#{u.id}</td>
                          <td className="p-4 font-bold text-[#011632]">{u.username}</td>
                          <td className="p-4">{u.email}</td>
                          <td className="p-4">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${u.role === 'admin' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="p-4 flex gap-2">
                            <button onClick={() => handleEditUser(u)} className="text-xs flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white font-medium py-1.5 px-3 rounded-lg transition-colors cursor-pointer">
                              <Edit3 className="w-3 h-3" /> Edit
                            </button>
                            <button onClick={() => handleDeleteUser(u.id)} className="text-xs flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white font-medium py-1.5 px-3 rounded-lg transition-colors cursor-pointer">
                              <Trash2 className="w-3 h-3" /> Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========== TAB: APPOINTMENTS ========== */}
      {activeTab === 'appointments' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-base font-bold text-[#011632]">📅 All Appointments</h3>
            <button onClick={loadAppointments} className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer">↻ Refresh</button>
          </div>
          {loadingAppts ? (
            <div className="p-10 text-center text-sm text-gray-400 font-medium flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-400 font-bold uppercase tracking-wider">
                    <th className="p-4">ID</th>
                    <th className="p-4">Patient</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Time</th>
                    <th className="p-4">Doctor</th>
                    <th className="p-4">Source</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-600 divide-y divide-gray-50">
                  {appointments.length === 0 ? (
                    <tr><td colSpan="8" className="p-6 text-center text-gray-400">No appointments found.</td></tr>
                  ) : (
                    appointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 font-medium text-gray-400">#{apt.id}</td>
                        <td className="p-4 font-bold text-[#011632]">{apt.patient_name}</td>
                        <td className="p-4">{formatDate(apt.appointment_date)}</td>
                        <td className="p-4 text-gray-400">{apt.appointment_time || '-'}</td>
                        <td className="p-4 text-sm">{apt.doctor_name || '-'}</td>
                        <td className="p-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            apt.source === 'member' ? 'bg-indigo-50 text-indigo-600' :
                            apt.source === 'admin' ? 'bg-amber-50 text-amber-600' :
                            'bg-slate-50 text-slate-500'
                          }`}>
                            {apt.source}
                          </span>
                        </td>
                        <td className="p-4">{statusBadge(apt.status)}</td>
                        <td className="p-4">
                          <div className="flex gap-1.5 flex-wrap">
                            <select
                              value={apt.status}
                              onChange={(e) => handleUpdateApptStatus(apt.id, e.target.value)}
                              className="text-[10px] bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
                            >
                              <option value="scheduled">Scheduled</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                              <option value="no_show">No Show</option>
                            </select>
                            <button onClick={() => handleDeleteAppt(apt.id)} className="text-[10px] text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-lg transition cursor-pointer">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ========== TAB: PATIENTS ========== */}
      {activeTab === 'patients' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-base font-bold text-[#011632]">🧑‍⚕️ All Patients (Customers)</h3>
            <button onClick={loadPatients} className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer">↻ Refresh</button>
          </div>
          {loadingPatients ? (
            <div className="p-10 text-center text-sm text-gray-400 font-medium flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-400 font-bold uppercase tracking-wider">
                    <th className="p-4">ID</th>
                    <th className="p-4">Full Name</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Tier</th>
                    <th className="p-4">Points</th>
                    <th className="p-4">Orders</th>
                    <th className="p-4">Total Spent</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-600 divide-y divide-gray-50">
                  {patients.length === 0 ? (
                    <tr><td colSpan="8" className="p-6 text-center text-gray-400">No patients found.</td></tr>
                  ) : (
                    patients.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 font-medium text-gray-400">#{p.id}</td>
                        <td className="p-4 font-bold text-[#011632]">{p.full_name}</td>
                        <td className="p-4">{p.phone || '-'}</td>
                        <td className="p-4">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md ${
                            p.tier === 'platinum' ? 'bg-purple-50 text-purple-700' :
                            p.tier === 'gold' ? 'bg-amber-50 text-amber-700' :
                            p.tier === 'silver' ? 'bg-gray-100 text-gray-600' :
                            'bg-slate-50 text-slate-500'
                          }`}>
                            {p.tier}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-amber-600">{p.points?.toLocaleString('id-ID') || 0}</td>
                        <td className="p-4">{p.total_orders || 0}x</td>
                        <td className="p-4 font-bold text-blue-600">{p.total_spent ? formatRupiah(p.total_spent) : 'Rp 0'}</td>
                        <td className="p-4">
                          <button onClick={() => handleDeletePatient(p.id)} className="text-xs flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white font-medium py-1.5 px-3 rounded-lg transition-colors cursor-pointer">
                            <Trash2 className="w-3 h-3" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}