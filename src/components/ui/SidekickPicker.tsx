import type { SidekickId } from '../../types';
import { SIDEKICKS } from '../../data/sidekicks';

interface SidekickPickerProps {
  unlockedSidekicks: SidekickId[];
  activeSidekick: SidekickId | null;
  onSelect: (id: SidekickId | null) => void;
}

export function SidekickPicker({ unlockedSidekicks, activeSidekick, onSelect }: SidekickPickerProps) {
  if (unlockedSidekicks.length === 0) {
    return (
      <div className="text-center text-gray-500 text-xs py-3">
        <p>🔒 Defeat mini-bosses to unlock sidekicks!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-xs text-gray-400">Sidekick</label>
      <div className="flex flex-wrap gap-2">
        {/* None option */}
        <button
          type="button"
          onClick={() => onSelect(null)}
          className={`
            w-14 h-14 rounded-xl flex items-center justify-center text-lg transition-all
            ${activeSidekick === null
              ? 'bg-indigo-600 ring-2 ring-indigo-400'
              : 'bg-indigo-900/40 hover:bg-indigo-800/60'}
          `}
        >
          ✖️
        </button>

        {SIDEKICKS.map((sidekick) => {
          const unlocked = unlockedSidekicks.includes(sidekick.id);
          const active = activeSidekick === sidekick.id;

          return (
            <button
              key={sidekick.id}
              type="button"
              disabled={!unlocked}
              onClick={() => onSelect(sidekick.id)}
              title={unlocked ? sidekick.name : `🔒 Defeat ${sidekick.name} to unlock`}
              className={`
                w-14 h-14 rounded-xl overflow-hidden transition-all relative
                ${active
                  ? 'ring-2 ring-yellow-400 scale-110'
                  : unlocked
                    ? 'ring-1 ring-white/20 hover:ring-indigo-400 hover:scale-105'
                    : 'opacity-30 grayscale cursor-not-allowed'}
              `}
            >
              <img
                src={`${sidekick.spritePath}/base-position.png`}
                alt={sidekick.name}
                className="w-full h-full object-cover"
              />
              {!unlocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-lg">
                  🔒
                </div>
              )}
            </button>
          );
        })}
      </div>

      {activeSidekick && (
        <p className="text-xs text-indigo-300">
          {SIDEKICKS.find((s) => s.id === activeSidekick)?.description}
        </p>
      )}
    </div>
  );
}
