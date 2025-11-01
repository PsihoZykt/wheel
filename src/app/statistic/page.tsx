'use client';

import Statistic from '@components/Statistic/Statistic';
import MainLayout from '@/app/MainLayout';
import AlertsContainer from '@components/AlertsContainer/AlertsContainer';
import Metadata from '@components/Metadata';

export default function StatisticPage() {
  return (
    <MainLayout>
      <Metadata />
      <Statistic />
      <AlertsContainer />
    </MainLayout>
  );
}

