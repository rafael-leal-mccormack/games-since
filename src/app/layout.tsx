import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Noto_Sans } from "next/font/google"

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans",
})

export const metadata: Metadata = {
  title: "Shohei Ohtani HR Tracker",
  description: "Track games since Shohei Ohtani's last home run",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${notoSans.className} antialiased`}>
          {children}
      </body>
    </html>
  )
}
