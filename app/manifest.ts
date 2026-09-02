import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Accountrix — Finance, CMA & CPA trainer",
    short_name: "Accountrix",
    description: "A daily exam-execution trainer: sessions, drills, calculator mastery, method cards, and applied case workflows.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#eef2ff",
    theme_color: "#2563eb",
    categories: ["education", "finance", "productivity"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
