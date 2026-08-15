import { supabase } from './supabaseClient';
import { createClient } from '@base44/sdk';

// ─── Client base44 (IA + fonctions distantes) ────────────────────────────────
// La clé API était ÉCRITE EN DUR ici. Le dépôt étant public, elle s'est
// retrouvée sur GitHub et dans chaque bundle livré — vérifié, elle apparaissait
// telle quelle dans dist/assets. Elle doit être considérée comme compromise et
// RÉVOQUÉE côté base44 ; la retirer d'ici n'efface pas ce qui a été publié.
//
// ⚠ ATTENTION — passer par une variable d'environnement ne SÉCURISE RIEN :
// Vite remplace les `import.meta.env.VITE_*` par leur valeur au build, la clé
// repartirait donc dans le bundle, simplement plus dans le dépôt. Tant que
// l'appel part du navigateur, la clé est publique, point.
//
// La vraie parade, avant de repasser AI_BLOCKED à false : router l'appel par
// une fonction serveur (Edge Function Supabase ou fonction Vercel) qui détient
// la clé et relaie la requête — même schéma que supabase/functions/stripe-webhook.
// D'ici là le client n'est construit QUE si on l'appelle vraiment, et il refuse
// de partir sans clé plutôt que d'échouer silencieusement.
let sdkCache = null;
function base44SDKClient() {
  if (sdkCache) return sdkCache;
  const apiKey = import.meta.env.VITE_BASE44_API_KEY;
  if (!apiKey) throw new Error("base44 : clé API absente (VITE_BASE44_API_KEY). Voir le commentaire dans base44Client.js — l'appel doit passer par une fonction serveur.");
  sdkCache = createClient({
    appId: import.meta.env.VITE_BASE44_APP_ID || "69dea11732e05b616e23bace",
    headers: { api_key: apiKey },
  });
  return sdkCache;
}

export { supabase };

const TABLE_MAP = {
  Program: 'programs',
  Session: 'sessions',
  SeriesLog: 'series_logs',
  Objective: 'objectives',
  UserMemory: 'user_memories',
  Measurement: 'measurements',
  SavedProgram: 'saved_programs',
  AppConfig: 'app_configs',
};

const SORT_FIELD_MAP = {
  created_date: 'created_at',
  updated_date: 'updated_at',
};

function normalizeRow(row) {
  if (!row) return row;
  return {
    ...row,
    created_date: row.created_date ?? row.created_at,
    updated_date: row.updated_date ?? row.updated_at,
  };
}

function createEntityAPI(tableName) {
  return {
    async filter(conditions = {}, sort = null, limit = null) {
      let query = supabase.from(tableName).select('*');

      for (const [key, value] of Object.entries(conditions)) {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      }

      if (sort) {
        const desc = sort.startsWith('-');
        const rawField = desc ? sort.slice(1) : sort;
        const field = SORT_FIELD_MAP[rawField] || rawField;
        query = query.order(field, { ascending: !desc });
      }

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []).map(normalizeRow);
    },

    async create(data) {
      const { data: result, error } = await supabase
        .from(tableName)
        .insert(data)
        .select()
        .single();
      if (error) throw error;
      return normalizeRow(result);
    },

    async update(id, data) {
      const { data: result, error } = await supabase
        .from(tableName)
        .update(data)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return normalizeRow(result);
    },

    async delete(id) {
      const { error } = await supabase.from(tableName).delete().eq('id', id);
      if (error) throw error;
    },
  };
}

// `supabase.auth.getUser()` prend un VERROU partagé (Web Locks API) pour
// sérialiser le rafraîchissement du jeton. L'app appelle `me()` depuis une
// dizaine d'écrans, dont plusieurs au même instant au chargement : ces appels se
// disputent le verrou et l'un d'eux échoue avec NavigatorLockAcquireTimeoutError
// (« another request stole it »), en rejet de promesse non capturé.
// On mutualise donc les appels SIMULTANÉS — un seul aller-retour à la fois —
// et on réessaie une fois si le verrou a quand même été volé (cas de plusieurs
// onglets ouverts, où la concurrence est entre fenêtres et non dans notre code).
let meEnVol = null;
const estVerrouVole = (e) =>
  /NavigatorLockAcquireTimeout|another request stole it/i.test(e?.name + ' ' + e?.message);

const auth = {
  me() {
    if (meEnVol) return meEnVol;
    meEnVol = (async () => {
      try {
        return await auth._fetchMe();
      } catch (e) {
        if (!estVerrouVole(e)) throw e;
        await new Promise((r) => setTimeout(r, 150));
        return auth._fetchMe();
      } finally {
        meEnVol = null;
      }
    })();
    return meEnVol;
  },

  async _fetchMe() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw new Error('Not authenticated');

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // Le profil est fusionné AVANT l'email/nom : la colonne profiles.email peut
    // être vide et écraserait sinon l'email d'authentification (toujours connu).
    return {
      ...(profile || {}),
      id: user.id,
      email: profile?.email || user.email,
      full_name: user.user_metadata?.full_name || profile?.full_name || '',
    };
  },

  async updateMe(data) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, ...data }, { onConflict: 'id' });

    if (error) throw error;
  },

  logout(redirectUrl) {
    supabase.auth.signOut().then(() => {
      window.location.href = redirectUrl || '/login';
    });
  },

  redirectToLogin(currentUrl) {
    const redirect = currentUrl ? `?redirect=${encodeURIComponent(currentUrl)}` : '';
    window.location.href = `/login${redirect}`;
  },
};

const AI_BLOCKED = true; // TODO: passer à false pour réactiver l'IA

const integrations = {
  Core: {
    async InvokeLLM({ prompt, response_json_schema, model, add_context_from_images }) {
      if (AI_BLOCKED) throw new Error('IA temporairement désactivée.');
      // @ts-ignore
      return base44SDKClient().integrations.Core.InvokeLLM(
        add_context_from_images?.length
          ? Object.assign({ prompt, model }, { add_context_from_images })
          : { prompt, response_json_schema, model }
      );
    },
  },
};

const functions = {
  async invoke(functionName, params) {
    return base44SDKClient().functions.invoke(functionName, params);
  },
};

export const base44 = {
  auth,
  entities: Object.fromEntries(
    Object.entries(TABLE_MAP).map(([name, table]) => [name, createEntityAPI(table)])
  ),
  integrations,
  functions,
};
