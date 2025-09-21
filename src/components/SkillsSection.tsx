"use client";

import {
	AnimatePresence,
	motion,
	useMotionValue,
	useSpring,
	useTransform,
} from "framer-motion";
import Image from "next/image";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

// Define interface for skill
interface Skill {
	id: string;
	name: string;
	logo: string;
	color: string;
	category: string;
}

const orderedCategories = [
	"Languages",
	"Backend",
	"Frontend",
	"Databases",
	"Cloud",
	"Tools",
	"Operating Systems",
];

// Optimized color constants to avoid re-creation during rendering
const SKILL_COLORS = {
	react: "#61dafb",
	typescript: "#3178c6",
	javascript: "#f7df1e",
	html: "#e34f26",
	css: "#1572b6",
	svelte: "#FF3E00",
	node: "#339933",
	python: "#3776ab",
	git: "#f05032",
	nextjs: "#ffffff",
	firebase: "#ffca28",
	mongodb: "#47a248",
	graphql: "#e10098",
	aws: "#ff9900",
	docker: "#2496ed",
	java: "#EA2D2E",
	bash: "#2A3138",
	django: "#092E20",
	flask: "#ffffff",
	fastapi: "#009688",
	springboot: "#6DB33F",
	mysql: "#01618A",
	postgresql: "#336791",
	sqlite: "#96D7F4",
	archlinux: "#1891CF",
	redis: "#D82B1F",
};

// Skill data with logo
const skills: Skill[] = [
	{
		id: "python",
		name: "Python",
		logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
		color: SKILL_COLORS.python,
		category: "Languages",
	},
	{
		id: "java",
		name: "Java",
		logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg",
		color: SKILL_COLORS.java,
		category: "Languages",
	},
	{
		id: "javascript",
		name: "JavaScript",
		logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
		color: SKILL_COLORS.javascript,
		category: "Languages",
	},
	// {
	//   id: "typescript",
	//   name: "TypeScript",
	//   logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
	//   color: SKILL_COLORS.typescript,
	//   category: "Languages",
	// },
	// {
	//   id: "node",
	//   name: "Node.js",
	//   level: 3,
	//   logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
	//   color: SKILL_COLORS.node,
	//   category: "Backend"
	// },
	{
		id: "django",
		name: "Django",
		logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg",
		color: SKILL_COLORS.django,
		category: "Backend",
	},
	{
		id: "fastapi",
		name: "FastAPI",
		logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg",
		color: SKILL_COLORS.fastapi,
		category: "Backend",
	},
	{
		id: "flask",
		name: "Flask",
		logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg",
		color: SKILL_COLORS.flask,
		category: "Backend",
	},
	{
		id: "springboot",
		name: "Spring Boot",
		logo: "https://spring.io/img/projects/spring-boot.svg",
		color: SKILL_COLORS.springboot,
		category: "Backend",
	},
	// {
	//   id: "react",
	//   name: "React",
	//   logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
	//   color: SKILL_COLORS.react,
	//   category: "Frontend",
	// },
	{
		id: "html",
		name: "HTML5",
		logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
		color: SKILL_COLORS.html,
		category: "Frontend",
	},
	{
		id: "css",
		name: "CSS3",
		logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
		color: SKILL_COLORS.css,
		category: "Frontend",
	},
	{
		id: "svelte",
		name: "Svelte",
		logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg",
		color: SKILL_COLORS.svelte,
		category: "Frontend",
	},
	{
		id: "mysql",
		name: "MySQL",
		logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
		color: SKILL_COLORS.mysql,
		category: "Databases",
	},
	{
		id: "postgresql",
		name: "PostgreSQL",
		logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
		color: SKILL_COLORS.postgresql,
		category: "Databases",
	},
	{
		id: "sqlite",
		name: "SQLite",
		logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg",
		color: SKILL_COLORS.sqlite,
		category: "Databases",
	},
	{
		id: "aws",
		name: "AWS",
		logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
		color: SKILL_COLORS.aws,
		category: "Cloud",
	},
	{
		id: "firebase",
		name: "Firebase",
		logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",
		color: SKILL_COLORS.firebase,
		category: "Cloud",
	},
	{
		id: "mongodb",
		name: "MongoDB",
		logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
		color: SKILL_COLORS.mongodb,
		category: "Databases",
	},
	{
		id: "redis",
		name: "Redis",
		logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg",
		color: SKILL_COLORS.redis,
		category: "Databases",
	},
	{
		id: "docker",
		name: "Docker",
		logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
		color: SKILL_COLORS.docker,
		category: "Tools",
	},
	{
		id: "git",
		name: "Git",
		logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
		color: SKILL_COLORS.git,
		category: "Tools",
	},
	{
		id: "bash",
		name: "Bash",
		logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg",
		color: SKILL_COLORS.bash,
		category: "Tools",
	},
	// {
	//   id: "archlinux",
	//   name: "Arch Linux",
	//   logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/archlinux/archlinux-original.svg",
	//   color: SKILL_COLORS.archlinux,
	//   category: "Operating Systems",
	// },
];

// List of skill categories
const categories = orderedCategories.filter((cat) =>
	skills.some((skill) => skill.category === cat),
);

// Component displays a skill
const SkillItem = memo(
	({
		skill,
		isHovered,
		onHoverStart,
		onHoverEnd,
		index,
	}: {
		skill: Skill;
		isHovered: boolean;
		onHoverStart: () => void;
		onHoverEnd: () => void;
		index: number;
	}) => {
		// Refs and motion values for magnetic effects
		const itemRef = useRef<HTMLDivElement>(null);
		const mouseX = useMotionValue(0);
		const mouseY = useMotionValue(0);

		// Spring physics for smooth motion
		const springX = useSpring(mouseX, { stiffness: 150, damping: 15 });
		const springY = useSpring(mouseY, { stiffness: 150, damping: 15 });

		// Transforms for 3D effects
		const rotateX = useTransform(springY, [-50, 50], [10, -10]);
		const rotateY = useTransform(springX, [-50, 50], [-10, 10]);
		const glowX = useTransform(springX, [-50, 0, 50], ["-20px", "0px", "20px"]);
		const glowY = useTransform(springY, [-50, 0, 50], ["-20px", "0px", "20px"]);

		// Mouse movement handling for magnetic effect
		const handleMouseMove = useCallback(
			(e: React.MouseEvent) => {
				if (!itemRef.current || !isHovered) return;

				const rect = itemRef.current.getBoundingClientRect();
				const centerX = rect.left + rect.width / 2;
				const centerY = rect.top + rect.height / 2;

				mouseX.set(e.clientX - centerX);
				mouseY.set(e.clientY - centerY);
			},
			[isHovered, mouseX, mouseY],
		);

		// Reset position when mouse leaves
		const handleMouseLeave = useCallback(() => {
			mouseX.set(0);
			mouseY.set(0);
			onHoverEnd();
		}, [mouseX, mouseY, onHoverEnd]);

		// Generate random seeds
		const particles = useMemo(() => {
			return Array.from({ length: 15 }).map(() => ({
				x: Math.random() * 100,
				y: Math.random() * 100,
				size: Math.random() * 3 + 1,
				delay: Math.random() * 0.5,
				duration: 1 + Math.random() * 2,
			}));
		}, []);

		return (
			<motion.div
				ref={itemRef}
				className="group relative flex items-center justify-between overflow-hidden rounded-xl p-5 backdrop-blur-sm"
				style={{
					backgroundColor: isHovered
						? `${skill.color}10`
						: "rgba(39, 39, 42, 0.3)",
					border: `1.5px solid ${
						isHovered ? skill.color : "rgba(63, 63, 70, 0.3)"
					}`,
					boxShadow: isHovered ? `0 0 25px ${skill.color}30` : "none",
					rotateX: isHovered ? rotateX : 0,
					rotateY: isHovered ? rotateY : 0,
					perspective: 1000,
					transformStyle: "preserve-3d",
				}}
				initial={{ opacity: 0, y: 20 }}
				animate={{
					opacity: 1,
					y: 0,
					transition: { duration: 0.5, delay: index * 0.1 },
				}}
				whileHover={{
					scale: 1.03,
					transition: { type: "spring", stiffness: 400, damping: 10 },
				}}
				onHoverStart={onHoverStart}
				onHoverEnd={handleMouseLeave}
				onMouseMove={handleMouseMove}
			>
				{/* Hover particle effects */}
				<AnimatePresence>
					{isHovered &&
						particles.map((particle) => (
							<motion.div
								key={`particle-${particle.x}-${particle.y}-${particle.size}-${particle.delay}`}
								className="pointer-events-none absolute z-0 rounded-full"
								initial={{
									opacity: 0,
									scale: 0,
									x: 0,
									y: 0,
									top: "50%",
									left: "50%",
								}}
								animate={{
									opacity: [0, 0.8, 0],
									scale: [0, Math.random() * 1 + 0.5, 0],
									x: [0, (Math.random() - 0.5) * 200],
									y: [0, (Math.random() - 0.5) * 200],
								}}
								exit={{ opacity: 0, scale: 0 }}
								transition={{
									duration: particle.duration,
									delay: particle.delay,
									ease: "easeOut",
								}}
								style={{
									width: particle.size,
									height: particle.size,
									backgroundColor: skill.color,
									filter: "blur(1px)",
									boxShadow: `0 0 ${particle.size * 2}px ${skill.color}`,
								}}
							/>
						))}
				</AnimatePresence>

				{/* Motion contour effect */}
				{isHovered && (
					<>
						<motion.div
							className="absolute top-0 left-0 h-[1.5px] w-full"
							style={{
								background: `linear-gradient(90deg, transparent, ${skill.color}, transparent)`,
							}}
							animate={{
								left: ["-100%", "100%"],
							}}
							transition={{
								duration: 2,
								repeat: Number.POSITIVE_INFINITY,
								ease: "linear",
							}}
						/>
						<motion.div
							className="absolute right-0 bottom-0 h-[1.5px] w-full"
							style={{
								background: `linear-gradient(90deg, transparent, ${skill.color}, transparent)`,
							}}
							animate={{
								right: ["-100%", "100%"],
							}}
							transition={{
								duration: 2,
								repeat: Number.POSITIVE_INFINITY,
								ease: "linear",
							}}
						/>
						<motion.div
							className="absolute top-0 left-0 h-full w-[1.5px]"
							style={{
								background: `linear-gradient(180deg, transparent, ${skill.color}, transparent)`,
							}}
							animate={{
								top: ["-100%", "100%"],
							}}
							transition={{
								duration: 2.5,
								repeat: Number.POSITIVE_INFINITY,
								ease: "linear",
							}}
						/>
						<motion.div
							className="absolute right-0 bottom-0 h-full w-[1.5px]"
							style={{
								background: `linear-gradient(180deg, transparent, ${skill.color}, transparent)`,
							}}
							animate={{
								bottom: ["-100%", "100%"],
							}}
							transition={{
								duration: 2.5,
								repeat: Number.POSITIVE_INFINITY,
								ease: "linear",
							}}
						/>
					</>
				)}

				{/* Mouse glow effect */}
				{isHovered && (
					<motion.div
						className="-z-10 absolute inset-0 opacity-60"
						style={{
							background: `radial-gradient(circle at center, ${skill.color}30 0%, transparent 70%)`,
							filter: "blur(20px)",
							x: glowX,
							y: glowY,
						}}
					/>
				)}

				{/* Skill Content */}
				<div className="flex items-center space-x-4">
					<motion.div
						className="relative flex h-12 w-12 items-center justify-center rounded-lg"
						style={{
							backgroundColor: isHovered
								? `${skill.color}20`
								: "rgba(39, 39, 42, 0.5)",
							boxShadow: isHovered ? `0 0 20px ${skill.color}40` : "none",
							z: 10,
						}}
						animate={
							isHovered
								? {
										scale: [1, 1.1, 1],
										rotate: [0, 5, 0, -5, 0],
										z: [0, 30, 0],
									}
								: {}
						}
						transition={{
							duration: 2,
							repeat: isHovered ? Number.POSITIVE_INFINITY : 0,
							repeatType: "reverse",
						}}
					>
						{/* Skill Logo */}
						<motion.div
							className="relative h-8 w-8"
							animate={
								isHovered
									? {
											filter: [
												"drop-shadow(0 0 0px transparent)",
												`drop-shadow(0 0 8px ${skill.color})`,
												"drop-shadow(0 0 0px transparent)",
											],
										}
									: {}
							}
							transition={{
								duration: 2,
								repeat: isHovered ? Number.POSITIVE_INFINITY : 0,
							}}
						>
							<Image
								src={skill.logo}
								alt={skill.name}
								width={32}
								height={32}
								className="object-contain"
								style={{
									filter:
										skill.id === "nextjs" ||
										skill.id === "flask" ||
										skill.id === "bash"
											? "invert(1)"
											: "none",
								}}
							/>
						</motion.div>

						{/* Halo effect */}
						{isHovered && (
							<motion.div
								className="-z-10 absolute inset-0 rounded-lg"
								initial={{ opacity: 0 }}
								animate={{
									opacity: [0.2, 0.6, 0.2],
									scale: [1, 1.2, 1],
								}}
								transition={{
									duration: 2,
									repeat: Number.POSITIVE_INFINITY,
									repeatType: "reverse",
								}}
								style={{
									background: `radial-gradient(circle, ${skill.color}50 0%, transparent 70%)`,
									filter: "blur(8px)",
								}}
							/>
						)}
					</motion.div>

					<div>
						<motion.h3
							className="mb-1 font-medium text-base"
							animate={{
								color: isHovered ? skill.color : "#fff",
								textShadow: isHovered ? `0 0 10px ${skill.color}50` : "none",
							}}
							transition={{ duration: 0.3 }}
						>
							{skill.name}
						</motion.h3>

						{/* Show categories */}
						<motion.div
							className="font-light text-xs opacity-70"
							animate={{
								opacity: isHovered ? 0.9 : 0.7,
								color: isHovered ? skill.color : "#aaa",
							}}
						>
							{skill.category}
						</motion.div>
					</div>
				</div>
			</motion.div>
		);
	},
);

SkillItem.displayName = "SkillItem";

// Component displays skill list
const CategorySection = memo(
	({
		category,
		skills,
		hoveredSkill,
		onHoverStart,
		onHoverEnd,
	}: {
		category: string;
		skills: Skill[];
		hoveredSkill: string | null;
		onHoverStart: (id: string) => void;
		onHoverEnd: () => void;
	}) => {
		return (
			<div className="mb-10">
				<motion.h2
					className="relative mb-4 inline-block font-semibold text-white/90 text-xl"
					initial={{ opacity: 0, x: -10 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5 }}
				>
					<span className="relative z-10 bg-gradient-to-r from-white via-green-200 to-white bg-clip-text text-transparent">
						{category}
					</span>
					<motion.span
						className="-bottom-1 absolute left-0 h-[2px] bg-gradient-to-r from-green-300/0 via-green-300 to-green-300/0"
						initial={{ width: 0 }}
						animate={{ width: "100%" }}
						transition={{ duration: 0.8, delay: 0.2 }}
						style={{ boxShadow: "0 1px 8px rgba(134, 239, 172, 0.4)" }}
					/>
				</motion.h2>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					{skills
						.filter((skill) => skill.category === category)
						.map((skill, index) => (
							<SkillItem
								key={skill.id}
								skill={skill}
								isHovered={hoveredSkill === skill.id}
								onHoverStart={() => onHoverStart(skill.id)}
								onHoverEnd={onHoverEnd}
								index={index}
							/>
						))}
				</div>
			</div>
		);
	},
);

CategorySection.displayName = "CategorySection";

export default function SkillsSection() {
	const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
	const sectionRef = useRef<HTMLDivElement>(null);

	// Optimize event handling functions
	const handleHoverStart = useCallback((id: string) => {
		setHoveredSkill(id);
	}, []);

	const handleHoverEnd = useCallback(() => {
		setHoveredSkill(null);
	}, []);

	// Optimize animation variations
	const containerVariants = useMemo(
		() => ({
			hidden: { opacity: 0, y: 20 },
			visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
		}),
		[],
	);

	const titleVariants = useMemo(
		() => ({
			hidden: { opacity: 0, x: -20 },
			visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.2 } },
		}),
		[],
	);

	return (
		<motion.div
			ref={sectionRef}
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
						skills
					</span>

					{/* Animated underline with glow */}
					{/* <motion.span
            className="-bottom-1 absolute left-0 h-[2px] bg-gradient-to-r from-green-300/0 via-green-300 to-green-300/0 will-change-transform"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1, delay: 0.5 }}
            style={{ boxShadow: '0 2px 10px rgba(134, 239, 172, 0.3)' }}
          /> */}
				</span>
			</motion.h1>

			{/* List of skill categories */}
			<div className="mt-10">
				{categories.map((category) => (
					<CategorySection
						key={category}
						category={category}
						skills={skills}
						hoveredSkill={hoveredSkill}
						onHoverStart={handleHoverStart}
						onHoverEnd={handleHoverEnd}
					/>
				))}
			</div>
		</motion.div>
	);
}
