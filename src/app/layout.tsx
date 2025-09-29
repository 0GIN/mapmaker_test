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
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
        <script src="https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js"></script>
      </head>
      <body>
        <MaterialUIProvider>
          {children}
        </MaterialUIProvider>
      </body>
    </html>
  );
}