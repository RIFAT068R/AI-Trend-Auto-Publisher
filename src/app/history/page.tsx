import { Card } from "@/components/Card";
import { Container } from "@/components/Container";
import { getStoredPosts } from "@/lib/storage";

export const dynamic = "force-dynamic";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(new Date(value));
}

export default async function HistoryPage() {
  const posts = await getStoredPosts().catch(() => []);

  return (
    <main className="page-shell">
      <Container>
        <section className="page-header page-header-compact">
          <div className="page-header-copy">
            <h1>History</h1>
            <p>Review previous posts, publishing status, and distribution sources in one simple view.</p>
          </div>
        </section>

        {posts.length === 0 ? (
          <Card title="No posts yet" description="Your publishing history will appear here once the first item is created.">
            <div className="empty-state">
              <strong>No publishing history available</strong>
              <p>Generate and publish a post to start building the archive.</p>
            </div>
          </Card>
        ) : (
          <Card title="Previous Posts" description="A clean view of the latest publishing records." className="history-card-shell">
            <div className="history-table history-table-head">
              <span>Title</span>
              <span>Status</span>
              <span>Date</span>
              <span>Source</span>
            </div>

            <div className="history-table-body">
              {posts.map((post) => (
                <article key={post.id} className="history-table-row">
                  <div className="history-cell history-title-cell" data-label="Title">
                    <strong>{post.title}</strong>
                    <span>{post.topic}</span>
                  </div>
                  <div className="history-cell" data-label="Status">
                    <span className={`status-badge status-${post.status}`}>{post.status}</span>
                  </div>
                  <div className="history-cell" data-label="Date">
                    <strong>{formatDate(post.publishedAt)}</strong>
                  </div>
                  <div className="history-cell" data-label="Source">
                    <strong>{post.source}</strong>
                  </div>
                </article>
              ))}
            </div>
          </Card>
        )}
      </Container>
    </main>
  );
}
