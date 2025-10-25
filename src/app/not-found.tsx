"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function NotFound() {
	const [isGlitching, setIsGlitching] = useState(false);
	const glitchInterval = useRef<NodeJS.Timeout | null>(null);
	const errorTextRef = useRef<HTMLDivElement>(null);
	const mainRef = useRef<HTMLDivElement>(null);
	const [_isHovering, setIsHovering] = useState(false);

	const patternId = useRef<string>(crypto.randomUUID()).current;

	// Glitch effect timing
	useEffect(() => {
		const triggerGlitch = () => {
			setIsGlitching(true);
			setTimeout(() => setIsGlitching(false), 200);
		};

		// Initial glitch
		setTimeout(triggerGlitch, 500);

		// Set up random glitching
		glitchInterval.current = setInterval(() => {
			if (Math.random() > 0.7) {
				triggerGlitch();
			}
		}, 2000);

		return () => {
			if (glitchInterval.current) {
				clearInterval(glitchInterval.current);
			}
		};
	}, []);

	// Text scramble effect
	const scrambleText = (text: string) => {
		const chars = "!<>-_\\/[]{}—=+*^?#________";
		let result = "";
		for (let i = 0; i < text.length; i++) {
			if (Math.random() < 0.3) {
				result += chars[Math.floor(Math.random() * chars.length)];
			} else {
				result += text[i];
			}
		}
		return result;
	};

	return (
		<main
			ref={mainRef}
			className="relative min-h-screen overflow-hidden text-white"
			onMouseEnter={() => setIsHovering(true)}
			onMouseLeave={() => setIsHovering(false)}
		>
			{/* Cosmic background elements */}
			<div className="-z-10 pointer-events-none fixed inset-0 bg-black">
				{/* Animated nebula background */}
				<motion.div
					className="absolute inset-0 opacity-30"
					style={{
						backgroundImage:
							"url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPgogIDxmaWx0ZXIgaWQ9Im5vaXNlIj4KICAgIDxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjA1IiBudW1PY3RhdmVzPSIyIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+CiAgICA8ZmVDb2xvck1hdHJpeCB0eXBlPSJzYXR1cmF0ZSIgdmFsdWVzPSIwIi8+CiAgPC9maWx0ZXI+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMC4wNSIvPgo8L3N2Zz4=')",
						backgroundSize: "cover",
					}}
					animate={{
						scale: [1, 1.1, 1],
						opacity: [0.2, 0.3, 0.2],
					}}
					transition={{
						duration: 20,
						repeat: Number.POSITIVE_INFINITY,
						ease: "easeInOut",
					}}
				/>

				<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(50,50,50,0.1),rgba(0,0,0,0)_50%)]" />

				{/* Animated gradient overlay */}
				<motion.div
					className="absolute inset-0 opacity-20"
					animate={{
						background: [
							"radial-gradient(circle at 30% 30%, rgba(52, 211, 153, 0.3) 0%, transparent 70%)",
							"radial-gradient(circle at 70% 70%, rgba(52, 211, 153, 0.3) 0%, transparent 70%)",
							"radial-gradient(circle at 30% 70%, rgba(52, 211, 153, 0.3) 0%, transparent 70%)",
							"radial-gradient(circle at 70% 30%, rgba(52, 211, 153, 0.3) 0%, transparent 70%)",
						],
					}}
					transition={{
						duration: 20,
						repeat: Number.POSITIVE_INFINITY,
						ease: "linear",
					}}
				/>

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

				{/* Animated particles */}
				{(() => {
					// Generate particles with unique IDs and random properties
					const particles = Array.from({ length: 80 }, () => ({
						id: crypto.randomUUID(),
						width: Math.random() * 4 + 1,
						height: Math.random() * 4 + 1,
						left: `${Math.random() * 100}%`,
						top: `${Math.random() * 100}%`,
						background: `rgba(${52 + Math.random() * 30}, ${
							211 + Math.random() * 30
						}, ${153 + Math.random() * 30}, ${0.2 + Math.random() * 0.3})`,
						boxShadow: `0 0 ${Math.random() * 5 + 2}px rgba(52, 211, 153, ${
							0.3 + Math.random() * 0.4
						})`,
						opacity: [0, 0.8, 0],
						y: [0, -Math.random() * 150 - 50],
						x: [0, (Math.random() - 0.5) * 80],
						scale: [0, 1 + Math.random() * 0.5, 0],
						rotate: [0, Math.random() * 360],
						duration: Math.random() * 15 + 10,
						delay: Math.random() * 5,
					}));
					return particles.map((particle) => (
						<motion.div
							key={particle.id}
							className="pointer-events-none absolute rounded-full"
							style={{
								width: particle.width,
								height: particle.height,
								left: particle.left,
								top: particle.top,
								background: particle.background,
								filter: "blur(1px)",
								boxShadow: particle.boxShadow,
							}}
							animate={{
								opacity: particle.opacity,
								y: particle.y,
								x: particle.x,
								scale: particle.scale,
								rotate: particle.rotate,
							}}
							transition={{
								duration: particle.duration,
								repeat: Number.POSITIVE_INFINITY,
								delay: particle.delay,
								ease: "easeInOut",
							}}
						/>
					));
				})()}

				{/* Animated grid lines */}
				{/* <div className="absolute inset-0 overflow-hidden opacity-10">
          {Array.from({ length: 15 }).map((_, i) => {
            const key = `grid-line-h-${crypto.randomUUID()}`;
            return (
              <motion.div
                key={key}
                className="absolute h-px w-full bg-gradient-to-r from-transparent via-green-300 to-transparent"
                style={{ top: `${(i / 15) * 100}%` }}
                animate={{
                  opacity: [0.1, 0.3, 0.1],
                  scaleX: [0.9, 1, 0.9],
                }}
                transition={{
                  duration: 4 + Math.random() * 3,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 2,
                }}
              />
            );
          })}
          {Array.from({ length: 15 }).map((_, i) => {
            const key = `grid-line-v-${crypto.randomUUID()}`;
            return (
              <motion.div
                key={key}
                className="absolute h-full w-px bg-gradient-to-b from-transparent via-green-300 to-transparent"
                style={{ left: `${(i / 15) * 100}%` }}
                animate={{
                  opacity: [0.1, 0.3, 0.1],
                  scaleY: [0.9, 1, 0.9],
                }}
                transition={{
                  duration: 4 + Math.random() * 3,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 2,
                }}
              />
            );
          })}
        </div> */}

				{/* Glowing orbs */}
				{Array.from({ length: 8 }).map(() => {
					const size = 150 + Math.random() * 200;
					const orbKey = crypto.randomUUID();
					return (
						<motion.div
							key={orbKey}
							className="absolute rounded-full blur-3xl"
							style={{
								width: size,
								height: size,
								left: `${Math.random() * 100}%`,
								top: `${Math.random() * 100}%`,
								background:
									"radial-gradient(circle, rgba(52, 211, 153, 0.3) 0%, rgba(52, 211, 153, 0.1) 50%, transparent 80%)",
								transform: "translate(-50%, -50%)",
							}}
							animate={{
								scale: [1, 1.2, 1],
								opacity: [0.2, 0.4, 0.2],
								x: [(Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50],
								y: [(Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50],
							}}
							transition={{
								duration: 8 + Math.random() * 7,
								repeat: Number.POSITIVE_INFINITY,
								ease: "easeInOut",
								delay: Math.random() * 5,
							}}
						/>
					);
				})}

				{/* Hexagon grid pattern */}
				<div className="pointer-events-none absolute inset-0 overflow-hidden opacity-5">
					<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
						<title>Hexagon grid pattern</title>
						<defs>
							<pattern
								id={patternId}
								width="50"
								height="43.4"
								patternUnits="userSpaceOnUse"
								patternTransform="scale(5) rotate(0)"
							>
								<path
									d="M25,17.3 L25,0 L0,8.7 L0,25.9 L25,34.6 L50,25.9 L50,8.7 Z"
									fill="none"
									stroke="rgba(52, 211, 153, 0.5)"
									strokeWidth="0.5"
								/>
							</pattern>
						</defs>
						<rect width="100%" height="100%" fill={`url(#${patternId})`} />
					</svg>
				</div>

				{/* Animated wave at bottom */}
				{/* <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-32">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1440 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <title>Animated wave at bottom</title>
            <motion.path
              d="M0 50L48 45.7C96 41.3 192 32.7 288 30.3C384 28 480 32 576 39.2C672 46.3 768 56.7 864 58.8C960 61 1056 55 1152 51.8C1248 48.7 1344 48.3 1392 48.2L1440 48V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V50Z"
              fill="url(#paint0_linear)"
              fillOpacity="0.1"
              animate={{
                d: [
                  "M0 50L48 45.7C96 41.3 192 32.7 288 30.3C384 28 480 32 576 39.2C672 46.3 768 56.7 864 58.8C960 61 1056 55 1152 51.8C1248 48.7 1344 48.3 1392 48.2L1440 48V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V50Z",
                  "M0 60L48 55.7C96 51.3 192 42.7 288 40.3C384 38 480 42 576 49.2C672 56.3 768 66.7 864 68.8C960 71 1056 65 1152 61.8C1248 58.7 1344 58.3 1392 58.2L1440 58V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V60Z",
                  "M0 40L48 45.7C96 51.3 192 62.7 288 60.3C384 58 480 42 576 35.2C672 28.3 768 30.7 864 38.8C960 47 1056 61 1152 64.8C1248 68.7 1344 62.3 1392 59.2L1440 56V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V40Z",
                  "M0 50L48 45.7C96 41.3 192 32.7 288 30.3C384 28 480 32 576 39.2C672 46.3 768 56.7 864 58.8C960 61 1056 55 1152 51.8C1248 48.7 1344 48.3 1392 48.2L1440 48V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V50Z",
                ],
              }}
              transition={{
                duration: 20,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
            <defs>
              <linearGradient
                id="paint0_linear"
                x1="720"
                y1="0"
                x2="720"
                y2="100"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#34D399" />
                <stop offset="1" stopColor="#34D399" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div> */}
			</div>

			{/* Content container */}
			<div className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-4 py-20">
				{/* 404 Display */}
				<motion.div
					className="relative mb-12 text-center"
					animate={{
						x: isGlitching ? [0, -10, 5, -5, 0] : 0,
						y: isGlitching ? [0, 5, -5, 3, 0] : 0,
					}}
					transition={{ duration: 0.2 }}
				>
					<motion.div
						className="relative inline-block"
						// animate={{
						//   rotateX: [0, 10, 0, -10, 0],
						//   rotateY: [0, -15, 0, 15, 0],
						//   scale: [1, 1.05, 1, 0.95, 1],
						// }}
						// transition={{
						//   duration: 8,
						//   repeat: Number.POSITIVE_INFINITY,
						//   ease: "easeInOut",
						// }}
						// style={{
						//   perspective: "1000px",
						//   transformStyle: "preserve-3d",
						// }}
					>
						<motion.h1
							className="relative mx-auto text-center font-bold text-[12rem] leading-none tracking-tighter md:text-[20rem]"
							style={{ fontFamily: "monospace" }}
							animate={{
								textShadow: isGlitching
									? [
											"0 0 10px rgba(52, 211, 153, 0.8), 0 0 20px rgba(52, 211, 153, 0.4), 0 0 30px rgba(52, 211, 153, 0.2)",
											"5px 0 10px rgba(59, 130, 246, 0.8), -5px 0 20px rgba(59, 130, 246, 0.4), 0 0 30px rgba(59, 130, 246, 0.2)",
											"0 0 10px rgba(52, 211, 153, 0.8), 0 0 20px rgba(52, 211, 153, 0.4), 0 0 30px rgba(52, 211, 153, 0.2)",
										]
									: "0 0 10px rgba(52, 211, 153, 0.8), 0 0 20px rgba(52, 211, 153, 0.4), 0 0 30px rgba(52, 211, 153, 0.2)",
							}}
							transition={{ duration: 0.2 }}
						>
							<span
								className={`absolute inset-0 ${
									isGlitching ? "text-blue-500" : "text-green-300"
								}`}
								style={{
									clipPath: isGlitching
										? "polygon(0 15%, 100% 15%, 100% 40%, 0 40%)"
										: "none",
									transform: isGlitching ? "translate(-5px, 0)" : "none",
									WebkitTextStroke: "2px rgba(0,0,0,0.3)",
									filter: "drop-shadow(0 0 15px rgba(52, 211, 153, 0.8))",
								}}
							>
								404
							</span>
							<span
								className={`absolute inset-0 ${
									isGlitching ? "text-purple-500" : "text-green-300"
								}`}
								style={{
									clipPath: isGlitching
										? "polygon(0 60%, 100% 60%, 100% 85%, 0 85%)"
										: "none",
									transform: isGlitching ? "translate(5px, 0)" : "none",
									WebkitTextStroke: "2px rgba(0,0,0,0.3)",
									filter: "drop-shadow(0 0 15px rgba(52, 211, 153, 0.8))",
								}}
							>
								404
							</span>
							<span
								className="relative text-green-300"
								style={{
									WebkitTextStroke: "2px rgba(0,0,0,0.3)",
									filter: "drop-shadow(0 0 15px rgba(52, 211, 153, 0.8))",
									background:
										"linear-gradient(to bottom, rgba(52, 211, 153, 1), rgba(16, 185, 129, 1))",
									WebkitBackgroundClip: "text",
									WebkitTextFillColor: "transparent",
								}}
							>
								404
							</span>
						</motion.h1>

						{/* Holographic effect */}
						{/* <motion.div
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                background:
                  "linear-gradient(45deg, transparent 25%, rgba(52, 211, 153, 0.3) 25%, rgba(52, 211, 153, 0.3) 50%, transparent 50%, transparent 75%, rgba(52, 211, 153, 0.3) 75%)",
                backgroundSize: "10px 10px",
                mixBlendMode: "overlay",
              }}
              animate={{
                backgroundPosition: ["0px 0px", "10px 10px"],
              }}
              transition={{
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            /> */}

						{/* 3D layers for depth */}
						{/* <div
              className="absolute inset-0 opacity-20"
              style={{ transform: "translateZ(-50px)" }}
            >
              <div className="w-full h-full text-[12rem] md:text-[20rem] font-bold leading-none tracking-tighter text-center text-green-300/30">
                404
              </div>
            </div>
            <div
              className="absolute inset-0 opacity-10"
              style={{ transform: "translateZ(-100px)" }}
            >
              <div className="w-full h-full text-[12rem] md:text-[20rem] font-bold leading-none tracking-tighter text-center text-green-300/20">
                404
              </div>
            </div> */}
					</motion.div>

					{/* Glitch lines */}
					<AnimatePresence>
						{isGlitching && (
							<>
								<motion.div
									className="absolute top-1/4 right-0 left-0 h-1 bg-blue-500"
									initial={{ scaleX: 0 }}
									animate={{ scaleX: 1 }}
									exit={{ scaleX: 0 }}
									transition={{ duration: 0.1 }}
								/>
								<motion.div
									className="absolute top-2/3 right-0 left-0 h-2 bg-green-500"
									initial={{ scaleX: 0 }}
									animate={{ scaleX: 1 }}
									exit={{ scaleX: 0 }}
									transition={{ duration: 0.15, delay: 0.05 }}
								/>
							</>
						)}
					</AnimatePresence>

					{/* Decorative circles */}
					<div className="-z-10 absolute inset-0 flex items-center justify-center">
						<motion.div
							className="absolute h-[120%] w-[120%] rounded-full border-2 border-green-300/20 border-dashed"
							animate={{ rotate: 360 }}
							transition={{
								duration: 120,
								repeat: Number.POSITIVE_INFINITY,
								ease: "linear",
							}}
						/>
						<motion.div
							className="absolute h-[140%] w-[140%] rounded-full border border-green-300/10"
							animate={{ rotate: -360 }}
							transition={{
								duration: 180,
								repeat: Number.POSITIVE_INFINITY,
								ease: "linear",
							}}
						/>
						<motion.div
							className="absolute h-[160%] w-[160%] rounded-full border border-green-300/5"
							animate={{ rotate: 180 }}
							transition={{
								duration: 240,
								repeat: Number.POSITIVE_INFINITY,
								ease: "linear",
							}}
						/>
					</div>

					{/* Decorative tech elements */}
					{/* <div className="-z-10 absolute inset-0">
            {[...Array(4)].map((_, i) => {
              const uniqueKey = `corner-decoration-${crypto.randomUUID()}`;
              return (
                <motion.div
                  key={uniqueKey}
                  className="absolute h-16 w-16 border-2 border-green-300/30"
                  style={{
                    top: i < 2 ? "-8px" : "auto",
                    bottom: i >= 2 ? "-8px" : "auto",
                    left: i % 2 === 0 ? "-8px" : "auto",
                    right: i % 2 === 1 ? "-8px" : "auto",
                    borderTop: i >= 2 ? "none" : undefined,
                    borderBottom: i < 2 ? "none" : undefined,
                    borderLeft: i % 2 === 1 ? "none" : undefined,
                    borderRight: i % 2 === 0 ? "none" : undefined,
                    borderTopLeftRadius: i === 0 ? "8px" : "0",
                    borderTopRightRadius: i === 1 ? "8px" : "0",
                    borderBottomLeftRadius: i === 2 ? "8px" : "0",
                    borderBottomRightRadius: i === 3 ? "8px" : "0",
                  }}
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    boxShadow: [
                      "0 0 5px 0 rgba(52, 211, 153, 0.3)",
                      "0 0 10px 2px rgba(52, 211, 153, 0.5)",
                      "0 0 5px 0 rgba(52, 211, 153, 0.3)",
                    ],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: i * 0.5,
                  }}
                />
              );
            })}
          </div> */}
				</motion.div>

				{/* Error message with scramble effect */}
				<div className="relative mb-12">
					<motion.div
						ref={errorTextRef}
						className="mb-6 font-bold font-mono text-2xl md:text-4xl"
						animate={{
							opacity: isGlitching ? [1, 0.5, 1] : 1,
							x: isGlitching ? [0, 3, -3, 0] : 0,
						}}
						transition={{ duration: 0.2 }}
						style={{
							background:
								"linear-gradient(to right, #34D399, #10B981, #059669, #10B981, #34D399)",
							backgroundSize: "200% auto",
							WebkitBackgroundClip: "text",
							WebkitTextFillColor: "transparent",
							textShadow: "0 0 20px rgba(52, 211, 153, 0.4)",
						}}
						whileInView={{
							backgroundPosition: ["0% center", "200% center"],
						}}
						viewport={{ once: false }}
					>
						<motion.span
							animate={{
								filter: ["blur(0px)", "blur(0.5px)", "blur(0px)"],
							}}
							transition={{
								duration: 2,
								repeat: Number.POSITIVE_INFINITY,
								ease: "easeInOut",
							}}
						>
							{isGlitching
								? scrambleText("ERROR: PAGE_NOT_FOUND")
								: "ERROR: PAGE_NOT_FOUND"}
						</motion.span>
					</motion.div>

					<motion.p
						className="mx-auto max-w-lg rounded-lg border border-green-500/10 bg-black/20 px-6 py-3 text-lg text-zinc-300 backdrop-blur-sm"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.5 }}
						whileHover={{
							boxShadow: "0 0 20px rgba(52, 211, 153, 0.2)",
							borderColor: "rgba(52, 211, 153, 0.3)",
							scale: 1.02,
						}}
					>
						<motion.span
							className="inline-block"
							animate={{
								opacity: [1, 0.8, 1],
							}}
							transition={{
								duration: 2,
								repeat: Number.POSITIVE_INFINITY,
								ease: "easeInOut",
							}}
						>
							The page you're looking for is either chilling in the void, got
							kidnapped, renamed itself to escape you, or just rage quit
							existence.{" "}
						</motion.span>
					</motion.p>

					{/* Decorative tech elements */}
					<div className="-z-10 -translate-y-1/2 pointer-events-none absolute top-1/2 right-0 left-0 flex transform justify-between px-4 opacity-20">
						<motion.div
							className="h-20 w-20 rounded-full border border-green-300/30"
							animate={{
								scale: [1, 1.2, 1],
								opacity: [0.2, 0.5, 0.2],
								rotate: 360,
							}}
							transition={{
								duration: 8,
								repeat: Number.POSITIVE_INFINITY,
								ease: "easeInOut",
							}}
						/>
						<motion.div
							className="h-20 w-20 rounded-full border border-green-300/30"
							animate={{
								scale: [1.2, 1, 1.2],
								opacity: [0.2, 0.5, 0.2],
								rotate: -360,
							}}
							transition={{
								duration: 8,
								repeat: Number.POSITIVE_INFINITY,
								ease: "easeInOut",
							}}
						/>
					</div>
				</div>

				{/* Interactive elements */}
				<div className="mt-8 flex flex-col items-center justify-center gap-6 md:flex-row">
					<motion.button
						className="group relative overflow-hidden rounded-full px-8 py-4"
						whileHover={{ scale: 1.05, y: -2 }}
						whileTap={{ scale: 0.98 }}
						onClick={() => window.history.back()}
					>
						{/* Button background with animated gradient */}
						<motion.div
							className="absolute inset-0 rounded-full bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-900"
							animate={{
								backgroundPosition: ["0% center", "100% center"],
							}}
							transition={{
								duration: 3,
								repeat: Number.POSITIVE_INFINITY,
								repeatType: "mirror",
								ease: "linear",
							}}
							style={{
								backgroundSize: "200% 100%",
							}}
						/>

						{/* Glass overlay */}
						<div className="absolute inset-0 rounded-full border border-white/10 bg-black/40 backdrop-blur-sm" />

						{/* Shine effect */}
						<motion.span
							className="absolute inset-0 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/20 to-transparent"
							initial={{ x: "-100%", opacity: 0 }}
							whileHover={{
								x: "200%",
								opacity: 1,
								transition: { duration: 1.2, ease: "easeInOut" },
							}}
						/>

						{/* Glow effect */}
						<motion.div
							className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
							style={{
								boxShadow: "0 0 20px 5px rgba(82, 82, 91, 0.5)",
							}}
						/>

						{/* Button content */}
						<span className="relative z-10 flex items-center font-medium text-white">
							<motion.div
								className="mr-2 flex items-center justify-center rounded-full bg-green-300 p-1 text-zinc-800"
								animate={{
									rotate: [0, 360],
								}}
								transition={{
									duration: 4,
									repeat: Number.POSITIVE_INFINITY,
									ease: "linear",
								}}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width={20}
									height={20}
									viewBox="0 0 24 24"
								>
									<title>Go Back Icon</title>
									<path
										fill="currentColor"
										d="M5.463 4.433A9.96 9.96 0 0 1 12 2c5.523 0 10 4.477 10 10c0 2.136-.67 4.116-1.81 5.74L17 12h3A8 8 0 0 0 6.46 6.228zm13.074 15.134A9.96 9.96 0 0 1 12 22C6.477 22 2 17.523 2 12c0-2.136.67-4.116 1.81-5.74L7 12H4a8 8 0 0 0 13.54 5.772z"
									/>
								</svg>
								{/* <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24">
                  <title>Refresh Icon</title>
                  <path fill="currentColor" d="M21.074 12.154a.75.75 0 0 1 .672.82c-.49 4.93-4.658 8.776-9.724 8.776c-2.724 0-5.364-.933-7.238-2.68L3 20.85a.75.75 0 0 1-.75-.75v-3.96c0-.714.58-1.29 1.291-1.29h3.97a.75.75 0 0 1 .75.75l-2.413 2.407c1.558 1.433 3.78 2.243 6.174 2.243c4.29 0 7.817-3.258 8.232-7.424a.75.75 0 0 1 .82-.672m-18.82-1.128c.49-4.93 4.658-8.776 9.724-8.776c2.724 0 5.364.933 7.238 2.68L21 3.15a.75.75 0 0 1 .75.75v3.96c0 .714-.58 1.29-1.291 1.29h-3.97a.75.75 0 0 1-.75-.75l2.413-2.408c-1.558-1.432-3.78-2.242-6.174-2.242c-4.29 0-7.817 3.258-8.232 7.424a.75.75 0 1 1-1.492-.148" />
                </svg> */}
							</motion.div>
							<span className="font-bold tracking-wide">Go Back</span>
						</span>
					</motion.button>
				</div>

				{/* Decorative error icon */}
				{/* <motion.div
          className="pointer-events-none absolute right-10 bottom-10 opacity-10"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0, -5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={150}
            height={300}
            viewBox="0 0 16 16"
          >
            <title>Error Icon</title>
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="m7.493.015l-.386.04c-1.873.187-3.76 1.153-5.036 2.579C.66 4.211-.057 6.168.009 8.253c.115 3.601 2.59 6.65 6.101 7.518a8.03 8.03 0 0 0 6.117-.98a8 8 0 0 0 3.544-4.904c.172-.701.212-1.058.212-1.887s-.04-1.186-.212-1.887C14.979 2.878 12.315.498 9 .064C8.716.027 7.683-.006 7.493.015m1.36 1.548a6.5 6.5 0 0 1 3.091 1.271c.329.246.976.893 1.222 1.222c.561.751.976 1.634 1.164 2.479a6.8 6.8 0 0 1 0 2.93c-.414 1.861-1.725 3.513-3.463 4.363a6.8 6.8 0 0 1-1.987.616c-.424.065-1.336.065-1.76 0c-1.948-.296-3.592-1.359-4.627-2.993a7.5 7.5 0 0 1-.634-1.332A6.2 6.2 0 0 1 1.514 8c0-1.039.201-1.925.646-2.84c.34-.698.686-1.18 1.253-1.747A6 6 0 0 1 5.16 2.16a6.45 6.45 0 0 1 3.693-.597M7.706 4.29c-.224.073-.351.201-.413.415c-.036.122-.04.401-.034 2.111c.008 1.97.008 1.971.066 2.08a.7.7 0 0 0 .346.308c.132.046.526.046.658 0a.7.7 0 0 0 .346-.308c.058-.109.058-.11.066-2.08c.008-2.152.008-2.154-.145-2.335c-.124-.148-.257-.197-.556-.205a1.7 1.7 0 0 0-.334.014m.08 6.24a.86.86 0 0 0-.467.402a.85.85 0 0 0-.025.563A.78.78 0 0 0 8 12c.303 0 .612-.22.706-.505a.85.85 0 0 0-.025-.563a.95.95 0 0 0-.348-.352c-.116-.06-.429-.089-.547-.05"
            />
          </svg>
        </motion.div> */}

				{/* Binary code rain effect */}
				{/* <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {[...Array(15)].map(() => {
            const startPos = Math.random() * 100;
            const duration = 10 + Math.random() * 20;
            const delay = Math.random() * 10;
            const opacity = 0.05 + Math.random() * 0.1;
            const binaryKey = `binary-${crypto.randomUUID()}`;

            return (
              <motion.div
                key={binaryKey}
                className="absolute top-0 font-mono text-green-500/30 text-xs"
                style={{
                  left: `${startPos}%`,
                  opacity,
                  writingMode: "vertical-rl",
                  textOrientation: "upright",
                }}
                initial={{ y: -200 }}
                animate={{ y: "100%" }}
                transition={{
                  duration,
                  repeat: Number.POSITIVE_INFINITY,
                  delay,
                  ease: "linear",
                }}
              >
                {[...Array(20)].map((_, j) => (
                  <span key={j}>{Math.round(Math.random())}</span>
                ))}
              </motion.div>
            );
          })}
        </div> */}

				{/* Holographic circuit lines */}
				<div className="pointer-events-none absolute inset-0 overflow-hidden opacity-10">
					{[...Array(8)].map(() => {
						const startX = Math.random() * 100;
						const startY = Math.random() * 100;
						const endX = Math.random() * 100;
						const endY = Math.random() * 100;
						const circuitLineKey = `circuit-line-${crypto.randomUUID()}`;

						return (
							<motion.div
								key={circuitLineKey}
								className="absolute bg-gradient-to-r from-green-500 to-green-500/0"
								style={{
									height: "1px",
									left: `${startX}%`,
									top: `${startY}%`,
									width: `${Math.sqrt(
										(endX - startX) ** 2 + (endY - startY) ** 2,
									)}%`,
									transform: `rotate(${
										Math.atan2(endY - startY, endX - startX) * (180 / Math.PI)
									}deg)`,
									transformOrigin: "left center",
								}}
								animate={{
									opacity: [0, 0.8, 0],
									scaleX: [0, 1, 0],
								}}
								transition={{
									duration: 3 + Math.random() * 2,
									repeat: Number.POSITIVE_INFINITY,
									delay: Math.random() * 5,
									repeatDelay: Math.random() * 5,
								}}
							/>
						);
					})}
				</div>

				{/* Floating tech elements */}
				{Array.from({ length: 12 }).map(() => {
					const size = 10 + Math.random() * 20;
					const isSquare = Math.random() > 0.5;
					const floatingElementKey = `floating-element-${crypto.randomUUID()}`;

					return (
						<motion.div
							key={floatingElementKey}
							className={`absolute ${
								isSquare ? "rounded-md" : "rounded-full"
							} pointer-events-none border border-green-300/30`}
							style={{
								width: size,
								height: size,
								left: `${Math.random() * 100}%`,
								top: `${Math.random() * 100}%`,
								opacity: 0.1 + Math.random() * 0.2,
							}}
							animate={{
								y: [0, (Math.random() - 0.5) * 30],
								x: [0, (Math.random() - 0.5) * 30],
								rotate: [
									0,
									Math.random() * 180 * (Math.random() > 0.5 ? 1 : -1),
								],
								opacity: [
									0.1 + Math.random() * 0.2,
									0.2 + Math.random() * 0.3,
									0.1 + Math.random() * 0.2,
								],
							}}
							transition={{
								duration: 5 + Math.random() * 10,
								repeat: Number.POSITIVE_INFINITY,
								ease: "easeInOut",
								delay: Math.random() * 5,
							}}
						/>
					);
				})}

				{/* Animated scanline effect */}
				<motion.div
					className="pointer-events-none absolute inset-0 overflow-hidden opacity-10"
					animate={{}}
				>
					<motion.div
						className="absolute right-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-green-300 to-transparent"
						animate={{
							top: ["-2px", "100%"],
						}}
						transition={{
							duration: 8,
							repeat: Number.POSITIVE_INFINITY,
							ease: "linear",
						}}
					/>
				</motion.div>
			</div>
		</main>
	);
}
