import { NextResponse } from "next/server";
import { generateImagePreview } from "@/lib/image";
import type { ApiResponse, GeneratedImagePreview } from "@/lib/types";

function getPromptFromRequest(request: Request) {
  const url = new URL(request.url);
  return url.searchParams.get("imagePrompt")?.trim() ?? "";
}

export async function GET(request: Request) {
  try {
    const image = await generateImagePreview(getPromptFromRequest(request));

    return NextResponse.json<ApiResponse<GeneratedImagePreview>>(
      {
        ok: true,
        data: image
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to generate image preview", error);
    const image = await generateImagePreview("futuristic AI technology background");

    return NextResponse.json<ApiResponse<GeneratedImagePreview>>(
      {
        ok: true,
        data: image
      },
      { status: 200 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as { imagePrompt?: string };
    const image = await generateImagePreview(body.imagePrompt);

    return NextResponse.json<ApiResponse<GeneratedImagePreview>>(
      {
        ok: true,
        data: image
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to generate image preview", error);
    const image = await generateImagePreview("futuristic AI technology background");

    return NextResponse.json<ApiResponse<GeneratedImagePreview>>(
      {
        ok: true,
        data: image
      },
      { status: 200 }
    );
  }
}
