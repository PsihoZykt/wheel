import React, { FC, ReactNode, useMemo } from 'react';
import { createTheme, StyledEngineProvider, ThemeProvider } from '@mui/material';

import { theme } from '@constants/theme.constants.ts';

interface Props {
  children: ReactNode;
}

const ThemeWrapper: FC<Props> = ({ children }) => {
  const updatedTheme = useMemo(() => {
    const primaryColor = theme.palette.primary.main;
    document.documentElement.style.setProperty('--color-primary', primaryColor);

    return createTheme(theme);
  }, []);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={updatedTheme}>{children}</ThemeProvider>
    </StyledEngineProvider>
  );
};

export default ThemeWrapper;
