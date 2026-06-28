'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import type { Character } from '@/lib/characters';
import { getNamedHeroes, generateGenericPool } from '@/lib/characters';
import type { ActiveCard } from '@/lib/cards';
import {
  initBattle, playCard, aiTurn, endTurn, autoBattle,
  type BattleState, type BattleFighter, type BattleEvent,
} from '@/lib/battle';
import HeroCard from '@/components/HeroCard';

const POOL = [...getNamedHeroes(), ...generateGenericPool()];

export default function BattleContent() {
  const [team1, setTeam1] = useState<Character[]>([]);
  const [team2, setTeam2] = useState<Character[]>([]);
  const [battle, setBattle] = useState<BattleState | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [phase, setPhase] = useState<'select' | 'fighting' | 'done'>('select');

  const maxTeam = 3;
  const ready = team1.length === maxTeam && team2.length === maxTeam;

  const toggleTeam = (c: Character, team: 1 | 2) => {
    if (battle) return;
    const setter = team === 1 ? setTeam1 : setTeam2;
    const current = team === 1 ? team1 : team2;
    setter(prev =>
      prev.find(p => p.id === c.id)
        ? prev.filter(p => p.id !== c.id)
        : prev.length < maxTeam ? [...prev, c] : prev
    );
  };

  const handleStart = () => {
    if (!ready) return;
    setBattle(initBattle(team1, team2));
    setPhase('fighting');
  };

  const handlePlayCard = (idx: number) => {
    if (!battle || battle.phase !== 'player_turn') return;
    const result = playCard(battle, idx);
    setBattle(result.state);
  };

  const handleEndTurn = () => {
    if (!battle) return;
    let s: BattleState = { ...battle, phase: 'ai_turn' };
    s = aiTurn(s);
    s = endTurn(s);
    if (s.phase === 'game_over') setPhase('done');
    setBattle(s);
  };

  const handleInstant = () => {
    if (!battle) return;
    const result = autoBattle(battle, 30);
    setBattle(result);
    setPhase('done');
  };

  useEffect(() => {
    if (!isAutoPlaying || !battle || battle.phase === 'game_over') {
      if (battle?.phase === 'game_over') { setIsAutoPlaying(false); setPhase('done'); }
      return;
    }
    const t = setTimeout(() => {
      if (!battle || battle.phase === 'game_over') return;
      let s = { ...battle };
      if (s.phase === 'player_turn') {
        const ac = s.hand.map((c, i) => ({ c, i })).filter(({ c }) => c.energy <= s.energy && c.type === 'attack').sort((a, b) => a.c.energy - b.c.energy);
        if (ac.length > 0) s = playCard(s, ac[0].i).state;
        s = { ...s, phase: 'ai_turn' };
      }
      if (s.phase === 'ai_turn') s = aiTurn(s);
      if (s.phase === 'resolve') { s = endTurn(s); if (s.phase === 'game_over') setPhase('done'); }
      setBattle(s);
    }, 1200);
    return () => clearTimeout(t);
  }, [isAutoPlaying, battle]);

  const reset = () => { setBattle(null); setPhase('select'); setIsAutoPlaying(false); setShowLog(false); };

  if (phase === 'select') return <TeamSelect team1={team1} team2={team2} pool={POOL} ready={ready} onToggle={toggleTeam} onStart={handleStart} />;

  return (
    <div className="px-4 py-8">
      <BattleArena battle={battle!} phase={phase} isAutoPlaying={isAutoPlaying} showLog={showLog} hoveredCard={hoveredCard}
        onPlayCard={handlePlayCard} onEndTurn={handleEndTurn} onInstant={handleInstant}
        onAuto={() => setIsAutoPlaying(!isAutoPlaying)} onShowLog={() => setShowLog(!showLog)}
        onHoverCard={setHoveredCard} onReset={reset} />
    </div>
  );
}

function TeamSelect({ team1, team2, pool, ready, onToggle, onStart }: any) {
  const isIn = (id: string) => team1.some((c: Character) => c.id === id) || team2.some((c: Character) => c.id === id);
  return (
    <div className="px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {[1, 2].map(t => (
          <div key={t} className={`glass rounded-2xl p-6 border-2 ${t === 1 ? 'border-yellow-500/30' : 'border-red-500/30'}`}>
            <h3 className={`font-display font-bold text-lg mb-4 text-center ${t === 1 ? 'text-yellow-400' : 'text-red-400'}`}>
              {t === 1 ? '🎮 Your Team' : '🤖 AI Team'} ({(t === 1 ? team1 : team2).length}/3)
            </h3>
            <div className="flex justify-center gap-3 flex-wrap">
              {(t === 1 ? team1 : team2).map((c: Character) => (
                <div key={c.id} className="relative">
                  <HeroCard character={c} size="sm" />
                  <button onClick={() => onToggle(c, t)} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center">✕</button>
                </div>
              ))}
              {Array.from({ length: 3 - (t === 1 ? team1 : team2).length }).map((_, i) => (
                <div key={`e-${i}`} className="w-[130px] h-[170px] border-2 border-dashed border-dark-600 rounded-2xl flex items-center justify-center"><span className="text-dark-500 text-2xl">+</span></div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mb-8">
        <motion.button whileHover={ready ? { scale: 1.05 } : {}} whileTap={ready ? { scale: 0.95 } : {}} onClick={onStart} disabled={!ready}
          className={`px-12 py-5 rounded-2xl font-bold text-2xl transition-all ${ready ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-2xl shadow-red-500/40' : 'bg-dark-700 text-dark-400 cursor-not-allowed'}`}>
          ⚔ START BATTLE!
        </motion.button>
      </div>
      <h4 className="font-display font-bold text-dark-300 text-center mb-4">Warrior Pool ({pool.length})</h4>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2.5">
        {pool.map((c: Character) => (
          <HeroCard key={c.id} character={c} size="sm" selected={isIn(c.id)}
            onClick={() => { if (!isIn(c.id)) onToggle(c, team1.length < 3 ? 1 : team2.length < 3 ? 2 : 1); else onToggle(c, team1.some((x: Character) => x.id === c.id) ? 1 : 2); }} />
        ))}
      </div>
    </div>
  );
}

function BattleArena({ battle, phase, isAutoPlaying, showLog, hoveredCard, onPlayCard, onEndTurn, onInstant, onAuto, onShowLog, onHoverCard, onReset }: any) {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <span className="font-mono text-dark-400 text-sm">Turn {battle.currentTurn}</span>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${battle.phase === 'player_turn' ? 'bg-yellow-500/20 text-yellow-400' : battle.phase === 'game_over' ? 'bg-green-500/20 text-green-400' : 'bg-dark-600 text-dark-300'}`}>
          {battle.phase === 'player_turn' ? 'YOUR TURN' : battle.phase === 'game_over' ? 'DONE' : 'AI TURN'}
        </span>
      </div>

      <div className="glass rounded-xl p-3 mb-6 flex items-center gap-3">
        <span className="text-dark-400 text-sm">Energy</span>
        <div className="flex gap-1">{Array.from({ length: battle.maxEnergy }).map((_, i) => (
          <div key={i} className={`w-4 h-6 rounded ${i < battle.energy ? 'bg-gradient-to-b from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/30' : 'bg-dark-600'}`} />
        ))}</div>
        <span className="font-bold text-cyan-400">{battle.energy}/{battle.maxEnergy}</span>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {[battle.team1, battle.team2].map((team, ti) => (
          <div key={ti}>
            <h4 className={`font-bold text-center mb-3 ${ti === 0 ? 'text-yellow-400' : 'text-red-400'}`}>{ti === 0 ? '🎮 Your Team' : '🤖 AI'}</h4>
            <div className="space-y-2">{team.map((f: BattleFighter) => <MiniFighter key={f.id} f={f} />)}</div>
          </div>
        ))}
      </div>

      {battle.events.length > 0 && (
        <motion.div key={battle.events.length - 1} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className={`text-center mb-4 py-2 px-4 rounded-xl font-bold text-sm inline-block w-full ${battle.events[battle.events.length - 1].type === 'crit' ? 'bg-yellow-500/20 text-yellow-400' : battle.events[battle.events.length - 1].type === 'death' ? 'bg-red-500/20 text-red-400' : battle.events[battle.events.length - 1].type === 'victory' ? 'bg-green-500/20 text-green-400' : 'bg-dark-700 text-dark-200'}`}>
          {battle.events[battle.events.length - 1].message}
        </motion.div>
      )}

      {phase === 'done' && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.3 }} className="glass rounded-2xl p-8 text-center mb-6">
          <p className="text-6xl mb-3">{battle.winner === 1 ? '🏆' : '💀'}</p>
          <p className={`font-display font-bold text-3xl ${battle.winner === 1 ? 'text-yellow-400' : 'text-red-400'}`}>{battle.winner === 1 ? 'VICTORY!' : 'DEFEAT!'}</p>
          {battle.rewards && <div className="mt-4"><span className="text-yellow-400 font-bold text-lg">+{battle.rewards.vein} $VEIN</span> <span className="text-dark-400">+{battle.rewards.ore} Ore</span></div>}
          <button onClick={onReset} className="mt-6 px-6 py-2 glass text-dark-200 rounded-xl">New Battle</button>
        </motion.div>
      )}

      {phase !== 'done' && (
        <div className="flex justify-center gap-3 mb-6">
          {battle.phase === 'player_turn' && <button onClick={onEndTurn} className="px-6 py-2 bg-yellow-500/20 text-yellow-400 rounded-xl font-bold text-sm">⏭ End Turn</button>}
          <button onClick={onAuto} className={`px-4 py-2 rounded-xl font-bold text-sm ${isAutoPlaying ? 'bg-yellow-500 text-dark-900' : 'glass text-dark-200'}`}>{isAutoPlaying ? '⏸ Stop' : '⏩ Auto'}</button>
          <button onClick={onInstant} className="px-4 py-2 glass text-dark-200 rounded-xl font-bold text-sm">⚡ Instant</button>
          <button onClick={onReset} className="px-4 py-2 glass text-dark-200 rounded-xl text-sm">← Quit</button>
        </div>
      )}

      {battle.phase === 'player_turn' && battle.hand.length > 0 && (
        <div className="mb-6">
          <h4 className="text-dark-300 text-center text-sm mb-3">Your Hand ({battle.hand.length})</h4>
          <div className="flex justify-center gap-3 flex-wrap">
            {battle.hand.map((c: ActiveCard, i: number) => {
              const playable = c.energy <= battle.energy && battle.team1.find((f: BattleFighter) => f.id === c.ownerId && f.isAlive) && !battle.team1.find((f: BattleFighter) => f.id === c.ownerId)?.statusEffects.some((e: any) => e.stun);
              return (
                <motion.div key={`${c.id}-${i}`} whileHover={playable ? { scale: 1.08, y: -8 } : {}} whileTap={playable ? { scale: 0.95 } : {}}
                  onClick={() => playable && onPlayCard(i)} onMouseEnter={() => onHoverCard(i)} onMouseLeave={() => onHoverCard(null)}
                  className={`relative w-[140px] rounded-2xl overflow-hidden cursor-pointer border-2 ${playable ? 'border-dark-600 hover:border-yellow-500/50 hover:shadow-xl' : 'border-dark-700 opacity-50 cursor-not-allowed'}`}>
                  <div className={`absolute inset-0 bg-gradient-to-b ${c.color} opacity-20`} />
                  <div className="relative p-3">
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-dark-900/80 flex items-center justify-center">
                      <span className={`text-xs font-bold ${c.energy <= battle.energy ? 'text-cyan-400' : 'text-red-400'}`}>{c.energy}</span></div>
                    <div className="text-2xl mb-1">{c.icon}</div>
                    <p className="font-display font-bold text-xs text-dark-100">{c.name}</p>
                    <span className={`inline-block text-[9px] px-1.5 py-0.5 rounded mt-1 ${c.type === 'attack' ? 'bg-red-500/20 text-red-400' : c.type === 'defense' ? 'bg-blue-500/20 text-blue-400' : c.type === 'buff' ? 'bg-green-500/20 text-green-400' : 'bg-purple-500/20 text-purple-400'}`}>{c.type.toUpperCase()}</span>
                    <p className="text-[9px] text-dark-500 mt-1 truncate">{c.ownerName}</p>
                    {c.damage > 0 && <p className="text-xs font-bold text-red-400 mt-1">⚔{c.damage}</p>}
                  </div>
                  {hoveredCard === i && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-[200px] bg-dark-800 border border-dark-600 rounded-xl p-3 z-20 shadow-2xl">
                      <p className="text-xs text-dark-300">{c.description}</p></motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {battle.events.length > 0 && (
        <div className="mt-4">
          <button onClick={onShowLog} className="text-sm text-dark-400 hover:text-dark-200">📜 Battle Log ({battle.events.length}) {showLog ? '▲' : '▼'}</button>
          {showLog && (
            <div className="glass rounded-xl p-4 max-h-48 overflow-y-auto space-y-1 mt-2">
              {battle.events.map((e: BattleEvent, i: number) => (<p key={i} className={`text-xs ${e.type === 'crit' ? 'text-yellow-400' : e.type === 'victory' ? 'text-green-400 font-bold' : e.type === 'death' ? 'text-red-400' : 'text-dark-300'}`}><span className="text-dark-600">T{e.turn}</span> {e.message}</p>))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

function MiniFighter({ f }: { f: BattleFighter }) {
  const hp = Math.max(0, Math.round((f.currentHp / f.maxHp) * 100));
  const blIcon: Record<string, string> = { Delver: '⛏', Ironblood: '⚔', Forgeborn: '🔥', Shadowvein: '🗡', Stonewarden: '🛡', Veinbender: '🧪' };
  return (
    <div className={`glass rounded-xl p-3 ${!f.isAlive ? 'opacity-30 grayscale' : ''}`}>
      <div className="flex items-center gap-2">
        <span className="text-lg">{f.isAlive ? blIcon[f.bloodline] || '?' : '💀'}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2"><p className="font-bold text-xs truncate">{f.name}</p>{!f.isAlive && <span className="text-[10px] text-red-400">DEAD</span>}</div>
          <div className="h-1.5 bg-dark-700 rounded-full mt-1"><div className={`h-full rounded-full ${hp > 60 ? 'bg-green-500' : hp > 30 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${hp}%` }} /></div>
          <div className="flex justify-between text-[9px] text-dark-500 mt-0.5"><span>{f.currentHp}/{f.maxHp}</span>{f.shield > 0 && <span className="text-cyan-400">🛡{f.shield}</span>}</div>
          {f.statusEffects.length > 0 && <div className="flex gap-1 mt-1 flex-wrap">{f.statusEffects.map(e => <span key={e.id} className="text-[9px] px-1 py-0.5 rounded bg-dark-600">{e.icon}{e.turnsLeft}t</span>)}</div>}
        </div>
      </div>
    </div>
  );
}