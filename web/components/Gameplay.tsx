'use client';

import { motion } from 'framer-motion';

const features = [
  {
    icon: '⛏',
    title: 'Skill-Based Mining',
    description:
      'Gem Rush mini-game rewards skill, not just clicking. 60-second puzzles give 2-5x mining bonus. Top scorers climb the leaderboard.',
    accent: 'from-primary-500/20 to-primary-600/5',
  },
  {
    icon: '⚔',
    title: 'PvP Auto-Battle',
    description:
      'Stake $MNLG, match against similar tier, winner takes 90% of the pot. Strategy + stats + a bit of luck. No real-time commitment.',
    accent: 'from-red-500/20 to-red-600/5',
  },
  {
    icon: '🏆',
    title: 'Tournament Seasons',
    description:
      'Daily, weekly, monthly tournaments with $MNLG prize pools. Top 100 share. Top 3 get the lion\'s share. Glorious leaderboard.',
    accent: 'from-yellow-500/20 to-yellow-600/5',
  },
  {
    icon: '🛡',
    title: 'Legendary NFTs',
    description:
      '5 character classes × 3 rarities = 15 unique builds. Legendary characters have 2.5x stats and unique art. Trade on marketplace.',
    accent: 'from-purple-500/20 to-purple-600/5',
  },
  {
    icon: '🔥',
    title: 'Deflationary Token',
    description:
      '60% of every in-game action burns $MNLG permanently. Successful games see circulating supply shrink, supporting token value.',
    accent: 'from-orange-500/20 to-orange-600/5',
  },
  {
    icon: '👥',
    title: 'Guild Wars',
    description:
      'Join guilds, share treasury, fight guild wars. 5v5 strategic battles. Guild leaderboards. Collective rewards.',
    accent: 'from-secondary-500/20 to-secondary-600/5',
  },
];

export default function Gameplay() {
  return (
    <section id="gameplay" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-1.5 rounded-full glass text-sm text-primary-400 font-medium mb-4">
            Gameplay
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Six pillars of <span className="text-shimmer">pure fun</span>
          </h2>
          <p className="text-lg text-dark-200 max-w-2xl mx-auto">
            Every mechanic is designed to be <span className="text-primary-400 font-semibold">skill-rewarding</span>,
            <span className="text-primary-400 font-semibold"> time-flexible</span>, and
            <span className="text-primary-400 font-semibold"> community-driven</span>.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative glass rounded-2xl p-6 hover:bg-dark-700/50 transition-all overflow-hidden"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.accent} opacity-0 group-hover:opacity-100 transition-opacity`}
              />
              <div className="relative z-10">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="font-display text-xl font-bold mb-2 text-dark-50">
                  {feature.title}
                </h3>
                <p className="text-dark-200 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
