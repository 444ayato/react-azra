const fs = require('fs');
const path = require('path');

// Bank data dummy bernuansa Indonesia
const namaPria = ['Ahmad', 'Budi', 'Chandra', 'Dedi', 'Eko', 'Fajar', 'Guntur', 'Hadi', 'Irfan', 'Joko', 'Kurniawan', 'Lukman', 'Mahendra', 'Nugroho', 'Prabowo', 'Rian', 'Santoso', 'Taufik', 'Wahyu'];
const textWanita = ['Siti', 'Dewi', 'Putri', 'Rini', 'Anisa', 'Mega', 'Fitri', 'Wati', 'Indah', 'Lestari', 'Ayu', 'Citra', 'Diah', 'Eka', 'Gita', 'Hesti', 'Kartika', 'Lia', 'Maya'];
const namaBelakang = ['Pratama', 'Santoso', 'Hidayat', 'Kusuma', 'Wijaya', 'Saputra', 'Siregar', 'Wibowo', 'Nugroho', 'Gunawan', 'Sari', 'Utami', 'Lestari', 'Rahmawati', 'Permata', 'Nasution'];

const kotaAsal = ['Jakarta', 'Bandung', 'Surabaya', 'Medan', 'Pekanbaru', 'Semarang', 'Makassar', 'Palembang', 'Yogyakarta', 'Malang'];
const marketingSource = ['Instagram Ads', 'Rekomendasi Teman', 'TikTok Video', 'Spanduk Klinik', 'Google Maps/Search', 'Brosur Komplek'];
const metodeBayar = ['Tunai', 'Transfer BCA', 'QRIS Mandiri', 'Kartu Kredit', 'Asuransi Swasta', 'BPJS Kesehatan'];

const daftarTindakan = [
  { nama: 'Pembersihan Karang Gigi (Scaling)', harga: 350000 },
  { nama: 'Penambalan Komposit Estetis', harga: 450000 },
  { nama: 'Pencabutan Gigi Bungsu (Odonektomi)', harga: 2500000 },
  { nama: 'Pemasangan Brackets Ortodonti', harga: 6000000 },
  { nama: 'Perawatan Saluran Akar (Endodontik)', harga: 1200000 },
  { nama: 'Bleaching Gigi (Pemutihan)', harga: 3000000 }
];

const keluhanList = [
  'Gigi linu pas minum air dingin', 'Gigi geraham bawah berlubang dan sakit', 'Gusi sering berdarah saat sikat gigi',
  'Gigi bungsu sakit tumbuh miring', 'Ingin merapikan posisi gigi rahang atas', 'Kontrol rutin behel bulanan',
  'Noda karang gigi menumpuk di bagian dalam', 'Gigi depan patah sedikit akibat benturan', 'Bau mulut tidak sedap', 'Gigi kuning'
];

const statusReactList = ['Healthy', 'Treatment', 'Recovered'];
const statusAppointmentList = ['Scheduled', 'Completed', 'Canceled'];
const jamList = ['09:00', '10:30', '13:00', '14:30', '16:00', '19:30'];

function acakTanggal(start, end) {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
}

let csvContent = "ID Pasien,Nama Lengkap,Jenis Kelamin,Tanggal Lahir,Nomor HP,Alamat/Kota,Tanggal Daftar,Status Aktif,Keluhan Utama/Catatan Medis,Tindakan Gigi,Total Transaksi,Metode Pembayaran,Tanggal Transaksi,Sumber Pasien\n";

const dataPasienJSON = [];
const dataAppointmentsJSON = [];

// Variabel hitung total pendapatan bisnis CRM
let totalPendapatan = 0;

console.log("Sedang memproses 1000 data analisis bisnis CRM...");

for (let i = 1; i <= 1000; i++) {
  const jk = Math.random() > 0.5 ? 'Laki-laki' : 'Perempuan';
  const depan = jk === 'Laki-laki' ? namaPria[Math.floor(Math.random() * namaPria.length)] : textWanita[Math.floor(Math.random() * textWanita.length)];
  const belakang = namaBelakang[Math.floor(Math.random() * namaBelakang.length)];
  const namaLengkap = `${depan} ${belakang}`;
  
  const tglLahir = acakTanggal(new Date(1975, 0, 1), new Date(2015, 11, 31));
  const noHp = `0812${Math.floor(10000000 + Math.random() * 90000000)}`;
  const kota = kotaAsal[Math.floor(Math.random() * kotaAsal.length)];
  const tglDaftar = acakTanggal(new Date(2024, 0, 1), new Date(2026, 4, 1));
  const statusAktif = Math.random() > 0.15 ? 'Aktif' : 'Tidak Aktif';
  
  const keluhan = keluhanList[Math.floor(Math.random() * keluhanList.length)];
  const tindakan = daftarTindakan[Math.floor(Math.random() * daftarTindakan.length)];
  const metode = metodeBayar[Math.floor(Math.random() * metodeBayar.length)];
  
  const tglDaftarObj = new Date(tglDaftar);
  const tglTxObj = new Date(tglDaftarObj.getTime() + Math.random() * 15 * 24 * 60 * 60 * 1000);
  const tglTransaksi = tglTxObj.toISOString().split('T')[0];
  
  const sumber = marketingSource[Math.floor(Math.random() * marketingSource.length)];

  // Akumulasikan harga tindakan ke total pendapatan bisnis
  totalPendapatan += tindakan.harga;

  // A. CSV Excel
  const idExcel = `PSN-${String(i).padStart(4, '0')}`;
  csvContent += `${idExcel},${namaLengkap},${jk},${tglLahir},${noHp},${kota},${tglDaftar},${statusAktif},"${keluhan}",${tindakan.nama},${tindakan.harga},${metode},${tglTransaksi},${sumber}\n`;

  // B. Master Pasien (patients.json)
  const idReact = `P${String(i).padStart(3, '0')}`;
  dataPasienJSON.push({
    id: idReact,
    name: namaLengkap,
    lastVisit: tglTransaksi,
    status: statusReactList[Math.floor(Math.random() * statusReactList.length)]
  });

  // C. Janji Temu (appointments.json)
  dataAppointmentsJSON.push({
    id: `APT-${String(i).padStart(4, '0')}`,
    patientName: namaLengkap,
    date: tglTransaksi,
    time: jamList[Math.floor(Math.random() * jamList.length)],
    type: tindakan.nama,
    status: statusAppointmentList[Math.floor(Math.random() * statusAppointmentList.length)]
  });
}

// Format IDR untuk pendapatan agar cantik di dashboard
const formatRupiah = (angka) => {
  return 'Rp ' + angka.toLocaleString('id-ID');
};

// D. Membuat data ringkasan riil untuk dashboard.json
const dashboardSummary = {
  stats: [
    { id: 1, label: "Total Patients Registered", value: dataPasienJSON.length.toString(), trend: "+12.5%" },
    { id: 2, label: "Total Appointments", value: dataAppointmentsJSON.length.toString(), trend: "+8.2%" },
    { id: 3, label: "Total Revenue (CRM)", value: formatRupiah(totalPendapatan), trend: "+24.1%" }
  ]
};

// Proses tulis semua file fisik
fs.writeFileSync('Data_CRM_1000_Pasien.csv', csvContent, 'utf-8');
const folderData = path.join(__dirname, 'src', 'data');
if (!fs.existsSync(folderData)) { fs.mkdirSync(folderData, { recursive: true }); }

fs.writeFileSync(path.join(folderData, 'patients.json'), JSON.stringify(dataPasienJSON, null, 2), 'utf-8');
fs.writeFileSync(path.join(folderData, 'appointments.json'), JSON.stringify(dataAppointmentsJSON, null, 2), 'utf-8');
// Tulis otomatis ke dashboard.json
fs.writeFileSync(path.join(folderData, 'dashboard.json'), JSON.stringify(dashboardSummary, null, 2), 'utf-8');

console.log("Sukses! File CSV, patients.json, appointments.json, dan dashboard.json telah tersinkronisasi.");