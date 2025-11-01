'use client';

import { Fragment, useCallback, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import classNames from 'classnames';
import {
  Container,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  Box,
} from '@mui/material';
import { OpenInNew } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

import AuthorContacts from '@components/AuthorContacts/AuthorContacts.tsx';
import ROUTES from '@constants/routes.constants';
import { MenuItem } from '@models/common.model';
import { useMenuItems } from '@constants/menuItems.constants';
import '../App.scss';

const hiddenDrawerRoutes = [ROUTES.HOME, ROUTES.STOPWATCH, ROUTES.WHEEL];
const lockedDrawerRoutes = [ROUTES.WHEEL];

let openDriverTimeout: any;

const StyledDrawer = styled(Drawer)(({ theme }: any) => ({
  transition: theme.transitions.create('width', { duration: theme.transitions.duration.shorter }),
})) as any;

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const menuItems = useMenuItems();

  const showDrawer = useCallback(() => {
    openDriverTimeout = setTimeout(() => setIsDrawerOpen(true), 70);
  }, []);

  const hideDrawer = useCallback(() => {
    clearTimeout(openDriverTimeout);
    setIsDrawerOpen(false);
  }, []);

  const isHomePage = useMemo(() => pathname === ROUTES.HOME, [pathname]);
  const isOpen = useMemo(
    () => (!hiddenDrawerRoutes.includes(pathname) || isDrawerOpen) && !lockedDrawerRoutes.includes(pathname),
    [isDrawerOpen, pathname],
  );
  const drawerClasses = useMemo(() => classNames('app-drawer', { open: isOpen, close: !isOpen }), [isOpen]);

  const createMenuItem = useCallback(
    ({ icon, title, path, disabled, divide, target }: MenuItem) => {
      const isExternal = target === '_blank';
      const linkProps = isExternal ? { href: path, target } : { href: path };

      return (
        <Fragment key={path}>
          {divide && <Divider style={{ margin: '10px 0' }} />}
          <ListItemButton
            disabled={disabled}
            key={t(title)}
            selected={path === pathname}
            component={isExternal ? 'a' : Link}
            {...linkProps}
          >
            <ListItemIcon className='nav-icon'>{icon}</ListItemIcon>
            <ListItemText className='nav-text' primary={t(title)} />
            {isExternal && (
              <Box sx={{ ml: 1, display: 'flex', alignItems: 'center' }}>
                <OpenInNew fontSize='small' sx={{ opacity: 0.6 }} />
              </Box>
            )}
          </ListItemButton>
        </Fragment>
      );
    },
    [pathname, t],
  );

  return (
    <div className='app'>
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
          <AuthorContacts />
        </div>
      </StyledDrawer>
      <Container className='app-content'>{children}</Container>
    </div>
  );
}

