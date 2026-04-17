import type { EquippedCosmetics } from '../../types';
import { getCosmetic } from '../../data/cosmetics';

interface XPBarProps {
  xp: number;
  xpToNext: number;
  level: number;
  name?: string;
  equippedCosmetics?: EquippedCosmetics | null;
}

export function XPBar({ xp, xpToNext, level, name, equippedCosmetics }: XPBarProps) {
  const pct = Math.min((xp / xpToNext) * 100, 100);

  const bgCosmetic = equippedCosmetics?.background ? getCosmetic(equippedCosmetics.background) : null;
  const npCosmetic = equippedCosmetics?.nameplate ? getCosmetic(equippedCosmetics.nameplate) : null;
  const ncCosmetic = equippedCosmetics?.nameplateColor ? getCosmetic(equippedCosmetics.nameplateColor) : null;
  const nfCosmetic = equippedCosmetics?.nameplateFont ? getCosmetic(equippedCosmetics.nameplateFont) : null;

  const bgIsWorldImage = bgCosmetic?.cssClass?.startsWith('avatar-bg-world-');
  const bgImageUrl = bgIsWorldImage ? bgCosmetic?.preview : null;
  const bgClass = !bgIsWorldImage ? bgCosmetic?.cssClass : null;

  return (
    <div className="relative rounded-lg overflow-hidden border border-white/10">
      {/* Background — world image */}
      {bgImageUrl && (
        <img src={bgImageUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
      )}
      {/* Background — gradient */}
      {bgClass && !bgImageUrl && (
        <div className={`absolute inset-0 ${bgClass} opacity-30`} />
      )}
      {/* Default dark bg when no cosmetic */}
      {!bgCosmetic && <div className="absolute inset-0 bg-black/20" />}

      <div className="relative px-3 py-1.5 flex items-center gap-3">
        {/* Name with nameplate */}
        {name && (
          <div className={`shrink-0 ${npCosmetic?.cssClass ?? ''}`}>
            <span className={`text-sm font-bold ${ncCosmetic?.cssClass ?? 'text-white'} ${nfCosmetic?.cssClass ?? ''}`}>
              {name}
            </span>
          </div>
        )}

        {/* Level badge */}
        <span className="text-xs font-bold text-yellow-400 shrink-0">
          Lv.{level}
        </span>

        {/* XP bar */}
        <div className="flex-1 h-3 bg-gray-800/60 rounded-full overflow-hidden border border-gray-700/50">
          <div
            className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* XP numbers */}
        <span className="text-xs text-gray-300 shrink-0 tabular-nums">
          {xp}/{xpToNext}
        </span>
      </div>
    </div>
  );
}
