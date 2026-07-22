// ─────────────────────────────────────────────────────────────────────────────
// SUIVI DE DOULEUR — épisodes par zone sensible.
// Une gêne signalée ouvre un "épisode" ; le coach demande la réaction (~24 h
// plus tard) et prescrit des réductions progressives (charge → séries →
// fréquence) tant que ça ne va pas mieux, puis la remontée quand ça va mieux.
// 100 % règles de code — aucune IA (compatible AI_BLOCKED).
// Épisodes stockés dans UserMemory.injuries (JSON, synchronisé entre appareils).
// ─────────────────────────────────────────────────────────────────────────────
import { base44 } from '@/api/base44Client';
import { FRAGILE_ZONE_MUSCLES } from '@/lib/coaching-engine';
import { EXERCISES } from '@/lib/exercise-database';
import { devNow } from '@/lib/dev-time';

export const ZONE_LABELS = {
  wrists: 'poignet', shoulders: 'épaule', elbows: 'coude',
  knees: 'genou', lower_back: 'bas du dos', neck: 'nuque',
};
// Avec possessif, pour les phrases (« Comment a réagi ton poignet ? »)
export const ZONE_ART = {
  wrists: 'ton poignet', shoulders: 'ton épaule', elbows: 'ton coude',
  knees: 'ton genou', lower_back: 'ton bas du dos', neck: 'ta nuque',
};

// Détecte une zone dans un texte libre (notes de séance, note de douleur) — FR + EN
export function detectZoneFromText(text) {
  const t = (text || '').toLowerCase();
  if (/poignet|wrist/.test(t)) return 'wrists';
  if (/épaule|epaule|shoulder/.test(t)) return 'shoulders';
  if (/coude|elbow/.test(t)) return 'elbows';
  if (/genou|knee/.test(t)) return 'knees';
  if (/lombaire|bas du dos|\bdos\b|lower back|low back|\bback\b/.test(t)) return 'lower_back';
  if (/cervical|nuque|\bcou\b|\bneck\b/.test(t)) return 'neck';
  return null;
}

const todayStr = () => devNow().toISOString().split('T')[0];

// ─────────────────────────────────────────────────────────────────────────────
// CONSEIL DOULEUR EN SÉANCE — arbre de décision (remplace l'IA, 100 % code).
// Analyse les champs du formulaire (Où / Quand / Comment / Autres) par
// mots-clés et compose la réponse : GRAVITÉ d'abord (court-circuite tout),
// puis nature de la douleur, moment dans le mouvement, astuce de zone,
// ancienneté. Toujours conclu par le suivi à J+1.
// ─────────────────────────────────────────────────────────────────────────────
const ZONE_TIPS = {
  wrists: { fr: 'Pour le **poignet** : garde-le **dans l\'axe de l\'avant-bras** (prise neutre si possible) — un poignet cassé en arrière sous charge est la cause la plus fréquente.', en: 'For the **wrist**: keep it **in line with the forearm** (neutral grip if possible) — a wrist bent back under load is the most common cause.' },
  shoulders: { fr: 'Pour l\'**épaule** : garde les **coudes plus près du corps** et évite les positions **bras au-dessus de la tête** tant que ça gêne.', en: 'For the **shoulder**: keep your **elbows closer to your body** and avoid **overhead positions** while it bothers you.' },
  elbows: { fr: 'Pour le **coude** : change de **largeur ou de type de prise**, et évite de **verrouiller** complètement le bras en fin de répétition.', en: 'For the **elbow**: change your **grip width or type**, and avoid fully **locking out** the arm at the end of the rep.' },
  knees: { fr: 'Pour le **genou** : aligne-le avec la **pointe de pied** et réduis la **profondeur de flexion** tant que ça gêne.', en: 'For the **knee**: keep it **aligned with your toes** and reduce **flexion depth** while it bothers you.' },
  lower_back: { fr: 'Pour le **bas du dos** : **gaine** avant chaque répétition et garde le **dos neutre** — réduis la charge plutôt que de l\'arrondir.', en: 'For the **lower back**: **brace** before each rep and keep a **neutral spine** — reduce the load rather than rounding.' },
  neck: { fr: 'Pour la **nuque** : **tête neutre**, regard horizontal — ne compense pas avec le cou pour finir les reps.', en: 'For the **neck**: **neutral head**, eyes level — don\'t compensate with your neck to finish reps.' },
};
// Zones hors suivi (pas d'épisode) mais avec un conseil quand même
const EXTRA_TIPS = [
  [/hanche|aine\b|\bhip\b|groin/, { fr: 'Pour la hanche : réduis l\'amplitude en bas du mouvement et évite les positions extrêmes (écart, flexion profonde).', en: 'For the hip: reduce range at the bottom and avoid extreme positions (wide split, deep flexion).' }],
  [/cheville|ankle/, { fr: 'Pour la cheville : surélève légèrement les talons si la mobilité limite, et évite les appuis instables.', en: 'For the ankle: slightly raise your heels if mobility is limiting, and avoid unstable footing.' }],
  [/tibia|périost|periost|shin/, { fr: 'Pour le tibia : coupe les impacts et les sauts quelques jours, ça se calme avec le repos relatif.', en: 'For the shin: cut out impacts and jumps for a few days — it settles with relative rest.' }],
  [/pec\b|pector|poitrine|chest/, { fr: 'Pour le pec : réduis l\'amplitude en position étirée (barre moins basse, haltères moins profonds).', en: 'For the chest: reduce range in the stretched position (bar less low, dumbbells less deep).' }],
  [/ischio|arrière de la cuisse|arriere de la cuisse|hamstring/, { fr: 'Pour l\'ischio : évite l\'étirement maximal sous charge et ralentis la descente.', en: 'For the hamstring: avoid max stretch under load and slow the descent.' }],
];

// Gravité d'une douleur décrite → pilote la bulle d'action en séance
// (douleur vive/coup/nerf/gonflement = on arrête l'exercice, pas d'adaptation)
export function isSeverePain(painNote) {
  const t = (painNote || '').toLowerCase();
  return /gonfl|enfl(é|e)|hématome|hematome|coup\b|craqu|claqu|déchir|dechir|lancinant|aigu(ë|e)?\b|vive|violent|insupportable|très forte|tres forte|(8|9|10)\s*\/\s*10|fourmi|engourd|picot|irradie|décharge|decharge|électri|electri/.test(t);
}

export function buildPainAdvice(painNote, lang = 'fr') {
  const all = (painNote || '').toLowerCase();
  const P = (fr, en) => (lang === 'en' ? en : fr); // sélecteur de langue
  // Champs étiquetés du formulaire (FR "où/quand/comment/autres", EN "where/when/how/other")
  const seg = (...labels) => {
    for (const label of labels) {
      const m = all.match(new RegExp(label + '\\s*:\\s*([^—]*)'));
      if (m) return m[1].trim();
    }
    return '';
  };
  const where = seg('où', 'ou', 'where');
  const when  = seg('quand', 'when');
  const how   = seg('comment', 'how');
  const extra = seg('autres', 'other');
  const howT  = how || all;  // repli : texte libre (messages de suivi du fil)
  const whenT = when || all;

  const followUp = P('_Je te redemanderai demain comment ça a réagi._', "_I'll ask you tomorrow how it reacted._");

  // 1) GRAVITÉ — on n'adapte pas, on arrête
  if (/gonfl|enfl(é|e)|hématome|hematome|bleu\b|swell|swollen|bruise/.test(all)) {
    return P(
      '**Stop : arrête cet exercice.** Un gonflement ne se travaille jamais « au travers ».\n\nMets du **froid (15-20 min)** et laisse la zone tranquille aujourd\'hui.\n\nSi c\'est encore gonflé ou douloureux demain, **consulte**. ',
      '**Stop: end this exercise.** Swelling should never be "worked through".\n\nApply **ice (15-20 min)** and leave the area alone today.\n\nIf it\'s still swollen or painful tomorrow, **see a doctor**. '
    ) + followUp;
  }
  if (/coup\b|craqu|claqu|déchir|dechir|lancinant|aigu(ë|e)?\b|vive|violent|insupportable|très forte|tres forte|(8|9|10)\s*\/\s*10|sharp|sudden|pop\b|tear|stab/.test(all)) {
    return P(
      '**Stop : arrête cet exercice.** Douleur vive ou apparue d\'un coup = on n\'insiste pas.\n\nLaisse cette zone tranquille aujourd\'hui. Si c\'est encore douloureux demain ou que ça enfle → **avis médical**. ',
      '**Stop: end this exercise.** Sharp or sudden pain = don\'t push it.\n\nLeave the area alone today. If it\'s still painful tomorrow or swells → **see a doctor**. '
    ) + followUp;
  }
  if (/fourmi|engourd|picot|irradie|décharge|decharge|électri|electri|tingl|numb|radiat|shooting/.test(all)) {
    return P(
      'Fourmillements ou douleur qui irradie = probablement un **nerf** comprimé ou étiré.\n\n**Arrête cet exercice**, secoue doucement le membre et vérifie ta **position** (prise, poignet, posture).\n\nSi ça revient à chaque série ou persiste après la séance, **consulte**. ',
      'Tingling or radiating pain = likely a compressed or stretched **nerve**.\n\n**Stop this exercise**, gently shake the limb and check your **position** (grip, wrist, posture).\n\nIf it comes back every set or persists after the workout, **see a doctor**. '
    ) + followUp;
  }

  const parts = [];
  const isConstant = /tout le temps|constant|en continu|toute l'amplitude|toute la|all the time|throughout|whole range/.test(whenT);
  let gaveAmplitudeRule = false;

  // 2) NATURE de la douleur
  if (/brûl|brul|burn/.test(howT)) {
    parts.push(P(
      'Une brûlure **dans le muscle** en fin de série est normale (accumulation métabolique) — continue si l\'exécution reste propre. Si ça brûle sur une **articulation ou un tendon** → baisse la charge de **~20 %**.',
      'A burn **in the muscle** near the end of a set is normal (metabolic build-up) — keep going if form stays clean. If it burns on a **joint or tendon** → drop the load by **~20%**.'
    ));
  } else if (/cramp/.test(howT)) {
    parts.push(P(
      '**Crampe** : étire doucement le muscle, **bois** (eau + électrolytes) et allonge le repos avant la prochaine série. Réduis le volume du jour si ça revient.',
      '**Cramp**: gently stretch the muscle, **drink** (water + electrolytes) and lengthen the rest before the next set. Cut the day\'s volume if it recurs.'
    ));
  } else if (/tension|raid|contract|nœud|noeud|tiraill|stiff|tight/.test(howT)) {
    parts.push(P(
      'Tension ou raideur : fais **2-3 répétitions lentes à vide** pour réchauffer la zone, puis reprends dans une **amplitude confortable** en montant progressivement.',
      'Tightness or stiffness: do **2-3 slow empty reps** to warm the area, then resume in a **comfortable range**, building up gradually.'
    ));
  } else if (/pinc|coinc|accroch|blocage|bloqu|pinch|catch|impinge/.test(howT)) {
    parts.push(P(
      'Pincement ou accrochage mécanique : **ne force pas dessus**. Reste **sous le point qui accroche** (amplitude réduite) et vérifie ton placement.',
      'A pinch or mechanical catch: **don\'t force through it**. Stay **below the catch point** (reduced range) and check your positioning.'
    ));
  } else if (!isConstant) {
    parts.push(P(
      'Continue dans l\'**amplitude qui ne réveille pas la douleur** : réduis l\'amplitude si besoin, **contrôle le mouvement**, arrête la série dès la gêne.',
      'Keep working in the **pain-free range**: reduce range if needed, **control the movement**, and stop the set at the first discomfort.'
    ));
    gaveAmplitudeRule = true;
  }

  // 3) MOMENT dans le mouvement
  if (/en bas|bas du mouvement|étir|etir|extension complète|extension complete|allong|bottom|stretch/.test(whenT)) {
    parts.push(P(
      'Ça arrive en **position étirée** → raccourcis l\'amplitude **en bas** et garde la tension sur la portion haute du mouvement.',
      'It happens in the **stretched position** → shorten the range **at the bottom** and keep tension on the top portion.'
    ));
  } else if (/mont|concentri|pouss|en tirant|à l\'effort|a l\'effort|push|lifting|concentric/.test(whenT)) {
    parts.push(P(
      'Ça arrive à **l\'effort** → c\'est la charge : baisse de **~20 %** maintenant et remonte progressivement sur les prochaines séances.',
      'It happens **under effort** → it\'s the load: drop by **~20%** now and build back up over the next sessions.'
    ));
  } else if (/descen|négati|negati|excentri|frein|descent|eccentric|lowering/.test(whenT)) {
    parts.push(P(
      'Ça arrive à la **descente** → **ralentis-la** et contrôle chaque centimètre ; réduis l\'amplitude si ça tire encore.',
      'It happens on the **descent** → **slow it down** and control every inch; reduce range if it still pulls.'
    ));
  } else if (/verrouill|lock|en haut|fin de mouvement|bras tendu|jambe tendue|top|lockout/.test(whenT)) {
    parts.push(P(
      'Ça arrive en **fin de mouvement** → arrête la répétition juste avant le verrouillage complet, garde une **micro-flexion**.',
      'It happens at the **end of the movement** → stop the rep just before full lockout, keep a **slight bend**.'
    ));
  } else if (/après|apres|entre les séries|entre les series|au repos|plus tard|after|between sets|at rest|later/.test(whenT)) {
    parts.push(P(
      'Ça apparaît **après l\'effort** → allonge le **repos** et surveille : si ça revient à la série suivante, baisse la charge de **~20 %**.',
      'It shows up **after the effort** → lengthen the **rest** and monitor: if it returns next set, drop the load by **~20%**.'
    ));
  } else if (/échauff|echauff|début|debut|première|premiere|warm|start|first/.test(whenT)) {
    parts.push(P(
      'C\'est en **début d\'exercice** → ajoute **1-2 séries d\'échauffement** légères et progressives avant tes séries de travail.',
      'It\'s at the **start of the exercise** → add **1-2 light warm-up sets**, building up, before your working sets.'
    ));
  } else if (isConstant) {
    parts.push(P(
      'Mal sur **toute l\'amplitude** → **passe cet exercice** aujourd\'hui et prends une variante qui ne réveille rien.',
      'Painful through **the whole range** → **skip this exercise** today and pick a variation that doesn\'t trigger it.'
    ));
  }

  // 4) Astuce spécifique à la zone
  const zone = detectZoneFromText(where || all);
  if (zone && ZONE_TIPS[zone]) {
    parts.push(ZONE_TIPS[zone][lang === 'en' ? 'en' : 'fr']);
  } else {
    const hit = EXTRA_TIPS.find(([re]) => re.test(where || all));
    if (hit) parts.push(hit[1][lang === 'en' ? 'en' : 'fr']);
  }

  // 5) Ancienneté / récurrence
  if (/semaine|mois|longtemps|chronique|toujours|souvent|récurr|recurr|chaque fois|à chaque|a chaque|week|month|chronic|always|often|every time/.test(extra || all)) {
    parts.push(P(
      'Vu que ça traîne depuis un moment, un passage chez un **kiné** vaut le coup en parallèle — en attendant on gère par la charge et l\'amplitude.',
      'Since it\'s been dragging on, seeing a **physio** is worth it in parallel — meanwhile we manage it through load and range.'
    ));
  }

  // Règle d'or — toujours rappelée
  if (!gaveAmplitudeRule && !isConstant) {
    parts.push(P(
      'Et surtout **écoute ton corps** : reste dans l\'**amplitude qui ne réveille pas la douleur** et arrête la série dès la gêne.',
      'And above all **listen to your body**: stay in the **pain-free range** and stop the set at the first discomfort.'
    ));
  }

  parts.push(followUp);
  return parts.join('\n\n');
}

// ─── IO : épisodes dans UserMemory.injuries ───
async function getMemory(userId) {
  const rows = await base44.entities.UserMemory.filter({ user_id: userId });
  return rows[0] || null;
}

export async function loadEpisodes(userId) {
  if (!userId) return [];
  try {
    const mem = await getMemory(userId);
    const raw = mem?.injuries;
    const arr = Array.isArray(raw) ? raw : JSON.parse(raw || '[]');
    return Array.isArray(arr) ? arr : [];
  } catch { return []; }
}

export async function saveEpisodes(userId, episodes) {
  if (!userId) return;
  try {
    // `resolved` maintenu pour la page Mémoire (badge Actif/Résolu) qui affiche
    // aussi les entrées historiques {zone, trigger_exercise, resolved} de l'IA.
    const rows = (episodes || []).map(e => (e.status ? { ...e, resolved: e.status === 'resolved' } : e));
    const mem = await getMemory(userId);
    if (mem) await base44.entities.UserMemory.update(mem.id, { injuries: rows });
    else await base44.entities.UserMemory.create({ user_id: userId, injuries: rows });
  } catch (e) { console.error('[pain] saveEpisodes', e); }
}

const freshEpisode = (zone) => ({
  zone, status: 'active', level: 0, started: todayStr(),
  lastCheckDate: '', betterStreak: 0, baseline: {}, removed: [], history: [],
});

// Ouvre (ou rouvre) un épisode pour une zone. Retourne le tableau mis à jour.
// Un épisode déjà actif ou en pause (stop_advised) n'est pas modifié.
export function upsertEpisode(episodes, zone) {
  const list = [...(episodes || [])];
  const idx = list.findIndex(e => e.zone === zone);
  if (idx >= 0) {
    if (list[idx].status === 'resolved') list[idx] = freshEpisode(zone);
    return list;
  }
  list.push(freshEpisode(zone));
  return list;
}

// Épisodes actifs à checker aujourd'hui : la réaction se juge à J+1 (pas le jour
// même de la gêne) et jamais plus d'une question par jour et par zone.
export function episodesToCheck(episodes) {
  const today = todayStr();
  return (episodes || []).filter(e =>
    e.status === 'active' && e.started < today && (e.lastCheckDate || '') < today
  );
}

// ── Correspondance exercice ↔ zone douloureuse ──
// Triple filet, pensé pour les exercices IMPORTÉS (muscle_group absent ou non
// standard) : 1) muscle_group direct, 2) base d'exercices retrouvée par le NOM
// (muscles primaires + secondaires), 3) mots-clés du nom du mouvement.
const ZONE_NAME_HINTS = {
  wrists:     /curl|poignet|wrist|planche|handstand|atr\b|équilibre|equilibre|maltese|pompe|push[- ]?up/,
  shoulders:  /développé|developpe|militaire|overhead|élévation|elevation|dips|planche|atr\b|handstand|front lever|traction|pull[- ]?up|pompe|push[- ]?up|oiseau|face pull/,
  elbows:     /curl|triceps|extension|dips|traction|pull[- ]?up|skull|barre au front|pompe|push[- ]?up|front lever/,
  knees:      /squat|fente|leg\b|presse|pistol|saut|jump|sissy|extension jambe/,
  lower_back: /soulevé|souleve|deadlift|good morning|hyperextension|rowing barre|squat/,
  neck:       /neck|cou\b|nuque|shrug/,
};

export function exerciseStressesZone(ex, zone) {
  const muscles = new Set(FRAGILE_ZONE_MUSCLES[zone] || []);
  if (muscles.has(ex?.muscle_group)) return true;
  const name = (ex?.name || '').toLowerCase();
  if (!name) return false;
  const dbEx = EXERCISES.find(e => e.name?.toLowerCase() === name);
  if (dbEx) {
    const all = [...(dbEx.muscles?.primary || []), ...(dbEx.muscles?.secondary || [])];
    if (all.some(m => muscles.has(m))) return true;
  }
  return ZONE_NAME_HINTS[zone]?.test(name) || false;
}

// La séance contient-elle des exercices qui sollicitent la zone ?
export function sessionTouchesZone(session, zone) {
  return (session?.exercises || []).some(ex => exerciseStressesZone(ex, zone));
}

// Zone avec possessif — version anglaise (« your wrist »)
const ZONE_ART_EN = {
  wrists: 'your wrist', shoulders: 'your shoulder', elbows: 'your elbow',
  knees: 'your knee', lower_back: 'your lower back', neck: 'your neck',
};

// Échelle de réduction — descriptions affichées à l'utilisateur (FR/EN)
const LEVEL_DETAILS = {
  fr: {
    1: 'Charge −20 % sur les exercices qui sollicitent la zone (7 prochains jours). Poids du corps : prends la variante plus simple.',
    2: 'Charge −20 % et −1 série sur les exercices qui sollicitent la zone (7 prochains jours).',
    3: 'Charge −20 %, −1 série, et ces exercices sont retirés d\'une séance sur deux (7 prochains jours).',
  },
  en: {
    1: 'Load −20% on exercises that stress the area (next 7 days). Bodyweight: take the easier variation.',
    2: 'Load −20% and −1 set on exercises that stress the area (next 7 days).',
    3: 'Load −20%, −1 set, and these exercises are removed from every other session (next 7 days).',
  },
};

// Réaction du corps → épisode mis à jour (check/historique/statut) + proposition.
// Le NIVEAU ne change qu'au moment d'Appliquer (via applyPainLevel), jamais ici.
// reaction : 'better' | 'same' | 'worse' | 'sharp'
export function computePainPrescription(episode, reaction, lang = 'fr') {
  const P = (fr, en) => (lang === 'en' ? en : fr);
  const LD = LEVEL_DETAILS[lang === 'en' ? 'en' : 'fr'];
  const art = (lang === 'en' ? ZONE_ART_EN[episode.zone] : ZONE_ART[episode.zone]) || episode.zone;
  const Art = art.charAt(0).toUpperCase() + art.slice(1);
  const today = todayStr();
  const level = episode.level || 0;
  const ep = {
    ...episode,
    lastCheckDate: today,
    history: [...(episode.history || []), { date: today, reaction }],
  };

  // ⚡ Douleur vive → garde-fou : stop + avis médical, proposition de retrait 7 jours
  if (reaction === 'sharp') {
    ep.status = 'stop_advised';
    ep.betterStreak = 0;
    return {
      episode: ep,
      proposal: {
        direction: 'stop',
        label: P(`Douleur vive : on met ${art} au repos`, `Sharp pain: we rest ${art}`),
        detail: P('Repos de la zone et avis médical conseillé. Je peux retirer les exercices qui la sollicitent des 7 prochains jours.', 'Rest the area and see a doctor. I can remove the exercises that stress it for the next 7 days.'),
        apply: { zone: episode.zone, toLevel: 4 },
      },
    };
  }

  if (reaction === 'worse') {
    ep.betterStreak = 0;
    // 3 « pire » d'affilée malgré les réductions → même garde-fou que douleur vive
    const last3 = ep.history.slice(-3);
    if (last3.length === 3 && last3.every(h => h.reaction === 'worse')) {
      ep.status = 'stop_advised';
      return {
        episode: ep,
        proposal: {
          direction: 'stop',
          label: P(`${Art} empire malgré les réductions`, `${Art} is getting worse despite the cutbacks`),
          detail: P('Repos de la zone et avis médical conseillé. Je peux retirer les exercices qui la sollicitent des 7 prochains jours.', 'Rest the area and see a doctor. I can remove the exercises that stress it for the next 7 days.'),
          apply: { zone: episode.zone, toLevel: 4 },
        },
      };
    }
    if (level >= 3) {
      return {
        episode: ep,
        proposal: {
          direction: 'none',
          label: P('On est déjà au maximum de réduction', "We're already at maximum reduction"),
          detail: P('Si ça continue d\'empirer d\'ici la prochaine fois, on mettra la zone au repos complet — et pense à consulter.', 'If it keeps worsening by next time, we\'ll fully rest the area — and consider seeing a doctor.'),
          apply: null,
        },
      };
    }
    const toLevel = Math.min(3, level + 2); // pire → on descend de 2 crans
    return {
      episode: ep,
      proposal: {
        direction: 'decrease',
        label: P(`Ça empire — on protège davantage ${art}`, `Getting worse — let's protect ${art} more`),
        detail: LD[toLevel],
        apply: { zone: episode.zone, toLevel },
      },
    };
  }

  if (reaction === 'same') {
    ep.betterStreak = 0;
    if (level >= 3) {
      return {
        episode: ep,
        proposal: {
          direction: 'none',
          label: P('On maintient les réductions actuelles', 'We keep the current cutbacks'),
          detail: P('La zone est déjà bien déchargée. Si ça ne s\'améliore pas d\'ici quelques jours, pense à consulter.', 'The area is already well unloaded. If it doesn\'t improve within a few days, consider seeing a doctor.'),
          apply: null,
        },
      };
    }
    const toLevel = level + 1;
    return {
      episode: ep,
      proposal: {
        direction: 'decrease',
        label: level === 0 ? P(`On décharge un peu ${art}`, `Let's unload ${art} a bit`) : P('Toujours pareil — on descend d\'un cran', 'Still the same — down one notch'),
        detail: LD[toLevel],
        apply: { zone: episode.zone, toLevel },
      },
    };
  }

  // 😌 Mieux
  ep.betterStreak = (episode.betterStreak || 0) + 1;
  if (level === 0) {
    // plus aucune réduction en place et ça va mieux → épisode terminé
    ep.status = 'resolved';
    ep.betterStreak = 0;
    return {
      episode: ep,
      proposal: {
        direction: 'resolved',
        label: P(`${Art} va mieux — épisode terminé 💪`, `${Art} feels better — episode over 💪`),
        detail: P('Je ne te poserai plus la question. Si la gêne revient, signale-la en séance et le suivi reprendra.', "I won't ask again. If the discomfort comes back, report it during a workout and tracking resumes."),
        apply: null,
      },
    };
  }
  if (ep.betterStreak >= 2) {
    const toLevel = level - 1;
    return {
      episode: ep,
      proposal: {
        direction: 'increase',
        label: P('Ça va mieux depuis 2 checks — on remonte d\'un cran ?', 'Better for 2 checks — move up a notch?'),
        detail: toLevel === 0
          ? P('Retour aux charges et séries d\'origine sur les exercices concernés.', 'Back to the original loads and sets on the affected exercises.')
          : LD[toLevel],
        apply: { zone: episode.zone, toLevel },
      },
    };
  }
  return {
    episode: ep,
    proposal: {
      direction: 'none',
      label: P('Bien noté 👍', 'Noted 👍'),
      detail: P('Encore un « mieux » à la prochaine question et je te proposerai de remonter la charge.', 'One more "better" next time and I\'ll suggest moving the load back up.'),
      apply: null,
    },
  };
}
