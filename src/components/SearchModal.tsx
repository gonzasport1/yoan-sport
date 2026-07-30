import React, { useState } from 'react';
import { Bet } from '../types';
import { formatUnit } from '../utils/calcStats';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  bets: Bet[];
  onSelectBet: (bet: Bet) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  bets,
  onSelectBet,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const results = query.trim()
    ? bets.filter(
        (b) =>
          b.eventName.toLowerCase().includes(query.toLowerCase()) ||
          b.market.toLowerCase().includes(query.toLowerCase()) ||
          b.sport.toLowerCase().includes(query.toLowerCase())
      )
    : bets.slice(0, 5);

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#201f21] border border-[#494454] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#494454] flex items-center gap-3 bg-[#1b1b1d]">
          <span className="material-symbols-outlined text-[#d0bcff]" data-icon="search">
            search
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search teams, events, markets, sports..."
            className="w-full bg-transparent text-[#e5e1e4] outline-none font-sans text-base placeholder:text-[#cbc3d7]/50"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#cbc3d7] hover:text-[#e5e1e4]"
            >
              <span className="material-symbols-outlined" data-icon="close">
                close
              </span>
            </button>
          )}
          <button
            onClick={onClose}
            className="px-3 py-1 bg-[#353437] text-[#cbc3d7] hover:text-white rounded-lg text-xs font-mono-custom"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1">
          <p className="font-mono-custom text-[10px] text-[#cbc3d7] uppercase tracking-wider mb-2 font-semibold">
            {query.trim() ? `Found ${results.length} results` : 'Recent Wagers'}
          </p>

          {results.length === 0 ? (
            <p className="text-center py-8 text-[#cbc3d7] font-mono-custom text-xs">
              No matching bets found.
            </p>
          ) : (
            results.map((bet) => {
              const isWon = bet.status === 'won';
              const isLost = bet.status === 'lost';
              const profitVal = isWon
                ? (bet.odds - 1) * bet.stake
                : isLost
                ? -bet.stake
                : (bet.odds - 1) * bet.stake;

              return (
                <div
                  key={bet.id}
                  onClick={() => {
                    onSelectBet(bet);
                    onClose();
                  }}
                  className="p-3 bg-[#1b1b1d] hover:bg-[#2a2a2c] border border-[#494454]/40 rounded-xl cursor-pointer flex justify-between items-center transition-all active:scale-[0.98]"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono-custom text-[10px] text-[#d0bcff] bg-[#d0bcff]/10 px-1.5 py-0.5 rounded">
                        {bet.sport}
                      </span>
                      <span className="font-mono-custom text-[10px] text-[#cbc3d7]">
                        {bet.date}
                      </span>
                    </div>
                    <p className="font-sans font-bold text-sm text-[#e5e1e4] mt-0.5">
                      {bet.eventName}
                    </p>
                    <p className="font-mono-custom text-xs text-[#cbc3d7]">
                      {bet.market}
                    </p>
                  </div>

                  <div className="text-right">
                    <span
                      className={`font-mono-custom text-xs font-bold ${
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
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
