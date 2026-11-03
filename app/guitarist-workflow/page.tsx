"use client"

import AsciiTab from "@/components/AsciiTab"
import { useState } from "react"
import Link from "next/link"

// ─── Types ────────────────────────────────────────────────────────────────────

interface WorkflowStep {
  step_number: number
  title: string
  description: string
  technique_tags: string[]
}

interface PracticeStep {
  label: string
  duration: string
  description: string
}

interface Formula {
  scales: string[]
  signatureMove: string
  mindset: string
  tone: string
  practiceSession: PracticeStep[]
}

interface TabExample {
  title: string
  technique: string
  tuning?: string
  tab: string
  howToPlay: string[]
  tags: string[]
}

interface Guitarist {
  id: string
  name: string
  era: string
  genre: string
  signature_sound: string
  influences: string[]
  formula: Formula
  tabs: TabExample[]
  workflow: WorkflowStep[]
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const GUITARISTS: Guitarist[] = [
  {
    id: "bb-king",
    name: "BB King",
    era: "1950s–1990s",
    genre: "Blues",
    signature_sound:
      "Emotional, vocal-style single-note lines with heavy vibrato and expressive bends. Never plays fast — every note counts.",
    influences: ["T-Bone Walker", "Django Reinhardt", "Charlie Christian", "Lonnie Johnson"],
    formula: {
      scales: ["Minor Pentatonic", "Blues Scale"],
      signatureMove: "Wide, slow side-to-side vibrato on every sustained note — achieved with rapid lateral finger movement, not bending up",
      mindset: "Play like you're having a conversation: make a statement, pause, then respond. The silence is part of the music.",
      tone: "Semi-hollow guitar (ES-335 style) → clean or lightly broken-up amp → no pedals. Let the fingers do the work.",
      practiceSession: [
        {
          label: "Warm Up",
          duration: "5 min",
          description: "Pick one minor pentatonic box. Play every note slowly and add wide vibrato to every note you hold for more than a beat. Focus entirely on making the vibrato sound intentional, not nervous.",
        },
        {
          label: "Core Technique",
          duration: "10 min",
          description: "Practice the call-and-response phrase structure: play a 2–4 note phrase, then stop for 2 full beats of silence, then respond with a different phrase. Never fill every bar. Count the silence out loud.",
        },
        {
          label: "Apply It",
          duration: "10 min",
          description: "Play over a slow 12-bar blues in A (70–80 BPM). Limit yourself to 5 notes per phrase maximum. Every time you sustain a note longer than 2 beats, add the vibrato. Judge success by feel, not speed.",
        },
      ],
    },
    tabs: [
      {
        title: "The B.B. Bend",
        technique: "Vibrato on a held bend — the most identifiable sound in BB King's playing",
        tab: `e|-----------------------------------|
B|----8b10~~~----8----5--------------|
G|-------------------------7----5----|
D|-----------------------------------|
A|-----------------------------------|
E|-----------------------------------|

Key of A minor — 5th fret position
b = bend, ~ = vibrato`,
        howToPlay: [
          "Place your ring finger on the 8th fret of the B string with your middle and index fingers stacked behind it for support.",
          "Push the string upward (toward the ceiling) until the pitch matches the 10th fret — that's a whole-step bend from G to A.",
          "While holding the bend at the top, apply rapid side-to-side finger movement (NOT a rocking wrist motion). This is BB's vibrato — lateral, not up-and-down.",
          "Hold the bent note with vibrato for 4 full beats before descending. The sustained expression is the point — don't rush down.",
          "Descend through the pentatonic: B string 8th (G), B string 5th (E), G string 7th (D), G string 5th (C).",
        ],
        tags: ["string bend", "vibrato", "minor pentatonic", "A minor"],
      },
      {
        title: "Call & Response",
        technique: "Statement–silence–reply phrasing — using space as part of the music",
        tab: `CALL (bars 1–2):
e|--8--5--8b9~~~----------|
B|------------------------|
G|------------------------|

  ← 2 full beats of silence — count it out →

RESPONSE (bars 3–4):
e|--5--8--5---------------|
B|----------8b9~~~--------|
G|------------------------|

Key of A minor — the rest bar is intentional`,
        howToPlay: [
          "Play the CALL phrase — e string descending from 8 (C) to 5 (A), then back to 8 (C) with a half-step bend up to C#. Let the bent note ring.",
          "STOP. Count two full beats of silence. Don't fill it. This is the hardest part of playing like BB King — most guitarists can't sit in silence.",
          "Play the RESPONSE — start on e string 5 (A), go up to 8 (C), back to 5 (A), then move to B string 8 (G) with a half-step bend to G#.",
          "Notice the response ends in a different place than the call — it answers the question the call posed.",
          "The silence between the two phrases is not empty. It creates tension that makes the response land harder. Count it consciously every time.",
        ],
        tags: ["call and response", "phrasing", "space", "blues phrasing"],
      },
    ],
    workflow: [
      {
        step_number: 1,
        title: "Scale Selection",
        description:
          "Primarily uses the Minor Pentatonic and Blues scale across 3–4 positions on the neck. Rarely ventures outside these two scales — the goal is depth, not breadth. Mastering a small vocabulary and expressing it fully beats knowing everything and saying nothing.",
        technique_tags: ["minor pentatonic", "blues scale", "position playing"],
      },
      {
        step_number: 2,
        title: "Phrasing Philosophy",
        description:
          "Plays like he's having a conversation: statement, pause, response. Space between notes is as important as the notes themselves. Each phrase is a complete musical sentence — it starts somewhere, goes somewhere, and lands somewhere.",
        technique_tags: ["call and response", "phrasing", "space"],
      },
      {
        step_number: 3,
        title: "Vibrato First",
        description:
          "Every sustained note gets wide, slow vibrato — the famous 'BB King Vibrato'. Achieved by rapid side-to-side finger movement, not bending up. This is what gives his notes their singing, human quality. He never plays a long note without expression.",
        technique_tags: ["vibrato", "finger movement", "expression"],
      },
      {
        step_number: 4,
        title: "Expressive Bends",
        description:
          "Uses half and full-step bends to hit 'blue notes' — the emotional tension between major and minor. Bends are slow and deliberate, often held at the top for maximum vocal effect before resolving. He bends to pitch, never past it.",
        technique_tags: ["string bends", "blue notes", "pitch control"],
      },
      {
        step_number: 5,
        title: "Dynamic Control",
        description:
          "Starts phrases quietly, builds to a peak, then resolves. Like a sentence with punctuation. He controls dynamics with pick attack and guitar volume, not the amp — his right hand is the volume knob.",
        technique_tags: ["dynamics", "pick attack", "volume control"],
      },
    ],
  },
  {
    id: "jimi-hendrix",
    name: "Jimi Hendrix",
    era: "1960s",
    genre: "Psychedelic Rock / Blues",
    signature_sound:
      "Rhythm and lead simultaneously, thumb-over chord voicings, and the whammy bar as an expressive tool. Redefines what one guitarist can sound like.",
    influences: ["Muddy Waters", "BB King", "Chuck Berry", "Buddy Guy", "Curtis Mayfield"],
    formula: {
      scales: ["Minor Pentatonic", "Dorian Mode"],
      signatureMove: "Thumb over the top of the neck to fret bass notes while fingers play melody — one guitarist sounding like two",
      mindset: "You are the rhythm section AND the lead. Never fully commit to one role — always blur the line between them.",
      tone: "Stratocaster (neck pickup) → Fuzz Face → Univibe → Marshall stack cranked. Whammy bar always in reach.",
      practiceSession: [
        {
          label: "Warm Up",
          duration: "5 min",
          description: "Practice wrapping your thumb over the top of the neck to fret the low E string while your other fingers play the top 3 strings. Start with a simple E7 shape with thumb on the low E — get comfortable before adding movement.",
        },
        {
          label: "Core Technique",
          duration: "10 min",
          description: "Practice chord-melody fusion: strum a partial chord voicing, then immediately launch into a pentatonic phrase on the high strings. The goal is a seamless transition — no dead air between the chord strum and the lead line.",
        },
        {
          label: "Apply It",
          duration: "10 min",
          description: "Play over a slow A Dorian vamp (Am–D–Am–D). Use thumb-over technique to hold the bass A string while improvising above it. Add Dorian colour notes (F# on the B string, 7th fret) to your pentatonic phrases. Aim to sound like two guitarists.",
        },
      ],
    },
    tabs: [
      {
        title: "Dorian Colour Lick",
        technique: "Minor pentatonic with added Dorian natural 6th — the note that separates Hendrix from pure blues players",
        tab: `e|--8--5--8--5------------|
B|----------7--5--8-------|
G|------------------7-----|
D|------------------------|
A|------------------------|
E|------------------------|

Key of A Dorian — 5th fret position
The B string 7th fret (F#) is the Dorian natural 6th`,
        howToPlay: [
          "Start on the high e string at the 8th fret (C) — slide down to 5th (A), back to 8th (C), down to 5th (A). This is pure A minor pentatonic.",
          "Now move to the B string. Hit the 7th fret (F#). This is the Dorian natural 6th — it's NOT in the minor pentatonic. This single note is what gives Hendrix his jazzier, more sophisticated sound over a minor chord.",
          "Descend: B string 5th (E), 8th (G), then G string 7th (D) to resolve.",
          "Practice the transition from e string down to B string 7th fret as a distinct colour moment — slightly emphasise the F# to highlight the Dorian character.",
          "Play this over an Am chord. Hear how the F# (the Dorian 6th) brightens the phrase compared to staying inside the pentatonic.",
        ],
        tags: ["Dorian mode", "natural 6th", "colour notes", "A minor"],
      },
      {
        title: "Chord + Lead Fragment",
        technique: "Chord stab into single-note run — the rhythm-lead fusion that defines Hendrix's style",
        tab: `e|--0--0--8--5--8b9-------|
B|--2--2------------------|
G|--2--2------------------|
D|--2--2------------------|
A|--0--0------------------|
E|------------------------|

Open A chord (x02220), strummed twice on beats 1–2
Lead phrase launches on beat 3`,
        howToPlay: [
          "Fret a standard open A chord (x02220). Strum it twice — short, punchy strums. These are the chord 'stabs'.",
          "Immediately after the second strum, lift your fretting hand and move to the single-note position: e string 8th fret (C).",
          "Run the pentatonic phrase: e8 (C) → e5 (A) → e8b9 (C bent to C# — a blues half-step bend).",
          "The key is zero gap between the chord and the lead line. In Hendrix's playing they feel like one continuous idea, not two separate parts.",
          "Practice the switch until it's seamless — strum, strum, fly into the lead. When it sounds like one phrase rather than two things happening, you have it.",
        ],
        tags: ["chord-melody", "rhythm-lead", "A major chord", "pentatonic"],
      },
    ],
    workflow: [
      {
        step_number: 1,
        title: "Thumb-Over Technique",
        description:
          "Wraps his thumb over the top of the neck to fret bass notes on the low E string while his fingers handle the upper strings. This blurs the line between rhythm and lead — he can hold a bass groove and play melody at the same time.",
        technique_tags: ["thumb fretting", "bass lines", "neck grip"],
      },
      {
        step_number: 2,
        title: "Scale Palette",
        description:
          "Uses the Pentatonic Minor as his home base, but freely adds Dorian mode colour notes (the natural 6th and 9th) for a jazzier, more sophisticated feel. He treats scales as a palette to dip into, not a box to stay inside.",
        technique_tags: ["pentatonic minor", "dorian mode", "colour notes"],
      },
      {
        step_number: 3,
        title: "Chord-Melody Fusion",
        description:
          "Plays partial chord shapes between single-note runs so rhythm and lead happen simultaneously. A classic move: strum a partial chord, then immediately launch into a pentatonic phrase — one guitarist sounding like two.",
        technique_tags: ["chord fragments", "chord-melody", "E7#9"],
      },
      {
        step_number: 4,
        title: "Whammy as Expression",
        description:
          "Uses the tremolo arm mid-phrase for dives, rises, and pitch vibrato — treating it like a human voice crack or emotional inflection. The whammy is not a trick, it is a vocabulary. Subtle pushes and releases add drama to sustained notes.",
        technique_tags: ["whammy bar", "tremolo arm", "pitch dives"],
      },
      {
        step_number: 5,
        title: "Feel Over Precision",
        description:
          "Intentionally loose timing — slightly behind the beat. This creates a relaxed, heavy groove rather than mechanical precision. The feel is the point. He prioritises expression and momentum over note-perfect execution.",
        technique_tags: ["behind the beat", "groove", "feel"],
      },
    ],
  },
  {
    id: "stevie-ray-vaughan",
    name: "Stevie Ray Vaughan",
    era: "1980s",
    genre: "Texas Blues / Blues Rock",
    signature_sound:
      "Enormous, physical tone from heavy-gauge strings and an aggressive right-hand attack. Combines raw power with deeply expressive bends and a rhythmic ferocity no blues player before him had.",
    influences: ["Jimi Hendrix", "Albert King", "Buddy Guy", "BB King", "Wes Montgomery"],
    formula: {
      scales: ["Minor Pentatonic", "Blues Scale", "Major Pentatonic"],
      signatureMove: "Three-finger bends with stacked fingers for iron-clad intonation — borrow Albert King's technique to get those massive, in-tune bends on heavy strings",
      mindset: "The right hand IS the tone. Attack harder on the big notes, feather the passing notes. The dynamics between notes is what makes the phrase.",
      tone: "Strat (all pickups or bridge) → two stacked Tube Screamers (one boosting the other) → loud clean Fender or Dumble amp. Strings: .013s, tuned down to Eb.",
      practiceSession: [
        {
          label: "Warm Up",
          duration: "5 min",
          description: "Stack your ring finger behind your middle finger for support on all bends. Practice full-step bends on the B string (7th fret) going up to the pitch of the 9th fret. Hold the bend at the top for 2 beats, then release slowly. Intonation first — get it perfectly in tune before adding speed.",
        },
        {
          label: "Core Technique",
          duration: "10 min",
          description: "Practice double stops: pair notes on the G and B strings a 3rd apart. Play a blues lick, then resolve to a double stop. Alternate between a single-note run and a double-stop hit. This is what creates SRV's thick, chordal lead sound.",
        },
        {
          label: "Apply It",
          duration: "10 min",
          description: "Play over a medium shuffle in E (90–100 BPM). Mix single-note pentatonic runs, three-finger bends held at the top, and double stop hits. Play aggressively — dig in with your pick. Vary the attack between ghost notes and full hits within the same phrase.",
        },
      ],
    },
    tabs: [
      {
        title: "Double Stop Hit",
        technique: "Paired notes a 6th apart — the chordal lead texture that makes SRV sound like more than one guitarist",
        tab: `e|--9--9--12b13~~---------|
B|--10-10-----------------|
G|------------------------|
D|------------------------|
A|------------------------|
E|------------------------|

Key of A — 9th fret position
Both strings played simultaneously (double stop)
b = bend the top string only, hold bottom string steady`,
        howToPlay: [
          "Place your ring finger on the 10th fret of the B string and your pinky on the 9th fret of the high e string. These two notes (A and C#) form a major 3rd interval — play them simultaneously.",
          "Strum or pick both strings together twice (the '9–9' and '10–10'). Play firmly — SRV digs in hard on double stops.",
          "Now bend ONLY the high e string from the 12th fret (E) up toward the 13th fret (F) — about a half step. Keep the B string fretted steady.",
          "The bottom note stays still while the top note bends — this stretching creates harmonic tension that defines SRV's lead style.",
          "Add vibrato on the bent note while holding. Listen: you sound like two guitars. That's the double stop effect.",
        ],
        tags: ["double stops", "6th intervals", "string bends", "A minor"],
      },
      {
        title: "Three-Finger Bend",
        technique: "Stacked-finger bending technique for massive, in-tune bends — borrowed directly from Albert King",
        tab: `e|----------------------------------------|
B|----8b10~~~----8--8b10~~~--------------|
G|----------------------------------------|
D|----------------------------------------|
A|----------------------------------------|
E|----------------------------------------|

Key of A minor — 5th fret area
b10 = whole step bend (G → A)
Stack ring+middle+index fingers behind the bend`,
        howToPlay: [
          "Place your ring finger on the 8th fret of the B string. Now stack your middle finger on the 7th fret and your index finger on the 6th fret directly behind it — all three fingers press the string.",
          "Push the string upward using all three fingers together. The combined force allows you to bend a whole step with perfect intonation even on heavy .013 strings.",
          "Bend from G (8th fret) up to A (the pitch of the 10th fret). Check your intonation — the bent note should match the 10th fret exactly.",
          "Hold the bend at the top and add vibrato by continuing to push and slightly release rhythmically. SRV's vibrato on bends is intense — wide and purposeful.",
          "Release the bend slowly over 2 beats, then repeat the same bend on the next note. The release is as musical as the attack.",
        ],
        tags: ["three-finger bend", "intonation", "vibrato", "Albert King style"],
      },
    ],
    workflow: [
      {
        step_number: 1,
        title: "Heavy Strings + Half-Step Down",
        description:
          "Uses .013–.058 gauge strings tuned down a half step to Eb. The extra tension creates natural compression and a thicker, more powerful tone. Tuning down slightly loosens the strings just enough to allow massive bends without snapping.",
        technique_tags: ["heavy strings", "Eb tuning", "string tension"],
      },
      {
        step_number: 2,
        title: "Three-Finger Bending",
        description:
          "Stacks three fingers behind the bending finger for maximum force and pitch control. This technique — borrowed from Albert King — allows full-step and step-and-a-half bends on heavy strings without the note going sharp or flat.",
        technique_tags: ["three-finger bend", "intonation", "Albert King style"],
      },
      {
        step_number: 3,
        title: "Double-Stop Power",
        description:
          "Pairs notes on adjacent strings (6th and 3rd intervals) for a thick, chordal lead sound — a melodic line that sounds like two guitarists. It is one of SRV's signature moves and creates a richness that single notes alone can never match.",
        technique_tags: ["double stops", "6th intervals", "chord-lead"],
      },
      {
        step_number: 4,
        title: "Rhythm-Lead Hybrid",
        description:
          "Never fully separates rhythm and lead. He embeds lead licks inside rhythm parts and keeps the right hand constantly active — hybrid picking bass strings, snapping the high strings, and strumming partial chords, all within a single phrase.",
        technique_tags: ["hybrid picking", "rhythm-lead", "right-hand activity"],
      },
      {
        step_number: 5,
        title: "Stacked Tube Screamer Tone",
        description:
          "Runs multiple Ibanez Tube Screamer pedals into a loud, clean Fender amp to push the power tubes into natural saturation. The distortion comes from the amp's output stage, not a distortion pedal. The Tube Screamer boosts signal and mid frequencies — the amp does the rest.",
        technique_tags: ["Tube Screamer", "amp saturation", "tone stack"],
      },
    ],
  },
  {
    id: "eric-clapton",
    name: "Eric Clapton",
    era: "1960s–present",
    genre: "Blues Rock / Blues",
    signature_sound:
      "The original 'Slowhand' — fluid, singing single-note lines with expressive vibrato and precise bends. Proves that restraint is the most powerful tool a blues guitarist has.",
    influences: ["Robert Johnson", "Muddy Waters", "BB King", "Freddie King", "Albert King"],
    formula: {
      scales: ["Minor Pentatonic", "Blues Scale (flat 5th)"],
      signatureMove: "Roll the guitar's tone knob fully to 0 on the bridge pickup for the 'Woman Tone' — warm, vocal, and slightly feedback-prone",
      mindset: "Play fewer notes than you think you should. If the phrase is singable, it works. If you can't hum it back, it's too complicated.",
      tone: "Les Paul or Strat (bridge pickup, tone at 0) → light overdrive or cranked Marshall → subtle reverb. No effects chain needed.",
      practiceSession: [
        {
          label: "Warm Up",
          duration: "5 min",
          description: "Set your amp slightly dirty. Play long, slow notes on the minor pentatonic. Apply vibrato only AFTER the note has been held clean for 1 full beat — let the note speak first, then add expression.",
        },
        {
          label: "Core Technique",
          duration: "10 min",
          description: "Practice the Three Kings vocabulary one at a time. 5 minutes of BB-style side-to-side vibrato. 5 minutes of wide Albert King-style bends from below the target note.",
        },
        {
          label: "Apply It",
          duration: "10 min",
          description: "Play over a slow 12-bar blues in G. Allow yourself maximum 4 notes per phrase. Leave 2 full bars of silence between phrases. Add the flat 5th (Db in G) as a tension note that resolves down to the 5th (D). Singability is the test.",
        },
      ],
    },
    tabs: [
      {
        title: "Slowhand Phrase",
        technique: "Restrained blues lick — maximum expression from minimum notes",
        tab: `e|--------------------------------------|
B|----5--8--5--8b10~~~~-----------------|
G|--7------------------------------------|
D|--------------------------------------|
A|--------------------------------------|
E|--------------------------------------|

Key of A minor — 5th fret position
b10 = whole step bend (G → A), hold and add vibrato
~~~~ = long, slow sustained vibrato`,
        howToPlay: [
          "Start on the G string 7th fret (D) — a single picked note, held for one full beat before moving.",
          "Move to B string: 5th fret (E), 8th fret (G), 5th fret (E), 8th fret (G). Play each note deliberately — not fast. Clapton's 'Slowhand' nickname is literal.",
          "Bend the B string at the 8th fret (G) up a whole step to A (pitch of the 10th fret). This is the emotional peak of the phrase.",
          "Hold the bend at the top and apply slow, wide vibrato — wider than you think is right. Let it waver. The sustained, expressive bent note is the entire point of the phrase.",
          "Don't rush to the next phrase. Let the bent note decay naturally. Clapton's power comes from the patience to let a note finish before starting something new.",
        ],
        tags: ["restrained phrasing", "string bend", "vibrato", "Slowhand"],
      },
      {
        title: "Blue Note Tension",
        technique: "Flat 5th (blue note) creating tension that resolves — the core of Clapton's emotional vocabulary",
        tab: `e|--8--5--8--5--8--6--7-----------|
B|--------------------------------|
G|--------------------------------|
D|--------------------------------|
A|--------------------------------|
E|--------------------------------|

Key of A — high e string phrase
e fret 6 = Bb (the flat 5th / blue note)
e fret 7 = B (the 5th — the resolution)`,
        howToPlay: [
          "The first part of the phrase (frets 8–5–8–5–8) is pure A minor pentatonic — familiar, inside the scale.",
          "At fret 6, you play Bb — the flat 5th (blue note). This note is NOT in the pentatonic. It creates immediate harmonic tension. Listen for how it feels 'wrong' in the best possible way.",
          "Immediately resolve to fret 7 (B natural, the perfect 5th). The tension releases. This Bb→B half-step move is the most emotional gesture in blues — Clapton uses it constantly.",
          "Play the 6→7 resolution slowly and with intent. The Bb should feel like a question; the B should feel like an answer.",
          "Try bending the 6th fret slightly sharp rather than picking it clean. This makes the blue note sound more vocal and less mechanical.",
        ],
        tags: ["blue note", "flat 5th", "tension and resolution", "blues vocabulary"],
      },
    ],
    workflow: [
      {
        step_number: 1,
        title: "The Three Kings Foundation",
        description:
          "Bases his vocabulary on the three Kings: BB (vibrato and slow bends), Freddie (aggressive, snappy attack), Albert (behind-the-beat feel and wide string bends). He studied each separately and then fused them into a single voice.",
        technique_tags: ["BB King style", "Freddie King attack", "Albert King bends"],
      },
      {
        step_number: 2,
        title: "Minor Pentatonic + Blue Notes",
        description:
          "Stays close to the minor pentatonic but deliberately adds the flat 5th (blue note) for emotional tension. Rarely ventures to Dorian or other modes — his power comes from how deeply he knows a small scale, not how many scales he uses.",
        technique_tags: ["minor pentatonic", "blue note", "flat 5th"],
      },
      {
        step_number: 3,
        title: "The Woman Tone",
        description:
          "On the bridge pickup, rolls the guitar tone knob fully down to 0 — creating the warm, vocal, slightly feedback-prone tone heard on Cream recordings. Gear is part of the technique. The tone knob is a real-time expressive tool.",
        technique_tags: ["tone knob", "pickup selection", "woman tone"],
      },
      {
        step_number: 4,
        title: "Slow, Wide Vibrato",
        description:
          "Applies wide, slow vibrato to bent and sustained notes — less of a shake than BB King, more of a long vocal wavering. Achieved with a relaxed fretting hand and whole-finger pivot motion. The vibrato always waits to arrive after the note is first heard clean.",
        technique_tags: ["vibrato", "bent note vibrato", "slow vibrato"],
      },
      {
        step_number: 5,
        title: "Melodic Restraint",
        description:
          "Plays fewer notes than almost any rock guitarist of his calibre. Phrases are short, deliberate, and singable. The silence between phrases is intentional — it gives each phrase room to breathe and the listener time to feel it before the next one arrives.",
        technique_tags: ["space", "restraint", "melodic phrasing"],
      },
    ],
  },
  {
    id: "john-mayer",
    name: "John Mayer",
    era: "2000s–present",
    genre: "Blues-Rock / Pop",
    signature_sound:
      "SRV-influenced Texas blues meets clean pop sensibility. Extremely precise technique with heavy pentatonic use and an obsessive approach to tone.",
    influences: ["Stevie Ray Vaughan", "BB King", "Eric Clapton", "Robben Ford", "Albert King"],
    formula: {
      scales: ["Minor Pentatonic (all 5 positions)", "Major Pentatonic"],
      signatureMove: "Quarter-step bends — not a full half-step, just sharp enough to sound vocal and human without resolving to the next note",
      mindset: "Think rhythmically before you think melodically. Ask 'when should this note land?' before 'what note should it be?'",
      tone: "Strat (neck or middle pickup) → Klon Centaur or light overdrive → clean Dumble-style amp. Two-hand muting for surgical cleanliness.",
      practiceSession: [
        {
          label: "Warm Up",
          duration: "5 min",
          description: "Practice two-hand muting: with every note you play, make sure your fretting hand is lightly touching unused strings above the fretted note, and your picking hand palm is resting on strings below it. Play scales slowly — zero accidental string noise allowed.",
        },
        {
          label: "Core Technique",
          duration: "10 min",
          description: "Practice pentatonic position shifts. Start in box 1 at the 5th fret (A minor), then slide into box 2, then box 3 — moving up the neck laterally. Use slides and hammer-ons at the transition points.",
        },
        {
          label: "Apply It",
          duration: "10 min",
          description: "Play over a slow groove in A (75 BPM). Think of your phrases as drum patterns — where does the note land rhythmically? Try landing a phrase on the 'and' of beat 2. Add quarter-step bends on any note you hold for more than a beat.",
        },
      ],
    },
    tabs: [
      {
        title: "Quarter-Step Vocal Lick",
        technique: "Microtonal bends — pushing a note just slightly sharp to mimic the inflection of the human voice",
        tab: `e|-------------------------------|
B|--7--5b5.5~~--5--8--5---------|
G|-------------------------------|
D|-------------------------------|
A|-------------------------------|
E|-------------------------------|

Key of A Dorian — 5th fret position
b5.5 = quarter-step bend (push slightly sharp, NOT to 6th fret pitch)
7th fret B string = F# (Dorian natural 6th)`,
        howToPlay: [
          "Start on the B string 7th fret (F# — the Dorian natural 6th, very Mayer). Pick it cleanly.",
          "Move to the 5th fret (E) and immediately apply a quarter-step bend: push the string upward just enough to go slightly sharp — about a quarter of the distance to the 6th fret. NOT a half-step bend.",
          "Hold that slightly-sharp E with slow vibrato. The pitch should feel 'almost resolved' but not quite — like a singer hitting a note with a slight upward inflection. That vocal uncertainty is the point.",
          "Descend: 5th fret (E), 8th fret (G), 5th fret (E). Play these straight, no bends.",
          "The contrast between the expressive quarter-step bend and the clean following notes is what makes the phrase sound musical rather than mechanical.",
        ],
        tags: ["quarter-step bend", "microtonal", "Dorian", "vocal technique"],
      },
      {
        title: "Pentatonic Box Shift",
        technique: "Moving fluidly between pentatonic positions — from box 1 to box 2 across the neck",
        tab: `e|--5--8--5-----------10--8--10--|
B|----------8--10----------------|
G|-------------------------------|
D|-------------------------------|
A|-------------------------------|
E|-------------------------------|

Key of A minor
First phrase: box 1 (5th fret)
Second phrase: box 2 (7th–10th fret)
Slide or hammer-on at the transition`,
        howToPlay: [
          "First phrase (box 1, 5th fret): e5 (A), e8 (C), e5 (A) — pure pentatonic box 1.",
          "At B string 8th fret (G), slide your finger UP to the 10th fret (A) — this slide is the position shift. Let it connect the two boxes smoothly.",
          "Second phrase (box 2, 7th–10th fret): e10 (D), e8 (C), e10 (D) — you've moved up the neck into the next pentatonic position.",
          "The key is that the slide at the transition should sound musical, not mechanical — it's a phrase connector, not a scale exercise.",
          "Practice the shift until it disappears — the listener should hear one connected idea, not 'here I am moving to another box'. Two-hand muting stays active through the entire phrase.",
        ],
        tags: ["position shift", "pentatonic positions", "box shifting", "neck navigation"],
      },
    ],
    workflow: [
      {
        step_number: 1,
        title: "Two-Hand Muting",
        description:
          "Keeps unused strings muted with both fretting and picking hand simultaneously, producing a clean, tight tone even on high gain. This is what separates a polished studio sound from an amateur recording — muting is the difference.",
        technique_tags: ["palm muting", "fretting hand mute", "string muting"],
      },
      {
        step_number: 2,
        title: "Scale Zones",
        description:
          "Divides the neck into 5 pentatonic positions and practices transitioning fluidly between them. Rather than staying in one box, he slides laterally up the neck, connecting positions with position shifts and slides.",
        technique_tags: ["pentatonic positions", "position shifts", "neck zones"],
      },
      {
        step_number: 3,
        title: "Microtonal Bends",
        description:
          "Uses quarter-step bends — slightly sharp, not a full half-step — to add vocal-like expressiveness to notes. This subtle pitch deviation mimics the human voice in a way that full bends can't. It lives in the space between notes.",
        technique_tags: ["quarter-step bends", "microtonal", "pitch expression"],
      },
      {
        step_number: 4,
        title: "Rhythmic Phrasing",
        description:
          "Treats phrases like drum patterns — syncopated, with intentional rests and ghost notes. He thinks rhythmically before melodically, asking 'when should this note land?' before asking 'what note should it be?'",
        technique_tags: ["syncopation", "ghost notes", "rhythmic phrasing"],
      },
      {
        step_number: 5,
        title: "Tone Chain Awareness",
        description:
          "Adjusts pick attack, guitar volume knob, and amp settings together to shape tone — not just pedals. Knows how rolling back the guitar volume cleans up a dirty amp, and uses this as a real-time performance tool.",
        technique_tags: ["guitar volume knob", "pick attack", "amp interaction"],
      },
    ],
  },
  {
    id: "jimmy-page",
    name: "Jimmy Page",
    era: "1960s–1980s",
    genre: "Hard Rock / Blues Rock",
    signature_sound:
      "Heavy, menacing riffs combined with delicate acoustic passages. A master of dynamics and studio layering — treats the recording space itself as an instrument.",
    influences: ["BB King", "Robert Johnson", "Scotty Moore", "Bert Jansch", "Lonnie Donegan"],
    formula: {
      scales: ["Minor Pentatonic", "Natural Minor / Aeolian", "Chromatic runs"],
      signatureMove: "Add the tritone (flat 5th) into your pentatonic runs — the 'devil's interval' that transforms a standard blues lick into something menacing",
      mindset: "Contrast is everything. Quiet then loud, acoustic then electric, clean then distorted. The heavy part only hits hard because of the gentle part before it.",
      tone: "Les Paul (bridge pickup) → overdrive → loud Marshall stack. For acoustics: DADGAD or Open D tuning. Studio: layer 3+ guitar tracks.",
      practiceSession: [
        {
          label: "Warm Up",
          duration: "5 min",
          description: "Play through the E minor pentatonic at the 12th fret. Now add the tritone: Bb (fret 18 on the high e string, or fret 6 at the lower position). Every time you reach the top of a phrase, descend through the tritone on the way back down.",
        },
        {
          label: "Core Technique",
          duration: "10 min",
          description: "If you have a second guitar, tune it to DADGAD (D–A–D–G–A–D). Strum all open strings — hear the Dsus4 drone. Now fret just the 2nd fret on the G and A strings. Practice letting open strings ring as drones against fretted notes.",
        },
        {
          label: "Apply It",
          duration: "10 min",
          description: "Build a two-part arrangement: a quiet fingerpicked passage using open strings and drones, then switch to electric and hit a heavy pentatonic riff with the tritone added. Practice the contrast so it's dramatic and deliberate.",
        },
      ],
    },
    tabs: [
      {
        title: "Devil's Interval Riff",
        technique: "The tritone (flat 5th) inside a pentatonic descending run — maximum tension before resolution",
        tab: `e|--12--10--8--6--7-----------|
B|----------------------------|
G|----------------------------|
D|----------------------------|
A|----------------------------|
E|----------------------------|

Key of E — high e string
e fret 12 = E, fret 10 = D, fret 8 = C, fret 6 = Bb (TRITONE!), fret 7 = B (resolution)
The Bb is 6 semitones from E — maximum dissonance`,
        howToPlay: [
          "Descend from the 12th fret (E): 12→10→8, playing E, D, C. These are all inside E minor pentatonic — familiar and stable.",
          "At the 6th fret, you hit Bb — the tritone. This note is exactly halfway between E and the next E. It is the most dissonant interval in Western music. Feel how it destabilises everything.",
          "Immediately resolve to fret 7 (B natural, the perfect 5th of E). The tension releases. This Bb→B move — tritone to 5th — is the signature of Page's dark, menacing riff style.",
          "Play the run at medium speed first. The 6→7 resolution should have a slight accent — emphasise the moment of release.",
          "Once comfortable, add distortion and play the phrase over a slow E5 power chord. The tritone will sound genuinely threatening over the low E drone.",
        ],
        tags: ["tritone", "devil's interval", "tension and resolution", "E minor"],
      },
      {
        title: "DADGAD Drone Chord",
        technique: "Open tuning drone voicings — fretted notes ringing against open string drones",
        tuning: "DADGAD (low to high: D–A–D–G–A–D)",
        tab: `(Tune to DADGAD: D–A–D–G–A–D)

e|--0------0------2---3--|
B|--0--0------2----------|
G|--0----2---------------|
D|--0--------------------|
A|--0--------------------|
D|--0--------------------|

All open = Dsus4 drone (D A D G A D)
Fret 2 on G = A, fret 2 on B = B, fret 3 on e = F#`,
        howToPlay: [
          "Retune your guitar to DADGAD: low string → D (down 2 frets), A stays, D stays, G stays, B → A (down 2 frets), high e → D (down 2 frets). Use a tuner.",
          "Strum all 6 open strings. You're playing D–A–D–G–A–D: a Dsus4 chord with the open G drone in the middle. This is Page's Celtic-influenced 'base' sound.",
          "The ascending phrase adds fretted notes against the open string drones: G string 2nd fret (A), B string 2nd fret (B), e string 3rd fret (F#).",
          "Let the open strings ring while you fret the higher notes. The open D and A strings sustain underneath as drones — that ringing, layered texture is impossible in standard tuning.",
          "Practice letting the drone strings ring through the whole phrase. The moment you accidentally mute them, you've lost the DADGAD sound.",
        ],
        tags: ["DADGAD", "open tuning", "drone strings", "open chords"],
      },
    ],
    workflow: [
      {
        step_number: 1,
        title: "Dual Identity — Acoustic vs Electric",
        description:
          "Approaches the guitar as two separate identities: the acoustic fingerpicker (Bron-Y-Aur Stomp, Tangerine) and the electric riff architect (Whole Lotta Love, Heartbreaker). Switching between them within a single song creates dramatic contrast.",
        technique_tags: ["acoustic fingerpicking", "electric riffs", "contrast"],
      },
      {
        step_number: 2,
        title: "Open Tunings & DADGAD",
        description:
          "Uses DADGAD and open D tuning heavily to produce a droning, Celtic-influenced sound with chord voicings impossible in standard tuning. These tunings free up open strings to ring as drones against fretted notes.",
        technique_tags: ["DADGAD", "open tuning", "drone strings"],
      },
      {
        step_number: 3,
        title: "The Devil's Interval",
        description:
          "Adds the tritone (flat 5th) into pentatonic runs for a darker, more menacing sound than typical blues. This 'devil's interval' creates maximum tension and is the secret ingredient in riffs like Whole Lotta Love.",
        technique_tags: ["tritone", "minor pentatonic", "tension"],
      },
      {
        step_number: 4,
        title: "Violin Bow & Extended Technique",
        description:
          "Draws a cello bow across the guitar strings to create sustained, orchestral swells — turning the guitar into a texture generator. On record, uses backward tape echo and studio effects as compositional tools.",
        technique_tags: ["bowing", "extended technique", "studio effects"],
      },
      {
        step_number: 5,
        title: "Layered Studio Orchestration",
        description:
          "Records multiple guitar parts — rhythm, lead, acoustic, dobro — and layers them into a wall of sound. Uses an Echoplex live for repeat delay effects. The final tone is never just one guitar; it is an orchestrated arrangement.",
        technique_tags: ["guitar layering", "Echoplex", "studio arrangement"],
      },
    ],
  },
  {
    id: "jeff-beck",
    name: "Jeff Beck",
    era: "1960s–2010s",
    genre: "Rock / Fusion / Blues",
    signature_sound:
      "The most innovative tone sculptor in rock — plays without a pick, uses the whammy bar as a primary melodic voice, and treats the guitar like a human voice or synthesiser.",
    influences: ["Les Paul", "Cliff Gallup", "BB King", "Stevie Wonder", "Mahavishnu Orchestra"],
    formula: {
      scales: ["Minor Pentatonic", "Chromatic approach notes", "Lydian (fusion passages)"],
      signatureMove: "Volume swell with the picking-hand pinky on the volume knob: pick a note silently, then roll the volume up — creates a zero-attack violin bloom from nothing",
      mindset: "Every built-in guitar control is a live performance tool. The volume knob, tone knob, pickup selector, and whammy bar are all instruments within the instrument.",
      tone: "Strat → light reverb and delay → clean amp. No pick — fingertips and thumb only. The tone comes from touch, not pedals.",
      practiceSession: [
        {
          label: "Warm Up",
          duration: "5 min",
          description: "Put down your pick. Play through the minor pentatonic using only your index finger and thumb. Focus on controlling the attack of each note with the flesh vs. the tip of your finger. Flesh = warmer, less attack. Tip = brighter, more defined.",
        },
        {
          label: "Core Technique",
          duration: "10 min",
          description: "Practice volume swells: pick (or pluck) a note with your volume knob rolled to zero, then roll it up with your pinky to full volume. The note should bloom from silence. Start with whole notes, then try it on every note in a slow phrase.",
        },
        {
          label: "Apply It",
          duration: "10 min",
          description: "Play a slow, spacious melody. Apply volume swells to every note. Use the whammy bar for subtle inflections on held notes — not dives, just gentle pushes that mimic speech. The goal is to make the guitar sound like a singing human voice.",
        },
      ],
    },
    tabs: [
      {
        title: "Chromatic Approach Lick",
        technique: "Approaching target notes from a half-step below — the jazz vocabulary that makes Beck's lines unpredictable",
        tab: `e|--4h5--7h8--7--5---------|
B|-------------------------|
G|-------------------------|
D|-------------------------|
A|-------------------------|
E|-------------------------|

Key of A — high e string
4h5 = hammer from G# (approach) to A (target)
7h8 = hammer from B (approach) to C (target)
Each hammer-on is a chromatic approach from a half-step below`,
        howToPlay: [
          "At the 4th fret of the high e string, you're playing G# — a note that is NOT in A minor pentatonic. This is a chromatic approach note: a half-step below the target.",
          "Hammer-on immediately to the 5th fret (A) — the target note. The G#→A move sounds like a lean or a vocal 'slide up' into the note. This is jazz phrasing applied to rock.",
          "Repeat the same concept: 7th fret (B, approach) → hammer to 8th fret (C, target). B is a half-step below C.",
          "Descend: 7th fret (B), 5th fret (A) — landing cleanly on scale tones after the chromatic approach.",
          "The chromatic approach note should be barely audible — a passing grace note rather than a full beat. The TARGET note gets the emphasis.",
        ],
        tags: ["chromatic approach", "hammer-on", "jazz vocabulary", "half-step"],
      },
      {
        title: "Volume Swell Melody",
        technique: "Zero-attack note blooming — creating a violin or cello quality by shaping the attack with the volume knob",
        tab: `e|--5~~~~~~~~--7~~~~~~~~--5~~~~~~~~--|
B|-----------------------------------|
G|-----------------------------------|
D|-----------------------------------|
A|-----------------------------------|
E|-----------------------------------|

Volume knob starts at 0 for each note
Roll up to full after picking
Add reverb for full effect
~~~~~~~~ = sustained with gentle whammy inflections`,
        howToPlay: [
          "Before picking any note, roll your guitar's volume knob to zero using your picking-hand pinky. This is your starting position for every note in this exercise.",
          "Pick the 5th fret (A) with your remaining fingers — the note is silent because the volume is at zero.",
          "Immediately roll the volume knob up to full using your pinky. The note blooms from silence. With reverb, it sounds like a cello or violin bow starting a note.",
          "Hold the note for 4 full beats. On the 3rd beat, add a gentle whammy bar push — just enough to make the pitch waver slightly, like a voice inflection.",
          "For the next note (7th fret, B), roll back to zero WHILE the previous note is still ringing, pick the new note, then roll up again. Each note gets its own bloom. This is the entire technique.",
        ],
        tags: ["volume swell", "attack shaping", "no-attack note", "whammy inflection"],
      },
    ],
    workflow: [
      {
        step_number: 1,
        title: "Fingerpicking — No Pick",
        description:
          "Plays entirely with fingers and thumb rather than a plectrum. This gives him precise note-by-note dynamic control, allows simultaneous muting with unused fingers, and enables right-hand volume swells that a pick simply cannot execute.",
        technique_tags: ["fingerpicking", "no pick", "right-hand control"],
      },
      {
        step_number: 2,
        title: "Whammy as Primary Voice",
        description:
          "The tremolo arm is not for vibrato effects — it is his primary pitch-bending tool. Subtle arm pressure produces speech-like inflections, violin portamento slides, and vowel-shaped note shapes.",
        technique_tags: ["whammy bar", "portamento", "pitch inflection"],
      },
      {
        step_number: 3,
        title: "Volume Swell Technique",
        description:
          "Rolls the guitar volume knob with his picking-hand pinky while playing, creating violin-like zero-attack notes that bloom from nothing. Combined with reverb and delay, the effect is more synthesiser than guitar.",
        technique_tags: ["volume knob", "swell", "attack shaping"],
      },
      {
        step_number: 4,
        title: "Chromatic Approach Notes",
        description:
          "Freely approaches target notes from a half-step below or above — notes entirely outside the scale. This chromatic vocabulary comes from jazz and gives his lines an unpredictable, searching quality.",
        technique_tags: ["chromatic notes", "approach notes", "jazz vocabulary"],
      },
      {
        step_number: 5,
        title: "In-Performance Tone Sculpting",
        description:
          "Constantly switches pickups, adjusts tone and volume controls, and changes picking position mid-song. He treats every built-in guitar control as a live performance tool. The tone never stays static for more than a few bars.",
        technique_tags: ["pickup switching", "tone control", "live sculpting"],
      },
    ],
  },
  {
    id: "david-gilmour",
    name: "David Gilmour",
    era: "1967–present",
    genre: "Progressive Rock / Psychedelic",
    signature_sound:
      "Vast, spacious tone built on slow bends, singing sustain, and cathedral-like reverb and delay. Every note is chosen for maximum emotional weight — space is the canvas he paints on.",
    influences: ["BB King", "Syd Barrett", "Roy Harper", "Pete Seeger", "Wes Montgomery"],
    formula: {
      scales: ["Minor Pentatonic", "Dorian Mode", "Major Pentatonic (for resolution)"],
      signatureMove: "Extremely slow, controlled bends held at the top for 2–4 beats — combined with long dotted-eighth note delay that creates rhythmic echo patterns",
      mindset: "Space is not silence — it is tension. Every note you don't play is still heard. Build to a single peak note and let the delay carry it into infinity.",
      tone: "Black Strat (neck pickup) → Big Muff fuzz → Hiwatt amp cranked + WEM cabs → BBD delay (set to dotted eighth) → reverb. Compressor before the fuzz for sustain.",
      practiceSession: [
        {
          label: "Warm Up",
          duration: "5 min",
          description: "Set a delay to dotted-eighth note timing. Play a single note. Let the delay repeat. Now play the next note EXACTLY on the 3rd delay repeat. Listen: you've created a rhythmic pattern with one note and silence.",
        },
        {
          label: "Core Technique",
          duration: "10 min",
          description: "Practice slow, controlled bends on the B string (10th fret, bend up a whole step to B). The bend should take 2 full beats to reach the top. Hold it there for 2 more beats with slight vibrato. Then release it over 2 beats.",
        },
        {
          label: "Apply It",
          duration: "10 min",
          description: "Play over a slow D minor progression. Allow 8 full bars of space between each phrase. Play no more than 3 phrases in 2 minutes. For each phrase, bend to the peak note slowly, sustain it, then resolve.",
        },
      ],
    },
    tabs: [
      {
        title: "The Slow Bend",
        technique: "Patient, held bends — the bend itself is the musical event, not a technique to get to the next note",
        tab: `e|----------------------------------------------|
B|------10b12~~~----10--8--10b12~-------------|
G|--9------------------------------------------------|
D|----------------------------------------------|
A|----------------------------------------------|
E|----------------------------------------------|

Key of D Dorian — 9th fret area
G string 9 = E (2nd of D)
B string 10 = A (5th of D), bend to B (Dorian natural 6th)
The bend takes 2–4 full beats — do not rush`,
        howToPlay: [
          "Pick the G string 9th fret (E) — just one note. Hold it for a full beat. This note is the 'inhale' before the bend.",
          "Move to the B string 10th fret (A, the 5th of D). Begin bending upward — but slowly. The target is the pitch of the 12th fret (B, the Dorian natural 6th). This bend should take 2 full beats to arrive.",
          "Hold the bent B note at the top for 2 more beats. Add slow vibrato by gently pulsing pressure on the string. The note should waver like a voice holding a high note.",
          "Release the bend slowly over 2 beats — back down to A. Descend: B string 10th (A), 8th (G), then bend again from 10th to 12th.",
          "If the bend feels fast, it's too fast. Gilmour's bends are uncomfortably slow — that patience is precisely what creates the emotional weight.",
        ],
        tags: ["slow bend", "patient bending", "Dorian natural 6th", "D Dorian"],
      },
      {
        title: "Dotted-Eighth Phrase",
        technique: "Playing with — and against — a dotted-eighth delay to create rhythmic patterns from single notes",
        tab: `e|--10-----------10-----------10------------|
B|------12~-----------12~-----------12~----|
G|------------------------------------------|
D|------------------------------------------|
A|------------------------------------------|
E|------------------------------------------|

Set delay to dotted-eighth (at 80 BPM ≈ 563ms)
Each note lands on a delay repeat from the previous note
Space between notes is filled by the echo`,
        howToPlay: [
          "Set your delay to dotted-eighth note timing. At 80 BPM this is about 563ms. Use a generous amount of repeats (3–4 echoes).",
          "Pick the e string 10th fret (D). Wait — count 3 beats. The delay repeats will fill the silence rhythmically.",
          "On beat 4 (or the 3rd delay repeat), pick the B string 12th fret (B). Let that ring and repeat.",
          "Keep alternating between these two notes, allowing the delay to carry the in-between beats. You are playing every 3 beats; the delay fills the other 3.",
          "Notice: you are barely playing anything, yet the phrase sounds full and rhythmically complex. This is the fundamental Gilmour technique — one note plus silence, multiplied by delay, equals a complete musical statement.",
        ],
        tags: ["dotted-eighth delay", "rhythmic delay", "space", "echo phrasing"],
      },
    ],
    workflow: [
      {
        step_number: 1,
        title: "Dotted-Eighth Delay",
        description:
          "Sets his delay to a dotted-eighth note value — which creates a syncopated, cascading repeat that falls between the beats rather than on them. This is the rhythmic engine behind Comfortably Numb, Run Like Hell, and Another Brick in the Wall.",
        technique_tags: ["dotted eighth delay", "rhythmic delay", "echo"],
      },
      {
        step_number: 2,
        title: "The Slow Bend",
        description:
          "Bends notes over 2–4 beats rather than instantaneously — the pitch rises gradually, creating a vocal, crying quality. Combined with long sustain and compression, the note blooms rather than attacks.",
        technique_tags: ["slow bend", "sustained bends", "vibrato"],
      },
      {
        step_number: 3,
        title: "Dorian Colour",
        description:
          "Uses the Dorian mode over minor chord progressions — the natural 6th degree adds a major brightness to an otherwise minor palette. The move from the minor pentatonic down to the Dorian's 6th creates an instantly recognisable sound.",
        technique_tags: ["Dorian mode", "natural 6th", "colour notes"],
      },
      {
        step_number: 4,
        title: "Compression + Big Muff Stack",
        description:
          "Runs a compressor pedal before the Big Muff fuzz, giving infinite sustain that allows notes to hold for 10+ seconds without fading. The compressor evens the attack and extends the decay — the sustain IS the tone.",
        technique_tags: ["compressor", "Big Muff", "sustain"],
      },
      {
        step_number: 5,
        title: "Spatial Phrasing",
        description:
          "Leaves 4–8 bars of silence between phrases. The phrases themselves are short, melodic, and singable. Each phrase lands on a structural beat and then lets the delay create rhythmic movement in the silence.",
        technique_tags: ["space", "melodic phrasing", "silence"],
      },
    ],
  },
  {
    id: "carlos-santana",
    name: "Carlos Santana",
    era: "1966–present",
    genre: "Latin Rock / Blues Rock",
    signature_sound:
      "Singing, organ-like sustain fused with Afro-Cuban rhythms and blues scales. The tone is so vocal it needs no words — the guitar sings in complete sentences.",
    influences: ["B.B. King", "Gabor Szabo", "Miles Davis", "John Coltrane", "Wes Montgomery"],
    formula: {
      scales: ["Dorian Mode", "Minor Pentatonic", "Blues Scale"],
      signatureMove: "Sustain a single note with light distortion and medium-slow vibrato until it feeds back slightly — then resolve it to a chord tone. The sustain does the emotional work, not the notes.",
      mindset: "The guitar is a voice, not an instrument. Every phrase should communicate something specific — joy, longing, ecstasy. If you can't identify the emotion, the phrase isn't finished.",
      tone: "PRS or Les Paul (neck pickup) → Mesa/Boogie amp slightly overdriven → medium reverb. No heavy fuzz — the sustain comes from the amp's natural compression at volume.",
      practiceSession: [
        {
          label: "Warm Up",
          duration: "5 min",
          description: "Set your amp for a warm, slightly overdriven tone. Play a single D note. Hold it. Let it sustain. Add slow vibrato. The goal: keep that one note alive and emotional for 8 full beats using only vibrato and pick attack variations.",
        },
        {
          label: "Core Technique",
          duration: "10 min",
          description: "Practice the Dorian mode in A: A–B–C–D–E–F#–G. The F# (natural 6th) is the Santana note. Build phrases that specifically target F# as a colour note, approaching it from below (E) and above (G).",
        },
        {
          label: "Apply It",
          duration: "10 min",
          description: "Play over an Am–D vamp. Pick one phrase and repeat it with variations — Santana believes in developing a melodic idea rather than playing new ideas constantly. Four variations of one phrase beats four separate phrases.",
        },
      ],
    },
    tabs: [
      {
        title: "Dorian Colour Phrase",
        technique: "A minor pentatonic with the Dorian natural 6th (F#) as a melodic peak note — the defining Santana sound",
        tab: `e|--8~~~~--5--8b10~~~~--10--8--5--|
B|----------------------------7---|
G|--------------------------------|
D|--------------------------------|
A|--------------------------------|
E|--------------------------------|

Key of A Dorian
e fret 8 = C (held with vibrato)
e fret 8b10 = C bent to D (whole step)
B fret 7 = F# — the Dorian natural 6th, the "Santana note"`,
        howToPlay: [
          "Begin on e string 8th fret (C). Hold it. Add wide, medium-speed vibrato immediately — not slow like Clapton or frantic like a nervous player. Santana's vibrato is confident and vocal.",
          "Descend to 5th fret (A), then bend from 8th fret (C) up a whole step to the 10th fret pitch (D). Hold the bend for 2 beats.",
          "Descend from the bend: 10th fret (D), 8th fret (C), 5th fret (A).",
          "Move to the B string 7th fret (F#) — THIS is the Dorian natural 6th. It's brighter than the surrounding pentatonic notes. Let it ring with vibrato. This is the 'Santana note' — it appears at the end of his phrases like a signature.",
          "The F# on the B string should feel like a ray of light — warmer and more major than the surrounding minor context. Emphasise it slightly to make it land as a melodic peak.",
        ],
        tags: ["Dorian mode", "natural 6th", "vibrato", "A Dorian"],
      },
      {
        title: "The Sustain Phrase",
        technique: "Holding a single note with vibrato until the amp feeds back slightly — using sustain as an expressive tool",
        tab: `e|--12~~~~~~~~~~~~~~~~~~~~--|
B|--------------------------|
G|--------------------------|
D|--------------------------|
A|--------------------------|
E|--------------------------|

Single note: e string 12th fret (E)
Hold for 8+ beats with sustained vibrato
Let the note bloom and slightly feed back
The sustain IS the technique — no other notes needed`,
        howToPlay: [
          "Set your amp to a warm, slightly overdriven tone. Not distorted — just past clean, where notes begin to sustain naturally.",
          "Pick the e string 12th fret (E) firmly. Let it ring.",
          "After 1 beat, begin adding vibrato — a medium-speed, wide pivot from the wrist. Not a shake; more like a continuous gentle wavering.",
          "Now: hold the note for 8 full beats. Don't let it die. If it starts to fade, pick it again lightly. Santana maintains note life through vibrato pressure, not re-picking.",
          "If your amp is loud enough, the note may begin to feed back slightly. Lean toward or away from the amp to control the feedback pitch. This feedback management is a real performance skill — Santana uses it deliberately to sustain notes beyond what the strings alone can produce.",
        ],
        tags: ["sustain", "vibrato", "feedback", "single note expression"],
      },
    ],
    workflow: [
      {
        step_number: 1,
        title: "Dorian as Home Base",
        description:
          "Uses the Dorian mode rather than pure minor pentatonic as his primary scale. The natural 6th in Dorian gives his lines a Latin, slightly major flavour over minor chord changes. Specifically targets the 6th degree as a melodic peak note.",
        technique_tags: ["Dorian mode", "natural 6th", "Latin flavour"],
      },
      {
        step_number: 2,
        title: "Singing Sustain",
        description:
          "Achieves infinite sustain by playing at high amp volume with medium overdrive, allowing the amp's output tubes to compress and feed the note back into the pickups. The sustain makes the guitar literally sing — notes hold for 5–10 seconds without dying.",
        technique_tags: ["sustain", "amp compression", "tube overdrive"],
      },
      {
        step_number: 3,
        title: "Rhythmic Displacement",
        description:
          "Superimposes phrase rhythms across the bar line — a phrase that starts on beat 3 and resolves on the 'and' of beat 1 in the next bar. This cross-bar phrasing creates rhythmic tension rooted in Afro-Cuban clave patterns.",
        technique_tags: ["cross-bar phrasing", "rhythmic displacement", "clave"],
      },
      {
        step_number: 4,
        title: "Melodic Development",
        description:
          "Takes a single short phrase and repeats it with small variations — changing the rhythm, the ending, or the starting note — rather than constantly playing new ideas. This motivic development is what gives his playing narrative structure.",
        technique_tags: ["motivic development", "phrase variation", "melodic structure"],
      },
      {
        step_number: 5,
        title: "Tone as Priority",
        description:
          "Spends more time on tone setup than most guitarists spend on practice. The Mesa/Boogie amp, the PRS guitar with specific pickup windings, the precise overdrive setting — all dialled in before a single note is played.",
        technique_tags: ["tone shaping", "Mesa/Boogie", "pickup selection"],
      },
    ],
  },
  {
    id: "mark-knopfler",
    name: "Mark Knopfler",
    era: "1977–present",
    genre: "Rock / Folk / Blues",
    signature_sound:
      "Fingerpicked Strat tone that is simultaneously crisp and warm — each string perfectly articulated, no pick, no fuss. Melody always leads; technique never shows off.",
    influences: ["Chet Atkins", "Scotty Moore", "BB King", "JJ Cale", "Django Reinhardt"],
    formula: {
      scales: ["Minor Pentatonic", "Mixolydian Mode", "Country-blues hybrid runs"],
      signatureMove: "Fingerpick with thumb and first two fingers — thumb handles bass strings, fingers snap the treble strings upward, creating a crisp, percussive attack impossible with a pick",
      mindset: "Melody is the boss. Every lick serves the song. Never play anything you wouldn't sing over the track — if it doesn't fit melodically, it doesn't fit.",
      tone: "Strat (neck or middle pickup, tone rolled slightly back) → clean Fender or Marshall → light compression → subtle reverb. No distortion — the snap comes from the fingers.",
      practiceSession: [
        {
          label: "Warm Up",
          duration: "5 min",
          description: "Put down the pick. Use your thumb on the E, A, and D strings, index finger on G, middle finger on B and high-e. Play through the pentatonic scale fingerstyle. Make each note snap slightly — pluck upward with the fingertip.",
        },
        {
          label: "Core Technique",
          duration: "10 min",
          description: "Practice Mixolydian in G (G–A–B–C–D–E–F–G). The flat 7th (F natural) is the Knopfler note. Build licks that use F natural as a passing note resolving down to E. This flat-7 to 6th movement is the foundation of his melodic vocabulary.",
        },
        {
          label: "Apply It",
          duration: "10 min",
          description: "Play over a G Mixolydian groove. Fingerpick entirely. Focus on tone — listen to each note ring clearly. Ask: would this phrase work as a vocal melody? If yes, keep it. If it sounds like a scale exercise, stop and simplify.",
        },
      ],
    },
    tabs: [
      {
        title: "Mixolydian Pedal Tone",
        technique: "Flat 7th over a constant pedal tone — the Mixolydian sound that defines Knopfler's guitar voice",
        tab: `e|--5--7--5--3--5--7--5--|
B|--5--5--5--5--5--5--5--|
G|-----------------------|
D|-----------------------|
A|-----------------------|
E|-----------------------|

Key of A Mixolydian — fingerpicked, no pick
B string (5th fret = E) is the constant pedal tone
e fret 3 = G (the flat 7th of A — the Mixolydian note)
Thumb plays bass strings if needed`,
        howToPlay: [
          "Put your pick down. Use your middle finger to pluck the B string 5th fret (E) as a constant pedal tone throughout — this note does not change.",
          "Use your index finger to play the melody on the high e string: 5 (A), 7 (B), 5 (A), 3 (G — the flat 7th!), 5 (A), 7 (B), 5 (A).",
          "The e string 3rd fret (G) is the Mixolydian flat 7th of A. This note — between the scale's 6th (F#) and octave (A) — is what gives Knopfler's phrases their Southern, Dire Straits character. Hear how it's different from A minor (which would use G# instead).",
          "Pluck the melody notes upward with your fingertip nail-edge — a slight 'snap'. The crisp attack is the fingerstyle equivalent of a sharp plectrum hit.",
          "Keep the pedal tone ringing throughout every melody note. When both ring together, that's the Knopfler sound — melody floating over a sustained bass note.",
        ],
        tags: ["Mixolydian", "flat 7th", "pedal tone", "fingerstyle"],
      },
      {
        title: "Open String Cascade",
        technique: "Ringing open string chord voicings — fretted notes combined with open strings for a piano-like harmonic texture",
        tab: `e|--0--3--0--2--0---------|
B|--3--3--1--1--0---------|
G|--0--0--0--2--0---------|
D|--2--0--2--0--0---------|
A|--3--2--3--x--2---------|
E|--x--3--x--x--0---------|

Each shape: let all strings ring, don't mute
Cadd9 → G → Am7 → Dsus2 → Em (open)
Play with fingers — let each chord bloom`,
        howToPlay: [
          "These are all open-string-heavy chord voicings. The key rule: let every string ring. Don't mute anything. The ringing open strings are the whole point.",
          "Cadd9 (x32030): A string 3rd (C), D string 2nd (E), G string open (G), B string 3rd (D), e string open (E). The open G and e strings ring against the fretted notes — cascading, piano-like.",
          "Move to G major (320033): the open D, G, B strings all ring through the chord change. You should hear the previous chord fading into the new one.",
          "The technique: arpeggiate (pluck strings individually) rather than strum. Let each note of the chord bloom before the next. This fingerstyle arpeggio creates Knopfler's 'harp' quality.",
          "For the final Em open chord, all 6 strings can ring freely. Practice going from Cadd9 to G to Em, letting each chord's open strings sustain into the next — that cascade of ringing harmonics is Knopfler's signature acoustic sound.",
        ],
        tags: ["open string voicings", "ringing chords", "fingerstyle arpeggio", "cascading harmonics"],
      },
    ],
    workflow: [
      {
        step_number: 1,
        title: "Fingers Only — No Pick",
        description:
          "Plays entirely fingerstyle — thumb handles low strings, fingers snap high strings upward. The fingertip attack creates a percussive snap on each note that a plectrum cannot replicate.",
        technique_tags: ["fingerstyle", "no pick", "thumb technique"],
      },
      {
        step_number: 2,
        title: "Mixolydian Foundation",
        description:
          "Uses the Mixolydian mode (major scale with a flat 7th) over dominant and major chord progressions — giving his lines a Southern, country-blues character. The flat 7th is his most-used colour note.",
        technique_tags: ["Mixolydian", "flat 7th", "country blues"],
      },
      {
        step_number: 3,
        title: "Melody-Led Improvisation",
        description:
          "Never plays scale runs or pattern-based lines. Every improvised phrase is a melody — something singable, with a beginning, peak, and resolution. The guitar part could be sung back by a listener.",
        technique_tags: ["melodic improvisation", "singable phrases", "no scale runs"],
      },
      {
        step_number: 4,
        title: "Open-String Voicings",
        description:
          "Exploits open-string chord voicings that create ringing, piano-like harmonies. Partial chord shapes combined with open strings produce voicings that ring on even when the fretting hand moves.",
        technique_tags: ["open strings", "voicings", "ringing chords"],
      },
      {
        step_number: 5,
        title: "Tone Placement",
        description:
          "Picks at different positions along the string — near the bridge for bright and snappy; near the neck for warm and dark — mid-performance. This positional variation creates tonal contrast without touching a single knob.",
        technique_tags: ["picking position", "tonal contrast", "right-hand placement"],
      },
    ],
  },
]

type ViewMode = "formula" | "tabs" | "workflow"

// ─── Sub-components ───────────────────────────────────────────────────────────

function TechniqueTag({ label }: { label: string }) {
  return (
    <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">
      {label}
    </span>
  )
}

function GuitaristHeader({ guitarist }: { guitarist: Guitarist }) {
  return (
    <div className="bg-gradient-to-r from-purple-900/50 to-slate-900/50 border border-white/10 rounded-2xl p-6 mb-6">
      <div className="mb-3">
        <h2 className="text-2xl font-bold text-white">{guitarist.name}</h2>
        <div className="flex flex-wrap gap-2 mt-1">
          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-600/40 text-purple-200 border border-purple-500/30">
            {guitarist.era}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-purple-200 border border-white/20">
            {guitarist.genre}
          </span>
        </div>
      </div>
      <p className="text-white/80 text-sm leading-relaxed mb-4">{guitarist.signature_sound}</p>
      <div>
        <p className="text-purple-400 text-xs uppercase tracking-wider mb-2 font-semibold">Key Influences</p>
        <div className="flex flex-wrap gap-2">
          {guitarist.influences.map(name => (
            <span key={name} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-purple-300 border border-white/10">
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function FormulaView({ guitarist }: { guitarist: Guitarist }) {
  const { formula } = guitarist
  const practiceColors = [
    { border: "border-blue-500/40", bg: "bg-blue-500/10", label: "bg-blue-500", text: "text-blue-200" },
    { border: "border-amber-500/40", bg: "bg-amber-500/10", label: "bg-amber-500", text: "text-amber-200" },
    { border: "border-emerald-500/40", bg: "bg-emerald-500/10", label: "bg-emerald-500", text: "text-emerald-200" },
  ]
  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-br from-purple-900/60 to-slate-900/60 border border-purple-500/30 rounded-2xl p-6">
        <p className="text-purple-400 text-xs uppercase tracking-wider mb-5 font-bold">
          The {guitarist.name.split(" ")[0]} Formula
        </p>
        <div className="grid sm:grid-cols-2 gap-4 mb-5">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2">Scales</p>
            <div className="flex flex-col gap-1.5">
              {formula.scales.map(s => (
                <span key={s} className="text-sm text-white font-medium">• {s}</span>
              ))}
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2">Tone Setup</p>
            <p className="text-sm text-purple-200 leading-relaxed">{formula.tone}</p>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
          <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">Signature Move</p>
          <p className="text-sm text-white leading-relaxed">{formula.signatureMove}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">The Mindset</p>
          <p className="text-sm text-white leading-relaxed italic">&ldquo;{formula.mindset}&rdquo;</p>
        </div>
      </div>
      <div>
        <p className="text-purple-400 text-xs uppercase tracking-wider mb-4 font-bold">25-Min Practice Session</p>
        <div className="space-y-3">
          {formula.practiceSession.map((step, i) => {
            const c = practiceColors[i]
            return (
              <div key={i} className={`border ${c.border} ${c.bg} rounded-2xl p-5`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-xs font-bold text-slate-900 px-2.5 py-1 rounded-lg ${c.label}`}>
                    {step.label}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{step.duration}</span>
                </div>
                <p className={`text-sm leading-relaxed ${c.text}`}>{step.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function TabsView({ guitarist }: { guitarist: Guitarist }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const tab = guitarist.tabs[activeIdx]

  return (
    <div>
      {/* Tab selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {guitarist.tabs.map((t, i) => (
          <button
            key={i}
            onClick={() => setActiveIdx(i)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeIdx === i
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-purple-300 hover:bg-white/20"
            }`}
          >
            {t.title}
          </button>
        ))}
      </div>

      {/* Technique badge */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-5">
        <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">Technique Focus</p>
        <p className="text-sm text-amber-100 leading-relaxed">{tab.technique}</p>
      </div>

      {/* Tuning note */}
      {tab.tuning && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 mb-5 flex items-center gap-2">
          <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">Tuning:</span>
          <span className="text-blue-200 text-sm font-mono">{tab.tuning}</span>
        </div>
      )}

      {/* TAB notation */}
      <div className="mb-6">
        <p className="text-purple-400 text-xs uppercase tracking-wider mb-3 font-semibold">TAB</p>
        <AsciiTab text={tab.tab} />
      </div>

      {/* How to play */}
      <div className="mb-6">
        <p className="text-purple-400 text-xs uppercase tracking-wider mb-4 font-semibold">How to Play It</p>
        <div className="space-y-3">
          {tab.howToPlay.map((step, i) => (
            <div key={i} className="flex gap-4 bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xs shrink-0 mt-0.5">
                {i + 1}
              </div>
              <p className="text-purple-200 text-sm leading-relaxed">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {tab.tags.map(tag => <TechniqueTag key={tag} label={tag} />)}
      </div>
    </div>
  )
}

function WorkflowView({ guitarist }: { guitarist: Guitarist }) {
  return (
    <div>
      <p className="text-purple-400 text-xs uppercase tracking-wider mb-4 font-semibold">
        Technique Breakdown — {guitarist.workflow.length} Steps
      </p>
      {guitarist.workflow.map(step => (
        <WorkflowStep key={step.step_number} step={step} />
      ))}
    </div>
  )
}

function WorkflowStep({ step }: { step: WorkflowStep }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className={`border rounded-2xl mb-3 transition-all overflow-hidden ${
        open ? "bg-white/10 border-purple-500/50" : "bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/20"
      }`}
    >
      <button onClick={() => setOpen(p => !p)} className="w-full flex items-center gap-4 px-5 py-4 text-left">
        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 transition-colors ${open ? "bg-purple-500" : "bg-purple-800"}`}>
          {step.step_number}
        </div>
        <span className={`font-semibold flex-1 text-sm ${open ? "text-white" : "text-purple-200"}`}>
          {step.title}
        </span>
        <div className="flex items-center gap-2 shrink-0">
          {!open && (
            <div className="hidden sm:flex flex-wrap gap-1">
              {step.technique_tags.slice(0, 2).map(tag => (
                <TechniqueTag key={tag} label={tag} />
              ))}
            </div>
          )}
          <span className={`text-purple-400 text-xs font-bold transition-transform duration-200 ${open ? "rotate-180" : ""}`}>▼</span>
        </div>
      </button>
      {open && (
        <div className="px-5 pb-5">
          <div className="border-t border-white/10 pt-4">
            <p className="text-purple-200 text-sm leading-relaxed mb-4">{step.description}</p>
            <div className="flex flex-wrap gap-1.5">
              {step.technique_tags.map(tag => <TechniqueTag key={tag} label={tag} />)}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GuitaristWorkflowPage() {
  const [selectedId, setSelectedId] = useState<string>(GUITARISTS[0].id)
  const [viewMode, setViewMode]     = useState<ViewMode>("formula")

  const guitarist = GUITARISTS.find(g => g.id === selectedId)!

  const VIEW_TABS: { id: ViewMode; label: string }[] = [
    { id: "formula",  label: "✦ Formula" },
    { id: "tabs",     label: "♩ Tabs" },
    { id: "workflow", label: "▤ Breakdown" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">

        <div className="mb-6">
          <Link href="/" className="text-purple-300 hover:text-white text-sm">← Back to modules</Link>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">Guitarist Workflow</h1>
          <p className="text-purple-200">The formula, tabs, and techniques behind how legendary guitarists play.</p>
        </div>

        {/* Guitarist selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {GUITARISTS.map(g => (
            <button
              key={g.id}
              onClick={() => { setSelectedId(g.id); setViewMode("formula") }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                selectedId === g.id
                  ? "bg-purple-600 text-white"
                  : "bg-white/10 text-purple-300 hover:bg-white/20"
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div className="flex gap-2 mb-6">
          {VIEW_TABS.map(v => (
            <button
              key={v.id}
              onClick={() => setViewMode(v.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                viewMode === v.id
                  ? "bg-amber-500 text-slate-900"
                  : "bg-white/10 text-purple-300 hover:bg-white/20"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        {/* Guitarist header */}
        <GuitaristHeader guitarist={guitarist} />

        {/* Content */}
        {viewMode === "formula"  && <FormulaView guitarist={guitarist} />}
        {viewMode === "tabs"     && <TabsView    guitarist={guitarist} />}
        {viewMode === "workflow" && <WorkflowView guitarist={guitarist} />}

      </div>
    </div>
  )
}
