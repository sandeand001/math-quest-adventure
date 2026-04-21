import { useState } from 'react';
import { useGameStore, useActiveProfile } from '../../store/gameStore';
import { getTheme } from '../../data/themes';
import { OVERWORLD_NODES, OVERWORLD_MAP_IMAGE, SHOP_NODE } from '../../data/mapConfig';
import { StoryDialog } from '../ui/StoryDialog';
import { ONBOARDING_STORY } from '../../data/onboarding';

export function WorldMap() {
  const {
    setCurrentWorld,
    setScreen,
    resetStage,
    updateProfile,
  } = useGameStore();

  const profile = useActiveProfile();

  // Onboarding state (must be before early return for hooks-order rule)
  const [onboardingIdx, setOnboardingIdx] = useState(
    () => profile && !profile.onboardingComplete ? 0 : -1,
  );

  if (!profile) return null;

  const theme = getTheme(profile.theme);
  const unlockedWorld = profile.currentWorld;

  const handleWorldClick = (worldIdx: number) => {
    resetStage();
    setCurrentWorld(worldIdx);
    setScreen('zone-map');
  };

  const shopUnlocked = unlockedWorld >= 3;

  const showOnboarding = onboardingIdx >= 0 && onboardingIdx < ONBOARDING_STORY.length;

  return (
    <div className="h-full bg-[#2a1f14] flex flex-col">
      {/* Map area — nodes positioned relative to the image via inline aspect-ratio container */}
      <div className="flex-1 overflow-auto flex items-center justify-center bg-[#2a1f14] p-1">
        <div
          className="relative w-full max-w-[1920px]"
          style={{ aspectRatio: '16 / 9' }}
        >
          {/* Map image fills this container exactly */}
          <img
            src={OVERWORLD_MAP_IMAGE}
            alt="Fantasy World Map"
            className="absolute inset-0 w-full h-full object-fill rounded-lg"
            draggable={false}
          />

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
                  aria-label={isUnlocked ? `Enter ${worldName}${isCompleted ? ' (completed)' : isCurrent ? ' (current)' : ''}` : `${worldName} — locked`}
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

            {/* Shop node */}
            <button
              onClick={() => shopUnlocked && setScreen('shop')}
              disabled={!shopUnlocked}
              className="absolute -translate-x-1/2 -translate-y-1/2 group"
              style={{
                top: `${SHOP_NODE.top}%`,
                left: `${SHOP_NODE.left}%`,
              }}
              title={shopUnlocked ? 'Shop' : '🔒 Locked'}
            >
              <div
                className={`
                  w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full
                  flex items-center justify-center
                  border-3 transition-all duration-200
                  ${shopUnlocked
                    ? 'bg-purple-600/80 border-purple-400 shadow-[0_0_14px_rgba(168,85,247,0.4)] cursor-pointer hover:scale-115 active:scale-95'
                    : 'bg-gray-800/60 border-gray-600/50 opacity-60 cursor-not-allowed'
                  }
                `}
              >
                <span className="text-lg sm:text-xl">{shopUnlocked ? '🛒' : '🔒'}</span>
              </div>
              <div
                className={`
                  absolute left-1/2 -translate-x-1/2 mt-1
                  px-2 py-0.5 rounded-md text-xs font-bold whitespace-nowrap
                  pointer-events-none transition-opacity duration-200
                  ${shopUnlocked ? 'opacity-100 bg-black/70 text-purple-200' : 'opacity-0 group-hover:opacity-100 bg-black/50 text-gray-400'}
                `}
              >
                {shopUnlocked ? 'Shop' : '???'}
              </div>
            </button>
        </div>
      </div>

      {/* Onboarding tutorial dialogs */}
      {showOnboarding && (
        <StoryDialog
          key={onboardingIdx}
          story={ONBOARDING_STORY[onboardingIdx]}
          onComplete={() => {
            const next = onboardingIdx + 1;
            if (next >= ONBOARDING_STORY.length) {
              setOnboardingIdx(-1);
              updateProfile(profile.id, { onboardingComplete: true });
            } else {
              setOnboardingIdx(next);
            }
          }}
        />
      )}
    </div>
  );
}
