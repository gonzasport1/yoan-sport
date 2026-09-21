import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Trophy, TrendingUp, AlertTriangle, Users, Flame, Percent, Crown, Star, RefreshCw, History, CheckCircle2 } from 'lucide-react';

function App() {
  const [picks, setPicks] = useState([]);
  const [botLogs, setBotLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSport, setActiveSport] = useState('MLB'); 
  const [refreshing, setRefreshing] = useState(false);

  const sports = ['MLB', 'NFL', 'NBA', 'WNBA', 'NHL', '🎯 TOP 10 CONSENSOS', '👑 SURVIVOR TOP 50', '🏆 SURVIVOR (3 MESES)', '⭐ TOP 40 LAST 20', '🔥 FUTURAS RACHAS', '⭐ Last 7 Days', '📊 TOP 100 MES', '💀 SURVIVOR PEOR 20', '📋 HISTORIAL DE ACTUALIZACIONES'];

  useEffect(() => {
    fetchPicks();
  }, []);

  async function fetchPicks() {
    setLoading(true);
    // Usar game_date (YYYY-MM-DD) y created_at para asegurar que SOLO los picks de hoy en horario NY se carguen
    const d = new Date();
    const todayNY = new Date(d.toLocaleString("en-US", {timeZone: "America/New_York"}));
    const year = todayNY.getFullYear();
    const month = String(todayNY.getMonth() + 1).padStart(2, '0');
    const day = String(todayNY.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;
    const todayStartISO = `${todayStr}T04:00:00.000Z`;

    // Query 1: Regular Expert Team picks (MLB/NFL)
    const { data: data1, error: error1 } = await supabase
      .from('covers_picks')
      .select('*')
      .gte('game_date', todayStr)
      .gte('created_at', todayStartISO)
      .neq('team_specialty', 'Survivor Regression')
      .neq('team_specialty', 'Monthly Top 100')
      .neq('team_specialty', 'Top 40 Last 20')
      .neq('team_specialty', 'Survivor Contest')
      .neq('team_specialty', 'Survivor 3 Months')
      .neq('team_specialty', 'Last 7 Days')
      .neq('team_specialty', 'Survivor Worst 20')
      .neq('team_specialty', 'BOT_UPDATE_LOG')
      .order('rank', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(1000);

    // Query 2: SOLO Survivor Regression (Futuras Rachas)
    const { data: data2, error: error2 } = await supabase
      .from('covers_picks')
      .select('*')
      .gte('game_date', todayStr)
      .gte('created_at', todayStartISO)
      .eq('team_specialty', 'Survivor Regression')
      .order('created_at', { ascending: false })
      .limit(500);

    // Query 3: SOLO Monthly Top 100
    const { data: data3, error: error3 } = await supabase
      .from('covers_picks')
      .select('*')
      .gte('game_date', todayStr)
      .gte('created_at', todayStartISO)
      .eq('team_specialty', 'Monthly Top 100')
      .order('rank', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(500);

    // Query 4: SOLO Survivor Contest (Survivor Top 50)
    const { data: data4, error: error4 } = await supabase
      .from('covers_picks')
      .select('*')
      .gte('game_date', todayStr)
      .gte('created_at', todayStartISO)
      .eq('team_specialty', 'Survivor Contest')
      .order('rank', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(500);

    // Query 5: SOLO Survivor 3 Months
    const { data: data5, error: error5 } = await supabase
      .from('covers_picks')
      .select('*')
      .gte('game_date', todayStr)
      .gte('created_at', todayStartISO)
      .eq('team_specialty', 'Survivor 3 Months')
      .order('rank', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(500);

    // Query 6: SOLO Last 7 Days (King of Covers)
    const { data: data6, error: error6 } = await supabase
      .from('covers_picks')
      .select('*')
      .gte('game_date', todayStr)
      .gte('created_at', todayStartISO)
      .eq('team_specialty', 'Last 7 Days')
      .order('rank', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(1000);

    // Query 7: SOLO Survivor Worst 20
    const { data: data7, error: error7 } = await supabase
      .from('covers_picks')
      .select('*')
      .gte('game_date', todayStr)
      .gte('created_at', todayStartISO)
      .eq('team_specialty', 'Survivor Worst 20')
      .order('rank', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(500);

    // Query 8: SOLO Top 40 Last 20 (Survivor)
    const { data: data8, error: error8 } = await supabase
      .from('covers_picks')
      .select('*')
      .gte('game_date', todayStr)
      .gte('created_at', todayStartISO)
      .eq('team_specialty', 'Top 40 Last 20')
      .order('rank', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(500);

    // Query 9: Historial de Actualizaciones del Bot
    const { data: dataLogs, error: errorLogs } = await supabase
      .from('covers_picks')
      .select('*')
      .eq('team_specialty', 'BOT_UPDATE_LOG')
      .order('created_at', { ascending: false })
      .limit(50);

    if (dataLogs) {
      setBotLogs(dataLogs);
    }

    if (error1) console.error('Error query 1:', error1);
    if (error2) console.error('Error query 2:', error2);
    if (error3) console.error('Error query 3:', error3);
    if (error4) console.error('Error query 4:', error4);
    if (error5) console.error('Error query 5:', error5);
    if (error6) console.error('Error query 6:', error6);
    if (error7) console.error('Error query 7:', error7);
    if (error8) console.error('Error query 8:', error8);
    if (errorLogs) console.error('Error query logs:', errorLogs);

    // Para Futuras Rachas: solo mostrar el lote más reciente (ultimos 2 min del ultimo upload)
    let regPicks = data2 || [];
    if (regPicks.length > 0) {
      const maxTs = new Date(Math.max(...regPicks.map(p => new Date(p.created_at))));
      const cutoff = new Date(maxTs.getTime() - 2 * 60 * 1000);
      regPicks = regPicks.filter(p => new Date(p.created_at) >= cutoff);
    }

    // Para Monthly Top 100: solo mostrar el lote más reciente (ultimos 2 min del ultimo upload)
    let monthlyPicks = data3 || [];
    if (monthlyPicks.length > 0) {
      const maxTs = new Date(Math.max(...monthlyPicks.map(p => new Date(p.created_at))));
      const cutoff = new Date(maxTs.getTime() - 2 * 60 * 1000);
      monthlyPicks = monthlyPicks.filter(p => new Date(p.created_at) >= cutoff);
    }

    const allData = [
      ...(data1 || []),
      ...regPicks,
      ...monthlyPicks,
      ...(data4 || []),
      ...(data5 || []),
      ...(data6 || []),
      ...(data7 || []),
      ...(data8 || [])
    ];

    // Dedup: un usuario puede aparecer en múltiples partidos pero no repetido en el mismo
    const dedup = [];
    const seen = new Set();
    for (const p of allData) {
      const key = `${p.user_name}-${p.matchup}-${p.team_specialty}`;
      if (!seen.has(key)) {
        seen.add(key);
        dedup.push(p);
      }
    }

    // Eliminar "SIN JUGADAS HOY" para usuarios que ya tienen jugadas reales
    const usersWithRealPicks = new Set(
      dedup
        .filter(p => p.matchup !== 'SIN JUGADAS HOY')
        .map(p => `${p.user_name}-${p.team_specialty}`)
    );
    const finalPicks = dedup.filter(p => {
      if (p.matchup === 'SIN JUGADAS HOY') {
        return !usersWithRealPicks.has(`${p.user_name}-${p.team_specialty}`);
      }
      return true;
    });

    setPicks(finalPicks);
    setLoading(false);
  }

  function parseRecord(recordStr) {
    const parts = (recordStr || '').split('-');
    if (parts.length >= 2) {
      return [parseInt(parts[0]) || 0, parseInt(parts[1]) || 0, parseInt(parts[2]) || 0];
    }
    return [0,0,0];
  }

  function parseL20(recordStr) {
    if (!recordStr) return [0, 0];
    const match = recordStr.match(/L20:\s*(\d+)-(\d+)/);
    if (match) {
      return [parseInt(match[1]) || 0, parseInt(match[2]) || 0];
    }
    return [0, 0];
  }

  function parseWorstRecord(recordStr) {
    if (!recordStr) return [0, 0];
    const matchCombined = recordStr.match(/(?:Jul\+Ago:)?\s*(\d+)-(\d+)/i);
    if (matchCombined) {
      return [parseInt(matchCombined[1]) || 0, parseInt(matchCombined[2]) || 0];
    }
    return [0, 0];
  }

  function parseWinRateStats(pick) {
    const rec = pick.record || '';
    const l20Match = rec.match(/L20:\s*(\d+)-(\d+)/);
    if (l20Match) {
      const w = parseInt(l20Match[1], 10);
      const l = parseInt(l20Match[2], 10);
      const tot = w + l;
      return tot > 0 ? { wr: w / tot, w, l, tot } : { wr: 0, w: 0, l: 0, tot: 0 };
    }
    const parts = rec.split('|')[0].trim().split('-');
    if (parts.length >= 2) {
      const w = parseInt(parts[0], 10) || 0;
      const l = parseInt(parts[1], 10) || 0;
      const tot = w + l;
      return tot > 0 ? { wr: w / tot, w, l, tot } : { wr: 0, w: 0, l: 0, tot: 0 };
    }
    return { wr: 0, w: 0, l: 0, tot: 0 };
  }

  function formatCategoryName(specialty) {
    if (specialty === 'Monthly Top 100') return 'Top 100 Mes';
    if (specialty === 'Top 40 Last 20') return 'Top 40 Last 20';
    if (specialty === 'Last 7 Days') return 'Last 7 Days';
    if (specialty === 'Survivor 3 Months') return 'Survivor 3 Meses';
    if (specialty === 'Survivor Contest') return 'Survivor Top 50';
    if (specialty === 'Survivor Regression') return 'Futuras Rachas';
    return specialty || 'General';
  }

  // Normalize pick text to its essential bet type for consensus grouping
  function normalizePick(pickText) {
    const cleaned = (pickText || '').replace(/^\[.*?\]\s*/, '').trim();
    const t = cleaned.toUpperCase();

    const overMatch = t.match(/OVER\s*([\d.]+)/);
    if (overMatch) return `Over ${overMatch[1]}`;
    const underMatch = t.match(/UNDER\s*([\d.]+)/);
    if (underMatch) return `Under ${underMatch[1]}`;
    if (t.includes('OVER')) return 'Over';
    if (t.includes('UNDER')) return 'Under';

    const team = cleaned.trim().split(/\s+/)[0];
    const numMatch = cleaned.match(/([+-]\d+\.?\d*)/);
    if (numMatch) {
      const num = Math.abs(parseFloat(numMatch[1]));
      if (num >= 0.5 && num < 30) {
        return `${team} (${numMatch[1]})`;
      }
    }
    return `${team} (ML)`;
  }

  const isTop10WinRateTab = activeSport === '🎯 TOP 10 CONSENSOS';
  const isSurvivorTab = activeSport === '👑 SURVIVOR TOP 50';
  const isSurvivor3MonthTab = activeSport === '🏆 SURVIVOR (3 MESES)';
  const isTop40Last20Tab = activeSport === '⭐ TOP 40 LAST 20';
  const isKocTab = activeSport === '⭐ Last 7 Days';
  const isRegressionTab = activeSport === '🔥 FUTURAS RACHAS';
  const isMonthlyTop100Tab = activeSport === '📊 TOP 100 MES';
  const isSurvivorWorstTab = activeSport === '💀 SURVIVOR PEOR 20';
  const isLogsTab = activeSport === '📋 HISTORIAL DE ACTUALIZACIONES';
  
  // Compute Master Top 10 Consensus plays across Top Win Rate categories (Monthly Top 100, Last 7 Days, Survivor 3 Months, Regular Experts)
  let masterTop10Consensus = [];
  if (isTop10WinRateTab) {
    const realPicks = picks.filter(p => p.matchup !== 'SIN JUGADAS HOY' && (p.team_specialty === 'Monthly Top 100' || p.team_specialty === 'Last 7 Days' || p.team_specialty === 'Survivor 3 Months' || p.team_specialty === 'Top 40 Last 20'));
    const specGroups = {};

    realPicks.forEach(p => {
      let cleanMatchup = p.matchup.replace(' & Props', '').replace(' Picks', '');
      let cleanPickText = p.pick_text;
      if (cleanPickText.endsWith(p.user_name)) {
        cleanPickText = cleanPickText.slice(0, -p.user_name.length).trim();
      }
      const norm = normalizePick(cleanPickText);
      const key = `[${p.team_specialty}] ${cleanMatchup} | ${norm}`;
      if (!specGroups[key]) specGroups[key] = [];
      specGroups[key].push({ ...p, cleanMatchup, cleanPickText });
    });

    const items = [];
    Object.entries(specGroups).forEach(([key, experts]) => {
      // Deduplicate experts by user_name per card
      const userMap = {};
      experts.forEach(exp => {
        const uName = exp.user_name;
        if (!userMap[uName]) {
          userMap[uName] = exp;
        }
      });

      const uniqueExperts = Object.values(userMap);

      if (uniqueExperts.length >= 2) {
        let totalWins = 0;
        let totalLosses = 0;

        uniqueExperts.forEach(exp => {
          const stats = parseWinRateStats(exp);
          totalWins += stats.w;
          totalLosses += stats.l;
        });

        const totalGames = totalWins + totalLosses;
        const winRate = totalGames > 0 ? (totalWins / totalGames) * 100 : 0;

        items.push({
          key,
          experts: uniqueExperts,
          totalWins,
          totalLosses,
          totalGames,
          winRate,
          expertCount: uniqueExperts.length
        });
      }
    });

    items.sort((a, b) => b.winRate - a.winRate || b.expertCount - a.expertCount || b.totalWins - a.totalWins);
    masterTop10Consensus = items.slice(0, 10);
  }
  
  const filteredPicks = isTop10WinRateTab
    ? picks.filter(p => p.matchup !== 'SIN JUGADAS HOY')
    : isSurvivorTab 
      ? picks.filter(p => p.team_specialty === 'Survivor Contest')
      : isRegressionTab
        ? picks.filter(p => p.team_specialty === 'Survivor Regression')
        : isKocTab
          ? picks.filter(p => p.team_specialty === 'Last 7 Days')
          : isSurvivor3MonthTab
            ? picks.filter(p => p.team_specialty === 'Survivor 3 Months')
            : isTop40Last20Tab
              ? picks.filter(p => p.team_specialty === 'Top 40 Last 20')
              : isMonthlyTop100Tab
                ? picks.filter(p => p.team_specialty === 'Monthly Top 100')
                : isSurvivorWorstTab
                  ? picks.filter(p => p.team_specialty === 'Survivor Worst 20')
                  : picks.filter(p => p.sport.toUpperCase() === activeSport && p.team_specialty !== 'Survivor Contest' && p.team_specialty !== 'Last 7 Days' && p.team_specialty !== 'Survivor 3 Months' && p.team_specialty !== 'Top 40 Last 20' && p.team_specialty !== 'Survivor Regression' && p.team_specialty !== 'Monthly Top 100' && p.team_specialty !== 'Survivor Worst 20');
  
  const latestPicksMap = new Map();
  filteredPicks.forEach(p => {
    const key = `${p.user_name}|${p.matchup}|${p.team_specialty}`;
    const existing = latestPicksMap.get(key);
    if (!existing || new Date(p.created_at) > new Date(existing.created_at)) {
      latestPicksMap.set(key, p);
    }
  });
  const dedupedPicksList = Array.from(latestPicksMap.values());

  const cleanedPicks = dedupedPicksList.map(pick => {
    let cleanMatchup = pick.matchup.replace(' & Props', '').replace(' Picks', '');
    let cleanPickText = pick.pick_text;
    if (cleanPickText.endsWith(pick.user_name)) {
      cleanPickText = cleanPickText.slice(0, -pick.user_name.length).trim();
    }
    return { ...pick, cleanMatchup, cleanPickText };
  });

  const groupedPicks = cleanedPicks.reduce((acc, pick) => {
    if (!acc[pick.cleanMatchup]) acc[pick.cleanMatchup] = [];
    acc[pick.cleanMatchup].push(pick);
    return acc;
  }, {});

  const coincidences = {};
  cleanedPicks.forEach(pick => {
    const normalizedPick = normalizePick(pick.cleanPickText);
    const key = `${pick.cleanMatchup} | ${normalizedPick}`;
    if (!coincidences[key]) coincidences[key] = [];
    if (!coincidences[key].some(p => p.user_name === pick.user_name)) {
      coincidences[key].push(pick);
    }
  });

  const hotPicks = isTop10WinRateTab
    ? masterTop10Consensus.map(item => [item.key, item.experts])
    : Object.entries(coincidences)
        .filter(([key, experts]) => !key.startsWith('SIN JUGADAS HOY') && experts.length >= 2)
        .sort((a, b) => b[1].length - a[1].length);

  function parseRecord(recordStr) {
    const parts = recordStr.split('-');
    if (parts.length >= 2) {
      return [parseInt(parts[0]) || 0, parseInt(parts[1]) || 0, parseInt(parts[2]) || 0];
    }
    return [0,0,0];
  }

  function parseL20(recordStr) {
    if (!recordStr) return [0, 0];
    const match = recordStr.match(/L20:\s*(\d+)-(\d+)/);
    if (match) {
      return [parseInt(match[1]) || 0, parseInt(match[2]) || 0];
    }
    return [0, 0];
  }


  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 font-sans">
      <header className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600 mb-3 flex items-center justify-center gap-3">
          <Trophy size={40} className="text-orange-500" />
          Covers Smart Tracker
        </h1>
        <p className="text-gray-400 text-lg mb-4">Monitoreando las mejores jugadas de los tipsters en racha</p>
      </header>

      <div className="flex justify-center gap-2 mb-10 flex-wrap">
        {sports.map(sport => (
          <button
            key={sport}
            onClick={() => setActiveSport(sport)}
            className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${
              activeSport === sport 
                ? 'bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.5)]' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            } ${sport.includes('SURVIVOR') && !sport.includes('PEOR') && activeSport !== sport ? 'border border-yellow-600/50 text-yellow-500' : ''} ${sport.includes('PEOR') && activeSport !== sport ? 'border border-red-600/50 text-red-500' : ''} ${sport.includes('HISTORIAL') && activeSport !== sport ? 'border border-blue-600/50 text-blue-400' : ''}`}
          >
            {sport}
          </button>
        ))}
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : isLogsTab ? (
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-blue-950/40 to-indigo-900/20 border border-blue-500/40 rounded-2xl p-6 mb-8 shadow-[0_0_30px_rgba(59,130,246,0.15)]">
            <h2 className="text-2xl font-black text-blue-400 mb-2 flex items-center gap-3">
              <History size={28} />
              HISTORIAL DE ACTUALIZACIONES DEL BOT (EN VIVO)
            </h2>
            <p className="text-gray-300 text-sm">
              Registro completo de cada escaneo ejecutado por el bot. Muestra la fecha, hora exacta y cuántas jugadas nuevas se introdujeron en cada concurso/categoría de Covers.
            </p>
          </div>

          {botLogs.length === 0 ? (
            <div className="text-center text-gray-500 mt-10 border border-gray-800 rounded-xl p-10 bg-gray-900/50 max-w-2xl mx-auto">
              <AlertTriangle size={48} className="mx-auto mb-4 text-orange-500/50" />
              <p className="text-xl">Aún no hay registros de actualización almacenados hoy.</p>
              <p className="text-sm text-gray-400 mt-2">Los registros aparecerán aquí cada vez que se ejecute la actualización del bot.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {botLogs.map((log, idx) => {
                let logData = {};
                try {
                  logData = JSON.parse(log.pick_text);
                } catch (e) {
                  logData = { total: log.units || log.rank || 0, time_str: log.record, breakdown: {} };
                }

                const createdDate = new Date(log.created_at);
                const formattedDate = createdDate.toLocaleString('es-ES', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                });

                return (
                  <div key={log.id || idx} className="bg-[#111111] border border-gray-800 hover:border-blue-500/40 rounded-2xl p-5 transition-all shadow-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-800/80 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-500/20 text-green-400 p-2.5 rounded-xl border border-green-500/30">
                          <CheckCircle2 size={24} />
                        </div>
                        <div>
                          <div className="text-lg font-bold text-white flex items-center gap-2">
                            <span>Actualización #{botLogs.length - idx}</span>
                            <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2.5 py-0.5 rounded-full font-semibold">
                              {log.record || 'EXITOSA'}
                            </span>
                          </div>
                          <div className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                            <span>📅 {formattedDate}</span>
                            <span>•</span>
                            <span>🤖 {log.user_name || 'Bot Escáner Covers'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-500/10 border border-blue-500/30 text-blue-300 px-4 py-2 rounded-xl text-left sm:text-right">
                        <div className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Total Jugadas Introducidas</div>
                        <div className="text-xl font-black text-white">{logData.total ?? log.rank ?? 0} picks</div>
                      </div>
                    </div>

                    {logData.breakdown && Object.keys(logData.breakdown).length > 0 && (
                      <div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                          📊 Desglose de Jugadas Introducidas por Categoría:
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                          {Object.entries(logData.breakdown).map(([catName, count]) => (
                            <div key={catName} className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-3 flex justify-between items-center">
                              <span className="text-xs text-gray-300 font-medium truncate">{catName}</span>
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${count > 0 ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-gray-800 text-gray-500'}`}>
                                +{count}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : Object.keys(groupedPicks).length === 0 ? (
        <div className="text-center text-gray-500 mt-10 border border-gray-800 rounded-xl p-10 bg-gray-900/50 max-w-2xl mx-auto">
          <AlertTriangle size={48} className="mx-auto mb-4 text-orange-500/50" />
          <p className="text-xl">No hay jugadas registradas hoy para {activeSport}.</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          {hotPicks.length > 0 && (isTop10WinRateTab || isSurvivorTab || isSurvivor3MonthTab || isTop40Last20Tab || isKocTab || isRegressionTab || isMonthlyTop100Tab || isSurvivorWorstTab) && (
            <div className={`mb-12 border rounded-2xl p-6 ${isSurvivorWorstTab ? 'bg-gradient-to-br from-red-950/60 to-red-600/10 border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.15)]' : isTop10WinRateTab ? 'bg-gradient-to-br from-emerald-900/40 to-teal-600/10 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.15)]' : isSurvivorTab || isSurvivor3MonthTab || isRegressionTab || isMonthlyTop100Tab ? 'bg-gradient-to-br from-yellow-900/40 to-yellow-600/10 border-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,0.15)]' : isKocTab ? 'bg-gradient-to-br from-blue-900/40 to-blue-600/10 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.15)]' : 'bg-gradient-to-br from-orange-900/40 to-red-900/20 border-orange-500/50 shadow-[0_0_30px_rgba(249,115,22,0.15)]'}`}>
              <h2 className={`text-2xl font-black mb-6 flex items-center gap-2 ${isSurvivorWorstTab ? 'text-red-400' : isTop10WinRateTab ? 'text-emerald-400' : isSurvivorTab || isSurvivor3MonthTab || isRegressionTab || isMonthlyTop100Tab || isTop40Last20Tab ? 'text-yellow-400' : isKocTab ? 'text-blue-400' : 'text-orange-400'}`}>
                {isSurvivorWorstTab ? <AlertTriangle size={28} /> : isTop10WinRateTab ? <Trophy size={28} /> : isSurvivorTab || isSurvivor3MonthTab || isRegressionTab || isMonthlyTop100Tab || isTop40Last20Tab ? <Crown size={28} /> : isKocTab ? <Star size={28} /> : <Flame size={28} />} 
                {isSurvivorWorstTab ? 'CONSENSO TOP 20 PEORES SURVIVOR (FADE / REGRESIÓN)' : isTop10WinRateTab ? 'CONSENSO TOP 10 WIN RATE (MEJORES DEL DÍA)' : isSurvivorTab ? 'CONSENSO DE LEYENDAS SURVIVOR' : isSurvivor3MonthTab ? 'CONSENSO LEYENDAS SURVIVOR (3 MESES)' : isTop40Last20Tab ? 'CONSENSO TOP 40 LAST 20 SURVIVOR' : isRegressionTab ? 'FUTURAS RACHAS (POSIBLE REGRESIÓN)' : isMonthlyTop100Tab ? 'CONSENSO TOP 100 DEL MES (L20 WIN RATE)' : isKocTab ? 'CONSENSO TOP 15 (ÚLTIMOS 7 DÍAS)' : 'ALERTA DE CONSENSO TOP 10'}
              </h2>
              <p className="text-gray-300 mb-6 text-sm">
                Las siguientes jugadas tienen a múltiples {isSurvivorWorstTab ? 'concursantes de menor rendimiento (Top 20 Peores)' : isTop10WinRateTab ? 'líderes con mayor % de victorias (Win Rate)' : isSurvivorTab ? 'concursantes del Survivor' : isSurvivor3MonthTab ? 'líderes de Survivor de los últimos 3 meses' : isTop40Last20Tab ? 'líderes de Survivor con mejor récord en los últimos 20 juegos' : isMonthlyTop100Tab ? 'líderes de Survivor del mes actual' : isRegressionTab ? 'jugadores élite con racha baja' : isKocTab ? 'líderes en Unidades Ganadas' : 'tipsters del Top 10'} apostando exactamente a lo mismo:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {hotPicks.map(([key, experts], idx) => {
                  const [matchup, pickText] = key.split(' | ');
                  
                  let totalWins = 0;
                  let totalLosses = 0;
                  let totalStreak = 0;
                  let totalUnits = 0;
                  
                  experts.forEach(exp => {
                    if (isSurvivorTab) {
                      const streakMatch = exp.record.match(/^(\d+)-/);
                      if (streakMatch) totalStreak += parseInt(streakMatch[1], 10);
                    } else if (isSurvivor3MonthTab) {
                      const [w, l] = parseRecord(exp.record);
                      totalWins += w;
                      totalLosses += l;
                    } else if (isMonthlyTop100Tab || isTop40Last20Tab) {
                      const [w, l] = parseL20(exp.record);
                      totalWins += w;
                      totalLosses += l;
                    } else if (isSurvivorWorstTab) {
                      const [w, l] = parseWorstRecord(exp.record);
                      totalWins += w;
                      totalLosses += l;
                    } else if (isTop10WinRateTab) {
                      const stats = parseWinRateStats(exp);
                      totalWins += stats.w;
                      totalLosses += stats.l;
                    } else {
                      const [w, l] = parseRecord(exp.record);
                      totalWins += w;
                      totalLosses += l;
                      totalUnits += exp.units || 0;
                    }
                  });
                  
                  const totalGames = totalWins + totalLosses;
                  const winRate = totalGames > 0 ? ((totalWins / totalGames) * 100).toFixed(1) : 0;

                  return (
                    <div key={idx} className={`bg-black/60 border rounded-xl p-4 flex flex-col justify-between ${isSurvivorWorstTab ? 'border-red-500/30' : isTop10WinRateTab ? 'border-emerald-500/30' : isSurvivorTab || isSurvivor3MonthTab || isRegressionTab || isMonthlyTop100Tab || isTop40Last20Tab ? 'border-yellow-500/30' : isKocTab ? 'border-blue-500/30' : 'border-orange-500/30'}`}>
                      <div>
                        <div className="text-xs text-gray-400 mb-1">{matchup}</div>
                        <div className={`text-lg font-bold text-white mb-3 ${isSurvivorWorstTab ? 'text-red-100' : isTop10WinRateTab ? 'text-emerald-100' : isSurvivorTab || isSurvivor3MonthTab || isRegressionTab || isMonthlyTop100Tab || isTop40Last20Tab ? 'text-yellow-100' : isKocTab ? 'text-blue-100' : 'text-orange-100'}`}>{pickText}</div>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          <div className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${isSurvivorWorstTab ? 'bg-red-500/20 text-red-300 border-red-500/30' : isTop10WinRateTab ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : isSurvivorTab || isSurvivor3MonthTab || isRegressionTab || isMonthlyTop100Tab || isTop40Last20Tab ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' : isKocTab ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'bg-orange-500/20 text-orange-300 border-orange-500/30'}`}>
                            {experts.length} {isSurvivorWorstTab ? 'Peores coinciden' : isTop10WinRateTab ? 'Líderes coinciden' : isSurvivorTab || isSurvivor3MonthTab || isRegressionTab || isMonthlyTop100Tab || isTop40Last20Tab ? 'Superiores coinciden' : 'Líderes coinciden'}
                          </div>
                          
                          {(isKocTab || isSurvivor3MonthTab || isMonthlyTop100Tab || isTop40Last20Tab || isTop10WinRateTab) && (
                            <div className="bg-green-500/20 text-green-400 text-xs font-bold px-3 py-1.5 rounded-lg border border-green-500/30 flex items-center gap-1">
                              <Percent size={12} /> {winRate}% Win Rate
                            </div>
                          )}
                          {isSurvivorTab && (
                            <div className="bg-blue-500/20 text-blue-400 text-xs font-bold px-3 py-1.5 rounded-lg border border-blue-500/30 flex items-center gap-1">
                              🔥 Racha: {totalStreak}
                            </div>
                          )}
                        </div>

                        {(!isSurvivorTab && !isSurvivor3MonthTab && !isRegressionTab && !isMonthlyTop100Tab && !isTop40Last20Tab && !isTop10WinRateTab && !isSurvivorWorstTab) && (
                          <div className="text-xs text-gray-400 mb-3 ml-1 flex flex-col gap-1">
                            <span>(Récord combinado: {totalWins} - {totalLosses})</span>
                            <span className="text-green-400 font-bold">💰 +{totalUnits.toLocaleString()} unidades totales</span>
                          </div>
                        )}
                        {(isSurvivor3MonthTab || isMonthlyTop100Tab || isTop40Last20Tab || isTop10WinRateTab || isSurvivorWorstTab) && (
                          <div className="text-xs text-gray-400 mb-3 ml-1 flex flex-col gap-1">
                            <span>({isMonthlyTop100Tab || isTop40Last20Tab ? 'Récord L20 combinado' : 'Récord combinado'}: {totalWins} - {totalLosses})</span>
                          </div>
                        )}

                        <div className="space-y-2 mb-3 mt-4">
                          {experts.map((exp, eIdx) => (
                            <div key={eIdx} className="text-xs flex justify-between items-center bg-gray-800/50 p-1.5 rounded">
                              <span className={isSurvivorWorstTab ? 'text-red-400 font-bold' : isTop10WinRateTab ? 'text-emerald-400 font-bold' : isSurvivorTab || isSurvivor3MonthTab || isRegressionTab || isMonthlyTop100Tab || isTop40Last20Tab ? 'text-yellow-400 font-bold' : isKocTab ? 'text-blue-400 font-bold' : 'text-blue-400'}>@{exp.user_name}</span>
                              <span className="text-gray-400">
                                {isSurvivorWorstTab ? `Récord: ${exp.record} 💀 (Rank #${exp.rank})` : isTop10WinRateTab ? `WinRate: ${(parseWinRateStats(exp).wr * 100).toFixed(0)}% (${parseWinRateStats(exp).w}-${parseWinRateStats(exp).l}) [${exp.sport}]` : isSurvivorTab ? `Racha de ${exp.record.split('-')[0]} 🏆 (Rank #${exp.rank})` : isSurvivor3MonthTab ? `Récord: ${exp.record} 🏆 (Rank #${exp.rank})` : isMonthlyTop100Tab || isTop40Last20Tab ? `Récord: ${exp.record} 🏆 (Rank #${exp.rank})` : isRegressionTab ? `${exp.record} 📈` : isKocTab ? `${exp.record} | +${exp.units} (Rank #${exp.rank})` : `#${exp.rank} en ${exp.team_specialty}`}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

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
                        <span className={`font-bold text-sm ${isSurvivorWorstTab ? 'text-red-400' : isTop10WinRateTab ? 'text-emerald-400' : isSurvivorTab || isSurvivor3MonthTab || isRegressionTab || isMonthlyTop100Tab || isTop40Last20Tab ? 'text-yellow-400' : isKocTab ? 'text-blue-400' : 'text-blue-400'}`}>@{pick.user_name}</span>
                        <span className={`text-[10px] uppercase tracking-wider bg-gray-700 text-gray-300 px-2 py-1 rounded font-bold ${isSurvivorWorstTab ? 'border border-red-600/30 text-red-300' : isTop10WinRateTab ? 'border border-emerald-600/30 text-emerald-300' : isSurvivorTab || isSurvivor3MonthTab || isRegressionTab || isMonthlyTop100Tab || isTop40Last20Tab ? 'border border-yellow-600/30 text-yellow-300' : isKocTab ? 'border border-blue-600/30 text-blue-300' : ''}`}>
                          {isSurvivorWorstTab ? `Récord: ${pick.record} (Rank #${pick.rank})` : isTop10WinRateTab ? `Win Rate: ${(parseWinRateStats(pick).wr * 100).toFixed(0)}% (${parseWinRateStats(pick).w}-${parseWinRateStats(pick).l})` : isSurvivorTab ? `Racha: ${pick.record.split('-')[0]} (Rank #${pick.rank})` : isSurvivor3MonthTab ? `Récord: ${pick.record} (Rank #${pick.rank})` : isMonthlyTop100Tab || isTop40Last20Tab ? `Récord: ${pick.record} (Rank #${pick.rank})` : isRegressionTab ? `${pick.record}` : isKocTab ? `${pick.record} (Rank #${pick.rank})` : `#${pick.rank} en ${pick.team_specialty}`}
                        </span>
                      </div>
                      <div className="text-base font-bold text-white mb-3 flex items-center justify-between gap-2 flex-wrap">
                        <span>{pick.cleanPickText}</span>
                        {pick.cleanPickText.match(/-\s*([A-Za-z]+\s+\d+)/) && (
                          <span className="text-[11px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                            📅 Juego: {pick.cleanPickText.match(/-\s*([A-Za-z]+\s+\d+)/)[1]}
                          </span>
                        )}
                      </div>
                      {(!isSurvivorTab && !isSurvivor3MonthTab && !isRegressionTab && !isMonthlyTop100Tab && !isTop10WinRateTab && !isSurvivorWorstTab) && (
                        <div className="flex gap-4 text-xs font-medium">
                          <span className="flex items-center gap-1 text-gray-400">
                            <TrendingUp size={14}/> {isKocTab ? pick.record : pick.record}
                          </span>
                          <span className="text-green-400 bg-green-400/10 px-2 py-0.5 rounded">
                            +{pick.units.toLocaleString()} units
                          </span>
                        </div>
                      )}
                      {(isSurvivor3MonthTab || isMonthlyTop100Tab || isTop10WinRateTab || isSurvivorWorstTab || isRegressionTab) && (
                        <div className="flex gap-4 text-xs font-medium">
                          <span className="flex items-center gap-1 text-gray-400">
                            <TrendingUp size={14}/> [{pick.sport}] {pick.record}
                          </span>
                        </div>
                      )}
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
