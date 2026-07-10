import React from 'react';
import { TrendingUp, TrendingDown, Loader2, Pencil } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

// Carte actionnable d'autorégulation du volume (augmenter / alléger).
// Props : proposal { direction, label, detail, apply }, onApply, onManual, onDismiss, busy
export default function VolumeProposalCard({ proposal, onApply, onManual, onDismiss, busy }) {
  const { t } = useI18n();
  if (!proposal) return null;
  const isUp = proposal.direction === 'increase';
  const isRest = proposal.apply?.mode === 'rest';
  const Icon = isUp ? TrendingUp : TrendingDown;

  return (
    <div className="rounded-2xl p-4 border bg-white/15 backdrop-blur-sm border-white/20">
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${isUp ? 'bg-green-500/15' : 'bg-chart-4/15'}`}>
          <Icon className={`w-5 h-5 ${isUp ? 'text-green-400' : 'text-chart-4'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white">{proposal.label}</p>
          {proposal.detail && <p className="text-xs text-white/60 mt-0.5 leading-snug">{proposal.detail}</p>}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-3">
        {isRest ? (
          <button onClick={onDismiss} disabled={busy}
            className="text-xs font-semibold px-3 py-2 rounded-lg bg-white text-violet-700 hover:bg-white/90 transition-colors disabled:opacity-60">
            {t('got_it')}
          </button>
        ) : (
          <>
            <button onClick={onApply} disabled={busy}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-white text-violet-700 hover:bg-white/90 transition-colors disabled:opacity-60">
              {busy && <Loader2 className="w-3.5 h-3.5 animate-spin" />} {t('apply')}
            </button>
            <button onClick={onManual} disabled={busy}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-colors disabled:opacity-60">
              <Pencil className="w-3.5 h-3.5" /> {t('do_myself')}
            </button>
            <button onClick={onDismiss} disabled={busy}
              className="text-xs text-white/45 hover:text-white/70 px-2 py-2 transition-colors disabled:opacity-60">
              {t('ignore')}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
