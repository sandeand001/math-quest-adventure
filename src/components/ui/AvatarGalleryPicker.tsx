import { useState } from 'react';
import type { AvatarId, AvatarClass } from '../../types';
import { AVATARS } from '../../data/avatars';

const CLASS_LABELS: { id: AvatarClass | 'all'; label: string; icon: string }[] = [
  { id: 'all', label: 'All', icon: '⭐' },
  { id: 'starter', label: 'Starter', icon: '🌟' },
  { id: 'knight', label: 'Knight', icon: '⚔️' },
  { id: 'wizard', label: 'Wizard', icon: '🧙' },
  { id: 'ranger', label: 'Ranger', icon: '🏹' },
  { id: 'healer', label: 'Healer', icon: '✨' },
];

interface AvatarGalleryPickerProps {
  selectedId: AvatarId | null;
  ownedAvatars?: AvatarId[];          // purchased avatars
  unlockedAvatars?: AvatarId[];       // avatars unlocked for purchase (by world progression)
  onSelect: (id: AvatarId) => void;
  onBuy?: (id: AvatarId) => void;     // callback to purchase an avatar
}

export function AvatarGalleryPicker({
  selectedId,
  ownedAvatars = [],
  unlockedAvatars = [],
  onSelect,
  onBuy,
}: AvatarGalleryPickerProps) {
  const [activeClass, setActiveClass] = useState<AvatarClass | 'all'>('all');

  const displayAvatars = activeClass === 'all'
    ? AVATARS
    : AVATARS.filter((a) => a.class === activeClass);

  return (
    <div className="space-y-3">
      {/* Class tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {CLASS_LABELS.map((cl) => (
          <button
            key={cl.id}
            type="button"
            onClick={() => setActiveClass(cl.id)}
            className={`
              flex-1 min-w-[48px] py-2 rounded-lg text-xs font-medium transition-all
              ${activeClass === cl.id
                ? 'bg-indigo-600 text-white ring-2 ring-indigo-400'
                : 'bg-indigo-900/40 text-gray-300 hover:bg-indigo-800/60'}
            `}
          >
            {cl.icon} {cl.label}
          </button>
        ))}
      </div>

      {/* Avatar grid */}
      <div className="grid grid-cols-2 gap-3">
        {displayAvatars.map((avatar) => {
          const isStarter = avatar.starter;
          const isOwned = isStarter || ownedAvatars.includes(avatar.id);
          const isUnlocked = isStarter || unlockedAvatars.includes(avatar.id);
          const isSelected = selectedId === avatar.id;
          const canBuy = !isOwned && isUnlocked;
          const isLocked = !isOwned && !isUnlocked; // not yet unlocked — show silhouette

          return (
            <button
              key={avatar.id}
              type="button"
              onClick={() => {
                if (isOwned) {
                  onSelect(avatar.id);
                } else if (canBuy && onBuy) {
                  onBuy(avatar.id);
                }
              }}
              disabled={isLocked}
              className={`
                relative rounded-xl overflow-hidden transition-all p-2
                ${isSelected
                  ? 'ring-2 ring-yellow-400 scale-105 bg-indigo-800/60'
                  : isLocked
                    ? 'cursor-not-allowed bg-indigo-950/40'
                    : canBuy
                      ? 'bg-indigo-900/40 hover:bg-indigo-800/60 hover:scale-102 border border-yellow-600/30'
                      : 'bg-indigo-900/40 hover:bg-indigo-800/60 hover:scale-102'}
              `}
            >
              <div className="aspect-square rounded-lg overflow-hidden flex items-center justify-center">
                <img
                  src={avatar.spritePath}
                  alt={isLocked ? '???' : avatar.name}
                  className={`w-full h-full object-contain ${isLocked ? 'brightness-0 opacity-40' : ''}`}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const icon = CLASS_LABELS.find((c) => c.id === avatar.class)?.icon ?? '?';
                    target.parentElement!.innerHTML = `<span class="text-4xl ${isLocked ? 'opacity-30' : ''}">${isLocked ? '❓' : icon}</span>`;
                  }}
                />
              </div>
              <p className="text-xs text-center text-gray-300 mt-1 truncate">
                {isLocked ? '???' : avatar.name}
              </p>

              {/* Locked overlay — silhouette with lock */}
              {isLocked && (
                <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl">
                  <span className="text-lg">🔒</span>
                  <span className="text-[10px] text-gray-500">Locked</span>
                </div>
              )}

              {/* Unlocked but not purchased — show price */}
              {canBuy && (
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-6 bg-gradient-to-t from-black/60 to-transparent rounded-xl">
                  <span className="text-xs text-yellow-400 font-bold">{avatar.cost} 🪙</span>
                </div>
              )}

              {isSelected && (
                <div className="absolute top-1 right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-xs">
                  ✓
                </div>
              )}

              {isOwned && !isStarter && (
                <div className="absolute top-1 left-1 text-[10px] bg-green-600/80 text-white px-1 rounded">
                  Owned
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
