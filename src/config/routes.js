import Home from '@/components/pages/Home';
import GameRoom from '@/components/pages/GameRoom';
import Progress from '@/components/pages/Progress';

export const routes = {
  home: {
    id: 'home',
    label: 'Rooms',
    path: '/rooms',
    icon: 'Home',
    component: Home
  },
  gameRoom: {
    id: 'gameRoom',
    label: 'Game Room',
    path: '/room/:roomId',
    icon: 'Lock',
    component: GameRoom
  },
  progress: {
    id: 'progress',
    label: 'Progress',
    path: '/progress',
    icon: 'Trophy',
    component: Progress
  }
};

export const routeArray = Object.values(routes);
export default routes;