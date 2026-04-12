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
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/50">
      <div
        className="
          w-full max-w-2xl bg-[#1a1530]/95 border border-indigo-700/40
          rounded-2xl p-5 space-y-3 shadow-2xl
          animate-[slideUp_0.3s_ease-out]
        "
        onClick={handleNext}
      >
        {/* Speaker name */}
        {story.speaker && (
          <div className="inline-block bg-indigo-600/60 px-3 py-1 rounded-lg text-sm font-bold text-indigo-100">
            {story.speaker}
          </div>
        )}

        {/* Dialog text */}
        <p className="text-white text-lg leading-relaxed min-h-[3rem]">
          {currentLine}
        </p>

        {/* Progress dots + continue hint */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            {story.lines.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i <= lineIndex ? 'bg-indigo-400' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-400 animate-pulse">
            {isLast ? 'Tap to continue →' : 'Tap for next →'}
          </span>
        </div>
      </div>
    </div>
  );
}
