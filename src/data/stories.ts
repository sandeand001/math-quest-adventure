export interface StoryEntry {
  trigger: 'world-intro' | 'stage-intro' | 'boss-intro' | 'boss-victory' | 'world-complete';
  worldIndex: number;
  stageIndex?: number;
  speaker?: string;
  lines: string[];
}

/**
 * Story text for the Fantasy Quest theme.
 * Each entry triggers at a specific point in the game.
 */
export const FANTASY_STORY: StoryEntry[] = [
  // ── World 0: Emerald Forest ──────────────────────────────────────
  {
    trigger: 'world-intro',
    worldIndex: 0,
    speaker: 'Guide Owl',
    lines: [
      'Welcome to the Emerald Forest, young adventurer!',
      'The creatures of this forest have forgotten how to count. They need your help!',
      'Solve addition problems to light the path forward. Are you ready?',
    ],
  },
  {
    trigger: 'boss-intro',
    worldIndex: 0,
    stageIndex: 7,
    speaker: 'Numblet',
    lines: [
      'Hee hee! I\'m Numblet, guardian of the Emerald Forest!',
      'Think you can add faster than me? Let\'s find out!',
    ],
  },
  {
    trigger: 'boss-victory',
    worldIndex: 0,
    speaker: 'Guide Owl',
    lines: [
      'Amazing! You defeated Numblet and restored counting to the forest!',
      'The path to Crystal Caves has opened. Onward, brave one!',
    ],
  },

  // ── World 1: Crystal Caves ───────────────────────────────────────
  {
    trigger: 'world-intro',
    worldIndex: 1,
    speaker: 'Guide Owl',
    lines: [
      'The Crystal Caves shimmer with mysterious light.',
      'Here you must master both addition AND subtraction to navigate the tunnels.',
      'Watch your step — the crystals glow brighter when you answer correctly!',
    ],
  },
  {
    trigger: 'boss-intro',
    worldIndex: 1,
    stageIndex: 7,
    speaker: 'Syllabuzz',
    lines: [
      'Bzzzz! I am Syllabuzz, keeper of the crystal depths!',
      'My crystals grow stronger with every wrong answer. Can you keep up?',
    ],
  },
  {
    trigger: 'boss-victory',
    worldIndex: 1,
    speaker: 'Guide Owl',
    lines: [
      'The crystals shine bright — you\'ve conquered the caves!',
      'Mystic Meadows await beyond the cavern exit.',
    ],
  },

  // ── World 2: Mystic Meadows ──────────────────────────────────────
  {
    trigger: 'world-intro',
    worldIndex: 2,
    speaker: 'Guide Owl',
    lines: [
      'Welcome to the Mystic Meadows! The flowers here grow with the power of math.',
      'The numbers are bigger now — up to 100! But I know you can handle it.',
      'Some questions will have a missing piece. Can you figure out what goes in the blank?',
    ],
  },
  {
    trigger: 'boss-intro',
    worldIndex: 2,
    stageIndex: 7,
    speaker: 'Fablewing',
    lines: [
      'I am Fablewing, the meadow\'s storyteller!',
      'Solve my puzzles and I\'ll let you pass. Fail, and you\'ll be lost in flowers forever!',
    ],
  },
  {
    trigger: 'boss-victory',
    worldIndex: 2,
    speaker: 'Guide Owl',
    lines: [
      'Fablewing bows in respect. The meadows bloom in your honor!',
      'A shop has appeared near the forest! Visit it to spend your hard-earned coins.',
      'The mountains lie ahead — and a new kind of challenge awaits...',
    ],
  },

  // ── World 3: Ironforge Mountains ─────────────────────────────────
  {
    trigger: 'world-intro',
    worldIndex: 3,
    speaker: 'Guide Owl',
    lines: [
      'The dwarves of Ironforge Mountains have a new challenge for you: MULTIPLICATION!',
      'Don\'t worry — we\'ll start with small numbers. Times tables 1 through 5.',
      'Each correct answer forges a new weapon for your journey!',
    ],
  },
  {
    trigger: 'boss-intro',
    worldIndex: 3,
    stageIndex: 7,
    speaker: 'Calculon',
    lines: [
      'I am Calculon, forged in the fires of multiplication!',
      'My armor is made of times tables. Can you break through?',
    ],
  },
  {
    trigger: 'boss-victory',
    worldIndex: 3,
    speaker: 'Guide Owl',
    lines: [
      'Calculon\'s armor shatters! You\'ve mastered the basics of multiplication!',
      'The swamp calls... and with it, a new operation: DIVISION.',
    ],
  },

  // ── World 4: Shadow Swamp ────────────────────────────────────────
  {
    trigger: 'world-intro',
    worldIndex: 4,
    speaker: 'Guide Owl',
    lines: [
      'The Shadow Swamp is dark and mysterious. Here, you\'ll learn DIVISION!',
      'Division is like sharing equally. If you have 10 cookies and 2 friends...',
      'Each friend gets 5! That\'s 10 ÷ 2 = 5. Let\'s practice!',
    ],
  },
  {
    trigger: 'boss-intro',
    worldIndex: 4,
    stageIndex: 7,
    speaker: 'Vowelstrike',
    lines: [
      'Hissss... I am Vowelstrike, lord of the swamp!',
      'Divide my power if you dare!',
    ],
  },
  {
    trigger: 'boss-victory',
    worldIndex: 4,
    speaker: 'Guide Owl',
    lines: [
      'The fog lifts! Vowelstrike retreats deeper into the swamp.',
      'You now know multiplication AND division. Time to combine them!',
    ],
  },

  // ── World 5: Enchanted Ruins ─────────────────────────────────────
  {
    trigger: 'world-intro',
    worldIndex: 5,
    speaker: 'Guide Owl',
    lines: [
      'The Enchanted Ruins hold ancient math secrets.',
      'Here, multiplication and division work together — tables all the way to 10!',
      'Word problems will test your understanding. Read carefully!',
    ],
  },
  {
    trigger: 'boss-intro',
    worldIndex: 5,
    stageIndex: 7,
    speaker: 'Riddle Sphinx',
    lines: [
      'I am the Riddle Sphinx. Answer my riddles or be turned to stone!',
      'Multiplication... division... can you handle BOTH at once?',
    ],
  },
  {
    trigger: 'boss-victory',
    worldIndex: 5,
    speaker: 'Guide Owl',
    lines: [
      'The Sphinx crumbles! The ancient magic flows through you now.',
      'Only two challenges remain. The Sky Citadel awaits!',
    ],
  },

  // ── World 6: Sky Citadel ─────────────────────────────────────────
  {
    trigger: 'world-intro',
    worldIndex: 6,
    speaker: 'Guide Owl',
    lines: [
      'Welcome to the Sky Citadel — the fortress in the clouds!',
      'Here, ALL FOUR operations come together: +, −, ×, and ÷!',
      'The numbers can reach up to 500. Stay sharp, adventurer!',
    ],
  },
  {
    trigger: 'boss-intro',
    worldIndex: 6,
    stageIndex: 7,
    speaker: 'The Lexicon',
    lines: [
      'I am The Lexicon, master of all operations!',
      'Add, subtract, multiply, divide — I command them all!',
    ],
  },
  {
    trigger: 'boss-victory',
    worldIndex: 6,
    speaker: 'Guide Owl',
    lines: [
      'The Lexicon falls! You\'ve proven yourself a true math warrior!',
      'One final challenge remains... Dragon\'s Peak. The ultimate test.',
    ],
  },

  // ── World 7: Dragon's Peak ───────────────────────────────────────
  {
    trigger: 'world-intro',
    worldIndex: 7,
    speaker: 'Guide Owl',
    lines: [
      'This is it — Dragon\'s Peak, the final challenge!',
      'All four operations. Numbers up to 10,000. The hardest problems yet.',
      'You\'ve come so far. I believe in you, adventurer!',
    ],
  },
  {
    trigger: 'boss-intro',
    worldIndex: 7,
    stageIndex: 7,
    speaker: 'Archimedes the Eternal',
    lines: [
      'I AM ARCHIMEDES THE ETERNAL!',
      'I have guarded this peak for a thousand years!',
      'Only the greatest math minds can defeat me. Prove yourself!',
    ],
  },
  {
    trigger: 'boss-victory',
    worldIndex: 7,
    speaker: 'Guide Owl',
    lines: [
      'INCREDIBLE! You defeated Archimedes the Eternal!',
      'You are now a true Math Champion! The kingdom celebrates your victory!',
      'But remember — practice makes perfect. Come back anytime to sharpen your skills!',
    ],
  },
];

/** Look up a story entry. */
export function getStory(
  trigger: StoryEntry['trigger'],
  worldIndex: number,
  stageIndex?: number,
): StoryEntry | undefined {
  return FANTASY_STORY.find(
    (s) =>
      s.trigger === trigger &&
      s.worldIndex === worldIndex &&
      (stageIndex === undefined || s.stageIndex === undefined || s.stageIndex === stageIndex),
  );
}
