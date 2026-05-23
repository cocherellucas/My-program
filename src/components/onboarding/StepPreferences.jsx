import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Shield, Dumbbell, X, Minus, HelpCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const FRAGILE_ZONES = [
  { key: 'wrists',     label: 'Poignets' },
  { key: 'shoulders',  label: 'Épaules' },
  { key: 'elbows',     label: 'Coudes' },
  { key: 'knees',      label: 'Genoux' },
  { key: 'lower_back', label: 'Bas du dos' },
  { key: 'neck',       label: 'Cervicales' },
];

const GOALS = [
  {
    key:   'strengthen',
    label: 'Renforcer',
    icon:  Dumbbell,
    desc:  'Travailler cette zone pour la consolider',
    color: 'border-blue-300 bg-blue-500 text-white',
    chip:  'border-blue-300 bg-blue-500 text-white',
  },
  {
    key:   'protect',
    label: 'Protéger',
    icon:  Shield,
    desc:  'Supprime les poids libres, remplace par machines et câbles',
    color: 'border-orange-300 bg-orange-500 text-white',
    chip:  'border-orange-300 bg-orange-500 text-white',
  },
  {
    key:   'info',
    label: 'Note pour l\'IA',
    icon:  Minus,
    desc:  'Le Coach IA en tiendra compte dans ses conseils',
    color: 'border-violet-300 bg-violet-500 text-white',
    chip:  'border-violet-300 bg-violet-500 text-white',
  },
];

export default function StepPreferences({ data, onChange }) {
  const [selecting, setSelecting] = useState(null); // zone key en attente de goal

  const zones = (() => { const r = data.fragile_zones; if (!r) return []; if (Array.isArray(r)) return r; try { return JSON.parse(r) || []; } catch { return []; } })();

  const getZone = (key) => zones.find(z => z.key === key);

  const selectZone = (key) => {
    if (getZone(key)) {
      // Déjà sélectionnée → supprimer
      onChange({ fragile_zones: zones.filter(z => z.key !== key) });
      if (selecting === key) setSelecting(null);
    } else {
      // Nouvelle sélection → demander le goal
      setSelecting(key);
    }
  };

  const assignGoal = (zoneKey, goal) => {
    onChange({ fragile_zones: [...zones, { key: zoneKey, goal }] });
    setSelecting(null);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-2">
        <h2 className="text-2xl font-heading font-bold text-white">Tes préférences</h2>
        <p className="text-white/70 mt-2">On adapte l'entraînement à tes goûts</p>
      </div>

      {/* Zones sensibles */}
      <div className="space-y-3">
        <div>
          <p className="text-sm font-semibold text-white">Zones sensibles</p>
          <p className="text-xs text-white/50 mt-0.5">Sélectionne une zone puis choisis l'intention</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {FRAGILE_ZONES.map(({ key, label }) => {
            const zone    = getZone(key);
            const goal    = GOALS.find(g => g.key === zone?.goal);
            const waiting = selecting === key;

            return (
              <button key={key} type="button" onClick={() => selectZone(key)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all',
                  zone
                    ? goal?.chip
                    : waiting
                    ? 'border-white bg-violet-500 text-white'
                    : 'border-violet-400 bg-[#8b45f8] text-white/80 hover:border-white hover:text-white'
                )}>
                {zone && goal && <goal.icon className="w-3 h-3" />}
                {label}
                {zone && <X className="w-3 h-3 opacity-60" />}
              </button>
            );
          })}
        </div>

        {/* Choix de l'intention */}
        {selecting && (
          <div className="p-3 bg-white/10 rounded-xl border border-white/20 space-y-2">
            <div className="flex items-center gap-1.5">
              <p className="text-xs text-white/60">
                {FRAGILE_ZONES.find(z => z.key === selecting)?.label} — quelle est ton intention ?
              </p>
              <Popover>
                <PopoverTrigger asChild>
                  <button type="button" className="text-white/30 hover:text-white/60 transition-colors">
                    <HelpCircle className="w-3.5 h-3.5" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-64 text-xs space-y-2">
                  <p className="font-semibold">Pourquoi ce choix ?</p>
                  <p><span className="font-medium">Renforcer</span> — utile si la zone est ancienne ou stabilisée. Le programme la cible en priorité avec une progression conservative.</p>
                  <p><span className="font-medium">Protéger</span> — utile si la douleur est récente ou active. Les poids libres sont remplacés par machines et câbles.</p>
                  <p><span className="font-medium">Note pour l'IA</span> — tu n'es pas sûr. L'info est mémorisée et le Coach IA pourra poser des questions précises.</p>
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {GOALS.map(({ key, label, icon: Icon, desc, color }) => (
                <button key={key} type="button" onClick={() => assignGoal(selecting, key)}
                  className={cn('flex flex-col items-start gap-1.5 p-2.5 rounded-lg border-2 text-left transition-all hover:scale-[1.02]', color)}>
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  <p className="text-xs font-bold leading-tight">{label}</p>
                  <p className="text-[9px] opacity-90 leading-tight">{desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Résumé zones sélectionnées */}
        {zones.length > 0 && !selecting && (
          <div className="space-y-1.5">
            {zones.map(z => {
              const zDef = FRAGILE_ZONES.find(f => f.key === z.key);
              const gDef = GOALS.find(g => g.key === z.goal);
              if (!zDef || !gDef) return null;
              const Icon = gDef.icon;
              return (
                <div key={z.key} className={cn('flex items-center gap-2 px-3 py-2 rounded-lg border text-xs', gDef.color)}>
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="font-medium">{zDef.label}</span>
                  <span className="opacity-70">— {z.goal === 'strengthen' ? 'à renforcer en priorité' : z.goal === 'protect' ? 'à protéger des charges lourdes' : 'noté — le Coach IA pourra en parler'}</span>
                </div>
              );
            })}
            {zones.some((/** @type {{goal:string}} */ z) => z.goal === 'strengthen' || z.goal === 'protect') && (
              <p className="text-xs text-white/40 px-1 pt-1">
                Ces zones sont automatiquement intégrées à ton programme — pas besoin de créer un objectif spécifique pour ces muscles sur la page suivante.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Techniques avancées */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-semibold text-white">Techniques avancées</p>
          <Popover>
            <PopoverTrigger asChild>
              <button type="button" className="text-white/40 hover:text-white/70 transition-colors">
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 text-xs space-y-1.5">
              <p>Supersets, rest-pause, drop sets, séries dégressives. Augmente l'intensité et réduit le temps de séance mais demande plus d'expérience.</p>
            </PopoverContent>
          </Popover>
        </div>
        {data.level === 'beginner' ? (
          <div className="p-3 rounded-xl bg-orange-500/15 border border-orange-400/30">
            <p className="text-xs text-orange-200 font-semibold mb-0.5">Non disponible en débutant</p>
            <p className="text-xs text-orange-200/70">Les patterns moteurs ne sont pas encore automatisés. Enchaîner des exercices sans maîtriser le geste de base augmente le risque de blessure et ancre de mauvaises habitudes. Passe en intermédiaire pour déverrouiller cette option.</p>
          </div>
        ) : (
          <>
            <p className="text-xs text-white/50">Autoriser les supersets, rest-pause et drop sets dans ton programme ?</p>
            <div className="flex gap-2">
              <button type="button"
                onClick={() => onChange({ accepts_advanced_techniques: true })}
                className={cn('flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-colors',
                  data.accepts_advanced_techniques === true
                    ? 'bg-white text-violet-700 border-white'
                    : 'bg-white/10 text-white/60 border-white/20 hover:bg-white/20')}>
                Oui
              </button>
              <button type="button"
                onClick={() => onChange({ accepts_advanced_techniques: false })}
                className={cn('flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-colors',
                  data.accepts_advanced_techniques === false
                    ? 'bg-white text-violet-700 border-white'
                    : 'bg-white/10 text-white/60 border-white/20 hover:bg-white/20')}>
                Non
              </button>
            </div>
          </>
        )}
      </div>

      {/* Exercices */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-white">Exercices que tu aimes</p>
          <Textarea
            placeholder="squat, tractions, développé..."
            value={(Array.isArray(data.preferred_exercises) ? data.preferred_exercises : (() => { try { return JSON.parse(data.preferred_exercises || '[]'); } catch { return []; } })()).join(', ')}
            onChange={(e) => onChange({ preferred_exercises: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/25 resize-none text-sm"
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-white">Exercices que tu évites</p>
          <Textarea
            placeholder="fentes, burpees, rowing barre..."
            value={(Array.isArray(data.disliked_exercises) ? data.disliked_exercises : (() => { try { return JSON.parse(data.disliked_exercises || '[]'); } catch { return []; } })()).join(', ')}
            onChange={(e) => onChange({ disliked_exercises: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/25 resize-none text-sm"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}
