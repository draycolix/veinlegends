'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
        >
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-dark-200">
            Devnet launch · Q4 2026 mainnet
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-6"
        >
          Mine.
          <br />
          <span className="text-shimmer">Build. Battle.</span>
          <br />
          Earn.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-dark-200 max-w-2xl mx-auto mb-10"
        >
          A Web3 idle RPG on Solana. Mine the $MNLG token with skill,
          burn to mint legendary character NFTs, and battle other players
          for token prizes. Deflationary by design.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <a
            href="#cta"
            className="group relative px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-dark-900 font-bold rounded-xl text-lg hover:from-primary-400 hover:to-primary-500 transition-all shadow-2xl shadow-primary-500/30 hover:shadow-primary-500/60"
          >
            <span className="relative z-10">Join Testnet →</span>
          </a>
          <Link
            href="/docs/WHITEPAPER.md"
            className="px-8 py-4 glass text-dark-100 font-semibold rounded-xl text-lg hover:bg-dark-700/50 transition-all border border-white/10"
          >
            Read Whitepaper
          </Link>
        </motion.div>

        {/* Token ticker pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="inline-flex items-center gap-3 px-6 py-3 rounded-full glass glow-gold"
        >
          <span className="text-2xl">⛏</span>
          <span className="font-mono text-xl font-bold">$MNLG</span>
          <span className="text-dark-300 text-sm">|</span>
          <span className="text-sm text-dark-200">Solana SPL Token</span>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-dark-500 rounded-full flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-primary-400 rounded-full"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
