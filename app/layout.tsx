import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Year on Starknet 2024 Wrapped',
  description: 'A Spotify Wrapped-style on-chain recap for Starknet users.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen text-white antialiased">
        {children}
      </body>
    </html>
  );
}
