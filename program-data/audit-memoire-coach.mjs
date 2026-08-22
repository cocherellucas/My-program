// AUDIT — plafond et lecture de la mémoire du coach.
//
// `coach_notes` est un champ TEXTE, une entrée par ligne, mais le détail des
// douleurs par série est écrit sur plusieurs lignes. Découper naïvement sur
// « \n » couperait ces entrées en morceaux, et le plafond compterait des lignes
// au lieu d'entrées.
//
// Lancer :
//   npx esbuild program-data/audit-memoire-coach.mjs --bundle --platform=node \
//     --format=cjs --alias:@=./src --outfile=<tmp>.cjs && node <tmp>.cjs
import {
  lireNotes, ecrireNotes, ajouterNote, tauxRemplissage,
  memoirePleine, estNotePerso, SOURCE_PERSO, LIMITE_ENTREES,
} from '@/lib/coach-memory';

let echecs = 0;
const ok = (c, quoi) => { if (c) console.log(`  ✓ ${quoi}`); else { echecs++; console.log(`  ✗ ${quoi}`); } };

console.log('\n██ MÉMOIRE DU COACH ██\n');

// ── Lecture ─────────────────────────────────────────────────────────────────
const multi = '[2026-08-20] Douleur signalée (épaule)\n  Développé couché série 2 : "ça pince"\n  Écarté série 1 : "pareil"';
const e = lireNotes(multi);
ok(e.length === 1, 'une entrée multi-lignes reste UNE entrée');
ok(e[0].date === '2026-08-20', 'la date est extraite');
ok(e[0].texte.includes('Écarté série 1'), 'le détail indenté est conservé');
ok(ecrireNotes(e) === multi, "lecture puis écriture rend le texte d'origine");

const src = lireNotes('[2026-08-20 — CoachIA] "j\'ai mal au genou"');
ok(src[0].source === 'CoachIA', 'la source est extraite');

// ── Déduplication ───────────────────────────────────────────────────────────
const avant = ajouterNote('', '[2026-08-20] pareil');
ok(lireNotes(ajouterNote(avant, '[2026-08-20] pareil')).length === 1, "une note identique n'est pas ajoutée deux fois");

// Deux gênes qui COMMENCENT pareil doivent toutes deux être gardées
// (l'ancienne déduplication comparait les 40 premiers caractères).
const a = '[2026-08-20] Douleur signalée (épaule) — Développé couché : ça pince en haut';
const b = '[2026-08-20] Douleur signalée (épaule) — Développé couché : ça brûle en bas';
ok(lireNotes(ajouterNote(ajouterNote('', a), b)).length === 2, 'deux gênes au même endroit sont distinguées');

// ── AUCUNE éviction automatique ─────────────────────────────────────────────
// Décision du 2026-08-22 : quand c'est plein, on n'écrase RIEN — ni les notes
// écrites à la main, ni les observations de l'app. Une gêne d'il y a trois mois
// peut être l'information qui explique la douleur d'aujourd'hui : la machine ne
// sait pas laquelle compte, donc elle ne choisit pas. C'est l'utilisateur qui trie.
const perso = (i) => `[2026-08-20 — ${SOURCE_PERSO}] note perso ${i}`;
const auto = (i) => `[2026-08-20 — séance en cours] observation ${i}`;

let m = '';
for (let i = 1; i <= LIMITE_ENTREES; i++) m = ajouterNote(m, auto(i));
ok(lireNotes(m).length === LIMITE_ENTREES, `${LIMITE_ENTREES} entrées enregistrées`);
ok(memoirePleine(m), 'plafond atteint');

ok(ajouterNote(m, perso(1)) === m, "une note perso ne passe PAS quand c'est plein");
ok(ajouterNote(m, auto(99)) === m, 'une observation ne passe PAS non plus');
ok(lireNotes(m).some((x) => x.texte.includes('observation 1')), 'la plus ancienne est toujours là — rien évincé');

// Une entrée multi-lignes ne doit pas être comptée pour plusieurs.
let mm = '';
for (let i = 1; i <= LIMITE_ENTREES; i++) mm = ajouterNote(mm, `[2026-08-20] douleur ${i}\n  détail de la série ${i}`);
ok(lireNotes(mm).length === LIMITE_ENTREES, 'plafond compté en ENTRÉES, pas en lignes');
ok(lireNotes(mm).every((x) => x.texte.includes('détail de la série')), 'aucune entrée coupée en deux');

// Après un ménage, ça repart.
const allege = ecrireNotes(lireNotes(m).slice(1));
ok(!memoirePleine(allege), 'une suppression libère la place');
ok(lireNotes(ajouterNote(allege, perso(1))).length === LIMITE_ENTREES, 'et la note passe alors');

// ── Origine d'une entrée (pour l'affichage) ─────────────────────────────────
ok(estNotePerso(lireNotes(perso(1))[0]), 'une note perso est reconnue comme telle');
ok(!estNotePerso(lireNotes(auto(1))[0]), "une observation n'est pas une note perso");

// ── Jauge ───────────────────────────────────────────────────────────────────
ok(tauxRemplissage('') === 0, 'jauge à 0 quand vide');
ok(tauxRemplissage(m) === 1, 'jauge à 1 quand plein');
ok(Math.abs(tauxRemplissage(ajouterNote('', '[2026-08-20] une')) - 1 / LIMITE_ENTREES) < 1e-9, 'jauge proportionnelle');

// ── Robustesse ──────────────────────────────────────────────────────────────
ok(lireNotes(null).length === 0, 'null ne casse rien');
ok(ajouterNote(null, null) === '', 'ajouter rien à rien rend une chaîne vide');
ok(lireNotes('ligne sans date').length === 1, "une ligne à l'ancien format est conservée");

console.log(echecs === 0 ? '\n✓ mémoire conforme\n' : `\n✗ ${echecs} problème(s)\n`);
process.exit(echecs === 0 ? 0 : 1);
