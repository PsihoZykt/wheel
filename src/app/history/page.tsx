'use client';

import HistoryPage from '@/pages/history/HistoryPage/HistoryPage';
import MainLayout from '@/app/MainLayout';
import AlertsContainer from '@components/AlertsContainer/AlertsContainer';
import Metadata from '@components/Metadata';

export default function History() {
  return (
    <MainLayout>
      <Metadata />
      <HistoryPage />
      <AlertsContainer />
    </MainLayout>
  );
}

