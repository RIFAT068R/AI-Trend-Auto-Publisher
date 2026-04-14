import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Container } from "@/components/Container";
import { generateImagePreview } from "@/lib/image";
import { generatePostPreview } from "@/lib/ai";
import { getStoredPosts, getSystemStatus } from "@/lib/storage";
import { getAllTrends, getTopTrend } from "@/lib/trends";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

export default async function HomePage() {
  const [trends, topTrend, preview, image, systemStatus, posts] = await Promise.all([
    getAllTrends(),
    getTopTrend(),
    generatePostPreview(),
    generateImagePreview(),
    getSystemStatus(),
    getStoredPosts()
  ]);

  const stats = [
    {
      label: "Tracked trends",
      value: String(trends.length).padStart(2, "0"),
      detail: "Fresh ranked topics"
    },
    {
      label: "Queue items",
      value: String(posts.length).padStart(2, "0"),
      detail: "Saved publishing records"
    },
    {
      label: "Top trend score",
      value: String(topTrend.score),
      detail: topTrend.category
    },
    {
      label: "System health",
      value: systemStatus.overall,
      detail: "Operational modules online"
    }
  ] as const;

  const recentActivity = posts.slice(0, 4);

  return (
    <main className="page-shell">
      <Container>
        <section className="page-header reveal-up">
          <div className="page-header-copy">
            <span className="section-kicker">Operations Dashboard</span>
            <h1>AI Trend Auto Publisher</h1>
            <p>
              Monitor trend discovery, review generated content, and keep publishing workflows moving from one clean control surface.
            </p>
          </div>
          <div className="page-header-actions">
            <div className="header-meta glass-subpanel">
              <span className="micro-label">Last update</span>
              <strong>{formatDate(systemStatus.updatedAt)}</strong>
            </div>
            <Button href="/api/test">Run API check</Button>
            <Button href="/history" variant="secondary">
              Open history
            </Button>
          </div>
        </section>

        <section className="stats-grid reveal-up delay-1">
          {stats.map((stat) => (
            <article key={stat.label} className="stat-card glass-panel">
              <span className="micro-label">{stat.label}</span>
              <strong>{stat.value}</strong>
              <p>{stat.detail}</p>
            </article>
          ))}
        </section>

        <section className="dashboard-layout reveal-up delay-1">
          <Card
            title="Trending Topics"
            description="Topics with the strongest publishing potential right now."
            eyebrow="Discovery"
            className="panel-primary"
            headerSlot={<span className="header-pill">Live feed</span>}
          >
            <div className="trend-list">
              {trends.slice(0, 4).map((trend) => (
                <article key={trend.id} className="trend-item">
                  <div className="trend-main">
                    <h3>{trend.title}</h3>
                    <p>{trend.category}</p>
                    <div className="inline-meta">
                      <span>{trend.source}</span>
                      <span>{formatDate(trend.publishedAt)}</span>
                    </div>
                  </div>
                  <div className="trend-meta">
                    <span className="score-pill">{trend.score}</span>
                    <span className="micro-label">score</span>
                  </div>
                </article>
              ))}
            </div>
          </Card>

          <Card
            title="Generated Post Preview"
            description="Draft output prepared for review, visuals, and scheduling."
            eyebrow="AI Draft"
            className="panel-secondary"
            headerSlot={<span className="status-chip status-ready">Ready</span>}
          >
            <div className="preview-block">
              <h3>{preview.title}</h3>
              <p>{preview.summary}</p>
              <div className="preview-cta glass-subpanel">
                <span className="micro-label">Next action</span>
                <strong>{preview.callToAction}</strong>
              </div>
              <div className="keyword-row">
                {preview.keywords.map((keyword) => (
                  <span key={keyword} className="keyword-pill">
                    {keyword}
                  </span>
                ))}
              </div>
              <div className="preview-image glass-subpanel">
                <div>
                  <span className="micro-label">Image prompt</span>
                  <p>{image.prompt}</p>
                </div>
                <span className="image-tag">Visual queued</span>
              </div>
            </div>
          </Card>

          <Card
            title="System Status"
            description="Readiness across discovery, generation, visuals, and publishing."
            eyebrow="Infrastructure"
            className="panel-wide"
          >
            <div className="system-stack">
              <div className="system-summary glass-subpanel">
                <div>
                  <span className="micro-label">Overall state</span>
                  <strong>{systemStatus.overall}</strong>
                </div>
                <time dateTime={systemStatus.updatedAt}>{formatDate(systemStatus.updatedAt)}</time>
              </div>
              <div className="module-table">
                {systemStatus.modules.map((module) => (
                  <div key={module.name} className="module-row">
                    <div>
                      <h3>{module.name}</h3>
                      <p>{module.detail}</p>
                    </div>
                    <span className={`status-chip status-${module.status}`}>{module.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card
            title="Recent Activity"
            description="Latest publishing records and queued items from local storage."
            eyebrow="Publishing Queue"
            className="panel-wide"
            headerSlot={<span className="header-pill">{recentActivity.length} items</span>}
          >
            <div className="activity-list">
              {recentActivity.map((post) => (
                <article key={post.id} className="activity-row">
                  <div>
                    <h3>{post.title}</h3>
                    <p>{post.topic}</p>
                  </div>
                  <div className="activity-meta">
                    <span>{post.channel}</span>
                    <span>{formatDate(post.publishedAt)}</span>
                    <span className={`status-chip status-${post.status}`}>{post.status}</span>
                  </div>
                </article>
              ))}
              {recentActivity.length === 0 ? (
                <div className="empty-state glass-subpanel">
                  <strong>No activity yet</strong>
                  <p>Publishing records will appear here as soon as new posts are generated or scheduled.</p>
                </div>
              ) : null}
            </div>
          </Card>
        </section>
      </Container>
    </main>
  );
}
