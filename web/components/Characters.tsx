'use client';

import { motion } from 'framer-motion';

const characters = [
  {
    class: 'Miner',
    role: 'Pure Mining',
    description: 'Born in the depths, knows every vein of ore.',
    stats: { mining: 5, battle: 2, hp: 100 },
    color: 'from-yellow-500 to-orange-600',
    icon: '⛏',
    rarity: 'Common',
  },
  {
    class: 'Warrior',
    role: 'PvP Melee',
    description: 'Forged in the arena, undefeated in 100 duels.',
    stats: { mining: 2, battle: 5, hp: 200 },
    color: 'from-red-500 to-rose-600',
    icon: '⚔',
    rarity: 'Common',
  },
  {
    class: 'Mage',
    role: 'PvP Ranged',
    description: 'Whispers to the gems, they answer.',
    stats: { mining: 2, battle: 4, hp: 120 },
    color: 'from-purple-500 to-violet-600',
    icon: '🔮',
    rarity: 'Common',
  },
  {
    class: 'Engineer',
    role: 'Crafter',
    description: 'If it can be built, it can be optimized.',
    stats: { mining: 3, battle: 2, hp: 110 },
    color: 'from-blue-500 to-cyan-600',
    icon: '⚙',
    rarity: 'Common',
  },
  {
    class: 'Alchemist',
    role: 'Buffer',
    description: 'Transmutes dust into gold.',
    stats: { mining: 2, battle: 2, hp: 100 },
    color: 'from-green-500 to-emerald-600',
    icon: '🧪',
    rarity: 'Common',
  },
];

function StatBar({ value, max, color, label }: { value: number; max: number; color: string; label: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-dark-300">{label}</span>
        <span className="text-dark-100 font-bold">{value}/{max}</span>
      </div>
      <div className="h-1.5 bg-dark-700 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${color} transition-all duration-500`}
          style={{ width: `${(value / max) * 100}%` }}
        />
      </div>
    </div>
  );
}

export default function Characters() {
  return (
    <section id="characters" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-1.5 rounded-full glass text-sm text-primary-400 font-medium mb-4">
            Characters
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Five <span className="text-shimmer">legendary classes</span>
          </h2>
          <p className="text-lg text-dark-200 max-w-2xl mx-auto">
            Each class has unique strengths, abilities, and lore.
            Mix and match to build your perfect mining empire.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {characters.map((char, i) => (
            <motion.div
              key={char.class}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative glass rounded-2xl p-6 hover:scale-105 transition-all overflow-hidden"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${char.color} opacity-0 group-hover:opacity-20 transition-opacity`}
              />
              <div className="relative z-10">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${char.color} flex items-center justify-center text-3xl mb-4 mx-auto shadow-lg`}>
                  {char.icon}
                </div>
                <h3 className="font-display text-2xl font-bold text-center mb-1">
                  {char.class}
                </h3>
                <p className="text-xs text-center text-dark-300 mb-1">{char.role}</p>
                <p className="text-sm text-center text-dark-200 mb-4 italic">"{char.description}"</p>
                
                <div className="space-y-2">
                  <StatBar value={char.stats.mining} max={5} color="from-yellow-500 to-orange-500" label="Mining" />
                  <StatBar value={char.stats.battle} max={5} color="from-red-500 to-rose-500" label="Battle" />
                  <StatBar value={char.stats.hp / 40} max={5} color="from-green-500 to-emerald-500" label="HP" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
