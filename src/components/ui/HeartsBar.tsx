interface HeartsBarProps {
  current: number;
  max: number;
  color?: 'red' | 'green';
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_MAP = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

const COLOR_MAP = {
  red: 'bg-gradient-to-b from-red-400 to-red-600',
  green: 'bg-gradient-to-b from-emerald-400 to-emerald-600',
};

export function HeartsBar({
  current,
  max,
  color = 'red',
  size = 'md',
}: HeartsBarProps) {
  return (
    <div className="flex gap-1.5 items-center">
      {Array.from({ length: max }, (_, i) => (
        <div
          key={i}
          className={`
            ${SIZE_MAP[size]} rounded-sm -skew-x-6 transition-all duration-200
            ${i < current ? COLOR_MAP[color] + ' shadow-md' : 'bg-gray-700/50 opacity-50'}
          `}
        />
      ))}
    </div>
  );
}
