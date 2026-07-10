import React from 'react';
import { HeartPulse, Loader2, Pencil, AlertTriangle, HelpCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ZONE_ART } from '@/lib/pain-engine';
import { useI18n } from '@/lib/i18n';

// Carte de suivi douleur — 2 étapes :
//   1. question « Comment a réagi ton poignet ? » (4 réponses)
//   2. la prescription du coach (Appliquer / Le faire moi-même / Ignorer)
// Variante « pause » quand l'épisode est en stop_advised (douleur vive).
// Props : episode, proposal (null = étape question), busy,
//         onReaction(r), onApply, onManual, onDismiss, onResume, onEnd
export default function PainCheckCard({ episode, proposal, busy, onReaction, onApply, onManual, onDismiss, onResume, onEnd }) {
  const { t, lang } = useI18n();
  if (!episode) return null;
  // Zone avec possessif, dans la langue active (repli : clé de zone brute)
  const art = (lang === 'en' ? t(`zone_${episode.zone}`) : ZONE_ART[episode.zone]) || episode.zone;
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
              <p className="text-sm font-bold text-white">
                {lang === 'en' ? `How has ${art} felt since last time?` : `Comment a réagi ${art} depuis la dernière fois ?`}
                <Popover>
                  <PopoverTrigger asChild>
                    {/* inline dans le texte → toujours collé à la fin de la question, aligné sur la ligne */}
                    <button className="inline-flex align-[-2px] ml-1.5 text-white/50 hover:text-white/80 transition-colors" aria-label="Explications">
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent avoidCollisions collisionPadding={16} className="w-72 text-xs space-y-2 bg-violet-900/95 backdrop-blur-sm border border-white/20 text-white shadow-xl z-[200]">
                    <p className="font-semibold text-violet-300">Ce que déclenche chaque réponse</p>
                    <p><span className="font-semibold">😌 Mieux</span> — rien ne change. Deux « mieux » d'affilée → je te propose de remonter d'un cran (retour progressif à tes charges d'origine).</p>
                    <p><span className="font-semibold">😐 Pareil</span> — je propose de descendre d'un cran. Dans l'ordre : d'abord la charge (−20 %), ensuite une série en moins, et en dernier les exercices de la zone retirés d'une séance sur deux (le tout sur 7 jours).</p>
                    <p><span className="font-semibold">😣 Pire</span> — je propose de descendre de deux crans d'un coup.</p>
                    <p><span className="font-semibold">⚡ Douleur vive</span> — on arrête : repos de la zone, avis médical conseillé, et je propose de retirer les exercices concernés pendant 7 jours.</p>
                    <p className="pt-1.5 border-t border-white/20 text-white/70">Rien n'est jamais appliqué sans ton accord — tu as toujours Appliquer / Le faire moi-même / Ignorer.</p>
                  </PopoverContent>
                </Popover>
              </p>
              <p className="text-xs text-white/60 mt-0.5 leading-snug">{t('pain_sub')}</p>
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
            <button onClick={() => onReaction('better')} disabled={busy} className={`${btn} bg-green-500/20 text-green-300 border border-green-400/30 hover:bg-green-500/30`}>{t('pain_better')}</button>
            <button onClick={() => onReaction('same')} disabled={busy} className={`${btn} bg-white/10 text-white border border-white/20 hover:bg-white/20`}>{t('pain_same')}</button>
            <button onClick={() => onReaction('worse')} disabled={busy} className={`${btn} bg-orange-500/20 text-orange-300 border border-orange-400/30 hover:bg-orange-500/30`}>{t('pain_worse')}</button>
            <button onClick={() => onReaction('sharp')} disabled={busy} className={`${btn} bg-red-500/20 text-red-300 border border-red-400/30 hover:bg-red-500/30`}>{t('pain_sharp')}</button>
          </>
        ) : infoOnly ? (
          <button onClick={onDismiss} disabled={busy} className={`${btn} bg-white text-violet-700 hover:bg-white/90`}>Compris</button>
        ) : (
          <>
            <button onClick={onApply} disabled={busy} className={`${btn} flex items-center gap-1.5 bg-white text-violet-700 hover:bg-white/90`}>
              {busy && <Loader2 className="w-3.5 h-3.5 animate-spin" />} {isStop ? (lang === 'en' ? 'Remove for 7 days' : 'Retirer 7 jours') : t('apply')}
            </button>
            {!isStop && (
              <button onClick={onManual} disabled={busy} className={`${btn} flex items-center gap-1.5 bg-white/10 text-white border border-white/20 hover:bg-white/20`}>
                <Pencil className="w-3.5 h-3.5" /> {t('do_myself')}
              </button>
            )}
            <button onClick={onDismiss} disabled={busy} className={`${btn} text-white/45 hover:text-white/70 px-2`}>{isStop ? t('got_it') : t('ignore')}</button>
          </>
        )}
      </div>
    </div>
  );
}
