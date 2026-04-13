import { useState } from 'react';
import type { StoryEntry } from '../../data/stories';

interface StoryDialogProps {
  story: StoryEntry;
  onComplete: () => void;
}

export function StoryDialog({ story, onComplete }: StoryDialogProps) {
  const [lineIndex, setLineIndex] = useState(0);

  const currentLine = story.lines[lineIndex];
  const isLast = lineIndex >= story.lines.length - 1;

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setLineIndex((i) => i + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/60">
      <div
        className="
          w-full max-w-2xl bg-gradient-to-b from-[#1a1530]/98 to-[#0f0d20]/98
          border border-indigo-700/40
          rounded-2xl p-5 space-y-3 shadow-2xl
          animate-[slideUp_0.3s_ease-out]
          cursor-pointer select-none
        "
        onClick={handleNext}
      >
        {/* Speaker row */}
        {story.speaker && (
          <div className="flex items-center gap-2">
            {story.portrait && (
              <span className="text-3xl">{story.portrait}</span>
            )}
            <div className="bg-indigo-600/60 px-3 py-1 rounded-lg text-sm font-bold text-indigo-100">
              {story.speaker}
            </div>
          </div>
        )}

        {/* Dialog text */}
        <p className="text-white text-lg leading-relaxed min-h-[3.5rem] whitespace-pre-line">
          {currentLine}
        </p>

        {/* Progress bar + continue hint */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${((lineIndex + 1) / story.lines.length) * 100}%` }}
            />
          </div>
          <span className="text-xs text-gray-400 animate-pulse shrink-0">
            {isLast ? 'Tap to continue →' : `${lineIndex + 1}/${story.lines.length} ▸`}
          </span>
        </div>
      </div>
    </div>
  );
}
