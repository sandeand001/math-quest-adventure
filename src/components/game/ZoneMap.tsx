import { useState, useRef, useEffect } from 'react';
import { useGameStore, useActiveProfile } from '../../store/gameStore';
import { WORLDS } from '../../data/worlds';
import { getTheme } from '../../data/themes';
import { ZONE_MAPS, type ZoneStageNode } from '../../data/mapConfig';
import { getStory } from '../../data/stories';
import { HeartsBar } from '../ui/HeartsBar';
import { StoryDialog } from '../ui/StoryDialog';

const DEV_MODE = import.meta.env.DEV;

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

  // If no zone map image configured yet, show a simple list fallback
  if (!zoneConfig?.image) {
    return (
      <div className="min-h-screen bg-[#2a1f14] flex flex-col">
        <header className="flex items-center gap-4 px-5 py-2 bg-black/40 border-b border-amber-900/30 shrink-0">
          <button onClick={() => setScreen('world-map')} className="text-amber-200/60 hover:text-amber-100 text-sm">
            ← World Map
          </button>
          <h1 className="flex-1 text-center text-lg font-bold text-amber-100">{worldName}</h1>
          <HeartsBar current={profile.stats.hp} max={profile.stats.maxHp} size="sm" />
        </header>
        <main className="flex-1 flex flex-col items-center justify-center gap-3 p-6">
          <p className="text-amber-200/50 text-sm mb-4">Zone map coming soon — select a stage:</p>
          <div className="flex flex-wrap gap-3 justify-center max-w-md">
            {world.stages.map((stage, stageIdx) => {
              const isStageUnlocked =
                currentWorldIndex < unlockedWorld ||
                (currentWorldIndex === unlockedWorld && stageIdx <= profile.currentStage);
              const isBoss = stage.type === 'mini-boss' || stage.type === 'world-boss';

              return (
                <button
                  key={stageIdx}
                  onClick={() => isStageUnlocked && handleStageClick(stageIdx)}
                  disabled={!isStageUnlocked}
                  className={`
                    w-14 h-14 rounded-xl flex items-center justify-center text-sm font-bold
                    border-2 transition-all
                    ${isStageUnlocked
                      ? isBoss
                        ? 'bg-red-600/40 border-red-500/60 text-red-200 hover:bg-red-600/60 cursor-pointer'
                        : 'bg-amber-800/40 border-amber-600/50 text-amber-100 hover:bg-amber-700/50 cursor-pointer'
                      : 'bg-gray-800/30 border-gray-700/30 text-gray-600 cursor-not-allowed'
                    }
                  `}
                >
                  {!isStageUnlocked ? '🔒' : isBoss ? '💀' : stageIdx + 1}
                </button>
              );
            })}
          </div>
        </main>
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
