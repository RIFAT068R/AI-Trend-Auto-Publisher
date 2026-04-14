import type { GeneratedImagePreview } from "@/lib/types";

function encodePlaceholder(prompt: string) {
  return encodeURIComponent(prompt.slice(0, 80));
}

export async function generateImagePreview(imagePrompt?: string): Promise<GeneratedImagePreview> {
  const prompt = imagePrompt?.trim() || "Minimal SaaS dashboard illustration";

  return {
    prompt,
    imageUrl: `https://placehold.co/1200x675/e2e8f0/0f172a?text=${encodePlaceholder(prompt)}`,
    alt: prompt,
    provider: "placeholder"
  };
}
