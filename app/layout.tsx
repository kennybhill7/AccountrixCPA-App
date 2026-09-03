import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono, Barlow_Condensed, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AppShell } from "@/components/glass/AppShell";
import AskAI from "@/components/AskAI";
import { SmartNotes } from "@/components/SmartNotes";
import { ScratchpadOverlay } from "@/components/glass/ScratchpadOverlay";
import { SyncManager } from "@/components/glass/SyncManager";

// The drafting-table type system: IBM Plex Sans for UI chrome, IBM Plex Mono
// for ledger figures, Barlow Condensed for labels/headings, Source Serif 4
// for lesson reading prose. Matches Claude Design's canvas exactly (extracted
// from Accountrix Drafting Table.dc.html) — not the prior Inter/Space Grotesk pairing.
const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-source-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Accountrix — CMA & CPA Exam Prep",
  description:
    "Master Finance, CMA, and CPA concepts through fictional construction-finance case workflows. Interactive lessons, quizzes, flashcards, an AI tutor, and a CPA-crossover practice bank.",
  keywords: [
    "CMA",
    "CPA",
    "exam prep",
    "accounting",
    "construction finance",
    "WIP",
    "job costing",
    "learning",
  ],
  authors: [{ name: "Accountrix" }],
  openGraph: {
    title: "Accountrix — CMA & CPA Exam Prep",
    description:
      "Master Finance, CMA, and CPA concepts through fictional construction-finance case workflows.",
    type: "website",
  },
  // Installable to the iPad home screen as a full-screen app.
  appleWebApp: {
    capable: true,
    title: "Accountrix",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f0e8" },
    { media: "(prefers-color-scheme: dark)", color: "#17191d" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${plexSans.variable} ${plexMono.variable} ${barlowCondensed.variable} ${sourceSerif.variable} font-body`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AppShell>{children}</AppShell>
          {/* Global AI tutor overlay (S1-C2) — portal-based, zero screen-jump */}
          <AskAI />
          <SmartNotes />
          {/* Global handwriting scratch paper (iPad / Apple Pencil) */}
          <ScratchpadOverlay />
          {/* Cross-device sync (no-op unless enabled + KV configured) */}
          <SyncManager />
        </ThemeProvider>
      </body>
    </html>
  );
}
