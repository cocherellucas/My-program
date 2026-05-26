import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useRestTimer } from '@/lib/RestTimerContext';
import { base44 } from '@/api/base44Client';
import { normalizeUser } from '@/lib/utils';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Loader2, LayoutList, ChevronRight, ChevronLeft, Timer, Eye, HelpCircle, TrendingDown, TrendingUp, Bot, MessageSquare, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import SetRow from '@/components/session/SetRow';
import ExerciseGif from '@/components/session/ExerciseGif';
import { RestTimerControl } from '@/components/session/RestTimer';
import { computeTargetRIR, ririLabel, computeAdaptedRestTime } from '@/lib/rir-optimizer';
import { buildProgressionContext, isAtChainBottom } from '@/lib/progression-chains';
import { FRAGILE_ZONE_MUSCLES } from '@/lib/coaching-engine';
import { EXERCISES } from '@/lib/exercise-database';

const isBodyweightExercise = (name) => {
  const ex = EXERCISES.find(e => e.name?.toLowerCase() === name?.toLowerCase());
  return ex ? ex.equipmentOptions?.every(opt => opt.length === 0) : false;
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
function ExerciseFocusCard({ exercise, originalExercise, exIdx, logs, updateLog, propagateWeight, forcePropagateWeight, totalExercises, onNext, onPrev, onStartRest, isLast, rirContext, onRegressionRequest, onProgressionRequest, regressingEx, onExtendRest, currentRestSeconds, nextExRestSeconds, onRestTimeSave, editingObjectif, setEditingObjectif, onUpdateExercise, previousLogs, fragileZones, onApplyToFuture, onAskCoach }) {
  const sets = Math.max(1, exercise.sets || 3);
  const [editSets, setEditSets] = useState(Math.max(1, originalExercise?.sets || 3));
  const [editReps, setEditReps] = useState(originalExercise?.target_reps || '');
  const [editRest, setEditRest] = useState(currentRestSeconds ?? originalExercise?.rest_seconds ?? 90);

  useEffect(() => {
    setEditRest(currentRestSeconds ?? originalExercise?.rest_seconds ?? 90);
  }, [currentRestSeconds]);

  const [completedSets, setCompletedSets] = useState(() => {
    const done = new Set();
    for (let i = 0; i < sets; i++) {
      if (logs[`${exIdx}-${i}`]?.reps) done.add(i);
    }
    return done;
  });
  const [activeSetIdx, setActiveSetIdx] = useState(() => {
    for (let i = 0; i < sets; i++) {
      if (!logs[`${exIdx}-${i}`]?.reps) return i;
    }
    return Math.max(0, sets - 1);
  });
  const [ackedGoodSeries, setAckedGoodSeries] = useState(0);

  const markSetComplete = (idx) => setCompletedSets(prev => new Set([...prev, idx]));
  const isSetDone = (idx) => completedSets.has(idx);
  const allSetsDone = Array.from({ length: sets }, (_, i) => i).every(isSetDone);

  // Calcul objectifs dépassés (hors motion.div pour fixed positioning)
  const goodAboveSeries = (() => {
    const targetRepsStr = exercise.target_reps || '';
    const parts = targetRepsStr.split('-');
    const targetLow = parseInt(parts[0]) || 0;
    const targetHigh = parseInt(parts[1]) || targetLow;
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

  const handleSetDone = (setIdx) => {
    const key = `${exIdx}-${setIdx}`;
    const lastLog    = logs[key];
    const mode       = lastLog?.mode || 'RIR_2';
    const isLastSet  = setIdx === sets - 1;
    const baseRest   = isLastSet && nextExRestSeconds ? nextExRestSeconds : (currentRestSeconds ?? exercise.rest_seconds ?? 90);
    const isBodyweight = !lastLog?.weight || lastLog?.weight === 0;
    const isIsometric  = /planche|gainage|isométr/i.test(exercise.name || '');

    markSetComplete(setIdx);
    onStartRest(baseRest, () => {
      if (setIdx < sets - 1) setActiveSetIdx(setIdx + 1);
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
        <span className="font-medium">Exercice {exIdx + 1} / {totalExercises}</span>
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
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">OBJECTIF</span>
              <div className="flex items-center gap-1">
                {(() => {
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
                  {editingObjectif ? 'Valider' : 'Modifier'}
                </Button>
              </div>
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
            </div>
            <div className="grid grid-cols-3 gap-2 p-3 bg-gradient-to-r from-white/20 to-white/10 rounded-lg border border-white/40 overflow-hidden">
              <div className="text-center py-3 bg-white/10 rounded-md border border-white/30 min-w-0">
                <span className="text-white/80 text-[11px] block font-bold uppercase tracking-wide">Séries</span>
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
                <span className="text-white/80 text-[11px] block font-bold uppercase tracking-wide">Reps</span>
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
                <span className="text-white/80 text-[11px] block font-bold uppercase tracking-wide">Repos</span>
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
                return <>{sets > 1 && <>{`Premières séries : ${rangeStr}`}<br /></>}Dernière série à l'échec si ce n'est pas dangereux</>;
              })() : (logs[`${exIdx}-0`]?.quality || 'good') !== 'bad' && <>RIR 0 sur la dernière série si ce n'est pas dangereux</>}
            </p>
          )}
        </div>
      </Card>

      {/* Échauffement — premier exercice uniquement */}
      {exIdx === 0 && <WarmupAccordion exercise={exercise} logs={logs} exIdx={exIdx} sets={sets} />}

      {/* Progression/Regression suggestion banners */}
      {(() => {
        const sets = Math.max(1, exercise.sets || 3);
        const targetRepsStr = exercise.target_reps || '';
        const parts = targetRepsStr.split('-');
        const targetLow = parseInt(parts[0]) || 0;
        const targetHigh = parseInt(parts[1]) || targetLow;
        let badSeries = 0;
        let goodAboveSeries = 0;
        let filledSeries = 0;
        for (let s = 0; s < sets; s++) {
          const l = logs[`${exIdx}-${s}`] || {};
          const reps = parseInt(l.reps) || 0;
          const quality = l.quality || 'good';
          if (reps > 0) filledSeries++;
          if (reps > 0 && reps < targetLow) badSeries++;
          if (quality === 'degraded' || quality === 'bad') badSeries++;
          if (reps > targetHigh && quality === 'good') goodAboveSeries++;
        }

        if (filledSeries < 1) return null;

        if (badSeries >= 2) {
          const atBottom = isAtChainBottom(exercise.name);
          const currentRest = currentRestSeconds ?? exercise.rest_seconds ?? 90;
          const increasedRest = Math.min(currentRest + 30, 300); // max 5 min
          return (
            <div className="flex items-start gap-3 p-3 rounded-xl bg-destructive/20 border border-destructive/40">
              <TrendingDown className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">Objectifs non atteints</p>
                <p className="text-xs text-white/70 mt-0.5">
                  {atBottom ?
                  "Augmente le repos pour mieux récupérer et atteindre tes cibles." :
                  "Ajuste le repos ou passe à une variante plus simple."}
                </p>
              </div>
              <div className="flex-shrink-0 flex items-center gap-1.5">
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      onClick={() => onExtendRest(exIdx, increasedRest)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-chart-4 text-white font-medium hover:bg-chart-4/80 transition-colors flex items-center gap-1">
                      
                      <Timer className="w-3 h-3" /> +30s repos <HelpCircle className="w-3 h-3 opacity-60" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 text-xs space-y-2 ">
                    <p className="text-violet-400 font-semibold">Augmenter le repos</p>
                    <p className="text-white/70">Ajouter 30s de repos par série va augmenter la durée totale de ta séance.</p>
                  </PopoverContent>
                </Popover>
                <button
                  onClick={() => onRegressionRequest(exIdx)}
                  disabled={regressingEx === exIdx}
                  className="text-xs px-3 py-1.5 rounded-lg bg-destructive text-white font-medium hover:bg-destructive/80 transition-colors disabled:opacity-60 flex items-center gap-1">
                  
                  {regressingEx === exIdx && <Loader2 className="w-3 h-3 animate-spin" />}
                  Variante simple
                </button>
              </div>
            </div>);

        }

        return null;
      })()}

      {/* Sets — all visible */}
      <Card className="p-4 space-y-3 bg-white/15 backdrop-blur-sm border-white/20">
        <h3 className="font-semibold text-sm text-white">Tes séries</h3>
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
                      ← Précédent
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
                      Passer →
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
              previousWeight={previousLogs?.[exercise.name]?.[setIdx + 1]?.weight}
              previousReps={previousLogs?.[exercise.name]?.[setIdx + 1]?.reps}
              previousMode={previousLogs?.[exercise.name]?.[setIdx + 1]?.mode}
              locked={setIdx > activeSetIdx}
              onAskCoach={onAskCoach ? (painNote, sIdx, thread) => onAskCoach({ exercise: { ...exercise, _sessionIdx: exIdx }, setIdx: sIdx, painNote, thread, logs: Object.fromEntries(Object.entries(logs).filter(([k]) => k.startsWith(`${exIdx}-`))), allLogs: logs, prevLogs: previousLogs, sessionsHistory }) : undefined} />
            
              <div className="space-y-2">
                <button
                onClick={() => handleSetDone(setIdx)}
                disabled={!isActive}
                className="w-full text-xs flex items-center justify-center gap-1 py-1 rounded-lg transition-colors disabled:opacity-0 disabled:pointer-events-none text-white/50 hover:text-white hover:bg-white/10">

                  <Timer className="w-3 h-3" /> Lancer le repos
                </button>
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

        {/* Feedback */}
        <div className="flex items-center gap-2 pt-2 border-t border-white/20 flex-wrap">
          <span className="text-xs text-white/60">Retour :</span>
          {[
          { value: 'liked', label: 'J\'aime', bg: 'bg-white/30', text: 'text-white' },
          { value: 'disliked', label: 'Pas fan', bg: 'bg-white/30', text: 'text-white' },
          { value: 'change', label: 'Remplacer', bg: 'bg-white/30', text: 'text-white' }].
          map(({ value, label, bg, text }) => {
            const key = `${exIdx}-0`;
            const isSelected = logs[key]?.feedback === value;
            return (
              <button
                key={value}
                onClick={() => {
                  const newVal = isSelected ? null : value;
                  for (let s = 0; s < sets; s++) updateLog(exIdx, s, 'feedback', newVal);
                }}
                className={`text-xs px-3 py-1 rounded-full transition-all font-medium ${isSelected ? `${bg} ${text}` : 'bg-white/10 text-white/60 hover:bg-white/20'}`}>
                
                {label}
              </button>);

          })}
        </div>
      </Card>

      {/* Nav buttons */}
      <div className="flex items-center justify-between gap-3">
        {exIdx > 0 &&
        <Button variant="outline" onClick={onPrev} className="flex-1 border-white/30 text-white hover:bg-white/10 hover:text-white">
            <ChevronLeft className="w-4 h-4 mr-1" /> Précédent
          </Button>
        }
        <Button onClick={onNext} className="flex-1">
          {allSetsDone
            ? isLast ? <><CheckCircle className="w-4 h-4 mr-1" /> Terminer</> : <>Suivant <ChevronRight className="w-4 h-4 ml-1" /></>
            : isLast ? 'Terminer quand même' : 'Passer'
          }
        </Button>
      </div>
    </motion.div>

    {/* Bannière objectifs dépassés — hors motion.div pour fixed positioning correct */}
    {showObjectifBanner && (
      <div className="fixed bottom-20 left-4 right-4 z-40 flex items-center gap-3 p-4 rounded-2xl shadow-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e0050 0%, #3b0764 50%, #1e0050 100%)', border: '1px solid rgba(139,92,246,0.5)', boxShadow: '0 0 30px rgba(139,92,246,0.3), 0 8px 32px rgba(0,0,0,0.4)' }}>
        {/* Shimmer */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(105deg, transparent 10%, rgba(255,255,255,0.02) 30%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.02) 70%, transparent 90%)', animation: 'shimmer 4s infinite' }} />
        <div className="relative flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-violet-500/20">
          <Bot className="w-6 h-6 text-violet-300" />
          <TrendingUp className="w-3 h-3 text-green-400 absolute bottom-0.5 right-0.5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white tracking-wide">Objectifs dépassés</p>
          <p className="text-xs text-violet-300/80">Réduis le repos ou augmente le poids.</p>
        </div>
        <div className="flex-shrink-0 flex items-center gap-1.5">
          <Popover>
            <PopoverTrigger asChild>
              <button
                onClick={() => { onExtendRest(exIdx, Math.max((currentRestSeconds ?? exercise.rest_seconds ?? 90) - 30, 30)); setAckedGoodSeries(goodAboveSeries); }}
                className="text-xs px-3 py-1.5 rounded-lg bg-white/20 text-white font-medium hover:bg-white/30 transition-colors flex items-center gap-1">
                −30s repos <HelpCircle className="w-3 h-3 opacity-60" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-48 text-xs space-y-2">
              <p className="text-violet-400 font-semibold">Réduire le repos</p>
              <p className="text-white/70">Retirer 30s de repos par série va réduire la durée totale de ta séance.</p>
            </PopoverContent>
          </Popover>
          {!isBodyweightExercise(exercise.name) ? (
            <button
              onClick={() => {
                for (let s = activeSetIdx + 1; s < sets; s++) {
                  const key = `${exIdx}-${s}`;
                  const current = logs[key]?.weight || 0;
                  updateLog(exIdx, s, 'weight', current > 0 ? current + 2.5 : 2.5);
                }
                setAckedGoodSeries(goodAboveSeries);
              }}
              className="text-xs px-3 py-1.5 rounded-lg bg-accent text-white font-medium hover:bg-accent/80 transition-colors">
              +2.5 kg
            </button>
          ) : (
            <button
              onClick={() => onProgressionRequest(exIdx)}
              disabled={regressingEx === exIdx}
              className="text-xs px-3 py-1.5 rounded-lg bg-accent text-white font-medium hover:bg-accent/80 transition-colors disabled:opacity-60 flex items-center gap-1">
              {regressingEx === exIdx && <Loader2 className="w-3 h-3 animate-spin" />}
              Variante plus dure
            </button>
          )}
          <button onClick={() => setAckedGoodSeries(goodAboveSeries)} className="text-xs px-2 py-1.5 text-white/40 hover:text-white/70 transition-colors">✕</button>
        </div>
      </div>
    )}
    </>
  );

}

// ─── Overview Panel ────────────────────────────────────────────────────────────
function OverviewPanel({ exercises, logs, updateLog, onClose, fragileZones = [] }) {
  const getLogKey = (exIdx, setIdx) => `${exIdx}-${setIdx}`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-bold text-lg text-white">Vue d'ensemble</h2>
        <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/10">
          <ChevronLeft className="w-4 h-4 mr-1" /> Retour
        </Button>
      </div>

      {exercises.filter((ex) => ex && ex.name).map((exercise, exIdx) => {
        const sets = Math.max(1, exercise.sets || 3);
        return (
          <Card key={exIdx} className="p-4 space-y-3 bg-white/15 backdrop-blur-sm border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-sm text-white">{exercise.name}</span>
                <div className="flex gap-2 mt-0.5">
                  <Badge variant="outline" className="text-xs border-white/30 text-white">{exercise.muscle_group}</Badge>
                  <span className="text-xs text-white/60">{sets}×{exercise.target_reps}</span>
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              {Array.from({ length: sets }).map((_, setIdx) =>
              <SetRow
                key={`${exIdx}-${setIdx}`}
                setIdx={setIdx}
                log={logs[getLogKey(exIdx, setIdx)] || {}}
                onUpdate={(field, value) => updateLog(exIdx, setIdx, field, value)}
                exerciseFragileZones={getExerciseFragileZones(exercise, fragileZones)} />

              )}
            </div>
          </Card>);

      })}
    </div>);

}

// ─── End of session panel ──────────────────────────────────────────────────────
function EndPanel({ exercises, logs, updateLog, fatigue, setFatigue, notes, setNotes, onSave, saving, proposal, setProposal, generateProposal, coachPainQuery, onDismissPain, fragileZones = [] }) {
  const [showOverview, setShowOverview] = useState(false);
  const navigate = useNavigate();

  // Notification coach après douleur
  if (coachPainQuery) {
    return (
      <div className="space-y-5">
        <div>
          <h2 className="font-heading font-bold text-2xl text-white">Séance validée ✅</h2>
          <p className="text-white/70 text-sm mt-1">Les ajustements sont appliqués.</p>
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
              onClick={() => navigate('/coach')}
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
        <Eye className="w-4 h-4 mr-2" /> Revoir et modifier la séance complète
      </Button>

      <Card className="p-5 space-y-5 bg-white/15 backdrop-blur-sm border-white/20">
        <h3 className="font-heading font-semibold text-base text-white">Bilan</h3>
        <div>
          <div className="flex items-center gap-2 mb-3">
            <label className="text-sm font-medium text-white">Fatigue globale</label>
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
            { value: 1, label: 'Frais', bg: 'bg-accent', ring: 'ring-accent' },
            { value: 2, label: 'Normal', bg: 'bg-primary', ring: 'ring-primary' },
            { value: 3, label: 'Fatigué', bg: 'bg-primary', ring: 'ring-primary' },
            { value: 4, label: 'Épuisé', bg: 'bg-chart-4', ring: 'ring-chart-4' },
            { value: 5, label: 'Détruit', bg: 'bg-destructive', ring: 'ring-destructive' }].
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
            <label className="text-sm font-medium text-white">Notes (optionnel)</label>
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
          <Textarea placeholder="Comment tu te sens ? Quelque chose à signaler ?" value={notes} onChange={(e) => { setNotes(e.target.value); setProposal(null); }} className="bg-white/10 border-white/20 text-white placeholder:text-white/30" />
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
              <div key={i} className={`flex items-start gap-3 px-3 py-2 rounded-lg text-xs ${p.type === 'increase' ? 'bg-green-500/20 text-green-200' : p.type === 'reduce' ? 'bg-red-500/20 text-red-200' : 'bg-white/10 text-white/70'}`}>
                <span className="text-base mt-0.5">{p.type === 'increase' ? '↑' : p.type === 'reduce' ? '↓' : '→'}</span>
                <div className="flex-1">
                  <span className="font-semibold">{p.exercise}</span>
                  {p.newWeight && <span className="ml-1">→ {p.newWeight}kg</span>}
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
              Appliquer et valider
            </Button>
            <Button onClick={() => onSave(false)} disabled={saving} variant="outline" className="border-white/30 text-white hover:bg-white/10" size="lg">
              Ignorer
            </Button>
          </div>
        ) : (
          <Button onClick={() => onSave(false)} disabled={saving} className="w-full" size="lg">
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
            Valider la séance
          </Button>
        )}
      </Card>
    </div>);

}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function SessionLog() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('id');

  const [user, setUser] = useState(null);
  const _draft = (() => { try { const s = localStorage.getItem(`session_draft_${sessionId}`); return s ? JSON.parse(s) : {}; } catch { return {}; } })();
  const [logs, setLogs] = useState(() => _draft.logs || {});
  const [fatigue, setFatigue] = useState(() => _draft.fatigue ?? 2);
  const [notes, setNotes] = useState(() => _draft.notes || '');
  const [saving, setSaving] = useState(false);
  const [scrollReady, setScrollReady] = useState(false);
  const [currentExIdx, setCurrentExIdx] = useState(() => _draft.currentExIdx || 0);
  const [showOverview, setShowOverview] = useState(false);
  const [showEnd, setShowEnd] = useState(() => _draft.showEnd || false);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);
  const { startTimer } = useRestTimer();

  // Restore timer from localStorage on mount (e.g. after page refresh)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`rest_timer_${sessionId}`);
      if (saved) {
        const { endTime } = JSON.parse(saved);
        const left = Math.ceil((endTime - Date.now()) / 1000);
        if (left > 0) {
          startTimer(left, endTime, null);
        } else {
          localStorage.removeItem(`rest_timer_${sessionId}`);
        }
      }
    } catch {}
  }, []); // eslint-disable-line

  const [restTimeForEx, setRestTimeForEx] = useState(() => _draft.restTimeForEx || {});
  const [regressingEx, setRegressingEx] = useState(null);
  const [sessionExercises, setSessionExercises] = useState(() => _draft.sessionExercises || null);
  const [editingObjectif, setEditingObjectif] = useState(false);
  const [previousLogs, setPreviousLogs] = useState({});
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

  useEffect(() => {
    if (!sessionId) return;
    const key = `session_scroll_${sessionId}`;
    const saved = parseInt(localStorage.getItem(key) || '0');
    if (saved > 0) {
      setTimeout(() => {
        window.scrollTo({ top: saved, behavior: 'instant' });
        setScrollReady(true);
      }, 200);
    } else {
      setScrollReady(true);
    }
    const onScroll = () => { try { localStorage.setItem(key, String(window.scrollY)); } catch {} };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
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

  // Fetch previous session logs for the same program
  useEffect(() => {
    if (!session || !user) return;
    const fetchPreviousLogs = async () => {
      const allSessions = await base44.entities.Session.filter({ program_id: session.program_id, status: 'completed' });
      const sorted = allSessions
        .filter(s => s.id !== session.id)
        .sort((a, b) => new Date(b.actual_date || b.created_date) - new Date(a.actual_date || a.created_date));

      // previousLogs = dernière séance uniquement (pour affichage poids précédents)
      const lastSession = sorted[0];
      if (lastSession) {
        const lastLogs = await base44.entities.SeriesLog.filter({ session_id: lastSession.id, user_id: user.id });
        const map = {};
        lastLogs.forEach(sl => {
          if (!map[sl.exercise_name]) map[sl.exercise_name] = {};
          map[sl.exercise_name][sl.set_number] = { weight: sl.weight, reps: sl.reps_done, mode: sl.mode };
        });
        setPreviousLogs(map);
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
    fetchPreviousLogs();
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

  // Pré-remplir les logs avec target_weight si défini et pas encore de log
  useEffect(() => {
    if (!exercises.length) return;
    setLogs(prev => {
      const updated = { ...prev };
      exercises.forEach((ex, exIdx) => {
        if (!ex.target_weight) return;
        const sets = Math.max(1, ex.sets || 3);
        for (let s = 0; s < sets; s++) {
          const key = `${exIdx}-${s}`;
          if (!updated[key]?.weight) {
            updated[key] = { ...(updated[key] || {}), weight: ex.target_weight };
          }
        }
      });
      return updated;
    });
  }, [exercises.length]);

  const updateLog = (exIdx, setIdx, field, value, totalSets) => {
    setLogs((prev) => {
      const key = `${exIdx}-${setIdx}`;
      const updated = { ...prev, [key]: { ...(prev[key] || {}), [field]: value } };
      return updated;
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

  const handleRegressionRequest = async (exIdx) => {
    setRegressingEx(exIdx);
    const currentExercise = exercises[exIdx];
    const equipment = user?.equipment || [];
    const progressionCtx = buildProgressionContext(currentExercise.name, equipment);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Tu es un coach sportif expert en régression biomécanique. L'athlète n'arrive pas à atteindre ses objectifs sur l'exercice "${currentExercise.name}" (groupe musculaire : ${currentExercise.muscle_group}, cible : ${currentExercise.sets}×${currentExercise.target_reps}).

${progressionCtx}

CONTEXTE DES SÉRIES : qualité d'exécution observée = ${
      (() => {
        const sets = Math.max(1, currentExercise.sets || 3);
        const qualities = [];
        for (let s = 0; s < sets; s++) {
          const l = logs[`${exIdx}-${s}`] || {};
          if (l.quality) qualities.push(l.quality);
        }
        return qualities.length ? qualities.join(', ') : 'non renseignée';
      })()}

HIÉRARCHIE STRICTE DE RÉGRESSION — applique dans cet ordre exact :

1. SI l'exécution est dégradée ou mauvaise mais que les reps sont proches de la cible → NE régresse PAS l'exercice. Propose plutôt la VERSION EXCENTRIQUE UNIQUEMENT (descente 4s) du même exercice pour corriger la technique : "${
      currentExercise.name} (excentrique 4s)". Explique dans les notes que c'est pour consolider le pattern moteur avant de recharger.

2. SI les reps sont nettement en dessous de la cible (plus de 3 reps sous le minimum) → régresse d'une étape dans la chaîne en utilisant EXACTEMENT l'étape précédente indiquée.

3. SI c'est déjà le niveau minimum → réduis d'1 série OU propose une assistance élastique OU réduis l'amplitude de mouvement. Explique concrètement.

Sois ultra précis dans les notes : angle, tempo, position, respiration.

Réponds uniquement avec le JSON demandé.`,
      response_json_schema: {
        type: "object",
        properties: {
          name: { type: "string", description: "Nom exact de la variante régressive en français" },
          notes: { type: "string", description: "Explication précise de l'étape et conseil d'exécution" }
        }
      }
    });
    const updatedExercises = exercises.map((ex, i) =>
    i === exIdx ? { ...ex, name: result.name, notes: result.notes } : ex
    );
    setSessionExercises(updatedExercises);
    for (let s = 0; s < Math.max(1, currentExercise.sets || 3); s++) {
      updateLog(exIdx, s, 'feedback', 'change');
    }
    setRegressingEx(null);
  };

  const handleProgressionRequest = async (exIdx) => {
    setRegressingEx(exIdx);
    const currentExercise = exercises[exIdx];
    const equipment = user?.equipment || [];
    const progressionCtx = buildProgressionContext(currentExercise.name, equipment);
    const hasResistanceBand = equipment.some((e) => e.toLowerCase().includes('élastique') || e.toLowerCase().includes('elastique'));
    const hasWeightVest = equipment.some((e) => e.toLowerCase().includes('gilet'));
    const hasWeights = equipment.some((e) => e.toLowerCase().includes('haltère') || e.toLowerCase().includes('barre') || e.toLowerCase().includes('kettlebell'));
    const hasLestage = hasResistanceBand || hasWeightVest || hasWeights;

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Tu es un coach sportif expert en progression biomécanique. L'athlète dépasse facilement ses objectifs sur l'exercice "${currentExercise.name}" (groupe musculaire : ${currentExercise.muscle_group}, cible : ${currentExercise.sets}×${currentExercise.target_reps}).

${progressionCtx}

MATÉRIEL DE LESTAGE DISPONIBLE : ${hasLestage ? `OUI (${[hasWeightVest && 'gilet lesté', hasResistanceBand && 'élastiques', hasWeights && 'haltères/barre'].filter(Boolean).join(', ')})` : 'NON — poids du corps uniquement'}

HIÉRARCHIE STRICTE DE PROGRESSION — applique dans cet ordre exact :

1. SI la prochaine étape dans la chaîne est disponible ET que l'exercice actuel n'est PAS encore en mode excentrique uniquement → PRIORITÉ : propose d'abord la VERSION EXCENTRIQUE de l'exercice actuel (descente lente 4-5 secondes) avant de monter d'un échelon. C'est la progression intermédiaire la plus intelligente et la plus sûre. Nomme l'exercice : "${currentExercise.name} (excentrique 5s)" et explique précisément dans les notes comment l'exécuter.

2. SI l'exercice actuel est DÉJÀ une version excentrique (le nom contient "excentrique") → passe à l'étape suivante dans la chaîne.

3. SI c'est le niveau maximum de la chaîne ET pas de lestage disponible → garde l'exercice actuel en mode excentrique 5s, et note dans les conseils que c'est le maximum accessible actuellement et suggère d'acheter des élastiques de résistance (15kg) pour débloquer la suite.

4. SI c'est le niveau maximum ET lestage disponible → propose lestage (sac à dos +5kg, élastique résistance, ou gilet lesté selon ce qui est disponible).

Sois ultra concret dans les notes : timing exact de la descente, position, respiration.

Réponds uniquement avec le JSON demandé.`,
      response_json_schema: {
        type: "object",
        properties: {
          name: { type: "string", description: "Nom exact de la variante progressive en français" },
          notes: { type: "string", description: "Explication précise de l'étape avec timing et exécution concrète" }
        }
      }
    });
    const updatedExercises = exercises.map((ex, i) =>
    i === exIdx ? { ...ex, name: result.name, notes: result.notes } : ex
    );
    setSessionExercises(updatedExercises);
    setRegressingEx(null);
  };

  const handleExtendRest = (exIdx, newRestSecs) => {
    const updatedExercises = exercises.map((ex, i) =>
    i === exIdx ? { ...ex, rest_seconds: newRestSecs } : ex
    );
    setSessionExercises(updatedExercises);
    setRestTimeForEx((prev) => ({ ...prev, [exIdx]: newRestSecs }));
    const exerciseName = exercises[exIdx]?.name;
    if (exerciseName) handleApplyToFuture(exerciseName, { rest_seconds: newRestSecs });
  };

  const handleUpdateExercise = (exIdx, updates) => {
    const updatedExercises = exercises.map((ex, i) =>
    i === exIdx ? { ...ex, ...updates } : ex
    );
    setSessionExercises(updatedExercises);
    if (updates.rest_seconds) {
      setRestTimeForEx((prev) => ({ ...prev, [exIdx]: updates.rest_seconds }));
    }
    const exerciseName = exercises[exIdx]?.name;
    if (exerciseName) handleApplyToFuture(exerciseName, updates);
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
      const exerciseIdx = exercises.findIndex(e => e.name === exerciseName);
      const allSessions = await base44.entities.Session.filter({ program_id: session.program_id });
      const future = allSessions.filter(s =>
        s.status === 'planned' &&
        s.planned_date > new Date().toISOString().split('T')[0] &&
        new Date(s.planned_date).getDay() === currentDayOfWeek
      ).slice(0, 8);
      await Promise.all(future.map(fs => {
        if (!fs.exercises?.length) return Promise.resolve();
        const updated = fs.exercises.map((ex, i) =>
          i === exerciseIdx && ex.name === exerciseName ? { ...ex, ...updates } : ex
        );
        return base44.entities.Session.update(fs.id, { exercises: updated });
      }));
    } catch (e) { console.error('applyToFuture error', e); }
  };

  const handleNext = () => {
    if (currentExIdx < exercises.length - 1) {
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

    try {
      const result = await base44.integrations.Core.InvokeLLM({ prompt, model: 'claude_sonnet_4_6' });
      return typeof result === 'string' ? result : result?.response || "Je n'ai pas pu analyser. Arrête si la douleur est vive.";
    } catch {
      return "Erreur de connexion. Par précaution : si la douleur est vive, arrête l'exercice.";
    }
  };

  // Génère les propositions d'adaptation basées sur les logs + fatigue + notes
  const generateProposal = () => {
    const perEx = {};
    const setPainNotes = [];
    for (const [key, log] of Object.entries(logs)) {
      const [exIdx] = key.split('-').map(Number);
      const ex = exercises[exIdx];
      if (!ex) continue;
      if (!perEx[ex.name]) perEx[ex.name] = { weights: [], modes: [], qualities: [], painNotes: [], name: ex.name, originalWeight: ex.target_weight };
      if (log.weight) perEx[ex.name].weights.push(log.weight);
      if (log.mode) perEx[ex.name].modes.push(log.mode);
      if (log.quality) perEx[ex.name].qualities.push(log.quality);
      if (log.pain_note) { perEx[ex.name].painNotes.push(log.pain_note); setPainNotes.push({ exercise: ex.name, note: log.pain_note }); }
    }
    const noteText = (notes || '').toLowerCase();
    const notePain = /douleur|mal\b|gêne|pincement|blessure|douloureux|coude|épaule|genou|dos|poignet|cervical/.test(noteText) || setPainNotes.length > 0;
    const noteEasy = /trop facile|trop léger|pas assez/.test(noteText);
    const noteHard = /trop dur|très dur|épuisant/.test(noteText);

    const RIR_SCORE = { failure: -1, RIR_0: 0, RIR_1: 1, RIR_2: 2, 'RIR_3+': 3 };
    const props = [];

    // Recommandation générale si douleur signalée (même sans logs de poids)
    if (notePain) {
      const painZone = noteText.match(/coude|épaule|genou|dos|poignet|cervical/)?.[0];
      props.push({
        exercise: '⚠️ Douleur signalée',
        newWeight: null,
        reason: painZone ? `douleur au ${painZone} — réduis la charge sur les exercices concernés et signale-le au coach IA` : 'douleur signalée — réduis la charge et surveille à la prochaine séance',
        type: 'reduce',
        general: true,
      });
    }

    for (const ex of Object.values(perEx)) {
      if (!ex.weights.length) continue;
      const avgW = Math.round(ex.weights.reduce((a, b) => a + b, 0) / ex.weights.length * 10) / 10;
      const avgRIR = ex.modes.length ? ex.modes.reduce((a, m) => a + (RIR_SCORE[m] ?? 2), 0) / ex.modes.length : 2;
      const qualityOk = ex.qualities.length === 0 || ex.qualities.filter(q => q === 'good').length / ex.qualities.length > 0.6;
      const qualityBad = ex.qualities.filter(q => q === 'bad').length > 0;

      if (qualityBad || fatigue >= 5) {
        props.push({ exercise: ex.name, newWeight: Math.round(avgW * 0.92 * 2) / 2, reason: fatigue >= 5 ? 'fatigue maximale' : 'qualité dégradée', type: 'reduce' });
      } else if (fatigue >= 4) {
        props.push({ exercise: ex.name, newWeight: avgW, reason: 'fatigue élevée — maintien', type: 'maintain' });
      } else if ((noteEasy || avgRIR >= 2) && qualityOk) {
        const inc = avgW >= 60 ? 2.5 : avgW >= 20 ? 1.25 : 1;
        props.push({ exercise: ex.name, newWeight: Math.round((avgW + inc) * 2) / 2, reason: noteEasy ? 'tu as trouvé ça facile' : `reps en réserve suffisantes (RIR ~${Math.round(avgRIR)})`, type: 'increase' });
      } else if (noteHard) {
        props.push({ exercise: ex.name, newWeight: Math.round(avgW * 0.95 * 2) / 2, reason: 'séance difficile', type: 'reduce' });
      }
    }
    return props.filter(p => p.type !== 'maintain' || props.length <= 2);
  };

  const saveSession = async (acceptProposal = false) => {
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
    }

    queryClient.invalidateQueries({ queryKey: ['sessions'] });
    queryClient.invalidateQueries({ queryKey: ['program-sessions'] });
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
      navigate('/program');
    }
    } catch (e) {
      console.error('saveSession error:', e);
      toast.error(`Erreur lors de la sauvegarde : ${e?.message || e}`);
    } finally {
      setSaving(false);
    }
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-white/70">Sélectionne une séance depuis le programme</p>
      </div>);

  }

  if (exercises.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-white/70">Aucun exercice dans cette séance</p>
      </div>);

  }

  return (
    <div className="space-y-4 max-w-2xl mx-auto pb-24" style={{ opacity: scrollReady ? 1 : 0, transition: 'opacity 0.2s ease' }}>
      {/* Top bar */}
      <div className="space-y-2">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white">{(session.day_label || 'Séance').replace(/^(week|semaine)\s*\d+\s*[-–:·]?\s*/i, '').replace(/\bmonday\b/gi, 'Lundi').replace(/\btuesday\b/gi, 'Mardi').replace(/\bwednesday\b/gi, 'Mercredi').replace(/\bthursday\b/gi, 'Jeudi').replace(/\bfriday\b/gi, 'Vendredi').replace(/\bsaturday\b/gi, 'Samedi').replace(/\bsunday\b/gi, 'Dimanche')}</h1>
          <p className="text-white/70 text-sm">{exercises.length} exercices</p>
        </div>
        {!showEnd && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowOverview((v) => !v)}
              className="border-white/30 text-white hover:bg-white/10 hover:text-white">
              <LayoutList className="w-4 h-4 mr-1" />
              {showOverview ? 'Vue focus' : 'Vue d\'ensemble'}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowQuitConfirm(true)}
              className="text-white/50 hover:text-white hover:bg-white/10">
              Quitter
            </Button>
          </div>
        )}
      </div>

      {/* Quit confirm */}
      {showQuitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 rounded-2xl p-6 text-center space-y-4" style={{ background: 'linear-gradient(160deg, #2e1065, #1e0050)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <p className="font-bold text-white text-lg">Quitter la séance ?</p>
            <p className="text-white/60 text-sm">Ta progression est sauvegardée, tu pourras reprendre plus tard.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowQuitConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-white/20 text-white/70 text-sm font-semibold hover:bg-white/10">
                Continuer
              </button>
              <button onClick={() => { try { localStorage.removeItem('active_session_id'); } catch {} navigate('/'); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
                Quitter
              </button>
            </div>
          </div>
        </div>
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
            fragileZones={fragileZones} />
          
            <div className="mt-4">
              <Button className="w-full" onClick={() => {setShowOverview(false);setShowEnd(true);}}>
                <CheckCircle className="w-4 h-4 mr-2" /> Terminer la séance
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
          totalExercises={exercises.length}
          onNext={handleNext}
          onPrev={() => setCurrentExIdx((i) => Math.max(0, i - 1))}
          onStartRest={(secs, onDone) => {
            const endTime = Date.now() + secs * 1000;
            try { localStorage.setItem(`rest_timer_${sessionId}`, JSON.stringify({ endTime })); } catch {}
            startTimer(secs, endTime, () => {
              try { localStorage.removeItem(`rest_timer_${sessionId}`); } catch {}
              onDone?.();
            });
          }}
          isLast={currentExIdx === exercises.length - 1}
          rirContext={rirContext}
          onRegressionRequest={handleRegressionRequest}
          onProgressionRequest={handleProgressionRequest}
          regressingEx={regressingEx}
          onExtendRest={handleExtendRest}
          onApplyToFuture={handleApplyToFuture}
          currentRestSeconds={exercises[currentExIdx]?.rest_seconds}
          nextExRestSeconds={exercises[currentExIdx + 1]?.rest_seconds}
          onRestTimeSave={handleRestTimeSave}
          editingObjectif={editingObjectif}
          setEditingObjectif={setEditingObjectif}
          onUpdateExercise={handleUpdateExercise}
          previousLogs={previousLogs}
          propagateWeight={propagateWeight}
          forcePropagateWeight={forcePropagateWeight}
          fragileZones={fragileZones}
          onAskCoach={handleAskCoach} />

        }
      </AnimatePresence>

    </div>);

}