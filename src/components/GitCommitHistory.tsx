"use client";

import { AnimatePresence, motion } from "framer-motion";
import type {
	JSXElementConstructor,
	ReactElement,
	ReactNode,
	ReactPortal,
} from "react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fetchGitHubContributions } from "../utils/githubContributions";
import { TooltipPortal } from "./utils/TooltipPortal";

interface ContributionDay {
	date: string;
	count: number;
	level: 0 | 1 | 2 | 3 | 4;
	tooltip: string;
}

interface GitHubContributionDay {
	date: string;
	contributionCount: number;
}
interface GitHubWeek {
	contributionDays: GitHubContributionDay[];
}

// Memoized constants to avoid recreating on each render
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
	"#161b22", // Level 0
	"#0e4429", // Level 1
	"#006d32", // Level 2
	"#26a641", // Level 3
	"#39d353", // Level 4
];
const HOVER_COLORS = [
	"#1c2128", // Level 0 hover
	"#135e38", // Level 1 hover
	"#008c40", // Level 2 hover
	"#2dbd4f", // Level 3 hover
	"#47e362", // Level 4 hover
];

// Generate placeholder structure for 53 weeks (typical GitHub contribution graph)
const generatePlaceholderWeeks = (): ContributionDay[][] => {
	const weeks: ContributionDay[][] = [];
	const today = new Date();
	const startDate = new Date(today);
	startDate.setDate(startDate.getDate() - 365); // Go back 1 year

	for (let week = 0; week < 53; week++) {
		const weekDays: ContributionDay[] = [];
		for (let day = 0; day < 7; day++) {
			const date = new Date(startDate);
			date.setDate(date.getDate() + week * 7 + day);
			weekDays.push({
				date: date.toISOString().split("T")[0],
				count: -1, // Use -1 to indicate placeholder
				level: 0,
				tooltip: "",
			});
		}
		weeks.push(weekDays);
	}
	return weeks;
};

const LegendItem = memo(
	({
		level,
		getContributionColor,
	}: {
		level: number;
		getContributionColor: (level: number, isHovered: boolean) => string;
	}) => (
		<motion.div
			className="h-[10px] w-[10px] rounded-sm border-[0.9px] border-gray-500/20"
			style={{ backgroundColor: getContributionColor(level, false) }}
		/>
	),
);

// Simplified background component
const BackgroundGradient = memo(() => (
	<div className="-z-10 pointer-events-none absolute inset-0 overflow-hidden">
		<div
			className="absolute inset-0 opacity-5"
			style={{
				background:
					"radial-gradient(circle at 50% 50%, rgba(38, 166, 65, 0.2) 0%, transparent 70%)",
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
		isLoaded,
		onHover,
	}: {
		day: ContributionDay;
		getContributionColor: (level: number, isHovered: boolean) => string;
		isLoaded: boolean;
		onHover: (day: ContributionDay, rect: DOMRect | null) => void;
	}) => {
		const ref = useRef<HTMLDivElement>(null);

		// Show placeholder cell structure
		if (day.count < 0 || !isLoaded) {
			return (
				<div className="h-[10px] w-[10px] rounded-sm border-[0.9px] border-gray-500/20 bg-zinc-800/20" />
			);
		}

		return (
			<motion.div
				ref={ref}
				className="group relative h-[10px] w-[10px] rounded-sm border-[0.9px] border-gray-500/20"
				style={{
					backgroundColor: getContributionColor(day.level, false), // Cell color handled by parent's isHovered check for simplicity or just keep it static for now as we don't need local isHovered
				}}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.3 }}
				onHoverStart={() => {
					if (ref.current) onHover(day, ref.current.getBoundingClientRect());
				}}
				onHoverEnd={() => onHover(day, null)}
			/>
		);
	},
);

// Memoized contribution week component
const ContributionWeek = memo(
	({
		week,
		getContributionColor,
		isLoaded,
		onHover,
	}: {
		week: ContributionDay[];
		getContributionColor: (level: number, isHovered: boolean) => string;
		isLoaded: boolean;
		onHover: (day: ContributionDay, rect: DOMRect | null) => void;
	}) => (
		<div className="grid grid-rows-7 gap-[2px]">
			{week.map((day, dayIndex) => (
				<ContributionCell
					key={day.date || `empty-${dayIndex}`}
					day={day}
					getContributionColor={getContributionColor}
					isLoaded={isLoaded}
					onHover={onHover}
				/>
			))}
		</div>
	),
);

// Skeleton component for stats
const StatSkeleton = memo(() => (
	<div className="h-3 w-8 animate-pulse rounded bg-zinc-700/30" />
));

export default function GitCommitHistory() {
	const [contributions, setContributions] = useState<ContributionDay[][]>(() =>
		generatePlaceholderWeeks(),
	);
	const [totalContributions, setTotalContributions] = useState(0);
	const [currentStreak, setCurrentStreak] = useState(0);
	const [longestStreak, setLongestStreak] = useState(0);
	const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null);
	const [hoveredRect, setHoveredRect] = useState<DOMRect | null>(null);
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	// Centralized tooltip hover handler
	const handleCellHover = useCallback(
		(day: ContributionDay, rect: DOMRect | null) => {
			// Disable tooltip on mobile
			if (typeof window !== "undefined" && window.innerWidth < 768) return;

			if (rect) {
				setHoveredDay(day);
				setHoveredRect(rect);
			} else {
				setHoveredDay(null);
				setHoveredRect(null);
			}
		},
		[],
	);

	// Update rect if container scrolls while tooltip is open
	useEffect(() => {
		if (!hoveredDay || !scrollContainerRef.current) return;

		const updateRect = () => {
			// Find the active cell element to get its new viewport position
			const cellElements = document.querySelectorAll(
				'[class*="group relative h-[10px] w-[10px] rounded-sm"]',
			);
			for (const _el of Array.from(cellElements)) {
				// This is slightly expensive but works for now.
				// Better: store a ref to the cell instead of just DOMRect.
				// For now, let's just use the scroll listener to close or update.
			}
			// simplest approach to avoid stale tooltip on scroll: close it
			setHoveredDay(null);
			setHoveredRect(null);
		};

		const container = scrollContainerRef.current;
		container.addEventListener("scroll", updateRect);
		window.addEventListener("scroll", updateRect, true);
		window.addEventListener("resize", updateRect);

		return () => {
			container.removeEventListener("scroll", updateRect);
			window.removeEventListener("scroll", updateRect, true);
			window.removeEventListener("resize", updateRect);
		};
	}, [hoveredDay]);

	const [isLoaded, setIsLoaded] = useState(false);

	// Memoize animation variants for better performance
	const sectionVariants = useMemo(
		() => ({
			hidden: { opacity: 0, y: 20 },
			visible: { opacity: 1, y: 0 },
		}),
		[],
	);

	const titleVariants = useMemo(
		() => ({
			hidden: { opacity: 0, x: -20 },
			visible: { opacity: 1, x: 0 },
		}),
		[],
	);

	// Optimize particle rendering with useMemo
	const titleParticles = useMemo(
		() =>
			[...Array(10)].map((_, i) => {
				const randomX = (Math.random() - 0.5) * 50;
				const randomY = (Math.random() - 0.5) * 50;
				const duration = 0.8 + Math.random() * 0.5;
				const delay = Math.random() * 0.2;
				const width = Math.random() * 4 + 2;
				const height = Math.random() * 4 + 2;

				return {
					randomX,
					randomY,
					duration,
					delay,
					width,
					height,
					key: `title-particle-${i}`,
				};
			}),
		[],
	);

	// Memoized functions to avoid recreating on each render
	const getContributionColor = useCallback(
		(level: number, isHovered: boolean): string => {
			const safeLevel = Math.max(0, Math.min(level, BASE_COLORS.length - 1));
			return isHovered
				? (HOVER_COLORS[safeLevel] ?? HOVER_COLORS[0])
				: (BASE_COLORS[safeLevel] ?? BASE_COLORS[0]);
		},
		[],
	);

	useEffect(() => {
		let isMounted = true;

		const loadContributions = async () => {
			try {
				const calendar = await fetchGitHubContributions();

				if (!calendar || !calendar.weeks) {
					throw new Error("Invalid data received");
				}

				const transformedWeeks = (calendar.weeks as GitHubWeek[]).map(
					(week: GitHubWeek) =>
						week.contributionDays.map((day: GitHubContributionDay) => {
							// Map contribution count to level
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
						}),
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
					setContributions(transformedWeeks);
					setTotalContributions(calendar.totalContributions);
					setLongestStreak(maxStreak);
					setCurrentStreak(finalCurrentStreak);
					setIsLoaded(true);
				}
			} catch (error) {
				console.error("Failed to fetch GitHub contributions:", error);

				if (isMounted) {
					// Show error state instead of mock data
					setContributions([]);
					setTotalContributions(0);
					setLongestStreak(0);
					setCurrentStreak(0);
					setIsLoaded(true);
				}
			}
		};

		loadContributions();

		return () => {
			isMounted = false;
		};
	}, []);

	// Memoized month labels calculation
	const monthLabels = useMemo(() => {
		const labels: { month: string; weekIndex: number }[] = [];
		let currentMonth = -1;
		let foundDecember = false;

		// First pass: collect all months that appear in the data, starting from December
		contributions.forEach((week: any[], weekIndex: any) => {
			const firstDayOfMonth = week.find((d) => d?.date !== "");
			if (firstDayOfMonth) {
				const date = new Date(firstDayOfMonth.date);
				const month = date.getMonth();

				// Start collecting from December (month 11)
				if (!foundDecember && month === 11) {
					foundDecember = true;
				}

				if (foundDecember && month !== currentMonth) {
					currentMonth = month;
					labels.push({
						month: MONTHS[month] ?? "",
						weekIndex: weekIndex,
					});
				}
			}
		});

		// Second pass: calculate even spacing
		const totalWidth = contributions.length * 12; // 12px per week
		const spacing = labels.length > 1 ? totalWidth / (labels.length - 1) : 0;

		// Map to evenly spaced positions
		return labels.map((label, index) => ({
			month: label.month,
			position: index === 0 ? 0 : index * spacing,
		}));
	}, [contributions]);

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
		[getContributionColor],
	);

	// Virtualized rendering - only render visible weeks
	const visibleContributions = useMemo(() => {
		return contributions;
	}, [contributions]);

	return (
		<motion.div
			className="w-full"
			variants={sectionVariants}
			initial="hidden"
			animate="visible"
			transition={{ duration: 0.6 }}
		>
			<motion.div
				variants={titleVariants}
				transition={{ duration: 0.5, delay: 0.2 }}
				className="relative mb-2"
			>
				<motion.h2
					className="relative mb-1 inline-block font-bold font-pixel text-2xl"
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

						{/* Particle burst on hover - optimized with AnimatePresence */}
						<motion.div
							className="-z-10 pointer-events-none absolute inset-0"
							initial={{ opacity: 0 }}
							whileHover={{ opacity: 1 }}
						>
							<AnimatePresence>
								{titleParticles.map(
									(particle: {
										key: any;
										randomX: any;
										randomY: any;
										duration: any;
										delay: any;
										width: any;
										height: any;
									}) => (
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
												repeatType: "loop",
											}}
											style={{
												left: "50%",
												top: "50%",
												width: `${particle.width}px`,
												height: `${particle.height}px`,
												filter: "blur(1px)",
												willChange: "transform, opacity",
											}}
										/>
									),
								)}
							</AnimatePresence>
						</motion.div>
					</span>
				</motion.h2>
			</motion.div>

			{/* Simplified card without container and background */}
			<div className="relative overflow-hidden">
				<BackgroundGradient />
				{/* Header with stats - simplified */}
				<div className="relative z-10">
					<motion.div className="mb-2 grid grid-cols-2 gap-1 text-[10px]">
						<div className="flex items-center gap-1 rounded p-1">
							<div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-zinc-800/30">
								<svg
									fill="#fb923c"
									height="8px"
									width="8px"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									xmlSpace="preserve"
									className="text-[#fb923c]"
								>
									<title>Current Streak Icon</title>
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
								<div className="text-zinc-400/80">Current Streak</div>
								<div className="flex items-center font-medium text-white">
									{isLoaded ? (
										<>
											{currentStreak}
											<span className="ml-0.5">
												day{currentStreak !== 1 ? "s" : ""}
											</span>
										</>
									) : (
										<StatSkeleton />
									)}
								</div>
							</div>
						</div>

						<div className="flex items-center gap-1 rounded p-1">
							<div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-zinc-800/30">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="1em"
									height="1em"
									viewBox="0 0 24 24"
									className="text-[#fbbf24]"
								>
									<title>Longest Streak Icon</title>
									<path
										fill="currentColor"
										d="M8.697 3.25h6.606c.18 0 .335 0 .475.017a2.25 2.25 0 0 1 1.958 1.983h.806c.212-.002.677-.006 1.061.251c.497.331.647.9.647 1.499c0 2.726-1.453 4.546-3.308 5.557c-1.035 1.884-2.947 3.193-4.942 3.193c-1.519 0-2.96-.822-3.997-1.959a7 7 0 0 1-.902-1.23C5.247 11.555 3.75 9.737 3.75 7c0-.6.15-1.168.646-1.499c.385-.257.85-.253 1.062-.251h.806l.003-.028a2.25 2.25 0 0 1 1.955-1.955c.14-.017.295-.017.475-.017M7.75 6v.003L7.74 9.5v.001c0 .721.206 1.458.563 2.133l.014.025c.215.402.484.78.795 1.12c.842.924 1.908 1.471 2.889 1.471c1.422 0 2.921-1.028 3.7-2.544a4.8 4.8 0 0 0 .54-2.206l-.002-.002l.012-3.761v-.001c0-.242-.002-.294-.006-.329a.75.75 0 0 0-.651-.651a4 4 0 0 0-.33-.006H8.737c-.243 0-.295.001-.33.006a.75.75 0 0 0-.651.651a4 4 0 0 0-.006.33zm9.998.75l-.009 2.75v.001m-.023.539c.638-.768 1.035-1.77 1.035-3.04c0-.118-.01-.196-.019-.245a3 3 0 0 0-.231-.005h-.753M6.26 9.982a5 5 0 0 1-.022-.482v-.002l.009-2.748H5.5c-.109 0-.178 0-.231.005A1.3 1.3 0 0 0 5.25 7c0 1.237.388 2.22 1.01 2.982M12 16.25a.75.75 0 0 1 .75.75v2.25H16a.75.75 0 0 1 0 1.5H8a.75.75 0 0 1 0-1.5h3.25V17a.75.75 0 0 1 .75-.75"
									/>
									<path
										fill="currentColor"
										d="M11.77 6.555a.25.25 0 0 1 .46 0l.505 1.212a.25.25 0 0 0 .21.153l1.309.105a.25.25 0 0 1 .143.439l-.997.854a.25.25 0 0 0-.08.248l.304 1.276a.25.25 0 0 1-.374.272l-1.12-.684a.25.25 0 0 0-.26 0l-1.12.684a.25.25 0 0 1-.374-.272l.305-1.276a.25.25 0 0 0-.08-.248l-.998-.854a.25.25 0 0 1 .143-.44l1.308-.104a.25.25 0 0 0 .211-.153z"
										opacity="0.5"
									/>
								</svg>
							</div>
							<div>
								<div className="text-zinc-400/80">Longest Streak</div>
								<div className="flex items-center font-medium text-white">
									{isLoaded ? (
										<>
											{longestStreak}
											<span className="ml-0.5">
												day{longestStreak !== 1 ? "s" : ""}
											</span>
										</>
									) : (
										<StatSkeleton />
									)}
								</div>
							</div>
						</div>
					</motion.div>
				</div>

				{/* Contribution graph with minimal effects */}
				<div
					ref={scrollContainerRef}
					className="scrollbar-thin scrollbar-thumb-zinc-700/30 scrollbar-track-transparent relative z-10 overflow-x-auto"
				>
					<div className="min-w-[700px]">
						<div className="flex">
							<div className="relative flex-1">
								{/* Month labels */}
								<div className="flex h-5 text-[10px] text-zinc-500/70">
									{monthLabels.map(
										(label: {
											month:
												| string
												| number
												| bigint
												| boolean
												| ReactElement<
														unknown,
														string | JSXElementConstructor<any>
												  >
												| Iterable<ReactNode>
												| ReactPortal
												| Promise<
														| string
														| number
														| bigint
														| boolean
														| ReactPortal
														| ReactElement<
																unknown,
																string | JSXElementConstructor<any>
														  >
														| Iterable<ReactNode>
														| null
														| undefined
												  >
												| null
												| undefined;
											position: any;
										}) => (
											<div
												key={`month-${label.month}-${label.position}`}
												className="absolute"
												style={{
													left: `${label.position}px`,
												}}
											>
												{label.month}
											</div>
										),
									)}
								</div>

								{/* Contribution cells with hover glow effect */}
								<div className="grid grid-flow-col gap-[2px]">
									{visibleContributions.map((week: any[], weekIndex: any) => {
										// Use the first valid date in the week as the key, fallback to joining all dates
										const weekKey =
											week.find((d) => d.date)?.date ||
											week.map((d) => d.date).join("-") ||
											`week-${weekIndex}`;
										return (
											<ContributionWeek
												key={weekKey}
												week={week}
												getContributionColor={getContributionColor}
												isLoaded={isLoaded}
												onHover={handleCellHover}
											/>
										);
									})}
								</div>
							</div>
						</div>
					</div>
				</div>

				<TooltipPortal show={!!hoveredDay} anchorRect={hoveredRect}>
					{hoveredDay && (
						<div
							className="whitespace-nowrap rounded px-1 py-0.5 font-medium text-white"
							style={{
								backgroundColor: "#1b1f23",
								boxShadow:
									"0 1px 3px rgba(0, 0, 0, 0.3), 0 4px 12px rgba(0, 0, 0, 0.15)",
								fontSize: "10px",
							}}
						>
							<strong>{hoveredDay.count}</strong> contribution
							{hoveredDay.count !== 1 ? "s" : ""} on{" "}
							{new Date(hoveredDay.date).toLocaleDateString("en-US", {
								month: "short",
								day: "numeric",
								year: "numeric",
							})}
						</div>
					)}
				</TooltipPortal>

				{/* Legend & Stats - fixed at bottom */}
				<div className="mt-2 flex items-center justify-between text-[10px] text-white">
					<div className="font-medium">
						{isLoaded ? (
							<>
								This year, I achieved {totalContributions.toLocaleString()}{" "}
								contributions
							</>
						) : (
							<>
								This year, I achieved <StatSkeleton /> contributions
							</>
						)}
					</div>
					<div className="flex items-center">
						<span className="mr-1">Less</span>
						<div className="flex items-center gap-[2px]">{legendItems}</div>
						<span className="ml-1">More</span>
					</div>
				</div>
			</div>
		</motion.div>
	);
}
