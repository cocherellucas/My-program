// Génère program-data/alertes-accueil.csv : quand chaque alerte de la carte
// « Alertes » apparaît, et quand elle disparaît.
//
// Tout est relu de src/lib/coaching-engine.js (computeDashboardAlerts et ses
// dépendances). Rien n'est inventé : si un seuil bouge dans le code, ce fichier
// doit être régénéré.
import fs from 'node:fs';
import path from 'node:path';

const ICI = path.join(process.cwd(), 'program-data');

// [ type, alerte, condition d'apparition, ce qui la fait disparaître,
//   données nécessaires, seuil exact ]
const ALERTES = [
  ['fatigue / plateau', 'Recommandation de décharge (Repos 10-14 j · Décharge 7 j · Décharge ciblée · Semaine légère)',
    "Le score de décharge atteint 30. En dessous de 30 : « Continuer », aucune alerte. 30-49 → Semaine légère (−20 % volume). 30+ avec signaux LOCALISÉS dominants → Décharge ciblée sur les muscles concernés (−40 % sur eux seuls). 50-74 → Décharge 7 jours (−40 % partout). 75+ → Repos 10-14 jours.",
    'Le score repasse sous 30. Il baisse quand la fatigue déclarée redescend, quand les performances repartent, et quand une décharge est effectuée.',
    'Séances complétées avec fatigue globale renseignée · check-ins · séries enregistrées · programme',
    'score ≥ 30 / 50 / 75'],

  ['plateau', 'Fatigue faible sur 3 séances — sous-stimulation',
    'Les 3 dernières séances complétées ont toutes une fatigue globale ≤ 2/5.',
    "Dès qu'une des 3 dernières séances dépasse 2/5.",
    'Au moins 3 séances complétées avec fatigue renseignée',
    'fatigue ≤ 2 sur 3 séances consécutives'],

  ['plateau', 'Phase MRV déconseillée pour un débutant',
    'Profil débutant ET le programme est arrivé en phase MRV (dernier quart du cycle).',
    'Le niveau passe à intermédiaire, ou le cycle repart (retour en MEV).',
    'Niveau du profil · position dans le mésocycle',
    'niveau = débutant ET phase = MRV'],

  ['plateau', 'Régression de performance — rester en phase actuelle',
    "Régression détectée ET le programme n'est pas en phase MEV. Régression = sur au moins 40 % des exercices suivis, le volume moyen (charge × répétitions) de la seconde moitié des séries est inférieur de plus de 5 % à celui de la première.",
    'Les performances remontent au-dessus du seuil de −5 %, ou le cycle revient en MEV.',
    'Au moins 4 séries enregistrées, et au moins 4 par exercice comparé',
    'baisse > 5 % sur ≥ 40 % des exercices'],

  ['plateau', 'Fatigue trop élevée pour passer en MRV',
    'Fatigue moyenne ≥ 4/5 sur les 4 dernières séances complétées, alors que le programme est en phase MAV.',
    'La moyenne repasse sous 4/5, ou la phase change.',
    'Au moins 1 séance complétée avec fatigue renseignée',
    'moyenne ≥ 4/5 ET phase = MAV'],

  ['imbalance', 'Conflits SRA — récupération insuffisante',
    "Deux séances complétées consécutives touchent la même zone avec un écart plus court que la fenêtre de récupération : 72 h en force, 48 h en hypertrophie, 24 h en endurance, 48 h en mixte. UNE seule violation suffit à déclencher l'alerte.",
    "Aucune paire de séances complétées consécutives ne se chevauche plus. L'alerte porte sur l'HISTORIQUE : elle ne part que si les séances fautives sortent de la fenêtre observée.",
    'Séances complétées avec leurs zones actives et leurs dates',
    'écart < 72 h / 48 h / 24 h selon le type'],

  ['structural_plateau', 'Blocage structurel — stagnation sans fatigue',
    "Quatre conditions ENSEMBLE : au moins 12 séries enregistrées · stagnation ou régression des performances · au-delà de la semaine 3 du cycle · fatigue moyenne < 3,5/5 sur les 4 dernières séances. Autrement dit : ça ne progresse plus ALORS QUE la fatigue est basse — ce n'est donc pas un problème de récupération. La confiance monte si une décharge récente n'a rien changé.",
    'Les performances repartent, ou la fatigue remonte au-dessus de 3,5 (le blocage est alors attribué à la fatigue, pas à la structure).',
    'Au moins 12 séries enregistrées · séances complétées · programme',
    '≥ 12 séries ET semaine > 3 ET fatigue < 3,5'],

  ['missed', 'N séances non complétées — adhérence à surveiller',
    "Au moins 2 séances encore au statut « planifiée » dont la date est passée. Le compte est cumulatif : il ne se limite pas à la semaine en cours.",
    'Les séances en retard sont complétées, ou supprimées (une régénération les efface).',
    'Séances planifiées avec une date',
    '≥ 2 séances en retard'],

  ['cycle_end', 'Ton cycle se termine — repartir sur 4 semaines ?',
    "La dernière séance planifiée tombe dans les 7 jours (aujourd'hui compris). Ne concerne pas les programmes en boucle, qui se prolongent automatiquement.",
    'Un nouveau cycle est généré, ou de nouvelles séances repoussent la dernière date au-delà de 7 jours.',
    'Séances planifiées · programme actif',
    'dernière séance dans 0 à 7 jours'],
];

// Les signaux qui alimentent le score de décharge — utile pour comprendre
// POURQUOI une alerte de décharge apparaît.
const SIGNAUX = [
  ['Systémique', '8 semaines et plus sans décharge', '+30', 'position dans le mésocycle'],
  ['Systémique', '7 semaines en FORCE (décharge préventive tendineuse)', '+20', 'objectif primaire = force'],
  ['Systémique', '4 semaines écoulées — surveiller', '+8', 'position dans le mésocycle'],
  ['Systémique', 'Fin de mésocycle atteinte', '+15', 'position dans le mésocycle'],
  ['Systémique', 'Fatigue maximale 5/5 sur une des 2 dernières séances', '+55', 'fatigue globale'],
  ['Systémique', 'Fatigue ≥ 4/5 sur les 2 dernières séances', '+40', 'fatigue globale'],
  ['Systémique', 'Fatigue moyenne ≥ 3,5/5 sur les 6 dernières', '+15', 'fatigue globale'],
  ['Systémique', 'Sous-stimulation : fatigue ≤ 2/5 sur 3 séances', '−10', 'fatigue globale'],
  ['Systémique', 'Dérive de fatigue (+1,5 entre le début et la fin des 6 dernières)', '+15', '≥ 4 séances complétées'],
  ['Systémique', 'Régression généralisée des performances', '+20', '≥ 4 séries enregistrées'],
  ['Systémique', 'Stagnation confirmée (3 sem. débutant, 2 sem. sinon)', '+8', 'séries enregistrées'],
  ['Systémique', 'Dérive de RIR (on force plus pour le même résultat)', '+15', 'intermédiaire et avancé seulement, ≥ 8 séries'],
  ['Systémique', 'Sommeil dégradé sur 2 des 4 dernières séances', '+10', 'check-ins'],
  ['Zonal', 'Raideur post-séance répétée (2 fois sur les 4 dernières)', '+18', 'check-ins J+1'],
  ['Zonal', 'Zones fragiles déclarées', '+8 par zone', 'profil'],
  ['Zonal', 'Au moins 2 violations SRA', '+12', 'séances complétées'],
];

const csvChamp = (v) => {
  const s = String(v ?? '');
  return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const ligne = (cols) => cols.map(csvChamp).join(';');

const csv = [];
csv.push(ligne(['CARTE « ALERTES » DE L\'ACCUEIL — quand chaque alerte apparaît et disparaît']));
csv.push(ligne(['Source : src/lib/coaching-engine.js → computeDashboardAlerts(). Régénérer ce fichier si un seuil change.']));
csv.push('');
csv.push(ligne(['Type', 'Alerte', 'Apparaît quand', 'Disparaît quand', 'Données nécessaires', 'Seuil exact']));
for (const a of ALERTES) csv.push(ligne(a));

csv.push('');
csv.push(ligne(['SCORE DE DÉCHARGE — les signaux qui l\'alimentent']));
csv.push(ligne(['Le score va de 0 à 100. Total = systémique + (zonal ÷ 2), borné à 100.']));
csv.push(ligne(['Type de signal', 'Signal', 'Points', 'Condition']));
for (const s of SIGNAUX) csv.push(ligne(s));

csv.push('');
csv.push(ligne(['CE QUI FAIT DISPARAÎTRE TOUTE LA CARTE']));
csv.push(ligne(['Aucune des conditions ci-dessus n\'est remplie → « Tout va bien ! Aucune alerte pour le moment. »']));
csv.push(ligne(['Un compte NEUF n\'a aucune alerte : la plupart des règles exigent des séances complétées ou des séries enregistrées.']));

const sortie = path.join(ICI, 'alertes-accueil.csv');
fs.writeFileSync(sortie, '﻿' + csv.join('\r\n') + '\r\n', 'utf8');
console.log(`✓ ${sortie}`);
console.log(`  ${ALERTES.length} alertes · ${SIGNAUX.length} signaux de décharge`);
