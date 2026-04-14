import type { GeneratedMetadata, GeneratedPostPreview } from "@/lib/types";

const fallbackHooks = [
  "AI Changes Everything",
  "This Tool Replaces Devs",
  "Future of Coding is Here",
  "Automation Just Leveled Up",
  "The Workflow Shift Begins"
];

function pickHook(topic: string) {
  const index = topic.length % fallbackHooks.length;
  return fallbackHooks[index];
}

function buildMockMetadata(topic?: string): GeneratedMetadata {
  const resolvedTopic = topic?.trim() || "AI Tools";

  return {
    hook: pickHook(resolvedTopic),
    caption: `${resolvedTopic} is getting attention because teams want faster workflows, smarter automation, and simpler ways to ship content consistently.`,
    hashtags: ["#AI", "#Tech", "#Automation"],
    category: "AI Tools",
    imagePrompt: `futuristic AI technology background inspired by ${resolvedTopic}, clean composition, subject on right side, empty space on left for text, no text`
  };
}

function normalizeHashtags(value: unknown) {
  if (!Array.isArray(value)) {
    return ["#AI", "#Tech", "#Automation"];
  }

  const normalized = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => (item.startsWith("#") ? item : `#${item}`));

  return normalized.length > 0 ? Array.from(new Set(normalized)) : ["#AI", "#Tech", "#Automation"];
}

function parseMetadataPayload(raw: string): GeneratedMetadata | null {
  try {
    const cleaned = raw.trim().replace(/^```json\s*|^```\s*|\s*```$/g, "");
    const parsed = JSON.parse(cleaned) as Record<string, unknown>;

    if (
      typeof parsed.hook !== "string" ||
      typeof parsed.caption !== "string" ||
      typeof parsed.category !== "string" ||
      typeof parsed.imagePrompt !== "string"
    ) {
      return null;
    }

    return {
      hook: parsed.hook.trim(),
      caption: parsed.caption.trim(),
      hashtags: normalizeHashtags(parsed.hashtags),
      category: parsed.category.trim() || "AI Tools",
      imagePrompt: parsed.imagePrompt.trim() || "futuristic AI technology background"
    };
  } catch {
    return null;
  }
}

export async function generateMetadata(topic?: string): Promise<GeneratedMetadata> {
  const resolvedTopic = topic?.trim() || "AI Tools";
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return buildMockMetadata(resolvedTopic);
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text:
                    `Generate social content metadata for the topic "${resolvedTopic}". Return valid JSON only with exactly these fields: hook, caption, hashtags, category, imagePrompt. ` +
                    "The hook should be short and viral. The caption should be one concise paragraph. hashtags must be an array of strings. category should be concise. imagePrompt should describe a visual concept for a text-free poster background with clean composition, subject on the right side, empty space on the left for text, and no text. Do not wrap in markdown."
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.8,
            responseMimeType: "application/json"
          }
        })
      }
    );

    if (!response.ok) {
      return buildMockMetadata(resolvedTopic);
    }

    const payload = (await response.json()) as {
      candidates?: Array<{
        content?: {
          parts?: Array<{
            text?: string;
          }>;
        };
      }>;
    };

    const text = payload.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("") ?? "";
    const parsed = parseMetadataPayload(text);

    return parsed ?? buildMockMetadata(resolvedTopic);
  } catch {
    return buildMockMetadata(resolvedTopic);
  }
}

export async function generatePostPreview(topic?: string): Promise<GeneratedPostPreview> {
  const resolvedTopic = topic?.trim() || "AI Tools";
  const metadata = await generateMetadata(resolvedTopic);

  return {
    topic: resolvedTopic,
    title: `${resolvedTopic}: what to know now`,
    summary: `A simple mock draft based on ${resolvedTopic.toLowerCase()}, designed to keep the publishing pipeline working without external services.`,
    hook: metadata.hook,
    caption: metadata.caption,
    hashtags: metadata.hashtags,
    category: metadata.category,
    imagePrompt: metadata.imagePrompt,
    tags: [metadata.category, "Automation", "Tech"],
    callToAction: "Review the mock draft and publish when ready."
  };
}
