import Parser from "rss-parser";
import type { TrendTopic } from "@/lib/types";

type HackerNewsStory = {
  id: number;
  score?: number;
  time?: number;
  title?: string;
  url?: string;
};

type RssItem = {
  title?: string;
  link?: string;
  isoDate?: string;
  pubDate?: string;
  categories?: string[];
};

type RssFeedConfig = {
  label: string;
  url: string;
  category: string;
};

const HACKER_NEWS_TOP_STORIES_URL = "https://hacker-news.firebaseio.com/v0/topstories.json";
const HACKER_NEWS_ITEM_URL = "https://hacker-news.firebaseio.com/v0/item";
const HACKER_NEWS_LIMIT = 8;
const RSS_LIMIT_PER_FEED = 4;

const rssFeeds: RssFeedConfig[] = [
  {
    label: "TechCrunch",
    url: "https://techcrunch.com/feed/",
    category: "Startups"
  },
  {
    label: "The Verge",
    url: "https://www.theverge.com/rss/index.xml",
    category: "Technology"
  },
  {
    label: "Wired",
    url: "https://www.wired.com/feed/rss",
    category: "Innovation"
  }
];

const rssParser = new Parser<Record<string, never>, RssItem>();

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function toIsoDate(value?: string | number) {
  if (!value) {
    return new Date().toISOString();
  }

  const date = typeof value === "number" ? new Date(value * 1000) : new Date(value);
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function scoreFromDate(dateIso: string, fallback = 50) {
  const hoursOld = Math.max(1, Math.round((Date.now() - new Date(dateIso).getTime()) / 3_600_000));
  return Math.max(50, Math.min(99, fallback + (24 - Math.min(hoursOld, 24))));
}

function normalizeHackerNewsStory(story: HackerNewsStory): TrendTopic | null {
  if (!story.title) {
    return null;
  }

  return {
    id: `hn-${story.id}`,
    title: story.title,
    category: "Developer Trends",
    score: Math.max(50, Math.min(99, story.score ?? 60)),
    source: "Hacker News",
    url: story.url ?? `https://news.ycombinator.com/item?id=${story.id}`,
    publishedAt: toIsoDate(story.time)
  };
}

function normalizeRssItem(item: RssItem, feed: RssFeedConfig): TrendTopic | null {
  if (!item.title || !item.link) {
    return null;
  }

  const publishedAt = toIsoDate(item.isoDate ?? item.pubDate);

  return {
    id: `${feed.label.toLowerCase()}-${slugify(item.title)}`,
    title: item.title,
    category: item.categories?.[0] ?? feed.category,
    score: scoreFromDate(publishedAt, 64),
    source: feed.label,
    url: item.link,
    publishedAt
  };
}

export async function fetchHackerNewsTrends(limit = HACKER_NEWS_LIMIT): Promise<TrendTopic[]> {
  const idsResponse = await fetch(HACKER_NEWS_TOP_STORIES_URL, {
    next: { revalidate: 900 }
  });

  if (!idsResponse.ok) {
    throw new Error(`Hacker News top stories request failed with ${idsResponse.status}`);
  }

  const storyIds = ((await idsResponse.json()) as number[]).slice(0, limit);

  const stories = await Promise.all(
    storyIds.map(async (id) => {
      const response = await fetch(`${HACKER_NEWS_ITEM_URL}/${id}.json`, {
        next: { revalidate: 900 }
      });

      if (!response.ok) {
        return null;
      }

      return normalizeHackerNewsStory((await response.json()) as HackerNewsStory);
    })
  );

  return stories.filter((story): story is TrendTopic => story !== null);
}

export async function fetchRssTrends(limitPerFeed = RSS_LIMIT_PER_FEED): Promise<TrendTopic[]> {
  const feeds = await Promise.all(
    rssFeeds.map(async (feed) => {
      const parsedFeed = await rssParser.parseURL(feed.url);

      return parsedFeed.items
        .slice(0, limitPerFeed)
        .map((item) => normalizeRssItem(item, feed))
        .filter((item): item is TrendTopic => item !== null);
    })
  );

  return feeds.flat();
}

export async function getAllTrends(): Promise<TrendTopic[]> {
  const [hnResult, rssResult] = await Promise.allSettled([fetchHackerNewsTrends(), fetchRssTrends()]);

  const hackerNewsTrends = hnResult.status === "fulfilled" ? hnResult.value : [];
  const rssTrends = rssResult.status === "fulfilled" ? rssResult.value : [];
  const allTrends = [...hackerNewsTrends, ...rssTrends];

  if (allTrends.length === 0) {
    throw new Error("No trend sources returned data");
  }

  return allTrends.sort((left, right) => {
    const scoreDelta = right.score - left.score;
    if (scoreDelta !== 0) {
      return scoreDelta;
    }

    return new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime();
  });
}

export async function getTopTrend(): Promise<TrendTopic> {
  const trends = await getAllTrends();

  if (trends.length === 0) {
    throw new Error("No trends available");
  }

  return trends[0];
}
