import { useState } from 'react';
import type { StoryEntry } from '../../data/stories';

interface StoryDialogProps {
  story: StoryEntry;
  onComplete: () => void;
}

/** Map speaker names to sprite image paths and preferred positions */
const SPEAKER_SPRITES: Record<string, { src: string; side: 'left' | 'right' }> = {
  'Pip': { src: '/assets/characters/pip/happy.png', side: 'left' },
  'Professor Hoot': { src: '/assets/characters/professor-hoot/wise.png', side: 'right' },
};

/** Map speaker + line context to specific sprite variants */
function getSpriteForLine(speaker: string | undefined, line: string): string | null {
  if (!speaker) return null;

  if (speaker === 'Pip') {
    const l = line.toLowerCase();
    if (l.includes('scared') || l.includes('nervous') || l.includes('shaking') || l.includes('gulp') || l.includes('uh oh'))
      return '/assets/characters/pip/scared.png';
    if (l.includes('did it') || l.includes('ha!') || l.includes('woo') || l.includes('yea') || l.includes('cheering') || l.includes('victory') || l.includes('incredible'))
      return '/assets/characters/pip/excited.png';
    if (l.includes('hmm') || l.includes('realized') || l.includes('think') || l.includes('trick') || l.includes('tip'))
      return '/assets/characters/pip/thinking.png';
    if (l.includes('snack') || l.includes('berries') || l.includes('eat') || l.includes('food') || l.includes('marshmallow'))
      return '/assets/characters/pip/eating.png';
    if (l.includes('ready') || l.includes('let\'s go') || l.includes('let\'s do'))
      return '/assets/characters/pip/battle-ready.png';
    if (l.includes('sad') || l.includes('lost') || l.includes('miss'))
      return '/assets/characters/pip/sad.png';
    if (l.includes('wait') || l.includes('whoa') || l.includes('what') || l.includes('!?'))
      return '/assets/characters/pip/surprised.png';
    return '/assets/characters/pip/happy.png';
  }

  if (speaker === 'Professor Hoot') {
    const l = line.toLowerCase();
    if (l.includes('proud') || l.includes('remarkable') || l.includes('well done') || l.includes('incredible') || l.includes('did it'))
      return '/assets/characters/professor-hoot/proud.png';
    if (l.includes('warn') || l.includes('careful') || l.includes('danger') || l.includes('urgent') || l.includes('afraid'))
      return '/assets/characters/professor-hoot/concerned.png';
    if (l.includes('celebrat') || l.includes('saved') || l.includes('champion'))
      return '/assets/characters/professor-hoot/celebrating.png';
    return '/assets/characters/professor-hoot/wise.png';
  }

  return null;
}

export function StoryDialog({ story, onComplete }: StoryDialogProps) {
  const [lineIndex, setLineIndex] = useState(0);

  const currentLine = story.lines[lineIndex];
  const isLast = lineIndex >= story.lines.length - 1;
  const speakerConfig = story.speaker ? SPEAKER_SPRITES[story.speaker] : null;
  const side = speakerConfig?.side ?? 'left';
  const spriteSrc = getSpriteForLine(story.speaker, currentLine);
  const isBossSpeaker = !speakerConfig && story.speaker;

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setLineIndex((i) => i + 1);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 cursor-pointer select-none"
      onClick={handleNext}
    >
      {spriteSrc ? (
        /* ── Layout with character sprite: sprite left, dialog right ── */
        <div className="h-full flex flex-col sm:flex-row items-end sm:items-center">
          {/* Character sprite — large, left side */}
          <div
            className={`
              ${side === 'left' ? 'order-1' : 'order-2 sm:order-2'}
              flex-shrink-0 flex items-end justify-center
              w-full sm:w-2/5 pointer-events-none
              animate-[slideUp_0.3s_ease-out]
            `}
          >
            <img
              src={spriteSrc}
              alt={story.speaker ?? ''}
              className="w-40 h-40 sm:w-56 sm:h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
            />
          </div>

          {/* Dialog panel — right side on desktop, bottom on mobile */}
          <div
            className={`
              ${side === 'left' ? 'order-2' : 'order-1 sm:order-1'}
              flex-1 flex items-end sm:items-center justify-center
              px-3 pb-3 sm:pb-0 sm:pr-8
              animate-[slideUp_0.3s_ease-out]
            `}
          >
            <div className="w-full max-w-lg bg-[#1a1530]/95 border border-indigo-700/40 rounded-2xl px-5 py-4 shadow-2xl backdrop-blur-sm">
              {story.speaker && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                    {story.speaker}
                  </span>
                </div>
              )}
              <p className="text-white text-base sm:text-lg leading-relaxed min-h-[2.5rem] whitespace-pre-line">
                {currentLine}
              </p>
              <div className="flex items-center justify-between gap-3 mt-3">
                <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                    style={{ width: `${((lineIndex + 1) / story.lines.length) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-gray-400 shrink-0">
                  {isLast ? 'Tap to continue ▸' : `${lineIndex + 1}/${story.lines.length}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ── Layout without sprite (boss speakers): centered dialog ── */
        <div className="h-full flex items-end justify-center">
          <div className="w-full px-3 pb-3 animate-[slideUp_0.3s_ease-out]">
            <div className="max-w-2xl mx-auto bg-[#1a1530]/95 border border-indigo-700/40 rounded-2xl px-5 py-4 shadow-2xl backdrop-blur-sm">
              {story.speaker && (
                <div className="flex items-center gap-2 mb-2">
                  {isBossSpeaker && story.portrait && (
                    <span className="text-2xl">{story.portrait}</span>
                  )}
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                    {story.speaker}
                  </span>
                </div>
              )}
              <p className="text-white text-base sm:text-lg leading-relaxed min-h-[2.5rem] whitespace-pre-line">
                {currentLine}
              </p>
              <div className="flex items-center justify-between gap-3 mt-3">
                <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                    style={{ width: `${((lineIndex + 1) / story.lines.length) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-gray-400 shrink-0">
                  {isLast ? 'Tap to continue ▸' : `${lineIndex + 1}/${story.lines.length}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
