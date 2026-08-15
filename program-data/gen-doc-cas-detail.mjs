// Génère program-data/cas-detail.fods : UN cas complet par muscle en cause.
//
// Pour chaque muscle qui revient à 24 h sur jours collés, on prend le premier
// cas rencontré et on déroule TOUT le programme : jours, séances, exercices,
// séries × répétitions, repos. De quoi juger sur pièce.
//
// Muscles PRIMAIRES uniquement (`muscle_group`) — les synergistes ne comptent
// pas, ils ne sont jamais menés à l'échec.
import fs from 'node:fs';
import path from 'node:path';
import { buildActivationResult } from '../src/lib/program-activation.js';
import { SRA_WINDOWS } from '../src/lib/coaching-engine.js';

const ORDRE = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const FR_JOUR = { monday: 'lundi', tuesday: 'mardi', wednesday: 'mercredi', thursday: 'jeudi', friday: 'vendredi', saturday: 'samedi', sunday: 'dimanche' };
const FR_ZONE = { full_body: 'corps entier', upper_body: 'haut du corps', lower_body: 'bas du corps' };
const FR_TYPE = { hypertrophy: 'hypertrophie', strength: 'force', endurance: 'endurance' };
const FR_NIV = { beginner: 'débutant', intermediate: 'intermédiaire', advanced: 'avancé' };

const NIVEAUX = ['beginner', 'intermediate', 'advanced'];
const ZONES = ['full_body', 'upper_body', 'lower_body'];
const TYPES = ['strength', 'hypertrophy', 'endurance'];

// Premier cas rencontré par muscle.
const cas = new Map();

for (const level of NIVEAUX) {
  for (const zone of ZONES) {
    for (const type of TYPES) {
      for (let n = 2; n <= 5; n++) {
        const jours = ORDRE.slice(0, n);
        const user = {
          level, training_context: 'full_gym', equipment: '[]',
          availability_optimal: false, available_days: jours, frequency_max: n,
          duration_per_day: Object.fromEntries(jours.map((d) => [d, 90])),
        };
        let res;
        try { res = await buildActivationResult(user, [{ type, zone, priority: 'primary' }]); } catch { continue; }
        const sem = (res?.sessions || []).filter((s) => s.week === 1)
          .map((s) => ({ s, i: ORDRE.indexOf(s.day) })).sort((a, b) => a.i - b.i);

        for (let k = 1; k < sem.length; k++) {
          if (sem[k].i - sem[k - 1].i !== 1) continue;
          const a = new Set((sem[k - 1].s.active_zones || []).map((z) => z.muscle_group));
          const b = new Set((sem[k].s.active_zones || []).map((z) => z.muscle_group));
          const communs = [...a].filter((m) => b.has(m));
          const t = sem[k - 1].s.type || type;
          const fenetre = SRA_WINDOWS[t] || 48;
          if (fenetre <= 24) continue;
          for (const m of communs) {
            if (cas.has(m)) continue;
            cas.set(m, {
              muscle: m, res, sem, level, zone, type, n,
              jourA: sem[k - 1].s.day, jourB: sem[k].s.day, fenetre,
            });
          }
        }
      }
    }
  }
}

// ── Mise à plat : une ligne par exercice ────────────────────────────────────
const LIGNES = [];
for (const [muscle, c] of [...cas].sort()) {
  const enCause = new Set([c.jourA, c.jourB]);
  LIGNES.push([
    `▼ ${muscle}`,
    c.res.matched_program_name || '(dérivé)',
    `${FR_NIV[c.level]} · ${FR_TYPE[c.type]} · ${FR_ZONE[c.zone]}`,
    `${c.n} jours collés (${ORDRE.slice(0, c.n).map((d) => FR_JOUR[d]).join(', ')})`,
    `*${FR_JOUR[c.jourA]} + ${FR_JOUR[c.jourB]}* — il faudrait ${c.fenetre} h, il y a 24 h`,
    '', '', '',
  ]);
  for (const { s } of c.sem) {
    const marque = enCause.has(s.day) ? '  ⚠' : '';
    LIGNES.push(['', '', '', `*${FR_JOUR[s.day]}*${marque}`, `*${s.day_label}*`, `séance ${FR_TYPE[s.type] || s.type}`, `${s.exercises.length} exos`, `${s.estimated_duration} min`]);
    for (const x of s.exercises) {
      const cible = x.muscle_group === muscle ? '◄ le muscle en cause' : '';
      LIGNES.push(['', '', '', '', `   ${x.name}`, x.muscle_group, `${x.sets} × ${x.target_reps}`, `${x.rest_seconds}s ${cible}`]);
    }
  }
  LIGNES.push(['', '', '', '', '', '', '', '']);
}

// ── Écriture du .fods ───────────────────────────────────────────────────────
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const paragraphes = (texte) => String(texte).split('\n').map((ligne) => {
  const morceaux = ligne.split(/\*([^*]+)\*/g);
  return `<text:p>${morceaux.map((m, i) => (i % 2 ? `<text:span text:style-name="Gras">${esc(m)}</text:span>` : esc(m))).join('')}</text:p>`;
}).join('');
const cellule = (t, style) => `<table:table-cell table:style-name="${style}" office:value-type="string">${paragraphes(t)}</table:table-cell>`;
const rangee = (cols, style) => `<table:table-row>${cols.map((c) => cellule(c, style)).join('')}</table:table-row>`;
const LARG = ['3.5cm', '8cm', '7cm', '6.5cm', '9cm', '4cm', '3cm', '5cm'];

const doc = `<?xml version="1.0" encoding="UTF-8"?>
<office:document xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0"
 xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0"
 xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0"
 xmlns:table="urn:oasis:names:tc:opendocument:xmlns:table:1.0"
 xmlns:fo="urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0"
 office:version="1.3" office:mimetype="application/vnd.oasis.opendocument.spreadsheet">
<office:automatic-styles>
 ${LARG.map((l, i) => `<style:style style:name="c${i}" style:family="table-column"><style:table-column-properties style:column-width="${l}"/></style:style>`).join('')}
 <style:style style:name="Gras" style:family="text"><style:text-properties fo:font-weight="bold"/></style:style>
 <style:style style:name="Entete" style:family="table-cell">
  <style:table-cell-properties fo:background-color="#6d28d9" fo:padding="0.15cm" style:vertical-align="middle" fo:border="0.02cm solid #4c1d95"/>
  <style:text-properties fo:font-weight="bold" fo:color="#ffffff" fo:font-size="11pt"/>
 </style:style>
 <style:style style:name="Corps" style:family="table-cell">
  <style:table-cell-properties fo:wrap-option="wrap" style:vertical-align="top" fo:padding="0.1cm" fo:border="0.02cm solid #e4e4e7"/>
  <style:text-properties fo:font-size="10pt"/>
 </style:style>
</office:automatic-styles>
<office:body><office:spreadsheet>
<table:table table:name="Un cas par muscle">${LARG.map((_, i) => `<table:table-column table:style-name="c${i}"/>`).join('')}
${rangee(['Muscle en cause', 'Programme du catalogue', 'Profil testé', 'Jour', 'Séance / Exercice', 'Muscle travaillé', 'Séries × reps', 'Repos'], 'Entete')}
${LIGNES.map((l) => rangee(l, 'Corps')).join('')}
</table:table>
</office:spreadsheet></office:body></office:document>`;

const sortie = path.join(process.cwd(), 'program-data', 'cas-detail.fods');
fs.writeFileSync(sortie, doc, 'utf8');
console.log(`✓ ${sortie}`);
console.log(`  ${cas.size} muscles, ${LIGNES.length} lignes`);
for (const [m, c] of [...cas].sort()) {
  console.log(`    ${m.padEnd(18)} ${FR_NIV[c.level]} · ${FR_TYPE[c.type]}/${FR_ZONE[c.zone]} · ${c.n}j → ${c.res.matched_program_name}`);
}
