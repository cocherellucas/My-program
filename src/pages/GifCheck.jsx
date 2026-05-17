import React, { useState } from 'react';
import { EXERCISES } from '@/lib/exercise-database';
import EXERCISE_IMAGES from '@/lib/exercise-images.json';

const MUSCLES = [...new Set(EXERCISES.flatMap(e => e.muscles.primary))].sort();

function getImages(name) {
  const key = name.toLowerCase().trim();
  return EXERCISE_IMAGES[key] || null;
}

export default function GifCheck() {
  const [filter, setFilter] = useState('');
  const [muscle, setMuscle] = useState('');
  const [showMissing, setShowMissing] = useState(false);
  const [imgErrors, setImgErrors] = useState({});
  const [showSecond, setShowSecond] = useState({});

  const filtered = EXERCISES.filter(e => {
    const matchName = e.name.toLowerCase().includes(filter.toLowerCase());
    const matchMuscle = !muscle || e.muscles.primary.includes(muscle);
    const imgs = getImages(e.name);
    const matchMissing = !showMissing || !imgs;
    return matchName && matchMuscle && matchMissing;
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-heading font-bold text-white">Vérification GIFs</h1>
        <p className="text-white/60 text-sm">{filtered.length} exercices · clique sur l'image pour basculer position</p>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Rechercher..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm w-48"
        />
        <select
          value={muscle}
          onChange={e => setMuscle(e.target.value)}
          className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white text-sm"
        >
          <option value="">Tous les muscles</option>
          {MUSCLES.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer">
          <input
            type="checkbox"
            checked={showMissing}
            onChange={e => setShowMissing(e.target.checked)}
            className="rounded"
          />
          Sans image seulement
        </label>
      </div>

      {/* Grille */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {filtered.map(ex => {
          const imgs = getImages(ex.name);
          const hasError = imgErrors[ex.name];
          const isSecond = showSecond[ex.name];

          return (
            <div key={ex.id} className="bg-white/10 rounded-xl overflow-hidden border border-white/10 hover:border-white/30 transition-colors">
              {/* Image */}
              <div
                className="h-32 bg-violet-950 flex items-center justify-center cursor-pointer relative"
                onClick={() => setShowSecond(p => ({ ...p, [ex.name]: !p[ex.name] }))}
              >
                {imgs && !hasError ? (
                  <img
                    src={isSecond && imgs.img1 ? imgs.img1 : imgs.img0}
                    alt={ex.name}
                    className="w-full h-full object-contain"
                    onError={() => setImgErrors(p => ({ ...p, [ex.name]: true }))}
                  />
                ) : (
                  <div className="w-full h-full bg-violet-700 flex items-center justify-center">
                    <span className="text-white/70 text-xs font-medium text-center px-3">Illustration à venir</span>
                  </div>
                )}
                {imgs?.img1 && !hasError && (
                  <span className="absolute bottom-1 right-1 text-xs bg-black/40 text-white px-1 rounded">
                    {isSecond ? '2' : '1'}/2
                  </span>
                )}
              </div>
              {/* Nom */}
              <div className="p-2">
                <p className="text-white text-xs font-medium leading-tight">{ex.name}</p>
                <p className="text-white/40 text-xs mt-0.5">{ex.muscles.primary.join(', ')}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
