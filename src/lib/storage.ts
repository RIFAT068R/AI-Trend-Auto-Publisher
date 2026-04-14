import type { PostgrestError } from "@supabase/supabase-js";
import { getSupabaseClient } from "@/lib/supabase";
import type { AutomationModule, CreateDraftInput, HistoryPost, HistoryPostStatus, SupabasePostRow, SystemStatus } from "@/lib/types";

type InsertPostRow = {
  title: string;
  hook: string;
  caption: string;
  hashtags: string[];
  category: string;
  image_url: string;
  source: string;
  status: HistoryPostStatus;
  created_at: string;
};

function mapSupabaseRowToHistoryPost(row: SupabasePostRow): HistoryPost {
  return {
    id: row.id,
    topic: row.category || row.title,
    title: row.title,
    summary: row.caption,
    hook: row.hook,
    caption: row.caption,
    hashtags: Array.isArray(row.hashtags) ? row.hashtags : [],
    category: row.category,
    imagePrompt: "futuristic AI technology background",
    imageUrl: row.image_url ?? "https://via.placeholder.com/1080",
    status: normalizeStatus(row.status),
    publishedAt: row.created_at,
    channel: row.source || "Dashboard",
    source: row.source || "Dashboard",
    createdAt: row.created_at
  };
}

function normalizeStatus(value: string): HistoryPostStatus {
  if (value === "published" || value === "scheduled") {
    return value;
  }

  return "draft";
}

function assertSupabaseConfigured() {
  const client = getSupabaseClient();

  if (!client) {
    throw new Error("Supabase is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY.");
  }

  return client;
}

function formatDbError(context: string, error: PostgrestError | Error | null) {
  if (!error) {
    return `${context}.`;
  }

  return `${context}: ${error.message}`;
}

function logSupabaseError(context: string, error: PostgrestError | Error | null) {
  if (!error) {
    console.error(`[supabase] ${context}`, { message: "Unknown error" });
    return;
  }

  if ("code" in error) {
    console.error(`[supabase] ${context}`, {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint
    });
    return;
  }

  console.error(`[supabase] ${context}`, {
    message: error.message
  });
}

export async function getStoredPosts(): Promise<HistoryPost[]> {
  const client = assertSupabaseConfigured();
  console.info("[supabase] selecting posts", { table: "posts" });
  const { data, error } = await client.from("posts").select("*").order("created_at", { ascending: false });

  if (error) {
    logSupabaseError("select posts failed", error);
    throw new Error(formatDbError("Failed to fetch posts from Supabase", error));
  }

  console.info("[supabase] select posts success", {
    rowCount: data?.length ?? 0
  });

  return ((data ?? []) as SupabasePostRow[]).map(mapSupabaseRowToHistoryPost);
}

export async function saveDraftPost(input: CreateDraftInput): Promise<HistoryPost> {
  const client = assertSupabaseConfigured();
  const createdAt = new Date().toISOString();
  const payload: InsertPostRow = {
    title: input.preview.title,
    hook: input.preview.hook,
    caption: input.preview.caption,
    hashtags: input.preview.hashtags,
    category: input.preview.category,
    image_url: input.image.imageUrl,
    source: input.trend.source,
    status: "draft",
    created_at: createdAt
  };

  console.info("[supabase] inserting post", {
    table: "posts",
    title: payload.title,
    source: payload.source,
    status: payload.status,
    created_at: payload.created_at
  });

  const { data, error } = await client.from("posts").insert(payload).select("*").single();

  if (error) {
    logSupabaseError("insert post failed", error);
    throw new Error(formatDbError("Failed to save post to Supabase", error));
  }

  console.info("[supabase] insert post success", {
    id: data.id,
    created_at: data.created_at
  });

  return mapSupabaseRowToHistoryPost(data as SupabasePostRow);
}

export async function getAutomationModules(): Promise<AutomationModule[]> {
  let queueCount = 0;

  try {
    queueCount = (await getStoredPosts()).length;
  } catch {
    queueCount = 0;
  }

  return [
    {
      name: "Trend Discovery",
      status: "online",
      detail: "Hacker News fetch is active with a mock fallback when the network fails."
    },
    {
      name: "Post Generation",
      status: "ready",
      detail: "Mock metadata generation is always available without API keys."
    },
    {
      name: "Image Engine",
      status: "ready",
      detail: "Placeholder image responses are enabled with no external provider dependency."
    },
    {
      name: "Publishing Queue",
      status: queueCount > 0 ? "queued" : "ready",
      detail: queueCount > 0 ? `${queueCount} post(s) stored in Supabase.` : "No posts stored yet."
    }
  ];
}

export async function getSystemStatus(): Promise<SystemStatus> {
  const modules = await getAutomationModules();

  return {
    overall: "online",
    updatedAt: new Date().toISOString(),
    modules
  };
}
