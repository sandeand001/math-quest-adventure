import { useState, useRef, useEffect, useCallback } from 'react';
import type { Question } from '../../types';
import { buildGuidedSolve, type GuidedSolveData } from '../../engine/hintSteps';
import { ColumnLayout } from './visuals/ColumnLayout';
import { NumberLine } from './visuals/NumberLine';
import { DotGroups } from './visuals/DotGroups';

interface GuidedSolveProps {
  question: Question;
  onComplete: () => void;
}

/**
 * Full-screen visual workspace that walks the user through a similar practice
 * problem using an operation-specific illustration. The visual updates in place
 * as the user progresses — nothing disappears.
 */
export function GuidedSolve({ question, onComplete }: GuidedSolveProps) {
  const [data] = useState<GuidedSolveData>(() => buildGuidedSolve(question));
  const [stepIndex, setStepIndex] = useState(0);
  const [completedAnswers, setCompletedAnswers] = useState<Map<number, number>>(new Map());
  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { steps, visual, practiceA, practiceB, operation } = data;
  const step = steps[stepIndex];
  const isFinished = stepIndex >= steps.length;

  // Focus input on interactive steps
  useEffect(() => {
    if (step?.type === 'interactive' && feedback === null) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [stepIndex, step?.type, feedback]);

  const advance = useCallback(() => {
    setInputValue('');
    setFeedback(null);
    setStepIndex((s) => s + 1);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback !== null || !step) return;
    const num = parseInt(inputValue, 10);
    if (isNaN(num)) return;

    if (num === step.intermediateAnswer) {
      setFeedback('correct');
      setCompletedAnswers((prev) => new Map(prev).set(stepIndex, num));
      setTimeout(advance, 500);
    } else {
      setFeedback('wrong');
      setInputValue('');
      setTimeout(() => {
        setFeedback(null);
        inputRef.current?.focus();
      }, 400);
    }
  };

  // Operation symbol for header
  const opSym = { addition: '+', subtraction: '−', multiplication: '×', division: '÷' }[operation];

  // Number line params
  const nlStart = operation === 'subtraction' ? practiceA
    : operation === 'addition' ? Math.max(practiceA, practiceB)
    : 0;
  const nlEnd = operation === 'subtraction' ? data.practiceAnswer
    : operation === 'addition' ? data.practiceAnswer
    : data.practiceAnswer * practiceB; // mul/div: endpoint is the product/dividend
  const nlHopSize = operation === 'addition' || operation === 'subtraction'
    ? 1
    : operation === 'multiplication' ? Math.max(practiceA, practiceB) : practiceB;
  const nlHops = operation === 'addition' || operation === 'subtraction'
    ? Math.min(practiceA, practiceB)
    : operation === 'multiplication' ? Math.min(practiceA, practiceB) : data.practiceAnswer;
  const nlDir = operation === 'subtraction' ? 'backward' as const : 'forward' as const;

  // Dot group params
  const dgGroups = operation === 'division' ? data.practiceAnswer : Math.min(practiceA, practiceB);
  const dgPerGroup = operation === 'division' ? practiceB : Math.max(practiceA, practiceB);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gradient-to-b from-[#0c0e1a] via-indigo-950 to-[#0c0e1a]">
      {/* Top bar — step counter + problem */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-black/40 border-b border-indigo-800/30 shrink-0">
        <span className="text-xs text-gray-400">
          Practice: <span className="text-indigo-300 font-bold">{practiceA} {opSym} {practiceB} = ?</span>
        </span>
        <span className="text-xs text-gray-500 tabular-nums">
          {isFinished ? '✓' : `${stepIndex + 1}/${steps.length}`}
        </span>
      </div>

      {/* Visual area — THE FOCUS */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {visual === 'column' && (
          <ColumnLayout
            a={practiceA}
            b={practiceB}
            operation={operation}
            stepIndex={stepIndex}
            completedAnswers={completedAnswers}
            inputStepIndex={step?.type === 'interactive' ? stepIndex : null}
          />
        )}
        {visual === 'number-line' && (
          <NumberLine
            start={nlStart}
            end={operation === 'subtraction' ? nlEnd : (operation === 'addition' ? nlEnd : practiceA * practiceB === nlEnd ? nlEnd : nlEnd)}
            hopSize={nlHopSize}
            totalHops={nlHops}
            stepIndex={stepIndex}
            completedAnswers={completedAnswers}
            direction={nlDir}
          />
        )}
        {visual === 'dot-groups' && (
          <DotGroups
            groups={dgGroups}
            perGroup={dgPerGroup}
            stepIndex={stepIndex}
            completedAnswers={completedAnswers}
            isDivision={operation === 'division'}
          />
        )}
      </div>

      {/* Hoot + guidance — between visual and input, close to the action */}
      <div className="flex items-center gap-3 px-4 py-3 bg-black/20 shrink-0">
        <img
          src="/assets/characters/professor-hoot/wise.png"
          alt="Professor Hoot"
          className="w-16 h-16 sm:w-20 sm:h-20 object-contain shrink-0 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
        <p className="flex-1 text-sm sm:text-base text-white font-medium leading-snug">
          {isFinished
            ? 'Great work! Now try your question again.'
            : step!.text}
        </p>
      </div>

      {/* Footer — input or action */}
      <div className="px-4 py-3 bg-black/40 border-t border-indigo-800/30 shrink-0">
        {isFinished ? (
          <button
            onClick={onComplete}
            className="w-full py-3 rounded-xl text-base font-bold bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white transition-all active:scale-95"
          >
            Try Your Question →
          </button>
        ) : step!.type === 'interactive' ? (
          <div className="space-y-2">
            {feedback === 'wrong' && (
              <p className="text-center text-xs font-medium text-red-400">Not quite — try again!</p>
            )}
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                ref={inputRef}
                type="number"
                inputMode="numeric"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={feedback === 'correct'}
                className={`flex-1 px-4 py-3 text-xl text-center font-bold rounded-xl text-white focus:outline-none transition-colors ${
                  feedback === 'correct'
                    ? 'bg-emerald-900/40 border-2 border-emerald-500'
                    : feedback === 'wrong'
                      ? 'bg-red-900/30 border-2 border-red-500/50'
                      : 'bg-indigo-950/60 border-2 border-indigo-600/50 focus:border-indigo-400'
                }`}
                placeholder="?"
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={feedback !== null || inputValue === ''}
                className="px-6 py-3 rounded-xl text-base font-bold bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors active:scale-95"
              >
                Go
              </button>
            </form>
          </div>
        ) : (
          <button
            onClick={advance}
            className="w-full py-3 rounded-xl text-base font-bold bg-indigo-700/60 border border-indigo-600/40 text-white hover:bg-indigo-600/60 transition-all active:scale-95"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
}
