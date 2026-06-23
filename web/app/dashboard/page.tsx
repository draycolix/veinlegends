'use client';

import { useState, useEffect } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWalletConnection, WalletContextProvider } from '@/lib/wallet-provider';
import { getPlayerPDA, connection, fromRawAmount, toRawAmount, network } from '@/lib/program';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { motion } from 'framer-motion';

function DashboardInner() {
  const wallet = useWalletConnection();
  const [balance, setBalance] = useState<number>(0);
  const [mnlgBalance, setMnlgBalance] = useState<number>(0);
  const [lastClaim, setLastClaim] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!wallet.connected || !wallet.publicKey) return;
    const fetchBalance = async () => {
      const bal = await connection.getBalance(wallet.publicKey!);
      setBalance(bal / LAMPORTS_PER_SOL);
    };
    fetchBalance();
    const interval = setInterval(fetchBalance, 30000);
    return () => clearInterval(interval);
  }, [wallet.connected, wallet.publicKey]);

  if (!mounted) return null;

  if (!wallet.connected) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-12 text-center max-w-md"
        >
          <div className="text-6xl mb-6">⛏</div>
          <h1 className="font-display text-3xl font-bold mb-4">Welcome, Miner</h1>
          <p className="text-dark-200 mb-8">
            Connect your Solana wallet to start mining, minting characters, and battling other players.
          </p>
          <WalletMultiButton className="!bg-gradient-to-r !from-primary-500 !to-primary-600 !text-dark-900 !font-bold !rounded-xl !px-8 !py-4" />
          <p className="text-xs text-dark-400 mt-4">
            Testnet preview. No real funds required. We're on devnet.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold">Mining Dashboard</h1>
            <p className="text-sm text-dark-300 mt-1">
              {wallet.publicKey?.toBase58().slice(0, 8)}...{wallet.publicKey?.toBase58().slice(-8)}
            </p>
          </div>
          <WalletMultiButton />
        </div>

        {/* Stats grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="SOL Balance" value={balance.toFixed(4)} icon="◎" />
          <StatCard label="$MNLG Balance" value={mnlgBalance.toFixed(2)} icon="⛏" highlight />
          <StatCard label="Mining Rate" value="10/hr" icon="⚡" />
          <StatCard label="Characters" value="0" icon="⚔" />
        </div>

        {/* Mining section */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="glass rounded-2xl p-6">
            <h2 className="font-display text-xl font-bold mb-4">⛏ Idle Mining</h2>
            <p className="text-sm text-dark-300 mb-4">
              Your characters auto-mine $MNLG while offline. Cap: 168 hours (1 week).
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-dark-300">Pending</span>
                <span className="font-mono text-primary-400">0.00 $MNLG</span>
              </div>
              <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary-500 to-primary-400 w-1/3" />
              </div>
            </div>
            <button
              disabled
              className="w-full mt-4 px-4 py-3 bg-primary-500 text-dark-900 font-bold rounded-lg disabled:opacity-50"
            >
              Claim Mining (Testnet only)
            </button>
          </div>

          <div className="glass rounded-2xl p-6">
            <h2 className="font-display text-xl font-bold mb-4">💎 Gem Rush</h2>
            <p className="text-sm text-dark-300 mb-4">
              Match-3 puzzle. 60 seconds. Score-based rewards. Available every 4 hours.
            </p>
            <div className="text-center py-6">
              <div className="text-5xl mb-2">🎮</div>
              <p className="text-sm text-dark-400">Mini-game available after testnet launch</p>
            </div>
            <button
              disabled
              className="w-full px-4 py-3 bg-secondary-500 text-dark-900 font-bold rounded-lg disabled:opacity-50"
            >
              Play (Coming soon)
            </button>
          </div>
        </div>

        {/* Character shop */}
        <div className="glass rounded-2xl p-6">
          <h2 className="font-display text-xl font-bold mb-4">⚔ Character Shop</h2>
          <p className="text-sm text-dark-300 mb-6">
            Burn $MNLG to mint character NFTs. 80% of cost is burned permanently.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {['Miner', 'Warrior', 'Mage', 'Engineer', 'Alchemist'].map((cls) => (
              <div key={cls} className="bg-dark-800/50 rounded-xl p-4 border border-white/5">
                <div className="text-2xl mb-2">
                  {cls === 'Miner' ? '⛏' : cls === 'Warrior' ? '⚔' : cls === 'Mage' ? '🔮' : cls === 'Engineer' ? '⚙' : '🧪'}
                </div>
                <h3 className="font-bold mb-1">{cls}</h3>
                <p className="text-xs text-dark-400 mb-3">Common · 1,000 $MNLG</p>
                <button
                  disabled
                  className="w-full px-3 py-2 bg-dark-700 text-dark-300 text-sm rounded-lg disabled:opacity-50"
                >
                  Mint (Testnet)
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, highlight }: { label: string; value: string; icon: string; highlight?: boolean }) {
  return (
    <div className={`glass rounded-2xl p-4 ${highlight ? 'border border-primary-500/30' : ''}`}>
      <div className="flex items-center gap-2 text-sm text-dark-300 mb-1">
        <span>{icon}</span>
        {label}
      </div>
      <div className={`font-display text-2xl font-bold ${highlight ? 'text-primary-400' : 'text-dark-50'}`}>
        {value}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <WalletContextProvider>
      <DashboardInner />
    </WalletContextProvider>
  );
}
