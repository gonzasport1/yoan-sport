import React, { useState, useEffect } from 'react';

interface LiveGame {
  id: number;
  home: { name: string; logo?: string };
  away: { name: string; logo?: string };
  homeScore: number;
  awayScore: number;
  status: string;
  league: string;
}

interface LiveGroup {
  sport: string;
  label: string;
  games: LiveGame[];
}

const SPORT_ICON: Record<string, string> = {
  Soccer: 'sports_soccer',
  Football: 'sports_football',
  Basketball: 'sports_basketball',
  Baseball: 'sports_baseball',
  Hockey: 'sports_hockey',
};

export const LiveView: React.FC = () => {
  const [groups, setGroups] = useState<LiveGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch('/api/live-all');
        const data = await res.json();
        if (active) {
          setGroups(data.groups || []);
          setError(data.error || '');
        }
      } catch (err) {
        if (active) setError('No se pudo conectar con los datos en vivo.');
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    const id = setInterval(load, 30000);
    return () => { active = false; clearInterval(id); };
  }, []);

  const totalGames = groups.reduce((acc, g) => acc + g.games.length, 0);

  return (
    <div className="pt-20 pb-32 px-4 sm:px-6 max-w-3xl mx-auto">
      <section className="mb-6 mt-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-2xl text-[#ff5252]" data-icon="sensors">sensors</span>
          <h2 className="font-sans text-2xl sm:text-3xl font-extrabold text-[#e5e1e4]">En Vivo</h2>
        </div>
        <p className="font-sans text-sm text-[#cbc3d7] mt-1">
          Partidos en vivo ahora mismo, en los deportes que cubrimos. Se actualiza cada 30 segundos.
        </p>
      </section>

      {loading && (
        <div className="synthetic-card p-8 rounded-xl text-center border border-[#494454]/30">
          <p className="font-mono-custom text-xs text-[#cbc3d7]">Buscando partidos en vivo...</p>
        </div>
      )}

      {!loading && error && (
        <div className="synthetic-card p-6 rounded-xl text-center border border-[#ffb4ab]/30 mb-4">
          <p className="font-mono-custom text-xs text-[#ffb4ab]">{error}</p>
        </div>
      )}

      {!loading && totalGames === 0 && !error && (
        <div className="synthetic-card p-8 rounded-xl text-center border border-[#494454]/30">
          <span className="material-symbols-outlined text-4xl text-[#cbc3d7] mb-2" data-icon="event_busy">event_busy</span>
          <p className="font-sans font-semibold text-[#e5e1e4]">No hay partidos en vivo ahora mismo</p>
          <p className="font-mono-custom text-xs text-[#cbc3d7] mt-1">Probá de nuevo más tarde.</p>
        </div>
      )}

      <div className="space-y-6">
        {groups.map((group) => (
          <div key={group.sport}>
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-base text-[#a078ff]" data-icon={SPORT_ICON[group.sport] || 'sports'}>
                {SPORT_ICON[group.sport] || 'sports'}
              </span>
              <h3 className="font-mono-custom text-xs text-[#cbc3d7] uppercase tracking-wider font-semibold">{group.label}</h3>
            </div>
            <div className="space-y-2">
              {group.games.map((g) => (
                <div key={g.id} className="bet-card-depth rounded-xl p-3.5 flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-mono-custom text-[9px] text-[#cbc3d7] uppercase mb-1 truncate">{g.league}</p>
                    <div className="flex items-center gap-2 text-sm text-[#e5e1e4]">
                      {g.home.logo && <img src={g.home.logo} alt="" className="w-4 h-4 object-contain" />}
                      <span className="truncate">{g.home.name}</span>
                      <span className="font-mono-custom font-bold text-[#4edea3]">{g.homeScore}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#e5e1e4] mt-0.5">
                      {g.away.logo && <img src={g.away.logo} alt="" className="w-4 h-4 object-contain" />}
                      <span className="truncate">{g.away.name}</span>
                      <span className="font-mono-custom font-bold text-[#4edea3]">{g.awayScore}</span>
                    </div>
                  </div>
                  <span className="font-mono-custom text-[10px] text-[#ff5252] bg-[#ff5252]/10 border border-[#ff5252]/30 px-2 py-1 rounded-full font-bold whitespace-nowrap">
                    🔴 {g.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-[#1b1b1d] rounded-xl border border-[#494454]/30 text-center">
        <p className="font-mono-custom text-[10px] text-[#cbc3d7]">
          Tenis todavía no está disponible en vivo — lo dejamos pendiente para cuando consigamos esa fuente de datos.
        </p>
      </div>
    </div>
  );
};
