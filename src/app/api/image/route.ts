import { NextResponse } from "next/server";
import { generateImagePreview } from "@/lib/image";
import type { ApiResponse, GeneratedImagePreview } from "@/lib/types";

export async function GET() {
  try {
    const image = await generateImagePreview();

    return NextResponse.json<ApiResponse<GeneratedImagePreview>>(
      {
        ok: true,
        data: image
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to generate image preview", error);

    return NextResponse.json<ApiResponse<GeneratedImagePreview>>(
      {
        ok: false,
        error: {
          message: "Failed to generate image preview"
        }
      },
      { status: 500 }
    );
  }
}
