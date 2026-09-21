import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bible Story Puzzle',
  description: "Discover Scripture through some of the Bible's greatest stories.",
  applicationName: 'Bible Story Puzzle',
};

export const viewport: Viewport = {
  themeColor: '#0d1220',
  width: 'device-width',
  initialScale: 1,
  // Stops a double-tap on a puzzle tile zooming the page mid-game.
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
