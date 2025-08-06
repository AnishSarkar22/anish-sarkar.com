"use client";

import { motion, useMotionValue, useTransform, useAnimation, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";

export default function About() {
  const [hoveredParagraph, setHoveredParagraph] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Memoize paragraphs to prevent unnecessary re-renders
  const paragraphs = useMemo(() => [
    "just a 22 y/o backend developer trying to convince my machine-learning models not to hallucinate while i hallucinate sleep.",
    "i turn chaotic thoughts into real builds, mostly through trial, error, and a lot of pretending i knew what i was doing.",
    "tinker with retro tech and low-level systems because therapy was too mainstream. also mess with cameras so i can feel productive while avoiding actual work."
  ], []);
  
  // Optimize mouse tracking with useCallback and throttling
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Use requestAnimationFrame for smoother updates
      requestAnimationFrame(() => {
        setMousePosition({ x, y });
        mouseX.set(x);
        mouseY.set(y);
      });
    }
  }, [mouseX, mouseY]);

  // Throttle mouse events for better performance
  useEffect(() => {
    let rafId: number;
    let lastExecTime = 0;
    const THROTTLE_INTERVAL = 10; // ms
    
    const throttledMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastExecTime >= THROTTLE_INTERVAL) {
        lastExecTime = now;
        handleMouseMove(e);
      } else {
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => handleMouseMove(e));
      }
    };

    window.addEventListener("mousemove", throttledMouseMove);
    return () => {
      window.removeEventListener("mousemove", throttledMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [handleMouseMove]);

  // Memoize gradient transforms
  const gradientX = useTransform(mouseX, (val) => val / 2);
  const gradientY = useTransform(mouseY, (val) => val / 2);
  
  // Memoize hover handlers
  const handleHoverStart = useCallback((index: number) => {
    setHoveredParagraph(index);
  }, []);
  
  const handleHoverEnd = useCallback(() => {
    setHoveredParagraph(null);
  }, []);

  // Memoize animation variants for better performance
  const sectionVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }), []);
  
  const titleVariants = useMemo(() => ({
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  }), []);
  
  // Optimize particle rendering with useMemo
  const titleParticles = useMemo(() => 
    [...Array(10)].map((_, i) => {
      const randomX = (Math.random() - 0.5) * 50;
      const randomY = (Math.random() - 0.5) * 50;
      const duration = 0.8 + Math.random() * 0.5;
      const delay = Math.random() * 0.2;
      const width = Math.random() * 4 + 2;
      const height = Math.random() * 4 + 2;
      
      return { randomX, randomY, duration, delay, width, height, key: `title-particle-${i}` };
    }), 
  []);
  
  // Optimize code particles with useMemo
  const codeParticles = useMemo(() => 
    [...Array(8)].map((_, i) => {
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const opacity = 0.1 + Math.random() * 0.1;
      const duration = 5 + Math.random() * 5;
      const delay = Math.random() * 10;
      const rotate = Math.random() > 0.5 ? [0, 10] : [0, -10];
      const symbol = ["</>", "{}", "[]", "//", "&&", "=>", "||", "=="][i % 8];
      
      return { left, top, opacity, duration, delay, rotate, symbol, key: `code-particle-${i}` };
    }),
  []);

  return (
    <motion.section 
      ref={sectionRef}
      className="relative mb-16 space-y-6 overflow-hidden rounded-xl p-4 will-change-transform"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.6 }}
    >

      <motion.div
        variants={titleVariants}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative"
      >
        <motion.h2 
          className="relative mb-2 inline-block font-bold text-3xl"
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <span className="inline-block text-green-300 will-change-transform">
            &gt;
          </span>{" "}
          <span className="group relative">
            <span className="animate-shimmer bg-[length:200%_100%] bg-gradient-to-r from-white via-green-200 to-white bg-clip-text text-transparent">about</span>
            
            {/* Animated underline with glow */}
            {/* <motion.span 
              className="-bottom-1 absolute left-0 h-[2px] bg-gradient-to-r from-green-300/0 via-green-300 to-green-300/0 will-change-transform"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1, delay: 0.5 }}
              style={{ boxShadow: '0 2px 10px rgba(134, 239, 172, 0.3)' }}
            /> */}
            
            {/* Particle burst on hover - optimized with AnimatePresence */}
            <motion.div
              className="-z-10 pointer-events-none absolute inset-0"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            >
              <AnimatePresence>
                {titleParticles.map((particle) => (
                  <motion.div
                    key={particle.key}
                    className="absolute rounded-full bg-green-300"
                    initial={{ 
                      opacity: 0,
                      scale: 0,
                      x: 0,
                      y: 0,
                    }}
                    whileHover={{ 
                      opacity: [0, 0.8, 0],
                      scale: [0, 1, 0],
                      x: [0, particle.randomX],
                      y: [0, particle.randomY],
                    }}
                    transition={{ 
                      duration: particle.duration,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: particle.delay,
                      repeatType: 'loop'
                    }}
                    style={{
                      left: '50%',
                      top: '50%',
                      width: `${particle.width}px`,
                      height: `${particle.height}px`,
                      filter: 'blur(1px)',
                      willChange: 'transform, opacity'
                    }}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </span>
        </motion.h2>
        
        <motion.div 
          className="relative mb-4 overflow-hidden text-gray-500 text-xs italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          whileHover={{ 
            color: "#86efac",
            textShadow: "0 0 8px rgba(134, 239, 172, 0.3)"
          }}
        >
          <span className="inline-block">
            <span className="inline-block text-gray-500">[</span>
            {" break → understand → build "}
            <span className="inline-block text-gray-500">]</span>
          </span>
        </motion.div>
      </motion.div>

      <div className="space-y-5 text-sm">
  {paragraphs.map((paragraph) => (
    <div
      key={paragraph}
      className="rounded-lg bg-transparent p-4 text-gray-300 leading-relaxed tracking-wide"
    >
      {paragraph}
    </div>
  ))}
</div>
      {/* Enhanced decorative elements - optimized with reduced animation complexity */}
      <motion.div 
        className="-right-20 -z-10 pointer-events-none absolute top-1/2 h-60 w-60 rounded-full will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(134, 239, 172, 0.1), transparent 70%)',
          filter: 'blur(40px)'
        }}
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
          x: [0, -10, 0],
          y: [0, 10, 0]
        }}
        transition={{ 
          duration: 8, 
          repeat: Number.POSITIVE_INFINITY, 
          ease: "easeInOut",
          repeatType: 'loop'
        }}
      />
      
      <motion.div 
        className="-left-20 -z-10 pointer-events-none absolute bottom-0 h-40 w-40 rounded-full will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(74, 222, 128, 0.08), transparent 70%)',
          filter: 'blur(30px)'
        }}
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.08, 0.15, 0.08],
          x: [0, 10, 0],
          y: [0, -10, 0]
        }}
        transition={{ 
          duration: 10, 
          repeat: Number.POSITIVE_INFINITY, 
          ease: "easeInOut", 
          delay: 1,
          repeatType: 'loop'
        }}
      />
      
      {/* Floating code particles - optimized with memoization */}
      {codeParticles.map((particle) => (
        <motion.div
          key={particle.key}
          className="pointer-events-none absolute font-mono text-green-300/20 text-xs will-change-transform"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            opacity: particle.opacity
          }}
          animate={{
            y: [0, -50],
            opacity: [0, 0.2, 0],
            rotate: particle.rotate
          }}
          transition={{
            duration: particle.duration,
            repeat: Number.POSITIVE_INFINITY,
            delay: particle.delay,
            ease: "linear",
            repeatType: 'loop'
          }}
        >
          {particle.symbol}
        </motion.div>
      ))}
      
      {/* Subtle grid lines - no animation, so no optimization needed */}
      <div className="-z-30 absolute inset-0 opacity-5">
        <div className="absolute top-0 bottom-0 left-1/4 w-px bg-green-300/30" />
        <div className="absolute top-0 bottom-0 left-2/4 w-px bg-green-300/30" />
        <div className="absolute top-0 bottom-0 left-3/4 w-px bg-green-300/30" />
        <div className="absolute top-1/4 right-0 left-0 h-px bg-green-300/30" />
        <div className="absolute top-2/4 right-0 left-0 h-px bg-green-300/30" />
        <div className="absolute top-3/4 right-0 left-0 h-px bg-green-300/30" />
      </div>
    </motion.section>
  );
}