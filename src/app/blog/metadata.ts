import type { Metadata } from "next";
import { env } from "~/env";

const siteUrl = env.NEXT_PUBLIC_SITE_URL ?? "https://anish-sarkar.com";

export const metadata: Metadata = {
	title: "Blog",
	description:
		"Step into Anish’s world of backend architecture, AI-driven solutions, and creative approaches to solving complex tech challenges.",
	openGraph: {
		title: "Blog",
		description:
			"Step into Anish’s world of backend architecture, AI-driven solutions, and creative approaches to solving complex tech challenges.",
		url: `${siteUrl}/blog`,
		images: [
			{
				url: `${siteUrl}/og/home?title=blog`,
			},
		],
	},
	twitter: {
		title: "Blog",
		description:
			"Step into Anish’s world of backend architecture, AI-driven solutions, and creative approaches to solving complex tech challenges.",
		card: "summary_large_image",
		creator: "@AnishSarkar22",
		images: [`${siteUrl}/og/home?title=blog`],
	},
};
