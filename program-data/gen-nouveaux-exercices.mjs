// Génère program-data/nouveaux-exercices-proposes.csv à partir des deux tableaux
// de substitution remplis par Lucas.
//
// Principe posé : les remplaçants n'exigent AUCUN matériel. Le sac lesté, les
// chaises, le lit, le dessous d'escalier ne sont pas du matériel suivi — ils
// vivent dans la consigne, comme une variable de progression. Conséquence : quel
// que soit l'équipement déclaré, un repli existe toujours.
//
// Pour chaque exercice à créer, on hérite du mouvement REMPLACÉ : muscle, type
// (poly/iso), bloc. Les NIVEAUX, eux, ne s'héritent pas : voir la règle plus bas
// (le sac est une charge réglable, donc les trois niveaux, sauf quand c'est le
// mouvement lui-même qui bloque).
import fs from 'node:fs';
import path from 'node:path';
import { EXERCISES } from '../src/lib/exercise-database.js';

const ICI = path.join(process.cwd(), 'program-data');
const FR = { beginner: 'déb.', intermediate: 'inter.', advanced: 'avancé' };
const nivFr = (l) => (l || []).map((x) => FR[x] || x).join(' ');
const norm = (s) => String(s).trim().toLowerCase().replace(/\s+/g, ' ');
// On IGNORE les entrées déjà générées (drapeau fallback) : sinon, au deuxième
// passage, elles seraient prises pour des exercices préexistants, ne seraient
// plus proposées à la création, et le bloc généré les perdrait. La chaîne doit
// rester ré-exécutable à l'identique.
const byName = new Map(EXERCISES.filter((e) => !e.fallback).map((e) => [e.name.toLowerCase(), e]));

function parseCsv(txt, sep) {
  const rows = []; let row = [], champ = '', q = false;
  for (let i = 0; i < txt.length; i++) {
    const c = txt[i];
    if (q) { if (c === '"' && txt[i + 1] === '"') { champ += '"'; i++; } else if (c === '"') q = false; else champ += c; }
    else if (c === '"') q = true;
    else if (c === sep) { row.push(champ); champ = ''; }
    else if (c === '\n') { row.push(champ); rows.push(row); row = []; champ = ''; }
    else if (c !== '\r') champ += c;
  }
  if (champ || row.length) { row.push(champ); rows.push(row); }
  return rows.filter((r) => r.some((x) => x.trim()));
}

// Noms propres proposés (les saisies contiennent des fautes et des abréviations
// qui deviendraient visibles par l'utilisateur). L'orthographe d'origine reste
// dans le fichier pour relecture.
const NOM_PROPRE = {
  'curl avec sac': 'Curl avec sac',
  'curl sac': 'Curl avec sac',
  'curl sac alterné': 'Curl avec sac alterné',
  'curl marteau avec sac': 'Curl marteau avec sac',
  'curl incliné chaise': 'Curl incliné sur chaise avec sac',
  'pullover sac à dos': 'Pullover avec sac',
  'pull over': 'Pullover avec sac',
  'tirage bucheron avec sac': 'Rowing bûcheron avec sac',
  'rowing sac': 'Rowing avec sac',
  'rowing unilatéral': 'Rowing unilatéral avec sac',
  'traction pronation (sans matos)': 'Traction pronation (barre de fortune)',
  'traction supination (sans matos)': 'Traction supination (barre de fortune)',
  'ponty fessier au sol avec sac ou unilatéral': 'Pont fessier avec sac ou unilatéral',
  'pont fessier au sol avec sac ou unilatéral': 'Pont fessier avec sac ou unilatéral',
  'abducteur allongé': 'Abduction de hanche allongé sur le côté',
  'good morning avec sac': 'Good morning avec sac',
  'soulevé de terre avec sac': 'Soulevé de terre avec sac',
  'soulevé de terre roumain sac': 'Soulevé de terre roumain avec sac',
  'leg curl allongé sur le sol': 'Leg curl au sol avec sac',
  'molet unilatérale lesté avec sac a dos': 'Mollets unilatéraux avec sac',
  'pompe large': 'Pompe large',
  'pompe sur élevé': 'Pompe pieds surélevés (chaise)',
  'pompe large sur élevé': 'Pompe large pieds surélevés (chaise)',
  'pompe pieds surélevé': 'Pompe pieds surélevés (chaise)',
  'dips entre 2 chaises': 'Dips entre deux chaises',
  'fentes bulgare': 'Fente bulgare (chaise)',
  'fentes marché': 'Fente marchée avec sac',
  'squat sac': 'Squat avec sac',
  'front squat sac': 'Front squat avec sac',
  'leg extension': 'Leg extension assis avec sac',
  'extension triceps sac': 'Extension triceps avec sac',
  'extension triceps derriere la tete': 'Extension triceps nuque avec sac',
  'skull crusher sac': 'Skull crusher avec sac',
  'élévation latéral': 'Élévations latérales avec sac ou bouteilles',
  'oiseau': 'Oiseau avec sac ou bouteilles',
  'face pull': 'Face pull avec sac',
  'hand stand push up': 'Handstand push-up contre un mur',
  'relevés de jambes allongé sur le dos': 'Relevés de jambes au sol',
  'l sit (sur le sol)': 'L-sit au sol',
  'crunch': 'Crunch lesté',
  'crunch bras tendu au desuss de la tete': 'Crunch bras tendus au-dessus de la tête',
};

// RÈGLE DE NIVEAU. Le sac lesté est une variable de CHARGE, pas un exercice
// différent : un débutant met peu, un avancé remplit. Un exercice lesté est donc
// accessible aux trois niveaux, exactement comme un mouvement à la barre en
// salle. On n'hérite plus des niveaux du mouvement remplacé — ceux-là reflètent
// la technique de la barre ou de la machine, pas celle du remplaçant.
const TOUS_NIVEAUX = ['beginner', 'intermediate', 'advanced'];

// Exceptions : quand c'est le MOUVEMENT qui bloque et non la charge. Alléger un
// handstand push-up ou un L-sit, ça n'existe pas.
const NIVEAU_FORCE = {
  'Handstand push-up contre un mur': {
    niveaux: ['advanced'],
    raison: 'le mouvement lui-même bloque, pas la charge — pour déb./inter. le repli est « Pompes piquées », qui existe déjà',
  },
  'L-sit au sol': {
    niveaux: ['advanced'],
    raison: 'le mouvement lui-même bloque, pas la charge',
  },
  'Traction pronation (barre de fortune)': {
    niveaux: TOUS_NIVEAUX,
    raison: 'accessible à un débutant avec un pied posé sur une chaise pour s\'aider (voir consigne)',
  },
  'Traction supination (barre de fortune)': {
    niveaux: TOUS_NIVEAUX,
    raison: 'idem pronation — assistance d\'un pied sur une chaise',
  },
};

// Un même remplaçant peut devenir DEUX exercices distincts quand l'exécution
// change le muscle visé. Les dips en sont le cas type : buste penché en avant,
// ce sont les pectoraux ; buste droit, ce sont les triceps. On sépare donc selon
// le muscle de l'exercice remplacé.
const SPLIT_PAR_MUSCLE = {
  'Dips entre deux chaises': {
    Poitrine: 'Dips entre deux chaises (buste penché)',
    Triceps: 'Dips entre deux chaises (buste droit)',
  },
};

// Type corrigé quand l'héritage se trompe.
const TYPE_FORCE = {
  // Hérite de la roulette abdominale (poly) — un crunch reste une isolation.
  'Crunch bras tendus au-dessus de la tête': 'isolation',
  // Hérite de l'écarté poulie et du pec deck (isolations). Mais une pompe est un
  // mouvement polyarticulaire. Conséquence assumée : sans matériel il n'existe
  // aucune isolation pectoraux, le créneau devient donc un composé.
  'Pompe large': 'compound',
};

// Bloc imposé quand le remplaçant hérite de plusieurs blocs à la fois.
const BLOC_FORCE = {
  'Curl avec sac': 'C',                              // isolation bras → bloc C
  'Dips entre deux chaises (buste penché)': 'B',     // accessoire, pas un lift principal
  'Pompe pieds surélevés (chaise)': 'B',
};

// Muscles imposés quand l'héritage mélange deux exercices de cibles différentes.
const MUSCLE_FORCE = {
  // La consigne vise explicitement les grands dorsaux : les pectoraux ne doivent
  // pas compter comme volume principal.
  'Pullover avec sac': { primaires: ['Dos'], secondaires: ['Pectoraux', 'Triceps', 'Abdominaux'] },
  // Hérite de deux isolations sans secondaires : une pompe sollicite bien plus.
  'Pompe large': { primaires: ['Poitrine'], secondaires: ['Triceps', 'Épaules'] },
};

// Consignes RÉÉCRITES. La saisie d'origine reste dans les tableaux de
// substitution ; ce qui est repris ici, c'est le sens, en français lisible —
// ces phrases s'affichent à l'utilisateur pendant sa séance.
const CONSIGNE_PROPRE = {
  'Crunch bras tendus au-dessus de la tête': 'Bras tendus au-dessus de la tête, décolle les omoplates sans tirer sur la nuque. Trop facile ? Tiens un sac chargé entre les mains.',
  'L-sit au sol': 'Assis au sol, mains à plat de chaque côté des hanches, décolle le bassin et tends les jambes à l\'horizontale. Garde la position.',
  'Relevés de jambes au sol': 'Allongé sur le dos, mains sous les fesses, monte les jambes tendues sans décoller le bas du dos. Trop facile ? Serre un sac chargé entre les pieds.',
  'Abduction de hanche allongé sur le côté': 'Allongé sur le côté, monte la jambe du dessus tendue, contrôle la descente. Trop facile ? Pose un sac chargé sur la cuisse.',
  'Curl avec sac': 'Prends un sac par les poignées, paumes vers le haut (supination), et remplis-le au poids voulu. Coudes fixes le long du corps.',
  'Curl avec sac alterné': 'Un sac dans chaque main en supination, un bras après l\'autre. Coudes fixes le long du corps.',
  'Curl incliné sur chaise avec sac': 'Assis au bord de la chaise, haut du dos contre le dossier, bras qui pendent le long du dossier. Curl en gardant les coudes en arrière — c\'est cet étirement qui fait l\'exercice.',
  'Curl marteau avec sac': 'Prends le sac par les poignées, pouces vers le haut (prise neutre), et remplis-le au poids voulu.',
  'Rowing avec sac': 'Buste penché à environ 45°, dos plat, un sac chargé dans chaque main. Tire les coudes vers les hanches.',
  'Rowing bûcheron avec sac': 'Un genou et une main en appui sur une chaise, l\'autre main tient le sac. Tire le coude le long du corps, sans tourner le buste.',
  'Rowing unilatéral avec sac': 'Buste penché, une main en appui, l\'autre tient le sac. Tire le coude vers la hanche.',
  'Traction pronation (barre de fortune)': 'Une barre solide suffit : dessous d\'escalier, barre de but, structure fixe. Paumes vers l\'avant. Débutant : pose un pied sur une chaise pour t\'aider, et retire de l\'aide au fil des semaines. Avancé : sac à dos chargé. Évite les huisseries de porte, elles ne sont pas prévues pour supporter un corps.',
  'Traction supination (barre de fortune)': 'Même chose en prise supination, paumes vers toi — les biceps travaillent davantage. Débutant : un pied sur une chaise pour t\'aider. Évite les huisseries de porte.',
  'Soulevé de terre avec sac': 'Un sac chargé dans chaque main, le long des jambes. Dos plat, pousse dans le sol avec les jambes et termine hanches tendues.',
  'Pullover avec sac': 'Allongé en travers d\'un lit ou d\'une chaise, tout le dos en appui. Un sac tenu à deux mains, bras légèrement fléchis (15-20°) et cet angle ne bouge plus. Descends jusqu\'à sentir l\'étirement des dorsaux, puis ramène les coudes vers les hanches — ne pousse pas avec les bras. Arrête la montée quand les bras sont au-dessus de la poitrine.',
  'Élévations latérales avec sac ou bouteilles': 'Une bouteille d\'eau dans chaque main suffit — la charge utile est faible sur cet exercice. Monte les bras sur les côtés jusqu\'à l\'horizontale, coudes légèrement fléchis. Un sac tenu par la poignée quand les bouteilles deviennent trop légères.',
  'Handstand push-up contre un mur': 'En équilibre sur les mains, dos ou ventre au mur selon ce que tu maîtrises. Descends la tête vers le sol et repousse. À ne tenter qu\'une fois l\'équilibre au mur maîtrisé.',
  'Face pull avec sac': 'Buste penché en avant, un sac tenu à deux mains. Tire vers le visage en gardant les coudes hauts, écarte les mains en fin de mouvement.',
  'Oiseau avec sac ou bouteilles': 'Buste penché, bras tendus vers le sol, une bouteille ou un sac dans chaque main. Ouvre les bras sur les côtés sans hausser les épaules.',
  'Pont fessier avec sac ou unilatéral': 'Allongé sur le dos, pieds au sol, monte le bassin en serrant les fessiers. Pose un sac chargé sur les hanches, ou fais-le sur une seule jambe pour durcir.',
  'Leg curl au sol avec sac': 'À plat ventre, serre un sac chargé entre les pieds et ramène les talons vers les fesses.',
  'Good morning avec sac': 'Un sac chargé sur le haut du dos, dos plat, genoux légèrement fléchis. Pousse les hanches vers l\'arrière jusqu\'à sentir l\'étirement des ischios, puis reviens.',
  'Soulevé de terre roumain avec sac': 'Un sac chargé dans chaque main. Jambes quasi tendues, pousse les hanches vers l\'arrière en gardant le dos plat. Descends jusqu\'à l\'étirement des ischios, pas plus bas.',
  'Mollets unilatéraux avec sac': 'Sur une jambe, avant-pied sur une marche, monte le plus haut possible et contrôle la descente. Sac à dos chargé pour durcir.',
  'Mollets assis avec sac': "Assis sur une chaise, genoux fléchis à 90°, un sac chargé posé sur les cuisses juste au-dessus des genoux. Monte les talons le plus haut possible, descends en étirement complet. Genou fléchi = c'est le soléaire qui travaille, pas les jumeaux.",
  'Dips entre deux chaises (buste penché)': 'Mains sur deux chaises stables, buste penché en avant pour cibler les pectoraux. Pieds éloignés ou surélevés pour durcir, sac à dos chargé ensuite. Vérifie que les chaises ne peuvent pas glisser.',
  'Dips entre deux chaises (buste droit)': 'Mains sur deux chaises stables, buste droit et coudes serrés pour cibler les triceps. Pieds éloignés ou surélevés pour durcir, sac à dos chargé ensuite. Vérifie que les chaises ne peuvent pas glisser.',
  'Pompe large': 'Pompe mains nettement plus larges que les épaules : l\'amplitude se fait davantage sur les pectoraux. Sac à dos chargé si c\'est trop simple.',
  'Pompe large pieds surélevés (chaise)': 'Pompe large avec les pieds sur une chaise — plus les pieds sont hauts, plus le haut des pectoraux travaille. Sac à dos chargé ensuite.',
  'Pompe pieds surélevés (chaise)': 'Pompe classique avec les pieds sur une chaise. Sac à dos chargé si c\'est trop simple.',
  'Front squat avec sac': 'Un sac chargé tenu contre la poitrine, coudes hauts. Descends en gardant le buste droit.',
  'Leg extension assis avec sac': 'Assis sur une chaise, un sac chargé accroché aux pieds ou posé sur les chevilles. Tends les jambes, contrôle la descente.',
  'Fente bulgare (chaise)': 'Pied arrière posé sur une chaise, descends sur la jambe avant. Sac à dos chargé, ou un sac dans chaque main, pour ajouter du poids.',
  'Fente marchée avec sac': 'Sac à dos chargé, avance en fentes en alternant les jambes. Genou arrière proche du sol sans le toucher.',
  'Squat avec sac': 'Sac à dos chargé sur le dos, ou tenu contre la poitrine. Descends au moins jusqu\'aux cuisses parallèles, dos plat.',
  'Extension triceps avec sac': 'Un sac chargé tenu à deux mains derrière la nuque, coudes hauts et fixes. Tends les bras vers le haut.',
  'Extension triceps nuque avec sac': 'Assis sur une chaise, sac chargé derrière la nuque à deux mains. Coudes fixes, seuls les avant-bras bougent.',
  'Skull crusher avec sac': 'Allongé au bord d\'un lit ou d\'une chaise, sac chargé tenu à deux mains. Coudes fixes, descends le sac vers le front.',
  'Tirage australien': 'Sous une table solide ou une barre basse, corps gainé et incliné, pieds au sol. Tire la poitrine vers la barre. Plus les pieds sont loin — ou surélevés — plus c\'est dur. C\'est la marche avant la traction.',
};

// Consignes ajoutées par nous quand la progression ou la sécurité l'exige.
const CONSIGNE_SUP = {
  'Traction pronation (barre de fortune)': 'Débutant : pose un pied sur une chaise pour t\'aider, et retire de l\'aide au fil des semaines. Évite les huisseries de porte, qui ne sont pas prévues pour supporter un corps.',
  'Traction supination (barre de fortune)': 'Débutant : pose un pied sur une chaise pour t\'aider. Évite les huisseries de porte.',
  'Dips entre deux chaises (buste penché)': 'Buste penché en avant pour cibler les pectoraux. Vérifie que les chaises sont stables et ne peuvent pas glisser.',
  'Dips entre deux chaises (buste droit)': 'Buste droit, coudes serrés, pour cibler les triceps. Vérifie que les chaises sont stables et ne peuvent pas glisser.',
};

// Candidats SUPPLÉMENTAIRES, essayés après le remplaçant principal quand celui-ci
// ne couvre pas tous les niveaux de l'exercice remplacé. Le moteur retient le
// premier candidat adapté au niveau de l'utilisateur.
const CANDIDATS_SUP = {
  // Le handstand push-up est réservé aux avancés : déb./inter. retombent sur les
  // pompes piquées, qui existent déjà et visent le même muscle.
  'Développé militaire barre': ['Pompes piquées'],
  'Développé militaire haltères': ['Pompes piquées'],
};

// Variantes SUPPLÉMENTAIRES à créer.
const VARIANTES = [
  { nom: 'Tirage australien', muscle: 'Dos', secondaires: 'Biceps, Épaules', type: 'poly', bloc: 'B',
    niveaux: ['beginner'], remplace: 'Tirage vertical pronation (déb.)',
    consigne: 'Sous une table solide ou une barre basse, corps incliné et pieds au sol. Plus les pieds sont loin, plus c\'est dur.',
    pourquoi: 'entrée en matière du tirage pour un débutant' },
];

// Redirections : le remplaçant retenu n'est pas celui déduit des tableaux.
// L'exercice se crée alors tout seul, en héritant du mouvement remplacé — pas
// besoin de le décrire dans VARIANTES, ce serait un doublon.
const REDIRECTION = {
  // Sans matériel il n'existait qu'UN schéma moteur pour les mollets (debout,
  // genou tendu), décliné en deux entrées quasi identiques. Quand un objectif
  // demandait beaucoup de volume mollets, le moteur remplissait les deux puis
  // empilait le reste — jusqu'à 21 séries sur le même geste. La version assise
  // apporte un vrai second mouvement : genou fléchi, c'est le soléaire qui
  // travaille et non les jumeaux, exactement comme la machine mollets assis.
  'Mollets assis machine': 'Mollets assis avec sac',
};

// Entrées EXISTANTES dont il suffit d'élargir les niveaux : inutile de créer un
// « X lesté » quand le sac suffit à couvrir le haut de la plage.
const A_ELARGIR = [
  { nom: 'Pompe', ajouter: ['advanced'],
    pourquoi: 'un avancé charge simplement son sac à dos — pas besoin d\'une entrée séparée',
    consigne: 'Avancé : sac à dos chargé sur le haut du dos pour rester dans la plage de répétitions.' },
  { nom: 'Crunch au sol', ajouter: ['intermediate', 'advanced'],
    pourquoi: 'même logique que la pompe : le sac tenu dans les mains fait la charge',
    consigne: 'Inter./avancé : tiens un sac chargé contre la poitrine ou bras tendus derrière la tête.' },
];

// ── Lecture des deux tableaux ───────────────────────────────────────────────
const groupes = new Map(); // nom propre → { remplace[], consignes[], saisies:Set }
// Correspondance FINALE exercice d'origine → remplaçant retenu. C'est ici, et
// nulle part ailleurs, qu'on sait résoudre une saisie (« squat sac ») vers le
// nom propre (« Squat avec sac »), y compris les cas séparés par muscle (dips)
// et ceux qui pointent vers un exercice existant (« Crunch au sol »).
// gen-integration.mjs la relit pour construire la table de substitution.
const correspondances = {};
for (const f of ['substitutions-poids-du-corps.csv', 'substitutions-materiel.csv']) {
  const p = path.join(ICI, f);
  if (!fs.existsSync(p)) continue;
  const txt = fs.readFileSync(p, 'utf8').replace(/^﻿/, '');
  const sep = txt.split('\n')[0].includes(';') ? ';' : ',';
  for (const r of parseCsv(txt, sep).slice(1)) {
    const exo = r[1]?.trim(), sub = r[8]?.trim(), remarque = r[9]?.trim();
    if (!exo || !sub) continue;
    let propre = NOM_PROPRE[norm(sub)] || sub.trim();
    // « Crunch lesté » n'existe plus : le sac est une charge, on élargit
    // « Crunch au sol » (voir A_ELARGIR) au lieu de créer une entrée.
    if (propre === 'Crunch lesté') propre = 'Crunch au sol';
    // Séparation selon le muscle visé (dips penché / droit).
    const split = SPLIT_PAR_MUSCLE[propre];
    if (split) {
      const m = byName.get(norm(exo))?.muscles?.primary?.[0];
      if (split[m]) propre = split[m];
    }
    if (REDIRECTION[exo]) propre = REDIRECTION[exo];
    // Canonisation : une saisie « pompe » doit pointer sur l'entrée exacte
    // « Pompe » de la base, sinon la substitution vise un exercice inexistant.
    const existant = byName.get(norm(propre));
    if (existant) propre = existant.name;
    correspondances[exo] = [...new Set([propre, ...(CANDIDATS_SUP[exo] || [])])];
    if (existant) continue; // pointe sur un exercice déjà présent : rien à créer
    const g = groupes.get(propre) || { remplace: [], consignes: [], saisies: new Set() };
    g.remplace.push(exo);
    g.saisies.add(sub.trim());
    if (remarque) g.consignes.push(remarque.replace(/\s*\n\s*/g, ' '));
    groupes.set(propre, g);
  }
}

// ── Construction des propositions ───────────────────────────────────────────
const lignes = [];
for (const [nom, g] of groupes) {
  const sources = g.remplace.map((n) => byName.get(norm(n))).filter(Boolean);
  // On hérite de TOUTE la liste des muscles primaires, pas seulement du premier :
  // le soulevé de terre est d'abord un exercice de dos, mais les ischios suivent
  // de très près — perdre cette information fausserait le calcul de volume.
  const muscles = [...new Set(sources.flatMap((e) => e.muscles?.primary || []).filter(Boolean))];
  const secondaires = [...new Set(sources.flatMap((e) => e.muscles?.secondary || []))];
  const types = [...new Set(sources.map((e) => e.type))];
  const blocs = [...new Set(sources.map((e) => e.block).filter(Boolean))].sort();
  const niveauxUnion = ['beginner', 'intermediate', 'advanced']
    .filter((l) => sources.some((e) => (e.level || []).includes(l)));
  const forcage = NIVEAU_FORCE[nom];
  // Consigne réécrite si on en a une, sinon la saisie brute (à nettoyer).
  const consignes = CONSIGNE_PROPRE[nom] ? [CONSIGNE_PROPRE[nom]] : [...new Set(g.consignes)];
  if (!CONSIGNE_PROPRE[nom] && CONSIGNE_SUP[nom]) consignes.push(CONSIGNE_SUP[nom]);
  const force = MUSCLE_FORCE[nom];
  const primaires = force ? force.primaires : muscles;
  // Un muscle ne peut pas être à la fois primaire et secondaire.
  const secondairesNets = (force ? force.secondaires : secondaires)
    .filter((m) => !primaires.includes(m));
  lignes.push({
    nom,
    saisie: [...g.saisies].join(' / '),
    muscle: primaires.join(', ') || '?',
    secondaires: secondairesNets.join(', ') || '—',
    type: TYPE_FORCE[nom]
      ? (TYPE_FORCE[nom] === 'compound' ? 'poly' : 'iso')
      : (types.length === 1 ? (types[0] === 'compound' ? 'poly' : 'iso') : types.join('/')),
    bloc: BLOC_FORCE[nom] || blocs.join('/') || 'C',
    niveaux: nivFr(forcage ? forcage.niveaux : TOUS_NIVEAUX),
    niveauxHerites: nivFr(niveauxUnion),
    correction: forcage ? forcage.raison
      : (niveauxUnion.length < 3 ? 'charge réglable par le sac → accessible aux trois niveaux' : ''),
    remplace: g.remplace.join(' · '),
    consigne: consignes.join(' | '),
  });
}
lignes.sort((a, b) => a.muscle.localeCompare(b.muscle) || a.nom.localeCompare(b.nom));

// ── Écriture ────────────────────────────────────────────────────────────────
const csvChamp = (v) => {
  const s = String(v ?? '');
  return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const enTetes = ['Muscle', 'Nom proposé', 'Ce que tu avais écrit', 'Type', 'Bloc',
  'Niveaux proposés', 'Niveaux hérités', 'Pourquoi ce niveau a été corrigé',
  'Muscles secondaires', 'Matériel', 'Remplace', 'Consigne (ta remarque)', 'À CORRIGER'];
const csv = [enTetes.map(csvChamp).join(';')];
for (const l of lignes) {
  csv.push([l.muscle, l.nom, l.saisie, l.type, l.bloc, l.niveaux, l.niveauxHerites,
    l.correction, l.secondaires, 'aucun', l.remplace, l.consigne, ''].map(csvChamp).join(';'));
}
for (const v of VARIANTES) {
  csv.push([v.muscle, v.nom, '(ajout proposé)', v.type, v.bloc, nivFr(v.niveaux), '—',
    v.pourquoi, v.secondaires, 'aucun', v.remplace, v.consigne, ''].map(csvChamp).join(';'));
}
for (const e of A_ELARGIR) {
  const src = byName.get(norm(e.nom));
  const nouveaux = [...new Set([...(src?.level || []), ...e.ajouter])];
  csv.push([src?.muscles?.primary?.[0] || '?', e.nom, '(entrée EXISTANTE à élargir)',
    src?.type === 'compound' ? 'poly' : 'iso', src?.block || 'C',
    nivFr(['beginner', 'intermediate', 'advanced'].filter((l) => nouveaux.includes(l))),
    nivFr(src?.level), e.pourquoi, (src?.muscles?.secondary || []).join(', ') || '—',
    'aucun', '(on ne crée rien, on élargit les niveaux)', e.consigne, ''].map(csvChamp).join(';'));
}

const sortie = path.join(ICI, 'nouveaux-exercices-proposes.csv');
fs.writeFileSync(sortie, '﻿' + csv.join('\r\n') + '\r\n', 'utf8');
console.log(`✓ ${sortie}`);

const sortieMap = path.join(ICI, '_correspondances-substitutions.json');
fs.writeFileSync(sortieMap, JSON.stringify(correspondances, null, 2) + '\n', 'utf8');
console.log(`✓ ${sortieMap} (${Object.keys(correspondances).length} correspondances)`);
console.log(`  ${lignes.length} exercices déduits de tes substitutions`);
console.log(`  + ${VARIANTES.length} variante(s) ajoutée(s) · ${A_ELARGIR.length} entrée(s) existante(s) à élargir`);
console.log(`  = ${lignes.length + VARIANTES.length + A_ELARGIR.length} lignes à relire`);
const sansMuscle = lignes.filter((l) => l.muscle === '?');
if (sansMuscle.length) console.log(`  ⚠ ${sansMuscle.length} sans muscle : ${sansMuscle.map((l) => l.nom).join(', ')}`);
