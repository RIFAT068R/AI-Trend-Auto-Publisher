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
  topic: string;
  title: string;
  summary: string;
  hook: string;
  subheadline: string;
  caption: string;
  hashtags: string[];
  category: string;
  imagePrompt: string;
  posterConcept: string;
  visualAngle: string;
  mainSubject: string;
  compositionStyle: PosterTemplate;
  headlineLayout: HeadlineLayout;
  colorMood: string;
  designStyle: string;
  tags: string[];
  callToAction: string;
};

export type GeneratedMetadata = {
  hook: string;
  subheadline: string;
  caption: string;
  hashtags: string[];
  category: string;
  imagePrompt: string;
  posterConcept: string;
  visualAngle: string;
  mainSubject: string;
  compositionStyle: PosterTemplate;
  headlineLayout: HeadlineLayout;
  colorMood: string;
  designStyle: string;
};

export type PosterTemplate = "template-a" | "template-b" | "template-c" | "template-d";

export type HeadlineLayout = "top-left" | "center-left" | "top-center";

export type GeneratedImagePreview = {
  prompt: string;
  imageUrl: string;
  alt: string;
  provider: "placeholder" | "remote" | "cloudflare";
  base64?: string;
};

export type HistoryPostStatus = "draft" | "scheduled" | "published";

export type HistoryPost = {
  id: string;
  topic: string;
  title: string;
  summary: string;
  hook: string;
  caption: string;
  hashtags: string[];
  category: string;
  imagePrompt: string;
  imageUrl: string;
  status: HistoryPostStatus;
  publishedAt: string;
  channel: string;
  source: string;
  createdAt: string;
};

export type SupabasePostRow = {
  id: string;
  title: string;
  hook: string;
  caption: string;
  hashtags: string[] | null;
  category: string;
  image_url: string | null;
  source: string;
  status: string;
  created_at: string;
};

export type CreateDraftInput = {
  trend: TrendTopic;
  preview: GeneratedPostPreview;
  image: GeneratedImagePreview;
  channel?: string;
};

export type PipelineResult = {
  trend: TrendTopic;
  preview: GeneratedPostPreview;
  image: GeneratedImagePreview;
  post: HistoryPost;
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
