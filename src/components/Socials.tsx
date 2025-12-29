"use client";

import { motion } from "framer-motion";
import type React from "react";
import { useId } from "react";
import { trackSocialClick } from "~/utils/posthog";

const socials = [
	{
		id: 1,
		name: "GitHub",
		url: "https://github.com/AnishSarkar22",
		icon: (props: React.SVGProps<SVGSVGElement>) => (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width={20}
				height={20}
				viewBox="0 0 24 24"
				{...props}
			>
				<title>GitHub</title>
				<path
					fill="none"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="2"
					d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2c2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2a4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6c-.6.6-.6 1.2-.5 2V21"
				/>
			</svg>
		),
		status: "social",
	},
	{
		id: 2,
		name: "Linkedin",
		url: "https://www.linkedin.com/in/anishsarkar22/",
		icon: (props: React.SVGProps<SVGSVGElement>) => (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width={20}
				height={20}
				viewBox="0 0 24 24"
				{...props}
			>
				<title>LinkedIn</title>
				<g
					fill="none"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="2"
				>
					<path d="M8 11v5m0-8v.01M12 16v-5m4 5v-3a2 2 0 1 0-4 0" />
					<path d="M3 7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z" />
				</g>
			</svg>
		),
		status: "social",
	},
	{
		id: 3,
		name: "LeetCode",
		url: "https://leetcode.com/u/AnishSarkar22/",
		icon: (props: React.SVGProps<SVGSVGElement>) => (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width={20}
				height={20}
				viewBox="0 0 24 24"
				{...props}
			>
				<title>LeetCode</title>
				<path
					fill="none"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="2"
					d="M12 13h7.5M9.424 7.268l4.999-4.999m2.21 14.375l-2.402 2.415a3.19 3.19 0 0 1-4.524 0l-3.77-3.787a3.223 3.223 0 0 1 0-4.544l3.77-3.787a3.19 3.19 0 0 1 4.524 0l2.302 2.313"
				/>
			</svg>
		),
		status: "social",
	},
	{
		id: 4,
		name: "X",
		url: "https://x.com/AnishSarkar22",
		icon: (props: React.SVGProps<SVGSVGElement>) => (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width={20}
				height={20}
				viewBox="0 0 24 24"
				{...props}
			>
				<title>X</title>
				<path
					fill="none"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="2"
					d="m4 4l11.733 16H20L8.267 4zm0 16l6.768-6.768m2.46-2.46L20 4"
				/>
			</svg>
		),
		status: "social",
	},
	{
		id: 5,
		name: "Gitlab",
		url: "https://gitlab.com/AnishSarkar22",
		icon: (props: React.SVGProps<SVGSVGElement>) => (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width={20}
				height={20}
				viewBox="0 0 24 24"
				{...props}
			>
				<title>GitLab</title>
				<path
					fill="currentColor"
					d="m21.94 13.11l-1.05-3.22c0-.03-.01-.06-.02-.09l-2.11-6.48a.86.86 0 0 0-.8-.57c-.36 0-.68.25-.79.58l-2 6.17H8.84L6.83 3.33a.85.85 0 0 0-.79-.58c-.37 0-.69.25-.8.58L3.13 9.82v.01l-1.07 3.28c-.16.5.01 1.04.44 1.34l9.22 6.71c.17.12.39.12.56-.01l9.22-6.7c.43-.3.6-.84.44-1.34M8.15 10.45l2.57 7.91l-6.17-7.91m8.73 7.92l2.47-7.59l.1-.33h3.61l-5.59 7.16m4.1-13.67l1.81 5.56h-3.62m-1.3.95l-1.79 5.51L12 19.24l-2.86-8.79M6.03 3.94L7.84 9.5H4.23m-1.18 4.19c-.09-.07-.13-.19-.09-.29l.79-2.43l5.82 7.45m11.38-4.73l-6.51 4.73l.02-.03l5.79-7.42l.79 2.43c.04.1 0 .22-.09.29"
				/>
			</svg>
		),
		status: "social",
	},
	{
		id: 6,
		name: "Instagram",
		url: "https://www.instagram.com/anishsarkar22",
		icon: (props: React.SVGProps<SVGSVGElement>) => (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width={20}
				height={20}
				viewBox="0 0 24 24"
				{...props}
			>
				<title>Instagram</title>
				<g
					fill="none"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="2"
				>
					<path d="M4 8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" />
					<path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0-6 0m7.5-4.5v.01" />
				</g>
			</svg>
		),
		status: "social",
	},
	{
		id: 7,
		name: "Steam",
		url: "https://steamcommunity.com/id/vernithor/",
		icon: (props: React.SVGProps<SVGSVGElement>) => (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width={20}
				height={20}
				viewBox="0 0 24 24"
				{...props}
			>
				<title>Steam</title>
				<g
					fill="none"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="2"
				>
					<path d="M16.5 5a4.5 4.5 0 1 1-.653 8.953L11.5 16.962V17a3 3 0 0 1-2.824 3H8.5a3 3 0 0 1-2.94-2.402L3 16.5V13l3.51 1.755a2.99 2.99 0 0 1 2.834-.635l2.727-3.818A4.5 4.5 0 0 1 16.5 5" />
					<circle cx="16.5" cy="9.5" r="1" fill="currentColor" />
				</g>
			</svg>
		),
		status: "social",
	},
	{
		id: 8,
		name: "Stackoverflow",
		url: "https://stackoverflow.com/users/18739873/anish-sarkar?tab=profile",
		icon: (props: React.SVGProps<SVGSVGElement>) => (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width={20}
				height={20}
				viewBox="0 0 24 24"
				{...props}
			>
				<title>Stack Overflow</title>
				<path
					fill="none"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="2"
					d="M4 17v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1M8 16h8m-7.678-3.418l7.956.836m-7.491-4.25l7.826 1.664m-6.517-5.068l7.608 2.472"
				/>
			</svg>
		),
		status: "social",
	},
];

export default function Socials() {
	const sectionId = useId();

	// for posthog analytics
	const handleSocialClick = (platform: string, url: string) => {
		trackSocialClick(platform, url);
	};

	return (
		<section
			// use a semantic element and unique id; tabIndex makes it focusable for accessibility
			id={sectionId}
			aria-label="Social links"
			tabIndex={-1}
			className="relative mb-16 text-white"
		>
			{/* Heading */}
			<motion.h1
				className="relative inline-block font-bold font-pixel text-2xl text-white"
				whileHover={{ scale: 1.03 }}
				transition={{ type: "spring", stiffness: 400, damping: 10 }}
			>
				<span className="inline-block text-green-300 will-change-transform">
					&gt;
				</span>{" "}
				<span className="group relative">
					<span className="animate-shimmer bg-[length:200%_100%] bg-gradient-to-r from-white via-green-200 to-white bg-clip-text text-transparent">
						socials
					</span>
				</span>
			</motion.h1>

			{/* Social Links */}
			<ul className="my-10 flex flex-wrap items-center gap-x-5 gap-y-4">
				{socials
					.filter((item) => item.status === "social")
					.map((value) => (
						<li key={value.id}>
							<a
								href={value.url}
								target="_blank"
								rel="noopener noreferrer"
								onClick={() =>
									handleSocialClick(value.name.toLowerCase(), value.url)
								}
								className="group flex items-center border-zinc-200 border-b dark:border-b-zinc-800"
							>
								<value.icon
									className="h-5 w-5 flex-shrink-0 text-zinc-500 duration-300 group-hover:text-zinc-800 group-hover:dark:text-white"
									aria-hidden="true"
								/>
								&nbsp;
								{value.name}
							</a>
						</li>
					))}
			</ul>
		</section>
	);
}
