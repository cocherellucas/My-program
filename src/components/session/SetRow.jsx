import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { HelpCircle, AlertTriangle, Send, Loader2 } from 'lucide-react';
import { computeTargetRIR, ririLabel, rirToMode } from '@/lib/rir-optimizer';
import ReactMarkdown from 'react-markdown';

const ZONE_LABELS = {
  wrists: 'Poignets', shoulders: 'Épaules', elbows: 'Coudes',
  knees: 'Genoux', lower_back: 'Bas du dos', neck: 'Cervicales',
};

const QUALITY_LABELS = { good: '✓ Bonne', degraded: '~ Dégradée', bad: '✗ Mauvaise' };
const MODE_LABELS = { RIR_3: 'RIR 3+', RIR_2: 'RIR 2', RIR_1: 'RIR 1', failure: 'Échec' };

// Champ numérique UNCONTROLLED : React n'écrit jamais value pendant la frappe.
// Le DOM gère le curseur nativement, et on commit au blur.
function LocalNumberInput({ value, onCommit, placeholder, decimal = false, readOnly, className, onEnter }) {
  const ref = React.useRef(null);
  const focusedRef = React.useRef(false);

  // Sync prop → DOM UNIQUEMENT quand on n'est pas focus (pour ne pas casser la frappe)
  // Note : 0 est traité comme "vide" — un poids/reps de 0 n'a aucun sens
  React.useEffect(() => {
    if (!ref.current) return;
    if (focusedRef.current) return; // ne touche pas pendant la frappe
    const next = (value === undefined || value === null || value === '' || value === 0) ? '' : String(value);
    if (ref.current.value !== next) ref.current.value = next;
  }, [value]);

  const sanitize = (raw) => {
    if (decimal) {
      let cleaned = raw.replace(/[^0-9.,]/g, '').replace(',', '.');
      const parts = cleaned.split('.');
      if (parts.length > 2) cleaned = parts[0] + '.' + parts.slice(1).join('');
      return cleaned;
    }
    return raw.replace(/[^0-9]/g, '');
  };

  const commit = () => {
    if (!ref.current) return;
    const raw = ref.current.value;
    if (raw === '') { onCommit(''); return; }
    const v = decimal ? parseFloat(raw) : parseInt(raw, 10);
    if (!isNaN(v) && v >= 0) onCommit(v);
  };

  return (
    <input
      ref={ref}
      type="text"
      inputMode={decimal ? 'decimal' : 'numeric'}
      placeholder={placeholder}
      defaultValue={(value === undefined || value === null || value === '' || value === 0) ? '' : String(value)}
      readOnly={readOnly}
      onFocus={() => { focusedRef.current = true; }}
      onInput={(e) => {
        // Sanitise en réécrivant la value (le curseur peut sauter à la fin pour un caractère
        // invalide, c'est OK — c'était une frappe rejetée)
        const cleaned = sanitize(e.currentTarget.value);
        if (cleaned !== e.currentTarget.value) e.currentTarget.value = cleaned;
      }}
      onBlur={() => { focusedRef.current = false; commit(); }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          commit();
          e.currentTarget.blur();
          onEnter?.();
        }
      }}
      className={className}
    />
  );
}

export default function SetRow({ setIdx, totalSets, log, onUpdate, onWeightBlur, onWeightPropagate, rirContext, previousWeight, previousReps, previousMode, previousQuality, nextWeights, exerciseFragileZones = [], locked = false, onAskCoach }) {
  const [manuallyEdited, setManuallyEdited] = useState(false);
  const [propagated, setPropagated] = useState(false);
  const [showPain, setShowPain] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [painThread, setPainThread] = useState([]); // [{ role: 'user'|'ai', text }]
  const [painWhere, setPainWhere] = useState('');
  const [painWhen, setPainWhen] = useState('');
  const [painHow, setPainHow] = useState('');
  const [painOther, setPainOther] = useState('');
  const blurFromEnter = useRef(false);
  const propagateTimer = useRef(null);
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
const hasFilledNextSets = nextWeights?.some(w => !!w);
const shouldShowPropagate =
  manuallyEdited &&
  !propagated &&
  log.weight &&
  setIdx < totalSets - 1 &&
  hasFilledNextSets &&
  nextWeights?.some(w => w && w !== log.weight);
  return (
    <div className="space-y-2 p-3 bg-white/10 rounded-lg border border-white/20">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-white">Série {setIdx + 1}</span>
        <button
          onClick={() => setShowPain(p => !p)}
          className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border transition-all ${
            showPain || log.pain_note
              ? 'border-red-400/60 bg-red-500/20 text-red-300'
              : 'border-white/20 text-white/40 hover:text-white/70 hover:border-white/40'
          }`}>
          <AlertTriangle className="w-3 h-3" />
          Douleur ?
        </button>
      </div>

      {showPain && (() => {
        const lastMsgRole = painThread.length > 0 ? painThread[painThread.length - 1].role : null;
        return (
        <div className="space-y-2">
          {/* Thread */}
          {painThread.length > 0 && (
            <div className="space-y-1.5">
              {painThread.map((msg, i) => (
                <div key={i} className={msg.role === 'user'
                  ? 'text-xs bg-red-500/10 border border-red-400/20 rounded-lg px-3 py-2 text-white/70'
                  : 'bg-violet-500/25 border border-violet-400/40 rounded-xl px-4 py-3'}>
                  {msg.role === 'ai' && (
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                      <span className="text-[11px] font-bold text-violet-300 uppercase tracking-widest">Coach IA</span>
                    </div>
                  )}
                  <div className="text-sm text-white leading-relaxed [&_strong]:font-bold [&_p]:mb-1 [&_p:last-child]:mb-0">
                    {msg.role === 'ai' ? <ReactMarkdown>{msg.text}</ReactMarkdown> : msg.text}
                  </div>
                </div>
              ))}
              {lastMsgRole === 'ai' && !aiLoading && (
                <button
                  type="button"
                  onClick={() => { setPainThread([]); onUpdate('pain_note', ''); }}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/15 text-white border border-white/25 hover:bg-white/25 transition-colors"
                >
                  ↩ Recommencer
                </button>
              )}
              {aiLoading && (
                <div className="flex items-center gap-2 px-3 py-2 text-white/50 text-xs">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Le coach réfléchit…
                </div>
              )}
            </div>
          )}

          {/* Input — caché pendant qu'on attend la réponse IA */}
          {lastMsgRole !== 'user' && (
            lastMsgRole === null ? (
              /* Formulaire structuré initial */
              <div className="space-y-2">
                {[
                  { label: 'Où',      value: painWhere, set: setPainWhere, placeholder: 'Poignet, genou, épaule…', required: true },
                  { label: 'Quand',   value: painWhen,  set: setPainWhen,  placeholder: 'À la montée, en bas du mouvement…', required: true },
                  { label: 'Comment', value: painHow,   set: setPainHow,   placeholder: 'Gêne, brûlure, tension, coup…', required: true },
                  { label: 'Autres',  value: painOther, set: setPainOther, placeholder: 'Depuis quand, intensité…', required: false },
                ].map(({ label, value, set, placeholder, required }) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="text-[11px] text-white/50 w-16 flex-shrink-0 text-right whitespace-nowrap">
                      {label}{required ? <span className="text-red-400"> *</span> : ''}
                    </span>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => set(e.target.value)}
                      placeholder={placeholder}
                      className="flex-1 text-xs bg-red-500/10 border border-red-400/30 rounded-lg px-3 py-1.5 text-white placeholder:text-white/25 focus:outline-none focus:border-red-400/60"
                    />
                  </div>
                ))}
                <button
                  disabled={!painWhere.trim() || !painWhen.trim() || !painHow.trim()}
                  onPointerDown={async (e) => {
                    e.preventDefault();
                    if (!painWhere.trim() || !painWhen.trim() || !painHow.trim() || !onAskCoach) return;
                    const parts = [`Où : ${painWhere.trim()}`, `Quand : ${painWhen.trim()}`, `Comment : ${painHow.trim()}`];
                    if (painOther.trim()) parts.push(`Autres : ${painOther.trim()}`);
                    const msg = parts.join(' — ');
                    onUpdate('pain_note', msg);
                    const newThread = [{ role: 'user', text: msg }];
                    setPainThread(newThread);
                    setAiLoading(true);
                    try {
                      const reply = await onAskCoach(msg, setIdx, newThread);
                      setPainThread(t => [...t, { role: 'ai', text: reply }]);
                    } catch {
                      setPainThread(t => [...t, { role: 'ai', text: "Une erreur s'est produite. Réessaie." }]);
                    } finally {
                      setAiLoading(false);
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-red-500/30 border border-red-400/40 text-red-200 text-xs font-medium disabled:opacity-40 transition-all hover:bg-red-500/50"
                >
                  <Send className="w-3 h-3" />
                  Envoyer au coach
                </button>
              </div>
            ) : null
          )}
        </div>
        );
      })()}

      <div className="grid grid-cols-2 gap-2">
        <div>
          <LocalNumberInput
           decimal
           placeholder={(log.weight && log.weight !== 0) ? String(log.weight) : (previousWeight ? `${previousWeight}` : '')}
           value={log.weight}
           onCommit={(v) => {
             if (v === '') { onUpdate('weight', ''); return; }
             onUpdate('weight', v);
             setPropagated(false);
             setManuallyEdited(true);
             if (v) onWeightBlur?.(v);
             setManuallyEdited(false);
           }}
           onEnter={() => setManuallyEdited(false)}
           className={`flex h-10 w-full rounded-md border bg-white/10 border-white/20 ${log.prefill?.weight ? 'text-white/50' : 'text-white'} placeholder:text-white/35 text-sm text-center px-3 py-1 shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring`}
          />
          <div className="text-xs text-center mt-1 flex items-center justify-center">
            {shouldShowPropagate ? (
  <button
    onPointerDown={(e) => {
      e.preventDefault();
      onWeightPropagate?.(Number(log.weight));
      setPropagated(true);
      setManuallyEdited(false);
    }}
    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-white text-[11px] font-semibold shadow-md hover:bg-primary/90 active:scale-95 transition-all"
  >
    ↓ Propager
  </button>
) : (
  <span className="text-white/50">kg / lbs</span>
)}
          </div>
        </div>
        <div>
          <LocalNumberInput
           placeholder={(log.reps && log.reps !== 0) ? String(log.reps) : (previousReps ? `${previousReps}` : '')}
           value={log.reps}
           readOnly={locked}
           onCommit={(v) => onUpdate('reps', v === '' ? '' : v)}
           className={`flex h-10 w-full rounded-md border bg-white/10 border-white/20 ${log.prefill?.reps ? 'text-white/50' : 'text-white'} placeholder:text-white/35 text-sm text-center px-3 py-1 shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring`}
          />
          <span className="text-xs text-white/50 text-center block mt-1">Reps</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Select value={log.mode || previousMode || defaultMode} onValueChange={(v) => !locked && onUpdate('mode', v)}>
            <SelectTrigger className={`w-full h-10 text-xs bg-white/10 border-white/20 ${(log.prefill?.mode || !log.mode) ? 'text-white/50' : 'text-white'}${locked ? ' pointer-events-none' : ''}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="RIR_3+">RIR 3+</SelectItem>
              <SelectItem value="RIR_2">RIR 2</SelectItem>
              <SelectItem value="RIR_1">RIR 1</SelectItem>
              <SelectItem value="failure">Échec (RIR 0)</SelectItem>
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
              <PopoverContent avoidCollisions collisionPadding={16} className="w-52 text-xs space-y-2 bg-violet-900/95 backdrop-blur-sm border border-white/20 text-white shadow-xl z-[200]">
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
          <Select value={log.quality || 'good'} onValueChange={(v) => !locked && onUpdate('quality', v)}>
            <SelectTrigger className={`w-full h-10 text-xs bg-white/10 border-white/20 ${(log.prefill?.quality || !log.quality) ? 'text-white/50' : 'text-white'}${locked ? ' pointer-events-none' : ''}`}>
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