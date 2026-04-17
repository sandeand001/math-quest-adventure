import type { CrystalDefinition } from '../types';

export const CRYSTALS: CrystalDefinition[] = [
  {
    id: 'crystal-addition',
    name: 'The Addition Crystal',
    color: '#22c55e',        // green
    worldIndex: 0,
    bossId: 'numblet',
    spritePath: '/assets/crystals/addition.png',
    miniSpritePath: '/assets/crystals/addition.png',
    symbol: '+',
  },
  {
    id: 'crystal-subtraction',
    name: 'The Subtraction Crystal',
    color: '#3b82f6',        // blue
    worldIndex: 1,
    bossId: 'syllabuzz',
    spritePath: '/assets/crystals/subtraction.png',
    miniSpritePath: '/assets/crystals/subtraction.png',
    symbol: '−',
  },
  {
    id: 'crystal-place-value',
    name: 'The Place Value Crystal',
    color: '#eab308',        // golden
    worldIndex: 2,
    bossId: 'fablewing',
    spritePath: '/assets/crystals/place_value.png',
    miniSpritePath: '/assets/crystals/place_value.png',
    symbol: '10',
  },
  {
    id: 'crystal-multiplication',
    name: 'The Multiplication Crystal',
    color: '#f97316',        // orange
    worldIndex: 3,
    bossId: 'calculon',
    spritePath: '/assets/crystals/multiplication.png',
    miniSpritePath: '/assets/crystals/multiplication.png',
    symbol: '×',
  },
  {
    id: 'crystal-division',
    name: 'The Division Crystal',
    color: '#a855f7',        // purple
    worldIndex: 4,
    bossId: 'vowelstrike',
    spritePath: '/assets/crystals/division.png',
    miniSpritePath: '/assets/crystals/division.png',
    symbol: '÷',
  },
  {
    id: 'crystal-operations',
    name: 'The Operations Crystal',
    color: '#ec4899',        // rainbow (pink as primary)
    worldIndex: 5,
    bossId: 'riddle-sphinx',
    spritePath: '/assets/crystals/operations.png',
    miniSpritePath: '/assets/crystals/operations.png',
    symbol: '★',
  },
  {
    id: 'crystal-mastery',
    name: 'The Mastery Crystal',
    color: '#f0f0ff',        // white / diamond
    worldIndex: 6,
    bossId: 'the-lexicon',
    spritePath: '/assets/crystals/mastery.png',
    miniSpritePath: '/assets/crystals/mastery.png',
    symbol: '✦',
  },
  {
    id: 'crystal-champions',
    name: 'The Crystal of Champions',
    color: '#fbbf24',        // prismatic (gold as primary)
    worldIndex: 7,
    bossId: 'archimedes',
    spritePath: '/assets/crystals/champions.png',
    miniSpritePath: '/assets/crystals/champions.png',
    symbol: '♛',
  },
];

export function getCrystal(id: string): CrystalDefinition | undefined {
  return CRYSTALS.find((c) => c.id === id);
}

export function getCrystalForWorld(worldIndex: number): CrystalDefinition | undefined {
  return CRYSTALS.find((c) => c.worldIndex === worldIndex);
}
