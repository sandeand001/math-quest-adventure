import { useCallback, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { generateStageQuestions } from '../../engine/questions';
import { starsFromAccuracy, xpForCorrectAnswer, applyXp } from '../../engine/progression';
import { WORLDS } from '../../data/worlds';
import { QuestionCard } from './QuestionCard';
import { HeartsBar } from '../ui/HeartsBar';

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

  // Handle stage completion
  useEffect(() => {
    if (!isComplete || !stageDef || !activeProfile) return;

    const accuracy = totalQuestions > 0 ? correctCount / totalQuestions : 0;
    const stars = starsFromAccuracy(accuracy);
    const timeSpent = Date.now() - stageStartTime;

    const result = {
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
    const updatedStats = applyXp(activeProfile.stats, xpEarned);
    updatedStats.totalCorrect += correctCount;
    updatedStats.totalAttempts += totalQuestions;

    updateProfile(activeProfile.id, { stats: updatedStats });

    setScreen('stage-result');
  }, [
    isComplete,
    stageDef,
    activeProfile,
    currentWorldIndex,
    currentStageIndex,
    correctCount,
    totalQuestions,
    stageStartTime,
    addStageResult,
    updateProfile,
    setScreen,
  ]);

  const handleAnswer = useCallback(
    (_userAnswer: number, isCorrect: boolean) => {
      answerQuestion(isCorrect);

      // Track mastery for this skill
      if (currentQuestion) {
        recordMastery(currentQuestion.operation, currentQuestion.tier, isCorrect);
      }

      // Small delay then advance
      setTimeout(() => {
        nextQuestion();
      }, 200);
    },
    [answerQuestion, nextQuestion, recordMastery, currentQuestion],
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
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 flex flex-col">
      {/* Top bar */}
      <header className="flex items-center gap-4 px-5 py-3 bg-black/20">
        <button
          onClick={() => {
            useGameStore.getState().resetStage();
            setScreen('world-map');
          }}
          className="text-gray-400 hover:text-white transition-colors text-sm"
        >
          ← Back
        </button>
        <div className="flex-1">
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <span className="text-sm text-gray-400 tabular-nums">
          {currentQuestionIndex + 1}/{totalQuestions}
        </span>
        {activeProfile && (
          <HeartsBar current={activeProfile.stats.hp} max={activeProfile.stats.maxHp} size="sm" />
        )}
      </header>

      {/* Question area */}
      <main className="flex-1 flex items-center justify-center p-6">
        <QuestionCard
          question={currentQuestion}
          onAnswer={handleAnswer}
          streak={streak}
        />
      </main>
    </div>
  );
}
