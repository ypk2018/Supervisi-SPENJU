import {
  ManajerialItem,
  PBMItem,
  PredikatInfo,
  SupervisiManajerialDoc,
  SupervisiPBMDoc,
} from '../types/supervisi';

export function calculateManajerialScore(items: ManajerialItem[]): {
  totalSkor: number;
  skorMaks: number;
  nilaiAkhir: number;
  predikat: PredikatInfo;
} {
  if (!items || items.length === 0) {
    return {
      totalSkor: 0,
      skorMaks: 0,
      nilaiAkhir: 0,
      predikat: getPredikat(0),
    };
  }

  const totalBobot = items.reduce((sum, it) => sum + (it.bobot || 1), 0);
  const totalPerolehan = items.reduce(
    (sum, it) => sum + (it.skor || 0) * (it.bobot || 1),
    0
  );
  const skorMaks = totalBobot * 4;
  const nilaiAkhir = Number(((totalPerolehan / skorMaks) * 100).toFixed(1));

  return {
    totalSkor: totalPerolehan,
    skorMaks,
    nilaiAkhir,
    predikat: getPredikat(nilaiAkhir),
  };
}

export function calculatePBMScore(items: PBMItem[]): {
  totalSkor: number;
  skorMaks: number;
  nilaiAkhir: number;
  predikat: PredikatInfo;
  aspekScores: Record<string, { skor: number; max: number; persen: number }>;
} {
  if (!items || items.length === 0) {
    return {
      totalSkor: 0,
      skorMaks: 0,
      nilaiAkhir: 0,
      predikat: getPredikat(0),
      aspekScores: {},
    };
  }

  const totalSkor = items.reduce((sum, it) => sum + (it.skor || 0), 0);
  const skorMaks = items.length * 4;
  const nilaiAkhir = Number(((totalSkor / skorMaks) * 100).toFixed(1));

  const aspekScores: Record<string, { skor: number; max: number; persen: number }> = {};
  items.forEach((it) => {
    if (!aspekScores[it.aspek]) {
      aspekScores[it.aspek] = { skor: 0, max: 0, persen: 0 };
    }
    aspekScores[it.aspek].skor += it.skor || 0;
    aspekScores[it.aspek].max += 4;
  });

  Object.keys(aspekScores).forEach((k) => {
    const asp = aspekScores[k];
    asp.persen = Number(((asp.skor / asp.max) * 100).toFixed(1));
  });

  return {
    totalSkor,
    skorMaks,
    nilaiAkhir,
    predikat: getPredikat(nilaiAkhir),
    aspekScores,
  };
}

export function getPredikat(nilai: number): PredikatInfo {
  if (nilai >= 90) {
    return {
      predikat: 'Amat Baik (A)',
      warna: 'text-emerald-700 border-emerald-300 bg-emerald-50',
      bgWarna: 'bg-emerald-600',
      keterangan: 'Sangat Memuaskan, melampaui standar mutu sekolah dan menjadi role-model.',
    };
  }
  if (nilai >= 80) {
    return {
      predikat: 'Baik (B)',
      warna: 'text-blue-700 border-blue-300 bg-blue-50',
      bgWarna: 'bg-blue-600',
      keterangan: 'Memenuhi seluruh kriteria standar dengan kinerja konsisten.',
    };
  }
  if (nilai >= 70) {
    return {
      predikat: 'Cukup (C)',
      warna: 'text-amber-700 border-amber-300 bg-amber-50',
      bgWarna: 'bg-amber-600',
      keterangan: 'Memenuhi standar dasar, membutuhkan pendampingan coaching tindak lanjut.',
    };
  }
  return {
    predikat: 'Kurang (D)',
    warna: 'text-rose-700 border-rose-300 bg-rose-50',
    bgWarna: 'bg-rose-600',
    keterangan: 'Perlu bimbingan intensif dan supervisi klinis perbaikan bertahap.',
  };
}

export function formatIndonesianDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function generateSmartFeedback(
  type: 'MANAJERIAL' | 'PBM',
  doc: SupervisiManajerialDoc | SupervisiPBMDoc
): { kekuatan: string; rekomendasi: string } {
  if (type === 'MANAJERIAL') {
    const manDoc = doc as SupervisiManajerialDoc;
    const lowItems = manDoc.items.filter((i) => i.skor <= 2);
    const midItems = manDoc.items.filter((i) => i.skor === 3);
    const highItems = manDoc.items.filter((i) => i.skor === 4);

    const kekuatan = highItems.length > 0
      ? `Manajemen sekolah sangat solid pada indikator: ${highItems.map((i) => i.aspek).slice(0, 3).join(', ')}. Budaya kepemimpinan dan pelaporan berjalan tertib.`
      : 'Sekolah telah memiliki komitmen dasar dalam penataan administrasi dan tata kelola.';

    const rekomendasi = lowItems.length > 0
      ? `Prioritas tindak lanjut mendesak pada aspek: ${lowItems.map((i) => i.aspek).join(', ')}. Lakukan pendampingan bersama Komite Sekolah dan Pengawas Pembina.`
      : `Pertahankan pencapaian, serta tingkatkan konsistensi pada aspek ${midItems.map((i) => i.aspek).slice(0, 2).join(' dan ')} agar mencapai skor maksimal.`;

    return { kekuatan, rekomendasi };
  } else {
    const pbmDoc = doc as SupervisiPBMDoc;
    const lowItems = pbmDoc.items.filter((i) => i.skor <= 2);
    const highItems = pbmDoc.items.filter((i) => i.skor === 4);

    const kekuatan = highItems.length > 0
      ? `Pendidik menguasai secara unggul indikator: ${highItems.map((i) => i.indikator).slice(0, 2).join(' serta ')}. Suasana interaksi kelas hidup dan memotivasi murid.`
      : 'Pendidik telah melaksanakan tahapan dasar PBM sesuai alur pembelajaran.';

    const rekomendasi = lowItems.length > 0
      ? `Fokus perbaikan pada indikator: ${lowItems.map((i) => i.indikator).join('; ')}. Disarankan mengikuti coaching sebaya bersama Guru Senior di Komunitas Belajar.`
      : 'Pertahankan kualitas pembelajaran berpusat pada siswa, perkuat asesmen formatif berkala dan integrasi LKPD berdiferensiasi.';

    return { kekuatan, rekomendasi };
  }
}
