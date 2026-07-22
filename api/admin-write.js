const SUPABASE_URL = "https://xfhcmjfjgbqouehcuphx.supabase.co";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  const { password, action, email, status, settings } = body || {};

  if (!password || !process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    res.status(401).json({ error: "No autorizado" });
    return;
  }

  const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
  if (!SERVICE_KEY) {
    res.status(500).json({ error: "Falta configurar SUPABASE_SERVICE_KEY en Vercel" });
    return;
  }

  const headers = {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
    "Content-Type": "application/json",
  };

  try {
    if (action === "premium-status") {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/premium_subs?email=eq.${encodeURIComponent(email)}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ status }),
      });
      if (!r.ok) throw new Error(await r.text());
      res.status(200).json({ ok: true });
      return;
    }

    if (action === "settings") {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/settings?id=eq.1`, {
        method: "PATCH",
        headers: { ...headers, Prefer: "return=representation" },
        body: JSON.stringify(settings),
      });
      if (!r.ok) throw new Error(await r.text());
      res.status(200).json({ ok: true });
      return;
    }

    res.status(400).json({ error: "Acción desconocida" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
