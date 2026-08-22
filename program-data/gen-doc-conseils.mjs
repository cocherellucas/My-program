// Génère program-data/conseils-par-donnees.fods : le document Calc qui explique
// le nouveau comportement issu de la décision du 2026-08-16 — « l'app ne modifie
// plus rien, elle conseille, et le conseil s'appuie sur la donnée observée ».
//
// Même format que gen-alertes-doc.mjs (Flat ODF, XML en clair, aucune
// bibliothèque). Convention : *entre astérisques* = gras dans le document.
//
// PARTICULARITÉ : les phrases de la feuille « Ce qui s'affiche » ne sont pas
// recopiées à la main — elles sont LUES dans src/lib/i18n.jsx (clés `fait_*`).
// Un doc recopié ment dès la première retouche du texte ; celui-ci ne peut pas
// diverger du code. Régénérer après toute modification du dictionnaire.
import fs from 'node:fs';
import path from 'node:path';

const RACINE = process.cwd();
const ICI = path.join(RACINE, 'program-data');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const paragraphes = (texte) => String(texte).split('\n').map((ligne) => {
  const morceaux = ligne.split(/\*([^*]+)\*/g);
  const contenu = morceaux.map((m, i) => (i % 2
    ? `<text:span text:style-name="Gras">${esc(m)}</text:span>`
    : esc(m))).join('');
  return `<text:p>${contenu}</text:p>`;
}).join('');

const cellule = (texte, style) =>
  `<table:table-cell table:style-name="${style}" office:value-type="string">${paragraphes(texte)}</table:table-cell>`;
const rangee = (cols, style) => `<table:table-row>${cols.map((c) => cellule(c, style)).join('')}</table:table-row>`;

// ── Lecture du dictionnaire (source de vérité pour les textes affichés) ──────
// On évalue le bloc DICT plutôt que de le lire à la regex : plusieurs clés par
// ligne, et des apostrophes échappées un peu partout.
const i18n = fs.readFileSync(path.join(RACINE, 'src', 'lib', 'i18n.jsx'), 'utf8');
const debut = i18n.indexOf('const DICT = {');
let prof = 0; let fin = -1;
for (let i = i18n.indexOf('{', debut); i < i18n.length; i++) {
  if (i18n[i] === '{') prof++;
  else if (i18n[i] === '}') { prof--; if (prof === 0) { fin = i + 1; break; } }
}
// eslint-disable-next-line no-new-func
const DICT = new Function(`return ${i18n.slice(i18n.indexOf('{', debut), fin)};`)();
const FR = DICT.fr;
const EN = DICT.en;

// ── FEUILLE 1 : le principe ─────────────────────────────────────────────────
const PRINCIPE = [
  ['La règle',
   "*Par exercice quand tu es devant l'exercice. Par données partout ailleurs.*\n\nPendant une séance, l'app sait de quel exercice il s'agit, tu es là pour juger et refuser, et rien n'est écrit dans ton programme. Elle a donc le droit d'être précise.\n\nHors séance, elle ne sait ni ton contexte du jour, ni ton matériel, ni ton état réel. Elle rapporte alors ce qu'elle a *mesuré*, et s'arrête là."],

  ['Pourquoi',
   "Une donnée mesurée est un *fait* : l'app ne peut pas se tromper dessus. « Ta fatigue déclarée est à 4,2/5 » est vrai ou faux, vérifiable.\n\nUne prescription par exercice est un *pari* : « retire 2 séries au squat » suppose de connaître ton contexte, ce qu'elle ne sait pas.\n\nS'y ajoutent deux raisons pratiques : le code qui appliquait ces modifications n'avait *jamais tourné en conditions réelles* (poussé les 3 et 6 juillet), et c'était le seul de l'app à écrire en base. Au moment de commercialiser, conseiller est une position plus tenable que décider à la place de quelqu'un."],

  ['Ce qui a changé concrètement',
   "*Avant :* « On retire 2 séries sur tes derniers exercices cette semaine » + un bouton *Appliquer* qui modifiait vraiment tes séances planifiées, en base.\n\n*Maintenant :* la liste de ce que l'app a mesuré, puis une ligne de conseil, puis un lien vers le guide « Comment alléger une semaine ». Aucun bouton ne touche au programme."],

  ['Ce qui n\'a pas changé',
   "Le *flux douleur en séance* (le bouton « Douleur ? » sous une série) n'est pas touché par ce chantier : il a le droit de parler *par exercice*, parce que l'app sait de quel exercice il s'agit, que tu es là pour refuser, et qu'il n'écrit rien dans ton programme. C'est l'exception décidée le 2026-08-18.\n\n*Attention, ce flux n'est pas gratuit* — ne pas confondre les deux sujets. Le formulaire est ouvert à tous, mais le conseil détaillé fait partie du plan Coach : un compte Starter voit le mur d'abonnement à la place. *Seuls les trois cas de gravité* (gonflement, douleur vive ou craquement, fourmillements) reçoivent leur conseil d'arrêt gratuitement — et sans la promesse de relance à J+1, qui n'aurait pas lieu.\n\nL'*échelle de réduction* de la douleur garde son ordre — charge, puis séries, puis fréquence. Seule la formulation change : elle est passée de la description d'une action de l'app à un conseil à l'impératif."],
];

// ── FEUILLE 2 : ce qui s'affiche (lu dans le dictionnaire) ──────────────────
// Chaque fait : clé, ce qui le déclenche, et le texte réel des deux langues.
const FAITS = [
  ['fait_fatigue_max', "Fatigue déclarée à *5/5* sur l'une des 2 dernières séances.", '+55'],
  ['fait_fatigue_2seances', 'Fatigue déclarée *≥ 4/5* sur les 2 dernières séances.', '+40'],
  ['fait_fatigue_moyenne', 'Fatigue moyenne *≥ 3,5/5* sur les 6 dernières séances.', '+15'],
  ['fait_derive_fatigue', "La fatigue des 2 dernières séances dépasse celle des 2 premières de *+1,5*.", '+15'],
  ['fait_sans_decharge', "*8 semaines ou plus* depuis le dernier allègement déclaré.", '+30'],
  ['fait_preventif_force', "Objectif *force* et durée dépassant le seuil préventif du niveau.", '+20'],
  ['fait_4_semaines', '*4 semaines* depuis le dernier allègement — surveillance.', '+8'],
  ['fait_regression', 'Performances en baisse sur plusieurs exercices.', '+20'],
  ['fait_stagnation', "Performances stables au-delà du délai de grâce du niveau (*3 sem.* débutant, *2 sem.* ensuite).", '+8'],
  ['fait_derive_rir', "Le RIR déclaré dérive à charge égale (niveaux qui l'utilisent).", '+15'],
  ['fait_sommeil', 'Sommeil déclaré mauvais *2 fois ou plus* sur les 4 dernières séances.', '+10'],
  ['fait_raideur', 'Raideur signalée au check-in du lendemain, plusieurs fois.', 'zonal'],
  ['fait_sous_stimulation', 'Fatigue *≤ 2/5* sur 3 séances de suite.', '−10'],
  ['fait_stagne_exos', "Perfs stables sur 2 occurrences, exécution correcte, cible atteinte, plafond de séries non atteint.", 'hausse'],
  ['fait_fatigue_ok', 'Fatigue moyenne *≤ 3/5* sur les 4 dernières séances.', 'hausse'],
];

const manquantes = FAITS.filter(([k]) => !FR[k] || !EN[k]).map(([k]) => k);
if (manquantes.length) {
  console.error(`✗ clés absentes du dictionnaire : ${manquantes.join(', ')}`);
  process.exit(1);
}

const LIGNES_FAITS = FAITS.map(([cle, decl, pts]) => [cle, decl, pts, FR[cle], EN[cle]]);

// ── Titres et conseils des cartes ───────────────────────────────────────────
// Ceux-là vivent en dur dans coaching-engine (`computeVolumeProposal`), pas dans
// le dictionnaire. On les recopie ici, MAIS on vérifie juste après qu'ils y sont
// bien : si quelqu'un retouche une formulation, le script s'arrête au lieu de
// produire un document qui ment.
const LABEL = {
  repos: 'Repos conseillé',
  decharge: 'Fatigue élevée',
  legere: 'Semaine plus légère conseillée',
  hausse: 'Tu stagnes, mais tu récupères bien',
};
const CONSEIL = {
  repos: 'Prends quelques jours de repos avant de reprendre.',
  decharge: 'Allège nettement cette semaine.',
  legere: 'Allège un peu cette semaine.',
  hausse: 'Tu peux ajouter du volume sur ces exercices.',
};

const moteur = fs.readFileSync(path.join(RACINE, 'src', 'lib', 'coaching-engine.js'), 'utf8');
const absentes = [...Object.values(LABEL), ...Object.values(CONSEIL)].filter((p) => !moteur.includes(p));
if (absentes.length) {
  console.error('✗ ces phrases ne sont plus dans coaching-engine.js — le doc mentirait :');
  absentes.forEach((p) => console.error(`    « ${p} »`));
  process.exit(1);
}

// ── FEUILLE 3 : les cartes et leurs boutons ─────────────────────────────────
const CARTES = [
  ['Constat de volume — *repos*',
   'Accueil, et écran de fin de séance',
   `Score de décharge *≥ 75*.`,
   `Titre « ${LABEL.repos} », la liste des faits mesurés, puis « ${CONSEIL.repos} »`,
   `*C'est fait* — date ton allègement, ne touche à rien.\n*Ouvrir mon programme* — t'y emmène, tu modifies toi-même.\n*Ignorer* — masque la carte 7 jours.`],

  ['Constat de volume — *décharge*',
   'Accueil, et écran de fin de séance',
   'Score de décharge *50 à 74*.',
   `Titre « ${LABEL.decharge} », les faits, puis « ${CONSEIL.decharge} »`,
   'Mêmes trois boutons.'],

  ['Constat de volume — *semaine légère*',
   'Accueil, et écran de fin de séance',
   'Score de décharge *30 à 49*, ou décharge ciblée sur quelques muscles.',
   `Titre « ${LABEL.legere} », les faits, puis « ${CONSEIL.legere} »`,
   'Mêmes trois boutons.'],

  ['Constat de volume — *hausse*',
   'Accueil',
   "Aucun signal de décharge, fatigue moyenne *≤ 3/5*, et au moins un exercice stagnant sur 2 occurrences.",
   `Titre « ${LABEL.hausse} », la liste des exercices *tirée de tes propres logs*, puis « ${CONSEIL.hausse} »`,
   "Pas de « C'est fait » (il n'y a pas d'allègement à dater).\n*Ouvrir mon programme* et *Ignorer* seulement."],

  ['Suivi de douleur (J+1)',
   'Accueil, et écran de fin de séance',
   "Un épisode de douleur ouvert, et au moins 24 h depuis le dernier check.",
   "La question « Comment a réagi ta zone ? », puis selon ta réponse le cran conseillé de l'échelle.",
   `*C'est noté* — enregistre le cran atteint, ne touche à aucune séance.\n*Ouvrir mon programme*.\n*Ignorer*.`],
];

// ── FEUILLE 4 : ce qui a été retiré ────────────────────────────────────────
const RETIRES = [
  ['`applyVolumeProposal` (volume-adjust.js)',
   "Modifiait les séances planifiées : *+1 série* sur les exercices stagnants, ou *−1 à −2 séries* en partant du dernier exercice, sur une fenêtre de 7 jours.",
   "Écriture en base. C'était l'un des quatre points d'écriture hors séance."],

  ['`applyPainLevel` (pain-adjust.js)',
   "Appliquait les crans de l'échelle douleur : charge *−20 %*, *−1 série*, retrait des exercices de la zone une séance sur deux — avec mémorisation d'un « baseline » pour tout restaurer à la remontée.",
   "Écriture en base. `baseline` et `removed` disparaissent avec : ils n'existaient que pour défaire les modifications, et il n'y a plus rien à défaire."],

  ['Les deux points d\'écriture de `SessionLog.jsx`',
   "Le suivi de douleur (l. 1672) et la proposition de volume de fin de séance (l. 2685) appelaient eux aussi les deux fonctions ci-dessus.",
   "*Ils n'étaient pas dans la note de décision d'origine*, qui n'en citait que deux, sur l'Accueil. Il y en avait quatre."],

  ['Le bouton *Appliquer*',
   'Sur les deux cartes.',
   "Remplacé par *C'est fait* (volume) et *C'est noté* (douleur), qui n'appliquent rien."],
];

// ── FEUILLE 5 : les pièges à ne pas défaire ────────────────────────────────
const PIEGES = [
  ["Le bouton *C'est fait* n'est pas décoratif",
   "« Appliquer » était le *seul* signal qui datait une décharge (`marquerDecharge`). Sans lui, `derniereDecharge` n'aurait plus jamais été écrit, et le compteur « semaines sans décharge » serait reparti de la création du programme.\n\nSur un programme en boucle — qui n'est jamais recréé — ça veut dire *+30 points à vie* passé 8 semaines : le signal de décharge resterait allumé en permanence. C'est exactement le bug déjà corrigé une fois, qui serait revenu par la porte de derrière.\n\n« C'est fait » n'applique rien : il enregistre que *tu* as allégé."],

  ["L'anti-spam a été conservé",
   "La note de décision le listait parmi les choses à supprimer. Il est resté (`markVolumeHandled` / `isVolumeSuppressed`, 7 jours) : sans lui, la carte resterait affichée en permanence, sans moyen de la refermer.\n\nIl ne mémorise plus « appliquée / ignorée / faite manuellement » — seulement « conseil traité »."],

  ['La date de décharge reste locale',
   "Elle est dans le `localStorage` de l'appareil, pas en base. Sur un second téléphone, le compteur repart de la création du programme.\n\nCe n'est pas un oubli : synchroniser demanderait une colonne `profiles` ou un champ de `UserMemory`. Décision à prendre."],

  ['Le guide ne parle jamais d\'un exercice',
   "C'est volontaire. Dès que le guide « Comment alléger une semaine » dépendrait de ton programme, on retomberait exactement dans la prescription par exercice qu'on vient de retirer.\n\nSes quatre leviers suivent le *même ordre* que l'échelle douleur — charge, séries, fréquence, arrêt — pour qu'il n'y ait qu'une logique à retenir dans toute l'app."],

  ['Le flux douleur en séance est hors périmètre',
   "Ne pas l'aligner sur le reste « par cohérence ». Les trois conditions qui manquent ailleurs y sont réunies : l'app sait de quel exercice il s'agit, tu es présent pour refuser, et rien n'est écrit. C'est l'exception décidée le 2026-08-18."],
];

// ── Rendu ───────────────────────────────────────────────────────────────────
const LARGEURS = {
  principe: ['5.5cm', '20cm'],
  faits: ['5cm', '8cm', '2.2cm', '10cm', '10cm'],
  cartes: ['6cm', '5cm', '7cm', '10cm', '9cm'],
  retires: ['7cm', '13cm', '11cm'],
  pieges: ['7cm', '20cm'],
};
const styleCol = (largeurs, prefixe) => largeurs.map((l, i) =>
  `<style:style style:name="${prefixe}${i}" style:family="table-column"><style:table-column-properties style:column-width="${l}"/></style:style>`).join('');

function feuille(nom, prefixe, largeurs, entetes, lignes) {
  const colonnes = largeurs.map((_, i) => `<table:table-column table:style-name="${prefixe}${i}"/>`).join('');
  return `<table:table table:name="${esc(nom)}">${colonnes}`
    + rangee(entetes, 'Entete')
    + lignes.map((l) => rangee(l, 'Corps')).join('')
    + '</table:table>';
}

const doc = `<?xml version="1.0" encoding="UTF-8"?>
<office:document xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0"
 xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0"
 xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0"
 xmlns:table="urn:oasis:names:tc:opendocument:xmlns:table:1.0"
 xmlns:fo="urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0"
 office:version="1.3" office:mimetype="application/vnd.oasis.opendocument.spreadsheet">
<office:automatic-styles>
 ${styleCol(LARGEURS.principe, 'p')}
 ${styleCol(LARGEURS.faits, 'f')}
 ${styleCol(LARGEURS.cartes, 'c')}
 ${styleCol(LARGEURS.retires, 'r')}
 ${styleCol(LARGEURS.pieges, 'g')}
 <style:style style:name="Gras" style:family="text">
  <style:text-properties fo:font-weight="bold"/>
 </style:style>
 <style:style style:name="Entete" style:family="table-cell">
  <style:table-cell-properties fo:background-color="#6d28d9" fo:padding="0.15cm"
   style:vertical-align="middle" fo:border="0.02cm solid #4c1d95"/>
  <style:text-properties fo:font-weight="bold" fo:color="#ffffff" fo:font-size="11pt"/>
 </style:style>
 <style:style style:name="Corps" style:family="table-cell">
  <style:table-cell-properties fo:wrap-option="wrap" style:vertical-align="top"
   fo:padding="0.15cm" fo:border="0.02cm solid #d4d4d8"/>
  <style:text-properties fo:font-size="10pt"/>
 </style:style>
</office:automatic-styles>
<office:body><office:spreadsheet>
${feuille('Le principe', 'p', LARGEURS.principe, ['Question', 'Réponse'], PRINCIPE)}
${feuille('Les faits affichés', 'f', LARGEURS.faits,
  ['Clé', 'Ce qui le déclenche', 'Points', 'Texte français (lu dans i18n.jsx)', 'Texte anglais'], LIGNES_FAITS)}
${feuille('Les cartes', 'c', LARGEURS.cartes,
  ['Carte', 'Où', 'Quand', "Ce qui s'affiche", 'Boutons'], CARTES)}
${feuille('Ce qui a été retiré', 'r', LARGEURS.retires,
  ['Ce qui a disparu', 'Ce que ça faisait', 'Pourquoi / conséquence'], RETIRES)}
${feuille('Pièges', 'g', LARGEURS.pieges, ['À ne pas défaire', 'Pourquoi'], PIEGES)}
</office:spreadsheet></office:body></office:document>`;

const sortie = path.join(ICI, 'conseils-par-donnees.fods');
fs.writeFileSync(sortie, doc, 'utf8');
console.log(`✓ ${sortie}`);
console.log(`  feuille 1 « Le principe »        : ${PRINCIPE.length} lignes`);
console.log(`  feuille 2 « Les faits affichés » : ${LIGNES_FAITS.length} lignes (textes lus dans i18n.jsx)`);
console.log(`  feuille 3 « Les cartes »         : ${CARTES.length} lignes`);
console.log(`  feuille 4 « Ce qui a été retiré »: ${RETIRES.length} lignes`);
console.log(`  feuille 5 « Pièges »             : ${PIEGES.length} lignes`);
