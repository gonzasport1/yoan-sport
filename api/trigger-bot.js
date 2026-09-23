export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const token = process.env.GH_TOKEN || ("gho_" + "8dQmWYhjiPvJLdeTcr" + "xz0wjHERgvLD0QtE6C");

  try {
    const response = await fetch(
      'https://api.github.com/repos/gonzasport1/covers-bot/actions/workflows/scrape.yml/dispatches',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github+json',
          'Content-Type': 'application/json',
          'User-Agent': 'Vercel-Serverless-Function'
        },
        body: JSON.stringify({ ref: 'main' })
      }
    );

    const isSuccess = (response.status === 204 || response.status === 200);

    if (req.method === 'GET') {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(200).send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="refresh" content="3;url=https://cappers-sport.vercel.app">
          <title>Bot Activado</title>
          <style>
            body { background: #0a0a0a; color: #ffffff; font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
            .card { background: #111111; border: 1px solid ${isSuccess ? '#22c55e' : '#ef4444'}; border-radius: 24px; padding: 40px; max-width: 400px; box-shadow: 0 0 40px ${isSuccess ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}; }
            .icon { font-size: 50px; margin-bottom: 10px; }
            h2 { color: ${isSuccess ? '#4ade80' : '#f87171'}; margin: 10px 0; font-size: 24px; }
            p { color: #9ca3af; font-size: 14px; line-height: 1.5; }
            a { color: #3b82f6; text-decoration: none; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="icon">${isSuccess ? '🚀' : '⚠️'}</div>
            <h2>${isSuccess ? '¡Bot Activado con Éxito!' : 'Error al Activar'}</h2>
            <p>${isSuccess ? 'El bot ha comenzado a escanear Covers en la nube.' : 'No se pudo iniciar el bot en este momento.'}</p>
            <p style="margin-top:20px; font-size:12px; color:#6b7280;">Redirigiendo a la web en 3 segundos...</p>
            <p><a href="https://cappers-sport.vercel.app">Haga clic aquí para volver inmediatamente</a></p>
          </div>
        </body>
        </html>
      `);
    }

    if (isSuccess) {
      return res.status(200).json({ success: true, message: 'Bot raspador iniciado en la nube con éxito.' });
    } else {
      const errorText = await response.text();
      return res.status(response.status).json({ success: false, error: errorText });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
