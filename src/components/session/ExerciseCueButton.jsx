import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { EXERCISES } from '@/lib/exercise-database';

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
  return CONSIGNES.has(nomExercice);
}

export default function ExerciseCueButton({ name, className = '' }) {
  const consigne = CONSIGNES.get(name);
  if (!consigne) return null;

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
      <PopoverContent className="w-72 text-xs space-y-2" onClick={(e) => e.stopPropagation()}>
        <p className="font-semibold text-white">Comment faire</p>
        <p className="leading-relaxed">{consigne}</p>
      </PopoverContent>
    </Popover>
  );
}
