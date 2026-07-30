import { useState, useEffect } from 'react';
import { Bet, BetStatus, ViewTab, UserProfile } from './types';
import { INITIAL_BETS } from './data/initialBets';
import { Header } from './components/Header';
import { BottomNavBar } from './components/BottomNavBar';
import { DashboardView } from './components/DashboardView';
import { HistoryView } from './components/HistoryView';
import { TicketScannerView } from './components/TicketScannerView';
import { SearchModal } from './components/SearchModal';
import { ProfileModal } from './components/ProfileModal';
import { BetDetailModal } from './components/BetDetailModal';

export default function App() {
  const [bets, setBets] = useState<Bet[]>(() => {
    try {
      const saved = localStorage.getItem('bettracker_bets');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load saved bets:', e);
    }
    return INITIAL_BETS;
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const savedProf = localStorage.getItem('bettracker_profile');
      if (savedProf) {
        return JSON.parse(savedProf);
      }
    } catch (e) {
      console.error('Failed to load profile:', e);
    }
    return {
      name: 'Apostador Pro',
      bankroll: 500.0,
      preferredCurrency: 'EUR',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    };
  });

  const [activeTab, setActiveTab] = useState<ViewTab>('dashboard');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedBetDetail, setSelectedBetDetail] = useState<Bet | null>(null);

  // Sync bets to local storage
  useEffect(() => {
    try {
      localStorage.setItem('bettracker_bets', JSON.stringify(bets));
    } catch (e) {
      console.error('Failed to save bets:', e);
    }
  }, [bets]);

  // Sync profile to local storage
  useEffect(() => {
    try {
      localStorage.setItem('bettracker_profile', JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile:', e);
    }
  }, [profile]);

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  const handleAddBet = (newBetData: Omit<Bet, 'id'>) => {
    const newBet: Bet = {
      ...newBetData,
      id: `bet-${Date.now()}`,
    };
    setBets((prev) => [newBet, ...prev]);
  };

  const handleStatusChange = (id: string, newStatus: BetStatus) => {
    setBets((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
    if (selectedBetDetail && selectedBetDetail.id === id) {
      setSelectedBetDetail((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleUpdateBet = (updatedBet: Bet) => {
    setBets((prev) =>
      prev.map((b) => (b.id === updatedBet.id ? updatedBet : b))
    );
    setSelectedBetDetail(updatedBet);
  };

  const handleDeleteBet = (id: string) => {
    setBets((prev) => prev.filter((b) => b.id !== id));
    if (selectedBetDetail && selectedBetDetail.id === id) {
      setSelectedBetDetail(null);
    }
  };

  const handleResetBets = () => {
    setBets(INITIAL_BETS);
    localStorage.removeItem('bettracker_bets');
  };

  return (
    <div className="min-h-screen bg-[#131315] text-[#e5e1e4] relative selection:bg-[#a078ff] selection:text-[#340080]">
      {/* Background Subtle Noise overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Main Top Header */}
      <Header
        profile={profile}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Main Screen Content View Routing */}
      <main className="min-h-screen">
        {activeTab === 'dashboard' && (
          <DashboardView
            bets={bets}
            onNavigateToHistory={() => setActiveTab('history')}
            onNavigateToScanner={() => setActiveTab('scanner')}
            onSelectBet={(bet) => setSelectedBetDetail(bet)}
          />
        )}

        {activeTab === 'scanner' && (
          <TicketScannerView
            onAddBet={handleAddBet}
            onNavigateToHistory={() => setActiveTab('history')}
          />
        )}

        {activeTab === 'history' && (
          <HistoryView
            bets={bets}
            onStatusChange={handleStatusChange}
            onDeleteBet={handleDeleteBet}
            onSelectBet={(bet) => setSelectedBetDetail(bet)}
            onNavigateToScanner={() => setActiveTab('scanner')}
          />
        )}
      </main>

      {/* Floating 3D Navigation Bar */}
      <BottomNavBar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Interactive Dialogs & Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        bets={bets}
        onSelectBet={(bet) => setSelectedBetDetail(bet)}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        bets={bets}
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
        onResetBets={handleResetBets}
      />

      <BetDetailModal
        bet={selectedBetDetail}
        onClose={() => setSelectedBetDetail(null)}
        onUpdateBet={handleUpdateBet}
        onDeleteBet={handleDeleteBet}
      />
    </div>
  );
}
