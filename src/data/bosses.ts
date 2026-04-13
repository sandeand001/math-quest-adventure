import type { BossDefinition } from '../types';

export const BOSSES: BossDefinition[] = [
  // ── World Bosses (one per world, matched to story characters) ──
  {
    id: 'numblet',
    name: 'Numblet',
    subject: 'world-boss',
    style: 'cute',
    hp: 5,
    spritePath: '/assets/bosses/numblet',
    sfxPrefix: 'dragon',
  },
  {
    id: 'syllabuzz',
    name: 'Syllabuzz',
    subject: 'world-boss',
    style: 'cute',
    hp: 6,
    spritePath: '/assets/bosses/syllabuzz',
    sfxPrefix: 'dragon',
  },
  {
    id: 'fablewing',
    name: 'Fablewing',
    subject: 'world-boss',
    style: 'cool',
    hp: 7,
    spritePath: '/assets/bosses/fablewing',
    sfxPrefix: 'sphinx',
  },
  {
    id: 'calculon',
    name: 'Calculon',
    subject: 'world-boss',
    style: 'cool',
    hp: 8,
    spritePath: '/assets/bosses/calculon',
    sfxPrefix: 'dragon',
  },
  {
    id: 'vowelstrike',
    name: 'Vowelstrike',
    subject: 'world-boss',
    style: 'cool',
    hp: 8,
    spritePath: '/assets/bosses/vowelstrike',
    sfxPrefix: 'owl',
  },
  {
    id: 'riddle-sphinx',
    name: 'Riddle Sphinx',
    subject: 'world-boss',
    style: 'final',
    hp: 9,
    spritePath: '/assets/bosses/riddle-sphinx',
    sfxPrefix: 'sphinx',
  },
  {
    id: 'the-lexicon',
    name: 'The Lexicon',
    subject: 'world-boss',
    style: 'final',
    hp: 10,
    spritePath: '/assets/bosses/the-lexicon',
    sfxPrefix: 'owl',
  },
  {
    id: 'archimedes',
    name: 'Archimedes the Eternal',
    subject: 'world-boss',
    style: 'final',
    hp: 12,
    spritePath: '/assets/bosses/archimedes',
    sfxPrefix: 'dragon',
  },

  // ── Mini-Bosses (one per world, smaller & cuter) ──
  {
    id: 'twig',
    name: 'Twig',
    subject: 'mini-boss',
    style: 'cute',
    hp: 3,
    spritePath: '/assets/mini-bosses/twig',
    sfxPrefix: 'owl',
  },
  {
    id: 'glimmer',
    name: 'Glimmer',
    subject: 'mini-boss',
    style: 'cute',
    hp: 3,
    spritePath: '/assets/mini-bosses/glimmer',
    sfxPrefix: 'owl',
  },
  {
    id: 'petalwhirl',
    name: 'Petalwhirl',
    subject: 'mini-boss',
    style: 'cute',
    hp: 4,
    spritePath: '/assets/mini-bosses/petalwhirl',
    sfxPrefix: 'sphinx',
  },
  {
    id: 'cinder',
    name: 'Cinder',
    subject: 'mini-boss',
    style: 'cute',
    hp: 4,
    spritePath: '/assets/mini-bosses/cinder',
    sfxPrefix: 'dragon',
  },
  {
    id: 'boggle',
    name: 'Boggle',
    subject: 'mini-boss',
    style: 'cute',
    hp: 4,
    spritePath: '/assets/mini-bosses/boggle',
    sfxPrefix: 'sphinx',
  },
  {
    id: 'rune',
    name: 'Rune',
    subject: 'mini-boss',
    style: 'cool',
    hp: 5,
    spritePath: '/assets/mini-bosses/rune',
    sfxPrefix: 'sphinx',
  },
  {
    id: 'zephyr',
    name: 'Zephyr',
    subject: 'mini-boss',
    style: 'cool',
    hp: 5,
    spritePath: '/assets/mini-bosses/zephyr',
    sfxPrefix: 'owl',
  },
  {
    id: 'ember',
    name: 'Ember',
    subject: 'mini-boss',
    style: 'cool',
    hp: 5,
    spritePath: '/assets/mini-bosses/ember',
    sfxPrefix: 'dragon',
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
