import type { Metadata } from 'next';
import MaterialUIProvider from '@/components/providers/MaterialUIProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'MapMaker Test - Next.js with Material-UI',
  description: 'A modern web application built with Next.js, TypeScript, and Material-UI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <MaterialUIProvider>
          {children}
        </MaterialUIProvider>
      </body>
    </html>
  );
}