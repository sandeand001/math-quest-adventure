interface HeartsBarProps {
  current: number;
  max: number;
  color?: 'red' | 'green';
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_MAP = {
  sm: 16,
  md: 24,
  lg: 32,
};

const FILL_MAP = {
  red: { filled: 'url(#heartGradRed)', empty: '#374151' },
  green: { filled: 'url(#heartGradGreen)', empty: '#374151' },
};

export function HeartsBar({
  current,
  max,
  color = 'red',
  size = 'md',
}: HeartsBarProps) {
  const px = SIZE_MAP[size];
  const fills = FILL_MAP[color];

  return (
    <div className="flex gap-1.5 items-center">
      <svg width={0} height={0} className="absolute">
        <defs>
          <linearGradient id="heartGradRed" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
          <linearGradient id="heartGradGreen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>
      </svg>
      {Array.from({ length: max }, (_, i) => {
        const active = i < current;
        return (
          <svg
            key={i}
            width={px}
            height={px}
            viewBox="0 0 24 24"
            className={`transition-all duration-200 ${active ? 'drop-shadow-md' : 'opacity-50'}`}
          >
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
                 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09
                 C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5
                 c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill={active ? fills.filled : fills.empty}
            />
          </svg>
        );
      })}
    </div>
  );
}
