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
    <div className={`relative overflow-hidden rounded-2xl p-4 border bg-white/15 backdrop-blur-sm ${isStop || paused ? 'border-red-400/50' : 'border-white/20'}`}>
      {/* Cœurs décoratifs éparpillés en arrière-plan */}
      {isStop || paused ? (
        <AlertTriangle className="absolute top-0 right-0 w-24 h-24 text-red-400/15 -translate-y-4 translate-x-4 rotate-12 pointer-events-none" />
      ) : (
        <>
          <HeartPulse className="absolute top-0 right-0 w-24 h-24 text-white/10 -translate-y-4 translate-x-4 rotate-12 pointer-events-none" />
          <HeartPulse className="absolute bottom-0 left-0 w-14 h-14 text-white/[0.08] translate-y-3 -translate-x-2 -rotate-12 pointer-events-none" />
          <HeartPulse className="absolute top-1/2 left-1/3 w-8 h-8 text-white/[0.07] -rotate-6 pointer-events-none" />
          <HeartPulse className="absolute bottom-2 right-1/4 w-10 h-10 text-white/[0.08] rotate-6 pointer-events-none" />
        </>
      )}
      <div className="relative flex items-start gap-3 pr-8">
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
