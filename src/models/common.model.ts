import { ReactNode } from 'react';

export interface MenuItem {
  title: string;
  path: string;
  icon: ReactNode;
  disabled?: boolean;
  divide?: boolean;
  target?: '_blank' | '_self' | '_parent' | '_top';
}

export interface Size {
  height: number;
  width: number;
}
