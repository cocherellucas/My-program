import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

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
            <p className="text-xs font-semibold text-white/40 uppercase tracking-widest">Style</p>
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
            <p className="text-xs font-semibold text-white/40 uppercase tracking-widest">Durée</p>
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
            <p className="text-xs font-semibold text-white/40 uppercase tracking-widest">Phase de départ</p>
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
