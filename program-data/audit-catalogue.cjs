// ─────────────────────────────────────────────────────────────────────────────
// AUDIT AUTO DU CATALOGUE PRÉ-GÉNÉRÉ
// Vérifie chaque programme AVANT intégration, selon brief-catalogue-claude.md :
//  - structure (sessions=freq, champs exos, muscle_group valide, pas de doublon)
//  - matériel valide pour le tier (bodyweight = liste restreinte)
//  - VOLUME par muscle/sem vs rôle d'objectif (primaire≥MAV, secondaire≈MEV,
//    écart primaire↔secondaire NET — piège "haut a plus de muscles")
//  - FORCE : ~2×/sem par lift dès 4-5 j (jamais 1 jour = 1 lift)
//  - day_label non tronqué · recommended_for_optimal unique par groupe
//  - noms d'exos tous présents dans exercise_library (cohérence interne)
//
// Sortie : ERREURS (bloquent le ship) + AVERTISSEMENTS (à revoir). Exit 1 si erreur.
// Lancement : node program-data/audit-catalogue.js [chemin.json]
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const path = require('path');

const FILE = process.argv[2] || path.join(__dirname, 'catalogue_complet.json');
const j = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const CATALOG = j.catalog || j;
const LIBRARY = j.exercise_library || [];

// ── Référentiels ─────────────────────────────────────────────────────────────
const MUSCLES = ['Pectoraux', 'Dos', 'Épaules', 'Biceps', 'Triceps', 'Abdominaux',
  'Fessiers', 'Quadriceps', 'Ischio-jambiers', 'Mollets'];
const BIG = new Set(['Pectoraux', 'Dos', 'Épaules', 'Quadriceps', 'Ischio-jambiers', 'Fessiers']);
const ZONE_MUSCLES = {
  upper_body: ['Pectoraux', 'Dos', 'Épaules', 'Biceps', 'Triceps'],
  lower_body: ['Quadriceps', 'Ischio-jambiers', 'Fessiers', 'Mollets'],
  full_body: MUSCLES.slice(),
};
// MAV (borne basse) par niveau — gros / petit muscle (brief §4)
const MAV_LOW = {
  beginner: { big: 10, small: 8 },
  intermediate: { big: 14, small: 10 },
  advanced: { big: 16, small: 12 },
};
// Plancher MEV secondaire, par niveau (un secondaire au niveau débutant tolère
// moins de volume — progression lente voulue ; on ne flague que le vrai néant).
const MEV_LOW = { beginner: 4, intermediate: 6, advanced: 6 };

// Matériel autorisé en bodyweight (brief §5). [] = poids du corps.
const BW_EQUIP = new Set(['Barre de traction haute', 'Barres parallèles', 'Barre basse',
  'Anneaux de gymnaste', 'Sangles TRX', 'Élastiques de résistance', 'Gilet lesté',
  'Ceinture de lest']);

const errors = [];
const warns = [];
const E = (id, m) => errors.push({ cat: 'STRUCTURE', line: `[${id}] ${m}` });
const W = (id, m, cat = 'VOLUME') => warns.push({ cat, line: `[${id}] ${m}` });

const BLOCK_RANK = { A: 0, B: 1, C: 2 };
// "6-8" → [6,8] · "5" → [5,5]
function repRange(s) {
  const m = String(s).match(/(\d+)\s*-\s*(\d+)/);
  if (m) return [+m[1], +m[2]];
  const n = +(String(s).match(/\d+/) || [0])[0];
  return [n, n];
}

// ── Rôle des muscles d'après la signature d'objectifs ────────────────────────
// → { primary:Set, secondary:Set, strengthMovements:[...], hasStrengthMov:bool }
function rolesFromSignature(sig) {
  const primary = new Set(), secondary = new Set();
  let hasStrengthMov = false;
  for (const part of sig.split('+').map((s) => s.trim()).filter(Boolean)) {
    const m = part.match(/^([a-z]+):(.+):(primary|secondary)$/i);
    if (!m) continue;
    const [, type, middle, prio] = m;
    const dst = prio === 'primary' ? primary : secondary;
    if (/^movements\[/i.test(middle)) { hasStrengthMov = true; continue; }
    const zone = middle.trim();
    (ZONE_MUSCLES[zone] || []).forEach((mu) => dst.add(mu));
  }
  // Un muscle primaire ne compte pas aussi comme secondaire
  for (const mu of primary) secondary.delete(mu);
  return { primary, secondary, hasStrengthMov };
}

// ── Volume hebdo effectif par muscle (direct + 0,5 × secondaire) ─────────────
function weeklyVolume(program) {
  const direct = {}, indirect = {};
  MUSCLES.forEach((m) => { direct[m] = 0; indirect[m] = 0; });
  for (const s of program.sessions) {
    for (const x of s.exercises) {
      const n = Number(x.sets) || 0;
      if (direct[x.muscle_group] !== undefined) direct[x.muscle_group] += n;
      for (const sec of x.muscles_secondary || []) {
        if (indirect[sec] !== undefined) indirect[sec] += n;
      }
    }
  }
  const eff = {};
  MUSCLES.forEach((m) => { eff[m] = direct[m] + 0.5 * indirect[m]; });
  return { direct, indirect, eff };
}

// ── Détection des patterns de mouvement (force SBD) ──────────────────────────
function movementExposures(program) {
  const count = { squat: 0, bench: 0, deadlift: 0 };
  for (const s of program.sessions) {
    const names = s.exercises.map((x) => x.name.toLowerCase());
    // "main lift" = bloc A (composé lourd de début de séance)
    const aNames = s.exercises.filter((x) => x.block === 'A').map((x) => x.name.toLowerCase());
    const has = (arr, re) => arr.some((nm) => re.test(nm));
    if (has(aNames, /squat (barre|avant)/)) count.squat++;
    if (has(aNames, /développé (couché|incliné) barre/)) count.bench++;
    if (has(aNames, /soulevé de terre/)) count.deadlift++;
  }
  return count;
}

// ── Passe principale ─────────────────────────────────────────────────────────
const groupRecommended = {}; // key level|ctx|sig → nb de recommended_for_optimal:true
const usedNames = new Set();
const libNames = new Set(LIBRARY.map((e) => e.name));

for (const entry of CATALOG) {
  const mt = entry.match, p = entry.program;
  const id = `${mt.level}/${mt.training_context}/${mt.objectives_signature}/${mt.weekly_frequency}j`;
  const roles = rolesFromSignature(mt.objectives_signature);

  // recommended unique
  const gk = `${mt.level}|${mt.training_context}|${mt.objectives_signature}`;
  groupRecommended[gk] = (groupRecommended[gk] || 0) + (mt.recommended_for_optimal ? 1 : 0);

  // sessions = freq
  if (p.sessions.length !== mt.weekly_frequency)
    E(id, `sessions=${p.sessions.length} ≠ weekly_frequency=${mt.weekly_frequency}`);
  if (p.weekly_frequency !== mt.weekly_frequency)
    W(id, `program.weekly_frequency=${p.weekly_frequency} ≠ match=${mt.weekly_frequency}`);

  for (const s of p.sessions) {
    // day_label tronqué
    if (/^Jour Développé$/i.test(s.day_label) || /^Jour Soulevé$/i.test(s.day_label))
      E(id, `day_label tronqué: "${s.day_label}"`);
    // doublon d'exo dans la séance
    const seen = new Set();
    let maxBlock = -1, blockOrderFlagged = false;
    for (const x of s.exercises) {
      if (seen.has(x.name)) W(id, `doublon intra-séance "${x.name}" (${s.day_label})`, 'DOUBLON');
      seen.add(x.name);
      usedNames.add(x.name);
      // champs
      if (!MUSCLES.includes(x.muscle_group)) E(id, `muscle_group invalide "${x.muscle_group}" (${x.name})`);
      if (!(Number(x.sets) > 0)) E(id, `sets invalide (${x.name})`);
      if (typeof x.target_reps !== 'string') E(id, `target_reps non-string (${x.name})`);
      if (!(Number(x.rest_seconds) > 0)) E(id, `rest_seconds invalide (${x.name})`);
      if (!Array.isArray(x.equipment)) E(id, `equipment non-array (${x.name})`);
      if (!libNames.has(x.name)) W(id, `exo absent de exercise_library: "${x.name}"`, 'LIBRAIRIE');
      // matériel bodyweight
      if (mt.training_context === 'bodyweight') {
        for (const eq of x.equipment || [])
          if (!BW_EQUIP.has(eq)) E(id, `matériel non-bodyweight "${eq}" (${x.name})`);
      }
      // ordre des blocs A→B→C (le composé lourd doit ouvrir la séance)
      const rk = BLOCK_RANK[x.block];
      if (rk === undefined) W(id, `block inconnu "${x.block}" (${x.name})`, 'BLOC');
      else { if (rk < maxBlock && !blockOrderFlagged) { W(id, `ordre des blocs cassé: ${x.block} après un bloc plus tardif (${s.day_label})`, 'BLOC'); blockOrderFlagged = true; } maxBlock = Math.max(maxBlock, rk); }
      // repos cohérent avec le bloc/type (seulement force/hypertrophie : mixte &
      // endurance utilisent des repos courts par nature → pas d'anomalie)
      const rest = Number(x.rest_seconds) || 0;
      if (x.block === 'A' && (s.type === 'strength' || s.type === 'hypertrophy') && rest < 90)
        W(id, `repos court sur composé A (${s.type}): ${rest}s (${x.name})`, 'REPOS');
      if (x.block === 'C' && (s.type === 'strength' || s.type === 'hypertrophy') && rest > 120)
        W(id, `repos long sur isolation C: ${rest}s (${x.name})`, 'REPOS');
      // reps cohérentes avec le type de séance
      const [rlo, rhi] = repRange(x.target_reps);
      if (s.type === 'strength' && x.block === 'A' && rlo >= 8) W(id, `séance force, composé A à ${x.target_reps} reps (attendu lourd ≤6) (${x.name})`, 'REPS');
      if (s.type === 'endurance' && rhi < 12) W(id, `séance endurance, ${x.target_reps} reps (attendu ≥12-15) (${x.name})`, 'REPS');
    }
  }

  // ── VOLUME (hypertrophie/endurance/mixte, objectifs par zone) ──────────────
  const isStrengthOnly = roles.hasStrengthMov && roles.primary.size === 0 && roles.secondary.size === 0;
  if (!isStrengthOnly && (roles.primary.size || roles.secondary.size)) {
    const { direct, eff } = weeklyVolume(p);
    const band = MAV_LOW[mt.level];
    // primaire ≥ MAV
    for (const mu of roles.primary) {
      const need = (BIG.has(mu) ? band.big : band.small) - 1; // tolérance 1
      if (eff[mu] < need) W(id, `primaire ${mu}: ${eff[mu]} séries eff/sem < MAV~${need}`, 'VOL-PRIMAIRE');
    }
    // secondaire ≈ MEV (pas trop bas, pas au niveau primaire)
    const mevFloor = MEV_LOW[mt.level] ?? 6;
    for (const mu of roles.secondary) {
      if (eff[mu] < mevFloor) W(id, `secondaire ${mu}: ${eff[mu]} séries eff/sem < MEV~${mevFloor}`, 'VOL-SECONDAIRE');
    }
    // écart primaire↔secondaire NET (piège "haut a plus de muscles" → per-muscle)
    if (roles.primary.size && roles.secondary.size) {
      const avg = (set) => [...set].reduce((a, m) => a + eff[m], 0) / set.size;
      const pAvg = avg(roles.primary), sAvg = avg(roles.secondary);
      if (sAvg >= pAvg - 1)
        W(id, `écart primaire↔secondaire faible: primaire≈${pAvg.toFixed(1)} vs secondaire≈${sAvg.toFixed(1)} séries eff/muscle`, 'VOL-ECART');
    }
    // volume DIRECT forcé sur un muscle NON ciblé (hors abdos = accessoire universel)
    const targeted = new Set([...roles.primary, ...roles.secondary]);
    for (const mu of MUSCLES) {
      if (mu === 'Abdominaux' || targeted.has(mu)) continue;
      if (direct[mu] >= 4) W(id, `volume dédié sur muscle NON ciblé ${mu}: ${direct[mu]} séries directes`, 'VOL-NONCIBLE');
    }
  }

  // ── FORCE : fréquence par lift ────────────────────────────────────────────
  if (roles.hasStrengthMov) {
    const ex = movementExposures(p);
    const f = mt.weekly_frequency;
    if (f >= 4) {
      for (const [lift, c] of Object.entries(ex))
        if (c < 2) W(id, `force ${f}j: ${lift} exposé ${c}×/sem (<2× visé dès 4-5j)`);
    } else if (f === 3) {
      if (ex.squat < 2) W(id, `force 3j: squat ${ex.squat}× (viser 2×)`);
      if (ex.bench < 2) W(id, `force 3j: développé ${ex.bench}× (viser 2×)`);
    }
  }
}

// recommended unique par groupe
for (const [gk, n] of Object.entries(groupRecommended)) {
  if (n !== 1) E(gk, `recommended_for_optimal=true présent ${n}× (attendu 1)`);
}

// Cohérence : un même NOM d'exo doit avoir partout le même muscle_group + secondaires
const exoDef = {};
const noteDef = (name, mg, sec) => {
  const key = (sec || []).slice().sort().join('|');
  exoDef[name] = exoDef[name] || { mg: new Set(), sec: new Set() };
  exoDef[name].mg.add(mg);
  exoDef[name].sec.add(key);
};
for (const e of CATALOG)
  for (const s of e.program.sessions)
    for (const x of s.exercises) noteDef(x.name, x.muscle_group, x.muscles_secondary);
for (const lib of LIBRARY) noteDef(lib.name, lib.muscle_group, lib.muscles_secondary);
for (const [name, d] of Object.entries(exoDef)) {
  if (d.mg.size > 1) E('COHÉRENCE', `"${name}" a des muscle_group divergents: ${[...d.mg].join(' / ')}`);
  if (d.sec.size > 1) W('COHÉRENCE', `"${name}" a des muscles_secondary divergents (${d.sec.size} variantes)`, 'COHERENCE');
}

// ── Rapport ──────────────────────────────────────────────────────────────────
console.log(`\n===== AUDIT CATALOGUE — ${CATALOG.length} programmes, ${LIBRARY.length} exos librairie =====`);
console.log(`Fichier: ${FILE}\n`);

const bySig = {};
for (const e of CATALOG) {
  const k = `${e.match.level}/${e.match.training_context}`;
  bySig[k] = (bySig[k] || 0) + 1;
}
console.log('Répartition:', JSON.stringify(bySig), '\n');

const byCat = (arr) => arr.reduce((m, w) => ((m[w.cat] = m[w.cat] || []).push(w.line), m), {});

if (!errors.length) console.log('✓ 0 ERREUR bloquante\n');
else {
  console.log(`✗ ${errors.length} ERREUR(S) BLOQUANTE(S):`);
  const g = byCat(errors);
  for (const [c, ls] of Object.entries(g)) { console.log(`  ── ${c} (${ls.length}) ──`); ls.forEach((l) => console.log('    ✗ ' + l)); }
  console.log('');
}

if (!warns.length) console.log('✓ 0 avertissement');
else {
  console.log(`⚠ ${warns.length} AVERTISSEMENT(S) — par catégorie:`);
  const g = byCat(warns);
  for (const [c, ls] of Object.entries(g)) {
    console.log(`  ── ${c} (${ls.length}) ──`);
    ls.slice(0, 14).forEach((l) => console.log('    ⚠ ' + l));
    if (ls.length > 14) console.log(`    … +${ls.length - 14} de plus`);
  }
}

console.log(`\n===== FIN — ${errors.length} erreur(s), ${warns.length} avertissement(s) =====`);
process.exit(errors.length ? 1 : 0);
