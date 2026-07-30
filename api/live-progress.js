const SPORT_CONFIG = {
  Soccer: { base: "https://v3.football.api-sports.io", gamesPath: "fixtures" },
  Football: { base: "https://v1.american-football.api-sports.io", gamesPath: "games" },
  Basketball: { base: "https://v1.basketball.api-sports.io", gamesPath: "games" },
  Baseball: { base: "https://v1.baseball.api-sports.io", gamesPath: "games" },
  Hockey: { base: "https://v1.hockey.api-sports.io", gamesPath: "games" },
};

function parseLine(market) {
  const m = market.match(/(over|under)\s*(\d+(\.\d+)?)/i);
  if (!m) return null;
  return { direction: m[1].toLowerCase(), line: parseFloat(m[2]) };
}

function normalize(s) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export default async function handler(req, res) {
  const apiKey = process.env.API_FOOTBALL_KEY;
  if (!apiKey) {
    res.status(200).json({ available: false, reason: "Falta configurar la key en el servidor." });
    return;
  }

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

  const cfg = SPORT_CONFIG[sport];
  if (!cfg) {
    res.status(200).json({ available: false, reason: `Seguimiento en vivo no disponible para ${sport} todavía.` });
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
    const r = await fetch(`${cfg.base}/${cfg.gamesPath}?live=all`, {
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

    if (!match) {
      res.status(200).json({ available: false, reason: "Ese partido no está en vivo ahora mismo." });
      return;
    }

    const homeScore = match.goals?.home ?? match.scores?.home?.total ?? 0;
    const awayScore = match.goals?.away ?? match.scores?.away?.total ?? 0;
    const current = (Number(homeScore) || 0) + (Number(awayScore) || 0);
    const pct = Math.min(100, Math.round((current / parsed.line) * 100));
    const hit = parsed.direction === "over" ? current > parsed.line : current < parsed.line;

    res.status(200).json({
      available: true,
      current,
      line: parsed.line,
      direction: parsed.direction,
      percent: pct,
      hit,
      status: match.fixture?.status?.elapsed ? `${match.fixture.status.elapsed}'` : (match.status?.short || "EN VIVO"),
    });
  } catch (err) {
    res.status(200).json({ available: false, reason: "No se pudo conectar con los datos en vivo." });
  }
}
