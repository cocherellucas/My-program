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
  const selectedDays = (() => { const r = data.available_days; if (!r) return []; if (Array.isArray(r)) return r; try { return JSON.parse(r) || []; } catch { return []; } })();
  const durations = data.duration_per_day || {};

  const [durationErrors, setDurationErrors] = React.useState({});
  const sameDurationAll = data.same_duration_all ?? null;
  const setSameDurationAll = (v) => onChange({ same_duration_all: v });
  const lastKeyRef = React.useRef(null);
  const holdRef = React.useRef(null);
  const durationsRef = React.useRef(durations);
  durationsRef.current = durations;

  const toggleDay = (day) => {
    const wasSelected = selectedDays.includes(day);
    const newDays = wasSelected
      ? selectedDays.filter(d => d !== day)
      : [...selectedDays, day];
    const next = { available_days: newDays };
    // Si on ajoute un nouveau jour sans durée, mettre 60 par défaut
    if (!wasSelected && !durations[day]) {
      next.duration_per_day = { ...durations, [day]: 60 };
    }
    onChange(next);
  };

  const setDuration = (day, mins, _propagating) => {
    // Si toggle "Même partout" actif, propager à tous les jours sélectionnés
    const targets = (sameDurationAll && !_propagating) ? selectedDays : [day];
    const applyTo = (val, errorMsg) => {
      const next = { ...durationsRef.current };
      targets.forEach(d => { next[d] = val; });
      onChange({ duration_per_day: next });
      setDurationErrors(prev => {
        const upd = { ...prev };
        targets.forEach(d => { upd[d] = errorMsg; });
        return upd;
      });
    };
    if (mins === '') { applyTo('', null); return; }
    const val = parseInt(mins);
    if (isNaN(val)) return;
    if (val < 10) {
      const blocked = lastKeyRef.current === 'ArrowDown' ? 10 : val;
      applyTo(blocked, 'Minimum 10 min pour progresser');
    } else if (val > 180) {
      applyTo(180, "Plus de 3h n'est pas nécessaire pour progresser");
    } else {
      applyTo(val, null);
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
        <div className="space-y-4">
          {selectedDays.length > 1 && (
            <div className="space-y-2">
              <Label className="text-white">Même durée chaque jour ? <span className="text-red-400">*</span></Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSameDurationAll(true);
                    const firstFilled = selectedDays.find(d => durations[d] && !isNaN(parseInt(durations[d])));
                    const refValue = firstFilled ? durations[firstFilled] : '60';
                    selectedDays.forEach(d => setDuration(d, String(refValue), true));
                  }}
                  className={`py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                    sameDurationAll === true
                      ? 'bg-white text-violet-700 border-white shadow'
                      : 'bg-white/10 text-white border-white/20 hover:bg-white/15'
                  }`}
                >
                  Oui
                </button>
                <button
                  type="button"
                  onClick={() => setSameDurationAll(false)}
                  className={`py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                    sameDurationAll === false
                      ? 'bg-white text-violet-700 border-white shadow'
                      : 'bg-white/10 text-white border-white/20 hover:bg-white/15'
                  }`}
                >
                  Non
                </button>
              </div>
            </div>
          )}

          {/* Si plusieurs jours sélectionnés, on attend la réponse avant d'afficher les durées */}
          {(selectedDays.length === 1 || sameDurationAll !== null) && (() => {
            const PRESETS = [
              { value: 30, label: '30 min' },
              { value: 45, label: '45 min' },
              { value: 60, label: '60 min' },
              { value: 90, label: '90 min' },
              { value: 120, label: '2h+' },
            ];
            const renderPresets = (day) => (
              <div className="grid grid-cols-5 gap-1.5">
                {PRESETS.map(p => {
                  const cur = parseInt(durations[day]);
                  const active = cur === p.value || (p.value === 120 && cur >= 120);
                  return (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setDuration(day, String(p.value))}
                      className={`py-2 rounded-lg text-xs font-semibold transition-all ${
                        active
                          ? 'bg-white text-violet-700 shadow'
                          : 'bg-white/10 text-white border border-white/20 hover:bg-white/15'
                      }`}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
            );

            if (sameDurationAll && selectedDays.length > 1) {
              return (
                <div className="space-y-2">
                  <Label className="text-white">Durée</Label>
                  {renderPresets(selectedDays[0])}
                  {durationErrors[selectedDays[0]] && (
                    <p className="text-xs text-red-300 px-1">{durationErrors[selectedDays[0]]}</p>
                  )}
                </div>
              );
            }
            return (
              <div className="space-y-2">
                <Label className="text-white">Durée par jour</Label>
                <div className="p-3 rounded-xl bg-white/5 border border-white/15 space-y-3">
                  {DAYS.filter(d => selectedDays.includes(d.key)).map(({ key, label }, idx) => (
                    <div key={key} className={`space-y-1.5 ${idx > 0 ? 'pt-3 border-t border-white/10' : ''}`}>
                      <span className="text-[11px] uppercase tracking-wider font-bold text-white/50">{label}</span>
                      {renderPresets(key)}
                      {durationErrors[key] && (
                        <p className="text-xs text-red-300 px-1">{durationErrors[key]}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}


      {data.availability_optimal === false && <div className="space-y-4">
        {[
          { field: 'frequency_max', label: 'Fréquence souhaitée par semaine', placeholder: '4', default: 4 },
        ].map(({ field, label, placeholder, default: def }) => (
          <div key={field} className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Label className="text-white">{label}</Label>
              <span className="text-red-400">*</span>
              <Popover>
                <PopoverTrigger asChild>
                  <button type="button" className="text-white/40 hover:text-white/70 transition-colors flex-shrink-0">
                    <HelpCircle className="w-3.5 h-3.5" />
                  </button>
                </PopoverTrigger>
                <PopoverContent avoidCollisions collisionPadding={16} className="w-64 text-xs space-y-1.5 bg-violet-900/95 backdrop-blur-sm border border-white/20 text-white shadow-xl z-[200]">
                  <p className="font-semibold text-violet-300">Fréquence souhaitée</p>
                  <p className="text-white/70">Le nombre d'entraînements par semaine que tu vises. Le coach ne planifiera jamais plus — c'est ton plafond.</p>
                </PopoverContent>
              </Popover>
            </div>
            <p className="text-[11px] text-white/50 pb-1">parmi tes {selectedDays.length} jour{selectedDays.length > 1 ? 's' : ''} libre{selectedDays.length > 1 ? 's' : ''} sélectionné{selectedDays.length > 1 ? 's' : ''}</p>
            <div className="relative max-w-[120px]">
              <Input
                type="text"
                inputMode="numeric"
                placeholder={placeholder}
                value={data[field] || ''}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, '');
                  const val = parseInt(raw);
                  if (raw === '') { onChange({ [field]: '' }); return; }
                  const clamped = Math.min(Math.max(val, 1), 6);
                  // frequency_min calé sur frequency_max pour cohérence
                  onChange({ [field]: clamped, frequency_min: clamped });
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { e.target.blur(); return; }
                  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    const cur = parseInt(data[field]) || def;
                    const next = cur + (e.key === 'ArrowUp' ? 1 : -1);
                    const clamped = Math.min(6, Math.max(1, next));
                    onChange({ [field]: clamped, frequency_min: clamped });
                  }
                }}
                className="pr-6 bg-white/10 border-white/20 text-white placeholder:text-white/30"
              />
              <div className="absolute right-1 top-0 h-full flex flex-col justify-center">
                <button type="button" tabIndex={-1}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    const clamped = Math.min(6, (parseInt(data[field]) || def) + 1);
                    onChange({ [field]: clamped, frequency_min: clamped });
                  }}
                  className="text-white/50 hover:text-white leading-none">
                  <ChevronUp className="w-3 h-3" />
                </button>
                <button type="button" tabIndex={-1}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    const cur = parseInt(data[field]) || def;
                    const clamped = Math.max(1, cur - 1);
                    onChange({ [field]: clamped, frequency_min: clamped });
                  }}
                  className="text-white/50 hover:text-white leading-none">
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>}

      {/* Avertissement fréquence vs jours sélectionnés */}
      {data.availability_optimal === false && data.frequency_max && selectedDays.length < data.frequency_max && (
        <p className="text-xs text-orange-300 bg-orange-400/10 border border-orange-400/30 rounded-lg px-3 py-2">
          ⚠️ Tu veux {data.frequency_max}× par semaine mais tu n'as sélectionné que {selectedDays.length} jour{selectedDays.length > 1 ? 's' : ''}. Ajoute des jours ou réduis la fréquence.
        </p>
      )}

    </div>
  );
}
