import { Card } from "@/components/Card";
import { Container } from "@/components/Container";
import { getStoredPosts } from "@/lib/storage";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(new Date(value));
}

export default async function HistoryPage() {
  const posts = await getStoredPosts();

  return (
    <main className="page-shell">
      <Container>
        <section className="page-header reveal-up page-header-compact">
          <div className="page-header-copy">
            <span className="section-kicker">Archive</span>
            <h1>Publishing History</h1>
            <p>Review previous outputs, scheduling state, and publishing sources from the current local history store.</p>
          </div>
          <div className="page-header-actions">
            <div className="header-meta glass-subpanel">
              <span className="micro-label">Stored records</span>
              <strong>{String(posts.length).padStart(2, "0")}</strong>
            </div>
          </div>
        </section>

        {posts.length === 0 ? (
          <section className="reveal-up delay-1">
            <Card title="No publishing history yet" description="Create or queue a post to populate this archive." eyebrow="Empty state">
              <div className="empty-state glass-subpanel">
                <strong>No posts recorded</strong>
                <p>The history table will automatically fill as new content moves through the publishing workflow.</p>
              </div>
            </Card>
          </section>
        ) : (
          <section className="history-table-shell reveal-up delay-1">
            <Card
              title="Previous Posts"
              description="A clean operational view of recent publishing records."
              eyebrow="History"
              className="history-table-card"
            >
              <div className="history-table history-table-head">
                <span>Title</span>
                <span>Status</span>
                <span>Date</span>
                <span>Source</span>
              </div>
              <div className="history-table-body">
                {posts.map((post) => (
                  <article key={post.id} className="history-table-row">
                    <div className="history-cell history-title-cell">
                      <strong>{post.title}</strong>
                      <span>{post.topic}</span>
                    </div>
                    <div className="history-cell" data-label="Status">
                      <span className={`status-chip status-${post.status}`}>{post.status}</span>
                    </div>
                    <div className="history-cell" data-label="Date">
                      <strong>{formatDate(post.publishedAt)}</strong>
                    </div>
                    <div className="history-cell" data-label="Source">
                      <strong>{post.channel}</strong>
                    </div>
                  </article>
                ))}
              </div>
            </Card>
          </section>
        )}
      </Container>
    </main>
  );
}
