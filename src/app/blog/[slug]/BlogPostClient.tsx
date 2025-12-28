"use client";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
// import TransitionLink from "~/components/utils/TransitionLink";
import Link from "next/link";
import { useEffect, useState } from "react";
import TransitionWrapper from "~/components/utils/TransitionWrapper";
import { trackBlogRead, trackEvent } from "~/utils/posthog";

// Dynamically import mermaid to avoid SSR issues
const MermaidInitializer = dynamic(
	() => import("~/components/utils/MermaidInitializer"),
	{ ssr: false },
);

export default function BlogPostClient({
	children,
	slug,
}: {
	children: React.ReactNode;
	slug: string;
}) {
	const [readingProgress, setReadingProgress] = useState(0);
	const [_mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const [startTime] = useState(Date.now());
	const [hasTrackedRead, setHasTrackedRead] = useState(false);

	useEffect(() => {
		// Track blog post view (for posthog analytics)
		trackEvent("blog_post_view", {
			blog_slug: slug,
			view_type: "initial_load",
		});

		const handleScroll = () => {
			const totalHeight =
				document.documentElement.scrollHeight - window.innerHeight;
			const windowScrollTop =
				window.scrollY || document.documentElement.scrollTop;
			const progress =
				windowScrollTop === 0 ? 0 : Math.min(windowScrollTop / totalHeight, 1);

			setReadingProgress(progress);

			// Track reading milestones (for posthog analytics)
			if (progress >= 0.25 && progress < 0.5) {
				trackEvent("blog_reading_progress", {
					blog_slug: slug,
					progress_percentage: 25,
					reading_time_seconds: Math.floor((Date.now() - startTime) / 1000),
				});
			} else if (progress >= 0.5 && progress < 0.75) {
				trackEvent("blog_reading_progress", {
					blog_slug: slug,
					progress_percentage: 50,
					reading_time_seconds: Math.floor((Date.now() - startTime) / 1000),
				});
			} else if (progress >= 0.75 && progress < 0.9) {
				trackEvent("blog_reading_progress", {
					blog_slug: slug,
					progress_percentage: 75,
					reading_time_seconds: Math.floor((Date.now() - startTime) / 1000),
				});
			} else if (progress >= 0.9 && !hasTrackedRead) {
				const readingTime = Math.floor((Date.now() - startTime) / 1000);
				trackBlogRead(slug, document.title, readingTime);
				setHasTrackedRead(true);
			}
		};

		const handleMouseMove = (e: MouseEvent) => {
			setMousePosition({
				x: e.clientX,
				y: e.clientY,
			});
		};

		// Track page exit (for posthog analytics)
		const handleBeforeUnload = () => {
			const readingTime = Math.floor((Date.now() - startTime) / 1000);
			trackEvent("blog_post_exit", {
				blog_slug: slug,
				reading_time_seconds: readingTime,
				reading_progress: readingProgress,
			});
		};

		window.addEventListener("scroll", handleScroll);
		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("beforeunload", handleBeforeUnload);

		return () => {
			window.removeEventListener("scroll", handleScroll);
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("beforeunload", handleBeforeUnload);
		};
	}, [slug, startTime, readingProgress, hasTrackedRead]);

	// Track social sharing (for posthog analytics)
	const handleSocialShare = (platform: string, url: string) => {
		trackEvent("blog_social_share", {
			blog_slug: slug,
			social_platform: platform,
			share_url: url,
		});
	};

	return (
		<TransitionWrapper>
			{/* Initialize Mermaid */}
			<MermaidInitializer />

			{/* Reactive glow effect that follows mouse */}
			<div
				className="-z-5 pointer-events-none fixed inset-0 opacity-30"
				style={{
					background: " rgba(0, 0, 0, 0.15)",
				}}
			/>

			{/* Main content */}
			{children}

			{/* Beautiful Thank You Footnote as Footer */}
			<footer className="mx-auto mt-20 max-w-4xl px-6 font-mono">
				{/* Separator */}
				{/* <div className="relative my-8 flex h-24 items-center justify-center overflow-hidden">
					<div className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-green-300/40 to-transparent" />

					<motion.div
						className="absolute h-[1px] w-40"
						style={{
							background:
								"linear-gradient(to right, transparent, rgba(52, 211, 153, 0.9), transparent)",
							boxShadow: "0 0 15px rgba(52, 211, 153, 0.5)",
						}}
						initial={{ width: 0, opacity: 0 }}
						whileInView={{ width: 160, opacity: 1 }}
						transition={{ duration: 1.5, ease: "easeOut" }}
						viewport={{ once: true }}
					/>
				</div> */}

				<motion.div
					className="relative mb-16 text-center"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
					viewport={{ once: true, margin: "-100px" }}
				>
					<motion.div
						className="mb-6 text-sm text-zinc-400 uppercase tracking-widest"
						initial={{ opacity: 0, letterSpacing: "0.1em" }}
						whileInView={{ opacity: 0.8, letterSpacing: "0.2em" }}
						transition={{ delay: 0.2, duration: 1.2 }}
						viewport={{ once: true }}
					>
						{/* <span className="bg-gradient-to-r from-zinc-400 to-zinc-500 bg-clip-text text-transparent">
              Thanks for reading
            </span> */}
					</motion.div>

					<motion.h3
						className="relative mb-4 font-medium text-3xl text-white"
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						transition={{ delay: 0.4 }}
						viewport={{ once: true }}
					>
						Enjoyed this?
					</motion.h3>

					<motion.p
						className="mx-auto mb-8 max-w-md text-sm text-zinc-400 leading-relaxed"
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						transition={{ delay: 0.5 }}
						viewport={{ once: true }}
					>
						Sharing helps others discover it and lets me make more content like
						this.
					</motion.p>

					<motion.div
						className="mb-10 flex flex-wrap justify-center gap-5"
						initial={{ opacity: 0, y: 10 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.6 }}
						viewport={{ once: true }}
					>
						<Link href="/blog" passHref>
							<motion.span
								className="inline-flex items-center rounded-full border border-zinc-800/50 bg-zinc-900/50 px-5 py-2.5 text-sm text-zinc-300 backdrop-blur-sm transition-all hover:bg-zinc-800/70"
								whileHover={{
									scale: 1.05,
									y: -2,
									boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
								}}
								whileTap={{ scale: 0.98 }}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="mr-2 h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<title>Back arrow icon</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1.5}
										d="M15 19l-7-7 7-7"
									/>
								</svg>
								More articles
							</motion.span>
						</Link>

						<motion.a
							href="https://x.com/intent/post"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center rounded-full border border-zinc-800/50 bg-zinc-900/50 px-5 py-2.5 text-zinc-300 text-sm backdrop-blur-sm transition-all hover:bg-zinc-800/70"
							onClick={() => handleSocialShare("twitter", window.location.href)}
							whileHover={{
								scale: 1.05,
								y: -2,
								boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
							}}
							whileTap={{ scale: 0.98 }}
						>
							<svg
								className="mr-2 h-4 w-4"
								fill="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path
									fill="none"
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="m4 4l11.733 16H20L8.267 4zm0 16l6.768-6.768m2.46-2.46L20 4"
								/>
							</svg>
							Share on X
						</motion.a>
					</motion.div>

					{/* Enhanced bottom design */}
					<div className="relative py-8">
						<div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

						{/* Copyright text */}
						<motion.div
							className="flex flex-col items-center text-xs text-zinc-300"
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 0.7 }}
							transition={{ delay: 1 }}
							viewport={{ once: true }}
						>
							<span className="mb-1">
								© {new Date().getFullYear()} Anish Sarkar
							</span>
							<span className="text-[10px] text-zinc-300">
								All rights reserved
							</span>
						</motion.div>
					</div>
				</motion.div>
			</footer>
		</TransitionWrapper>
	);
}
