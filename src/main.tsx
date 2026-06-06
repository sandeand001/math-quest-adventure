import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import { warmAssetCache } from './services/cacheWarmer'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)

// Pre-fetch all game assets in the background so the SW caches them for offline use.
// Runs after the app renders, in small batches, only when online.
warmAssetCache().catch(() => { /* silent — best effort */ })
