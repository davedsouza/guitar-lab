"use client"

import { useState } from "react"
import Link from "next/link"

type Tab = "what-are-modes" | "dorian" | "mixolydian" | "phrygian" | "lydian" | "aeolian" | "applying"

const TABS: { id: Tab; label: string }[] = [
  { id: "what-are-modes", label: "What Are Modes?" },
  { id: "dorian", label: "Dorian" },
  { id: "mixolydian", label: "Mixolydian" },
  { id: "phrygian", label: "Phrygian" },
  { id: "lydian", label: "Lydian" },
  { id: "aeolian", label: "Aeolian" },
  { id: "applying", label: "Applying Modes" },
]

function Callout({ type, children }: { type: "tip" | "warning" | "insight" | "exercise"; children: React.ReactNode }) {
  const styles = {
    tip: "border-l-4 border-purple-500 bg-purple-500/10 text-purple-200",
    warning: "border-l-4 border-amber-500 bg-amber-500/10 text-amber-200",
    insight: "border-l-4 border-blue-400 bg-blue-400/10 text-blue-200",
    exercise: "border-l-4 border-green-500 bg-green-500/10 text-green-200",
  }
  const labels = { tip: "💡 Tip", warning: "⚠️ Watch Out", insight: "🔑 Key Insight", exercise: "🎸 Exercise" }
  return (
    <div className={`rounded-xl p-4 mb-4 ${styles[type]}`}>
      <p className="text-xs font-bold uppercase tracking-wider mb-1 opacity-80">{labels[type]}</p>
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  )
}

function TabBlock({ label, children }: { label: string; children: string }) {
  return (
    <div className="mb-4">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{label}</p>
      <pre className="font-mono text-green-300 bg-black/40 rounded-xl p-4 text-sm overflow-x-auto whitespace-pre leading-relaxed">
        {children}
      </pre>
    </div>
  )
}

function Card({ title, children, color = "border-white/20" }: { title: string; children: React.ReactNode; color?: string }) {
  return (
    <div className={`bg-white/10 border rounded-xl p-5 mb-4 ${color}`}>
      <h3 className="text-white font-bold mb-3">{title}</h3>
      {children}
    </div>
  )
}

function ModeHeader({ name, formula, character, sound, color }: { name: string; formula: string; character: string; sound: string; color: string }) {
  return (
    <div className={`bg-white/10 border-l-4 ${color} rounded-xl p-5 mb-6`}>
      <h2 className="text-3xl font-bold text-white mb-1">{name} Mode</h2>
      <p className="text-slate-300 text-sm font-mono mb-2">Formula: {formula}</p>
      <p className="text-purple-200 mb-1"><span className="text-white font-semibold">Character:</span> {character}</p>
      <p className="text-purple-200"><span className="text-white font-semibold">Sound:</span> {sound}</p>
    </div>
  )
}

function WhatAreModesTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">What Are Modes?</h2>
      <p className="text-purple-200 mb-6">Modes are one of the most misunderstood concepts in music theory. Here's the simple truth: modes are just scales starting from different notes of the same parent scale.</p>

      <Callout type="insight">
        You already know modes — you just don't know it. If you know the major scale, you know all 7 modes. You're just starting the scale from different places.
      </Callout>

      <Card title="The C Major Scale — Parent of All Modes">
        <p className="text-purple-200 text-sm mb-3">The C major scale: C D E F G A B. Play it starting from any of these 7 notes and you get a mode:</p>
        <div className="space-y-2">
          {[
            { start: "C", mode: "Ionian (Major)", degree: "1st", sound: "Happy, bright" },
            { start: "D", mode: "Dorian", degree: "2nd", sound: "Minor but cool, jazzy" },
            { start: "E", mode: "Phrygian", degree: "3rd", sound: "Dark, Spanish, menacing" },
            { start: "F", mode: "Lydian", degree: "4th", sound: "Dreamy, floating, magical" },
            { start: "G", mode: "Mixolydian", degree: "5th", sound: "Bluesy major, rock, soulful" },
            { start: "A", mode: "Aeolian (Minor)", degree: "6th", sound: "Sad, melancholic, dark" },
            { start: "B", mode: "Locrian", degree: "7th", sound: "Diminished, unstable (rarely used)" },
          ].map(m => (
            <div key={m.mode} className="flex gap-3 items-center text-sm border-b border-white/10 pb-2">
              <div className="w-6 text-amber-400 font-bold flex-shrink-0">{m.start}</div>
              <div className="w-28 text-white font-semibold flex-shrink-0">{m.mode}</div>
              <div className="w-12 text-purple-400 text-xs flex-shrink-0">{m.degree}</div>
              <div className="text-purple-300 text-xs">{m.sound}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="The Practical Way to Think About Modes">
        <p className="text-purple-200 text-sm mb-3">Forget &quot;relative to the parent scale&quot; — that&apos;s confusing. Instead, think about each mode as its own scale with a specific interval formula:</p>
        <div className="space-y-2 text-sm">
          {[
            { mode: "Dorian", recipe: "Minor scale with a raised 6th (♭3, natural 6)" },
            { mode: "Mixolydian", recipe: "Major scale with a lowered 7th (natural 3, ♭7)" },
            { mode: "Phrygian", recipe: "Minor scale with a lowered 2nd (♭2, ♭3)" },
            { mode: "Lydian", recipe: "Major scale with a raised 4th (#4)" },
            { mode: "Aeolian", recipe: "The natural minor scale (same as minor pentatonic + 2 notes)" },
          ].map(m => (
            <div key={m.mode} className="flex gap-3 border-b border-white/10 pb-2">
              <div className="w-24 text-amber-300 font-semibold flex-shrink-0">{m.mode}</div>
              <div className="text-purple-200">{m.recipe}</div>
            </div>
          ))}
        </div>
      </Card>

      <Callout type="tip">
        Focus on just 3 modes first: Dorian (minor), Mixolydian (major/blues), and Aeolian (minor). These cover 90% of real-world music. Add Phrygian and Lydian once these are solid.
      </Callout>

      <Card title="When Do You Use Modes?">
        <p className="text-purple-200 text-sm mb-3">The key question is: what chord is being played under you? Match your mode to the chord quality:</p>
        <div className="space-y-2 text-sm">
          {[
            { chord: "Major chord (no 7th)", modes: "Ionian or Lydian" },
            { chord: "Dominant 7 chord (e.g. G7)", modes: "Mixolydian" },
            { chord: "Minor chord (no 7th)", modes: "Dorian or Aeolian" },
            { chord: "Minor with dark/Spanish feel", modes: "Phrygian" },
          ].map(r => (
            <div key={r.chord} className="flex gap-3 border-b border-white/10 pb-2">
              <div className="w-44 text-purple-300 flex-shrink-0">{r.chord}</div>
              <div className="text-green-300 font-semibold">{r.modes}</div>
            </div>
          ))}
        </div>
      </Card>

      <Callout type="exercise">
        Before moving to individual modes, play through the C major scale starting on each note. Hear how each one feels different even though the notes are the same. That&apos;s modes.
      </Callout>
    </div>
  )
}

function DorianTab() {
  return (
    <div>
      <ModeHeader
        name="Dorian"
        formula="W H W W W H W (1 2 ♭3 4 5 6 ♭7)"
        character="Minor but not sad — jazzy, cool, sophisticated. The raised 6th gives it life."
        sound="Think Carlos Santana, Pink Floyd's 'Comfortably Numb', Daft Punk's 'Get Lucky'"
        color="border-blue-500"
      />

      <Card title="The Key Difference: Natural 6th">
        <p className="text-purple-200 text-sm mb-3">Dorian vs Natural Minor (Aeolian) — only one note differs: the 6th degree.</p>
        <div className="flex gap-4 text-sm">
          <div className="flex-1">
            <p className="text-red-400 font-semibold mb-1">Natural Minor (A)</p>
            <p className="font-mono text-purple-200">A B C D E F G A</p>
            <p className="text-purple-300 text-xs mt-1">6th = F (♭6)</p>
          </div>
          <div className="flex-1">
            <p className="text-blue-400 font-semibold mb-1">Dorian (A)</p>
            <p className="font-mono text-purple-200">A B C D E <span className="text-amber-300 font-bold">F#</span> G A</p>
            <p className="text-amber-300 text-xs mt-1">6th = F# (natural 6) ← the magic note</p>
          </div>
        </div>
      </Card>

      <TabBlock label="A Dorian — one-octave pattern (5th fret area)">
{`e|--5-7-8-------------|
B|------5-7-8---------|
G|----------5-7-------|
D|--------5-7---------|
A|--5-7-8-------------|
E|--------------------|
   A  B  C  D  E  F#  G`}
      </TabBlock>

      <TabBlock label="A Dorian riff — emphasising the ♭3 and natural 6">
{`e|-----------------------------|
B|-----------------------------|
G|----2------------------------| ← F# (the Dorian note)
D|----2-4-----2-0--------------|
A|--0-----0-2-----2-0----------|
E|-----------------------------|
  A minor feel with that cool raised 6th`}
      </TabBlock>

      <Card title="Songs That Use Dorian">
        <div className="space-y-2 text-sm">
          {[
            { song: "Oye Como Va", artist: "Santana", key: "A Dorian", note: "Riff sits perfectly in A Dorian" },
            { song: "Comfortably Numb (solo)", artist: "Pink Floyd", key: "B Dorian", note: "Gilmour's sustained, emotional phrasing" },
            { song: "So What", artist: "Miles Davis", key: "D/E♭ Dorian", note: "The classic jazz modal tune" },
            { song: "Riders on the Storm", artist: "The Doors", key: "E Dorian", note: "Cool, haunting Dorian atmosphere" },
          ].map(s => (
            <div key={s.song} className="border-b border-white/10 pb-2">
              <p className="text-white font-semibold">{s.song} — {s.artist}</p>
              <p className="text-purple-300 text-xs">{s.key} · {s.note}</p>
            </div>
          ))}
        </div>
      </Card>

      <Callout type="exercise">
        <p className="font-semibold mb-1">Dorian Ear Exercise:</p>
        Play A minor pentatonic over an Am chord. Then add the F# (the Dorian note). Hear how it instantly sounds more sophisticated? That single note is the difference between ordinary and cool.
      </Callout>
    </div>
  )
}

function MixolydianTab() {
  return (
    <div>
      <ModeHeader
        name="Mixolydian"
        formula="W W H W W H W (1 2 3 4 5 6 ♭7)"
        character="Major scale feel but bluesy — the ♭7 gives it warmth and drive. The most used mode in rock and blues."
        sound="Think Jimi Hendrix, Eric Clapton, almost all classic rock solos over dominant chords"
        color="border-amber-500"
      />

      <Card title="The Key Difference: Flat 7th">
        <p className="text-purple-200 text-sm mb-3">Mixolydian is a major scale with one change — the 7th is lowered by a half step.</p>
        <div className="flex gap-4 text-sm">
          <div className="flex-1">
            <p className="text-purple-300 font-semibold mb-1">G Major</p>
            <p className="font-mono text-purple-200">G A B C D E F# G</p>
            <p className="text-purple-300 text-xs mt-1">7th = F#</p>
          </div>
          <div className="flex-1">
            <p className="text-amber-400 font-semibold mb-1">G Mixolydian</p>
            <p className="font-mono text-purple-200">G A B C D E <span className="text-amber-300 font-bold">F</span> G</p>
            <p className="text-amber-300 text-xs mt-1">7th = F (♭7) ← the blues note</p>
          </div>
        </div>
      </Card>

      <TabBlock label="G Mixolydian — full pattern (3rd fret area)">
{`e|--3-5-7----------|
B|----3-5-6--------|
G|------4-5--------|
D|----3-5----------|
A|--3-5------------|
E|--3-5-7----------|
   G  A  B  C  D  E  F`}
      </TabBlock>

      <TabBlock label="G Mixolydian riff — over G7 chord">
{`e|-----------------------------|
B|-----------------------------|
G|---4-5-4----4-5-4------------|
D|----------5-------5-3--------|
A|-----------------------------|
E|--3--------------------------|
  That ♭7 (F) creates the bluesy dominant feel`}
      </TabBlock>

      <TabBlock label="Mixolydian phrase — targeting the ♭7">
{`e|---------------------5-3-----|
B|--3-6-5-3----------5---------|
G|----------5-4-2-4------------|
D|-----------------------------|
A|-----------------------------|
E|-----------------------------|
  Use ♭7 as passing tone to land on root`}
      </TabBlock>

      <Card title="When To Use Mixolydian">
        <p className="text-purple-200 text-sm mb-3">Any time you see a dominant 7 chord (G7, A7, D7, E7), Mixolydian fits perfectly:</p>
        <ul className="space-y-1 text-sm text-purple-200">
          <li>• Over the I7 chord in a blues (the home chord)</li>
          <li>• Over IV7 and V7 chords in a blues</li>
          <li>• Classic rock riffs that feel major but bluesy</li>
          <li>• Southern rock, funk, and soul grooves</li>
        </ul>
      </Card>

      <Card title="Classic Mixolydian Songs">
        <div className="space-y-2 text-sm">
          {[
            { song: "Hey Joe", artist: "Hendrix", key: "E Mixolydian", note: "The whole riff is built from Mixolydian" },
            { song: "Norwegian Wood", artist: "Beatles", key: "E Mixolydian", note: "Lennon's melody is pure Mixolydian" },
            { song: "Grateful Dead jams", artist: "Grateful Dead", key: "Various", note: "Garcia loved Mixolydian over dominant chords" },
            { song: "Sweet Home Chicago", artist: "Blues standard", key: "A Mixolydian", note: "The 12-bar is all Mixolydian territory" },
          ].map(s => (
            <div key={s.song} className="border-b border-white/10 pb-2">
              <p className="text-white font-semibold">{s.song} — {s.artist}</p>
              <p className="text-purple-300 text-xs">{s.key} · {s.note}</p>
            </div>
          ))}
        </div>
      </Card>

      <Callout type="exercise">
        <p className="font-semibold mb-1">Mixolydian Exercise:</p>
        Solo over a G7 vamp using G major pentatonic. Now add the F note (♭7). Feel how it changes? Now add B (the major 3rd). You&apos;re now playing G Mixolydian — and it sounds like classic rock.
      </Callout>
    </div>
  )
}

function PhrygianTab() {
  return (
    <div>
      <ModeHeader
        name="Phrygian"
        formula="H W W W H W W (1 ♭2 ♭3 4 5 ♭6 ♭7)"
        character="Dark, menacing, Spanish, exotic. The ♭2 creates an instantly recognisable tension."
        sound="Flamenco, metal, surf rock. Think Metallica, Rodrigo y Gabriela, Dick Dale"
        color="border-red-600"
      />

      <Card title="The Key Difference: Flat 2nd">
        <p className="text-purple-200 text-sm mb-3">Phrygian&apos;s signature is the ♭2 — just a half step above the root. This creates instant tension and an exotic, Spanish sound.</p>
        <div className="flex gap-4 text-sm">
          <div className="flex-1">
            <p className="text-purple-300 font-semibold mb-1">A Natural Minor</p>
            <p className="font-mono text-purple-200">A B C D E F G</p>
            <p className="text-purple-300 text-xs mt-1">2nd = B (natural)</p>
          </div>
          <div className="flex-1">
            <p className="text-red-400 font-semibold mb-1">A Phrygian</p>
            <p className="font-mono text-purple-200">A <span className="text-amber-300 font-bold">B♭</span> C D E F G</p>
            <p className="text-amber-300 text-xs mt-1">2nd = B♭ (♭2) ← the darkness</p>
          </div>
        </div>
      </Card>

      <TabBlock label="E Phrygian — open position (classic flamenco/metal)">
{`e|--0-1-3---------|
B|--0-1-3---------|
G|--0-1-2---------|
D|--0-2-3---------|
A|--0-1-3---------|
E|--0-1-3---------|
   E  F  G  A  B  C  D`}
      </TabBlock>

      <TabBlock label="E Phrygian riff — that Spanish/metal tension">
{`e|--0-1-0--------------------|
B|--------3-1-0--------------|
G|-------------2-1-0---------|
D|-------------------2-0-----|
A|---------------------------|
E|--0------------------------|
  The ♭2 (F) is the defining note`}
      </TabBlock>

      <TabBlock label="Phrygian dominant — the flamenco sound (harmonic minor variation)">
{`e|--0-1-4-5---------|
B|--0-1-3-5---------|
G|--0-1-2-4---------|
D|--0-2-3-----------|
A|--0-1-3-----------|
E|--0---------------|
  Raise the 3rd to major — very Spanish`}
      </TabBlock>

      <Card title="Songs That Use Phrygian">
        <div className="space-y-2 text-sm">
          {[
            { song: "Wherever I May Roam", artist: "Metallica", key: "E Phrygian", note: "Classic metal Phrygian riff" },
            { song: "Sultans of Swing (verse riff)", artist: "Dire Straits", key: "D Phrygian elements", note: "Knopfler's dark, edgy riff tone" },
            { song: "Misirlou", artist: "Dick Dale", key: "E Phrygian Dominant", note: "Pulp Fiction theme — pure exoticism" },
            { song: "White Rabbit", artist: "Jefferson Airplane", key: "F# Phrygian", note: "Rising tension through the ♭2" },
          ].map(s => (
            <div key={s.song} className="border-b border-white/10 pb-2">
              <p className="text-white font-semibold">{s.song} — {s.artist}</p>
              <p className="text-purple-300 text-xs">{s.key} · {s.note}</p>
            </div>
          ))}
        </div>
      </Card>

      <Callout type="exercise">
        <p className="font-semibold mb-1">Phrygian Ear Exercise:</p>
        Play an Em chord, then move to an F chord (just one fret up). That movement is Phrygian — the ♭2 chord (F) to the i chord (Em). Practice this vamp and solo over it using E Phrygian. You&apos;ll immediately recognise the flamenco sound.
      </Callout>
    </div>
  )
}

function LydianTab() {
  return (
    <div>
      <ModeHeader
        name="Lydian"
        formula="W W W H W W H (1 2 3 #4 5 6 7)"
        character="Dreamy, floating, magical, otherworldly. The #4 creates a sense of longing and wonder."
        sound="Film scores, dream pop, Joe Satriani's melodic leads, Stevie Ray Vaughan's 'Lenny'"
        color="border-indigo-400"
      />

      <Card title="The Key Difference: Sharp 4th">
        <p className="text-purple-200 text-sm mb-3">Lydian is a major scale with the 4th raised by a half step. This single change transforms the sound from happy to ethereal.</p>
        <div className="flex gap-4 text-sm">
          <div className="flex-1">
            <p className="text-purple-300 font-semibold mb-1">F Major</p>
            <p className="font-mono text-purple-200">F G A B♭ C D E</p>
            <p className="text-purple-300 text-xs mt-1">4th = B♭ (perfect 4th)</p>
          </div>
          <div className="flex-1">
            <p className="text-indigo-400 font-semibold mb-1">F Lydian</p>
            <p className="font-mono text-purple-200">F G A <span className="text-amber-300 font-bold">B</span> C D E</p>
            <p className="text-amber-300 text-xs mt-1">4th = B (#4) ← the magic note</p>
          </div>
        </div>
      </Card>

      <TabBlock label="G Lydian — one octave pattern">
{`e|--3-5-7----------|
B|----4-5-7--------|
G|------4-6--------|
D|----4-5-7--------|
A|--3-5------------|
E|--3-5-7----------|
   G  A  B  C#  D  E  F#`}
      </TabBlock>

      <TabBlock label="G Lydian riff — the dreamy #4">
{`e|--7-9-11-9-7-9----|
B|--8---------------|
G|------------------|
D|------------------|
A|------------------|
E|------------------|
  C# (the #4) creates that floating, ethereal quality`}
      </TabBlock>

      <Card title="Songs That Use Lydian">
        <div className="space-y-2 text-sm">
          {[
            { song: "Flying in a Blue Dream", artist: "Joe Satriani", key: "Various Lydian", note: "Satriani's signature sound is built on Lydian" },
            { song: "Lenny", artist: "Stevie Ray Vaughan", key: "E Lydian elements", note: "That floating, beautiful intro" },
            { song: "The Simpsons Theme", artist: "Danny Elfman", key: "C Lydian", note: "The quirky, otherworldly feel is Lydian" },
            { song: "Man on the Moon", artist: "R.E.M.", key: "G Lydian", note: "The dreamy major feel with a twist" },
          ].map(s => (
            <div key={s.song} className="border-b border-white/10 pb-2">
              <p className="text-white font-semibold">{s.song} — {s.artist}</p>
              <p className="text-purple-300 text-xs">{s.key} · {s.note}</p>
            </div>
          ))}
        </div>
      </Card>

      <Callout type="exercise">
        <p className="font-semibold mb-1">Lydian Ear Exercise:</p>
        Play a G major chord, then hum a melody using G major scale. Now raise the 4th (C → C#). Play that note prominently over the G chord. Hear how it creates a floaty, unresolved feeling? That&apos;s Lydian. Use it over major chords when you want ethereal or cinematic.
      </Callout>
    </div>
  )
}

function AeolianTab() {
  return (
    <div>
      <ModeHeader
        name="Aeolian (Natural Minor)"
        formula="W H W W H W W (1 2 ♭3 4 5 ♭6 ♭7)"
        character="Melancholic, dark, emotional. The natural minor scale — the foundation of most sad/dark music."
        sound="Rock ballads, classical, metal. Think 'Stairway to Heaven', 'Nothing Else Matters', 'Hotel California'"
        color="border-slate-400"
      />

      <Card title="Aeolian vs Dorian — One Note Apart">
        <p className="text-purple-200 text-sm mb-3">The only difference between Dorian and Aeolian is the 6th degree:</p>
        <div className="flex gap-4 text-sm">
          <div className="flex-1">
            <p className="text-blue-400 font-semibold mb-1">A Dorian</p>
            <p className="font-mono text-purple-200">A B C D E <span className="text-amber-300 font-bold">F#</span> G</p>
            <p className="text-amber-300 text-xs mt-1">Natural 6 — sounds cool/jazzy</p>
          </div>
          <div className="flex-1">
            <p className="text-slate-300 font-semibold mb-1">A Aeolian</p>
            <p className="font-mono text-purple-200">A B C D E <span className="text-blue-300 font-bold">F</span> G</p>
            <p className="text-blue-300 text-xs mt-1">Flat 6 — darker, more melancholic</p>
          </div>
        </div>
      </Card>

      <TabBlock label="A Aeolian — natural minor (open position)">
{`e|--0-1-3---------|
B|--0-1-3---------|
G|--0-2-4---------|
D|--0-2-3---------|
A|--0-2-3---------|
E|--0-1-3---------|
   A  B  C  D  E  F  G`}
      </TabBlock>

      <TabBlock label="A Aeolian riff — classic minor feel">
{`e|--0-3-0-1-0----------------|
B|------------3-1-0----------|
G|------------------0-2-0----|
D|---------------------------|
A|--0------------------------|
E|---------------------------|
  The ♭6 (F) and ♭7 (G) define the sound`}
      </TabBlock>

      <TabBlock label="Aeolian chord progression — Am F C G">
{`Am      F       C       G
:||: i - ♭VI - ♭III - ♭VII :||:
This is THE progression for Aeolian songs
Stairway, Hotel California, most rock ballads`}
      </TabBlock>

      <Card title="Classic Aeolian Songs">
        <div className="space-y-2 text-sm">
          {[
            { song: "Stairway to Heaven", artist: "Led Zeppelin", key: "A Aeolian", note: "The ascending intro is pure natural minor" },
            { song: "Nothing Else Matters", artist: "Metallica", key: "E Aeolian", note: "Open string Em arpeggio intro" },
            { song: "Hotel California", artist: "Eagles", key: "B Aeolian", note: "The chord progression is textbook Aeolian" },
            { song: "Wish You Were Here", artist: "Pink Floyd", key: "G Aeolian elements", note: "Melancholic, dark, searching feel" },
          ].map(s => (
            <div key={s.song} className="border-b border-white/10 pb-2">
              <p className="text-white font-semibold">{s.song} — {s.artist}</p>
              <p className="text-purple-300 text-xs">{s.key} · {s.note}</p>
            </div>
          ))}
        </div>
      </Card>

      <Callout type="tip">
        Aeolian and the minor pentatonic are best friends. The pentatonic is just Aeolian with the 2nd and 6th removed. Adding those two notes back in gives you Aeolian — more melodic options, same dark feel.
      </Callout>

      <Callout type="exercise">
        <p className="font-semibold mb-1">Aeolian Exercise:</p>
        Play a vi-♭VII-♭VI-♭VII vamp in Am (Am-G-F-G). Solo using A natural minor (Aeolian). Focus on the ♭6 (F) and ♭7 (G) as landing notes — these are the notes that give Aeolian its melancholic, searching quality.
      </Callout>
    </div>
  )
}

function ApplyingTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Applying Modes — The Practical Guide</h2>
      <p className="text-purple-200 mb-6">Knowing modes theoretically is useless if you can't use them in real music. Here's the step-by-step method to actually apply modes when you're soloing.</p>

      <Card title="Step 1 — Identify the Chord">
        <p className="text-purple-200 text-sm mb-3">What chord is being played under you? That determines which mode family to use:</p>
        <div className="space-y-2 text-sm">
          {[
            { chord: "Major chord (Cmaj, Gmaj)", mode: "Ionian or Lydian", feel: "Bright or Dreamy" },
            { chord: "Dominant 7 (G7, A7, D7)", mode: "Mixolydian", feel: "Bluesy/Soulful" },
            { chord: "Minor chord (Am, Em)", mode: "Dorian or Aeolian", feel: "Cool or Melancholic" },
            { chord: "Minor with dark/exotic feel", mode: "Phrygian", feel: "Dark/Spanish" },
          ].map(r => (
            <div key={r.chord} className="flex gap-3 border-b border-white/10 pb-2">
              <div className="w-40 text-purple-300 text-xs flex-shrink-0">{r.chord}</div>
              <div className="w-28 text-green-300 font-semibold text-xs">{r.mode}</div>
              <div className="text-purple-400 text-xs">{r.feel}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Step 2 — Find the Root Note on Your Guitar">
        <p className="text-purple-200 text-sm mb-3">Once you know the mode, find the root note on the neck and play the mode from there. For a G Mixolydian solo:</p>
        <ol className="space-y-1 text-sm text-purple-200">
          <li>1. Find G on the low E string (fret 3)</li>
          <li>2. Play the Mixolydian pattern starting from that G</li>
          <li>3. That&apos;s it — you&apos;re playing G Mixolydian over the G7 chord</li>
        </ol>
      </Card>

      <Card title="Step 3 — Emphasise the Characteristic Note">
        <p className="text-purple-200 text-sm mb-3">Each mode has one note that defines its sound. Target that note in your phrases:</p>
        <div className="space-y-2 text-sm">
          {[
            { mode: "Dorian", note: "Natural 6th", why: "Brightens the minor, gives the jazzy feel" },
            { mode: "Mixolydian", note: "♭7th", why: "Creates the bluesy dominant tension" },
            { mode: "Phrygian", note: "♭2nd", why: "Instant dark/Spanish tension" },
            { mode: "Lydian", note: "#4th", why: "Ethereal, floating quality" },
            { mode: "Aeolian", note: "♭6th", why: "Deepens the melancholy" },
          ].map(m => (
            <div key={m.mode} className="flex gap-3 border-b border-white/10 pb-2">
              <div className="w-24 text-amber-300 font-semibold text-xs flex-shrink-0">{m.mode}</div>
              <div className="w-24 text-green-300 text-xs flex-shrink-0">{m.note}</div>
              <div className="text-purple-300 text-xs">{m.why}</div>
            </div>
          ))}
        </div>
      </Card>

      <TabBlock label="12-Bar Mixolydian exercise (G7 vamp)">
{`G Mixolydian over G7:
e|--3-5-3-----3-5-3-------------|
B|--------5-3-----------3-5-3---|
G|-----------------------------4-|
D|-------------------------------|
A|-------------------------------|
E|--3----------------------------|
Target the F (♭7) on beat 1 of bar 2`}
      </TabBlock>

      <Card title="The 80/20 Rule for Modes">
        <p className="text-purple-200 text-sm mb-3">You don&apos;t need all 7 modes. Focus on these 3 and cover 90% of real music situations:</p>
        <div className="space-y-3">
          {[
            { mode: "Mixolydian", use: "Over any dominant 7 chord (I7, IV7, V7 in blues)", priority: "1st" },
            { mode: "Dorian", use: "Over minor chords — cooler than natural minor", priority: "2nd" },
            { mode: "Aeolian", use: "Over minor progressions — rock ballads, sad songs", priority: "3rd" },
          ].map(m => (
            <div key={m.mode} className="flex gap-3 items-start">
              <div className="bg-amber-500/20 text-amber-400 rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold flex-shrink-0">{m.priority}</div>
              <div>
                <p className="text-white font-semibold text-sm">{m.mode}</p>
                <p className="text-purple-200 text-xs">{m.use}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Callout type="exercise">
        <p className="font-semibold mb-1">The Ear-First Approach (Most Important Exercise):</p>
        <p>Instead of thinking &quot;which mode is this&quot;, train your ear to recognise each mode&apos;s character:</p>
        <ol className="mt-2 space-y-1">
          <li>1. Dorian: play it and think &quot;smooth, cool, jazzy&quot;</li>
          <li>2. Mixolydian: play it and think &quot;rock, bluesy, driving&quot;</li>
          <li>3. Phrygian: play it and think &quot;dark, Spanish, tense&quot;</li>
          <li>4. Put on a song. Listen. Which feeling does the solo have?</li>
          <li>5. That&apos;s your mode identification — through feeling, not theory.</li>
        </ol>
      </Callout>
    </div>
  )
}

export default function ModesPage() {
  const [activeTab, setActiveTab] = useState<Tab>("what-are-modes")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link href="/" className="text-purple-300 hover:text-white text-sm">← Back to modules</Link>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Modes Made Practical</h1>
          <p className="text-purple-200">Dorian, Mixolydian, Phrygian, Lydian, Aeolian — understand and apply each mode with real examples and TAB.</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === t.id
                  ? "bg-purple-600 text-white"
                  : "bg-white/10 text-purple-300 hover:bg-white/20"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
          {activeTab === "what-are-modes" && <WhatAreModesTab />}
          {activeTab === "dorian" && <DorianTab />}
          {activeTab === "mixolydian" && <MixolydianTab />}
          {activeTab === "phrygian" && <PhrygianTab />}
          {activeTab === "lydian" && <LydianTab />}
          {activeTab === "aeolian" && <AeolianTab />}
          {activeTab === "applying" && <ApplyingTab />}
        </div>
      </div>
    </div>
  )
}
