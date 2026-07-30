import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export const AuthView: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfoMsg('');
    if (!email || !password) {
      setError('Completá email y contraseña.');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'login') {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
      } else {
        const { data, error: err } = await supabase.auth.signUp({ email, password });
        if (err) throw err;
        if (data.user && !data.session) {
          setInfoMsg('¡Cuenta creada! Revisá tu correo para confirmar antes de entrar.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error. Probá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden relative">
      <div className="mesh-gradient" />
      <div className="hidden lg:block absolute top-1/4 -left-20 w-64 h-64 bg-[#a078ff]/10 rounded-full blur-[120px]" />
      <div className="hidden lg:block absolute bottom-1/4 -right-20 w-80 h-80 bg-[#5431a0]/10 rounded-full blur-[140px]" />

      <main className="w-full max-w-[440px] z-10">
        <div className="text-center mb-10">
          <h1 className="logo-3d font-sans text-4xl font-extrabold mb-2 select-none">BetTracker</h1>
          <p className="text-[#cbc3d7] text-sm opacity-80 uppercase tracking-widest font-semibold">Console de Elite</p>
        </div>

        <div className="glass-card rounded-[32px] p-8 md:p-10">
          <div className="flex mb-8 rounded-xl bg-[#1b1b1d] p-1">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); setInfoMsg(''); }}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'login' ? 'bg-[#a078ff] text-[#340080]' : 'text-[#cbc3d7]'}`}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(''); setInfoMsg(''); }}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'register' ? 'bg-[#a078ff] text-[#340080]' : 'text-[#cbc3d7]'}`}
            >
              Crear Cuenta
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[#cbc3d7] text-xs uppercase font-bold tracking-wide ml-1">Correo Electrónico</label>
              <div className="extruded-input rounded-xl flex items-center px-4 py-3.5 group">
                <span className="material-symbols-outlined text-[#958e9f] group-focus-within:text-[#a078ff] transition-colors text-[20px]" data-icon="mail">mail</span>
                <input
                  className="bg-transparent border-none focus:ring-0 w-full text-[#e5e1e4] text-sm placeholder:text-[#494453]/70 ml-3 outline-none"
                  placeholder="nombre@ejemplo.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[#cbc3d7] text-xs uppercase font-bold tracking-wide ml-1">Contraseña</label>
              <div className="extruded-input rounded-xl flex items-center px-4 py-3.5 group">
                <span className="material-symbols-outlined text-[#958e9f] group-focus-within:text-[#a078ff] transition-colors text-[20px]" data-icon="lock">lock</span>
                <input
                  className="bg-transparent border-none focus:ring-0 w-full text-[#e5e1e4] text-sm placeholder:text-[#494453]/70 ml-3 outline-none"
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
                <button type="button" onClick={() => setShowPassword((s) => !s)} className="text-[#494453] hover:text-[#cbc3d7] transition-colors">
                  <span className="material-symbols-outlined text-[20px]" data-icon="visibility">visibility</span>
                </button>
              </div>
            </div>

            {error && <p className="text-[#ffb4ab] text-xs bg-[#93000a]/20 border border-[#93000a]/40 rounded-lg px-3 py-2">{error}</p>}
            {infoMsg && <p className="text-[#4edea3] text-xs bg-[#00a572]/10 border border-[#00a572]/30 rounded-lg px-3 py-2">{infoMsg}</p>}

            <button
              type="submit"
              disabled={loading}
              className="btn-3d w-full py-4 rounded-2xl text-[#340080] font-extrabold uppercase tracking-wide flex items-center justify-center gap-2 mt-4 disabled:cursor-not-allowed"
            >
              <span>{loading ? 'Un momento...' : mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}</span>
              {!loading && <span className="material-symbols-outlined font-bold" data-icon="arrow_forward">arrow_forward</span>}
            </button>
          </form>
        </div>

        <footer className="mt-8 text-center text-[#494453] text-[10px] uppercase tracking-widest opacity-60">
          © 2026 BetTracker. Juego Responsable. 18+
        </footer>
      </main>
    </div>
  );
};
