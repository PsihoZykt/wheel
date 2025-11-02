import React from 'react';
import { useLocation } from 'react-router-dom';

interface MetadataText {
  title: string;
  description: string;
}

const metadataMap: Record<string, MetadataText> = {
  '/': {
    title: 'Колесо удачи | Определите результаты с помощью вращения колеса',
    description:
      'Используйте колесо случайного выбора для определения результатов аукциона с помощью увлекательного вращения. Выбирайте из различных типов колес, чтобы добавить интриги и азарта в ваши живые аукционы.',
  },
  '/settings': {
    title: 'Настройки и интеграции',
    description:
      'Настройте параметры аукциона и интеграции с Donation Alerts и DonatePay. Персонализируйте аукцион с помощью автоматизации таймера, изменения внешнего вида и альтернативных типов аукциона.',
  },
  '/statistic': {
    title: 'Статистика аукциона | Отслеживайте активность зрителей и ставки',
    description: 'Отслеживайте статистику текущего аукциона в реальном времени, включая участие зрителей и ставки',
  },
};

const Essentials = () => {
  const { pathname } = useLocation();
  const metadata = metadataMap[pathname];

  if (!metadata) {
    return (
      <>
        <meta name='robots' content='noindex' />
        <title>Pointauc | Live Auction for Streamers</title>
        <meta
          name='description'
          content='Host interactive auctions where your viewers can bid on games, videos, and more using donations.'
        />
      </>
    );
  }

  return (
    <>
      <title>{metadata.title}</title>
      <meta name='description' content={metadata.description} />
    </>
  );
};

export default Essentials;
