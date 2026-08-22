import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { EXERCISES } from '@/lib/exercise-database';
import { reglagesPoidsDuCorps } from '@/lib/bodyweight-adjust';
import { useI18n } from '@/lib/i18n';

// Consigne d'exécution d'un exercice, derrière un « ? » à côté de son nom.
//
// Indispensable pour les exercices de REPLI (`fallback`) : ce sont des
// improvisations — un sac tenu par la poignée, le pied arrière sur une chaise,
// allongé en travers d'un lit. Sans l'explication, l'utilisateur ne peut pas
// deviner l'exécution attendue.
//
// Le bouton ne s'affiche QUE si une consigne existe : un « ? » qui ouvre une
// bulle vide est pire que pas de « ? » du tout.
const CONSIGNES = new Map(EXERCISES.filter((e) => e.cue).map((e) => [e.name, e.cue]));

export function aUneConsigne(nomExercice) {
  return CONSIGNES.has(nomExercice) || !!reglagesPoidsDuCorps(nomExercice);
}

export default function ExerciseCueButton({ name, className = '' }) {
  const { t } = useI18n();
  const consigne = CONSIGNES.get(name);
  // Au poids du corps on ne peut pas ajouter 2,5 kg : le réglage se fait par le
  // bras de levier, l'assistance, le lest ou l'unilatéral. Ces leviers étaient
  // connus de personne — c'est ce que ce bloc rend enfin visible.
  const reglages = reglagesPoidsDuCorps(name);
  if (!consigne && !reglages) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`Comment faire : ${name}`}
          className={`text-white/60 hover:text-white transition-colors cursor-pointer shrink-0 ${className}`}
          // La bulle ne doit pas déclencher le repli/dépli de la carte parente.
          onClick={(e) => e.stopPropagation()}
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 text-xs space-y-3" onClick={(e) => e.stopPropagation()}>
        {consigne && (
          <div className="space-y-1.5">
            <p className="font-semibold text-white">Comment faire</p>
            <p className="leading-relaxed">{consigne}</p>
          </div>
        )}
        {reglages && (
          <div className="space-y-1.5 border-t border-white/15 pt-2.5">
            <p className="font-semibold text-white">{t('cue_adjust')}</p>
            <p className="leading-relaxed"><span className="font-semibold text-emerald-300">{t('cue_easier')}</span> {reglages.simple}</p>
            <p className="leading-relaxed"><span className="font-semibold text-orange-300">{t('cue_harder')}</span> {reglages.dur}</p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
