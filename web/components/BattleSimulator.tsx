'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Character } from '@/lib/characters';
import { getNamedHeroes, generateGenericPool } from '@/lib/characters';
import type { ActiveCard } from '@/lib/cards';
import {
  initBattle,
  startTurn,
  playCard,
  aiTurn,
  endTurn,
  autoBattle,
  type BattleState,
  type BattleFighter,
  type BattleEvent,
} from '@/lib/battle';
import HeroCard from './HeroCard';

const STARTING_POOL = [...getNamedHeroes(), ...generateGenericPool()];

export default function BattleSimulator() {
  const [pool] = useState<Character[]>(() => STARTING_POOL);
  const [team1, setTeam1] = useState<Character[]>([]);
  const [team2, setTeam2] = useState<Character[]>([]);
  const [battle, setBattle] = useState<BattleState | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const [animCard, setAnimCard] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [selectedEnemy, setSelectedEnemy] = useState<number>(0);

  const maxTeamSize = 3;
  const teamReady = team1.length === maxTeamSize && team2.length === maxTeamSize;

  // --- TEAM SELECTION ---
  const toggleTeam1 = (c: Character) => {
    if (battle) return;
    setTeam1(prev =>
      prev.find(p => p.id === c.id)
        ? prev.filter(p => p.id !== c.id)
        : prev.length < maxTeamSize ? [...prev, c] : prev
    );
  };

  const toggleTeam2 = (c: Character) => {
    if (battle) return;
    setTeam2(prev =>
      prev.find(p => p.id === c.id)
        ? prev.filter(p => p.id !== c.id)
        : prev.length < maxTeamSize ? [...prev, c] : prev
    );
  };

  const isInTeam1 = (id: string) => team1.some(c => c.id === id);
  const isInTeam2 = (id: string) => team2.some(c => c.id === id);

  // --- START BATTLE ---
  const handleStart = () => {
    if (!teamReady) return;
    const state = initBattle(team1, team2);
    setBattle(state);
    setShowLog(false);
  };

  // --- PLAYER ACTIONS ---
  const handlePlayCard = (cardIndex: number) => {
    if (!battle || battle.phase !== 'player_turn') return;
    setAnimCard(battle.hand[cardIndex]?.name || null);
    
    const result = playCard(battle, cardIndex);
    setBattle(result.state);

    setTimeout(() => setAnimCard(null), 500);

    if (result.success && result.state.phase === 'player_turn') {
      // Still player turn after playing
    }
  };

  const handleEndPlayerTurn = () => {
    if (!battle) return;
    // Switch to AI phase
    const nextState: BattleState = { ...battle, phase: 'ai_turn' };
    const afterAi = aiTurn(nextState);
    const afterEnd = endTurn(afterAi);
    setBattle(afterEnd);
  };

  // --- AUTO PLAY ---
  useEffect(() => {
    if (!isAutoPlaying || !battle || battle.phase === 'game_over') {
      if (battle?.phase === 'game_over') setIsAutoPlaying(false);
      return;
    }
    const timer = setTimeout(() => {
      if (!battle || battle.phase === 'game_over') return;
      let mutable = { ...battle };
      
      if (mutable.phase === 'player_turn') {
        // Auto: play cheapest affordable attack card, or pass
        const attackCards = mutable.hand
          .map((c, idx) => ({ card: c, idx }))
          .filter(({ card }) => card.energy <= mutable.energy && card.type === 'attack')
          .sort((a, b) => a.card.energy - b.card.energy);
        
        if (attackCards.length > 0) {
          const result = playCard(mutable, attackCards[0].idx);
          mutable = result.state;
        }
        mutable = { ...mutable, phase: 'ai_turn' };
      }

      if (mutable.phase === 'ai_turn') {
        mutable = aiTurn(mutable);
      }
      
      if (mutable.phase === 'resolve') {
        mutable = endTurn(mutable);
      }
      
      setBattle(mutable);
    }, 1200);
    return () => clearTimeout(timer);
  }, [isAutoPlaying, battle]);

  // --- INSTANT RESOLVE ---
  const handleInstant = () => {
    if (!battle) return;
    const result = autoBattle(battle, 30);
    setBattle(result);
    setIsAutoPlaying(false);
  };

  // --- RESET ---
  const handleReset = () => {
    setBattle(null);
    setIsAutoPlaying(false);
    setShowLog(false);
    setAnimCard(null);
    setHoveredCard(null);
  };

  // --- HELPERS ---
  const getHpPercent = (f: BattleFighter) => Math.max(0, Math.round((f.currentHp / f.maxHp) * 100));
  const getHpColor = (f: BattleFighter) => {
    const pct = getHpPercent(f);
    if (pct > 60) return 'bg-green-500';
    if (pct > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const isSelectedInTeam = (id: string) => isInTeam1(id) || isInTeam2(id);

  return (
    <section id="battle" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-block px-4 py-1.5 rounded-full glass text-sm text-secondary-400 font-medium mb-4">
            ⚔ Axie-Style Battle
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Card Battle <span className="text-shimmer">Arena</span>
          </h2>
          <p className="text-lg text-dark-200 max-w-2xl mx-auto">
            Build a team of 3. Draw cards from your warriors. Play strategically with energy.
            Burn, poison, shield, drain — every card changes the fight.
          </p>
        </motion.div>

        {/* ========== TEAM SELECTION ========== */}
        {!battle && (
          <>
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {/* Team 1 */}
              <div className="glass rounded-2xl p-6 border-2 border-transparent hover:border-yellow-500/30 transition-colors">
                <h3 className="font-display text-lg font-bold mb-4 text-center text-yellow-400">
                  🎮 Your Team ({team1.length}/{maxTeamSize})
                </h3>
                {team1.length > 0 ? (
                  <div className="flex justify-center gap-3">
                    {team1.map(c => (
                      <div key={c.id} className="relative">
                        <HeroCard character={c} size="sm" />
                        <button
                          onClick={() => toggleTeam1(c)}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    {Array.from({ length: maxTeamSize - team1.length }).map((_, i) => (
                      <div key={`empty1-${i}`} className="w-[120px] h-[160px] border-2 border-dashed border-dark-600 rounded-xl flex items-center justify-center">
                        <span className="text-dark-500 text-2xl">+</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-dark-400 text-center text-sm">Click warriors below to add</p>
                )}
              </div>

              {/* Team 2 */}
              <div className="glass rounded-2xl p-6 border-2 border-transparent hover:border-red-500/30 transition-colors">
                <h3 className="font-display text-lg font-bold mb-4 text-center text-red-400">
                  🤖 AI Team ({team2.length}/{maxTeamSize})
                </h3>
                {team2.length > 0 ? (
                  <div className="flex justify-center gap-3">
                    {team2.map(c => (
                      <div key={c.id} className="relative">
                        <HeroCard character={c} size="sm" />
                        <button
                          onClick={() => toggleTeam2(c)}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    {Array.from({ length: maxTeamSize - team2.length }).map((_, i) => (
                      <div key={`empty2-${i}`} className="w-[120px] h-[160px] border-2 border-dashed border-dark-600 rounded-xl flex items-center justify-center">
                        <span className="text-dark-500 text-2xl">+</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-dark-400 text-center text-sm">Click warriors below to add</p>
                )}
              </div>
            </div>

            {/* Start Button */}
            <div className="text-center mb-8">
              <motion.button
                whileHover={teamReady ? { scale: 1.05 } : {}}
                whileTap={teamReady ? { scale: 0.95 } : {}}
                onClick={handleStart}
                disabled={!teamReady}
                className={`px-10 py-4 rounded-2xl font-bold text-xl transition-all ${
                  teamReady
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-2xl shadow-red-500/40'
                    : 'bg-dark-700 text-dark-400 cursor-not-allowed'
                }`}
              >
                ⚔ START BATTLE!
              </motion.button>
            </div>

            {/* Warrior Pool */}
            <div className="mt-8">
              <h3 className="font-display text-lg font-bold text-dark-300 text-center mb-4">
                Warrior Pool ({pool.length}) — Click to pick teams
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2.5">
                {pool.map(c => {
                  const inTeam1 = isInTeam1(c.id);
                  const inTeam2 = isInTeam2(c.id);
                  return (
                    <div key={c.id} className="relative">
                      <HeroCard
                        character={c}
                        size="sm"
                        selected={inTeam1 || inTeam2}
                        disabled={isSelectedInTeam(c.id) && !inTeam1 && !inTeam2}
                        onClick={() => {
                          if (!inTeam1 && team1.length < maxTeamSize) toggleTeam1(c);
                          else if (inTeam1) toggleTeam1(c);
                          else if (!inTeam2 && team2.length < maxTeamSize) toggleTeam2(c);
                          else if (inTeam2) toggleTeam2(c);
                        }}
                      />
                      {inTeam1 && (
                        <div className="absolute -top-1 -left-1 w-5 h-5 bg-yellow-500 rounded-full text-[10px] font-bold flex items-center justify-center">
                          1
                        </div>
                      )}
                      {inTeam2 && (
                        <div className="absolute -top-1 -left-1 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center">
                          2
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* ========== BATTLE ARENA ========== */}
        <AnimatePresence>
          {battle && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-5xl mx-auto"
            >
              {/* Energy & Turn Bar */}
              <div className="glass rounded-2xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="font-display font-bold text-dark-200">
                      Turn {battle.currentTurn}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      battle.phase === 'player_turn' ? 'bg-yellow-500/20 text-yellow-400' :
                      battle.phase === 'ai_turn' ? 'bg-red-500/20 text-red-400' :
                      battle.phase === 'game_over' ? 'bg-green-500/20 text-green-400' :
                      'bg-dark-600 text-dark-300'
                    }`}>
                      {battle.phase === 'player_turn' ? 'YOUR TURN' :
                       battle.phase === 'ai_turn' ? 'AI TURN' :
                       battle.phase === 'game_over' ? 'GAME OVER' : 'RESOLVING'}
                    </span>
                  </div>

                  {/* Energy */}
                  <div className="flex items-center gap-2">
                    <span className="text-dark-400 text-sm">Energy</span>
                    <div className="flex gap-1">
                      {Array.from({ length: battle.maxEnergy }).map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{
                            scale: i < battle.energy ? [1, 1.2, 1] : 1,
                            opacity: i < battle.energy ? 1 : 0.2,
                          }}
                          transition={{ duration: 0.3 }}
                          className={`w-4 h-6 rounded ${
                            i < battle.energy
                              ? 'bg-gradient-to-b from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/30'
                              : 'bg-dark-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-cyan-400 text-lg ml-1">{battle.energy}</span>
                  </div>
                </div>
              </div>

              {/* Teams Display */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                {/* Team 1 */}
                <div>
                  <h4 className="font-display font-bold text-yellow-400 text-center mb-3">🎮 Your Team</h4>
                  <div className="space-y-3">
                    {battle.team1.map(f => (
                      <FighterCard key={f.id} fighter={f} />
                    ))}
                  </div>
                </div>
                {/* Team 2 */}
                <div>
                  <h4 className="font-display font-bold text-red-400 text-center mb-3">🤖 AI Team</h4>
                  <div className="space-y-3">
                    {battle.team2.map(f => (
                      <FighterCard key={f.id} fighter={f} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Battle Log (latest event) */}
              {battle.events.length > 0 && (
                <div className="text-center mb-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={battle.events.length - 1}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`inline-block px-6 py-2 rounded-xl font-bold text-sm ${
                        battle.events[battle.events.length - 1].type === 'crit' ? 'bg-yellow-500/20 text-yellow-400' :
                        battle.events[battle.events.length - 1].type === 'death' ? 'bg-red-500/20 text-red-400' :
                        battle.events[battle.events.length - 1].type === 'victory' ? 'bg-green-500/20 text-green-400' :
                        battle.events[battle.events.length - 1].type === 'shield' ? 'bg-blue-500/20 text-blue-400' :
                        battle.events[battle.events.length - 1].type === 'dodge' ? 'bg-cyan-500/20 text-cyan-400' :
                        battle.events[battle.events.length - 1].type === 'burn' ? 'bg-orange-500/20 text-orange-400' :
                        battle.events[battle.events.length - 1].type === 'poison' ? 'bg-purple-500/20 text-purple-400' :
                        battle.events[battle.events.length - 1].type === 'heal' ? 'bg-green-500/20 text-green-400' :
                        'bg-dark-700 text-dark-200'
                      }`}
                    >
                      {battle.events[battle.events.length - 1].message}
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}

              {/* Victory Screen */}
              {battle.phase === 'game_over' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.5 }}
                  className="text-center mb-6 glass rounded-2xl p-8"
                >
                  <p className="text-5xl mb-3">{battle.winner === 1 ? '🏆' : '💀'}</p>
                  <p className={`font-display font-bold text-3xl mb-2 ${battle.winner === 1 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {battle.winner === 1 ? 'VICTORY!' : 'DEFEAT!'}
                  </p>
                  {battle.rewards && (
                    <div className="flex justify-center gap-6 mt-4">
                      <div className="glass rounded-xl px-6 py-3">
                        <p className="text-dark-400 text-xs">Reward</p>
                        <p className="text-yellow-400 font-bold text-lg">+{battle.rewards.vein} $VEIN</p>
                        <p className="text-dark-400 text-sm">+{battle.rewards.ore} Ore</p>
                      </div>
                    </div>
                  )}
                  <button onClick={handleReset} className="mt-6 px-6 py-2 glass text-dark-200 rounded-xl hover:bg-dark-700/50">
                    ← New Battle
                  </button>
                </motion.div>
              )}

              {/* Controls */}
              {battle.phase !== 'game_over' && (
                <div className="flex justify-center gap-3 mb-6">
                  {battle.phase === 'player_turn' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleEndPlayerTurn}
                      className="px-6 py-2 bg-yellow-500/20 text-yellow-400 rounded-xl font-bold text-sm hover:bg-yellow-500/30"
                    >
                      ⏭ End Turn
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    className={`px-4 py-2 rounded-xl font-bold text-sm ${
                      isAutoPlaying ? 'bg-yellow-500 text-dark-900' : 'glass text-dark-200'
                    }`}
                  >
                    {isAutoPlaying ? '⏸ Stop' : '⏩ Auto'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleInstant}
                    className="px-4 py-2 glass text-dark-200 rounded-xl font-bold text-sm"
                  >
                    ⚡ Instant
                  </motion.button>
                  <button onClick={handleReset} className="px-4 py-2 glass text-dark-200 rounded-xl text-sm">
                    ← Quit
                  </button>
                </div>
              )}

              {/* === PLAYER HAND (Cards) === */}
              {battle.phase === 'player_turn' && battle.hand.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-display font-bold text-dark-300 text-center mb-3 text-sm">
                    Your Hand ({battle.hand.length} cards)
                  </h4>
                  <div className="flex justify-center gap-3 flex-wrap">
                    {battle.hand.map((card, idx) => {
                      const canPlay = card.energy <= battle.energy;
                      const ownerAlive = battle.team1.find(
                        f => f.id === card.ownerId && f.isAlive
                      );
                      const isStunned = ownerAlive?.statusEffects.some(e => e.stun);
                      const playable = canPlay && !!ownerAlive && !isStunned;

                      return (
                        <motion.div
                          key={`${card.id}-${idx}`}
                          whileHover={playable ? { scale: 1.08, y: -8 } : {}}
                          whileTap={playable ? { scale: 0.95 } : {}}
                          onClick={() => playable && handlePlayCard(idx)}
                          onMouseEnter={() => setHoveredCard(idx)}
                          onMouseLeave={() => setHoveredCard(null)}
                          className={`relative w-[140px] rounded-2xl overflow-hidden cursor-pointer transition-all border-2 ${
                            playable
                              ? 'border-dark-600 hover:border-yellow-500/50 hover:shadow-xl hover:shadow-yellow-500/20'
                              : 'border-dark-700 opacity-50 cursor-not-allowed'
                          }`}
                        >
                          {/* Card bg gradient */}
                          <div className={`absolute inset-0 bg-gradient-to-b ${card.color} opacity-20`} />
                          
                          {/* Content */}
                          <div className="relative p-3">
                            {/* Energy cost */}
                            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-dark-900/80 flex items-center justify-center">
                              <span className={`text-xs font-bold ${card.energy <= battle.energy ? 'text-cyan-400' : 'text-red-400'}`}>
                                {card.energy}
                              </span>
                            </div>

                            {/* Card icon + name */}
                            <div className="text-2xl mb-1">{card.icon}</div>
                            <p className="font-display font-bold text-xs text-dark-100 leading-tight">
                              {card.name}
                            </p>

                            {/* Type badge */}
                            <span className={`inline-block text-[9px] px-1.5 py-0.5 rounded mt-1 ${
                              card.type === 'attack' ? 'bg-red-500/20 text-red-400' :
                              card.type === 'defense' ? 'bg-blue-500/20 text-blue-400' :
                              card.type === 'buff' ? 'bg-green-500/20 text-green-400' :
                              'bg-purple-500/20 text-purple-400'
                            }`}>
                              {card.type.toUpperCase()}
                            </span>

                            {/* Owner */}
                            <p className="text-[9px] text-dark-500 mt-1 truncate">{card.ownerName}</p>

                            {/* Damage */}
                            {card.damage > 0 && (
                              <p className="text-xs font-bold text-red-400 mt-1">⚔ {card.damage}</p>
                            )}
                          </div>

                          {/* Tooltip on hover */}
                          <AnimatePresence>
                            {hoveredCard === idx && (
                              <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-[200px] bg-dark-800 border border-dark-600 rounded-xl p-3 z-20 shadow-2xl"
                              >
                                <p className="text-xs text-dark-300 leading-relaxed">{card.description}</p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Full Battle Log */}
              {battle.events.length > 0 && (
                <div className="mt-4">
                  <button
                    onClick={() => setShowLog(!showLog)}
                    className="text-sm text-dark-400 hover:text-dark-200 transition-colors mb-2"
                  >
                    📜 Battle Log ({battle.events.length} events) {showLog ? '▲' : '▼'}
                  </button>
                  {showLog && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="glass rounded-xl p-4 max-h-64 overflow-y-auto space-y-1"
                    >
                      {battle.events.map((evt, i) => (
                        <p
                          key={i}
                          className={`text-xs ${
                            evt.type === 'crit' ? 'text-yellow-400' :
                            evt.type === 'victory' ? 'text-green-400 font-bold' :
                            evt.type === 'death' ? 'text-red-400' :
                            evt.type === 'dodge' ? 'text-blue-400' :
                            evt.type === 'burn' ? 'text-orange-400' :
                            evt.type === 'poison' ? 'text-purple-400' :
                            'text-dark-300'
                          }`}
                        >
                          <span className="text-dark-600">T{evt.turn}</span> {evt.message}
                        </p>
                      ))}
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bloodline Card Reference */}
        {!battle && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-6 mt-8"
          >
            <h4 className="font-display font-bold text-dark-200 mb-4 text-center">
              🃏 Bloodline Cards (4 per bloodline — 24 total)
            </h4>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs text-dark-400">
              {(
                [
                  ['Delver', '⛏ Tunnel Strike', 'Cave In', 'Vein Sense (buff)', 'Heartvein Burst'],
                  ['Ironblood', '⚔ Iron Slash', 'Cleave (AoE)', 'Bloodfury (rage)', 'Execution (finisher)'],
                  ['Forgeborn', '🔥 Ember (burn)', 'Molten Armor (shield)', 'Flame Wave (AoE burn)', 'Inferno (detonate)'],
                  ['Shadowvein', '🗡 Backstab (crit)', 'Poison Dagger (DoT)', 'Veil (dodge+buff)', 'Death Mark (debuff)'],
                  ['Stonewarden', '🛡 Shield Bash', 'Bastion (AoE shield)', 'Fortify (defense+heal)', 'Earthquake (AoE stun)'],
                  ['Veinbender', '🧪 Vein Drain (lifesteal)', 'Flux Shift (steal buff)', 'Overload (anti-buff)', 'Catalyst (AoE buff)'],
                ] as const
              ).map(([bl, ...cards]) => (
                <div key={bl} className="bg-dark-800/50 rounded-xl p-3">
                  <span className={`font-bold ${
                    bl === 'Delver' ? 'text-yellow-400' : bl === 'Ironblood' ? 'text-red-400' :
                    bl === 'Forgeborn' ? 'text-orange-400' : bl === 'Shadowvein' ? 'text-purple-400' :
                    bl === 'Stonewarden' ? 'text-blue-400' : 'text-green-400'
                  }`}>
                    {bl}
                  </span>
                  <div className="mt-1 space-y-0.5 text-dark-500">
                    {cards.map((c, i) => <p key={i}>• {c}</p>)}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

// ============================================================
// FIGHTER CARD (in battle)
// ============================================================

function FighterCard({ fighter, rarity }: { fighter: BattleFighter; rarity?: string }) {
  const hpPct = Math.max(0, Math.round((fighter.currentHp / fighter.maxHp) * 100));
  const hpColor = hpPct > 60 ? 'bg-green-500' : hpPct > 30 ? 'bg-yellow-500' : 'bg-red-500';
  const weaponIcons: Record<string, string> = {
    Delver: '⛏', Ironblood: '⚔', Forgeborn: '🔨', Shadowvein: '🗡', Stonewarden: '🛡', Veinbender: '🧪',
  };

  return (
    <div className={`glass rounded-xl p-3 transition-all ${
      !fighter.isAlive ? 'opacity-30 grayscale' : ''
    }`}>
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
          fighter.isAlive ? 'bg-dark-700' : 'bg-dark-800'
        }`}>
          {fighter.isAlive ? (
            fighter.bloodline === 'Delver' ? '⛏' :
            fighter.bloodline === 'Ironblood' ? '⚔' :
            fighter.bloodline === 'Forgeborn' ? '🔥' :
            fighter.bloodline === 'Shadowvein' ? '🗡' :
            fighter.bloodline === 'Stonewarden' ? '🛡' : '🧪'
          ) : '💀'}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-display font-bold text-sm truncate">{fighter.name}</p>
            <span className="text-[10px] text-dark-500">{weaponIcons[fighter.bloodline]}</span>
            {!fighter.isAlive && <span className="text-[10px] text-red-400 font-bold">DEAD</span>}
          </div>

          {/* HP Bar */}
          <div className="mt-1">
            <div className="flex justify-between text-[10px] text-dark-400 mb-0.5">
              <span>HP</span>
              <span>{fighter.currentHp}/{fighter.maxHp}</span>
            </div>
            <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${hpColor}`}
                animate={{ width: `${hpPct}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Shield */}
          {fighter.shield > 0 && (
            <div className="mt-1 flex items-center gap-1 text-[10px] text-cyan-400">
              <span>🛡</span>
              <span>{fighter.shield} Shield</span>
            </div>
          )}

          {/* Status effects */}
          {fighter.statusEffects.length > 0 && (
            <div className="flex gap-1 mt-1 flex-wrap">
              {fighter.statusEffects.map(e => (
                <span
                  key={e.id}
                  className={`text-[10px] px-1 py-0.5 rounded ${
                    e.stun ? 'bg-yellow-500/20 text-yellow-400' :
                    e.burnDamage ? 'bg-orange-500/20 text-orange-400' :
                    e.poisonDamage ? 'bg-purple-500/20 text-purple-400' :
                    (e.attackMod || 0) > 0 ? 'bg-red-500/20 text-red-400' :
                    (e.defenseMod || 0) > 0 ? 'bg-blue-500/20 text-blue-400' :
                    'bg-dark-600 text-dark-300'
                  }`}
                  title={`${e.name} (${e.turnsLeft} turns)`}
                >
                  {e.icon} {e.turnsLeft}t
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Speed */}
        <div className="text-center text-dark-500">
          <p className="text-[9px]">SPD</p>
          <p className="font-mono font-bold text-xs text-dark-300">{fighter.speed}</p>
        </div>
      </div>
    </div>
  );
}
