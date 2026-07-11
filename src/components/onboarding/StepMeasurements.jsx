import React from 'react';
import { Label } from '@/components/ui/label';
import { NumInput } from '@/components/ui/num-input';
import { useI18n } from '@/lib/i18n';

const FIELDS = [
  { key: 'shoulders',   lk: 'ms_shoulders',   max: 200 },
  { key: 'waist',       lk: 'ms_waist',       max: 200 },
  { key: 'hips',        lk: 'ms_hips',        max: 200 },
  { key: 'right_arm',   lk: 'ms_right_arm',   max: 80 },
  { key: 'left_arm',    lk: 'ms_left_arm',    max: 80 },
  { key: 'right_thigh', lk: 'ms_right_thigh', max: 120 },
  { key: 'left_thigh',  lk: 'ms_left_thigh',  max: 120 },
];

const DEFAULTS = {
  male:    { shoulders: 120, waist: 85,  hips: 97,  right_arm: 35, left_arm: 35, right_thigh: 58, left_thigh: 58 },
  female:  { shoulders: 105, waist: 75,  hips: 102, right_arm: 30, left_arm: 30, right_thigh: 60, left_thigh: 60 },
  neutral: { shoulders: 112, waist: 80,  hips: 100, right_arm: 32, left_arm: 32, right_thigh: 59, left_thigh: 59 },
};


export default function StepMeasurements({ data, onChange }) {
  const { t } = useI18n();
  const defaults = DEFAULTS[data.gender] || DEFAULTS.neutral;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-heading font-bold text-white">{t('ms_title')}</h2>
        <p className="text-white/70 mt-2">{t('ms_sub')}</p>
      </div>

      <div className="p-4 bg-white/10 rounded-xl border border-white/20">
        <p className="text-sm text-white/80">
          {t('ms_info')}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {FIELDS.map(({ key, lk, max }) => (
          <div key={key} className="space-y-1.5">
            <Label className="text-sm text-white">{t(lk)} (cm)</Label>
            <NumInput
              value={data[key] || ''}
              onChange={(val) => onChange({ [key]: val === '' ? '' : parseFloat(val) || '' })}
              defaultValue={defaults[key]}
              placeholder="—"
              step={0.5}
              min={1}
              max={max}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/30"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
