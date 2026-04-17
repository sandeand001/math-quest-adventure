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
      'Enchanted Ruins',
      'Sky Citadel',
      "Dragon's Peak",
    ],
    colorPrimary: '#7c9cff',
    colorSecondary: '#f2d35b',
    available: true,
  },
];

export function getTheme(id: string): ThemeDefinition {
  const theme = THEMES.find((t) => t.id === id);
  if (!theme) return THEMES[0];
  return theme;
}
