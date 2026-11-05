export type GenreId =
  | "funk" | "alternative" | "jazz" | "blues" | "country"
  | "pop" | "folk" | "reggae" | "gospel" | "rock"

export interface JamProgression {
  name: string
  // Nashville tokens, relative to the tonic. Minor-key progressions use "1m", "b3", "b6", "b7".
  chords: string[]
  minor?: boolean
  bpm: [number, number]
  feel: string
  note: string
  example?: string
}

export interface GenreInfo {
  id: GenreId
  label: string
  blurb: string
  progressions: JamProgression[]
}

export const GENRES: GenreInfo[] = [
  {
    id: "funk",
    label: "Funk",
    blurb: "One or two chords, all about the groove. Keep it tight and leave space.",
    progressions: [
      { name: "One-chord vamp", chords: ["19", "19", "19", "19"], bpm: [95, 110], feel: "16ths, muted scratches", note: "Stay on one dominant 9th chord for the whole verse. The rhythm is the song." },
      { name: "Dorian two-chord", chords: ["1m7", "1m7", "47", "1m7"], minor: true, bpm: [95, 115], feel: "Syncopated 16ths", note: "Minor 7 up to a dominant IV7. That major 6th is the Dorian sound. Keep the IV short and punchy." },
      { name: "Dominant IV vamp", chords: ["17", "17", "47", "17"], bpm: [90, 110], feel: "Tight 8ths and 16ths", note: "Blues-flavored. Hit the 4 chord on the 'and' of beat 4 to push into it." },
      { name: "Minor 7 slide", chords: ["1m7", "b27", "1m7", "b77"], minor: true, bpm: [100, 120], feel: "Chromatic stabs", note: "Slide up a half step and back for tension, then drop to the b7. Think horn-section stabs." },
      { name: "ii-V funk loop", chords: ["2m7", "57", "1maj7", "57"], bpm: [90, 105], feel: "Smooth, behind the beat", note: "Jazzier funk. Ghost notes between the chords." },
      { name: "Minor 9 hang", chords: ["1m9", "1m9", "b79", "49"], minor: true, bpm: [85, 100], feel: "Laid back pocket", note: "Rich chords, very few notes per chord. Think two or three strings at a time." },
    ],
  },
  {
    id: "alternative",
    label: "Alternative",
    blurb: "Open, moody, repetitive. Add9s, suspended chords and a borrowed chord for color.",
    progressions: [
      { name: "Four-chord loop", chords: ["1", "5", "6m", "4"], bpm: [100, 130], feel: "Driving 8ths", note: "One of the most common loops in modern music. Add9 on the 1 and 4 for an alt sound.", example: "Let It Be" },
      { name: "Minor-start loop", chords: ["6m", "4", "1", "5"], bpm: [90, 120], feel: "Open ringing strums", note: "Same four chords, starting from the minor. Instantly moodier." },
      { name: "Borrowed minor four", chords: ["1", "3", "4", "4m"], bpm: [80, 105], feel: "Slow build", note: "The 4m is borrowed from the parallel minor. That's the heartbreak chord.", example: "Creep" },
      { name: "Minor epic", chords: ["1m", "b6", "b3", "b7"], minor: true, bpm: [95, 125], feel: "Big and sustained", note: "Natural minor loop. Let it ring and build in the chorus." },
      { name: "Mixolydian lift", chords: ["1", "b7", "4", "1"], bpm: [100, 130], feel: "Swaggering 8ths", note: "The b7 chord gives that classic rock-leaning alt sound." },
      { name: "Suspended drift", chords: ["1sus4", "1", "5sus4", "5"], bpm: [70, 95], feel: "Dreamy, lots of space", note: "Resolve the sus chords slowly. Reverb on the guitars helps." },
    ],
  },
  {
    id: "jazz",
    label: "Jazz",
    blurb: "Lots of ii-V-I. Think in 7th chords and aim for smooth voice leading.",
    progressions: [
      { name: "ii-V-I", chords: ["2m7", "57", "1maj7", "1maj7"], bpm: [100, 160], feel: "Swing 8ths", note: "The building block of jazz. Learn it in every key." },
      { name: "I-vi-ii-V turnaround", chords: ["1maj7", "6m7", "2m7", "57"], bpm: [110, 180], feel: "Swing", note: "Use this at the end of a tune to loop back to the top.", example: "Rhythm changes (bars 1-2)" },
      { name: "Minor ii-V-i", chords: ["2m7b5", "57", "1m7", "1m7"], minor: true, bpm: [90, 150], feel: "Swing or bossa", note: "Minor version of ii-V-I. The V is often altered (b9)." },
      { name: "iii-vi-ii-V", chords: ["3m7", "6m7", "2m7", "57"], bpm: [110, 170], feel: "Swing", note: "A longer path home. Each root drops a fifth." },
      { name: "Autumn leaves cycle", chords: ["2m7", "57", "1maj7", "4maj7", "7m7b5", "37", "6m7", "6m7"], bpm: [100, 150], feel: "Medium swing", note: "ii-V-I-IV in the major key, then ii-V-i in the relative minor. The original is in Bb major / G minor.", example: "Autumn Leaves" },
      { name: "Jazz blues", chords: ["17", "47", "17", "17", "47", "47", "17", "67", "2m7", "57", "17", "57"], bpm: [110, 170], feel: "Swing", note: "Bar 8 is VI7, which pulls into a ii-V in bars 9-10. Bar 12 is the V turnaround." },
    ],
  },
  {
    id: "blues",
    label: "Blues",
    blurb: "Twelve bars, dominant chords. Simple form, deep feel.",
    progressions: [
      { name: "12-bar blues", chords: ["17", "17", "17", "17", "47", "47", "17", "17", "57", "47", "17", "57"], bpm: [70, 130], feel: "Shuffle", note: "The classic. The last bar (the 'turnaround') sets up the next time round." },
      { name: "Quick-change blues", chords: ["17", "47", "17", "17", "47", "47", "17", "17", "57", "47", "17", "57"], bpm: [80, 130], feel: "Shuffle", note: "Same as the 12-bar but go to the 4 chord in bar 2 and back." },
      { name: "Minor blues", chords: ["1m7", "1m7", "1m7", "1m7", "4m7", "4m7", "1m7", "1m7", "b6", "57", "1m7", "57"], minor: true, bpm: [60, 110], feel: "Slow or medium shuffle", note: "Darker. Bar 9 goes to the b6 then 5 for drama." },
      { name: "8-bar blues", chords: ["17", "57", "47", "47", "17", "57", "17", "57"], bpm: [70, 110], feel: "Slow shuffle", note: "Shorter form. The jump from I to V in bar 2 is the sign of an eight-bar blues.", example: "Key to the Highway" },
      { name: "Slow blues", chords: ["17", "47", "17", "17", "47", "47", "17", "17", "57", "47", "17", "17"], bpm: [50, 70], feel: "12/8 slow", note: "Count the triplets. Plenty of space for bending notes." },
      { name: "Boogie", chords: ["17", "17", "17", "17", "47", "47", "17", "17", "57", "47", "17", "17"], bpm: [110, 150], feel: "Driving boogie shuffle", note: "Walking root-3-5-6-b7-6-5-3 bass pattern on the low strings." },
    ],
  },
  {
    id: "country",
    label: "Country",
    blurb: "Three chords and the truth. Bright, open chords with a steady backbeat.",
    progressions: [
      { name: "I-IV-V", chords: ["1", "4", "5", "1"], bpm: [90, 140], feel: "Boom-chick", note: "The classic. Bass on 1 and 3, strum on 2 and 4." },
      { name: "I-V-vi-IV", chords: ["1", "5", "6m", "4"], bpm: [90, 130], feel: "Steady strum", note: "Modern country-pop favorite.", example: "Wagon Wheel" },
      { name: "I-IV-I-V", chords: ["1", "4", "1", "5"], bpm: [100, 140], feel: "Two-step", note: "Great for verses. Switch to I-IV-V-I for a turnaround." },
      { name: "V-IV-I", chords: ["5", "4", "1", "1"], bpm: [95, 125], feel: "Rolling", note: "Backwards three-chord loop. Southern rock flavor.", example: "Sweet Home Alabama" },
      { name: "I-iii-IV-V", chords: ["1", "3m", "4", "5"], bpm: [80, 110], feel: "Ballad", note: "The iii adds a gentle lift before the IV. Great for slower tunes." },
      { name: "Walk-down", chords: ["1", "5/7", "6m", "5"], bpm: [70, 100], feel: "Slow waltz or ballad", note: "A descending bass line (1, 7, 6, 5) under the chords. The 5/7 slash chord (G/B in C) carries the 7." },
    ],
  },
  {
    id: "pop",
    label: "Pop",
    blurb: "Four chords, big hooks. The same loop can power a whole song.",
    progressions: [
      { name: "I-V-vi-IV", chords: ["1", "5", "6m", "4"], bpm: [100, 128], feel: "Straight 8ths", note: "One of the most used progressions in pop. Try it in any key.", example: "Let It Be" },
      { name: "vi-IV-I-V", chords: ["6m", "4", "1", "5"], bpm: [95, 125], feel: "Straight 8ths", note: "Start on the minor chord for a more emotional feel." },
      { name: "I-vi-IV-V (50s)", chords: ["1", "6m", "4", "5"], bpm: [70, 120], feel: "Slow triplet feel", note: "The doo-wop progression.", example: "Stand By Me" },
      { name: "I-IV-vi-V", chords: ["1", "4", "6m", "5"], bpm: [90, 125], feel: "Straight 8ths", note: "A slight twist on the classic. Ends on a suspenseful V." },
      { name: "IV-I-V-vi", chords: ["4", "1", "5", "6m"], bpm: [95, 120], feel: "Straight 8ths", note: "Starting on the IV feels open and anthemic." },
      { name: "I-iii-IV-V", chords: ["1", "3m", "4", "5"], bpm: [80, 115], feel: "Mid-tempo", note: "Climbs up the scale: 1, 3, 4, 5." },
    ],
  },
  {
    id: "folk",
    label: "Folk",
    blurb: "Open chords and strong rhythm. Easy to sing and easy to share around a circle.",
    progressions: [
      { name: "I-IV-V", chords: ["1", "4", "5", "1"], bpm: [80, 120], feel: "Down strums, easy", note: "The campfire standard. Nobody gets lost." },
      { name: "I-V-IV", chords: ["1", "5", "4", "4"], bpm: [70, 100], feel: "Relaxed strum", note: "Good for a laid-back verse.", example: "Knockin' on Heaven's Door (G D C)" },
      { name: "Canon", chords: ["1", "5", "6m", "3m", "4", "1", "4", "5"], bpm: [70, 100], feel: "Gentle fingerpicking", note: "Eight chords, descending bass line." },
      { name: "I-vi-IV-V", chords: ["1", "6m", "4", "5"], bpm: [70, 100], feel: "Ballad", note: "Slow it down for a singalong." },
      { name: "Minor folk", chords: ["1m", "b3", "b7", "1m"], minor: true, bpm: [80, 115], feel: "Driving", note: "Ancient-sounding minor feel. Works for old ballads.", example: "Jolene (Am C G Am)" },
      { name: "I-bVII-IV", chords: ["1", "b7", "4", "1"], bpm: [90, 120], feel: "Strummy", note: "A Mixolydian sound. Common in Celtic and folk-rock." },
    ],
  },
  {
    id: "reggae",
    label: "Reggae",
    blurb: "The one drop. Chords land on the off-beat, bass carries the melody.",
    progressions: [
      { name: "I-IV skank", chords: ["1", "4", "1", "4"], bpm: [70, 90], feel: "Off-beat chops", note: "Two chords and the groove. Strum on the 'and' of each beat." },
      { name: "I-V-vi-IV", chords: ["1", "5", "6m", "4"], bpm: [70, 90], feel: "One drop", note: "Gentle and warm.", example: "No Woman, No Cry" },
      { name: "I-vi-ii-V", chords: ["1", "6m", "2m", "5"], bpm: [70, 90], feel: "Rocksteady", note: "Doo-wop turned reggae." },
      { name: "Minor skank", chords: ["1m", "4m", "1m", "5"], minor: true, bpm: [70, 85], feel: "Off-beat", note: "Dark, rootsy. Keep the strum short and muted." },
      { name: "I-IV-I-V", chords: ["1", "4", "1", "5"], bpm: [70, 90], feel: "One drop", note: "Simple and strong." },
      { name: "Two-chord vamp", chords: ["1", "1", "4", "4"], bpm: [65, 85], feel: "Roots", note: "Stay on each chord for two bars. Bass does the work." },
    ],
  },
  {
    id: "gospel",
    label: "Gospel",
    blurb: "Rich and uplifting. Passing chords, 7ths and a plagal 'amen' ending.",
    progressions: [
      { name: "I-IV-I-V", chords: ["1", "4", "1", "5"], bpm: [70, 120], feel: "Call and response", note: "The foundation. Add 7ths for flavor." },
      { name: "Amen cadence", chords: ["4", "1", "4", "1"], bpm: [60, 90], feel: "Slow, sustained", note: "IV to I, over and over. The 'amen' ending." },
      { name: "I-iii-IV-V", chords: ["1", "3m", "4", "5"], bpm: [70, 110], feel: "Building", note: "Walks up the scale. Great for lifts." },
      { name: "ii-V-I", chords: ["2m7", "57", "1maj7", "4"], bpm: [70, 110], feel: "Smooth", note: "Jazz-influenced gospel. Smooth 7ths." },
      { name: "I-I7-IV-iv", chords: ["1", "17", "4", "4m"], bpm: [60, 90], feel: "Slow groove", note: "The 4m (minor four) is a favorite color in gospel and soul." },
      { name: "Walk-up", chords: ["1", "1/3", "4", "4/5"], bpm: [65, 100], feel: "Walking bass", note: "Slash chords create a walking bass line." },
    ],
  },
  {
    id: "rock",
    label: "Rock",
    blurb: "Power and drive. Open or power chords, a steady beat, and big choruses.",
    progressions: [
      { name: "I-IV-V", chords: ["1", "4", "5", "1"], bpm: [110, 150], feel: "Driving 8ths", note: "Rock n roll basics. Use power chords for crunch.", example: "La Bamba" },
      { name: "I-bVII-IV", chords: ["1", "b7", "4", "1"], bpm: [100, 140], feel: "Swaggering", note: "A classic Mixolydian rock progression." },
      { name: "Aeolian rock loop", chords: ["1m", "b7", "b6", "b7"], minor: true, bpm: [90, 130], feel: "Heavy and slow", note: "Natural minor: i, bVII, bVI, bVII. Dark and stompy." },
      { name: "Andalusian cadence", chords: ["1m", "b7", "b6", "5"], minor: true, bpm: [90, 130], feel: "Dramatic", note: "A descending minor line ending on the major V.", example: "Hit the Road Jack" },
      { name: "I-V-bVII-IV", chords: ["1", "5", "b7", "4"], bpm: [100, 135], feel: "Anthemic", note: "Wide open and stadium-ready." },
      { name: "Power I-bIII-IV", chords: ["1", "b3", "4", "4"], bpm: [100, 140], feel: "Riff rock", note: "Short loop. Great under a guitar riff." },
    ],
  },
]

export function getGenre(id: string): GenreInfo | undefined {
  return GENRES.find(g => g.id === id)
}
