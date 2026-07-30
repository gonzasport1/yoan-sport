export type BetStatus = 'won' | 'lost' | 'pending';

export type SportCategory = 
  | 'Football' 
  | 'Basketball' 
  | 'Tennis' 
  | 'Soccer' 
  | 'Esports' 
  | 'Baseball' 
  | 'MMA' 
  | 'Other';

export type ViewTab = 'dashboard' | 'history' | 'scanner';

export interface Bet {
  id: string;
  eventName: string;
  sport: SportCategory;
  market: string;
  odds: number;
  stake: number;
  date: string; // e.g. "Oct 24, 2023 • 20:45" or ISO string
  status: BetStatus;
  ticketCode?: string;
  notes?: string;
  ticketImage?: string;
}

export interface UserProfile {
  name: string;
  avatarUrl?: string;
  bankroll: number;
  preferredCurrency: string;
}

export interface BetStats {
  totalBets: number;
  wins: number;
  losses: number;
  pending: number;
  winRate: number; // percentage
  totalProfit: number;
  roi: number; // percentage
  avgOdds: number;
}
