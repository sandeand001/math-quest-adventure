import type { BossDefinition } from '../types';

export const BOSSES: BossDefinition[] = [
  // ── Cute style (Worlds 1–2, mini-bosses) ──
  {
    id: 'math-cute',
    name: 'Numblet',
    subject: 'math-boss',
    style: 'cute',
    hp: 5,
    spritePath: '/assets/bosses/math-boss/cute',
    sfxPrefix: 'dragon',
  },
  {
    id: 'phonics-cute',
    name: 'Syllabuzz',
    subject: 'phonics-boss',
    style: 'cute',
    hp: 5,
    spritePath: '/assets/bosses/phonics-boss/cute',
    sfxPrefix: 'owl',
  },
  {
    id: 'story-cute',
    name: 'Fablewing',
    subject: 'story-comprehension-boss',
    style: 'cute',
    hp: 5,
    spritePath: '/assets/bosses/story-comprehension-boss/cute',
    sfxPrefix: 'sphinx',
  },

  // ── Cool style (Worlds 3–4) ──
  {
    id: 'math-cool',
    name: 'Calculon',
    subject: 'math-boss',
    style: 'cool',
    hp: 8,
    spritePath: '/assets/bosses/math-boss/cool',
    sfxPrefix: 'dragon',
  },
  {
    id: 'phonics-cool',
    name: 'Vowelstrike',
    subject: 'phonics-boss',
    style: 'cool',
    hp: 8,
    spritePath: '/assets/bosses/phonics-boss/cool',
    sfxPrefix: 'owl',
  },
  {
    id: 'story-cool',
    name: 'Riddle Sphinx',
    subject: 'story-comprehension-boss',
    style: 'cool',
    hp: 8,
    spritePath: '/assets/bosses/story-comprehension-boss/cool',
    sfxPrefix: 'sphinx',
  },

  // ── Final style (Worlds 5–7) ──
  {
    id: 'math-final',
    name: 'Archimedes the Eternal',
    subject: 'math-boss',
    style: 'final',
    hp: 12,
    spritePath: '/assets/bosses/math-boss/final',
    sfxPrefix: 'dragon',
  },
  {
    id: 'phonics-final',
    name: 'The Lexicon',
    subject: 'phonics-boss',
    style: 'final',
    hp: 10,
    spritePath: '/assets/bosses/phonics-boss/final',
    sfxPrefix: 'owl',
  },
  {
    id: 'story-final',
    name: 'Mythara',
    subject: 'story-comprehension-boss',
    style: 'final',
    hp: 10,
    spritePath: '/assets/bosses/story-comprehension-boss/final',
    sfxPrefix: 'sphinx',
  },
];

export function getBoss(id: string): BossDefinition {
  const boss = BOSSES.find((b) => b.id === id);
  if (!boss) throw new Error(`Boss not found: ${id}`);
  return boss;
}

export function getBossSprite(boss: BossDefinition, pose: string): string {
  return `${boss.spritePath}/${pose}.png`;
}

export function getBossSfx(boss: BossDefinition, action: 'attack' | 'hit' | 'victory'): string {
  return `/assets/sfx/${boss.sfxPrefix}_${action}.wav`;
}
