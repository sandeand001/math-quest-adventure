import { useSyncExternalStore } from 'react';

function subscribe(callback: () => void) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function getSnapshot() {
  return !navigator.onLine;
}

/** Returns `true` when the browser is offline. */
export function useOfflineStatus(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
