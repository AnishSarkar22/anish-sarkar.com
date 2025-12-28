"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function NotFound() {
	const [glitchActive, setGlitchActive] = useState(false);

	useEffect(() => {
		const interval = setInterval(() => {
			setGlitchActive(true);
			setTimeout(() => setGlitchActive(false), 200);
		}, 3000);
		return () => clearInterval(interval);
	}, []);

	return (
		<main className="relative min-h-screen overflow-hidden text-white">
			{/* Content */}
			<div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
				{/* Error message with glitch */}
				<motion.div
					className="mb-12 text-center"
					animate={
						glitchActive
							? {
									x: [0, -2, 2, -1, 0],
									y: [0, -0.5, 0.5, 0],
									skewX: [-0.3, 0.3, 0],
								}
							: {}
					}
					transition={{ duration: 0.15, ease: "easeInOut" }}
				>
					<motion.h2
						className="glitch-text mb-4 font-bold text-3xl text-green-300/70 md:text-5xl"
						data-text="404 ERROR"
						animate={
							glitchActive
								? {
										filter: [
											"brightness(1)",
											"brightness(1.2)",
											"brightness(0.8)",
											"brightness(1)",
										],
									}
								: {}
						}
						transition={{ duration: 0.15 }}
					>
						404 ERROR
					</motion.h2>
				</motion.div>

				{/* Description */}
				<p className="mb-12 max-w-md text-center font-mono text-gray-400 text-sm md:text-base">
					The requested resource has been corrupted or does not exist in this
					reality.
				</p>

				{/* Glitch button */}
				<motion.button
					className="group relative overflow-hidden border-2 border-green-300 bg-black px-8 py-4 font-bold font-mono text-green-300 transition-all duration-300 hover:border-emerald-400 hover:text-emerald-400"
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={() => window.history.back()}
					onMouseEnter={() => setGlitchActive(true)}
					onMouseLeave={() => setGlitchActive(false)}
				>
					{/* Button glitch layers */}
					<motion.span
						className="absolute inset-0 flex items-center justify-center text-emerald-400 mix-blend-screen"
						animate={
							glitchActive
								? {
										x: [0, -2, 2, 0],
										opacity: [0, 0.8, 0.8, 0],
									}
								: { opacity: 0 }
						}
						transition={{ duration: 0.15 }}
					>
						RETURN
					</motion.span>
					<motion.span
						className="absolute inset-0 flex items-center justify-center text-green-300 mix-blend-screen"
						animate={
							glitchActive
								? {
										x: [0, 2, -2, 0],
										opacity: [0, 0.8, 0.8, 0],
									}
								: { opacity: 0 }
						}
						transition={{ duration: 0.15, delay: 0.05 }}
					>
						RETURN
					</motion.span>

					{/* Main button text */}
					<span className="relative z-10">RETURN</span>

					{/* Corner brackets */}
					<span className="absolute top-2 left-2 text-gray-500/50">[</span>
					<span className="absolute top-2 right-2 text-gray-500/50">]</span>
					<span className="absolute bottom-2 left-2 text-gray-500/50">[</span>
					<span className="absolute right-2 bottom-2 text-gray-500/50">]</span>
				</motion.button>
			</div>
		</main>
	);
}
