import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import NavBar from "@/components/NavBar"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
})

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3005")

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Guitar Lab — Master Guitar Theory & Technique",
  description: "Interactive guitar learning platform covering scales, chords, arpeggios, CAGED system, Nashville numbers, and advanced techniques.",
  openGraph: {
    title: "Guitar Lab — Master Guitar Theory & Technique",
    description: "Interactive guitar learning platform covering scales, chords, arpeggios, CAGED system, Nashville numbers, and advanced techniques.",
    url: siteUrl,
    siteName: "Guitar Lab",
    images: [
      {
        url: "/guitar-og.jpg",
        width: 1200,
        height: 630,
        alt: "Guitar Lab — Master Guitar Theory & Technique",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Guitar Lab — Master Guitar Theory & Technique",
    description: "Interactive guitar learning platform covering scales, chords, arpeggios, CAGED system, Nashville numbers, and advanced techniques.",
    images: ["/guitar-og.jpg"],
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased min-h-screen" suppressHydrationWarning>
        <NavBar />
        <main>{children}</main>
      </body>
    </html>
  )
}
