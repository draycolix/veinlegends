'use client';

import { useMemo } from 'react';
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
  useConnection,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { BackpackWalletAdapter } from '@solana/wallet-adapter-backpack';
import { WalletConnectWalletAdapter } from '@solana/wallet-adapter-walletconnect';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

const NETWORK = (process.env.NEXT_PUBLIC_NETWORK === 'mainnet-beta'
  ? 'mainnet-beta'
  : 'devnet') as 'mainnet-beta' | 'devnet';

export default function WalletProviderInner({
  children,
}: {
  children: React.ReactNode;
}) {
  const endpoint = useMemo(() => {
    if (process.env.NEXT_PUBLIC_RPC_URL) return process.env.NEXT_PUBLIC_RPC_URL;
    const urls: Record<string, string> = {
      'mainnet-beta': 'https://api.mainnet-beta.solana.com',
      devnet: 'https://api.devnet.solana.com',
    };
    return urls[NETWORK];
  }, []);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new BackpackWalletAdapter(),
      new WalletConnectWalletAdapter({
        network: NETWORK === 'mainnet-beta' ? WalletAdapterNetwork.Mainnet : WalletAdapterNetwork.Devnet,
        options: {
          projectId: '00000000000000000000000000000000',
        },
      }),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export function useWalletConnection() {
  const wallet = useWallet();
  const { connection } = useConnection();
  return { ...wallet, connection };
}
