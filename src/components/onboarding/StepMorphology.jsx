import React from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useI18n } from '@/lib/i18n';

export default function StepMorphology({ data, onChange }) {
  const { t } = useI18n();
  const QUESTIONS = [
    { key: 'morphology_arm_length', label: t('mo_arm'), options: [
      { value: 'short', label: t('mo_short_m') }, { value: 'medium', label: t('mo_med_m') }, { value: 'long', label: t('mo_long_m') },
    ] },
    { key: 'morphology_leg_length', label: t('mo_leg'), options: [
      { value: 'short', label: t('mo_short_f') }, { value: 'medium', label: t('mo_med_f') }, { value: 'long', label: t('mo_long_f') },
    ] },
    { key: 'morphology_silhouette', label: t('mo_sil'), options: [
      { value: 'broad_shoulders', label: t('mo_broad') }, { value: 'proportional', label: t('mo_prop') }, { value: 'wide_hips', label: t('mo_wide') },
    ] },
    { key: 'morphology_posture', label: t('mo_posture'), desc: t('mo_posture_d'), options: [
      { value: 'anterior', label: t('mo_anterior') }, { value: 'neutral', label: t('mo_neutral') }, { value: 'posterior', label: t('mo_posterior') },
    ] },
  ];
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-heading font-bold">{t('mo_title')}</h2>
        <p className="text-muted-foreground mt-2">{t('mo_sub')}</p>
      </div>

      <div className="space-y-6">
        {QUESTIONS.map(({ key, label, desc, options }) => (
          <div key={key} className="space-y-3">
            <div>
              <Label>{label}</Label>
              {desc && <p className="text-xs text-muted-foreground">{desc}</p>}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {options.map(({ value, label: optLabel }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => onChange({ [key]: value })}
                  className={cn(
                    'p-3 rounded-xl border-2 text-sm font-medium transition-all text-center',
                    data[key] === value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-card text-muted-foreground hover:border-primary/30'
                  )}
                >
                  {optLabel}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}