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
    setSessions(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s));
  };

  const addSession = () => {
    setSessions(prev => [...prev, { label: '', day: 'monday', exercises: [], type: 'mixed', estimated_duration: 60 }]);
  };

  const removeSession = (i) => {
    setSessions(prev => prev.filter((_, idx) => idx !== i));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-sm mx-0 rounded-t-3xl overflow-hidden" style={{ background: 'linear-gradient(160deg, #2e1065, #1e0050)', border: '1px solid rgba(255,255,255,0.15)', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div className="px-5 pt-5 pb-3 border-b border-white/10 flex-shrink-0">
          <h2 className="font-bold text-white text-lg">Importer dans le programme</h2>
          <p className="text-white/40 text-xs mt-0.5">Choisis les jours et la durée du cycle</p>
        </div>

        {/* Sessions */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {sessions.map((s, i) => (
            <div key={i} className="rounded-2xl p-3 space-y-2" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}>
              <div className="flex items-center justify-between gap-2">
                <input
                  value={s.label}
                  onChange={e => updateSession(i, 'label', e.target.value)}
                  placeholder="Nom de la séance"
                  className="flex-1 bg-transparent text-white text-sm font-semibold outline-none placeholder-white/30"
                />
                {sessions.length > 1 && (
                  <button onClick={() => removeSession(i)} className="text-white/30 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {DAYS.map(d => (
                  <button key={d.value} onClick={() => updateSession(i, 'day', d.value)}
                    className="py-1.5 rounded-lg text-[10px] font-bold transition-all"
                    style={{
                      background: s.day === d.value ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : 'rgba(255,255,255,0.08)',
                      color: s.day === d.value ? 'white' : 'rgba(255,255,255,0.5)',
                    }}>
                    {d.label.slice(0, 2)}
                  </button>
                ))}
              </div>
              {s.exercises.length > 0 && (
                <p className="text-white/30 text-xs">{s.exercises.length} exercices</p>
              )}
            </div>
          ))}

          {/* Ajouter une séance */}
          <button onClick={addSession}
            className="w-full py-3 rounded-2xl border border-dashed border-white/20 text-white/40 text-sm font-semibold flex items-center justify-center gap-2 hover:border-white/40 hover:text-white/60 transition-all">
            <Plus className="w-4 h-4" />
            Ajouter une séance
          </button>

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
            <div className="relative mt-1.5 h-3">
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
            onClick={() => onImport(sessions, weeks)}
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
