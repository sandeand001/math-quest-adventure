import type {
  AvatarId,
  ChildProfile,
  CrystalId,
  EquippedCosmetics,
  GameScreen,
  Question,
  SidekickId,
  SkillMastery,
  StageResult,
  ThemeId,
} from '../types';

// ── Shared set/get types for slice creators ──

export type GameSet = (
  partial: Partial<GameState> | ((state: GameState) => Partial<GameState>),
) => void;

export type GameGet = () => GameState;

// ── Core (inline in gameStore.ts, too small for a file) ──

export interface CoreSlice {
  screen: GameScreen;
  setScreen: (screen: GameScreen) => void;
  pin: string | null;
  setPin: (pin: string) => void;
  muted: boolean;
  toggleMute: () => void;
}

// ── Profile slice ──

export interface ProfileSlice {
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
}

// ── Session slice ──

export interface SessionSlice {
  currentWorldIndex: number;
  currentStageIndex: number;
  setCurrentWorld: (world: number) => void;
  setCurrentStage: (stage: number) => void;

  questions: Question[];
  currentQuestionIndex: number;
  correctCount: number;
  streak: number;
  stageStartTime: number;
  setQuestions: (questions: Question[]) => void;
  answerQuestion: (isCorrect: boolean) => void;
  nextQuestion: () => void;
  resetStage: () => void;

  stageResults: StageResult[];
  addStageResult: (result: StageResult) => void;
}

// ── Combat slice ──

export interface CombatSlice {
  bossHp: number;
  bossMaxHp: number;
  playerHp: number;
  playerMaxHp: number;
  shieldActive: boolean;
  setBossFight: (bossHp: number, playerHp: number, shieldActive: boolean) => void;
  damageBoss: (amount: number) => void;
  damagePlayer: () => void;
}

// ── Progress slice ──

export interface ProgressSlice {
  masteryMap: Record<string, SkillMastery>;
  recordMastery: (operation: string, tier: number, isCorrect: boolean) => void;
  unlockedAchievements: string[];
  unlockAchievement: (id: string) => void;
}

// ── Combined state ──

export type GameState = CoreSlice & ProfileSlice & SessionSlice & CombatSlice & ProgressSlice;
