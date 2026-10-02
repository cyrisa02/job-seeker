// src/app/robots.ts

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/dashboard", "/auth", "/api"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin", "/dashboard", "/auth", "/api"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
