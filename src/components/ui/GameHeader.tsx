import { useGameStore, useActiveProfile } from '../../store/gameStore';
import { XPBar } from './XPBar';
import { HeartsBar } from './HeartsBar';
import { CrystalTracker } from './CrystalTracker';

/**
 * Persistent game header bar shown on all in-game screens.
 * Displays player name, level, XP, hearts, crystals, coins, and action buttons.
 */
export function GameHeader() {
  const { screen, setScreen, muted, toggleMute } = useGameStore();
  const profile = useActiveProfile();

  // Don't show on auth/login/profile-select screens
  if (!profile || screen === 'login' || screen === 'profile-select' || screen === 'parent-dashboard') {
    return null;
  }

  return (
    <header className="flex items-center gap-3 sm:gap-4 px-3 sm:px-5 py-3 sm:py-4 bg-black/30 border-b border-white/5 shrink-0 z-40">
      {/* Back button */}
      <button
        onClick={() => {
          if (screen === 'world-map') {
            setScreen('profile-select');
          } else if (screen === 'zone-map' || screen === 'shop' || screen === 'inventory' || screen === 'daily-challenge') {
            setScreen('world-map');
          } else if (screen === 'stage' || screen === 'boss-fight' || screen === 'remedial') {
            useGameStore.getState().resetStage();
            setScreen('zone-map');
          } else if (screen === 'stage-result') {
            setScreen('zone-map');
          }
        }}
        className="text-gray-300 hover:text-white transition-colors text-base sm:text-lg font-medium shrink-0"
      >
        ←
      </button>

      {/* Player info — name, level, XP bar */}
      <div className="flex-1 min-w-0">
        <XPBar
          xp={profile.stats.xp}
          xpToNext={profile.stats.xpToNextLevel}
          level={profile.stats.level}
          name={profile.name}
          equippedCosmetics={profile.equippedCosmetics ?? null}
          size="lg"
        />
      </div>

      {/* Hearts */}
      <HeartsBar current={profile.stats.hp} max={profile.stats.maxHp} size="lg" />

      {/* Crystals */}
      <CrystalTracker collectedCrystals={profile.collectedCrystals ?? []} size="lg" />

      {/* Coins */}
      <span className="text-yellow-400 text-lg sm:text-xl font-bold shrink-0">🪙 {profile.stats.coins}</span>

      {/* Action buttons */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <button
          onClick={() => setScreen('inventory')}
          className="text-xl sm:text-2xl hover:opacity-80 transition-opacity"
          title="Inventory"
          aria-label="Open inventory"
        >
          🎒
        </button>
        <button
          onClick={() => setScreen('daily-challenge')}
          className="text-xl sm:text-2xl hover:opacity-80 transition-opacity"
          title="Daily Challenge"
          aria-label="Daily challenge"
        >
          🌟
        </button>
        <button
          onClick={toggleMute}
          className="text-xl sm:text-2xl hover:opacity-80 transition-opacity"
          title={muted ? 'Unmute' : 'Mute'}
          aria-label={muted ? 'Unmute sound' : 'Mute sound'}
        >
          {muted ? '🔇' : '🔊'}
        </button>
        <button
          onClick={() => setScreen('parent-dashboard')}
          className="text-lg sm:text-xl text-amber-200/40 hover:text-amber-200 transition-colors"
          aria-label="Parent dashboard"
        >
          📊
        </button>
      </div>
    </header>
  );
}
