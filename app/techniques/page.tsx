"use client";

import { useState } from "react";
import Link from "next/link";

type TabId = "bends" | "vibrato" | "slides" | "legato" | "muting" | "workout";

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "bends",   label: "Bends",   icon: "↑" },
  { id: "vibrato", label: "Vibrato", icon: "~" },
  { id: "slides",  label: "Slides",  icon: "/" },
  { id: "legato",  label: "Legato",  icon: "h" },
  { id: "muting",  label: "Muting",  icon: "x" },
  { id: "workout", label: "Workout", icon: "⏱" },
];

function TipBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-purple-600/20 border border-purple-400/40 rounded-xl p-4 text-purple-200 text-sm">
      {children}
    </div>
  );
}

function MistakeBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-red-500/10 border border-red-400/30 rounded-xl p-4 text-red-200 text-sm">
      <span className="font-semibold text-red-300">Common mistake: </span>
      {children}
    </div>
  );
}

function WhyBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-amber-500/10 border border-amber-400/30 rounded-xl p-4 text-amber-200 text-sm">
      <span className="font-semibold text-amber-300">Why it matters: </span>
      {children}
    </div>
  );
}

function TabBlock({ lines, label }: { lines: string[]; label?: string }) {
  return (
    <div className="my-4">
      {label && (
        <p className="text-purple-300 text-xs uppercase tracking-wider mb-2 font-semibold">
          {label}
        </p>
      )}
      <pre className="bg-slate-900/80 border border-white/10 rounded-xl p-4 text-green-300 text-sm font-mono overflow-x-auto leading-relaxed">
        {lines.join("\n")}
      </pre>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xl font-bold text-white mt-8 mb-3">{children}</h3>
  );
}

function BodyText({ children }: { children: React.ReactNode }) {
  return <p className="text-purple-100 leading-relaxed mb-3">{children}</p>;
}

function BendsTab() {
  return (
    <div>
      <WhyBox>
        A well-executed bend is one of the most expressive things a guitarist can
        do. It turns a note into a voice — giving you the power to cry, wail, and
        scream through six strings. Every blues, rock, and country solo lives and
        dies on the quality of its bends.
      </WhyBox>

      <SectionTitle>What Is a Bend?</SectionTitle>
      <BodyText>
        A bend means pushing (or pulling) the string sideways across the fretboard
        to increase its tension — which raises the pitch. You fret a note, then
        physically move the string toward the adjacent string, stretching it until
        it reaches your target pitch.
      </BodyText>

      <SectionTitle>Bend Types</SectionTitle>
      <ul className="text-purple-100 space-y-2 mb-4 list-none">
        <li className="bg-white/5 rounded-xl p-3">
          <span className="font-semibold text-white">Half-step bend</span> — raise
          the pitch by 1 fret. Notation:{" "}
          <code className="text-green-300 bg-slate-800 px-1 rounded">7b(8)</code>
        </li>
        <li className="bg-white/5 rounded-xl p-3">
          <span className="font-semibold text-white">Whole-step bend</span> — raise
          the pitch by 2 frets. The most common bend in blues and rock. Notation:{" "}
          <code className="text-green-300 bg-slate-800 px-1 rounded">7b(9)</code>
        </li>
        <li className="bg-white/5 rounded-xl p-3">
          <span className="font-semibold text-white">Pre-bend</span> — silently
          bend the string to pitch before picking. Dramatic effect.
        </li>
        <li className="bg-white/5 rounded-xl p-3">
          <span className="font-semibold text-white">Bend and release</span> — bend
          up to pitch, then release back to the original note. Creates a rise-and-fall gesture.
        </li>
      </ul>

      <SectionTitle>How to Execute a Bend</SectionTitle>
      <BodyText>
        Place your ring finger on the note. Stack your middle and index fingers
        directly behind it on the same string — all three fingers press down
        together. Now rotate your wrist (not just your fingers) to push the string
        upward. The power comes from your entire hand and wrist, not just the tip of one finger.
      </BodyText>

      <SectionTitle>Bending in Tune</SectionTitle>
      <BodyText>
        Before you bend, fret the target note first to hear what pitch you are
        aiming for. Then come back to the bend note and match that pitch exactly.
        A flat bend sounds sad and out of tune — and not in a good way.
      </BodyText>

      <SectionTitle>Exercises</SectionTitle>

      <TabBlock
        label="Exercise 1 — Half-step bend (G string, fret 7 → sounds like fret 8)"
        lines={[
          "e|-------------|",
          "B|-------------|",
          "G|---7b(8)-----|",
          "D|-------------|",
          "A|-------------|",
          "E|-------------|",
        ]}
      />
      <BodyText>
        Pick fret 8 first to hear the target. Come back to fret 7 and push the
        string up until it matches. Repeat 10 times, checking intonation each rep.
      </BodyText>

      <TabBlock
        label="Exercise 2 — Whole-step bend (the blues money shot)"
        lines={[
          "e|-------------|",
          "B|-------------|",
          "G|---7b(9)-----|",
          "D|-------------|",
          "A|-------------|",
          "E|-------------|",
        ]}
      />
      <BodyText>
        Fret 7 on the G string, pushed up two frets in pitch. The defining sound
        of virtually every blues solo ever recorded.
      </BodyText>

      <TabBlock
        label="Exercise 3 — Bend and release"
        lines={[
          "e|-----------------|",
          "B|-----------------|",
          "G|---7b(9)--7------|",
          "D|-----------------|",
          "A|-----------------|",
          "E|-----------------|",
        ]}
      />
      <BodyText>
        Bend up to pitch, hold it for a beat, then slowly release back to fret 7.
        The release should be controlled and even — not a snap.
      </BodyText>

      <TabBlock
        label="Exercise 4 — Blues bend phrase"
        lines={[
          "e|---------------------|",
          "B|--8b(10)---8---5-----|",
          "G|------------------7--|",
          "D|---------------------|",
          "A|---------------------|",
          "E|---------------------|",
        ]}
      />
      <BodyText>
        A complete musical phrase. Bend fret 8 on the B string up a whole step,
        resolve down to 8, then 5, then finish on fret 7 of the G. A question and an answer.
      </BodyText>

      <TipBox>
        <strong>Pro tip:</strong> Always check your bend against the target pitch
        before practicing. Muscle memory for a flat bend is worse than no muscle
        memory at all.
      </TipBox>
      <div className="mt-3">
        <MistakeBox>
          Under-bending. Most beginners only get 60–70% of the way there. Push
          through until it feels almost too far — that is where the pitch lives.
        </MistakeBox>
      </div>
    </div>
  );
}

function VibratoTab() {
  return (
    <div>
      <WhyBox>
        Vibrato is the difference between a note and a voice. Without it, sustained
        notes sound static and lifeless. B.B. King&apos;s vibrato was so distinctive
        it was his entire identity. Yours can be too — if you practice it intentionally.
      </WhyBox>

      <SectionTitle>What Is Vibrato?</SectionTitle>
      <BodyText>
        Vibrato is a rapid, controlled oscillation of pitch created by repeatedly
        bending a note slightly sharp and releasing it back to pitch. It is not
        randomly wobbling the string — it is a metrically-controlled pulsation
        that adds expressiveness to sustained notes.
      </BodyText>

      <SectionTitle>Two Styles of Vibrato</SectionTitle>
      <ul className="text-purple-100 space-y-2 mb-4 list-none">
        <li className="bg-white/5 rounded-xl p-3">
          <span className="font-semibold text-white">B.B. King wrist vibrato</span>{" "}
          — The fretting hand rocks the wrist back and forth while keeping the
          fingertip anchored on the string. Motion comes from rotating the forearm
          like turning a doorknob. Standard electric blues vibrato.
        </li>
        <li className="bg-white/5 rounded-xl p-3">
          <span className="font-semibold text-white">Classical arm vibrato</span>{" "}
          — The entire forearm rocks, pulling the string along the length of the
          fretboard. Slower and wider than wrist vibrato.
        </li>
      </ul>

      <SectionTitle>How to Execute Wrist Vibrato</SectionTitle>
      <BodyText>
        Fret a note with your ring finger, middle and index stacked behind it.
        Imagine your wrist is the center of a clock. Rock it from roughly 3 o&apos;clock
        to 6 o&apos;clock and back — repeatedly, evenly. Each rock pushes the string
        slightly sharp, and each return brings it back to pitch.
      </BodyText>

      <SectionTitle>Speed and Width</SectionTitle>
      <BodyText>
        Fast and narrow feels tense, urgent. Slow and wide feels vocal, emotional,
        crying. Match your vibrato style to what the phrase is saying.
      </BodyText>

      <SectionTitle>Exercises</SectionTitle>

      <TabBlock
        label="Exercise 1 — Basic vibrato on a sustained note"
        lines={[
          "e|-------------------|",
          "B|-------------------|",
          "G|---7~~~~~~~~~~~~~--|",
          "D|-------------------|",
          "A|-------------------|",
          "E|-------------------|",
        ]}
      />
      <BodyText>
        Pick fret 7 on the G string. Wait exactly one beat, then begin vibrato.
        Sustain for 4 full beats. The delay before adding vibrato makes it feel earned.
      </BodyText>

      <TabBlock
        label="Exercise 2 — Controlled vibrato speed: slow → medium → fast"
        lines={[
          "e|----------------------------------------|",
          "B|----------------------------------------|",
          "G|---7~~~---7~~~~~~---7~~~~~~~~~~~~~~-----|",
          "D|----------------------------------------|",
          "A|----------------------------------------|",
          "E|----------------------------------------|",
          "",
          "  slow      medium       fast",
        ]}
      />
      <BodyText>
        Play the same note three times with increasing vibrato speed. This trains
        conscious control so you can dial in exactly the feeling you want.
      </BodyText>

      <TipBox>
        <strong>Pro tip:</strong> Vibrato is most effective on long, sustained notes.
        Save it for the punchline notes, the final resolution, the emotional peaks.
        Less is more.
      </TipBox>
      <div className="mt-3">
        <MistakeBox>
          Vibrato that goes both sharp AND flat. Correct vibrato should only
          oscillate above the fretted pitch — bend slightly sharp repeatedly and
          release back. Going both ways sounds out of tune.
        </MistakeBox>
      </div>
    </div>
  );
}

function SlidesTab() {
  return (
    <div>
      <WhyBox>
        Slides connect notes the way legato connects words in speech — smoothly,
        with no gap. A well-placed slide makes a phrase feel inevitable, like the
        note was always going there and just needed to travel.
      </WhyBox>

      <SectionTitle>Slide Types</SectionTitle>
      <ul className="text-purple-100 space-y-2 mb-4 list-none">
        <li className="bg-white/5 rounded-xl p-3">
          <span className="font-semibold text-white">Slide-to</span> — Pick the
          first note, slide to destination without re-picking. Notation:{" "}
          <code className="text-green-300 bg-slate-800 px-1 rounded">5/7</code> or{" "}
          <code className="text-green-300 bg-slate-800 px-1 rounded">7\5</code>
        </li>
        <li className="bg-white/5 rounded-xl p-3">
          <span className="font-semibold text-white">Ghost slide</span> — Slide
          from an undefined pitch into a note. Creates a swooping, jazz approach.
          Notation:{" "}
          <code className="text-green-300 bg-slate-800 px-1 rounded">/7</code>
        </li>
        <li className="bg-white/5 rounded-xl p-3">
          <span className="font-semibold text-white">Legato slide</span> — Both
          notes fully articulated as pitches. Maintain firm pressure throughout.
        </li>
      </ul>

      <SectionTitle>How to Execute a Slide</SectionTitle>
      <BodyText>
        Maintain consistent string pressure throughout the entire slide. If you
        lighten pressure, the string stops vibrating. Keep the same pressure from
        departure to destination. Move your whole hand, not just the finger.
      </BodyText>

      <SectionTitle>Exercises</SectionTitle>

      <TabBlock
        label="Exercise 1 — Slide up"
        lines={[
          "e|-------------|",
          "B|-------------|",
          "G|---5/7-------|",
          "D|-------------|",
          "A|-------------|",
          "E|-------------|",
        ]}
      />
      <BodyText>
        Pick fret 5, immediately slide to fret 7 without lifting. You should hear
        a continuous pitch rise. Fret 7 should ring clearly on arrival.
      </BodyText>

      <TabBlock
        label="Exercise 2 — Slide down"
        lines={[
          "e|-------------|",
          "B|-------------|",
          "G|---7\\5-------|",
          "D|-------------|",
          "A|-------------|",
          "E|-------------|",
        ]}
      />

      <TabBlock
        label="Exercise 3 — Blues slide phrase"
        lines={[
          "e|---------------------|",
          "B|--5/8---8---5--------|",
          "G|--------------7---5--|",
          "D|---------------------|",
          "A|---------------------|",
          "E|---------------------|",
        ]}
      />
      <BodyText>
        The slide propels you into the phrase. It gives momentum that picking alone
        cannot create.
      </BodyText>

      <TabBlock
        label="Exercise 4 — Ghost slide (slide from below)"
        lines={[
          "e|-------------|",
          "B|-------------|",
          "G|---/7--------|",
          "D|-------------|",
          "A|-------------|",
          "E|-------------|",
        ]}
      />
      <BodyText>
        Place finger around fret 4–5 without picking. Slide up to fret 7 and pick
        as you land. The ambiguous start creates a vocal swooping approach note.
      </BodyText>

      <TipBox>
        <strong>Pro tip:</strong> Use slides to replace picking when moving between
        adjacent notes on the same string. It immediately makes your playing sound
        less mechanical and more musical.
      </TipBox>
      <div className="mt-3">
        <MistakeBox>
          Lifting the finger during the slide, causing a dead thud mid-travel.
          Press firmly throughout. If you hear a &quot;thunk&quot; instead of a smooth
          glide, you are losing contact.
        </MistakeBox>
      </div>
    </div>
  );
}

function LegatoTab() {
  return (
    <div>
      <WhyBox>
        Legato is the language of speed and smoothness. Hammer-ons and pull-offs
        let you play more notes with fewer pick strokes — resulting in a flowing,
        vocal quality. Allan Holdsworth, Joe Satriani, and Guthrie Govan built
        entire careers on this technique.
      </WhyBox>

      <SectionTitle>Hammer-Ons</SectionTitle>
      <BodyText>
        Fret a lower note and pick it normally. Then, without picking again, bring
        a higher finger down sharply onto a higher fret on the same string. The
        impact of the fingertip is enough to make the new note sound. The motion
        is like a small karate chop, directed straight down into the fret.
      </BodyText>

      <SectionTitle>Pull-Offs</SectionTitle>
      <BodyText>
        The reverse of a hammer-on. Fret two notes simultaneously, pick the higher
        one, then pull your upper finger off with a slight sideways flick — like
        a tiny pluck. The lower fretted finger is already waiting to speak.
      </BodyText>

      <SectionTitle>Exercises</SectionTitle>

      <TabBlock
        label="Exercise 1 — Basic hammer-on"
        lines={[
          "e|-------------|",
          "B|-------------|",
          "G|---5h7-------|",
          "D|-------------|",
          "A|-------------|",
          "E|-------------|",
        ]}
      />
      <BodyText>
        Pick fret 5 with index finger. Keep it pressed. Bring ring finger down
        onto fret 7 hard enough that it rings clearly without picking. Both notes
        should be roughly equal in volume.
      </BodyText>

      <TabBlock
        label="Exercise 2 — Basic pull-off"
        lines={[
          "e|-------------|",
          "B|-------------|",
          "G|---7p5-------|",
          "D|-------------|",
          "A|-------------|",
          "E|-------------|",
        ]}
      />
      <BodyText>
        Fret both fret 5 (index) and fret 7 (ring) simultaneously. Pick fret 7.
        Flick ring finger sideways off the string — slightly toward the floor.
        Fret 5 should ring out clearly.
      </BodyText>

      <TabBlock
        label="Exercise 3 — Hammer-on + pull-off trill (the fundamental drill)"
        lines={[
          "e|--------------------------|",
          "B|--------------------------|",
          "G|---5h7p5h7p5h7p5---------|",
          "D|--------------------------|",
          "A|--------------------------|",
          "E|--------------------------|",
        ]}
      />
      <BodyText>
        Pick fret 5 once, then hammer to 7, pull off to 5, hammer to 7 — repeat
        for 30 seconds straight. Keep it even in tempo. Start at 60 BPM, work up
        to 120 BPM over weeks.
      </BodyText>

      <TabBlock
        label="Exercise 4 — Legato run through pentatonic Box 1"
        lines={[
          "e|--5h8---------|",
          "B|--5h8---------|",
          "G|--5h7---------|",
          "D|--5h7---------|",
          "A|--------------|",
          "E|--------------|",
        ]}
      />
      <BodyText>
        Pick only the first note on each string, hammer to the next. Four notes
        from two pick strokes — your picking hand relaxes while your fretting hand
        does the work.
      </BodyText>

      <TipBox>
        <strong>Pro tip:</strong> The hammer-on must be loud enough to match picked
        notes around it. Record yourself and listen back. If hammered notes are
        quieter, practice them in isolation until they match before integrating
        into runs.
      </TipBox>
      <div className="mt-3">
        <MistakeBox>
          Weak hammers and sloppy pull-offs. The hammer should be perpendicular
          to the fret, not at an angle. The pull-off should drag across the string,
          not just lift straight off.
        </MistakeBox>
      </div>
    </div>
  );
}

function MutingTab() {
  return (
    <div>
      <WhyBox>
        Muting is not about silence — it is about control. Palm muting gives metal
        its chug, funk its tightness, country its twang. Without muting, guitar
        sounds like an uncontrolled wash of sustain.
      </WhyBox>

      <SectionTitle>Type 1: Palm Muting</SectionTitle>
      <BodyText>
        Rest the blade of your picking hand lightly on the strings right where
        they cross the bridge saddles. Not too far forward (kills the note entirely)
        and not too far back (no effect). Pick the string — you should get a tight,
        chunky, controlled note that still has pitch but is heavily damped.
      </BodyText>

      <TabBlock
        label="Palm muting exercise — open A string (PM throughout)"
        lines={[
          "e|--------------------------------|",
          "B|--------------------------------|",
          "G|--------------------------------|",
          "D|--------------------------------|",
          "A|--0-0-0-0---0-0-0-0---0-0-0-0--|  PM throughout",
          "E|--------------------------------|",
        ]}
      />
      <BodyText>
        Keep your palm pressed lightly against the bridge the entire time. Try
        four pressure levels: very light, light, medium, heavy. Each level is a
        different sonic colour in your palette.
      </BodyText>

      <SectionTitle>Type 2: Fretting Hand Muting</SectionTitle>
      <BodyText>
        Lay your fretting fingers across the strings without pressing to the
        fretboard. When you strum, you get a dry, percussive chunk sound — the
        &quot;x&quot; hit. This is the backbone of funk rhythm guitar.
      </BodyText>

      <TabBlock
        label="Fretting hand mute exercise — funk rhythm pattern"
        lines={[
          "e|--x-x--x-x--x-x--|",
          "B|--x-x--x-x--x-x--|",
          "G|--x-x--x-x--x-x--|",
          "D|--x-x--x-x--x-x--|",
          "A|--x-x--x-x--x-x--|",
          "E|--x-x--x-x--x-x--|",
          "",
          "x = muted string hit (no fretted pitch)",
        ]}
      />
      <BodyText>
        Lay all four fretting fingers flat across the strings, barely touching but
        not pressing. Strum through all six strings. You want a dry, rhythmic
        click. The groove lives in the mutes, not the notes.
      </BodyText>

      <SectionTitle>Combining PM with Fretted Notes</SectionTitle>

      <TabBlock
        label="Classic metal chug — palm mute open notes, fret the hits"
        lines={[
          "e|-------------------------|",
          "B|-------------------------|",
          "G|-------------------------|",
          "D|-------------------------|",
          "A|--0-0-0-0---3---3---5----|  PM on 0s, full notes on 3, 3, 5",
          "E|-------------------------|",
        ]}
      />
      <BodyText>
        Palm mute on the open-string chugs. Lift the palm for fretted notes so
        they ring fully. This contrast — muted chugs versus open ringing hits —
        is the rhythmic engine of metal rhythm guitar.
      </BodyText>

      <TipBox>
        <strong>Pro tip:</strong> Moving your palm slightly toward the neck gives
        a warmer mute. Moving toward the saddles gives a tighter, more percussive
        sound. Use this range like a tone control.
      </TipBox>
      <div className="mt-3">
        <MistakeBox>
          Placing the palm too far from the bridge — you kill the note entirely.
          The palm should rest right at the saddles. Also: inconsistent palm
          pressure causes uneven chugs.
        </MistakeBox>
      </div>
    </div>
  );
}

function WorkoutTab() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const toggle = (key: string) =>
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));

  const steps = [
    { key: "s1", time: "Min 1–2", title: "Bends — Intonation Check", desc: "10 whole-step bends on G string, fret 7. Before each bend, fret 9 to hear the target pitch. Bend to match it exactly. Rest 5 seconds between reps. Focus: accuracy, not speed." },
    { key: "s2", time: "Min 2–3", title: "Vibrato — Box 1 Sustained Notes", desc: "Work through every note in pentatonic Box 1. Hold each note for 4 full beats with controlled wrist vibrato. Focus: even oscillation, pitch staying sharp not flat." },
    { key: "s3", time: "Min 3–4", title: "Slides — Box 1 Connected", desc: "Play all of Box 1 using slides to connect every note on each string instead of picking individually. Maintain pressure throughout every slide." },
    { key: "s4", time: "Min 4–5", title: "Hammer-ons — Box 1 Ascending", desc: "Play Box 1 ascending. Pick only the first note on each string, hammer-on to the second. Focus: equal volume between picked and hammered notes." },
    { key: "s5", time: "Min 5–6", title: "Pull-offs — Box 1 Descending", desc: "Play Box 1 descending. Pick the higher note on each string, pull-off to the lower. Focus: the pull-off should sound as loud as the picked note." },
    { key: "s6", time: "Min 6–7", title: "Palm Muting — 4 Pressure Levels", desc: "Strum an open A chord with palm muting at four distinct pressure levels: barely touching, light, medium, heavy. 4 strums per level. Feel the tonal difference." },
    { key: "s7", time: "Min 7–10", title: "Free Play — Technique Integration", desc: "Improvise freely over a blues backing track in A minor. The only rule: use at least 3 of the 5 techniques. No planned licks — just react and experiment." },
  ];

  const completedCount = Object.values(checked).filter(Boolean).length;

  return (
    <div>
      <div className="bg-purple-600/20 border border-purple-400/40 rounded-xl p-5 mb-6">
        <h3 className="text-white font-bold text-lg mb-1">10-Minute Daily Technique Workout</h3>
        <p className="text-purple-200 text-sm">
          Run this every day before you play anything else. Seven sessions in, you
          will notice your techniques bleeding naturally into your improvisation.
        </p>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1 bg-white/10 rounded-full h-2">
            <div
              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedCount / steps.length) * 100}%` }}
            />
          </div>
          <span className="text-purple-300 text-sm font-mono">{completedCount}/{steps.length}</span>
        </div>
      </div>

      <div className="space-y-3 mb-8">
        {steps.map((step) => (
          <button
            key={step.key}
            onClick={() => toggle(step.key)}
            className={`w-full text-left rounded-xl p-4 border transition-all ${
              checked[step.key]
                ? "bg-purple-600/30 border-purple-400/60"
                : "bg-white/5 border-white/10 hover:bg-white/10"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${checked[step.key] ? "bg-purple-500 border-purple-400" : "border-white/30"}`}>
                {checked[step.key] && <span className="text-white text-xs font-bold">✓</span>}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-purple-400 text-xs font-mono bg-purple-900/50 px-2 py-0.5 rounded-full">{step.time}</span>
                  <span className={`font-semibold ${checked[step.key] ? "text-purple-300 line-through" : "text-white"}`}>{step.title}</span>
                </div>
                <p className="text-purple-200 text-sm mt-1 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <SectionTitle>Combined Technique Phrase</SectionTitle>
      <BodyText>
        This single phrase weaves all five techniques together. Once you can play
        this cleanly, you are using every tool in this module as a unified vocabulary.
      </BodyText>

      <TabBlock
        label="All-techniques phrase — slides, bend, vibrato, hammer-on, pull-off"
        lines={[
          "e|-------------------------------|",
          "B|---5/8---8b(10)~~---8---5------|",
          "G|---------------------------7h9p7--|",
          "D|-------------------------------|",
          "A|-------------------------------|",
          "E|-------------------------------|",
          "",
          "5/8      → slide from fret 5 to 8 on B string",
          "8b(10)~~ → whole-step bend + vibrato at top",
          "8---5    → descending picked notes",
          "7h9p7    → hammer-on then pull-off on G string",
        ]}
      />

      <div className="bg-amber-500/10 border border-amber-400/30 rounded-xl p-5 mt-6">
        <h4 className="text-amber-300 font-bold mb-2">The Master Class Mindset</h4>
        <p className="text-amber-100 text-sm leading-relaxed">
          Every guitarist you admire — Hendrix, Clapton, SRV, Gilmour — had
          complete command of exactly these five techniques. They did not think
          about them consciously. They had practiced them so deeply that they became
          the natural dialect of their musical expression. Practice each technique
          in isolation until it is effortless, then combine them until the combination
          is effortless. Then forget about them entirely and just play music.
        </p>
      </div>
    </div>
  );
}

export default function TechniquesPage() {
  const [activeTab, setActiveTab] = useState<TabId>("bends");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-purple-300 hover:text-white transition-colors mb-6 text-sm">
          ← Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">Guitar Techniques</h1>
          <p className="text-purple-200 text-lg leading-relaxed">
            The expressive tools that make notes sing. Bends, vibrato, slides,
            legato, and muting — the difference between playing notes and making music.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-900/50"
                  : "bg-white/10 text-purple-200 hover:bg-white/20 hover:text-white"
              }`}
            >
              <span className="font-mono text-xs opacity-70">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          {activeTab === "bends"   && <BendsTab />}
          {activeTab === "vibrato" && <VibratoTab />}
          {activeTab === "slides"  && <SlidesTab />}
          {activeTab === "legato"  && <LegatoTab />}
          {activeTab === "muting"  && <MutingTab />}
          {activeTab === "workout" && <WorkoutTab />}
        </div>
      </div>
    </div>
  );
}
