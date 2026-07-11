import React, { useEffect, useState } from 'react';
import { useTutorial } from '@/lib/TutorialContext';
import { useI18n } from '@/lib/i18n';
import { Label } from '@/components/ui/label';
import { NumInput } from '@/components/ui/num-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { estimateMaintenanceCalories } from '@/lib/calories';

// min / max / pas / valeur de départ des flèches — mêmes réglages partout
const FIELDS = {
  age:    { min: 18, max: 120, step: 1,   default: 25  },
  height: { min: 50, max: 250, step: 1,   default: 175 },
  weight: { min: 20, max: 300, step: 0.5, default: 70  },
};

export default function StepProfile({ data, onChange }) {
  const { startTutorial } = useTutorial() || {};
  const { t } = useI18n();
  const [showMaintenance, setShowMaintenance] = useState(false);

  // Démarre les tutos pour cette étape (icône ?, input numérique, dropdown)
  useEffect(() => {
    if (!startTutorial) return;
    const t = setTimeout(() => {
      startTutorial('profile-intro', [
        {
          target: 'gender-cards',
          title: 'Choisis ton genre',
          description: 'Pour commencer, choisis ton genre en cliquant sur une carte. La carte sélectionnée a une bordure blanche.',
        },
        {
          target: 'numeric-input',
          title: 'Saisir un nombre',
          description: 'Tape directement au clavier, OU utilise les petites flèches ↑↓ à droite. Reste appuyé pour défiler plus vite.',
        },
        {
          target: 'help-icon',
          title: 'Besoin d\'aide ?',
          description: 'Tu vas voir des "?" partout dans l\'app. Clique dessus pour avoir l\'explication détaillée du champ à côté.',
        },
        {
          target: 'dropdown',
          title: 'Menu déroulant',
          description: 'Clique pour ouvrir la liste, puis choisis ton option. Tu peux toujours changer plus tard.',
        },
        {
          target: 'next-button',
          title: 'Boutons avec flèche →',
          description: "Chaque bouton avec une flèche → t'emmène à l'endroit indiqué par son texte. Ici, \"Suivant\" t'emmènera à l'étape suivante.",
          nonInteractive: true,
        },
      ]);
    }, 600);
    return () => clearTimeout(t);
  }, [startTutorial]);

  const numInput = (field) => {
    const { min, max, step, default: def } = FIELDS[field];
    const labelText = field === 'height' ? t('sp_height') : field === 'weight' ? t('sp_weight') : t('sp_age');
    const parse = field === 'weight' ? parseFloat : parseInt;
    const node = (
      <NumInput
        value={data[field]}
        onChange={(v) => onChange({ [field]: v === '' ? '' : parse(v) })}
        min={min}
        max={max}
        step={step}
        defaultValue={def}
        placeholder="—"
        className="bg-white/20 border-white/40 text-white placeholder:text-white/50"
      />
    );
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 min-h-[20px]"><Label className="text-white">{labelText}</Label></div>
        {field === 'age' ? <div data-tutorial="numeric-input">{node}</div> : node}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-heading font-bold text-white">{t('sp_title')}</h2>
        <p className="text-white/70 mt-2">{t('sp_sub')}</p>
        <p className="text-white/40 text-xs mt-3"><span className="text-red-400 font-bold">*</span> {t('sp_required')}</p>
      </div>

      {/* Genre */}
      <div className="space-y-2">
        <Label className="text-white">{t('sp_gender')}</Label>
        <div className="grid grid-cols-2 gap-3" data-tutorial="gender-cards">
          {[{ value: 'male', label: t('sp_male') }, { value: 'female', label: t('sp_female') }].map(({ value, label }) => (
            <button key={value} type="button" onClick={() => onChange({ gender: value })}
              className={`py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${data.gender === value ? 'border-white bg-white/20 text-white' : 'border-white/20 bg-white/10 text-white/50 hover:border-white/40'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {numInput('age')}

        <div className="space-y-2">
          <div className="flex items-center gap-1.5 min-h-[20px]">
            <Label className="text-white">{t('sp_level')} <span className="text-red-400">*</span></Label>
            <Popover>
              <PopoverTrigger asChild>
                <button type="button" data-tutorial="help-icon" className="text-white/40 hover:text-white/70 transition-colors">
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-72 text-xs space-y-2">
                <div>
                  <p className="font-semibold">🌱 {t('sp_beginner')}</p>
                  <p className="text-white/70 mt-0.5">{t('sp_lvl_beg')}</p>
                </div>
                <div>
                  <p className="font-semibold">💪 {t('sp_intermediate')}</p>
                  <p className="text-white/70 mt-0.5">{t('sp_lvl_int')}</p>
                </div>
                <div>
                  <p className="font-semibold">🔥 {t('sp_advanced')}</p>
                  <p className="text-white/70 mt-0.5">{t('sp_lvl_adv')}</p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <Select value={data.level || ''} onValueChange={(v) => onChange({ level: v })}>
            <SelectTrigger data-tutorial="dropdown" className="bg-white/20 border-white/40 text-white [&>span]:text-white [&>span[data-placeholder]]:text-white/50 [&>svg]:opacity-100 [&>svg]:text-white">
              <SelectValue placeholder={t('sp_select')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">{t('sp_beginner')}</SelectItem>
              <SelectItem value="intermediate">{t('sp_intermediate')}</SelectItem>
              <SelectItem value="advanced">{t('sp_advanced')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {numInput('height')}
        {numInput('weight')}

        <div className="space-y-2">
          <div className="flex items-center gap-1.5 min-h-[20px]">
            <Label className="text-white">{t('sp_activity')}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <button type="button" className="text-white/40 hover:text-white/70 transition-colors"><HelpCircle className="w-3.5 h-3.5" /></button>
              </PopoverTrigger>
              <PopoverContent className="w-72 text-xs space-y-1.5">
                <p className="text-white/60 text-[10px] uppercase tracking-wider font-semibold">{t('sp_activity_hint')}</p>
                <p><span className="font-semibold">{t('sp_act_sedentary')}</span> — {t('sp_act_sedentary_d')}</p>
                <p><span className="font-semibold">{t('sp_act_light')}</span> — {t('sp_act_light_d')}</p>
                <p><span className="font-semibold">{t('sp_act_moderate')}</span> — {t('sp_act_moderate_d')}</p>
                <p><span className="font-semibold">{t('sp_act_active')}</span> — {t('sp_act_active_d')}</p>
                <p><span className="font-semibold">{t('sp_act_very')}</span> — {t('sp_act_very_d')}</p>
              </PopoverContent>
            </Popover>
          </div>
          <Select value={data.activity_level || ''} onValueChange={(v) => onChange({ activity_level: v })}>
            <SelectTrigger className="bg-white/20 border-white/40 text-white [&>span]:text-white [&>span[data-placeholder]]:text-white/50 [&>svg]:opacity-100 [&>svg]:text-white"><SelectValue placeholder={t('sp_select')} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="sedentary">{t('sp_act_sedentary')}</SelectItem>
              <SelectItem value="light">{t('sp_act_light')}</SelectItem>
              <SelectItem value="moderate">{t('sp_act_moderate')}</SelectItem>
              <SelectItem value="active">{t('sp_act_active')}</SelectItem>
              <SelectItem value="very_active">{t('sp_act_very')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1.5 min-h-[20px]">
            <Label className="text-white">{t('sp_bodyfat')}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <button type="button" className="text-white/40 hover:text-white/70 transition-colors"><HelpCircle className="w-3.5 h-3.5" /></button>
              </PopoverTrigger>
              <PopoverContent className="w-72 text-xs space-y-1.5">
                <p className="font-semibold text-white">{t('sp_bodyfat_t')}</p>
                <p className="text-white/70">{t('sp_bodyfat_d')}</p>
              </PopoverContent>
            </Popover>
          </div>
          <NumInput value={data.body_fat} onChange={(v) => onChange({ body_fat: v === '' ? '' : parseFloat(v) })} min={3} max={60} step={0.5} defaultValue={15} className="bg-white/20 border-white/40 text-white placeholder:text-white/50" />
        </div>
      </div>

      {(() => {
        const cal = estimateMaintenanceCalories({
          gender: data.gender, age: data.age, height: data.height, weight: data.weight,
          bodyFat: data.body_fat, activityLevel: data.activity_level,
        });
        if (!cal) return null;
        return (
          <div className="rounded-xl bg-white/10 border border-white/20 overflow-hidden">
            <button type="button" onClick={() => setShowMaintenance(v => !v)}
              className="w-full flex items-center justify-between gap-2 p-3 text-left hover:bg-white/5 transition-colors">
              <span className="text-sm font-medium text-white">{t('sp_maintenance')}</span>
              <span className="flex items-center gap-1.5 text-white/90 font-semibold whitespace-nowrap">
                {showMaintenance ? `~${cal.maintenance} ${t('sp_kcal_day')}` : t('sp_see')}
                <ChevronDown className={`w-4 h-4 transition-transform ${showMaintenance ? 'rotate-180' : ''}`} />
              </span>
            </button>
            {showMaintenance && (
              <p className="text-[11px] text-white/50 px-3 pb-3 leading-snug">
                {cal.method === 'katch' ? t('sp_maint_katch') : t('sp_maint_mifflin')}
              </p>
            )}
          </div>
        );
      })()}
    </div>
  );
}
