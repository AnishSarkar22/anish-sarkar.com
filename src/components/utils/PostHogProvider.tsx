"use client";

import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect, useState } from "react";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
	const [isInitialized, setIsInitialized] = useState(false);

	useEffect(() => {
		// Only initialize on client side
		if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
			// Check if PostHog is already initialized
			if (!posthog.__loaded) {
				try {
					posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
						api_host:
							process.env.NEXT_PUBLIC_POSTHOG_HOST ||
							"https://eu.i.posthog.com",
						person_profiles: "identified_only",
						capture_pageview: false, // Handle this manually
						capture_pageleave: true,
						loaded: (posthog) => {
							setIsInitialized(true);
							if (process.env.NODE_ENV === "development") {
								posthog.debug();
								console.log("PostHog initialized successfully");
							}
						},
						// SSR-friendly options
						persistence: "localStorage+cookie",
						cross_subdomain_cookie: false,
						secure_cookie: process.env.NODE_ENV === "production",
					});
				} catch (error) {
					console.warn("PostHog initialization failed:", error);
				}
			} else {
				setIsInitialized(true);
			}
		}
	}, []);

	// Don't render the provider until PostHog is initialized
	if (!isInitialized) {
		return <>{children}</>;
	}

	return (
		<PHProvider client={posthog}>
			<PostHogPageView />
			{children}
		</PHProvider>
	);
}

// Separate component to handle page view tracking
function PostHogPageView(): null {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	useEffect(() => {
		if (typeof window !== "undefined" && posthog.__loaded) {
			let url = window.origin + pathname;
			if (searchParams?.toString()) {
				url = `${url}?${searchParams.toString()}`;
			}

			posthog.capture("$pageview", {
				$current_url: url,
				$pathname: pathname,
				$search_params: searchParams?.toString() || "",
			});
		}
	}, [pathname, searchParams]);

	return null;
}
