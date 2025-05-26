import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Noto_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans",
})

export const metadata: Metadata = {
  metadataBase: new URL('https://gamessince.com'),
  title: {
    default: "Shohei Ohtani HR Tracker",
    template: "%s | Shohei Ohtani HR Tracker"
  },
  description: "Track games since Shohei Ohtani's last home run. Get real-time updates and notifications for Ohtani's home run statistics with the Los Angeles Dodgers.",
  keywords: ["Shohei Ohtani", "home runs", "MLB", "baseball", "Dodgers", "statistics", "tracker", "live updates"],
  authors: [{ name: "Lit Solutions LLC" }],
  creator: "Lit Solutions LLC",
  publisher: "Lit Solutions LLC",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: 'https://gamessince.com'
  },
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    siteName: 'Ohtani HR Tracker',
    title: 'Shohei Ohtani HR Tracker',
    description: "Track games since Shohei Ohtani's last home run. Get real-time updates and notifications for Ohtani's home run statistics with the Los Angeles Dodgers.",
    url: 'https://gamessince.com',
    images: [{
      url: '/homerun-logo.png',
      width: 1200,
      height: 630,
      alt: 'Shohei Ohtani HR Tracker'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shohei Ohtani HR Tracker',
    description: "Track games since Shohei Ohtani's last home run. Get real-time updates and notifications for Ohtani's home run statistics with the Los Angeles Dodgers.",
    images: ['/homerun-logo.png'],
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1e293b" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      </head>
      <body className={`${notoSans.className} antialiased`}>
        <img 
          src="/homerun-logo.png" 
          alt="Shohei Ohtani HR Tracker" 
          className="hidden"
          width={1200}
          height={630}
        />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
