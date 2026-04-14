import type { GeneratedPostPreview } from "@/lib/types";

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

export async function generatePostPreview(topic?: string): Promise<GeneratedPostPreview> {
  const resolvedTopic = topic?.trim() || "AI Tools";
  const hook = pickHook(resolvedTopic);

  return {
    topic: resolvedTopic,
    title: `${resolvedTopic}: what to know now`,
    summary: `A simple mock draft based on ${resolvedTopic.toLowerCase()}, designed to keep the publishing pipeline working without external services.`,
    hook,
    caption: `${resolvedTopic} is getting attention because teams want faster workflows, smarter automation, and simpler ways to ship content consistently.`,
    hashtags: ["#AI", "#Tech", "#Automation"],
    category: "AI Tools",
    imagePrompt: "futuristic AI technology background",
    tags: ["AI Tools", "Automation", "Tech"],
    callToAction: "Review the mock draft and publish when ready."
  };
}
