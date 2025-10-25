"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
// import TransitionLink from "~/components/utils/TransitionLink";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	basePath?: string;
	onPageChange?: (page: number) => void;
}

export default function Pagination({
	currentPage,
	totalPages,
	basePath = "",
	onPageChange,
}: PaginationProps) {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [hoveredPage, setHoveredPage] = useState<number | null>(null);
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const [isHoveringContainer, setIsHoveringContainer] = useState(false);
	const prefersReducedMotion = useReducedMotion();

	// Do not show pagination if there is only 1 page
	// if (totalPages <= 1) return null;

	// Handling when clicking on a page
	const handlePageClick = useCallback(
		(page: number, e: React.MouseEvent) => {
			if (onPageChange) {
				e.preventDefault(); // Prevent default Link behavior
				onPageChange(page);
			}
		},
		[onPageChange],
	);

	// Create URL for page
	const createPageUrl = useCallback(
		(pageNumber: number) => {
			// Input validation
			if (
				typeof pageNumber !== "number" ||
				Number.isNaN(pageNumber) ||
				pageNumber < 1 ||
				pageNumber > totalPages
			) {
				return `${basePath || pathname}`; // Returns the current URL if the parameter is invalid
			}

			// Make a copy of the current searchParams
			const params = new URLSearchParams(searchParams.toString());
			// Update or add page parameters
			params.set("page", pageNumber.toString());

			// Create new URL with cleaned parameters
			return `${basePath || pathname}?${params.toString()}`;
		},
		[pathname, searchParams, basePath, totalPages],
	);

	// Create array of pages to display - memoized to avoid recalculation
	const pageNumbers = useMemo(() => {
		const result = [];
		const maxPagesToShow = 5;

		if (totalPages <= maxPagesToShow) {
			// Show all pages if total pages are less than maxPagesToShow
			for (let i = 1; i <= totalPages; i++) {
				result.push(i);
			}
		} else {
			// Always show first page, last page and pages surrounding current page
			if (currentPage <= 3) {
				// If you are near the front page
				for (let i = 1; i <= 4; i++) {
					result.push(i);
				}
				result.push("...");
				result.push(totalPages);
			} else if (currentPage >= totalPages - 2) {
				// If you are near the end of the page
				result.push(1);
				result.push("...");
				for (let i = totalPages - 3; i <= totalPages; i++) {
					result.push(i);
				}
			} else {
				// Between the pages
				result.push(1);
				result.push("...");
				result.push(currentPage - 1);
				result.push(currentPage);
				result.push(currentPage + 1);
				result.push("...");
				result.push(totalPages);
			}
		}

		return result;
	}, [currentPage, totalPages]);

	// Optimized particle effect - only visible without reduced motion
	const ParticleEffect = useCallback(
		({ isActive }: { isActive: boolean }) => {
			if (prefersReducedMotion || !isActive) return null;

			// Reduce particle count for optimal performance
			const particleCount = 4;

			return (
				<AnimatePresence>
					{isActive &&
						[...Array(particleCount)].map(() => {
							const particleKey = `particle-${Math.random().toString(36).substr(2, 9)}-${Date.now()}`;
							return (
								<motion.div
									key={particleKey}
									className="absolute h-1 w-1 rounded-full bg-green-300/70"
									initial={{
										x: 0,
										y: 0,
										opacity: 0.7,
										scale: 0.5,
									}}
									animate={{
										x: [0, (Math.random() - 0.5) * 20],
										y: [0, (Math.random() - 0.5) * 20],
										opacity: 0,
										scale: [0.5, Math.random() * 0.3 + 0.3],
									}}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.6, ease: "easeOut" }}
								/>
							);
						})}
				</AnimatePresence>
			);
		},
		[prefersReducedMotion],
	);

	// Optimize mouse tracking
	const handleMouseMove = useCallback((e: React.MouseEvent) => {
		const rect = e.currentTarget.getBoundingClientRect();
		setMousePosition({
			x: e.clientX - rect.left,
			y: e.clientY - rect.top,
		});
	}, []);

	// Optimize hover handlers
	const handleMouseEnter = useCallback(() => setIsHoveringContainer(true), []);
	const handleMouseLeave = useCallback(() => setIsHoveringContainer(false), []);

	// Optimize page hover handlers
	const createPageHoverHandler = useCallback(
		(page: number | null) => () => {
			setHoveredPage(page);
		},
		[],
	);

	// Do not show pagination if there is only 1 page
	if (totalPages <= 1) return null;

	return (
		<nav
			className="mt-16 mb-12 flex justify-center"
			onMouseMove={handleMouseMove}
		>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="relative flex items-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-zinc-900/80 to-zinc-800/50 px-6 py-4 backdrop-blur-md"
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				whileHover={{ scale: prefersReducedMotion ? 1 : 1.02 }}
			>
				{/* Animated background gradient - simplified for performance */}
				{!prefersReducedMotion && (
					<motion.div
						className="-z-10 absolute inset-0 opacity-50"
						animate={{
							background: [
								"linear-gradient(45deg, rgba(39, 39, 42, 0.5) 0%, rgba(24, 24, 27, 0.5) 100%)",
								"linear-gradient(225deg, rgba(39, 39, 42, 0.5) 0%, rgba(24, 24, 27, 0.5) 100%)",
							],
						}}
						transition={{
							duration: 8,
							repeat: Number.POSITIVE_INFINITY,
							ease: "linear",
							repeatType: "reverse",
						}}
					/>
				)}

				{/* Animated border - only when not using reduced motion */}
				{!prefersReducedMotion && (
					<motion.div
						className="-z-5 absolute inset-0 rounded-xl"
						initial={{ opacity: 0 }}
						animate={{
							opacity: isHoveringContainer ? 1 : 0,
							boxShadow: isHoveringContainer
								? "inset 0 0 0 1px rgba(74, 222, 128, 0.2)"
								: "inset 0 0 0 1px rgba(74, 222, 128, 0)",
						}}
						transition={{ duration: 0.3 }}
					/>
				)}

				{/* Glow effect for container - only when not using reduced motion */}
				{!prefersReducedMotion && (
					<motion.div
						className="-z-10 absolute inset-0 rounded-xl"
						animate={{
							boxShadow:
								hoveredPage !== null
									? "0 0 20px rgba(52, 211, 153, 0.15), inset 0 0 15px rgba(52, 211, 153, 0.08)"
									: "0 0 0px rgba(0, 0, 0, 0)",
						}}
						transition={{ duration: 0.3 }}
					/>
				)}

				{/* Mouse follow glow effect - simplified and only when not using reduced motion */}
				{isHoveringContainer && !prefersReducedMotion && (
					<motion.div
						className="-z-5 pointer-events-none absolute h-32 w-32 rounded-full"
						style={{
							background:
								"radial-gradient(circle, rgba(74, 222, 128, 0.12) 0%, rgba(74, 222, 128, 0) 70%)",
							left: mousePosition.x - 64,
							top: mousePosition.y - 64,
						}}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.2 }}
					/>
				)}

				{/* Previous button */}
				{currentPage > 1 && (
					<Link
						href={onPageChange ? "#" : createPageUrl(currentPage - 1)}
						onClick={(e) => onPageChange && handlePageClick(currentPage - 1, e)}
						className="group relative"
						onMouseEnter={createPageHoverHandler(-1)}
						onMouseLeave={createPageHoverHandler(null)}
						aria-label="Previous page"
					>
						<motion.div
							className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg text-zinc-400 transition-all duration-300"
							whileHover={{
								color: "#4ade80",
								scale: prefersReducedMotion ? 1 : 1.1,
								y: prefersReducedMotion ? 0 : -2,
							}}
							whileTap={{ scale: 0.95, y: 0 }}
						>
							{/* Particle effect */}
							<ParticleEffect isActive={hoveredPage === -1} />

							{/* Hover background effect */}
							<motion.div
								className="absolute inset-0 rounded-lg bg-zinc-800/0"
								animate={{
									backgroundColor:
										hoveredPage === -1
											? "rgba(39, 39, 42, 0.7)"
											: "rgba(39, 39, 42, 0)",
									scale: hoveredPage === -1 ? 1 : 0.8,
								}}
								transition={{ duration: 0.2 }}
							/>

							{/* Glow ring - simplified */}
							{hoveredPage === -1 && !prefersReducedMotion && (
								<motion.div
									className="absolute inset-0 rounded-lg"
									initial={{ opacity: 0 }}
									animate={{
										opacity: 1,
										boxShadow:
											"0 0 10px rgba(74, 222, 128, 0.3), inset 0 0 5px rgba(74, 222, 128, 0.2)",
									}}
									transition={{ duration: 0.2 }}
								/>
							)}

							<motion.svg
								xmlns="http://www.w3.org/2000/svg"
								className="relative z-10 h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor"
								animate={{
									x: hoveredPage === -1 && !prefersReducedMotion ? [-3, 0] : 0,
								}}
								transition={{
									type: "spring",
									stiffness: 300,
									duration: 0.3,
								}}
							>
								<title>Previous page</title>
								<path
									fillRule="evenodd"
									d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
									clipRule="evenodd"
								/>
							</motion.svg>

							{/* Text label on hover - simplified */}
							{hoveredPage === -1 && !prefersReducedMotion && (
								<motion.span
									className="absolute whitespace-nowrap font-medium text-green-300 text-xs"
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 18 }}
									transition={{ duration: 0.2 }}
								>
									Previous
								</motion.span>
							)}
						</motion.div>
					</Link>
				)}

				{/* Page numbers */}
				<div className="flex items-center space-x-2">
					{pageNumbers.map((page, index) => {
						// Use a unique key: for numbers, use the page number; for ellipsis, use a string with index
						const key =
							typeof page === "number" ? `page-${page}` : `ellipsis-${index}`;
						return (
							<div key={key}>
								{page === "..." ? (
									<motion.span
										className="flex h-8 w-8 items-center justify-center text-sm text-zinc-500"
										animate={
											prefersReducedMotion
												? {}
												: {
														y: [0, -1, 0],
													}
										}
										transition={{
											duration: 2,
											repeat: Number.POSITIVE_INFINITY,
											repeatDelay: 1,
										}}
									>
										•••
									</motion.span>
								) : (
									<Link
										href={onPageChange ? "#" : createPageUrl(page as number)}
										onClick={(e) =>
											onPageChange && handlePageClick(page as number, e)
										}
										onMouseEnter={createPageHoverHandler(page as number)}
										onMouseLeave={createPageHoverHandler(null)}
										className="relative"
										aria-label={`Page ${page}`}
										aria-current={currentPage === page ? "page" : undefined}
									>
										<motion.div
											className={`relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg font-medium text-sm transition-all duration-300 ${
												currentPage === page
													? "text-green-300"
													: "text-zinc-400"
											}`}
											whileHover={{
												color: "#4ade80",
												scale: prefersReducedMotion ? 1 : 1.1,
												y: prefersReducedMotion ? 0 : -2,
											}}
											whileTap={{ scale: 0.95, y: 0 }}
										>
											{/* Particle effect */}
											<ParticleEffect isActive={hoveredPage === page} />

											{/* Active page background - simplified */}
											{currentPage === page && !prefersReducedMotion && (
												<motion.div
													className="absolute inset-0 rounded-lg bg-green-500/20"
													animate={{
														boxShadow:
															"0 0 10px rgba(74, 222, 128, 0.3), inset 0 0 5px rgba(74, 222, 128, 0.2)",
													}}
												/>
											)}

											{/* Hover background effect */}
											<motion.div
												className="absolute inset-0 rounded-lg bg-zinc-800/0"
												animate={{
													backgroundColor:
														hoveredPage === page
															? "rgba(39, 39, 42, 0.7)"
															: "rgba(39, 39, 42, 0)",
													scale: hoveredPage === page ? 1 : 0.8,
												}}
												transition={{ duration: 0.2 }}
											/>

											{/* Glow ring - simplified */}
											{hoveredPage === page && !prefersReducedMotion && (
												<motion.div
													className="absolute inset-0 rounded-lg"
													initial={{ opacity: 0 }}
													animate={{
														opacity: 1,
														boxShadow:
															"0 0 10px rgba(74, 222, 128, 0.3), inset 0 0 5px rgba(74, 222, 128, 0.2)",
													}}
													transition={{ duration: 0.2 }}
												/>
											)}

											{/* Number */}
											<span className="relative z-10">{page}</span>
										</motion.div>
									</Link>
								)}
							</div>
						);
					})}
				</div>

				{/* Next button */}
				{currentPage < totalPages && (
					<Link
						href={onPageChange ? "#" : createPageUrl(currentPage + 1)}
						onClick={(e) => onPageChange && handlePageClick(currentPage + 1, e)}
						className="group relative"
						onMouseEnter={createPageHoverHandler(-2)}
						onMouseLeave={createPageHoverHandler(null)}
						aria-label="Next page"
					>
						<motion.div
							className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg text-zinc-400 transition-all duration-300"
							whileHover={{
								color: "#4ade80",
								scale: prefersReducedMotion ? 1 : 1.1,
								y: prefersReducedMotion ? 0 : -2,
							}}
							whileTap={{ scale: 0.95, y: 0 }}
						>
							{/* Particle effect */}
							<ParticleEffect isActive={hoveredPage === -2} />

							{/* Hover background effect */}
							<motion.div
								className="absolute inset-0 rounded-lg bg-zinc-800/0"
								animate={{
									backgroundColor:
										hoveredPage === -2
											? "rgba(39, 39, 42, 0.7)"
											: "rgba(39, 39, 42, 0)",
									scale: hoveredPage === -2 ? 1 : 0.8,
								}}
								transition={{ duration: 0.2 }}
							/>

							{/* Glow ring - simplified */}
							{hoveredPage === -2 && !prefersReducedMotion && (
								<motion.div
									className="absolute inset-0 rounded-lg"
									initial={{ opacity: 0 }}
									animate={{
										opacity: 1,
										boxShadow:
											"0 0 10px rgba(74, 222, 128, 0.3), inset 0 0 5px rgba(74, 222, 128, 0.2)",
									}}
									transition={{ duration: 0.2 }}
								/>
							)}

							<motion.svg
								xmlns="http://www.w3.org/2000/svg"
								className="relative z-10 h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor"
								animate={{
									x: hoveredPage === -2 && !prefersReducedMotion ? [3, 0] : 0,
								}}
								transition={{
									type: "spring",
									stiffness: 300,
									duration: 0.3,
								}}
							>
								<title>Next page</title>
								<path
									fillRule="evenodd"
									d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
									clipRule="evenodd"
								/>
							</motion.svg>

							{/* Text label on hover - simplified */}
							{hoveredPage === -2 && !prefersReducedMotion && (
								<motion.span
									className="absolute whitespace-nowrap font-medium text-green-300 text-xs"
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 18 }}
									transition={{ duration: 0.2 }}
								>
									Next
								</motion.span>
							)}
						</motion.div>
					</Link>
				)}
			</motion.div>
		</nav>
	);
}
