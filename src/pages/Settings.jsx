import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { base44 } from '@/api/base44Client';
import { useTutorial } from '@/lib/TutorialContext';
import { useI18n, switchLanguageAndRestart } from '@/lib/i18n';
import { ChevronLeft, LogOut, RotateCcw, FileText, Brain, ChevronRight, Check, Globe } from 'lucide-react';

export default function Settings() {
  const navigate = useNavigate();
  const { resetTutorial } = useTutorial() || {};
  const { t, lang, setLang } = useI18n();
  const [confirmLang, setConfirmLang] = useState(null); // langue en attente de confirmation (reload requis)
  const [confirmLogout, setConfirmLogout] = useState(false);

  // Infos du compte (email, ancienneté, plan)
  const [account, setAccount] = useState(null);
  useEffect(() => { base44.auth.me().then(setAccount).catch(() => {}); }, []);
  const memberSince = (() => {
    const d = account?.created_at || account?.created_date;
    if (!d) return null;
    try { return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }); } catch { return null; }
  })();

  // Conseils du coach pendant la séance (préférence locale)
  const [coachTipsEnabled, setCoachTipsEnabled] = useState(() => {
    try { return localStorage.getItem('coach_tips_disabled') !== '1'; } catch { return true; }
  });
  const toggleCoachTips = () => {
    setCoachTipsEnabled(v => {
      const nv = !v;
      try { if (nv) localStorage.removeItem('coach_tips_disabled'); else localStorage.setItem('coach_tips_disabled', '1'); } catch {}
      return nv;
    });
  };

  const [confirmResetTutos, setConfirmResetTutos] = useState(false);
  const resetTutorials = () => {
    // On efface l'état des tutos puis on recharge : le TutorialProvider relit un
    // état vide au démarrage → les tutos rejouent (import, app…).
    try { localStorage.removeItem('tutorial_state'); } catch {}
    window.location.href = '/';
  };

  // Tutoriels réinitialisables individuellement (rejouent à leur prochaine occasion)
  const TUTORIALS = [
    { id: 'import-dialog', label: t('tuto_import'), hint: t('tuto_import_hint') },
    { id: 'overview-intro', label: t('tuto_overview'), hint: t('tuto_overview_hint') },
    { id: 'coach-tip-intro', label: t('tuto_coach'), hint: t('tuto_coach_hint') },
    { id: 'profile-intro', label: t('tuto_profile'), hint: t('tuto_profile_hint') },
    { id: 'objectives-intro', label: t('tuto_objectives'), hint: t('tuto_objectives_hint') },
  ];
  const [resetDone, setResetDone] = useState({}); // id -> true (feedback visuel)
  const handleResetOne = (id) => {
    resetTutorial?.(id);
    setResetDone(prev => ({ ...prev, [id]: true }));
  };

  const LEGAL_LINKS = [
    { label: t('legal_cgu'), doc: 'cgu' },
    { label: t('legal_privacy'), doc: 'confidentialite' },
    { label: t('legal_mentions'), doc: 'mentions' },
  ];

  return (
    <div className="min-h-screen bg-violet-600">
      <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} aria-label="Retour"
          className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl border border-white/30 text-white hover:bg-white/10 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white">{t('set_title')}</h1>
      </div>

      {/* Langue */}
      <div className="space-y-3">
        <p className="text-xs font-medium text-white/50 uppercase tracking-wide">{t('set_lang')}</p>
        <div className="w-full flex items-center justify-between gap-3 p-4 rounded-2xl bg-white/10 border border-white/15">
          <div className="flex items-center gap-3 min-w-0">
            <Globe className="w-5 h-5 text-white/60 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-white">{t('set_lang')}</p>
              <p className="text-xs text-white/45 mt-0.5 leading-snug">{t('set_lang_hint')}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {[{ id: 'fr', label: 'Français' }, { id: 'en', label: 'English' }].map(({ id, label }) => (
              <button key={id} type="button"
                onClick={() => { if (id !== lang) setConfirmLang(id); }}
                className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors ${lang === id ? 'bg-white text-violet-700' : 'bg-white/10 text-white/60 border border-white/20 hover:bg-white/20'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Séance */}
      <div className="space-y-3">
        <p className="text-xs font-medium text-white/50 uppercase tracking-wide">{t('set_session')}</p>
        <button type="button" onClick={toggleCoachTips}
          className="w-full flex items-center justify-between gap-3 p-4 rounded-2xl bg-white/10 border border-white/15 text-left hover:bg-white/[0.13] transition-colors">
          <div className="min-w-0">
            <p className="text-sm font-medium text-white">{t('set_coach_tips')}</p>
            <p className="text-xs text-white/45 mt-0.5 leading-snug">{t('set_coach_tips_hint')}</p>
          </div>
          <span className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors ${coachTipsEnabled ? 'bg-violet-500' : 'bg-white/20'}`}>
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${coachTipsEnabled ? 'left-[22px]' : 'left-0.5'}`} />
          </span>
        </button>
      </div>

      {/* Coach */}
      <div className="space-y-3">
        <p className="text-xs font-medium text-white/50 uppercase tracking-wide">{t('set_coach')}</p>
        <button type="button" onClick={() => navigate('/memory')}
          className="w-full flex items-center justify-between gap-3 p-4 rounded-2xl bg-white/10 border border-white/15 text-left hover:bg-white/[0.13] transition-colors">
          <div className="flex items-center gap-3 min-w-0">
            <Brain className="w-5 h-5 text-white/60 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-white">{t('set_memory')}</p>
              <p className="text-xs text-white/45 mt-0.5 leading-snug">{t('set_memory_hint')}</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-white/40 flex-shrink-0" />
        </button>
      </div>

      {/* Tutoriels — revoir individuellement, ou tout revoir */}
      <div className="space-y-3">
        <p className="text-xs font-medium text-white/50 uppercase tracking-wide">{t('set_tutorials')}</p>
        <div className="rounded-2xl bg-white/10 border border-white/15 overflow-hidden divide-y divide-white/10">
          {TUTORIALS.map(({ id, label, hint }) => (
            <button key={id} type="button" onClick={() => handleResetOne(id)} disabled={resetDone[id]}
              className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-white/[0.06] transition-colors disabled:opacity-80">
              <div className="min-w-0">
                <p className="text-sm font-medium text-white">{label}</p>
                <p className="text-xs text-white/45 mt-0.5 leading-snug">{resetDone[id] ? t('tuto_reset_done') : hint}</p>
              </div>
              {resetDone[id]
                ? <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                : <RotateCcw className="w-4 h-4 text-white/50 flex-shrink-0" />}
            </button>
          ))}
        </div>
        {!confirmResetTutos ? (
          <button type="button" onClick={() => setConfirmResetTutos(true)}
            className="w-full flex items-center justify-between gap-3 p-4 rounded-2xl bg-white/10 border border-white/15 text-left hover:bg-white/[0.13] transition-colors">
            <div className="min-w-0">
              <p className="text-sm font-medium text-white">{t('tuto_all')}</p>
              <p className="text-xs text-white/45 mt-0.5 leading-snug">{t('tuto_all_hint')}</p>
            </div>
            <RotateCcw className="w-5 h-5 text-white/50 flex-shrink-0" />
          </button>
        ) : (
          <div className="p-4 rounded-2xl bg-white/10 border border-white/15 space-y-3">
            <p className="text-xs text-white/70 leading-snug">{t('tuto_all_confirm')}</p>
            <div className="flex items-center gap-2">
              <button onClick={resetTutorials} className="text-xs px-3 py-2 rounded-lg bg-violet-500 text-white font-medium hover:bg-violet-600 transition-colors">{t('tuto_all_yes')}</button>
              <button onClick={() => setConfirmResetTutos(false)} className="text-xs px-3 py-2 rounded-lg bg-white/15 text-white font-medium hover:bg-white/25 transition-colors">{t('cancel')}</button>
            </div>
          </div>
        )}
      </div>

      {/* Juridique */}
      <div className="space-y-3">
        <p className="text-xs font-medium text-white/50 uppercase tracking-wide">{t('set_legal')}</p>
        <div className="rounded-2xl bg-white/10 border border-white/15 overflow-hidden divide-y divide-white/10">
          {LEGAL_LINKS.map(({ label, doc }) => (
            <button key={doc} type="button" onClick={() => navigate(`/legal?doc=${doc}`)}
              className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-white/[0.06] transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="w-4 h-4 text-white/50 flex-shrink-0" />
                <span className="text-sm text-white truncate">{label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-white/40 flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Compte */}
      <div className="space-y-3">
        <p className="text-xs font-medium text-white/50 uppercase tracking-wide">{t('set_account')}</p>
        <div className="rounded-2xl bg-white/10 border border-white/15 overflow-hidden divide-y divide-white/10">
          <div className="flex items-center justify-between gap-3 p-4">
            <span className="text-sm text-white/60">{t('account_email')}</span>
            <span className="text-sm text-white font-medium truncate">{account?.email || '—'}</span>
          </div>
          <div className="flex items-center justify-between gap-3 p-4">
            <span className="text-sm text-white/60">{t('account_since')}</span>
            <span className="text-sm text-white font-medium">{memberSince || '—'}</span>
          </div>
          <div className="flex items-center justify-between gap-3 p-4">
            <span className="text-sm text-white/60">{t('account_plan')}</span>
            <span className="text-sm text-white font-medium capitalize">{account?.subscription_plan || 'Starter'}</span>
          </div>
        </div>
        <button onClick={() => setConfirmLogout(true)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold bg-red-500/15 text-red-300 border border-red-400/30 hover:bg-red-500/25 transition-colors">
          <LogOut className="w-4 h-4" /> {t('logout')}
        </button>
      </div>

      {/* Confirmation changement de langue (l'app se relance) */}
      {confirmLang && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6" onClick={() => setConfirmLang(null)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-violet-900 border border-white/20 rounded-2xl p-6 w-full max-w-xs shadow-2xl text-center space-y-4" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-violet-500/30 flex items-center justify-center mx-auto">
              <Globe className="w-6 h-6 text-violet-300" />
            </div>
            <div>
              <p className="font-bold text-white text-base">{t('lang_confirm_title')}</p>
              <p className="text-sm text-white/60 mt-1">{t('lang_confirm_sub')}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setConfirmLang(null)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-white/10 text-white hover:bg-white/20 transition-colors">
                {t('cancel')}
              </button>
              <button onClick={() => switchLanguageAndRestart(confirmLang)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-white text-violet-700 hover:bg-white/90 transition-colors">
                {t('lang_confirm_yes')}
              </button>
            </div>
          </div>
        </div>
      , document.body)}

      {confirmLogout && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6" onClick={() => setConfirmLogout(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-violet-900 border border-white/20 rounded-2xl p-6 w-full max-w-xs shadow-2xl text-center space-y-4" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="font-bold text-white text-base">{t('logout_confirm')}</p>
              <p className="text-sm text-white/60 mt-1">{t('logout_sub')}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setConfirmLogout(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-white/10 text-white hover:bg-white/20 transition-colors">
                {t('cancel')}
              </button>
              <button onClick={() => base44.auth.logout()} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors">
                {t('logout_yes')}
              </button>
            </div>
          </div>
        </div>
      , document.body)}
      </div>
    </div>
  );
}
