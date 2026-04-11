// ── Operations & Questions ──────────────────────────────────────────

export type Operation = 'addition' | 'subtraction' | 'multiplication' | 'division';

export type QuestionFormat =
  | 'multiple-choice'
  | 'fill-result'      // a ○ b = ___
  | 'fill-operand'     // a ○ ___ = c  or  ___ ○ b = c
  | 'fill-operator'    // a ___ b = c
  | 'word-problem';

export type BlankPosition = 'result' | 'left' | 'right' | 'operator';

export interface Question {
  id: string;
  operation: Operation;
  format: QuestionFormat;
  blankPosition: BlankPosition;
  operandA: number;
  operandB: number;
  answer: number;
  displayEquation: string;       // e.g. "7 + ___ = 12"
  choices?: number[];            // for multiple-choice
  wordProblem?: string;          // for word-problem format
  tier: number;
}

// ── Skill Tiers ─────────────────────────────────────────────────────

export interface TierDefinition {
  tier: number;
  name: string;
  gradeEquivalent: string;
  operations: Operation[];
  numberRange: { min: number; max: number };
  /** For multiplication/division: which tables are included */
  tables?: { min: number; max: number };
  formats: QuestionFormat[];
  description: string;
}

// ── Mastery ─────────────────────────────────────────────────────────

export type MasteryLevel = 'learning' | 'practicing' | 'mastered';

export interface SkillMastery {
  skillId: string;
  correct: number;
  attempts: number;
  streak: number;
  bestStreak: number;
  level: MasteryLevel;
  lastSeen: number;     // timestamp
  nextReview: number;   // timestamp
}

// ── World / Stage ───────────────────────────────────────────────────

export type StageType = 'practice' | 'challenge' | 'mini-boss' | 'world-boss';

export interface StageDefinition {
  stageIndex: number;
  type: StageType;
  questionCount: number;
  tier: number;
  requiredAccuracy: number;  // 0-1, to pass
}

export interface WorldDefinition {
  worldIndex: number;
  name: string;
  tier: number;
  stages: StageDefinition[];
  bossId: string;
  miniBossId: string;
  background: string;
}

// ── Boss ────────────────────────────────────────────────────────────

export type BossStyle = 'cute' | 'cool' | 'final';
export type BossPose = 'base-position' | 'attack-position' | 'hit-position' | 'defeated-position';

export interface BossDefinition {
  id: string;
  name: string;
  subject: string;       // math-boss, phonics-boss, story-comprehension-boss
  style: BossStyle;
  hp: number;
  spritePath: string;    // folder path under /assets/bosses/
  sfxPrefix: string;     // e.g. "dragon" → dragon_attack.wav
}

// ── Player ──────────────────────────────────────────────────────────

export interface PlayerStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  coins: number;
  hp: number;
  maxHp: number;
  attack: number;
  shieldUnlocked: boolean;
  totalCorrect: number;
  totalAttempts: number;
}

export interface ChildProfile {
  id: string;
  name: string;
  avatarUrl: string;
  theme: ThemeId;
  currentWorld: number;
  currentStage: number;
  stats: PlayerStats;
  createdAt: number;
}

// ── Adventure Themes ────────────────────────────────────────────────

export type ThemeId = 'fantasy' | 'space' | 'ocean' | 'jungle';

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  description: string;
  worldNames: string[];
  colorPrimary: string;
  colorSecondary: string;
  available: boolean;      // false = coming soon
}

// ── Stage Result ────────────────────────────────────────────────────

export interface StageResult {
  worldIndex: number;
  stageIndex: number;
  correct: number;
  total: number;
  accuracy: number;
  stars: number;           // 1-3
  timeSpent: number;       // ms
  completedAt: number;
}

// ── Game Session State ──────────────────────────────────────────────

export type GameScreen =
  | 'auth'
  | 'profile-select'
  | 'world-map'
  | 'stage'
  | 'boss-fight'
  | 'stage-result'
  | 'parent-dashboard';
