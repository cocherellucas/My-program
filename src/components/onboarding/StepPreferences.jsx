import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Shield, Dumbbell, X, Minus, HelpCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useI18n } from '@/lib/i18n';

export default function StepPreferences({ data, onChange }) {
  const { t } = useI18n();
  const FRAGILE_ZONES = [
    { key: 'wrists', label: t('pf_z_wrists') }, { key: 'shoulders', label: t('pf_z_shoulders') },
    { key: 'elbows', label: t('pf_z_elbows') }, { key: 'knees', label: t('pf_z_knees') },
    { key: 'lower_back', label: t('pf_z_lower_back') }, { key: 'neck', label: t('pf_z_neck') },
  ];
  const GOALS = [
    { key: 'strengthen', label: t('pf_g_strengthen'), icon: Dumbbell, desc: t('pf_g_strengthen_d'), color: 'border-blue-300 bg-blue-500 text-white', chip: 'border-blue-300 bg-blue-500 text-white' },
    { key: 'protect', label: t('pf_g_protect'), icon: Shield, desc: t('pf_g_protect_d'), color: 'border-orange-300 bg-orange-500 text-white', chip: 'border-orange-300 bg-orange-500 text-white' },
    { key: 'info', label: t('pf_g_info'), icon: Minus, desc: t('pf_g_info_d'), color: 'border-violet-300 bg-violet-500 text-white', chip: 'border-violet-300 bg-violet-500 text-white' },
  ];
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
        <h2 className="text-2xl font-heading font-bold text-white">{t('pf_title')}</h2>
        <p className="text-white/70 mt-2">{t('pf_sub')}</p>
      </div>

      <div className="space-y-3">
        <p className="text-xs text-white/50">{t('pf_select')}</p>

        <div className="grid grid-cols-2 gap-2">
          {FRAGILE_ZONES.map(({ key, label }) => {
            const zone    = getZone(key);
            const goal    = GOALS.find(g => g.key === zone?.goal);
            const waiting = selecting === key;

            return (
              <button key={key} type="button" onClick={() => selectZone(key)}
                className={cn(
                  'flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all',
                  zone
                    ? goal?.chip
                    : waiting
                    ? 'border-white bg-violet-500 text-white'
                    : 'border-violet-300/60 bg-[#8b45f8]/70 text-white/80 opacity-75 hover:opacity-100 hover:border-white hover:text-white'
                )}>
                <span className="flex items-center gap-1.5 truncate">
                  {zone && goal && <goal.icon className="w-3.5 h-3.5 flex-shrink-0" />}
                  {label}
                </span>
                {zone && <X className="w-3.5 h-3.5 opacity-60 flex-shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Choix de l'intention */}
        {selecting && (
          <div className="p-3 bg-white/10 rounded-xl border border-white/20 space-y-2">
            <div className="flex items-center gap-1.5">
              <p className="text-xs text-white/60">
                {FRAGILE_ZONES.find(z => z.key === selecting)?.label} — {t('pf_intention')}
              </p>
              <Popover>
                <PopoverTrigger asChild>
                  <button type="button" className="text-white/30 hover:text-white/60 transition-colors">
                    <HelpCircle className="w-3.5 h-3.5" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-64 text-xs space-y-2">
                  <p className="font-semibold">{t('pf_why')}</p>
                  <p><span className="font-medium">{t('pf_g_strengthen')}</span> — {t('pf_why_strengthen')}</p>
                  <p><span className="font-medium">{t('pf_g_protect')}</span> — {t('pf_why_protect')}</p>
                  <p><span className="font-medium">{t('pf_g_info')}</span> — {t('pf_why_info')}</p>
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
                  <span className="opacity-70">— {z.goal === 'strengthen' ? t('pf_sum_strengthen') : z.goal === 'protect' ? t('pf_sum_protect') : t('pf_sum_info')}</span>
                </div>
              );
            })}
            {zones.some((/** @type {{goal:string}} */ z) => z.goal === 'strengthen' || z.goal === 'protect') && (
              <p className="text-xs text-white/40 px-1 pt-1">
                {t('pf_auto')}
              </p>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
