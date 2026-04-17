import type { GameSet, CombatSlice } from '../sliceTypes';

export function createCombatSlice(set: GameSet): CombatSlice {
  return {
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
  };
}
