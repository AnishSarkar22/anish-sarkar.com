import type { MetadataRoute } from "next";
import { env } from "~/env";

const siteUrl = env.NEXT_PUBLIC_SITE_URL ?? "https://anish-sarkar.com";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: ["/api/", "/_next/", "/static/", "/admin/"], // block these routes
		},
		sitemap: `${siteUrl}/sitemap.xml`,
	};
}
