// VeinLegends — Axie-Infinity Style Battle Engine
// 3v3 team, energy system, card-based, speed ordering
// Status effects, shields, buffs, debuffs

import type { Character, Bloodline } from './characters';
import { BLOODLINES } from './characters';
import type { CardDef, ActiveCard } from './cards';
import { drawCards, ALL_CARDS_BY_BLOODLINE } from './cards';

// ============================================================
// TYPES
// ============================================================

export interface StatusEffect {
  id: string;
  name: string;
  icon: string;
  turnsLeft: number;
  // Per-turn effects
  burnDamage?: number;
  poisonDamage?: number;
  healPerTurn?: number;
  // Stat modifiers
  attackMod?: number;    // percentage
  defenseMod?: number;   // percentage
  dodgeMod?: number;     // percentage
  // Special
  stun?: boolean;
  markedMod?: number;    // +% damage taken
}

export interface BattleFighter {
  id: string;
  name: string;
  bloodline: Bloodline;
  maxHp: number;
  currentHp: number;
  shield: number;        // temporary HP buffer
  speed: number;         // determines turn order (1-10, from character stats)
  baseAttack: number;    // derived from character stats
  baseDefense: number;
  isAlive: boolean;
  statusEffects: StatusEffect[];
  // Per-turn tracking
  attackBuff: number;    // percentage buff
  defenseBuff: number;
  dodgeChance: number;
}

export interface BattleEvent {
  turn: number;
  type: 'play_card' | 'damage' | 'crit' | 'dodge' | 'heal' | 'shield' |
        'burn' | 'poison' | 'buff' | 'debuff' | 'stun' | 'mark' | 'drain' |
        'death' | 'victory' | 'energy' | 'draw';
  source: string;
  target: string;
  value: number;
  cardName?: string;
  message: string;
}

export interface BattleState {
  team1: BattleFighter[];
  team2: BattleFighter[];
  currentTurn: number;
  phase: 'player_turn' | 'ai_turn' | 'resolve' | 'game_over';
  hand: ActiveCard[];        // player's current hand (max 6)
  energy: number;            // current energy
  maxEnergy: number;
  energyPerTurn: number;
  events: BattleEvent[];
  winner: 1 | 2 | null;
  rewards: { vein: number; ore: number } | null;
  // Round tracking
  cardsPlayedThisTurn: number;
}

// ============================================================
// STAT CONVERSION — Character stats → Battle stats
// ============================================================

function charToFighter(c: Character): BattleFighter {
  const baseHp = c.stats.hp * 12 + 30;
  return {
    id: c.id,
    name: c.name,
    bloodline: c.bloodline,
    maxHp: baseHp,
    currentHp: baseHp,
    shield: 0,
    speed: c.stats.battle + Math.floor(Math.random() * 3), // battle stat + variance
    baseAttack: c.stats.battle * 2 + 5,
    baseDefense: c.stats.hp,
    isAlive: true,
    statusEffects: [],
    attackBuff: 0,
    defenseBuff: 0,
    dodgeChance: 0,
  };
}

// ============================================================
// INITIALIZE BATTLE
// ============================================================

export function initBattle(
  team1Chars: Character[],
  team2Chars: Character[],
): BattleState {
  const team1 = team1Chars.map(charToFighter);
  const team2 = team2Chars.map(charToFighter);

  // Draw initial hand (6 cards)
  const hand = drawCards(
    team1Chars.map(c => ({ id: c.id, name: c.name, bloodline: c.bloodline })),
    6,
  );

  return {
    team1,
    team2,
    currentTurn: 0,
    phase: 'player_turn',
    hand,
    energy: 3,        // start with 3
    maxEnergy: 10,
    energyPerTurn: 2,
    events: [{
      turn: 0,
      type: 'draw',
      source: 'System',
      target: 'Player',
      value: 6,
      message: '⚔ Battle begins! Draw 6 cards. Starting energy: 3.',
    }],
    winner: null,
    rewards: null,
    cardsPlayedThisTurn: 0,
  };
}

// ============================================================
// START NEW TURN — gain energy, draw cards
// ============================================================

export function startTurn(state: BattleState): BattleState {
  if (state.phase !== 'player_turn') return state;

  const nextTurn = state.currentTurn + 1;
  const newEvents: BattleEvent[] = [];

  // Gain energy
  const gainedEnergy = Math.min(state.energyPerTurn, state.maxEnergy - state.energy);
  const newEnergy = state.energy + gainedEnergy;

  if (gainedEnergy > 0) {
    newEvents.push({
      turn: nextTurn,
      type: 'energy',
      source: 'System',
      target: 'Player',
      value: gainedEnergy,
      message: `⚡ Gained ${gainedEnergy} energy. (${newEnergy}/${state.maxEnergy})`,
    });
  }

  // Draw up to 6
  const needCards = 6 - state.hand.length;
  if (needCards > 0) {
    const allChars = [...state.team1.filter(f => f.isAlive)];
    const newCards = drawCards(
      allChars.map(f => ({ id: f.id, name: f.name, bloodline: f.bloodline })),
      needCards,
    );
    if (newCards.length > 0) {
      newEvents.push({
        turn: nextTurn,
        type: 'draw',
        source: 'System',
        target: 'Player',
        value: newCards.length,
        message: `🃏 Drew ${newCards.length} card(s).`,
      });
    }

    return {
      ...state,
      currentTurn: nextTurn,
      energy: newEnergy,
      hand: [...state.hand, ...newCards],
      cardsPlayedThisTurn: 0,
      phase: 'player_turn',
      events: [...state.events, ...newEvents],
    };
  }

  return {
    ...state,
    currentTurn: nextTurn,
    energy: newEnergy,
    cardsPlayedThisTurn: 0,
    phase: 'player_turn',
    events: [...state.events, ...newEvents],
  };
}

// ============================================================
// PLAY A CARD (Player action)
// ============================================================

export interface PlayCardResult {
  state: BattleState;
  cardPlayed: string;
  success: boolean;
  error?: string;
}

export function playCard(state: BattleState, cardIndex: number): PlayCardResult {
  if (state.phase !== 'player_turn') {
    return { state, cardPlayed: '', success: false, error: 'Not your turn.' };
  }
  if (cardIndex < 0 || cardIndex >= state.hand.length) {
    return { state, cardPlayed: '', success: false, error: 'Invalid card.' };
  }
  const card = state.hand[cardIndex];
  if (card.energy > state.energy) {
    return { state, cardPlayed: '', success: false, error: `Need ${card.energy} energy, have ${state.energy}.` };
  }

  // Find the owner fighter (must be alive)
  const owner = state.team1.find(f => f.id === card.ownerId && f.isAlive);
  if (!owner) {
    return { state, cardPlayed: '', success: false, error: `${card.ownerName} is dead.` };
  }

  // Check stun
  if (owner.statusEffects.some(e => e.stun)) {
    return { state, cardPlayed: '', success: false, error: `${owner.name} is stunned!` };
  }

  // Resolve card
  const newState = resolveCard({ ...state }, card, owner, 'player');

  // Remove card from hand, deduct energy
  const newHand = [...newState.hand];
  newHand.splice(cardIndex, 1);

  return {
    state: {
      ...newState,
      hand: newHand,
      energy: newState.energy - card.energy,
      cardsPlayedThisTurn: newState.cardsPlayedThisTurn + 1,
      phase: 'player_turn', // can play more cards or end turn
    },
    cardPlayed: card.name,
    success: true,
  };
}

// ============================================================
// AI TURN — pick and play a card
// ============================================================

export function aiTurn(state: BattleState): BattleState {
  if (state.phase !== 'ai_turn') return state;

  let mutable = { ...state, hand: [...state.hand] };
  const liveAllies = mutable.team2.filter(f => f.isAlive && !f.statusEffects.some(e => e.stun));

  if (liveAllies.length === 0) {
    return {
      ...mutable,
      phase: 'resolve',
      events: [...mutable.events, {
        turn: mutable.currentTurn,
        type: 'stun',
        source: 'AI',
        target: 'AI',
        value: 0,
        message: '🤖 AI has no available fighters.',
      }],
    };
  }

  // AI strategy: pick random alive ally, play their most expensive affordable card
  const fighter = liveAllies[Math.floor(Math.random() * liveAllies.length)];
  
  // Generate AI hand (simplified — pick from fighter's bloodline)
  const aiCards: ActiveCard[] = [];
  for (const cardDef of ALL_CARDS_BY_BLOODLINE[fighter.bloodline]) {
    aiCards.push({ ...cardDef, ownerId: fighter.id, ownerName: fighter.name });
  }

  // Pick affordable cards, prefer expensive
  const affordable = aiCards
    .filter(c => c.energy <= mutable.energy)
    .sort((a, b) => b.energy - a.energy || b.damage - a.damage);

  if (affordable.length === 0) {
    return { ...mutable, phase: 'resolve', events: [...mutable.events, {
      turn: mutable.currentTurn,
      type: 'energy',
      source: 'AI',
      target: 'AI',
      value: 0,
      message: '🤖 AI passes (no affordable cards).',
    }]};
  }

  const card = affordable[0];
  mutable = resolveCard(mutable, card, fighter, 'ai');

  // Remove played card concept (AI has infinite card pool but pays energy)
  // AI plays one card per turn for balance
  const usedEnergy = Math.min(card.energy, mutable.energy);
  return {
    ...mutable,
    energy: mutable.energy - usedEnergy,
    phase: 'resolve',
  };
}

// ============================================================
// RESOLVE A CARD
// ============================================================

function resolveCard(
  state: BattleState,
  card: ActiveCard,
  owner: BattleFighter,
  source: 'player' | 'ai',
): BattleState {
  const newEvents: BattleEvent[] = [...state.events];
  const attackerTeam = source === 'player' ? state.team1 : state.team2;
  const defenderTeam = source === 'player' ? state.team2 : state.team1;

  // Find target
  let target: BattleFighter | null = null;
  const aliveDefenders = defenderTeam.filter(f => f.isAlive);

  if (aliveDefenders.length === 0) {
    return state; // no targets
  }

  // Target selection: first alive (for simplicity; players will choose in UI)
  if (card.target === 'enemy') {
    target = aliveDefenders[0];
  } else if (card.target === 'all_enemies') {
    target = aliveDefenders[0]; // primary target for message, all take damage
  } else if (card.target === 'self') {
    target = owner;
  } else if (card.target === 'all_allies') {
    target = owner; // primary target
  }

  if (!target) return state;

  // Check if dead
  if (!owner.isAlive) return state;

  // STUN CHECK
  if (owner.statusEffects.some(e => e.stun)) {
    // Remove stun for next turn
    owner.statusEffects = owner.statusEffects.filter(e => !e.stun);
    newEvents.push({
      turn: state.currentTurn,
      type: 'stun',
      source: owner.name,
      target: target.name,
      value: 0,
      cardName: card.name,
      message: `💫 ${owner.name} is stunned and loses their turn!`,
    });
    return { ...state, events: newEvents };
  }

  // Log card played
  newEvents.push({
    turn: state.currentTurn,
    type: 'play_card',
    source: owner.name,
    target: card.target === 'self' || card.target === 'all_allies' ? owner.name : target.name,
    value: card.energy,
    cardName: card.name,
    message: `${source === 'player' ? '🎮' : '🤖'} ${owner.name} plays **${card.name}** (${card.energy}⚡)`,
  });

  // Calculate damage
  let finalDamage = card.damage;
  const isAttack = card.type === 'attack';

  if (isAttack && finalDamage > 0) {
    // Apply attack buffs
    const attackMod = 1 + (owner.attackBuff + 
      owner.statusEffects.reduce((sum, e) => sum + (e.attackMod || 0), 0)) / 100;
    finalDamage = Math.floor(finalDamage * attackMod);

    // Apply card-specific effects
    if (card.id === 'iron_execution') {
      const hpPercent = (target.currentHp / target.maxHp) * 100;
      if (hpPercent < 40) finalDamage *= 2;
    }
    if (card.id === 'shadow_backstab' && state.cardsPlayedThisTurn === 0) {
      finalDamage = Math.floor(finalDamage * 1.5);
      newEvents.push({
        turn: state.currentTurn, type: 'crit', source: owner.name,
        target: target.name, value: finalDamage,
        cardName: card.name, message: `💥 Backstab CRIT! ${owner.name} struck first!`,
      });
    }
    if (card.id === 'delver_heartvein_burst') {
      finalDamage = Math.floor(finalDamage * 1.5); // ignores 50% defense
    }
    if (card.id === 'vein_overload') {
      const buffCount = target.statusEffects.filter(e => (e.attackMod || 0) > 0 || (e.defenseMod || 0) > 0).length;
      finalDamage += buffCount * 20;
    }

    // Apply defense
    const defenseMod = 1 - (target.defenseBuff +
      target.statusEffects.reduce((sum, e) => sum + (e.defenseMod || 0), 0)) / 100;
    finalDamage = Math.max(1, Math.floor(finalDamage * defenseMod));

    // DODGE CHECK
    const dodgeChance = target.dodgeChance +
      target.statusEffects.reduce((sum, e) => sum + (e.dodgeMod || 0), 0);
    
    if (Math.random() * 100 < dodgeChance) {
      newEvents.push({
        turn: state.currentTurn, type: 'dodge', source: owner.name,
        target: target.name, value: finalDamage,
        cardName: card.name, message: `💨 ${target.name} dodged ${card.name}!`,
      });
      return { ...state, events: newEvents };
    }
  }

  // Apply damage (through shield first)
  if (isAttack && finalDamage > 0) {
    if (target.shield > 0) {
      const shieldAbsorb = Math.min(target.shield, finalDamage);
      target.shield -= shieldAbsorb;
      finalDamage -= shieldAbsorb;
      newEvents.push({
        turn: state.currentTurn, type: 'shield', source: owner.name,
        target: target.name, value: shieldAbsorb,
        message: `🛡 ${target.name}'s shield absorbed ${shieldAbsorb} damage! (${target.shield} remaining)`,
      });
    }

    if (finalDamage > 0) {
      target.currentHp = Math.max(0, target.currentHp - finalDamage);
      newEvents.push({
        turn: state.currentTurn, type: 'damage', source: owner.name,
        target: target.name, value: finalDamage,
        cardName: card.name,
        message: `💥 ${target.name} takes ${finalDamage} damage! (${target.currentHp}/${target.maxHp} HP)`,
      });
    }
  }

  // APPLY CARD EFFECTS
  if (card.id === 'forge_ember') {
    addStatus(target, { id: 'burn', name: 'Burn', icon: '🔥', turnsLeft: 3, burnDamage: 15 }, newEvents, state.currentTurn);
  }
  if (card.id === 'forge_flame_wave') {
    for (const def of aliveDefenders) {
      if (def.isAlive) {
        addStatus(def, { id: 'burn', name: 'Burn', icon: '🔥', turnsLeft: 2, burnDamage: 12 }, newEvents, state.currentTurn);
        // Also deal AoE damage
        if (def !== target && card.damage > 0) {
          const aoeDmg = Math.floor(card.damage * 0.75);
          if (def.shield > 0) { def.shield = Math.max(0, def.shield - aoeDmg); }
          else { def.currentHp = Math.max(0, def.currentHp - aoeDmg); }
        }
      }
    }
  }
  if (card.id === 'forge_molten_armor') {
    owner.shield += 60;
    newEvents.push({
      turn: state.currentTurn, type: 'shield', source: owner.name,
      target: owner.name, value: 60,
      message: `🛡 ${owner.name} gains 60 shield!`,
    });
    // Thorns: attackers take damage
    addStatus(owner, { id: 'thorns', name: 'Molten Armor', icon: '🔥', turnsLeft: 3, burnDamage: 10 }, newEvents, state.currentTurn);
  }
  if (card.id === 'forge_inferno') {
    const burnStacks = target.statusEffects.filter(e => e.burnDamage).length;
    finalDamage += burnStacks * 25;
    target.statusEffects = target.statusEffects.filter(e => !e.burnDamage);
    newEvents.push({
      turn: state.currentTurn, type: 'burn', source: owner.name,
      target: target.name, value: burnStacks * 25,
      message: `💣 Inferno consumes ${burnStacks} burn stacks! +${burnStacks * 25} damage!`,
    });
  }
  if (card.id === 'shadow_poison_dagger') {
    addStatus(target, { id: 'poison', name: 'Poison', icon: '🧪', turnsLeft: 4, poisonDamage: 20 }, newEvents, state.currentTurn);
  }
  if (card.id === 'shadow_veil') {
    owner.dodgeChance += 50;
    owner.attackBuff += 30;
    newEvents.push({
      turn: state.currentTurn, type: 'buff', source: owner.name,
      target: owner.name, value: 50,
      message: `🌑 ${owner.name} vanishes into shadow! +50% dodge, +30% next attack.`,
    });
  }
  if (card.id === 'shadow_death_mark') {
    addStatus(target, { id: 'marked', name: 'Marked', icon: '💀', turnsLeft: 2, markedMod: 25 }, newEvents, state.currentTurn);
  }
  if (card.id === 'delver_vein_sense') {
    owner.dodgeChance += 30;
    addStatus(owner, { id: 'vein_sense', name: 'Vein Sense', icon: '👁', turnsLeft: 2, dodgeMod: 30 }, newEvents, state.currentTurn);
  }
  if (card.id === 'delver_cave_in') {
    if (Math.random() < 0.5) {
      addStatus(target, { id: 'stun', name: 'Stunned', icon: '💫', turnsLeft: 1, stun: true }, newEvents, state.currentTurn);
    }
  }
  if (card.id === 'iron_bloodfury') {
    owner.attackBuff += 40;
    // Recoil: take 10% damage per turn
    addStatus(owner, { id: 'bloodfury', name: 'Bloodfury', icon: '🔥', turnsLeft: 3, attackMod: 40, burnDamage: Math.floor(owner.maxHp * 0.1) }, newEvents, state.currentTurn);
  }
  if (card.id === 'iron_cleave') {
    // All enemies take damage (primary target already handled, now secondary)
    for (const def of aliveDefenders) {
      if (def !== target && def.isAlive) {
        const splashDmg = Math.floor(finalDamage * 0.75);
        if (def.shield > 0) { def.shield = Math.max(0, def.shield - splashDmg); }
        else { def.currentHp = Math.max(0, def.currentHp - splashDmg); }
      }
    }
  }
  if (card.id === 'stone_shield_bash') {
    owner.shield += 20;
  }
  if (card.id === 'stone_bastion') {
    for (const ally of attackerTeam) {
      if (ally.isAlive) {
        ally.shield += 40;
      }
    }
    newEvents.push({
      turn: state.currentTurn, type: 'shield', source: owner.name,
      target: 'all allies', value: 40,
      message: `🏰 ${owner.name} shields ALL allies for 40!`,
    });
  }
  if (card.id === 'stone_fortify') {
    owner.defenseBuff += 40;
    const heal = Math.floor(owner.maxHp * 0.1);
    owner.currentHp = Math.min(owner.maxHp, owner.currentHp + heal);
    newEvents.push({
      turn: state.currentTurn, type: 'heal', source: owner.name,
      target: owner.name, value: heal,
      message: `💚 ${owner.name} fortifies and heals ${heal} HP!`,
    });
  }
  if (card.id === 'stone_earthquake') {
    for (const def of aliveDefenders) {
      if (def.isAlive) {
        const eqDmg = card.damage; // base 60 to all
        if (def.shield > 0) { def.shield = Math.max(0, def.shield - eqDmg); }
        else { def.currentHp = Math.max(0, def.currentHp - eqDmg); }
        if (Math.random() < 0.3 && def !== target) {
          addStatus(def, { id: 'stun', name: 'Stunned', icon: '💫', turnsLeft: 1, stun: true }, newEvents, state.currentTurn);
        }
      }
    }
  }
  if (card.id === 'vein_drain') {
    const heal = Math.floor(finalDamage * 0.5);
    owner.currentHp = Math.min(owner.maxHp, owner.currentHp + heal);
    newEvents.push({
      turn: state.currentTurn, type: 'drain', source: owner.name,
      target: target.name, value: heal,
      message: `🧪 ${owner.name} drains ${heal} HP from ${target.name}!`,
    });
  }
  if (card.id === 'vein_flux_shift') {
    // Steal 1 random buff from target
    const targetBuffs = target.statusEffects.filter(e => (e.attackMod || 0) > 0 || (e.defenseMod || 0) > 0 || (e.dodgeMod || 0) > 0);
    if (targetBuffs.length > 0) {
      const stolen = targetBuffs[Math.floor(Math.random() * targetBuffs.length)];
      target.statusEffects = target.statusEffects.filter(e => e.id !== stolen.id);
      owner.statusEffects.push(stolen);
      newEvents.push({
        turn: state.currentTurn, type: 'debuff', source: owner.name,
        target: target.name, value: 0,
        message: `🔄 ${owner.name} steals ${stolen.name} from ${target.name}!`,
      });
    }
  }
  if (card.id === 'vein_catalyst') {
    for (const ally of attackerTeam) {
      if (ally.isAlive) {
        ally.attackBuff += 25;
        const heal = 30;
        ally.currentHp = Math.min(ally.maxHp, ally.currentHp + heal);
      }
    }
    newEvents.push({
      turn: state.currentTurn, type: 'buff', source: owner.name,
      target: 'all allies', value: 25,
      message: `✨ ${owner.name} catalyzes ALL allies! +25% ATK, +30 HP each!`,
    });
  }

  // After all effects, clear one-turn buffs
  owner.dodgeChance = Math.max(0, owner.dodgeChance - 30); // veil fades partially

  // Check deaths
  checkDeaths(defenderTeam, newEvents, state.currentTurn);
  checkDeaths(attackerTeam, newEvents, state.currentTurn);

  return { ...state, events: newEvents };
}

// ============================================================
// RESOLVE TURN — apply burns, poisons, tick down statuses
// ============================================================

export function resolveStatuses(state: BattleState): BattleState {
  const newEvents: BattleEvent[] = [...state.events];
  const allFighters = [...state.team1, ...state.team2];

  for (const fighter of allFighters) {
    if (!fighter.isAlive) continue;

    const remaining: StatusEffect[] = [];

    for (const effect of fighter.statusEffects) {
      // Apply per-turn effects
      if (effect.burnDamage && effect.id !== 'bloodfury') {
        const dmg = effect.burnDamage || 0;
        if (fighter.shield > 0) {
          fighter.shield = Math.max(0, fighter.shield - dmg);
        } else {
          fighter.currentHp = Math.max(0, fighter.currentHp - dmg);
        }
        newEvents.push({
          turn: state.currentTurn, type: 'burn', source: fighter.name,
          target: fighter.name, value: dmg,
          message: `🔥 ${fighter.name} burns for ${dmg} damage!`,
        });
      }
      if (effect.poisonDamage) {
        const dmg = effect.poisonDamage || 0;
        if (fighter.shield > 0) {
          fighter.shield = Math.max(0, fighter.shield - dmg);
        } else {
          fighter.currentHp = Math.max(0, fighter.currentHp - dmg);
        }
        newEvents.push({
          turn: state.currentTurn, type: 'poison', source: fighter.name,
          target: fighter.name, value: dmg,
          message: `🧪 ${fighter.name} suffers ${dmg} poison damage!`,
        });
      }
      if (effect.healPerTurn) {
        fighter.currentHp = Math.min(fighter.maxHp, fighter.currentHp + (effect.healPerTurn || 0));
      }
      if (effect.id === 'thorns' && effect.burnDamage) {
        // Thorns: deals damage back, but applied on hit — handled elsewhere
      }

      // Tick down
      effect.turnsLeft--;
      if (effect.turnsLeft > 0) {
        remaining.push(effect);
      } else {
        newEvents.push({
          turn: state.currentTurn, type: effect.stun ? 'stun' : 'debuff',
          source: fighter.name, target: fighter.name, value: 0,
          message: `${effect.icon} ${fighter.name}'s **${effect.name}** has expired.`,
        });
      }
    }

    fighter.statusEffects = remaining;

    // Reset temporary dodge from veil
    if (fighter.dodgeChance > 0 && !fighter.statusEffects.some(e => e.dodgeMod)) {
      fighter.dodgeChance = Math.max(0, fighter.dodgeChance - 20);
    }
  }

  checkDeaths(state.team1, newEvents, state.currentTurn);
  checkDeaths(state.team2, newEvents, state.currentTurn);

  return { ...state, events: newEvents };
}

// ============================================================
// END TURN — check win condition, switch to next
// ============================================================

export function endTurn(state: BattleState): BattleState {
  // Apply status effects
  let mutable = resolveStatuses(state);

  // Check win condition
  const team1Alive = mutable.team1.filter(f => f.isAlive);
  const team2Alive = mutable.team2.filter(f => f.isAlive);

  if (team1Alive.length === 0) {
    return endGame(mutable, 2);
  }
  if (team2Alive.length === 0) {
    return endGame(mutable, 1);
  }

  // Start new turn
  return startTurn(mutable);
}

// ============================================================
// HELPER: Add status effect
// ============================================================

function addStatus(
  fighter: BattleFighter,
  effect: StatusEffect,
  events: BattleEvent[],
  turn: number,
) {
  // Don't stack same effect
  const existing = fighter.statusEffects.find(e => e.id === effect.id);
  if (existing) {
    existing.turnsLeft = Math.max(existing.turnsLeft, effect.turnsLeft);
    return;
  }
  fighter.statusEffects.push(effect);
  events.push({
    turn,
    type: effect.stun ? 'stun' : effect.burnDamage ? 'burn' : effect.poisonDamage ? 'poison' : 'buff',
    source: fighter.name,
    target: fighter.name,
    value: 0,
    message: `${effect.icon} ${fighter.name} gains **${effect.name}** for ${effect.turnsLeft} turns!`,
  });
}

// ============================================================
// HELPER: Check for deaths
// ============================================================

function checkDeaths(team: BattleFighter[], events: BattleEvent[], turn: number) {
  for (const fighter of team) {
    if (fighter.currentHp <= 0 && fighter.isAlive) {
      fighter.isAlive = false;
      fighter.shield = 0;
      fighter.statusEffects = [];
      events.push({
        turn,
        type: 'death',
        source: fighter.name,
        target: fighter.name,
        value: 0,
        message: `💀 ${fighter.name} has fallen!`,
      });
    }
  }
}

// ============================================================
// END GAME
// ============================================================

function endGame(state: BattleState, winner: 1 | 2): BattleState {
  const winnerTeam = winner === 1 ? state.team1 : state.team2;
  const loserTeam = winner === 1 ? state.team2 : state.team1;
  const survivors = winnerTeam.filter(f => f.isAlive).length;

  const vein = 100 + survivors * 50;
  const ore = 20 + survivors * 10;

  return {
    ...state,
    phase: 'game_over',
    winner,
    rewards: { vein, ore },
    events: [...state.events, {
      turn: state.currentTurn,
      type: 'victory',
      source: 'System',
      target: winner === 1 ? 'Player' : 'AI',
      value: vein,
      message: `🏆 ${winner === 1 ? 'VICTORY!' : 'DEFEAT!'} ${survivors} survivor(s). Rewards: ${vein} $VEIN, ${ore} Ore.`,
    }],
  };
}

// ============================================================
// AUTO BATTLE (full AI — for simulate)
// ============================================================

export function autoBattle(state: BattleState, maxTurns: number = 30): BattleState {
  let mutable = { ...state };
  for (let i = 0; i < maxTurns; i++) {
    if (mutable.phase === 'game_over') break;

    // Player auto: play cheapest attack card
    if (mutable.phase === 'player_turn') {
      const attackCards = mutable.hand
        .map((c, idx) => ({ card: c, idx }))
        .filter(({ card }) => card.energy <= mutable.energy && card.type === 'attack')
        .sort((a, b) => a.card.energy - b.card.energy);

      if (attackCards.length > 0) {
        const result = playCard(mutable, attackCards[0].idx);
        if (result.success) {
          mutable = result.state;
        }
      }
      
      // End player turn: switch to AI
      mutable = { ...mutable, phase: 'ai_turn' };
    }

    // AI turn
    if (mutable.phase === 'ai_turn') {
      mutable = aiTurn(mutable);
    }

    // End turn
    if (mutable.phase === 'resolve') {
      mutable = endTurn(mutable);
    }
  }

  return mutable;
}
