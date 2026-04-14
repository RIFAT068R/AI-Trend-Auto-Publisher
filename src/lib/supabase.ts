import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let supabaseClient: SupabaseClient | null | undefined;

function sanitizeEnvValue(value?: string) {
  return value?.trim().replace(/^['"]|['"]$/g, "") ?? "";
}

export function getSupabaseClient() {
  if (supabaseClient !== undefined) {
    return supabaseClient;
  }

  const url = sanitizeEnvValue(process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL);
  const anonKey = sanitizeEnvValue(process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const hasUrl = Boolean(url);
  const hasAnonKey = Boolean(anonKey);

  console.info("[supabase] env check", {
    hasUrl,
    hasAnonKey
  });

  if (!url || !anonKey) {
    supabaseClient = null;
    return supabaseClient;
  }

  if (!/^https?:\/\//.test(url)) {
    throw new Error(`Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL. Received: ${url}`);
  }

  supabaseClient = createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  return supabaseClient;
}
