import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import { processMarkdown } from "./markdown";

export type Metadata = {
	title: string;
	description: string;
	date: string;
	discussionId?: string;
	readingTime?: number;
};

export type FrontmatterParseResult = {
	metadata: Metadata;
	content: string;
	html: string;
};

export type MDXFileData = FrontmatterParseResult & {
	slug: string;
};

// Get the posts directory path
const postsDirectory = path.join(process.cwd(), "posts");

// Function to fetch blog posts from local filesystem
export const fetchBlogPosts = cache(async (): Promise<MDXFileData[]> => {
	try {
		// Check if posts directory exists
		if (!fs.existsSync(postsDirectory)) {
			console.warn("Posts directory not found");
			return [];
		}

		// Get all markdown files
		const fileNames = fs.readdirSync(postsDirectory);
		const mdFiles = fileNames.filter((name) => name.endsWith(".md"));

		console.log("Found local markdown files:", mdFiles);

		// Process each file
		const posts = await Promise.all(
			mdFiles.map(async (fileName) => {
				const filePath = path.join(postsDirectory, fileName);
				const fileContent = fs.readFileSync(filePath, "utf8");

				const { metadata, content } = parseFrontmatter(fileContent);
				const html = await processMarkdown(content); // Process markdown to HTML

				// Calculate reading time
				const readingTime = calculateReadingTime(content);

				return {
					slug: fileName.replace(/\.md$/, ""),
					metadata: {
						...metadata,
						readingTime,
					},
					content,
					html,
				};
			}),
		);

		// Sort posts by date descending
		return posts.sort((a, b) => {
			if (new Date(a.metadata.date) < new Date(b.metadata.date)) {
				return 1;
			}
			return -1;
		});
	} catch (error) {
		console.error("Error reading local blog posts:", error);
		return [];
	}
});

// Function to get all blog slugs
export const getAllBlogSlugs = cache(async (): Promise<string[]> => {
	const posts = await fetchBlogPosts();
	return posts.map((post) => post.slug);
});

// Function to get posts by slug
export const getPostBySlug = cache(
	async (slug: string): Promise<MDXFileData | null> => {
		console.log("Fetching post for slug:", slug);
		const posts = await fetchBlogPosts();
		console.log(
			"Available posts:",
			posts.map((p) => p.slug),
		);

		const foundPost = posts.find((post) => post.slug === slug) ?? null;
		console.log("Found post:", foundPost);

		return foundPost;
	},
);

// reading time calculation
function calculateReadingTime(content: string): number {
	const wordsPerMinute = 200;
	const words = content.split(/\s+/).length;
	return Math.ceil(words / wordsPerMinute);
}

// Function to parse frontmatter from markdown content
function parseFrontmatter(fileContent: string): FrontmatterParseResult {
	const frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
	const match = frontmatterRegex.exec(fileContent);

	if (!match) {
		throw new Error("No frontmatter found");
	}

	const frontmatter = match[1];

	if (!frontmatter) {
		throw new Error("No frontmatter found");
	}

	const content = fileContent.replace(frontmatterRegex, "").trim();
	const frontmatterLines = frontmatter.trim().split("\n");
	const metadata: Partial<Metadata> = {};

	for (const line of frontmatterLines) {
		const [key, ...values] = line.split(": ");
		let value = values.join(": ").trim();
		value = value.replace(/^['"](.*)['"]$/, "$1");
		if (key && value) {
			metadata[key.trim() as keyof Metadata] = value;
		}
	}

	return { metadata: metadata as Metadata, content, html: "" };
}
