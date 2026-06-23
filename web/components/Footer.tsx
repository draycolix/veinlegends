'use client';

import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center font-display font-bold text-dark-900 text-lg">
                ⛏
              </div>
              <span className="font-display font-bold text-lg">
                Mine<span className="text-primary-400">Legends</span>
              </span>
            </div>
            <p className="text-sm text-dark-300 leading-relaxed">
              A Web3 idle RPG on Solana. Mine, build, battle, earn.
              Deflationary by design.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-dark-100 mb-3">Game</h4>
            <ul className="space-y-2 text-sm text-dark-300">
              <li><a href="#gameplay" className="hover:text-primary-400">Gameplay</a></li>
              <li><a href="#characters" className="hover:text-primary-400">Characters</a></li>
              <li><a href="#roadmap" className="hover:text-primary-400">Roadmap</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-dark-100 mb-3">Token</h4>
            <ul className="space-y-2 text-sm text-dark-300">
              <li><a href="#tokenomics" className="hover:text-primary-400">Tokenomics</a></li>
              <li><a href="/docs/WHITEPAPER.md" className="hover:text-primary-400">Whitepaper</a></li>
              <li><a href="https://github.com/draycolix/minelegends" className="hover:text-primary-400">GitHub</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-dark-100 mb-3">Community</h4>
            <ul className="space-y-2 text-sm text-dark-300">
              <li><a href="https://x.com/minelegends" className="hover:text-primary-400">Twitter / X</a></li>
              <li><a href="https://discord.gg/minelegends" className="hover:text-primary-400">Discord</a></li>
              <li><a href="https://t.me/minelegends" className="hover:text-primary-400">Telegram</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-dark-400">
            © 2026 MineLegends. All rights reserved.
          </div>
          <div className="text-xs text-dark-500">
            $MNLG is a utility token, not a security. Not financial advice. Game responsibly.
          </div>
        </div>
      </div>
    </footer>
  );
}
