import type { Metadata } from "next";
import { env } from "~/env";

const siteUrl = env.NEXT_PUBLIC_SITE_URL ?? "https://anish-sarkar.com";

export const metadata: Metadata = {
	title: "Photos",
	description:
		"A visual journal by Anish, filled with emotion and perspective.",
	openGraph: {
		title: "Photos",
		description:
			"A visual journal by Anish, filled with emotion and perspective.",
		url: `${siteUrl}/photos`,
		images: [
			{
				url: `${siteUrl}/og/home?title=photos`,
			},
		],
	},
	twitter: {
		title: "Photos",
		description:
			"A visual journal by Anish, filled with emotion and perspective.",
		card: "summary_large_image",
		creator: "@AnishSarkar22",
		images: [`${siteUrl}/og/home?title=photos`],
	},
};
