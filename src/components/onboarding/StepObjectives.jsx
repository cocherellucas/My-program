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
    const t = setTimeout(() => {
      startTutorial('objectives-intro', [
        {
          target: 'big-card',
          title: 'Sélectionner une option',
          description: 'Clique sur une carte pour la choisir. La carte sélectionnée a une bordure blanche bien visible. Tu peux changer à tout moment.',
        },
      ]);
    }, 700);
    return () => clearTimeout(t);
  }, [startTutorial]);
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
        <h2 className="text-2xl font-heading font-bold text-white">Tes objectifs</h2>
        <p className="text-white/70 mt-1 text-sm">Qu'est-ce que tu veux accomplir ?</p>
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
                        {obj.priority === 'primary' ? '🎯 Focus principal' : '📌 Focus secondaire'}
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
                        🎯 Focus principal
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="focus:bg-white/20 focus:text-white cursor-pointer"
                        onClick={() => updateObj(idx, 'priority', 'secondary')}>
                        📌 Focus secondaire
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-full bg-white/30 text-white">
                    Objectif
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
                      <p className="text-white/60 text-[10px] uppercase tracking-wider font-semibold">Clique sur le badge pour basculer</p>
                      <div>
                        <p className="font-semibold">🎯 Focus principal</p>
                        <p className="text-white/70 mt-0.5">Objectif central, progression plus rapide. Tu peux en avoir plusieurs s'ils ont la même importance pour toi.</p>
                      </div>
                      <div>
                        <p className="font-semibold">📌 Focus secondaire</p>
                        <p className="text-white/70 mt-0.5">Objectif d'appoint, en complément. Un focus principal aura toujours plus de volume qu'un secondaire.</p>
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeObj(idx)} className="h-8 w-8 hover:bg-white/10">
                <Trash2 className="w-4 h-4 text-red-400" />
              </Button>
            </div>

            {/* Type — 3 grandes cartes visuelles */}
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Label className="text-sm font-bold text-white">Que veux-tu faire ?</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <button type="button" className="text-white/40 hover:text-white/70 transition-colors">
                      <HelpCircle className="w-3 h-3" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-72 text-xs space-y-2.5">
                    <div>
                      <p className="font-semibold mb-1">💪 Prendre du muscle <span className="text-white/50 font-normal">(hypertrophie)</span></p>
                      <p className="text-white/70">Volume musculaire visible, meilleure composition corporelle, métabolisme plus élevé. L'objectif le plus courant.</p>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">🏋️ Devenir plus fort <span className="text-white/50 font-normal">(force)</span></p>
                      <p className="text-white/70">Soulever plus lourd, articulations et tendons renforcés, meilleure posture, performance sportive.</p>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">🏃 Améliorer l'endurance</p>
                      <p className="text-white/70">Tenir plus longtemps sans fatigue, meilleure récupération entre les séries, cardio renforcé.</p>
                    </div>
                    <div className="pt-2 border-t border-white/15">
                      <p className="font-semibold text-violet-300">🔥 Tu veux perdre du poids ?</p>
                      <p className="text-white/70 mt-0.5">Choisis <span className="font-semibold text-white">Prendre du muscle</span>. Le muscle brûle des calories au repos et préserve ton physique en déficit. La perte de poids = 80% diététique.</p>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2" data-tutorial={idx === 0 ? 'big-card' : undefined}>
                {[
                  { type: 'hypertrophy', emoji: '💪', label: 'Prendre du muscle',   advantages: ['Look tonique', 'Métabolisme ↑', 'Brûle les graisses au repos'] },
                  { type: 'strength',    emoji: '🏋️', label: 'Devenir plus fort',   advantages: ['Articulations solides', 'Meilleure posture', 'Performance sportive'] },
                  { type: 'endurance',   emoji: '🏃', label: 'Améliorer endurance', advantages: ['Cardio renforcé', 'Récupération rapide', 'Tenir plus longtemps'] },
                ].map(({ type, emoji, label, advantages }) => {
                  const selected = obj.type === type;
                  // Vérifier si tous les muscles de ce type sont déjà pris par un autre objectif
                  const ZONE_TO_GROUPS_LOC = {
                    upper_body: ['Pectoraux', 'Dos', 'Épaules', 'Biceps', 'Triceps', 'Abdominaux'],
                    lower_body: ['Quadriceps', 'Ischio-jambiers', 'Fessiers', 'Mollets'],
                    full_body:  ['Pectoraux', 'Dos', 'Épaules', 'Biceps', 'Triceps', 'Quadriceps', 'Ischio-jambiers', 'Fessiers', 'Mollets', 'Abdominaux'],
                  };
                  const TYPE_LABEL = { hypertrophy: 'Prendre du muscle', strength: 'Devenir plus fort', endurance: 'Améliorer endurance' };
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
                            Tous les muscles sont déjà couverts par ton autre objectif {TYPE_LABEL[type]}. Retire des muscles pour libérer ce type.
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
                    Sur une zone du corps
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
                    Sur un exercice
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
                  <Label className="text-sm font-bold text-white">Sur quoi ?</Label>
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
                    <SelectTrigger className={selectClass}><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                    <SelectContent>
                      {availableZones.map(z => <SelectItem key={z.value} value={z.value}>{z.label}</SelectItem>)}
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
                  <Label className="text-xs text-white">Groupes musculaires</Label>
                  <p className="text-[11px] text-white/50">Clique sur un muscle pour le retirer du programme.</p>

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
                          {g}
                        </button>
                      );
                    })}
                  </div>

                </div>
              );
            })()}

            {obj.type === 'strength' && strengthFocus[idx] === 'movement' && (
              <div className="space-y-2">
                <Label className="text-xs text-white">Mouvement focus</Label>
                <p className="text-[11px] text-white/50">Clique sur un exercice pour le retirer du programme.</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Squat',            value: 'Squat barre' },
                    { label: 'Développé couché', value: 'Développé couché' },
                    { label: 'Soulevé de terre', value: 'Soulevé de terre' },
                    { label: 'Traction',         value: 'Traction lestée' },
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
          Ajouter un objectif {objectives.length > 0 && <span className="ml-1 opacity-60">({objectives.length}/3)</span>}
        </Button>
      ) : (
        <div className="text-center py-3 px-4 rounded-xl bg-white/5 border border-white/10">
          <p className="text-xs text-white/60">
            <span className="font-semibold text-white">3 objectifs maximum</span> — au-delà, le programme manquerait de focus et chaque objectif progresserait moins.
          </p>
        </div>
      )}

      {/* Volume précis — affiché uniquement en mode manuel */}
      {volumeMode === 'manual' && objectiveMuscles.length > 0 && (
        <div className="p-4 bg-white/10 rounded-xl border border-white/20 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-white">Séries par muscle / semaine</p>
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
                  <span className="text-xs text-white w-20 flex-shrink-0">{MUSCLE_DISPLAY[muscle] || muscle}</span>
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
            <span>Demandé : {totalRequested} séries/sem</span>
            <span>Disponible : {totalAchievable === 0 ? '—' : totalAchievable + ' séries/sem'}</span>
          </div>
          {totalRequested > totalAchievable && totalAchievable > 0 && (
            <p className="text-xs text-red-300">
              ⚠️ +{totalRequested - totalAchievable} séries au-delà de tes disponibilités — le programme réduira proportionnellement chaque muscle.
            </p>
          )}
          <p className="text-xs text-white/30">Le programme répartit automatiquement ces séries sur tes jours disponibles.</p>
        </div>
      )}

      {/* Peaking — affiché uniquement si au moins un objectif force ET pas débutant */}
      {objectives.some(o => o.type === 'strength') && data.level !== 'beginner' && (
        <div className="p-4 bg-white/10 rounded-xl border border-white/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-semibold text-white">Semaine de peaking</span>
              <Popover>
                <PopoverTrigger asChild>
                  <button type="button" className="text-white/40 hover:text-white/70 transition-colors">
                    <HelpCircle className="w-3 h-3" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-72 text-xs space-y-2">
                  <div>
                    <p className="font-semibold">⚡ Semaine de peaking</p>
                    <p className="text-white/70 mt-0.5">La dernière semaine du cycle d'entraînement, tu testes ta force max <span className="font-semibold text-white">sur une répétition</span>.</p>
                  </div>
                  <div>
                    <p className="text-white/70">On réduit fortement le volume <span className="font-semibold text-white">sur tous tes objectifs</span> (force, hypertrophie, endurance) pour que ton corps soit complètement reposé. La fatigue accumulée par n'importe quel entraînement empêche d'exprimer sa vraie force max.</p>
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
            Tester ta force max en fin de cycle d'entraînement · volume réduit partout pour optimiser ta récupération
          </p>
        </div>
      )}

      {/* Modal proposant la fusion de 2 objectifs au lieu du swap principal/secondaire */}
      {mergePrompt && (() => {
        const curObj = objectives[mergePrompt.idx];
        const otherObj = objectives[mergePrompt.otherIdx];
        const TYPE_LABEL = { hypertrophy: 'Prendre du muscle', strength: 'Devenir plus fort', endurance: 'Améliorer endurance' };
        return createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <div className="w-full max-w-sm rounded-2xl p-5 space-y-4" style={{ background: 'linear-gradient(160deg, #2e1065, #1e0050)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <div>
                <p className="text-base font-bold text-white">Deux objectifs identiques</p>
                <p className="text-xs text-white/70 mt-1">
                  Tu as déjà un objectif <span className="font-semibold text-white">{TYPE_LABEL[curObj.type]}</span> en focus principal. Tu peux les combiner en un seul pour réunir tous tes exercices ou muscles au même endroit.
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
                  ✨ Fusionner en un seul objectif
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
                  Annuler
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
