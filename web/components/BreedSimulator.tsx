'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Character, BreedResult } from '@/lib/characters';
import {
  breed,
  getNamedHeroes,
  generateGenericPool,
  BLOODLINES,
  RARITY_CONFIG,
} from '@/lib/characters';
import HeroCard from './HeroCard';

// BURN ANIMATION — gacha reveal stages
type BreedStage = 'idle' | 'burning' | 'revealing' | 'done';

// Combined pool: 6 named heroes + 18 generic warriors = 24 starters
const STARTING_POOL = [...getNamedHeroes(), ...generateGenericPool()];

// Separate named heroes from generic for display purposes
const NAMED_IDS = new Set(getNamedHeroes().map((h) => h.id));

export default function BreedSimulator() {
  const [pool, setPool] = useState<Character[]>(() => STARTING_POOL);
  const [parentA, setParentA] = useState<Character | null>(null);
  const [parentB, setParentB] = useState<Character | null>(null);
  const [result, setResult] = useState<BreedResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stage, setStage] = useState<BreedStage>('idle');
  const [totalBurned, setTotalBurned] = useState(0);
  const [totalBreeds, setTotalBreeds] = useState(0);
  const [isSimulation, setIsSimulation] = useState(false);

  const handleGachaPull = () => {
    // Simulate breed: pick 2 random breedable parents, show offspring preview
    // Does NOT modify pool — just shows what a breed WOULD produce
    const breedable = pool.filter((c) => {
      if (c.generation >= 7) return false;
      const genLimits = [7, 5, 4, 3, 2, 1, 1];
      return c.breedCount < Math.min(RARITY_CONFIG[c.rarity].breedLimit, genLimits[Math.min(c.generation, 6)]);
    });
    if (breedable.length < 2) { setError('Need 2 breedable characters for simulation.'); return; }
    
    // Pick 2 random distinct parents
    const shuffled = [...breedable].sort(() => Math.random() - 0.5);
    const a = shuffled[0];
    const b = shuffled[1];
    
    setParentA(a);
    setParentB(b);
    setError(null);
    const res = breed(a, b);
    if ('error' in res) { setError(res.error); return; }
    
    setStage('burning');
    setResult(res);
    setIsSimulation(true);
    setTimeout(() => setStage('revealing'), 1500);
    setTimeout(() => {
      // Show preview but DON'T modify pool
      setStage('done');
    }, 3000);
  };

  const maxBreeds = (c: Character) => {
    const genLimits = [7, 5, 4, 3, 2, 1, 1];
    return Math.min(
      RARITY_CONFIG[c.rarity].breedLimit,
      genLimits[Math.min(c.generation, 6)]
    );
  };

  const isDisabled = (c: Character) => {
    if (c.generation >= 7) return true;
    if (c.breedCount >= maxBreeds(c)) return true;
    return false;
  };

  const disableReason = (c: Character): string | undefined => {
    if (c.generation >= 7) return 'Sterile (Gen 7+)';
    if (c.breedCount >= maxBreeds(c)) return `Max breeds (${maxBreeds(c)})`;
    return undefined;
  };

  const handleBreed = () => {
    if (!parentA || !parentB) return;
    setError(null);

    const res = breed(parentA, parentB);
    if ('error' in res) {
      setError(res.error);
      return;
    }

    // Stage 1: BURN parents (animation)
    setStage('burning');
    setResult(res);
    setIsSimulation(false);

    // Stage 2: GACHA REVEAL after burn
    setTimeout(() => setStage('revealing'), 1500);

    // Stage 3: Done — update pool (remove burned, add 2 offsprings)
    setTimeout(() => {
      setPool((prev) => [
        ...prev.filter(
          (c) => c.id !== parentA.id && c.id !== parentB.id
        ),
        ...res.offsprings,
      ]);
      setParentA(null);
      setParentB(null);
      setTotalBurned((p) => p + 2);
      setTotalBreeds((p) => p + 1);
      setStage('done');
    }, 3000);
  };

  const handleReset = () => {
    setParentA(null);
    setParentB(null);
    setResult(null);
    setError(null);
    setStage('idle');
  };

  const availablePool = useMemo(
    () =>
      pool.filter((c) => {
        if (parentA && c.id === parentA.id) return false;
        if (parentB && c.id === parentB.id) return false;
        return true;
      }),
    [pool, parentA, parentB]
  );

  return (
    <section id="breed" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-block px-4 py-1.5 rounded-full glass text-sm text-secondary-400 font-medium mb-4">
            Breeding Simulator
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Forge your <span className="text-shimmer">Bloodline</span>
          </h2>
          <p className="text-lg text-dark-200 max-w-2xl mx-auto">
            🔥 <strong>Burn-to-Breed:</strong> both parents are <span className="text-red-400">permanently destroyed</span> 
            — 2 new offspring born with independent gacha rarity rolls.
            <span className="text-blue-400"> Supply-neutral.</span>
          </p>
        </motion.div>

        {/* Breeding Area */}
        <div className="grid lg:grid-cols-[1fr_auto_1fr] gap-6 items-start mb-12">
          {/* Parent A */}
          <div>
            <h3 className="font-display text-lg font-bold text-center mb-4 text-dark-200">
              Parent A
            </h3>
            {parentA ? (
              <div className="relative">
                <HeroCard
                  character={parentA}
                  size="lg"
                  selected
                  onClick={() => setParentA(null)}
                />
                <button
                  onClick={() => setParentA(null)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-xs font-bold flex items-center justify-center hover:bg-red-400 transition-colors"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="glass rounded-2xl p-8 text-center border-2 border-dashed border-dark-600 min-h-[200px] flex items-center justify-center">
                <p className="text-dark-400 text-sm">Select a parent below</p>
              </div>
            )}
          </div>

          {/* Breed Button (middle) */}
          <div className="flex flex-col items-center justify-center gap-4 pt-12">
            <motion.button
              whileHover={parentA && parentB && stage === 'idle' ? { scale: 1.05 } : {}}
              whileTap={parentA && parentB && stage === 'idle' ? { scale: 0.95 } : {}}
              onClick={handleBreed}
              disabled={!parentA || !parentB || stage !== 'idle'}
              className={`
                px-8 py-4 rounded-2xl font-bold text-lg transition-all
                ${
                  parentA && parentB && stage === 'idle'
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-2xl shadow-red-500/40 hover:shadow-red-500/70'
                    : 'bg-dark-700 text-dark-400 cursor-not-allowed'
                }
              `}
            >
              {stage === 'burning' ? '🔥 Burning...' : stage === 'revealing' ? '✨ Summoning...' : '🔥 Burn & Breed'}
            </motion.button>

            {/* Cost preview */}
            {parentA && parentB && stage === 'idle' && (
              <div className="glass rounded-xl px-4 py-2 text-center">
                <p className="text-xs text-dark-400 mb-1">Breed Cost</p>
                <p className="font-mono font-bold text-yellow-400">
                  {Math.round(
                    1000 *
                      Math.pow(
                        1.5,
                        Math.max(parentA.generation, parentB.generation)
                      )
                  ).toLocaleString()}{' '}
                  $VEIN
                </p>
                <p className="text-xs text-dark-400">+ 500 Ore</p>
                <p className="text-xs text-red-400">25% Burned 🔥</p>
                <div className="mt-2 pt-2 border-t border-dark-600">
                  <p className="text-xs text-red-400 font-bold">⚠ Both parents destroyed</p>
                  <p className="text-[10px] text-dark-500">Supply: stable (2 burned → 2 born)</p>
                </div>
              </div>
            )}

            {error && (
              <div className="glass rounded-xl px-4 py-2 border border-red-500/30">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}
          </div>

          {/* Parent B */}
          <div>
            <h3 className="font-display text-lg font-bold text-center mb-4 text-dark-200">
              Parent B
            </h3>
            {parentB ? (
              <div className="relative">
                <HeroCard
                  character={parentB}
                  size="lg"
                  selected
                  onClick={() => setParentB(null)}
                />
                <button
                  onClick={() => setParentB(null)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-xs font-bold flex items-center justify-center hover:bg-red-400 transition-colors"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="glass rounded-2xl p-8 text-center border-2 border-dashed border-dark-600 min-h-[200px] flex items-center justify-center">
                <p className="text-dark-400 text-sm">Select a parent below</p>
              </div>
            )}
          </div>
        </div>

        {/* BURN-TO-BREED Animation */}
        <AnimatePresence>
          {(stage === 'burning' || stage === 'revealing' || stage === 'done') && result && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto mb-12"
            >
              {/* Stage: BURNING — both parents in flames */}
              {stage === 'burning' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center mb-6"
                >
                  <motion.p
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
                    className="text-4xl mb-2"
                  >
                    🔥🔥
                  </motion.p>
                  <p className="text-xl font-bold text-red-400 font-display">
                    BURNING PARENTS
                  </p>
                  <p className="text-dark-400 text-sm">
                    {result.burnedParents[0].name} + {result.burnedParents[1].name} are being sacrificed...
                  </p>
                </motion.div>
              )}

              {/* Parents being burned (side by side, fading) */}
              {stage === 'burning' && (
                <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
                  {result.burnedParents.map((parent, i) => (
                    <motion.div
                      key={parent.id}
                      initial={{ opacity: 1, scale: 1, filter: 'brightness(1)' }}
                      animate={{
                        opacity: 0,
                        scale: 0.8,
                        filter: 'brightness(2) saturate(0)',
                      }}
                      transition={{ duration: 1.2, delay: i * 0.2 }}
                      className="relative"
                    >
                      <HeroCard character={parent} size="sm" />
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-red-600/80 via-orange-500/40 to-transparent rounded-2xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 + i * 0.2 }}
                      />
                      <motion.p
                        className="absolute bottom-2 left-0 right-0 text-center text-xs font-bold text-white"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 + i * 0.2 }}
                      >
                        BURNED
                      </motion.p>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Stage: GACHA REVEAL — spinning rarity */}
              {stage === 'revealing' && (
                <div className="flex flex-col items-center">
                  {/* Burned parents crossed out */}
                  <div className="flex items-center gap-3 mb-6 text-dark-500">
                    <span className="line-through text-sm">{result.burnedParents[0].name}</span>
                    <span className="text-red-400 text-lg">✕</span>
                    <span className="line-through text-sm">{result.burnedParents[1].name}</span>
                    <span className="text-dark-500 mx-2">→</span>
                    <span className="text-dark-400 text-sm">???</span>
                  </div>

                  {/* Gacha card flip animation */}
                  <motion.div
                    initial={{ rotateY: 0 }}
                    animate={{ rotateY: [0, 180, 360] }}
                    transition={{ duration: 1.0, ease: 'easeInOut' }}
                    className="w-64 h-64 flex items-center justify-center"
                  >
                    <div className="text-center">
                      <motion.p
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 0.3, repeat: 3 }}
                        className="text-5xl mb-3"
                      >
                        🎴
                      </motion.p>
                      <p className="text-sm text-dark-400 animate-pulse">
                        Rolling rarity...
                      </p>
                    </div>
                  </motion.div>
                </div>
              )}

              {/* Stage: DONE — show offspring */}
              {stage === 'done' && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center"
                >
                  {/* Supply change indicator */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass rounded-full px-4 py-1 mb-4 flex items-center gap-2 text-xs"
                  >
                    {isSimulation ? (
                      <>
                        <span className="text-purple-400">🎴 Simulation</span>
                        <span className="text-dark-500">→</span>
                        <span className="text-dark-300">Pool unchanged</span>
                      </>
                    ) : (
                      <>
                        <span className="text-red-400">-2 {result.burnedParents[0].name}, {result.burnedParents[1].name}</span>
                        <span className="text-dark-500">→</span>
                        <span className="text-green-400 font-bold">+2 New Heroes</span>
                        <span className="text-dark-500">=</span>
                        <span className="text-blue-400 font-bold">Net Zero</span>
                      </>
                    )}
                  </motion.div>

                  <div className="text-center mb-4">
                    <span className="text-dark-400 text-sm">Offsprings (2 born)</span>
                  </div>

                  {/* Two offspring cards side by side */}
                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                    {result.offsprings.map((kid, i) => (
                      <motion.div
                        key={kid.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + i * 0.2 }}
                      >
                        <HeroCard
                          character={kid}
                          size="sm"
                        />
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex justify-center gap-4 mt-4">
                    <button
                      onClick={handleReset}
                      className="px-6 py-2 glass text-dark-200 rounded-xl hover:bg-dark-700/50 transition-colors text-sm"
                    >
                      ← Breed Again
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Character Pool */}
        <div>
          <div className="flex items-center justify-center gap-4 mb-6">
            <h3 className="font-display text-lg font-bold text-dark-300">
              Character Pool ({pool.length})
            </h3>
            {totalBreeds > 0 && (
              <div className="flex gap-3 text-xs text-dark-500">
                <span>Breeds: <span className="text-yellow-400">{totalBreeds}</span></span>
                <span>Burned: <span className="text-red-400">{totalBurned}</span></span>
                <span>Net: <span className="text-green-400">{pool.length - STARTING_POOL.length}</span></span>
              </div>
            )}
          </div>

          {/* Gacha Pull + Rarity Breakdown */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGachaPull}
              className="px-5 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-dark-900 rounded-xl font-bold text-sm shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 transition-all"
            >
              🎴 Simulate Breed
            </motion.button>
            <div className="flex gap-3 text-[11px] text-dark-500">
              <span className="text-purple-400">Pick 2 random → preview</span>
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2.5">
            {pool.map((c) => (
              <HeroCard
                key={c.id}
                character={c}
                size="sm"
                disabled={
                  isDisabled(c) ||
                  (parentA !== null && parentB !== null && c.id !== parentA?.id && c.id !== parentB?.id)
                }
                disabledReason={disableReason(c)}
                onClick={() => {
                  if (isDisabled(c)) return;
                  if (!parentA) setParentA(c);
                  else if (!parentB && c.id !== parentA.id) setParentB(c);
                }}
              />
            ))}
          </div>
        </div>

        {/* Breeding Rules */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="glass rounded-2xl p-6 mt-12"
        >
          <h4 className="font-display font-bold text-dark-200 mb-4 text-center">
            🔥 Burn-to-Breed Rules
          </h4>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-dark-400">
            <div className="bg-dark-800/50 rounded-xl p-3">
              <span className="text-red-400 font-bold">🔥 Destructive</span>
              <p>Both parent characters are PERMANENTLY BURNED. 2 born per breed. Net supply stays stable — no inflation, no deflation.</p>
            </div>
            <div className="bg-dark-800/50 rounded-xl p-3">
              <span className="text-purple-400 font-bold">🎴 Gacha Rarity</span>
              <p>Offspring rarity is a random roll. Legendary × Legendary = 60% Legendary. Higher risk, higher reward.</p>
            </div>
            <div className="bg-dark-800/50 rounded-xl p-3">
              <span className="text-blue-400 font-bold">🧬 Stats + Gen</span>
              <p>60% parent avg + 40% bloodline base × rarity multiplier. +1 generation. Gen 7+ = sterile.</p>
            </div>
            <div className="bg-dark-800/50 rounded-xl p-3">
              <span className="text-yellow-400 font-bold">💰 Cost</span>
              <p>Base: 1,000 $VEIN + 500 ore. 1.5× per generation. 25% permanently burned. Both characters destroyed.</p>
            </div>
          </div>

          {/* Supply Economics */}
          <div className="mt-6 bg-dark-800/30 rounded-xl p-4">
            <h5 className="font-display font-bold text-sm text-dark-200 mb-3 text-center">
              📊 Supply Economics
            </h5>
            <div className="grid grid-cols-3 gap-4 text-center text-xs">
              <div>
                <p className="text-dark-500">Starting Supply</p>
                <p className="text-white font-bold text-lg">{STARTING_POOL.length}</p>
              </div>
              <div>
                <p className="text-dark-500">Current Supply</p>
                <p className="text-yellow-400 font-bold text-lg">{pool.length}</p>
              </div>
              <div>
                <p className="text-dark-500">Net Change</p>
                <p className="text-blue-400 font-bold text-lg">
                  {pool.length === STARTING_POOL.length ? 'Stable ✅' : pool.length > STARTING_POOL.length ? `+${pool.length - STARTING_POOL.length}` : `${pool.length - STARTING_POOL.length}`}
                </p>
              </div>
            </div>
            <p className="text-[10px] text-dark-600 text-center mt-2">
              Supply-neutral: 2 parents burned → 2 offspring born. Population stays stable; rarity becomes the real grind.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
