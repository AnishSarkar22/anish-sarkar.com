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
        color: #f9fafb;
        font-weight: 800;
        transition: all 0.2s ease;
      }

      .blog-content a:hover {
        color: #ffffff;
        text-decoration-color: rgba(255, 255, 255, 0.8);
      }

      /* Code blocks */
      .blog-content pre {
        margin: 0 !important;
        border-radius: 0 0 12px 12px;
        overflow-x: auto;
        overflow-y: hidden;
        white-space: pre;
        -webkit-overflow-scrolling: touch;
        background: #121212 !important;
        border: none !important;
      }
      .blog-content pre code {
        display: block;
        padding: 1.25rem 1.5rem;
        font-family: "JetBrains Mono", monospace;
        font-size: 0.95rem;
        line-height: 1.7;
        color: #e5e7eb;
        white-space: pre;
      }
      /* Override global scrollbar hide for code blocks */
      .blog-content pre::-webkit-scrollbar {
        display: block;
        height: 8px;
      }
      .blog-content pre::-webkit-scrollbar-thumb {
        background: rgba(255,255,255,0.08);
        border-radius: 4px;
      }
      /* Firefox */
      .blog-content pre {
        scrollbar-width: thin;
        scrollbar-color: rgba(255,255,255,0.08) transparent;
      }
      /* Code block wrapper for header and code */
      .code-block-container {
        border-radius: 12px;
        background: #000000;
        border: 1px solid rgba(63, 63, 70, 0.4);
        box-shadow: 0 4px 24px -1px rgba(0, 0, 0, 0.2);
        overflow: hidden;
      }
      .code-block-header {
        background: #000000;
        border-bottom: 1px solid rgba(63, 63, 70, 0.4);
      }
      .code-block-title {
        opacity: 0.8;
        letter-spacing: 0.05em;
        text-transform: lowercase;
      }
      .code-block-container .copy-btn {
        touch-action: manipulation;
        opacity: 0.7;
        transition: all 0.2s ease;
      }
      .code-block-container .copy-btn:hover {
        opacity: 0.9;
        transform: scale(1.02);
      }
      /* Ensure pre still scrolls horizontally */
      .code-block-container pre {
        overflow-x: auto;
      }

      /* Inline code */
      .blog-content code:not(pre code) {
        font-family: "JetBrains Mono", monospace;
        background: rgba(255, 255, 255, 0.1);
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

      /* Images and Captions */
      .blog-content img {
        border-radius: 12px;
        max-width: 100%;
        height: auto;
        display: block;
        margin: 0;
        box-shadow: 0 4px 24px -1px rgba(0, 0, 0, 0.2);
      }

      .image-container {
        margin: 3rem 0;
        width: 100%;
      }

      .image-caption {
        color: #71717a; /* Zinc 500 */
        font-size: 0.85rem;
        margin-top: 1rem;
        font-family: "JetBrains Mono", monospace;
        letter-spacing: -0.01em;
        text-align: center;
        opacity: 0.8;
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
        padding: 2rem 2.25rem;
        background: rgba(24, 24, 27, 0.4);
        border: 1px solid rgba(63, 63, 70, 0.4);
        border-radius: 12px;
        position: relative;
        overflow: hidden;
        backdrop-filter: blur(8px);
        box-shadow: 0 4px 24px -1px rgba(0, 0, 0, 0.2);
      }
      
      .blog-content blockquote::before {
        content: "";
        position: absolute;
        top: -4.5rem;
        right: -1.25rem;
        width: 140px;
        height: 140px;
        background-color: rgba(255, 255, 255, 0.05);
        -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='currentColor' d='M20.309 17.708C22.196 15.66 22.006 13.03 22 13V5a1 1 0 0 0-1-1h-6c-1.103 0-2 .897-2 2v7a1 1 0 0 0 1 1h3.078a2.9 2.9 0 0 1-.429 1.396c-.508.801-1.465 1.348-2.846 1.624l-.803.16V20h1c2.783 0 4.906-.771 6.309-2.292m-11.007 0C11.19 15.66 10.999 13.03 10.993 13V5a1 1 0 0 0-1-1h-6c-1.103 0-2 .897-2 2v7a1 1 0 0 0 1 1h3.078a2.9 2.9 0 0 1-.429 1.396c-.508.801-1.465 1.348-2.846 1.624l-.803.16V20h1c2.783 0 4.906-.771 6.309-2.292'/%3E%3C/svg%3E");
        mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='currentColor' d='M20.309 17.708C22.196 15.66 22.006 13.03 22 13V5a1 1 0 0 0-1-1h-6c-1.103 0-2 .897-2 2v7a1 1 0 0 0 1 1h3.078a2.9 2.9 0 0 1-.429 1.396c-.508.801-1.465 1.348-2.846 1.624l-.803.16V20h1c2.783 0 4.906-.771 6.309-2.292m-11.007 0C11.19 15.66 10.999 13.03 10.993 13V5a1 1 0 0 0-1-1h-6c-1.103 0-2 .897-2 2v7a1 1 0 0 0 1 1h3.078a2.9 2.9 0 0 1-.429 1.396c-.508.801-1.465 1.348-2.846 1.624l-.803.16V20h1c2.783 0 4.906-.771 6.309-2.292'/%3E%3C/svg%3E");
        -webkit-mask-size: contain;
        mask-size: contain;
        -webkit-mask-repeat: no-repeat;
        mask-repeat: no-repeat;
        transform: rotate(-12deg);
        pointer-events: none;
        z-index: 0;
      }

      .blog-content blockquote p {
        position: relative;
        z-index: 1;
        font-style: normal !important;
        color: #d1d5db !important;
        line-height: 1.8;
        margin: 0;
      }

      .blog-content blockquote p::before,
      .blog-content blockquote p::after {
        content: none !important;
      }

      .blog-content blockquote strong {
        color: #ffffff;
        font-weight: 700;
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
