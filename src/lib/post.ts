import { generatePostPreview } from "@/lib/ai";
import { generateImagePreview } from "@/lib/image";
import { saveDraftPost } from "@/lib/storage";
import { getTopTrend } from "@/lib/trends";
import type { PipelineResult } from "@/lib/types";

export async function runPublishingPipeline(): Promise<PipelineResult> {
  const trend = await getTopTrend();
  const preview = await generatePostPreview(trend.title);
  const image = await generateImagePreview(preview.imagePrompt);
  const post = await saveDraftPost({
    trend,
    preview,
    image,
    channel: "Dashboard"
  });

  return {
    trend,
    preview,
    image,
    post
  };
}
