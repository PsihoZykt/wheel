'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';

import { QUERIES } from '@constants/common.constants.ts';
import withLoading from '@decorators/withLoading.ts';
import { loadUserData } from '@reducers/AucSettings/AucSettings.ts';
import LoadingPage from '@components/LoadingPage/LoadingPage.tsx';
import ROUTES from '@constants/routes.constants.ts';
import da from '@components/Integration/DA';

export default function DARedirect() {
  const { t } = useTranslation();
  const { authFlow } = da;
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingMessage, setLoadingMessage] = useState<string>(t('common.authProgress'));

  useEffect(() => {
    const code = searchParams.get((authFlow as any).redirectCodeQueryKey ?? QUERIES.CODE);

    if (code) {
      (authFlow as any).authenticate(code).then(() => {
        setLoadingMessage(t('common.accountProgress'));
        withLoading(setIsLoading, async () => loadUserData(dispatch))();
      });
    }
  }, [authFlow, dispatch, searchParams, t]);

  useEffect(() => {
    if (!isLoading) {
      router.push(ROUTES.INTEGRATIONS);
    }
  }, [isLoading, router]);

  return <LoadingPage helpText={loadingMessage} />;
}

