import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AppShell } from "@/components/glass/AppShell";
import AskAI from "@/components/AskAI";
import { SmartNotes } from "@/components/SmartNotes";
import { ScratchpadOverlay } from "@/components/glass/ScratchpadOverlay";
import { SyncManager } from "@/components/glass/SyncManager";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
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
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-body`}>
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
