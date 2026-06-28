'use client';

import { useState, useRef, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { motion, AnimatePresence } from 'framer-motion';

export default function WalletButton() {
  const { publicKey, connecting, connected, disconnect, wallet } = useWallet();
  const { setVisible } = useWalletModal();
  const [dropdown, setDropdown] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setDropdown(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const base58 = publicKey?.toBase58();
  const display = base58 ? `${base58.slice(0, 4)}...${base58.slice(-4)}` : '';

  if (!connected) {
    return (
      <button
        onClick={() => setVisible(true)}
        disabled={connecting}
        className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-dark-950 font-semibold rounded-xl px-5 py-2.5 text-sm transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 disabled:opacity-60 disabled:cursor-wait active:scale-95"
      >
        {connecting ? (
          <>
            <span className="w-4 h-4 border-2 border-dark-950/30 border-t-dark-950 rounded-full animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />
            </svg>
            Connect Wallet
          </>
        )}
      </button>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setDropdown(!dropdown)}
        className="flex items-center gap-3 bg-dark-800/80 hover:bg-dark-700 border border-dark-600/50 hover:border-amber-500/30 rounded-xl px-4 py-2.5 text-sm transition-all"
      >
        {/* Wallet icon */}
        <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.5)]" />
        {/* Wallet name + address */}
        <div className="flex flex-col items-start leading-tight">
          <span className="text-dark-200 text-[11px] uppercase tracking-wider font-medium">
            {wallet?.adapter.name || 'Wallet'}
          </span>
          <span className="text-dark-50 font-mono text-xs">{display}</span>
        </div>
        {/* Chevron */}
        <svg className={`w-3.5 h-3.5 text-dark-400 transition-transform ${dropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {dropdown && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-56 bg-dark-850 border border-dark-600/50 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden z-50"
          >
            {/* Address copy */}
            <div className="px-4 pt-4 pb-3 border-b border-dark-700/50">
              <p className="text-[10px] uppercase tracking-wider text-dark-500 font-bold mb-1">Address</p>
              <p className="font-mono text-xs text-dark-200 break-all leading-relaxed">{base58}</p>
            </div>

            {/* Actions */}
            <div className="p-2">
              <button
                onClick={() => { navigator.clipboard.writeText(base58 || ''); setDropdown(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-dark-300 hover:text-dark-50 hover:bg-dark-700/50 transition-colors text-left"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                </svg>
                Copy Address
              </button>
              <button
                onClick={() => { setVisible(true); setDropdown(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-dark-300 hover:text-dark-50 hover:bg-dark-700/50 transition-colors text-left"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
                </svg>
                Change Wallet
              </button>
            </div>

            <div className="p-2 border-t border-dark-700/50">
              <button
                onClick={() => { disconnect(); setDropdown(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                </svg>
                Disconnect
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
