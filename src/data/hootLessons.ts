import type { StoryEntry } from './stories';

/**
 * Professor Hoot's remedial lessons.
 *
 * Teaching strategies used (aligned with modern math pedagogy):
 * - Concrete-Representational-Abstract (CRA): emoji visuals → diagrams → numbers
 * - Making Ten: decompose to reach a friendly number
 * - Think Addition: reframe subtraction as missing addend
 * - Number bonds: part-part-whole relationships
 * - Arrays & equal groups: visual multiplication/division
 * - Compensation: adjust to make calculation easier
 * - Bar models: part-whole for word problems
 */

const HOOT = '🦉';

export interface HootLesson {
  dialog: StoryEntry;
  tips: string[];
}

const LESSONS: Record<number, HootLesson> = {
  // ─── Tier 1 — Addition (0–10) ───────────────────────────────────
  1: {
    dialog: {
      trigger: 'stage-intro',
      worldIndex: 0,
      speaker: 'Professor Hoot',
      portrait: HOOT,
      lines: [
        '📜 *Professor Hoot adjusts his spectacles*',
        "Let me show you a secret about adding! Look at these apples:",
        '🍎🍎🍎  +  🍎🍎  =  🍎🍎🍎🍎🍎\n\nSee? 3 apples and 2 more makes 5 apples! You can COUNT them!',
        "Here's a trick called COUNT ON. Start with the BIGGER number and count up:\n\n5 + 3 → Start at 5... then count: 6, 7, 8! ✨\n\n(It's faster than counting from 1!)",
        "Let's try MAKING TEN. If one number is close to 10, fill it up!\n\n8 + 5 → 8 needs 2 more to make 10.\nTake 2 from the 5 → 10 + 3 = 13! 🎯",
        "And remember: you can SWAP the order!\n3 + 7 is the same as 7 + 3\n\nAlways start with the bigger number. It's easier! 🦉",
        "Let's practice together. Look at the objects, count if you need to!",
      ],
    },
    tips: [
      'Start with the bigger number, count on',
      'Use Making Ten: fill up to 10 first',
      'You can swap the order: 3+7 = 7+3',
    ],
  },

  // ─── Tier 2 — Addition & Subtraction (0–20) ────────────────────
  2: {
    dialog: {
      trigger: 'stage-intro',
      worldIndex: 1,
      speaker: 'Professor Hoot',
      portrait: HOOT,
      lines: [
        '📜 *A gentle letter floats down*',
        "Subtraction can feel tricky, but I'll show you THREE ways to think about it!",
        "Way 1: TAKE AWAY. Watch the cookies disappear!\n\n🍪🍪🍪🍪🍪🍪🍪🍪  take away 3:\n🍪🍪🍪🍪🍪 ❌❌❌\n\n8 - 3 = 5 cookies left!",
        "Way 2: THINK ADDITION. Turn it around!\n\n12 - 7 = ?\nAsk: 7 + ___ = 12?\nCount up from 7: 8, 9, 10, 11, 12 → that's 5 jumps!\n\n12 - 7 = 5 ✨",
        "Way 3: MAKE TEN going down!\n\n13 - 5 → First go down to 10: 13 - 3 = 10\nYou used 3 of the 5. Still need to subtract 2 more.\n10 - 2 = 8!\n\n13 - 5 = 8 🎯",
        "Subtraction and addition are FACT FAMILIES — they go together!\n\n5 + 7 = 12\n7 + 5 = 12\n12 - 5 = 7\n12 - 7 = 5\n\nKnow one, know them all! 🦉",
        "Let's practice. For each problem, pick whichever way feels easiest!",
      ],
    },
    tips: [
      'Think Addition: 12-7 → "7 + ? = 12"',
      'Make Ten: go down to 10 first, then subtract the rest',
      'Fact families: if 5+7=12, then 12-7=5',
    ],
  },

  // ─── Tier 3 — Two-Digit Add & Subtract (10–100) ────────────────
  3: {
    dialog: {
      trigger: 'stage-intro',
      worldIndex: 2,
      speaker: 'Professor Hoot',
      portrait: HOOT,
      lines: [
        '📜 *Professor Hoot unfurls a scroll*',
        "Big numbers look scary, but let's SPLIT them into parts we already know!",
        "Think of numbers as STICKS (tens) and DOTS (ones):\n\n34 = |||  ····  (3 tens and 4 ones)\n25 = ||   ·····  (2 tens and 5 ones)",
        "Now ADD the parts separately!\n\n34 + 25:\nTens:  3 + 2 = 5 tens  (|||||)\nOnes:  4 + 5 = 9 ones  (·········)\nAnswer: 59! ✨",
        "SUBTRACTION works the same way:\n\n67 - 23:\nTens:  6 - 2 = 4 tens\nOnes:  7 - 3 = 4 ones\nAnswer: 44! 🎯",
        "MISSING NUMBER? Use Think Addition!\n\n___ + 15 = 42\nAsk: 15 + ? = 42\nTens: 1 + ? = 4 → 3 tens\nOnes: 5 + ? = 2? Hmm, need to adjust!\n15 + 27 = 42 ✨",
        "For tricky ones where ones don't work out cleanly, use COMPENSATION:\n\n38 + 27 → Round 38 up to 40, that's +2 extra\n40 + 27 = 67, then subtract the 2 back: 65! 🦉",
        "Let's practice! Split, solve each part, combine. You've got this!",
      ],
    },
    tips: [
      'Split into tens and ones, solve each part',
      'Missing numbers: use Think Addition',
      'Compensation: round to a friendly number, then adjust',
    ],
  },

  // ─── Tier 4 — Multiplication (tables 1–5) ──────────────────────
  4: {
    dialog: {
      trigger: 'stage-intro',
      worldIndex: 3,
      speaker: 'Professor Hoot',
      portrait: HOOT,
      lines: [
        '📜 *Professor Hoot clears his throat*',
        "Multiplication means EQUAL GROUPS. Let me show you!",
        "3 × 4 means '3 groups of 4':\n\n🟡🟡🟡🟡\n🟡🟡🟡🟡\n🟡🟡🟡🟡\n\nCount them all: 12! This picture is called an ARRAY.",
        "You can also see it as REPEATED ADDITION:\n\n3 × 4 = 4 + 4 + 4 = 12\n\nOr skip count by 4s: 4... 8... 12!",
        "DOUBLING trick for × 2:\n\n2 × 7 = 7 + 7 = 14. Just DOUBLE it!\n\n× 4? Double TWICE!\n4 × 6 = double 6 is 12, double 12 is 24! ✨",
        "× 5 trick: count by 5s! They always end in 0 or 5:\n5, 10, 15, 20, 25, 30...\n\nOr: multiply by 10 and cut in half!\n5 × 8 → 10 × 8 = 80, half of 80 = 40! 🎯",
        "× 3 trick: TRIPLE it. Double the number, then add one more:\n3 × 7 → double 7 = 14, plus 7 more = 21! 🦉",
        "Let's practice. Picture the array or skip count!",
      ],
    },
    tips: [
      'Picture equal groups or an array',
      '×2: double it. ×4: double twice',
      '×5: skip count by 5s (always ends in 0 or 5)',
    ],
  },

  // ─── Tier 5 — Division (tables 1–5) ─────────────────────────────
  5: {
    dialog: {
      trigger: 'stage-intro',
      worldIndex: 4,
      speaker: 'Professor Hoot',
      portrait: HOOT,
      lines: [
        '📜 *An ink-stained letter arrives*',
        "Division means FAIR SHARING or making EQUAL GROUPS. Watch!",
        "12 ÷ 3 means: 'share 12 among 3 friends equally'\n\n👤: 🍬🍬🍬🍬\n👤: 🍬🍬🍬🍬\n👤: 🍬🍬🍬🍬\n\nEach friend gets 4! So 12 ÷ 3 = 4",
        "Here's the POWER MOVE: Think Multiplication!\n\n12 ÷ 3 = ?\nAsk yourself: 3 × ___ = 12?\n3 × 4 = 12 ✓\n\nSo 12 ÷ 3 = 4! ✨",
        "Every multiplication fact gives you a FACT FAMILY:\n\n3 × 5 = 15\n5 × 3 = 15\n15 ÷ 3 = 5\n15 ÷ 5 = 3\n\nKnow your times tables → division is FREE! 🎁",
        "You can also use SKIP COUNTING backwards:\n\n20 ÷ 4 → Count back by 4s from 20:\n20, 16, 12, 8, 4, 0\nThat's 5 jumps! So 20 ÷ 4 = 5 🎯",
        "Or deal them out one at a time like cards — but Think Multiplication is fastest! 🦉",
        "Let's practice! For each one, ask: '___ × ? = answer'",
      ],
    },
    tips: [
      'Think Multiplication: ? × 3 = 12 → so 12÷3 = ?',
      'Fact families: know ×, get ÷ free',
      'Skip count backwards to check your answer',
    ],
  },

  // ─── Tier 6 — Multiply & Divide (tables 1–10) ──────────────────
  6: {
    dialog: {
      trigger: 'stage-intro',
      worldIndex: 5,
      speaker: 'Professor Hoot',
      portrait: HOOT,
      lines: [
        '📜 *A letter carved into a stone tablet appears*',
        "The bigger times tables (6-9) are tough, but you already know MORE than you think!",
        "You only need to learn a FEW new facts:\n\n6×7=42  6×8=48  6×9=54\n7×8=56  7×9=63\n8×9=72\n\nThat's only 6 new facts! Everything else you already know! ✨",
        "NINE trick — look at your hands! 🖐️🖐️\n\n9 × 4: Put down finger 4.\nLeft side: 3 fingers. Right side: 6 fingers.\nAnswer: 36! Works for all 9s!",
        "NEAR-TENS trick:\n\n9 × 7 → Think: 10 × 7 = 70, minus one 7 = 63!\n8 × 6 → Think: 10 × 6 = 60, minus two 6s = 48! 🎯",
        "For WORD PROBLEMS, find the KEY action:\n\n'5 baskets with 8 apples EACH' → equal groups → MULTIPLY\n'24 stickers shared among 6 kids' → sharing → DIVIDE\n'How many MORE?' → compare → SUBTRACT",
        "Draw a quick BAR MODEL:\n\n|----5----|----5----|----5----|----5----|\n         Total = 4 × 5 = 20\n\nThis helps you SEE the problem! 🦉",
        "Let's practice mixing × and ÷. Read carefully and pick the right operation!",
      ],
    },
    tips: [
      '9s trick: use the finger method',
      'Near-tens: 9×7 = 10×7 - 7 = 63',
      'Word problems: find the action (each=×, share=÷, more=−)',
    ],
  },

  // ─── Tier 7 — All Operations (0–500) ────────────────────────────
  7: {
    dialog: {
      trigger: 'stage-intro',
      worldIndex: 6,
      speaker: 'Professor Hoot',
      portrait: HOOT,
      lines: [
        '📜 *A glowing letter descends from the clouds*',
        "All four operations together! The key is CHOOSING the right tool.",
        "Think of them as ACTIONS:\n\n➕ Joining, combining, 'in total'\n➖ Taking away, comparing, 'how many left'\n✖️ Equal groups, 'each', arrays\n➗ Sharing equally, 'how many in each group'",
        "For BIGGER addition, stack and add right to left:\n\n  347\n+ 128\n-----\nOnes: 7+8=15 → write 5, carry 1\nTens: 4+2+1=7\nHundreds: 3+1=4\nAnswer: 475! ✨",
        "ESTIMATION helps check your work!\n\n347 + 128 ≈ 350 + 130 = 480\nOur answer 475 is close. ✓\n\nIf your answer was 875, estimation catches it! 🎯",
        "INVERSE OPERATIONS check answers:\n\nIf 475 - 128 = 347 ✓ then our addition was right!\nMultiply to check division. Add to check subtraction.",
        "WORD PROBLEM strategy:\n1️⃣ READ it twice\n2️⃣ CIRCLE the numbers\n3️⃣ UNDERLINE the question\n4️⃣ CHOOSE the operation\n5️⃣ SOLVE and CHECK 🦉",
        "Let's practice! Take each step carefully. No rushing!",
      ],
    },
    tips: [
      'Read word problems twice, circle numbers, underline the question',
      'Estimate first to catch big mistakes',
      'Check: use the inverse operation',
    ],
  },

  // ─── Tier 8 — Super Challenge (0–10000) ─────────────────────────
  8: {
    dialog: {
      trigger: 'stage-intro',
      worldIndex: 7,
      speaker: 'Professor Hoot',
      portrait: HOOT,
      lines: [
        '📜 *Professor Hoot\'s most urgent letter yet*',
        "Champion-level! Big numbers follow the SAME rules — just more columns.",
        "PLACE VALUE is your map:\n\n4,521\n= 4 thousands + 5 hundreds + 2 tens + 1 one\n\nEach column is 10× bigger than the one to its right!",
        "Adding big numbers — go column by column:\n\n  4,521\n+ 1,347\n-------\nOnes: 1+7=8\nTens: 2+4=6\nHundreds: 5+3=8\nThousands: 4+1=5\nAnswer: 5,868! ✨",
        "COMPENSATION works great here too!\n\n2,998 + 1,456\n→ Round 2,998 to 3,000 (added 2)\n3,000 + 1,456 = 4,456\nSubtract the 2 back: 4,454! 🎯",
        "For OPERATOR questions ( ___ in 24 ○ 6 = 4):\nTry each operation mentally:\n24 + 6 = 30 ✗\n24 - 6 = 18 ✗\n24 × 6 = 144 ✗\n24 ÷ 6 = 4 ✓ → It's division!",
        "ESTIMATION is essential at this level:\n\n7,832 - 4,219 ≈ 8,000 - 4,000 = 4,000\nActual: 3,613 — close to 4,000. ✓\n\nIf you got 613 or 33,613, estimation catches it! 🦉",
        "Let's practice. Column by column, step by step. You've got this!",
      ],
    },
    tips: [
      'Column by column: ones, tens, hundreds, thousands',
      'Compensation: round to friendly numbers, adjust back',
      'Estimate first, solve, then check with estimation',
    ],
  },
};

/** Get the Hoot lesson for a given tier. */
export function getHootLesson(tier: number): HootLesson {
  return LESSONS[tier] ?? LESSONS[1];
}
