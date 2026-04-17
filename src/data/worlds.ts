import type { WorldDefinition, StageDefinition } from '../types';

function makeStages(tier: number): StageDefinition[] {
  return [
    { stageIndex: 0, type: 'practice',   questionCount: 10, tier, requiredAccuracy: 0.6,  difficulty: 0.15 },
    { stageIndex: 1, type: 'practice',   questionCount: 10, tier, requiredAccuracy: 0.6,  difficulty: 0.30 },
    { stageIndex: 2, type: 'challenge',  questionCount: 10, tier, requiredAccuracy: 0.65, difficulty: 0.45 },
    { stageIndex: 3, type: 'challenge',  questionCount: 10, tier, requiredAccuracy: 0.7,  difficulty: 0.55 },
    { stageIndex: 4, type: 'mini-boss',  questionCount: 5,  tier, requiredAccuracy: 0.7,  difficulty: 0.60 },
    { stageIndex: 5, type: 'challenge',  questionCount: 10, tier, requiredAccuracy: 0.7,  difficulty: 0.70 },
    { stageIndex: 6, type: 'challenge',  questionCount: 10, tier, requiredAccuracy: 0.7,  difficulty: 0.85 },
    { stageIndex: 7, type: 'world-boss', questionCount: 10, tier, requiredAccuracy: 0.7,  difficulty: 1.0  },
  ];
}

/** Boss IDs assigned per world — matched to story characters */
const WORLD_BOSSES: { bossId: string; miniBossId: string }[] = [
  { bossId: 'numblet',       miniBossId: 'twig'       },  // World 0: Emerald Forest
  { bossId: 'syllabuzz',     miniBossId: 'glimmer'    },  // World 1: Crystal Caves
  { bossId: 'fablewing',     miniBossId: 'petalwhirl' },  // World 2: Mystic Meadows
  { bossId: 'calculon',      miniBossId: 'cinder'     },  // World 3: Ironforge Mountains
  { bossId: 'vowelstrike',   miniBossId: 'boggle'     },  // World 4: Shadow Swamp
  { bossId: 'riddle-sphinx',  miniBossId: 'rune'       },  // World 5: Enchanted Ruins
  { bossId: 'the-lexicon',   miniBossId: 'zephyr'     },  // World 6: Sky Citadel
  { bossId: 'archimedes',    miniBossId: 'ember'      },  // World 7: Dragon's Peak
];

const BACKGROUNDS = [
  '/assets/backgrounds/emerald forest.png',
  '/assets/backgrounds/crystal caves.png',
  '/assets/backgrounds/mystic meadow.png',
  '/assets/backgrounds/ironforge mountains.png',
  '/assets/backgrounds/shadow swamp.png',
  '/assets/backgrounds/enchanted ruins.png',
  '/assets/backgrounds/sky citadel.png',
  '/assets/backgrounds/dragons peak.png',
];

const BATTLE_BACKGROUNDS = [
  '/assets/backgrounds/battle-forest_arena.png',
  '/assets/backgrounds/battle-crystal_chamber.png',
  '/assets/backgrounds/battle-meadow_ring.png',
  '/assets/backgrounds/battle-forge_arena.png',
  '/assets/backgrounds/battle-swamp_pool.png',
  '/assets/backgrounds/battle-ruins_arena.png',
  '/assets/backgrounds/battle-sky_platform.png',
  '/assets/backgrounds/battle-volcanic_caldera.png',
];

export const WORLDS: WorldDefinition[] = Array.from({ length: 8 }, (_, i) => ({
  worldIndex: i,
  name: '',   // filled dynamically from theme
  tier: i + 1,
  stages: makeStages(i + 1),
  bossId: WORLD_BOSSES[i].bossId,
  miniBossId: WORLD_BOSSES[i].miniBossId,
  background: BACKGROUNDS[i],
  battleBackground: BATTLE_BACKGROUNDS[i],
}));

export function getWorldName(worldIndex: number, worldNames: string[]): string {
  return worldNames[worldIndex] ?? `World ${worldIndex + 1}`;
}
