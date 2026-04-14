import { NextResponse } from "next/server";
import { getAllTrends } from "@/lib/trends";
import type { ApiResponse, TrendTopic } from "@/lib/types";

export async function GET() {
  try {
    const trends = await getAllTrends();

    return NextResponse.json<ApiResponse<TrendTopic[]>>(
      {
        ok: true,
        data: trends
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch trends", error);

    return NextResponse.json<ApiResponse<TrendTopic[]>>(
      {
        ok: true,
        data: [
          {
            id: "mock-trend-route",
            title: "New AI tool replaces developers",
            source: "Mock",
            url: "#",
            publishedAt: new Date().toISOString(),
            score: 95,
            category: "AI Tools"
          }
        ]
      },
      { status: 200 }
    );
  }
}
