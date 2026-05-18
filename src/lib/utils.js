import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const isIframe = window.self !== window.top;

// Normalise les champs tableau du profil utilisateur (peuvent être JSON string en DB)
const parseArr = (v) => {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  try { const p = JSON.parse(v); return Array.isArray(p) ? p : []; } catch { return []; }
};

export function normalizeUser(u) {
  if (!u) return u;
  return {
    ...u,
    equipment:           parseArr(u.equipment),
    available_days:      parseArr(u.available_days),
    fragile_zones:       parseArr(u.fragile_zones),
    preferred_exercises: parseArr(u.preferred_exercises),
    disliked_exercises:  parseArr(u.disliked_exercises),
    no_volume_muscles:   parseArr(u.no_volume_muscles),
  };
}
