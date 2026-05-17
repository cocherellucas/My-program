import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ChevronUp, ChevronDown, HelpCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const DAYS = [
  { key: 'monday', label: 'Lun' },
  { key: 'tuesday', label: 'Mar' },
  { key: 'wednesday', label: 'Mer' },
  { key: 'thursday', label: 'Jeu' },
  { key: 'friday', label: 'Ven' },
  { key: 'saturday', label: 'Sam' },
  { key: 'sunday', label: 'Dim' },
];

export default function StepAvailability({ data, onChange }) {
  const selectedDays = data.available_days || [];
  const durations = data.duration_per_day || {};

  const [durationErrors, setDurationErrors] = React.useState({});
  const lastKeyRef = React.useRef(null);
  const holdRef = React.useRef(null);
  const durationsRef = React.useRef(durations);
  durationsRef.current = durations;

  const toggleDay = (day) => {
    const newDays = selectedDays.includes(day)
      ? selectedDays.filter(d => d !== day)
      : [...selectedDays, day];
    onChange({ available_days: newDays });
  };

  const setDuration = (day, mins) => {
    if (mins === '') {
      onChange({ duration_per_day: { ...durationsRef.current, [day]: '' } });
      setDurationErrors(prev => ({ ...prev, [day]: null }));
      return;
    }
    const val = parseInt(mins);
    if (isNaN(val)) return;
    if (val < 10) {
      setDurationErrors(prev => ({ ...prev, [day]: 'Minimum 10 min pour progresser' }));
      const blocked = lastKeyRef.current === 'ArrowDown' ? 10 : val;
      onChange({ duration_per_day: { ...durationsRef.current, [day]: blocked } });
    } else if (val > 180) {
      setDurationErrors(prev => ({ ...prev, [day]: "Plus de 3h n'est pas nécessaire pour progresser" }));
      onChange({ duration_per_day: { ...durationsRef.current, [day]: 180 } });
    } else {
      setDurationErrors(prev => ({ ...prev, [day]: null }));
      onChange({ duration_per_day: { ...durationsRef.current, [day]: val } });
    }
  };

  const blurDuration = (day) => {
    const val = parseInt(durationsRef.current[day]);
    if (!val || val < 10) {
      onChange({ duration_per_day: { ...durationsRef.current, [day]: 10 } });
      setDurationErrors(prev => ({ ...prev, [day]: null }));
    } else if (val > 180) {
      onChange({ duration_per_day: { ...durationsRef.current, [day]: 180 } });
      setDurationErrors(prev => ({ ...prev, [day]: null }));
    }
  };

  const startHold = (day, direction) => {
    const step = () => {
      const cur = parseInt(durationsRef.current[day]) || 60;
      const next = direction === 'up' ? cur + 1 : cur - 1;
      setDuration(day, String(next));
    };
    step();
    holdRef.current = setTimeout(() => {
      holdRef.current = setInterval(step, 80);
    }, 400);
  };

  const stopHold = () => {
    clearTimeout(holdRef.current);
    clearInterval(holdRef.current);
    holdRef.current = null;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-heading font-bold text-white">Tes disponibilités</h2>
        <p className="text-white/70 mt-2">Quand peux-tu t'entraîner ?</p>
        <p className="text-white/40 text-xs mt-3">Les champs marqués <span className="text-red-400 font-bold">*</span> sont obligatoires</p>
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-xl border border-white/20 bg-white/5 space-y-2">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1">
            <p className="text-sm font-semibold text-white">Disponibilités optimales</p>
            <span className="text-red-400 font-bold">*</span>
          </div>
            <Popover>
              <PopoverTrigger asChild>
                <button type="button" className="text-white/40 hover:text-white/70 transition-colors">
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-64 text-xs space-y-1.5">
                <p><span className="font-semibold">Oui</span> — tu n'as pas de contrainte particulière. Le programme sera construit pour maximiser ta progression, quel que soit ton objectif.</p>
                <p><span className="font-semibold">Non</span> — tu as des jours ou des durées fixes. Renseigne-les manuellement ci-dessous.</p>
              </PopoverContent>
            </Popover>
          </div>
          <p className="text-xs text-white/50">Tu es libre pour un programme entièrement optimisé selon ton profil ?</p>
          <div className="flex gap-2 pt-1">
            <button type="button"
              onClick={() => onChange({ availability_optimal: true })}
              className={cn('flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-colors',
                data.availability_optimal === true
                  ? 'bg-white text-violet-700 border-white'
                  : 'bg-white/10 text-white/60 border-white/20 hover:bg-white/20')}>
              Oui
            </button>
            <button type="button"
              onClick={() => onChange({ availability_optimal: false })}
              className={cn('flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-colors',
                data.availability_optimal === false
                  ? 'bg-white text-violet-700 border-white'
                  : 'bg-white/10 text-white/60 border-white/20 hover:bg-white/20')}>
              Non
            </button>
          </div>
        </div>
        {data.availability_optimal === false && <Label className="text-white">Jours libres pour l'entraînement <span className="text-red-400">*</span></Label>}
        {data.availability_optimal === false && <div className="grid grid-cols-7 gap-2">
          {DAYS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => toggleDay(key)}
              onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
              className={cn(
                'flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-200',
                selectedDays.includes(key)
                  ? 'border-white bg-white/20 text-white'
                  : 'border-white/20 bg-white/10 text-white/50 hover:border-white/40'
              )}
            >
              <span className="text-sm font-semibold">{label}</span>
            </button>
          ))}
        </div>}

      </div>

      {data.availability_optimal === false && selectedDays.length > 0 && (
        <div className="space-y-3">
          <Label className="text-white">Durée par jour (minutes) <span className="text-red-400">*</span></Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {DAYS.filter(d => selectedDays.includes(d.key)).map(({ key, label }) => (
              <div key={key} className="flex flex-col gap-1">
                <div className="flex items-center gap-2 p-3 bg-white/10 rounded-xl border border-white/20">
                  <span className="text-sm font-medium w-10 text-white">{label}</span>
                  <div className="relative flex-1">
                    <Input
                      type="text"
                      inputMode="numeric"
                      placeholder="60"
                      value={durations[key] ?? ''}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/[^0-9]/g, '');
                        setDuration(key, raw === '' ? '' : raw);
                      }}
                      onBlur={() => blurDuration(key)}
                      onKeyDown={(e) => {
                        lastKeyRef.current = e.key;
                        if (e.key === 'Enter') { e.target.blur(); return; }
                        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                          e.preventDefault();
                          const cur = parseInt(durationsRef.current[key]) || 60;
                          const next = e.key === 'ArrowUp' ? cur + 1 : cur - 1;
                          setDuration(key, String(next));
                        }
                      }}
                      className={`h-8 pr-6 bg-white/10 border-white/20 text-white placeholder:text-white/30 ${durationErrors[key] ? 'border-red-400' : ''}`}
                    />
                    <div className="absolute right-1 top-0 h-full flex flex-col justify-center">
                      <button type="button" tabIndex={-1}
                        onMouseDown={(e) => { e.preventDefault(); startHold(key, 'up'); }}
                        onMouseUp={stopHold} onMouseLeave={stopHold}
                        className="text-white/50 hover:text-white leading-none">
                        <ChevronUp className="w-3 h-3" />
                      </button>
                      <button type="button" tabIndex={-1}
                        onMouseDown={(e) => { e.preventDefault(); startHold(key, 'down'); }}
                        onMouseUp={stopHold} onMouseLeave={stopHold}
                        className="text-white/50 hover:text-white leading-none">
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <span className="text-xs text-white/60">min</span>
                </div>
                {durationErrors[key] && (
                  <p className="text-xs text-red-300 px-1">{durationErrors[key]}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}


      {/* Avertissement fréquence min vs jours sélectionnés */}
      {data.availability_optimal === false && data.frequency_min && selectedDays.length < data.frequency_min && (
        <p className="text-xs text-orange-300 bg-orange-400/10 border border-orange-400/30 rounded-lg px-3 py-2">
          ⚠️ Tu veux minimum {data.frequency_min}× par semaine mais tu n'as sélectionné que {selectedDays.length} jour{selectedDays.length > 1 ? 's' : ''}. Ajoute au moins {data.frequency_min - selectedDays.length} jour{data.frequency_min - selectedDays.length > 1 ? 's' : ''} supplémentaire{data.frequency_min - selectedDays.length > 1 ? 's' : ''}.
        </p>
      )}

      {/* Avertissement fréquence max vs jours sélectionnés */}
      {data.availability_optimal === false && data.frequency_max && selectedDays.length < data.frequency_max && !(data.frequency_min && selectedDays.length < data.frequency_min) && (
        <p className="text-xs text-orange-300 bg-orange-400/10 border border-orange-400/30 rounded-lg px-3 py-2">
          ⚠️ Tu veux jusqu'à {data.frequency_max}× par semaine mais tu n'as sélectionné que {selectedDays.length} jour{selectedDays.length > 1 ? 's' : ''}. Ajoute des jours ou réduis la fréquence maximum.
        </p>
      )}

      {data.availability_optimal === false && <div className="grid grid-cols-2 gap-4">
        {[
          { field: 'frequency_min', label: 'Fréquence min/sem', placeholder: '3', default: 3 },
          { field: 'frequency_max', label: 'Fréquence max/sem', placeholder: '5', default: 5 },
        ].map(({ field, label, placeholder, default: def }) => (
          <div key={field} className="space-y-2">
            <Label className="text-white">{label} <span className="text-red-400">*</span></Label>
            <div className="relative">
              <Input
                type="text"
                inputMode="numeric"
                placeholder={placeholder}
                value={data[field] || ''}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, '');
                  const val = parseInt(raw);
                  if (raw === '') { onChange({ [field]: '' }); return; }
                  const min = field === 'frequency_max' ? (parseInt(data.frequency_min) || 1) : 1;
                  const max = field === 'frequency_min' ? (parseInt(data.frequency_max) || 6) : 6;
                  onChange({ [field]: Math.min(Math.max(val, min), max) });
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { e.target.blur(); return; }
                  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    const cur = parseInt(data[field]) || def;
                    const next = cur + (e.key === 'ArrowUp' ? 1 : -1);
                    const min = field === 'frequency_max' ? (parseInt(data.frequency_min) || 1) : 1;
                    onChange({ [field]: Math.min(6, Math.max(min, next)) });
                  }
                }}
                className="pr-6 bg-white/10 border-white/20 text-white placeholder:text-white/30"
              />
              <div className="absolute right-1 top-0 h-full flex flex-col justify-center">
                <button type="button" tabIndex={-1}
                  onMouseDown={(e) => { e.preventDefault(); onChange({ [field]: Math.min(6, (parseInt(data[field]) || def) + 1) }); }}
                  className="text-white/50 hover:text-white leading-none">
                  <ChevronUp className="w-3 h-3" />
                </button>
                <button type="button" tabIndex={-1}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    const cur = parseInt(data[field]) || def;
                    const min = field === 'frequency_max' ? (parseInt(data.frequency_min) || 1) : 1;
                    onChange({ [field]: Math.max(min, cur - 1) });
                  }}
                  className="text-white/50 hover:text-white leading-none">
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>}

    </div>
  );
}
