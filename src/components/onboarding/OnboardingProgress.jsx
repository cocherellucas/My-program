import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';

export default function OnboardingProgress({ currentStep }) {
  const { t } = useI18n();
  const steps = [
    t('obp_profile'), t('obp_availability'), t('obp_equipment'),
    t('obp_preferences'), t('obp_objectives'), t('obp_measurements'),
  ];
  return (
    <div className="w-full max-w-xl mx-auto mb-8">
      <div className="flex items-center justify-between relative">
        {/* Lignes dans un conteneur partagé left-4 right-4 */}
        <div className="absolute top-4 left-4 right-4 h-0.5">
          <div className="absolute inset-0 bg-white/20" />
          <motion.div
            className="absolute left-0 top-0 h-full bg-white"
            initial={{ width: '0%' }}
            animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>

        {steps.map((step, i) => (
          <div key={step} className="flex flex-col items-center relative z-10">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300',
                i < currentStep
                  ? 'bg-violet-600 border-2 border-white/50 text-white/70'
                  : i === currentStep
                    ? 'bg-white text-violet-700 ring-4 ring-white/30'
                    : 'bg-violet-800 border-2 border-violet-400 text-white/80'
              )}
            >
              {i + 1}
            </div>
            <span className={cn(
              'text-[10px] mt-1.5 font-medium hidden sm:block',
              i <= currentStep ? 'text-white' : 'text-white/50'
            )}>
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
