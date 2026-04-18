/** Pip's in-stage commentary — shown in a small bubble during gameplay. */

export interface PipComment {
  text: string;
  sprite: string;
}

const PIP = '/assets/characters/pip';

// ── Correct answer reactions ──

const CORRECT_COMMENTS: PipComment[] = [
  { text: 'Nice one!', sprite: `${PIP}/excited.png` },
  { text: 'You got it!', sprite: `${PIP}/happy.png` },
  { text: 'Woohoo!', sprite: `${PIP}/excited.png` },
  { text: 'Easy peasy!', sprite: `${PIP}/happy.png` },
  { text: 'That was FAST!', sprite: `${PIP}/surprised.png` },
  { text: 'Math hero!', sprite: `${PIP}/excited.png` },
  { text: 'Brilliant!', sprite: `${PIP}/happy.png` },
  { text: '*munches snack proudly*', sprite: `${PIP}/eating.png` },
  { text: 'I knew you could do it!', sprite: `${PIP}/happy.png` },
  { text: '*does a little dance*', sprite: `${PIP}/excited.png` },
  { text: 'Show off! 😄', sprite: `${PIP}/surprised.png` },
  { text: 'Another one bites the dust!', sprite: `${PIP}/battle-ready.png` },
];

// ── Wrong answer reactions (encouraging) ──

const WRONG_COMMENTS: PipComment[] = [
  { text: 'Oops! We got the next one!', sprite: `${PIP}/scared.png` },
  { text: "Don't worry, try again!", sprite: `${PIP}/happy.png` },
  { text: 'Almost! So close!', sprite: `${PIP}/thinking.png` },
  { text: "That's a tricky one!", sprite: `${PIP}/thinking.png` },
  { text: 'Mistakes help us learn!', sprite: `${PIP}/happy.png` },
  { text: "It's okay! Keep going!", sprite: `${PIP}/happy.png` },
  { text: '*pats your shoulder*', sprite: `${PIP}/sad.png` },
  { text: 'Even I get confused sometimes!', sprite: `${PIP}/scared.png` },
  { text: 'Next one, we got this!', sprite: `${PIP}/battle-ready.png` },
];

// ── Streak reactions ──

const STREAK_COMMENTS: Record<number, PipComment> = {
  3: { text: '3 in a row! 🔥', sprite: `${PIP}/excited.png` },
  5: { text: 'FIVE STREAK! On fire!!', sprite: `${PIP}/excited.png` },
  7: { text: "CAN'T STOP WON'T STOP!", sprite: `${PIP}/battle-ready.png` },
  10: { text: '🔥🔥🔥 TEN STREAK!!! 🔥🔥🔥', sprite: `${PIP}/excited.png` },
};

// ── Idle / silly comments (shown periodically) ──

const IDLE_COMMENTS: PipComment[] = [
  { text: '*yawns*', sprite: `${PIP}/eating.png` },
  { text: "I wonder if there's snacks after this...", sprite: `${PIP}/thinking.png` },
  { text: '*looks around nervously*', sprite: `${PIP}/scared.png` },
  { text: 'You got this! I believe in you!', sprite: `${PIP}/happy.png` },
  { text: "I'm so proud of you right now.", sprite: `${PIP}/happy.png` },
  { text: '*tail wagging intensifies*', sprite: `${PIP}/excited.png` },
];

let lastCommentIndex = -1;

/** Get a Pip comment based on what just happened. */
export function getPipComment(
  event: 'correct' | 'wrong' | 'idle',
  streak?: number,
): PipComment {
  // Streak milestones take priority
  if (event === 'correct' && streak && STREAK_COMMENTS[streak]) {
    return STREAK_COMMENTS[streak];
  }

  const pool =
    event === 'correct' ? CORRECT_COMMENTS
    : event === 'wrong' ? WRONG_COMMENTS
    : IDLE_COMMENTS;

  // Avoid repeating the same comment back-to-back
  let idx: number;
  do {
    idx = Math.floor(Math.random() * pool.length);
  } while (idx === lastCommentIndex && pool.length > 1);
  lastCommentIndex = idx;

  return pool[idx];
}
