"use client";

import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { useEffect } from "react";
import { env } from "~/env";

type PostHogWithLoaded = typeof posthog & { __loaded?: boolean };
type IdleCallbackHandle = number;
type RequestIdleCallbackType = (
	cb: (deadline: unknown) => void,
	opts?: { timeout?: number },
) => IdleCallbackHandle;
type CancelIdleCallbackType = (handle: IdleCallbackHandle) => void;

export function PostHogProvider({ children }: { children: React.ReactNode }) {
	// Initialize PostHog lazily (idle with timeout fallback)
	useEffect(() => {
		if (typeof window === "undefined" || !env.NEXT_PUBLIC_POSTHOG_KEY)
			return;

		const initPosthog = () => {
			// avoid re-init
			const ph = posthog as PostHogWithLoaded;
			if (ph.__loaded) return;

			try {
				const posthogKey = env.NEXT_PUBLIC_POSTHOG_KEY;
				if (!posthogKey) {
					console.warn("PostHog key is not defined.");
					return;
				}
				posthog.init(posthogKey, {
					api_host:
						env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com",
					person_profiles: "identified_only",
					capture_pageview: false,
					capture_pageleave: true,
					autocapture: false,
					disable_session_recording: true,
					persistence: "localStorage+cookie",
					cross_subdomain_cookie: false,
					secure_cookie: process.env.NODE_ENV === "production",
				});
				if (process.env.NODE_ENV === "development") {
					// enable debug logging in dev
					try {
						posthog.debug();
					} catch {}
					console.log("PostHog initialized (idle)");
				}
			} catch (err) {
				console.warn("PostHog initialization failed:", err);
			}
		};

		const win = window as Window & {
			requestIdleCallback?: RequestIdleCallbackType;
			cancelIdleCallback?: CancelIdleCallbackType;
		};

		if (win.requestIdleCallback) {
			const id = win.requestIdleCallback(initPosthog, { timeout: 2000 });
			return () => {
				if (win.cancelIdleCallback) win.cancelIdleCallback(id);
			};
		}

		const t = window.setTimeout(initPosthog, 1000);
		return () => clearTimeout(t);
	}, []);

	return (
		<>
			<PostHogPageView />
			{children}
		</>
	);
}

// Separate component to handle page view tracking
function PostHogPageView(): null {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	useEffect(() => {
		// Only capture if initialized
		const ph = posthog as PostHogWithLoaded;
		if (typeof window !== "undefined" && ph.__loaded) {
			let url = window.location.origin + pathname;
			const sp = searchParams?.toString();
			if (sp) url = `${url}?${sp}`;

			try {
				posthog.capture("$pageview", {
					$current_url: url,
					$pathname: pathname,
					$search_params: sp || "",
				});
			} catch (_e) {
				// fail silently
			}
		}
	}, [pathname, searchParams]);

	return null;
}
