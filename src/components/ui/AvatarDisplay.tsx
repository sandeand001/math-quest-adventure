import type { AvatarId, CrystalId, EquippedCosmetics, SidekickId } from '../../types';
import { getAvatar } from '../../data/avatars';
import { getCosmetic } from '../../data/cosmetics';
import { SIDEKICKS } from '../../data/sidekicks';
import { CRYSTALS } from '../../data/crystals';

interface AvatarDisplayProps {
  avatarId: AvatarId | null;
  name: string;
  equippedCosmetics?: EquippedCosmetics | null;
  sidekick?: SidekickId | null;
  collectedCrystals?: CrystalId[];
  size?: number; // px, default 400
  showBackground?: boolean; // show background cosmetic (only on profile select)
  className?: string;
}

export function AvatarDisplay({
  avatarId,
  name,
  equippedCosmetics,
  sidekick,
  collectedCrystals = [],
  size = 400,
  showBackground = false,
  className = '',
}: AvatarDisplayProps) {
  const avatarDef = avatarId ? getAvatar(avatarId) : null;
  const sidekickDef = sidekick ? SIDEKICKS.find((s) => s.id === sidekick) : null;

  const bgCosmetic = showBackground && equippedCosmetics?.background ? getCosmetic(equippedCosmetics.background) : null;
  const effectCosmetic = equippedCosmetics?.effect ? getCosmetic(equippedCosmetics.effect) : null;
  const npCosmetic = equippedCosmetics?.nameplate ? getCosmetic(equippedCosmetics.nameplate) : null;
  const ncCosmetic = equippedCosmetics?.nameplateColor ? getCosmetic(equippedCosmetics.nameplateColor) : null;
  const nfCosmetic = equippedCosmetics?.nameplateFont ? getCosmetic(equippedCosmetics.nameplateFont) : null;

  const bgClass = bgCosmetic?.cssClass ?? '';
  const bgIsWorldImage = bgCosmetic?.cssClass?.startsWith('avatar-bg-world-');
  const bgImageUrl = bgIsWorldImage ? bgCosmetic?.preview : null;

  const effectClass = effectCosmetic?.cssClass ?? '';
  const effectId = equippedCosmetics?.effect ?? '';

  const sidekickSize = size * 0.45;
  const isFlying = sidekickDef?.placement === 'flying';

  // Map effect IDs to unique shape renderers
  const renderEffect = () => {
    if (!effectClass) return null;

    const base: React.CSSProperties = {
      position: 'absolute',
      pointerEvents: 'none',
      top: -size * 0.08,
      left: -size * 0.08,
      right: -size * 0.08,
      bottom: -size * 0.08,
    };

    switch (effectId) {
      case 'effect-frost':
        return (
          <div className="effect-frost-shape" style={base}>
            <div className="fx-frost fx-frost-1" />
            <div className="fx-frost fx-frost-2" />
            <div className="fx-frost fx-frost-3" />
            <div className="fx-frost fx-frost-4" />
          </div>
        );
      case 'effect-lightning':
        return (
          <div className="effect-lightning-shape" style={base}>
            <div className="fx-bolt fx-bolt-1" />
            <div className="fx-bolt fx-bolt-2" />
            <div className="fx-bolt fx-bolt-3" />
          </div>
        );
      case 'effect-leaves':
        return (
          <div className="effect-leaves-shape" style={base}>
            <div className="fx-leaf fx-leaf-1" />
            <div className="fx-leaf fx-leaf-2" />
            <div className="fx-leaf fx-leaf-3" />
            <div className="fx-leaf fx-leaf-4" />
          </div>
        );
      case 'effect-shadow':
        return (
          <div className="effect-shadow-shape" style={base}>
            <div className="fx-wisp fx-wisp-1" />
            <div className="fx-wisp fx-wisp-2" />
            <div className="fx-wisp fx-wisp-3" />
          </div>
        );
      case 'effect-stars':
        return (
          <div className="effect-stars-shape" style={base}>
            <div className="fx-star fx-star-1" />
            <div className="fx-star fx-star-2" />
            <div className="fx-star fx-star-3" />
            <div className="fx-star fx-star-4" />
            <div className="fx-star fx-star-5" />
          </div>
        );
      case 'effect-rainbow':
        return (
          <div className="effect-rainbow-shape" style={base}>
            <div className="fx-ring fx-ring-1" />
            <div className="fx-ring fx-ring-2" />
            <div className="fx-ring fx-ring-3" />
          </div>
        );
      default:
        // Sparkle / Glow — enhanced circular aura
        return (
          <div
            className={`absolute rounded-full ${effectClass}`}
            style={{
              width: size * 0.9,
              height: size * 0.9,
              top: '5%',
              left: '5%',
              opacity: 0.8,
              pointerEvents: 'none',
            }}
          />
        );
    }
  };

  return (
    <div className={`relative inline-flex flex-col items-center ${className}`}>
      {/* Avatar + sidekick row */}
      <div className="relative flex items-end">
        {/* Avatar container */}
        <div
          className={`relative flex items-center justify-center ${bgClass && !bgImageUrl ? 'rounded-xl overflow-hidden' : ''}`}
          style={{ width: size, height: size, overflow: bgClass ? 'hidden' : 'visible' }}
        >
          {/* Background — gradient-based */}
          {bgClass && !bgImageUrl && <div className={`absolute inset-0 ${bgClass}`} />}

          {/* Background — world image-based */}
          {bgImageUrl && (
            <img
              src={bgImageUrl}
              alt="background"
              className="absolute inset-0 w-full h-full object-cover rounded-xl"
            />
          )}

          {/* Effect aura — unique shape per effect */}
          {renderEffect()}

          {/* Avatar image */}
          {avatarDef ? (
            <img
              src={avatarDef.spritePath}
              alt={`${name}'s avatar`}
              className="relative w-full h-full object-contain drop-shadow-[0_6px_20px_rgba(0,0,0,0.6)]"
            />
          ) : (
            <span className="relative text-white font-bold" style={{ fontSize: size * 0.4 }}>
              {name[0]?.toUpperCase()}
            </span>
          )}

          {/* Floating collected crystals orbiting around the avatar */}
          {collectedCrystals.length > 0 && (
            <div
              className="absolute pointer-events-none"
              style={{
                top: -size * 0.05,
                left: -size * 0.05,
                width: size * 1.1,
                height: size * 1.1,
              }}
            >
              {collectedCrystals.map((cId, idx) => {
                const crystal = CRYSTALS.find((c) => c.id === cId);
                if (!crystal) return null;
                const total = collectedCrystals.length;
                const angle = (360 / total) * idx - 90;
                const radius = size * 0.55;
                const crystalSize = Math.max(16, size * 0.1);
                return (
                  <img
                    key={cId}
                    src={crystal.miniSpritePath}
                    alt={crystal.name}
                    className="absolute"
                    style={{
                      width: crystalSize,
                      height: crystalSize,
                      objectFit: 'contain',
                      left: `calc(50% + ${Math.cos((angle * Math.PI) / 180) * radius}px - ${crystalSize / 2}px)`,
                      top: `calc(50% + ${Math.sin((angle * Math.PI) / 180) * radius}px - ${crystalSize / 2}px)`,
                      filter: `drop-shadow(0 0 4px ${crystal.color})`,
                      animation: `crystal-float ${3 + idx * 0.3}s ease-in-out infinite`,
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Sidekick — placed beside the avatar */}
        {sidekickDef && (
          <img
            src={`${sidekickDef.spritePath}/base-position.png`}
            alt={sidekickDef.name}
            className="drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]"
            style={{
              width: sidekickSize,
              height: sidekickSize,
              objectFit: 'contain',
              marginLeft: size * -0.1,
              alignSelf: isFlying ? 'flex-start' : 'flex-end',
              marginBottom: isFlying ? undefined : size * 0.02,
              marginTop: isFlying ? size * 0.05 : undefined,
            }}
          />
        )}
      </div>

      {/* Nameplate below avatar */}
      {size >= 48 && (
        <div className={`mt-1 ${npCosmetic?.cssClass ?? ''}`}>
          <span
            className={`text-[10px] font-medium truncate max-w-full ${ncCosmetic?.cssClass ?? 'text-gray-300'} ${nfCosmetic?.cssClass ?? ''}`}
          >
            {name}
          </span>
        </div>
      )}
    </div>
  );
}
