import type { CrystalId } from '../../types';
import { getCrystal } from '../../data/crystals';

interface CrystalTrackerProps {
  collectedCrystals: CrystalId[];
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_MAP = { sm: 14, md: 20, lg: 28 };

export function CrystalTracker({ collectedCrystals, size = 'md' }: CrystalTrackerProps) {
  const px = SIZE_MAP[size];

  if (collectedCrystals.length === 0) return null;

  // Only show crystals the player has actually collected
  const collectedDefs = collectedCrystals
    .map((id) => getCrystal(id))
    .filter(Boolean);

  return (
    <div className="flex gap-1 items-center">
      {collectedDefs.map((crystal) => (
        <svg
          key={crystal!.id}
          width={px}
          height={px}
          viewBox="0 0 24 24"
          className="drop-shadow-sm transition-all duration-200"
          role="img"
          aria-label={crystal!.name}
        >
          <title>{crystal!.name}</title>
          <polygon
            points="12,2 22,10 12,22 2,10"
            fill={crystal!.color}
            stroke={crystal!.color}
            strokeWidth="1"
          />
          <polygon
            points="12,4 19,10 12,19 5,10"
            fill="rgba(255,255,255,0.25)"
          />
          <line x1="12" y1="2" x2="12" y2="10" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
          <line x1="2" y1="10" x2="22" y2="10" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
        </svg>
      ))}
    </div>
  );
}
