import type { PostgrestError } from "@supabase/supabase-js";
import { getSupabaseClient } from "@/lib/supabase";
import type { AutomationModule, CreateDraftInput, HistoryPost, HistoryPostStatus, SupabasePostRow, SystemStatus } from "@/lib/types";

type InsertPostRow = {
  title: string;
  hook: string;
  caption: string;
  hashtags: string[];
  category: string;
  imageurl: string;
  source: string;
  status: HistoryPostStatus;
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
    imageUrl: row.imageurl ?? "https://via.placeholder.com/1080",
    status: normalizeStatus(row.status),
    publishedAt: row.createdat,
    channel: row.source || "Dashboard",
    source: row.source || "Dashboard",
    createdAt: row.createdat
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

export async function getStoredPosts(): Promise<HistoryPost[]> {
  const client = assertSupabaseConfigured();
  const { data, error } = await client.from("posts").select("*").order("createdat", { ascending: false });

  if (error) {
    throw new Error(formatDbError("Failed to fetch posts from Supabase", error));
  }

  return ((data ?? []) as SupabasePostRow[]).map(mapSupabaseRowToHistoryPost);
}

export async function saveDraftPost(input: CreateDraftInput): Promise<HistoryPost> {
  const client = assertSupabaseConfigured();
  const payload: InsertPostRow = {
    title: input.preview.title,
    hook: input.preview.hook,
    caption: input.preview.caption,
    hashtags: input.preview.hashtags,
    category: input.preview.category,
    imageurl: input.image.imageUrl,
    source: input.trend.source,
    status: "draft"
  };

  const { data, error } = await client.from("posts").insert(payload).select("*").single();

  if (error) {
    throw new Error(formatDbError("Failed to save post to Supabase", error));
  }

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
