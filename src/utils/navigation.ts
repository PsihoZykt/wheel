/**
 * Navigation utilities for Next.js compatibility
 * This file provides helpers to ease migration from React Router to Next.js
 */

'use client';

import { useRouter as useNextRouter, usePathname as useNextPathname, useSearchParams as useNextSearchParams } from 'next/navigation';
import { useCallback } from 'react';

/**
 * Hook that mimics React Router's useNavigate
 * Usage: const navigate = useNavigate(); navigate('/path');
 */
export function useNavigate() {
  const router = useNextRouter();
  
  return useCallback((to: string, options?: { replace?: boolean }) => {
    if (options?.replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  }, [router]);
}

/**
 * Hook that mimics React Router's useLocation
 * Returns pathname, search, and a combined location object
 */
export function useLocation() {
  const pathname = useNextPathname();
  const searchParams = useNextSearchParams();
  const search = searchParams?.toString() ? `?${searchParams.toString()}` : '';
  
  return {
    pathname,
    search,
    hash: '', // Next.js doesn't provide hash in the same way
    state: null,
  };
}

/**
 * Direct re-exports for clarity
 */
export { useNextRouter as useRouter };
export { useNextPathname as usePathname };
export { useNextSearchParams as useSearchParams };

