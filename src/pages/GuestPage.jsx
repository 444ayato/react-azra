import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Calendar, ShieldCheck, Clock, CheckCircle2, ArrowRight, X, Phone, MapPin, Loader2, AlertCircle } from 'lucide-react';
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
        setServicesError('Gagal memuat data layanan. Silakan refresh halaman.');
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
    if (!namaPasien.trim() || !tanggalKunjungan || !layananTerpilih) return;

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
    <div className="min-h-screen bg-[#fafbfe] text-slate-800 antialiased selection:bg-blue-500 selection:text-white">
      
      {/* HEADER NAVBAR */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="bg-[#1376f8] text-white w-9 h-9 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm">Az</div>
            <div>
              <span className="font-bold text-base text-slate-900 block leading-tight">Azra Dental Care</span>
              <span className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold">Portal Pasien</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href="/login" className="text-xs font-semibold text-[#1376f8] hover:text-blue-700 border border-[#1376f8]/30 hover:border-[#1376f8]/60 px-3.5 py-2 rounded-xl transition-all">
              Masuk →
            </a>
            <a href="/admin" className="text-xs font-semibold text-slate-600 hover:text-[#1376f8] border border-slate-200 hover:border-[#1376f8]/30 px-3.5 py-2 rounded-xl transition-all bg-white hidden sm:block">
              Panel Admin
            </a>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="max-w-3xl mx-auto text-center pt-16 pb-12 px-6 space-y-4">
        <span className="inline-flex items-center gap-1.5 bg-blue-50 text-[#1376f8] text-xs font-medium px-3 py-1.5 rounded-full border border-blue-100/50">
          <Clock className="w-3.5 h-3.5" /> Reservasi Online Instan 24/7
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
          Solusi Rawat Gigi Tanpa Antre Lama
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
          Pilih penanganan medis yang Anda butuhkan, periksa estimasi biaya secara transparan, dan kunci nomor antrean Anda sekarang juga.
        </p>
        <div className="flex justify-center gap-4 pt-2">
          <a href="#layanan" className="inline-flex items-center gap-1.5 bg-[#1376f8] hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer">
            Lihat Layanan <ArrowRight className="w-3.5 h-3.5" />
          </a>
          <a href="tel:+6281234567890" className="inline-flex items-center gap-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm">
            <Phone className="w-3.5 h-3.5" /> Hubungi Klinik
          </a>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <main id="layanan" className="max-w-5xl mx-auto px-6 pb-24 grid gap-8 md:grid-cols-3 items-start">
        
        {/* KOLOM KIRI: DAFTAR KATALOG LAYANAN (2/3) */}
        <section className="md:col-span-2 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-2">
            <ShieldCheck className="w-4 h-4 text-[#1376f8]" /> Pilihan Tindakan Medis
          </h2>
          
          {/* Loading State */}
          {loadingServices && (
            <div className="flex items-center justify-center py-16">
              <div className="text-center space-y-3">
                <Loader2 className="w-8 h-8 text-[#1376f8] animate-spin mx-auto" />
                <p className="text-sm text-slate-400 font-medium">Memuat daftar layanan...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {servicesError && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
              <p className="text-sm text-red-600 font-medium">{servicesError}</p>
            </div>
          )}

          {/* Daftar Layanan dari Supabase */}
          {!loadingServices && !servicesError && (
            <div className="grid gap-4">
              {layananList.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center">
                  <p className="text-sm text-slate-400">Belum ada layanan tersedia saat ini.</p>
                </div>
              ) : (
                layananList.map((layanan) => (
                  <div key={layanan.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between space-y-4 transition-all hover:border-slate-200/80 hover:shadow-sm">
                    <div className="space-y-1">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="font-bold text-sm text-slate-900">{layanan.name}</h3>
                          {layanan.category && (
                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                              {layanan.category}
                            </span>
                          )}
                        </div>
                        <span className="text-sm font-extrabold text-[#1376f8] whitespace-nowrap bg-blue-50/50 px-2.5 py-1 rounded-lg">
                          {formatRupiah(layanan.price)}
                        </span>
                      </div>
                      {layanan.description && (
                        <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
                          {layanan.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                      <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium bg-slate-50 px-2 py-1 rounded-md">
                        <Clock className="w-3 h-3 text-slate-400" /> Estimasi: {formatDuration(layanan.duration_minutes)}
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
                            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                          >
                            Ambil Jadwal <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </Dialog.Trigger>
                        
                        <Dialog.Portal>
                          <Dialog.Overlay className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 animate-fade-in" />
                          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 w-full max-w-sm border border-slate-100 shadow-2xl z-50 focus:outline-none">
                            
                            <div className="flex justify-between items-center mb-4">
                              <Dialog.Title className="font-bold text-sm text-slate-900 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-[#1376f8]" /> Formulir Reservasi
                              </Dialog.Title>
                              <Dialog.Close className="text-slate-400 hover:text-slate-600 transition cursor-pointer">
                                <X className="w-4 h-4" />
                              </Dialog.Close>
                            </div>

                            {!isBooked ? (
                              <div className="space-y-4">
                                {/* Info layanan terpilih */}
                                <div className="text-xs bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-500 leading-normal">
                                  <span>Tindakan Terpilih:</span>
                                  <strong className="text-slate-900 block mt-0.5">{layananTerpilih?.name}</strong>
                                  <span className="text-[#1376f8] font-bold mt-1 block">
                                    {layananTerpilih ? formatRupiah(layananTerpilih.price) : ''}
                                  </span>
                                </div>

                                {/* Field Nama */}
                                <div className="space-y-1.5">
                                  <label className="text-xs font-bold text-slate-700 block">Nama Lengkap <span className="text-red-400">*</span></label>
                                  <input 
                                    type="text" 
                                    placeholder="Contoh: Budi Santoso" 
                                    value={namaPasien}
                                    onChange={(e) => setNamaPasien(e.target.value)}
                                    className="w-full text-xs px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1376f8]/20 focus:border-[#1376f8] transition-all text-slate-700"
                                    disabled={isSubmitting}
                                    required
                                  />
                                </div>

                                {/* Field No Telepon */}
                                <div className="space-y-1.5">
                                  <label className="text-xs font-bold text-slate-700 block">Nomor Telepon / WhatsApp</label>
                                  <input 
                                    type="tel" 
                                    placeholder="Contoh: 0812-3456-7890" 
                                    value={noTelepon}
                                    onChange={(e) => setNoTelepon(e.target.value)}
                                    className="w-full text-xs px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1376f8]/20 focus:border-[#1376f8] transition-all text-slate-700"
                                    disabled={isSubmitting}
                                  />
                                </div>

                                {/* Field Tanggal */}
                                <div className="space-y-1.5">
                                  <label className="text-xs font-bold text-slate-700 block">Tanggal Kunjungan <span className="text-red-400">*</span></label>
                                  <input 
                                    type="date" 
                                    min={today}
                                    value={tanggalKunjungan}
                                    onChange={(e) => setTanggalKunjungan(e.target.value)}
                                    className="w-full text-xs px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1376f8]/20 focus:border-[#1376f8] transition-all text-slate-700"
                                    disabled={isSubmitting}
                                    required
                                  />
                                </div>

                                {/* Field Waktu */}
                                <div className="space-y-1.5">
                                  <label className="text-xs font-bold text-slate-700 block">Waktu Kunjungan (Opsional)</label>
                                  <select
                                    value={waktuKunjungan}
                                    onChange={(e) => setWaktuKunjungan(e.target.value)}
                                    className="w-full text-xs px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1376f8]/20 focus:border-[#1376f8] transition-all text-slate-700"
                                    disabled={isSubmitting}
                                  >
                                    <option value="">Pilih waktu (opsional)</option>
                                    <option value="09:00">09:00 - 10:00</option>
                                    <option value="10:00">10:00 - 11:00</option>
                                    <option value="11:00">11:00 - 12:00</option>
                                    <option value="13:00">13:00 - 14:00</option>
                                    <option value="14:00">14:00 - 15:00</option>
                                    <option value="15:00">15:00 - 16:00</option>
                                    <option value="16:00">16:00 - 17:00</option>
                                  </select>
                                </div>

                                {/* Error message */}
                                {submitError && (
                                  <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-medium flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 shrink-0" /> {submitError}
                                  </div>
                                )}

                                {/* Tombol Submit */}
                                <button 
                                  onClick={handleSubmitReservasi}
                                  disabled={!namaPasien.trim() || !tanggalKunjungan || isSubmitting}
                                  className="w-full bg-[#1376f8] hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold py-2.5 rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                                >
                                  {isSubmitting ? (
                                    <>
                                      <Loader2 className="w-4 h-4 animate-spin" /> 
                                      Menyimpan Reservasi...
                                    </>
                                  ) : (
                                    'Konfirmasi Antrean Saya'
                                  )}
                                </button>
                              </div>
                            ) : (
                              /* SUCCESS STATE */
                              <div className="text-center py-4 space-y-4">
                                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                                  <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <div className="space-y-1">
                                  <h3 className="font-bold text-slate-900 text-sm">Reservasi Berhasil!</h3>
                                  <p className="text-xs text-slate-400 leading-relaxed px-2">
                                    Halo <strong>{namaPasien}</strong>, jadwal Anda telah tercatat di sistem CRM internal.
                                  </p>
                                  {tanggalKunjungan && (
                                    <p className="text-xs text-[#1376f8] font-bold pt-1">
                                      📅 {new Date(tanggalKunjungan).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                      {waktuKunjungan && ` ⏰ ${waktuKunjungan}`}
                                    </p>
                                  )}
                                </div>
                                <Dialog.Close asChild>
                                  <button 
                                    onClick={handleResetForm}
                                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-2 rounded-xl transition cursor-pointer"
                                  >
                                    Buat Reservasi Lain
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
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Jam Operasional</h2>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <div className="text-xs space-y-2">
              <div className="flex justify-between text-slate-500"><span>Senin - Sabtu:</span><strong className="text-slate-800">09:00 - 21:00</strong></div>
              <div className="flex justify-between text-slate-500"><span>Minggu:</span><strong className="text-amber-600 font-semibold">Dengan Perjanjian</strong></div>
            </div>
            <div className="pt-4 border-t border-slate-50 space-y-2.5 text-xs text-slate-500">
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-400 shrink-0" /> <span>Jl. Jenderal Sudirman No. 45, Pekanbaru</span></div>
              <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-slate-400 shrink-0" /> <span>+62 812-3456-7890</span></div>
            </div>

            {/* CTA Daftar Member */}
            <div className="pt-4 border-t border-slate-50">
              <a 
                href="/register"
                className="block w-full text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md hover:from-blue-700 hover:to-indigo-700"
              >
                Daftar Member untuk Diskon →
              </a>
              <p className="text-[10px] text-slate-400 text-center mt-2">Dapatkan poin loyalitas & harga spesial</p>
            </div>
          </div>
        </aside>

      </main>
    </div>
  );
}