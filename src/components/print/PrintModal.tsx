import React from 'react';
import { X, Printer, Download, School } from 'lucide-react';
import { useSupervisi } from '../../context/SupervisiContext';
import {
  calculateManajerialScore,
  calculatePBMScore,
  formatIndonesianDate,
} from '../../utils/calc';

export const PrintModal: React.FC = () => {
  const {
    printModalData,
    closePrintModal,
    schoolProfile,
    activeManajerialDoc,
    pbmDocs,
    teachers,
  } = useSupervisi();

  if (!printModalData.isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const selectedPBMDoc =
    pbmDocs.find((d) => d.id === printModalData.dataId) || pbmDocs[0];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Modal Top Bar (Hidden during print) */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2">
            <Printer className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold">
              Pratinjau Cetak Dokumen Resmi Supervisi
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Sekarang (Print / PDF)</span>
            </button>
            <button
              onClick={closePrintModal}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Printable Content */}
        <div className="p-8 md:p-12 overflow-y-auto bg-white text-slate-900 font-sans print:p-0">
          {/* KOP SURAT RESMI DINAS PENDIDIKAN KABUPATEN JAYAPURA */}
          <div className="border-b-4 border-double border-slate-900 pb-3 mb-6 text-center">
            <div className="flex items-center justify-center space-x-4 mb-1">
              {/* Insignia emblem representation */}
              <div className="w-14 h-14 rounded-full border-2 border-slate-900 flex items-center justify-center font-bold text-xs">
                PAPUA
              </div>
              <div className="text-center">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                  PEMERINTAH KABUPATEN JAYAPURA
                </h4>
                <h3 className="text-base font-extrabold uppercase tracking-wide text-slate-900">
                  DINAS PENDIDIKAN
                </h3>
                <h2 className="text-xl font-black uppercase tracking-tight text-slate-950">
                  {schoolProfile.namaSekolah}
                </h2>
                <p className="text-[11px] text-slate-600">
                  Alamat: {schoolProfile.alamat}, {schoolProfile.distrik}, {schoolProfile.kabupaten}, {schoolProfile.provinsi}
                </p>
                <p className="text-[10px] text-slate-500">
                  NPSN: {schoolProfile.npsn} &bull; NSS: {schoolProfile.nss} &bull; Email: {schoolProfile.email}
                </p>
              </div>
              <div className="w-14 h-14 rounded-full border-2 border-slate-900 flex items-center justify-center font-bold text-xs">
                SMPN 7
              </div>
            </div>
          </div>

          {/* DOKUMEN 1: SUPERVISI MANAJERIAL */}
          {printModalData.type === 'MANAJERIAL' && activeManajerialDoc && (() => {
            const manScore = calculateManajerialScore(activeManajerialDoc.items);
            return (
              <div className="space-y-5 text-xs text-slate-900">
                <div className="text-center">
                  <h3 className="text-base font-black underline uppercase">
                    BERITA ACARA & LEMBAR HASIL SUPERVISI MANAJERIAL
                  </h3>
                  <p className="text-[11px] font-semibold text-slate-700 mt-0.5">
                    Nomor: {activeManajerialDoc.nomorSurat}
                  </p>
                  <p className="text-[11px] text-slate-600">
                    Tahun Ajaran {schoolProfile.tahunAjaran} Semester {schoolProfile.semester}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 border border-slate-300 p-3 rounded-lg bg-slate-50 text-[11px]">
                  <div>
                    <p><strong>Satuan Pendidikan:</strong> {schoolProfile.namaSekolah}</p>
                    <p><strong>NPSN / Akreditasi:</strong> {schoolProfile.npsn} / {schoolProfile.akreditasi}</p>
                    <p><strong>Kepala Sekolah:</strong> {schoolProfile.namaKepalaSekolah}</p>
                    <p><strong>NIP:</strong> {schoolProfile.nipKepalaSekolah}</p>
                  </div>
                  <div>
                    <p><strong>Tanggal Supervisi:</strong> {formatIndonesianDate(activeManajerialDoc.tanggalSupervisi)}</p>
                    <p><strong>Nama Penilai:</strong> {activeManajerialDoc.penilaiNama}</p>
                    <p><strong>Jabatan Penilai:</strong> {activeManajerialDoc.penilaiRole.replace('_', ' ')}</p>
                    <p><strong>NIP Penilai:</strong> {activeManajerialDoc.penilaiNip}</p>
                  </div>
                </div>

                {/* Table Hasil Manajerial */}
                <table className="w-full text-left border-collapse border border-slate-400 text-[11px]">
                  <thead>
                    <tr className="bg-slate-200 font-bold border-b border-slate-400">
                      <th className="p-2 border border-slate-400 text-center w-8">No</th>
                      <th className="p-2 border border-slate-400">Aspek & Indikator Supervisi Manajerial</th>
                      <th className="p-2 border border-slate-400">Bukti Fisik</th>
                      <th className="p-2 border border-slate-400 text-center w-12">Skor</th>
                      <th className="p-2 border border-slate-400">Catatan Temuan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeManajerialDoc.items.map((it, idx) => (
                      <tr key={it.id}>
                        <td className="p-2 border border-slate-300 text-center">{idx + 1}</td>
                        <td className="p-2 border border-slate-300">
                          <strong className="block">{it.aspek}</strong>
                          <span className="text-[10px] text-slate-600">{it.indikator}</span>
                        </td>
                        <td className="p-2 border border-slate-300 text-[10px] text-slate-600">{it.buktiFisik}</td>
                        <td className="p-2 border border-slate-300 text-center font-bold">{it.skor}</td>
                        <td className="p-2 border border-slate-300 text-[10px]">{it.catatanTemuan || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-100 font-bold">
                      <td colSpan={3} className="p-2 border border-slate-400 text-right">
                        Nilai Akhir Capaian Manajerial:
                      </td>
                      <td className="p-2 border border-slate-400 text-center font-black text-sm">
                        {manScore.nilaiAkhir}
                      </td>
                      <td className="p-2 border border-slate-400">
                        Predikat: <strong>{manScore.predikat.predikat}</strong>
                      </td>
                    </tr>
                  </tfoot>
                </table>

                {/* Catatan & Rekomendasi */}
                <div className="border border-slate-300 p-3 rounded-lg space-y-2 text-[11px]">
                  <div>
                    <strong>Catatan Umum Evaluasi:</strong>
                    <p className="text-slate-800 mt-0.5">{activeManajerialDoc.catatanUmum}</p>
                  </div>
                  <div>
                    <strong>Rekomendasi Pembinaan & Tindak Lanjut:</strong>
                    <p className="text-slate-800 mt-0.5 whitespace-pre-line">{activeManajerialDoc.rekomendasiUmum}</p>
                  </div>
                </div>

                {/* Tanda Tangan Resmi */}
                <div className="pt-8 grid grid-cols-2 text-center text-xs">
                  <div>
                    <p>Mengetahui,</p>
                    <p className="font-bold">Kepala SMP Negeri 7 Sentani</p>
                    <div className="h-16"></div>
                    <p className="font-bold underline">{schoolProfile.namaKepalaSekolah}</p>
                    <p>NIP. {schoolProfile.nipKepalaSekolah}</p>
                  </div>
                  <div>
                    <p>Sentani, {formatIndonesianDate(activeManajerialDoc.tanggalSupervisi)}</p>
                    <p className="font-bold">Pengawas Pembina / Penilai</p>
                    <div className="h-16"></div>
                    <p className="font-bold underline">{activeManajerialDoc.penilaiNama}</p>
                    <p>NIP. {activeManajerialDoc.penilaiNip}</p>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* DOKUMEN 2: SUPERVISI PBM (KELAS) */}
          {printModalData.type === 'PBM' && selectedPBMDoc && (() => {
            const pbmScore = calculatePBMScore(selectedPBMDoc.items);
            return (
              <div className="space-y-5 text-xs text-slate-900">
                <div className="text-center">
                  <h3 className="text-base font-black underline uppercase">
                    LEMBAR HASIL SUPERVISI PROSES BELAJAR MENGAJAR (PBM)
                  </h3>
                  <p className="text-[11px] font-semibold text-slate-700 mt-0.5">
                    Instrumen Observasi Pembelajaran & Administrasi Guru di Kelas
                  </p>
                  <p className="text-[11px] text-slate-600">
                    SMP Negeri 7 Sentani &bull; Tahun Ajaran {schoolProfile.tahunAjaran} ({schoolProfile.semester})
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 border border-slate-300 p-3 rounded-lg bg-slate-50 text-[11px]">
                  <div>
                    <p><strong>Nama Guru:</strong> {selectedPBMDoc.teacherNama}</p>
                    <p><strong>NIP:</strong> {selectedPBMDoc.teacherNip}</p>
                    <p><strong>Mata Pelajaran:</strong> {selectedPBMDoc.mataPelajaran}</p>
                    <p><strong>Kelas / Jam:</strong> {selectedPBMDoc.kelas} / {selectedPBMDoc.jamKe}</p>
                  </div>
                  <div>
                    <p><strong>Materi Pokok:</strong> {selectedPBMDoc.materiPokok}</p>
                    <p><strong>Tanggal Supervisi:</strong> {formatIndonesianDate(selectedPBMDoc.tanggalSupervisi)}</p>
                    <p><strong>Nama Penilai:</strong> {selectedPBMDoc.penilaiNama}</p>
                    <p><strong>Jabatan Penilai:</strong> {selectedPBMDoc.penilaiRole.replace('_', ' ')}</p>
                  </div>
                </div>

                {/* Table Hasil PBM */}
                <table className="w-full text-left border-collapse border border-slate-400 text-[11px]">
                  <thead>
                    <tr className="bg-slate-200 font-bold border-b border-slate-400">
                      <th className="p-2 border border-slate-400 text-center w-8">No</th>
                      <th className="p-2 border border-slate-400">Aspek & Indikator Pembelajaran</th>
                      <th className="p-2 border border-slate-400 text-center w-12">Skor</th>
                      <th className="p-2 border border-slate-400">Catatan Pengamatan di Kelas</th>
                      <th className="p-2 border border-slate-400">Saran Perbaikan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPBMDoc.items.map((it, idx) => (
                      <tr key={it.id}>
                        <td className="p-2 border border-slate-300 text-center">{idx + 1}</td>
                        <td className="p-2 border border-slate-300">
                          <strong className="block">{it.indikator}</strong>
                          <span className="text-[10px] text-slate-600">{it.deskripsi}</span>
                        </td>
                        <td className="p-2 border border-slate-300 text-center font-bold">{it.skor}</td>
                        <td className="p-2 border border-slate-300 text-[10px]">{it.catatan || '-'}</td>
                        <td className="p-2 border border-slate-300 text-[10px]">{it.saranPerbaikan || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-100 font-bold">
                      <td colSpan={2} className="p-2 border border-slate-400 text-right">
                        Nilai Akhir Supervisi PBM:
                      </td>
                      <td className="p-2 border border-slate-400 text-center font-black text-sm">
                        {pbmScore.nilaiAkhir}
                      </td>
                      <td colSpan={2} className="p-2 border border-slate-400">
                        Predikat: <strong>{pbmScore.predikat.predikat}</strong> &bull; {pbmScore.predikat.keterangan}
                      </td>
                    </tr>
                  </tfoot>
                </table>

                {/* Coaching & Rencana Tindak Lanjut */}
                <div className="grid grid-cols-2 gap-3 border border-slate-300 p-3 rounded-lg text-[11px]">
                  <div>
                    <strong>Kekuatan Guru (Praktik Baik):</strong>
                    <p className="text-slate-800 mt-0.5">{selectedPBMDoc.kekuatanGuru}</p>
                    <strong className="block mt-2">Rekomendasi Penilai:</strong>
                    <p className="text-slate-800 mt-0.5">{selectedPBMDoc.rekomendasiPembinaan}</p>
                  </div>
                  <div>
                    <strong>Aspek yang Perlu Ditingkatkan:</strong>
                    <p className="text-slate-800 mt-0.5">{selectedPBMDoc.kelemahanGuru}</p>
                    <strong className="block mt-2">Kesepakatan Tindak Lanjut Guru:</strong>
                    <p className="text-slate-800 mt-0.5">{selectedPBMDoc.kesepakatanTindakLanjut}</p>
                  </div>
                </div>

                {/* Tanda Tangan 3 Pihak */}
                <div className="pt-8 grid grid-cols-3 text-center text-xs">
                  <div>
                    <p>Guru yang Disupervisi,</p>
                    <div className="h-16"></div>
                    <p className="font-bold underline">{selectedPBMDoc.teacherNama}</p>
                    <p>NIP. {selectedPBMDoc.teacherNip}</p>
                  </div>
                  <div>
                    <p>Penilai Supervisi,</p>
                    <div className="h-16"></div>
                    <p className="font-bold underline">{selectedPBMDoc.penilaiNama}</p>
                    <p>NIP. {selectedPBMDoc.penilaiNip}</p>
                  </div>
                  <div>
                    <p>Mengetahui,</p>
                    <p className="font-bold">Kepala Sekolah</p>
                    <div className="h-14"></div>
                    <p className="font-bold underline">{schoolProfile.namaKepalaSekolah}</p>
                    <p>NIP. {schoolProfile.nipKepalaSekolah}</p>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* DOKUMEN 3: REKAPITULASI TOTAL SELURUH GURU */}
          {printModalData.type === 'REKAP_TOTAL' && (
            <div className="space-y-5 text-xs text-slate-900">
              <div className="text-center">
                <h3 className="text-base font-black underline uppercase">
                  REKAPITULASI NILAI SUPERVISI PROSES BELAJAR MENGAJAR (PBM)
                </h3>
                <p className="text-[11px] font-semibold text-slate-700 mt-0.5">
                  SMP Negeri 7 Sentani &bull; Tahun Ajaran {schoolProfile.tahunAjaran} ({schoolProfile.semester})
                </p>
              </div>

              <table className="w-full text-left border-collapse border border-slate-400 text-[11px]">
                <thead>
                  <tr className="bg-slate-200 font-bold border-b border-slate-400">
                    <th className="p-2 border border-slate-400 text-center w-8">No</th>
                    <th className="p-2 border border-slate-400">Nama Guru & NIP</th>
                    <th className="p-2 border border-slate-400">Mata Pelajaran & Kelas</th>
                    <th className="p-2 border border-slate-400">Penilai</th>
                    <th className="p-2 border border-slate-400 text-center">Nilai</th>
                    <th className="p-2 border border-slate-400 text-center">Predikat</th>
                    <th className="p-2 border border-slate-400">Rekomendasi Utama</th>
                  </tr>
                </thead>
                <tbody>
                  {pbmDocs.map((doc, idx) => {
                    const sc = calculatePBMScore(doc.items);
                    return (
                      <tr key={doc.id}>
                        <td className="p-2 border border-slate-300 text-center">{idx + 1}</td>
                        <td className="p-2 border border-slate-300 font-bold">{doc.teacherNama}</td>
                        <td className="p-2 border border-slate-300">{doc.mataPelajaran} ({doc.kelas})</td>
                        <td className="p-2 border border-slate-300">{doc.penilaiNama}</td>
                        <td className="p-2 border border-slate-300 text-center font-black">{sc.nilaiAkhir}</td>
                        <td className="p-2 border border-slate-300 text-center font-bold">{sc.predikat.predikat.split(' ')[0]}</td>
                        <td className="p-2 border border-slate-300 text-[10px]">{doc.rekomendasiPembinaan.slice(0, 70)}...</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Tanda Tangan Resmi */}
              <div className="pt-8 grid grid-cols-2 text-center text-xs">
                <div>
                  <p>Mengetahui,</p>
                  <p className="font-bold">Pengawas Pembina</p>
                  <div className="h-16"></div>
                  <p className="font-bold underline">{schoolProfile.namaPengawas}</p>
                  <p>NIP. {schoolProfile.nipPengawas}</p>
                </div>
                <div>
                  <p>Sentani, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  <p className="font-bold">Kepala SMP Negeri 7 Sentani</p>
                  <div className="h-16"></div>
                  <p className="font-bold underline">{schoolProfile.namaKepalaSekolah}</p>
                  <p>NIP. {schoolProfile.nipKepalaSekolah}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
