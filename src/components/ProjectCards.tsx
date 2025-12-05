"use client";

import { AnimatePresence, motion } from "framer-motion";
// import TransitionLink from "~/components/utils/TransitionLink";
import { useRef, useState } from "react";
import { trackEvent, trackProjectView } from "~/utils/posthog";
import { projectList } from "./Projects";

interface ProjectCardsProps {
	activeCategory?: string;
}

export function ProjectCards({ activeCategory = "All" }: ProjectCardsProps) {
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	// Filter projects based on active category
	const filteredProjects = projectList.filter((project) => {
		if (activeCategory === "All") return true;
		return project.technologies.includes(activeCategory);
	});

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

							return (
								<motion.div
									key={project.title}
									className="group relative overflow-hidden rounded-lg border border-zinc-800/50"
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

									{/* Content container with minimalist design */}
									<div className="relative z-10 bg-zinc-900/20 p-6 backdrop-blur-sm">
										{/* Live and GitHub buttons - always visible in top right */}
										<div className="absolute top-4 right-4 z-20 flex gap-2.5">
											{/* Live Button */}
											<a
												href={project.link}
												target="_blank"
												rel="noopener noreferrer"
												onClick={(e) => {
													e.stopPropagation();
													handleProjectClick(project);
												}}
												className="group/btn relative inline-flex items-center gap-2 rounded-full border border-zinc-700/40 bg-zinc-900/60 px-3 py-2.5 font-medium text-white text-xs shadow-black/30 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-green-400/60 hover:bg-zinc-800/80 hover:shadow-green-400/20 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:ring-offset-2 focus:ring-offset-zinc-900 active:scale-95 md:px-4 md:py-2.5 md:text-sm"
												aria-label="View live project"
											>
												{/* Glow effect on hover */}
												<div className="absolute inset-0 rounded-full bg-green-400/20 opacity-0 blur-xl transition-opacity duration-300 group-hover/btn:opacity-100" />

												<svg
													className="group-hover/btn:-translate-y-0.5 h-4 w-4 flex-shrink-0 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:text-green-400 md:h-[18px] md:w-[18px]"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<title>External link icon</title>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M12 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6m-7 1l9-9m-5 0h5v5"
													/>
												</svg>
												<span className="hidden whitespace-nowrap transition-colors duration-300 group-hover/btn:text-green-400 md:inline">
													Live
												</span>
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
												className="group/btn relative inline-flex items-center gap-2 rounded-full border border-zinc-700/40 bg-zinc-900/60 px-3 py-2.5 font-medium text-white text-xs shadow-black/30 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-green-400/60 hover:bg-zinc-800/80 hover:shadow-green-400/20 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:ring-offset-2 focus:ring-offset-zinc-900 active:scale-95 md:px-4 md:py-2.5 md:text-sm"
												aria-label="View project on GitHub"
											>
												{/* Glow effect on hover */}
												<div className="absolute inset-0 rounded-full bg-green-400/20 opacity-0 blur-xl transition-opacity duration-300 group-hover/btn:opacity-100" />

												<svg
													className="h-4 w-4 flex-shrink-0 transition-transform duration-300 group-hover/btn:rotate-12 group-hover/btn:text-green-400 md:h-[18px] md:w-[18px]"
													fill="none"
													stroke="currentColor"
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													viewBox="0 0 24 24"
												>
													<title>GitHub icon</title>
													<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2c2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2a4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6c-.6.6-.6 1.2-.5 2V21" />
												</svg>
												<span className="hidden whitespace-nowrap transition-colors duration-300 group-hover/btn:text-green-400 md:inline">
													GitHub
												</span>
											</a>
										</div>

										<div className="block">
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
												</motion.h3>
											</div>

											{/* Clean description with subtle animation */}
											<p className="mt-3 text-gray-300/80 text-sm leading-relaxed">
												{project.description}
											</p>

											{/* Minimalist technology tags */}
											<div className="mt-4 flex flex-wrap gap-2">
												{project.technologies.map((tech) => (
													<span
														key={tech}
														className={`rounded-full border px-2.5 py-0.5 text-xs ${
															tech === activeCategory
																? "border-green-400/50 text-green-400"
																: "border-zinc-800/30 text-zinc-400"
														}`}
													>
														{tech}
													</span>
												))}
											</div>
										</div>
									</div>
								</motion.div>
							);
						})}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
