import { useOfflineStatus } from '../../hooks/useOfflineStatus';

export function OfflineBanner() {
  const isOffline = useOfflineStatus();

  if (!isOffline) return null;

  return (
    <div className="bg-amber-600 text-white text-center text-xs sm:text-sm py-1.5 px-3 font-medium shrink-0 z-50">
      ⚡ You're offline — progress is saved locally and will sync when you reconnect
    </div>
  );
}
