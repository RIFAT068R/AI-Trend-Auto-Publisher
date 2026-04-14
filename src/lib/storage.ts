import { promises as fs } from "fs";
import path from "path";
import type { AutomationModule, HistoryPost, SystemStatus } from "@/lib/types";

const postsFilePath = path.join(process.cwd(), "data", "posts.json");

function isHistoryPost(value: unknown): value is HistoryPost {
  if (!value || typeof value !== "object") {
    return false;
  }

  const post = value as Record<string, unknown>;

  return (
    typeof post.id === "string" &&
    typeof post.topic === "string" &&
    typeof post.title === "string" &&
    typeof post.status === "string" &&
    typeof post.publishedAt === "string" &&
    typeof post.channel === "string"
  );
}

export async function getStoredPosts(): Promise<HistoryPost[]> {
  try {
    const file = await fs.readFile(postsFilePath, "utf8");
    const parsed = JSON.parse(file) as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isHistoryPost).sort((left, right) => {
      return new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime();
    });
  } catch {
    return [];
  }
}

export async function getAutomationModules(): Promise<AutomationModule[]> {
  return [
    {
      name: "Trend Discovery",
      status: "online",
      detail: "Multi-source ingestion is active with a resilient placeholder feed layer."
    },
    {
      name: "Post Generation",
      status: "ready",
      detail: "Structured copy generation contracts are available for title, summary, and CTA output."
    },
    {
      name: "Image Engine",
      status: "ready",
      detail: "Visual prompt generation is prepared for future image model adapters."
    },
    {
      name: "Publishing Queue",
      status: "queued",
      detail: "Dispatch routing is stubbed and ready for channel-specific publishers."
    }
  ];
}

export async function getSystemStatus(): Promise<SystemStatus> {
  const modules = await getAutomationModules();
  const overall = modules.some((module) => module.status === "online") ? "online" : "ready";

  return {
    overall,
    updatedAt: new Date().toISOString(),
    modules
  };
}
