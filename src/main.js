import { supabase } from './supabase.js';

// Spanish translation dictionary for markets
const MARKET_NAMES_ES = {
  'HITTER_SINGLES': 'Sencillos (1B)',
  'HITTER_TOTAL_BASES': 'Bases Totales',
  'HITTER_HITS': 'Hits Totales',
  'HITTER_HOME_RUNS': 'Home Runs',
  'HITTER_RUNS_BATTED_IN': 'Carreras Impulsadas (RBI)',
  'HITTER_RUNS': 'Carreras Anotadas',
  'HITTER_STOLEN_BASES': 'Bases Robadas',
  'HITTER_DOUBLE_SINGLES_TRIPLES': 'Hits Extra Base',
  'HITTER_DOUBLES': 'Dobles (2B)',
  'HITTER_TRIPLES': 'Triples (3B)',
  'HITTER_STRIKEOUTS': 'Ponches Recibidos',
  'PITCHER_STRIKEOUTS': 'Ponches (SO)',
  'PITCHER_EARNED_RUNS': 'Carreras Limpias (ER)',
  'PITCHER_OUTS': 'Outs Registrados',
  'PITCHER_HITS_ALLOWED': 'Hits Permitidos',
  'PITCHER_WALKS': 'Bases por Bolas Concedidas',
  'PITCHER_WALKS_ALLOWED': 'Bases por Bolas Concedidas (BB)',
  'HITTER_WALKS': 'Bases por Bolas Recibidas',
  'TEAM_RUNS': 'Carreras del Equipo',
  'TEAM_TOTAL_BASES': 'Bases Totales del Equipo',
  'TEAM_HITS': 'Hits del Equipo',
  'TEAM_RUNS_ALLOWED': 'Carreras Permitidas por el Equipo',
  'GAME_RUNS': 'Carreras del Partido',
  'HITTER_TOTAL_BASES_OVER': 'Bases Totales (Over)',
  'HITTER_RECORDED_AN_RBI': 'Registrar un RBI',
  'HITTER_HITS_PLUS_RUNS_PLUS_RUNS_BATTED_IN': 'Hits + Carreras + RBI (H+R+RBI)',
  'MONEY_LINE': 'Ganador del Partido (Moneyline)',
  'SPREAD': 'Hándicap / Línea de Carreras',
  'GAME_TOTAL': 'Total de Carreras/Goles del Partido',
  'TEAM_TOTAL': 'Total del Equipo',
  // ── Soccer / Fútbol markets ──────────────────────────────────────────────
  'SHOTS_ON_TARGET': 'Tiros a Puerta (Shots on Target)',
  'PLAYER_SHOTS': 'Tiros Totales (Shots)',
  'PLAYER_GOALS': 'Goles',
  'PLAYER_ASSISTS': 'Asistencias',
  'PLAYER_PASSES': 'Pases',
  'TEAM_GOALS': 'Goles del Equipo',
  'CORNER_KICKS': 'Tiros de Esquina (Córners)',
  'TEAM_CORNER_KICKS': 'Córners del Equipo',
  'YELLOW_CARDS': 'Tarjetas Amarillas',
  'FOULS': 'Faltas'
};

function getMarketNameES(marketName) {
  if (!marketName) return '';
  const cat = state.sport ? state.sport.toLowerCase() : '';
  const isSoccer = ['epl', 'ucl', 'laliga', 'seriea', 'ligue1', 'bundesliga', 'mls'].includes(cat);
  
  if (isSoccer) {
    if (marketName === 'TEAM_RUNS' || marketName === 'TEAM_TOTAL') return 'Goles del Equipo';
    if (marketName === 'GAME_RUNS' || marketName === 'GAME_TOTAL') return 'Goles del Partido';
    if (marketName === 'SPREAD') return 'Hándicap de Goles';
    if (marketName === 'SHOTS_ON_TARGET') return 'Tiros a Puerta';
    if (marketName === 'PLAYER_SHOTS') return 'Tiros Totales';
    if (marketName === 'PLAYER_GOALS') return 'Goles';
    if (marketName === 'PLAYER_ASSISTS') return 'Asistencias';
    if (marketName === 'PLAYER_PASSES') return 'Pases Realizados';
  }
  
  return MARKET_NAMES_ES[marketName] || formatRawName(marketName);
}

const MARKET_TO_STAT_PATH = {
  // ── MLB Hitter markets ──────────────────────────────────────────────────
  'HITTER_SINGLES': 'hitting.singles',
  'HITTER_TOTAL_BASES': 'hitting.totalBases',
  'HITTER_HITS': 'hitting.hits',
  'HITTER_HOME_RUNS': 'hitting.homeRuns',
  'HITTER_RUNS_BATTED_IN': 'hitting.runsBattedIn',
  'HITTER_RUNS': 'hitting.runs',
  'HITTER_STOLEN_BASES': 'hitting.stolenBases',
  'HITTER_WALKS': 'hitting.walks',
  'HITTER_STRIKEOUTS': 'hitting.strikeouts',
  'HITTER_HITS_PLUS_RUNS_PLUS_RUNS_BATTED_IN': 'hitting.hits', // computed below
  // ── MLB Pitcher markets ──────────────────────────────────────────────────
  'PITCHER_STRIKEOUTS': 'pitching.strikeouts',
  'PITCHER_EARNED_RUNS': 'pitching.earnedRuns',
  'PITCHER_OUTS': 'pitching.outs',
  'PITCHER_HITS_ALLOWED': 'pitching.hits',
  'PITCHER_WALKS': 'pitching.walks',
  'PITCHER_WALKS_ALLOWED': 'pitching.walks',
  // ── MLB Team markets ─────────────────────────────────────────────────────
  'TEAM_RUNS': 'offensive.runs',
  'TEAM_TOTAL_BASES': 'offensive.totalBases',
  'TEAM_HITS': 'offensive.hits',
  'TEAM_RUNS_ALLOWED': 'defensive.runs',
  'GAME_RUNS': 'offensive.runs',
  'MONEY_LINE': 'win',
  'SPREAD': 'offensive.runs',
  'GAME_TOTAL': 'offensive.runs',
  'TEAM_TOTAL': 'offensive.runs',
  // ── WNBA / NBA / Basketball player markets ───────────────────────────────
  'POINTS': 'points',
  'ASSISTS': 'assists',
  'REBOUNDS': 'rebounds',
  'STEALS': 'steals',
  'BLOCKS': 'blocks',
  'TURNOVERS': 'turnovers',
  'THREE_POINTS_MADE': 'threePointsMade',
  'POINTS_PLUS_REBOUNDS': '_computed_pts_reb',
  'POINTS_PLUS_ASSISTS': '_computed_pts_ast',
  'ASSISTS_PLUS_REBOUNDS': '_computed_ast_reb',
  'POINTS_PLUS_ASSISTS_PLUS_REBOUNDS': '_computed_pts_ast_reb',
  'DOUBLE_DOUBLE': '_computed_double_double',
  // ── WNBA / NBA quarter splits ────────────────────────────────────────────
  'POINTS_1Q': 'points1q',
  'ASSISTS_1Q': 'assists1q',
  'REBOUNDS_1Q': 'rebounds1q',
  'POINTS_2Q': 'points2q',
  'POINTS_3Q': 'points3q',
  'POINTS_4Q': 'points4q',
  // ── NFL player markets ───────────────────────────────────────────────────
  'PASSING_YARDS': 'passing.passingYards',
  'RUSHING_YARDS': 'rushing.rushingYards',
  'RECEIVING_YARDS': 'receiving.receivingYards',
  'RECEPTIONS': 'receiving.receptions',
  'PASSING_TOUCHDOWNS': 'passing.passingTouchdowns',
  'RUSHING_TOUCHDOWNS': 'rushing.rushingTouchdowns',
  'RECEIVING_TOUCHDOWNS': 'receiving.receivingTouchdowns',
};

// Application State
let state = {
  currentUser: null,
  userProfile: { subscription_tier: 'free' },
  isSupabaseConfigured: false,
  sport: 'mlb',
  activeTab: 'players', // 'players' | 'teams' | 'crossgame' | 'samegame'
  searchQuery: '',
  marketFilter: 'ALL',
  sortBy: 'hitRate',
  matchups: [],
  rawData: [],
  filteredData: [],
  selectedTrend: null,
  selectedParlayLegIndex: 0,
  playerGames: [],
  perGameMode: true,
  myPicks: JSON.parse(localStorage.getItem('myPicks') || '[]')
};

const isUrlConfigured = import.meta.env.VITE_SUPABASE_URL && !import.meta.env.VITE_SUPABASE_URL.includes('your-project-ref');
const isKeyConfigured = import.meta.env.VITE_SUPABASE_ANON_KEY && !import.meta.env.VITE_SUPABASE_ANON_KEY.includes('your-anon-key');
state.isSupabaseConfigured = !!(isUrlConfigured && isKeyConfigured);

document.addEventListener('DOMContentLoaded', () => {
  initAuth();
  initDOM();
  initPaywall();
  initMyPicks();
  initOCR();
  initManualBuilder();
  initChartExporter();
  initAdminPanel();
  window.addEventListener('resize', updateMobileViews);
});

// Responsive view toggle handler for mobile screens
function updateMobileViews() {
  const isMobile = window.innerWidth < 768;
  const aside = document.querySelector('aside');
  const main = document.querySelector('main');
  const slipRight = document.getElementById('betSlipRightCol');
  if (!aside || !main) return;
  
  if (isMobile) {
    if (state.selectedTrend) {
      aside.classList.add('hidden');
      main.classList.remove('hidden');
    } else {
      aside.classList.remove('hidden');
      main.classList.add('hidden');
    }
  } else {
    aside.classList.remove('hidden');
    main.classList.remove('hidden');
    if (slipRight) slipRight.classList.remove('hidden');
  }
}

// Authentication System
function initAuth() {
  const authOverlay = document.getElementById('authOverlay');
  const appContainer = document.getElementById('appContainer');
  const loginCard = document.getElementById('loginCard');
  const registerCard = document.getElementById('registerCard');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const switchToRegister = document.getElementById('switchToRegister');
  const switchToLogin = document.getElementById('switchToLogin');
  const loginError = document.getElementById('loginError');
  const registerError = document.getElementById('registerError');

  // Interactive mouse move logic for card tilt in 3D scene container
  const container = document.querySelector('.scene-container');
  if (container) {
    container.addEventListener('mousemove', (e) => {
      const activeCard = document.querySelector('.glass-card-3d:not(.hidden)');
      if (!activeCard) return;
      const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
      const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
      activeCard.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });

    container.addEventListener('mouseenter', () => {
      const activeCard = document.querySelector('.glass-card-3d:not(.hidden)');
      if (activeCard) activeCard.style.transition = 'none';
    });

    container.addEventListener('mouseleave', () => {
      const activeCard = document.querySelector('.glass-card-3d:not(.hidden)');
      if (activeCard) {
        activeCard.style.transition = 'transform 0.5s ease';
        activeCard.style.transform = `rotateY(-5deg) rotateX(5deg)`;
      }
    });
  }

  if (!state.isSupabaseConfigured) {
    const banner = document.createElement('div');
    banner.style.background = 'rgba(255, 179, 0, 0.1)';
    banner.style.border = '1px solid rgba(255, 179, 0, 0.2)';
    banner.style.padding = '12px';
    banner.style.borderRadius = '8px';
    banner.style.fontSize = '0.75rem';
    banner.style.color = '#ffb300';
    banner.style.marginBottom = '15px';
    banner.style.textAlign = 'center';
    banner.innerHTML = '⚠️ <strong>Modo Demostración</strong>: Usa credenciales locales de prueba.';
    loginForm.prepend(banner.cloneNode(true));
    registerForm.prepend(banner);
  }

  checkSession();

  async function checkSession() {
    if (state.isSupabaseConfigured) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          state.currentUser = session.user;
          await fetchUserProfile(session.user.id);
          unlockDashboard();
          return;
        }
      } catch (err) {
        console.error('Supabase Session check failed:', err);
      }
    } else {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        state.currentUser = JSON.parse(savedUser);
        state.userProfile = JSON.parse(localStorage.getItem('userProfile') || '{"subscription_tier": "free"}');
        unlockDashboard();
        return;
      }
    }
    
    authOverlay.classList.remove('hidden');
    appContainer.classList.add('hidden');
  }

  async function fetchUserProfile(userId) {
    if (!state.isSupabaseConfigured) return;
    try {
      let { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (!data) {
        const res = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();
        data = res.data;
      }
      
      if (data) {
        state.userProfile = data;
      } else {
        state.userProfile = { subscription_tier: 'free' };
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      state.userProfile = { subscription_tier: 'free' };
    }
  }

  switchToRegister.addEventListener('click', (e) => {
    e.preventDefault();
    loginCard.classList.add('hidden');
    registerCard.classList.remove('hidden');
    loginError.classList.add('hidden');
  });

  switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    registerCard.classList.add('hidden');
    loginCard.classList.remove('hidden');
    registerError.classList.add('hidden');
  });

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    loginError.classList.add('hidden');

    if (state.isSupabaseConfigured) {
      const submitBtn = loginForm.querySelector('button[type="submit"]');
      const origText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="tracking-wide">Entrando...</span>';

      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          let msg = 'Email o contraseña incorrectos.';
          if (error.message.includes('Email not confirmed')) {
            msg = 'Debes confirmar tu correo electrónico antes de iniciar sesión. (O desactiva "Confirm Email" en el panel de Supabase).';
          } else if (error.message.includes('Invalid login credentials')) {
            msg = 'Email o contraseña incorrectos.';
          } else if (error.message) {
            msg = error.message;
          }
          loginError.textContent = msg;
          loginError.classList.remove('hidden');
        } else {
          state.currentUser = data.user;
          await fetchUserProfile(data.user.id);
          unlockDashboard();
        }
      } catch (err) {
        loginError.textContent = 'Error de conexión con la base de datos.';
        loginError.classList.remove('hidden');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = origText;
      }
    } else {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        state.currentUser = user;
        state.userProfile = user.profile || { subscription_tier: 'free' };
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('userProfile', JSON.stringify(state.userProfile));
        unlockDashboard();
      } else {
        loginError.textContent = 'Credenciales de prueba incorrectas.';
        loginError.classList.remove('hidden');
      }
    }
  });

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPass = document.getElementById('registerConfirmPassword').value;
    registerError.classList.add('hidden');

    if (password.length < 6) {
      registerError.textContent = 'La contraseña debe tener al menos 6 caracteres.';
      registerError.classList.remove('hidden');
      return;
    }

    if (password !== confirmPass) {
      registerError.textContent = 'Las contraseñas no coinciden.';
      registerError.classList.remove('hidden');
      return;
    }

    if (state.isSupabaseConfigured) {
      const submitBtn = registerForm.querySelector('button[type="submit"]');
      const origText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="tracking-wide">Creando cuenta...</span>';

      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name }
          }
        });
        
        if (error) {
          let msg = error.message;
          if (msg.includes('already registered') || msg.includes('User already exists')) {
            msg = 'Este correo electrónico ya está registrado. Intenta iniciar sesión.';
          } else if (msg.includes('Password should be')) {
            msg = 'La contraseña debe tener al menos 6 caracteres.';
          } else if (msg.includes('invalid email')) {
            msg = 'Ingresa un correo electrónico válido.';
          }
          registerError.textContent = msg;
          registerError.classList.remove('hidden');
        } else if (data.session) {
          // If Supabase has email confirmation disabled, session is granted immediately!
          state.currentUser = data.user;
          await fetchUserProfile(data.user.id);
          unlockDashboard();
        } else {
          // Email confirmation is required by Supabase project settings
          alert('¡Registro enviado! Si la confirmación de correo está activa en tu Supabase, revisa tu casilla para confirmar. Si no, intenta iniciar sesión.');
          registerCard.classList.add('hidden');
          loginCard.classList.remove('hidden');
        }
      } catch (err) {
        registerError.textContent = 'Error al registrar: ' + (err.message || 'Error de conexión');
        registerError.classList.remove('hidden');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = origText;
      }
    } else {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.some(u => u.email === email)) {
        registerError.textContent = 'Este email ya está registrado.';
        registerError.classList.remove('hidden');
        return;
      }
      
      const newUser = {
        name,
        email,
        password,
        profile: { subscription_tier: 'free' }
      };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      state.currentUser = newUser;
      state.userProfile = newUser.profile;
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      localStorage.setItem('userProfile', JSON.stringify(state.userProfile));
      unlockDashboard();
    }
  });

  document.getElementById('logoutBtn').addEventListener('click', async () => {
    if (state.isSupabaseConfigured) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('userProfile');
    }
    state.currentUser = null;
    state.userProfile = { subscription_tier: 'free' };
    authOverlay.classList.remove('hidden');
    appContainer.classList.add('hidden');
    clearInspector();
    updateMobileViews();
  });
}

function unlockDashboard() {
  document.getElementById('authOverlay').classList.add('hidden');
  document.getElementById('appContainer').classList.remove('hidden');
  
  const user = state.currentUser;
  const displayName = state.isSupabaseConfigured 
    ? (user.user_metadata?.full_name || user.email)
    : user.name;
  
  const tier = state.userProfile?.subscription_tier || 'free';
  const isAdmin = tier === 'admin' || user.email === 'garciayoan2002@gmail.com';
  const isVip = tier === 'vip';
  const nameLabel = document.getElementById('userDisplayName');
  
  if (isAdmin) {
    nameLabel.innerHTML = `${displayName} <span class="bg-primary/20 text-primary-container text-[8px] font-black px-1.5 py-0.5 rounded ml-1">ADMIN</span>`;
  } else if (isVip) {
    nameLabel.innerHTML = `${displayName} <span style="background: rgba(212,175,55,0.2); color: #d4af37;" class="text-[8px] font-black px-1.5 py-0.5 rounded ml-1">VIP</span>`;
  } else {
    nameLabel.textContent = displayName;
  }
  
  document.getElementById('userAvatarChar').textContent = displayName.charAt(0).toUpperCase();

  // Show admin button for admin users
  if (isAdmin) {
    const adminAddPickBtn = document.getElementById('adminAddPickBtn');
    if (adminAddPickBtn) adminAddPickBtn.classList.remove('hidden');
  }

  updateMobileViews();
  loadTrendsData();
}

// Bind DOM controls
function initDOM() {
  const sportSelect = document.getElementById('sportSelect');
  sportSelect.addEventListener('change', (e) => {
    state.sport = e.target.value;
    state.selectedTrend = null;
    state.marketFilter = 'ALL';
    clearInspector();
    loadTrendsData();
    updateMobileViews();
  });

  const listTabs = document.querySelectorAll('.list-tab');
  listTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      listTabs.forEach(t => {
        t.classList.remove('active', 'bg-primary-container', 'text-on-primary', 'font-bold');
        t.classList.add('bg-surface-container-high', 'text-on-surface-variant');
        // Restore VIP tab golden style
        if (t.dataset.tab === 'vip') {
          t.style.color = '#d4af37';
          t.style.border = '1px solid rgba(212,175,55,0.3)';
        }
      });
      e.currentTarget.classList.add('active', 'bg-primary-container', 'text-on-primary', 'font-bold');
      e.currentTarget.classList.remove('bg-surface-container-high', 'text-on-surface-variant');
      if (e.currentTarget.dataset.tab === 'vip') {
        e.currentTarget.style.color = '#0b0e11';
        e.currentTarget.style.border = 'none';
        e.currentTarget.style.background = 'linear-gradient(135deg, #d4af37, #b8941f)';
      }
      
      state.activeTab = e.currentTarget.dataset.tab;
      state.selectedTrend = null;
      state.marketFilter = 'ALL';
      clearInspector();

      const trendsWrapper = document.getElementById('trendsListWrapper');
      const vipWrapper = document.getElementById('vipPicksWrapper');
      const vipBlocked = document.getElementById('vipBlockedScreen');
      const marketFilterGroup = document.getElementById('marketFilter');
      const searchInput = document.getElementById('searchInput');
      const sortBy = document.getElementById('sortBy');

      if (state.activeTab === 'vip') {
        // Hide normal trends, show VIP content
        trendsWrapper.classList.add('hidden');
        marketFilterGroup.parentElement.classList.add('hidden');
        searchInput.parentElement.classList.add('hidden');
        
        const tier = state.userProfile?.subscription_tier || 'free';
        if (tier === 'vip' || tier === 'admin') {
          vipWrapper.classList.remove('hidden');
          vipBlocked.classList.add('hidden');
          vipBlocked.style.display = 'none';
          loadVipPicks();
        } else {
          vipWrapper.classList.add('hidden');
          vipBlocked.classList.remove('hidden');
          vipBlocked.style.display = 'flex';
        }
      } else {
        // Show normal trends, hide VIP content
        trendsWrapper.classList.remove('hidden');
        marketFilterGroup.parentElement.classList.remove('hidden');
        searchInput.parentElement.classList.remove('hidden');
        vipWrapper.classList.add('hidden');
        vipBlocked.classList.add('hidden');
        vipBlocked.style.display = 'none';

        if (state.activeTab === 'samegame' || state.activeTab === 'crossgame') {
          marketFilterGroup.classList.add('hidden');
        } else {
          marketFilterGroup.classList.remove('hidden');
        }
        loadTrendsData();
      }
      updateMobileViews();
    });
  });

  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value.toLowerCase().trim();
    applyFiltersAndRender();
  });

  const marketFilter = document.getElementById('marketFilter');
  marketFilter.addEventListener('change', (e) => {
    state.marketFilter = e.target.value;
    loadTrendsData();
  });

  const sortBy = document.getElementById('sortBy');
  sortBy.addEventListener('change', (e) => {
    state.sortBy = e.target.value;
    applyFiltersAndRender();
  });

  const backBtn = document.getElementById('detailsBackBtn');
  backBtn.addEventListener('click', () => {
    state.selectedTrend = null;
    clearInspector();
    updateMobileViews();
  });

  const togglePerGame = document.getElementById('togglePerGame');
  const toggleTotal = document.getElementById('toggleTotal');

  togglePerGame.addEventListener('click', () => {
    togglePerGame.classList.add('bg-primary-container', 'text-on-primary');
    togglePerGame.classList.remove('hover:bg-surface-container-high', 'text-on-surface-variant');
    toggleTotal.classList.remove('bg-primary-container', 'text-on-primary');
    toggleTotal.classList.add('hover:bg-surface-container-high', 'text-on-surface-variant');
    state.perGameMode = true;
    renderDetailsStats(state.selectedTrend?.legs?.[state.selectedParlayLegIndex] || state.selectedTrend);
  });

  toggleTotal.addEventListener('click', () => {
    toggleTotal.classList.add('bg-primary-container', 'text-on-primary');
    toggleTotal.classList.remove('hover:bg-surface-container-high', 'text-on-surface-variant');
    togglePerGame.classList.remove('bg-primary-container', 'text-on-primary');
    togglePerGame.classList.add('hover:bg-surface-container-high', 'text-on-surface-variant');
    state.perGameMode = false;
    renderDetailsStats(state.selectedTrend?.legs?.[state.selectedParlayLegIndex] || state.selectedTrend);
  });

  document.getElementById('listRetryBtn').addEventListener('click', () => {
    loadTrendsData();
  });
}

// Subscription Paywall Modal
function initPaywall() {
  const paywallOverlay = document.getElementById('paywallOverlay');
  const paywallCloseBtn = document.getElementById('paywallCloseBtn');
  const paywallUpgradeBtn = document.getElementById('paywallUpgradeBtn');
  const cashtagCopyBtn = document.getElementById('cashtagCopyBtn');

  cashtagCopyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText('$Peluka1105');
    cashtagCopyBtn.textContent = 'Copiado!';
    setTimeout(() => {
      cashtagCopyBtn.textContent = 'Copiar';
    }, 2000);
  });

  paywallCloseBtn.addEventListener('click', () => {
    paywallOverlay.classList.add('hidden');
  });

  paywallUpgradeBtn.addEventListener('click', async () => {
    const cashtagInput = document.getElementById('paywallCashtagInput').value.trim();
    if (!cashtagInput) {
      alert('Por favor, ingresa tu Cashtag (ej: $juan12) para verificar tu pago.');
      return;
    }

    paywallUpgradeBtn.disabled = true;
    paywallUpgradeBtn.textContent = 'Verificando pago...';

    if (state.isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ subscription_tier: 'paid' })
          .eq('id', state.currentUser.id);
        
        if (error) throw error;
        
        state.userProfile.subscription_tier = 'paid';
        alert(`¡Pago enviado! Verificando Cashtag ${cashtagInput}. Acceso Premium activado.`);
        paywallOverlay.classList.add('hidden');
        renderDetailsPaneOnly();
      } catch (err) {
        alert('Error al activar: ' + err.message);
      } finally {
        paywallUpgradeBtn.disabled = false;
        paywallUpgradeBtn.textContent = 'Confirmar y Activar Premium';
      }
    } else {
      setTimeout(() => {
        state.userProfile.subscription_tier = 'paid';
        localStorage.setItem('userProfile', JSON.stringify(state.userProfile));
        alert(`¡Pago enviado! Verificando Cashtag ${cashtagInput}. Acceso Premium de prueba activado.`);
        paywallOverlay.classList.add('hidden');
        renderDetailsPaneOnly();
        paywallUpgradeBtn.disabled = false;
        paywallUpgradeBtn.textContent = 'Confirmar y Activar Premium';
      }, 1200);
    }
  });
}

// "Mis Picks" (Bet Slip) Logic
function initMyPicks() {
  const addRemoveBtn = document.getElementById('addRemovePickBtn');
  const clearBtn = document.getElementById('clearBetSlipBtn');
  const mobileTrigger = document.getElementById('mobileBetSlipTrigger');
  const mobileClose = document.getElementById('betSlipMobileCloseBar');
  const slipRight = document.getElementById('betSlipRightCol');

  if (mobileTrigger) {
    mobileTrigger.addEventListener('click', () => {
      slipRight.classList.remove('hidden');
      slipRight.classList.add('flex');
    });
  }
  if (mobileClose) {
    mobileClose.addEventListener('click', () => {
      slipRight.classList.add('hidden');
      slipRight.classList.remove('flex');
    });
  }

  addRemoveBtn.addEventListener('click', () => {
    const trend = state.selectedTrend;
    if (!trend) return;

    const isParlay = (state.activeTab === 'samegame' || state.activeTab === 'crossgame') && !trend.isCustom;
    const activeTarget = isParlay ? (trend.legs[state.selectedParlayLegIndex] || trend.legs[0]) : trend;

    const title = activeTarget.player ? activeTarget.player.fullName : activeTarget.team.name;
    const market = activeTarget.market.name;
    const line = activeTarget.line;
    const outcome = activeTarget.outcome;

    const pickKey = `${title}_${market}_${line}_${outcome}`;
    const matchIndex = state.myPicks.findIndex(p => `${p.title}_${p.market}_${p.line}_${p.outcome}` === pickKey);

    if (matchIndex >= 0) {
      state.myPicks.splice(matchIndex, 1);
    } else {
      let rateVal = 100;
      if (state.playerGames && state.playerGames.length > 0) {
        const rec = getHitRecord(state.playerGames.slice(0, 10), market, line, outcome);
        rateVal = rec.hitRate;
      } else if (activeTarget.signals?.[0]?.hitRecord?.hitRate) {
        rateVal = activeTarget.signals[0].hitRecord.hitRate;
      }
      
      state.myPicks.push({ title, market, line, outcome, hitRate: rateVal });
    }

    localStorage.setItem('myPicks', JSON.stringify(state.myPicks));
    updateBetSlip();
    updateAddRemoveBtnState();
  });

  clearBtn.addEventListener('click', () => {
    state.myPicks = [];
    localStorage.setItem('myPicks', '[]');
    updateBetSlip();
    updateAddRemoveBtnState();
  });

  updateBetSlip();
}

function updateAddRemoveBtnState() {
  const trend = state.selectedTrend;
  const btn = document.getElementById('addRemovePickBtn');
  const textSpan = document.getElementById('addRemovePickText');
  const icon = document.getElementById('bookmarkIcon');
  if (!trend || !btn) return;

  const isParlay = (state.activeTab === 'samegame' || state.activeTab === 'crossgame') && !trend.isCustom;
  const activeTarget = isParlay ? (trend.legs[state.selectedParlayLegIndex] || trend.legs[0]) : trend;

  const title = activeTarget.player ? activeTarget.player.fullName : activeTarget.team.name;
  const market = activeTarget.market.name;
  const line = activeTarget.line;
  const outcome = activeTarget.outcome;

  const pickKey = `${title}_${market}_${line}_${outcome}`;
  const exists = state.myPicks.some(p => `${p.title}_${p.market}_${p.line}_${p.outcome}` === pickKey);

  if (exists) {
    textSpan.textContent = "Quitar de Mis Picks";
    icon.style.fontVariationSettings = "'FILL' 1";
    btn.classList.add('bg-primary-container/10', 'border-primary-container/30', 'text-primary-container');
    btn.classList.remove('bg-surface-container', 'border-outline-variant', 'text-on-surface');
  } else {
    textSpan.textContent = "Agregar a Mis Picks";
    icon.style.fontVariationSettings = "'FILL' 0";
    btn.classList.remove('bg-primary-container/10', 'border-primary-container/30', 'text-primary-container');
    btn.classList.add('bg-surface-container', 'border-outline-variant', 'text-on-surface');
  }
}

function updateBetSlip() {
  const list = document.getElementById('betSlipList');
  const count = document.getElementById('betSlipCount');
  const mobileCount = document.getElementById('mobilePicksCount');
  const combined = document.getElementById('combinedHitRate');
  if (!list) return;

  count.textContent = state.myPicks.length;
  if (mobileCount) mobileCount.textContent = state.myPicks.length;

  if (state.myPicks.length === 0) {
    list.innerHTML = `
      <div class="text-center py-6 text-on-surface-variant text-[11px] opacity-60">
        No has agregado ningún pick. ¡Toca "Agregar a Mis Picks" en los detalles de cualquier jugador!
      </div>
    `;
    combined.textContent = '0%';
    return;
  }

  let combinedProduct = 1.0;

  list.innerHTML = state.myPicks.map((pick, index) => {
    const rate = pick.hitRate || 0;
    combinedProduct *= (rate / 100);

    const rateColor = rate >= 75 ? 'text-green-400' : (rate >= 50 ? 'text-amber-400' : 'text-red-400');
    const outcomeColor = pick.outcome === 'under' ? 'text-red-400' : 'text-green-400';
    const marketNameTranslated = MARKET_NAMES_ES[pick.market] || formatRawName(pick.market);

    return `
      <div class="bg-white/5 border border-outline-variant/30 rounded-xl p-3 flex justify-between items-center gap-2">
        <div class="overflow-hidden">
          <h4 class="font-bold text-xs truncate text-on-surface">${pick.title}</h4>
          <p class="text-[10px] text-on-surface-variant mt-0.5 truncate">
            <span class="${outcomeColor} font-bold mr-1">${pick.outcome.toUpperCase()}</span> ${pick.line} ${marketNameTranslated}
          </p>
        </div>
        <div class="flex items-center gap-3 shrink-0">
          <span class="font-bold text-xs ${rateColor}">${Math.round(rate)}%</span>
          <button class="text-red-400 hover:text-red-300 font-bold text-sm cursor-pointer p-1" onclick="removePickFromSlip(${index})">&times;</button>
        </div>
      </div>
    `;
  }).join('');

  const combinedPct = Math.round(combinedProduct * 100);
  combined.textContent = `${combinedPct}%`;
}

window.removePickFromSlip = function(index) {
  state.myPicks.splice(index, 1);
  localStorage.setItem('myPicks', JSON.stringify(state.myPicks));
  updateBetSlip();
  updateAddRemoveBtnState();
};

// OCR Drag-and-Drop Image Parser (Tesseract.js)
function initOCR() {
  const box = document.getElementById('photoUploadBox');
  const fileInput = document.getElementById('photoFileInput');
  const status = document.getElementById('uploadStatusText');

  if (!box || !fileInput) return;

  fileInput.addEventListener('change', (e) => {
    const file = fileInput.files[0];
    if (file) handleImageFile(file);
  });

  box.addEventListener('dragover', (e) => {
    e.preventDefault();
    box.classList.add('border-primary-container', 'bg-white/[0.04]');
  });

  box.addEventListener('dragleave', () => {
    box.classList.remove('border-primary-container', 'bg-white/[0.04]');
  });

  box.addEventListener('drop', (e) => {
    e.preventDefault();
    box.classList.remove('border-primary-container', 'bg-white/[0.04]');
    const file = e.dataTransfer.files[0];
    if (file) handleImageFile(file);
  });

  function handleImageFile(file) {
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecciona un archivo de imagen válido (PNG, JPG).');
      return;
    }

    status.textContent = 'Leyendo foto con OCR...';
    
    Tesseract.recognize(file, 'eng')
      .then(({ data: { text } }) => {
        parseOCRText(text);
      })
      .catch(err => {
        console.error(err);
        status.textContent = 'Error al leer imagen';
        setTimeout(() => { status.textContent = 'Arrastra o selecciona foto'; }, 3000);
      });
  }

  function parseOCRText(text) {
    const lowerText = text.toLowerCase();
    console.log("OCR Recognized Text:\n", text);

    // Collect all players currently loaded in feed
    const players = [];
    const seen = new Set();
    state.rawData.forEach(item => {
      if (item.player && item.player.SRGUID && !seen.has(item.player.SRGUID)) {
        seen.add(item.player.SRGUID);
        players.push(item.player);
      }
    });

    // Match player
    const matchedPlayer = players.find(p => 
      lowerText.includes(p.fullName.toLowerCase()) || 
      (p.lastName.length > 3 && lowerText.includes(p.lastName.toLowerCase()))
    );

    if (!matchedPlayer) {
      // Match team
      const teams = [];
      const seenTeams = new Set();
      state.rawData.forEach(item => {
        if (item.team && item.team.code && !seenTeams.has(item.team.code)) {
          seenTeams.add(item.team.code);
          teams.push(item.team);
        }
      });

      const matchedTeam = teams.find(t => 
        lowerText.includes(t.name.toLowerCase()) || 
        lowerText.includes(t.code.toLowerCase())
      );

      if (!matchedTeam) {
        status.textContent = 'No se reconoció jugador/equipo';
        alert('No pudimos detectar ningún jugador o equipo conocido en la imagen. Usa el "Constructor Manual" abajo.');
        setTimeout(() => { status.textContent = 'Arrastra o selecciona foto'; }, 3000);
        return;
      }

      parseBetPropertiesAndSelect(matchedTeam, 'team', lowerText);
      return;
    }

    parseBetPropertiesAndSelect(matchedPlayer, 'player', lowerText);
  }

  function parseBetPropertiesAndSelect(target, type, lowerText) {
    const isMoneyline = lowerText.includes('moneyline') || lowerText.includes('money line') || lowerText.includes('ganador') || lowerText.includes('to win');
    
    let matchedMarket = 'HITTER_HITS';
    let matchedLine = 0.5;
    let matchedOutcome = 'over';

    if (isMoneyline) {
      matchedMarket = 'MONEY_LINE';
      matchedLine = 0.5;
      matchedOutcome = 'over';
    } else {
      if (type === 'player') {
        if (lowerText.includes('strikeout') || lowerText.includes('ponche') || lowerText.includes('so') || lowerText.includes('pitcher strike')) {
          matchedMarket = 'PITCHER_STRIKEOUTS';
        } else if (lowerText.includes('single') || lowerText.includes('sencillo')) {
          matchedMarket = 'HITTER_SINGLES';
        } else if (lowerText.includes('double') || lowerText.includes('doble')) {
          matchedMarket = 'HITTER_DOUBLES';
        } else if (lowerText.includes('home run') || lowerText.includes('hr') || lowerText.includes('jonron')) {
          matchedMarket = 'HITTER_HOME_RUNS';
        } else if (lowerText.includes('rbi') || lowerText.includes('impulsada') || lowerText.includes('batted')) {
          matchedMarket = 'HITTER_RUNS_BATTED_IN';
        } else if (lowerText.includes('run') || lowerText.includes('carrera')) {
          matchedMarket = 'HITTER_RUNS';
        } else if (lowerText.includes('walk') || lowerText.includes('bb') || lowerText.includes('base on ball')) {
          matchedMarket = 'PITCHER_WALKS_ALLOWED';
        } else if (lowerText.includes('base') || lowerText.includes('tb')) {
          matchedMarket = 'HITTER_TOTAL_BASES';
        }
      } else {
        if (lowerText.includes('run') || lowerText.includes('carrera')) {
          if (lowerText.includes('allow') || lowerText.includes('permitida') || lowerText.includes('contra')) {
            matchedMarket = 'TEAM_RUNS_ALLOWED';
          } else {
            matchedMarket = 'TEAM_RUNS';
          }
        } else if (lowerText.includes('hit')) {
          matchedMarket = 'TEAM_HITS';
        } else if (lowerText.includes('base')) {
          matchedMarket = 'TEAM_TOTAL_BASES';
        } else if (lowerText.includes('spread') || lowerText.includes('handicap') || lowerText.includes('run line') || lowerText.includes('runline')) {
          matchedMarket = 'SPREAD';
        } else if (lowerText.includes('total')) {
          matchedMarket = 'GAME_TOTAL';
        }
      }

      // 1. Look for decimals ending in .5
      const decimalMatch = lowerText.match(/\b\d+\.5\b/);
      if (decimalMatch) {
        matchedLine = parseFloat(decimalMatch[0]);
      } else {
        // 2. Look next to condition keywords
        const condNumMatch = lowerText.match(/(over|under|more|less|más|menos|\+|-|>|<)\s*(\d+(\.\d+)?)\b/);
        if (condNumMatch) {
          matchedLine = parseFloat(condNumMatch[2]);
        } else {
          // 3. Match any small isolated positive number between 0.5 and 15
          const allNumbers = lowerText.match(/\b\d+(\.\d+)?\b/g) || [];
          for (let numStr of allNumbers) {
            const val = parseFloat(numStr);
            if (val >= 0.5 && val <= 15.0) {
              matchedLine = val;
              break;
            }
          }
        }
      }

      // Outcome Over/Under matching helper
      if (lowerText.includes('under') || lowerText.includes('menos') || lowerText.includes('<')) {
        matchedOutcome = 'under';
      } else {
        const minusLineMatch = lowerText.match(/-\s*\d+(\.5)?\b/);
        if (minusLineMatch) {
          const val = parseFloat(minusLineMatch[0]);
          if (Math.abs(val) < 20) {
            matchedOutcome = 'under';
          }
        }
      }
    }

    const customTrend = {
      id: 'custom_ocr_' + Date.now(),
      isCustom: true,
      outcome: matchedOutcome,
      line: matchedLine,
      market: { name: matchedMarket },
      opposingTeam: { code: 'OPP' }
    };

    if (type === 'player') {
      customTrend.player = target;
      customTrend.team = { code: 'MLB' };
    } else {
      customTrend.team = target;
    }

    status.textContent = '¡Importado!';
    setTimeout(() => { status.textContent = 'Arrastra o selecciona foto'; }, 3000);

    state.selectedTrend = customTrend;
    selectTrend(customTrend);
  }
}

// Manual Prop / Custom Bet builder autocomplete widget
function initManualBuilder() {
  const typePlayerBtn = document.getElementById('builderTypePlayerBtn');
  const typeTeamBtn = document.getElementById('builderTypeTeamBtn');
  const searchInput = document.getElementById('builderTargetSearch');
  const autocomplete = document.getElementById('builderAutocompleteMenu');
  const marketSelect = document.getElementById('builderMarketSelect');
  const analyzeBtn = document.getElementById('builderAnalyzeBtn');

  let selectedType = 'player'; // 'player' | 'team'
  let selectedTargetGUID = '';
  let selectedTargetName = '';

  typePlayerBtn.addEventListener('click', () => {
    selectedType = 'player';
    selectedTargetGUID = '';
    selectedTargetName = '';
    searchInput.value = '';
    searchInput.placeholder = 'Escribe el nombre del jugador...';
    typePlayerBtn.className = 'flex-1 py-1 rounded font-bold bg-primary-container text-on-primary cursor-pointer';
    typeTeamBtn.className = 'flex-1 py-1 rounded font-bold text-on-surface-variant hover:bg-surface-container-high cursor-pointer';
    populateMarkets();
  });

  typeTeamBtn.addEventListener('click', () => {
    selectedType = 'team';
    selectedTargetGUID = '';
    selectedTargetName = '';
    searchInput.value = '';
    searchInput.placeholder = 'Escribe el nombre del equipo...';
    typeTeamBtn.className = 'flex-1 py-1 rounded font-bold bg-primary-container text-on-primary cursor-pointer';
    typePlayerBtn.className = 'flex-1 py-1 rounded font-bold text-on-surface-variant hover:bg-surface-container-high cursor-pointer';
    populateMarkets();
  });

  function populateMarkets() {
    marketSelect.innerHTML = '';
    if (selectedType === 'player') {
      const pMarkets = [
        'HITTER_SINGLES', 'HITTER_TOTAL_BASES', 'HITTER_HITS', 'HITTER_HOME_RUNS', 
        'HITTER_RUNS_BATTED_IN', 'HITTER_RUNS', 'HITTER_STOLEN_BASES', 
        'PITCHER_STRIKEOUTS', 'PITCHER_EARNED_RUNS', 'PITCHER_OUTS', 
        'PITCHER_HITS_ALLOWED', 'PITCHER_WALKS_ALLOWED'
      ];
      pMarkets.forEach(m => {
        marketSelect.innerHTML += `<option value="${m}">${MARKET_NAMES_ES[m] || m}</option>`;
      });
    } else {
      const tMarkets = ['MONEY_LINE', 'SPREAD', 'GAME_TOTAL', 'TEAM_RUNS', 'TEAM_TOTAL_BASES', 'TEAM_HITS', 'TEAM_RUNS_ALLOWED'];
      tMarkets.forEach(m => {
        marketSelect.innerHTML += `<option value="${m}">${MARKET_NAMES_ES[m] || m}</option>`;
      });
    }
  }
  populateMarkets();

  searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase().trim();
    if (!q) {
      autocomplete.classList.add('hidden');
      return;
    }

    let list = [];
    if (selectedType === 'player') {
      const seen = new Set();
      state.rawData.forEach(item => {
        if (item.player && item.player.SRGUID && !seen.has(item.player.SRGUID)) {
          seen.add(item.player.SRGUID);
          if (item.player.fullName.toLowerCase().includes(q)) {
            list.push({ name: item.player.fullName, id: item.player.SRGUID });
          }
        }
      });
    } else {
      const seenTeams = new Set();
      state.rawData.forEach(item => {
        if (item.team && item.team.code && !seenTeams.has(item.team.code)) {
          seenTeams.add(item.team.code);
          if (item.team.name.toLowerCase().includes(q)) {
            list.push({ name: item.team.name, id: item.team.code });
          }
        }
      });
    }

    if (list.length === 0) {
      autocomplete.innerHTML = '<div class="p-2.5 text-on-surface-variant italic">No se encontraron resultados</div>';
    } else {
      autocomplete.innerHTML = list.map(item => `
        <div class="p-2.5 hover:bg-white/5 cursor-pointer border-b border-outline-variant/10 last:border-0" data-id="${item.id}" data-name="${item.name}">
          ${item.name}
        </div>
      `).join('');
    }

    autocomplete.classList.remove('hidden');

    autocomplete.querySelectorAll('div[data-id]').forEach(item => {
      item.addEventListener('click', () => {
        selectedTargetGUID = item.dataset.id;
        selectedTargetName = item.dataset.name;
        searchInput.value = selectedTargetName;
        autocomplete.classList.add('hidden');
      });
    });
  });

  document.addEventListener('click', (e) => {
    if (e.target !== searchInput && e.target !== autocomplete) {
      autocomplete.classList.add('hidden');
    }
  });

  analyzeBtn.addEventListener('click', () => {
    if (!selectedTargetGUID) {
      alert('Por favor, selecciona un jugador o equipo de la lista desplegable de búsqueda.');
      return;
    }

    const customTrend = {
      id: 'custom_' + Date.now(),
      isCustom: true,
      outcome: document.getElementById('builderOutcomeSelect').value,
      line: parseFloat(document.getElementById('builderLineInput').value) || 0.5,
      market: { name: marketSelect.value },
      opposingTeam: { code: 'OPP' }
    };

    if (selectedType === 'player') {
      customTrend.player = {
        fullName: selectedTargetName,
        lastName: selectedTargetName.split(' ').pop(),
        SRGUID: selectedTargetGUID
      };
      customTrend.team = { code: 'MLB' };
    } else {
      customTrend.team = {
        name: selectedTargetName,
        code: selectedTargetGUID
      };
    }

    state.selectedTrend = customTrend;
    selectTrend(customTrend);
  });
}

// html2canvas dynamic image downloader exporter
function initChartExporter() {
  const downloadBtn = document.getElementById('downloadChartBtn');
  if (!downloadBtn) return;

  downloadBtn.addEventListener('click', () => {
    const area = document.getElementById('chartCaptureArea');
    if (!area) return;

    const originalText = downloadBtn.innerHTML;
    downloadBtn.innerHTML = `<span class="animate-spin material-symbols-outlined text-[16px] mr-1">progress_activity</span><span>Guardando...</span>`;
    downloadBtn.disabled = true;

    // Use window.html2canvas to bypass bundler resolution and resolve CORS
    window.html2canvas(area, {
      backgroundColor: '#1e2024',
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      onclone: (clonedDoc) => {
        // Inject a <style> to globally override all backdrop-filter/filter
        // This prevents html2canvas crashes in Chrome/Firefox/Safari
        const styleEl = clonedDoc.createElement('style');
        styleEl.textContent = `* {
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          filter: none !important;
          -webkit-filter: none !important;
        }`;
        clonedDoc.head.appendChild(styleEl);
        // Also strip inline styles to be safe
        clonedDoc.querySelectorAll('*').forEach(el => {
          el.style.backdropFilter = 'none';
          el.style.webkitBackdropFilter = 'none';
          el.style.filter = 'none';
          el.style.webkitFilter = 'none';
        });
      }
    }).then(canvas => {
      const link = document.createElement('a');
      const playerName = document.getElementById('detailPlayerName')?.textContent || 'trend';
      const propTitle = document.getElementById('detailPropTitle')?.textContent || 'chart';

      const filename = `${playerName.replace(/\s+/g, '_')}_${propTitle.replace(/\s+/g, '_')}.png`;
      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      link.click();

      downloadBtn.innerHTML = originalText;
      downloadBtn.disabled = false;
    }).catch(err => {
      console.error('Error generating image export:', err);
      alert('Error al generar la imagen de la gráfica.');
      downloadBtn.innerHTML = originalText;
      downloadBtn.disabled = false;
    });
  });
}

// ── TheSportsDB player photo fetcher ──────────────────────────────────────────
// Uses the free public API (v1/json/3) to get official player cutout images.
// Results are cached in memory to avoid duplicate network calls.
const _tsdbPhotoCache = {};
async function fetchPlayerPhotoFromSportsDB(playerFullName) {
  if (!playerFullName) return null;
  if (_tsdbPhotoCache[playerFullName] !== undefined) return _tsdbPhotoCache[playerFullName];
  try {
    const query = playerFullName.trim().replace(/\s+/g, '_');
    const res = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(query)}`);
    if (!res.ok) { _tsdbPhotoCache[playerFullName] = null; return null; }
    const data = await res.json();
    const p = data?.player?.[0];
    // Prefer strCutout (transparent PNG) then strThumb (JPEG headshot)
    const photoUrl = p?.strCutout || p?.strThumb || null;
    _tsdbPhotoCache[playerFullName] = photoUrl;
    return photoUrl;
  } catch (e) {
    _tsdbPhotoCache[playerFullName] = null;
    return null;
  }
}

function clearInspector() {
  document.getElementById('detailsEmptyState').classList.remove('hidden');
  document.getElementById('detailsContent').classList.add('hidden');
  document.getElementById('detailsLoadingState').classList.add('hidden');
}

// Fetch dynamic sports statistics
async function loadTrendsData() {
  const loading = document.getElementById('listLoadingState');
  const errorState = document.getElementById('listErrorState');
  const list = document.getElementById('trendsList');

  loading.classList.remove('hidden');
  errorState.classList.add('hidden');
  list.innerHTML = '';

  let url = '';
  if (state.activeTab === 'players') {
    url = `/api/${state.sport}/v1/trends/straights?limit=500&lineTypes=MAIN&trendTypes=PLAYER`;
  } else if (state.activeTab === 'teams') {
    url = `/api/${state.sport}/v1/trends/straights?limit=300&lineTypes=MAIN&trendTypes=TEAM`;
  } else if (state.activeTab === 'crossgame') {
    url = `/api/${state.sport}/v1/trends/parlays?limit=150&parlayType=CROSS_GAME&lineTypes=MAIN`;
  } else if (state.activeTab === 'samegame') {
    url = `/api/${state.sport}/v1/trends/parlays?limit=150&parlayType=SAME_GAME&lineTypes=MAIN`;
  }

  const providers = 'betmgm,betrivers,betrpicks,fanduel,caesars,dabble,draftkings,fanatics,hardrock,novig,prizepicks,prophetx,sleeper,underdog,fliff,bet365';
  url += `&preferredProviders=${encodeURIComponent(providers)}`;

  if (state.marketFilter !== 'ALL' && (state.activeTab === 'players' || state.activeTab === 'teams')) {
    url += `&markets=${encodeURIComponent(state.marketFilter)}`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('API status code ' + response.status);
    const data = await response.json();
    state.rawData = data;
    
    // Only repopulate the dropdown if we fetched all markets
    if (state.marketFilter === 'ALL' && (state.activeTab === 'players' || state.activeTab === 'teams')) {
      populateMarketDropdown(data);
    }
    
    applyFiltersAndRender();
  } catch (error) {
    console.error('Error fetching trends:', error);
    document.getElementById('listErrorMessage').textContent = 'Error al conectar con el servidor deportivo: ' + error.message;
    loading.classList.add('hidden');
    errorState.classList.remove('hidden');
  }
}

// Populating filter options dynamically
function populateMarketDropdown(data) {
  const select = document.getElementById('marketFilter');
  const uniqueMarkets = new Set();
  
  data.forEach(item => {
    if (item.market && item.market.name) {
      uniqueMarkets.add(item.market.name);
    }
  });

  const originalValue = state.marketFilter;
  select.innerHTML = '<option value="ALL">Todos los Mercados</option>';
  
  Array.from(uniqueMarkets).sort().forEach(market => {
    const nameEs = MARKET_NAMES_ES[market] || formatRawName(market);
    select.innerHTML += `<option value="${market}">${nameEs}</option>`;
  });

  if (uniqueMarkets.has(originalValue)) {
    select.value = originalValue;
    state.marketFilter = originalValue;
  } else {
    select.value = 'ALL';
    state.marketFilter = 'ALL';
  }
}

function formatRawName(rawName) {
  return rawName
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, c => c.toUpperCase());
}

// Apply Filters & Search query
function applyFiltersAndRender() {
  const loading = document.getElementById('listLoadingState');
  const list = document.getElementById('trendsList');
  
  let data = [...state.rawData];

  if (state.searchQuery) {
    const q = state.searchQuery;
    data = data.filter(item => {
      if (state.activeTab === 'players') {
        const playerName = item.player?.fullName?.toLowerCase() || '';
        const teamName = item.team?.name?.toLowerCase() || '';
        const teamCode = item.team?.code?.toLowerCase() || '';
        const marketName = (MARKET_NAMES_ES[item.market?.name] || '').toLowerCase();
        return playerName.includes(q) || teamName.includes(q) || teamCode.includes(q) || marketName.includes(q);
      } else if (state.activeTab === 'teams') {
        const teamName = item.team?.name?.toLowerCase() || '';
        const teamCode = item.team?.code?.toLowerCase() || '';
        const marketName = (MARKET_NAMES_ES[item.market?.name] || '').toLowerCase();
        return teamName.includes(q) || teamCode.includes(q) || marketName.includes(q);
      } else {
        return item.legs?.some(leg => {
          const pName = leg.player?.fullName?.toLowerCase() || '';
          const tName = leg.team?.name?.toLowerCase() || '';
          const tCode = leg.team?.code?.toLowerCase() || '';
          return pName.includes(q) || tName.includes(q) || tCode.includes(q);
        });
      }
    });
  }

  if (state.marketFilter !== 'ALL' && (state.activeTab === 'players' || state.activeTab === 'teams')) {
    data = data.filter(item => item.market?.name === state.marketFilter);
  }

  data.sort((a, b) => {
    if (state.sortBy === 'hitRate') {
      const getRate = (item) => {
        if (item.signals && item.signals.length > 0) {
          const primarySignal = item.signals.find(s => s.summary) || item.signals[0];
          return primarySignal.hitRecord?.hitRate || 0;
        }
        if (item.insights && item.insights.length > 0) {
          const pctStr = item.insights[0].annotation || '0%';
          return parseFloat(pctStr.replace('%', '')) || 0;
        }
        return 0;
      };
      return getRate(b) - getRate(a);
    } else if (state.sortBy === 'time') {
      const timeA = new Date(a.timestamp || 0).getTime();
      const timeB = new Date(b.timestamp || 0).getTime();
      return timeA - timeB;
    } else if (state.sortBy === 'games') {
      const getGames = (item) => {
        if (item.signals && item.signals.length > 0) {
          const primarySignal = item.signals.find(s => s.summary) || item.signals[0];
          return primarySignal.hitRecord?.games || 0;
        }
        return 0;
      };
      return getGames(b) - getGames(a);
    }
    return 0;
  });

  state.filteredData = data;
  loading.classList.add('hidden');
  
  renderTrendsList();
}

const _teamLogoCache = JSON.parse(localStorage.getItem('teamLogoCache') || '{}');

const KNOWN_SOCCER_LOGOS = {
  'SEV': 'https://r2.thesportsdb.com/images/media/team/badge/vpsqqx1473502977.png',
  'ATM': 'https://r2.thesportsdb.com/images/media/team/badge/1a74x51690436254.png',
  'VIL': 'https://r2.thesportsdb.com/images/media/team/badge/vrypqy1473503073.png',
  'RVC': 'https://r2.thesportsdb.com/images/media/team/badge/nzhu941655595465.png',
  'ESP': 'https://r2.thesportsdb.com/images/media/team/badge/867nzz1681703222.png',
  'CEL': 'https://r2.thesportsdb.com/images/media/team/badge/xfjtku1690436219.png',
  'RCC': 'https://r2.thesportsdb.com/images/media/team/badge/xfjtku1690436219.png',
  'ATH': 'https://r2.thesportsdb.com/images/media/team/badge/myl7c31677056352.png',
  'BAR': 'https://r2.thesportsdb.com/images/media/team/badge/091m6z1678817751.png',
  'RMA': 'https://r2.thesportsdb.com/images/media/team/badge/7fl16w1678817737.png',
  'BET': 'https://r2.thesportsdb.com/images/media/team/badge/9d9ybf1681703248.png',
  'LEV': 'https://r2.thesportsdb.com/images/media/team/badge/3l2r181681703264.png',
  'DEP': 'https://r2.thesportsdb.com/images/media/team/badge/u1a15q1681703279.png',
  'GIR': 'https://r2.thesportsdb.com/images/media/team/badge/28w64m1678817765.png',
  'OSA': 'https://r2.thesportsdb.com/images/media/team/badge/4v70e81678817778.png',
  'VAL': 'https://r2.thesportsdb.com/images/media/team/badge/6tvr1f1678817792.png',
  'SOC': 'https://r2.thesportsdb.com/images/media/team/badge/5k130l1678817805.png'
};

function getTeamLogoUrl(teamCode, teamName = '') {
  if (!teamCode) return `https://a.espncdn.com/i/teamlogos/league/500/${state.sport}.png`;
  
  const codeUpper = teamCode.toUpperCase();
  const category = state.sport ? state.sport.toLowerCase() : '';
  const isSoccer = ['epl', 'ucl', 'laliga', 'seriea', 'ligue1', 'bundesliga', 'mls'].includes(category);
  
  if (isSoccer) {
    if (KNOWN_SOCCER_LOGOS[codeUpper]) return KNOWN_SOCCER_LOGOS[codeUpper];
    if (_teamLogoCache[codeUpper]) return _teamLogoCache[codeUpper];
    
    if (teamName && !_teamLogoCache[codeUpper]) {
      fetch(`https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(teamName)}`)
        .then(r => r.json())
        .then(data => {
          const badge = data?.teams?.[0]?.strBadge;
          if (badge) {
            _teamLogoCache[codeUpper] = badge;
            try { localStorage.setItem('teamLogoCache', JSON.stringify(_teamLogoCache)); } catch(e){}
            document.querySelectorAll(`img[data-team-code="${codeUpper}"]`).forEach(img => {
              img.src = badge;
            });
          }
        }).catch(() => {});
    }
  }

  let espnCat = category;
  if (isSoccer) espnCat = 'soccer';
  else if (espnCat === 'ncaab') espnCat = 'mens-college-basketball';
  else if (espnCat === 'ncaaf') espnCat = 'mens-college-football';
  
  return `https://a.espncdn.com/i/teamlogos/${espnCat}/500/${teamCode.toLowerCase()}.png`;
}

// Render cards lists in Left Pane
function renderTrendsList() {
  const container = document.getElementById('trendsList');
  if (state.filteredData.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8 text-on-surface-variant text-xs opacity-60">
        No hay tendencias disponibles.
      </div>
    `;
    return;
  }

  container.innerHTML = state.filteredData.map(item => {
    const isPlayer = state.activeTab === 'players';
    const isTeam = state.activeTab === 'teams';
    
    let title = '';
    let subtitle = '';
    let valueOdds = '';
    let logoUrl = '';
    let signalsHtml = '';
    
    const defaultLogo = `https://a.espncdn.com/i/teamlogos/league/500/${state.sport}.png`;

    if (isPlayer || isTeam) {
      title = isPlayer ? item.player.fullName : item.team.name;
      const teamCode = item.team.code;
      subtitle = `${teamCode} vs ${item.opposingTeam.code}`;
      logoUrl = getTeamLogoUrl(teamCode, item.team.name);
      
      const dkOdds = item.market.books?.draftkings?.[item.outcome]?.current?.odds?.american;
      valueOdds = dkOdds !== undefined ? (dkOdds > 0 ? `+${dkOdds}` : `${dkOdds}`) : 'N/A';
      
      signalsHtml = item.signals.slice(0, 2).map(s => {
        let rateVal = s.hitRecord?.hitRate || 0;
        let rateClass = 'text-red-400';
        if (rateVal >= 75) rateClass = 'text-green-400';
        else if (rateVal >= 50) rateClass = 'text-amber-400';
        
        return `
          <div class="flex justify-between items-center text-[10px]">
            <span class="text-on-surface-variant flex items-center gap-1 overflow-hidden truncate whitespace-nowrap">
              <span class="material-symbols-outlined text-[12px] text-primary-container" style="font-variation-settings: 'FILL' 1;">bolt</span>
              ${s.description}
            </span>
            <span class="${rateClass} font-bold">${Math.round(rateVal)}%</span>
          </div>
        `;
      }).join('');
    } else {
      const firstLegStraight = item.legs?.[0]?.straight || item.legs?.[0] || {};
      const mainCode = firstLegStraight.team?.code || state.sport.toUpperCase();
      title = (state.activeTab === 'samegame') ? `${mainCode} SGP` : `${mainCode} Parlay`;
      subtitle = `${item.legs?.length || 0} Selecciones`;
      logoUrl = getTeamLogoUrl(mainCode, firstLegStraight.team?.name);
      valueOdds = `${item.legs?.length || 0} Legs`;
      
      const legsHtml = item.legs ? item.legs.map(leg => {
        const st = leg.straight || leg;
        const teamObj = st.team || {};
        const playerObj = st.player;
        const marketObj = st.market || {};
        const lineVal = st.line ?? leg.line ?? 0.5;
        const outcomeVal = (st.outcome || leg.outcome || 'over').toUpperCase();

        const legLogo = getTeamLogoUrl(teamObj.code, teamObj.name);
        const legName = playerObj ? (playerObj.preferredName || playerObj.fullName || playerObj.lastName) : (teamObj.code || teamObj.name || '');
        const legMarket = getMarketNameES(marketObj.name);
        return `
          <div class="flex items-center gap-1.5 text-[11px] text-on-surface truncate py-0.5">
            <img src="${legLogo}" data-team-code="${leg.team?.code || ''}" class="w-4 h-4 rounded-full object-contain shrink-0" onerror="this.onerror=null; this.src='${defaultLogo}'">
            <span class="font-bold text-white shrink-0">${legName}:</span>
            <span class="text-on-surface-variant truncate">${legDir} ${leg.line} ${legMarket}</span>
          </div>
        `;
      }).join('') : '';

      const primaryInsight = item.insights?.[0] || {};
      signalsHtml = `
        <div class="space-y-1 mb-1 border-b border-white/[0.03] pb-1.5">
          ${legsHtml}
        </div>
        <div class="flex justify-between items-center text-[10px] pt-1">
          <span class="text-on-surface-variant flex items-center gap-1 overflow-hidden truncate">
            <span class="material-symbols-outlined text-[12px] text-primary-container" style="font-variation-settings: 'FILL' 1;">bolt</span>
            ${primaryInsight.description || 'Parlay acumulado'}
          </span>
          <span class="text-green-400 font-bold">${primaryInsight.annotation || '100%'}</span>
        </div>
      `;
    }

    const isSelected = state.selectedTrend?.id === item.id;
    const cardBorderClass = isSelected 
      ? 'border-l-4 border-primary-container bg-surface-container-highest shadow-lg' 
      : 'border-l-2 border-outline-variant/30 hover:bg-white/[0.04]';
    
    const outcomeColor = item.outcome === 'under' ? 'text-red-400' : 'text-green-400';
    const marketNameTranslated = getMarketNameES(item.market?.name);

    return `
      <div class="glass-card p-3.5 rounded-xl cursor-pointer transition-all duration-200 ${cardBorderClass}" data-id="${item.id}">
        <div class="flex justify-between items-start mb-2 gap-2">
          <div class="flex items-center gap-2 overflow-hidden">
            <img src="${logoUrl}" data-team-code="${item.team?.code || ''}" alt="Logo" class="w-6 h-6 rounded-full shrink-0 object-contain" onerror="this.onerror=null; this.src='${defaultLogo}'">
            <span class="font-headline-sm text-xs truncate text-on-surface font-semibold">${title}</span>
          </div>
          <span class="font-label-caps text-[9px] bg-surface-container-highest px-1.5 py-0.5 rounded text-on-surface-variant shrink-0 font-bold">${valueOdds}</span>
        </div>
        <div class="text-[11px] mb-2 leading-tight">
          ${isPlayer || isTeam ? `<span class="${outcomeColor} font-bold mr-1">${item.outcome.toUpperCase()}</span> <span class="text-on-surface-variant">${item.line} ${marketNameTranslated}</span>` : `<span class="text-on-surface-variant font-medium opacity-80">${subtitle}</span>`}
        </div>
        <div class="space-y-1 pt-1.5 border-t border-white/[0.03]">
          ${signalsHtml}
        </div>
      </div>
    `;
  }).join('');

  document.querySelectorAll('#trendsList > div').forEach(card => {
    card.addEventListener('click', () => {
      const cardId = card.dataset.id;
      const trend = state.filteredData.find(t => t.id === cardId);
      
      state.selectedTrend = trend;
      state.selectedParlayLegIndex = 0;
      
      applyFiltersAndRender();
      selectTrend(trend);
    });
  });
}

function selectTrend(trend) {
  state.selectedTrend = trend;
  state.selectedParlayLegIndex = 0;
  
  document.getElementById('detailsEmptyState').classList.add('hidden');
  document.getElementById('detailsContent').classList.add('hidden');
  document.getElementById('detailsLoadingState').classList.remove('hidden');

  const isParlay = (state.activeTab === 'samegame' || state.activeTab === 'crossgame') && !trend.isCustom;

  if (isParlay && trend.legs && trend.legs.length > 0) {
    const firstLeg = trend.legs[0];
    const playerID = firstLeg.player?.statsPerformId || firstLeg.player?.playerId || firstLeg.player?.SRGUID || firstLeg.player?.optaId;
    if (playerID) {
      fetchPlayerGames(playerID);
    } else if (firstLeg.team?.code) {
      fetchTeamGames(firstLeg.team.code);
    } else {
      state.playerGames = [];
      renderDetailsPaneOnly();
    }
  } else {
    const p = trend.player;
    const playerID = p?.statsPerformId || p?.playerId || p?.SRGUID || p?.optaId;
    if (playerID) {
      fetchPlayerGames(playerID);
    } else if (trend.team?.code) {
      fetchTeamGames(trend.team.code);
    } else {
      state.playerGames = [];
      renderDetailsPaneOnly();
    }
  }
}

async function fetchPlayerGames(playerGUID) {
  const url = `/api/${state.sport}/v3/players/${playerGUID}/games?sortingOrder=DESC&timeframe=RANGE_2024_2026`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('API Error ' + response.status);
    const games = await response.json();
    state.playerGames = games;
    renderDetailsPaneOnly();
  } catch (error) {
    console.error('Error fetching player games:', error);
    state.playerGames = [];
    renderDetailsPaneOnly();
  }
}

async function fetchTeamGames(teamCode) {
  const url = `/api/${state.sport}/v3/teams/${teamCode.toUpperCase()}/games?sortingOrder=DESC&timeframe=RANGE_2024_2026`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('API Error ' + response.status);
    const games = await response.json();
    state.playerGames = games;
    renderDetailsPaneOnly();
  } catch (error) {
    console.error('Error fetching team games:', error);
    state.playerGames = [];
    renderDetailsPaneOnly();
  }
}

// Helper to compute hit rates dynamically
function getHitRecord(gamesList, marketName, line, outcome) {
  let hits = 0;
  let gamesCount = 0;
  gamesList.forEach(g => {
    const val = getStatValueForGame(g, marketName);
    gamesCount++;
    if (outcome === 'under') {
      if (val <= line) hits++;
    } else {
      if (val >= line) hits++;
    }
  });
  return {
    games: gamesCount,
    hits,
    hitRate: gamesCount > 0 ? (hits / gamesCount) * 100 : 0
  };
}

// Render detailed inspector panel
function renderDetailsPaneOnly() {
  const trend = state.selectedTrend;
  if (!trend) return;

  document.getElementById('detailsLoadingState').classList.add('hidden');
  const detailsContent = document.getElementById('detailsContent');
  detailsContent.classList.remove('hidden');

  const isPlayer = state.activeTab === 'players' || trend.player;
  const isTeam = state.activeTab === 'teams' || (trend.team && !trend.player);
  const isParlay = (state.activeTab === 'samegame' || state.activeTab === 'crossgame') && !trend.isCustom;
  
  // CHECK SUBSCRIPTION LOCK:
  const isAdmin = state.currentUser?.email === 'garciayoan2002@gmail.com';
  const isFreeUnlockedSport = (state.sport === 'mlb' || state.sport === 'mls') && (isPlayer || isTeam);
  const isPaid = isAdmin || state.userProfile?.subscription_tier === 'paid';
  const paywallOverlay = document.getElementById('paywallOverlay');

  if (isPaid || isFreeUnlockedSport) {
    detailsContent.classList.remove('blur-sm', 'pointer-events-none', 'opacity-40');
    paywallOverlay.classList.add('hidden');
  } else {
    detailsContent.classList.add('blur-sm', 'pointer-events-none', 'opacity-40');
    paywallOverlay.classList.remove('hidden');
  }

  // GET ACTIVE PROP TARGET PARAMS
  let activeTarget = trend;
  let title = '';
  let logoUrl = '';
  let propTitle = '';
  let oppTeamCode = 'OPP';

  if (isParlay && trend.legs && trend.legs.length > 0) {
    activeTarget = trend.legs[state.selectedParlayLegIndex] || trend.legs[0];
    title = activeTarget.player ? activeTarget.player.fullName : activeTarget.team.name;
    logoUrl = getTeamLogoUrl(activeTarget.team?.code || 'mlb');
    oppTeamCode = activeTarget.opposingTeam?.code || 'OPP';
    
    const marketName = MARKET_NAMES_ES[activeTarget.market.name] || formatRawName(activeTarget.market.name);
    propTitle = `${activeTarget.outcome.toUpperCase()} ${activeTarget.line} ${marketName}`;
  } else {
    title = activeTarget.player ? activeTarget.player.fullName : activeTarget.team.name;
    logoUrl = getTeamLogoUrl(activeTarget.team?.code || 'mlb');
    oppTeamCode = activeTarget.opposingTeam?.code || 'OPP';
    
    const marketName = MARKET_NAMES_ES[activeTarget.market.name] || formatRawName(activeTarget.market.name);
    propTitle = `${activeTarget.outcome.toUpperCase()} ${activeTarget.line} ${marketName}`;
  }

  document.getElementById('detailPlayerName').textContent = title;
  document.getElementById('detailTeamLogo').src = logoUrl;
  document.getElementById('detailPropTitle').textContent = propTitle;
  document.getElementById('detailOppTeam').textContent = oppTeamCode;

  // Toggle parlay sub-pills row
  const parlayPillsSection = document.getElementById('parlayPillsSection');
  if (isParlay && trend.legs && trend.legs.length > 0) {
    parlayPillsSection.classList.remove('hidden');
    renderParlayPills();
  } else {
    parlayPillsSection.classList.add('hidden');
  }

  renderHitRateSplits(activeTarget);
  renderStatsChart(activeTarget);
  renderDetailsStats(activeTarget);
  updateAddRemoveBtnState();
  updateMobileViews();

  // ── Load player photo from TheSportsDB ──────────────────────────────────
  const playerImg = document.getElementById('detailPlayerImage');
  if (playerImg && activeTarget.player?.fullName) {
    playerImg.style.opacity = '0.3';
    fetchPlayerPhotoFromSportsDB(activeTarget.player.fullName).then(photoUrl => {
      if (photoUrl) {
        playerImg.src = photoUrl;
        playerImg.style.objectFit = 'contain';
        playerImg.style.background = 'transparent';
      } else {
        // Fallback: generic silhouette
        playerImg.src = 'https://a.espncdn.com/combiner/i?img=/i/headshots/nophoto.png&w=160&h=160';
        playerImg.style.objectFit = 'cover';
      }
      playerImg.style.opacity = '1';
    });
  } else if (playerImg && logoUrl) {
    // Team trend — show team logo
    playerImg.src = logoUrl;
    playerImg.style.objectFit = 'contain';
    playerImg.style.padding = '8px';
    playerImg.style.opacity = '1';
  }
}

function renderParlayPills() {
  const row = document.getElementById('parlayPillsRow');
  const trend = state.selectedTrend;
  if (!trend || !trend.legs) return;

  row.innerHTML = trend.legs.map((leg, idx) => {
    const pName = leg.player ? leg.player.lastName : leg.team.code;
    const direction = leg.outcome === 'under' ? 'Under' : 'Over';
    const marketName = getMarketNameES(leg.market.name);
    const text = `${pName}: ${direction} ${leg.line} ${marketName}`;
    const activeClass = idx === state.selectedParlayLegIndex 
      ? 'bg-primary-container text-on-primary font-bold shadow-lg cyan-glow' 
      : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest';

    return `<button class="parlay-pill-btn ${activeClass} font-label-caps text-[10px] py-1.5 px-3 rounded-md text-center transition-all cursor-pointer font-bold" data-index="${idx}">${text}</button>`;
  }).join('');

  row.querySelectorAll('.parlay-pill-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(btn.dataset.index);
      if (idx === state.selectedParlayLegIndex) return;
      
      state.selectedParlayLegIndex = idx;
      
      document.getElementById('detailsContent').classList.add('hidden');
      document.getElementById('detailsLoadingState').classList.remove('hidden');
      
      const leg = trend.legs[idx];
      const playerID = leg.player?.statsPerformId || leg.player?.playerId || leg.player?.SRGUID || leg.player?.optaId;
      if (playerID) {
        fetchPlayerGames(playerID);
      } else if (leg.team?.code) {
        fetchTeamGames(leg.team.code);
      } else {
        state.playerGames = [];
        renderDetailsPaneOnly();
      }
    });
  });
}

function renderHitRateSplits(target) {
  const grid = document.getElementById('hitSplitsGrid');
  const trend = state.selectedTrend;
  if (!trend) return;

  const isParlay = (state.activeTab === 'samegame' || state.activeTab === 'crossgame') && !trend.isCustom;
  
  const getSplitHtml = (signal, title, iconName) => {
    if (!signal || !signal.hitRecord) {
      return `
        <div class="glass-card p-6 rounded-xl border-t-2 border-red-500/30 flex flex-col justify-between group transition-all duration-300">
          <div>
            <p class="font-label-caps text-label-caps text-on-surface-variant mb-1">${title}</p>
            <div class="flex items-baseline gap-2">
              <span class="font-display-lg text-display-lg text-red-400">—</span>
              <span class="material-symbols-outlined text-red-400 text-3xl">${iconName}</span>
            </div>
          </div>
          <p class="text-body-sm text-on-surface-variant mt-4">Sin datos</p>
        </div>
      `;
    }
    const pct = Math.round(signal.hitRecord.hitRate);
    const hits = signal.hitRecord.hits;
    const games = signal.hitRecord.games;
    
    let rateColor = 'text-red-400';
    let borderColor = 'border-red-500/30 hover:border-red-500/50';
    let bounceClass = '';
    
    if (pct >= 75) {
      rateColor = 'text-green-400';
      borderColor = 'border-primary-container hover:border-primary-fixed-dim';
      bounceClass = 'animate-bounce';
    } else if (pct >= 50) {
      rateColor = 'text-amber-400';
      borderColor = 'border-amber-500/30 hover:border-amber-500/50';
    }

    return `
      <div class="glass-card p-6 rounded-xl border-t-2 ${borderColor} flex flex-col justify-between group transition-all duration-300">
        <div>
          <p class="font-label-caps text-label-caps text-on-surface-variant mb-1">${title}</p>
          <div class="flex items-baseline gap-2">
            <span class="font-display-lg text-display-lg ${rateColor}">${pct}%</span>
            <span class="material-symbols-outlined ${rateColor} text-3xl ${bounceClass}" style="font-variation-settings: 'FILL' 1;">${iconName}</span>
          </div>
        </div>
        <p class="text-body-sm text-on-surface-variant mt-4">${hits}/${games} Partidos <span class="opacity-50">(${signal.description || ''})</span></p>
      </div>
    `;
  };

  if (!isParlay && trend.signals && trend.signals.length > 0 && !trend.isCustom) {
    const recentForm = trend.signals.find(s => s.type === 'RECENT_FORM') || trend.signals[0] || {};
    const h2h = trend.signals.find(s => s.type === 'HEAD_TO_HEAD' || s.type === 'MATCHUP');
    const splits = trend.signals.find(s => s.type === 'HOME_SPLIT' || s.type === 'ROAD_SPLIT' || s.type === 'AWAY_SPLIT');

    grid.innerHTML = `
      ${getSplitHtml(recentForm, 'Recent Form', 'trending_up')}
      ${getSplitHtml(h2h, 'Head to Head', 'groups')}
      ${getSplitHtml(splits, trend.home ? 'Home games' : 'Away games', trend.home ? 'home' : 'flight_takeoff')}
    `;
  } else {
    if (!state.playerGames || state.playerGames.length === 0) {
      grid.innerHTML = '<div class="col-span-3 text-center py-6 text-on-surface-variant text-xs opacity-60">Estadísticas de tasa de acierto no disponibles.</div>';
      return;
    }

    const market = target.market.name;
    const line = target.line;
    const outcome = target.outcome;
    const opp = target.opposingTeam?.code || 'OPP';
    const isHomeTarget = target.home;

    const recentGames = state.playerGames.slice(0, 10);
    const recentRec = getHitRecord(recentGames, market, line, outcome);
    const recentSignal = { hitRecord: recentRec, description: 'Últimos 10 partidos' };

    const h2hGames = state.playerGames.filter(g => g.opposingTeam === opp);
    const h2hRec = getHitRecord(h2hGames, market, line, outcome);
    const h2hSignal = { hitRecord: h2hRec, description: `vs ${opp}` };

    const splitGames = state.playerGames.filter(g => g.isHome === isHomeTarget);
    const splitRec = getHitRecord(splitGames, market, line, outcome);
    const splitSignal = { hitRecord: splitRec, description: isHomeTarget ? 'De Local' : 'De Visitante' };

    grid.innerHTML = `
      ${getSplitHtml(recentSignal, 'Recent Form', 'trending_up')}
      ${getSplitHtml(h2hSignal, 'Head to Head', 'groups')}
      ${getSplitHtml(splitSignal, isHomeTarget ? 'Home Games' : 'Away Games', isHomeTarget ? 'home' : 'flight_takeoff')}
    `;
  }
}

function getStatValueForGame(game, marketName) {
  const avg = game.averageStats || {};
  const tot = game.totalStats || game.cumulativeStats || {};
  const obj = state.perGameMode ? avg : (tot && Object.keys(tot).length > 0 ? tot : avg);

  // ── Soccer / Fútbol Direct Field Checks ────────────────────────────────
  if (marketName === 'SHOTS_ON_TARGET') return parseFloat(obj.shotsOnTarget ?? avg.shotsOnTarget ?? (obj.offensive && obj.offensive.shotsOnTarget) ?? 0);
  if (marketName === 'PLAYER_SHOTS') return parseFloat(obj.totalShots ?? avg.totalShots ?? (obj.offensive && obj.offensive.shotsTotal) ?? 0);
  if (marketName === 'PLAYER_GOALS') return parseFloat(obj.goals ?? avg.goals ?? (obj.offensive && obj.offensive.goals) ?? 0);
  if (marketName === 'PLAYER_ASSISTS') return parseFloat(obj.assists ?? avg.assists ?? (obj.offensive && obj.offensive.assists) ?? 0);
  if (marketName === 'PLAYER_PASSES') return parseFloat(obj.totalPasses ?? avg.totalPasses ?? (obj.offensive && obj.offensive.totalPasses) ?? 0);
  if (marketName === 'TEAM_RUNS' || marketName === 'TEAM_GOALS') return parseFloat(avg.offensive?.goals ?? obj.goals ?? avg.goals ?? 0);
  if (marketName === 'TEAM_RUNS_ALLOWED') return parseFloat(avg.defensive?.goals ?? obj.goalsConceded ?? avg.goalsConceded ?? 0);
  if (marketName === 'GAME_RUNS' || marketName === 'GAME_TOTAL') {
    const g1 = parseFloat(avg.offensive?.goals ?? obj.goals ?? avg.goals ?? 0);
    const g2 = parseFloat(avg.defensive?.goals ?? obj.goalsConceded ?? 0);
    return g1 + g2;
  }
  if (marketName === 'MONEY_LINE') return parseFloat(game.win) || 0;
  if (marketName === 'SPREAD') {
    const r = parseFloat(avg.offensive?.goals ?? avg.offensive?.runs ?? avg.runs ?? 0);
    const ra = parseFloat(avg.defensive?.goals ?? avg.defensive?.runs ?? 0);
    return r - ra;
  }

  // ── Special computed markets ────────────────────────────────────────────
  if (marketName === 'HITTER_HITS_PLUS_RUNS_PLUS_RUNS_BATTED_IN') {
    const src = obj.hitting || obj;
    return (parseFloat(src.hits) || 0) + (parseFloat(src.runs) || 0) + (parseFloat(src.runsBattedIn) || 0);
  }
  // ── Basketball combo markets ────────────────────────────────────────────
  if (marketName === 'POINTS_PLUS_REBOUNDS')
    return (parseFloat(obj.points) || 0) + (parseFloat(obj.rebounds) || 0);
  if (marketName === 'POINTS_PLUS_ASSISTS')
    return (parseFloat(obj.points) || 0) + (parseFloat(obj.assists) || 0);
  if (marketName === 'ASSISTS_PLUS_REBOUNDS')
    return (parseFloat(obj.assists) || 0) + (parseFloat(obj.rebounds) || 0);
  if (marketName === 'POINTS_PLUS_ASSISTS_PLUS_REBOUNDS')
    return (parseFloat(obj.points) || 0) + (parseFloat(obj.assists) || 0) + (parseFloat(obj.rebounds) || 0);
  if (marketName === 'DOUBLE_DOUBLE') {
    const cats = [obj.points, obj.rebounds, obj.assists, obj.steals, obj.blocks];
    return cats.filter(v => parseFloat(v) >= 10).length >= 2 ? 1 : 0;
  }

  // ── Generic path lookup ─────────────────────────────────────────────────
  let path = MARKET_TO_STAT_PATH[marketName];
  if (!path || path.startsWith('_computed')) {
    const camelKey = marketName.toLowerCase().replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    const directVal = avg[camelKey] ?? obj[camelKey];
    if (directVal !== undefined) return parseFloat(directVal) || 0;
    return 0;
  }

  const keys = path.split('.');

  // Try nested path (MLB structure: averageStats.hitting.singles)
  let cursor = obj;
  let resolved = true;
  for (const key of keys) {
    if (cursor && cursor[key] !== undefined) {
      cursor = cursor[key];
    } else {
      resolved = false;
      break;
    }
  }
  if (resolved) return parseFloat(cursor) || 0;

  const flatKey = keys[keys.length - 1];
  const flatVal = avg[flatKey] ?? obj[flatKey];
  if (flatVal !== undefined) return parseFloat(flatVal) || 0;

  return 0;
}


// Redesigned History Chart render
function renderStatsChart(target) {
  const container = document.getElementById('chartBars');

  if (!state.playerGames || state.playerGames.length === 0) {
    document.getElementById('chartBox').style.display = 'none';
    return;
  }
  document.getElementById('chartBox').style.display = 'block';

  const propVal  = target.line;
  const outcome  = target.outcome;
  const marketName = target.market.name;

  const gamesSlice = [...state.playerGames].slice(0, 10).reverse();
  const values  = gamesSlice.map(g => getStatValueForGame(g, marketName));
  const maxVal  = Math.max(propVal * 2.2, ...values, 1);

  const CHART_H = 240; // bar column height in px

  // ── Build each bar column ────────────────────────────────────────────────
  const barsHtml = gamesSlice.map((game, idx) => {
    const val    = getStatValueForGame(game, marketName);
    const barPct = Math.max(3, (val / maxVal) * 100);
    const isHit  = outcome === 'under' ? val <= propVal : val >= propVal;
    const isLast = idx === gamesSlice.length - 1;

    const dateStr = new Date(game.timestamp).toLocaleDateString('es-ES', {
      month: 'short', day: 'numeric'
    }).replace('.', '');
    const oppCode = (game.opposingTeam || 'OPP').toUpperCase().substring(0, 3);
    const dispVal = val % 1 === 0 ? String(val) : val.toFixed(1);

    // Green for hits, Red for misses; last bar is slightly brighter
    const hitColor  = isLast ? '#4ade80' : '#22c55e';
    const missColor = isLast ? '#f87171' : '#ef4444';
    const barColor  = isHit ? hitColor : missColor;
    const barBg     = `background:${barColor};`;

    // Opponent label — cyan for last game (most recent), muted for rest
    const oppColor  = isLast ? '#00dddd' : '#b9cac9';

    return `
      <div style="flex:1;display:flex;flex-direction:column;align-items:center;min-width:0;">
        <div style="width:100%;display:flex;align-items:flex-end;justify-content:center;height:${CHART_H}px;">
          <div style="width:clamp(26px,62%,48px);border-radius:5px 5px 0 0;${barBg}height:${barPct}%;position:relative;min-height:6px;box-shadow:0 -2px 8px rgba(0,0,0,0.4);">
            <span style="position:absolute;top:6px;left:0;width:100%;text-align:center;font-size:12px;font-weight:900;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,0.5);">${dispVal}</span>
          </div>
        </div>
        <span style="font-size:10px;font-weight:700;color:${oppColor};text-transform:uppercase;margin-top:6px;letter-spacing:.04em;">${oppCode}</span>
        <span style="font-size:9px;color:#4a5a5a;font-weight:500;margin-top:2px;">${dateStr}</span>
      </div>`;
  }).join('');

  // ── Prop line position (% from bottom of bar area) ───────────────────────
  const propLinePct = (propVal / maxVal) * 100;

  container.innerHTML = `
    <div style="width:100%;position:relative;padding:12px 8px 0 36px;box-sizing:border-box;">

      <!-- Grid + prop line overlay (sits behind bars) -->
      <div style="position:absolute;left:36px;right:8px;top:12px;height:${CHART_H}px;pointer-events:none;">
        <!-- Subtle grid lines -->
        <div style="position:absolute;left:0;right:0;bottom:75%;border-top:1px solid rgba(255,255,255,0.04);"></div>
        <div style="position:absolute;left:0;right:0;bottom:50%;border-top:1px solid rgba(255,255,255,0.04);"></div>
        <div style="position:absolute;left:0;right:0;bottom:25%;border-top:1px solid rgba(255,255,255,0.04);"></div>
        <!-- Orange dashed prop line -->
        <div style="position:absolute;left:-28px;right:0;bottom:${propLinePct}%;border-top:2px dashed #f97316;z-index:2;"></div>
        <!-- Prop value label — LEFT side -->
        <span style="position:absolute;left:-34px;bottom:${propLinePct}%;transform:translateY(50%);font-size:10px;font-weight:800;color:#f97316;background:#1e2024;padding:1px 4px;border-radius:3px;white-space:nowrap;">${propVal}</span>
      </div>

      <!-- Bars row -->
      <div style="display:flex;align-items:flex-end;gap:3px;width:100%;position:relative;z-index:1;">
        ${barsHtml}
      </div>

      <!-- Footer labels -->
      <div style="text-align:center;font-size:10px;letter-spacing:.12em;color:#3a4a49;font-weight:700;text-transform:uppercase;margin-top:14px;">
        Partidos Anteriores (Más Reciente a la Derecha)
      </div>
      <div style="font-size:9px;font-weight:800;color:rgba(0,221,221,0.18);letter-spacing:.15em;text-transform:uppercase;margin-top:4px;">
        Edge Analytics
      </div>
    </div>`;
}



function renderDetailsStats(target) {
  const tbody = document.getElementById('statsTableBody');
  const thead = document.getElementById('statsTableHead');
  
  const isTeam = state.activeTab === 'teams' || (target.team && !target.player);
  const isPitching = !isTeam && target.market.name.startsWith('PITCHER_');
  
  if (target.market.name === 'MONEY_LINE') {
    thead.innerHTML = `
      <th class="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant">Intervalo</th>
      <th class="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant text-center">PJ</th>
      <th class="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant text-center">Victorias (Wins)</th>
      <th class="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant text-center">Derrotas (Losses)</th>
      <th class="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant text-center">Pct. Victoria</th>
    `;
  } else if (isTeam) {
    thead.innerHTML = `
      <th class="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant">Intervalo</th>
      <th class="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant text-center">PJ</th>
      <th class="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant text-center">Carreras (R)</th>
      <th class="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant text-center">Hits (H)</th>
      <th class="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant text-center">Sencillos</th>
      <th class="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant text-center">Dobles</th>
    `;
  } else if (isPitching) {
    thead.innerHTML = `
      <th class="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant">Intervalo</th>
      <th class="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant text-center">PJ</th>
      <th class="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant text-center">Ponches (SO)</th>
      <th class="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant text-center">Carreras (ER)</th>
      <th class="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant text-center">Hits Perm.</th>
      <th class="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant text-center">Outs</th>
    `;
  } else if (target.market?.name === 'HITTER_HITS_PLUS_RUNS_PLUS_RUNS_BATTED_IN') {
    thead.innerHTML = `
      <th class="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant">Intervalo</th>
      <th class="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant text-center">PJ</th>
      <th class="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant text-center">H+R+RBI</th>
      <th class="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant text-center">Hits</th>
      <th class="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant text-center">Carreras</th>
      <th class="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant text-center">At Bats</th>
    `;
  } else {
    thead.innerHTML = `
      <th class="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant">Intervalo</th>
      <th class="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant text-center">PJ</th>
      <th class="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant text-center">Sencillos</th>
      <th class="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant text-center">Hits</th>
      <th class="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant text-center">Carreras</th>
      <th class="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant text-center">At Bats</th>
    `;
  }

  const calculateAverages = (gamesList) => {
    if (!gamesList || gamesList.length === 0) {
      if (target.market.name === 'MONEY_LINE') return { games: 0, s1: 0, s2: 0, s3: '0%' };
      return { games: 0, s1: 0, s2: 0, s3: 0, s4: 0 };
    }
    
    if (target.market.name === 'MONEY_LINE') {
      let wins = 0;
      let losses = 0;
      gamesList.forEach(g => {
        if (parseFloat(g.win) === 1) wins++;
        else losses++;
      });
      const total = gamesList.length;
      const pct = total > 0 ? ((wins / total) * 100).toFixed(1) + '%' : '0%';
      return {
        games: total,
        s1: wins,
        s2: losses,
        s3: pct
      };
    }

    let sum1 = 0, sum2 = 0, sum3 = 0, sum4 = 0;
    gamesList.forEach(g => {
      const statsObj = state.perGameMode ? g.averageStats : (isTeam ? g.cumulativeStats : g.totalStats);
      if (!statsObj) return;
      
      if (isTeam) {
        sum1 += statsObj.offensive?.runs || 0;
        sum2 += statsObj.offensive?.hits || 0;
        sum3 += statsObj.offensive?.singles || 0;
        sum4 += statsObj.offensive?.doubles || 0;
      } else if (isPitching) {
        sum1 += statsObj.pitching?.strikeouts || 0;
        sum2 += statsObj.pitching?.earnedRuns || 0;
        sum3 += statsObj.pitching?.hits || 0;
        sum4 += statsObj.pitching?.outs || 0;
      } else {
        if (target.market.name === 'HITTER_HITS_PLUS_RUNS_PLUS_RUNS_BATTED_IN') {
          sum1 += (statsObj.hitting?.hits || 0) + (statsObj.hitting?.runs || 0) + (statsObj.hitting?.runsBattedIn || 0);
        } else {
          sum1 += statsObj.hitting?.singles || 0;
        }
        sum2 += statsObj.hitting?.hits || 0;
        sum3 += statsObj.hitting?.runs || 0;
        sum4 += statsObj.hitting?.atBats || 0;
      }
    });

    const totalGames = gamesList.length;
    const div = state.perGameMode ? totalGames : 1;
    return {
      games: totalGames,
      s1: (sum1 / div).toFixed(2),
      s2: (sum2 / div).toFixed(2),
      s3: (sum3 / div).toFixed(2),
      s4: (sum4 / div).toFixed(2)
    };
  };

  const firstSignal = state.selectedTrend?.signals?.find(s => s.summary) || state.selectedTrend?.signals?.[0];
  const recentCount = firstSignal?.hitRecord?.games || 10;

  const recentStats = calculateAverages(state.playerGames.slice(0, recentCount));
  const seasonStats = calculateAverages(state.playerGames);

  if (target.market.name === 'MONEY_LINE') {
    tbody.innerHTML = `
      <tr class="hover:bg-white/5 transition-colors">
        <td class="px-6 py-5">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-primary-container"></span>
            <span class="font-bold text-sm">Recent Form (${recentCount} partidos)</span>
          </div>
        </td>
        <td class="px-6 py-5 font-display-lg text-sm text-center">${recentStats.games}</td>
        <td class="px-6 py-5 text-center font-display-lg text-sm text-primary-container">${recentStats.s1}</td>
        <td class="px-6 py-5 text-center font-display-lg text-sm">${recentStats.s2}</td>
        <td class="px-6 py-5 text-center font-display-lg text-sm">${recentStats.s3}</td>
      </tr>
      <tr class="hover:bg-white/5 transition-colors">
        <td class="px-6 py-5">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-on-surface-variant/40"></span>
            <span class="font-bold text-sm text-on-surface-variant">Season (Completa)</span>
          </div>
        </td>
        <td class="px-6 py-5 font-display-lg text-sm text-center text-on-surface-variant">${seasonStats.games}</td>
        <td class="px-6 py-5 text-center font-display-lg text-sm text-on-surface-variant">${seasonStats.s1}</td>
        <td class="px-6 py-5 text-center font-display-lg text-sm text-on-surface-variant">${seasonStats.s2}</td>
        <td class="px-6 py-5 text-center font-display-lg text-sm text-on-surface-variant">${seasonStats.s3}</td>
      </tr>
    `;
  } else {
    tbody.innerHTML = `
      <tr class="hover:bg-white/5 transition-colors">
        <td class="px-6 py-5">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-primary-container"></span>
            <span class="font-bold text-sm">Recent Form (${recentCount} partidos)</span>
          </div>
        </td>
        <td class="px-6 py-5 font-display-lg text-sm text-center">${recentStats.games}</td>
        <td class="px-6 py-5 text-center font-display-lg text-sm text-primary-container">${recentStats.s1}</td>
        <td class="px-6 py-5 text-center font-display-lg text-sm">${recentStats.s2}</td>
        <td class="px-6 py-5 text-center font-display-lg text-sm">${recentStats.s3}</td>
        <td class="px-6 py-5 text-center font-display-lg text-sm">${recentStats.s4}</td>
      </tr>
      <tr class="hover:bg-white/5 transition-colors">
        <td class="px-6 py-5">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-on-surface-variant/40"></span>
            <span class="font-bold text-sm text-on-surface-variant">Season (Completa)</span>
          </div>
        </td>
        <td class="px-6 py-5 font-display-lg text-sm text-center text-on-surface-variant">${seasonStats.games}</td>
        <td class="px-6 py-5 text-center font-display-lg text-sm text-on-surface-variant">${seasonStats.s1}</td>
        <td class="px-6 py-5 text-center font-display-lg text-sm text-on-surface-variant">${seasonStats.s2}</td>
        <td class="px-6 py-5 text-center font-display-lg text-sm text-on-surface-variant">${seasonStats.s3}</td>
        <td class="px-6 py-5 text-center font-display-lg text-sm text-on-surface-variant">${seasonStats.s4}</td>
      </tr>
    `;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// VIP PICKS SYSTEM
// ═══════════════════════════════════════════════════════════════════════════

async function loadVipPicks() {
  const container = document.getElementById('vipPicksList');
  if (!container) return;
  
  container.innerHTML = `
    <div class="flex flex-col items-center justify-center py-8 text-on-surface-variant gap-2 text-xs">
      <div class="w-6 h-6 border-2 border-white/5 border-t-primary-container rounded-full animate-spin"></div>
      <p>Cargando picks VIP...</p>
    </div>`;

  try {
    const { data, error } = await supabase
      .from('premium_picks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading VIP picks:', error);
      container.innerHTML = `<div class="text-center py-6 text-xs text-red-400">Error al cargar picks VIP.</div>`;
      return;
    }

    if (!data || data.length === 0) {
      container.innerHTML = `
        <div class="text-center py-8 text-on-surface-variant text-xs opacity-60">
          <div class="text-3xl mb-2">💎</div>
          <p>No hay picks VIP publicados todavía.</p>
        </div>`;
      return;
    }

    const tier = state.userProfile?.subscription_tier || 'free';
    const isAdmin = tier === 'admin';

    container.innerHTML = data.map(pick => {
      const sportEmojis = { mlb: '⚾', nba: '🏀', wnba: '🏀', nfl: '🏈', mls: '⚽', nhl: '🏒' };
      const sportEmoji = sportEmojis[pick.sport] || '🏅';
      const dateStr = new Date(pick.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
      const isImagePick = pick.market === 'IMAGE_PICK' && pick.image_url;
      
      if (isImagePick) {
        // ── Image Pick Card ──
        return `
          <div class="glass-card rounded-xl transition-all duration-200 border-l-4 overflow-hidden" style="border-left-color: #d4af37; background: linear-gradient(135deg, rgba(212,175,55,0.05), transparent);">
            <div class="flex justify-between items-center px-3.5 pt-3 pb-2">
              <div class="flex items-center gap-2">
                <span class="text-lg">${sportEmoji}</span>
                <span class="font-label-caps text-[10px] font-bold" style="color: #d4af37;">📷 PICK VIP</span>
              </div>
              <div class="flex items-center gap-1">
                <span class="text-[9px] text-on-surface-variant/40">${dateStr}</span>
                ${isAdmin ? `<button class="delete-vip-pick text-red-400/50 hover:text-red-400 text-[14px] cursor-pointer ml-1" data-pick-id="${pick.id}">&times;</button>` : ''}
              </div>
            </div>
            <img src="${pick.image_url}" alt="Pick VIP" class="w-full max-h-64 object-contain px-2 rounded-lg" style="cursor: pointer;" onclick="window.open('${pick.image_url}', '_blank')"/>
            ${pick.notes ? `<div class="text-[11px] text-on-surface-variant px-3.5 py-2 italic">${pick.notes}</div>` : '<div class="pb-2"></div>'}
          </div>`;
      } else {
        // ── Manual Pick Card ──
        const outcomeColor = pick.outcome === 'over' ? 'text-green-400' : 'text-red-400';
        return `
          <div class="glass-card p-3.5 rounded-xl transition-all duration-200 border-l-4" style="border-left-color: #d4af37; background: linear-gradient(135deg, rgba(212,175,55,0.05), transparent);">
            <div class="flex justify-between items-start mb-2 gap-2">
              <div class="flex items-center gap-2 overflow-hidden">
                <span class="text-lg">${sportEmoji}</span>
                <span class="font-headline-sm text-xs truncate text-on-surface font-semibold">${pick.player_name || pick.team_code || 'Pick'}</span>
              </div>
              <div class="flex items-center gap-1">
                ${pick.odds ? `<span class="font-label-caps text-[9px] bg-surface-container-highest px-1.5 py-0.5 rounded text-on-surface-variant shrink-0 font-bold">${pick.odds}</span>` : ''}
                ${isAdmin ? `<button class="delete-vip-pick text-red-400/50 hover:text-red-400 text-[14px] cursor-pointer ml-1" data-pick-id="${pick.id}">&times;</button>` : ''}
              </div>
            </div>
            <div class="text-[11px] mb-2 leading-tight">
              <span class="${outcomeColor} font-bold mr-1">${pick.outcome.toUpperCase()}</span>
              <span class="text-on-surface-variant">${pick.line} ${pick.market}</span>
              ${pick.team_code ? `<span class="text-on-surface-variant ml-1">(${pick.team_code.toUpperCase()})</span>` : ''}
            </div>
            ${pick.hit_rate_text ? `
            <div class="flex justify-between items-center text-[10px] pt-1.5 border-t border-white/[0.03]">
              <span class="text-on-surface-variant flex items-center gap-1">
                <span class="material-symbols-outlined text-[12px]" style="color: #d4af37; font-variation-settings: 'FILL' 1;">verified</span>
                ${pick.hit_rate_text}
              </span>
            </div>` : ''}
            ${pick.notes ? `
            <div class="text-[10px] text-on-surface-variant/70 mt-1.5 italic">${pick.notes}</div>` : ''}
            <div class="text-[9px] text-on-surface-variant/40 mt-1.5">${dateStr}</div>
          </div>`;
      }
    }).join('');

    // Bind delete buttons for admin
    if (isAdmin) {
      container.querySelectorAll('.delete-vip-pick').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          e.stopPropagation();
          const pickId = btn.dataset.pickId;
          if (confirm('¿Eliminar este pick VIP?')) {
            const { error } = await supabase.from('premium_picks').delete().eq('id', pickId);
            if (!error) loadVipPicks();
            else alert('Error al eliminar: ' + error.message);
          }
        });
      });
    }
  } catch (err) {
    console.error('Error loading VIP picks:', err);
    container.innerHTML = `<div class="text-center py-6 text-xs text-red-400">Error de conexión.</div>`;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// ADMIN PANEL
// ═══════════════════════════════════════════════════════════════════════════

function initAdminPanel() {
  const overlay = document.getElementById('adminPanelOverlay');
  const closeBtn = document.getElementById('closeAdminPanelBtn');
  const adminAddPickBtn = document.getElementById('adminAddPickBtn');
  const adminTabUsers = document.getElementById('adminTabUsers');
  const adminTabPicks = document.getElementById('adminTabPicks');
  const usersPanel = document.getElementById('adminUsersPanel');
  const publishPanel = document.getElementById('adminPublishPanel');
  const publishBtn = document.getElementById('adminPublishPickBtn');
  const searchUsers = document.getElementById('adminSearchUsers');

  if (!overlay) return;

  // Open admin panel
  if (adminAddPickBtn) {
    adminAddPickBtn.addEventListener('click', () => {
      overlay.classList.remove('hidden');
      overlay.style.display = 'flex';
      // Default to publish tab when coming from add button
      switchAdminTab('picks');
      loadAdminUsers();
    });
  }

  // Also open admin from the admin badge click
  const nameLabel = document.getElementById('userDisplayName');
  if (nameLabel) {
    nameLabel.addEventListener('click', () => {
      const tier = state.userProfile?.subscription_tier || 'free';
      if (tier === 'admin' || state.currentUser?.email === 'garciayoan2002@gmail.com') {
        overlay.classList.remove('hidden');
        overlay.style.display = 'flex';
        switchAdminTab('users');
        loadAdminUsers();
      }
    });
  }

  // Close
  closeBtn.addEventListener('click', () => {
    overlay.classList.add('hidden');
    overlay.style.display = 'none';
  });
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.add('hidden');
      overlay.style.display = 'none';
    }
  });

  // Tab switching
  function switchAdminTab(tab) {
    if (tab === 'users') {
      usersPanel.classList.remove('hidden');
      publishPanel.classList.add('hidden');
      adminTabUsers.style.color = '#d4af37';
      adminTabUsers.style.borderBottom = '2px solid #d4af37';
      adminTabPicks.style.color = '';
      adminTabPicks.style.borderBottom = '2px solid transparent';
    } else {
      usersPanel.classList.add('hidden');
      publishPanel.classList.remove('hidden');
      adminTabPicks.style.color = '#d4af37';
      adminTabPicks.style.borderBottom = '2px solid #d4af37';
      adminTabUsers.style.color = '';
      adminTabUsers.style.borderBottom = '2px solid transparent';
    }
  }

  adminTabUsers.addEventListener('click', () => { switchAdminTab('users'); loadAdminUsers(); });
  adminTabPicks.addEventListener('click', () => switchAdminTab('picks'));

  // Search users
  if (searchUsers) {
    searchUsers.addEventListener('input', () => loadAdminUsers(searchUsers.value.toLowerCase().trim()));
  }

  // Load users
  async function loadAdminUsers(searchQuery = '') {
    const tbody = document.getElementById('adminUserTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = `<div class="text-center py-4 text-xs text-on-surface-variant">Cargando usuarios...</div>`;

    try {
      let query = supabase.from('user_profiles').select('id, email, subscription_tier, created_at').order('created_at', { ascending: false });
      
      const { data, error } = await query;
      if (error) {
        tbody.innerHTML = `<div class="text-center py-4 text-xs text-red-400">Error: ${error.message}</div>`;
        return;
      }

      let users = data || [];
      if (searchQuery) {
        users = users.filter(u => u.email.toLowerCase().includes(searchQuery));
      }

      if (users.length === 0) {
        tbody.innerHTML = `<div class="text-center py-4 text-xs text-on-surface-variant">No se encontraron usuarios.</div>`;
        return;
      }

      tbody.innerHTML = users.map(u => {
        const tierColors = {
          admin: 'background: rgba(139,92,246,0.15); color: #a78bfa; border: 1px solid rgba(139,92,246,0.3);',
          vip: 'background: rgba(212,175,55,0.15); color: #d4af37; border: 1px solid rgba(212,175,55,0.3);',
          free: 'background: rgba(255,255,255,0.05); color: #9ca3af; border: 1px solid rgba(255,255,255,0.1);'
        };
        const tierStyle = tierColors[u.subscription_tier] || tierColors.free;
        const tierLabel = u.subscription_tier.toUpperCase();
        const dateStr = new Date(u.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });

        let actionBtn = '';
        if (u.subscription_tier === 'free') {
          actionBtn = `<button class="admin-grant-vip px-3 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all hover:brightness-110" style="background: linear-gradient(135deg, #d4af37, #b8941f); color: #0b0e11;" data-email="${u.email}">Otorgar VIP</button>`;
        } else if (u.subscription_tier === 'vip') {
          actionBtn = `<button class="admin-revoke-vip px-3 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all hover:brightness-110" style="background: rgba(239,68,68,0.15); color: #ef4444; border: 1px solid rgba(239,68,68,0.3);" data-email="${u.email}">Quitar VIP</button>`;
        } else {
          actionBtn = `<span class="text-[10px] text-on-surface-variant/50 italic">Sistema</span>`;
        }

        return `
          <div class="flex items-center justify-between p-3 rounded-lg bg-surface-container-low border border-outline-variant/30 hover:bg-white/[0.03] transition-colors">
            <div class="flex-1 min-w-0">
              <p class="text-xs font-medium truncate">${u.email}</p>
              <p class="text-[10px] text-on-surface-variant/50 mt-0.5">${dateStr}</p>
            </div>
            <div class="flex items-center gap-2 shrink-0 ml-3">
              <span class="text-[9px] font-black px-2 py-0.5 rounded-full" style="${tierStyle}">${tierLabel}</span>
              ${actionBtn}
            </div>
          </div>`;
      }).join('');

      // Bind grant/revoke buttons
      tbody.querySelectorAll('.admin-grant-vip').forEach(btn => {
        btn.addEventListener('click', async () => {
          const email = btn.dataset.email;
          btn.textContent = '...';
          btn.disabled = true;
          const { error } = await supabase.from('user_profiles').update({ subscription_tier: 'vip' }).eq('email', email);
          if (error) alert('Error: ' + error.message);
          loadAdminUsers(searchQuery);
        });
      });

      tbody.querySelectorAll('.admin-revoke-vip').forEach(btn => {
        btn.addEventListener('click', async () => {
          const email = btn.dataset.email;
          if (!confirm(`¿Quitar acceso VIP a ${email}?`)) return;
          btn.textContent = '...';
          btn.disabled = true;
          const { error } = await supabase.from('user_profiles').update({ subscription_tier: 'free' }).eq('email', email);
          if (error) alert('Error: ' + error.message);
          loadAdminUsers(searchQuery);
        });
      });
    } catch (err) {
      console.error('Error loading admin users:', err);
      tbody.innerHTML = `<div class="text-center py-4 text-xs text-red-400">Error de conexión.</div>`;
    }
  }

  // ── Publish Mode Toggle ──
  const publishModeManual = document.getElementById('publishModeManual');
  const publishModeImage = document.getElementById('publishModeImage');
  const publishManualForm = document.getElementById('publishManualForm');
  const publishImageForm = document.getElementById('publishImageForm');

  if (publishModeManual && publishModeImage) {
    publishModeManual.addEventListener('click', () => {
      publishManualForm.classList.remove('hidden');
      publishImageForm.classList.add('hidden');
      publishModeManual.style.background = 'linear-gradient(135deg, #d4af37, #b8941f)';
      publishModeManual.style.color = '#0b0e11';
      publishModeImage.style.background = '';
      publishModeImage.style.color = '';
      publishModeImage.classList.add('text-on-surface-variant');
    });
    publishModeImage.addEventListener('click', () => {
      publishManualForm.classList.add('hidden');
      publishImageForm.classList.remove('hidden');
      publishModeImage.style.background = 'linear-gradient(135deg, #d4af37, #b8941f)';
      publishModeImage.style.color = '#0b0e11';
      publishModeManual.style.background = '';
      publishModeManual.style.color = '';
      publishModeImage.classList.remove('text-on-surface-variant');
    });
  }

  // ── Image Upload Handling ──
  const dropZone = document.getElementById('imageDropZone');
  const fileInput = document.getElementById('imageFileInput');
  const imagePreview = document.getElementById('imagePreview');
  const imageDropContent = document.getElementById('imageDropContent');
  const imageRemoveBtn = document.getElementById('imageRemoveBtn');
  let selectedImageFile = null;

  if (dropZone && fileInput) {
    dropZone.addEventListener('click', () => fileInput.click());
    
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.style.borderColor = '#d4af37';
      dropZone.style.background = 'rgba(212,175,55,0.05)';
    });
    dropZone.addEventListener('dragleave', () => {
      dropZone.style.borderColor = '';
      dropZone.style.background = '';
    });
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.style.borderColor = '';
      dropZone.style.background = '';
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) handleImageSelect(file);
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files[0]) handleImageSelect(fileInput.files[0]);
    });

    if (imageRemoveBtn) {
      imageRemoveBtn.addEventListener('click', () => {
        selectedImageFile = null;
        imagePreview.classList.add('hidden');
        imagePreview.src = '';
        imageDropContent.classList.remove('hidden');
        imageRemoveBtn.classList.add('hidden');
        fileInput.value = '';
      });
    }
  }

  function handleImageSelect(file) {
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen es demasiado grande. Máximo 5MB.');
      return;
    }
    selectedImageFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.src = e.target.result;
      imagePreview.classList.remove('hidden');
      imageDropContent.classList.add('hidden');
      if (imageRemoveBtn) imageRemoveBtn.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  }

  // ── Publish Manual Pick ──
  publishBtn.addEventListener('click', async () => {
    const sport = document.getElementById('adminPickSport').value;
    const playerName = document.getElementById('adminPickPlayer').value.trim();
    const teamCode = document.getElementById('adminPickTeam').value.trim();
    const market = document.getElementById('adminPickMarket').value.trim();
    const line = document.getElementById('adminPickLine').value.trim();
    const outcome = document.getElementById('adminPickOutcome').value;
    const odds = document.getElementById('adminPickOdds').value.trim();
    const hitRate = document.getElementById('adminPickHitRate').value.trim();
    const notes = document.getElementById('adminPickNotes').value.trim();

    if (!market || !line) {
      alert('Por favor completa al menos el Mercado y la Línea.');
      return;
    }

    publishBtn.textContent = 'Publicando...';
    publishBtn.disabled = true;

    try {
      const { error } = await supabase.from('premium_picks').insert({
        sport,
        player_name: playerName || null,
        team_code: teamCode || null,
        market,
        line,
        outcome,
        odds: odds || null,
        hit_rate_text: hitRate || null,
        notes: notes || null
      });

      if (error) {
        alert('Error al publicar: ' + error.message);
      } else {
        alert('✅ Pick VIP publicado correctamente.');
        document.getElementById('adminPickPlayer').value = '';
        document.getElementById('adminPickTeam').value = '';
        document.getElementById('adminPickMarket').value = '';
        document.getElementById('adminPickLine').value = '';
        document.getElementById('adminPickOdds').value = '';
        document.getElementById('adminPickHitRate').value = '';
        document.getElementById('adminPickNotes').value = '';
        if (state.activeTab === 'vip') loadVipPicks();
      }
    } catch (err) {
      alert('Error de conexión: ' + err.message);
    }

    publishBtn.textContent = '💎 Publicar Pick VIP';
    publishBtn.disabled = false;
  });

  // ── Publish Image Pick (base64 - no storage bucket needed) ──
  const publishImageBtn = document.getElementById('adminPublishImageBtn');
  if (publishImageBtn) {
    publishImageBtn.addEventListener('click', async () => {
      if (!selectedImageFile) {
        alert('Por favor selecciona una imagen primero.');
        return;
      }

      publishImageBtn.textContent = 'Procesando imagen...';
      publishImageBtn.disabled = true;

      try {
        // Convert image to base64, resizing to max 800px width to save space
        const imageUrl = await resizeAndConvertToBase64(selectedImageFile, 800);

        const sport = document.getElementById('adminPickImgSport').value;
        const caption = document.getElementById('adminPickImgCaption').value.trim();

        // Insert pick with base64 image
        const { error: insertError } = await supabase.from('premium_picks').insert({
          sport,
          player_name: null,
          team_code: null,
          market: 'IMAGE_PICK',
          line: '-',
          outcome: 'over',
          odds: null,
          hit_rate_text: null,
          notes: caption || null,
          image_url: imageUrl
        });

        if (insertError) {
          alert('Error al publicar: ' + insertError.message);
        } else {
          alert('✅ Pick con imagen publicado correctamente.');
          selectedImageFile = null;
          imagePreview.classList.add('hidden');
          imagePreview.src = '';
          imageDropContent.classList.remove('hidden');
          if (imageRemoveBtn) imageRemoveBtn.classList.add('hidden');
          fileInput.value = '';
          document.getElementById('adminPickImgCaption').value = '';
          if (state.activeTab === 'vip') loadVipPicks();
        }
      } catch (err) {
        alert('Error: ' + err.message);
      }

      publishImageBtn.textContent = '📷 Publicar Pick con Imagen';
      publishImageBtn.disabled = false;
    });
  }
}

// Helper: resize image and convert to base64 data URL
function resizeAndConvertToBase64(file, maxWidth) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to JPEG at 80% quality to save space
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Error al procesar la imagen'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Error al leer el archivo'));
    reader.readAsDataURL(file);
  });
}
