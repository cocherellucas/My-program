-- ============================================================================
--  Coach IA — la mémoire du coach ne s'enregistre pas (PATCH 400)
-- ============================================================================
--  Où : Supabase → SQL Editor → coller → Run.
--  Sûr : idempotent (rejouable), aucune donnée supprimée, aucune colonne
--  existante modifiée.
--
--  SYMPTÔME observé le 2026-08-22 :
--    PATCH /rest/v1/user_memories?id=eq.… → 400 (Bad Request)
--
--  CAUSE la plus probable : la colonne `coach_notes` n'existe pas dans la
--  table. PostgREST refuse alors tout PATCH qui la mentionne.
--
--  Pourquoi personne ne l'avait vu : trois endroits du code y écrivaient
--  (formulaire douleur en séance, note de fin de séance, message de douleur
--  dans le chat) mais AUCUN écran ne l'affichait. Les écritures échouaient dans
--  un `catch` silencieux depuis le début. C'est en ajoutant l'affichage de cette
--  mémoire que l'erreur est devenue visible.
-- ============================================================================


-- ── ÉTAPE 1 — DIAGNOSTIC (à lancer d'abord, seul) ───────────────────────────
-- Liste les colonnes réellement présentes. Ne modifie rien.
-- Compare avec ce que l'app écrit : coach_notes, injuries.

SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'user_memories'
ORDER BY ordinal_position;


-- ── ÉTAPE 2 — CORRECTIF ─────────────────────────────────────────────────────
-- À lancer si `coach_notes` n'apparaît PAS dans le résultat ci-dessus.
-- `IF NOT EXISTS` : sans effet si la colonne est déjà là, donc rejouable.

ALTER TABLE public.user_memories
  ADD COLUMN IF NOT EXISTS coach_notes text;

-- `injuries` porte les épisodes de suivi douleur (tableau d'objets). Si elle
-- manque aussi, c'est tout le suivi J+1 qui ne s'enregistre pas.
ALTER TABLE public.user_memories
  ADD COLUMN IF NOT EXISTS injuries jsonb DEFAULT '[]'::jsonb;


-- ── ÉTAPE 3 — VÉRIFICATION ──────────────────────────────────────────────────
-- Doit renvoyer deux lignes : coach_notes (text) et injuries (jsonb).

SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'user_memories'
  AND column_name IN ('coach_notes', 'injuries');


-- ============================================================================
--  NOTE — les colonnes que l'app N'ÉCRIT PLUS
-- ============================================================================
--  `exercise_preferences`, `structure_preferences`, `objective_history`,
--  `fatigue_alerts`, `past_adaptations`, `ai_reviews` n'ont jamais été
--  alimentées par quoi que ce soit. Décidé le 2026-08-22 : on ne les remplit
--  pas. L'historique de fatigue est désormais CALCULÉ depuis les séances
--  (lib/fatigue-history.js), et les bilans se demandent au coach dans le chat.
--
--  Ne PAS les supprimer ici : une colonne inutilisée ne coûte rien, et une
--  suppression est irréversible. Si elles n'existent pas, tant mieux — le code
--  ne les touche plus.
-- ============================================================================
