export type ApiError = {
  message: string;
};

export type ApiSuccessResponse<T> = {
  ok: true;
  data: T;
};

export type ApiErrorResponse = {
  ok: false;
  error: ApiError;
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export type TrendTopic = {
  id: string;
  title: string;
  category: string;
  score: number;
  source: string;
  url: string;
  publishedAt: string;
};

export type GeneratedPostPreview = {
  title: string;
  summary: string;
  keywords: string[];
  callToAction: string;
};

export type GeneratedImagePreview = {
  prompt: string;
  imageUrl: string;
  alt: string;
};

export type PublishResult = {
  destination: string;
  status: "draft" | "queued" | "published";
  message: string;
};

export type HistoryPostStatus = "draft" | "scheduled" | "published";

export type HistoryPost = {
  id: string;
  topic: string;
  title: string;
  status: HistoryPostStatus;
  publishedAt: string;
  channel: string;
};

export type AutomationModuleStatus = "online" | "ready" | "queued";

export type AutomationModule = {
  name: string;
  status: AutomationModuleStatus;
  detail: string;
};

export type SystemStatus = {
  overall: AutomationModuleStatus;
  updatedAt: string;
  modules: AutomationModule[];
};
