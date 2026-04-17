import { useState } from 'react';
import { useGameStore, useActiveProfile } from '../../store/gameStore';
import { AVATARS, STARTER_AVATARS } from '../../data/avatars';
import { getCosmeticsByCategory } from '../../data/cosmetics';
import { SIDEKICKS, getSidekick } from '../../data/sidekicks';
import { CRYSTALS } from '../../data/crystals';
import { AvatarDisplay } from '../ui/AvatarDisplay';
import type { CosmeticCategory, EquippedCosmetics } from '../../types';

type InventoryTab = 'avatars' | 'sidekicks' | 'nameplates' | 'colors' | 'fonts' | 'backgrounds' | 'effects' | 'crystals';

const TABS: { id: InventoryTab; label: string; icon: string }[] = [
  { id: 'avatars', label: 'Heroes', icon: '🧑' },
  { id: 'sidekicks', label: 'Pets', icon: '🐾' },
  { id: 'nameplates', label: 'Plates', icon: '📛' },
  { id: 'colors', label: 'Colors', icon: '🎨' },
  { id: 'fonts', label: 'Fonts', icon: '🔤' },
  { id: 'backgrounds', label: 'Bgs', icon: '🌄' },
  { id: 'effects', label: 'Effects', icon: '✨' },
  { id: 'crystals', label: 'Crystals', icon: '💎' },
];

const CATEGORY_MAP: Record<string, CosmeticCategory> = {
  nameplates: 'nameplate',
  colors: 'nameplate-color',
  fonts: 'nameplate-font',
  backgrounds: 'background',
  effects: 'effect',
};

const EQUIP_KEY_MAP: Record<string, keyof EquippedCosmetics> = {
  nameplate: 'nameplate',
  'nameplate-color': 'nameplateColor',
  'nameplate-font': 'nameplateFont',
  background: 'background',
  effect: 'effect',
};

export function Inventory() {
  const {
    setScreen,
    updateProfile,
    equipCosmetic,
    setActiveSidekick,
  } = useGameStore();
  const profile = useActiveProfile();
  const [activeTab, setActiveTab] = useState<InventoryTab>('avatars');
  const [message, setMessage] = useState<string | null>(null);

  if (!profile) {
    setScreen('profile-select');
    return null;
  }

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 2000);
  };

  // Owned avatars = starters + purchased + currently equipped (legacy)
  const ownedAvatarIds = new Set([
    ...STARTER_AVATARS.map((a) => a.id),
    ...(profile.purchasedAvatars ?? []),
    ...(profile.avatarId ? [profile.avatarId] : []),
  ]);

  const ownedCosmeticIds = new Set(profile.purchasedCosmetics ?? []);
  const collectedCrystalIds = new Set(profile.collectedCrystals ?? []);

  const cosmeticCategory = CATEGORY_MAP[activeTab];
  const allCosmeticsForTab = cosmeticCategory ? getCosmeticsByCategory(cosmeticCategory) : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 p-4">
      <div className="max-w-lg mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setScreen('world-map')}
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            ← Back
          </button>
          <h1 className="text-xl font-bold text-white">Inventory</h1>
          <div className="w-12" /> {/* Spacer for alignment */}
        </div>

        {/* Avatar preview */}
        <div className="flex justify-center py-2">
          <AvatarDisplay
            avatarId={profile.avatarId ?? null}
            name={profile.name}
            equippedCosmetics={profile.equippedCosmetics ?? null}
            sidekick={profile.activeSidekick ?? null}
            collectedCrystals={profile.collectedCrystals ?? []}
          />
        </div>

        {/* Toast message */}
        {message && (
          <div className="text-center text-sm font-medium text-yellow-300 animate-pulse">
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                ${activeTab === tab.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-indigo-900/40 text-gray-400 hover:text-white'}
              `}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="bg-indigo-950/40 border border-indigo-800/30 rounded-2xl p-4">

          {/* ── Avatars ── */}
          {activeTab === 'avatars' && (
            <div className="space-y-3">
              <p className="text-xs text-gray-400">Tap an owned avatar to equip it.</p>
              <div className="grid grid-cols-3 gap-3">
                {AVATARS.map((avatar) => {
                  const owned = ownedAvatarIds.has(avatar.id);
                  const equipped = profile.avatarId === avatar.id;

                  return (
                    <button
                      key={avatar.id}
                      onClick={() => {
                        if (owned) {
                          updateProfile(profile.id, { avatarId: avatar.id });
                          showMessage(`Equipped ${avatar.name}!`);
                        }
                      }}
                      disabled={!owned}
                      className={`
                        relative rounded-xl overflow-hidden transition-all p-1.5
                        ${equipped
                          ? 'ring-2 ring-yellow-400 scale-105 bg-indigo-800/60'
                          : owned
                            ? 'bg-indigo-900/40 hover:bg-indigo-800/60 hover:scale-105'
                            : 'bg-indigo-950/40 cursor-not-allowed'}
                      `}
                    >
                      <div className="aspect-square rounded-lg overflow-hidden flex items-center justify-center">
                        <img
                          src={avatar.spritePath}
                          alt={owned ? avatar.name : '???'}
                          className={`w-full h-full object-contain ${!owned ? 'brightness-0 opacity-30' : ''}`}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.parentElement!.innerHTML = `<span class="text-2xl ${!owned ? 'opacity-30' : ''}">${owned ? '⚔️' : '❓'}</span>`;
                          }}
                        />
                      </div>
                      <p className="text-[10px] text-center text-gray-400 mt-0.5 truncate">
                        {owned ? avatar.name : '???'}
                      </p>
                      {!owned && (
                        <div className="absolute inset-0 flex items-center justify-center rounded-xl">
                          <span className="text-sm">🔒</span>
                        </div>
                      )}
                      {equipped && (
                        <div className="absolute top-0.5 right-0.5 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-[8px] font-bold">
                          ✓
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Sidekicks ── */}
          {activeTab === 'sidekicks' && (
            <div className="space-y-3">
              <p className="text-xs text-gray-400">Defeat mini-bosses to unlock sidekicks.</p>
              <div className="grid grid-cols-4 gap-2">
                {/* None option */}
                <button
                  onClick={() => {
                    setActiveSidekick(profile.id, null);
                    showMessage('Sidekick removed');
                  }}
                  className={`
                    aspect-square rounded-xl flex items-center justify-center text-lg transition-all
                    ${profile.activeSidekick === null
                      ? 'bg-indigo-600 ring-2 ring-indigo-400'
                      : 'bg-indigo-900/40 hover:bg-indigo-800/60'}
                  `}
                >
                  ✖️
                </button>
                {SIDEKICKS.map((sidekick) => {
                  const unlocked = (profile.unlockedSidekicks ?? []).includes(sidekick.id);
                  const active = profile.activeSidekick === sidekick.id;
                  return (
                    <button
                      key={sidekick.id}
                      disabled={!unlocked}
                      onClick={() => {
                        setActiveSidekick(profile.id, sidekick.id);
                        showMessage(`${sidekick.name} is now your sidekick!`);
                      }}
                      className={`
                        aspect-square rounded-xl overflow-hidden transition-all relative
                        ${active
                          ? 'ring-2 ring-yellow-400 scale-110'
                          : unlocked
                            ? 'ring-1 ring-white/20 hover:ring-indigo-400 hover:scale-105'
                            : 'cursor-not-allowed'}
                      `}
                    >
                      <img
                        src={`${sidekick.spritePath}/base-position.png`}
                        alt={unlocked ? sidekick.name : '???'}
                        className={`w-full h-full object-cover ${!unlocked ? 'brightness-0 opacity-30' : ''}`}
                      />
                      {!unlocked && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 text-sm">
                          🔒
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              {profile.activeSidekick && (
                <p className="text-xs text-indigo-300">
                  {getSidekick(profile.activeSidekick)?.description}
                </p>
              )}
            </div>
          )}

          {/* ── Crystals ── */}
          {activeTab === 'crystals' && (
            <div className="space-y-3">
              {collectedCrystalIds.size === 0 ? (
                <p className="text-gray-500 text-sm text-center py-6">
                  Defeat world bosses to discover magical crystals!
                </p>
              ) : (
                <>
                  <p className="text-xs text-gray-400">
                    Crystals collected: {collectedCrystalIds.size}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {CRYSTALS.filter((c) => collectedCrystalIds.has(c.id)).map((crystal) => (
                      <div
                        key={crystal.id}
                        className="rounded-xl p-3 flex flex-col items-center gap-2 bg-indigo-900/40 border border-indigo-700/30"
                      >
                        <div className="w-16 h-16 flex items-center justify-center">
                          <img
                            src={crystal.spritePath}
                            alt={crystal.name}
                            className="w-full h-full object-contain"
                            style={{ filter: `drop-shadow(0 0 8px ${crystal.color})` }}
                          />
                        </div>
                        <p className="text-xs font-medium text-center" style={{ color: crystal.color }}>
                          {crystal.name}
                        </p>
                        <p className="text-[10px] text-gray-500 text-center">{crystal.symbol}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── Cosmetic tabs (nameplates, colors, fonts, bgs, effects) ── */}
          {cosmeticCategory && (
            <div className="space-y-2">
              <p className="text-xs text-gray-400">Tap owned items to equip or unequip.</p>
              {allCosmeticsForTab.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">No items in this category yet.</p>
              ) : (
                allCosmeticsForTab.map((item) => {
                  const owned = ownedCosmeticIds.has(item.id);
                  const equipKey = EQUIP_KEY_MAP[item.category];
                  const equipped = equipKey ? profile.equippedCosmetics?.[equipKey] === item.id : false;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (owned && equipKey) {
                          const isEquipped = profile.equippedCosmetics?.[equipKey] === item.id;
                          equipCosmetic(profile.id, equipKey, isEquipped ? null : item.id);
                          showMessage(isEquipped ? `Unequipped ${item.name}` : `Equipped ${item.name}!`);
                        }
                      }}
                      disabled={!owned}
                      className={`
                        w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left
                        ${equipped
                          ? 'bg-indigo-700/50 ring-2 ring-yellow-400'
                          : owned
                            ? 'bg-indigo-900/40 hover:bg-indigo-800/50'
                            : 'bg-indigo-950/30 cursor-not-allowed'}
                      `}
                    >
                      {/* Preview */}
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
                        {!owned ? (
                          <span className="text-sm opacity-30">🔒</span>
                        ) : item.preview ? (
                          item.preview.startsWith('/') ? (
                            <img src={item.preview} alt="" className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <div className="w-full h-full rounded-lg" style={{ background: item.preview }} />
                          )
                        ) : (
                          <div className={`w-full h-full rounded-lg bg-indigo-800/60 ${item.cssClass ?? ''}`} />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${owned ? 'text-white' : 'text-gray-600'}`}>
                          {owned ? item.name : '???'}
                        </p>
                        {owned && (
                          <p className="text-[10px] text-gray-400 truncate">{item.description}</p>
                        )}
                      </div>

                      {/* Status */}
                      {equipped && (
                        <span className="text-xs text-yellow-400 font-bold shrink-0">Equipped</span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
