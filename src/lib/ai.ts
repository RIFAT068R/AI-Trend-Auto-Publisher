import type { GeneratedPostPreview } from "@/lib/types";

export async function generatePostPreview(topic?: string): Promise<GeneratedPostPreview> {
  const resolvedTopic = topic ?? "AI agent orchestration for content publishing";

  return {
    title: `${resolvedTopic}: what teams should automate next`,
    summary:
      "A polished long-form post draft with a crisp thesis, publish-ready framing, and a modular structure designed for SEO and social repurposing.",
    keywords: ["ai automation", "trend publishing", "content pipeline", "agent workflow"],
    callToAction: "Review the brief, generate visuals, and queue the post for distribution."
  };
}
