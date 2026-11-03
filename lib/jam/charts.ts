import type { JamProgression } from "./genres"
import { fromNashville, keyLabel, prefersFlats, type KeyRef } from "./theory"

export function progressionChords(p: JamProgression, key: KeyRef): string[] {
  // Minor progressions are written from the minor tonic, so use the key root directly
  const flats = prefersFlats({ root: key.root, minor: p.minor ?? key.minor })
  return p.chords.map(t => fromNashville(t, key.root, flats))
}

export function progressionToChartBody(p: JamProgression, key: KeyRef): string {
  const chords = progressionChords(p, key)
  const lines: string[] = ["Verse"]
  const perLine = chords.length > 8 ? 4 : chords.length > 4 ? 4 : chords.length
  for (let i = 0; i < chords.length; i += perLine) {
    lines.push("| " + chords.slice(i, i + perLine).join(" | ") + " |")
  }
  return lines.join("\n")
}

export function progressionKeyLabel(p: JamProgression, key: KeyRef): string {
  return keyLabel({ root: key.root, minor: p.minor ?? key.minor })
}

export interface StarterChart {
  title: string
  key: string
  genre: string
  body: string
}

export const STARTER_CHARTS: StarterChart[] = [
  {
    title: "Amazing Grace",
    key: "G",
    genre: "folk",
    body: `Verse
[G]Amazing grace, how [G7]sweet the [C]sound
That [G]saved a wretch like [D]me
I [G]once was lost but [G7]now am [C]found
Was [G]blind but [D]now I [G]see`,
  },
  {
    title: "When the Saints Go Marching In",
    key: "C",
    genre: "gospel",
    body: `Verse
[C]Oh when the saints go marching in
Oh when the [G7]saints go [C]marching in
Oh Lord I [F]want to be in that [C]number
When the [G7]saints go [C]marching in`,
  },
  {
    title: "12-Bar Blues in A",
    key: "A",
    genre: "blues",
    body: `Form
| A7 | A7 | A7 | A7 |
| D7 | D7 | A7 | A7 |
| E7 | D7 | A7 | E7 |`,
  },
]
