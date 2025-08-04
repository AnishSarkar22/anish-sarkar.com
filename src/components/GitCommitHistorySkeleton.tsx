"use client";

import { motion } from "framer-motion";
import { memo } from "react";

// Skeleton components
const SkeletonBox = memo(({ className }: { className: string }) => (
  <div className={`bg-zinc-800/30 animate-pulse rounded ${className}`} />
));

const SkeletonContributionCell = memo(() => (
  <div className="w-[10px] h-[10px] rounded-sm bg-zinc-800/20 animate-pulse" />
));

const SkeletonWeek = memo(() => (
  <div className="grid grid-rows-7 gap-[2px]">
    {Array.from({ length: 7 }).map((_, i) => (
      <SkeletonContributionCell key={`skeleton-day-${i}`} />
    ))}
  </div>
));

const SkeletonWeekdayLabel = memo(() => (
  <div className="h-[11px] text-right pr-1">
    <SkeletonBox className="w-6 h-2" />
  </div>
));

export default function GitCommitHistorySkeleton() {
  // Generate skeleton weeks (52 weeks for a year)
  const skeletonWeeks = Array.from({ length: 52 });
  const skeletonMonths = ["Jan", "Mar", "May", "Jul", "Sep", "Nov"];

  return (
    <div className="w-full">
      {/* Title skeleton */}
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative mb-2"
      >
        <div className="flex items-center gap-2 mb-1">
          <SkeletonBox className="w-4 h-6" />
          <SkeletonBox className="w-20 h-6" />
        </div>
      </motion.div>

      {/* Main content skeleton */}
      <motion.div
        className="relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header stats skeleton */}
        <div className="relative z-10">
          <motion.div
            className="mb-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <SkeletonBox className="w-64 h-3" />
          </motion.div>
          
          <motion.div
            className="grid grid-cols-2 gap-1 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {/* Current streak skeleton */}
            <div className="flex items-center gap-1 rounded p-1">
              <SkeletonBox className="w-4 h-4 rounded-full" />
              <div className="flex-1">
                <SkeletonBox className="w-16 h-2 mb-1" />
                <SkeletonBox className="w-12 h-3" />
              </div>
            </div>

            {/* Longest streak skeleton */}
            <div className="flex items-center gap-1 rounded p-1">
              <SkeletonBox className="w-4 h-4 rounded-full" />
              <div className="flex-1">
                <SkeletonBox className="w-16 h-2 mb-1" />
                <SkeletonBox className="w-12 h-3" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Contribution graph skeleton */}
        <div className="overflow-x-auto relative z-10">
          <div className="min-w-[700px]">
            <div className="flex">
              {/* Weekday labels skeleton */}
              <div
                className="flex flex-col justify-between pt-5"
                style={{ height: `${7 * 10 + 6}px` }}
              >
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonWeekdayLabel key={`skeleton-weekday-${i}`} />
                ))}
              </div>

              <div className="flex-1 relative">
                {/* Month labels skeleton */}
                <div className="flex justify-between text-[10px] h-5 px-2">
                  {skeletonMonths.map((_, i) => (
                    <SkeletonBox key={`skeleton-month-${i}`} className="w-6 h-2" />
                  ))}
                </div>

                {/* Contribution cells skeleton with staggered animation */}
                <div className="grid grid-flow-col gap-[2px]">
                  {skeletonWeeks.map((_, weekIndex) => (
                    <motion.div
                      key={`skeleton-week-${weekIndex}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.4,
                        delay: weekIndex * 0.01, // Staggered animation
                        ease: "easeOut"
                      }}
                    >
                      <SkeletonWeek />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Legend skeleton */}
            <div className="flex items-center justify-end mt-1">
              <SkeletonBox className="w-8 h-2 mr-1" />
              <div className="flex items-center gap-[2px]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonBox key={`skeleton-legend-${i}`} className="w-2 h-2 rounded-sm" />
                ))}
              </div>
              <SkeletonBox className="w-8 h-2 ml-1" />
            </div>
          </div>
        </div>

        {/* Footer skeleton */}
        <div className="flex justify-end items-center relative z-10 mt-1">
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <SkeletonBox className="w-3 h-3 rounded-full mr-0.5" />
            <SkeletonBox className="w-40 h-2" />
          </motion.div>
        </div>

        {/* Pulsing overlay effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-700/5 to-transparent -skew-x-12"
          initial={{ x: "-100%" }}
          animate={{ x: "200%" }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear"
          }}
        />
      </motion.div>
    </div>
  );
}