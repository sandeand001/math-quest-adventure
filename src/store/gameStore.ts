import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  AvatarId,
  ChildProfile,
  CrystalId,
  EquippedCosmetics,
  GameScreen,
  Question,
  SidekickId,
  StageResult,
  SkillMastery,
  ThemeId,
} from '../types';
import { defaultPlayerStats } from '../engine/progression';
import { newSkillMastery, updateMastery, skillId } from '../engine/mastery';
import { AVATARS } from '../data/avatars';
import { COSMETICS } from '../data/cosmetics';

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
  addProfile: (name: string, theme: ThemeId, avatarId?: AvatarId) => ChildProfile;
  updateProfile: (id: string, updates: Partial<ChildProfile>) => void;
  unlockSidekick: (profileId: string, sidekickId: SidekickId) => void;
  setActiveSidekick: (profileId: string, sidekickId: SidekickId | null) => void;
  collectCrystal: (profileId: string, crystalId: CrystalId) => void;
  unlockAvatars: (profileId: string, avatarIds: AvatarId[]) => void;
  purchaseItem: (profileId: string, itemType: 'avatar' | 'cosmetic', itemId: string, cost: number) => boolean;
  equipCosmetic: (profileId: string, category: keyof EquippedCosmetics, itemId: string | null) => void;
  deleteProfile: (profileId: string) => void;
  createTestProfile: () => void;

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
      addProfile: (name, theme, avatarId) => {
        const profile: ChildProfile = {
          id: generateId(),
          name,
          avatarId: avatarId ?? null,
          equippedCosmetics: { nameplate: null, nameplateColor: null, nameplateFont: null, background: null, effect: null },
          purchasedAvatars: [],
          purchasedCosmetics: [],
          unlockedAvatars: [],
          activeSidekick: null,
          unlockedSidekicks: [],
          collectedCrystals: [],
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
      unlockSidekick: (profileId, sidekickId) =>
        set((state) => ({
          profiles: state.profiles.map((p) => {
            if (p.id !== profileId) return p;
            const sidekicks = p.unlockedSidekicks ?? [];
            if (sidekicks.includes(sidekickId)) return p;
            return { ...p, unlockedSidekicks: [...sidekicks, sidekickId] };
          }),
        })),
      setActiveSidekick: (profileId, sidekickId) =>
        set((state) => ({
          profiles: state.profiles.map((p) =>
            p.id === profileId ? { ...p, activeSidekick: sidekickId } : p,
          ),
        })),
      collectCrystal: (profileId, crystalId) =>
        set((state) => ({
          profiles: state.profiles.map((p) => {
            if (p.id !== profileId) return p;
            if (p.collectedCrystals?.includes(crystalId)) return p;
            return { ...p, collectedCrystals: [...(p.collectedCrystals ?? []), crystalId] };
          }),
        })),
      unlockAvatars: (profileId, avatarIds) =>
        set((state) => ({
          profiles: state.profiles.map((p) => {
            if (p.id !== profileId) return p;
            const existing = new Set(p.unlockedAvatars ?? []);
            const newIds = avatarIds.filter((id) => !existing.has(id));
            if (newIds.length === 0) return p;
            return { ...p, unlockedAvatars: [...(p.unlockedAvatars ?? []), ...newIds] };
          }),
        })),
      purchaseItem: (profileId, itemType, itemId, cost) => {
        const state = useGameStore.getState();
        const profile = state.profiles.find((p) => p.id === profileId);
        if (!profile || profile.stats.coins < cost) return false;

        set((s) => ({
          profiles: s.profiles.map((p) => {
            if (p.id !== profileId) return p;
            const updatedStats = { ...p.stats, coins: p.stats.coins - cost };
            if (itemType === 'avatar') {
              const purchased = p.purchasedAvatars ?? [];
              if (purchased.includes(itemId)) return p;
              return { ...p, stats: updatedStats, purchasedAvatars: [...purchased, itemId] };
            } else {
              const purchased = p.purchasedCosmetics ?? [];
              if (purchased.includes(itemId)) return p;
              return { ...p, stats: updatedStats, purchasedCosmetics: [...purchased, itemId] };
            }
          }),
        }));
        return true;
      },
      equipCosmetic: (profileId, category, itemId) =>
        set((state) => ({
          profiles: state.profiles.map((p) =>
            p.id === profileId
              ? { ...p, equippedCosmetics: { ...p.equippedCosmetics, [category]: itemId } }
              : p,
          ),
        })),
      deleteProfile: (profileId) =>
        set((state) => ({
          profiles: state.profiles.filter((p) => p.id !== profileId),
          activeProfileId: state.activeProfileId === profileId ? null : state.activeProfileId,
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
      // Capped at MAX_STAGE_RESULTS to keep persisted storage bounded.
      stageResults: [],
      addStageResult: (result) =>
        set((state) => {
          const next = [...state.stageResults, result];
          const MAX_STAGE_RESULTS = 200;
          return {
            stageResults:
              next.length > MAX_STAGE_RESULTS
                ? next.slice(next.length - MAX_STAGE_RESULTS)
                : next,
          };
        }),

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

      // ── Test profile ──
      createTestProfile: () =>
        set((state) => {
          // Remove any existing test user and create fresh
          const filteredProfiles = state.profiles.filter((p) => p.name !== '🧪 Test User');

          const allSidekicks: SidekickId[] = ['twig', 'glimmer', 'petalwhirl', 'cinder', 'boggle', 'rune', 'zephyr', 'ember'];
          const allCrystals: CrystalId[] = [
            'crystal-addition', 'crystal-subtraction', 'crystal-place-value', 'crystal-multiplication',
            'crystal-division', 'crystal-operations', 'crystal-mastery', 'crystal-champions',
          ];
          const premiumAvatarIds = AVATARS.filter((a) => a.premium).map((a) => a.id);
          const allAvatarIds = AVATARS.map((a) => a.id);
          const allCosmeticIds = COSMETICS.map((c) => c.id);

          const testProfile: ChildProfile = {
            id: `test-${Date.now()}`,
            name: '🧪 Test User',
            avatarId: 'starting-male',
            equippedCosmetics: { nameplate: null, nameplateColor: null, nameplateFont: null, background: null, effect: null },
            purchasedAvatars: premiumAvatarIds,
            purchasedCosmetics: allCosmeticIds,
            unlockedAvatars: allAvatarIds,
            activeSidekick: null,
            unlockedSidekicks: allSidekicks,
            collectedCrystals: allCrystals,
            theme: 'fantasy' as ThemeId,
            currentWorld: 7,
            currentStage: 7,   // all stages beaten in current world
            stats: {
              level: 25,
              xp: 0,
              xpToNextLevel: 50000,
              coins: 99999,
              hp: 8,
              maxHp: 8,
              attack: 5,
              shieldUnlocked: true,
              totalCorrect: 1000,
              totalAttempts: 1100,
            },
            createdAt: Date.now(),
          };
          return { profiles: [...filteredProfiles, testProfile] };
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
