// VeinLegends — Idle Mining Engine
// Deploy warriors to mine $VEIN.
// Rate depends on: MINING stat × rarity × parts × active boosts.
// Uses timestamps for true idle/offline mining.

import type { Character, Rarity } from './characters';
import { BLOODLINES, RARITY_CONFIG } from './characters';

// ============================================================
// TYPES
// ============================================================

export type MiningBoostType = 'none' | 'vein_tea' | 'crystal_infusion' | 'heartvein_essence';

export interface MiningBoost {
  type: MiningBoostType;
  multiplier: number;   // 1.0 = no boost, 1.5 = 50% more
  remainingMs: number;  // duration in milliseconds
}

export interface MiningSlot {
  id: number;
  character: Character | null;
  deployedAt: number;       // timestamp when deployed
  lastClaimedAt: number;    // timestamp of last claim
  accumulated: number;      // $VEIN accumulated since last claim (redundant, calculated)
  totalMined: number;       // lifetime $VEIN mined by this slot
  locked: boolean;          // locked until purchased
  unlockCost: number;       // $VEIN to unlock this slot
}

export interface MiningState {
  slots: MiningSlot[];
  activeBoosts: MiningBoost[];
  totalClaimed: number;     // lifetime $VEIN claimed
  unlockedSlots: number;
  maxSlots: number;
}

// ============================================================
// CONSTANTS
// ============================================================

const BASE_MINING_RATE = 3; // $VEIN per hour for 1 mining stat at Common

const SLOT_UNLOCK_COSTS: Record<number, number> = {
  2: 200,    // slot 2
  3: 500,    // slot 3
  4: 1500,   // slot 4
  5: 5000,   // slot 5
  6: 15000,  // slot 6 (max)
};

const MAX_SLOTS = 6;

// ============================================================
// MINING RATE CALCULATION
// ============================================================

/**
 * Calculate mining rate in $VEIN per hour for a character.
 */
export function getMiningRate(char: Character): number {
  const base = BASE_MINING_RATE;
  const miningStat = char.stats.mining;
  const rarityMult = RARITY_CONFIG[char.rarity].statMultiplier;

  // Bloodline bonus: Delver gets +50% mining
  const bloodlineMult = char.bloodline === 'Delver' ? 1.5 : 1.0;

  // Generation penalty: later generations are slightly worse at mining
  // (they're bred for battle, not mining)
  const genPenalty = Math.max(0.5, 1 - (char.generation * 0.05));

  return Math.round(base * miningStat * rarityMult * bloodlineMult * genPenalty);
}

/**
 * Calculate mining rate with active boosts.
 */
export function getBoostedMiningRate(char: Character, boosts: MiningBoost[]): number {
  const base = getMiningRate(char);
  const now = Date.now();

  let multiplier = 1.0;
  for (const boost of boosts) {
    if (boost.remainingMs > 0 && (boost.type !== 'none')) {
      // Check if boost is still active
      multiplier *= boost.multiplier;
    }
  }

  return Math.round(base * multiplier);
}

/**
 * Calculate how much $VEIN has been mined since last claim.
 */
export function getAccumulated(slot: MiningSlot): number {
  if (!slot.character) return 0;

  const now = Date.now();
  const elapsedHours = (now - slot.lastClaimedAt) / (1000 * 60 * 60);

  // Cap at 24 hours max idle (anti-abuse)
  const cappedHours = Math.min(elapsedHours, 24);

  const rate = getMiningRate(slot.character);
  return Math.floor(rate * cappedHours);
}

/**
 * Format VEIN per hour as string.
 */
export function formatRate(rate: number): string {
  if (rate >= 1000) return `${(rate / 1000).toFixed(1)}K`;
  return `${rate}`;
}

// ============================================================
// SLOT MANAGEMENT
// ============================================================

export function createInitialState(): MiningState {
  return {
    slots: [
      createSlot(1, false, 0), // slot 1 always free
      createSlot(2, true, SLOT_UNLOCK_COSTS[2]),
      createSlot(3, true, SLOT_UNLOCK_COSTS[3]),
      createSlot(4, true, SLOT_UNLOCK_COSTS[4]),
      createSlot(5, true, SLOT_UNLOCK_COSTS[5]),
      createSlot(6, true, SLOT_UNLOCK_COSTS[6]),
    ],
    activeBoosts: [],
    totalClaimed: 0,
    unlockedSlots: 1,
    maxSlots: MAX_SLOTS,
  };
}

function createSlot(id: number, locked: boolean, unlockCost: number): MiningSlot {
  return {
    id,
    character: null,
    deployedAt: 0,
    lastClaimedAt: 0,
    accumulated: 0,
    totalMined: 0,
    locked,
    unlockCost,
  };
}

/**
 * Deploy a character to a mining slot.
 */
export function deployCharacter(
  state: MiningState,
  slotId: number,
  character: Character,
): MiningState {
  const slots = state.slots.map(slot => {
    if (slot.id === slotId && !slot.locked) {
      const now = Date.now();
      return {
        ...slot,
        character,
        deployedAt: now,
        lastClaimedAt: now,
        accumulated: 0,
      };
    }
    // Remove character from other slots if already deployed
    if (slot.character?.id === character.id && slot.id !== slotId) {
      return { ...slot, character: null, deployedAt: 0, lastClaimedAt: 0 };
    }
    return slot;
  });

  return { ...state, slots };
}

/**
 * Unequip a character from a mining slot.
 */
export function undeployCharacter(state: MiningState, slotId: number): MiningState {
  // Auto-claim before undeploying
  let newState = claimSlot(state, slotId);

  const slots = newState.slots.map(slot => {
    if (slot.id === slotId) {
      return { ...slot, character: null, deployedAt: 0, lastClaimedAt: 0 };
    }
    return slot;
  });

  return { ...newState, slots };
}

/**
 * Claim accumulated $VEIN from a specific slot.
 */
export function claimSlot(state: MiningState, slotId: number): MiningState {
  const now = Date.now();
  let claimed = 0;

  const slots = state.slots.map(slot => {
    if (slot.id === slotId && slot.character) {
      const accumulated = getAccumulated(slot);
      claimed = accumulated;
      return {
        ...slot,
        lastClaimedAt: now,
        accumulated: 0,
        totalMined: slot.totalMined + accumulated,
      };
    }
    return slot;
  });

  return {
    ...state,
    slots,
    totalClaimed: state.totalClaimed + claimed,
  };
}

/**
 * Claim ALL slots at once.
 */
export function claimAll(state: MiningState): { state: MiningState; totalClaimed: number } {
  let total = 0;
  let newState = { ...state };

  for (const slot of newState.slots) {
    if (slot.character && !slot.locked) {
      const result = claimSlot(newState, slot.id);
      total += result.totalClaimed - newState.totalClaimed;
      newState = result;
    }
  }

  // Recalculate: claim all at once
  const now = Date.now();
  total = 0;
  const slots = state.slots.map(slot => {
    if (slot.character && !slot.locked) {
      const acc = getAccumulated(slot);
      total += acc;
      return {
        ...slot,
        lastClaimedAt: now,
        accumulated: 0,
        totalMined: slot.totalMined + acc,
      };
    }
    return slot;
  });

  return {
    state: { ...state, slots, totalClaimed: state.totalClaimed + total },
    totalClaimed: total,
  };
}

/**
 * Unlock a mining slot by paying $VEIN.
 */
export function unlockSlot(state: MiningState, slotId: number): MiningState | { error: string } {
  const slot = state.slots.find(s => s.id === slotId);
  if (!slot) return { error: 'Invalid slot.' };
  if (!slot.locked) return { error: 'Slot already unlocked.' };
  if (state.totalClaimed < slot.unlockCost) {
    return { error: `Need ${slot.unlockCost} $VEIN. Have ${state.totalClaimed}.` };
  }

  const slots = state.slots.map(s => {
    if (s.id === slotId) {
      return { ...s, locked: false, unlockCost: 0 };
    }
    return s;
  });

  return {
    ...state,
    slots,
    unlockedSlots: state.unlockedSlots + 1,
    totalClaimed: state.totalClaimed - slot.unlockCost,
  };
}

// ============================================================
// BOOST SYSTEM
// ============================================================

export const BOOSTS: Record<MiningBoostType, { name: string; icon: string; multiplier: number; durationMs: number; cost: number }> = {
  none: { name: 'None', icon: '', multiplier: 1.0, durationMs: 0, cost: 0 },
  vein_tea: {
    name: 'Vein Tea',
    icon: '🍵',
    multiplier: 1.25,
    durationMs: 2 * 60 * 60 * 1000, // 2 hours
    cost: 50,
  },
  crystal_infusion: {
    name: 'Crystal Infusion',
    icon: '💎',
    multiplier: 1.5,
    durationMs: 4 * 60 * 60 * 1000, // 4 hours
    cost: 150,
  },
  heartvein_essence: {
    name: 'Heartvein Essence',
    icon: '✨',
    multiplier: 2.0,
    durationMs: 1 * 60 * 60 * 1000, // 1 hour (powerful but short)
    cost: 300,
  },
};

export function activateBoost(state: MiningState, type: MiningBoostType): MiningState | { error: string } {
  if (type === 'none') return { error: 'Invalid boost type.' };

  const boostDef = BOOSTS[type];
  if (state.totalClaimed < boostDef.cost) {
    return { error: `Need ${boostDef.cost} $VEIN for ${boostDef.name}. Have ${state.totalClaimed}.` };
  }

  // Check if boost already active
  const existing = state.activeBoosts.find(b => b.type === type);
  if (existing && existing.remainingMs > 0) {
    return { error: `${boostDef.name} is already active!` };
  }

  const newBoost: MiningBoost = {
    type,
    multiplier: boostDef.multiplier,
    remainingMs: boostDef.durationMs,
  };

  // Clean expired boosts
  const now = Date.now();
  const activeBoosts = [
    ...state.activeBoosts.filter(b => b.remainingMs > 0),
    newBoost,
  ];

  return {
    ...state,
    activeBoosts,
    totalClaimed: state.totalClaimed - boostDef.cost,
  };
}

/**
 * Tick boost timers — call this periodically.
 */
export function tickBoosts(state: MiningState): MiningState {
  const now = Date.now();
  const elapsed = 1000; // assume 1 second tick

  const activeBoosts = state.activeBoosts
    .map(b => ({ ...b, remainingMs: b.remainingMs - elapsed }))
    .filter(b => b.remainingMs > 0);

  return { ...state, activeBoosts };
}

// ============================================================
// TOTAL RATE (all slots)
// ============================================================

export function getTotalMiningRate(state: MiningState): number {
  let total = 0;
  for (const slot of state.slots) {
    if (slot.character && !slot.locked) {
      total += getBoostedMiningRate(slot.character, state.activeBoosts);
    }
  }
  return total;
}

export function getTotalAccumulated(state: MiningState): number {
  let total = 0;
  for (const slot of state.slots) {
    if (slot.character && !slot.locked) {
      total += getAccumulated(slot);
    }
  }
  return total;
}

// ============================================================
// PERSISTENCE (localStorage for demo)
// ============================================================

const STORAGE_KEY = 'veinlegends_mining';

export function saveMiningState(state: MiningState): void {
  if (typeof window === 'undefined') return;
  try {
    const serialized = {
      ...state,
      // Don't store full character objects, just IDs
      slots: state.slots.map(s => ({
        ...s,
        character: s.character ? { id: s.character.id, name: s.character.name } : null,
      })),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
  } catch { /* localStorage full */ }
}

export function loadMiningState(): MiningState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as MiningState;
  } catch {
    return null;
  }
}
