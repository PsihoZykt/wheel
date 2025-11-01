/**
 * Navigate component for Next.js (mimics React Router's Navigate)
 * Usage: <Navigate to="/path" replace />
 */

'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface NavigateProps {
  to: string;
  replace?: boolean;
}

export function Navigate({ to, replace = false }: NavigateProps) {
  const router = useRouter();
  
  useEffect(() => {
    if (replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  }, [to, replace, router]);
  
  return null;
}

export default Navigate;

