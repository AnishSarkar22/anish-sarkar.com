"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ProjectCards } from "~/components/ProjectCards";
import { projectList } from "~/components/Projects";

export default function Projects() {
	const [_mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const [activeCategory, setActiveCategory] = useState("All");
	const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
	const mainRef = useRef<HTMLDivElement>(null);

	// const techList = [
	// 	"Appwrite",
	// 	"Docker",
	// 	"Flask",
	// 	"Matplotlib",
	// 	"NumPy",
	// 	"Pandas",
	// 	"PyTorch",
	// 	"Python",
	// 	"React",
	// 	"Svelte",
	// 	"Sveltekit",
	// 	"SQLite",
	// 	"Streamlit",
	// 	"TypeScript",
	// 	"scikit-learn",
	// 	"Java",
	// 	"JavaScript",
	// 	"Nginx",
	// 	"HTML",
	// 	"JUnit",
	// 	"netty-socketio",
	// ];

	// // Extract unique categories from projects
	// const categories = [
	// 	"All",
	// 	...Array.from(
	// 		new Set(
	// 			projectList
	// 				.flatMap((project) => project.technologies)
	// 				.filter((tech) => techList.includes(tech)),
	// 		),
	// 	).sort(),
	// ];

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

	return (
		<main
			ref={mainRef}
			className="relative mx-auto min-h-screen max-w-4xl overflow-hidden p-8 text-white md:p-16 lg:p-24"
		>
			{/* Enhanced cosmic background elements */}
			<div className="-z-10 pointer-events-none fixed inset-0 bg-black">
				<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(50,50,50,0.1),rgba(0,0,0,0)_50%)]" />

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
					className="pointer-events-none absolute bottom-0 left-0 h-1 w-full"
					style={{
						background:
							"linear-gradient(to right, transparent, rgba(52, 211, 153, 0.2), transparent)",
					}}
					animate={{
						scaleX: [0, 1, 0],
						opacity: [0, 0.3, 0],
						x: ["100%", "0%", "-100%"],
					}}
					transition={{
						duration: 12,
						repeat: Number.POSITIVE_INFINITY,
						ease: "easeInOut",
					}}
				/>
			</div>

			<div className="relative z-10 flex-1">
				{/* Ultra-enhanced header with animated styling */}
				<motion.div
					// initial={{ opacity: 0, y: -20 }}
					// animate={{ opacity: 1, y: 0 }}
					// transition={{ duration: 0.6 }}
					className="mb-16"
				>
					<motion.h1
						className="relative mb-2 inline-block font-bold text-5xl"
						whileHover={{ scale: 1.03 }}
						transition={{ type: "spring", stiffness: 400, damping: 10 }}
					>
						<span className="inline-block text-green-300 will-change-transform">
							&gt;
						</span>{" "}
						<span className="animate-shimmer bg-[length:200%_100%] bg-gradient-to-r from-white via-green-200 to-white bg-clip-text text-transparent">
							projects
						</span>
					</motion.h1>
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 0.7 }}
						transition={{ delay: 0.7 }}
						className="mt-3 max-w-xl text-gray-400"
					>
						a showcase of my creative work, experiments, and technical
						explorations
					</motion.p>
				</motion.div>

				{/* Ultra-enhanced animated filter tabs with cosmic effects */}
				{/* <motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.4 }}
					className="relative mb-12 flex flex-wrap gap-3"
				>
					{categories.map((category, _index) => (
						<motion.button
							key={category}
							onClick={() => setActiveCategory(category)}
							onMouseEnter={() => setHoveredCategory(category)}
							onMouseLeave={() => setHoveredCategory(null)}
							className={
								"relative overflow-hidden rounded-full px-4 py-2 font-medium text-sm transition-all duration-300"
							}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							// transition={{ delay: 0.5 + index * 0.1 }}
						>
							<motion.div
								className="-z-10 absolute inset-0 rounded-full"
								animate={{
									backgroundColor:
										category === activeCategory
											? "rgba(52, 211, 153, 0.2)"
											: "rgba(39, 39, 42, 0.5)",
									borderColor:
										category === activeCategory
											? "rgba(52, 211, 153, 0.3)"
											: "rgba(82, 82, 91, 0.5)",
								}}
								style={{
									border: "1px solid",
								}}
								transition={{ duration: 0.3 }}
							/>

							{hoveredCategory === category && category !== activeCategory && (
								<motion.div
									className="-z-10 absolute inset-0 rounded-full bg-green-300/10 opacity-0"
									initial={{ opacity: 0, scale: 0.8 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 1.2 }}
									transition={{ duration: 0.2 }}
								/>
							)}
							<motion.span
								animate={{
									color: category === activeCategory ? "#86efac" : "#a1a1aa",
									textShadow:
										category === activeCategory
											? "0 0 8px rgba(134, 239, 172, 0.5)"
											: "none",
								}}
								transition={{ duration: 0.3 }}
							>
								{category}
							</motion.span>
						</motion.button>
					))}
				</motion.div> */}

				{/* Project cards with enhanced container and filtering */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.6 }}
					className="relative"
				>
					{/* Pass the active category to ProjectCards */}
					<ProjectCards activeCategory={activeCategory} />

					{/* Cosmic light rays */}
				</motion.div>
			</div>
		</main>
	);
}
