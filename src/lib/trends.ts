import type { TrendTopic } from "@/lib/types";

type HackerNewsStory = {
  id: number;
  score?: number;
  time?: number;
  title?: string;
  url?: string;
  type?: string;
};

const HACKER_NEWS_TOP_STORIES_URL = "https://hacker-news.firebaseio.com/v0/topstories.json";
const HACKER_NEWS_ITEM_URL = "https://hacker-news.firebaseio.com/v0/item";
const HACKER_NEWS_LIMIT = 10;

function createMockTrends(): TrendTopic[] {
  const now = new Date().toISOString();

  return [
    {
      id: "mock-trend-1",
      title: "New AI tool replaces developers",
      source: "Mock",
      url: "#",
      publishedAt: now,
      score: 95,
      category: "AI Tools"
    },
    {
      id: "mock-trend-2",
      title: "Automation platforms are changing software teams",
      source: "Mock",
      url: "#",
      publishedAt: now,
      score: 88,
      category: "Automation"
    }
  ];
}

function toIsoDate(unixTime?: number) {
  if (!unixTime) {
    return new Date().toISOString();
  }

  return new Date(unixTime * 1000).toISOString();
}

function normalizeHackerNewsStory(story: HackerNewsStory): TrendTopic | null {
  if (!story.title || story.type !== "story") {
    return null;
  }

  return {
    id: `hn-${story.id}`,
    title: story.title,
    category: "Hacker News",
    score: Math.max(1, story.score ?? 1),
    source: "Hacker News",
    url: story.url ?? `https://news.ycombinator.com/item?id=${story.id}`,
    publishedAt: toIsoDate(story.time)
  };
}

export async function getAllTrends(limit = HACKER_NEWS_LIMIT): Promise<TrendTopic[]> {
  try {
    const idsResponse = await fetch(HACKER_NEWS_TOP_STORIES_URL, {
      next: { revalidate: 900 }
    });

    if (!idsResponse.ok) {
      return createMockTrends();
    }

    const ids = ((await idsResponse.json()) as number[]).slice(0, limit);
    const trends = await Promise.all(
      ids.map(async (id) => {
        try {
          const response = await fetch(`${HACKER_NEWS_ITEM_URL}/${id}.json`, {
            next: { revalidate: 900 }
          });

          if (!response.ok) {
            return null;
          }

          return normalizeHackerNewsStory((await response.json()) as HackerNewsStory);
        } catch {
          return null;
        }
      })
    );

    const normalized = trends.filter((trend): trend is TrendTopic => trend !== null);

    if (normalized.length === 0) {
      return createMockTrends();
    }

    return normalized.sort((left, right) => {
      const scoreDelta = right.score - left.score;
      if (scoreDelta !== 0) {
        return scoreDelta;
      }

      return new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime();
    });
  } catch {
    return createMockTrends();
  }
}

export async function getTopTrend(): Promise<TrendTopic> {
  const trends = await getAllTrends(1);
  return trends[0] ?? createMockTrends()[0];
}
