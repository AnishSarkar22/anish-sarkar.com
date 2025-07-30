"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { usePostHog } from 'posthog-js/react'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Check if PostHog is already initialized
    if (!posthog.isFeatureEnabled) {
      try {
        posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
          api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
          person_profiles: 'identified_only',
          defaults: '2025-05-24',
          loaded: (posthog) => {
            if (process.env.NODE_ENV === 'development') posthog.debug()
            // Test connection
            posthog.capture('my event', { property: 'value' })
          },
          capture_pageview: false
        })
      } catch (error) {
        console.warn('PostHog initialization failed:', error)
      }
    }
  }, [])

  return (
    <PHProvider client={posthog}>
      {children}
    </PHProvider>
  )
}