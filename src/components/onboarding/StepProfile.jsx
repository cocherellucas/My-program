import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronUp, ChevronDown } from 'lucide-react';

const FIELDS = {
  age:    { min: 18,  max: 120, label: 'Âge',    unit: 'ans', placeholder: '25',  default: 25  },
  height: { min: 50,  max: 250, label: 'Taille',  unit: 'cm',  placeholder: '175', default: 175 },
  weight: { min: 20,  max: 300, label: 'Poids',   unit: 'kg',  placeholder: '70',  default: 70  },
};

export default function StepProfile({ data, onChange }) {
  const [errors, setErrors] = useState({});
  const holdRef = useRef(null);
  const dataRef = useRef(data);
  dataRef.current = data;

  const isDecimal = (field) => field === 'weight' || field === 'height';

  const handleChange = (field, raw) => {
    if (isDecimal(field)) {
      // Stocker la chaîne brute pendant la saisie (permet "70,")
      onChange({ [field]: raw });
      const val = parseFloat(raw.replace(',', '.'));
      const { min, max, label, unit } = FIELDS[field];
      if (raw === '' || isNaN(val)) { setErrors(prev => ({ ...prev, [field]: null })); return; }
      if (val < min) setErrors(prev => ({ ...prev, [field]: `${label} minimum : ${min} ${unit}` }));
      else if (val > max) setErrors(prev => ({ ...prev, [field]: `${label} maximum : ${max} ${unit}` }));
      else setErrors(prev => ({ ...prev, [field]: null }));
    } else {
      const val = parseInt(raw);
      const { min, max, label, unit } = FIELDS[field];
      if (raw === '' || isNaN(val)) { setErrors(prev => ({ ...prev, [field]: null })); onChange({ [field]: '' }); return; }
      if (val < min) setErrors(prev => ({ ...prev, [field]: `${label} minimum : ${min} ${unit}` }));
      else if (val > max) setErrors(prev => ({ ...prev, [field]: `${label} maximum : ${max} ${unit}` }));
      else setErrors(prev => ({ ...prev, [field]: null }));
      onChange({ [field]: val });
    }
  };

  const handleBlur = (field) => {
    const raw = String(data[field] || '').replace(',', '.');
    const val = isDecimal(field) ? parseFloat(raw) : parseInt(raw);
    const { min, max } = FIELDS[field];
    if (!isNaN(val)) {
      const clamped = Math.min(Math.max(val, min), max);
      onChange({ [field]: clamped });
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const step = (field, dir) => {
    const { min, max, default: def } = FIELDS[field];
    const cur = parseInt(dataRef.current[field]) || def;
    const next = Math.min(max, Math.max(min, cur + (dir === 'up' ? 1 : -1)));
    handleChange(field, String(next));
  };

  const startHold = (field, dir) => {
    step(field, dir);
    holdRef.current = setTimeout(() => {
      holdRef.current = setInterval(() => step(field, dir), 80);
    }, 400);
  };

  const stopHold = () => {
    clearTimeout(holdRef.current);
    clearInterval(holdRef.current);
    holdRef.current = null;
  };

  const numInput = (field) => {
    const { placeholder } = FIELDS[field];
    const labelText = field === 'height' ? 'Taille (cm)' : field === 'weight' ? 'Poids (kg)' : 'Âge';
    return (
      <div className="space-y-2">
        <Label className="text-white">{labelText}</Label>
        <div className="relative">
          <Input
            type="text"
            inputMode="numeric"
            placeholder={placeholder}
            value={data[field] || ''}
            onChange={(e) => {
              let raw = e.target.value;
              if (field === 'weight') {
                raw = raw.replace('.', ',').replace(/[^0-9,]/g, '').replace(/(,.*),/g, '$1').replace(/(,\d{3})\d+/, '$1');
              } else if (field === 'height') {
                raw = raw.replace('.', ',').replace(/[^0-9,]/g, '').replace(/(,.*),/g, '$1').replace(/(,\d{1})\d+/, '$1');
              } else {
                raw = raw.replace(/[^0-9]/g, '');
              }
              handleChange(field, raw);
            }}
            onBlur={() => handleBlur(field)}
            onKeyDown={(e) => {
              if (e.key === 'Enter')     { e.target.blur(); }
              if (e.key === 'ArrowUp')   { e.preventDefault(); step(field, 'up'); }
              if (e.key === 'ArrowDown') { e.preventDefault(); step(field, 'down'); }
            }}
            className={`pr-6 bg-white/20 border-white/40 text-white placeholder:text-white/50 ${errors[field] ? 'border-red-400' : ''}`}
          />
          <div className="absolute right-1 top-0 h-full flex flex-col justify-center">
            <button type="button" tabIndex={-1}
              onMouseDown={(e) => { e.preventDefault(); startHold(field, 'up'); }}
              onMouseUp={stopHold} onMouseLeave={stopHold}
              className="text-white/50 hover:text-white leading-none">
              <ChevronUp className="w-3 h-3" />
            </button>
            <button type="button" tabIndex={-1}
              onMouseDown={(e) => { e.preventDefault(); startHold(field, 'down'); }}
              onMouseUp={stopHold} onMouseLeave={stopHold}
              className="text-white/50 hover:text-white leading-none">
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>
        {errors[field] && <p className="text-xs text-red-300">{errors[field]}</p>}
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
        <div className="grid grid-cols-2 gap-3">
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
          <Label className="text-white">Niveau <span className="text-red-400">*</span></Label>
          <Select value={data.level || ''} onValueChange={(v) => onChange({ level: v })}>
            <SelectTrigger className="bg-white/20 border-white/40 text-white [&>span]:text-white [&>span[data-placeholder]]:text-white/50 [&>svg]:opacity-100 [&>svg]:text-white">
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
