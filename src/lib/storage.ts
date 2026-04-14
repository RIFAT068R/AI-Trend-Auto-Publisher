import { promises as fs } from "fs";
import path from "path";
import type { AutomationModule, CreateDraftInput, HistoryPost, SystemStatus } from "@/lib/types";

const postsFilePath = path.join(process.cwd(), "data", "posts.json");

let memoryPosts: HistoryPost[] = [];
let fileReadAttempted = false;

type LegacyHistoryPost = {
  id?: string;
  topic?: string;
  title?: string;
  status?: string;
  publishedAt?: string;
  channel?: string;
};

function isHistoryPost(value: unknown): value is HistoryPost {
  if (!value || typeof value !== "object") {
    return false;
  }

  const post = value as Record<string, unknown>;

  return (
    typeof post.id === "string" &&
    typeof post.topic === "string" &&
    typeof post.title === "string" &&
    typeof post.summary === "string" &&
    typeof post.hook === "string" &&
    typeof post.caption === "string" &&
    Array.isArray(post.hashtags) &&
    typeof post.category === "string" &&
    typeof post.imagePrompt === "string" &&
    typeof post.imageUrl === "string" &&
    typeof post.status === "string" &&
    typeof post.publishedAt === "string" &&
    typeof post.channel === "string" &&
    typeof post.source === "string"
  );
}

function normalizeLegacyPost(value: unknown): HistoryPost | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const post = value as LegacyHistoryPost;

  if (
    typeof post.id !== "string" ||
    typeof post.topic !== "string" ||
    typeof post.title !== "string" ||
    typeof post.status !== "string" ||
    typeof post.publishedAt !== "string" ||
    typeof post.channel !== "string"
  ) {
    return null;
  }

  return {
    id: post.id,
    topic: post.topic,
    title: post.title,
    summary: "Imported legacy draft record.",
    hook: `Imported post for ${post.title}.`,
    caption: `Legacy post entry for ${post.topic}.`,
    hashtags: ["#AI", "#Tech", "#Automation"],
    category: "AI Tools",
    imagePrompt: "futuristic AI technology background",
    imageUrl: "https://via.placeholder.com/1080",
    status: post.status === "published" || post.status === "scheduled" || post.status === "draft" ? post.status : "draft",
    publishedAt: post.publishedAt,
    channel: post.channel,
    source: post.channel
  };
}

async function loadFilePostsOnce() {
  if (fileReadAttempted) {
    return;
  }

  fileReadAttempted = true;

  try {
    const file = await fs.readFile(postsFilePath, "utf8");
    const parsed = JSON.parse(file) as unknown;

    if (!Array.isArray(parsed)) {
      return;
    }

    memoryPosts = parsed
      .map((item) => {
        if (isHistoryPost(item)) {
          return item;
        }

        return normalizeLegacyPost(item);
      })
      .filter((item): item is HistoryPost => item !== null)
      .sort((left, right) => new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime());
  } catch {
    memoryPosts = [];
  }
}

export async function getStoredPosts(): Promise<HistoryPost[]> {
  await loadFilePostsOnce();
  return [...memoryPosts];
}

export async function saveDraftPost(input: CreateDraftInput): Promise<HistoryPost> {
  await loadFilePostsOnce();

  const newPost: HistoryPost = {
    id: `post-${Date.now()}`,
    topic: input.trend.title,
    title: input.preview.title,
    summary: input.preview.summary,
    hook: input.preview.hook,
    caption: input.preview.caption,
    hashtags: input.preview.hashtags,
    category: input.preview.category,
    imagePrompt: input.preview.imagePrompt,
    imageUrl: input.image.imageUrl,
    status: "draft",
    publishedAt: new Date().toISOString(),
    channel: input.channel ?? "Dashboard",
    source: input.trend.source
  };

  memoryPosts = [newPost, ...memoryPosts].sort((left, right) => new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime());
  return newPost;
}

export async function getAutomationModules(): Promise<AutomationModule[]> {
  const posts = await getStoredPosts();

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
      status: posts.length > 0 ? "queued" : "ready",
      detail: posts.length > 0 ? `${posts.length} in-memory post(s) available for this runtime.` : "No posts generated in this runtime yet."
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
