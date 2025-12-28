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
		top: anchorRect.top - 4,
		transform: "translate(-50%, -100%)",
		zIndex: 9999,
		pointerEvents: "none",
	};

	return createPortal(<div style={style}>{children}</div>, document.body);
}
