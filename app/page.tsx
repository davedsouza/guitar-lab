import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            Guitar Lab
          </h1>
          <p className="text-xl text-purple-200">
            Master guitar theory, technique, and fretboard knowledge
          </p>
        </header>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* How to Use This App Card */}
          <Link href="/how-to-use">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition-all cursor-pointer border border-white/20 hover:scale-105">
              <div className="text-4xl mb-4">📱</div>
              <h2 className="text-2xl font-bold text-white mb-3">
                How to Use This App
              </h2>
              <p className="text-purple-200 mb-4">
                New here? Get an overview of all modules and follow structured learning paths for beginner, intermediate, or advanced levels.
              </p>
              <div className="text-purple-300 font-semibold">
                View Guide →
              </div>
            </div>
          </Link>

          {/* Beginner Module Card */}
          <Link href="/beginner">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition-all cursor-pointer border border-white/20 hover:scale-105">
              <div className="text-4xl mb-4">🌟</div>
              <h2 className="text-2xl font-bold text-white mb-3">
                Beginner Module
              </h2>
              <p className="text-purple-200 mb-4">
                Just starting out? Learn guitar anatomy, how to hold your guitar, read chord diagrams, and play your first chords.
              </p>
              <div className="text-purple-300 font-semibold">
                Start Here →
              </div>
            </div>
          </Link>

          {/* Chord Building Card */}
          <Link href="/chord-builder">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition-all cursor-pointer border border-white/20 hover:scale-105">
              <div className="text-4xl mb-4">🎸</div>
              <h2 className="text-2xl font-bold text-white mb-3">
                Chord Building
              </h2>
              <p className="text-purple-200 mb-4">
                Learn how chords are constructed from the ground up. Understand intervals, triads, and extensions.
              </p>
              <div className="text-purple-300 font-semibold">
                Start Learning →
              </div>
            </div>
          </Link>

          {/* Chord Progressions Card */}
          <Link href="/progressions">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition-all cursor-pointer border border-white/20 hover:scale-105">
              <div className="text-4xl mb-4">🎵</div>
              <h2 className="text-2xl font-bold text-white mb-3">
                Chord Progressions
              </h2>
              <p className="text-purple-200 mb-4">
                Explore common progressions used in popular music. Practice in all keys and understand the theory.
              </p>
              <div className="text-purple-300 font-semibold">
                Explore Progressions →
              </div>
            </div>
          </Link>

          {/* Scales Card */}
          <Link href="/scales">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition-all cursor-pointer border border-white/20 hover:scale-105">
              <div className="text-4xl mb-4">🎼</div>
              <h2 className="text-2xl font-bold text-white mb-3">
                Guitar Scales
              </h2>
              <p className="text-purple-200 mb-4">
                Master essential scales across the fretboard. Learn positions, patterns, and soloing techniques.
              </p>
              <div className="text-purple-300 font-semibold">
                Learn Scales →
              </div>
            </div>
          </Link>

          {/* Nashville Number System Card */}
          <Link href="/nashville-number-system">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition-all cursor-pointer border border-white/20 hover:scale-105">
              <div className="text-4xl mb-4">🎯</div>
              <h2 className="text-2xl font-bold text-white mb-3">
                Nashville Number System
              </h2>
              <p className="text-purple-200 mb-4">
                Learn the universal language of chord progressions. Transpose songs instantly to any key.
              </p>
              <div className="text-purple-300 font-semibold">
                Learn the System →
              </div>
            </div>
          </Link>

          {/* Music Theory Card */}
          <Link href="/music-theory">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition-all cursor-pointer border border-white/20 hover:scale-105">
              <div className="text-4xl mb-4">📚</div>
              <h2 className="text-2xl font-bold text-white mb-3">
                Music Theory
              </h2>
              <p className="text-purple-200 mb-4">
                Build a strong foundation in music theory. Learn notes, intervals, chord construction, and more.
              </p>
              <div className="text-purple-300 font-semibold">
                Study Theory →
              </div>
            </div>
          </Link>

          {/* CAGED System Card */}
          <Link href="/caged-system">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition-all cursor-pointer border border-white/20 hover:scale-105">
              <div className="text-4xl mb-4">🔗</div>
              <h2 className="text-2xl font-bold text-white mb-3">
                CAGED System
              </h2>
              <p className="text-purple-200 mb-4">
                Master the fretboard using 5 interconnected chord shapes. See how everything connects across the neck.
              </p>
              <div className="text-purple-300 font-semibold">
                Unlock the Fretboard →
              </div>
            </div>
          </Link>

          {/* Chord Substitutions Card */}
          <Link href="/chord-substitutions">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition-all cursor-pointer border border-white/20 hover:scale-105">
              <div className="text-4xl mb-4">🎭</div>
              <h2 className="text-2xl font-bold text-white mb-3">
                Chord Substitutions
              </h2>
              <p className="text-purple-200 mb-4">
                Learn advanced techniques to replace chords with alternatives. Add color and sophistication to your playing.
              </p>
              <div className="text-purple-300 font-semibold">
                Explore Substitutions →
              </div>
            </div>
          </Link>

          {/* Fingerstyle Patterns Card */}
          <Link href="/fingerstyle-patterns">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition-all cursor-pointer border border-white/20 hover:scale-105">
              <div className="text-4xl mb-4">🎹</div>
              <h2 className="text-2xl font-bold text-white mb-3">
                Fingerstyle Patterns
              </h2>
              <p className="text-purple-200 mb-4">
                Master fingerpicking patterns from Travis picking to classical techniques. Build independence and fluidity.
              </p>
              <div className="text-purple-300 font-semibold">
                Learn Patterns →
              </div>
            </div>
          </Link>

          {/* Rhythm Trainer Card */}
          <Link href="/rhythm-trainer">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition-all cursor-pointer border border-white/20 hover:scale-105">
              <div className="text-4xl mb-4">🥁</div>
              <h2 className="text-2xl font-bold text-white mb-3">
                Rhythm Trainer
              </h2>
              <p className="text-purple-200 mb-4">
                Master strumming patterns and timing. Learn rock, folk, reggae, and more with visual and audio guides.
              </p>
              <div className="text-purple-300 font-semibold">
                Practice Rhythm →
              </div>
            </div>
          </Link>

          {/* Arpeggios Card */}
          <Link href="/arpeggios">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition-all cursor-pointer border border-white/20 hover:scale-105">
              <div className="text-4xl mb-4">🎹</div>
              <h2 className="text-2xl font-bold text-white mb-3">
                Arpeggios
              </h2>
              <p className="text-purple-200 mb-4">
                Learn to play chords note-by-note across the fretboard. Essential for solos and melodic playing.
              </p>
              <div className="text-purple-300 font-semibold">
                Master Arpeggios →
              </div>
            </div>
          </Link>
        </div>

        {/* How to Use This App Section */}
        <div className="mt-16 max-w-7xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold text-white text-center mb-8">
              Recommended Learning Path
            </h3>
            <div className="grid md:grid-cols-5 gap-4">
              <div className="bg-white/10 rounded-xl p-5 text-center">
                <div className="bg-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mx-auto mb-3">1</div>
                <div className="text-white font-semibold mb-1">Beginner Module</div>
                <div className="text-purple-200 text-xs">Learn guitar basics, chords, and how to read diagrams</div>
              </div>
              <div className="bg-white/10 rounded-xl p-5 text-center">
                <div className="bg-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mx-auto mb-3">2</div>
                <div className="text-white font-semibold mb-1">Practice Daily</div>
                <div className="text-purple-200 text-xs">Master G, C, D, Em, Am, E, A with clean transitions</div>
              </div>
              <div className="bg-white/10 rounded-xl p-5 text-center">
                <div className="bg-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mx-auto mb-3">3</div>
                <div className="text-white font-semibold mb-1">Learn Songs</div>
                <div className="text-purple-200 text-xs">Use Chord Progressions to play real music</div>
              </div>
              <div className="bg-white/10 rounded-xl p-5 text-center">
                <div className="bg-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mx-auto mb-3">4</div>
                <div className="text-white font-semibold mb-1">Explore Theory</div>
                <div className="text-purple-200 text-xs">Dive into Scales and Chord Building</div>
              </div>
              <div className="bg-white/10 rounded-xl p-5 text-center">
                <div className="bg-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mx-auto mb-3">5</div>
                <div className="text-white font-semibold mb-1">Master Fretboard</div>
                <div className="text-purple-200 text-xs">Learn CAGED to play anywhere on the neck</div>
              </div>
            </div>
            <div className="mt-6 bg-green-500/20 border border-green-500/50 rounded-lg p-4 text-center">
              <div className="text-green-200 font-semibold mb-1">New to Guitar?</div>
              <div className="text-green-100 text-sm">
                Start with the <span className="font-bold">Beginner Module</span> above - it covers everything you need to get started!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
