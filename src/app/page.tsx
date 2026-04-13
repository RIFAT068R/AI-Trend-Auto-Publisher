import Link from "next/link";
import { Card } from "@/components/Card";
import { getAutomationModules } from "@/lib/storage";

const pipelineSteps = [
  {
    title: "Collect",
    description: "Aggregate fresh signals from trend feeds and API providers into one normalized queue."
  },
  {
    title: "Generate",
    description: "Prepare SEO metadata, captions, prompts, and publishing assets from a single topic input."
  },
  {
    title: "Publish",
    description: "Fan out approved content into your channel stack with scheduling hooks and status tracking."
  }
] as const;

export default async function HomePage() {
  const modules = await getAutomationModules();

  return (
    <main className="page">
      <div className="container stack">
        <section className="hero-panel reveal-up">
          <div className="hero-copy">
            <span className="eyebrow">Automation-ready publishing OS</span>
            <h1>AI Trend Auto Publisher</h1>
            <p className="hero-text">
              A clean full-stack workspace for discovering trends, generating metadata, producing visuals,
              and turning approved ideas into publishable content through modular API routes.
            </p>
            <div className="hero-actions">
              <Link className="button-primary" href="/dashboard">
                Open Dashboard
              </Link>
              <Link className="button-secondary" href="/history">
                View Publishing History
              </Link>
            </div>
            <div className="quick-stat-grid">
              <div className="quick-stat">
                <span className="metric-label">Workflow</span>
                <strong className="stat-value">4 modular APIs</strong>
                <span className="metric-note">Trends, generate, image, and post handlers ready for provider integration.</span>
              </div>
              <div className="quick-stat">
                <span className="metric-label">Storage</span>
                <strong className="stat-value">JSON-backed seed</strong>
                <span className="metric-note">Local history can be replaced with a database without touching page contracts.</span>
              </div>
              <div className="quick-stat">
                <span className="metric-label">Automation</span>
                <strong className="stat-value">Scheduler-ready</strong>
                <span className="metric-note">Prepared for GitHub Actions and future unattended publishing workflows.</span>
              </div>
            </div>
          </div>

          <aside className="hero-visual reveal-up delay-1">
            <div className="visual-window">
              <div className="window-bar" aria-hidden="true">
                <span className="window-dot" />
                <span className="window-dot" />
                <span className="window-dot" />
              </div>

              <div className="spotlight-card featured">
                <span className="badge">Live System Snapshot</span>
                <div className="metric-grid" style={{ marginTop: "16px" }}>
                  {modules.map((module) => (
                    <div key={module.name} className="metric-item">
                      <span className="metric-label">{module.name}</span>
                      <strong className="metric-value">{module.status}</strong>
                      <span className="metric-note">Structured for provider swaps and background automation.</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="spotlight-card">
                <div className="detail-row">
                  <div className="section-stack">
                    <span className="metric-label">Pipeline Health</span>
                    <strong className="metric-value">Stable starter architecture</strong>
                  </div>
                  <span className="status-pill">Ready</span>
                </div>
                <div className="mini-chart" aria-hidden="true">
                  <span style={{ height: "38%" }} />
                  <span style={{ height: "66%" }} />
                  <span style={{ height: "54%" }} />
                  <span style={{ height: "82%" }} />
                  <span style={{ height: "72%" }} />
                  <span style={{ height: "96%" }} />
                </div>
              </div>
            </div>
          </aside>
        </section>

        <section className="showcase-panel reveal-up delay-1">
          <div className="section-intro">
            <div className="section-copy">
              <span className="eyebrow">Core workflow</span>
              <h2 className="section-heading">Built for API-first automation</h2>
              <p>
                The project structure is already split into reusable libraries and App Router endpoints, so
                each stage of the publishing pipeline can evolve independently.
              </p>
            </div>
            <Link className="button-secondary" href="/api/test">
              Test API Route
            </Link>
          </div>

          <div className="grid cols-3">
            {pipelineSteps.map((step) => (
              <div key={step.title} className="timeline-item reveal-up delay-2">
                <span className="badge">{step.title}</span>
                <strong className="timeline-title">{step.title} stage</strong>
                <p className="timeline-copy">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section-stack">
          <div className="section-intro reveal-up delay-2">
            <div className="section-copy">
              <span className="eyebrow">API endpoints</span>
              <h2 className="section-heading">Modular services with clean contracts</h2>
              <p>Each route is isolated, easy to test, and ready to connect to your preferred automation vendors.</p>
            </div>
          </div>

          <div className="grid cols-3">
            <Card title="/api/trends" description="Trend discovery endpoint for feed aggregation and source normalization." eyebrow="Collect">
              <div className="detail-list">
                <div className="detail-row">
                  <span className="detail-label">Purpose</span>
                  <strong>Fetch trending topics</strong>
                </div>
                <p className="detail-text">Prepared for live news, RSS, social, and platform-specific discovery providers.</p>
              </div>
            </Card>
            <Card title="/api/generate" description="Metadata generation endpoint for titles, summaries, keywords, and prompts." eyebrow="Generate">
              <div className="detail-list">
                <div className="detail-row">
                  <span className="detail-label">Purpose</span>
                  <strong>AI metadata layer</strong>
                </div>
                <p className="detail-text">Designed for content briefs, SEO variants, caption packs, and prompt orchestration.</p>
              </div>
            </Card>
            <Card title="/api/image" description="Visual generation endpoint for future image models and creative workflows." eyebrow="Visuals">
              <div className="detail-list">
                <div className="detail-row">
                  <span className="detail-label">Purpose</span>
                  <strong>Generate assets</strong>
                </div>
                <p className="detail-text">Ready for thumbnails, social cards, hero images, and multi-size exports.</p>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}
