import { Container } from "@/components/Container";
import { DashboardClient } from "@/components/DashboardClient";
import { getStoredPosts, getSystemStatus } from "@/lib/storage";
import { getAllTrends } from "@/lib/trends";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [trends, systemStatus, posts] = await Promise.all([
    getAllTrends(),
    getSystemStatus(),
    getStoredPosts()
  ]);

  return (
    <main className="page-shell">
      <Container>
        <DashboardClient initialTrends={trends} initialPosts={posts} initialSystemStatus={systemStatus} />
      </Container>
    </main>
  );
}
