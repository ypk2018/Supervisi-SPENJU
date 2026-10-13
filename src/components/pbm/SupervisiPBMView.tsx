import React, { useState } from 'react';
import {
  GraduationCap,
  Users,
  BookOpen,
  ClipboardList,
  FileSpreadsheet,
  CheckCircle2,
  Printer,
  Sparkles,
  Link2,
  PlusCircle,
  Search,
  Filter,
  Calendar,
  Clock,
  ArrowRight,
  Info,
  Check,
  AlertTriangle,
  ChevronRight,
  User,
} from 'lucide-react';
import { useSupervisi, PBMSubmenu } from '../../context/SupervisiContext';
import { calculatePBMScore, formatIndonesianDate, generateSmartFeedback } from '../../utils/calc';
import { CrossLinkBanner } from '../common/CrossLinkBanner';
import { PBMAspectKey } from '../../types/supervisi';

export const SupervisiPBMView: React.FC = () => {
  const {
    pbmDocs,
    selectedPBMDoc,
    setSelectedPBMDocId,
    updatePBMItem,
    updatePBMDocInfo,
    createNewPBMDoc,
    teachers,
    pbmSubmenu,
    setPBMSubmenu,
    navigateToManajerial,
    openPrintModal,
    activeRole,
    getActiveEvaluatorName,
    getActiveEvaluatorNip,
    schoolProfile,
  } = useSupervisi();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterMapel, setFilterMapel] = useState('ALL');
  const [smartFeedbackSaved, setSmartFeedbackSaved] = useState(false);

  const submenus: { id: PBMSubmenu; label: string; icon: any; aspectKey?: PBMAspectKey }[] = [
    { id: 'JADWAL_GURU', label: '1. Jadwal & Master Guru', icon: Users },
    { id: 'PERENCANAAN', label: '2. Perencanaan / Modul Ajar', icon: BookOpen, aspectKey: 'PERENCANAAN' },
    { id: 'PELAKSANAAN_KELAS', label: '3. Pelaksanaan di Kelas', icon: GraduationCap, aspectKey: 'PELAKSANAAN_KELAS' },
    { id: 'PENILAIAN_ASESMEN', label: '4. Penilaian & Asesmen', icon: ClipboardList, aspectKey: 'PENILAIAN_ASESMEN' },
    { id: 'ADMINISTRASI_GURU', label: '5. Administrasi Guru', icon: FileSpreadsheet, aspectKey: 'ADMINISTRASI_GURU' },
    { id: 'TINDAK_LANJUT', label: '6. Refleksi & Tindak Lanjut', icon: CheckCircle2, aspectKey: 'TINDAK_LANJUT' },
    { id: 'REKAP_CETAK', label: '7. Lembar Nilai & Berita Acara', icon: Printer },
  ];

  const currentTabInfo = submenus.find((s) => s.id === pbmSubmenu) || submenus[0];

  // Active doc score
  const scoreInfo = selectedPBMDoc
    ? calculatePBMScore(selectedPBMDoc.items)
    : {
        nilaiAkhir: 0,
        skorMaks: 0,
        totalSkor: 0,
        predikat: {
          predikat: 'Kurang (D)' as const,
          warna: '',
          bgWarna: '',
          keterangan: '',
        },
        aspekScores: {},
      };

  const filteredTeachers = teachers.filter((t) => {
    const matchQuery =
      t.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.mataPelajaran.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.nip.includes(searchQuery);
    const matchMapel = filterMapel === 'ALL' || t.mataPelajaran.includes(filterMapel);
    return matchQuery && matchMapel;
  });

  const uniqueMapels = Array.from(new Set(teachers.map((t) => t.mataPelajaran)));

  const handleScoreChange = (itemId: string, newScore: number) => {
    if (!selectedPBMDoc) return;
    updatePBMItem(selectedPBMDoc.id, itemId, { skor: newScore });
  };

  const handleGenerateSmartCoaching = () => {
    if (!selectedPBMDoc) return;
    const fb = generateSmartFeedback('PBM', selectedPBMDoc);
    updatePBMDocInfo(selectedPBMDoc.id, {
      kekuatanGuru: fb.kekuatan,
      rekomendasiPembinaan: fb.rekomendasi,
    });
    setSmartFeedbackSaved(true);
    setTimeout(() => setSmartFeedbackSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Reciprocal Cross Link Banner */}
      <CrossLinkBanner
        currentView="PBM"
        guruTerkait={selectedPBMDoc?.teacherNama}
      />

      {/* Teacher Selection & Live PBM Score Bar */}
      {selectedPBMDoc && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Supervisi Kelas / Akademik
                </span>
                <span className="text-slate-400 text-xs">&bull;</span>
                <span className="text-xs font-semibold text-slate-600">
                  {selectedPBMDoc.kelas}
                </span>
              </div>
              <h2 className="text-2xl font-black text-slate-900">
                {selectedPBMDoc.teacherNama}
              </h2>
              <p className="text-xs text-slate-500">
                Mata Pelajaran: <strong className="text-slate-800">{selectedPBMDoc.mataPelajaran}</strong> &bull; NIP: {selectedPBMDoc.teacherNip} &bull; Materi: {selectedPBMDoc.materiPokok}
              </p>
              <div className="flex items-center space-x-2 pt-1 text-xs text-slate-500">
                <span>Penilai: <strong className="text-slate-700">{selectedPBMDoc.penilaiNama}</strong> ({selectedPBMDoc.penilaiRole.replace('_', ' ')})</span>
                <span>&bull;</span>
                <span>Tanggal: {formatIndonesianDate(selectedPBMDoc.tanggalSupervisi)}</span>
              </div>
            </div>

            {/* Live Score Counter */}
            <div className="flex items-center space-x-4 bg-slate-50 border border-slate-200 rounded-2xl p-4 shrink-0">
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Nilai Capaian PBM
                </div>
                <div className="flex items-baseline space-x-1.5 mt-0.5">
                  <span className="text-3xl font-extrabold text-emerald-700">
                    {scoreInfo.nilaiAkhir}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">/ 100</span>
                </div>
                <div
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-md border mt-1 inline-block ${scoreInfo.predikat.warna}`}
                >
                  {scoreInfo.predikat.predikat}
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => openPrintModal('PBM', selectedPBMDoc.id)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-xl text-xs font-bold shadow-xs flex items-center space-x-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Hasil Guru</span>
                </button>
                <button
                  onClick={() => setPBMSubmenu('JADWAL_GURU')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-[11px] font-semibold text-center cursor-pointer"
                >
                  Ganti Guru Lain
                </button>
              </div>
            </div>
          </div>

          {/* Quick Doc Meta Inputs */}
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase">
                Materi Pokok / Bahasan:
              </label>
              <input
                type="text"
                value={selectedPBMDoc.materiPokok}
                onChange={(e) =>
                  updatePBMDocInfo(selectedPBMDoc.id, { materiPokok: e.target.value })
                }
                className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-emerald-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase">
                Kelas & Jam Pelajaran:
              </label>
              <input
                type="text"
                value={`${selectedPBMDoc.kelas} - ${selectedPBMDoc.jamKe}`}
                onChange={(e) => {
                  const parts = e.target.value.split('-');
                  updatePBMDocInfo(selectedPBMDoc.id, {
                    kelas: parts[0]?.trim() || selectedPBMDoc.kelas,
                    jamKe: parts[1]?.trim() || selectedPBMDoc.jamKe,
                  });
                }}
                className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-emerald-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase">
                Tanggal Observasi:
              </label>
              <input
                type="date"
                value={selectedPBMDoc.tanggalSupervisi}
                onChange={(e) =>
                  updatePBMDocInfo(selectedPBMDoc.id, {
                    tanggalSupervisi: e.target.value,
                  })
                }
                className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-emerald-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase">
                Status Observasi:
              </label>
              <select
                value={selectedPBMDoc.status}
                onChange={(e) =>
                  updatePBMDocInfo(selectedPBMDoc.id, {
                    status: e.target.value as any,
                  })
                }
                className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-emerald-500"
              >
                <option value="Terjadwal">Terjadwal</option>
                <option value="Sedang Berlangsung">Sedang Berlangsung</option>
                <option value="Selesai">Selesai (Dinilai Penuh)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Submenu Tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 scrollbar-none">
        {submenus.map((tab) => {
          const isSelected = pbmSubmenu === tab.id;
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setPBMSubmenu(tab.id)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <TabIcon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUBMENU 1: JADWAL & MASTER GURU */}
      {pbmSubmenu === 'JADWAL_GURU' && (
        <div className="space-y-5">
          {/* Filter & Search Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-1 items-center space-x-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari guru, mata pelajaran, atau NIP..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-emerald-500"
                />
              </div>

              <select
                value={filterMapel}
                onChange={(e) => setFilterMapel(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-emerald-500"
              >
                <option value="ALL">Semua Mata Pelajaran</option>
                {uniqueMapels.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-xs text-slate-500">
              Total <strong>{filteredTeachers.length} Guru</strong> di SMPN 7 Sentani
            </div>
          </div>

          {/* Teacher Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTeachers.map((teacher) => {
              const existingDoc = pbmDocs.find((d) => d.teacherId === teacher.id);
              const isSelected = selectedPBMDoc?.teacherId === teacher.id;
              const docScore = existingDoc ? calculatePBMScore(existingDoc.items) : null;

              return (
                <div
                  key={teacher.id}
                  className={`bg-white border rounded-2xl p-5 shadow-xs transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-500 ring-2 ring-emerald-100'
                      : 'border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {teacher.statusKepegawaian}
                      </span>
                      {existingDoc ? (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            existingDoc.status === 'Selesai'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {existingDoc.status}
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border">
                          Belum Dijadwalkan
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-slate-900 mt-2 text-sm">
                      {teacher.nama}
                    </h4>
                    <p className="text-xs font-medium text-emerald-700 mt-0.5">
                      {teacher.mataPelajaran}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Kelas: {teacher.kelasDiampu} &bull; {teacher.pangkatGolongan}
                    </p>

                    {existingDoc && docScore && (
                      <div className="mt-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-slate-500 text-[10px] block">Skor Terkini:</span>
                          <span className="font-extrabold text-slate-800 text-sm">
                            {docScore.nilaiAkhir}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${docScore.predikat.warna}`}
                        >
                          {docScore.predikat.predikat.split(' ')[0]}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    {existingDoc ? (
                      <>
                        <button
                          onClick={() => {
                            setSelectedPBMDocId(existingDoc.id);
                            setPBMSubmenu('PELAKSANAAN_KELAS');
                          }}
                          className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center space-x-1 cursor-pointer"
                        >
                          <span>Buka Instrumen PBM</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openPrintModal('PBM', existingDoc.id)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
                          title="Cetak Berita Acara"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          const doc = createNewPBMDoc(teacher.id);
                          setPBMSubmenu('PELAKSANAAN_KELAS');
                        }}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Mulai Observasi Guru</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBMENU 7: LEMBAR NILAI & BERITA ACARA */}
      {pbmSubmenu === 'REKAP_CETAK' && selectedPBMDoc && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Rekapitulasi Lembar Observasi & Pembinaan Guru: {selectedPBMDoc.teacherNama}
                </h3>
                <p className="text-xs text-slate-500">
                  Lampiran Berita Acara Supervisi Akademik & Umpan Balik Tindak Lanjut PBM
                </p>
              </div>

              <button
                onClick={handleGenerateSmartCoaching}
                className="flex items-center space-x-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>{smartFeedbackSaved ? 'Coaching Diperbarui!' : 'Generate Saran Pembinaan Pintar'}</span>
              </button>
            </div>

            {/* Aspek Scores Bar */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
              {Object.entries(scoreInfo.aspekScores).map(([key, val]) => (
                <div key={key} className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block truncate">
                    {key.replace('_', ' ')}
                  </span>
                  <div className="text-base font-black text-slate-800 mt-1">
                    {val.persen}%
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {val.skor} dari {val.max}
                  </span>
                </div>
              ))}
            </div>

            {/* Reflection and coaching notes */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Kekuatan Guru yang Diobservasi (Praktik Baik):
                  </label>
                  <textarea
                    rows={3}
                    value={selectedPBMDoc.kekuatanGuru}
                    onChange={(e) =>
                      updatePBMDocInfo(selectedPBMDoc.id, {
                        kekuatanGuru: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-emerald-500"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Aspek yang Perlu Ditingkatkan:
                  </label>
                  <textarea
                    rows={3}
                    value={selectedPBMDoc.kelemahanGuru}
                    onChange={(e) =>
                      updatePBMDocInfo(selectedPBMDoc.id, {
                        kelemahanGuru: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-emerald-500"
                  ></textarea>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Rekomendasi Pembinaan Penilai (Coaching):
                  </label>
                  <textarea
                    rows={3}
                    value={selectedPBMDoc.rekomendasiPembinaan}
                    onChange={(e) =>
                      updatePBMDocInfo(selectedPBMDoc.id, {
                        rekomendasiPembinaan: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-emerald-500"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Kesepakatan Rencana Tindak Lanjut Guru:
                  </label>
                  <textarea
                    rows={3}
                    value={selectedPBMDoc.kesepakatanTindakLanjut}
                    onChange={(e) =>
                      updatePBMDocInfo(selectedPBMDoc.id, {
                        kesepakatanTindakLanjut: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-emerald-500"
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-xs text-slate-500">
                Peringkat Capaian: <strong>{scoreInfo.predikat.predikat}</strong> ({scoreInfo.nilaiAkhir}/100)
              </span>
              <button
                onClick={() => openPrintModal('PBM', selectedPBMDoc.id)}
                className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                <Printer className="w-4 h-4 text-emerald-300" />
                <span>Cetak Lembar Resmi Hasil Supervisi</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ASPECT SPECIFIC RUBRICS (PERENCANAAN, PELAKSANAAN_KELAS, PENILAIAN_ASESMEN, ADMINISTRASI_GURU, TINDAK_LANJUT) */}
      {pbmSubmenu !== 'JADWAL_GURU' && pbmSubmenu !== 'REKAP_CETAK' && selectedPBMDoc && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Menilai Aspek: <strong>{currentTabInfo.label}</strong> untuk Guru{' '}
              <strong className="text-slate-800">{selectedPBMDoc.teacherNama}</strong>
            </span>
            <span className="font-medium">
              Skala Penilaian: 1 = Kurang &bull; 2 = Cukup &bull; 3 = Baik &bull; 4 = Amat Baik
            </span>
          </div>

          {selectedPBMDoc.items
            .filter((it) => it.aspek === currentTabInfo.aspectKey)
            .map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-emerald-300 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Left Column: Indikator & Deskripsi */}
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="bg-emerald-50 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded border border-emerald-200">
                        Indikator #{item.nomor}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">
                        {item.indikator}
                      </h4>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed">
                      {item.deskripsi}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 text-xs">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase">
                          Catatan Hasil Pengamatan:
                        </label>
                        <input
                          type="text"
                          value={item.catatan}
                          onChange={(e) =>
                            updatePBMItem(selectedPBMDoc.id, item.id, {
                              catatan: e.target.value,
                            })
                          }
                          placeholder="Temuan di kelas..."
                          className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase">
                          Saran Pembinaan Guru:
                        </label>
                        <input
                          type="text"
                          value={item.saranPerbaikan}
                          onChange={(e) =>
                            updatePBMItem(selectedPBMDoc.id, item.id, {
                              saranPerbaikan: e.target.value,
                            })
                          }
                          placeholder="Saran konkret bagi guru..."
                          className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-emerald-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Scoring Selector */}
                  <div className="lg:w-72 shrink-0 space-y-2 bg-slate-50/70 p-4 rounded-xl border border-slate-100">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[10px] font-bold text-slate-600 uppercase">
                        Skor Penilai:
                      </label>
                      <span className="text-xs font-extrabold text-emerald-700">
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
                              ? 'bg-emerald-600 text-white shadow-xs scale-102'
                              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>

                    <div className="pt-2 text-[10px] text-slate-400 text-center">
                      Dinilai oleh: {selectedPBMDoc.penilaiRole.replace('_', ' ')}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
