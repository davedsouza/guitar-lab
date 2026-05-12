"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useRef, useEffect } from "react"

interface NavModule {
  href: string
  label: string
}

interface NavCategory {
  label: string
  color: string
  modules: NavModule[]
}

const NAV_CATEGORIES: NavCategory[] = [
  {
    label: "Foundations",
    color: "text-sky-400",
    modules: [
      { href: "/beginner",               label: "Beginner Module" },
      { href: "/music-theory",           label: "Music Theory" },
      { href: "/standard-notation",      label: "Standard Notation" },
      { href: "/nashville-number-system",label: "Nashville Numbers" },
      { href: "/ear-training",           label: "Ear Training" },
      { href: "/practice-routine",       label: "Practice Routine" },
      { href: "/capo-guide",             label: "Capo Guide" },
      { href: "/guitar-setup",           label: "Guitar Setup" },
      { href: "/songwriting",            label: "Songwriting" },
      { href: "/how-to-use",             label: "How to Use" },
    ],
  },
  {
    label: "Chords & Harmony",
    color: "text-violet-400",
    modules: [
      { href: "/chord-builder",      label: "Chord Building" },
      { href: "/progressions",       label: "Chord Progressions" },
      { href: "/diatonic-chords",    label: "Diatonic Chords" },
      { href: "/caged-system",       label: "CAGED System" },
      { href: "/chord-inversions",   label: "Inversions & Voice Leading" },
      { href: "/chord-substitutions",label: "Chord Substitutions" },
      { href: "/backing-chords",     label: "Backing Chords" },
    ],
  },
  {
    label: "Scales & Lead",
    color: "text-emerald-400",
    modules: [
      { href: "/scales",        label: "Guitar Scales" },
      { href: "/pentatonic",    label: "Pentatonic Mastery" },
      { href: "/modes",         label: "Modes" },
      { href: "/arpeggios",     label: "Arpeggios" },
      { href: "/improvisation", label: "Improvisation" },
    ],
  },
  {
    label: "Technique",
    color: "text-orange-400",
    modules: [
      { href: "/barre-chords",        label: "Barre Chords" },
      { href: "/techniques",          label: "Guitar Techniques" },
      { href: "/fingerstyle-patterns",label: "Fingerstyle Patterns" },
      { href: "/rhythm-trainer",      label: "Rhythm Trainer" },
      { href: "/riffs",               label: "Classic Riffs" },
    ],
  },
  {
    label: "Styles",
    color: "text-pink-400",
    modules: [
      { href: "/blues",        label: "12-Bar Blues" },
      { href: "/funk-guitar",  label: "Funk Guitar" },
      { href: "/jazz-guitar",  label: "Jazz Guitar" },
      { href: "/slide-guitar", label: "Slide Guitar" },
      { href: "/open-tunings", label: "Open Tunings" },
      { href: "/bass-guitar",  label: "Bass Guitar" },
    ],
  },
  {
    label: "Songs",
    color: "text-amber-400",
    modules: [
      { href: "/song-library", label: "Song Library" },
    ],
  },
]

export default function NavBar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  // Close on route change
  useEffect(() => {
    setMenuOpen(false)
    setMobileOpen(false)
  }, [pathname])

  const isHome = pathname === "/"

  return (
    <nav className="sticky top-0 z-50 border-b border-white/8 bg-slate-900/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-6">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0 group"
        >
          <span className="text-lg font-bold text-white tracking-tight group-hover:text-purple-300 transition-colors">
            Guitar Lab
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1 flex-1">
          {/* Browse dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setMenuOpen(v => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                menuOpen
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:text-white hover:bg-white/8"
              }`}
            >
              Browse
              <svg
                className={`w-3.5 h-3.5 transition-transform ${menuOpen ? "rotate-180" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Mega dropdown */}
            {menuOpen && (
              <div className="absolute top-full left-0 mt-2 w-[640px] bg-slate-900 border border-white/10 rounded-2xl shadow-2xl shadow-black/50 p-5 grid grid-cols-3 gap-5">
                {NAV_CATEGORIES.map(cat => (
                  <div key={cat.label}>
                    <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${cat.color}`}>
                      {cat.label}
                    </p>
                    <ul className="space-y-0.5">
                      {cat.modules.map(m => (
                        <li key={m.href}>
                          <Link
                            href={m.href}
                            className={`block px-2 py-1 rounded-lg text-sm transition-colors ${
                              pathname === m.href
                                ? "text-white bg-white/10"
                                : "text-slate-400 hover:text-white hover:bg-white/8"
                            }`}
                          >
                            {m.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick links */}
          {[
            { href: "/song-library", label: "Songs" },
            { href: "/practice-routine", label: "Practice" },
          ].map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                pathname === link.href
                  ? "text-white bg-white/10"
                  : "text-slate-400 hover:text-white hover:bg-white/8"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Home pill (shown when inside a module) */}
        {!isHome && (
          <Link
            href="/"
            className="hidden md:flex ml-auto items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </Link>
        )}

        {/* Mobile hamburger */}
        <button
          className="md:hidden ml-auto p-2 text-slate-400 hover:text-white transition-colors"
          onClick={() => setMobileOpen(v => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/8 bg-slate-900/95 backdrop-blur-xl max-h-[80vh] overflow-y-auto">
          <div className="px-4 py-4 space-y-6">
            <Link
              href="/"
              className="block text-sm font-semibold text-white mb-4"
            >
              ← Home
            </Link>
            {NAV_CATEGORIES.map(cat => (
              <div key={cat.label}>
                <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${cat.color}`}>
                  {cat.label}
                </p>
                <ul className="space-y-0.5">
                  {cat.modules.map(m => (
                    <li key={m.href}>
                      <Link
                        href={m.href}
                        className={`block px-2 py-1.5 rounded-lg text-sm transition-colors ${
                          pathname === m.href
                            ? "text-white bg-white/10"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        {m.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
