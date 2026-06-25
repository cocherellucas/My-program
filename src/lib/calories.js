// Estimation du maintien calorique (TDEE) à partir du profil.
// BMR via Mifflin-St Jeor, puis facteur d'activité selon le nombre d'entraînements/semaine.

function activityFactor(trainingDays) {
  const d = Number(trainingDays);
  if (!d || d <= 0) return 1.2;   // sédentaire
  if (d <= 2) return 1.375;       // léger (1-2 séances)
  if (d <= 4) return 1.55;        // modéré (3-4 séances)
  if (d <= 6) return 1.725;       // actif (5-6 séances)
  return 1.9;                     // très actif (7+)
}

/**
 * @returns {{ bmr: number, maintenance: number, factor: number } | null}
 *   null si des données indispensables manquent (genre, âge, taille, poids).
 */
export function estimateMaintenanceCalories({ gender, age, height, weight, trainingDays } = {}) {
  const a = parseFloat(age);
  const h = parseFloat(height);
  const w = parseFloat(weight);
  if (!gender || !a || !h || !w) return null;
  if (a < 10 || h < 100 || w < 25) return null; // valeurs aberrantes → pas d'estimation

  // Mifflin-St Jeor
  let bmr = 10 * w + 6.25 * h - 5 * a;
  bmr += gender === 'female' ? -161 : 5;

  const factor = activityFactor(trainingDays);
  return {
    bmr: Math.round(bmr),
    maintenance: Math.round(bmr * factor),
    factor,
  };
}
