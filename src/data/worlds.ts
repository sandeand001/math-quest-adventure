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

/** Boss IDs assigned per world – cute → cool → final progression */
const WORLD_BOSSES: { bossId: string; miniBossId: string }[] = [
  { bossId: 'math-cute',     miniBossId: 'phonics-cute'  },  // World 1
  { bossId: 'phonics-cute',  miniBossId: 'story-cute'    },  // World 2
  { bossId: 'story-cute',    miniBossId: 'math-cute'     },  // World 3
  { bossId: 'math-cool',     miniBossId: 'phonics-cute'  },  // World 4
  { bossId: 'phonics-cool',  miniBossId: 'story-cute'    },  // World 5
  { bossId: 'story-cool',    miniBossId: 'math-cool'     },  // World 6
  { bossId: 'phonics-final', miniBossId: 'story-cool'    },  // World 7
  { bossId: 'math-final',    miniBossId: 'phonics-final' },  // World 8
];

const BACKGROUNDS = [
  '/assets/backgrounds/forest.jpg',
  '/assets/backgrounds/field.jpg',
  '/assets/backgrounds/clouds.jpg',
  '/assets/backgrounds/forest.jpg',
  '/assets/backgrounds/night-forest.jpg',
  '/assets/backgrounds/field.jpg',
  '/assets/backgrounds/night-sky.jpg',
  '/assets/backgrounds/night-sky.jpg',
];

export const WORLDS: WorldDefinition[] = Array.from({ length: 8 }, (_, i) => ({
  worldIndex: i,
  name: '',   // filled dynamically from theme
  tier: i + 1,
  stages: makeStages(i + 1),
  bossId: WORLD_BOSSES[i].bossId,
  miniBossId: WORLD_BOSSES[i].miniBossId,
  background: BACKGROUNDS[i],
}));

export function getWorldName(worldIndex: number, worldNames: string[]): string {
  return worldNames[worldIndex] ?? `World ${worldIndex + 1}`;
}
