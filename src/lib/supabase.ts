import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let serverSupabaseClient: SupabaseClient | null | undefined;
let browserSupabaseClient: SupabaseClient | null | undefined;

function sanitizeEnvValue(value?: string) {
  return value?.trim().replace(/^['"]|['"]$/g, "") ?? "";
}

function looksLikeUrl(value: string) {
  return value.startsWith("http://") || value.startsWith("https://");
}

function looksLikePublishableKey(value: string) {
  return value.startsWith("sb_");
}

function validateSupabaseUrl(url: string, source: string) {
  if (!url) {
    return;
  }

  if (!looksLikeUrl(url)) {
    throw new Error(`Invalid Supabase URL from ${source}: must start with http or https. Received: ${url}`);
  }
}

function resolvePair(urlValue: string, keyValue: string, urlSource: string, keySource: string) {
  if (looksLikePublishableKey(urlValue) && looksLikeUrl(keyValue)) {
    console.warn("[supabase] swapped env values detected", {
      urlSource,
      keySource
    });

    return {
      url: keyValue,
      key: urlValue
    };
  }

  return {
    url: urlValue,
    key: keyValue
  };
}

function resolveServerSupabaseEnv() {
  const resolved = resolvePair(
    sanitizeEnvValue(process.env.SUPABASE_URL),
    sanitizeEnvValue(process.env.SUPABASE_ANON_KEY),
    "SUPABASE_URL",
    "SUPABASE_ANON_KEY"
  );

  validateSupabaseUrl(resolved.url, "SUPABASE_URL");

  return {
    url: resolved.url,
    key: resolved.key
  };
}

function resolveBrowserSupabaseEnv() {
  const resolved = resolvePair(
    sanitizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL),
    sanitizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  );

  validateSupabaseUrl(resolved.url, "NEXT_PUBLIC_SUPABASE_URL");

  return {
    url: resolved.url,
    key: resolved.key
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
