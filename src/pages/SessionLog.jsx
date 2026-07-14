import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
import { useRestTimer } from '@/lib/RestTimerContext';
import { useTutorial } from '@/lib/TutorialContext';
import { base44 } from '@/api/base44Client';
import { enqueue } from '@/lib/sync-queue';
import { normalizeUser } from '@/lib/utils';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Loader2, LayoutList, ChevronRight, ChevronLeft, ChevronDown, Timer, Eye, HelpCircle, TrendingDown, Bot, MessageSquare, X, Dumbbell, GripVertical, ListOrdered, Pin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, Reorder, useDragControls } from 'framer-motion';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import SetRow from '@/components/session/SetRow';
import ExerciseGif from '@/components/session/ExerciseGif';
import { RestTimerControl } from '@/components/session/RestTimer';
import { computeTargetRIR, ririLabel, computeAdaptedRestTime } from '@/lib/rir-optimizer';
import { findExerciseInChains, isAtChainBottom, ELASTIC_PROGRESSION_CHAINS } from '@/lib/progression-chains';
import { FRAGILE_ZONE_MUSCLES, computeVolumeProposal } from '@/lib/coaching-engine';
import { applyVolumeProposal, markVolumeHandled, isVolumeSuppressed } from '@/lib/volume-adjust';
import VolumeProposalCard from '@/components/coaching/VolumeProposalCard';
import PainCheckCard from '@/components/coaching/PainCheckCard';
import { detectZoneFromText, loadEpisodes, saveEpisodes, upsertEpisode, episodesToCheck, sessionTouchesZone, computePainPrescription, buildPainAdvice, isSeverePain } from '@/lib/pain-engine';
import { computeCycle } from '@/lib/cycle-engine';
import { useI18n } from '@/lib/i18n';
import { applyPainLevel } from '@/lib/pain-adjust';
import { EXERCISES } from '@/lib/exercise-database';

const isBodyweightExercise = (name) => {
  const ex = EXERCISES.find(e => e.name?.toLowerCase() === name?.toLowerCase());
  return ex ? ex.equipmentOptions?.every(opt => opt.length === 0) : false;
};

// Bornes "atteint" d'un objectif de reps :
//  • plage "8-12"     → { low: 8,  high: 12 } (en dessous = non atteint, au-dessus = dépassé)
//  • chiffre précis "10" → tolérance ±2 → { low: 8, high: 12 }
const parseRepRange = (targetReps) => {
  const nums = String(targetReps || '').split(/[-–]/).map(p => parseInt(p, 10)).filter(n => !isNaN(n));
  if (nums.length >= 2) return { low: Math.min(nums[0], nums[1]), high: Math.max(nums[0], nums[1]) };
  if (nums.length === 1) return { low: Math.max(1, nums[0] - 2), high: nums[0] + 2 };
  return { low: 0, high: 0 };
};

// Noms d'affichage des zones fragiles
const ZONE_LABELS = {
  wrists: 'Poignets', shoulders: 'Épaules', elbows: 'Coudes',
  knees: 'Genoux', lower_back: 'Bas du dos', neck: 'Cervicales',
};
// Normalise les noms de groupes musculaires vers les clés FRAGILE_ZONE_MUSCLES
const MUSCLE_NORMALIZE = { 'Pectoraux': 'Poitrine', 'Abdominaux': 'Abdos' };

const fatigueLabels = ['', 'Frais', 'Normal', 'Fatigué', 'Épuisé', 'Détruit'];
const fatigueColors = ['', 'text-accent', 'text-primary', 'text-chart-4', 'text-destructive', 'text-destructive'];

function formatSeconds(s) {
  if (!s) return '—';
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return sec > 0 ? `${m}min${sec}` : `${m}min`;
}

// ─── Helper niveau module — accessible depuis tous les composants ────────────
function getExerciseFragileZones(exercise, fragileZones = []) {
  const FRAGILE_ZONE_MUSCLES_LOCAL = {
    wrists: ['Biceps','Triceps','Poitrine','Épaules'],
    shoulders: ['Épaules','Poitrine','Triceps'],
    elbows: ['Biceps','Triceps'],
    knees: ['Quadriceps','Ischio-jambiers','Mollets'],
    lower_back: ['Dos','Ischio-jambiers','Fessiers'],
    neck: ['Épaules','Dos'],
  };
  const raw = exercise?.muscle_group || '';
  const muscle = raw;
  return fragileZones.filter(z => {
    const key = typeof z === 'string' ? z : z.key;
    return (FRAGILE_ZONE_MUSCLES_LOCAL[key] || []).includes(muscle);
  });
}

// ─── Warmup Accordion ─────────────────────────────────────────────────────────
const COMPOUND = /squat|soulevé|deadlift|développé|bench|overhead|press|rowing|tirage|tractions|dips/i;
const LOWER = /squat|soulevé|deadlift|jambe|quadricep|ischio|fessier|mollet/i;
const UPPER_PUSH = /développé|bench|overhead|press|dips|écarté/i;
const UPPER_PULL = /rowing|tirage|tractions|curl|bicep/i;

function getWarmupAdvice(exercise) {
  const name = (exercise.name || '').toLowerCase();
  const muscle = (exercise.muscle_group || '').toLowerCase();
  const isCompound = COMPOUND.test(name);
  const isLower = LOWER.test(name) || LOWER.test(muscle);
  const isUpperPush = UPPER_PUSH.test(name) || /pectoraux|épaules|triceps/.test(muscle);
  const isUpperPull = UPPER_PULL.test(name) || /dos|biceps/.test(muscle);

  const sets = [];

  if (isCompound) {
    sets.push({ label: 'Série 1', desc: '50% du poids de travail × 10 reps — activer le mouvement' });
    sets.push({ label: 'Série 2', desc: '65% × 6 reps — sentir la charge' });
    sets.push({ label: 'Série 3', desc: '80% × 3 reps — préparer le système nerveux' });
  } else {
    sets.push({ label: 'Série 1', desc: '60% du poids de travail × 10 reps — activation légère' });
    sets.push({ label: 'Série 2', desc: '80% × 5 reps — mise en tension' });
  }

  const mobility = [];
  if (isLower) mobility.push('mobilité des hanches et chevilles', 'activation des fessiers (pont fessier ou abduction)');
  if (isUpperPush) mobility.push('rotation des épaules × 20', 'coiffe des rotateurs — 2 séries × 15-20 reps');
  if (isUpperPull) mobility.push('rotations des épaules × 10 dans chaque sens', 'échauffement léger des biceps (curl à vide ou élastique)');
  if (!isLower && !isUpperPush && !isUpperPull) mobility.push('cardio léger 2-3 min (vélo, marche rapide)', 'montée en charge progressive si exercice chargé');

  return { sets, mobility, isCompound };
}

function WarmupAccordion({ exercise, logs, exIdx, sets: totalSets }) {
  const [open, setOpen] = useState(false);
  const advice = getWarmupAdvice(exercise);
  const workingWeight = logs[`${exIdx}-0`]?.weight;

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/15 overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white/80">Échauffement</span>
          <span className="text-xs text-white/40">{open ? '' : '— appuie pour voir'}</span>
        </div>
        <span className="text-white/40 text-xs">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-4">
          {advice.mobility.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-white/60 uppercase tracking-wide mb-1.5">Mobilité avant</p>
              <ul className="space-y-1">
                {advice.mobility.map((m, i) => (
                  <li key={i} className="text-xs text-white/70 flex items-start gap-1.5">
                    <span className="text-white/40 mt-0.5">·</span>{m}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <p className="text-xs font-semibold text-white/60 uppercase tracking-wide mb-1.5">Séries d'activation</p>
            <div className="space-y-2">
              {advice.sets.map((s, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-xs font-bold text-white/50 w-14 shrink-0">{s.label}</span>
                  <span className="text-xs text-white/70">
                    {workingWeight ? s.desc.replace(/(\d+)%/, (_, pct) => `${Math.round(workingWeight * pct / 100)} kg`) : s.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-white/40 italic">Ces séries ne comptent pas dans ton volume — elles préparent tes articulations et ton système nerveux.</p>
        </div>
      )}
    </Card>
  );
}

// ─── Single Exercise Focus View ───────────────────────────────────────────────
function ExerciseFocusCard({ exercise, originalExercise, exIdx, logs, updateLog, openAtLastSet, isImported, propagateWeight, forcePropagateWeight, totalExercises, onNext, onPrev, onStartRest, isLast, rirContext, onRegressionRequest, onProgressionRequest, suggestion, onClearSuggestion, onApplyVariant, onExtendRest, currentRestSeconds, nextExRestSeconds, onRestTimeSave, editingObjectif, setEditingObjectif, onUpdateExercise, previousLogs, fragileZones, onApplyToFuture, onAskCoach, sessionsHistory }) {
  const { t } = useI18n();
  const sets = Math.max(1, exercise.sets || 3);
  // L'exercice fait-il partie de la base (chaînes de progression) ? Sinon on ne
  // propose aucune variante (pas de variante générique inventée).
  const inChain = findExerciseInChains(exercise.name) !== null;
  const [editSets, setEditSets] = useState(Math.max(1, originalExercise?.sets || 3));
  const [editReps, setEditReps] = useState(originalExercise?.target_reps || '');
  const [editRest, setEditRest] = useState(currentRestSeconds ?? originalExercise?.rest_seconds ?? 90);

  useEffect(() => {
    setEditRest(currentRestSeconds ?? originalExercise?.rest_seconds ?? 90);
  }, [currentRestSeconds]);

  // Un set est "fait" seulement s'il a été validé (flag done), pas s'il est juste
  // prérempli avec les reps de la séance précédente — sinon on saute direct au dernier set.
  const [completedSets, setCompletedSets] = useState(() => {
    const done = new Set();
    for (let i = 0; i < sets; i++) {
      if (logs[`${exIdx}-${i}`]?.done) done.add(i);
    }
    return done;
  });
  const [activeSetIdx, setActiveSetIdx] = useState(() => {
    // Retour à l'exercice précédent → on ouvre directement sur la dernière série
    if (openAtLastSet) return Math.max(0, sets - 1);
    for (let i = 0; i < sets; i++) {
      if (!logs[`${exIdx}-${i}`]?.done) return i;
    }
    return Math.max(0, sets - 1);
  });
  const [ackedGoodSeries, setAckedGoodSeries] = useState(0);

  const markSetComplete = (idx) => setCompletedSets(prev => new Set([...prev, idx]));
  const isSetDone = (idx) => completedSets.has(idx);
  const allSetsDone = Array.from({ length: sets }, (_, i) => i).every(isSetDone);

  // Calcul objectifs dépassés (hors motion.div pour fixed positioning)
  const goodAboveSeries = (() => {
    const { high: targetHigh } = parseRepRange(exercise.target_reps);
    let count = 0;
    for (let s = 0; s < sets; s++) {
      const l = logs[`${exIdx}-${s}`] || {};
      const reps = parseInt(l.reps) || 0;
      const quality = l.quality || 'good';
      if (reps > targetHigh && quality === 'good') count++;
    }
    return count;
  })();
  const showObjectifBanner = goodAboveSeries >= 2 && goodAboveSeries > ackedGoodSeries + 1;

  // ─── Conseils du coach (objectifs non atteints / dépassés) → bulle latérale ───
  const [coachTipsOff, setCoachTipsOff] = useState(() => {
    try { return localStorage.getItem('coach_tips_disabled') === '1'; } catch { return false; }
  });
  const [tipOpen, setTipOpen] = useState(false);
  const [confirmDisableTips, setConfirmDisableTips] = useState(false);
  const [ackedBadSeries, setAckedBadSeries] = useState(0);

  // Séries en-dessous de la cible (reps trop basses ou exécution dégradée).
  // Les valeurs PRÉ-REMPLIES d'une séance passée (prefill) sont ignorées :
  // seul ce que l'utilisateur a saisi AUJOURD'HUI peut déclencher un conseil
  // (sinon la bulle s'ouvrait dès l'arrivée sur l'exercice, ou après un "Passer").
  const { badSeries, filledSeries } = (() => {
    const { low: targetLow } = parseRepRange(exercise.target_reps);
    let bad = 0, filled = 0;
    for (let s = 0; s < sets; s++) {
      const l = logs[`${exIdx}-${s}`] || {};
      const reps = parseInt(l.reps) || 0;
      const qualityTyped = !l.prefill?.quality; // sélectionnée aujourd'hui, pas héritée
      const quality = l.quality || 'good';
      if (reps > 0) filled++;
      if (reps > 0 && reps < targetLow) bad++;
      if (qualityTyped && (quality === 'degraded' || quality === 'bad')) bad++;
    }
    return { badSeries: bad, filledSeries: filled };
  })();

  const underActive = filledSeries >= 1 && badSeries >= 2 && badSeries > ackedBadSeries;

  // Douleur saisie sur une série de CET exercice → conseil "amplitude" immédiat
  const [ackedPainSeries, setAckedPainSeries] = useState(0);
  const { painSeries, severePain } = (() => {
    let n = 0, severe = false;
    for (let s = 0; s < sets; s++) {
      const note = logs[`${exIdx}-${s}`]?.pain_note;
      if (note) { n++; if (isSeverePain(note)) severe = true; }
    }
    return { painSeries: n, severePain: severe };
  })();
  const painActive = painSeries > ackedPainSeries;
  // "Recommencer" efface la douleur décrite → painSeries redescend. On resynchronise
  // le compteur d'acquittement, sinon une NOUVELLE description ne rouvrirait pas la bulle.
  useEffect(() => {
    if (ackedPainSeries > painSeries) setAckedPainSeries(painSeries);
  }, [painSeries, ackedPainSeries]);

  // ARRIVÉE sur un exercice (changement d'exo, réouverture de séance) → aucun
  // conseil hérité : on ferme la bulle et on acquitte tout ce qui existe déjà
  // (douleurs/séries du brouillon). Seule une NOUVELLE action après l'arrivée
  // peut rouvrir un conseil. Vaut pour TOUS les conseils (douleur, objectifs).
  const tipArrivalRef = useRef(null);
  useEffect(() => {
    const key = `${exIdx}|${exercise.name}`;
    if (tipArrivalRef.current === key) return;
    tipArrivalRef.current = key;
    setTipOpen(false);
    setConfirmDisableTips(false);
    setAckedPainSeries(painSeries);
    setAckedBadSeries(badSeries);
    setAckedGoodSeries(goodAboveSeries);
  }, [exIdx, exercise.name]); // eslint-disable-line — on capture l'état constaté à l'arrivée

  // Priorité : 'pain' (sécurité) > 'under' (objectifs non atteints) > 'over'
  const coachTip = coachTipsOff ? null : (painActive ? 'pain' : (underActive ? 'under' : (showObjectifBanner ? 'over' : null)));

  const dismissTip = () => {
    if (coachTip === 'pain') setAckedPainSeries(painSeries);
    else if (coachTip === 'under') setAckedBadSeries(badSeries);
    else if (coachTip === 'over') setAckedGoodSeries(goodAboveSeries);
    setTipOpen(false);
  };
  const disableCoachTips = () => {
    try { localStorage.setItem('coach_tips_disabled', '1'); } catch {}
    setCoachTipsOff(true);
    setTipOpen(false);
    setConfirmDisableTips(false);
  };

  // Tuto la 1ʳᵉ fois qu'un conseil du coach apparaît (le système ne le montre
  // qu'une seule fois : startTutorial est ignoré si l'id est déjà complété).
  const { startTutorial } = useTutorial() || {};
  useEffect(() => {
    if (!coachTip || coachTipsOff || !startTutorial) return;
    const t = setTimeout(() => {
      startTutorial('coach-tip-intro', [{
        target: 'coach-tip',
        title: 'Un conseil du coach',
        description: "Quand tes séries s'écartent de tes objectifs, le coach t'envoie un conseil ici. Touche la bulle pour l'ouvrir : tu peux appliquer le conseil, le fermer, ou désactiver les conseils.",
        nonInteractive: true,
      }]);
    }, 400);
    return () => clearTimeout(t);
  }, [coachTip, coachTipsOff, startTutorial]);

  const handleSetDone = (setIdx) => {
    const key = `${exIdx}-${setIdx}`;
    const lastLog    = logs[key];
    const mode       = lastLog?.mode || 'RIR_2';
    const isLastSet  = setIdx === sets - 1;
    const baseRest   = isLastSet && nextExRestSeconds ? nextExRestSeconds : (currentRestSeconds ?? exercise.rest_seconds ?? 90);
    const isBodyweight = !lastLog?.weight || lastLog?.weight === 0;
    const isIsometric  = /planche|gainage|isométr/i.test(exercise.name || '');

    markSetComplete(setIdx);
    updateLog(exIdx, setIdx, 'done', true); // persiste la validation (survit au changement d'exo)
    // À la fin (ou coupure) du repos, on avance à la série suivante — MAIS seulement
    // si l'utilisateur n'a PAS navigué entre-temps (Passer/Précédent). On compare la
    // valeur COURANTE de la série active (updater fonctionnel) à celle d'où le repos
    // a été lancé : s'il a bougé, on respecte sa position ; sinon on avance.
    onStartRest(baseRest, () => {
      setActiveSetIdx((cur) => (cur === setIdx && setIdx < sets - 1) ? setIdx + 1 : cur);
    });
  };

  return (
    <>
    <motion.div
      key={exIdx}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.25 }}
      className="space-y-4">
      
      {/* Header progress */}
      <div className="flex items-center justify-between text-sm text-white/70">
        <span className="font-medium">{t('se_exercise')} {exIdx + 1} / {totalExercises}</span>
        <div className="flex gap-1">
          {Array.from({ length: totalExercises }).map((_, i) =>
          <div key={i} className={`h-1.5 rounded-full transition-all ${i === exIdx ? 'w-6 bg-white' : i < exIdx ? 'w-3 bg-white/40' : 'w-3 bg-white/20'}`} />
          )}
        </div>
      </div>

      {/* GIF + Name */}
      <Card className="overflow-hidden bg-white/15 backdrop-blur-sm border-white/20">
        <ExerciseGif exerciseName={exercise.name} className="h-52 w-full" />
        <div className="p-4">
          <h2 className="font-heading font-bold text-xl text-white">{exercise.name}</h2>
          {exercise.muscle_group && <Badge variant="outline" className="text-xs mt-2 border-white/30 text-white">{exercise.muscle_group}</Badge>}
          <div className="mt-3 space-y-2" data-objectif>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">{t('se_objective')}</span>
              <div className="flex items-center gap-1">
                {!isImported && (() => {
                  const originalSets = Math.max(1, originalExercise?.sets || 3);
                  const originalReps = originalExercise?.target_reps || '';
                  const originalRest = originalExercise?.rest_seconds || 90;
                  const hasChanges = editSets !== originalSets || editReps !== originalReps || editRest !== originalRest;
                  return (
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={!hasChanges}
                      className={`h-6 px-2 text-xs transition-colors ${hasChanges ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-white/30 cursor-not-allowed'}`}
                      onClick={() => {
                        setEditSets(originalSets);
                        setEditReps(originalReps);
                        setEditRest(originalRest);
                        onUpdateExercise?.(exIdx, { sets: originalSets, target_reps: originalReps, rest_seconds: originalRest });
                      }}>
                      ↻ Réinitialiser
                    </Button>
                  );
                })()}
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 px-2 text-xs text-white/70 hover:text-white hover:bg-white/10"
                  onClick={() => {
                    if (editingObjectif) {
                      onUpdateExercise?.(exIdx, { sets: editSets, target_reps: editReps, rest_seconds: editRest });
                    }
                    setEditingObjectif(!editingObjectif);
                  }}>
                  {editingObjectif ? t('se_validate') : t('se_modify')}
                </Button>
              </div>
              {!isImported && (
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="text-white hover:text-white/80 transition-colors cursor-pointer">
                      <HelpCircle className="w-3 h-3" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 text-xs space-y-2 ">
                    <p className="font-semibold text-white">Valeurs optimisées</p>
                    <p>Ces séries, reps et repos sont optimisés pour tes objectifs. Tu peux les modifier si tu le souhaites.</p>
                    <p className="text-violet-300 font-medium">En validant, les changements s'appliquent aussi aux futures séances.</p>
                  </PopoverContent>
                </Popover>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2 p-3 bg-gradient-to-r from-white/20 to-white/10 rounded-lg border border-white/40 overflow-hidden">
              <div className="text-center py-3 bg-white/10 rounded-md border border-white/30 min-w-0">
                <span className="text-white/80 text-[11px] block font-bold uppercase tracking-wide">{t('se_sets')}</span>
                {editingObjectif ? (
                  <input
                    type="text"
                    inputMode="numeric"
                    min="1"
                    max="20"
                    value={editSets}
                    onChange={(e) => setEditSets(e.target.value)}
                    onBlur={(e) => setEditSets(Math.min(20, Math.max(1, parseInt(e.target.value) || 1)))}
                    onKeyDown={(e) => ['-', '+', 'e', 'E'].includes(e.key) && e.preventDefault()}
                    className="w-full text-center bg-white/10 border border-white/20 text-white font-black text-xl rounded mt-1 px-1 py-1"
                  />
                ) : (
                  <span className="text-white font-black text-xl block mt-1">{sets}</span>
                )}
              </div>
              <div className="text-center py-3 bg-white/10 rounded-md border border-white/30 min-w-0">
                <span className="text-white/80 text-[11px] block font-bold uppercase tracking-wide">{t('se_reps')}</span>
                {editingObjectif ? (
                  <input
                    type="text"
                    value={editReps}
                    onChange={(e) => setEditReps(e.target.value)}
                    onBlur={(e) => {
                      const v = parseInt(e.target.value);
                      if (!isNaN(v) && !e.target.value.includes('-')) setEditReps(String(Math.min(1000, Math.max(1, v))));
                    }}
                    className="w-full text-center bg-white/10 border border-white/20 text-white font-black text-xl rounded mt-1 px-1 py-1"
                  />
                ) : (
                  <span className="text-white font-black text-xl block mt-1">{exercise.target_reps}</span>
                )}
              </div>
              <div className="text-center py-3 bg-white/10 rounded-md border border-white/30 min-w-0">
                <span className="text-white/80 text-[11px] block font-bold uppercase tracking-wide">{t('se_rest')}</span>
                {editingObjectif ? (
                  <input
                    type="text"
                    inputMode="numeric"
                    min="1"
                    value={editRest}
                    onChange={(e) => setEditRest(e.target.value)}
                    onBlur={(e) => { const val = parseInt(e.target.value); setEditRest(isNaN(val) || val < 1 ? 30 : val); }}
                    onKeyDown={(e) => ['-', '+', 'e', 'E'].includes(e.key) && e.preventDefault()}
                    className="w-full text-center bg-white/10 border border-white/20 text-white font-black text-xl rounded mt-1 px-1 py-1"
                  />
                ) : (
                  <span className="text-white font-black text-xl block mt-1 truncate px-1">{formatSeconds(currentRestSeconds ?? exercise.rest_seconds)}</span>
                )}
              </div>
            </div>
          </div>
          {(exercise.notes || (logs[`${exIdx}-0`]?.quality || 'good') !== 'bad') && (
            <p className="text-xs text-white/60 mt-2 italic w-full break-words">
              {exercise.notes && <>{exercise.notes} · </>}
              {rirContext ? (() => {
                const targets = Array.from({ length: sets }).map((_, i) =>
                  computeTargetRIR({ phase: rirContext.phase || 'MAV', sessionType: rirContext.sessionType || 'hypertrophy', block: exercise.block, setIndex: i, totalSets: sets, weekNumber: rirContext.weekNumber || 1, plannedWeeks: rirContext.plannedWeeks || 8 })
                );
                const earlyTargets = targets.slice(0, -1);
                const minRir = Math.min(...earlyTargets);
                const maxRir = Math.max(...earlyTargets);
                const rangeStr = minRir === maxRir ? `RIR ${minRir}` : `RIR ${maxRir}-${minRir}`;
                return <>{sets > 1 && <>{`${t('se_first_sets')} : ${rangeStr}`}<br /></>}{t('se_last_set_failure')}</>;
              })() : (logs[`${exIdx}-0`]?.quality || 'good') !== 'bad' && <>{t('se_last_set_failure')}</>}
            </p>
          )}
        </div>
      </Card>

      {/* Échauffement — premier exercice uniquement */}
      {exIdx === 0 && <WarmupAccordion exercise={exercise} logs={logs} exIdx={exIdx} sets={sets} />}

      {/* Suggestion de variante */}
      {suggestion && (
        <div className="p-3 rounded-xl bg-white/10 border border-white/20 space-y-2">
          <div className="flex items-start justify-between gap-2">
            {suggestion.options ? (
              <p className="text-sm font-semibold text-white">Choisis une variante :</p>
            ) : suggestion.name ? (
              <p className="text-sm font-semibold text-white">Essaie : <span className="text-violet-200">{suggestion.name}</span></p>
            ) : null}
            <button onClick={onClearSuggestion} className="text-white/30 hover:text-white/60 transition-colors flex-shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
          {suggestion.notes && <p className="text-xs text-white/60">{suggestion.notes}</p>}
          {suggestion.options && (
            <div className="flex flex-col gap-1.5">
              {suggestion.options.map(opt => (
                <button
                  key={opt}
                  onClick={() => onApplyVariant(exIdx, opt)}
                  className="text-sm px-3 py-2 rounded-xl bg-white/15 text-white text-left hover:bg-white/25 transition-colors font-medium">
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sets — all visible */}
      <Card className="p-4 space-y-3 bg-white/15 backdrop-blur-sm border-white/20">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm text-white">Tes séries</h3>
          <Popover>
            <PopoverTrigger asChild>
              <button className="text-white/40 hover:text-white/70 transition-colors">
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </PopoverTrigger>
            <PopoverContent avoidCollisions collisionPadding={16} className="w-64 text-xs space-y-2 bg-violet-900/95 backdrop-blur-sm border border-white/20 text-white shadow-xl z-[200]">
              <p className="font-semibold text-violet-300">Tes données sont enregistrées</p>
              <p className="text-white/70">Chaque kg, rep, RIR et exécution saisis ici sont mémorisés. À la prochaine séance, tu verras tes performances passées sous chaque champ — essaie de faire mieux pour progresser.</p>
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          {Array.from({ length: sets }).map((_, setIdx) => {
            const isActive = setIdx === activeSetIdx;
            const isDone = isSetDone(setIdx);
            return (
          <div key={setIdx}
            className={`space-y-1 rounded-xl transition-all border-2 ${
              isActive
                ? 'border-white bg-white/15 shadow-lg shadow-white/10'
                : isDone
                ? 'border-transparent opacity-50'
                : 'border-transparent opacity-80'
            }`}>
              {isActive && (
                <div className="flex items-center justify-between px-3 pt-2">
                  {setIdx > 0 ? (
                    <button
                      onClick={() => setActiveSetIdx(setIdx - 1)}
                      className="text-xs text-white/40 hover:text-white/70 transition-colors">
                      ← {t('se_prev')}
                    </button>
                  ) : <span />}
                  {setIdx < sets - 1 && (
                    <button
                      onClick={() => {
                        updateLog(exIdx, setIdx, 'skipped', true);
                        markSetComplete(setIdx);
                        setActiveSetIdx(setIdx + 1);
                      }}
                      className="text-xs text-white/40 hover:text-white/70 transition-colors">
                      {t('se_skip')} →
                    </button>
                  )}
                </div>
              )}
              <SetRow
              setIdx={setIdx}
              totalSets={sets}
              log={logs[`${exIdx}-${setIdx}`] || {}}
              onUpdate={(field, value) => updateLog(exIdx, setIdx, field, value)}
              onWeightBlur={(value) => propagateWeight(exIdx, setIdx, value, sets)}
              onWeightPropagate={(value) => {
                forcePropagateWeight(exIdx, setIdx, value, sets);
                handleApplyToFuture(exercise.name, { target_weight: Number(value) });
              }}
              nextWeights={Array.from({ length: sets - setIdx - 1 }, (_, i) => logs[`${exIdx}-${setIdx + 1 + i}`]?.weight)}
              rirContext={rirContext ? { ...rirContext, block: exercise.block } : null}
              exerciseFragileZones={getExerciseFragileZones(exercise, fragileZones)}
              previousWeight={(previousLogs?.[exercise.name]?.[setIdx + 1]?.weight) || exercise.target_weight}
              previousReps={previousLogs?.[exercise.name]?.[setIdx + 1]?.reps}
              previousMode={previousLogs?.[exercise.name]?.[setIdx + 1]?.mode}
              previousQuality={previousLogs?.[exercise.name]?.[setIdx + 1]?.quality}
              locked={setIdx > activeSetIdx}
              onAskCoach={onAskCoach ? (painNote, sIdx, thread) => onAskCoach({ exercise: { ...exercise, _sessionIdx: exIdx }, setIdx: sIdx, painNote, thread, logs: Object.fromEntries(Object.entries(logs).filter(([k]) => k.startsWith(`${exIdx}-`))), allLogs: logs, prevLogs: previousLogs, sessionsHistory }) : undefined} />
            
              <div className="space-y-2">
                {/* Toute dernière série de la séance → aucun bouton (pas de repos,
                    et « valider » ne changeait rien : on termine via le bouton Terminer). */}
                {!(isLast && setIdx === sets - 1) && (
                <button
                onClick={() => handleSetDone(setIdx)}
                disabled={!isActive}
                className="w-full text-xs flex items-center justify-center gap-1 py-1 rounded-lg transition-colors disabled:opacity-0 disabled:pointer-events-none text-white/50 hover:text-white hover:bg-white/10">

                  <Timer className="w-3 h-3" /> {t('se_start_rest')}
                </button>
                )}
                {setIdx === 0 &&
              <RestTimerControl
                seconds={currentRestSeconds ?? exercise.rest_seconds ?? 90}
                onSave={(newSecs) => onRestTimeSave(exIdx, newSecs)} />

              }
              </div>
            </div>
            );
          })}
        </div>

        {/* (Ligne "Retour : J'aime / Pas fan / Remplacer" retirée : le feedback
            n'était consommé par aucune logique — les préférences d'exercices se
            gèrent dans Profil → Préférences.) */}
      </Card>

      {/* Nav buttons */}
      <div className="flex items-center justify-between gap-3">
        {exIdx > 0 &&
        <Button variant="outline" onClick={onPrev} className="flex-1 border-white/30 text-white hover:bg-white/10 hover:text-white">
            <ChevronLeft className="w-4 h-4 mr-1" /> {t('se_prev')}
          </Button>
        }
        <Button onClick={onNext} className="flex-1">
          {isLast
            ? (allSetsDone || activeSetIdx === sets - 1)
              ? <><CheckCircle className="w-4 h-4 mr-1" /> {t('se_finish')}</>
              : t('se_finish_anyway')
            : allSetsDone
              ? <>{t('se_next')} <ChevronRight className="w-4 h-4 ml-1" /></>
              : t('se_skip')
          }
        </Button>
      </div>
    </motion.div>

    {/* Conseil du coach — bulle flottante (douleur / objectifs non atteints / dépassés) */}
    {coachTip && (() => {
      const isUnder = coachTip === 'under';
      const isPain = coachTip === 'pain';
      const currentRest = currentRestSeconds ?? exercise.rest_seconds ?? 90;
      const atBottom = !inChain || isAtChainBottom(exercise.name);
      return (
        <div className="fixed left-3 top-1/2 -translate-y-1/2 z-40 flex flex-col-reverse items-start gap-2 max-w-[calc(100vw-1.5rem)]">
          {tipOpen && (
            <div className="w-72 max-w-[calc(100vw-2rem)] rounded-2xl p-4 shadow-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e0050 0%, #3b0764 50%, #1e0050 100%)', border: '1px solid rgba(139,92,246,0.5)', boxShadow: '0 0 30px rgba(139,92,246,0.3), 0 8px 32px rgba(0,0,0,0.4)' }}>
              <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white">{isPain ? (severePain ? t('se_tip_pain_severe') : t('se_tip_pain')) : isUnder ? t('se_tip_under') : t('se_tip_over')}</p>
                  <p className="text-xs text-violet-200/80 mt-0.5">
                    {isPain
                      ? (severePain
                        ? 'Ne force pas dessus : passe à l\'exercice suivant et laisse la zone tranquille aujourd\'hui. Si c\'est encore douloureux demain, avis médical.'
                        : 'Le mieux : adapte selon ton ressenti. Sinon, voici une proposition automatique, pas forcément optimale pour ton cas.')
                      : isUnder
                        ? (atBottom ? 'Augmente le repos pour mieux récupérer et atteindre tes cibles.' : 'Ajuste le repos ou passe à une variante plus simple.')
                        : 'Réduis le repos ou augmente le poids.'}
                  </p>
                </div>
                <button onClick={() => { setTipOpen(false); setConfirmDisableTips(false); }} className="text-white/30 hover:text-white/60 transition-colors flex-shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {isPain ? (
                  severePain ? (
                    <>
                      <button onClick={() => { dismissTip(); onNext(); }}
                        className="text-xs px-3 py-1.5 rounded-lg bg-destructive text-white font-medium hover:bg-destructive/80 transition-colors">
                        {t('se_pass_exercise')}
                      </button>
                    </>
                  ) : (
                  <>
                    {!isBodyweightExercise(exercise.name) && (
                      <button onClick={() => {
                          // Charge −20 % sur les séries restantes…
                          for (let s = activeSetIdx; s < sets; s++) {
                            const key = `${exIdx}-${s}`;
                            const current = parseFloat(logs[key]?.weight) || 0;
                            if (current > 0) {
                              const step = current < 10 ? 0.5 : 2.5;
                              let r = Math.round((current * 0.8) / step) * step;
                              if (r >= current) r = Math.max(0, current - step);
                              updateLog(exIdx, s, 'weight', r);
                            }
                          }
                          // …compensée par +5 reps sur l'objectif de la séance
                          // (−20 % de charge ≈ +4 à 6 reps sur le continuum : même
                          // stimulus, moins de tension sur la zone)
                          const tr = String(exercise.target_reps || '').trim();
                          const range = tr.match(/^(\d+)\s*[-–]\s*(\d+)$/);
                          const bumped = range
                            ? `${parseInt(range[1], 10) + 5}-${parseInt(range[2], 10) + 5}`
                            : (isNaN(parseInt(tr, 10)) ? tr : String(parseInt(tr, 10) + 5));
                          if (bumped && bumped !== tr) {
                            onUpdateExercise?.(exIdx, { sets: exercise.sets, target_reps: bumped, rest_seconds: currentRest }, { skipFuture: true });
                          }
                          dismissTip();
                        }}
                        className="text-xs px-3 py-1.5 rounded-lg bg-accent text-white font-medium hover:bg-accent/80 transition-colors">
                        −20 % de charge · +5 reps visées
                      </button>
                    )}
                    {inChain && (
                      <button onClick={() => { onRegressionRequest(exIdx); setTipOpen(false); }}
                        className="text-xs px-3 py-1.5 rounded-lg bg-white/20 text-white font-medium hover:bg-white/30 transition-colors">
                        {t('se_variant_simple')}
                      </button>
                    )}
                    <button onClick={() => {
                        // Ouvre l'éditeur OBJECTIF de l'exercice et scrolle dessus
                        setEditingObjectif?.(true);
                        dismissTip();
                        setTimeout(() => document.querySelector('[data-objectif]')?.scrollIntoView({ block: 'center', behavior: 'smooth' }), 80);
                      }}
                      className="text-xs px-3 py-1.5 rounded-lg bg-white/10 text-white/80 font-medium hover:bg-white/20 transition-colors">
                      {t('se_modify_myself')}
                    </button>
                    {/* Même interrupteur que les conseils objectifs (coach_tips_disabled) :
                        si cette bulle s'affiche, ils sont actifs → avertir. */}
                    <p className="basis-full text-[11px] text-violet-200/70 leading-snug mt-1">
                      ⚠️ Si tu adaptes toi-même, pense à modifier l'<span className="font-semibold">objectif</span> avec une grande plage de reps (ex. 6-15, avec le tiret « - ») — sinon les conseils « objectifs atteints / non atteints » se déclencheront d'après tes nouvelles valeurs.
                    </p>
                  </>
                  )
                ) : isUnder ? (
                  <>
                    <button onClick={() => { onExtendRest(exIdx, Math.min(currentRest + 30, 300)); dismissTip(); }}
                      className="text-xs px-3 py-1.5 rounded-lg bg-chart-4 text-white font-medium hover:bg-chart-4/80 transition-colors flex items-center gap-1">
                      <Timer className="w-3 h-3" /> +30s repos
                    </button>
                    {!isBodyweightExercise(exercise.name) && (
                      <button onClick={() => {
                          for (let s = activeSetIdx + 1; s < sets; s++) {
                            const key = `${exIdx}-${s}`;
                            const current = logs[key]?.weight || 0;
                            if (current > 0) updateLog(exIdx, s, 'weight', Math.max(0, current - 2.5));
                          }
                          dismissTip();
                        }}
                        className="text-xs px-3 py-1.5 rounded-lg bg-accent text-white font-medium hover:bg-accent/80 transition-colors">
                        −2.5 kg
                      </button>
                    )}
                    {inChain && (
                      <button onClick={() => { onRegressionRequest(exIdx); setTipOpen(false); }}
                        className="text-xs px-3 py-1.5 rounded-lg bg-destructive text-white font-medium hover:bg-destructive/80 transition-colors">
                        {t('se_variant_simple')}
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <button onClick={() => { onExtendRest(exIdx, Math.max(currentRest - 30, 30)); dismissTip(); }}
                      className="text-xs px-3 py-1.5 rounded-lg bg-white/20 text-white font-medium hover:bg-white/30 transition-colors flex items-center gap-1">
                      <Timer className="w-3 h-3" /> −30s repos
                    </button>
                    {!isBodyweightExercise(exercise.name) ? (
                      <button onClick={() => {
                          for (let s = activeSetIdx + 1; s < sets; s++) {
                            const key = `${exIdx}-${s}`;
                            const current = logs[key]?.weight || 0;
                            updateLog(exIdx, s, 'weight', current > 0 ? current + 2.5 : 2.5);
                          }
                          dismissTip();
                        }}
                        className="text-xs px-3 py-1.5 rounded-lg bg-accent text-white font-medium hover:bg-accent/80 transition-colors">
                        +2.5 kg
                      </button>
                    ) : inChain ? (
                      <button onClick={() => { onProgressionRequest(exIdx); setTipOpen(false); }}
                        className="text-xs px-3 py-1.5 rounded-lg bg-accent text-white font-medium hover:bg-accent/80 transition-colors">
                        {t('se_variant_harder')}
                      </button>
                    ) : null}
                  </>
                )}
              </div>

              <div className="mt-3 pt-2.5 border-t border-white/10">
                {!confirmDisableTips ? (
                  <div className="flex items-center justify-between">
                    <button onClick={dismissTip} className="text-xs text-white/50 hover:text-white/80 transition-colors">{t('se_close_tip')}</button>
                    <button onClick={() => setConfirmDisableTips(true)} className="text-[11px] text-white/35 hover:text-white/60 transition-colors">{t('se_hide_tips')}</button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-[11px] text-white/70 leading-snug">Ne plus afficher les conseils du coach pendant tes séances ? Tu pourras les réactiver dans les paramètres (Profil).</p>
                    <div className="flex items-center gap-2">
                      <button onClick={disableCoachTips} className="text-xs px-3 py-1.5 rounded-lg bg-destructive text-white font-medium hover:bg-destructive/80 transition-colors">Oui, désactiver</button>
                      <button onClick={() => setConfirmDisableTips(false)} className="text-xs px-3 py-1.5 rounded-lg bg-white/15 text-white font-medium hover:bg-white/25 transition-colors">Annuler</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <button data-tutorial="coach-tip" onClick={() => setTipOpen(o => !o)}
            className="relative w-12 h-12 rounded-full flex items-center justify-center shadow-2xl transition-transform active:scale-95"
            style={{ background: 'linear-gradient(135deg, #6d28d9, #4c1d95)', border: '1px solid rgba(139,92,246,0.6)', boxShadow: '0 0 20px rgba(139,92,246,0.45), 0 6px 20px rgba(0,0,0,0.4)' }}
            aria-label="Conseil du coach">
            <img src="/robotapp.png" alt="Coach" className="w-9 h-9 object-contain" />
            {!tipOpen && (
              <span className={`absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#1e0050] animate-pulse ${isPain ? (severePain ? 'bg-red-500' : 'bg-orange-400') : isUnder ? 'bg-destructive' : 'bg-green-400'}`} />
            )}
          </button>
        </div>
      );
    })()}
    </>
  );

}

// ─── Overview Panel ────────────────────────────────────────────────────────────
// Un exercice de la vue d'ensemble, réordonnable par sa poignée (⋮⋮).
// Le drag ne démarre QUE depuis la poignée (dragListener={false}) ; Starter →
// la poignée est visible mais déclenche l'upsell au lieu du drag.
function OverviewItem({ origIdx, exercise, sets, filledSets, isOpen, onToggle, canReorder, onUpsell, onCommit, showGrip, isFirst, children }) {
  const controls = useDragControls();
  return (
    <Reorder.Item value={origIdx} dragListener={false} dragControls={controls} onDragEnd={onCommit} className="list-none">
      <Card className="bg-white/15 backdrop-blur-sm border-white/20 overflow-hidden">
        <div className="w-full flex items-center gap-1 p-4">
          {showGrip && (
            <button type="button" aria-label="Changer l'ordre"
              {...(isFirst ? { 'data-tutorial': 'reorder-handle' } : {})}
              onPointerDown={(e) => { if (canReorder) { e.preventDefault(); controls.start(e); } else { onUpsell?.(); } }}
              className="flex-shrink-0 -ml-2 p-1.5 rounded-md text-white/40 hover:text-white/70 touch-none cursor-grab active:cursor-grabbing">
              <GripVertical className="w-4 h-4" />
            </button>
          )}
          <button type="button" className="flex-1 flex items-center justify-between text-left min-w-0" onClick={onToggle}>
            <div className="min-w-0">
              <span className="font-semibold text-sm text-white">{exercise.name}</span>
              <div className="flex gap-2 mt-0.5 flex-wrap items-center">
                {exercise.muscle_group && <Badge variant="outline" className="text-xs border-white/30 text-white">{exercise.muscle_group}</Badge>}
                <span className="text-xs text-white/60">{sets}×{exercise.target_reps}</span>
                {filledSets > 0 && <span className="text-xs text-green-400">{filledSets}/{sets} séries</span>}
              </div>
            </div>
            <ChevronDown {...(isFirst ? { 'data-tutorial': 'expand-chevron' } : {})} className={`w-4 h-4 text-white/50 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
        {isOpen && children}
      </Card>
    </Reorder.Item>
  );
}

function OverviewPanel({ exercises, logs, updateLog, onClose, fragileZones = [], onReorder, canReorder = false, onUpsellReorder }) {
  const { t } = useI18n();
  const getLogKey = (exIdx, setIdx) => `${exIdx}-${setIdx}`;
  const [openIdx, setOpenIdx] = useState(null);

  // Tuto au 1er affichage de la Vue d'ensemble (déclenché une seule fois par
  // montage, dès que le panneau apparaît) : poignée ⋮⋮ puis flèche ⌄.
  const { startTutorial } = useTutorial() || {};
  const tutoFiredRef = useRef(false);
  useEffect(() => {
    if (tutoFiredRef.current || !startTutorial) return;
    tutoFiredRef.current = true;
    const t = setTimeout(() => {
      const steps = [];
      if (onReorder) steps.push({
        target: 'reorder-handle',
        title: t('se_tuto_reorder_t'),
        description: t('se_tuto_reorder_d'),
        nonInteractive: true,
      });
      steps.push({
        target: 'expand-chevron',
        title: t('se_tuto_expand_t'),
        description: t('se_tuto_expand_d'),
        nonInteractive: true,
      });
      // ignoreSkipAll : tuto de découverte d'une nouvelle fonctionnalité → visible
      // même si l'utilisateur avait "passé tous les tutos" pendant l'onboarding.
      startTutorial('overview-intro', steps, { ignoreSkipAll: true });
    }, 350);
    return () => clearTimeout(t);
  }, [startTutorial]); // eslint-disable-line — une seule fois au montage du panneau

  // Ordre d'AFFICHAGE = liste d'indices originaux (les saisies restent indexées
  // par l'index original pendant le drag → aucune donnée ne bouge avant commit).
  const validIdxs = exercises.map((_, i) => i).filter(i => exercises[i] && exercises[i].name);
  const [order, setOrder] = useState(validIdxs);
  const orderRef = useRef(order);
  orderRef.current = order;
  const sig = exercises.map(e => e?.name).join('|');
  useEffect(() => { setOrder(exercises.map((_, i) => i).filter(i => exercises[i]?.name)); setOpenIdx(null); }, [sig]); // eslint-disable-line

  // Fin de drag → on applique la permutation au parent (remap logs/repos/position)
  const commit = () => {
    const o = orderRef.current;
    if (o.some((v, i) => v !== i)) {
      onReorder?.(o);
      setOrder(o.map((_, i) => i)); // le parent a permuté → identité, pas de flash
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-bold text-lg text-white">{t('se_overview')}</h2>
        <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/10">
          <ChevronLeft className="w-4 h-4 mr-1" /> {t('se_back')}
        </Button>
      </div>
      <Reorder.Group axis="y" values={order} onReorder={setOrder} className="space-y-4 list-none p-0 m-0">
        {order.map((origIdx, displayPos) => {
          const exercise = exercises[origIdx];
          if (!exercise || !exercise.name) return null;
          const sets = Math.max(1, exercise.sets || 3);
          const isOpen = openIdx === origIdx;
          const filledSets = Array.from({ length: sets }).filter((_, s) => logs[getLogKey(origIdx, s)]?.reps).length;
          return (
            <OverviewItem
              key={origIdx}
              origIdx={origIdx}
              exercise={exercise}
              sets={sets}
              filledSets={filledSets}
              isOpen={isOpen}
              onToggle={() => setOpenIdx(isOpen ? null : origIdx)}
              canReorder={canReorder}
              onUpsell={onUpsellReorder}
              onCommit={commit}
              showGrip={!!onReorder}
              isFirst={displayPos === 0}
            >
              <div className="px-4 pb-4 space-y-1.5">
                {Array.from({ length: sets }).map((_, setIdx) =>
                  <SetRow
                    key={`${origIdx}-${setIdx}`}
                    setIdx={setIdx}
                    log={logs[getLogKey(origIdx, setIdx)] || {}}
                    onUpdate={(field, value) => updateLog(origIdx, setIdx, field, value)}
                    exerciseFragileZones={getExerciseFragileZones(exercise, fragileZones)} />
                )}
              </div>
            </OverviewItem>
          );
        })}
      </Reorder.Group>
    </div>);
}

// ─── End of session panel ──────────────────────────────────────────────────────
function EndPanel({ exercises, logs, updateLog, fatigue, setFatigue, notes, setNotes, onSave, saving, proposal, setProposal, generateProposal, coachPainQuery, onDismissPain, fragileZones = [] }) {
  const { t } = useI18n();
  const [showOverview, setShowOverview] = useState(false);
  const navigate = useNavigate();

  // Notification coach après douleur
  if (coachPainQuery) {
    return (
      <div className="space-y-5">
        <div>
          <h2 className="font-heading font-bold text-2xl text-white">Séance validée ✅</h2>
        </div>
        <div className="bg-violet-800 rounded-2xl border border-violet-600 p-4 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-violet-300 mb-1">Coach IA</p>
              <p className="text-sm text-white leading-relaxed">{coachPainQuery.preMessage}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => navigate('/coach', { state: { initialMessage: coachPainQuery.preMessage } })}
              className="flex-1 bg-white text-violet-700 hover:bg-white/90 font-semibold"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Répondre au coach
            </Button>
            <Button
              onClick={onDismissPain}
              variant="outline"
              className="border-violet-500 text-violet-200 hover:bg-violet-700"
            >
              Plus tard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (showOverview) {
    return <OverviewPanel exercises={exercises} logs={logs} updateLog={updateLog} onClose={() => setShowOverview(false)} fragileZones={fragileZones} />;
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-heading font-bold text-2xl text-white">Séance terminée 🎉</h2>
        <p className="text-white/70 text-sm mt-1">Finalise tes infos avant de valider.</p>
      </div>

      <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/10 hover:text-white" onClick={() => setShowOverview(true)}>
        <Eye className="w-4 h-4 mr-2" /> {t('se_review_edit')}
      </Button>

      <Card className="p-5 space-y-5 bg-white/15 backdrop-blur-sm border-white/20">
        <h3 className="font-heading font-semibold text-base text-white">{t('se_summary')}</h3>
        <div>
          <div className="flex items-center gap-2 mb-3">
            <label className="text-sm font-medium text-white">{t('se_global_fatigue')}</label>
            <Popover>
              <PopoverTrigger asChild>
                <button className="text-white/50 hover:text-white transition-colors">
                  <HelpCircle className="w-4 h-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-72 text-sm space-y-4">
                <div>
                  <div className="font-semibold mb-2 text-foreground">Niveaux de fatigue</div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-accent mt-1 flex-shrink-0" />
                      <div><span className="font-medium">Frais</span> — Énergie maximale, peu de fatigue accumulée</div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1 flex-shrink-0" />
                      <div><span className="font-medium">Normal/Fatigué</span> — Bon état de récupération, prêt à progresser</div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-chart-4 mt-1 flex-shrink-0" />
                      <div><span className="font-medium">Épuisé</span> — Fatigue importante, réduire le volume</div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-destructive mt-1 flex-shrink-0" />
                      <div><span className="font-medium">Détruit</span> — Surmenage, repos recommandé</div>
                    </div>
                  </div>
                </div>
                <div className="border-t pt-3">
                  <div className="font-semibold mb-2 text-foreground">Adaptation des séances</div>
                  <div className="space-y-2 text-xs">
                    <div><span className="font-medium">Frais/Normal :</span> Volume augmente, progresser en charge</div>
                    <div><span className="font-medium">Fatigué :</span> Maintenir le volume, même charge</div>
                    <div><span className="font-medium">Épuisé/Détruit :</span> Réduire volume ou durée, repos supplémentaire</div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex gap-2">
            {[
            { value: 1, label: t('se_fat_1'), bg: 'bg-accent', ring: 'ring-accent' },
            { value: 2, label: t('se_fat_2'), bg: 'bg-primary', ring: 'ring-primary' },
            { value: 3, label: t('se_fat_3'), bg: 'bg-primary', ring: 'ring-primary' },
            { value: 4, label: t('se_fat_4'), bg: 'bg-chart-4', ring: 'ring-chart-4' },
            { value: 5, label: t('se_fat_5'), bg: 'bg-destructive', ring: 'ring-destructive' }].
            map(({ value, label, bg, ring }) =>
            <button
              key={value}
              onClick={() => { setFatigue(value); setProposal(null); }}
              className={`flex-1 flex flex-col items-center gap-2 py-3 rounded-xl transition-all
                  ${fatigue === value ? `${bg}/20 ring-2 ${ring}` : 'bg-white/10 hover:bg-white/20'}`}>
              
                <div className={`w-3 h-3 rounded-full ${fatigue === value ? bg : 'bg-white/20'}`} />
                <span className={`text-[10px] font-semibold ${fatigue === value ? 'text-white' : 'text-white/50'}`}>{label}</span>
              </button>
            )}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <label className="text-sm font-medium text-white">{t('se_notes')}</label>
            <Popover>
              <PopoverTrigger asChild>
                <button className="text-white/50 hover:text-white transition-colors">
                  <HelpCircle className="w-4 h-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-72 text-sm space-y-3 ">
                <div>
                  <div className="font-semibold mb-2">À quoi servent les notes ?</div>
                  <div className="space-y-2 text-xs">
                    <p>Tes notes aident l'IA à adapter tes séances futures de manière intelligente.</p>
                    <p className="font-medium">Exemples utiles :</p>
                    <ul className="list-disc list-inside space-y-1 ml-1">
                      <li><span className="text-destructive font-medium">Douleur/gêne</span> → réduction de charge</li>
                      <li><span className="text-accent font-medium">Trop facile</span> → augmente la charge</li>
                      <li><span className="text-chart-4 font-medium">Mauvaise position</span> → ajuste intensité</li>
                      <li><span className="text-primary font-medium">Très dur</span> → réduit le volume</li>
                    </ul>
                  </div>
                </div>
                <div className="border-t pt-2">
                  <div className="font-semibold mb-1">Automatisation</div>
                  <p className="text-xs">Chaque note est analysée pour ajuster les 5 prochaines séances : charges, séries, et RIR cible.</p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <Textarea placeholder={t('se_notes_ph')} value={notes} onChange={(e) => { setNotes(e.target.value); setProposal(null); }} className="bg-white/10 border-white/20 text-white placeholder:text-white/30" />
        </div>
        {/* Propositions IA */}
        {proposal === null ? (
          <Button onClick={() => setProposal(generateProposal())} variant="outline" className="w-full border-white/30 text-white hover:bg-white/10" size="lg">
            <TrendingDown className="w-4 h-4 mr-2" />
            Voir les recommandations pour la suite
          </Button>
        ) : proposal.length === 0 ? (
          <p className="text-xs text-white/50 text-center">Aucun ajustement nécessaire — continue comme ça 💪</p>
        ) : (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-white/70 uppercase tracking-wide">Recommandations pour tes prochaines séances</p>
            {proposal.map((p, i) => (
              <div key={i} className={`flex items-start gap-3 px-3 py-2 rounded-lg text-xs ${
                p.type === 'increase' ? 'bg-green-500/20 text-green-200' :
                p.type === 'reduce'   ? 'bg-red-500/20 text-red-200' :
                p.type === 'warn'     ? 'bg-orange-500/20 text-orange-200' :
                'bg-white/10 text-white/70'
              }`}>
                <span className="text-base mt-0.5">
                  {p.type === 'increase' ? '↑' : p.type === 'reduce' ? '↓' : p.type === 'warn' ? '⚠' : '~'}
                </span>
                <div className="flex-1">
                  <span className="font-semibold">{p.general ? p.exercise : p.exercise}</span>
                  {p.newWeight != null && <span className="ml-1 opacity-80">→ {p.newWeight}kg</span>}
                  <p className="text-white/60 mt-0.5">{p.reason}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {proposal !== null && proposal.length > 0 ? (
          <div className="flex gap-2">
            <Button onClick={() => onSave(true)} disabled={saving} className="flex-1" size="lg">
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
              {t('se_validate_session')}
            </Button>
            <button onClick={() => onSave(false)} disabled={saving} className="px-4 text-sm text-white/50 hover:text-white/80 transition-colors">
              {t('ignore')}
            </button>
          </div>
        ) : (
          <Button onClick={() => onSave(false)} disabled={saving} className="w-full" size="lg">
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
            {t('se_validate_session')}
          </Button>
        )}
      </Card>
    </div>);

}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function SessionLog() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t, lang } = useI18n();
  const urlParams = new URLSearchParams(window.location.search);
  // Fallback : le swipe navigue vers /session SANS le ?id= → on récupère la
  // séance active depuis localStorage pour ne pas afficher l'écran vide.
  const sessionId = urlParams.get('id') || (() => {
    try { return localStorage.getItem('active_session_id'); } catch { return null; }
  })();

  const [user, setUser] = useState(null);
  const _draft = (() => { try { const s = localStorage.getItem(`session_draft_${sessionId}`); return s ? JSON.parse(s) : {}; } catch { return {}; } })();
  const [logs, setLogs] = useState(() => _draft.logs || {});
  const [fatigue, setFatigue] = useState(() => _draft.fatigue ?? 2);
  const [notes, setNotes] = useState(() => _draft.notes || '');
  const [saving, setSaving] = useState(false);
  const [volumeProposal, setVolumeProposal] = useState(null); // { proposal, programId } — étape fin de séance
  const [volumeBusy, setVolumeBusy] = useState(false);
  // Suivi douleur — question « comment a réagi ta zone ? » en début de séance
  const [painCheckEp, setPainCheckEp] = useState(null);
  const [painProposal, setPainProposal] = useState(null);
  const [painBusy, setPainBusy] = useState(false);
  const [scrollReady, setScrollReady] = useState(false);
  const [currentExIdx, setCurrentExIdx] = useState(() => _draft.currentExIdx || 0);
  const [navDir, setNavDir] = useState('next'); // sens de navigation entre exos (prev → ouvre la dernière série)
  const [showOverview, setShowOverview] = useState(false);
  const [showEnd, setShowEnd] = useState(() => _draft.showEnd || false);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);
  const { startTimer } = useRestTimer();

  // Conteneur scrollable propre (Séance est rendue HORS du carrousel, comme CoachIA,
  // pour pouvoir se pinner au viewport visible quand le clavier s'ouvre).
  const scrollRootRef = useRef(null);
  const [kbOpen, setKbOpen] = useState(false);
  const [navHeight, setNavHeight] = useState(0);
  useEffect(() => {
    const nav = document.querySelector('.mobile-nav');
    if (nav) setNavHeight(nav.offsetHeight);
  }, []);

  // Aligne le conteneur sur le visualViewport EN DIRECT DANS LE DOM (pas via état
  // React = zéro retard). Safari décale la zone visible (vv.offsetTop) quand le
  // clavier s'ouvre ; le conteneur la suit au pixel près → aucune bande violette.
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const isEditable = (el) =>
      el && el !== document.body &&
      (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable === true);

    // Recadre le champ focalisé juste au-dessus du clavier (marge 20px).
    const scrollActiveIntoView = () => {
      const ae = document.activeElement;
      if (!isEditable(ae) || typeof ae.scrollIntoView !== 'function') return;
      ae.style.scrollMarginBottom = '20px';
      ae.scrollIntoView({ block: 'nearest', behavior: 'auto' });
    };
    // Plusieurs passes : le viewport se stabilise sur une durée VARIABLE selon
    // l'appareil → un seul scroll à délai fixe ratait parfois (bug "de temps en temps").
    const recenter = () => {
      scrollActiveIntoView();
      requestAnimationFrame(scrollActiveIntoView);
      [120, 300, 500].forEach(d => setTimeout(scrollActiveIntoView, d));
    };

    // Aligne le conteneur sur le rect exact du visualViewport (anti-bande violette).
    const syncContainer = () => {
      const isOpen = vv.height < window.innerHeight * 0.75;
      document.body.classList.toggle('keyboard-open', isOpen);
      setKbOpen(isOpen);
      const el = scrollRootRef.current;
      if (el) {
        el.style.top = (vv.offsetTop || 0) + 'px';
        el.style.height = vv.height + 'px';
      }
      return isOpen;
    };

    // resize = ouverture/fermeture clavier → on resynchronise ET on recadre
    const onVVResize = () => { if (syncContainer()) recenter(); };
    // scroll = le viewport se décale (Safari) → on suit le conteneur SANS recadrer
    // (pour ne pas combattre un scroll manuel de l'utilisateur)
    const onVVScroll = () => { syncContainer(); };
    // Changer de champ clavier déjà ouvert ne déclenche aucun resize → recadrer au focus
    const onFocusIn = (e) => { if (isEditable(e.target)) recenter(); };

    // Quitter l'app clavier ouvert : aucun événement viewport ne se déclenche en
    // arrière-plan → le conteneur reste figé sur l'état "clavier ouvert" (écran
    // décalé/compressé au retour). On ferme le clavier en quittant, et on
    // resynchronise en plusieurs passes au retour (le viewport met un moment à
    // se stabiliser après la reprise).
    const resyncSoon = () => {
      syncContainer();
      requestAnimationFrame(syncContainer);
      [150, 400, 800].forEach(d => setTimeout(syncContainer, d));
    };
    const onVisibility = () => {
      if (document.hidden) {
        const ae = document.activeElement;
        if (isEditable(ae)) ae.blur();
      } else {
        resyncSoon();
      }
    };

    syncContainer();
    vv.addEventListener('resize', onVVResize);
    vv.addEventListener('scroll', onVVScroll);
    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pageshow', resyncSoon);
    return () => {
      vv.removeEventListener('resize', onVVResize);
      vv.removeEventListener('scroll', onVVScroll);
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pageshow', resyncSoon);
      document.body.classList.remove('keyboard-open');
    };
  }, []);

  // Restore timer from localStorage on mount (e.g. after page refresh or navigation)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`rest_timer_${sessionId}`);
      if (saved) {
        const { endTime, totalSeconds, label: savedLabel, mode: savedMode } = JSON.parse(saved);
        const left = Math.ceil((endTime - Date.now()) / 1000);
        if (left > 0) {
          // Utilise totalSeconds (durée originale) pour le total — pas left — sinon le progress bar est faussé
          const seconds = totalSeconds || left;
          startTimer(seconds, endTime, () => {
            try { localStorage.removeItem(`rest_timer_${sessionId}`); } catch {}
          }, (newEndTime) => {
            try {
              const cur = JSON.parse(localStorage.getItem(`rest_timer_${sessionId}`) || '{}');
              localStorage.setItem(`rest_timer_${sessionId}`, JSON.stringify({ ...cur, endTime: newEndTime }));
            } catch {}
          }, savedLabel, savedMode);
        } else {
          localStorage.removeItem(`rest_timer_${sessionId}`);
        }
      }
    } catch {}
  }, []); // eslint-disable-line

  const [restTimeForEx, setRestTimeForEx] = useState(() => _draft.restTimeForEx || {});
  const [exSuggestion, setExSuggestion] = useState(null); // { exIdx, name, notes }
  const [sessionExercises, setSessionExercises] = useState(() => _draft.sessionExercises || null);
  const [editingObjectif, setEditingObjectif] = useState(false);
  const [previousLogs, setPreviousLogs] = useState({});

  // Auto-save des logs en BDD (debounce 2s) pour persister même sans "Terminer la séance"
  useEffect(() => {
    if (!session || !user || saving) return;
    if (Object.keys(logs).length === 0) return;
    const timer = setTimeout(async () => {
      try {
        // Vider d'abord les logs auto-sauvegardés pour cette session
        const existing = await base44.entities.SeriesLog.filter({ session_id: session.id });
        await Promise.all(existing.map(l => base44.entities.SeriesLog.delete(l.id)));
        // Créer les logs non-vides
        await Promise.all(Object.entries(logs).map(([key, log]) => {
          if (!log.weight && !log.reps) return Promise.resolve();
          const [exIdx, setIdx] = key.split('-').map(Number);
          const exercise = exercises[exIdx];
          if (!exercise) return Promise.resolve();
          // Convertit log.weight/reps en nombre ou null (et pas 0 qui pollue le pré-remplissage de la séance suivante)
          const w = parseFloat(log.weight);
          const r = parseInt(log.reps, 10);
          return base44.entities.SeriesLog.create({
            session_id: session.id,
            user_id: user.id,
            exercise_name: exercise.name,
            exercise_variant: exercise.name,
            set_number: setIdx + 1,
            weight: isNaN(w) ? null : w,
            reps_done: isNaN(r) ? null : r,
            reps_target: exercise.target_reps || '',
            rest_seconds: restTimeForEx[exIdx] || exercise.rest_seconds || 90,
            mode: log.mode || 'RIR_2',
            execution_quality: log.quality || 'good',
            feedback: log.feedback || null,
          });
        }));
      } catch (e) { /* silent — auto-save is best-effort */ }
    }, 2000);
    return () => clearTimeout(timer);
  }, [logs]); // eslint-disable-line
  const [sessionsHistory, setSessionsHistory] = useState(''); // résumé textuel pour l'IA
  const [proposal, setProposal] = useState(null);
  const [coachPainQuery, setCoachPainQuery] = useState(null); // {zone, message} notification coach après douleur

  useEffect(() => {base44.auth.me().then(u => setUser(normalizeUser(u)));}, []);

  useEffect(() => {
    if (!sessionId) return;
    try {
      localStorage.setItem(`session_draft_${sessionId}`, JSON.stringify({ logs, currentExIdx, fatigue, notes, restTimeForEx, sessionExercises, showEnd }));
      localStorage.setItem('active_session_id', sessionId);
    } catch {}
  }, [logs, currentExIdx, fatigue, notes, restTimeForEx, sessionExercises, showEnd, sessionId]);

  // Changement d'exercice (Suivant/Précédent) ou passage à l'écran de fin →
  // remonter en haut pour voir l'exercice en cours (sinon on reste en bas,
  // là où était le bouton). Le premier rendu est ignoré pour laisser la
  // restauration de position (reprise de brouillon) faire son travail.
  const exScrollRef = useRef(null);
  useEffect(() => {
    const snapshot = `${currentExIdx}|${showEnd}`;
    if (exScrollRef.current === null) { exScrollRef.current = snapshot; return; }
    if (exScrollRef.current === snapshot) return;
    exScrollRef.current = snapshot;
    scrollRootRef.current?.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentExIdx, showEnd]);

  useEffect(() => {
    if (!sessionId) return;
    const key = `session_scroll_${sessionId}`;
    const el = scrollRootRef.current;
    const saved = parseInt(localStorage.getItem(key) || '0');
    if (saved > 0 && el) {
      setTimeout(() => {
        el.scrollTo({ top: saved, behavior: 'instant' });
        setScrollReady(true);
      }, 200);
    } else {
      setScrollReady(true);
    }
    if (!el) return;
    let pauseSave = false;
    let resizeTimer = null;
    const onScroll = () => {
      if (pauseSave) return;
      // Ne pas sauver la position pendant que le clavier est ouvert (iOS scrolle
      // vers le bas pour l'input → on restaurerait à tort sur la dernière série)
      if (document.body.classList.contains('keyboard-open')) return;
      try { localStorage.setItem(key, String(el.scrollTop)); } catch {}
    };
    const onResize = () => {
      // Resize dû au clavier (champ en focus) → ne PAS restaurer le scroll,
      // sinon ça écrase le scrollIntoView qui place le champ au-dessus du clavier.
      const ae = document.activeElement;
      const editing = ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA' || ae.isContentEditable);
      if (editing || document.body.classList.contains('keyboard-open')) return;
      pauseSave = true;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const pos = parseInt(localStorage.getItem(key) || '0');
        if (pos > 0) el.scrollTo({ top: pos, behavior: 'instant' });
        pauseSave = false;
      }, 350);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      clearTimeout(resizeTimer);
    };
  }, [sessionId]);

  const fragileZones = (() => {
    try { return JSON.parse(user?.fragile_zones || '[]'); } catch { return []; }
  })();


  const { data: session } = useQuery({
    queryKey: ['session', sessionId],
    queryFn: async () => {
      const results = await base44.entities.Session.filter({ id: sessionId });
      return results[0];
    },
    enabled: !!sessionId
  });

  // Ordre PLANIFIÉ d'origine, capturé une seule fois — sert de référence pour
  // détecter un réordonnancement (handleUpdateExercise peut persister l'ordre
  // courant en base, donc on ne peut pas se fier à session.exercises au save).
  const plannedOrderRef = useRef(null);
  useEffect(() => {
    if (session?.exercises && !plannedOrderRef.current) {
      plannedOrderRef.current = session.exercises.filter(e => e && e.name).map(e => e.name);
    }
  }, [session?.id]); // eslint-disable-line

  // Rappel de l'ordre pratiqué la dernière fois sur ce créneau (si différent du
  // planifié et que les exercices sont les mêmes) — informatif, fermable.
  const [orderHint, setOrderHint] = useState(null);
  useEffect(() => {
    if (!session?.id) return;
    try {
      const raw = localStorage.getItem(`last_order_${session.program_id}_${(session.day_label || '').trim().toLowerCase()}`);
      if (!raw) { setOrderHint(null); return; }
      const { names } = JSON.parse(raw);
      const current = (session.exercises || []).filter(e => e && e.name).map(e => e.name);
      const sameSet = names?.length === current.length
        && names.slice().sort().join('|') === current.slice().sort().join('|');
      setOrderHint(sameSet && names.join('|') !== current.join('|') ? names : null);
    } catch { setOrderHint(null); }
  }, [session?.id]); // eslint-disable-line

  // Suivi douleur : si un épisode actif concerne cette séance et n'a pas été
  // checké aujourd'hui (ni sur l'Accueil), on pose la question au démarrage.
  const painCheckedRef = useRef(null);
  useEffect(() => {
    if (!session || !user?.id || session.status === 'completed') return;
    if (painCheckedRef.current === session.id) return;
    painCheckedRef.current = session.id;
    let cancelled = false;
    (async () => {
      try {
        const eps = await loadEpisodes(user.id);
        const cand = episodesToCheck(eps).find(e => sessionTouchesZone(session, e.zone));
        if (!cancelled && cand) setPainCheckEp(cand);
      } catch {}
    })();
    return () => { cancelled = true; };
  }, [session?.id, user?.id]); // eslint-disable-line

  // Cycle : rappel échauffement/technique en tête de séance UNIQUEMENT pendant
  // la fenêtre d'ovulation (laxité ligamentaire ↑ → protection genou/LCA).
  // Dismissible, et ne revient pas après un rechargement (garde localStorage).
  const [cycleTip, setCycleTip] = useState(null);
  useEffect(() => {
    if (!session || !user || session.status === 'completed') return;
    if (user.gender !== 'female') return;
    try { if (localStorage.getItem(`cycle_tip_${session.id}`)) return; } catch {}
    const c = computeCycle(user);
    if (c?.phase === 'ovulation') setCycleTip(c);
  }, [session?.id, user?.id]); // eslint-disable-line
  const dismissCycleTip = () => {
    try { localStorage.setItem(`cycle_tip_${session?.id}`, '1'); } catch {}
    setCycleTip(null);
  };

  // Persiste un épisode (remplace celui de la même zone)
  const persistEpisode = async (ep) => {
    const eps = await loadEpisodes(user.id);
    const merged = eps.some(e => e.zone === ep.zone) ? eps.map(e => (e.zone === ep.zone ? ep : e)) : [...eps, ep];
    await saveEpisodes(user.id, merged);
  };
  const handlePainReaction = async (reaction) => {
    if (!painCheckEp) return;
    setPainBusy(true);
    try {
      const { episode: upd, proposal } = computePainPrescription(painCheckEp, reaction, lang);
      await persistEpisode(upd);
      setPainCheckEp(upd);
      setPainProposal(proposal);
    } catch (e) { console.error('[pain] reaction', e); }
    setPainBusy(false);
  };
  const handlePainApply = async () => {
    if (!painCheckEp || !painProposal?.apply) return;
    setPainBusy(true);
    try {
      const upd = await applyPainLevel(session.program_id, painCheckEp, painProposal.apply.toLevel);
      await persistEpisode(upd);
    } catch (e) { console.error('[pain] apply', e); }
    setPainBusy(false);
    setPainCheckEp(null); setPainProposal(null);
  };
  const handlePainManual = () => { setPainCheckEp(null); setPainProposal(null); navigate('/program?edit=true'); };
  const handlePainDismiss = () => { setPainCheckEp(null); setPainProposal(null); };

  // Pour l'état vide : sait-on s'il existe un programme actif ?
  const { data: activePrograms = [] } = useQuery({
    queryKey: ['programs'],
    queryFn: () => base44.entities.Program.filter({ status: 'active' }, '-created_date', 1),
  });
  const hasProgram = activePrograms.length > 0;
  // Programme importé (vs généré par le coach) → on n'affiche pas le bloc "Valeurs optimisées"
  const isImportedProgram = (() => {
    try {
      const ids = JSON.parse(localStorage.getItem('imported_program_ids') || '[]');
      if (session?.program_id && ids.includes(session.program_id)) return true;
    } catch {}
    return activePrograms[0]?.weekly_structure === 'custom';
  })();

  // Redirige si la séance est déjà validée (retour arrière, mise en veille, changement d'onglet)
  useEffect(() => {
    if (session?.status === 'completed' && !coachPainQuery) {
      try { localStorage.removeItem(`session_draft_${sessionId}`); localStorage.removeItem('active_session_id'); } catch {}
      navigate('/program');
    }
  }, [session?.status, coachPainQuery]); // eslint-disable-line

  // Fetch previous session logs for the same program — UNE SEULE FOIS au mount.
  // (sinon le refetch de TanStack Query au focus de fenêtre re-déclenche tout le pipeline
  // de pré-remplissage et reset le curseur des inputs pendant la frappe)
  const previousLogsFetched = useRef(false);
  const [previousLogsLoaded, setPreviousLogsLoaded] = useState(false);
  useEffect(() => {
    if (!session || !user) return;
    if (previousLogsFetched.current) return;
    previousLogsFetched.current = true;
    const fetchPreviousLogs = async () => {
      // On inclut aussi les séances "planned" car elles peuvent avoir des logs auto-sauvegardés
      const allSessions = await base44.entities.Session.filter({ program_id: session.program_id });
      const sorted = allSessions
        .filter(s => s.id !== session.id)
        .sort((a, b) => {
          // Tri par actual_date (complétées) ou updated_date (drafts) — plus récent en premier
          const dateA = new Date(a.actual_date || a.updated_date || a.created_date).getTime();
          const dateB = new Date(b.actual_date || b.updated_date || b.created_date).getTime();
          return dateB - dateA;
        });

      // previousLogs = dernière séance du même type (même day_label) AVEC des logs
      // On itère du plus récent au plus ancien et on prend la première qui a des données
      const sameType = sorted.filter(s => s.day_label === session.day_label);
      const candidates = sameType.length > 0 ? sameType : sorted;
      for (const candidate of candidates) {
        const candidateLogs = await base44.entities.SeriesLog.filter({ session_id: candidate.id, user_id: user.id });
        if (candidateLogs.length > 0) {
          const map = {};
          candidateLogs.forEach(sl => {
            if (!map[sl.exercise_name]) map[sl.exercise_name] = {};
            map[sl.exercise_name][sl.set_number] = { weight: sl.weight, reps: sl.reps_done, mode: sl.mode, quality: sl.execution_quality };
          });
          setPreviousLogs(map);
          break;
        }
      }

      // sessionsHistory = toutes les séances condensées pour l'IA coach
      const recentSessions = sorted.slice(0, 10);
      if (recentSessions.length === 0) return;
      const allLogs = await Promise.all(
        recentSessions.map(s => base44.entities.SeriesLog.filter({ session_id: s.id, user_id: user.id }))
      );
      const lines = recentSessions.map((s, i) => {
        const date = s.actual_date || s.created_date?.split('T')[0] || '?';
        const byEx = {};
        allLogs[i].forEach(sl => {
          if (!byEx[sl.exercise_name]) byEx[sl.exercise_name] = [];
          byEx[sl.exercise_name].push(`${sl.weight || '?'}kg×${sl.reps_done || '?'}`);
        });
        const exLines = Object.entries(byEx).map(([name, sets]) => `  ${name} : ${sets.join(', ')}`).join('\n');
        return `Séance du ${date} :\n${exLines}`;
      });
      setSessionsHistory(lines.join('\n'));
    };
    fetchPreviousLogs().finally(() => setPreviousLogsLoaded(true));
  }, [session, user]);

  const { data: activeProgram } = useQuery({
    queryKey: ['active-program-session', session?.program_id],
    queryFn: async () => {
      const results = await base44.entities.Program.filter({ id: session.program_id });
      return results[0];
    },
    enabled: !!session?.program_id
  });

  // Phase calculée dynamiquement depuis la position dans le cycle (active_phase est statique)
  const _wk = session?.week_number || 1;
  const _pw = activeProgram?.planned_weeks || 8;
  const _ratio = (_wk - 1) / Math.max(1, _pw - 1);
  const _phase = _ratio < 0.25 ? 'MEV' : _ratio < 0.75 ? 'MAV' : 'MRV';

  const rirContext = {
    phase: _phase,
    sessionType: session?.type || 'hypertrophy',
    weekNumber: _wk,
    plannedWeeks: _pw
  };

  const exercises = (sessionExercises ?? (session?.exercises || [])).filter((ex) => ex && ex.name);

  // ── Réordonner les exercices PENDANT la séance (machine prise, etc.) ──
  // Effet séance uniquement : on permute sessionExercises (brouillon local),
  // jamais le programme. Les saisies étant indexées par position, on remappe
  // logs, temps de repos et exercice courant selon la permutation.
  const [reorderUpsell, setReorderUpsell] = useState(false);
  const plan = user?.subscription_plan
    || (() => { try { return localStorage.getItem('cached_subscription_plan'); } catch { return null; } })()
    || 'starter';
  const isPaid = plan !== 'starter';
  // Starter : 1 essai gratuit par semaine glissante (aperçu qui donne envie).
  const FREE_TRY_KEY = 'reorder_free_try';
  const freeTryAvailable = (() => {
    if (isPaid) return true;
    try {
      const ts = parseInt(localStorage.getItem(FREE_TRY_KEY) || '0', 10);
      return !(ts > 0 && (Date.now() - ts) < 7 * 24 * 60 * 60 * 1000);
    } catch { return true; }
  })();
  const canReorder = isPaid || freeTryAvailable;

  const applyReorder = (newOrder) => { // newOrder[positionAffichée] = index original
    if (!newOrder?.length || newOrder.every((v, i) => v === i)) return;
    // Starter : consomme l'essai gratuit hebdomadaire au 1er déplacement effectif
    if (!isPaid) { try { localStorage.setItem(FREE_TRY_KEY, String(Date.now())); } catch {} }
    const pos = {}; // index original -> nouvelle position
    newOrder.forEach((oi, ni) => { pos[oi] = ni; });
    setLogs(prev => {
      const next = {};
      for (const [k, v] of Object.entries(prev)) {
        const dash = k.indexOf('-');
        const oi = parseInt(k.slice(0, dash), 10);
        next[`${pos[oi] ?? oi}${k.slice(dash)}`] = v;
      }
      return next;
    });
    setRestTimeForEx(prev => {
      const next = {};
      for (const [k, v] of Object.entries(prev)) next[pos[k] ?? k] = v;
      return next;
    });
    // On NE remappe PAS currentExIdx : on reste sur la même POSITION (ex. 1/5),
    // même si l'exercice qui s'y trouve a changé après réordonnancement.
    setSessionExercises(newOrder.map(oi => exercises[oi]));
  };

  // Pré-remplir les logs : priorité au log précédent (séance précédente), fallback sur target_weight.
  // Garde-fou : exécuté UNE SEULE FOIS, et UNIQUEMENT après que previousLogs ait fini de charger
  // — sinon on raterait les valeurs de la séance précédente et on réécrirait le curseur ensuite.
  const prefilledRef = useRef(false);
  useEffect(() => {
    if (!exercises.length) return;
    if (!previousLogsLoaded) return;
    if (prefilledRef.current) return;
    prefilledRef.current = true;
    setLogs(prev => {
      const updated = { ...prev };
      exercises.forEach((ex, exIdx) => {
        const sets = Math.max(1, ex.sets || 3);
        for (let s = 0; s < sets; s++) {
          const key = `${exIdx}-${s}`;
          const cur = updated[key] || {};
          const prevLog = previousLogs?.[ex.name]?.[s + 1]; // set_number commence à 1
          const next = { ...cur };
          // POIDS et REPS ne sont plus injectés comme valeurs : les anciennes
          // perfs s'affichent en PLACEHOLDER (fond grisé, non interactif) via
          // previousWeight/previousReps — taper une valeur écrit la nouvelle en
          // blanc normal. Seuls RIR et Exécution sont pré-sélectionnés (grisés),
          // marqués prefill pour être ignorés par les conseils du coach.
          const pf = { ...(cur.prefill || {}) };
          if (!cur.mode && prevLog?.mode) { next.mode = prevLog.mode; pf.mode = true; }
          if (!cur.quality && prevLog?.quality) { next.quality = prevLog.quality; pf.quality = true; }
          if (Object.keys(pf).length > 0) next.prefill = pf;
          if (Object.keys(next).length > 0) updated[key] = next;
        }
      });
      return updated;
    });
  }, [exercises.length, previousLogs, previousLogsLoaded]);

  const updateLog = (exIdx, setIdx, field, value, totalSets) => {
    setLogs((prev) => {
      const key = `${exIdx}-${setIdx}`;
      const cur = prev[key] || {};
      const entry = { ...cur, [field]: value };
      // Saisie/action du jour → la valeur n'est plus une "mémoire de séance passée"
      if (cur.prefill?.[field]) entry.prefill = { ...cur.prefill, [field]: false };
      // Valider la série = confirmer ses valeurs → tout passe en "saisi aujourd'hui"
      if (field === 'done' && value) entry.prefill = {};
      return { ...prev, [key]: entry };
    });
  };

  const propagateWeight = (exIdx, setIdx, value, totalSets) => {
  if (value === undefined || value === null || value === '') return;

  setLogs((prev) => {
    const updated = { ...prev };

    for (let s = setIdx + 1; s < totalSets; s++) {
      const key = `${exIdx}-${s}`;
      if (!updated[key]?.weight) {
        updated[key] = { ...updated[key], weight: Number(value) };
      }
    }

    return updated;
  });
};

  const forcePropagateWeight = (exIdx, setIdx, value, totalSets) => {
    if (!value || !totalSets) return;
    const newLogs = { ...logs };
    for (let s = setIdx + 1; s < totalSets; s++) {
      const key = `${exIdx}-${s}`;
      newLogs[key] = { ...(newLogs[key] || {}), weight: Number(value) };
    }
    setLogs(newLogs);
  };

  const stepToSuggestion = (step) => {
    if (!step) return null;
    if (step?.or) return { options: step.or };
    return { name: step };
  };

  const handleRegressionRequest = (exIdx) => {
    const ex = exercises[exIdx];
    const name = ex.name || '';
    const isEccentric = /excentrique/i.test(name);
    const sets = Math.max(1, ex.sets || 3);
    const targetLow = parseInt((ex.target_reps || '').split('-')[0]) || 0;

    const qualities = [];
    let totalReps = 0, filledCount = 0;
    for (let s = 0; s < sets; s++) {
      const l = logs[`${exIdx}-${s}`] || {};
      if (l.quality) qualities.push(l.quality);
      if (l.reps) { totalReps += parseInt(l.reps) || 0; filledCount++; }
    }
    const avgReps = filledCount > 0 ? totalReps / filledCount : 0;
    const hasBadQuality = qualities.some(q => q === 'bad' || q === 'degraded');
    const repsCloseToTarget = targetLow > 0 && avgReps >= targetLow - 3;
    const found = findExerciseInChains(name);

    let suggestion;
    if (hasBadQuality && repsCloseToTarget && !isEccentric) {
      suggestion = { exIdx, name: `${name} (excentrique 4s)`, notes: 'Descente lente 4s — consolider le patron moteur avant de recharger.' };
    } else if (found && found.currentIndex > 0) {
      suggestion = { exIdx, ...stepToSuggestion(found.chain[found.currentIndex - 1]) };
    } else if (found && found.currentIndex === 0) {
      suggestion = { exIdx, name: null, notes: 'Niveau minimum — réduis d\'une série ou diminue l\'amplitude.' };
    } else {
      suggestion = { exIdx, name: `${name} (excentrique 4s)`, notes: 'Descente lente 4s pour réduire la difficulté.' };
    }
    setExSuggestion(suggestion);
  };

  const handleProgressionRequest = (exIdx) => {
    const ex = exercises[exIdx];
    const name = ex.name || '';
    const isEccentric = /excentrique/i.test(name);
    const found = findExerciseInChains(name);
    const hasElastic = found && ELASTIC_PROGRESSION_CHAINS.includes(found.chainName);

    let suggestion;
    if (found && found.currentIndex !== -1 && found.currentIndex < found.chain.length - 1) {
      const nextStep = found.chain[found.currentIndex + 1];
      if (hasElastic) {
        const nextName = nextStep?.or ? nextStep.or[0] : nextStep;
        suggestion = { exIdx, options: [`${name} élastique`, nextName] };
      } else {
        suggestion = { exIdx, ...stepToSuggestion(nextStep) };
      }
    } else if (!isEccentric && found) {
      suggestion = { exIdx, name: `${name} (excentrique 5s)`, notes: 'Descente lente 5s, montée explosive.' };
    } else {
      suggestion = { exIdx, name: null, notes: 'Niveau maximum atteint pour cet exercice.' };
    }
    setExSuggestion(suggestion);
  };

  const handleApplyVariant = (exIdx, variantName) => {
    setSessionExercises((sessionExercises || exercises).map((ex, i) => i === exIdx ? { ...ex, name: variantName } : ex));
    setExSuggestion(null);
  };

  // Minuteur libre — lancé depuis la barre du haut (réutilise le timer flottant du repos)
  const [timerMenuOpen, setTimerMenuOpen] = useState(false);
  const [customTimer, setCustomTimer] = useState('');
  // Épinglage : un bouton minuteur flottant à droite de l'écran, accessible toute
  // la séance (préférence mémorisée localement).
  const [timerPinned, setTimerPinned] = useState(() => {
    try { return localStorage.getItem('timer_pinned') === '1'; } catch { return false; }
  });
  const toggleTimerPinned = () => setTimerPinned((p) => {
    const nv = !p;
    try { localStorage.setItem('timer_pinned', nv ? '1' : '0'); } catch {}
    return nv;
  });
  // Dernière durée de minuteur utilisée → proposée en 3ᵉ raccourci
  const [lastTimer, setLastTimer] = useState(() => {
    try { const v = parseInt(localStorage.getItem('timer_last_used') || '', 10); return Number.isNaN(v) ? null : v; } catch { return null; }
  });
  const fmtTimer = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const startManualTimer = (secs) => {
    if (!secs || secs < 1) return;
    secs = Math.min(3600, Math.max(1, Math.floor(secs)));
    try { localStorage.setItem('timer_last_used', String(secs)); } catch {}
    setLastTimer(secs);
    const endTime = Date.now() + secs * 1000;
    try { localStorage.setItem(`rest_timer_${sessionId}`, JSON.stringify({ endTime, totalSeconds: secs, label: t('se_timer'), mode: 'manual' })); } catch {}
    startTimer(secs, endTime, () => { try { localStorage.removeItem(`rest_timer_${sessionId}`); } catch {} }, (newEndTime) => {
      try { const saved = JSON.parse(localStorage.getItem(`rest_timer_${sessionId}`) || '{}'); localStorage.setItem(`rest_timer_${sessionId}`, JSON.stringify({ ...saved, endTime: newEndTime })); } catch {}
    }, t('se_timer'), 'manual');
    setTimerMenuOpen(false);
    setCustomTimer('');
  };

  // Contenu du menu minuteur — réutilisé par le bouton de la barre du haut ET par
  // le bouton flottant épinglé à droite de l'écran.
  const timerMenu = (
    <>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold text-white/70">{t('se_timer')}</p>
        <button type="button" onClick={toggleTimerPinned} aria-label={t('se_timer_pin')} title={t('se_timer_pin')}
          className={`h-6 w-6 rounded-md flex items-center justify-center transition-colors ${timerPinned ? 'bg-white text-violet-700' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}>
          <Pin className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className={`grid gap-2 ${lastTimer && lastTimer !== 30 && lastTimer !== 60 ? 'grid-cols-3' : 'grid-cols-2'}`}>
        <button onClick={() => startManualTimer(30)} className="py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-bold transition-colors">0:30</button>
        <button onClick={() => startManualTimer(60)} className="py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-bold transition-colors">1:00</button>
        {lastTimer && lastTimer !== 30 && lastTimer !== 60 && (
          <button onClick={() => startManualTimer(lastTimer)} title={t('se_timer_last')}
            className="py-2.5 rounded-lg bg-violet-500/30 hover:bg-violet-500/45 border border-violet-300/30 text-sm font-bold transition-colors">
            {fmtTimer(lastTimer)}
          </button>
        )}
      </div>
      <div className="flex items-stretch gap-2">
        <input type="number" inputMode="numeric" min="1" max="3600" value={customTimer}
          onChange={(e) => {
            const v = e.target.value;
            if (v === '') { setCustomTimer(''); return; }
            const n = Math.min(3600, Math.max(1, parseInt(v, 10) || 0));
            setCustomTimer(String(n));
          }}
          onKeyDown={(e) => { if (e.key === 'Enter') startManualTimer(parseInt(customTimer, 10)); }}
          placeholder={t('se_timer_custom')}
          className="min-w-0 flex-1 h-9 rounded-lg bg-white/10 border border-white/20 text-white text-sm text-center placeholder:text-white/35 focus:outline-none focus:border-white/40 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
        <button onClick={() => startManualTimer(parseInt(customTimer, 10))} disabled={!customTimer}
          className="flex-shrink-0 h-9 px-3 rounded-lg bg-white text-violet-700 text-sm font-bold hover:bg-white/90 transition-colors disabled:opacity-40">OK</button>
      </div>
    </>
  );

  const handleExtendRest = (exIdx, newRestSecs) => {
    const updatedExercises = exercises.map((ex, i) =>
    i === exIdx ? { ...ex, rest_seconds: newRestSecs } : ex
    );
    setSessionExercises(updatedExercises);
    setRestTimeForEx((prev) => ({ ...prev, [exIdx]: newRestSecs }));
    const exerciseName = exercises[exIdx]?.name;
    if (exerciseName) handleApplyToFuture(exerciseName, { rest_seconds: newRestSecs });
  };

  const handleUpdateExercise = (exIdx, updates, opts = {}) => {
    const updatedExercises = exercises.map((ex, i) =>
    i === exIdx ? { ...ex, ...updates } : ex
    );
    setSessionExercises(updatedExercises);
    if (updates.rest_seconds) {
      setRestTimeForEx((prev) => ({ ...prev, [exIdx]: updates.rest_seconds }));
    }
    // Persiste la séance COURANTE en base — sinon le dialog "Modifier" (qui lit la
    // base) afficherait encore les anciennes valeurs.
    if (session?.id) {
      base44.entities.Session.update(session.id, { exercises: updatedExercises })
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ['program-sessions'] });
          queryClient.invalidateQueries({ queryKey: ['session', sessionId] });
        })
        .catch(e => console.error('update session exercises', e));
    }
    // skipFuture : adaptation du JOUR uniquement (ex. +reps pour douleur) — les
    // séances futures restent gérées par le suivi douleur, pas par cette modif.
    const exerciseName = exercises[exIdx]?.name;
    if (exerciseName && !opts.skipFuture) handleApplyToFuture(exerciseName, updates);
  };

  const handleRestTimeSave = (exIdx, newRestSecs) => {
    setRestTimeForEx((prev) => ({ ...prev, [exIdx]: newRestSecs }));
    const updatedExercises = exercises.map((ex, i) =>
    i === exIdx ? { ...ex, rest_seconds: newRestSecs } : ex
    );
    setSessionExercises(updatedExercises);
  };

  const handleApplyToFuture = async (exerciseName, updates) => {
    try {
      const currentDayOfWeek = new Date(session.planned_date).getDay();
      const allSessions = await base44.entities.Session.filter({ program_id: session.program_id });
      const future = allSessions.filter(s =>
        s.status === 'planned' &&
        s.planned_date > new Date().toISOString().split('T')[0] &&
        new Date(s.planned_date).getDay() === currentDayOfWeek
      ).slice(0, 8);
      await Promise.all(future.map(fs => {
        if (!fs.exercises?.length) return Promise.resolve();
        // Correspondance par NOM uniquement : la position locale peut avoir été
        // réordonnée pendant la séance, les séances futures gardent l'ordre planifié.
        const updated = fs.exercises.map((ex) =>
          ex.name === exerciseName ? { ...ex, ...updates } : ex
        );
        return base44.entities.Session.update(fs.id, { exercises: updated });
      }));
    } catch (e) { console.error('applyToFuture error', e); }
  };

  const handleNext = () => {
    if (currentExIdx < exercises.length - 1) {
      setNavDir('next');
      setCurrentExIdx((i) => i + 1);
    } else {
      setShowEnd(true);
    }
  };

  // Conseil IA en temps réel pendant la séance (bouton "Douleur ?")
  const handleAskCoach = async ({ exercise, setIdx, painNote, logs: setLogs, thread = [], allLogs, prevLogs, sessionsHistory: history }) => {
    // Sauvegarder immédiatement en mémoire coach + récupérer l'historique des douleurs passées
    const today = new Date().toISOString().split('T')[0];
    const painEntry = `[${today} — séance en cours] ${exercise.name} série ${setIdx + 1} : "${painNote}"`;
    let coachNotes = '';
    try {
      const existing = await base44.entities.UserMemory.filter({ user_id: user.id });
      if (existing.length > 0) {
        coachNotes = existing[0].coach_notes || '';
        await base44.entities.UserMemory.update(existing[0].id, {
          coach_notes: coachNotes ? `${coachNotes}\n${painEntry}` : painEntry
        });
      } else {
        await base44.entities.UserMemory.create({ user_id: user.id, coach_notes: painEntry });
      }
    } catch {}

    // Zone identifiable → ouvre un épisode de suivi douleur (check à J+1)
    try {
      const zone = detectZoneFromText(painNote);
      if (zone) {
        const eps = await loadEpisodes(user.id);
        await saveEpisodes(user.id, upsertEpisode(eps, zone));
      }
    } catch {}

    // Collecter toutes les douleurs déjà signalées dans cette séance (autres exercices)
    const sessionPainsSoFar = Object.entries(logs)
      .filter(([, l]) => l.pain_note)
      .map(([k, l]) => {
        const [eIdx, sIdx2] = k.split('-').map(Number);
        const exName = exercises[eIdx]?.name || 'exercice';
        return `${exName} série ${sIdx2 + 1} : "${l.pain_note}"`;
      })
      .filter(entry => !entry.includes(`${exercise.name} série ${setIdx + 1}`));

    const sets = Object.entries(setLogs).map(([k, l]) => {
      const sIdx2 = Number(k.split('-')[1]);
      return `Série ${sIdx2 + 1} : ${l.weight ? `${l.weight} kg` : '?'} × ${l.reps || '?'} reps, RIR ${l.mode || '?'}, qualité ${l.quality || '?'}`;
    }).join('\n');

    // Résumé des autres exercices déjà faits dans cette séance
    const otherExercisesCtx = (() => {
      if (!allLogs || !exercises) return '';
      const done = {};
      for (const [key, l] of Object.entries(allLogs)) {
        const [eIdx] = key.split('-').map(Number);
        if (eIdx === (exercise._sessionIdx ?? -1)) continue;
        const exName = exercises[eIdx]?.name;
        if (!exName) continue;
        if (!done[exName]) done[exName] = [];
        if (l.weight || l.reps) done[exName].push(`${l.weight || '?'}kg×${l.reps || '?'}`);
      }
      const lines = Object.entries(done).map(([name, s]) => `${name} : ${s.join(', ')}`);
      return lines.length > 0 ? `\nAutres exercices cette séance :\n${lines.join('\n')}` : '';
    })();

    const prevSessionCtx = history ? `\nHistorique des séances précédentes :\n${history}` : '';
    const memoryCtx = coachNotes ? `\nMémoire coach (douleurs et notes passées) :\n${coachNotes}` : '';

    const priorPainCtx = sessionPainsSoFar.length > 0
      ? `\nDouleurs déjà signalées cette séance :\n${sessionPainsSoFar.map(e => `• ${e}`).join('\n')}\n`
      : '';

    const userEquipment = Array.isArray(user?.equipment)
      ? user.equipment
      : (() => { try { return JSON.parse(user?.equipment || '[]'); } catch { return []; } })();
    const userLevel = user?.level || 'intermediate';
    const alternatives = EXERCISES.filter(e =>
      e.name !== exercise.name &&
      e.muscles?.primary?.includes(exercise.muscle_group) &&
      e.level?.includes(userLevel) &&
      e.equipmentOptions?.some(opt => opt.every(item => userEquipment.includes(item)))
    ).map(e => e.name);
    const altCtx = alternatives.length > 0
      ? `\nAlternatives disponibles (même muscle, équipement compatible) : ${alternatives.join(', ')}`
      : '';

    const threadCtx = thread.length > 1
      ? `\nHistorique :\n${thread.slice(0, -1).map(m => `${m.role === 'user' ? 'Utilisateur' : 'Coach'}: ${m.text}`).join('\n')}\n`
      : '';

    const prompt = `Tu es un coach sportif expérimenté. L'utilisateur est en pause entre les séries et te décrit ce qu'il ressent. Réponds en MAX 2 phrases directement actionnables. Raisonne selon la nature exacte de la douleur — pas de règle rigide. Si l'historique montre que ton conseil précédent n'a pas aidé, propose autre chose. Pas d'introduction ni de répétition du nom de l'exercice.

Exercice : ${exercise.name} (${exercise.muscle_group || ''})${altCtx}${memoryCtx}${priorPainCtx}${otherExercisesCtx}${prevSessionCtx}${threadCtx}
Logs de l'exercice en cours :
${sets}

Ce que l'utilisateur dit : "${painNote}"`;

    // Flux douleur = 100 % règles de code, PAR CHOIX (pas seulement AI_BLOCKED) :
    // réponse instantanée, hors-ligne, prévisible. Même API réactivée, on ne
    // rappelle pas le LLM ici — il reste pour le chat Coach et la génération.
    // (le `prompt` construit ci-dessus est conservé : contexte prêt si un jour
    // on veut donner la main à l'IA sur ce flux)
    void prompt;
    const reply = buildPainAdvice(painNote, lang);
    // Mémoriser le conseil donné : le coach doit savoir ce qu'il a déjà répondu
    // (cohérence des futures conversations et du suivi)
    try {
      const rows = await base44.entities.UserMemory.filter({ user_id: user.id });
      if (rows.length > 0) {
        const prev = rows[0].coach_notes || '';
        await base44.entities.UserMemory.update(rows[0].id, {
          coach_notes: `${prev}\n[${today}] Conseil donné (${exercise.name}) : ${reply}`
        });
      }
    } catch {}
    return reply;
  };

  // Génère les propositions d'adaptation basées sur les logs + fatigue + notes
  const generateProposal = () => {
    const perEx = {};
    const setPainNotes = [];
    for (const [key, log] of Object.entries(logs)) {
      const [exIdx] = key.split('-').map(Number);
      const ex = exercises[exIdx];
      if (!ex) continue;
      if (!perEx[ex.name]) perEx[ex.name] = { weights: [], modes: [], qualities: [], painNotes: [], name: ex.name };
      if (log.weight) perEx[ex.name].weights.push(log.weight);
      if (log.mode) perEx[ex.name].modes.push(log.mode);
      if (log.quality) perEx[ex.name].qualities.push(log.quality);
      if (log.pain_note) { perEx[ex.name].painNotes.push(log.pain_note); setPainNotes.push({ exercise: ex.name, note: log.pain_note }); }
    }
    const noteText = (notes || '').toLowerCase();
    const notePain = /douleur|mal\b|gêne|pincement|blessure|douloureux|coude|épaule|genou|dos|poignet|cervical/.test(noteText) || setPainNotes.length > 0;
    const noteEasy = /trop facile|trop léger|pas assez/.test(noteText);
    const noteHard = /trop dur|très dur|épuisant/.test(noteText);

    // Détection du temps disponible pour suggérer une série en plus
    const dayName = session?.planned_date ? new Date(session.planned_date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() : null;
    const availDuration = user?.duration_per_day?.[dayName] || 0;
    const hasExtraTime = availDuration > 0 && session?.estimated_duration && session.estimated_duration < availDuration - 10;

    const RIR_SCORE = { failure: -1, RIR_0: 0, RIR_1: 1, RIR_2: 2, 'RIR_3+': 3 };
    const props = [];

    // Avertissement général si douleur détectée
    if (notePain) {
      const painZone = noteText.match(/coude|épaule|genou|dos|poignet|cervical/)?.[0];
      props.push({
        exercise: 'Douleur signalée',
        newWeight: null,
        reason: painZone
          ? `Au ${painZone} — adapte les exercices concernés à la prochaine séance.`
          : 'Surveille et adapte la charge sur les exercices concernés à la prochaine séance.',
        type: 'warn',
        general: true,
      });
    }

    for (const ex of Object.values(perEx)) {
      if (!ex.weights.length) continue;
      const avgW = Math.round(ex.weights.reduce((a, b) => a + b, 0) / ex.weights.length * 10) / 10;
      const avgRIR = ex.modes.length ? ex.modes.reduce((a, m) => a + (RIR_SCORE[m] ?? 2), 0) / ex.modes.length : 2;
      const qualityOk = ex.qualities.length === 0 || ex.qualities.filter(q => q === 'good').length / ex.qualities.length > 0.6;
      const qualityBad = ex.qualities.filter(q => q === 'bad').length > 0;
      const exHasPain = ex.painNotes.length > 0;
      const canProgress = (noteEasy || avgRIR >= 2) && qualityOk;

      if (qualityBad || fatigue >= 5) {
        // Qualité dégradée ou fatigue extrême → réduire
        props.push({ exercise: ex.name, newWeight: Math.round(avgW * 0.92 * 2) / 2, reason: fatigue >= 5 ? 'fatigue maximale — réduis la charge' : 'qualité dégradée — consolide avant d\'augmenter', type: 'reduce' });
      } else if (exHasPain && canProgress) {
        // Douleur sur cet exercice ET bon RIR → conflit : ne pas augmenter la charge, suggérer alternatives
        const extras = hasExtraTime ? ' ou ajoute une série si tu as le temps' : '';
        props.push({ exercise: ex.name, newWeight: null, reason: `préfère augmenter les reps ou réduire le temps de repos${extras}`, type: 'adapt' });
      } else if (exHasPain) {
        // Douleur + difficulté → réduire légèrement
        props.push({ exercise: ex.name, newWeight: Math.round(avgW * 0.9 * 2) / 2, reason: 'douleur signalée — réduis légèrement la charge à la prochaine séance', type: 'reduce' });
      } else if (fatigue >= 4) {
        props.push({ exercise: ex.name, newWeight: null, reason: 'fatigue élevée — maintien conseillé', type: 'maintain' });
      } else if (canProgress && !notePain) {
        // Bonne séance, pas de douleur → progression possible
        const inc = avgW >= 60 ? 2.5 : avgW >= 20 ? 1.25 : 1;
        const newW = Math.round((avgW + inc) * 2) / 2;
        const extras = hasExtraTime ? ' ou ajoute une série' : '';
        props.push({ exercise: ex.name, newWeight: newW, reason: `peut augmenter la charge prudemment (+${inc}kg)${extras}`, type: 'increase' });
      } else if (canProgress && notePain) {
        // Bon RIR mais douleur générale (pas sur cet exercice) → suggestion douce
        const extras = hasExtraTime ? ' ou ajoute une série si tu as le temps' : '';
        props.push({ exercise: ex.name, newWeight: null, reason: `peut augmenter les reps ou réduire le temps de repos${extras}`, type: 'adapt' });
      } else if (noteHard) {
        props.push({ exercise: ex.name, newWeight: Math.round(avgW * 0.95 * 2) / 2, reason: 'séance difficile — réduis légèrement', type: 'reduce' });
      }
    }
    return props.filter(p => p.type !== 'maintain' || props.length <= 2);
  };

  const saveSession = async (acceptProposal = false) => {
    // Hors-ligne : on met la finalisation en file d'attente (payload autonome) et
    // on la synchronisera automatiquement au retour du réseau. Les fonctions en
    // ligne (propositions de volume, mémoire douleur) sont sautées — elles
    // nécessitent des lectures serveur ; l'essentiel (séries + séance) est sauf.
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      try {
        const payloadLogs = Object.entries(logs).map(([key, log]) => {
          const [exIdx, setIdx] = key.split('-').map(Number);
          const exercise = exercises[exIdx];
          if (!exercise) return null;
          return {
            exercise_name: exercise.name,
            exercise_variant: exercise.name,
            set_number: setIdx + 1,
            weight: log.weight || 0,
            reps_done: log.reps || 0,
            reps_target: exercise.target_reps || '',
            rest_seconds: restTimeForEx[exIdx] || exercise.rest_seconds || 90,
            mode: log.mode || 'RIR_2',
            execution_quality: log.quality || 'good',
            feedback: log.feedback || null,
            tempo: log.tempo || null,
          };
        }).filter(Boolean);
        enqueue('session_complete', {
          sessionId: session.id,
          userId: user.id,
          logs: payloadLogs,
          fatigue,
          notes,
          actual_date: new Date().toISOString().split('T')[0],
          actual_duration: session.estimated_duration,
        });
        // Les données sont désormais dans l'outbox → on peut nettoyer le brouillon.
        try { localStorage.removeItem(`session_draft_${sessionId}`); localStorage.removeItem('active_session_id'); localStorage.removeItem(`session_scroll_${sessionId}`); } catch {}
        toast.success(t('se_offline_saved'));
        navigate('/program');
      } catch (e) {
        console.error('saveSession offline error:', e);
        toast.error(`Erreur lors de la sauvegarde : ${e?.message || e}`);
      }
      return;
    }

    setSaving(true);
    try {

    // Appliquer les propositions aux prochaines séances si acceptées
    if (acceptProposal && proposal?.length) {
      const allSessions = await base44.entities.Session.filter({ program_id: session.program_id });
      const future = allSessions
        .filter(s => s.status === 'planned' && s.planned_date > new Date().toISOString().split('T')[0])
        .sort((a, b) => new Date(a.planned_date) - new Date(b.planned_date))
        .slice(0, 5);
      await Promise.all(future.map(fs => {
        if (!fs.exercises?.length) return Promise.resolve();
        const updated = fs.exercises.map(ex => {
          const p = proposal.find(p => p.exercise === ex.name);
          return p ? { ...ex, target_weight: p.newWeight } : ex;
        });
        return base44.entities.Session.update(fs.id, { exercises: updated });
      }));
    }

    // Supprimer d'éventuels logs auto-sauvegardés pour éviter les doublons
    try {
      const existingLogs = await base44.entities.SeriesLog.filter({ session_id: session.id });
      await Promise.all(existingLogs.map(l => base44.entities.SeriesLog.delete(l.id)));
    } catch {}

    await Promise.all(Object.entries(logs).map(([key, log]) => {
      const [exIdx, setIdx] = key.split('-').map(Number);
      const exercise = exercises[exIdx];
      if (!exercise) return Promise.resolve();
      return base44.entities.SeriesLog.create({
        session_id: session.id,
        user_id: user.id,
        exercise_name: exercise.name,
        exercise_variant: exercise.name,
        set_number: setIdx + 1,
        weight: log.weight || 0,
        reps_done: log.reps || 0,
        reps_target: exercise.target_reps || '',
        rest_seconds: restTimeForEx[exIdx] || exercise.rest_seconds || 90,
        mode: log.mode || 'RIR_2',
        execution_quality: log.quality || 'good',
        feedback: log.feedback || null,
        tempo: log.tempo || null
      });
    }));

    await base44.entities.Session.update(session.id, {
      status: 'completed',
      actual_date: new Date().toISOString().split('T')[0],
      actual_duration: session.estimated_duration,
      global_fatigue: fatigue,
      notes
    });
    // Si douleur signalée → mémoriser pour le coach IA
    const noteText = (notes || '').toLowerCase();
    const painZone = noteText.match(/coude|épaule|genou|dos|poignet|cervical/)?.[0];
    const setPainEntries = Object.entries(logs).filter(([, l]) => l.pain_note).map(([key, l]) => {
      const [exIdx] = key.split('-').map(Number);
      return `${exercises[exIdx]?.name || 'exercice'} série ${Number(key.split('-')[1]) + 1} : ${l.pain_note}`;
    });
    const hasPain = /douleur|mal\b|gêne|pincement|blessure/.test(noteText) || painZone || setPainEntries.length > 0;
    if (hasPain && user?.id) {
      try {
        const today = new Date().toISOString().split('T')[0];
        const painDetail = setPainEntries.length > 0 ? `\n  ${setPainEntries.join('\n  ')}` : '';
        const painNote = `[${today}] Douleur signalée${painZone ? ` (${painZone})` : ''}${painDetail} — réduire charges sur exercices concernés, surveiller évolution.`;
        const existing = await base44.entities.UserMemory.filter({ user_id: user.id });
        if (existing.length > 0) {
          const prev = existing[0].coach_notes || '';
          await base44.entities.UserMemory.update(existing[0].id, {
            coach_notes: prev ? `${prev}\n${painNote}` : painNote
          });
        } else {
          await base44.entities.UserMemory.create({ user_id: user.id, coach_notes: painNote });
        }
      } catch {}
      // Ouvre un épisode de suivi par zone détectée (notes de séance + douleurs par série)
      try {
        const zones = new Set();
        const zNotes = detectZoneFromText(noteText);
        if (zNotes) zones.add(zNotes);
        setPainEntries.forEach(t => { const z = detectZoneFromText(t); if (z) zones.add(z); });
        if (zones.size) {
          let eps = await loadEpisodes(user.id);
          zones.forEach(z => { eps = upsertEpisode(eps, z); });
          await saveEpisodes(user.id, eps);
        }
      } catch {}
    }

    queryClient.invalidateQueries({ queryKey: ['sessions'] });
    queryClient.invalidateQueries({ queryKey: ['program-sessions'] });
    // Library reste montée en permanence (carrousel) → sans invalidation, ses
    // "séances complétées" ne se rafraîchiraient qu'au rechargement de l'app.
    queryClient.invalidateQueries({ queryKey: ['completed-sessions'] });

    // Mémorise l'ordre RÉELLEMENT pratiqué s'il diffère de l'ordre planifié →
    // rappelé à la prochaine séance du même créneau. Repris à l'identique = oubli.
    try {
      const plannedOrder = plannedOrderRef.current || (session.exercises || []).filter(e => e && e.name).map(e => e.name);
      const doneOrder = exercises.map(e => e.name);
      const orderKey = `last_order_${session.program_id}_${(session.day_label || '').trim().toLowerCase()}`;
      // Même ensemble d'exercices mais ordre différent → on mémorise l'ordre pratiqué
      const sameSet = plannedOrder.length === doneOrder.length
        && plannedOrder.slice().sort().join('|') === doneOrder.slice().sort().join('|');
      if (sameSet && plannedOrder.join('|') !== doneOrder.join('|')) {
        localStorage.setItem(orderKey, JSON.stringify({ names: doneOrder }));
      } else {
        localStorage.removeItem(orderKey);
      }
    } catch {}
    try { localStorage.removeItem(`session_draft_${sessionId}`); localStorage.removeItem('active_session_id'); localStorage.removeItem(`session_scroll_${sessionId}`); } catch {}

    // Si douleur → afficher notification coach avant de naviguer
    if (hasPain) {
      const painCtx = setPainEntries.length > 0
        ? `\n\nDétail des douleurs signalées :\n${setPainEntries.map(e => `• ${e}`).join('\n')}`
        : '';
      setCoachPainQuery({
        zone: painZone,
        preMessage: `J'ai noté une douleur${painZone ? ` au ${painZone}` : ''} pendant ta séance.${painCtx}\n\nPour mieux adapter tes prochains entraînements, dis-moi en plus : comment ça s'est manifesté (gêne légère, vraie douleur, coup) ? Depuis quand ? Ça dure encore maintenant ?`
      });
    } else {
      // Autorégulation du volume : proposer un ajustement (fatigue/perfs fraîches) avant de revenir
      try {
        const [progSessions, recentLogs, progs] = await Promise.all([
          base44.entities.Session.filter({ program_id: session.program_id }),
          base44.entities.SeriesLog.filter({ user_id: user.id }, '-created_date', 120),
          base44.entities.Program.filter({ status: 'active' }, '-created_date', 1),
        ]);
        const program = progs?.[0] || null;
        let proposal = (program && !isVolumeSuppressed(program.id))
          ? computeVolumeProposal({ sessions: progSessions, program, user, seriesLogs: recentLogs, lang })
          : null;
        // Pas d'AUGMENTATION de volume pendant un épisode de douleur en cours
        // (contradictoire avec les réductions du suivi) — les baisses restent ok.
        if (proposal?.direction === 'increase') {
          const eps = await loadEpisodes(user.id);
          if (eps.some(e => e.status === 'active' || e.status === 'stop_advised')) proposal = null;
        }
        if (proposal) { setVolumeProposal({ proposal, programId: program.id }); return; }
      } catch (e) { console.error('[volume] end-of-session', e); }
      navigate('/program');
    }
    } catch (e) {
      console.error('saveSession error:', e);
      toast.error(`Erreur lors de la sauvegarde : ${e?.message || e}`);
    } finally {
      setSaving(false);
    }
  };

  // États vides — conteneur fixe centré (SessionLog est rendu hors carrousel, un div
  // en flux normal passerait sous la ligne de flottaison et resterait invisible).
  const EmptyState = ({ title, text, cta }) => (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 5,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'calc(6rem + env(safe-area-inset-bottom))',
    }}>
      <div className="text-center space-y-4 max-w-xs">
        <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <Dumbbell className="w-8 h-8 text-white/70" />
        </div>
        <div className="space-y-1">
          <p className="text-white font-bold text-lg">{title}</p>
          <p className="text-white/60 text-sm">{text}</p>
        </div>
        <button onClick={() => navigate('/program')}
          className="w-full py-3 rounded-xl text-sm font-bold text-violet-700 bg-white hover:bg-white/90 shadow transition-all active:scale-[0.98]">
          {cta}
        </button>
      </div>
    </div>
  );

  if (!session) {
    return hasProgram
      ? <EmptyState title="Aucune séance en cours" text="Choisis une séance dans ton programme pour commencer." cta="Voir mon programme" />
      : <EmptyState title="Pas encore de programme" text="Crée ou importe ton programme pour générer tes séances." cta="Créer ou importer" />;
  }

  if (exercises.length === 0) {
    return <EmptyState title="Séance vide" text="Cette séance ne contient aucun exercice." cta="Voir mon programme" />;
  }

  // Étape "fin de séance" : proposition d'ajustement du volume avant de revenir au programme
  if (volumeProposal) {
    const pid = volumeProposal.programId;
    const goProgram = () => { setVolumeProposal(null); navigate('/program'); };
    const onApply = async () => {
      setVolumeBusy(true);
      try { await applyVolumeProposal(pid, volumeProposal.proposal.apply); } catch (e) { console.error('[volume] apply', e); }
      markVolumeHandled(pid); setVolumeBusy(false); navigate('/program');
    };
    const onManual  = () => { markVolumeHandled(pid); navigate('/program?edit=true'); };
    const onDismiss = () => { markVolumeHandled(pid); navigate('/program'); };
    return (
      <div className="fixed inset-0 z-10 overflow-y-auto bg-violet-600 px-4 py-10" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 2.5rem)' }}>
        <div className="w-full max-w-md mx-auto space-y-5">
          <div>
            <h2 className="font-heading font-bold text-2xl text-white">Séance validée ✅</h2>
            <p className="text-white/60 text-sm mt-1">Un ajustement de volume est conseillé pour la suite :</p>
          </div>
          <VolumeProposalCard proposal={volumeProposal.proposal} busy={volumeBusy} onApply={onApply} onManual={onManual} onDismiss={onDismiss} />
          <button onClick={goProgram} className="w-full text-center text-sm text-white/50 hover:text-white/80 transition-colors pt-1">
            Continuer sans changer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={scrollRootRef}
      style={{
        // Conteneur = rect EXACT du visualViewport (top/height pilotés en direct
        // dans le DOM par le handler vv = zéro retard). Couvre pile la zone
        // visible, le clavier se pose juste en dessous → aucune bande violette.
        position: 'fixed',
        top: 0,            // valeur initiale, écrasée en direct par le handler
        left: 0,
        right: 0,
        height: '100dvh',  // valeur initiale, écrasée en direct par le handler
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        overscrollBehavior: 'contain',
        // Encoche en haut (position:fixed ignore le padding du body).
        // Bas : place de la nav (clavier ouvert → conteneur = zone visible, pas besoin)
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: kbOpen ? 0 : navHeight,
        zIndex: 5,
        opacity: scrollReady ? 1 : 0,
        transition: 'opacity 0.2s ease',
      }}>
      <div className="space-y-4 max-w-2xl mx-auto p-4 md:p-8">
      {/* Top bar */}
      <div className="space-y-2">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white">{(session.day_label || t('nav_session')).replace(/\s*§\d+/g, '').replace(/^(week|semaine)\s*\d+\s*[-–:·]?\s*/i, '').replace(/\bmonday\b/gi, 'Lundi').replace(/\btuesday\b/gi, 'Mardi').replace(/\bwednesday\b/gi, 'Mercredi').replace(/\bthursday\b/gi, 'Jeudi').replace(/\bfriday\b/gi, 'Vendredi').replace(/\bsaturday\b/gi, 'Samedi').replace(/\bsunday\b/gi, 'Dimanche')}</h1>
          <p className="text-white/70 text-sm">{exercises.length} {t('se_exercises')}</p>
        </div>
        {!showEnd && (
          <div className="flex items-center gap-2">
            {/* Minuteur libre — réutilise le chrono flottant du repos */}
            <Popover open={timerMenuOpen} onOpenChange={setTimerMenuOpen}>
              <PopoverTrigger asChild>
                <button type="button" aria-label={t('se_timer')}
                  className="flex items-center justify-center h-9 w-9 rounded-md border border-white/30 text-white hover:bg-white/10 transition-colors">
                  <Timer className="w-4 h-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" sideOffset={6} className="w-52 max-w-[calc(100vw-1.5rem)] p-3 space-y-2.5 bg-violet-950 border border-white/25 text-white shadow-2xl z-[200]">
                {timerMenu}
              </PopoverContent>
            </Popover>
            <Button variant="outline" size="sm" onClick={() => setShowOverview((v) => !v)}
              className="border-white/30 text-white hover:bg-white/10 hover:text-white">
              <LayoutList className="w-4 h-4 mr-1" />
              {showOverview ? t('se_focus_view') : t('se_overview')}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowQuitConfirm(true)}
              className="text-white/50 hover:text-white hover:bg-white/10">
              {t('se_quit')}
            </Button>
          </div>
        )}
      </div>

      {/* Bouton minuteur ÉPINGLÉ — flottant à droite de l'écran, accessible toute
          la séance. Portal → réellement fixé au viewport (le conteneur scrolle). */}
      {timerPinned && !showEnd && createPortal(
        <Popover>
          <PopoverTrigger asChild>
            <button type="button" aria-label={t('se_timer')}
              className="fixed right-0 top-1/2 -translate-y-1/2 z-40 h-48 w-7 flex items-center justify-center text-white shadow-lg shadow-violet-950/50"
              style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
                clipPath: 'polygon(12px 0, 100% 0, 100% 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)',
              }}>
              <Timer className="w-4 h-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="center" side="left" sideOffset={10} className="w-52 max-w-[calc(100vw-1.5rem)] p-3 space-y-2.5 bg-violet-950 border border-white/25 text-white shadow-2xl z-[200]">
            {timerMenu}
          </PopoverContent>
        </Popover>,
        document.body
      )}

      {/* Ordre pratiqué la dernière fois (si différent du planifié) */}
      {orderHint && !showEnd && (
        <div className="rounded-2xl p-3 bg-white/10 border border-white/15 flex items-start gap-2.5">
          <ListOrdered className="w-4 h-4 text-violet-300 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0 text-xs text-white/80 leading-relaxed">
            <span className="font-semibold text-white">{t('se_order_last')} </span>
            {orderHint.map((n, i) => `${i + 1}. ${n}`).join(' · ')}
          </div>
          <button onClick={() => setOrderHint(null)} className="text-white/30 hover:text-white/60 flex-shrink-0" aria-label="Fermer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Cycle : rappel ovulation (échauffement + technique) en tête de séance */}
      {cycleTip && !showEnd && (
        <div className="relative rounded-2xl p-4 border bg-white/15 backdrop-blur-sm border-white/20 mb-4">
          <div className="flex items-start gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0 text-lg">{cycleTip.emoji}</div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white">{cycleTip.name?.[lang] ?? cycleTip.name?.fr}</p>
              <p className="text-xs text-white/70 mt-1 leading-relaxed">{cycleTip.advice?.[lang] ?? cycleTip.advice?.fr}</p>
            </div>
            <button onClick={dismissCycleTip} className="ml-auto text-white/30 hover:text-white/60 flex-shrink-0" aria-label="Fermer">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Suivi douleur : réaction de la zone depuis la dernière séance */}
      {painCheckEp && !showEnd && (
        <PainCheckCard
          episode={painCheckEp}
          proposal={painProposal}
          busy={painBusy}
          onReaction={handlePainReaction}
          onApply={handlePainApply}
          onManual={handlePainManual}
          onDismiss={handlePainDismiss}
        />
      )}

      {/* Quit confirm */}
      {showQuitConfirm && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm rounded-2xl p-6 text-center space-y-4" style={{ background: 'linear-gradient(160deg, #2e1065, #1e0050)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <p className="font-bold text-white text-lg">{t('se_quit_title')}</p>
            <p className="text-white/60 text-sm">{t('se_quit_sub')}</p>
            <div className="flex gap-3">
              <button onClick={() => setShowQuitConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-white/20 text-white/70 text-sm font-semibold hover:bg-white/10">
                {t('se_continue')}
              </button>
              <button onClick={() => { try { localStorage.removeItem('active_session_id'); } catch {} navigate('/'); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
                {t('se_quit')}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Réordonner : réservé au-dessus de Starter (poignée visible pour tous) */}
      {reorderUpsell && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4" onClick={() => setReorderUpsell(false)}>
          <div className="w-full max-w-sm rounded-2xl p-6 text-center space-y-4" style={{ background: 'linear-gradient(160deg, #2e1065, #1e0050)', border: '1px solid rgba(255,255,255,0.15)' }} onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-violet-500/30 flex items-center justify-center mx-auto">
              <GripVertical className="w-6 h-6 text-violet-300" />
            </div>
            <div>
              <p className="font-bold text-white text-lg">{t('se_reorder_title')}</p>
              <p className="text-white/60 text-sm mt-1">{t('se_reorder_body')}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setReorderUpsell(false)}
                className="flex-1 py-2.5 rounded-xl border border-white/20 text-white/70 text-sm font-semibold hover:bg-white/10">
                {t('se_reorder_later')}
              </button>
              <button onClick={() => { setReorderUpsell(false); navigate('/pricing'); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
                {t('se_reorder_offers')}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Content */}
      <AnimatePresence mode="wait">
        {showEnd ?
        <motion.div key="end" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <EndPanel
            exercises={exercises}
            logs={logs}
            updateLog={updateLog}
            fatigue={fatigue}
            setFatigue={setFatigue}
            notes={notes}
            setNotes={setNotes}
            onSave={saveSession}
            saving={saving}
            proposal={proposal}
            setProposal={setProposal}
            generateProposal={generateProposal}
            coachPainQuery={coachPainQuery}
            onDismissPain={() => navigate('/program')}
            fragileZones={fragileZones} />
          
          </motion.div> :
        showOverview ?
        <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <OverviewPanel
            exercises={exercises}
            logs={logs}
            updateLog={updateLog}
            onClose={() => setShowOverview(false)}
            fragileZones={fragileZones}
            onReorder={applyReorder}
            canReorder={canReorder}
            onUpsellReorder={() => setReorderUpsell(true)} />

            <div className="mt-4">
              <Button className="w-full" onClick={() => {setShowOverview(false);setShowEnd(true);}}>
                <CheckCircle className="w-4 h-4 mr-2" /> {t('se_finish_session')}
              </Button>
            </div>
          </motion.div> :

        <ExerciseFocusCard
          key={currentExIdx}
          exercise={exercises[currentExIdx]}
          originalExercise={session.exercises[currentExIdx]}
          exIdx={currentExIdx}
          logs={logs}
          updateLog={updateLog}
          openAtLastSet={navDir === 'prev'}
          totalExercises={exercises.length}
          onNext={handleNext}
          onPrev={() => { setNavDir('prev'); setCurrentExIdx((i) => Math.max(0, i - 1)); }}
          onStartRest={(secs, onDone) => {
            const endTime = Date.now() + secs * 1000;
            try { localStorage.setItem(`rest_timer_${sessionId}`, JSON.stringify({ endTime, totalSeconds: secs })); } catch {}
            startTimer(secs, endTime, () => {
              try { localStorage.removeItem(`rest_timer_${sessionId}`); } catch {}
              onDone?.();
            }, (newEndTime) => {
              // Persiste le nouvel endTime quand l'user scrub ou édite
              try {
                const saved = JSON.parse(localStorage.getItem(`rest_timer_${sessionId}`) || '{}');
                localStorage.setItem(`rest_timer_${sessionId}`, JSON.stringify({ ...saved, endTime: newEndTime }));
              } catch {}
            }, t('se_rest_label'));
          }}
          isLast={currentExIdx === exercises.length - 1}
          rirContext={rirContext}
          onRegressionRequest={handleRegressionRequest}
          onProgressionRequest={handleProgressionRequest}
          suggestion={exSuggestion?.exIdx === currentExIdx ? exSuggestion : null}
          onClearSuggestion={() => setExSuggestion(null)}
          onApplyVariant={handleApplyVariant}
          onExtendRest={handleExtendRest}
          onApplyToFuture={handleApplyToFuture}
          currentRestSeconds={exercises[currentExIdx]?.rest_seconds}
          nextExRestSeconds={exercises[currentExIdx + 1]?.rest_seconds}
          onRestTimeSave={handleRestTimeSave}
          editingObjectif={editingObjectif}
          setEditingObjectif={setEditingObjectif}
          onUpdateExercise={handleUpdateExercise}
          isImported={isImportedProgram}
          previousLogs={previousLogs}
          propagateWeight={propagateWeight}
          forcePropagateWeight={forcePropagateWeight}
          fragileZones={fragileZones}
          sessionsHistory={sessionsHistory}
          onAskCoach={handleAskCoach} />

        }
      </AnimatePresence>
      </div>
    </div>);

}