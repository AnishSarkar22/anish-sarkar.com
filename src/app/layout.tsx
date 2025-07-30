import "~/styles/globals.css";
import "~/styles/transition.css"
import NavBar from "~/components/NavBar";
import TransitionWrapper from "~/components/utils/TransitionWrapper";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import BackToTop from "~/components/utils/BackToTop";
import { Analytics } from "@vercel/analytics/react"
import LoadingScreen from "~/components/utils/LoadingScreen";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

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
  description: "University Undergrad, full time coder",
  openGraph: {
    title: "Anish Sarkar",
    description: "University Undergrad, full time coder",
    url: siteUrl,
    siteName: "Anish Sarkar",
    locale: "en_US",
    type: "website",
    images: [siteUrl + "/og/home"],
  },
  robots: {
    index: true,
    follow: true,
    "max-video-preview": -1,
    "max-image-preview": "large",
    "max-snippet": -1,
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
          <LoadingScreen />
          
          {/* Content wrapper */}
          <div className="content-fade-mask relative z-10">
            <div className="relative">
              <TransitionWrapper>{children}</TransitionWrapper>
            </div>
          </div>
          
          {/* NavBar wrapper */}
          <div className="relative z-50">
            <NavBar />
          </div>
          
          {/* Analytics */}
          <Analytics/>
          <SpeedInsights />
          <div className="relative z-[100]">
            <BackToTop threshold={400} />
          </div>
      </body>
    </html>
  );
}