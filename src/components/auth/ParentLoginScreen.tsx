import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';

async function loadFirebaseAuth() {
  const [{ auth }, firebaseAuth] = await Promise.all([
    import('../../firebase/config'),
    import('firebase/auth'),
  ]);
  return { auth, ...firebaseAuth };
}

export function ParentLoginScreen() {
  const { setUid, setScreen } = useGameStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } = await loadFirebaseAuth();
      const fn = isSignUp ? createUserWithEmailAndPassword : signInWithEmailAndPassword;
      const cred = await fn(auth, email, password);
      setUid(cred.user.uid);
      setScreen('profile-select');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message.replace('Firebase: ', ''));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      const { auth, signInWithPopup, GoogleAuthProvider } = await loadFirebaseAuth();
      const cred = await signInWithPopup(auth, new GoogleAuthProvider());
      setUid(cred.user.uid);
      setScreen('profile-select');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message.replace('Firebase: ', ''));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center p-6">
      <div className="max-w-sm w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">
            MathQuest
          </h1>
          <p className="text-lg text-gray-400">Adventure Math</p>
          <p className="text-sm text-gray-500">Parents: Sign in to sync progress across devices</p>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-3">
          <label htmlFor="login-email" className="sr-only">Email</label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="email"
            className="
              w-full px-4 py-3 rounded-xl
              bg-indigo-950/60 border border-indigo-800/40 text-white
              placeholder:text-gray-500 focus:outline-none focus:border-indigo-400
            "
          />
          <label htmlFor="login-password" className="sr-only">Password</label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete={isSignUp ? 'new-password' : 'current-password'}
            className="
              w-full px-4 py-3 rounded-xl
              bg-indigo-950/60 border border-indigo-800/40 text-white
              placeholder:text-gray-500 focus:outline-none focus:border-indigo-400
            "
          />
          {error && <p className="text-red-400 text-sm" role="alert">{error}</p>}
          <button
            type="submit"
            disabled={loading || !email || !password}
            className="
              w-full py-3 rounded-xl font-bold text-white
              bg-gradient-to-r from-indigo-600 to-blue-600
              hover:from-indigo-500 hover:to-blue-500
              disabled:opacity-50 transition-all
            "
          >
            {loading ? '...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <button
          onClick={handleGoogle}
          disabled={loading}
          className="
            w-full py-3 rounded-xl font-medium
            bg-white/10 border border-white/20 text-white
            hover:bg-white/20 disabled:opacity-50 transition-all
          "
        >
          Continue with Google
        </button>

        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="block mx-auto text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
        </button>
      </div>
    </div>
  );
}
