import React, { useState } from 'react';

export default function AutomationPage() {
  const [activeTab, setActiveTab] = useState('marketing'); 
  const [whatsappTemplate, setWhatsappTemplate] = useState(
    "Halo [Nama Pasien], sudah 6 bulan sejak kunjungan terakhir Anda di Azcyra Dental. Yuk, lakukan scaling rutin agar gigi tetap sehat! Pesan jadwal instan Anda di sini: https://react-azra.vercel.app/guest"
  );

  const automationLogs = [
    { time: "16:45:02", event: "Webhook Supabase: Data Reservasi Baru Pasien Umum (Guest) Berhasil Disinkronisasi.", status: "Success" },
    { time: "14:30:15", event: "WhatsApp Gateway Service: Mengirimkan Pengingat Jadwal Otomatis ke +62 852-XXXX-1194.", status: "Success" },
    { time: "08:00:00", event: "System Cron Job: Reset Antrean Harian & Sinkronisasi Slot Jam Operasional Senin - Sabtu.", status: "Success" }
  ];

  return (
    <div className="p-6 bg-slate-900 text-white min-h-screen">
      {/* Header Utama Modul */}
      <div className="mb-8 border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold tracking-wide">Pusat Otomatisasi Sistem (Automation Control)</h1>
        <p className="text-slate-400 text-sm mt-1">Dokumentasi sistem dan modul manajemen otomatisasi operasional Azcyra Dental.</p>
        
        {/* Sistem Navigasi Tab Internal */}
        <div className="flex space-x-2 mt-6">
          <button 
            onClick={() => setActiveTab('marketing')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${activeTab === 'marketing' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            📢 Marketing Automation
          </button>
          <button 
            onClick={() => setActiveTab('service')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${activeTab === 'service' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            ⚙️ Service Automation
          </button>
        </div>
      </div>

      {/* RENDER KONTEN BERDASARKAN TAB YANG DIKLIK */}
      {activeTab === 'marketing' ? (
        /* ================= TAB MARKETING AUTOMATION ================= */
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* 6.2.1 Online Marketing Section */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg font-semibold text-xs">6.2.1</div>
                <h2 className="text-lg font-semibold text-blue-400">Online Marketing Integration</h2>
              </div>
              <p className="text-slate-300 text-sm mb-4">Sinkronisasi otomatis tautan reservasi instan web dengan platform pencarian lokal Google Bisnisku (Google Maps).</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Google My Business Appointment URL</label>
                  <input 
                    type="text" 
                    readOnly 
                    value="https://g.co/kgs/azcyradental/reserve-online" 
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-400 focus:outline-none cursor-not-allowed"
                  />
                </div>
                <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/50 text-xs text-slate-400 space-y-1">
                  <span className="text-emerald-400 font-medium">✓ Status Sistem: Aktif</span>
                  <p>Setiap pencarian lokal kata kunci klinik gigi pada Google Maps akan langsung memunculkan tombol aksi pesanan menuju sistem ini.</p>
                </div>
              </div>
            </div>

            {/* 6.2.2 Sosial Media Marketing Section */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg font-semibold text-xs">6.2.2</div>
                <h2 className="text-lg font-semibold text-purple-400">Social Media Campaign Automation</h2>
              </div>
              <p className="text-slate-300 text-sm mb-4">Pelacakan otomatis konversi dari tautan bio media sosial (Instagram/TikTok) serta pengelolaan broadcast pengingat berkala.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Template WA Reaktivasi Pasien Otomatis (Interval 6 Bulan)</label>
                  <textarea 
                    rows="3"
                    value={whatsappTemplate}
                    onChange={(e) => setWhatsappTemplate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-purple-500 resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-700">
                    <span className="block text-xs text-slate-400">Klik Tautan Bio Sosial Media</span>
                    <span className="text-lg font-bold text-white">1,240 <span className="text-xs font-normal text-emerald-400">+12%</span></span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-700">
                    <span className="block text-xs text-slate-400">Berhasil Reservasi Otomatis</span>
                    <span className="text-lg font-bold text-white">342 Pasien</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      ) : (
        /* ================= TAB SERVICE AUTOMATION ================= */
        <div className="space-y-6">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-semibold text-emerald-400">Automated Service Engine Status</h2>
                <p className="text-slate-400 text-xs mt-0.5">Pemantauan arsitektur pelayanan otomatisasi terintegrasi dari hulu ke hilir.</p>
              </div>
              <div className="flex space-x-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  ● Supabase Database: Connected
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  ● WA Integration API: Live
                </span>
              </div>
            </div>

            {/* Grid 3 Pilar Otomatisasi Pelayanan */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-slate-900 rounded-lg border border-slate-700/60">
                <h3 className="text-sm font-medium text-slate-300 mb-1">1. Alur Reservasi Guest Instan</h3>
                <p className="text-xs text-slate-400">Memotong antrean fisik. Data formulir tanpa akun langsung divalidasi dan dicocokkan dengan slot durasi perawatan gigi secara otomatis.</p>
              </div>
              <div className="p-4 bg-slate-900 rounded-lg border border-slate-700/60">
                <h3 className="text-sm font-medium text-slate-300 mb-1">2. Perhitungan Poin Dinamis</h3>
                <p className="text-xs text-slate-400">Poin loyalitas pasien member dihitung secara otomatis oleh sistem berdasarkan kategori transaksi keanggotaan (Bronze, Silver, Gold).</p>
              </div>
              <div className="p-4 bg-slate-900 rounded-lg border border-slate-700/60">
                <h3 className="text-sm font-medium text-slate-300 mb-1">3. Otomatisasi Template Pesan</h3>
                <p className="text-xs text-slate-400">Sistem otomatis menyusun format pesan teks konfirmasi detail jadwal kunjungan tanpa perlu diketik manual oleh admin.</p>
              </div>
            </div>

            {/* Visualizer Log Real-time */}
            <div>
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">System Service Activities Logs (Latar Belakang)</span>
              <div className="bg-slate-950 rounded-lg p-4 font-mono text-xs space-y-2 border border-slate-800">
                {automationLogs.map((log, index) => (
                  <div key={index} className="flex items-start space-x-2 text-slate-300">
                    <span className="text-slate-500">[{log.time}]</span>
                    <span className="text-cyan-400">[SYSTEM]</span>
                    <span className="flex-1 text-slate-400">{log.event}</span>
                    <span className="text-emerald-400 font-medium">[{log.status}]</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}