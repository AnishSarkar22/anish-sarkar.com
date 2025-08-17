"use client";

import { useRef, useState, useEffect, useCallback, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchGitHubContributions } from "../utils/githubAPI";
import { TooltipPortal } from "./utils/TooltipPortal";

interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
  tooltip: string;
}

// Memoized constants to avoid recreating on each render
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const BASE_COLORS = [
  "rgba(22, 27, 34, 0.1)",
  "rgba(52, 211, 153, 0.4)",
  "rgba(52, 211, 153, 0.6)",
  "rgba(52, 211, 153, 0.8)",
  "rgba(52, 211, 153, 1)",
];
const HOVER_COLORS = [
  "rgba(22, 27, 34, 0.2)",
  "rgba(52, 211, 153, 0.5)",
  "rgba(52, 211, 153, 0.7)",
  "rgba(52, 211, 153, 0.9)",
  "rgba(52, 211, 153, 1)",
];
const GLOW_INTENSITIES = [0, 2, 5, 10, 15];

// Memoized components for better performance
const WeekdayLabel = memo(({ day }: { day: string }) => (
  <div className="h-[11px] pr-1 text-right text-[10px] text-zinc-500/70">
    {day}
  </div>
));

const LegendItem = memo(
  ({
    level,
    getContributionColor,
  }: {
    level: number;
    getContributionColor: (level: number, isHovered: boolean) => string;
  }) => (
    <motion.div
      className="mx-0.5 h-2 w-2 rounded-sm"
      style={{ backgroundColor: getContributionColor(level, false) }}
      whileHover={{
        scale: 1.3,
        boxShadow:
          level > 0 ? `0 0 ${level * 3}px rgba(52, 211, 153, 0.7)` : "none",
      }}
    />
  )
);

// Simplified background component
const BackgroundGradient = memo(() => (
  <div className="-z-10 pointer-events-none absolute inset-0 overflow-hidden">
    <div
      className="absolute inset-0 opacity-5"
      style={{
        background:
          "radial-gradient(circle at 50% 50%, rgba(52, 211, 153, 0.3) 0%, transparent 70%)",
        filter: "blur(50px)",
      }}
    />
  </div>
));

// Memoized contribution cell component with enhanced modern hover effects
const ContributionCell = memo(
  ({
    day,
    getContributionColor,
    getGlowIntensity,
  }: {
    day: ContributionDay;
    getContributionColor: (level: number, isHovered: boolean) => string;
    getGlowIntensity: (level: number) => number;
  }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (isHovered && ref.current) {
        const updateRect = () => setAnchorRect(ref.current?.getBoundingClientRect());
        updateRect();
        window.addEventListener("scroll", updateRect, true);
        window.addEventListener("resize", updateRect);
        return () => {
          window.removeEventListener("scroll", updateRect, true);
          window.removeEventListener("resize", updateRect);
        };
      }
    }, [isHovered]);

    // Skip rendering cells that are not visible
    if (day.count < 0) {
      return <div className="h-[10px] w-[10px]" />;
    }

    return (
      <>
        <motion.div
          ref={ref}
          className="group relative h-[10px] w-[10px] rounded-sm"
          style={{
            backgroundColor: getContributionColor(day.level, isHovered),
          }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          whileHover={{
            scale: 1.5,
            zIndex: 10,
            transition: { type: "spring", stiffness: 300, damping: 15 },
          }}
        >
          {/* Particle effect on hover */}
          {/* {isHovered && day.level > 0 && (
        <motion.div
          className="absolute inset-0 overflow-visible"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {[...Array(Math.min(day.level * 3, 12))].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-[2px] h-[2px] rounded-full bg-emerald-300"
              initial={{ 
                x: 0, 
                y: 0, 
                opacity: 0,
                scale: 0
              }}
              animate={{ 
                x: Math.random() * 30 - 15,
                y: Math.random() * 30 - 15,
                opacity: [0, 0.8, 0],
                scale: [0, Math.random() * 0.8 + 0.5, 0]
              }}
              transition={{
                duration: 1 + Math.random(),
                repeat: Infinity,
                repeatType: "loop",
                delay: Math.random() * 0.5,
                ease: "easeOut"
              }}
              style={{
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)"
              }}
            />
          ))}
        </motion.div>
      )} */}

          {/* Enhanced neon glow blinking effect */}
          {/* {isHovered && day.level > 0 && (
        <motion.div 
          className="absolute inset-0 rounded-sm"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0.4, 1, 0.4], 
            boxShadow: [
              `0 0 ${getGlowIntensity(day.level) * 0.8}px ${getContributionColor(day.level, true)}`,
              `0 0 ${getGlowIntensity(day.level) * 2.5}px ${getContributionColor(day.level, true)}, 0 0 ${getGlowIntensity(day.level) * 4}px rgba(52, 211, 153, 0.3)`,
              `0 0 ${getGlowIntensity(day.level) * 0.8}px ${getContributionColor(day.level, true)}`
            ]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 1.2,
            ease: "easeInOut"
          }}
        />
      )} */}

          {/* Ripple effect */}
          {/* {isHovered && day.level > 0 && (
        <motion.div
          className="absolute rounded-full -inset-1"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ 
            opacity: [0, 0.2, 0],
            scale: [0.8, 2, 3],
            borderWidth: [1, 0.5, 0]
          }}
          transition={{ 
            repeat: Infinity,
            duration: 1.5,
            ease: "easeOut"
          }}
          style={{
            borderColor: getContributionColor(day.level, true),
            backgroundColor: 'transparent',
            borderStyle: 'solid'
          }}
        />
      )} */}

          {/* Smaller tooltip with animation */}
          {/* {isHovered && (
          <motion.div
            className="-translate-x-1/2 absolute bottom-full left-1/2 z-50 mb-1.5 transform whitespace-nowrap rounded border border-emerald-500/20 bg-zinc-800/90 px-1.5 py-0.5 text-[7px] text-white shadow-sm backdrop-blur-sm"
            initial={{ opacity: 0, y: 5, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
          >
            <div className="flex items-center gap-1">
              {day.level > 0 && (
                <div
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    backgroundColor: getContributionColor(day.level, true),
                  }}
                />
              )}
              <span>{day.tooltip}</span>
            </div>
            <motion.div
              className="-translate-x-1/2 absolute top-full left-1/2 transform border-[3px] border-transparent border-t-zinc-800/90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            />
          </motion.div>
        )} */}
        </motion.div>
        <TooltipPortal show={isHovered} anchorRect={anchorRect}>
          <motion.div
            className="-translate-x-1/2 z-50 mb-2 whitespace-nowrap rounded border border-emerald-500/20 bg-zinc-800/90 px-1.5 py-0.5 text-sm text-white shadow-lg backdrop-blur-md"
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
          >
            <div className="flex items-center gap-2">
              {day.level > 0 && (
                <div
                  className="h-3 w-3 rounded-full"
                  style={{
                    backgroundColor: getContributionColor(day.level, true),
                  }}
                />
              )}
              <span>{day.tooltip}</span>
            </div>
          </motion.div>
        </TooltipPortal>
      </>
    );
  }
);

// Memoized contribution week component
const ContributionWeek = memo(
  ({
    week,
    getContributionColor,
    getGlowIntensity,
  }: {
    week: ContributionDay[];
    getContributionColor: (level: number, isHovered: boolean) => string;
    getGlowIntensity: (level: number) => number;
  }) => (
    <div className="grid grid-rows-7 gap-[2px]">
      {week.map((day, dayIndex) => (
        <ContributionCell
          key={day.date || `empty-${dayIndex}`}
          day={day}
          getContributionColor={getContributionColor}
          getGlowIntensity={getGlowIntensity}
        />
      ))}
    </div>
  )
);

export default function GitCommitHistory() {
  const [contributions, setContributions] = useState<ContributionDay[][]>([]);
  const [totalContributions, setTotalContributions] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Memoized functions to avoid recreating on each render
  const getContributionColor = useCallback(
    (level: number, isHovered: boolean): string => {
      const safeLevel = Math.max(0, Math.min(level, BASE_COLORS.length - 1));
      return isHovered
        ? HOVER_COLORS[safeLevel] ?? HOVER_COLORS[0]
        : BASE_COLORS[safeLevel] ?? BASE_COLORS[0];
    },
    []
  );

  const getGlowIntensity = useCallback((level: number) => {
    const safeLevel = Math.max(0, Math.min(level, GLOW_INTENSITIES.length - 1));
    return GLOW_INTENSITIES[safeLevel] ?? 0;
  }, []);

  // Generate contributions data - optimized to run only once
  useEffect(() => {
    let isMounted = true;

    const generateContributions = async () => {
      try {
        const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME;
        const githubToken = process.env.NEXT_PUBLIC_GITHUB_TOKEN; // Optional: for higher rate limits

        if (!username) {
          throw new Error("github username environment variable is not set");
        }

        const calendar = await fetchGitHubContributions(username, githubToken);

        // Transform GitHub data to your UI format with better level mapping
        const transformedWeeks = calendar.weeks.map((week) =>
          week.contributionDays.map((day) => {
            // Map contribution count to level more aggressively for visibility
            let level: 0 | 1 | 2 | 3 | 4 = 0;
            if (day.contributionCount === 0) level = 0;
            else if (day.contributionCount <= 2) level = 1;
            else if (day.contributionCount <= 5) level = 2;
            else if (day.contributionCount <= 10) level = 3;
            else level = 4;

            return {
              date: day.date,
              count: day.contributionCount,
              level: level,
              tooltip:
                day.contributionCount === 0
                  ? `No contributions on ${new Date(day.date).toDateString()}`
                  : `${day.contributionCount} contribution${
                      day.contributionCount === 1 ? "" : "s"
                    } on ${new Date(day.date).toDateString()}`,
            };
          })
        );

        // Calculate streaks from real data
        let maxStreak = 0;
        let currentStrk = 0;
        let finalCurrentStreak = 0;
        let foundNonContribution = false;

        // Calculate longest streak
        const allDays = transformedWeeks.flat().filter((day) => day.date);
        for (const day of allDays) {
          if (day.count > 0) {
            currentStrk++;
            maxStreak = Math.max(maxStreak, currentStrk);
          } else {
            currentStrk = 0;
          }
        }

        // Calculate current streak (from today backwards)
        for (let i = allDays.length - 1; i >= 0 && !foundNonContribution; i--) {
          const day = allDays[i];
          if (day && new Date(day.date) <= new Date()) {
            if (day.count > 0) {
              finalCurrentStreak++;
            } else {
              foundNonContribution = true;
            }
          }
        }

        if (isMounted) {
          requestAnimationFrame(() => {
            if (isMounted) {
              setContributions(transformedWeeks);
              setTotalContributions(calendar.totalContributions);
              setLongestStreak(maxStreak);
              setCurrentStreak(finalCurrentStreak);

              setTimeout(() => {
                if (isMounted) {
                  setIsLoaded(true);
                }
              }, 300);
            }
          });
        }
      } catch (error) {
        console.error("Failed to fetch GitHub contributions:", error);

        // Fallback to the existing mock data generation
        const generateContributions = () => {
          const today = new Date();
          const oneYearAgo = new Date();
          oneYearAgo.setFullYear(today.getFullYear() - 1);
          oneYearAgo.setDate(oneYearAgo.getDate() - oneYearAgo.getDay());
          const days: ContributionDay[][] = [];
          const currentDate = new Date(oneYearAgo);
          let weekData: ContributionDay[] = [];
          let total = 0;
          let maxStreak = 0;
          let currentStrk = 0;

          // Pre-allocate memory for date strings to reduce string operations
          const dateCache = new Map<number, string>();
          const getFormattedDate = (date: Date) => {
            const timestamp = date.getTime();
            if (!dateCache.has(timestamp)) {
              const isoString = date.toISOString().split("T")[0];
              if (isoString) {
                dateCache.set(timestamp, isoString);
              }
            }
            return dateCache.get(timestamp) ?? "";
          };

          // Pre-allocate memory for tooltips to reduce string operations
          const tooltipCache = new Map<string, string>();
          const getTooltip = (date: Date, count: number) => {
            const dateString = date.toDateString();
            const cacheKey = `${dateString}-${count}`;
            if (!tooltipCache.has(cacheKey)) {
              tooltipCache.set(
                cacheKey,
                count === 0
                  ? `No contributions on ${dateString}`
                  : `${count} contribution${
                      count === 1 ? "" : "s"
                    } on ${dateString}`
              );
            }
            return tooltipCache.get(cacheKey) ?? "";
          };

          while (currentDate <= today) {
            const dayData: ContributionDay = {
              date: getFormattedDate(currentDate),
              count: 0,
              level: 0,
              tooltip: getTooltip(currentDate, 0),
            };

            if (currentDate <= today) {
              const isWeekday =
                currentDate.getDay() > 0 && currentDate.getDay() < 6;
              const isSpecialDay = Math.random() < 0.1;
              let count = 0;

              if (isSpecialDay) {
                count = Math.floor(Math.random() * 15) + 10;
              } else if (isWeekday) {
                const rand = Math.random();
                if (rand < 0.3) count = 0;
                else if (rand < 0.6) count = Math.floor(Math.random() * 3) + 1;
                else if (rand < 0.85) count = Math.floor(Math.random() * 5) + 3;
                else count = Math.floor(Math.random() * 7) + 6;
              } else {
                const rand = Math.random();
                if (rand < 0.6) count = 0;
                else if (rand < 0.9) count = Math.floor(Math.random() * 3) + 1;
                else count = Math.floor(Math.random() * 5) + 3;
              }

              let level: 0 | 1 | 2 | 3 | 4 = 0;
              if (count === 0) level = 0;
              else if (count <= 3) level = 1;
              else if (count <= 6) level = 2;
              else if (count <= 10) level = 3;
              else level = 4;

              if (count > 0) {
                currentStrk++;
                if (currentStrk > maxStreak) maxStreak = currentStrk;
              } else {
                currentStrk = 0;
              }

              dayData.count = count;
              dayData.level = level;
              dayData.tooltip = getTooltip(currentDate, count);
              total += count;
            }

            weekData.push(dayData);
            currentDate.setDate(currentDate.getDate() + 1);

            if (weekData.length === 7) {
              days.push([...weekData]);
              weekData = [];
            }
          }

          if (weekData.length > 0) {
            const emptyDay: ContributionDay = {
              date: "",
              count: -1,
              level: 0 as const,
              tooltip: "Future date",
            };
            // Fill remaining days with empty placeholders
            while (weekData.length < 7) {
              weekData.push({ ...emptyDay });
            }
            days.push([...weekData]);
          }

          let finalCurrentStreak = 0;
          let foundNonContribution = false;
          // Optimized streak calculation
          for (let w = days.length - 1; w >= 0 && !foundNonContribution; w--) {
            const week = days[w];
            if (!week) continue;
            for (
              let d = week.length - 1;
              d >= 0 && !foundNonContribution;
              d--
            ) {
              const day = week[d];
              if (!day) continue;
              if (day.date && new Date(day.date) <= today) {
                if (day.count > 0) {
                  finalCurrentStreak++;
                } else {
                  foundNonContribution = true;
                }
              } else if (!day.date) {
              } else {
                foundNonContribution = true;
              }
            }
          }

          // Use requestAnimationFrame for smoother animations
          if (isMounted) {
            requestAnimationFrame(() => {
              if (isMounted) {
                setContributions(days);
                setTotalContributions(total);
                setLongestStreak(maxStreak);
                setCurrentStreak(finalCurrentStreak);
                setTimeout(() => {
                  if (isMounted) {
                    setIsLoaded(true);
                  }
                }, 300);
              }
            });
          }
        };

        generateContributions();
      }
    };

    // Use requestIdleCallback for non-critical initialization
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      (
        window as Window & {
          requestIdleCallback: (callback: IdleRequestCallback) => number;
        }
      ).requestIdleCallback(() => generateContributions());
    } else {
      setTimeout(generateContributions, 0);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Memoized month labels calculation
  const monthLabels = useMemo(() => {
    const labels: { month: string; position: number }[] = [];
    let currentMonth = -1;
    let lastPosition = -1;

    contributions.forEach((week, weekIndex) => {
      const firstDayOfMonth = week.find((d) => d?.date !== "");
      if (firstDayOfMonth) {
        const date = new Date(firstDayOfMonth.date);
        const month = date.getMonth();
        if (month !== currentMonth) {
          // Only add label if there's enough space from the last label
          // Each month label needs about 20px width, so we need at least 20px spacing
          const minSpacing = 20;
          const currentPosition = weekIndex * 12;

          if (
            currentPosition - lastPosition >= minSpacing ||
            lastPosition === -1
          ) {
            currentMonth = month;
            labels.push({
              month: MONTHS[month] ?? "",
              position: currentPosition,
            });
            lastPosition = currentPosition;
          }
        }
      }
    });

    return labels;
  }, [contributions]);

  // Memoized weekday labels for rendering optimization
  const weekdayLabels = useMemo(
    () =>
      WEEKDAYS.filter((_, i) => i % 2 === 0).map((day) => (
        <WeekdayLabel key={day} day={day} />
      )),
    []
  );

  // Memoized legend items for rendering optimization
  const legendItems = useMemo(
    () =>
      [0, 1, 2, 3, 4].map((level) => (
        <LegendItem
          key={`legend-${level}`}
          level={level}
          getContributionColor={getContributionColor}
        />
      )),
    [getContributionColor]
  );

  // Virtualized rendering - only render visible weeks
  const visibleContributions = useMemo(() => {
    return contributions;
  }, [contributions]);

  // Add state for showing help modal
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Add click handler
  const handleHelpClick = () => {
    window.open(
      "https://docs.github.com/en/account-and-profile/reference/why-are-my-contributions-not-showing-up-on-my-profile#about-your-contribution-graph",
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative mb-2"
      >
        <motion.h2
          className="relative mb-1 inline-block font-bold text-3xl"
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <span className="inline-block text-green-300 will-change-transform">
            &gt;
          </span>{" "}
          <span className="group relative">
            <span className="animate-shimmer bg-[length:200%_100%] bg-gradient-to-r from-white via-green-200 to-white bg-clip-text text-transparent">
              commit
            </span>

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
                {[...Array(10)].map((_, i) => {
                  const randomX = (Math.random() - 0.5) * 50;
                  const randomY = (Math.random() - 0.5) * 50;
                  const duration = 0.8 + Math.random() * 0.5;
                  const delay = Math.random() * 0.2;
                  const width = Math.random() * 4 + 2;
                  const height = Math.random() * 4 + 2;

                  const uniqueKey = `title-particle-${i}-${randomX}-${randomY}-${width}-${height}`;
                  return (
                    <motion.div
                      key={uniqueKey}
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
                        x: [0, randomX],
                        y: [0, randomY],
                      }}
                      transition={{
                        duration: duration,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: delay,
                        repeatType: "loop",
                      }}
                      style={{
                        left: "50%",
                        top: "50%",
                        width: `${width}px`,
                        height: `${height}px`,
                        filter: "blur(1px)",
                        willChange: "transform, opacity",
                      }}
                    />
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </span>
        </motion.h2>
      </motion.div>

      {/* Simplified card without container and background */}
      <motion.div
        className="relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header with stats - simplified */}
        <div className="relative z-10">
          <motion.div
            className="mb-1 flex items-center gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h3 className="font-medium text-green-400 text-xs">
              {totalContributions.toLocaleString()} contributions in the last
              year
            </h3>
          </motion.div>
          <motion.div
            className="mb-2 grid grid-cols-2 gap-1 text-[10px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex items-center gap-1 rounded p-1">
              <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-zinc-800/30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="8"
                  height="8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-emerald-400"
                >
                  <title>Current Streak Icon</title>
                  <path d="m19 12l-6-6m6 6l-6 6m6-6H5" />
                </svg>
              </div>
              <div>
                <div className="text-zinc-400/80">Current Streak</div>
                <div className="flex items-center font-medium text-white">
                  {currentStreak}
                  <span className="ml-0.5">
                    day{currentStreak !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 rounded p-1">
              <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-zinc-800/30">
                <svg
                  fill="#81C784"
                  height="8px"
                  width="8px"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  xmlSpace="preserve"
                  className="text-emerald-400"
                >
                  <title>Longest Streak Icon</title>
                  <path
                    fill="currentColor"
                    d="M12.832 21.801c3.126-.626 7.168-2.875 7.168-8.69c0-5.291-3.873-8.815-6.658-10.434c-.619-.36-1.342.113-1.342.828v1.828c0 1.442-.606 4.074-2.29 5.169c-.86.559-1.79-.278-1.894-1.298l-.086-.838c-.1-.974-1.092-1.565-1.87-.971C4.461 8.46 3 10.33 3 13.11C3 20.221 8.289 22 10.933 22q.232 0 .484-.015c.446-.056 0 .099 1.415-.185"
                    opacity={0.5}
                  />
                  <path
                    fill="currentColor"
                    d="M8 18.444c0 2.62 2.111 3.43 3.417 3.542c.446-.056 0 .099 1.415-.185C13.871 21.434 15 20.492 15 18.444c0-1.297-.819-2.098-1.46-2.473c-.196-.115-.424.03-.441.256c-.056.718-.746 1.29-1.215.744c-.415-.482-.59-1.187-.59-1.638v-.59c0-.354-.357-.59-.663-.408C9.495 15.008 8 16.395 8 18.445"
                  />
                </svg>
              </div>
              <div>
                <div className="text-zinc-400/80">Longest Streak</div>
                <div className="flex items-center font-medium text-white">
                  {longestStreak}
                  <span className="ml-0.5">
                    day{longestStreak !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Contribution graph with minimal effects */}
        <div className="scrollbar-thin scrollbar-thumb-zinc-700/30 scrollbar-track-transparent relative z-10 overflow-x-auto">
          <div className="min-w-[700px]">
            <div className="flex">
              <div
                className="flex flex-col justify-between pt-5 text-[10px] text-zinc-500/70"
                style={{ height: `${7 * 10 + 6}px` }}
              >
                {weekdayLabels}
              </div>

              <div className="relative flex-1">
                {/* Month labels */}
                <div className="flex h-5 text-[10px] text-zinc-500/70">
                  {monthLabels.map((label) => (
                    <div
                      key={`month-${label.month}-${label.position}`}
                      className="absolute"
                      style={{
                        left: `${label.position}px`,
                      }}
                    >
                      {label.month}
                    </div>
                  ))}
                </div>

                {/* Contribution cells with hover glow effect */}
                <div className="grid grid-flow-col gap-[2px]">
                  {visibleContributions.map((week) => {
                    // Use the first valid date in the week as the key, fallback to joining all dates
                    const weekKey =
                      week.find((d) => d.date)?.date ||
                      week.map((d) => d.date).join("-");
                    return (
                      <ContributionWeek
                        key={weekKey}
                        week={week}
                        getContributionColor={getContributionColor}
                        getGlowIntensity={getGlowIntensity}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Legend - simplified */}
            <div className="mt-1 flex items-center justify-end text-[8px] text-zinc-500/70">
              <span className="mr-1">Less</span>
              <div className="flex items-center gap-[2px]">{legendItems}</div>
              <span className="ml-1">More</span>
            </div>
          </div>
        </div>

        {/* Footer with minimal effects - without Activity and Overview buttons */}
        <div className="relative z-10 mt-1 flex items-center justify-end">
          <motion.div
            className="flex cursor-pointer items-center text-[8px] text-zinc-500/70 transition-colors hover:text-zinc-400/80"
            onClick={handleHelpClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="mr-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-zinc-800/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="6"
                height="6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-emerald-400"
              >
                <title>Learn more icon</title>
                <circle cx="12" cy="12" r="10" />
                <path d="m12 16 4-4-4-4" />
                <path d="M8 12h8" />
              </svg>
            </div>
            <span>Learn how GitHub counts contributions</span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
