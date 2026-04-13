import { Card } from "@/components/Card";
import { getMetadataPlaceholder } from "@/lib/ai";
import { getImagePlaceholder } from "@/lib/image";
import { getAllTrends } from "@/lib/trends";

export default async function DashboardPage() {
  const [trends, metadata, image] = await Promise.all([
    getAllTrends(),
    getMetadataPlaceholder(),
    getImagePlaceholder()
  ]);

  const latestSources = Array.from(new Set(trends.map((trend) => trend.source))).slice(0, 3);

  return (
    <main className="page">
      <div className="container stack">
        <section className="hero-panel compact reveal-up">
          <div className="hero-copy">
            <span className="eyebrow">Operations overview</span>
            <h1>Dashboard</h1>
            <p className="hero-text">
              A premium control surface for the automation pipeline, showing live discovery readiness and
              the placeholder generation contracts that will later connect to your production services.
            </p>
          </div>
        </section>

        <section className="grid cols-3">
          <Card title="Trend Module" description="Live feed aggregation status across the current discovery sources." eyebrow="Discovery">
            <div className="metric-grid">
              <div className="metric-item">
                <span className="metric-label">Items fetched</span>
                <strong className="metric-value">{trends.length}</strong>
                <span className="metric-note">Normalized trend records available for enrichment and ranking.</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Sources</span>
                <strong className="metric-value">{latestSources.length || 1}</strong>
                <span className="metric-note">
                  {latestSources.length > 0 ? latestSources.join(", ") : "Awaiting external feed responses."}
                </span>
              </div>
            </div>
          </Card>

          <Card title="Metadata Module" description="Current AI contract placeholder for title and summary generation." eyebrow="AI Layer">
            <div className="detail-list">
              <div className="detail-row">
                <span className="detail-label">State</span>
                <span className="status-pill">Placeholder ready</span>
              </div>
              <p className="detail-text">{metadata.message}</p>
            </div>
          </Card>

          <Card title="Image Module" description="Prepared visual generation service for post artwork and promotional assets." eyebrow="Creative">
            <div className="detail-list">
              <div className="detail-row">
                <span className="detail-label">State</span>
                <span className="status-pill">Placeholder ready</span>
              </div>
              <p className="detail-text">{image.message}</p>
            </div>
          </Card>
        </section>

        <section className="showcase-panel reveal-up delay-1">
          <div className="section-intro">
            <div className="section-copy">
              <span className="eyebrow">Pipeline status</span>
              <h2 className="section-heading">What this workspace is already prepared for</h2>
              <p>
                The app router, modular libraries, and endpoint split give you a clean path to add retries,
                provider adapters, schedulers, approval flows, and persistent storage without redesigning the UI.
              </p>
            </div>
          </div>

          <div className="grid cols-3">
            <div className="timeline-item">
              <div className="timeline-head">
                <strong className="timeline-title">Discovery contract</strong>
                <span className="status-tag">Online</span>
              </div>
              <p className="timeline-copy">`/api/trends` can evolve into multi-source ranking and topic clustering.</p>
            </div>
            <div className="timeline-item">
              <div className="timeline-head">
                <strong className="timeline-title">Generation contract</strong>
                <span className="status-tag">Ready</span>
              </div>
              <p className="timeline-copy">`/api/generate` can orchestrate copy variants, metadata, and prompt packs.</p>
            </div>
            <div className="timeline-item">
              <div className="timeline-head">
                <strong className="timeline-title">Publishing contract</strong>
                <span className="status-tag">Ready</span>
              </div>
              <p className="timeline-copy">`/api/post` can later dispatch approved content to your target platforms.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
