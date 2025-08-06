import posthog from "posthog-js";

// Custom hook for PostHog
export const usePostHog = () => {
  const trackEvent = (eventName: string, properties?: Record<string, unknown>) => {
    if (typeof window !== "undefined" && posthog.__loaded) {
      posthog.capture(eventName, {
        ...properties,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        page_url: window.location.href,
      });
    }
  };

  const identifyUser = (userId: string, properties?: Record<string, unknown>) => {
    if (typeof window !== "undefined" && posthog.__loaded) {
      posthog.identify(userId, properties);
    }
  };

  const setUserProperties = (properties: Record<string, unknown>) => {
    if (typeof window !== "undefined" && posthog.__loaded) {
      posthog.setPersonProperties(properties);
    }
  };

  const resetUser = () => {
    if (typeof window !== "undefined" && posthog.__loaded) {
      posthog.reset();
    }
  };

  const trackPageView = (
    pathname: string,
    properties?: Record<string, unknown>
  ) => {
    if (typeof window !== "undefined" && posthog.__loaded) {
      posthog.capture("$pageview", {
        $current_url: window.location.href,
        $pathname: pathname,
        ...properties,
      });
    }
  };

  return {
    trackEvent,
    identifyUser,
    setUserProperties,
    resetUser,
    trackPageView,
    posthog: typeof window !== "undefined" ? posthog : null,
  };
};

// Direct exports for convenience
export const trackEvent = (
  eventName: string,
  properties?: Record<string, unknown>
) => {
  if (typeof window !== "undefined" && posthog.__loaded) {
    posthog.capture(eventName, {
      ...properties,
      timestamp: new Date().toISOString(),
      page_url: window.location.href,
    });
  }
};

export const identifyUser = (
  userId: string,
  properties?: Record<string, unknown>
) => {
  if (typeof window !== "undefined" && posthog.__loaded) {
    posthog.identify(userId, properties);
  }
};

export const setUserProperties = (properties: Record<string, unknown>) => {
  if (typeof window !== "undefined" && posthog.__loaded) {
    posthog.setPersonProperties(properties);
  }
};

export const resetUser = () => {
  if (typeof window !== "undefined" && posthog.__loaded) {
    posthog.reset();
  }
};

// Blog-specific tracking
export const trackBlogRead = (
  slug: string,
  title: string,
  readingTime?: number
) => {
  trackEvent("blog_read", {
    blog_slug: slug,
    blog_title: title,
    reading_time: readingTime,
    content_type: "blog_post",
  });
};

export const trackBlogSearch = (searchTerm: string, resultsCount: number) => {
  trackEvent("blog_search", {
    search_term: searchTerm,
    results_count: resultsCount,
    search_type: "blog",
  });
};

export const trackProjectView = (projectTitle: string, projectUrl: string) => {
  trackEvent("project_view", {
    project_title: projectTitle,
    project_url: projectUrl,
    content_type: "project",
  });
};

export const trackSocialClick = (platform: string, url: string) => {
  trackEvent("social_click", {
    social_platform: platform,
    social_url: url,
    click_type: "social_media",
  });
};

export { posthog };
