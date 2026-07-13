import React, { useState } from 'react';
import { Moon, Sparkles, Droplet } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

// Carte « cycle » de l'Accueil — discrète, informative, jamais prescriptive.
// Affiche le jour + la phase + le conseil du jour, et permet de recaler le
// cycle (« Mes règles ont commencé ») avec une confirmation inline.
export default function CycleCard({ cycle, busy, onReanchor }) {
  const { t, lang } = useI18n();
  const [confirming, setConfirming] = useState(false);
  if (!cycle) return null;

  const btn = 'text-xs font-semibold px-3 py-2 rounded-lg transition-colors disabled:opacity-60';
  const L = (obj) => obj?.[lang] ?? obj?.fr ?? '';

  return (
    <div className="relative overflow-hidden rounded-2xl p-4 border bg-white/15 backdrop-blur-sm border-white/20">
      {/* Fond décoratif discret */}
      <Moon className="absolute -right-3 -top-3 w-16 h-16 text-white/[0.08] pointer-events-none" />
      <Sparkles className="absolute right-12 bottom-1 w-8 h-8 text-white/[0.07] pointer-events-none" />
      <Droplet className="absolute -left-2 -bottom-2 w-10 h-10 text-white/[0.06] pointer-events-none" />

      <div className="relative space-y-3">
        {cycle.needsReanchor ? (
          <>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0 text-lg">🌙</div>
              <p className="text-sm font-bold text-white">{t('cy_title')}</p>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">{t('cy_reanchor_msg')}</p>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0 text-lg">{cycle.emoji}</div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white">{t('cy_day')} {cycle.day} · {L(cycle.name)}</p>
                {cycle.inGrace && <p className="text-[11px] text-white/50 mt-0.5">{t('cy_grace')}</p>}
              </div>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">{L(cycle.advice)}</p>
          </>
        )}

        {/* Recalage — inutile au jour 1 (déjà calé sur aujourd'hui). On le garde
            en mode « à recaler » où c'est justement l'action principale. */}
        {(cycle.needsReanchor || cycle.day > 1) && (
          !confirming ? (
          <button onClick={() => setConfirming(true)} disabled={busy}
            className={`${btn} bg-white/10 text-white hover:bg-white/20 border border-white/20`}>
            🩸 {t('cy_period_started')}
          </button>
        ) : (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-white/70">{t('cy_confirm')}</span>
            <button onClick={() => { setConfirming(false); onReanchor?.(); }} disabled={busy}
              className={`${btn} bg-white text-violet-700 hover:bg-white/90`}>
              {t('cy_yes')}
            </button>
            <button onClick={() => setConfirming(false)} disabled={busy}
              className={`${btn} bg-white/10 text-white hover:bg-white/20`}>
              {t('cancel')}
            </button>
          </div>
          )
        )}
      </div>
    </div>
  );
}
