// Génère program-data/videos-exercices.fods — la feuille de tournage.
//
// Un exercice par ligne, groupés par MUSCLE, avec :
//   • une case à cocher pour marquer la vidéo déjà filmée ;
//   • un code couleur sur le lieu — SALLE (rouge) = impossible à filmer
//     ailleurs, donc à faire pendant la séance ; léger (orange) ; partout (vert) ;
//   • la consigne d'exécution quand elle existe dans la base ;
//   • la FRÉQUENCE de l'exercice dans le catalogue, pour filmer les plus utilisés
//     d'abord si le temps manque.
import fs from 'node:fs';
import path from 'node:path';
import { EXERCISES } from '../src/lib/exercise-database.js';
import { PRE_GENERATED_PROGRAMS } from '../src/lib/pre-generated-programs.js';
import { reglagesPoidsDuCorps } from '../src/lib/bodyweight-adjust.js';

// La base mélange le vocabulaire : `Poitrine` (données) et `Pectoraux` (app).
const NOM_MUSCLE = { Poitrine: 'Pectoraux', Abdos: 'Abdominaux' };
const muscleAffiche = (m) => NOM_MUSCLE[m] || m;

// Ordre d'affichage : les gros groupes d'abord, le reste ensuite.
const ORDRE_MUSCLES = ['Pectoraux', 'Dos', 'Épaules', 'Biceps', 'Triceps', 'Abdominaux',
  'Quadriceps', 'Ischio-jambiers', 'Fessiers', 'Mollets', 'Trapèzes', 'Avant-bras',
  'Abducteurs', 'Adducteurs'];

// Matériel qu'on ne trouve qu'en salle : machines, poulies, racks, barres
// olympiques, bancs. Tout le reste (haltères, élastiques, barre de traction…)
// peut exister à la maison ou dans un parc — d'où le niveau intermédiaire.
const SALLE = /machine|poulie|câble|rack|smith|leg |pec deck|hack squat|belt squat|ghd|chaise romaine|captain chair|trap bar|barre olympique|barre ez|banc |tirage vertical|leg press|leg extension|leg curl|station câbles/i;

const lieuDe = (e) => {
  const opts = e.equipmentOptions || [];
  if (!opts.length || opts.some((o) => !o || !o.length)) return 'partout';
  // Une seule option réalisable hors salle suffit à sortir du rouge.
  const horsSalle = opts.some((o) => !o.some((m) => SALLE.test(m)));
  return horsSalle ? 'leger' : 'salle';
};

// Fréquence dans le catalogue : combien de créneaux occupe cet exercice.
const frequence = new Map();
for (const p of PRE_GENERATED_PROGRAMS) {
  for (const s of p.program.sessions) {
    for (const x of s.exercises) frequence.set(x.name, (frequence.get(x.name) || 0) + 1);
  }
}

// ── Regroupement par muscle ─────────────────────────────────────────────────
const parMuscle = new Map();
for (const e of EXERCISES) {
  const m = muscleAffiche((e.muscles?.primary || [])[0] || '—');
  if (!parMuscle.has(m)) parMuscle.set(m, []);
  parMuscle.get(m).push(e);
}
const muscles = [...parMuscle.keys()].sort((a, b) => {
  const ia = ORDRE_MUSCLES.indexOf(a); const ib = ORDRE_MUSCLES.indexOf(b);
  return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib) || a.localeCompare(b);
});

const RANG_LIEU = { salle: 0, leger: 1, partout: 2 };
const LIBELLE_LIEU = { salle: 'SALLE', leger: 'Matériel léger', partout: 'Partout' };

// ── Lignes ──────────────────────────────────────────────────────────────────
const LIGNES = [];
let totalSalle = 0;
for (const m of muscles) {
  const liste = parMuscle.get(m).sort((a, b) => {
    const la = lieuDe(a); const lb = lieuDe(b);
    return RANG_LIEU[la] - RANG_LIEU[lb]
      || (frequence.get(b.name) || 0) - (frequence.get(a.name) || 0)
      || a.name.localeCompare(b.name);
  });
  const nbSalle = liste.filter((e) => lieuDe(e) === 'salle').length;
  totalSalle += nbSalle;
  LIGNES.push({ type: 'titre', cols: [
    '', `▼ ${m.toUpperCase()}`, `${liste.length} exercice(s)`, `dont ${nbSalle} en salle`, '', '', '', '',
  ] });

  for (const e of liste) {
    const lieu = lieuDe(e);
    const materiel = (e.equipmentOptions || [])
      .filter((o) => o && o.length)
      .sort((a, b) => a.length - b.length)[0];
    const vigilance = [];
    if (e.failureAllowed === false) vigilance.push("*Ne pas aller à l'échec* — lift technique");
    if (e.fallback) vigilance.push('Exercice de *repli* (improvisé) : montre bien le montage');
    const reglages = reglagesPoidsDuCorps(e.name);
    if (reglages) vigilance.push('Poids du corps : montre aussi la *version facile et la version dure*');

    LIGNES.push({ type: 'exo', lieu, cols: [
      '', // case à cocher
      e.name,
      LIBELLE_LIEU[lieu],
      materiel ? materiel.join(' + ') : 'aucun',
      String(frequence.get(e.name) || 0),
      `${e.type === 'compound' ? 'polyarticulaire' : 'isolation'} · bloc ${e.block || '—'}`,
      e.cue || '*— aucune consigne dans la base —*',
      vigilance.join('\n'),
    ] });
  }
  LIGNES.push({ type: 'vide', cols: ['', '', '', '', '', '', '', ''] });
}

// ── Écriture du .fods ───────────────────────────────────────────────────────
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const paragraphes = (texte) => String(texte).split('\n').map((ligne) => {
  const morceaux = ligne.split(/\*([^*]+)\*/g);
  return `<text:p>${morceaux.map((mo, i) => (i % 2
    ? `<text:span text:style-name="Gras">${esc(mo)}</text:span>`
    : esc(mo))).join('')}</text:p>`;
}).join('');
const cellule = (t, style) => `<table:table-cell table:style-name="${style}" office:value-type="string">${paragraphes(t)}</table:table-cell>`;

const styleDe = (ligne, i) => {
  if (ligne.type === 'titre') return 'Titre';
  if (ligne.type === 'vide') return 'Corps';
  if (i === 0) return 'Case';
  if (i === 2) return ligne.lieu === 'salle' ? 'Salle' : ligne.lieu === 'leger' ? 'Leger' : 'Partout';
  return 'Corps';
};
const rangee = (ligne) => `<table:table-row>${ligne.cols
  .map((c, i) => cellule(c, styleDe(ligne, i))).join('')}</table:table-row>`;

const LARG = ['2.2cm', '7.5cm', '3.4cm', '6cm', '2.6cm', '4.4cm', '15cm', '7cm'];
const ENTETE = ['☐ Faite', 'Exercice', 'Lieu', 'Matériel (option la plus simple)',
  'Fréq.', 'Type', "Consigne d'exécution", 'Vigilance au tournage'];

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
 <style:style style:name="Titre" style:family="table-cell">
  <style:table-cell-properties fo:background-color="#ede9fe" fo:padding="0.12cm" style:vertical-align="middle" fo:border="0.02cm solid #c4b5fd"/>
  <style:text-properties fo:font-weight="bold" fo:color="#4c1d95" fo:font-size="11pt"/>
 </style:style>
 <style:style style:name="Corps" style:family="table-cell">
  <style:table-cell-properties fo:wrap-option="wrap" style:vertical-align="top" fo:padding="0.1cm" fo:border="0.02cm solid #e4e4e7"/>
  <style:text-properties fo:font-size="10pt"/>
 </style:style>
 <style:style style:name="Case" style:family="table-cell">
  <style:table-cell-properties fo:background-color="#fffbeb" fo:padding="0.1cm" style:vertical-align="middle" fo:border="0.06cm solid #a16207"/>
  <style:text-properties fo:font-size="14pt" fo:font-weight="bold" fo:color="#a16207"/>
 </style:style>
 <style:style style:name="Salle" style:family="table-cell">
  <style:table-cell-properties fo:background-color="#fecaca" fo:padding="0.1cm" style:vertical-align="middle" fo:border="0.02cm solid #b91c1c"/>
  <style:text-properties fo:font-size="10pt" fo:font-weight="bold" fo:color="#7f1d1d"/>
 </style:style>
 <style:style style:name="Leger" style:family="table-cell">
  <style:table-cell-properties fo:background-color="#fed7aa" fo:padding="0.1cm" style:vertical-align="middle" fo:border="0.02cm solid #c2410c"/>
  <style:text-properties fo:font-size="10pt" fo:color="#7c2d12"/>
 </style:style>
 <style:style style:name="Partout" style:family="table-cell">
  <style:table-cell-properties fo:background-color="#bbf7d0" fo:padding="0.1cm" style:vertical-align="middle" fo:border="0.02cm solid #15803d"/>
  <style:text-properties fo:font-size="10pt" fo:color="#14532d"/>
 </style:style>
</office:automatic-styles>
<office:body><office:spreadsheet>
<table:table table:name="Tournage vidéos">${LARG.map((_, i) => `<table:table-column table:style-name="c${i}"/>`).join('')}
<table:table-row>${ENTETE.map((t) => cellule(t, 'Entete')).join('')}</table:table-row>
${LIGNES.map(rangee).join('')}
</table:table>
</office:spreadsheet></office:body></office:document>`;

const sortie = path.join(process.cwd(), 'program-data', 'videos-exercices.fods');
fs.writeFileSync(sortie, doc, 'utf8');

const sansConsigne = EXERCISES.filter((e) => !e.cue).length;
console.log(`✓ ${sortie}`);
console.log(`  ${EXERCISES.length} exercices · ${muscles.length} muscles · ${LIGNES.length} lignes`);
console.log(`  SALLE OBLIGATOIRE : ${totalSalle}`);
console.log(`  sans consigne     : ${sansConsigne}`);
for (const m of muscles) {
  const l = parMuscle.get(m);
  console.log(`    ${m.padEnd(16)} ${String(l.length).padStart(3)} exos · ${String(l.filter((e) => lieuDe(e) === 'salle').length).padStart(2)} en salle`);
}
