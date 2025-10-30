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
        // Duolingo-inspired blue/white theme
        primary: {
          DEFAULT: "#3B82F6", // Primary accent blue
          hover: "#2563EB", // Darker blue for hover states
          light: "#93C5FD", // Light blue for accents
          dark: "#1E3A8A", // Deep blue for dark elements
        },
        accent: {
          DEFAULT: "#3B82F6", // Primary accent blue
          light: "#DBEAFE", // Very light blue for backgrounds
          dark: "#1E3A8A", // Deep blue
        },
        background: "#FFFFFF", // Pure white background
        surface: {
          DEFAULT: "#F8FAFC", // Very light gray for cards
          blue: "#EFF6FF", // Light blue surface
          dark: "#1E3A8A", // Deep blue surface
        },
        text: {
          DEFAULT: "#1E3A8A", // Deep blue for primary text
          muted: "#64748B", // Gray for secondary text
          light: "#94A3B8", // Light gray for hints
          white: "#FFFFFF", // White text for dark backgrounds
        },
        success: {
          DEFAULT: "#10B981", // Green for success states
          light: "#D1FAE5", // Light green background
        },
        warning: {
          DEFAULT: "#F59E0B", // Orange for warnings
          light: "#FEF3C7", // Light orange background
        },
        error: {
          DEFAULT: "#EF4444", // Red for errors
          light: "#FEE2E2", // Light red background
        },
        border: {
          DEFAULT: "#E5E7EB", // Light gray borders
          light: "#F3F4F6", // Very light borders
          blue: "#BFDBFE", // Blue borders
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
      },
      fontFamily: {
        heading: ['Poppins', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
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