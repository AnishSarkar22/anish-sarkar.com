// import TransitionLink from "~/components/utils/TransitionLink";
import Link from "next/link";
import TransitionWrapper from "~/components/utils/TransitionWrapper";

export default function BlogNotFound() {
	return (
		<TransitionWrapper>
			<div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-16 text-center">
				<div className="relative">
					{/* Cosmic background effect */}
					<div
						className="-inset-10 absolute animate-pulse rounded-full bg-gradient-radial from-green-300/10 to-transparent opacity-30 blur-3xl"
						style={{ animationDuration: "4s" }}
					/>

					<h1 className="relative mb-6 inline-block font-bold text-5xl text-white">
						404 - Blog Not Found
						<div
							className="-bottom-2 absolute left-0 h-[3px] w-full animate-pulse bg-gradient-to-r from-green-300/0 via-green-300 to-green-300/0"
							style={{ animationDuration: "3s" }}
						/>
					</h1>

					<p className="mx-auto mb-10 max-w-lg text-gray-300 text-xl">
						The blog post you're looking for has drifted into another dimension
						or doesn't exist yet.
					</p>

					<Link
						href="/blog"
						className="group relative inline-flex items-center overflow-hidden rounded-lg border border-green-300/50 bg-transparent px-6 py-3 text-green-300 transition-all duration-300 hover:bg-green-300/10"
					>
						<span className="relative z-10 flex items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="group-hover:-translate-x-1 mr-2 h-5 w-5 transform transition-transform duration-300"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<title>Back arrow icon</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M10 19l-7-7m0 0l7-7m-7 7h18"
								/>
							</svg>
							Back to Blog
						</span>

						{/* Shine effect on hover */}
						<div className="-translate-x-full absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
					</Link>
				</div>
			</div>
		</TransitionWrapper>
	);
}
