import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Script from 'next/script'
import { extractMetaPixelId, getPublicSiteSettings } from '@/lib/site-settings'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSiteSettings()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://techpinik.com'
  const keywords = settings.site_keywords
    .split(',')
    .map((keyword) => keyword.trim())
    .filter(Boolean)

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: settings.meta_title || settings.site_name,
      template: `%s | ${settings.site_name}`,
    },
    description: settings.meta_description || settings.site_description,
    keywords,
    alternates: {
      canonical: '/',
    },
    openGraph: {
      type: 'website',
      locale: 'en_BD',
      siteName: settings.site_name,
      title: settings.meta_title || settings.site_name,
      description: settings.meta_description || settings.site_description,
      url: siteUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: settings.meta_title || settings.site_name,
      description: settings.meta_description || settings.site_description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    icons: {
      icon: '/icon.svg',
      apple: '/apple-icon.svg',
      shortcut: '/icon.svg',
    },
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const settings = await getPublicSiteSettings()
  const metaPixelId = extractMetaPixelId(settings.facebook_pixel_id)

  return (
    <html lang="en" className="overflow-x-hidden">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}>
        {children}
        {metaPixelId && (
          <>
            <Script
              id="meta-pixel-base"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  !function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '${metaPixelId}');
                  fbq('track', 'PageView');
                `,
              }}
            />
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: 'none' }}
                src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          </>
        )}
        {/* Facebook Messenger Customer Chat SDK */}
        <Script
          id="facebook-messenger-sdk"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              window.fbAsyncInit = function() {
                FB.init({
                  xfbml: true,
                  version: 'v21.0'
                });
              };
              (function(d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return;
                js = d.createElement(s); js.id = id;
                js.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js';
                fjs.parentNode.insertBefore(js, fjs);
              }(document, 'script', 'facebook-jssdk'));
            `,
          }}
        />
      </body>
    </html>
  )
}
