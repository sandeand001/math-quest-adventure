import { useState } from 'react';
import { useGameStore, useActiveProfile } from '../../store/gameStore';
import { StarRating } from '../ui/StarRating';
import { AchievementToast } from '../ui/AchievementToast';
import { checkAchievements } from '../../engine/achievements';
import { WORLDS } from '../../data/worlds';
import { playCorrectSfx } from '../../services/soundManager';

export function StageResultScreen() {
  const {
    stageResults,
    currentWorldIndex,
    currentStageIndex,
    setCurrentStage,
    setScreen,
    resetStage,
    updateProfile,
    consecutiveFailures,
    recordFailure,
    clearFailures,
  } = useGameStore();
  const profile = useActiveProfile();

  // Get the most recent result
  const result = stageResults[stageResults.length - 1];
  const world = WORLDS[currentWorldIndex];
  const stageDef = world?.stages[currentStageIndex];
  const passed = result && stageDef ? result.accuracy >= stageDef.requiredAccuracy : false;
  const isLastStage = stageDef && world ? currentStageIndex >= world.stages.length - 1 : false;

  // Check achievements on mount (lazy initializer runs once)
  const [newAchievements] = useState<string[]>(() => checkAchievements());
  const [toastIndex, setToastIndex] = useState(0);

  // Track failures for remedial training (lazy initializer runs once on mount)
  useState(() => {
    if (!passed) {
      recordFailure();
    } else {
      clearFailures();
    }
    // Play level-up SFX
    if (result?.levelsGained && result.levelsGained > 0) {
      const muted = useGameStore.getState().muted;
      if (!muted) {
        setTimeout(() => { playCorrectSfx(); setTimeout(playCorrectSfx, 200); }, 300);
      }
    }
  });

  // After 2+ consecutive failures, remedial is mandatory
  const failCount = consecutiveFailures;
  const remedialRequired = !passed && failCount >= 2;
  const remedialOffered = !passed && failCount === 1;

  if (!result) {
    return null;
  }

  const handleContinue = () => {
    resetStage();
    if (passed && !isLastStage) {
      const nextStage = currentStageIndex + 1;
      setCurrentStage(nextStage);

      // Belt-and-suspenders: also update profile in case Stage.tsx didn't
      if (profile && currentWorldIndex === (profile.currentWorld ?? 0)) {
        const newStage = Math.max(profile.currentStage ?? 0, nextStage);
        if (newStage !== profile.currentStage) {
          updateProfile(profile.id, { currentStage: newStage });
        }
      }

      // Return to zone map so player can see progress and select next stage
      setScreen('zone-map');
    } else if (passed && isLastStage) {
      // World complete — go back to world map
      setScreen('world-map');
    } else {
      // Failed — return to zone map to retry
      setScreen('zone-map');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center p-6">
      <div className="bg-indigo-950/80 border border-indigo-800/40 rounded-3xl p-8 max-w-sm w-full text-center space-y-6">
        {/* Level-up celebration */}
        {result.levelsGained && result.levelsGained > 0 && (
          <div className="bg-gradient-to-r from-yellow-600/30 to-amber-600/30 border border-yellow-500/50 rounded-2xl p-4 space-y-2 animate-[slideUp_0.5s_ease-out]">
            <div className="text-3xl">🎉⬆️🎉</div>
            <p className="text-lg font-bold text-yellow-300">LEVEL UP!</p>
            <p className="text-2xl font-extrabold text-white">Level {result.newLevel}</p>
            <p className="text-xs text-yellow-200/70">New abilities unlocked!</p>
          </div>
        )}

        <h2 className="text-2xl font-bold">
          {passed ? '🎉 Stage Complete!' : 'Keep Practicing!'}
        </h2>

        <StarRating stars={result.stars} />

        <div className="space-y-2 text-gray-300">
          <p>
            <span className="text-white font-bold">{result.correct}</span> / {result.total} correct
          </p>
          <p>
            Accuracy:{' '}
            <span className="text-white font-bold">
              {Math.round(result.accuracy * 100)}%
            </span>
          </p>
          <p className="text-sm text-gray-500">
            Time: {Math.round(result.timeSpent / 1000)}s
          </p>
        </div>

        {!passed && (
          <p className="text-sm text-amber-400">
            Need {Math.round((stageDef?.requiredAccuracy ?? 0.7) * 100)}% to advance.
            {remedialRequired
              ? " Let's practice with Professor Hoot first!"
              : ' You can do it!'}
          </p>
        )}

        {/* Remedial training button */}
        {remedialRequired && (
          <button
            onClick={() => {
              resetStage();
              setScreen('remedial');
            }}
            className="
              w-full py-3 rounded-xl text-lg font-bold
              bg-gradient-to-r from-amber-600 to-orange-600
              hover:from-amber-500 hover:to-orange-500
              text-white transition-all active:scale-95
            "
          >
            📚 Study with Professor Hoot
          </button>
        )}

        <button
          onClick={handleContinue}
          className="
            w-full py-3 rounded-xl text-lg font-bold
            bg-gradient-to-r from-indigo-600 to-blue-600
            hover:from-indigo-500 hover:to-blue-500
            text-white transition-all active:scale-95
          "
        >
          {passed ? (isLastStage ? 'Back to Map' : 'Continue →') : 'Try Again'}
        </button>

        {/* Optional remedial on first failure */}
        {remedialOffered && (
          <button
            onClick={() => {
              resetStage();
              setScreen('remedial');
            }}
            className="text-sm text-amber-400 hover:text-amber-300 transition-colors"
          >
            📚 Practice with Professor Hoot first?
          </button>
        )}

        <button
          onClick={() => {
            resetStage();
            setScreen('zone-map');
          }}
          className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
        >
          Back to Zone Map
        </button>
      </div>

      {/* Achievement toasts */}
      {newAchievements[toastIndex] && (
        <AchievementToast
          key={newAchievements[toastIndex]}
          achievementId={newAchievements[toastIndex]}
          onDone={() => setToastIndex((i) => i + 1)}
        />
      )}
    </div>
  );
}
