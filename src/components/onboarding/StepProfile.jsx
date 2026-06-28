import React, { useEffect, useState } from 'react';
import { useTutorial } from '@/lib/TutorialContext';
import { Label } from '@/components/ui/label';
import { NumInput } from '@/components/ui/num-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { estimateMaintenanceCalories } from '@/lib/calories';

// min / max / pas / valeur de départ des flèches — mêmes réglages partout
const FIELDS = {
  age:    { min: 18, max: 120, step: 1,   default: 25  },
  height: { min: 50, max: 250, step: 1,   default: 175 },
  weight: { min: 20, max: 300, step: 0.5, default: 70  },
};

export default function StepProfile({ data, onChange }) {
  const { startTutorial } = useTutorial() || {};
  const [showMaintenance, setShowMaintenance] = useState(false);

  // Démarre les tutos pour cette étape (icône ?, input numérique, dropdown)
  useEffect(() => {
    if (!startTutorial) return;
    const t = setTimeout(() => {
      startTutorial('profile-intro', [
        {
          target: 'gender-cards',
          title: 'Choisis ton genre',
          description: 'Pour commencer, choisis ton genre en cliquant sur une carte. La carte sélectionnée a une bordure blanche.',
        },
        {
          target: 'numeric-input',
          title: 'Saisir un nombre',
          description: 'Tape directement au clavier, OU utilise les petites flèches ↑↓ à droite. Reste appuyé pour défiler plus vite.',
        },
        {
          target: 'help-icon',
          title: 'Besoin d\'aide ?',
          description: 'Tu vas voir des "?" partout dans l\'app. Clique dessus pour avoir l\'explication détaillée du champ à côté.',
        },
        {
          target: 'dropdown',
          title: 'Menu déroulant',
          description: 'Clique pour ouvrir la liste, puis choisis ton option. Tu peux toujours changer plus tard.',
        },
        {
          target: 'next-button',
          title: 'Boutons avec flèche →',
          description: "Chaque bouton avec une flèche → t'emmène à l'endroit indiqué par son texte. Ici, \"Suivant\" t'emmènera à l'étape suivante.",
          nonInteractive: true,
        },
      ]);
    }, 600);
    return () => clearTimeout(t);
  }, [startTutorial]);

  const numInput = (field) => {
    const { min, max, step, default: def } = FIELDS[field];
    const labelText = field === 'height' ? 'Taille (cm)' : field === 'weight' ? 'Poids (kg)' : 'Âge';
    const parse = field === 'weight' ? parseFloat : parseInt;
    const node = (
      <NumInput
        value={data[field]}
        onChange={(v) => onChange({ [field]: v === '' ? '' : parse(v) })}
        min={min}
        max={max}
        step={step}
        defaultValue={def}
        placeholder="—"
        className="bg-white/20 border-white/40 text-white placeholder:text-white/50"
      />
    );
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 min-h-[20px]"><Label className="text-white">{labelText}</Label></div>
        {field === 'age' ? <div data-tutorial="numeric-input">{node}</div> : node}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-heading font-bold text-white">Parle-nous de toi</h2>
        <p className="text-white/70 mt-2">Ces infos nous aident à personnaliser ton coaching</p>
        <p className="text-white/40 text-xs mt-3">Les champs marqués <span className="text-red-400 font-bold">*</span> sont obligatoires</p>
      </div>

      {/* Genre */}
      <div className="space-y-2">
        <Label className="text-white">Genre</Label>
        <div className="grid grid-cols-2 gap-3" data-tutorial="gender-cards">
          {[{ value: 'male', label: 'Homme' }, { value: 'female', label: 'Femme' }].map(({ value, label }) => (
            <button key={value} type="button" onClick={() => onChange({ gender: value })}
              className={`py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${data.gender === value ? 'border-white bg-white/20 text-white' : 'border-white/20 bg-white/10 text-white/50 hover:border-white/40'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {numInput('age')}

        <div className="space-y-2">
          <div className="flex items-center gap-1.5 min-h-[20px]">
            <Label className="text-white">Niveau <span className="text-red-400">*</span></Label>
            <Popover>
              <PopoverTrigger asChild>
                <button type="button" data-tutorial="help-icon" className="text-white/40 hover:text-white/70 transition-colors">
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-72 text-xs space-y-2">
                <div>
                  <p className="font-semibold">🌱 Débutant</p>
                  <p className="text-white/70 mt-0.5">Tu progresses facilement séance après séance. Valable pour les premières années de pratique.</p>
                </div>
                <div>
                  <p className="font-semibold">💪 Intermédiaire</p>
                  <p className="text-white/70 mt-0.5">Plusieurs années d'entraînement sérieux. La progression demande maintenant de l'optimisation (volume, intensité, récupération).</p>
                </div>
                <div>
                  <p className="font-semibold">🔥 Avancé</p>
                  <p className="text-white/70 mt-0.5">Chaque détail compte pour progresser. Les gains sont rares et complexes à obtenir.</p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <Select value={data.level || ''} onValueChange={(v) => onChange({ level: v })}>
            <SelectTrigger data-tutorial="dropdown" className="bg-white/20 border-white/40 text-white [&>span]:text-white [&>span[data-placeholder]]:text-white/50 [&>svg]:opacity-100 [&>svg]:text-white">
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Débutant</SelectItem>
              <SelectItem value="intermediate">Intermédiaire</SelectItem>
              <SelectItem value="advanced">Avancé</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {numInput('height')}
        {numInput('weight')}

        <div className="space-y-2">
          <div className="flex items-center gap-1.5 min-h-[20px]">
            <Label className="text-white">Activité</Label>
            <Popover>
              <PopoverTrigger asChild>
                <button type="button" className="text-white/40 hover:text-white/70 transition-colors"><HelpCircle className="w-3.5 h-3.5" /></button>
              </PopoverTrigger>
              <PopoverContent className="w-72 text-xs space-y-1.5">
                <p className="text-white/60 text-[10px] uppercase tracking-wider font-semibold">Ton activité globale (pas que la muscu)</p>
                <p><span className="font-semibold">Sédentaire</span> — travail assis, peu de marche.</p>
                <p><span className="font-semibold">Légèrement actif</span> — un peu de marche, ou 1-2 séances/sem.</p>
                <p><span className="font-semibold">Modérément actif</span> — debout/marche, ou 3-4 séances/sem.</p>
                <p><span className="font-semibold">Très actif</span> — métier physique, ou 5-6 séances/sem.</p>
                <p><span className="font-semibold">Extrêmement actif</span> — très physique + entraînement quasi quotidien.</p>
              </PopoverContent>
            </Popover>
          </div>
          <Select value={data.activity_level || ''} onValueChange={(v) => onChange({ activity_level: v })}>
            <SelectTrigger className="bg-white/20 border-white/40 text-white [&>span]:text-white [&>span[data-placeholder]]:text-white/50 [&>svg]:opacity-100 [&>svg]:text-white"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="sedentary">Sédentaire</SelectItem>
              <SelectItem value="light">Légèrement actif</SelectItem>
              <SelectItem value="moderate">Modérément actif</SelectItem>
              <SelectItem value="active">Très actif</SelectItem>
              <SelectItem value="very_active">Extrêmement actif</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1.5 min-h-[20px]">
            <Label className="text-white">Masse grasse (%)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <button type="button" className="text-white/40 hover:text-white/70 transition-colors"><HelpCircle className="w-3.5 h-3.5" /></button>
              </PopoverTrigger>
              <PopoverContent className="w-72 text-xs space-y-1.5">
                <p className="font-semibold text-white">Ton pourcentage de masse grasse</p>
                <p className="text-white/70">Si tu ne le connais pas : balance à impédance, pince à plis cutanés, ou estimation visuelle. Laisse vide si tu n'es pas sûr.</p>
              </PopoverContent>
            </Popover>
          </div>
          <NumInput value={data.body_fat} onChange={(v) => onChange({ body_fat: v === '' ? '' : parseFloat(v) })} min={3} max={60} step={0.5} defaultValue={15} className="bg-white/20 border-white/40 text-white placeholder:text-white/50" />
        </div>
      </div>

      {(() => {
        const cal = estimateMaintenanceCalories({
          gender: data.gender, age: data.age, height: data.height, weight: data.weight,
          bodyFat: data.body_fat, activityLevel: data.activity_level,
        });
        if (!cal) return null;
        return (
          <div className="rounded-xl bg-white/10 border border-white/20 overflow-hidden">
            <button type="button" onClick={() => setShowMaintenance(v => !v)}
              className="w-full flex items-center justify-between gap-2 p-3 text-left hover:bg-white/5 transition-colors">
              <span className="text-sm font-medium text-white">Maintien calorique estimé</span>
              <span className="flex items-center gap-1.5 text-white/90 font-semibold whitespace-nowrap">
                {showMaintenance ? `~${cal.maintenance} kcal/j` : 'Voir'}
                <ChevronDown className={`w-4 h-4 transition-transform ${showMaintenance ? 'rotate-180' : ''}`} />
              </span>
            </button>
            {showMaintenance && (
              <p className="text-[11px] text-white/50 px-3 pb-3 leading-snug">
                {cal.method === 'katch'
                  ? 'Estimation (Katch-McArdle, basée sur ta masse maigre et ton activité, ajustée à l\'âge). À ajuster selon tes résultats.'
                  : 'Estimation (Mifflin-St Jeor). Renseigne ta masse grasse pour plus de précision.'}
              </p>
            )}
          </div>
        );
      })()}
    </div>
  );
}
