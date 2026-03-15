"use client"

import React, { useState } from "react"
import Link from "next/link"

// --- Tab types ---------------------------------------------------------------
type Tab =
  | "what-is-slide"
  | "the-slide"
  | "technique"
  | "open-g"
  | "open-d"
  | "standard"
  | "practice"

const TABS: { id: Tab; label: string }[] = [
  { id: "what-is-slide", label: "What is Slide?" },
  { id: "the-slide",     label: "The Slide" },
  { id: "technique",     label: "Technique" },
  { id: "open-g",        label: "Open G" },
  { id: "open-d",        label: "Open D" },
  { id: "standard",      label: "Standard Tuning" },
  { id: "practice",      label: "Practice & Songs" },
]

// --- Shared components -------------------------------------------------------
function Callout({
  type,
  children,
}: {
  type: "tip" | "warning" | "insight" | "exercise"
  children: React.ReactNode
}) {
  const styles = {
    tip:      "border-l-4 border-purple-500 bg-purple-500/10 text-purple-200",
    warning:  "border-l-4 border-amber-500  bg-amber-500/10  text-amber-200",
    insight:  "border-l-4 border-blue-400   bg-blue-400/10   text-blue-200",
    exercise: "border-l-4 border-green-500  bg-green-500/10  text-green-200",
  }
  const labels = {
    tip:      "Tip",
    warning:  "Watch Out",
    insight:  "Key Insight",
    exercise: "Exercise",
  }
  return (
    <div className={`rounded-xl p-4 mb-4 ${styles[type]}`}>
      <p className="text-xs font-bold uppercase tracking-wider mb-1 opacity-80">
        {labels[type]}
      </p>
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  )
}

function Card({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-4">
      <h3 className="text-lg font-bold text-white mb-3">{title}</h3>
      {children}
    </div>
  )
}

function TabBlock({
  label,
  children,
}: {
  label?: string
  children: string
}) {
  return (
    <div className="mb-4">
      {label && <p className="text-purple-400 text-xs mb-2">{label}</p>}
      <pre className="font-mono text-green-300 bg-black/40 rounded-xl p-4 text-xs leading-relaxed overflow-x-auto whitespace-pre">
        {children}
      </pre>
    </div>
  )
}

// =============================================================================
// Tab 1 — What is Slide Guitar?
// =============================================================================
function WhatIsSlideTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">What is Slide Guitar?</h2>
      <p className="text-purple-200 mb-6 leading-relaxed">
        Slide guitar is one of the most expressive and instantly recognisable sounds in all of music.
        A hard object — glass, metal, ceramic, or brass — is placed on a finger and glided along the
        strings instead of pressing them against frets. The result is a voice-like, crying, singing
        tone that no other technique can replicate.
      </p>

      <Callout type="insight">
        The fundamental difference from standard guitar:{" "}
        <strong className="text-white">the slide replaces the fret with continuous pitch</strong>.
        There are no discrete frets, no locked-in note positions. Every millimetre of movement
        changes the pitch. This is simultaneously the most powerful and most demanding aspect of
        slide playing.
      </Callout>

      <Card title="A Brief History">
        <div className="space-y-4 text-sm">
          <div className="border-b border-white/10 pb-3">
            <p className="text-white font-semibold mb-1">Delta Blues — The Origin</p>
            <p className="text-purple-300">
              Slide guitar was born in the Mississippi Delta in the late 19th and early 20th centuries.
              Early players used whatever was available — bottlenecks from whiskey bottles, pocket
              knives, even bones — to produce a moaning, wailing sound that mirrored the human voice
              and the work songs and field hollers of the era. Robert Johnson, Son House, and Charlie
              Patton defined the raw, primitive sound that became the foundation of all blues.
            </p>
          </div>
          <div className="border-b border-white/10 pb-3">
            <p className="text-white font-semibold mb-1">Hawaiian Influence</p>
            <p className="text-purple-300">
              Simultaneously, Hawaiian musicians developed lap steel guitar — the guitar laid flat on
              the lap, played with a steel bar. Hawaiian music flooded America in the early 20th century
              via touring shows and recordings, introducing ornate portamento and sophisticated harmonics
              that would later influence country music and jazz.
            </p>
          </div>
          <div className="border-b border-white/10 pb-3">
            <p className="text-white font-semibold mb-1">Spread to Country, Rock, and Soul</p>
            <p className="text-purple-300">
              By the 1950s, slide was central to electric blues — Elmore James electrified it with a
              ferocity that changed rock and roll. By the late 1960s and 1970s, players like Duane
              Allman and Ry Cooder elevated slide to an art form. Soul and R&B absorbed it seamlessly.
              Today it appears in every genre from Americana to ambient.
            </p>
          </div>
          <div>
            <p className="text-white font-semibold mb-1">The Modern Era</p>
            <p className="text-purple-300">
              Derek Trucks, Bonnie Raitt, and Ben Harper represent the living tradition — each bringing
              a distinct voice. Trucks&apos;s Indian-influenced melodicism, Raitt&apos;s soulful
              restraint, Harper&apos;s raw power. The slide voice is timeless.
            </p>
          </div>
        </div>
      </Card>

      <Card title="Famous Slide Players to Study">
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          {[
            {
              name: "Robert Johnson",
              style: "Delta Blues",
              note: "The archetype. Open D and Open G, raw and haunting. Start here for history.",
            },
            {
              name: "Elmore James",
              style: "Electric Blues",
              note: "\"Dust My Broom\" intro is the most copied slide riff in history. Aggressive, electrified Delta.",
            },
            {
              name: "Duane Allman",
              style: "Southern Rock / Blues",
              note: "\"Statesboro Blues\" and the \"Layla\" piano outro define melodic rock slide. Open E master.",
            },
            {
              name: "Ry Cooder",
              style: "Roots / World",
              note: "Scholarly and inventive. Standard tuning slide master. The bridge between blues and Americana.",
            },
            {
              name: "Derek Trucks",
              style: "Blues / Jazz / Indian",
              note: "Open E in standard position. Melodic lines with jazz harmony. The modern benchmark.",
            },
            {
              name: "Bonnie Raitt",
              style: "Blues / Rock",
              note: "Soulful, singing tone. A masterclass in less-is-more slide philosophy in a song context.",
            },
            {
              name: "David Gilmour",
              style: "Rock",
              note: "Standard tuning slide for colour and texture. \"Comfortably Numb\" influence is unmistakable.",
            },
            {
              name: "Ben Harper",
              style: "Acoustic / Soul",
              note: "Weissenborn lap slide. Brings raw power and extreme dynamics. Modern acoustic slide master.",
            },
          ].map((p) => (
            <div key={p.name} className="bg-white/5 rounded-xl p-3 border border-white/10">
              <p className="text-white font-bold">{p.name}</p>
              <p className="text-purple-400 text-xs mb-1">{p.style}</p>
              <p className="text-purple-300 text-xs">{p.note}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card title="What You Gain — What You Lose">
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-green-400 font-bold mb-2 uppercase text-xs tracking-wider">What You Gain</p>
            <ul className="space-y-2">
              {[
                "Gliding between pitches (portamento) — the defining slide sound",
                "Infinite micro-pitch expression and intonation nuance",
                "Otherworldly sustain on each held note",
                "Voice-like vibrato unlike anything a fretted note can produce",
                "Access to the spaces between semitones — blue notes, bent approaches",
                "A completely distinct sonic identity in any band context",
              ].map((item, i) => (
                <li key={i} className="flex gap-2 text-purple-300">
                  <span className="text-green-400 mt-0.5 shrink-0">+</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-amber-400 font-bold mb-2 uppercase text-xs tracking-wider">What You Lose</p>
            <ul className="space-y-2">
              {[
                "Chordal precision — complex shapes are harder to voice cleanly",
                "Clean individual note attack — the slide adds portamento to every approach",
                "Speed — fast runs require significant technique to keep clean",
                "Lower action setups — slide works best with higher action",
                "Instant transferability — slide is a genuinely separate skill set",
              ].map((item, i) => (
                <li key={i} className="flex gap-2 text-purple-300">
                  <span className="text-amber-400 mt-0.5 shrink-0">−</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      <Card title="Two Main Playing Styles">
        <div className="space-y-4 text-sm">
          <div className="border-b border-white/10 pb-4">
            <p className="text-white font-semibold mb-1">Bottleneck / Standard Position</p>
            <p className="text-purple-300">
              The guitar is held in the normal playing position and the slide is worn on a finger.
              This is the most common approach for electric blues, rock, and country slide. It allows
              you to combine slide playing with normal fretting on the same guitar, in the same song,
              even in the same phrase. Robert Johnson, Elmore James, Derek Trucks, and Duane Allman
              all play in this position.
            </p>
          </div>
          <div>
            <p className="text-white font-semibold mb-1">Lap Steel</p>
            <p className="text-purple-300">
              The guitar is laid flat across the lap and a steel bar is held in the picking hand.
              This is the Hawaiian tradition, also used in country (pedal steel evolved from this).
              The technique is entirely different — there is no fretting hand at all. It produces an
              incredibly smooth, sustained tone. Ben Harper plays a Weissenborn, a hollow-neck variant
              of lap steel in an acoustic context.
            </p>
          </div>
        </div>
      </Card>

      <Callout type="tip">
        If you are brand new to slide, start in{" "}
        <strong className="text-white">bottleneck position in Open G tuning</strong>. One barre equals
        one chord, three fret positions cover your entire I-IV-V blues vocabulary. You can sound good
        within a week.
      </Callout>
    </div>
  )
}

// =============================================================================
// Tab 2 — The Slide
// =============================================================================
function TheSlideTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Choosing Your Slide</h2>
      <p className="text-purple-200 mb-6 leading-relaxed">
        The slide itself is a simple object — a tube you wear on your finger — but the material,
        weight, length, and fit all profoundly affect your tone and playability. Choosing the right
        slide is your first real gear decision as a slide player.
      </p>

      <Card title="Slide Materials">
        <div className="space-y-4 text-sm">
          {[
            {
              material: "Glass",
              color: "text-blue-300",
              tone: "Warm, smooth, sustain-heavy",
              best: "Blues, country, melodic lead lines",
              pros: "Smooth glide, warm tone, great sustain, does not ring harshly on unwanted strings",
              cons: "Can break if dropped. Less projection than metal on loud stages.",
              examples: "Duane Allman used a Coricidin medicine bottle. Many players use dedicated glass slides.",
            },
            {
              material: "Steel / Chrome",
              color: "text-gray-300",
              tone: "Bright, cutting, loud",
              best: "Electric blues, rock, anything that needs to cut through a band",
              pros: "Bright attack, loud, very durable, projects well",
              cons: "Can sound harsh on cheaper guitars. Less warm than glass.",
              examples: "Elmore James favoured steel. Most metal slides are chrome or stainless steel.",
            },
            {
              material: "Brass",
              color: "text-amber-300",
              tone: "Warm and heavy with good sustain",
              best: "Blues, soul, anything needing warmth with more weight than glass",
              pros: "Heavy weight gives natural sustain. Warmer than steel. Durable.",
              cons: "Heavy — can be tiring on the ring finger in long sessions.",
              examples: "Popular with acoustic blues players who want more resonance.",
            },
            {
              material: "Ceramic",
              color: "text-orange-300",
              tone: "Balanced — between glass warmth and steel brightness",
              best: "All-round use, studio work",
              pros: "Balanced tone, moderate weight, smooth glide",
              cons: "Less common, harder to find in shops.",
              examples: "Used by players who want neither the full brightness of steel nor the softness of glass.",
            },
          ].map((s) => (
            <div key={s.material} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <p className={`text-lg font-bold ${s.color}`}>{s.material}</p>
                <span className="text-xs text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
                  {s.tone}
                </span>
              </div>
              <p className="text-purple-300 text-xs mb-1">
                <span className="text-white font-semibold">Best for: </span>{s.best}
              </p>
              <p className="text-green-300 text-xs mb-1">
                <span className="text-white font-semibold">Pros: </span>{s.pros}
              </p>
              <p className="text-amber-300 text-xs mb-1">
                <span className="text-white font-semibold">Cons: </span>{s.cons}
              </p>
              <p className="text-purple-400 text-xs italic">{s.examples}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Size, Weight and Fit">
        <div className="space-y-3 text-sm">
          <div className="border-b border-white/10 pb-3">
            <p className="text-white font-semibold mb-1">Length</p>
            <p className="text-purple-300">
              The slide should comfortably cover all six strings when held straight across the neck.
              Too short and you cannot play full chord barres. Too long and it extends past the low E
              string and feels unwieldy. Most standard slides are around 60–70 mm long.
            </p>
          </div>
          <div className="border-b border-white/10 pb-3">
            <p className="text-white font-semibold mb-1">Weight</p>
            <p className="text-purple-300">
              <strong className="text-white">Heavier = more sustain, but more finger fatigue.</strong>{" "}
              <strong className="text-white">Lighter = easier to control, but less sustain.</strong>{" "}
              Beginners often do better with a medium-weight glass or chrome slide — you get reasonable
              sustain without fighting the weight.
            </p>
          </div>
          <div className="border-b border-white/10 pb-3">
            <p className="text-white font-semibold mb-1">Inner Diameter — The Fit</p>
            <p className="text-purple-300">
              The slide should fit snugly on your finger without wiggling or sliding off — but not so
              tight that it cuts circulation. When you hold your hand up and relax, the slide should
              stay on but you should be able to remove it easily. A loose slide will rattle and kill
              your tone.
            </p>
          </div>
          <div>
            <p className="text-white font-semibold mb-1">Recommendation for Beginners</p>
            <p className="text-purple-300">
              Start with a <strong className="text-white">medium-weight glass slide</strong> or a{" "}
              <strong className="text-white">standard chrome steel tube slide</strong> sized for your
              ring finger. These are widely available, affordable, and give you a balanced starting
              point to learn which direction your tone preferences lean.
            </p>
          </div>
        </div>
      </Card>

      <Card title="Which Finger to Wear It On">
        <div className="space-y-3 text-sm">
          {[
            {
              finger: "Ring Finger (3rd) — Most Common",
              verdict: "Recommended for beginners",
              verdictColor: "text-green-400",
              body: "Wearing the slide on your ring finger leaves your index, middle, and little finger free for fretting behind the slide. This is the most versatile position. Derek Trucks, Duane Allman, and Bonnie Raitt all wear it on the ring finger.",
            },
            {
              finger: "Pinky (4th finger)",
              verdict: "More fret-hand freedom, less stability",
              verdictColor: "text-amber-400",
              body: "Wearing it on the pinky leaves all four fingers free in front of the slide. The downside: the pinky is the weakest finger and controlling the slide with precision requires significant extra practice.",
            },
            {
              finger: "Middle Finger (2nd finger)",
              verdict: "Rare — not recommended to start",
              verdictColor: "text-red-400",
              body: "Wearing it on the middle finger leaves only the index finger free behind the slide — not enough fingers for effective damping and fretting. Used by some country and Hawaiian-influenced players, but a minority approach.",
            },
          ].map((f) => (
            <div key={f.finger} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <p className="text-white font-semibold text-sm">{f.finger}</p>
                <span className={`text-xs font-bold ${f.verdictColor}`}>{f.verdict}</span>
              </div>
              <p className="text-purple-300 text-xs">{f.body}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Guitar Setup for Slide">
        <div className="space-y-3 text-sm">
          <div className="border-b border-white/10 pb-3">
            <p className="text-white font-semibold mb-1">Action Height</p>
            <p className="text-purple-300">
              Slide guitar benefits from{" "}
              <strong className="text-white">higher action</strong> than standard playing. When you
              press a slide lightly on the strings, you need enough string height that the slide does
              not contact the frets and cause buzzing. Many dedicated slide players have a second guitar
              set up specifically for slide with 0.012&quot;+ strings and raised action.
            </p>
          </div>
          <div className="border-b border-white/10 pb-3">
            <p className="text-white font-semibold mb-1">String Gauge</p>
            <p className="text-purple-300">
              Heavier strings vibrate with more authority under the slide. 0.011s or 0.012s are common
              for dedicated slide guitars. If you are using a regular guitar, your existing strings
              will work fine for learning.
            </p>
          </div>
          <div>
            <p className="text-white font-semibold mb-1">Standard vs Open Tuning</p>
            <p className="text-purple-300">
              You can play slide in standard tuning, but{" "}
              <strong className="text-white">open tunings are more natural</strong> because a full
              barre with the slide produces a complete chord. In standard tuning, a full barre does
              not form a clean triad, so you focus on single strings and double stops.
            </p>
          </div>
        </div>
      </Card>

      <Callout type="tip">
        For your first purchase: a{" "}
        <strong className="text-white">Dunlop 215 Pyrex glass slide</strong> or a{" "}
        <strong className="text-white">Dunlop 220 chrome steel slide</strong> costs under $15 and
        will serve you well through months of learning. Tone comes from your hands, not the material.
      </Callout>
    </div>
  )
}

// =============================================================================
// Tab 3 — Technique Fundamentals
// =============================================================================
function TechniqueTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Technique Fundamentals</h2>
      <p className="text-purple-200 mb-6 leading-relaxed">
        Slide technique can be summarised in one sentence: hover the slide directly above the fret
        wire with light pressure and damp everything you are not playing. Everything else — vibrato,
        approach, phrasing — grows from that foundation.
      </p>

      <Callout type="warning">
        <strong>The single most important rule:</strong> The slide must hover{" "}
        <strong>directly above the fret wire</strong>, not between frets as in normal playing. If your
        slide sits even 2 mm behind a fret, the note will be flat. This is the most common beginner
        mistake and it makes everything sound out of tune.
      </Callout>

      <Card title="The Five Pillars of Slide Technique">
        <div className="space-y-5 text-sm">
          {[
            {
              number: "01",
              title: "Intonation — Hover Over the Fret Wire",
              color: "text-purple-400",
              body: "Normal fretting means pressing the string between two frets. Slide means the slide sits directly above the metal fret wire. This aligns the vibrating string length to the correct pitch. If you are flat or sharp on every note, check your slide position first.",
            },
            {
              number: "02",
              title: "Pressure — Light Touch, No Fretboard Contact",
              color: "text-blue-400",
              body: "Rest the slide on the strings. Do not press down to the fretboard. The ideal pressure is just enough to make contact with all the strings you want to sound. Too much pressure creates fret buzz and a harsh, clanking tone.",
            },
            {
              number: "03",
              title: "Angle — Keep the Slide Parallel to the Frets",
              color: "text-green-400",
              body: "The slide must remain parallel to the frets at all times. If it angles, different strings will be at different positions along the neck — some sharp, some flat. Think of the slide as a movable fret.",
            },
            {
              number: "04",
              title: "Fretting-Hand Damping",
              color: "text-amber-400",
              body: "The fingers behind the slide (towards the nut) should rest lightly on the strings. This mutes open-string noise and prevents metallic ringing. Typically the two fingers immediately behind the slide touch the strings without pressing to the fretboard.",
            },
            {
              number: "05",
              title: "Pick-Hand Muting",
              color: "text-red-400",
              body: "Rest the edge of your pick hand (the palm, below the little finger) lightly on the strings near the bridge. This controls sustain and prevents ringing strings you are not actively playing. Together with fretting-hand damping, this gives you a clean, controlled tone.",
            },
          ].map((p) => (
            <div key={p.number} className="flex gap-4">
              <span className={`text-2xl font-black opacity-30 ${p.color} shrink-0 w-8`}>
                {p.number}
              </span>
              <div>
                <p className={`font-bold mb-1 ${p.color}`}>{p.title}</p>
                <p className="text-purple-300">{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Vibrato — The Soul of Slide">
        <p className="text-purple-300 text-sm mb-3">
          Vibrato is what separates a mechanical slide player from an expressive one. Once you land
          on a target note, begin oscillating the slide back and forth along the string — typically
          3–8 mm — at an even, musical speed. This mimics the natural vibrato of a singer or violinist.
        </p>
        <div className="space-y-2 text-sm mb-4">
          {[
            {
              label: "Speed",
              note: "Start slow and controlled. Vary speed for expression — slow wide vibrato sounds mournful; fast narrow vibrato sounds tense.",
            },
            {
              label: "Width",
              note: "A narrow vibrato is subtle and elegant. A wide vibrato is dramatic and expressive. Context determines which is appropriate.",
            },
            {
              label: "Direction",
              note: "Move the slide slightly towards the nut then back towards the bridge. The motion is along the string (lengthwise), not across it.",
            },
            {
              label: "Start time",
              note: "Arrive at the note cleanly, then begin vibrato. Starting vibrato before reaching the target note turns it into an approach slide.",
            },
          ].map((v) => (
            <div key={v.label} className="flex gap-2 text-purple-300">
              <span className="text-purple-400 font-bold shrink-0">{v.label}:</span>
              {v.note}
            </div>
          ))}
        </div>
        <Callout type="exercise">
          Vibrato drill: Place the slide at the 12th fret on the B string. Strike the string and
          immediately begin vibrato. Hold for 8 slow beats, keeping the pitch variation even and
          consistent. Repeat on every string. Do this for 5 minutes every day for the first two weeks.
        </Callout>
      </Card>

      <Card title="Approach Exercises — Standard Tuning">
        <p className="text-purple-300 text-sm mb-4">
          The most natural slide phrasing is to approach a target note by sliding up from 2 frets
          below. This produces the signature slide scoop. Practice this on single strings before
          combining strings.
        </p>

        <TabBlock label="Single string approach — B string (standard tuning). / = slide up, ~ = vibrato">
{`e |------------------------|
B |-/12~---/10~---/7~------|
G |------------------------|
D |------------------------|
A |------------------------|
E |------------------------|

Slide from 2 frets below into each target note.
Hold with vibrato. Listen for clean intonation.`}
        </TabBlock>

        <TabBlock label="Single string descending run with approach — high e string">
{`e |-/15~--/12~--/10~--/7~--|
B |------------------------|
G |------------------------|
D |------------------------|
A |------------------------|
E |------------------------|

Play slowly. Every note approached from 2 frets below.
Target frets: 15, 12, 10, 7 (E minor pentatonic tones).`}
        </TabBlock>

        <TabBlock label="Two-string double stops — G and B strings together">
{`e |------------------|
B |-/12~---/7~--------|
G |-/12~---/7~--------|
D |------------------|
A |------------------|
E |------------------|

Both strings simultaneously. Slide must stay parallel.
Check both strings ring in tune — they should be in unison.`}
        </TabBlock>
      </Card>

      <Card title="Combining Slide with Normal Fretting">
        <p className="text-purple-300 text-sm mb-3">
          One of the most powerful techniques is switching between slide notes and normally fretted
          notes in the same phrase. The slide stays on your ring finger; lift it off the strings and
          use your other fingers normally.
        </p>
        <TabBlock label="Slide note then fretted response — standard tuning (blues in A)">
{`e |---5h7----/12~------5---5--|
B |----------/12~--10--5---5--|
G |----------/12~------5---5--|
D |---------------------------|
A |---------------------------|
E |---------------------------|

First: normal Am pentatonic chord fragment (frets 5)
Then: slide up to 12th fret with vibrato
Then: lift slide, return to fretted response lick
h = hammer-on   / = slide up   ~ = vibrato`}
        </TabBlock>

        <Callout type="tip">
          When switching from slide to normal fretting, tilt the slide so its edge lifts off the
          strings while it remains on your finger — you do not need to remove it entirely. Practice
          this switch until it becomes invisible in your playing.
        </Callout>
      </Card>
    </div>
  )
}

// =============================================================================
// Tab 4 — Open G Tuning
// =============================================================================
function OpenGTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Open G Tuning (DGDGBD)</h2>
      <p className="text-purple-200 mb-4 leading-relaxed">
        Open G is the classic slide tuning. From Robert Johnson to Keith Richards, from Ry Cooder
        to Derek Trucks, Open G has produced more iconic slide moments than any other tuning. The
        entire neck becomes a set of I-IV-V chord positions — exactly what blues needs.
      </p>

      <div className="bg-white/10 border-l-4 border-purple-500 rounded-xl p-5 mb-6">
        <h3 className="text-xl font-bold text-white mb-1">Open G Tuning</h3>
        <p className="text-purple-200 text-sm mb-4">Low to high: D · G · D · G · B · D</p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Low E → D", changed: true },
            { label: "A → G",     changed: true },
            { label: "D stays",   changed: false },
            { label: "G stays",   changed: false },
            { label: "B stays",   changed: false },
            { label: "e → D",     changed: true },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div
                className={`px-3 py-1.5 rounded-lg text-sm font-bold ${
                  s.changed ? "bg-amber-500 text-black" : "bg-white/15 text-white"
                }`}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
        <p className="text-purple-300 text-xs mt-3">Amber = strings that change from standard tuning</p>
      </div>

      <Callout type="insight">
        In Open G, strumming all open strings plays a G major chord. A barre at fret 5 = C major (IV),
        fret 7 = D major (V), fret 12 = G major (I) one octave up. Your entire I-IV-V blues vocabulary
        is three positions on the neck.
      </Callout>

      <Card title="Chord Map — Open G Tuning">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-purple-400 font-bold pb-2 pr-4">Fret</th>
                <th className="text-purple-400 font-bold pb-2 pr-4">Chord (Key of G)</th>
                <th className="text-purple-400 font-bold pb-2">Function</th>
              </tr>
            </thead>
            <tbody className="text-purple-300">
              {[
                ["Open (0)", "G Major",  "I — Tonic"],
                ["Fret 2",   "A Major",  "II"],
                ["Fret 3",   "Bb Major", "bIII — blues tonality"],
                ["Fret 5",   "C Major",  "IV — Subdominant"],
                ["Fret 7",   "D Major",  "V — Dominant"],
                ["Fret 10",  "F Major",  "bVII — blues tonality"],
                ["Fret 12",  "G Major",  "I — Octave"],
              ].map(([fret, chord, fn]) => (
                <tr key={fret} className="border-b border-white/5">
                  <td className="py-1.5 pr-4 font-mono text-white">{fret}</td>
                  <td className="py-1.5 pr-4">{chord}</td>
                  <td className="py-1.5 text-xs text-purple-400">{fn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Basic I-IV-V Slide Blues — Open G">
        <p className="text-purple-300 text-sm mb-3">
          This is the foundation. The slide barres all 6 strings at each chord position. Start slow
          and focus on landing exactly on the fret wire at each position.
        </p>
        <TabBlock label="12-bar blues pattern in G — full barre slides (Open G tuning: D G D G B D)">
{`Chord positions:
  I  = open (0) or fret 12
  IV = fret 5
  V  = fret 7

12-bar structure:
| I  | I  | I  | I  |
| IV | IV | I  | I  |
| V  | IV | I  | V  |

Single-bar riff (I chord area):
D |-0--------/5--5--/7--7--/5--|
G |-0--------/5--5--/7--7--/5--|
D |-0--------/5--5--/7--7--/5--|
G |-0--------/5--5--/7--7--/5--|
B |-0--------/5--5--/7--7--/5--|
D |-0--------/5--5--/7--7--/5--|

0  = open strings (G chord)
/5 = slide to 5th fret (C chord)
/7 = slide to 7th fret (D chord)
~  = vibrato on each held chord position`}
        </TabBlock>
      </Card>

      <Card title="Robert Johnson Style Lick — Open G">
        <p className="text-purple-300 text-sm mb-3">
          This figure captures the Delta Blues essence: a descending slide line off the 12th fret
          (I chord), with open string ring and a V-to-I resolution. Play slowly and let the open
          strings ring after the slide leaves them.
        </p>
        <TabBlock label="Robert Johnson 'Crossroads' style — Open G tuning (DGDGBD)">
{`D |-/12~----10-----0-----------|
G |-/12~----10-----0-----------|
D |-/12~-----------0-----------|
G |-/12~-----------0-----------|
B |---------------------0------|
D |---------------------0------|

Start at 12th fret (I chord barre) with vibrato.
Glide down to 10th fret, then lift the slide.
Let open strings ring — they are the G major (I) chord.
/12 = slide up to 12  ~ = vibrato  then glide to 10 then off`}
        </TabBlock>
      </Card>

      <Card title="Classic Descending Run — Open G">
        <p className="text-purple-300 text-sm mb-3">
          The most useful melodic pattern in Open G: a slide run descending the high strings from the
          I chord (12th fret) down through the pentatonic scale to the open strings. Ry Cooder uses
          variations of this constantly.
        </p>
        <TabBlock label="Descending Open G run — top three strings (high D, B, G of tuning)">
{`  D  B  G   (top three strings)

D |-/12--10--8--5--3--0--|
B |-/12--10--8--5--3--0--|
G |-/12--10--8--5--3--0--|

Full barre at each position, gliding smoothly between them.
Let open strings ring at the end — they are the I chord.

Positions:
  12 = G  (I octave)
  10 = F  (bVII, blues tone)
   8 = Eb (chromatic passing tone)
   5 = C  (IV)
   3 = Bb (bIII, blues tone)
   0 = G  (I open)`}
        </TabBlock>
      </Card>

      <Card title="Keith Richards Rhythm Style — Open G">
        <p className="text-purple-300 text-sm mb-3">
          Keith Richards removes the low D string and plays Open G on only 5 strings. This is how
          he plays &quot;Brown Sugar&quot;, &quot;Honky Tonk Women&quot;, and dozens of Stones
          classics — without a slide. The open tuning creates naturally ringing voicings impossible
          in standard tuning.
        </p>
        <TabBlock label="Keith Richards 5-string Open G riff (low D string removed or muted)">
{`(low D string muted or removed)
G |-0---0---0---0---0---|
D |-0---0---0---0---0---|
G |-0---5---4---5---0---|
B |-0---5---3---5---0---|
D |-0---5---3---5---0---|

Open G (0) → fret 5 (C) → fret 3/4 run → back to open
No slide required — the open tuning creates the magic.
These voicings simply do not exist in standard tuning.`}
        </TabBlock>
      </Card>
    </div>
  )
}

// =============================================================================
// Tab 5 — Open D Tuning
// =============================================================================
function OpenDTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Open D Tuning (DADF#AD)</h2>
      <p className="text-purple-200 mb-4 leading-relaxed">
        Open D is the darker, more resonant cousin of Open G. It has a deeper, earthier quality —
        particularly on acoustic guitar — that makes it the tuning of choice for Delta Blues and
        Piedmont styles. Elmore James built his entire electric style on it; Derek Trucks took it
        into jazz and Indian music.
      </p>

      <div className="bg-white/10 border-l-4 border-amber-500 rounded-xl p-5 mb-6">
        <h3 className="text-xl font-bold text-white mb-1">Open D Tuning</h3>
        <p className="text-purple-200 text-sm mb-4">Low to high: D · A · D · F# · A · D</p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Low E → D", changed: true },
            { label: "A stays",   changed: false },
            { label: "D stays",   changed: false },
            { label: "G → F#",    changed: true },
            { label: "B → A",     changed: true },
            { label: "e → D",     changed: true },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div
                className={`px-3 py-1.5 rounded-lg text-sm font-bold ${
                  s.changed ? "bg-amber-500 text-black" : "bg-white/15 text-white"
                }`}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
        <p className="text-purple-300 text-xs mt-3">Amber = strings that change from standard tuning</p>
      </div>

      <Card title="Chord Map — Open D Tuning">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-purple-400 font-bold pb-2 pr-4">Fret</th>
                <th className="text-purple-400 font-bold pb-2 pr-4">Chord (Key of D)</th>
                <th className="text-purple-400 font-bold pb-2">Function</th>
              </tr>
            </thead>
            <tbody className="text-purple-300">
              {[
                ["Open (0)", "D Major", "I — Tonic"],
                ["Fret 2",   "E Major", "II"],
                ["Fret 3",   "F Major", "bIII — blues"],
                ["Fret 5",   "G Major", "IV — Subdominant"],
                ["Fret 7",   "A Major", "V — Dominant"],
                ["Fret 9",   "B Major", "VI"],
                ["Fret 10",  "C Major", "bVII — blues"],
                ["Fret 12",  "D Major", "I — Octave"],
              ].map(([fret, chord, fn]) => (
                <tr key={fret} className="border-b border-white/5">
                  <td className="py-1.5 pr-4 font-mono text-white">{fret}</td>
                  <td className="py-1.5 pr-4">{chord}</td>
                  <td className="py-1.5 text-xs text-purple-400">{fn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Elmore James Style — Dust My Broom Inspired Riff">
        <p className="text-purple-300 text-sm mb-3">
          The &quot;Dust My Broom&quot; intro by Elmore James is quite possibly the most copied slide
          riff in history. An aggressive, ascending attack figure in Open D — staccato and driving.
          This is electric Delta Blues at its most powerful.
        </p>
        <TabBlock label="Dust My Broom inspired riff — Open D tuning (DADF#AD). Pick aggressively.">
{`D |-0--0--0--/12-12-/12-10----|
A |-0--0--0--/12-12-/12-10----|
D |-0--0--0--/12-12-/12-10----|
F#|-0--0--0--/12-12-/12-10----|
A |-0--0--0--/12-12-/12-10----|
D |-0--0--0--/12-12-/12-10----|

Open chord (0) attacked three times, then slam to 12th fret,
repeat, then pull back to 10th. I chord (D) at top octave.

Full pattern resolves:
D |-/12-12-10-12---/7~----/5~--0--|
  12 = D (I octave)  7 = A (V)  5 = G (IV)  0 = D (I open)`}
        </TabBlock>
      </Card>

      <Card title="Derek Trucks Approach — Melodic Single-String Lines">
        <p className="text-purple-300 text-sm mb-3">
          Derek Trucks constructs long, weaving melodic lines across individual strings — lines as
          much Charlie Parker and Ravi Shankar as Elmore James. In Open D, his single-string approach
          creates a sitar-like cascading quality.
        </p>
        <TabBlock label="Derek Trucks inspired melodic line — Open D (high D string and A string)">
{`D |-/12~--10--/12~--10--8--/7~--5--3--0--|
A |---------------------------------------|
D |---------------------------------------|
F#|---------------------------------------|
A |---------------------------------------|
D |---------------------------------------|

Each note approached from below or held with vibrato.
The line moves through D major scale tones over the I chord.
Think: singing a melody, not playing a lick.

Two-string harmonised variation:
D |-/12~---------/10~-------/7~-----|
A |----------/10~------/7~------/5~--|`}
        </TabBlock>
      </Card>

      <Card title="DADGAD vs Open D — Brief Comparison">
        <div className="grid sm:grid-cols-2 gap-3 text-sm mb-3">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3">
            <p className="text-white font-bold mb-1">Open D (DADF#AD)</p>
            <p className="text-purple-300 text-xs">
              Strums a complete D major chord open. The F# gives it a bright, major third quality.
              Perfect for slide — a full barre produces a complete major chord at any position.
              Classic Delta and electric blues tuning.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-3">
            <p className="text-white font-bold mb-1">DADGAD</p>
            <p className="text-purple-300 text-xs">
              Open strings form a D sus4 chord — ambiguous, neither major nor minor. Great for Celtic
              folk, Jimmy Page, and atmospheric acoustic work, but less ideal for slide because the
              open chord is not a clean major triad.
            </p>
          </div>
        </div>
        <Callout type="tip">
          For slide guitar, choose Open D over DADGAD. For Celtic folk, ambient playing, or Led
          Zeppelin exploration, choose DADGAD. They serve different musical purposes.
        </Callout>
      </Card>

      <Card title="12-Bar Blues in Open D">
        <TabBlock label="Simple 12-bar slide blues in D — Open D tuning">
{`Chord positions: I = open (0), IV = 5th fret, V = 7th fret

| D (0) | D (0) | D (0) | D (0) |
| G (5) | G (5) | D (0) | D (0) |
| A (7) | G (5) | D (0) | A (7) |

Each chord: barre all 6 strings at the indicated fret.
Add approach slides (/5, /7) and vibrato (~) on each chord.

Turnaround lick (bars 11-12):
D |-/12~--10--/7~--/5~--/7~--0--|`}
        </TabBlock>
      </Card>
    </div>
  )
}

// =============================================================================
// Tab 6 — Standard Tuning Slide
// =============================================================================
function StandardTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Standard Tuning Slide</h2>
      <p className="text-purple-200 mb-4 leading-relaxed">
        You do not need to retune to play slide. Standard tuning offers a different but equally valid
        world for slide playing — one focused on single-note melodic lines, double stops, and
        pentatonic-based vocabulary rather than full barre chords.
      </p>

      <Callout type="insight">
        In standard tuning, a full barre with the slide does not produce a clean chord. Standard-tuning
        slide players therefore focus on{" "}
        <strong className="text-white">individual strings and double stops</strong>, treating the slide
        as a melodic lead tool rather than a chord tool. This is how David Gilmour and Ry Cooder use it.
      </Callout>

      <Card title="Why Play Slide in Standard Tuning?">
        <div className="space-y-2 text-sm">
          {[
            {
              pro: "No retuning required",
              detail: "Pick up any guitar and play. Great for adding slide licks in a set without a dedicated slide guitar.",
            },
            {
              pro: "Works with your existing chord knowledge",
              detail: "You already know where notes are. The slide becomes a new way to reach them.",
            },
            {
              pro: "Pentatonic vocabulary transfers directly",
              detail: "If you know the minor pentatonic boxes, you can immediately apply slide to those same positions.",
            },
            {
              pro: "Great for country and pedal steel-inspired lines",
              detail: "Pedal steel is essentially chromatic slide in a modified tuning — those licks translate beautifully.",
            },
            {
              pro: "Natural combination with normal fretting",
              detail: "You are already in standard, so switching between slide and fretted phrases in the same solo is effortless.",
            },
          ].map((item, i) => (
            <div key={i} className="flex gap-2 text-purple-300 border-b border-white/5 pb-2">
              <span className="text-purple-400 font-bold shrink-0">+</span>
              <div>
                <span className="text-white font-semibold">{item.pro}: </span>
                {item.detail}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="E Minor Pentatonic with Slide — Standard Tuning">
        <p className="text-purple-300 text-sm mb-3">
          The most accessible starting point for standard-tuning slide: take the E minor pentatonic
          scale box at the 12th fret and apply slide approaches to every note. Slide up from 2 frets
          below into each target, hold with vibrato.
        </p>

        <TabBlock label="E minor pentatonic — 12th position — slide approach on each note">
{`e |---/15~---/12~--------------------|
B |----------/15~---/13~-------------|
G |------------------/14~---/12~-----|
D |---------------------------/14~---|
A |----------------------------------|
E |----------------------------------|

Scale tones at 12th position:
  e string: frets 15, 12
  B string: frets 15, 13
  G string: frets 14, 12
  D string: fret  14, 12

Each: /XX = slide up from 2 frets below.  ~ = hold with vibrato.`}
        </TabBlock>

        <TabBlock label="Single string descending melodic line — high e string">
{`e |-/15~---15-13-/12~---12----|
B |--------------------------------|
G |--------------------------------|
D |--------------------------------|
A |--------------------------------|
E |--------------------------------|

Stay on one string. Glide between positions.
Land on 12 (root E) with sustained wide vibrato.`}
        </TabBlock>
      </Card>

      <Card title="Blues Lick in Standard Tuning — 5th Position">
        <p className="text-purple-300 text-sm mb-3">
          Standard tuning slide works especially well in the 5th position pentatonic box. A classic
          blues phrase in the key of A, combining slide and normal fretting.
        </p>
        <TabBlock label="A blues lick — standard tuning, 5th position. Normal fretting + slide.">
{`e |---5h7----/7~---------5---5--|
B |----------/8~--6--5---5---5--|
G |----------/7~---------6---6--|
D |-----------------------------7|
A |-----------------------------|
E |-----------------------------|

h = hammer-on (normal fret technique)
/7, /8, /7 = slide approach to those frets
After slide notes: lift slide, return to normal fretting.
The contrast between slide and fretted notes is the point.`}
        </TabBlock>

        <TabBlock label="Pedal steel inspired country lick — standard tuning, key of G">
{`e |-/12~---/10--9--7------------|
B |-/12~---/10--9--8------------|
G |-----------------------------|
D |-----------------------------|
A |-----------------------------|
E |-----------------------------|

Two strings (e and B) together, moving in parallel thirds.
This is the pedal steel concept: two strings gliding in harmony.
Arrive at 12 together, then step down through the scale.`}
        </TabBlock>
      </Card>

      <Card title="David Gilmour Approach — Standard Tuning Slide">
        <p className="text-purple-300 text-sm mb-3">
          David Gilmour uses slide primarily as a colouring device — a way to add texture and sustain
          to notes within a solo. His approach is minimal, slow, and intensely emotional. The vibrato
          is wide and deliberate. Less is always more.
        </p>
        <TabBlock label="Gilmour-style sustained slide phrase — standard tuning, key of D (12th area)">
{`e |-/14~~~~~~~~~~~~~~~~~|
B |-/14~~~~~~~~~~~~~~~~~|
G |--------------------|
D |--------------------|
A |--------------------|
E |--------------------|

Two strings in unison at the 14th fret (F# — major third of D).
Slide up slowly from 12. Hold for 4+ beats with wide vibrato.
The sustain and vibrato do all the work. Less is more.

Variation — resolving down:
e |-/14~~~~~---/12~~~~~---/10~~~~~--|
B |---------------------------------|`}
        </TabBlock>

        <Callout type="tip">
          Gilmour treats the slide as a way to produce a sound like a human voice or a cello. The
          goal is not speed or technique — it is{" "}
          <strong className="text-white">pure sustained expression</strong>. If your lick sounds
          busy or fast, you are not thinking like Gilmour.
        </Callout>
      </Card>

      <Card title="Double-Stop Slide — Standard Tuning">
        <p className="text-purple-300 text-sm mb-3">
          Sliding two strings together in parallel creates rich harmonic movement. The top two strings
          (B and e) work particularly well in the 7th–12th position area in standard tuning.
        </p>
        <TabBlock label="Double-stop slide — standard tuning, key of E. Top two strings.">
{`e |-/12~--/9~--/7~--/9~--|
B |-/12~--/9~--/7~--/9~--|
G |----------------------|
D |----------------------|
A |----------------------|
E |----------------------|

Parallel movement: both strings glide together.
  12 = E chord fragment (root + 4th on top strings)
   9 = C# area (major VI)
   7 = B  (dominant V)
Movement: I - VI - V - VI. Classic rock slide cycle.`}
        </TabBlock>
      </Card>
    </div>
  )
}

// =============================================================================
// Tab 7 — Practice & Songs
// =============================================================================
function PracticeTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Practice Approach &amp; Famous Songs</h2>
      <p className="text-purple-200 mb-6 leading-relaxed">
        Slide guitar rewards focused, patient practice. Because intonation and vibrato are the two
        hardest skills — and the most audible when wrong — the early weeks should be almost entirely
        dedicated to those two things on a single string before moving to chords or multi-string work.
      </p>

      <Callout type="insight">
        The mental shift required for slide is significant:{" "}
        <strong className="text-white">stop thinking in frets, start thinking in pitch.</strong>{" "}
        Stop thinking &quot;I need to be at fret 7&quot; and start thinking &quot;I need to hear
        an A&quot;. Your ear must guide the slide, not your visual reference. This is the difference
        between a slide player and a guitarist who happens to own a slide.
      </Callout>

      <Card title="The 10-Minute Daily Start Routine">
        <p className="text-purple-300 text-sm mb-3">
          Before any song work, always spend 10 minutes on this routine. It is never wasted time —
          even professionals do it.
        </p>
        <div className="space-y-3 text-sm">
          {[
            {
              time: "0–3 min",
              focus: "Intonation — single string, slow",
              detail: "Play individual notes on the B string. Strike, slide to a target fret, stop. Is it in tune? No vibrato yet. Just stopping cleanly on pitch. Use a tuner to verify.",
            },
            {
              time: "3–6 min",
              focus: "Vibrato — one note, held",
              detail: "Strike a note, land cleanly on pitch, then begin vibrato. Hold for 8 beats. The vibrato should be even on both sides of the pitch. Repeat on different strings.",
            },
            {
              time: "6–8 min",
              focus: "Approach slides",
              detail: "From 2 frets below, slide into target notes across the neck. Focus on landing exactly on the fret wire. 3–4 different positions per string.",
            },
            {
              time: "8–10 min",
              focus: "Damping focus",
              detail: "Play any lick, but focus entirely on clean tone — are the strings you are not playing silent? Adjust both fretting-hand and pick-hand muting.",
            },
          ].map((r) => (
            <div key={r.time} className="bg-white/5 border border-white/10 rounded-xl p-3 flex gap-3">
              <span className="text-purple-400 font-mono text-xs shrink-0 pt-0.5 w-12">{r.time}</span>
              <div>
                <p className="text-white font-semibold text-sm mb-0.5">{r.focus}</p>
                <p className="text-purple-300 text-xs">{r.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="4-Week Beginner Progression">
        <div className="space-y-3 text-sm">
          {[
            {
              week: "Week 1",
              theme: "Single String Intonation",
              color: "border-purple-500",
              goals: [
                "Play every note on the B string from fret 5 to 12 using the slide, one at a time",
                "Use a tuner — every note should be within 5 cents of correct pitch",
                "No vibrato yet. Stop cleanly. Listen. Adjust.",
                "Learn to land on the fret wire consistently without looking",
              ],
            },
            {
              week: "Week 2",
              theme: "Vibrato Development",
              color: "border-blue-500",
              goals: [
                "Apply vibrato to every held note from Week 1",
                "Practice slow wide vibrato for 4 beats, then fast narrow for 4 beats",
                "Record yourself — vibrato sounds very different than it feels",
                "Add the single-string approach exercise from the Technique tab",
              ],
            },
            {
              week: "Week 3",
              theme: "Open G Chord Barres",
              color: "border-amber-500",
              goals: [
                "Learn I, IV, V positions in Open G (frets 0/12, 5, 7)",
                "Slide smoothly between all three chord positions",
                "Add approach slides to each chord change (/5, /7)",
                "Play a slow 12-bar blues using only chord barres",
              ],
            },
            {
              week: "Week 4",
              theme: "Simple 12-Bar Blues",
              color: "border-green-500",
              goals: [
                "Play the full 12-bar blues in Open G at a comfortable tempo",
                "Add a simple turnaround lick at the end of each chorus",
                "Begin mixing melodic slide lines with chord barres",
                "Record a full 12-bar performance and listen back critically",
              ],
            },
          ].map((w) => (
            <div key={w.week} className={`border-l-4 ${w.color} bg-white/5 rounded-r-xl p-4`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-white font-bold">{w.week}</span>
                <span className="text-purple-400 text-sm">— {w.theme}</span>
              </div>
              <ul className="space-y-1">
                {w.goals.map((g, i) => (
                  <li key={i} className="text-purple-300 text-xs flex gap-2">
                    <span className="text-purple-500 shrink-0">•</span>
                    {g}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Songs to Learn — Beginner to Intermediate">
        <div className="space-y-3 text-sm">
          {[
            {
              song: "Seven Nation Army",
              artist: "The White Stripes",
              tuning: "Open A",
              difficulty: "Beginner",
              diffColor: "text-green-400",
              note: "The most accessible entry point. Simple repeating riff, immediately satisfying, iconic sound. Proof that gear does not matter.",
            },
            {
              song: "Dust My Broom",
              artist: "Elmore James",
              tuning: "Open D or Open E",
              difficulty: "Beginner–Intermediate",
              diffColor: "text-green-400",
              note: "The definitive Delta Blues slide song. The intro riff is approachable once you know the Open D positions. Essential for every slide student.",
            },
            {
              song: "In My Time of Dying",
              artist: "Led Zeppelin",
              tuning: "Open G",
              difficulty: "Intermediate",
              diffColor: "text-amber-400",
              note: "Jimmy Page&apos;s arrangement is ferocious and driving. Great bridge between blues and rock slide vocabulary.",
            },
            {
              song: "Statesboro Blues",
              artist: "Allman Brothers Band",
              tuning: "Open E",
              difficulty: "Intermediate",
              diffColor: "text-amber-400",
              note: "Duane Allman at his most accessible. The intro lick and verse slide work are learnable after 4–6 weeks of practice. The definitive Southern rock slide reference.",
            },
            {
              song: "Little Wing (slide sections)",
              artist: "Jimi Hendrix / Stevie Ray Vaughan",
              tuning: "Standard",
              difficulty: "Intermediate",
              diffColor: "text-amber-400",
              note: "Brief slide moments within a standard-tuned song. Great for learning to insert slide as a colour without changing tuning.",
            },
            {
              song: "Need Your Love So Bad",
              artist: "Fleetwood Mac / Peter Green",
              tuning: "Standard or Open",
              difficulty: "Intermediate",
              diffColor: "text-amber-400",
              note: "Peter Green&apos;s version is devastatingly beautiful. The sustained, vocal slide phrasing is a masterclass in vibrato and space. Study this for expression, not speed.",
            },
          ].map((s) => (
            <div key={s.song} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                <div>
                  <p className="text-white font-bold">{s.song}</p>
                  <p className="text-purple-400 text-xs">{s.artist}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-bold ${s.diffColor}`}>{s.difficulty}</span>
                  <p className="text-purple-400 text-xs">{s.tuning}</p>
                </div>
              </div>
              <p className="text-purple-300 text-xs mt-1">{s.note}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Gear Recommendations">
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-white font-bold mb-2">Electric Slide Setup</p>
            <ul className="space-y-1 text-purple-300 text-xs">
              {[
                "Clean amp tone with slight natural breakup — avoid heavy distortion",
                "A compressor pedal (before drive) to even out dynamics and add sustain",
                "Reverb — even a small room reverb opens the sound significantly",
                "Higher action: raise nut slots and saddle height slightly",
                "0.011–0.013 string gauge for better sustain under the slide",
                "Strat or semi-hollow body respond beautifully to slide technique",
              ].map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-purple-500 shrink-0">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-white font-bold mb-2">Acoustic Slide Setup</p>
            <ul className="space-y-1 text-purple-300 text-xs">
              {[
                "A glass slide gives the best acoustic tone — warm and not harsh",
                "A resonator (Dobro or National) amplifies naturally and sustains beautifully",
                "Raise the nut for higher action on a standard acoustic",
                "0.012–0.013 strings minimum — lighter strings lack presence under the slide",
                "Record yourself with a phone mic to hear room tone accurately",
                "A small reflective room adds natural reverb to your acoustic slide sound",
              ].map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-purple-500 shrink-0">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      <Card title="The Mental Shift — Thinking in Pitch, Not Frets">
        <p className="text-purple-300 text-sm mb-3">
          Every other guitar technique relies on the frets to guarantee pitch. Slide removes that
          safety net entirely. The fret positions are a guide — but the slide can sit anywhere, and
          your ear is the only reliable judge.
        </p>
        <div className="space-y-3 text-sm">
          {[
            {
              title: "Sing the note before you play it",
              body: "Hear the target pitch in your head first. Then move the slide to produce it. This is the most effective way to train your ear-to-hand connection.",
            },
            {
              title: "Use a drone",
              body: "Play an open string as a drone and improvise slide lines over it. Your ear will immediately tell you when the slide is in tune — the notes ring harmonically rather than clash.",
            },
            {
              title: "Slow down dramatically",
              body: "Slide at 40 BPM played cleanly sounds better than slide at 120 played out of tune. Speed is irrelevant until intonation is reliable.",
            },
            {
              title: "Listen to vocal music",
              body: "Slide guitar is a vocal instrument. Listening to great singers — Otis Redding, Etta James, Ray Charles — will give you the phrasing vocabulary that slide playing needs. Guitarists who sound best on slide invariably listen to a lot of vocals.",
            },
          ].map((item, i) => (
            <div key={i} className="border-b border-white/10 pb-3 last:border-0 last:pb-0">
              <p className="text-white font-semibold text-sm mb-0.5">{item.title}</p>
              <p className="text-purple-300 text-xs">{item.body}</p>
            </div>
          ))}
        </div>
      </Card>

      <Callout type="exercise">
        The most important practice exercise at any level: record yourself playing a 12-bar blues in
        Open G, listen back, and identify the three worst moments. Fix those three things specifically
        in the next session. Repeat every week. After one month, you will not recognise your own playing.
      </Callout>
    </div>
  )
}

// =============================================================================
// Main Page Component
// =============================================================================
export default function SlideGuitarPage() {
  const [activeTab, setActiveTab] = useState<Tab>("what-is-slide")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-purple-300 hover:text-white text-sm mb-6 transition-colors"
        >
          <span>&#8592;</span> Back to modules
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">Slide Guitar</h1>
          <p className="text-purple-300 text-sm sm:text-base">
            From Delta Blues to rock and soul — master the bottleneck technique, open tunings,
            intonation, vibrato, and the art of making a guitar sing like a human voice.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === t.id
                  ? "bg-purple-600 text-white"
                  : "bg-white/10 text-purple-300 hover:bg-white/20"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
          {activeTab === "what-is-slide" && <WhatIsSlideTab />}
          {activeTab === "the-slide"     && <TheSlideTab />}
          {activeTab === "technique"     && <TechniqueTab />}
          {activeTab === "open-g"        && <OpenGTab />}
          {activeTab === "open-d"        && <OpenDTab />}
          {activeTab === "standard"      && <StandardTab />}
          {activeTab === "practice"      && <PracticeTab />}
        </div>
      </div>
    </div>
  )
}
