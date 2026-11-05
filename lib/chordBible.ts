// Chord Bible: a reference library of chord shapes for all 12 roots and 21 chord types.
// Every shape is checked against chord theory, so it only uses notes that belong to its chord.
//
// Data format: DATA[qualityId][rootPitchClass] = "tFFFFFF tFFFFFF ..."
//   t = kind tag (c position, s shell, d drop 2, t drop 3, k extended-chord grip)
//   F = fret in base 36 (0-9, a=10 ... h=17) or x for muted, strings low E to high e.

export type VoiceKind = "position" | "shell" | "drop2" | "drop3" | "cluster"
export type BibleGroup = "Triads" | "Suspended" | "Sevenths" | "Extended"

export interface BibleQuality {
  id: string
  label: string
  libKey: string | null
  suffix: string
  group: BibleGroup
  steps: number[]
  degrees: string[]
  extra: number[]
  blurb: string
}

export const BIBLE_QUALITIES: BibleQuality[] = [
  { id: "maj", label: "Major", libKey: "Major", suffix: "", group: "Triads", steps: [0, 4, 7], degrees: ["1", "3", "5"], extra: [],
    blurb: "Bright and settled. The sound most songs call home." },
  { id: "min", label: "Minor", libKey: "Minor", suffix: "m", group: "Triads", steps: [0, 3, 7], degrees: ["1", "b3", "5"], extra: [],
    blurb: "Darker and more serious than major. Flatten the 3rd and the mood changes." },
  { id: "aug", label: "Augmented", libKey: "Augmented", suffix: "aug", group: "Triads", steps: [0, 4, 8], degrees: ["1", "3", "#5"], extra: [],
    blurb: "A major chord with a raised 5th. Unsettled and floating, it wants to move." },
  { id: "dim", label: "Diminished", libKey: "Diminished", suffix: "dim", group: "Triads", steps: [0, 3, 6], degrees: ["1", "b3", "b5"], extra: [],
    blurb: "Two stacked minor 3rds. Tense and tight, often a bridge between two other chords." },
  { id: "sus4", label: "Sus4", libKey: "Sus4", suffix: "sus4", group: "Suspended", steps: [0, 5, 7], degrees: ["1", "4", "5"], extra: [10],
    blurb: "The 3rd is replaced by the 4th. Open and unresolved; it usually falls back to the major or minor chord." },
  { id: "sus2", label: "Sus2", libKey: null, suffix: "sus2", group: "Suspended", steps: [0, 2, 7], degrees: ["1", "2", "5"], extra: [],
    blurb: "The 3rd is replaced by the 2nd. Airy and neither happy nor sad." },
  { id: "maj7", label: "Major 7th", libKey: "Major 7th", suffix: "maj7", group: "Sevenths", steps: [0, 4, 7, 11], degrees: ["1", "3", "5", "7"], extra: [],
    blurb: "A major chord plus the 7th, one fret under the root. Dreamy, warm and a little jazzy." },
  { id: "7", label: "Dominant 7th", libKey: "Dominant 7th", suffix: "7", group: "Sevenths", steps: [0, 4, 7, 10], degrees: ["1", "3", "5", "b7"], extra: [],
    blurb: "Major chord with a flat 7th. Bluesy and restless, it pulls toward the chord a 4th higher." },
  { id: "m7", label: "Minor 7th", libKey: "Minor 7th", suffix: "m7", group: "Sevenths", steps: [0, 3, 7, 10], degrees: ["1", "b3", "5", "b7"], extra: [],
    blurb: "Minor chord plus a flat 7th. Smooth and mellow, a staple of soul, funk and jazz." },
  { id: "m7b5", label: "Half-diminished", libKey: null, suffix: "m7b5", group: "Sevenths", steps: [0, 3, 6, 10], degrees: ["1", "b3", "b5", "b7"], extra: [],
    blurb: "Minor 7th with a flat 5th. The ii chord of a minor key, leading into a dominant." },
  { id: "dim7", label: "Diminished 7th", libKey: null, suffix: "dim7", group: "Sevenths", steps: [0, 3, 6, 9], degrees: ["1", "b3", "b5", "bb7"], extra: [],
    blurb: "Four notes a minor 3rd apart, so the shape repeats every three frets. Very tense and great for passing between chords." },
  { id: "7#5", label: "Dominant 7th #5", libKey: null, suffix: "7#5", group: "Sevenths", steps: [0, 4, 8, 10], degrees: ["1", "3", "#5", "b7"], extra: [],
    blurb: "A dominant 7th with a raised 5th. Extra tension before resolving." },
  { id: "maj9", label: "Major 9th", libKey: null, suffix: "maj9", group: "Extended", steps: [0, 4, 7, 11, 2], degrees: ["1", "3", "5", "7", "9"], extra: [],
    blurb: "Major 7th with the 9th on top. Lush and open, a favorite for ballads." },
  { id: "9", label: "Dominant 9th", libKey: null, suffix: "9", group: "Extended", steps: [0, 4, 7, 10, 2], degrees: ["1", "3", "5", "b7", "9"], extra: [],
    blurb: "Dominant 7th with the 9th added. The funk, blues and R&B workhorse." },
  { id: "m9", label: "Minor 9th", libKey: null, suffix: "m9", group: "Extended", steps: [0, 3, 7, 10, 2], degrees: ["1", "b3", "5", "b7", "9"], extra: [],
    blurb: "Minor 7th with the 9th added. Silky and relaxed." },
  { id: "maj11", label: "Major 11th", libKey: null, suffix: "maj11", group: "Extended", steps: [0, 4, 7, 11, 2, 5], degrees: ["1", "3", "5", "7", "9", "11"], extra: [6],
    blurb: "Stacked all the way up to the 11th. The 11th clashes with the 3rd, so many players raise it to a #11 or drop the 3rd." },
  { id: "11", label: "Dominant 11th", libKey: null, suffix: "11", group: "Extended", steps: [0, 4, 7, 10, 2, 5], degrees: ["1", "3", "5", "b7", "9", "11"], extra: [],
    blurb: "Dominant 9th plus the 11th. Often played without the 3rd, so it sounds like a sus chord with a 9th." },
  { id: "m11", label: "Minor 11th", libKey: null, suffix: "m11", group: "Extended", steps: [0, 3, 7, 10, 2, 5], degrees: ["1", "b3", "5", "b7", "9", "11"], extra: [],
    blurb: "Minor 9th plus the 11th. Spacious and moody; the 11th sits naturally in a minor chord." },
  { id: "maj13", label: "Major 13th", libKey: null, suffix: "maj13", group: "Extended", steps: [0, 4, 7, 11, 2, 9], degrees: ["1", "3", "5", "7", "9", "13"], extra: [5],
    blurb: "Major 9th with the 13th (the 6th, an octave up). Rich and full, usually with a few notes left out." },
  { id: "13", label: "Dominant 13th", libKey: null, suffix: "13", group: "Extended", steps: [0, 4, 7, 10, 2, 9], degrees: ["1", "3", "5", "b7", "9", "13"], extra: [5],
    blurb: "The big dominant chord of jazz, blues and funk. Players keep the 3rd, 7th and 13th and drop the rest." },
  { id: "m13", label: "Minor 13th", libKey: null, suffix: "m13", group: "Extended", steps: [0, 3, 7, 10, 2, 9], degrees: ["1", "b3", "5", "b7", "9", "13"], extra: [5],
    blurb: "Minor 9th with the 13th. Warm and full; again, only some of the notes are played." },
]

export const BIBLE_GROUPS: BibleGroup[] = ["Triads", "Suspended", "Sevenths", "Extended"]

export const KIND_INFO: Record<VoiceKind, { label: string; blurb: string }> = {
  position: { label: "Position", blurb: "Full shapes in a fixed spot on the neck, from open chords to barre shapes." },
  shell: { label: "Shell", blurb: "Just the root, 3rd and 7th on three strings. A light skeleton that is great for comping." },
  drop2: { label: "Drop 2", blurb: "Four notes on neighboring strings with the second voice from the top dropped an octave." },
  drop3: { label: "Drop 3", blurb: "Four notes with a bass note, one string skipped, then three on top." },
  cluster: { label: "Other", blurb: "Compact grips that do not fit the other groups." },
}
const KIND_BY_TAG: Record<string, VoiceKind> = { c: "position", s: "shell", d: "drop2", t: "drop3", k: "cluster" }
export const KINDS: VoiceKind[] = ["position", "shell", "drop2", "drop3", "cluster"]

const DATA: Record<string, string[]> = {
  "maj": [
    "c032010 cxx201x cxxx010 c032xxx cx320xx c335553 c335xxx cx355xx cxxx553 cxx555x c875558 c875xxx cx755xx cxx558x cxxx558 cxxx588 c8aa988 c8aaxxx cxxa98x cxxx988 cxaa9xx cxxacdc ccaaxxx cxaacxx cxxacdx cxxxcdc",
    "c143121 c143xxx cx431xx cxx312x cxxx121 c446664 c446xxx cx466xx cxxx664 cxx666x c986669 c986xxx cx866xx cxx669x cxxx669 cxxx699 k9bba99 k9bbxxx kxxba9x kxxxa99 kxbbaxx cxxbded cdbbxxx cxbbdxx cxxbdex cxxxded",
    "c254232 c254xxx cx542xx cxx423x cxxx232 c557775 c557xxx cx577xx cxxx775 cxx777x ca9777a ca97xxx cx977xx cxx77ax cxxx77a cxxx7aa caccbaa caccxxx cxxcbax cxxxbaa cxccbxx cxxcefe ceccxxx cxccexx cxxcefx cxxxefe",
    "cxx1343 c311xxx cx113xx cxx134x cxxx343 c365343 c365xxx cx653xx cxx534x c668886 c668xxx cx688xx cxxx886 cxx888x cba888b cba8xxx cxa88xx cxx88bx cxxx88b cxxx8bb cbddcbb cbddxxx cxxdcbx cxxxcbb cxddcxx",
    "c022100 cx221xx cxx210x cxxx100 c022xxx cxx2454 c422xxx cx224xx cxx245x cxxx454 c476454 c476xxx cx764xx cxx645x c779997 c779xxx cx799xx cxxx997 cxx999x ccb999c ccb9xxx cxb99xx cxx99cx cxxx99c cxxx9cc",
    "c133211 c133xxx cxx321x cxxx211 cx332xx cxx3565 c533xxx cx335xx cxx356x cxxx565 c587565 c587xxx cx875xx cxx756x c88aaa8 c88axxx cx8aaxx cxxxaa8 cxxaaax cdcaaad cdcaxxx cxcaaxx cxxaadx cxxxaad cxxxadd",
    "c244322 c244xxx cxx432x cxxx322 cx443xx cxx4676 c644xxx cx446xx cxx467x cxxx676 c698676 c698xxx cx986xx cxx867x c99bbb9 c99bxxx cx9bbxx cxxxbb9 cxxbbbx cxxbbex cxxxbee",
    "cxx000x c320033 c320xxx cx200xx c355433 c355xxx cxx543x cxxx433 cxx003x cxxx003 cxxx033 cx554xx cxx5787 c755xxx cx557xx cxx578x cxxx787 c7a9787 c7a9xxx cxa97xx cxx978x caaccca caacxxx cxaccxx cxxxcca cxxcccx",
    "c431144 c431xxx cx311xx cxx114x cxx111x cxxx114 cxxx144 c466544 c466xxx cxx654x cxxx544 cx665xx cxx6898 c866xxx cx668xx cxx689x cxxx898 c8ba898 c8baxxx cxba8xx cxxa89x cbbdddb cbbdxxx cxbddxx cxxxddb cxxdddx",
    "c002220 c002xxx cx022xx cxx222x cxxx220 c542225 c542xxx cx422xx cxx225x cxxx225 c577655 c577xxx cxx765x cxxx655 cx776xx cxx79a9 c977xxx cx779xx cxx79ax cxxx9a9 c9cb9a9 c9cbxxx cxcb9xx cxxb9ax",
    "c113331 c113xxx cx133xx cxxx331 cxx333x c653336 c653xxx cx533xx cxx336x cxxx336 cxxx366 c688766 c688xxx cxx876x cxxx766 cx887xx cxx8aba ca88xxx cx88axx cxx8abx cxxxaba cadcaba cadcxxx cxdcaxx cxxcabx",
    "c224442 c224xxx cx244xx cxxx442 cxx444x c764447 c764xxx cx644xx cxx447x cxxx447 cxxx477 c799877 c799xxx cxx987x cxxx877 cx998xx cxx9bcb cb99xxx cx99bxx cxx9bcx cxxxbcb cbedbcb cbedxxx cxedbxx cxxdbcx",
  ],
  "min": [
    "c335543 c335xxx cx355xx cxxx543 cxx554x c865588 c865xxx cx655xx cxx558x cxxx588 c8aa888 c8aaxxx cxaa8xx cxxa88x cxxx888 cxxacdb cbaaxxx cxaacxx cxxacdx cxxxcdb cxfdcdx cxfdcxx cxxdcdx cxxxcdf cffdxxx",
    "cx4212x cx421xx cxx212x cxxx124 c442xxx c446654 c446xxx cx466xx cxxx654 cxx665x c976699 c976xxx cx766xx cxx669x cxxx699 k9bb999 k9bbxxx kxbb9xx kxxb99x kxxx999 cxxbdec ccbbxxx cxbbdxx cxxbdex cxxxdec",
    "cxx0231 c100xxx cxxx231 cx002xx cxx023x cx5323x cx532xx cxx323x cxxx235 c553xxx c557765 c557xxx cx577xx cxxx765 cxx776x ca877aa ca87xxx cx877xx cxx77ax cxxx7aa caccaaa caccxxx cxccaxx cxxcaax cxxxaaa",
    "cxx1342 c211xxx cx113xx cxx134x cxxx342 cx6434x cx643xx cxx434x cxxx346 c664xxx c668876 c668xxx cx688xx cxxx876 cxx887x cb988bb cb98xxx cx988xx cxx88bx cxxx8bb cbddbbb cbddxxx cxddbxx cxxdbbx cxxxbbb",
    "cxxx000 c022000 c022xxx cx220xx cxx200x cxx2453 c322xxx cx224xx cxx245x cxxx453 cx7545x cx754xx cxx545x cxxx457 c775xxx c779987 c779xxx cx799xx cxxx987 cxx998x cca99cc cca9xxx cxa99xx cxx99cx cxxx9cc",
    "c133111 c133xxx cx331xx cxx311x cxxx111 cxx3564 c433xxx cx335xx cxx356x cxxx564 cx8656x cx865xx cxx656x cxxx568 c886xxx c88aa98 c88axxx cx8aaxx cxxxa98 cxxaa9x cdbaadd cdbaxxx cxbaaxx cxxaadx cxxxadd",
    "c244222 c244xxx cx442xx cxx422x cxxx222 cxx4675 c544xxx cx446xx cxx467x cxxx675 cx9767x cx976xx cxx767x cxxx679 c997xxx c99bba9 c99bxxx cx9bbxx cxxxba9 cxxbbax cecbbee cecbxxx cxcbbxx cxxbbex cxxxbee",
    "c310033 c310xxx cx100xx c355333 c355xxx cx553xx cxx533x cxxx333 cxx003x cxxx033 cxx5786 c655xxx cx557xx cxx578x cxxx786 cxa878x cxa87xx cxx878x cxxx78a caa8xxx caaccba caacxxx cxaccxx cxxxcba cxxccbx",
    "c421144 c421xxx cx211xx cxx114x cxx110x cxxx104 cxxx144 c466444 c466xxx cx664xx cxx644x cxxx444 cxx6897 c766xxx cx668xx cxx689x cxxx897 cxb989x cxb98xx cxx989x cxxx89b cbb9xxx cbbddcb cbbdxxx cxbddxx cxxxdcb cxxddcx",
    "c002210 cxx221x cxxx210 c002xxx cx022xx c532255 c532xxx cx322xx cxx225x cxxx255 c577555 c577xxx cx775xx cxx755x cxxx555 cxx79a8 c877xxx cx779xx cxx79ax cxxx9a8 cxca9ax cxca9xx cxxa9ax cxxx9ac cccaxxx",
    "c113321 c113xxx cx133xx cxxx321 cxx332x c643366 c643xxx cx433xx cxx336x cxxx366 c688666 c688xxx cx886xx cxx866x cxxx666 cxx8ab9 c988xxx cx88axx cxx8abx cxxxab9 cxdbabx cxdbaxx cxxbabx cxxxabd cddbxxx",
    "c224432 c224xxx cx244xx cxxx432 cxx443x c754477 c754xxx cx544xx cxx447x cxxx477 c799777 c799xxx cx997xx cxx977x cxxx777 cxx9bca ca99xxx cx99bxx cxx9bcx cxxxbca cxecbcx cxecbxx cxxcbcx cxxxbce ceecxxx",
  ],
  "aug": [
    "kx3211x kx3655x k8x655x k8xa99x kxxaddc",
    "kx4322x kx4766x k9x766x k9xbaax kxxbeed",
    "kx5433x kx5877x kax877x kaxcbbx kxxcffe",
    "kxx1443 kx6544x kx6988x kbx988x kbxdccx",
    "kxx2554 kx7655x kx7a99x kcxa99x kcxeddx",
    "k1x322x kxx3665 kx8766x kx8baax kdxbaax",
    "k2x433x kxx4776 kx9877x kx9cbbx kexcbbx",
    "k3x544x kxx5887 kxa988x kxadccx kfxdccx",
    "k4x211x k4x655x kxx6998 kxba99x kxbeddx",
    "k5x322x k5x766x kxx7aa9 kxcbaax kxcfeex",
    "kx1433x k6x433x k6x877x kxx8bba kxdcbbx",
    "kx2544x k7x544x k7x988x kxx9ccb kxedccx",
  ],
  "dim": [
    "kx3454x kx6457x k89a8xx kxxabdb kxxdbde",
    "kx4565x kx7568x k9ab9xx kxxbcec kxxecef",
    "kxx3134 kx5676x kx8679x kabcaxx kxxcdfd",
    "kxx4245 kx6787x kx978ax kbcdbxx kxxdege",
    "kxx2353 kxx5356 kx7898x kxa89bx kcdecxx",
    "kxx3464 kxx6467 kx89a9x kxb9acx kdefdxx",
    "k2342xx kxx4575 kxx7578 kx9abax kxcabdx",
    "k3453xx kxx5686 kxx8689 kxabcbx kxdbcex",
    "k4564xx kxx6797 kxx979a kxbcdcx kxecdfx",
    "kx3124x k5675xx kxx78a8 kxxa8ab kxcdedx",
    "kx4235x k6786xx kxx89b9 kxxb9bc kxdefex",
    "kx2343x kx5346x k7897xx kxx9aca kxxcacd",
  ],
  "sus4": [
    "kx35563 k8855xx k8a8a88 kxxacbd kxffcdx",
    "kx4412x kx46674 k9966xx k9b9b99 kxxbdce",
    "kx5523x kx57785 kaa77xx kacacaa kxxcedf",
    "kx6634x kx68896 kbb88xx kbdbdbb kxxdfeg",
    "kxx2435 kx7745x kx799a7 kcc99xx kcececc",
    "kxx3546 kx8856x kx8aab8 kddaaxx kdfdfdd",
    "k242422 kxx4657 kx9967x kx9bbc9 keebbxx",
    "k353533 kxx5768 kxaa78x kxaccda kffccxx",
    "k464644 kxx6879 kxbb89x kxbddeb kggddxx",
    "k5522xx k575755 kxx798a kxcc9ax kxceefc",
    "k6633xx k686866 kxx8a9b kxddabx kxdffgd",
    "kx24452 k7744xx k797977 kxx9bac kxeebcx",
  ],
  "sus2": [
    "kx35533 k8555xx kxxa788 kxxacda kxfccdx",
    "kx4112x kx46644 k9666xx kxxb899 kxxbdeb",
    "kx5223x kx57755 ka777xx kxxc9aa kxxcefc",
    "kx6334x kx68866 kb888xx kxxdabb kxxdfgd",
    "kxx2452 kx7445x kx79977 kc999xx kxxebcc",
    "kxx3563 kx8556x kx8aa88 kdaaaxx kxxfcdd",
    "kxx4122 kxx4674 kx9667x kx9bb99 kebbbxx",
    "kxx5233 kxx5785 kxa778x kxaccaa kfcccxx",
    "kxx6344 kxx6896 kxb889x kxbddbb kgdddxx",
    "k5222xx kxx7455 kxx79a7 kxc99ax kxceecc",
    "k6333xx kxx8566 kxx8ab8 kxdaabx kxdffdd",
    "kx24422 k7444xx kxx9677 kxx9bc9 kxebbcx",
  ],
  "maj7": [
    "t3x241x sx324xx c335453 tx3x45x cxx5557 t7x555x tx7x587 c8x998x s8x99xx dxx9988 txax9c8 cxxaccc tcxaccx cxfeccx txexcdc dxxegdf",
    "cx4311x tx3x121 dxx3524 t4x352x sx435xx c446564 tx4x56x cxx6668 t8x666x tx8x698 c9xaa9x s9xaaxx dxxaa99 txbxad9 cxxbddd tdxbddx",
    "cx5422x tx4x232 dxx4635 t5x463x sx546xx c557675 tx5x67x cxx7779 t9x777x tx9x7a9 caxbbax saxbbxx dxxbbaa txcxbea cxxceee texceex",
    "cxx1333 t3x133x cx6533x tx5x343 dxx5746 t6x574x sx657xx c668786 tx6x78x cxx888a tax888x txax8ba cbxccbx sbxccxx dxxccbb txdxcfb dxxdfff",
    "cxx2444 t4x244x cx7644x tx6x454 dxx6857 t7x685x sx768xx c779897 tx7x89x cxx999b tbx999x txbx9cb ccxddcx scxddxx dxxddcc txexdgc dxxeggg",
    "c1x221x tx3x251 cxx3555 t5x355x cx8755x tx7x565 dxx7968 t8x796x sx879xx c88a9a8 tx8x9ax cxxaaac tcxaaax txcxadc sdxeexx dxxeedd",
    "c2x332x s2x33xx dxx3322 tx4x362 cxx4666 t6x466x cx9866x tx8x676 dxx8a79 t9x8a7x sx98axx c99bab9 tx9xabx cxxbbbd tdxbbbx txdxbed",
    "c3x443x s3x44xx dxx4433 tx5x473 cxx5777 t7x577x cxa977x tx9x787 dxx9b8a tax9b8x sxa9bxx caacbca txaxbcx cxxccce texcccx txexcfe",
    "cxx1113 c4x554x s4x55xx dxx5544 tx6x584 cxx6888 t8x688x cxba88x txax898 dxxac9b tbxac9x sxbacxx cbbdcdb txbxcdx dxxdddf tfxdddx txfxdgf",
    "c002120 cxx2224 t4x222x c5x665x s5x66xx dxx6655 cxx7999 t9x799x cxcb99x dxxbdac tcxbdax sxcbdxx",
    "c113231 tx1x23x cxx3335 t5x333x tx5x365 c6x776x s6x77xx dxx7766 tx8x7a6 cxx8aaa tax8aax cxdcaax txcxaba dxxcebd tdxcebx sxdcexx",
    "sx213xx c224342 cxx4446 t6x444x c7x887x s7x88xx dxx8877 cxx9bbb tbx9bbx cxedbbx dxxdfce texdfcx",
  ],
  "7": [
    "cx3231x t3x231x sx323xx cx3535x tx3x353 cxx5556 t6x555x tx7x586 c8x898x s8x89xx dxx8988 txax9b8 cxxacbc tcxacbx txdxcdc dxxefdf",
    "tx2x121 cx4342x dxx3424 t4x342x sx434xx cx4646x tx4x464 cxx6667 t7x666x tx8x697 c9x9a9x s9x9axx dxx9a99 txbxac9 cxxbdcd tdxbdcx",
    "tx3x232 cx5453x dxx4535 t5x453x sx545xx cx5757x tx5x575 cxx7778 t8x777x tx9x7a8 caxabax saxabxx dxxabaa txcxbda cxxcede texcedx",
    "cxx1323 tx4x343 cx6564x dxx5646 t6x564x sx656xx cx6868x tx6x686 cxx8889 t9x888x txax8b9 cbxbcbx sbxbcxx dxxbcbb txdxceb dxxdfef tfxdfex",
    "cxx2434 t4x243x tx5x454 cx7675x dxx6757 t7x675x sx767xx cx7979x tx7x797 cxx999a tax999x txbx9ca ccxcdcx scxcdxx dxxcdcc txexdfc dxxegfg",
    "c1x121x tx3x241 cxx3545 t5x354x tx6x565 cx8786x dxx7868 t8x786x sx878xx cx8a8ax tx8x8a8 cxxaaab tbxaaax txcxadb sdxdexx dxxdedd tdxdedx",
    "c2x232x s2x23xx tx4x352 cxx4656 t6x465x tx7x676 cx9897x dxx8979 t9x897x sx989xx cx9b9bx tx9x9b9 cxxbbbc tcxbbbx txdxbec dxxefee texefex",
    "c3x343x s3x34xx dxx3433 tx5x463 cxx5767 t7x576x tx8x787 cxa9a8x dxx9a8a tax9a8x sxa9axx cxacacx txaxaca cxxcccd tdxcccx txexcfd",
    "c4x454x s4x45xx dxx4544 tx6x574 cxx6878 t8x687x tx9x898 cxbab9x dxxab9b tbxab9x sxbabxx cxbdbdx txbxbdb cxxddde texdddx txfxdge",
    "cx0202x cxx2223 t3x222x tx4x253 c5x565x s5x56xx dxx5655 tx7x685 cxx7989 t9x798x txax9a9 cxcbcax dxxbcac tcxbcax sxcbcxx txcxcec",
    "cx1313x cxx3334 t4x333x tx5x364 c6x676x s6x67xx dxx6766 tx8x796 cxx8a9a tax8a9x txbxaba cxdcdbx dxxcdbd tdxcdbx sxdcdxx txdxdfd",
    "cx2424x cxx4445 t5x444x tx6x475 c7x787x s7x78xx dxx7877 tx9x8a7 cxx9bab tbx9bax txcxbcb cxedecx dxxdece texdecx sxedexx txexege",
  ],
  "m7": [
    "cx3131x sx313xx t3x131x cx3534x tx3x343 cxx5546 t6x554x tx6x586 c8x888x s8x88xx dxx8888 txax8b8 cxxacbb tbxacbx txdxcdb dxxdfdf",
    "cx4242x sx424xx dxx2424 t4x242x cx4645x tx4x454 cxx6657 t7x665x tx7x697 c9x999x s9x99xx dxx9999 txbx9c9 cxxbdcc tcxbdcx txexdec",
    "tx3x231 cx5353x sx535xx t5x353x cx5756x tx5x565 cxx7768 t8x776x tx8x7a8 caxaaax saxaaxx txcxada cxxcedd tdxcedx",
    "cxx1322 tx4x342 cx6464x sx646xx t6x464x cx6867x tx6x676 cxx8879 t9x887x tx9x8b9 cbxbbbx sbxbbxx txdxbeb texdfex",
    "cxx2433 t3x243x tx5x453 cx7575x sx757xx t7x575x cx7978x tx7x787 cxx998a tax998x txax9ca ccxcccx scxccxx txexcfc",
    "c1x111x tx3x141 cxx3544 t4x354x tx6x564 cx8686x sx868xx t8x686x cx8a89x tx8x898 cxxaa9b tbxaa9x txbxadb sdxddxx tdxdddx",
    "c2x222x s2x22xx tx4x252 cxx4655 t5x465x tx7x675 cx9797x sx979xx t9x797x cx9b9ax tx9x9a9 cxxbbac tcxbbax txcxbec texeeex",
    "c3x333x s3x33xx tx5x363 cxx5766 t6x576x tx8x786 cxa8a8x sxa8axx tax8a8x cxacabx txaxaba cxxccbd tdxccbx txdxcfd",
    "c4x444x s4x44xx tx6x474 cxx6877 t7x687x tx9x897 cxb9b9x sxb9bxx tbx9b9x cxbdbcx txbxbcb cxxddce texddcx txexdge",
    "cx0201x cxx2213 t3x221x tx3x253 c5x555x s5x55xx dxx5555 tx7x585 cxx7988 t8x798x txax9a8 cxcacax sxcacxx dxxacac tcxacax txcxcdc",
    "cx1312x cxx3324 t4x332x tx4x364 c6x666x s6x66xx dxx6666 tx8x696 cxx8a99 t9x8a9x txbxab9 cxdbdbx sxdbdxx dxxbdbd tdxbdbx txdxded",
    "cx2423x cxx4435 t5x443x tx5x475 c7x777x dxx7777 tx9x7a7 cxx9baa tax9bax txcxbca cxececx dxxcece texcecx txexefe",
  ],
  "m7b5": [
    "k2x131x kx3434x kxx4546 k8x887x kxxabbb",
    "k3x242x kx4545x kxx5657 k9x998x kxxbccc",
    "k4x353x kx5656x kxx6768 kaxaa9x kxxcddd",
    "kxx1222 k5x464x kx6767x kxx7879 kbxbbax",
    "kxx2333 k6x575x kx7878x kxx898a kcxccbx",
    "kxx3444 k7x686x kx8989x kxx9a9b kdxddcx",
    "k2x221x kxx4555 k8x797x kx9a9ax kxxabac",
    "k3x332x kxx5666 k9x8a8x kxababx kxxbcbd",
    "k4x443x kxx6777 kax9b9x kxbcbcx kxxcdce",
    "kxx1213 k5x554x kxx7888 kbxacax kxcdcdx",
    "kx1212x kxx2324 k6x665x kxx8999 kcxbdbx",
    "kx2323x kxx3435 k7x776x kxx9aaa kdxcecx",
  ],
  "dim7": [
    "k2x121x kx3424x kxx4545 k8x787x kxxabab",
    "k3x232x kx4535x kxx5656 k9x898x kxxbcbc",
    "k4x343x kx5646x kxx6767 kax9a9x kxxcdcd",
    "kxx1212 k5x454x kx6757x kxx7878 kbxabax",
    "kxx2323 k6x565x kx7868x kxx8989 kcxbcbx",
    "kxx3434 k7x676x kx8979x kxx9a9a kdxcdcx",
    "k2x121x kxx4545 k8x787x kx9a8ax kxxabab",
    "k3x232x kxx5656 k9x898x kxab9bx kxxbcbc",
    "k4x343x kxx6767 kax9a9x kxbcacx kxxcdcd",
    "kxx1212 k5x454x kxx7878 kbxabax kxcdbdx",
    "kxx2323 k6x565x kxx8989 kcxbcbx kxdecex",
    "kx2313x kxx3434 k7x676x kxx9a9a kdxcdcx",
  ],
  "7#5": [
    "k4x231x kx3635x kxx6556 k8x899x kxxadbc",
    "k5x342x kx4746x kxx7667 k9x9aax kxxbecd",
    "k6x453x kx5857x kxx8778 kaxabbx kxxcfde",
    "kxx1423 k7x564x kx6968x kxx9889 kbxbccx",
    "kxx2534 k8x675x kx7a79x kxxa99a kcxcddx",
    "k1x122x kxx3645 k9x786x kx8b8ax kxxbaab",
    "k2x233x kxx4756 kax897x kx9c9bx kxxcbbc",
    "k3x344x kxx5867 kbx9a8x kxadacx kxxdccd",
    "kxx2112 k4x455x kxx6978 kcxab9x kxbebdx",
    "k5x566x kxx7a89 kdxbcax kxcfcex",
    "kx1413x kxx4334 k6x677x kxx8b9a kexcdbx",
    "kx2524x kxx5445 k7x788x kxx9cab kfxdecx",
  ],
  "maj9": [
    "kx3243x kxx2433 kxx5757 kxx998a kxxcccc",
    "kx4354x kxx3544 kxx6868 kxxaa9b kxxdddd",
    "kx5465x kxx4655 kxx7979 kxxbbac kxxeeee",
    "kxx3333 kx6576x kxx5766 kxx8a8a kxxccbd",
    "kxx4444 kx7687x kxx6877 kxx9b9b kxxddce",
    "kxx2213 kxx5555 kx8798x kxx7988 kxxacac",
    "kxx3324 kxx6666 kx98a9x kxx8a99 kxxbdbd",
    "kxx4435 kxx7777 kxa9bax kxx9baa kxxcece",
    "kxx1313 kxx5546 kxx8888 kxbacbx kxxacbb",
    "kxx2424 kxx6657 kxx9999 kxcbdcx kxxbdcc",
    "kxx3535 kxx7768 kxxaaaa kxdcedx kxxcedd",
    "kx2132x kxx1322 kxx4646 kxx8879 kxxbbbb",
  ],
  "9": [
    "kx3233x kxx2333 kxx5756 kxx898a kxxccbc",
    "kx4344x kxx3444 kxx6867 kxx9a9b kxxddcd",
    "kx5455x kxx4555 kxx7978 kxxabac kxxeede",
    "kxx3323 kx6566x kxx5666 kxx8a89 kxxbcbd",
    "kxx4434 kx7677x kxx6777 kxx9b9a kxxcdce",
    "kxx1213 kxx5545 kx8788x kxx7888 kxxacab",
    "kxx2324 kxx6656 kx9899x kxx8999 kxxbdbc",
    "kxx3435 kxx7767 kxa9aax kxx9aaa kxxcecd",
    "kxx1312 kxx4546 kxx8878 kxbabbx kxxabbb",
    "kxx2423 kxx5657 kxx9989 kxcbccx kxxbccc",
    "kxx3534 kxx6768 kxxaa9a kxdcddx kxxcddd",
    "kx2122x kxx1222 kxx4645 kxx7879 kxxbbab",
  ],
  "m9": [
    "kx3133x kxx1333 kxx5746 kxx888a kxxccbb",
    "kx4244x kxx2444 kxx6857 kxx999b kxxddcc",
    "kx5355x kxx3555 kxx7968 kxxaaac kxxeedd",
    "kxx3322 kx6466x kxx4666 kxx8a79 kxxbbbd",
    "kxx4433 kx7577x kxx5777 kxx9b8a kxxccce",
    "kxx1113 kxx5544 kx8688x kxx6888 kxxac9b",
    "kxx2224 kxx6655 kx9799x kxx7999 kxxbdac",
    "kxx3335 kxx7766 kxa8aax kxx8aaa kxxcebd",
    "kxx4446 kxx8877 kxb9bbx kxx9bbb kxxdfce",
    "kxx2413 kxx5557 kxx9988 kxcaccx kxxaccc",
    "kxx3524 kxx6668 kxxaa99 kxdbddx kxxbddd",
    "kxx4635 kxx7779 kxxbbaa kxeceex kxxceee",
  ],
  "maj11": [
    "kx3445x kx75577 k8x997x kxxabcc kxfecce",
    "kx43113 kx4556x kx86688 k9xaa8x kxxbcdd",
    "kx54224 kx5667x kx97799 kaxbb9x kxxcdee",
    "kxx1233 kx65335 kx6778x kxa88aa kbxccax",
    "kxx2344 kx76446 kx7889x kxb99bb kcxddbx",
    "kxx3455 kx87557 kx899ax kxcaacc kdxeecx",
    "kxx4566 kx98668 kx9aabx kxdbbdd kexffdx",
    "k3x442x kxx5677 kxa9779 kxabbcx kxeccee",
    "k4x553x kxx6788 kxba88a kxbccdx kxfddff",
    "kx42244 k5x664x kxx7899 kxcb99b kxcddex",
    "kx1223x kx53355 k6x775x kxx89aa kxdcaac",
    "kx2334x kx64466 k7x886x kxx9abb kxedbbd",
  ],
  "11": [
    "kx3335x kx75566 k8x896x kxxaabc kxfefdd",
    "kx43422 kx4446x kx86677 k9x9a7x kxxbbcd",
    "kx54533 kx5557x kx97788 kaxab8x kxxccde",
    "kxx1123 kx65644 kx6668x kxa8899 kbxbc9x",
    "kxx2234 kx76755 kx7779x kxb99aa kcxcdax",
    "kxx3345 kx87866 kx888ax kxcaabb kdxdebx",
    "kxx4456 kx98977 kx999bx kxdbbcc kexefcx",
    "k3x341x kxx5567 kxa9a88 kxaaacx kxeccdd",
    "k4x452x kxx6678 kxbab99 kxbbbdx kxfddee",
    "kx42233 k5x563x kxx7789 kxcbcaa kxcccex",
    "kx1113x kx53344 k6x674x kxx889a kxdcdbb",
    "kx2224x kx64455 k7x785x kxx99ab kxedecc",
  ],
  "m11": [
    "kx3334x kx65566 k8x886x kxxaabb kxfdfdd",
    "kx4445x kx76677 k9x997x kxxbbcc kxgegee kxggghx",
    "kx5556x kx87788 kaxaa8x kxxccdd kxhfhff",
    "kx64644 kx6667x kx98899 kbxbb9x kxxddee",
    "kx75755 kx7778x kxa99aa kcxccax kxxeeff",
    "kx86866 kx8889x kxbaabb kdxddbx kxxffgg",
    "kx97977 kx999ax kxcbbcc kexeecx kxxgghh",
    "kxx5566 kxa8a88 kxaaabx kxdccdd kfxffdx",
    "kxx6677 kxb9b99 kxbbbcx kxeddee kgxggex",
    "kx32233 k5x553x kxx7788 kxcacaa kxcccdx",
    "kx1112x kx43344 k6x664x kxx8899 kxdbdbb",
    "kx2223x kx54455 k7x775x kxx99aa kxececc",
  ],
  "maj13": [
    "kx324x5 kxx5455 k8x99ax kxxaecc kxfeecx",
    "kx4331x kx435x6 kxx6566 k9xaabx kxxbfdd",
    "kx5442x kx546x7 kxx7677 kaxbbcx kxxcgee",
    "kxx1533 kx6553x kx657x8 kxx8788 kbxccdx",
    "kxx2644 kx7664x kx768x9 kxx9899 kcxddex",
    "k1x223x kxx3755 kx8775x kx879xa kxxa9aa",
    "k2x334x kxx4866 kx9886x kx98axb kxxbabb",
    "k3x445x kxx5977 kxa997x kxa9bxc kxxcbcc",
    "k4x556x kxx6a88 kxbaa8x kxbacxd kxxdcdd",
    "kxx2122 k5x667x kxx7b99 kxcbb9x kxcbdxe",
    "kxx3233 k6x778x kxx8caa kxdccax kxdcexf",
    "kxx4344 k7x889x kxx9dbb kxeddbx kxedfxg",
  ],
  "13": [
    "kx1221x kx323x5 kxx5355 k8x89ax kxxaebc",
    "kx2332x kx434x6 kxx6466 k9x9abx kxxbfcd",
    "kx3443x kx545x7 kxx7577 kaxabcx kxxcgde",
    "kxx1523 kx4554x kx656x8 kxx8688 kbxbcdx",
    "kxx2634 kx5665x kx767x9 kxx9799 kcxcdex",
    "k1x123x kxx3745 kx6776x kx878xa kxxa8aa",
    "k2x234x kxx4856 kx7887x kx989xb kxxb9bb",
    "k3x345x kxx5967 kx8998x kxa9axc kxxcacc",
    "k4x456x kxx6a78 kx9aa9x kxbabxd kxxdbdd",
    "k5x567x kxx7b89 kxabbax kxcbcxe kxxecee",
    "kxx3133 k6x678x kxx8c9a kxbccbx kxdcdxf",
    "kxx4244 k7x789x kxx9dab kxcddcx kxedexg",
  ],
  "m13": [
    "kx1121x kx313x5 kxx5345 k8x88ax kbcacax",
    "kx2232x kx424x6 kxx6456 k9x99bx kcdbdbx",
    "kx3343x kx535x7 kxx7567 kaxaacx kdececx",
    "k23131x kx4454x kx646x8 kxx8678 kbxbbdx",
    "k34242x kx5565x kx757x9 kxx9789 kcxccex",
    "k1x113x k45353x kx6676x kx868xa kxxa89a",
    "k2x224x k56464x kx7787x kx979xb kxxb9ab",
    "k3x335x k67575x kx8898x kxa8axc kxxcabc",
    "k4x446x k78686x kx99a9x kxb9bxd kxxdbcd",
    "k5x557x k89797x kxaabax kxcacxe kxxecde",
    "kxx3123 k6x668x k9a8a8x kxbbcbx kxdbdxf",
    "kxx4234 k7x779x kab9b9x kxccdcx kxecexg",
  ],
}

const SHARP = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
const FLAT = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"]
const OPEN_PC = [4, 9, 2, 7, 11, 4]

export function bibleRootName(pc: number): string {
  return [1, 3, 5, 8, 10].includes(pc) ? FLAT[pc] : SHARP[pc]
}

export function bibleQuality(id: string): BibleQuality | undefined {
  return BIBLE_QUALITIES.find(q => q.id === id)
}

export interface BibleVoicing {
  fingers: (number | string)[]
  kind: VoiceKind
  difficulty: "beginner" | "intermediate" | "advanced"
  lowest: number
  bassDegree: string
  bassPc: number
  rootBass: boolean
  rootless: boolean
  position: string
}

export function shapePcs(fingers: (number | string)[]): number[] {
  const out: number[] = []
  fingers.forEach((f, s) => { if (typeof f === "number") out.push((OPEN_PC[s] + f) % 12) })
  return out
}

const cache = new Map<string, BibleVoicing[]>()

export function bibleVoicings(rootPc: number, id: string): BibleVoicing[] {
  const key = `${rootPc}:${id}`
  const hit = cache.get(key)
  if (hit) return hit
  const q = bibleQuality(id)
  const raw = DATA[id]?.[rootPc]
  if (!q || !raw) return []
  const list: BibleVoicing[] = raw.split(" ").filter(Boolean).map(tok => {
    const fingers = tok.slice(1).split("").map(ch => (ch === "x" ? "x" : parseInt(ch, 36)))
    const kind = KIND_BY_TAG[tok[0]] ?? "position"
    const fretted = fingers.filter((f): f is number => typeof f === "number" && f > 0)
    const hasOpen = fingers.some(f => f === 0)
    const lowest = fretted.length ? Math.min(...fretted) : 0
    const span = fretted.length ? Math.max(...fretted) - lowest : 0
    const bassString = fingers.findIndex(f => typeof f === "number")
    const bassPc = (OPEN_PC[bassString] + (fingers[bassString] as number)) % 12
    const step = (bassPc - rootPc + 12) % 12
    const di = q.steps.indexOf(step)
    const bassDegree = di >= 0 ? q.degrees[di] : "1"
    const rootBass = step === 0
    const difficulty: BibleVoicing["difficulty"] =
      kind === "position" && hasOpen && span <= 3 ? "beginner" : span <= 3 ? "intermediate" : "advanced"
    const where = lowest === 0 && hasOpen ? "Open" : `Fret ${lowest}`
    const rootless = !fingers.some((f, i) => typeof f === "number" && (OPEN_PC[i] + f) % 12 === rootPc)
    const parts = [where]
    if (kind !== "cluster") parts.push(KIND_INFO[kind].label)
    if (!rootBass) parts.push(rootless ? "no root" : `${bassDegree} in bass`)
    const position = parts.join(" · ")
    return { fingers, kind, difficulty, lowest, bassDegree, bassPc, rootBass, rootless, position }
  })
  list.sort((a, b) => a.lowest - b.lowest)
  cache.set(key, list)
  return list
}

export function chordSymbol(rootPc: number, id: string): string {
  return bibleRootName(rootPc) + (bibleQuality(id)?.suffix ?? "")
}

export function chordTones(rootPc: number, id: string): { name: string; degree: string }[] {
  const q = bibleQuality(id)
  if (!q) return []
  const flats = [1, 3, 5, 8, 10].includes(rootPc)
  const names = flats ? FLAT : SHARP
  return q.steps.map((s, i) => ({ name: names[(rootPc + s) % 12], degree: q.degrees[i] }))
}

export function allowedPcs(rootPc: number, id: string): number[] {
  const q = bibleQuality(id)
  if (!q) return []
  return [...q.steps, ...q.extra].map(s => (rootPc + s) % 12)
}

const SUFFIX_TO_ID: Record<string, string> = {
  "": "maj", M: "maj", maj: "maj",
  m: "min", min: "min", "-": "min",
  aug: "aug", "+": "aug",
  dim: "dim", "°": "dim",
  sus4: "sus4", sus: "sus4", sus2: "sus2",
  maj7: "maj7", M7: "maj7", ma7: "maj7", "Δ": "maj7", "Δ7": "maj7",
  "7": "7", m7: "m7", min7: "m7", "-7": "m7",
  m7b5: "m7b5", "ø": "m7b5", "ø7": "m7b5",
  dim7: "dim7", "°7": "dim7",
  "7#5": "7#5", aug7: "7#5", "+7": "7#5", "7+5": "7#5",
  maj9: "maj9", M9: "maj9", ma9: "maj9",
  "9": "9", m9: "m9", min9: "m9",
  maj11: "maj11", M11: "maj11",
  "11": "11", m11: "m11", min11: "m11",
  maj13: "maj13", M13: "maj13",
  "13": "13", m13: "m13", min13: "m13",
}

export function bibleIdFromSuffix(suffix: string): string | null {
  return SUFFIX_TO_ID[suffix.replace(/[()]/g, "")] ?? null
}

export const BIBLE_TOTAL = Object.values(DATA).reduce((n, row) => n + row.reduce((m, s) => m + s.split(" ").filter(Boolean).length, 0), 0)
