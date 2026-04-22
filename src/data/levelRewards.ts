/**
 * Level-up reward definitions.
 * Each level can grant one or more rewards.
 */

export interface LevelReward {
  level: number;
  icon: string;
  label: string;
  type: 'hp' | 'shield' | 'coin-boost' | 'extra-hint' | 'double-coins' | 'streak-saver' | 'unlimited-hints' | 'double-shield' | 'effect' | 'border' | 'title';
}

export const LEVEL_REWARDS: LevelReward[] = [
  // ── Gameplay power-ups ──
  { level: 2,  icon: '🪙',  label: '+50% Coin Boost',          type: 'coin-boost' },
  { level: 3,  icon: '❤️',  label: '+1 Max HP',                type: 'hp' },
  { level: 4,  icon: '💡',  label: 'Extra Hint (2 per stage)', type: 'extra-hint' },
  { level: 5,  icon: '🛡️', label: 'Shield Unlocked',          type: 'shield' },
  { level: 6,  icon: '🪙',  label: 'Double Boss Coins',        type: 'double-coins' },
  { level: 7,  icon: '❤️',  label: '+1 Max HP',                type: 'hp' },
  { level: 8,  icon: '⭐',  label: 'Streak Saver',             type: 'streak-saver' },
  { level: 10, icon: '💡',  label: 'Unlimited Hints',          type: 'unlimited-hints' },
  { level: 12, icon: '🛡️', label: 'Double Shield (2 hits)',   type: 'double-shield' },
  { level: 15, icon: '❤️',  label: '+1 Max HP',                type: 'hp' },

  // ── Special effects (progressively fancier) ──
  { level: 5,  icon: '✨',  label: 'Sparkle Aura',             type: 'effect' },
  { level: 10, icon: '🔥',  label: 'Flame Aura',               type: 'effect' },
  { level: 15, icon: '⚡',  label: 'Lightning Aura',           type: 'effect' },
  { level: 20, icon: '🌈',  label: 'Rainbow Aura',             type: 'effect' },

  // ── Profile card borders ──
  { level: 3,  icon: '🥉',  label: 'Bronze Border',            type: 'border' },
  { level: 7,  icon: '🥈',  label: 'Silver Border',            type: 'border' },
  { level: 12, icon: '🥇',  label: 'Gold Border',              type: 'border' },
  { level: 20, icon: '💎',  label: 'Diamond Border',           type: 'border' },

  // ── Title ──
  { level: 20, icon: '🌟',  label: 'Title: Math Master',       type: 'title' },
];

/** Get all rewards for a specific level. */
export function getRewardsForLevel(level: number): LevelReward[] {
  return LEVEL_REWARDS.filter((r) => r.level === level);
}

/** Check if a player has unlocked a specific reward type. */
export function hasReward(playerLevel: number, type: LevelReward['type']): boolean {
  return LEVEL_REWARDS.some((r) => r.type === type && r.level <= playerLevel);
}

/** Get the highest effect tier unlocked. */
export function getEffectTier(playerLevel: number): 'none' | 'sparkle' | 'flame' | 'lightning' | 'rainbow' {
  if (playerLevel >= 20) return 'rainbow';
  if (playerLevel >= 15) return 'lightning';
  if (playerLevel >= 10) return 'flame';
  if (playerLevel >= 5) return 'sparkle';
  return 'none';
}

/** Get the border tier for profile cards. */
export function getBorderTier(playerLevel: number): 'none' | 'bronze' | 'silver' | 'gold' | 'diamond' {
  if (playerLevel >= 20) return 'diamond';
  if (playerLevel >= 12) return 'gold';
  if (playerLevel >= 7) return 'silver';
  if (playerLevel >= 3) return 'bronze';
  return 'none';
}

/** Get hint count based on level. */
export function getHintCount(playerLevel: number): number {
  if (playerLevel >= 10) return 99; // unlimited
  if (playerLevel >= 4) return 2;
  return 1;
}
