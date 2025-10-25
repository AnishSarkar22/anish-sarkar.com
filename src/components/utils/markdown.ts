import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import { visit } from "unist-util-visit";
import type { Node, Parent } from "unist";
import type { Code, Html } from "mdast";

// Custom plugin to handle Mermaid blocks for better SEO
function remarkMermaid() {
	return (tree: Node) => {
		visit(
			tree,
			"code",
			(
				node: Code,
				index: number | null,
				parent: Parent | null,
			) => {
				if (node.lang === "mermaid" && parent && typeof index === "number") {
					const mermaidCode = node.value;
					// create an html node and replace the code node in the parent's children array
					const htmlNode = {
						type: "html",
						value: `<div class="mermaid" role="img" aria-label="Mermaid diagram: ${extractDiagramTitle(
							mermaidCode,
						)}" data-diagram-type="${extractDiagramType(mermaidCode)}">${mermaidCode}</div>`,
					} as unknown as Html;
					parent.children.splice(index, 1, htmlNode as Html);
				}
			},
		);
	};
}

// Helper function to extract diagram type for better accessibility
function extractDiagramType(code: string): string {
	const firstLine = code.trim().split("\n")[0]?.toLowerCase() || "";
	if (firstLine.includes("graph")) return "flowchart";
	if (firstLine.includes("sequenceDiagram")) return "sequence";
	if (firstLine.includes("classDiagram")) return "class";
	if (firstLine.includes("stateDiagram")) return "state";
	if (firstLine.includes("gantt")) return "gantt";
	if (firstLine.includes("pie")) return "pie";
	return "diagram";
}

// Helper function to extract a meaningful title from the diagram
function extractDiagramTitle(code: string): string {
	// Look for title in the diagram code
	const titleMatch = code.match(/title\s+(.+)/i);
	if (titleMatch) return titleMatch[1];

	// Extract diagram type as fallback
	const type = extractDiagramType(code);
	return `${type} diagram`;
}

const processor = remark()
	.use(remarkGfm)
	.use(remarkMermaid) // Add this BEFORE remarkRehype
	.use(remarkMath)
	.use(remarkRehype, { allowDangerousHtml: true })
	.use(rehypeSlug) // Adds IDs to headings
	.use(rehypeAutolinkHeadings, {
		// Adds anchor links to headings
		behavior: "wrap",
		properties: {
			className: ["anchor-link"],
			ariaLabel: "Link to section",
		},
	})
	.use(rehypeKatex)
	.use(rehypePrettyCode, {
		theme: "vesper",
		keepBackground: false,
	})
	.use(rehypeStringify, { allowDangerousHtml: true });

export async function processMarkdown(content: string): Promise<string> {
	const result = await processor.process(content);
	return String(result);
}
