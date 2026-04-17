import type { ChildProfile, CrystalId, SidekickId, ThemeId } from '../../types';
import type { GameSet, GameGet, ProfileSlice } from '../sliceTypes';
import { defaultPlayerStats } from '../../engine/progression';
import { AVATARS } from '../../data/avatars';
import { COSMETICS } from '../../data/cosmetics';

function generateId(): string {
  return `child-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createProfileSlice(set: GameSet, get: GameGet): ProfileSlice {
  return {
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
        profiles: state.profiles.map((p) => (p.id === id ? { ...p, ...updates } : p)),
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
      const profile = get().profiles.find((p) => p.id === profileId);
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

    createTestProfile: () =>
      set((state) => {
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
          currentStage: 7,
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
  };
}
