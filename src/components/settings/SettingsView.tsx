import React, { useState } from 'react';
import {
  School,
  Users,
  ShieldCheck,
  Database,
  Award,
  Save,
  Trash2,
  PlusCircle,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  Sliders,
} from 'lucide-react';
import { useSupervisi } from '../../context/SupervisiContext';
import { Teacher } from '../../types/supervisi';

export const SettingsView: React.FC = () => {
  const {
    schoolProfile,
    updateSchoolProfile,
    teachers,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    resetToDefaultData,
    exportDataJson,
    importDataJson,
  } = useSupervisi();

  const [activeTab, setActiveTab] = useState<'PROFIL' | 'PENILAI' | 'GURU' | 'SKALA' | 'DATA'>('PROFIL');
  const [saveNotif, setSaveNotif] = useState(false);

  // New teacher form state
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [newTeacherData, setNewTeacherData] = useState<Omit<Teacher, 'id'>>({
    nama: '',
    nip: '',
    pangkatGolongan: 'Penata Muda / III/a',
    mataPelajaran: '',
    kelasDiampu: 'Kelas VII',
    pendidikanTerakhir: 'S1 Pendidikan',
    sertifikasi: true,
    statusKepegawaian: 'PNS',
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveNotif(true);
    setTimeout(() => setSaveNotif(false), 2500);
  };

  const handleAddTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherData.nama || !newTeacherData.mataPelajaran) return;
    addTeacher(newTeacherData);
    setNewTeacherData({
      nama: '',
      nip: '',
      pangkatGolongan: 'Penata Muda / III/a',
      mataPelajaran: '',
      kelasDiampu: 'Kelas VII',
      pendidikanTerakhir: 'S1 Pendidikan',
      sertifikasi: true,
      statusKepegawaian: 'PNS',
    });
    setShowAddTeacher(false);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importDataJson(content);
      if (success) {
        alert('Data berhasil diimpor!');
      } else {
        alert('Gagal mengimpor file: Format JSON tidak sesuai.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            Pengaturan Sistem Supervisi
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Konfigurasi Profil SMP Negeri 7 Sentani, Penilai, Master Guru, dan Backup Data
          </p>
        </div>

        {saveNotif && (
          <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 animate-bounce">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Perubahan berhasil disimpan!</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
        {[
          { id: 'PROFIL', label: 'Profil Satuan Pendidikan', icon: School },
          { id: 'PENILAI', label: 'Penilai (Pengawas, KS, Guru Senior)', icon: ShieldCheck },
          { id: 'GURU', label: 'Kelola Data Guru', icon: Users },
          { id: 'SKALA', label: 'Kriteria & Skala Nilai', icon: Sliders },
          { id: 'DATA', label: 'Backup & Restore Data', icon: Database },
        ].map((tab) => {
          const isSelected = activeTab === tab.id;
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <TabIcon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: PROFIL SEKOLAH */}
      {activeTab === 'PROFIL' && (
        <form onSubmit={handleProfileSubmit} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900">
              Data Pokok SMP Negeri 7 Sentani
            </h3>
            <p className="text-xs text-slate-500">
              Identitas resmi yang tercetak pada kop surat dan berita acara
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Nama Sekolah:
              </label>
              <input
                type="text"
                value={schoolProfile.namaSekolah}
                onChange={(e) => updateSchoolProfile({ namaSekolah: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                NPSN:
              </label>
              <input
                type="text"
                value={schoolProfile.npsn}
                onChange={(e) => updateSchoolProfile({ npsn: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                NSS / Nomor Statistik Sekolah:
              </label>
              <input
                type="text"
                value={schoolProfile.nss}
                onChange={(e) => updateSchoolProfile({ nss: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Status Akreditasi:
              </label>
              <input
                type="text"
                value={schoolProfile.akreditasi}
                onChange={(e) => updateSchoolProfile({ akreditasi: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Alamat Lengkap:
              </label>
              <input
                type="text"
                value={schoolProfile.alamat}
                onChange={(e) => updateSchoolProfile({ alamat: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Kabupaten / Kota:
              </label>
              <input
                type="text"
                value={schoolProfile.kabupaten}
                onChange={(e) => updateSchoolProfile({ kabupaten: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Provinsi:
              </label>
              <input
                type="text"
                value={schoolProfile.provinsi}
                onChange={(e) => updateSchoolProfile({ provinsi: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Tahun Ajaran:
              </label>
              <input
                type="text"
                value={schoolProfile.tahunAjaran}
                onChange={(e) => updateSchoolProfile({ tahunAjaran: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Semester:
              </label>
              <select
                value={schoolProfile.semester}
                onChange={(e) => updateSchoolProfile({ semester: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-blue-500"
              >
                <option value="Ganjil">Ganjil</option>
                <option value="Genap">Genap</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs flex items-center space-x-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Profil Sekolah</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: MANAJEMEN PENILAI */}
      {activeTab === 'PENILAI' && (
        <form onSubmit={handleProfileSubmit} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900">
              Data Pejabat & Tim Penilai Supervisi
            </h3>
            <p className="text-xs text-slate-500">
              Nama, NIP, dan jabatan yang menandatangani Berita Acara Supervisi
            </p>
          </div>

          {/* 1. Pengawas Pembina */}
          <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-3">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
              <h4 className="text-sm font-bold text-emerald-900">
                1. Pengawas Pembina (Dinas Pendidikan Kab. Jayapura)
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                  Nama Lengkap & Gelar:
                </label>
                <input
                  type="text"
                  value={schoolProfile.namaPengawas}
                  onChange={(e) => updateSchoolProfile({ namaPengawas: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-xl font-semibold text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                  NIP:
                </label>
                <input
                  type="text"
                  value={schoolProfile.nipPengawas}
                  onChange={(e) => updateSchoolProfile({ nipPengawas: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-xl font-semibold text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                  Pangkat / Golongan:
                </label>
                <input
                  type="text"
                  value={schoolProfile.pangkatPengawas}
                  onChange={(e) => updateSchoolProfile({ pangkatPengawas: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-xl font-semibold text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* 2. Kepala Sekolah */}
          <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-2xl space-y-3">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-blue-600"></span>
              <h4 className="text-sm font-bold text-blue-900">
                2. Kepala Sekolah (SMP Negeri 7 Sentani)
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                  Nama Lengkap & Gelar:
                </label>
                <input
                  type="text"
                  value={schoolProfile.namaKepalaSekolah}
                  onChange={(e) => updateSchoolProfile({ namaKepalaSekolah: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-blue-200 rounded-xl font-semibold text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                  NIP:
                </label>
                <input
                  type="text"
                  value={schoolProfile.nipKepalaSekolah}
                  onChange={(e) => updateSchoolProfile({ nipKepalaSekolah: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-blue-200 rounded-xl font-semibold text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                  Pangkat / Golongan:
                </label>
                <input
                  type="text"
                  value={schoolProfile.pangkatKepalaSekolah}
                  onChange={(e) => updateSchoolProfile({ pangkatKepalaSekolah: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-blue-200 rounded-xl font-semibold text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* 3. Guru Senior */}
          <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-2xl space-y-3">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-purple-600"></span>
              <h4 className="text-sm font-bold text-purple-900">
                3. Guru Senior / Koordinator Supervisi Sejawat
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                  Nama Lengkap & Gelar:
                </label>
                <input
                  type="text"
                  value={schoolProfile.namaGuruSenior}
                  onChange={(e) => updateSchoolProfile({ namaGuruSenior: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl font-semibold text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                  NIP:
                </label>
                <input
                  type="text"
                  value={schoolProfile.nipGuruSenior}
                  onChange={(e) => updateSchoolProfile({ nipGuruSenior: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl font-semibold text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                  Pangkat / Golongan:
                </label>
                <input
                  type="text"
                  value={schoolProfile.pangkatGuruSenior}
                  onChange={(e) => updateSchoolProfile({ pangkatGuruSenior: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl font-semibold text-slate-800"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs flex items-center space-x-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Data Penilai</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: KELOLA GURU */}
      {activeTab === 'GURU' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Daftar Guru SMP Negeri 7 Sentani ({teachers.length} Guru)
              </h3>
              <p className="text-xs text-slate-500">
                Pendidik yang menjadi sasaran Supervisi Kelas (PBM)
              </p>
            </div>

            <button
              onClick={() => setShowAddTeacher(!showAddTeacher)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer self-start sm:self-auto"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{showAddTeacher ? 'Batal Tambah' : 'Tambah Guru Baru'}</span>
            </button>
          </div>

          {/* Form Tambah Guru */}
          {showAddTeacher && (
            <form onSubmit={handleAddTeacherSubmit} className="p-4 bg-indigo-50/60 border border-indigo-200 rounded-2xl space-y-3 text-xs">
              <h4 className="font-bold text-indigo-900 text-sm">
                Formulir Tambah Pendidik Baru
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                    Nama Guru & Gelar:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Simon Ohee, S.Pd."
                    value={newTeacherData.nama}
                    onChange={(e) => setNewTeacherData({ ...newTeacherData, nama: e.target.value })}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                    NIP:
                  </label>
                  <input
                    type="text"
                    placeholder="19800101 200501 1 001 atau -"
                    value={newTeacherData.nip}
                    onChange={(e) => setNewTeacherData({ ...newTeacherData, nip: e.target.value })}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                    Mata Pelajaran:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Matematika / Informatika"
                    value={newTeacherData.mataPelajaran}
                    onChange={(e) => setNewTeacherData({ ...newTeacherData, mataPelajaran: e.target.value })}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                    Kelas Diampu:
                  </label>
                  <input
                    type="text"
                    placeholder="Kelas VII A, VII B"
                    value={newTeacherData.kelasDiampu}
                    onChange={(e) => setNewTeacherData({ ...newTeacherData, kelasDiampu: e.target.value })}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                    Status Kepegawaian:
                  </label>
                  <select
                    value={newTeacherData.statusKepegawaian}
                    onChange={(e) => setNewTeacherData({ ...newTeacherData, statusKepegawaian: e.target.value as any })}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
                  >
                    <option value="PNS">PNS</option>
                    <option value="PPPK">PPPK</option>
                    <option value="Guru Honor Sekolah">Guru Honor Sekolah</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                    Pangkat / Golongan:
                  </label>
                  <input
                    type="text"
                    placeholder="Penata / III/c"
                    value={newTeacherData.pangkatGolongan}
                    onChange={(e) => setNewTeacherData({ ...newTeacherData, pangkatGolongan: e.target.value })}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTeacher(false)}
                  className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  Simpan Guru
                </button>
              </div>
            </form>
          )}

          {/* Tabel Guru */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse border border-slate-200">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-3 border-r border-slate-200">No</th>
                  <th className="p-3 border-r border-slate-200">Nama Guru & NIP</th>
                  <th className="p-3 border-r border-slate-200">Mata Pelajaran</th>
                  <th className="p-3 border-r border-slate-200">Kelas Diampu</th>
                  <th className="p-3 border-r border-slate-200">Status & Golongan</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {teachers.map((t, idx) => (
                  <tr key={t.id} className="hover:bg-slate-50/70">
                    <td className="p-3 text-slate-500 font-semibold border-r border-slate-200">
                      {idx + 1}
                    </td>
                    <td className="p-3 border-r border-slate-200">
                      <div className="font-bold text-slate-900">{t.nama}</div>
                      <div className="text-[11px] text-slate-500">NIP. {t.nip}</div>
                    </td>
                    <td className="p-3 border-r border-slate-200 font-semibold text-slate-800">
                      {t.mataPelajaran}
                    </td>
                    <td className="p-3 border-r border-slate-200 text-slate-600">
                      {t.kelasDiampu}
                    </td>
                    <td className="p-3 border-r border-slate-200">
                      <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px] font-semibold">
                        {t.statusKepegawaian}
                      </span>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {t.pangkatGolongan}
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => {
                          if (confirm(`Hapus data guru ${t.nama}?`)) {
                            deleteTeacher(t.id);
                          }
                        }}
                        className="text-rose-600 hover:text-rose-800 p-1 rounded hover:bg-rose-50 cursor-pointer"
                        title="Hapus Guru"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: SKALA & KRITERIA NILAI */}
      {activeTab === 'SKALA' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900">
              Kriteria & Skala Konversi Nilai Supervisi
            </h3>
            <p className="text-xs text-slate-500">
              Standar pedoman penilaian supervisi pendidikan Kemendikbud & Dinas Pendidikan Kabupaten Jayapura
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Skala 1 - 4 */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">
                1. Rubrik Skor Instrumen (1 - 4)
              </h4>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-start space-x-2">
                  <span className="font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Skor 4</span>
                  <span><strong>Amat Baik:</strong> Bukti fisik lengkap, konsisten, melebihi standar dan menjadi contoh praktik baik.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-extrabold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">Skor 3</span>
                  <span><strong>Baik:</strong> Memenuhi seluruh ketentuan standar secara memadai dan tertib.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">Skor 2</span>
                  <span><strong>Cukup:</strong> Memenuhi sebagian kriteria, memerlukan perbaikan dan pendampingan.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-extrabold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">Skor 1</span>
                  <span><strong>Kurang:</strong> Belum memenuhi standar, memerlukan pembinaan intensif khusus.</span>
                </li>
              </ul>
            </div>

            {/* Rentang Nilai Akhir */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">
                2. Rentang Nilai Akhir (Skala 0 - 100)
              </h4>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center justify-between p-2 bg-emerald-50 rounded-lg border border-emerald-200">
                  <span className="font-bold text-emerald-900">90.0 - 100.0</span>
                  <span className="font-extrabold text-emerald-800">Amat Baik (A)</span>
                </li>
                <li className="flex items-center justify-between p-2 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="font-bold text-blue-900">80.0 - 89.9</span>
                  <span className="font-extrabold text-blue-800">Baik (B)</span>
                </li>
                <li className="flex items-center justify-between p-2 bg-amber-50 rounded-lg border border-amber-200">
                  <span className="font-bold text-amber-900">70.0 - 79.9</span>
                  <span className="font-extrabold text-amber-800">Cukup (C)</span>
                </li>
                <li className="flex items-center justify-between p-2 bg-rose-50 rounded-lg border border-rose-200">
                  <span className="font-bold text-rose-900">&lt; 70.0</span>
                  <span className="font-extrabold text-rose-800">Kurang (D)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: BACKUP & DATA */}
      {activeTab === 'DATA' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900">
              Pencadangan (Backup) & Pemulihan (Restore) Data
            </h3>
            <p className="text-xs text-slate-500">
              Simpan data seluruh instrumen supervisi SMP Negeri 7 Sentani ke file JSON atau pulihkan data
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Export */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between">
              <div>
                <Download className="w-6 h-6 text-indigo-600 mb-2" />
                <h4 className="font-bold text-slate-900 text-sm">
                  Ekspor Backup JSON
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Unduh seluruh database profil sekolah, master guru, instrumen manajerial, dan nilai supervisi PBM ke komputer Anda.
                </p>
              </div>
              <button
                onClick={exportDataJson}
                className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh File Backup (.json)</span>
              </button>
            </div>

            {/* Import */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between">
              <div>
                <Upload className="w-6 h-6 text-emerald-600 mb-2" />
                <h4 className="font-bold text-slate-900 text-sm">
                  Impor Restore JSON
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Unggah file cadangan JSON untuk memulihkan seluruh data supervisi sekolah.
                </p>
              </div>
              <label className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 cursor-pointer text-center">
                <Upload className="w-3.5 h-3.5" />
                <span>Pilih File Backup</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportFile}
                  className="hidden"
                />
              </label>
            </div>

            {/* Reset */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between">
              <div>
                <RefreshCw className="w-6 h-6 text-amber-600 mb-2" />
                <h4 className="font-bold text-slate-900 text-sm">
                  Reset Data Awal
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Kembalikan ke data standar bawaan SMP Negeri 7 Sentani lengkap dengan sampel terisi.
                </p>
              </div>
              <button
                onClick={resetToDefaultData}
                className="mt-4 w-full bg-slate-800 hover:bg-rose-700 text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset ke Data Default</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
