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

  const currentYear = new Date().getFullYear();

  async function tryFetch(season, params) {
    const r = await fetch(`${API_BASE}/fixtures?league=${league}&season=${season}&${params}`, {
      headers: { "x-apisports-key": API_KEY },
    });
    const data = await r.json();
    return data.response || [];
  }

  async function fetchWithFallback(params) {
    let raw = await tryFetch(currentYear, params);
    if (raw.length === 0) raw = await tryFetch(currentYear - 1, params);
    return raw;
  }

  try {
    const [upcoming, recent] = await Promise.all([
      fetchWithFallback("next=15"),
      fetchWithFallback("last=5"),
    ]);

    const merged = [...recent, ...upcoming];
    const seen = new Set();
    const unique = merged.filter((f) => {
      if (seen.has(f.fixture.id)) return false;
      seen.add(f.fixture.id);
      return true;
    });
    unique.sort((a, b) => new Date(a.fixture.date) - new Date(b.fixture.date));

    const items = unique.map((f) => ({
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
