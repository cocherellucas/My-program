// Injecte les consignes d'exécution manquantes dans src/lib/exercise-database.js.
//
// 80 des 187 exercices n'en avaient aucune : le « ? » de l'app (ExerciseCueButton)
// ne s'affichait donc pas pour eux. Le bouton lit `e.cue`, il suffit de remplir la
// donnée pour qu'il apparaisse — aucune modification d'interface.
//
// Style repris des consignes existantes : tutoiement, une à deux phrases,
// placement puis exécution, et l'erreur à ne pas commettre.
//
// Script à USAGE UNIQUE : il n'écrit que si la clé `cue` est absente de l'objet.
import fs from 'node:fs';
import path from 'node:path';

const CONSIGNES = {
  // ── Pectoraux ─────────────────────────────────────────────────────────────
  decline_press_dumbbell: "Banc incliné vers le bas, pieds bien calés. Descends les haltères vers le bas des pectoraux, coudes rentrés. Fais-toi passer les haltères ou pose-les sur les cuisses avant de t'allonger.",
  bench_press_machine: "Règle le siège pour que les poignées arrivent au niveau du bas des pectoraux. Omoplates serrées contre le dossier, ne décolle pas les épaules pour finir la poussée.",
  incline_press_machine: "Siège réglé pour que les poignées soient au niveau du haut des pectoraux. Pousse vers le haut et l'avant, sans hausser les épaules.",
  cable_fly_low: "Poulies en position basse, buste légèrement penché en avant. Monte les bras en arc de cercle jusqu'à hauteur des épaules, coudes fixes et à peine fléchis.",
  cable_fly_high: "Poulies en haut, un pas en avant pour mettre les câbles sous tension. Ramène les mains devant le bas de la poitrine en arc de cercle, coudes fixes.",
  dumbbell_fly: "Coudes légèrement fléchis et VERROUILLÉS dans cet angle : si tu les plies pendant le mouvement, tu fais un développé. Descends jusqu'à sentir l'étirement, pas plus bas.",
  bench_smith: "Place le banc pour que la barre descende au niveau des tétons : la barre étant guidée, c'est la position du banc qui détermine tout. Vérifie les crochets avant de lâcher la charge.",

  // ── Dos ───────────────────────────────────────────────────────────────────
  cable_row: "Buste droit, genoux à peine fléchis. Tire les coudes vers l'arrière en serrant les omoplates ; ne balance pas le buste pour lancer la charge.",
  machine_row: "Poitrine calée contre le support, épaules basses. Tire les poignées vers les hanches en serrant les omoplates, sans décoller le torse du coussin.",
  tbar_row: "Buste penché à environ 45°, dos gainé et bien plat. Tire la barre vers le nombril, coudes près du corps ; seuls les bras bougent, le dos reste immobile.",
  pullover_dumbbell: "Allongé sur le banc, haltère tenu à deux mains au-dessus de la poitrine. Descends derrière la tête bras quasi tendus jusqu'à l'étirement, sans cambrer le bas du dos.",
  hyperextension: "Bassin calé sur le coussin, hanches libres. Descends en gardant le dos droit et remonte jusqu'à l'alignement du corps — ne pars pas en hyperextension lombaire au sommet.",
  barbell_row_supinated: "Prise en supination largeur d'épaules, buste penché à 45°, dos plat. Tire vers le nombril, coudes près du corps. Ne va pas à l'échec : c'est le dos qui cède en premier.",
  lat_pulldown_supinated: "Mains en supination largeur d'épaules. Tire la barre vers le haut de la poitrine en sortant le sternum, coudes vers le bas et l'arrière.",
  cable_row_unilateral: "Un bras à la fois, buste stable. Laisse l'omoplate s'étirer vers l'avant en fin de retour, puis tire en la ramenant vers la colonne. Ne pivote pas le buste pour aller plus loin.",
  seal_row: "Allongé sur le ventre sur un banc surélevé, bras pendants. Tire la barre vers le banc : le buste ne pouvant pas bouger, aucune triche n'est possible.",
  rack_pull: "Barre calée dans le rack au niveau des genoux ou juste en dessous. Dos plat, tire en poussant le sol. La charge est lourde : la moindre rondeur lombaire se paie.",

  // ── Épaules / trapèzes ────────────────────────────────────────────────────
  ohp_machine: "Siège réglé pour que les poignées soient au niveau des épaules. Pousse verticalement sans cambrer, dos plaqué au dossier.",
  front_raise_dumbbell: "Monte les bras tendus devant toi jusqu'à hauteur des yeux, pas plus haut. Pas d'élan de hanches : si tu dois balancer, l'haltère est trop lourd.",
  shrug_barbell: "Bras tendus, barre devant les cuisses. Monte les épaules vers les oreilles à la verticale et marque un temps en haut. Les rotations d'épaules n'apportent rien.",
  shrug_dumbbell: "Haltères le long du corps, bras tendus. Hausse les épaules à la verticale et marque un temps en haut ; ne plie pas les coudes pour tricher.",
  upright_row: "Prise un peu plus large que les épaules. Monte les coudes jusqu'à hauteur d'épaules, PAS PLUS HAUT : au-delà, l'épaule se pince. Si tu sens un pincement, élargis la prise.",
  reverse_fly_machine: "Poitrine contre le dossier, bras quasi tendus. Écarte vers l'arrière en pensant à écarter les COUDES, pas les mains ; garde les épaules basses.",

  // ── Biceps / avant-bras ───────────────────────────────────────────────────
  curl_barbell: "Coudes collés au corps et fixes. Monte la barre sans reculer les coudes ni balancer le buste, et contrôle la descente jusqu'aux bras tendus.",
  concentration_curl: "Assis, coude calé contre l'intérieur de la cuisse. Monte jusqu'à la contraction complète et descends lentement bras tendu, sans aucun mouvement d'épaule.",
  curl_machine: "Règle le siège pour que le coude soit aligné avec l'axe de rotation. Ne décolle pas les bras du coussin et contrôle le retour.",
  preacher_curl: "Aisselles bien calées en haut du pupitre. Ne tends pas les bras d'un coup en bas : la remontée doit rester sous contrôle, le biceps est vulnérable en position étirée.",
  cable_curl_low: "Debout face à la poulie, coudes fixes contre le corps. Le câble garde la tension même en bas — profites-en pour contrôler la descente.",
  cable_curl_high: "Poulie en haut, bras tendu à l'horizontale. Amène la main vers la tête sans bouger le coude ; la tension est maximale en position contractée.",
  bayesian_curl: "Dos à la poulie basse, bras légèrement en ARRIÈRE du corps. Cette position étire le biceps et place la tension maximale en bas : c'est tout l'intérêt de la variante.",
  reverse_curl_ez: "Prise en pronation, paumes vers le bas, coudes fixes. La charge est nettement plus légère qu'au curl classique, c'est normal : le levier est défavorable.",
  zottman_curl: "Monte en supination paumes vers le haut, tourne les poignets en haut, redescends en pronation paumes vers le bas. La descente en pronation est le vrai travail.",
  wrist_curl: "Avant-bras posés sur les cuisses ou un banc, poignets dans le vide. Laisse la barre dérouler jusqu'au bout des doigts puis enroule. Amplitude complète, charge légère.",

  // ── Triceps ───────────────────────────────────────────────────────────────
  close_grip_bench: "Mains à largeur d'épaules, pas plus serrées : trop serré, ce sont les poignets qui prennent. Coudes près du corps, descends vers le bas des pectoraux.",
  skull_crusher_dumbbell: "Coudes fixes pointés vers le plafond. Descends les haltères de part et d'autre de la tête, seuls les avant-bras bougent. Meilleure position de poignet qu'à la barre.",
  triceps_pushdown_bar: "Coudes collés au corps, buste légèrement penché. Tends les bras complètement vers le bas et contrôle le retour sans remonter les coudes.",
  triceps_cable_low: "Dos à la poulie, bras au-dessus de la tête, coudes serrés. Tends les bras vers le haut sans laisser les coudes s'écarter.",
  kickback: "Buste penché, bras collé au corps, coude fixe et haut. Tends l'avant-bras vers l'arrière jusqu'au verrouillage et marque un temps ; charge légère obligatoire.",
  overhead_ext_dumbbell: "Haltère tenu à deux mains derrière la tête, coudes serrés et pointés vers le haut. Descends jusqu'à l'étirement complet du triceps sans écarter les coudes.",
  overhead_ext_unilateral: "Un bras au-dessus de la tête, coude pointé vers le plafond, l'autre main peut soutenir le coude. Descends derrière la nuque et remonte sans bouger le coude.",
  triceps_machine: "Règle le siège pour aligner tes coudes avec l'axe de la machine. Tends les bras complètement et contrôle le retour sans te laisser tirer par la charge.",
  french_press_ez: "Assis dossier haut, barre EZ au-dessus de la tête, coudes serrés. Descends derrière la nuque jusqu'à l'étirement et remonte sans écarter les coudes.",
  jm_press: "À mi-chemin entre le développé serré et le skull crusher : descends la barre vers le haut de la poitrine en laissant les coudes avancer. Charge modérée, très exigeant pour les coudes.",

  // ── Quadriceps / fessiers ─────────────────────────────────────────────────
  squat_dumbbell: "Haltères le long du corps, pieds largeur d'épaules. Descends en poussant les hanches vers l'arrière, dos droit, jusqu'à ce que les cuisses soient au moins parallèles au sol.",
  goblet_squat: "Kettlebell tenue contre la poitrine, coudes rentrés. Le poids devant sert de contrepoids : il t'aide à garder le buste droit et à descendre bas.",
  lunge_barbell: "Barre sur les trapèzes, un grand pas en avant. Le genou arrière descend vers le sol, buste droit, genou avant au-dessus du pied. Ne va pas à l'échec : l'équilibre lâche avant le muscle.",
  lunge_dumbbell: "Haltères le long du corps, grand pas en avant. Le genou arrière descend vers le sol, le buste reste vertical. Pousse sur le talon avant pour revenir.",
  squat_smith: "Pieds légèrement avancés par rapport à la barre : la barre étant guidée, c'est la position des pieds qui fixe la trajectoire. Vérifie les crochets avant de charger.",
  belt_squat: "Ceinture sur les hanches, la charge tire vers le bas sans passer par le dos. Descends bas en gardant le buste droit — l'intérêt de la machine est justement d'épargner les lombaires.",
  step_up: "Pose tout le pied sur le banc et pousse sur le TALON du pied posé, sans t'aider d'un élan de la jambe restée au sol. Redescends en contrôlant, ne saute pas.",
  sumo_squat: "Pieds bien plus larges que les épaules, pointes vers l'extérieur. Descends entre les jambes, genoux dans l'axe des pieds ; tu dois sentir l'intérieur des cuisses.",
  box_jump: "Saute et réceptionne en amorti, pieds à plat sur la boîte. REDESCENDS EN MARCHANT — ne saute pas depuis la boîte, c'est là que le tendon d'Achille lâche.",
  wall_sit: "Dos plaqué au mur, cuisses parallèles au sol, genoux à 90° à l'aplomb des chevilles. Tiens la position sans poser les mains sur les cuisses.",
  lunge_bodyweight: "Grand pas en avant, genou arrière vers le sol, buste vertical. Pousse sur le talon avant pour revenir, puis alterne. Le genou avant reste au-dessus du pied.",
  thruster_dumbbell: "Haltères sur les épaules, squat complet, puis la remontée enchaîne directement sur le développé — un seul mouvement fluide. Ne va pas à l'échec avec une charge au-dessus de la tête.",
  trap_bar_deadlift: "Debout au centre de la trap bar, poignées sur les côtés. Dos plat, pousse le sol avec les jambes. Plus tolérant pour les lombaires que la barre droite, mais ne va pas à l'échec.",

  // ── Chaîne postérieure ────────────────────────────────────────────────────
  rdl_dumbbell: "Jambes quasi tendues, genoux à peine fléchis. Pousse les hanches vers l'arrière et descends les haltères le long des jambes jusqu'à l'étirement des ischios, dos plat.",
  hip_thrust_dumbbell: "Haut du dos calé sur le banc, haltère sur le bassin. Monte les hanches jusqu'à l'alignement épaules-hanches-genoux, menton rentré, et serre les fessiers en haut.",
  glute_kickback_cable: "Sangle à la cheville, buste légèrement penché en appui. Envoie la jambe vers l'arrière en gardant le dos immobile ; ne cambre pas pour gagner de l'amplitude.",
  fessier_machine: "Cale bien le buste et le bassin. Pousse jusqu'à l'extension complète de la hanche, sans cambrer le bas du dos pour aller plus loin.",
  kettlebell_swing: "C'est une charnière de HANCHE, pas un squat : les hanches reculent, la kettlebell passe entre les jambes. La projection vient du coup de hanches, les bras ne font que suivre.",

  // ── Adducteurs / abducteurs / mollets ─────────────────────────────────────
  adductor_machine: "Règle l'écartement de départ sans forcer l'étirement. Serre les cuisses jusqu'à la fermeture et contrôle le retour, sans laisser les jambes s'écarter brutalement.",
  miniband_abduction: "Élastique au-dessus des genoux. Écarte les genoux contre la résistance sans bouger le bassin ; le mouvement est court, la tension reste continue.",
  copenhagen_plank: "En gainage latéral, jambe du dessus posée sur un support. Monte le bassin en poussant sur l'intérieur de la cuisse posée. Commence genou plié, c'est très intense pour les adducteurs.",
  calf_raise_barbell: "Barre sur les trapèzes, avant-pieds sur une cale si tu en as une. Monte le plus haut possible sur les pointes, marque un temps, et descends jusqu'à l'étirement complet.",
  calf_raise_dumbbell: "Haltères le long du corps. Monte sur les pointes au maximum, temps d'arrêt en haut, descente lente jusqu'à l'étirement : c'est l'amplitude complète qui fait le travail.",
  jump_rope: "Sauts bas et rapides sur l'avant du pied, genoux souples. La corde est tournée par les POIGNETS, pas par les épaules.",

  // ── Abdominaux / gainage ──────────────────────────────────────────────────
  rotation_machine: "Bassin bloqué, la rotation vient du buste. Va progressivement et sans à-coups : le bas du dos n'aime pas la rotation chargée et rapide.",
  captain_chair: "Avant-bras calés, dos plaqué. Monte les genoux en ENROULANT le bassin vers le haut — si tu montes seulement les cuisses, ce sont les fléchisseurs de hanche qui travaillent, pas les abdos.",
  side_plank: "Sur le côté, coude sous l'épaule. Monte le bassin jusqu'à l'alignement pieds-hanches-épaules et tiens la position sans laisser les hanches redescendre.",
  russian_twist: "Buste incliné en arrière, pieds décollés ou au sol. Fais tourner les ÉPAULES d'un côté à l'autre, pas seulement les bras, et va lentement.",
  swiss_ball_crunch: "Bas du dos sur le ballon, pieds bien stables. Descends légèrement en arrière pour étirer les abdos, puis enroule le buste : c'est cette amplitude en extension qui fait l'intérêt du ballon.",
  pallof_press: "De profil à la poulie, mains devant le sternum. Tends les bras en résistant à la rotation — le but est de NE PAS bouger. Gaine et respire.",
  dead_bug: "Allongé, bas du dos plaqué au sol. Descends un bras et la jambe opposée sans jamais laisser le dos se creuser ; si le dos décolle, réduis l'amplitude.",
  dragon_flag: "Accroche-toi derrière la tête, corps gainé d'un seul bloc. Descends le corps entier lentement en gardant la ligne épaules-hanches-pieds. Très difficile : commence genoux pliés.",
  hollow_body_hold: "Bas du dos plaqué au sol, épaules et jambes décollées. Cherche la position où le dos reste collé : si tu sens un creux lombaire, remonte les jambes.",
  mountain_climbers: "Position de pompe, bassin stable. Ramène les genoux vers la poitrine en alternant, sans laisser les hanches monter ni s'affaisser.",

  // ── Corps entier ──────────────────────────────────────────────────────────
  burpees: "Enchaîne squat, mains au sol, jambes en arrière, pompe, retour des jambes, saut. Garde le dos gainé au moment de la pompe : c'est la fatigue qui fait creuser les lombaires.",
  renegade_row: "Position de pompe, une main sur chaque haltère, pieds écartés pour la stabilité. Tire un haltère vers la hanche sans laisser le bassin pivoter.",
  farmers_carry: "Haltères le long du corps, épaules basses et en arrière, buste droit. Marche à pas réguliers en gainant ; le poids ne doit pas te faire pencher d'un côté.",
};

const fichier = path.join(process.cwd(), 'src', 'lib', 'exercise-database.js');
let source = fs.readFileSync(fichier, 'utf8');
const nl = source.includes('\r\n') ? '\r\n' : '\n';
const finObjet = `${nl}  },`;

let ajoutes = 0;
const absents = [];
const dejaLa = [];

for (const [id, texte] of Object.entries(CONSIGNES)) {
  const debut = source.indexOf(`id: '${id}',`);
  if (debut === -1) { absents.push(id); continue; }
  const fin = source.indexOf(finObjet, debut);
  if (fin === -1) { absents.push(id); continue; }
  // Ne jamais écraser une consigne existante.
  if (source.slice(debut, fin).includes('cue:')) { dejaLa.push(id); continue; }
  const echappe = texte.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  source = source.slice(0, fin) + `${nl}    cue: '${echappe}',` + source.slice(fin);
  ajoutes++;
}

fs.writeFileSync(fichier, source, 'utf8');
console.log(`✓ ${ajoutes} consigne(s) ajoutée(s) sur ${Object.keys(CONSIGNES).length}`);
if (dejaLa.length) console.log(`  déjà présentes (ignorées) : ${dejaLa.join(', ')}`);
if (absents.length) console.log(`  ✗ INTROUVABLES : ${absents.join(', ')}`);
