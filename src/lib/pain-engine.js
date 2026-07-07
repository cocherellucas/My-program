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

export const ZONE_LABELS = {
  wrists: 'poignet', shoulders: 'épaule', elbows: 'coude',
  knees: 'genou', lower_back: 'bas du dos', neck: 'nuque',
};
// Avec possessif, pour les phrases (« Comment a réagi ton poignet ? »)
export const ZONE_ART = {
  wrists: 'ton poignet', shoulders: 'ton épaule', elbows: 'ton coude',
  knees: 'ton genou', lower_back: 'ton bas du dos', neck: 'ta nuque',
};

// Détecte une zone dans un texte libre (notes de séance, note de douleur)
export function detectZoneFromText(text) {
  const t = (text || '').toLowerCase();
  if (/poignet/.test(t)) return 'wrists';
  if (/épaule|epaule/.test(t)) return 'shoulders';
  if (/coude/.test(t)) return 'elbows';
  if (/genou/.test(t)) return 'knees';
  if (/lombaire|bas du dos|\bdos\b/.test(t)) return 'lower_back';
  if (/cervical|nuque|\bcou\b/.test(t)) return 'neck';
  return null;
}

const todayStr = () => new Date().toISOString().split('T')[0];

// ─────────────────────────────────────────────────────────────────────────────
// CONSEIL DOULEUR EN SÉANCE — arbre de décision (remplace l'IA, 100 % code).
// Analyse les champs du formulaire (Où / Quand / Comment / Autres) par
// mots-clés et compose la réponse : GRAVITÉ d'abord (court-circuite tout),
// puis nature de la douleur, moment dans le mouvement, astuce de zone,
// ancienneté. Toujours conclu par le suivi à J+1.
// ─────────────────────────────────────────────────────────────────────────────
const ZONE_TIPS = {
  wrists: 'Pour le poignet : garde-le dans l\'axe de l\'avant-bras (prise neutre si possible) — un poignet cassé en arrière sous charge est la cause la plus fréquente.',
  shoulders: 'Pour l\'épaule : garde les coudes un peu plus près du corps et évite les positions bras au-dessus de la tête tant que ça gêne.',
  elbows: 'Pour le coude : change de largeur ou de type de prise, et évite de verrouiller complètement le bras en fin de répétition.',
  knees: 'Pour le genou : aligne-le avec la pointe de pied et réduis la profondeur de flexion tant que ça gêne.',
  lower_back: 'Pour le bas du dos : gaine avant chaque répétition et garde le dos neutre — réduis la charge plutôt que de l\'arrondir.',
  neck: 'Pour la nuque : tête neutre, regard horizontal — ne compense pas avec le cou pour finir les reps.',
};
// Zones hors suivi (pas d'épisode) mais avec un conseil quand même
const EXTRA_TIPS = [
  [/hanche|aine\b/, 'Pour la hanche : réduis l\'amplitude en bas du mouvement et évite les positions extrêmes (écart, flexion profonde).'],
  [/cheville/, 'Pour la cheville : surélève légèrement les talons si la mobilité limite, et évite les appuis instables.'],
  [/tibia|périost|periost/, 'Pour le tibia : coupe les impacts et les sauts quelques jours, ça se calme avec le repos relatif.'],
  [/pec\b|pector|poitrine/, 'Pour le pec : réduis l\'amplitude en position étirée (barre moins basse, haltères moins profonds).'],
  [/ischio|arrière de la cuisse|arriere de la cuisse/, 'Pour l\'ischio : évite l\'étirement maximal sous charge et ralentis la descente.'],
];

export function buildPainAdvice(painNote) {
  const all = (painNote || '').toLowerCase();
  // Champs étiquetés du formulaire ("où : … — quand : … — comment : … — autres : …")
  const seg = (label) => {
    const m = all.match(new RegExp(label + '\\s*:\\s*([^—]*)'));
    return m ? m[1].trim() : '';
  };
  const where = seg('où') || seg('ou');
  const when  = seg('quand');
  const how   = seg('comment');
  const extra = seg('autres');
  const howT  = how || all;  // repli : texte libre (messages de suivi du fil)
  const whenT = when || all;

  const followUp = 'Je te redemanderai demain comment ça a réagi.';

  // 1) GRAVITÉ — on n'adapte pas, on arrête
  if (/gonfl|enfl(é|e)|hématome|hematome|bleu\b/.test(all)) {
    return 'Stop : un gonflement ne se travaille jamais « au travers ». Arrête cet exercice, mets du froid (15-20 min) et laisse la zone tranquille aujourd\'hui. Si c\'est encore gonflé ou douloureux demain, consulte. ' + followUp;
  }
  if (/coup\b|craqu|claqu|déchir|dechir|lancinant|aigu(ë|e)?\b|vive|violent|insupportable|très forte|tres forte|(8|9|10)\s*\/\s*10/.test(all)) {
    return 'Stop : douleur vive ou apparue d\'un coup = on n\'insiste pas. Arrête cet exercice et laisse cette zone tranquille aujourd\'hui. Si c\'est encore douloureux demain ou que ça enfle, avis médical. ' + followUp;
  }
  if (/fourmi|engourd|picot|irradie|décharge|decharge|électri|electri/.test(all)) {
    return 'Fourmillements, engourdissement ou douleur qui irradie = probablement un nerf comprimé ou étiré : arrête cet exercice, secoue doucement le membre et vérifie ta position (prise, poignet, posture). Si ça revient à chaque série ou persiste après la séance, consulte. ' + followUp;
  }

  const parts = [];
  // Douleur sur toute l'amplitude → le conseil « travaille dans l'amplitude
  // sans douleur » n'a pas de sens, on ne le donne pas
  const isConstant = /tout le temps|constant|en continu|toute l'amplitude|toute la/.test(whenT);

  // 2) NATURE de la douleur
  if (/brûl|brul/.test(howT)) {
    parts.push('Une brûlure DANS le muscle en fin de série est normale (accumulation métabolique) — continue si l\'exécution reste propre. Si ça brûle sur une articulation ou un tendon, baisse la charge de ~20 %.');
  } else if (/cramp/.test(howT)) {
    parts.push('Crampe : étire doucement le muscle, bois (eau + électrolytes) et allonge le repos avant la prochaine série. Réduis le volume du jour si ça revient.');
  } else if (/tension|raid|contract|nœud|noeud|tiraill/.test(howT)) {
    parts.push('Ça ressemble à une tension ou une raideur : fais 2-3 répétitions lentes à vide pour réchauffer la zone, puis reprends dans une amplitude confortable en montant progressivement.');
  } else if (/pinc|coinc|accroch|blocage|bloqu/.test(howT)) {
    parts.push('Un pincement ou un accrochage mécanique : ne force pas dessus. Reste sous le point qui accroche (amplitude réduite) et vérifie ton placement.');
  } else if (!isConstant) {
    parts.push('Continue dans l\'amplitude qui ne réveille pas la douleur : réduis l\'amplitude si besoin, contrôle le mouvement, arrête la série dès la gêne.');
  }

  // 3) MOMENT dans le mouvement
  if (/en bas|bas du mouvement|étir|etir|extension complète|extension complete|allong/.test(whenT)) {
    parts.push('Comme ça arrive en position étirée : raccourcis l\'amplitude en bas et garde la tension sur la portion haute du mouvement.');
  } else if (/mont|concentri|pouss|en tirant|à l\'effort|a l\'effort/.test(whenT)) {
    parts.push('Comme ça arrive à l\'effort : c\'est la charge — baisse de ~20 % maintenant et remonte progressivement sur les prochaines séances.');
  } else if (/descen|négati|negati|excentri|frein/.test(whenT)) {
    parts.push('Comme ça arrive à la descente : ralentis-la et contrôle chaque centimètre ; réduis l\'amplitude si ça tire encore.');
  } else if (/verrouill|lock|en haut|fin de mouvement|bras tendu|jambe tendue/.test(whenT)) {
    parts.push('Comme ça arrive en fin de mouvement : arrête la répétition juste avant le verrouillage complet, garde une micro-flexion.');
  } else if (/après|apres|entre les séries|entre les series|au repos|plus tard/.test(whenT)) {
    parts.push('Comme ça apparaît après l\'effort : allonge le repos et surveille — si ça revient à la série suivante, baisse la charge de ~20 %.');
  } else if (/échauff|echauff|début|debut|première|premiere/.test(whenT)) {
    parts.push('Comme c\'est en début d\'exercice : ajoute 1-2 séries d\'échauffement légères et progressives avant tes séries de travail.');
  } else if (/tout le temps|constant|en continu|toute l\'amplitude|toute la/.test(whenT)) {
    parts.push('Si ça fait mal sur toute l\'amplitude : passe cet exercice aujourd\'hui et prends une variante qui ne réveille rien.');
  }

  // 4) Astuce spécifique à la zone
  const zone = detectZoneFromText(where || all);
  if (zone && ZONE_TIPS[zone]) {
    parts.push(ZONE_TIPS[zone]);
  } else {
    const hit = EXTRA_TIPS.find(([re]) => re.test(where || all));
    if (hit) parts.push(hit[1]);
  }

  // 5) Ancienneté / récurrence
  if (/semaine|mois|longtemps|chronique|toujours|souvent|récurr|recurr|chaque fois|à chaque|a chaque/.test(extra || all)) {
    parts.push('Vu que ça traîne depuis un moment, un passage chez un kiné vaut le coup en parallèle — en attendant on gère par la charge et l\'amplitude.');
  }

  parts.push(followUp);
  return parts.join(' ');
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

// La séance contient-elle des exercices qui sollicitent la zone ?
export function sessionTouchesZone(session, zone) {
  const muscles = new Set(FRAGILE_ZONE_MUSCLES[zone] || []);
  return (session?.exercises || []).some(ex => muscles.has(ex.muscle_group));
}

// Échelle de réduction — descriptions affichées à l'utilisateur
const LEVEL_DETAILS = {
  1: 'Charge −20 % sur les exercices qui sollicitent la zone (7 prochains jours). Poids du corps : prends la variante plus simple.',
  2: 'Charge −20 % et −1 série sur les exercices qui sollicitent la zone (7 prochains jours).',
  3: 'Charge −20 %, −1 série, et ces exercices sont retirés d\'une séance sur deux (7 prochains jours).',
};

// Réaction du corps → épisode mis à jour (check/historique/statut) + proposition.
// Le NIVEAU ne change qu'au moment d'Appliquer (via applyPainLevel), jamais ici.
// reaction : 'better' | 'same' | 'worse' | 'sharp'
export function computePainPrescription(episode, reaction) {
  const art = ZONE_ART[episode.zone] || episode.zone;
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
        label: `Douleur vive : on met ${art} au repos`,
        detail: 'Repos de la zone et avis médical conseillé. Je peux retirer les exercices qui la sollicitent des 7 prochains jours.',
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
          label: `${art.charAt(0).toUpperCase() + art.slice(1)} empire malgré les réductions`,
          detail: 'Repos de la zone et avis médical conseillé. Je peux retirer les exercices qui la sollicitent des 7 prochains jours.',
          apply: { zone: episode.zone, toLevel: 4 },
        },
      };
    }
    if (level >= 3) {
      return {
        episode: ep,
        proposal: {
          direction: 'none',
          label: 'On est déjà au maximum de réduction',
          detail: 'Si ça continue d\'empirer d\'ici la prochaine fois, on mettra la zone au repos complet — et pense à consulter.',
          apply: null,
        },
      };
    }
    const toLevel = Math.min(3, level + 2); // pire → on descend de 2 crans
    return {
      episode: ep,
      proposal: {
        direction: 'decrease',
        label: `Ça empire — on protège davantage ${art}`,
        detail: LEVEL_DETAILS[toLevel],
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
          label: 'On maintient les réductions actuelles',
          detail: 'La zone est déjà bien déchargée. Si ça ne s\'améliore pas d\'ici quelques jours, pense à consulter.',
          apply: null,
        },
      };
    }
    const toLevel = level + 1;
    return {
      episode: ep,
      proposal: {
        direction: 'decrease',
        label: level === 0 ? `On décharge un peu ${art}` : 'Toujours pareil — on descend d\'un cran',
        detail: LEVEL_DETAILS[toLevel],
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
        label: `${art.charAt(0).toUpperCase() + art.slice(1)} va mieux — épisode terminé 💪`,
        detail: 'Je ne te poserai plus la question. Si la gêne revient, signale-la en séance et le suivi reprendra.',
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
        label: 'Ça va mieux depuis 2 checks — on remonte d\'un cran ?',
        detail: toLevel === 0
          ? 'Retour aux charges et séries d\'origine sur les exercices concernés.'
          : LEVEL_DETAILS[toLevel],
        apply: { zone: episode.zone, toLevel },
      },
    };
  }
  return {
    episode: ep,
    proposal: {
      direction: 'none',
      label: 'Bien noté 👍',
      detail: 'Encore un « mieux » à la prochaine question et je te proposerai de remonter la charge.',
      apply: null,
    },
  };
}
