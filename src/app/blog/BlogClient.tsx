"use client";

import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
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
	date: string;
	readingTime?: number;
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
	const [hoveredBlog, setHoveredBlog] = useState<string | null>(null);
	const [_mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const mainRef = useRef<HTMLDivElement>(null);
	const [searchTerm, setSearchTerm] = useState("");
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

	// Track blog card hover (for posthog analytics)
	const handleBlogHover = (blogSlug: string, blogTitle: string) => {
		setHoveredBlog(blogSlug);
		trackEvent("blog_card_hover", {
			blog_slug: blogSlug,
			blog_title: blogTitle,
		});
	};

	// Track blog click (for posthog analytics)
	const handleBlogClick = (blogSlug: string, blogTitle: string) => {
		trackEvent("blog_card_click", {
			blog_slug: blogSlug,
			blog_title: blogTitle,
			click_type: "blog_navigation",
		});
	};

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (mainRef.current) {
				const rect = mainRef.current.getBoundingClientRect();
				setMousePosition({
					x: e.clientX - rect.left,
					y: e.clientY - rect.top,
				});
			}
		};

		window.addEventListener("mousemove", handleMouseMove);
		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
		};
	}, []);

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
						className="relative inline-block font-bold text-5xl text-white"
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
						whileHover={{ scale: 1.03 }}
					>
						<span className="inline-block text-green-300 will-change-transform">
							&gt;
						</span>{" "}
						<span className="relative">
							blogs
							{/* Animated underline with glow */}
							{/* <motion.span 
                className="-bottom-1 absolute left-0 h-[2px] bg-gradient-to-r from-green-300/0 via-green-300 to-green-300/0"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, delay: 0.5 }}
              /> */}
						</span>
					</motion.h1>
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 0.7 }}
						transition={{ delay: 0.7 }}
						className="mt-3 max-w-xl text-gray-400"
					>
						Thoughts, ideas, and explorations on technology, programming, and
						life.
					</motion.p>
				</motion.div>

				{/* Ultra-enhanced Search bar with cosmic styling - Completely redesigned */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.4 }}
					className="relative z-20 mb-16"
				>
					<div className="group relative">
						{/* Glowing background effect */}
						<motion.div
							className="-inset-1 absolute rounded-2xl opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"
							animate={{
								background: [
									"radial-gradient(circle at top left, rgba(52, 211, 153, 0.15), transparent 70%)",
									"radial-gradient(circle at bottom right, rgba(52, 211, 153, 0.15), transparent 70%)",
									"radial-gradient(circle at top left, rgba(52, 211, 153, 0.15), transparent 70%)",
								],
							}}
							transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
						/>

						{/* Main input field with enhanced styling */}
						<div className="relative overflow-hidden rounded-2xl shadow-[0_0_25px_rgba(0,0,0,0.3)] backdrop-blur-lg">
							{/* Animated border */}
							<motion.div
								className="absolute inset-0 z-0 rounded-2xl"
								initial={{ opacity: 0.5 }}
								animate={{ opacity: 1 }}
								style={{
									background: "linear-gradient(90deg, #18181b, #27272a)",
									border: "1px solid rgba(63, 63, 70, 0.5)",
								}}
								whileHover={{
									boxShadow: "0 0 30px rgba(52, 211, 153, 0.2)",
									border: "1px solid rgba(52, 211, 153, 0.3)",
								}}
								transition={{ duration: 0.3 }}
							/>

							{/* Animated gradient line */}
							<motion.div
								className="absolute right-0 bottom-0 left-0 z-10 h-[2px]"
								initial={{ scaleX: 0 }}
								animate={{ scaleX: 1 }}
								transition={{ duration: 0.8, delay: 0.5 }}
								style={{
									background:
										"linear-gradient(90deg, transparent, rgba(52, 211, 153, 0.7), transparent)",
									transformOrigin: "left",
								}}
							/>

							{/* Shine effect */}
							<motion.div
								className="-skew-x-12 absolute inset-0 z-0 h-full w-full bg-gradient-to-r from-transparent via-green-300/5 to-transparent"
								animate={{
									x: ["-100%", "100%"],
								}}
								transition={{
									duration: 3,
									repeat: Number.POSITIVE_INFINITY,
									repeatDelay: 2,
								}}
							/>

							<input
								type="text"
								placeholder="Search articles..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="relative z-10 w-full bg-transparent px-6 py-5 pr-16 pl-16 text-lg text-white backdrop-blur-xl focus:outline-none"
							/>
						</div>

						{/* Enhanced search icon with animation */}
						<motion.div
							className="-translate-y-1/2 absolute top-1/2 left-5 z-20 flex items-center justify-center text-gray-400 transition-colors duration-500 group-hover:text-green-300"
							initial={{ opacity: 0.7 }}
							animate={{
								opacity: [0.7, 1, 0.7],
							}}
							transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
						>
							<motion.div
								className="relative"
								whileHover={{ scale: 1.2, rotate: 15 }}
								transition={{ type: "spring", stiffness: 400, damping: 10 }}
							>
								<motion.div
									className="-inset-2 absolute rounded-full opacity-0 group-hover:opacity-30"
									animate={{
										scale: [1, 1.2, 1],
										opacity: [0, 0.3, 0],
									}}
									transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
									style={{
										background:
											"radial-gradient(circle, rgba(52, 211, 153, 0.8), transparent 70%)",
									}}
								/>

								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1.5}
								>
									<title>Search</title>
									<motion.path
										d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
										animate={{
											pathLength: [0.3, 1, 0.3],
											strokeDasharray: ["1, 200", "100, 200", "1, 200"],
										}}
										transition={{
											duration: 4,
											repeat: Number.POSITIVE_INFINITY,
										}}
									/>
								</svg>
							</motion.div>
						</motion.div>

						{/* Enhanced clear button with futuristic design - Adjusted Y position */}
						{searchTerm && (
							<motion.button
								onClick={() => setSearchTerm("")}
								className="-translate-y-1/2 absolute top-[calc(50%-8px)] right-5 z-20 flex items-center justify-center text-gray-400 transition-colors duration-300 hover:text-green-300"
								initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
								animate={{ opacity: 1, scale: 1, rotate: 0 }}
								exit={{ opacity: 0, scale: 0.8, rotate: 90 }}
								whileHover={{
									scale: 1.2,
								}}
								whileTap={{ scale: 0.9 }}
							>
								<motion.div className="relative flex items-center justify-center">
									{/* Pulsing background */}
									<motion.div
										className="absolute inset-0 rounded-full opacity-0 hover:opacity-20"
										animate={{
											scale: [1, 1.2, 1],
											opacity: [0, 0.2, 0],
										}}
										transition={{
											duration: 2,
											repeat: Number.POSITIVE_INFINITY,
										}}
										style={{
											background:
												"radial-gradient(circle, rgba(52, 211, 153, 0.8), transparent 70%)",
										}}
									/>

									{/* Rotating X icon */}
									<motion.div
										whileHover={{ rotate: 90 }}
										transition={{ type: "spring", stiffness: 300, damping: 10 }}
										className="flex h-6 w-6 items-center justify-center"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<title>Clear search</title>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={1.5}
												d="M6 18L18 6M6 6l12 12"
											/>
										</svg>
									</motion.div>
								</motion.div>
							</motion.button>
						)}

						{/* Cosmic particle effects */}
						<AnimatePresence>
							{searchTerm &&
								[...Array(12)].map((_, _i) => {
									const particleKey =
										typeof crypto !== "undefined" && crypto.randomUUID
											? crypto.randomUUID()
											: `search-particle-${Math.random().toString(36).substr(2, 9)}`;
									return (
										<motion.div
											key={particleKey}
											className="pointer-events-none absolute z-10 rounded-full"
											initial={{
												x: "50%",
												y: "50%",
												opacity: 0,
												scale: 0,
											}}
											animate={{
												x: `${50 + (Math.random() * 140 - 70)}%`,
												y: `${50 + (Math.random() * 140 - 70)}%`,
												opacity: [0, Math.random() * 0.5 + 0.3, 0],
												scale: [0, Math.random() * 1 + 0.5, 0],
											}}
											exit={{ opacity: 0, scale: 0 }}
											transition={{
												duration: 1.5 + Math.random() * 2,
												repeat: Number.POSITIVE_INFINITY,
												delay: Math.random() * 0.5,
											}}
											style={{
												width: `${Math.random() * 3 + 1}px`,
												height: `${Math.random() * 3 + 1}px`,
												background: `rgba(${52 + Math.random() * 30}, ${211 + Math.random() * 30}, ${153 + Math.random() * 30}, ${Math.random() * 0.5 + 0.5})`,
												boxShadow: `0 0 ${Math.random() * 5 + 2}px rgba(52, 211, 153, ${Math.random() * 0.5 + 0.5})`,
												filter: `blur(${Math.random() * 1}px)`,
											}}
										/>
									);
								})}
						</AnimatePresence>
					</div>

					{/* Enhanced search results counter with futuristic design */}
					<AnimatePresence>
						{searchTerm && (
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 10 }}
								transition={{ duration: 0.3 }}
								className="absolute top-full right-4 z-20 mt-4"
							>
								<motion.div
									className="flex items-center rounded-full border border-zinc-800/50 bg-zinc-900/80 px-4 py-2 shadow-lg backdrop-blur-md"
									whileHover={{
										scale: 1.05,
										boxShadow: "0 0 20px rgba(52, 211, 153, 0.2)",
										borderColor: "rgba(52, 211, 153, 0.3)",
									}}
									transition={{ type: "spring", stiffness: 400, damping: 10 }}
								>
									{/* Animated dot */}
									<motion.div
										className="mr-2 h-2.5 w-2.5 rounded-full bg-green-300"
										animate={{
											scale: [1, 1.3, 1],
											opacity: [0.7, 1, 0.7],
											boxShadow: [
												"0 0 0px rgba(52, 211, 153, 0.5)",
												"0 0 10px rgba(52, 211, 153, 0.8)",
												"0 0 0px rgba(52, 211, 153, 0.5)",
											],
										}}
										transition={{
											duration: 2,
											repeat: Number.POSITIVE_INFINITY,
										}}
									/>

									{/* Result text with gradient */}
									<div className="flex items-center">
										<motion.span
											className="mr-1 bg-gradient-to-r from-green-300 to-green-400 bg-clip-text font-medium text-transparent"
											animate={{
												backgroundPosition: [
													"0% center",
													"100% center",
													"0% center",
												],
											}}
											transition={{
												duration: 3,
												repeat: Number.POSITIVE_INFINITY,
											}}
											style={{ backgroundSize: "200% auto" }}
										>
											{filteredBlogs.length}
										</motion.span>
										<span className="text-gray-300 text-sm">
											result{filteredBlogs.length !== 1 ? "s" : ""} found
										</span>
									</div>
								</motion.div>
							</motion.div>
						)}
					</AnimatePresence>
				</motion.div>

				{/* Enhanced blog list with incredible hover effects */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.6 }}
					className="space-y-6"
				>
					<AnimatePresence>
						{currentBlogs.map((blog, index) => (
							<motion.div
								key={blog.slug}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								transition={{ duration: 0.4, delay: index * 0.1 }}
								className="group"
								onHoverStart={() => handleBlogHover(blog.slug, blog.title)}
								onHoverEnd={() => setHoveredBlog(null)}
							>
								<Link
									href={`/blog/${blog.slug}`}
									className="block"
									onClick={() => handleBlogClick(blog.slug, blog.title)}
								>
									<motion.div
										className="relative overflow-hidden rounded-lg border border-zinc-800/50 bg-zinc-900/30 p-6 transition-all duration-500"
										whileHover={{
											backgroundColor: "rgba(52, 211, 153, 0.05)",
											borderColor: "rgba(52, 211, 153, 0.2)",
											y: -8,
											scale: 1.02,
										}}
									>
										{/* Animated border glow */}
										<motion.div
											className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
											style={{
												background:
													"linear-gradient(90deg, transparent, rgba(52, 211, 153, 0.2), transparent)",
												backgroundSize: "200% 100%",
											}}
											animate={
												hoveredBlog === blog.slug
													? {
															backgroundPosition: ["0% 0%", "200% 0%"],
														}
													: {}
											}
											transition={{
												duration: 1.5,
												repeat: Number.POSITIVE_INFINITY,
												repeatType: "loop",
											}}
										/>

										{/* Glowing effect on hover */}
										{hoveredBlog === blog.slug && (
											<motion.div
												className="-z-10 absolute inset-0"
												initial={{ opacity: 0 }}
												animate={{ opacity: 0.15 }}
												exit={{ opacity: 0 }}
												style={{
													background:
														"radial-gradient(circle at center, rgba(52, 211, 153, 0.5) 0%, transparent 70%)",
													filter: "blur(20px)",
												}}
											/>
										)}

										{/* Particle effects on hover */}
										{hoveredBlog === blog.slug &&
											[...Array(10)].map((_, i) => {
												const particleKey =
													typeof crypto !== "undefined" && crypto.randomUUID
														? crypto.randomUUID()
														: `particle-${blog.slug}-${i}-${Math.random().toString(36).substr(2, 9)}`;
												return (
													<motion.div
														key={particleKey}
														className="absolute h-1 w-1 rounded-full bg-green-300/40"
														initial={{
															x: "50%",
															y: "50%",
															opacity: 0,
														}}
														animate={{
															x: `${50 + (Math.random() * 100 - 50)}%`,
															y: `${50 + (Math.random() * 100 - 50)}%`,
															opacity: [0, 0.8, 0],
															scale: [0, 1, 0],
														}}
														transition={{
															duration: 1 + Math.random() * 2,
															repeat: Number.POSITIVE_INFINITY,
															delay: Math.random() * 0.5,
														}}
													/>
												);
											})}

										<div className="relative z-10 block">
											<motion.h2
												className="font-semibold text-white text-xl transition-colors duration-300 group-hover:text-green-300"
												whileHover={{ x: 5 }}
											>
												{blog.title}
											</motion.h2>

											<div className="mt-3 flex items-center text-gray-500">
												<motion.svg
													xmlns="http://www.w3.org/2000/svg"
													className="mr-2 h-4 w-4 text-green-300/70"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<title>Calendar</title>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
													/>
												</motion.svg>
												<p className="text-xs">
													{new Date(blog.date).toLocaleDateString("en-US", {
														year: "numeric",
														month: "long",
														day: "numeric",
													})}
												</p>
												{blog.readingTime && (
													<>
														<span className="mx-2 text-gray-600">•</span>
														<motion.svg
															xmlns="http://www.w3.org/2000/svg"
															className="mr-1 h-4 w-4 text-green-300/70"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
														>
															<title>Reading time</title>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
															/>
														</motion.svg>
														<p className="text-xs">
															{blog.readingTime} min read
														</p>
													</>
												)}
											</div>

											{/* Read more link with hover animation */}
											<motion.div
												initial={{ opacity: 0, y: 10 }}
												animate={{
													opacity: hoveredBlog === blog.slug ? 1 : 0,
													y: hoveredBlog === blog.slug ? 0 : 10,
												}}
												transition={{ duration: 0.2 }}
												className="mt-4 flex items-center text-green-300 text-sm"
											>
												Read article
												<motion.svg
													xmlns="http://www.w3.org/2000/svg"
													className="ml-1 h-4 w-4"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
													animate={{
														x: hoveredBlog === blog.slug ? [0, 4, 0] : 0,
													}}
													transition={{
														duration: 1.5,
														repeat: Number.POSITIVE_INFINITY,
														repeatType: "loop",
													}}
												>
													<title>Arrow right</title>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M14 5l7 7m0 0l-7 7m7-7H3"
													/>
												</motion.svg>
											</motion.div>
										</div>
									</motion.div>
								</Link>
							</motion.div>
						))}
					</AnimatePresence>
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

				{/* Enhanced footer */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 1.2, duration: 0.5 }}
					className="mt-20 text-center"
				>
					{/* Cosmic divider */}
					<div className="relative mx-auto mb-10 h-[1px] w-full overflow-hidden">
						<motion.div
							className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-600 to-transparent opacity-50"
							animate={{
								backgroundPosition: ["200% 0%", "0% 0%", "-200% 0%"],
							}}
							transition={{
								duration: 8,
								repeat: Number.POSITIVE_INFINITY,
								repeatType: "loop",
							}}
						/>
						<motion.div
							className="absolute left-[30%] h-[1px] w-[40%] bg-gradient-to-r from-transparent via-green-300 to-transparent"
							animate={{
								left: ["0%", "60%", "0%"],
								opacity: [0, 1, 0],
							}}
							transition={{
								duration: 4,
								repeat: Number.POSITIVE_INFINITY,
								repeatType: "loop",
							}}
						/>
					</div>

					<p className="mb-4 text-gray-400 text-sm">
						Want to go back to the main page?
					</p>

					{/* Ultra-cosmic back to home button */}
					<motion.div
						className="group relative inline-block"
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						<motion.a
							href="/"
							className="relative z-10 inline-flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-800 px-8 py-4 font-medium text-lg text-white transition-colors duration-300 group-hover:text-green-300"
						>
							<motion.span
								className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.15),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
								animate={{
									scale: [1, 1.2, 1],
								}}
								transition={{
									duration: 3,
									repeat: Number.POSITIVE_INFINITY,
									repeatType: "loop",
								}}
							/>

							{/* Animated border */}
							<motion.span
								className="absolute inset-0 rounded-xl border border-green-300/30 opacity-0 group-hover:opacity-100"
								animate={{
									boxShadow: [
										"0 0 0px rgba(52, 211, 153, 0)",
										"0 0 15px rgba(52, 211, 153, 0.3)",
										"0 0 0px rgba(52, 211, 153, 0)",
									],
								}}
								transition={{
									duration: 2,
									repeat: Number.POSITIVE_INFINITY,
									repeatType: "loop",
								}}
							/>

							{/* Animated particles */}
							{/* {[...Array(5)].map(() => {
								const particleKey =
									typeof crypto !== "undefined" && crypto.randomUUID
										? crypto.randomUUID()
										: Math.random().toString(36).substr(2, 9);
								return (
									<motion.span
										key={particleKey}
										className="absolute h-1 w-1 rounded-full bg-green-300/60"
										initial={{
											x: "50%",
											y: "50%",
											opacity: 0,
										}}
										animate={{
											x: `${50 + (Math.random() * 100 - 50)}%`,
											y: `${50 + (Math.random() * 100 - 50)}%`,
											opacity: [0, 0.8, 0],
											scale: [0, 1, 0],
										}}
										transition={{
											duration: 1 + Math.random() * 2,
											repeat: Number.POSITIVE_INFINITY,
											repeatDelay: Math.random() * 0.5,
											delay: Math.random() * 0.5,
										}}
									/>
								);
							})} */}

							<span className="relative z-10 flex items-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="mr-2 h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<title>Back to Home</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1.5}
										d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
									/>
								</svg>
								Back to Home
							</span>
						</motion.a>
					</motion.div>
				</motion.div>
			</div>
		</main>
	);
}
