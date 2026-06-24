import React, { useState, useEffect } from 'react';
import * as Select from '@radix-ui/react-select';
import * as Dialog from '@radix-ui/react-dialog';
import * as Switch from '@radix-ui/react-switch';
import { Check, ChevronDown, ShieldAlert, UserCheck, X } from 'lucide-react';
import { userService } from '../services/userService';
import api from '../services/api'; // Menggunakan Axios instance langsung untuk manipulasi admin patch/delete

export default function CrmPage() {
  // --- STATE KOMPONEN LAMA (RADIX UI) ---
  const [statusAsuransi, setStatusAsuransi] = useState(false);
  const [layananTerpilih, setLayananTerpilih] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // --- STATE TAMBAHAN UNTUK CRUD USER (SUPABASE) ---
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // State Form Input CRUD
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('member');
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Fungsi memuat semua data user dari Supabase
  const loadAllUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err) {
      setMessage('Failed to load users from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllUsers();
  }, []);

  // Fungsi submit form Tambah / Edit User
  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      if (isEditing) {
        // Aksi Update (PATCH) sesuai modul dosen
        await api.patch(`/users?id=eq.${editId}`, { username, email, password, role });
        setMessage('User updated successfully!');
      } else {
        // Aksi Create (POST)
        await userService.registerUser({ username, email, password, role });
        setMessage('New user added successfully!');
      }
      resetForm();
      loadAllUsers();
    } catch (err) {
      setMessage(err.message || 'Operation failed.');
    }
  };

  const handleEditTrigger = (user) => {
    setIsEditing(true);
    setEditId(user.id);
    setUsername(user.username);
    setEmail(user.email);
    setPassword(user.password);
    setRole(user.role);
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user account?")) {
      try {
        await api.delete(`/users?id=eq.${id}`);
        setMessage('User deleted successfully.');
        loadAllUsers();
      } catch (err) {
        setMessage('Failed to delete user.');
      }
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditId(null);
    setUsername('');
    setEmail('');
    setPassword('');
    setRole('member');
  };

  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      {/* Header Halaman */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-[#011632] tracking-tight">Sistem Manajemen CRM Pasien</h1>
      </div>

      {/* NOTIFIKASI PESAN DARI SUPABASE */}
      {message && (
        <div className="p-4 bg-blue-50 border border-blue-100 text-blue-700 rounded-xl font-medium text-sm shadow-xs">
          💡 {message}
        </div>
      )}

      {/* ==========================================
          BAGIAN 1: FITUR REGISTRASI MEDIS (KODE LAMA)
         ========================================== */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-6">
        <h2 className="text-lg font-bold text-[#011632]">Registrasi Tindakan Medis</h2>
        
        {/* KOMPONEN 1: RADIX SELECT */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#011632]">Pilih Tindakan Medis</label>
          <Select.Root value={layananTerpilih} onValueChange={setLayananTerpilih}>
            <Select.Trigger className="w-full md:w-[380px] flex items-center justify-between px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1376f8]/20 focus:border-[#1376f8] transition-all text-left">
              <Select.Value placeholder="Pilih jenis penanganan gigi..." />
              <Select.Icon>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </Select.Icon>
            </Select.Trigger>

            <Select.Portal>
              <Select.Content className="overflow-hidden bg-white rounded-xl border border-gray-200 shadow-lg z-50 p-1 min-w-[380px]">
                <Select.Viewport className="p-1 space-y-0.5">
                  {[
                    { id: "scaling", name: "Pembersihan Karang Gigi (Scaling)" },
                    { id: "tambal", name: "Penambalan Komposit Estetis" },
                    { id: "cabut", name: "Pencabutan Gigi Bungsu (Odonektomi)" },
                    { id: "ortho", name: "Pemasangan Brackets Ortodonti" }
                  ].map((item) => (
                    <Select.Item 
                      key={item.id} 
                      value={item.name}
                      className="flex items-center justify-between px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50 cursor-pointer focus:bg-gray-50 focus:outline-none select-none"
                    >
                      <Select.ItemText>{item.name}</Select.ItemText>
                      <Select.ItemIndicator>
                        <Check className="w-4 h-4 text-[#17bf28]" />
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>

        {/* KOMPONEN 2: RADIX SWITCH */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 max-w-[380px]">
          <div className="space-y-0.5">
            <label className="text-sm font-semibold text-[#011632]">Metode Jaminan Asuransi</label>
            <p className="text-xs text-gray-500">Aktifkan jika menggunakan jaminan kesehatan / BPJS</p>
          </div>
          <Switch.Root
            checked={statusAsuransi}
            onCheckedChange={setStatusAsuransi}
            className="w-11 h-6 bg-gray-200 rounded-full relative data-[state=checked]:bg-[#1376f8] transition-colors outline-none cursor-pointer"
          >
            <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[22px]" />
          </Switch.Root>
        </div>

        {/* KOMPONEN 3: RADIX DIALOG (MODAL) */}
        <div className="pt-4 border-t border-gray-100">
          <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Dialog.Trigger asChild>
              <button 
                type="button"
                className="bg-[#1376f8] hover:bg-opacity-90 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all active:scale-95 shadow-sm cursor-pointer"
              >
                Validasi & Simpan ke CRM
              </button>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50" />
              
              <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-md p-6 z-50 focus:outline-none">
                
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2.5 text-amber-600">
                    <ShieldAlert className="w-5 h-5" />
                    <Dialog.Title className="text-lg font-bold text-[#011632]">Konfirmasi Registrasi</Dialog.Title>
                  </div>
                  <Dialog.Close className="text-gray-400 hover:text-gray-600 outline-none cursor-pointer">
                    <X className="w-5 h-5" />
                  </Dialog.Close>
                </div>

                <Dialog.Description className="text-sm text-gray-600 space-y-3 leading-relaxed" as="div">
                  <p>Sistem CRM mendeteksi entri rekam medis baru dengan rincian berikut:</p>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs space-y-1.5 text-gray-700 font-mono">
                    <div>• Tindakan: <span className="font-bold text-[#011632]">{layananTerpilih || "Belum Dipilih"}</span></div>
                    <div>• Asuransi: <span className="font-bold text-[#011632]">{statusAsuransi ? "AKTIF (BPJS/Kemitraan)" : "TIDAK AKTIF (Mandiri)"}</span></div>
                  </div>
                  <p>Apakah seluruh data jaminan dan jenis penanganan ini sudah divalidasi dengan benar?</p>
                </Dialog.Description>

                <div className="flex justify-end gap-3 pt-5 mt-4 border-t border-gray-100">
                  <Dialog.Close asChild>
                    <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition cursor-pointer">Periksa Kembali</button>
                  </Dialog.Close>
                  <button 
                    type="button"
                    onClick={() => setIsDialogOpen(false)}
                    className="bg-[#17bf28] hover:bg-opacity-90 text-white px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <UserCheck className="w-4 h-4" /> Ya, Daftarkan Pasien
                  </button>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>

      {/* ==========================================
          BAGIAN 2: CRUD DATA USER (SUPABASE NEW)
         ========================================== */}
      <div className="space-y-6">
        {/* Form Tambah/Edit User */}
        <form onSubmit={handleUserSubmit} className="p-6 bg-white rounded-2xl border border-gray-100 shadow-xs space-y-4">
          <h3 className="text-lg font-bold text-[#011632]">{isEditing ? "Edit Account Data" : "Add New Account"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Full Name</label>
              <input type="text" placeholder="Full Name" value={username} onChange={e => setUsername(e.target.value)} required className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-blue-100" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Email Address</label>
              <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-blue-100" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Password</label>
              <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required={!isEditing} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-blue-100" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Role Type</label>
              <select value={role} onChange={e => setRole(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer">
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl text-sm font-medium shadow-sm transition-colors cursor-pointer">
                {isEditing ? 'Update' : 'Save'}
              </button>
              {isEditing && (
                <button type="button" onClick={resetForm} className="bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-xl text-sm font-medium transition-colors cursor-pointer">
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Tabel Data User Supabase */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-base font-bold text-[#011632]">Database Accounts via Supabase</h3>
          </div>
          {loading ? (
            <div className="p-10 text-center text-sm text-gray-400 font-medium">Synchronizing with Supabase server...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-400 font-bold uppercase tracking-wider">
                    <th className="p-4">ID</th>
                    <th className="p-4">Full Name</th>
                    <th className="p-4">Email Address</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-600 divide-y divide-gray-50">
                  {users.length === 0 ? (
                    <tr><td colSpan="5" className="p-6 text-center text-gray-400">No records found.</td></tr>
                  ) : (
                    users.map(u => (
                      <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 font-medium text-gray-400">#{u.id}</td>
                        <td className="p-4 font-bold text-[#011632]">{u.username}</td>
                        <td className="p-4">{u.email}</td>
                        <td className="p-4">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${u.role === 'admin' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4 flex gap-2">
                          <button onClick={() => handleEditTrigger(u)} className="text-xs bg-amber-500 hover:bg-amber-600 text-white font-medium py-1.5 px-3 rounded-lg transition-colors cursor-pointer">Edit</button>
                          <button onClick={() => handleDeleteUser(u.id)} className="text-xs bg-red-600 hover:bg-red-700 text-white font-medium py-1.5 px-3 rounded-lg transition-colors cursor-pointer">Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}