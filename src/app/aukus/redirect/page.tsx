'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import LoadingPage from '@components/LoadingPage/LoadingPage.tsx';
import ROUTES from '@constants/routes.constants.ts';

export default function AukusRedirect() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingMessage, setLoadingMessage] = useState<string>(t('common.authProgress'));

  useEffect(() => {
    // Add specific Aukus redirect logic here
    // This is a placeholder for the Aukus-specific authentication flow
    const code = searchParams.get('code');
    
    if (code) {
      // Process authentication
      setIsLoading(false);
    }
  }, [dispatch, searchParams, t]);

  useEffect(() => {
    if (!isLoading) {
      router.push(ROUTES.HOME);
    }
  }, [isLoading, router]);

  return <LoadingPage helpText={loadingMessage} />;
}

