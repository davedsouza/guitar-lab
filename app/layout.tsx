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

export const metadata: Metadata = {
  title: "Guitar Lab — Master Guitar Theory & Technique",
  description: "Interactive guitar learning platform covering scales, chords, arpeggios, CAGED system, Nashville numbers, and advanced techniques.",
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
