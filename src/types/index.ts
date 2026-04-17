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
  recentResults: boolean[];  // rolling window of last N results (true = correct)
}

// ── World / Stage ───────────────────────────────────────────────────

export type StageType = 'practice' | 'challenge' | 'mini-boss' | 'world-boss';

export interface StageDefinition {
  stageIndex: number;
  type: StageType;
  questionCount: number;
  tier: number;
  requiredAccuracy: number;  // 0-1, to pass
  difficulty: number;        // 0-1, scales number range & format within tier
}

export interface WorldDefinition {
  worldIndex: number;
  name: string;
  tier: number;
  stages: StageDefinition[];
  bossId: string;
  miniBossId: string;
  background: string;
  battleBackground: string;
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

// ── Avatar ───────────────────────────────────────────────────────────

export type AvatarId = string; // e.g. 'knight-red', 'wizard-blue'

export type AvatarClass = 'knight' | 'wizard' | 'ranger' | 'healer' | 'starter';

export interface AvatarDefinition {
  id: AvatarId;
  name: string;
  class: AvatarClass;
  spritePath: string;     // e.g. '/assets/avatars/knight-red.png'
  premium: boolean;       // true = must be purchased with coins
  cost: number;           // 0 for free avatars
  unlockWorld?: number;   // world index that must be beaten to unlock for purchase (-1 or undefined = always available)
  starter?: boolean;      // true = one of the two starting avatars (free, no coins)
}

// ── Cosmetics ───────────────────────────────────────────────────────

export type CosmeticCategory = 'nameplate' | 'nameplate-color' | 'nameplate-font' | 'background' | 'effect';

export interface CosmeticItem {
  id: string;
  name: string;
  category: CosmeticCategory;
  description: string;
  cost: number;           // in coins
  spritePath?: string;    // for image-based items
  cssClass?: string;      // for CSS-based visual effects
  unlockCondition?: string; // optional: 'defeat-archimedes', 'level-10', etc.
  preview?: string;       // preview text/color for display in shop
}

export interface EquippedCosmetics {
  nameplate: string | null;
  nameplateColor: string | null;
  nameplateFont: string | null;
  background: string | null;
  effect: string | null;
}

// ── Sidekick ────────────────────────────────────────────────────────

export type SidekickId =
  | 'twig' | 'glimmer' | 'petalwhirl' | 'cinder'
  | 'boggle' | 'rune' | 'zephyr' | 'ember';

export interface SidekickDefinition {
  id: SidekickId;
  name: string;
  description: string;
  spritePath: string;     // path to base-position.png (reused from mini-boss art)
  placement: 'ground' | 'flying';  // ground = at feet, flying = near head/shoulder
}

// ── Crystals ────────────────────────────────────────────────────────

export type CrystalId =
  | 'crystal-addition'
  | 'crystal-subtraction'
  | 'crystal-place-value'
  | 'crystal-multiplication'
  | 'crystal-division'
  | 'crystal-operations'
  | 'crystal-mastery'
  | 'crystal-champions';

export interface CrystalDefinition {
  id: CrystalId;
  name: string;
  color: string;           // primary color for glow/fill
  worldIndex: number;      // which world boss drops it
  bossId: string;          // world boss that guards it
  spritePath: string;      // full-size crystal image
  miniSpritePath: string;  // small floating variant
  symbol: string;          // math symbol shown on it
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
  avatarId: AvatarId | null;
  equippedCosmetics: EquippedCosmetics;
  purchasedAvatars: AvatarId[];
  purchasedCosmetics: string[];
  unlockedAvatars: AvatarId[];      // avatars unlocked for purchase (by world progression)
  activeSidekick: SidekickId | null;
  unlockedSidekicks: SidekickId[];
  collectedCrystals: CrystalId[];
  theme: ThemeId;
  currentWorld: number;
  currentStage: number;
  stats: PlayerStats;
  createdAt: number;
}

// ── Adventure Themes ────────────────────────────────────────────────

export type ThemeId = 'fantasy';

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

export interface StageResult {  profileId: string;  worldIndex: number;
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
  | 'pin'
  | 'profile-select'
  | 'world-map'
  | 'zone-map'
  | 'shop'
  | 'inventory'
  | 'stage'
  | 'boss-fight'
  | 'stage-result'
  | 'parent-dashboard';
