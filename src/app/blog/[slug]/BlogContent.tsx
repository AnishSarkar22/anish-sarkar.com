"use client";

import { useEffect, useRef } from "react";

interface BlogContentProps {
	html: string;
}

// copy SVGs as string constants
const COPY_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeWidth={0}>
		<path d="M6 11c0-2.828 0-4.243.879-5.121C7.757 5 9.172 5 12 5h3c2.828 0 4.243 0 5.121.879C21 6.757 21 8.172 21 11v5c0 2.828 0 4.243-.879 5.121C19.243 22 17.828 22 15 22h-3c-2.828 0-4.243 0-5.121-.879C6 20.243 6 18.828 6 16z"></path>
		<path d="M6 19a3 3 0 0 1-3-3v-6c0-3.771 0-5.657 1.172-6.828S7.229 2 11 2h4a3 3 0 0 1 3 3" opacity={0.5}></path>
	</g></svg>`;
const CHECK_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" fill="none"/></svg>`;

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

			// Add copy button to code blocks
			const codeBlocks = contentRef.current.querySelectorAll("pre");
            for (const block of codeBlocks) {
                // wrap <pre> in a div.code-block-container so CSS selectors apply
                const wrapper = document.createElement("div");
                wrapper.className = "code-block-container relative";
                block.parentNode?.insertBefore(wrapper, block);
                wrapper.appendChild(block);

                const button = document.createElement("button");
                button.type = "button";
                button.innerHTML = COPY_ICON;
                button.className =
                    "copy-btn absolute top-2 right-2 px-2 py-1 bg-zinc-700 text-white rounded hover:bg-zinc-600 transition-colors";
                button.setAttribute("aria-label", "Copy code");

                // robust copy function with clipboard fallback
                const doCopy = async () => {
                    const code = block.querySelector("code");
                    if (!code) return;
                    const text = code.textContent || "";
                    try {
                        await navigator.clipboard.writeText(text);
                        button.innerHTML = CHECK_ICON;
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
                        } catch {
                            // ignore
                        }
                        document.body.removeChild(ta);
                    }
                    setTimeout(() => {
                        button.innerHTML = COPY_ICON;
                    }, 2000);
                };

                // support both click and touchend to improve mobile reliability
                button.addEventListener("click", doCopy);
                button.addEventListener("touchend", (e) => {
                    e.preventDefault();
                    doCopy();
                });

                // ensure wrapper doesn't clip the button
                wrapper.style.position = "relative";
                wrapper.appendChild(button);
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
