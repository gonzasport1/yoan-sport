/**
 * Módulo de integración de API-Sports en tiempo real.
 * Utiliza proxies configurados en Vite para evitar problemas de CORS.
 */

// Función auxiliar para obtener la fecha local en formato YYYY-MM-DD
function getLocalDateString() {
  const localDate = new Date();
  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, '0');
  const day = String(localDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Genera cuotas decimales lógicas y automáticas basadas en el marcador y estado del partido.
 * @param {string} sportId Identificador del deporte ("futbol", "nba", "baseball", "ufc").
 * @param {string} status Estado del partido ("live" | "scheduled").
 * @param {string} scoreString Marcador actual en formato "Local - Visitante".
 * @returns {Array} Listado de mercados y opciones de cuotas.
 */
export function generateLiveOdds(sportId, status, scoreString) {
  if (status === "scheduled") {
    // Cuotas por defecto balanceadas para partidos programados
    if (sportId === "futbol") {
      return [
        {
          name: "Resultado Final (1X2)",
          options: [
            { selection: "Home (1)", odd: 2.10 },
            { selection: "Empate (X)", odd: 3.30 },
            { selection: "Away (2)", odd: 3.10 }
          ]
        },
        {
          name: "Ambos Equipos Anotan",
          options: [
            { selection: "Sí", odd: 1.80 },
            { selection: "No", odd: 1.95 }
          ]
        }
      ];
    } else if (sportId === "nba") {
      return [
        {
          name: "Ganador del Partido (Moneyline)",
          options: [
            { selection: "Home", odd: 1.85 },
            { selection: "Away", odd: 1.95 }
          ]
        },
        {
          name: "Hándicap de Puntos",
          options: [
            { selection: "Home -2.5", odd: 1.90 },
            { selection: "Away +2.5", odd: 1.90 }
          ]
        }
      ];
    } else if (sportId === "baseball") {
      return [
        {
          name: "Ganador del Encuentro",
          options: [
            { selection: "Home", odd: 1.80 },
            { selection: "Away", odd: 2.00 }
          ]
        }
      ];
    }
  }

  // Si está EN VIVO, calculamos cuotas dinámicas basadas en la puntuación
  let homeScore = 0;
  let awayScore = 0;

  if (scoreString && scoreString.includes("-")) {
    const parts = scoreString.split("-").map(p => parseInt(p.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      homeScore = parts[0];
      awayScore = parts[1];
    }
  }

  const diff = homeScore - awayScore;

  if (sportId === "futbol") {
    let o1 = 2.10, oX = 3.20, o2 = 2.80;
    if (diff > 0) {
      if (diff === 1) { o1 = 1.35; oX = 4.20; o2 = 6.50; }
      else if (diff === 2) { o1 = 1.12; oX = 6.00; o2 = 13.00; }
      else { o1 = 1.02; oX = 9.00; o2 = 26.00; }
    } else if (diff < 0) {
      const absDiff = Math.abs(diff);
      if (absDiff === 1) { o1 = 6.50; oX = 4.20; o2 = 1.35; }
      else if (absDiff === 2) { o1 = 13.00; oX = 6.00; o2 = 1.12; }
      else { o1 = 26.00; oX = 9.00; o2 = 1.02; }
    } else {
      if (homeScore > 0) { o1 = 2.20; oX = 2.90; o2 = 2.80; }
      else { o1 = 2.50; oX = 2.80; o2 = 3.00; }
    }

    return [
      {
        name: "Resultado Final (1X2)",
        options: [
          { selection: "Home (1)", odd: o1 },
          { selection: "Empate (X)", odd: oX },
          { selection: "Away (2)", odd: o2 }
        ]
      },
      {
        name: "Ambos Equipos Anotan",
        options: [
          { selection: "Sí", odd: diff === 0 && homeScore === 0 ? 2.10 : 1.65 },
          { selection: "No", odd: diff === 0 && homeScore === 0 ? 1.65 : 2.10 }
        ]
      }
    ];
  } else if (sportId === "nba") {
    let o1 = 1.90, o2 = 1.90;
    if (diff > 0) {
      if (diff <= 5) { o1 = 1.45; o2 = 2.55; }
      else if (diff <= 12) { o1 = 1.20; o2 = 4.00; }
      else { o1 = 1.05; o2 = 8.50; }
    } else if (diff < 0) {
      const absDiff = Math.abs(diff);
      if (absDiff <= 5) { o1 = 2.55; o2 = 1.45; }
      else if (absDiff <= 12) { o1 = 4.00; o2 = 1.20; }
      else { o1 = 8.50; o2 = 1.05; }
    }

    const hcapVal = diff > 0 ? -Math.max(1.5, diff - 2.5) : Math.max(1.5, Math.abs(diff) - 2.5);
    const formattedHcapHome = hcapVal < 0 ? `${hcapVal.toFixed(1)}` : `+${hcapVal.toFixed(1)}`;
    const formattedHcapAway = hcapVal < 0 ? `+${Math.abs(hcapVal).toFixed(1)}` : `-${Math.abs(hcapVal).toFixed(1)}`;

    return [
      {
        name: "Ganador del Partido (Moneyline)",
        options: [
          { selection: "Home", odd: o1 },
          { selection: "Away", odd: o2 }
        ]
      },
      {
        name: "Hándicap de Puntos",
        options: [
          { selection: `Home ${formattedHcapHome}`, odd: 1.90 },
          { selection: `Away ${formattedHcapAway}`, odd: 1.90 }
        ]
      }
    ];
  } else if (sportId === "baseball") {
    let o1 = 1.85, o2 = 1.95;
    if (diff > 0) {
      o1 = diff === 1 ? 1.50 : 1.25;
      o2 = diff === 1 ? 2.45 : 3.65;
    } else if (diff < 0) {
      const absDiff = Math.abs(diff);
      o1 = absDiff === 1 ? 2.45 : 3.65;
      o2 = absDiff === 1 ? 1.50 : 1.25;
    }
    return [
      {
        name: "Ganador del Encuentro",
        options: [
          { selection: "Home", odd: o1 },
          { selection: "Away", odd: o2 }
        ]
      }
    ];
  }

  return [
    {
      name: "Ganador del Combate",
      options: [
        { selection: "Competidor 1", odd: 1.85 },
        { selection: "Competidor 2", odd: 1.85 }
      ]
    }
  ];
}

/**
 * Obtiene los partidos de hoy desde API-Sports filtrando los terminados e inyectando logos de equipos.
 * @returns {Promise<Array>} Listado unificado de partidos con imágenes de logos.
 */
export async function fetchLiveGamesFromAPI() {
  const gamesList = [];
  const dateStr = getLocalDateString();

  const FOOTBALL_URL = `/api-sports-football/fixtures?date=${dateStr}`;
  const BASKETBALL_URL = `/api-sports-basketball/games?date=${dateStr}`;
  const BASEBALL_URL = `/api-sports-baseball/games?date=${dateStr}`;

  try {
    const [footballRes, basketballRes, baseballRes] = await Promise.allSettled([
      fetch(FOOTBALL_URL),
      fetch(BASKETBALL_URL),
      fetch(BASEBALL_URL)
    ]);

    // Parse Football
    if (footballRes.status === "fulfilled" && footballRes.value.ok) {
      try {
        const data = await footballRes.value.json();
        if (data.response && Array.isArray(data.response)) {
          data.response.forEach((item) => {
            const shortStatus = item.fixture.status.short;
            
            // Ignoramos partidos terminados
            if (["FT", "AET", "PEN", "PST", "CANC", "ABD"].includes(shortStatus)) return;

            const isLive = !["NS", "TBD"].includes(shortStatus);
            const statusType = isLive ? "live" : "scheduled";
            const scoreStr = isLive ? `${item.goals.home ?? 0} - ${item.goals.away ?? 0}` : undefined;
            
            let dateLabel = "Hoy";
            if (item.fixture.date) {
              const gameDate = new Date(item.fixture.date);
              dateLabel = gameDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }

            gamesList.push({
              id: `api-f-${item.fixture.id}`,
              sportId: "futbol",
              homeTeam: item.teams.home.name,
              awayTeam: item.teams.away.name,
              homeLogo: item.teams.home.logo,
              awayLogo: item.teams.away.logo,
              status: statusType,
              score: scoreStr,
              time: isLive ? `${item.fixture.status.elapsed}'` : undefined,
              date: isLive ? "En Directo" : dateLabel,
              isApi: true,
              markets: generateLiveOdds("futbol", statusType, scoreStr)
            });
          });
        }
      } catch (err) {
        console.error("Error parsing football data:", err);
      }
    }

    // Parse Basketball
    if (basketballRes.status === "fulfilled" && basketballRes.value.ok) {
      try {
        const data = await basketballRes.value.json();
        if (data.response && Array.isArray(data.response)) {
          data.response.forEach((item) => {
            const shortStatus = item.status.short;

            // Ignoramos partidos terminados
            if (["FT", "AOT", "POST", "CANC", "SUSP", "ABD"].includes(shortStatus)) return;

            const isLive = !["NS", "TBD"].includes(shortStatus);
            const statusType = isLive ? "live" : "scheduled";
            const scoreStr = isLive ? `${item.scores.home.total ?? 0} - ${item.scores.away.total ?? 0}` : undefined;
            const timeStr = isLive ? `${shortStatus} ${item.status.timer ?? ""}`.trim() : undefined;
            
            let dateLabel = "Hoy";
            if (item.date) {
              const gameDate = new Date(item.date);
              dateLabel = gameDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }

            gamesList.push({
              id: `api-nba-${item.id}`,
              sportId: "nba",
              homeTeam: item.teams.home.name,
              awayTeam: item.teams.away.name,
              homeLogo: item.teams.home.logo,
              awayLogo: item.teams.away.logo,
              status: statusType,
              score: scoreStr,
              time: timeStr,
              date: isLive ? "En Directo" : dateLabel,
              isApi: true,
              markets: generateLiveOdds("nba", statusType, scoreStr)
            });
          });
        }
      } catch (err) {
        console.error("Error parsing basketball data:", err);
      }
    }

    // Parse Baseball
    if (baseballRes.status === "fulfilled" && baseballRes.value.ok) {
      try {
        const data = await baseballRes.value.json();
        if (data.response && Array.isArray(data.response)) {
          data.response.forEach((item) => {
            const shortStatus = item.status.short;

            // Ignoramos partidos terminados
            if (["FT", "POST", "CANC", "SUSP", "ABD"].includes(shortStatus)) return;

            const isLive = !["NS", "TBD"].includes(shortStatus);
            const statusType = isLive ? "live" : "scheduled";
            const scoreStr = isLive ? `${item.scores.home.total ?? 0} - ${item.scores.away.total ?? 0}` : undefined;
            const timeStr = isLive ? shortStatus : undefined;

            let dateLabel = "Hoy";
            if (item.date) {
              const gameDate = new Date(item.date);
              dateLabel = gameDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }

            gamesList.push({
              id: `api-b-${item.id}`,
              sportId: "baseball",
              homeTeam: item.teams.home.name,
              awayTeam: item.teams.away.name,
              homeLogo: item.teams.home.logo,
              awayLogo: item.teams.away.logo,
              status: statusType,
              score: scoreStr,
              time: timeStr,
              date: isLive ? "En Directo" : dateLabel,
              isApi: true,
              markets: generateLiveOdds("baseball", statusType, scoreStr)
            });
          });
        }
      } catch (err) {
        console.error("Error parsing baseball data:", err);
      }
    }
  } catch (error) {
    console.error("Error general en fetchLiveGamesFromAPI:", error);
  }

  return gamesList;
}

/**
 * Combina partidos en vivo de la API con los creados y modificados por el Admin, preservando logos.
 */
export function mergeGamesWithAdminOverrides(apiGames, adminGames, overriddenOdds) {
  const adminIds = new Set(adminGames.map((g) => g.id));
  
  // Filtramos de apiGames los partidos que el administrador haya recreado o eliminado manualmente
  const filteredApiGames = apiGames.filter((g) => !adminIds.has(g.id));
  
  const allGames = [...adminGames, ...filteredApiGames];

  return allGames.map((game) => {
    const updatedMarkets = game.markets.map((market) => {
      const updatedOptions = market.options.map((opt) => {
        const key = `${game.id}-${market.name}-${opt.selection}`;
        if (overriddenOdds && overriddenOdds[key] !== undefined) {
          return {
            ...opt,
            odd: parseFloat(overriddenOdds[key])
          };
        }
        return opt;
      });
      return { ...market, options: updatedOptions };
    });

    return {
      ...game,
      markets: updatedMarkets
    };
  });
}
