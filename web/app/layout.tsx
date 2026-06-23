import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MineLegends ($MNLG) — Mine. Build. Battle. Earn.',
  description:
    'A Web3 idle RPG on Solana. Mine the $MNLG token with skill, burn to mint legendary character NFTs, and battle other players for token prizes.',
  keywords: ['Solana', 'Web3', 'Game', 'NFT', 'Mining', 'Token', 'MNLG', 'MineLegends'],
  authors: [{ name: 'MineLegends' }],
  openGraph: {
    title: 'MineLegends ($MNLG)',
    description: 'A Web3 idle RPG on Solana. Mine. Build. Battle. Earn.',
    type: 'website',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MineLegends ($MNLG)',
    description: 'A Web3 idle RPG on Solana. Mine. Build. Battle. Earn.',
    creator: '@minelegends',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-dark-900">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-dark-900 text-dark-50">{children}</body>
    </html>
  );
}
