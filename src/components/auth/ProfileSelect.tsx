import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';

export function ProfileSelect() {
  const { profiles, setActiveProfile, setScreen, addProfile } = useGameStore();
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');

  const handleSelectProfile = (id: string) => {
    setActiveProfile(id);
    setScreen('world-map');
  };

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const profile = addProfile(newName.trim(), 'fantasy');
    setActiveProfile(profile.id);
    setNewName('');
    setShowCreate(false);
    setScreen('world-map');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">MathQuest</h1>
          <p className="text-gray-400">Who's playing today?</p>
        </div>

        {/* Existing profiles */}
        <div className="space-y-3">
          {profiles.map((profile) => (
            <button
              key={profile.id}
              onClick={() => handleSelectProfile(profile.id)}
              className="
                w-full flex items-center gap-4 p-4 rounded-2xl
                bg-indigo-950/60 border border-indigo-800/40
                hover:bg-indigo-900/60 hover:border-indigo-600
                transition-all active:scale-[0.98] text-left
              "
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white">
                {profile.name[0]}
              </div>
              <div className="flex-1">
                <p className="font-bold text-white">{profile.name}</p>
                <p className="text-xs text-gray-400">
                  Level {profile.stats.level} · World {profile.currentWorld + 1}
                </p>
              </div>
              <span className="text-gray-500">→</span>
            </button>
          ))}
        </div>

        {/* Create new profile */}
        {showCreate ? (
          <form
            onSubmit={handleCreateProfile}
            className="bg-indigo-950/60 border border-indigo-800/40 rounded-2xl p-5 space-y-4"
          >
            <h3 className="font-bold text-white">New Adventurer</h3>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Name"
              maxLength={20}
              className="
                w-full px-4 py-3 rounded-xl
                bg-indigo-900/40 border border-indigo-700/40 text-white
                placeholder:text-gray-500 focus:outline-none focus:border-indigo-400
              "
              autoFocus
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="flex-1 py-2 rounded-xl border border-gray-700 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newName.trim()}
                className="
                  flex-1 py-2 rounded-xl font-bold
                  bg-gradient-to-r from-indigo-600 to-blue-600 text-white
                  disabled:opacity-40 disabled:cursor-not-allowed
                  hover:from-indigo-500 hover:to-blue-500 transition-all
                "
              >
                Start Adventure!
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowCreate(true)}
            className="
              w-full py-3 rounded-2xl border-2 border-dashed border-indigo-700/40
              text-indigo-400 hover:text-indigo-300 hover:border-indigo-600
              transition-all text-sm font-medium
            "
          >
            + Add Player
          </button>
        )}

        {/* Parent dashboard link */}
        <button
          onClick={() => setScreen('parent-dashboard')}
          className="block mx-auto text-xs text-gray-600 hover:text-gray-400 transition-colors"
        >
          📊 Parent Dashboard
        </button>
      </div>
    </div>
  );
}
