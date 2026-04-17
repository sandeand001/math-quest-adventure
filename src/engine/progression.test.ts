import { describe, it, expect } from 'vitest';
import {
  xpForLevel,
  xpForCorrectAnswer,
  coinsForBossDefeat,
  starsFromAccuracy,
  applyXp,
  defaultPlayerStats,
} from './progression';

describe('xpForLevel', () => {
  it('returns 100 for level 1', () => {
    expect(xpForLevel(1)).toBe(100);
  });

  it('grows monotonically', () => {
    const levels = [1, 2, 3, 4, 5, 10, 20];
    const values = levels.map(xpForLevel);
    for (let i = 1; i < values.length; i++) {
      expect(values[i]).toBeGreaterThan(values[i - 1]);
    }
  });
});

describe('xpForCorrectAnswer', () => {
  it('scales base XP by tier', () => {
    expect(xpForCorrectAnswer(0, 1)).toBe(10);
    expect(xpForCorrectAnswer(0, 3)).toBe(30);
  });

  it('doubles at streak 5', () => {
    expect(xpForCorrectAnswer(5, 1)).toBe(20);
  });

  it('triples at streak 10', () => {
    expect(xpForCorrectAnswer(10, 1)).toBe(30);
  });

  it('does not exceed triple multiplier', () => {
    expect(xpForCorrectAnswer(100, 1)).toBe(30);
  });
});

describe('coinsForBossDefeat', () => {
  it('scales with both bossHp and tier', () => {
    expect(coinsForBossDefeat(10, 1)).toBe(50);
    expect(coinsForBossDefeat(10, 2)).toBe(100);
  });
});

describe('starsFromAccuracy', () => {
  it('awards 3 stars at 90%+', () => {
    expect(starsFromAccuracy(0.9)).toBe(3);
    expect(starsFromAccuracy(1)).toBe(3);
  });

  it('awards 2 stars at 75-89%', () => {
    expect(starsFromAccuracy(0.75)).toBe(2);
    expect(starsFromAccuracy(0.89)).toBe(2);
  });

  it('awards 1 star below 75%', () => {
    expect(starsFromAccuracy(0.74)).toBe(1);
    expect(starsFromAccuracy(0)).toBe(1);
  });
});

describe('applyXp', () => {
  it('adds XP without leveling up when below threshold', () => {
    const stats = defaultPlayerStats();
    const updated = applyXp(stats, 50);
    expect(updated.level).toBe(1);
    expect(updated.xp).toBe(50);
  });

  it('levels up when XP meets the threshold', () => {
    const stats = defaultPlayerStats();
    const updated = applyXp(stats, 100);
    expect(updated.level).toBe(2);
    expect(updated.xp).toBe(0);
  });

  it('handles multiple level-ups from a large XP grant', () => {
    const stats = defaultPlayerStats();
    const updated = applyXp(stats, 10_000);
    expect(updated.level).toBeGreaterThan(3);
  });

  it('grants +1 maxHp at level 3, 5, and 7', () => {
    let stats = defaultPlayerStats();
    const startHp = stats.maxHp;
    stats = applyXp(stats, 10_000);
    expect(stats.maxHp).toBeGreaterThan(startHp);
  });

  it('unlocks shield at level 5', () => {
    const stats = applyXp(defaultPlayerStats(), 10_000);
    expect(stats.shieldUnlocked).toBe(true);
  });

  it('never mutates the input stats object', () => {
    const stats = defaultPlayerStats();
    const snapshot = { ...stats };
    applyXp(stats, 500);
    expect(stats).toEqual(snapshot);
  });
});

describe('defaultPlayerStats', () => {
  it('returns a fresh copy each time (no shared reference)', () => {
    const a = defaultPlayerStats();
    const b = defaultPlayerStats();
    a.xp = 999;
    expect(b.xp).toBe(0);
  });

  it('starts at level 1 with 3 HP, 1 attack, no shield', () => {
    const s = defaultPlayerStats();
    expect(s.level).toBe(1);
    expect(s.hp).toBe(3);
    expect(s.maxHp).toBe(3);
    expect(s.attack).toBe(1);
    expect(s.shieldUnlocked).toBe(false);
  });
});
