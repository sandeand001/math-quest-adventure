import { useState } from 'react';
import { useGameStore, useActiveProfile } from '../../store/gameStore';
import { AVATARS } from '../../data/avatars';
import { COSMETICS, getCosmeticsByCategory, isCosmeticUnlocked } from '../../data/cosmetics';
import { AvatarDisplay } from '../ui/AvatarDisplay';
import { AvatarGalleryPicker } from '../ui/AvatarGalleryPicker';
import { SidekickPicker } from '../ui/SidekickPicker';
import type { CosmeticCategory, EquippedCosmetics } from '../../types';

type ShopTab = 'avatars' | 'nameplates' | 'nameplate-colors' | 'nameplate-fonts' | 'backgrounds' | 'effects' | 'sidekicks';

const TABS: { id: ShopTab; label: string; icon: string }[] = [
  { id: 'avatars', label: 'Avatars', icon: '🧑' },
  { id: 'nameplates', label: 'Plates', icon: '📛' },
  { id: 'nameplate-colors', label: 'Colors', icon: '🎨' },
  { id: 'nameplate-fonts', label: 'Fonts', icon: '🔤' },
  { id: 'backgrounds', label: 'Bgs', icon: '🌄' },
  { id: 'effects', label: 'Effects', icon: '✨' },
  { id: 'sidekicks', label: 'Pets', icon: '🐾' },
];

const CATEGORY_MAP: Record<string, CosmeticCategory> = {
  nameplates: 'nameplate',
  'nameplate-colors': 'nameplate-color',
  'nameplate-fonts': 'nameplate-font',
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

export function Shop() {
  const {
    setScreen,
    updateProfile,
    purchaseItem,
    equipCosmetic,
    setActiveSidekick,
  } = useGameStore();
  const profile = useActiveProfile();
  const [activeTab, setActiveTab] = useState<ShopTab>('avatars');
  const [message, setMessage] = useState<string | null>(null);

  if (!profile) {
    setScreen('profile-select');
    return null;
  }

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 2000);
  };

  const handleBuyAvatar = (avatarId: string) => {
    const avatar = AVATARS.find((a) => a.id === avatarId);
    if (!avatar) return;

    if (avatar.starter) {
      // Starter avatar — just equip
      updateProfile(profile.id, { avatarId });
      showMessage(`Equipped ${avatar.name}!`);
      return;
    }

    if (profile.purchasedAvatars?.includes(avatarId)) {
      // Already owned — equip it
      updateProfile(profile.id, { avatarId });
      showMessage(`Equipped ${avatar.name}!`);
      return;
    }

    // Must be unlocked to purchase
    if (!(profile.unlockedAvatars ?? []).includes(avatarId)) {
      showMessage(`This avatar is still locked!`);
      return;
    }

    // Purchase
    const success = purchaseItem(profile.id, 'avatar', avatarId, avatar.cost);
    if (success) {
      updateProfile(profile.id, { avatarId });
      showMessage(`Purchased & equipped ${avatar.name}!`);
    } else {
      showMessage(`Not enough coins! Need ${avatar.cost} 🪙`);
    }
  };

  const handleBuyCosmetic = (itemId: string) => {
    const item = COSMETICS.find((c) => c.id === itemId);
    if (!item) return;

    const equipKey = EQUIP_KEY_MAP[item.category];
    if (!equipKey) return;

    if (profile.purchasedCosmetics?.includes(itemId)) {
      // Already owned — equip/unequip
      const isEquipped = profile.equippedCosmetics?.[equipKey] === itemId;
      equipCosmetic(profile.id, equipKey, isEquipped ? null : itemId);
      showMessage(isEquipped ? `Unequipped ${item.name}` : `Equipped ${item.name}!`);
      return;
    }

    // Check unlock condition
    if (!isCosmeticUnlocked(item, profile)) {
      showMessage(`🔒 ${item.name} is locked!`);
      return;
    }

    // Purchase
    const success = purchaseItem(profile.id, 'cosmetic', itemId, item.cost);
    if (success) {
      equipCosmetic(profile.id, equipKey, itemId);
      showMessage(`Purchased & equipped ${item.name}!`);
    } else {
      showMessage(`Not enough coins! Need ${item.cost} 🪙`);
    }
  };

  const cosmeticCategory = CATEGORY_MAP[activeTab];
  const cosmeticItems = cosmeticCategory ? getCosmeticsByCategory(cosmeticCategory) : [];

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
          <h1 className="text-xl font-bold text-white">Shop</h1>
          <div className="flex items-center gap-1 text-yellow-400 font-bold text-sm">
            <span>🪙</span>
            <span>{profile.stats.coins}</span>
          </div>
        </div>

        {/* Avatar preview */}
        <div className="flex justify-center py-2">
          <AvatarDisplay
            avatarId={profile.avatarId ?? null}
            name={profile.name}
            equippedCosmetics={profile.equippedCosmetics ?? null}
            sidekick={profile.activeSidekick ?? null}
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
          {activeTab === 'avatars' && (
            <AvatarGalleryPicker
              selectedId={profile.avatarId ?? null}
              ownedAvatars={[
                ...(profile.purchasedAvatars ?? []),
                ...(AVATARS.filter((a) => a.starter).map((a) => a.id)),
                ...(profile.avatarId ? [profile.avatarId] : []), // include currently equipped (legacy profiles)
              ]}
              unlockedAvatars={profile.unlockedAvatars ?? []}
              onSelect={(id) => {
                updateProfile(profile.id, { avatarId: id });
                showMessage(`Equipped!`);
              }}
              onBuy={handleBuyAvatar}
            />
          )}

          {activeTab === 'sidekicks' && (
            <SidekickPicker
              unlockedSidekicks={profile.unlockedSidekicks ?? []}
              activeSidekick={profile.activeSidekick ?? null}
              onSelect={(id) => setActiveSidekick(profile.id, id)}
            />
          )}

          {cosmeticCategory && (
            <div className="space-y-2">
              {cosmeticItems.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">No items available yet.</p>
              ) : (
                cosmeticItems.map((item) => {
                  const owned = profile.purchasedCosmetics?.includes(item.id);
                  const equipKey = EQUIP_KEY_MAP[item.category];
                  const equipped = equipKey ? profile.equippedCosmetics?.[equipKey] === item.id : false;
                  const unlocked = isCosmeticUnlocked(item, profile);
                  const canAfford = profile.stats.coins >= item.cost;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleBuyCosmetic(item.id)}
                      disabled={!owned && (!unlocked || !canAfford)}
                      className={`
                        w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left
                        ${equipped
                          ? 'bg-indigo-700/60 ring-1 ring-yellow-400'
                          : owned
                            ? 'bg-indigo-900/40 hover:bg-indigo-800/60'
                            : !unlocked
                              ? 'bg-indigo-950/30 opacity-50 cursor-not-allowed'
                              : canAfford
                                ? 'bg-indigo-900/30 hover:bg-indigo-800/50'
                                : 'bg-indigo-950/30 opacity-50 cursor-not-allowed'}
                      `}
                    >
                      {/* Preview swatch for backgrounds */}
                      {item.category === 'background' && item.cssClass && (
                        <div className={`w-10 h-10 rounded-lg ${item.cssClass}`} />
                      )}

                      {/* Nameplate preview */}
                      {item.category === 'nameplate' && (
                        <div className={`px-2 py-0.5 text-xs text-white ${item.cssClass ?? ''}`}>Abc</div>
                      )}

                      {/* Color preview */}
                      {item.category === 'nameplate-color' && (
                        <div
                          className={`w-8 h-8 rounded-full border border-white/20 ${item.cssClass ?? ''}`}
                          style={item.preview ? { backgroundColor: item.preview } : undefined}
                        />
                      )}

                      {/* Font preview */}
                      {item.category === 'nameplate-font' && (
                        <span className={`text-lg text-white ${item.cssClass ?? ''}`}>Aa</span>
                      )}

                      {/* Effect icon */}
                      {item.category === 'effect' && <span className="text-2xl">✨</span>}

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{item.name}</p>
                        <p className="text-xs text-gray-400 truncate">{item.description}</p>
                      </div>

                      <div className="flex-shrink-0 text-right">
                        {owned ? (
                          <span className={`text-xs font-bold ${equipped ? 'text-yellow-400' : 'text-green-400'}`}>
                            {equipped ? 'Equipped' : 'Owned'}
                          </span>
                        ) : !unlocked ? (
                          <span className="text-xs font-bold text-gray-500">🔒 Locked</span>
                        ) : (
                          <span className="text-xs font-bold text-yellow-400">{item.cost} 🪙</span>
                        )}
                      </div>
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
