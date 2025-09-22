"use client";

import { AnimatePresence, motion } from "framer-motion";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";

export default function LoadingScreen({
	children,
}: { children?: React.ReactNode } = {}) {
	const [loading, setLoading] = useState(true);
	const [progress, setProgress] = useState(0);
	const [showContent, setShowContent] = useState(false);
	const [showStartButton, setShowStartButton] = useState(false);
	const [showParticles, setShowParticles] = useState(false);

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

	const handleStart = () => {
		setShowParticles(true);
		// Reduce conversion time
		setTimeout(() => {
			setShowContent(true);
			setTimeout(() => {
				setShowParticles(false);
			}, 2000);
		}, 1000);
	};

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

			{/* <AnimatePresence>
        {!loading && !showContent && (
          <motion.div
            className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >

            <motion.div
              className="mb-16 relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-center relative">
                {Array.from("Welcome").map((letter, index) => (
                  <motion.div
                    key={`welcome-letter-${index}`}
                    className="relative inline-block"
                    initial={{ 
                      y: -50, 
                      opacity: 0,
                      rotateX: 90,
                      scale: 0.5
                    }}
                    animate={{ 
                      y: 0, 
                      opacity: 1,
                      rotateX: 0,
                      scale: 1
                    }}
                    transition={{ 
                      duration: 0.6,
                      delay: 0.08 * index,
                      type: "spring",
                      stiffness: 120
                    }}
                  >

                    <motion.div
                      className="absolute inset-0 blur-md rounded-lg -z-10"
                      style={{ 
                        background: `radial-gradient(circle, rgba(52, 211, 153, 0.8) 0%, transparent 70%)`,
                        opacity: 0
                      }}
                      animate={{ 
                        opacity: [0, 0.7, 0.3],
                        scale: [0.8, 1.2, 1]
                      }}
                      transition={{ 
                        duration: 2,
                        delay: 0.08 * index + 0.2,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    />
                    

                    {Array.from({ length: 2 }).map((_, i) => (
                      <motion.div
                        key={`letter-particle-${index}-${i}`}
                        className="absolute w-1 h-1 rounded-full bg-green-300"
                        style={{
                          top: "50%",
                          left: "50%",
                          opacity: 0
                        }}
                        animate={{ 
                          x: [0, (Math.random() - 0.5) * 30],
                          y: [0, (Math.random() - 0.5) * 30],
                          opacity: [0, 0.8, 0],
                          scale: [0, 1, 0]
                        }}
                        transition={{
                          duration: 1.5 + Math.random(),
                          repeat: Infinity,
                          delay: 0.08 * index + i * 0.2 
                        }}
                      />
                    ))}
                    

                    <span className="text-5xl md:text-6xl font-bold relative inline-block px-1 bg-clip-text text-transparent bg-gradient-to-b from-green-300 to-green-500">
                      {letter}
                      

                      <motion.span
                        className="absolute inset-0 bg-clip-text text-transparent bg-gradient-to-r from-green-200 to-transparent mix-blend-overlay"
                        animate={{
                          backgroundPosition: ["0% 0%", "100% 100%"]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                      >
                        {letter}
                      </motion.span>
                    </span>
                  </motion.div>
                ))}
              </div>
              

              <motion.div
                className="h-[2px] mt-2 bg-gradient-to-r from-transparent via-green-400 to-transparent"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "100%", opacity: 1 }}
                transition={{ 
                  duration: 0.8,
                  delay: 0.5,
                  ease: [0.22, 1, 0.36, 1]
                }}
              />
            </motion.div>
            
            <AnimatePresence>
              {showStartButton && (
                <motion.button
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 0 50px rgba(52, 211, 153, 0.8)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ 
                    duration: 0.3,
                    type: "spring",
                    stiffness: 350,
                    damping: 15
                  }}
                  className="relative px-12 py-5 bg-transparent text-green-300 font-bold rounded-full overflow-hidden group"
                  onClick={handleStart}
                >

                  <motion.div 
                    className="absolute inset-0 -z-10 rounded-full"
                    style={{
                      background: "radial-gradient(circle at center, rgba(52, 211, 153, 0.3) 0%, rgba(16, 185, 129, 0.2) 50%, rgba(5, 150, 105, 0.1) 100%)",
                    }}
                    animate={{
                      boxShadow: [
                        "inset 0 0 20px rgba(52, 211, 153, 0.3), 0 0 10px rgba(52, 211, 153, 0.3)",
                        "inset 0 0 40px rgba(52, 211, 153, 0.5), 0 0 20px rgba(52, 211, 153, 0.5)",
                        "inset 0 0 20px rgba(52, 211, 153, 0.3), 0 0 10px rgba(52, 211, 153, 0.3)"
                      ]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  />
                  

                  <div className="absolute inset-0 overflow-hidden rounded-full">
                    {Array.from({ length: 10 }).map((_, i) => ( 
                      <motion.div
                        key={`btn-particle-${i}`}
                        className="absolute rounded-full bg-green-300"
                        style={{
                          width: `${Math.random() * 3 + 1}px`,
                          height: `${Math.random() * 3 + 1}px`,
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          opacity: 0
                        }}
                        animate={{
                          opacity: [0, 0.8, 0],
                          scale: [0, 1, 0],
                          y: [0, (Math.random() - 0.5) * 20],
                          x: [0, (Math.random() - 0.5) * 20],
                        }}
                        transition={{
                          duration: 2 + Math.random() * 2,
                          repeat: Infinity,
                          delay: Math.random() * 2
                        }}
                      />
                    ))}
                  </div>
                  

                  <div className="absolute inset-0 rounded-full border border-green-500/30 -z-10" />
                  <motion.div
                    className="absolute inset-0 rounded-full -z-10"
                    style={{ 
                      border: "1px solid rgba(52, 211, 153, 0.5)",
                      margin: "3px"
                    }}
                    animate={{
                      opacity: [0.3, 0.8, 0.3]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity
                    }}
                  />
                  

                  <motion.div
                    className="absolute inset-0 -z-10"
                    style={{
                      borderRadius: "100%",
                      border: "1px dashed rgba(52, 211, 153, 0.3)",
                      margin: "-5px"
                    }}
                    animate={{
                      rotate: [0, 360]
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  <motion.div
                    className="absolute inset-0 -z-10"
                    style={{
                      borderRadius: "100%",
                      border: "1px dashed rgba(52, 211, 153, 0.2)",
                      margin: "-10px"
                    }}
                    animate={{
                      rotate: [360, 0]
                    }}
                    transition={{
                      duration: 15,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  

                  <motion.div
                    className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100"
                    style={{
                      background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)",
                      transform: "translateX(-100%)"
                    }}
                    animate={["initial", "animate"]}
                    variants={{
                      initial: { x: "-100%" },
                      animate: { x: "100%" }
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 0.5
                    }}
                  />
                  

                  <div className="relative inline-block text-xl tracking-widest font-extrabold">

                    <span className="absolute inset-0 text-green-500/20 blur-[2px] translate-x-[1px] translate-y-[1px]">
                      START
                    </span>
                    <span className="absolute inset-0 text-green-400/30 blur-[1px] translate-x-[0.5px] translate-y-[0.5px]">
                      START
                    </span>
                    

                    <span className="relative bg-gradient-to-b from-green-200 to-green-400 text-transparent bg-clip-text">
                      START
                    </span>
                    

                    <motion.span 
                      className="absolute inset-0 text-green-200 blur-sm opacity-0 group-hover:opacity-70"
                      animate={{
                        opacity: [0, 0.7, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity
                      }}
                    >
                      START
                    </motion.span>
                  </div>
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence> */}

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
