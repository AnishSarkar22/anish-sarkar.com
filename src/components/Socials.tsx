"use client";

import { AnimatePresence, motion } from "framer-motion";
import type React from "react";
import { useEffect, useId, useState } from "react";
import { trackSocialClick } from "~/utils/posthog";

const socials = [
	{
		title: "github",
		username: "@AnishSarkar22",
		link: "https://github.com/AnishSarkar22",
		icon: (props: React.SVGProps<SVGSVGElement> & { clipId?: string }) => (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width={props.size || 24}
				height={props.size || 24}
				viewBox="0 0 24 24"
				{...props}
			>
				<title>GitHub icon</title>
				<g fill="none">
					<g clipPath="url(#akarIconsGithubFill0)">
						<path
							fill="currentColor"
							fillRule="evenodd"
							d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385c.6.105.825-.255.825-.57c0-.285-.015-1.23-.015-2.235c-3.015.555-3.795-.735-4.035-1.41c-.135-.345-.72-1.41-1.23-1.695c-.42-.225-1.02-.78-.015-.795c.945-.015 1.62.87 1.845 1.23c1.08 1.815 2.805 1.305 3.495.99c.105-.78.42-1.305.765-1.605c-2.67-.3-5.46-1.335-5.46-5.925c0-1.305.465-2.385 1.23-3.225c-.12-.3-.54-1.53.12-3.18c0 0 1.005-.315 3.3 1.23c.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23c.66 1.65.24 2.88.12 3.18c.765.84 1.23 1.905 1.23 3.225c0 4.605-2.805 5.625-5.475 5.925c.435.375.81 1.095.81 2.22c0 1.605-.015 2.895-.015 3.3c0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12"
							clipRule="evenodd"
						/>
					</g>
					<defs>
						<clipPath id={props.clipId ?? "akarIconsGithubFill0"}>
							<path fill="#fff" d="M0 0h24v24H0z" />
						</clipPath>
					</defs>
				</g>
			</svg>
		),
		color: "#808080",
	},
	{
		title: "LinkedIn",
		username: "@anishsarkar22",
		link: "https://www.linkedin.com/in/anishsarkar22/",
		icon: (props: React.SVGProps<SVGSVGElement>) => (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width={props.size || 24}
				height={props.size || 24}
				viewBox="0 0 24 24"
				{...props}
			>
				<title>LinkedIn icon</title>
				<path
					fill="currentColor"
					fillRule="evenodd"
					d="M4.5 9.5H4c-.943 0-1.414 0-1.707.293S2 10.557 2 11.5V20c0 .943 0 1.414.293 1.707S3.057 22 4 22h.5c.943 0 1.414 0 1.707-.293S6.5 20.943 6.5 20v-8.5c0-.943 0-1.414-.293-1.707S5.443 9.5 4.5 9.5m2-5.25a2.25 2.25 0 1 1-4.5 0a2.25 2.25 0 0 1 4.5 0m5.826 5.25H11.5c-.943 0-1.414 0-1.707.293S9.5 10.557 9.5 11.5V20c0 .943 0 1.414.293 1.707S10.557 22 11.5 22h.5c.943 0 1.414 0 1.707-.293S14 20.943 14 20v-3.5c0-1.657.528-3 2.088-3c.78 0 1.412.672 1.412 1.5v4.5c0 .943 0 1.414.293 1.707s.764.293 1.707.293h.499c.942 0 1.414 0 1.707-.293c.292-.293.293-.764.293-1.706L22 14c0-2.486-2.364-4.5-4.703-4.5c-1.332 0-2.52.652-3.297 1.673c0-.63 0-.945-.137-1.179a1 1 0 0 0-.358-.358c-.234-.137-.549-.137-1.179-.137"
				/>
			</svg>
		),
		color: "#0077b5",
	},
	{
		title: "Instagram",
		username: "anishsarkar22",
		link: "https://www.instagram.com/anishsarkar22",
		icon: (props: React.SVGProps<SVGSVGElement>) => (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width={props.size || 24}
				height={props.size || 24}
				viewBox="0 0 24 24"
				{...props}
			>
				<title>Instagram icon</title>
				<path
					fill="currentColor"
					fillRule="evenodd"
					strokeWidth={1.5}
					d="M7.465 1.066C8.638 1.012 9.012 1 12 1s3.362.013 4.534.066s1.972.24 2.672.511c.733.277 1.398.71 1.948 1.27c.56.549.992 1.213 1.268 1.947c.272.7.458 1.5.512 2.67C22.988 8.639 23 9.013 23 12s-.013 3.362-.066 4.535c-.053 1.17-.24 1.97-.512 2.67a5.4 5.4 0 0 1-1.268 1.949c-.55.56-1.215.992-1.948 1.268c-.7.272-1.5.458-2.67.512c-1.174.054-1.548.066-4.536.066s-3.362-.013-4.535-.066c-1.17-.053-1.97-.24-2.67-.512a5.4 5.4 0 0 1-1.949-1.268a5.4 5.4 0 0 1-1.269-1.948c-.271-.7-.457-1.5-.511-2.67C1.012 15.361 1 14.987 1 12s.013-3.362.066-4.534s.24-1.972.511-2.672a5.4 5.4 0 0 1 1.27-1.948a5.4 5.4 0 0 1 1.947-1.269c.7-.271 1.5-.457 2.67-.511m8.98 1.98c-1.16-.053-1.508-.064-4.445-.064s-3.285.011-4.445.064c-1.073.049-1.655.228-2.043.379c-.513.2-.88.437-1.265.822a3.4 3.4 0 0 0-.822 1.265c-.151.388-.33.97-.379 2.043c-.053 1.16-.064 1.508-.064 4.445s.011 3.285.064 4.445c.049 1.073.228 1.655.379 2.043c.176.477.457.91.822 1.265c.355.365.788.646 1.265.822c.388.151.97.33 2.043.379c1.16.053 1.507.064 4.445.064s3.285-.011 4.445-.064c1.073-.049 1.655-.228 2.043-.379c.513-.2.88-.437 1.265-.822c.365-.355.646-.788.822-1.265c.151-.388.33-.97.379-2.043c.053-1.16.064-1.508.064-4.445s-.011-3.285-.064-4.445c-.049-1.073-.228-1.655-.379-2.043c-.2-.513-.437-.88-.822-1.265a3.4 3.4 0 0 0-1.265-.822c-.388-.151-.97-.33-2.043-.379m-5.85 12.345a3.669 3.669 0 0 0 4-5.986a3.67 3.67 0 1 0-4 5.986M8.002 8.002a5.654 5.654 0 1 1 7.996 7.996a5.654 5.654 0 0 1-7.996-7.996m10.906-.814a1.337 1.337 0 1 0-1.89-1.89a1.337 1.337 0 0 0 1.89 1.89"
				/>
			</svg>
		),
		color: "#ff6600",
	},
	{
		title: "X",
		username: "AnishSarkar22",
		link: "https://x.com/AnishSarkar22",
		icon: (props: React.SVGProps<SVGSVGElement>) => (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width={props.size || 24}
				height={props.size || 24}
				viewBox="0 0 24 24"
				{...props}
			>
				<title>X icon</title>
				<g
					fill="none"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={1.5}
				>
					<path d="M2.5 12c0-4.478 0-6.718 1.391-8.109S7.521 2.5 12.001 2.5c4.478 0 6.717 0 8.108 1.391S21.5 7.521 21.5 12c0 4.478 0 6.718-1.391 8.109S16.479 21.5 12 21.5c-4.478 0-6.717 0-8.109-1.391c-1.39-1.392-1.39-3.63-1.39-8.109" />
					<path d="m7 17l4.194-4.193M17 7l-4.193 4.194m0 0L9.777 7H7l4.194 5.807m1.613-1.614L17 17h-2.778l-3.028-4.193" />
				</g>
			</svg>
		),
		color: "#ffffff",
	},
	{
		title: "email",
		username: "anishsarkar282@gmail.com",
		link: "mailto:anishsarkar282@gmail.com",
		icon: (props: React.SVGProps<SVGSVGElement>) => (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width={props.size || 24}
				height={props.size || 24}
				viewBox="0 0 24 24"
				{...props}
			>
				<title>Email icon</title>
				<g
					fill="none"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
				>
					<path d="m7 8.5l2.942 1.74c1.715 1.014 2.4 1.014 4.116 0L17 8.5" />
					<path d="M2.016 13.476c.065 3.065.098 4.598 1.229 5.733c1.131 1.136 2.705 1.175 5.854 1.254c1.94.05 3.862.05 5.802 0c3.149-.079 4.723-.118 5.854-1.254c1.131-1.135 1.164-2.668 1.23-5.733c.02-.986.02-1.966 0-2.952c-.066-3.065-.099-4.598-1.23-5.733c-1.131-1.136-2.705-1.175-5.854-1.254a115 115 0 0 0-5.802 0c-3.149.079-4.723.118-5.854 1.254c-1.131 1.135-1.164 2.668-1.23 5.733a69 69 0 0 0 0 2.952" />
				</g>
			</svg>
		),
		color: "#ea4335",
	},
];

export default function Socials() {
	const [hoveredItem, setHoveredItem] = useState<string | null>(null);
	const [_mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const [isVisible, setIsVisible] = useState(false);
	const sectionId = useId();

	useEffect(() => {
		const handleScroll = () => {
			const element = document.getElementById(sectionId);
			if (element) {
				const rect = element.getBoundingClientRect();
				const isInView = rect.top < window.innerHeight - 100;
				setIsVisible(isInView);
			}
		};

		window.addEventListener("scroll", handleScroll);
		handleScroll(); // Check initial position

		return () => window.removeEventListener("scroll", handleScroll);
	}, [sectionId]);

	const handleMouseMove = (e: React.MouseEvent) => {
		setMousePosition({ x: e.clientX, y: e.clientY });
	};

	// for posthog analytics
	const handleSocialClick = (platform: string, url: string) => {
		trackSocialClick(platform, url);
	};

	return (
		<section
			// use a semantic element and unique id; tabIndex makes it focusable for accessibility
			id={sectionId}
			aria-label="Social links"
			tabIndex={-1}
			className="relative mb-16 text-white"
			onMouseMove={handleMouseMove}
		>
			{/* Cosmic background effect */}
			<motion.h1
				className="relative inline-block font-bold text-2xl text-white"
				initial={false}
				animate={{
					opacity: 1,
					textShadow: isVisible ? "0 0 15px rgba(52, 211, 153, 0.5)" : "none",
				}}
				transition={{ type: "spring", stiffness: 400, damping: 10 }}
				whileHover={{ scale: 1.03 }}
			>
				<span className="inline-block text-green-300 will-change-transform">
					&gt;
				</span>{" "}
				<span className="group relative">
					<span className="animate-shimmer bg-[length:200%_100%] bg-gradient-to-r from-white via-green-200 to-white bg-clip-text text-transparent">
						socials
					</span>
				</span>
			</motion.h1>

			<div className="relative mt-6 space-y-4">
				{socials.map((social, index) => {
					const isHovered = hoveredItem === social.title;

					return (
						<motion.div
							key={social.title}
							className="group relative"
							initial={false}
							animate={{
								opacity: 1,
								x: 0,
								filter: isHovered
									? "drop-shadow(0 0 8px rgba(52, 211, 153, 0.5))"
									: "none",
							}}
							transition={{
								duration: 0.7,
								delay: isVisible ? index * 0.15 : 0,
								type: "spring",
								stiffness: 100,
								damping: 15,
							}}
							onHoverStart={() => setHoveredItem(social.title)}
							onHoverEnd={() => setHoveredItem(null)}
						>
							<motion.a
								href={social.link}
								target="_blank"
								rel="noopener noreferrer"
								className="relative z-10 flex items-center gap-3 rounded-lg px-4 py-3 transition-colors duration-300 group-hover:text-white"
								onMouseEnter={() => setHoveredItem(social.title)}
								onMouseLeave={() => setHoveredItem(null)}
								onClick={() =>
									handleSocialClick(social.title.toLowerCase(), social.link)
								} // for posthog analytics
								aria-label={`Visit ${social.title} profile`}
							>
								{/* Cosmic background glow effect */}
								<motion.div
									className="-z-10 absolute inset-0 rounded-lg"
									initial={{ opacity: 0 }}
									animate={{
										opacity: isHovered ? 0.15 : 0,
										backgroundColor: isHovered ? social.color : "transparent",
										boxShadow: isHovered
											? [
													`0 0 20px ${social.color}40`,
													`0 0 30px ${social.color}30`,
													`0 0 20px ${social.color}40`,
												]
											: "none",
									}}
									transition={{
										duration: 0.3,
										boxShadow: {
											duration: 2,
											repeat: Number.POSITIVE_INFINITY,
											repeatType: "reverse",
										},
									}}
								/>

								{/* Animated border */}
								<motion.div
									className="absolute inset-0 z-0 overflow-hidden rounded-lg"
									initial={{ opacity: 0 }}
									animate={{ opacity: isHovered ? 1 : 0 }}
									transition={{ duration: 0.3 }}
								>
									{isHovered && (
										<>
											{/* <motion.div
												className="absolute top-0 left-0 h-[1px] w-full"
												style={{
													background: `linear-gradient(90deg, transparent, ${social.color}, transparent)`,
												}}
												animate={{
													left: ["-100%", "100%"],
												}}
												transition={{
													duration: 2,
													repeat: Number.POSITIVE_INFINITY,
													ease: "linear",
												}}
											/> */}
											{/* <motion.div
												className="absolute right-0 bottom-0 h-[1px] w-full"
												style={{
													background: `linear-gradient(90deg, transparent, ${social.color}, transparent)`,
												}}
												animate={{
													right: ["-100%", "100%"],
												}}
												transition={{
													duration: 2,
													repeat: Number.POSITIVE_INFINITY,
													ease: "linear",
												}}
											/> */}
											{/* <motion.div
												className="absolute top-0 left-0 h-full w-[1px]"
												style={{
													background: `linear-gradient(0deg, transparent, ${social.color}, transparent)`,
												}}
												animate={{
													top: ["-100%", "100%"],
												}}
												transition={{
													duration: 2,
													repeat: Number.POSITIVE_INFINITY,
													ease: "linear",
												}}
											/> */}
											{/* <motion.div
												className="absolute right-0 bottom-0 h-full w-[1px]"
												style={{
													background: `linear-gradient(0deg, transparent, ${social.color}, transparent)`,
												}}
												animate={{
													bottom: ["-100%", "100%"],
												}}
												transition={{
													duration: 2,
													repeat: Number.POSITIVE_INFINITY,
													ease: "linear",
												}}
											/> */}
										</>
									)}
								</motion.div>

								{/* Icon container with enhanced animations */}
								<motion.div
									className="relative"
									animate={{
										scale: isHovered ? [1, 1.2, 1.1] : 1,
										rotate: isHovered ? [0, -10, 10, -5, 0] : 0,
									}}
									transition={{
										scale: { duration: 0.4, times: [0, 0.6, 1] },
										rotate: { duration: 0.5, times: [0, 0.2, 0.4, 0.6, 1] },
									}}
								>
									{/* Orbital rings around icon */}
									<AnimatePresence>
										{isHovered && (
											<>
												<motion.div
													className="absolute inset-0 rounded-full"
													initial={{ opacity: 0, scale: 0.5 }}
													animate={{
														opacity: [0.2, 0.5, 0.2],
														scale: [1.2, 1.4, 1.2],
														rotate: [0, 180],
													}}
													exit={{ opacity: 0, scale: 0.5 }}
													transition={{
														duration: 2,
														repeat: Number.POSITIVE_INFINITY,
														repeatType: "reverse",
													}}
													style={{
														border: `1px solid ${social.color}`,
														boxShadow: `0 0 10px ${social.color}50`,
													}}
												/>
												<motion.div
													className="absolute inset-0 rounded-full"
													initial={{ opacity: 0, scale: 0.5 }}
													animate={{
														opacity: [0.1, 0.3, 0.1],
														scale: [1.5, 1.7, 1.5],
														rotate: [0, -180],
													}}
													exit={{ opacity: 0, scale: 0.5 }}
													transition={{
														duration: 3,
														repeat: Number.POSITIVE_INFINITY,
														repeatType: "reverse",
													}}
													style={{
														border: `1px solid ${social.color}80`,
													}}
												/>
											</>
										)}
									</AnimatePresence>

									{/* Icon glow effect */}
									<motion.div
										className="absolute inset-0 rounded-full"
										animate={{
											boxShadow: isHovered
												? `0 0 15px ${social.color}`
												: "none",
											opacity: isHovered ? [0.5, 0.8, 0.5] : 0,
										}}
										transition={{
											opacity: {
												duration: 1.5,
												repeat: Number.POSITIVE_INFINITY,
												ease: "easeInOut",
											},
										}}
									/>

									{/* The actual icon */}
									<social.icon
										size={24}
										className="relative z-10 transition-colors duration-300"
										style={{
											color: isHovered ? social.color : "#ffffff80",
											filter: isHovered
												? `drop-shadow(0 0 3px ${social.color})`
												: "none",
										}}
									/>
								</motion.div>

								{/* Username with letter animation */}
								<div className="overflow-hidden">
									<AnimatePresence mode="wait">
										<motion.div
											key={isHovered ? `${social.title}-hovered` : social.title}
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											exit={{ opacity: 0 }}
											transition={{ duration: 0.3 }}
											className="flex"
										>
											{/* {isHovered ? (
                        // Animated letters when hovered
                        social.username.split("").map((letter, i) => (
                          <motion.span
                            key={`letter-${i}`}
                            className="inline-block text-sm"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{
                              duration: 0.3,
                              delay: i * 0.03,
                              type: "spring",
                              stiffness: 200,
                            }}
                            style={{
                              color: social.color,
                              textShadow: `0 0 5px ${social.color}50`,
                            }}
                          >
                            {letter === " " ? "\u00A0" : letter}
                          </motion.span>
                        ))
                      ) : (
                        <motion.span className="inline-block text-sm text-zinc-400">
                          {social.username}
                        </motion.span>
                      )} */}

											{/* if you dont want animation for the username, use below */}
											<span
												className="inline-block text-sm"
												style={{
													color: isHovered ? social.color : undefined,
													textShadow: isHovered
														? `0 0 5px ${social.color}50`
														: undefined,
												}}
											>
												{social.username}
											</span>
										</motion.div>
									</AnimatePresence>
								</div>

								{/* Enhanced animated arrow */}
								<motion.div
									className="ml-auto"
									initial={{ opacity: 0, x: -10 }}
									animate={{
										opacity: isHovered ? 1 : 0,
										x: isHovered ? 0 : -10,
										scale: isHovered ? [1, 1.2, 1] : 1,
									}}
									transition={{
										duration: 0.3,
										scale: {
											duration: 0.5,
											repeat: Number.POSITIVE_INFINITY,
											repeatType: "reverse",
										},
									}}
								>
									<svg
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
										style={{
											filter: isHovered
												? `drop-shadow(0 0 3px ${social.color})`
												: "none",
										}}
									>
										<title>Arrow icon</title>
										<motion.path
											d="M5 12H19M19 12L13 6M19 12L13 18"
											stroke={social.color}
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
											initial={{ pathLength: 0, opacity: 0 }}
											animate={{
												pathLength: isHovered ? 1 : 0,
												opacity: isHovered ? 1 : 0,
												x: isHovered ? [0, 2, 0] : 0,
											}}
											transition={{
												duration: 0.3,
												x: {
													duration: 0.5,
													repeat: Number.POSITIVE_INFINITY,
													repeatType: "reverse",
												},
											}}
										/>
									</svg>
								</motion.div>

								{/* Enhanced particle effects */}
								<AnimatePresence>
									{isHovered && (
										<>
											{[...Array(10)].map((_, i) => (
												<motion.div
													key={`${social.title}-particle-${i}`}
													className="pointer-events-none absolute z-0 rounded-full"
													initial={{
														opacity: 0,
														scale: 0,
														x: 0,
														y: 0,
													}}
													animate={{
														opacity: [0, 0.8, 0],
														scale: [0, Math.random() * 0.5 + 0.5, 0],
														x: [0, (Math.random() - 0.5) * 100],
														y: [0, (Math.random() - 0.5) * 100],
													}}
													exit={{ opacity: 0, scale: 0 }}
													transition={{
														duration: 1 + Math.random() * 1,
														repeat: Number.POSITIVE_INFINITY,
														delay: Math.random() * 0.5,
													}}
													style={{
														left: `${50 + (Math.random() - 0.5) * 20}%`,
														top: `${50 + (Math.random() - 0.5) * 20}%`,
														width: `${Math.random() * 6 + 2}px`,
														height: `${Math.random() * 6 + 2}px`,
														backgroundColor: social.color,
														boxShadow: `0 0 ${Math.random() * 10 + 5}px ${
															social.color
														}`,
													}}
												/>
											))}

											{/* Cosmic dust particles */}
											{[...Array(20)].map((_, i) => (
												<motion.div
													key={`${social.title}-dust-${i}`}
													className="pointer-events-none absolute z-0 rounded-full"
													initial={{
														opacity: 0,
														scale: 0,
													}}
													animate={{
														opacity: [0, 0.4, 0],
														scale: [0, Math.random() * 0.3 + 0.1, 0],
														x: [
															0,
															(Math.random() - 0.5) *
																150 *
																(Math.random() > 0.5 ? 1 : -1),
														],
														y: [
															0,
															(Math.random() - 0.5) *
																150 *
																(Math.random() > 0.5 ? 1 : -1),
														],
														rotate: [0, Math.random() * 360],
													}}
													exit={{ opacity: 0, scale: 0 }}
													transition={{
														duration: 1.5 + Math.random() * 2,
														repeat: Number.POSITIVE_INFINITY,
														delay: Math.random() * 0.5,
														ease: "easeOut",
													}}
													style={{
														left: `${50 + (Math.random() - 0.5) * 40}%`,
														top: `${50 + (Math.random() - 0.5) * 40}%`,
														width: `${Math.random() * 3 + 1}px`,
														height: `${Math.random() * 3 + 1}px`,
														backgroundColor: `${social.color}80`,
													}}
												/>
											))}
										</>
									)}
								</AnimatePresence>
							</motion.a>
						</motion.div>
					);
				})}
			</div>

			{/* Cosmic background particles */}
			<div className="-z-20 pointer-events-none absolute inset-0 overflow-hidden">
				{[...Array(15)].map(() => {
					const uniqueKey = `bg-particle-${Date.now()}-${Math.random()}`;
					return (
						<motion.div
							key={uniqueKey}
							className="absolute h-1 w-1 rounded-full bg-green-300/20"
							initial={{
								x: `${Math.random() * 100}%`,
								y: `${Math.random() * 100}%`,
								opacity: 0,
								scale: 0,
							}}
							animate={{
								y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
								x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
								opacity: isVisible ? [0, 0.5, 0] : 0,
								scale: isVisible ? [0, 1, 0] : 0,
							}}
							transition={{
								duration: 5 + Math.random() * 5,
								repeat: Number.POSITIVE_INFINITY,
								delay: Math.random() * 5,
							}}
						/>
					);
				})}
			</div>
		</section>
	);
}
