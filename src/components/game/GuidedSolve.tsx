import { useState, useRef, useEffect } from 'react';
import type { Question } from '../../types';
import {
  generatePracticeQuestion,
  generateHintSteps,
  type HintStep,
} from '../../engine/hintSteps';

interface GuidedSolveProps {
  question: Question;
  onComplete: () => void;
}

/** Render markdown-style bold (**text**) */
function renderText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <span key={i} className="text-yellow-300 font-bold">
          {part.slice(2, -2)}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

/**
 * Full-screen overlay that walks the user through a similar practice problem.
 * All steps are shown on a single cohesive screen — completed steps remain
 * visible with their answers, building up like working on a chalkboard.
 */
export function GuidedSolve({ question, onComplete }: GuidedSolveProps) {
  const [steps] = useState<HintStep[]>(() => {
    const practice = generatePracticeQuestion(question);
    const practiceQ: Question = {
      ...question,
      id: 'practice',
      operandA: practice.a,
      operandB: practice.b,
      answer: practice.answer,
      operation: practice.operation,
      format: question.format === 'word-problem' ? 'word-problem' : 'fill-result',
      blankPosition: 'result',
    };
    return generateHintSteps(practiceQ);
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [completedAnswers, setCompletedAnswers] = useState<Map<number, number>>(new Map());
  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isFinished = currentStep >= steps.length;

  // Focus input on interactive steps
  useEffect(() => {
    const step = steps[currentStep];
    if (step?.type === 'interactive' && feedback === null) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [currentStep, steps, feedback]);

  // Auto-scroll to current step
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [currentStep]);

  const advanceStep = () => {
    setInputValue('');
    setFeedback(null);
    setCurrentStep((s) => s + 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback !== null) return;
    const num = parseInt(inputValue, 10);
    if (isNaN(num)) return;
    const step = steps[currentStep];

    if (num === step?.intermediateAnswer) {
      setFeedback('correct');
      setCompletedAnswers((prev) => new Map(prev).set(currentStep, num));
      setTimeout(advanceStep, 600);
    } else {
      setFeedback('wrong');
      setInputValue('');
      setTimeout(() => {
        setFeedback(null);
        inputRef.current?.focus();
      }, 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gradient-to-b from-[#0c0e1a] via-indigo-950 to-[#0c0e1a]">
      {/* Header bar */}
      <div className="flex items-center gap-3 px-4 py-3 bg-black/30 border-b border-indigo-800/30 shrink-0">
        <img
          src="/assets/characters/professor-hoot/wise.png"
          alt="Professor Hoot"
          className="w-10 h-10 object-contain"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-bold text-white">Professor Hoot's Walkthrough</h2>
          <p className="text-xs text-indigo-300">Let's work through a similar problem together</p>
        </div>
        <span className="text-xs text-gray-500 tabular-nums shrink-0">
          {isFinished ? 'Done!' : `${currentStep + 1} / ${steps.length}`}
        </span>
      </div>

      {/* Scrollable working area — all steps visible, builds up like a worksheet */}
      <div ref={scrollRef} className="flex-1 overflow-auto px-4 py-4 space-y-3">
        {steps.map((s, idx) => {
          const isCompleted = idx < currentStep;
          const isCurrent = idx === currentStep && !isFinished;
          const isFuture = idx > currentStep;
          const completedAnswer = completedAnswers.get(idx);

          if (isFuture) return null;

          return (
            <div
              key={idx}
              className={`rounded-xl px-4 py-3 transition-all duration-300 ${
                isCurrent
                  ? 'bg-indigo-900/60 border border-indigo-600/50 shadow-lg shadow-indigo-900/30'
                  : 'bg-indigo-950/30 border border-indigo-800/20'
              }`}
            >
              {/* Step text */}
              <p className={`text-sm leading-relaxed ${isCompleted ? 'text-gray-400' : 'text-white'}`}>
                {renderText(s.text)}
              </p>

              {/* Completed interactive step — show the answer inline */}
              {isCompleted && s.type === 'interactive' && completedAnswer !== undefined && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-emerald-400 font-bold text-lg">{completedAnswer}</span>
                  <span className="text-emerald-400 text-xs">✓</span>
                </div>
              )}

              {/* Current interactive step — show the input */}
              {isCurrent && s.type === 'interactive' && (
                <div className="mt-3 space-y-2">
                  {feedback === 'wrong' && (
                    <p className="text-xs font-medium text-red-400">Not quite — try again!</p>
                  )}
                  <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                      ref={inputRef}
                      type="number"
                      inputMode="numeric"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      disabled={feedback === 'correct'}
                      className={`flex-1 px-3 py-2.5 text-xl text-center font-bold rounded-lg text-white focus:outline-none transition-colors ${
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
                      className="px-5 py-2.5 rounded-lg text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors active:scale-95"
                    >
                      Go
                    </button>
                  </form>
                </div>
              )}

              {/* Current info step — show "Next" inline */}
              {isCurrent && s.type === 'info' && (
                <button
                  onClick={advanceStep}
                  className="mt-3 px-4 py-2 rounded-lg text-xs font-bold bg-indigo-700/50 border border-indigo-600/30 text-indigo-200 hover:bg-indigo-600/50 transition-all active:scale-95"
                >
                  Next →
                </button>
              )}
            </div>
          );
        })}

        {/* Completion message */}
        {isFinished && (
          <div className="rounded-xl px-4 py-5 bg-emerald-900/30 border border-emerald-700/40 text-center space-y-3">
            <img
              src="/assets/characters/professor-hoot/celebrating.png"
              alt="Professor Hoot celebrating"
              className="w-16 h-16 object-contain mx-auto"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <p className="text-sm text-white font-medium">
              Great work! Now <span className="text-yellow-300 font-bold">try your question again.</span>
            </p>
          </div>
        )}
      </div>

      {/* Bottom action bar */}
      {isFinished && (
        <div className="px-4 py-3 bg-black/30 border-t border-indigo-800/30 shrink-0">
          <button
            onClick={onComplete}
            className="w-full py-3 rounded-xl text-base font-bold bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white transition-all active:scale-95"
          >
            Try Again →
          </button>
        </div>
      )}
    </div>
  );
}
