import { getEnv } from "@/lib/env";
import type { GeneratedPostPreview } from "@/lib/types";

function deriveCategory(topic: string) {
  const lowered = topic.toLowerCase();

  if (lowered.includes("ai") || lowered.includes("agent")) {
    return "AI Automation";
  }

  if (lowered.includes("search") || lowered.includes("seo")) {
    return "SEO";
  }

  if (lowered.includes("video") || lowered.includes("creator")) {
    return "Content Strategy";
  }

  return "Technology";
}

function buildMockPreview(topic: string): GeneratedPostPreview {
  const category = deriveCategory(topic);
  const baseTag = topic
    .toLowerCase()
    .split(/\s+/)
    .slice(0, 2)
    .join("");

  return {
    topic,
    title: `${topic}: what operators should do next`,
    summary: `A short-form draft focused on why ${topic.toLowerCase()} matters now, what changed recently, and how teams can act on it without overcomplicating their workflow.`,
    hook: `${topic} is moving from interesting signal to real workflow priority.`,
    caption: `Teams are watching ${topic.toLowerCase()} closely because it is shaping how content gets discovered, created, and shipped faster.`,
    hashtags: ["#AITools", "#Automation", `#${baseTag || "TechTrends"}`, "#ContentOps"],
    category,
    imagePrompt: `Create a clean editorial illustration about ${topic}, modern SaaS dashboard style, minimal composition, soft blue accents, bright background.`,
    tags: [category, "Workflow", "Publishing"],
    callToAction: "Review the draft, generate the image, and save it as the next queued post."
  };
}

export async function generatePostPreview(topic?: string): Promise<GeneratedPostPreview> {
  const resolvedTopic = topic?.trim() || "AI automation workflow";
  const env = getEnv();

  if (!env.openAiApiKey) {
    return buildMockPreview(resolvedTopic);
  }

  return buildMockPreview(resolvedTopic);
}
