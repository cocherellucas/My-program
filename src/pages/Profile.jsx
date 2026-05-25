import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { NumInput } from '@/components/ui/num-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Loader2, User, Ruler, Dumbbell, Calendar, LogOut, Target, SlidersHorizontal, CheckCircle2, RefreshCw } from 'lucide-react';
import { normalizeUser } from '@/lib/utils';

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
  }, []);

  const save = async () => {
    setSaving(true);
    const { id, email, full_name, created_date, role, ...editableFields } = form;
    await base44.auth.updateMe(editableFields);

    // Comparer vs snapshot de génération (pas vs valeurs précédentes)
    // → détecte aussi bien les changements que les reverts
    const snapshot = (() => { try { return JSON.parse(localStorage.getItem('program_generated_snapshot') || '{}'); } catch { return {}; } })();
    const hasImpact = PROGRAM_IMPACTING_FIELDS.some(
      field => JSON.stringify(form[field]) !== JSON.stringify(snapshot[field])
    );

    if (hasImpact) {
      localStorage.setItem('pending_program_regen', JSON.stringify({ timestamp: Date.now() }));
      setShowRegenBanner(true);
    } else {
      // Revert détecté — les valeurs correspondent à nouveau au programme actuel
      localStorage.removeItem('pending_program_regen');
      setShowRegenBanner(false);
    }

    toast.success('Profil mis à jour');
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  if (!user) return null;

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

      <Tabs defaultValue={searchParams.get('tab') || 'basics'} onValueChange={setActiveTab}>
        <TabsList className="bg-white/10 text-white w-full overflow-x-auto flex">
          <TabsTrigger value="basics" className="flex-1"><User className="w-4 h-4 sm:mr-1.5" /><span className="hidden sm:inline">Base</span></TabsTrigger>
          <TabsTrigger value="measurements" className="flex-1"><Ruler className="w-4 h-4 sm:mr-1.5" /><span className="hidden sm:inline">Mensurations</span></TabsTrigger>
          <TabsTrigger value="equipment" className="flex-1"><Dumbbell className="w-4 h-4 sm:mr-1.5" /><span className="hidden sm:inline">Équipement</span></TabsTrigger>
          <TabsTrigger value="availability" className="flex-1"><Calendar className="w-4 h-4 sm:mr-1.5" /><span className="hidden sm:inline">Dispo</span></TabsTrigger>
          <TabsTrigger value="objectives" className="flex-1"><Target className="w-4 h-4 sm:mr-1.5" /><span className="hidden sm:inline">Objectifs</span></TabsTrigger>
          <TabsTrigger value="preferences" className="flex-1"><SlidersHorizontal className="w-4 h-4 sm:mr-1.5" /><span className="hidden sm:inline">VIF</span></TabsTrigger>
        </TabsList>

        <TabsContent value="basics">
          <Card className="p-6 space-y-4 bg-white/15 backdrop-blur-sm border-white/20">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Âge</Label>
                <NumInput value={form.age} onChange={(v) => update('age', v === '' ? '' : parseInt(v))} min={10} max={100} step={1} defaultValue={20} className="bg-white/10 border-white/20 text-white placeholder:text-white/30" />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Niveau</Label>
                <Select value={form.level || ''} onValueChange={(v) => update('level', v)}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Débutant</SelectItem>
                    <SelectItem value="intermediate">Intermédiaire</SelectItem>
                    <SelectItem value="advanced">Avancé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-white">Taille (cm)</Label>
                <NumInput value={form.height} onChange={(v) => update('height', v === '' ? '' : parseInt(v))} min={100} max={250} step={1} defaultValue={170} className="bg-white/10 border-white/20 text-white placeholder:text-white/30" />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Poids (kg)</Label>
                <NumInput value={form.weight} onChange={(v) => update('weight', v === '' ? '' : parseFloat(v))} min={30} max={250} step={0.5} defaultValue={70} className="bg-white/10 border-white/20 text-white placeholder:text-white/30" />
              </div>
            </div>
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

      {!NO_SAVE_TABS.includes(activeTab) && (
        <button
          onClick={save}
          disabled={saving || saved}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm bg-white text-violet-700 hover:bg-white/90 shadow transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saving ? 'Sauvegarde…' : saved ? 'Sauvegardé !' : 'Sauvegarder'}
        </button>
      )}

      {confirmLogout && (
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
      )}
    </div>
  );
}