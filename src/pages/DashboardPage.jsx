import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import dashboardData from '../data/dashboard.json';
import { 
  Filter, DollarSign, Users, CalendarDays, 
  TrendingUp, Zap, Sparkles, Activity, ChevronRight, 
  Download, RefreshCw, Clock, Star,
  UserPlus, Stethoscope, 
  Calendar, FileText,
  ArrowUpRight, Target, Briefcase, Heart,
  BarChart3, PieChart
} from 'lucide-react';

export default function DashboardPage() {
  const [filterAktif, setFilterAktif] = useState('Semua');
  const [timeRange, setTimeRange] = useState('7d');
  const [hoveredCard, setHoveredCard] = useState(null);

  // Data dengan fallback
  const stats = dashboardData.stats || [];
  const revenueByYear = dashboardData.revenueByYear || [];
  const revenueByMember = dashboardData.revenueByMember || [];
  const kunjunganByKota = dashboardData.kunjunganByKota || [];
  const breakdownLayanan = dashboardData.breakdownLayanan || [];
  const sumberPasien = dashboardData.sumberPasien || [];
  const metodePembayaran = dashboardData.metodePembayaran || [];

  // Data tambahan untuk dashboard
  const recentActivities = [
    { time: '2 menit lalu', action: 'Registrasi pasien baru', user: 'Dr. Sarah', icon: UserPlus },
    { time: '15 menit lalu', action: 'Janji temu dikonfirmasi', user: 'John Doe', icon: Calendar },
    { time: '1 jam lalu', action: 'Laporan dibuat', user: 'Root Canal', icon: FileText },
    { time: '3 jam lalu', action: 'Pembayaran diterima', user: 'Rp 2.400.000', icon: DollarSign },
    { time: '5 jam lalu', action: 'Perawatan selesai', user: 'Jane Smith', icon: Stethoscope }
  ];

  const upcomingAppointments = [
    { patient: 'Michael Johnson', time: '10:00 WIB', service: 'Dental Implant', status: 'Confirmed' },
    { patient: 'Sarah Williams', time: '11:30 WIB', service: 'Braces', status: 'Pending' },
    { patient: 'Robert Brown', time: '14:00 WIB', service: 'Root Canal', status: 'Confirmed' }
  ];

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'confirmed': return 'bg-emerald-50 text-emerald-700';
      case 'pending': return 'bg-amber-50 text-amber-700';
      default: return 'bg-blue-50 text-blue-700';
    }
  };

  // Format Rupiah
  const formatRupiah = (value) => {
    if (value >= 1000000000) {
      return `Rp ${(value / 1000000000).toFixed(1)} M`;
    }
    if (value >= 1000000) {
      return `Rp ${(value / 1000000).toFixed(0)} Jt`;
    }
    return `Rp ${value.toLocaleString()}`;
  };

  // Warna untuk chart
  const chartColors = [
    'from-indigo-500 to-indigo-400',
    'from-blue-500 to-blue-400',
    'from-cyan-500 to-cyan-400'
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 bg-slate-50/50 min-h-screen text-slate-800 antialiased">
      
      {/* HEADER & FILTER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white/80 backdrop-blur-md p-5 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase flex items-center gap-1 border border-indigo-100">
              <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" /> 
              Business Intelligence
            </span>
          </div>
          <PageHeader 
            title="Executive Analytics Command Center" 
            subtitle="Advanced data-driven insights compiled from 1,000+ patient records." 
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-2 self-end lg:self-auto">
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200/40 text-xs font-bold shadow-inner">
            {['24h', '7d', '30d', '90d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-xl transition-all duration-300 ${
                  timeRange === range 
                    ? 'bg-gradient-to-r from-slate-900 to-indigo-950 text-white shadow-md' 
                    : 'text-slate-600 hover:bg-white hover:text-slate-900'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200/40">
            <div className="flex items-center gap-1 text-slate-500 px-2 border-r border-slate-200">
              <Filter className="w-3.5 h-3.5 text-indigo-500" />
              <span className="hidden sm:inline text-[10px] font-bold">Segment:</span>
            </div>
            {['Semua', 'Aktif', 'Tidak Aktif'].map((status) => (
              <button 
                key={status}
                onClick={() => setFilterAktif(status)}
                className={`px-3 py-1.5 rounded-xl transition-all duration-300 text-[10px] font-bold ${
                  filterAktif === status 
                    ? 'bg-gradient-to-r from-slate-900 to-indigo-950 text-white shadow-md' 
                    : 'text-slate-600 hover:bg-white hover:text-slate-900'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <button className="p-2 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 transition-all hover:shadow-md">
            <RefreshCw className="w-4 h-4 text-slate-500 hover:text-indigo-600" />
          </button>
          <button className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-sm">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((item, index) => (
          <div 
            key={item.id}
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
            className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            <div className={`absolute -right-8 -bottom-8 w-32 h-32 rounded-full transition-all duration-700 ${
              hoveredCard === index ? 'scale-150 opacity-100' : 'scale-100 opacity-0'
            } ${
              index === 0 ? 'bg-blue-100/30' :
              index === 1 ? 'bg-purple-100/30' :
              'bg-emerald-100/30'
            }`} />
            
            <div className="space-y-1.5 relative z-10">
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{item.label}</p>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">{item.value}</h3>
              <div className="flex items-center gap-1.5">
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
                  index === 2 ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'
                }`}>
                  <TrendingUp className="w-3 h-3" /> {item.trend || '+12.5%'}
                </span>
                <span className="text-[9px] text-slate-400 font-semibold">vs last period</span>
              </div>
            </div>

            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center relative z-10 shadow-sm transition-all duration-300 group-hover:scale-110 ${
              index === 0 ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white' :
              index === 1 ? 'bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white' :
              'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white'
            }`}>
              {index === 0 && <Users className="w-5 h-5" />}
              {index === 1 && <CalendarDays className="w-5 h-5" />}
              {index === 2 && <DollarSign className="w-5 h-5" />}
            </div>
          </div>
        ))}
      </div>

      {/* MAIN CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Revenue Trend Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h4 className="font-black text-slate-900 tracking-tight text-base flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-500" />
                Revenue Trend by Year
              </h4>
              <p className="text-[10px] text-slate-400 font-medium">Annual revenue performance overview</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" /> +24.1%
              </span>
            </div>
          </div>
          
          <div className="relative h-56">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {[0, 25, 50, 75, 100].map((val) => (
                <div key={val} className="border-t border-slate-100/50 w-full">
                  <span className="text-[8px] text-slate-300 -mt-2 block">{val}%</span>
                </div>
              ))}
            </div>
            
            {/* Bars */}
            <div className="relative h-full flex items-end justify-around gap-6 pt-8 pb-8">
              {revenueByYear.map((data, idx) => {
                const maxValue = Math.max(...revenueByYear.map(d => d.revenue));
                const height = (data.revenue / maxValue) * 100;
                const isHighest = data.revenue === maxValue;
                
                return (
                  <div key={idx} className="flex flex-col items-center gap-2 w-full group">
                    <div className="relative w-full flex justify-center">
                      {/* Tooltip */}
                      <div className="absolute -top-10 bg-slate-800 text-white px-2.5 py-1 rounded-lg text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                        {formatRupiah(data.revenue)}
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                      </div>
                      
                      {/* Bar dengan animasi */}
                      <div className="relative w-full max-w-[56px]">
                        <div 
                          className={`w-full bg-gradient-to-t ${chartColors[idx]} rounded-xl transition-all duration-700 ease-out group-hover:scale-y-105 origin-bottom shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40`}
                          style={{ 
                            height: `${Math.max(height, 15)}%`,
                            minHeight: '20px'
                          }}
                        />
                        {isHighest && (
                          <div className="absolute -top-1 -right-1">
                            <span className="text-[8px] bg-amber-400 text-amber-900 px-1.5 py-0.5 rounded-full font-black animate-pulse">
                              BEST
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[11px] font-bold text-slate-700">{data.year}</span>
                      <span className="text-[8px] text-slate-400 font-medium">
                        {formatRupiah(data.revenue)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Legend / Summary */}
          <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-4">
              <span className="text-[9px] text-slate-400 font-medium">
                Total 3 Years: <span className="font-bold text-slate-700">{formatRupiah(revenueByYear.reduce((acc, curr) => acc + curr.revenue, 0))}</span>
              </span>
            </div>
            <div className="flex gap-3">
              <span className="text-[9px] text-slate-400 font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                Highest: <span className="font-bold text-slate-700">{formatRupiah(Math.max(...revenueByYear.map(d => d.revenue)))}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Revenue by Member */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-2 mb-1">
            <PieChart className="w-4 h-4 text-purple-500" />
            <h4 className="font-black text-slate-900 tracking-tight text-base">Revenue by Member</h4>
          </div>
          <p className="text-[10px] text-slate-400 font-medium mb-4">Distribution by membership status</p>
          
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-36 h-36">
              <div className="w-full h-full rounded-full border-4 border-slate-100 shadow-lg transition-all duration-500 hover:scale-105" style={{
                background: `conic-gradient(${revenueByMember.map((m, i) => {
                  const start = revenueByMember.slice(0, i).reduce((acc, curr) => acc + curr.percentage, 0);
                  return `${m.color} ${start}% ${start + m.percentage}%`;
                }).join(', ')})`
              }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-white flex flex-col items-center justify-center shadow-inner border-2 border-slate-50">
                    <Activity className="w-4 h-4 text-indigo-500 mb-0.5" />
                    <span className="text-[8px] font-black text-slate-700 leading-none">Revenue</span>
                    <span className="text-[6px] text-slate-400 font-bold">Distribution</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="w-full grid grid-cols-2 gap-2 text-[10px] font-bold">
              {revenueByMember.map(m => (
                <div key={m.status} className="flex items-center justify-between bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                    <span className="text-slate-600">{m.status}</span>
                  </span>
                  <span className="text-slate-900 font-black bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[9px]">
                    {m.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECOND ROW CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* City Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-blue-500" />
            <h4 className="font-black text-slate-900 tracking-tight text-base">Patient Distribution</h4>
          </div>
          <p className="text-[10px] text-slate-400 font-medium mb-3">Top cities by patient visits</p>
          
          <div className="space-y-3">
            {kunjunganByKota.slice(0, 5).map((k, index) => {
              const maxKunjungan = Math.max(...kunjunganByKota.map(k => k.kunjungan));
              const percentage = (k.kunjungan / maxKunjungan) * 100;
              const colors = ['from-indigo-500 to-indigo-400', 'from-blue-500 to-blue-400', 'from-cyan-500 to-cyan-400', 'from-teal-500 to-teal-400', 'from-emerald-500 to-emerald-400'];
              
              return (
                <div key={k.kota} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="flex items-center gap-2 text-slate-600">
                      <span className="text-[9px] bg-slate-100 text-slate-500 w-5 h-5 rounded-full flex items-center justify-center font-black">
                        {index + 1}
                      </span>
                      {k.kota}
                    </span>
                    <span className="text-slate-900 font-extrabold">{k.kunjungan} visits</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className={`bg-gradient-to-r ${colors[index % colors.length]} h-full rounded-full transition-all duration-1000`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Service Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-amber-500" />
            <h4 className="font-black text-slate-900 tracking-tight text-base">Service Revenue</h4>
          </div>
          <p className="text-[10px] text-slate-400 font-medium mb-3">Member vs Non-Member breakdown</p>
          
          <div className="space-y-3 max-h-52 overflow-y-auto custom-scrollbar pr-1">
            {breakdownLayanan.slice(0, 5).map((l, idx) => {
              const total = l.member + l.nonMember;
              const memberPct = (l.member / total) * 100;
              const nonMemberPct = (l.nonMember / total) * 100;
              
              return (
                <div key={idx} className="space-y-1.5 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-800 truncate max-w-[120px]">{l.layanan}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold text-slate-600">{formatRupiah(total)}</span>
                      <span className="text-[8px] text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                        {total > 100000000 ? 'High' : 'Medium'}
                      </span>
                    </div>
                  </div>
                  <div className="flex h-2.5 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-700" 
                      style={{ width: `${memberPct}%` }}
                    />
                    <div 
                      className="bg-gradient-to-r from-blue-400 to-indigo-600 transition-all duration-700" 
                      style={{ width: `${nonMemberPct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[8px] text-slate-400 font-bold">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500"/>Member: {formatRupiah(l.member)}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"/>Non: {formatRupiah(l.nonMember)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Patient Sources */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <h4 className="font-black text-slate-900 tracking-tight text-base">Patient Sources</h4>
          </div>
          <p className="text-[10px] text-slate-400 font-medium mb-3">Marketing channel effectiveness</p>
          
          <div className="space-y-3">
            {sumberPasien.slice(0, 5).map((s, index) => {
              const maxKunjungan = Math.max(...sumberPasien.map(s => s.kunjungan));
              const percentage = (s.kunjungan / maxKunjungan) * 100;
              const colors = ['from-violet-500 to-purple-500', 'from-pink-500 to-rose-500', 'from-orange-500 to-amber-500', 'from-cyan-500 to-blue-500', 'from-emerald-500 to-green-500'];
              
              return (
                <div key={s.sumber} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="flex items-center gap-2 text-slate-600">
                      <span className="text-[9px] bg-slate-100 text-slate-500 w-5 h-5 rounded-full flex items-center justify-center font-black">
                        {index + 1}
                      </span>
                      <span className="truncate max-w-[100px]">{s.sumber}</span>
                    </span>
                    <span className="text-slate-900 font-extrabold">{s.kunjungan}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className={`bg-gradient-to-r ${colors[index % colors.length]} h-full rounded-full transition-all duration-1000`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* THIRD ROW: Payment Methods & Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Payment Methods */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-purple-500" />
            <h4 className="font-black text-slate-900 tracking-tight text-base">Payment Methods</h4>
          </div>
          <p className="text-[10px] text-slate-400 font-medium mb-4">Transaction preferences distribution</p>
          
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative w-32 h-32 shrink-0">
              <div className="w-full h-full rounded-full border-4 border-slate-100 shadow-lg transition-all duration-500 hover:scale-105" style={{
                background: `conic-gradient(${metodePembayaran.map((p, i) => {
                  const start = metodePembayaran.slice(0, i).reduce((acc, curr) => acc + curr.persen, 0);
                  return `${p.color} ${start}% ${start + p.persen}%`;
                }).join(', ')})`
              }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white flex flex-col items-center justify-center shadow-inner border-2 border-slate-50">
                    <DollarSign className="w-4 h-4 text-indigo-500" />
                    <span className="text-[6px] font-black text-slate-700">Methods</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 w-full text-[9px] font-bold">
              {metodePembayaran.map(p => (
                <div key={p.metode} className="flex items-center justify-between bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-100">
                  <span className="flex items-center gap-1.5 truncate text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                    {p.metode}
                  </span>
                  <span className="text-slate-900 font-black bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[8px]">
                    {p.persen}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Clinic Summary */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-rose-500" />
            <h4 className="font-black text-slate-900 tracking-tight text-base">Clinic Summary</h4>
          </div>
          <p className="text-[10px] text-slate-400 font-medium mb-4">Key performance indicators</p>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3.5 rounded-xl border border-blue-100 hover:shadow-md transition-shadow">
              <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Total Revenue</p>
              <p className="text-base font-black text-indigo-700">Rp 2.36 M</p>
              <span className="text-[8px] text-emerald-600 font-bold flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> 24.1%
              </span>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-3.5 rounded-xl border border-emerald-100 hover:shadow-md transition-shadow">
              <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Total Patients</p>
              <p className="text-base font-black text-emerald-700">1.000</p>
              <span className="text-[8px] text-emerald-600 font-bold flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> 12.5%
              </span>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-3.5 rounded-xl border border-purple-100 hover:shadow-md transition-shadow">
              <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Appointments</p>
              <p className="text-base font-black text-purple-700">1.000</p>
              <span className="text-[8px] text-emerald-600 font-bold flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> 8.2%
              </span>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-3.5 rounded-xl border border-amber-100 hover:shadow-md transition-shadow">
              <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Top Service</p>
              <p className="text-sm font-black text-amber-700">Brackets</p>
              <span className="text-[8px] text-slate-400">Rp 410 Jt</span>
            </div>
          </div>
          
          <div className="mt-4 p-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[8px] font-bold uppercase tracking-wider opacity-80">Active Patients</p>
                <p className="text-lg font-black">892</p>
              </div>
              <div className="text-right">
                <p className="text-[8px] font-bold uppercase tracking-wider opacity-80">Conversion Rate</p>
                <p className="text-lg font-black">89.2%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: Activities & Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Recent Activities */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-black text-slate-900 tracking-tight text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-500" />
                Recent Activities
              </h4>
              <p className="text-[10px] text-slate-400 font-medium">Latest clinic activities</p>
            </div>
            <button className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-all">
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div key={index} className="flex items-center gap-3 text-sm border-b border-slate-50 pb-3 last:border-0 last:pb-0 hover:bg-slate-50/50 p-2 rounded-xl transition-all">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    index === 0 ? 'bg-emerald-50 text-emerald-600' :
                    index === 1 ? 'bg-blue-50 text-blue-600' :
                    index === 2 ? 'bg-purple-50 text-purple-600' :
                    index === 3 ? 'bg-amber-50 text-amber-600' :
                    'bg-rose-50 text-rose-600'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-700">{activity.action}</p>
                    <p className="text-[10px] text-slate-400">by {activity.user}</p>
                  </div>
                  <span className="text-[9px] text-slate-400 font-medium bg-slate-50 px-2 py-1 rounded-lg">{activity.time}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-black text-slate-900 tracking-tight text-base flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-500" />
                Upcoming Appointments
              </h4>
              <p className="text-[10px] text-slate-400 font-medium">Today's schedule</p>
            </div>
            <button className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-all">
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {upcomingAppointments.map((app, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl border border-slate-100 hover:bg-white hover:shadow-sm transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold shadow-md group-hover:scale-110 transition-transform">
                    {app.patient.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{app.patient}</p>
                    <p className="text-[9px] text-slate-500">{app.service}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-bold text-slate-600 bg-white px-2 py-1 rounded-lg border border-slate-200">
                    {app.time}
                  </span>
                  <span className={`text-[8px] font-bold px-2 py-1 rounded-lg ${getStatusColor(app.status)}`}>
                    {app.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM STATS BAR */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
            <Star className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Satisfaction</p>
            <p className="text-sm font-black text-slate-900">4.8 ★</p>
          </div>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
            <Target className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Conversion</p>
            <p className="text-sm font-black text-slate-900">92%</p>
          </div>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Services</p>
            <p className="text-sm font-black text-slate-900">6</p>
          </div>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center">
            <Heart className="w-4 h-4 text-rose-600" />
          </div>
          <div>
            <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Retention</p>
            <p className="text-sm font-black text-slate-900">87%</p>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}