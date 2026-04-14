import { NextResponse } from "next/server";
import { runPublishingPipeline } from "@/lib/post";
import { getStoredPosts, saveDraftPost } from "@/lib/storage";
import { generateImagePreview } from "@/lib/image";
import { generatePostPreview } from "@/lib/ai";
import type { ApiResponse, CreateDraftInput, HistoryPost, PipelineResult, TrendTopic } from "@/lib/types";

type CreatePostBody = {
  topic?: string;
  source?: string;
  url?: string;
};

function createTrendFromTopic(body: CreatePostBody): TrendTopic {
  const topic = body.topic?.trim() || "Untitled trend";

  return {
    id: `manual-${Date.now()}`,
    title: topic,
    category: "Manual",
    score: 75,
    source: body.source?.trim() || "Manual Entry",
    url: body.url?.trim() || "https://example.com/manual-topic",
    publishedAt: new Date().toISOString()
  };
}

export async function GET() {
  try {
    const posts = await getStoredPosts();

    return NextResponse.json<ApiResponse<HistoryPost[]>>(
      {
        ok: true,
        data: posts
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to read stored posts", error);

    return NextResponse.json<ApiResponse<HistoryPost[]>>(
      {
        ok: true,
        data: []
      },
      { status: 200 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as CreatePostBody & { mode?: "pipeline" | "draft" };

    if (body.mode === "draft" && body.topic) {
      const trend = createTrendFromTopic(body);
      const preview = await generatePostPreview(trend.title);
      const image = await generateImagePreview(preview.imagePrompt);
      const post = await saveDraftPost({ trend, preview, image } satisfies CreateDraftInput);

      return NextResponse.json<ApiResponse<HistoryPost>>(
        {
          ok: true,
          data: post
        },
        { status: 201 }
      );
    }

    const result = await runPublishingPipeline();

    return NextResponse.json<ApiResponse<PipelineResult>>(
      {
        ok: true,
        data: result
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to run publishing pipeline", error);
    const trend = createTrendFromTopic({ topic: "New AI tool replaces developers", source: "Mock", url: "#" });
    const preview = await generatePostPreview(trend.title);
    const image = await generateImagePreview(preview.imagePrompt);
    const fallbackPost = await saveDraftPost({ trend, preview, image } satisfies CreateDraftInput).catch(() => ({
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

    return NextResponse.json<ApiResponse<PipelineResult>>(
      {
        ok: true,
        data: {
          trend,
          preview,
          image,
          post: fallbackPost
        }
      },
      { status: 200 }
    );
  }
}
