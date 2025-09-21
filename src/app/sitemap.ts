import type { MetadataRoute } from "next";
import { fetchBlogPosts } from "~/components/utils/blog";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	// Fetch all blog posts with metadata
	const posts = await fetchBlogPosts();

	// Static pages
	const staticPages = [
		{
			url: siteUrl,
			lastModified: new Date(),
			changeFrequency: "monthly" as const,
			priority: 1,
		},
		{
			url: `${siteUrl}/blog`,
			lastModified: new Date(),
			changeFrequency: "weekly" as const,
			priority: 0.8,
		},
		{
			url: `${siteUrl}/projects`,
			lastModified: new Date(),
			changeFrequency: "monthly" as const,
			priority: 0.8,
		},
		{
			url: `${siteUrl}/photos`,
			lastModified: new Date(),
			changeFrequency: "monthly" as const,
			priority: 0.6,
		},
	];

	// Dynamic blog pages with actual lastModified date
	const blogPages = posts.map((post) => ({
		url: `${siteUrl}/blog/${post.slug}`,
		lastModified: new Date(post.metadata.date),
		changeFrequency: "weekly" as const,
		priority: 0.8,
	}));

	return [...staticPages, ...blogPages];
}
