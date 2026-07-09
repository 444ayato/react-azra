import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, UserCircle, ShieldCheck, Stethoscope, ArrowRight, Activity, HeartPulse, Users } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      
      {/* NAVBAR */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white font-black shadow-md shadow-indigo-200">
              A
            </div>
            <span className="font-black text-xl tracking-tight text-slate-900">
              Azra<span className="text-indigo-600">Dental</span>
            </span>
          </div>
          
          {/* Akses Cepat Member */}
          <button 
            onClick={() => navigate('/member')}
            className="border border-slate-200 hover:border-indigo-600 hover:bg-indigo-50/30 text-slate-700 hover:text-indigo-600 font-bold text-sm px-5 py-2.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-2 group"
          >
            <UserCircle className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
            Portal Member
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden py-20 px-6 lg:py-32 bg-gradient-to-b from-white to-slate-50/50">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-8 relative">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full text-xs font-black text-indigo-700 tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> Patient Portal Gateway
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Selamat Datang di <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Azra Dental Care</span>
          </h1>
          
          <p className="text-slate-500 text-base sm:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            Silakan pilih akses layanan di bawah ini untuk melanjutkan pendaftaran sesi dental, reservasi jadwal, atau melihat rekam medis Anda.
          </p>

          {/* TWO MAIN CALL-TO-ACTIONS (GUEST vs MEMBER) */}
          <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            
            {/* Opsi 1: GUEST PAGE */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-xl hover:border-cyan-400 transition-all duration-300 text-left flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-cyan-50 rounded-2xl flex items-center justify-center text-cyan-600">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900">Pasien Umum / Baru (Guest)</h3>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                  Belum punya akun member resmi? Masuk ke sini untuk mendaftar antrean kunjungan pertama kali tanpa ribet.
                </p>
              </div>
              <button 
                onClick={() => navigate('/guest')}
                className="mt-6 w-full bg-slate-900 hover:bg-cyan-600 text-white font-extrabold text-xs py-3.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer group-hover:shadow-md"
              >
                Masuk Halaman Guest
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Opsi 2: MEMBER PAGE */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-xl hover:border-indigo-500 transition-all duration-300 text-left flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                  <UserCircle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900">Pasien Terdaftar (Member)</h3>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                  Gunakan benefit akun member Anda untuk reservasi instan dokter spesialis favorit dan melacak rekam medis berkala.
                </p>
              </div>
              <button 
                onClick={() => navigate('/member')}
                className="mt-6 w-full bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white font-extrabold text-xs py-3.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer group-hover:shadow-md"
              >
                Masuk Portal Member
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="py-12 px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-black tracking-tight text-slate-900">Layanan Klinis Kami</h2>
          <p className="text-xs text-slate-400 font-medium">Penanganan medis profesional didukung oleh tim dokter berpengalaman.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs space-y-3">
            <Stethoscope className="w-5 h-5 text-indigo-600" />
            <h4 className="font-black text-slate-900 text-sm">Odonektomi</h4>
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed">Operasi minor pencabutan gigi bungsu impaksi.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs space-y-3">
            <Activity className="w-5 h-5 text-cyan-600" />
            <h4 className="font-black text-slate-900 text-sm">Endodontik</h4>
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed">Perawatan saluran akar untuk menyelamatkan jaringan pulpa gigi.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs space-y-3">
            <HeartPulse className="w-5 h-5 text-purple-600" />
            <h4 className="font-black text-slate-900 text-sm">Ortodonti</h4>
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed">Pemasangan brackets estetis untuk merapikan struktur gigi.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs space-y-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h4 className="font-black text-slate-900 text-sm">Scaling & Bleaching</h4>
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed">Pembersihan plak gigi komprehensif dan pemutihan estetis.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-100 bg-white py-8 px-6 text-center text-xs text-slate-400 font-medium">
        &copy; {new Date().getFullYear()} Azra Dental Core Enterprise. All rights reserved.
      </footer>
    </div>
  );
}