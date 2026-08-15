// Génère program-data/alertes-accueil.fods : le document Calc expliquant la
// carte « Alertes » de l'Accueil.
//
// Pourquoi .fods et non .csv : un CSV ne porte aucune mise en forme — pas de
// gras, pas de largeur de colonne, pas de retour à la ligne. Le format Flat ODF
// est du XML en clair, que LibreOffice ouvre nativement, et qui n'exige aucune
// bibliothèque.
//
// Convention d'écriture : *entre astérisques* = en gras dans le document.
//
// Tout vient de src/lib/coaching-engine.js (computeDashboardAlerts et ses
// dépendances). Régénérer si un seuil change.
import fs from 'node:fs';
import path from 'node:path';

const ICI = path.join(process.cwd(), 'program-data');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// « texte *gras* » → <text:p>texte <text:span…>gras</text:span></text:p>
// Les retours à la ligne deviennent de vrais sauts dans la cellule.
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

// ── FEUILLE 1 : les alertes ─────────────────────────────────────────────────
const ALERTES = [
  ['Décharge conseillée',
   "C'est l'alerte principale, et la seule qui repose sur un *score*. L'app additionne des signaux de fatigue (feuille 2) pour obtenir un score de *0 à 100*, puis en tire une recommandation.\n\n*Sous 30* : rien ne s'affiche.\n*30 à 49* : « Semaine légère » — *−20 % de volume*, mêmes charges.\n*50 à 74* : « Décharge 7 jours » — *−40 % de volume*, mêmes charges.\n*75 et plus* : « Repos 10 à 14 jours » — arrêt complet, marche et mobilité seulement.\n\nCas particulier : si les signaux sont *localisés* sur quelques muscles plutôt que généralisés, tu reçois une « Décharge ciblée » — *−40 % sur ces muscles uniquement*, le reste du programme continue normalement.",
   "Quand le score repasse *sous 30*. Il baisse quand la fatigue que tu déclares en fin de séance redescend, quand tes performances repartent à la hausse, et mécaniquement après une décharge.",
   "Des séances *complétées* avec la fatigue globale renseignée. Les check-ins du lendemain et les séries enregistrées affinent le calcul."],

  ['Sous-stimulation',
   "Tes *3 dernières séances* ont toutes une fatigue déclarée *≤ 2 sur 5*. Le message dit d'augmenter le volume ou l'intensité.\n\nC'est l'alerte *inverse* de la décharge : elle ne signale pas que tu en fais trop, mais que tu n'en fais pas assez pour progresser.",
   "Dès qu'une des 3 dernières séances dépasse *2/5*.",
   "*3 séances complétées* au minimum, avec la fatigue renseignée."],

  ['Blocage structurel',
   "La plus fine des alertes. Elle distingue *ne plus progresser par fatigue* de *ne plus progresser par structure du programme*.\n\nQuatre conditions doivent être réunies :\n· au moins *12 séries* enregistrées ;\n· performances qui *stagnent ou régressent* ;\n· on est *au-delà de la semaine 3* du cycle (avant, la stagnation est normale, le système nerveux apprend encore le mouvement) ;\n· la fatigue moyenne est *inférieure à 3,5 sur 5*.\n\nAutrement dit : ça ne progresse plus *alors que tu es frais*. Ce n'est donc pas un problème de récupération — c'est le programme lui-même qui ne stimule plus. L'alerte propose des pistes : ajouter un jour, changer de structure, progresser par la charge.\n\nLa confiance dans le diagnostic monte encore si une décharge récente n'a rien changé.",
   "Les performances repartent, ou la fatigue remonte au-dessus de *3,5* — auquel cas le blocage est attribué à la fatigue et non à la structure.",
   "Au moins *12 séries enregistrées*, des séances complétées, et un programme actif."],

  ['Séances non complétées',
   "Au moins *2 séances* sont encore au statut « planifiée » alors que leur date est passée.\n\nLe compte est *cumulatif et sans limite de temps* : deux séances ratées il y a un mois continuent de compter tant qu'elles gardent ce statut.",
   "Les séances en retard sont complétées, ou supprimées — une régénération de programme les efface.",
   "Des séances planifiées avec une date."],
];

// ── FEUILLE 2 : les signaux du score ────────────────────────────────────────
const SIGNAUX = [
  ['Systémique', '8 semaines ou plus sans décharge', '+30', "Le corps encaisse, mais pas indéfiniment. Au-delà de 8 semaines, la fatigue résiduelle s'accumule même sans signal visible.\n\n*Compté depuis ta dernière décharge appliquée* — c'est-à-dire depuis le jour où tu as accepté une proposition d'allègement ou de repos. Tant que tu n'en as jamais appliqué, le compte part de la création du programme."],
  ['Systémique', '7 semaines en FORCE', '+20', "Décharge *préventive tendineuse* : les tendons s'adaptent plus lentement que les muscles. Ne s'applique qu'à un objectif de force. Même point de départ que le signal ci-dessus."],
  ['Systémique', '4 semaines écoulées', '+8', 'Simple mise sous surveillance, pas encore un signal fort.'],
  ['Systémique', 'Fatigue 5/5 sur une des 2 dernières séances', '+55', "Le signal le *plus lourd* de tous. À lui seul il fait presque basculer en décharge complète — une fatigue maximale déclarée ne se discute pas."],
  ['Systémique', 'Fatigue ≥ 4/5 sur les 2 dernières séances', '+40', "Deux séances très dures d'affilée : le corps ne récupère plus entre les séances."],
  ['Systémique', 'Fatigue moyenne ≥ 3,5/5 sur les 6 dernières', '+15', 'Tendance de fond, plus douce que les deux signaux précédents.'],
  ['Systémique', 'Fatigue ≤ 2/5 sur 3 séances', '−10', "Signal *négatif* : il fait BAISSER le score. Tu récupères largement, rien ne justifie d'alléger."],
  ['Systémique', 'Dérive de fatigue', '+15', "La fatigue déclarée a augmenté de *+1,5 point* entre le début et la fin des 6 dernières séances, à entraînement comparable."],
  ['Systémique', 'Régression généralisée des performances', '+20', "Les charges baissent sur une majorité d'exercices — suspicion de fatigue du système nerveux."],
  ['Systémique', 'Stagnation confirmée', '+8', "Un *délai de grâce* s'applique avant de compter ce signal : *3 semaines* pour un débutant, *2 semaines* ensuite. Un débutant stagne souvent avant de débloquer."],
  ['Systémique', 'Dérive de RIR', '+15', "*RIR* = répétitions en réserve, ce qu'il te restait dans le moteur en fin de série. Si tu déclares des séries de plus en plus proches de l'échec pour les mêmes charges, c'est de la fatigue chronique. *Intermédiaires et avancés seulement* — un débutant estime encore mal son RIR."],
  ['Systémique', 'Sommeil dégradé', '+10', "Déclaré « mauvais » sur au moins *2 des 4* derniers check-ins. La récupération globale est compromise."],
  ['Zonal', 'Raideur post-séance répétée', '+18', "Déclarée au check-in du lendemain sur *2 des 4* dernières séances. C'est la *règle des 24 h* : une raideur qui persiste le lendemain signale une récupération incomplète, et elle est localisée."],
  ['Zonal', 'Zones fragiles déclarées', '+8 par zone', "Renseignées dans ton profil. Elles amplifient aussi légèrement le score systémique."],
];

// ── FEUILLE 3 : le vocabulaire ──────────────────────────────────────────────
const LEXIQUE = [
  ['Score de décharge', "Un nombre de *0 à 100* qui résume ta fatigue accumulée. Calcul : *systémique + (zonal ÷ 2)*, plafonné à 100. Le zonal compte pour moitié parce qu'une fatigue localisée n'empêche pas d'entraîner le reste du corps."],
  ['Systémique / Zonal', "*Systémique* = fatigue générale, tout le corps (sommeil, système nerveux, fatigue globale). *Zonal* = fatigue localisée sur certains muscles. La distinction décide du type de décharge : complète, ou ciblée sur quelques muscles seulement."],
  ['SRA', "*Stimulus, Récupération, Adaptation.* Le muscle progresse pendant la récupération, pas pendant la séance. Retravailler trop tôt interrompt l'adaptation. Délais retenus : *72 h* en force, *48 h* en hypertrophie, *24 h* en endurance."],
  ['RIR', "*Répétitions en réserve.* Ce qu'il te restait en fin de série. RIR 2 = tu aurais pu en faire 2 de plus. RIR 0 = échec. Plus le RIR baisse à charge égale, plus tu forces pour le même résultat."],
  ['MEV / MAV / MRV', "Les trois repères de volume. *MEV* = minimum pour progresser. *MAV* = volume optimal, là où le rapport résultat/fatigue est le meilleur. *MRV* = maximum récupérable, au-delà duquel tu accumules plus de fatigue que d'adaptation. Un cycle monte progressivement de MEV vers MRV."],
  ['Programme en boucle', "*Tous* les programmes tournent maintenant en boucle : ils n'ont pas de date de fin, et l'app maintient en permanence une vingtaine de semaines de séances d'avance. Il n'y a donc plus ni « fin de cycle » à annoncer, ni durée à choisir."],
  ['Mésocycle', "Un bloc d'entraînement de plusieurs semaines qui monte en volume, puis se conclut par une décharge. *Ce découpage n'existe plus dans l'app* : le programme ne s'arrête pas, et c'est la fatigue mesurée qui déclenche les décharges, pas le calendrier."],
  ['Décharge', "Une période allégée destinée à laisser la fatigue redescendre. *Le volume baisse, les charges restent identiques* : c'est le volume qui fatigue, la charge qui maintient l'adaptation.\n\nL'app *date* chaque décharge que tu appliques. C'est ce qui permet au compteur « semaines sans décharge » de repartir de zéro. Attention : cette date est stockée *sur cet appareil uniquement* — sur un autre téléphone, le compteur repart de la création du programme."],
  ['Check-in', "Les deux questions posées après une séance et le lendemain : comment tu as dormi, et si tu te sens raide. Elles alimentent les signaux *sommeil dégradé* et *raideur post-séance*."],
  ['Pourquoi je ne vois aucune alerte', "*Un compte neuf n'en affiche jamais.* Presque toutes les règles exigent des séances complétées avec la fatigue renseignée, ou des séries enregistrées. « Tout va bien » ne veut pas dire « tout est vérifié » — ça veut dire qu'il n'y a pas encore de quoi juger."],
];

// ── FEUILLE 4 : ce qui a été retiré, et pourquoi ────────────────────────────
const RETIRES = [
  ['Fin de cycle', "« Ton cycle se termine dans N jours — repartir sur 4 nouvelles semaines ? »",
   "*Plus aucun programme ne se termine.* Tous sont créés sur 52 semaines et l'app garde une vingtaine de semaines de séances d'avance ; la dernière séance planifiée n'est donc jamais à moins de 7 jours. Le *sélecteur de durée du cycle*, dernier moyen de créer un programme avec une date de fin, a été retiré en même temps."],

  ['Phase MRV déconseillée pour un débutant', "« Rester en MAV pour progresser en sécurité. »",
   "*Ne pouvait pas s'afficher.* Deux raisons cumulées : la phase du programme est fixée à *MEV* à sa création et n'est modifiée nulle part ensuite, donc elle n'atteignait jamais MRV ; et le *niveau n'était pas transmis* à la règle, qui traitait donc tout le monde comme intermédiaire. La protection du débutant avait été écrite mais jamais branchée."],

  ['Régression de performance', "« Rester en phase actuelle avant de progresser. »",
   "*Ne pouvait pas s'afficher* : la condition exigeait une phase différente de MEV, or la phase vaut toujours MEV.\n\n*La régression reste surveillée* — elle continue d'alimenter le score de décharge, à hauteur de *+20 points* (voir la feuille « Score de décharge »). Rien n'est perdu, c'est le doublon inerte qui disparaît."],

  ['Fatigue trop élevée pour passer en MRV', "« Effectuer une décharge d'abord. »",
   "*Ne pouvait pas s'afficher* : la condition exigeait la phase MAV, jamais atteinte. Une fatigue élevée reste évidemment traitée — c'est le cœur du score de décharge (*+40* à *+55* points selon l'intensité)."],

  ['Fin de mésocycle atteinte (signal, +15)', "Signal du score de décharge, pas une alerte visible.",
   "Il valait « semaine actuelle ≥ durée prévue », soit *52 semaines* pour un programme en boucle : jamais avant un an, puis vrai définitivement. Un programme sans fin n'a pas de fin de mésocycle."],

  ['Conflits de récupération (SRA)', "« N conflits SRA — récupération insuffisante sur … » (+ un signal de *+12* au score)",
   "*Ne s'est jamais affichée* : la règle comparait les muscles de deux séances avec `includes` sur des OBJETS, donc par référence — le recouvrement était toujours vide.\n\nMais la vraie raison de l'abandonner est ailleurs. *L'espacement des séances est décidé à la génération*, et tu ne peux pas déplacer une séance : changer tes disponibilités régénère le programme. L'alerte ne pouvait donc reprocher qu'une chose — avoir fait ses séances en retard ou dans le désordre. Ça ne se règle pas par une alerte hebdomadaire mais en demandant au *coach*, qui a tout l'historique pour répondre au cas par cas.\n\n*La règle elle-même n'est pas perdue* : `SRA_WINDOWS` sert toujours au générateur, qui refuse d'ajouter un exercice sollicitant un muscle encore en récupération. Elle agit en amont, pour construire un programme juste."],
];

// ── Assemblage du document ──────────────────────────────────────────────────
const LARGEURS = {
  alertes: ['5.5cm', '13cm', '9cm', '7cm'],
  signaux: ['3cm', '7.5cm', '2.5cm', '14cm'],
  lexique: ['5cm', '20cm'],
  retires: ['6cm', '9cm', '17cm'],
};
const styleCol = (largeurs, prefixe) => largeurs.map((l, i) =>
  `<style:style style:name="${prefixe}${i}" style:family="table-column"><style:table-column-properties style:column-width="${l}"/></style:style>`).join('');

// Chaque feuille a ses propres largeurs : on préfixe les noms de colonnes pour
// qu'elles ne se marchent pas dessus.
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
 ${styleCol(LARGEURS.alertes, 'a')}
 ${styleCol(LARGEURS.signaux, 's')}
 ${styleCol(LARGEURS.lexique, 'l')}
 ${styleCol(LARGEURS.retires, 'r')}
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
${feuille('Alertes', 'a', LARGEURS.alertes,
  ['Alerte', 'Pourquoi elle apparaît', 'Ce qui la fait disparaître', 'Ce qu\'il faut comme données'], ALERTES)}
${feuille('Score de décharge', 's', LARGEURS.signaux,
  ['Nature', 'Signal', 'Points', 'Ce que ça veut dire'], SIGNAUX)}
${feuille('Vocabulaire', 'l', LARGEURS.lexique, ['Terme', 'Définition'], LEXIQUE)}
${feuille('Retiré', 'r', LARGEURS.retires, ['Ce qui a disparu', 'Le message qu\'elle affichait', 'Pourquoi'], RETIRES)}
</office:spreadsheet></office:body></office:document>`;

const sortie = path.join(ICI, 'alertes-accueil.fods');
fs.writeFileSync(sortie, doc, 'utf8');
console.log(`✓ ${sortie}`);
console.log(`  feuille 1 « Alertes »           : ${ALERTES.length} lignes`);
console.log(`  feuille 2 « Score de décharge » : ${SIGNAUX.length} lignes`);
console.log(`  feuille 3 « Vocabulaire »       : ${LEXIQUE.length} lignes`);
console.log(`  feuille 4 « Retiré »            : ${RETIRES.length} lignes`);
