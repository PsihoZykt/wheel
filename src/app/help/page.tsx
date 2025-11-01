'use client';

import HelpPage from '@components/HelpPage/HelpPage';
import MainLayout from '@/app/MainLayout';
import AlertsContainer from '@components/AlertsContainer/AlertsContainer';
import Metadata from '@components/Metadata';

export default function Help() {
  return (
    <MainLayout>
      <Metadata />
      <HelpPage />
      <AlertsContainer />
    </MainLayout>
  );
}

