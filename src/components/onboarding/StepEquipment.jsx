import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Dumbbell, Home, PersonStanding, Settings2, Search, ChevronDown, ChevronUp, ArrowRight, ArrowLeft, CheckCheck } from 'lucide-react';
import { GYM_CHAINS_UI, getGymPreset } from '@/lib/gym-presets';

const CONTEXTS = [
  { key: 'full_gym',    label: 'Salle complète', icon: Dumbbell,       desc: 'Tout le matériel' },
  { key: 'home_barbell',label: 'Home Gym',        icon: Home,           desc: 'Entraînement à domicile' },
  { key: 'bodyweight',  label: 'Poids du corps',  icon: PersonStanding, desc: 'Parc de street workout' },
  { key: 'custom',      label: 'Personnalisé',    icon: Settings2,      desc: 'Je choisis mon matériel' },
];

// Vue "Par type de matériel" — chaque item apparaît une seule fois
const EQUIPMENT_BY_TYPE = [
  {
    group: 'Barres & Racks',
    items: ['Barre olympique','Barre EZ','Barre trap/hex','Trap bar','Rack squat','Rack demi-cage','Smith machine','Banc plat','Banc réglable','Banc décliné'],
  },
  {
    group: 'Poids libres',
    items: ['Haltères','Kettlebells','Disques olympiques','Medicine ball','Wall ball','Bulgarian bag'],
  },
  {
    group: 'Câbles & Poulies',
    items: ['Câble poulie haute','Câble poulie basse','Station câbles double','Poulie réglable'],
  },
  {
    group: 'Machines guidées',
    items: [
      'Pec deck','Développé couché machine','Développé incliné machine','Dips assistés machine',
      'Tirage vertical','Rowing assis machine','Rowing horizontal machine','Pullover machine','GHD','Rowing T-bar machine',
      'Développé épaules machine','Élévations latérales machine','Élévations frontales machine',
      'Curl biceps machine','Preacher curl machine',
      'Triceps machine','Dips triceps machine',
      'Leg press','Hack squat machine','Leg extension','Belt squat machine',
      'Leg curl allongé','Leg curl assis','Hip thrust machine','Fessier machine',
      'Abducteur machine','Adducteur machine',
      'Mollets debout machine','Mollets assis machine',
      'Crunch abdos machine','Rotation obliques machine','Chaise romaine','Captain chair',
    ],
  },
  {
    group: 'Suspension & Traction',
    items: ['Barre de traction','Anneaux de gymnaste','Sangles TRX','Barre de dips','Barres parallèles'],
  },
  {
    group: 'Accessoires & Lestage',
    items: ['Élastiques de résistance','Mini-bands','Swiss ball','Gilet lesté','Ceinture de lest','Sac à dos lesté','Roulette abdominale','Corde à sauter','Boîte pliométrique','Kettlebell'],
  },
];


const ALL_EQUIPMENT = [...new Set(EQUIPMENT_BY_TYPE.flatMap(g => g.items))];

const STREET_EQUIPMENT = ['Barre de traction haute','Barres parallèles','Barre basse','Anneaux de gymnaste','Sangles de suspension (TRX)','Élastiques de résistance','Gilet lesté','Ceinture de lest','Sac à dos lesté'];
const STREET_DEFAULT  = ['Barre de traction haute','Barres parallèles','Barre basse'];

const PRESETS = {
  full_gym:     ALL_EQUIPMENT,
  home_barbell: ['Barre olympique','Rack squat','Banc réglable','Haltères','Barre de traction','Élastiques de résistance'],
  bodyweight:   STREET_DEFAULT,
  custom:       [],
};

const CONTEXT_SUMMARY = {
  full_gym:     'Accès à tout — machines, poids libres, câbles. Programme sans contrainte matérielle.',
  home_barbell: 'Barre olympique, rack, banc réglable, haltères, barre de traction et élastiques.',
};

function EquipItem({ item, selected, onToggle }) {
  return (
    <button type="button" onClick={() => onToggle(item)}
      className={cn('flex items-center gap-2 px-3 py-2 rounded-lg border text-left text-xs transition-all',
        selected ? 'border-white bg-white/20 text-white' : 'border-white/20 bg-white/5 text-white/60 hover:border-white/40')}>
      <div className={cn('w-4 h-4 rounded flex items-center justify-center border-2 flex-shrink-0 text-[10px]',
        selected ? 'bg-white border-white text-violet-700' : 'border-white/30')}>
        {selected && '✓'}
      </div>
      {item}
    </button>
  );
}

function GroupSection({ group, items, equipment, onToggle, onToggleAll, forceOpen }) {
  const [open, setOpen] = useState(false);
  const selectedCount = items.filter(i => equipment.includes(i)).length;
  const isOpen = forceOpen || open;
  const allSelected = selectedCount === items.length;

  return (
    <div className="border border-white/15 rounded-lg overflow-hidden">
      <button type="button" onClick={() => !forceOpen && setOpen(o => !o)}
        className="w-full flex items-center justify-between px-3 py-2 bg-white/8 hover:bg-white/12 transition-colors">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm text-white/90">{group}</span>
          {selectedCount > 0 && (
            <span className="text-[10px] bg-violet-400/50 text-white px-2 py-0.5 rounded-full font-bold">
              {selectedCount} sélectionné{selectedCount > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isOpen && (
            <span
              role="button"
              onClick={(e) => { e.stopPropagation(); onToggleAll?.(items, allSelected); }}
              className="text-[10px] font-semibold px-2 py-0.5 rounded-md text-white/80 bg-white/10 hover:bg-white/20 transition-colors">
              {allSelected ? 'Tout décocher' : 'Tout cocher'}
            </span>
          )}
          {!forceOpen && (isOpen ? <ChevronUp className="w-3.5 h-3.5 text-white/40" /> : <ChevronDown className="w-3.5 h-3.5 text-white/40" />)}
        </div>
      </button>
      {isOpen && (
        <div className="p-3 flex flex-wrap gap-2 bg-white/3">
          {items.map(item => (
            <EquipItem key={item} item={item} selected={equipment.includes(item)} onToggle={onToggle} />
          ))}
        </div>
      )}
    </div>
  );
}

function LetterSection({ letter, items, equipment, onToggle, forceOpen }) {
  const [open, setOpen] = useState(false);
  const selectedCount = items.filter(i => equipment.includes(i)).length;
  const isOpen = forceOpen || open;

  return (
    <div className="border border-white/15 rounded-lg overflow-hidden">
      <button type="button" onClick={() => !forceOpen && setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-white/10 hover:bg-white/15 transition-colors">
        <div className="flex items-center gap-3">
          <span className="font-bold text-base text-white w-5">{letter}</span>
          <span className="text-xs text-white/50">{items.length} équipement{items.length > 1 ? 's' : ''}</span>
          {selectedCount > 0 && (
            <span className="text-[10px] bg-violet-400/50 text-white px-2 py-0.5 rounded-full font-bold">
              {selectedCount} sélectionné{selectedCount > 1 ? 's' : ''}
            </span>
          )}
        </div>
        {!forceOpen && (isOpen ? <ChevronUp className="w-3.5 h-3.5 text-white/40" /> : <ChevronDown className="w-3.5 h-3.5 text-white/40" />)}
      </button>
      {isOpen && (
        <div className="p-3 flex flex-wrap gap-2 bg-white/5">
          {items.map(item => (
            <EquipItem key={item} item={item} selected={equipment.includes(item)} onToggle={onToggle} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function StepEquipment({ data, onChange }) {
  const context = data.training_context || '';
  const equipment = (() => {
    const raw = data.equipment;
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    try { return JSON.parse(raw) || []; } catch { return []; }
  })();

  const [search, setSearch] = useState('');
  const [view, setView] = useState('material');
  const [validated, setValidated] = useState(false);
  const [fading, setFading] = useState(false);
  const [showContextPicker, setShowContextPicker] = useState(false);
  const [verifyingPreset, setVerifyingPreset] = useState(false);
  const [showGymPicker, setShowGymPicker] = useState(() => {
    // Si full_gym sans équipement (retour de step), réafficher le picker d'enseignes
    return data.training_context === 'full_gym' && (!data.equipment || data.equipment.length === 0);
  });
  const selectedChain = data.gym_chain || null;
  const setSelectedChain = (chain) => onChange({ gym_chain: chain });
  const lastValidatedRef = useRef(context ? equipment : null);

  useEffect(() => { lastValidatedRef.current = context ? equipment : null; }, [context]); // eslint-disable-line

  const hasChanged = lastValidatedRef.current === null ||
    JSON.stringify(equipment) !== JSON.stringify(lastValidatedRef.current);

  const handleValidate = () => {
    lastValidatedRef.current = [...equipment];
    onChange({ equipment_validated: true });
    setValidated(true);
    setTimeout(() => {
      setValidated(false);
      setFading(true);
      setTimeout(() => setFading(false), 500);
    }, 1800);
  };

  const selectContext = (ctx) => {
    setVerifyingPreset(false);
    if (ctx === 'full_gym') {
      setShowGymPicker(true);
      setSelectedChain(null);
      onChange({ training_context: 'full_gym', equipment: [], equipment_validated: false });
    } else {
      setShowGymPicker(false);
      setSelectedChain(null);
      onChange({ training_context: ctx, equipment: PRESETS[ctx] || [], equipment_validated: false });
    }
    setSearch('');
  };
  const selectGymChain = (chainKey) => {
    setShowGymPicker(false);
    setSelectedChain(chainKey);
    const eq = chainKey === 'all' ? ALL_EQUIPMENT : (getGymPreset(chainKey)?.equipment ?? ALL_EQUIPMENT);
    onChange({ equipment: eq, equipment_validated: false });
  };
  const verifyPreset = () => { setVerifyingPreset(true); setSearch(''); onChange({ equipment_validated: false }); };
  const toggleEquip = (item) => {
    onChange({ equipment: equipment.includes(item) ? equipment.filter(e => e !== item) : [...equipment, item], equipment_validated: false });
  };

  const filteredByType = useMemo(() => {
    if (!search) return EQUIPMENT_BY_TYPE;
    return EQUIPMENT_BY_TYPE.map(g => ({
      ...g,
      items: g.items.filter(i => i.toLowerCase().includes(search.toLowerCase())),
    })).filter(g => g.items.length > 0);
  }, [search]);

  const filteredAZ = useMemo(() => {
    const items = search ? ALL_EQUIPMENT.filter(i => i.toLowerCase().includes(search.toLowerCase())) : ALL_EQUIPMENT;
    return [...items].sort((a, b) => a.localeCompare(b, 'fr'));
  }, [search]);

  const VIEWS = [
    { key: 'material', label: 'Matériel' },
    { key: 'az',       label: 'A → Z' },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-heading font-bold text-white">Ton équipement</h2>
        <p className="text-white/70 mt-2">Où t'entraînes-tu ?</p>
      </div>

      {context && !showGymPicker && !showContextPicker ? (
        /* Mode compact — ligne unique récapitulative avec bouton Changer */
        <div className="flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-white/10 border border-white/20">
          <p className="text-sm text-white/90 truncate">
            Tu t'entraînes en <span className="font-bold text-white">{CONTEXTS.find(c => c.key === context)?.label}</span>
          </p>
          <button type="button" onClick={() => setShowContextPicker(true)}
            className="flex items-center gap-1 text-xs text-white/70 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-all flex-shrink-0">
            Changer
          </button>
        </div>
      ) : (
        /* Mode initial / Changer — 4 grosses cartes avec bouton retour */
        <div className="space-y-3">
          {context && showContextPicker && (
            <button type="button" onClick={() => setShowContextPicker(false)}
              className="flex items-center gap-1 text-xs text-white/60 hover:text-white transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Retour
            </button>
          )}
          <div className="grid grid-cols-2 gap-3">
            {CONTEXTS.map(({ key, label, icon: Icon, desc }) => (
              <button key={key} type="button" onClick={() => { selectContext(key); setShowContextPicker(false); }}
                className={cn('flex flex-col items-center gap-2 p-3 rounded-xl border-2 text-center transition-all',
                  context === key
                    ? 'border-white bg-violet-500'
                    : 'border-violet-300/60 bg-[#8b45f8]/70 opacity-75 hover:opacity-100 hover:border-white')}>
                <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center',
                  context === key ? 'bg-white text-violet-600' : 'bg-violet-500 text-white')}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-semibold text-sm text-white block">{label}</span>
                  <p className="text-xs text-white/70">{desc}</p>
                </div>
              </button>
            ))}
          </div>

        </div>
      )}

      {context === 'full_gym' && showGymPicker && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-white/80 mb-1">Quelle est ta salle ?</p>

          {/* Enseigne actuellement sélectionnée — pinnée en haut en mode "sélectionné" */}
          {selectedChain && selectedChain !== 'all' && (() => {
            const cur = GYM_CHAINS_UI.find(c => c.key === selectedChain);
            if (!cur) return null;
            return (
              <button type="button" onClick={() => selectGymChain(cur.key)}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 border-white bg-white/20 transition-all text-left mb-2">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: cur.color }} />
                <span className="text-xs font-semibold text-white">{cur.label}</span>
                <span className="ml-auto text-[10px] uppercase tracking-wider text-white/60 font-bold">Sélectionnée</span>
              </button>
            );
          })()}

          <div className="grid grid-cols-2 gap-2">
            {GYM_CHAINS_UI.filter(chain => chain.key !== selectedChain).map(chain => (
              <button key={chain.key} type="button" onClick={() => selectGymChain(chain.key)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-white/25 bg-white/10 hover:bg-white/20 transition-all text-left">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: chain.color }} />
                <span className="text-xs font-semibold text-white">{chain.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {context && CONTEXT_SUMMARY[context] && !showGymPicker && !showContextPicker && !verifyingPreset && (
        <div className="bg-white/10 rounded-xl border border-white/20 overflow-hidden">
          {/* Chip enseigne au-dessus */}
          {(selectedChain && selectedChain !== 'all') || ((!selectedChain || selectedChain === 'all') && context === 'full_gym') ? (
            <div className="px-4 pt-3 pb-1">
              {selectedChain && selectedChain !== 'all' && (() => {
                const cur = GYM_CHAINS_UI.find(c => c.key === selectedChain);
                return (
                  <button type="button" onClick={() => {
                    setShowGymPicker(true);
                    setSelectedChain(null);
                    onChange({ equipment: [], equipment_validated: false });
                  }}
                    className="w-full flex items-center gap-2 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/25 px-3 py-2 rounded-lg transition-all">
                    {cur?.color && <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: cur.color }} />}
                    <span className="flex-1 text-left">{selectedChain}</span>
                    <span className="text-white/50 text-xs">✕</span>
                  </button>
                );
              })()}
              {(!selectedChain || selectedChain === 'all') && context === 'full_gym' && (
                <button type="button" onClick={() => {
                  setShowGymPicker(true);
                  setSelectedChain(null);
                  onChange({ equipment: [], equipment_validated: false });
                }}
                  className="w-full flex items-center justify-between gap-2 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/25 px-3 py-2 rounded-lg transition-all">
                  <span>Ma salle</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : null}

          <div className="flex items-center justify-between gap-2 px-4 pt-2 pb-2">
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <CheckCheck className="w-4 h-4 text-green-400 flex-shrink-0" />
              <p className="text-xs font-semibold text-white/70 uppercase tracking-wider whitespace-nowrap">
                {equipment.length} équipements
              </p>
            </div>
          </div>
          <div className="px-4 pb-3 flex flex-wrap gap-1.5">
            {equipment.slice(0, 10).map(item => (
              <span key={item} className="text-[10px] bg-white/15 text-white/80 px-2 py-0.5 rounded-full">{item}</span>
            ))}
          </div>
          <div className="px-4 pb-3">
            <button type="button" onClick={verifyPreset}
              className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-white border border-white/40 hover:bg-white/10 px-3 py-2.5 rounded-lg transition-all">
              Vérifier l'équipement sélectionné
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {context === 'bodyweight' && !showContextPicker && (
        <div className="space-y-3">
          <Label className="text-white">Équipement du parc</Label>
          <p className="text-xs text-white/50">Les éléments cochés sont présents dans la plupart des parcs.</p>
          <div className="flex flex-wrap gap-2">
            {STREET_EQUIPMENT.map(item => (
              <EquipItem key={item} item={item} selected={equipment.includes(item)} onToggle={toggleEquip} />
            ))}
          </div>
        </div>
      )}

      {(context === 'custom' || verifyingPreset) && !showContextPicker && (
        <div className="space-y-3">
          {verifyingPreset && (
            <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-white/10 border border-white/20">
              <p className="text-xs text-white/80">
                Tu modifies <span className="font-semibold text-white">{CONTEXTS.find(c => c.key === context)?.label}</span>
                {selectedChain && selectedChain !== 'all' && <span> · <span className="font-semibold text-white">{selectedChain}</span></span>}
              </p>
              <button type="button" onClick={() => setVerifyingPreset(false)}
                className="flex items-center gap-1 text-xs font-semibold text-white/70 hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-md transition-all">
                <ArrowLeft className="w-3 h-3" /> Retour
              </button>
            </div>
          )}

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input placeholder="Rechercher un équipement..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/40" />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-1 bg-white/10 p-1 rounded-lg">
              {VIEWS.map(v => (
                <button key={v.key} type="button" onClick={() => setView(v.key)}
                  className={cn('px-2.5 py-1.5 rounded-md text-xs font-medium transition-all',
                    view === v.key ? 'bg-white text-violet-700' : 'text-white/60 hover:text-white')}>
                  {v.label}
                </button>
              ))}
            </div>
            <button type="button"
              data-tutorial="toggle-slider"
              onClick={() => onChange({ equipment: equipment.length === ALL_EQUIPMENT.length ? [] : ALL_EQUIPMENT, equipment_validated: false })}
              className="flex items-center gap-2">
              <span className="text-xs text-white/60">{equipment.length === ALL_EQUIPMENT.length ? 'Tout décocher' : 'Tout cocher'}</span>
              <div className={cn('relative w-10 h-5 rounded-full transition-colors duration-200',
                equipment.length === ALL_EQUIPMENT.length ? 'bg-white' : 'bg-white/20')}>
                <div className={cn('absolute top-0.5 w-4 h-4 rounded-full shadow transition-transform duration-200',
                  equipment.length === ALL_EQUIPMENT.length
                    ? 'translate-x-5 bg-violet-600'
                    : 'translate-x-0.5 bg-white/70')} />
              </div>
            </button>
          </div>

          {/* Vue Matériel — par type d'équipement */}
          {view === 'material' && (
            <div className="space-y-2">
              {filteredByType.map(({ group, items }) => (
                <GroupSection key={group} group={group} items={items} equipment={equipment}
                  onToggle={toggleEquip}
                  onToggleAll={(grpItems, allSelected) => {
                    const next = allSelected
                      ? equipment.filter(e => !grpItems.includes(e))
                      : [...new Set([...equipment, ...grpItems])];
                    onChange({ equipment: next, equipment_validated: false });
                  }}
                  forceOpen={!!search} />
              ))}
              {filteredByType.length === 0 && (
                <p className="text-sm text-white/50 text-center py-6">Aucun résultat pour "{search}"</p>
              )}
            </div>
          )}

          {/* Vue A → Z */}
          {view === 'az' && (
            <div className="space-y-2">
              {filteredAZ.length === 0 ? (
                <p className="text-sm text-white/50 text-center py-6">Aucun résultat pour "{search}"</p>
              ) : (
                Object.entries(
                  filteredAZ.reduce((acc, item) => {
                    const letter = item[0].toUpperCase();
                    if (!acc[letter]) acc[letter] = [];
                    acc[letter].push(item);
                    return acc;
                  }, {})
                ).map(([letter, items]) => (
                  <LetterSection key={letter} letter={letter} items={items} equipment={equipment}
                    onToggle={toggleEquip} forceOpen={!!search} />
                ))
              )}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
