import Link from "next/link";
import { BookOpen, Github, Twitter, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">Accountrix</span>
            </div>
            <p className="text-muted-foreground mb-4">
              Master construction financial management with our comprehensive CFO curriculum. 
              Learn through interactive lessons, quizzes, and spaced-repetition flashcards.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Learn</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/learn" className="text-muted-foreground hover:text-foreground transition-colors">
                  Curriculum
                </Link>
              </li>
              <li>
                <Link href="/flashcards" className="text-muted-foreground hover:text-foreground transition-colors">
                  Flashcards
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-muted-foreground hover:text-foreground transition-colors">
                  Search
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-muted-foreground hover:text-foreground transition-colors">
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t mt-8">
          <p className="text-sm text-muted-foreground">
            © 2024 Accountrix. All rights reserved.
          </p>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <a 
              href="#" 
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Follow us on Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a 
              href="#" 
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="View our GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a 
              href="mailto:hello@accountrix.com" 
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Send us an email"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}