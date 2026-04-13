import { NextResponse } from "next/server";
import { getMetadataPlaceholder } from "@/lib/ai";

export async function GET() {
  const metadata = await getMetadataPlaceholder();
  return NextResponse.json({
    route: "/api/generate",
    ...metadata
  });
}
