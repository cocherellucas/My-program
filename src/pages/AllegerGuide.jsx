import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, TrendingDown } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { LEVIERS, IDEES_RECUES } from '@/lib/alleger-guide';

// Guide « comment alléger une semaine ». Contrepartie du passage aux conseils
// par données : l'app dit QUOI faire à partir de ce qu'elle mesure, ce guide
// explique COMMENT — sans jamais nommer d'exercice (voir alleger-guide.js).
export default function AllegerGuide() {
  const navigate = useNavigate();
  const { t, lang } = useI18n();
  const L = (obj) => (obj?.[lang] ?? obj?.fr ?? '');

  // Fond violet forcé (page hors AppLayout — même motif que TechniquesGuide)
  useEffect(() => {
    document.body.classList.add('legal-active');
    document.documentElement.classList.add('legal-active');
    return () => {
      document.body.classList.remove('legal-active');
      document.documentElement.classList.remove('legal-active');
    };
  }, []);

  return (
    <div className="min-h-screen bg-violet-800 px-4 py-6" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 1.5rem)' }}>
      <div className="max-w-2xl mx-auto space-y-6">
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors text-sm font-medium">
          <ChevronLeft className="w-4 h-4" /> {t('se_back')}
        </button>

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-chart-4/20 flex items-center justify-center flex-shrink-0">
            <TrendingDown className="w-5 h-5 text-chart-4" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-2xl text-white leading-tight">{t('al_title')}</h1>
            <p className="text-white/60 text-sm mt-1 leading-snug">{t('al_sub')}</p>
          </div>
        </div>

        <p className="text-xs text-white/50 leading-relaxed bg-white/[0.07] border border-white/10 rounded-xl p-3">
          {t('al_intro')}
        </p>

        <div className="space-y-3">
          {LEVIERS.map((lev) => (
            <div key={lev.id} className="rounded-2xl bg-white/10 border border-white/15 p-4 space-y-2">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-white/15 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {lev.ordre}
                </span>
                <h2 className="font-heading font-bold text-base text-white">{L(lev.titre)}</h2>
              </div>
              <p className="text-sm text-white/85 leading-snug">{L(lev.quoi)}</p>
              <p className="text-xs text-white/55 leading-relaxed">
                <span className="font-semibold text-white/70">{t('al_why')} </span>{L(lev.pourquoi)}
              </p>
              <p className="text-xs text-violet-200/80 leading-relaxed">
                <span className="font-semibold">{t('al_when')} </span>{L(lev.quand)}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-3 pt-2">
          <p className="text-xs font-medium text-white/50 uppercase tracking-wide">{t('al_myths')}</p>
          {IDEES_RECUES.map((m) => (
            <div key={m.id} className="rounded-2xl bg-white/[0.07] border border-white/10 p-4 space-y-1.5">
              <p className="text-sm font-semibold text-white">« {L(m.mythe)} »</p>
              <p className="text-xs text-white/65 leading-relaxed">{L(m.reponse)}</p>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-white/35 leading-relaxed pb-6">{t('al_foot')}</p>
      </div>
    </div>
  );
}
