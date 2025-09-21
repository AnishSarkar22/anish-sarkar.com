"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const getPhotos = () => {
	return [
		{
			id: "photo1",
			src: "/photos/photo_1.jpg",
			alt: "Photo 1",
			category: "Landscape",
			date: "2023-01-01",
		},
		{
			id: "photo2",
			src: "/photos/photo_2.jpg",
			alt: "Photo 2",
			category: "Street",
			date: "2023-01-05",
		},
	];
};

// Date format function according to dd/mm/yyyy
const formatDate = (dateString: string) => {
	const date = new Date(dateString);
	return date.toLocaleDateString("vi-VN", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});
};

export default function PhotosClient() {
	const [activeCategory, setActiveCategory] = useState("All");
	const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
	const [hoveredPhoto, setHoveredPhoto] = useState<string | null>(null);
	const [isLoaded, setIsLoaded] = useState<{ [key: string]: boolean }>({});
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const [isChangingCategory, setIsChangingCategory] = useState(false);
	const mainRef = useRef<HTMLDivElement>(null);

	// Memoize image list to avoid recreating each render
	const photos = useMemo(() => getPhotos(), []);

	// Get category list from image
	const categories = useMemo(
		() => [
			"All",
			...Array.from(new Set(photos.map((photo) => photo.category))),
		],
		[photos],
	);

	// Filter photos by category
	const filteredPhotos = useMemo(
		() =>
			activeCategory === "All"
				? photos
				: photos.filter((photo) => photo.category === activeCategory),
		[activeCategory, photos],
	);

	// Process when image is loaded
	const handleImageLoaded = useCallback((id: string) => {
		setIsLoaded((prev) => ({ ...prev, [id]: true }));
	}, []);

	// Handling when switching categories
	const handleCategoryChange = useCallback(
		(category: string) => {
			if (category !== activeCategory) {
				setIsChangingCategory(true);
				setTimeout(() => {
					setActiveCategory(category);
					setTimeout(() => {
						setIsChangingCategory(false);
					}, 100);
				}, 300);
			}
		},
		[activeCategory],
	);

	// Mouse position tracking - scroll fix
	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			// Only update mouse position when the user actually moves the mouse
			// not when scrolling
			if (mainRef.current) {
				const rect = mainRef.current.getBoundingClientRect();

				// Save previous mouse position
				const prevPosition = { ...mousePosition };
				const newPosition = {
					x: e.clientX - rect.left,
					y: e.clientY - rect.top,
				};

				// Only update state if location changes significantly
				// This helps avoid unnecessary re-rendering
				if (
					Math.abs(prevPosition.x - newPosition.x) > 5 ||
					Math.abs(prevPosition.y - newPosition.y) > 5
				) {
					setMousePosition(newPosition);
				}
			}
		};

		// Use throttle to reduce the number of calls to handleMouseMove
		let throttleTimer: number | null = null;
		const throttledMouseMove = (e: MouseEvent) => {
			if (!throttleTimer) {
				throttleTimer = window.setTimeout(() => {
					handleMouseMove(e);
					throttleTimer = null;
				}, 50); // Only process up to 20 times/second
			}
		};

		window.addEventListener("mousemove", throttledMouseMove);

		return () => {
			window.removeEventListener("mousemove", throttledMouseMove);
			if (throttleTimer) window.clearTimeout(throttleTimer);
		};
	}, [mousePosition]);

	// Prevent unwanted scroll effects
	useEffect(() => {
		// Save current scroll position
		let lastScrollPosition = window.scrollY;

		const handleScroll = () => {
			// Do not perform any action while scrolling
			// Update only the last scroll position
			lastScrollPosition = window.scrollY;
		};

		window.addEventListener("scroll", handleScroll, { passive: true });

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<main
			ref={mainRef}
			className="relative mx-auto min-h-screen max-w-7xl overflow-hidden p-8 text-white md:p-16 lg:p-24"
		>
			{/* Enhanced cosmic background elements */}
			<div className="-z-10 pointer-events-none fixed inset-0 bg-black">
				<div className="pointer-events-none absolute inset-0 bg-black" />

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

				<motion.div
					className="pointer-events-none absolute right-0 bottom-0 h-full w-1"
					style={{
						background:
							"linear-gradient(to top, transparent, rgba(52, 211, 153, 0.2), transparent)",
					}}
					animate={{
						scaleY: [0, 1, 0],
						opacity: [0, 0.3, 0],
						y: ["100%", "0%", "-100%"],
					}}
					transition={{
						duration: 10,
						repeat: Number.POSITIVE_INFINITY,
						ease: "easeInOut",
						delay: 1,
					}}
				/>

				{/* Animated particles */}
				{[...Array(15)].map(() => {
					const particleKey = `particle-${crypto.randomUUID()}`;
					return (
						<motion.div
							key={particleKey}
							className="pointer-events-none absolute h-1 w-1 rounded-full bg-green-300/30"
							style={{
								left: `${Math.random() * 100}%`,
								top: `${Math.random() * 100}%`,
							}}
							animate={{
								opacity: [0, 0.8, 0],
								scale: [0, 1, 0.5],
								y: [0, -Math.random() * 100],
								x: [0, (Math.random() - 0.5) * 50],
							}}
							transition={{
								duration: 5 + Math.random() * 10,
								repeat: Number.POSITIVE_INFINITY,
								delay: Math.random() * 5,
								ease: "easeInOut",
							}}
						/>
					);
				})}

				{/* Reactive glow effect that follows mouse - fix to avoid reflow */}
				<motion.div
					className="-z-10 pointer-events-none absolute h-[500px] w-[500px] rounded-full opacity-20"
					style={{
						background:
							"radial-gradient(circle, rgba(52, 211, 153, 0.15) 0%, transparent 70%)",
						left: mousePosition.x - 250,
						top: mousePosition.y - 250,
						filter: "blur(50px)",
						willChange: "transform", // Optimize performance
						transform: "translateZ(0)", // Enable GPU acceleration
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
						// className="text-5xl font-bold mb-2 relative inline-block"
						// whileHover={{ scale: 1.03 }}
						// transition={{ type: "spring", stiffness: 400, damping: 10 }}
					>
						<span className="inline-block text-green-300 will-change-transform">
							&gt;
						</span>{" "}
						<span className="relative">
							photos
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
						My collection of photos, capturing special moments and interesting
						perspectives.
					</motion.p>
				</motion.div>

				{/* Categories with smooth transition effects */}
				<motion.div
					className="mb-10 flex flex-wrap gap-3"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.4 }}
				>
					{categories.map((category) => (
						<motion.button
							key={category}
							className={`relative overflow-hidden rounded-full px-4 py-2 font-medium text-sm transition-all duration-300 ${
								activeCategory === category
									? "border border-green-500/30 bg-green-500/20 text-green-300"
									: "border border-zinc-700/50 bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300"
							}`}
							onClick={() => handleCategoryChange(category)}
							onMouseEnter={() => setHoveredCategory(category)}
							onMouseLeave={() => setHoveredCategory(null)}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							layout
						>
							{/* Ripple effect on click */}
							<motion.span
								className="absolute inset-0 rounded-full bg-green-400/10"
								initial={{ scale: 0, opacity: 0 }}
								whileTap={{ scale: 1.5, opacity: 1 }}
								transition={{ duration: 0.5 }}
							/>

							{/* Category content */}
							<span className="relative z-10">{category}</span>

							{/* Highlight effect on hover */}
							{hoveredCategory === category && (
								<motion.span
									layoutId="categoryHighlight"
									className="absolute inset-0 rounded-full bg-green-500/10"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.2 }}
								/>
							)}

							{/* Glow effect when active */}
							{activeCategory === category && (
								<motion.span
									className="absolute inset-0 rounded-full"
									initial={{ boxShadow: "0 0 0 rgba(52, 211, 153, 0)" }}
									animate={{
										boxShadow: [
											"0 0 0px rgba(52, 211, 153, 0)",
											"0 0 10px rgba(52, 211, 153, 0.3)",
											"0 0 5px rgba(52, 211, 153, 0.2)",
										],
									}}
									transition={{
										duration: 2,
										repeat: Number.POSITIVE_INFINITY,
										repeatType: "reverse",
									}}
								/>
							)}
						</motion.button>
					))}
				</motion.div>

				{/* Photo grid with smooth category transition effect */}
				<AnimatePresence mode="wait">
					<motion.div
						key={activeCategory}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={{ duration: 0.4 }}
						className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
						style={{
							willChange: "transform", // Optimize performance
							transform: "translateZ(0)", // Enable GPU acceleration
						}}
					>
						{filteredPhotos.map((photo, index) => (
							<motion.div
								key={photo.id}
								className="group relative overflow-hidden rounded-lg"
								initial={{ opacity: 0, scale: 0.9, y: 20 }}
								animate={{
									opacity: 1,
									scale: 1,
									y: 0,
									transition: {
										type: "spring",
										stiffness: 300,
										damping: 25,
										delay: index * 0.05, // Stagger effect for photos
									},
								}}
								exit={{
									opacity: 0,
									scale: 0.9,
									y: -20,
									transition: { duration: 0.2 },
								}}
								whileHover={{
									scale: 1.03,
									boxShadow: "0 0 25px rgba(52, 211, 153, 0.3)",
								}}
								onMouseEnter={() => setHoveredPhoto(photo.id)}
								onMouseLeave={() => setHoveredPhoto(null)}
								layout
							>
								<div className="relative aspect-[4/3] overflow-hidden rounded-lg">
									{/* Shimmer effect while loading */}
									{!isLoaded[photo.id] && (
										<div className="absolute inset-0 overflow-hidden rounded-lg bg-zinc-800">
											<motion.div
												className="absolute inset-0 h-full w-full"
												style={{
													background:
														"linear-gradient(90deg, transparent, rgba(52, 211, 153, 0.1), transparent)",
												}}
												animate={{ x: ["-100%", "100%"] }}
												transition={{
													repeat: Number.POSITIVE_INFINITY,
													duration: 1.5,
													ease: "linear",
												}}
											/>
										</div>
									)}

									<motion.div
										initial={{ opacity: 0, scale: 1.1 }}
										animate={{
											opacity: isLoaded[photo.id] ? 1 : 0,
											scale: isLoaded[photo.id] ? 1 : 1.1,
											transition: { duration: 0.5, ease: "easeOut" },
										}}
									>
										<Image
											src={photo.src}
											alt={photo.alt}
											fill
											className="rounded-lg object-cover transition-all duration-700"
											onLoad={() => handleImageLoaded(photo.id)}
											priority={index < 9} // Priority first 9 photos
											sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
											quality={90}
											loading={index < 9 ? "eager" : "lazy"}
											style={{
												transform:
													hoveredPhoto === photo.id ? "scale(1.1)" : "scale(1)",
												transition:
													"transform 0.7s cubic-bezier(0.33, 1, 0.68, 1)",
											}}
										/>
									</motion.div>

									{/* Overlay information with improved effects */}
									<motion.div
										className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4"
										initial={{ opacity: 0 }}
										animate={{
											opacity: hoveredPhoto === photo.id ? 1 : 0,
											transition: { duration: 0.3 },
										}}
									>
										<div className="flex items-end justify-between">
											<motion.span
												className="rounded-full border border-green-500/20 bg-black/60 px-2 py-1 font-medium text-green-300 text-xs backdrop-blur-sm"
												initial={{ y: 20, opacity: 0 }}
												animate={{
													y: hoveredPhoto === photo.id ? 0 : 20,
													opacity: hoveredPhoto === photo.id ? 1 : 0,
												}}
												transition={{ delay: 0.1, duration: 0.3 }}
											>
												{photo.category}
											</motion.span>
											<motion.span
												className="rounded-full bg-black/40 px-2 py-1 text-xs text-zinc-300 backdrop-blur-sm"
												initial={{ y: 20, opacity: 0 }}
												animate={{
													y: hoveredPhoto === photo.id ? 0 : 20,
													opacity: hoveredPhoto === photo.id ? 1 : 0,
												}}
												transition={{ delay: 0.2, duration: 0.3 }}
											>
												{formatDate(photo.date)}
											</motion.span>
										</div>
									</motion.div>
								</div>
							</motion.div>
						))}
					</motion.div>
				</AnimatePresence>

				{/* Show message when there are no photos in the catalog */}
				{filteredPhotos.length === 0 && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5 }}
						className="flex flex-col items-center justify-center py-20"
					>
						<motion.div
							className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800/50"
							animate={{
								scale: [1, 1.05, 1],
								opacity: [0.7, 1, 0.7],
							}}
							transition={{
								duration: 2,
								repeat: Number.POSITIVE_INFINITY,
								repeatType: "reverse",
							}}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-8 w-8 text-green-300/70"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<title>No photos available</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1.5}
									d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</svg>
						</motion.div>
						<p className="text-center text-zinc-400">
							There are no photos in this category.
						</p>
					</motion.div>
				)}
			</div>
		</main>
	);
}
