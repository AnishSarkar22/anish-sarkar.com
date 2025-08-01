"use client";

import { useEffect } from "react";
import mermaid from "mermaid";

export default function MermaidInitializer() {
  useEffect(() => {
    // Mermaid configuration with dark theme and customizations
    mermaid.initialize({
      startOnLoad: true,
      theme: "dark",
      securityLevel: "loose",
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Roboto Mono', monospace",
      themeVariables: {
        primaryColor: "#34d399",
        primaryTextColor: "#f9fafb",
        primaryBorderColor: "#34d399",
        lineColor: "#00ff99", // Green for seams
        secondaryColor: "#1e293b",
        tertiaryColor: "#0f172a",
        // Variables for style nodes
        nodeBorder: "#333",
        nodeTextColor: "#000000",
        mainBkg: "#f9f9f9",
        nodeBkg: "#f9f9f9",
        clusterBkg: "#f1f8ff",
        clusterBorder: "#c8e1ff",
        edgeLabelBackground: "rgba(255, 255, 255, 0.7)",
      },
      flowchart: {
        htmlLabels: true,
        curve: "basis",
        diagramPadding: 8,
        useMaxWidth: true,
      },
      sequence: {
        diagramMarginX: 50,
        diagramMarginY: 10,
        actorMargin: 50,
        width: 150,
        height: 65,
        boxMargin: 10,
        boxTextMargin: 5,
        noteMargin: 10,
        messageMargin: 35,
      },
    });

    // Find and render all mermaid diagrams
    const renderMermaid = () => {
      try {
        mermaid.init(undefined, document.querySelectorAll(".mermaid"));

        // Apply styles to nodes after rendering
        setTimeout(() => {
          // Apply style to all nodes
          document
            .querySelectorAll(
              ".node rect, .node polygon, .node circle, .node ellipse"
            )
            .forEach((node) => {
              node.setAttribute("fill", "#ffffff");
              node.setAttribute("stroke", "#333333");
              node.setAttribute("stroke-width", "1px");
            });

          // Apply styles to specific nodes
          document
            .querySelectorAll(".node.B rect, .node.B polygon")
            .forEach((node) => {
              node.setAttribute("fill", "#ff99cc"); // Pink as pictured
              node.setAttribute("stroke", "#333333");
              node.setAttribute("stroke-width", "1px");
            });

          document
            .querySelectorAll(".node.E rect, .node.E polygon")
            .forEach((node) => {
              node.setAttribute("fill", "#ccccff"); // Light purple as pictured
              node.setAttribute("stroke", "#333333");
              node.setAttribute("stroke-width", "1px");
            });

          document
            .querySelectorAll(".node.F rect, .node.F polygon")
            .forEach((node) => {
              node.setAttribute("fill", "#ccffcc"); // Light green as pictured
              node.setAttribute("stroke", "#333333");
              node.setAttribute("stroke-width", "1px");
            });

          // Apply style to seams
          document.querySelectorAll(".edgePath .path").forEach((path) => {
            path.setAttribute("stroke", "#00ff99"); // Green for seams
            path.setAttribute("stroke-width", "1.5px");
          });

          // Apply styles to labels
          document.querySelectorAll(".edgeLabel").forEach((label) => {
            const labelBg = label.querySelector("rect");
            if (labelBg) {
              labelBg.setAttribute("fill", "transparent");
            }
          });

          document.querySelectorAll(".label").forEach((label) => {
            if (label.tagName === "g") {
              const foreignObject = label.querySelector("foreignObject");
              if (foreignObject) {
                const div = foreignObject.querySelector("div");
                if (div) {
                  div.style.color = "#000000";
                  div.style.fontFamily =
                    "'JetBrains Mono', 'Fira Code', 'Roboto Mono', monospace";
                }
              }
            }
          });
        }, 200);
      } catch (error) {
        console.error("Mermaid initialization failed:", error);
      }
    };

    // First render
    renderMermaid();

    // Re-render when DOM changes
    const observer = new MutationObserver((mutations) => {
      let shouldRender = false;
      mutations.forEach((mutation) => {
        if (
          mutation.type === "childList" &&
          Array.from(mutation.addedNodes).some(
            (node) =>
              node.nodeType === 1 &&
              ((node as Element).classList?.contains("mermaid") ||
                (node as Element).querySelector?.(".mermaid"))
          )
        ) {
          shouldRender = true;
        }
      });

      if (shouldRender) {
        renderMermaid();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}
