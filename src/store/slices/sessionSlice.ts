import type { GameSet, SessionSlice } from '../sliceTypes';

export function createSessionSlice(set: GameSet): SessionSlice {
  return {
    currentWorldIndex: 0,
    currentStageIndex: 0,
    setCurrentWorld: (world) => set({ currentWorldIndex: world }),
    setCurrentStage: (stage) => set({ currentStageIndex: stage }),

    questions: [],
    currentQuestionIndex: 0,
    correctCount: 0,
    streak: 0,
    stageStartTime: 0,

    setQuestions: (questions) =>
      set({
        questions,
        currentQuestionIndex: 0,
        correctCount: 0,
        streak: 0,
        stageStartTime: Date.now(),
      }),

    answerQuestion: (isCorrect) =>
      set((state) => ({
        correctCount: state.correctCount + (isCorrect ? 1 : 0),
        streak: isCorrect ? state.streak + 1 : 0,
      })),

    nextQuestion: () =>
      set((state) => ({ currentQuestionIndex: state.currentQuestionIndex + 1 })),

    resetStage: () =>
      set({
        questions: [],
        currentQuestionIndex: 0,
        correctCount: 0,
        streak: 0,
        stageStartTime: 0,
      }),

    stageResults: [],
    addStageResult: (result) =>
      set((state) => {
        const next = [...state.stageResults, result];
        const MAX_STAGE_RESULTS = 200;
        return {
          stageResults:
            next.length > MAX_STAGE_RESULTS
              ? next.slice(next.length - MAX_STAGE_RESULTS)
              : next,
        };
      }),

    consecutiveFailures: 0,
    recordFailure: () => set((state) => ({ consecutiveFailures: state.consecutiveFailures + 1 })),
    clearFailures: () => set({ consecutiveFailures: 0 }),
  };
}
