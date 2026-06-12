import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Award, Percent, Calendar, LogOut, ShieldCheck, 
  FileText, Activity, CreditCard, CheckCircle2, 
  ChevronRight, Sparkles, Flame, Heart, Info 
} from 'lucide-react';

export default function MemberPage() {
  const navigate = useNavigate();
  
  // State Interaktif untuk klik Gigi di Odontogram
  const [selectedTooth, setSelectedTooth] = useState(null);
  
  // State Kontrol Form Booking
  const [selectedDate, setSelectedDate] = useState('2026-06-15');
  const [selectedDoctor, setSelectedDoctor] = useState('drg. Fauzan, Sp.RKG');

  // Data Komponen Gigi Atas & Bawah (Odontogram Premium)
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

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-800 antialiased font-sans">
      
      {/* ================= NAVBAR PREMIUM ================= */}
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
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-slate-500 hover:text-rose-600 font-semibold transition-all border border-slate-200 hover:border-rose-200 hover:bg-rose-50 px-5 py-2.5 rounded-2xl text-xs shadow-xs"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </nav>

      {/* ================= MAIN CONTAINER ================= */}
      <main className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8">
        
        {/* UPPER GRID: BANNER CARD & TRACKING STEPPER */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* BANNER 1: KARTU GLASSMORPHISM EMAS HOLOGRAPIK */}
          <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 rounded-3xl p-8 text-white shadow-2xl shadow-indigo-950/20 relative overflow-hidden flex flex-col justify-between min-h-[240px]">
            {/* Ornamen Kilau Cahaya */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-10 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex justify-between items-start z-10">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 bg-amber-400/20 text-amber-300 border border-amber-400/30 w-fit px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md animate-pulse">
                  <Sparkles size={12} /> Gold Privilege Member
                </div>
                <h1 className="text-2xl font-extrabold tracking-tight pt-2">Muhammad Rafi Al-zikri</h1>
                <p className="text-indigo-200/80 text-xs">ID Pasien: <span className="font-mono font-bold text-white">AZC-2026-9912</span></p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 font-medium block">BENEFIT DISKON</span>
                <span className="text-4xl font-black text-amber-300 drop-shadow-md">20%<span className="text-xs font-normal text-slate-300"> OFF</span></span>
              </div>
            </div>

            {/* BAR PROGRES GAMIFIKASI MENUJU PLATINUM */}
            <div className="space-y-2 mt-6 z-10">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300 flex items-center gap-1"><Flame size={14} className="text-amber-400" /> 2,450 Poin</span>
                <span className="text-amber-300">550 Poin lagi menuju Platinum Tier</span>
              </div>
              <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden p-[2px] border border-white/5">
                <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 h-full rounded-full transition-all duration-1000" style={{ width: '78%' }}></div>
              </div>
            </div>
          </div>

          {/* BANNER 2: REAL-TIME TREATMENT STEPPER TRACKING */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Heart size={16} className="text-rose-500 animate-bounce" /> Progres Alur Lab Gigi Anda
                </h3>
                <span className="text-[10px] bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded-md uppercase">In Progress</span>
              </div>
              
              {/* Vertical Stepper Alur Pembuatan Behel/Crown Gigi */}
              <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                <div className="flex gap-3 relative z-10">
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-xs"><CheckCircle2 size={14}/></div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Pencetakan 3D Gigi Mandibula</h4>
                    <p className="text-[10px] text-slate-400">Selesai pada 09 Juni 2026 - Oleh drg. Azra</p>
                  </div>
                </div>

                <div className="flex gap-3 relative z-10">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-[10px] shadow-sm animate-pulse">2</div>
                  <div>
                    <h4 className="text-xs font-bold text-blue-600">Fabrikasi Bracket Clear Behel</h4>
                    <p className="text-[10px] text-slate-400">Sedang diproses di laboratorium internal</p>
                  </div>
                </div>

                <div className="flex gap-3 relative z-10 opacity-40">
                  <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold text-[10px]">3</div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-700">Fitting & Pemasangan Klinis</h4>
                    <p className="text-[10px] text-slate-400">Jadwal: Selasa, 16 Juni 2026</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* MIDDLE GRID: ODONTOGRAM PREMIUM & DETAIL KLIK */}
        <div className="bg-white p-6 lg:p-8 rounded-3xl border border-slate-200/60 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Activity size={22} className="text-blue-600" /> Interactive Odontogram Chart
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Klik pada salah satu elemen kotak nomor gigi untuk meninjau diagnosa rekam medis klinis dari dokter.</p>
            </div>
            {/* Status Warna Legenda */}
            <div className="flex flex-wrap gap-3 text-[11px] font-bold bg-slate-50 p-2 rounded-xl border border-slate-200/40">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-xs"></span> Sehat</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-500 rounded-xs"></span> Karies Ringan</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-rose-500 rounded-xs"></span> Karies Parah</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-indigo-500 rounded-xs"></span> Tambalan</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-purple-600 rounded-xs"></span> Sisa Akar</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-gray-700 rounded-xs"></span> Impaksi</span>
            </div>
          </div>

          {/* AREA ARSITEKTUR SUSUNAN GIGI INTERAKTIF */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center bg-slate-50 p-4 lg:p-6 rounded-2xl border border-slate-200/40">
            
            {/* BOX VISUALISASI SUSUNAN GIGI */}
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

            {/* SIDE BOX PANEL DETAIL KLIK DIAGNOSA GIGI */}
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

        {/* BOTTOM GRID: RESERVASI & RIWAYAT NOTA KEUANGAN */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* KOLOM KIRI: FORM RESERVASI JADWAL DOKTER GIGI */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-xs space-y-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Calendar size={18} className="text-blue-600" /> Priority Booking Scheduler
            </h3>
            <p className="text-xs text-slate-400">Selaku pemegang Gold Member, Anda mendapatkan prioritas antrean bypass tanpa perlu menunggu di ruang tunggu.</p>
            
            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Tanggal Kunjungan</label>
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold outline-none text-slate-700 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Dokter Gigi Pemeriksa</label>
                <select 
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold outline-none text-slate-700 focus:ring-2 focus:ring-blue-100 transition-all"
                >
                  <option>drg. Fauzan, Sp.RKG</option>
                  <option>drg. Sarah Amelia</option>
                  <option>drg. Budi Hartono, Sp.Ort</option>
                </select>
              </div>
              <button 
                onClick={() => alert(`Sukses Booking Terjadwal! Kode Booking VIP Anda: VIP-${Math.floor(Math.random() * 9000) + 1000}. Silakan langsung menuju counter VIP klinik saat tiba.`)}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl text-xs transition-all shadow-md shadow-blue-100 mt-2 cursor-pointer"
              >
                Amankan Antrean Priority Member
              </button>
            </div>
          </div>

          {/* KOLOM KANAN: NOTA TAGIHAN & RIWAYAT KEUANGAN */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/60 shadow-xs space-y-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <FileText size={18} className="text-blue-600" /> Invoice Transaksi & Jaminan Asuransi
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="pb-3">Tanggal</th>
                    <th className="pb-3">Tindakan Medis</th>
                    <th className="pb-3">Dokter Gigi</th>
                    <th className="pb-3">Total Biaya</th>
                    <th className="pb-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-slate-700 font-bold">
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 text-slate-400 font-mono">10 Mei 2026</td>
                    <td className="py-4 text-slate-900 text-sm">Scaling & Polishing Premium</td>
                    <td className="py-4 text-slate-500 font-medium">drg. Fauzan</td>
                    <td className="py-4 text-blue-600 font-black">Rp350.000</td>
                    <td className="py-4 text-right">
                      <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-md text-[10px] inline-flex items-center gap-1 font-extrabold">
                        <CheckCircle2 size={12} /> Lunas
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 text-slate-400 font-mono">22 Apr 2026</td>
                    <td className="py-4 text-slate-900 text-sm">Tambal Komposit Gigi #14</td>
                    <td className="py-4 text-slate-500 font-medium">drg. Sarah Amelia</td>
                    <td className="py-4 text-blue-600 font-black">Rp450.000</td>
                    <td className="py-4 text-right">
                      <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-md text-[10px] inline-flex items-center gap-1 font-extrabold">
                        <CheckCircle2 size={12} /> Lunas
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* INTEGRASI KARTU ASURANSI DIGITAL KLIEN */}
            <div className="mt-4 p-4 bg-gradient-to-r from-slate-800 to-slate-950 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-white border border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-amber-400"><CreditCard size={18}/></div>
                <div>
                  <h4 className="text-xs font-black tracking-wide">Admedika Gold Health Insurance</h4>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">Card No: 0012-9981-2026</p>
                </div>
              </div>
              <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md uppercase tracking-wider">
                Connected & Verified
              </span>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}