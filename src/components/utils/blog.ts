import { cache } from 'react';

export type Metadata = {
  title: string;
  description: string;
  date: string;
  discussionId?: string;
};

export type FrontmatterParseResult = {
  metadata: Metadata;
  content: string;
};

export type MDXFileData = FrontmatterParseResult & {
  slug: string;
};

// Function to fetch cached data from GitHub API
export const fetchBlogPosts = cache(async (): Promise<MDXFileData[]> => {
  try {
    // Fetch list of files from GitHub API
    const response = await fetch(
      'https://api.github.com/repos/AnishSarkar22/blog-data/contents',
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        },
        next: { revalidate: 60 }
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const files = await response.json();
    
    // Filter to only get markdown files
    const mdFiles = files.filter((file: any) => 
      file.name.endsWith('.md') && file.type === 'file'
    );

    // Fetch the contents of each file
    const postsPromises = mdFiles.map(async (file: any) => {
      const contentResponse = await fetch(file.download_url, {
        next: { revalidate: 60 }
      });
      
      if (!contentResponse.ok) {
        throw new Error(`Failed to fetch file content: ${contentResponse.status}`);
      }
      
      const content = await contentResponse.text();
      const { metadata, content: mdContent } = parseFrontmatter(content);
      
      return {
        slug: file.name.replace(/\.md$/, ''),
        metadata,
        content: mdContent
      };
    });

    const posts = await Promise.all(postsPromises);
    
    // Sort posts by date descending
    return posts.sort((a, b) => {
      if (new Date(a.metadata.date) < new Date(b.metadata.date)) {
        return 1;
      } else {
        return -1;
      }
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
});

// Function to get all blog slugs
export const getAllBlogSlugs = cache(async (): Promise<string[]> => {
  const posts = await fetchBlogPosts();
  return posts.map(post => post.slug);
});

// Function to get posts by slug
export const getPostBySlug = cache(async (slug: string): Promise<MDXFileData | null> => {
  console.log("Fetching post for slug:", slug);
  
  const posts = await fetchBlogPosts();
  console.log(
    "Available posts:",
    posts.map((p) => p.slug)
  );
  
  const foundPost = posts.find((post) => post.slug === slug) ?? null;
  console.log("Found post:", foundPost);
  
  return foundPost;
});

// Function to parse frontmatter from markdown content
function parseFrontmatter(fileContent: string): FrontmatterParseResult {
  const frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
  const match = frontmatterRegex.exec(fileContent);

  if (!match) {
    throw new Error("No frontmatter found");
  }

  const frontmatter = match[1];

  if (!frontmatter) {
    throw new Error("No frontmatter found");
  }

  const content = fileContent.replace(frontmatterRegex, "").trim();
  const frontmatterLines = frontmatter.trim().split("\n");
  const metadata: Partial<Metadata> = {};

  frontmatterLines.forEach((line) => {
    const [key, ...values] = line.split(": ");
    let value = values.join(": ").trim();
    value = value.replace(/^['"](.*)['"]$/, "$1");
    if (key && value) {
      metadata[key.trim() as keyof Metadata] = value;
    }
  });

  return { metadata: metadata as Metadata, content };
}