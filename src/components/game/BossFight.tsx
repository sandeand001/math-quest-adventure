import { useState, useEffect, useCallback } from 'react';
import { useGameStore, useActiveProfile } from '../../store/gameStore';
import { generateStageQuestions } from '../../engine/questions';
import { getBoss, getBossSprite, getBossSfx } from '../../data/bosses';
import { WORLDS } from '../../data/worlds';
import { xpForCorrectAnswer, applyXp, coinsForBossDefeat } from '../../engine/progression';
import { QuestionCard } from './QuestionCard';
import { HeartsBar } from '../ui/HeartsBar';
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
  const [shaking, setShaking] = useState(false);
  const [flashVisible, setFlashVisible] = useState(false);
  const [questions, setQuestions] = useState(
    generateStageQuestions(stageDef?.tier ?? 1, stageDef?.questionCount ?? 5),
  );
  const [questionIndex, setQuestionIndex] = useState(0);
  const [fightOver, setFightOver] = useState(false);
  const [victory, setVictory] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [initialized, setInitialized] = useState(false);

  // Initialize boss fight
  useEffect(() => {
    const hp = isBossFight ? boss.hp : Math.max(3, boss.hp - 3);
    const playerHpVal = profile?.stats.maxHp ?? 3;
    const shield = profile?.stats.shieldUnlocked ?? false;

    setBossFight(hp, playerHpVal, shield);
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
    if (!initialized || fightOver) return;

    if (bossHp <= 0) {
      // Victory!
      setPose('defeated-position');
      playSfx('victory');
      setVictory(true);
      setFightOver(true);

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
            isBossFight && currentWorldIndex < 6
              ? currentWorldIndex + 1
              : profile.currentWorld,
          currentStage: isBossFight
            ? 0 // Reset stage for new world
            : Math.max(profile.currentStage, nextStage), // Mini-boss: advance stage
        });
      }
    } else if (playerHp <= 0) {
      // Defeat
      setPose('attack-position');
      setFightOver(true);
      setVictory(false);
    }
  }, [
    initialized,
    bossHp,
    playerHp,
    fightOver,
    profile,
    bossMaxHp,
    xpEarned,
    isBossFight,
    currentWorldIndex,
    stageDef,
    updateProfile,
    playSfx,
  ]);

  const handleAnswer = useCallback(
    (_userAnswer: number, isCorrect: boolean) => {
      if (fightOver) return;

      if (isCorrect) {
        // Player attacks boss
        const attackPower = profile?.stats.attack ?? 1;
        damageBoss(attackPower);
        setPose('hit-position');
        setShaking(true);
        setFlashVisible(true);
        playSfx('hit');
        setXpEarned((prev) => prev + xpForCorrectAnswer(0, stageDef?.tier ?? 1));

        setTimeout(() => {
          setShaking(false);
          setFlashVisible(false);
          if (bossHp - attackPower > 0) {
            setPose('base-position');
          }
        }, 400);
      } else {
        // Boss attacks player
        damagePlayer();
        setPose('attack-position');
        playSfx('attack');

        setTimeout(() => {
          if (playerHp - 1 > 0) {
            setPose('base-position');
          }
        }, 500);
      }

      // Next question
      setTimeout(() => {
        if (questionIndex < questions.length - 1) {
          setQuestionIndex((i) => i + 1);
        } else {
          // Generate more questions if boss is still alive
          const newQ = generateStageQuestions(stageDef?.tier ?? 1, 5);
          setQuestions((prev) => [...prev, ...newQ]);
          setQuestionIndex((i) => i + 1);
        }
      }, 900);
    },
    [
      fightOver,
      profile,
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

  const handlePostFight = () => {
    resetStage();
    if (victory) {
      setScreen('world-map');
    } else {
      // Go back to redo stages
      setCurrentStage(Math.max(0, currentStageIndex - 2));
      setScreen('stage');
    }
  };

  const currentQuestion = questions[questionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 flex flex-col">
      {/* Boss area */}
      <div className="relative flex-1 flex flex-col items-center justify-center overflow-hidden">
        {/* Boss name & HP */}
        <div className="absolute top-4 left-0 right-0 flex flex-col items-center gap-2 z-10">
          <h2 className="text-xl font-bold text-white">{boss.name}</h2>
          <HeartsBar current={bossHp} max={bossMaxHp} color="red" size="md" />
        </div>

        {/* Boss image */}
        <div
          className={`relative transition-transform duration-200 ${shaking ? 'animate-shake' : ''}`}
        >
          <img
            src={getBossSprite(boss, pose)}
            alt={boss.name}
            className="max-w-80 max-h-80 object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-opacity duration-200"
          />
          {/* Flash hit overlay */}
          {flashVisible && (
            <div className="absolute inset-0 bg-white/20 rounded-full animate-ping pointer-events-none" />
          )}
        </div>

        {/* Player HP */}
        <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-1 z-10">
          <span className="text-xs text-gray-400 font-medium">Your HP</span>
          <HeartsBar current={playerHp} max={playerMaxHp} color="green" size="md" />
          {shieldActive && (
            <span className="text-xs text-blue-400">🛡️ Shield ready</span>
          )}
        </div>
      </div>

      {/* Question area / End screen */}
      <div className="bg-black/30 border-t border-indigo-800/30 p-6">
        {fightOver ? (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">
              {victory ? '🎉 Victory!' : '💀 Defeated...'}
            </h2>
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
            question={currentQuestion}
            onAnswer={handleAnswer}
            streak={0}
          />
        ) : null}
      </div>
    </div>
  );
}
