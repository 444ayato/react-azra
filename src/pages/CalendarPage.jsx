import React, { useState, useMemo } from 'react';
import PageHeader from '../components/PageHeader';
import scheduleData from '../data/appointments.json';
import { CalendarDays, Clock, User, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, XCircle, Sparkles, MapPin } from 'lucide-react';

export default function CalendarPage() {
  // Menggunakan default view pada Mei 2026 agar senada dengan tema aplikasi Anda
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(4); // 4 = Mei (karena 0-indexed: 0=Jan, 1=Feb, dst.)
  const [selectedDay, setSelectedDay] = useState(14); // Default tanggal terpilih awal

  const namaBulan = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni", 
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  // 1. Hitung spesifikasi kalender bulanan secara dinamis
  const { daysArray, paddingBlanks } = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    // Mengubah index hari (Minggu=0) menjadi format Senin=0, Selasa=1 ... Minggu=6
    const adjustedPadding = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    return {
      daysArray: Array.from({ length: totalDays }, (_, i) => i + 1),
      paddingBlanks: Array.from({ length: adjustedPadding })
    };
  }, [currentYear, currentMonth]);

  // 2. Navigasi ganti bulan
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
    setSelectedDay(1); // Reset ke tanggal 1 tiap ganti bulan
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
    setSelectedDay(1); // Reset ke tanggal 1 tiap ganti bulan
  };

  // String format ISO untuk bulan yang aktif (Contoh: "2026-05")
  const currentYearMonthStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;

  // 3. Cari tanggal berapa saja di bulan ini yang memiliki agenda pasien (untuk Dot Indikator)
  const busyDaysObj = useMemo(() => {
    const slots = {};
    scheduleData.forEach(item => {
      if (item.date.startsWith(currentYearMonthStr)) {
        const dayNum = parseInt(item.date.split('-')[2], 10);
        slots[dayNum] = true;
      }
    });
    return slots;
  }, [currentYearMonthStr]);

  // 4. Ambil & Urutkan daftar janji temu pada tanggal yang sedang diklik user
  const filteredAppointments = useMemo(() => {
    const selectedDateStr = `${currentYearMonthStr}-${String(selectedDay).padStart(2, '0')}`;
    return scheduleData
      .filter(item => item.date === selectedDateStr)
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [currentYearMonthStr, selectedDay]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 bg-slate-50/50 min-h-screen text-slate-800 antialiased">
      
      {/* HEADER WITH PREMIUM GLASS LOOK */}
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-lg text-xs font-black tracking-widest uppercase flex items-center gap-1 border border-indigo-100">
              <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" /> Operations Room
            </span>
          </div>
          <PageHeader title="Clinical Schedule Calendar" subtitle="Manage your daily schedules, doctor rotations, and dental sessions." />
        </div>
        
        {/* Info Praktis Hari Ini */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-4 rounded-2xl shadow-md flex items-center gap-4 border border-indigo-950/20">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
            <CalendarDays className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Selected Date</p>
            <p className="text-sm font-black tracking-tight">{selectedDay} {namaBulan[currentMonth]} {currentYear}</p>
          </div>
        </div>
      </div>

      {/* MAIN SPLIT LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* KOLOM KIRI: DYNAMIC MONTHLY CALENDAR GRID */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6 lg:col-span-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-black text-slate-900 tracking-tight text-base">{namaBulan[currentMonth]} {currentYear}</h3>
              <p className="text-[11px] text-slate-400 font-medium">Klik tanggal untuk memfilter agenda</p>
            </div>
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl border">
              <button onClick={handlePrevMonth} className="p-1.5 hover:bg-white rounded-lg text-slate-600 transition-colors cursor-pointer"><ChevronLeft className="w-4 h-4" /></button>
              <button onClick={handleNextMonth} className="p-1.5 hover:bg-white rounded-lg text-slate-600 transition-colors cursor-pointer"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>

          {/* Label Hari (Senin - Minggu) */}
          <div className="grid grid-cols-7 gap-2 text-center text-[11px] font-black text-slate-400 uppercase tracking-wider">
            <span>M</span><span>S</span><span>R</span><span>K</span><span>J</span><span>S</span><span>M</span>
          </div>

          {/* Grid Tanggal */}
          <div className="grid grid-cols-7 gap-2 text-sm font-bold">
            {/* Render padding kotak kosong untuk awal bulan */}
            {paddingBlanks.map((_, idx) => (
              <div key={`blank-${idx}`} className="p-2.5 text-center text-slate-200 select-none">-</div>
            ))}
            
            {/* Render hari riil */}
            {daysArray.map((day) => {
              const isSelected = selectedDay === day;
              const hasPatients = busyDaysObj[day] === true;

              return (
                <button
                  key={`day-${day}`}
                  onClick={() => setSelectedDay(day)}
                  className={`p-2.5 rounded-xl flex flex-col items-center justify-center relative group transition-all duration-200 cursor-pointer ${
                    isSelected 
                      ? 'bg-gradient-to-br from-indigo-600 to-indigo-800 text-white shadow-md shadow-indigo-600/20 scale-105' 
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span>{day}</span>
                  {/* Indikator Dot Antrean Pasien Nyata dari JSON */}
                  {hasPatients && (
                    <span className={`w-1.5 h-1.5 rounded-full absolute bottom-1 ${
                      isSelected ? 'bg-cyan-300 animate-pulse' : 'bg-indigo-500'
                    }`} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Legenda Kalender */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center justify-around text-[10px] font-bold text-slate-500">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-500" /> Ada Pasien</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-200" /> Hari Kosong</span>
          </div>
        </div>

        {/* KOLOM KANAN: LIVE TIMELINE AGENDA DETAILS */}
        <div className="space-y-4 lg:col-span-7">
          <div className="flex items-center justify-between p-2">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                Schedule Details 
                <span className="text-xs bg-indigo-50 text-indigo-600 font-extrabold px-2.5 py-0.5 rounded-full border border-indigo-100">
                  {selectedDay} {namaBulan[currentMonth]}
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-medium">Daftar urutan kedatangan pasien klinik terdaftar</p>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-100 shadow-2xs">
              Total: {filteredAppointments.length} Pasien
            </span>
          </div>

          {/* Container List Card Janji Temu */}
          <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1 custom-scrollbar">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((event) => (
                <div 
                  key={event.id} 
                  className="bg-white rounded-2xl border border-slate-100 shadow-2xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:shadow-md hover:border-indigo-100 transition-all duration-200"
                >
                  {/* Sisi Kiri: Waktu & Info Pokok Pasien */}
                  <div className="flex gap-4 items-start sm:items-center">
                    {/* Jam Kedatangan */}
                    <div className="bg-slate-50 border border-slate-100 px-3 py-2 rounded-xl flex flex-col items-center justify-center shrink-0 min-w-[70px] group-hover:bg-indigo-50/50 group-hover:border-indigo-200 transition-colors">
                      <Clock className="w-3.5 h-3.5 text-indigo-500 mb-0.5" />
                      <span className="text-xs font-black text-slate-800 tracking-tight">{event.time}</span>
                    </div>

                    {/* Detail Nama & Jenis Tindakan */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-slate-900 text-sm tracking-tight group-hover:text-indigo-600 transition-colors">
                          {event.patientName}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-mono font-medium">#{event.id}</span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-400" /> Tindakan: <span className="text-slate-700 font-bold">{event.type}</span>
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" /> Operatory Main Room
                      </p>
                    </div>
                  </div>

                  {/* Sisi Kanan: Status Badge Dinamis dari JSON */}
                  <div className="self-end sm:self-auto">
                    {event.status === 'Completed' && (
                      <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Selesai
                      </span>
                    )}
                    {event.status === 'Scheduled' && (
                      <span className="bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Scheduled
                      </span>
                    )}
                    {event.status === 'Canceled' && (
                      <span className="bg-rose-50 text-rose-600 border border-rose-100 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Canceled
                      </span>
                    )}
                  </div>

                </div>
              ))
            ) : (
              <div className="bg-white/60 p-12 rounded-3xl border border-dashed border-slate-200 text-center space-y-2">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                  <CalendarDays className="w-6 h-6" />
                </div>
                <h5 className="font-bold text-slate-700 text-sm">Tidak Ada Agenda</h5>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Silakan cari bulan/tanggal lain (misal: coba geser ke bulan <span className="font-bold">Agustus 2025</span> atau <span className="font-bold">Januari 2026</span>) untuk melihat sebaran data rekam medis Anda.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}