'use client';

import { motion } from 'framer-motion';

export default function CTA() {
  return (
    <section id="cta" className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative glass rounded-3xl p-12 text-center overflow-hidden gradient-border"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-secondary-500/10" />
          
          <div className="relative z-10">
            <div className="text-6xl mb-6">⛏</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Ready to <span className="text-shimmer">mine legends</span>?
            </h2>
            <p className="text-lg text-dark-200 max-w-xl mx-auto mb-8">
              Join the testnet. Get a free airdrop of test $MNLG.
              Help shape the game. Get a share of the mainnet airdrop.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <a
                href="https://discord.gg/minelegends"
                className="px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-dark-900 font-bold rounded-xl text-lg hover:from-primary-400 hover:to-primary-500 transition-all shadow-2xl shadow-primary-500/30"
              >
                Join Testnet →
              </a>
              <a
                href="https://x.com/minelegends"
                className="px-8 py-4 glass text-dark-100 font-semibold rounded-xl text-lg hover:bg-dark-700/50 transition-all"
              >
                Follow on X
              </a>
            </div>

            <div className="text-sm text-dark-400">
              Free to play. No upfront cost. Just bring a Solana wallet.
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
