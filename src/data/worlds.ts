import type { WorldDefinition, StageDefinition } from '../types';

function makeStages(tier: number): StageDefinition[] {
  return [
    { stageIndex: 0, type: 'practice',   questionCount: 10, tier, requiredAccuracy: 0.6 },
    { stageIndex: 1, type: 'practice',   questionCount: 10, tier, requiredAccuracy: 0.6 },
    { stageIndex: 2, type: 'challenge',  questionCount: 10, tier, requiredAccuracy: 0.65 },
    { stageIndex: 3, type: 'challenge',  questionCount: 10, tier, requiredAccuracy: 0.7 },
    { stageIndex: 4, type: 'mini-boss',  questionCount: 5,  tier, requiredAccuracy: 0.7 },
    { stageIndex: 5, type: 'challenge',  questionCount: 10, tier, requiredAccuracy: 0.7 },
    { stageIndex: 6, type: 'challenge',  questionCount: 10, tier, requiredAccuracy: 0.7 },
    { stageIndex: 7, type: 'world-boss', questionCount: 10, tier, requiredAccuracy: 0.7 },
  ];
}

/** Boss IDs assigned per world – cute → cool → final progression */
const WORLD_BOSSES: { bossId: string; miniBossId: string }[] = [
  { bossId: 'math-cute',    miniBossId: 'phonics-cute'  },
  { bossId: 'story-cute',   miniBossId: 'math-cute'     },
  { bossId: 'math-cool',    miniBossId: 'phonics-cute'  },
  { bossId: 'phonics-cool', miniBossId: 'story-cute'    },
  { bossId: 'story-cool',   miniBossId: 'math-cool'     },
  { bossId: 'phonics-final', miniBossId: 'story-cool'   },
  { bossId: 'math-final',   miniBossId: 'phonics-final' },
];

const BACKGROUNDS = [
  '/assets/backgrounds/forest.jpg',
  '/assets/backgrounds/field.jpg',
  '/assets/backgrounds/clouds.jpg',
  '/assets/backgrounds/night-forest.jpg',
  '/assets/backgrounds/night-sky.jpg',
  '/assets/backgrounds/forest.jpg',
  '/assets/backgrounds/night-sky.jpg',
];

export const WORLDS: WorldDefinition[] = Array.from({ length: 7 }, (_, i) => ({
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
