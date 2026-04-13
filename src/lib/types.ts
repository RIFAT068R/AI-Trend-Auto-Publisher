export type TrendTopic = {
  id: string;
  title: string;
  category: string;
  score: number;
  source: string;
};

export type GeneratedMetadata = {
  title: string;
  summary: string;
  keywords: string[];
};

export type GeneratedImage = {
  prompt: string;
  imageUrl: string;
};

export type PublishedPost = {
  id: string;
  topic: string;
  title: string;
  status: "draft" | "published" | "scheduled";
  publishedAt: string;
  channel: string;
};
