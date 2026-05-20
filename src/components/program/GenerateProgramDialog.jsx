import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Sparkles } from 'lucide-react';

const STRUCTURES = [
  { value: 'auto', label: 'Auto (IA choisit)', description: 'Structure optimale selon ton profil' },
  { value: 'full_body', label: 'Full Body', description: 'Tous les muscles à chaque séance' },
  { value: 'upper_lower', label: 'Upper / Lower', description: 'Haut / bas du corps en alternance' },
  { value: 'ppl', label: 'PPL', description: 'Push / Pull / Legs' },
  { value: 'arnold_split', label: 'Arnold Split', description: 'Pecs+Dos / Épaules+Bras / Jambes' },
];

const DURATIONS = [
  { value: 'auto', label: 'Auto' },
  { value: '4', label: '4 sem.' },
  { value: '8', label: '8 sem.' },
  { value: '12', label: '12 sem.' },
];

const PHASES = [
  { value: 'auto', label: 'Auto', description: 'IA choisit' },
  { value: 'MEV', label: 'MEV', description: 'Volume minimal' },
  { value: 'MAV', label: 'MAV', description: 'Progression active' },
  { value: 'MRV', label: 'MRV', description: 'Intensité max' },
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
      <DialogContent className="max-w-sm mx-4 rounded-2xl">
        <DialogHeader className="pb-0">
          <DialogTitle className="font-heading text-lg">Configurer le programme</DialogTitle>
          <p className="text-xs text-muted-foreground">Tous les choix sont optionnels.</p>
        </DialogHeader>

        <div className="space-y-4 py-1">
          {/* Structure */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Style</Label>
            <div className="grid grid-cols-2 gap-1.5">
              {STRUCTURES.map(s => (
                <button
                  key={s.value}
                  onClick={() => setStructure(s.value)}
                  className={`text-left px-3 py-2 rounded-lg border transition-all ${
                    s.value === 'auto' ? 'col-span-2' : ''
                  } ${
                    structure === s.value
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-muted-foreground/40'
                  }`}
                >
                  <span className="font-medium text-sm block">{s.label}</span>
                  {structure === s.value && <p className="text-xs text-muted-foreground">{s.description}</p>}
                </button>
              ))}
            </div>
          </div>

          {/* Durée */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Durée</Label>
            <div className="flex gap-1.5">
              {DURATIONS.map(d => (
                <button
                  key={d.value}
                  onClick={() => setWeeks(d.value)}
                  className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${
                    weeks === d.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-muted-foreground/40'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Phase */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Phase de départ</Label>
            <div className="grid grid-cols-4 gap-1.5">
              {PHASES.map(p => (
                <button
                  key={p.value}
                  onClick={() => setPhase(p.value)}
                  className={`text-center px-2 py-2 rounded-lg border transition-all ${
                    phase === p.value
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-muted-foreground/40'
                  }`}
                >
                  <span className="font-bold text-sm block">{p.label}</span>
                  <p className="text-[10px] text-muted-foreground leading-tight">{p.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 pt-1">
          <Button variant="outline" onClick={onClose} className="flex-1">Annuler</Button>
          <Button onClick={handleGenerate} className="flex-1">
            <Sparkles className="w-4 h-4 mr-2" />
            Générer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
