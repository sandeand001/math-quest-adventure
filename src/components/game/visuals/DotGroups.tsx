interface DotGroupsProps {
  groups: number;       // total groups
  perGroup: number;     // dots per group
  stepIndex: number;
  completedAnswers: Map<number, number>;
  isDivision: boolean;
}

/**
 * Visual dot groups for multiplication (building groups) and division (removing groups).
 * Groups appear one at a time with a running total.
 */
export function DotGroups({ groups, perGroup, stepIndex, isDivision }: DotGroupsProps) {
  // Step 0: info intro, Step 1: info (group 1 shown), Step 2+: interactive (group 2+)
  const visibleGroups = Math.max(0, Math.min(stepIndex, groups));

  // Running total for visible groups
  let runningTotal = 0;
  for (let g = 0; g < visibleGroups; g++) {
    runningTotal += perGroup;
  }

  // For division: show all dots initially, circle/remove groups
  const totalDots = groups * perGroup;

  return (
    <div className="flex flex-col items-center justify-center h-full px-4 select-none gap-4">
      {isDivision ? (
        // Division: pool of dots, groups get circled
        <div className="flex flex-col items-center gap-3">
          <div className="flex flex-wrap justify-center gap-1.5 max-w-xs">
            {Array.from({ length: totalDots }, (_, i) => {
              const groupIndex = Math.floor(i / perGroup);
              const isGrouped = groupIndex < visibleGroups;
              // Color by group
              const colors = ['bg-blue-400', 'bg-emerald-400', 'bg-amber-400', 'bg-pink-400', 'bg-purple-400', 'bg-cyan-400', 'bg-orange-400', 'bg-red-400', 'bg-lime-400', 'bg-indigo-400'];
              const color = isGrouped ? colors[groupIndex % colors.length] : 'bg-white/40';

              return (
                <div
                  key={i}
                  className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full transition-all duration-300 ${color} ${
                    isGrouped ? 'scale-90 ring-2 ring-white/20' : ''
                  }`}
                />
              );
            })}
          </div>
          {/* Group counter */}
          <div className="text-sm text-gray-300">
            <span className="text-emerald-400 font-bold text-lg">{visibleGroups}</span>
            <span className="mx-1">groups of</span>
            <span className="text-yellow-300 font-bold">{perGroup}</span>
            {visibleGroups > 0 && (
              <span className="text-gray-500 ml-2">({totalDots - runningTotal} remaining)</span>
            )}
          </div>
        </div>
      ) : (
        // Multiplication: groups appear one at a time
        <div className="flex flex-col items-center gap-3">
          <div className="flex flex-wrap justify-center gap-3 max-w-sm">
            {Array.from({ length: visibleGroups }, (_, g) => {
              const colors = ['bg-blue-400', 'bg-emerald-400', 'bg-amber-400', 'bg-pink-400', 'bg-purple-400', 'bg-cyan-400', 'bg-orange-400', 'bg-red-400', 'bg-lime-400', 'bg-indigo-400'];
              const color = colors[g % colors.length];
              const isNew = g === visibleGroups - 1;

              return (
                <div
                  key={g}
                  className={`flex flex-wrap gap-1 p-2 rounded-lg border transition-all duration-300 ${
                    isNew ? 'border-yellow-400/50 bg-yellow-900/20 animate-[fadeIn_0.3s_ease-out]' : 'border-white/10 bg-white/5'
                  }`}
                  style={{ width: `${Math.min(perGroup, 5) * 28 + 16}px` }}
                >
                  {Array.from({ length: perGroup }, (_, d) => (
                    <div key={d} className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full ${color}`} />
                  ))}
                </div>
              );
            })}
          </div>
          {/* Running total */}
          {visibleGroups > 0 && (
            <div className="text-sm text-gray-300">
              <span className="text-yellow-300 font-bold">{visibleGroups}</span>
              <span className="mx-1">{visibleGroups === 1 ? 'group' : 'groups'} × </span>
              <span className="text-yellow-300 font-bold">{perGroup}</span>
              <span className="mx-1">=</span>
              <span className="text-emerald-400 font-bold text-lg">{runningTotal}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
