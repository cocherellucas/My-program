import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const BASE_IMAGE_URL = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/';
const EXERCISES_JSON_URL = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json';

let cachedExercises = null;

async function getExercises() {
  if (cachedExercises) return cachedExercises;
  const res = await fetch(EXERCISES_JSON_URL);
  cachedExercises = await res.json();
  return cachedExercises;
}

function normalize(str) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Map French exercise name → array of required English keywords (ALL must match)
const EXERCISE_MAP = [
  { fr: ['développé couché', 'bench press', 'développé couche'], en: ['bench', 'press'], mustContain: ['bench'] },
  { fr: ['développé incliné', 'incline press'], en: ['incline', 'press'], mustContain: ['incline'] },
  { fr: ['développé décliné', 'decline press'], en: ['decline', 'press'], mustContain: ['decline'] },
  { fr: ['soulevé de terre', 'deadlift', 'souleve de terre'], en: ['deadlift'], mustContain: ['deadlift'] },
  { fr: ['squat barre', 'squat', 'back squat'], en: ['squat'], mustContain: ['squat'] },
  { fr: ['fentes', 'lunges'], en: ['lunge'], mustContain: ['lunge'] },
  { fr: ['traction', 'tractions', 'pull up', 'pull-up'], en: ['pull', 'up'], mustContain: ['pull'] },
  { fr: ['tirage poulie haute', 'lat pulldown', 'tirage'], en: ['pulldown'], mustContain: ['pulldown'] },
  { fr: ['rowing barre', 'barbell row'], en: ['barbell', 'row'], mustContain: ['row'] },
  { fr: ['rowing haltère', 'dumbbell row'], en: ['dumbbell', 'row'], mustContain: ['row'] },
  { fr: ['overhead press', 'développé épaules', 'military press', 'press épaules'], en: ['overhead', 'press'], mustContain: ['overhead'] },
  { fr: ['curl biceps', 'bicep curl', 'curl haltères'], en: ['curl'], mustContain: ['curl'] },
  { fr: ['curl barre', 'barbell curl'], en: ['barbell', 'curl'], mustContain: ['curl'] },
  { fr: ['extensions triceps', 'tricep extension', 'poulie triceps'], en: ['tricep'], mustContain: ['tricep'] },
  { fr: ['dips', 'dip'], en: ['dip'], mustContain: ['dip'] },
  { fr: ['pompes', 'push up', 'push-up'], en: ['push'], mustContain: ['push'] },
  { fr: ['élévations latérales', 'lateral raise'], en: ['lateral', 'raise'], mustContain: ['lateral'] },
  { fr: ['hip thrust', 'hip thrust barre'], en: ['hip', 'thrust'], mustContain: ['hip'] },
  { fr: ['leg press', 'presse jambes'], en: ['leg', 'press'], mustContain: ['leg press'] },
  { fr: ['leg curl', 'curl jambes'], en: ['leg', 'curl'], mustContain: ['leg curl'] },
  { fr: ['leg extension', 'extension jambes'], en: ['leg', 'extension'], mustContain: ['extension'] },
  { fr: ['mollets', 'calf raise'], en: ['calf'], mustContain: ['calf'] },
  { fr: ['crunch', 'abdominaux'], en: ['crunch'], mustContain: ['crunch'] },
  { fr: ['plank', 'gainage'], en: ['plank'], mustContain: ['plank'] },
  { fr: ['shrug', 'haussement épaules'], en: ['shrug'], mustContain: ['shrug'] },
  { fr: ['face pull'], en: ['face', 'pull'], mustContain: ['face'] },
];

function findMapping(exerciseName) {
  const normalized = normalize(exerciseName);
  for (const mapping of EXERCISE_MAP) {
    for (const frVariant of mapping.fr) {
      if (normalized.includes(normalize(frVariant))) {
        return mapping;
      }
    }
  }
  return null;
}

function scoreExercise(exercise, mapping) {
  const exName = normalize(exercise.name);
  // All mustContain terms must be in the exercise name
  for (const required of mapping.mustContain) {
    if (!exName.includes(required)) return 0;
  }
  // Score by how many en keywords match
  let score = 0;
  for (const term of mapping.en) {
    if (exName.includes(term)) score += 2;
  }
  return score;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { exerciseName } = await req.json();
    if (!exerciseName) return Response.json({ gifUrl: null });

    const mapping = findMapping(exerciseName);
    if (!mapping) return Response.json({ gifUrl: null });

    const exercises = await getExercises();

    let best = null;
    let bestScore = 0;

    for (const ex of exercises) {
      if (!ex.images || ex.images.length === 0) continue;
      const score = scoreExercise(ex, mapping);
      if (score > bestScore) {
        bestScore = score;
        best = ex;
      }
    }

    if (!best || bestScore === 0) return Response.json({ gifUrl: null });

    const imageUrl = BASE_IMAGE_URL + best.images[0];
    return Response.json({ gifUrl: imageUrl, exerciseName: best.name });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});