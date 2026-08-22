// AUDIT — la barrière d'abonnement sur le flux douleur n'a rien cassé.
//
// Trois questions :
//  1. `buildPainAdvice(note, lang)` rend-il EXACTEMENT ce que rendait la version
//     d'avant ? (regroupement des regex de gravité + option `suivi`)
//  2. `suivi: false` retire-t-il bien la promesse « je te redemanderai demain »
//     — et seulement elle ?
//  3. `isSeverePain` couvre-t-il enfin les termes anglais ? (avant : FR seul,
//     un utilisateur EN tapant « sharp pain » passait pour un cas bénin, donc
//     serait tombé sur le mur au lieu du conseil d'arrêt)
//
// POUR LE RELANCER (le témoin `_head_pain_engine.js` est temporaire, jamais
// versionné — il faut le regénérer, sinon esbuild échoue sur un import manquant) :
//   git show HEAD:src/lib/pain-engine.js > src/lib/_head_pain_engine.js
//   npx esbuild program-data/audit-paywall-douleur.mjs --bundle --platform=node \
//     --format=cjs --alias:@=./src \
//     --define:import.meta.env='{"VITE_SUPABASE_URL":"https://exemple.supabase.co","VITE_SUPABASE_ANON_KEY":"x"}' \
//     --outfile=/tmp/audit-pain.cjs && node /tmp/audit-pain.cjs
//   rm src/lib/_head_pain_engine.js
// `cjs` et non `esm` : le SDK base44 embarque du CommonJS (`require('util')`).
import { buildPainAdvice, isSeverePain } from '../src/lib/pain-engine.js';
import { buildPainAdvice as avantAdvice, isSeverePain as avantSevere } from '../src/lib/_head_pain_engine.js';

const NOTES = [
  // gravité FR
  'Où : épaule — Quand : à la montée — Comment : ça a craqué',
  'Où : genou — Quand : en bas — Comment : gonflé depuis hier',
  'Où : coude — Quand : tout le temps — Comment : fourmillements',
  'Où : bas du dos — Quand : à l\'effort — Comment : douleur vive 9/10',
  // gravité EN
  'Where : shoulder — When : lifting — How : sharp pain',
  'Where : knee — When : bottom — How : swollen',
  'Where : elbow — When : all the time — How : tingling and numb',
  'Where : wrist — When : lockout — How : felt a pop',
  // bénin — chaque branche de nature
  'Où : poignet — Quand : à la montée — Comment : brûlure',
  'Où : épaule — Quand : en bas du mouvement — Comment : pincement',
  'Où : genou — Quand : à la descente — Comment : tension',
  'Où : coude — Quand : au verrouillage — Comment : gêne',
  'Où : bas du dos — Quand : après la série — Comment : raideur',
  'Où : nuque — Quand : à l\'échauffement — Comment : crampe',
  'Où : hanche — Quand : tout le temps — Comment : gêne — Autres : depuis 3 semaines',
  'Où : cheville — Quand : à la montée — Comment : gêne légère',
  'Où : pec — Quand : en position étirée — Comment : ça tire',
  'Où : ischio — Quand : à la descente — Comment : tiraillement',
  // texte libre (repli sans étiquettes)
  'ça me gêne un peu au genou',
  'mon épaule tire quand je monte',
];

const LANGS = ['fr', 'en'];
let identiques = 0;
const diffs = [];
const suiviRestant = [];
const suiviPerdu = [];

for (const note of NOTES) {
  for (const lang of LANGS) {
    const avant = avantAdvice(note, lang);
    const apres = buildPainAdvice(note, lang);
    if (avant === apres) identiques++;
    else diffs.push(`${lang} · « ${note.slice(0, 45)}… »\n        AVANT : ${avant.slice(0, 90)}\n        APRÈS : ${apres.slice(0, 90)}`);

    // suivi: false → la promesse de relance disparaît, le reste est intact
    const sansSuivi = buildPainAdvice(note, lang, { suivi: false });
    const promesse = lang === 'en' ? "I'll ask you tomorrow" : 'Je te redemanderai demain';
    if (sansSuivi.includes(promesse)) suiviRestant.push(`${lang} · ${note.slice(0, 45)}`);
    if (!apres.includes(promesse)) suiviPerdu.push(`${lang} · ${note.slice(0, 45)}`);
    // le corps du conseil doit être le même, à la relance près
    const corpsApres = apres.replace(promesse, '').replace(/\s+$/, '').replace(/_+$/, '').trim();
    const corpsSans = sansSuivi.replace(/\s+$/, '').trim();
    if (!corpsApres.startsWith(corpsSans.slice(0, 60))) {
      diffs.push(`${lang} · suivi:false altère le corps du conseil — « ${note.slice(0, 40)} »`);
    }
  }
}

// Gravité : les cas EN étaient invisibles avant
const EN_GRAVES = ['sharp pain', 'swollen knee', 'felt a pop', 'tingling', 'numb hand', 'shooting down the arm', 'a bruise', 'i think i tore something'];
const gagnes = EN_GRAVES.filter((n) => isSeverePain(n) && !avantSevere(n));
const perdus = [];
// aucun cas anciennement détecté ne doit cesser de l'être
const FR_GRAVES = ['ça a craqué', 'gonflé', 'douleur vive', 'fourmillements', 'hématome', 'coup', 'déchirure', '9/10', 'décharge électrique', 'lancinant', 'insupportable', 'engourdi'];
for (const n of [...FR_GRAVES, ...NOTES]) {
  if (avantSevere(n) && !isSeverePain(n)) perdus.push(n);
}

// Le conseil rendu pour un cas grave doit bien être un « stop »
const stopManquants = [...FR_GRAVES, ...EN_GRAVES].filter((n) => {
  if (!isSeverePain(n)) return false;
  const txt = buildPainAdvice(n, /[a-z]/.test(n) && !/[éèàçê]/.test(n) ? 'en' : 'fr').toLowerCase();
  return !/stop|arrête|consulte|doctor|médical|medical/.test(txt);
});

console.log('\n██ BARRIÈRE D\'ABONNEMENT — FLUX DOULEUR ██\n');
console.log(`  conseils comparés : ${NOTES.length * LANGS.length}`);
console.log(`\n  ${diffs.length ? '✗' : '✓'} conseils IDENTIQUES à avant : ${identiques}/${NOTES.length * LANGS.length}   ← doit être complet`);
for (const d of diffs.slice(0, 5)) console.log(`      ${d}`);
console.log(`  ${suiviRestant.length ? '✗' : '✓'} promesse de relance retirée avec suivi:false : ${suiviRestant.length} fuite(s)   ← doit valoir 0`);
for (const s of suiviRestant.slice(0, 3)) console.log(`      ${s}`);
console.log(`  ${suiviPerdu.length ? '✗' : '✓'} promesse CONSERVÉE par défaut : ${suiviPerdu.length} perte(s)   ← doit valoir 0`);
for (const s of suiviPerdu.slice(0, 3)) console.log(`      ${s}`);
console.log(`  ${perdus.length ? '✗' : '✓'} gravités qui ne sont PLUS détectées : ${perdus.length}   ← doit valoir 0`);
for (const p of perdus.slice(0, 5)) console.log(`      ${p}`);
console.log(`  ${stopManquants.length ? '✗' : '✓'} cas graves sans conseil d'arrêt : ${stopManquants.length}   ← doit valoir 0`);
for (const s of stopManquants.slice(0, 5)) console.log(`      ${s}`);
console.log(`\n  + gravités anglaises désormais détectées (avant : aucune) : ${gagnes.length}/${EN_GRAVES.length}`);
for (const g of gagnes) console.log(`      « ${g} »`);
console.log('');

process.exitCode = (diffs.length || suiviRestant.length || suiviPerdu.length || perdus.length || stopManquants.length) ? 1 : 0;
