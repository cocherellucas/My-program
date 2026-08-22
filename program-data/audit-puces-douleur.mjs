// AUDIT — chaque puce du formulaire douleur déclenche bien SA branche.
//
// Le libellé affiché est aussi la valeur envoyée au moteur, qui la reconnaît par
// mots-clés. Une reformulation innocente (« Coup, ça a craqué » → « Un bruit
// bizarre ») éteindrait donc silencieusement le message d'arrêt. Cet audit
// l'empêche.
//
// Trois questions :
//  1. les trois cas GRAVES sont-ils détectés comme graves, en FR et en EN ?
//  2. les puces « comment » donnent-elles chacune un conseil DIFFÉRENT ?
//     (deux puces identiques = au moins une n'est pas reconnue et retombe sur
//     la branche par défaut, celle qui dit de continuer)
//  3. idem pour les puces « quand » et les zones.
//
// Lancer :
//   npx esbuild program-data/audit-puces-douleur.mjs --bundle --platform=node \
//     --format=cjs --alias:@=./src \
//     --define:import.meta.env.VITE_SUPABASE_URL='"https://x.supabase.co"' \
//     --define:import.meta.env.VITE_SUPABASE_ANON_KEY='"k"' \
//     --outfile=<tmp>.cjs && node <tmp>.cjs
import { buildPainAdvice, isSeverePain, detectZoneFromText } from '@/lib/pain-engine';
import { OU, QUAND, COMMENT, composerNote } from '@/lib/pain-choices';
import { DICT } from '@/lib/i18n';

const LANGUES = ['fr', 'en'];
let echecs = 0;
const ko = (m) => { echecs++; console.log(`  ✗ ${m}`); };

console.log('\n██ PUCES DU FORMULAIRE DOULEUR ██');

for (const lang of LANGUES) {
  const T = (k) => DICT[lang][k] ?? DICT.fr[k] ?? k;
  console.log(`\n── ${lang.toUpperCase()} ──`);

  // 1. Zones : chaque puce doit être reconnue, et donner LA bonne zone.
  for (const z of OU) {
    const detectee = detectZoneFromText(T(z.tk));
    if (detectee !== z.id) ko(`zone « ${T(z.tk)} » → ${detectee || 'AUCUNE'} (attendu ${z.id})`);
  }

  // 2. Gravité : les trois puces rouges doivent déclencher l'arrêt, les autres non.
  const neutre = { ou: T('pd_ou_epaule'), quand: T('pd_qd_montee') };
  for (const c of COMMENT) {
    const note = composerNote({ ...neutre, comment: T(c.tk) });
    const grave = isSeverePain(note);
    if (c.grave && !grave) ko(`« ${T(c.tk) }» devrait déclencher l'arrêt et ne le fait PAS`);
    if (!c.grave && grave) ko(`« ${T(c.tk)} » déclenche l'arrêt alors qu'il ne devrait pas`);
  }

  // 3. Distinction : deux puces qui rendent le même conseil = une non reconnue.
  const distinctes = (liste, fabrique, nom) => {
    const vus = new Map();
    for (const c of liste) {
      const texte = buildPainAdvice(fabrique(T(c.tk)), lang);
      if (vus.has(texte)) ko(`${nom} : « ${T(c.tk)} » rend EXACTEMENT le même conseil que « ${vus.get(texte)} » — non reconnue`);
      else vus.set(texte, T(c.tk));
    }
  };
  distinctes(COMMENT, (v) => composerNote({ ...neutre, comment: v }), 'comment');
  distinctes(QUAND, (v) => composerNote({ ou: T('pd_ou_epaule'), quand: v, comment: T('pd_cm_gene') }), 'quand');

  // 4. Témoin : du charabia DOIT retomber sur la branche par défaut. On vérifie
  //    qu'aucune puce ne rend ce conseil-là — sinon elle ne sert à rien.
  const charabia = buildPainAdvice(composerNote({ ou: 'ekzjbvhvv', quand: 'ekzjbvhvv', comment: 'ekzjbvhvv' }), lang);
  for (const c of COMMENT) {
    const note = composerNote({ ...neutre, comment: T(c.tk) });
    if (buildPainAdvice(note, lang) === charabia) ko(`« ${T(c.tk) }» rend le conseil PAR DÉFAUT (identique au charabia)`);
  }

  if (!echecs) console.log(`  ✓ ${OU.length} zones, ${QUAND.length} moments, ${COMMENT.length} natures — toutes reconnues et distinctes`);
}

console.log(echecs === 0
  ? '\n✓ chaque puce déclenche bien sa branche\n'
  : `\n✗ ${echecs} problème(s)\n`);
process.exit(echecs === 0 ? 0 : 1);
