import { useState, useEffect } from 'react';
import { useGameStore, useActiveProfile } from '../../store/gameStore';
import { StarRating } from '../ui/StarRating';
import { AchievementToast } from '../ui/AchievementToast';
import { checkAchievements } from '../../engine/achievements';
import { WORLDS } from '../../data/worlds';

export function StageResultScreen() {
  const {
    stageResults,
    currentWorldIndex,
    currentStageIndex,
    setCurrentStage,
    setScreen,
    resetStage,
    updateProfile,
  } = useGameStore();
  const profile = useActiveProfile();

  // Get the most recent result
  const result = stageResults[stageResults.length - 1];
  const world = WORLDS[currentWorldIndex];
  const stageDef = world?.stages[currentStageIndex];
  const passed = result && stageDef ? result.accuracy >= stageDef.requiredAccuracy : false;
  const isLastStage = stageDef && world ? currentStageIndex >= world.stages.length - 1 : false;

  // Check achievements on mount
  const [newAchievements, setNewAchievements] = useState<string[]>([]);
  const [toastIndex, setToastIndex] = useState(0);

  useEffect(() => {
    const unlocked = checkAchievements();
    if (unlocked.length > 0) {
      setNewAchievements(unlocked);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!result) {
    return null;
  }

  const handleContinue = () => {
    resetStage();
    if (passed && !isLastStage) {
      const nextStage = currentStageIndex + 1;
      setCurrentStage(nextStage);

      // Persist stage progress to profile
      if (profile && nextStage > profile.currentStage && currentWorldIndex === profile.currentWorld) {
        updateProfile(profile.id, { currentStage: nextStage });
      }

      const nextStageDef = world?.stages[nextStage];
      if (nextStageDef?.type === 'mini-boss' || nextStageDef?.type === 'world-boss') {
        setScreen('boss-fight');
      } else {
        setScreen('stage');
      }
    } else if (passed && isLastStage) {
      // World complete — go back to map
      setScreen('world-map');
    } else {
      // Failed — retry same stage
      setScreen('stage');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center p-6">
      <div className="bg-indigo-950/80 border border-indigo-800/40 rounded-3xl p-8 max-w-sm w-full text-center space-y-6">
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
            You can do it!
          </p>
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

        <button
          onClick={() => {
            resetStage();
            setScreen('world-map');
          }}
          className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
        >
          Back to World Map
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
