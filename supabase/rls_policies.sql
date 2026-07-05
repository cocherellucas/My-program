-- ============================================================================
--  Coach IA — Sécurisation Supabase (Row Level Security)
-- ============================================================================
--  À coller dans Supabase → SQL Editor → Run.
--  Idempotent : peut être relancé sans risque (drop policy if exists).
--
--  CONTEXTE : l'app est 100 % front. Toutes les requêtes partent du navigateur
--  avec la clé "anon". SANS ces règles, n'importe qui peut, depuis la console :
--    • lire/modifier les données des AUTRES utilisateurs
--    • se donner le rôle admin           (updateMe({ role: 'admin' }))
--    • s'offrir un abonnement payant       (updateMe({ subscription_plan: 'pro' }))
--  Ce script ferme ces trois trous.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 0. Fonction utilitaire : suis-je admin ?
--    SECURITY DEFINER → lit profiles sans être bloquée par la RLS de profiles
--    (évite la récursion infinie d'une policy qui interroge sa propre table).
-- ----------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select role = 'admin' from public.profiles where id = auth.uid()),
    false
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;


-- ----------------------------------------------------------------------------
-- 1. Tables "données utilisateur" : accès UNIQUEMENT à ses propres lignes.
--    Chaque table possède une colonne user_id (posée à la création côté app).
-- ----------------------------------------------------------------------------
do $$
declare
  t text;
  user_tables text[] := array[
    'programs',
    'sessions',
    'series_logs',
    'objectives',
    'user_memories',
    'measurements',
    'saved_programs'
  ];
begin
  foreach t in array user_tables loop
    -- Active la RLS (par défaut : tout est refusé tant qu'aucune policy ne passe)
    execute format('alter table public.%I enable row level security;', t);
    execute format('alter table public.%I force row level security;', t);

    -- On repart propre
    execute format('drop policy if exists "own_select" on public.%I;', t);
    execute format('drop policy if exists "own_insert" on public.%I;', t);
    execute format('drop policy if exists "own_update" on public.%I;', t);
    execute format('drop policy if exists "own_delete" on public.%I;', t);

    -- Lecture : seulement mes lignes
    execute format($f$
      create policy "own_select" on public.%I
        for select to authenticated
        using (user_id = auth.uid());
    $f$, t);

    -- Création : je ne peux insérer QUE des lignes à mon nom
    execute format($f$
      create policy "own_insert" on public.%I
        for insert to authenticated
        with check (user_id = auth.uid());
    $f$, t);

    -- Modification : mes lignes, et je ne peux pas les réattribuer à autrui
    execute format($f$
      create policy "own_update" on public.%I
        for update to authenticated
        using (user_id = auth.uid())
        with check (user_id = auth.uid());
    $f$, t);

    -- Suppression : mes lignes
    execute format($f$
      create policy "own_delete" on public.%I
        for delete to authenticated
        using (user_id = auth.uid());
    $f$, t);
  end loop;
end $$;


-- ----------------------------------------------------------------------------
-- 2. profiles : chacun lit/écrit SON profil, mais ne peut PAS s'attribuer
--    role='admin' ni changer son subscription_plan (verrouillé par trigger).
-- ----------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.profiles force row level security;

drop policy if exists "profile_select_own"   on public.profiles;
drop policy if exists "profile_select_admin"  on public.profiles;
drop policy if exists "profile_insert_own"    on public.profiles;
drop policy if exists "profile_update_own"    on public.profiles;

-- Lecture de son propre profil
create policy "profile_select_own" on public.profiles
  for select to authenticated
  using (id = auth.uid());

-- Un admin peut lire tous les profils (back-office éventuel)
create policy "profile_select_admin" on public.profiles
  for select to authenticated
  using (public.is_admin());

-- Création de sa propre ligne (au cas où l'upsert crée le profil)
create policy "profile_insert_own" on public.profiles
  for insert to authenticated
  with check (id = auth.uid());

-- Mise à jour de sa propre ligne
create policy "profile_update_own" on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Verrou anti-escalade : sur INSERT/UPDATE par un utilisateur normal, on force
-- role et subscription_plan aux valeurs sûres. Seuls le backend (service_role)
-- et un admin existant peuvent les modifier.
create or replace function public.guard_privileged_profile_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Le backend (Edge Functions, service_role) garde tous les droits
  if coalesce(auth.jwt() ->> 'role', '') = 'service_role' then
    return new;
  end if;
  -- Un admin déjà en place peut promouvoir / changer les plans
  if public.is_admin() then
    return new;
  end if;

  if tg_op = 'INSERT' then
    -- Nouveau profil créé côté client : jamais admin, plan de base
    new.role := 'user';
    new.subscription_plan := coalesce(new.subscription_plan, 'starter');
    if new.subscription_plan <> 'starter' then
      new.subscription_plan := 'starter';
    end if;
  else -- UPDATE
    -- On rejette toute tentative de modifier ces colonnes : on remet l'ancienne valeur
    new.role := old.role;
    new.subscription_plan := old.subscription_plan;
  end if;

  return new;
end $$;

drop trigger if exists trg_guard_profile_privileges on public.profiles;
create trigger trg_guard_profile_privileges
  before insert or update on public.profiles
  for each row execute function public.guard_privileged_profile_columns();


-- ----------------------------------------------------------------------------
-- 3. app_configs : lecture publique (grille tarifaire), écriture admin only.
-- ----------------------------------------------------------------------------
alter table public.app_configs enable row level security;
alter table public.app_configs force row level security;

drop policy if exists "config_read_all"    on public.app_configs;
drop policy if exists "config_write_admin" on public.app_configs;

-- Tout le monde (même non connecté) peut lire la config publique
create policy "config_read_all" on public.app_configs
  for select to anon, authenticated
  using (true);

-- Seul un admin peut créer / modifier / supprimer
create policy "config_write_admin" on public.app_configs
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());


-- ============================================================================
--  VÉRIFICATION (facultatif) : lister les tables SANS RLS active.
--  Doit renvoyer 0 ligne parmi les tables ci-dessus.
-- ============================================================================
-- select tablename
-- from pg_tables
-- where schemaname = 'public'
--   and rowsecurity = false
--   and tablename in ('programs','sessions','series_logs','objectives',
--                     'user_memories','measurements','saved_programs',
--                     'profiles','app_configs');
