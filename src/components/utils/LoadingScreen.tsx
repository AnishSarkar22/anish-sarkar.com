"use client";

import { AnimatePresence, motion } from "framer-motion";
import type React from "react";
import { useEffect, useMemo, useState } from "react";

export default function LoadingScreen({
	children,
}: {
	children?: React.ReactNode;
} = {}) {
	const [loading, setLoading] = useState(true);
	const [progress, setProgress] = useState(0);
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
						{/* text "Loading" with modern text effects */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.3 }}
							className="relative mb-12"
						>
							<motion.div className="flex overflow-hidden font-bold text-3xl text-green-300 tracking-wider">
								{Array.from("Loading...").map((char, index) => (
									<motion.span
										key={`char-${char}-${index}-${children?.toString()}`}
										initial={{ y: 40, opacity: 0 }}
										animate={{ y: 0, opacity: 1 }}
										transition={{
											duration: 0.3,
											delay: 0.03 * index,
											ease: [0.22, 1, 0.36, 1],
										}}
										className="relative inline-block"
									>
										{char}
										<motion.span
											className="absolute inset-0 text-green-100/30 blur-[1px]"
											animate={{
												opacity: [0.3, 0.8, 0.3],
											}}
											transition={{
												duration: 2,
												repeat: Number.POSITIVE_INFINITY,
												delay: 0.1 * index,
											}}
										>
											{char}
										</motion.span>
									</motion.span>
								))}
							</motion.div>

							{/* Animated underline with glow */}
							{/* <motion.div
                className="mt-1 h-[2px] bg-gradient-to-r from-transparent via-green-400 to-transparent"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "100%", opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              /> */}
						</motion.div>

						{/* Upgrade progress bar with super smooth effect */}
						<div className="relative h-3 w-72">
							{/* Glow effect */}
							<motion.div
								className="absolute inset-0 rounded-full blur-md"
								style={{
									background: `linear-gradient(90deg, rgba(52, 211, 153, 0.2) 0%, rgba(52, 211, 153, 0.6) ${progress}%, rgba(52, 211, 153, 0.2) ${progress}%, transparent ${Math.min(progress + 5, 100)}%)`,
								}}
							/>

							{/* Main progress bar background */}
							<motion.div className="absolute inset-0 overflow-hidden rounded-full border border-zinc-800 bg-zinc-900/80">
								{/* Progress indicator */}
								<motion.div
									className="h-full w-full origin-left"
									style={{
										background:
											"linear-gradient(90deg, rgba(52, 211, 153, 0.3) 0%, rgba(52, 211, 153, 0.8) 50%, rgba(52, 211, 153, 0.3) 100%)",
										transform: `scaleX(${progress / 100})`,
									}}
									transition={{ duration: 0.2 }}
								/>

								{/* Animated shine effect */}
								<motion.div
									className="absolute inset-0 opacity-70"
									style={{
										background:
											"linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.15) 50%, transparent 100%)",
										transform: `translateX(${-100 + progress}%)`,
									}}
									transition={{ duration: 0.2 }}
								/>

								{/* Animated particles inside progress bar - giảm số lượng particles */}
								{progress > 10 &&
									Array.from({ length: 5 }).map((_, i) => {
										// Generate a unique key using a deterministic value and the index
										const uniqueKey = `progress-particle-${i}-${Math.round(progress * 1000)}`;
										return (
											<motion.div
												key={uniqueKey}
												className="absolute top-1/2 h-1 w-1 rounded-full bg-green-300/80"
												style={{
													left: `${(progress - 5) * Math.random()}%`,
													transform: "translateY(-50%)",
													opacity: 0.5 + Math.random() * 0.5,
												}}
												animate={{
													y: [
														"-50%",
														`${(Math.random() - 0.5) * 150}%`,
														"-50%",
													],
													opacity: [0.3, 0.8, 0.3],
													scale: [0.8, 1.2, 0.8],
												}}
												transition={{
													duration: 1 + Math.random() * 2,
													repeat: Number.POSITIVE_INFINITY,
													repeatType: "reverse",
												}}
											/>
										);
									})}
							</motion.div>

							{/* Progress percentage with glow */}
							<motion.div
								className="-bottom-8 -translate-x-1/2 absolute left-1/2 transform text-sm text-zinc-400"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.3 }}
							>
								<span className="relative">
									{Math.round(progress)}%
									<motion.span
										className="absolute inset-0 text-green-300 blur-sm"
										animate={{ opacity: [0.3, 0.7, 0.3] }}
										transition={{
											duration: 2,
											repeat: Number.POSITIVE_INFINITY,
										}}
									>
										{Math.round(progress)}%
									</motion.span>
								</span>
							</motion.div>
						</div>
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
