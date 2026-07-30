const fs = require('fs');
const ROOT = 'c:/Users/coche/OneDrive/Desktop/my-program (1)';
const db = fs.readFileSync(ROOT + '/src/lib/exercise-database.js', 'utf8');
const canon = new Set();
const re = /name:\s*'((?:[^'\\]|\\.)*)'/g;
let m;
while ((m = re.exec(db))) canon.add(m[1].replace(/\\'/g, "'").toLowerCase());

let txt = fs.readFileSync(ROOT + '/src/lib/pre-generated-programs.js', 'utf8');
txt = txt.slice(txt.indexOf('[')); txt = txt.slice(0, txt.lastIndexOf(']') + 1);
const P = JSON.parse(txt);

let badName = 0, dup = 0, noZone = 0, notesKept = 0;
const names = new Set(), bad = new Set(), dups = new Set();
for (const e of P) for (const s of e.program.sessions) {
  if (!s.active_zones || !s.active_zones.length) noZone++;
  const seen = new Set();
  for (const x of s.exercises) {
    names.add(x.name);
    if (!canon.has(x.name.toLowerCase())) { badName++; bad.add(x.name); }
    if (seen.has(x.name)) { dup++; dups.add(`${e.match.level}/${e.match.training_context}/${e.match.objectives_signature}/${e.match.weekly_frequency}j :: ${s.day_label} :: ${x.name}`); }
    seen.add(x.name);
    if (x.notes) notesKept++;
  }
}
console.log('programmes:', P.length);
console.log('noms distincts:', names.size);
console.log('noms NON résolus:', badName, bad.size ? [...bad] : '');
console.log('doublons intra-séance:', dup);
if (dups.size) [...dups].forEach((d) => console.log('   ⚠ ' + d));
console.log('séances sans active_zones:', noZone);
console.log('exos avec notes (cues) préservés:', notesKept);
