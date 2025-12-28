import "~/styles/globals.css";
import type { Metadata } from "next";
import { JetBrains_Mono, Pixelify_Sans } from "next/font/google";
import { Suspense } from "react";
import NavBar from "~/components/NavBar";
import NavTooltips from "~/components/NavTooltips";
import BackToTop from "~/components/utils/BackToTop";
import { PostHogProvider } from "~/components/utils/PostHogProvider";
import TransitionWrapper from "~/components/utils/TransitionWrapper";
import { env } from "~/env";

const siteUrl = env.NEXT_PUBLIC_SITE_URL ?? "https://anish-sarkar.com";

const jetbrainsMono = JetBrains_Mono({
	subsets: ["latin"],
	variable: "--font-jetbrains-mono",
});

const pixelifySans = Pixelify_Sans({
	subsets: ["latin"],
	variable: "--font-pixelify-sans",
});

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: {
		default: "Anish Sarkar | Software Developer",
		template: "%s | Anish Sarkar",
	},
	description:
		"University Undergrad, full time coder, and AIML enthusiast. Explore my projects, blog posts, and technical journey in backend development, machine learning, and modern web technologies.",
	keywords: [
		"Anish Sarkar",
		"Software Developer",
		"Portfolio",
		"Backend Developer",
		"AIML",
		"Machine Learning",
		"Web Development",
		"Python",
		"React",
		"Next.js",
		"Svelte",
	],
	authors: [{ name: "Anish Sarkar" }],
	creator: "Anish Sarkar",
	openGraph: {
		title: "Anish Sarkar | Software Developer",
		description:
			"University Undergrad, full time coder, and AIML enthusiast. Explore my projects, blog posts, and technical journey.",
		url: siteUrl,
		siteName: "Anish Sarkar - Software Developer",
		locale: "en_US",
		type: "website",
		images: [
			{
				url: `${siteUrl}/og-image.png`,
				width: 1200,
				height: 630,
				alt: "Anish Sarkar - Backend Developer & AIML Enthusiast",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Anish Sarkar | Software Developer",
		description: "University Undergrad, full time coder, and AIML enthusiast",
		images: [`${siteUrl}/og-image.png`],
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
		google: env.NEXT_PUBLIC_GOOGLE_VERIFICATION, // for Google Search Console
	},
};

export default function RootLayout({
	children,
}: Readonly<{ children?: React.ReactNode }>) {
	return (
		<html lang="en" className="dark">
			<body
				className={`${jetbrainsMono.variable} ${pixelifySans.variable} relative overflow-x-hidden font-sans text-foreground antialiased`}
			>
				{/* NavBar wrapper */}
				<div className="relative z-50">
					<NavBar />
				</div>

				{/* Tooltips must be rendered in a client component */}
				<NavTooltips />

				<Suspense fallback={null}>
					<PostHogProvider>
						{/* Content wrapper */}
						<div className="relative z-10 content-fade-mask">
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
