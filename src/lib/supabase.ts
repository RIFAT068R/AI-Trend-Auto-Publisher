import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let supabaseClient: SupabaseClient | null | undefined;

function sanitizeEnvValue(value?: string) {
  return value?.trim().replace(/^['"]|['"]$/g, "") ?? "";
}

function resolveSupabaseEnv() {
  const candidates = [
    {
      url: sanitizeEnvValue(process.env.SUPABASE_URL),
      key: sanitizeEnvValue(process.env.SUPABASE_ANON_KEY),
      label: "server"
    },
    {
      url: sanitizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL),
      key: sanitizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      label: "next_public"
    }
  ];

  const validCandidate = candidates.find((candidate) => {
    return Boolean(candidate.url) && Boolean(candidate.key) && /^https?:\/\//.test(candidate.url);
  });

  return {
    candidates,
    selected: validCandidate
  };
}

export function getSupabaseClient() {
  if (supabaseClient !== undefined) {
    return supabaseClient;
  }

  const resolved = resolveSupabaseEnv();

  console.info("[supabase] env check", {
    candidates: resolved.candidates.map((candidate) => ({
      label: candidate.label,
      hasUrl: Boolean(candidate.url),
      hasAnonKey: Boolean(candidate.key),
      urlLooksValid: /^https?:\/\//.test(candidate.url)
    })),
    selected: resolved.selected?.label ?? null
  });

  if (!resolved.selected) {
    supabaseClient = null;
    const invalidUrlCandidate = resolved.candidates.find((candidate) => candidate.url && !/^https?:\/\//.test(candidate.url));

    if (invalidUrlCandidate) {
      throw new Error(`Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL. Received: ${invalidUrlCandidate.url}`);
    }

    return supabaseClient;
  }

  supabaseClient = createClient(resolved.selected.url, resolved.selected.key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  return supabaseClient;
}
