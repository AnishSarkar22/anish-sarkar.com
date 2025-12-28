"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
// import TransitionLink from "~/components/utils/TransitionLink";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Pagination from "~/components/Pagination";
import { trackBlogSearch, trackEvent } from "~/utils/posthog";

// Dynamically import mermaid to avoid SSR issues
const MermaidInitializer = dynamic(
	() => import("~/components/utils/MermaidInitializer"),
	{ ssr: false },
);

type BlogPost = {
	slug: string;
	title: string;
	description: string;
	date: string;
	readingTime?: number;
	image?: string;
};

interface BlogClientProps {
	blogs: BlogPost[];
	currentPage: number;
	totalPages: number;
	postsPerPage: number;
}

export default function BlogClient({
	blogs,
	currentPage,
	totalPages,
	postsPerPage,
}: BlogClientProps) {
	const mainRef = useRef<HTMLDivElement>(null);
	const [searchTerm, _setSearchTerm] = useState("");
	const [filteredBlogs, setFilteredBlogs] = useState<BlogPost[]>(blogs);
	const [searchPage, setSearchPage] = useState(1);

	useEffect(() => {
		// Track blog page view (for posthog analytics)
		trackEvent("blog_page_view", {
			page_number: currentPage,
			total_pages: totalPages,
			posts_per_page: postsPerPage,
			total_posts: blogs.length,
		});
	}, [currentPage, totalPages, postsPerPage, blogs.length]);

	useEffect(() => {
		// Filter blogs based on search term
		const results = blogs.filter((blog) =>
			blog.title.toLowerCase().includes(searchTerm.toLowerCase()),
		);
		setFilteredBlogs(results);
		setSearchPage(1);

		// Track search if search term exists (for posthog analytics)
		if (searchTerm.trim()) {
			trackBlogSearch(searchTerm, results.length);
		}
	}, [searchTerm, blogs]);

	// Track blog click (for posthog analytics)
	const handleBlogClick = (blogSlug: string, blogTitle: string) => {
		trackEvent("blog_card_click", {
			blog_slug: blogSlug,
			blog_title: blogTitle,
			click_type: "blog_navigation",
		});
	};

	// Calculate page count for search results
	const searchTotalPages = Math.ceil(filteredBlogs.length / postsPerPage);

	// Calculate blogs displayed for current page
	const startIndex = searchTerm
		? (searchPage - 1) * postsPerPage
		: (currentPage - 1) * postsPerPage;
	const endIndex = startIndex + postsPerPage;
	const currentBlogs = filteredBlogs.slice(startIndex, endIndex);

	// Function to handle when changing page in search results
	const handleSearchPageChange = (page: number) => {
		setSearchPage(page);
		// Scroll to top of page when changing pages
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<main
			ref={mainRef}
			className="relative mx-auto min-h-screen max-w-4xl overflow-hidden p-8 text-white md:p-16 lg:p-24"
		>
			{/* Initialize Mermaid */}
			<MermaidInitializer />

			{/* Enhanced background elements */}
			<div className="-z-10 pointer-events-none fixed inset-0 bg-black">
				{/* Background elements remain the same but ensure they're pointer-events-none */}
				<motion.div
					className="pointer-events-none absolute top-0 left-0 h-1 w-full"
					style={{
						background:
							"linear-gradient(to right, transparent, rgba(52, 211, 153, 0.3), transparent)",
					}}
					animate={{
						scaleX: [0, 1, 0],
						opacity: [0, 0.5, 0],
						x: ["-100%", "0%", "100%"],
					}}
					transition={{
						duration: 8,
						repeat: Number.POSITIVE_INFINITY,
						ease: "easeInOut",
					}}
				/>
			</div>

			<div className="relative z-10 flex-1">
				{/* Enhanced header with animated styling */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="mb-16"
				>
					<motion.h1
						className="relative mb-2 inline-block font-bold font-pixel text-5xl"
						whileHover={{ scale: 1.03 }}
						transition={{ type: "spring", stiffness: 400, damping: 10 }}
					>
						<span className="inline-block text-green-300 will-change-transform">
							&gt;
						</span>{" "}
						<span className="relative">blogs</span>
					</motion.h1>
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 0.7 }}
						transition={{ delay: 0.7 }}
						className="mt-3 max-w-xl text-gray-400"
					>
						insights and experiments on software, systems, and life.
					</motion.p>
				</motion.div>

				{/* Enhanced blog list with hover effects */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.4 }}
					className="space-y-6"
				>
					{currentBlogs.map((blog) => (
						<div key={blog.slug} className="group">
							<Link
								href={`/blog/${blog.slug}`}
								className="block"
								onMouseLeave={() => {}}
								onClick={() => handleBlogClick(blog.slug, blog.title)}
							>
								<motion.div className="relative overflow-hidden rounded-xl border border-zinc-800/50 bg-zinc-900/40 p-4 transition-all duration-300 md:p-5">
									<div className="flex flex-col gap-6 md:flex-row">
										{/* Left Side: Image/Graphic */}
										<div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-zinc-950/50 md:aspect-auto md:w-2/5">
											{blog.image ? (
												<Image
													src={blog.image}
													alt={blog.title}
													fill
													className="object-cover transition-transform duration-500 group-hover:scale-110"
												/>
											) : (
												<div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-950 via-zinc-950 to-emerald-950/30 p-6 transition-transform duration-500 group-hover:scale-110">
													{/* Decorative Background Elements */}
													<div className="pointer-events-none absolute inset-0">
														<div className="absolute top-[-10%] right-[-10%] h-40 w-40 rounded-full bg-indigo-500/10 blur-[60px]" />
														<div className="absolute bottom-[-10%] left-[-10%] h-40 w-40 rounded-full bg-emerald-500/10 blur-[60px]" />

														{/* Subtle Grid */}
														<div
															className="absolute inset-0 opacity-[0.03]"
															style={{
																backgroundImage:
																	"linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
																backgroundSize: "20px 20px",
															}}
														/>
													</div>

													<div className="relative z-10 flex flex-col items-center text-center">
														<motion.div
															initial={{ opacity: 0, scale: 0.8 }}
															animate={{ opacity: 1, scale: 1 }}
															className="mb-3 rounded-2xl bg-zinc-900/50 p-4 shadow-2xl ring-1 ring-white/10 backdrop-blur-md"
														>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																className="h-10 w-10 text-green-300 opacity-90"
																viewBox="0 0 24 24"
															>
																<title>Article Placeholder</title>
																<path
																	fill="currentColor"
																	d="M13 9h5.5L13 3.5V9M6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4c0-1.11.89-2 2-2m0 18h12v-8H6v8m2-6h8v2H8v-2m0 3h5v2H8v-2z"
																/>
															</svg>
														</motion.div>
														<div className="space-y-1">
															<h3 className="font-bold font-pixel text-[10px] text-green-400/80 uppercase tracking-[0.2em]">
																Article
															</h3>
															<div className="mx-auto h-[1px] w-8 bg-gradient-to-r from-transparent via-green-500/40 to-transparent" />
														</div>
													</div>

													{/* Abstract patterns */}
													<div className="pointer-events-none absolute inset-0 opacity-[0.05]">
														<svg width="100%" height="100%">
															<title>Abstract Pattern</title>
															<pattern
																id={`pattern-${blog.slug}`}
																x="0"
																y="0"
																width="32"
																height="32"
																patternUnits="userSpaceOnUse"
															>
																<circle cx="1" cy="1" r="0.5" fill="white" />
															</pattern>
															<rect
																width="100%"
																height="100%"
																fill={`url(#pattern-${blog.slug})`}
															/>
														</svg>
													</div>
												</div>
											)}
										</div>

										{/* Right Side: Content */}
										<div className="flex flex-1 flex-col justify-center py-1">
											<h2 className="mb-3 line-clamp-2 font-bold font-pixel text-2xl text-white md:text-3xl">
												{blog.title}
											</h2>

											<p className="mb-6 line-clamp-2 flex-grow text-gray-400 text-sm leading-relaxed md:line-clamp-3">
												{blog.description}
											</p>

											<div className="mt-auto flex items-center gap-5 text-zinc-500">
												<div className="flex items-center gap-2">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="h-4 w-4"
														viewBox="0 0 24 24"
													>
														<title>Calendar</title>
														<g fill="none">
															<path
																fill="currentColor"
																d="M2 9c0-1.886 0-2.828.586-3.414S4.114 5 6 5h12c1.886 0 2.828 0 3.414.586S22 7.114 22 9c0 .471 0 .707-.146.854C21.707 10 21.47 10 21 10H3c-.471 0-.707 0-.854-.146C2 9.707 2 9.47 2 9"
															/>
															<path
																fill="currentColor"
																fillRule="evenodd"
																d="M2.586 21.414C2 20.828 2 19.886 2 18v-5c0-.471 0-.707.146-.854C2.293 12 2.53 12 3 12h18c.471 0 .707 0 .854.146c.146.147.146.383.146.854v5c0 1.886 0 2.828-.586 3.414S19.886 22 18 22H6c-1.886 0-2.828 0-3.414-.586M8 16a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2z"
																clipRule="evenodd"
															/>
															<path
																stroke="currentColor"
																strokeLinecap="round"
																strokeWidth="2"
																d="M7 3v3m10-3v3"
															/>
														</g>
													</svg>
													<span className="font-medium text-xs">
														{new Date(blog.date).toLocaleDateString("en-US", {
															year: "numeric",
															month: "long",
															day: "numeric",
														})}
													</span>
												</div>

												{blog.readingTime && (
													<div className="flex items-center gap-2">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="h-4 w-4"
															viewBox="0 0 24 24"
														>
															<title>Reading time</title>
															<path
																fill="currentColor"
																fillRule="evenodd"
																d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12m10-4a1 1 0 1 0-2 0v5a1 1 0 0 0 1 1h5a1 1 0 1 0 0-2h-4z"
																clipRule="evenodd"
															/>
														</svg>
														<span className="font-medium text-xs">
															{blog.readingTime} min
														</span>
													</div>
												)}
											</div>
										</div>
									</div>
								</motion.div>
							</Link>
						</div>
					))}
				</motion.div>

				{/* Empty state for when there are no blogs */}
				{currentBlogs.length === 0 && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5 }}
						className="py-16 text-center text-gray-400"
					>
						<motion.svg
							xmlns="http://www.w3.org/2000/svg"
							className="mx-auto mb-4 h-12 w-12 text-gray-600"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							animate={{
								rotate: [0, 10, 0, -10, 0],
								scale: [1, 1.05, 1, 1.05, 1],
							}}
							transition={{
								duration: 4,
								repeat: Number.POSITIVE_INFINITY,
								repeatType: "loop",
							}}
						>
							<title>No articles found</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1}
								d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</motion.svg>
						{searchTerm ? (
							<>
								<p className="text-lg">No articles found for "{searchTerm}"</p>
								<p className="mt-2 text-sm">Try a different search term</p>
							</>
						) : (
							<>
								<p className="text-lg">No articles found</p>
								<p className="mt-2 text-sm">Check back soon for new content!</p>
							</>
						)}
					</motion.div>
				)}

				{/* Pagination component - Updated for both normal and search states */}
				{(searchTerm ? searchTotalPages : totalPages) > 1 && (
					<Pagination
						currentPage={searchTerm ? searchPage : currentPage}
						totalPages={searchTerm ? searchTotalPages : totalPages}
						onPageChange={searchTerm ? handleSearchPageChange : undefined}
					/>
				)}
			</div>
		</main>
	);
}
