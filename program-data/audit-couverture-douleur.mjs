// AUDIT EXHAUSTIF — les 336 combinaisons du formulaire douleur.
//
// Depuis que les trois champs sont des PUCES, l'espace des réponses possibles
// est fini : 6 zones × 7 moments × 8 natures. On peut donc toutes les produire
// et vérifier qu'aucune ne tombe à côté, au lieu d'espérer.
//
// Ce qu'on cherche :
//  1. une réponse non vide pour chaque combinaison ;
//  2. les 3 natures GRAVES donnent TOUJOURS l'arrêt, quels que soient la zone et
//     le moment — et jamais autre chose ;
//  3. les 5 natures bénignes ne déclenchent JAMAIS un arrêt par accident ;
//  4. le conseil de zone apparaît bien pour chaque zone ;
//  5. le moment change vraiment la réponse (sinon la puce ne sert à rien) ;
//  6. aucune réponse contradictoire (« arrête » et « continue » ensemble).
//
// Lancer :
//   npx esbuild program-data/audit-couverture-douleur.mjs --bundle --platform=node \
//     --format=cjs --alias:@=./src --loader:.js=jsx \
//     --define:import.meta.env.VITE_SUPABASE_URL='"https://x.supabase.co"' \
//     --define:import.meta.env.VITE_SUPABASE_ANON_KEY='"k"' \
//     --outfile=<tmp>.cjs && node <tmp>.cjs
import { buildPainAdvice, isSeverePain } from '@/lib/pain-engine';
import { OU, QUAND, COMMENT, composerNote } from '@/lib/pain-choices';
import { DICT } from '@/lib/i18n';

const LANGUES = ['fr', 'en'];
let echecs = 0;
const ko = (m) => { echecs++; console.log(`  ✗ ${m}`); };

// Marqueurs de l'arrêt, dans les deux langues.
const EST_ARRET = (txt) => /Stop\s*:|Arrête cet exercice|Stop: end this exercise|Arrête cet|\*\*Stop/i.test(txt)
  || /arrête cet exercice|stop this exercise/i.test(txt);
const EST_CONTINUE = (txt) => /Continue dans l'amplitude|Keep working in the/i.test(txt);

for (const lang of LANGUES) {
  const T = (k) => DICT[lang][k] ?? DICT.fr[k] ?? k;
  console.log(`\n██ COUVERTURE DOULEUR — ${lang.toUpperCase()} ██\n`);

  const toutes = [];
  for (const z of OU) {
    for (const q of QUAND) {
      for (const c of COMMENT) {
        const note = composerNote({ ou: T(z.tk), quand: T(q.tk), comment: T(c.tk) });
        toutes.push({ z, q, c, note, texte: buildPainAdvice(note, lang), grave: isSeverePain(note) });
      }
    }
  }

  console.log(`  combinaisons testées : ${toutes.length}`);

  // 1. Aucune réponse vide ou ridiculement courte.
  const vides = toutes.filter((x) => !x.texte || x.texte.trim().length < 40);
  if (vides.length) ko(`${vides.length} combinaison(s) sans vraie réponse — ex. ${vides[0].z.id}/${vides[0].q.id}/${vides[0].c.id}`);
  else console.log(`  ✓ les ${toutes.length} donnent une réponse`);

  // 2. Les natures graves : toujours l'arrêt.
  const graves = toutes.filter((x) => x.c.grave);
  const gravesRatees = graves.filter((x) => !x.grave || !EST_ARRET(x.texte));
  if (gravesRatees.length) ko(`${gravesRatees.length}/${graves.length} cas GRAVES ne donnent pas l'arrêt — ex. ${gravesRatees[0].c.id} sur ${gravesRatees[0].z.id}`);
  else console.log(`  ✓ les ${graves.length} cas graves donnent tous « arrête et consulte »`);

  // 3. Les natures bénignes ne déclenchent jamais l'arrêt.
  const benignes = toutes.filter((x) => !x.c.grave);
  const faussesAlertes = benignes.filter((x) => x.grave || EST_ARRET(x.texte));
  if (faussesAlertes.length) ko(`${faussesAlertes.length} cas bénins déclenchent un arrêt à tort — ex. ${faussesAlertes[0].c.id}/${faussesAlertes[0].q.id}`);
  else console.log(`  ✓ aucun des ${benignes.length} cas bénins ne déclenche d'arrêt à tort`);

  // 4. Jamais « arrête » ET « continue » dans la même réponse.
  const contradictoires = toutes.filter((x) => EST_ARRET(x.texte) && EST_CONTINUE(x.texte));
  if (contradictoires.length) ko(`${contradictoires.length} réponse(s) disent à la fois d'arrêter et de continuer`);
  else console.log('  ✓ aucune réponse contradictoire');

  // 5. Le conseil de ZONE apparaît (sur les cas bénins — les graves court-circuitent).
  for (const z of OU) {
    const pourZone = benignes.filter((x) => x.z.id === z.id);
    const avecTip = pourZone.filter((x) => x.texte.length > 0 && /Pour (le|la|l')|For the/i.test(x.texte));
    if (avecTip.length === 0) ko(`aucun conseil spécifique à la zone « ${T(z.tk)} »`);
  }
  console.log('  ✓ chaque zone reçoit son conseil spécifique');

  // 6. Le MOMENT change la réponse : à zone et nature fixées, les 7 moments
  //    doivent produire plusieurs réponses différentes.
  let momentsInutiles = 0;
  for (const z of OU) {
    for (const c of COMMENT) {
      if (c.grave) continue; // normal : la gravité court-circuite le moment
      const variantes = new Set(toutes.filter((x) => x.z.id === z.id && x.c.id === c.id).map((x) => x.texte));
      if (variantes.size < 2) momentsInutiles++;
    }
  }
  if (momentsInutiles) ko(`${momentsInutiles} couple(s) zone/nature où le MOMENT ne change rien`);
  else console.log('  ✓ le moment choisi change bien la réponse');

  // 7. Diversité générale : si tout se ressemble, les puces ne servent à rien.
  const distinctes = new Set(toutes.map((x) => x.texte)).size;
  console.log(`  réponses distinctes : ${distinctes} sur ${toutes.length}`);
  if (distinctes < 40) ko(`trop peu de réponses distinctes (${distinctes}) — les puces n'influencent pas assez`);

  // 8. Longueur : une réponse lue entre deux séries doit rester courte.
  const tropLongues = toutes.filter((x) => x.texte.length > 900);
  if (tropLongues.length) {
    console.log(`  ⚠ ${tropLongues.length} réponse(s) dépassent 900 caractères (max ${Math.max(...toutes.map((x) => x.texte.length))})`);
  }
}

console.log(echecs === 0 ? '\n✓ couverture complète\n' : `\n✗ ${echecs} problème(s)\n`);
process.exit(echecs === 0 ? 0 : 1);
