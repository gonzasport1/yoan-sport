const API_BASE = "https://v3.football.api-sports.io";

export default async function handler(req, res) {
  const API_KEY = process.env.API_FOOTBALL_KEY;
  if (!API_KEY) {
    res.status(500).json({ error: "Falta configurar API_FOOTBALL_KEY en Vercel", items: [] });
    return;
  }

  const { league } = req.query;
  if (!league) {
    res.status(400).json({ error: "Falta el parámetro league", items: [] });
    return;
  }

  const season = new Date().getFullYear();

  try {
    const r = await fetch(`${API_BASE}/fixtures?league=${league}&season=${season}&next=20`, {
      headers: { "x-apisports-key": API_KEY },
    });
    const data = await r.json();

    const items = (data.response || []).map((f) => ({
      id: f.fixture.id,
      date: f.fixture.date,
      status: f.fixture.status?.short,
      league: f.league?.name,
      home: { id: f.teams.home.id, name: f.teams.home.name, logo: f.teams.home.logo },
      away: { id: f.teams.away.id, name: f.teams.away.name, logo: f.teams.away.logo },
    }));

    res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate=3600");
    res.status(200).json({ items });
  } catch (err) {
    res.status(500).json({ error: err.message, items: [] });
  }
}
