"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import type { ApiResponse, GeneratedImagePreview, GeneratedMetadata, HistoryPost, PipelineResult, SystemStatus, TrendTopic } from "@/lib/types";

type DashboardClientProps = {
  initialTrends: TrendTopic[];
  initialPosts: HistoryPost[];
  initialSystemStatus: SystemStatus;
};

type ActionState = {
  checkApi: boolean;
  generate: boolean;
  pipeline: boolean;
};

export function DashboardClient({ initialTrends, initialPosts, initialSystemStatus }: DashboardClientProps) {
  const [trends, setTrends] = useState(initialTrends);
  const [posts, setPosts] = useState(initialPosts);
  const [systemStatus, setSystemStatus] = useState(initialSystemStatus);
  const [preview, setPreview] = useState<GeneratedMetadata | null>(null);
  const [previewImage, setPreviewImage] = useState<GeneratedImagePreview | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<ActionState>({
    checkApi: false,
    generate: false,
    pipeline: false
  });

  const stats = useMemo(() => {
    const readyToPost = posts.filter((post) => post.status === "draft" || post.status === "scheduled").length;
    const lastPublished = posts.find((post) => post.status === "published");

    return [
      {
        label: "Trends Found",
        value: String(trends.length).padStart(2, "0"),
        detail: "Topics in the discovery queue"
      },
      {
        label: "Ready to Post",
        value: String(readyToPost).padStart(2, "0"),
        detail: "Drafts and scheduled items"
      },
      {
        label: "Last Published",
        value: lastPublished ? formatDate(lastPublished.publishedAt) : "No posts",
        detail: lastPublished ? lastPublished.channel : "Waiting for first publish"
      },
      {
        label: "System Status",
        value: systemStatus.overall,
        detail: "Core services available"
      }
    ] as const;
  }, [posts, systemStatus.overall, trends.length]);

  async function checkApi() {
    updateLoading("checkApi", true);
    resetFeedback();

    try {
      const response = await fetch("/api/test", { cache: "no-store" });
      const data = (await response.json()) as { status?: string };

      if (!response.ok || data.status !== "working") {
        throw new Error("API health check failed");
      }

      setMessage("API is working.");
    } catch (caughtError) {
      setError(getErrorMessage(caughtError, "Failed to check API."));
    } finally {
      updateLoading("checkApi", false);
    }
  }

  async function generatePost() {
    updateLoading("generate", true);
    resetFeedback();

    try {
      const topic = trends[0]?.title ?? "AI publishing workflow";
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ topic })
      });

      const payload = (await response.json()) as ApiResponse<GeneratedMetadata>;

      if (!response.ok || !payload.ok) {
        throw new Error(payload.ok ? "Failed to generate post preview." : payload.error.message);
      }

      setPreview(payload.data);
      const imageResponse = await fetch("/api/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ imagePrompt: payload.data.imagePrompt })
      });
      const imagePayload = (await imageResponse.json()) as ApiResponse<GeneratedImagePreview>;
      if (imageResponse.ok && imagePayload.ok) {
        setPreviewImage(imagePayload.data);
      }
      setMessage(`Generated metadata for ${topic}.`);
    } catch (caughtError) {
      setError(getErrorMessage(caughtError, "Failed to generate post."));
    } finally {
      updateLoading("generate", false);
    }
  }

  async function runPipeline() {
    updateLoading("pipeline", true);
    resetFeedback();

    try {
      const response = await fetch("/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ mode: "pipeline" })
      });

      const payload = (await response.json()) as ApiResponse<PipelineResult>;

      if (!response.ok || !payload.ok) {
        throw new Error(payload.ok ? "Pipeline failed." : payload.error.message);
      }

      setPreview({
        hook: payload.data.preview.hook,
        caption: payload.data.preview.caption,
        hashtags: payload.data.preview.hashtags,
        category: payload.data.preview.category,
        imagePrompt: payload.data.preview.imagePrompt
      });
      setPreviewImage(payload.data.image);
      setPosts((currentPosts) => [payload.data.post, ...currentPosts]);
      setTrends((currentTrends) => currentTrends.filter((trend) => trend.id !== payload.data.trend.id));
      setSystemStatus((currentStatus) => ({
        ...currentStatus,
        overall: "online",
        updatedAt: new Date().toISOString(),
        modules: currentStatus.modules.map((module) => {
          if (module.name === "Publishing Queue") {
            return {
              ...module,
              status: "queued",
              detail: "A new draft post was added to local storage."
            };
          }

          return module;
        })
      }));
      setMessage(`Pipeline completed for ${payload.data.trend.title}. Draft saved successfully.`);
    } catch (caughtError) {
      setError(getErrorMessage(caughtError, "Failed to run pipeline."));
    } finally {
      updateLoading("pipeline", false);
    }
  }

  const latestPreview = preview;
  const recentActivity = posts.slice(0, 4);

  return (
    <>
      <section className="page-header">
        <div className="page-header-copy">
          <h1>Dashboard</h1>
          <p>Track trends, review generated content, and manage the publishing workflow from one clean workspace.</p>
        </div>

        <div className="page-header-actions">
          <Button onClick={checkApi} variant="secondary" disabled={loading.checkApi}>
            {loading.checkApi ? "Checking..." : "Check API"}
          </Button>
          <Button onClick={runPipeline} variant="secondary" disabled={loading.pipeline}>
            {loading.pipeline ? "Running..." : "Run Pipeline"}
          </Button>
          <Button onClick={generatePost} disabled={loading.generate}>
            {loading.generate ? "Generating..." : "Generate Post"}
          </Button>
        </div>
      </section>

      {message ? <div className="feedback-banner feedback-success">{message}</div> : null}
      {error ? <div className="feedback-banner feedback-error">{error}</div> : null}

      <section className="stats-grid">
        {stats.map((stat) => (
          <article key={stat.label} className="stat-card card-surface">
            <span className="stat-label">{stat.label}</span>
            <strong className="stat-value">{stat.value}</strong>
            <p className="stat-detail">{stat.detail}</p>
          </article>
        ))}
      </section>

      <section className="dashboard-grid-two">
        <Card title="Trending Topics" description="Live topics from Hacker News and tech RSS sources." className="dashboard-card">
          <div className="list-stack">
            {trends.slice(0, 5).map((trend) => (
              <article key={trend.id} className="list-row trend-row">
                <div className="list-main">
                  <h3>{trend.title}</h3>
                  <div className="row-meta">
                    <span>{trend.source}</span>
                    <span>{formatDateTime(trend.publishedAt)}</span>
                  </div>
                </div>
                <span className="score-badge">{trend.score}</span>
              </article>
            ))}

            {trends.length === 0 ? (
              <div className="empty-state">
                <strong>No trends available</strong>
                <p>Trend sources are currently empty or temporarily unavailable.</p>
              </div>
            ) : null}
          </div>
        </Card>

        <Card title="Generated Post Preview" description="Latest generated metadata ready for image and draft storage." className="dashboard-card">
          {latestPreview ? (
            <div className="preview-stack">
              <div className="info-panel">
                <span className="info-label">Hook</span>
                <strong>{latestPreview.hook}</strong>
              </div>

              <div className="info-panel">
                <span className="info-label">Caption</span>
                <p>{latestPreview.caption}</p>
              </div>

              <div className="tag-row">
                {latestPreview.hashtags.map((tag) => (
                  <span key={tag} className="tag-pill">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="info-panel">
                <span className="info-label">Category</span>
                <strong>{latestPreview.category}</strong>
              </div>

              <div className="info-panel">
                <span className="info-label">Image prompt</span>
                <p>{latestPreview.imagePrompt}</p>
              </div>

              {previewImage ? (
                <div className="info-panel">
                  <span className="info-label">Generated image</span>
                  <Image src={previewImage.imageUrl} alt={previewImage.alt} className="preview-image-display" width={320} height={320} unoptimized />
                </div>
              ) : null}
            </div>
          ) : (
            <div className="empty-state">
              <strong>No draft generated yet</strong>
              <p>Use Generate Post or Run Pipeline to create the next draft from a live trend.</p>
            </div>
          )}
        </Card>
      </section>

      <section className="dashboard-grid-two dashboard-grid-bottom">
        <Card title="Recent Activity" description="Draft posts saved to Supabase." className="dashboard-card">
          <div className="list-stack">
            {recentActivity.map((post) => (
              <article key={post.id} className="list-row activity-row">
                <div className="list-main">
                  <h3>{post.title}</h3>
                  <div className="row-meta">
                    <span>{post.channel}</span>
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>
                </div>
                <span className={`status-badge status-${post.status}`}>{post.status}</span>
              </article>
            ))}

            {recentActivity.length === 0 ? (
              <div className="empty-state">
                <strong>No recent activity</strong>
                <p>Publishing events will appear here after you save the first draft post.</p>
              </div>
            ) : null}
          </div>
        </Card>

        <Card title="System Status" description="Current operational state across the automation pipeline." className="dashboard-card">
          <div className="list-stack">
            {systemStatus.modules.map((module) => (
              <article key={module.name} className="list-row status-row">
                <div className="list-main">
                  <h3>{module.name}</h3>
                  <p>{module.detail}</p>
                </div>
                <span className={`status-badge status-${module.status}`}>{module.status}</span>
              </article>
            ))}
          </div>
        </Card>
      </section>
    </>
  );

  function updateLoading(key: keyof ActionState, value: boolean) {
    setLoading((current) => ({
      ...current,
      [key]: value
    }));
  }

  function resetFeedback() {
    setMessage(null);
    setError(null);
  }
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
}

function getErrorMessage(caughtError: unknown, fallback: string) {
  return caughtError instanceof Error ? caughtError.message : fallback;
}
