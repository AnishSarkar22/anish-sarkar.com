"use client";

import { ProjectCards } from "~/components/ProjectCards";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { projectList } from "~/components/Projects";

export default function Projects() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  const techList = [
    "Appwrite",
    "Docker",
    "Flask",
    "Matplotlib",
    "NumPy",
    "Pandas",
    "PyTorch",
    "Python",
    "React",
    "Svelte",
    "Sveltekit",
    "Supabase",
    "Streamlit",
    "TypeScript",
    "scikit-learn",
    "Java",
    "JavaScript",
    "Nginx",
    "HTML",
    "JUnit",
    "netty-socketio",
  ];

  // Extract unique categories from projects
  const categories = [
    "All",
    ...Array.from(
      new Set(
        projectList
          .flatMap((project) => project.technologies)
          .filter((tech) => techList.includes(tech))
      )
    ).sort(),
  ];

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

        {/* Ultra-enhanced animated cosmic particles */}
        {/* {(() => {
          // Generate particle data with unique IDs
          const particles = Array.from({ length: 30 }, () => ({
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
            animateY: -Math.random() * 150 - 50,
            animateX: (Math.random() - 0.5) * 80,
            animateScale: 1 + Math.random() * 0.5,
            animateRotate: Math.random() * 360,
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
                opacity: [0, 0.8, 0],
                y: [0, particle.animateY],
                x: [0, particle.animateX],
                scale: [0, particle.animateScale, 0],
                rotate: [0, particle.animateRotate],
              }}
              transition={{
                duration: particle.duration,
                repeat: Number.POSITIVE_INFINITY,
                delay: particle.delay,
                ease: "easeInOut",
              }}
            />
          ));
        })()} */}

        {/* Reactive glow effect that follows mouse */}

        {/* Cosmic grid lines */}
        {/* <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(52, 211, 153, 0.5) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(52, 211, 153, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        /> */}
      </div>

      <div className="relative z-10 flex-1">
        {/* Ultra-enhanced header with animated styling */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <motion.h1
            className="relative inline-block font-bold text-5xl text-white"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.03 }}
            // className="text-5xl font-bold mb-2 relative inline-block"
            // whileHover={{ scale: 1.03 }}
            // transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <span className="inline-block text-green-300 will-change-transform">
              &gt;
            </span>{" "}
            <span className="relative">
              projects
              {/* Animated underline with glow */}
              {/* <motion.span 
                className="-bottom-1 absolute left-0 h-[2px] bg-gradient-to-r from-green-300/0 via-green-300 to-green-300/0"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, delay: 0.5 }}
              />  */}
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="relative mb-12 flex flex-wrap gap-3"
        >
          {/* Animated background glow for active category */}
          <motion.div
            className="-z-10 absolute inset-0 rounded-full bg-green-300/5 blur-xl filter"
            animate={{
              x: categories.findIndex((cat) => cat === activeCategory) * 110,
              opacity: [0.5, 0.8, 0.5],
              scale: [0.9, 1.1, 0.9],
            }}
            transition={{
              x: { type: "spring", stiffness: 200, damping: 30 },
              opacity: { duration: 2, repeat: Number.POSITIVE_INFINITY },
              scale: { duration: 3, repeat: Number.POSITIVE_INFINITY },
            }}
          />

          {categories.map((category, index) => (
            <motion.button
              key={category}
              onClick={() => setActiveCategory(category)}
              onMouseEnter={() => setHoveredCategory(category)}
              onMouseLeave={() => setHoveredCategory(null)}
              className={"relative overflow-hidden rounded-full px-4 py-2 font-medium text-sm transition-all duration-300"}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              // transition={{ delay: 0.5 + index * 0.1 }}
            >
              {/* Background for button */}
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

              {/* Hover effect */}
              {hoveredCategory === category && category !== activeCategory && (
                <motion.div
                  className="-z-10 absolute inset-0 rounded-full bg-green-300/10 opacity-0"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.2 }}
                  transition={{ duration: 0.2 }}
                />
              )}

              {/* Cosmic particles on active button */}
              {/* {category === activeCategory && (
                Array.from({ length: 5 }).map(() => {
                  const particleKey = `btn-particle-${crypto.randomUUID()}`;
                  return (
                    <motion.div
                      key={particleKey}
                      className="pointer-events-none absolute rounded-full bg-green-300/80"
                      style={{
                        width: Math.random() * 2 + 1,
                        height: Math.random() * 2 + 1,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        filter: "blur(0.5px)",
                      }}
                      animate={{
                        opacity: [0, 1, 0],
                        y: [0, (Math.random() - 0.5) * 20],
                        x: [0, (Math.random() - 0.5) * 20],
                        scale: [0, 1, 0],
                      }}
                      transition={{
                        duration: 1.5 + Math.random(),
                        repeat: Number.POSITIVE_INFINITY,
                        delay: Math.random(),
                      }}
                    />
                  );
                })
              )} */}

              {/* Text with glow effect for active category */}
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
        </motion.div>

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

        {/* Ultra-enhanced cosmic footer - Completely redesigned */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="relative mt-32"
        >
          {/* Cosmic signature - Ultra enhanced */}
          <div className="border-zinc-800/30 border-t pt-12 text-center">
            {/* Elegant divider with animated particles */}
            <div className="relative mx-auto mb-8 w-full max-w-xs">
              <motion.div
                className="h-px w-full bg-gradient-to-r from-transparent via-green-300/50 to-transparent"
                animate={{
                  opacity: [0.3, 0.7, 0.3],
                  width: ["70%", "100%", "70%"],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
                style={{ margin: "0 auto" }}
              />

              {/* Elegant floating particles */}
              {[...Array(7)].map((_, i) => {
                const particleKey = `line-particle-${crypto.randomUUID()}`;
                return (
                  <motion.div
                    key={particleKey}
                    className="absolute top-0 h-[2px] w-[2px] rounded-full bg-green-300"
                    initial={{ left: `${i * 16.6}%`, opacity: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      y: [-1, 1, -1],
                      boxShadow: [
                        "0 0 2px rgba(52, 211, 153, 0.3)",
                        "0 0 4px rgba(52, 211, 153, 0.8)",
                        "0 0 2px rgba(52, 211, 153, 0.3)",
                      ],
                    }}
                    transition={{
                      duration: 2 + i * 0.5,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.3,
                    }}
                  />
                );
              })}
            </div>

            {/* Ultra-enhanced signature with elegant glass effect */}
            <motion.div
              className="mb-6 inline-block"
              whileHover={{
                scale: 1.05,
                y: -2,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <motion.div
                className="relative overflow-hidden rounded-full px-8 py-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                {/* Subtle glass background */}
                <motion.div
                  className="absolute inset-0 rounded-full opacity-10"
                  animate={{
                    background: [
                      "linear-gradient(120deg, rgba(52, 211, 153, 0.05) 0%, rgba(52, 211, 153, 0.1) 50%, rgba(52, 211, 153, 0.05) 100%)",
                      "linear-gradient(240deg, rgba(52, 211, 153, 0.05) 0%, rgba(52, 211, 153, 0.1) 50%, rgba(52, 211, 153, 0.05) 100%)",
                      "linear-gradient(120deg, rgba(52, 211, 153, 0.05) 0%, rgba(52, 211, 153, 0.1) 50%, rgba(52, 211, 153, 0.05) 100%)",
                    ],
                  }}
                  transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY }}
                />

                {/* Subtle border */}
                <motion.div
                  className="absolute inset-0 rounded-full opacity-20"
                  style={{
                    border: "1px solid rgba(52, 211, 153, 0.2)",
                  }}
                />

                {/* Animated text with elegant styling */}
                <motion.div className="relative z-10 font-medium text-base tracking-wider">
                  <motion.span
                    className="bg-gradient-to-r from-green-200 via-green-300 to-green-200 bg-clip-text font-medium text-transparent"
                    animate={{
                      backgroundPosition: [
                        "0% center",
                        "100% center",
                        "0% center",
                      ],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "mirror",
                    }}
                    style={{
                      backgroundSize: "200% auto",
                    }}
                  >
                    Designed & Built with{" "}
                  </motion.span>
                  <motion.span
                    className="relative inline-block"
                    animate={{
                      scale: [1, 1.2, 1],
                      y: [0, -2, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatDelay: 3,
                    }}
                  >
                    <span className="relative z-10">❤️</span>
                    <motion.div
                      className="-inset-3 absolute z-0 rounded-full opacity-0"
                      animate={{
                        opacity: [0, 0.5, 0],
                        scale: [1, 1.5, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatDelay: 3,
                      }}
                      style={{
                        background:
                          "radial-gradient(circle, rgba(239, 68, 68, 0.3) 0%, transparent 70%)",
                      }}
                    />
                  </motion.span>
                  <motion.span
                    className="bg-gradient-to-r from-green-200 via-green-300 to-green-200 bg-clip-text font-medium text-transparent"
                    animate={{
                      backgroundPosition: [
                        "0% center",
                        "100% center",
                        "0% center",
                      ],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "mirror",
                    }}
                    style={{
                      backgroundSize: "200% auto",
                    }}
                  >
                    {" "}
                    by{" "}
                  </motion.span>
                  <motion.span
                    className="relative inline-block bg-gradient-to-r from-green-300 via-green-400 to-green-300 bg-clip-text font-bold text-transparent"
                    animate={{
                      backgroundPosition: [
                        "0% center",
                        "100% center",
                        "0% center",
                      ],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "mirror",
                    }}
                    style={{
                      backgroundSize: "200% auto",
                    }}
                    whileHover={{
                      letterSpacing: "0.05em",
                      textShadow: "0 0 8px rgba(52, 211, 153, 0.5)",
                    }}
                  >
                    anish
                    {/* Elegant animated underline */}
                    <motion.div
                      className="-bottom-1 absolute left-0 h-[1px] w-full"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: [0, 1, 1, 0] }}
                      transition={{
                        duration: 4,
                        repeat: Number.POSITIVE_INFINITY,
                        times: [0, 0.2, 0.8, 1],
                        repeatDelay: 1,
                      }}
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, rgba(52, 211, 153, 0.8), rgba(52, 211, 153, 0.8), transparent)",
                        transformOrigin: "left",
                      }}
                    />
                  </motion.span>
                </motion.div>

                {/* Subtle floating particles */}
                {/* {[...Array(5)].map(() => {
                  const particleKey = `sign-particle-${crypto.randomUUID()}`;
                  return (
                    <motion.div
                      key={particleKey}
                      className="absolute rounded-full bg-green-300/60"
                      style={{
                        width: Math.random() * 2 + 1,
                        height: Math.random() * 2 + 1,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        filter: "blur(0.5px)",
                      }}
                      animate={{
                        opacity: [0, 0.6, 0],
                        y: [0, (Math.random() - 0.5) * 15],
                        x: [0, (Math.random() - 0.5) * 15],
                      }}
                      transition={{
                        duration: 2 + Math.random() * 2,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: Math.random() * 2,
                      }}
                    />
                  );
                })} */}
              </motion.div>
            </motion.div>

            {/* Copyright with elegant styling */}
            <motion.div
              className="mb-6 text-gray-500/70 text-xs"
              whileHover={{
                color: "rgba(134, 239, 172, 0.8)",
                letterSpacing: "0.05em",
                textShadow: "0 0 5px rgba(52, 211, 153, 0.2)",
              }}
              transition={{ duration: 0.3 }}
            >
              © {new Date().getFullYear()} • All rights reserved
            </motion.div>

            {/* Code signature with elegant animation - Enhanced */}
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="relative"
                whileHover={{
                  scale: 1.1,
                  y: -2,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <motion.div
                  className="bg-gradient-to-r from-green-300/60 via-green-300 to-green-300/60 bg-clip-text font-bold font-mono text-lg text-transparent"
                  animate={{
                    backgroundPosition: [
                      "0% center",
                      "100% center",
                      "0% center",
                    ],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "mirror",
                  }}
                  style={{
                    backgroundSize: "200% auto",
                  }}
                  whileHover={{
                    letterSpacing: "0.2em",
                    textShadow: "0 0 8px rgba(52, 211, 153, 0.5)",
                  }}
                >
                  &lt;/&gt;
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </motion.footer>
      </div>
    </main>
  );
}
