'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Character } from '@/lib/characters';
import { getNamedHeroes } from '@/lib/characters';
import { initBattle, autoBattle, type BattleState } from '@/lib/battle';

const NAMED = getNamedHeroes();

interface Matchup {
  id: number;
  round: number;
  fighter1: Character;
  fighter2: Character;
  winner: Character | null;
  result: BattleState | null;
  position: number;
}

function generateBracket(fighters: Character[]): Matchup[] {
  const shuffled = [...fighters].sort(() => Math.random() - 0.5).slice(0, 8);
  return [
    { id: 1, round: 1, fighter1: shuffled[0], fighter2: shuffled[1], winner: null, result: null, position: 0 },
    { id: 2, round: 1, fighter1: shuffled[2], fighter2: shuffled[3], winner: null, result: null, position: 1 },
    { id: 3, round: 1, fighter1: shuffled[4], fighter2: shuffled[5], winner: null, result: null, position: 2 },
    { id: 4, round: 1, fighter1: shuffled[6], fighter2: shuffled[7], winner: null, result: null, position: 3 },
    { id: 5, round: 2, fighter1: null!, fighter2: null!, winner: null, result: null, position: 0 },
    { id: 6, round: 2, fighter1: null!, fighter2: null!, winner: null, result: null, position: 1 },
    { id: 7, round: 3, fighter1: null!, fighter2: null!, winner: null, result: null, position: 0 },
  ];
}

function simulateMatch(m: Matchup): Matchup {
  if (!m.fighter1 || !m.fighter2) return m;
  const state = autoBattle(initBattle([m.fighter1], [m.fighter2]), 20);
  const winner = state.winner === 1 ? m.fighter1 : m.fighter2;
  return { ...m, winner, result: state };
}

export default function TournamentContent() {
  const [bracket, setBracket] = useState<Matchup[]>([]);
  const [phase, setPhase] = useState<'idle' | 'ready' | 'running' | 'done'>('idle');
  const [animMatch, setAnimMatch] = useState<number | null>(null);

  const startTournament = () => {
    setBracket(generateBracket(NAMED));
    setPhase('ready');
  };

  const runRound = (round: number) => {
    setPhase('running');
    const matches = bracket.filter(m => m.round === round && !m.winner);
    const run = (idx: number) => {
      if (idx >= matches.length) {
        setPhase(round === 3 ? 'done' : 'ready');
        return;
      }
      const m = matches[idx];
      setAnimMatch(m.id);
      setTimeout(() => {
        setBracket(prev => {
          const updated = simulateMatch({ ...m });
          const next = prev.map(p => (p.id === m.id ? updated : p));
          if (round < 3 && updated.winner) {
            const nextRoundId = round === 1 ? (m.position < 2 ? 5 : 6) : 7;
            const slot = round === 1 ? (m.position % 2 === 0 ? 'fighter1' : 'fighter2') : (m.position === 0 ? 'fighter1' : 'fighter2');
            return next.map(p => p.id === nextRoundId ? { ...p, [slot]: updated.winner } : p);
          }
          return next;
        });
        setAnimMatch(null);
        setTimeout(() => run(idx + 1), 500);
      }, 800);
    };
    run(0);
  };

  const reset = () => { setBracket([]); setPhase('idle'); };

  return (
    <div className="px-4 py-8">
      {phase === 'idle' && (
        <div className="text-center py-12">
          <p className="text-6xl mb-6">🏆</p>
          <h2 className="font-display text-2xl font-bold mb-4">VeinLegends Championship</h2>
          <p className="text-dark-400 max-w-md mx-auto mb-8">
            8 legendary warriors enter. Only one leaves as champion. Single elimination bracket with automatic battle resolution.
          </p>
          <div className="glass rounded-2xl p-6 max-w-md mx-auto mb-8 text-left text-sm text-dark-300 space-y-2">
            <p>💰 <span className="text-yellow-400 font-bold">Prize Pool: 5,000 $VEIN + 500 Ore</span></p>
            <p>🥇 Champion: 2,500 $VEIN</p>
            <p>🥈 Runner-up: 1,000 $VEIN</p>
            <p>🥉 Semi-finalists: 500 $VEIN each</p>
            <p>⚔ Quarter-finalists: 125 $VEIN each</p>
          </div>
          <button onClick={startTournament}
            className="px-10 py-4 bg-gradient-to-r from-yellow-500 to-amber-600 text-dark-900 rounded-2xl font-bold text-xl shadow-2xl shadow-yellow-500/30">
            🏆 Start Tournament
          </button>
        </div>
      )}

      {bracket.length > 0 && (
        <>
          {phase === 'ready' && (
            <div className="text-center mb-8">
              <button onClick={() => runRound(1)}
                className="px-8 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-red-500/30">
                ⚔ Start Quarter Finals
              </button>
            </div>
          )}
          {phase === 'ready' && bracket.some(m => m.round === 2 && m.fighter1 && !m.winner) && (
            <div className="text-center mb-8">
              <button onClick={() => runRound(2)}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-purple-500/30">
                ⚔ Start Semi Finals
              </button>
            </div>
          )}
          {phase === 'ready' && bracket.some(m => m.round === 3 && m.fighter1 && !m.winner) && (
            <div className="text-center mb-8">
              <button onClick={() => runRound(3)}
                className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-dark-900 rounded-2xl font-bold text-lg shadow-2xl shadow-yellow-400/30">
                👑 Start GRAND FINAL
              </button>
            </div>
          )}
          {phase === 'running' && (
            <div className="text-center mb-8 text-yellow-400 font-bold animate-pulse">
              ⚔ Battles in progress...
            </div>
          )}

          <div className="glass rounded-2xl p-6">
            <div className="grid grid-cols-[1fr_1fr_auto_1fr] gap-4 items-center">
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-dark-400 text-center">Quarter Finals</h4>
                {bracket.filter(m => m.round === 1).map(m => <BracketMatch key={m.id} match={m} isActive={animMatch === m.id} />)}
              </div>
              <div className="flex flex-col justify-center gap-16 py-8">
                {[0, 1].map(i => (
                  <div key={i} className="flex flex-col gap-4">
                    <div className="h-px w-8 bg-dark-600 ml-auto" />
                    <div className="h-16 border-l border-dark-600" />
                    <div className="h-px w-8 bg-dark-600 ml-auto" />
                  </div>
                ))}
              </div>
              <div className="space-y-8">
                <h4 className="text-xs font-bold text-dark-400 text-center">Semi Finals</h4>
                {bracket.filter(m => m.round === 2).map(m => <BracketMatch key={m.id} match={m} isActive={animMatch === m.id} />)}
              </div>
              <div className="space-y-8">
                <h4 className="text-xs font-bold text-yellow-400 text-center">Grand Final</h4>
                {bracket.filter(m => m.round === 3).map(m => <BracketMatch key={m.id} match={m} isActive={animMatch === m.id} isFinal />)}
              </div>
            </div>

            {phase === 'done' && bracket[6]?.winner && (
              <motion.div initial={{ scale: 0, y: 30 }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring', delay: 0.5 }}
                className="mt-8 glass rounded-2xl p-8 text-center border-2 border-yellow-500/50">
                <p className="text-5xl mb-4">👑</p>
                <p className="font-display text-2xl font-bold text-yellow-400">{bracket[6].winner.name}</p>
                <p className="text-dark-400 text-sm mt-1">{bracket[6].winner.title}</p>
                <p className="text-lg text-yellow-400 font-bold mt-4">🏆 CHAMPION</p>
                <p className="text-dark-300 text-sm mt-2">Prize: 2,500 $VEIN + 200 Ore</p>
              </motion.div>
            )}
          </div>

          <div className="text-center mt-8">
            <button onClick={reset} className="px-6 py-2 glass text-dark-200 rounded-xl">New Tournament</button>
          </div>
        </>
      )}
    </div>
  );
}

function BracketMatch({ match, isActive, isFinal }: { match: Matchup; isActive: boolean; isFinal?: boolean }) {
  const f1 = match.fighter1;
  const f2 = match.fighter2;
  const winner = match.winner;
  const blIcon: Record<string, string> = { Delver: '⛏', Ironblood: '⚔', Forgeborn: '🔥', Shadowvein: '🗡', Stonewarden: '🛡', Veinbender: '🧪' };

  return (
    <motion.div
      animate={isActive ? { scale: [1, 1.03, 1], boxShadow: ['0 0 0px rgba(250,204,21,0)', '0 0 20px rgba(250,204,21,0.3)', '0 0 0px rgba(250,204,21,0)'] } : {}}
      transition={{ duration: 0.8, repeat: isActive ? Infinity : 0 }}
      className={`rounded-xl p-3 border ${isFinal ? 'border-yellow-500/50 bg-yellow-500/5' : 'border-dark-600 bg-dark-800/50'} ${isActive ? 'border-yellow-500/50' : ''}`}>
      <div className={`flex items-center gap-2 py-1 px-2 rounded ${winner?.id === f1?.id ? 'bg-green-500/10' : ''}`}>
        <span className="text-sm">{f1 ? blIcon[f1.bloodline] : '❓'}</span>
        <span className={`text-xs truncate font-bold ${winner?.id === f1?.id ? 'text-green-400' : 'text-dark-300'}`}>{f1 ? f1.name : '???'}</span>
        {winner?.id === f1?.id && <span className="text-[10px] text-green-400 ml-auto">WIN</span>}
      </div>
      <div className="text-center text-[10px] text-dark-500 py-0.5">VS</div>
      <div className={`flex items-center gap-2 py-1 px-2 rounded ${winner?.id === f2?.id ? 'bg-green-500/10' : ''}`}>
        <span className="text-sm">{f2 ? blIcon[f2.bloodline] : '❓'}</span>
        <span className={`text-xs truncate font-bold ${winner?.id === f2?.id ? 'text-green-400' : 'text-dark-300'}`}>{f2 ? f2.name : '???'}</span>
        {winner?.id === f2?.id && <span className="text-[10px] text-green-400 ml-auto">WIN</span>}
      </div>
    </motion.div>
  );
}