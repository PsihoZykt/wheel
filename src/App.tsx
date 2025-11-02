import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { Container, Drawer, List, ListItemButton, ListItemIcon, ListItemText, styled } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';

import WheelSvg from '@assets/icons/wheel.svg?react';
import Metadata from '@components/Metadata';

import ROUTES from './constants/routes.constants';
import AlertsContainer from './components/AlertsContainer/AlertsContainer';
import WheelPage from './pages/wheel/WheelPage/WheelPage';
import StatisticsPage from './pages/statistics/StatisticsPage';
import './App.scss';

const hiddenDrawerRoutes = [ROUTES.HOME];
const lockedDrawerRoutes = [ROUTES.HOME];

let openDriverTimeout: any;

const StyledDrawer = styled(Drawer)(({ theme }: any) => ({
  transition: theme.transitions.create('width', { duration: theme.transitions.duration.shorter }),
})) as any;

const menuItems = [
  { title: 'Колесо рандома', icon: <WheelSvg />, path: ROUTES.HOME },
  { title: 'Статистика', icon: <BarChartIcon />, path: ROUTES.STATISTICS },
];

const App: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Redirect from / to /wheel
  useEffect(() => {
    if (pathname === '/') {
      navigate(ROUTES.HOME, { replace: true });
    }
  }, [pathname, navigate]);

  const showDrawer = useCallback(() => {
    openDriverTimeout = setTimeout(() => setIsDrawerOpen(true), 70);
  }, []);

  const hideDrawer = useCallback(() => {
    clearTimeout(openDriverTimeout);
    setIsDrawerOpen(false);
  }, []);

  const isHomePage = useMemo(() => pathname === ROUTES.HOME, [pathname]);
  const isStatisticsPage = useMemo(() => pathname === ROUTES.STATISTICS, [pathname]);
  const isOpen = useMemo(
    () => (!hiddenDrawerRoutes.includes(pathname) || isDrawerOpen) && !lockedDrawerRoutes.includes(pathname),
    [isDrawerOpen, pathname],
  );
  const drawerClasses = useMemo(() => classNames('app-drawer', { open: isOpen, close: !isOpen }), [isOpen]);

  const createMenuItem = useCallback(
    ({ icon, title, path }: any) => {
      return (
        <Fragment key={path}>
          <ListItemButton key={title} selected={path === pathname} component={Link} to={path}>
            <ListItemIcon className='nav-icon'>{icon}</ListItemIcon>
            <ListItemText className='nav-text' primary={title} />
          </ListItemButton>
        </Fragment>
      );
    },
    [pathname],
  );

  return (
    <div className='app'>
      <Metadata />
      <StyledDrawer
        className={drawerClasses}
        variant='permanent'
        PaperProps={{
          sx: {
            position: 'relative',
            flexShrink: 0,
            whiteSpace: 'nowrap',
            overflowX: 'hidden',
          },
        }}
        onMouseEnter={showDrawer}
        onMouseLeave={hideDrawer}
      >
        <div className='c'>
          <div className='grow'>
            <List>{menuItems.map(createMenuItem)}</List>
          </div>
        </div>
      </StyledDrawer>
      <Container className='app-content'>
        <div hidden={!isHomePage}>
          <WheelPage />
        </div>
        <div hidden={!isStatisticsPage}>
          <StatisticsPage />
        </div>
        <AlertsContainer />
      </Container>
    </div>
  );
};

export default App;
