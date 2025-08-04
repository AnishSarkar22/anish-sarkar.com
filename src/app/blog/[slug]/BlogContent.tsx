'use client';

import { useEffect, useRef } from 'react';

interface BlogContentProps {
  html: string;
}

export default function BlogContent({ html }: BlogContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      // Add click handlers for anchor links
      const links = contentRef.current.querySelectorAll('a[href^="#"]');
      links.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const href = link.getAttribute('href');
          if (href) {
            const target = document.querySelector(href);
            if (target) {
              target.scrollIntoView({ behavior: 'smooth' });
            }
          }
        });
      });

      // Add copy button to code blocks
      const codeBlocks = contentRef.current.querySelectorAll('pre');
      codeBlocks.forEach(block => {
        const button = document.createElement('button');
        button.innerHTML = '📋 Copy';
        button.className = 'absolute top-2 right-2 px-2 py-1 text-xs bg-zinc-700 text-white rounded hover:bg-zinc-600 transition-colors';
        button.onclick = () => {
          const code = block.querySelector('code');
          if (code) {
            navigator.clipboard.writeText(code.textContent || '');
            button.innerHTML = '✅ Copied!';
            setTimeout(() => {
              button.innerHTML = '📋 Copy';
            }, 2000);
          }
        };
        
        block.style.position = 'relative';
        block.appendChild(button);
      });

      // Trigger Mermaid re-initialization after content is loaded
      const mermaidElements = contentRef.current.querySelectorAll('.mermaid');
      if (mermaidElements.length > 0) {
        // Dispatch a custom event to trigger Mermaid re-initialization
        const event = new CustomEvent('mermaidContentLoaded');
        document.dispatchEvent(event);
      }
    }
  }, [html]);

  return (
    <div 
      ref={contentRef}
      className="blog-content prose prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}