import { useGameStore, useActiveProfile } from '../../store/gameStore';
import { WORLDS, getWorldName } from '../../data/worlds';
import { getTheme } from '../../data/themes';
import { XPBar } from '../ui/XPBar';
import { HeartsBar } from '../ui/HeartsBar';

export function WorldMap() {
  const {
    setCurrentWorld,
    setCurrentStage,
    setScreen,
    resetStage,
  } = useGameStore();

  const profile = useActiveProfile();
  if (!profile) return null;

  const theme = getTheme(profile.theme);
  const unlockedWorld = profile.currentWorld;

  const handleStageSelect = (worldIdx: number, stageIdx: number) => {
    resetStage();
    setCurrentWorld(worldIdx);
    setCurrentStage(stageIdx);

    const stageDef = WORLDS[worldIdx].stages[stageIdx];
    if (stageDef.type === 'mini-boss' || stageDef.type === 'world-boss') {
      setScreen('boss-fight');
    } else {
      setScreen('stage');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950">
      {/* Header */}
      <header className="flex items-center gap-4 px-5 py-3 bg-black/20 border-b border-indigo-800/20">
        <button
          onClick={() => setScreen('profile-select')}
          className="text-gray-400 hover:text-white transition-colors text-sm"
        >
          ← Profiles
        </button>
        <div className="flex-1">
          <p className="text-sm text-gray-400">
            {profile.name} · {theme.name}
          </p>
          <XPBar
            xp={profile.stats.xp}
            xpToNext={profile.stats.xpToNextLevel}
            level={profile.stats.level}
          />
        </div>
        <HeartsBar current={profile.stats.hp} max={profile.stats.maxHp} size="sm" />
        <span className="text-yellow-400 text-sm font-bold">🪙 {profile.stats.coins}</span>
        <button
          onClick={() => setScreen('parent-dashboard')}
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          📊 Parent
        </button>
      </header>

      {/* World list */}
      <main className="max-w-2xl mx-auto p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center mb-6">{theme.name}</h1>

        {/* Worlds rendered bottom-to-top like a path */}
        <div className="flex flex-col-reverse gap-4">
          {WORLDS.map((world, worldIdx) => {
            const isUnlocked = worldIdx <= unlockedWorld;
            const isCurrent = worldIdx === unlockedWorld;
            const worldName = getWorldName(worldIdx, theme.worldNames);

            return (
              <div
                key={worldIdx}
                className={`
                  rounded-2xl border p-4 transition-all
                  ${isCurrent
                    ? 'bg-indigo-950/80 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                    : isUnlocked
                      ? 'bg-indigo-950/40 border-indigo-800/30'
                      : 'bg-gray-900/40 border-gray-800/20 opacity-50'
                  }
                `}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold
                      ${isCurrent ? 'bg-indigo-600 text-white' : isUnlocked ? 'bg-indigo-900 text-indigo-300' : 'bg-gray-800 text-gray-600'}
                    `}
                  >
                    {worldIdx + 1}
                  </div>
                  <div>
                    <h3 className={`font-bold ${isUnlocked ? 'text-white' : 'text-gray-600'}`}>
                      {worldName}
                    </h3>
                    <p className="text-xs text-gray-500">Tier {world.tier}</p>
                  </div>
                  {!isUnlocked && (
                    <span className="ml-auto text-gray-600 text-lg">🔒</span>
                  )}
                </div>

                {/* Stages */}
                {isUnlocked && (
                  <div className="flex gap-2 flex-wrap">
                    {world.stages.map((stage, stageIdx) => {
                      const isStageUnlocked =
                        worldIdx < unlockedWorld ||
                        (worldIdx === unlockedWorld && stageIdx <= profile.currentStage);

                      const isBossStage =
                        stage.type === 'mini-boss' || stage.type === 'world-boss';

                      return (
                        <button
                          key={stageIdx}
                          onClick={() => isStageUnlocked && handleStageSelect(worldIdx, stageIdx)}
                          disabled={!isStageUnlocked}
                          className={`
                            w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold
                            transition-all cursor-pointer
                            ${isStageUnlocked
                              ? isBossStage
                                ? 'bg-red-600/30 border border-red-500/50 text-red-300 hover:bg-red-600/50'
                                : 'bg-indigo-800/40 border border-indigo-700/40 text-indigo-200 hover:bg-indigo-700/50'
                              : 'bg-gray-800/30 border border-gray-700/20 text-gray-600 cursor-not-allowed'
                            }
                          `}
                          title={`Stage ${stageIdx + 1} (${stage.type})`}
                        >
                          {isBossStage ? '💀' : stageIdx + 1}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
