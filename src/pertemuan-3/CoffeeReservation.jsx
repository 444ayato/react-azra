import { useState } from "react";
import InputField from "./InputField";
import SelectField from "./SelectField";

export default function CoffeeReservation() {
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    jumlahOrang: "",
    tipeMeja: "",
    waktu: "",
  });

  const [errors, setErrors] = useState({});
  const [submittedData, setSubmittedData] = useState(null);

  const validate = (name, value) => {
    let error = "";
    if (!value) {
      error = "Field ini wajib diisi";
    } else {
      if (name === "nama") {
        // Validasi: Tidak boleh ada angka
        if (/\d/.test(value)) error = "Nama tidak boleh mengandung angka";
        else if (value.length < 3) error = "Minimal 3 karakter";
      }
      if (name === "email") {
        // Validasi: Harus format email (@)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) error = "Format email tidak valid (contoh: user@mail.com)";
      }
      if (name === "jumlahOrang") {
        // Validasi: Wajib angka, tidak boleh huruf
        if (!/^\d+$/.test(value)) error = "Wajib berupa angka, tidak boleh huruf";
        else if (parseInt(value) <= 0) error = "Minimal 1 orang";
      }
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const error = validate(name, value);
    
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: error });
  };

  const isValid = 
    Object.values(formData).every((val) => val !== "") && 
    Object.values(errors).every((err) => !err);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValid) {
      setSubmittedData(formData); // Simpan data untuk ditampilkan di bawah
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 p-4 md:p-10">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-[30px] overflow-hidden shadow-2xl">
        
        {/* KIRI: Gambar & Teks Tengah */}
        <div className="relative w-full md:w-1/2 bg-amber-900 min-h-[300px]">
          <img 
            src="/img/kedaikopi.jpg" 
            alt="Kedai Kopi" 
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center p-8 bg-black/40">
            <h2 className="text-white text-3xl md:text-4xl font-bold text-center drop-shadow-2xl">
              Nikmati Kopi Terbaik <br />
              <span className="text-amber-400">DI COFFEE SHOP KAMI</span>
            </h2>
          </div>
        </div>

        {/* KANAN: Form & Hasil */}
        <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto max-h-[90vh]">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Reservasi</h2>
          <p className="text-gray-500 mb-6 text-sm">Silahkan lengkapi data pemesanan tempat.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Nama Pemesan"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              placeholder="Masukkan nama tanpa angka"
              error={errors.nama}
            />

            <InputField
              label="Email"
              name="email"
              type="text" 
              value={formData.email}
              onChange={handleChange}
              placeholder="contoh@email.com"
              error={errors.email}
            />

            <InputField
              label="Jumlah Orang"
              name="jumlahOrang"
              value={formData.jumlahOrang}
              onChange={handleChange}
              placeholder="Gunakan angka (contoh: 4)"
              error={errors.jumlahOrang}
            />

            <div className="grid grid-cols-2 gap-4">
              <SelectField
                label="Tipe Meja"
                name="tipeMeja"
                value={formData.tipeMeja}
                onChange={handleChange}
                options={["Indoor", "Outdoor", "VIP Room"]}
                error={errors.tipeMeja}
              />
              <SelectField
                label="Waktu"
                name="waktu"
                value={formData.waktu}
                onChange={handleChange}
                options={["Pagi", "Siang", "Malam"]}
                error={errors.waktu}
              />
            </div>

            <button 
              type="submit"
              disabled={!isValid}
              className={`w-full py-3 rounded-xl font-semibold transition-all shadow-lg ${
                isValid 
                ? "bg-amber-600 hover:bg-amber-700 text-white" 
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Konfirmasi Reservasi
            </button>
          </form>

          {/* MENAMPILKAN HASIL INPUTAN DI BAWAH FORM */}
          {submittedData && (
            <div className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-2xl shadow-inner animate-fadeIn">
              <h3 className="text-lg font-bold text-amber-800 mb-3 border-b border-amber-200 pb-2">
                📍 Detail Reservasi Anda:
              </h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>Nama:</strong> {submittedData.nama}</p>
                <p><strong>Email:</strong> {submittedData.email}</p>
                <p><strong>Jumlah:</strong> {submittedData.jumlahOrang} Orang</p>
                <p><strong>Lokasi:</strong> {submittedData.tipeMeja}</p>
                <p><strong>Waktu:</strong> {submittedData.waktu}</p>
              </div>
              <p className="mt-4 text-[10px] text-amber-600 italic">*Tunjukkan halaman ini ke kasir saat datang.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}