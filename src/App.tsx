import { useGameStore } from './store/gameStore';
import { LoginScreen } from './components/auth/LoginScreen';
import { ProfileSelect } from './components/auth/ProfileSelect';
import { ParentDashboard } from './components/auth/ParentDashboard';
import { WorldMap } from './components/game/WorldMap';
import { ZoneMap } from './components/game/ZoneMap';
import { Stage } from './components/game/Stage';
import { StageResultScreen } from './components/game/StageResultScreen';
import { BossFight } from './components/game/BossFight';
import { Shop } from './components/game/Shop';
import { Inventory } from './components/game/Inventory';

function App() {
  const screen = useGameStore((s) => s.screen);

  switch (screen) {
    case 'auth':
      return <LoginScreen />;
    case 'profile-select':
      return <ProfileSelect />;
    case 'world-map':
      return <WorldMap />;
    case 'zone-map':
      return <ZoneMap />;
    case 'stage':
      return <Stage />;
    case 'stage-result':
      return <StageResultScreen />;
    case 'boss-fight':
      return <BossFight />;
    case 'shop':
      return <Shop />;
    case 'inventory':
      return <Inventory />;
    case 'parent-dashboard':
      return <ParentDashboard />;
    default:
      return <LoginScreen />;
  }
}

export default App;
