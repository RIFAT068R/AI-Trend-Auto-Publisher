import type { GeneratedImagePreview } from "@/lib/types";

export async function generateImagePreview(topic?: string): Promise<GeneratedImagePreview> {
  const resolvedTopic = topic ?? "AI automation dashboard";

  return {
    prompt:
      `Premium editorial hero for ${resolvedTopic}, cinematic blue and cyan glow, glass interfaces, futuristic product lighting, refined minimal composition`,
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80",
    alt: "Abstract premium automation dashboard visual"
  };
}
