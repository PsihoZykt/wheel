'use client';

import LogoutPage from '@/pages/logout/LogoutPage.tsx';
import MainLayout from '@/app/MainLayout';
import Metadata from '@components/Metadata';

export default function Logout() {
  return (
    <MainLayout>
      <Metadata />
      <LogoutPage />
    </MainLayout>
  );
}

