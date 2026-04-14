import { promises as fs } from "fs";
import path from "path";
import type { AutomationModule, CreateDraftInput, HistoryPost, SystemStatus } from "@/lib/types";

const postsFilePath = path.join(process.cwd(), "data", "posts.json");

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
    hashtags: ["#ImportedPost"],
    category: post.topic,
    imagePrompt: `Create a clean editorial image for ${post.title}`,
    imageUrl: "https://placehold.co/1200x675/e2e8f0/0f172a?text=Imported+Post",
    status: post.status === "published" || post.status === "scheduled" || post.status === "draft" ? post.status : "draft",
    publishedAt: post.publishedAt,
    channel: post.channel,
    source: post.channel
  };
}

async function ensurePostsFile() {
  await fs.mkdir(path.dirname(postsFilePath), { recursive: true });

  try {
    await fs.access(postsFilePath);
  } catch {
    await fs.writeFile(postsFilePath, "[]", "utf8");
  }
}

export async function getStoredPosts(): Promise<HistoryPost[]> {
  await ensurePostsFile();

  try {
    const file = await fs.readFile(postsFilePath, "utf8");
    const parsed = JSON.parse(file) as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((item) => {
        if (isHistoryPost(item)) {
          return item;
        }

        return normalizeLegacyPost(item);
      })
      .filter((item): item is HistoryPost => item !== null)
      .sort((left, right) => {
        return new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime();
      });
  } catch {
    return [];
  }
}

export async function saveDraftPost(input: CreateDraftInput): Promise<HistoryPost> {
  const posts = await getStoredPosts();
  const now = new Date().toISOString();

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
    publishedAt: now,
    channel: input.channel ?? "Dashboard",
    source: input.trend.source
  };

  const updatedPosts = [newPost, ...posts];
  await fs.writeFile(postsFilePath, JSON.stringify(updatedPosts, null, 2), "utf8");

  return newPost;
}

export async function getAutomationModules(): Promise<AutomationModule[]> {
  const posts = await getStoredPosts();

  return [
    {
      name: "Trend Discovery",
      status: "online",
      detail: "Live feeds from Hacker News and tech RSS are available."
    },
    {
      name: "Post Generation",
      status: "ready",
      detail: "Mock generation is active and can upgrade to a real AI provider when a key is configured."
    },
    {
      name: "Image Engine",
      status: "ready",
      detail: "Placeholder image generation is returning a usable preview URL."
    },
    {
      name: "Publishing Queue",
      status: posts.length > 0 ? "queued" : "ready",
      detail: posts.length > 0 ? `${posts.length} stored post(s) available in local JSON storage.` : "No posts saved yet."
    }
  ];
}

export async function getSystemStatus(): Promise<SystemStatus> {
  const modules = await getAutomationModules();

  return {
    overall: modules.some((module) => module.status === "online") ? "online" : "ready",
    updatedAt: new Date().toISOString(),
    modules
  };
}
