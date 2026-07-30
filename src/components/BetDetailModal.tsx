import React, { useState } from 'react';
import { Bet, BetStatus } from '../types';
import { formatUnit } from '../utils/calcStats';

interface BetDetailModalProps {
  bet: Bet | null;
  onClose: () => void;
  onUpdateBet: (updated: Bet) => void;
  onDeleteBet: (id: string) => void;
}

export const BetDetailModal: React.FC<BetDetailModalProps> = ({
  bet,
  onClose,
  onUpdateBet,
  onDeleteBet,
}) => {
  if (!bet) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [eventName, setEventName] = useState(bet.eventName);
  const [market, setMarket] = useState(bet.market);
  const [odds, setOdds] = useState(bet.odds.toString());
  const [stake, setStake] = useState(bet.stake.toString());
  const [status, setStatus] = useState<BetStatus>(bet.status);

  const isWon = status === 'won';
  const isLost = status === 'lost';
  const profitVal = isWon
    ? (parseFloat(odds) - 1) * parseFloat(stake)
    : isLost
    ? -parseFloat(stake)
    : (parseFloat(odds) - 1) * parseFloat(stake);

  const handleSave = () => {
    onUpdateBet({
      ...bet,
      eventName,
      market,
      odds: parseFloat(odds) || 1.91,
      stake: parseFloat(stake) || 1.0,
      status,
    });
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#201f21] border border-[#494454] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#494454] flex justify-between items-start bg-[#1b1b1d]">
          <div>
            <span className="font-mono-custom text-xs text-[#d0bcff] bg-[#d0bcff]/10 px-2 py-0.5 rounded font-bold">
              {bet.sport}
            </span>
            <p className="font-mono-custom text-xs text-[#cbc3d7] mt-1">
              {bet.date}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#353437] text-[#cbc3d7] transition-all"
          >
            <span className="material-symbols-outlined" data-icon="close">
              close
            </span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          {isEditing ? (
            <div className="space-y-3">
              <div>
                <label className="font-mono-custom text-[10px] text-[#cbc3d7] uppercase block mb-1">
                  Event Name
                </label>
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="w-full bg-[#1b1b1d] border border-[#494454] rounded-lg p-2.5 text-[#e5e1e4] font-sans text-sm"
                />
              </div>

              <div>
                <label className="font-mono-custom text-[10px] text-[#cbc3d7] uppercase block mb-1">
                  Market
                </label>
                <input
                  type="text"
                  value={market}
                  onChange={(e) => setMarket(e.target.value)}
                  className="w-full bg-[#1b1b1d] border border-[#494454] rounded-lg p-2.5 text-[#e5e1e4] font-sans text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-mono-custom text-[10px] text-[#cbc3d7] uppercase block mb-1">
                    Odds
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={odds}
                    onChange={(e) => setOdds(e.target.value)}
                    className="w-full bg-[#1b1b1d] border border-[#494454] rounded-lg p-2.5 text-[#4edea3] font-mono-custom text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="font-mono-custom text-[10px] text-[#cbc3d7] uppercase block mb-1">
                    Stake (Units)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={stake}
                    onChange={(e) => setStake(e.target.value)}
                    className="w-full bg-[#1b1b1d] border border-[#494454] rounded-lg p-2.5 text-[#4edea3] font-mono-custom text-sm font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-mono-custom text-[10px] text-[#cbc3d7] uppercase block mb-1">
                  Result Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['won', 'lost', 'pending'] as BetStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatus(st)}
                      className={`py-2 rounded-lg font-mono-custom text-xs font-bold uppercase transition-all ${
                        status === st
                          ? st === 'won'
                            ? 'bg-[#00a572] text-[#00311f]'
                            : st === 'lost'
                            ? 'bg-[#93000a] text-[#ffdad6]'
                            : 'bg-[#a078ff] text-[#340080]'
                          : 'bg-[#353437] text-[#cbc3d7]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="font-sans font-extrabold text-xl text-[#e5e1e4]">
                  {bet.eventName}
                </h3>
                <p className="font-sans text-sm text-[#cbc3d7] mt-1">
                  {bet.market}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 p-4 bg-[#1b1b1d] rounded-xl border border-[#494454]/40">
                <div>
                  <span className="font-mono-custom text-[10px] text-[#cbc3d7] uppercase block">
                    Stake
                  </span>
                  <span className="font-mono-custom text-base font-bold text-[#e5e1e4]">
                    {bet.stake.toFixed(2)}u
                  </span>
                </div>
                <div>
                  <span className="font-mono-custom text-[10px] text-[#cbc3d7] uppercase block">
                    Odds
                  </span>
                  <span className="font-mono-custom text-base font-bold text-[#e5e1e4]">
                    {bet.odds.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="font-mono-custom text-[10px] text-[#cbc3d7] uppercase block">
                    {isWon ? 'Profit' : isLost ? 'Loss' : 'Potential'}
                  </span>
                  <span
                    className={`font-mono-custom text-base font-extrabold ${
                      isWon
                        ? 'text-[#4edea3]'
                        : isLost
                        ? 'text-[#ffb4ab]'
                        : 'text-[#d0bcff]'
                    }`}
                  >
                    {isWon
                      ? formatUnit(profitVal)
                      : isLost
                      ? `-${bet.stake.toFixed(2)}u`
                      : `+${profitVal.toFixed(2)}u`}
                  </span>
                </div>
              </div>

              {/* Current Status Badge */}
              <div className="flex items-center justify-between p-3 bg-[#353437] rounded-xl">
                <span className="font-mono-custom text-xs text-[#cbc3d7]">
                  Status
                </span>
                <span
                  className={`px-3 py-1 rounded-full font-mono-custom text-xs font-bold uppercase ${
                    isWon
                      ? 'bg-[#00a572]/30 text-[#4edea3]'
                      : isLost
                      ? 'bg-[#93000a]/40 text-[#ffb4ab]'
                      : 'bg-[#a078ff]/30 text-[#d0bcff]'
                  }`}
                >
                  {status}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-3 flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex-1 py-3 bg-[#a078ff] text-[#340080] rounded-xl font-sans font-bold text-sm active:scale-95 transition-all shadow-md"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-3 bg-[#353437] text-[#cbc3d7] rounded-xl font-mono-custom text-xs"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 py-3 bg-[#353437] hover:bg-[#494454] text-[#e5e1e4] rounded-xl font-sans font-bold text-sm active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-lg" data-icon="edit">
                    edit
                  </span>
                  Edit Bet
                </button>
                <button
                  onClick={() => {
                    if (confirm('Delete this bet entry?')) {
                      onDeleteBet(bet.id);
                      onClose();
                    }
                  }}
                  className="px-4 py-3 bg-[#93000a]/20 hover:bg-[#93000a]/40 text-[#ffb4ab] rounded-xl font-mono-custom text-xs flex items-center justify-center"
                  title="Delete"
                >
                  <span className="material-symbols-outlined text-lg" data-icon="delete">
                    delete
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
