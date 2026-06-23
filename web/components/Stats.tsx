'use client';

import { motion } from 'framer-motion';

const stats = [
  { label: 'Total Supply', value: '1B', sub: '$MNLG tokens' },
  { label: 'Burn Rate', value: '60%', sub: 'avg per action' },
  { label: 'Character Classes', value: '5', sub: 'unique abilities' },
  { label: 'Target MAU', value: '100K', sub: 'Year 1' },
];

export default function Stats() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass rounded-2xl p-6 text-center gradient-border"
            >
              <div className="text-3xl md:text-4xl font-display font-bold text-primary-400 mb-1">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-dark-100">{stat.label}</div>
              <div className="text-xs text-dark-400 mt-1">{stat.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
