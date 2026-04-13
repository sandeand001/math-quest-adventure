import { useState, useRef, useEffect } from 'react';
import { useGameStore, useActiveProfile } from '../../store/gameStore';
import { WORLDS } from '../../data/worlds';
import { getTheme } from '../../data/themes';
import { ZONE_MAPS, type ZoneStageNode } from '../../data/mapConfig';
import { getStory } from '../../data/stories';
import { HeartsBar } from '../ui/HeartsBar';
import { StoryDialog } from '../ui/StoryDialog';

const DEV_MODE = import.meta.env.DEV;

/** Default S-curve node positions for the 8-stage layout when no zone map image exists */
const DEFAULT_STAGE_POSITIONS: { top: number; left: number }[] = [
  { top: 82, left: 12 },   // Stage 1 (bottom-left)
  { top: 70, left: 32 },   // Stage 2
  { top: 55, left: 16 },   // Stage 3
  { top: 42, left: 38 },   // Stage 4
  { top: 42, left: 62 },   // Mini-boss
  { top: 55, left: 82 },   // Stage 6
  { top: 30, left: 72 },   // Stage 7
  { top: 15, left: 88 },   // World Boss (top-right)
];

/** Theme colors per world for the placeholder zone maps */
const ZONE_THEMES: { bg: string; path: string; accent: string; name: string }[] = [
  { bg: 'from-green-950 via-emerald-950 to-green-950', path: 'bg-green-800/40', accent: 'border-emerald-500', name: '🌲' },
  { bg: 'from-indigo-950 via-purple-950 to-blue-950', path: 'bg-purple-800/40', accent: 'border-purple-500', name: '💎' },
  { bg: 'from-green-950 via-lime-950 to-emerald-950', path: 'bg-lime-800/40', accent: 'border-lime-500', name: '🌸' },
  { bg: 'from-stone-950 via-amber-950 to-stone-950', path: 'bg-amber-800/40', accent: 'border-amber-500', name: '⛰️' },
  { bg: 'from-gray-950 via-emerald-950 to-gray-950', path: 'bg-gray-800/40', accent: 'border-gray-500', name: '🐸' },
  { bg: 'from-stone-950 via-teal-950 to-stone-950', path: 'bg-teal-800/40', accent: 'border-teal-500', name: '🏛️' },
  { bg: 'from-blue-950 via-sky-950 to-indigo-950', path: 'bg-sky-800/40', accent: 'border-sky-500', name: '☁️' },
  { bg: 'from-red-950 via-orange-950 to-stone-950', path: 'bg-orange-800/40', accent: 'border-orange-500', name: '🌋' },
];

export function ZoneMap() {
  const {
    currentWorldIndex,
    setCurrentStage,
    setScreen,
    resetStage,
  } = useGameStore();

  const profile = useActiveProfile();
  if (!profile) return null;

  const theme = getTheme(profile.theme);
  const world = WORLDS[currentWorldIndex];
  const worldName = theme.worldNames[currentWorldIndex] ?? `World ${currentWorldIndex + 1}`;
  const zoneConfig = ZONE_MAPS[currentWorldIndex];
  const unlockedWorld = profile.currentWorld;

  // Story dialog
  const [showStory, setShowStory] = useState(false);
  const worldIntro = getStory('world-intro', currentWorldIndex);

  // Show world intro on first visit (when it's the current unlocked world and stage 0)
  useEffect(() => {
    if (
      worldIntro &&
      currentWorldIndex === unlockedWorld &&
      profile.currentStage === 0
    ) {
      setShowStory(true);
    }
  }, [currentWorldIndex, unlockedWorld, profile.currentStage, worldIntro]);

  // Dev calibration state
  const [calibrationStep, setCalibrationStep] = useState(0);
  const [calibrationPoints, setCalibrationPoints] = useState<{ top: number; left: number }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const STAGE_LABELS = world.stages.map((s, i) => {
    if (s.type === 'mini-boss') return `📍 Click Mini-Boss (stage ${i + 1})`;
    if (s.type === 'world-boss') return `📍 Click World Boss (stage ${i + 1})`;
    return `📍 Click Stage ${i + 1}`;
  });

  const handleCalibrationClick = (e: React.MouseEvent) => {
    if (!DEV_MODE || !zoneConfig?.calibrating) return;
    if (calibrationStep >= STAGE_LABELS.length) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const left = Math.round(((e.clientX - rect.left) / rect.width) * 1000) / 10;
    const top = Math.round(((e.clientY - rect.top) / rect.height) * 1000) / 10;
    const point = { top, left };
    const newPoints = [...calibrationPoints, point];
    setCalibrationPoints(newPoints);
    console.log(`${STAGE_LABELS[calibrationStep]} → top: ${top}%, left: ${left}%`);
    const next = calibrationStep + 1;
    setCalibrationStep(next);
    if (next === STAGE_LABELS.length) {
      console.log(`\n✅ ZONE ${currentWorldIndex} CALIBRATION COMPLETE:\n`);
      console.log(`// World ${currentWorldIndex}: ${worldName}`);
      console.log('nodes: [');
      newPoints.forEach((p, i) => {
        const s = world.stages[i];
        console.log(`  { stageIndex: ${i}, top: ${p.top}, left: ${p.left}, type: '${s.type}' },`);
      });
      console.log('],');
    }
  };

  const handleStageClick = (stageIdx: number) => {
    resetStage();
    setCurrentStage(stageIdx);
    const stageDef = world.stages[stageIdx];
    if (stageDef.type === 'mini-boss' || stageDef.type === 'world-boss') {
      setScreen('boss-fight');
    } else {
      setScreen('stage');
    }
  };

  // If no zone map image configured yet, show styled placeholder with path layout
  const zt = ZONE_THEMES[currentWorldIndex] ?? ZONE_THEMES[0];

  if (!zoneConfig?.image) {
    return (
      <div className={`min-h-screen bg-gradient-to-b ${zt.bg} flex flex-col`}>
        <header className="flex items-center gap-4 px-5 py-2 bg-black/40 border-b border-white/10 shrink-0 z-20">
          <button onClick={() => setScreen('world-map')} className="text-amber-200/60 hover:text-amber-100 text-sm">
            ← World Map
          </button>
          <h1 className="flex-1 text-center text-lg font-bold text-amber-100">
            {zt.name} {worldName}
          </h1>
          <HeartsBar current={profile.stats.hp} max={profile.stats.maxHp} size="sm" />
        </header>

        <div className="flex-1 overflow-auto flex items-center justify-center p-2">
          <div className="relative w-full max-w-[900px]" style={{ aspectRatio: '16 / 10' }}>

            {/* Path lines connecting stages */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
              {DEFAULT_STAGE_POSITIONS.slice(0, -1).map((pos, i) => {
                const next = DEFAULT_STAGE_POSITIONS[i + 1];
                return (
                  <line
                    key={i}
                    x1={pos.left}
                    y1={pos.top}
                    x2={next.left}
                    y2={next.top}
                    stroke="rgba(255,255,255,0.12)"
                    strokeWidth="1.5"
                    strokeDasharray="2,2"
                  />
                );
              })}
            </svg>

            {/* Stage nodes */}
            {world.stages.map((stage, stageIdx) => {
              const pos = DEFAULT_STAGE_POSITIONS[stageIdx];
              const isStageUnlocked =
                currentWorldIndex < unlockedWorld ||
                (currentWorldIndex === unlockedWorld && stageIdx <= profile.currentStage);
              const isCompleted =
                currentWorldIndex < unlockedWorld ||
                (currentWorldIndex === unlockedWorld && stageIdx < profile.currentStage);
              const isCurrent =
                currentWorldIndex === unlockedWorld && stageIdx === profile.currentStage;
              const isBoss = stage.type === 'mini-boss' || stage.type === 'world-boss';
              const isWorldBoss = stage.type === 'world-boss';

              return (
                <button
                  key={stageIdx}
                  onClick={() => isStageUnlocked && handleStageClick(stageIdx)}
                  disabled={!isStageUnlocked}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group z-10"
                  style={{ top: `${pos.top}%`, left: `${pos.left}%` }}
                >
                  <div
                    className={`
                      ${isWorldBoss ? 'w-16 h-16 sm:w-20 sm:h-20' : isBoss ? 'w-14 h-14 sm:w-16 sm:h-16' : 'w-12 h-12 sm:w-14 sm:h-14'}
                      rounded-full flex items-center justify-center
                      border-3 transition-all duration-200
                      ${isCurrent
                        ? `bg-amber-500/80 border-yellow-300 shadow-[0_0_24px_rgba(250,204,21,0.5)] animate-pulse scale-110`
                        : isCompleted
                          ? `bg-emerald-600/70 border-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.3)]`
                          : isStageUnlocked
                            ? isBoss
                              ? `bg-red-700/70 border-red-400 shadow-[0_0_16px_rgba(220,38,38,0.4)]`
                              : `bg-white/10 ${zt.accent} shadow-[0_0_8px_rgba(255,255,255,0.1)]`
                            : `bg-gray-900/50 border-gray-700/40 opacity-40`
                      }
                      ${isStageUnlocked ? 'cursor-pointer hover:scale-110 active:scale-95' : 'cursor-not-allowed'}
                    `}
                  >
                    {isCompleted ? (
                      <span className="text-lg sm:text-xl">⭐</span>
                    ) : !isStageUnlocked ? (
                      <span className="text-sm">🔒</span>
                    ) : isWorldBoss ? (
                      <span className="text-xl sm:text-2xl">🐉</span>
                    ) : isBoss ? (
                      <span className="text-lg sm:text-xl">💀</span>
                    ) : (
                      <span className="text-sm sm:text-base font-bold text-white drop-shadow-md">
                        {stageIdx + 1}
                      </span>
                    )}
                  </div>

                  {/* Label */}
                  <div
                    className={`
                      absolute left-1/2 -translate-x-1/2 mt-1
                      px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-bold whitespace-nowrap
                      pointer-events-none transition-opacity duration-200
                      ${isCurrent || isWorldBoss ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                      bg-black/70 text-white
                    `}
                  >
                    {isWorldBoss ? '⚔️ BOSS' : isBoss ? '💀 Mini-Boss' : `Stage ${stageIdx + 1}`}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {showStory && worldIntro && (
          <StoryDialog story={worldIntro} onComplete={() => setShowStory(false)} />
        )}
      </div>
    );
  }

  // Full zone map with image
  return (
    <div className="min-h-screen bg-[#2a1f14] flex flex-col">
      <header className="flex items-center gap-4 px-5 py-2 bg-black/40 border-b border-amber-900/30 shrink-0 z-20">
        <button onClick={() => setScreen('world-map')} className="text-amber-200/60 hover:text-amber-100 text-sm">
          ← World Map
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-amber-100">{worldName}</h1>
        <HeartsBar current={profile.stats.hp} max={profile.stats.maxHp} size="sm" />
      </header>

      <div className="flex-1 overflow-auto flex items-center justify-center p-1">
        <div
          ref={containerRef}
          className="relative w-full max-w-[1920px]"
          style={{ aspectRatio: '16 / 9' }}
          onClick={DEV_MODE && zoneConfig.calibrating ? handleCalibrationClick : undefined}
        >
          <img
            src={zoneConfig.image}
            alt={worldName}
            className="absolute inset-0 w-full h-full object-fill rounded-lg"
            draggable={false}
          />

          {/* Dev calibration UI */}
          {DEV_MODE && zoneConfig.calibrating && calibrationStep < STAGE_LABELS.length && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-black/85 text-yellow-300 text-sm font-bold px-4 py-2 rounded-lg z-50 pointer-events-none whitespace-nowrap">
              {STAGE_LABELS[calibrationStep]} ({calibrationStep + 1}/{STAGE_LABELS.length})
            </div>
          )}
          {DEV_MODE && zoneConfig.calibrating && calibrationStep >= STAGE_LABELS.length && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-black/85 text-green-400 text-sm font-bold px-4 py-2 rounded-lg z-50 pointer-events-none">
              ✅ Done! Check console for coordinates.
            </div>
          )}
          {DEV_MODE && calibrationPoints.map((pt, i) => (
            <div
              key={i}
              className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
              style={{ top: `${pt.top}%`, left: `${pt.left}%` }}
            >
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-white bg-black/70 px-1 rounded font-mono">{i + 1}</span>
            </div>
          ))}

          {/* Stage nodes */}
          {!zoneConfig.calibrating && zoneConfig.nodes.map((node: ZoneStageNode) => {
            const isStageUnlocked =
              currentWorldIndex < unlockedWorld ||
              (currentWorldIndex === unlockedWorld && node.stageIndex <= profile.currentStage);
            const stage = world.stages[node.stageIndex];
            const isBoss = stage?.type === 'mini-boss' || stage?.type === 'world-boss';

            return (
              <button
                key={node.stageIndex}
                onClick={() => isStageUnlocked && handleStageClick(node.stageIndex)}
                disabled={!isStageUnlocked}
                className="absolute -translate-x-1/2 -translate-y-1/2 group"
                style={{ top: `${node.top}%`, left: `${node.left}%` }}
              >
                <div
                  className={`
                    w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full
                    flex items-center justify-center
                    border-2 transition-all duration-200
                    ${isStageUnlocked
                      ? isBoss
                        ? 'bg-red-600/80 border-red-400 shadow-[0_0_14px_rgba(220,38,38,0.4)] cursor-pointer hover:scale-115 active:scale-95'
                        : 'bg-amber-700/80 border-amber-500 shadow-[0_0_10px_rgba(217,119,6,0.3)] cursor-pointer hover:scale-115 active:scale-95'
                      : 'bg-gray-800/60 border-gray-600/50 opacity-50 cursor-not-allowed'
                    }
                  `}
                >
                  {!isStageUnlocked ? (
                    <span className="text-xs sm:text-sm">🔒</span>
                  ) : isBoss ? (
                    <span className="text-sm sm:text-base">💀</span>
                  ) : (
                    <span className="text-xs sm:text-sm font-bold text-white">{node.stageIndex + 1}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
      {showStory && worldIntro && (
        <StoryDialog story={worldIntro} onComplete={() => setShowStory(false)} />
      )}
    </div>
  );
}
