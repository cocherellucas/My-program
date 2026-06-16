import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Sparkles, Loader2, FolderUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import OnboardingProgress from '@/components/onboarding/OnboardingProgress';
import StepProfile from '@/components/onboarding/StepProfile';
import StepAvailability from '@/components/onboarding/StepAvailability';
import StepEquipment from '@/components/onboarding/StepEquipment';
import StepObjectives from '@/components/onboarding/StepObjectives';
import StepPreferences from '@/components/onboarding/StepPreferences';
import StepMeasurements from '@/components/onboarding/StepMeasurements';
import WelcomeIntro from '@/components/onboarding/WelcomeIntro';

const TOTAL_STEPS = 6;
const STORAGE_KEY = 'onboarding_draft';

export default function Onboarding() {
  const navigate = useNavigate();

  // ?resetOnboarding → le nettoyage localStorage est fait par TutorialProvider (qui mount avant).
  // Ici on retire juste le paramètre de l'URL après coup.
  const savedDraft = (() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('resetOnboarding')) {
      params.delete('resetOnboarding');
      const q = params.toString();
      window.history.replaceState({}, '', window.location.pathname + (q ? '?' + q : ''));
      return {};
    }
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
  const [showFinalChoice, setShowFinalChoice] = useState(false);
  const [showWelcome, setShowWelcome] = useState(() => {
    // Affiché uniquement si aucun brouillon n'existe encore
    return !savedDraft.step && !savedDraft.data;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, data }));
  }, [step, data]);

  // Synchronise body/html avec le fond de l'onboarding (#5b21b6 = violet-800)
  useEffect(() => {
    document.body.classList.add('onboarding-active');
    document.documentElement.classList.add('onboarding-active');
    return () => {
      document.body.classList.remove('onboarding-active');
      document.documentElement.classList.remove('onboarding-active');
    };
  }, []);

  const validateStep = () => {
    // Étape 0 : Profil — niveau obligatoire
    if (step === 0) {
      if (!data.level) {
        setStepError('Sélectionne ton niveau pour continuer.');
        return false;
      }
    }
    // Étape 1 : Objectifs
    if (step === 1) {
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
    // Étape 2 : Disponibilités
    if (step === 2) {
      if (data.availability_optimal !== true && !data.available_days?.length) {
        setStepError('Sélectionne au moins un jour d\'entraînement.');
        return false;
      }
      if (data.availability_optimal === true) return true;
      if (data.available_days.length > 1 && data.same_duration_all == null) {
        setStepError('Indique si tu veux la même durée chaque jour ou non.');
        return false;
      }
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

  const saveAndNavigate = async (destination, extraState = {}) => {
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
          focus_movement: Array.isArray(obj.focus_movement) ? obj.focus_movement.join(', ') : (obj.focus_movement || null),
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
      navigate(destination, { state: extraState });
    } catch (err) {
      console.error('Onboarding finish error:', err);
      setStepError(err?.message || err?.error || JSON.stringify(err) || 'Erreur inconnue');
    } finally {
      setSaving(false);
    }
  };

  const finish = () => saveAndNavigate('/program?autoGenerate=true');
  const finishAndImport = (programText) => saveAndNavigate('/coach', { importText: programText });

  const steps = [
    <StepProfile data={data} onChange={update} />,
    <StepObjectives data={data} onChange={update} />,
    <StepAvailability data={data} onChange={update} />,
    <StepEquipment data={data} onChange={update} />,
    <StepPreferences data={data} onChange={update} />,
    <StepMeasurements data={data} onChange={update} />,
  ];

  if (showWelcome) {
    return <WelcomeIntro
      onFinish={() => setShowWelcome(false)}
      onImport={async () => {
        // Marque l'onboarding comme complété (avec valeurs vides) puis envoie sur /program
        // L'utilisateur pourra compléter son profil plus tard et importera son programme depuis /program
        setSaving(true);
        try {
          await base44.auth.updateMe({ onboarding_completed: true, onboarding_step: TOTAL_STEPS });
          localStorage.removeItem(STORAGE_KEY);
          navigate('/program');
        } finally {
          setSaving(false);
        }
      }} />;
  }

  return (
    <>
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

          {step < TOTAL_STEPS - 1 ? (() => {
            const eqArr = Array.isArray(data.equipment)
              ? data.equipment
              : (() => { try { return JSON.parse(data.equipment || '[]'); } catch { return []; } })();
            const hasEquipment = eqArr.length > 0;
            const isEmptyEquipStep = step === 3 && !hasEquipment;
            return (
              <Button data-tutorial="next-button" onClick={() => {
                if (step === 3 && !data.equipment_validated && hasEquipment) {
                  update({ equipment_validated: true });
                }
                if (validateStep()) setStep(s => s + 1);
              }}>
                {isEmptyEquipStep ? 'Aucun équipement' : 'Suivant'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            );
          })() : (
            <Button onClick={() => setShowFinalChoice(true)} disabled={saving}>
              Valider
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>

    <FinalChoiceSheet
      show={showFinalChoice}
      onClose={() => setShowFinalChoice(false)}
      onGenerate={finish}
      onImport={finishAndImport}
      saving={saving}
    />
  </>
  );
}

function FinalChoiceSheet({ show, onClose, onGenerate, onImport, saving }) {
  const [importMode, setImportMode] = React.useState(false);
  const [text, setText] = React.useState('');

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-sm space-y-3"
        onClick={e => e.stopPropagation()}
      >
        {!importMode ? (
          <>
            <div className="text-center mb-2">
              <p className="text-white font-bold text-lg">Ton profil est prêt !</p>
              <p className="text-white/50 text-sm mt-1">Plus qu'une étape — comment on commence ?</p>
            </div>
            <button type="button" onClick={onGenerate} disabled={saving}
              className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white text-violet-700 hover:bg-white/90 shadow-xl transition-all disabled:opacity-50">
              <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-violet-600" />
              </div>
              <div className="text-left">
                <p className="font-bold text-sm">Créer mon programme</p>
                <p className="text-xs text-violet-500 mt-0.5">L'IA génère un programme sur mesure</p>
              </div>
              {saving ? <Loader2 className="w-4 h-4 ml-auto animate-spin" /> : <ArrowRight className="w-4 h-4 ml-auto" />}
            </button>
            <button type="button" onClick={() => setImportMode(true)} disabled={saving}
              className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/10 border border-white/20 text-white hover:bg-white/15 transition-all disabled:opacity-50">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                <FolderUp className="w-5 h-5 text-white/80" />
              </div>
              <div className="text-left">
                <p className="font-bold text-sm">Importer un programme</p>
                <p className="text-xs text-white/50 mt-0.5">Colle ton programme existant</p>
              </div>
              <ArrowRight className="w-4 h-4 ml-auto text-white/40" />
            </button>
            <button type="button" onClick={onClose}
              className="w-full py-3 text-sm text-white/40 hover:text-white/60 transition-colors">
              Annuler
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={() => setImportMode(false)}
              className="flex items-center gap-1 text-white/50 hover:text-white text-sm transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Retour
            </button>
            <div className="bg-white/10 border border-white/20 rounded-2xl p-4 space-y-3">
              <p className="text-white font-semibold text-sm">Colle ton programme ici</p>
              <p className="text-white/50 text-xs">Texte, tableau, JSON — l'IA s'adapte à tous les formats.</p>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Lundi : Squat 4x8, Bench 4x8..."
                className="w-full h-36 bg-white/10 border border-white/20 rounded-xl p-3 text-sm text-white placeholder:text-white/30 resize-none focus:outline-none focus:border-white/40"
                autoFocus
              />
              <button type="button"
                onClick={() => onImport(text)}
                disabled={!text.trim() || saving}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-violet-700 font-semibold text-sm hover:bg-white/90 transition-all disabled:opacity-40">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <FolderUp className="w-4 h-4" />}
                Importer
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

