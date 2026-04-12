import { useGameStore, useActiveProfile } from '../../store/gameStore';
import { WORLDS } from '../../data/worlds';
import { getTheme } from '../../data/themes';
import { OVERWORLD_NODES, OVERWORLD_MAP_IMAGE } from '../../data/mapConfig';
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

  const handleWorldClick = (worldIdx: number) => {
    // Enter the world at the player's current stage (or stage 0 for completed/new worlds)
    resetStage();
    setCurrentWorld(worldIdx);
    const startStage =
      worldIdx === profile.currentWorld ? profile.currentStage : 0;
    setCurrentStage(startStage);

    const stageDef = WORLDS[worldIdx].stages[startStage];
    if (stageDef.type === 'mini-boss' || stageDef.type === 'world-boss') {
      setScreen('boss-fight');
    } else {
      setScreen('stage');
    }
  };

  return (
    <div className="min-h-screen bg-[#2a1f14] flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-4 px-5 py-2 bg-black/40 border-b border-amber-900/30 shrink-0 z-20">
        <button
          onClick={() => setScreen('profile-select')}
          className="text-amber-200/60 hover:text-amber-100 transition-colors text-sm"
        >
          ← Profiles
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-amber-200/50 truncate">
            {profile.name} · {theme.name}
          </p>
          <XPBar
            xp={profile.stats.xp}
            xpToNext={profile.stats.xpToNextLevel}
            level={profile.stats.level}
          />
        </div>
        <HeartsBar current={profile.stats.hp} max={profile.stats.maxHp} size="sm" />
        <span className="text-yellow-400 text-sm font-bold shrink-0">🪙 {profile.stats.coins}</span>
        <button
          onClick={() => setScreen('parent-dashboard')}
          className="text-xs text-amber-200/40 hover:text-amber-200 transition-colors shrink-0"
        >
          📊
        </button>
      </header>

      {/* Map area */}
      <div className="flex-1 relative overflow-auto">
        <div className="relative w-full min-h-full flex items-center justify-center">
          {/* Map image */}
          <img
            src={OVERWORLD_MAP_IMAGE}
            alt="Fantasy World Map"
            className="w-full h-auto max-h-[calc(100vh-52px)] object-contain"
            draggable={false}
          />

          {/* Clickable world nodes overlay */}
          <div className="absolute inset-0">
            {OVERWORLD_NODES.map((node) => {
              const isUnlocked = node.worldIndex <= unlockedWorld;
              const isCurrent = node.worldIndex === unlockedWorld;
              const isCompleted = node.worldIndex < unlockedWorld;
              const worldName =
                theme.worldNames[node.worldIndex] ?? node.name;

              return (
                <button
                  key={node.worldIndex}
                  onClick={() => isUnlocked && handleWorldClick(node.worldIndex)}
                  disabled={!isUnlocked}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group"
                  style={{
                    top: `${node.top}%`,
                    left: `${node.left}%`,
                  }}
                  title={isUnlocked ? worldName : '🔒 Locked'}
                >
                  {/* Node circle */}
                  <div
                    className={`
                      w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full
                      flex items-center justify-center
                      border-3 transition-all duration-200
                      ${isCurrent
                        ? 'bg-amber-500/90 border-yellow-300 shadow-[0_0_20px_rgba(250,204,21,0.5)] animate-pulse scale-110'
                        : isCompleted
                          ? 'bg-emerald-600/80 border-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.3)]'
                          : isUnlocked
                            ? 'bg-amber-700/80 border-amber-500 shadow-[0_0_10px_rgba(217,119,6,0.3)]'
                            : 'bg-gray-800/60 border-gray-600/50 opacity-60'
                      }
                      ${isUnlocked ? 'cursor-pointer hover:scale-115 active:scale-95' : 'cursor-not-allowed'}
                    `}
                  >
                    {isCompleted ? (
                      <span className="text-lg sm:text-xl">⭐</span>
                    ) : isUnlocked ? (
                      <span className="text-sm sm:text-base font-bold text-white drop-shadow-md">
                        {node.worldIndex + 1}
                      </span>
                    ) : (
                      <span className="text-sm sm:text-base">🔒</span>
                    )}
                  </div>

                  {/* Label tooltip */}
                  <div
                    className={`
                      absolute left-1/2 -translate-x-1/2 mt-1
                      px-2 py-0.5 rounded-md text-xs font-bold whitespace-nowrap
                      pointer-events-none transition-opacity duration-200
                      ${isCurrent || isCompleted
                        ? 'opacity-100'
                        : 'opacity-0 group-hover:opacity-100'
                      }
                      ${isUnlocked
                        ? 'bg-black/70 text-amber-100'
                        : 'bg-black/50 text-gray-400'
                      }
                    `}
                  >
                    {isUnlocked ? worldName : '???'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
