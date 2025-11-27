"use client";

import { AnimatePresence, motion } from "framer-motion";
// import TransitionLink from "~/components/utils/TransitionLink";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { trackEvent, trackProjectView } from "~/utils/posthog";
import { projectList } from "./Projects";

interface ProjectCardsProps {
	activeCategory?: string;
}

export function ProjectCards({ activeCategory = "All" }: ProjectCardsProps) {
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const containerRef = useRef<HTMLDivElement>(null);

	// Filter projects based on active category
	const filteredProjects = projectList.filter((project) => {
		if (activeCategory === "All") return true;
		return project.technologies.includes(activeCategory);
	});

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (containerRef.current) {
				const rect = containerRef.current.getBoundingClientRect();
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

	// Track project card interaction (for posthog analytics)
	interface Project {
		title: string;
		link: string;
		description: string;
		technologies: string[];
		featured?: boolean;
	}

	const handleProjectClick = (project: Project) => {
		trackProjectView(project.title, project.link);
		trackEvent("project_card_click", {
			project_title: project.title,
			project_technologies: project.technologies,
			project_featured: project.featured || false,
			click_type: "external_link",
		});
	};
	// for posthog analytics
	const handleProjectHover = (project: Project) => {
		trackEvent("project_card_hover", {
			project_title: project.title,
			project_featured: project.featured || false,
		});
	};

	return (
		<div ref={containerRef} className="relative my-10 text-white">
			{/* Subtle background effect */}
			<div className="-z-10 absolute inset-0 overflow-hidden">
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.02),transparent_70%)]" />
			</div>

			<AnimatePresence mode="wait">
				{filteredProjects.length === 0 ? (
					<motion.div
						key="no-results"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.5 }}
						className="py-20 text-center"
					>
						<motion.div
							className="mb-4 inline-block text-green-300/50"
							animate={{
								rotate: [0, 5, 0, -5, 0],
							}}
							transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY }}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-12 w-12"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<title>Magnifying glass icon</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1}
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
						</motion.div>
						<h3 className="mb-2 font-medium text-white/80 text-xl">
							No projects found
						</h3>
						<p className="text-gray-400/70 text-sm">
							Try selecting a different category
						</p>
					</motion.div>
				) : (
					<motion.div
						key="results"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="grid grid-cols-1 gap-8"
					>
						{filteredProjects.map((project, index) => {
							const isHovered = hoveredIndex === index;

							// Safe container measurements to avoid undefined access
							const containerWidth = containerRef.current?.offsetWidth ?? 1;
							const containerHeight = containerRef.current?.offsetHeight ?? 1;
							const perProjectHeight =
								containerHeight / Math.max(filteredProjects.length, 1);

							let mouseXPercent = (mousePosition.x / containerWidth) * 100;
							let mouseYPercent = (mousePosition.y / perProjectHeight) * 100;

							// clamp to reasonable range and guard against NaN/Infinity
							mouseXPercent = Number.isFinite(mouseXPercent)
								? Math.max(0, Math.min(mouseXPercent, 100))
								: 0;
							mouseYPercent = Number.isFinite(mouseYPercent)
								? Math.max(0, Math.min(mouseYPercent, 100))
								: 0;

							return (
								<motion.div
									key={project.title}
									className="group relative cursor-pointer overflow-hidden rounded-lg border border-zinc-800/50"
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{
										duration: 0.5,
										delay: index * 0.1,
									}}
									onHoverStart={() => {
										setHoveredIndex(index);
										handleProjectHover(project); // for posthog analytics
									}}
									onHoverEnd={() => setHoveredIndex(null)}
									onClick={() => handleProjectClick(project)} // for posthog analytics
									whileHover={{
										y: -2,
										transition: { type: "spring", stiffness: 300, damping: 15 },
									}}
									layout
								>
									{/* Liquid gradient border effect */}
									<motion.div
										className="pointer-events-none absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100"
										initial={{ opacity: 0 }}
										animate={{ opacity: isHovered ? 1 : 0 }}
										transition={{ duration: 0.3 }}
									>
										{/* Liquid gradient that moves with mouse */}
										<svg className="absolute inset-0 h-full w-full">
											<title>Liquid gradient border effect</title>
											<defs>
												<linearGradient
													id={`gradient-${index}`}
													x1="0%"
													y1="0%"
													x2="100%"
													y2="100%"
												>
													<motion.stop
														offset="0%"
														animate={{
															stopColor: ["#10b981", "#86efac", "#10b981"],
															stopOpacity: [0.7, 1, 0.7],
														}}
														transition={{
															duration: 3,
															repeat: Number.POSITIVE_INFINITY,
														}}
													/>
													<motion.stop
														offset="50%"
														animate={{
															stopColor: ["#86efac", "#10b981", "#86efac"],
															stopOpacity: [1, 0.7, 1],
														}}
														transition={{
															duration: 3,
															repeat: Number.POSITIVE_INFINITY,
														}}
													/>
													<motion.stop
														offset="100%"
														animate={{
															stopColor: ["#10b981", "#86efac", "#10b981"],
															stopOpacity: [0.7, 1, 0.7],
														}}
														transition={{
															duration: 3,
															repeat: Number.POSITIVE_INFINITY,
														}}
													/>
												</linearGradient>
												<filter
													id={`glow-${index}`}
													x="-20%"
													y="-20%"
													width="140%"
													height="140%"
												>
													<feGaussianBlur stdDeviation="8" result="blur" />
													<feComposite
														in="SourceGraphic"
														in2="blur"
														operator="over"
													/>
												</filter>
											</defs>
											<motion.rect
												x="0"
												y="0"
												width="100%"
												height="100%"
												rx="8"
												fill="none"
												stroke={`url(#gradient-${index})`}
												strokeWidth="1.5"
												strokeDasharray="1 1"
												animate={{
													strokeDashoffset: [0, -10],
													filter: isHovered ? `url(#glow-${index})` : "none",
												}}
												transition={{
													strokeDashoffset: {
														duration: 5,
														repeat: Number.POSITIVE_INFINITY,
														ease: "linear",
													},
												}}
											/>
										</svg>
									</motion.div>

									{/* Magnetic liquid blob effect */}
									{isHovered && (
										<motion.div
											className="pointer-events-none absolute"
											initial={{ opacity: 0 }}
											animate={{
												opacity: 1,
												x: mousePosition.x - 100,
												y: mousePosition.y - 100,
											}}
											transition={{
												type: "spring",
												damping: 20,
												stiffness: 300,
												mass: 0.5,
											}}
											style={{
												width: 200,
												height: 200,
												filter: "blur(40px)",
												background:
													"radial-gradient(circle, rgba(134,239,172,0.15) 0%, transparent 70%)",
												zIndex: 0,
											}}
										/>
									)}

									{/* Content container with minimalist design */}
									<div className="relative z-10 bg-zinc-900/20 p-6 backdrop-blur-sm">
										<Link href={project.link} className="block">
											{/* Minimalist title with elegant underline effect */}
											<div className="overflow-hidden">
												<motion.h3
													className="inline-block font-medium text-xl"
													animate={{
														color: isHovered ? "#86efac" : "#ffffff",
													}}
													transition={{ duration: 0.3 }}
												>
													{project.title}
													{/* <motion.div
														className="mt-1 h-px bg-gradient-to-r from-green-300/0 via-green-300 to-green-300/0"
														initial={{ scaleX: 0 }}
														animate={{
															scaleX: isHovered ? 1 : 0,
														}}
														transition={{ duration: 0.6, ease: "easeOut" }}
													/> */}
												</motion.h3>
											</div>

											{/* Clean description with subtle animation */}
											<motion.p
												className="mt-3 text-gray-300/80 text-sm leading-relaxed"
												animate={{
													opacity: isHovered ? 1 : 0.7,
												}}
												transition={{ duration: 0.3 }}
											>
												{project.description}
											</motion.p>

											{/* Minimalist technology tags */}
											<div className="mt-4 flex flex-wrap gap-2">
												{project.technologies.map((tech, techIndex) => (
													<motion.span
														key={tech}
														className="rounded-full border px-2.5 py-0.5 text-xs"
														initial={{ opacity: 0, x: -5 }}
														animate={{
															opacity: 1,
															x: 0,
															borderColor:
																tech === activeCategory
																	? "rgba(134, 239, 172, 0.5)"
																	: isHovered
																		? "rgba(134, 239, 172, 0.3)"
																		: "rgba(39, 39, 42, 0.3)",
															color:
																tech === activeCategory
																	? "#86efac"
																	: isHovered
																		? "rgba(134, 239, 172, 0.9)"
																		: "#a1a1aa",
															backgroundColor: "transparent",
														}}
														transition={{
															duration: 0.3,
															delay: isHovered ? 0.1 + techIndex * 0.03 : 0,
														}}
													>
														{tech}
													</motion.span>
												))}
											</div>

											{/* Live and GitHub buttons - appear on hover */}
											<motion.div
												className="mt-5 flex gap-3 overflow-hidden"
												initial={{ height: 0, opacity: 0 }}
												animate={{
													height: isHovered ? "auto" : 0,
													opacity: isHovered ? 1 : 0,
												}}
												transition={{ duration: 0.3 }}
											>
												{/* Live Button */}
												<a
													href={project.link}
													target="_blank"
													rel="noopener noreferrer"
													onClick={(e) => {
														e.stopPropagation();
														handleProjectClick(project);
													}}
													className="inline-flex items-center gap-2 rounded-lg border border-zinc-700/50 bg-zinc-800/80 px-4 py-2 font-medium text-sm text-white transition-colors hover:border-zinc-600/50 hover:bg-zinc-700/80"
												>
													<svg
														className="h-4 w-4"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<title>External link icon</title>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
														/>
													</svg>
													Live
												</a>

												{/* GitHub Button */}
												<a
													href={
														project.link.includes("github.com")
															? project.link
															: `https://github.com/AnishSarkar22/${project.title.toLowerCase().replace(/\s+/g, "-")}`
													}
													target="_blank"
													rel="noopener noreferrer"
													onClick={(e) => {
														e.stopPropagation();
														trackEvent("project_card_click", {
															project_title: project.title,
															project_technologies: project.technologies,
															project_featured: project.featured || false,
															click_type: "github_link",
														});
													}}
													className="inline-flex items-center gap-2 rounded-lg border border-zinc-700/50 bg-zinc-800/80 px-4 py-2 font-medium text-sm text-white transition-colors hover:border-zinc-600/50 hover:bg-zinc-700/80"
												>
													<svg
														className="h-4 w-4"
														fill="currentColor"
														viewBox="0 0 24 24"
													>
														<title>GitHub icon</title>
														<path
															fillRule="evenodd"
															d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.197 22 16.425 22 12.017 22 6.484 17.522 2 12 2z"
															clipRule="evenodd"
														/>
													</svg>
													GitHub
												</a>
											</motion.div>
										</Link>
									</div>

									{/* Unique magnetic particles effect */}
									{isHovered && (
										<AnimatePresence>
											{[...Array(8)].map((_, i) => {
												const size = Math.random() * 3 + 1;
												const initialX = Math.random() * 100;
												const initialY = Math.random() * 100;

												return (
													<motion.div
														key={`${project.title}-magnetic-particle-${i}`}
														className="absolute rounded-full bg-green-300/80"
														initial={{
															opacity: 0,
															x: `${initialX}%`,
															y: `${initialY}%`,
															scale: 0,
														}}
														animate={{
															opacity: [0, 0.8, 0],
															scale: [0, 1, 0],
															x: [
																`${initialX}%`,
																`${mouseXPercent}%`,
																`${initialX}%`,
															],
															y: [
																`${initialY}%`,
																`${mouseYPercent}%`,
																`${initialY}%`,
															],
														}}
														exit={{ opacity: 0, scale: 0 }}
														transition={{
															duration: 2 + Math.random() * 2,
															ease: "easeInOut",
															repeat: Number.POSITIVE_INFINITY,
															repeatType: "loop",
														}}
														style={{
															width: `${size}px`,
															height: `${size}px`,
															boxShadow: "0 0 4px rgba(134,239,172,0.8)",
														}}
													/>
												);
											})}
										</AnimatePresence>
									)}

									{/* Unique hover interaction effect - liquid splash */}
									{isHovered && (
										<motion.div
											className="pointer-events-none absolute inset-0 overflow-hidden"
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											exit={{ opacity: 0 }}
										>
											<svg className="absolute inset-0 h-full w-full">
												<title>Liquid splash effect</title>
												<defs>
													<radialGradient
														id={`splash-${index}`}
														cx="50%"
														cy="50%"
														r="50%"
														fx="50%"
														fy="50%"
													>
														<stop
															offset="0%"
															stopColor="#86efac"
															stopOpacity="0.3"
														/>
														<stop
															offset="100%"
															stopColor="#86efac"
															stopOpacity="0"
														/>
													</radialGradient>
												</defs>
												<motion.circle
													cx={mousePosition.x}
													cy={mousePosition.y}
													r="10"
													fill={`url(#splash-${index})`}
													initial={{ scale: 0 }}
													animate={{
														scale: [0, 5],
														opacity: [0.7, 0],
													}}
													transition={{
														duration: 1,
														repeat: Number.POSITIVE_INFINITY,
														repeatDelay: 0.5,
													}}
												/>
											</svg>
										</motion.div>
									)}
								</motion.div>
							);
						})}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
