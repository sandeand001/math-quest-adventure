import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Top-level error boundary. Prevents a single component throwing from producing
 * a blank white screen. Logs the error and offers a reload path.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Keep this lightweight; swap for a real telemetry sink later.
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  handleReload = (): void => {
    this.setState({ error: null });
    window.location.reload();
  };

  render(): ReactNode {
    if (!this.state.error) return this.props.children;

    return (
      <div
        role="alert"
        className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 p-6"
      >
        <div className="bg-indigo-950/80 border border-indigo-800/40 rounded-3xl p-8 max-w-md w-full text-center space-y-5">
          <div className="text-5xl">🧩</div>
          <h1 className="text-2xl font-bold text-white">Oops! Something broke.</h1>
          <p className="text-sm text-gray-300">
            The game hit an unexpected error. Your progress is saved. Try reloading to get back
            to the adventure.
          </p>
          <button
            onClick={this.handleReload}
            className="w-full py-3 rounded-xl text-lg font-bold bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white transition-all active:scale-95"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }
}
