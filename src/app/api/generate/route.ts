import { NextResponse } from "next/server";
import { generatePostPreview } from "@/lib/ai";
import type { ApiResponse, GeneratedPostPreview } from "@/lib/types";

function getTopicFromRequest(request: Request) {
  const url = new URL(request.url);
  return url.searchParams.get("topic")?.trim() ?? "";
}

export async function GET(request: Request) {
  try {
    const preview = await generatePostPreview(getTopicFromRequest(request));

    return NextResponse.json<ApiResponse<GeneratedPostPreview>>(
      {
        ok: true,
        data: preview
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to generate preview", error);
    const preview = await generatePostPreview("AI Tools");

    return NextResponse.json<ApiResponse<GeneratedPostPreview>>(
      {
        ok: true,
        data: preview
      },
      { status: 200 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as { topic?: string };
    const preview = await generatePostPreview(body.topic);

    return NextResponse.json<ApiResponse<GeneratedPostPreview>>(
      {
        ok: true,
        data: preview
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to generate preview", error);
    const preview = await generatePostPreview("AI Tools");

    return NextResponse.json<ApiResponse<GeneratedPostPreview>>(
      {
        ok: true,
        data: preview
      },
      { status: 200 }
    );
  }
}
