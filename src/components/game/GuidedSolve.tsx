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

/**
 * Full-screen overlay that walks the user through a similar practice problem
 * step by step, then dismisses so the original question can be retried.
 */
export function GuidedSolve({ question, onComplete }: GuidedSolveProps) {
  const [steps] = useState<HintStep[]>(() => {
    const practice = generatePracticeQuestion(question);
    // Build a minimal Question-shaped object for the step generator
    const practiceQ: Question = {
      ...question,
      id: 'practice',
      operandA: practice.a,
      operandB: practice.b,
      answer: practice.answer,
      operation: practice.operation,
      // Force fill-result so the walkthrough solves a straight equation
      format: question.format === 'word-problem' ? 'word-problem' : 'fill-result',
      blankPosition: 'result',
    };
    return generateHintSteps(practiceQ);
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [slideIn, setSlideIn] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const step = steps[currentStep];
  const isLastStep = currentStep >= steps.length;
  const totalSteps = steps.length;

  // Focus input on interactive steps
  useEffect(() => {
    if (step?.type === 'interactive' && feedback === null) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [currentStep, step?.type, feedback]);

  // Trigger slide-in animation on step change
  useEffect(() => {
    setSlideIn(false);
    const t = requestAnimationFrame(() => setSlideIn(true));
    return () => cancelAnimationFrame(t);
  }, [currentStep]);

  const advanceStep = () => {
    setInputValue('');
    setFeedback(null);
    if (currentStep + 1 >= totalSteps) {
      setCurrentStep(totalSteps); // triggers "done" state
    } else {
      setCurrentStep((s) => s + 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback !== null) return;
    const num = parseInt(inputValue, 10);
    if (isNaN(num)) return;

    if (num === step?.intermediateAnswer) {
      setFeedback('correct');
      setTimeout(advanceStep, 800);
    } else {
      setFeedback('wrong');
      setInputValue('');
      setTimeout(() => {
        setFeedback(null);
        inputRef.current?.focus();
      }, 600);
    }
  };

  // Render markdown-style bold (**text**)
  const renderText = (text: string) => {
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
  };

  const hootSprite = step
    ? `/assets/characters/professor-hoot/${step.character}.png`
    : '/assets/characters/professor-hoot/celebrating.png';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-gradient-to-b from-indigo-950 to-slate-950 border border-indigo-700/40 rounded-3xl p-5 max-w-md w-full mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-indigo-300">
            {isLastStep ? 'All done!' : `Step ${currentStep + 1} of ${totalSteps}`}
          </h2>
          <span className="text-xs text-gray-500">Professor Hoot</span>
        </div>

        {/* Hoot + speech bubble */}
        <div className="flex items-start gap-3 mb-5">
          <img
            src={hootSprite}
            alt="Professor Hoot"
            className="w-20 h-20 object-contain shrink-0 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />

          <div
            className={`flex-1 bg-indigo-900/50 border border-indigo-700/30 rounded-2xl rounded-bl-sm px-4 py-3 transition-all duration-200 ${
              slideIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            {isLastStep ? (
              <p className="text-sm text-white leading-relaxed">
                Great work! You learned the method. Now <span className="text-yellow-300 font-bold">try your question again!</span>
              </p>
            ) : (
              <p className="text-sm text-white leading-relaxed">
                {renderText(step!.text)}
              </p>
            )}
          </div>
        </div>

        {/* Interactive input or action buttons */}
        {isLastStep ? (
          <button
            onClick={onComplete}
            className="w-full py-3 rounded-xl text-base font-bold bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white transition-all active:scale-95"
          >
            Try Again →
          </button>
        ) : step!.type === 'interactive' ? (
          <div className="space-y-3">
            {feedback === 'correct' && (
              <div className="text-center text-sm font-bold text-emerald-400 animate-pulse">
                ✓ Correct!
              </div>
            )}
            {feedback === 'wrong' && (
              <div className="text-center text-sm font-bold text-red-400 animate-[shake_0.3s_ease-in-out]">
                Not quite — try again!
              </div>
            )}
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                ref={inputRef}
                type="number"
                inputMode="numeric"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={feedback === 'correct'}
                className="flex-1 px-4 py-3 text-xl text-center font-bold bg-indigo-950/60 border-2 border-indigo-700/50 rounded-xl text-white focus:outline-none focus:border-indigo-400 disabled:opacity-50"
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
            onClick={advanceStep}
            className="w-full py-3 rounded-xl text-base font-bold bg-indigo-700/60 border border-indigo-600/40 text-white hover:bg-indigo-600/60 transition-all active:scale-95"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
}
