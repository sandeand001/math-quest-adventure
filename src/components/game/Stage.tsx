import { useState, useCallback, useEffect, useRef } from 'react';
import { useGameStore } from '../../store/gameStore';
import { generateStageQuestions } from '../../engine/questions';
import { starsFromAccuracy, xpForCorrectAnswer, applyXp } from '../../engine/progression';
import { getStory } from '../../data/stories';
import { WORLDS } from '../../data/worlds';
import { getPipComment, type PipComment } from '../../data/pipComments';
import { QuestionCard } from './QuestionCard';
import { AvatarDisplay } from '../ui/AvatarDisplay';
import { StoryDialog } from '../ui/StoryDialog';
import { playCorrectSfx, playWrongSfx } from '../../services/soundManager';
import type { StageResult } from '../../types';

export function Stage() {
  const {
    currentWorldIndex,
    currentStageIndex,
    questions,
    currentQuestionIndex,
    correctCount,
    streak,
    stageStartTime,
    setQuestions,
    answerQuestion,
    nextQuestion,
    setScreen,
    addStageResult,
    activeProfileId,
    profiles,
    updateProfile,
    recordMastery,
  } = useGameStore();

  const world = WORLDS[currentWorldIndex];
  const stageDef = world?.stages[currentStageIndex];
  const activeProfile = profiles.find((p) => p.id === activeProfileId);

  // Use a ref to avoid the completion effect depending on activeProfile directly
  const profileRef = useRef(activeProfile);
  useEffect(() => {
    profileRef.current = activeProfile;
  }, [activeProfile]);

  // Stage intro story
  const stageStory = getStory('stage-intro', currentWorldIndex, currentStageIndex);
  const [showStory, setShowStory] = useState(!!stageStory);

  // Pip commentary
  const [pipComment, setPipComment] = useState<PipComment | null>(null);
  const pipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Question transition animation
  const [slideState, setSlideState] = useState<'in' | 'out'>('in');

  // Streak visual effects
  const [streakGlow, setStreakGlow] = useState(false);
  const [streakBurst, setStreakBurst] = useState(false);

  // Generate questions when stage mounts
  useEffect(() => {
    if (stageDef && questions.length === 0) {
      const q = generateStageQuestions(stageDef.tier, stageDef.questionCount, stageDef.difficulty);
      setQuestions(q);
    }
  }, [stageDef, questions.length, setQuestions]);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const isComplete = currentQuestionIndex >= totalQuestions && totalQuestions > 0;

  // Prevent double-firing of the completion effect
  const completedRef = useRef(false);

  // Handle stage completion
  useEffect(() => {
    if (!isComplete || completedRef.current) return;
    const profile = profileRef.current;
    if (!stageDef || !profile) return;

    completedRef.current = true;

    const accuracy = totalQuestions > 0 ? correctCount / totalQuestions : 0;
    const stars = starsFromAccuracy(accuracy);
    const timeSpent = Date.now() - stageStartTime;
    const passed = accuracy >= stageDef.requiredAccuracy;

    const result: StageResult = {
      profileId: profile.id,
      worldIndex: currentWorldIndex,
      stageIndex: currentStageIndex,
      correct: correctCount,
      total: totalQuestions,
      accuracy,
      stars,
      timeSpent,
      completedAt: Date.now(),
    };

    addStageResult(result);

    // Apply XP (use average streak for bonus — simplified)
    const avgStreak = correctCount > 0 ? Math.floor(correctCount / 2) : 0;
    const xpEarned = correctCount * xpForCorrectAnswer(avgStreak, stageDef.tier);
    const oldLevel = profile.stats.level;
    const updatedStats = applyXp(profile.stats, xpEarned);
    updatedStats.totalCorrect += correctCount;
    updatedStats.totalAttempts += totalQuestions;

    // Record level-up info on the result
    if (updatedStats.level > oldLevel) {
      result.levelsGained = updatedStats.level - oldLevel;
      result.newLevel = updatedStats.level;
    }

    // Update stats AND advance stage progress in one call
    const profileUpdates: Record<string, unknown> = { stats: updatedStats };
    if (passed) {
      const nextStage = currentStageIndex + 1;
      if (
        nextStage > (profile.currentStage ?? 0) &&
        currentWorldIndex === (profile.currentWorld ?? 0)
      ) {
        profileUpdates.currentStage = nextStage;
      }
    }

    updateProfile(profile.id, profileUpdates);
    setScreen('stage-result');
  }, [
    isComplete,
    stageDef,
    currentWorldIndex,
    currentStageIndex,
    correctCount,
    totalQuestions,
    stageStartTime,
    addStageResult,
    updateProfile,
    setScreen,
  ]);

  const muted = useGameStore((s) => s.muted);

  const handleAnswer = useCallback(
    (_userAnswer: number, isCorrect: boolean) => {
      answerQuestion(isCorrect);

      // Track mastery for this skill
      if (currentQuestion) {
        recordMastery(currentQuestion.operation, currentQuestion.tier, isCorrect);
      }

      // SFX
      if (!muted) {
        if (isCorrect) playCorrectSfx();
        else playWrongSfx();
      }

      // Pip commentary
      const newStreak = isCorrect ? streak + 1 : 0;
      const comment = getPipComment(isCorrect ? 'correct' : 'wrong', newStreak);
      setPipComment(comment);
      if (pipTimer.current) clearTimeout(pipTimer.current);
      pipTimer.current = setTimeout(() => setPipComment(null), 2500);

      // Streak effects
      if (isCorrect && newStreak >= 5) {
        setStreakGlow(true);
        setTimeout(() => setStreakGlow(false), 1500);
      }
      if (isCorrect && newStreak >= 10) {
        setStreakBurst(true);
        setTimeout(() => setStreakBurst(false), 1000);
      }

      // Slide out → advance → slide in
      setTimeout(() => {
        setSlideState('out');
        setTimeout(() => {
          nextQuestion();
          setSlideState('in');
        }, 250);
      }, 600);
    },
    [answerQuestion, nextQuestion, recordMastery, currentQuestion, streak, muted],
  );

  if (!stageDef || !currentQuestion) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-400 text-lg">Loading...</div>
      </div>
    );
  }

  const progress = totalQuestions > 0 ? (currentQuestionIndex / totalQuestions) * 100 : 0;

  return (
    <div
      className={`h-full flex flex-col relative ${streakGlow ? 'ring-4 ring-orange-500/50 ring-inset' : ''}`}
      style={{ background: '#0f1222' }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url("${encodeURI(world?.background ?? '')}")` }}
      />

      {/* Streak burst overlay */}
      {streakBurst && (
        <div className="absolute inset-0 z-30 pointer-events-none animate-ping bg-gradient-radial from-yellow-400/20 to-transparent" />
      )}

      {/* Player avatar — bottom left corner, large */}
      {activeProfile && (
        <div className="absolute bottom-4 left-2 z-20">
          <AvatarDisplay
            avatarId={activeProfile.avatarId ?? null}
            name={activeProfile.name}
            equippedCosmetics={activeProfile.equippedCosmetics ?? null}
            sidekick={activeProfile.activeSidekick ?? null}
            collectedCrystals={activeProfile.collectedCrystals ?? []}
          />
        </div>
      )}

      {/* Pip — always visible on the right side */}
      <div className="absolute bottom-4 right-4 z-30 flex flex-col items-center gap-1">
        {/* Speech bubble (fades in/out with comment) */}
        {pipComment && (
          <div className="bg-[#1a1530]/90 border border-indigo-700/40 rounded-xl px-3 py-2 max-w-[180px] text-center animate-[slideUp_0.2s_ease-out]">
            <p className="text-xs text-white leading-snug">{pipComment.text}</p>
          </div>
        )}
        <img
          src={pipComment?.sprite ?? '/assets/characters/pip/happy.png'}
          alt="Pip"
          className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 object-contain drop-shadow-[0_6px_20px_rgba(0,0,0,0.6)] transition-all duration-300"
        />
      </div>

      <div className="relative z-10 flex flex-col flex-1">
      {/* Progress bar */}
      <div className="flex items-center gap-3 px-5 py-2 bg-black/20">
        <div className="flex-1">
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <span className="text-sm text-gray-400 tabular-nums">
          {currentQuestionIndex + 1}/{totalQuestions}
        </span>
      </div>

      {/* Question area */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div
          className={`w-full max-w-lg transition-all duration-250 ${
            slideState === 'in'
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 -translate-x-8'
          }`}
        >
          <QuestionCard
            key={currentQuestion.id}
            question={currentQuestion}
            onAnswer={handleAnswer}
            streak={streak}
            hintAvailable={stageDef.type === 'practice'}
          />
        </div>
      </main>
      {showStory && stageStory && (
        <StoryDialog story={stageStory} onComplete={() => setShowStory(false)} />
      )}
      </div>
    </div>
  );
}
