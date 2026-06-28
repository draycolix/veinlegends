'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Character } from '@/lib/characters';
import { getNamedHeroes, generateGenericPool, BLOODLINES, RARITY_CONFIG } from '@/lib/characters';
import {
  createInitialState,
  deployCharacter,
  undeployCharacter,
  claimSlot,
  claimAll,
  unlockSlot,
  activateBoost,
  getMiningRate,
  getBoostedMiningRate,
  getAccumulated,
  getTotalMiningRate,
  getTotalAccumulated,
  formatRate,
  saveMiningState,
  loadMiningState,
  BOOSTS,
  type MiningState,
  type MiningSlot,
  type MiningBoostType,
} from '@/lib/mining';
import { getWeapon } from '@/lib/weapons';
import HeroCard from './HeroCard';

const POOL = [...getNamedHeroes(), ...generateGenericPool()];

export default function MiningDashboard() {
  const [miningState, setMiningState] = useState<MiningState>(() => {
    const saved = loadMiningState();
    return saved || createInitialState();
  });
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [showPool, setShowPool] = useState(false);
  const [claimAnim, setClaimAnim] = useState(0);
  const [unlockError, setUnlockError] = useState('');
  const tickRef = useRef<number>(0);

  // Real-time tick every second
  useEffect(() => {
    const timer = setInterval(() => {
      tickRef.current++;
      setMiningState(prev => {
        // Tick boost timers
        const activeBoosts = prev.activeBoosts
          .map(b => ({ ...b, remainingMs: b.remainingMs - 1000 }))
          .filter(b => b.remainingMs > 0);
        return { ...prev, activeBoosts };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Persist state
  useEffect(() => {
    saveMiningState(miningState);
  }, [miningState]);

  const totalRate = getTotalMiningRate(miningState);
  const totalAcc = getTotalAccumulated(miningState);
  const totalMined = miningState.totalClaimed + totalAcc;
  const activeSlots = miningState.slots.filter(s => s.character && !s.locked);

  // --- SLOT ACTIONS ---
  const handleDeploy = (char: Character) => {
    if (selectedSlot === null) return;
    setMiningState(prev => deployCharacter(prev, selectedSlot, char));
    setSelectedSlot(null);
    setShowPool(false);
  };

  const handleUndeploy = (slotId: number) => {
    // Find character being undeployed to reclaim it
    setMiningState(prev => undeployCharacter(prev, slotId));
  };

  const handleClaimSlot = (slotId: number) => {
    setMiningState(prev => {
      const slot = prev.slots.find(s => s.id === slotId);
      if (slot?.character) {
        const acc = getAccumulated(slot);
        setClaimAnim(acc);
        setTimeout(() => setClaimAnim(0), 2000);
      }
      return claimSlot(prev, slotId);
    });
  };

  const handleClaimAll = () => {
    setMiningState(prev => {
      const acc = getTotalAccumulated(prev);
      setClaimAnim(acc);
      setTimeout(() => setClaimAnim(0), 2000);
      const result = claimAll(prev);
      return result.state;
    });
  };

  const handleUnlock = (slotId: number) => {
    setMiningState(prev => {
      const result = unlockSlot(prev, slotId);
      if ('error' in result) {
        setUnlockError(result.error);
        setTimeout(() => setUnlockError(''), 3000);
        return prev;
      }
      setUnlockError('');
      return result;
    });
  };

  const handleBoost = (type: MiningBoostType) => {
    setMiningState(prev => {
      const result = activateBoost(prev, type);
      if ('error' in result) return prev;
      return result;
    });
  };

  const deployedCharIds = new Set(
    miningState.slots.filter(s => s.character && !s.locked).map(s => s.character!.id)
  );

  return (
    <section id="mining" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-block px-4 py-1.5 rounded-full glass text-sm text-yellow-400 font-medium mb-4">
            ⛏ Idle Mining
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Mine <span className="text-shimmer">$VEIN</span>
          </h2>
          <p className="text-lg text-dark-200 max-w-2xl mx-auto">
            Deploy warriors to the mines. Better MINING stat = faster $VEIN. 
            Works offline — claim anytime!
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <StatCard
            icon="💰"
            label="Total $VEIN"
            value={`${Math.floor(totalMined).toLocaleString()}`}
            color="text-yellow-400"
          />
          <StatCard
            icon="⚡"
            label="Mining Rate"
            value={`${formatRate(totalRate)}/hr`}
            color="text-cyan-400"
          />
          <StatCard
            icon="⛏"
            label="Active Miners"
            value={`${activeSlots.length}/${miningState.unlockedSlots}`}
            color="text-green-400"
          />
          <StatCard
            icon="🎒"
            label="Claimable"
            value={`${Math.floor(totalAcc).toLocaleString()}`}
            color="text-orange-400"
            pulse={totalAcc > 0}
          />
        </motion.div>

        {/* CLAIM ALL Button */}
        {totalAcc > 0 && (
          <div className="text-center mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClaimAll}
              className="px-10 py-4 bg-gradient-to-r from-yellow-500 to-amber-600 text-dark-900 rounded-2xl font-bold text-xl shadow-2xl shadow-yellow-500/30"
            >
              💰 CLAIM {Math.floor(totalAcc).toLocaleString()} $VEIN
            </motion.button>
          </div>
        )}

        {/* Claim animation */}
        <AnimatePresence>
          {claimAnim > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.5 }}
              animate={{ opacity: 1, y: -40, scale: 1 }}
              exit={{ opacity: 0, y: -80 }}
              className="fixed top-1/3 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
            >
              <div className="text-4xl font-display font-bold text-yellow-400 drop-shadow-2xl">
                +{claimAnim.toLocaleString()} $VEIN
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mining Slots Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {miningState.slots.map(slot => (
            <MiningSlotCard
              key={slot.id}
              slot={slot}
              isSelected={selectedSlot === slot.id}
              onClick={() => {
                if (slot.locked) {
                  handleUnlock(slot.id);
                } else if (slot.character) {
                  // Click to claim or manage
                } else {
                  setSelectedSlot(selectedSlot === slot.id ? null : slot.id);
                  setShowPool(true);
                }
              }}
              onClaim={() => handleClaimSlot(slot.id)}
              onUndeploy={() => handleUndeploy(slot.id)}
              activeBoosts={miningState.activeBoosts}
            />
          ))}
        </div>

        {unlockError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-red-400 text-sm mb-4"
          >
            {unlockError}
          </motion.div>
        )}

        {/* Boosts */}
        <div className="glass rounded-2xl p-6 mb-8">
          <h4 className="font-display font-bold text-dark-200 mb-4 flex items-center gap-2">
            ⚗ Mining Boosts
            {miningState.activeBoosts.filter(b => b.remainingMs > 0).length > 0 && (
              <span className="text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">
                {miningState.activeBoosts.filter(b => b.remainingMs > 0).length} active
              </span>
            )}
          </h4>
          <div className="grid sm:grid-cols-3 gap-3">
            {(Object.entries(BOOSTS) as [MiningBoostType, typeof BOOSTS[MiningBoostType]][]).map(([type, def]) => {
              if (type === 'none') return null;
              const active = miningState.activeBoosts.find(b => b.type === type && b.remainingMs > 0);
              const minutesLeft = active ? Math.ceil(active.remainingMs / 60000) : 0;

              return (
                <motion.button
                  key={type}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleBoost(type)}
                  disabled={!!active}
                  className={`relative rounded-xl p-4 text-left transition-all ${
                    active
                      ? 'bg-green-500/10 border border-green-500/30'
                      : 'bg-dark-800/50 border border-dark-700 hover:border-yellow-500/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{def.icon}</span>
                    <div>
                      <p className="font-display font-bold text-sm text-dark-100">{def.name}</p>
                      <p className="text-xs text-dark-400">+{Math.round((def.multiplier - 1) * 100)}% mining · {def.durationMs / 3600000}h</p>
                      {active ? (
                        <p className="text-xs text-green-400 mt-1">Active · {minutesLeft}m left</p>
                      ) : (
                        <p className="text-xs text-yellow-400 mt-1">{def.cost} $VEIN</p>
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Warrior Pool (for deployment) */}
        <AnimatePresence>
          {showPool && selectedSlot !== null && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="glass rounded-2xl p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-display font-bold text-dark-200">
                    Deploy to Slot #{selectedSlot}
                  </h4>
                  <button
                    onClick={() => { setSelectedSlot(null); setShowPool(false); }}
                    className="text-dark-400 hover:text-dark-200"
                  >
                    ✕ Cancel
                  </button>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2.5 max-h-96 overflow-y-auto">
                  {POOL.filter(c => !deployedCharIds.has(c.id)).map(c => (
                    <HeroCard
                      key={c.id}
                      character={c}
                      size="sm"
                      onClick={() => handleDeploy(c)}
                    />
                  ))}
                  {POOL.filter(c => !deployedCharIds.has(c.id)).length === 0 && (
                    <p className="text-dark-500 text-sm col-span-full text-center py-8">
                      All warriors are deployed. Breed more or pull gacha!
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mining Rate Reference */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="glass rounded-2xl p-6"
        >
          <h4 className="font-display font-bold text-dark-200 mb-4 text-center">
            📊 Mining Rate Calculator
          </h4>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs text-dark-400">
            <div className="bg-dark-800/50 rounded-xl p-3">
              <p className="font-bold text-dark-200 mb-1">Formula</p>
              <p className="font-mono text-dark-500">
                Rate = 3 × MINING × RARITY × BLOODLINE × GEN
              </p>
            </div>
            <div className="bg-dark-800/50 rounded-xl p-3">
              <p className="font-bold text-dark-200 mb-1">Rarity Multiplier</p>
              {(['Common', 'Rare', 'Epic', 'Legendary'] as const).map(r => (
                <p key={r} className="font-mono">
                  {r}: ×{RARITY_CONFIG[r].statMultiplier}
                </p>
              ))}
            </div>
            <div className="bg-dark-800/50 rounded-xl p-3">
              <p className="font-bold text-dark-200 mb-1">Bloodline Bonus</p>
              <p className="font-mono">⛏ Delver: ×1.5 mining</p>
              <p className="font-mono text-dark-500">Others: ×1.0</p>
              <p className="font-bold text-dark-200 mt-2 mb-1">Generation Penalty</p>
              <p className="font-mono text-dark-500">Gen 0: ×1.0 → Gen 6: ×0.7</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-yellow-500/5 rounded-xl border border-yellow-500/10">
            <p className="text-xs text-dark-400 text-center">
              ⚡ <span className="text-yellow-400">Pro tip:</span> Deploy Delver bloodline for mining. 
              Breed high-MINING-stat characters. Stack Vein Tea + Crystal Infusion for 1.875× rate.
              Max theoretical: Legendary Gen 0 Delver (MINING 10) ={' '}
              <span className="text-yellow-400 font-bold">
                {getMiningRate({
                  id: 'x', name: 'Max Delver', bloodline: 'Delver', rarity: 'Legendary',
                  generation: 0, stats: { mining: 10, battle: 0, hp: 0 }, breedCount: 0,
                } as Character)} $VEIN/hr
              </span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================
// STAT CARD
// ============================================================

function StatCard({
  icon, label, value, color, pulse,
}: {
  icon: string; label: string; value: string; color: string; pulse?: boolean;
}) {
  return (
    <div className="glass rounded-2xl p-4 text-center">
      <p className="text-2xl mb-1">{icon}</p>
      <p className={`font-display font-bold text-xl ${color} ${pulse ? 'animate-pulse' : ''}`}>
        {value}
      </p>
      <p className="text-xs text-dark-500 mt-0.5">{label}</p>
    </div>
  );
}

// ============================================================
// MINING SLOT CARD
// ============================================================

function MiningSlotCard({
  slot,
  isSelected,
  onClick,
  onClaim,
  onUndeploy,
  activeBoosts,
}: {
  slot: MiningSlot;
  isSelected: boolean;
  onClick: () => void;
  onClaim: () => void;
  onUndeploy: () => void;
  activeBoosts: MiningState['activeBoosts'];
}) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // LOCKED SLOT
  if (slot.locked) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        onClick={onClick}
        className="glass rounded-2xl p-6 border-2 border-dashed border-dark-600 cursor-pointer hover:border-yellow-500/30 transition-colors text-center"
      >
        <p className="text-4xl mb-3">🔒</p>
        <p className="font-display font-bold text-dark-300 mb-1">Slot #{slot.id}</p>
        <p className="text-sm text-dark-500 mb-2">Locked</p>
        <p className="text-xs text-yellow-400 font-bold">
          🔓 Unlock: {slot.unlockCost.toLocaleString()} $VEIN
        </p>
      </motion.div>
    );
  }

  // EMPTY SLOT
  if (!slot.character) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        onClick={onClick}
        className={`glass rounded-2xl p-6 border-2 border-dashed cursor-pointer transition-colors ${
          isSelected
            ? 'border-yellow-500 bg-yellow-500/5'
            : 'border-dark-600 hover:border-yellow-500/30'
        }`}
      >
        <div className="text-center">
          <p className="text-3xl mb-2">⛏</p>
          <p className="font-display font-bold text-dark-300 text-sm">Slot #{slot.id}</p>
          <p className="text-dark-500 text-xs mt-1">Click to deploy</p>
        </div>
      </motion.div>
    );
  }

  // ACTIVE MINING SLOT
  const char = slot.character;
  const rate = getBoostedMiningRate(char, activeBoosts);
  const acc = getAccumulated(slot);
  const bl = BLOODLINES[char.bloodline];
  const rc = RARITY_CONFIG[char.rarity];
  const weapon = getWeapon(char.bloodline, char.rarity);

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={`glass rounded-2xl p-4 border-2 transition-all ${
        acc > 0
          ? 'border-yellow-500/30 bg-yellow-500/3'
          : 'border-dark-600'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Character icon */}
        <div className="w-12 h-12 rounded-xl bg-dark-700 flex items-center justify-center text-2xl flex-shrink-0">
          {bl.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-display font-bold text-sm truncate">{char.name}</p>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${rc.textColor} bg-dark-900/60`}>
              {rc.label}
            </span>
          </div>
          <p className="text-xs text-dark-500">{bl.icon}{' '}{char.bloodline} · MINING {char.stats.mining}</p>
          <p className="text-[9px] truncate" style={{ color: weapon.glowColor }}>
            {weapon.icon} {weapon.name}
          </p>

          {/* Stats */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div>
              <p className="text-[9px] text-dark-500 uppercase">Rate</p>
              <p className="font-mono font-bold text-sm text-cyan-400">
                {formatRate(rate)}/hr
              </p>
            </div>
            <div>
              <p className="text-[9px] text-dark-500 uppercase">Accumulated</p>
              <p className={`font-mono font-bold text-sm ${acc > 0 ? 'text-yellow-400' : 'text-dark-500'}`}>
                {acc.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Total mined */}
          <p className="text-[10px] text-dark-600 mt-2">
            Lifetime: {slot.totalMined.toLocaleString()} $VEIN
          </p>

          {/* Buttons */}
          <div className="flex gap-2 mt-3">
            {acc > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => { e.stopPropagation(); onClaim(); }}
                className="flex-1 px-3 py-2 bg-yellow-500/20 text-yellow-400 rounded-xl text-xs font-bold hover:bg-yellow-500/30"
              >
                💰 Claim {acc.toLocaleString()}
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => { e.stopPropagation(); onUndeploy(); }}
              className="px-3 py-2 bg-red-500/10 text-red-400 rounded-xl text-xs font-bold hover:bg-red-500/20"
            >
              Remove
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
