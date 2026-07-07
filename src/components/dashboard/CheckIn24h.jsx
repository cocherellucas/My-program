import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Moon, Smile, Frown, Minus, CheckCircle2 } from 'lucide-react';

const FEELING_OPTIONS = [
  { value: 'better',  label: 'Mieux',         icon: Smile,  color: 'border-emerald-400 bg-emerald-400/15 text-emerald-300' },
  { value: 'same',    label: 'Pareil',         icon: Minus,  color: 'border-blue-400 bg-blue-400/15 text-blue-300' },
  { value: 'stiffer', label: 'Plus raide',     icon: Frown,  color: 'border-orange-400 bg-orange-400/15 text-orange-300' },
];

const SLEEP_OPTIONS = [
  { value: 'good',    label: 'Bonne',    color: 'border-emerald-400 bg-emerald-400/15 text-emerald-300' },
  { value: 'average', label: 'Moyenne',  color: 'border-blue-400 bg-blue-400/15 text-blue-300' },
  { value: 'bad',     label: 'Mauvaise', color: 'border-orange-400 bg-orange-400/15 text-orange-300' },
];

export default function CheckIn24h({ sessions, onSubmit }) {
  const [feeling, setFeeling] = useState(null);
  const [sleep, setSleep]     = useState(null);
  const [done, setDone]       = useState(false);

  if (!sessions?.length || done) return null;

  const session = sessions[0];
  const label   = (session.day_label || session.type || 'Séance').replace(/\s*§\d+/g, '');

  const handleSubmit = () => {
    if (!feeling || !sleep) return;
    onSubmit(session.id, { feeling, sleep });
    setDone(true);
  };

  return (
    <Card className="p-5 bg-white/10 backdrop-blur-sm border-white/20">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-violet-500/30 flex items-center justify-center">
          <Moon className="w-4 h-4 text-violet-300" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Check-in 24h — {label}</p>
          <p className="text-xs text-white/50">Comment tu te sens aujourd'hui ?</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-xs font-medium text-white/60 uppercase tracking-wider mb-2">Récupération musculaire</p>
          <div className="grid grid-cols-3 gap-2">
            {FEELING_OPTIONS.map(({ value, label, icon: Icon, color }) => (
              <button key={value} type="button" onClick={() => setFeeling(value)}
                className={cn(
                  'flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 text-xs font-medium transition-all',
                  feeling === value ? color : 'border-white/15 bg-white/5 text-white/50 hover:border-white/30'
                )}>
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-white/60 uppercase tracking-wider mb-2">Nuit de sommeil</p>
          <div className="grid grid-cols-3 gap-2">
            {SLEEP_OPTIONS.map(({ value, label, color }) => (
              <button key={value} type="button" onClick={() => setSleep(value)}
                className={cn(
                  'py-2.5 rounded-xl border-2 text-xs font-medium transition-all',
                  sleep === value ? color : 'border-white/15 bg-white/5 text-white/50 hover:border-white/30'
                )}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <button type="button" onClick={handleSubmit} disabled={!feeling || !sleep}
          className={cn(
            'w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all',
            feeling && sleep
              ? 'bg-white text-violet-700 hover:bg-white/90'
              : 'bg-white/10 text-white/30 cursor-not-allowed'
          )}>
          <CheckCircle2 className="w-4 h-4" />
          Enregistrer
        </button>
      </div>
    </Card>
  );
}
