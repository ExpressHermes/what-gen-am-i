// Pure logic + data. Loaded as a classic <script> in the browser, require()-able in Node for check.js.

// Year ranges follow Pew Research / McCrindle conventions (boundaries are fuzzy by nature).
const GENS = [
  { key: "greatest", name: "Greatest Generation", from: 1901, to: 1927, emoji: "🎖️",
    blurb: "You lived through the Depression and WWII, and you still save rubber bands. Legend." },
  { key: "silent", name: "Silent Generation", from: 1928, to: 1945, emoji: "📻",
    blurb: "Hard-working, rule-following, and you wrote actual letters. In cursive. Respect." },
  { key: "boomer", name: "Baby Boomer", from: 1946, to: 1964, emoji: "📺",
    blurb: "Rock 'n' roll, the moon landing, and a firm handshake. You sign texts with your name." },
  { key: "x", name: "Gen X", from: 1965, to: 1980, emoji: "📼",
    blurb: "Latchkey kid, mixtape maker, master of the eye-roll. You raised yourself and turned out fine." },
  { key: "millennial", name: "Millennial", from: 1981, to: 1996, emoji: "🥑",
    blurb: "You remember dial-up AND own a smartphone. Avocado toast, side parts, and crippling nostalgia." },
  { key: "z", name: "Gen Z", from: 1997, to: 2012, emoji: "💀",
    blurb: "Digital native, meme dialect fluent, phone calls are your villain origin story. No cap." },
  { key: "alpha", name: "Gen Alpha", from: 2013, to: 2024, emoji: "🧃",
    blurb: "Born with an iPad in hand. You talk to AI like it's a sibling and your slang confuses Gen Z." },
  { key: "beta", name: "Gen Beta", from: 2025, to: 2039, emoji: "🍼",
    blurb: "Welcome to the world, tiny human! (Impressive that you can use this website already.)" },
];

// Well-known micro-generations for people born near a boundary.
const CUSPS = [
  { name: "Generation Jones", from: 1954, to: 1965, note: "Too young for Woodstock, too old for MTV." },
  { name: "Xennial", from: 1977, to: 1983, note: "Analog childhood, digital adulthood. The best of both worlds." },
  { name: "Zillennial", from: 1993, to: 1998, note: "You had a Myspace for a hot minute AND you know what 'slay' means." },
];

function generationFor(year) {
  return GENS.find(g => year >= g.from && year <= g.to) || null;
}

function cuspFor(year) {
  return CUSPS.find(c => year >= c.from && year <= c.to) || null;
}

// Playful replies for years outside the known generations. y = birth year, n = years until then.
const FOSSIL = [
  y => `🦕 Born in ${y}? You're not a generation, you're a fossil! A museum is looking for you.`,
  y => `🦴 ${y}?! Carbon dating confirms it: you're a fossil. Please return to your display case.`,
  y => `🏺 Born in ${y}? You're officially an antique. Generations hadn't even been invented yet!`,
];
const UNBORN = [
  (y, n) => `👶 ${y}? You're not born yet! Come back in ${n} year${n === 1 ? "" : "s"}.`,
  y => `🔮 Greetings, time traveller from ${y}! Technically, you haven't been born yet.`,
  (y, n) => `🛸 Born in ${y}? That's ${n} year${n === 1 ? "" : "s"} from now. Nice time machine!`,
];

// Returns a fun message if the year is before the first generation or in the future, else null.
function outOfRangeMessage(year, thisYear, rand = Math.random) {
  const list = year < GENS[0].from ? FOSSIL : year > thisYear ? UNBORN : null;
  return list && list[Math.floor(rand() * list.length)](year, year - thisYear);
}

// answers: array of gen keys (null for "I don't…" picks, ignored). Returns the most-picked gen (null if nothing counted).
// ponytail: ties go to the gen earliest in GENS (oldest). Fine for a fun quiz.
function tally(answers) {
  const counts = {};
  for (const k of answers) counts[k] = (counts[k] || 0) + 1;
  let best = null;
  for (const g of GENS) if (counts[g.key] && (!best || counts[g.key] > counts[best.key])) best = g;
  return best;
}

// Fun "vibe" questions — each option maps to a generation key; null = "I don't…" (counts for nobody).
const QUESTIONS = [
  { q: "An unknown number is calling you. You…", a: [
    ["Answer with \"Hello, this is the Sharma residence.\"", "boomer"],
    ["Let it go to the answering machine. Obviously.", "x"],
    ["Panic, decline, then Google the number.", "millennial"],
    ["Stare at it in horror until it stops.", "z"],
    ["What's a phone call? I just FaceTime.", "alpha"],
  ]},
  { q: "How do you type a laugh?", a: [
    ["LOL (Lots Of Love, right?)", "boomer"],
    ["haha.", "x"],
    ["😂😂😂", "millennial"],
    ["💀💀 or ASDFGHJKL", "z"],
    ["😭😭 skibidi", "alpha"],
  ]},
  { q: "Pick your music setup:", a: [
    ["A vinyl record and the FM radio", "boomer"],
    ["A mixtape I recorded off the radio", "x"],
    ["An iPod full of burned CDs", "millennial"],
    ["Spotify Wrapped + Reels/TikTok sounds", "z"],
    ["Whatever's playing in Roblox", "alpha"],
    ["I don't really listen to music 🤷", null],
  ]},
  { q: "Something is really cool. You call it…", a: [
    ["Groovy! Far out!", "boomer"],
    ["Rad. Totally tubular.", "x"],
    ["Lit. On fleek.", "millennial"],
    ["It's giving. Slay. No cap.", "z"],
    ["Sigma. Peak rizz.", "alpha"],
    ["I don't do slang. I just say \"cool\".", null],
  ]},
  { q: "Your ideal weekend:", a: [
    ["Gardening, then the evening news", "boomer"],
    ["Leave me alone. I'm fine. Really.", "x"],
    ["Brunch, avocado toast, then a nap", "millennial"],
    ["Bed rotting with 9 hours of screen time", "z"],
    ["Watching someone else play Minecraft", "alpha"],
  ]},
  { q: "How do you take a selfie?", a: [
    ["Front camera by accident, finger on the lens", "boomer"],
    ["I don't. I have a disposable camera somewhere.", "x"],
    ["Mirror selfie, duck face, sepia filter", "millennial"],
    ["0.5x angle, blurry on purpose, photo dump", "z"],
    ["Dog-ears filter, every single time", "alpha"],
  ]},
  { q: "First thing you do in the morning:", a: [
    ["Coffee and the newspaper (the paper one)", "boomer"],
    ["Black coffee. Silence. Don't talk to me.", "x"],
    ["Check emails, then Instagram, then emails again", "millennial"],
    ["Scroll Reels/TikTok in bed for 45 minutes", "z"],
    ["Ask the AI to tell me a joke", "alpha"],
    ["I don't have a morning routine. Pure chaos.", null],
  ]},
  { q: "Your biggest worry:", a: [
    ["Kids these days and their phones", "boomer"],
    ["Retirement? What retirement?", "x"],
    ["Rent. And being called old by Gen Z.", "millennial"],
    ["Being perceived", "z"],
    ["The Wi-Fi going down", "alpha"],
    ["I don't worry. Hakuna matata 😌", null],
  ]},
];

if (typeof module !== "undefined") module.exports = { GENS, CUSPS, QUESTIONS, generationFor, cuspFor, tally, outOfRangeMessage };
