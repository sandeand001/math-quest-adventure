import type { Operation } from '../../../types';

interface ColumnLayoutProps {
  a: number;
  b: number;
  operation: Operation; // 'addition' | 'subtraction'
  stepIndex: number;    // which step we're on (drives what's highlighted/visible)
  completedAnswers: Map<number, number>;
  inputStepIndex: number | null; // step index that's currently awaiting input, or null
}

/**
 * Visual column-method layout for multi-digit addition/subtraction.
 * A single persistent illustration that highlights and fills in progressively.
 */
export function ColumnLayout({ a, b, operation, stepIndex, completedAnswers }: ColumnLayoutProps) {
  const isAdd = operation === 'addition';
  const sym = isAdd ? '+' : '−';

  const onesA = a % 10, onesB = b % 10;
  const tensA = Math.floor(a / 10), tensB = Math.floor(b / 10);

  // Addition carry logic
  const onesSum = onesA + onesB;
  const carry = isAdd && onesSum >= 10 ? 1 : 0;

  // Subtraction borrow logic
  const needsBorrow = !isAdd && onesA < onesB;
  const borrowedOnesA = needsBorrow ? onesA + 10 : onesA;
  const borrowedTensA = needsBorrow ? tensA - 1 : tensA;

  // Figure out which interactive steps map to ones/tens answers
  // Step 0 is always info ("start with ones")
  // For addition: step 1 = ones interactive, then step 2 or 3 = tens interactive
  // For subtraction: borrow adds an info step

  const onesInteractiveIdx = needsBorrow ? 2 : 1; // after borrow info
  const tensInteractiveIdx = needsBorrow ? 3 : (carry ? 3 : 2);

  const onesAnswer = completedAnswers.get(onesInteractiveIdx);
  const tensAnswer = completedAnswers.get(tensInteractiveIdx);

  // Highlighting: ones phase vs tens phase
  const pastOnes = stepIndex > onesInteractiveIdx;
  const inTensPhase = stepIndex >= tensInteractiveIdx - (carry || needsBorrow ? 1 : 0);
  const inOnesPhase = !pastOnes;

  const answer = isAdd ? a + b : a - b;
  const isComplete = tensAnswer !== undefined;

  return (
    <div className="flex flex-col items-center justify-center h-full select-none">
      <div className="relative font-mono text-4xl sm:text-5xl leading-relaxed tracking-widest">
        {/* Top number (a) */}
        <div className="flex justify-end gap-0">
          <span className="w-12 text-center relative">
            {needsBorrow && pastOnes ? (
              <>
                <span className="text-red-400 line-through opacity-50 text-2xl absolute -top-1 left-0 w-full text-center">{tensA + 1}</span>
                <span className="text-yellow-300">{borrowedTensA}</span>
              </>
            ) : (
              <span className={inTensPhase && !isComplete ? 'text-yellow-300' : 'text-white'}>{tensA}</span>
            )}
          </span>
          <span className="w-12 text-center relative">
            {needsBorrow && pastOnes ? (
              <>
                <span className="text-red-400 line-through opacity-50 text-2xl absolute -top-1 left-0 w-full text-center">{onesA}</span>
                <span className="text-yellow-300">{borrowedOnesA}</span>
              </>
            ) : (
              <span className={inOnesPhase ? 'text-yellow-300' : 'text-white'}>{onesA}</span>
            )}
          </span>
        </div>

        {/* Operator + bottom number (b) */}
        <div className="flex justify-end gap-0">
          <span className="w-12 text-center text-indigo-400">{sym}</span>
          <span className={`w-12 text-center ${inTensPhase && !isComplete ? 'text-yellow-300' : 'text-white/70'}`}>{tensB}</span>
          <span className={`w-12 text-center ${inOnesPhase ? 'text-yellow-300' : 'text-white/70'}`}>{onesB}</span>
        </div>

        {/* Divider line */}
        <div className="border-b-2 border-white/40 my-1" style={{ width: `${3 * 48}px` }} />

        {/* Answer row */}
        <div className="flex justify-end gap-0">
          {/* Hundreds if needed */}
          {answer >= 100 && (
            <span className="w-12 text-center">
              {isComplete ? <span className="text-emerald-400">{Math.floor(answer / 100)}</span> : <span className="opacity-0">0</span>}
            </span>
          )}
          {/* Tens digit */}
          <span className="w-12 text-center">
            {tensAnswer !== undefined ? (
              <span className="text-emerald-400 animate-[fadeIn_0.3s_ease-out]">{tensAnswer}</span>
            ) : (
              <span className="text-gray-600">_</span>
            )}
          </span>
          {/* Ones digit */}
          <span className="w-12 text-center">
            {onesAnswer !== undefined ? (
              <span className="text-emerald-400 animate-[fadeIn_0.3s_ease-out]">{isAdd ? onesSum % 10 : borrowedOnesA - onesB}</span>
            ) : (
              <span className="text-gray-600">_</span>
            )}
          </span>
        </div>

        {/* Carry indicator */}
        {carry === 1 && onesAnswer !== undefined && (
          <div className="absolute -top-7 right-0 text-lg text-amber-400 font-bold animate-[fadeIn_0.3s_ease-out]">
            <span className="bg-amber-900/40 rounded-full w-7 h-7 inline-flex items-center justify-center text-sm">1</span>
          </div>
        )}
      </div>
    </div>
  );
}
