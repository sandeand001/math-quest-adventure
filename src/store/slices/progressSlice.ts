import type { GameSet, ProgressSlice } from '../sliceTypes';
import { newSkillMastery, updateMastery, skillId } from '../../engine/mastery';

export function createProgressSlice(set: GameSet): ProgressSlice {
  return {
    masteryMap: {},
    recordMastery: (operation, tier, isCorrect) =>
      set((state) => {
        const id = skillId(operation, tier);
        const existing = state.masteryMap[id] ?? newSkillMastery(id);
        const updated = updateMastery(existing, isCorrect);
        return { masteryMap: { ...state.masteryMap, [id]: updated } };
      }),

    unlockedAchievements: [],
    unlockAchievement: (id) =>
      set((state) => {
        if (state.unlockedAchievements.includes(id)) return state;
        return { unlockedAchievements: [...state.unlockedAchievements, id] };
      }),
  };
}
