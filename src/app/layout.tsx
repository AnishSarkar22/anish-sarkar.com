import "~/styles/globals.css";
import "~/styles/transition.css";
import NavBar from "~/components/NavBar";
import TransitionWrapper from "~/components/utils/TransitionWrapper";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import BackToTop from "~/components/utils/BackToTop";
import LoadingScreen from "~/components/utils/LoadingScreen";
import { PostHogProvider } from "~/components/utils/PostHogProvider";
import { Suspense } from "react";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Anish Sarkar | Portfolio",
    template: "%s | Anish Sarkar",
  },
  description: "University Undergrad, full time coder, and AIML enthusiast. Explore my projects, blog posts, and technical journey in backend development, machine learning, and modern web technologies.",
  keywords: ["Anish Sarkar", "Portfolio", "Backend Developer", "AIML", "Machine Learning", "Web Development", "Python", "React", "Next.js", "Svelte"],
  authors: [{ name: "Anish Sarkar" }],
  creator: "Anish Sarkar",
  openGraph: {
    title: "Anish Sarkar | Portfolio",
    description: "University Undergrad, full time coder, and AIML enthusiast. Explore my projects, blog posts, and technical journey.",
    url: siteUrl,
    siteName: "Anish Sarkar Portfolio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: siteUrl + "/og/home",
        width: 1200,
        height: 630,
        alt: "Anish Sarkar - Backend Developer & AIML Enthusiast",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Anish Sarkar | Portfolio",
    description: "University Undergrad, full time coder, and AIML enthusiast",
    images: [siteUrl + "/og/home"],
    creator: "@AnishSarkar22",
  },
  robots: {
    index: true,
    follow: true,
    "max-video-preview": -1,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION, // for Google Search Console
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-foreground font-mono relative overflow-x-hidden`}
      >
        {/* Loading Screen */}
        <LoadingScreen children={undefined} />

        {/* NavBar wrapper */}
        <div className="relative z-50">
          <NavBar />
        </div>

        <Suspense fallback={null}>
          <PostHogProvider>
            {/* Content wrapper */}
            <div className="content-fade-mask relative z-10">
              <div className="relative">
                <TransitionWrapper>{children}</TransitionWrapper>
              </div>
            </div>
          </PostHogProvider>
        </Suspense>

        <div className="relative z-[100]">
          <BackToTop />
        </div>
      </body>
    </html>
  );
}
