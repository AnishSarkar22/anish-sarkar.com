import posthog from 'posthog-js'

export const usePostHog = () => {
  const trackEvent = (eventName: string, properties?: Record<string, any>) => {
    if (typeof window !== 'undefined') {
      posthog.capture(eventName, properties)
    }
  }

  const identifyUser = (userId: string, properties?: Record<string, any>) => {
    if (typeof window !== 'undefined') {
      posthog.identify(userId, properties)
    }
  }

  const setUserProperties = (properties: Record<string, any>) => {
    if (typeof window !== 'undefined') {
      posthog.setPersonProperties(properties)
    }
  }

  const resetUser = () => {
    if (typeof window !== 'undefined') {
      posthog.reset()
    }
  }

  return {
    trackEvent,
    identifyUser,
    setUserProperties,
    resetUser,
    posthog: typeof window !== 'undefined' ? posthog : null
  }
}

// Direct exports for convenience
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    posthog.capture(eventName, properties)
  }
}

export const identifyUser = (userId: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    posthog.identify(userId, properties)
  }
}

export { posthog }