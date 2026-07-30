import { useState, useEffect } from 'react';
import type { Session } from '@supabase/supabase-js';
import { Bet, BetStatus, ViewTab, UserProfile } from './types';
import { supabase } from './lib/supabaseClient';
import { AuthView } from './components/AuthView';
import { Header } from './components/Header';
import { BottomNavBar } from './components/BottomNavBar';
import { DashboardView } from './components/DashboardView';
import { HistoryView } from './components/HistoryView';
import { LiveView } from './components/LiveView';
import { TicketScannerView } from './components/TicketScannerView';
import { SearchModal } from './components/SearchModal';
import { ProfileModal } from './components/ProfileModal';
import { BetDetailModal } from './components/BetDetailModal';

const DEFAULT_PROFILE: UserProfile = {
  name: 'Apostador Pro',
  bankroll: 500.0,
  preferredCurrency: 'EUR',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
};

function rowToBet(row: any): Bet {
  return {
    id: row.id,
    eventName: row.event_name,
    sport: row.sport,
    market: row.market,
    odds: Number(row.odds),
    stake: Number(row.stake),
    date: row.date,
    status: row.status,
    ticketCode: row.ticket_code || undefined,
    notes: row.notes || undefined,
    ticketImage: row.ticket_image || undefined,
  };
}

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [bets, setBets] = useState<Bet[]>([]);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [dataLoading, setDataLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<ViewTab>('dashboard');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedBetDetail, setSelectedBetDetail] = useState<Bet | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) {
      setBets([]);
      setProfile(DEFAULT_PROFILE);
      return;
    }
    (async () => {
      setDataLoading(true);
      const userId = session.user.id;

      const [{ data: betsData }, { data: profileData }] = await Promise.all([
        supabase.from('bettracker_bets').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
        supabase.from('bettracker_profiles').select('*').eq('user_id', userId).maybeSingle(),
      ]);

      setBets((betsData || []).map(rowToBet));

      if (profileData) {
        setProfile({
          name: profileData.name,
          bankroll: Number(profileData.bankroll),
          preferredCurrency: profileData.preferred_currency,
          avatarUrl: profileData.avatar_url || undefined,
        });
      } else {
        await supabase.from('bettracker_profiles').insert({
          user_id: userId,
          name: DEFAULT_PROFILE.name,
          bankroll: DEFAULT_PROFILE.bankroll,
          preferred_currency: DEFAULT_PROFILE.preferredCurrency,
          avatar_url: DEFAULT_PROFILE.avatarUrl,
        });
        setProfile(DEFAULT_PROFILE);
      }
      setDataLoading(false);
    })();
  }, [session]);

  const handleUpdateProfile = async (updated: Partial<UserProfile>) => {
    if (!session) return;
    const merged = { ...profile, ...updated };
    setProfile(merged);
    await supabase.from('bettracker_profiles').update({
      name: merged.name,
      bankroll: merged.bankroll,
      preferred_currency: merged.preferredCurrency,
      avatar_url: merged.avatarUrl,
    }).eq('user_id', session.user.id);
  };

  const handleAddBet = async (newBetData: Omit<Bet, 'id'>) => {
    if (!session) return;
    const { data, error } = await supabase.from('bettracker_bets').insert({
      user_id: session.user.id,
      event_name: newBetData.eventName,
      sport: newBetData.sport,
      market: newBetData.market,
      odds: newBetData.odds,
      stake: newBetData.stake,
      date: newBetData.date,
      status: newBetData.status,
      ticket_code: newBetData.ticketCode,
      notes: newBetData.notes,
      ticket_image: newBetData.ticketImage,
    }).select().single();

    if (!error && data) {
      setBets((prev) => [rowToBet(data), ...prev]);
    }
  };

  const handleStatusChange = async (id: string, newStatus: BetStatus) => {
    setBets((prev) => prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b)));
    if (selectedBetDetail && selectedBetDetail.id === id) {
      setSelectedBetDetail((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    await supabase.from('bettracker_bets').update({ status: newStatus }).eq('id', id);
  };

  const handleUpdateBet = async (updatedBet: Bet) => {
    setBets((prev) => prev.map((b) => (b.id === updatedBet.id ? updatedBet : b)));
    setSelectedBetDetail(updatedBet);
    await supabase.from('bettracker_bets').update({
      event_name: updatedBet.eventName,
      market: updatedBet.market,
      odds: updatedBet.odds,
      stake: updatedBet.stake,
      status: updatedBet.status,
      notes: updatedBet.notes,
    }).eq('id', updatedBet.id);
  };

  const handleDeleteBet = async (id: string) => {
    setBets((prev) => prev.filter((b) => b.id !== id));
    if (selectedBetDetail && selectedBetDetail.id === id) {
      setSelectedBetDetail(null);
    }
    await supabase.from('bettracker_bets').delete().eq('id', id);
  };

  const handleResetBets = async () => {
    if (!session) return;
    await supabase.from('bettracker_bets').delete().eq('user_id', session.user.id);
    setBets([]);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setActiveTab('dashboard');
    setIsProfileOpen(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#131315] flex items-center justify-center">
        <span className="text-[#cbc3d7] text-sm font-mono">Cargando...</span>
      </div>
    );
  }

  if (!session) {
    return <AuthView />;
  }

  return (
    <div className="min-h-screen bg-[#131315] text-[#e5e1e4] relative selection:bg-[#a078ff] selection:text-[#340080]">
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

      <Header
        profile={profile}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      <main className="min-h-screen">
        {dataLoading ? (
          <div className="pt-32 text-center text-[#cbc3d7] text-sm font-mono">Cargando tus tickets...</div>
        ) : (
          <>
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

            {activeTab === 'live' && <LiveView />}

            {activeTab === 'history' && (
              <HistoryView
                bets={bets}
                onStatusChange={handleStatusChange}
                onDeleteBet={handleDeleteBet}
                onSelectBet={(bet) => setSelectedBetDetail(bet)}
                onNavigateToScanner={() => setActiveTab('scanner')}
              />
            )}
          </>
        )}
      </main>

      <BottomNavBar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

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
        onLogout={handleLogout}
        userEmail={session.user.email || ''}
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
