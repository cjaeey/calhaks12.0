import type { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
  title: 'ReNOVA 2025 - AI-Powered Contractor Matching',
  description: 'Find verified contractors for any project with AI-powered matching powered by Fetch.ai, Anthropic Claude, Bright Data, and ChromaDB',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
