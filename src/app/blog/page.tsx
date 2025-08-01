import BlogClient from "./BlogClient";
import { fetchBlogPosts } from "~/components/utils/blog";
import { metadata as blogPageMetadata } from './metadata';
import { Metadata } from "next";
import TransitionWrapper from "~/components/utils/TransitionWrapper";

export const metadata: Metadata = blogPageMetadata;

// Set revalidate for ISR to work
export const revalidate = 60;

export default async function BlogPage({ 
  searchParams 
}: { 
  searchParams: { page?: string } 
}) {
  const params = await searchParams;
  // Get page parameter from URL, default is page 1
  const currentPage = params?.page ? parseInt(params.page) : 1;
  const postsPerPage = 5; // Number of posts per page
  
  // Fetch blog data from GitHub API
  const allBlogPosts = await fetchBlogPosts();
  
  // Calculate total number of pages
  const totalPages = Math.ceil(allBlogPosts.length / postsPerPage);
  
  // Transform data to fit BlogClient
  const blogs = allBlogPosts.map(post => ({
    slug: post.slug,
    title: post.metadata.title,
    date: post.metadata.date,
  }));

  // Wrap Blog Client in Transition Wrapper
  return (
    <TransitionWrapper>
      <BlogClient 
        blogs={blogs} 
        currentPage={currentPage}
        totalPages={totalPages}
        postsPerPage={postsPerPage}
      />
    </TransitionWrapper>
  );
}