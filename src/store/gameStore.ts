import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChildProfile, GameScreen } from '../types';
import type { GameState } from './sliceTypes';
import { createProfileSlice } from './slices/profileSlice';
import { createSessionSlice } from './slices/sessionSlice';
import { createCombatSlice } from './slices/combatSlice';
import { createProgressSlice } from './slices/progressSlice';

export type { GameState } from './sliceTypes';

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // ── Core (navigation / audio) ──
      screen: 'profile-select' as GameScreen,
      setScreen: (screen) => set({ screen }),
      muted: false,
      toggleMute: () => set((state) => ({ muted: !state.muted })),

      // ── Slices ──
      ...createProfileSlice(set, get),
      ...createSessionSlice(set),
      ...createCombatSlice(set),
      ...createProgressSlice(set),
    }),
    {
      name: 'mathquest-game',
      partialize: (state) => ({
        profiles: state.profiles,
        activeProfileId: state.activeProfileId,
        stageResults: state.stageResults,
        masteryMap: state.masteryMap,
        unlockedAchievements: state.unlockedAchievements,
        muted: state.muted,
      }),
    },
  ),
);

/** Get the currently active child profile. */
export function useActiveProfile(): ChildProfile | null {
  const { profiles, activeProfileId } = useGameStore();
  if (!activeProfileId) return null;
  return profiles.find((p) => p.id === activeProfileId) ?? null;
}
