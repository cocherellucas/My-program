import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { NumInput } from '@/components/ui/num-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Save, Loader2, User, Ruler, Dumbbell, Calendar, Target, SlidersHorizontal, CheckCircle2, RefreshCw, HelpCircle, Settings, ChevronDown } from 'lucide-react';
import { normalizeUser } from '@/lib/utils';
import { useAuth } from '@/lib/AuthContext';
import { useI18n } from '@/lib/i18n';
import { estimateMaintenanceCalories } from '@/lib/calories';
import { ensureOnline } from '@/lib/net';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { fr as frLocale } from 'date-fns/locale';

// Champs dont le changement nécessite une régénération du programme
const PROGRAM_IMPACTING_FIELDS = [
  'available_days', 'duration_per_day', 'frequency_min', 'frequency_max',
  'equipment', 'level', 'fragile_zones', 'preferred_exercises', 'disliked_exercises',
  'no_volume_muscles', 'peaking_enabled',
];
import StepPreferences from '@/components/onboarding/StepPreferences';
import { toast } from 'sonner';
import StepMeasurements from '@/components/onboarding/StepMeasurements';
import StepEquipment from '@/components/onboarding/StepEquipment';
import StepAvailability from '@/components/onboarding/StepAvailability';
import ObjectivesTab from '@/components/profile/ObjectivesTab';
import SubscriptionBadge from '@/components/profile/SubscriptionBadge';

export default function Profile() {
  const { t, lang } = useI18n();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showMaintenance, setShowMaintenance] = useState(false); // valeur kcal cachée derrière « Voir »
  const [showRegenBanner, setShowRegenBanner] = useState(false);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'basics');
  const NO_SAVE_TABS = ['equipment', 'objectives'];
  // Cycle menstruel : l'activation du toggle (off par défaut, dédié, texte de
  // consentement adjacent) vaut acte positif de consentement — rien ne part
  // au serveur avant « Sauvegarder ».

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    base44.auth.me().then(u => {
      const normalized = normalizeUser(u);
      setUser(normalized);
      setForm(normalized);
    }).catch(err => {
      // me() utilise getUser() (validation réseau du token) : peut échouer
      // transitoirement (ex: juste après un updateMe en onboarding). On évite
      // la page blanche en repliant sur l'utilisateur déjà chargé par AuthContext.
      console.error('[Profile] me() a échoué, repli sur AuthContext', err);
    });
    // Si le programme actif est importé, nettoyer tout le contexte de regen
    base44.entities.Program.filter({ status: 'active' }, '-created_date', 1).then(progs => {
      const p = progs[0];
      const importedIds = (() => { try { return JSON.parse(localStorage.getItem('imported_program_ids') || '[]'); } catch { return []; } })();
      if (p && (p.weekly_structure === 'custom' || importedIds.includes(p.id))) {
        localStorage.removeItem('pending_program_regen');
        localStorage.removeItem('program_generated_snapshot');
        setShowRegenBanner(false);
      }
    }).catch(() => {});
  }, []);

  // Repli : si me() n'a pas (encore) abouti mais que le contexte d'auth a déjà
  // l'utilisateur (chargé via getSession, fiable), on l'utilise pour ne jamais
  // laisser la page blanche.
  useEffect(() => {
    if (!user && authUser) {
      const normalized = normalizeUser(authUser);
      setUser(normalized);
      setForm(normalized);
    }
  }, [user, authUser]);

  const save = async () => {
    // Suivi de cycle activé sans date → on bloque LA SAUVEGARDE (uniquement ce cas) :
    // sinon le suivi serait enregistré inerte, sans que les conseils puissent démarrer.
    // Exception : sous contraception hormonale la date ne sert pas (pas de conseils de phase).
    if (form.gender === 'female' && form.cycle_tracking_enabled && !form.cycle_hormonal_contraception && !form.cycle_last_period_date) {
      toast.error(t('cy_save_blocked'));
      setActiveTab('basics'); // ramène sur l'onglet où se trouve le champ
      return;
    }
    if (!ensureOnline()) return;
    setSaving(true);
    try {
    const { id, email, full_name, created_date, role, ...editableFields } = form;
    // Les champs vides ('') doivent partir en null — sinon les colonnes numériques
    // (âge, taille, poids, mensurations…) rejettent la chaîne vide.
    const sanitized = Object.fromEntries(
      Object.entries(editableFields).map(([k, v]) => [k, v === '' ? null : v])
    );
    await base44.auth.updateMe(sanitized);

    // Comparer vs snapshot de génération — uniquement pour programmes générés par IA
    const snapshotRaw = localStorage.getItem('program_generated_snapshot');
    const snapshot = (() => { try { return JSON.parse(snapshotRaw || 'null'); } catch { return null; } })();
    if (snapshot) {
      const hasImpact = PROGRAM_IMPACTING_FIELDS.some(
        field => JSON.stringify(form[field]) !== JSON.stringify(snapshot[field])
      );
      if (hasImpact) {
        localStorage.setItem('pending_program_regen', JSON.stringify({ timestamp: Date.now() }));
        setShowRegenBanner(true);
      } else {
        localStorage.removeItem('pending_program_regen');
        setShowRegenBanner(false);
      }
    } else {
      // Programme importé — pas de snapshot, aucun impact possible
      localStorage.removeItem('pending_program_regen');
      setShowRegenBanner(false);
    }

    toast.success('Profil mis à jour');
    setUser({ ...user, ...editableFields });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const update = (field, value) => { setForm(prev => ({ ...prev, [field]: value })); };

  const IGNORED = new Set(['id', 'email', 'full_name', 'created_date', 'role']);
  // Normalise les valeurs "vides" : undefined / null / '' sont équivalents → un champ
  // vidé puis re-vidé ne compte pas comme un changement.
  const normVal = (v) => (v === undefined || v === null || v === '') ? null : v;
  const isDirty = user
    ? Object.keys(form).some(k => !IGNORED.has(k) && JSON.stringify(normVal(form[k])) !== JSON.stringify(normVal(user[k])))
    : false;

  // La page Profil reste montée en permanence (carrousel) → quand on y revient,
  // on resynchronise depuis le serveur (ex : recalage du cycle fait sur l'Accueil).
  // On n'écrase JAMAIS des modifications non enregistrées (garde isDirty).
  useEffect(() => {
    if (location.pathname !== '/profile') return;
    if (isDirty) return;
    base44.auth.me().then(u => {
      const n = normalizeUser(u);
      setUser(n);
      if (!isDirty) setForm(n);
    }).catch(() => {});
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-white/60" />
      </div>
    );
  }

  // Profil non renseigné (ex: import d'un programme sans avoir fait l'onboarding)
  const profileIncomplete = !user.level;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          {/* Email volontairement absent : déjà affiché dans Paramètres → Compte */}
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white">Profil</h1>
          <button onClick={() => navigate('/settings')} aria-label="Paramètres"
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl border border-white/30 text-white hover:bg-white/10 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
        <SubscriptionBadge fullWidth />
      </div>

      {profileIncomplete && (
        <div className="rounded-2xl p-6 text-center space-y-4 bg-white/10 border border-white/20">
          <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.12)' }}>
            <User className="w-8 h-8 text-white/70" />
          </div>
          <div className="space-y-1">
            <p className="text-white font-bold text-lg">{t('prof_incomplete_t')}</p>
            <p className="text-white/60 text-sm">{t('prof_incomplete_d')}</p>
          </div>
          <button onClick={() => navigate('/onboarding?skipIntro=true')}
            className="w-full py-3 rounded-xl text-sm font-bold text-violet-700 bg-white hover:bg-white/90 shadow transition-all active:scale-[0.98]">
            {t('prof_incomplete_cta')}
          </button>
        </div>
      )}

      {!profileIncomplete && (
      <Tabs defaultValue={searchParams.get('tab') || 'basics'} onValueChange={setActiveTab}>
        <TabsList className="bg-white/10 text-white w-full overflow-x-auto flex">
          <TabsTrigger value="basics" className="flex-1"><User className="w-4 h-4 sm:mr-1.5" /><span className="hidden sm:inline">{t('tab_basics')}</span></TabsTrigger>
          <TabsTrigger value="objectives" className="flex-1"><Target className="w-4 h-4 sm:mr-1.5" /><span className="hidden sm:inline">{t('tab_objectives')}</span></TabsTrigger>
          <TabsTrigger value="availability" className="flex-1"><Calendar className="w-4 h-4 sm:mr-1.5" /><span className="hidden sm:inline">{t('tab_availability')}</span></TabsTrigger>
          <TabsTrigger value="equipment" className="flex-1"><Dumbbell className="w-4 h-4 sm:mr-1.5" /><span className="hidden sm:inline">{t('tab_equipment')}</span></TabsTrigger>
          <TabsTrigger value="preferences" className="flex-1"><SlidersHorizontal className="w-4 h-4 sm:mr-1.5" /><span className="hidden sm:inline">{t('tab_preferences')}</span></TabsTrigger>
          <TabsTrigger value="measurements" className="flex-1"><Ruler className="w-4 h-4 sm:mr-1.5" /><span className="hidden sm:inline">{t('tab_measurements')}</span></TabsTrigger>
        </TabsList>

        <TabsContent value="basics">
          <Card className="p-6 space-y-4 bg-white/15 backdrop-blur-sm border-white/20">
            <div className="space-y-2">
              <Label className="text-white">{t('sp_gender')}</Label>
              <div className="grid grid-cols-2 gap-3">
                {[{ value: 'male', label: t('sp_male') }, { value: 'female', label: t('sp_female') }].map(({ value, label }) => (
                  <button key={value} type="button" onClick={() => update('gender', value)}
                    className={`py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${form.gender === value ? 'border-white bg-white/20 text-white' : 'border-white/20 bg-white/10 text-white/50 hover:border-white/40'}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">{t('sp_age')}</Label>
                <NumInput value={form.age} onChange={(v) => update('age', v === '' ? '' : parseInt(v))} min={18} max={120} step={1} defaultValue={25} className="bg-white/10 border-white/20 text-white placeholder:text-white/30" />
              </div>
              <div className="space-y-2">
                <Label className="text-white">{t('sp_level')}</Label>
                <Select value={form.level || ''} onValueChange={(v) => update('level', v)}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white [&>span]:text-white [&>span[data-placeholder]]:text-white/50 [&>svg]:opacity-100 [&>svg]:text-white"><SelectValue placeholder={t('sp_select')} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">{t('sp_beginner')}</SelectItem>
                    <SelectItem value="intermediate">{t('sp_intermediate')}</SelectItem>
                    <SelectItem value="advanced">{t('sp_advanced')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-white">{t('sp_height')}</Label>
                <NumInput value={form.height} onChange={(v) => update('height', v === '' ? '' : parseInt(v))} min={50} max={250} step={1} defaultValue={175} className="bg-white/10 border-white/20 text-white placeholder:text-white/30" />
              </div>
              <div className="space-y-2">
                <Label className="text-white">{t('sp_weight')}</Label>
                <NumInput value={form.weight} onChange={(v) => update('weight', v === '' ? '' : parseFloat(v))} min={20} max={300} step={0.5} defaultValue={70} className="bg-white/10 border-white/20 text-white placeholder:text-white/30" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
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
                <Select value={form.activity_level || ''} onValueChange={(v) => update('activity_level', v)}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white [&>span]:text-white [&>span[data-placeholder]]:text-white/50 [&>svg]:opacity-100 [&>svg]:text-white"><SelectValue placeholder={t('sp_select')} /></SelectTrigger>
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
                <div className="flex items-center gap-1.5">
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
                <NumInput value={form.body_fat} onChange={(v) => update('body_fat', v === '' ? '' : parseFloat(v))} min={3} max={60} step={0.5} defaultValue={15} className="bg-white/10 border-white/20 text-white placeholder:text-white/30" />
              </div>
            </div>
            {(() => {
              const days = Array.isArray(form.available_days)
                ? form.available_days.length
                : (() => { try { const p = JSON.parse(form.available_days || '[]'); return Array.isArray(p) ? p.length : 0; } catch { return 0; } })();
              const cal = estimateMaintenanceCalories({
                gender: form.gender, age: form.age, height: form.height, weight: form.weight,
                trainingDays: days || form.frequency_max || null,
                bodyFat: form.body_fat,
                activityLevel: form.activity_level,
              });
              if (!cal) return null;
              return (
                <div className="rounded-xl bg-white/10 border border-white/15 overflow-hidden">
                  <button type="button" onClick={() => setShowMaintenance(v => !v)}
                    className="w-full flex items-center justify-between gap-2 p-3 text-left hover:bg-white/5 transition-colors">
                    <span className="text-sm font-medium text-white">{t('sp_maintenance')}</span>
                    <span className="flex items-center gap-1.5 text-white/90 font-semibold whitespace-nowrap">
                      {showMaintenance ? `~${cal.maintenance} ${t('sp_kcal_day')}` : t('sp_see')}
                      <ChevronDown className={`w-4 h-4 transition-transform ${showMaintenance ? 'rotate-180' : ''}`} />
                    </span>
                  </button>
                  {showMaintenance && (
                    <p className="text-[11px] text-white/45 px-3 pb-3 leading-snug">
                      {cal.method === 'katch' ? t('sp_maint_katch') : t('sp_maint_mifflin')}
                    </p>
                  )}
                </div>
              );
            })()}

            {/* Cycle menstruel — opt-in, visible uniquement pour les profils féminins.
                Donnée de santé : consentement explicite requis, effaçable en un bouton. */}
            {form.gender === 'female' && (
              <div className="space-y-3 pt-4 border-t border-white/15">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white">🌙 {t('cy_title')}</p>
                    <p className="text-[11px] text-white/45 mt-0.5 leading-snug">{t('cy_hint')}</p>
                  </div>
                  <button type="button" aria-label={t('cy_title')} className="flex-shrink-0"
                    onClick={() => {
                      if (form.cycle_tracking_enabled) update('cycle_tracking_enabled', false);
                      else {
                        update('cycle_tracking_enabled', true);
                        if (form.cycle_hormonal_contraception === undefined || form.cycle_hormonal_contraception === null) update('cycle_hormonal_contraception', false);
                      }
                    }}>
                    <span className={`relative block w-11 h-6 rounded-full transition-colors ${form.cycle_tracking_enabled ? 'bg-violet-500' : 'bg-white/20'}`}>
                      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${form.cycle_tracking_enabled ? 'left-[22px]' : 'left-0.5'}`} />
                    </span>
                  </button>
                </div>

                {form.cycle_tracking_enabled && (
                  <div className="space-y-3">
                    {/* La question du mode d'abord : elle détermine si le reste a un sens */}
                    <div className="space-y-2">
                      <Label className="text-white text-xs">{t('cy_mode_q')}</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {[{ v: false, l: t('cy_natural') }, { v: true, l: t('cy_hormonal') }].map(({ v, l }) => (
                          <button key={String(v)} type="button" onClick={() => update('cycle_hormonal_contraception', v)}
                            className={`py-2.5 rounded-xl border-2 text-xs font-semibold transition-all ${!!form.cycle_hormonal_contraception === v ? 'border-white bg-white/20 text-white' : 'border-white/20 bg-white/10 text-white/50 hover:border-white/40'}`}>
                            {l}
                          </button>
                        ))}
                      </div>
                      {!!form.cycle_hormonal_contraception && (
                        <p className="text-[11px] text-amber-200/80 leading-snug">{t('cy_hormonal_note')}</p>
                      )}
                    </div>
                    {/* Date + durée : uniquement en cycle naturel (inutiles sous contraception hormonale) */}
                    {!form.cycle_hormonal_contraception && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-white text-xs">{t('cy_last_period')} <span className="text-red-400">*</span></Label>
                        {/* Calendrier du thème (pas le natif du navigateur) : seules les dates
                            plausibles sont cliquables → aucune valeur absurde possible. */}
                        {(() => {
                          const v = form.cycle_last_period_date;
                          const selected = v ? (() => { const [y, m, d] = v.split('-').map(Number); return new Date(y, m - 1, d); })() : undefined;
                          const today = new Date(); today.setHours(0, 0, 0, 0);
                          const oneYearAgo = new Date(today); oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
                          return (
                            <Popover>
                              <PopoverTrigger asChild>
                                <button type="button"
                                  className="w-full h-10 px-3 rounded-md bg-white/10 border border-white/20 text-white text-sm text-left flex items-center justify-between gap-2 hover:bg-white/15 focus:outline-none focus:border-white/40 transition-colors">
                                  <span className={selected ? '' : 'text-white/40'}>
                                    {selected
                                      ? format(selected, 'd MMM yyyy', lang === 'fr' ? { locale: frLocale } : undefined)
                                      : (lang === 'fr' ? 'jj/mm/aaaa' : 'dd/mm/yyyy')}
                                  </span>
                                  <Calendar className="w-4 h-4 text-white/50 flex-shrink-0" />
                                </button>
                              </PopoverTrigger>
                              <PopoverContent align="start" className="w-auto p-0 bg-violet-950 border border-white/20 text-white">
                                <CalendarPicker mode="single" selected={selected}
                                  defaultMonth={selected || today}
                                  fromMonth={oneYearAgo} toMonth={today} /* pas de navigation hors de la plage utile */
                                  disabled={(d) => d > today || d < oneYearAgo}
                                  /* On garde les CASES des jours voisins (sinon la grille flex se
                                     décale), mais on rend leur contenu INVISIBLE → alignement correct
                                     ET aucun jour d'un autre mois affiché. (invisible = non cliquable) */
                                  classNames={{
                                    /* Neutralise la couleur « accent » (bleue/teal) du kit : survol des
                                       flèches et flash au clic d'un jour. */
                                    day_today: '',
                                    day_outside: 'invisible',
                                    cell: 'relative p-0 text-center text-sm focus-within:relative focus-within:z-20',
                                    day: 'h-8 w-8 p-0 font-normal rounded-md inline-flex items-center justify-center text-white hover:bg-white/15 focus:bg-white/15 transition-colors aria-selected:opacity-100',
                                    day_selected: 'bg-violet-500 text-white hover:bg-violet-500 focus:bg-violet-500',
                                    nav_button: 'h-7 w-7 p-0 rounded-md border border-white/20 bg-transparent text-white/70 hover:bg-white/10 hover:text-white inline-flex items-center justify-center transition-colors',
                                  }}
                                  locale={lang === 'fr' ? frLocale : undefined}
                                  onSelect={(d) => {
                                    if (!d) return;
                                    update('cycle_last_period_date', `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
                                  }} />
                              </PopoverContent>
                            </Popover>
                          );
                        })()}
                        {!form.cycle_last_period_date && (
                          <p className="text-[11px] text-amber-200/80 leading-snug">{t('cy_date_needed')}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5">
                          <Label className="text-white text-xs">{t('cy_length')}</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <button type="button" className="text-white/40 hover:text-white/70 transition-colors"><HelpCircle className="w-3.5 h-3.5" /></button>
                            </PopoverTrigger>
                            <PopoverContent className="w-72 text-xs">
                              <p className="text-white/70 leading-relaxed">{t('cy_length_help')}</p>
                            </PopoverContent>
                          </Popover>
                        </div>
                        {/* 28 = valeur par défaut affichée en placeholder estompé (pas une saisie) */}
                        <NumInput value={form.cycle_avg_length} placeholder="28"
                          onChange={(v) => update('cycle_avg_length', v === '' ? '' : Math.min(45, Math.max(21, parseInt(v) || 28)))}
                          min={21} max={45} step={1} defaultValue={28}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/30" />
                      </div>
                    </div>
                    )}
                    <p className="text-[11px] text-white/40 leading-snug">{t('cy_consent')}</p>
                    <button type="button"
                      onClick={() => {
                        update('cycle_tracking_enabled', null);
                        update('cycle_last_period_date', null);
                        update('cycle_avg_length', null);
                        update('cycle_hormonal_contraception', null);
                      }}
                      className="text-xs text-red-300 underline underline-offset-2 hover:text-red-200 transition-colors">
                      {t('cy_erase')}
                    </button>
                  </div>
                )}
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="measurements">
          <StepMeasurements data={form} onChange={(fields) => setForm(prev => ({ ...prev, ...fields }))} />
        </TabsContent>

        <TabsContent value="equipment">
          <StepEquipment data={form} onChange={(fields) => setForm(prev => ({ ...prev, ...fields }))} />
        </TabsContent>

        <TabsContent value="availability">
          <StepAvailability data={form} onChange={(fields) => setForm(prev => ({ ...prev, ...fields }))} />
        </TabsContent>

        <TabsContent value="objectives">
          <ObjectivesTab userId={user?.id} />
        </TabsContent>

        <TabsContent value="preferences">
          <StepPreferences data={form} onChange={(fields) => setForm(prev => ({ ...prev, ...fields }))} />
        </TabsContent>
      </Tabs>
      )}

      {showRegenBanner && (
        <div className="p-4 rounded-xl bg-violet-500/20 border border-violet-400/30 space-y-3">
          <div>
            <p className="text-sm font-semibold text-white">Ton programme ne correspond plus à ton profil</p>
            <p className="text-xs text-white/60 mt-0.5">Veux-tu apporter d'autres modifications avant de régénérer, ou lancer la génération maintenant ?</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigate('/program?autoGenerate=true')}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-white text-violet-700 hover:bg-white/90 transition-colors">
              <RefreshCw className="w-3.5 h-3.5" />
              Régénérer maintenant
            </button>
            <button
              onClick={() => setShowRegenBanner(false)}
              className="text-xs px-3 py-2 rounded-lg bg-white/10 text-white/70 border border-white/20 hover:bg-white/20 transition-colors">
              Continuer à modifier d'abord
            </button>
          </div>
        </div>
      )}

      {!profileIncomplete && !NO_SAVE_TABS.includes(activeTab) && (isDirty || saving || saved) && (
        <button
          onClick={save}
          disabled={saving || saved}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm bg-white text-violet-700 hover:bg-white/90 shadow transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4" /> : null}
          {saving ? '…' : saved ? t('prof_saved') : t('prof_save')}
        </button>
      )}

    </div>
  );
}