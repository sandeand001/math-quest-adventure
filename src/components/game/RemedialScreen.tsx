import { useState, useCallback } from 'react';
import { useGameStore } from '../../store/gameStore';
import { WORLDS } from '../../data/worlds';
import { getHootLesson } from '../../data/hootLessons';
import { generateStageQuestions } from '../../engine/questions';
import { QuestionCard } from './QuestionCard';
import { StoryDialog } from '../ui/StoryDialog';

const PRACTICE_COUNT = 5;
const PASS_THRESHOLD = 0.6; // 3/5 correct to pass practice

export function RemedialScreen() {
  const {
    currentWorldIndex,
    currentStageIndex,
    setScreen,
    resetStage,
    clearFailures,
    recordMastery,
  } = useGameStore();

  const world = WORLDS[currentWorldIndex];
  const stageDef = world?.stages[currentStageIndex];
  const tier = stageDef?.tier ?? 1;
  const lesson = getHootLesson(tier);

  const [phase, setPhase] = useState<'lesson' | 'practice' | 'done'>('lesson');
  const [questions] = useState(() =>
    generateStageQuestions(tier, PRACTICE_COUNT, Math.max(0.3, (stageDef?.difficulty ?? 1) - 0.3)),
  );
  const [questionIndex, setQuestionIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [slideState, setSlideState] = useState<'in' | 'out'>('in');

  const currentQuestion = questions[questionIndex];
  const practiceComplete = questionIndex >= questions.length;

  const handleAnswer = useCallback(
    (_userAnswer: number, isCorrect: boolean) => {
      if (isCorrect) setCorrectCount((c) => c + 1);
      if (currentQuestion) {
        recordMastery(currentQuestion.operation, currentQuestion.tier, isCorrect);
      }

      setTimeout(() => {
        setSlideState('out');
        setTimeout(() => {
          setQuestionIndex((i) => i + 1);
          setSlideState('in');
        }, 250);
      }, 600);
    },
    [currentQuestion, recordMastery],
  );

  // Practice finished
  if (phase === 'practice' && practiceComplete) {
    const passed = correctCount / PRACTICE_COUNT >= PASS_THRESHOLD;

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center p-6">
        <div className="bg-indigo-950/80 border border-indigo-800/40 rounded-3xl p-8 max-w-sm w-full text-center space-y-6">
          <img
            src="/assets/characters/professor-hoot/wise.png"
            alt="Professor Hoot"
            className="w-24 h-24 mx-auto object-contain drop-shadow-lg"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <h2 className="text-2xl font-bold text-white">
            {passed ? '🎓 Well Done!' : '📚 Keep Studying!'}
          </h2>
          <p className="text-gray-300">
            {passed
              ? `You got ${correctCount}/${PRACTICE_COUNT} correct! You're ready to try the stage again.`
              : `You got ${correctCount}/${PRACTICE_COUNT}. Let's review the lesson one more time.`}
          </p>

          {/* Tips reminder */}
          <div className="bg-indigo-900/40 rounded-xl p-4 text-left space-y-1">
            <p className="text-xs font-bold text-indigo-300 uppercase">Remember:</p>
            {lesson.tips.map((tip, i) => (
              <p key={i} className="text-sm text-gray-300">• {tip}</p>
            ))}
          </div>

          <button
            onClick={() => {
              if (passed) {
                clearFailures();
                resetStage();
                setScreen('stage');
              } else {
                // Reset practice for another round
                setPhase('lesson');
              }
            }}
            className="
              w-full py-3 rounded-xl text-lg font-bold
              bg-gradient-to-r from-indigo-600 to-blue-600
              hover:from-indigo-500 hover:to-blue-500
              text-white transition-all active:scale-95
            "
          >
            {passed ? 'Try Stage Again →' : 'Review Lesson'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative" style={{ background: '#0f1222' }}>
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url("${encodeURI(world?.background ?? '')}")` }}
      />

      {/* Hoot — always visible, large, bottom-left */}
      <div className="absolute bottom-4 left-2 z-20">
        <img
          src="/assets/characters/professor-hoot/wise.png"
          alt="Professor Hoot"
          className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 object-contain drop-shadow-[0_6px_20px_rgba(0,0,0,0.6)]"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      </div>

      {/* Strategy cards — positioned around the question area during practice */}
      {phase === 'practice' && lesson.strategies.length > 0 && (
        <>
          {/* Top-left strategy */}
          {lesson.strategies[0] && (
            <div className="absolute top-16 left-3 z-20 w-52 sm:w-60">
              <div className="bg-amber-950/85 border border-amber-600/40 rounded-xl p-3 backdrop-blur-sm">
                <p className="text-[11px] font-bold text-amber-300 mb-1">{lesson.strategies[0].title}</p>
                <p className="text-[11px] text-amber-100/90 leading-relaxed whitespace-pre-line">{lesson.strategies[0].body}</p>
              </div>
            </div>
          )}
          {/* Top-right strategy */}
          {lesson.strategies[1] && (
            <div className="absolute top-16 right-3 z-20 w-52 sm:w-60">
              <div className="bg-amber-950/85 border border-amber-600/40 rounded-xl p-3 backdrop-blur-sm">
                <p className="text-[11px] font-bold text-amber-300 mb-1">{lesson.strategies[1].title}</p>
                <p className="text-[11px] text-amber-100/90 leading-relaxed whitespace-pre-line">{lesson.strategies[1].body}</p>
              </div>
            </div>
          )}
          {/* Bottom-right strategy (above Hoot) */}
          {lesson.strategies[2] && (
            <div className="absolute bottom-4 right-3 z-20 w-52 sm:w-60">
              <div className="bg-amber-950/85 border border-amber-600/40 rounded-xl p-3 backdrop-blur-sm">
                <p className="text-[11px] font-bold text-amber-300 mb-1">{lesson.strategies[2].title}</p>
                <p className="text-[11px] text-amber-100/90 leading-relaxed whitespace-pre-line">{lesson.strategies[2].body}</p>
              </div>
            </div>
          )}
        </>
      )}

      <div className="relative z-10 flex flex-col flex-1">
        {/* Header */}
        <header className="flex items-center gap-4 px-5 py-3 bg-black/20">
          <button
            onClick={() => {
              resetStage();
              setScreen('zone-map');
            }}
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            ← Back
          </button>
          <h1 className="flex-1 text-center text-sm font-bold text-amber-200">
            📚 Practice with Professor Hoot
          </h1>
          {phase === 'practice' && (
            <span className="text-sm text-gray-400 tabular-nums">
              {questionIndex + 1}/{PRACTICE_COUNT}
            </span>
          )}
        </header>

        {/* Practice questions */}
        {phase === 'practice' && currentQuestion && (
          <main className="flex-1 flex items-center justify-center p-6">
            <div
              className={`w-full max-w-lg transition-all duration-250 ${
                slideState === 'in'
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 -translate-x-8'
              }`}
            >
              <QuestionCard
                key={currentQuestion.id}
                question={currentQuestion}
                onAnswer={handleAnswer}
                streak={0}
              />
            </div>
          </main>
        )}
      </div>

      {/* Lesson dialog */}
      {phase === 'lesson' && (
        <StoryDialog
          story={lesson.dialog}
          onComplete={() => setPhase('practice')}
        />
      )}
    </div>
  );
}
