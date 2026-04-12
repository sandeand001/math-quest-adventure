import { useState, useRef } from 'react';
import { useGameStore, useActiveProfile } from '../../store/gameStore';
import { WORLDS } from '../../data/worlds';
import { getTheme } from '../../data/themes';
import { OVERWORLD_NODES, OVERWORLD_MAP_IMAGE } from '../../data/mapConfig';
import { XPBar } from '../ui/XPBar';
import { HeartsBar } from '../ui/HeartsBar';

const DEV_MODE = import.meta.env.DEV; // coordinate picker only in dev

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

  const [calibrationStep, setCalibrationStep] = useState(0);
  const [calibrationPoints, setCalibrationPoints] = useState<{ top: number; left: number }[]>([]);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const CALIBRATION_LABELS = [
    '📍 Click TOP-LEFT corner of the image',
    '📍 Click TOP-RIGHT corner of the image',
    '📍 Click BOTTOM-LEFT corner of the image',
    '📍 Click BOTTOM-RIGHT corner of the image',
    '📍 Click location 1: Emerald Forest',
    '📍 Click location 2: Crystal Caves',
    '📍 Click location 3: Mystic Meadows',
    '📍 Click location 4: Ironforge Mountains',
    '📍 Click location 5: Shadow Swamp',
    '📍 Click location 6: Enchanted Ruins',
    '📍 Click location 7: Sky Citadel',
    '📍 Click location 8: Dragon\'s Peak',
    '🛒 Click location 9: Shop (forest clearing)',
  ];

  const handleCalibrationClick = (e: React.MouseEvent) => {
    if (!DEV_MODE || calibrationStep >= CALIBRATION_LABELS.length) return;
    const rect = mapContainerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const left = Math.round(((e.clientX - rect.left) / rect.width) * 1000) / 10;
    const top = Math.round(((e.clientY - rect.top) / rect.height) * 1000) / 10;
    const point = { top, left };

    const newPoints = [...calibrationPoints, point];
    setCalibrationPoints(newPoints);

    const label = CALIBRATION_LABELS[calibrationStep];
    console.log(`${label} → top: ${top}%, left: ${left}%`);

    const nextStep = calibrationStep + 1;
    setCalibrationStep(nextStep);

    // After all 13 clicks, output the final config
    if (nextStep === CALIBRATION_LABELS.length) {
      console.log('\n✅ CALIBRATION COMPLETE — Copy this into mapConfig.ts:\n');
      console.log('Corners:', JSON.stringify(newPoints.slice(0, 4), null, 2));
      const locations = newPoints.slice(4, 12);
      const shopPoint = newPoints[12];
      const names = ['Emerald Forest', 'Crystal Caves', 'Mystic Meadows', 'Ironforge Mountains', 'Shadow Swamp', 'Enchanted Ruins', 'Sky Citadel', "Dragon's Peak"];
      console.log('\nexport const OVERWORLD_NODES: MapNode[] = [');
      locations.forEach((p, i) => {
        console.log(`  { worldIndex: ${i}, name: '${names[i]}', top: ${p.top}, left: ${p.left} },`);
      });
      console.log('];');
      console.log(`\nexport const SHOP_NODE = { name: 'Shop', top: ${shopPoint.top}, left: ${shopPoint.left} };`);
    }
  };

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

      {/* Map area — nodes positioned relative to the image via inline aspect-ratio container */}
      <div className="flex-1 overflow-auto flex items-center justify-center bg-[#2a1f14] p-1">
        <div
          ref={mapContainerRef}
          className="relative w-full max-w-[1920px]"
          style={{ aspectRatio: '16 / 9' }}
          onClick={DEV_MODE ? handleCalibrationClick : undefined}
        >
          {/* Map image fills this container exactly */}
          <img
            src={OVERWORLD_MAP_IMAGE}
            alt="Fantasy World Map"
            className="absolute inset-0 w-full h-full object-fill rounded-lg"
            draggable={false}
          />

          {/* Dev mode: calibration UI */}
          {DEV_MODE && calibrationStep < CALIBRATION_LABELS.length && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-black/85 text-yellow-300 text-sm font-bold px-4 py-2 rounded-lg z-50 pointer-events-none whitespace-nowrap">
              {CALIBRATION_LABELS[calibrationStep]} ({calibrationStep + 1}/{CALIBRATION_LABELS.length})
            </div>
          )}
          {DEV_MODE && calibrationStep >= CALIBRATION_LABELS.length && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-black/85 text-green-400 text-sm font-bold px-4 py-2 rounded-lg z-50 pointer-events-none">
              ✅ Done! Check browser console for coordinates.
            </div>
          )}

          {/* Dev mode: show all clicked points */}
          {DEV_MODE && calibrationPoints.map((pt, i) => (
            <div
              key={i}
              className={`absolute w-4 h-4 rounded-full border-2 border-white -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none ${i < 4 ? 'bg-blue-500' : 'bg-red-500'}`}
              style={{ top: `${pt.top}%`, left: `${pt.left}%` }}
            >
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-white bg-black/70 px-1 rounded font-mono">
                {i < 4 ? `C${i + 1}` : i - 3}
              </span>
            </div>
          ))}
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
  );
}
