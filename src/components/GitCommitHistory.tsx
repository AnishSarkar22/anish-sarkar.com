"use client";

import { AnimatePresence, motion } from "framer-motion";
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
			className="mx-0.3 h-2 w-2 rounded-sm"
			style={{ backgroundColor: getContributionColor(level, false) }}
			whileHover={{
				scale: 1.3,
				boxShadow:
					level > 0 ? `0 0 ${level * 3}px rgba(52, 211, 153, 0.7)` : "none",
			}}
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
		isLoaded,
	}: {
		day: ContributionDay;
		getContributionColor: (level: number, isHovered: boolean) => string;
		getGlowIntensity: (level: number) => number;
		isLoaded: boolean;
	}) => {
		const [isHovered, setIsHovered] = useState(false);
		const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
		const ref = useRef<HTMLDivElement>(null);

		useEffect(() => {
			if (isHovered && ref.current) {
				const updateRect = () =>
					setAnchorRect(ref.current?.getBoundingClientRect() ?? null);
				updateRect();
				window.addEventListener("scroll", updateRect, true);
				window.addEventListener("resize", updateRect);
				return () => {
					window.removeEventListener("scroll", updateRect, true);
					window.removeEventListener("resize", updateRect);
				};
			}
		}, [isHovered]);

		// Show placeholder cell structure
		if (day.count < 0 || !isLoaded) {
			return (
				<div className="h-[10px] w-[10px] rounded-sm border-[0.9px] border-gray-500/20 bg-zinc-800/20" />
			);
		}

		return (
			<>
				<motion.div
					ref={ref}
					className="group relative h-[10px] w-[10px] rounded-sm border-[0.9px] border-gray-500/20"
					style={{
						backgroundColor: getContributionColor(day.level, isHovered),
					}}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.3 }}
					onHoverStart={() => setIsHovered(true)}
					onHoverEnd={() => setIsHovered(false)}
					whileHover={{
						scale: 1.5,
						zIndex: 10,
						transition: { type: "spring", stiffness: 300, damping: 15 },
					}}
				/>
				<TooltipPortal show={isHovered} anchorRect={anchorRect}>
					<motion.div
						className="-translate-x-1/2 z-50 mb-2 whitespace-nowrap rounded border border-emerald-500/20 bg-zinc-800/90 px-1.5 py-0.5 text-sm text-white shadow-lg"
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
	},
);

// Memoized contribution week component
const ContributionWeek = memo(
	({
		week,
		getContributionColor,
		getGlowIntensity,
		isLoaded,
	}: {
		week: ContributionDay[];
		getContributionColor: (level: number, isHovered: boolean) => string;
		getGlowIntensity: (level: number) => number;
		isLoaded: boolean;
	}) => (
		<div className="grid grid-rows-7 gap-[2px]">
			{week.map((day, dayIndex) => (
				<ContributionCell
					key={day.date || `empty-${dayIndex}`}
					day={day}
					getContributionColor={getContributionColor}
					getGlowIntensity={getGlowIntensity}
					isLoaded={isLoaded}
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
	const [isLoaded, setIsLoaded] = useState(false);

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

	const getGlowIntensity = useCallback((level: number) => {
		const safeLevel = Math.max(0, Math.min(level, GLOW_INTENSITIES.length - 1));
		return GLOW_INTENSITIES[safeLevel] ?? 0;
	}, []);

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
		contributions.forEach((week, weekIndex) => {
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
			<div className="relative overflow-hidden">
				<BackgroundGradient />
				{/* Header with stats - simplified */}
				<div className="relative z-10">
					<motion.div className="mb-1 flex items-center gap-1">
						<h3 className="font-medium text-green-400 text-xs">
							{isLoaded ? (
								<>
									{totalContributions.toLocaleString()} contributions in the
									last year
								</>
							) : (
								<>
									<StatSkeleton /> contributions in the last year
								</>
							)}
						</h3>
					</motion.div>
					<motion.div className="mb-2 grid grid-cols-2 gap-1 text-[10px]">
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
				<div className="scrollbar-thin scrollbar-thumb-zinc-700/30 scrollbar-track-transparent relative z-10 overflow-x-auto">
					<div className="min-w-[700px]">
						<div className="flex">
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
									{visibleContributions.map((week, weekIndex) => {
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
												getGlowIntensity={getGlowIntensity}
												isLoaded={isLoaded}
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
			</div>
		</div>
	);
}
