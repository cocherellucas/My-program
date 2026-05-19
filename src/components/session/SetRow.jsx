import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { HelpCircle } from 'lucide-react';
import { computeTargetRIR, ririLabel, rirToMode } from '@/lib/rir-optimizer';

const ZONE_LABELS = {
  wrists: 'Poignets', shoulders: 'Épaules', elbows: 'Coudes',
  knees: 'Genoux', lower_back: 'Bas du dos', neck: 'Cervicales',
};

export default function SetRow({ setIdx, totalSets, log, onUpdate, onWeightBlur, onWeightPropagate, rirContext, previousWeight, previousReps, previousMode, nextWeights, exerciseFragileZones = [] }) {
  const [manuallyEdited, setManuallyEdited] = useState(false);
  const [propagated, setPropagated] = useState(false);
  const blurFromEnter = useRef(false);
  // rirContext = { phase, sessionType, block, weekNumber, plannedWeeks }
  const targetRIR = rirContext
    ? computeTargetRIR({
        phase: rirContext.phase || 'MAV',
        sessionType: rirContext.sessionType || 'hypertrophy',
        block: rirContext.block,
        setIndex: setIdx,
        totalSets: totalSets || 3,
        weekNumber: rirContext.weekNumber || 1,
        plannedWeeks: rirContext.plannedWeeks || 8,
      })
    : 2;

  const targetInfo = ririLabel(targetRIR);
  const defaultMode = rirToMode(targetRIR);
const shouldShowPropagate =
  manuallyEdited &&
  !propagated &&
  log.weight &&
  setIdx < totalSets - 1 &&
  nextWeights?.some(w => w && w !== log.weight);
  return (
    <div className="space-y-2 p-3 bg-white/10 rounded-lg border border-white/20">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-white">Série {setIdx + 1}</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Input
           type="number"
           placeholder={previousWeight ? `${previousWeight} kg` : 'kg'}
           value={log.weight || ''}
           onChange={(e) => {
  const v = parseFloat(e.target.value);

  if (!isNaN(v) && v >= 0) {
    onUpdate('weight', v);
    setPropagated(false);
    setManuallyEdited(true);
  } else if (e.target.value === '') {
    onUpdate('weight', '');
  }
}}
onKeyDown={(e) => {
  if (e.key === 'Enter') {
    blurFromEnter.current = true;
    e.target.blur();
    setManuallyEdited(false);
  }
}}

onBlur={(e) => {
  if (!blurFromEnter.current) {
    const v = parseFloat(e.target.value);
    if (v) onWeightBlur?.(v);
  }
  blurFromEnter.current = false;
  setManuallyEdited(false);
}}
           className="w-full h-10 text-center bg-white/10 border-white/20 text-white placeholder:text-white/40 text-sm"
          />
          <div className="text-xs text-center mt-1.5 min-h-[24px] flex items-center justify-center">
            {shouldShowPropagate ? (
  <button
    onClick={() => {
  console.log("PROPAGATION DATA", {
    weight: log.weight,
    setIdx,
    totalSets
  });

  forcePropagateWeight?.(0, setIdx, Number(log.weight), totalSets);
}}
    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-white text-[11px] font-semibold shadow-md hover:bg-primary/90 active:scale-95 transition-all"
  >
    ↓ Propager
  </button>
) : previousWeight ? (
  <span className="text-white/40">↑ {previousWeight} kg</span>
) : null}
          </div>
        </div>
        <div>
          <Input
           type="number"
           placeholder={previousReps ? `${previousReps}` : 'reps'}
           value={log.reps || ''}
           onChange={(e) => {
  const v = parseInt(e.target.value);

  if (!isNaN(v) && v >= 0) {
    onUpdate('reps', v);
  } else if (e.target.value === '') {
    onUpdate('reps', '');
  }
}}
onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
           className="w-full h-10 text-center bg-white/10 border-white/20 text-white placeholder:text-white/40 text-sm"
          />
          <span className="text-xs text-white/50 text-center block mt-1">
           {previousReps ? <span className="text-white/40">↑ {previousReps} reps (préc.)</span> : 'Reps'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Select value={log.mode || previousMode || defaultMode} onValueChange={(v) => onUpdate('mode', v)}>
            <SelectTrigger className="w-full h-10 text-xs bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="failure">Échec (RIR 0)</SelectItem>
              <SelectItem value="RIR_1">RIR 1</SelectItem>
              <SelectItem value="RIR_2">RIR 2</SelectItem>
              <SelectItem value="RIR_3+">RIR 3+</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center justify-center gap-1 mt-1">
            <span className="text-xs text-white/50">RIR</span>
            <Popover>
              <PopoverTrigger asChild>
                <button className="text-white hover:text-white/80 transition-colors cursor-pointer">
                  <HelpCircle className="w-3 h-3" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-48 text-xs space-y-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white">
                <p className="font-semibold text-violet-400">RIR (Reps In Reserve)</p>
                <p>Le nombre de répétitions que tu aurais pu faire avant d'atteindre l'échec.</p>
                <div className="space-y-1 pt-2 border-t border-white/20">
                  <p><span className="font-medium">RIR 0</span> = À l'échec</p>
                  <p><span className="font-medium">RIR 1</span> = 1 rep avant l'échec</p>
                  <p><span className="font-medium">RIR 2</span> = 2 reps avant l'échec</p>
                  <p><span className="font-medium">RIR 3+</span> = 3+ reps avant l'échec</p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div>
          <Select value={log.quality || 'good'} onValueChange={(v) => onUpdate('quality', v)}>
            <SelectTrigger className="w-full h-10 text-xs bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="good">✓ Bonne</SelectItem>
              <SelectItem value="degraded">~ Dégradée</SelectItem>
              <SelectItem value="bad">✗ Mauvaise</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-xs text-white/50 text-center block mt-1">Exécution</span>
        </div>
      </div>

      {/* Warning zone fragile si exécution dégradée */}
      {exerciseFragileZones.length > 0 && (log.quality === 'degraded' || log.quality === 'bad') && (
        <div className="space-y-1.5">
          {exerciseFragileZones.map(z => (
            <div key={z.key} className="flex items-start gap-2 px-3 py-2 rounded-lg bg-red-500/15 border border-red-400/40 text-xs text-red-200">
              <span className="mt-0.5">⚠️</span>
              <div>
                <span className="font-semibold">{ZONE_LABELS[z.key] || z.key} — zone {z.goal === 'protect' ? 'fragile' : 'en renforcement'} : </span>
                {z.goal === 'protect'
                  ? 'une mauvaise exécution peut aggraver la blessure. Réduis la charge ou arrête la série.'
                  : 'l\'exécution doit être parfaite pour progresser en sécurité. Corrige la technique ou réduis la charge.'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}