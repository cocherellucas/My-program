import React, { useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronUp, ChevronDown } from 'lucide-react';

const FIELDS = [
  { key: 'shoulders',   label: 'Tour d\'épaules' },
  { key: 'waist',       label: 'Tour de taille' },
  { key: 'hips',        label: 'Tour de hanches' },
  { key: 'right_arm',   label: 'Bras droit' },
  { key: 'left_arm',    label: 'Bras gauche' },
  { key: 'right_thigh', label: 'Cuisse droite' },
  { key: 'left_thigh',  label: 'Cuisse gauche' },
];

const DEFAULTS = {
  male:    { shoulders: 120, waist: 85,  hips: 97,  right_arm: 35, left_arm: 35, right_thigh: 58, left_thigh: 58 },
  female:  { shoulders: 105, waist: 75,  hips: 102, right_arm: 30, left_arm: 30, right_thigh: 60, left_thigh: 60 },
  neutral: { shoulders: 112, waist: 80,  hips: 100, right_arm: 32, left_arm: 32, right_thigh: 59, left_thigh: 59 },
};

function NumInput({ value, onChange, placeholder = '—', step = 0.5, min = 1, defaultValue = 0 }) {
  const holdRef = useRef(null);
  const valRef  = useRef(value);
  valRef.current = value;

  const doStep = (dir) => {
    const cur  = parseFloat(valRef.current) || defaultValue;
    const next = Math.max(min, parseFloat((cur + dir * step).toFixed(1)));
    onChange(next);
  };

  const startHold = (dir) => {
    doStep(dir);
    holdRef.current = setTimeout(() => {
      holdRef.current = setInterval(() => doStep(dir), 80);
    }, 400);
  };

  const stopHold = () => {
    clearTimeout(holdRef.current);
    clearInterval(holdRef.current);
    holdRef.current = null;
  };

  return (
    <div className="relative">
      <Input
        type="text"
        inputMode="decimal"
        placeholder={placeholder}
        value={value || ''}
        onChange={(e) => {
          const raw = e.target.value.replace(/[^0-9.]/g, '');
          onChange(raw === '' ? '' : raw);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter')     { e.target.blur(); }
          if (e.key === 'ArrowUp')   { e.preventDefault(); doStep(1); }
          if (e.key === 'ArrowDown') { e.preventDefault(); doStep(-1); }
        }}
        className="pr-6 bg-white/10 border-white/20 text-white placeholder:text-white/30"
      />
      <div className="absolute right-1 top-0 h-full flex flex-col justify-center">
        <button type="button" tabIndex={-1}
          onMouseDown={(e) => { e.preventDefault(); startHold(1); }}
          onMouseUp={stopHold} onMouseLeave={stopHold}
          className="text-white/50 hover:text-white leading-none">
          <ChevronUp className="w-3 h-3" />
        </button>
        <button type="button" tabIndex={-1}
          onMouseDown={(e) => { e.preventDefault(); startHold(-1); }}
          onMouseUp={stopHold} onMouseLeave={stopHold}
          className="text-white/50 hover:text-white leading-none">
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

export default function StepMeasurements({ data, onChange }) {
  const defaults = DEFAULTS[data.gender] || DEFAULTS.neutral;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-heading font-bold text-white">Tes mensurations</h2>
        <p className="text-white/70 mt-2">Optionnel — tu pourras les renseigner plus tard</p>
      </div>

      <div className="p-4 bg-white/10 rounded-xl border border-white/20">
        <p className="text-sm text-white/80">
          Ces données permettent de détecter les déséquilibres et suivre ta progression physique. Tu recevras un rappel dans 14 jours si tu les laisses vides.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {FIELDS.map(({ key, label }) => (
          <div key={key} className="space-y-1.5">
            <Label className="text-sm text-white">{label} (cm)</Label>
            <NumInput
              value={data[key] || ''}
              onChange={(val) => onChange({ [key]: val === '' ? '' : parseFloat(val) || '' })}
              defaultValue={defaults[key]}
              placeholder={String(defaults[key])}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
