import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface TooltipPortalProps {
	show: boolean;
	anchorRect: DOMRect | null;
	children: React.ReactNode;
}

export function TooltipPortal({
	show,
	anchorRect,
	children,
}: TooltipPortalProps) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);

	if (!mounted || !show || !anchorRect) return null;

	// Position tooltip above the anchor
	const style: React.CSSProperties = {
		position: "fixed",
		left: anchorRect.left + anchorRect.width / 2,
		top: anchorRect.top - 8, // 8px above the cell
		transform: "translate(-50%, -100%)",
		zIndex: 9999,
		pointerEvents: "none",
	};

	return createPortal(
		<AnimatePresence>
			<motion.div
				key="tooltip"
				style={style}
				initial={{ opacity: 0, y: 5, scale: 0.9 }}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				exit={{ opacity: 0, y: 5, scale: 0.9 }}
				transition={{ type: "spring", stiffness: 500, damping: 25 }}
			>
				{children}
			</motion.div>
		</AnimatePresence>,
		document.body,
	);
}
