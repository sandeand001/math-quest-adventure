import { useState, useCallback, useEffect, useRef } from 'react';
import type { Question } from '../../types';

interface QuestionCardProps {
  question: Question;
  onAnswer: (userAnswer: number, isCorrect: boolean) => void;
  streak: number;
}

export function QuestionCard({ question, onAnswer, streak }: QuestionCardProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus the input for non-multiple-choice questions. This is a DOM-side
  // effect (focusing an element), not a state reset, so an effect is appropriate.
  useEffect(() => {
    if (question.format !== 'multiple-choice') {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [question.id, question.format]);

  const submitAnswer = useCallback(
    (userAnswer: number) => {
      const isCorrect = userAnswer === question.answer;
      setFeedback(isCorrect ? 'correct' : 'wrong');

      // Brief delay so the child can see the feedback
      setTimeout(() => {
        onAnswer(userAnswer, isCorrect);
      }, 800);
    },
    [question.answer, onAnswer],
  );

  const handleChoiceClick = (choice: number) => {
    if (feedback !== null) return; // already answered
    setSelected(choice);
    submitAnswer(choice);
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback !== null) return;
    const num = parseInt(inputValue, 10);
    if (isNaN(num)) return;
    submitAnswer(num);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto" role="region" aria-label="Math question">
      {/* Streak indicator */}
      {streak >= 3 && (
        <div className="text-sm font-bold text-orange-400 animate-pulse">
          🔥 {streak} streak!{streak >= 10 ? ' ×3 XP!' : streak >= 5 ? ' ×2 XP!' : ''}
        </div>
      )}

      {/* Word problem */}
      {question.wordProblem && (
        <div className="bg-indigo-950/60 border border-indigo-800/40 rounded-2xl p-4 text-center text-base leading-relaxed">
          {question.wordProblem}
        </div>
      )}

      {/* Equation display — hidden for word problems (kids must figure out the operation) */}
      {!question.wordProblem && (
        <div
          className={`
            text-4xl font-bold tracking-wider text-center py-4 transition-colors duration-300
            ${feedback === 'correct' ? 'text-emerald-400' : ''}
            ${feedback === 'wrong' ? 'text-red-400' : ''}
            ${feedback === null ? 'text-white' : ''}
          `}
          aria-label={`Solve: ${question.displayEquation}`}
        >
          {question.displayEquation}
        </div>
      )}

      {/* Feedback message */}
      {feedback && (
        <div
          role="status"
          aria-live="polite"
          className={`text-lg font-bold ${
            feedback === 'correct' ? 'text-emerald-400' : 'text-red-400'
          }`}
        >
          {feedback === 'correct' ? '✓ Correct!' : `✗ The answer was ${question.answer}`}
        </div>
      )}

      {/* Multiple choice answers */}
      {question.format === 'multiple-choice' && question.choices && (
        <div className="grid grid-cols-2 gap-3 w-full" role="group" aria-label="Answer choices">
          {question.choices.map((choice) => {
            let btnClass =
              'py-4 px-6 rounded-xl text-xl font-bold border-2 transition-all duration-200 cursor-pointer ';

            if (feedback !== null) {
              if (choice === question.answer) {
                btnClass += 'bg-emerald-600/30 border-emerald-500 text-emerald-300';
              } else if (choice === selected) {
                btnClass += 'bg-red-600/30 border-red-500 text-red-300';
              } else {
                btnClass += 'bg-gray-800/50 border-gray-700 text-gray-500';
              }
            } else {
              btnClass +=
                'bg-indigo-950/60 border-indigo-700/50 text-white hover:bg-indigo-900/60 hover:border-indigo-500 active:scale-95';
            }

            return (
              <button
                key={choice}
                className={btnClass}
                onClick={() => handleChoiceClick(choice)}
                disabled={feedback !== null}
                aria-label={`Answer: ${choice}`}
              >
                {choice}
              </button>
            );
          })}
        </div>
      )}

      {/* Fill-in-the-blank input */}
      {question.format !== 'multiple-choice' && (
        <form onSubmit={handleInputSubmit} className="flex gap-3 w-full max-w-xs">
          <label htmlFor="answer-input" className="sr-only">Your answer</label>
          <input
            id="answer-input"
            ref={inputRef}
            type="number"
            inputMode="numeric"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={feedback !== null}
            autoFocus
            className="
              flex-1 px-4 py-3 text-2xl text-center font-bold
              bg-indigo-950/60 border-2 border-indigo-700/50 rounded-xl text-white
              focus:outline-none focus:border-indigo-400
              disabled:opacity-50
            "
            placeholder="?"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={feedback !== null || inputValue === ''}
            className="
              px-6 py-3 rounded-xl text-lg font-bold
              bg-indigo-600 hover:bg-indigo-500 text-white
              disabled:opacity-40 disabled:cursor-not-allowed
              transition-colors active:scale-95
            "
          >
            Go
          </button>
        </form>
      )}
    </div>
  );
}
