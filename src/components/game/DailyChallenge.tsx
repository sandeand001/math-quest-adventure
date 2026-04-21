import { useState, useCallback } from 'react';
import { useGameStore, useActiveProfile } from '../../store/gameStore';
import { generateStageQuestions } from '../../engine/questions';
import { QuestionCard } from './QuestionCard';
import { playCorrectSfx, playWrongSfx } from '../../services/soundManager';

const DAILY_COUNT = 5;
const COINS_PER_CORRECT = 10;
const BONUS_ALL_CORRECT = 25;

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

export function DailyChallenge() {
  const { setScreen, updateProfile, recordMastery, muted } = useGameStore();
  const profile = useActiveProfile();

  // Determine tier based on player progress (use their current world + 1)
  const tier = Math.min(8, (profile?.currentWorld ?? 0) + 1);
  const todayKey = getTodayKey();
  const alreadyCompleted = profile?.dailyChallengeDate === todayKey;

  const [questions] = useState(() => generateStageQuestions(tier, DAILY_COUNT, 0.7));
  const [questionIndex, setQuestionIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(alreadyCompleted);
  const [slideState, setSlideState] = useState<'in' | 'out'>('in');

  const currentQuestion = questions[questionIndex];
  const allAnswered = questionIndex >= questions.length;

  const handleAnswer = useCallback(
    (_userAnswer: number, isCorrect: boolean) => {
      if (isCorrect) setCorrectCount((c) => c + 1);
      if (!muted) {
        if (isCorrect) playCorrectSfx();
        else playWrongSfx();
      }
      if (currentQuestion) {
        recordMastery(currentQuestion.operation, currentQuestion.tier, isCorrect);
      }

      setTimeout(() => {
        setSlideState('out');
        setTimeout(() => {
          setQuestionIndex((i) => i + 1);
          setSlideState('in');
        }, 250);
      }, 600);
    },
    [currentQuestion, recordMastery, muted],
  );

  // Award coins when done
  if (allAnswered && !done && profile) {
    const earned = correctCount * COINS_PER_CORRECT + (correctCount === DAILY_COUNT ? BONUS_ALL_CORRECT : 0);
    updateProfile(profile.id, {
      stats: { ...profile.stats, coins: profile.stats.coins + earned },
      dailyChallengeDate: todayKey,
    });
    setDone(true);
  }

  if (!profile) return null;

  if (alreadyCompleted || done) {
    const earned = correctCount * COINS_PER_CORRECT + (correctCount === DAILY_COUNT ? BONUS_ALL_CORRECT : 0);
    return (
      <div className="h-full bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center p-6">
        <div className="bg-indigo-950/80 border border-indigo-800/40 rounded-3xl p-8 max-w-sm w-full text-center space-y-6">
          {allAnswered ? (
            <>
              <div className="text-4xl">🌟</div>
              <h2 className="text-2xl font-bold text-white">Daily Challenge Complete!</h2>
              <p className="text-gray-300">{correctCount}/{DAILY_COUNT} correct</p>
              {earned > 0 && (
                <p className="text-yellow-400 font-bold text-lg">+{earned} 🪙</p>
              )}
              {correctCount === DAILY_COUNT && (
                <p className="text-emerald-400 text-sm font-medium">Perfect! Bonus coins earned!</p>
              )}
            </>
          ) : (
            <>
              <div className="text-4xl">✅</div>
              <h2 className="text-xl font-bold text-white">Already Completed Today!</h2>
              <p className="text-gray-400">Come back tomorrow for a new challenge.</p>
            </>
          )}
          <button
            onClick={() => setScreen('world-map')}
            className="w-full py-3 rounded-xl text-lg font-bold bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white transition-all active:scale-95"
          >
            Back to Map
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col relative" style={{ background: '#0f1222' }}>
      <div className="relative z-10 flex flex-col flex-1">
        <header className="flex items-center gap-4 px-5 py-3 bg-black/20">
          <button
            onClick={() => setScreen('world-map')}
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            ← Back
          </button>
          <h1 className="flex-1 text-center text-sm font-bold text-yellow-300">
            🌟 Daily Challenge
          </h1>
          <span className="text-sm text-gray-400 tabular-nums">
            {questionIndex + 1}/{DAILY_COUNT}
          </span>
        </header>

        <main className="flex-1 flex items-center justify-center p-6">
          {currentQuestion && (
            <div
              className={`w-full max-w-lg transition-all duration-250 ${
                slideState === 'in' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
              }`}
            >
              <QuestionCard
                key={currentQuestion.id}
                question={currentQuestion}
                onAnswer={handleAnswer}
                streak={0}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
