'use client';

import NewSettingsPage from '@/pages/settings/NewSettingsPage.tsx';
import MainLayout from '@/app/MainLayout';
import AlertsContainer from '@components/AlertsContainer/AlertsContainer';
import Metadata from '@components/Metadata';

export default function SettingsPage() {
  return (
    <MainLayout>
      <Metadata />
      <NewSettingsPage />
      <AlertsContainer />
    </MainLayout>
  );
}

