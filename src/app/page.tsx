'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';

import { RootState } from '@reducers';
import donatePay from '@components/Integration/DonatePay';
import { setDonatePaySubscribeState } from '@reducers/Subscription/Subscription.ts';
import { loadUserData } from '@reducers/AucSettings/AucSettings';
import AlertsContainer from '@components/AlertsContainer/AlertsContainer';
import AucPage from '@/pages/auction/AucPage';
import { connectToSocketIo } from '@reducers/socketIo/socketIo';
import { getCookie } from '@utils/common.utils';
import { getIntegrationsValidity } from '@api/userApi';
import { AlertType, AlertTypeEnum } from '@models/alert.model';
import { addAlert, deleteAlert } from '@reducers/notifications/notifications';
import Metadata from '@components/Metadata';
import { useTranslation } from 'react-i18next';
import MainLayout from './MainLayout';

const hasToken = !!getCookie('userSession');

export default function Home() {
  const { t } = useTranslation();
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const { username } = useSelector((root: RootState) => root.user);

  useEffect(() => {
    if (username) {
      dispatch(connectToSocketIo);
    }
  }, [dispatch, username]);

  useEffect(() => {
    let interval: any;
    if (hasToken && username) {
      interval = setInterval(
        () => {
          getIntegrationsValidity();
        },
        1000 * 60 * 60 * 3,
      );
    }

    return (): void => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [username]);

  useEffect(() => {
    const loadUser = async () => {
      const loadingAlert: AlertType = {
        message: t('common.accountProgress'),
        type: AlertTypeEnum.Info,
        id: Math.random(),
      };

      dispatch(addAlert(loadingAlert));
      try {
        await loadUserData(dispatch);
      } finally {
        dispatch(deleteAlert(loadingAlert.id));
      }
    };

    if (hasToken) {
      loadUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    const unsub = donatePay.pubsubFlow.events.on('subscribed', () =>
      dispatch(setDonatePaySubscribeState({ actual: true })),
    );
    const unsub2 = donatePay.pubsubFlow.events.on('unsubscribed', () =>
      dispatch(setDonatePaySubscribeState({ actual: false })),
    );

    return () => {
      unsub();
      unsub2();
    };
  }, [dispatch]);

  return (
    <MainLayout>
      <Metadata />
      <AucPage />
      <AlertsContainer />
    </MainLayout>
  );
}

