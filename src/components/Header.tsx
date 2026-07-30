import React from 'react';
import { UserProfile } from '../types';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenProfile: () => void;
  title?: string;
  profile?: UserProfile;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch, onOpenProfile, title = "BetTracker", profile }) => {
  return (
    <header className="fixed top-0 w-full z-50 flex items-center justify-between px-4 sm:px-6 h-16 bg-[#0e0e10]/90 backdrop-blur-md border-b border-[#494454]/40 shadow-sm">
      <div className="flex items-center gap-3 cursor-pointer select-none">
        <span className="material-symbols-outlined text-[#d0bcff] text-2xl" data-icon="analytics">
          analytics
        </span>
        <h1 className="font-bold text-xl tracking-tight text-[#d0bcff] font-sans">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onOpenSearch}
          className="p-2 rounded-full hover:bg-[#353437] text-[#cbc3d7] active:scale-95 transition-all duration-150 flex items-center justify-center focus:outline-none"
          title="Search Bets"
          aria-label="Search bets"
        >
          <span className="material-symbols-outlined text-xl" data-icon="search">
            search
          </span>
        </button>

        <button
          onClick={onOpenProfile}
          className="p-1 rounded-full hover:bg-[#353437] text-[#d0bcff] active:scale-95 transition-all duration-150 flex items-center justify-center focus:outline-none"
          title="Account Profile"
          aria-label="Account profile"
        >
          {profile?.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-8 h-8 rounded-full object-cover border-2 border-[#a078ff]"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="material-symbols-outlined text-2xl" data-icon="account_circle">
              account_circle
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

