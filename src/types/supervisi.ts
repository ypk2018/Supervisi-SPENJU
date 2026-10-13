export type EvaluatorRole = 'PENGAWAS' | 'KEPALA_SEKOLAH' | 'GURU_SENIOR';

export interface EvaluatorInfo {
  role: EvaluatorRole;
  nama: string;
  nip: string;
  jabatan: string;
}

export interface SchoolProfile {
  namaSekolah: string;
  npsn: string;
  nss: string;
  statusSekolah: string;
  akreditasi: string;
  alamat: string;
  distrik: string;
  kabupaten: string;
  provinsi: string;
  email: string;
  telepon: string;
  tahunAjaran: string;
  semester: 'Ganjil' | 'Genap';
  namaKepalaSekolah: string;
  nipKepalaSekolah: string;
  pangkatKepalaSekolah: string;
  namaPengawas: string;
  nipPengawas: string;
  pangkatPengawas: string;
  namaGuruSenior: string;
  nipGuruSenior: string;
  pangkatGuruSenior: string;
}

export interface Teacher {
  id: string;
  nama: string;
  nip: string;
  pangkatGolongan: string;
  mataPelajaran: string;
  kelasDiampu: string;
  pendidikanTerakhir: string;
  sertifikasi: boolean;
  statusKepegawaian: 'PNS' | 'PPPK' | 'Guru Honor Sekolah';
}

// Submenu Manajerial
export type ManajerialCategory =
  | 'KOSP_KURIKULUM'
  | 'SNP_8'
  | 'KINERJA_KS_TU'
  | 'SARPRAS_LINGKUNGAN'
  | 'RKT_RKJM_RAPOR';

export interface ManajerialItem {
  id: string;
  kategori: ManajerialCategory;
  kodeIndikator: string;
  aspek: string;
  indikator: string;
  buktiFisik: string;
  bobot: number; // 1-5
  skor: number; // 1 - 4 (1: Kurang, 2: Cukup, 3: Baik, 4: Amat Baik)
  catatanTemuan: string;
  rekomendasi: string;
  kaitanDenganPBM?: string; // Cross-link relation explanation to Classroom PBM
}

export interface SupervisiManajerialDoc {
  id: string;
  nomorSurat: string;
  tanggalSupervisi: string;
  tahunAjaran: string;
  semester: 'Ganjil' | 'Genap';
  penilaiRole: EvaluatorRole;
  penilaiNama: string;
  penilaiNip: string;
  items: ManajerialItem[];
  catatanUmum: string;
  rekomendasiUmum: string;
  tindakLanjut: string;
  status: 'Draft' | 'Final' | 'Ditinjau';
}

// Submenu Supervisi PBM (Kelas / Akademik)
export type PBMAspectKey =
  | 'PERENCANAAN'
  | 'PELAKSANAAN_KELAS'
  | 'PENILAIAN_ASESMEN'
  | 'ADMINISTRASI_GURU'
  | 'TINDAK_LANJUT';

export interface PBMItem {
  id: string;
  aspek: PBMAspectKey;
  nomor: number;
  indikator: string;
  deskripsi: string;
  skor: number; // 1 - 4
  catatan: string;
  saranPerbaikan: string;
}

export interface SupervisiPBMDoc {
  id: string;
  teacherId: string;
  teacherNama: string;
  teacherNip: string;
  mataPelajaran: string;
  kelas: string;
  jamKe: string;
  materiPokok: string;
  tanggalSupervisi: string;
  penilaiRole: EvaluatorRole;
  penilaiNama: string;
  penilaiNip: string;
  items: PBMItem[];
  kekuatanGuru: string;
  kelemahanGuru: string;
  rekomendasiPembinaan: string;
  kesepakatanTindakLanjut: string;
  jadwalSupervisiBerikutnya?: string;
  status: 'Terjadwal' | 'Sedang Berlangsung' | 'Selesai';
  kaitanManajerialStandar?: string; // Cross-link to Standar Proses / PTK di Manajerial
}

export interface PredikatInfo {
  predikat: 'Amat Baik (A)' | 'Baik (B)' | 'Cukup (C)' | 'Kurang (D)';
  warna: string;
  bgWarna: string;
  keterangan: string;
}
