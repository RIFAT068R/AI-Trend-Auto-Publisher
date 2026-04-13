import Parser from "rss-parser";

export type TrendItem = {
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  score?: number;
};

type HackerNewsStory = {
  by?: string;
  id: number;
  score?: number;
  time?: number;
  title?: string;
  type?: string;
  url?: string;
};

type RssItem = {
  isoDate?: string;
  link?: string;
  pubDate?: string;
  title?: string;
};

type RssFeedConfig = {
  label: string;
  url: string;
};

const HACKER_NEWS_TOP_STORIES_URL = "https://hacker-news.firebaseio.com/v0/topstories.json";
const HACKER_NEWS_ITEM_URL = "https://hacker-news.firebaseio.com/v0/item";
const HACKER_NEWS_LIMIT = 8;
const RSS_LIMIT_PER_FEED = 6;

const rssFeeds: RssFeedConfig[] = [
  {
    label: "TechCrunch",
    url: "https://techcrunch.com/feed/"
  },
  {
    label: "The Verge",
    url: "https://www.theverge.com/rss/index.xml"
  }
];

const rssParser = new Parser<Record<string, never>, RssItem>();

function toIsoDate(value?: string | number): string {
  if (!value) {
    return new Date().toISOString();
  }

  const date = typeof value === "number" ? new Date(value * 1000) : new Date(value);
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function normalizeHackerNewsStory(story: HackerNewsStory): TrendItem | null {
  if (!story.title || !story.id) {
    return null;
  }

  return {
    title: story.title,
    source: "Hacker News",
    url: story.url ?? `https://news.ycombinator.com/item?id=${story.id}`,
    publishedAt: toIsoDate(story.time),
    score: story.score
  };
}

function normalizeRssItem(item: RssItem, source: string): TrendItem | null {
  if (!item.title || !item.link) {
    return null;
  }

  return {
    title: item.title,
    source,
    url: item.link,
    publishedAt: toIsoDate(item.isoDate ?? item.pubDate)
  };
}

export async function fetchHackerNewsTrends(limit = HACKER_NEWS_LIMIT): Promise<TrendItem[]> {
  const idsResponse = await fetch(HACKER_NEWS_TOP_STORIES_URL, {
    next: { revalidate: 900 }
  });

  if (!idsResponse.ok) {
    throw new Error(`Hacker News top stories request failed with ${idsResponse.status}`);
  }

  const storyIds = ((await idsResponse.json()) as number[]).slice(0, limit);

  // Fetch story detail records in parallel so the endpoint stays responsive.
  const storyResponses = await Promise.all(
    storyIds.map(async (id) => {
      const response = await fetch(`${HACKER_NEWS_ITEM_URL}/${id}.json`, {
        next: { revalidate: 900 }
      });

      if (!response.ok) {
        return null;
      }

      return (await response.json()) as HackerNewsStory;
    })
  );

  return storyResponses
    .map((story) => (story ? normalizeHackerNewsStory(story) : null))
    .filter((story): story is TrendItem => story !== null);
}

export async function fetchRssTrends(limitPerFeed = RSS_LIMIT_PER_FEED): Promise<TrendItem[]> {
  const feedResults = await Promise.all(
    rssFeeds.map(async (feed) => {
      const parsedFeed = await rssParser.parseURL(feed.url);
      return parsedFeed.items
        .slice(0, limitPerFeed)
        .map((item) => normalizeRssItem(item, feed.label))
        .filter((item): item is TrendItem => item !== null);
    })
  );

  return feedResults.flat();
}

export async function getAllTrends(): Promise<TrendItem[]> {
  const [hackerNewsResult, rssResult] = await Promise.allSettled([
    fetchHackerNewsTrends(),
    fetchRssTrends()
  ]);

  const hackerNewsItems = hackerNewsResult.status === "fulfilled" ? hackerNewsResult.value : [];
  const rssItems = rssResult.status === "fulfilled" ? rssResult.value : [];

  // Merge all sources into one sorted feed so API consumers get a single contract.
  return [...hackerNewsItems, ...rssItems].sort((left, right) => {
    return new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime();
  });
}
