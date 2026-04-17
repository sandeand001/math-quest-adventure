import { useState, useEffect, useCallback, useRef } from 'react';
import { useGameStore, useActiveProfile } from '../../store/gameStore';
import { generateStageQuestions } from '../../engine/questions';
import { getBoss, getBossSprite, getBossSfx } from '../../data/bosses';
import { WORLDS } from '../../data/worlds';
import { getCrystalForWorld } from '../../data/crystals';
import { getAvatarsUnlockedAtWorld } from '../../data/avatars';
import { SIDEKICKS } from '../../data/sidekicks';
import { getStory } from '../../data/stories';
import { xpForCorrectAnswer, applyXp, coinsForBossDefeat } from '../../engine/progression';
import { QuestionCard } from './QuestionCard';
import { HeartsBar } from '../ui/HeartsBar';
import { CrystalTracker } from '../ui/CrystalTracker';
import { AvatarDisplay } from '../ui/AvatarDisplay';
import { StoryDialog } from '../ui/StoryDialog';
import { Howl } from 'howler';

type BossPose = 'base-position' | 'attack-position' | 'hit-position' | 'defeated-position';

export function BossFight() {
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
    setCurrentStage,
  } = useGameStore();

  const profile = useActiveProfile();
  const world = WORLDS[currentWorldIndex];
  const stageDef = world?.stages[currentStageIndex];

  // Determine which boss to use
  const isBossFight = stageDef?.type === 'world-boss';
  const bossId = isBossFight ? world.bossId : world.miniBossId;
  const boss = getBoss(bossId);

  const [pose, setPose] = useState<BossPose>('base-position');
  const [sidekickPose, setSidekickPose] = useState<'base-position' | 'attack-position' | 'hit-position'>('base-position');
  const [shaking, setShaking] = useState(false);
  const [flashVisible, setFlashVisible] = useState(false);
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

  // Story dialogs
  const bossIntro = isBossFight
    ? getStory('boss-intro', currentWorldIndex, currentStageIndex)
    : getStory('mini-boss-intro', currentWorldIndex, currentStageIndex);
  const bossVictoryStory = isBossFight ? getStory('boss-victory', currentWorldIndex) : undefined;
  const [showBossIntro, setShowBossIntro] = useState(!!bossIntro);
  const [showVictoryStory, setShowVictoryStory] = useState(false);
  // Queued post-victory dialogs (shown one at a time, in order)
  const [pendingDialogs, setPendingDialogs] = useState<import('../../data/stories').StoryEntry[]>([]);

  const dismissCurrentDialog = () => {
    setPendingDialogs((prev) => prev.slice(1));
  };

  // Initialize boss fight
  useEffect(() => {
    const hp = isBossFight ? boss.hp : Math.max(3, boss.hp - 3);
    const playerHpVal = profile?.stats.maxHp ?? 3;
    const shield = profile?.stats.shieldUnlocked ?? false;

    setBossFight(hp, playerHpVal, shield);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time init flag; refactor when extracting useBossFight() (Phase 3).
    setInitialized(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Play SFX
  const playSfx = useCallback(
    (action: 'attack' | 'hit' | 'victory') => {
      if (muted) return;
      const src = getBossSfx(boss, action);
      new Howl({ src: [src], volume: 0.5 }).play();
    },
    [boss, muted],
  );

  // Check for fight end (only after initialization)
  useEffect(() => {
    if (!initialized || fightOverRef.current) return;
    const profile = profileRef.current;

    if (bossHp <= 0) {
      // Victory!
      fightOverRef.current = true;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- state-machine transition driven by game state; move into a reducer / useBossFight() in Phase 3.
      setPose('defeated-position');
      playSfx('victory');
      setVictory(true);
      setFightOver(true);
      if (isBossFight && bossVictoryStory) {
        setShowVictoryStory(true);
      }

      // Reward player
      if (profile) {
        const coins = coinsForBossDefeat(bossMaxHp, stageDef?.tier ?? 1);
        const updatedStats = applyXp(
          { ...profile.stats, coins: profile.stats.coins + coins },
          xpEarned,
        );
        // Both mini-boss and world-boss victories advance stage progress
        const nextStage = currentStageIndex + 1;
        updateProfile(profile.id, {
          stats: updatedStats,
          currentWorld:
            isBossFight && currentWorldIndex < WORLDS.length - 1
              ? currentWorldIndex + 1
              : profile.currentWorld,
          currentStage: isBossFight
            ? 0 // Reset stage for new world
            : Math.max(profile.currentStage, nextStage), // Mini-boss: advance stage
        });

        const queuedDialogs: import('../../data/stories').StoryEntry[] = [];

        // Unlock mini-boss as sidekick
        if (!isBossFight) {
          const sidekickId = bossId as import('../../types').SidekickId;
          const alreadyOwned = (profile.unlockedSidekicks ?? []).includes(sidekickId);
          unlockSidekick(profile.id, sidekickId);
          if (!alreadyOwned) {
            // Queue sidekick dialog (will show after victory story if any)
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

        // Collect crystal on world-boss victory
        if (isBossFight) {
          const crystal = getCrystalForWorld(currentWorldIndex);
          if (crystal) {
            collectCrystal(profile.id, crystal.id);
          }

          // Unlock avatars tied to this world
          const newAvatars = getAvatarsUnlockedAtWorld(currentWorldIndex);
          const alreadyUnlocked = new Set(profile.unlockedAvatars ?? []);
          const toUnlock = newAvatars.filter((a) => !alreadyUnlocked.has(a.id));
          if (toUnlock.length > 0) {
            unlockAvatars(profile.id, toUnlock.map((a) => a.id));
            // Queue avatar unlock letter
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
        }

        // Set all queued dialogs
        if (queuedDialogs.length > 0) {
          setPendingDialogs(queuedDialogs);
        }
      }
    } else if (playerHp <= 0) {
      // Defeat
      fightOverRef.current = true;
      setPose('attack-position');
      setFightOver(true);
      setVictory(false);
    }
  }, [
    initialized,
    bossHp,
    playerHp,
    bossMaxHp,
    xpEarned,
    isBossFight,
    currentWorldIndex,
    currentStageIndex,
    stageDef,
    bossId,
    boss.name,
    bossVictoryStory,
    updateProfile,
    unlockSidekick,
    collectCrystal,
    unlockAvatars,
    playSfx,
  ]);

  const handleAnswer = useCallback(
    (_userAnswer: number, isCorrect: boolean) => {
      if (fightOver) return;

      if (isCorrect) {
        // Step 1: Sidekick attacks immediately (action)
        setSidekickPose('attack-position');
        playSfx('hit');
        setXpEarned((prev) => prev + xpForCorrectAnswer(0, stageDef?.tier ?? 1));

        // Step 2: Boss reacts (reaction)
        setTimeout(() => {
          damageBoss(1);
          setPose('hit-position');
          setShaking(true);
          setFlashVisible(true);
        }, 500);

        // Step 3: Reset both
        setTimeout(() => {
          setSidekickPose('base-position');
          setShaking(false);
          setFlashVisible(false);
          if (bossHp - 1 > 0) {
            setPose('base-position');
          }
        }, 900);
      } else {
        // Step 1: Boss attacks immediately (action)
        damagePlayer();
        setPose('attack-position');
        playSfx('attack');

        // Step 2: Sidekick reacts (reaction)
        setTimeout(() => {
          setSidekickPose('hit-position');
        }, 500);

        // Step 3: Reset both
        setTimeout(() => {
          setSidekickPose('base-position');
          if (playerHp - 1 > 0) {
            setPose('base-position');
          }
        }, 900);
      }

      // Next question
      setTimeout(() => {
        if (questionIndex < questions.length - 1) {
          setQuestionIndex((i) => i + 1);
        } else {
          // Generate more questions if boss is still alive
          const newQ = generateStageQuestions(stageDef?.tier ?? 1, 5, stageDef?.difficulty ?? 1.0);
          setQuestions((prev) => [...prev, ...newQ]);
          setQuestionIndex((i) => i + 1);
        }
      }, 1100);
    },
    [
      fightOver,
      damageBoss,
      damagePlayer,
      playSfx,
      bossHp,
      playerHp,
      questionIndex,
      questions.length,
      stageDef,
    ],
  );

  const handleRetreat = () => {
    resetStage();
    setScreen('zone-map');
  };

  const handlePostFight = () => {
    resetStage();
    if (victory) {
      // Return to zone map to see the completed state, or world map if world is done
      const isFinalStage = currentStageIndex >= (world?.stages.length ?? 1) - 1;
      setScreen(isFinalStage ? 'world-map' : 'zone-map');
    } else {
      // Go back to zone map to retry
      setCurrentStage(Math.max(0, currentStageIndex - 2));
      setScreen('zone-map');
    }
  };

  const currentQuestion = questions[questionIndex];
  const crystalReward = isBossFight ? getCrystalForWorld(currentWorldIndex) : null;

  return (
    <div
      className="h-screen relative overflow-hidden"
      style={{ background: '#0f1222' }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url("${encodeURI(world?.battleBackground ?? world?.background ?? '')}")` }}
      />

      {/* Boss area — takes full screen, never resizes */}
      <div className="absolute inset-0 z-10 flex flex-col items-center overflow-hidden">
        {/* Retreat button */}
        {!fightOver && (
          <button
            onClick={handleRetreat}
            className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-lg text-xs font-medium
              bg-red-900/60 border border-red-700/40 text-red-300
              hover:bg-red-800/60 hover:text-white transition-all"
          >
            ← Retreat
          </button>
        )}

        {/* Boss name & HP */}
        <div className="absolute top-4 left-0 right-0 flex flex-col items-center gap-2 z-10">
          <h2 className="text-xl font-bold text-white">{boss.name}</h2>
          <HeartsBar current={bossHp} max={bossMaxHp} color="red" size="md" />
        </div>

        {/* Boss image — fixed position, unaffected by question box */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 transition-transform duration-200 ${shaking ? 'animate-shake' : ''}`}
          style={{ bottom: '25%' }}
        >
          <img
            src={getBossSprite(boss, pose)}
            alt={boss.name}
            className="w-[70vw] h-[55vh] sm:w-[60vw] sm:h-[60vh] max-w-[700px] max-h-[550px] object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.5)] transition-opacity duration-200"
          />
          {/* Flash hit overlay */}
          {flashVisible && (
            <div className="absolute inset-0 bg-white/20 rounded-full animate-ping pointer-events-none" />
          )}
        </div>

        {/* Player HP — fixed above question area */}
        <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-1 z-10">
          <span className="text-xs text-gray-400 font-medium">Your HP</span>
          <HeartsBar current={playerHp} max={playerMaxHp} color="green" size="md" />
          <CrystalTracker collectedCrystals={profile?.collectedCrystals ?? []} size="sm" />
          {shieldActive && (
            <span className="text-xs text-blue-400">🛡️ Shield ready</span>
          )}
        </div>

        {/* Player avatar — bottom left, large floating character */}
        {profile && (
          <div className="absolute left-2 z-30 flex items-end" style={{ bottom: '20%' }}>
            <AvatarDisplay
              avatarId={profile.avatarId ?? null}
              name={profile.name}
              equippedCosmetics={profile.equippedCosmetics ?? null}
              collectedCrystals={profile.collectedCrystals ?? []}
            />
            {/* Sidekick with dynamic pose during fight */}
            {profile.activeSidekick && (() => {
              const sk = SIDEKICKS.find((s) => s.id === profile.activeSidekick);
              if (!sk) return null;
              const skSize = 400 * 0.45;
              const isFlying = sk.placement === 'flying';
              return (
                <img
                  src={`${sk.spritePath}/${sidekickPose}.png`}
                  alt={sk.name}
                  className="drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)] transition-all duration-200"
                  style={{
                    width: skSize,
                    height: skSize,
                    objectFit: 'contain',
                    marginLeft: 400 * -0.1,
                    alignSelf: isFlying ? 'flex-start' : 'flex-end',
                    marginBottom: isFlying ? undefined : 400 * 0.15,
                    marginTop: isFlying ? 400 * 0.05 : undefined,
                  }}
                />
              );
            })()}
          </div>
        )}
      </div>

      {/* Question area — pinned to bottom, overlays on top of boss area */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-black/70 backdrop-blur-sm border-t border-indigo-800/30 p-6">
        {fightOver ? (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">
              {victory ? '🎉 Victory!' : '💀 Defeated...'}
            </h2>
            {victory && crystalReward && (
              <div className="flex flex-col items-center gap-2 animate-bounce-slow">
                <img
                  src={crystalReward.spritePath}
                  alt={crystalReward.name}
                  className="w-20 h-20 object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.6)]"
                />
                <p className="text-sm font-semibold" style={{ color: crystalReward.color }}>
                  {crystalReward.name} obtained!
                </p>
              </div>
            )}
            <p className="text-gray-300">
              {victory
                ? `You defeated ${boss.name}! +${xpEarned} XP`
                : `${boss.name} was too strong. Practice more and try again!`}
            </p>
            <button
              onClick={handlePostFight}
              className="
                px-8 py-3 rounded-xl text-lg font-bold
                bg-gradient-to-r from-indigo-600 to-blue-600
                hover:from-indigo-500 hover:to-blue-500
                text-white transition-all active:scale-95
              "
            >
              {victory ? 'Continue →' : 'Back to Practice'}
            </button>
          </div>
        ) : currentQuestion ? (
          <QuestionCard
            key={currentQuestion.id}
            question={currentQuestion}
            onAnswer={handleAnswer}
            streak={0}
          />
        ) : null}
      </div>
      {showBossIntro && bossIntro && (
        <StoryDialog story={bossIntro} onComplete={() => setShowBossIntro(false)} />
      )}
      {showVictoryStory && bossVictoryStory && (
        <StoryDialog story={bossVictoryStory} onComplete={() => setShowVictoryStory(false)} />
      )}
      {!showVictoryStory && pendingDialogs.length > 0 && (
        <StoryDialog
          key={pendingDialogs[0].speaker + '-' + pendingDialogs[0].lines[0]?.slice(0, 20)}
          story={pendingDialogs[0]}
          onComplete={dismissCurrentDialog}
        />
      )}
    </div>
  );
}
