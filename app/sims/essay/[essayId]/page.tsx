import { notFound } from "next/navigation";
import { EssayPlayer } from "@/components/EssayPlayer";
import { loadEssaySim } from "@/lib/sims-content";

interface PageProps {
  params: Promise<{ essayId: string }>;
}

export default async function EssayPage({ params }: PageProps) {
  const { essayId } = await params;
  const essay = await loadEssaySim(essayId);
  if (!essay) notFound();
  return <EssayPlayer essay={essay} />;
}
