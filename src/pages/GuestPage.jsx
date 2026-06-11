import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Calendar, ShieldCheck, Clock, CheckCircle2, ArrowRight, X, Phone, MapPin } from 'lucide-react';

export default function GuestPage() {
  const [isBooked, setIsBooked] = useState(false);
  const [namaPasien, setNamaPasien] = useState("");
  const [layananPilihan, setLayananPilihan] = useState("");

  const katalogLayanan = [
    { nama: "Pembersihan Karang Gigi (Scaling)", harga: "Rp 350.000", durasi: "30-45 Menit", deskripsi: "Membersihkan plak dan karang gigi keras pemicu gusi berdarah." },
    { nama: "Penambalan Komposit Estetis", harga: "Rp 450.000", durasi: "40 Menit", deskripsi: "Tambal gigi berlubang dengan warna natural yang sewarna dengan gigi asli." },
    { nama: "Pencabutan Gigi Bungsu (Odonektomi)", harga: "Rp 2.500.000", durasi: "60 Menit", deskripsi: "Bedah minor untuk mengangkat gigi geraham bungsu yang tumbuh miring." },
    { nama: "Pemasangan Brackets Ortodonti", harga: "Rp 6.000.000", durasi: "90 Menit", deskripsi: "Pemasangan behel gigi berkualitas untuk merapikan struktur rahang." }
  ];

  return (
    <div className="min-h-screen bg-[#fafbfe] text-slate-800 antialiased selection:bg-blue-500 selection:text-white">
      
      {/* HEADER NAVBAR (Shadcn Minimalist Style) */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="bg-[#1376f8] text-white w-9 h-9 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm">Az</div>
            <div>
              <span className="font-bold text-base text-slate-900 block leading-tight">Azra Dental Care</span>
              <span className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold">Portal Pasien</span>
            </div>
          </div>
          <a href="/admin" className="text-xs font-semibold text-slate-600 hover:text-[#1376f8] border border-slate-200 hover:border-[#1376f8]/30 px-3.5 py-2 rounded-xl transition-all bg-white">
            Panel Kontrol Admin →
          </a>
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
      </header>

      {/* MAIN LAYOUT */}
      <main className="max-w-5xl mx-auto px-6 pb-24 grid gap-8 md:grid-cols-3 items-start">
        
        {/* KOLOM KIRI: DAFTAR KATALOG LAYANAN (2/3 Lebar Layar) */}
        <section className="md:col-span-2 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-2">
            <ShieldCheck className="w-4 h-4 text-[#1376f8]" /> Pilihan Tindakan Medis Populer
          </h2>
          
          <div className="grid gap-4">
            {katalogLayanan.map((layanan, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between space-y-4 transition-all hover:border-slate-200/80 hover:shadow-sm">
                <div className="space-y-1">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="font-bold text-sm text-slate-900">{layanan.nama}</h3>
                    <span className="text-sm font-extrabold text-[#1376f8] whitespace-nowrap bg-blue-50/50 px-2.5 py-1 rounded-lg">{layanan.harga}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-xl">{layanan.deskripsi}</p>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                  <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium bg-slate-50 px-2 py-1 rounded-md">
                    <Clock className="w-3 h-3 text-slate-400" /> Estimasi: {layanan.durasi}
                  </span>

                  {/* MODAL DIALOG POP-UP (SHADCN/RADIX STYLE) */}
                  <Dialog.Root>
                    <Dialog.Trigger asChild>
                      <button 
                        onClick={() => { setLayananPilihan(layanan.nama); setIsBooked(false); }}
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
                            <div className="text-xs bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-500 leading-normal">
                              Tindakan Terpilih: <strong className="text-slate-900 block mt-0.5">{layananPilihan}</strong>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-slate-700 block">Nama Lengkap Sesuai KTP</label>
                              <input 
                                type="text" 
                                placeholder="Contoh: Budi Santoso" 
                                value={namaPasien}
                                onChange={(e) => setNamaPasien(e.target.value)}
                                className="w-full text-xs px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1376f8]/20 focus:border-[#1376f8] transition-all text-slate-700"
                              />
                            </div>
                            <button 
                              onClick={() => setIsBooked(true)}
                              disabled={!namaPasien.trim()}
                              className="w-full bg-[#1376f8] hover:bg-opacity-95 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
                            >
                              Konfirmasi Antrean Saya
                            </button>
                          </div>
                        ) : (
                          <div className="text-center py-4 space-y-4">
                            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                              <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <div className="space-y-1">
                              <h3 className="font-bold text-slate-900 text-sm">Nomor Antrean Tersimpan!</h3>
                              <p className="text-xs text-slate-400 leading-relaxed px-2">
                                Halo <strong>{namaPasien}</strong>, jadwal Anda otomatis terkirim ke dashboard CRM internal. Mohon hadir 15 menit sebelum konsultasi.
                              </p>
                            </div>
                            <Dialog.Close asChild>
                              <button 
                                onClick={() => { setNamaPasien(""); }} 
                                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-2 rounded-xl transition"
                              >
                                Selesai
                              </button>
                            </Dialog.Close>
                          </div>
                        )}
                      </Dialog.Content>
                    </Dialog.Portal>
                  </Dialog.Root>

                </div>
              </div>
            ))}
          </div>
        </section>

        {/* KOLOM KANAN: INFORMASI KLINIK SIDEBAR (1/3 Lebar Layar) */}
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
          </div>
        </aside>

      </main>
    </div>
  );
}