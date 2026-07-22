import React, { useState, useEffect } from "react";
import { Search, CreditCard, Upload, ArrowLeft, Lock, LogOut, Mail, CheckCircle2, Clock } from "lucide-react";

const GMAIL_RE = /^[^\s@]+@gmail\.com$/i;
const BRAND = "Yoan Sport";

// ---- Supabase connection (REST API via fetch, no SDK needed) ----
const SUPABASE_URL = "https://xfhcmjfjgbqouehcuphx.supabase.co";
const SUPABASE_KEY = "sb_publishable_4mmk8JZJLGNVj3Dl_FbDwg_e3z_X86a";

async function sb(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  if (!res.ok) throw new Error(await res.text());
  if (res.status === 204) return null;
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

const getSettings = () => sb("settings?id=eq.1&select=*").then((r) => r?.[0]);
const updateSettings = (patch) =>
  sb("settings?id=eq.1", { method: "PATCH", headers: { Prefer: "return=representation" }, body: JSON.stringify(patch) });

const getFreeSubs = () => sb("free_subs?select=*&order=created_at.desc");
const insertFreeSub = (email) =>
  sb("free_subs", { method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify({ email }) });

const getPremiumSubs = () => sb("premium_subs?select=*&order=created_at.desc");
const insertPremiumSub = (entry) =>
  sb("premium_subs", { method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify(entry) });
const updatePremiumStatus = (email, status) =>
  sb(`premium_subs?email=eq.${encodeURIComponent(email)}`, { method: "PATCH", body: JSON.stringify({ status }) });
const searchPremiumByEmail = (email) => sb(`premium_subs?email=eq.${encodeURIComponent(email)}&select=*&order=created_at.desc`);

const GLOBAL_CSS = `
  :root{
    --bg: #06090b;
    --bg-2: #0b1214;
    --teal-bright: #12d6c4;
    --gold: #e8b649;
    --gold-dim: #a9843a;
    --text: #eef4f2;
    --muted: #7f9490;
    --line: rgba(18,214,196,0.14);
    --card: rgba(255,255,255,0.025);
  }
  .ln-root{
    background:
      radial-gradient(ellipse 900px 500px at 20% -10%, rgba(18,214,196,0.10), transparent 60%),
      radial-gradient(ellipse 700px 500px at 100% 10%, rgba(232,182,73,0.07), transparent 55%),
      linear-gradient(180deg, var(--bg) 0%, var(--bg-2) 100%);
    color:var(--text);
    font-family:'Inter', sans-serif;
    min-height:100vh;
    position:relative;
  }
  .ln-root::before{
    content:"";
    position:fixed; inset:0;
    background-image:
      linear-gradient(rgba(18,214,196,0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(18,214,196,0.035) 1px, transparent 1px);
    background-size: 42px 42px;
    mask-image: radial-gradient(ellipse 100% 60% at 50% 0%, black 20%, transparent 75%);
    pointer-events:none;
  }
  .ticker{ position:relative; z-index:2; border-bottom:1px solid var(--line); background:rgba(0,0,0,0.35); overflow:hidden; white-space:nowrap; padding:9px 0; }
  .ticker-track{ display:inline-flex; animation: scroll-left 32s linear infinite; }
  .ticker span{ font-family:'JetBrains Mono', monospace; font-size:12px; color:var(--muted); padding:0 28px; letter-spacing:0.5px; display:inline-flex; align-items:center; gap:8px; }
  .ticker span b{ color:var(--teal-bright); font-weight:700; }
  .up{color:#5be89a;} .down{color:#ff6b6b;}
  .ticker-logo{ width:14px; height:14px; object-fit:contain; vertical-align:middle; margin:0 3px; border-radius:2px; }
  @keyframes scroll-left{ 0%{transform:translateX(0);} 100%{transform:translateX(-50%);} }
  nav.ln-nav{ position:relative; z-index:2; display:flex; justify-content:space-between; align-items:center; padding:22px 5vw 0; max-width:1180px; margin:0 auto; }
  .nav-mark{ font-family:'Bebas Neue', sans-serif; font-size:20px; letter-spacing:3px; color:var(--text); text-transform:uppercase; }
  .nav-status{ font-family:'JetBrains Mono', monospace; font-size:11px; color:var(--muted); display:flex; align-items:center; gap:7px; }
  .dot-live{ width:6px;height:6px;border-radius:50%; background:#5be89a; box-shadow:0 0 8px #5be89a; animation:pulse 1.8s ease-in-out infinite; }
  @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.35;}}
  header.hero{ position:relative; z-index:2; max-width:1180px; margin:0 auto; padding:70px 5vw 40px; text-align:center; }
  .eyebrow{ font-family:'JetBrains Mono', monospace; font-size:11px; letter-spacing:4px; color:var(--gold); text-transform:uppercase; margin-bottom:18px; display:inline-flex; align-items:center; gap:10px; }
  .eyebrow::before, .eyebrow::after{ content:""; width:22px; height:1px; background:var(--gold-dim); }
  h1.wordmark{ font-family:'Bebas Neue', sans-serif; font-size: clamp(40px, 9vw, 76px); line-height:1; letter-spacing:3px; text-transform:uppercase; background:linear-gradient(180deg, #ffffff 10%, #b9c9c6 55%, #6f8a85 100%); -webkit-background-clip:text; background-clip:text; color:transparent; filter:drop-shadow(0 0 40px rgba(18,214,196,0.18)); margin-bottom:6px; }
  .subline{ font-family:'JetBrains Mono', monospace; font-size:13px; letter-spacing:3.5px; color:var(--teal-bright); text-transform:uppercase; }
  .hero-desc{ max-width:480px; margin:22px auto 0; color:var(--muted); font-size:14.5px; line-height:1.65; }
  .scoreboard{ position:relative; z-index:2; max-width:920px; margin:38px auto 10px; padding:0 5vw; display:grid; grid-template-columns:repeat(4,1fr); gap:1px; background:var(--line); border:1px solid var(--line); border-radius:10px; overflow:hidden; }
  .scoreboard .cell{ background:rgba(6,9,11,0.85); padding:16px 10px; text-align:center; }
  .scoreboard .cell .num{ font-family:'Bebas Neue', sans-serif; font-size:26px; color:var(--text); letter-spacing:1px; }
  .scoreboard .cell .lbl{ font-family:'JetBrains Mono', monospace; font-size:9.5px; color:var(--muted); text-transform:uppercase; letter-spacing:1.5px; margin-top:3px; }
  main.ln-main{ position:relative; z-index:2; max-width:960px; margin:56px auto 0; padding:0 5vw 90px; display:grid; grid-template-columns: 1fr 1.15fr; gap:22px; }
  @media (max-width: 760px){ main.ln-main{grid-template-columns:1fr;} }
  .card{ background:var(--card); border:1px solid rgba(255,255,255,0.07); border-radius:18px; padding:30px 28px; position:relative; overflow:hidden; backdrop-filter:blur(16px); display:flex; flex-direction:column; }
  .card .icon{ width:38px; height:38px; display:flex; align-items:center; justify-content:center; margin-bottom:18px; }
  .card h2{ font-family:'Bebas Neue', sans-serif; font-size:26px; letter-spacing:1.5px; margin-bottom:10px; }
  .card p.desc{ color:var(--muted); font-size:13.5px; line-height:1.6; margin-bottom:24px; flex-grow:1; }
  .ln-input{ width:100%; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.12); border-radius:9px; padding:12px 14px; color:var(--text); font-family:'Inter', sans-serif; font-size:13.5px; margin-bottom:12px; outline:none; transition:border-color .2s; }
  .ln-input:focus{border-color:var(--teal-bright);}
  .ln-input::placeholder{color:var(--muted);}
  .btn{ display:inline-flex; align-items:center; justify-content:center; gap:8px; padding:13px 20px; border-radius:9px; font-family:'Inter', sans-serif; font-weight:700; font-size:13.5px; letter-spacing:0.3px; border:none; cursor:pointer; transition: transform .15s ease, box-shadow .15s ease; width:100%; }
  .btn:hover{transform:translateY(-1px);}
  .btn:disabled{opacity:0.5; cursor:not-allowed; transform:none;}
  .btn.ghost{ background:transparent; border:1px solid rgba(255,255,255,0.18); color:var(--text); }
  .btn.ghost:hover{ border-color:var(--teal-bright); color:var(--teal-bright); }
  .card.premium{ background:linear-gradient(160deg, rgba(18,214,196,0.07), rgba(232,182,73,0.04)); border:1px solid rgba(18,214,196,0.35); box-shadow: 0 0 0 1px rgba(18,214,196,0.06) inset, 0 20px 60px -20px rgba(18,214,196,0.25); }
  .card.premium::before{ content:""; position:absolute; top:-40%; right:-30%; width:280px; height:280px; background:radial-gradient(circle, rgba(232,182,73,0.18), transparent 70%); pointer-events:none; }
  .premium-badge{ position:absolute; top:22px; right:22px; font-family:'JetBrains Mono', monospace; font-size:10px; letter-spacing:2px; color:var(--bg); background:linear-gradient(120deg, var(--gold), #ffd97a); padding:5px 10px; border-radius:20px; font-weight:700; }
  .card.premium h2{ background:linear-gradient(90deg, #fff, var(--teal-bright)); -webkit-background-clip:text; background-clip:text; color:transparent; }
  .price-row{ display:flex; align-items:baseline; gap:6px; margin-bottom:20px; }
  .price-row .price{ font-family:'Bebas Neue', sans-serif; font-size:38px; color:var(--gold); letter-spacing:1px; }
  .price-row .per{ font-size:12px; color:var(--muted); font-family:'JetBrains Mono', monospace; }
  .feature-list{ list-style:none; margin-bottom:24px; display:flex; flex-direction:column; gap:9px; padding:0; }
  .feature-list li{ font-size:13px; color:var(--text); display:flex; align-items:center; gap:9px; }
  .btn.solid{ background:linear-gradient(120deg, var(--teal-bright), #0ea89b); color:#04211d; box-shadow:0 8px 24px -8px rgba(18,214,196,0.5); }
  .btn.solid:hover{ box-shadow:0 10px 30px -8px rgba(18,214,196,0.7); }
  .pay-note{ margin-top:12px; font-size:11px; color:var(--muted); text-align:center; font-family:'JetBrains Mono', monospace; }
  .under-links{ position:relative; z-index:2; text-align:center; max-width:960px; margin:0 auto; padding:0 5vw 50px; display:flex; flex-direction:column; align-items:center; gap:16px; }
  .link-row{ display:inline-flex; align-items:center; gap:8px; font-size:13px; color:var(--muted); cursor:pointer; transition:color .15s; border:1px solid transparent; padding:8px 14px; border-radius:8px; background:none; }
  .link-row:hover{ color:var(--teal-bright); border-color:var(--line); }
  footer.site-footer{ position:relative; z-index:2; border-top:1px solid var(--line); padding:22px 5vw; display:flex; justify-content:space-between; align-items:center; max-width:1180px; margin:0 auto; font-family:'JetBrains Mono', monospace; font-size:10.5px; color:var(--muted); }
  footer.site-footer button{ background:none; border:none; color:var(--muted); cursor:pointer; font-family:'JetBrains Mono', monospace; font-size:10.5px; letter-spacing:1px; }
  footer.site-footer button:hover{ color:var(--gold); }
  .panel{ max-width:820px; margin:0 auto; padding:60px 5vw; position:relative; z-index:2; }
  .field-label{ font-family:'JetBrains Mono', monospace; font-size:10px; letter-spacing:1.5px; color:var(--muted); text-transform:uppercase; margin-bottom:6px; display:block; }
  .box{ background:var(--card); border:1px solid rgba(255,255,255,0.07); border-radius:14px; padding:20px; margin-bottom:18px; }
  .row-between{ display:flex; align-items:center; justify-content:space-between; gap:10px; }
  .pill-approve{ font-size:11px; background:rgba(91,232,154,0.12); color:#5be89a; border:1px solid rgba(91,232,154,0.3); padding:6px 12px; border-radius:20px; cursor:pointer; }
  .pill-reject{ font-size:11px; background:rgba(255,107,107,0.12); color:#ff6b6b; border:1px solid rgba(255,107,107,0.3); padding:6px 12px; border-radius:20px; cursor:pointer; }
  .banner-error{ background:rgba(255,107,107,0.1); border:1px solid rgba(255,107,107,0.3); color:#ff9b9b; font-size:12px; padding:10px 14px; border-radius:10px; margin-bottom:16px; }
  .corner-summary{ position:fixed; bottom:20px; right:20px; z-index:50; width:270px; background:rgba(8,12,14,0.92); backdrop-filter:blur(14px); border:1px solid rgba(18,214,196,0.25); border-radius:14px; padding:14px 16px; box-shadow:0 12px 40px -10px rgba(0,0,0,0.6); }
  .corner-summary-head{ font-family:'JetBrains Mono', monospace; font-size:10px; letter-spacing:1.5px; color:var(--teal-bright); text-transform:uppercase; display:flex; align-items:center; gap:6px; margin-bottom:10px; }
  .corner-summary-row{ display:flex; align-items:flex-start; gap:8px; margin-bottom:8px; }
  .corner-summary-row:last-child{ margin-bottom:0; }
  .corner-summary-tag{ font-size:9px; font-weight:700; letter-spacing:1px; padding:3px 6px; border-radius:5px; flex-shrink:0; margin-top:1px; }
  .corner-summary-tag.free{ background:rgba(255,255,255,0.08); color:var(--muted); }
  .corner-summary-tag.premium{ background:rgba(232,182,73,0.15); color:var(--gold); }
  .corner-summary-text{ font-size:12px; color:var(--text); line-height:1.4; }
  .corner-summary-text.locked{ color:var(--muted); font-style:italic; }
  @media (max-width: 640px){ .corner-summary{ left:16px; right:16px; width:auto; bottom:16px; } }
`;

function Check() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--teal-bright)", flexShrink: 0 }}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function StarIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2 3 6v6c0 5.25 3.75 9.75 9 11 5.25-1.25 9-5.75 9-11V6l-9-4z" />
    </svg>
  );
}

export default function App() {
  const [freePick, setFreePick] = useState("Cargando...");
  const [premiumPick, setPremiumPick] = useState("Cargando...");
  const [zelleInfo, setZelleInfo] = useState({ handle: "", name: "", price: "" });
  const [winRate, setWinRate] = useState("62%");
  const [baseMembers, setBaseMembers] = useState(20);
  const [freeSubs, setFreeSubs] = useState([]);
  const [premiumSubs, setPremiumSubs] = useState([]);
  const [view, setView] = useState("public");
  const [dbError, setDbError] = useState("");
  const [loaded, setLoaded] = useState(false);

  async function loadAll() {
    try {
      const [settings, free, premium] = await Promise.all([getSettings(), getFreeSubs(), getPremiumSubs()]);
      if (settings) {
        setFreePick(settings.free_pick);
        setPremiumPick(settings.premium_pick);
        setZelleInfo({ name: settings.zelle_name, handle: settings.zelle_handle, price: settings.zelle_price });
        if (settings.win_rate) setWinRate(settings.win_rate);
        if (settings.base_members != null) setBaseMembers(settings.base_members);
      }
      setFreeSubs(free || []);
      setPremiumSubs(premium || []);
      setDbError("");
    } catch (err) {
      setDbError(`No se pudo conectar con la base de datos: ${err.message || err}`);
    } finally {
      setLoaded(true);
    }
  }

  useEffect(() => { loadAll(); }, []);
  useEffect(() => { if (view === "admin") loadAll(); }, [view]);

  return (
    <div className="ln-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');
        ${GLOBAL_CSS}
      `}</style>

      {view === "public" && (
        <PublicSite
          freePick={freePick}
          premiumPick={premiumPick}
          zelleInfo={zelleInfo}
          dbError={dbError}
          winRate={winRate}
          membersCount={baseMembers + freeSubs.length + premiumSubs.filter((p) => p.status === "approved").length}
          onFreeRegistered={(email) => setFreeSubs((s) => [{ email }, ...s])}
          onPremiumRegistered={(entry) => setPremiumSubs((s) => [{ ...entry, status: "pending" }, ...s])}
          goAdmin={() => setView("admin-login")}
        />
      )}
      {view === "admin-login" && <AdminLogin onBack={() => setView("public")} onSuccess={() => setView("admin")} />}
      {view === "admin" && (
        <AdminPanel
          loaded={loaded}
          dbError={dbError}
          freePick={freePick} setFreePick={setFreePick}
          premiumPick={premiumPick} setPremiumPick={setPremiumPick}
          zelleInfo={zelleInfo} setZelleInfo={setZelleInfo}
          winRate={winRate} setWinRate={setWinRate}
          baseMembers={baseMembers} setBaseMembers={setBaseMembers}
          freeSubs={freeSubs} premiumSubs={premiumSubs}
          onApprove={async (email) => { await updatePremiumStatus(email, "approved"); setPremiumSubs((s) => s.map((p) => (p.email === email ? { ...p, status: "approved" } : p))); }}
          onReject={async (email) => { await updatePremiumStatus(email, "rejected"); setPremiumSubs((s) => s.map((p) => (p.email === email ? { ...p, status: "rejected" } : p))); }}
          onExit={() => setView("public")}
        />
      )}
    </div>
  );
}

function Ticker() {
  const [items, setItems] = useState([]);
  const [triedLoad, setTriedLoad] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch("/api/live-scores");
        const data = await res.json();
        if (active) setItems(Array.isArray(data.items) ? data.items : []);
      } catch (err) {
        // se ignora: si falla, se muestra el ticker de ejemplo más abajo
      } finally {
        if (active) setTriedLoad(true);
      }
    }
    load();
    const id = setInterval(load, 60000); // se actualiza cada 60s
    return () => { active = false; clearInterval(id); };
  }, []);

  if (items.length > 0) {
    const doubled = [...items, ...items];
    return (
      <div className="ticker">
        <div className="ticker-track">
          {doubled.map((it, i) => (
            <span key={i}>
              <b>{it.sport}</b>
              {it.homeLogo && <img src={it.homeLogo} alt="" className="ticker-logo" />}
              {it.homeName} {it.homeScore ?? "-"}—{it.awayScore ?? "-"} {it.awayName}
              {it.awayLogo && <img src={it.awayLogo} alt="" className="ticker-logo" />}
              <span className="up">{it.status}</span>
            </span>
          ))}
        </div>
      </div>
    );
  }

  // Fallback (mientras carga, o si no hay partidos en vivo ahora mismo)
  const demo = [
    { tag: "NRFI", label: "LAD @ SF", val: "62%", cls: "up" },
    { tag: "F5", label: "NYY -1.5", val: "58%", cls: "up" },
    { tag: "TT", label: "ATL o4.5", val: "44%", cls: "down" },
    { tag: "NRFI", label: "HOU @ SEA", val: "67%", cls: "up" },
    { tag: "MUNDIAL", label: "ESP vs FRA — xGA 1.2", val: "71%", cls: "up" },
  ];
  const doubledDemo = [...demo, ...demo];
  return (
    <div className="ticker">
      <div className="ticker-track">
        {doubledDemo.map((it, i) => (
          <span key={i}>
            <b>{it.tag}</b> {it.label} <span className={it.cls}>{triedLoad ? "sin partidos en vivo" : it.val}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function PublicSite({ freePick, premiumPick, zelleInfo, dbError, winRate, membersCount, onFreeRegistered, onPremiumRegistered, goAdmin }) {
  const [tab, setTab] = useState(null);

  return (
    <>
      <Ticker />
      <nav className="ln-nav">
        <div className="nav-mark">{BRAND}</div>
        <div className="nav-status"><span className="dot-live" /> MERCADOS ABIERTOS</div>
      </nav>

      <header className="hero">
        <div className="eyebrow">Análisis Sabermétrico</div>
        <h1 className="wordmark">{BRAND}</h1>
        <div className="subline">Picks &amp; Análisis Deportivo</div>
        <p className="hero-desc">
          Dashboards diarios de MLB y fútbol construidos sobre datos verificados — ERA, wRC+, xG, xGA — no
          corazonadas. Tú decides la línea, nosotros hacemos los números.
        </p>
        {dbError && <p className="banner-error" style={{ maxWidth: 420, margin: "16px auto 0" }}>{dbError}</p>}
      </header>

      {tab === null && (
        <div className="scoreboard">
          <div className="cell"><div className="num">{winRate}</div><div className="lbl">Acierto 7D</div></div>
          <div className="cell"><div className="num">{membersCount}</div><div className="lbl">Miembros</div></div>
          <div className="cell"><div className="num">3</div><div className="lbl">Mercados</div></div>
          <div className="cell"><div className="num">24h</div><div className="lbl">Verificación</div></div>
        </div>
      )}

      {tab === null && (
        <main className="ln-main">
          <div className="card free">
            <div className="icon"><StarIcon /></div>
            <h2>Gratuito</h2>
            <p className="desc">El pick del día, directo a tu correo. Sin tarjeta, sin compromiso — así probás la calidad del análisis antes de dar el salto.</p>
            <button className="btn ghost" onClick={() => setTab("free")}>Recibir pick gratuito</button>
          </div>

          <div className="card premium">
            <div className="premium-badge">PREMIUM</div>
            <div className="icon"><ShieldIcon /></div>
            <h2>Acceso Premium</h2>
            <div className="price-row"><span className="price">{zelleInfo.price}</span><span className="per">/ mes · pago por Zelle</span></div>
            <ul className="feature-list">
              <li><Check /> Tiers PREMIUM / SÓLIDO / RIESGO con score de confianza</li>
              <li><Check /> NRFI, Team Total y F5 con razones métricas</li>
              <li><Check /> Dashboards fútbol: xGA, H2H, probabilidad implícita</li>
              <li><Check /> Acceso tras verificación de pago</li>
            </ul>
            <button className="btn solid" onClick={() => setTab("premium")}>Quiero premium →</button>
            <div className="pay-note">Verificación manual en menos de 24h</div>
          </div>
        </main>
      )}

      {tab === "free" && <FreeForm freePick={freePick} onBack={() => setTab(null)} onRegistered={onFreeRegistered} />}
      {tab === "premium" && <PremiumForm zelleInfo={zelleInfo} onBack={() => setTab(null)} onRegistered={onPremiumRegistered} />}
      {tab === "status" && <StatusLookup premiumPick={premiumPick} onBack={() => setTab(null)} />}

      {tab === null && (
        <div className="under-links">
          <button className="link-row" onClick={() => setTab("status")}>
            <Search size={15} /> Ya me registré, quiero ver mi estado
          </button>
        </div>
      )}

      {tab === null && <CornerSummary freePick={freePick} premiumPick={premiumPick} />}

      <footer className="site-footer">
        <span>© 2026 {BRAND}</span>
        <button onClick={goAdmin}>ADMIN</button>
      </footer>
    </>
  );
}

function CornerSummary({ freePick, premiumPick }) {
  return (
    <div className="corner-summary">
      <div className="corner-summary-head">
        <span className="dot-live" /> RESUMEN DE HOY
      </div>
      <div className="corner-summary-row">
        <span className="corner-summary-tag free">FREE</span>
        <span className="corner-summary-text">{freePick}</span>
      </div>
      <div className="corner-summary-row">
        <span className="corner-summary-tag premium">PREMIUM</span>
        <span className="corner-summary-text">{premiumPick}</span>
      </div>
    </div>
  );
}

function FreeForm({ freePick, onBack, onRegistered }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);

  async function submit(e) {
    e.preventDefault();
    const clean = email.trim().toLowerCase();
    if (!GMAIL_RE.test(clean)) { setError("Ingresá un correo de Gmail válido (ejemplo@gmail.com)."); return; }
    setError(""); setSending(true);
    try {
      await insertFreeSub(clean);
      onRegistered(clean);
      setDone(true);
    } catch (err) {
      setError("No se pudo registrar. Probá de nuevo en un momento.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="panel" style={{ maxWidth: 440 }}>
      <button className="link-row" style={{ marginBottom: 20 }} onClick={onBack}><ArrowLeft size={14} /> Volver</button>
      {!done ? (
        <form className="card" onSubmit={submit}>
          <h2>Pick gratis</h2>
          <label className="field-label">Tu Gmail</label>
          <input className="ln-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tunombre@gmail.com" />
          {error && <p style={{ color: "#ff6b6b", fontSize: 12, marginBottom: 12 }}>{error}</p>}
          <button className="btn ghost" type="submit" disabled={sending}>{sending ? "Registrando..." : "Recibir pick gratuito"}</button>
        </form>
      ) : (
        <div className="card" style={{ textAlign: "center" }}>
          <CheckCircle2 size={36} color="#5be89a" style={{ margin: "0 auto 12px" }} />
          <p style={{ fontWeight: 700 }}>¡Listo! Quedaste registrado.</p>
          <p className="desc" style={{ marginTop: 8 }}>También te lo dejamos acá:</p>
          <div className="box" style={{ color: "var(--gold)" }}>{freePick}</div>
        </div>
      )}
    </div>
  );
}

function PremiumForm({ zelleInfo, onBack, onRegistered }) {
  const [email, setEmail] = useState("");
  const [ref, setRef] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setScreenshot(reader.result);
    reader.readAsDataURL(file);
  }

  async function submit(e) {
    e.preventDefault();
    const clean = email.trim().toLowerCase();
    if (!GMAIL_RE.test(clean)) { setError("Ingresá un correo de Gmail válido (ejemplo@gmail.com)."); return; }
    if (!ref.trim()) { setError("Ingresá el número/código de confirmación del Zelle."); return; }
    setError(""); setSending(true);
    const entry = { email: clean, ref: ref.trim(), screenshot, status: "pending" };
    try {
      await insertPremiumSub(entry);
      onRegistered(entry);
      setDone(true);
    } catch (err) {
      setError("No se pudo enviar. Probá de nuevo en un momento.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="panel" style={{ maxWidth: 460 }}>
      <button className="link-row" style={{ marginBottom: 20 }} onClick={onBack}><ArrowLeft size={14} /> Volver</button>
      {!done ? (
        <div className="card premium" style={{ background: "var(--card)" }}>
          <h2 style={{ background: "none", WebkitTextFillColor: "unset", color: "var(--gold)" }}>Acceso premium</h2>
          <div className="box">
            <p className="field-label" style={{ display: "flex", alignItems: "center", gap: 6 }}><CreditCard size={13} /> Pagá por Zelle</p>
            <p style={{ fontSize: 13.5 }}>Monto: <b style={{ color: "var(--gold)" }}>{zelleInfo.price}</b></p>
            <p style={{ fontSize: 13.5 }}>A nombre de: {zelleInfo.name}</p>
            <p style={{ fontSize: 13.5 }}>Zelle: {zelleInfo.handle}</p>
          </div>
          <form onSubmit={submit}>
            <label className="field-label">Tu Gmail</label>
            <input className="ln-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tunombre@gmail.com" />
            <label className="field-label">Número / código de confirmación del Zelle</label>
            <input className="ln-input" value={ref} onChange={(e) => setRef(e.target.value)} placeholder="Ej: 4F82K9" />
            <label className="field-label">Captura del pago (opcional)</label>
            <label className="ln-input" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer", borderStyle: "dashed" }}>
              <Upload size={14} /> {screenshot ? "Imagen cargada ✓" : "Subir captura"}
              <input type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
            </label>
            {error && <p style={{ color: "#ff6b6b", fontSize: 12, marginBottom: 12 }}>{error}</p>}
            <button className="btn solid" type="submit" disabled={sending}>{sending ? "Enviando..." : "Enviar comprobante"}</button>
          </form>
        </div>
      ) : (
        <div className="card" style={{ textAlign: "center" }}>
          <Clock size={36} color="var(--gold)" style={{ margin: "0 auto 12px" }} />
          <p style={{ fontWeight: 700 }}>Comprobante recibido</p>
          <p className="desc" style={{ marginTop: 8 }}>
            Tu pago queda <b style={{ color: "var(--gold)" }}>pendiente de verificación</b>. Una vez aprobado te
            llega el pick premium a tu Gmail. Podés volver y revisar tu estado con "Ya me registré".
          </p>
        </div>
      )}
    </div>
  );
}

function StatusLookup({ premiumPick, onBack }) {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(undefined);
  const [searching, setSearching] = useState(false);

  async function search(e) {
    e.preventDefault();
    setSearching(true);
    const clean = email.trim().toLowerCase();
    try {
      const rows = await searchPremiumByEmail(clean);
      setResult(rows && rows.length > 0 ? rows[0] : null);
    } catch (err) {
      setResult(null);
    } finally {
      setSearching(false);
    }
  }

  return (
    <div className="panel" style={{ maxWidth: 440 }}>
      <button className="link-row" style={{ marginBottom: 20 }} onClick={onBack}><ArrowLeft size={14} /> Volver</button>
      <form className="card" onSubmit={search}>
        <h2>Consultar estado</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <input className="ln-input" style={{ marginBottom: 0 }} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tunombre@gmail.com" />
          <button className="btn ghost" style={{ width: "auto", padding: "0 18px" }} type="submit" disabled={searching}>{searching ? "..." : "Buscar"}</button>
        </div>
        {result === null && <p className="desc" style={{ marginTop: 14 }}>No encontramos ese correo registrado en premium.</p>}
        {result && (
          <div className="box" style={{ marginTop: 14 }}>
            {result.status === "approved" && (<><p style={{ color: "#5be89a", fontWeight: 700, fontSize: 13 }}>✓ Aprobado</p><p style={{ color: "var(--gold)", marginTop: 8 }}>{premiumPick}</p></>)}
            {result.status === "pending" && <p style={{ color: "var(--gold)", fontWeight: 700, fontSize: 13 }}>⏳ Pendiente de verificación</p>}
            {result.status === "rejected" && <p style={{ color: "#ff6b6b", fontWeight: 700, fontSize: 13 }}>Pago no verificado. Escribinos para resolverlo.</p>}
          </div>
        )}
      </form>
    </div>
  );
}

function AdminLogin({ onBack, onSuccess }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  function submit(e) {
    e.preventDefault();
    if (pw.trim() === "admin110520") { setError(""); onSuccess(); } else { setError("Contraseña incorrecta."); }
  }
  return (
    <div className="panel" style={{ maxWidth: 340, textAlign: "center" }}>
      <form className="card" onSubmit={submit}>
        <Lock size={28} color="var(--gold)" />
        <h2 style={{ marginTop: 14 }}>Acceso admin</h2>
        <input
          className="ln-input"
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") submit(e); }}
          placeholder="Contraseña"
          autoFocus
        />
        {error && <p style={{ color: "#ff6b6b", fontSize: 12, marginBottom: 12 }}>{error}</p>}
        <button className="btn solid" type="submit" onClick={submit}>Entrar</button>
        <button type="button" className="link-row" style={{ marginTop: 10, justifyContent: "center" }} onClick={onBack}>Volver al sitio</button>
      </form>
    </div>
  );
}

function gmailComposeUrl(emails, subject, body) {
  const bcc = emails.join(",");
  const params = new URLSearchParams({ view: "cm", fs: "1", tf: "1", bcc, su: subject, body });
  return `https://mail.google.com/mail/?${params.toString()}`;
}
function copyToClipboard(text) {
  if (navigator.clipboard) navigator.clipboard.writeText(text);
}

function AdminPanel({ loaded, dbError, freePick, setFreePick, premiumPick, setPremiumPick, zelleInfo, setZelleInfo, winRate, setWinRate, baseMembers, setBaseMembers, freeSubs, premiumSubs, onApprove, onReject, onExit }) {
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const approvedPremiumEmails = premiumSubs.filter((p) => p.status === "approved").map((p) => p.email);
  const freeEmails = freeSubs.map((s) => s.email);
  const BATCH = 50;

  function notify(emails, pickText, label) {
    if (emails.length === 0) return;
    const subject = `Tu pick ${label} de hoy — Yoan Sport`;
    const body = `Acá tenés el pick de hoy:\n\n${pickText}\n\n— Yoan Sport`;
    for (let i = 0; i < emails.length; i += BATCH) {
      window.open(gmailComposeUrl(emails.slice(i, i + BATCH), subject, body), "_blank");
    }
  }

  async function saveSettings() {
    setSaving(true);
    setSavedMsg("");
    try {
      await updateSettings({
        free_pick: freePick,
        premium_pick: premiumPick,
        zelle_name: zelleInfo.name,
        zelle_handle: zelleInfo.handle,
        zelle_price: zelleInfo.price,
        win_rate: winRate,
        base_members: Number(baseMembers) || 0,
      });
      setSavedMsg("Guardado ✓");
    } catch (err) {
      setSavedMsg("Error al guardar");
    } finally {
      setSaving(false);
      setTimeout(() => setSavedMsg(""), 2500);
    }
  }

  return (
    <div className="panel">
      <div className="row-between" style={{ marginBottom: 30 }}>
        <h1 className="wordmark" style={{ fontSize: 34 }}>PANEL ADMIN</h1>
        <button className="btn ghost" style={{ width: "auto", padding: "8px 16px" }} onClick={onExit}><LogOut size={13} /> Salir</button>
      </div>

      {dbError && <p className="banner-error">{dbError}</p>}
      {!loaded && <p className="desc">Cargando datos desde Supabase...</p>}

      <div className="box">
        <label className="field-label">Pick free de hoy</label>
        <textarea className="ln-input" rows={3} value={freePick} onChange={(e) => setFreePick(e.target.value)} />
      </div>
      <div className="box">
        <label className="field-label">Pick premium de hoy</label>
        <textarea className="ln-input" rows={3} value={premiumPick} onChange={(e) => setPremiumPick(e.target.value)} />
      </div>
      <div className="box">
        <label className="field-label">Datos de Zelle mostrados a usuarios</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          <input className="ln-input" style={{ marginBottom: 0 }} value={zelleInfo.name} onChange={(e) => setZelleInfo((z) => ({ ...z, name: e.target.value }))} placeholder="Nombre" />
          <input className="ln-input" style={{ marginBottom: 0 }} value={zelleInfo.handle} onChange={(e) => setZelleInfo((z) => ({ ...z, handle: e.target.value }))} placeholder="Email o teléfono Zelle" />
          <input className="ln-input" style={{ marginBottom: 0 }} value={zelleInfo.price} onChange={(e) => setZelleInfo((z) => ({ ...z, price: e.target.value }))} placeholder="Precio" />
        </div>
      </div>
      <div className="box">
        <label className="field-label">Estadísticas mostradas en la página principal</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div>
            <label className="field-label" style={{ marginTop: 0 }}>% Acierto 7D</label>
            <input className="ln-input" style={{ marginBottom: 0 }} value={winRate} onChange={(e) => setWinRate(e.target.value)} placeholder="62%" />
          </div>
          <div>
            <label className="field-label" style={{ marginTop: 0 }}>Miembros base (arranca acá, después suma los reales)</label>
            <input className="ln-input" style={{ marginBottom: 0 }} type="number" value={baseMembers} onChange={(e) => setBaseMembers(e.target.value)} placeholder="20" />
          </div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 30 }}>
        <button className="btn solid" style={{ width: "auto", padding: "10px 20px" }} onClick={saveSettings} disabled={saving}>
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
        {savedMsg && <span style={{ fontSize: 12, color: savedMsg.includes("Error") ? "#ff6b6b" : "#5be89a" }}>{savedMsg}</span>}
      </div>

      <h3 className="field-label" style={{ marginTop: 30 }}>Registrados free ({freeSubs.length})</h3>
      <div className="box">
        {freeSubs.length === 0 && <p className="desc">Todavía no hay registros.</p>}
        {freeSubs.map((s, i) => (
          <div key={i} className="row-between" style={{ padding: "8px 0", borderBottom: i < freeSubs.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
            <span style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}><Mail size={13} color="var(--muted)" />{s.email}</span>
            <span style={{ fontSize: 11, color: "var(--muted)" }}>{s.created_at ? new Date(s.created_at).toLocaleString() : ""}</span>
          </div>
        ))}
        {freeEmails.length > 0 && (
          <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
            <button className="btn solid" style={{ width: "auto", padding: "9px 16px" }} onClick={() => notify(freeEmails, freePick, "free")}>
              Notificar free por Gmail ({freeEmails.length})
            </button>
            <button className="btn ghost" style={{ width: "auto", padding: "9px 16px" }} onClick={() => copyToClipboard(freeEmails.join(", "))}>
              Copiar emails
            </button>
          </div>
        )}
      </div>

      <h3 className="field-label" style={{ marginTop: 30 }}>Registrados premium ({premiumSubs.length})</h3>
      <div className="box">
        {premiumSubs.length === 0 && <p className="desc">Todavía no hay registros.</p>}
        {premiumSubs.map((s, i) => (
          <div key={i} className="row-between" style={{ padding: "10px 0", borderBottom: i < premiumSubs.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none", flexWrap: "wrap", gap: 10 }}>
            <div>
              <p style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}><Mail size={13} color="var(--muted)" />{s.email}</p>
              <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 3 }}>Ref: {s.ref} · {s.created_at ? new Date(s.created_at).toLocaleString() : ""}</p>
            </div>
            {s.screenshot && <img src={s.screenshot} alt="comprobante" style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)" }} />}
            <div style={{ display: "flex", gap: 8 }}>
              {s.status === "pending" && (
                <>
                  <button className="pill-approve" onClick={() => onApprove(s.email)}>Aprobar</button>
                  <button className="pill-reject" onClick={() => onReject(s.email)}>Rechazar</button>
                </>
              )}
              {s.status === "approved" && <span style={{ fontSize: 11, color: "#5be89a" }}>✓ Aprobado</span>}
              {s.status === "rejected" && <span style={{ fontSize: 11, color: "#ff6b6b" }}>Rechazado</span>}
            </div>
          </div>
        ))}
        {approvedPremiumEmails.length > 0 && (
          <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
            <button className="btn solid" style={{ width: "auto", padding: "9px 16px" }} onClick={() => notify(approvedPremiumEmails, premiumPick, "premium")}>
              Notificar premium aprobados por Gmail ({approvedPremiumEmails.length})
            </button>
            <button className="btn ghost" style={{ width: "auto", padding: "9px 16px" }} onClick={() => copyToClipboard(approvedPremiumEmails.join(", "))}>
              Copiar emails
            </button>
          </div>
        )}
      </div>

      <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 20, lineHeight: 1.6 }}>
        Los registros ahora se guardan de verdad en tu base de datos de Supabase — no se pierden al recargar.
        "Notificar por Gmail" te abre una pestaña con los correos en CCO y el pick cargado; solo apretás Enviar.
      </p>
    </div>
  );
}
