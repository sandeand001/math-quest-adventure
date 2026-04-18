import type { StoryEntry } from './stories';

/**
 * Professor Hoot's remedial lessons — shown after stage failures.
 * Each lesson is keyed by tier (the math skill being tested).
 * Lessons include a brief teaching dialog followed by practice tips.
 */

const HOOT = '🦉';

export interface HootLesson {
  dialog: StoryEntry;
  tips: string[];
}

const LESSONS: Record<number, HootLesson> = {
  // Tier 1 — Addition (0–10)
  1: {
    dialog: {
      trigger: 'stage-intro',
      worldIndex: 0,
      speaker: 'Professor Hoot',
      portrait: HOOT,
      lines: [
        "📜 *Professor Hoot adjusts his spectacles*",
        "Don't worry, young hero! Addition is just COUNTING UP.",
        "If you have 3 apples and get 2 more, count up from 3: four... five! 3 + 2 = 5!",
        "Try using your fingers if you need to. Start with the bigger number and count up the smaller one.",
        "Remember: the order doesn't matter! 3 + 5 is the same as 5 + 3.",
        "Now let's practice a few together. Take your time — there's no rush! 🦉",
      ],
    },
    tips: [
      'Start with the bigger number',
      'Count up from there',
      'Use your fingers if needed',
    ],
  },

  // Tier 2 — Addition & Subtraction (0–20)
  2: {
    dialog: {
      trigger: 'stage-intro',
      worldIndex: 1,
      speaker: 'Professor Hoot',
      portrait: HOOT,
      lines: [
        "📜 *A gentle letter floats down*",
        "Subtraction is just COUNTING BACKWARDS! The opposite of addition.",
        "If you have 8 cookies and eat 3, count back from 8: seven... six... five! 8 - 3 = 5!",
        "Here's a secret: subtraction and addition are CONNECTED. If 5 + 3 = 8, then 8 - 3 = 5!",
        "When numbers get close to 20, break them into tens and ones. 15 - 7? Think: 15 - 5 = 10, then 10 - 2 = 8!",
        "Let's practice some together. Remember — mistakes are how we learn! 🦉",
      ],
    },
    tips: [
      'Count backwards for subtraction',
      'Addition and subtraction are connected',
      'Break big numbers into tens and ones',
    ],
  },

  // Tier 3 — Two-digit Add & Subtract (10–100)
  3: {
    dialog: {
      trigger: 'stage-intro',
      worldIndex: 2,
      speaker: 'Professor Hoot',
      portrait: HOOT,
      lines: [
        "📜 *Professor Hoot unfurls a scroll*",
        "Big numbers look scary, but they follow the SAME rules!",
        "The secret is PLACE VALUE. Break numbers into tens and ones!",
        "23 + 15? Add the ones: 3 + 5 = 8. Add the tens: 2 + 1 = 3. Answer: 38!",
        "45 - 22? Subtract the ones: 5 - 2 = 3. Subtract the tens: 4 - 2 = 2. Answer: 23!",
        "When you see a blank like ___ + 5 = 12, think: what plus 5 equals 12? Count up from 5!",
        "Practice time! Go column by column — ones first, then tens. 🦉",
      ],
    },
    tips: [
      'Break into tens and ones',
      'Add/subtract each column separately',
      'For missing numbers, think backwards',
    ],
  },

  // Tier 4 — Multiplication (tables 1–5)
  4: {
    dialog: {
      trigger: 'stage-intro',
      worldIndex: 3,
      speaker: 'Professor Hoot',
      portrait: HOOT,
      lines: [
        "📜 *Professor Hoot clears his throat*",
        "Multiplication is just FAST ADDING! That's the big secret!",
        "3 × 4 means '3 groups of 4.' So: 4 + 4 + 4 = 12!",
        "Here are some tricks: × 2 is just DOUBLING. × 5 always ends in 0 or 5!",
        "× 1 is always the same number. × 0 is always zero!",
        "Start with the tables you know and build from there. The 2s and 5s are easiest!",
        "Let's practice your times tables. Say them out loud — it helps! 🦉",
      ],
    },
    tips: [
      'Multiplication is repeated addition',
      '× 2 means double it',
      '× 5 always ends in 0 or 5',
    ],
  },

  // Tier 5 — Division (tables 1–5)
  5: {
    dialog: {
      trigger: 'stage-intro',
      worldIndex: 4,
      speaker: 'Professor Hoot',
      portrait: HOOT,
      lines: [
        "📜 *An ink-stained letter arrives*",
        "Division is SHARING! If you have 12 cookies and 3 friends, each gets 12 ÷ 3 = 4!",
        "Here's the beautiful part: division is multiplication's MIRROR!",
        "If you know 3 × 4 = 12, then you also know 12 ÷ 3 = 4 AND 12 ÷ 4 = 3!",
        "So every multiplication fact gives you TWO division facts for free!",
        "Think: '__ × 3 = 15?' The answer is 5, so 15 ÷ 3 = 5!",
        "Let's practice! Think of the matching times table for each one. 🦉",
      ],
    },
    tips: [
      'Division is the opposite of multiplication',
      'Think: what times ___ equals this?',
      'Every times table gives you a division fact',
    ],
  },

  // Tier 6 — Multiply & Divide (tables 1–10)
  6: {
    dialog: {
      trigger: 'stage-intro',
      worldIndex: 5,
      speaker: 'Professor Hoot',
      portrait: HOOT,
      lines: [
        "📜 *A letter carved into a stone tablet appears*",
        "The 6, 7, 8, and 9 times tables are the hardest — but there are tricks!",
        "6 × 8 = 48. Remember: 'Six and eight went on a DATE, they came back at FORTY-EIGHT!'",
        "7 × 8 = 56. Count: 5, 6, 7, 8 — the answer (56) is IN the question (7 × 8)!",
        "For word problems: READ CAREFULLY. 'How many in total?' = multiply. 'How many each?' = divide.",
        "You know ALL the pieces — now it's about picking the right tool for each job!",
        "Let's practice mixing them together. You've got this! 🦉",
      ],
    },
    tips: [
      'Use memory tricks for hard facts',
      'Read word problems twice',
      '"Total" = multiply, "each/share" = divide',
    ],
  },

  // Tier 7 — All Operations (0–500)
  7: {
    dialog: {
      trigger: 'stage-intro',
      worldIndex: 6,
      speaker: 'Professor Hoot',
      portrait: HOOT,
      lines: [
        "📜 *A glowing letter descends from the clouds*",
        "All four operations at once! The key is knowing WHICH one to use.",
        "Addition: putting things TOGETHER. Subtraction: taking things APART.",
        "Multiplication: making GROUPS. Division: SHARING equally.",
        "When numbers are big (like 347 + 128), go column by column. Ones, tens, hundreds!",
        "Don't rush — accuracy matters more than speed at this level.",
        "Let's slow down and work through some together. Precision is power! 🦉",
      ],
    },
    tips: [
      'Identify the operation first',
      'Work column by column for big numbers',
      'Accuracy over speed',
    ],
  },

  // Tier 8 — Super Challenge (0–10000)
  8: {
    dialog: {
      trigger: 'stage-intro',
      worldIndex: 7,
      speaker: 'Professor Hoot',
      portrait: HOOT,
      lines: [
        "📜 *Professor Hoot's most urgent letter yet*",
        "These are CHAMPION-level problems! The numbers are huge but the rules are the same.",
        "4,521 + 1,234? Column by column: 1+4=5, 2+3=5, 5+2=7, 4+1=5. Answer: 5,755!",
        "For fill-in-the-operator questions: try each operation mentally and see which one fits.",
        "Word problems at this level are tricky — underline the KEY words. 'Left' = subtract. 'Altogether' = add.",
        "Take a deep breath. Think step by step. You have ALL the skills you need.",
        "Let's practice the toughest ones together. I believe in you! 🦉",
      ],
    },
    tips: [
      'Same rules, bigger numbers',
      'Go column by column',
      'Underline key words in word problems',
    ],
  },
};

/** Get the Hoot lesson for a given tier. */
export function getHootLesson(tier: number): HootLesson {
  return LESSONS[tier] ?? LESSONS[1];
}
