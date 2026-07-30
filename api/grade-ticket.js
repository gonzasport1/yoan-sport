const SPORT_CONFIG = {
  Soccer: { base: "https://v3.football.api-sports.io", teamsPath: "teams", gamesPath: "fixtures", h2hParam: "h2h" },
  Football: { base: "https://v1.american-football.api-sports.io", teamsPath: "teams", gamesPath: "games", h2hParam: "h2h" },
  Basketball: { base: "https://v1.basketball.api-sports.io", teamsPath: "teams", gamesPath: "games", h2hParam: "h2h" },
  Baseball: { base: "https://v1.baseball.api-sports.io", teamsPath: "teams", gamesPath: "games", h2hParam: "h2h" },
  Hockey: { base: "https://v1.hockey.api-sports.io", teamsPath: "teams", gamesPath: "games", h2hParam: "h2h" },
};

async function findTeamId(base, name, apiKey, teamsPath) {
  const r = await fetch(`${base}/${teamsPath}?search=${encodeURIComponent(name)}`, {
    headers: { "x-apisports-key": apiKey },
  });
  const data = await r.json();
  return data.response?.[0]?.team?.id || data.response?.[0]?.id || null;
}

function splitNames(eventName) {
  const parts = eventName.split(/\s+(?:vs\.?|v\.?|@|-)\s+/i);
  if (parts.length === 2) return [parts[0].trim(), parts[1].trim()];
  return null;
}

async function resolveTeamSport(cfg, names, apiKey) {
  const [id1, id2] = await Promise.all([
    findTeamId(cfg.base, names[0], apiKey, cfg.teamsPath),
    findTeamId(cfg.base, names[1], apiKey, cfg.teamsPath),
  ]);
  if (!id1 || !id2) return { error: "No encontré alguno de los dos equipos." };

  const r = await fetch(`${cfg.base}/${cfg.gamesPath}?${cfg.h2hParam}=${id1}-${id2}&last=5`, {
    headers: { "x-apisports-key": apiKey },
  });
  const data = await r.json();
  const games = data.response || [];
  const finished = games.find((g) => {
    const status = g.fixture?.status?.short || g.status?.short || g.status?.long || g.status;
    return status === "FT" || status === "Finished" || status === "FT " || status === "AOT";
  });
  if (!finished) return { error: "No encontré un partido finalizado reciente entre esos dos equipos." };

  const home = finished.teams?.home;
  const away = finished.teams?.away;
  const homeScore = finished.goals?.home ?? finished.scores?.home?.total ?? finished.scores?.home;
  const awayScore = finished.goals?.away ?? finished.scores?.away?.total ?? finished.scores?.away;

  return { scoreLine: `${home?.name} ${homeScore} - ${awayScore} ${away?.name}`, fixtureId: finished.fixture?.id || finished.id, teamIds: [id1, id2] };
}

async function findFighterId(name, apiKey) {
  const r = await fetch(`https://v1.mma.api-sports.io/fighters?search=${encodeURIComponent(name)}`, {
    headers: { "x-apisports-key": apiKey },
  });
  const data = await r.json();
  return data.response?.[0]?.id || null;
}

async function resolveMMA(names, apiKey) {
  const [id1, id2] = await Promise.all([findFighterId(names[0], apiKey), findFighterId(names[1], apiKey)]);
  if (!id1 || !id2) return { error: "No encontré alguno de los dos peleadores." };

  const r = await fetch(`https://v1.mma.api-sports.io/fights?h2h=${id1}-${id2}`, {
    headers: { "x-apisports-key": apiKey },
  });
  const data = await r.json();
  const fights = data.response || [];
  const finished = fights.find((f) => f.status?.short === "FT" || f.status?.long === "Finished");
  if (!finished) return { error: "No encontré una pelea finalizada reciente entre esos dos peleadores." };

  const winnerName = finished.fighters?.winner?.name || "No especificado";
  return { scoreLine: `Ganador: ${winnerName} — método: ${finished.result?.type || "no especificado"}`, fixtureId: finished.id };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const footballKey = process.env.API_FOOTBALL_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!footballKey || !geminiKey) {
    res.status(500).json({ status: "unknown", reason: "Faltan claves configuradas en el servidor." });
    return;
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  const { eventName, market, sport } = body || {};

  if (!eventName || !market) {
    res.status(400).json({ status: "unknown", reason: "Falta el nombre del evento o el mercado." });
    return;
  }

  const names = splitNames(eventName);
  if (!names) {
    res.status(200).json({ status: "unknown", reason: "No pude separar los dos participantes del nombre del evento." });
    return;
  }

  try {
    let resolved;
    if (sport === "MMA") {
      resolved = await resolveMMA(names, footballKey);
    } else if (SPORT_CONFIG[sport]) {
      resolved = await resolveTeamSport(SPORT_CONFIG[sport], names, footballKey);
    } else {
      res.status(200).json({ status: "unknown", reason: `Todavía no podemos verificar resultados de ${sport || "este deporte"} automáticamente.` });
      return;
    }

    if (resolved.error) {
      res.status(200).json({ status: "unknown", reason: resolved.error });
      return;
    }

    const { GoogleGenAI } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey: geminiKey });

    const prompt = `Sos un verificador de apuestas deportivas. Te doy el resultado REAL y verificado de un evento deportivo (${sport}), y el mercado de una apuesta. Decidí si la apuesta se GANÓ, PERDIÓ, o fue EMPATE/PUSH (nula), basándote solo en los datos reales que te doy — nunca inventes datos.

Resultado real: ${resolved.scoreLine}
Mercado de la apuesta: "${market}"

Respondé ÚNICAMENTE con JSON puro, sin markdown:
{
  "status": "won" | "lost" | "push" | "unknown",
  "reason": "explicación breve de una frase, en español"
}
Usá "unknown" solo si el mercado es imposible de verificar con los datos dados.`;

    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const cleaned = (response.text || "").replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    res.status(200).json({
      status: parsed.status || "unknown",
      reason: parsed.reason || "",
      score: resolved.scoreLine,
    });
  } catch (err) {
    console.error("Error en grade-ticket:", err.message);
    res.status(200).json({ status: "unknown", reason: "No se pudo verificar automáticamente en este momento." });
  }
}
