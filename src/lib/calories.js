// Estimation du maintien calorique (TDEE) à partir du profil.
// BMR via Mifflin-St Jeor, puis facteur d'activité selon le nombre d'entraînements/semaine.

const LEVEL_FACTORS = {
  sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9,
};

function activityFactor(trainingDays) {
  const d = Number(trainingDays);
  if (!d || d <= 0) return 1.2;   // sédentaire
  if (d <= 2) return 1.375;       // léger (1-2 séances)
  if (d <= 4) return 1.55;        // modéré (3-4 séances)
  if (d <= 6) return 1.725;       // actif (5-6 séances)
  return 1.9;                     // très actif (7+)
}

// Niveau d'activité choisi explicitement → prioritaire ; sinon déduit des jours d'entraînement
function resolveFactor(activityLevel, trainingDays) {
  if (activityLevel && LEVEL_FACTORS[activityLevel]) return LEVEL_FACTORS[activityLevel];
  return activityFactor(trainingDays);
}

/**
 * @returns {{ bmr: number, maintenance: number, factor: number } | null}
 *   null si des données indispensables manquent (genre, âge, taille, poids).
 */
export function estimateMaintenanceCalories({ gender, age, height, weight, trainingDays, bodyFat, activityLevel } = {}) {
  const a = parseFloat(age);
  const h = parseFloat(height);
  const w = parseFloat(weight);
  const bf = parseFloat(bodyFat);
  if (!w || w < 25) return null;

  let bmr;
  let method;
  if (bf && bf >= 3 && bf <= 60) {
    // Katch-McArdle : basé sur la masse maigre → plus précis quand le %MG est connu
    const lbm = w * (1 - bf / 100);
    bmr = 370 + 21.6 * lbm;
    method = 'katch';
  } else {
    // Mifflin-St Jeor : nécessite genre/âge/taille
    if (!gender || !a || !h || a < 10 || h < 100) return null;
    bmr = 10 * w + 6.25 * h - 5 * a + (gender === 'female' ? -161 : 5);
    method = 'mifflin';
  }

  const factor = resolveFactor(activityLevel, trainingDays);
  return {
    bmr: Math.round(bmr),
    maintenance: Math.round(bmr * factor),
    factor,
    method,
  };
}

/**
 * Estimation du % de masse grasse (formule Deurenberg, basée sur BMI + âge + genre).
 * Indicatif uniquement — tend à surestimer chez les personnes musclées.
 * @returns {number | null} pourcentage arrondi au 0,1 près, ou null si données manquantes.
 */
export function estimateBodyFat({ gender, age, height, weight } = {}) {
  const a = parseFloat(age);
  const h = parseFloat(height);
  const w = parseFloat(weight);
  if (!gender || !a || !h || !w) return null;
  if (a < 10 || h < 100 || w < 25) return null;

  const bmi = w / Math.pow(h / 100, 2);
  const sex = gender === 'female' ? 0 : 1;
  const bf = 1.20 * bmi + 0.23 * a - 10.8 * sex - 5.4; // Deurenberg
  return Math.min(60, Math.max(3, Math.round(bf * 10) / 10));
}
