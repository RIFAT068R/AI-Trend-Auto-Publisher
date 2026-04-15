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

function detectTopicType(topic: string) {
  const lowered = topic.toLowerCase();

  if (/(security|breach|cyber|malware|threat|privacy)/.test(lowered)) {
    return "cybersecurity";
  }

  if (/(code|coding|developer|devtools|github|programming|editor)/.test(lowered)) {
    return "coding";
  }

  if (/(chip|server|gpu|hardware|device|processor)/.test(lowered)) {
    return "hardware";
  }

  if (/(social|platform|creator|app|phone|tiktok|instagram|youtube)/.test(lowered)) {
    return "platform";
  }

  if (/(startup|business|saas|product|launch|company)/.test(lowered)) {
    return "business";
  }

  return "ai-tools";
}

function buildVisualStrategy(topic: string) {
  const topicType = detectTopicType(topic);

  switch (topicType) {
    case "coding":
      return {
        category: "Dev Tools",
        posterConcept: "Developer workflow campaign",
        visualAngle: "A focused workstation scene showing a premium coding workflow in motion",
        mainSubject: "Laptop and code editor interface",
        compositionStyle: "template-a" as const,
        headlineLayout: "top-left" as const,
        colorMood: "blue-tech",
        designStyle: "premium ad poster",
        subheadline: "A sharper coding workflow is becoming the new competitive edge.",
        imagePrompt:
          `premium advertising poster, modern tech campaign visual about ${topic}, one strong focal subject, cinematic lighting, professional product-ad composition, laptop and editor workflow scene, subject placement designed for text space, clean composition, subject on right side, empty space on left for text, no text, no watermark, no collage, no clutter, premium detail`
      };
    case "cybersecurity":
      return {
        category: "Cybersecurity",
        posterConcept: "Security alert editorial campaign",
        visualAngle: "A tense but premium investigation scene around a live security dashboard",
        mainSubject: "Threat monitoring dashboard",
        compositionStyle: "template-c" as const,
        headlineLayout: "top-left" as const,
        colorMood: "security-red",
        designStyle: "editorial cover",
        subheadline: "Security teams are moving from reactive alerts to visual command centers.",
        imagePrompt:
          `premium advertising poster, modern tech campaign visual about ${topic}, cybersecurity investigation scene, one strong focal subject, alert dashboard close-up, cinematic lighting, high contrast, professional product-ad composition, clean composition, subject on right side, empty space on left for text, no text, no watermark, no collage, no clutter`
      };
    case "hardware":
      return {
        category: "Hardware",
        posterConcept: "Hero device launch creative",
        visualAngle: "A polished hero shot of advanced hardware in a dramatic studio environment",
        mainSubject: "Chip, server, or device hero object",
        compositionStyle: "template-c" as const,
        headlineLayout: "top-left" as const,
        colorMood: "clean-white",
        designStyle: "startup campaign",
        subheadline: "The hardware layer is becoming the visual centerpiece of modern AI infrastructure.",
        imagePrompt:
          `premium advertising poster, modern tech campaign visual about ${topic}, premium hardware hero shot, one strong focal subject, cinematic lighting, professional product-ad composition, polished device or chip studio scene, clean composition, subject on right side, empty space on left for text, no text, no watermark, no collage, no clutter`
      };
    case "platform":
      return {
        category: "Platforms",
        posterConcept: "Platform interaction campaign",
        visualAngle: "A sleek human-device moment with floating interface cards and product motion",
        mainSubject: "Hand, device, and floating UI cards",
        compositionStyle: "template-d" as const,
        headlineLayout: "top-left" as const,
        colorMood: "purple-glow",
        designStyle: "cinematic tech poster",
        subheadline: "The platform layer is becoming more visual, personal, and interface-driven.",
        imagePrompt:
          `premium advertising poster, modern tech campaign visual about ${topic}, hand holding a premium device with floating interface cards, one strong focal subject, cinematic lighting, professional product-ad composition, clean composition, subject on right side, empty space on left for text, no text, no watermark, no collage, no clutter`
      };
    case "business":
      return {
        category: "Startup Strategy",
        posterConcept: "Startup campaign launch visual",
        visualAngle: "A polished product-marketing scene that feels aspirational and investor-ready",
        mainSubject: "Premium product interface hero",
        compositionStyle: "template-b" as const,
        headlineLayout: "top-center" as const,
        colorMood: "clean-white",
        designStyle: "startup campaign",
        subheadline: "Modern product storytelling now looks more like a campaign than a dashboard screenshot.",
        imagePrompt:
          `premium advertising poster, modern tech campaign visual about ${topic}, polished startup product scene, one strong focal subject, cinematic lighting, professional product-ad composition, centered hero subject, clean composition, premium layout, no text, no watermark, no collage, no clutter`
      };
    default:
      return {
        category: "AI Tools",
        posterConcept: "AI product launch creative",
        visualAngle: "A premium futuristic interface scene with one hero product moment",
        mainSubject: "Futuristic product interface",
        compositionStyle: "template-a" as const,
        headlineLayout: "top-left" as const,
        colorMood: "blue-tech",
        designStyle: "premium ad poster",
        subheadline: "AI tools are shifting from novelty to polished product category.",
        imagePrompt:
          `premium advertising poster, modern tech campaign visual about ${topic}, one strong focal subject, futuristic UI product visual, cinematic lighting, professional product-ad composition, subject placement designed for text space, clean composition, subject on right side, empty space on left for text, no text, no watermark, no collage, no clutter, premium poster aesthetic`
      };
  }
}

function buildMockMetadata(topic?: string): GeneratedMetadata {
  const resolvedTopic = topic?.trim() || "AI Tools";
  const strategy = buildVisualStrategy(resolvedTopic);

  return {
    hook: pickHook(resolvedTopic),
    subheadline: strategy.subheadline,
    caption: `${resolvedTopic} is getting attention because teams want faster workflows, smarter automation, and simpler ways to ship content consistently.`,
    hashtags: ["#AI", "#Tech", "#Automation"],
    category: strategy.category,
    imagePrompt: strategy.imagePrompt,
    posterConcept: strategy.posterConcept,
    visualAngle: strategy.visualAngle,
    mainSubject: strategy.mainSubject,
    compositionStyle: strategy.compositionStyle,
    headlineLayout: strategy.headlineLayout,
    colorMood: strategy.colorMood,
    designStyle: strategy.designStyle
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
      typeof parsed.subheadline !== "string" ||
      typeof parsed.caption !== "string" ||
      typeof parsed.category !== "string" ||
      typeof parsed.imagePrompt !== "string" ||
      typeof parsed.posterConcept !== "string" ||
      typeof parsed.visualAngle !== "string" ||
      typeof parsed.mainSubject !== "string" ||
      typeof parsed.compositionStyle !== "string" ||
      typeof parsed.headlineLayout !== "string" ||
      typeof parsed.colorMood !== "string" ||
      typeof parsed.designStyle !== "string"
    ) {
      return null;
    }

    return {
      hook: parsed.hook.trim(),
      subheadline: parsed.subheadline.trim(),
      caption: parsed.caption.trim(),
      hashtags: normalizeHashtags(parsed.hashtags),
      category: parsed.category.trim() || "AI Tools",
      imagePrompt: parsed.imagePrompt.trim() || "futuristic AI technology background",
      posterConcept: parsed.posterConcept.trim(),
      visualAngle: parsed.visualAngle.trim(),
      mainSubject: parsed.mainSubject.trim(),
      compositionStyle: normalizeCompositionStyle(parsed.compositionStyle),
      headlineLayout: normalizeHeadlineLayout(parsed.headlineLayout),
      colorMood: parsed.colorMood.trim(),
      designStyle: parsed.designStyle.trim()
    };
  } catch {
    return null;
  }
}

function normalizeCompositionStyle(value: string) {
  return ["template-a", "template-b", "template-c", "template-d"].includes(value) ? (value as GeneratedMetadata["compositionStyle"]) : "template-a";
}

function normalizeHeadlineLayout(value: string) {
  return ["top-left", "center-left", "top-center"].includes(value) ? (value as GeneratedMetadata["headlineLayout"]) : "top-left";
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
                    `Generate premium social poster metadata for the topic "${resolvedTopic}". Return valid JSON only with exactly these fields: hook, subheadline, caption, hashtags, category, imagePrompt, posterConcept, visualAngle, mainSubject, compositionStyle, headlineLayout, colorMood, designStyle. ` +
                    "The result must feel like a premium tech ad creative. Use one strong focal subject, topic-specific visual logic, cinematic lighting, professional product-ad composition, no text in the generated image, no watermark, no collage, no clutter. compositionStyle must be one of template-a, template-b, template-c, template-d. headlineLayout must be one of top-left, center-left, top-center. Do not wrap in markdown."
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
    subheadline: metadata.subheadline,
    caption: metadata.caption,
    hashtags: metadata.hashtags,
    category: metadata.category,
    imagePrompt: metadata.imagePrompt,
    posterConcept: metadata.posterConcept,
    visualAngle: metadata.visualAngle,
    mainSubject: metadata.mainSubject,
    compositionStyle: metadata.compositionStyle,
    headlineLayout: metadata.headlineLayout,
    colorMood: metadata.colorMood,
    designStyle: metadata.designStyle,
    tags: [metadata.category, "Automation", "Tech"],
    callToAction: "Review the mock draft and publish when ready."
  };
}
