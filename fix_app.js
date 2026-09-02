const fs = require('fs');

const code = \import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Trophy, TrendingUp, AlertTriangle, Users } from 'lucide-react';

function App() {
  const [picks, setPicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSport, setActiveSport] = useState('MLB'); 

  const sports = ['MLB', 'NFL', 'NBA', 'WNBA', 'NHL'];

  useEffect(() => {
    fetchPicks();
  }, []);

  async function fetchPicks() {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('covers_picks')
      .select('*')
      .eq('game_date', today)
      .order('rank', { ascending: true });

    if (error) console.error(error);
    else setPicks(data || []);
    setLoading(false);
  }

  const filteredPicks = picks.filter(p => p.sport.toUpperCase() === activeSport);
  
  const groupedPicks = filteredPicks.reduce((acc, pick) => {
    let cleanMatchup = pick.matchup.replace(' & Props', '').replace(' Picks', '');
    if (!acc[cleanMatchup]) acc[cleanMatchup] = [];
    acc[cleanMatchup].push(pick);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 font-sans">
      <header className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600 mb-3 flex items-center justify-center gap-3">
          <Trophy size={40} className="text-orange-500" />
          Covers Smart Tracker
        </h1>
        <p className="text-gray-400 text-lg">Monitoreando las mejores jugadas de los tipsters en racha</p>
      </header>

      <div className="flex justify-center gap-2 mb-10 flex-wrap">
        {sports.map(sport => (
          <button
            key={sport}
            onClick={() => setActiveSport(sport)}
            className={\\\px-6 py-2 rounded-full font-bold text-sm transition-all \\\\\\}
          >
            {sport}
          </button>
        ))}
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : Object.keys(groupedPicks).length === 0 ? (
        <div className="text-center text-gray-500 mt-10 border border-gray-800 rounded-xl p-10 bg-gray-900/50 max-w-2xl mx-auto">
          <AlertTriangle size={48} className="mx-auto mb-4 text-orange-500/50" />
          <p className="text-xl">No hay jugadas registradas hoy para {activeSport}.</p>
          <p className="text-sm mt-2">Prueba seleccionando otro deporte o verifica que el robot se haya ejecutado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {Object.entries(groupedPicks).map(([matchup, matchPicks]) => (
            <div key={matchup} className="bg-[#111111] rounded-2xl p-5 border border-gray-800 hover:border-orange-500/30 transition-colors shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-5 pb-3 border-b border-gray-800 flex justify-between items-center">
                {matchup}
                <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full flex items-center gap-1">
                  <Users size={12} /> {matchPicks.length} picks
                </span>
              </h2>
              <div className="space-y-3">
                {matchPicks.map((pick, i) => {
                  let cleanPickText = pick.pick_text;
                  if (cleanPickText.endsWith(pick.user_name)) {
                    cleanPickText = cleanPickText.slice(0, -pick.user_name.length).trim();
                  }

                  return (
                    <div key={i} className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-800">
                      <div className="flex justify-between items-start mb-3">
                        <span className="font-bold text-blue-400 text-sm">@{pick.user_name}</span>
                        <span className="text-[10px] uppercase tracking-wider bg-orange-500/10 text-orange-400 px-2 py-1 rounded font-bold border border-orange-500/20">
                          #{pick.rank} en {pick.team_specialty}
                        </span>
                      </div>
                      <div className="text-base font-bold text-white mb-3">
                        {cleanPickText}
                      </div>
                      <div className="flex gap-4 text-xs font-medium">
                        <span className="flex items-center gap-1 text-gray-400">
                          <TrendingUp size={14}/> {pick.record}
                        </span>
                        <span className="text-green-400 bg-green-400/10 px-2 py-0.5 rounded">
                          +{pick.units.toLocaleString()} units
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
\;
fs.writeFileSync('src/App.jsx', code, 'utf8');
