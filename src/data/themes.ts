import type { ThemeDefinition } from '../types';

export const THEMES: ThemeDefinition[] = [
  {
    id: 'fantasy',
    name: 'Fantasy Quest',
    description: 'Knights, dragons, and enchanted castles',
    worldNames: [
      'Emerald Forest',
      'Crystal Caves',
      'Mystic Meadows',
      'Ironforge Mountains',
      'Shadow Swamp',
      'Sky Citadel',
      "Dragon's Peak",
    ],
    colorPrimary: '#7c9cff',
    colorSecondary: '#f2d35b',
    available: true,
  },
  {
    id: 'space',
    name: 'Space Voyage',
    description: 'Rockets, aliens, and distant planets',
    worldNames: [
      'Launch Pad',
      'Asteroid Belt',
      'Red Planet',
      'Nebula Station',
      'Comet Chase',
      'Alien Outpost',
      'Galactic Core',
    ],
    colorPrimary: '#5bb2ff',
    colorSecondary: '#b679ff',
    available: false,
  },
  {
    id: 'ocean',
    name: 'Ocean Explorer',
    description: 'Submarines, sea creatures, and hidden depths',
    worldNames: [
      'Coral Reef',
      'Sunken Ship',
      'Kelp Forest',
      'Deep Trench',
      'Lava Vents',
      'Ice Caverns',
      "Kraken's Lair",
    ],
    colorPrimary: '#31d0aa',
    colorSecondary: '#5bb2ff',
    available: false,
  },
  {
    id: 'jungle',
    name: 'Jungle Safari',
    description: 'Ancient temples, wild animals, and lost treasures',
    worldNames: [
      'Vine Bridge',
      'Hidden Waterfall',
      'Monkey Ruins',
      'Serpent River',
      'Canopy Heights',
      'Lava Fields',
      'Temple of Gold',
    ],
    colorPrimary: '#31d070',
    colorSecondary: '#f2d35b',
    available: false,
  },
];

export function getTheme(id: string): ThemeDefinition {
  const theme = THEMES.find((t) => t.id === id);
  if (!theme) return THEMES[0];
  return theme;
}
