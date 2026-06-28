import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { base44 } from '@/api/base44Client';
import { ChevronLeft, LogOut, RotateCcw, FileText } from 'lucide-react';

export default function Settings() {
  const navigate = useNavigate();
  const [confirmLogout, setConfirmLogout] = useState(false);

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

  // Liens juridiques — placeholders, à brancher plus tard
  const LEGAL_LINKS = [
    { label: "Conditions d'utilisation" },
    { label: 'Politique de confidentialité' },
    { label: 'Mentions légales' },
  ];

  return (
    <div className="min-h-screen bg-violet-600">
      <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} aria-label="Retour"
          className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl border border-white/30 text-white hover:bg-white/10 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white">Paramètres</h1>
      </div>

      {/* Séance */}
      <div className="space-y-3">
        <p className="text-xs font-medium text-white/50 uppercase tracking-wide">Séance</p>
        <button type="button" onClick={toggleCoachTips}
          className="w-full flex items-center justify-between gap-3 p-4 rounded-2xl bg-white/10 border border-white/15 text-left hover:bg-white/[0.13] transition-colors">
          <div className="min-w-0">
            <p className="text-sm font-medium text-white">Conseils du coach en séance</p>
            <p className="text-xs text-white/45 mt-0.5 leading-snug">Bulle qui te suggère d'ajuster repos/poids selon tes performances.</p>
          </div>
          <span className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors ${coachTipsEnabled ? 'bg-violet-500' : 'bg-white/20'}`}>
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${coachTipsEnabled ? 'left-[22px]' : 'left-0.5'}`} />
          </span>
        </button>
      </div>

      {/* Tutoriels */}
      <div className="space-y-3">
        <p className="text-xs font-medium text-white/50 uppercase tracking-wide">Tutoriels</p>
        {!confirmResetTutos ? (
          <button type="button" onClick={() => setConfirmResetTutos(true)}
            className="w-full flex items-center justify-between gap-3 p-4 rounded-2xl bg-white/10 border border-white/15 text-left hover:bg-white/[0.13] transition-colors">
            <div className="min-w-0">
              <p className="text-sm font-medium text-white">Revoir les tutoriels</p>
              <p className="text-xs text-white/45 mt-0.5 leading-snug">Rejoue les explications (importation, fonctionnement de l'app…).</p>
            </div>
            <RotateCcw className="w-5 h-5 text-white/50 flex-shrink-0" />
          </button>
        ) : (
          <div className="p-4 rounded-2xl bg-white/10 border border-white/15 space-y-3">
            <p className="text-xs text-white/70 leading-snug">Relancer tous les tutoriels ? L'app va se recharger et les explications réapparaîtront aux endroits concernés.</p>
            <div className="flex items-center gap-2">
              <button onClick={resetTutorials} className="text-xs px-3 py-2 rounded-lg bg-violet-500 text-white font-medium hover:bg-violet-600 transition-colors">Oui, revoir</button>
              <button onClick={() => setConfirmResetTutos(false)} className="text-xs px-3 py-2 rounded-lg bg-white/15 text-white font-medium hover:bg-white/25 transition-colors">Annuler</button>
            </div>
          </div>
        )}
      </div>

      {/* Juridique (à compléter plus tard) */}
      <div className="space-y-3">
        <p className="text-xs font-medium text-white/50 uppercase tracking-wide">Juridique</p>
        <div className="rounded-2xl bg-white/10 border border-white/15 overflow-hidden divide-y divide-white/10">
          {LEGAL_LINKS.map(({ label }) => (
            <div key={label} className="w-full flex items-center justify-between gap-3 p-4 text-left opacity-60">
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="w-4 h-4 text-white/50 flex-shrink-0" />
                <span className="text-sm text-white truncate">{label}</span>
              </div>
              <span className="text-[10px] uppercase tracking-wider text-white/40 flex-shrink-0">Bientôt</span>
            </div>
          ))}
        </div>
      </div>

      {/* Compte */}
      <div className="space-y-3">
        <p className="text-xs font-medium text-white/50 uppercase tracking-wide">Compte</p>
        <button onClick={() => setConfirmLogout(true)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold bg-red-500/15 text-red-300 border border-red-400/30 hover:bg-red-500/25 transition-colors">
          <LogOut className="w-4 h-4" /> Déconnexion
        </button>
      </div>

      {confirmLogout && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6" onClick={() => setConfirmLogout(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-violet-900 border border-white/20 rounded-2xl p-6 w-full max-w-xs shadow-2xl text-center space-y-4" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="font-bold text-white text-base">Se déconnecter ?</p>
              <p className="text-sm text-white/60 mt-1">Tu devras te reconnecter pour accéder à ton compte.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setConfirmLogout(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-white/10 text-white hover:bg-white/20 transition-colors">
                Annuler
              </button>
              <button onClick={() => base44.auth.logout()} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors">
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      , document.body)}
      </div>
    </div>
  );
}
