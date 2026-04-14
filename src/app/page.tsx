import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Container } from "@/components/Container";
import { generateImagePreview } from "@/lib/image";
import { generatePostPreview } from "@/lib/ai";
import { getStoredPosts, getSystemStatus } from "@/lib/storage";
import { getAllTrends } from "@/lib/trends";

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

export default async function HomePage() {
  const [trends, preview, image, systemStatus, posts] = await Promise.all([
    getAllTrends(),
    generatePostPreview(),
    generateImagePreview(),
    getSystemStatus(),
    getStoredPosts()
  ]);

  const readyToPost = posts.filter((post) => post.status === "draft" || post.status === "scheduled").length;
  const lastPublished = posts.find((post) => post.status === "published");
  const recentActivity = posts.slice(0, 4);

  const stats = [
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

  return (
    <main className="page-shell">
      <Container>
        <section className="page-header">
          <div className="page-header-copy">
            <h1>Dashboard</h1>
            <p>Track trends, review generated content, and manage the publishing workflow from one clean workspace.</p>
          </div>

          <div className="page-header-actions">
            <Button href="/api/post" variant="secondary">
              Run Pipeline
            </Button>
            <Button href="/api/generate">Generate Post</Button>
          </div>
        </section>

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
          <Card title="Trending Topics" description="Highest-priority topics to review next." className="dashboard-card">
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
            </div>
          </Card>

          <Card title="Generated Post Preview" description="Current draft prepared by the content generation layer." className="dashboard-card">
            <div className="preview-stack">
              <div className="content-box subtle-surface">
                <h3>{preview.title}</h3>
                <p>{preview.summary}</p>
              </div>

              <div className="tag-row">
                {preview.keywords.map((keyword) => (
                  <span key={keyword} className="tag-pill">
                    {keyword}
                  </span>
                ))}
              </div>

              <div className="info-panel">
                <span className="info-label">Next action</span>
                <strong>{preview.callToAction}</strong>
              </div>

              <div className="info-panel">
                <span className="info-label">Image prompt</span>
                <p>{image.prompt}</p>
              </div>
            </div>
          </Card>
        </section>

        <section className="dashboard-grid-two dashboard-grid-bottom">
          <Card title="Recent Activity" description="Latest items from the publishing queue." className="dashboard-card">
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
                  <p>Publishing events will appear here once new posts are generated or scheduled.</p>
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
      </Container>
    </main>
  );
}
