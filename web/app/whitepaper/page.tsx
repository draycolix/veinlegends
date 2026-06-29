'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';

// ============================================================
// SECTION NAV
// ============================================================
const SECTIONS = [
  { id: 'executive', label: 'Executive Summary', num: '1', icon: '📋' },
  { id: 'problem', label: 'Problem', num: '2', icon: '⚠' },
  { id: 'solution', label: 'Solution', num: '3', icon: '💡' },
  { id: 'mechanics', label: 'Game Mechanics', num: '4', icon: '🎮' },
  { id: 'tokenomics', label: '$VEIN Economy', num: '5', icon: '💰' },
  { id: 'vls', label: '$VLS Governance', num: '6', icon: '🏛' },
  { id: 'tech', label: 'Technical Architecture', num: '7', icon: '🔧' },
  { id: 'roadmap', label: 'Roadmap', num: '8', icon: '🗺' },
  { id: 'team', label: 'Team', num: '9', icon: '👤' },
  { id: 'risk', label: 'Risk & Mitigation', num: '10', icon: '🛡' },
  { id: 'conclusion', label: 'Conclusion', num: '11', icon: '🎯' },
];

// ============================================================
// TOKENOMICS DATA
// ============================================================
const DISTRIBUTION = [
  { label: 'Community Rewards', pct: 35, color: '#f59e0b', desc: 'Mine pool, tournaments, airdrops — 4yr linear unlock' },
  { label: 'Treasury DAO', pct: 20, color: '#8b5cf6', desc: '4yr unlock, 1yr cliff' },
  { label: 'Public Sale', pct: 15, color: '#06b6d4', desc: 'pump.fun fair launch — no lock' },
  { label: 'Team', pct: 10, color: '#ef4444', desc: '4yr vest, 1yr cliff' },
  { label: 'Initial Liquidity', pct: 10, color: '#22c55e', desc: 'Locked 2yr via Streamflow' },
  { label: 'Advisors/KOLs', pct: 5, color: '#f97316', desc: '2yr vest, 6mo cliff' },
  { label: 'Partnerships', pct: 5, color: '#ec4899', desc: 'Game studios, exchanges, guilds' },
];

const BURN_MECHANISMS = [
  { action: 'Buy Character', burn: 80, icon: '🧬' },
  { action: 'Upgrade Character', burn: 60, icon: '⬆' },
  { action: 'Tournament Entry', burn: 50, icon: '🏆' },
  { action: 'Repair Equipment', burn: 100, icon: '🔧' },
  { action: 'Fast-Track Queue', burn: 100, icon: '⚡' },
  { action: 'Custom Name', burn: 100, icon: '✏' },
  { action: 'Respec Stats', burn: 100, icon: '🔄' },
  { action: 'Marketplace Fee', burn: 100, icon: '🏪' },
];

const ROADMAP = [
  { month: 'M1', title: 'Devnet', desc: 'Smart contract scaffolding, wallet connect, mining dashboard, 10 alpha testers', status: 'done', color: '#22c55e' },
  { month: 'M2', title: 'Testnet Alpha', desc: 'Public testnet, invite 100 beta testers, airdrop test $VEIN', status: 'done', color: '#22c55e' },
  { month: 'M3', title: 'Testnet Beta', desc: 'Public testnet launch, 50K test users, 5 character classes, PvP battle live', status: 'current', color: '#f59e0b' },
  { month: 'M4', title: 'Pre-Launch', desc: 'Security audit, token creation on mainnet, marketing, CEX outreach', status: 'upcoming', color: '#64748b' },
  { month: 'M5', title: 'Mainnet Launch', desc: 'TGE, liquidity pool, mainnet game launch, public airdrop', status: 'upcoming', color: '#64748b' },
  { month: 'M6', title: 'Post-Launch', desc: 'CEX listing, Telegram mini app, tournament season 1, governance vote', status: 'upcoming', color: '#64748b' },
];

const RISKS = [
  { risk: 'Token dump after launch', prob: 'High', impact: 'High', mitigation: 'Vesting, lockups, gradual emission' },
  { risk: 'Game boring / low retention', prob: 'Medium', impact: 'High', mitigation: 'Continuous content, focus on fun first' },
  { risk: 'Regulatory (Bappebti)', prob: 'Medium', impact: 'High', mitigation: 'Position as game utility, no profit promises' },
  { risk: 'Smart contract exploit', prob: 'Low', impact: 'Critical', mitigation: 'Audit, bug bounty, gradual rollout' },
  { risk: 'Competitor clones model', prob: 'High', impact: 'Medium', mitigation: 'First-mover advantage, community lock-in' },
  { risk: 'Network downtime', prob: 'Low', impact: 'Medium', mitigation: 'Multi-RPC fallback, status page' },
];

// ============================================================
// HELPERS
// ============================================================
function getProbColor(p: string) {
  if (p === 'High') return 'text-red-400 bg-red-500/10';
  if (p === 'Medium') return 'text-yellow-400 bg-yellow-500/10';
  return 'text-green-400 bg-green-500/10';
}

function getImpactColor(i: string) {
  if (i === 'Critical') return 'text-red-400 bg-red-500/10 border-red-500/30';
  if (i === 'High') return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
  return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
}

// ============================================================
// PAGE
// ============================================================
export default function WhitepaperPage() {
  const [activeSection, setActiveSection] = useState('executive');
  const [mobileNav, setMobileNav] = useState(false);
  const refs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );

    for (const section of SECTIONS) {
      const el = document.getElementById(section.id);
      refs.current[section.id] = el;
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMobileNav(false);
  };

  return (
    <div className="min-h-screen bg-dark-900 text-dark-100">
      {/* ===== SIDEBAR NAV ===== */}
      <nav className="fixed left-0 top-0 h-full w-64 bg-dark-950/90 backdrop-blur border-r border-dark-800 z-40 hidden xl:flex flex-col pt-24 pb-8 px-5 overflow-y-auto">
        <p className="text-xs text-dark-500 uppercase tracking-widest mb-6 font-bold">Contents</p>
        {SECTIONS.map(s => (
          <button
            key={s.id}
            onClick={() => scrollTo(s.id)}
            className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm text-left transition-all mb-0.5 ${
              activeSection === s.id
                ? 'bg-yellow-500/10 text-yellow-400 font-bold border-l-2 border-yellow-500'
                : 'text-dark-400 hover:text-dark-200 hover:bg-dark-800/50'
            }`}
          >
            <span className="w-6 text-center text-xs">{s.icon}</span>
            <span>{s.num}. {s.label}</span>
          </button>
        ))}
      </nav>

      {/* ===== MOBILE NAV TOGGLE ===== */}
      <div className="fixed top-20 right-4 z-50 xl:hidden">
        <button onClick={() => setMobileNav(!mobileNav)} className="glass px-4 py-2 rounded-xl text-sm font-bold">
          {mobileNav ? '✕ Close' : '📖 Sections'}
        </button>
        <AnimatePresence>
          {mobileNav && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="absolute top-12 right-0 w-64 glass rounded-2xl p-4 border border-dark-600 shadow-2xl max-h-[70vh] overflow-y-auto">
              {SECTIONS.map(s => (
                <button key={s.id} onClick={() => scrollTo(s.id)}
                  className={`w-full flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm text-left transition-all mb-0.5 ${
                    activeSection === s.id ? 'bg-yellow-500/10 text-yellow-400 font-bold' : 'text-dark-400 hover:text-dark-200'}`}>
                  <span>{s.icon}</span><span>{s.num}. {s.label}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ===== BACK BUTTON ===== */}
      <div className="fixed top-20 left-4 z-50 xl:left-72">
        <Link href="/" className="glass px-4 py-2.5 rounded-xl text-sm font-bold text-dark-200 hover:text-white hover:bg-dark-800 transition-all flex items-center gap-2">
          <span>←</span> <span className="hidden sm:inline">VeinLegends</span>
        </Link>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <main className="xl:ml-64">
        {/* HERO */}
        <section id="executive" className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
          </div>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 text-center px-4 max-w-4xl">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="text-sm text-yellow-400 font-bold tracking-widest uppercase mb-4">Whitepaper v1.0</motion.p>
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent">
              VeinLegends
            </h1>
            <p className="text-xl md:text-2xl text-dark-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              A Web3 idle-RPG on Solana with a dual-token model.{' '}
              <span className="text-yellow-400">Mine</span> the $VEIN utility token,{' '}
              <span className="text-yellow-400">burn</span> to mint legendary characters, stake{' '}
              <span className="text-purple-400">$VLS</span> for governance, and{' '}
              <span className="text-yellow-400">battle</span> for prizes.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-dark-400">
              <span className="glass px-4 py-2 rounded-full">Network: Solana</span>
              <span className="glass px-4 py-2 rounded-full text-yellow-400">Token: $VEIN</span>
              <span className="glass px-4 py-2 rounded-full text-purple-400">Token: $VLS</span>
              <span className="glass px-4 py-2 rounded-full">Launch: Q4 2026</span>
              <span className="glass px-4 py-2 rounded-full">Author: Riz (draycolix)</span>
            </div>
          </motion.div>
        </section>

        <div className="max-w-4xl mx-auto px-4 md:px-8 pb-32 space-y-32">
          {/* ===== 1. EXECUTIVE SUMMARY ===== */}
          <section className="pt-16">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Executive Summary</h2>
              <p className="text-dark-300 text-lg leading-relaxed">
                VeinLegends fuses <strong className="text-white">tap-to-earn accessibility</strong> with{' '}
                <strong className="text-white">play-to-earn depth</strong>, creating a self-sustaining token economy that
                rewards both casual players and competitive grinders.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { label: 'MAU Target (Y1)', value: '100K', icon: '👥' },
                { label: 'Token Burn Rate', value: '60%', icon: '🔥', sub: 'within 30 days of earning' },
                { label: 'D30 Retention', value: '20%', icon: '📈', sub: 'vs 8% Web3 median' },
                { label: 'Buyback Target', value: '$1M+', icon: '💵', sub: 'in-game revenue' },
                { label: 'Governance Token', value: '$VLS', icon: '🏛', sub: '100M fixed supply · Dual-token model', highlight: true },
              ].map((stat, i) => (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className={`glass rounded-2xl p-6 text-center ${(stat as any).highlight ? 'border border-purple-500/30 bg-purple-500/5' : ''}`}>
                  <p className="text-3xl mb-2">{stat.icon}</p>
                  <p className={`font-display font-bold text-3xl ${(stat as any).highlight ? 'text-purple-400' : 'text-yellow-400'}`}>{stat.value}</p>
                  <p className="text-sm text-dark-300 mt-1">{stat.label}</p>
                  {stat.sub && <p className="text-xs text-dark-500 mt-1">{stat.sub}</p>}
                </motion.div>
              ))}
            </div>
          </section>

          {/* ===== 2. PROBLEM ===== */}
          <section id="problem">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">The Problem</h2>
              <p className="text-dark-300 text-lg">Web3 games have a 95% failure rate. Here's why — and how VeinLegends is different.</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                { title: 'Token Inflation Without Sinks', desc: 'Unlimited mining with no burning = inevitable price collapse.', icon: '💸' },
                { title: 'Ponzi Mechanics', desc: 'Early players paid by later players — unsustainable by definition.', icon: '🏚' },
                { title: 'Poor Gameplay', desc: 'Tokenomics trump game design. Players leave when the fun stops.', icon: '😴' },
                { title: 'Whale Dominance', desc: 'Pay-to-win kills casual retention. The 1% control the economy.', icon: '🐋' },
              ].map((item, i) => (
                <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="glass rounded-2xl p-6 border border-red-500/10">
                  <p className="text-2xl mb-3">{item.icon}</p>
                  <h3 className="font-bold text-lg mb-2 text-red-400">{item.title}</h3>
                  <p className="text-sm text-dark-400">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ===== 3. SOLUTION ===== */}
          <section id="solution">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">The Solution</h2>
              <p className="text-dark-300 text-lg">The 4-Pillar Model — each pillar reinforces the others.</p>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: 'Skill-Based Mining', desc: 'Active play multiplies mining 2-5x. No bot farming.', icon: '⛏', color: 'from-yellow-500 to-amber-600' },
                { title: 'NFT Characters', desc: '5 classes, 3 rarities. On-chain stats. Tradeable.', icon: '🧬', color: 'from-purple-500 to-pink-600' },
                { title: 'PvP Battle', desc: 'Stake $VEIN. Winner takes 90%. Weekly tournaments.', icon: '⚔', color: 'from-red-500 to-orange-600' },
                { title: 'Deflationary Token', desc: '60% of all $VEIN burned. Circulating supply shrinks.', icon: '🔥', color: 'from-cyan-500 to-blue-600' },
              ].map((pillar, i) => (
                <motion.div key={pillar.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="glass rounded-2xl overflow-hidden border border-dark-700">
                  <div className={`h-2 bg-gradient-to-r ${pillar.color}`} />
                  <div className="p-6">
                    <p className="text-3xl mb-3">{pillar.icon}</p>
                    <h3 className="font-bold text-lg mb-2">{pillar.title}</h3>
                    <p className="text-sm text-dark-400">{pillar.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ===== 4. GAME MECHANICS ===== */}
          <section id="mechanics">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Game Mechanics</h2>
              <p className="text-dark-300 text-lg">How the game actually works — mining, characters, battles, and progression.</p>
            </motion.div>

            <div className="space-y-6">
              {/* Mining */}
              <div className="glass rounded-2xl p-6 md:p-8">
                <h3 className="font-display text-xl font-bold mb-4">⛏ Mining</h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="bg-dark-800/50 rounded-xl p-4">
                    <p className="text-yellow-400 font-bold text-lg">10 $VEIN/hr</p>
                    <p className="text-xs text-dark-400 mt-1">Idle base rate. Multiplied by Mining Power stat & player level.</p>
                  </div>
                  <div className="bg-dark-800/50 rounded-xl p-4">
                    <p className="text-yellow-400 font-bold text-lg">Gem Rush</p>
                    <p className="text-xs text-dark-400 mt-1">60-second mini-game. 10-50 $VEIN reward. Available every 4 hours.</p>
                  </div>
                  <div className="bg-dark-800/50 rounded-xl p-4">
                    <p className="text-yellow-400 font-bold text-lg">+20% Referral</p>
                    <p className="text-xs text-dark-400 mt-1">30-day mining boost per active referral.</p>
                  </div>
                </div>
              </div>

              {/* Characters */}
              <div className="glass rounded-2xl p-6 md:p-8">
                <h3 className="font-display text-xl font-bold mb-4">🧬 Characters</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-dark-700 text-dark-400">
                        <th className="text-left py-3 px-3">Class</th>
                        <th className="text-left py-3 px-3">Role</th>
                        <th className="text-left py-3 px-3">Strength</th>
                        <th className="text-left py-3 px-3">Special Ability</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['⛏ Miner', 'Pure mining', 'High mining, low battle', 'Auto-mine +50%'],
                        ['⚔ Warrior', 'PvP', 'High HP, melee', 'First strike bonus'],
                        ['🔮 Mage', 'PvP, magic', 'High damage, ranged', 'Mana shield'],
                        ['🔧 Engineer', 'Crafting', 'Item efficiency', 'Reduce repair cost 50%'],
                        ['🧪 Alchemist', 'Crafting, buffs', 'Potion brewing', 'Buff allies +25% mining'],
                      ].map((row, i) => (
                        <tr key={i} className="border-b border-dark-800">
                          {row.map((cell, j) => (
                            <td key={j} className="py-3 px-3">{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex gap-4 mt-6 text-xs">
                  <span className="bg-dark-700 px-3 py-1.5 rounded-lg">Common — 60% supply, 1K $VEIN</span>
                  <span className="bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-lg">Rare — 30% supply, 10K $VEIN</span>
                  <span className="bg-yellow-500/10 text-yellow-400 px-3 py-1.5 rounded-lg">Legendary — 10% supply, 100K $VEIN</span>
                </div>
              </div>
            </div>
          </section>

          {/* ===== 5. TOKENOMICS ===== */}
          <section id="tokenomics">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Token Economy</h2>
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="glass px-4 py-2 rounded-full text-sm">Total Supply: <strong className="text-yellow-400">1,000,000,000 $VEIN</strong></span>
                <span className="glass px-4 py-2 rounded-full text-sm">Decimals: <strong className="text-yellow-400">9 (SPL standard)</strong></span>
                <span className="glass px-4 py-2 rounded-full text-sm">Initial Circ: <strong className="text-yellow-400">~80M (8%)</strong></span>
              </div>
            </motion.div>

            {/* Distribution */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              <div className="glass rounded-2xl p-6">
                <h3 className="font-display font-bold text-lg mb-4">Distribution</h3>
                <div className="space-y-3">
                  {DISTRIBUTION.map((d, i) => (
                    <motion.div key={d.label} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{d.label}</span>
                        <span className="text-sm font-bold" style={{ color: d.color }}>{d.pct}%</span>
                      </div>
                      <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                        <motion.div className="h-full rounded-full" style={{ backgroundColor: d.color }}
                          initial={{ width: 0 }} whileInView={{ width: `${d.pct}%` }}
                          viewport={{ once: true }} transition={{ duration: 1, delay: i * 0.1 }} />
                      </div>
                      <p className="text-xs text-dark-500 mt-0.5">{d.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Burn Mechanisms */}
              <div className="glass rounded-2xl p-6">
                <h3 className="font-display font-bold text-lg mb-4">Burn Mechanisms</h3>
                <div className="space-y-2">
                  {BURN_MECHANISMS.map((b, i) => (
                    <motion.div key={b.action} initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 bg-dark-800/30 rounded-xl p-3">
                      <span className="text-lg">{b.icon}</span>
                      <span className="flex-1 text-sm">{b.action}</span>
                      <span className={`text-sm font-bold ${b.burn >= 80 ? 'text-red-400' : b.burn >= 60 ? 'text-orange-400' : 'text-yellow-400'}`}>
                        {b.burn}% burned
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Key Metric */}
            <div className="glass rounded-2xl p-6 text-center border border-yellow-500/20">
              <p className="text-sm text-dark-400">Target Burn Rate</p>
              <p className="font-display font-bold text-4xl text-yellow-400 mt-1">30%</p>
              <p className="text-sm text-dark-400 mt-1">of monthly emission</p>
              <p className="text-xs text-dark-500 mt-2">Outcome: <strong className="text-green-400">Net deflationary</strong> if user count &gt; 50K</p>
            </div>
          </section>

          {/* ===== 6. $VLS GOVERNANCE TOKEN ===== */}
          <section id="vls">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">$VLS — Governance Token</h2>
              <p className="text-dark-300 text-lg">Dual-token model. $VEIN untuk utility, $VLS untuk value capture & governance.</p>
            </motion.div>

            {/* VLS vs VEIN comparison */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="glass rounded-2xl p-6 border border-yellow-500/20">
                <h3 className="font-display font-bold text-xl mb-4 text-yellow-400">💰 $VEIN</h3>
                <div className="space-y-3 text-sm">
                  {[
                    ['Type', 'Utility token'],
                    ['Supply', 'Unlimited (terkontrol sink)'],
                    ['Didapat dari', 'Mining, battle rewards, quests'],
                    ['Digunakan untuk', 'Breed, gacha, upgrade, tournament entry'],
                    ['Analogi', 'SLP (Axie Infinity)'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between"><span className="text-dark-400">{k}</span><span>{v}</span></div>
                  ))}
                </div>
              </div>
              <div className="glass rounded-2xl p-6 border border-purple-500/20">
                <h3 className="font-display font-bold text-xl mb-4 text-purple-400">🏛 $VLS</h3>
                <div className="space-y-3 text-sm">
                  {[
                    ['Type', 'Governance + Value capture'],
                    ['Supply', 'Fixed 100,000,000'],
                    ['Didapat dari', 'Staking, LP provision, airdrop'],
                    ['Digunakan untuk', 'Voting, revenue share, premium access'],
                    ['Analogi', 'AXS (Axie Infinity)'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between"><span className="text-dark-400">{k}</span><span className="text-purple-300">{v}</span></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Why Dual Token */}
            <div className="glass rounded-2xl p-6 mb-8">
              <h3 className="font-display font-bold text-lg mb-4">Kenapa Dual Token?</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { title: 'Pisah Utility & Speculation', desc: '$VEIN untuk game loop harian. $VLS untuk long-term value. Player casual gak perlu mikirin harga token.', icon: '🔀' },
                  { title: 'Cegah Inflasi Merusak Governance', desc: 'Kalau governance pakai token inflasi, voting power ter-dilusi. $VLS fixed supply = voting power stabil.', icon: '🛡' },
                  { title: 'Revenue Share untuk Holder', desc: 'Staker $VLS dapat share dari breeding fee, gacha fee, dan marketplace fee — insentif hold jangka panjang.', icon: '💵' },
                ].map((item, i) => (
                  <div key={i} className="bg-dark-800/50 rounded-xl p-4">
                    <p className="text-2xl mb-2">{item.icon}</p>
                    <p className="font-bold text-sm mb-1">{item.title}</p>
                    <p className="text-xs text-dark-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* VLS Distribution */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="glass rounded-2xl p-6">
                <h3 className="font-display font-bold text-lg mb-4">Distribusi $VLS</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Public Sale (IDO)', pct: 15, color: '#f59e0b', desc: 'Jupiter Launchpad / Raydium' },
                    { label: 'Staking Rewards', pct: 30, color: '#8b5cf6', desc: '4yr linear emission' },
                    { label: 'Ecosystem Fund', pct: 20, color: '#06b6d4', desc: 'Grants, partnerships, tournaments' },
                    { label: 'Team & Advisors', pct: 15, color: '#ef4444', desc: '2yr vest, 6mo cliff' },
                    { label: 'Liquidity Pool', pct: 10, color: '#22c55e', desc: '$VLS/SOL + $VLS/$VEIN pairs' },
                    { label: 'Airdrop Reserve', pct: 10, color: '#ec4899', desc: 'Testnet participants + community' },
                  ].map((d, i) => (
                    <motion.div key={d.label} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{d.label}</span>
                        <span className="text-sm font-bold" style={{ color: d.color }}>{d.pct}%</span>
                      </div>
                      <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                        <motion.div className="h-full rounded-full" style={{ backgroundColor: d.color }}
                          initial={{ width: 0 }} whileInView={{ width: `${d.pct}%` }} viewport={{ once: true }}
                          transition={{ duration: 1, delay: i * 0.1 }} />
                      </div>
                      <p className="text-xs text-dark-500 mt-0.5">{d.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="glass rounded-2xl p-6">
                <h3 className="font-display font-bold text-lg mb-4">Value Capture</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Staking Rewards', value: '20% breeding fee + 10% gacha fee', icon: '🏦', color: 'text-green-400' },
                    { label: 'Governance Voting', value: 'Economic parameters, new features, treasury', icon: '🗳', color: 'text-purple-400' },
                    { label: 'Premium Access', value: 'Early tournament entry, exclusive parts, airdrop multiplier', icon: '⭐', color: 'text-yellow-400' },
                    { label: 'Revenue Share', value: '30% marketplace fee → distributed to stakers', icon: '💎', color: 'text-cyan-400' },
                    { label: 'Deflationary Pressure', value: 'Buyback & burn with 10% protocol revenue', icon: '🔥', color: 'text-red-400' },
                  ].map((item, i) => (
                    <div key={i} className="bg-dark-800/30 rounded-xl p-4 flex items-start gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <div>
                        <p className="font-bold text-sm">{item.label}</p>
                        <p className={`text-sm mt-0.5 ${item.color}`}>{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Token Sale */}
            <div className="glass rounded-2xl p-6 text-center border border-purple-500/20">
              <p className="text-sm text-dark-400">$VLS Token Sale Target</p>
              <p className="font-display font-bold text-4xl text-purple-400 mt-1">$200K–$500K</p>
              <p className="text-sm text-dark-400 mt-1">15M $VLS (15% supply) via IDO</p>
              <p className="text-xs text-dark-500 mt-2">Price: $0.02–$0.05 | Vesting: 20% TGE + 80% linear 12 bulan</p>
            </div>
          </section>

          {/* ===== 7. TECH ===== */}
          <section id="tech">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Technical Architecture</h2>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: 'Blockchain', value: 'Solana', icon: '⚡' },
                { label: 'Smart Contract', value: 'Anchor (Rust)', icon: '🦀' },
                { label: 'Token Standard', value: 'SPL + Metaplex NFTs', icon: '🪙' },
                { label: 'Frontend', value: 'Next.js + Tailwind', icon: '🎨' },
                { label: 'State', value: 'Anchor PDAs + Supabase', icon: '🗄' },
                { label: 'Game Engine', value: 'Phaser.js → R3F (3D)', icon: '🎮' },
              ].map((item, i) => (
                <motion.div key={item.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  className="glass rounded-2xl p-6">
                  <p className="text-2xl mb-3">{item.icon}</p>
                  <p className="text-xs text-dark-500 uppercase tracking-widest">{item.label}</p>
                  <p className="font-bold text-lg">{item.value}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ===== 7. ROADMAP ===== */}
          <section id="roadmap">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Roadmap</h2>
              <p className="text-dark-300 text-lg">6 months to mainnet. Aggressive but achievable.</p>
            </motion.div>

            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-dark-700 hidden md:block" />
              {ROADMAP.map((item, i) => (
                <motion.div key={item.month} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="flex gap-6 mb-6 relative">
                  <div className="hidden md:flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm"
                      style={{ backgroundColor: item.color, color: item.status === 'upcoming' ? '#94a3b8' : '#fff' }}>
                      {item.month}
                    </div>
                  </div>
                  <div className={`flex-1 glass rounded-2xl p-6 ${item.status === 'current' ? 'border-2 border-yellow-500/40 bg-yellow-500/5' : item.status === 'done' ? 'border border-green-500/20' : 'opacity-60'}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="md:hidden font-bold text-sm" style={{ color: item.color }}>{item.month}</span>
                      <h3 className="font-display font-bold text-lg">{item.title}</h3>
                      {item.status === 'current' && <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full animate-pulse">CURRENT</span>}
                      {item.status === 'done' && <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">DONE ✓</span>}
                      {item.status === 'upcoming' && <span className="text-xs bg-dark-600 text-dark-400 px-2 py-0.5 rounded-full">UPCOMING</span>}
                    </div>
                    <p className="text-sm text-dark-400">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ===== 8. TEAM ===== */}
          <section id="team">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Team</h2>
            </motion.div>

            <div className="glass rounded-2xl p-8 border border-yellow-500/20 mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center text-2xl font-bold">R</div>
                <div>
                  <h3 className="font-display font-bold text-xl">Riz (draycolix)</h3>
                  <p className="text-dark-400">Founder · Smart Contract Dev · Game Designer</p>
                </div>
              </div>
              <p className="text-sm text-dark-300 mb-4">Full-stack TS, Laravel, Solana dev. Open source contributor. 4+ PRs in Solana ecosystem.</p>
              <div className="flex gap-3 text-sm">
                <a href="https://github.com/draycolix" target="_blank" className="glass px-4 py-2 rounded-xl hover:text-yellow-400 transition-colors">🐙 GitHub</a>
                <a href="mailto:draycolix@gmail.com" className="glass px-4 py-2 rounded-xl hover:text-yellow-400 transition-colors">📧 Email</a>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {['Marketing Lead', 'Game Artist', 'Smart Contract Auditor', 'Community Manager'].map(role => (
                <div key={role} className="glass rounded-xl p-4 flex items-center gap-3 border border-dashed border-dark-600">
                  <span className="text-xl">🔍</span>
                  <div><p className="font-bold text-sm">{role}</p><p className="text-xs text-dark-500">Open role — comp/equity</p></div>
                </div>
              ))}
            </div>
          </section>

          {/* ===== 9. RISK ===== */}
          <section id="risk">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Risk & Mitigation</h2>
            </motion.div>

            <div className="space-y-3">
              {RISKS.map((r, i) => (
                <motion.div key={r.risk} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  className="glass rounded-xl p-4 md:p-5">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="font-bold flex-1 min-w-[200px]">{r.risk}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${getProbColor(r.prob)}`}>Prob: {r.prob}</span>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getImpactColor(r.impact)}`}>Impact: {r.impact}</span>
                  </div>
                  <p className="text-sm text-dark-400"><strong className="text-green-400">Mitigation:</strong> {r.mitigation}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ===== 10. CONCLUSION ===== */}
          <section id="conclusion">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="glass rounded-3xl p-8 md:p-12 text-center border border-yellow-500/20">
              <p className="text-5xl mb-6">💎</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">Conclusion</h2>
              <p className="text-dark-300 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
                VeinLegends is positioned to be the <strong className="text-white">first sustainable Web3 game on Solana</strong> with
                a deflationary token model, skill-based mechanics, and real utility.
              </p>

              <div className="grid sm:grid-cols-3 gap-4 max-w-xl mx-auto mb-8">
                {[
                  { label: 'Self-reinforcing flywheel', icon: '🔄' },
                  { label: 'Multiple demand drivers', icon: '📈' },
                  { label: 'Real gameplay depth', icon: '🎮' },
                  { label: 'Mobile-first design', icon: '📱' },
                  { label: 'Clear regulatory position', icon: '⚖' },
                  { label: '6-month achievable roadmap', icon: '🗺' },
                ].map(item => (
                  <div key={item.label} className="bg-dark-800/50 rounded-xl p-4 text-center">
                    <p className="text-2xl mb-2">{item.icon}</p>
                    <p className="text-xs text-dark-300">{item.label}</p>
                  </div>
                ))}
              </div>

              <div className="glass rounded-2xl p-6 max-w-lg mx-auto">
                <p className="text-sm text-dark-400 mb-1">Funding Ask</p>
                <p className="font-display font-bold text-3xl text-yellow-400">$200K–$500K</p>
                <p className="text-sm text-dark-400 mt-1">Pre-seed for 12-month runway</p>
              </div>

              <div className="mt-8 text-sm text-dark-500">
                <p>Contact: <span className="text-dark-300">draycolix@gmail.com</span> · <span className="text-dark-300">@draycolix on X</span></p>
                <p className="mt-1">License: MIT (code) / CC BY-SA 4.0 (this document)</p>
              </div>
            </motion.div>
          </section>
        </div>

        {/* Back to top */}
        <div className="text-center pb-16">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="glass px-6 py-3 rounded-xl text-sm hover:text-yellow-400 transition-colors">
            ↑ Back to Top
          </button>
        </div>
      </main>
    </div>
  );
}
