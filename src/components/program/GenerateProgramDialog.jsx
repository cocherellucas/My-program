import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const STRUCTURES = [
  { value: 'auto', label: 'Auto (IA choisit)', description: 'L\'IA sélectionne la structure optimale selon ton profil' },
  { value: 'full_body', label: 'Full Body', description: 'Tous les muscles à chaque séance' },
  { value: 'upper_lower', label: 'Upper / Lower', description: 'Alternance haut du corps / bas du corps' },
  { value: 'ppl', label: 'PPL', description: 'Push / Pull / Legs' },
  { value: 'arnold_split', label: 'Arnold Split', description: 'Pecs+Dos / Épaules+Bras / Jambes' },
];

const DURATIONS = [
  { value: 'auto', label: 'Automatique', description: 'Calculé selon ton niveau et la phase (2–10 sem.)' },
  { value: '4', label: '4 semaines' },
  { value: '8', label: '8 semaines' },
  { value: '12', label: '12 semaines' },
];

const PHASES = [
  { value: 'auto', label: 'Auto', description: 'L\'IA choisit selon ton niveau et tes objectifs' },
  { value: 'MEV', label: 'MEV', description: 'Volume minimal efficace — parfait pour débuter' },
  { value: 'MAV', label: 'MAV', description: 'Volume d\'adaptation maximal — progression active' },
  { value: 'MRV', label: 'MRV', description: 'Volume maximal récupérable — intensité élevée' },
];

export default function GenerateProgramDialog({ open, onClose, onGenerate }) {
  const [structure, setStructure] = useState('auto');
  const [weeks, setWeeks] = useState('4');
  const [phase, setPhase] = useState('auto');

  const handleGenerate = () => {
    onGenerate({
      structure: structure === 'auto' ? null : structure,
      weeks: weeks === 'auto' ? 'auto' : parseInt(weeks),
      phase: phase === 'auto' ? null : phase,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">Configurer le programme</DialogTitle>
          <p className="text-sm text-muted-foreground">Tous les choix sont optionnels — l'IA peut tout décider automatiquement.</p>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Structure */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Style d'entraînement</Label>
            <div className="grid grid-cols-1 gap-2">
              {STRUCTURES.map(s => (
                <button
                  key={s.value}
                  onClick={() => setStructure(s.value)}
                  className={`text-left px-4 py-3 rounded-lg border transition-all ${
                    structure === s.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-muted-foreground/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{s.label}</span>
                    {structure === s.value && <Badge className="text-xs">Sélectionné</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Durée */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Durée du programme</Label>
            <div className="flex gap-2 flex-wrap">
              {DURATIONS.map(d => (
                <button
                  key={d.value}
                  onClick={() => setWeeks(d.value)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all text-left ${
                    weeks === d.value
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border hover:border-muted-foreground/40'
                  }`}
                >
                  {d.label}
                  {d.description && <p className="text-xs font-normal text-muted-foreground mt-0.5">{d.description}</p>}
                </button>
              ))}
            </div>
          </div>

          {/* Phase */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Phase de départ</Label>
            <div className="grid grid-cols-3 gap-2">
              {PHASES.map(p => (
                <button
                  key={p.value}
                  onClick={() => setPhase(p.value)}
                  className={`text-left px-3 py-3 rounded-lg border transition-all ${
                    phase === p.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-muted-foreground/40'
                  }`}
                >
                  <span className="font-bold text-sm block">{p.label}</span>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-tight">{p.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={handleGenerate}>
            <Sparkles className="w-4 h-4 mr-2" />
            Générer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}