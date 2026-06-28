'use client';

import { useState, useEffect, useCallback } from 'react';
import WalletButton from '@/components/WalletButton';
import { useWalletConnection } from '@/lib/wallet-provider';
import { connection, network, PROGRAM_ID } from '@/lib/program';
import { motion } from 'framer-motion';
import { Transaction, SystemProgram, PublicKey } from '@solana/web3.js';

function DashboardInner() {
  const wallet = useWalletConnection();
  const [balance, setBalance] = useState<number>(0);
  const [veinBalance, setVeinBalance] = useState<number>(0);
  const [mounted, setMounted] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [txSig, setTxSig] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!wallet.connected || !wallet.publicKey) return;
    const fetchBalance = async () => {
      const bal = await connection.getBalance(wallet.publicKey!);
      setBalance(bal);
    };
    fetchBalance();
    const interval = setInterval(fetchBalance, 30000);
    return () => clearInterval(interval);
  }, [wallet.connected, wallet.publicKey]);

  // Check if program is initialized
  useEffect(() => {
    if (!wallet.connected) return;
    const checkInit = async () => {
      try {
        const acc = await connection.getAccountInfo(PROGRAM_ID);
        setInitialized(acc !== null);
      } catch {
        setInitialized(false);
      }
    };
    checkInit();
  }, [wallet.connected]);

  // Initialize program on-chain
  const handleInit = useCallback(async () => {
    if (!wallet.publicKey || !wallet.signTransaction) return;
    setLoading(true);
    try {
      const { blockhash } = await connection.getLatestBlockhash();

      // Create instruction: discriminator for "initialize"
      const crypto = await import('crypto');
      const disc = crypto.createHash('sha256').update('global:initialize').digest().slice(0, 8);

      const keys: { pubkey: PublicKey; isSigner: boolean; isWritable: boolean }[] = [
        { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
        { pubkey: PROGRAM_ID, isSigner: false, isWritable: false },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ];

      const tx = new Transaction().add({
        keys,
        programId: PROGRAM_ID,
        data: Buffer.from([0, ...disc]),
      });

      tx.recentBlockhash = blockhash;
      tx.feePayer = wallet.publicKey;

      const signed = await wallet.signTransaction(tx);
      const sig = await connection.sendRawTransaction(signed.serialize());
      await connection.confirmTransaction(sig, 'confirmed');

      setTxSig(sig);
      setInitialized(true);
    } catch (err: any) {
      console.error('Init failed:', err.message || err);
    } finally {
      setLoading(false);
    }
  }, [wallet.publicKey, wallet.signTransaction]);

  if (!mounted) return null;

  const solDisplay = (balance / 1e9).toFixed(4);

  if (!wallet.connected) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-12 text-center max-w-md"
        >
          <div className="text-6xl mb-6">🩸</div>
          <h1 className="font-display text-3xl font-bold mb-4">Welcome, Veinwalker</h1>
          <p className="text-dark-200 mb-8">
            Connect your Solana wallet to initiate the VeinLegends program, mint characters, and battle for $VEIN.
          </p>
          <WalletButton />
          <p className="text-xs text-dark-400 mt-4">
            Devnet preview. No real funds required.
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
            <h1 className="font-display text-3xl font-bold">🩸 VeinLegends Dashboard</h1>
            <p className="text-sm text-dark-300 mt-1">
              {wallet.publicKey?.toBase58().slice(0, 8)}...{wallet.publicKey?.toBase58().slice(-8)}
              {' · '}
              <span className="text-primary-400">{network}</span>
            </p>
          </div>
          <WalletButton />
        </div>

        {/* Init button — shown if program not initialized */}
        {!initialized && (
          <div className="glass rounded-2xl p-6 mb-8 border border-primary-500/30">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-display font-bold text-lg">🚀 Program Not Initialized</h3>
                <p className="text-sm text-dark-300">
                  One-time transaction to initialize the VeinLegends state on-chain.
                  Costs ~0.001 SOL.
                </p>
              </div>
              <button
                onClick={handleInit}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-dark-900 font-bold rounded-xl hover:from-primary-400 hover:to-primary-500 transition-all disabled:opacity-50 shadow-lg"
              >
                {loading ? '⏳ Initializing...' : '🩸 Initialize Program'}
              </button>
            </div>
            {txSig && (
              <p className="text-xs text-primary-400 mt-3 font-mono">
                ✅ Tx: <a href={`https://explorer.solana.com/tx/${txSig}?cluster=devnet`} target="_blank" className="underline">{txSig.slice(0, 16)}...{txSig.slice(-16)}</a>
              </p>
            )}
          </div>
        )}

        {/* Stats grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="SOL Balance" value={solDisplay} icon="◎" />
          <StatCard label="$VEIN Balance" value={veinBalance.toFixed(2)} icon="🩸" highlight />
          <StatCard label="Program" value={initialized ? 'Initialized' : 'Not Init'} icon={initialized ? '✅' : '⚠️'} />
          <StatCard label="Characters" value="0" icon="⚔" />
        </div>

        {/* Mining section */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="glass rounded-2xl p-6">
            <h2 className="font-display text-xl font-bold mb-4">⛏ Idle Mining</h2>
            <p className="text-sm text-dark-300 mb-4">
              Your characters auto-mine $VEIN while offline. Cap: 168 hours (1 week).
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-dark-300">Pending</span>
                <span className="font-mono text-primary-400">0.00 $VEIN</span>
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
            Burn $VEIN to mint character NFTs. 80% of cost is burned permanently.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {['Miner', 'Warrior', 'Mage', 'Engineer', 'Alchemist'].map((cls) => (
              <div key={cls} className="bg-dark-800/50 rounded-xl p-4 border border-white/5">
                <div className="text-2xl mb-2">
                  {cls === 'Miner' ? '⛏' : cls === 'Warrior' ? '⚔' : cls === 'Mage' ? '🔮' : cls === 'Engineer' ? '⚙' : '🧪'}
                </div>
                <h3 className="font-bold mb-1">{cls}</h3>
                <p className="text-xs text-dark-400 mb-3">Common · 1,000 $VEIN</p>
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
  return <DashboardInner />;
}
