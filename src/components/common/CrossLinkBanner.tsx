import React from 'react';
import { ArrowRight, ArrowRightLeft, Building2, GraduationCap, Link2, Sparkles } from 'lucide-react';
import { useSupervisi } from '../../context/SupervisiContext';

interface CrossLinkBannerProps {
  currentView: 'MANAJERIAL' | 'PBM';
  aspekTerkait?: string;
  guruTerkait?: string;
}

export const CrossLinkBanner: React.FC<CrossLinkBannerProps> = ({
  currentView,
  aspekTerkait,
  guruTerkait,
}) => {
  const { navigateToPBM, navigateToManajerial, pbmDocs, activeManajerialDoc } =
    useSupervisi();

  if (currentView === 'MANAJERIAL') {
    return (
      <div className="bg-linear-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200/80 rounded-2xl p-4 shadow-xs mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start space-x-3">
            <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-xs mt-0.5 shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  Tautan Silang ke Supervisi Kelas (PBM)
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {pbmDocs.length} Dokumen Supervisi Guru Tersedia
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                Bukti Nyata Kinerja Guru di Ruang Kelas (Standar Proses & Kompetensi PTK)
              </h4>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Skor Standar Proses & Standar Pendidik di Supervisi Manajerial ini didukung langsung oleh data observasi di kelas terhadap guru SMP Negeri 7 Sentani.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigateToPBM(undefined, 'JADWAL_GURU')}
            className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all self-start md:self-center shrink-0 cursor-pointer"
          >
            <span>Buka Supervisi Kelas (PBM)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-linear-to-r from-blue-50 via-indigo-50 to-slate-50 border border-blue-200/80 rounded-2xl p-4 shadow-xs mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-start space-x-3">
          <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-xs mt-0.5 shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                Tautan Silang ke Supervisi Manajerial
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Sinergi Kebijakan & Rapor Pendidikan
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 mt-0.5">
              Hubungkan Hasil PBM ke Evaluasi Mutu Manajerial Satuan Pendidikan
            </h4>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Hasil supervisi guru {guruTerkait ? `(${guruTerkait})` : ''} di kelas berkontribusi langsung pada pencapaian 8 Standar Nasional Pendidikan (SNP) dan pembenahan program RKT/RKAS SMP Negeri 7 Sentani.
            </p>
          </div>
        </div>
        <button
          onClick={() => navigateToManajerial('SNP_8')}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all self-start md:self-center shrink-0 cursor-pointer"
        >
          <span>Lihat Instrumen Manajerial</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
