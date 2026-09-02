import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Warm "study paper" theme — all theme-aware via CSS vars (see
        // app/globals.css :root / .dark). Ink on paper + amber accent.
        primary: {
          DEFAULT: "hsl(var(--primary))",
          hover: "hsl(var(--primary-hover))",
          light: "hsl(var(--primary-light))",
          dark: "hsl(var(--primary-dark))",
          foreground: "hsl(var(--primary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          light: "hsl(var(--accent))",
          dark: "hsl(var(--primary-dark))",
          foreground: "hsl(var(--accent-foreground))",
        },
        background: "hsl(var(--background))",
        surface: {
          DEFAULT: "hsl(var(--surface))",
          blue: "hsl(var(--surface-blue))",
          dark: "hsl(var(--surface-dark))",
        },
        text: {
          DEFAULT: "hsl(var(--text))",
          muted: "hsl(var(--text-muted))",
          light: "hsl(var(--text-light))",
          white: "#FFFFFF",
        },
        success: {
          DEFAULT: "#15803d", // green (reads on both themes)
          light: "#D1FAE5",
        },
        warning: {
          DEFAULT: "#b45309", // amber
          light: "#FEF3C7",
        },
        error: {
          DEFAULT: "#b91c1c", // red
          light: "#FEE2E2",
        },
        border: {
          DEFAULT: "hsl(var(--border))",
          light: "hsl(var(--border-light))",
          blue: "hsl(var(--border))",
        },
        // Legacy shadcn colors for compatibility
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        foreground: "hsl(var(--foreground))",
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Color-coded unit accents + status (Aurora glass)
        "unit-1": "hsl(var(--unit-1))",
        "unit-1-ink": "hsl(var(--unit-1-ink))",
        "unit-2": "hsl(var(--unit-2))",
        "unit-2-ink": "hsl(var(--unit-2-ink))",
        "unit-3": "hsl(var(--unit-3))",
        "unit-3-ink": "hsl(var(--unit-3-ink))",
        "status-done": "hsl(var(--status-done))",
        "status-current": "hsl(var(--status-current))",
        "status-streak": "hsl(var(--status-streak))",
      },
      fontFamily: {
        display: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-space-grotesk)', 'Poppins', 'system-ui', 'sans-serif'],
        body: ['system-ui', '-apple-system', 'Inter', 'sans-serif'],
        sans: ['system-ui', '-apple-system', 'Inter', 'sans-serif'],
      },
      fontWeight: {
        heading: '600',
        'heading-bold': '700',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        'progress-ring': 'progress-ring 1s ease-out forwards',
        'confetti-fall': 'confetti-fall 3s linear infinite',
        'bubble-pulse': 'bubble-pulse 2s ease-in-out infinite',
        'mascot-bounce': 'mascot-bounce 2s ease-in-out infinite',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;