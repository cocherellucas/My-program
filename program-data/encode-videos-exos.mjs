// Encode une BOUCLE courte par exercice filme, depuis les rushes montes.
//
// Cible : 480p, H.264, muet, ~2,5 s. Mesure faite sur un clip reel : 37 Ko,
// soit MOINS que les deux JPEG que la boucle remplace (50 Ko) — la video coute
// donc moins cher que le diaporama qu'elle remplace, tout en montrant
// l'amplitude et le tempo qu'une image fixe ne peut pas rendre.
//
// Sortie dans public/exos/ : servi par Vite, embarque au build, donc disponible
// hors-ligne et sans dependre d'un depot GitHub tiers.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const FFMPEG = process.env.FFMPEG || 'ffmpeg';
const racine = process.cwd();
const idx = JSON.parse(fs.readFileSync(path.join(racine, 'program-data/images-tournage/_index.json'), 'utf8'));
const sources = process.argv[2] || 'C:/Users/coche/Videos/exos-coach';
const sortie = path.join(racine, 'public', 'exos');
fs.mkdirSync(sortie, { recursive: true });

// Nom de fichier stable et sans accent, derive du nom d'exercice.
const slug = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function trouver(nomFichier) {
  const pile = [sources];
  while (pile.length) {
    const d = pile.pop();
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) pile.push(p);
      else if (e.name === nomFichier) return p;
    }
  }
  return null;
}

const DUREE = 2.5;
const carte = {};
let ok = 0, rates = 0;

for (const c of idx.filter((e) => e.exercice)) {
  const src = trouver(c.fichier);
  if (!src) { console.log(`  ✗ ${c.rang} source introuvable : ${c.fichier}`); rates++; continue; }
  // Les coupes durent 4 a 13 s et contiennent plusieurs repetitions. On prend
  // une fenetre CENTREE : le premier rep sert souvent de mise en place, le
  // dernier se degrade. Le milieu est la repetition la plus propre.
  const debut = Math.max(0, (c.duree - DUREE) / 2);
  const nom = `${slug(c.exercice)}.mp4`;
  try {
    execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-ss', String(debut), '-t', String(DUREE),
      '-i', src, '-vf', 'scale=480:-2,fps=20', '-an', '-c:v', 'libx264', '-crf', '30',
      '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
      path.join(sortie, nom)]);
    const ko = Math.round(fs.statSync(path.join(sortie, nom)).size / 1024);
    carte[c.exercice] = `/exos/${nom}`;
    console.log(`  ${String(c.rang).padStart(2, '0')}  ${c.exercice.padEnd(34)} ${String(ko).padStart(4)} Ko`);
    ok++;
  } catch (e) {
    console.log(`  ✗ ${c.rang} ${c.exercice} : ${String(e.message).split('\n')[0].slice(0, 60)}`);
    rates++;
  }
}

fs.writeFileSync(path.join(racine, 'src/lib/exercise-videos.json'), JSON.stringify(carte, null, 2) + '\n', 'utf8');
const total = Object.keys(carte).reduce((s, k) => s + fs.statSync(path.join(sortie, path.basename(carte[k]))).size, 0);
console.log(`\n  ${ok} boucle(s) encodee(s), ${rates} echec(s)`);
console.log(`  poids total : ${(total / 1048576).toFixed(2)} Mo`);
console.log('  carte ecrite : src/lib/exercise-videos.json');
