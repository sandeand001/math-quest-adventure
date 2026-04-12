import { useGameStore } from '../store/gameStore';
import { ACHIEVEMENTS } from '../data/achievements';

/**
 * Check and unlock any newly earned achievements.
 * Call this after stage completions, boss victories, leveling up, etc.
 */
export function checkAchievements(): string[] {
  const state = useGameStore.getState();
  const { unlockedAchievements, unlockAchievement, profiles, activeProfileId, stageResults, streak } = state;
  const profile = profiles.find((p) => p.id === activeProfileId);
  if (!profile) return [];

  const newlyUnlocked: string[] = [];

  function tryUnlock(id: string): void {
    if (!unlockedAchievements.includes(id)) {
      unlockAchievement(id);
      newlyUnlocked.push(id);
    }
  }

  // First stage completed
  if (stageResults.length >= 1) tryUnlock('first-stage');

  // Perfect score
  const lastResult = stageResults[stageResults.length - 1];
  if (lastResult && lastResult.accuracy >= 1.0) tryUnlock('perfect-stage');

  // Streak achievements
  if (streak >= 5) tryUnlock('streak-5');
  if (streak >= 10) tryUnlock('streak-10');

  // World completion (boss defeated = world unlocked beyond it)
  const w = profile.currentWorld;
  if (w >= 1) tryUnlock('world-1');
  if (w >= 2) tryUnlock('world-2');
  if (w >= 3) tryUnlock('world-3');
  if (w >= 4) tryUnlock('world-4');
  if (w >= 5) tryUnlock('world-5');
  if (w >= 6) tryUnlock('world-6');
  if (w >= 7) tryUnlock('world-7');
  if (w >= 8) tryUnlock('world-8');

  // First boss
  if (w >= 1) tryUnlock('first-boss');

  // Level achievements
  if (profile.stats.level >= 5) tryUnlock('level-5');

  // Coin achievements
  if (profile.stats.coins >= 100) tryUnlock('coins-100');
  if (profile.stats.coins >= 500) tryUnlock('coins-500');

  // Stage count
  if (stageResults.length >= 50) tryUnlock('stages-50');

  return newlyUnlocked;
}

/** Get the achievement definition for display. */
export function getUnlockedAchievementDefs() {
  const { unlockedAchievements } = useGameStore.getState();
  return ACHIEVEMENTS.filter((a) => unlockedAchievements.includes(a.id));
}
