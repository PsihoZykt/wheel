import type { Metadata } from 'next';
import { Providers } from './providers';
import '@assets/i18n/index.ts';
import './globals.css';

export const metadata: Metadata = {
  title: 'PointAuc - Auction Platform for Streamers',
  description: 'Auction platform for Twitch and YouTube streamers',
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon-96x96.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

