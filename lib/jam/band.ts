import type { GenreId } from "./genres"
import { getTab, type Slot, type TabInput, type TabSpec } from "./tabs"

export interface Band {
  guitars: 1 | 2 | 3
  bass: boolean
  piano: boolean
  harmonica: boolean
}

export const DEFAULT_BAND: Band = { guitars: 2, bass: false, piano: false, harmonica: false }

export function parseBand(raw: unknown): Band | null {
  if (typeof raw !== "object" || raw === null) return null
  const b = raw as Record<string, unknown>
  const g = b.guitars
  return {
    guitars: g === 1 || g === 2 || g === 3 ? g : DEFAULT_BAND.guitars,
    bass: b.bass === true,
    piano: b.piano === true,
    harmonica: b.harmonica === true,
  }
}

export type GuidanceGenre = GenreId | "general"

export interface BandRole {
  who: string
  role: string
  tip: string
  tab?: TabSpec
}

type Part = [role: string, tip: string]

interface GenreParts {
  solo: Part
  g1: Part
  g2: Part
  g3: Part
  bass: Part
  piano: Part
  harp: Part
}

const PARTS: Record<GuidanceGenre, GenreParts> = {
  general: {
    solo: ["Chords and fills", "Strum full chords. Between lines, play a simple bass-note walk or a short melody lick."],
    g1: ["Rhythm", "Play full open chords with a steady strum. You are the foundation."],
    g2: ["Color", "Use a capo up the neck (try fret 5 to 7) or play only the top three strings so you sit above Guitar 1."],
    g3: ["Fills and melody", "Play single-note lines, double-stops or arpeggios. Fill the gaps, not the whole space."],
    bass: ["Roots and fifths", "Lock with the kick drum or the strumming. Play the root on beat 1 and add the fifth for movement."],
    piano: ["Pads and comping", "Hold simple chords in the middle of the keyboard. Keep the left hand on root notes."],
    harp: ["Fills and chords", "Play in the gaps between vocal lines. Hold a few long notes on the chord tones, or chug a rhythm in the verse."],
  },
  funk: {
    solo: ["Scratch rhythm", "Mute the strings with your fretting hand and play steady 16th scratches. Hit two or three note chords on accents."],
    g1: ["Scratch rhythm", "Constant 16th-note scratches. Land short 9th chord stabs on the off-beats. Keep your strumming hand moving."],
    g2: ["Stabs on top", "Play 2-3 note chords on the top strings, high up the neck. Stay out of Guitar 1's pocket by hitting different beats."],
    g3: ["Lick and answer", "Answer the groove with short pentatonic licks in the gaps. Think horn lines."],
    bass: ["The pocket", "Play the root on the 1 and syncopate around it. Use ghost notes and leave space on the 2."],
    piano: ["Clavinet stabs", "Short staccato chords on the off-beats. Use 9th and 13th chords, never hold them long."],
    harp: ["Rhythm riffs", "Short, tight chops on the off-beats with a hand wah. Stay out of the way of the horns and the guitar stabs."],
  },
  alternative: {
    solo: ["Ringing chords", "Use open chords with an added 9th or a sus. Let the notes ring and vary the strumming between verse and chorus."],
    g1: ["Driving rhythm", "Strum steady 8ths with open or add9 chords. Hold the energy low in verses and open up in choruses."],
    g2: ["Texture", "Play single-note lines, harmonics or delayed arpeggios on top. Use reverb and delay. Sustain, not strum."],
    g3: ["Ambient layer", "Hold long swells or drones. Pick one note from the chord and let it hang."],
    bass: ["Driving root", "Steady 8th-note roots. Add a melodic fill into the chorus."],
    piano: ["Simple pads", "Play whole-note chords or a repeated 8th-note pattern. Keep it simple and let the guitars fill the space."],
    harp: ["Held notes", "Hold one or two long breaths from the chord. Pick one hole and let it ring, then move on."],
  },
  jazz: {
    solo: ["Chord melody", "Play 3-4 note shell voicings (root, 3rd, 7th) and add a melody note on top where you can."],
    g1: ["Comping", "Play shell voicings on the middle strings, rhythmically (the 'and' of 2 or 4). Leave space."],
    g2: ["Lead / melody", "Play the melody or solo with single notes. Outline the chord tones: 3rd and 7th."],
    g3: ["Counter-line", "Play simple harmony notes or rhythmic comping on the top three strings, but only when Guitar 1 is laying out."],
    bass: ["Walking bass", "Quarter-note walking line. Land on the chord root on beat 1 and approach the next chord by half step."],
    piano: ["Comping", "Rootless voicings (3rd, 7th and a 9th or 13th) and leave the root to the bass. Leave room for soloists."],
    harp: ["Melody and fills", "Play the tune or a short fill on chord tones. A chromatic harp or a harp in the right key helps. Lay out when the guitar solos."],
  },
  blues: {
    solo: ["Rhythm and licks", "Play a shuffle on the low strings, then answer yourself with a pentatonic lick at the end of each phrase."],
    g1: ["Shuffle rhythm", "Play the shuffle on the low strings: root and fifth, then root and sixth, alternating. Keep the groove."],
    g2: ["Lead", "Play call-and-response licks from the minor pentatonic (try the blues scale for the b5 spice)."],
    g3: ["Second rhythm", "Play 7th chord stabs on the top strings, on the off-beat. Just 2-3 notes."],
    bass: ["Walking bass", "Walk root-3rd-5th-6th through each chord. Land hard on the root when the chord changes."],
    piano: ["Boogie or comp", "Left hand plays the shuffle bass line, right hand plays 7th chord stabs and fills in the gaps."],
    harp: ["Cross harp", "The classic blues sound. Play in 2nd position: chug a rhythm in the verse and answer the vocal with a draw-note lick at the end of each line."],
  },
  country: {
    solo: ["Boom-chick", "Pick the bass note on beat 1 and 3, strum on 2 and 4. Fill with a lick at the end of lines."],
    g1: ["Boom-chick strum", "Alternate bass notes with down-up strums. Keep it steady."],
    g2: ["Lead / fills", "Play pentatonic licks and double-stops between vocal phrases. A capo at 2 to 5 gives it twang."],
    g3: ["Pedal steel feel", "Play slide-ish bends or high 3rd and 6th harmonies up the neck."],
    bass: ["Root-fifth", "Alternate the root and fifth on beats 1 and 3. Stay simple."],
    piano: ["Honky-tonk", "Play slip-note chords (2-3 notes) with a quick grace note up to the main chord tone. Right hand is the star, left hand keeps time."],
    harp: ["Train rhythm and fills", "Chug a train rhythm in the verse. Fill the gaps between lines with a few chord tones, and add a long draw note on the last chord."],
  },
  pop: {
    solo: ["Strum with dynamics", "Strum full chords and pick up the intensity in the chorus. A bit of palm mute in the verse helps."],
    g1: ["Rhythm strum", "Strum steady 8ths on open chords. Palm-mute in verses, open in choruses."],
    g2: ["Capo and shimmer", "Capo at 5 or 7 and play a different shape on top. Let it ring."],
    g3: ["Hook or arpeggio", "Play the hook, riff or a picked arpeggio. Keep it repeating."],
    bass: ["Steady 8ths", "Play steady root 8ths in verses, then add movement into the chorus."],
    piano: ["Block or broken chords", "Play block chords on the downbeats or broken-chord patterns in 8ths."],
    harp: ["Hook and fills", "Play the hook or a few held notes in the chorus. Stay quiet in the verse so the vocal can lead."],
  },
  folk: {
    solo: ["Strum or fingerpick", "Strum open chords with a steady down-down-up pattern or pick a simple Travis pattern."],
    g1: ["Strummed rhythm", "Strum open chords with a down-down-up-up-down-up pattern. Keep it strong and clear."],
    g2: ["Fingerpicking", "Pick arpeggios or a Travis pattern over Guitar 1's strum. Capo up for brightness."],
    g3: ["Harmony or lead", "Play a simple melody or a third above the vocal. Don't crowd it."],
    bass: ["Roots", "Hold root notes with the downbeats. Add a walk-up into the next chord."],
    piano: ["Soft chords", "Play simple root-position chords softly, or a gentle arpeggio. Think dynamics."],
    harp: ["Held notes and melody", "Play long, soft notes on the chord tones or the vocal melody. Take the break between verses. Think Dylan and Neil Young."],
  },
  reggae: {
    solo: ["Skank", "Play short muted chords on the off-beats (the 'and' of each beat, or beats 2 and 4), on the top 3 or 4 strings only."],
    g1: ["The skank", "Chop chords on the off-beat (the 'and' of each beat), top 3-4 strings. Short and dry."],
    g2: ["Melodic picking", "Play a double skank or a picked lick. Keep it lighter than Guitar 1, stay around the high notes."],
    g3: ["Dub fills", "Add delay and play sparse single-note licks in the gaps."],
    bass: ["The lead voice", "Reggae bass is melodic and heavy. Leave space on beat 1, lock in with the drummer's one-drop accent on beat 3, and let notes sustain."],
    piano: ["Organ bubble", "Play short chords on the off-beat, and an organ 'bubble' pattern in 8ths. Use a warm organ sound if you can."],
    harp: ["Off-beat chops", "Chop short chords on the off-beat, like the guitar skank, or play a sparse held note. Leave a lot of space."],
  },
  gospel: {
    solo: ["Strum and walk", "Play full chords with passing chords. Walk up to the next chord with a bass run."],
    g1: ["Rhythm", "Play full chords and add 7ths. Use slash chords to walk the bass line."],
    g2: ["Fills and swells", "Use sustained triads and sweeping fills. Respond to the vocal line."],
    g3: ["Harmony", "Play a high-register line a third or sixth above the lead."],
    bass: ["Walking and runs", "Play root notes and add passing tones into chord changes. Build intensity in the chorus."],
    piano: ["Lead instrument", "Hold the harmony: full voicings, passing chords, fills between lines. Lead the congregation."],
    harp: ["Pads and swells", "Hold warm, long breaths under the singer. Swell into the chord changes and play only when the voices rest."],
  },
  rock: {
    solo: ["Power chords", "Play power chords with palm-muted 8ths in verses. Open up in choruses."],
    g1: ["Rhythm", "Play power chords or open chords with steady 8ths. Palm-mute the verse, open for the chorus."],
    g2: ["Lead / riffs", "Play the riff or lead lines. Switch to a pentatonic solo in the break."],
    g3: ["Harmony / fills", "Play octave lines, harmonies or open chords against Guitar 1's power chords."],
    bass: ["Lock with the kick", "Play steady root 8ths and match the kick drum. Add a fill into each section."],
    piano: ["Rock piano", "Play block chords and 8th-note repeats. Add a Hammond-style swell or a boogie left hand."],
    harp: ["Cross harp riff", "Chug 8ths in the verse and play a loud held note in the chorus. Take a draw-note lick in the break."],
  },
}

export function getGuidance(band: Band, genre: GuidanceGenre, input?: TabInput): { roles: BandRole[]; extras: string[] } {
  const p = PARTS[genre]
  const roles: BandRole[] = []
  const add = (who: string, slot: Slot) => roles.push({ who, role: p[slot][0], tip: p[slot][1], tab: getTab(genre, slot, input) })

  if (band.guitars === 1) {
    add("Guitar", "solo")
  } else {
    add("Guitar 1", "g1")
    add("Guitar 2", "g2")
    if (band.guitars === 3) add("Guitar 3", "g3")
  }
  if (band.bass) add("Bass", "bass")
  if (band.piano) add("Piano", "piano")
  if (band.harmonica) add("Harmonica", "harp")

  const extras: string[] = []
  if (!band.bass) {
    extras.push(
      band.piano
        ? "No bass: piano left hand plays the root on beat 1 of each chord. Guitars can lighten up on the low strings."
        : "No bass: Guitar 1 plays the root note on the low strings first, then the rest of the chord."
    )
  }
  if (band.piano && band.guitars > 1) {
    extras.push("With piano and 2+ guitars: guitars stay above the 3rd fret or mute the low strings. Leave the low-middle range to the piano and bass.")
  }
  if (band.guitars >= 2) {
    extras.push("Two guitars playing the same open chords sounds muddy. Use a capo or different voicings so you sit in different registers.")
  }
  if (band.guitars === 3) {
    extras.push("Three guitars: take turns. When Guitar 3 plays a fill, the others drop to quiet or half-time.")
  }
  if (band.harmonica) {
    extras.push("Harmonica: play in the gaps between vocal lines and don't fight the lead guitar for the same space. Check each tab for the harp key to bring.")
  }
  const players = band.guitars + (band.bass ? 1 : 0) + (band.piano ? 1 : 0) + (band.harmonica ? 1 : 0)
  if (players >= 3) {
    extras.push("Everybody plays quieter in the verse and bigger in the chorus. The song should breathe.")
  }
  return { roles, extras }
}

export function bandSummary(band: Band): string {
  const parts = [`${band.guitars} guitar${band.guitars > 1 ? "s" : ""}`]
  if (band.bass) parts.push("bass")
  if (band.piano) parts.push("piano")
  if (band.harmonica) parts.push("harmonica")
  return parts.join(" + ")
}
