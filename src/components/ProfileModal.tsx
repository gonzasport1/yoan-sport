import React, { useRef } from 'react';
import { Bet, UserProfile } from '../types';
import { calculateBetStats, formatUnit } from '../utils/calcStats';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  bets: Bet[];
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onResetBets: () => void;
  onLogout: () => void;
  userEmail: string;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  bets,
  profile,
  onUpdateProfile,
  onResetBets,
  onLogout,
  userEmail,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const stats = calculateBetStats(bets);

  const defaultAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
  ];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateProfile({ avatarUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(bets, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `BetTracker_Export_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#201f21] border border-[#494454] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#494454] flex justify-between items-center bg-[#1b1b1d]">
          <h3 className="font-sans font-extrabold text-lg text-[#e5e1e4]">
            Perfil de Apostador
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#353437] text-[#cbc3d7] transition-all"
          >
            <span className="material-symbols-outlined" data-icon="close">
              close
            </span>
          </button>
        </div>

        <div className="p-5 space-y-5 overflow-y-auto">
          {/* User Profile Photo Section */}
          <div className="flex flex-col items-center justify-center text-center p-4 bg-[#1b1b1d] rounded-2xl border border-[#494454]/40">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"
              className="hidden"
            />

            <div className="relative group cursor-pointer mb-3" onClick={() => fileInputRef.current?.click()}>
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-[#a078ff] shadow-lg group-hover:brightness-90 transition-all"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-[#a078ff]/20 text-[#d0bcff] flex items-center justify-center border-2 border-[#a078ff]/40 shadow-lg group-hover:bg-[#a078ff]/30 transition-all">
                  <span className="material-symbols-outlined text-4xl" data-icon="person">
                    person
                  </span>
                </div>
              )}
              <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-white text-xl" data-icon="photo_camera">
                  photo_camera
                </span>
              </div>
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1 bg-[#a078ff]/20 text-[#d0bcff] hover:bg-[#a078ff]/30 rounded-full font-mono-custom text-xs font-bold border border-[#a078ff]/30 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm" data-icon="upload">
                upload
              </span>
              <span>Cambiar Foto de Perfil</span>
            </button>

            {/* Quick Avatar Choice Presets */}
            <div className="mt-3 flex items-center gap-2">
              <span className="font-mono-custom text-[10px] text-[#cbc3d7]">Avatares:</span>
              {defaultAvatars.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`Avatar ${i}`}
                  onClick={() => onUpdateProfile({ avatarUrl: url })}
                  className="w-7 h-7 rounded-full object-cover border border-[#494454] hover:border-[#4edea3] cursor-pointer active:scale-90 transition-all"
                  referrerPolicy="no-referrer"
                />
              ))}
            </div>
          </div>

          {/* User Name Input */}
          <div>
            <label className="font-mono-custom text-xs text-[#cbc3d7] uppercase block mb-1">
              Nombre de Usuario
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => onUpdateProfile({ name: e.target.value })}
              className="w-full bg-[#1b1b1d] border border-[#494454] rounded-xl p-3 text-[#e5e1e4] font-sans text-sm focus:border-[#a078ff] outline-none"
            />
          </div>

          {/* Account Quick Stats Grid */}
          <div className="space-y-3">
            <span className="font-mono-custom text-xs text-[#cbc3d7] uppercase tracking-wider block font-semibold">
              Rendimiento Acumulado
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-[#1b1b1d] rounded-xl border border-[#494454]/40">
                <span className="font-mono-custom text-[10px] text-[#cbc3d7] uppercase block">
                  Beneficio Total
                </span>
                <span
                  className={`font-mono-custom text-lg font-bold ${
                    stats.totalProfit >= 0 ? 'text-[#4edea3]' : 'text-[#ffb4ab]'
                  }`}
                >
                  {formatUnit(stats.totalProfit)}
                </span>
              </div>

              <div className="p-3 bg-[#1b1b1d] rounded-xl border border-[#494454]/40">
                <span className="font-mono-custom text-[10px] text-[#cbc3d7] uppercase block">
                  Tasa de Victoria
                </span>
                <span className="font-mono-custom text-lg font-bold text-[#e5e1e4]">
                  {stats.winRate.toFixed(1)}%
                </span>
              </div>

              <div className="p-3 bg-[#1b1b1d] rounded-xl border border-[#494454]/40">
                <span className="font-mono-custom text-[10px] text-[#cbc3d7] uppercase block">
                  Apuestas Totales
                </span>
                <span className="font-mono-custom text-lg font-bold text-[#e5e1e4]">
                  {stats.totalBets}
                </span>
              </div>

              <div className="p-3 bg-[#1b1b1d] rounded-xl border border-[#494454]/40">
                <span className="font-mono-custom text-[10px] text-[#cbc3d7] uppercase block">
                  ROI Total
                </span>
                <span className="font-mono-custom text-lg font-bold text-[#4edea3]">
                  {stats.roi.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 space-y-2">
            <p className="text-center font-mono-custom text-[10px] text-[#cbc3d7]/70 mb-1">{userEmail}</p>

            <button
              onClick={handleExportJSON}
              className="w-full py-2.5 px-4 bg-[#353437] hover:bg-[#494454] text-[#e5e1e4] rounded-xl font-mono-custom text-xs font-semibold flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-base" data-icon="download">
                download
              </span>
              Exportar Registro de Apuestas (.JSON)
            </button>

            <button
              onClick={() => {
                if (confirm('¿Restablecer datos a las apuestas de ejemplo por defecto?')) {
                  onResetBets();
                  onClose();
                }
              }}
              className="w-full py-2.5 px-4 bg-[#93000a]/20 hover:bg-[#93000a]/40 text-[#ffb4ab] border border-[#ffb4ab]/20 rounded-xl font-mono-custom text-xs font-semibold flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-base" data-icon="restart_alt">
                restart_alt
              </span>
              Restablecer Apuestas Iniciales
            </button>

            <button
              onClick={onLogout}
              className="w-full py-2.5 px-4 bg-transparent hover:bg-[#353437] text-[#cbc3d7] border border-[#494454] rounded-xl font-mono-custom text-xs font-semibold flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-base" data-icon="logout">
                logout
              </span>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

