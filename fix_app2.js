const fs = require('fs');

const code = \import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Trophy, TrendingUp, AlertTriangle, Users, Flame } from 'lucide-react';

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
  
  // 1. Limpiar el texto de las jugadas para compararlas correctamente
  const cleanedPicks = filteredPicks.map(pick => {
    let cleanMatchup = pick.matchup.replace(' & Props', '').replace(' Picks', '');
    let cleanPickText = pick.pick_text;
    if (cleanPickText.endsWith(pick.user_name)) {
      cleanPickText = cleanPickText.slice(0, -pick.user_name.length).trim();
    }
    return { ...pick, cleanMatchup, cleanPickText };
  });

  // 2. Agrupar por partido para la vista normal
  const groupedPicks = cleanedPicks.reduce((acc, pick) => {
    if (!acc[pick.cleanMatchup]) acc[pick.cleanMatchup] = [];
    acc[pick.cleanMatchup].push(pick);
    return acc;
  }, {});

  // 3. CALCULAR COINCIDENCIAS (El Patrón de Oro)
  // Agrupamos por jugada exacta. Si 2 o más tipsters del Top 10 coinciden en la misma jugada, es una alerta.
  const coincidences = {};
  cleanedPicks.forEach(pick => {
    const key = \\\\\\ | \\\\\\;
    if (!coincidences[key]) coincidences[key] = [];
    coincidences[key].push(pick);
  });

  // Filtramos solo donde hay 2 o más coincidencias y ordenamos por mayor cantidad de coincidencias
  const hotPicks = Object.entries(coincidences)
    .filter(([_, experts]) => experts.length >= 2)
    .sort((a, b) => b[1].length - a[1].length);

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
        <div className="max-w-7xl mx-auto">
          
          {/* SECCIÓN DE ALERTAS: COINCIDENCIAS TOP 10 */}
          {hotPicks.length > 0 && (
            <div className="mb-12 bg-gradient-to-br from-orange-900/40 to-red-900/20 border border-orange-500/50 rounded-2xl p-6 shadow-[0_0_30px_rgba(249,115,22,0.15)]">
              <h2 className="text-2xl font-black text-orange-400 mb-6 flex items-center gap-2">
                <Flame size={28} /> ALERTA DE CONSENSO TOP 10
              </h2>
              <p className="text-gray-300 mb-6 text-sm">
                Las siguientes jugadas tienen a múltiples tipsters del Top 10 apostando exactamente a lo mismo:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {hotPicks.map(([key, experts], idx) => {
                  const [matchup, pickText] = key.split(' | ');
                  return (
                    <div key={idx} className="bg-black/60 border border-orange-500/30 rounded-xl p-4">
                      <div className="text-xs text-gray-400 mb-1">{matchup}</div>
                      <div className="text-lg font-bold text-white mb-3 text-orange-100">{pickText}</div>
                      <div className="bg-orange-500/20 text-orange-300 text-xs font-bold px-3 py-1.5 rounded-lg inline-block mb-3 border border-orange-500/30">
                        {experts.length} Tipsters Top 10 coinciden
                      </div>
                      <div className="space-y-2">
                        {experts.map((exp, eIdx) => (
                          <div key={eIdx} className="text-xs flex justify-between items-center bg-gray-800/50 p-1.5 rounded">
                            <span className="text-blue-400">@{exp.user_name}</span>
                            <span className="text-gray-400">#{exp.rank} en {exp.team_specialty}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* VISTA NORMAL AGRUPADA POR PARTIDO */}
          <h2 className="text-xl font-bold text-gray-400 mb-6 pl-2">Todas las jugadas detectadas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(groupedPicks).map(([matchup, matchPicks]) => (
              <div key={matchup} className="bg-[#111111] rounded-2xl p-5 border border-gray-800 hover:border-gray-700 transition-colors shadow-2xl">
                <h2 className="text-xl font-bold text-white mb-5 pb-3 border-b border-gray-800 flex justify-between items-center">
                  {matchup}
                  <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full flex items-center gap-1">
                    <Users size={12} /> {matchPicks.length} picks
                  </span>
                </h2>
                <div className="space-y-3">
                  {matchPicks.map((pick, i) => (
                    <div key={i} className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-800">
                      <div className="flex justify-between items-start mb-3">
                        <span className="font-bold text-blue-400 text-sm">@{pick.user_name}</span>
                        <span className="text-[10px] uppercase tracking-wider bg-gray-700 text-gray-300 px-2 py-1 rounded font-bold">
                          #{pick.rank} en {pick.team_specialty}
                        </span>
                      </div>
                      <div className="text-base font-bold text-white mb-3">
                        {pick.cleanPickText}
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
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}

export default App;
\
fs.writeFileSync('src/App.jsx', code, 'utf8');
