// Chord shapes library with multiple positions/voicings
// Format: [E, A, D, G, B, e] strings (low to high)
// 0 = open, x = muted, number = fret

export interface ChordVoicing {
  fingers: (number | string)[]
  position: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

export const CHORD_VOICINGS: Record<string, Record<string, ChordVoicing[]>> = {
  // C chords
  "C": {
    "Major": [
      { fingers: ['x', 3, 2, 0, 1, 0], position: "Open Position", difficulty: 'beginner' },
      { fingers: [8, 10, 10, 9, 8, 8], position: "8th Fret (Barre)", difficulty: 'intermediate' },
      { fingers: ['x', 3, 5, 5, 5, 3], position: "3rd Fret (Barre)", difficulty: 'intermediate' },
    ],
    "Minor": [
      { fingers: ['x', 3, 1, 0, 1, 3], position: "Open Position", difficulty: 'beginner' },
      { fingers: [8, 10, 10, 8, 8, 8], position: "8th Fret (Barre)", difficulty: 'intermediate' },
      { fingers: ['x', 3, 5, 5, 4, 3], position: "3rd Fret (Barre)", difficulty: 'intermediate' },
    ],
    "Dominant 7th": [
      { fingers: ['x', 3, 2, 3, 1, 0], position: "Open Position", difficulty: 'beginner' },
      { fingers: [8, 10, 8, 9, 8, 8], position: "8th Fret (Barre)", difficulty: 'intermediate' },
    ],
    "Major 7th": [
      { fingers: ['x', 3, 2, 0, 0, 0], position: "Open Position", difficulty: 'beginner' },
      { fingers: [8, 10, 9, 9, 8, 8], position: "8th Fret (Barre)", difficulty: 'intermediate' },
    ],
    "Minor 7th": [
      { fingers: ['x', 3, 1, 3, 1, 3], position: "Open Position", difficulty: 'beginner' },
      { fingers: [8, 10, 8, 8, 8, 8], position: "8th Fret (Barre)", difficulty: 'intermediate' },
    ],
  },

  // D chords
  "D": {
    "Major": [
      { fingers: ['x', 'x', 0, 2, 3, 2], position: "Open Position", difficulty: 'beginner' },
      { fingers: ['x', 5, 7, 7, 7, 5], position: "5th Fret (Barre)", difficulty: 'intermediate' },
      { fingers: [10, 12, 12, 11, 10, 10], position: "10th Fret (Barre)", difficulty: 'intermediate' },
    ],
    "Minor": [
      { fingers: ['x', 'x', 0, 2, 3, 1], position: "Open Position", difficulty: 'beginner' },
      { fingers: ['x', 5, 7, 7, 6, 5], position: "5th Fret (Barre)", difficulty: 'intermediate' },
      { fingers: [10, 12, 12, 10, 10, 10], position: "10th Fret (Barre)", difficulty: 'intermediate' },
    ],
    "Dominant 7th": [
      { fingers: ['x', 'x', 0, 2, 1, 2], position: "Open Position", difficulty: 'beginner' },
      { fingers: [10, 12, 10, 11, 10, 10], position: "10th Fret (Barre)", difficulty: 'intermediate' },
    ],
    "Major 7th": [
      { fingers: ['x', 'x', 0, 2, 2, 2], position: "Open Position", difficulty: 'beginner' },
      { fingers: [10, 12, 11, 11, 10, 10], position: "10th Fret (Barre)", difficulty: 'intermediate' },
    ],
    "Minor 7th": [
      { fingers: ['x', 'x', 0, 2, 1, 1], position: "Open Position", difficulty: 'beginner' },
      { fingers: [10, 12, 10, 10, 10, 10], position: "10th Fret (Barre)", difficulty: 'intermediate' },
    ],
  },

  // E chords
  "E": {
    "Major": [
      { fingers: [0, 2, 2, 1, 0, 0], position: "Open Position", difficulty: 'beginner' },
      { fingers: [12, 14, 14, 13, 12, 12], position: "12th Fret (Barre)", difficulty: 'intermediate' },
      { fingers: ['x', 7, 9, 9, 9, 7], position: "7th Fret (Barre)", difficulty: 'intermediate' },
    ],
    "Minor": [
      { fingers: [0, 2, 2, 0, 0, 0], position: "Open Position", difficulty: 'beginner' },
      { fingers: [12, 14, 14, 12, 12, 12], position: "12th Fret (Barre)", difficulty: 'intermediate' },
      { fingers: ['x', 7, 9, 9, 8, 7], position: "7th Fret (Barre)", difficulty: 'intermediate' },
    ],
    "Dominant 7th": [
      { fingers: [0, 2, 0, 1, 0, 0], position: "Open Position", difficulty: 'beginner' },
      { fingers: [12, 14, 12, 13, 12, 12], position: "12th Fret (Barre)", difficulty: 'intermediate' },
    ],
    "Major 7th": [
      { fingers: [0, 2, 1, 1, 0, 0], position: "Open Position", difficulty: 'beginner' },
      { fingers: [12, 14, 13, 13, 12, 12], position: "12th Fret (Barre)", difficulty: 'intermediate' },
    ],
    "Minor 7th": [
      { fingers: [0, 2, 0, 0, 0, 0], position: "Open Position", difficulty: 'beginner' },
      { fingers: [12, 14, 12, 12, 12, 12], position: "12th Fret (Barre)", difficulty: 'intermediate' },
    ],
  },

  // F chords
  "F": {
    "Major": [
      { fingers: [1, 3, 3, 2, 1, 1], position: "1st Fret (Barre)", difficulty: 'intermediate' },
      { fingers: ['x', 8, 10, 10, 10, 8], position: "8th Fret (Barre)", difficulty: 'intermediate' },
      { fingers: ['x', 'x', 3, 5, 6, 5], position: "3rd Fret", difficulty: 'beginner' },
    ],
    "Minor": [
      { fingers: [1, 3, 3, 1, 1, 1], position: "1st Fret (Barre)", difficulty: 'intermediate' },
      { fingers: ['x', 8, 10, 10, 9, 8], position: "8th Fret (Barre)", difficulty: 'intermediate' },
    ],
    "Dominant 7th": [
      { fingers: [1, 3, 1, 2, 1, 1], position: "1st Fret (Barre)", difficulty: 'intermediate' },
      { fingers: ['x', 8, 10, 8, 9, 8], position: "8th Fret (Barre)", difficulty: 'intermediate' },
    ],
    "Major 7th": [
      { fingers: [1, 3, 2, 2, 1, 1], position: "1st Fret (Barre)", difficulty: 'intermediate' },
      { fingers: ['x', 8, 10, 9, 9, 8], position: "8th Fret (Barre)", difficulty: 'intermediate' },
    ],
    "Minor 7th": [
      { fingers: [1, 3, 1, 1, 1, 1], position: "1st Fret (Barre)", difficulty: 'intermediate' },
      { fingers: ['x', 8, 10, 8, 8, 8], position: "8th Fret (Barre)", difficulty: 'intermediate' },
    ],
  },

  // G chords
  "G": {
    "Major": [
      { fingers: [3, 2, 0, 0, 0, 3], position: "Open Position", difficulty: 'beginner' },
      { fingers: [3, 5, 5, 4, 3, 3], position: "3rd Fret (Barre)", difficulty: 'intermediate' },
      { fingers: ['x', 10, 12, 12, 12, 10], position: "10th Fret (Barre)", difficulty: 'intermediate' },
    ],
    "Minor": [
      { fingers: [3, 5, 5, 3, 3, 3], position: "3rd Fret (Barre)", difficulty: 'intermediate' },
      { fingers: ['x', 10, 12, 12, 11, 10], position: "10th Fret (Barre)", difficulty: 'intermediate' },
    ],
    "Dominant 7th": [
      { fingers: [3, 2, 0, 0, 0, 1], position: "Open Position", difficulty: 'beginner' },
      { fingers: [3, 5, 3, 4, 3, 3], position: "3rd Fret (Barre)", difficulty: 'intermediate' },
    ],
    "Major 7th": [
      { fingers: [3, 2, 0, 0, 0, 2], position: "Open Position", difficulty: 'beginner' },
      { fingers: [3, 5, 4, 4, 3, 3], position: "3rd Fret (Barre)", difficulty: 'intermediate' },
    ],
    "Minor 7th": [
      { fingers: [3, 5, 3, 3, 3, 3], position: "3rd Fret (Barre)", difficulty: 'intermediate' },
      { fingers: ['x', 10, 12, 10, 10, 10], position: "10th Fret (Barre)", difficulty: 'intermediate' },
    ],
  },

  // A chords
  "A": {
    "Major": [
      { fingers: ['x', 0, 2, 2, 2, 0], position: "Open Position", difficulty: 'beginner' },
      { fingers: [5, 7, 7, 6, 5, 5], position: "5th Fret (Barre)", difficulty: 'intermediate' },
      { fingers: ['x', 12, 14, 14, 14, 12], position: "12th Fret (Barre)", difficulty: 'intermediate' },
    ],
    "Minor": [
      { fingers: ['x', 0, 2, 2, 1, 0], position: "Open Position", difficulty: 'beginner' },
      { fingers: [5, 7, 7, 5, 5, 5], position: "5th Fret (Barre)", difficulty: 'intermediate' },
      { fingers: ['x', 12, 14, 14, 13, 12], position: "12th Fret (Barre)", difficulty: 'intermediate' },
    ],
    "Dominant 7th": [
      { fingers: ['x', 0, 2, 0, 2, 0], position: "Open Position", difficulty: 'beginner' },
      { fingers: [5, 7, 5, 6, 5, 5], position: "5th Fret (Barre)", difficulty: 'intermediate' },
    ],
    "Major 7th": [
      { fingers: ['x', 0, 2, 1, 2, 0], position: "Open Position", difficulty: 'beginner' },
      { fingers: [5, 7, 6, 6, 5, 5], position: "5th Fret (Barre)", difficulty: 'intermediate' },
    ],
    "Minor 7th": [
      { fingers: ['x', 0, 2, 0, 1, 0], position: "Open Position", difficulty: 'beginner' },
      { fingers: [5, 7, 5, 5, 5, 5], position: "5th Fret (Barre)", difficulty: 'intermediate' },
    ],
  },

  // B chords
  "B": {
    "Major": [
      { fingers: ['x', 2, 4, 4, 4, 2], position: "2nd Fret (Barre)", difficulty: 'intermediate' },
      { fingers: [7, 9, 9, 8, 7, 7], position: "7th Fret (Barre)", difficulty: 'intermediate' },
      { fingers: ['x', 'x', 4, 4, 4, 7], position: "4th Fret", difficulty: 'beginner' },
    ],
    "Minor": [
      { fingers: ['x', 2, 4, 4, 3, 2], position: "2nd Fret (Barre)", difficulty: 'intermediate' },
      { fingers: [7, 9, 9, 7, 7, 7], position: "7th Fret (Barre)", difficulty: 'intermediate' },
    ],
    "Dominant 7th": [
      { fingers: ['x', 2, 1, 2, 0, 2], position: "Open/2nd Fret", difficulty: 'intermediate' },
      { fingers: [7, 9, 7, 8, 7, 7], position: "7th Fret (Barre)", difficulty: 'intermediate' },
    ],
    "Major 7th": [
      { fingers: ['x', 2, 4, 3, 4, 2], position: "2nd Fret (Barre)", difficulty: 'intermediate' },
      { fingers: [7, 9, 8, 8, 7, 7], position: "7th Fret (Barre)", difficulty: 'intermediate' },
    ],
    "Minor 7th": [
      { fingers: ['x', 2, 0, 2, 0, 2], position: "Open/2nd Fret", difficulty: 'intermediate' },
      { fingers: [7, 9, 7, 7, 7, 7], position: "7th Fret (Barre)", difficulty: 'intermediate' },
    ],
  },
}

// Helper function to get chord shape (returns first voicing by default)
export function getChordShape(root: string, quality: string, voicingIndex: number = 0): (number | string)[] | null {
  // Handle sharp/flat notation
  const normalizedRoot = root.split('/')[0] // Take first note if sharp/flat (e.g., "C#/Db" -> "C#")

  // If we don't have the exact chord, return null
  if (!CHORD_VOICINGS[normalizedRoot] || !CHORD_VOICINGS[normalizedRoot][quality]) {
    return null
  }

  const voicings = CHORD_VOICINGS[normalizedRoot][quality]
  if (voicingIndex >= voicings.length) {
    return null
  }

  return voicings[voicingIndex].fingers
}

// Get all voicings for a chord
export function getChordVoicings(root: string, quality: string): ChordVoicing[] | null {
  const normalizedRoot = root.split('/')[0]

  if (!CHORD_VOICINGS[normalizedRoot] || !CHORD_VOICINGS[normalizedRoot][quality]) {
    return null
  }

  return CHORD_VOICINGS[normalizedRoot][quality]
}
