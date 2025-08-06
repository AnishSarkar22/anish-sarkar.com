import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  title: "Blog",
  description: "Step into Anish’s world of backend architecture, AI-driven solutions, and creative approaches to solving complex tech challenges.",
  openGraph: {
    title: "Blog",
    description: "Step into Anish’s world of backend architecture, AI-driven solutions, and creative approaches to solving complex tech challenges.",
    url: `${siteUrl}/blog`,
    images: [
      {
         url: `${siteUrl}/og/home?title=blog`,
      },
    ],
  },
  twitter: {
    title: "Blog",
    description: "Step into Anish’s world of backend architecture, AI-driven solutions, and creative approaches to solving complex tech challenges.",
    card: "summary_large_image",
    creator: "@AnishSarkar22",
    images: [`${siteUrl}/og/home?title=blog`],
  },
};
