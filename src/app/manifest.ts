import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CashControl",
    short_name: "CashControl",
    description:
      "Track what everyone brings in and what's owed. One shared picture, every month.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#131120",
    theme_color: "#c264af",
    categories: ["finance", "productivity"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
