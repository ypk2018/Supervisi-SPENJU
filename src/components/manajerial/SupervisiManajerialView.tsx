import React, { useState } from 'react';
import {
  Building2,
  BookOpen,
  Target,
  Shield,
  FileSpreadsheet,
  Printer,
  Sparkles,
  Link2,
  CheckCircle2,
  AlertCircle,
  Save,
  GraduationCap,
  ArrowRight,
  Info,
  Calendar,
} from 'lucide-react';
import { useSupervisi, ManajerialSubmenu } from '../../context/SupervisiContext';
import { calculateManajerialScore, formatIndonesianDate, generateSmartFeedback } from '../../utils/calc';
import { CrossLinkBanner } from '../common/CrossLinkBanner';
import { ManajerialCategory } from '../../types/supervisi';

export const SupervisiManajerialView: React.FC = () => {
  const {
    activeManajerialDoc,
    updateManajerialItem,
    updateManajerialDocInfo,
    manajerialSubmenu,
    setManajerialSubmenu,
    navigateToPBM,
    openPrintModal,
    getActiveEvaluatorName,
    getActiveEvaluatorNip,
    activeRole,
    schoolProfile,
  } = useSupervisi();

  const [savingFeedback, setSavingFeedback] = useState(false);

  if (!activeManajerialDoc) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
        <p className="text-slate-600">Dokumen Supervisi Manajerial belum dibuat.</p>
      </div>
    );
  }

  const scoreData = calculateManajerialScore(activeManajerialDoc.items);

  const submenus: { id: ManajerialSubmenu; label: string; icon: any; categoryKey?: ManajerialCategory }[] = [
    { id: 'SEMUA', label: 'Semua Indikator', icon: Building2 },
    { id: 'KOSP_KURIKULUM', label: '1. KOSP & Kurikulum', icon: BookOpen, categoryKey: 'KOSP_KURIKULUM' },
    { id: 'SNP_8', label: '2. 8 Standar SNP', icon: Target, categoryKey: 'SNP_8' },
    { id: 'KINERJA_KS_TU', label: '3. Kinerja KS & TU', icon: Shield, categoryKey: 'KINERJA_KS_TU' },
    { id: 'SARPRAS_LINGKUNGAN', label: '4. Sarpras & Lingkungan', icon: Building2, categoryKey: 'SARPRAS_LINGKUNGAN' },
    { id: 'RKT_RKJM_RAPOR', label: '5. RKT & Rapor Pendidikan', icon: FileSpreadsheet, categoryKey: 'RKT_RKJM_RAPOR' },
    { id: 'REKAP_CETAK', label: '6. Berita Acara & Rekap', icon: Printer },
  ];

  const currentTabInfo = submenus.find((s) => s.id === manajerialSubmenu) || submenus[0];

  const filteredItems =
    manajerialSubmenu === 'SEMUA' || manajerialSubmenu === 'REKAP_CETAK'
      ? activeManajerialDoc.items
      : activeManajerialDoc.items.filter((it) => it.kategori === currentTabInfo.categoryKey);

  const handleScoreChange = (itemId: string, newScore: number) => {
    updateManajerialItem(itemId, { skor: newScore });
  };

  const handleGenerateSmartFeedback = () => {
    const feedback = generateSmartFeedback('MANAJERIAL', activeManajerialDoc);
    updateManajerialDocInfo({
      catatanUmum: feedback.kekuatan,
      rekomendasiUmum: feedback.rekomendasi,
    });
    setSavingFeedback(true);
    setTimeout(() => setSavingFeedback(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Reciprocal Cross Link Banner */}
      <CrossLinkBanner currentView="MANAJERIAL" />

      {/* Header Info Panel */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Supervisi Manajerial Satuan Pendidikan
              </span>
              <span className="text-slate-400 text-xs">&bull;</span>
              <span className="text-xs font-semibold text-slate-600">
                {schoolProfile.namaSekolah}
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mt-1">
              Instrumen Supervisi Tata Kelola & 8 SNP
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Penilai Bertugas: <strong className="text-slate-800">{activeManajerialDoc.penilaiNama}</strong> ({activeManajerialDoc.penilaiRole.replace('_', ' ')}) &bull; NIP. {activeManajerialDoc.penilaiNip}
            </p>
          </div>

          {/* Live Score Display */}
          <div className="flex items-center space-x-4 bg-slate-50 border border-slate-200 rounded-2xl p-4 shrink-0">
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Nilai Capaian Manajerial
              </div>
              <div className="flex items-baseline space-x-1.5 mt-0.5">
                <span className="text-3xl font-extrabold text-blue-700">
                  {scoreData.nilaiAkhir}
                </span>
                <span className="text-xs font-semibold text-slate-400">/ 100</span>
              </div>
              <div
                className={`text-[11px] font-bold px-2 py-0.5 rounded-md border mt-1 inline-block ${scoreData.predikat.warna}`}
              >
                {scoreData.predikat.predikat}
              </div>
            </div>

            <button
              onClick={() => openPrintModal('MANAJERIAL')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2.5 rounded-xl text-xs font-bold shadow-xs flex items-center space-x-1.5 cursor-pointer self-center"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Berita Acara</span>
            </button>
          </div>
        </div>

        {/* Quick meta details (Nomor Surat, Tanggal) */}
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase">
              Nomor Surat Berita Acara:
            </label>
            <input
              type="text"
              value={activeManajerialDoc.nomorSurat}
              onChange={(e) => updateManajerialDocInfo({ nomorSurat: e.target.value })}
              className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-blue-500"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase">
              Tanggal Pelaksanaan Supervisi:
            </label>
            <input
              type="date"
              value={activeManajerialDoc.tanggalSupervisi}
              onChange={(e) => updateManajerialDocInfo({ tanggalSupervisi: e.target.value })}
              className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-blue-500"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase">
              Status Dokumen:
            </label>
            <select
              value={activeManajerialDoc.status}
              onChange={(e) => updateManajerialDocInfo({ status: e.target.value as any })}
              className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-blue-500"
            >
              <option value="Draft">Draft (Sedang Dikerjakan)</option>
              <option value="Ditinjau">Ditinjau Bersama KS</option>
              <option value="Final">Final (Disahkan Pengawas)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Submenu Pill Tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 scrollbar-none">
        {submenus.map((tab) => {
          const isSelected = manajerialSubmenu === tab.id;
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setManajerialSubmenu(tab.id)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <TabIcon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUBMENU 6: REKAPITULASI & BERITA ACARA KHUSUS */}
      {manajerialSubmenu === 'REKAP_CETAK' ? (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Rekapitulasi Capaian & Lembar Rekomendasi Supervisi Manajerial
                </h3>
                <p className="text-xs text-slate-500">
                  Format Berita Acara Resmi Pembinaan Pengawas Satuan Pendidikan Kabupaten Jayapura
                </p>
              </div>

              <button
                onClick={handleGenerateSmartFeedback}
                className="flex items-center space-x-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>{savingFeedback ? 'Rekomendasi Diperbarui!' : 'Generate Saran Pintar Otomatis'}</span>
              </button>
            </div>

            {/* Rekap Table */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-xs text-left border-collapse border border-slate-200">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <th className="p-3 border-r border-slate-200">No</th>
                    <th className="p-3 border-r border-slate-200">Bidang / Aspek Penilaian</th>
                    <th className="p-3 border-r border-slate-200">Bukti Verifikasi</th>
                    <th className="p-3 text-center border-r border-slate-200">Skor (1-4)</th>
                    <th className="p-3">Catatan Pembinaan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeManajerialDoc.items.map((it, idx) => (
                    <tr key={it.id} className="hover:bg-slate-50/70">
                      <td className="p-3 text-slate-500 font-semibold border-r border-slate-200">
                        {idx + 1}
                      </td>
                      <td className="p-3 border-r border-slate-200">
                        <div className="font-bold text-slate-900">{it.aspek}</div>
                        <div className="text-[11px] text-slate-500">{it.indikator}</div>
                      </td>
                      <td className="p-3 text-slate-600 border-r border-slate-200 text-[11px]">
                        {it.buktiFisik}
                      </td>
                      <td className="p-3 text-center font-extrabold text-blue-800 border-r border-slate-200 text-sm">
                        {it.skor}
                      </td>
                      <td className="p-3 text-slate-700 text-[11px]">
                        {it.catatanTemuan || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Catatan & Rekomendasi Edit Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Catatan Umum Temuan Evaluasi:
                </label>
                <textarea
                  rows={4}
                  value={activeManajerialDoc.catatanUmum}
                  onChange={(e) => updateManajerialDocInfo({ catatanUmum: e.target.value })}
                  placeholder="Catatan menyeluruh mengenai tata kelola sekolah..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-blue-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Rekomendasi Pembinaan & Tindak Lanjut:
                </label>
                <textarea
                  rows={4}
                  value={activeManajerialDoc.rekomendasiUmum}
                  onChange={(e) => updateManajerialDocInfo({ rekomendasiUmum: e.target.value })}
                  placeholder="Langkah konkret tindak lanjut pembenahan..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-blue-500"
                ></textarea>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-xs text-slate-500">
                Perubahan tersimpan otomatis di perangkat lokal.
              </span>
              <button
                onClick={() => openPrintModal('MANAJERIAL')}
                className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                <Printer className="w-4 h-4 text-blue-300" />
                <span>Cetak Lembar Resmi Berita Acara</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* LIST INSTRUMEN INDIKATOR */
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Menampilkan <strong>{filteredItems.length} Indikator</strong> pada kategori{' '}
              <strong>{currentTabInfo.label}</strong>
            </span>
            <span className="font-medium">
              Skala: 1 = Kurang &bull; 2 = Cukup &bull; 3 = Baik &bull; 4 = Amat Baik
            </span>
          </div>

          {filteredItems.map((item) => {
            const hasCrossLink = Boolean(item.kaitanDenganPBM);
            return (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-blue-300 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Left Column: Aspek & Indikator */}
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="bg-slate-100 text-slate-700 text-[10px] font-extrabold px-2 py-0.5 rounded border border-slate-200">
                        {item.kodeIndikator}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">
                        {item.aspek}
                      </h4>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed">
                      {item.indikator}
                    </p>

                    <div className="flex items-start space-x-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <Info className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-700">Bukti Fisik / Dokumen:</strong>{' '}
                        {item.buktiFisik}
                      </span>
                    </div>

                    {/* Cross Link Notice for Standar Proses / PBM */}
                    {hasCrossLink && (
                      <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-2.5 flex items-center justify-between text-xs text-emerald-900">
                        <div className="flex items-center space-x-2">
                          <Link2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="text-[11px] leading-tight">
                            <strong className="text-emerald-800">Kaitan PBM:</strong>{' '}
                            {item.kaitanDenganPBM}
                          </span>
                        </div>
                        <button
                          onClick={() => navigateToPBM(undefined, 'JADWAL_GURU')}
                          className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 underline flex items-center space-x-1 shrink-0 ml-2 cursor-pointer"
                        >
                          <span>Lihat Guru</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Scoring Selector & Notes */}
                  <div className="lg:w-80 shrink-0 space-y-3 bg-slate-50/70 p-4 rounded-xl border border-slate-100">
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-[10px] font-bold text-slate-600 uppercase">
                          Skor Penilaian:
                        </label>
                        <span className="text-xs font-extrabold text-blue-700">
                          {item.skor === 4
                            ? '4 - Amat Baik'
                            : item.skor === 3
                            ? '3 - Baik'
                            : item.skor === 2
                            ? '2 - Cukup'
                            : '1 - Kurang'}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-1.5">
                        {[1, 2, 3, 4].map((s) => (
                          <button
                            key={s}
                            onClick={() => handleScoreChange(item.id, s)}
                            className={`py-2 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                              item.skor === s
                                ? 'bg-blue-600 text-white shadow-xs scale-102'
                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                        Catatan Temuan / Rekomendasi:
                      </label>
                      <input
                        type="text"
                        value={item.catatanTemuan}
                        onChange={(e) =>
                          updateManajerialItem(item.id, { catatanTemuan: e.target.value })
                        }
                        placeholder="Tuliskan temuan fisik..."
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
