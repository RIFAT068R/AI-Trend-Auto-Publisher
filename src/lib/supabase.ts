import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let serverSupabaseClient: SupabaseClient | null | undefined;
let browserSupabaseClient: SupabaseClient | null | undefined;

function sanitizeEnvValue(value?: string) {
  return value?.trim().replace(/^['"]|['"]$/g, "") ?? "";
}

function validateSupabaseUrl(url: string, source: string) {
  if (!url) {
    return;
  }

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    throw new Error(`Invalid Supabase URL from ${source}: must start with http or https. Received: ${url}`);
  }
}

function resolveServerSupabaseEnv() {
  const url = sanitizeEnvValue(process.env.SUPABASE_URL);
  const key = sanitizeEnvValue(process.env.SUPABASE_ANON_KEY);

  validateSupabaseUrl(url, "SUPABASE_URL");

  return {
    url,
    key
  };
}

function resolveBrowserSupabaseEnv() {
  const url = sanitizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const key = sanitizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  validateSupabaseUrl(url, "NEXT_PUBLIC_SUPABASE_URL");

  return {
    url,
    key
  };
}

export function getSupabaseClient() {
  if (serverSupabaseClient !== undefined) {
    return serverSupabaseClient;
  }

  const { url, key } = resolveServerSupabaseEnv();

  console.info("[supabase] server env check", {
    hasUrl: Boolean(url),
    hasAnonKey: Boolean(key)
  });

  if (!url || !key) {
    serverSupabaseClient = null;
    return serverSupabaseClient;
  }

  serverSupabaseClient = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  return serverSupabaseClient;
}

export function getBrowserSupabaseClient() {
  if (browserSupabaseClient !== undefined) {
    return browserSupabaseClient;
  }

  const { url, key } = resolveBrowserSupabaseEnv();

  console.info("[supabase] browser env check", {
    hasUrl: Boolean(url),
    hasAnonKey: Boolean(key)
  });

  if (!url || !key) {
    browserSupabaseClient = null;
    return browserSupabaseClient;
  }

  browserSupabaseClient = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  return browserSupabaseClient;
}
