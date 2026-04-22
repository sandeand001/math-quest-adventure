import { useState, useEffect, useCallback, useRef } from 'react';
import { useGameStore, useActiveProfile } from '../store/gameStore';
import { generateStageQuestions } from '../engine/questions';
import { getBoss, getBossSfx } from '../data/bosses';
import { WORLDS } from '../data/worlds';
import { getCrystalForWorld } from '../data/crystals';
import { getAvatarsUnlockedAtWorld } from '../data/avatars';
import { getStory, getStories } from '../data/stories';
import type { StoryEntry } from '../data/stories';
import type { SidekickId } from '../types';
import { xpForCorrectAnswer, applyXp, coinsForBossDefeat } from '../engine/progression';
import { playSfx as playCachedSfx } from '../services/soundManager';
import { checkAchievements } from '../engine/achievements';

export type BossPose = 'base-position' | 'attack-position' | 'hit-position' | 'defeated-position';
export type SidekickPose = 'base-position' | 'attack-position' | 'hit-position';

export function useBossFight() {
  const {
    currentWorldIndex,
    currentStageIndex,
    bossHp,
    bossMaxHp,
    playerHp,
    playerMaxHp,
    shieldActive,
    setBossFight,
    damageBoss,
    damagePlayer,
    setScreen,
    resetStage,
    updateProfile,
    unlockSidekick,
    collectCrystal,
    unlockAvatars,
    muted,
  } = useGameStore();

  const profile = useActiveProfile();
  const world = WORLDS[currentWorldIndex];
  const stageDef = world?.stages[currentStageIndex];

  const isBossFight = stageDef?.type === 'world-boss';
  const bossId = isBossFight ? world.bossId : world.miniBossId;
  const boss = getBoss(bossId);

  // ── Visual state ──
  const [pose, setPose] = useState<BossPose>('base-position');
  const [sidekickPose, setSidekickPose] = useState<SidekickPose>('base-position');
  const [shaking, setShaking] = useState(false);
  const [flashVisible, setFlashVisible] = useState(false);

  // ── Combat state ──
  const [questions, setQuestions] = useState(
    generateStageQuestions(stageDef?.tier ?? 1, stageDef?.questionCount ?? 5, stageDef?.difficulty ?? 1.0),
  );
  const [questionIndex, setQuestionIndex] = useState(0);
  const [fightOver, setFightOver] = useState(false);
  const [victory, setVictory] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [initialized, setInitialized] = useState(false);
  const fightOverRef = useRef(false);
  const profileRef = useRef(profile);
  useEffect(() => {
    profileRef.current = profile;
  }, [profile]);

  // ── Story state ──
  const bossIntro = isBossFight
    ? getStory('boss-intro', currentWorldIndex, currentStageIndex)
    : getStory('mini-boss-intro', currentWorldIndex, currentStageIndex);
  const bossVictoryStory = isBossFight ? getStory('boss-victory', currentWorldIndex) : undefined;
  const [showBossIntro, setShowBossIntro] = useState(!!bossIntro);
  const [showVictoryStory, setShowVictoryStory] = useState(false);
  const [pendingDialogs, setPendingDialogs] = useState<StoryEntry[]>([]);

  // ── Achievement state ──
  const [bossAchievements, setBossAchievements] = useState<string[]>([]);
  const [toastIndex, setToastIndex] = useState(0);

  const dismissCurrentDialog = () => {
    setPendingDialogs((prev) => prev.slice(1));
  };

  // ── Initialize boss fight ──
  useEffect(() => {
    const hp = isBossFight ? boss.hp : Math.max(3, boss.hp - 3);
    const playerHpVal = profile?.stats.maxHp ?? 3;
    const shield = profile?.stats.shieldUnlocked ?? false;
    setBossFight(hp, playerHpVal, shield);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time init flag
    setInitialized(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── SFX helper ──
  const playSfx = useCallback(
    (action: 'attack' | 'hit' | 'victory') => {
      if (muted) return;
      playCachedSfx(getBossSfx(boss, action));
    },
    [boss, muted],
  );

  // ── Reward processing (called on victory) ──
  const applyBossRewards = useCallback(
    (prof: NonNullable<ReturnType<typeof useActiveProfile>>) => {
      const coins = coinsForBossDefeat(bossMaxHp, stageDef?.tier ?? 1);
      const updatedStats = applyXp(
        { ...prof.stats, coins: prof.stats.coins + coins },
        xpEarned,
      );
      // Refill hearts on boss/mini-boss victory
      updatedStats.hp = updatedStats.maxHp;
      const nextStage = currentStageIndex + 1;
      updateProfile(prof.id, {
        stats: updatedStats,
        currentWorld:
          isBossFight && currentWorldIndex < WORLDS.length - 1
            ? currentWorldIndex + 1
            : prof.currentWorld,
        currentStage: isBossFight ? 0 : Math.max(prof.currentStage, nextStage),
      });

      const queuedDialogs: StoryEntry[] = [];

      if (!isBossFight) {
        const sidekickId = bossId as SidekickId;
        const alreadyOwned = (prof.unlockedSidekicks ?? []).includes(sidekickId);
        unlockSidekick(prof.id, sidekickId);
        if (!alreadyOwned) {
          queuedDialogs.push({
            trigger: 'boss-victory',
            worldIndex: currentWorldIndex,
            speaker: 'Pip',
            portrait: '🦊',
            lines: [
              `OH MY WHISKERS! Did you see that?! We beat ${boss.name}!`,
              `And... wait... is it... following us?! *looks behind nervously*`,
              `It IS! ${boss.name} wants to be your sidekick! Without Zalthor's magic, it's actually really cute!`,
              `You can equip ${boss.name} as your companion in the Inventory! It'll follow you everywhere!`,
              `...I'm still your BEST friend though, right? RIGHT?! 🥺`,
            ],
          });
        }
      }

      if (isBossFight) {
        const crystal = getCrystalForWorld(currentWorldIndex);
        if (crystal) collectCrystal(prof.id, crystal.id);

        // Auto-unlock world background cosmetic (free, no purchase needed)
        const worldBgId = `bg-world-${currentWorldIndex}`;
        if (!(prof.purchasedCosmetics ?? []).includes(worldBgId)) {
          updateProfile(prof.id, {
            purchasedCosmetics: [...(prof.purchasedCosmetics ?? []), worldBgId],
          });
        }

        const newAvatars = getAvatarsUnlockedAtWorld(currentWorldIndex);
        const alreadyUnlocked = new Set(prof.unlockedAvatars ?? []);
        const toUnlock = newAvatars.filter((a) => !alreadyUnlocked.has(a.id));
        if (toUnlock.length > 0) {
          unlockAvatars(prof.id, toUnlock.map((a) => a.id));
          queuedDialogs.push({
            trigger: 'boss-victory',
            worldIndex: currentWorldIndex,
            speaker: 'Professor Hoot',
            portrait: '🦉',
            lines: [
              '📜 *A magical letter floats down from the sky*',
              `Splendid work, Hero! Your bravery has inspired new warriors to join your cause!`,
              `New avatars unlocked: ${toUnlock.map((a) => a.name).join(', ')}!`,
              ...(currentWorldIndex >= 3
                ? [`Visit the Shop on the world map to purchase and equip them!`]
                : [`These heroes will be waiting for you in the Shop — which will open once you've proven yourself in more worlds. Keep adventuring!`]
              ),
              'Yours in wisdom, Prof. Hoot 🦉',
            ],
          });
        }

        const worldCompleteStories = getStories('world-complete', currentWorldIndex);
        queuedDialogs.push(...worldCompleteStories);
      }

      if (queuedDialogs.length > 0) setPendingDialogs(queuedDialogs);

      setTimeout(() => {
        setBossAchievements(checkAchievements());
      }, 0);
    },
    [
      bossMaxHp, xpEarned, stageDef, isBossFight, currentWorldIndex,
      currentStageIndex, bossId, boss.name,
      updateProfile, unlockSidekick, collectCrystal, unlockAvatars,
    ],
  );

  // ── Fight-end check ──
  useEffect(() => {
    if (!initialized || fightOverRef.current) return;
    const profile = profileRef.current;

    if (bossHp <= 0) {
      fightOverRef.current = true;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- state-machine transition driven by game state
      setPose('defeated-position');
      playSfx('victory');
      setVictory(true);
      setFightOver(true);
      if (isBossFight && bossVictoryStory) {
        setShowVictoryStory(true);
      }

      if (profile) {
        applyBossRewards(profile);
      }
    } else if (playerHp <= 0) {
      fightOverRef.current = true;
      setPose('attack-position');
      setFightOver(true);
      setVictory(false);
    }
  }, [
    initialized, bossHp, playerHp,
    isBossFight, bossVictoryStory,
    playSfx, applyBossRewards,
  ]);

  // ── Answer handler ──
  const handleAnswer = useCallback(
    (_userAnswer: number, isCorrect: boolean) => {
      if (fightOver) return;

      if (isCorrect) {
        setSidekickPose('attack-position');
        playSfx('hit');
        setXpEarned((prev) => prev + xpForCorrectAnswer(0, stageDef?.tier ?? 1));
        setTimeout(() => {
          damageBoss(1);
          setPose('hit-position');
          setShaking(true);
          setFlashVisible(true);
        }, 500);
        setTimeout(() => {
          setSidekickPose('base-position');
          setShaking(false);
          setFlashVisible(false);
          if (bossHp - 1 > 0) setPose('base-position');
        }, 900);
      } else {
        damagePlayer();
        setPose('attack-position');
        playSfx('attack');
        setTimeout(() => setSidekickPose('hit-position'), 500);
        setTimeout(() => {
          setSidekickPose('base-position');
          if (playerHp - 1 > 0) setPose('base-position');
        }, 900);
      }

      setTimeout(() => {
        if (questionIndex < questions.length - 1) {
          setQuestionIndex((i) => i + 1);
        } else {
          const newQ = generateStageQuestions(stageDef?.tier ?? 1, 5, stageDef?.difficulty ?? 1.0);
          setQuestions((prev) => [...prev, ...newQ]);
          setQuestionIndex((i) => i + 1);
        }
      }, 1100);
    },
    [fightOver, damageBoss, damagePlayer, playSfx, bossHp, playerHp, questionIndex, questions.length, stageDef],
  );

  // ── Navigation handlers ──
  const handleRetreat = () => {
    resetStage();
    setScreen('zone-map');
  };

  const handlePostFight = () => {
    resetStage();
    if (victory) {
      const isFinalStage = currentStageIndex >= (world?.stages.length ?? 1) - 1;
      setScreen(isFinalStage ? 'world-map' : 'zone-map');
    } else {
      // Defeated — send to remedial training with Prof Hoot
      setScreen('remedial');
    }
  };

  return {
    // Context
    profile,
    world,
    boss,
    isBossFight,
    currentWorldIndex,

    // Combat
    bossHp,
    bossMaxHp,
    playerHp,
    playerMaxHp,
    shieldActive,
    fightOver,
    victory,
    xpEarned,
    currentQuestion: questions[questionIndex],
    crystalReward: isBossFight ? getCrystalForWorld(currentWorldIndex) : null,

    // Visual
    pose,
    sidekickPose,
    shaking,
    flashVisible,

    // Stories
    bossIntro,
    bossVictoryStory,
    showBossIntro,
    setShowBossIntro,
    showVictoryStory,
    setShowVictoryStory,
    pendingDialogs,
    dismissCurrentDialog,

    // Achievements
    bossAchievements,
    toastIndex,
    setToastIndex,

    // Handlers
    handleAnswer,
    handleRetreat,
    handlePostFight,
  };
}
