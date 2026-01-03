'use client'

import { useEffect } from 'react'

interface FacebookMessengerButtonProps {
  pageId?: string
  appId?: string
  themeColor?: string
  loggedInGreeting?: string
  loggedOutGreeting?: string
}

declare global {
  interface Window {
    FB?: {
      init: (config: { xfbml: boolean; version: string }) => void
      XFBML: {
        parse: () => void
      }
    }
    fbAsyncInit?: () => void
  }
}

export default function FacebookMessengerButton({
  pageId = 'YOUR_PAGE_ID', // Replace with your Facebook Page ID
  appId = 'YOUR_APP_ID', // Replace with your Facebook App ID (optional but recommended)
  themeColor = '#0084ff',
  loggedInGreeting = 'Hi! How can we help you?',
  loggedOutGreeting = 'Hi! How can we help you?',
}: FacebookMessengerButtonProps) {
  useEffect(() => {
    // Initialize Facebook SDK if not already loaded
    if (typeof window !== 'undefined' && window.FB) {
      window.FB.XFBML.parse()
    }
  }, [])

  return (
    <div
      className="fb-customerchat"
      data-page_id={pageId}
      data-app_id={appId}
      data-theme_color={themeColor}
      data-logged_in_greeting={loggedInGreeting}
      data-logged_out_greeting={loggedOutGreeting}
      data-minimized="true"
    />
  )
}

