import { generatePostPreview } from "@/lib/ai";
import { generateImagePreview } from "@/lib/image";
import { saveDraftPost } from "@/lib/storage";
import { getTopTrend } from "@/lib/trends";
import type { PipelineResult, TrendTopic } from "@/lib/types";

function createFallbackTrend(): TrendTopic {
  return {
    id: "mock-pipeline-trend",
    title: "New AI tool replaces developers",
    source: "Mock",
    url: "#",
    publishedAt: new Date().toISOString(),
    score: 95,
    category: "AI Tools"
  };
}

export async function runPublishingPipeline(): Promise<PipelineResult> {
  const trend = await getTopTrend().catch(() => createFallbackTrend());
  const preview = await generatePostPreview(trend.title).catch(() => generatePostPreview(createFallbackTrend().title));
  const image = await generateImagePreview(preview.imagePrompt).catch(() => generateImagePreview("futuristic AI technology background"));
  const post = await saveDraftPost({
    trend,
    preview,
    image,
    channel: "Dashboard"
  }).catch(async () => ({
    id: `post-${Date.now()}`,
    topic: trend.title,
    title: preview.title,
    summary: preview.summary,
    hook: preview.hook,
    caption: preview.caption,
    hashtags: preview.hashtags,
    category: preview.category,
    imagePrompt: preview.imagePrompt,
    imageUrl: image.imageUrl,
    status: "draft" as const,
    publishedAt: new Date().toISOString(),
    channel: "Dashboard",
    source: trend.source
  }));

  return {
    trend,
    preview,
    image,
    post
  };
}
