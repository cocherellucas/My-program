import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Save, Loader2, Plus, Trash2, Eye, EyeOff, Star } from 'lucide-react';
import { toast } from 'sonner';
import { DEFAULT_PLANS } from '@/lib/pricing-config';

export default function AdminPricing() {
  const [user, setUser] = useState(null);
  const [plans, setPlans] = useState(DEFAULT_PLANS);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      if (u?.role !== 'admin') return;
      base44.entities.AppConfig?.filter?.({ key: 'pricing_plans' }).then(res => {
        if (res?.[0]?.value?.plans) setPlans(res[0].value.plans);
      }).catch(() => {});
    });
  }, []);

  const updatePlan = (idx, field, value) => {
    setPlans(prev => prev.map((p, i) => i === idx ? { ...p, [field]: value } : p));
  };

  const updateFeature = (planIdx, featIdx, value) => {
    setPlans(prev => prev.map((p, i) => {
      if (i !== planIdx) return p;
      const features = [...p.features];
      features[featIdx] = value;
      return { ...p, features };
    }));
  };

  const addFeature = (planIdx) => {
    setPlans(prev => prev.map((p, i) => i === planIdx ? { ...p, features: [...p.features, ''] } : p));
  };

  const removeFeature = (planIdx, featIdx) => {
    setPlans(prev => prev.map((p, i) => {
      if (i !== planIdx) return p;
      return { ...p, features: p.features.filter((_, fi) => fi !== featIdx) };
    }));
  };

  const save = async () => {
    setSaving(true);
    const existing = await base44.entities.AppConfig?.filter?.({ key: 'pricing_plans' }).catch(() => []);
    if (existing?.[0]?.id) {
      await base44.entities.AppConfig.update(existing[0].id, { value: { plans } });
    } else {
      await base44.entities.AppConfig?.create?.({ key: 'pricing_plans', value: { plans } });
    }
    toast.success('Plans tarifaires sauvegardés');
    setSaving(false);
  };

  const resetDefaults = () => {
    setPlans(DEFAULT_PLANS);
    toast.info('Valeurs par défaut restaurées (non sauvegardées)');
  };

  if (!user) return null;
  if (user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Accès réservé aux administrateurs.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Configuration des plans</h1>
          <p className="text-muted-foreground mt-1">Modifie les tarifs, fonctionnalités et visibilité des plans</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetDefaults}>Réinitialiser</Button>
          <Button onClick={save} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Sauvegarder
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {plans.map((plan, idx) => (
          <Card key={plan.id} className={`p-6 space-y-5 ${!plan.visible ? 'opacity-50' : ''}`}>
            {/* Plan header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-heading font-bold">{plan.name}</h2>
                {plan.featured && <Badge className="bg-accent text-accent-foreground">Mis en avant</Badge>}
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={plan.featured}
                    onCheckedChange={(v) => {
                      setPlans(prev => prev.map((p, i) => ({ ...p, featured: i === idx ? v : false })));
                    }}
                    id={`featured-${idx}`}
                  />
                  <Label htmlFor={`featured-${idx}`} className="text-sm cursor-pointer">
                    <Star className="w-3.5 h-3.5 inline mr-1" />Mis en avant
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={plan.visible}
                    onCheckedChange={(v) => updatePlan(idx, 'visible', v)}
                    id={`visible-${idx}`}
                  />
                  <Label htmlFor={`visible-${idx}`} className="text-sm cursor-pointer">
                    {plan.visible ? <Eye className="w-3.5 h-3.5 inline mr-1" /> : <EyeOff className="w-3.5 h-3.5 inline mr-1" />}
                    Visible
                  </Label>
                </div>
              </div>
            </div>

            {/* Textes */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Nom du plan</Label>
                <Input value={plan.name} onChange={(e) => updatePlan(idx, 'name', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Label du bouton CTA</Label>
                <Input value={plan.cta_label} onChange={(e) => updatePlan(idx, 'cta_label', e.target.value)} />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label className="text-xs">Description</Label>
                <Input value={plan.description} onChange={(e) => updatePlan(idx, 'description', e.target.value)} />
              </div>
            </div>

            {/* Tarifs */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Prix mensuel (€)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={plan.price_monthly}
                  onChange={(e) => updatePlan(idx, 'price_monthly', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Prix annuel / mois (€)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={plan.price_annual}
                  onChange={(e) => updatePlan(idx, 'price_annual', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Réduction annuelle affichée (%)</Label>
                <Input
                  type="number"
                  value={plan.discount_annual_pct}
                  onChange={(e) => updatePlan(idx, 'discount_annual_pct', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            {/* Features */}
            <div className="space-y-2">
              <Label className="text-xs">Fonctionnalités incluses</Label>
              <div className="space-y-2">
                {plan.features.map((f, fi) => (
                  <div key={fi} className="flex gap-2">
                    <Input
                      value={f}
                      onChange={(e) => updateFeature(idx, fi, e.target.value)}
                      placeholder="Fonctionnalité..."
                      className="flex-1"
                    />
                    <Button variant="ghost" size="icon" onClick={() => removeFeature(idx, fi)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" onClick={() => addFeature(idx)}>
                <Plus className="w-3.5 h-3.5 mr-1.5" />Ajouter une fonctionnalité
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}