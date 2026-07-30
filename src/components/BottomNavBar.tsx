import React from 'react';
import { ViewTab } from '../types';

interface BottomNavBarProps {
  activeTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 px-4 sm:px-8 pb-safe bg-[#201f21]/95 backdrop-blur-xl border-t border-[#494454]/40 shadow-2xl rounded-t-2xl">
      {/* Dashboard Tab */}
      <button
        onClick={() => onTabChange('dashboard')}
        className={`flex flex-col items-center justify-center transition-all duration-150 floating-nav-button cursor-pointer ${
          activeTab === 'dashboard'
            ? 'bg-[#00a572] text-[#00311f] font-bold rounded-xl px-4 sm:px-6 py-1.5 shadow-md scale-105 border border-[#6ffbbe]/30'
            : 'text-[#cbc3d7] hover:text-[#4edea3] px-3 py-1.5'
        }`}
      >
        <span className="material-symbols-outlined text-xl mb-0.5" data-icon="dashboard">
          dashboard
        </span>
        <span className="font-mono-custom text-[11px] uppercase tracking-wide">
          Dashboard
        </span>
      </button>

      {/* Ticket / QR Scanner Tab */}
      <button
        onClick={() => onTabChange('scanner')}
        className={`flex flex-col items-center justify-center transition-all duration-150 floating-nav-button cursor-pointer ${
          activeTab === 'scanner'
            ? 'bg-[#a078ff] text-[#340080] font-bold rounded-xl px-4 sm:px-6 py-1.5 shadow-md scale-105 border border-[#d0bcff]/40'
            : 'text-[#cbc3d7] hover:text-[#a078ff] px-3 py-1.5'
        }`}
      >
        <span className="material-symbols-outlined text-xl mb-0.5" data-icon="qr_code_scanner">
          qr_code_scanner
        </span>
        <span className="font-mono-custom text-[11px] uppercase tracking-wide">
          Escanear Ticket
        </span>
      </button>

      {/* History Tab */}
      <button
        onClick={() => onTabChange('history')}
        className={`flex flex-col items-center justify-center transition-all duration-150 floating-nav-button cursor-pointer ${
          activeTab === 'history'
            ? 'bg-[#00a572] text-[#00311f] font-bold rounded-xl px-4 sm:px-6 py-1.5 shadow-md scale-105 border border-[#6ffbbe]/30'
            : 'text-[#cbc3d7] hover:text-[#4edea3] px-3 py-1.5'
        }`}
      >
        <span className="material-symbols-outlined text-xl mb-0.5" data-icon="history">
          history
        </span>
        <span className="font-mono-custom text-[11px] uppercase tracking-wide">
          Historial
        </span>
      </button>
    </nav>
  );
};

