import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  title: "Credits",
  description: "Acknowledging the amazing people, tools, and resources that made this project possible.",
  openGraph: {
    title: "Credits",
    description: "Acknowledging the amazing people, tools, and resources that made this project possible.",
    url: siteUrl + "/credits",
    images: [
      {
        url: siteUrl + "/og/home?title=credits",
      },
    ],
  },
  twitter: {
    title: "Credits",
    description: "Acknowledging the amazing people, tools, and resources that made this project possible.",
    card: "summary_large_image",
    creator: "@AnishSarkar22",
    images: [siteUrl + "/og/home?title=credits"],
  },
};
