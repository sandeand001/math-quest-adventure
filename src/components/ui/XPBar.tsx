interface XPBarProps {
  xp: number;
  xpToNext: number;
  level: number;
}

export function XPBar({ xp, xpToNext, level }: XPBarProps) {
  const pct = Math.min((xp / xpToNext) * 100, 100);

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-bold text-yellow-400 shrink-0">
        Lv.{level}
      </span>
      <div className="flex-1 h-3 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
        <div
          className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-gray-400 shrink-0 tabular-nums">
        {xp}/{xpToNext}
      </span>
    </div>
  );
}
