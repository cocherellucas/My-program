import React from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const QUESTIONS = [
  {
    key: 'morphology_arm_length',
    label: 'Longueur des bras',
    options: [
      { value: 'short', label: 'Courts' },
      { value: 'medium', label: 'Moyens' },
      { value: 'long', label: 'Longs' },
    ]
  },
  {
    key: 'morphology_leg_length',
    label: 'Longueur des jambes',
    options: [
      { value: 'short', label: 'Courtes' },
      { value: 'medium', label: 'Moyennes' },
      { value: 'long', label: 'Longues' },
    ]
  },
  {
    key: 'morphology_silhouette',
    label: 'Silhouette',
    options: [
      { value: 'broad_shoulders', label: 'Épaules larges' },
      { value: 'proportional', label: 'Proportionné' },
      { value: 'wide_hips', label: 'Hanches larges' },
    ]
  },
  {
    key: 'morphology_posture',
    label: 'Dominance posturale',
    desc: 'Comment te tiens-tu naturellement ?',
    options: [
      { value: 'anterior', label: 'Penché en avant' },
      { value: 'neutral', label: 'Neutre' },
      { value: 'posterior', label: 'Penché en arrière' },
    ]
  }
];

export default function StepMorphology({ data, onChange }) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-heading font-bold">Ta morphologie</h2>
        <p className="text-muted-foreground mt-2">On adapte les exercices à ton corps</p>
      </div>

      <div className="space-y-6">
        {QUESTIONS.map(({ key, label, desc, options }) => (
          <div key={key} className="space-y-3">
            <div>
              <Label>{label}</Label>
              {desc && <p className="text-xs text-muted-foreground">{desc}</p>}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {options.map(({ value, label: optLabel }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => onChange({ [key]: value })}
                  className={cn(
                    'p-3 rounded-xl border-2 text-sm font-medium transition-all text-center',
                    data[key] === value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-card text-muted-foreground hover:border-primary/30'
                  )}
                >
                  {optLabel}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}