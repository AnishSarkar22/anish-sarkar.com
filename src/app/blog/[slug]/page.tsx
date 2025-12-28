import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import BlogPostSkeleton from "~/components/BlogPostSkeleton";
import BlogStyles from "~/components/BlogStyles";
import { getAllBlogSlugs, getPostBySlug } from "~/components/utils/blog";
import TransitionWrapper from "~/components/utils/TransitionWrapper";
import { env } from "~/env";
import BlogContent from "./BlogContent";
import BlogPostClient from "./BlogPostClient";

const siteUrl = env.NEXT_PUBLIC_SITE_URL ?? "https://anish-sarkar.com";

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
		keywords: post.metadata.title
			.split(" ")
			.concat([
				"backend development",
				"programming",
				"tech blog",
				"Anish Sarkar",
			]),
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
			"reading-time": post.metadata.readingTime
				? `${post.metadata.readingTime} minutes`
				: undefined,
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
				// biome-ignore lint/security/noDangerouslySetInnerHtml: not necessary
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
							<nav className="font-mono text-gray-400 text-sm">
								<Link
									href="/blog"
									className="text-gray-400 transition-colors duration-200 hover:text-white hover:no-underline"
								>
									cd..
								</Link>
								<span className="mx-3" aria-hidden>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="12"
										height="24"
										viewBox="0 0 12 24"
										className="inline-block h-4 w-3 text-white"
										fill="currentColor"
										role="img"
									>
										<title>Back</title>
										<path
											fillRule="evenodd"
											d="M10.157 12.711L4.5 18.368l-1.414-1.414l4.95-4.95l-4.95-4.95L4.5 5.64l5.657 5.657a1 1 0 0 1 0 1.414"
										/>
									</svg>
								</span>
								<span className="text-gray-400">{post.metadata.title}</span>
							</nav>
						</div>

						<h1 className="relative mt-6 mb-4 inline-block font-bold text-5xl text-white font-pixel">
							{post.metadata.title}
							{/* <div
								className="-bottom-2 absolute left-0 h-[3px] w-full animate-pulse bg-gradient-to-r from-green-300/0 via-green-300 to-green-300/0"
								style={{ animationDuration: "3s" }}
							/> */}
						</h1>

						<div className="mb-12 flex items-center justify-between text-sm">
							<div className="flex items-center space-x-6">
								<div className="flex items-center space-x-2 text-gray-400">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="14"
										height="14"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<g fill="none">
											<path
												fill="currentColor"
												d="M2 9c0-1.886 0-2.828.586-3.414S4.114 5 6 5h12c1.886 0 2.828 0 3.414.586S22 7.114 22 9c0 .471 0 .707-.146.854C21.707 10 21.47 10 21 10H3c-.471 0-.707 0-.854-.146C2 9.707 2 9.47 2 9"
											/>
											<path
												fill="currentColor"
												fillRule="evenodd"
												d="M2.586 21.414C2 20.828 2 19.886 2 18v-5c0-.471 0-.707.146-.854C2.293 12 2.53 12 3 12h18c.471 0 .707 0 .854.146c.146.147.146.383.146.854v5c0 1.886 0 2.828-.586 3.414S19.886 22 18 22H6c-1.886 0-2.828 0-3.414-.586M8 16a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2z"
												clipRule="evenodd"
											/>
											<path
												stroke="currentColor"
												strokeLinecap="round"
												strokeWidth="2"
												d="M7 3v3m10-3v3"
											/>
										</g>
									</svg>
									<span>{formatDate(post.metadata.date)}</span>
								</div>
								{post.metadata.readingTime && (
									<div className="flex items-center space-x-2 text-gray-400">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="14"
											height="14"
											viewBox="0 0 24 24"
											aria-hidden="true"
										>
											<path
												fill="currentColor"
												fillRule="evenodd"
												d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12m10-4a1 1 0 1 0-2 0v5a1 1 0 0 0 1 1h5a1 1 0 1 0 0-2h-4z"
												clipRule="evenodd"
											/>
										</svg>
										<span>{post.metadata.readingTime} min read</span>
									</div>
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
