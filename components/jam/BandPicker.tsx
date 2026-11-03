"use client"

import { Chip } from "./ui"
import { useBand } from "./BandContext"

export default function BandPicker() {
  const { band, setBand } = useBand()
  return (
    <div className="space-y-3">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-purple-300">Guitars</p>
        <div className="grid grid-cols-3 gap-2">
          {([1, 2, 3] as const).map(n => (
            <Chip key={n} active={band.guitars === n} onClick={() => setBand({ ...band, guitars: n })}>
              {n} guitar{n > 1 ? "s" : ""}
            </Chip>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Chip active={band.bass} onClick={() => setBand({ ...band, bass: !band.bass })}>Bass</Chip>
        <Chip active={band.piano} onClick={() => setBand({ ...band, piano: !band.piano })}>Piano</Chip>
        <Chip active={!!band.harmonica} onClick={() => setBand({ ...band, harmonica: !band.harmonica })}>Harmonica</Chip>
      </div>
    </div>
  )
}
