"use client";

import type React from "react";
import { useCallback, useRef, useState } from "react";

// Marquee component props interface
export interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
	className?: string;
	reverse?: boolean;
	pauseOnHover?: boolean;
	children: React.ReactNode;
	vertical?: boolean;
	repeat?: number;
	duration?: string;
	delay?: string;
}

// Interactive Marquee component for infinite scrolling with touch/drag support
export function Marquee({
	className = "",
	reverse = false,
	pauseOnHover = false,
	children,
	vertical = false,
	repeat = 4,
	duration = "100s",
	delay = "0s",
	...props
}: MarqueeProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const innerRef = useRef<HTMLDivElement>(null);
	const [isTouching, setIsTouching] = useState(false);
	const startXRef = useRef(0);
	const currentTranslateRef = useRef(0);
	const lastTranslateRef = useRef(0);

	// Handle touch start
	const handleTouchStart = useCallback((e: React.TouchEvent) => {
		setIsTouching(true);
		startXRef.current = e.touches[0].clientX;
		// Get current computed transform
		if (innerRef.current) {
			const style = window.getComputedStyle(innerRef.current);
			const matrix = new DOMMatrix(style.transform);
			lastTranslateRef.current = matrix.m41;
		}
	}, []);

	// Handle touch move
	const handleTouchMove = useCallback(
		(e: React.TouchEvent) => {
			if (!isTouching) return;
			const currentX = e.touches[0].clientX;
			const diff = currentX - startXRef.current;
			currentTranslateRef.current = lastTranslateRef.current + diff;

			if (innerRef.current) {
				innerRef.current.style.transform = `translateX(${currentTranslateRef.current}px)`;
			}
		},
		[isTouching],
	);

	// Handle touch end
	const handleTouchEnd = useCallback(() => {
		setIsTouching(false);
		lastTranslateRef.current = currentTranslateRef.current;
	}, []);

	// Handle mouse events for desktop
	const handleMouseDown = useCallback((e: React.MouseEvent) => {
		setIsTouching(true);
		startXRef.current = e.clientX;
		if (innerRef.current) {
			const style = window.getComputedStyle(innerRef.current);
			const matrix = new DOMMatrix(style.transform);
			lastTranslateRef.current = matrix.m41;
		}
	}, []);

	const handleMouseMove = useCallback(
		(e: React.MouseEvent) => {
			if (!isTouching) return;
			const diff = e.clientX - startXRef.current;
			currentTranslateRef.current = lastTranslateRef.current + diff;

			if (innerRef.current) {
				innerRef.current.style.transform = `translateX(${currentTranslateRef.current}px)`;
			}
		},
		[isTouching],
	);

	const handleMouseUp = useCallback(() => {
		setIsTouching(false);
		lastTranslateRef.current = currentTranslateRef.current;
	}, []);

	const handleMouseLeave = useCallback(() => {
		if (isTouching) {
			setIsTouching(false);
			lastTranslateRef.current = currentTranslateRef.current;
		}
	}, [isTouching]);

	// Handle keyboard navigation for accessibility
	const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
		if (!innerRef.current) return;
		const scrollAmount = 100;
		if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
			e.preventDefault();
			lastTranslateRef.current += scrollAmount;
			innerRef.current.style.transform = `translateX(${lastTranslateRef.current}px)`;
		} else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
			e.preventDefault();
			lastTranslateRef.current -= scrollAmount;
			innerRef.current.style.transform = `translateX(${lastTranslateRef.current}px)`;
		}
	}, []);

	return (
		<div
			ref={containerRef}
			{...props}
			role="application"
			aria-label="Carousel - drag to scroll or use arrow keys"
			// biome-ignore lint/a11y/noNoninteractiveTabindex: interactive carousel with keyboard support
			tabIndex={0}
			className={`group flex cursor-grab select-none overflow-hidden outline-none active:cursor-grabbing ${vertical ? "flex-col" : "flex-row"} ${className}`}
			style={{
				gap: "var(--gap, 1rem)",
			}}
			onTouchStart={handleTouchStart}
			onTouchMove={handleTouchMove}
			onTouchEnd={handleTouchEnd}
			onMouseDown={handleMouseDown}
			onMouseMove={handleMouseMove}
			onMouseUp={handleMouseUp}
			onMouseLeave={handleMouseLeave}
			onKeyDown={handleKeyDown}
		>
			<div
				ref={innerRef}
				className={`flex shrink-0 ${vertical ? "flex-col" : "flex-row"} ${
					!isTouching
						? reverse
							? "animate-marquee-reverse"
							: "animate-marquee"
						: ""
				} ${pauseOnHover ? "group-hover:[animation-play-state:paused]" : ""}`}
				style={
					{
						gap: "var(--gap, 1rem)",
						"--duration": duration,
						"--repeat": repeat,
						animationDelay: delay,
					} as React.CSSProperties
				}
			>
				{/* Repeat children multiple times for seamless loop */}
				{Array(repeat)
					.fill(0)
					.map((_, i) => (
						<div
							key={`marquee-group-${
								// biome-ignore lint/suspicious/noArrayIndexKey: index is stable for repeated content
								i
							}`}
							className={`flex shrink-0 ${vertical ? "flex-col" : "flex-row"}`}
							style={{ gap: "var(--gap, 1rem)" }}
						>
							{children}
						</div>
					))}
			</div>
		</div>
	);
}

export default Marquee;
