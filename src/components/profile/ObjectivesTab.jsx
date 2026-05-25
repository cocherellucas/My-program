import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Plus, Trash2, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

const TYPES = [
  { value: 'strength', label: 'Force' },
  { value: 'hypertrophy', label: 'Hypertrophie' },
  { value: 'endurance', label: 'Endurance' },
];

const ZONES = [
  { value: 'upper_body', label: 'Haut du corps' },
  { value: 'lower_body', label: 'Bas du corps' },
  { value: 'full_body', label: 'Tout le corps' },
  { value: 'specific_group', label: 'Groupe spécifique' },
];

const GROUPS = [
  'Pectoraux', 'Dos', 'Épaules', 'Biceps', 'Triceps',
  'Quadriceps', 'Ischio-jambiers', 'Fessiers', 'Mollets', 'Abdominaux'
];

export default function ObjectivesTab({ userId }) {
  const [objectives, setObjectives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  // track original ids for delete
  const [originalIds, setOriginalIds] = useState([]);

  useEffect(() => {
    if (!userId) return;
    base44.entities.Objective.filter({ user_id: userId }).then(data => {
      setObjectives(data.map(o => ({ ...o, _local: false })));
      setOriginalIds(data.map(o => o.id));
      setLoading(false);
    });
  }, [userId]);

  const addObjective = () => {
    setObjectives(prev => [...prev, {
      _local: true,
      type: 'hypertrophy',
      zone: 'full_body',
      priority: prev.length === 0 ? 'primary' : 'secondary',
      status: 'active',
      focus_group: '',
      focus_movement: '',
    }]);
  };

  const updateObj = (idx, field, value) => {
    setObjectives(prev => prev.map((o, i) => i === idx ? { ...o, [field]: value } : o));
  };

  const removeObj = async (idx) => {
    const obj = objectives[idx];
    if (obj.id) {
      await base44.entities.Objective.delete(obj.id);
    }
    setObjectives(prev => prev.filter((_, i) => i !== idx));
  };

  const save = async () => {
    setSaving(true);
    for (const obj of objectives) {
      const { _local, id, created_date, updated_date, created_by, ...fields } = obj;
      if (Array.isArray(fields.focus_group)) fields.focus_group = fields.focus_group.join(', ');
      fields.user_id = userId;
      if (id) {
        await base44.entities.Objective.update(id, fields);
      } else {
        await base44.entities.Objective.create(fields);
      }
    }
    toast.success('Objectifs mis à jour');
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-white/50" /></div>;

  return (
    <div className="space-y-4 mt-4">
      {objectives.map((obj, idx) => (
        <div key={idx} className="p-4 bg-white/10 rounded-xl border border-white/20 space-y-4">
          <div className="flex items-center justify-between">
            <span className={cn(
              'text-xs font-bold uppercase px-2.5 py-1 rounded-full',
              obj.priority === 'primary' ? 'bg-white/30 text-white' : 'bg-white/10 text-white/60'
            )}>
              {obj.priority === 'primary' ? 'Primaire' : 'Secondaire'}
            </span>
            <Button variant="ghost" size="icon" onClick={() => removeObj(idx)} className="h-8 w-8">
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-white">Type</Label>
              <Select value={obj.type} onValueChange={(v) => updateObj(idx, 'type', v)}>
                <SelectTrigger className="h-9 bg-white/10 border-white/20 text-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-white">Zone</Label>
              <Select value={obj.zone} onValueChange={(v) => updateObj(idx, 'zone', v)}>
                <SelectTrigger className="h-9 bg-white/10 border-white/20 text-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ZONES.map(z => <SelectItem key={z.value} value={z.value}>{z.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-white">Priorité</Label>
              <Select value={obj.priority} onValueChange={(v) => updateObj(idx, 'priority', v)}>
                <SelectTrigger className="h-9 bg-white/10 border-white/20 text-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Primaire</SelectItem>
                  <SelectItem value="secondary">Secondaire</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-white">Statut</Label>
              <Select value={obj.status || 'active'} onValueChange={(v) => updateObj(idx, 'status', v)}>
                <SelectTrigger className="h-9 bg-white/10 border-white/20 text-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="completed">Complété</SelectItem>
                  <SelectItem value="abandoned">Abandonné</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {obj.zone === 'specific_group' && (
              <div className="col-span-2 space-y-2">
                <Label className="text-xs text-white">Groupes musculaires</Label>
                <div className="flex flex-wrap gap-2">
                  {GROUPS.map(g => {
                    const base = Array.isArray(obj.focus_group) ? obj.focus_group : GROUPS;
                    const isChecked = base.includes(g);
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => {
                          const next = isChecked ? base.filter(x => x !== g) : [...base, g];
                          updateObj(idx, 'focus_group', next);
                        }}
                        className={cn(
                          'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                          isChecked ? 'bg-white/30 text-white border-white/40' : 'bg-white/10 text-white/40 border-white/20 line-through'
                        )}
                      >
                        {g}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {obj.type === 'strength' && (
            <div className="space-y-1.5">
              <Label className="text-xs text-white">Mouvement focus (optionnel)</Label>
              <Input
                placeholder="Ex : squat, bench press..."
                value={obj.focus_movement || ''}
                onChange={(e) => updateObj(idx, 'focus_movement', e.target.value)}
                className="h-9 bg-white/10 border-white/20 text-white placeholder:text-white/30"
              />
            </div>
          )}
        </div>
      ))}

      <Button variant="outline" onClick={addObjective} className="w-full border-white/30 text-white hover:bg-white/10 hover:text-white">
        <Plus className="w-4 h-4 mr-2" />
        Ajouter un objectif
      </Button>

      <button onClick={save} disabled={saving} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm bg-white text-violet-700 hover:bg-white/90 shadow transition-all disabled:opacity-50">
        {saving && <Loader2 className="w-4 h-4 animate-spin" />}
        Sauvegarder les objectifs
      </button>
    </div>
  );
}