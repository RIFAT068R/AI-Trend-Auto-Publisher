import { NextResponse } from "next/server";
import { getPostPlaceholder } from "@/lib/post";

export async function GET() {
  const post = await getPostPlaceholder();
  return NextResponse.json({
    route: "/api/post",
    ...post
  });
}
