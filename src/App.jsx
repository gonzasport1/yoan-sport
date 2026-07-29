import React, { useState, useEffect } from "react";
import { Search, CreditCard, Upload, ArrowLeft, Lock, LogOut, Mail, CheckCircle2, Clock, ShieldCheck } from "lucide-react";

const GMAIL_RE = /^[^\s@]+@gmail\.com$/i;
const BRAND = "Yoan Sport";

const TREND_LEAGUES = [
  { id: 39, name: "Premier League", flag: "🏴" },
  { id: 140, name: "La Liga", flag: "🇪🇸" },
  { id: 78, name: "Bundesliga", flag: "🇩🇪" },
  { id: 135, name: "Serie A", flag: "🇮🇹" },
  { id: 61, name: "Ligue 1", flag: "🇫🇷" },
  { id: 2, name: "Champions League", flag: "🇪🇺" },
  { id: 71, name: "Brasileirão", flag: "🇧🇷" },
  { id: 262, name: "Liga MX", flag: "🇲🇽" },
];

const MARKET_TABS = [
  { key: "matchGoals", label: "Goles" },
  { key: "corners", label: "Córners" },
  { key: "cards", label: "Tarjetas" },
  { key: "fouls", label: "Faltas" },
  { key: "totalShots", label: "Tiros" },
  { key: "shotsOnTarget", label: "Tiros al arco" },
];

async function fetchJSON(url) {
  const r = await fetch(url);
  return r.json();
}

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
const insertPremiumSub = (entry) =>
  sb("premium_subs", { method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify(entry) });
const searchPremiumByEmail = (email) => sb(`premium_subs?email=eq.${encodeURIComponent(email)}&select=*&order=created_at.desc`);
const getFreeSubs = () => sb("free_subs?select=*&order=created_at.desc"); // se mantiene solo para el panel admin (histórico)
const getPremiumSubs = () => sb("premium_subs?select=*&order=created_at.desc");

async function adminWrite(password, action, payload) {
  const res = await fetch("/api/admin-write", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password, action, ...payload }),
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Error de autorización");
  return res.json();
}
async function adminLogin(password) {
  const res = await fetch("/api/admin-login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  return res.ok;
}

const GLOBAL_CSS = `
  :root{
    --bg: #06090b; --bg-2: #0b1214; --teal-bright: #12d6c4; --gold: #e8b649; --gold-dim: #a9843a;
    --text: #eef4f2; --muted: #7f9490; --line: rgba(18,214,196,0.14); --card: rgba(255,255,255,0.025);
  }
  .ln-root{ background: radial-gradient(ellipse 900px 500px at 20% -10%, rgba(18,214,196,0.10), transparent 60%), radial-gradient(ellipse 700px 500px at 100% 10%, rgba(232,182,73,0.07), transparent 55%), linear-gradient(180deg, var(--bg) 0%, var(--bg-2) 100%); color:var(--text); font-family:'Inter', sans-serif; min-height:100vh; position:relative; }
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
  h1.wordmark{ font-family:'Bebas Neue', sans-serif; font-size: clamp(40px, 9vw, 76px); line-height:1; letter-spacing:3px; text-transform:uppercase; margin-bottom:6px; }
  .brand-word-1{ background:linear-gradient(180deg, #ffffff 10%, #b9c9c6 55%, #6f8a85 100%); -webkit-background-clip:text; background-clip:text; color:transparent; }
  .brand-word-2{ background:linear-gradient(180deg, #7fe0d4 0%, var(--teal-bright) 55%, #0ea89b 100%); -webkit-background-clip:text; background-clip:text; color:transparent; }
  .subline{ font-family:'JetBrains Mono', monospace; font-size:13px; letter-spacing:3.5px; color:var(--teal-bright); text-transform:uppercase; }
  .hero-desc{ max-width:520px; margin:22px auto 0; color:var(--muted); font-size:14.5px; line-height:1.65; }
  .scoreboard{ position:relative; z-index:2; max-width:920px; margin:38px auto 10px; padding:0 5vw; display:grid; grid-template-columns:repeat(4,1fr); gap:1px; background:var(--line); border:1px solid var(--line); border-radius:10px; overflow:hidden; }
  .scoreboard .cell{ background:rgba(6,9,11,0.85); padding:16px 10px; text-align:center; }
  .scoreboard .cell .num{ font-family:'Bebas Neue', sans-serif; font-size:26px; color:var(--text); letter-spacing:1px; }
  .scoreboard .cell .lbl{ font-family:'JetBrains Mono', monospace; font-size:9.5px; color:var(--muted); text-transform:uppercase; letter-spacing:1.5px; margin-top:3px; }
  .card{ background:var(--card); border:1px solid rgba(255,255,255,0.07); border-radius:18px; padding:30px 28px; position:relative; overflow:hidden; backdrop-filter:blur(16px); display:flex; flex-direction:column; }
  .card h2{ font-family:'Bebas Neue', sans-serif; font-size:26px; letter-spacing:1.5px; margin-bottom:10px; }
  .card p.desc{ color:var(--muted); font-size:13.5px; line-height:1.6; margin-bottom:24px; }
  .ln-input{ width:100%; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.12); border-radius:9px; padding:12px 14px; color:var(--text); font-family:'Inter', sans-serif; font-size:13.5px; margin-bottom:12px; outline:none; transition:border-color .2s; }
  .ln-input:focus{border-color:var(--teal-bright);}
  .ln-input::placeholder{color:var(--muted);}
  .btn{ display:inline-flex; align-items:center; justify-content:center; gap:8px; padding:13px 20px; border-radius:9px; font-family:'Inter', sans-serif; font-weight:700; font-size:13.5px; letter-spacing:0.3px; border:none; cursor:pointer; transition: transform .15s ease, box-shadow .15s ease; width:100%; }
  .btn:hover{transform:translateY(-1px);}
  .btn:disabled{opacity:0.5; cursor:not-allowed; transform:none;}
  .btn.ghost{ background:transparent; border:1px solid rgba(255,255,255,0.18); color:var(--text); }
  .btn.ghost:hover{ border-color:var(--teal-bright); color:var(--teal-bright); }
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
  .legal-disclaimer{ position:relative; z-index:2; max-width:680px; margin:0 auto; padding:0 5vw 20px; text-align:center; font-size:11px; color:var(--muted); line-height:1.6; }

  .access-banner{ position:relative; z-index:2; max-width:960px; margin:30px auto 0; padding:0 5vw; }
  .access-box{ background:linear-gradient(160deg, rgba(18,214,196,0.08), rgba(232,182,73,0.04)); border:1px solid rgba(18,214,196,0.3); border-radius:16px; padding:20px 24px; display:flex; align-items:center; justify-content:space-between; gap:16px; flex-wrap:wrap; }
  .access-box.unlocked{ border-color:rgba(91,232,154,0.4); background:rgba(91,232,154,0.06); }
  .access-box p{ font-size:13px; color:var(--text); }
  .access-box .btn{ width:auto; padding:10px 20px; }

  .trends-section{ position:relative; z-index:2; max-width:960px; margin:30px auto 0; padding:0 5vw 60px; }
  .trends-section-head{ display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; margin-bottom:6px; }
  .trends-title{ font-family:'Bebas Neue', sans-serif; font-size:24px; letter-spacing:1px; color:var(--text); }
  .trends-subtitle{ color:var(--muted); font-size:12.5px; margin-bottom:16px; }
  .league-select{ background:var(--card); border:1px solid rgba(255,255,255,0.12); color:var(--text); border-radius:8px; padding:8px 12px; font-size:12.5px; }
  .trends-grid{ display:grid; grid-template-columns:1fr 1fr; gap:10px; }
  @media (max-width:640px){ .trends-grid{ grid-template-columns:1fr; } }
  .trends-card{ display:flex; align-items:center; justify-content:space-between; gap:10px; padding:12px 14px; border:1px solid rgba(255,255,255,0.08); border-radius:12px; background:var(--card); cursor:pointer; transition:border-color .15s; }
  .trends-card:hover{ border-color:var(--teal-bright); }
  .trends-card-teams{ display:flex; flex-direction:column; gap:5px; font-size:12.5px; }
  .trends-card-teams span{ display:flex; align-items:center; gap:6px; }
  .trends-card-teams img{ width:16px; height:16px; object-fit:contain; }
  .trends-lock{ font-size:11px; color:var(--gold); font-weight:600; display:flex; align-items:center; gap:4px; white-space:nowrap; }
  .trends-cta{ font-size:11px; color:var(--teal-bright); font-weight:600; white-space:nowrap; }
  .trends-matchup{ display:flex; align-items:center; justify-content:center; gap:18px; margin-bottom:22px; }
  .trends-matchup-team{ display:flex; flex-direction:column; align-items:center; gap:8px; font-family:'Bebas Neue', sans-serif; font-size:16px; letter-spacing:0.5px; }
  .trends-matchup-team img{ width:36px; height:36px; object-fit:contain; }
  .trends-vs{ color:var(--muted); font-size:11px; font-family:'JetBrains Mono', monospace; }
  .trends-team-columns{ display:grid; grid-template-columns:1fr 1fr; gap:16px; }
  @media (max-width:700px){ .trends-team-columns{ grid-template-columns:1fr; } }

  .market-tabs{ display:flex; gap:4px; flex-wrap:wrap; margin-bottom:14px; background:rgba(0,0,0,0.2); padding:4px; border-radius:10px; }
  .market-tab{ font-size:10.5px; padding:7px 10px; border-radius:7px; background:none; border:none; color:var(--muted); cursor:pointer; white-space:nowrap; }
  .market-tab.active{ background:var(--teal-bright); color:#04211d; font-weight:700; }
  .metric-summary{ display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
  .metric-summary .line-badge{ background:rgba(232,182,73,0.12); border:1px solid rgba(232,182,73,0.3); color:var(--gold); font-size:11px; padding:4px 9px; border-radius:6px; font-family:'JetBrains Mono', monospace; }
  .metric-summary .hitrate{ text-align:right; }
  .metric-summary .hitrate .pct{ font-family:'Bebas Neue', sans-serif; font-size:22px; color:var(--teal-bright); }
  .metric-summary .hitrate .lbl{ font-size:9.5px; color:var(--muted); text-transform:uppercase; }
  .bar-chart{ display:flex; align-items:flex-end; gap:4px; height:110px; padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.1); position:relative; }
  .bar-chart .ref-line{ position:absolute; left:0; right:0; border-top:1px dashed var(--gold); font-size:9px; color:var(--gold); text-align:right; padding-right:2px; }
  .bar-col{ flex:1; display:flex; flex-direction:column; align-items:center; justify-content:flex-end; gap:3px; min-width:0; }
  .bar-rect{ width:70%; border-radius:3px 3px 0 0; }
  .bar-rect.over{ background:#5be89a; } .bar-rect.under{ background:#ff6b6b; }
  .bar-val{ font-size:9px; color:var(--text); }
  .bar-lbl{ font-size:8px; color:var(--muted); writing-mode:vertical-rl; text-orientation:mixed; max-height:34px; overflow:hidden; }
`;

function Check() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--teal-bright)", flexShrink: 0 }}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function App() {
  const [zelleInfo, setZelleInfo] = useState({ handle: "", name: "", price: "" });
  const [winRate, setWinRate] = useState("62%");
  const [baseMembers, setBaseMembers] = useState(20);
  const [freeSubs, setFreeSubs] = useState([]);
  const [premiumSubs, setPremiumSubs] = useState([]);
  const [view, setView] = useState("public");
  const [dbError, setDbError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");

  async function loadAll() {
    try {
      const [settings, free, premium] = await Promise.all([getSettings(), getFreeSubs(), getPremiumSubs()]);
      if (settings) {
        setZelleInfo({ name: settings.zelle_name, handle: settings.zelle_handle, price: settings.zelle_price });
        if (settings.win_rate) setWinRate(settings.win_rate);
        if (settings.base_members != null) setBaseMembers(settings.base_members);
      }
      setFreeSubs(free || []);
      setPremiumSubs(premium || []);
      setDbError("");
    } catch (err) {
      setDbError("No se pudo conectar con la base de datos.");
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
          dbError={dbError}
          zelleInfo={zelleInfo}
          winRate={winRate}
          membersCount={baseMembers + premiumSubs.filter((p) => p.status === "approved").length}
          onPremiumRegistered={(entry) => setPremiumSubs((s) => [{ ...entry, status: "pending" }, ...s])}
          goAdmin={() => setView("admin-login")}
        />
      )}
      {view === "admin-login" && (
        <AdminLogin onBack={() => setView("public")} onSuccess={(pw) => { setAdminPassword(pw); setView("admin"); }} />
      )}
      {view === "admin" && (
        <AdminPanel
          loaded={loaded}
          dbError={dbError}
          adminPassword={adminPassword}
          zelleInfo={zelleInfo} setZelleInfo={setZelleInfo}
          winRate={winRate} setWinRate={setWinRate}
          baseMembers={baseMembers} setBaseMembers={setBaseMembers}
          freeSubs={freeSubs} premiumSubs={premiumSubs}
          onApprove={async (email) => { await adminWrite(adminPassword, "premium-status", { email, status: "approved" }); setPremiumSubs((s) => s.map((p) => (p.email === email ? { ...p, status: "approved" } : p))); }}
          onReject={async (email) => { await adminWrite(adminPassword, "premium-status", { email, status: "rejected" }); setPremiumSubs((s) => s.map((p) => (p.email === email ? { ...p, status: "rejected" } : p))); }}
          onExit={() => { setView("public"); setAdminPassword(""); }}
        />
      )}
    </div>
  );
}

function Ticker() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch("/api/live-scores");
        const data = await res.json();
        if (active) setItems(Array.isArray(data.items) ? data.items : []);
      } catch (err) {}
    }
    load();
    const id = setInterval(load, 60000);
    return () => { active = false; clearInterval(id); };
  }, []);

  if (items.length === 0) {
    return (
      <div className="ticker"><div className="ticker-track">
        <span><b>YOAN SPORT</b> Análisis en vivo de fútbol — BTTS, córners, tarjetas, tiros y más</span>
      </div></div>
    );
  }
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

// ==================== PUBLIC SITE ====================
function PublicSite({ dbError, zelleInfo, winRate, membersCount, onPremiumRegistered, goAdmin }) {
  const [tab, setTab] = useState(null);
  const [trendLeague, setTrendLeague] = useState(TREND_LEAGUES[0].id);
  const [trendFixtures, setTrendFixtures] = useState([]);
  const [loadingFixtures, setLoadingFixtures] = useState(true);
  const [selectedFixture, setSelectedFixture] = useState(null);
  const [homeTrends, setHomeTrends] = useState(null);
  const [awayTrends, setAwayTrends] = useState(null);
  const [loadingTrends, setLoadingTrends] = useState(false);

  const [unlockedEmail, setUnlockedEmail] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("yoansport_access") || "null");
      return saved?.approved ? saved.email : null;
    } catch { return null; }
  });

  useEffect(() => {
    setLoadingFixtures(true);
    fetchJSON(`/api/fixtures?league=${trendLeague}`)
      .then((data) => setTrendFixtures(data.items || []))
      .finally(() => setLoadingFixtures(false));
  }, [trendLeague]);

  function openFixture(fixture) {
    if (!unlockedEmail) { setTab("premium"); return; }
    setSelectedFixture(fixture);
    setTab("trends-detail");
    setLoadingTrends(true);
    setHomeTrends(null);
    setAwayTrends(null);
    Promise.all([
      fetchJSON(`/api/team-trends?teamId=${fixture.home.id}`),
      fetchJSON(`/api/team-trends?teamId=${fixture.away.id}`),
    ])
      .then(([h, a]) => { setHomeTrends(h); setAwayTrends(a); })
      .finally(() => setLoadingTrends(false));
  }

  function handleUnlock(email) {
    setUnlockedEmail(email);
    localStorage.setItem("yoansport_access", JSON.stringify({ email, approved: true }));
    setTab(null);
  }

  return (
    <>
      <Ticker />
      <nav className="ln-nav">
        <div className="nav-mark">{BRAND}</div>
        <div className="nav-status"><span className="dot-live" /> MERCADOS ABIERTOS</div>
      </nav>

      <header className="hero">
        <div className="eyebrow">Análisis Sabermétrico</div>
        <h1 className="wordmark"><span className="brand-word-1">Yoan</span> <span className="brand-word-2">Sport</span></h1>
        <div className="subline">Análisis de Tendencias de Fútbol</div>
        <p className="hero-desc">
          Estadísticas reales de los últimos partidos de cada equipo — goles, córners, tarjetas, faltas y tiros —
          de las principales ligas de Europa, Brasil y México. Datos verificados, no corazonadas.
        </p>
        {dbError && <p className="banner-error" style={{ maxWidth: 420, margin: "16px auto 0" }}>{dbError}</p>}
      </header>

      {tab === null && (
        <div className="scoreboard">
          <div className="cell"><div className="num">{winRate}</div><div className="lbl">Acierto 7D</div></div>
          <div className="cell"><div className="num">{membersCount}</div><div className="lbl">Miembros</div></div>
          <div className="cell"><div className="num">8</div><div className="lbl">Ligas</div></div>
          <div className="cell"><div className="num">24h</div><div className="lbl">Verificación</div></div>
        </div>
      )}

      {tab === null && (
        <div className="access-banner">
          <div className={`access-box ${unlockedEmail ? "unlocked" : ""}`}>
            {unlockedEmail ? (
              <>
                <p><CheckCircle2 size={14} style={{ verticalAlign: "middle", marginRight: 6, color: "#5be89a" }} />Acceso desbloqueado para <b>{unlockedEmail}</b></p>
                <button className="btn ghost" onClick={() => { localStorage.removeItem("yoansport_access"); setUnlockedEmail(null); }}>Cerrar acceso</button>
              </>
            ) : (
              <>
                <p><ShieldCheck size={14} style={{ verticalAlign: "middle", marginRight: 6, color: "var(--gold)" }} />Registrate y pagá para desbloquear el análisis completo de todas las ligas.</p>
                <button className="btn solid" onClick={() => setTab("premium")}>Quiero acceso premium — {zelleInfo.price}</button>
              </>
            )}
          </div>
        </div>
      )}

      {tab === null && (
        <TrendsPreview
          trendLeague={trendLeague}
          setTrendLeague={setTrendLeague}
          fixtures={trendFixtures}
          loading={loadingFixtures}
          unlocked={!!unlockedEmail}
          onOpen={openFixture}
        />
      )}

      {tab === "premium" && (
        <PremiumForm zelleInfo={zelleInfo} onBack={() => setTab(null)} onRegistered={onPremiumRegistered} />
      )}
      {tab === "status" && <StatusLookup onBack={() => setTab(null)} onUnlock={handleUnlock} />}
      {tab === "trends-detail" && selectedFixture && (
        <TrendsDetail fixture={selectedFixture} homeTrends={homeTrends} awayTrends={awayTrends} loading={loadingTrends} onBack={() => setTab(null)} />
      )}

      {tab === null && (
        <div className="under-links">
          <button className="link-row" onClick={() => setTab("status")}>
            <Search size={15} /> Ya pagué, quiero activar mi acceso
          </button>
        </div>
      )}

      <p className="legal-disclaimer">
        Contenido con fines informativos y de entretenimiento. No garantiza resultados ni ganancias. Apostar
        conlleva riesgo — hacelo de forma responsable. Servicio dirigido a mayores de 18 años. Las líneas mostradas
        son promedios estadísticos propios, no cuotas de casas de apuestas.
      </p>

      <footer className="site-footer">
        <span>© 2026 {BRAND}</span>
        <button onClick={goAdmin}>ADMIN</button>
      </footer>
    </>
  );
}

function TrendsPreview({ trendLeague, setTrendLeague, fixtures, loading, unlocked, onOpen }) {
  return (
    <section className="trends-section">
      <div className="trends-section-head">
        <h2 className="trends-title">Próximos partidos</h2>
        <select className="league-select" value={trendLeague} onChange={(e) => setTrendLeague(Number(e.target.value))}>
          {TREND_LEAGUES.map((l) => (<option key={l.id} value={l.id}>{l.flag} {l.name}</option>))}
        </select>
      </div>
      <p className="trends-subtitle">
        {unlocked ? "Tocá cualquier partido para ver el análisis completo." : "Con acceso premium desbloqueás el análisis de todos estos partidos."}
      </p>

      {loading && <p className="desc">Cargando partidos...</p>}
      {!loading && fixtures.length === 0 && <p className="desc">No hay próximos partidos para esta liga ahora mismo.</p>}

      <div className="trends-grid">
        {fixtures.slice(0, 10).map((f) => (
          <div key={f.id} className="trends-card" onClick={() => onOpen(f)}>
            <div className="trends-card-teams">
              <span><img src={f.home.logo} alt="" />{f.home.name}</span>
              <span><img src={f.away.logo} alt="" />{f.away.name}</span>
            </div>
            {unlocked ? (
              <span className="trends-cta">Ver análisis →</span>
            ) : (
              <span className="trends-lock"><Lock size={12} /> Premium</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function TrendsDetail({ fixture, homeTrends, awayTrends, loading, onBack }) {
  return (
    <div className="panel" style={{ maxWidth: 820 }}>
      <button className="link-row" style={{ marginBottom: 20 }} onClick={onBack}><ArrowLeft size={14} /> Volver</button>
      <div className="trends-matchup">
        <div className="trends-matchup-team"><img src={fixture.home.logo} alt="" />{fixture.home.name}</div>
        <span className="trends-vs">VS</span>
        <div className="trends-matchup-team"><img src={fixture.away.logo} alt="" />{fixture.away.name}</div>
      </div>
      {loading && <p className="desc" style={{ textAlign: "center" }}>Calculando tendencias de los últimos partidos...</p>}
      {!loading && homeTrends && awayTrends && (
        <div className="trends-team-columns">
          <TeamTrendCard team={fixture.home} trends={homeTrends} />
          <TeamTrendCard team={fixture.away} trends={awayTrends} />
        </div>
      )}
    </div>
  );
}

function TeamTrendCard({ team, trends }) {
  const [market, setMarket] = useState("matchGoals");
  if (!trends || trends.error) {
    return (
      <div className="box">
        <p style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700 }}><img src={team.logo} alt="" style={{ width: 20 }} />{team.name}</p>
        <p className="desc">No se pudieron cargar los datos de este equipo.</p>
      </div>
    );
  }
  const m = trends.metrics?.[market] || {};
  const matches = trends.matches || [];
  const maxVal = Math.max(1, ...matches.map((row) => row[market] ?? 0));

  return (
    <div className="box">
      <p style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, marginBottom: 4 }}><img src={team.logo} alt="" style={{ width: 20 }} />{team.name}</p>
      <p style={{ fontSize: 11, color: "var(--muted)", marginBottom: 12 }}>BTTS {trends.bttsPct ?? "—"}% · Valla invicta {trends.cleanSheetPct ?? "—"}% (últimos {trends.sampleSize || 0})</p>

      <div className="market-tabs">
        {MARKET_TABS.map((t) => (
          <button key={t.key} className={`market-tab ${market === t.key ? "active" : ""}`} onClick={() => setMarket(t.key)}>{t.label}</button>
        ))}
      </div>

      <div className="metric-summary">
        <span className="line-badge">Línea ref.: {m.line ?? "—"}</span>
        <div className="hitrate">
          <div className="pct">{m.overPct ?? "—"}%</div>
          <div className="lbl">Por encima</div>
        </div>
      </div>

      <div className="bar-chart">
        {m.line != null && (
          <div className="ref-line" style={{ bottom: `${Math.min(95, (m.line / maxVal) * 100)}%` }}>{m.line}</div>
        )}
        {matches.map((row, i) => {
          const val = row[market];
          const h = val == null ? 0 : Math.max(4, (val / maxVal) * 100);
          const over = m.line != null && val > m.line;
          return (
            <div className="bar-col" key={i}>
              <span className="bar-val">{val ?? "—"}</span>
              <div className={`bar-rect ${over ? "over" : "under"}`} style={{ height: `${h}%` }} />
              <span className="bar-lbl">{row.rival.slice(0, 10)}</span>
            </div>
          );
        })}
      </div>
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
        <div className="card" style={{ borderColor: "rgba(18,214,196,0.3)" }}>
          <h2 style={{ color: "var(--gold)" }}>Acceso premium</h2>
          <p className="desc">Desbloqueá el análisis completo de todas las ligas y partidos, sin límite.</p>
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
            Tu pago queda <b style={{ color: "var(--gold)" }}>pendiente de verificación</b>. En menos de 24hs lo revisamos.
            Volvé acá y tocá "Ya pagué, quiero activar mi acceso" para desbloquear.
          </p>
        </div>
      )}
    </div>
  );
}

function StatusLookup({ onBack, onUnlock }) {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(undefined);
  const [searching, setSearching] = useState(false);

  async function search(e) {
    e.preventDefault();
    setSearching(true);
    const clean = email.trim().toLowerCase();
    try {
      const rows = await searchPremiumByEmail(clean);
      const found = rows && rows.length > 0 ? rows[0] : null;
      setResult(found);
      if (found?.status === "approved") onUnlock(clean);
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
        <h2>Activar mi acceso</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <input className="ln-input" style={{ marginBottom: 0 }} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tunombre@gmail.com" />
          <button className="btn ghost" style={{ width: "auto", padding: "0 18px" }} type="submit" disabled={searching}>{searching ? "..." : "Buscar"}</button>
        </div>
        {result === null && <p className="desc" style={{ marginTop: 14 }}>No encontramos ese correo registrado.</p>}
        {result && (
          <div className="box" style={{ marginTop: 14 }}>
            {result.status === "approved" && <p style={{ color: "#5be89a", fontWeight: 700, fontSize: 13 }}>✓ Aprobado — acceso desbloqueado</p>}
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
  const [checking, setChecking] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (checking) return;
    setChecking(true);
    setError("");
    try {
      const ok = await adminLogin(pw.trim());
      if (ok) onSuccess(pw.trim());
      else setError("Contraseña incorrecta.");
    } catch (err) {
      setError("No se pudo verificar. Probá de nuevo.");
    } finally {
      setChecking(false);
    }
  }
  return (
    <div className="panel" style={{ maxWidth: 340, textAlign: "center" }}>
      <form className="card" onSubmit={submit}>
        <Lock size={28} color="var(--gold)" />
        <h2 style={{ marginTop: 14 }}>Acceso admin</h2>
        <input className="ln-input" type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Contraseña" autoFocus />
        {error && <p style={{ color: "#ff6b6b", fontSize: 12, marginBottom: 12 }}>{error}</p>}
        <button className="btn solid" type="submit" disabled={checking}>{checking ? "Verificando..." : "Entrar"}</button>
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
function copyToClipboard(text) { if (navigator.clipboard) navigator.clipboard.writeText(text); }

function AdminPanel({ loaded, dbError, adminPassword, zelleInfo, setZelleInfo, winRate, setWinRate, baseMembers, setBaseMembers, freeSubs, premiumSubs, onApprove, onReject, onExit }) {
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const approvedPremiumEmails = premiumSubs.filter((p) => p.status === "approved").map((p) => p.email);
  const BATCH = 50;

  function notifyApproved(emails) {
    if (emails.length === 0) return;
    const subject = "Tu acceso premium a Yoan Sport está activo";
    const body = `Ya podés entrar a yoan-sport.vercel.app y activar tu acceso con este mismo correo, tocando "Ya pagué, quiero activar mi acceso".\n\n— Yoan Sport`;
    for (let i = 0; i < emails.length; i += BATCH) window.open(gmailComposeUrl(emails.slice(i, i + BATCH), subject, body), "_blank");
  }

  async function saveSettings() {
    setSaving(true); setSavedMsg("");
    try {
      await adminWrite(adminPassword, "settings", {
        settings: { zelle_name: zelleInfo.name, zelle_handle: zelleInfo.handle, zelle_price: zelleInfo.price, win_rate: winRate, base_members: Number(baseMembers) || 0 },
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
        <label className="field-label">Estadísticas mostradas en la página principal</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div>
            <label className="field-label" style={{ marginTop: 0 }}>% Acierto 7D</label>
            <input className="ln-input" style={{ marginBottom: 0 }} value={winRate} onChange={(e) => setWinRate(e.target.value)} placeholder="62%" />
          </div>
          <div>
            <label className="field-label" style={{ marginTop: 0 }}>Miembros base</label>
            <input className="ln-input" style={{ marginBottom: 0 }} type="number" value={baseMembers} onChange={(e) => setBaseMembers(e.target.value)} placeholder="20" />
          </div>
        </div>
      </div>
      <div className="box">
        <label className="field-label">Datos de Zelle mostrados a usuarios</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          <input className="ln-input" style={{ marginBottom: 0 }} value={zelleInfo.name} onChange={(e) => setZelleInfo((z) => ({ ...z, name: e.target.value }))} placeholder="Nombre" />
          <input className="ln-input" style={{ marginBottom: 0 }} value={zelleInfo.handle} onChange={(e) => setZelleInfo((z) => ({ ...z, handle: e.target.value }))} placeholder="Email o teléfono Zelle" />
          <input className="ln-input" style={{ marginBottom: 0 }} value={zelleInfo.price} onChange={(e) => setZelleInfo((z) => ({ ...z, price: e.target.value }))} placeholder="Precio" />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 30 }}>
        <button className="btn solid" style={{ width: "auto", padding: "10px 20px" }} onClick={saveSettings} disabled={saving}>{saving ? "Guardando..." : "Guardar cambios"}</button>
        {savedMsg && <span style={{ fontSize: 12, color: savedMsg.includes("Error") ? "#ff6b6b" : "#5be89a" }}>{savedMsg}</span>}
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
            <button className="btn solid" style={{ width: "auto", padding: "9px 16px" }} onClick={() => notifyApproved(approvedPremiumEmails)}>Avisar aprobados por Gmail ({approvedPremiumEmails.length})</button>
            <button className="btn ghost" style={{ width: "auto", padding: "9px 16px" }} onClick={() => copyToClipboard(approvedPremiumEmails.join(", "))}>Copiar emails</button>
          </div>
        )}
      </div>

      <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 20, lineHeight: 1.6 }}>
        El acceso al análisis ya no depende de un "pick" — quien queda aprobado puede ver todas las ligas y
        partidos sin límite, activándolo con su Gmail en "Ya pagué, quiero activar mi acceso".
      </p>
    </div>
  );
}
