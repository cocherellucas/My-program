import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import OnboardingProgress from '@/components/onboarding/OnboardingProgress';
import StepProfile from '@/components/onboarding/StepProfile';
import StepAvailability from '@/components/onboarding/StepAvailability';
import StepEquipment from '@/components/onboarding/StepEquipment';
import StepObjectives from '@/components/onboarding/StepObjectives';
import StepPreferences from '@/components/onboarding/StepPreferences';
import StepMeasurements from '@/components/onboarding/StepMeasurements';

const TOTAL_STEPS = 6;
const STORAGE_KEY = 'onboarding_draft';

export default function Onboarding() {
  const navigate = useNavigate();

  const savedDraft = (() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; }
  })();

  const [step, setStep] = useState(savedDraft.step ?? 0);
  const [data, setData] = useState({
    objectives: [],
    available_days: [],
    duration_per_day: {},
    equipment: [],
    duration_flexible: true,
    ...savedDraft.data,
  });
  const [saving, setSaving] = useState(false);
  const [stepError, setStepError] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, data }));
  }, [step, data]);

  const validateStep = () => {
    // Étape 0 : Profil — niveau obligatoire
    if (step === 0) {
      if (!data.level) {
        setStepError('Sélectionne ton niveau pour continuer.');
        return false;
      }
    }
    // Étape 4 : Objectifs
    if (step === 4) {
      if (!data.objectives?.length) {
        setStepError('Ajoute au moins un objectif pour continuer.');
        return false;
      }
      // Vérifier les conflits de muscles entre objectifs specific_group du même type
      const specificObjs = data.objectives.filter(o => o.zone === 'specific_group' && Array.isArray(o.focus_group));
      for (let i = 0; i < specificObjs.length; i++) {
        for (let j = i + 1; j < specificObjs.length; j++) {
          if (specificObjs[i].type === specificObjs[j].type) {
            const overlap = specificObjs[i].focus_group.filter(m => specificObjs[j].focus_group.includes(m));
            if (overlap.length > 0) {
              const typeName = specificObjs[i].type === 'hypertrophy' ? 'Hypertrophie' : specificObjs[i].type === 'strength' ? 'Force' : 'Endurance';
              setStepError(`${overlap.join(', ')} ${overlap.length > 1 ? 'apparaissent' : 'apparaît'} dans deux objectifs ${typeName} — chaque muscle ne peut figurer que dans un seul objectif du même type.`);
              return false;
            }
          }
        }
      }
    }
    // Étape 1 : Disponibilités
    if (step === 1) {
      if (data.availability_optimal !== true && !data.available_days?.length) {
        setStepError('Sélectionne au moins un jour d\'entraînement.');
        return false;
      }
      if (data.availability_optimal === true) return true;
      const missingDuration = data.available_days.some(
        d => !data.duration_per_day?.[d] || parseInt(data.duration_per_day[d]) < 10
      );
      if (missingDuration) {
        setStepError('Renseigne la durée (min. 10 min) pour chaque jour sélectionné.');
        return false;
      }
      if (!data.frequency_min || !data.frequency_max) {
        setStepError('Renseigne la fréquence minimum et maximum par semaine.');
        return false;
      }
      if (data.frequency_min && data.available_days.length < data.frequency_min) {
        setStepError(`Tu veux minimum ${data.frequency_min} séances/sem mais tu n'as sélectionné que ${data.available_days.length} jour${data.available_days.length > 1 ? 's' : ''}. Ajoute des jours ou réduis la fréquence minimum.`);
        return false;
      }
    }
    setStepError('');
    return true;
  };

  const update = (partial) => {
    setData(prev => ({ ...prev, ...partial }));
    setStepError('');
  };

  const finish = async () => {
    setSaving(true);
    try {
      const { objectives, equipment_validated, shoulders, waist, hips, right_arm, left_arm, right_thigh, left_thigh, peaking_enabled, no_volume_muscles, volume_mode, volume_overrides, availability_optimal, ...userData } = data;

      await base44.auth.updateMe({
        ...userData,
        onboarding_completed: true,
        onboarding_step: TOTAL_STEPS,
        peaking_enabled:  peaking_enabled ?? false,
        no_volume_muscles: JSON.stringify(no_volume_muscles || []),
        volume_mode:          volume_mode || 'auto',
        volume_overrides:     JSON.stringify(volume_overrides || {}),
        availability_optimal: availability_optimal ?? null,
        // Sérialiser fragile_zones en JSON string si c'est un tableau d'objets
        fragile_zones: userData.fragile_zones
          ? JSON.stringify(userData.fragile_zones)
          : null,
      });

      const user = await base44.auth.me();

      // Objectifs — supprimer les existants avant de recréer pour éviter les doublons
      const existingObjectives = await base44.entities.Objective.filter({ user_id: user.id });
      for (const existing of existingObjectives) {
        await base44.entities.Objective.delete(existing.id);
      }
      for (const obj of objectives) {
        await base44.entities.Objective.create({
          user_id: user.id,
          type: obj.type,
          zone: obj.zone,
          priority: obj.priority,
          focus_group: Array.isArray(obj.focus_group) ? obj.focus_group.join(', ') : (obj.focus_group || null),
          focus_movement: obj.focus_movement || null,
          status: 'active',
        });
      }

      // Mémoire IA — créer seulement si elle n'existe pas
      const existingMemory = await base44.entities.UserMemory.filter({ user_id: user.id }, null, 1);
      if (!existingMemory?.length) {
        await base44.entities.UserMemory.create({
          user_id: user.id,
          exercise_preferences: [],
          structure_preferences: [],
          objective_history: [],
          fatigue_alerts: [],
          past_adaptations: [],
          injuries: [],
          ai_reviews: [],
        });
      }

      // Mensurations
      const measKeys = ['shoulders', 'waist', 'hips', 'right_arm', 'left_arm', 'right_thigh', 'left_thigh'];
      const hasMeasurements = measKeys.some(k => data[k]);
      if (hasMeasurements) {
        const measData = {};
        measKeys.forEach(k => { if (data[k]) measData[k] = data[k]; });
        await base44.entities.Measurement.create({
          user_id: user.id,
          date: new Date().toISOString().split('T')[0],
          ...measData,
        });
      }

      localStorage.removeItem(STORAGE_KEY);
      navigate('/program?autoGenerate=true');
    } catch (err) {
      console.error('Onboarding finish error:', err);
      setStepError(err?.message || err?.error || JSON.stringify(err) || 'Erreur inconnue');
    } finally {
      setSaving(false);
    }
  };

  const steps = [
    <StepProfile data={data} onChange={update} />,
    <StepAvailability data={data} onChange={update} />,
    <StepEquipment data={data} onChange={update} />,
    <StepPreferences data={data} onChange={update} />,
    <StepObjectives data={data} onChange={update} />,
    <StepMeasurements data={data} onChange={update} />,
  ];

  return (
    <div className="min-h-screen bg-violet-800 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <OnboardingProgress currentStep={step} />
        
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-6 md:p-8 min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {steps[step]}
            </motion.div>
          </AnimatePresence>
        </div>

        {stepError && (
          <p className="text-red-300 text-xs text-center mt-3">{stepError}</p>
        )}

        <div className="flex items-center justify-between mt-3">
          {step > 0 ? (
            <Button variant="outline" onClick={() => { setStepError(''); setStep(s => s - 1); }} className="border-white/30 text-white hover:bg-white/10 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Précédent
            </Button>
          ) : (
            <div />
          )}

          {step < TOTAL_STEPS - 1 ? (
            <div className="flex flex-col items-end gap-1">
              {step === 2 && !data.equipment_validated ? (
                <button type="button" onClick={() => setStep(s => s + 1)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/30 bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all">
                  Je n'ai pas d'équipement
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <Button onClick={() => { if (validateStep()) setStep(s => s + 1); }}>
                  Suivant
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          ) : (
            <Button onClick={finish} disabled={saving}>
              {saving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              Créer mon programme
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}