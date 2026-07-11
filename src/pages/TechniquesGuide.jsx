import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useI18n } from '@/lib/i18n';
import { TECHNIQUES, isRecommendedFor } from '@/lib/advanced-techniques';

const GOAL_TKEY = {
  hypertrophy: 'type_hypertrophy', strength: 'type_strength',
  endurance: 'type_endurance', mixed: 'type_mixed',
};

export default function TechniquesGuide() {
  const navigate = useNavigate();
  const { t, lang } = useI18n();
  const L = (obj) => (obj?.[lang] ?? obj?.fr ?? '');

  const [objectiveTypes, setObjectiveTypes] = useState([]);
  const [onlyReco, setOnlyReco] = useState(false);

  // Fond violet forcé (évite la bande sombre à l'overscroll — page hors AppLayout)
  useEffect(() => {
    document.body.classList.add('legal-active');
    document.documentElement.classList.add('legal-active');
    return () => {
      document.body.classList.remove('legal-active');
      document.documentElement.classList.remove('legal-active');
    };
  }, []);

  useEffect(() => {
    base44.entities.Objective.filter({ status: 'active' })
      .then((objs) => setObjectiveTypes((objs || []).map((o) => o.type).filter(Boolean)))
      .catch(() => {});
  }, []);

  const hasObjectives = objectiveTypes.length > 0;
  const list = TECHNIQUES.map((tech) => ({ tech, reco: isRecommendedFor(tech, objectiveTypes) }));
  const shown = onlyReco ? list.filter((x) => x.reco) : list;

  return (
    <div className="min-h-screen bg-violet-600">
      <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} aria-label="Retour"
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl border border-white/30 text-white hover:bg-white/10 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white">{t('tech_title')}</h1>
        </div>

        <p className="text-sm text-white/60 leading-relaxed">{t('tech_intro')}</p>

        {/* Filtre : ne montrer que les techniques adaptées à mon objectif */}
        {hasObjectives && (
          <button type="button" onClick={() => setOnlyReco((v) => !v)}
            className="w-full flex items-center justify-between gap-3 p-4 rounded-2xl bg-white/10 border border-white/15 text-left hover:bg-white/[0.13] transition-colors">
            <div className="flex items-center gap-2.5 min-w-0">
              <Sparkles className="w-4 h-4 text-violet-200 flex-shrink-0" />
              <span className="text-sm font-medium text-white">{t('tech_filter_reco')}</span>
            </div>
            <span className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors ${onlyReco ? 'bg-violet-500' : 'bg-white/20'}`}>
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${onlyReco ? 'left-[22px]' : 'left-0.5'}`} />
            </span>
          </button>
        )}

        <div className="space-y-3">
          {shown.length === 0 ? (
            <p className="text-sm text-white/55 leading-relaxed p-4 rounded-2xl bg-white/[0.06] border border-white/10">
              {t('tech_none_reco')}
            </p>
          ) : shown.map(({ tech, reco }) => (
            <div key={tech.id}
              className={`rounded-2xl p-4 sm:p-5 border transition-colors ${reco ? 'bg-white/[0.14] border-violet-300/40 ring-1 ring-violet-300/30' : 'bg-white/10 border-white/15'}`}>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-xl leading-none">{tech.emoji}</span>
                <h2 className="text-base font-bold text-white">{L(tech.name)}</h2>
                {reco && (
                  <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-violet-400/25 text-violet-100 border border-violet-300/30">
                    {t('tech_reco_badge')}
                  </span>
                )}
              </div>

              <p className="text-[13px] text-white/70 mt-2 leading-relaxed">{L(tech.what)}</p>

              {/* Cas d'usage mis en évidence */}
              <div className="mt-3 p-3 rounded-xl bg-violet-500/15 border border-violet-300/20">
                <p className="text-[13px] text-white leading-relaxed">
                  <span className="font-bold text-violet-100">{t('tech_when')} </span>
                  {L(tech.when)}
                </p>
              </div>

              <p className="text-[13px] text-white/75 mt-3 leading-relaxed">
                <span className="font-semibold text-white">{t('tech_how')} : </span>{L(tech.how)}
              </p>
              <p className="text-[13px] text-amber-200/90 mt-2 leading-relaxed">
                <span className="font-semibold">{t('tech_caution')} : </span>{L(tech.caution)}
              </p>

              <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-white/40">{t('tech_for')} :</span>
                {tech.goals.map((g) => (
                  <span key={g} className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-white/70 border border-white/15">
                    {t(GOAL_TKEY[g]) || g}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
