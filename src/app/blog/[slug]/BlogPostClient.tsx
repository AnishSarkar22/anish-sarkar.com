"use client";
import TransitionWrapper from "~/components/utils/TransitionWrapper"
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { trackEvent, trackBlogRead } from "~/utils/posthog";
import dynamic from "next/dynamic";

// Dynamically import mermaid to avoid SSR issues
const MermaidInitializer = dynamic(
  () => import("~/components/utils/MermaidInitializer"),
  { ssr: false }
);

export default function BlogPostClient({ 
  children, 
  slug 
}: { 
  children: React.ReactNode;
  slug: string;
}) {
  const [readingProgress, setReadingProgress] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [startTime] = useState(Date.now());
  const [hasTrackedRead, setHasTrackedRead] = useState(false);
  
  useEffect(() => {
    // Track blog post view (for posthog analytics)
    trackEvent('blog_post_view', {
      blog_slug: slug,
      view_type: 'initial_load',
    });

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const windowScrollTop = window.scrollY || document.documentElement.scrollTop;
      const progress = windowScrollTop === 0 ? 0 : Math.min(windowScrollTop / totalHeight, 1);
      
      setReadingProgress(progress);

      // Track reading milestones (for posthog analytics)
      if (progress >= 0.25 && progress < 0.5) {
        trackEvent('blog_reading_progress', {
          blog_slug: slug,
          progress_percentage: 25,
          reading_time_seconds: Math.floor((Date.now() - startTime) / 1000),
        });
      } else if (progress >= 0.5 && progress < 0.75) {
        trackEvent('blog_reading_progress', {
          blog_slug: slug,
          progress_percentage: 50,
          reading_time_seconds: Math.floor((Date.now() - startTime) / 1000),
        });
      } else if (progress >= 0.75 && progress < 0.9) {
        trackEvent('blog_reading_progress', {
          blog_slug: slug,
          progress_percentage: 75,
          reading_time_seconds: Math.floor((Date.now() - startTime) / 1000),
        });
      } else if (progress >= 0.9 && !hasTrackedRead) {
        const readingTime = Math.floor((Date.now() - startTime) / 1000);
        trackBlogRead(slug, document.title, readingTime);
        setHasTrackedRead(true);
      }
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    // Track page exit (for posthog analytics)
    const handleBeforeUnload = () => {
      const readingTime = Math.floor((Date.now() - startTime) / 1000);
      trackEvent('blog_post_exit', {
        blog_slug: slug,
        reading_time_seconds: readingTime,
        reading_progress: readingProgress,
      });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("beforeunload", handleBeforeUnload);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [slug, startTime, readingProgress, hasTrackedRead]);

  // Track social sharing (for posthog analytics)
  const handleSocialShare = (platform: string, url: string) => {
    trackEvent('blog_social_share', {
      blog_slug: slug,
      social_platform: platform,
      share_url: url,
    });
  };

  return (
    <>
      {/* Initialize Mermaid */}
      <MermaidInitializer />
      
      {/* Reactive glow effect that follows mouse */}
      <div 
        className="-z-5 pointer-events-none fixed inset-0 opacity-30"
        style={{
          background: " rgba(0, 0, 0, 0.15)",
        }}
      />    
      
      {/* Main content */}
      {children}
      
      {/* add Comments Section if needed */}
        
      
      {/* Beautiful Thank You Footnote as Footer */}
      <footer className="mx-auto max-w-4xl px-6 font-mono">
        {/* Enhanced separator with animated particles */}
        <div className="relative my-8 flex h-24 items-center justify-center overflow-hidden">
          <div className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-green-300/40 to-transparent" />
          
          {/* Animated particles */}
          <div className="absolute inset-0 flex items-center justify-center">
            {["a", "b", "c", "d", "e", "f"].map((particleKey, i) => (
              <motion.div
                key={`particle-${particleKey}`}
                className="absolute h-1 w-1 rounded-full bg-green-300/30"
                initial={{ 
                  x: Math.random() * 200 - 100, 
                  y: Math.random() * 60 - 30,
                  opacity: 0 
                }}
                animate={{ 
                  y: [Math.random() * 20 - 10, Math.random() * -20 - 10],
                  opacity: [0, 0.8, 0],
                  scale: [0, 1, 0.5]
                }}
                transition={{ 
                  repeat: Number.POSITIVE_INFINITY, 
                  duration: 4 + Math.random() * 3,
                  delay: i * 0.5,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
          
          <motion.div 
            className="absolute h-[1px] w-40"
            style={{ 
              background: "linear-gradient(to right, transparent, rgba(52, 211, 153, 0.9), transparent)",
              boxShadow: "0 0 15px rgba(52, 211, 153, 0.5)"
            }}
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: 160, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            viewport={{ once: true }}
          />
          
          <motion.div
            className="absolute flex items-center space-x-4 rounded-full px-6 py-2 backdrop-blur-sm"
            style={{ background: "rgba(10, 10, 10, 0.3)" }}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <motion.div 
              className="h-2 w-2 rounded-full bg-green-300/40"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            />
            <motion.div 
              className="h-3 w-3 rounded-full border border-green-300/50 bg-green-300/30"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.3 }}
            />
            <motion.div 
              className="h-2 w-2 rounded-full bg-green-300/40"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.6 }}
            />
          </motion.div>
        </div>
        
        <motion.div 
          className="relative mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div
            className="mb-6 text-sm text-zinc-400 uppercase tracking-widest"
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            whileInView={{ opacity: 0.8, letterSpacing: "0.2em" }}
            transition={{ delay: 0.2, duration: 1.2 }}
            viewport={{ once: true }}
          >
            <span className="bg-gradient-to-r from-zinc-400 to-zinc-500 bg-clip-text text-transparent">
              Thanks for reading
            </span>
          </motion.div>
          
          <motion.h3 
            className="relative mb-4 font-medium text-3xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
          >
            <span className="relative z-10 bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300 bg-clip-text text-transparent">
              Enjoyed this article?
            </span>
            <motion.span 
              className="-bottom-2 -translate-x-1/2 absolute left-1/2 h-1 w-36 rounded-full opacity-20"
              style={{ background: "linear-gradient(to right, #10b981, #34d399)" }}
              initial={{ width: 0 }}
              whileInView={{ width: "36%" }}
              transition={{ delay: 0.8, duration: 1 }}
              viewport={{ once: true }}
            />
          </motion.h3>
          
          <motion.p 
            className="mx-auto mb-8 max-w-md text-sm text-zinc-400 leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
          >
            If you found this content valuable, consider sharing it with others who might benefit. 
            Your support helps me create more content like this.
          </motion.p>
          
          <motion.div 
            className="mb-10 flex flex-wrap justify-center gap-5"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            viewport={{ once: true }}
          >
            <Link href="/blog" passHref>
              <motion.span
                className="inline-flex items-center rounded-full border border-zinc-800/50 bg-zinc-900/50 px-5 py-2.5 text-sm text-zinc-300 backdrop-blur-sm transition-all hover:bg-zinc-800/70"
                whileHover={{ 
                  scale: 1.05, 
                  y: -2,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <title>Back arrow icon</title>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
                More articles
              </motion.span>
            </Link>
            
            <motion.a
              href="https://twitter.com/intent/tweet"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full border border-green-300/20 bg-gradient-to-r from-green-300/10 to-emerald-500/10 px-5 py-2.5 text-green-300 text-sm backdrop-blur-sm transition-all hover:from-green-300/20 hover:to-emerald-500/20"
              onClick={() => handleSocialShare('twitter', window.location.href)} // for posthog analytics
              whileHover={{ 
                scale: 1.05, 
                y: -2, 
                boxShadow: "0 10px 25px -5px rgba(52, 211, 153, 0.3)" 
              }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
              Share on Twitter
            </motion.a>
          </motion.div>
          
          {/* Enhanced bottom design */}
          <div className="relative py-8">
            <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-green-300/10 to-transparent" />
            
            <motion.div 
              className="mb-4 flex items-center justify-center gap-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              viewport={{ once: true }}
            >
              {["first", "second", "third"].map((particle, i) => (
                <motion.div 
                  key={`footer-particle-${particle}`}
                  className="h-1 w-1 rounded-full bg-green-300/30"
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Number.POSITIVE_INFINITY, 
                    delay: i * 0.3,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.div>
            
            {/* Copyright text */}
            <motion.div 
              className="flex flex-col items-center text-xs text-zinc-500"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.7 }}
              transition={{ delay: 1 }}
              viewport={{ once: true }}
            >
              <span className="mb-1">© {new Date().getFullYear()} Anish Sarkar</span>
              <span className="text-[10px] text-zinc-600/50">All rights reserved</span>
            </motion.div>
          </div>
        </motion.div>
      </footer>
    </>
  );
}