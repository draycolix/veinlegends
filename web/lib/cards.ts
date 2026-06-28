// VeinLegends — Axie-Infinity Style Card System
// Each Bloodline has 4 signature cards.
// Cards are the core combat mechanic — pick one per turn.

import type { Bloodline, Rarity } from './characters';

// ============================================================
// TYPES
// ============================================================

export type CardType =
  | 'attack'    // direct damage
  | 'ability'   // special effect (DoT, drain, stun, etc.)
  | 'defense'   // shield / heal / damage reduction
  | 'buff';     // self-buff or ally buff

export type CardTarget = 'enemy' | 'self' | 'ally' | 'all_enemies' | 'all_allies';

export interface CardDef {
  id: string;
  name: string;
  bloodline: Bloodline;
  energy: number;        // energy cost (0-4)
  damage: number;        // base damage (0 for non-attack cards)
  type: CardType;
  target: CardTarget;
  description: string;
  // Visual
  icon: string;
  color: string;         // tailwind gradient
}

export interface ActiveCard extends CardDef {
  ownerId: string;       // which character owns this card
  ownerName: string;
}

// ============================================================
// CARD POOLS — 4 cards per bloodline
// ============================================================

// ⛏ DELVER — Mining, speed, evasion
export const DELVER_CARDS: CardDef[] = [
  {
    id: 'delver_tunnel_strike',
    name: 'Tunnel Strike',
    bloodline: 'Delver',
    energy: 1,
    damage: 45,
    type: 'attack',
    target: 'enemy',
    description: 'Quick strike from below. Low cost, fast damage.',
    icon: '⛏',
    color: 'from-yellow-500 to-amber-600',
  },
  {
    id: 'delver_vein_sense',
    name: 'Vein Sense',
    bloodline: 'Delver',
    energy: 1,
    damage: 0,
    type: 'buff',
    target: 'self',
    description: 'Heightened perception: +30% dodge for 2 turns and draw 1 extra card.',
    icon: '👁',
    color: 'from-yellow-400 to-yellow-600',
  },
  {
    id: 'delver_cave_in',
    name: 'Cave In',
    bloodline: 'Delver',
    energy: 2,
    damage: 70,
    type: 'attack',
    target: 'enemy',
    description: 'Collapse the tunnel on your enemy. 50% chance to stun for 1 turn.',
    icon: '💥',
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 'delver_heartvein_burst',
    name: 'Heartvein Burst',
    bloodline: 'Delver',
    energy: 3,
    damage: 110,
    type: 'attack',
    target: 'enemy',
    description: 'Channel pure Vein energy into a devastating blast. Ignores 50% defense.',
    icon: '⚡',
    color: 'from-yellow-300 to-amber-500',
  },
];

// ⚔ IRONBLOOD — Aggressive, high damage, sustain
export const IRONBLOOD_CARDS: CardDef[] = [
  {
    id: 'iron_slash',
    name: 'Iron Slash',
    bloodline: 'Ironblood',
    energy: 1,
    damage: 50,
    type: 'attack',
    target: 'enemy',
    description: 'A clean blade strike. Reliable damage.',
    icon: '⚔',
    color: 'from-red-500 to-rose-600',
  },
  {
    id: 'iron_bloodfury',
    name: 'Bloodfury',
    bloodline: 'Ironblood',
    energy: 2,
    damage: 0,
    type: 'buff',
    target: 'self',
    description: 'Enter berserker rage: +40% attack for 3 turns. Take 10% recoil each turn.',
    icon: '🔥',
    color: 'from-red-600 to-red-800',
  },
  {
    id: 'iron_cleave',
    name: 'Cleave',
    bloodline: 'Ironblood',
    energy: 2,
    damage: 65,
    type: 'attack',
    target: 'all_enemies',
    description: 'Sweeping strike hits ALL enemies. 25% reduced damage to secondary targets.',
    icon: '💀',
    color: 'from-red-500 to-rose-500',
  },
  {
    id: 'iron_execution',
    name: 'Execution',
    bloodline: 'Ironblood',
    energy: 3,
    damage: 90,
    type: 'attack',
    target: 'enemy',
    description: 'A lethal finishing blow. Deals 2× damage if target is below 40% HP.',
    icon: '🗡',
    color: 'from-red-700 to-red-900',
  },
];

// 🔥 FORGEBORN — DoT, burn, AoE
export const FORGEBORN_CARDS: CardDef[] = [
  {
    id: 'forge_ember',
    name: 'Ember',
    bloodline: 'Forgeborn',
    energy: 1,
    damage: 35,
    type: 'attack',
    target: 'enemy',
    description: 'Fling a burning ember. Applies BURN: 15 damage/turn for 3 turns.',
    icon: '🔥',
    color: 'from-orange-500 to-red-600',
  },
  {
    id: 'forge_molten_armor',
    name: 'Molten Armor',
    bloodline: 'Forgeborn',
    energy: 2,
    damage: 0,
    type: 'defense',
    target: 'self',
    description: 'Coat yourself in molten metal. Gain 60 shield. Enemies that hit you take 10 burn damage.',
    icon: '🛡',
    color: 'from-amber-600 to-red-700',
  },
  {
    id: 'forge_flame_wave',
    name: 'Flame Wave',
    bloodline: 'Forgeborn',
    energy: 2,
    damage: 50,
    type: 'attack',
    target: 'all_enemies',
    description: 'Unleash a torrent of Vein-fire. All enemies take damage + BURN for 2 turns.',
    icon: '🌊',
    color: 'from-orange-400 to-yellow-500',
  },
  {
    id: 'forge_inferno',
    name: 'Inferno',
    bloodline: 'Forgeborn',
    energy: 3,
    damage: 80,
    type: 'attack',
    target: 'enemy',
    description: 'Consume all burn stacks on target. Explodes for 80 + 25 per burn stack consumed.',
    icon: '💣',
    color: 'from-red-500 to-orange-700',
  },
];

// 🗡 SHADOWVEIN — Critical, stealth, poison
export const SHADOWVEIN_CARDS: CardDef[] = [
  {
    id: 'shadow_backstab',
    name: 'Backstab',
    bloodline: 'Shadowvein',
    energy: 1,
    damage: 40,
    type: 'attack',
    target: 'enemy',
    description: 'Strike from the shadows. Always critical if used first in a turn.',
    icon: '🗡',
    color: 'from-purple-500 to-indigo-600',
  },
  {
    id: 'shadow_veil',
    name: 'Veil',
    bloodline: 'Shadowvein',
    energy: 1,
    damage: 0,
    type: 'buff',
    target: 'self',
    description: 'Fade into darkness. +50% dodge this turn. Next attack deals +30% damage.',
    icon: '🌑',
    color: 'from-indigo-600 to-purple-800',
  },
  {
    id: 'shadow_poison_dagger',
    name: 'Poison Dagger',
    bloodline: 'Shadowvein',
    energy: 2,
    damage: 55,
    type: 'attack',
    target: 'enemy',
    description: 'Coated with Shadowvein toxin. POISON: 20 damage/turn for 4 turns.',
    icon: '🧪',
    color: 'from-purple-600 to-violet-800',
  },
  {
    id: 'shadow_death_mark',
    name: 'Death Mark',
    bloodline: 'Shadowvein',
    energy: 3,
    damage: 70,
    type: 'attack',
    target: 'enemy',
    description: 'Mark target for death. Deals 70 damage. Target takes +25% damage from all sources for 2 turns.',
    icon: '💀',
    color: 'from-violet-700 to-purple-900',
  },
];

// 🛡 STONEWARDEN — Defense, heal, protect
export const STONEWARDEN_CARDS: CardDef[] = [
  {
    id: 'stone_shield_bash',
    name: 'Shield Bash',
    bloodline: 'Stonewarden',
    energy: 1,
    damage: 40,
    type: 'attack',
    target: 'enemy',
    description: 'Bash with your shield. Gain 20 shield on use.',
    icon: '🛡',
    color: 'from-slate-400 to-gray-600',
  },
  {
    id: 'stone_bastion',
    name: 'Bastion',
    bloodline: 'Stonewarden',
    energy: 2,
    damage: 0,
    type: 'defense',
    target: 'all_allies',
    description: 'Raise the Stonewarden barrier. ALL allies gain 40 shield.',
    icon: '🏰',
    color: 'from-blue-500 to-slate-600',
  },
  {
    id: 'stone_fortify',
    name: 'Fortify',
    bloodline: 'Stonewarden',
    energy: 2,
    damage: 0,
    type: 'buff',
    target: 'self',
    description: 'Harden your defenses. +40% defense for 3 turns. Heal 10% max HP.',
    icon: '💎',
    color: 'from-slate-500 to-blue-700',
  },
  {
    id: 'stone_earthquake',
    name: 'Earthquake',
    bloodline: 'Stonewarden',
    energy: 3,
    damage: 60,
    type: 'attack',
    target: 'all_enemies',
    description: 'Shatter the ground beneath all enemies. 60 damage to all. 30% chance to STUN each.',
    icon: '🌍',
    color: 'from-gray-500 to-slate-800',
  },
];

// 🧪 VEINBENDER — Drain, buff steal, support
export const VEINBENDER_CARDS: CardDef[] = [
  {
    id: 'vein_drain',
    name: 'Vein Drain',
    bloodline: 'Veinbender',
    energy: 1,
    damage: 35,
    type: 'attack',
    target: 'enemy',
    description: 'Siphon Vein energy from target. Heal for 50% of damage dealt.',
    icon: '🧪',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'vein_flux_shift',
    name: 'Flux Shift',
    bloodline: 'Veinbender',
    energy: 2,
    damage: 0,
    type: 'ability',
    target: 'enemy',
    description: 'Swap your debuffs onto the enemy. Steal 1 random buff from target.',
    icon: '🔄',
    color: 'from-teal-400 to-emerald-600',
  },
  {
    id: 'vein_overload',
    name: 'Overload',
    bloodline: 'Veinbender',
    energy: 2,
    damage: 60,
    type: 'attack',
    target: 'enemy',
    description: 'Overcharge target with Vein energy. 60 damage. If target has buffs, +20 damage per buff.',
    icon: '⚡',
    color: 'from-cyan-500 to-emerald-500',
  },
  {
    id: 'vein_catalyst',
    name: 'Catalyst',
    bloodline: 'Veinbender',
    energy: 3,
    damage: 0,
    type: 'buff',
    target: 'all_allies',
    description: 'Infuse all allies with pure Vein. ALL allies gain +25% attack & heal 30 HP.',
    icon: '✨',
    color: 'from-green-400 to-cyan-500',
  },
];

// ============================================================
// ALL CARDS
// ============================================================

export const ALL_CARDS_BY_BLOODLINE: Record<Bloodline, CardDef[]> = {
  Delver: DELVER_CARDS,
  Ironblood: IRONBLOOD_CARDS,
  Forgeborn: FORGEBORN_CARDS,
  Shadowvein: SHADOWVEIN_CARDS,
  Stonewarden: STONEWARDEN_CARDS,
  Veinbender: VEINBENDER_CARDS,
};

export const ALL_CARDS: CardDef[] = [
  ...DELVER_CARDS,
  ...IRONBLOOD_CARDS,
  ...FORGEBORN_CARDS,
  ...SHADOWVEIN_CARDS,
  ...STONEWARDEN_CARDS,
  ...VEINBENDER_CARDS,
];

// ============================================================
// DRAW CARDS — generate hand from team
// ============================================================

export function drawCards(team: { id: string; name: string; bloodline: Bloodline }[], count: number): ActiveCard[] {
  const pool: ActiveCard[] = [];
  
  for (const char of team) {
    const cards = ALL_CARDS_BY_BLOODLINE[char.bloodline];
    for (const card of cards) {
      pool.push({
        ...card,
        ownerId: char.id,
        ownerName: char.name,
      });
    }
  }

  // Shuffle and draw
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
