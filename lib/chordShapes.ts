// Chord shapes library with multiple positions/voicings
// Format: [E, A, D, G, B, e] strings (low to high)
// 0 = open, x = muted, number = fret

export interface ChordVoicing {
  fingers: (number | string)[]
  position: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

export const CHORD_VOICINGS: Record<string, Record<string, ChordVoicing[]>> = {
  // ─── C ───────────────────────────────────────────────────────────────────
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
    "Diminished": [
      { fingers: ['x', 3, 4, 5, 4, 'x'], position: "3rd Fret", difficulty: 'intermediate' },
    ],
  },

  // ─── C# ──────────────────────────────────────────────────────────────────
  "C#": {
    "Major": [
      { fingers: [9, 11, 11, 10, 9, 9], position: "9th Fret (Barre)", difficulty: 'intermediate' },
      { fingers: ['x', 4, 6, 6, 6, 4], position: "4th Fret (Barre)", difficulty: 'intermediate' },
    ],
    "Minor": [
      { fingers: [9, 11, 11, 9, 9, 9], position: "9th Fret (Barre)", difficulty: 'intermediate' },
      { fingers: ['x', 4, 6, 6, 5, 4], position: "4th Fret (Barre)", difficulty: 'intermediate' },
    ],
    "Dominant 7th": [
      { fingers: [9, 11, 9, 10, 9, 9], position: "9th Fret (Barre)", difficulty: 'intermediate' },
      { fingers: ['x', 4, 6, 4, 6, 4], position: "4th Fret (Barre)", difficulty: 'intermediate' },
    ],
    "Major 7th": [
      { fingers: [9, 11, 10, 10, 9, 9], position: "9th Fret (Barre)", difficulty: 'intermediate' },
      { fingers: ['x', 4, 6, 5, 6, 4], position: "4th Fret (Barre)", difficulty: 'intermediate' },
    ],
    "Minor 7th": [
      { fingers: [9, 11, 9, 9, 9, 9], position: "9th Fret (Barre)", difficulty: 'intermediate' },
      { fingers: ['x', 4, 6, 4, 5, 4], position: "4th Fret (Barre)", difficulty: 'intermediate' },
    ],
    "Diminished": [
      { fingers: ['x', 4, 5, 6, 5, 'x'], position: "4th Fret", difficulty: 'intermediate' },
    ],
  },

  // ─── D ───────────────────────────────────────────────────────────────────
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
    "Diminished": [
      { fingers: ['x', 5, 6, 7, 6, 'x'], position: "5th Fret", difficulty: 'intermediate' },
    ],
  },

  // ─── D# ──────────────────────────────────────────────────────────────────
  "D#": {
    "Major": [
      { fingers: [11, 13, 13, 12, 11, 11], position: "11th Fret (Barre)", difficulty: 'intermediate' },
      { fingers: ['x', 6, 8, 8, 8, 6], position: "6th Fret (Barre)", difficulty: 'intermediate' },
    ],
    "Minor": [
      { fingers: [11, 13, 13, 11, 11, 11], position: "11th Fret (Barre)", difficulty: 'intermediate' },
      { fingers: ['x', 6, 8, 8, 7, 6], position: "6th Fret (Barre)", difficulty: 'intermediate' },
    ],
    "Dominant 7th": [
      { fingers: [11, 13, 11, 12, 11, 11], position: "11th Fret (Barre)", difficulty: 'intermediate' },
      { fingers: ['x', 6, 8, 6, 8, 6], position: "6th Fret (Barre)", difficulty: 'intermediate' },
    ],
    "Major 7th": [
      { fingers: [11, 13, 12, 12, 11, 11], position: "11th Fret (Barre)", difficulty: 'intermediate' },
      { fingers: ['x', 6, 8, 7, 8, 6], position: "6th Fret (Barre)", difficulty: 'intermediate' },
    ],
    "Minor 7th": [
      { fingers: [11, 13, 11, 11, 11, 11], position: "11th Fret (Barre)", difficulty: 'intermediate' },
      { fingers: ['x', 6, 8, 6, 7, 6], position: "6th Fret (Barre)", difficulty: 'intermediate' },
    ],
    "Diminished": [
      { fingers: ['x', 6, 7, 8, 7, 'x'], position: "6th Fret", difficulty: 'intermediate' },
    ],
  },

  // ─── E ───────────────────────────────────────────────────────────────────
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
    "Diminished": [
      { fingers: ['x', 7, 8, 9, 8, 'x'], position: "7th Fret", difficulty: 'intermediate' },
    ],
  },

  // ─── F ───────────────────────────────────────────────────────────────────
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
    "Diminished": [
      { fingers: ['x', 8, 9, 10, 9, 'x'], position: "8th Fret", difficulty: 'intermediate' },
    ],
  },

  // ─── F# ──────────────────────────────────────────────────────────────────
  "F#": {
    "Major": [
      { fingers: [2, 4, 4, 3, 2, 2], position: "2nd Fret (Barre)", difficulty: 'intermediate' },
      { fingers: ['x', 9, 11, 11, 11, 9], position: "9th Fret (Barre)", difficulty: 'intermediate' },
    ],
    "Minor": [
      { fingers: [2, 4, 4, 2, 2, 2], position: "2nd Fret (Barre)", difficulty: 'intermediate' },
      { fingers: ['x', 9, 11, 11, 10, 9], position: "9th Fret (Barre)", difficulty: 'intermediate' },
    ],
    "Dominant 7th": [
      { fingers: [2, 4, 2, 3, 2, 2], position: "2nd Fret (Barre)", difficulty: 'intermediate' },
      { fingers: ['x', 9, 11, 9, 11, 9], position: "9th Fret (Barre)", difficulty: 'intermediate' },
    ],
    "Major 7th": [
      { fingers: [2, 4, 3, 3, 2, 2], position: "2nd Fret (Barre)", difficulty: 'intermediate' },
      { fingers: ['x', 9, 11, 10, 11, 9], position: "9th Fret (Barre)", difficulty: 'intermediate' },
    ],
    "Minor 7th": [
      { fingers: [2, 4, 2, 2, 2, 2], position: "2nd Fret (Barre)", difficulty: 'intermediate' },
      { fingers: ['x', 9, 11, 9, 10, 9], position: "9th Fret (Barre)", difficulty: 'intermediate' },
    ],
    "Diminished": [
      { fingers: ['x', 9, 10, 11, 10, 'x'], position: "9th Fret", difficulty: 'intermediate' },
    ],
  },

  // ─── G ───────────────────────────────────────────────────────────────────
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
    "Diminished": [
      { fingers: ['x', 10, 11, 12, 11, 'x'], position: "10th Fret", difficulty: 'intermediate' },
    ],
  },

  // ─── G# ──────────────────────────────────────────────────────────────────
  "G#": {
    "Major": [
      { fingers: [4, 6, 6, 5, 4, 4], position: "4th Fret (Barre)", difficulty: 'intermediate' },
      { fingers: ['x', 11, 13, 13, 13, 11], position: "11th Fret (Barre)", difficulty: 'intermediate' },
    ],
    "Minor": [
      { fingers: [4, 6, 6, 4, 4, 4], position: "4th Fret (Barre)", difficulty: 'intermediate' },
      { fingers: ['x', 11, 13, 13, 12, 11], position: "11th Fret (Barre)", difficulty: 'intermediate' },
    ],
    "Dominant 7th": [
      { fingers: [4, 6, 4, 5, 4, 4], position: "4th Fret (Barre)", difficulty: 'intermediate' },
      { fingers: ['x', 11, 13, 11, 13, 11], position: "11th Fret (Barre)", difficulty: 'intermediate' },
    ],
    "Major 7th": [
      { fingers: [4, 6, 5, 5, 4, 4], position: "4th Fret (Barre)", difficulty: 'intermediate' },
      { fingers: ['x', 11, 13, 12, 13, 11], position: "11th Fret (Barre)", difficulty: 'intermediate' },
    ],
    "Minor 7th": [
      { fingers: [4, 6, 4, 4, 4, 4], position: "4th Fret (Barre)", difficulty: 'intermediate' },
      { fingers: ['x', 11, 13, 11, 12, 11], position: "11th Fret (Barre)", difficulty: 'intermediate' },
    ],
    "Diminished": [
      { fingers: ['x', 11, 12, 13, 12, 'x'], position: "11th Fret", difficulty: 'intermediate' },
    ],
  },

  // ─── A ───────────────────────────────────────────────────────────────────
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
    "Diminished": [
      { fingers: ['x', 0, 1, 2, 1, 'x'], position: "Open Position", difficulty: 'intermediate' },
    ],
  },

  // ─── A# ──────────────────────────────────────────────────────────────────
  "A#": {
    "Major": [
      { fingers: ['x', 1, 3, 3, 3, 1], position: "1st Fret (Barre)", difficulty: 'intermediate' },
      { fingers: [6, 8, 8, 7, 6, 6], position: "6th Fret (Barre)", difficulty: 'intermediate' },
    ],
    "Minor": [
      { fingers: ['x', 1, 3, 3, 2, 1], position: "1st Fret (Barre)", difficulty: 'intermediate' },
      { fingers: [6, 8, 8, 6, 6, 6], position: "6th Fret (Barre)", difficulty: 'intermediate' },
    ],
    "Dominant 7th": [
      { fingers: ['x', 1, 3, 1, 3, 1], position: "1st Fret (Barre)", difficulty: 'intermediate' },
      { fingers: [6, 8, 6, 7, 6, 6], position: "6th Fret (Barre)", difficulty: 'intermediate' },
    ],
    "Major 7th": [
      { fingers: ['x', 1, 3, 2, 3, 1], position: "1st Fret (Barre)", difficulty: 'intermediate' },
      { fingers: [6, 8, 7, 7, 6, 6], position: "6th Fret (Barre)", difficulty: 'intermediate' },
    ],
    "Minor 7th": [
      { fingers: ['x', 1, 3, 1, 2, 1], position: "1st Fret (Barre)", difficulty: 'intermediate' },
      { fingers: [6, 8, 6, 6, 6, 6], position: "6th Fret (Barre)", difficulty: 'intermediate' },
    ],
    "Diminished": [
      { fingers: ['x', 1, 2, 3, 2, 'x'], position: "1st Fret", difficulty: 'intermediate' },
    ],
  },

  // ─── B ───────────────────────────────────────────────────────────────────
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
    "Diminished": [
      { fingers: ['x', 2, 3, 4, 3, 'x'], position: "2nd Fret", difficulty: 'intermediate' },
    ],
  },
}

// Helper function to get chord shape (returns first voicing by default)
export function getChordShape(root: string, quality: string, voicingIndex: number = 0): (number | string)[] | null {
  const normalizedRoot = root.split('/')[0]

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
