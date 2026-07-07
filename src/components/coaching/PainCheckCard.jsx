import React from 'react';
import { HeartPulse, Loader2, Pencil, AlertTriangle } from 'lucide-react';
import { ZONE_ART } from '@/lib/pain-engine';

// Carte de suivi douleur — 2 étapes :
//   1. question « Comment a réagi ton poignet ? » (4 réponses)
//   2. la prescription du coach (Appliquer / Le faire moi-même / Ignorer)
// Variante « pause » quand l'épisode est en stop_advised (douleur vive).
// Props : episode, proposal (null = étape question), busy,
//         onReaction(r), onApply, onManual, onDismiss, onResume, onEnd
export default function PainCheckCard({ episode, proposal, busy, onReaction, onApply, onManual, onDismiss, onResume, onEnd }) {
  if (!episode) return null;
  const art = ZONE_ART[episode.zone] || episode.zone;
  const paused = episode.status === 'stop_advised' && !proposal;
  const isStop = proposal?.direction === 'stop';
  const infoOnly = proposal && (proposal.direction === 'none' || proposal.direction === 'resolved');

  const btn = 'text-xs font-semibold px-3 py-2 rounded-lg transition-colors disabled:opacity-60';

  return (
    <div className="rounded-2xl p-4 border" style={{ background: 'linear-gradient(135deg,#1e0050,#3b0764 55%,#1e0050)', borderColor: isStop || paused ? 'rgba(248,113,113,0.5)' : 'rgba(139,92,246,0.45)' }}>
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${isStop || paused ? 'bg-red-500/15' : 'bg-chart-4/15'}`}>
          {isStop || paused
            ? <AlertTriangle className="w-5 h-5 text-red-400" />
            : <HeartPulse className="w-5 h-5 text-chart-4" />}
        </div>
        <div className="flex-1 min-w-0">
          {paused ? (
            <>
              <p className="text-sm font-bold text-white">Suivi de {art} en pause</p>
              <p className="text-xs text-white/60 mt-0.5 leading-snug">Tu avais signalé une douleur vive — repos de la zone et avis médical conseillés. Reprends le suivi quand tu te ré-entraînes dessus.</p>
            </>
          ) : proposal ? (
            <>
              <p className="text-sm font-bold text-white">{proposal.label}</p>
              {proposal.detail && <p className="text-xs text-white/60 mt-0.5 leading-snug">{proposal.detail}</p>}
            </>
          ) : (
            <>
              <p className="text-sm font-bold text-white">Comment a réagi {art} depuis la dernière fois ?</p>
              <p className="text-xs text-white/60 mt-0.5 leading-snug">Ta réponse ajuste la suite : charge, séries, fréquence.</p>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
        {paused ? (
          <>
            <button onClick={onResume} disabled={busy} className={`${btn} bg-white text-violet-700 hover:bg-white/90`}>Reprendre le suivi</button>
            <button onClick={onEnd} disabled={busy} className={`${btn} text-white/45 hover:text-white/70`}>Terminer le suivi</button>
          </>
        ) : !proposal ? (
          <>
            <button onClick={() => onReaction('better')} disabled={busy} className={`${btn} bg-green-500/20 text-green-300 border border-green-400/30 hover:bg-green-500/30`}>😌 Mieux</button>
            <button onClick={() => onReaction('same')} disabled={busy} className={`${btn} bg-white/10 text-white border border-white/20 hover:bg-white/20`}>😐 Pareil</button>
            <button onClick={() => onReaction('worse')} disabled={busy} className={`${btn} bg-orange-500/20 text-orange-300 border border-orange-400/30 hover:bg-orange-500/30`}>😣 Pire</button>
            <button onClick={() => onReaction('sharp')} disabled={busy} className={`${btn} bg-red-500/20 text-red-300 border border-red-400/30 hover:bg-red-500/30`}>⚡ Douleur vive</button>
          </>
        ) : infoOnly ? (
          <button onClick={onDismiss} disabled={busy} className={`${btn} bg-white text-violet-700 hover:bg-white/90`}>Compris</button>
        ) : (
          <>
            <button onClick={onApply} disabled={busy} className={`${btn} flex items-center gap-1.5 bg-white text-violet-700 hover:bg-white/90`}>
              {busy && <Loader2 className="w-3.5 h-3.5 animate-spin" />} {isStop ? 'Retirer 7 jours' : 'Appliquer'}
            </button>
            {!isStop && (
              <button onClick={onManual} disabled={busy} className={`${btn} flex items-center gap-1.5 bg-white/10 text-white border border-white/20 hover:bg-white/20`}>
                <Pencil className="w-3.5 h-3.5" /> Le faire moi-même
              </button>
            )}
            <button onClick={onDismiss} disabled={busy} className={`${btn} text-white/45 hover:text-white/70 px-2`}>{isStop ? 'Compris' : 'Ignorer'}</button>
          </>
        )}
      </div>
    </div>
  );
}
