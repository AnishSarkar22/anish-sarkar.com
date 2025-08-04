"use client";

export default function BlogStyles() {
  return (
    <style jsx global>{`
      /* Basic markdown content styling */
      .blog-content {
        position: relative;
        z-index: 1;
      }

      /* Headings */
      .blog-content h2 {
        font-size: 2.5rem;
        margin-top: 3.5rem;
        margin-bottom: 1.75rem;
        font-weight: 800;
        color: #f9fafb;
        letter-spacing: -0.02em;
      }

      .blog-content h3 {
        font-size: 1.85rem;
        margin-top: 2.5rem;
        margin-bottom: 1.25rem;
        font-weight: 700;
        color: #e5e7eb;
        padding-left: 1.2rem;
        border-left: 3px solid rgba(52, 211, 153, 0.7);
        letter-spacing: -0.01em;
      }

      /* Paragraphs */
      .blog-content p {
        margin-bottom: 1.75rem;
        line-height: 1.9;
        color: #d1d5db;
      }

      /* Links */
      .blog-content a {
        color: #86efac;
        text-decoration: none;
        font-weight: 500;
      }

      .blog-content a:hover {
        color: #4ade80;
      }

      /* Lists */
      .blog-content ul,
      .blog-content ol {
        margin-bottom: 1.75rem;
        padding-left: 1.75rem;
      }

      .blog-content li {
        margin-bottom: 0.6rem;
        color: #d1d5db;
      }

      /* Code blocks */
      .blog-content pre {
        margin: 2.5rem 0;
        border-radius: 12px;
        overflow: hidden;
        background: rgba(0, 0, 0, 0.8);
        border: 1px solid rgba(52, 211, 153, 0.3);
      }

      .blog-content pre code {
        display: block;
        padding: 1.5rem;
        font-family: "JetBrains Mono", monospace;
        font-size: 0.95rem;
        line-height: 1.7;
        color: #e5e7eb;
      }

      /* Inline code */
      .blog-content code:not(pre code) {
        font-family: "JetBrains Mono", monospace;
        background: rgba(134, 239, 172, 0.1);
        color: #86efac;
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
        font-size: 0.9em;
      }

      /* Blockquotes */
      .blog-content blockquote {
        margin: 2.5rem 0;
        padding: 1.5rem 1.75rem;
        border-left: 4px solid rgba(134, 239, 172, 0.5);
        background: rgba(134, 239, 172, 0.05);
        border-radius: 0 8px 8px 0;
      }

      .blog-content blockquote p {
        font-style: italic;
        color: #d1d5db;
      }

      /* Tables */
      .blog-content table {
        margin: 2.5rem 0;
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        border-radius: 12px;
        border: 1px solid rgba(134, 239, 172, 0.2);
        background: rgba(0, 0, 0, 0.3);
        overflow: hidden;
      }

      .blog-content th {
        color: #f9fafb;
        font-weight: 600;
        text-align: left;
        padding: 1.2rem 1.5rem;
        background: rgba(134, 239, 172, 0.1);
      }

      .blog-content td {
        padding: 1.2rem 1.5rem;
        border-bottom: 1px solid rgba(134, 239, 172, 0.1);
        color: #d1d5db;
      }

      .blog-content tbody tr:last-child td {
        border-bottom: none;
      }

      /* Images */
      .blog-content img {
        border-radius: 8px;
        max-width: 100%;
        height: auto;
        margin: 2.5rem 0;
        border: 1px solid rgba(134, 239, 172, 0.1);
      }

      /* Horizontal rule */
      .blog-content hr {
        margin: 3rem 0;
        height: 1px;
        border: none;
        background: linear-gradient(
          90deg,
          rgba(134, 239, 172, 0),
          rgba(134, 239, 172, 0.5),
          rgba(134, 239, 172, 0)
        );
      }

      /* Mermaid diagrams - minimal styling that won't interfere */
      .blog-content .mermaid {
        margin: 2.5rem 0;
        padding: 2rem;
        border-radius: 12px;
        border: 1px solid rgba(52, 211, 153, 0.3);
        text-align: center;
        overflow-x: auto;
      }

      /* Responsive adjustments */
      @media (max-width: 768px) {
        .blog-content pre {
          overflow-x: scroll;
        }
        
        .blog-content table {
          display: block;
          overflow-x: auto;
        }
      }
    `}</style>
  );
}