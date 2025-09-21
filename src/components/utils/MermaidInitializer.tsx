"use client";

import mermaid from "mermaid";
import { useEffect } from "react";

export default function MermaidInitializer() {
	useEffect(() => {
		// Mermaid configuration with dark theme
		mermaid.initialize({
			startOnLoad: true,
			theme: "dark", // Changed to dark theme
			securityLevel: "loose",
			themeVariables: {
				primaryColor: "#34d399",
				primaryTextColor: "#ffffff", // White text
				primaryBorderColor: "#34d399",
				lineColor: "#34d399",
				secondaryColor: "#1e293b", // Dark gray
				tertiaryColor: "#0f172a", // Very dark
				background: "transparent", // Transparent background
				mainBkg: "#374151", // Dark background for nodes
				secondaryBkg: "#1e293b", // Dark secondary
				tertiaryBkg: "#0f172a", // Dark tertiary
				clusterBkg: "rgba(52, 211, 153, 0.1)",
				clusterBorder: "#34d399",
				edgeLabelBackground: "rgba(15, 23, 42, 0.9)",
			},
			flowchart: {
				htmlLabels: true,
				curve: "basis",
				useMaxWidth: true,
			},
		});

		// Simple render function
		const renderMermaid = () => {
			try {
				const mermaidElements = document.querySelectorAll(".mermaid");
				if (mermaidElements.length > 0) {
					mermaid.run();
				}
			} catch (error) {
				console.error("Mermaid initialization failed:", error);
			}
		};

		// Initial render
		setTimeout(renderMermaid, 100);
	}, []);

	return null;
}
