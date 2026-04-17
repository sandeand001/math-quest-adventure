import { lazy, Suspense } from 'react';
import { useGameStore } from './store/gameStore';

const ProfileSelect = lazy(() => import('./components/auth/ProfileSelect').then((m) => ({ default: m.ProfileSelect })));
const ParentDashboard = lazy(() => import('./components/auth/ParentDashboard').then((m) => ({ default: m.ParentDashboard })));
const WorldMap = lazy(() => import('./components/game/WorldMap').then((m) => ({ default: m.WorldMap })));
const ZoneMap = lazy(() => import('./components/game/ZoneMap').then((m) => ({ default: m.ZoneMap })));
const Stage = lazy(() => import('./components/game/Stage').then((m) => ({ default: m.Stage })));
const StageResultScreen = lazy(() => import('./components/game/StageResultScreen').then((m) => ({ default: m.StageResultScreen })));
const BossFight = lazy(() => import('./components/game/BossFight').then((m) => ({ default: m.BossFight })));
const Shop = lazy(() => import('./components/game/Shop').then((m) => ({ default: m.Shop })));
const Inventory = lazy(() => import('./components/game/Inventory').then((m) => ({ default: m.Inventory })));

function ScreenLoader() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-indigo-400 text-lg animate-pulse">Loading…</div>
    </div>
  );
}

function App() {
  const screen = useGameStore((s) => s.screen);

  let content;
  switch (screen) {
    case 'profile-select':
      content = <ProfileSelect />;
      break;
    case 'world-map':
      content = <WorldMap />;
      break;
    case 'zone-map':
      content = <ZoneMap />;
      break;
    case 'stage':
      content = <Stage />;
      break;
    case 'stage-result':
      content = <StageResultScreen />;
      break;
    case 'boss-fight':
      content = <BossFight />;
      break;
    case 'shop':
      content = <Shop />;
      break;
    case 'inventory':
      content = <Inventory />;
      break;
    case 'parent-dashboard':
      content = <ParentDashboard />;
      break;
    default:
      content = <ProfileSelect />;
  }

  return <Suspense fallback={<ScreenLoader />}>{content}</Suspense>;
}

export default App;
