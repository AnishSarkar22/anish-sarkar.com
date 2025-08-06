import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  title: "Projects",
  description: "Experience Anish's work—innovative, thoughtful, and tech-driven.",
  openGraph: {
    title: "Projects",
    description: "Experience Anish's work—innovative, thoughtful, and tech-driven.",
    url: `${siteUrl}/projects`,
    images: [
      {
        url: `${siteUrl}/og/home?title=projects`,
      },
    ],
  },
  twitter: {
    title: "Projects",
    description: "Experience Anish's work—innovative, thoughtful, and tech-driven.",
    card: "summary_large_image",
    creator: "@AnishSarkar22",
    images: [`${siteUrl}/og/home?title=projects`],
  },
};
