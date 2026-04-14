import { NextResponse } from "next/server";
import { createPostJob } from "@/lib/post";
import type { ApiResponse, PublishResult } from "@/lib/types";

export async function GET() {
  try {
    const result = await createPostJob();

    return NextResponse.json<ApiResponse<PublishResult>>(
      {
        ok: true,
        data: result
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to create post job", error);

    return NextResponse.json<ApiResponse<PublishResult>>(
      {
        ok: false,
        error: {
          message: "Failed to create post job"
        }
      },
      { status: 500 }
    );
  }
}
