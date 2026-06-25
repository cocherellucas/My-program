import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { NumInput } from '@/components/ui/num-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Save, Loader2, User, Ruler, Dumbbell, Calendar, LogOut, Target, SlidersHorizontal, CheckCircle2, RefreshCw, HelpCircle } from 'lucide-react';
import { normalizeUser } from '@/lib/utils';
import { estimateMaintenanceCalories } from '@/lib/calories';

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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showRegenBanner, setShowRegenBanner] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'basics');
  const NO_SAVE_TABS = ['equipment', 'objectives'];

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    base44.auth.me().then(u => {
      const normalized = normalizeUser(u);
      setUser(normalized);
      setForm(normalized);
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

  const save = async () => {
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

  if (!user) return null;

  // Profil non renseigné (ex: import d'un programme sans avoir fait l'onboarding)
  const profileIncomplete = !user.level;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white">Profil</h1>
            <p className="text-white/70 mt-0.5 text-sm">{user.email}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setConfirmLogout(true)} className="border-white/30 text-white hover:bg-white/10 hover:text-white flex-shrink-0">
            <LogOut className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Déconnexion</span>
          </Button>
        </div>
        <SubscriptionBadge fullWidth />
      </div>

      {profileIncomplete && (
        <div className="rounded-2xl p-6 text-center space-y-4 bg-white/10 border border-white/20">
          <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.12)' }}>
            <User className="w-8 h-8 text-white/70" />
          </div>
          <div className="space-y-1">
            <p className="text-white font-bold text-lg">Complète ton profil</p>
            <p className="text-white/60 text-sm">Tu as importé un programme sans renseigner ton profil. Complète-le pour des séances et un coaching adaptés à toi.</p>
          </div>
          <button onClick={() => navigate('/onboarding?skipIntro=true')}
            className="w-full py-3 rounded-xl text-sm font-bold text-violet-700 bg-white hover:bg-white/90 shadow transition-all active:scale-[0.98]">
            Compléter mon profil
          </button>
        </div>
      )}

      {!profileIncomplete && (
      <Tabs defaultValue={searchParams.get('tab') || 'basics'} onValueChange={setActiveTab}>
        <TabsList className="bg-white/10 text-white w-full overflow-x-auto flex">
          <TabsTrigger value="basics" className="flex-1"><User className="w-4 h-4 sm:mr-1.5" /><span className="hidden sm:inline">Base</span></TabsTrigger>
          <TabsTrigger value="objectives" className="flex-1"><Target className="w-4 h-4 sm:mr-1.5" /><span className="hidden sm:inline">Objectifs</span></TabsTrigger>
          <TabsTrigger value="availability" className="flex-1"><Calendar className="w-4 h-4 sm:mr-1.5" /><span className="hidden sm:inline">Dispo</span></TabsTrigger>
          <TabsTrigger value="equipment" className="flex-1"><Dumbbell className="w-4 h-4 sm:mr-1.5" /><span className="hidden sm:inline">Équipement</span></TabsTrigger>
          <TabsTrigger value="preferences" className="flex-1"><SlidersHorizontal className="w-4 h-4 sm:mr-1.5" /><span className="hidden sm:inline">VIF</span></TabsTrigger>
          <TabsTrigger value="measurements" className="flex-1"><Ruler className="w-4 h-4 sm:mr-1.5" /><span className="hidden sm:inline">Mensurations</span></TabsTrigger>
        </TabsList>

        <TabsContent value="basics">
          <Card className="p-6 space-y-4 bg-white/15 backdrop-blur-sm border-white/20">
            <div className="space-y-2">
              <Label className="text-white">Genre</Label>
              <div className="grid grid-cols-2 gap-3">
                {[{ value: 'male', label: 'Homme' }, { value: 'female', label: 'Femme' }].map(({ value, label }) => (
                  <button key={value} type="button" onClick={() => update('gender', value)}
                    className={`py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${form.gender === value ? 'border-white bg-white/20 text-white' : 'border-white/20 bg-white/10 text-white/50 hover:border-white/40'}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Âge</Label>
                <NumInput value={form.age} onChange={(v) => update('age', v === '' ? '' : parseInt(v))} min={18} max={120} step={1} defaultValue={25} className="bg-white/10 border-white/20 text-white placeholder:text-white/30" />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Niveau</Label>
                <Select value={form.level || ''} onValueChange={(v) => update('level', v)}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white [&>span]:text-white [&>span[data-placeholder]]:text-white/50 [&>svg]:opacity-100 [&>svg]:text-white"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Débutant</SelectItem>
                    <SelectItem value="intermediate">Intermédiaire</SelectItem>
                    <SelectItem value="advanced">Avancé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-white">Taille (cm)</Label>
                <NumInput value={form.height} onChange={(v) => update('height', v === '' ? '' : parseInt(v))} min={50} max={250} step={1} defaultValue={175} className="bg-white/10 border-white/20 text-white placeholder:text-white/30" />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Poids (kg)</Label>
                <NumInput value={form.weight} onChange={(v) => update('weight', v === '' ? '' : parseFloat(v))} min={20} max={300} step={0.5} defaultValue={70} className="bg-white/10 border-white/20 text-white placeholder:text-white/30" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <Label className="text-white">Activité</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button type="button" className="text-white/40 hover:text-white/70 transition-colors"><HelpCircle className="w-3.5 h-3.5" /></button>
                    </PopoverTrigger>
                    <PopoverContent className="w-72 text-xs space-y-1.5">
                      <p className="text-white/60 text-[10px] uppercase tracking-wider font-semibold">Ton activité globale (pas que la muscu)</p>
                      <p><span className="font-semibold">Sédentaire</span> — travail assis, peu de marche, peu/pas de sport.</p>
                      <p><span className="font-semibold">Légèrement actif</span> — un peu de marche au quotidien, ou 1-2 séances/sem.</p>
                      <p><span className="font-semibold">Modérément actif</span> — debout/marche dans la journée, ou 3-4 séances/sem.</p>
                      <p><span className="font-semibold">Très actif</span> — métier physique, ou 5-6 séances/sem.</p>
                      <p><span className="font-semibold">Extrêmement actif</span> — métier très physique + entraînement quasi quotidien.</p>
                    </PopoverContent>
                  </Popover>
                </div>
                <Select value={form.activity_level || ''} onValueChange={(v) => update('activity_level', v)}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white [&>span]:text-white [&>span[data-placeholder]]:text-white/50 [&>svg]:opacity-100 [&>svg]:text-white"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sédentaire</SelectItem>
                    <SelectItem value="light">Légèrement actif</SelectItem>
                    <SelectItem value="moderate">Modérément actif</SelectItem>
                    <SelectItem value="active">Très actif</SelectItem>
                    <SelectItem value="very_active">Extrêmement actif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <Label className="text-white">Masse grasse (%)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button type="button" className="text-white/40 hover:text-white/70 transition-colors"><HelpCircle className="w-3.5 h-3.5" /></button>
                    </PopoverTrigger>
                    <PopoverContent className="w-72 text-xs space-y-1.5">
                      <p className="font-semibold text-white">Ton pourcentage de masse grasse</p>
                      <p className="text-white/70">Si tu ne le connais pas : balance à impédance, pince à plis cutanés, ou estimation visuelle (photos de référence en ligne).</p>
                      <p className="text-white/70">Renseigné → calcul du maintien plus précis (Katch-McArdle). Laisse vide si tu n'es pas sûr.</p>
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
                <div className="p-3 rounded-xl bg-white/10 border border-white/15">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-white">Maintien calorique estimé</span>
                    <span className="text-lg font-bold text-white whitespace-nowrap">~{cal.maintenance} kcal/j</span>
                  </div>
                  <p className="text-[11px] text-white/45 mt-1 leading-snug">
                    {cal.method === 'katch'
                      ? 'Estimation (Katch-McArdle, basée sur ta masse grasse) selon ton activité. À ajuster selon tes résultats.'
                      : 'Estimation (Mifflin-St Jeor) selon ton profil et ton activité. Renseigne ta masse grasse pour plus de précision.'}
                  </p>
                </div>
              );
            })()}
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
          {saving ? 'Sauvegarde…' : saved ? 'Sauvegardé !' : 'Sauvegarder'}
        </button>
      )}

      {confirmLogout && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6" onClick={() => setConfirmLogout(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-violet-900 border border-white/20 rounded-2xl p-6 w-full max-w-xs shadow-2xl text-center space-y-4" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="font-bold text-white text-base">Se déconnecter ?</p>
              <p className="text-sm text-white/60 mt-1">Tu devras te reconnecter pour accéder à ton compte.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setConfirmLogout(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-white/10 text-white hover:bg-white/20 transition-colors">
                Annuler
              </button>
              <button onClick={() => base44.auth.logout()} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors">
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      , document.body)}
    </div>
  );
}