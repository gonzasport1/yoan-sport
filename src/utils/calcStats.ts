import { Bet, BetStats } from '../types';

export function calculateBetStats(bets: Bet[]): BetStats {
  const totalBets = bets.length;
  if (totalBets === 0) {
    return {
      totalBets: 0,
      wins: 0,
      losses: 0,
      pending: 0,
      winRate: 0,
      totalProfit: 0,
      roi: 0,
      avgOdds: 0,
    };
  }

  let wins = 0;
  let losses = 0;
  let pending = 0;
  let totalProfit = 0;
  let totalStakedCompleted = 0;
  let sumOdds = 0;

  bets.forEach((bet) => {
    sumOdds += bet.odds;
    if (bet.status === 'won') {
      wins++;
      const profit = (bet.odds - 1) * bet.stake;
      totalProfit += profit;
      totalStakedCompleted += bet.stake;
    } else if (bet.status === 'lost') {
      losses++;
      totalProfit -= bet.stake;
      totalStakedCompleted += bet.stake;
    } else if (bet.status === 'pending') {
      pending++;
    }
  });

  const resolvedBets = wins + losses;
  const winRate = resolvedBets > 0 ? (wins / resolvedBets) * 100 : 0;
  const roi = totalStakedCompleted > 0 ? (totalProfit / totalStakedCompleted) * 100 : 0;
  const avgOdds = totalBets > 0 ? sumOdds / totalBets : 0;

  return {
    totalBets,
    wins,
    losses,
    pending,
    winRate,
    totalProfit,
    roi,
    avgOdds,
  };
}

export function formatUnit(amount: number): string {
  const sign = amount > 0 ? '+' : '';
  return `${sign}${amount.toFixed(2)}u`;
}
