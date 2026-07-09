import React, { useState, useEffect } from 'react';
import * as Select from '@radix-ui/react-select';
import * as Dialog from '@radix-ui/react-dialog';
import * as Switch from '@radix-ui/react-switch';
import { Check, ChevronDown, ShieldAlert, UserCheck, X, Users, CalendarDays, Activity, Loader2, Trash2, Edit3, Plus, Search, Filter, ArrowUpRight, Clock, UserPlus, Stethoscope, FileText, Sparkles, Award, TrendingUp, RefreshCw } from 'lucide-react';
import { userService } from '../services/userService';
import { appointmentService } from '../services/appointmentService';
import { customerService } from '../services/customerService';
import { servicesService, formatRupiah } from '../services/servicesService';
import api from '../services/api';

// ========================
// TAB DEFINITIONS
// ========================
const TABS = [
  { id: 'registration', label: 'Registrasi', icon: Activity, color: 'blue' },
  { id: 'users', label: 'Users', icon: Users, color: 'purple' },
  { id: 'appointments', label: 'Appointments', icon: CalendarDays, color: 'emerald' },
  { id: 'patients', label: 'Patients', icon: UserPlus, color: 'amber' },
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
    scheduled: 'bg-blue-50 text-blue-600 border-blue-200',
    completed: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    cancelled: 'bg-red-50 text-red-500 border-red-200',
    no_show: 'bg-amber-50 text-amber-600 border-amber-200',
    pending: 'bg-amber-50 text-amber-600 border-amber-200',
    confirmed: 'bg-blue-50 text-blue-600 border-blue-200',
    in_progress: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  };
  const labels = {
    scheduled: 'Scheduled', completed: 'Completed', cancelled: 'Cancelled',
    no_show: 'No Show', pending: 'Pending', confirmed: 'Confirmed', in_progress: 'In Progress',
  };
  return (
    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${map[status] || 'bg-gray-50 text-gray-500 border-gray-200'}`}>
      {labels[status] || status}
    </span>
  );
};

export default function CrmPage() {
  // ================= TAB STATE =================
  const [activeTab, setActiveTab] = useState('registration');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');

  // ================= REGISTRATION STATE =================
  const [statusAsuransi, setStatusAsuransi] = useState(false);
  const [layananTerpilih, setLayananTerpilih] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [servicesList, setServicesList] = useState([]);
  const [selectedServicePrice, setSelectedServicePrice] = useState(0);

  // ================= USERS STATE =================
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('member');
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [searchUsers, setSearchUsers] = useState('');

  // ================= APPOINTMENTS STATE =================
  const [appointments, setAppointments] = useState([]);
  const [loadingAppts, setLoadingAppts] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  // ================= PATIENTS STATE =================
  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [searchPatients, setSearchPatients] = useState('');

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
  const handleServiceSelect = (value) => {
    setLayananTerpilih(value);
    const service = servicesList.find(s => s.name === value);
    if (service) setSelectedServicePrice(service.price);
  };

  const handleRegisterToCRM = async () => {
    try {
      setMessage(`✅ Tindakan "${layananTerpilih}" berhasil diregistrasikan ke sistem CRM.`);
      setMessageType('success');
      setIsDialogOpen(false);
    } catch (err) {
      setMessage('❌ Gagal registrasi: ' + (err.message || 'Unknown error'));
      setMessageType('error');
    }
  };

  // ================= USERS CRUD =================
  const loadAllUsers = async () => {
    setLoadingUsers(true);
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch { setMessage('Failed to load users.'); setMessageType('error'); }
    finally { setLoadingUsers(false); }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault(); setMessage('');
    try {
      if (isEditingUser) {
        await api.patch(`/users?id=eq.${editUserId}`, { username, email, password, role });
        setMessage('✅ User updated successfully!');
        setMessageType('success');
      } else {
        await userService.registerUser({ username, email, password, role });
        setMessage('✅ New user added successfully!');
        setMessageType('success');
      }
      resetUserForm(); loadAllUsers();
    } catch (err) { 
      setMessage('❌ ' + (err.message || 'Operation failed.'));
      setMessageType('error');
    }
  };

  const handleEditUser = (user) => {
    setIsEditingUser(true); setEditUserId(user.id);
    setUsername(user.username); setEmail(user.email); setPassword(user.password); setRole(user.role);
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user account?')) return;
    try { 
      await api.delete(`/users?id=eq.${id}`); 
      setMessage('🗑️ User deleted successfully.');
      setMessageType('success');
      loadAllUsers(); 
    } catch { 
      setMessage('❌ Failed to delete user.');
      setMessageType('error');
    }
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
    } catch { setMessage('Failed to load appointments.'); setMessageType('error'); }
    finally { setLoadingAppts(false); }
  };

  const handleUpdateApptStatus = async (id, newStatus) => {
    try {
      await appointmentService.updateAppointmentStatus(id, newStatus);
      setMessage(`✅ Appointment #${id} → ${newStatus}`);
      setMessageType('success');
      loadAppointments();
    } catch { 
      setMessage('❌ Failed to update appointment.');
      setMessageType('error');
    }
  };

  const handleDeleteAppt = async (id) => {
    if (!window.confirm('Delete this appointment?')) return;
    try { 
      await appointmentService.deleteAppointment(id); 
      setMessage('🗑️ Appointment deleted successfully.');
      setMessageType('success');
      loadAppointments(); 
    } catch { 
      setMessage('❌ Failed to delete appointment.');
      setMessageType('error');
    }
  };

  // ================= PATIENTS CRUD =================
  const loadPatients = async () => {
    setLoadingPatients(true);
    try {
      const data = await customerService.getAllCustomers();
      setPatients(data);
    } catch { setMessage('Failed to load patients.'); setMessageType('error'); }
    finally { setLoadingPatients(false); }
  };

  const handleDeletePatient = async (id) => {
    if (!window.confirm('Delete this patient record?')) return;
    try { 
      await customerService.deleteCustomer(id); 
      setMessage('🗑️ Patient deleted successfully.');
      setMessageType('success');
      loadPatients(); 
    } catch { 
      setMessage('❌ Failed to delete patient.');
      setMessageType('error');
    }
  };

  // Load tab data on tab change
  useEffect(() => {
    if (activeTab === 'appointments') loadAppointments();
    if (activeTab === 'patients') loadPatients();
  }, [activeTab]);

  // Filter users
  const filteredUsers = users.filter(u => 
    u.username?.toLowerCase().includes(searchUsers.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchUsers.toLowerCase())
  );

  // Filter appointments
  const filteredAppointments = appointments.filter(apt => 
    filterStatus === 'all' || apt.status === filterStatus
  );

  // Filter patients
  const filteredPatients = patients.filter(p => 
    p.full_name?.toLowerCase().includes(searchPatients.toLowerCase()) ||
    p.phone?.includes(searchPatients)
  );

  // Get stats
  const totalUsers = users.length;
  const totalAppointments = appointments.length;
  const totalPatients = patients.length;
  const completedAppointments = appointments.filter(a => a.status === 'completed').length;

  // ================= RENDER =================
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto bg-slate-50/50 min-h-screen">
      {/* HEADER WITH GRADIENT */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#011632] via-[#0a2a4a] to-[#1a3a5a] rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl -ml-24 -mb-24"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.2em] uppercase text-amber-400/80">CRM Platform</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Sistem Manajemen CRM Pasien</h1>
          <p className="text-blue-200/70 text-sm mt-1 max-w-2xl">
            Kelola data users, appointments, dan pasien terintegrasi dengan Supabase
          </p>
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/5">
              <Users className="w-4 h-4 text-blue-300" />
              <span className="text-sm font-bold">{totalUsers}</span>
              <span className="text-[10px] text-blue-200/60">Users</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/5">
              <CalendarDays className="w-4 h-4 text-emerald-300" />
              <span className="text-sm font-bold">{totalAppointments}</span>
              <span className="text-[10px] text-emerald-200/60">Appointments</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/5">
              <UserPlus className="w-4 h-4 text-amber-300" />
              <span className="text-sm font-bold">{totalPatients}</span>
              <span className="text-[10px] text-amber-200/60">Patients</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/5">
              <Award className="w-4 h-4 text-purple-300" />
              <span className="text-sm font-bold">{completedAppointments}</span>
              <span className="text-[10px] text-purple-200/60">Completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* NOTIFICATION */}
      {message && (
        <div className={`p-4 rounded-xl border shadow-sm flex items-center gap-3 ${
          messageType === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
          messageType === 'error' ? 'bg-red-50 border-red-200 text-red-700' :
          'bg-blue-50 border-blue-200 text-blue-700'
        }`}>
          <span className="text-sm font-medium flex-1">{message}</span>
          <button 
            onClick={() => setMessage('')} 
            className={`p-1 rounded-lg hover:bg-white/50 transition-colors ${
              messageType === 'success' ? 'text-emerald-500' :
              messageType === 'error' ? 'text-red-500' :
              'text-blue-500'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TAB NAVIGATION - MODERN */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-1.5 flex flex-wrap gap-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const colors = {
            blue: isActive ? 'bg-blue-50 text-blue-700 border-blue-200' : '',
            purple: isActive ? 'bg-purple-50 text-purple-700 border-purple-200' : '',
            emerald: isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : '',
            amber: isActive ? 'bg-amber-50 text-amber-700 border-amber-200' : '',
          };
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 flex-1 sm:flex-none justify-center ${
                isActive
                  ? `${colors[tab.color]} shadow-sm border`
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? '' : 'opacity-60'}`} />
              <span>{tab.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse ml-0.5"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========== TAB: REGISTRATION ========== */}
      {activeTab === 'registration' && (
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-[#011632] flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-blue-600" />
              Registrasi Tindakan Medis
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Daftarkan tindakan medis pasien ke dalam sistem CRM</p>
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#011632] flex items-center gap-2">
                <span>Pilih Tindakan Medis</span>
                <span className="text-[10px] text-slate-400 font-normal">(wajib dipilih)</span>
              </label>
              <Select.Root value={layananTerpilih} onValueChange={handleServiceSelect}>
                <Select.Trigger className="w-full md:w-[420px] flex items-center justify-between px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-left hover:bg-white">
                  <Select.Value placeholder="Pilih jenis penanganan gigi..." />
                  <Select.Icon><ChevronDown className="w-4 h-4 text-slate-400" /></Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="overflow-hidden bg-white rounded-xl border border-slate-200 shadow-lg z-50 p-1 min-w-[280px] md:min-w-[420px]">
                    <Select.Viewport className="p-1 space-y-0.5">
                      {servicesList.length > 0 ? servicesList.map((item) => (
                        <Select.Item key={item.id} value={item.name}
                          className="flex items-center justify-between px-3 py-2.5 text-sm text-slate-600 rounded-lg hover:bg-slate-50 cursor-pointer focus:bg-slate-50 focus:outline-none select-none"
                        >
                          <Select.ItemText>
                            <span className="font-medium">{item.name}</span>
                            <span className="ml-3 text-[10px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
                              {formatRupiah(item.price)}
                            </span>
                          </Select.ItemText>
                          <Select.ItemIndicator><Check className="w-4 h-4 text-emerald-500" /></Select.ItemIndicator>
                        </Select.Item>
                      )) : (
                        <div className="px-3 py-6 text-xs text-slate-400 text-center flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" /> Memuat layanan...
                        </div>
                      )}
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
              {layananTerpilih && (
                <p className="text-xs text-slate-500 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Harga: <span className="font-bold text-[#011632]">{formatRupiah(selectedServicePrice)}</span>
                </p>
              )}
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200 max-w-[420px]">
              <div className="space-y-0.5">
                <label className="text-sm font-semibold text-[#011632]">Metode Jaminan Asuransi</label>
                <p className="text-xs text-slate-500">Aktifkan jika menggunakan jaminan kesehatan / BPJS</p>
              </div>
              <Switch.Root
                checked={statusAsuransi}
                onCheckedChange={setStatusAsuransi}
                className="w-11 h-6 bg-slate-300 rounded-full relative data-[state=checked]:bg-blue-600 transition-colors outline-none cursor-pointer flex-shrink-0"
              >
                <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[22px]" />
              </Switch.Root>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <Dialog.Trigger asChild>
                  <button 
                    type="button" 
                    disabled={!layananTerpilih}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all active:scale-95 shadow-sm cursor-pointer ${
                      layananTerpilih 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200' 
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <UserCheck className="w-4 h-4" />
                    Validasi & Simpan ke CRM
                  </button>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
                  <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-6 z-50 focus:outline-none">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                          <ShieldAlert className="w-5 h-5" />
                        </div>
                        <Dialog.Title className="text-lg font-bold text-[#011632]">Konfirmasi Registrasi</Dialog.Title>
                      </div>
                      <Dialog.Close className="text-slate-400 hover:text-slate-600 outline-none cursor-pointer p-1 hover:bg-slate-100 rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                      </Dialog.Close>
                    </div>
                    <Dialog.Description className="text-sm text-slate-600 space-y-3 leading-relaxed" as="div">
                      <p>Sistem CRM mendeteksi entri rekam medis baru:</p>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2 text-slate-700">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Tindakan</span>
                          <span className="font-bold text-[#011632]">{layananTerpilih || 'Belum Dipilih'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Biaya</span>
                          <span className="font-bold text-[#011632]">{formatRupiah(selectedServicePrice)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Asuransi</span>
                          <span className={`font-bold ${statusAsuransi ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {statusAsuransi ? '✅ AKTIF (BPJS/Kemitraan)' : '❌ TIDAK AKTIF (Mandiri)'}
                          </span>
                        </div>
                      </div>
                    </Dialog.Description>
                    <div className="flex justify-end gap-3 pt-5 mt-4 border-t border-slate-100">
                      <Dialog.Close asChild>
                        <button className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition cursor-pointer">
                          Periksa Kembali
                        </button>
                      </Dialog.Close>
                      <button 
                        onClick={handleRegisterToCRM} 
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition shadow-sm shadow-emerald-200 cursor-pointer"
                      >
                        <UserCheck className="w-4 h-4" /> 
                        Ya, Daftarkan Pasien
                      </button>
                    </div>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
              {!layananTerpilih && (
                <p className="text-xs text-amber-600 mt-2">⚠️ Silakan pilih tindakan medis terlebih dahulu</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========== TAB: USERS ========== */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <form onSubmit={handleUserSubmit} className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-bold text-[#011632] flex items-center gap-2">
                  {isEditingUser ? (
                    <>✏️ Edit Account Data</>
                  ) : (
                    <>➕ Add New Account</>
                  )}
                </h3>
                <p className="text-xs text-slate-400">
                  {isEditingUser ? 'Update existing user information' : 'Register a new user to the system'}
                </p>
              </div>
              {isEditingUser && (
                <button 
                  type="button" 
                  onClick={resetUserForm} 
                  className="text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Cancel Edit
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  value={username} 
                  onChange={e => setUsername(e.target.value)} 
                  required 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-300"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email</label>
                <input 
                  type="email" 
                  placeholder="Email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-300"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Password</label>
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required={!isEditingUser} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-300"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Role</label>
                <select 
                  value={role} 
                  onChange={e => setRole(e.target.value)} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                >
                  <option value="member">👤 Member</option>
                  <option value="admin">🛡️ Admin</option>
                </select>
              </div>
              <div className="flex items-end gap-2">
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-medium shadow-sm shadow-blue-200 transition-colors">
                  {isEditingUser ? 'Update User' : 'Create User'}
                </button>
              </div>
            </div>
          </form>

          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-[#011632] flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  Database Users
                  <span className="text-[10px] font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    {users.length}
                  </span>
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchUsers}
                    onChange={e => setSearchUsers(e.target.value)}
                    className="pl-9 pr-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-40 sm:w-56"
                  />
                </div>
                <button 
                  onClick={loadAllUsers} 
                  className="text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Refresh
                </button>
              </div>
            </div>
            {loadingUsers ? (
              <div className="p-10 text-center text-sm text-slate-400 font-medium flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      <th className="p-4">ID</th>
                      <th className="p-4">Full Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Role</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-slate-600 divide-y divide-slate-50">
                    {filteredUsers.length === 0 ? (
                      <tr><td colSpan="5" className="p-8 text-center text-slate-400">No records found.</td></tr>
                    ) : (
                      filteredUsers.map(u => (
                        <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4 font-medium text-slate-400 font-mono text-xs">#{u.id}</td>
                          <td className="p-4 font-bold text-[#011632]">{u.username}</td>
                          <td className="p-4 text-sm">{u.email}</td>
                          <td className="p-4">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                              u.role === 'admin' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-blue-50 text-blue-600 border border-blue-200'
                            }`}>
                              {u.role === 'admin' ? '🛡️ Admin' : '👤 Member'}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => handleEditUser(u)} 
                                className="text-xs flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white font-medium py-1.5 px-3 rounded-lg transition-colors"
                              >
                                <Edit3 className="w-3 h-3" /> Edit
                              </button>
                              <button 
                                onClick={() => handleDeleteUser(u.id)} 
                                className="text-xs flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white font-medium py-1.5 px-3 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-3 h-3" /> Delete
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
        </div>
      )}

      {/* ========== TAB: APPOINTMENTS ========== */}
      {activeTab === 'appointments' && (
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-[#011632] flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-emerald-600" />
                All Appointments
                <span className="text-[10px] font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  {appointments.length}
                </span>
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="no_show">No Show</option>
              </select>
              <button 
                onClick={loadAppointments} 
                className="text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Refresh
              </button>
            </div>
          </div>
          {loadingAppts ? (
            <div className="p-10 text-center text-sm text-slate-400 font-medium flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <th className="p-4">ID</th>
                    <th className="p-4">Patient</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Time</th>
                    <th className="p-4">Doctor</th>
                    <th className="p-4">Source</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-slate-600 divide-y divide-slate-50">
                  {filteredAppointments.length === 0 ? (
                    <tr><td colSpan="8" className="p-8 text-center text-slate-400">No appointments found.</td></tr>
                  ) : (
                    filteredAppointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-medium text-slate-400 font-mono text-xs">#{apt.id}</td>
                        <td className="p-4 font-bold text-[#011632]">{apt.patient_name}</td>
                        <td className="p-4">{formatDate(apt.appointment_date)}</td>
                        <td className="p-4 text-slate-400 text-xs">{apt.appointment_time || '-'}</td>
                        <td className="p-4 text-sm">{apt.doctor_name || '-'}</td>
                        <td className="p-4">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                            apt.source === 'member' ? 'bg-indigo-50 text-indigo-600 border-indigo-200' :
                            apt.source === 'admin' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                            'bg-slate-50 text-slate-500 border-slate-200'
                          }`}>
                            {apt.source}
                          </span>
                        </td>
                        <td className="p-4">{statusBadge(apt.status)}</td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            <select
                              value={apt.status}
                              onChange={(e) => handleUpdateApptStatus(apt.id, e.target.value)}
                              className="text-[10px] bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                            >
                              <option value="scheduled">Scheduled</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                              <option value="no_show">No Show</option>
                            </select>
                            <button 
                              onClick={() => handleDeleteAppt(apt.id)} 
                              className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-[#011632] flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-amber-600" />
                All Patients
                <span className="text-[10px] font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  {patients.length}
                </span>
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchPatients}
                  onChange={e => setSearchPatients(e.target.value)}
                  className="pl-9 pr-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-40 sm:w-56"
                />
              </div>
              <button 
                onClick={loadPatients} 
                className="text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Refresh
              </button>
            </div>
          </div>
          {loadingPatients ? (
            <div className="p-10 text-center text-sm text-slate-400 font-medium flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <th className="p-4">ID</th>
                    <th className="p-4">Full Name</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Tier</th>
                    <th className="p-4">Points</th>
                    <th className="p-4">Orders</th>
                    <th className="p-4">Total Spent</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-slate-600 divide-y divide-slate-50">
                  {filteredPatients.length === 0 ? (
                    <tr><td colSpan="8" className="p-8 text-center text-slate-400">No patients found.</td></tr>
                  ) : (
                    filteredPatients.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-medium text-slate-400 font-mono text-xs">#{p.id}</td>
                        <td className="p-4 font-bold text-[#011632]">{p.full_name}</td>
                        <td className="p-4">{p.phone || '-'}</td>
                        <td className="p-4">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                            p.tier === 'platinum' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                            p.tier === 'gold' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            p.tier === 'silver' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                            'bg-slate-50 text-slate-500 border-slate-200'
                          }`}>
                            {p.tier || 'basic'}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-amber-600">{p.points?.toLocaleString('id-ID') || 0}</td>
                        <td className="p-4">{p.total_orders || 0}x</td>
                        <td className="p-4 font-bold text-blue-600">{p.total_spent ? formatRupiah(p.total_spent) : 'Rp 0'}</td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => handleDeletePatient(p.id)} 
                            className="text-xs flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white font-medium py-1.5 px-3 rounded-lg transition-colors ml-auto"
                          >
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