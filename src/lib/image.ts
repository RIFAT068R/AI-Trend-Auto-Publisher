import type { GeneratedImagePreview } from "@/lib/types";

export async function generateImagePreview(imagePrompt?: string): Promise<GeneratedImagePreview> {
  return {
    prompt: imagePrompt?.trim() || "futuristic AI technology background",
    imageUrl: "https://via.placeholder.com/1080",
    alt: "Mock generated image",
    provider: "placeholder"
  };
}
