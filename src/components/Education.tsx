"use client";

import { motion } from "framer-motion";
import { useCallback, useMemo, useState } from "react";

const edu = [
  {
    title: "Techno Main Salt Lake",
    position: "Undergraduate",
    date: "(2022 - present)",
    description: "currently building random projects",
    color: "#f87171",
  },
  {
    title: "Beachwood School",
    position: "Secondary High School",
    date: "(2019 - 2021)",
    description: "made it through somehow",
    color: "#fff87e",
  },
  {
    title: "St. Xavier's School",
    position: "High School",
    date: "(2007 - 2019)",
    description:
      "was a seasoned procrastinator… until the all-nighters caught up to me",
    color: "#04bade",
  },
];

export default function Education() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Memoize event handlers
  const handleHoverStart = useCallback((title: string) => {
    setHoveredItem(title);
  }, []);

  const handleHoverEnd = useCallback(() => {
    setHoveredItem(null);
  }, []);

  // Memoize animation variants
  const containerVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    }),
    []
  );

  const titleVariants = useMemo(
    () => ({
      hidden: { opacity: 0, x: -20 },
      visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.2 } },
    }),
    []
  );

  const timelineVariants = useMemo(
    () => ({
      hidden: { height: 0 },
      visible: { height: "100%", transition: { duration: 0.8 } },
    }),
    []
  );

  // Memoize title animati
  return (
    <motion.div
      className="relative mb-16 text-white will-change-transform"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1
        className="relative inline-block font-bold text-2xl text-white"
        variants={titleVariants}
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <span className="inline-block text-green-300 will-change-transform">
          &gt;
        </span>{" "}
        <span className="group relative">
          <span className="animate-shimmer bg-[length:200%_100%] bg-gradient-to-r from-white via-green-200 to-white bg-clip-text text-transparent">
            education
          </span>
        </span>
      </motion.h1>

      <div className="relative mt-10">
        {/* Main vertical timeline line */}
        <motion.div
          className="absolute top-0 bottom-0 left-[6px] h-full w-[1px] bg-zinc-800 will-change-transform"
          variants={timelineVariants}
        />

        {edu.map((edu, index) => {
          const isHovered = hoveredItem === edu.title;

          // Memoize item variants for each education item
          const itemVariants = {
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, delay: 0.3 + index * 0.2 },
            },
          };

          // Particle effects generated when hovered (no hooks inside loop)
          const particleEffects = isHovered
            ? [...Array(6)].map((_, i) => {
                const leftOffset = 50 + (Math.random() - 0.5) * 20;
                const topOffset = 50 + (Math.random() - 0.5) * 20;
                const xMovement = (Math.random() - 0.5) * 100;
                const yMovement = (Math.random() - 0.5) * 60;
                const width = Math.random() * 4 + 2;
                const height = Math.random() * 4 + 2;
                const duration = 1 + Math.random() * 0.5;
                const delay = Math.random() * 0.5;

                return (
                  <motion.div
                    key={`particle-${edu.title}-${i}`}
                    className="pointer-events-none absolute z-0 rounded-full will-change-transform"
                    initial={{
                      opacity: 0,
                      scale: 0,
                      x: 0,
                      y: 0,
                    }}
                    animate={{
                      opacity: [0, 0.7, 0],
                      scale: [0, 1, 0],
                      x: [0, xMovement],
                      y: [0, yMovement],
                    }}
                    transition={{
                      duration,
                      repeat: Number.POSITIVE_INFINITY,
                      delay,
                      repeatType: "loop",
                    }}
                    style={{
                      left: `${leftOffset}%`,
                      top: `${topOffset}%`,
                      width: `${width}px`,
                      height: `${height}px`,
                      backgroundColor: edu.color,
                      filter: "blur(1px)",
                    }}
                  />
                );
              })
            : null;

          return (
            <motion.div
              key={edu.title}
              className="group relative mt-10 pl-10"
              variants={itemVariants}
              onHoverStart={() => handleHoverStart(edu.title)}
              onHoverEnd={handleHoverEnd}
            >
              {/* Card background with glass effect */}
              <motion.div
                className="-inset-6 -z-10 absolute rounded-xl backdrop-blur-sm will-change-transform"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: isHovered ? 0.1 : 0,
                  backgroundColor: edu.color,
                  boxShadow: isHovered ? `0 0 30px ${edu.color}30` : "none",
                }}
                transition={{ duration: 0.3 }}
              />

              {/* Timeline dot - positioned correctly */}
              <motion.div
                className={
                  "absolute top-1.5 left-0 h-3 w-3 rounded-full border border-zinc-700 bg-[#121212] will-change-transform"
                }
                initial={{ scale: 0 }}
                animate={{
                  scale: 1,
                  backgroundColor: isHovered ? edu.color : "#121212",
                  borderColor: isHovered ? edu.color : "rgb(63, 63, 70)",
                  boxShadow: isHovered ? `0 0 10px ${edu.color}` : "none",
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 15,
                  delay: 0.6 + index * 0.2,
                }}
              />

              {/* Pulse effect for timeline dot when hovered - conditionally rendered */}
              {isHovered && (
                <motion.div
                  className="pointer-events-none absolute top-1.5 left-0 h-3 w-3 rounded-full will-change-transform"
                  initial={{ scale: 1, opacity: 0.7 }}
                  animate={{
                    scale: [1, 1.8, 1],
                    opacity: [0.7, 0, 0.7],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                  }}
                  style={{ backgroundColor: edu.color }}
                />
              )}

              {/* Title */}
              <div className="overflow-hidden">
                <motion.span
                  className="relative inline-block font-bold text-xl"
                  // whileHover={{ scale: 1.02, x: 5 }}
                  // transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  style={{
                    color: isHovered ? edu.color : undefined,
                    willChange: "transform, color",
                  }}
                >
                  {edu.title}
                </motion.span>
              </div>

              {/* Position and date with animation */}
              <motion.p
                className="mt-2 flex items-center text-gray-500 text-xs"
                animate={{
                  color: isHovered ? edu.color : "#6b7280",
                  x: isHovered ? 5 : 0,
                }}
                transition={{ duration: 0.3 }}
                style={{ willChange: isHovered ? "transform, color" : "auto" }}
              >
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.2 }}
                >
                  {edu.position}
                </motion.span>
                <motion.span
                  className="mx-2 opacity-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  transition={{ delay: 0.8 + index * 0.2 }}
                >
                  |
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.2 }}
                >
                  {edu.date}
                </motion.span>
              </motion.p>

              {/* Description with character animation - optimized with memoization */}
              <motion.p
                className="relative mt-5 text-gray-400 text-sm"
                animate={{
                  color: isHovered ? "#d1d5db" : "#9ca3af",
                  x: isHovered ? 5 : 0,
                }}
                transition={{ duration: 0.3 }}
                style={{ willChange: isHovered ? "transform, color" : "auto" }}
              >
                {edu.description}
              </motion.p>

              {/* View more link - conditionally rendered */}
              <motion.div
                className="mt-4 overflow-hidden will-change-transform"
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: isHovered ? "auto" : 0,
                  opacity: isHovered ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
              />
              {/* Particle effects on hover - optimized with memoization */}
              {particleEffects}
            </motion.div>
          );
        })}
      </div>

      {/* Decorative elements - optimized with will-change */}
      <motion.div
        className="-left-20 pointer-events-none absolute top-1/2 h-40 w-40 rounded-full bg-green-300/5 blur-3xl will-change-transform"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
        }}
      />
    </motion.div>
  );
}
