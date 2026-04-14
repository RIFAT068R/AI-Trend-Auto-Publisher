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
  const idsResponse = await fetch(HACKER_NEWS_TOP_STORIES_URL, {
    next: { revalidate: 900 }
  });

  if (!idsResponse.ok) {
    throw new Error(`Hacker News top stories request failed with ${idsResponse.status}`);
  }

  const ids = ((await idsResponse.json()) as number[]).slice(0, limit);

  const trends = await Promise.all(
    ids.map(async (id) => {
      const response = await fetch(`${HACKER_NEWS_ITEM_URL}/${id}.json`, {
        next: { revalidate: 900 }
      });

      if (!response.ok) {
        return null;
      }

      return normalizeHackerNewsStory((await response.json()) as HackerNewsStory);
    })
  );

  const normalized = trends.filter((trend): trend is TrendTopic => trend !== null);

  if (normalized.length === 0) {
    throw new Error("No Hacker News trends available");
  }

  return normalized.sort((left, right) => {
    const scoreDelta = right.score - left.score;
    if (scoreDelta !== 0) {
      return scoreDelta;
    }

    return new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime();
  });
}

export async function getTopTrend(): Promise<TrendTopic> {
  const trends = await getAllTrends(1);

  if (trends.length === 0) {
    throw new Error("No trends available");
  }

  return trends[0];
}
