import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, HelpCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const STRUCTURES = [
  { value: 'auto', label: 'Auto (IA choisit)', description: 'Structure optimale selon ton profil', full: true },
  { value: 'full_body', label: 'Full Body', description: 'Tous les muscles à chaque séance' },
  { value: 'upper_lower', label: 'Upper / Lower', description: 'Haut / bas en alternance' },
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
  const [weeks, setWeeks] = useState('auto');
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
      <DialogContent className="w-[calc(100vw-2rem)] max-w-sm rounded-2xl border-white/20 p-0 overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #2e1065 0%, #1e0050 100%)', left: '50%', transform: 'translate(-50%, -50%)' }}>

        {/* Header */}
        <div className="px-5 pt-5 pb-3 border-b border-white/10">
          <h2 className="font-heading font-bold text-white text-lg">Configurer le programme</h2>
          <p className="text-xs text-white/50 mt-0.5">Tous les choix sont optionnels — l'IA décide si tu laisses.</p>
        </div>

        <div className="px-5 py-4 space-y-5">

          {/* Structure */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-semibold text-white/40 uppercase tracking-widest">Style</p>
              <Popover>
                <PopoverTrigger asChild>
                  <button><HelpCircle className="w-3.5 h-3.5 text-white/30 hover:text-white/60 transition-colors" /></button>
                </PopoverTrigger>
                <PopoverContent className="w-56 text-xs bg-violet-900/95 border-white/20 text-white">
                  La structure définit comment les groupes musculaires sont répartis dans la semaine. Full Body = tout à chaque séance. PPL = Push/Pull/Legs séparés. Auto = l'IA choisit selon tes jours disponibles.
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {STRUCTURES.map(s => (
                <button
                  key={s.value}
                  onClick={() => setStructure(s.value)}
                  className={`text-left px-3 py-2.5 rounded-xl border transition-all ${s.full ? 'col-span-2' : ''} ${
                    structure === s.value
                      ? 'border-violet-400/60 bg-violet-500/20'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <span className="font-semibold text-sm text-white block">{s.label}</span>
                  {structure === s.value && <p className="text-xs text-white/50 mt-0.5">{s.description}</p>}
                </button>
              ))}
            </div>
          </div>

          {/* Durée */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-semibold text-white/40 uppercase tracking-widest">Durée</p>
              <Popover>
                <PopoverTrigger asChild>
                  <button><HelpCircle className="w-3.5 h-3.5 text-white/30 hover:text-white/60 transition-colors" /></button>
                </PopoverTrigger>
                <PopoverContent className="w-56 text-xs bg-violet-900/95 border-white/20 text-white">
                  Durée totale du programme avant de le régénérer. 4 semaines = bon pour débuter ou tester. 8-12 semaines = cycle complet avec progression structurée. Auto = l'IA calcule selon ton niveau et la phase.
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex gap-2">
              {DURATIONS.map(d => (
                <button
                  key={d.value}
                  onClick={() => setWeeks(d.value)}
                  className={`flex-1 py-2 rounded-xl border text-sm font-semibold transition-all ${
                    weeks === d.value
                      ? 'border-violet-400/60 bg-violet-500/20 text-white'
                      : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Phase */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-semibold text-white/40 uppercase tracking-widest">Phase de départ</p>
              <Popover>
                <PopoverTrigger asChild>
                  <button><HelpCircle className="w-3.5 h-3.5 text-white/30 hover:text-white/60 transition-colors" /></button>
                </PopoverTrigger>
                <PopoverContent className="w-56 text-xs bg-violet-900/95 border-white/20 text-white space-y-1">
                  <p><span className="font-bold text-violet-300">MEV</span> — Volume minimal efficace. Idéal pour débuter ou reprendre.</p>
                  <p><span className="font-bold text-violet-300">MAV</span> — Volume d'adaptation maximal. Progression active et soutenue.</p>
                  <p><span className="font-bold text-violet-300">MRV</span> — Volume maximal récupérable. Réservé aux avancés.</p>
                  <p><span className="font-bold text-violet-300">Auto</span> — L'IA choisit selon ton niveau et tes objectifs.</p>
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {PHASES.map(p => (
                <button
                  key={p.value}
                  onClick={() => setPhase(p.value)}
                  className={`text-center py-2.5 px-1 rounded-xl border transition-all ${
                    phase === p.value
                      ? 'border-violet-400/60 bg-violet-500/20'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <span className="font-bold text-sm text-white block">{p.label}</span>
                  <p className="text-[10px] text-white/40 leading-tight mt-0.5">{p.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 flex gap-2">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/15 text-white/60 text-sm font-semibold hover:bg-white/10 transition-colors">
            Annuler
          </button>
          <button onClick={handleGenerate} className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
            <Sparkles className="w-4 h-4" />
            Générer
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
