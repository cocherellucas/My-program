import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/api/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { markTermsAcceptedLocal } from '@/lib/terms';

export default function Login() {
  const navigate = useNavigate();
  const { t, lang, setLang } = useI18n();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/');
    });
  }, [navigate]);

  // Synchronise le fond body/html avec le violet de la page (évite la bande sombre à l'overscroll)
  useEffect(() => {
    document.body.classList.add('login-active');
    document.documentElement.classList.add('login-active');
    return () => {
      document.body.classList.remove('login-active');
      document.documentElement.classList.remove('login-active');
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      setError(t('needs_connection'));
      return;
    }
    setLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        const params = new URLSearchParams(window.location.search);
        navigate(params.get('redirect') || '/');
      } else {
        if (!acceptTerms) { setError(t('signup_must_accept')); setLoading(false); return; }
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        // Acceptation validée ici (case cochée). L'utilisateur n'a pas encore de
        // session (confirmation email) → on la mémorise localement ; l'app écrira
        // la preuve serveur à la 1ʳᵉ connexion (voir src/lib/terms.js + App.jsx).
        markTermsAcceptedLocal();
        setError(t('signup_check_email'));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-violet-800 flex items-center justify-center p-4 relative">
      {/* Choix de la langue (avant même de se connecter / créer un compte) */}
      <div className="absolute top-4 right-4 flex items-center gap-0.5 rounded-full bg-white/10 border border-white/20 p-0.5 text-xs font-bold" style={{ top: 'max(1rem, env(safe-area-inset-top))' }}>
        <button type="button" onClick={() => setLang('fr')}
          className={`px-2.5 py-1 rounded-full transition-colors ${lang === 'fr' ? 'bg-white text-violet-700' : 'text-white/70 hover:text-white'}`}>🇫🇷 FR</button>
        <button type="button" onClick={() => setLang('en')}
          className={`px-2.5 py-1 rounded-full transition-colors ${lang === 'en' ? 'bg-white text-violet-700' : 'text-white/70 hover:text-white'}`}>🇬🇧 EN</button>
      </div>
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <img src="/robotapp.png" alt="Coach IA" className="w-10 h-10 rounded-xl object-cover" />
          <span className="font-bold text-2xl text-white">Coach IA</span>
        </div>

        <Card className="p-8 bg-white/10 backdrop-blur-sm border-white/20 text-white">
          <h2 className="text-xl font-bold text-white mb-6 text-center">
            {mode === 'login' ? t('login_title') : t('signup_title')}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-white">{t('email')}</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value.replace(/\s/g, ''))}
                onKeyDown={(e) => { if (e.key === ' ') e.preventDefault(); }}
                required
                placeholder="ton@email.com"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/50"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-white">{t('password')}</Label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value.replace(/\s/g, ''))}
                  onKeyDown={(e) => { if (e.key === ' ') e.preventDefault(); }}
                  required
                  placeholder="••••••••"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/50 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-300 bg-red-900/30 border border-red-400/30 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {mode === 'login' ? t('login_btn') : t('signup_btn')}
            </Button>

            {mode === 'signup' && (
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded accent-violet-500 flex-shrink-0" />
                <span className="text-[11px] text-white/60 leading-snug">
                  {t('accept_1')}{' '}
                  <button type="button" onClick={() => navigate('/legal?doc=cgu')} className="underline hover:text-white/90 text-white/80">{t('legal_cgu')}</button>
                  {t('accept_sep_privacy')}{' '}
                  <button type="button" onClick={() => navigate('/legal?doc=confidentialite')} className="underline hover:text-white/90 text-white/80">{t('legal_privacy')}</button>
                  {t('accept_sep_mentions')}{' '}
                  <button type="button" onClick={() => navigate('/legal?doc=mentions')} className="underline hover:text-white/90 text-white/80">{t('legal_mentions')}</button>
                  {', '}{t('accept_3')}
                </span>
              </label>
            )}
          </form>

          <p className="text-center text-sm text-white/60 mt-4">
            {mode === 'login' ? t('no_account') : t('have_account')}{' '}
            <button
              type="button"
              className="text-white underline hover:no-underline"
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
            >
              {mode === 'login' ? t('signup_title') : t('login_btn')}
            </button>
          </p>
        </Card>
      </div>
    </div>
  );
}
