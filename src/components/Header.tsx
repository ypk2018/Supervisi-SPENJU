import React from 'react';
import {
  ShieldCheck,
  UserCheck,
  Award,
  School,
  Printer,
  ChevronDown,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useSupervisi } from '../context/SupervisiContext';
import { EvaluatorRole } from '../types/supervisi';

export const Header: React.FC = () => {
  const {
    schoolProfile,
    activeRole,
    setActiveRole,
    getActiveEvaluatorName,
    getActiveEvaluatorNip,
    openPrintModal,
    activeTab,
  } = useSupervisi();

  const roleMeta: Record<
    EvaluatorRole,
    { label: string; badgeBg: string; textBg: string; icon: any; titleDesc: string }
  > = {
    PENGAWAS: {
      label: 'Pengawas Pembina',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      textBg: 'bg-emerald-600',
      icon: ShieldCheck,
      titleDesc: 'Pengawas Sekolah Disdik Kab. Jayapura',
    },
    KEPALA_SEKOLAH: {
      label: 'Kepala Sekolah',
      badgeBg: 'bg-blue-100 text-blue-800 border-blue-300',
      textBg: 'bg-blue-600',
      icon: School,
      titleDesc: 'Kepala Satuan Pendidikan SMPN 7 Sentani',
    },
    GURU_SENIOR: {
      label: 'Guru Senior / Sejawat',
      badgeBg: 'bg-purple-100 text-purple-800 border-purple-300',
      textBg: 'bg-purple-600',
      icon: Award,
      titleDesc: 'Tim Penilai Supervisi Sejawat',
    },
  };

  const currentRole = roleMeta[activeRole];
  const CurrentIcon = currentRole.icon;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Top micro bar for Papua Government Context */}
      <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-blue-900 text-slate-200 text-xs py-1 px-4 sm:px-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold tracking-wide text-white">
            DINAS PENDIDIKAN KABUPATEN JAYAPURA &bull; PAPUA
          </span>
          <span className="text-slate-400 hidden md:inline">|</span>
          <span className="text-slate-300 hidden md:inline">
            NPSN: {schoolProfile.npsn} &bull; Akreditasi: {schoolProfile.akreditasi}
          </span>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <span className="bg-white/10 text-slate-200 px-2 py-0.5 rounded text-[11px] font-medium border border-white/15">
            T.A. {schoolProfile.tahunAjaran} ({schoolProfile.semester})
          </span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* School Logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-xl bg-linear-to-br from-indigo-700 to-blue-600 text-white flex items-center justify-center shadow-md shadow-indigo-100 border border-indigo-200/50 shrink-0">
            <School className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold text-slate-900 leading-tight tracking-tight">
                {schoolProfile.namaSekolah}
              </h1>
              <span className="bg-indigo-50 text-indigo-700 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-indigo-200">
                Supervisi Terpadu
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Sistem Supervisi Manajerial Satuan Pendidikan & Proses Belajar Mengajar (PBM)
            </p>
          </div>
        </div>

        {/* Evaluator Role Selector & Print quick access */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Active Evaluator Badge & Selector */}
          <div className="relative group">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-0.5">
              Penilai Aktif (Role Switcher):
            </label>
            <div className="flex items-center space-x-2 bg-slate-50 border border-slate-300 hover:border-indigo-400 transition-colors rounded-lg p-1.5 shadow-2xs">
              <div
                className={`w-7 h-7 rounded-md ${currentRole.textBg} text-white flex items-center justify-center shrink-0 shadow-xs`}
              >
                <CurrentIcon className="w-4 h-4" />
              </div>
              <div className="text-left pr-2">
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs font-bold text-slate-800">
                    {getActiveEvaluatorName()}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${currentRole.badgeBg}`}
                  >
                    {currentRole.label}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500">
                  NIP. {getActiveEvaluatorNip()}
                </div>
              </div>
              <div className="border-l border-slate-200 pl-1.5">
                <select
                  value={activeRole}
                  aria-label="Pilih Penilai Aktif"
                  onChange={(e) => setActiveRole(e.target.value as EvaluatorRole)}
                  className="bg-transparent text-xs font-semibold text-slate-700 cursor-pointer focus:outline-hidden"
                >
                  <option value="PENGAWAS">Pengawas</option>
                  <option value="KEPALA_SEKOLAH">Kepala Sekolah</option>
                  <option value="GURU_SENIOR">Guru Senior</option>
                </select>
              </div>
            </div>
          </div>

          {/* Quick Print Button */}
          <button
            onClick={() =>
              openPrintModal(
                activeTab === 'MANAJERIAL'
                  ? 'MANAJERIAL'
                  : activeTab === 'PBM'
                  ? 'PBM'
                  : 'REKAP_TOTAL'
              )
            }
            className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-xs hover:shadow-md transition-all self-end cursor-pointer"
            title="Cetak Berita Acara & Lembar Supervisi Resmi"
          >
            <Printer className="w-3.5 h-3.5 text-indigo-300" />
            <span>Cetak Dokumen</span>
          </button>
        </div>
      </div>
    </header>
  );
};
