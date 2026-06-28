'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type QuestCategory = 'mining' | 'battle' | 'breeding' | 'special';
type QuestFrequency = 'daily' | 'weekly' | 'achievement';
interface QuestReward { vein: number; ore: number; }
interface QuestDef { id: string; name: string; description: string; icon: string; category: QuestCategory; frequency: QuestFrequency; target: number; reward: QuestReward; }
interface QuestProgress { questId: string; current: number; completed: boolean; claimed: boolean; }
interface QuestState { progress: QuestProgress[]; totalVein: number; totalOre: number; lastResetDaily: string; lastResetWeekly: string; }

const QUESTS: QuestDef[] = [
  { id: 'daily_mine_100', name: 'Vein Collector', description: 'Mine 100 $VEIN', icon: '⛏', category: 'mining', frequency: 'daily', target: 100, reward: { vein: 25, ore: 5 } },
  { id: 'daily_mine_500', name: 'Deep Excavator', description: 'Mine 500 $VEIN', icon: '💎', category: 'mining', frequency: 'daily', target: 500, reward: { vein: 100, ore: 20 } },
  { id: 'daily_battle_3', name: 'Arena Fighter', description: 'Win 3 battles', icon: '⚔', category: 'battle', frequency: 'daily', target: 3, reward: { vein: 50, ore: 10 } },
  { id: 'daily_breed_1', name: 'Bloodline Keeper', description: 'Breed 1 time', icon: '🧬', category: 'breeding', frequency: 'daily', target: 1, reward: { vein: 30, ore: 5 } },
  { id: 'daily_battle_5', name: 'Warrior Spirit', description: 'Win 5 battles', icon: '🗡', category: 'battle', frequency: 'daily', target: 5, reward: { vein: 120, ore: 25 } },
  { id: 'daily_boost_1', name: 'Vein Drinker', description: 'Use 1 mining boost', icon: '🍵', category: 'special', frequency: 'daily', target: 1, reward: { vein: 40, ore: 10 } },
  { id: 'weekly_mine_5000', name: 'Vein Baron', description: 'Mine 5,000 $VEIN', icon: '💰', category: 'mining', frequency: 'weekly', target: 5000, reward: { vein: 500, ore: 100 } },
  { id: 'weekly_battle_20', name: 'Champion', description: 'Win 20 battles', icon: '🏆', category: 'battle', frequency: 'weekly', target: 20, reward: { vein: 750, ore: 150 } },
  { id: 'weekly_breed_5', name: 'Gene Weaver', description: 'Breed 5 times', icon: '🧬', category: 'breeding', frequency: 'weekly', target: 5, reward: { vein: 400, ore: 80 } },
  { id: 'weekly_tournament_1', name: 'Tournament Victor', description: 'Win 1 tournament', icon: '👑', category: 'special', frequency: 'weekly', target: 1, reward: { vein: 1000, ore: 200 } },
  { id: 'ach_first_battle', name: 'First Blood', description: 'Win your first battle', icon: '⚔', category: 'battle', frequency: 'achievement', target: 1, reward: { vein: 200, ore: 50 } },
  { id: 'ach_first_breed', name: 'Life Bringer', description: 'Breed your first character', icon: '🐣', category: 'breeding', frequency: 'achievement', target: 1, reward: { vein: 300, ore: 75 } },
  { id: 'ach_mine_10000', name: 'Vein Tycoon', description: 'Mine 10,000 total $VEIN', icon: '💎', category: 'mining', frequency: 'achievement', target: 10000, reward: { vein: 2000, ore: 500 } },
  { id: 'ach_battle_100', name: 'Legendary Warrior', description: 'Win 100 total battles', icon: '🔥', category: 'battle', frequency: 'achievement', target: 100, reward: { vein: 5000, ore: 1000 } },
  { id: 'ach_breed_20', name: 'Master Breeder', description: 'Breed 20 total times', icon: '🧬', category: 'breeding', frequency: 'achievement', target: 20, reward: { vein: 4000, ore: 800 } },
];

const STORAGE_KEY = 'veinlegends_quests';

function getToday() { return new Date().toISOString().split('T')[0]; }
function getWeekKey() { const d = new Date(); d.setDate(d.getDate() - d.getDay()); return d.toISOString().split('T')[0]; }

function loadState(): QuestState {
  if (typeof window === 'undefined') return { progress: [], totalVein: 0, totalOre: 0, lastResetDaily: '', lastResetWeekly: '' };
  try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : { progress: [], totalVein: 0, totalOre: 0, lastResetDaily: '', lastResetWeekly: '' }; }
  catch { return { progress: [], totalVein: 0, totalOre: 0, lastResetDaily: '', lastResetWeekly: '' }; }
}

export default function QuestsContent() {
  const [state, setState] = useState<QuestState>(() => {
    const s = loadState();
    const today = getToday(); const wk = getWeekKey();
    let p = [...s.progress];
    if (s.lastResetDaily !== today) { p = p.filter(x => QUESTS.find(q => q.id === x.questId)?.frequency !== 'daily'); s.lastResetDaily = today; }
    if (s.lastResetWeekly !== wk) { p = p.filter(x => QUESTS.find(q => q.id === x.questId)?.frequency !== 'weekly'); s.lastResetWeekly = wk; }
    return { ...s, progress: p };
  });
  const [notif, setNotif] = useState('');

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }, [state]);

  const claim = (qid: string) => {
    const q = QUESTS.find(q => q.id === qid);
    if (!q) return;
    setState(p => ({
      ...p, progress: p.progress.map(x => x.questId === qid ? { ...x, claimed: true } : x),
      totalVein: p.totalVein + q.reward.vein, totalOre: p.totalOre + q.reward.ore,
    }));
    setNotif(`+${q.reward.vein} $VEIN +${q.reward.ore} Ore`);
    setTimeout(() => setNotif(''), 2000);
  };

  const getProg = (qid: string): QuestProgress => state.progress.find(p => p.questId === qid) || { questId: qid, current: 0, completed: false, claimed: false };
  const grouped = { daily: QUESTS.filter(q => q.frequency === 'daily'), weekly: QUESTS.filter(q => q.frequency === 'weekly'), achievement: QUESTS.filter(q => q.frequency === 'achievement') };

  return (
    <div className="px-4 py-8">
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="glass rounded-2xl p-4 text-center"><p className="text-2xl mb-1">💰</p><p className="font-bold text-xl text-yellow-400">{state.totalVein.toLocaleString()}</p><p className="text-xs text-dark-500">$VEIN Earned</p></div>
        <div className="glass rounded-2xl p-4 text-center"><p className="text-2xl mb-1">💎</p><p className="font-bold text-xl text-cyan-400">{state.totalOre.toLocaleString()}</p><p className="text-xs text-dark-500">Ore Earned</p></div>
      </div>
      <AnimatePresence>{notif && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-2xl font-bold shadow-2xl">{notif}</motion.div>}</AnimatePresence>
      {(['daily', 'weekly', 'achievement'] as const).map(cat => (
        <div key={cat} className="mb-8">
          <h3 className={`font-display font-bold text-lg mb-4 ${cat === 'daily' ? 'text-yellow-400' : cat === 'weekly' ? 'text-purple-400' : 'text-cyan-400'}`}>
            {cat === 'daily' ? '📅 Daily' : cat === 'weekly' ? '📆 Weekly' : '🏆 Achievements'}
            {cat === 'daily' && <span className="text-xs text-dark-500 ml-2">Resets daily</span>}
            {cat === 'weekly' && <span className="text-xs text-dark-500 ml-2">Resets weekly</span>}
          </h3>
          <div className="space-y-2">
            {grouped[cat].map(q => {
              const p = getProg(q.id); const pct = Math.min(100, Math.round((p.current / q.target) * 100));
              return (
                <div key={q.id} className={`glass rounded-xl p-4 ${p.completed && !p.claimed ? 'border-2 border-yellow-500/40 bg-yellow-500/5' : p.claimed ? 'opacity-50' : ''}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{q.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2"><p className="font-bold text-sm">{q.name}</p>{p.claimed && <span className="text-[10px] text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded">✓ CLAIMED</span>}</div>
                      <p className="text-xs text-dark-400">{q.description}</p>
                      <div className="mt-2"><div className="flex justify-between text-[10px] text-dark-500 mb-0.5"><span>{Math.min(p.current, q.target)}/{q.target}</span><span>{pct}%</span></div>
                        <div className="h-1.5 bg-dark-700 rounded-full overflow-hidden"><div className={`h-full rounded-full ${pct >= 100 ? 'bg-green-500' : 'bg-cyan-500'}`} style={{ width: `${pct}%` }} /></div></div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs mb-1"><span className="text-yellow-400 font-bold">+{q.reward.vein}</span>{' '}<span className="text-dark-500">+{q.reward.ore} Ore</span></div>
                      {p.completed && !p.claimed ? <button onClick={() => claim(q.id)} className="px-3 py-1.5 bg-yellow-500 text-dark-900 rounded-lg text-xs font-bold hover:bg-yellow-400">🎁 Claim</button>
                        : p.claimed ? <span className="text-xs text-dark-500">Done</span> : <span className="text-xs text-dark-500">{pct >= 100 ? 'Ready' : 'In progress'}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}