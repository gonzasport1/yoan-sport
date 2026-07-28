const API_BASE = "https://v3.football.api-sports.io";

export default async function handler(req, res) {
  const { teamId } = req.query;
  if (!teamId) {
    res.status(400).json({ error: "Falta teamId" });
    return;
  }

  const API_KEY = process.env.API_FOOTBALL_KEY;
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

  if (!API_KEY) {
    res.status(500).json({ error: "Falta configurar API_FOOTBALL_KEY en Vercel" });
    return;
  }

  const sbHeaders =
    SUPABASE_URL && SERVICE_KEY
      ? { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, "Content-Type": "application/json" }
      : null;

  // 1. Ver si ya lo tenemos guardado y fresco (menos de 12hs)
  if (sbHeaders) {
    try {
      const cacheRes = await fetch(`${SUPABASE_URL}/rest/v1/team_trends?team_id=eq.${teamId}&select=*`, {
        headers: sbHeaders,
      });
      const cached = await cacheRes.json();
      if (cached && cached[0]) {
        const ageHours = (Date.now() - new Date(cached[0].computed_at).getTime()) / 3600000;
        if (ageHours < 12) {
          res.status(200).json({ ...cached[0].data, cached: true });
          return;
        }
      }
    } catch (err) {
      // si falla la lectura del caché, seguimos y calculamos de nuevo
    }
  }

  // 2. Calcular de nuevo desde la API
  try {
    const fixturesRes = await fetch(`${API_BASE}/fixtures?team=${teamId}&last=8&status=FT`, {
      headers: { "x-apisports-key": API_KEY },
    });
    const fixturesData = await fixturesRes.json();
    const fixtures = fixturesData.response || [];

    const matches = [];
    for (const f of fixtures) {
      const isHome = f.teams.home.id === Number(teamId);
      const goalsFor = isHome ? f.goals.home : f.goals.away;
      const goalsAgainst = isHome ? f.goals.away : f.goals.home;
      let shots = null, corners = null, cards = null;

      try {
        const statsRes = await fetch(`${API_BASE}/fixtures/statistics?fixture=${f.fixture.id}`, {
          headers: { "x-apisports-key": API_KEY },
        });
        const statsData = await statsRes.json();
        const teamStats = (statsData.response || []).find((s) => s.team.id === Number(teamId));
        if (teamStats) {
          const get = (type) => teamStats.statistics.find((s) => s.type === type)?.value;
          shots = get("Shots on Goal");
          corners = get("Corner Kicks");
          const yellow = Number(get("Yellow Cards")) || 0;
          const red = Number(get("Red Cards")) || 0;
          cards = yellow + red;
        }
      } catch (err) {
        // partido sin estadísticas disponibles, seguimos con los demás
      }

      matches.push({
        date: f.fixture.date,
        rival: isHome ? f.teams.away.name : f.teams.home.name,
        home: isHome,
        goalsFor,
        goalsAgainst,
        shots,
        corners,
        cards,
        btts: goalsFor > 0 && goalsAgainst > 0,
        over25: goalsFor + goalsAgainst > 2.5,
      });
    }

    const nums = (arr) => arr.filter((v) => typeof v === "number");
    const avg = (arr) => (arr.length ? Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10 : null);
    const pct = (arr, pred) => (arr.length ? Math.round((arr.filter(pred).length / arr.length) * 100) : null);

    const summary = {
      teamId: Number(teamId),
      teamName: matches.length ? undefined : undefined,
      sampleSize: matches.length,
      avgShotsOnGoal: avg(nums(matches.map((m) => m.shots))),
      avgCorners: avg(nums(matches.map((m) => m.corners))),
      avgCards: avg(nums(matches.map((m) => m.cards))),
      bttsPct: pct(matches, (m) => m.btts),
      over25Pct: pct(matches, (m) => m.over25),
      matches,
    };

    if (sbHeaders) {
      try {
        await fetch(`${SUPABASE_URL}/rest/v1/team_trends`, {
          method: "POST",
          headers: { ...sbHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
          body: JSON.stringify({ team_id: Number(teamId), computed_at: new Date().toISOString(), data: summary }),
        });
      } catch (err) {
        // si falla el guardado del caché no pasa nada, igual devolvemos el resultado
      }
    }

    res.status(200).json({ ...summary, cached: false });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
