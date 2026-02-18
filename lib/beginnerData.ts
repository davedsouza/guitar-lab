// Guitar parts with descriptions
export const GUITAR_PARTS = [
  { name: 'Headstock', description: 'Top of the guitar where tuning pegs are located' },
  { name: 'Tuning Pegs', description: 'Turn these to tune each string higher or lower' },
  { name: 'Nut', description: 'Small piece at the top of the neck that holds strings in place' },
  { name: 'Neck', description: 'The long part you hold and press strings against' },
  { name: 'Frets', description: 'Metal strips on the neck - pressing behind them changes pitch' },
  { name: 'Fretboard', description: 'The front surface of the neck where you press strings' },
  { name: 'Body', description: 'The large main part of the guitar that produces sound' },
  { name: 'Sound Hole', description: 'The hole in acoustic guitars that projects sound (acoustic only)' },
  { name: 'Bridge', description: 'Anchors the strings to the body of the guitar' },
  { name: 'Pickups', description: 'Magnetic devices that capture string vibrations (electric only)' },
]

// String info with mnemonic
export const STRING_INFO = [
  { string: 6, note: 'E', name: 'Low E', mnemonic: 'Elephants' },
  { string: 5, note: 'A', name: 'A', mnemonic: 'And' },
  { string: 4, note: 'D', name: 'D', mnemonic: 'Donkeys' },
  { string: 3, note: 'G', name: 'G', mnemonic: 'Grow' },
  { string: 2, note: 'B', name: 'B', mnemonic: 'Big' },
  { string: 1, note: 'e', name: 'High E', mnemonic: 'Ears' },
]

export interface BeginnerChord {
  name: string
  fingers: (number | string)[]
  difficulty: 'Easy' | 'Medium' | 'Hard'
  tips: string[]
}

// Beginner 7 chords with fingers array, tips, difficulty
export const BEGINNER_CHORDS: BeginnerChord[] = [
  {
    name: 'G',
    fingers: [3, 2, 0, 0, 0, 3],
    difficulty: 'Medium',
    tips: [
      'Ring finger on 6th string, 3rd fret',
      'Middle finger on 5th string, 2nd fret',
      'Pinky on 1st string, 3rd fret',
      'Keep your fingers arched to let open strings ring'
    ]
  },
  {
    name: 'C',
    fingers: ['x', 3, 2, 0, 1, 0],
    difficulty: 'Easy',
    tips: [
      'Ring finger on 5th string, 3rd fret',
      'Middle finger on 4th string, 2nd fret',
      'Index finger on 2nd string, 1st fret',
      'Don\'t play the 6th string (muted)'
    ]
  },
  {
    name: 'D',
    fingers: ['x', 'x', 0, 2, 3, 2],
    difficulty: 'Easy',
    tips: [
      'Index finger on 3rd string, 2nd fret',
      'Ring finger on 2nd string, 3rd fret',
      'Middle finger on 1st string, 2nd fret',
      'Only strum the top 4 strings'
    ]
  },
  {
    name: 'Em',
    fingers: [0, 2, 2, 0, 0, 0],
    difficulty: 'Easy',
    tips: [
      'Middle finger on 5th string, 2nd fret',
      'Ring finger on 4th string, 2nd fret',
      'All other strings are open',
      'The easiest chord to start with!'
    ]
  },
  {
    name: 'Am',
    fingers: ['x', 0, 2, 2, 1, 0],
    difficulty: 'Easy',
    tips: [
      'Middle finger on 4th string, 2nd fret',
      'Ring finger on 3rd string, 2nd fret',
      'Index finger on 2nd string, 1st fret',
      'Similar shape to E major, just moved over'
    ]
  },
  {
    name: 'E',
    fingers: [0, 2, 2, 1, 0, 0],
    difficulty: 'Easy',
    tips: [
      'Middle finger on 5th string, 2nd fret',
      'Ring finger on 4th string, 2nd fret',
      'Index finger on 3rd string, 1st fret',
      'All 6 strings should ring clearly'
    ]
  },
  {
    name: 'A',
    fingers: ['x', 0, 2, 2, 2, 0],
    difficulty: 'Medium',
    tips: [
      'Index, middle, and ring finger all on 2nd fret',
      'Stack them on strings 4, 3, and 2',
      'Don\'t play the 6th string',
      'Try to keep fingers compact and close together'
    ]
  },
]

export interface ChordTransition {
  from: string
  to: string
  tips: string[]
  anchorFinger?: string
}

// Chord transitions with anchor finger tips
export const BEGINNER_TRANSITIONS: ChordTransition[] = [
  {
    from: 'G',
    to: 'C',
    tips: [
      'Ring finger stays in position (3rd fret)',
      'Move middle finger from 5th to 4th string',
      'Add index finger on 2nd string',
    ],
    anchorFinger: 'Ring finger can stay anchored'
  },
  {
    from: 'G',
    to: 'D',
    tips: [
      'Lift all fingers and reset',
      'Form a triangle shape with D chord',
      'Practice this transition slowly at first',
    ],
  },
  {
    from: 'D',
    to: 'A',
    tips: [
      'Slide the shape down one string set',
      'Keep the same relative finger positions',
      'Index, middle, ring stay close together',
    ],
  },
  {
    from: 'Am',
    to: 'Em',
    tips: [
      'Middle and ring fingers just slide over one string',
      'Lift index finger completely',
      'Very similar shapes - one of the easiest transitions',
    ],
    anchorFinger: 'Middle and ring move together'
  },
  {
    from: 'C',
    to: 'Am',
    tips: [
      'Ring finger lifts, middle finger slides down',
      'Index finger stays on same fret, moves up one string',
      'Both chords share similar hand position',
    ],
    anchorFinger: 'Index finger pivots'
  },
]

export interface StrumPattern {
  name: string
  pattern: ('D' | 'U' | '-')[]
  description: string
  bpm: number
}

// Basic strumming patterns
export const BASIC_STRUMMING: StrumPattern[] = [
  {
    name: 'All Down Strums',
    pattern: ['D', 'D', 'D', 'D'],
    description: 'The most basic pattern. Strum down on each beat.',
    bpm: 60
  },
  {
    name: 'Down-Up Basic',
    pattern: ['D', 'U', 'D', 'U'],
    description: 'Alternating down and up strums. Keep your wrist loose.',
    bpm: 80
  },
  {
    name: 'Folk/Pop Pattern',
    pattern: ['D', '-', 'D', 'U', '-', 'U', 'D', 'U'],
    description: 'Classic pattern: Down, Down-Up, Up-Down-Up. Used in countless songs.',
    bpm: 90
  },
  {
    name: 'Simple Rock',
    pattern: ['D', 'D', 'U', 'U', 'D', 'U'],
    description: 'Driving rock feel with emphasis on downbeats.',
    bpm: 100
  },
]

// Tuning info
export const TUNING_INFO = {
  standardTuning: ['E', 'A', 'D', 'G', 'B', 'e'],
  fifthFretMethod: [
    { fret: 5, string: 6, matches: 'Open 5th string (A)' },
    { fret: 5, string: 5, matches: 'Open 4th string (D)' },
    { fret: 5, string: 4, matches: 'Open 3rd string (G)' },
    { fret: 4, string: 3, matches: 'Open 2nd string (B) - Note: 4th fret!' },
    { fret: 5, string: 2, matches: 'Open 1st string (e)' },
  ],
  tips: [
    'Always tune from below the note up to pitch',
    'Check your tuning frequently as you play',
    'Use a clip-on tuner or tuning app for accuracy',
    'New strings stretch and need frequent retuning',
  ]
}

export interface FingerExercise {
  name: string
  description: string
  steps: string[]
  purpose: string
}

// Finger exercises
export const FINGER_EXERCISES: FingerExercise[] = [
  {
    name: 'Chromatic Exercise',
    description: 'Play each fret in sequence across all strings',
    steps: [
      'Start on the 6th string, 1st fret',
      'Play frets 1-2-3-4 using fingers 1-2-3-4',
      'Move to the 5th string and repeat',
      'Continue through all 6 strings',
      'Then reverse: play 4-3-2-1 going back up',
    ],
    purpose: 'Builds finger independence and strength'
  },
  {
    name: 'Spider Exercise',
    description: 'Alternating finger pattern that looks like spider legs',
    steps: [
      'Start on 6th string: frets 1-2-3-4',
      'On 5th string: frets 2-3-4-5',
      'On 4th string: frets 3-4-5-6',
      'Continue the pattern ascending',
      'Reverse on the way back',
    ],
    purpose: 'Improves finger stretch and coordination'
  },
  {
    name: 'One-Finger-Per-Fret',
    description: 'Train each finger to handle its own fret',
    steps: [
      'Position hand so each finger covers one fret (1-4)',
      'Press and release each finger while keeping others down',
      'Start slow and focus on clean notes',
      'Move this position up and down the neck',
    ],
    purpose: 'Develops finger independence'
  },
]

export interface BeginnerSong {
  title: string
  artist: string
  chords: string[]
  difficulty: 'Very Easy' | 'Easy' | 'Medium'
  notes: string
}

// Beginner song suggestions
export const BEGINNER_SONGS: BeginnerSong[] = [
  {
    title: 'Horse With No Name',
    artist: 'America',
    chords: ['Em', 'D6/9'],
    difficulty: 'Very Easy',
    notes: 'Only 2 chords! D6/9 is similar to Em shape moved over.'
  },
  {
    title: 'Knockin\' on Heaven\'s Door',
    artist: 'Bob Dylan',
    chords: ['G', 'D', 'Am', 'C'],
    difficulty: 'Easy',
    notes: 'Classic 4-chord song. Great for practicing transitions.'
  },
  {
    title: 'Wonderful Tonight',
    artist: 'Eric Clapton',
    chords: ['G', 'D', 'C', 'Em'],
    difficulty: 'Easy',
    notes: 'Slow tempo makes chord changes easier to manage.'
  },
  {
    title: 'Three Little Birds',
    artist: 'Bob Marley',
    chords: ['A', 'D', 'E'],
    difficulty: 'Easy',
    notes: 'Reggae rhythm with 3 open chords. "Don\'t worry about a thing!"'
  },
  {
    title: 'Stand By Me',
    artist: 'Ben E. King',
    chords: ['G', 'Em', 'C', 'D'],
    difficulty: 'Easy',
    notes: 'Iconic progression. Practice the G to Em transition.'
  },
]

export interface CommonMistake {
  mistake: string
  symptom: string
  fix: string
}

// Common mistakes with fixes
export const COMMON_MISTAKES: CommonMistake[] = [
  {
    mistake: 'Pressing too hard',
    symptom: 'Fingers hurt quickly, notes sound sharp, hand fatigue',
    fix: 'Press just hard enough to get a clear note. Relax your grip.'
  },
  {
    mistake: 'Pressing too soft',
    symptom: 'Buzzing or muted notes, unclear sound',
    fix: 'Press firmly right behind the fret (not on it). Check finger position.'
  },
  {
    mistake: 'Accidentally muting strings',
    symptom: 'Some strings don\'t ring out, dead notes in chords',
    fix: 'Arch your fingers more. Keep fingertips perpendicular to fretboard.'
  },
  {
    mistake: 'Poor posture',
    symptom: 'Back pain, neck strain, difficulty reaching frets',
    fix: 'Sit up straight, guitar body on your thigh, neck angled slightly up.'
  },
  {
    mistake: 'Rushing chord changes',
    symptom: 'Sloppy transitions, losing the beat, frustration',
    fix: 'Slow down! Practice changes separately. Speed comes with muscle memory.'
  },
  {
    mistake: 'Thumb position',
    symptom: 'Hand cramping, limited reach, weak grip',
    fix: 'Keep thumb behind the neck, roughly opposite your middle finger.'
  },
  {
    mistake: 'Looking at picking hand too much',
    symptom: 'Slow chord finding, can\'t watch music/audience',
    fix: 'Trust your strumming hand. Focus on fretting hand and build muscle memory.'
  },
]

export interface Section {
  id: string
  name: string
  icon: string
}

// App usage guide
export interface AppModule {
  name: string
  description: string
  icon: string
  features: string[]
  tips: string[]
}

export const APP_MODULES: AppModule[] = [
  {
    name: 'Beginner Module',
    description: 'Where you are now! Learn the fundamentals of guitar playing.',
    icon: '🌟',
    features: [
      'Guitar anatomy and string names',
      'How to hold the guitar properly',
      'Reading chord diagrams and TAB',
      'Your first 7 chords with tips',
      'Common mistakes and how to fix them'
    ],
    tips: ['Start here if you\'re new to guitar', 'Work through each section in order']
  },
  {
    name: 'Chord Building',
    description: 'Learn how chords are constructed from intervals and scales.',
    icon: '🎸',
    features: [
      'Select any root note',
      'Choose chord types (Major, Minor, 7th, etc.)',
      'See the notes that make up each chord',
      'View chord diagrams for multiple positions'
    ],
    tips: ['Great for understanding WHY chords sound the way they do']
  },
  {
    name: 'Chord Progressions',
    description: 'Explore common chord progressions used in popular music.',
    icon: '🎵',
    features: [
      'Popular progressions (I-IV-V, ii-V-I, etc.)',
      'Practice in any key',
      'See chord diagrams for each progression'
    ],
    tips: ['Learn the most common progressions first - they appear in thousands of songs']
  },
  {
    name: 'Guitar Scales',
    description: 'Master essential scales across the fretboard.',
    icon: '🎼',
    features: [
      'Major and minor scales',
      'Pentatonic and blues scales',
      'Multiple positions and patterns',
      'Full fretboard visualization'
    ],
    tips: ['Start with the minor pentatonic - it\'s the most versatile for beginners']
  },
  {
    name: 'CAGED System',
    description: 'Unlock the entire fretboard using 5 interconnected chord shapes.',
    icon: '🔗',
    features: [
      'Learn the 5 CAGED shapes',
      'See how they connect across the neck',
      'Play any chord anywhere on the fretboard'
    ],
    tips: ['This is intermediate level - master your open chords first']
  },
  {
    name: 'Rhythm Trainer',
    description: 'Master strumming patterns and timing.',
    icon: '🥁',
    features: [
      'Visual strumming patterns',
      'Multiple genres (rock, folk, reggae)',
      'Practice with different tempos'
    ],
    tips: ['Use a metronome and start slow - speed comes with practice']
  },
]

// Section navigation config
export const SECTIONS: Section[] = [
  { id: 'anatomy', name: 'Guitar Anatomy', icon: '🎸' },
  { id: 'holding', name: 'How to Hold', icon: '🤲' },
  { id: 'diagrams', name: 'Reading Chord Diagrams', icon: '📊' },
  { id: 'tab', name: 'Reading TAB', icon: '📝' },
  { id: 'chords', name: 'Your First Chords', icon: '🎵' },
  { id: 'transitions', name: 'Chord Transitions', icon: '🔄' },
  { id: 'strumming', name: 'Basic Strumming', icon: '👋' },
  { id: 'tuning', name: 'How to Tune', icon: '🎚️' },
  { id: 'exercises', name: 'Finger Exercises', icon: '💪' },
  { id: 'songs', name: 'First Songs', icon: '🎤' },
  { id: 'mistakes', name: 'Common Mistakes', icon: '⚠️' },
]
