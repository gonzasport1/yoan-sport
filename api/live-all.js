const ESPN_SPORTS = [
  { key: "NFL", label: "NFL", sport: "football", league: "nfl" },
  { key: "NCAAF", label: "NCAAF (Universitario)", sport: "football", league: "college-football" },
  { key: "NBA", label: "NBA", sport: "basketball", league: "nba" },
  { key: "NCAAB", label: "NCAAB (Universitario)", sport: "basketball", league: "mens-college-basketball" },
  { key: "MLB", label: "MLB", sport: "baseball", league: "mlb" },
  { key: "NHL", label: "NHL", sport: "hockey", league: "nhl" },
  { key: "Tennis_ATP", label: "Tenis (ATP)", sport: "tennis", league: "atp" },
  { key: "Tennis_WTA", label: "Tenis (WTA)", sport: "tennis", league: "wta" },
  { key: "MMA", label: "UFC / MMA", sport: "mma", league: "ufc" },
];

async function fetchEspnLive(sport, league) {
  const r = await fetch(`https://site.api.espn.com/apis/site/v2/sports/${sport}/${league}/scoreboard`);
  if (!r.ok) return { games: [], error: `HTTP ${r.status}` };
  const data = await r.json();
  const events = data.events || [];
  const live = events.filter((e) => e.status?.type?.state === "in");
  const games = live.map((e) => {
    const comp = e.competitions?.[0];
    const home = comp?.competitors?.find((c) => c.homeAway === "home");
    const away = comp?.competitors?.find((c) => c.homeAway === "away");
    return {
      id: e.id,
      home: { name: home?.team?.displayName || home?.team?.shortDisplayName || "Local", logo: home?.team?.logo },
      away: { name: away?.team?.displayName || away?.team?.shortDisplayName || "Visitante", logo: away?.team?.logo },
      homeScore: home?.score ?? 0,
      awayScore: away?.score ?? 0,
      status: e.status?.type?.shortDetail || e.status?.type?.description || "EN VIVO",
      league: data.leagues?.[0]?.name || league.toUpperCase(),
    };
  });
  return { games, rawCount: events.length };
}

async function fetchSoccerLive(apiKey) {
  const r = await fetch("https://v3.football.api-sports.io/fixtures?live=all", {
    headers: { "x-apisports-key": apiKey },
  });
  const data = await r.json();
  const games = (data.response || []).map((g) => ({
    id: g.fixture?.id,
    home: { name: g.teams?.home?.name, logo: g.teams?.home?.logo },
    away: { name: g.teams?.away?.name, logo: g.teams?.away?.logo },
    homeScore: g.goals?.home ?? 0,
    awayScore: g.goals?.away ?? 0,
    status: g.fixture?.status?.elapsed ? `${g.fixture.status.elapsed}'` : (g.fixture?.status?.short || "EN VIVO"),
    league: g.league?.name || "",
  }));
  return { games, rawCount: (data.response || []).length };
}

export default async function handler(req, res) {
  const apiKey = process.env.API_FOOTBALL_KEY;

  const espnResults = await Promise.allSettled(
    ESPN_SPORTS.map(async (cfg) => {
      const r = await fetchEspnLive(cfg.sport, cfg.league);
      return { sport: cfg.key, label: cfg.label, games: r.games, rawCount: r.rawCount, error: r.error };
    })
  );

  let soccerResult = { sport: "Soccer", label: "Fútbol", games: [], rawCount: 0 };
  if (apiKey) {
    try {
      const r = await fetchSoccerLive(apiKey);
      soccerResult = { sport: "Soccer", label: "Fútbol", games: r.games, rawCount: r.rawCount };
    } catch (err) {
      soccerResult.error = err.message;
    }
  }

  const all = [
    soccerResult,
    ...espnResults.map((r) => (r.status === "fulfilled" ? r.value : { sport: "?", label: "?", games: [], error: String(r.reason) })),
  ];

  const groups = all.filter((g) => g.games && g.games.length > 0);
  const debug = all.map((g) => ({ sport: g.sport, rawCount: g.rawCount, error: g.error }));

  res.setHeader("Cache-Control", "s-maxage=30");
  res.status(200).json({ groups, debug });
}
