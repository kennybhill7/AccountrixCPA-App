import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReviewWorkpaper } from "@/components/ReviewWorkpaper";
import { getReviewWorkpaper } from "@/lib/reviewMode";

interface PageProps {
  params: Promise<{ reviewId: string }>;
  searchParams: Promise<{ seed?: string | string[] }>;
}

/**
 * The seed is in the URL on purpose: the case a learner sees is reproducible
 * and shareable, and "next case" is just seed + 1 rather than a hidden roll.
 */
function parseSeed(raw: string | string[] | undefined): number {
  const value = Array.isArray(raw) ? raw[0] : raw;
  const n = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.min(n, 100000);
}

export default async function ReviewCasePage({ params, searchParams }: PageProps) {
  const { reviewId } = await params;
  const workpaper = getReviewWorkpaper(reviewId);
  if (!workpaper) notFound();

  const seed = parseSeed((await searchParams).seed);

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-16 z-40 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <Button asChild variant="ghost" size="sm">
                <Link href="/review">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Review Mode
                </Link>
              </Button>
              <div className="min-w-0">
                <h1 className="truncate font-semibold">{workpaper.title}</h1>
                <p className="truncate text-sm text-muted-foreground">
                  {workpaper.company} · {workpaper.period} · prepared by {workpaper.preparedBy}
                </p>
              </div>
            </div>
            <div className="hidden shrink-0 text-xs text-muted-foreground md:block">
              Case #{seed} · fictional data only
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-5xl">
          <ReviewWorkpaper workpaper={workpaper} seed={seed} />
        </div>
      </main>
    </div>
  );
}
