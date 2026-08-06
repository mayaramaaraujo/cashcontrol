import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Finkith",
    short_name: "Finkith",
    description:
      "Track what everyone brings in and what's owed. One shared picture, every month.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#131120",
    theme_color: "#c264af",
    categories: ["finance", "productivity"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
