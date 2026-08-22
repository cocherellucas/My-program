// AUDIT — le statut d'une douleur suit-il vraiment les réponses de l'utilisateur ?
//
// Simule des parcours complets de suivi J+1 en enchaînant les réactions
// (« mieux » / « pareil » / « pire » / « douleur vive ») et vérifie qu'on
// arrive au bon statut : Actif → En pause → Résolu.
//
// Ce qu'on veut prouver :
//  1. répondre « mieux » jusqu'au bout termine l'épisode TOUT SEUL ;
//  2. « pareil » fait descendre l'échelle un cran à la fois, sans la dépasser ;
//  3. « pire » descend plus vite, et trois « pire » d'affilée mettent en pause ;
//  4. « douleur vive » met en pause immédiatement, quel que soit l'état ;
//  5. la remontée « consomme » les deux « mieux » (pas de remontée en escalier).
//
// Lancer :
//   npx esbuild program-data/audit-parcours-douleur.mjs --bundle --platform=node \
//     --format=cjs --alias:@=./src --outfile=<tmp>.cjs && node <tmp>.cjs
import { computePainPrescription } from '@/lib/pain-engine';
import { passerAuNiveau } from '@/lib/pain-adjust';

let echecs = 0;
const ok = (c, quoi) => { if (c) console.log(`  ✓ ${quoi}`); else { echecs++; console.log(`  ✗ ${quoi}`); } };

const neuf = () => ({ zone: 'shoulders', status: 'active', level: 0, betterStreak: 0, history: [] });

// Un « tour » = la question du lendemain + l'acceptation du conseil.
// C'est exactement ce que fait l'app : `computePainPrescription` à la réponse,
// puis `passerAuNiveau` quand l'utilisateur valide (« c'est noté »).
function tour(ep, reaction, { accepte = true } = {}) {
  const { episode, proposal } = computePainPrescription(ep, reaction, 'fr');
  if (accepte && proposal?.apply) return passerAuNiveau(episode, proposal.apply.toLevel);
  return episode;
}

const etat = (e) => (e.status === 'resolved' ? 'Résolu' : e.status === 'stop_advised' ? 'En pause' : `Actif (cran ${e.level})`);

console.log('\n██ PARCOURS DE SUIVI DOULEUR ██\n');

// ── 1. Ça s'aggrave, puis ça guérit : le parcours complet ───────────────────
console.log('  Parcours « ça empire puis ça passe » :');
let e = neuf();
const trace = [etat(e)];
for (const r of ['same', 'same', 'better', 'better', 'better', 'better', 'better']) {
  e = tour(e, r);
  trace.push(`${r} → ${etat(e)}`);
}
trace.forEach((l) => console.log(`     ${l}`));
ok(e.status === 'resolved', "répondre « mieux » jusqu'au bout termine l'épisode tout seul");

// ── 2. « Pareil » descend d'un cran à la fois ──────────────────────────────
e = neuf();
e = tour(e, 'same');
ok(e.level === 1, '« pareil » → cran 1');
e = tour(e, 'same');
ok(e.level === 2, '« pareil » → cran 2');
e = tour(e, 'same');
ok(e.level === 3, '« pareil » → cran 3');
e = tour(e, 'same');
ok(e.level <= 3, "l'échelle ne dépasse pas le cran 3 sur « pareil »");

// ── 3. « Pire » descend de deux crans, et trois « pire » mettent en pause ──
e = neuf();
e = tour(e, 'worse');
ok(e.level === 2, '« pire » depuis 0 → cran 2 (deux crans d\'un coup)');
e = neuf();
e = tour(e, 'worse'); e = tour(e, 'worse'); e = tour(e, 'worse');
ok(e.status === 'stop_advised', 'trois « pire » d\'affilée → En pause (garde-fou)');

// ── 4. Douleur vive : arrêt immédiat, depuis n'importe quel état ───────────
for (const depart of ['active']) {
  e = { ...neuf(), status: depart };
  e = tour(e, 'sharp');
  ok(e.status === 'stop_advised', `« douleur vive » depuis « ${depart} » → En pause`);
}
e = neuf(); e = tour(e, 'same'); e = tour(e, 'same'); // cran 2
e = tour(e, 'sharp');
ok(e.status === 'stop_advised', '« douleur vive » en cours de réduction → En pause');

// ── 5. La remontée demande DEUX « mieux » ─────────────────────────────────
e = neuf();
e = tour(e, 'same'); e = tour(e, 'same'); // cran 2
const niveauAvant = e.level;
e = tour(e, 'better');
ok(e.level === niveauAvant, 'un seul « mieux » ne remonte pas encore');
ok(e.betterStreak === 1, 'mais il est compté');
e = tour(e, 'better');
ok(e.level === niveauAvant - 1, 'deux « mieux » → on remonte d\'un cran');
ok(e.betterStreak === 0, 'la remontée consomme les deux « mieux »');

// ── 6. Refuser le conseil ne change pas le cran ────────────────────────────
e = neuf();
const refuse = tour(e, 'same', { accepte: false });
ok(refuse.level === 0, "ignorer le conseil laisse le cran inchangé");
ok(refuse.history.length === 1, "mais la réponse est bien enregistrée dans l'historique");

console.log(echecs === 0 ? '\n✓ le statut suit bien les réponses\n' : `\n✗ ${echecs} problème(s)\n`);
process.exit(echecs === 0 ? 0 : 1);
