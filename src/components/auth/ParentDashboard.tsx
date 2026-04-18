import { useGameStore } from '../../store/gameStore';
import type { SkillMastery } from '../../types';

export function ParentDashboard() {
  const { profiles, stageResults, masteryMap, setScreen } = useGameStore();

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

            // Recent 10 stage results
            const recentResults = childResults.slice(-10).reverse();

            // Mastery by skill
            const skillEntries = Object.values(masteryMap).filter(
              (m: SkillMastery) => m.attempts > 0,
            );

            return (
              <div
                key={profile.id}
                className="bg-indigo-950/60 border border-indigo-800/40 rounded-2xl p-5 space-y-5"
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

                {/* Overview stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <StatCard label="Questions" value={totalAttempts} />
                  <StatCard label="Correct" value={totalCorrect} />
                  <StatCard label="Accuracy" value={`${overallAccuracy}%`} />
                  <StatCard label="Coins" value={profile.stats.coins} />
                </div>

                {/* Skill mastery breakdown */}
                {skillEntries.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold text-gray-300 mb-2">Skill Mastery</h4>
                    <div className="space-y-2">
                      {skillEntries.map((m: SkillMastery) => {
                        const acc = m.attempts > 0 ? Math.round((m.correct / m.attempts) * 100) : 0;
                        const recentAcc = m.recentResults && m.recentResults.length > 0
                          ? Math.round((m.recentResults.filter(Boolean).length / m.recentResults.length) * 100)
                          : acc;
                        return (
                          <div key={m.skillId} className="flex items-center gap-3">
                            <span className="text-xs text-gray-400 w-32 truncate">{m.skillId}</span>
                            <div className="flex-1 h-3 bg-gray-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  recentAcc >= 90 ? 'bg-emerald-500' :
                                  recentAcc >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${recentAcc}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-300 w-10 text-right">{recentAcc}%</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                              m.level === 'mastered' ? 'bg-emerald-900/50 text-emerald-400' :
                              m.level === 'practicing' ? 'bg-yellow-900/50 text-yellow-400' :
                              'bg-gray-800 text-gray-400'
                            }`}>
                              {m.level}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Recent activity */}
                {recentResults.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold text-gray-300 mb-2">Recent Stages</h4>
                    <div className="space-y-1">
                      {recentResults.map((r, i) => (
                        <div key={i} className="flex items-center gap-3 text-xs">
                          <span className="text-gray-500 w-20">
                            {new Date(r.completedAt).toLocaleDateString()}
                          </span>
                          <span className="text-gray-400">
                            W{r.worldIndex + 1} S{r.stageIndex + 1}
                          </span>
                          <span className={`font-medium ${
                            r.accuracy >= 0.9 ? 'text-emerald-400' :
                            r.accuracy >= 0.7 ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {Math.round(r.accuracy * 100)}%
                          </span>
                          <span className="text-gray-500">{r.correct}/{r.total}</span>
                          <span className="text-yellow-400">{'⭐'.repeat(r.stars)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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
