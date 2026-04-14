import type { PublishResult } from "@/lib/types";

export async function createPostJob(): Promise<PublishResult> {
  return {
    destination: "Publishing queue",
    status: "queued",
    message: "Post delivery is staged behind a placeholder publisher and ready for platform adapters."
  };
}
