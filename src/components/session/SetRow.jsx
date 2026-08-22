import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { OU, QUAND, COMMENT, composerNote } from '@/lib/pain-choices';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { HelpCircle, AlertTriangle, Send, Loader2 } from 'lucide-react';
import { computeTargetRIR, ririLabel, rirToMode } from '@/lib/rir-optimizer';
import ReactMarkdown from 'react-markdown';
import { useI18n } from '@/lib/i18n';

// Tables de CLÉS : le texte vit dans le dictionnaire (`zl_*`, `se_q_*`), qui
// portait déjà les mêmes libellés de son côté — deux sources pour un seul écran.
const ZONE_TKEYS = {
  wrists: 'zl_wrists', shoulders: 'zl_shoulders', elbows: 'zl_elbows',
  knees: 'zl_knees', lower_back: 'zl_lower_back', neck: 'zl_neck',
};

// (QUALITY_LABELS et MODE_LABELS vivaient ici sans être lus nulle part dans
// src/ — supprimés plutôt que traduits.)

// Champ numérique UNCONTROLLED : React n'écrit jamais value pendant la frappe.
// Le DOM gère le curseur nativement, et on commit au blur.
function LocalNumberInput({ value, onCommit, placeholder, decimal = false, readOnly, className, onEnter }) {
  const ref = React.useRef(null);
  const focusedRef = React.useRef(false);

  // Sync prop → DOM UNIQUEMENT quand on n'est pas focus (pour ne pas casser la frappe).
  // 0 est une valeur VALIDE et doit s'afficher : au poids du corps la charge vaut
  // bel et bien 0 kg, et 0 répétition dit qu'une série a été manquée. Le champ le
  // traitait comme vide et l'effaçait aussitôt saisi.
  React.useEffect(() => {
    if (!ref.current) return;
    if (focusedRef.current) return; // ne touche pas pendant la frappe
    const next = (value === undefined || value === null || value === '') ? '' : String(value);
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
      defaultValue={(value === undefined || value === null || value === '') ? '' : String(value)}
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

export default function SetRow({ exerciseName, suiviPayant = false, setIdx, totalSets, log, onUpdate, onWeightBlur, onWeightPropagate, rirContext, previousWeight, previousReps, previousMode, previousQuality, nextWeights, exerciseFragileZones = [], locked = false, onAskCoach }) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [manuallyEdited, setManuallyEdited] = useState(false);
  const [propagated, setPropagated] = useState(false);
  const [showPain, setShowPain] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [painThread, setPainThread] = useState([]); // [{ role: 'user'|'ai', text }]
  const [painWhere, setPainWhere] = useState('');
  const [painWhen, setPainWhen] = useState('');
  const [painHow, setPainHow] = useState('');
  // (plus de champ « Autres » : il partait au coach, pas au moteur)

  // Avertissement « le suivi fait partie du plan Coach ». Remontré à CHAQUE
  // ouverture, et volontairement non mémorisé : rouvrir le panneau après
  // l'avoir écarté, c'est justement changer d'avis.
  const [avertissementVu, setAvertissementVu] = useState(false);
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
        <span className="text-sm font-bold text-white">{t('se_set')} {setIdx + 1}</span>
        <button
          onClick={() => {
            setShowPain(p => !p);
            // Toute (ré)ouverture réaffiche l'avertissement.
            setAvertissementVu(false);
          }}
          className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border transition-all ${
            showPain || log.pain_note
              ? 'border-red-400/60 bg-red-500/20 text-red-300'
              : 'border-white/20 text-white/40 hover:text-white/70 hover:border-white/40'
          }`}>
          <AlertTriangle className="w-3 h-3" />
          {t('se_pain_q')}
        </button>
      </div>

      {/* Avertissement AVANT le formulaire, pour un compte sans le suivi.
          Il tombait après les trois champs remplis : l'utilisateur découvrait
          qu'il fallait payer une fois le travail fait. Ici il sait d'abord, et
          décide. Ce n'est PAS un blocage — il peut continuer, et les trois cas
          de gravité lui répondront gratuitement quoi qu'il arrive. */}
      {showPain && suiviPayant && !avertissementVu && (
        <div className="p-3 rounded-xl bg-violet-500/20 border border-violet-400/40 space-y-2.5">
          <p className="text-xs text-white/85 leading-relaxed">{t('se_pain_notice')}</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => navigate('/pricing')}
              className="text-xs font-bold px-3 py-2 rounded-lg bg-white text-violet-700 hover:bg-white/90 transition-colors">
              {t('se_pain_locked_cta')}
            </button>
            <button
              type="button"
              onClick={() => setAvertissementVu(true)}
              className="text-xs font-medium px-3 py-2 rounded-lg bg-white/10 text-white/80 border border-white/20 hover:bg-white/20 transition-colors">
              {t('se_pain_notice_skip')}
            </button>
          </div>
        </div>
      )}

      {showPain && !(suiviPayant && !avertissementVu) && (() => {
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
                  {!!msg.text && (
                    <div className="text-sm text-white leading-relaxed [&_strong]:font-bold [&_p]:mb-1 [&_p:last-child]:mb-0">
                      {msg.role === 'ai' ? <ReactMarkdown>{msg.text}</ReactMarkdown> : msg.text}
                    </div>
                  )}
                  {msg.paywall && (
                    <div className={msg.text ? 'mt-3 pt-3 border-t border-white/15' : ''}>
                      <p className="text-sm text-white/80 leading-relaxed">{t('se_pain_locked')}</p>
                      <button
                        type="button"
                        onClick={() => navigate('/pricing')}
                        className="mt-2.5 w-full py-2 rounded-lg bg-white text-violet-700 text-xs font-bold hover:bg-white/90 transition-colors"
                      >
                        {t('se_pain_locked_cta')}
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {lastMsgRole === 'ai' && !aiLoading && (
                <button
                  type="button"
                  onClick={() => { setPainThread([]); onUpdate('pain_note', ''); }}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/15 text-white border border-white/25 hover:bg-white/25 transition-colors"
                >
                  ↩ {t('se_restart')}
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
              <div className="space-y-2.5">
                {/* Des choix, pas du texte libre : le moteur cherche des
                    mots-clés, et un mot manqué le faisait répondre « continue »
                    — y compris sur un craquement décrit autrement. */}
                {[
                  { id: 'where', label: t('se_pain_where'), choix: OU, value: painWhere, set: setPainWhere },
                  { id: 'when', label: t('se_pain_when'), choix: QUAND, value: painWhen, set: setPainWhen },
                  { id: 'how', label: t('se_pain_how'), choix: COMMENT, value: painHow, set: setPainHow },
                ].map(({ id, label, choix, value, set }) => (
                  <div key={id}>
                    <p className="text-[11px] text-white/50 mb-1">{label}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {choix.map((c) => {
                        const texte = t(c.tk);
                        const actif = value === texte;
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onPointerDown={(e) => { e.preventDefault(); set(actif ? '' : texte); }}
                            className={`text-[11px] font-medium px-2.5 py-1.5 rounded-lg border transition-colors ${
                              actif
                                ? (c.grave ? 'bg-red-500 text-white border-red-400' : 'bg-white text-violet-700 border-white')
                                : (c.grave
                                  ? 'bg-red-500/15 text-red-200 border-red-400/40 hover:bg-red-500/25'
                                  : 'bg-white/10 text-white/80 border-white/20 hover:bg-white/20')
                            }`}>
                            {texte}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Ex-champ « Autres ». Décrire une situation particulière en
                    texte libre n'avait pas de sens ici : le moteur n'en faisait
                    rien. On emmène l'utilisateur au coach, avec le contexte de
                    l'exercice et de la série déjà écrit — il n'a qu'à finir la
                    phrase. */}
                <button
                  type="button"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    const contexte = `${exerciseName || ''}, ${t('se_set').toLowerCase()} ${setIdx + 1} — ${t('pd_coach_prefix')} `;
                    navigate('/coach', { state: { importText: contexte } });
                  }}
                  className="w-full flex items-center justify-center gap-1.5 text-[11px] font-medium text-white/60 hover:text-white/90 py-1.5 transition-colors">
                  {t('pd_coach')} →
                </button>
                <button
                  disabled={!painWhere.trim() || !painWhen.trim() || !painHow.trim()}
                  onPointerDown={async (e) => {
                    e.preventDefault();
                    if (!painWhere.trim() || !painWhen.trim() || !painHow.trim() || !onAskCoach) return;
                    const msg = composerNote({ ou: painWhere, quand: painWhen, comment: painHow });
                    onUpdate('pain_note', msg);
                    const newThread = [{ role: 'user', text: msg }];
                    setPainThread(newThread);
                    setAiLoading(true);
                    try {
                      // `onAskCoach` répond soit une chaîne (conseil complet),
                      // soit { text?, paywall } quand le plan ne couvre pas le
                      // suivi douleur — un conseil de gravité peut accompagner
                      // le mur, d'où le texte optionnel.
                      const reply = await onAskCoach(msg, setIdx, newThread);
                      const answer = typeof reply === 'string' ? { text: reply } : (reply || {});
                      // `prev`, pas `t` : `t` est la fonction de traduction du
                      // composant, et la masquer ici interdisait de traduire le
                      // message d'erreur juste en dessous.
                      setPainThread(prev => [...prev, { role: 'ai', text: answer.text || '', paywall: !!answer.paywall }]);
                    } catch {
                      setPainThread(prev => [...prev, { role: 'ai', text: t('se_pain_error') }]);
                    } finally {
                      setAiLoading(false);
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-red-500/30 border border-red-400/40 text-red-200 text-xs font-medium disabled:opacity-40 transition-all hover:bg-red-500/50"
                >
                  <Send className="w-3 h-3" />
                  {t('se_send_coach')}
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
             // onWeightBlur auto-remplit les séries suivantes VIDES. Si une série suivante a
             // déjà un poids DIFFÉRENT, on garde manuallyEdited=true pour proposer « Propager »
             // (écraser). Le reset se fait au clic sur Propager, ou sur Entrée (onEnter).
             setManuallyEdited(true);
             // `v !== ''` et non `if (v)` : 0 kg est une charge valide (poids du
             // corps), la tester en booléen empêchait de la reporter.
             if (v !== '') onWeightBlur?.(v);
           }}
           className={`flex h-10 w-full rounded-md border bg-white/10 border-white/20 ${(locked || log.prefill?.weight) ? 'text-white/50' : 'text-white'} placeholder:text-white/35 text-sm text-center px-3 py-1 shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring`}
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
    className="relative overflow-hidden inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-[11px] font-semibold shadow-md hover:bg-white/30 active:scale-95 transition-all"
  >
    <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/50 to-transparent motion-safe:animate-shine" />
    <span className="relative">↓ Propager</span>
  </button>
) : (
  <span className="text-white/50">{t('se_kg')}</span>
)}
          </div>
        </div>
        <div>
          <LocalNumberInput
           placeholder={(log.reps && log.reps !== 0) ? String(log.reps) : (previousReps ? `${previousReps}` : '')}
           value={log.reps}
           readOnly={locked}
           onCommit={(v) => onUpdate('reps', v === '' ? '' : v)}
           className={`flex h-10 w-full rounded-md border bg-white/10 border-white/20 ${(locked || log.prefill?.reps) ? 'text-white/50' : 'text-white'} placeholder:text-white/35 text-sm text-center px-3 py-1 shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring`}
          />
          <span className="text-xs text-white/50 text-center block mt-1">{t('se_reps_label')}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Select value={log.mode || previousMode || defaultMode} onValueChange={(v) => !locked && onUpdate('mode', v)}>
            <SelectTrigger className={`w-full h-10 text-xs bg-white/10 border-white/20 ${(locked || log.prefill?.mode || (!log.mode && !log.done)) ? 'text-white/50' : 'text-white'}${locked ? ' pointer-events-none' : ''}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="RIR_3+">RIR 3+</SelectItem>
              <SelectItem value="RIR_2">RIR 2</SelectItem>
              <SelectItem value="RIR_1">RIR 1</SelectItem>
              <SelectItem value="failure">{t('se_failure_rir0')}</SelectItem>
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
                <p>{t('se_rir_help')}</p>
                <div className="space-y-1 pt-2 border-t border-white/20">
                  <p><span className="font-medium">RIR 0</span> = {t('se_rir_0')}</p>
                  <p><span className="font-medium">RIR 1</span> = {t('se_rir_1')}</p>
                  <p><span className="font-medium">RIR 2</span> = {t('se_rir_2')}</p>
                  <p><span className="font-medium">RIR 3+</span> = {t('se_rir_3')}</p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div>
          <Select value={log.quality || 'good'} onValueChange={(v) => !locked && onUpdate('quality', v)}>
            <SelectTrigger className={`w-full h-10 text-xs bg-white/10 border-white/20 ${(locked || log.prefill?.quality || (!log.quality && !log.done)) ? 'text-white/50' : 'text-white'}${locked ? ' pointer-events-none' : ''}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="good">{t('se_q_good')}</SelectItem>
              <SelectItem value="degraded">{t('se_q_degraded')}</SelectItem>
              <SelectItem value="bad">{t('se_q_bad')}</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-xs text-white/50 text-center block mt-1">{t('se_execution')}</span>
        </div>
      </div>

      {/* Warning zone fragile si exécution dégradée */}
      {exerciseFragileZones.length > 0 && (log.quality === 'degraded' || log.quality === 'bad') && (
        <div className="space-y-1.5">
          {exerciseFragileZones.map(z => (
            <div key={z.key} className="flex items-start gap-2 px-3 py-2 rounded-lg bg-red-500/15 border border-red-400/40 text-xs text-red-200">
              <span className="mt-0.5">⚠️</span>
              <div>
                <span className="font-semibold">{(ZONE_TKEYS[z.key] ? t(ZONE_TKEYS[z.key]) : z.key)} — {z.goal === 'protect' ? t('se_zone_fragile') : t('se_zone_strengthen')} : </span>
                {z.goal === 'protect' ? t('se_zone_fragile_d') : t('se_zone_strengthen_d')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}