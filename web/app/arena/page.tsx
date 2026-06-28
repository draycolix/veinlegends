'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import BattleContent from '@/components/BattleContent';
import TournamentContent from '@/components/TournamentContent';
import QuestsContent from '@/components/QuestsContent';

type ArenaTab = 'battle' | 'tournament' | 'quests';

const TABS: { id: ArenaTab; label: string; icon: string; color: string }[] = [
  { id: 'battle', label: 'Battle', icon: '⚔', color: 'from-red-500 to-orange-500' },
  { id: 'tournament', label: 'Tournament', icon: '🏆', color: 'from-yellow-500 to-amber-600' },
  { id: 'quests', label: 'Quests', icon: '📜', color: 'from-cyan-500 to-blue-600' },
];

export default function ArenaPage() {
  const [tab, setTab] = useState<ArenaTab>('battle');

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Tab Navigation */}
      <div className="sticky top-0 z-30 bg-dark-900/95 backdrop-blur border-b border-dark-700">
        <div className="max-w-7xl mx-auto px-4 pt-6 pb-4">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/" className="text-dark-400 hover:text-dark-200 text-sm">← Home</Link>
            <h1 className="font-display text-2xl md:text-3xl font-bold">🎮 Arena</h1>
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-6 py-3 rounded-xl font-display font-bold text-sm whitespace-nowrap transition-all ${
                  tab === t.id
                    ? `bg-gradient-to-r ${t.color} text-white shadow-lg`
                    : 'glass text-dark-300 hover:text-dark-100'
                }`}
              >
                <span className="mr-2">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {tab === 'battle' && <BattleContent />}
            {tab === 'tournament' && <TournamentContent />}
            {tab === 'quests' && <QuestsContent />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}