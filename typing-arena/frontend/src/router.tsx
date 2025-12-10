import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Test from './pages/Test';
import Training from './pages/Training';
import Lessons from './pages/Lessons';
import Race from './pages/Race';
import Stats from './pages/Stats';
import Leaderboards from './pages/Leaderboards';
import Settings from './pages/Settings';

export const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/test', element: <Test /> },
  { path: '/train', element: <Training /> },
  { path: '/lessons', element: <Lessons /> },
  { path: '/race', element: <Race /> },
  { path: '/stats', element: <Stats /> },
  { path: '/leaderboards', element: <Leaderboards /> },
  { path: '/settings', element: <Settings /> }
]);
