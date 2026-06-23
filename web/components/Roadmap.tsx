'use client';

import { motion } from 'framer-motion';

const phases = [
  {
    month: 'Month 1',
    title: 'Devnet',
    status: 'in-progress',
    items: [
      'Smart contract scaffolding',
      'Web app foundation',
      'Token creation on devnet',
      'Landing page live',
      'Internal alpha (10 testers)',
    ],
  },
  {
    month: 'Month 2',
    title: 'Testnet Alpha',
    status: 'pending',
    items: [
      'Public testnet launch',
      '5 character classes',
      'PvP + tournaments',
      'Bug bounty program',
      '100 alpha testers',
    ],
  },
  {
    month: 'Month 3',
    title: 'Testnet Beta',
    status: 'pending',
    items: [
      '10,000+ public testers',
      'Marketplace live',
      'Guild system v1',
      'Mobile-responsive',
      'Stress test: 10K concurrent',
    ],
  },
  {
    month: 'Month 4',
    title: 'Pre-Launch',
    status: 'pending',
    items: [
      'Smart contract audit',
      'Mainnet token creation',
      'CEX outreach (MEXC, Gate.io)',
      'KOL partnerships (5-10)',
      '10K+ Telegram members',
    ],
  },
  {
    month: 'Month 5',
    title: 'Mainnet Launch',
    status: 'pending',
    items: [
      'Token Generation Event',
      'Liquidity pool ($200K+)',
      'Mainnet game fully live',
      'Airdrop to testnet users',
      'CoinGecko / DexScreener',
    ],
  },
  {
    month: 'Month 6',
    title: 'Post-Launch',
    status: 'pending',
    items: [
      'CEX listing (MEXC/Gate.io)',
      'Telegram mini app v1',
      'Tournament Season 1',
      'First governance vote',
      '100K+ users',
    ],
  },
];

const statusColor = {
  'in-progress': 'border-primary-500 bg-primary-500/10',
  pending: 'border-dark-600 bg-dark-800/50',
  done: 'border-secondary-500 bg-secondary-500/10',
};

const statusText = {
  'in-progress': 'Current',
  pending: 'Upcoming',
  done: 'Complete',
};

export default function Roadmap() {
  return (
    <section id="roadmap" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-1.5 rounded-full glass text-sm text-primary-400 font-medium mb-4">
            Roadmap
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            6 months to <span className="text-shimmer">mainnet</span>
          </h2>
          <p className="text-lg text-dark-200 max-w-2xl mx-auto">
            Aggressive but achievable timeline. Product first, marketing second, then scale.
            No fluff, no false promises.
          </p>
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500/50 via-dark-700 to-transparent" />

          <div className="space-y-8">
            {phases.map((phase, i) => (
              <motion.div
                key={phase.month}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`flex flex-col md:flex-row gap-6 items-center ${
                  i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                <div className="flex-1">
                  <div className={`glass rounded-2xl p-6 border-l-4 ${statusColor[phase.status as keyof typeof statusColor]}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-mono text-dark-400">{phase.month}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        phase.status === 'in-progress' ? 'bg-primary-500/20 text-primary-400' :
                        'bg-dark-700 text-dark-300'
                      }`}>
                        {statusText[phase.status as keyof typeof statusText]}
                      </span>
                    </div>
                    <h3 className="font-display text-2xl font-bold mb-4">{phase.title}</h3>
                    <ul className="space-y-1.5">
                      {phase.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-dark-200">
                          <span className="text-primary-400 mt-0.5">▸</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="hidden md:flex w-12 h-12 rounded-full bg-dark-800 border-2 border-primary-500 items-center justify-center font-bold z-10">
                  {i + 1}
                </div>

                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
