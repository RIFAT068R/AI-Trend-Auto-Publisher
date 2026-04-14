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
        <section className="page-intro reveal-up">
          <span className="hero-badge">Archive</span>
          <h1>Publishing History</h1>
          <p>
            Previous posts are stored in a local JSON source, keeping the UI clean while the backend remains easy to swap for a database later.
          </p>
        </section>

        <section className="history-list reveal-up delay-1">
          {posts.map((post) => (
            <Card
              key={post.id}
              title={post.title}
              description={`${post.channel} distribution`}
              eyebrow={post.topic}
              className="history-card"
            >
              <div className="history-meta-row">
                <div className="history-meta-item">
                  <span className="micro-label">Date</span>
                  <strong>{formatDate(post.publishedAt)}</strong>
                </div>
                <div className="history-meta-item">
                  <span className="micro-label">Status</span>
                  <span className={`status-chip status-${post.status}`}>{post.status}</span>
                </div>
                <div className="history-meta-item">
                  <span className="micro-label">Record ID</span>
                  <strong>{post.id}</strong>
                </div>
              </div>
            </Card>
          ))}
        </section>
      </Container>
    </main>
  );
}
