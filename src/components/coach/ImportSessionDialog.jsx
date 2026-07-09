import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { calcDuration } from '@/lib/duration';
import { useTutorial } from '@/lib/TutorialContext';

const DAYS = [
  { value: 'monday', label: 'Lundi' },
  { value: 'tuesday', label: 'Mardi' },
  { value: 'wednesday', label: 'Mercredi' },
  { value: 'thursday', label: 'Jeudi' },
  { value: 'friday', label: 'Vendredi' },
  { value: 'saturday', label: 'Samedi' },
  { value: 'sunday', label: 'Dimanche' },
];


const parseExercises = (text) => {
  if (!text) return [];
  return text.split(/[,\n;]+/).map(line => line.trim()).filter(Boolean).map(line => {
    // Séries × reps : accepte ×, x, *, "fois", "séries (de)", "series (de)", "sets (de)"
    const setsReps = line.match(/(\d+)\s*(?:[×x*]|fois|séries?(?:\s*de)?|series?(?:\s*de)?|sets?(?:\s*de)?)\s*(\d+(?:\s*[-–]\s*\d+)?)/i);
    // On retire la partie séries×reps AVANT de chercher poids/repos (sinon le "s" de
    // "séries" serait confondu avec des secondes).
    let rest = setsReps ? line.replace(setsReps[0], ' ') : line;

    // Poids : kg ou lbs/livres — on garde la valeur saisie et on note l'unité
    const weightMatch = rest.match(/\(?\s*(\d+(?:[.,]\d+)?)\s*(kg|lbs?|livres?)\s*\)?/i);
    let parsedWeight = null;
    let weightUnit = 'kg';
    if (weightMatch) {
      parsedWeight = parseFloat(weightMatch[1].replace(',', '.'));
      weightUnit = weightMatch[2].toLowerCase()[0] === 'l' ? 'lbs' : 'kg';
      rest = rest.replace(weightMatch[0], ' ');
    }

    const restMatch =
      rest.match(/(\d+)\s*m(?:in|n)?\s*(\d+)\s*s?/i) || // 2m30, 2min30, 2mn30
      rest.match(/(\d+)\s*(?:mn|min)/i) ||               // 2min, 2mn
      rest.match(/(\d+)\s*s(?:ec)?(?!\w)/i);             // 90s, 90sec
    const restSeconds = restMatch
      ? restMatch[2] != null
        ? parseInt(restMatch[1]) * 60 + parseInt(restMatch[2]) // 2m30 = 150s
        : restMatch[0].toLowerCase().match(/mn|min/)
          ? parseInt(restMatch[1]) * 60
          : parseInt(restMatch[1])
      : 90;
    if (restMatch) rest = rest.replace(restMatch[0], ' ');

    // Nettoie les mots/chiffres résiduels pour ne garder que le nom de l'exercice
    const name = rest
      .replace(/\b(?:répétitions?|réps?|reps?|séries?|series?|sets?|fois|repos|kg|lbs?|livres?)\b/gi, ' ')
      .replace(/[,;()]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return {
      name: name || line.trim(),
      sets: setsReps ? parseInt(setsReps[1]) : 3,
      target_reps: setsReps ? setsReps[2].replace(/\s/g, '') : '10',
      target_weight: parsedWeight,
      weight_unit: weightUnit,
      rest_seconds: restSeconds,
      muscle_group: '',
    };
  }).filter(e => e.name);
};

const IMPORT_TUTORIAL_STEPS = [
  {
    target: 'add-session-btn',
    title: 'Ajouter une séance',
    description: 'Appuie ici pour créer une nouvelle séance dans ton programme. Tu peux en ajouter jusqu\'à 14 au total.',
    hideNext: true,
  },
  {
    target: 'session-title-input',
    title: 'Titre de la séance',
    description: 'Donne un nom à ta séance, par exemple "Pectoraux & Triceps" ou "Jambes". Ça t\'aide à t\'y retrouver dans ton programme.',
  },
  {
    target: 'session-content-area',
    title: 'Écris ta séance ici',
    description: 'Entre tes exercices un par ligne. Les indications juste au-dessus te rappellent le format : exercice, séries × reps, repos. Le poids est optionnel.',
    forceBelow: true,
  },
  {
    target: 'session-day-picker',
    title: 'Choisis le jour',
    description: 'Sélectionne le jour où tu veux placer cette séance dans la semaine. Tu peux en mettre deux le même jour si besoin.',
  },
  {
    target: 'session-verify-btn',
    title: 'Vérifie ta séance',
    description: 'Une fois ta séance écrite, appuie sur "Vérifier" pour voir si tous tes exercices ont bien été compris. Tu pourras corriger avant d\'importer.',
    hideNext: true,
  },
  {
    target: 'session-content-area',
    title: 'Tu peux corriger',
    description: 'Voici comment ta séance a été comprise. Si quelque chose ne te convient pas, appuie sur "Modifier" pour réécrire ta séance.',
  },
  {
    target: 'cycle-weeks-slider',
    title: 'Durée du cycle',
    description: 'Choisis sur combien de semaines ton programme se répète. Mets ∞ si tu veux qu\'il tourne en boucle indéfiniment.',
  },
];

export default function ImportSessionDialog({ sessions: initialSessions, onPersist, onClose, isEditing = false, initialWeeks }) {
  const { startTutorial, nextStep, skipStep, wakeTutorial, endTutorial, activeTutorial } = useTutorial() || {};
  const activeTutorialRef = useRef(null);
  activeTutorialRef.current = activeTutorial;
  const _expLen = (initialSessions || []).length || 1;
  const [verified, setVerified] = useState(() => {
    try {
      const f = JSON.parse(localStorage.getItem('_import_form') || 'null');
      if (f?.verified && f?.sessionCount === _expLen) return f.verified;
    } catch {}
    if (!isEditing) return {};
    const v = {};
    (initialSessions || []).forEach((s, i) => { if (s.exercises?.length || s.content?.trim()) v[i] = true; });
    return v;
  });
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [saving, setSaving] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    try { const f = JSON.parse(localStorage.getItem('_import_form') || 'null'); return f?.collapsed || {}; } catch { return {}; }
  });

  const [sessions, setSessions] = useState(() => {
    try {
      const f = JSON.parse(localStorage.getItem('_import_form') || 'null');
      if (f?.sessions?.length && f.sessionCount === _expLen) return f.sessions;
    } catch {}
    return (initialSessions || [{ label: '', day: 'monday', exercises: [] }]).map((s, i) => ({
      _id: i,
      label: s.day_label || s.label || '',
      day: s.day || 'monday',
      exercises: s.exercises || [],
      content: s.content || '',
      type: s.type || 'mixed',
      estimated_duration: s.estimated_duration || 60,
    }));
  });
  const [weeks, setWeeks] = useState(() => {
    try { const f = JSON.parse(localStorage.getItem('_import_form') || 'null'); if (f?.weeks !== undefined && f?.sessionCount === _expLen) return f.weeks; } catch {}
    return initialWeeks !== undefined ? initialWeeks : 'infinite';
  });

  const DAY_ORDER = { monday:0, tuesday:1, wednesday:2, thursday:3, friday:4, saturday:5, sunday:6 };

  // Construit la liste à persister : seules les séances "complètes" (avec exercices)
  // entrent dans le programme — une séance non vérifiée/vide n'y apparaît pas.
  // Pour comparer (a-t-on changé ?) on ne garde que les champs réellement enregistrés
  // → ignore les redondances de l'état brut (content vs exercices, _id, durée stockée…).
  const buildPersistList = () => sessions
    .map(s => {
      const exs = s.exercises?.length ? s.exercises : parseExercises(s.content || '');
      return {
        label: s.label || '', day: s.day, order: s.order, type: s.type,
        exercises: exs, estimated_duration: calcDuration(exs),
      };
    })
    .filter(s => s.exercises.length > 0);

  // Sauvegarde à la fermeture : on capture l'instantané de ce qui SERAIT enregistré,
  // pour ne persister que s'il y a un vrai changement (pas de delete+recreate inutile).
  const initialRef = useRef(null);
  if (initialRef.current === null) initialRef.current = JSON.stringify({ list: buildPersistList(), weeks });

  // Appelé à la fermeture : persiste tout si quelque chose a changé, en affichant
  // un chargement → on ne rouvre le programme qu'une fois la mise à jour terminée
  // (l'utilisateur voit un programme propre, pas le delete+recreate en cours).
  const handleClose = async () => {
    if (saving) return;
    const changed = initialRef.current !== JSON.stringify({ list: buildPersistList(), weeks });
    if (changed) {
      setSaving(true);
      try { await onPersist?.(buildPersistList(), weeks); } catch {}
    }
    onClose?.();
  };

  const updateSession = (i, field, value) => {
    setSessions(prev => {
      const updated = prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s);
      // Si on change l'ordre, inverser automatiquement l'autre séance du même jour
      if (field === 'order') {
        const day = updated[i].day;
        const sibling = updated.findIndex((s, idx) => idx !== i && s.day === day);
        if (sibling !== -1) updated[sibling] = { ...updated[sibling], order: value === 1 ? 2 : 1 };
      }
      // Si on change le jour, recalculer l'ordre et réordonner
      if (field === 'day') {
        const countOnNewDay = updated.filter((s, idx) => idx !== i && s.day === value).length;
        updated[i] = { ...updated[i], order: countOnNewDay + 1 };
        setScrollToId(updated[i]._id);
        return [...updated].sort((a, b) => (DAY_ORDER[a.day] ?? 7) - (DAY_ORDER[b.day] ?? 7));
      }
      return updated;
    });
  };

  const addSession = () => {
    if (sessions.length >= 14) return;
    const dayCounts = {};
    sessions.forEach(s => { dayCounts[s.day] = (dayCounts[s.day] || 0) + 1; });
    const nextDay = DAYS.find(d => (dayCounts[d.value] || 0) === 0)?.value
      || DAYS.find(d => (dayCounts[d.value] || 0) < 2)?.value
      || 'monday';
    const order = (dayCounts[nextDay] || 0) + 1;
    const newId = Date.now();
    setScrollToId(newId);
    setSessions(prev => {
      const next = [...prev, { _id: newId, label: '', day: nextDay, exercises: [], content: '', type: 'mixed', estimated_duration: 60, order }];
      return next.sort((a, b) => (DAY_ORDER[a.day] ?? 7) - (DAY_ORDER[b.day] ?? 7));
    });
  };

  const countForDay = (day, excludeIdx) => sessions.filter((s, i) => i !== excludeIdx && s.day === day).length;

  const removeSession = (i) => {
    setSessions(prev => prev.filter((_, idx) => idx !== i));
  };

  useEffect(() => {
    try { localStorage.setItem('_import_form', JSON.stringify({ sessions, weeks, verified, collapsed, sessionCount: _expLen })); } catch {}
  }, [sessions, weeks, verified, collapsed]); // eslint-disable-line

  // Cache la nav et bloque le swipe de page pendant que le dialog est ouvert
  useEffect(() => {
    const nav = document.querySelector('.mobile-nav');
    if (nav) nav.style.display = 'none';
    window.dispatchEvent(new CustomEvent('swipe-lock', { detail: true }));
    // Bloque les touches sur le bord gauche (<20px) pour empêcher le geste retour iOS
    const blockEdgeTouch = (e) => {
      if (e.touches[0].clientX < 20) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    };
    document.addEventListener('touchstart', blockEdgeTouch, { capture: true, passive: false });
    return () => {
      if (nav) nav.style.display = '';
      window.dispatchEvent(new CustomEvent('swipe-lock', { detail: false }));
      document.removeEventListener('touchstart', blockEdgeTouch, { capture: true });
    };
  }, []); // eslint-disable-line

  useEffect(() => {
    startTutorial?.('import-dialog', IMPORT_TUTORIAL_STEPS);
    // À la fermeture du dialog, marque le tuto comme vu s'il est encore en cours
    // (évite qu'il recommence si l'utilisateur ferme avant d'avoir touché le slider de durée)
    return () => {
      if (activeTutorialRef.current?.id === 'import-dialog') endTutorial?.('import-dialog');
    };
  }, []); // eslint-disable-line

  const listRef = useRef(null);
  const sessionRefs = useRef([]);
  const [scrollToId, setScrollToId] = useState(null);
  const [highlightId, setHighlightId] = useState(null);

  // Sauvegarde la position de scroll à chaque défilement
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const handler = () => { try { localStorage.setItem('_import_scroll', String(el.scrollTop)); } catch {} };
    el.addEventListener('scroll', handler, { passive: true });
    return () => el.removeEventListener('scroll', handler);
  }, []);

  // Restaure la position de scroll au montage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('_import_scroll');
      if (saved && listRef.current) {
        requestAnimationFrame(() => { if (listRef.current) listRef.current.scrollTop = parseInt(saved) || 0; });
      }
    } catch {}
  }, []);

  // Scroll + highlight vers la session ajoutée ou déplacée
  useEffect(() => {
    if (scrollToId === null) return;
    const idx = sessions.findIndex(s => s._id === scrollToId);
    if (idx !== -1 && sessionRefs.current[idx]) {
      requestAnimationFrame(() => {
        sessionRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
      setHighlightId(scrollToId);
      setTimeout(() => setHighlightId(null), 1200);
    }
    setScrollToId(null);
  }, [sessions, scrollToId]); // eslint-disable-line

  return (
    <div data-no-swipe className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm px-3 pb-3" style={{ paddingTop: 'max(env(safe-area-inset-top), 56px)' }} onTouchMove={e => e.stopPropagation()}>
      <div className="w-full max-w-sm rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(160deg, #2e1065, #1e0050)', border: '1px solid rgba(255,255,255,0.15)', height: 'calc(100dvh - max(env(safe-area-inset-top), 56px) - 12px)', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div className="px-5 pt-5 pb-3 border-b border-white/10 flex-shrink-0">
          <h2 className="font-bold text-white text-lg">{isEditing ? 'Modifier le programme' : 'Importer dans le programme'}</h2>
          <p className="text-white/40 text-xs mt-0.5">{isEditing ? 'Modifie tes séances ou ajoutes-en de nouvelles' : 'Choisis les jours et la durée du cycle'}</p>
        </div>

        {/* Sessions */}
        <div ref={listRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-3" style={{ touchAction: 'pan-y', overscrollBehavior: 'contain' }}>
          {sessions.map((s, i) => (
            <div key={i} ref={el => sessionRefs.current[i] = el} className="rounded-2xl p-3 space-y-2 transition-all duration-300" style={{ background: highlightId === s._id ? 'rgba(167,139,250,0.25)' : 'rgba(255,255,255,0.07)', border: highlightId === s._id ? '1px solid rgba(167,139,250,0.6)' : '1px solid rgba(255,255,255,0.12)' }}>
              <div className="flex items-center gap-2">
                <input
                  value={s.label}
                  onChange={e => updateSession(i, 'label', e.target.value)}
                  placeholder="Titre de la séance"
                  maxLength={30}
                  className="flex-1 bg-transparent text-white text-sm font-semibold outline-none placeholder-white/30 min-w-0"
                  {...(i === 0 ? { 'data-tutorial': 'session-title-input' } : {})}
                />
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button onClick={() => setConfirmDelete(i)} className="p-1 rounded-md text-red-300 hover:text-red-200 hover:bg-red-500/20 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCollapsed(c => ({ ...c, [i]: !c[i] }))}
                    className="text-white/40 hover:text-white/70 transition-colors"
                  >
                    {collapsed[i] ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              {collapsed[i] && (() => {
                const exs = s.exercises?.length ? s.exercises : parseExercises(s.content || '');
                return (
                  <div className="flex items-center gap-2 text-xs text-white/40 pb-1">
                    <span>{DAYS.find(d => d.value === s.day)?.label || s.day}</span>
                    <span>·</span>
                    <span>{exs.length} ex.</span>
                    {exs.length > 0 && <><span>·</span><span>{calcDuration(exs)} min</span></>}
                  </div>
                );
              })()}
              {!collapsed[i] && (verified[i] ? (() => {
                const exs = s.exercises?.length ? s.exercises : parseExercises(s.content || '');
                return (
                <div className="w-full bg-white/5 rounded-xl px-3 py-2 mb-2 border border-white/10 space-y-2" {...(i === 0 ? { 'data-tutorial': 'session-content-area' } : {})}>
                  {exs.length > 0 && (
                    <p className="text-white/40 text-xs font-medium">{exs.length} exercices · {calcDuration(exs)} min estimées</p>
                  )}
                  {exs.length === 0
                    ? <p className="text-white/30 text-xs italic">Aucun exercice détecté</p>
                    : exs.map((ex, ei) => (
                      <div key={ei} className="flex flex-col gap-0.5 pb-2 border-b border-white/5 last:border-0 last:pb-0">
                        <p className="text-white text-sm font-semibold">{ex.name}</p>
                        <div className="flex gap-3 text-xs text-white/50">
                          <span>{ex.sets} séries × {ex.target_reps} reps</span>
                          {ex.target_weight && <span>· {ex.target_weight} {ex.weight_unit || 'kg'}</span>}
                          <span>· {ex.rest_seconds}s repos</span>
                        </div>
                      </div>
                    ))
                  }
                  <button onClick={() => { updateSession(i, 'exercises', []); setVerified(v => ({ ...v, [i]: false })); }}
                    className="w-full mt-1.5 py-2 rounded-xl text-xs font-semibold transition-all"
                    style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>
                    Modifier
                  </button>
                </div>
                );
              })() : (
                <div className="mb-2">
                  <div {...(i === 0 ? { 'data-tutorial': 'session-content-area' } : {})}>
                    <p className="text-white/40 text-xs mb-1.5">Exercice, séries × reps, repos. <span className="text-white/25">Le poids est optionnel.</span></p>
                    <textarea
                      value={s.content || ''}
                      onChange={e => updateSession(i, 'content', e.target.value)}
                      placeholder={"Écris ta séance (1 exercice par ligne) puis appuie sur Vérifier pour voir si tout est bien compris."}
                      rows={6}
                      className="w-full bg-white/5 rounded-xl px-3 py-2 text-white text-sm outline-none placeholder-white/25 resize-none leading-relaxed border border-white/10"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setVerified(v => ({ ...v, [i]: true }));
                      // Avance vers l'étape "Tu peux corriger" (état vérifié, bouton Modifier visible)
                      if (i === 0 && activeTutorial?.id === 'import-dialog' && activeTutorial?.currentStep === 4) nextStep?.();
                    }}
                    className="w-full mt-1.5 py-2 rounded-xl text-xs font-semibold transition-all"
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: 'white' }}
                    {...(i === 0 ? { 'data-tutorial': 'session-verify-btn' } : {})}>
                    Vérifier
                  </button>
                </div>
              ))}
              {!collapsed[i] && (<div className="grid grid-cols-7 gap-1" {...(i === 0 ? { 'data-tutorial': 'session-day-picker' } : {})}>
                {DAYS.map(d => {
                  const alreadyTwo = countForDay(d.value, i) >= 2;
                  const isSelected = s.day === d.value;
                  return (
                    <button key={d.value}
                      onClick={() => { if (!alreadyTwo || isSelected) updateSession(i, 'day', d.value); }}
                      className="py-1.5 rounded-lg text-[10px] font-bold transition-all"
                      style={{
                        background: isSelected ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : 'rgba(255,255,255,0.08)',
                        color: isSelected ? 'white' : alreadyTwo ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.5)',
                        opacity: alreadyTwo && !isSelected ? 0.4 : 1,
                      }}>
                      {d.label.slice(0, 2)}
                    </button>
                  );
                })}
              </div>)}
              {!collapsed[i] && countForDay(s.day, i) === 1 && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-white/40 text-xs">Ordre dans la journée :</span>
                  <div className="flex gap-1">
                    {[1,2].map(o => (
                      <button key={o} onClick={() => updateSession(i, 'order', o)}
                        className="px-3 py-1 rounded-lg text-xs font-bold transition-all"
                        style={{
                          background: (s.order || 1) === o ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : 'rgba(255,255,255,0.08)',
                          color: (s.order || 1) === o ? 'white' : 'rgba(255,255,255,0.5)',
                        }}>
                        {o === 1 ? '1ère' : '2ème'}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Ajouter une séance */}
          {sessions.length < 14 && (
            <button data-tutorial="add-session-btn" onClick={() => {
              addSession();
              if (activeTutorial?.id === 'import-dialog') {
                if (activeTutorial.currentStep === 0) nextStep?.();
                else if (activeTutorial.dormant) wakeTutorial?.();
              }
            }}
              className="w-full py-3 rounded-2xl border border-dashed border-white/20 text-white/40 text-sm font-semibold flex items-center justify-center gap-2 hover:border-white/40 hover:text-white/60 transition-all">
              <Plus className="w-4 h-4" />
              Ajouter une séance ({sessions.length}/14)
            </button>
          )}

          {/* Durée — slider */}
          <div className="pt-1" data-tutorial="cycle-weeks-slider">
            <div className="flex items-center justify-between mb-3">
              <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">Durée du cycle</p>
              <span className="font-bold text-white text-lg" style={{ minWidth: 28, textAlign: 'right' }}>
                {weeks === 'infinite' ? '∞' : `${weeks} sem.`}
              </span>
            </div>
            <style>{`
              .weeks-slider { -webkit-appearance: none; appearance: none; width: 100%; height: 6px; border-radius: 99px; outline: none; background: linear-gradient(to right, #7c3aed 0%, #a855f7 var(--pct), rgba(255,255,255,0.12) var(--pct), rgba(255,255,255,0.12) 100%); }
              .weeks-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 24px; height: 24px; border-radius: 50%; background: white; cursor: pointer; box-shadow: 0 2px 8px rgba(124,58,237,0.5); }
              .weeks-slider::-moz-range-thumb { width: 24px; height: 24px; border-radius: 50%; background: white; cursor: pointer; border: none; box-shadow: 0 2px 8px rgba(124,58,237,0.5); }
            `}</style>
            <input
              type="range" min={1} max={11} step={1}
              value={weeks === 'infinite' ? 11 : weeks}
              onChange={e => { const v = parseInt(e.target.value); setWeeks(v === 11 ? 'infinite' : v); }}
              className="weeks-slider"
              style={{ '--pct': `${((weeks === 'infinite' ? 11 : weeks) - 1) / 10 * 100}%` }}
            />
            <div className="relative mt-2 h-6">
              {[{label:'1',step:0},{label:'5',step:4},{label:'10',step:9},{label:'∞',step:10,big:true}].map(t => (
                <span key={t.label} className={`absolute -translate-x-1/2 text-white/70 font-bold ${t.big ? 'text-xl leading-none' : 'text-sm'}`}
                  style={{ left: `calc(${t.step}/10 * (100% - 24px) + 12px)` }}>{t.label}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal confirmation suppression */}
        {confirmDelete !== null && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-3xl">
            <div className="mx-6 rounded-2xl p-6 space-y-4 w-full" style={{ background: 'linear-gradient(160deg, #3b0764, #1e0050)', border: '1px solid rgba(255,255,255,0.15)' }}>
              <div className="text-center space-y-1">
                <p className="font-bold text-white text-base">Supprimer la séance ?</p>
                <p className="text-white/50 text-sm">"{sessions[confirmDelete]?.label || `Séance ${confirmDelete + 1}`}" sera retirée du programme.</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold border border-white/15 text-white/60 hover:bg-white/10 transition-colors"
                >Annuler</button>
                <button
                  onClick={() => {
                    removeSession(confirmDelete);
                    setConfirmDelete(null);
                  }}
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-red-500/80 hover:bg-red-500 transition-colors"
                >Supprimer</button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-5 pt-3 flex-shrink-0 border-t border-white/10" style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 20px)' }}>
          <button
            onClick={handleClose}
            disabled={saving}
            className="w-full py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 disabled:opacity-80"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Mise à jour…</> : 'Fermer'}
          </button>
        </div>
      </div>

      {/* Chargement plein écran pendant la mise à jour du programme */}
      {saving && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4"
          style={{ background: 'rgba(15,5,40,0.82)', backdropFilter: 'blur(4px)' }}>
          <Loader2 className="w-10 h-10 text-violet-300 animate-spin" />
          <p className="text-white/90 text-sm font-semibold">Mise à jour de ton programme…</p>
        </div>
      )}
    </div>
  );
}
