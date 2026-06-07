interface NumberLineProps {
  start: number;
  end: number;        // the target landing number
  hopSize: number;    // how far each hop goes (1 for counting, N for skip-count)
  totalHops: number;
  stepIndex: number;
  completedAnswers: Map<number, number>;
  direction: 'forward' | 'backward';
}

/**
 * Visual number line with animated hops.
 * Used for counting (add/sub tier 1-2) and skip-counting (mul/div tier 6+).
 */
export function NumberLine({ start, end, hopSize, totalHops, stepIndex, completedAnswers, direction }: NumberLineProps) {
  // How many hops are visible (completed + current if info)
  // Step 0 is always info ("start at X"), step 1+ are hops
  const visibleHops = Math.min(stepIndex, totalHops);

  // Build hop positions
  const hops: { from: number; to: number; label: string; visible: boolean; answered: boolean }[] = [];
  for (let i = 0; i < totalHops; i++) {
    const from = direction === 'forward' ? start + i * hopSize : start - i * hopSize;
    const to = direction === 'forward' ? from + hopSize : from - hopSize;
    const visible = i < visibleHops;
    const answered = completedAnswers.has(i + 1); // step indices are 1-based for hops
    hops.push({ from, to, label: String(to), visible, answered });
  }

  // Number line range
  const low = Math.min(start, end) - 1;
  const high = Math.max(start, end) + 1;
  const range = high - low;

  const toPercent = (n: number) => ((n - low) / range) * 100;

  return (
    <div className="flex flex-col items-center justify-center h-full px-4 select-none">
      <div className="w-full max-w-md relative" style={{ height: '180px' }}>
        {/* The line */}
        <div className="absolute bottom-12 left-0 right-0 h-0.5 bg-white/30" />

        {/* Tick marks and numbers along the line */}
        {Array.from({ length: range + 1 }, (_, i) => {
          const n = low + i;
          const pct = toPercent(n);
          const isStart = n === start;
          const isEnd = n === end;
          const isLanding = hops.some(h => h.visible && h.to === n);

          // Only show start, end, and landing ticks to avoid clutter
          if (!isStart && !isEnd && !isLanding && n !== low && n !== high) return null;

          return (
            <div
              key={n}
              className="absolute bottom-8 flex flex-col items-center"
              style={{ left: `${pct}%`, transform: 'translateX(-50%)' }}
            >
              <div className={`w-0.5 h-3 ${isStart || isEnd ? 'bg-yellow-400' : 'bg-white/30'}`} />
              <span className={`text-xs mt-0.5 tabular-nums ${
                isStart ? 'text-yellow-400 font-bold' :
                isEnd && hops[hops.length - 1]?.answered ? 'text-emerald-400 font-bold' :
                isLanding ? 'text-emerald-400' :
                'text-gray-500'
              }`}>
                {n}
              </span>
            </div>
          );
        })}

        {/* Hops (arcs) */}
        {hops.map((hop, i) => {
          if (!hop.visible) return null;
          const fromPct = toPercent(hop.from);
          const toPct = toPercent(hop.to);
          const leftPct = Math.min(fromPct, toPct);
          const widthPct = Math.abs(toPct - fromPct);

          return (
            <div
              key={i}
              className="absolute bottom-12 animate-[fadeIn_0.3s_ease-out]"
              style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
            >
              {/* Arc */}
              <svg viewBox="0 0 100 40" className="w-full" style={{ height: '40px', marginBottom: '-2px' }}>
                <path
                  d={`M 0 40 Q 50 -10 100 40`}
                  fill="none"
                  stroke={hop.answered ? '#34d399' : '#818cf8'}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
              {/* Landing number at the top of the arc */}
              {hop.answered && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-xs font-bold text-emerald-400 bg-emerald-900/40 rounded-full px-1.5">
                  {hop.to}
                </div>
              )}
            </div>
          );
        })}

        {/* Start marker */}
        <div
          className="absolute bottom-12 w-3 h-3 rounded-full bg-yellow-400 border-2 border-yellow-300 -translate-x-1/2"
          style={{ left: `${toPercent(start)}%`, marginBottom: '-6px' }}
        />
      </div>
    </div>
  );
}
