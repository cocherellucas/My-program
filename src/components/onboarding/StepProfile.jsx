import React, { useEffect } from 'react';
import { useTutorial } from '@/lib/TutorialContext';
import { Label } from '@/components/ui/label';
import { NumInput } from '@/components/ui/num-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { HelpCircle } from 'lucide-react';

// min / max / pas / valeur de départ des flèches — mêmes réglages partout
const FIELDS = {
  age:    { min: 18, max: 120, step: 1,   default: 25  },
  height: { min: 50, max: 250, step: 1,   default: 175 },
  weight: { min: 20, max: 300, step: 0.5, default: 70  },
};

export default function StepProfile({ data, onChange }) {
  const { startTutorial } = useTutorial() || {};

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
        <Label className="text-white">{labelText}</Label>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {numInput('age')}

        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
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
      </div>
    </div>
  );
}
