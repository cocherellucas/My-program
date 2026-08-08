// Ajoute une consigne d'exécution (champ `cue`) aux exercices du catalogue qui
// n'en ont pas. Les exercices de repli en ont déjà une, écrite avec Lucas.
//
// Format : mise en place, point d'exécution clé, erreur courante à éviter.
// Une à deux phrases — ça s'affiche derrière le « ? » pendant la séance, pas
// dans un manuel.
//
// IDEMPOTENT : n'écrit que sur les entrées dépourvues de `cue`.
import fs from 'node:fs';
import path from 'node:path';
import { EXERCISES } from '../src/lib/exercise-database.js';

const DB = path.join(process.cwd(), 'src', 'lib', 'exercise-database.js');

const CONSIGNES = {
  // ── Abdominaux ────────────────────────────────────────────────────────────
  'Crunch au sol': "Allongé sur le dos, genoux fléchis. Décolle les omoplates en enroulant le buste, sans tirer sur la nuque. Inter./avancé : tiens un sac chargé contre la poitrine ou bras tendus derrière la tête.",
  'Crunch câble': "À genoux face à la poulie haute, corde derrière la nuque. Enroule le buste vers les cuisses en gardant les hanches fixes — ce sont les abdos qui tirent, pas les bras.",
  'Crunch machine': "Dos bien calé, poignées au niveau des épaules. Enroule le buste et contrôle le retour sans laisser la charge te tirer.",
  'L-sit': "Aux barres parallèles, bras tendus, épaules basses. Décolle le bassin et tends les jambes à l'horizontale, puis tiens la position.",
  'Planche': "Appui sur les avant-bras et les pointes de pieds, corps aligné des talons à la tête. Serre les fessiers et rentre le bassin — pas de dos creux.",
  'Relevés de jambes suspendu': "Suspendu à la barre, monte les jambes tendues sans balancer. Enroule le bassin en fin de montée : c'est là que les abdos travaillent vraiment.",
  'Roulette abdominale': "À genoux, déroule la roulette vers l'avant en gardant le bas du dos plat. Ne va que jusqu'où tu peux revenir sans creuser.",

  // ── Abducteurs ────────────────────────────────────────────────────────────
  'Abducteur machine': "Assis, dos calé, écarte les genoux contre la résistance et contrôle le retour. Ne t'aide pas avec le buste.",

  // ── Biceps ────────────────────────────────────────────────────────────────
  'Curl aux anneaux': "Anneaux réglés bas, corps incliné en arrière, paumes vers toi. Fléchis les coudes pour amener les mains vers le front, coudes hauts et fixes.",
  'Curl barre EZ': "Coudes fixes le long du corps, monte la barre sans balancer le buste. La prise coudée de l'EZ ménage les poignets.",
  'Curl élastique': "Pieds sur l'élastique, coudes fixes le long du corps. La résistance augmente en fin de montée : ralentis la descente.",
  'Curl haltères alternés': "Un bras après l'autre, coudes fixes le long du corps. Tourne progressivement la paume vers le haut en montant.",
  'Curl incliné haltères': "Assis sur un banc incliné, bras qui pendent en arrière du buste. C'est cet étirement de départ qui fait l'exercice — n'avance pas les coudes pour tricher.",
  'Curl marteau': "Prise neutre, pouces vers le haut, coudes fixes. Travaille aussi le brachial et l'avant-bras.",

  // ── Dos ───────────────────────────────────────────────────────────────────
  'Pull-over poulie': "Face à la poulie haute, bras légèrement fléchis et cet angle ne bouge plus. Ramène vers les cuisses en pensant aux coudes, pas aux mains.",
  'Rowing barre': "Buste penché à environ 45°, dos plat. Tire la barre vers le nombril, coudes le long du corps, sans à-coup des lombaires.",
  'Rowing haltère unilatéral': "Un genou et une main sur le banc, dos plat. Tire l'haltère vers la hanche sans tourner le buste.",
  'Rowing TRX': "Corps gainé et incliné, bras tendus. Tire la poitrine vers les mains ; plus les pieds sont avancés, plus c'est dur.",
  'Soulevé de terre': "Barre contre les tibias, dos plat, épaules au-dessus de la barre. Pousse dans le sol avec les jambes et termine hanches tendues, sans partir en arrière.",
  'Tirage poulie bras tendus': "Bras quasi tendus, angle des coudes fixe du début à la fin. Ramène la barre vers les cuisses par les dorsaux, pas par les triceps.",
  'Tirage vertical pronation': "Prise large, sors la poitrine et tire la barre vers le haut du torse. Remonte sans lâcher la tension.",
  'Traction pronation': "Paumes vers l'avant. Monte jusqu'à passer le menton au-dessus de la barre, redescends bras complètement tendus.",
  'Traction supination (chin-up)': "Paumes vers toi, mains largeur d'épaules. Les biceps participent davantage qu'en pronation.",

  // ── Épaules ───────────────────────────────────────────────────────────────
  'Développé militaire barre': "Debout, gainage serré, fessiers contractés. Pousse la barre à la verticale au-dessus de la tête en rentrant légèrement la tête au passage. Ne cambre pas le bas du dos.",
  'Développé militaire haltères': "Haltères au niveau des oreilles, pousse à la verticale. Gainage serré, pas de cambrure lombaire.",
  'Élévations latérales câble': "Poulie basse, monte le bras sur le côté jusqu'à l'horizontale. Coude légèrement fléchi, sans hausser l'épaule.",
  'Élévations latérales haltères': "Monte les bras sur les côtés jusqu'à l'horizontale, coudes légèrement fléchis. Charge légère — c'est un petit muscle, l'élan ne sert à rien.",
  'Face pull câble': "Corde à hauteur du visage. Tire vers le front en écartant les mains, coudes hauts et épaules basses.",
  'Oiseau haltères (deltoïde postérieur)': "Buste penché, bras tendus vers le sol. Ouvre les bras sur les côtés sans hausser les épaules.",
  'Pompes piquées': "Pompe en position pliée, bassin haut, mains sous les épaules. Descends le sommet du crâne vers le sol — c'est la marche avant le handstand push-up.",

  // ── Fessiers ──────────────────────────────────────────────────────────────
  'Hip thrust barre': "Haut du dos contre le banc, barre sur les hanches avec un coussin. Monte jusqu'à l'alignement genoux-hanches-épaules, menton rentré, et serre en haut.",
  'Hip thrust machine': "Dos calé, pousse le coussin par les hanches. Marque un temps d'arrêt en haut en serrant les fessiers.",
  'Pont fessier au sol': "Allongé sur le dos, pieds au sol près des fessiers. Monte le bassin en serrant les fessiers, sans creuser le bas du dos en haut.",

  // ── Ischio-jambiers ───────────────────────────────────────────────────────
  'Good morning': "Barre sur le haut du dos, genoux légèrement fléchis, dos plat. Pousse les hanches vers l'arrière jusqu'à l'étirement des ischios. Charge modérée, c'est un exercice technique.",
  'Leg curl allongé': "À plat ventre, ramène les talons vers les fessiers sans décoller les hanches du support.",
  'Leg curl assis': "Dos calé, ramène les talons sous le siège et contrôle le retour sans relâcher d'un coup.",
  'Nordic curl': "À genoux, chevilles bloquées. Descends le buste vers l'avant en résistant le plus longtemps possible, puis rattrape-toi sur les mains.",
  'Soulevé de terre roumain barre': "Jambes quasi tendues, pousse les hanches vers l'arrière en gardant la barre proche des jambes. Descends jusqu'à l'étirement des ischios, pas plus bas.",

  // ── Mollets ───────────────────────────────────────────────────────────────
  'Mollets assis machine': "Genoux fléchis à 90°, monte le plus haut possible et descends en étirement complet. Genou fléchi = c'est le soléaire qui travaille.",
  'Mollets debout machine': "Jambes tendues, amplitude complète, temps de pause en haut de chaque répétition.",
  'Mollets leg press': "Avant-pieds sur le bas du plateau. Pousse par les orteils sans déverrouiller les genoux.",
  'Mollets lestés une jambe': "Sur une jambe, avant-pied sur une marche, gilet ou ceinture de lest. Amplitude complète, contrôle la descente.",
  'Mollets unilatéraux poids du corps': "Sur une jambe, avant-pied sur une marche. Monte le plus haut possible et contrôle la descente jusqu'à l'étirement.",

  // ── Poitrine ──────────────────────────────────────────────────────────────
  'Développé couché barre': "Omoplates serrées et fixées sur le banc, pieds au sol. Descends la barre au niveau des tétons, coudes à environ 45° du corps.",
  'Développé couché haltères': "Omoplates serrées, descends jusqu'à l'étirement des pectoraux. L'amplitude est plus grande qu'à la barre, profites-en.",
  'Développé incliné barre': "Banc à 30°, pas plus : au-delà, ce sont les épaules qui prennent le travail. Descends la barre haut sur la poitrine.",
  'Développé incliné haltères': "Banc à 30°, descends jusqu'à l'étirement. Ne cogne pas les haltères en haut, garde la tension.",
  'Dips (poitrine)': "Buste penché en avant, coudes légèrement écartés. Descends jusqu'à l'étirement des pectoraux sans forcer sur l'épaule.",
  'Dips lestés aux barres parallèles': "Ceinture de lest, buste penché en avant. Contrôle la descente, pas de rebond en bas.",
  'Écarté incliné haltères': "Bras légèrement fléchis, angle fixe du début à la fin. Ouvre jusqu'à l'étirement, referme sans laisser les haltères se toucher.",
  'Écarté poulie': "Bras quasi tendus, angle des coudes fixe. Rapproche les mains devant toi et marque un temps au centre.",
  'Pec deck': "Dos calé, coudes à hauteur d'épaules. Referme lentement et marque un temps d'arrêt au centre.",
  'Pompe': "Corps gainé et aligné, mains largeur d'épaules. Descends la poitrine près du sol. Avancé : sac à dos chargé sur le haut du dos pour rester dans la plage de répétitions.",
  'Pompe pieds surélevés': "Pieds sur un banc ou une chaise — plus ils sont hauts, plus le haut des pectoraux travaille.",

  // ── Quadriceps ────────────────────────────────────────────────────────────
  'Fente bulgare haltères': "Pied arrière sur un banc, descends sur la jambe avant. Buste légèrement penché pour plus de fessiers, droit pour plus de quadriceps.",
  'Fente marchée haltères': "Avance en fentes en alternant les jambes, genou arrière proche du sol. Grand pas = fessiers, petit pas = quadriceps.",
  'Front squat barre': "Barre sur les deltoïdes avant, coudes hauts. Le buste reste droit — c'est ce qui cible les quadriceps.",
  'Hack squat machine': "Dos calé, pieds au milieu du plateau. Descends au moins jusqu'aux cuisses parallèles.",
  'Leg extension': "Dos calé, axe de rotation de la machine aligné sur le genou. Tends complètement et contrôle la descente.",
  'Leg press': "Pieds au milieu du plateau, descends jusqu'à environ 90° sans décoller le bassin. Ne verrouille pas les genoux en haut.",
  'Pistol squat': "Squat sur une jambe, l'autre tendue devant. Tends les bras devant toi pour l'équilibre, contrôle la descente.",
  'Sissy squat': "Genoux vers l'avant, buste et cuisses alignés, descends en arrière. Amplitude progressive : c'est exigeant pour les genoux.",
  'Squat au poids du corps': "Pieds largeur d'épaules, descends au moins jusqu'aux cuisses parallèles. Dos plat, genoux dans l'axe des pieds.",
  'Squat barre': "Barre sur le haut du dos, descends au moins jusqu'aux cuisses parallèles. Genoux dans l'axe des pieds, dos plat, regard neutre.",

  // ── Triceps ───────────────────────────────────────────────────────────────
  'Dips triceps machine': "Dos calé, coudes serrés le long du corps. Tends les bras sans verrouiller brutalement.",
  'Extension triceps élastique': "Élastique fixé en hauteur, coudes fixes le long du corps. Tends les bras vers le bas et contrôle le retour.",
  'Pompe diamant': "Mains jointes en losange sous la poitrine, coudes serrés le long du corps. Ce sont les triceps qui travaillent, pas les pectoraux.",
  'Skull crusher barre EZ': "Allongé, coudes fixes pointés vers le plafond. Descends la barre vers le front : seuls les avant-bras bougent.",
  'Triceps poulie haute corde': "Coudes fixes le long du corps. Tends les bras vers le bas et écarte la corde en fin de mouvement.",
};

// ── Écriture ────────────────────────────────────────────────────────────────
let db = fs.readFileSync(DB, 'utf8');
const echapper = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
let ajoutees = 0, deja = 0;
const introuvables = [];

for (const [nom, consigne] of Object.entries(CONSIGNES)) {
  const ancre = `name: '${nom.replace(/'/g, "\\'")}',`;
  const i = db.indexOf(ancre);
  if (i < 0) { introuvables.push(nom); continue; }
  const fin = db.indexOf('\n  },', i);
  if (fin < 0) { introuvables.push(nom); continue; }
  if (db.slice(i, fin).includes('cue:')) { deja++; continue; }
  const texte = consigne.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  db = db.slice(0, fin) + `\n    cue: '${texte}',` + db.slice(fin);
  ajoutees++;
}
void echapper;

fs.writeFileSync(DB, db, 'utf8');
console.log(`✓ ${DB}`);
console.log(`  ${ajoutees} consignes ajoutées · ${deja} déjà présentes`);
if (introuvables.length) console.log(`  ⚠ introuvables : ${introuvables.join(', ')}`);

// Ce qui reste sans consigne parmi les exercices que l'app peut afficher.
const restants = EXERCISES.filter((e) => !e.cue && !CONSIGNES[e.name]).map((e) => e.name);
console.log(`  ${restants.length} exercice(s) de la base encore sans consigne (jamais utilisés par le catalogue)`);
