import React from 'react';
import {
  Building2,
  GraduationCap,
  Users,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  FileCheck,
  ShieldCheck,
  School,
  ArrowRightLeft,
  Calendar,
  Sparkles,
  Printer,
  ChevronRight,
  PlusCircle,
} from 'lucide-react';
import { useSupervisi } from '../context/SupervisiContext';
import {
  calculateManajerialScore,
  calculatePBMScore,
  getPredikat,
  formatIndonesianDate,
} from '../utils/calc';

export const Dashboard: React.FC = () => {
  const {
    schoolProfile,
    teachers,
    manajerialDocs,
    activeManajerialDoc,
    pbmDocs,
    navigateToPBM,
    navigateToManajerial,
    openPrintModal,
    createNewPBMDoc,
    activeRole,
    getActiveEvaluatorName,
  } = useSupervisi();

  // Metrics
  const manajerialScore = activeManajerialDoc
    ? calculateManajerialScore(activeManajerialDoc.items)
    : { nilaiAkhir: 0, predikat: getPredikat(0), totalSkor: 0, skorMaks: 0 };

  const finishedPBMDocs = pbmDocs.filter((d) => d.status === 'Selesai');
  const pbmScores = finishedPBMDocs.map((d) => calculatePBMScore(d.items).nilaiAkhir);
  const avgPbmScore =
    pbmScores.length > 0
      ? Number(
          (pbmScores.reduce((acc, cur) => acc + cur, 0) / pbmScores.length).toFixed(1)
        )
      : 0;
  const pbmPredikat = getPredikat(avgPbmScore);

  // Grouping teachers
  const totalGuru = teachers.length;
  const guruSudahSupervisi = finishedPBMDocs.length;
  const persenSelesaiPBM = Math.round((guruSudahSupervisi / Math.max(1, totalGuru)) * 100);

  // Categories breakdown for Manajerial
  const catNames: Record<string, string> = {
    KOSP_KURIKULUM: 'KOSP & Kurikulum',
    SNP_8: '8 Standar SNP',
    KINERJA_KS_TU: 'Kinerja KS & TU',
    SARPRAS_LINGKUNGAN: 'Sarpras & Lingkungan',
    RKT_RKJM_RAPOR: 'RKT & Rapor Pendidikan',
  };

  const manajerialBreakdown = ['KOSP_KURIKULUM', 'SNP_8', 'KINERJA_KS_TU', 'SARPRAS_LINGKUNGAN', 'RKT_RKJM_RAPOR'].map((catKey) => {
    const items = activeManajerialDoc?.items.filter((i) => i.kategori === catKey) || [];
    const earned = items.reduce((sum, it) => sum + it.skor, 0);
    const max = items.length * 4;
    const pct = max > 0 ? Math.round((earned / max) * 100) : 0;
    return {
      key: catKey,
      label: catNames[catKey],
      itemsCount: items.length,
      persen: pct,
    };
  });

  // Aspects breakdown for PBM
  const pbmAspectLabels: Record<string, string> = {
    PERENCANAAN: 'Perencanaan / Modul Ajar',
    PELAKSANAAN_KELAS: 'Pelaksanaan PBM di Kelas',
    PENILAIAN_ASESMEN: 'Penilaian & Asesmen Siswa',
    ADMINISTRASI_GURU: 'Administrasi Guru',
    TINDAK_LANJUT: 'Refleksi & Tindak Lanjut',
  };

  const pbmBreakdown = ['PERENCANAAN', 'PELAKSANAAN_KELAS', 'PENILAIAN_ASESMEN', 'ADMINISTRASI_GURU', 'TINDAK_LANJUT'].map((aspKey) => {
    let earned = 0;
    let max = 0;
    finishedPBMDocs.forEach((doc) => {
      const aspItems = doc.items.filter((it) => it.aspek === aspKey);
      earned += aspItems.reduce((sum, it) => sum + it.skor, 0);
      max += aspItems.length * 4;
    });
    const pct = max > 0 ? Math.round((earned / max) * 100) : 0;
    return {
      key: aspKey,
      label: pbmAspectLabels[aspKey],
      persen: pct,
    };
  });

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-linear-to-br from-indigo-900 via-indigo-800 to-blue-900 rounded-3xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_70%)] pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-indigo-200 border border-white/15 mb-3">
            <School className="w-3.5 h-3.5 text-indigo-300" />
            <span>Pemerintah Kabupaten Jayapura &bull; Dinas Pendidikan</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Supervisi Terpadu {schoolProfile.namaSekolah}
          </h2>
          <p className="text-indigo-100 text-sm md:text-base mt-2 leading-relaxed">
            Portal integrasi penjaminan mutu satuan pendidikan antara{' '}
            <strong className="text-white">Supervisi Manajerial</strong> (Tata Kelola & 8 Standar Nasional) serta{' '}
            <strong className="text-white">Supervisi Kelas/PBM</strong> (Observasi Modul Ajar & Praktik Mengajar Guru).
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-xs">
            <span className="bg-black/25 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/10">
              Penilai Saat Ini: <strong className="text-indigo-200">{getActiveEvaluatorName()}</strong>
            </span>
            <span className="bg-black/25 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/10">
              Tahun Ajaran: <strong className="text-indigo-200">{schoolProfile.tahunAjaran} ({schoolProfile.semester})</strong>
            </span>
            <span className="bg-black/25 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/10">
              Akreditasi: <strong className="text-emerald-300">{schoolProfile.akreditasi}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* 4 Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Manajerial Score */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Supervisi Manajerial
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {manajerialScore.nilaiAkhir}
            </span>
            <span className="text-xs text-slate-400 font-semibold">/ 100</span>
          </div>
          <div className="mt-2 flex items-center space-x-2">
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${manajerialScore.predikat.warna}`}
            >
              {manajerialScore.predikat.predikat}
            </span>
            <span className="text-[11px] text-slate-500">
              {activeManajerialDoc?.items.length || 0} Indikator
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
            <button
              onClick={() => navigateToManajerial('SEMUA')}
              className="text-blue-600 font-bold hover:text-blue-800 flex items-center space-x-1 cursor-pointer"
            >
              <span>Buka Menu Manajerial</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* KPI 2: PBM Average Score */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Rata-rata Supervisi PBM
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {avgPbmScore}
            </span>
            <span className="text-xs text-slate-400 font-semibold">/ 100</span>
          </div>
          <div className="mt-2 flex items-center space-x-2">
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${pbmPredikat.warna}`}
            >
              {pbmPredikat.predikat}
            </span>
            <span className="text-[11px] text-slate-500">
              {guruSudahSupervisi} Guru Selesai
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
            <button
              onClick={() => navigateToPBM(undefined, 'JADWAL_GURU')}
              className="text-emerald-600 font-bold hover:text-emerald-800 flex items-center space-x-1 cursor-pointer"
            >
              <span>Buka Supervisi Kelas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* KPI 3: Progress Guru */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Cakupan Guru Kelas
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {persenSelesaiPBM}%
            </span>
            <span className="text-xs text-slate-500">
              ({guruSudahSupervisi} dari {totalGuru} Guru)
            </span>
          </div>
          <div className="mt-2.5 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${persenSelesaiPBM}%` }}
            ></div>
          </div>
          <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
            <span>Kurang {totalGuru - guruSudahSupervisi} Guru lagi</span>
            <span className="font-semibold text-purple-700">Target 100%</span>
          </div>
        </div>

        {/* KPI 4: Sinergi Penilai */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Tim Penilai Supervisi
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-sm font-bold text-slate-800">
              3 Kategori Penilai
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Pengawas Pembina &bull; Kepala Sekolah &bull; Guru Senior
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Kolaboratif
            </span>
            <span className="text-slate-500">Skala Penilaian 1-4</span>
          </div>
        </div>
      </div>

      {/* Mutual Link Explainer Banner */}
      <div className="bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-5 shadow-md">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 bg-white/10 rounded-xl border border-white/20 shrink-0">
              <ArrowRightLeft className="w-6 h-6 text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="bg-emerald-400/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-emerald-400/30">
                  Keterkaitan Saling Link
                </span>
                <span className="text-xs text-indigo-200 font-semibold">
                  Manajerial &harr; Kelas (PBM)
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">
                Mengapa Supervisi Manajerial dan Supervisi Kelas Harus Saling Terhubung?
              </h3>
              <p className="text-xs text-indigo-200 mt-1 max-w-3xl leading-relaxed">
                Di SMP Negeri 7 Sentani, kebijakan manajerial (KOSP, Pengadaan Sarpras Lab, Alokasi BOS, dan RKT) dirancang untuk memfasilitasi kualitas pembelajaran murid di kelas. Sebaliknya, temuan observasi di kelas oleh Pengawas, Kepala Sekolah, dan Guru Senior menjadi umpan balik langsung untuk mengevaluasi Standar Proses & Standar Pendidik sekolah.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => navigateToManajerial('SNP_8')}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Buka 8 Standar SNP
            </button>
            <button
              onClick={() => navigateToPBM(undefined, 'JADWAL_GURU')}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              Buka Supervisi Guru
            </button>
          </div>
        </div>
      </div>

      {/* Dual Breakdown Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Manajerial 5 Pillars */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <span>Capaian 5 Bidang Supervisi Manajerial</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluasi mutu tata kelola dan 8 Standar Nasional Pendidikan
              </p>
            </div>
            <button
              onClick={() => navigateToManajerial('SEMUA')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1 cursor-pointer"
            >
              <span>Detail</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {manajerialBreakdown.map((item) => (
              <div key={item.key} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">
                    {item.label}
                  </span>
                  <span className="font-bold text-slate-900">{item.persen}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      item.persen >= 85
                        ? 'bg-blue-600'
                        : item.persen >= 70
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${item.persen}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Nomor Dokumen: {activeManajerialDoc?.nomorSurat}</span>
            <button
              onClick={() => openPrintModal('MANAJERIAL')}
              className="text-indigo-600 font-bold hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Hasil Manajerial</span>
            </button>
          </div>
        </div>

        {/* Right: PBM 5 Aspects */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <GraduationCap className="w-5 h-5 text-emerald-600" />
                <span>Capaian 5 Aspek Supervisi Kelas (PBM)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Agregat observasi proses belajar mengajar di ruang kelas
              </p>
            </div>
            <button
              onClick={() => navigateToPBM(undefined, 'JADWAL_GURU')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-800 flex items-center space-x-1 cursor-pointer"
            >
              <span>Detail</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {pbmBreakdown.map((item) => (
              <div key={item.key} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">
                    {item.label}
                  </span>
                  <span className="font-bold text-slate-900">{item.persen}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      item.persen >= 85
                        ? 'bg-emerald-600'
                        : item.persen >= 70
                        ? 'bg-teal-500'
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${item.persen}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Sampel: {finishedPBMDocs.length} Dokumen Kelas Selesai</span>
            <button
              onClick={() => openPrintModal('REKAP_TOTAL')}
              className="text-emerald-700 font-bold hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Rekap Nilai Guru</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Supervisi PBM Table & Quick Action */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <span>Daftar Guru & Jadwal Supervisi Kelas SMP Negeri 7 Sentani</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Status pelaksanaan supervisi akademik oleh Pengawas, Kepala Sekolah, dan Guru Senior
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                const availableTeacher = teachers.find(
                  (t) => !pbmDocs.some((d) => d.teacherId === t.id && d.status === 'Selesai')
                ) || teachers[0];
                if (availableTeacher) {
                  const doc = createNewPBMDoc(availableTeacher.id);
                  navigateToPBM(doc.id, 'PELAKSANAAN_KELAS');
                }
              }}
              className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Supervisi Guru Baru</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-y border-slate-200">
                <th className="py-3 px-3">No</th>
                <th className="py-3 px-3">Nama Guru & NIP</th>
                <th className="py-3 px-3">Mata Pelajaran & Kelas</th>
                <th className="py-3 px-3">Tanggal</th>
                <th className="py-3 px-3">Penilai</th>
                <th className="py-3 px-3 text-center">Skor PBM</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pbmDocs.map((doc, idx) => {
                const scoreInfo = calculatePBMScore(doc.items);
                return (
                  <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 text-slate-400 font-medium">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{doc.teacherNama}</div>
                      <div className="text-[11px] text-slate-500">NIP. {doc.teacherNip}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800">{doc.mataPelajaran}</div>
                      <div className="text-[11px] text-slate-500">{doc.kelas}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-medium">
                      {formatIndonesianDate(doc.tanggalSupervisi)}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-700">{doc.penilaiNama}</div>
                      <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200">
                        {doc.penilaiRole.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="font-extrabold text-slate-900 text-sm">
                        {scoreInfo.nilaiAkhir}
                      </div>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${scoreInfo.predikat.warna}`}
                      >
                        {scoreInfo.predikat.predikat.split(' ')[0]}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          doc.status === 'Selesai'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {doc.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => navigateToPBM(doc.id, 'PELAKSANAAN_KELAS')}
                          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                        >
                          Evaluasi
                        </button>
                        <button
                          onClick={() => openPrintModal('PBM', doc.id)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1.5 rounded-lg transition-colors cursor-pointer"
                          title="Cetak Berita Acara Guru Ini"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
