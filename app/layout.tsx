import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import "../styles/theme.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

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
  title: "Accountrix - Construction CFO Mastery",
  description: "Master construction financial management with our comprehensive 12-month curriculum. Learn through interactive lessons, quizzes, and flashcards.",
  keywords: ["construction", "CFO", "finance", "learning", "education", "accounting"],
  authors: [{ name: "Accountrix" }],
  openGraph: {
    title: "Accountrix - Construction CFO Mastery",
    description: "Master construction financial management with our comprehensive 12-month curriculum.",
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
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}