/**
 * Compatibility wrapper for Next.js Link component
 * This allows easier migration from React Router
 */

import NextLink from 'next/link';
import { AnchorHTMLAttributes, ReactNode } from 'react';

interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to?: string;
  href?: string;
  children: ReactNode;
  replace?: boolean;
  scroll?: boolean;
}

/**
 * Link component that accepts both 'to' (React Router style) and 'href' (Next.js style)
 */
export function Link({ to, href, replace, scroll, children, ...props }: LinkProps) {
  const destination = to || href || '/';
  
  return (
    <NextLink href={destination} replace={replace} scroll={scroll} {...props}>
      {children}
    </NextLink>
  );
}

export default Link;

