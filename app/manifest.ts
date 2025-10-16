import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AgentKit demo",
    short_name: "AgentKit",
    description: "Demo of ChatKit with hosted workflow",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    theme_color: "#0E63FF",
    background_color: "#0E63FF",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
    ],
  };
}

