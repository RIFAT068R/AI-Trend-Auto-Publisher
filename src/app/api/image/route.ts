import { NextResponse } from "next/server";
import { getImagePlaceholder } from "@/lib/image";

export async function GET() {
  const image = await getImagePlaceholder();
  return NextResponse.json({
    route: "/api/image",
    ...image
  });
}
