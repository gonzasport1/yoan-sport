const ESPN_MAP = {
  Football: { sport: "football", league: "nfl" },
  Basketball: { sport: "basketball", league: "nba" },
  Baseball: { sport: "baseball", league: "mlb" },
  Hockey: { sport: "hockey", league: "nhl" },
};

function parseLine(market) {
  const m = market.match(/(over|under)\s*(\d+(\.\d+)?)/i);
  if (!m) return null;
  return { direction: m[1].toLowerCase(), line: parseFloat(m[2]) };
}

function normalize(s) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

async function findEspnMatch(sport, league, teamNames) {
  const r = await fetch(`https://site.api.espn.com/apis/site/v2/sports/${sport}/${league}/scoreboard`);
  const data = await r.json();
  const events = data.events || [];
  const live = events.filter((e) => e.status?.type?.state === "in");

  for (const e of live) {
    const comp = e.competitions?.[0];
    const home = comp?.competitors?.find((c) => c.homeAway === "home");
    const away = comp?.competitors?.find((c) => c.homeAway === "away");
    const homeName = normalize(home?.team?.displayName || "");
    const awayName = normalize(away?.team?.displayName || "");
    const matches = teamNames.some((t) => homeName.includes(t) || t.includes(homeName)) &&
                     teamNames.some((t) => awayName.includes(t) || t.includes(awayName));
    if (matches) {
      return {
        homeScore: Number(home?.score) || 0,
        awayScore: Number(away?.score) || 0,
        status: e.status?.type?.shortDetail || e.status?.type?.description || "EN VIVO",
      };
    }
  }
  return null;
}

async function findSoccerMatch(apiKey, teamNames) {
  const r = await fetch("https://v3.football.api-sports.io/fixtures?live=all", {
    headers: { "x-apisports-key": apiKey },
  });
  const data = await r.json();
  const games = data.response || [];
  const match = games.find((g) => {
    const home = normalize(g.teams?.home?.name || "");
    const away = normalize(g.teams?.away?.name || "");
    return teamNames.some((t) => home.includes(t) || t.includes(home)) &&
           teamNames.some((t) => away.includes(t) || t.includes(away));
  });
  if (!match) return null;
  return {
    homeScore: match.goals?.home ?? 0,
    awayScore: match.goals?.away ?? 0,
    status: match.fixture?.status?.elapsed ? `${match.fixture.status.elapsed}'` : (match.fixture?.status?.short || "EN VIVO"),
  };
}

export default async function handler(req, res) {
  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  const { eventName, sport, market } = body || {};

  if (!eventName || !market || !sport) {
    res.status(200).json({ available: false, reason: "Faltan datos del ticket." });
    return;
  }

  if (/player|jugador/i.test(market)) {
    res.status(200).json({ available: false, reason: "El seguimiento en vivo de props de jugador todavía no está disponible." });
    return;
  }

  const parsed = parseLine(market);
  if (!parsed) {
    res.status(200).json({ available: false, reason: "No pude identificar una línea numérica (Over/Under) en el mercado." });
    return;
  }

  const teamNames = eventName.split(/\s+(?:vs\.?|v\.?|@|-)\s+/i).map((s) => normalize(s.trim()));
  if (teamNames.length !== 2) {
    res.status(200).json({ available: false, reason: "No pude identificar los dos equipos del evento." });
    return;
  }

  try {
    let found = null;

    if (sport === "Soccer") {
      const apiKey = process.env.API_FOOTBALL_KEY;
      if (apiKey) found = await findSoccerMatch(apiKey, teamNames);
    } else if (ESPN_MAP[sport]) {
      const cfg = ESPN_MAP[sport];
      found = await findEspnMatch(cfg.sport, cfg.league, teamNames);
    } else {
      res.status(200).json({ available: false, reason: `Seguimiento en vivo no disponible para ${sport} todavía.` });
      return;
    }

    if (!found) {
      res.status(200).json({ available: false, reason: "Ese partido no está en vivo ahora mismo." });
      return;
    }

    const current = found.homeScore + found.awayScore;
    const pct = Math.min(100, Math.round((current / parsed.line) * 100));
    const hit = parsed.direction === "over" ? current > parsed.line : current < parsed.line;

    res.status(200).json({
      available: true,
      current,
      line: parsed.line,
      direction: parsed.direction,
      percent: pct,
      hit,
      status: found.status,
    });
  } catch (err) {
    res.status(200).json({ available: false, reason: "No se pudo conectar con los datos en vivo." });
  }
}
