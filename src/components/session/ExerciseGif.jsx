import React, { useState, useEffect } from 'react';
import { Dumbbell } from 'lucide-react';
import EXERCISE_IMAGES from '@/lib/exercise-images.json';

const KEYS = Object.keys(EXERCISE_IMAGES);

function normalize(s) {
  return (s || '').toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

function getImages(exerciseName) {
  if (!exerciseName) return null;
  const key = (exerciseName).toLowerCase().trim();

  // 1. Match exact
  if (EXERCISE_IMAGES[key]) return EXERCISE_IMAGES[key];

  // 2. Match normalisé (sans accents, sans ponctuation)
  const norm = normalize(exerciseName);
  const normMatch = KEYS.find(k => normalize(k) === norm);
  if (normMatch) return EXERCISE_IMAGES[normMatch];

  // 3. Match par mots-clés — tous les mots significatifs (>3 lettres) présents dans la clé
  const words = norm.split(' ').filter(w => w.length > 3);
  if (words.length > 0) {
    const kwMatch = KEYS.find(k => {
      const kn = normalize(k);
      return words.every(w => kn.includes(w));
    });
    if (kwMatch) return EXERCISE_IMAGES[kwMatch];

    // 4. Match partiel souple — au moins 60% des mots
    let best = null, bestScore = 0;
    for (const k of KEYS) {
      const kn = normalize(k);
      const score = words.filter(w => kn.includes(w)).length / words.length;
      if (score > bestScore && score >= 0.6) { bestScore = score; best = k; }
    }
    if (best) return EXERCISE_IMAGES[best];
  }

  return null;
}

export default function ExerciseGif({ exerciseName, className = '' }) {
  const images = getImages(exerciseName);
  const [showSecond, setShowSecond] = useState(false);
  const [loaded0, setLoaded0] = useState(false);
  const [loaded1, setLoaded1] = useState(false);

  // Alterner entre les 2 images toutes les 1.2s pour simuler un GIF
  useEffect(() => {
    if (!images?.img1) return;
    const interval = setInterval(() => setShowSecond(s => !s), 1200);
    return () => clearInterval(interval);
  }, [images?.img1]);

  if (!images) {
    return (
      <div className={`rounded-xl bg-violet-700 flex items-center justify-center ${className}`}>
        <span className="text-white/70 text-xs font-medium text-center px-3">Illustration à venir</span>
      </div>
    );
  }

  return (
    <div className={`relative rounded-xl overflow-hidden bg-violet-950 ${className}`}>
      {/* Image position 1 (départ) */}
      <img
        src={images.img0}
        alt={exerciseName}
        className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ${
          !showSecond && loaded0 ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setLoaded0(true)}
      />
      {/* Image position 2 (fin de mouvement) */}
      {images.img1 && (
        <img
          src={images.img1}
          alt={exerciseName}
          className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ${
            showSecond && loaded1 ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setLoaded1(true)}
        />
      )}
      {/* Spinner tant que les images ne sont pas chargées */}
      {!loaded0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
