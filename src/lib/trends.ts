import type { TrendTopic } from "@/lib/types";

const placeholderTrends: TrendTopic[] = [
  {
    id: "trend-agent-workflows",
    title: "Autonomous AI agents are reshaping content operations",
    category: "AI Automation",
    score: 98,
    source: "Signal Feed",
    url: "https://example.com/trends/agent-workflows",
    publishedAt: "2026-04-14T08:10:00.000Z"
  },
  {
    id: "trend-video-repurposing",
    title: "Short-form video repurposing pipelines keep gaining traction",
    category: "Content Strategy",
    score: 93,
    source: "Creator Index",
    url: "https://example.com/trends/video-repurposing",
    publishedAt: "2026-04-14T07:30:00.000Z"
  },
  {
    id: "trend-search-shift",
    title: "AI-native search experiences push brands toward structured publishing",
    category: "SEO",
    score: 89,
    source: "Market Watch",
    url: "https://example.com/trends/search-shift",
    publishedAt: "2026-04-14T06:45:00.000Z"
  },
  {
    id: "trend-brand-ops",
    title: "Lean brand teams are adopting automated editorial calendars",
    category: "Operations",
    score: 84,
    source: "Ops Brief",
    url: "https://example.com/trends/brand-ops",
    publishedAt: "2026-04-13T19:20:00.000Z"
  }
];

export async function getAllTrends(): Promise<TrendTopic[]> {
  return placeholderTrends;
}

export async function getTopTrend(): Promise<TrendTopic> {
  return placeholderTrends[0];
}
