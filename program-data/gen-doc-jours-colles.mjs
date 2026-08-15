// Génère program-data/jours-colles.fods : les cas où un muscle revient à 24 h
// d'écart quand l'utilisateur déclare des jours d'entraînement collés.
//
// Muscles PRIMAIRES uniquement (ceux menés près de l'échec sur leur exercice
// dédié). Les synergistes ne sont jamais comptés.
//
// Convention d'écriture : *entre astérisques* = gras dans le document.
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

const rows = [];
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
          if (!communs.length) continue;
          const t = sem[k - 1].s.type || type;
          const fenetre = SRA_WINDOWS[t] || 48;
          if (fenetre <= 24) continue; // endurance : 24 h suffit
          for (const m of communs) {
            rows.push({
              muscle: m,
              programme: res.matched_program_name || '(dérivé — aucun programme du catalogue)',
              seances: `${sem[k - 1].s.day_label} → ${sem[k].s.day_label}`,
              niveau: FR_NIV[level], objectif: `${FR_TYPE[type]} · ${FR_ZONE[zone]}`,
              jours: `${n} jours collés`, couple: `${FR_JOUR[sem[k - 1].s.day]} + ${FR_JOUR[sem[k].s.day]}`,
              fenetre: `${fenetre} h`,
            });
          }
        }
      }
    }
  }
}

// ── Synthèse par muscle ─────────────────────────────────────────────────────
const parMuscle = new Map();
for (const r of rows) {
  if (!parMuscle.has(r.muscle)) parMuscle.set(r.muscle, []);
  parMuscle.get(r.muscle).push(r);
}
const CAUSE = {
  Abdominaux: ["*Ils sont dans presque toutes les séances du catalogue* (83 % des séances). Et le générateur les *ignore volontairement* quand il décide s'il faut alterner haut/bas sur jours collés — sans ça, il découperait des programmes qui n'ont pas à l'être.", '*Réduire leur présence dans le catalogue.* C\'est le seul levier : tant qu\'ils sont partout, aucune règle ne peut les espacer.'],
  Mollets: ["*Présents dans la moitié des séances*, et dans *toutes* les séances de 29 % des programmes. Sur un objectif bas du corps, il n'y a aucune autre zone avec quoi alterner.", '*Réduire leur fréquence dans les programmes bas du corps.* Même levier que les abdos.'],
};
const CAUSE_DEFAUT = ["*Il n'y a rien avec quoi alterner.* Sur trois jours collés d'une seule zone, ou sur un programme débutant à 2 jours qui répète le même contenu, le muscle revient forcément.", "*Rien à corriger.* C'est la conséquence du planning choisi, pas un défaut du programme."];

const SYNTHESE = [...parMuscle].sort((a, b) => b[1].length - a[1].length).map(([m, list]) => {
  const [cause, action] = CAUSE[m] || CAUSE_DEFAUT;
  const programmes = [...new Set(list.map((r) => r.programme))].sort();
  return [m, String(list.length), programmes.join('\n'), cause, action];
});

const DETAIL = rows
  .sort((a, b) => a.muscle.localeCompare(b.muscle) || a.programme.localeCompare(b.programme) || a.niveau.localeCompare(b.niveau))
  .map((r) => [r.muscle, r.programme, r.seances, r.niveau, r.objectif, r.jours, r.couple, r.fenetre]);

// ── Feuille 3 : les programmes du catalogue, du plus concerné au moins ──────
const parProgramme = new Map();
for (const r of rows) {
  if (!parProgramme.has(r.programme)) parProgramme.set(r.programme, { cas: 0, muscles: new Set(), niveaux: new Set() });
  const e = parProgramme.get(r.programme);
  e.cas++; e.muscles.add(r.muscle); e.niveaux.add(r.niveau);
}
const PROGRAMMES = [...parProgramme]
  .sort((a, b) => b[1].cas - a[1].cas)
  .map(([nom, e]) => [nom, String(e.cas), [...e.muscles].sort().join(', '), [...e.niveaux].sort().join(', ')]);

// ── Écriture du .fods ───────────────────────────────────────────────────────
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const paragraphes = (texte) => String(texte).split('\n').map((ligne) => {
  const morceaux = ligne.split(/\*([^*]+)\*/g);
  return `<text:p>${morceaux.map((m, i) => (i % 2 ? `<text:span text:style-name="Gras">${esc(m)}</text:span>` : esc(m))).join('')}</text:p>`;
}).join('');
const cellule = (t, style) => `<table:table-cell table:style-name="${style}" office:value-type="string">${paragraphes(t)}</table:table-cell>`;
const rangee = (cols, style) => `<table:table-row>${cols.map((c) => cellule(c, style)).join('')}</table:table-row>`;
const styleCol = (larg, p) => larg.map((l, i) => `<style:style style:name="${p}${i}" style:family="table-column"><style:table-column-properties style:column-width="${l}"/></style:style>`).join('');
const feuille = (nom, p, larg, entetes, lignes) =>
  `<table:table table:name="${esc(nom)}">${larg.map((_, i) => `<table:table-column table:style-name="${p}${i}"/>`).join('')}`
  + rangee(entetes, 'Entete') + lignes.map((l) => rangee(l, 'Corps')).join('') + '</table:table>';

const L1 = ['3.5cm', '2.2cm', '9cm', '13cm', '10cm'];
const L2 = ['3.5cm', '8cm', '9cm', '3.2cm', '6cm', '3.5cm', '5cm', '2.2cm'];
const L3 = ['9cm', '2.2cm', '11cm', '8cm'];

const doc = `<?xml version="1.0" encoding="UTF-8"?>
<office:document xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0"
 xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0"
 xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0"
 xmlns:table="urn:oasis:names:tc:opendocument:xmlns:table:1.0"
 xmlns:fo="urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0"
 office:version="1.3" office:mimetype="application/vnd.oasis.opendocument.spreadsheet">
<office:automatic-styles>
 ${styleCol(L1, 'a')}${styleCol(L2, 'b')}${styleCol(L3, 'c')}
 <style:style style:name="Gras" style:family="text"><style:text-properties fo:font-weight="bold"/></style:style>
 <style:style style:name="Entete" style:family="table-cell">
  <style:table-cell-properties fo:background-color="#6d28d9" fo:padding="0.15cm" style:vertical-align="middle" fo:border="0.02cm solid #4c1d95"/>
  <style:text-properties fo:font-weight="bold" fo:color="#ffffff" fo:font-size="11pt"/>
 </style:style>
 <style:style style:name="Corps" style:family="table-cell">
  <style:table-cell-properties fo:wrap-option="wrap" style:vertical-align="top" fo:padding="0.15cm" fo:border="0.02cm solid #d4d4d8"/>
  <style:text-properties fo:font-size="10pt"/>
 </style:style>
</office:automatic-styles>
<office:body><office:spreadsheet>
${feuille('À corriger', 'a', L1, ['Muscle', 'Nb de cas', 'Programmes du catalogue concernés', 'Pourquoi il revient', 'Quoi faire'], SYNTHESE)}
${feuille('Programmes', 'c', L3, ['Programme du catalogue', 'Nb de cas', 'Muscles en cause', 'Niveaux concernés'], PROGRAMMES)}
${feuille('Détail', 'b', L2, ['Muscle', 'Programme du catalogue', 'Les deux séances', 'Niveau', 'Objectif', 'Disponibilités', 'Les deux jours', 'Il faudrait'], DETAIL)}
</office:spreadsheet></office:body></office:document>`;

const sortie = path.join(process.cwd(), 'program-data', 'jours-colles.fods');
fs.writeFileSync(sortie, doc, 'utf8');
console.log(`✓ ${sortie}`);
console.log(`  feuille « À corriger »  : ${SYNTHESE.length} muscles`);
console.log(`  feuille « Programmes »  : ${PROGRAMMES.length} programmes du catalogue`);
console.log(`  feuille « Détail »      : ${DETAIL.length} cas`);
