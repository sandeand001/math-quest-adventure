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
    <header className="flex items-center gap-3 px-4 py-2.5 bg-black/50 backdrop-blur-sm border-b border-white/10 shrink-0 z-40">
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
        className="text-gray-300 hover:text-white transition-colors text-sm font-medium shrink-0"
      >
        ← Back
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
      <HeartsBar current={profile.stats.hp} max={profile.stats.maxHp} size="md" />

      {/* Crystals */}
      <CrystalTracker collectedCrystals={profile.collectedCrystals ?? []} size="md" />

      {/* Coins */}
      <span className="text-yellow-400 text-base font-bold shrink-0">🪙 {profile.stats.coins}</span>

      {/* Action buttons */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={() => setScreen('inventory')}
          className="text-lg hover:opacity-80 transition-opacity"
          title="Inventory"
          aria-label="Open inventory"
        >
          🎒
        </button>
        <button
          onClick={() => setScreen('daily-challenge')}
          className="text-lg hover:opacity-80 transition-opacity"
          title="Daily Challenge"
          aria-label="Daily challenge"
        >
          🌟
        </button>
        <button
          onClick={toggleMute}
          className="text-lg hover:opacity-80 transition-opacity"
          title={muted ? 'Unmute' : 'Mute'}
          aria-label={muted ? 'Unmute sound' : 'Mute sound'}
        >
          {muted ? '🔇' : '🔊'}
        </button>
        <button
          onClick={() => setScreen('parent-dashboard')}
          className="text-base text-amber-200/40 hover:text-amber-200 transition-colors"
          aria-label="Parent dashboard"
        >
          📊
        </button>
      </div>
    </header>
  );
}
