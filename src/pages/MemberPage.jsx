import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Award, Calendar, LogOut, 
  FileText, Activity, CheckCircle2, 
  Sparkles, Flame, Info, Loader2, AlertCircle 
} from 'lucide-react';
import { customerService } from '../services/customerService';
import { appointmentService } from '../services/appointmentService';
import { servicesService, formatRupiah } from '../services/servicesService';
import api from '../services/api';

/**
 * Helper: tier badge config
 */
const tierConfig = {
  regular:  { label: 'Regular Member', color: 'bg-slate-500/20 text-slate-300 border-slate-500/30', sparkle: false },
  silver:   { label: 'Silver Member',   color: 'bg-gray-400/20 text-gray-300 border-gray-400/30', sparkle: false },
  gold:     { label: 'Gold Privilege Member', color: 'bg-amber-400/20 text-amber-300 border-amber-400/30', sparkle: true },
  platinum: { label: 'Platinum Elite',  color: 'bg-purple-400/20 text-purple-300 border-purple-400/30', sparkle: true },
};

const tierMinPoints = { regular: 0, silver: 500, gold: 2000, platinum: 5000 };
const tierDiscount = { regular: 0, silver: 5, gold: 10, platinum: 20 };

// Data statis odontogram (fallback sampai medical_records terisi)
const teethUpper = [
  { id: 18, name: 'Geraham Belakang 3', status: 'Sehat', color: 'bg-emerald-500', note: 'Kondisi sangat baik, tidak ada plak.' },
  { id: 17, name: 'Geraham Belakang 2', status: 'Sehat', color: 'bg-emerald-500', note: 'Kondisi bersih pasca scaling.' },
  { id: 16, name: 'Geraham Belakang 1', status: 'Karies Mula', color: 'bg-amber-500', note: 'Indikasi karies ringan, disarankan oles fluor.' },
  { id: 15, name: 'Geraham Kecil 2', status: 'Sehat', color: 'bg-emerald-500', note: 'Bersih.' },
  { id: 14, name: 'Geraham Kecil 1', status: 'Tambalan Komposit', color: 'bg-indigo-500', note: 'Tambalan rapi sejak April 2026.' },
  { id: 13, name: 'Gigi Taring', status: 'Sehat', color: 'bg-emerald-500', note: 'Oklusi normal.' },
  { id: 12, name: 'Gigi Seri 2', status: 'Karies Parah', color: 'bg-rose-500', note: 'Lubang mencapai dentin. Wajib tambal segera!' },
  { id: 11, name: 'Gigi Seri 1', status: 'Sehat', color: 'bg-emerald-500', note: 'Gigi depan simetris dan sehat.' },
];

const teethLower = [
  { id: 41, name: 'Gigi Seri 1 Bawah', status: 'Sehat', color: 'bg-emerald-500', note: 'Karang gigi ringan bawah sudah dibersihkan.' },
  { id: 42, name: 'Gigi Seri 2 Bawah', status: 'Sehat', color: 'bg-emerald-500', note: 'Aman.' },
  { id: 43, name: 'Gigi Taring Bawah', status: 'Sehat', color: 'bg-emerald-500', note: 'Aman.' },
  { id: 44, name: 'Geraham Kecil 1 Bw', status: 'Sehat', color: 'bg-emerald-500', note: 'Aman.' },
  { id: 45, name: 'Geraham Kecil 2 Bw', status: 'Akar Tertinggal', color: 'bg-purple-600', note: 'Sisa akar gigi, direkomendasikan pencabutan.' },
  { id: 46, name: 'Geraham Belakang 1', status: 'Sehat', color: 'bg-emerald-500', note: 'Aman.' },
  { id: 47, name: 'Geraham Belakang 2', status: 'Sehat', color: 'bg-emerald-500', note: 'Aman.' },
  { id: 48, name: 'Geraham Belakang 3', status: 'Impaksi', color: 'bg-gray-700', note: 'Gigi bungsu tumbuh miring. Perlu rontgen Panoramic.' },
];

export default function MemberPage() {
  const navigate = useNavigate();

  // ================= STATE SESSION & DATA =================
  const [sessionUser, setSessionUser] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [ordersData, setOrdersData] = useState([]);
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // ================= STATE FORM BOOKING =================
  const [selectedTooth, setSelectedTooth] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingDoctor, setBookingDoctor] = useState('drg. Fauzan, Sp.RKG');
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [bookingError, setBookingError] = useState('');

  const bookingFormRef = useRef(null);
  const today = new Date().toISOString().split('T')[0];

  // ================= FETCH DATA from SUPABASE =================
  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        setError('');

        // 1. Ambil session dari localStorage
        const stored = localStorage.getItem('userSession');
        if (!stored) {
          navigate('/login');
          return;
        }
        const user = JSON.parse(stored);
        setSessionUser(user);

        // 2. Ambil data customer berdasarkan user_id
        const customer = await customerService.getCustomerByUserId(user.id);
        setCustomerData(customer);

        if (customer) {
          // 3. Ambil orders dari tabel orders
          try {
            const orders = await api.get(`/orders?customer_id=eq.${customer.id}&order=order_date.desc`);
            setOrdersData(orders.data || []);
          } catch (e) {
            console.warn('Orders fetch skipped:', e);
          }

          // 4. Ambil appointments
          try {
            const apts = await appointmentService.getAppointmentsByCustomerId(customer.id);
            setAppointmentsData(apts);
          } catch (e) {
            console.warn('Appointments fetch skipped:', e);
          }
        }
      } catch (err) {
        // Graceful: jika customer blm ada (baru daftar) atau query gagal,
        // jangan tampilkan error keras — cukup log dan render dgn data seadanya
        console.warn('Member data fetch issue (non-critical):', err?.message || err);
        // Pastikan customerData tetap null agar komponen render partial
        setCustomerData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemberData();
  }, [navigate]);

  // ================= HANDLERS =================
  const handleScrollToBooking = () => {
    bookingFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLogout = () => {
    localStorage.removeItem('userSession');
    navigate('/login');
  };

  const handleBookingSubmit = async () => {
    if (!bookingDate || !customerData) return;

    setIsBooking(true);
    setBookingError('');
    setBookingSuccess('');

    try {
      await appointmentService.createAppointment({
        customer_id: customerData.id,
        patient_name: customerData.full_name,
        appointment_date: bookingDate,
        appointment_time: null,
        doctor_name: bookingDoctor,
        source: 'member',
        notes: ''
      });

      setBookingSuccess(`✅ Booking berhasil! Silakan datang ke klinik pada tanggal ${new Date(bookingDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.`);
      
      // Refresh appointments
      const apts = await appointmentService.getAppointmentsByCustomerId(customerData.id);
      setAppointmentsData(apts);
    } catch (err) {
      setBookingError('Gagal menyimpan booking. Silakan coba lagi.');
      console.error('Booking error:', err);
    } finally {
      setIsBooking(false);
    }
  };

  // ================= DERIVED DATA =================
  const tier = customerData?.tier || 'regular';
  const points = customerData?.points || 0;
  const nextTier = tier === 'platinum' ? null : 
    tier === 'gold' ? 'platinum' :
    tier === 'silver' ? 'gold' : 'silver';
  const pointsToNext = nextTier ? (tierMinPoints[nextTier] - points) : 0;
  const progressPercent = nextTier ? 
    Math.min(100, Math.round((points / tierMinPoints[nextTier]) * 100)) : 100;
  const cfg = tierConfig[tier] || tierConfig.regular;
  const disc = tierDiscount[tier] || 0;

  // Format tanggal
  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // ================= LOADING =================
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-sm font-bold text-slate-500 tracking-wide">Sinkronisasi Rekam Medis CRM...</p>
      </div>
    );
  }

  // ================= ERROR =================
  if (error) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] flex flex-col items-center justify-center gap-4 p-8">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <p className="text-sm font-medium text-red-600 text-center max-w-md">{error}</p>
        <button onClick={() => window.location.reload()} className="bg-blue-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all">
          Refresh Halaman
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-800 antialiased font-sans">
      
      {/* ================= NAVBAR ================= */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 h-20 px-6 lg:px-12 flex items-center justify-between sticky top-0 z-50 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-md shadow-blue-200">
            A
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-slate-900 tracking-tight">Azcyra Dental</span>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-wider w-fit">VIP Member Lounge</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a href="/guest" className="text-xs font-medium text-slate-500 hover:text-blue-600 transition hidden sm:block">
            Portal Publik
          </a>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-500 hover:text-rose-600 font-semibold transition-all border border-slate-200 hover:border-rose-200 hover:bg-rose-50 px-5 py-2.5 rounded-2xl text-xs shadow-xs"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </nav>

      {/* ================= MAIN CONTAINER ================= */}
      <main className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8">
        
        {/* UPPER GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* BANNER 1: MEMBER CARD */}
          <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 rounded-3xl p-8 text-white shadow-2xl shadow-indigo-950/20 relative overflow-hidden flex flex-col justify-between min-h-[240px]">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-10 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex justify-between items-start z-10">
              <div className="space-y-1">
                <div className={`inline-flex items-center gap-1.5 ${cfg.color} w-fit px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md ${cfg.sparkle ? 'animate-pulse' : ''}`}>
                  {cfg.sparkle && <Sparkles size={12} />} {cfg.label}
                </div>
                <h1 className="text-2xl font-extrabold tracking-tight pt-2">{customerData?.full_name || sessionUser?.username || 'Member'}</h1>
                <p className="text-indigo-200/80 text-xs">ID Pasien: <span className="font-mono font-bold text-white">#{(customerData?.id || sessionUser?.id) || '-'}</span></p>
                
                <button 
                  onClick={handleScrollToBooking}
                  className="mt-3 block bg-white/10 hover:bg-white/20 text-amber-300 text-[11px] font-bold py-1.5 px-3 rounded-lg transition-all border border-white/10 cursor-pointer"
                >
                  Quick Priority Booking ↓
                </button>
              </div>
              {disc > 0 && (
                <div className="text-right">
                  <span className="text-xs text-slate-400 font-medium block">BENEFIT DISKON</span>
                  <span className="text-4xl font-black text-amber-300 drop-shadow-md">{disc}%<span className="text-xs font-normal text-slate-300"> OFF</span></span>
                </div>
              )}
            </div>

            {/* POINT PROGRESS BAR */}
            <div className="space-y-2 mt-6 z-10">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300 flex items-center gap-1"><Flame size={14} className="text-amber-400" /> {points.toLocaleString('id-ID')} Poin</span>
                {nextTier ? (
                  <span className="text-amber-300">{pointsToNext.toLocaleString('id-ID')} Poin lagi menuju {nextTier.charAt(0).toUpperCase() + nextTier.slice(1)} Tier</span>
                ) : (
                  <span className="text-purple-300">✦ Tier Tertinggi Tercapai!</span>
                )}
              </div>
              <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden p-[2px] border border-white/5">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${
                    tier === 'platinum' ? 'bg-gradient-to-r from-purple-400 via-violet-500 to-purple-300' :
                    'bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300'
                  }`} 
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* BANNER 2: NEXT APPOINTMENT */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Calendar size={16} className="text-blue-500" /> Jadwal Mendatang
                </h3>
                {appointmentsData.some(a => a.status === 'scheduled') && (
                  <span className="text-[10px] bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded-md uppercase">Upcoming</span>
                )}
              </div>
              
              {appointmentsData.filter(a => a.status === 'scheduled').length > 0 ? (
                <div className="space-y-3">
                  {appointmentsData.filter(a => a.status === 'scheduled').slice(0, 3).map((apt) => (
                    <div key={apt.id} className="flex items-start gap-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100/50">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-xs shrink-0">
                        {new Date(apt.appointment_date).getDate()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800">
                          {new Date(apt.appointment_date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate">{apt.doctor_name || 'Dokter akan ditentukan'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400">
                  <Calendar size={24} className="mx-auto text-slate-300 mb-2" />
                  <p className="text-xs font-medium">Belum ada jadwal konsultasi</p>
                  <button onClick={handleScrollToBooking} className="text-[11px] text-blue-600 font-bold mt-2 hover:underline cursor-pointer">
                    Booking sekarang →
                  </button>
                </div>
              )}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-[10px] text-slate-400">
                Total kunjungan: <strong className="text-slate-700">{customerData?.total_orders || 0}x</strong>
                &nbsp;·&nbsp; Total spent: <strong className="text-blue-600">{formatRupiah(customerData?.total_spent || 0)}</strong>
              </p>
            </div>
          </div>

        </div>

        {/* MIDDLE GRID: ODONTOGRAM */}
        <div className="bg-white p-6 lg:p-8 rounded-3xl border border-slate-200/60 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Activity size={22} className="text-blue-600" /> Interactive Odontogram Chart
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Klik pada salah satu elemen kotak nomor gigi untuk meninjau diagnosa rekam medis klinis dari dokter.</p>
            </div>
            <div className="flex flex-wrap gap-3 text-[11px] font-bold bg-slate-50 p-2 rounded-xl border border-slate-200/40">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-xs"></span> Sehat</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-500 rounded-xs"></span> Karies Ringan</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-rose-500 rounded-xs"></span> Karies Parah</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-indigo-500 rounded-xs"></span> Tambalan</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-purple-600 rounded-xs"></span> Sisa Akar</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-gray-700 rounded-xs"></span> Impaksi</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center bg-slate-50 p-4 lg:p-6 rounded-2xl border border-slate-200/40">
            <div className="lg:col-span-3 space-y-6">
              {/* RAHANG ATAS */}
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Lengkung Rahang Atas (Maxilla)</p>
                <div className="flex justify-center gap-1.5 md:gap-3 flex-wrap">
                  {teethUpper.map((gigi) => (
                    <button
                      key={gigi.id}
                      onClick={() => setSelectedTooth(gigi)}
                      className={`w-11 h-14 ${gigi.color} rounded-b-2xl rounded-t-sm p-1 flex flex-col justify-between items-center text-white transition-all transform hover:scale-110 hover:shadow-lg focus:ring-4 focus:ring-blue-200 cursor-pointer ${selectedTooth?.id === gigi.id ? 'ring-4 ring-blue-600 scale-105' : ''}`}
                    >
                      <span className="text-[9px] font-black opacity-60 font-mono">{gigi.id}</span>
                      <div className="w-2.5 h-2.5 bg-white/30 rounded-full"></div>
                      <span className="text-[8px] font-bold tracking-tighter truncate w-full">Reg</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* RAHANG BAWAH */}
              <div className="space-y-1">
                <div className="flex justify-center gap-1.5 md:gap-3 flex-wrap">
                  {teethLower.map((gigi) => (
                    <button
                      key={gigi.id}
                      onClick={() => setSelectedTooth(gigi)}
                      className={`w-11 h-14 ${gigi.color} rounded-t-2xl rounded-b-sm p-1 flex flex-col justify-between items-center text-white transition-all transform hover:scale-110 hover:shadow-lg focus:ring-4 focus:ring-blue-200 cursor-pointer ${selectedTooth?.id === gigi.id ? 'ring-4 ring-blue-600 scale-105' : ''}`}
                    >
                      <span className="text-[8px] font-bold tracking-tighter truncate w-full">Reg</span>
                      <div className="w-2.5 h-2.5 bg-white/30 rounded-full"></div>
                      <span className="text-[9px] font-black opacity-60 font-mono">{gigi.id}</span>
                    </button>
                  ))}
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center pt-1">Lengkung Rahang Bawah (Mandibula)</p>
              </div>
            </div>

            {/* SIDE BOX PANEL */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs h-full flex flex-col justify-center min-h-[160px]">
              {selectedTooth ? (
                <div className="space-y-3 animation-fade-in">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 ${selectedTooth.color} rounded-full`}></span>
                    <h4 className="text-sm font-extrabold text-slate-900">Gigi #{selectedTooth.id}</h4>
                  </div>
                  <p className="text-xs font-bold text-slate-700 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">{selectedTooth.name}</p>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Diagnosa Klinis:</span>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">{selectedTooth.note}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-2 text-slate-400 p-2">
                  <Info size={24} className="mx-auto text-slate-300" />
                  <p className="text-xs font-medium">Silakan klik salah satu nomor gigi di samping untuk membaca rekam medis lengkap.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* BOOKING FORM */}
          <div ref={bookingFormRef} className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-xs space-y-4 scroll-mt-24">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Calendar size={18} className="text-blue-600" /> Priority Booking Scheduler
            </h3>
            <p className="text-xs text-slate-400">
              {tier !== 'regular' 
                ? 'Sebagai member premium, Anda mendapatkan prioritas antrean bypass.'
                : 'Booking jadwal konsultasi gigi Anda sekarang.'}
            </p>
            
            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Tanggal Kunjungan</label>
                <input 
                  type="date" 
                  min={today}
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold outline-none text-slate-700 focus:ring-2 focus:ring-blue-100 transition-all"
                  disabled={isBooking}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Dokter Gigi Pemeriksa</label>
                <select 
                  value={bookingDoctor}
                  onChange={(e) => setBookingDoctor(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold outline-none text-slate-700 focus:ring-2 focus:ring-blue-100 transition-all"
                  disabled={isBooking}
                >
                  <option>drg. Fauzan, Sp.RKG</option>
                  <option>drg. Sarah Amelia</option>
                  <option>drg. Budi Hartono, Sp.Ort</option>
                </select>
              </div>

              {bookingError && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" /> {bookingError}
                </div>
              )}

              {bookingSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-700 font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" /> {bookingSuccess}
                </div>
              )}

              <button 
                onClick={handleBookingSubmit}
                disabled={!bookingDate || isBooking}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl text-xs transition-all shadow-md shadow-blue-100 mt-2 cursor-pointer flex items-center justify-center gap-2"
              >
                {isBooking ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Memproses Booking...</>
                ) : (
                  'Amankan Antrean Priority Member'
                )}
              </button>
            </div>
          </div>

          {/* INVOICE TABLE */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/60 shadow-xs space-y-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <FileText size={18} className="text-blue-600" /> Riwayat Transaksi & Pesanan
            </h3>
            
            {ordersData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="pb-3">Tanggal</th>
                      <th className="pb-3">Biaya</th>
                      <th className="pb-3">Poin</th>
                      <th className="pb-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-slate-700 font-bold">
                    {ordersData.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 text-slate-400 font-mono">{formatDate(order.order_date)}</td>
                        <td className="py-4 text-blue-600 font-black">{formatRupiah(order.total_amount)}</td>
                        <td className="py-4 text-amber-600">+{order.points_earned || 0}</td>
                        <td className="py-4 text-right">
                          <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md inline-flex items-center gap-1 ${
                            order.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                            order.status === 'cancelled' ? 'bg-red-50 text-red-500' :
                            'bg-amber-50 text-amber-600'
                          }`}>
                            {order.status === 'completed' && <CheckCircle2 size={12} />}
                            {order.status === 'completed' ? 'Lunas' :
                             order.status === 'cancelled' ? 'Batal' :
                             order.status === 'confirmed' ? 'Dikonfirmasi' :
                             order.status === 'in_progress' ? 'Diproses' : 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <FileText size={24} className="mx-auto text-slate-300 mb-2" />
                <p className="text-xs font-medium">Belum ada transaksi</p>
              </div>
            )}

            {/* POINTS HISTORY SUMMARY */}
            <div className="mt-4 p-4 bg-gradient-to-r from-slate-800 to-slate-950 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-white border border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-amber-400">
                  <Award size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-black tracking-wide">Loyalty Points</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Tier: <strong className="text-amber-400 uppercase">{tier}</strong> · 
                    Poin: <strong className="text-amber-400">{points.toLocaleString('id-ID')}</strong>
                    {disc > 0 && ` · Diskon ${disc}%`}
                  </p>
                </div>
              </div>
              <span className={`text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider ${
                tier === 'platinum' ? 'text-purple-400 bg-purple-500/10 border border-purple-500/20' :
                tier === 'gold' ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20' :
                'text-slate-400 bg-slate-500/10 border border-slate-500/20'
              }`}>
                {tier === 'platinum' ? '✦ Elite' : tier === 'gold' ? '★ Premium' : tier === 'silver' ? '◆ Silver' : '● Regular'}
              </span>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}