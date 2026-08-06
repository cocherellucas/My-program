import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ensureOnline } from '@/lib/net';
import { useI18n } from '@/lib/i18n';
import { messageBudgetTemps } from '@/lib/budget-temps';
// L'onglet Objectifs du Profil réutilise l'ÉCRAN DE L'ONBOARDING au lieu d'en
// maintenir une deuxième version (qui avait dérivé : champ texte libre pour les
// mouvements, zone vide sans explication…). Ici on ne garde que la persistance.
import StepObjectives from '@/components/onboarding/StepObjectives';

export default function ObjectivesTab({ userId, level, onProgramImpact }) {
  const { t } = useI18n();
  const [objectives, setObjectives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  // track original ids for delete
  const [originalIds, setOriginalIds] = useState([]);
  // instantané de l'état enregistré → pour désactiver "Sauvegarder" si rien n'a changé
  const [savedSnapshot, setSavedSnapshot] = useState('[]');

  const snapshotOf = (objs) => JSON.stringify(objs);
  const isDirty = snapshotOf(objectives) !== savedSnapshot;

  useEffect(() => {
    if (!userId) return;
    base44.entities.Objective.filter({ user_id: userId }).then(data => {
      // En base, focus_group / focus_movement sont stockés en TEXTE séparé par des
      // virgules (voir `save`). L'écran de saisie, lui, travaille avec des LISTES :
      // sans cette conversion il recevait une seule chaîne, qui ne correspondait à
      // aucun bouton — les mouvements déjà choisis apparaissaient tous désactivés.
      const enListe = (v) => (Array.isArray(v)
        ? v
        : String(v || '').split(',').map((x) => x.trim()).filter(Boolean));
      const loaded = data.map(o => ({
        ...o,
        _local: false,
        focus_group: enListe(o.focus_group),
        focus_movement: enListe(o.focus_movement),
      }));
      setObjectives(loaded);
      setSavedSnapshot(snapshotOf(loaded));
      setOriginalIds(data.map(o => o.id));
      setLoading(false);
    });
  }, [userId]);

  // L'ajout, la modification et le retrait d'un objectif sont désormais gérés par
  // StepObjectives (le même écran que l'onboarding) ; il nous renvoie la liste
  // complète. Le retrait n'est répercuté en base qu'à l'enregistrement, ce qui
  // permet d'annuler en quittant l'onglet sans sauvegarder.
  const save = async () => {
    if (!ensureOnline()) return;
    setSaving(true);
    try {
      // Même garde-fou qu'à l'onboarding, dans l'autre sens : ici ce sont les
      // OBJECTIFS qui changent, pas la durée. Alourdir ses objectifs sans
      // rallonger ses séances produirait un programme impossible à tenir dans le
      // temps annoncé — on le dit avant d'enregistrer. (`toList` côté activation
      // accepte aussi bien les listes que le texte séparé par des virgules.)
      const moi = await base44.auth.me().catch(() => null);
      const message = await messageBudgetTemps(moi, objectives, t);
      if (message) {
        toast.error(message, { duration: 8000 });
        return;
      }

      // Suppressions : StepObjectives retire l'objectif de la LISTE (il ne connaît
      // pas la base). On répercute donc ici ce qui a disparu depuis le chargement.
      const idsRestants = new Set(objectives.map((o) => o.id).filter(Boolean));
      for (const id of originalIds) {
        if (!idsRestants.has(id)) await base44.entities.Objective.delete(id);
      }
      setOriginalIds([...idsRestants]);

      for (const obj of objectives) {
        const { _local, id, created_date, updated_date, created_by, ...fields } = obj;
        if (Array.isArray(fields.focus_group)) fields.focus_group = fields.focus_group.join(', ');
        if (Array.isArray(fields.focus_movement)) fields.focus_movement = fields.focus_movement.join(', ');
        // zone vide (Force "Sur un exercice") → NULL (contrainte SQL objectives_zone_check)
        if (!fields.zone) fields.zone = null;
        fields.user_id = userId;
        if (id) {
          await base44.entities.Objective.update(id, fields);
        } else {
          await base44.entities.Objective.create(fields);
        }
      }
      // Les objectifs sont LE premier facteur de génération, mais ils vivent dans
      // une autre table que le profil : le contrôle d'obsolescence de Profile.jsx
      // ne les voyait pas. On signale donc nous-mêmes que le programme ne
      // correspond plus — uniquement si quelque chose a réellement changé.
      if (isDirty && localStorage.getItem('program_generated_snapshot')) {
        try { localStorage.setItem('pending_program_regen', JSON.stringify({ timestamp: Date.now() })); } catch {}
        onProgramImpact?.();
      }

      setSavedSnapshot(snapshotOf(objectives));
      toast.success('Objectifs mis à jour');
    } catch (e) {
      console.error('[objectives] save', e);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-white/50" /></div>;

  return (
    <div className="space-y-4 mt-4">
      {/* MÊME interface que l'onboarding : le Profil n'a plus sa propre version
          (champ texte libre pour les mouvements, zone sans explication…). Ici on
          ne garde que la persistance ; la saisie est celle de StepObjectives. */}
      <StepObjectives
        hideHeader
        data={{ objectives, level }}
        onChange={(fields) => { if (fields.objectives) setObjectives(fields.objectives); }}
      />

      {isDirty && (
        <button onClick={save} disabled={saving} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm bg-white text-violet-700 hover:bg-white/90 shadow transition-all disabled:opacity-50">
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          Sauvegarder les objectifs
        </button>
      )}
    </div>
  );
}
