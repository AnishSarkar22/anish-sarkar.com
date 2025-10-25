"use client";

import { AnimatePresence, motion } from "framer-motion";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import JellyLoader from "./JellyLoader";

export default function LoadingScreen({
	children,
}: {
	children?: React.ReactNode;
} = {}) {
	const [loading, setLoading] = useState(true);
	const [_progress, setProgress] = useState(0);
	const [showContent, _setShowContent] = useState(false);
	const [_showStartButton, setShowStartButton] = useState(false);
	const [showParticles, _setShowParticles] = useState(false);

	// Optimize loading progress - reduce waiting time to 2.5s instead of 4.5s
	useEffect(() => {
		// Increase progress speed
		const interval = setInterval(() => {
			setProgress((prev) => {
				const increment = (100 - prev) * 0.1; // Increased speed from 0.05 to 0.1
				const newProgress = prev + increment;
				return newProgress > 99 ? 99 : newProgress;
			});
		}, 50); // Reduce interval from 100ms to 50ms

		// Reduce loading time
		const timeout = setTimeout(() => {
			clearInterval(interval);
			setProgress(100);
			setLoading(false);
			setTimeout(() => {
				setShowStartButton(true);
			}, 500);
		}, 2500);

		return () => {
			clearInterval(interval);
			clearTimeout(timeout);
		};
	}, []);

	// Use useMemo to avoid recreating the particles array every time you render
	const particles = useMemo(() => Array.from({ length: 100 }, (_, i) => i), []);

	// Optimize performance by rendering only the necessary elements
	return (
		<>
			<AnimatePresence>
				{loading && (
					<motion.div
						className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
						exit={{ opacity: 0 }}
						transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
					>
						<JellyLoader />
					</motion.div>
				)}
			</AnimatePresence>

			{/* Particle effects on transition - render only when needed */}
			{showParticles && (
				<div className="pointer-events-none fixed inset-0 z-40">
					{particles.map((i) => (
						<motion.div
							key={`transition-particle-${i}`}
							className="absolute rounded-full bg-green-300"
							style={{
								width: `${Math.random() * 4 + 1}px`,
								height: `${Math.random() * 4 + 1}px`,
								top: `${Math.random() * 100}%`,
								left: `${Math.random() * 100}%`,
								opacity: 0,
							}}
							animate={{
								opacity: [0, 0.8, 0],
								scale: [0, 1, 0],
								y: [0, (Math.random() - 0.5) * 100],
								x: [0, (Math.random() - 0.5) * 100],
							}}
							transition={{
								duration: 1 + Math.random(),
								repeat: 0,
								delay: Math.random() * 0.5,
							}}
						/>
					))}
				</div>
			)}

			{/* Main content */}
			<div className={showContent ? "block" : "hidden"}>{children}</div>
		</>
	);
}
