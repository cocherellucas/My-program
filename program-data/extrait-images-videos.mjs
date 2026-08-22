// Extrait une image par vidéo de tournage, pour identifier quel exercice
// est filmé sur quel clip.
//
// Les fichiers viennent d'un iPhone : ils sont répartis sur PLUSIEURS dossiers
// DCIM (202608_a, 202608_b…) qui se recoupent sans être inclus l'un dans
// l'autre, et un clip monté sur le téléphone apparaît en double — IMG_2446.MOV
// (original) et IMG_E2446.MOV (monté). On dédoublonne par numéro en gardant
// la version montée quand elle existe.
//
// Usage :  node program-data/extrait-images-videos.mjs <dossier-source> [dossier-sortie]
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const source = process.argv[2];
const sortie = process.argv[3] || path.join(process.cwd(), 'program-data', 'images-tournage');
if (!source || !fs.existsSync(source)) {
  console.error('Dossier source manquant ou introuvable.');
  console.error('Usage : node program-data/extrait-images-videos.mjs <dossier-source> [dossier-sortie]');
  process.exit(1);
}

// Séance de tournage : 16/08/2026, 18h20 → 20h30. Les clips des autres jours
// présents dans les mêmes dossiers (04, 05, 08/08, 17/08) ne nous concernent pas.
const DEBUT = new Date('2026-08-16T18:20:00');
const FIN = new Date('2026-08-16T20:30:00');

const duree = (f) => {
  const s = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration',
    '-of', 'default=noprint_wrappers=1:nokey=1', f], { encoding: 'utf8' }).trim();
  return Number.parseFloat(s) || 0;
};

function toutesLesVideos(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...toutesLesVideos(p));
    else if (/\.mov$/i.test(e.name)) out.push(p);
  }
  return out;
}

const brut = toutesLesVideos(source)
  .map((p) => ({ p, nom: path.basename(p), mtime: fs.statSync(p).mtime }))
  .filter((f) => f.mtime >= DEBUT && f.mtime <= FIN);

// Dédoublonnage : clé = numéro du clip, la version montée (IMG_E…) l'emporte.
const parNumero = new Map();
for (const f of brut) {
  const m = f.nom.match(/^IMG_(E?)(\d+)\.MOV$/i);
  if (!m) continue;
  const [, edite, num] = m;
  f.duree = duree(f.p);
  const actuel = parNumero.get(num);
  // Le MEME numero existe en rush (202608_a) et en version montee (202608_b),
  // sous le meme nom : seule la duree les distingue. La plus courte gagne — le
  // montage ne garde que le mouvement la ou le rush contient l'installation et
  // le rangement de la charge. A duree egale, IMG_E... (rendu explicite) gagne.
  const meilleur = !actuel
    || f.duree < actuel.duree - 0.5
    || (Math.abs(f.duree - actuel.duree) <= 0.5 && edite && !actuel.edite);
  if (meilleur) parNumero.set(num, { ...f, edite: !!edite, num: Number(num) });
}

// Un clip NON MONTE est une prise que Lucas a ecartee : filmee, puis jamais
// retaillee parce qu'elle ne lui convenait pas. On ne garde donc que les
// numeros pour lesquels un montage existe — soit une seconde version plus
// courte du meme numero, soit un rendu explicite IMG_E...
const montes = new Set();
for (const [num, garde] of parNumero) {
  const versions = brut.filter((v) => (v.nom.match(/^IMG_E?(\d+)/i) || [])[1] === num);
  const durees = versions.map((v) => v.duree ?? duree(v.p));
  const ecart = Math.max(...durees) - Math.min(...durees);
  if (garde.edite || ecart > 0.5) montes.add(num);
}
for (const num of [...parNumero.keys()]) if (!montes.has(num)) parNumero.delete(num);

const clips = [...parNumero.values()].sort((a, b) => a.mtime - b.mtime || a.num - b.num);
if (!clips.length) { console.error('Aucun clip trouvé dans la plage du 16/08 18h20-20h30.'); process.exit(1); }

fs.mkdirSync(sortie, { recursive: true });

console.log(`\n██ EXTRACTION — ${clips.length} clips ██\n`);
const index = [];
clips.forEach((c, i) => {
  const rang = String(i + 1).padStart(2, '0');
  const base = `${rang}_${c.nom.replace(/\.mov$/i, '')}`;
  const d = c.duree ?? duree(c.p);
  // Image prise au milieu du mouvement : c'est là que l'exercice est le plus
  // reconnaissable (au départ la personne s'installe, à la fin elle repose).
  const t = d > 2 ? d / 2 : 0;
  const dest = path.join(sortie, `${base}.jpg`);
  try {
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-ss', String(t), '-i', c.p,
      '-frames:v', '1', '-vf', 'scale=640:-2', dest]);
    const heure = c.mtime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    console.log(`  ${rang}  ${c.nom.padEnd(16)} ${heure}  ${d.toFixed(1).padStart(5)}s  →  ${path.basename(dest)}`);
    index.push({ rang: i + 1, fichier: c.nom, heure, duree: Number(d.toFixed(1)), source: path.dirname(c.p).split(/[\/]/).pop(), image: path.basename(dest), exercice: '' });
  } catch (e) {
    console.log(`  ${rang}  ${c.nom.padEnd(18)} ÉCHEC : ${e.message.split('\n')[0]}`);
  }
});

fs.writeFileSync(path.join(sortie, '_index.json'), JSON.stringify(index, null, 2), 'utf8');
console.log(`\n  ${index.length} image(s) dans ${sortie}`);
console.log('  tableau à compléter : _index.json (champ "exercice")\n');
