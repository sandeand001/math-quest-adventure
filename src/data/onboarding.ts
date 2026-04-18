import type { StoryEntry } from './stories';

/**
 * Onboarding dialog sequence for first-time players.
 * Shown once on first visit to the world map.
 */
export const ONBOARDING_STORY: StoryEntry[] = [
  {
    trigger: 'world-intro',
    worldIndex: 0,
    speaker: 'Pip',
    portrait: '🦊',
    lines: [
      'Welcome to MathQuest! I\'m Pip, your guide! 🦊',
      'See this map? Each glowing spot is a WORLD full of math adventures!',
      'Tap a world to enter it. Inside, you\'ll find stages to complete!',
    ],
  },
  {
    trigger: 'world-intro',
    worldIndex: 0,
    speaker: 'Professor Hoot',
    portrait: '🦉',
    lines: [
      '📜 Welcome, young hero!',
      'Each world has 8 stages. Complete practice stages to reach the BOSS!',
      'Beat the boss to earn a magical CRYSTAL and unlock the next world!',
    ],
  },
  {
    trigger: 'world-intro',
    worldIndex: 0,
    speaker: 'Pip',
    portrait: '🦊',
    lines: [
      'Oh! And you earn COINS for every correct answer!',
      'Spend them in the SHOP to get cool outfits and pets!',
      'The Shop opens after you beat the third world. So keep going!',
      'Ready? Tap the first world — Emerald Forest — to begin! 🌲',
    ],
  },
];
