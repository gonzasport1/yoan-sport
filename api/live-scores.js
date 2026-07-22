module.exports = async function handler(req, res) {
  const API_KEY = process.env.API_FOOTBALL_KEY;

  if (!API_KEY) {
    res.status(500).json({ error: "Falta configurar API_FOOTBALL_KEY en Vercel", items: [] });
    return;
  }

  try {
    const [footballRes, baseballRes] = await Promise.allSettled([
      fetch("https://v3.football.api-sports.io/fixtures?live=all", {
        headers: { "x-apisports-key": API_KEY },
      }),
      fetch("https://v1.baseball.api-sports.io/games?live=all", {
        headers: { "x-apisports-key": API_KEY },
      }),
    ]);

    const items = [];

    if (footballRes.status === "fulfilled" && footballRes.value.ok) {
      const data = await footballRes.value.json();
      for (const f of data.response || []) {
        items.push({
          sport: "FÚTBOL",
          league: f.league?.name,
          homeName: f.teams?.home?.name,
          homeLogo: f.teams?.home?.logo,
          awayName: f.teams?.away?.name,
          awayLogo: f.teams?.away?.logo,
          homeScore: f.goals?.home,
          awayScore: f.goals?.away,
          status: f.fixture?.status?.elapsed ? `${f.fixture.status.elapsed}'` : (f.fixture?.status?.short || ""),
        });
      }
    }

    if (baseballRes.status === "fulfilled" && baseballRes.value.ok) {
      const data = await baseballRes.value.json();
      for (const g of data.response || []) {
        items.push({
          sport: "MLB",
          league: g.league?.name,
          homeName: g.teams?.home?.name,
          homeLogo: g.teams?.home?.logo,
          awayName: g.teams?.away?.name,
          awayLogo: g.teams?.away?.logo,
          homeScore: g.scores?.home?.total,
          awayScore: g.scores?.away?.total,
          status: g.status?.long || "",
        });
      }
    }

    res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=60");
    res.status(200).json({ items: items.slice(0, 25) });
  } catch (err) {
    res.status(500).json({ error: err.message, items: [] });
  }
};
