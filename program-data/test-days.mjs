import { buildActivationResult } from '../src/lib/program-activation.js';

const GYM = ['Barre de traction', 'Haltères', 'Barre EZ', 'Banc plat', 'Banc réglable', 'Barre olympique',
  'Disques olympiques', 'Rack squat', 'Câble poulie haute', 'Câble poulie basse', 'Station câbles double',
  'Pec deck', 'Barres parallèles', 'Tirage vertical', 'Presse à cuisses'];

const FR = { monday: 'Lun', tuesday: 'Mar', wednesday: 'Mer', thursday: 'Jeu', friday: 'Ven', saturday: 'Sam', sunday: 'Dim' };
const IDX = { monday: 0, tuesday: 1, wednesday: 2, thursday: 3, friday: 4, saturday: 5, sunday: 6 };

// Écart minimum CIRCULAIRE entre les jours retenus (la semaine se répète)
function minCircularGap(days) {
  const i = [...new Set(days.map((d) => IDX[d]))].sort((a, b) => a - b);
  if (i.length < 2) return 7;
  let min = Infinity;
  for (let k = 0; k < i.length; k++) {
    const gap = k === i.length - 1 ? 7 - i[k] + i[0] : i[k + 1] - i[k];
    if (gap < min) min = gap;
  }
  return min;
}

// Meilleur écart atteignable en choisissant n jours parmi ceux disponibles.
// Sert de référence : on ne peut pas reprocher au code de faire moins bien que
// le maximum possible (ex. Sam+Dim seuls → 1 jour d'écart, inévitable).
function bestPossibleGap(available, n) {
  const idx = available.map((d) => IDX[d]).sort((a, b) => a - b);
  if (n >= idx.length) return minCircularGap(available);
  let best = -1;
  const combo = [];
  const walk = (start) => {
    if (combo.length === n) {
      const g = minCircularGap(combo.map((i) => Object.keys(IDX).find((k) => IDX[k] === i)));
      if (g > best) best = g;
      return;
    }
    for (let i = start; i < idx.length; i++) { combo.push(idx[i]); walk(i + 1); combo.pop(); }
  };
  walk(0);
  return best;
}

function run(label, available, objectives) {
  const user = { level: 'intermediate', training_context: 'full_gym', availability_optimal: false,
    frequency_max: available.length, available_days: available, equipment: GYM };
  const r = buildActivationResult(user, objectives);
  if (!r) { console.log(`  ✗ ${label} → NULL`); return; }
  const wk1 = r.sessions.filter((s) => s.week === 1);
  const days = wk1.map((s) => s.day);
  const gap = minCircularGap(days);
  const best = bestPossibleGap(available, days.length);
  const ok = days.length < 2 || gap >= best; // optimal compte tenu des jours dispo
  console.log(`  ${ok ? '✓' : '✗'} ${label} — ${days.length} séance(s)`);
  console.log(`      dispo: ${available.map((d) => FR[d]).join(' ')} → retenus: ${days.map((d) => FR[d]).join(' ')}  (écart min ${gap} j · optimum possible ${best} j)`);
}

console.log('=== Répartition des jours (spécialisation : moins de séances que de jours dispo) ===');
const spec = [{ type: 'hypertrophy', zone: 'specific_group', priority: 'primary', focus_group: ['Pectoraux', 'Triceps'] }];
run('4 jours dispo, 2 séances', ['monday', 'tuesday', 'thursday', 'friday'], spec);
run('Tous les jours dispo, 2 séances', ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'], spec);
run('Lun-Mar-Mer collés, 2 séances', ['monday', 'tuesday', 'wednesday'], spec);
run('Sam-Dim seulement', ['saturday', 'sunday'], spec);

console.log('\n=== Non-régression : objectif large, jours = fréquence (cas normal) ===');
const large = [{ type: 'hypertrophy', zone: 'upper_body', priority: 'primary' }];
run('4 jours dispo, 4 séances', ['monday', 'tuesday', 'thursday', 'friday'], large);
run('3 jours dispo, 3 séances', ['monday', 'wednesday', 'friday'], large);
