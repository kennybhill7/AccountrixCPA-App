import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import AskAI from "@/components/AskAI";
import { SmartNotes } from "@/components/SmartNotes";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-poppins",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Accountrix — CMA & CPA Exam Prep",
  description: "Master Finance, CMA, and CPA concepts through fictional construction-finance case workflows. Interactive lessons, quizzes, flashcards, an AI tutor, and a CPA-crossover practice bank.",
  keywords: ["CMA", "CPA", "exam prep", "accounting", "construction finance", "WIP", "job costing", "learning"],
  authors: [{ name: "Accountrix" }],
  openGraph: {
    title: "Accountrix — CMA & CPA Exam Prep",
    description: "Master Finance, CMA, and CPA concepts through fictional construction-finance case workflows.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} font-body`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          {/* Global AI tutor overlay (S1-C2) — portal-based, zero screen-jump */}
          <AskAI />
          <SmartNotes />
        </ThemeProvider>
      </body>
    </html>
  );
}
