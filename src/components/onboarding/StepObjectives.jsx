import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTutorial } from '@/lib/TutorialContext';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Plus, Trash2, HelpCircle, ChevronDown, Zap, SlidersHorizontal } from 'lucide-react';
import { VOLUME_TABLES, LARGE_MUSCLES } from '@/lib/coaching-engine';
import { useI18n } from '@/lib/i18n';

// Muscles par zone (noms du moteur, pas noms affichés)
const ZONE_MUSCLES_MAP = {
  upper_body: ['Poitrine', 'Dos', 'Épaules', 'Biceps', 'Triceps', 'Abdos'],
  lower_body: ['Quadriceps', 'Ischio-jambiers', 'Fessiers', 'Mollets', 'Adducteurs'],
  full_body:  ['Poitrine', 'Dos', 'Épaules', 'Biceps', 'Triceps', 'Quadriceps', 'Ischio-jambiers', 'Fessiers', 'Mollets', 'Abdos'],
};

// Correspondance nom moteur → nom affiché
const MUSCLE_DISPLAY = {
  'Poitrine': 'Pectoraux', 'Dos': 'Dos', 'Épaules': 'Épaules',
  'Biceps': 'Biceps', 'Triceps': 'Triceps', 'Quadriceps': 'Quadriceps',
  'Ischio-jambiers': 'Ischio', 'Fessiers': 'Fessiers', 'Mollets': 'Mollets',
  'Abdos': 'Abdominaux', 'Adducteurs': 'Adducteurs',
};

// Correspondance noms affichés (GROUPS) → noms moteur
const GROUP_TO_MUSCLE = {
  'Pectoraux': 'Poitrine', 'Abdominaux': 'Abdos',
};

function getMuscleVolumeRef(muscle, level, objType) {
  const size = LARGE_MUSCLES.has(muscle) ? 'large' : 'small';
  const tbl  = (VOLUME_TABLES[objType] || VOLUME_TABLES.hypertrophy)[size]?.[level]
            || VOLUME_TABLES.hypertrophy.large.intermediate;
  return { mev: tbl.MEV, mav: tbl.MAV, mrv: tbl.MRV };
}

// Temps par série (min) par objectif — cohérent avec program-builder
const SET_DUR_BY_LEVEL = {
  strength:    { beginner: 3.5, intermediate: 5,   advanced: 6   },
  hypertrophy: { beginner: 2.2, intermediate: 3,   advanced: 3.5 },
  endurance:   { beginner: 1.8, intermediate: 1.5, advanced: 1.2 },
};
const getSetDurUI = (obj, lvl) =>
  (SET_DUR_BY_LEVEL[obj] || SET_DUR_BY_LEVEL.hypertrophy)[lvl] || 3;
const TRANSITION = 1.5 / 4;
const WARMUP_MIN = 8;

const TYPES = [
  { value: 'strength', label: 'Devenir plus fort' },
  { value: 'hypertrophy', label: 'Prendre du muscle' },
  { value: 'endurance', label: 'Améliorer l\'endurance' },
];

const ZONES = [
  { value: 'full_body', label: 'Corps entier' },
  { value: 'upper_body', label: 'Haut du corps' },
  { value: 'lower_body', label: 'Bas du corps' },
  { value: 'specific_group', label: 'Groupe spécifique' },
];

const GROUPS = [
  'Épaules', 'Pectoraux', 'Dos', 'Biceps', 'Triceps', 'Abdominaux',
  'Fessiers', 'Quadriceps', 'Ischio-jambiers', 'Mollets'
];

const MUSCLE_DETAILS = {
  'Pectoraux':       ['Faisceau claviculaire (haut)', 'Faisceau sternal (milieu)', 'Faisceau abdominal (bas)', 'Petit pectoral'],
  'Dos':             ['Grand dorsal', 'Trapèze (sup. / moy. / inf.)', 'Rhomboïdes', 'Grand rond', 'Érecteurs spinaux (thoracique)', 'Lombaires'],
  'Épaules':         ['Deltoïde antérieur (devant)', 'Deltoïde médian (côté)', 'Deltoïde postérieur (derrière)', 'Coiffe des rotateurs'],
  'Biceps':          ['Chef long (longue portion)', 'Chef court (courte portion)', 'Brachial antérieur', 'Brachio-radial'],
  'Triceps':         ['Chef long', 'Chef médial', 'Chef latéral'],
  'Quadriceps':      ['Droit fémoral', 'Vaste latéral', 'Vaste médial', 'Vaste intermédiaire'],
  'Ischio-jambiers': ['Biceps fémoral (chef long + court)', 'Semi-tendineux', 'Semi-membraneux'],
  'Fessiers':        ['Grand fessier (gluteus maximus)', 'Moyen fessier (gluteus medius)', 'Petit fessier (gluteus minimus)'],
  'Mollets':         ['Gastrocnémien — chef interne', 'Gastrocnémien — chef externe', 'Soléaire'],
  'Abdominaux':      ['Droit abdominal', 'Oblique externe', 'Oblique interne', 'Transverse'],
};

const selectClass = 'h-9 bg-white/20 border-white/40 text-white [&>span]:text-white [&>span[data-placeholder]]:text-white/50 [&>svg]:opacity-100 [&>svg]:text-white';


export default function StepObjectives({ data, onChange }) {
  const { t } = useI18n();
  // Affichage d'un nom de muscle (valeur stockée en FR) dans la langue active
  const mDisp = (name) => { const r = t('m_' + name); return r === 'm_' + name ? name : r; };
  const ZONE_TKEYS = { full_body: 'oj_full_body', upper_body: 'oj_upper', lower_body: 'oj_lower', specific_group: 'oj_specific' };
  const zDisp = (value) => (ZONE_TKEYS[value] ? t(ZONE_TKEYS[value]) : value);
  const objectives      = data.objectives || [];
  const level           = data.level || 'intermediate';
  const volumeMode      = level === 'beginner' ? 'auto' : (data.volume_mode || 'auto');
  const volumeOverrides = data.volume_overrides || {};
  const primaryType     = objectives.find(o => o.priority === 'primary')?.type || 'hypertrophy';

  const [strengthFocus, setStrengthFocus] = useState({});
  const [detailMode, setDetailMode] = useState({});
  const [expandedGroup, setExpandedGroup] = useState({});
  const [mergePrompt, setMergePrompt] = useState(null); // { idx, otherIdx }
  const { startTutorial } = useTutorial() || {};

  // Tuto Step 2 : grosses cartes à choisir
  useEffect(() => {
    if (!startTutorial) return;
    const timer = setTimeout(() => {
      startTutorial('objectives-intro', [
        {
          target: 'big-card',
          title: t('oj_tuto_title'),
          description: t('oj_tuto_d'),
        },
        {
          // Sans cible → bulle centrée. Incite à prioriser le muscle autour d'une
          // douleur (remplace l'intention « Renforcer » des zones sensibles).
          title: t('oj_tuto_pain_title'),
          description: t('oj_tuto_pain_d'),
        },
      ]);
    }, 700);
    return () => clearTimeout(timer);
  }, [startTutorial]); // eslint-disable-line
  const dismissedPairs = React.useRef(new Set());

  // Auto-détection : 2 objectifs du même type + MÊME priorité + zones complémentaires → propose fusion
  useEffect(() => {
    if (mergePrompt) return; // déjà un prompt ouvert
    for (let i = 0; i < objectives.length; i++) {
      for (let j = i + 1; j < objectives.length; j++) {
        const a = objectives[i], b = objectives[j];
        if (a.type !== b.type) continue;
        if (a.priority !== b.priority) continue; // ne pas fusionner principal + secondaire
        // Ignorer si l'un des 2 est en mode "exercice" (force + focus_movement)
        const aMovs = Array.isArray(a.focus_movement) ? a.focus_movement : (a.focus_movement ? [a.focus_movement] : []);
        const bMovs = Array.isArray(b.focus_movement) ? b.focus_movement : (b.focus_movement ? [b.focus_movement] : []);
        if (a.type === 'strength' && (aMovs.length > 0 || bMovs.length > 0)) continue;
        const zones = new Set([a.zone, b.zone]);
        const isComplementary = (zones.has('upper_body') && zones.has('lower_body')) || zones.has('full_body');
        const isSameZone = a.zone === b.zone && a.zone !== 'specific_group';
        if (!isComplementary && !isSameZone) continue;
        const pairKey = `${i}-${j}-${a.type}`;
        if (dismissedPairs.current.has(pairKey)) continue;
        setMergePrompt({ idx: j, otherIdx: i });
        return;
      }
    }
  }, [objectives, mergePrompt]);

  // Au premier montage avec aucun objectif : créer un objectif "vide" (aucun type, aucune zone)
  useEffect(() => {
    if (objectives.length === 0) {
      onChange({
        objectives: [{ type: '', zone: '', priority: 'primary', focus_group: '', focus_movement: '' }]
      });
    }
  }, []); // eslint-disable-line


  // Union des muscles couverts par les objectifs actuels (noms moteur)
  const objectiveMuscles = [...new Set(
    objectives.flatMap(obj => {
      if (obj.zone === 'specific_group' && Array.isArray(obj.focus_group))
        return obj.focus_group.map(g => GROUP_TO_MUSCLE[g] || g);
      return ZONE_MUSCLES_MAP[obj.zone] || ZONE_MUSCLES_MAP.full_body;
    })
  )];

  // Séries totales atteignables par semaine selon les dispo
  const totalAchievable = (data.available_days || []).reduce((sum, day) => {
    const dur  = parseInt(data.duration_per_day?.[day]) || 0;
    const avail = Math.max(0, dur - WARMUP_MIN);
    return sum + Math.floor(avail / (getSetDurUI(primaryType, level) + TRANSITION));
  }, 0);

  const totalRequested = objectiveMuscles.reduce((s, m) => {
    const { mav } = getMuscleVolumeRef(m, level, primaryType);
    return s + (volumeOverrides[m] ?? mav);
  }, 0);

  const setVolumeOverride = (muscle, value) => {
    const { mrv } = getMuscleVolumeRef(muscle, level, primaryType);
    const clamped = Math.min(Math.max(0, value), mrv);
    onChange({ volume_overrides: { ...volumeOverrides, [muscle]: clamped } });
  };

  const addObjective = () => {
    onChange({
      objectives: [...objectives, { type: '', zone: '', priority: objectives.length === 0 ? 'primary' : 'secondary', focus_group: '', focus_movement: '' }]
    });
  };

  const isDuplicate = (idx, field, value) => {
    const current = { ...objectives[idx], [field]: value };
    const currentMovs = Array.isArray(current.focus_movement) ? current.focus_movement : (current.focus_movement ? [current.focus_movement] : []);
    return objectives.some((o, i) => {
      if (i === idx) return false;
      if (o.type !== current.type) return false;
      // Si l'un des 2 objectifs est en mode "exercice", ils ne sont pas duplicates (les exos sont différents)
      const oMovs = Array.isArray(o.focus_movement) ? o.focus_movement : (o.focus_movement ? [o.focus_movement] : []);
      if (o.type === 'strength' && (oMovs.length > 0 || currentMovs.length > 0)) return false;
      // Sinon : duplicate si même zone (et même focus_group pour specific)
      if (o.zone !== current.zone) return false;
      return o.zone !== 'specific_group' || o.focus_group === current.focus_group;
    });
  };

  const updateObj = (idx, field, value) => {
    if ((field === 'type' || field === 'zone' || field === 'focus_group') && isDuplicate(idx, field, value)) return;
    const updated = [...objectives];
    updated[idx] = { ...updated[idx], [field]: value };
    onChange({ objectives: updated });
  };

  const removeObj = (idx) => {
    let remaining = objectives.filter((_, i) => i !== idx);
    // S'il ne reste qu'un seul objectif, le forcer en "primary"
    if (remaining.length === 1) {
      remaining = [{ ...remaining[0], priority: 'primary' }];
    }
    onChange({ objectives: remaining });
  };

  // Muscles déjà pris par un autre objectif du même type (toutes zones confondues)
  const ZONE_TO_GROUPS = {
    upper_body: ['Pectoraux', 'Dos', 'Épaules', 'Biceps', 'Triceps', 'Abdominaux'],
    lower_body: ['Quadriceps', 'Ischio-jambiers', 'Fessiers', 'Mollets'],
    full_body:  ['Pectoraux', 'Dos', 'Épaules', 'Biceps', 'Triceps', 'Quadriceps', 'Ischio-jambiers', 'Fessiers', 'Mollets', 'Abdominaux'],
  };
  const getTakenMuscles = (idx) => {
    const taken = new Set();
    objectives.forEach((o, i) => {
      if (i === idx || o.type !== objectives[idx].type) return;
      // Si l'objectif est en mode "exercice", il ne prend pas de muscles
      const movs = Array.isArray(o.focus_movement) ? o.focus_movement : (o.focus_movement ? [o.focus_movement] : []);
      if (o.type === 'strength' && movs.length > 0) return;
      if (o.zone === 'specific_group' && Array.isArray(o.focus_group)) {
        o.focus_group.forEach(m => taken.add(m));
      } else if (ZONE_TO_GROUPS[o.zone]) {
        ZONE_TO_GROUPS[o.zone].forEach(m => taken.add(m));
      }
    });
    return taken;
  };

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-2xl font-heading font-bold text-white">{t('oj_title')}</h2>
        <p className="text-white/70 mt-1 text-sm">{t('oj_sub')}</p>
        <p className="text-white/40 text-xs mt-3"><span className="text-red-400 font-bold">*</span> {t('sp_required')}</p>
      </div>
      <div className="text-center mb-8 hidden">
      </div>

      <div className="space-y-4">
        {objectives.map((obj, idx) => (
          <div key={idx} className="p-4 bg-white/10 rounded-xl border border-white/20 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {objectives.length > 1 ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button type="button"
                        data-tutorial={idx === 0 ? 'badge-dropdown' : undefined}
                        className={cn(
                          'flex items-center gap-1 text-xs font-bold uppercase px-2.5 py-1 rounded-full transition-colors',
                          obj.priority === 'primary' ? 'bg-white/30 text-white hover:bg-white/40' : 'bg-white/10 text-white/60 hover:bg-white/20'
                        )}>
                        {obj.priority === 'primary' ? `🎯 ${t('oj_fp')}` : `📌 ${t('oj_fs')}`}
                        <ChevronDown className="w-3 h-3 opacity-60" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-violet-800 border-white/20 text-white min-w-[170px]">
                      <DropdownMenuItem
                        className="focus:bg-white/20 focus:text-white cursor-pointer"
                        onClick={() => {
                          // Swap : si un autre objectif du même type est primaire ET sur la même cible (zone OU exercice), on l'inverse
                          const curMovs = Array.isArray(obj.focus_movement) ? obj.focus_movement : (obj.focus_movement ? [obj.focus_movement] : []);
                          const curIsMovement = obj.type === 'strength' && curMovs.length > 0;
                          const otherPrimaryIdx = objectives.findIndex((o, i) => {
                            if (i === idx || o.type !== obj.type || o.priority !== 'primary') return false;
                            // Ne pas swap entre deux strength si l'un est zone et l'autre exercice
                            if (obj.type === 'strength') {
                              const oMovs = Array.isArray(o.focus_movement) ? o.focus_movement : (o.focus_movement ? [o.focus_movement] : []);
                              const otherIsMovement = oMovs.length > 0;
                              if (curIsMovement !== otherIsMovement) return false;
                            }
                            return true;
                          });
                          if (otherPrimaryIdx !== -1) {
                            // Proposer la fusion au lieu du swap
                            setMergePrompt({ idx, otherIdx: otherPrimaryIdx });
                            return;
                            // (code de swap conservé en backup, jamais atteint)
                            const updated = objectives.map((o, i) => {
                              if (i === idx) return { ...o, priority: 'primary' };
                              if (i === otherPrimaryIdx) return { ...o, priority: 'secondary' };
                              return o;
                            });
                            onChange({ objectives: updated });
                          } else {
                            updateObj(idx, 'priority', 'primary');
                          }
                        }}>
                        🎯 {t('oj_fp')}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="focus:bg-white/20 focus:text-white cursor-pointer"
                        onClick={() => updateObj(idx, 'priority', 'secondary')}>
                        📌 {t('oj_fs')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-full bg-white/30 text-white">
                    {t('oj_objective')}
                  </span>
                )}
                {objectives.length > 1 && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <button type="button" className="text-white/40 hover:text-white/70 transition-colors">
                        <HelpCircle className="w-3.5 h-3.5" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-72 text-xs space-y-2">
                      <p className="text-white/60 text-[10px] uppercase tracking-wider font-semibold">{t('oj_toggle_badge')}</p>
                      <div>
                        <p className="font-semibold">🎯 {t('oj_fp')}</p>
                        <p className="text-white/70 mt-0.5">{t('oj_primary_d')}</p>
                      </div>
                      <div>
                        <p className="font-semibold">📌 {t('oj_fs')}</p>
                        <p className="text-white/70 mt-0.5">{t('oj_secondary_d')}</p>
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeObj(idx)} className="h-8 w-8 hover:bg-red-500/20">
                <Trash2 className="w-4 h-4 text-red-300" />
              </Button>
            </div>

            {/* Type — 3 grandes cartes visuelles */}
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Label className="text-sm font-bold text-white">{t('oj_what')} <span className="text-red-400">*</span></Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <button type="button" className="text-white/40 hover:text-white/70 transition-colors">
                      <HelpCircle className="w-3 h-3" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-72 text-xs space-y-2.5">
                    <div>
                      <p className="font-semibold mb-1">💪 {t('oj_hyp')}</p>
                      <p className="text-white/70">{t('oj_hyp_d')}</p>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">🏋️ {t('oj_str')}</p>
                      <p className="text-white/70">{t('oj_str_d')}</p>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">🏃 {t('oj_end')}</p>
                      <p className="text-white/70">{t('oj_end_d')}</p>
                    </div>
                    <div className="pt-2 border-t border-white/15">
                      <p className="font-semibold text-violet-300">🔥 {t('oj_weightloss_q')}</p>
                      <p className="text-white/70 mt-0.5">{t('oj_weightloss')} <span className="font-semibold text-white">{t('oj_hyp')}</span>. {t('oj_weightloss_d')}</p>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2" data-tutorial={idx === 0 ? 'big-card' : undefined}>
                {[
                  { type: 'hypertrophy', emoji: '💪', label: t('oj_hyp'), advantages: t('oj_adv_hyp') },
                  { type: 'strength',    emoji: '🏋️', label: t('oj_str'), advantages: t('oj_adv_str') },
                  { type: 'endurance',   emoji: '🏃', label: t('oj_end'), advantages: t('oj_adv_end') },
                ].map(({ type, emoji, label, advantages }) => {
                  const selected = obj.type === type;
                  // Vérifier si tous les muscles de ce type sont déjà pris par un autre objectif
                  const ZONE_TO_GROUPS_LOC = {
                    upper_body: ['Pectoraux', 'Dos', 'Épaules', 'Biceps', 'Triceps', 'Abdominaux'],
                    lower_body: ['Quadriceps', 'Ischio-jambiers', 'Fessiers', 'Mollets'],
                    full_body:  ['Pectoraux', 'Dos', 'Épaules', 'Biceps', 'Triceps', 'Quadriceps', 'Ischio-jambiers', 'Fessiers', 'Mollets', 'Abdominaux'],
                  };
                  const TYPE_LABEL = { hypertrophy: t('oj_hyp'), strength: t('oj_str'), endurance: t('oj_end') };
                  const takenBy = []; // indices des objectifs qui prennent ce type
                  const taken = new Set();
                  objectives.forEach((o, i) => {
                    if (i === idx || o.type !== type) return;
                    // Si l'objectif est en mode "exercice" (force + focus_movement), il ne prend pas de muscles
                    const movs = Array.isArray(o.focus_movement) ? o.focus_movement : (o.focus_movement ? [o.focus_movement] : []);
                    if (o.type === 'strength' && movs.length > 0) return;
                    let muscles = [];
                    if (o.zone === 'specific_group' && Array.isArray(o.focus_group)) muscles = o.focus_group;
                    else if (ZONE_TO_GROUPS_LOC[o.zone]) muscles = ZONE_TO_GROUPS_LOC[o.zone];
                    if (muscles.length > 0) {
                      takenBy.push(i);
                      muscles.forEach(m => taken.add(m));
                    }
                  });
                  const allTaken = taken.size >= GROUPS.length;

                  return (
                    <button key={type} type="button"
                      disabled={allTaken}
                      onClick={() => {
                        if (allTaken) return;
                        updateObj(idx, 'type', type);
                        setStrengthFocus(prev => ({ ...prev, [idx]: type === 'strength' ? 'zone' : null }));
                      }}
                      className={cn(
                        'w-full flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all relative',
                        selected
                          ? 'border-white bg-violet-500'
                          : allTaken
                            ? 'border-white/10 bg-white/5 opacity-40 cursor-not-allowed'
                            : 'border-violet-300/60 bg-[#8b45f8]/70 opacity-75 hover:opacity-100 hover:border-white'
                      )}>
                      <span className="text-3xl leading-none flex-shrink-0 mt-0.5">{emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white leading-tight">{label}</p>
                        {allTaken && !selected ? (
                          <p className="text-[11px] text-white/50 mt-1 italic">
                            {t('oj_all_taken').replace('{type}', TYPE_LABEL[type])}
                          </p>
                        ) : (
                          <ul className="mt-1.5 space-y-0.5">
                            {advantages.map(a => (
                              <li key={a} className="text-xs text-white/75 leading-tight flex items-start gap-1">
                                <span className="text-white/40 flex-shrink-0">·</span>
                                <span>{a}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Sous-choix Force : Zone ou Exercice */}
              {obj.type === 'strength' && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button type="button"
                    onClick={() => setStrengthFocus(prev => ({ ...prev, [idx]: 'zone' }))}
                    className={cn('px-3 py-2 rounded-lg border text-xs font-medium transition-all',
                      (strengthFocus[idx] || 'zone') === 'zone'
                        ? 'bg-white text-violet-700 border-white'
                        : 'bg-white/10 text-white border-white/20')}>
                    {t('oj_on_zone')}
                  </button>
                  <button type="button"
                    onClick={() => {
                      setStrengthFocus(prev => ({ ...prev, [idx]: 'movement' }));
                      // Auto-sélectionner SBD (Squat, Bench, Deadlift) si focus_movement est vide
                      const curMovs = Array.isArray(obj.focus_movement) ? obj.focus_movement : (obj.focus_movement ? [obj.focus_movement] : []);
                      if (curMovs.length === 0) {
                        // Filtrer ce qui n'est pas déjà pris par un autre objectif force
                        const SBD = ['Squat barre', 'Développé couché', 'Soulevé de terre'];
                        const takenByOthers = new Set(
                          objectives.flatMap((o, i) => {
                            if (i === idx || o.type !== 'strength') return [];
                            return Array.isArray(o.focus_movement) ? o.focus_movement : (o.focus_movement ? [o.focus_movement] : []);
                          })
                        );
                        const available = SBD.filter(m => !takenByOthers.has(m));
                        if (available.length > 0) updateObj(idx, 'focus_movement', available);
                      }
                    }}
                    className={cn('px-3 py-2 rounded-lg border text-xs font-medium transition-all',
                      strengthFocus[idx] === 'movement'
                        ? 'bg-white text-violet-700 border-white'
                        : 'bg-white/10 text-white border-white/20')}>
                    {t('oj_on_exercise')}
                  </button>
                </div>
              )}
            </div>

            {/* Zone — visible quand un type est choisi, sauf Force en mode "exercice" */}
            {obj.type && (obj.type !== 'strength' || (strengthFocus[idx] || 'zone') === 'zone') && (() => {
              // Filtre les zones pour éviter les overlaps avec autres objectifs du même type
              const ZONE_TO_MUSCLES = {
                upper_body: new Set(['Poitrine', 'Dos', 'Épaules', 'Biceps', 'Triceps', 'Abdos']),
                lower_body: new Set(['Quadriceps', 'Ischio-jambiers', 'Fessiers', 'Mollets', 'Adducteurs']),
                full_body:  new Set(['Poitrine', 'Dos', 'Épaules', 'Biceps', 'Triceps', 'Quadriceps', 'Ischio-jambiers', 'Fessiers', 'Mollets', 'Abdos']),
              };
              const otherMuscles = new Set();
              let hasSameTypeOther = false;
              objectives.forEach((o, i) => {
                if (i === idx || o.type !== obj.type) return;
                hasSameTypeOther = true;
                // Si l'objectif est en mode "exercice", il ne prend pas de muscles
                const movs = Array.isArray(o.focus_movement) ? o.focus_movement : (o.focus_movement ? [o.focus_movement] : []);
                if (o.type === 'strength' && movs.length > 0) return;
                if (o.zone === 'specific_group') {
                  const fg = Array.isArray(o.focus_group) ? o.focus_group : (o.focus_group ? [o.focus_group] : []);
                  fg.forEach(m => otherMuscles.add(m));
                } else if (ZONE_TO_MUSCLES[o.zone]) {
                  ZONE_TO_MUSCLES[o.zone].forEach(m => otherMuscles.add(m));
                }
              });
              const availableZones = ZONES.filter(z => {
                // Si un autre objectif du même type existe, exclure Corps entier (overlap garanti)
                if (hasSameTypeOther && z.value === 'full_body') return false;
                if (z.value === 'specific_group') return true; // toujours dispo (filtrage muscle plus fin)
                const muscles = ZONE_TO_MUSCLES[z.value];
                if (!muscles) return true;
                // Zone OK si AUCUN de ses muscles n'est déjà pris
                return ![...muscles].some(m => otherMuscles.has(m));
              });
              // Si la zone courante n'est plus valide (déjà choisie + devenue invalide), basculer.
              // En revanche, on NE PRÉ-SÉLECTIONNE PAS si l'utilisateur n'a rien choisi (zone vide).
              const currentZoneInvalid = obj.zone && !availableZones.some(z => z.value === obj.zone);
              if (currentZoneInvalid && availableZones.length > 0) {
                const newZone = availableZones[0].value;
                Promise.resolve().then(() => {
                  updateObj(idx, 'zone', newZone);
                  if (newZone === 'specific_group') {
                    const currentFg = Array.isArray(obj.focus_group) ? obj.focus_group : [];
                    if (currentFg.length === 0) {
                      const allAvailable = GROUPS.filter(g => !getTakenMuscles(idx).has(g));
                      updateObj(idx, 'focus_group', allAvailable);
                    }
                  }
                });
              }
              return (
                <div className="space-y-1.5">
                  <Label className="text-sm font-bold text-white">{t('oj_onwhat')} <span className="text-red-400">*</span></Label>
                  <Select value={obj.zone} onValueChange={(v) => {
                    updateObj(idx, 'zone', v);
                    // Si passage en specific_group, auto-fill focus_group avec tous les muscles dispos
                    // (sinon le système croit qu'aucun muscle n'est pris alors que l'UI affiche tout sélectionné)
                    if (v === 'specific_group') {
                      const taken = getTakenMuscles(idx);
                      const currentFg = Array.isArray(obj.focus_group) ? obj.focus_group : [];
                      if (currentFg.length === 0) {
                        const allAvailable = GROUPS.filter(g => !taken.has(g));
                        updateObj(idx, 'focus_group', allAvailable);
                      }
                    }
                  }}>
                    <SelectTrigger className={selectClass}><SelectValue placeholder={t('oj_select')} /></SelectTrigger>
                    <SelectContent>
                      {availableZones.map(z => <SelectItem key={z.value} value={z.value}>{zDisp(z.value)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              );
            })()}

            {/* Groupes musculaires si specific_group */}
            {obj.zone === 'specific_group' && (obj.type !== 'strength' || (strengthFocus[idx] || 'zone') === 'zone') && (() => {
              const taken = getTakenMuscles(idx);
              // Base par défaut : tous les muscles MOINS ceux pris ailleurs
              const base  = Array.isArray(obj.focus_group) ? obj.focus_group.filter(g => !taken.has(g)) : GROUPS.filter(g => !taken.has(g));

              return (
                <div className="space-y-2">
                  <Label className="text-xs text-white">{t('oj_muscles')}</Label>
                  <p className="text-[11px] text-white/50">{t('oj_muscles_hint')}</p>

                  <div className="flex flex-wrap gap-2">
                    {GROUPS.map(g => {
                      const isTaken    = taken.has(g);
                      const isChecked  = base.includes(g);
                      const isConflict = isTaken; // pris ailleurs → toujours barré, jamais cliquable
                      return (
                        <button key={g} type="button"
                          disabled={isTaken}
                          onClick={() => {
                            if (isTaken) return;
                            updateObj(idx, 'focus_group', isChecked ? base.filter(x => x !== g) : [...base, g]);
                          }}
                          className={cn('px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                            isConflict  ? 'bg-white/5 text-white/30 border-white/15 line-through cursor-not-allowed'
                            : isChecked  ? 'bg-white/30 text-white border-white/40'
                            : 'bg-white/10 text-white/40 border-white/20 line-through')}>
                          {mDisp(g)}
                        </button>
                      );
                    })}
                  </div>

                </div>
              );
            })()}

            {obj.type === 'strength' && strengthFocus[idx] === 'movement' && (
              <div className="space-y-2">
                <Label className="text-xs text-white">{t('oj_focus_move')}</Label>
                <p className="text-[11px] text-white/50">{t('oj_focus_move_hint')}</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: t('oj_mv_squat'),  value: 'Squat barre' },
                    { label: t('oj_mv_bench'),  value: 'Développé couché' },
                    { label: t('oj_mv_dl'),     value: 'Soulevé de terre' },
                    { label: t('oj_mv_pullup'), value: 'Traction lestée' },
                  ].map(({ label, value }) => {
                    const current = Array.isArray(obj.focus_movement)
                      ? obj.focus_movement
                      : (obj.focus_movement ? [obj.focus_movement] : []);
                    const selected = current.includes(value);
                    // Détection : ce mouvement est-il déjà pris par un autre objectif force ?
                    const takenByOther = objectives.some((o, i) => {
                      if (i === idx || o.type !== 'strength') return false;
                      const oMovs = Array.isArray(o.focus_movement) ? o.focus_movement : (o.focus_movement ? [o.focus_movement] : []);
                      return oMovs.includes(value);
                    });
                    return (
                      <button key={value} type="button"
                        disabled={takenByOther}
                        onClick={() => {
                          if (takenByOther) return;
                          const next = selected
                            ? current.filter(v => v !== value)
                            : [...current, value];
                          updateObj(idx, 'focus_movement', next);
                        }}
                        className={cn(
                          'flex items-center justify-center px-3 py-3 rounded-xl border-2 transition-all text-center text-sm font-semibold',
                          selected
                            ? 'bg-white text-violet-700 border-white shadow'
                            : takenByOther
                              ? 'bg-white/5 text-white/30 border-white/15 line-through cursor-not-allowed'
                              : 'bg-white/10 text-white/40 border-white/20 hover:border-white/40 line-through'
                        )}>
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {objectives.length < 3 ? (
        <Button variant="outline" onClick={addObjective} className="w-full border-white/30 text-white hover:bg-white/10 hover:text-white">
          <Plus className="w-4 h-4 mr-2" />
          {t('oj_add')} {objectives.length > 0 && <span className="ml-1 opacity-60">({objectives.length}/3)</span>}
        </Button>
      ) : (
        <div className="text-center py-3 px-4 rounded-xl bg-white/5 border border-white/10">
          <p className="text-xs text-white/60">
            <span className="font-semibold text-white">{t('oj_max3')}</span> {t('oj_max3_d')}
          </p>
        </div>
      )}

      {/* Volume précis — affiché uniquement en mode manuel */}
      {volumeMode === 'manual' && objectiveMuscles.length > 0 && (
        <div className="p-4 bg-white/10 rounded-xl border border-white/20 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-white">{t('oj_sets_muscle')}</p>
            <p className="text-xs text-white/40">MEV · MAV · MRV</p>
          </div>
          <div className="space-y-2">
            {objectiveMuscles.map(muscle => {
              const { mev, mav, mrv } = getMuscleVolumeRef(muscle, level, primaryType);
              const val = volumeOverrides[muscle] ?? mav;
              const zone = val < mev ? 'below' : val <= mav ? 'mev' : val <= mrv ? 'mav' : 'over';
              const valColor = { below: 'text-red-300', mev: 'text-yellow-300', mav: 'text-green-300', over: 'text-orange-300' }[zone];
              return (
                <div key={muscle} className="flex items-center gap-3">
                  <span className="text-xs text-white w-20 flex-shrink-0">{mDisp(muscle)}</span>
                  <span className="text-xs text-white/25 flex-1 text-right tabular-nums">{mev}·{mav}·{mrv}</span>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button type="button" onClick={() => setVolumeOverride(muscle, val - 1)}
                      className="w-6 h-6 rounded bg-white/10 text-white/60 hover:bg-white/20 flex items-center justify-center text-sm leading-none">−</button>
                    <span className={cn('w-7 text-center text-sm font-bold tabular-nums', valColor)}>{val}</span>
                    <button type="button" onClick={() => setVolumeOverride(muscle, val + 1)}
                      className="w-6 h-6 rounded bg-white/10 text-white/60 hover:bg-white/20 flex items-center justify-center text-sm leading-none">+</button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className={cn('flex items-center justify-between pt-2 border-t border-white/10 text-xs font-medium',
            totalRequested > totalAchievable ? 'text-red-300' : 'text-green-300')}>
            <span>{t('oj_requested')} : {totalRequested} {t('oj_sets_wk')}</span>
            <span>{t('oj_available')} : {totalAchievable === 0 ? '—' : totalAchievable + ' ' + t('oj_sets_wk')}</span>
          </div>
          {totalRequested > totalAchievable && totalAchievable > 0 && (
            <p className="text-xs text-red-300">
              ⚠️ +{totalRequested - totalAchievable} {t('oj_overage')}
            </p>
          )}
          <p className="text-xs text-white/30">{t('oj_distribute')}</p>
        </div>
      )}

      {/* Peaking — affiché uniquement si au moins un objectif force ET pas débutant */}
      {objectives.some(o => o.type === 'strength') && data.level !== 'beginner' && (
        <div className="p-4 bg-white/10 rounded-xl border border-white/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-semibold text-white">{t('oj_peaking')}</span>
              <Popover>
                <PopoverTrigger asChild>
                  <button type="button" className="text-white/40 hover:text-white/70 transition-colors">
                    <HelpCircle className="w-3 h-3" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-72 text-xs space-y-2">
                  <div>
                    <p className="font-semibold">⚡ {t('oj_peaking')}</p>
                    <p className="text-white/70 mt-0.5">{t('oj_peaking_d1')}</p>
                  </div>
                  <div>
                    <p className="text-white/70">{t('oj_peaking_d2')}</p>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <button
              type="button"
              onClick={() => onChange({ peaking_enabled: !data.peaking_enabled })}
              className={cn(
                'relative inline-flex h-6 w-11 items-center rounded-full border-2 transition-colors',
                data.peaking_enabled
                  ? 'bg-yellow-400/80 border-yellow-300/60'
                  : 'bg-white/10 border-white/20'
              )}
            >
              <span className={cn(
                'inline-block h-4 w-4 rounded-full bg-white shadow transition-transform',
                data.peaking_enabled ? 'translate-x-5' : 'translate-x-0.5'
              )} />
            </button>
          </div>
          <p className="text-xs text-white/50">
            {t('oj_peaking_toggle_d')}
          </p>
        </div>
      )}

      {/* Modal proposant la fusion de 2 objectifs au lieu du swap principal/secondaire */}
      {mergePrompt && (() => {
        const curObj = objectives[mergePrompt.idx];
        const otherObj = objectives[mergePrompt.otherIdx];
        const TYPE_LABEL = { hypertrophy: t('oj_hyp'), strength: t('oj_str'), endurance: t('oj_end') };
        return createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <div className="w-full max-w-sm rounded-2xl p-5 space-y-4" style={{ background: 'linear-gradient(160deg, #2e1065, #1e0050)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <div>
                <p className="text-base font-bold text-white">{t('oj_dup_title')}</p>
                <p className="text-xs text-white/70 mt-1">
                  {(() => { const parts = t('oj_dup_d').split('{type}'); return <>{parts[0]}<span className="font-semibold text-white">{TYPE_LABEL[curObj.type]}</span>{parts[1]}</>; })()}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    // Fusion : merger l'autre dans cur (cur garde l'idx, l'autre est supprimé)
                    // Priorité = primary si au moins un des deux était primary, sinon secondary
                    const mergedPriority = (curObj.priority === 'primary' || otherObj.priority === 'primary') ? 'primary' : 'secondary';
                    const merged = { ...otherObj, priority: mergedPriority };
                    // Merge focus_movement (arrays/strings)
                    const curMovs = Array.isArray(curObj.focus_movement) ? curObj.focus_movement : (curObj.focus_movement ? [curObj.focus_movement] : []);
                    const otherMovs = Array.isArray(otherObj.focus_movement) ? otherObj.focus_movement : (otherObj.focus_movement ? [otherObj.focus_movement] : []);
                    merged.focus_movement = [...new Set([...otherMovs, ...curMovs])];
                    // Détection de zones complémentaires
                    const zones = new Set([curObj.zone, otherObj.zone]);
                    if (zones.has('full_body') || (zones.has('upper_body') && zones.has('lower_body'))) {
                      // Combo qui couvre tout le corps → Corps entier
                      merged.zone = 'full_body';
                      merged.focus_group = '';
                    } else if (zones.has('specific_group')) {
                      // Au moins un est specific_group → merger en specific_group
                      const expandToGroups = (o) => {
                        if (o.zone === 'specific_group' && Array.isArray(o.focus_group)) return o.focus_group;
                        if (o.zone === 'upper_body') return ['Épaules', 'Pectoraux', 'Dos', 'Biceps', 'Triceps', 'Abdominaux'];
                        if (o.zone === 'lower_body') return ['Fessiers', 'Quadriceps', 'Ischio-jambiers', 'Mollets'];
                        if (o.zone === 'full_body') return GROUPS;
                        return [];
                      };
                      merged.zone = 'specific_group';
                      merged.focus_group = [...new Set([...expandToGroups(curObj), ...expandToGroups(otherObj)])];
                    } else if (curObj.zone === otherObj.zone) {
                      // Même zone → on garde
                      merged.zone = curObj.zone;
                    } else {
                      // Zones différentes mais pas couvrant tout → garder la plus large
                      merged.zone = otherObj.zone;
                    }
                    // Supprimer cur, garder l'autre fusionné
                    const next = objectives.map((o, i) => i === mergePrompt.otherIdx ? merged : o).filter((_, i) => i !== mergePrompt.idx);
                    onChange({ objectives: next });
                    setMergePrompt(null);
                  }}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold bg-white text-violet-700 hover:bg-white/90 transition-colors">
                  {t('oj_merge')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // Mémoriser le dismiss pour ne pas re-prompter
                    const i = Math.min(mergePrompt.idx, mergePrompt.otherIdx);
                    const j = Math.max(mergePrompt.idx, mergePrompt.otherIdx);
                    dismissedPairs.current.add(`${i}-${j}-${curObj.type}`);
                    setMergePrompt(null);
                  }}
                  className="w-full py-2.5 rounded-xl text-sm font-medium bg-white/10 text-white/70 hover:bg-white/20 transition-colors">
                  {t('oj_cancel')}
                </button>
              </div>
            </div>
          </div>,
          document.body
        );
      })()}
    </div>
  );
}
