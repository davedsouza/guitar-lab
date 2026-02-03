// Scale patterns library
// Each pattern shows which frets to play on each string for that position
// Format: Array of positions, each containing fret positions relative to root

export interface ScalePattern {
  name: string
  description: string
  positions: ScalePosition[]
}

export interface ScalePosition {
  name: string
  pattern: number[][] // [string][fret offsets from root]
  rootString: number // Which string (0-5) has the root note
  startFret: number // Suggested starting fret for visualization
}

export const SCALE_TYPES: Record<string, ScalePattern> = {
  "Major": {
    name: "Major Scale (Ionian)",
    description: "The happy, bright sound. Do-Re-Mi-Fa-Sol-La-Ti-Do",
    positions: [
      {
        name: "Position 1 (Open/CAGED E)",
        pattern: [
          [0, 2, 3],      // E string
          [0, 2, 3],      // A string
          [0, 2, 4],      // D string
          [0, 2, 4],      // G string
          [0, 2, 3],      // B string
          [0, 2, 3],      // e string
        ],
        rootString: 0,
        startFret: 0
      },
      {
        name: "Position 2 (CAGED D)",
        pattern: [
          [0, 2, 3],      // E string
          [0, 1, 3],      // A string
          [0, 2, 4],      // D string
          [0, 2, 4],      // G string
          [1, 3, 4],      // B string
          [0, 2, 3],      // e string
        ],
        rootString: 3,
        startFret: 2
      },
      {
        name: "Position 3 (CAGED C)",
        pattern: [
          [1, 3, 4],      // E string
          [0, 2, 3],      // A string
          [0, 2, 4],      // D string
          [0, 2, 4],      // G string
          [1, 3, 4],      // B string
          [1, 3, 4],      // e string
        ],
        rootString: 1,
        startFret: 5
      },
      {
        name: "Position 4 (CAGED A)",
        pattern: [
          [1, 3, 4],      // E string
          [1, 3, 4],      // A string
          [0, 2, 4],      // D string
          [1, 2, 4],      // G string
          [1, 3, 4],      // B string
          [1, 3, 4],      // e string
        ],
        rootString: 4,
        startFret: 7
      },
      {
        name: "Position 5 (CAGED G)",
        pattern: [
          [1, 3, 4],      // E string
          [1, 3, 4],      // A string
          [1, 3, 4],      // D string
          [1, 2, 4],      // G string
          [1, 3, 5],      // B string
          [1, 3, 4],      // e string
        ],
        rootString: 2,
        startFret: 10
      }
    ]
  },

  "Natural Minor": {
    name: "Natural Minor (Aeolian)",
    description: "Sad, melancholic sound. The relative minor scale.",
    positions: [
      {
        name: "Position 1 (Open/CAGED E)",
        pattern: [
          [0, 2, 3],      // E string
          [0, 1, 3],      // A string
          [0, 2, 3],      // D string
          [0, 2, 3],      // G string
          [0, 1, 3],      // B string
          [0, 2, 3],      // e string
        ],
        rootString: 0,
        startFret: 0
      },
      {
        name: "Position 2 (CAGED D)",
        pattern: [
          [0, 2, 3],      // E string
          [0, 1, 3],      // A string
          [0, 2, 3],      // D string
          [0, 2, 3],      // G string
          [1, 3, 4],      // B string
          [1, 3, 4],      // e string
        ],
        rootString: 3,
        startFret: 3
      },
      {
        name: "Position 3 (CAGED C)",
        pattern: [
          [0, 2, 3],      // E string
          [0, 1, 3],      // A string
          [0, 1, 3],      // D string
          [0, 2, 3],      // G string
          [1, 3, 4],      // B string
          [1, 3, 4],      // e string
        ],
        rootString: 1,
        startFret: 5
      },
      {
        name: "Position 4 (CAGED A)",
        pattern: [
          [1, 2, 4],      // E string
          [1, 3, 4],      // A string
          [1, 3, 4],      // D string
          [1, 3, 4],      // G string
          [1, 3, 4],      // B string
          [1, 3, 4],      // e string
        ],
        rootString: 4,
        startFret: 7
      },
      {
        name: "Position 5 (CAGED G)",
        pattern: [
          [1, 2, 4],      // E string
          [1, 3, 4],      // A string
          [1, 3, 4],      // D string
          [1, 3, 5],      // G string
          [1, 3, 4],      // B string
          [1, 3, 4],      // e string
        ],
        rootString: 2,
        startFret: 10
      }
    ]
  },

  "Pentatonic Major": {
    name: "Major Pentatonic",
    description: "5-note scale, great for rock, blues, and country solos",
    positions: [
      {
        name: "Position 1 (Box 1)",
        pattern: [
          [0, 2],         // E string
          [0, 2],         // A string
          [0, 2, 4],      // D string
          [0, 2, 4],      // G string
          [0, 2],         // B string
          [0, 2],         // e string
        ],
        rootString: 0,
        startFret: 0
      },
      {
        name: "Position 2 (Box 2)",
        pattern: [
          [2, 4],         // E string
          [2, 4],         // A string
          [1, 4],         // D string
          [1, 4],         // G string
          [2, 5],         // B string
          [2, 4],         // e string
        ],
        rootString: 3,
        startFret: 2
      },
      {
        name: "Position 3 (Box 3)",
        pattern: [
          [1, 4],         // E string
          [2, 4],         // A string
          [1, 4],         // D string
          [1, 3],         // G string
          [2, 5],         // B string
          [2, 5],         // e string
        ],
        rootString: 1,
        startFret: 4
      },
      {
        name: "Position 4 (Box 4)",
        pattern: [
          [1, 4],         // E string
          [2, 4],         // A string
          [1, 3],         // D string
          [1, 3],         // G string
          [2, 5],         // B string
          [2, 5],         // e string
        ],
        rootString: 4,
        startFret: 7
      },
      {
        name: "Position 5 (Box 5)",
        pattern: [
          [2, 4],         // E string
          [2, 4],         // A string
          [1, 3],         // D string
          [1, 3],         // G string
          [0, 3],         // B string
          [2, 5],         // e string
        ],
        rootString: 2,
        startFret: 9
      }
    ]
  },

  "Pentatonic Minor": {
    name: "Minor Pentatonic",
    description: "The most popular scale in rock, blues, and metal solos",
    positions: [
      {
        name: "Position 1 (Box 1)",
        pattern: [
          [0, 3],         // E string
          [0, 3],         // A string
          [0, 2, 3],      // D string
          [0, 2, 3],      // G string
          [0, 3],         // B string
          [0, 3],         // e string
        ],
        rootString: 0,
        startFret: 0
      },
      {
        name: "Position 2 (Box 2)",
        pattern: [
          [0, 3],         // E string
          [0, 2],         // A string
          [0, 2],         // D string
          [0, 2, 4],      // G string
          [0, 3, 5],      // B string
          [0, 3],         // e string
        ],
        rootString: 3,
        startFret: 3
      },
      {
        name: "Position 3 (Box 3)",
        pattern: [
          [1, 3],         // E string
          [0, 2],         // A string
          [0, 2],         // D string
          [0, 2],         // G string
          [0, 3],         // B string
          [1, 3],         // e string
        ],
        rootString: 1,
        startFret: 5
      },
      {
        name: "Position 4 (Box 4)",
        pattern: [
          [1, 3],         // E string
          [1, 4],         // A string
          [1, 3],         // D string
          [1, 3],         // G string
          [1, 3],         // B string
          [1, 4],         // e string
        ],
        rootString: 4,
        startFret: 7
      },
      {
        name: "Position 5 (Box 5)",
        pattern: [
          [1, 4],         // E string
          [1, 4],         // A string
          [1, 3],         // D string
          [1, 3],         // G string
          [1, 4],         // B string
          [1, 4],         // e string
        ],
        rootString: 2,
        startFret: 10
      }
    ]
  },

  "Dorian": {
    name: "Dorian Mode",
    description: "Minor sound with a raised 6th. Popular in jazz, rock, and funk.",
    positions: [
      {
        name: "Position 1 (Open/CAGED E)",
        pattern: [
          [0, 2, 3],      // E string
          [0, 2, 3],      // A string
          [0, 2, 4],      // D string
          [0, 2, 3],      // G string
          [0, 2, 3],      // B string
          [0, 2, 3],      // e string
        ],
        rootString: 0,
        startFret: 0
      },
      {
        name: "Position 2 (CAGED D)",
        pattern: [
          [0, 2, 3],      // E string
          [0, 1, 3],      // A string
          [0, 2, 4],      // D string
          [0, 2, 3],      // G string
          [1, 3, 4],      // B string
          [0, 2, 3],      // e string
        ],
        rootString: 3,
        startFret: 2
      },
      {
        name: "Position 3 (CAGED C)",
        pattern: [
          [1, 3, 4],      // E string
          [0, 2, 3],      // A string
          [0, 2, 4],      // D string
          [0, 2, 3],      // G string
          [1, 3, 4],      // B string
          [1, 3, 4],      // e string
        ],
        rootString: 1,
        startFret: 5
      },
      {
        name: "Position 4 (CAGED A)",
        pattern: [
          [1, 3, 4],      // E string
          [1, 3, 4],      // A string
          [1, 3, 4],      // D string
          [1, 2, 4],      // G string
          [1, 3, 4],      // B string
          [1, 3, 4],      // e string
        ],
        rootString: 4,
        startFret: 7
      },
      {
        name: "Position 5 (CAGED G)",
        pattern: [
          [1, 3, 4],      // E string
          [1, 3, 4],      // A string
          [1, 3, 4],      // D string
          [1, 2, 4],      // G string
          [1, 3, 5],      // B string
          [1, 3, 4],      // e string
        ],
        rootString: 2,
        startFret: 10
      }
    ]
  },

  "Phrygian": {
    name: "Phrygian Mode",
    description: "Dark, Spanish/flamenco sound. Minor with a flat 2nd.",
    positions: [
      {
        name: "Position 1 (Open/CAGED E)",
        pattern: [
          [0, 1, 3],      // E string
          [0, 1, 3],      // A string
          [0, 2, 3],      // D string
          [0, 2, 3],      // G string
          [0, 1, 3],      // B string
          [0, 1, 3],      // e string
        ],
        rootString: 0,
        startFret: 0
      },
      {
        name: "Position 2 (CAGED D)",
        pattern: [
          [0, 1, 3],      // E string
          [0, 1, 3],      // A string
          [0, 2, 3],      // D string
          [0, 2, 3],      // G string
          [1, 3, 4],      // B string
          [1, 3, 4],      // e string
        ],
        rootString: 3,
        startFret: 3
      },
      {
        name: "Position 3 (CAGED C)",
        pattern: [
          [0, 1, 3],      // E string
          [0, 1, 3],      // A string
          [0, 1, 3],      // D string
          [0, 2, 3],      // G string
          [1, 3, 4],      // B string
          [1, 3, 4],      // e string
        ],
        rootString: 1,
        startFret: 5
      },
      {
        name: "Position 4 (CAGED A)",
        pattern: [
          [1, 2, 4],      // E string
          [1, 3, 4],      // A string
          [1, 3, 4],      // D string
          [1, 3, 4],      // G string
          [1, 3, 4],      // B string
          [1, 3, 4],      // e string
        ],
        rootString: 4,
        startFret: 7
      },
      {
        name: "Position 5 (CAGED G)",
        pattern: [
          [1, 2, 4],      // E string
          [1, 3, 4],      // A string
          [1, 3, 4],      // D string
          [1, 3, 5],      // G string
          [1, 3, 4],      // B string
          [1, 3, 4],      // e string
        ],
        rootString: 2,
        startFret: 10
      }
    ]
  },

  "Lydian": {
    name: "Lydian Mode",
    description: "Bright, dreamy major sound with a raised 4th. Sounds ethereal.",
    positions: [
      {
        name: "Position 1 (Open/CAGED E)",
        pattern: [
          [0, 2, 4],      // E string
          [0, 2, 4],      // A string
          [0, 2, 4],      // D string
          [0, 2, 4],      // G string
          [0, 2, 3],      // B string
          [0, 2, 4],      // e string
        ],
        rootString: 0,
        startFret: 0
      },
      {
        name: "Position 2 (CAGED D)",
        pattern: [
          [0, 2, 4],      // E string
          [0, 2, 4],      // A string
          [0, 2, 4],      // D string
          [0, 2, 4],      // G string
          [1, 3, 4],      // B string
          [0, 2, 4],      // e string
        ],
        rootString: 3,
        startFret: 2
      },
      {
        name: "Position 3 (CAGED C)",
        pattern: [
          [1, 3, 4],      // E string
          [1, 3, 4],      // A string
          [0, 2, 4],      // D string
          [0, 2, 4],      // G string
          [1, 3, 4],      // B string
          [1, 3, 4],      // e string
        ],
        rootString: 1,
        startFret: 5
      },
      {
        name: "Position 4 (CAGED A)",
        pattern: [
          [1, 3, 4],      // E string
          [1, 3, 4],      // A string
          [1, 3, 4],      // D string
          [1, 2, 4],      // G string
          [1, 3, 4],      // B string
          [1, 3, 4],      // e string
        ],
        rootString: 4,
        startFret: 7
      },
      {
        name: "Position 5 (CAGED G)",
        pattern: [
          [1, 3, 4],      // E string
          [1, 3, 4],      // A string
          [1, 3, 4],      // D string
          [1, 2, 4],      // G string
          [1, 3, 5],      // B string
          [1, 3, 4],      // e string
        ],
        rootString: 2,
        startFret: 10
      }
    ]
  },

  "Mixolydian": {
    name: "Mixolydian Mode",
    description: "Major scale with a flat 7th. Dominant, bluesy rock sound.",
    positions: [
      {
        name: "Position 1 (Open/CAGED E)",
        pattern: [
          [0, 2, 3],      // E string
          [0, 2, 3],      // A string
          [0, 2, 4],      // D string
          [0, 2, 4],      // G string
          [0, 3, 5],      // B string
          [0, 2, 3],      // e string
        ],
        rootString: 0,
        startFret: 0
      },
      {
        name: "Position 2 (CAGED D)",
        pattern: [
          [0, 2, 3],      // E string
          [0, 1, 3],      // A string
          [0, 2, 4],      // D string
          [0, 2, 4],      // G string
          [0, 3, 5],      // B string
          [0, 2, 3],      // e string
        ],
        rootString: 3,
        startFret: 2
      },
      {
        name: "Position 3 (CAGED C)",
        pattern: [
          [1, 3, 4],      // E string
          [0, 2, 3],      // A string
          [0, 2, 4],      // D string
          [0, 2, 4],      // G string
          [0, 3, 5],      // B string
          [1, 3, 4],      // e string
        ],
        rootString: 1,
        startFret: 5
      },
      {
        name: "Position 4 (CAGED A)",
        pattern: [
          [1, 3, 4],      // E string
          [1, 3, 4],      // A string
          [0, 2, 4],      // D string
          [1, 2, 4],      // G string
          [0, 3, 5],      // B string
          [1, 3, 4],      // e string
        ],
        rootString: 4,
        startFret: 7
      },
      {
        name: "Position 5 (CAGED G)",
        pattern: [
          [1, 3, 4],      // E string
          [1, 3, 4],      // A string
          [1, 3, 4],      // D string
          [1, 2, 4],      // G string
          [0, 3, 5],      // B string
          [1, 3, 4],      // e string
        ],
        rootString: 2,
        startFret: 10
      }
    ]
  },

  "Locrian": {
    name: "Locrian Mode",
    description: "The darkest mode. Diminished sound with flat 2nd and flat 5th.",
    positions: [
      {
        name: "Position 1 (Open/CAGED E)",
        pattern: [
          [0, 1, 3],      // E string
          [0, 1, 3],      // A string
          [0, 1, 3],      // D string
          [0, 2, 3],      // G string
          [0, 1, 3],      // B string
          [0, 1, 3],      // e string
        ],
        rootString: 0,
        startFret: 0
      },
      {
        name: "Position 2 (CAGED D)",
        pattern: [
          [0, 1, 3],      // E string
          [0, 1, 3],      // A string
          [0, 1, 3],      // D string
          [0, 2, 3],      // G string
          [1, 3, 4],      // B string
          [1, 3, 4],      // e string
        ],
        rootString: 3,
        startFret: 3
      },
      {
        name: "Position 3 (CAGED C)",
        pattern: [
          [0, 1, 3],      // E string
          [0, 1, 3],      // A string
          [0, 1, 3],      // D string
          [0, 2, 3],      // G string
          [1, 3, 4],      // B string
          [1, 3, 4],      // e string
        ],
        rootString: 1,
        startFret: 5
      },
      {
        name: "Position 4 (CAGED A)",
        pattern: [
          [1, 2, 4],      // E string
          [1, 3, 4],      // A string
          [1, 3, 4],      // D string
          [1, 3, 5],      // G string
          [1, 3, 4],      // B string
          [1, 3, 4],      // e string
        ],
        rootString: 4,
        startFret: 7
      },
      {
        name: "Position 5 (CAGED G)",
        pattern: [
          [1, 2, 4],      // E string
          [1, 3, 4],      // A string
          [1, 3, 4],      // D string
          [1, 3, 5],      // G string
          [1, 3, 4],      // B string
          [1, 3, 4],      // e string
        ],
        rootString: 2,
        startFret: 10
      }
    ]
  },

  "Blues": {
    name: "Blues Scale",
    description: "Minor pentatonic + blue note (b5). Essential for blues!",
    positions: [
      {
        name: "Position 1 (Box 1)",
        pattern: [
          [0, 3],         // E string
          [0, 3],         // A string
          [0, 1, 2, 3],   // D string (includes blue note)
          [0, 2, 3],      // G string
          [0, 3],         // B string
          [0, 3],         // e string
        ],
        rootString: 0,
        startFret: 0
      },
      {
        name: "Position 2 (Box 2)",
        pattern: [
          [0, 3],         // E string
          [0, 2, 3],      // A string (includes blue note)
          [0, 2],         // D string
          [0, 2, 4],      // G string
          [0, 3, 5],      // B string
          [0, 3],         // e string
        ],
        rootString: 3,
        startFret: 3
      },
      {
        name: "Position 3 (Box 3)",
        pattern: [
          [1, 3],         // E string
          [0, 2],         // A string
          [0, 2],         // D string
          [0, 1, 2],      // G string (includes blue note)
          [0, 3],         // B string
          [1, 3],         // e string
        ],
        rootString: 1,
        startFret: 5
      },
      {
        name: "Position 4 (Box 4)",
        pattern: [
          [1, 3],         // E string
          [1, 4],         // A string
          [1, 2, 3],      // D string (includes blue note)
          [1, 3],         // G string
          [1, 3],         // B string
          [1, 4],         // e string
        ],
        rootString: 4,
        startFret: 7
      },
      {
        name: "Position 5 (Box 5)",
        pattern: [
          [1, 4],         // E string
          [1, 4],         // A string
          [1, 3],         // D string
          [1, 3, 4],      // G string (includes blue note)
          [1, 4],         // B string
          [1, 4],         // e string
        ],
        rootString: 2,
        startFret: 10
      }
    ]
  }
}

export const NOTES = ["C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B"]

// Get scale intervals for a given scale type
export function getScaleIntervals(scaleType: string): number[] {
  const intervals: Record<string, number[]> = {
    "Major": [0, 2, 4, 5, 7, 9, 11],
    "Natural Minor": [0, 2, 3, 5, 7, 8, 10],
    "Dorian": [0, 2, 3, 5, 7, 9, 10],
    "Phrygian": [0, 1, 3, 5, 7, 8, 10],
    "Lydian": [0, 2, 4, 6, 7, 9, 11],
    "Mixolydian": [0, 2, 4, 5, 7, 9, 10],
    "Locrian": [0, 1, 3, 5, 6, 8, 10],
    "Pentatonic Major": [0, 2, 4, 7, 9],
    "Pentatonic Minor": [0, 3, 5, 7, 10],
    "Blues": [0, 3, 5, 6, 7, 10]
  }
  return intervals[scaleType] || []
}

// Get note names for a scale
export function getScaleNotes(rootIndex: number, scaleType: string): string[] {
  const intervals = getScaleIntervals(scaleType)
  return intervals.map(interval => NOTES[(rootIndex + interval) % 12])
}
