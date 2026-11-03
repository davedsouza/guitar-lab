"use client"

import Link from "next/link"
import GuitarTonePicker from "@/components/GuitarTonePicker"
import BandPicker from "@/components/jam/BandPicker"
import { Panel } from "@/components/jam/ui"

const TILES = [
  { href: "/jam/chords", title: "Chords", sub: "Diagram, tab, voicings" },
  { href: "/jam/nashville", title: "Nashville", sub: "Numbers cheat sheet" },
  { href: "/jam/progressions", title: "Ideas", sub: "Progressions by genre" },
  { href: "/jam/chart", title: "Chart", sub: "Big lyrics and chords" },
  { href: "/jam/transpose", title: "Transpose", sub: "Keys and capo" },
  { href: "/jam/setlist", title: "Setlist", sub: "Key, tempo, capo" },
  { href: "/jam/key-finder", title: "Key Finder", sub: "What key are we in?" },
  { href: "/jam/builder", title: "Song Builder", sub: "Add chords, see what is next" },
  { href: "/jam/identify", title: "Chord Identifier", sub: "Tap or type notes, get the name" },
  { href: "/jam/scales", title: "Scales", sub: "What to play over a key" },
  { href: "/jam/circle", title: "Circle of 5ths", sub: "Keys and what fits" },
  { href: "/jam/patterns", title: "Patterns", sub: "Strums, endings, blues" },
  { href: "/jam/tools", title: "Tuner & Tempo", sub: "Mic tuner, tap tempo" },
  { href: "/harmonica", title: "Harmonica", sub: "Lessons and key finder" },
]

export default function JamHub() {
  return (
    <div className="space-y-5">
      <Panel title="Who is playing?">
        <BandPicker />
        <p className="mt-3 text-sm text-purple-200">Your picks tailor the tips on the Ideas, Chart, Nashville and Patterns screens.</p>
      </Panel>
      <Panel title="Guitar sound">
        <GuitarTonePicker />
        <p className="mt-3 text-sm text-purple-200">Used wherever you tap Play: chord diagrams, scales and the Chord Identifier.</p>
      </Panel>
      <div className="grid grid-cols-2 gap-3">
        {TILES.map(t => (
          <Link
            key={t.href}
            href={t.href}
            className="flex min-h-28 flex-col justify-between last:odd:col-span-2 rounded-2xl border border-white/15 bg-white/[0.07] p-4 active:scale-[0.97] active:bg-white/15"
          >
            <span className="text-xl font-bold text-white">{t.title}</span>
            <span className="text-sm text-purple-200">{t.sub}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
