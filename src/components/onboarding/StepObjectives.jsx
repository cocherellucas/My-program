import React, { useState } from 'react';
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
  upper_body: ['Poitrine', 'Dos', 'Épaules', 'Biceps', 'Triceps'],
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
  { value: 'strength', label: 'Force' },
  { value: 'hypertrophy', label: 'Hypertrophie' },
  { value: 'endurance', label: 'Endurance' },
];

const ZONES = [
  { value: 'upper_body', label: 'Haut du corps' },
  { value: 'lower_body', label: 'Bas du corps' },
  { value: 'full_body', label: 'Corps entier' },
  { value: 'specific_group', label: 'Groupe spécifique' },
];

const GROUPS = [
  'Pectoraux', 'Dos', 'Épaules', 'Biceps', 'Triceps',
  'Quadriceps', 'Ischio-jambiers', 'Fessiers', 'Mollets', 'Abdominaux'
];

const MUSCLE_DETAILS = {
  'Pectoraux':       ['Grand pectoral — faisceau claviculaire (haut)', 'Grand pectoral — faisceau sternal (milieu)', 'Grand pectoral — faisceau abdominal (bas)', 'Petit pectoral'],
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

const selectClass = 'h-9 bg-white/20 border-white/40 text-white [&>svg]:opacity-100 [&>svg]:text-white';


export default function StepObjectives({ data, onChange }) {
  const objectives      = data.objectives || [];
  const level           = data.level || 'intermediate';
  const volumeMode      = level === 'beginner' ? 'auto' : (data.volume_mode || 'auto');
  const volumeOverrides = data.volume_overrides || {};
  const primaryType     = objectives.find(o => o.priority === 'primary')?.type || 'hypertrophy';

  const [strengthFocus, setStrengthFocus] = useState({});
  const [detailMode, setDetailMode] = useState({});
  const [expandedGroup, setExpandedGroup] = useState({});

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
    const PREFERRED = [
      ['hypertrophy', 'full_body'],
      ['strength',    'full_body'],
      ['endurance',   'full_body'],
      ['hypertrophy', 'upper_body'],
      ['strength',    'upper_body'],
      ['endurance',   'upper_body'],
      ['hypertrophy', 'lower_body'],
      ['strength',    'lower_body'],
      ['endurance',   'lower_body'],
    ];
    let newType = 'strength';
    let newZone = 'full_body';
    for (const [t, z] of PREFERRED) {
      if (!objectives.some(o => o.type === t && o.zone === z)) {
        newType = t; newZone = z; break;
      }
    }
    onChange({
      objectives: [...objectives, { type: newType, zone: newZone, priority: objectives.length === 0 ? 'primary' : 'secondary', focus_group: '', focus_movement: '' }]
    });
  };

  const isDuplicate = (idx, field, value) => {
    const current = { ...objectives[idx], [field]: value };
    return objectives.some((o, i) =>
      i !== idx &&
      o.type === current.type &&
      o.zone === current.zone &&
      (o.zone !== 'specific_group' || o.focus_group === current.focus_group)
    );
  };

  const updateObj = (idx, field, value) => {
    if ((field === 'type' || field === 'zone' || field === 'focus_group') && isDuplicate(idx, field, value)) return;
    const updated = [...objectives];
    updated[idx] = { ...updated[idx], [field]: value };
    onChange({ objectives: updated });
  };

  const removeObj = (idx) => {
    onChange({ objectives: objectives.filter((_, i) => i !== idx) });
  };

  // Muscles déjà pris par un autre objectif du même type en specific_group
  const getTakenMuscles = (idx) => new Set(
    objectives
      .filter((o, i) => i !== idx && o.type === objectives[idx].type && o.zone === 'specific_group' && Array.isArray(o.focus_group))
      .flatMap(o => o.focus_group)
  );

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
              <span className={cn(
                'text-xs font-bold uppercase px-2.5 py-1 rounded-full',
                obj.priority === 'primary' ? 'bg-white/30 text-white' : 'bg-white/10 text-white/60'
              )}>
                {obj.priority === 'primary' ? 'Primaire' : 'Secondaire'}
              </span>
              <Button variant="ghost" size="icon" onClick={() => removeObj(idx)} className="h-8 w-8 hover:bg-white/10">
                <Trash2 className="w-4 h-4 text-red-400" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Type — avec sous-menu flyout pour Force */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1">
                  <Label className="text-xs text-white">Type</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button type="button" className="text-white/40 hover:text-white/70 transition-colors">
                        <HelpCircle className="w-3 h-3" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 text-xs space-y-1.5">
                      <p><span className="font-semibold">Force</span> — progresser sur des charges maximales (1–5 reps). Adaptations neurologiques et gain de force brute.</p>
                      <p><span className="font-semibold">Hypertrophie</span> — augmenter le volume musculaire (6–12 reps). L'objectif le plus courant.</p>
                      <p><span className="font-semibold">Endurance</span> — résistance musculaire à la fatigue (12+ reps, repos courts).</p>
                    </PopoverContent>
                  </Popover>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button type="button" className={cn(selectClass, 'flex items-center justify-between w-full px-3 h-9 rounded-md border text-sm')}>
                      <span>{TYPES.find(t => t.value === obj.type)?.label || 'Sélectionner'}</span>
                      <ChevronDown className="w-4 h-4 opacity-50" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-violet-800 border-white/20 text-white min-w-[160px]">
                    {/* Force avec sous-menu */}
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="focus:bg-white/20 focus:text-white data-[state=open]:bg-white/20 data-[state=open]:text-white cursor-pointer">
                        Force
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent className="bg-violet-800 border-white/20 text-white">
                        <DropdownMenuItem className="focus:bg-white/20 focus:text-white cursor-pointer"
                          onClick={() => { updateObj(idx, 'type', 'strength'); setStrengthFocus(prev => ({ ...prev, [idx]: 'zone' })); }}>
                          Par zone
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-white/20 focus:text-white cursor-pointer"
                          onClick={() => { updateObj(idx, 'type', 'strength'); setStrengthFocus(prev => ({ ...prev, [idx]: 'movement' })); }}>
                          Par mouvement
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    {/* Hypertrophie */}
                    <DropdownMenuItem
                      className="focus:bg-white/20 focus:text-white cursor-pointer"
                      onClick={() => { updateObj(idx, 'type', 'hypertrophy'); setStrengthFocus(prev => ({ ...prev, [idx]: null })); }}>
                      Hypertrophie
                    </DropdownMenuItem>
                    {/* Endurance */}
                    <DropdownMenuItem
                      className="focus:bg-white/20 focus:text-white cursor-pointer"
                      onClick={() => { updateObj(idx, 'type', 'endurance'); setStrengthFocus(prev => ({ ...prev, [idx]: null })); }}>
                      Endurance
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Zone — sauf pour Force */}
              {obj.type !== 'strength' && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1">
                    <Label className="text-xs text-white">Zone</Label>
                  </div>
                  <Select value={obj.zone} onValueChange={(v) => updateObj(idx, 'zone', v)}>
                    <SelectTrigger className={selectClass}><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {ZONES.map(z => <SelectItem key={z.value} value={z.value}>{z.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Priorité */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1">
                  <Label className="text-xs text-white">Priorité</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button type="button" className="text-white/40 hover:text-white/70 transition-colors">
                        <HelpCircle className="w-3 h-3" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56 text-xs space-y-1.5">
                      <p><span className="font-semibold">Primaire</span> — objectif principal. Le programme lui alloue 60% du volume et structure les séances autour de lui.</p>
                      <p><span className="font-semibold">Secondaire</span> — objectif complémentaire. Travaillé en accessoire sans empiéter sur le primaire.</p>
                    </PopoverContent>
                  </Popover>
                </div>
                <Select value={obj.priority} onValueChange={(v) => updateObj(idx, 'priority', v)}>
                  <SelectTrigger className={selectClass}><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary">Primaire</SelectItem>
                    <SelectItem value="secondary">Secondaire</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Groupes musculaires si specific_group */}
            {obj.zone === 'specific_group' && obj.type !== 'strength' && (() => {
              const base       = Array.isArray(obj.focus_group) ? obj.focus_group : GROUPS;
              const taken      = getTakenMuscles(idx);
              const conflicted = base.filter(g => taken.has(g));
              const isDetail   = !!detailMode[idx];
              const expanded   = expandedGroup[idx] || null;

              return (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-white">Groupes musculaires</Label>
                    <button type="button"
                      onClick={() => {
                        setDetailMode(prev => ({ ...prev, [idx]: !prev[idx] }));
                        setExpandedGroup(prev => ({ ...prev, [idx]: null }));
                      }}
                      className={cn(
                        'flex items-center gap-1 text-xs px-2 py-0.5 rounded-md border transition-all',
                        isDetail
                          ? 'bg-white/20 text-white border-white/40'
                          : 'bg-white/5 text-white/40 border-white/20 hover:text-white/60 hover:border-white/30'
                      )}>
                      <SlidersHorizontal className="w-3 h-3" />
                      Précis
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {GROUPS.map(g => {
                      const isChecked  = base.includes(g);
                      const isConflict = isChecked && taken.has(g);
                      const isExpanded = isDetail && expanded === g;
                      return (
                        <button key={g} type="button"
                          onClick={() => {
                            if (isDetail) {
                              setExpandedGroup(prev => ({ ...prev, [idx]: prev[idx] === g ? null : g }));
                              if (!isChecked) updateObj(idx, 'focus_group', [...base, g]);
                            } else {
                              updateObj(idx, 'focus_group', isChecked ? base.filter(x => x !== g) : [...base, g]);
                            }
                          }}
                          className={cn('px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                            isConflict  ? 'bg-orange-400/20 text-orange-200 border-orange-400/50'
                            : isExpanded ? 'bg-white/40 text-white border-white/60 ring-1 ring-white/30'
                            : isChecked  ? 'bg-white/30 text-white border-white/40'
                            : 'bg-white/10 text-white/40 border-white/20 line-through')}>
                          {g}
                        </button>
                      );
                    })}
                  </div>

                  {/* Détail du groupe sélectionné en mode précis */}
                  {isDetail && expanded && (
                    <div className="p-3 bg-white/5 rounded-lg border border-white/10 space-y-2">
                      <p className="text-xs text-white/60">{expanded} — sélectionne les chefs à cibler :</p>
                      <div className="flex flex-wrap gap-1.5">
                        {(MUSCLE_DETAILS[expanded] || []).map(m => {
                          const focusMuscles = Array.isArray(obj.focus_muscles) ? obj.focus_muscles : [];
                          const isSelected   = focusMuscles.includes(m);
                          return (
                            <button key={m} type="button"
                              onClick={() => updateObj(idx, 'focus_muscles', isSelected
                                ? focusMuscles.filter(x => x !== m)
                                : [...focusMuscles, m])}
                              className={cn('px-2.5 py-1 rounded-md text-xs border transition-all',
                                isSelected
                                  ? 'bg-white/25 text-white border-white/50'
                                  : 'bg-white/5 text-white/40 border-white/10 hover:border-white/30 hover:text-white/70')}>
                              {m}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {conflicted.length > 0 && (
                    <p className="text-xs text-orange-200 bg-orange-400/10 border border-orange-400/30 rounded-lg px-3 py-2">
                      ⚠️ {conflicted.join(', ')} {conflicted.length > 1 ? 'sont déjà sélectionnés' : 'est déjà sélectionné'} dans un autre objectif {obj.type === 'hypertrophy' ? 'Hypertrophie' : 'Force'} — désélectionne-{conflicted.length > 1 ? 'les' : 'le'} pour continuer.
                    </p>
                  )}
                </div>
              );
            })()}

            {/* Force : sélecteur selon le focus choisi dans le menu */}
            {obj.type === 'strength' && strengthFocus[idx] === 'zone' && (
              <div className="space-y-1.5">
                <div className="flex items-center gap-1">
                  <Label className="text-xs text-white">Zone</Label>
                </div>
                <Select value={obj.zone} onValueChange={(v) => updateObj(idx, 'zone', v)}>
                  <SelectTrigger className={selectClass}><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ZONES.map(z => <SelectItem key={z.value} value={z.value}>{z.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}

            {obj.type === 'strength' && strengthFocus[idx] === 'movement' && (
              <div className="space-y-1.5">
                <Label className="text-xs text-white">Mouvement focus</Label>
                <div className="flex flex-wrap gap-2">
                  {['Squat barre','Bench press','Soulevé de terre','Développé militaire','Rowing barre','Traction lestée','Fente barre','Hip thrust barre'].map(mv => (
                    <button key={mv} type="button"
                      onClick={() => updateObj(idx, 'focus_movement', obj.focus_movement === mv ? '' : mv)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                        obj.focus_movement === mv
                          ? 'bg-white text-violet-700 border-white'
                          : 'bg-white/10 text-white/60 border-white/20 hover:border-white/40'
                      )}>
                      {mv}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <Button variant="outline" onClick={addObjective} className="w-full border-white/30 text-white hover:bg-white/10 hover:text-white">
        <Plus className="w-4 h-4 mr-2" />
        Ajouter un objectif
      </Button>

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

      {/* Peaking — affiché uniquement si au moins un objectif force */}
      {objectives.some(o => o.type === 'strength') && (
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
                <PopoverContent className="w-64 text-xs space-y-1.5">
                  <p><span className="font-semibold">Semaine de peaking</span> — dernière semaine du cycle dédiée à tester ton 1RM. Volume réduit de 60%, intensité montée à 90–102% sur les muscles/mouvements force uniquement.</p>
                  <p>Les autres objectifs (hypertrophie, endurance) continuent normalement.</p>
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
            Test 1RM en fin de cycle · réalisé uniquement sur les muscles et mouvements de ton objectif force
          </p>
          {data.peaking_enabled && data.level === 'beginner' && (
            <p className="text-xs text-orange-300 bg-orange-400/10 border border-orange-400/30 rounded-lg px-3 py-2">
              Pour un débutant, les phases de peaking ne sont pas optimales pour la progression — ton système nerveux et tes fondations techniques ne sont pas encore prêts pour des charges maximales. Tu peux l'activer, mais des cycles classiques te feront progresser plus vite.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
