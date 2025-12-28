"use client";

import { useEffect, useRef } from "react";

interface BlogContentProps {
	html: string;
}

// copy SVGs as string constants
const COPY_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 9V6.2c0-1.12 0-1.68.218-2.108c.192-.377.497-.682.874-.874C10.52 3 11.08 3 12.2 3h5.6c1.12 0 1.68 0 2.108.218a2 2 0 0 1 .874.874C21 4.52 21 5.08 21 6.2v5.6c0 1.12 0 1.68-.218 2.108a2 2 0 0 1-.874.874C19.48 15 18.92 15 17.803 15H15M9 9H6.2c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C3 10.52 3 11.08 3 12.2v5.6c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874c.427.218.987.218 2.105.218h5.607c1.117 0 1.676 0 2.104-.218a2 2 0 0 0 .874-.874c.218-.428.218-.987.218-2.105V15M9 9h2.8c1.12 0 1.68 0 2.108.218a2 2 0 0 1 .874.874c.218.427.218.987.218 2.105V15"/></svg>`;
const CHECK_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="m 22,10 -11,11 -5,-5" /></svg>`;

export default function BlogContent({ html }: BlogContentProps) {
	const contentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (contentRef.current) {
			contentRef.current.innerHTML = "";
			const parser = new DOMParser();
			const doc = parser.parseFromString(html, "text/html");
			Array.from(doc.body.childNodes).forEach((node) => {
				contentRef.current?.appendChild(node.cloneNode(true));
			});

			// Add click handlers for anchor links
			const links = contentRef.current.querySelectorAll('a[href^="#"]');
			for (const link of links) {
				link.addEventListener("click", (e) => {
					e.preventDefault();
					const href = link.getAttribute("href");
					if (href) {
						const target = document.querySelector(href);
						if (target) {
							// Update the URL with the hash
							window.history.pushState(null, "", href);
							target.scrollIntoView({ behavior: "smooth" });
						}
					}
				});
			}

			// Add copy button and header to code blocks
			const codeBlocks = contentRef.current.querySelectorAll("pre");
			for (const block of codeBlocks) {
				const language = block.getAttribute("data-language") || "code";

				// wrap <pre> in a div.code-block-container so CSS selectors apply
				const wrapper = document.createElement("div");
				wrapper.className =
					"code-block-container relative overflow-hidden my-8";
				block.parentNode?.insertBefore(wrapper, block);

				// Create header
				const header = document.createElement("div");
				header.className =
					"code-block-header flex items-center justify-between px-4 py-2 bg-[#000000] border-b border-zinc-700/40";

				const title = document.createElement("span");
				title.className = "code-block-title text-xs font-mono text-zinc-400";
				title.textContent =
					language === "bash" || language === "sh" ? "terminal" : language;
				header.appendChild(title);

				const button = document.createElement("button");
				button.type = "button";
				button.innerHTML = COPY_ICON;
				button.className =
					"copy-btn p-1 text-zinc-500 hover:text-zinc-300 transition-colors duration-200";
				button.setAttribute("aria-label", "Copy code");

				header.appendChild(button);
				wrapper.appendChild(header);
				wrapper.appendChild(block);

				// robust copy function with clipboard fallback
				const doCopy = async () => {
					const code = block.querySelector("code");
					if (!code) return;
					const text = code.textContent || "";
					try {
						await navigator.clipboard.writeText(text);
						button.innerHTML = CHECK_ICON;
						button.classList.add("text-green-400");
					} catch {
						// fallback for older mobile browsers
						const ta = document.createElement("textarea");
						ta.value = text;
						ta.style.position = "fixed";
						ta.style.left = "-9999px";
						document.body.appendChild(ta);
						ta.select();
						try {
							document.execCommand("copy");
							button.innerHTML = CHECK_ICON;
							button.classList.add("text-green-400");
						} catch {
							// ignore
						}
						document.body.removeChild(ta);
					}
					setTimeout(() => {
						button.innerHTML = COPY_ICON;
						button.classList.remove("text-green-400");
					}, 2000);
				};

				// support both click and touchend to improve mobile reliability
				button.addEventListener("click", doCopy);
				button.addEventListener("touchend", (e) => {
					e.preventDefault();
					doCopy();
				});
			}

			// Add captions to images
			const images = contentRef.current.querySelectorAll("img");
			for (const img of images) {
				const captionText =
					img.getAttribute("title") || img.getAttribute("alt");
				if (captionText) {
					const figure = document.createElement("figure");
					figure.className = "image-container my-8 flex flex-col items-center";

					img.parentNode?.insertBefore(figure, img);
					figure.appendChild(img);

					const caption = document.createElement("figcaption");
					caption.className =
						"image-caption mt-3 text-sm text-zinc-500 font-mono";
					caption.textContent = captionText;
					figure.appendChild(caption);
				}
			}

			// Trigger Mermaid re-initialization after content is loaded
			const mermaidElements = contentRef.current.querySelectorAll(".mermaid");
			if (mermaidElements.length > 0) {
				// Dispatch a custom event to trigger Mermaid re-initialization
				const event = new CustomEvent("mermaidContentLoaded");
				document.dispatchEvent(event);
			}
		}
	}, [html]);

	return (
		<div
			ref={contentRef}
			className="blog-content prose prose-invert max-w-none"
		/>
	);
}
