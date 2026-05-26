// ~45s execution per set + rest, 5 min warmup, rounded to nearest 5 min
export function calcDuration(exercises) {
  if (!exercises || exercises.length === 0) return 60;
  const exerciseSeconds = exercises.reduce((acc, ex) => {
    const sets = ex.sets || 3;
    const rest = ex.rest_seconds || 90;
    return acc + sets * (45 + rest);
  }, 0);
  const totalMin = Math.ceil((300 + exerciseSeconds) / 60);
  return Math.max(5, Math.round(totalMin / 5) * 5);
}
