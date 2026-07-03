import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Calendar, ShieldCheck, Clock, CheckCircle2, ArrowRight, X, Phone, MapPin, Loader2, AlertCircle, Sparkles, Activity } from 'lucide-react';
import api from '../services/api';
import { servicesService, formatRupiah, formatDuration } from '../services/servicesService';
import { appointmentService } from '../services/appointmentService';
import { customerService } from '../services/customerService';

export default function GuestPage() {
  // State untuk data dari Supabase
  const [layananList, setLayananList] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [servicesError, setServicesError] = useState('');

  // State form reservasi
  const [isBooked, setIsBooked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [namaPasien, setNamaPasien] = useState('');
  const [noTelepon, setNoTelepon] = useState('');
  const [layananTerpilih, setLayananTerpilih] = useState(null);
  const [tanggalKunjungan, setTanggalKunjungan] = useState('');
  const [waktuKunjungan, setWaktuKunjungan] = useState('');

  // Fetch layanan dari Supabase saat komponen mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoadingServices(true);
        const data = await servicesService.getAllServices();
        setLayananList(data);
      } catch (err) {
        setServicesError('Gagal memuat data layanan. Silakan periksa koneksi atau refresh halaman.');
        console.error('Error fetching services:', err);
      } finally {
        setLoadingServices(false);
      }
    };
    fetchServices();
  }, []);

  // Set minimal tanggal ke hari ini
  const today = new Date().toISOString().split('T')[0];

  // Handling submit reservasi
  const handleSubmitReservasi = async () => {
    if (!namaPasien.trim() || !noTelepon.trim() || !tanggalKunjungan || !layananTerpilih) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      // 1. Cari atau buat customer berdasarkan nama
      let customerId = null;
      try {
        const existingCustomers = await api.get(
          `/customers?full_name=eq.${encodeURIComponent(namaPasien.trim())}`
        );
        if (existingCustomers.data.length > 0) {
          customerId = existingCustomers.data[0].id;
        } else {
          await customerService.createCustomer({
            full_name: namaPasien.trim(),
            phone: noTelepon.trim() || null
          });
          // Fetch customer yang baru dibuat
          const created = await api.get(
            `/customers?full_name=eq.${encodeURIComponent(namaPasien.trim())}&order=id.desc`
          );
          if (created.data.length > 0) {
            customerId = created.data[0].id;
          }
        }
      } catch (err) {
        console.warn('Customer creation skipped:', err);
      }

      // 2. Buat appointment
      await appointmentService.createAppointment({
        customer_id: customerId,
        service_id: layananTerpilih.id || null,
        patient_name: namaPasien.trim(),
        appointment_date: tanggalKunjungan,
        appointment_time: waktuKunjungan || null,
        doctor_name: null,
        source: 'guest',
        notes: noTelepon.trim() ? `No. Telepon: ${noTelepon.trim()}` : ''
      });

      // 3. Tampilkan sukses
      setIsBooked(true);
    } catch (err) {
      setSubmitError('Gagal menyimpan reservasi. Silakan coba lagi.');
      console.error('Error submitting appointment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler reset form setelah sukses
  const handleResetForm = () => {
    setNamaPasien('');
    setNoTelepon('');
    setTanggalKunjungan('');
    setWaktuKunjungan('');
    setLayananTerpilih(null);
    setIsBooked(false);
    setSubmitError('');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
      
      {/* BACKGROUND DEKORASI GRADIENT (Gaya Startup Modern) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 blur-3xl -z-10 rounded-full scale-90" />

      {/* HEADER NAVBAR (Efek Glassmorphism Modern) */}
      <nav className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-slate-200/50 px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white w-9 h-9 rounded-xl flex items-center justify-center font-bold text-lg shadow-md shadow-indigo-200">Az</div>
            <div>
              <span className="font-extrabold text-base text-slate-900 block leading-tight tracking-tight">Azra Dental Care</span>
              <span className="text-[10px] text-indigo-600 tracking-wider uppercase font-bold flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> Portal Pasien Publik
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href="/login" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 border border-indigo-200 hover:border-indigo-400 px-4 py-2 rounded-xl transition-all bg-white/50 backdrop-blur-xs shadow-xs">
              Masuk Akun →
            </a>
            <a href="/admin" className="text-xs font-bold text-slate-600 hover:text-indigo-600 border border-slate-200 hover:border-indigo-200 px-4 py-2 rounded-xl transition-all bg-white/80 hidden sm:block shadow-xs">
              Panel Admin
            </a>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="max-w-3xl mx-auto text-center pt-20 pb-16 px-6 space-y-6">
        <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-600 text-xs font-bold px-3.5 py-1.5 rounded-full border border-indigo-100 shadow-xs">
          <Clock className="w-3.5 h-3.5" /> Reservasi Online Cloud Instan 24/7
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl leading-tight">
          Solusi Rawat Gigi Modern <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">
            Tanpa Antre Tradisional
          </span>
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base leading-relaxed font-medium">
          Pilih penanganan medis yang Anda butuhkan, periksa estimasi biaya secara transparan, dan kunci nomor antrean Anda saat ini juga.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <a href="#layanan" className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white text-xs font-bold px-6 py-3 rounded-xl transition-all shadow-md shadow-indigo-100 scale-100 hover:scale-[1.02] active:scale-[0.98]">
            Lihat Katalog Tarif <ArrowRight className="w-3.5 h-3.5" />
          </a>
          <a href="tel:+6281234567890" className="inline-flex items-center gap-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold px-6 py-3 rounded-xl transition-all shadow-xs">
            <Phone className="w-3.5 h-3.5 text-slate-400" /> Hubungi Klinik
          </a>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <main id="layanan" className="max-w-5xl mx-auto px-6 pb-24 grid gap-8 md:grid-cols-3 items-start">
        
        {/* KOLOM KIRI: DAFTAR KATALOG LAYANAN (2/3) */}
        <section className="md:col-span-2 space-y-4">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600" /> Pilihan Tindakan Medis & Tarif Transparan
          </h2>
          
          {/* Loading State */}
          {loadingServices && (
            <div className="flex items-center justify-center py-16 bg-white/50 border border-slate-200/60 rounded-2xl backdrop-blur-sm">
              <div className="text-center space-y-3">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
                <p className="text-sm text-slate-400 font-bold">Sinkronisasi database cloud...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {servicesError && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
              <p className="text-sm text-red-600 font-semibold">{servicesError}</p>
            </div>
          )}

          {/* Daftar Layanan */}
          {!loadingServices && !servicesError && (
            <div className="grid gap-4">
              {layananList.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-slate-200/60 text-center shadow-xs">
                  <p className="text-sm text-slate-400 font-medium">Belum ada katalog layanan aktif saat ini.</p>
                </div>
              ) : (
                layananList.map((layanan) => (
                  <div key={layanan.id} className="bg-white/90 p-5 rounded-2xl border border-slate-200/60 shadow-xs flex flex-col justify-between space-y-4 transition-all hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-50/50 group">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">{layanan.name}</h3>
                          {layanan.category && (
                            <span className="inline-block text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md uppercase tracking-wider mt-1">
                              {layanan.category}
                            </span>
                          )}
                        </div>
                        <span className="text-sm font-black text-indigo-600 whitespace-nowrap bg-indigo-50/50 px-3 py-1 rounded-xl border border-indigo-100/40">
                          {formatRupiah(layanan.price)}
                        </span>
                      </div>
                      {layanan.description && (
                        <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
                          {layanan.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <span className="flex items-center gap-1 text-[11px] text-slate-500 font-semibold bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                        <Activity className="w-3 h-3 text-indigo-500" /> Estimasi Durasi: {formatDuration(layanan.duration_minutes)}
                      </span>

                      {/* MODAL DIALOG RESERVASI */}
                      <Dialog.Root>
                        <Dialog.Trigger asChild>
                          <button 
                            onClick={() => { 
                              setLayananTerpilih(layanan); 
                              setIsBooked(false); 
                              setSubmitError('');
                            }}
                            className="bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                          >
                            Ambil Jadwal <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </Dialog.Trigger>
                        
                        <Dialog.Portal>
                          <Dialog.Overlay className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50" />
                          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 w-full max-w-sm border border-slate-100 shadow-2xl z-50 focus:outline-none">
                            
                            <div className="flex justify-between items-center mb-4">
                              <Dialog.Title className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-indigo-600" /> Formulir Reservasi Instan
                              </Dialog.Title>
                              <Dialog.Close className="text-slate-400 hover:text-slate-600 transition cursor-pointer p-1 rounded-lg hover:bg-slate-50">
                                <X className="w-4 h-4" />
                              </Dialog.Close>
                            </div>

                            {!isBooked ? (
                              <div className="space-y-4">
                                {/* Info layanan terpilih */}
                                <div className="text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 text-slate-500 leading-normal">
                                  <span className="font-medium">Tindakan Medis Terpilih:</span>
                                  <strong className="text-slate-900 block mt-0.5 text-sm">{layananTerpilih?.name}</strong>
                                  <span className="text-indigo-600 font-extrabold mt-1 block text-sm">
                                    {layananTerpilih ? formatRupiah(layananTerpilih.price) : ''}
                                  </span>
                                </div>

                                {/* Field Nama */}
                                <div className="space-y-1.5">
                                  <label className="text-xs font-bold text-slate-700 block tracking-wide">Nama Lengkap Pasien <span className="text-red-400">*</span></label>
                                  <input 
                                    type="text" 
                                    placeholder="Contoh: Budi Santoso" 
                                    value={namaPasien}
                                    onChange={(e) => setNamaPasien(e.target.value)}
                                    className="w-full text-xs px-3.5 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-slate-700 font-medium"
                                    disabled={isSubmitting}
                                    required
                                  />
                                </div>

                                {/* Field No Telepon */}
                                <div className="space-y-1.5">
                                  <label className="text-xs font-bold text-slate-700 block tracking-wide">Nomor WhatsApp / HP <span className="text-red-400">*</span></label>
                                  <input 
                                    type="tel" 
                                    placeholder="Contoh: 081234567890" 
                                    value={noTelepon}
                                    onChange={(e) => setNoTelepon(e.target.value)}
                                    className="w-full text-xs px-3.5 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-slate-700 font-medium"
                                    disabled={isSubmitting}
                                    required
                                  />
                                </div>

                                {/* Field Tanggal */}
                                <div className="space-y-1.5">
                                  <label className="text-xs font-bold text-slate-700 block tracking-wide">Tanggal Kunjungan <span className="text-red-400">*</span></label>
                                  <input 
                                    type="date" 
                                    min={today}
                                    value={tanggalKunjungan}
                                    onChange={(e) => setTanggalKunjungan(e.target.value)}
                                    className="w-full text-xs px-3.5 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-slate-700 font-medium"
                                    disabled={isSubmitting}
                                    required
                                  />
                                </div>

                                {/* Field Waktu */}
                                <div className="space-y-1.5">
                                  <label className="text-xs font-bold text-slate-700 block tracking-wide">Waktu Kedatangan</label>
                                  <select
                                    value={waktuKunjungan}
                                    onChange={(e) => setWaktuKunjungan(e.target.value)}
                                    className="w-full text-xs px-3.5 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-slate-700 font-medium"
                                    disabled={isSubmitting}
                                  >
                                    <option value="">Pilih jam operasional</option>
                                    <option value="09:00">09:00 - 10:00 WIB</option>
                                    <option value="10:00">10:00 - 11:00 WIB</option>
                                    <option value="11:00">11:00 - 12:00 WIB</option>
                                    <option value="13:00">13:00 - 14:00 WIB</option>
                                    <option value="14:00">14:00 - 15:00 WIB</option>
                                    <option value="15:00">15:00 - 16:00 WIB</option>
                                    <option value="16:00">16:00 - 17:00 WIB</option>
                                    <option value="18:30">18:30 - 20:00 WIB</option>
                                  </select>
                                </div>

                                {/* Error message */}
                                {submitError && (
                                  <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-semibold flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 shrink-0" /> {submitError}
                                  </div>
                                )}

                                {/* Tombol Submit */}
                                <button 
                                  onClick={handleSubmitReservasi}
                                  disabled={!namaPasien.trim() || !noTelepon.trim() || !tanggalKunjungan || isSubmitting}
                                  className="w-full h-11 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-100 transition-all cursor-pointer flex items-center justify-center gap-2"
                                >
                                  {isSubmitting ? (
                                    <>
                                      <Loader2 className="w-4 h-4 animate-spin" /> 
                                      Sinkronisasi Cloud CRM...
                                    </>
                                  ) : (
                                    'Kunci Slot Antrean Saya Sekarang'
                                  )}
                                </button>
                              </div>
                            ) : (
                              /* SUCCESS STATE */
                              <div className="text-center py-4 space-y-4">
                                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500 border border-emerald-100 shadow-xs">
                                  <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <div className="space-y-1">
                                  <h3 className="font-extrabold text-slate-900 text-sm">Reservasi Berhasil Dicatat!</h3>
                                  <p className="text-xs text-slate-500 leading-relaxed px-2">
                                    Halo <strong>{namaPasien}</strong>, jadwal Anda telah sukses masuk ke antrean sistem CRM Admin.
                                  </p>
                                  {tanggalKunjungan && (
                                    <p className="text-xs text-indigo-600 font-extrabold pt-2 flex items-center justify-center gap-1">
                                      <span>📅 {new Date(tanggalKunjungan).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}</span>
                                      {waktuKunjungan && <span>• ⏰ {waktuKunjungan} WIB</span>}
                                    </p>
                                  )}
                                </div>
                                <Dialog.Close asChild>
                                  <button 
                                    onClick={handleResetForm}
                                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 rounded-xl transition cursor-pointer"
                                  >
                                    Selesai & Tutup Laporan
                                  </button>
                                </Dialog.Close>
                              </div>
                            )}
                          </Dialog.Content>
                        </Dialog.Portal>
                      </Dialog.Root>

                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </section>

        {/* KOLOM KANAN: INFORMASI KLINIK SIDEBAR (1/3) */}
        <aside className="space-y-4">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Jam Operasional Klinik</h2>
          <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/60 shadow-xs space-y-4">
            <div className="text-xs space-y-2.5">
              <div className="flex justify-between text-slate-500 font-medium"><span>Senin - Sabtu:</span><strong className="text-slate-800">09:00 - 21:00</strong></div>
              <div className="flex justify-between text-slate-500 font-medium"><span>Minggu / Libur:</span><strong className="text-cyan-600 font-bold bg-cyan-50 px-2 py-0.5 rounded-md">Dengan Janji</strong></div>
            </div>
            <div className="pt-4 border-t border-slate-100 space-y-3 text-xs text-slate-500 font-medium">
              <div className="flex items-start gap-2"><MapPin className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" /> <span className="leading-normal text-slate-600">Jl. Jenderal Sudirman No. 45, Kota Pekanbaru</span></div>
              <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-indigo-500 shrink-0" /> <span className="text-slate-600">+62 812-3456-7890</span></div>
            </div>

            {/* CTA DAFTAR MEMBER */}
            <div className="pt-4 border-t border-slate-100">
              <a 
                href="/register"
                className="block w-full text-center bg-gradient-to-r from-indigo-600 to-cyan-600 text-white text-xs font-bold py-3 rounded-xl transition-all shadow-sm hover:shadow-md hover:from-indigo-700 hover:to-cyan-700 scale-100 hover:scale-[1.01]"
              >
                Daftar Member Eksklusif →
              </a>
              <p className="text-[10px] text-slate-400 text-center font-medium mt-2">Dapatkan akumulasi poin loyalitas & tier reward spesial</p>
            </div>
          </div>
        </aside>

      </main>
    </div>
  );
}