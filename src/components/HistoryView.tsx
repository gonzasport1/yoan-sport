import React, { useState } from 'react';
import { Bet, BetStatus, SportCategory } from '../types';
import { calculateBetStats, formatUnit } from '../utils/calcStats';

interface HistoryViewProps {
  bets: Bet[];
  onStatusChange: (id: string, newStatus: BetStatus) => void;
  onDeleteBet: (id: string) => void;
  onSelectBet: (bet: Bet) => void;
  onNavigateToScanner: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  bets,
  onStatusChange,
  onDeleteBet,
  onSelectBet,
  onNavigateToScanner,
}) => {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [selectedSportFilter, setSelectedSportFilter] = useState<string>('all');

  const sportsList: { label: string; value: string; icon: string }[] = [
    { label: 'ALL', value: 'all', icon: 'sports' },
    { label: 'FOOTBALL', value: 'Football', icon: 'sports_football' },
    { label: 'BASKETBALL', value: 'Basketball', icon: 'sports_basketball' },
    { label: 'TENNIS', value: 'Tennis', icon: 'sports_tennis' },
    { label: 'SOCCER', value: 'Soccer', icon: 'sports_soccer' },
    { label: 'ESPORTS', value: 'Esports', icon: 'sports_esports' },
    { label: 'BASEBALL', value: 'Baseball', icon: 'sports_baseball' },
  ];

  // Filter bets based on user selection
  const filteredBets = bets.filter((bet) => {
    const matchesStatus =
      selectedStatusFilter === 'all' || bet.status === selectedStatusFilter;
    const matchesSport =
      selectedSportFilter === 'all' ||
      bet.sport.toLowerCase() === selectedSportFilter.toLowerCase();
    return matchesStatus && matchesSport;
  });

  const filteredStats = calculateBetStats(filteredBets);

  return (
    <div className="pt-20 pb-36 px-4 sm:px-6 max-w-4xl mx-auto w-full">
      {/* Filters Section */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-mono-custom text-xs text-[#cbc3d7] uppercase tracking-wider font-semibold">
            ACTIVITY HISTORY
          </h2>
          <span className="font-mono-custom text-xs text-[#4edea3] font-bold">
            {filteredBets.length} {filteredBets.length === 1 ? 'Bet' : 'Bets'} Found
          </span>
        </div>

        {/* Status Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          {['all', 'won', 'lost', 'pending'].map((filterKey) => {
            const isActive = selectedStatusFilter === filterKey;
            return (
              <button
                key={filterKey}
                onClick={() => setSelectedStatusFilter(filterKey)}
                className={`px-4 py-2 rounded-lg border font-mono-custom text-xs font-bold transition-all active:scale-95 cursor-pointer uppercase ${
                  isActive
                    ? 'bg-[#a078ff] text-[#340080] border-[#a078ff] shadow-md'
                    : 'bg-[#201f21] text-[#cbc3d7] border-[#494454] hover:border-[#4edea3]'
                }`}
              >
                {filterKey}
              </button>
            );
          })}
        </div>

        {/* Sport Categories Horizontal Scroll */}
        <div className="overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          <div className="flex gap-2 min-w-max">
            {sportsList.map((s) => {
              const isActive = selectedSportFilter.toLowerCase() === s.value.toLowerCase();
              return (
                <button
                  key={s.value}
                  onClick={() => setSelectedSportFilter(s.value)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg border font-mono-custom text-xs transition-all active:scale-95 cursor-pointer ${
                    isActive
                      ? 'bg-[#00a572] text-[#00311f] font-bold border-[#6ffbbe]/40'
                      : 'bg-[#201f21] text-[#cbc3d7] border-[#494454] hover:border-[#4edea3]'
                  }`}
                >
                  <span className="material-symbols-outlined text-base" data-icon={s.icon}>
                    {s.icon}
                  </span>
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bet Cards List */}
      <div className="space-y-4" id="bet-list">
        {filteredBets.length === 0 ? (
          <div className="synthetic-card p-8 rounded-xl text-center border border-[#494454]/30 my-6">
            <span className="material-symbols-outlined text-4xl text-[#cbc3d7] mb-2" data-icon="search_off">
              search_off
            </span>
            <p className="font-sans font-semibold text-[#e5e1e4]">No bets found for this filter</p>
            <p className="font-mono-custom text-xs text-[#cbc3d7] mt-1">Try changing filters or log a new wager.</p>
            <button
              onClick={onNavigateToScanner}
              className="mt-4 px-4 py-2 bg-[#a078ff] text-[#340080] rounded-lg font-mono-custom font-bold text-xs active:scale-95 transition-all inline-flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm" data-icon="qr_code_scanner">
                qr_code_scanner
              </span>
              <span>Escanear Ticket</span>
            </button>
          </div>
        ) : (
          filteredBets.map((bet) => {
            const isWon = bet.status === 'won';
            const isLost = bet.status === 'lost';
            const isPending = bet.status === 'pending';
            const accentClass = isWon ? 'won-accent' : isLost ? 'lost-accent' : 'pending-accent';

            const profitVal = isWon
              ? (bet.odds - 1) * bet.stake
              : isLost
              ? -bet.stake
              : (bet.odds - 1) * bet.stake;

            return (
              <div
                key={bet.id}
                className={`bet-card-depth ${accentClass} rounded-xl p-4 flex flex-col gap-2 transition-all cursor-pointer`}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1" onClick={() => onSelectBet(bet)}>
                    <p className="font-mono-custom text-[11px] text-[#cbc3d7] mb-0.5">
                      {bet.date}
                    </p>
                    <h3 className="font-sans text-base sm:text-lg font-bold leading-snug text-[#e5e1e4]">
                      {bet.eventName}
                    </h3>
                    <p className="text-[#cbc3d7] text-xs mt-1 font-sans">
                      {bet.market}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span
                      className={`px-3 py-1 rounded-full font-mono-custom text-xs font-bold uppercase border ${
                        isWon
                          ? 'bg-[#4edea3]/10 text-[#4edea3] border-[#4edea3]/30'
                          : isLost
                          ? 'bg-[#ffb4ab]/10 text-[#ffb4ab] border-[#ffb4ab]/30'
                          : 'bg-[#d0bcff]/10 text-[#d0bcff] border-[#d0bcff]/30'
                      }`}
                    >
                      {bet.status}
                    </span>

                    {/* Quick status switch buttons */}
                    <div className="flex gap-1 mt-1">
                      {isPending ? (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onStatusChange(bet.id, 'won');
                            }}
                            className="text-[10px] bg-[#4edea3]/20 hover:bg-[#4edea3]/40 text-[#4edea3] px-2 py-0.5 rounded font-mono-custom border border-[#4edea3]/30 active:scale-95"
                            title="Mark as Won"
                          >
                            ✓ WON
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onStatusChange(bet.id, 'lost');
                            }}
                            className="text-[10px] bg-[#ffb4ab]/20 hover:bg-[#ffb4ab]/40 text-[#ffb4ab] px-2 py-0.5 rounded font-mono-custom border border-[#ffb4ab]/30 active:scale-95"
                            title="Mark as Lost"
                          >
                            ✕ LOST
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onStatusChange(bet.id, 'pending');
                          }}
                          className="text-[10px] bg-[#353437] hover:bg-[#494454] text-[#cbc3d7] px-2 py-0.5 rounded font-mono-custom active:scale-95"
                          title="Reset to Pending"
                        >
                          ↺ Reset
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Delete this bet entry?')) {
                            onDeleteBet(bet.id);
                          }
                        }}
                        className="text-[10px] bg-[#353437] hover:bg-[#93000a]/50 text-[#ffb4ab] px-1.5 py-0.5 rounded font-mono-custom active:scale-95"
                        title="Delete bet"
                      >
                        <span className="material-symbols-outlined text-xs" data-icon="delete">
                          delete
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-end mt-2 pt-2 border-t border-[#494454]/30">
                  <div className="flex gap-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#cbc3d7] uppercase font-bold tracking-wider font-mono-custom">
                        Stake
                      </span>
                      <span className="font-mono-custom text-sm font-semibold text-[#e5e1e4]">
                        {bet.stake.toFixed(2)}u
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#cbc3d7] uppercase font-bold tracking-wider font-mono-custom">
                        Odds
                      </span>
                      <span className="font-mono-custom text-sm font-semibold text-[#e5e1e4]">
                        {bet.odds.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-[#cbc3d7] uppercase font-bold tracking-wider font-mono-custom">
                      {isWon ? 'Profit' : isLost ? 'Result' : 'Potential'}
                    </span>
                    <p
                      className={`font-mono-custom text-base sm:text-lg font-extrabold ${
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
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Floating Net Performance Footer Tally Banner */}
      <div className="fixed bottom-24 left-0 w-full px-4 sm:px-6 pointer-events-none z-40">
        <div className="max-w-4xl mx-auto pointer-events-auto">
          <div className="bg-[#353437]/90 backdrop-blur-xl border border-[#494454] rounded-xl shadow-2xl p-4 flex items-center justify-between border-b-4 border-[#4edea3]/40">
            <div>
              <p className="font-mono-custom text-[10px] text-[#cbc3d7] uppercase font-bold">
                Net Performance
              </p>
              <p
                className={`font-sans text-lg sm:text-xl font-bold ${
                  filteredStats.totalProfit >= 0 ? 'text-[#4edea3]' : 'text-[#ffb4ab]'
                }`}
              >
                {filteredStats.totalProfit >= 0 ? '+' : ''}
                {filteredStats.totalProfit.toFixed(2)} units
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono-custom text-[10px] text-[#cbc3d7] uppercase font-bold">
                Win Rate
              </p>
              <p className="font-mono-custom text-base sm:text-lg font-bold text-[#e5e1e4]">
                {filteredStats.winRate.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
