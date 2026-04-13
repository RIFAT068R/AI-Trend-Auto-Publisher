import { Card } from "@/components/Card";
import { getStoredPosts } from "@/lib/storage";

export default async function HistoryPage() {
  const posts = await getStoredPosts();

  return (
    <main className="page">
      <div className="container stack">
        <section className="hero-panel compact reveal-up">
          <div className="hero-copy">
            <span className="eyebrow">Publishing archive</span>
            <h1>History</h1>
            <p className="hero-text">
              The starter stores publishing records in `data/posts.json` so you can prototype locally now and
              move to a database later without changing the overall application structure.
            </p>
          </div>
        </section>

        <Card title="Publishing records" description="Current local history used by the automation starter." eyebrow="Local storage">
          {posts.length === 0 ? (
            <div className="empty-state">
              <strong>No posts recorded yet</strong>
              <p className="muted">
                The seed file is initialized and waiting for the first automated or manual publish event.
              </p>
            </div>
          ) : (
            <div className="timeline">
              {posts.map((post, index) => (
                <article key={post.id} className="timeline-item reveal-up" style={{ animationDelay: `${index * 70}ms` }}>
                  <div className="timeline-head">
                    <div className="section-stack">
                      <span className="badge">Record {String(index + 1).padStart(2, "0")}</span>
                      <h2 className="timeline-title">{post.title}</h2>
                    </div>
                    <span className="status-pill">Saved</span>
                  </div>

                  <p className="timeline-copy">Topic tracked for publication history and future workflow auditing.</p>

                  <div className="timeline-meta">
                    <span>{post.topic}</span>
                    <span>{post.id}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </Card>
      </div>
    </main>
  );
}
