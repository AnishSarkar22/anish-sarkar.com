import type { Metadata } from "next";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  title: "Photos",
  description: "A visual journal by Anish, filled with emotion and perspective.",
  openGraph: {
    title: "Photos",
    description: "A visual journal by Anish, filled with emotion and perspective.",
    url: `${siteUrl}/photos`,
    images: [
      {
        url: `${siteUrl}/og/home?title=photos`,
      },
    ],
  },
  twitter: {
    title: "Photos",
    description: "A visual journal by Anish, filled with emotion and perspective.",
    card: "summary_large_image",
    creator: "@AnishSarkar22",
    images: [`${siteUrl}/og/home?title=photos`],
  },
};