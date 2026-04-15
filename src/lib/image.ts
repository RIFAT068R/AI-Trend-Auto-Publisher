import type { GeneratedImagePreview } from "@/lib/types";

function buildCloudflarePrompt(imagePrompt?: string) {
  const basePrompt = imagePrompt?.trim() || "premium technology poster visual";

  return [
    "premium advertising poster",
    "modern tech campaign visual",
    basePrompt,
    "one strong focal subject",
    "clean composition",
    "subject placement designed for headline space",
    "empty space reserved for text overlay",
    "cinematic lighting",
    "professional product-ad composition",
    "high contrast",
    "premium detail",
    "no text",
    "no watermark",
    "no clutter",
    "no collage"
  ].join(", ");
}

function toDataUrl(base64: string) {
  return `data:image/png;base64,${base64}`;
}

export async function generateImagePreview(imagePrompt?: string): Promise<GeneratedImagePreview> {
  const prompt = buildCloudflarePrompt(imagePrompt);
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !apiToken) {
    return {
      prompt,
      imageUrl: "https://via.placeholder.com/1080",
      alt: "Mock generated image",
      provider: "placeholder"
    };
  }

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/stabilityai/stable-diffusion-xl-base-1.0`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt,
          num_steps: 20,
          guidance: 7.5,
          num_images: 1,
          width: 1024,
          height: 1024
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Cloudflare AI request failed with ${response.status}`);
    }

    const contentType = response.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      const payload = (await response.json()) as {
        result?: {
          image?: string;
        };
        errors?: Array<{ message?: string }>;
      };

      const base64 = payload.result?.image;

      if (!base64) {
        throw new Error(payload.errors?.[0]?.message || "Cloudflare AI did not return an image.");
      }

      return {
        prompt,
        imageUrl: toDataUrl(base64),
        alt: "Cloudflare AI generated poster",
        provider: "cloudflare",
        base64
      };
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    return {
      prompt,
      imageUrl: toDataUrl(base64),
      alt: "Cloudflare AI generated poster",
      provider: "cloudflare",
      base64
    };
  } catch (error) {
    console.error("Cloudflare image generation failed", error);

    return {
      prompt,
      imageUrl: "https://via.placeholder.com/1080",
      alt: "Fallback generated image",
      provider: "placeholder"
    };
  }
}
