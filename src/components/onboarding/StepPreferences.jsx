import React from 'react';
import { cn } from '@/lib/utils';
import { Shield, X } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export default function StepPreferences({ data, onChange }) {
  const { t } = useI18n();
  const FRAGILE_ZONES = [
    { key: 'wrists', label: t('pf_z_wrists') }, { key: 'shoulders', label: t('pf_z_shoulders') },
    { key: 'elbows', label: t('pf_z_elbows') }, { key: 'knees', label: t('pf_z_knees') },
    { key: 'lower_back', label: t('pf_z_lower_back') }, { key: 'neck', label: t('pf_z_neck') },
  ];
  // Style « à protéger » (orange/bouclier) — seule intention restante.
  const PROTECT = { chip: 'border-orange-300 bg-orange-500 text-white', color: 'border-orange-300 bg-orange-500 text-white' };

  const zones = (() => { const r = data.fragile_zones; if (!r) return []; if (Array.isArray(r)) return r; try { return JSON.parse(r) || []; } catch { return []; } })();

  const getZone = (key) => zones.find(z => z.key === key);

  // Zone fragile = à protéger. Plus d'étape d'intention : « renforcer » se gère désormais
  // via les Objectifs (prioriser le muscle autour d'une douleur — cf. tuto Objectifs).
  const selectZone = (key) => {
    if (getZone(key)) {
      onChange({ fragile_zones: zones.filter(z => z.key !== key) });
    } else {
      onChange({ fragile_zones: [...zones, { key, goal: 'protect' }] });
    }
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
            const zone = getZone(key);
            return (
              <button key={key} type="button" onClick={() => selectZone(key)}
                className={cn(
                  'flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all',
                  zone
                    ? PROTECT.chip
                    : 'border-violet-300/60 bg-[#8b45f8]/70 text-white/80 opacity-75 hover:opacity-100 hover:border-white hover:text-white'
                )}>
                <span className="flex items-center gap-1.5 truncate">
                  {zone && <Shield className="w-3.5 h-3.5 flex-shrink-0" />}
                  {label}
                </span>
                {zone && <X className="w-3.5 h-3.5 opacity-60 flex-shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Résumé zones sélectionnées — toutes à protéger */}
        {zones.length > 0 && (
          <div className="space-y-1.5">
            {zones.map(z => {
              const zDef = FRAGILE_ZONES.find(f => f.key === z.key);
              if (!zDef) return null;
              return (
                <div key={z.key} className={cn('flex items-center gap-2 px-3 py-2 rounded-lg border text-xs', PROTECT.color)}>
                  <Shield className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="font-medium">{zDef.label}</span>
                  <span className="opacity-70">— {t('pf_sum_protect')}</span>
                </div>
              );
            })}
            <p className="text-xs text-white/40 px-1 pt-1">{t('pf_auto')}</p>
          </div>
        )}
      </div>

    </div>
  );
}
