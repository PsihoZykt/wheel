'use client';

import RequestsPage from '@components/RequestsPage/RequestsPage';
import MainLayout from '@/app/MainLayout';
import AlertsContainer from '@components/AlertsContainer/AlertsContainer';
import Metadata from '@components/Metadata';

export default function Requests() {
  return (
    <MainLayout>
      <Metadata />
      <RequestsPage />
      <AlertsContainer />
    </MainLayout>
  );
}

