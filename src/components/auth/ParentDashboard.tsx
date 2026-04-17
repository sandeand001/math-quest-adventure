import { useGameStore } from '../../store/gameStore';

export function ParentDashboard() {
  const { profiles, stageResults, setScreen } = useGameStore();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setScreen('profile-select')}
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-white">Parent Dashboard</h1>
        </div>

        {profiles.length === 0 ? (
          <p className="text-gray-400">No child profiles yet.</p>
        ) : (
          profiles.map((profile) => {
            const childResults = stageResults.filter(
              (r) => r.profileId === profile.id,
            );
            const totalCorrect = profile.stats.totalCorrect;
            const totalAttempts = profile.stats.totalAttempts;
            const overallAccuracy =
              totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

            return (
              <div
                key={profile.id}
                className="bg-indigo-950/60 border border-indigo-800/40 rounded-2xl p-5 space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-lg font-bold text-white">
                    {profile.name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{profile.name}</h3>
                    <p className="text-xs text-gray-400">
                      Level {profile.stats.level} · World {profile.currentWorld + 1}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <StatCard label="Total Questions" value={totalAttempts} />
                  <StatCard label="Correct" value={totalCorrect} />
                  <StatCard label="Accuracy" value={`${overallAccuracy}%`} />
                  <StatCard label="Coins" value={profile.stats.coins} />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <StatCard label="Level" value={profile.stats.level} />
                  <StatCard label="HP" value={`${profile.stats.hp}/${profile.stats.maxHp}`} />
                  <StatCard label="Attack" value={profile.stats.attack} />
                  <StatCard
                    label="Shield"
                    value={profile.stats.shieldUnlocked ? 'Yes' : 'No'}
                  />
                </div>

                <p className="text-xs text-gray-500">
                  Stages completed: {childResults.length} · Playing since{' '}
                  {new Date(profile.createdAt).toLocaleDateString()}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-indigo-900/30 border border-indigo-800/20 rounded-xl p-3 text-center">
      <p className="text-lg font-bold text-white">{value}</p>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  );
}
