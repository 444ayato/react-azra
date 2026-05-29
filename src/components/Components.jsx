import React, { useState } from 'react';
import PageHeader from './PageHeader';

// =========================================================================
// 1. BASIC COMPONENTS (MATERI 1)
// =========================================================================

function Button({ children, type = "primary", onClick, ...props }) {
  const types = {
    primary: "bg-[#1376f8] hover:bg-opacity-90 text-white",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white",
    success: "bg-[#17bf28] hover:bg-opacity-90 text-white",
    danger: "bg-[#e52323] hover:bg-opacity-90 text-white",
    warning: "bg-[#ec942c] hover:bg-opacity-90 text-white",
  };
  return (
    <button 
      onClick={onClick}
      className={`${types[type]} px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 active:scale-95 shadow-sm`}
      {...props}
    >
      {children}
    </button>
  );
}

function Badge({ children, type = "primary" }) {
  const types = {
    primary: "bg-[#1376f8] text-white",
    secondary: "bg-gray-600 text-white",
    success: "bg-[#17bf28] text-white",
    danger: "bg-[#e52323] text-white",
    warning: "bg-[#ec942c] text-white",
  };
  return (
    <span className={`${types[type]} px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm`}>
      {children}
    </span>
  );
}

function Avatar({ name }) {
  return (
    <div className="w-10 h-10 rounded-full bg-gray-300 text-[#011632] border border-gray-400/20 flex items-center justify-center font-bold shadow-sm" title={name}>
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

// =========================================================================
// 2. LAYOUT COMPONENTS (MATERI 2)
// =========================================================================

function Container({ children, className = "" }) {
  return (
    <div className={`container mx-auto py-6 px-4 rounded-2xl ${className}`}>
      {children}
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-[#011632] text-white py-6 mt-10 rounded-2xl shadow-inner">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-xl font-bold mb-1 tracking-wide">Azcyra Dental</h2>
        <p className="text-gray-400 text-sm mb-4">Aplikasi manajemen data klinik gigi berbasis React.</p>
        <div className="flex justify-center gap-6 text-sm mb-4 text-gray-300">
          <a href="#" className="hover:text-[#1376f8] transition-colors">Home</a>
          <a href="#" className="hover:text-[#1376f8] transition-colors">Pasien</a>
          <a href="#" className="hover:text-[#1376f8] transition-colors">Kontak</a>
        </div>
        <p className="text-gray-500 text-xs border-t border-gray-800 pt-4">© 2026 Azcyra Clinic. All rights reserved.</p>
      </div>
    </footer>
  );
}

// =========================================================================
// 3. DATA DISPLAY COMPONENTS (MATERI 3)
// =========================================================================

function Card({ children }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow p-6">
      {children}
    </div>
  );
}

function ProductCard({ image, title, category, price, description }) {
  return (
    <Card>
      <img src={image} alt={title} className="w-full h-52 object-cover rounded-t-lg" />
      <div className="p-5">
        <span className="inline-block bg-[#e6f6fe] text-[#1376f8] text-xs font-bold px-3 py-1 rounded-full mb-3">{category}</span>
        <h2 className="text-xl font-bold mb-2 text-[#011632]">{title}</h2>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-[#1376f8]">{price}</h3>
          <button className="bg-[#1376f8] hover:bg-opacity-90 text-white px-4 py-2 rounded-lg text-sm font-medium transition">Detail</button>
        </div>
      </div>
    </Card>
  );
}

function Table({ headers, children }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="border-b border-gray-200 px-4 py-3 text-left text-sm font-bold text-[#011632]">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">{children}</tbody>
      </table>
    </div>
  );
}

// =========================================================================
// 4. FORM COMPONENTS (MATERI 4)
// =========================================================================

function InputField({ label, type = "text", placeholder, ...props }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-sm font-semibold text-[#011632]">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-[#1376f8] focus:ring-2 focus:ring-[#1376f8]/20 transition-all text-[#3c4959]"
        {...props}
      />
    </div>
  );
}

// =========================================================================
// 5. FEEDBACK COMPONENTS (MATERI 5)
// =========================================================================

function Alert({ children, type = "success" }) {
  const styles = {
    success: "bg-green-50 border border-green-200 text-[#17bf28]",
    danger: "bg-red-50 border border-red-200 text-[#e52323]",
    warning: "bg-orange-50 border border-orange-200 text-[#ec942c]",
  };
  return (
    <div className={`p-4 rounded-xl text-sm font-medium flex items-center gap-3 shadow-sm ${styles[type]}`}>
      <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
      {children}
    </div>
  );
}

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-[#011632]">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold text-xl">&times;</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// =========================================================================
// 6. SECTION COMPONENTS (MATERI 6)
// =========================================================================

function HeroSection({ title, subtitle, buttonText, onBtnClick }) {
  return (
    <div className="bg-[#011632] text-white rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden flex flex-col justify-center items-start min-h-[320px]">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#1376f8]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
      <div className="max-w-2xl space-y-4 relative z-10">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
          {title}
        </h1>
        <p className="text-gray-400 text-sm md:text-base leading-relaxed">
          {subtitle}
        </p>
        <div className="pt-2">
          <Button type="primary" onClick={onBtnClick}>
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
}

function FeatureSection({ heading, description, features = [] }) {
  return (
    <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm space-y-8">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h2 className="text-2xl font-bold text-[#011632]">{heading}</h2>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feat, idx) => (
          <div key={idx} className="p-5 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-md transition-all duration-300 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#e6f6fe] text-[#1376f8] flex items-center justify-center font-bold text-lg shadow-sm">
              {idx + 1}
            </div>
            <h4 className="text-base font-bold text-[#011632]">{feat.title}</h4>
            <p className="text-xs text-gray-500 leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// =========================================================================
// 7. MAIN COMPONENT (PLAYGROUND VIEW)
// =========================================================================
export default function ComponentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tableHeaders = ["No", "Nama Produk", "Kategori", "Harga", "Aksi"];
  const productsData = [
    { id: 1, name: "Laptop Asus", category: "Elektronik", price: "Rp 8.000.000" },
    { id: 2, name: "Sepatu Sport", category: "Fashion", price: "Rp 450.000" },
    { id: 3, name: "Jam Tangan", category: "Aksesoris", price: "Rp 799.000" }
  ];

  const coreFeatures = [
    { title: "Registrasi Pasien Kilat", desc: "Sistem pencatatan rekam medis terintegrasi, aman, dan dapat diakses real-time oleh tim medis." },
    { title: "Manajemen Antrean Pintar", desc: "Optimalisasi jadwal operasional dental unit serta monitoring kehadiran dokter gigi secara akurat." },
    { title: "Pelaporan Keuangan Otomatis", desc: "Rekapitulasi omset harian transaksi obat dan penanganan medis dental yang transparan." }
  ];

  return (
    <div className="space-y-8 pb-12">
      <div>
        <PageHeader title="Components" subtitle="Dashboard / Component List" />
      </div>

      {/* --- SECTION 1: BASIC COMPONENT --- */}
      <div className="border border-dashed border-gray-300 p-4 rounded-3xl space-y-4">
        <div className="px-2">
          <h2 className="text-xl font-bold text-[#011632]">Basic Components</h2>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex flex-wrap gap-4"><Button type="primary">Primary</Button><Button type="success">Simpan</Button><Button type="danger">Hapus</Button></div>
          <div className="flex flex-wrap gap-4"><Badge type="success">Aktif</Badge><Badge type="warning">Pending</Badge><Badge type="danger">Batal</Badge></div>
          <div className="flex flex-wrap gap-4"><Avatar name="Budi" /><Avatar name="Siti" /></div>
        </div>
      </div>

      {/* --- SECTION 2: LAYOUT COMPONENT --- */}
      <div className="border border-dashed border-gray-300 p-4 rounded-3xl space-y-4">
        <div className="px-2">
          <h2 className="text-xl font-bold text-[#011632]">Layout Components</h2>
        </div>
        <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
          <Container className="bg-[#e6f6fe] border border-[#25b4f8]/30">
            <h4 className="text-lg font-bold text-[#011632] mb-1">Daftar Rekam Medis</h4>
            <p className="text-sm text-gray-600">Berikut adalah data yang dibungkus oleh komponen Layout Container.</p>
          </Container>
        </div>
      </div>

      {/* --- SECTION 3: DATA DISPLAY COMPONENT --- */}
      <div className="border border-dashed border-gray-300 p-4 rounded-3xl space-y-4">
        <div className="px-2">
          <h2 className="text-xl font-bold text-[#011632]">Data Display Components</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProductCard image="https://images.unsplash.com/photo-1542291026-7eec264c27ff" title="Sepatu Sport" category="Fashion" price="Rp 450.000" description="Sepatu sport modern nyaman." />
          <ProductCard image="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9" title="Smartphone" category="Elektronik" price="Rp 4.500.000" description="Smartphone performa cepat." />
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <Table headers={tableHeaders}>
            {productsData.map((product, index) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-600">{index + 1}</td>
                <td className="px-4 py-3 text-sm font-semibold text-[#011632]">{product.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{product.category}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{product.price}</td>
                <td className="px-4 py-3 text-sm"><button className="bg-[#1376f8] text-white text-xs px-3 py-1.5 rounded-md">Detail</button></td>
              </tr>
            ))}
          </Table>
        </div>
      </div>

      {/* --- SECTION 4: FORM COMPONENT --- */}
      <div className="border border-dashed border-gray-300 p-4 rounded-3xl space-y-4">
        <div className="px-2">
          <h2 className="text-xl font-bold text-[#011632]">Form Components</h2>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
            <InputField label="Nama Pasien" type="text" placeholder="Masukkan nama lengkap pasien..." />
            <InputField label="Tanggal Kunjungan" type="date" />
          </div>
        </div>
      </div>

      {/* --- SECTION 5: FEEDBACK COMPONENT --- */}
      <div className="border border-dashed border-gray-300 p-4 rounded-3xl space-y-4">
        <div className="px-2">
          <h2 className="text-xl font-bold text-[#011632]">Feedback Components</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Alert type="success">Sukses! Data pendaftaran rekam medis pasien berhasil disimpan.</Alert>
          <Button type="primary" onClick={() => setIsModalOpen(true)}>Buka Konfirmasi Modal</Button>
        </div>
      </div>

      {/* --- SECTION 6: SECTION COMPONENT --- */}
      <div className="border border-dashed border-gray-300 p-4 rounded-3xl space-y-6">
        <div className="px-2">
          <h2 className="text-xl font-bold text-[#011632]">Section Components</h2>
        </div>

        <HeroSection 
          title="Sistem Manajemen Klinik Gigi Modern Azcyra Dental Core"
          subtitle="Kelola data pasien, jadwalkan janji temu medis dokter gigi, pantau rekam medis klinis, dan pantau performa omset apotek dalam satu dashboard pintar yang responsif."
          buttonText="Mulai Pendaftaran Pasien"
          onBtnClick={() => setIsModalOpen(true)}
        />

        <FeatureSection 
          heading="Layanan Unggulan Sistem Manajemen"
          description="Rangkaian pilar fitur utama yang dirancang untuk mempercepat administrasi operasional klinik gigi."
          features={coreFeatures}
        />
      </div>

      {/* Interactive Modal Portal Render */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Konfirmasi Tindakan Medis">
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          Apakah Anda yakin ingin memproses tindakan ini ke dalam antrean klinik Azcyra?
        </p>
        <div className="flex justify-end gap-3">
          <Button type="secondary" onClick={() => setIsModalOpen(false)}>Kembali</Button>
          <Button type="success" onClick={() => setIsModalOpen(false)}>Ya, Konfirmasi</Button>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}