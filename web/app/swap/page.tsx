'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';

// ============================================================
// TOKEN CONFIG
// ============================================================
const TOKENS = [
  { symbol: 'SOL', name: 'Solana', icon: '◎', color: 'from-purple-500 to-blue-500', decimals: 9, price: 142.50 },
  { symbol: 'VEIN', name: 'Vein Token', icon: '⛏', color: 'from-amber-500 to-yellow-600', decimals: 6, price: 0.042 },
  { symbol: 'VLS', name: 'VeinLegends Governance', icon: '🏛', color: 'from-purple-400 to-indigo-500', decimals: 6, price: 0.85 },
  { symbol: 'USDC', name: 'USD Coin', icon: '💵', color: 'from-blue-400 to-blue-500', decimals: 6, price: 1.0 },
  { symbol: 'USDT', name: 'Tether USD', icon: '💲', color: 'from-green-400 to-teal-500', decimals: 6, price: 1.0 },
];

// Pair-specific exchange rates (price ratio between two tokens)
function getRate(from: string, to: string): number {
  const fromT = TOKENS.find(t => t.symbol === from)!;
  const toT = TOKENS.find(t => t.symbol === to)!;
  return fromT.price / toT.price;
}

// ============================================================
// COMPONENT
// ============================================================
export default function SwapPage() {
  const [fromToken, setFromToken] = useState(TOKENS[0]); // SOL
  const [toToken, setToToken] = useState(TOKENS[1]);     // VEIN
  const [amount, setAmount] = useState('');
  const [swapping, setSwapping] = useState(false);
  const [done, setDone] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<'from' | 'to' | null>(null);

  const rate = getRate(fromToken.symbol, toToken.symbol);
  const output = amount ? (parseFloat(amount) * rate).toFixed(toToken.symbol === 'SOL' ? 9 : 6) : '0';

  function flipTokens() {
    setFromToken(toToken);
    setToToken(fromToken);
    setAmount('');
    setDone(false);
  }

  function handleSwap() {
    if (!amount || parseFloat(amount) <= 0) return;
    setSwapping(true);
    setTimeout(() => {
      setSwapping(false);
      setDone(true);
      setAmount('');
    }, 2000);
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <div className="flex flex-col items-center justify-center px-4 pt-24 pb-12">

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass rounded-3xl p-6 border border-dark-700/50"
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-xl font-bold">Swap</h1>
          <span className="text-xs text-dark-400 bg-dark-800 px-3 py-1 rounded-full">Devnet</span>
        </div>

        {/* FROM */}
        <div className="bg-dark-800/50 rounded-2xl p-4 mb-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-dark-400">You pay</span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={amount}
              onChange={(e) => { setAmount(e.target.value); setDone(false); }}
              placeholder="0.0"
              className="bg-transparent text-2xl font-bold text-white w-full outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              onClick={() => setOpenDropdown(openDropdown === 'from' ? null : 'from')}
              className="flex items-center gap-2 bg-dark-700 hover:bg-dark-600 rounded-xl px-3 py-2 transition-colors shrink-0"
            >
              <span>{fromToken.icon}</span>
              <span className="font-bold text-sm">{fromToken.symbol}</span>
              <svg className="w-3 h-3 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
            </button>
          </div>
          <p className="text-xs text-dark-500 mt-1">≈ ${(parseFloat(amount || '0') * fromToken.price).toFixed(2)}</p>
        </div>

        {/* FLIP */}
        <div className="flex justify-center -my-2 z-10 relative">
          <button
            onClick={flipTokens}
            className="w-10 h-10 bg-dark-800 border border-dark-600 rounded-xl flex items-center justify-center hover:border-primary-400 transition-colors"
          >
            <svg className="w-4 h-4 text-dark-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/>
            </svg>
          </button>
        </div>

        {/* TO */}
        <div className="bg-dark-800/50 rounded-2xl p-4 mt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-dark-400">You receive</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-dark-300 w-full">{output}</span>
            <button
              onClick={() => setOpenDropdown(openDropdown === 'to' ? null : 'to')}
              className="flex items-center gap-2 bg-dark-700 hover:bg-dark-600 rounded-xl px-3 py-2 transition-colors shrink-0"
            >
              <span>{toToken.icon}</span>
              <span className="font-bold text-sm">{toToken.symbol}</span>
              <svg className="w-3 h-3 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
            </button>
          </div>
          <p className="text-xs text-dark-500 mt-1">≈ ${(parseFloat(output) * toToken.price).toFixed(2)}</p>
        </div>

        {/* Rate */}
        <div className="flex items-center justify-between mt-4 px-2">
          <span className="text-xs text-dark-400">Rate</span>
          <span className="text-xs text-dark-300">1 {fromToken.symbol} = {rate.toFixed(fromToken.symbol === 'SOL' ? 6 : 4)} {toToken.symbol}</span>
        </div>

        {/* SWAP BUTTON */}
        <button
          onClick={handleSwap}
          disabled={!amount || parseFloat(amount) <= 0 || swapping}
          className={`w-full mt-4 py-3.5 rounded-xl font-bold text-sm transition-all ${
            done
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-gradient-to-r from-amber-500 to-amber-600 text-dark-950 hover:from-amber-400 hover:to-amber-500 shadow-lg shadow-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed'
          }`}
        >
          {swapping ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-dark-950/30 border-t-dark-950 rounded-full animate-spin"/>
              Swapping...
            </span>
          ) : done ? (
            '✓ Swap Complete!'
          ) : (
            'Swap'
          )}
        </button>

        <p className="text-center text-xs text-dark-500 mt-3">
          Simulated on devnet — no real tokens exchanged
        </p>
      </motion.div>

      {/* DROPDOWN */}
      <AnimatePresence>
        {openDropdown && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setOpenDropdown(null)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-2xl p-4 w-full max-w-sm border border-dark-600"
            >
              <h3 className="font-bold text-sm mb-3 px-2">Select Token</h3>
              <div className="space-y-1">
                {TOKENS.filter(t => openDropdown === 'from' ? t.symbol !== toToken.symbol : t.symbol !== fromToken.symbol).map((t) => (
                  <button
                    key={t.symbol}
                    onClick={() => {
                      if (openDropdown === 'from') setFromToken(t);
                      else setToToken(t);
                      setOpenDropdown(null);
                      setAmount('');
                      setDone(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-dark-700/50 transition-colors text-left"
                  >
                    <span className="text-xl">{t.icon}</span>
                    <div>
                      <p className="font-bold text-sm">{t.symbol}</p>
                      <p className="text-xs text-dark-400">{t.name}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
