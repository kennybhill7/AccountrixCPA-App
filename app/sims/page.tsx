import { SimsHubClient } from "@/components/SimsHubClient";
import { loadEssaySims, loadTbsSims } from "@/lib/sims-content";

/**
 * Exam Sims hub — server-loads authored sims, then hands them to a small
 * client component that overlays local Attempt Ledger progress.
 */
export default async function SimsPage() {
  const [tbs, essays] = await Promise.all([loadTbsSims(), loadEssaySims()]);
  return <SimsHubClient tbs={tbs} essays={essays} />;
}
