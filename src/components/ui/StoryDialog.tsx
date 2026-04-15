import { useState } from 'react';
import type { StoryEntry } from '../../data/stories';

interface StoryDialogProps {
  story: StoryEntry;
  onComplete: () => void;
}

/**
 * Determine Pip's sprite based on the story trigger and line content.
 * Uses trigger context first (most reliable), then falls back to specific mentions.
 */
function getPipSprite(story: StoryEntry, line: string): string {
  const trigger = story.trigger;
  const l = line.toLowerCase();

  // ── Trigger-based (highest priority — we know exactly what's happening) ──

  // Boss intros: Pip is scared/nervous or battle-ready
  if (trigger === 'boss-intro' || trigger === 'mini-boss-intro') {
    if (l.includes('ready') || l.includes('take it') || l.includes('let\'s') || l.includes('can do'))
      return '/assets/characters/pip/battle-ready.png';
    return '/assets/characters/pip/scared.png';
  }

  // Boss victories: Pip is excited/celebrating
  if (trigger === 'boss-victory' || trigger === 'world-complete') {
    if (l.includes('miss') || l.includes('gonna miss'))
      return '/assets/characters/pip/sad.png';
    return '/assets/characters/pip/excited.png';
  }

  // ── Line-content based (for world-intro and stage-intro) ──

  // Nervousness / fear (check before general excitement)
  if (l.includes('gulp') || l.includes('uh oh') || l.includes('shaking') || l.includes('trembl')
    || l.includes('nervous') || l.includes('not going to pretend'))
    return '/assets/characters/pip/scared.png';

  // Surprise / shock
  if (l.includes('whoa') || l.includes('wait.') || l.includes('what?!') || l.includes('!?'))
    return '/assets/characters/pip/surprised.png';

  // Determination / battle readiness
  if (l.includes('let\'s do this') || l.includes('let\'s go') || l.includes('let\'s give')
    || l.includes('onward') || l.includes('get in there') || l.includes('finish this'))
    return '/assets/characters/pip/battle-ready.png';

  // Thinking / tips / realization
  if (l.includes('realized') || l.includes('trick') || l.includes('here\'s') || l.includes('tip')
    || l.includes('secret') || l.includes('remember'))
    return '/assets/characters/pip/thinking.png';

  // Explicit snacking (only when Pip is actually eating, not "defeat" or "great")
  if (l.includes('snacking while you work') || l.includes('berries so') || l.includes('munching'))
    return '/assets/characters/pip/eating.png';

  // Excitement (after checks that might catch false positives)
  if (l.includes('we did it') || l.includes('ha!') || l.includes('how cool')
    || l.includes('new skill') || l.includes('level'))
    return '/assets/characters/pip/excited.png';

  // Sadness (only explicit sadness, not "I miss" in a positive context)
  if (l.includes('we lost') || l.includes('too strong'))
    return '/assets/characters/pip/sad.png';

  // Default: happy
  return '/assets/characters/pip/happy.png';
}

/**
 * Determine Professor Hoot's sprite based on trigger and content.
 */
function getHootSprite(story: StoryEntry, line: string): string {
  const trigger = story.trigger;
  const l = line.toLowerCase();

  // Victory / celebration
  if (trigger === 'boss-victory' || trigger === 'world-complete') {
    if (l.includes('careful') || l.includes('warned') || l.includes('be warned'))
      return '/assets/characters/professor-hoot/concerned.png';
    return '/assets/characters/professor-hoot/celebrating.png';
  }

  // Boss intro warnings
  if (trigger === 'boss-intro' || trigger === 'mini-boss-intro')
    return '/assets/characters/professor-hoot/concerned.png';

  // Content-based
  if (l.includes('proud') || l.includes('remarkable') || l.includes('well done')
    || l.includes('so proud') || l.includes('watching your progress'))
    return '/assets/characters/professor-hoot/proud.png';

  if (l.includes('warned') || l.includes('careful') || l.includes('danger')
    || l.includes('afraid') || l.includes('terrible news'))
    return '/assets/characters/professor-hoot/concerned.png';

  return '/assets/characters/professor-hoot/wise.png';
}

/** Get sprite path for any speaker */
function getSpriteForLine(story: StoryEntry, line: string): string | null {
  if (!story.speaker) return null;
  if (story.speaker === 'Pip') return getPipSprite(story, line);
  if (story.speaker === 'Professor Hoot') return getHootSprite(story, line);
  return null;
}

export function StoryDialog({ story, onComplete }: StoryDialogProps) {
  const [lineIndex, setLineIndex] = useState(0);

  const currentLine = story.lines[lineIndex];
  const isLast = lineIndex >= story.lines.length - 1;
  const spriteSrc = getSpriteForLine(story, currentLine);
  const isBossSpeaker = !(story.speaker === 'Pip' || story.speaker === 'Professor Hoot') && story.speaker;

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setLineIndex((i) => i + 1);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 cursor-pointer select-none flex flex-col"
      onClick={handleNext}
    >
      {/* Top spacer + centered character sprite */}
      <div className="flex-1 flex items-end justify-center pointer-events-none">
        {spriteSrc && (
          <img
            src={spriteSrc}
            alt={story.speaker ?? ''}
            className="w-44 h-44 sm:w-56 sm:h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.5)] animate-[slideUp_0.3s_ease-out]"
          />
        )}
      </div>

      {/* Full-width text panel at bottom */}
      <div className="w-full px-3 pb-3 animate-[slideUp_0.3s_ease-out]">
        <div className="max-w-2xl mx-auto bg-[#1a1530]/95 border border-indigo-700/40 rounded-2xl px-5 py-4 shadow-2xl backdrop-blur-sm">
          {/* Speaker name + portrait */}
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

          {/* Dialog text */}
          <p className="text-white text-base sm:text-lg leading-relaxed min-h-[2.5rem] whitespace-pre-line">
            {currentLine}
          </p>

          {/* Progress bar */}
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
  );
}
