'use client';

import { motion } from 'framer-motion';

const distribution = [
  { label: 'Community rewards', value: 35, color: 'bg-primary-500' },
  { label: 'Treasury DAO', value: 20, color: 'bg-secondary-500' },
  { label: 'Public sale', value: 15, color: 'bg-blue-500' },
  { label: 'Team (4yr vest)', value: 10, color: 'bg-purple-500' },
  { label: 'Initial liquidity', value: 10, color: 'bg-cyan-500' },
  { label: 'Advisors/KOLs', value: 5, color: 'bg-pink-500' },
  { label: 'Partnerships', value: 5, color: 'bg-orange-500' },
];

const burnStats = [
  { action: 'Character purchase', burn: 80, cost: '1K-100K $MNLG' },
  { action: 'Character upgrade', burn: 60, cost: '10-1000 $MNLG' },
  { action: 'Tournament entry', burn: 50, cost: '10-1000 $MNLG' },
  { action: 'Repair equipment', burn: 100, cost: '1-10 $MNLG' },
  { action: 'Marketplace fee', burn: 100, cost: '2% of sale' },
  { action: 'Respec stats', burn: 100, cost: '200 $MNLG' },
];

export default function Tokenomics() {
  return (
    <section id="tokenomics" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-1.5 rounded-full glass text-sm text-primary-400 font-medium mb-4">
            Tokenomics
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Deflationary by <span className="text-shimmer">design</span>
          </h2>
          <p className="text-lg text-dark-200 max-w-2xl mx-auto">
            1 billion $MNLG total supply. 60% of every in-game action permanently burns tokens.
            More players = less supply = more value.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Distribution chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass rounded-2xl p-8"
          >
            <h3 className="font-display text-2xl font-bold mb-2">Token Distribution</h3>
            <p className="text-sm text-dark-300 mb-6">Total supply: 1,000,000,000 $MNLG</p>

            <div className="space-y-3">
              {distribution.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-dark-100">{item.label}</span>
                    <span className="text-dark-300 font-mono">{item.value}%</span>
                  </div>
                  <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.value * 2.857}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: i * 0.05 }}
                      className={`h-full ${item.color} rounded-full`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Burn mechanisms */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass rounded-2xl p-8"
          >
            <h3 className="font-display text-2xl font-bold mb-2">Burn Mechanisms</h3>
            <p className="text-sm text-dark-300 mb-6">% of each action that gets burned</p>

            <div className="space-y-3">
              {burnStats.map((item, i) => (
                <motion.div
                  key={item.action}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="flex items-center gap-4 p-3 rounded-lg bg-dark-800/50 hover:bg-dark-800 transition-colors"
                >
                  <div className="flex-1">
                    <div className="text-sm font-medium text-dark-100">{item.action}</div>
                    <div className="text-xs text-dark-400">{item.cost}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-red-400">{item.burn}%</div>
                    <div className="text-xs text-dark-400">burned</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Key metrics */}
        <div className="grid sm:grid-cols-3 gap-4 mt-8">
          <div className="glass rounded-2xl p-6 text-center">
            <div className="text-3xl font-display font-bold text-primary-400">~80M</div>
            <div className="text-sm text-dark-300 mt-1">Initial circulating supply</div>
          </div>
          <div className="glass rounded-2xl p-6 text-center">
            <div className="text-3xl font-display font-bold text-secondary-400">60%</div>
            <div className="text-sm text-dark-300 mt-1">Avg burn rate per action</div>
          </div>
          <div className="glass rounded-2xl p-6 text-center">
            <div className="text-3xl font-display font-bold text-blue-400">9</div>
            <div className="text-sm text-dark-300 mt-1">Token decimals (SPL)</div>
          </div>
        </div>
      </div>
    </section>
  );
}
