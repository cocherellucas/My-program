import { supabase } from './supabaseClient';
import { createClient } from '@base44/sdk';

const base44SDK = createClient({
  appId: "69dea11732e05b616e23bace",
  headers: {
    "api_key": "475bbcdd4d4241f3b36539e8523339b1"
  }
});

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

const auth = {
  async me() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw new Error('Not authenticated');

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return {
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || '',
      ...(profile || {}),
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
      return base44SDK.integrations.Core.InvokeLLM(
        add_context_from_images?.length
          ? Object.assign({ prompt, model }, { add_context_from_images })
          : { prompt, response_json_schema, model }
      );
    },
  },
};

const functions = {
  async invoke(functionName, params) {
    return base44SDK.functions.invoke(functionName, params);
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
