import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

// Load the Inter font with Latin character subset
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Modern Chat UI - Advanced AI Chat Interface',
  description: 'A comprehensive React component library for building advanced chat interfaces with AI features',
  keywords: 'chat UI, AI chat, React components, RAG, CAG, Next.js',
  authors: [{ name: 'Modern Chat UI Team' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="bg-gradient-to-br from-pink-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 text-gray-900 dark:text-gray-100 antialiased h-screen w-screen overflow-hidden">
        <main className="w-full h-full">
          {children}
        </main>
      </body>
    </html>
  );
}