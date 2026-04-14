import { NextResponse } from "next/server";
import { generatePostPreview } from "@/lib/ai";
import type { ApiResponse, GeneratedPostPreview } from "@/lib/types";

export async function GET() {
  try {
    const preview = await generatePostPreview();

    return NextResponse.json<ApiResponse<GeneratedPostPreview>>(
      {
        ok: true,
        data: preview
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to generate preview", error);

    return NextResponse.json<ApiResponse<GeneratedPostPreview>>(
      {
        ok: false,
        error: {
          message: "Failed to generate post preview"
        }
      },
      { status: 500 }
    );
  }
}
