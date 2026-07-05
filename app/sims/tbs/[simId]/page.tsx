import { notFound } from "next/navigation";
import { TbsPlayer } from "@/components/TbsPlayer";
import { loadTbsSim } from "@/lib/sims-content";

interface PageProps {
  params: Promise<{ simId: string }>;
}

export default async function TbsPage({ params }: PageProps) {
  const { simId } = await params;
  const sim = await loadTbsSim(simId);
  if (!sim) notFound();
  return <TbsPlayer sim={sim} />;
}
