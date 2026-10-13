import React from 'react';
import {
  LayoutDashboard,
  Building2,
  GraduationCap,
  Settings,
  BookOpen,
  CheckCircle2,
  Users,
  Shield,
  FileSpreadsheet,
  Calendar,
  Layers,
  Sparkles,
  Link2,
  FileText,
  ClipboardList,
  Target,
  ArrowRightLeft,
} from 'lucide-react';
import {
  useSupervisi,
  MainNavTab,
  ManajerialSubmenu,
  PBMSubmenu,
} from '../context/SupervisiContext';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    manajerialSubmenu,
    setManajerialSubmenu,
    pbmSubmenu,
    setPBMSubmenu,
    manajerialDocs,
    pbmDocs,
    teachers,
  } = useSupervisi();

  const totalTeachers = teachers.length;
  const pbmDone = pbmDocs.filter((d) => d.status === 'Selesai').length;

  return (
    <aside className="w-full lg:w-72 bg-white border-r border-slate-200 shrink-0 flex flex-col justify-between overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Navigation list */}
        <div className="space-y-1">
          {/* Dashboard */}
          <button
            onClick={() => setActiveTab('DASHBOARD')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'DASHBOARD'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center space-x-3">
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard Utama</span>
            </div>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                activeTab === 'DASHBOARD'
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              Ringkasan
            </span>
          </button>

          {/* SECTION 1: SUPERVISI MANAJERIAL */}
          <div className="pt-3">
            <button
              onClick={() => {
                setActiveTab('MANAJERIAL');
                setManajerialSubmenu('SEMUA');
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'MANAJERIAL'
                  ? 'bg-blue-50 text-blue-900 border border-blue-200'
                  : 'text-slate-800 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <div
                  className={`p-1.5 rounded-lg ${
                    activeTab === 'MANAJERIAL'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                </div>
                <span>Supervisi Manajerial</span>
              </div>
              <span className="text-[11px] font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                5 Bidang
              </span>
            </button>

            {/* Submenu Manajerial */}
            <div className="mt-1 ml-4 pl-3 border-l-2 border-blue-100 space-y-0.5">
              {[
                {
                  id: 'SEMUA',
                  label: 'Ringkasan & Semua Aspek',
                  icon: Layers,
                },
                {
                  id: 'KOSP_KURIKULUM',
                  label: '1. KOSP & Kurikulum',
                  icon: BookOpen,
                },
                {
                  id: 'SNP_8',
                  label: '2. 8 Standar Nasional (SNP)',
                  icon: Target,
                },
                {
                  id: 'KINERJA_KS_TU',
                  label: '3. Kinerja KS & Tata Usaha',
                  icon: Shield,
                },
                {
                  id: 'SARPRAS_LINGKUNGAN',
                  label: '4. Sarpras & Iklim Belajar',
                  icon: Building2,
                },
                {
                  id: 'RKT_RKJM_RAPOR',
                  label: '5. RKT / Rapor Pendidikan',
                  icon: FileSpreadsheet,
                },
                {
                  id: 'REKAP_CETAK',
                  label: '6. Berita Acara & Rekap',
                  icon: FileText,
                },
              ].map((sub) => {
                const isSelected =
                  activeTab === 'MANAJERIAL' && manajerialSubmenu === sub.id;
                const SubIcon = sub.icon;
                return (
                  <button
                    key={sub.id}
                    onClick={() => {
                      setActiveTab('MANAJERIAL');
                      setManajerialSubmenu(sub.id as ManajerialSubmenu);
                    }}
                    className={`w-full flex items-center space-x-2 text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white font-bold shadow-xs'
                        : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50/60'
                    }`}
                  >
                    <SubIcon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{sub.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: SUPERVISI PBM (KELAS / AKADEMIK) */}
          <div className="pt-4">
            <button
              onClick={() => {
                setActiveTab('PBM');
                setPBMSubmenu('JADWAL_GURU');
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'PBM'
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : 'text-slate-800 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <div
                  className={`p-1.5 rounded-lg ${
                    activeTab === 'PBM'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                </div>
                <span>Supervisi Kelas (PBM)</span>
              </div>
              <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                {pbmDone}/{totalTeachers} Guru
              </span>
            </button>

            {/* Submenu PBM */}
            <div className="mt-1 ml-4 pl-3 border-l-2 border-emerald-100 space-y-0.5">
              {[
                {
                  id: 'JADWAL_GURU',
                  label: '1. Jadwal & Master Guru',
                  icon: Users,
                },
                {
                  id: 'PERENCANAAN',
                  label: '2. Perencanaan / Modul Ajar',
                  icon: BookOpen,
                },
                {
                  id: 'PELAKSANAAN_KELAS',
                  label: '3. Pelaksanaan PBM di Kelas',
                  icon: GraduationCap,
                },
                {
                  id: 'PENILAIAN_ASESMEN',
                  label: '4. Penilaian & Asesmen Siswa',
                  icon: ClipboardList,
                },
                {
                  id: 'ADMINISTRASI_GURU',
                  label: '5. Administrasi Guru',
                  icon: FileSpreadsheet,
                },
                {
                  id: 'TINDAK_LANJUT',
                  label: '6. Refleksi & Tindak Lanjut',
                  icon: CheckCircle2,
                },
                {
                  id: 'REKAP_CETAK',
                  label: '7. Lembar Nilai & Berita Acara',
                  icon: FileText,
                },
              ].map((sub) => {
                const isSelected =
                  activeTab === 'PBM' && pbmSubmenu === sub.id;
                const SubIcon = sub.icon;
                return (
                  <button
                    key={sub.id}
                    onClick={() => {
                      setActiveTab('PBM');
                      setPBMSubmenu(sub.id as PBMSubmenu);
                    }}
                    className={`w-full flex items-center space-x-2 text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white font-bold shadow-xs'
                        : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/60'
                    }`}
                  >
                    <SubIcon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{sub.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 3: PENGATURAN */}
          <div className="pt-3">
            <button
              onClick={() => setActiveTab('PENGATURAN')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'PENGATURAN'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Settings className="w-4 h-4" />
                <span>Pengaturan Sistem</span>
              </div>
              <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                Profil & Guru
              </span>
            </button>
          </div>
        </div>

        {/* Mutual Link Visual Card */}
        <div className="bg-linear-to-br from-indigo-50 to-blue-50 border border-indigo-200/80 rounded-xl p-3.5 text-xs text-indigo-900">
          <div className="flex items-center space-x-2 font-bold mb-1.5 text-indigo-950">
            <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-600" />
            <span>Korelasi Dua Arah</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Supervisi Manajerial (Standar Isi, Proses & PTK) disinkronkan secara langsung dari capaian observasi di Supervisi Kelas (PBM).
          </p>
          <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-indigo-200/60 text-[11px]">
            <span className="font-semibold text-indigo-700">Manajerial</span>
            <Link2 className="w-3 h-3 text-indigo-400" />
            <span className="font-semibold text-emerald-700">Kelas (PBM)</span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/70 text-[11px] text-slate-500">
        <p className="font-semibold text-slate-700">SMP Negeri 7 Sentani</p>
        <p>Sentani, Kabupaten Jayapura</p>
      </div>
    </aside>
  );
};
