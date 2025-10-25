"use client";

import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";

interface TransitionWrapperProps {
	children: ReactNode;
}

export default function TransitionWrapper({
	children,
}: TransitionWrapperProps) {
	const pathname = usePathname();
	const [visible, setVisible] = useState(false);

	// trigger a very light fade on route change using rAF for minimal delay
	useEffect(() => {
		setVisible(false);
		let rafId = 0;
		// schedule to next frame to ensure the initial hidden style is applied
		rafId = requestAnimationFrame(() => {
			// a second rAF makes the transition more reliable across browsers
			rafId = requestAnimationFrame(() => setVisible(true));
		});
		return () => cancelAnimationFrame(rafId);
	}, []);

	return (
		<div
			key={pathname}
			className="transition-content"
			style={{
				opacity: visible ? 1 : 0,
				transition: "opacity 120ms ease",
			}}
		>
			{children}
		</div>
	);
}
