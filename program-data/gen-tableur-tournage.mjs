// Tableur de relecture des clips : une ligne par clip, la VIGNETTE EMBARQUEE
// dans la cellule (base64), et une colonne a remplir. Tout est dans le fichier :
// aucun chemin externe, il s'ouvre n'importe ou sans casser les images.
import fs from 'node:fs';
import path from 'node:path';

const dossier = path.join(process.cwd(), 'program-data', 'images-tournage');
const idx = JSON.parse(fs.readFileSync(path.join(dossier, '_index.json'), 'utf8'));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Les vignettes plein format alourdiraient le fichier pour rien : la cellule
// fait 6 cm de large, on encode a la taille d'affichage.
const LARGEUR_CM = 6;
const HAUTEUR_CM = 3.38; // ratio 16/9

const lignes = idx.map((e) => {
  const img = fs.readFileSync(path.join(dossier, e.image)).toString('base64');
  const vignette = `<table:table-cell table:style-name="Img" office:value-type="string">`
    + `<text:p><draw:frame draw:name="v${e.rang}" text:anchor-type="as-char"`
    + ` svg:width="${LARGEUR_CM}cm" svg:height="${HAUTEUR_CM}cm" draw:z-index="0">`
    + `<draw:image><office:binary-data>${img}</office:binary-data></draw:image>`
    + `</draw:frame></text:p></table:table-cell>`;
  const c = (t, st) => `<table:table-cell table:style-name="${st}" office:value-type="string">`
    + `<text:p>${esc(t)}</text:p></table:table-cell>`;
  return '<table:table-row table:style-name="ro">'
    + c(String(e.rang).padStart(2, '0'), 'Num')
    + vignette
    + c(e.exercice || '', e.exercice ? 'Fait' : 'AFaire')
    + c(e.exercice ? '' : (e.hypothese || ''), 'Note')
    + c(`${e.fichier} · ${e.heure} · ${e.duree}s`, 'Note')
    + '</table:table-row>';
}).join('');

const LARG = ['1.6cm', `${LARGEUR_CM + 0.3}cm`, '8cm', '7cm', '6cm'];
const ENTETE = ['N°', 'Image', 'Exercice', 'Mon hypothèse', 'Fichier source'];

const doc = `<?xml version="1.0" encoding="UTF-8"?>
<office:document xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0"
 xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0"
 xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0"
 xmlns:table="urn:oasis:names:tc:opendocument:xmlns:table:1.0"
 xmlns:draw="urn:oasis:names:tc:opendocument:xmlns:drawing:1.0"
 xmlns:svg="urn:oasis:names:tc:opendocument:xmlns:svg-compatible:1.0"
 xmlns:fo="urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0"
 office:version="1.3" office:mimetype="application/vnd.oasis.opendocument.spreadsheet">
<office:automatic-styles>
 ${LARG.map((l, i) => `<style:style style:name="c${i}" style:family="table-column"><style:table-column-properties style:column-width="${l}"/></style:style>`).join('')}
 <style:style style:name="ro" style:family="table-row"><style:table-row-properties style:row-height="${HAUTEUR_CM + 0.25}cm" style:use-optimal-row-height="false"/></style:style>
 <style:style style:name="Entete" style:family="table-cell">
  <style:table-cell-properties fo:background-color="#6d28d9" fo:padding="0.15cm" style:vertical-align="middle" fo:border="0.02cm solid #4c1d95"/>
  <style:text-properties fo:font-weight="bold" fo:color="#ffffff" fo:font-size="11pt"/>
 </style:style>
 <style:style style:name="Num" style:family="table-cell">
  <style:table-cell-properties fo:background-color="#ede9fe" fo:padding="0.1cm" style:vertical-align="middle" fo:border="0.02cm solid #c4b5fd"/>
  <style:text-properties fo:font-weight="bold" fo:color="#4c1d95" fo:font-size="12pt"/>
 </style:style>
 <style:style style:name="Img" style:family="table-cell">
  <style:table-cell-properties fo:padding="0.05cm" style:vertical-align="middle" fo:border="0.02cm solid #e4e4e7"/>
 </style:style>
 <style:style style:name="Fait" style:family="table-cell">
  <style:table-cell-properties fo:background-color="#dcfce7" fo:wrap-option="wrap" style:vertical-align="middle" fo:padding="0.12cm" fo:border="0.02cm solid #86efac"/>
  <style:text-properties fo:font-size="11pt" fo:color="#14532d"/>
 </style:style>
 <style:style style:name="AFaire" style:family="table-cell">
  <style:table-cell-properties fo:background-color="#fed7aa" fo:wrap-option="wrap" style:vertical-align="middle" fo:padding="0.12cm" fo:border="0.03cm solid #f97316"/>
  <style:text-properties fo:font-size="11pt" fo:font-weight="bold" fo:color="#7c2d12"/>
 </style:style>
 <style:style style:name="Note" style:family="table-cell">
  <style:table-cell-properties fo:wrap-option="wrap" style:vertical-align="middle" fo:padding="0.12cm" fo:border="0.02cm solid #e4e4e7"/>
  <style:text-properties fo:font-size="10pt" fo:color="#52525b"/>
 </style:style>
</office:automatic-styles>
<office:body><office:spreadsheet>
<table:table table:name="Clips du 16 aout">
 ${LARG.map((_, i) => `<table:table-column table:style-name="c${i}"/>`).join('')}
 <table:table-row>${ENTETE.map((h) => `<table:table-cell table:style-name="Entete" office:value-type="string"><text:p>${esc(h)}</text:p></table:table-cell>`).join('')}</table:table-row>
 ${lignes}
</table:table>
</office:spreadsheet></office:body>
</office:document>`;

const sortie = path.join(process.cwd(), 'program-data', 'clips-a-nommer.fods');
fs.writeFileSync(sortie, doc, 'utf8');
const mo = (fs.statSync(sortie).size / 1048576).toFixed(1);
console.log(`ecrit : ${sortie}`);
console.log(`${idx.length} lignes | ${mo} Mo | ${idx.filter((e) => !e.exercice).length} a remplir`);
