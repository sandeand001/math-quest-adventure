import type { PlayerStats } from '../types';

/** XP required to reach a given level. */
export function xpForLevel(level: number): number {
  // Quadratic growth: 100, 250, 450, 700, 1000, ...
  return Math.floor(50 * level * (level + 1));
}

/** Calculate XP earned for a correct answer. */
export function xpForCorrectAnswer(streak: number, tier: number): number {
  const base = 10 * tier;
  let multiplier = 1;
  if (streak >= 10) multiplier = 3;
  else if (streak >= 5) multiplier = 2;
  return base * multiplier;
}

/** Calculate coins earned for defeating a boss. */
export function coinsForBossDefeat(bossHp: number, tier: number): number {
  return bossHp * 5 * tier;
}

/** Calculate stars (1-3) from accuracy. */
export function starsFromAccuracy(accuracy: number): number {
  if (accuracy >= 0.9) return 3;
  if (accuracy >= 0.75) return 2;
  return 1;
}

/** Returns updated stats after leveling up, if applicable. */
export function applyXp(stats: PlayerStats, xpGained: number): PlayerStats {
  const updated = { ...stats };
  updated.xp += xpGained;

  while (updated.xp >= updated.xpToNextLevel) {
    updated.xp -= updated.xpToNextLevel;
    updated.level += 1;
    updated.xpToNextLevel = xpForLevel(updated.level);

    // Stat boosts on level up
    if (updated.level === 3 || updated.level === 5 || updated.level === 7) {
      updated.maxHp += 1;
      updated.hp = updated.maxHp;
    }
    if (updated.level === 5) {
      updated.shieldUnlocked = true;
    }
  }

  return updated;
}

/** Default stats for a new player. */
export function defaultPlayerStats(): PlayerStats {
  return {
    level: 1,
    xp: 0,
    xpToNextLevel: xpForLevel(1),
    coins: 0,
    hp: 3,
    maxHp: 3,
    attack: 1,
    shieldUnlocked: false,
    totalCorrect: 0,
    totalAttempts: 0,
  };
}
