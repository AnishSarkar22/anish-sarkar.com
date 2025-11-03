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
      .blog-content h2,
      .blog-content h3 {
        color: #ffffff !important;
        -webkit-text-fill-color: #ffffff !important;
        background-clip: border-box !important;
        -webkit-background-clip: border-box !important;
      }

      .blog-content h2 {
        font-size: 2.5rem;
        margin-top: 3.5rem;
        margin-bottom: 1.75rem;
        font-weight: 800;
        letter-spacing: -0.02em;
      }

      .blog-content h3 {
        font-size: 1.85rem;
        margin-top: 2.5rem;
        margin-bottom: 1.25rem;
        font-weight: 700;
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

      /* Code blocks */
      .blog-content pre {
        margin: 2.5rem 0;
        border-radius: 12px;
        overflow: hidden;
        background: rgba(0, 0, 0, 0.8);
        border: 1px solid rgba(255, 255, 255, 0.08);
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
        background: rgba(255, 255, 255, 0.1);
        color: #86efac;
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
        font-size: 0.9em;
      }

      /* Tables */
      .blog-content table {
        margin: 2.5rem 0;
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(0, 0, 0, 0.3);
        overflow: hidden;
      }

      .blog-content th {
        color: #f9fafb;
        font-weight: 600;
        text-align: left;
        padding: 1.2rem 1.5rem;
        background: rgba(255, 255, 255, 0.1);
      }

      .blog-content td {
        padding: 1.2rem 1.5rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
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
      }

      /* Horizontal rule */
      .blog-content hr {
        margin: 3rem auto;
        width: 40%;
        max-width: 360px;
        height: 0;
        border: none;
        border-top: 1px dashed rgba(255, 255, 255, 0.4);
        opacity: 0.90;
      }
      @media (max-width: 768px) {
        .blog-content hr {
          width: 50%;
          max-width: 260px;
        }
      }
      @media (max-width: 420px) {
        .blog-content hr {
          width: 36%;
          max-width: 160px;
        }
      }

      /* Mermaid diagrams */
      .blog-content .mermaid {
        margin: 2.5rem 0;
        padding: 2rem;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.08);
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
      /* List styling - simplified hover */
      .blog-content ul, .blog-content ol {
        margin-bottom: 1.75rem;
        padding-left: 1.75rem;
        position: relative;
      }
      .blog-content li {
        margin-bottom: 0.6rem;
        position: relative;
        transition: all 0.3s ease;
        padding-left: 0.5rem;
      }
      .blog-content li:hover {
        color: #f9fafb;
        transform: translateX(5px);
      }
      
      /* Bullet points - simplified hover */
      .blog-content ul {
        list-style-type: none;
        padding-left: 1.75rem;
      }
      .blog-content ul li {
        position: relative;
      }
      .blog-content ul li::before {
        content: '';
        position: absolute;
        left: -1.4rem;
        top: 0.5rem;
        width: 0.6rem;
        height: 0.6rem;
        background: linear-gradient(135deg, #86efac, #4ade80);
        border-radius: 2px;
        transform: rotate(45deg);
        transition: all 0.3s ease;
      }
      .blog-content ul li:hover::before {
        transform: rotate(135deg) scale(1.2);
        background: linear-gradient(135deg, #4ade80, #86efac);
        box-shadow: 0 0 8px rgba(134, 239, 172, 0.5);
      }
      
      /* Numbered lists - simplified hover */
      .blog-content ol {
        counter-reset: custom-counter;
        list-style-type: none;
      }
      .blog-content ol li {
        counter-increment: custom-counter;
        position: relative;
      }
      .blog-content ol li::before {
        content: counter(custom-counter);
        position: absolute;
        left: -2.2rem;
        top: -0.1rem;
        color: rgba(52, 211, 153, 0.9);
        font-weight: 600;
        font-family: monospace;
        background: rgba(52, 211, 153, 0.1);
        border: 1px solid rgba(52, 211, 153, 0.4);
        border-radius: 6px;
        width: 1.7rem;
        height: 1.7rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.9rem;
        transition: all 0.3s ease;
      }
      .blog-content ol li:hover::before {
        background: rgba(52, 211, 153, 0.2);
        color: #86efac;
        border-color: rgba(134, 239, 172, 0.6);
        transform: scale(1.1) rotate(-3deg);
        box-shadow: 0 0 10px rgba(134, 239, 172, 0.3);
      }

      // TODO: Checklist style

      /* Blockquotes */
      .blog-content blockquote {
        margin: 2.5rem 0;
        padding: 1.5rem 1.75rem;
        border-left: 4px solid rgba(255, 255, 255, 0.15);
        background: rgba(255, 255, 255, 0.07);
        border-radius: 0 8px 8px 0;
      }
      .blog-content blockquote p {
        font-style: italic;
        color: #d1d5db;
      }
      /* Blockquotes - simplified hover */
      /* .blog-content blockquote {
        margin: 2.5rem 0;
        padding: 1.5rem 1.75rem;
        border-left: 4px solid rgba(255, 255, 255, 0.5);
        background: rgba(255, 255, 255, 0.05);
        border-radius: 0 8px 8px 0;
        position: relative;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
      }
      .blog-content blockquote:hover {
        background: rgba(255, 255, 255, 0.08);
        border-left-width: 5px;
        transform: translateX(5px);
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.2), 0 0 10px rgba(255, 255, 255, 0.1);;
      } */
    `}</style>
	);
}
