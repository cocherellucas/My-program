import React, { useState } from 'react';
import { Plus, Trash2, Sparkles } from 'lucide-react';

const DAYS = [
  { value: 'monday', label: 'Lundi' },
  { value: 'tuesday', label: 'Mardi' },
  { value: 'wednesday', label: 'Mercredi' },
  { value: 'thursday', label: 'Jeudi' },
  { value: 'friday', label: 'Vendredi' },
  { value: 'saturday', label: 'Samedi' },
  { value: 'sunday', label: 'Dimanche' },
];


const parseExercises = (text) => {
  if (!text) return [];
  return text.split(/[,\n;]+/).map(line => line.trim()).filter(Boolean).map(line => {
    const setsReps = line.match(/(\d+)\s*[×x\*]\s*(\d+)/);
    const weight = line.match(/(\d+(?:[.,]\d+)?)\s*kg/i);
    const rest = line.match(/(\d+)\s*(?:s|sec|mn|min)/i);
    const name = line.replace(/\d+\s*[×x\*]\s*\d+/, '').replace(/\d+(?:[.,]\d+)?\s*kg/i, '').replace(/\d+\s*(?:s|sec|mn|min)/i, '').replace(/[,;]/g, '').trim();
    return {
      name: name || line.trim(),
      sets: setsReps ? parseInt(setsReps[1]) : 3,
      target_reps: setsReps ? setsReps[2] : '10',
      target_weight: weight ? parseFloat(weight[1].replace(',', '.')) : null,
      rest_seconds: rest ? parseInt(rest[1]) * (rest[0].toLowerCase().includes('mn') || rest[0].toLowerCase().includes('min') ? 60 : 1) : 90,
      muscle_group: '',
    };
  }).filter(e => e.name);
};

export default function ImportSessionDialog({ sessions: initialSessions, onImport, onClose }) {
  const [sessions, setSessions] = useState(() =>
    (initialSessions || [{ label: '', day: 'monday', exercises: [] }]).map(s => ({
      label: s.day_label || s.label || '',
      day: s.day || 'monday',
      exercises: s.exercises || [],
      type: s.type || 'mixed',
      estimated_duration: s.estimated_duration || 60,
    }))
  );
  const [weeks, setWeeks] = useState(4);

  const updateSession = (i, field, value) => {
    setSessions(prev => {
      const updated = prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s);
      // Si on change l'ordre, inverser automatiquement l'autre séance du même jour
      if (field === 'order') {
        const day = updated[i].day;
        const sibling = updated.findIndex((s, idx) => idx !== i && s.day === day);
        if (sibling !== -1) updated[sibling] = { ...updated[sibling], order: value === 1 ? 2 : 1 };
      }
      return updated;
    });
  };

  const addSession = () => {
    if (sessions.length >= 14) return;
    const dayCounts = {};
    sessions.forEach(s => { dayCounts[s.day] = (dayCounts[s.day] || 0) + 1; });
    const nextDay = DAYS.find(d => (dayCounts[d.value] || 0) === 0)?.value
      || DAYS.find(d => (dayCounts[d.value] || 0) < 2)?.value
      || 'monday';
    setSessions(prev => [...prev, { label: '', day: nextDay, exercises: [], type: 'mixed', estimated_duration: 60, order: 1 }]);
  };

  const countForDay = (day, excludeIdx) => sessions.filter((s, i) => i !== excludeIdx && s.day === day).length;

  const removeSession = (i) => {
    setSessions(prev => prev.filter((_, idx) => idx !== i));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3">
      <div className="w-full max-w-sm rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(160deg, #2e1065, #1e0050)', border: '1px solid rgba(255,255,255,0.15)', height: 'calc(100vh - 24px)', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div className="px-5 pt-5 pb-3 border-b border-white/10 flex-shrink-0">
          <h2 className="font-bold text-white text-lg">Importer dans le programme</h2>
          <p className="text-white/40 text-xs mt-0.5">Choisis les jours et la durée du cycle</p>
        </div>

        {/* Sessions */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {sessions.map((s, i) => (
            <div key={i} className="rounded-2xl p-3 space-y-2" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}>
              <div className="flex items-center justify-between gap-2 mb-2">
                <input
                  value={s.label}
                  onChange={e => updateSession(i, 'label', e.target.value)}
                  placeholder="Titre de la séance"
                  className="flex-1 bg-transparent text-white text-sm font-semibold outline-none placeholder-white/30"
                />
                {sessions.length > 1 && (
                  <button onClick={() => removeSession(i)} className="text-white/30 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <textarea
                value={s.content || ''}
                onChange={e => updateSession(i, 'content', e.target.value)}
                placeholder="Ex: 4×10 développé couché 80kg, 3×12 dips 20kg, 3×15 écartés..."
                rows={6}
                className="w-full bg-white/5 rounded-xl px-3 py-2 text-white text-sm outline-none placeholder-white/25 resize-none leading-relaxed mb-2 border border-white/10"
              />
              <div className="grid grid-cols-7 gap-1">
                {DAYS.map(d => {
                  const alreadyTwo = countForDay(d.value, i) >= 2;
                  const isSelected = s.day === d.value;
                  return (
                    <button key={d.value}
                      onClick={() => { if (!alreadyTwo || isSelected) updateSession(i, 'day', d.value); }}
                      className="py-1.5 rounded-lg text-[10px] font-bold transition-all"
                      style={{
                        background: isSelected ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : 'rgba(255,255,255,0.08)',
                        color: isSelected ? 'white' : alreadyTwo ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.5)',
                        opacity: alreadyTwo && !isSelected ? 0.4 : 1,
                      }}>
                      {d.label.slice(0, 2)}
                    </button>
                  );
                })}
              </div>
              {countForDay(s.day, i) === 1 && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-white/40 text-xs">Ordre dans la journée :</span>
                  <div className="flex gap-1">
                    {[1,2].map(o => (
                      <button key={o} onClick={() => updateSession(i, 'order', o)}
                        className="px-3 py-1 rounded-lg text-xs font-bold transition-all"
                        style={{
                          background: (s.order || 1) === o ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : 'rgba(255,255,255,0.08)',
                          color: (s.order || 1) === o ? 'white' : 'rgba(255,255,255,0.5)',
                        }}>
                        {o === 1 ? '1ère' : '2ème'}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Ajouter une séance */}
          {sessions.length < 14 && (
            <button onClick={addSession}
              className="w-full py-3 rounded-2xl border border-dashed border-white/20 text-white/40 text-sm font-semibold flex items-center justify-center gap-2 hover:border-white/40 hover:text-white/60 transition-all">
              <Plus className="w-4 h-4" />
              Ajouter une séance ({sessions.length}/14)
            </button>
          )}

          {/* Durée — slider */}
          <div className="pt-1">
            <div className="flex items-center justify-between mb-3">
              <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">Durée du cycle</p>
              <span className="font-bold text-white text-lg" style={{ minWidth: 28, textAlign: 'right' }}>
                {weeks === 'infinite' ? '∞' : `${weeks} sem.`}
              </span>
            </div>
            <style>{`
              .weeks-slider { -webkit-appearance: none; appearance: none; width: 100%; height: 6px; border-radius: 99px; outline: none; background: linear-gradient(to right, #7c3aed 0%, #a855f7 var(--pct), rgba(255,255,255,0.12) var(--pct), rgba(255,255,255,0.12) 100%); }
              .weeks-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 24px; height: 24px; border-radius: 50%; background: white; cursor: pointer; box-shadow: 0 2px 8px rgba(124,58,237,0.5); }
              .weeks-slider::-moz-range-thumb { width: 24px; height: 24px; border-radius: 50%; background: white; cursor: pointer; border: none; box-shadow: 0 2px 8px rgba(124,58,237,0.5); }
            `}</style>
            <input
              type="range" min={1} max={11} step={1}
              value={weeks === 'infinite' ? 11 : weeks}
              onChange={e => { const v = parseInt(e.target.value); setWeeks(v === 11 ? 'infinite' : v); }}
              className="weeks-slider"
              style={{ '--pct': `${((weeks === 'infinite' ? 11 : weeks) - 1) / 10 * 100}%` }}
            />
            <div className="relative mt-2 h-6">
              {[{label:'1',step:0},{label:'5',step:4},{label:'10',step:9},{label:'∞',step:10,big:true}].map(t => (
                <span key={t.label} className={`absolute -translate-x-1/2 text-white/70 font-bold ${t.big ? 'text-xl leading-none' : 'text-sm'}`}
                  style={{ left: `calc(${t.step}/10 * (100% - 24px) + 12px)` }}>{t.label}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-8 pt-3 flex gap-2 flex-shrink-0 border-t border-white/10">
          <button onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-white/15 text-white/50 text-sm font-semibold hover:bg-white/10 transition-colors">
            Annuler
          </button>
          <button
            onClick={() => onImport(sessions.map(s => ({ ...s, exercises: s.exercises?.length ? s.exercises : parseExercises(s.content) })), weeks)}
            disabled={sessions.length === 0}
            className="flex-1 py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
            <Sparkles className="w-4 h-4" />
            Importer
          </button>
        </div>
      </div>
    </div>
  );
}
