import type { StarterChart } from "./charts"

export interface PopularSong extends StarterChart {
  artist: string
}

const bars = (...rows: string[][]) => rows.map(r => "| " + r.join(" | ") + " |").join("\n")

// Chord-only, simplified progressions. No lyrics. Keys are the shapes you play (see the Capo line).
export const POPULAR_ACOUSTIC: PopularSong[] = [
  {
    title: "Knockin' on Heaven's Door", artist: "Bob Dylan", key: "G", genre: "rock",
    body: `Verse + Chorus\n${bars(["G", "D", "Am", "Am"], ["G", "D", "C", "C"])}`,
  },
  {
    title: "Wonderwall", artist: "Oasis", key: "Em", genre: "alternative",
    body: `Capo 2 (shapes below)\nVerse\n${bars(["Em7", "G", "Dsus4", "A7sus4"])}\nChorus\n${bars(["Cadd9", "Dsus4", "Em7", "Em7"])}`,
  },
  {
    title: "Sweet Home Alabama", artist: "Lynyrd Skynyrd", key: "D", genre: "rock",
    body: `Verse\n${bars(["D", "C", "G", "G"])}\nChorus\n${bars(["C", "G", "D", "D"])}`,
  },
  {
    title: "Brown Eyed Girl", artist: "Van Morrison", key: "G", genre: "pop",
    body: `Verse\n${bars(["G", "C", "G", "D"])}\nChorus\n${bars(["C", "D", "G", "Em"], ["C", "D", "G", "D7"])}`,
  },
  {
    title: "Bad Moon Rising", artist: "Creedence Clearwater Revival", key: "D", genre: "rock",
    body: `Verse + Chorus\n${bars(["D", "A", "G", "D"])}`,
  },
  {
    title: "Let It Be", artist: "The Beatles", key: "C", genre: "pop",
    body: `Verse\n${bars(["C", "G", "Am", "F"], ["C", "G", "F", "C"])}\nChorus\n${bars(["Am", "G", "F", "C"], ["C", "G", "F", "C"])}`,
  },
  {
    title: "With or Without You", artist: "U2", key: "D", genre: "rock",
    body: `Whole song\n${bars(["D", "A", "Bm", "Bm"], ["G", "G", "G", "G"])}`,
  },
  {
    title: "Hotel California", artist: "Eagles", key: "Bm", genre: "rock",
    body: `Verse\n${bars(["Bm", "F#", "A", "E"], ["G", "D", "Em", "F#"])}`,
  },
  {
    title: "Wish You Were Here", artist: "Pink Floyd", key: "G", genre: "rock",
    body: `Intro riff (repeat)\n${bars(["Em7", "G", "Em7", "G"])}\nVerse\n${bars(["C", "D", "Am", "G"])}`,
  },
  {
    title: "Take Me Home, Country Roads", artist: "John Denver", key: "G", genre: "country",
    body: `Verse\n${bars(["G", "Em", "D", "C"])}\nChorus\n${bars(["G", "D", "Em", "C"], ["G", "D", "C", "G"])}`,
  },
  {
    title: "Stand By Me", artist: "Ben E. King", key: "A", genre: "pop",
    body: `Whole song\n${bars(["A", "A", "F#m", "F#m"], ["D", "E", "A", "A"])}`,
  },
  {
    title: "Hey Jude", artist: "The Beatles", key: "F", genre: "pop",
    body: `Verse\n${bars(["F", "C", "C7", "F"], ["Bb", "F", "C", "F"])}`,
  },
  {
    title: "Wagon Wheel", artist: "Old Crow Medicine Show", key: "G", genre: "country",
    body: `Verse + Chorus\n${bars(["G", "D", "Em", "C"])}`,
  },
  {
    title: "I'm Yours", artist: "Jason Mraz", key: "C", genre: "pop",
    body: `Verse + Chorus\n${bars(["C", "G", "Am", "F"])}`,
  },
  {
    title: "Riptide", artist: "Vance Joy", key: "Am", genre: "pop",
    body: `Capo 1 (shapes below)\nVerse + Chorus\n${bars(["Am", "G", "C", "C"])}`,
  },
  {
    title: "Hallelujah", artist: "Leonard Cohen", key: "C", genre: "folk",
    body: `Slow 6/8 feel\nVerse\n${bars(["C", "Am", "C", "Am"], ["F", "G", "C", "G"])}`,
  },
  {
    title: "Imagine", artist: "John Lennon", key: "C", genre: "pop",
    body: `Verse\n${bars(["C", "Cmaj7", "F", "F"], ["C", "Cmaj7", "F", "F"])}`,
  },
  {
    title: "Folsom Prison Blues", artist: "Johnny Cash", key: "E", genre: "country",
    body: `12-bar form\n${bars(["E", "E", "E", "E7"], ["A", "A", "E", "E"], ["B7", "A", "E", "B7"])}`,
  },
  {
    title: "Jolene", artist: "Dolly Parton", key: "Am", genre: "country",
    body: `Verse\n${bars(["Am", "C", "G", "Am"])}\nChorus\n${bars(["C", "G", "Am", "Am"])}`,
  },
  {
    title: "Thinking Out Loud", artist: "Ed Sheeran", key: "D", genre: "pop",
    body: `Verse + Chorus\n${bars(["D", "D/F#", "G", "A"])}`,
  },
  {
    title: "Good Riddance (Time of Your Life)", artist: "Green Day", key: "G", genre: "rock",
    body: `Arpeggiate each chord\n${bars(["G", "Cadd9", "D", "D"])}`,
  },
  {
    title: "Fast Car", artist: "Tracy Chapman", key: "C", genre: "folk",
    body: `Capo 2 (shapes below)\nVerse\n${bars(["C", "G", "Em", "D"])}`,
  },
  {
    title: "Ho Hey", artist: "The Lumineers", key: "C", genre: "folk",
    body: `Verse + Chorus\n${bars(["C", "F", "C", "G"])}`,
  },
  {
    title: "House of the Rising Sun", artist: "The Animals", key: "Am", genre: "blues",
    body: `Verse\n${bars(["Am", "C", "D", "F"], ["Am", "C", "E", "E"], ["Am", "C", "D", "F"], ["Am", "E", "Am", "E"])}`,
  },
  {
    title: "Hey Joe", artist: "Jimi Hendrix", key: "C", genre: "rock",
    body: `Whole song\n${bars(["C", "G", "D", "A"], ["E", "E", "E", "E"])}`,
  },
]
