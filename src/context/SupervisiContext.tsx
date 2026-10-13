import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SchoolProfile,
  Teacher,
  SupervisiManajerialDoc,
  SupervisiPBMDoc,
  EvaluatorRole,
  ManajerialCategory,
  PBMAspectKey,
  ManajerialItem,
  PBMItem,
} from '../types/supervisi';
import {
  initialSchoolProfile,
  initialTeachers,
  initialManajerialDocs,
  initialPBMDocs,
  defaultManajerialIndicators,
  defaultPBMItems,
} from '../data/defaultData';

export type MainNavTab = 'DASHBOARD' | 'MANAJERIAL' | 'PBM' | 'PENGATURAN';

export type ManajerialSubmenu =
  | 'SEMUA'
  | 'KOSP_KURIKULUM'
  | 'SNP_8'
  | 'KINERJA_KS_TU'
  | 'SARPRAS_LINGKUNGAN'
  | 'RKT_RKJM_RAPOR'
  | 'REKAP_CETAK';

export type PBMSubmenu =
  | 'JADWAL_GURU'
  | 'PERENCANAAN'
  | 'PELAKSANAAN_KELAS'
  | 'PENILAIAN_ASESMEN'
  | 'ADMINISTRASI_GURU'
  | 'TINDAK_LANJUT'
  | 'REKAP_CETAK';

interface SupervisiContextType {
  schoolProfile: SchoolProfile;
  updateSchoolProfile: (profile: Partial<SchoolProfile>) => void;
  teachers: Teacher[];
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  updateTeacher: (id: string, teacher: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;

  manajerialDocs: SupervisiManajerialDoc[];
  activeManajerialDoc: SupervisiManajerialDoc | null;
  updateManajerialItem: (itemId: string, updates: Partial<ManajerialItem>) => void;
  updateManajerialDocInfo: (updates: Partial<SupervisiManajerialDoc>) => void;
  saveNewManajerialDoc: (doc: SupervisiManajerialDoc) => void;

  pbmDocs: SupervisiPBMDoc[];
  selectedPBMDoc: SupervisiPBMDoc | null;
  setSelectedPBMDocId: (id: string | null) => void;
  updatePBMItem: (pbmDocId: string, itemId: string, updates: Partial<PBMItem>) => void;
  updatePBMDocInfo: (pbmDocId: string, updates: Partial<SupervisiPBMDoc>) => void;
  createNewPBMDoc: (teacherId: string) => SupervisiPBMDoc;
  deletePBMDoc: (id: string) => void;

  activeRole: EvaluatorRole;
  setActiveRole: (role: EvaluatorRole) => void;
  getActiveEvaluatorName: () => string;
  getActiveEvaluatorNip: () => string;

  activeTab: MainNavTab;
  setActiveTab: (tab: MainNavTab) => void;
  manajerialSubmenu: ManajerialSubmenu;
  setManajerialSubmenu: (sub: ManajerialSubmenu) => void;
  pbmSubmenu: PBMSubmenu;
  setPBMSubmenu: (sub: PBMSubmenu) => void;

  // Interlinking helpers
  navigateToPBM: (pbmDocId?: string, submenu?: PBMSubmenu) => void;
  navigateToManajerial: (submenu?: ManajerialSubmenu) => void;

  // Print Modal
  printModalData: {
    isOpen: boolean;
    type: 'MANAJERIAL' | 'PBM' | 'REKAP_TOTAL';
    dataId?: string;
  };
  openPrintModal: (type: 'MANAJERIAL' | 'PBM' | 'REKAP_TOTAL', dataId?: string) => void;
  closePrintModal: () => void;

  // Data management
  resetToDefaultData: () => void;
  exportDataJson: () => void;
  importDataJson: (jsonString: string) => boolean;
}

const STORAGE_KEY = 'SMPN7_SENTANI_SUPERVISI_DATA_V2';

const SupervisiContext = createContext<SupervisiContextType | undefined>(undefined);

export const SupervisiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_PROFILE`);
      return saved ? JSON.parse(saved) : initialSchoolProfile;
    } catch {
      return initialSchoolProfile;
    }
  });

  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_TEACHERS`);
      return saved ? JSON.parse(saved) : initialTeachers;
    } catch {
      return initialTeachers;
    }
  });

  const [manajerialDocs, setManajerialDocs] = useState<SupervisiManajerialDoc[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_MANAJERIAL`);
      return saved ? JSON.parse(saved) : initialManajerialDocs;
    } catch {
      return initialManajerialDocs;
    }
  });

  const [pbmDocs, setPBMDocs] = useState<SupervisiPBMDoc[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_PBM`);
      return saved ? JSON.parse(saved) : initialPBMDocs;
    } catch {
      return initialPBMDocs;
    }
  });

  const [activeRole, setActiveRole] = useState<EvaluatorRole>('PENGAWAS');
  const [activeTab, setActiveTab] = useState<MainNavTab>('DASHBOARD');
  const [manajerialSubmenu, setManajerialSubmenu] = useState<ManajerialSubmenu>('SEMUA');
  const [pbmSubmenu, setPBMSubmenu] = useState<PBMSubmenu>('JADWAL_GURU');
  const [selectedPBMDocId, setSelectedPBMDocId] = useState<string | null>(
    initialPBMDocs[0]?.id || null
  );

  const [printModalData, setPrintModalData] = useState<{
    isOpen: boolean;
    type: 'MANAJERIAL' | 'PBM' | 'REKAP_TOTAL';
    dataId?: string;
  }>({
    isOpen: false,
    type: 'MANAJERIAL',
  });

  // Save to LocalStorage on updates
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_PROFILE`, JSON.stringify(schoolProfile));
  }, [schoolProfile]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_TEACHERS`, JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_MANAJERIAL`, JSON.stringify(manajerialDocs));
  }, [manajerialDocs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_PBM`, JSON.stringify(pbmDocs));
  }, [pbmDocs]);

  const activeManajerialDoc = manajerialDocs[0] || null;
  const selectedPBMDoc =
    pbmDocs.find((doc) => doc.id === selectedPBMDocId) || pbmDocs[0] || null;

  const getActiveEvaluatorName = () => {
    if (activeRole === 'PENGAWAS') return schoolProfile.namaPengawas;
    if (activeRole === 'KEPALA_SEKOLAH') return schoolProfile.namaKepalaSekolah;
    return schoolProfile.namaGuruSenior;
  };

  const getActiveEvaluatorNip = () => {
    if (activeRole === 'PENGAWAS') return schoolProfile.nipPengawas;
    if (activeRole === 'KEPALA_SEKOLAH') return schoolProfile.nipKepalaSekolah;
    return schoolProfile.nipGuruSenior;
  };

  const updateSchoolProfile = (profile: Partial<SchoolProfile>) => {
    setSchoolProfile((prev) => ({ ...prev, ...profile }));
  };

  const addTeacher = (newT: Omit<Teacher, 'id'>) => {
    const id = `T-${Date.now().toString().slice(-4)}`;
    setTeachers((prev) => [...prev, { ...newT, id }]);
  };

  const updateTeacher = (id: string, updates: Partial<Teacher>) => {
    setTeachers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const deleteTeacher = (id: string) => {
    setTeachers((prev) => prev.filter((t) => t.id !== id));
  };

  // Manajerial
  const updateManajerialItem = (
    itemId: string,
    updates: Partial<ManajerialItem>
  ) => {
    setManajerialDocs((prev) =>
      prev.map((doc, idx) => {
        if (idx === 0) {
          return {
            ...doc,
            items: doc.items.map((it) =>
              it.id === itemId ? { ...it, ...updates } : it
            ),
          };
        }
        return doc;
      })
    );
  };

  const updateManajerialDocInfo = (updates: Partial<SupervisiManajerialDoc>) => {
    setManajerialDocs((prev) =>
      prev.map((doc, idx) => (idx === 0 ? { ...doc, ...updates } : doc))
    );
  };

  const saveNewManajerialDoc = (newDoc: SupervisiManajerialDoc) => {
    setManajerialDocs((prev) => [newDoc, ...prev]);
  };

  // PBM
  const updatePBMItem = (
    pbmDocId: string,
    itemId: string,
    updates: Partial<PBMItem>
  ) => {
    setPBMDocs((prev) =>
      prev.map((doc) => {
        if (doc.id === pbmDocId) {
          return {
            ...doc,
            items: doc.items.map((it) =>
              it.id === itemId ? { ...it, ...updates } : it
            ),
          };
        }
        return doc;
      })
    );
  };

  const updatePBMDocInfo = (
    pbmDocId: string,
    updates: Partial<SupervisiPBMDoc>
  ) => {
    setPBMDocs((prev) =>
      prev.map((doc) => (doc.id === pbmDocId ? { ...doc, ...updates } : doc))
    );
  };

  const createNewPBMDoc = (teacherId: string): SupervisiPBMDoc => {
    const teacher = teachers.find((t) => t.id === teacherId);
    const id = `PBM-DOC-${Date.now().toString().slice(-4)}`;
    const newDoc: SupervisiPBMDoc = {
      id,
      teacherId: teacher?.id || 'T-NEW',
      teacherNama: teacher?.nama || 'Guru Baru',
      teacherNip: teacher?.nip || '-',
      mataPelajaran: teacher?.mataPelajaran || 'Mata Pelajaran',
      kelas: teacher?.kelasDiampu.split(',')[0] || 'Kelas VII A',
      jamKe: 'Jam ke 1 - 2 (07.30 - 08.50 WIT)',
      materiPokok: 'Materi Pembelajaran Pokok',
      tanggalSupervisi: new Date().toISOString().split('T')[0],
      penilaiRole: activeRole,
      penilaiNama: getActiveEvaluatorName(),
      penilaiNip: getActiveEvaluatorNip(),
      items: defaultPBMItems.map((it, idx) => ({
        ...it,
        id: `PBM-${id}-${idx + 1}`,
        skor: 3,
      })),
      kekuatanGuru: 'Kemampuan mengondisikan kelas dan penguasaan bahan ajar.',
      kelemahanGuru: 'Perlu optimalisasi lembar kerja berdiferensiasi dan asesmen formatif.',
      rekomendasiPembinaan: 'Disarankan berdiskusi dalam Komunitas Belajar Sekolah (Kombel).',
      kesepakatanTindakLanjut: 'Refleksi berkala dan perbaikan modul ajar pertemuan selanjutnya.',
      status: 'Terjadwal',
      kaitanManajerialStandar: 'Menjadi bukti pemenuhan Standar Pendidik dan Standar Proses pada instrumen Manajerial.',
    };

    setPBMDocs((prev) => [newDoc, ...prev]);
    setSelectedPBMDocId(id);
    return newDoc;
  };

  const deletePBMDoc = (id: string) => {
    setPBMDocs((prev) => prev.filter((d) => d.id !== id));
    if (selectedPBMDocId === id) {
      setSelectedPBMDocId(pbmDocs.find((d) => d.id !== id)?.id || null);
    }
  };

  // Cross Linking
  const navigateToPBM = (pbmDocId?: string, submenu?: PBMSubmenu) => {
    if (pbmDocId) setSelectedPBMDocId(pbmDocId);
    if (submenu) setPBMSubmenu(submenu);
    setActiveTab('PBM');
  };

  const navigateToManajerial = (submenu?: ManajerialSubmenu) => {
    if (submenu) setManajerialSubmenu(submenu);
    setActiveTab('MANAJERIAL');
  };

  const openPrintModal = (type: 'MANAJERIAL' | 'PBM' | 'REKAP_TOTAL', dataId?: string) => {
    setPrintModalData({ isOpen: true, type, dataId });
  };

  const closePrintModal = () => {
    setPrintModalData((prev) => ({ ...prev, isOpen: false }));
  };

  const resetToDefaultData = () => {
    if (confirm('Kembalikan semua data ke pengaturan dan isian awal SMP Negeri 7 Sentani?')) {
      setSchoolProfile(initialSchoolProfile);
      setTeachers(initialTeachers);
      setManajerialDocs(initialManajerialDocs);
      setPBMDocs(initialPBMDocs);
      setSelectedPBMDocId(initialPBMDocs[0].id);
      localStorage.clear();
    }
  };

  const exportDataJson = () => {
    const backup = {
      exportedAt: new Date().toISOString(),
      schoolProfile,
      teachers,
      manajerialDocs,
      pbmDocs,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Supervisi_SMPN7_Sentani_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importDataJson = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.schoolProfile && parsed.teachers) {
        setSchoolProfile(parsed.schoolProfile);
        setTeachers(parsed.teachers);
        if (parsed.manajerialDocs) setManajerialDocs(parsed.manajerialDocs);
        if (parsed.pbmDocs) {
          setPBMDocs(parsed.pbmDocs);
          if (parsed.pbmDocs.length > 0) setSelectedPBMDocId(parsed.pbmDocs[0].id);
        }
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return (
    <SupervisiContext.Provider
      value={{
        schoolProfile,
        updateSchoolProfile,
        teachers,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        manajerialDocs,
        activeManajerialDoc,
        updateManajerialItem,
        updateManajerialDocInfo,
        saveNewManajerialDoc,
        pbmDocs,
        selectedPBMDoc,
        setSelectedPBMDocId,
        updatePBMItem,
        updatePBMDocInfo,
        createNewPBMDoc,
        deletePBMDoc,
        activeRole,
        setActiveRole,
        getActiveEvaluatorName,
        getActiveEvaluatorNip,
        activeTab,
        setActiveTab,
        manajerialSubmenu,
        setManajerialSubmenu,
        pbmSubmenu,
        setPBMSubmenu,
        navigateToPBM,
        navigateToManajerial,
        printModalData,
        openPrintModal,
        closePrintModal,
        resetToDefaultData,
        exportDataJson,
        importDataJson,
      }}
    >
      {children}
    </SupervisiContext.Provider>
  );
};

export const useSupervisi = () => {
  const context = useContext(SupervisiContext);
  if (!context) {
    throw new Error('useSupervisi must be used within a SupervisiProvider');
  }
  return context;
};
