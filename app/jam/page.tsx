"use client"

import Link from "next/link"
import GuitarTonePicker from "@/components/GuitarTonePicker"
import BackupPanel from "@/components/jam/BackupPanel"
import BandPicker from "@/components/jam/BandPicker"
import { Panel } from "@/components/jam/ui"

const GROUPS = [
  {
    title: "Write",
    tiles: [
      { href: "/jam/builder", title: "Song Builder", sub: "Add chords, see what is next" },
      { href: "/jam/progressions", title: "Ideas", sub: "Progressions to play and twist" },
      { href: "/jam/chart", title: "Chart", sub: "Big lyrics and chords" },
    ],
  },
  {
    title: "Learn",
    tiles: [
      { href: "/chord-bible", title: "Chord Bible", sub: "Every chord, 9ths to 13ths" },
      { href: "/jam/chords", title: "Chords", sub: "Diagram, tab, voicings" },
      { href: "/jam/scales", title: "Scales", sub: "What to play over a key" },
      { href: "/jam/circle", title: "Circle of 5ths", sub: "Keys and what fits" },
      { href: "/jam/nashville", title: "Nashville", sub: "Numbers cheat sheet" },
      { href: "/jam/patterns", title: "Patterns", sub: "Strums, endings, blues" },
    ],
  },
  {
    title: "Gig",
    tiles: [
      { href: "/jam/setlist", title: "Setlist", sub: "Key, tempo, capo" },
      { href: "/jam/transpose", title: "Transpose", sub: "Keys and capo" },
      { href: "/jam/tools", title: "Tuner & Tempo", sub: "Mic tuner, tap tempo" },
      { href: "/harmonica", title: "Harmonica", sub: "Lessons and key finder" },
    ],
  },
  {
    title: "Figure it out",
    tiles: [
      { href: "/jam/key-finder", title: "Key Finder", sub: "What key are we in?" },
      { href: "/jam/identify", title: "Chord Identifier", sub: "Tap or type notes, get the name" },
    ],
  },
]

export default function JamHub() {
  return (
    <div className="space-y-6">
      {GROUPS.map(g => (
        <section key={g.title} aria-labelledby={`grp-${g.title}`}>
          <h2 id={`grp-${g.title}`} className="mb-2 text-xs font-bold uppercase tracking-wider text-purple-300">{g.title}</h2>
          <div className="grid grid-cols-2 gap-3">
            {g.tiles.map(t => (
              <Link
                key={t.href}
                href={t.href}
                className="flex min-h-28 flex-col justify-between rounded-2xl border border-white/15 bg-white/[0.07] p-4 active:scale-[0.97] active:bg-white/15 last:odd:col-span-2"
              >
                <span className="text-xl font-bold text-white">{t.title}</span>
                <span className="text-sm text-purple-200">{t.sub}</span>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <details className="rounded-2xl border border-white/15 bg-white/[0.06] p-4">
        <summary className="min-h-12 cursor-pointer py-3 text-base font-bold text-white">
          Your setup
          <span className="block text-sm font-normal text-purple-200">Who is playing, and the guitar sound</span>
        </summary>
        <div className="mt-2 space-y-5">
          <div>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-purple-300">Who is playing?</h3>
            <BandPicker />
            <p className="mt-3 text-sm text-purple-200">Your picks tailor the tips on the Ideas, Chart, Nashville and Patterns screens.</p>
          </div>
          <div>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-purple-300">Guitar sound</h3>
            <GuitarTonePicker />
            <p className="mt-3 text-sm text-purple-200">Used wherever you tap Play: chord diagrams, scales, the Chord Identifier and progression playback.</p>
          </div>
        </div>
      </details>

      <Panel title="Back up and move">
        <BackupPanel />
      </Panel>
    </div>
  )
}
