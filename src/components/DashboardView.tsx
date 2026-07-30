import React, { useState, useEffect } from 'react';
import { Bet } from '../types';
import { calculateBetStats, formatUnit } from '../utils/calcStats';

interface DashboardViewProps {
  bets: Bet[];
  onNavigateToHistory: () => void;
  onNavigateToScanner: () => void;
  onSelectBet: (bet: Bet) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  bets,
  onNavigateToHistory,
  onNavigateToScanner,
  onSelectBet,
}) => {
  const stats = calculateBetStats(bets);

  // Animated display for total profit number
  const [animatedProfit, setAnimatedProfit] = useState(0);

  useEffect(() => {
    const target = stats.totalProfit;
    const duration = 800; // ms
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    let count = 0;

    const timer = setInterval(() => {
      count++;
      current += increment;
      if (count >= steps) {
        setAnimatedProfit(target);
        clearInterval(timer);
      } else {
        setAnimatedProfit(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [stats.totalProfit]);

  // Semi-circle gauge calculations
  // Circumference for radius 40 arc = Math.PI * 40 = ~125.66
  const arcTotal = 125.66;
  const winRateRatio = stats.winRate / 100;
  const strokeOffset = arcTotal * (1 - winRateRatio);

  const recentBets = bets.slice(0, 4);

  const getSportIcon = (sport: string) => {
    switch (sport.toLowerCase()) {
      case 'soccer':
        return 'sports_soccer';
      case 'basketball':
        return 'sports_basketball';
      case 'tennis':
        return 'sports_tennis';
      case 'esports':
        return 'sports_esports';
      case 'baseball':
        return 'sports_baseball';
      case 'football':
        return 'sports_football';
      case 'mma':
        return 'sports_mma';
      default:
        return 'sports';
    }
  };

  return (
    <div className="pt-20 pb-32 px-4 sm:px-6 max-w-lg mx-auto md:max-w-4xl">
      {/* Hero Section: Profit/Loss Units */}
      <section className="mb-6">
        <div className="synthetic-card p-6 rounded-xl flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#a078ff] via-[#4edea3] to-[#ffb95f]" />
          <span className="font-mono-custom text-xs text-[#cbc3d7] tracking-wider uppercase mb-1">
            TOTAL PERFORMANCE
          </span>
          <div className="flex items-center justify-center gap-2 my-1">
            <span className="font-sans text-4xl sm:text-5xl font-extrabold text-[#4edea3] tracking-tight">
              {animatedProfit >= 0 ? `+${animatedProfit.toFixed(2)}` : animatedProfit.toFixed(2)}
            </span>
            <span className="font-mono-custom text-base text-[#4edea3] bg-[#4edea3]/10 border border-[#4edea3]/20 px-2 py-0.5 rounded font-bold">
              u
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[#4edea3] font-mono-custom text-xs font-semibold">
            <span className="material-symbols-outlined text-sm" data-icon="trending_up">
              trending_up
            </span>
            <span>{stats.roi >= 0 ? `+${stats.roi.toFixed(1)}%` : `${stats.roi.toFixed(1)}%`} ROI</span>
          </div>
        </div>
      </section>

      {/* Bento Grid: Win Rate Chart & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Semi-Circle Win Rate Chart */}
        <div className="synthetic-card p-6 rounded-xl flex flex-col items-center justify-center relative overflow-hidden min-h-[240px]">
          <div className="absolute top-4 left-4">
            <span className="font-mono-custom text-xs text-[#cbc3d7] uppercase tracking-wider">
              WIN RATE
            </span>
          </div>

          {/* Gauge Arc */}
          <div className="relative w-48 h-24 mt-6">
            <svg className="absolute inset-0 w-full h-full -rotate-180" viewBox="0 0 100 50">
              <path
                className="text-[#353437]"
                d="M 10,50 A 40,40 0 0 1 90,50"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="10"
              />
              <path
                className="text-[#4edea3] transition-all duration-1000 ease-out"
                d="M 10,50 A 40,40 0 0 1 90,50"
                fill="none"
                stroke="currentColor"
                strokeDasharray="125.66"
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
                strokeWidth="10"
              />
            </svg>
            <div className="absolute top-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <span className="font-sans text-2xl font-bold text-[#e5e1e4]">
                {Math.round(stats.winRate)}%
              </span>
            </div>
          </div>

          <div className="mt-6 flex justify-between w-full font-mono-custom text-xs text-[#cbc3d7] px-4">
            <div className="flex flex-col items-center">
              <span className="text-[#4edea3] font-bold">{stats.wins} Wins</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[#ffb4ab] font-bold">{stats.losses} Losses</span>
            </div>
          </div>
        </div>

        {/* Total Bets & Avg Odds Cards */}
        <div className="grid grid-rows-2 gap-4">
          <div className="synthetic-card p-5 rounded-xl flex justify-between items-center">
            <div>
              <span className="font-mono-custom text-xs text-[#cbc3d7] block mb-1 uppercase tracking-wider">
                TOTAL BETS
              </span>
              <span className="font-sans text-2xl font-bold text-[#e5e1e4]">
                {stats.totalBets}
              </span>
            </div>
            <div className="bg-[#a078ff]/10 p-3 rounded-xl border border-[#a078ff]/20">
              <span className="material-symbols-outlined text-[#d0bcff] text-2xl" data-icon="confirmation_number">
                confirmation_number
              </span>
            </div>
          </div>

          <div className="synthetic-card p-5 rounded-xl flex justify-between items-center">
            <div>
              <span className="font-mono-custom text-xs text-[#cbc3d7] block mb-1 uppercase tracking-wider">
                AVERAGE ODDS
              </span>
              <span className="font-sans text-2xl font-bold text-[#e5e1e4]">
                {stats.avgOdds.toFixed(2)}
              </span>
            </div>
            <div className="bg-[#4edea3]/10 p-3 rounded-xl border border-[#4edea3]/20">
              <span className="material-symbols-outlined text-[#4edea3] text-2xl" data-icon="percent">
                percent
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity List */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-sans text-lg font-bold text-[#e5e1e4]">
            Recent Activity
          </h2>
          <button
            onClick={onNavigateToHistory}
            className="text-[#d0bcff] font-mono-custom text-xs font-semibold hover:underline active:scale-95 transition-all flex items-center gap-1"
          >
            <span>VIEW ALL</span>
            <span className="material-symbols-outlined text-sm" data-icon="arrow_forward">
              arrow_forward
            </span>
          </button>
        </div>

        <div className="space-y-3">
          {recentBets.map((bet) => {
            const isWon = bet.status === 'won';
            const isLost = bet.status === 'lost';
            const profitVal = isWon ? (bet.odds - 1) * bet.stake : isLost ? -bet.stake : bet.odds * bet.stake;

            return (
              <div
                key={bet.id}
                onClick={() => onSelectBet(bet)}
                className="synthetic-card p-4 rounded-xl flex items-center justify-between cursor-pointer hover:bg-[#2a2a2c] active:scale-[0.99] transition-all duration-200 border border-[#494454]/30"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 bg-[#353437] rounded-lg flex items-center justify-center border border-[#494454]/40 shrink-0">
                    <span className="material-symbols-outlined text-[#cbc3d7] text-xl" data-icon={getSportIcon(bet.sport)}>
                      {getSportIcon(bet.sport)}
                    </span>
                  </div>
                  <div>
                    <p className="font-sans font-semibold text-[#e5e1e4] text-sm leading-tight">
                      {bet.eventName}
                    </p>
                    <p className="font-mono-custom text-xs text-[#cbc3d7] mt-0.5">
                      {bet.market}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`inline-block px-2 py-0.5 font-mono-custom text-[10px] font-bold rounded mb-1 uppercase border ${
                      isWon
                        ? 'bg-[#00a572]/20 text-[#4edea3] border-[#4edea3]/30'
                        : isLost
                        ? 'bg-[#93000a]/30 text-[#ffb4ab] border-[#ffb4ab]/30'
                        : 'bg-[#a078ff]/20 text-[#d0bcff] border-[#d0bcff]/30'
                    }`}
                  >
                    {bet.status}
                  </span>
                  <p
                    className={`font-mono-custom text-sm font-bold ${
                      isWon
                        ? 'text-[#4edea3]'
                        : isLost
                        ? 'text-[#ffb4ab]'
                        : 'text-[#d0bcff]'
                    }`}
                  >
                    {isWon ? formatUnit(profitVal) : isLost ? `-${bet.stake.toFixed(2)}u` : `Pot. ${formatUnit(profitVal)}`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Floating 3D Action Button (FAB) on Bottom Right */}
      <button
        onClick={onNavigateToScanner}
        className="fixed bottom-24 right-6 w-14 h-14 bg-[#a078ff] text-[#340080] rounded-full shadow-2xl flex items-center justify-center z-[60] active:scale-90 hover:scale-105 transition-all duration-150 border-t border-white/40 cursor-pointer"
        title="Escanear Ticket"
        aria-label="Escanear Ticket"
      >
        <span className="material-symbols-outlined text-2xl font-bold" data-icon="qr_code_scanner">
          qr_code_scanner
        </span>
      </button>
    </div>
  );
};
