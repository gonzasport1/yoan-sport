const SPORT_CONFIG = [
  { sport: "Soccer", label: "Fútbol", base: "https://v3.football.api-sports.io", gamesPath: "fixtures" },
  { sport: "Football", label: "Fútbol Americano", base: "https://v1.american-football.api-sports.io", gamesPath: "games" },
  { sport: "Basketball", label: "Básquet", base: "https://v1.basketball.api-sports.io", gamesPath: "games" },
  { sport: "Baseball", label: "Béisbol", base: "https://v1.baseball.api-sports.io", gamesPath: "games" },
  { sport: "Hockey", label: "Hockey", base: "https://v1.hockey.api-sports.io", gamesPath: "games" },
];

export default async function handler(req, res) {
  const apiKey = process.env.API_FOOTBALL_KEY;
  if (!apiKey) {
    res.status(200).json({ groups: [], error: "Falta configurar la key en el servidor." });
    return;
  }

  const results = await Promise.allSettled(
    SPORT_CONFIG.map(async (cfg) => {
      const r = await fetch(`${cfg.base}/${cfg.gamesPath}?live=all`, {
        headers: { "x-apisports-key": apiKey },
      });
      const data = await r.json();
      const games = (data.response || []).map((g) => {
        const homeScore = g.goals?.home ?? g.scores?.home?.total ?? g.scores?.home ?? 0;
        const awayScore = g.goals?.away ?? g.scores?.away?.total ?? g.scores?.away ?? 0;
        const status = g.fixture?.status?.elapsed ? `${g.fixture.status.elapsed}'` : (g.status?.short || g.status?.long || "EN VIVO");
        return {
          id: g.fixture?.id || g.id,
          home: { name: g.teams?.home?.name, logo: g.teams?.home?.logo },
          away: { name: g.teams?.away?.name, logo: g.teams?.away?.logo },
          homeScore,
          awayScore,
          status,
          league: g.league?.name || g.league || "",
        };
      });
      return { sport: cfg.sport, label: cfg.label, games };
    })
  );

  const groups = results
    .map((r) => (r.status === "fulfilled" ? r.value : null))
    .filter((g) => g && g.games.length > 0);

  res.setHeader("Cache-Control", "s-maxage=30");
  res.status(200).json({ groups, tennisNote: "Tenis en vivo todavía no está disponible con la API actual." });
}
