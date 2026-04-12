import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  ChildProfile,
  GameScreen,
  Question,
  StageResult,
  SkillMastery,
  ThemeId,
} from '../types';
import { defaultPlayerStats } from '../engine/progression';
import { newSkillMastery, updateMastery, skillId } from '../engine/mastery';

interface GameState {
  // ── Navigation ──
  screen: GameScreen;
  setScreen: (screen: GameScreen) => void;

  // ── Auth ──
  uid: string | null;
  setUid: (uid: string | null) => void;

  // ── Child profiles ──
  profiles: ChildProfile[];
  activeProfileId: string | null;
  setProfiles: (profiles: ChildProfile[]) => void;
  setActiveProfile: (id: string) => void;
  addProfile: (name: string, theme: ThemeId) => ChildProfile;
  updateProfile: (id: string, updates: Partial<ChildProfile>) => void;

  // ── Current session ──
  currentWorldIndex: number;
  currentStageIndex: number;
  setCurrentWorld: (world: number) => void;
  setCurrentStage: (stage: number) => void;

  // ── Stage state ──
  questions: Question[];
  currentQuestionIndex: number;
  correctCount: number;
  streak: number;
  stageStartTime: number;
  setQuestions: (questions: Question[]) => void;
  answerQuestion: (isCorrect: boolean) => void;
  nextQuestion: () => void;
  resetStage: () => void;

  // ── Stage results ──
  stageResults: StageResult[];
  addStageResult: (result: StageResult) => void;

  // ── Boss fight state ──
  bossHp: number;
  bossMaxHp: number;
  playerHp: number;
  playerMaxHp: number;
  shieldActive: boolean;
  setBossFight: (bossHp: number, playerHp: number, shieldActive: boolean) => void;
  damageBoss: (amount: number) => void;
  damagePlayer: () => void;

  // ── Audio ──
  muted: boolean;
  toggleMute: () => void;

  // ── Mastery ──
  masteryMap: Record<string, SkillMastery>; // keyed by skillId
  recordMastery: (operation: string, tier: number, isCorrect: boolean) => void;

  // ── Achievements ──
  unlockedAchievements: string[]; // achievement IDs
  unlockAchievement: (id: string) => void;
}

function generateId(): string {
  return `child-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      // ── Navigation ──
      screen: 'auth',
      setScreen: (screen) => set({ screen }),

      // ── Auth ──
      uid: null,
      setUid: (uid) => set({ uid }),

      // ── Child profiles ──
      profiles: [],
      activeProfileId: null,
      setProfiles: (profiles) => set({ profiles }),
      setActiveProfile: (id) => set({ activeProfileId: id }),
      addProfile: (name, theme) => {
        const profile: ChildProfile = {
          id: generateId(),
          name,
          avatarUrl: '',
          theme,
          currentWorld: 0,
          currentStage: 0,
          stats: defaultPlayerStats(),
          createdAt: Date.now(),
        };
        set((state) => ({ profiles: [...state.profiles, profile] }));
        return profile;
      },
      updateProfile: (id, updates) =>
        set((state) => ({
          profiles: state.profiles.map((p) =>
            p.id === id ? { ...p, ...updates } : p,
          ),
        })),

      // ── Current session ──
      currentWorldIndex: 0,
      currentStageIndex: 0,
      setCurrentWorld: (world) => set({ currentWorldIndex: world }),
      setCurrentStage: (stage) => set({ currentStageIndex: stage }),

      // ── Stage state ──
      questions: [],
      currentQuestionIndex: 0,
      correctCount: 0,
      streak: 0,
      stageStartTime: 0,
      setQuestions: (questions) =>
        set({
          questions,
          currentQuestionIndex: 0,
          correctCount: 0,
          streak: 0,
          stageStartTime: Date.now(),
        }),
      answerQuestion: (isCorrect) =>
        set((state) => ({
          correctCount: state.correctCount + (isCorrect ? 1 : 0),
          streak: isCorrect ? state.streak + 1 : 0,
        })),
      nextQuestion: () =>
        set((state) => ({
          currentQuestionIndex: state.currentQuestionIndex + 1,
        })),
      resetStage: () =>
        set({
          questions: [],
          currentQuestionIndex: 0,
          correctCount: 0,
          streak: 0,
          stageStartTime: 0,
        }),

      // ── Stage results ──
      stageResults: [],
      addStageResult: (result) =>
        set((state) => ({
          stageResults: [...state.stageResults, result],
        })),

      // ── Boss fight state ──
      bossHp: 0,
      bossMaxHp: 0,
      playerHp: 3,
      playerMaxHp: 3,
      shieldActive: false,
      setBossFight: (bossHp, playerHp, shieldActive) =>
        set({ bossHp, bossMaxHp: bossHp, playerHp, playerMaxHp: playerHp, shieldActive }),
      damageBoss: (amount) =>
        set((state) => ({ bossHp: Math.max(0, state.bossHp - amount) })),
      damagePlayer: () =>
        set((state) => {
          if (state.shieldActive) {
            return { shieldActive: false };
          }
          return { playerHp: Math.max(0, state.playerHp - 1) };
        }),

      // ── Audio ──
      muted: false,
      toggleMute: () => set((state) => ({ muted: !state.muted })),

      // ── Mastery ──
      masteryMap: {},
      recordMastery: (operation, tier, isCorrect) =>
        set((state) => {
          const id = skillId(operation, tier);
          const existing = state.masteryMap[id] ?? newSkillMastery(id);
          const updated = updateMastery(existing, isCorrect);
          return { masteryMap: { ...state.masteryMap, [id]: updated } };
        }),

      // ── Achievements ──
      unlockedAchievements: [],
      unlockAchievement: (id) =>
        set((state) => {
          if (state.unlockedAchievements.includes(id)) return state;
          return { unlockedAchievements: [...state.unlockedAchievements, id] };
        }),
    }),
    {
      name: 'mathquest-game',
      partialize: (state) => ({
        uid: state.uid,
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
