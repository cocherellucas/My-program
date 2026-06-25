import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, ClipboardList, FolderUp } from 'lucide-react';

function TargetAnimation() {
  return (
    <div className="w-full max-w-sm mx-auto">
      <svg viewBox="0 0 280 200" className="w-full h-auto" overflow="visible">
        {/* Cible : anneaux concentriques (centrée horizontalement, viewBox 280) */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 18 }}
          style={{ transformOrigin: '140px 100px' }}>
          <circle cx="140" cy="100" r="60" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
          <circle cx="140" cy="100" r="45" fill="none" stroke="rgba(255,255,255,0.30)" strokeWidth="2" />
          <circle cx="140" cy="100" r="30" fill="none" stroke="rgba(255,255,255,0.50)" strokeWidth="2" />
          <circle cx="140" cy="100" r="15" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.8)" strokeWidth="2" />
          {/* Bullseye */}
          <circle cx="140" cy="100" r="5" fill="#fff"
            style={{ filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.7))' }} />
        </motion.g>

        {/* Flèche : lancer rapide et franc — vol horizontal direct vers le centre */}
        <motion.g
          initial={{ x: -260, opacity: 0 }}
          animate={{ x: 0, opacity: [0, 1, 1] }}
          transition={{
            x: { duration: 0.35, delay: 0.8, ease: [0.55, 0, 0.9, 0.5] },
            opacity: { duration: 0.35, delay: 0.8, times: [0, 0.1, 1] },
          }}>
          {/* Empennage (plumes) */}
          <path d="M 90 95 L 105 90 L 105 100 Z" fill="rgba(255,255,255,0.6)" />
          <path d="M 90 105 L 105 100 L 105 110 Z" fill="rgba(255,255,255,0.4)" />
          {/* Tige */}
          <line x1="105" y1="100" x2="138" y2="100" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
          {/* Pointe */}
          <path d="M 138 95 L 148 100 L 138 105 Z" fill="#fff"
            style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.8))' }} />
        </motion.g>

        {/* Onde d'impact */}
        <motion.circle
          cx="140" cy="100" r="5" fill="none" stroke="#fff" strokeWidth="2.5"
          initial={{ scale: 1, opacity: 0 }}
          animate={{ scale: [1, 6], opacity: [0.9, 0] }}
          transition={{ duration: 0.5, delay: 1.15, ease: 'easeOut' }}
        />

        {/* Label au-dessus de la cible */}
        <motion.text
          x="140" y="22"
          textAnchor="middle"
          fill="#fff"
          fontSize="14"
          fontWeight="700"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 22 }}
          transition={{ duration: 0.4, delay: 1.25, ease: 'easeOut' }}>
          Tes objectifs
        </motion.text>
      </svg>
    </div>
  );
}

function ProgressionChart() {
  // 2 courbes : avec Coach IA (lisse, ascendante) vs sans (en dents de scie, plafonne)
  const withCoach = "M 20 220 Q 60 200, 100 175 T 180 130 T 260 80 T 340 40";
  const without   = "M 20 220 Q 50 200, 80 195 Q 110 215, 140 200 Q 170 180, 200 195 Q 230 215, 260 200 Q 290 180, 320 195 Q 340 200, 340 195";

  return (
    <div className="w-full max-w-sm mx-auto">
      <svg viewBox="0 0 360 250" className="w-full h-auto">
        {/* Grille de fond */}
        <g stroke="rgba(255,255,255,0.08)" strokeWidth="1">
          <line x1="20" y1="40"  x2="340" y2="40" />
          <line x1="20" y1="100" x2="340" y2="100" />
          <line x1="20" y1="160" x2="340" y2="160" />
          <line x1="20" y1="220" x2="340" y2="220" />
        </g>

        {/* Axes */}
        <line x1="20" y1="220" x2="340" y2="220" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
        <line x1="20" y1="20"  x2="20"  y2="220" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />

        {/* Labels axes */}
        <text x="180" y="245" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10">Temps</text>
        <text x="10" y="125" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10"
          transform="rotate(-90, 10, 125)">Progression</text>

        {/* Courbe SANS coach — grise, erratique */}
        <motion.path
          d={without}
          fill="none"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="2.5"
          strokeDasharray="4 4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, delay: 0.2, ease: 'easeInOut' }}
        />

        {/* Courbe AVEC coach — violette claire, montante */}
        <motion.path
          d={withCoach}
          fill="none"
          stroke="#fff"
          strokeWidth="3.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, delay: 0.5, ease: 'easeOut' }}
          style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.5))' }}
        />

        {/* Point final courbe coach */}
        <motion.circle
          cx="340" cy="40" r="6" fill="#fff"
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.0, type: 'spring' }}
          style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.8))' }} />

        {/* Légende */}
        <g>
          <rect x="30" y="30" width="14" height="3" rx="1.5" fill="#fff" />
          <text x="50" y="34" fill="#fff" fontSize="11" fontWeight="600">Avec Coach IA</text>
        </g>
        <g>
          <rect x="30" y="50" width="14" height="2.5" rx="1.5" fill="rgba(255,255,255,0.4)" strokeDasharray="3 2" />
          <text x="50" y="54" fill="rgba(255,255,255,0.6)" fontSize="10">Sans accompagnement</text>
        </g>
      </svg>
    </div>
  );
}

const SLIDES = [
  {
    type: 'emoji',
    emoji: '🤖',
    title: 'Bienvenue !',
    text: "Je suis ton Coach IA. Je vais te créer un programme de musculation 100% personnalisé, pour optimiser ta progression.",
  },
  {
    type: 'chart',
    title: 'Progression constante',
    text: "Sans accompagnement, on stagne souvent à cause des erreurs de programmation. Avec moi, chaque séance ajuste la suite pour que tu progresses en continu.",
  },
  {
    type: 'target',
    title: 'Sur mesure',
    text: "Un programme et un suivi complètement personnalisés pour atteindre rapidement tes objectifs, selon ce qui te correspond.",
  },
  {
    type: 'choice',
    title: 'Avant de commencer',
    text: "J'ai besoin de quelques infos sur toi pour construire ton programme et m'adapter au mieux à ta progression. Ça prend 2-3 minutes.",
  },
];

export default function WelcomeIntro({ onFinish, onImport }) {
  const [slide, setSlide] = useState(0);
  const isLast = slide === SLIDES.length - 1;
  const isFirst = slide === 0;

  const next = () => {
    if (isLast) onFinish();
    else setSlide(s => s + 1);
  };
  const prev = () => {
    if (!isFirst) setSlide(s => s - 1);
  };

  const current = SLIDES[slide];

  return (
    <div className="min-h-screen bg-violet-800 flex flex-col">
      {/* Header : indicateur de slides */}
      <div className="flex justify-center pt-8 pb-4 px-4">
        <div className="flex gap-1.5">
          {SLIDES.map((_, i) => (
            <div key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === slide ? 'w-8 bg-white' : 'w-1.5 bg-white/30'
              }`} />
          ))}
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 flex items-center justify-center px-6 pb-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-md flex flex-col items-center text-center">

            {current.type === 'emoji' && (
              <motion.img
                src="/robotapp.png"
                alt="Coach IA"
                initial={{ scale: 0.5, rotate: -10 }}
                animate={{ scale: 1, rotate: 0, y: [0, -8, 0] }}
                transition={{
                  scale: { type: 'spring', stiffness: 300, damping: 15 },
                  y: { repeat: Infinity, duration: 2.6, ease: 'easeInOut' },
                }}
                className="w-32 h-32 rounded-3xl object-cover mb-8"
                style={{ filter: 'drop-shadow(0 8px 20px rgba(167,139,250,0.5))' }}
              />
            )}

            {current.type === 'chart' && (
              <div className="mb-6">
                <ProgressionChart />
              </div>
            )}

            {current.type === 'target' && (
              <div className="mb-6">
                <TargetAnimation />
              </div>
            )}

            <h2 className="text-3xl font-heading font-bold text-white mb-4">{current.title}</h2>
            <p className="text-white/85 text-base leading-relaxed max-w-sm">{current.text}</p>

            {current.type === 'choice' && (
              <div className="w-full mt-8 space-y-3 max-w-sm">
                <button type="button" onClick={onFinish}
                  className="w-full flex items-center gap-3 p-4 rounded-xl bg-white text-violet-700 shadow-lg hover:bg-white/95 active:scale-[0.98] transition-all text-left">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
                    <ClipboardList className="w-5 h-5 text-violet-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm">Compléter mes infos</p>
                    <p className="text-xs text-violet-700/70 mt-0.5">Recommandé · 2-3 minutes</p>
                  </div>
                  <ArrowRight className="w-4 h-4 flex-shrink-0" />
                </button>

                {onImport && (
                  <button type="button" onClick={onImport}
                    className="w-full flex items-center gap-3 p-4 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/15 active:scale-[0.98] transition-all text-left">
                    <div className="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                      <FolderUp className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm">J'ai déjà un programme</p>
                      <p className="text-xs text-white/65 mt-0.5">Je l'importe et complète mon profil plus tard</p>
                    </div>
                    <ArrowRight className="w-4 h-4 flex-shrink-0" />
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer : Précédent (gauche, à partir du slide 2) + Suivant (droite, sauf sur le slide choix) */}
      <div className="flex items-center justify-between px-6 pb-8 pt-4">
        {!isFirst ? (
          <button type="button" onClick={prev}
            className="flex items-center gap-1 px-3 py-2.5 rounded-xl border border-white/30 bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all">
            <ArrowLeft className="w-4 h-4" />
            Précédent
          </button>
        ) : <div />}

        {current.type !== 'choice' && (
          <button type="button" onClick={next}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-violet-700 font-bold text-sm shadow-lg hover:bg-white/95 active:scale-[0.97] transition-all">
            {isLast ? (current.finalCta || "C'est parti !") : 'Suivant'}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
