import { NextResponse } from "next/server";
import { generateMetadata } from "@/lib/ai";
import type { ApiResponse, GeneratedMetadata } from "@/lib/types";

function getTopicFromRequest(request: Request) {
  const url = new URL(request.url);
  return url.searchParams.get("topic")?.trim() ?? "";
}

export async function GET(request: Request) {
  try {
    const metadata = await generateMetadata(getTopicFromRequest(request));

    return NextResponse.json<ApiResponse<GeneratedMetadata>>(
      {
        ok: true,
        data: metadata
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to generate preview", error);
    const metadata = await generateMetadata("AI Tools");

    return NextResponse.json<ApiResponse<GeneratedMetadata>>(
      {
        ok: true,
        data: metadata
      },
      { status: 200 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as { topic?: string };
    const metadata = await generateMetadata(body.topic);

    return NextResponse.json<ApiResponse<GeneratedMetadata>>(
      {
        ok: true,
        data: metadata
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to generate preview", error);
    const metadata = await generateMetadata("AI Tools");

    return NextResponse.json<ApiResponse<GeneratedMetadata>>(
      {
        ok: true,
        data: metadata
      },
      { status: 200 }
    );
  }
}
