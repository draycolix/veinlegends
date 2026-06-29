'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';

// ============================================================
// MOCK DATA
// ============================================================
const NFTS = [
  {
    id: 'nft-1',
    name: 'Genesis Veinwalker #001',
    rarity: 'Legendary',
    bloodline: 'Veinbender',
    set: 'Genesis',
    price: 2500,
    image: '🧬',
    color: 'from-purple-500 to-indigo-600',
  },
  {
    id: 'nft-2',
    name: 'Ironblood Forge Armor',
    rarity: 'Epic',
    bloodline: 'Ironblood',
    set: 'Equipment',
    price: 800,
    image: '⚔',
    color: 'from-red-500 to-orange-600',
  },
  {
    id: 'nft-3',
    name: 'Shadowvein Cloak',
    rarity: 'Epic',
    bloodline: 'Shadowvein',
    set: 'Equipment',
    price: 750,
    image: '🌑',
    color: 'from-violet-500 to-purple-600',
  },
  {
    id: 'nft-4',
    name: 'Delver Mine Drill',
    rarity: 'Rare',
    bloodline: 'Delver',
    set: 'Equipment',
    price: 300,
    image: '⛏',
    color: 'from-teal-500 to-cyan-600',
  },
  {
    id: 'nft-5',
    name: 'Stonewarden Shield',
    rarity: 'Rare',
    bloodline: 'Stonewarden',
    set: 'Equipment',
    price: 350,
    image: '🛡',
    color: 'from-gray-400 to-gray-600',
  },
  {
    id: 'nft-6',
    name: 'Forgeborn Hammer',
    rarity: 'Epic',
    bloodline: 'Forgeborn',
    set: 'Equipment',
    price: 650,
    image: '🔨',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    id: 'nft-7',
    name: 'Vein Core Crystal',
    rarity: 'Legendary',
    bloodline: 'Delver',
    set: 'Artifact',
    price: 5000,
    image: '💎',
    color: 'from-teal-400 to-emerald-500',
  },
  {
    id: 'nft-8',
    name: 'Bastion Fortress Key',
    rarity: 'Rare',
    bloodline: 'Stonewarden',
    set: 'Artifact',
    price: 500,
    image: '🗝',
    color: 'from-gray-500 to-slate-600',
  },
];

const ICO = [
  {
    id: 'ico-1',
    name: 'Founders Pack',
    desc: '3 Legendary characters + 10,000 $VEIN + exclusive Founder badge',
    price: 5000,
    supply: 100,
    sold: 72,
    color: 'from-yellow-500 to-amber-600',
    icon: '👑',
  },
  {
    id: 'ico-2',
    name: 'Champion Pack',
    desc: '1 Epic character + 2 Rare characters + 3,000 $VEIN',
    price: 1500,
    supply: 500,
    sold: 218,
    color: 'from-purple-500 to-violet-600',
    icon: '⚔',
  },
  {
    id: 'ico-3',
    name: 'Explorer Pack',
    desc: '1 Rare character + 500 $VEIN + mining boost',
    price: 300,
    supply: 2000,
    sold: 647,
    color: 'from-teal-500 to-cyan-600',
    icon: '🧭',
  },
];

const rarityColor: Record<string, string> = {
  Legendary: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Epic: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Rare: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
};

// ============================================================
// PAGE
// ============================================================
export default function MarketPage() {
  const [tab, setTab] = useState<'marketplace' | 'ico'>('marketplace');
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-dark-900 pt-24 pb-12">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold">Market</h1>
            <p className="text-dark-400 text-sm mt-1">
              Buy VeinLegends NFTs with <span className="text-amber-400 font-bold">$VEIN</span> token
            </p>
          </div>
          <span className="text-xs text-dark-400 bg-dark-800 px-3 py-1 rounded-full border border-dark-700">Devnet</span>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setTab('marketplace')}
            className={`px-5 py-2 rounded-xl font-bold text-sm transition-all ${
              tab === 'marketplace'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-dark-800 text-dark-400 hover:text-dark-200'
            }`}
          >
            🛒 Marketplace
          </button>
          <button
            onClick={() => setTab('ico')}
            className={`px-5 py-2 rounded-xl font-bold text-sm transition-all ${
              tab === 'ico'
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                : 'bg-dark-800 text-dark-400 hover:text-dark-200'
            }`}
          >
            🚀 ICO Sale
          </button>
        </div>

        {/* CONTENT */}
        {tab === 'marketplace' ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {NFTS.map((nft, i) => (
              <motion.div
                key={nft.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelected(selected === nft.id ? null : nft.id)}
                className={`glass rounded-2xl p-4 border cursor-pointer transition-all ${
                  selected === nft.id ? 'border-purple-500/50 ring-1 ring-purple-500/30' : 'border-dark-700/50 hover:border-dark-600'
                }`}
              >
                {/* Image */}
                <div className={`w-full aspect-square rounded-xl bg-gradient-to-br ${nft.color} flex items-center justify-center text-5xl mb-3`}>
                  {nft.image}
                </div>

                {/* Info */}
                <h3 className="font-bold text-sm mb-1 truncate">{nft.name}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${rarityColor[nft.rarity]}`}>
                    {nft.rarity}
                  </span>
                  <span className="text-[10px] text-dark-400">{nft.bloodline}</span>
                </div>
                <span className="text-[10px] text-dark-500 bg-dark-800 px-2 py-0.5 rounded-full">{nft.set}</span>

                {/* Price + Buy */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-dark-700/50">
                  <div>
                    <p className="text-xs text-dark-400">Price</p>
                    <p className="font-bold text-sm text-amber-400">{nft.price.toLocaleString()} VEIN</p>
                  </div>
                  <button className="px-4 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg text-xs font-bold transition-colors border border-purple-500/20">
                    Buy
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* ICO TAB */
          <div className="space-y-4">
            {/* ICO header */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-6 border border-purple-500/20 bg-purple-500/5 mb-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🚀</span>
                <div>
                  <h2 className="font-display text-xl font-bold text-amber-400">Initial Character Offering</h2>
                  <p className="text-sm text-dark-300">Exclusive pre-launch packs — only purchasable with $VEIN token</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-xs text-dark-400">
                <span>🔒 Payment: <strong className="text-amber-400">$VEIN only</strong></span>
                <span>⏰ Sale ends: <strong>Q4 2026 mainnet</strong></span>
                <span>💎 All packs include bonus $VEIN</span>
              </div>
            </motion.div>

            {/* Packs */}
            {ICO.map((pack, i) => (
              <motion.div
                key={pack.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6 border border-dark-700/50 hover:border-purple-500/20 transition-all"
              >
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${pack.color} flex items-center justify-center text-3xl shrink-0`}>
                    {pack.icon}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-display font-bold text-lg mb-1">{pack.name}</h3>
                    <p className="text-sm text-dark-300 mb-3">{pack.desc}</p>

                    {/* Progress bar */}
                    <div className="mb-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-dark-400">{pack.sold} / {pack.supply} sold</span>
                        <span className="text-amber-400 font-bold">{Math.round((pack.sold / pack.supply) * 100)}%</span>
                      </div>
                      <div className="w-full h-2 bg-dark-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${pack.color}`}
                          style={{ width: `${(pack.sold / pack.supply) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-xs text-dark-400 mb-1">Price</p>
                    <p className="font-display font-bold text-2xl text-amber-400">{pack.price.toLocaleString()} VEIN</p>
                    <button className="mt-3 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-dark-950 font-bold rounded-xl text-sm hover:from-amber-400 hover:to-orange-500 transition-all shadow-lg shadow-amber-500/20">
                      Buy Pack
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            <p className="text-center text-xs text-dark-500 mt-6">
              Simulated ICO — no real tokens exchanged. Mainnet ICO uses real $VEIN.
            </p>
          </div>
        )}

        {/* MODAL buy confirm */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
              onClick={() => setSelected(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="glass rounded-2xl p-6 w-full max-w-sm border border-dark-600"
              >
                {(() => {
                  const nft = NFTS.find(n => n.id === selected)!;
                  return (
                    <>
                      <div className={`w-full aspect-square rounded-xl bg-gradient-to-br ${nft.color} flex items-center justify-center text-6xl mb-4`}>
                        {nft.image}
                      </div>
                      <h3 className="font-bold text-lg mb-1">{nft.name}</h3>
                      <div className="flex items-center gap-2 mb-4">
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${rarityColor[nft.rarity]}`}>
                          {nft.rarity}
                        </span>
                        <span className="text-xs text-dark-400">{nft.bloodline} · {nft.set}</span>
                      </div>
                      <div className="bg-dark-800/50 rounded-xl p-4 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-dark-300">Total price</span>
                          <span className="font-display font-bold text-xl text-amber-400">{nft.price.toLocaleString()} VEIN</span>
                        </div>
                      </div>
                      <button className="w-full py-3 bg-gradient-to-r from-purple-500 to-violet-600 text-white font-bold rounded-xl hover:from-purple-400 hover:to-violet-500 transition-all shadow-lg shadow-purple-500/20">
                        Confirm Purchase
                      </button>
                      <button
                        onClick={() => setSelected(null)}
                        className="w-full mt-2 py-2 text-sm text-dark-400 hover:text-dark-200"
                      >
                        Cancel
                      </button>
                      <p className="text-center text-xs text-dark-500 mt-3">Simulated — devnet only</p>
                    </>
                  );
                })()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
