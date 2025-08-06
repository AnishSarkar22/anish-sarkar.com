import { notFound } from "next/navigation";
import { getPostBySlug, getAllBlogSlugs } from "~/components/utils/blog";
import BackButton from "~/components/BackButton";
import { Suspense } from "react";
import BlogPostSkeleton from "~/components/BlogPostSkeleton";
import BlogPostClient from "./BlogPostClient";
import BlogStyles from "~/components/BlogStyles";
import TransitionWrapper from "~/components/utils/TransitionWrapper";
import BlogContent from "./BlogContent";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

// Generates static parameters for all existing blog posts
export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Server component with metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    return;
  }

  const publishedTime = formatDate(post.metadata.date);
  const encodedTitle = encodeURIComponent(post.metadata.title);
  const encodedDate = encodeURIComponent(publishedTime);

  return {
    title: post.metadata.title,
    description: post.metadata.description,
    keywords: post.metadata.title.split(' ').concat(['backend development', 'programming', 'tech blog', 'Anish Sarkar']),
    openGraph: {
      title: post.metadata.title,
      description: post.metadata.description,
      publishedTime,
      type: "article",
      url: `${siteUrl}/blog/${post.slug}`,
      images: [
        {
          url: `${siteUrl}/og/blog?title=${encodedTitle}`,
        },
      ],
    },
    twitter: {
      title: post.metadata.title,
      description: post.metadata.description,
      card: "summary_large_image",
      creator: "@AnishSarkar22",
      images: [`${siteUrl}/og/blog?title=${encodedTitle}&top=${encodedDate}`],
    },
    alternates: {
      canonical: `${siteUrl}/blog/${post.slug}`,
    },
    other: {
      'reading-time': post.metadata.readingTime ? `${post.metadata.readingTime} minutes` : undefined,
    },
  };
}

// Server component wrapper
export default async function Post({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <TransitionWrapper>
      <BlogStyles />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.metadata.title,
            description: post.metadata.description,
            datePublished: post.metadata.date,
            author: {
              "@type": "Person",
              name: "Anish Sarkar",
              url: siteUrl,
            },
            publisher: {
              "@type": "Person",
              name: "Anish Sarkar",
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${siteUrl}/blog/${post.slug}`,
            },
            ...(post.metadata.readingTime && {
              timeRequired: `PT${post.metadata.readingTime}M`,
            }),
          }),
        }}
      />

      <Suspense fallback={<BlogPostSkeleton />}>
        <BlogPostClient slug={slug}>
          <section className="relative mx-auto mt-5 max-w-4xl p-8 px-6 font-mono text-md">
            <div className="mb-8">
              <BackButton />
            </div>

            <h1 className="relative mt-6 mb-4 inline-block font-bold text-5xl text-white">
              {post.metadata.title}
              <div
                className="-bottom-2 absolute left-0 h-[3px] w-full animate-pulse bg-gradient-to-r from-green-300/0 via-green-300 to-green-300/0"
                style={{ animationDuration: "3s" }}
              />
            </h1>

            <div className="mb-12 flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <span className="text-gray-400">
                  {formatDate(post.metadata.date)}
                </span>
                {post.metadata.readingTime && (
                  <>
                    <span className="text-gray-600">•</span>
                    <span className="text-gray-400">
                      {post.metadata.readingTime} min read
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Replace MDX with BlogContent */}
            <BlogContent html={post.html} />
          </section>
        </BlogPostClient>
      </Suspense>
    </TransitionWrapper>
  );
}

function formatDate(date: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(date).toLocaleDateString("en-US", options);
}