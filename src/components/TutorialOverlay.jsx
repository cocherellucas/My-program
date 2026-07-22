import React, { useRef, useState, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import { useTutorial } from '@/lib/TutorialContext';

export default function TutorialOverlay() {
  const { activeTutorial, targetRect, nextStep, skipStep, skipAll } = useTutorial() || {};
  const bubbleRef = useRef(null);
  const [bubbleH, setBubbleH] = useState(0);
  const [bubbleBelow, setBubbleBelow] = useState(false);
  const [confirmSkipAll, setConfirmSkipAll] = useState(false);

  // Mesure la vraie hauteur de la bulle pour la positionner pile au-dessus
  useLayoutEffect(() => {
    if (!bubbleRef.current) return;
    const measure = () => setBubbleH(bubbleRef.current?.offsetHeight || 0);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(bubbleRef.current);
    return () => ro.disconnect();
  }, [activeTutorial?.currentStep]);

  if (!activeTutorial || activeTutorial.dormant) return null;

  const step = activeTutorial.steps[activeTutorial.currentStep];
  const isLast = activeTutorial.currentStep === activeTutorial.steps.length - 1;
  const padding = 8; // espace autour de l'élément spotlighté
  const hasTarget = !!targetRect;
  const nonInteractive = !!step?.nonInteractive;
  const hideNext = !!step?.hideNext;
  const forceBelow = !!step?.forceBelow;


  return createPortal(
    <AnimatePresence>
      <motion.div
        key="tutorial-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[9998] pointer-events-none">

        {/* Overlay sombre en 4 morceaux autour du spotlight → laisse l'élément cliquable */}
        {hasTarget ? (
          <>
            {/* Top */}
            <div className="absolute left-0 right-0 bg-black/70 pointer-events-auto"
              style={{ top: 0, height: Math.max(0, targetRect.top - padding) }} />
            {/* Bottom */}
            <div className="absolute left-0 right-0 bg-black/70 pointer-events-auto"
              style={{ top: targetRect.bottom + padding, bottom: 0 }} />
            {/* Left */}
            <div className="absolute bg-black/70 pointer-events-auto"
              style={{
                top: Math.max(0, targetRect.top - padding),
                height: targetRect.height + padding * 2,
                left: 0,
                width: Math.max(0, targetRect.left - padding),
              }} />
            {/* Right */}
            <div className="absolute bg-black/70 pointer-events-auto"
              style={{
                top: Math.max(0, targetRect.top - padding),
                height: targetRect.height + padding * 2,
                left: targetRect.right + padding,
                right: 0,
              }} />
          </>
        ) : (
          <div className="absolute inset-0 bg-black/70 pointer-events-none" />
        )}

        {/* Anneau qui pulse autour de l'élément */}
        {hasTarget && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: [1, 1.04, 1] }}
            transition={{ scale: { repeat: Infinity, duration: 1.6 } }}
            className="absolute rounded-xl pointer-events-none"
            style={{
              top: targetRect.top - padding,
              left: targetRect.left - padding,
              width: targetRect.width + padding * 2,
              height: targetRect.height + padding * 2,
              boxShadow: '0 0 0 2px rgba(255,255,255,0.6), 0 0 40px 8px rgba(167,139,250,0.5)',
            }}
          />
        )}

        {/* Bloqueur de clics sur la cible (étape non-interactive) */}
        {hasTarget && nonInteractive && (
          <div
            className="absolute pointer-events-auto"
            style={{
              top: targetRect.top - padding,
              left: targetRect.left - padding,
              width: targetRect.width + padding * 2,
              height: targetRect.height + padding * 2,
            }}
          />
        )}

        {/* Bulle Coach — JUSTE au-dessus de l'élément (mesure réelle), fallback haut écran sinon */}
        <motion.div
          ref={bubbleRef}
          key={`bubble-${activeTutorial.currentStep}`}
          initial={{ opacity: 0, y: 12, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          className="fixed w-[320px] max-w-[calc(100vw-24px)] pointer-events-auto"
          style={(() => {
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const bubbleW = Math.min(320, vw - 24);
            const ROBOT = 32; // le robot dépasse de ~28px au-dessus de la bulle → marge pour ne pas le couper
            if (!hasTarget || !bubbleH) {
              return { top: ROBOT + 8, left: (vw - bubbleW) / 2 };
            }
            const gap = 16;
            const spaceAbove = targetRect.top - padding;
            const spaceBelow = vh - targetRect.bottom - padding;
            const idealLeft = targetRect.left + targetRect.width / 2 - bubbleW / 2;
            const left = Math.max(12, Math.min(vw - bubbleW - 12, idealLeft));
            // Forcé en dessous (ex: textarea avec indications)
            if (forceBelow && spaceBelow >= bubbleH + gap) {
              if (!bubbleBelow) setBubbleBelow(true);
              return { top: targetRect.bottom + padding + gap, left };
            }
            // Assez de place au-dessus (en comptant le dépassement du robot)
            if (!forceBelow && spaceAbove >= bubbleH + gap + ROBOT) {
              if (bubbleBelow) setBubbleBelow(false);
              const top = targetRect.top - padding - gap - bubbleH;
              return { top: Math.max(ROBOT, top), left };
            }
            // Assez de place en dessous
            if (spaceBelow >= bubbleH + gap) {
              if (!bubbleBelow) setBubbleBelow(true);
              return { top: targetRect.bottom + padding + gap, left };
            }
            // Fallback haut d'écran (sous le robot)
            if (bubbleBelow) setBubbleBelow(false);
            return { top: ROBOT + 8, left: (vw - bubbleW) / 2 };
          })()}>

          {/* Coach IA — au-dessus si bulle au-dessus, en-dessous si bulle en-dessous */}
          <div className={`absolute ${bubbleBelow ? '-bottom-4' : '-top-6'} left-3 z-10`}>
            <motion.div
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0, y: [0, -3, 0] }}
              transition={{
                scale: { delay: 0.1, type: 'spring', stiffness: 400, damping: 18 },
                rotate: { delay: 0.1, type: 'spring', stiffness: 400, damping: 18 },
                y: { repeat: Infinity, duration: 2.4, ease: 'easeInOut' },
              }}
              className="leading-none"
              style={{ filter: 'drop-shadow(0 4px 12px rgba(124,58,237,0.6))' }}>
              <img src="/robotapp.png" alt="Coach IA" className="w-11 h-11 rounded-xl object-cover" />
            </motion.div>
          </div>

          <div className="relative rounded-2xl pt-3 pb-3 px-4 shadow-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(160deg, #6d28d9 0%, #4c1d95 100%)',
              border: '1.5px solid rgba(255,255,255,0.3)',
              boxShadow: '0 12px 30px rgba(0,0,0,0.4), 0 0 30px rgba(167,139,250,0.25)',
            }}>

            <div className="relative space-y-2">
              <div className="flex items-baseline gap-x-2 gap-y-0.5 flex-wrap pl-9">
                <p className="text-[9px] uppercase tracking-[0.18em] font-bold text-violet-200/80 flex-shrink-0">Coach IA</p>
                {step.title && (
                  <p className="text-sm font-bold text-white leading-tight">{step.title}</p>
                )}
              </div>

              <p className="text-xs text-white/85 leading-snug">
                {step.description}
              </p>

              {/* Indicateur étapes */}
              {activeTutorial.steps.length > 1 && (
                <div className="flex gap-1 pt-0.5">
                  {activeTutorial.steps.map((_, i) => (
                    <div key={i}
                      className={`h-0.5 rounded-full transition-all duration-300 ${
                        i === activeTutorial.currentStep ? 'w-5 bg-white' : 'w-1 bg-white/30'
                      }`} />
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                {!hideNext && (
                  <button type="button" onClick={step?.dormantNext ? skipStep : nextStep}
                    className="ml-auto text-xs font-bold text-violet-700 bg-white hover:bg-white/95 px-4 py-1.5 rounded-lg shadow transition-all active:scale-[0.97]">
                    {isLast ? "C'est parti !" : "Suivant →"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bouton "Passer tous les tutos" en bas de l'écran */}
        <div className="fixed left-1/2 -translate-x-1/2 pointer-events-auto"
          style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)' }}>
          <button type="button"
            onClick={() => setConfirmSkipAll(true)}
            className="text-[11px] text-white/60 hover:text-white/90 underline underline-offset-4 transition-colors px-3 py-2">
            Passer tous les tutos
          </button>
        </div>

        {/* Modale de confirmation */}
        {confirmSkipAll && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[10000] bg-black/70 flex items-center justify-center p-4 pointer-events-auto">
            <motion.div
              initial={{ scale: 0.92, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-sm rounded-2xl p-5 shadow-2xl"
              style={{
                background: 'linear-gradient(160deg, #6d28d9 0%, #4c1d95 100%)',
                border: '1.5px solid rgba(255,255,255,0.3)',
              }}>
              <p className="text-base font-bold text-white">Passer tous les tutos ?</p>
              <p className="text-xs text-white/80 mt-2 leading-relaxed">
                Tu ne verras plus aucune explication du Coach IA dans l'app. Tu pourras toujours les relancer depuis les réglages.
              </p>
              <div className="flex gap-2 mt-4">
                <button type="button"
                  onClick={() => setConfirmSkipAll(false)}
                  className="flex-1 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-2 rounded-lg transition-colors">
                  Annuler
                </button>
                <button type="button"
                  onClick={() => { setConfirmSkipAll(false); skipAll?.(); }}
                  className="flex-1 text-xs font-bold text-violet-700 bg-white hover:bg-white/95 px-3 py-2 rounded-lg shadow transition-all active:scale-[0.97]">
                  Oui, passer tout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
