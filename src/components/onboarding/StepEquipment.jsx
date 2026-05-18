import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Dumbbell, Home, PersonStanding, Settings2, Search, ChevronDown, ChevronUp, ArrowRight, CheckCheck } from 'lucide-react';

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

function GroupSection({ group, items, equipment, onToggle, forceOpen }) {
  const [open, setOpen] = useState(false);
  const selectedCount = items.filter(i => equipment.includes(i)).length;
  const isOpen = forceOpen || open;

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
        {!forceOpen && (isOpen ? <ChevronUp className="w-3.5 h-3.5 text-white/40" /> : <ChevronDown className="w-3.5 h-3.5 text-white/40" />)}
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
  const lastValidatedRef = useRef(null);

  useEffect(() => { lastValidatedRef.current = null; }, [context]);

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

  const selectContext = (ctx) => { onChange({ training_context: ctx, equipment: PRESETS[ctx] || [], equipment_validated: false }); setSearch(''); };
  const verifyPreset = () => { onChange({ training_context: 'custom', equipment_validated: false }); setSearch(''); };
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

      <div className="grid grid-cols-2 gap-3">
        {CONTEXTS.map(({ key, label, icon: Icon, desc }) => (
          <button key={key} type="button" onClick={() => selectContext(key)}
            className={cn('flex flex-col items-center gap-2 p-3 rounded-xl border-2 text-center transition-all',
              context === key ? 'border-white bg-violet-500' : 'border-violet-400 bg-violet-600 hover:border-white')}>
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

      {context && CONTEXT_SUMMARY[context] && (
        <div className="bg-white/10 rounded-xl border border-white/20 overflow-hidden">
          <div className="flex items-center justify-between px-4 pt-3 pb-2">
            <div className="flex items-center gap-2">
              <CheckCheck className="w-4 h-4 text-green-400" />
              <p className="text-xs font-semibold text-white/70 uppercase tracking-wider">
                {equipment.length} équipements sélectionnés
              </p>
            </div>
            <button type="button" onClick={verifyPreset}
              className="flex items-center gap-1 text-xs text-white/70 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-all">
              Vérifier
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="px-4 pb-3 flex flex-wrap gap-1.5">
            {equipment.slice(0, 10).map(item => (
              <span key={item} className="text-[10px] bg-white/15 text-white/80 px-2 py-0.5 rounded-full">{item}</span>
            ))}
            {equipment.length > 10 && (
              <span className="text-[10px] bg-white/8 text-white/40 px-2 py-0.5 rounded-full">+{equipment.length - 10} autres</span>
            )}
          </div>
        </div>
      )}

      {context === 'bodyweight' && (
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

      {context === 'custom' && (
        <div className="space-y-3">
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
            {equipment.length > 0 && (
              <span className="text-xs text-white/50">{equipment.length} sélectionné{equipment.length > 1 ? 's' : ''}</span>
            )}
          </div>

          {/* Vue Matériel — par type d'équipement */}
          {view === 'material' && (
            <div className="space-y-2">
              {filteredByType.map(({ group, items }) => (
                <GroupSection key={group} group={group} items={items} equipment={equipment}
                  onToggle={toggleEquip} forceOpen={!!search} />
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

      {context && (hasChanged || validated || fading) && (
        <button type="button" onClick={handleValidate}
          className={cn(
            'w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm shadow-lg',
            'transition-all duration-500',
            fading && !validated ? 'opacity-0 scale-95' : 'opacity-100 scale-100',
            validated
              ? 'bg-white text-violet-700 scale-[0.97] ring-4 ring-white/60 shadow-[0_0_24px_rgba(255,255,255,0.5)]'
              : 'bg-white text-violet-700 hover:bg-white/90'
          )}>
          <CheckCheck className={cn('w-4 h-4 transition-transform duration-300', validated && 'scale-125')} />
          {validated ? 'Équipement enregistré !' : 'Valider mon équipement'}
        </button>
      )}
    </div>
  );
}
