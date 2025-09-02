"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { trackEvent } from "~/utils/posthog";

// Dynamically import components for server-side rendering
const About = dynamic(() => import("~/components/About"), { ssr: true });
const Education = dynamic(() => import("~/components/Education"), {
  ssr: true,
});
const Experience = dynamic(() => import("~/components/Experience"), {
  ssr: true,
});
const Socials = dynamic(() => import("~/components/Socials"), { ssr: true });
const GitCommitHistory = dynamic(
  () => import("~/components/GitCommitHistory"),
  { ssr: true }
);
const HobbySection = dynamic(() => import("~/components/HobbySection"), {
  ssr: true,
});
const SkillsSection = dynamic(() => import("~/components/SkillsSection"), {
  ssr: true,
});
const LocationSection = dynamic(() => import("~/components/LocationSection"), {
  ssr: false,
});
// Define custom mouse tracking interface
interface MousePosition {
  x: number;
  y: number;
  down: boolean;
}

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const mousePosition = useRef<MousePosition>({ x: 0, y: 0, down: false });
  const [hoverProfile, setHoverProfile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Track home page view (for posthog analytics)
    trackEvent("home_page_view", {
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,
      user_agent: navigator.userAgent,
    });

    const handleScroll = () => {
      setScrollY(window.scrollY);

      // Track scroll behavior (for posthog analytics)
      const scrollPercentage =
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
        100;

      if (scrollPercentage > 50) {
        trackEvent("home_scroll_engagement", {
          scroll_percentage: Math.round(scrollPercentage),
          engagement_level: "high",
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current.x = e.clientX;
      mousePosition.current.y = e.clientY;
    };

    const handleMouseDown = () => {
      mousePosition.current.down = true;
    };

    const handleMouseUp = () => {
      mousePosition.current.down = false;
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("resize", handleResize);

    // Initial check
    handleResize();
    setIsLoaded(true);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Track profile hover (for posthog analytics)
  const handleProfileHover = () => {
    setHoverProfile(true);
    trackEvent("profile_image_hover", {
      interaction_type: "hover",
    });
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null;
  }

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.6,
        ease: "easeOut" as const,
      },
    }),
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Anish Sarkar",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    sameAs: [
      "https://github.com/AnishSarkar22",
      "https://linkedin.com/in/anishsarkar22",
      "https://twitter.com/AnishSarkar22",
    ],
    jobTitle: "Backend Developer",
    description: "University Undergrad, full time coder, and AIML enthusiast",
    knowsAbout: [
      "Backend Development",
      "Machine Learning",
      "Python",
      "React",
      "Next.js",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <main className="relative mx-auto flex min-h-screen max-w-3xl flex-col p-8 text-white md:p-16 lg:p-24">
        {/* Background elements */}
        <div className="-z-10 fixed inset-0 bg-black">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(50,50,50,0.1),rgba(0,0,0,0)_50%)]" />
          <motion.div
            className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-green-300/30 to-transparent"
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
            className="-top-20 -left-20 absolute h-60 w-60 rounded-full opacity-10 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.05, 0.1, 0.05],
              x: [0, 10, 0],
              y: [0, 10, 0],
            }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
            style={{
              background:
                "radial-gradient(circle, #34d399 0%, transparent 70%)",
            }}
          />
          <motion.div
            className="-bottom-20 -right-20 absolute h-80 w-80 rounded-full opacity-10 blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.05, 0.08, 0.05],
              x: [0, -10, 0],
              y: [0, -10, 0],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              delay: 1,
            }}
            style={{
              background:
                "radial-gradient(circle, #34d399 0%, transparent 70%)",
            }}
          />
        </div>

        {/* Enhanced Header with profile */}
        <motion.div
          className={`${
            isMobile ? "relative" : "sticky top-4"
          } z-50 mb-16 overflow-hidden rounded-2xl border border-zinc-800/50 bg-zinc-900/60 shadow-2xl backdrop-blur-xl`}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            boxShadow:
              "0 10px 40px -10px rgba(0, 0, 0, 0.7), 0 0 15px rgba(52, 211, 153, 0.15)",
          }}
          onHoverStart={() => setHoverProfile(true)}
          onHoverEnd={() => setHoverProfile(false)}
        >
          <div className="relative">
            {/* Cosmic background with animated nebula */}
            <motion.div
              className="-z-10 absolute inset-0 opacity-30"
              animate={{
                background: [
                  "linear-gradient(45deg, rgba(52, 211, 153, 0.05) 0%, rgba(8, 47, 73, 0.1) 100%)",
                  "linear-gradient(45deg, rgba(8, 47, 73, 0.1) 0%, rgba(52, 211, 153, 0.05) 100%)",
                  "linear-gradient(45deg, rgba(52, 211, 153, 0.05) 0%, rgba(8, 47, 73, 0.1) 100%)",
                ],
              }}
              transition={{
                duration: 10,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />

            {/* Cosmic energy lines */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={`energy-line-${i}-${Math.random().toString(36).substr(2, 9)}`}
                className="absolute h-[1px] bg-gradient-to-r from-transparent via-green-300/40 to-transparent"
                style={{
                  top: `${30 + i * 20}%`,
                  left: 0,
                  right: 0,
                  opacity: 0,
                }}
                animate={{
                  opacity: [0, 0.8, 0],
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 4 + i,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 2,
                }}
              />
            ))}

            <div className="flex flex-col items-center gap-3 p-3 sm:flex-row sm:gap-5 sm:p-5">
              {/* profile image with cosmic effects */}
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                onHoverStart={handleProfileHover}
                onHoverEnd={() => setHoverProfile(false)}
              >
                {/* Cosmic energy field */}
                <motion.div
                  className="-inset-3 absolute rounded-full opacity-0"
                  animate={{
                    opacity: hoverProfile ? [0, 0.3, 0] : 0,
                    scale: hoverProfile ? [0.8, 1.2, 0.8] : 0.8,
                  }}
                  transition={{
                    duration: 2,
                    repeat: hoverProfile ? Number.POSITIVE_INFINITY : 0,
                  }}
                  style={{
                    background:
                      "radial-gradient(circle, rgba(52, 211, 153, 0.5) 0%, transparent 70%)",
                    filter: "blur(8px)",
                  }}
                />

                {/* Orbital ring */}
                <motion.div
                  className="-inset-2 absolute rounded-full opacity-0"
                  animate={{
                    opacity: hoverProfile ? 0.7 : 0,
                    rotate: [0, 360],
                  }}
                  transition={{
                    opacity: { duration: 0.3 },
                    rotate: { duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                  }}
                  style={{
                    border: "1px dashed rgba(52, 211, 153, 0.3)",
                    boxShadow: "0 0 15px rgba(52, 211, 153, 0.2)",
                  }}
                />

                {/* Pulsing glow */}
                <motion.div
                  className="-inset-1.5 absolute rounded-full"
                  animate={{
                    boxShadow: hoverProfile
                      ? [
                          "0 0 0 rgba(52, 211, 153, 0)",
                          "0 0 25px rgba(52, 211, 153, 0.7)",
                          "0 0 5px rgba(52, 211, 153, 0.3)",
                        ]
                      : [
                          "0 0 0 rgba(52, 211, 153, 0)",
                          "0 0 15px rgba(52, 211, 153, 0.5)",
                          "0 0 0 rgba(52, 211, 153, 0)",
                        ],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />

                {/* Rotating cosmic border */}
                <motion.div
                  className="-inset-0.5 absolute rounded-full opacity-70"
                  style={{
                    background:
                      "conic-gradient(from 0deg, rgba(52, 211, 153, 0), rgba(52, 211, 153, 0.8), rgba(52, 211, 153, 0))",
                  }}
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />

                {/* Secondary rotating border (opposite direction) */}
                <motion.div
                  className="-inset-1 absolute rounded-full opacity-30"
                  style={{
                    background:
                      "conic-gradient(from 180deg, rgba(52, 211, 153, 0), rgba(52, 211, 153, 0.4), rgba(52, 211, 153, 0))",
                  }}
                  animate={{ rotate: [360, 0] }}
                  transition={{
                    duration: 12,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />

                <div className="relative z-10 flex items-center justify-center overflow-hidden rounded-full border-2 border-green-300/30">
                  <motion.div
                    whileHover={{
                      scale: 1.15,
                      filter: "grayscale(0%) contrast(1.1) brightness(1.1)",
                      rotateZ: [0, 5, -5, 0],
                      transition: { duration: 0.8, ease: "easeInOut" },
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Cosmic energy rays on hover */}
                    <motion.div
                      className="pointer-events-none absolute inset-0 z-20"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    >
                      {[...Array(12)].map((_, i) => (
                        <motion.div
                          key={`avatar-ray-${i}-${Math.random().toString(36).substr(2, 9)}`}
                          className="absolute top-1/2 left-1/2 h-[1px] w-full origin-left"
                          style={{
                            rotate: `${i * 30}deg`,
                            background:
                              "linear-gradient(90deg, rgba(52, 211, 153, 0.8) 0%, rgba(52, 211, 153, 0) 100%)",
                            opacity: 0,
                          }}
                          whileHover={{
                            opacity: [0, 0.8, 0],
                            scaleX: [0, 1.5, 0],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: i * 0.1,
                            repeatDelay: 0.5,
                          }}
                        />
                      ))}
                    </motion.div>

                    {/* Cosmic energy burst on hover */}
                    <motion.div
                      className="pointer-events-none absolute inset-0 z-10 rounded-full"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    >
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{
                          background:
                            "radial-gradient(circle, rgba(52, 211, 153, 0.4) 0%, rgba(52, 211, 153, 0) 70%)",
                        }}
                        whileHover={{
                          scale: [1, 1.5, 1],
                          opacity: [0, 0.8, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                        }}
                      />

                      {/* Cosmic particles explosion */}
                      {[...Array(20)].map((_, i) => (
                        <motion.div
                          key={`avatar-particle-${i}-${Math.random().toString(36).substr(2, 9)}`}
                          className="absolute h-1 w-1 rounded-full bg-green-300"
                          style={{
                            top: "50%",
                            left: "50%",
                            opacity: 0,
                          }}
                          whileHover={{
                            opacity: [0, 1, 0],
                            scale: [0, 0.5 + ((i * 0.1) % 2), 0],
                            x: [
                              0,
                              ((i % 2 === 0 ? 1 : -1) * (15 + i * 2)) % 60,
                            ],
                            y: [
                              0,
                              ((i % 3 === 0 ? 1 : -1) * (10 + i * 3)) % 60,
                            ],
                          }}
                          transition={{
                            duration: 1 + ((i * 0.1) % 1),
                            repeat: Number.POSITIVE_INFINITY,
                            delay: (i * 0.1) % 0.5,
                          }}
                        />
                      ))}
                    </motion.div>

                    {/* Holographic overlay effect */}
                    <motion.div
                      className="pointer-events-none absolute inset-0 rounded-full mix-blend-overlay"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(52, 211, 153, 0.3) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(52, 211, 153, 0.3) 100%)",
                        opacity: 0,
                      }}
                      whileHover={{
                        opacity: 0.7,
                        backgroundPosition: ["0% 0%", "100% 100%"],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                      }}
                    />

                    <Image
                      src="/mine.png"
                      alt="Profile Image"
                      width={60}
                      height={60}
                      className="h-[50px] w-[50px] object-cover grayscale transition-all duration-300 hover:grayscale-0 sm:h-[60px] sm:w-[60px] md:h-[70px] md:w-[70px]"
                    />

                    {/* Cosmic energy overlay */}
                    <motion.div className="absolute inset-0 bg-gradient-to-tr from-green-500/10 to-transparent opacity-0 transition-opacity duration-300 hover:opacity-60" />

                    {/* Cosmic flare effect */}
                    <motion.div
                      className="absolute inset-0 bg-white opacity-0"
                      animate={
                        hoverProfile
                          ? {
                              opacity: [0, 0.3, 0],
                              scale: [0.8, 1.2, 0.8],
                            }
                          : {}
                      }
                      transition={{
                        duration: 1.5,
                        repeat: hoverProfile ? 1 : 0,
                      }}
                    />
                  </motion.div>
                </div>
              </motion.div>

              {/* Enhanced name and username with cosmic typography */}
              <div className="mt-2 text-center sm:mt-0 sm:text-left">
                <motion.h1
                  className="relative inline-block font-bold text-xl sm:text-2xl"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <motion.span
                    className="relative z-10 inline-block text-white"
                    whileHover={{
                      scale: [1, 1.1, 0.9, 1.05, 1],
                      rotate: [0, 5, -5, 3, 0],
                      transition: { duration: 0.6 },
                    }}
                  >
                    {/* Particles effect on hover */}
                    <motion.div
                      className="pointer-events-none absolute inset-0"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    >
                      {[...Array(20)].map((_, i) => (
                        <motion.div
                          key={`text-particle-${i}-${Math.random().toString(36).substr(2, 9)}`}
                          className="absolute h-1 w-1 rounded-full"
                          style={{
                            left: "50%",
                            top: "50%",
                            backgroundColor: `hsl(${160 + ((i * 7) % 20)}, ${
                              80 + ((i * 3) % 20)
                            }%, ${70 + ((i * 5) % 20)}%)`,
                          }}
                          initial={{ scale: 0, x: 0, y: 0 }}
                          whileHover={{
                            scale: [0, 1, 0],
                            x: [
                              0,
                              ((i % 2 === 0 ? 1 : -1) * (20 + i * 3)) % 80,
                            ],
                            y: [
                              0,
                              ((i % 3 === 0 ? 1 : -1) * (15 + i * 2)) % 80,
                            ],
                            opacity: [0, 1, 0],
                          }}
                          transition={{
                            duration: 0.8 + ((i * 0.1) % 0.5),
                            ease: "easeOut",
                            delay: (i * 0.05) % 0.2,
                          }}
                        />
                      ))}
                    </motion.div>

                    {/* Ultra-enhanced dancing letters effect with dimensional cosmic animations */}
                    <span className="relative inline-block">
                      {"anish".split("").map((letter, i) => (
                        <motion.span
                          key={`letter-${letter}-${i}-${Math.random().toString(36).substr(2, 9)}`}
                          className="inline-block"
                          initial={{
                            y: 0,
                            x: 0,
                            scale: 1,
                            rotate: 0,
                            color: "#ffffff",
                          }}
                          whileHover={{
                            y: [0, -15, 5, -10, 0],
                            x: [
                              0,
                              i % 2 === 0 ? 8 : -8,
                              i % 2 === 0 ? -4 : 4,
                              0,
                            ],
                            color: [
                              "#ffffff",
                              `hsl(${142 + i * 10}, 100%, 70%)`,
                              `hsl(${142 + i * 20}, 90%, 60%)`,
                              "#ffffff",
                            ],
                            scale: [1, 1.5, 0.8, 1.3, 1],
                            rotate: [
                              0,
                              i % 2 === 0 ? 15 : -15,
                              i % 2 === 0 ? -8 : 8,
                              0,
                            ],
                            filter: [
                              "drop-shadow(0 0 0px rgba(52, 211, 153, 0))",
                              "drop-shadow(0 0 10px rgba(52, 211, 153, 0.8))",
                              "drop-shadow(0 0 5px rgba(52, 211, 153, 0.4))",
                              "drop-shadow(0 0 0px rgba(52, 211, 153, 0))",
                            ],
                            transition: {
                              duration: 1.2,
                              delay: i * 0.08,
                              ease: [0.22, 1, 0.36, 1],
                            },
                          }}
                        >
                          {/* Cosmic glow effect per letter */}
                          <motion.div
                            className="-z-10 absolute inset-0 rounded-md"
                            initial={{ opacity: 0 }}
                            whileHover={{
                              opacity: [0, 0.8, 0.2, 0.6, 0],
                              scale: [0.8, 1.2, 1, 1.1, 0.9],
                            }}
                            transition={{
                              duration: 1.5,
                              delay: i * 0.08,
                            }}
                            style={{
                              background: "radial-gradient(circle, rgba(52, 211, 153, 0.8) 0%, rgba(52, 211, 153, 0) 70%)",
                              filter: "blur(8px)",
                            }}
                          />

                          {/* Cosmic trails for each letter */}
                          <motion.div
                            className="-z-10 absolute inset-0"
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            {[...Array(5)].map((_, j) => (
                              <motion.div
                                key={`letter-trail-${i}-${j}-${Math.random().toString(36).substr(2, 9)}`}
                                className="absolute inset-0 rounded-full"
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileHover={{
                                  opacity: [0, 0.5, 0],
                                  scale: [1, 0.8, 0.6],
                                  y: [0, j * 3],
                                  x: [0, i % 2 === 0 ? j * 2 : j * -2],
                                }}
                                transition={{
                                  duration: 0.8,
                                  delay: j * 0.1,
                                  repeat: Number.POSITIVE_INFINITY,
                                  repeatDelay: 0.2,
                                }}
                                style={{
                                  background: `radial-gradient(circle, rgba(${
                                    52 + i * 20
                                  }, ${211 - i * 10}, 153, ${
                                    0.7 - j * 0.1
                                  }) 0%, transparent 70%)`,
                                  filter: "blur(3px)",
                                }}
                              />
                            ))}
                          </motion.div>

                          {/* Cosmic particles explosion for each letter */}
                          <motion.div
                            className="-z-10 absolute inset-0"
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            {[...Array(8)].map((_, j) => (
                              <motion.div
                                key={`letter-particle-${i}-${j}-${Math.random().toString(36).substr(2, 9)}`}
                                className="absolute h-1 w-1 rounded-full"
                                style={{
                                  left: "50%",
                                  top: "50%",
                                  backgroundColor: `hsl(${
                                    142 + ((j * 5) % 30)
                                  }, ${80 + ((j * 3) % 20)}%, ${
                                    70 + ((j * 4) % 20)
                                  }%)`,
                                }}
                                initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
                                whileHover={{
                                  scale: [0, 0.5 + ((j * 0.1) % 1), 0],
                                  x: [
                                    0,
                                    ((j % 2 === 0 ? 1 : -1) *
                                      (10 + j * 2) *
                                      (i + 1)) %
                                      30,
                                  ],
                                  y: [
                                    0,
                                    ((j % 3 === 0 ? 1 : -1) *
                                      (8 + j * 3) *
                                      (i + 1)) %
                                      30,
                                  ],
                                  opacity: [0, 1, 0],
                                }}
                                transition={{
                                  duration: 0.8 + ((j * 0.1) % 0.5),
                                  ease: "easeOut",
                                  delay: j * 0.1,
                                  repeat: Number.POSITIVE_INFINITY,
                                  repeatDelay: (j * 0.1) % 0.5,
                                }}
                              />
                            ))}
                          </motion.div>

                          {letter}
                        </motion.span>
                      ))}
                    </span>
                  </motion.span>

                  {/* Animated underline with glow */}
                  {/* <motion.span
                  className="-bottom-1 absolute left-0 h-[2px]"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(52, 211, 153, 0) 0%, rgba(52, 211, 153, 1) 50%, rgba(52, 211, 153, 0) 100%)",
                  }}
                  transition={{ duration: 1, delay: 0.8 }}
                /> */}

                  {/* Animated cosmic particles under text */}
                  {[...Array(3)].map((_, i) => {
                    const uniqueKey = `name-particle-${i}-${Math.random().toString(36).substr(2, 9)}`;
                    return (
                      <motion.div
                        key={uniqueKey}
                        className="absolute bottom-0 h-1 w-1 rounded-full bg-green-300"
                        style={{ left: `${20 + i * 30}%` }}
                        animate={{
                          y: [0, -10, 0],
                          opacity: [0, 0.8, 0],
                          scale: [0.5, 1.5, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: i * 0.7,
                          repeatDelay: 3,
                        }}
                      />
                    );
                  })}
                </motion.h1>

                {/* Username section with enhanced effects */}
                <motion.div
                  className="mt-1 flex items-center justify-center gap-1 sm:justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <motion.span
                    className="relative bg-gradient-to-r from-green-300 to-green-500 bg-clip-text font-medium text-transparent text-xs sm:text-sm"
                    // whileHover={{
                    //   scale: 1.05,
                    //   letterSpacing: "0.5px",
                    //   textShadow: "0 0 8px rgba(52, 211, 153, 0.5)"
                    // }}
                  >
                    @anishsarkar22
                    {/* Animated underline on hover */}
                    <motion.div
                      className="absolute bottom-0 left-0 h-[1px] w-0 bg-gradient-to-r from-green-300 to-green-500"
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                    {/* Sparkle effects on hover */}
                    <motion.div
                      className="-inset-1 pointer-events-none absolute"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    >
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={`username-sparkle-${i}-${Math.random().toString(36).substr(2, 9)}`}
                          className="absolute h-1 w-1 rounded-full bg-green-300"
                          style={{
                            top: `${((i * 27 + 15) % 80) + 10}%`,
                            left: `${((i * 43 + 25) % 80) + 10}%`,
                          }}
                          animate={{
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0],
                            x: [0, ((i % 2 === 0 ? 1 : -1) * (3 + i)) % 10],
                            y: [0, ((i % 3 === 0 ? 1 : -1) * (2 + i)) % 10],
                          }}
                          transition={{
                            duration: 1 + ((i * 0.2) % 1),
                            repeat: Number.POSITIVE_INFINITY,
                            delay: i * 0.2,
                            repeatDelay: (i * 0.3) % 1,
                          }}
                        />
                      ))}
                    </motion.div>
                  </motion.span>

                  {/* Enhanced cosmic verified badge */}
                  <motion.div
                    className="ml-1 flex h-3 w-3 items-center justify-center rounded-full bg-green-500/20 sm:h-4 sm:w-4"
                    whileHover={{
                      scale: 1.2,
                      boxShadow: "0 0 10px rgba(52, 211, 153, 0.5)",
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Cosmic rotation animation */}
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{
                        duration: 1,
                        ease: "easeInOut",
                        repeat: Number.POSITIVE_INFINITY,
                        repeatDelay: 3,
                      }}
                    >
                      <svg
                        width="8"
                        height="8"
                        className="sm:h-[10px] sm:w-[10px]"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <title>Verified badge</title>
                        <path
                          d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                          stroke="#34d399"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </motion.div>
                  </motion.div>
                </motion.div>

                {/* Enhanced bio with typing effect and cosmic particles */}
                <motion.div
                  className="relative mx-auto mt-1 max-w-[150px] overflow-hidden text-[10px] text-gray-500 sm:mx-0 sm:max-w-[200px] sm:text-xs"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  transition={{ delay: 1 }}
                  whileHover={{
                    opacity: 1,
                    scale: 1.02,
                    color: "rgb(134, 239, 172)",
                  }}
                >
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.2 }}
                    className="relative z-10"
                  >
                    building random stuff
                  </motion.p>
                  {/* Cosmic particles around bio */}
                  <motion.div
                    className="pointer-events-none absolute inset-0"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  >
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={`bio-particle-${i}-${Math.random().toString(36).substr(2, 9)}`}
                        className="absolute h-0.5 w-0.5 rounded-full bg-green-300/70"
                        style={{
                          top: `${(i * 17) % 100}%`,
                          left: `${(i * 29) % 100}%`,
                        }}
                        animate={{
                          opacity: [0, 1, 0],
                          scale: [0, 1, 0],
                          x: [0, ((i % 2 === 0 ? 1 : -1) * (5 + i)) % 15],
                          y: [0, ((i % 3 === 0 ? 1 : -1) * (3 + i)) % 10],
                        }}
                        transition={{
                          duration: 1.5 + ((i * 0.2) % 1),
                          repeat: Number.POSITIVE_INFINITY,
                          delay: i * 0.2,
                          repeatDelay: (i * 0.3) % 1,
                        }}
                      />
                    ))}
                  </motion.div>

                  {/* Subtle glow effect */}
                  <motion.div
                    className="pointer-events-none absolute inset-0 rounded-lg opacity-0"
                    whileHover={{ opacity: 0.15 }}
                    style={{
                      background:
                        "radial-gradient(circle, rgba(52, 211, 153, 0.3) 0%, transparent 70%)",
                      filter: "blur(5px)",
                    }}
                  />
                </motion.div>
              </div>

              {/* Ultra-cosmic hyper-enhanced online status badge */}
              <motion.div
                className="group relative mt-3 ml-0 flex items-center gap-1 overflow-hidden rounded-full border border-zinc-700/30 bg-zinc-800/30 px-2 py-1 sm:mt-0 sm:ml-auto sm:gap-2 sm:px-3 sm:py-1.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                whileHover={{
                  scale: 1.08,
                  backgroundColor: "rgba(52, 211, 153, 0.2)",
                  borderColor: "rgba(52, 211, 153, 0.5)",
                }}
              >
                {/* Cosmic nebula background */}
                <motion.div
                  className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, rgba(52, 211, 153, 0.4) 0%, rgba(16, 185, 129, 0.2) 40%, transparent 70%)",
                    filter: "blur(5px)",
                  }}
                />

                {/* Cosmic energy field */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-30"
                  animate={{
                    background: [
                      "radial-gradient(circle at 30% 50%, rgba(52, 211, 153, 0.4) 0%, transparent 50%)",
                      "radial-gradient(circle at 70% 50%, rgba(52, 211, 153, 0.4) 0%, transparent 50%)",
                      "radial-gradient(circle at 30% 50%, rgba(52, 211, 153, 0.4) 0%, transparent 50%)",
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                />

                {/* Animated cosmic dust */}
                <motion.div
                  className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.3 }}
                >
                  {[...Array(15)].map((_, i) => {
                    const uniqueKey = `badge-dust-${i}-${Math.random().toString(36).substr(2, 9)}`;
                    return (
                      <motion.div
                        key={uniqueKey}
                        className="absolute h-0.5 w-0.5 rounded-full bg-green-200"
                        style={{
                          top: `${(i * 13) % 100}%`,
                          left: `${(i * 19) % 100}%`,
                          opacity: 0,
                        }}
                        animate={{
                          opacity: [0, 0.8, 0],
                          scale: [0, 1, 0],
                          x: [0, ((i % 2 === 0 ? 1 : -1) * (5 + i)) % 20],
                          y: [0, ((i % 3 === 0 ? 1 : -1) * (3 + i)) % 10],
                        }}
                        transition={{
                          duration: 1 + ((i * 0.1) % 1),
                          repeat: Number.POSITIVE_INFINITY,
                          delay: i * 0.1,
                          repeatDelay: (i * 0.2) % 1,
                        }}
                      />
                    );
                  })}
                </motion.div>

                {/* Multi-layered animated border effect */}
                <motion.div
                  className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.3 }}
                >
                  {/* Top border */}
                  <motion.div
                    className="absolute top-0 left-0 h-[1px] w-full"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(52, 211, 153, 0.8), transparent)",
                    }}
                    animate={{
                      left: ["-100%", "100%"],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  />

                  {/* Bottom border */}
                  <motion.div
                    className="absolute right-0 bottom-0 h-[1px] w-full"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(52, 211, 153, 0.8), transparent)",
                    }}
                    animate={{
                      right: ["-100%", "100%"],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  />

                  {/* Left border */}
                  <motion.div
                    className="absolute top-0 left-0 h-full w-[1px]"
                    style={{
                      background:
                        "linear-gradient(180deg, transparent, rgba(52, 211, 153, 0.4), transparent)",
                    }}
                    animate={{
                      top: ["-100%", "100%"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                      delay: 0.5,
                    }}
                  />

                  {/* Right border */}
                  <motion.div
                    className="absolute right-0 bottom-0 h-full w-[1px]"
                    style={{
                      background:
                        "linear-gradient(180deg, transparent, rgba(52, 211, 153, 0.4), transparent)",
                    }}
                    animate={{
                      bottom: ["-100%", "100%"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                      delay: 0.5,
                    }}
                  />

                  {/* Corner accents */}
                  {[0, 1, 2, 3].map((i) => (
                    <motion.div
                      key={`corner-${i}`}
                      className="absolute h-2 w-2"
                      style={{
                        top: i < 2 ? -1 : "auto",
                        bottom: i >= 2 ? -1 : "auto",
                        left: i % 2 === 0 ? -1 : "auto",
                        right: i % 2 === 1 ? -1 : "auto",
                        borderTop:
                          i < 2 ? "1px solid rgba(52, 211, 153, 0.8)" : "none",
                        borderBottom:
                          i >= 2 ? "1px solid rgba(52, 211, 153, 0.8)" : "none",
                        borderLeft:
                          i % 2 === 0
                            ? "1px solid rgba(52, 211, 153, 0.8)"
                            : "none",
                        borderRight:
                          i % 2 === 1
                            ? "1px solid rgba(52, 211, 153, 0.8)"
                            : "none",
                        opacity: 0,
                      }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0.8, 1, 0.8],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: i * 0.5,
                      }}
                    />
                  ))}
                </motion.div>

                {/* Ultra-cosmic hyper-enhanced pulsing dot with dimensional effects */}
                <motion.div
                  className="relative h-2 w-2 rounded-full sm:h-2.5 sm:w-2.5"
                  style={{
                    background:
                      "conic-gradient(from 0deg, #10b981, #34d399, #6ee7b7, #34d399, #10b981)",
                  }}
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.2, 1],
                    opacity: [0.8, 1, 0.8],
                    boxShadow: [
                      "0 0 0 rgba(52, 211, 153, 0.4)",
                      "0 0 15px rgba(52, 211, 153, 0.8)",
                      "0 0 0 rgba(52, 211, 153, 0.4)",
                    ],
                  }}
                  transition={{
                    rotate: { duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                    scale: { duration: 2, repeat: Number.POSITIVE_INFINITY },
                    opacity: { duration: 2, repeat: Number.POSITIVE_INFINITY },
                    boxShadow: { duration: 2, repeat: Number.POSITIVE_INFINITY },
                  }}
                  whileHover={{
                    scale: 1.5,
                    boxShadow: "0 0 25px rgba(52, 211, 153, 1)",
                  }}
                >
                  {/* Dimensional core with 3D effect */}
                  <motion.div
                    className="absolute inset-[1px] z-10 rounded-full"
                    style={{
                      background:
                        "radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9) 0%, rgba(52, 211, 153, 0.8) 50%, rgba(16, 185, 129, 0.8) 100%)",
                      boxShadow: "inset 0 0 2px rgba(0, 0, 0, 0.3)",
                    }}
                    animate={{
                      background: [
                        "radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9) 0%, rgba(52, 211, 153, 0.8) 50%, rgba(16, 185, 129, 0.8) 100%)",
                        "radial-gradient(circle at 70% 70%, rgba(255, 255, 255, 0.9) 0%, rgba(52, 211, 153, 0.8) 50%, rgba(16, 185, 129, 0.8) 100%)",
                        "radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9) 0%, rgba(52, 211, 153, 0.8) 50%, rgba(16, 185, 129, 0.8) 100%)",
                      ],
                    }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                  />

                  {/* Cosmic energy core */}
                  <motion.div
                    className="absolute inset-0 rounded-full mix-blend-overlay"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(52, 211, 153, 0.5) 50%, transparent 100%)",
                    }}
                    animate={{
                      opacity: [0.5, 1, 0.5],
                      scale: [0.8, 1, 0.8],
                    }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                  />

                  {/* Multiple dimensional pulse rings */}
                  {[...Array(4)].map((_, i) => {
                    const uniqueKey = `pulse-ring-${i}-${Math.random().toString(36).substr(2, 9)}`;
                    return (
                      <motion.div
                        key={uniqueKey}
                        className="absolute inset-0 rounded-full"
                        style={{
                          border: `1px solid rgba(52, 211, 153, ${
                            0.8 - i * 0.2
                          })`,
                          opacity: 0,
                        }}
                        animate={{
                          scale: [1, 2 + i * 0.5],
                          opacity: [0.8, 0],
                          borderColor: [
                            `rgba(52, 211, 153, ${0.8 - i * 0.2})`,
                            `rgba(110, 231, 183, ${0.6 - i * 0.15})`,
                            `rgba(52, 211, 153, ${0.4 - i * 0.1})`,
                          ],
                        }}
                        transition={{
                          duration: 1.5 + i * 0.3,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: i * 0.3,
                          repeatDelay: 0.1,
                        }}
                      />
                    );
                  })}

                  {/* Cosmic particle explosion on hover */}
                  <motion.div
                    className="pointer-events-none absolute inset-0"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  >
                    {[...Array(24)].map((_, i) => (
                      <motion.div
                        key={`dot-particle-${i}-${Math.random().toString(36).substr(2, 9)}`}
                        className="absolute h-1 w-1 rounded-full"
                        style={{
                          left: "50%",
                          top: "50%",
                          backgroundColor: `hsl(${142 + ((i * 5) % 30)}, ${
                            80 + ((i * 3) % 20)
                          }%, ${70 + ((i * 4) % 20)}%)`,
                          boxShadow: "0 0 2px rgba(52, 211, 153, 0.8)",
                        }}
                        initial={{ scale: 0, x: 0, y: 0 }}
                        whileHover={{
                          scale: [0, 0.5 + ((i * 0.05) % 1), 0],
                          x: [0, Math.cos((i * 15 * Math.PI) / 180) * 30],
                          y: [0, Math.sin((i * 15 * Math.PI) / 180) * 30],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 0.8 + ((i * 0.05) % 0.4),
                          ease: "easeOut",
                          repeat: Number.POSITIVE_INFINITY,
                          repeatDelay: (i * 0.05) % 0.2,
                        }}
                      />
                    ))}
                  </motion.div>

                  {/* Cosmic flare effect */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-white opacity-0"
                    whileHover={{
                      opacity: [0, 0.8, 0],
                      scale: [0.8, 1.2, 0.8],
                    }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                  />
                </motion.div>

                {/* Ultra-enhanced cosmic text with dimensional effects */}
                <motion.span
                  className="relative font-medium text-[10px] sm:text-xs"
                  style={{
                    textShadow: "0 0 5px rgba(52, 211, 153, 0.3)",
                  }}
                  animate={{
                    color: [
                      "rgb(134, 239, 172)",
                      "rgb(52, 211, 153)",
                      "rgb(16, 185, 129)",
                      "rgb(52, 211, 153)",
                      "rgb(134, 239, 172)",
                    ],
                  }}
                  transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
                  whileHover={{
                    textShadow: "0 0 10px rgba(52, 211, 153, 0.8)",
                    letterSpacing: "1px",
                    scale: 1.05,
                  }}
                >
                  {/* Cosmic text background glow */}
                  <motion.div
                    className="-z-10 absolute inset-0 rounded-lg"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(52, 211, 153, 0) 0%, rgba(52, 211, 153, 0.2) 50%, rgba(52, 211, 153, 0) 100%)",
                      filter: "blur(4px)",
                      opacity: 0,
                    }}
                    whileHover={{
                      opacity: 1,
                      x: ["-100%", "100%"],
                    }}
                    transition={{
                      opacity: { duration: 0.3 },
                      x: { duration: 1.5, repeat: Number.POSITIVE_INFINITY },
                    }}
                  />
                  {/* Cosmic text shimmer effect */}
                  <motion.div
                    className="-z-10 absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent)",
                      transform: "translateX(-100%)",
                      opacity: 0,
                    }}
                    whileHover={{
                      opacity: 0.7,
                      x: ["-100%", "100%"],
                    }}
                    transition={{
                      x: { duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                    }}
                  />
                  {/* Cosmic text particles */}
                  <motion.div
                    className="-z-10 pointer-events-none absolute inset-0"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  >
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={`text-status-particle-${i}-${Math.random().toString(36).substr(2, 9)}`}
                        className="absolute h-0.5 w-0.5 rounded-full bg-green-200"
                        style={{
                          top: `${(i * 23) % 100}%`,
                          left: `${(i * 37) % 100}%`,
                        }}
                        animate={{
                          y: [0, (Math.random() - 0.5) * 10],
                          x: [0, (Math.random() - 0.5) * 10],
                          opacity: [0, 1, 0],
                          scale: [0, 1, 0],
                        }}
                        transition={{
                          duration: 1 + Math.random(),
                          repeat: Number.POSITIVE_INFINITY,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </motion.div>
                  online
                </motion.span>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Main content sections */}
        <div className="space-y-16">
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            custom={2}
            variants={fadeInUpVariants}
          >
            <GitCommitHistory />
          </motion.section>
          {/* About section */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            custom={1}
            variants={fadeInUpVariants}
          >
            <About />
          </motion.section>

          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            custom={1}
            variants={fadeInUpVariants}
          >
            <HobbySection />
          </motion.section>

          {/* Experience section */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            custom={2}
            variants={fadeInUpVariants}
          >
            <Experience />
          </motion.section>
          {/* Education section */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            custom={3}
            variants={fadeInUpVariants}
          >
            <Education />
          </motion.section>

          {/* Skills section */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            custom={1}
            variants={fadeInUpVariants}
          >
            <SkillsSection />
          </motion.section>

          {/* Socials section */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            custom={4}
            variants={fadeInUpVariants}
          >
            <Socials />
          </motion.section>

          <motion.section
            className="mb-16"
            initial="hidden"
            animate="visible"
            custom={5} // Adjust this number depending on display order.
            variants={fadeInUpVariants}
          >
            <LocationSection />
          </motion.section>
        </div>

        {/* Footer */}
        <motion.footer
          className="mt-16 border-zinc-800/50 border-t pt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
        >
          <div
            className="mt-8 text-center text-xs text-zinc-500"
            suppressHydrationWarning
          >
            <p>
              © {new Date().getFullYear()} Anish Sarkar. All rights reserved.
            </p>
            {/* <p className="mt-1">
              Built with Next.js, Tailwind CSS, and Framer Motion.
            </p> */}
          </div>
        </motion.footer>
      </main>
    </>
  );
}
