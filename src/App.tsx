import React from 'react';
import { SupervisiProvider, useSupervisi } from './context/SupervisiContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { SupervisiManajerialView } from './components/manajerial/SupervisiManajerialView';
import { SupervisiPBMView } from './components/pbm/SupervisiPBMView';
import { SettingsView } from './components/settings/SettingsView';
import { PrintModal } from './components/print/PrintModal';
import {
  LayoutDashboard,
  Building2,
  GraduationCap,
  Settings,
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab } = useSupervisi();

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col font-sans">
      <Header />

      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'DASHBOARD' && <Dashboard />}
          {activeTab === 'MANAJERIAL' && <SupervisiManajerialView />}
          {activeTab === 'PBM' && <SupervisiPBMView />}
          {activeTab === 'PENGATURAN' && <SettingsView />}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 px-3 py-2 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setActiveTab('DASHBOARD')}
          className={`flex flex-col items-center space-y-1 text-[11px] font-bold cursor-pointer ${
            activeTab === 'DASHBOARD' ? 'text-indigo-600' : 'text-slate-500'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('MANAJERIAL')}
          className={`flex flex-col items-center space-y-1 text-[11px] font-bold cursor-pointer ${
            activeTab === 'MANAJERIAL' ? 'text-blue-600' : 'text-slate-500'
          }`}
        >
          <Building2 className="w-5 h-5" />
          <span>Manajerial</span>
        </button>

        <button
          onClick={() => setActiveTab('PBM')}
          className={`flex flex-col items-center space-y-1 text-[11px] font-bold cursor-pointer ${
            activeTab === 'PBM' ? 'text-emerald-600' : 'text-slate-500'
          }`}
        >
          <GraduationCap className="w-5 h-5" />
          <span>PBM Kelas</span>
        </button>

        <button
          onClick={() => setActiveTab('PENGATURAN')}
          className={`flex flex-col items-center space-y-1 text-[11px] font-bold cursor-pointer ${
            activeTab === 'PENGATURAN' ? 'text-slate-900' : 'text-slate-500'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span>Pengaturan</span>
        </button>
      </div>

      <PrintModal />
    </div>
  );
};

export default function App() {
  return (
    <SupervisiProvider>
      <MainContent />
    </SupervisiProvider>
  );
}
