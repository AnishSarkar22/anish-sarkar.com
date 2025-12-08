# Personal Portfolio

![Next.js](https://img.shields.io/badge/Next.js-16.0.7-000000?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?logo=typescript)
![React](https://img.shields.io/badge/React-19.2.1-61DAFB?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.5-06B6D4?logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-blue.svg)

A modern, feature-rich personal portfolio website built with Next.js, showcasing projects, blog posts, experience, and skills. The site features a dark theme with animated UI elements, smooth transitions, and comprehensive analytics integration.

## ✨ Features

### 🏠 Home Page
- **Interactive Profile Section**: Animated profile image with cosmic effects and hover interactions
- **Git Commit History**: Visual representation of GitHub contributions
- **About Section**: Personal introduction and background
- **Experience Timeline**: Professional work experience with detailed descriptions
- **Skills Showcase**: Technical skills organized by category
- **Hobbies Section**: Personal interests and activities
- **Social Links**: Quick access to social media profiles
- **Interactive Location Map**: MapLibre GL integration showing current location
- **Smooth Animations**: Framer Motion powered transitions and micro-interactions

### 📝 Blog
- **Markdown-based Blog System**: Write posts in Markdown with frontmatter
- **Syntax Highlighting**: Code blocks with syntax highlighting via Rehype Pretty Code
- **Math Support**: LaTeX math rendering with KaTeX
- **Mermaid Diagrams**: Support for Mermaid diagram rendering
- **Pagination**: Browse posts with pagination support
- **Reading Time**: Automatic reading time calculation
- **SEO Optimized**: Dynamic metadata and Open Graph images

### 🚀 Projects
- **Project Showcase**: Display featured and regular projects
- **Technology Tags**: Visual technology stack indicators
- **External Links**: Direct links to live projects and repositories
- **Filtering**: Filter projects by technology or category

### 📸 Photos
- **Photo Gallery**: Personal photography showcase
- **Image Optimization**: Next.js Image component for optimized loading

### 🎨 Design & UX
- **Dark Theme**: Modern dark color scheme with green accent colors
- **Responsive Design**: Fully responsive across all device sizes
- **Smooth Page Transitions**: Seamless navigation between pages
- **Interactive Tooltips**: Contextual information on hover
- **Back to Top Button**: Quick navigation to page top
- **Loading States**: Skeleton loaders and smooth loading transitions

### 📊 Analytics & SEO
- **PostHog Integration**: Comprehensive analytics and user behavior tracking
- **SEO Optimized**: Meta tags, Open Graph, and Twitter Card support
- **Structured Data**: JSON-LD schema markup for better search visibility
- **Sitemap & Robots.txt**: Automatic generation for search engines
- **Dynamic OG Images**: Server-generated Open Graph images

## 🛠️ Tech Stack

### Core Framework
- **Next.js 16.0.7**: React framework with App Router
- **React 19.2.1**: UI library
- **TypeScript 5.9.3**: Type-safe development

### Styling & UI
- **Tailwind CSS 3.3.5**: Utility-first CSS framework
- **Framer Motion 12.6.5**: Animation library
- **Geist Font**: Modern typography from Vercel

### Content & Markdown
- **Gray Matter**: Frontmatter parsing
- **Remark & Rehype**: Markdown processing ecosystem
- **Rehype Pretty Code**: Syntax highlighting
- **Rehype KaTeX**: Math equation rendering
- **Mermaid 11.6.0**: Diagram rendering
- **Remark GFM**: GitHub Flavored Markdown support

### Maps & Visualization
- **MapLibre GL 5.6.1**: Interactive maps
- **RoughJS 4.6.6**: Hand-drawn style graphics

### Analytics
- **PostHog 1.234.9**: Product analytics and feature flags

### Development Tools
- **Biome 2.3.0**: Fast linter and formatter
- **TSX 4.20.3**: TypeScript execution

## 🚀 Getting Started

### Prerequisites

- **Node.js**: >=20.17.0 <25
- **npm**: >=10.0.0 <12
- **pnpm**: Recommended package manager (or npm/yarn)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AnishSarkar22/anish-sarkar.com.git
   cd anish-sarkar.com
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file by copying the example:sh
   ```shell     
   cp .env.example .env.local
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Available Scripts

- `pnpm dev` - Start development server with Turbo mode
- `pnpm build` - Build for production (includes post validation)
- `pnpm start` - Start production server
- `pnpm preview` - Build and start production server locally
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm check` - Run Biome linter
- `pnpm check:write` - Run Biome linter and auto-fix
- `pnpm check:unsafe` - Run Biome with unsafe fixes
- `pnpm validate-posts` - Validate blog post frontmatter and structure
- `pnpm validate-github-data` - Validate GitHub data

## 📝 Writing Blog Posts

Blog posts are written in Markdown and stored in the `posts/` directory. Each post should include frontmatter:

```markdown
---
title: "Your Blog Post Title"
date: "2024-01-01"
description: "A brief description of the post"
tags: ["tag1", "tag2"]
---

Your blog post content here...
```

The blog system supports:
- GitHub Flavored Markdown
- Code syntax highlighting
- LaTeX math equations
- Mermaid diagrams
- Custom components

## 🔧 Configuration

### Next.js Configuration

The `next.config.js` includes:
- Image optimization with remote patterns
- Security headers
- PostHog proxy configuration
- Custom redirects and rewrites

### Environment Variables

All environment variables are validated using `@t3-oss/env-nextjs` and Zod schemas. Required variables:
- `NEXT_PUBLIC_SITE_URL`: Your site's URL

Optional variables:
- `NEXT_PUBLIC_GOOGLE_VERIFICATION`: Google Search Console verification
- `NEXT_PUBLIC_POSTHOG_KEY`: PostHog project API key
- `NEXT_PUBLIC_POSTHOG_HOST`: PostHog instance URL

## 🚢 Deployment

The site is configured for deployment on Vercel:

1. **Push to GitHub**: Ensure your code is pushed to the repository
2. **Connect to Vercel**: Import the project in Vercel dashboard
3. **Set Environment Variables**: Add required env vars in Vercel settings
4. **Deploy**: Vercel will automatically deploy on push to main branch

The `vercel.json` includes framework detection and environment configuration.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
