// VeinLegends — Weapon Registry
// Maps bloodline + rarity → weapon SVG overlay for character cards.
// Extracted from the modular parts system.

import type { Bloodline, Rarity } from './characters';

export interface WeaponDef {
  id: string;
  name: string;
  icon: string;          // emoji icon
  bloodline: Bloodline;
  rarity: Rarity;
  svgGroup: string;
  scale: number;
  glowColor: string;
  animation: boolean;
}

// ============================================================
// ALL 24 WEAPONS (6 bloodlines × 4 rarities)
// ============================================================

const WEAPONS: Record<Bloodline, Record<Rarity, WeaponDef>> = {
  // ⛏ DELVER — Mining tools
  Delver: {
    Common: {
      id: 'delver_wpn_c', icon: '⛏',name: 'Rusty Pickaxe', bloodline: 'Delver', rarity: 'Common',
      svgGroup: '<g transform="translate(180,100) rotate(20)"><rect x="-3" y="0" width="6" height="65" rx="2" fill="#795548"/><rect x="-10" y="-6" width="6" height="22" rx="1" fill="#9E9E9E"/><rect x="4" y="-6" width="6" height="22" rx="1" fill="#9E9E9E"/></g>',
      scale: 1.0, glowColor: '#6B7280', animation: false,
    },
    Rare: {
      id: 'delver_wpn_r', icon: '⛏',name: 'Steel Pickaxe', bloodline: 'Delver', rarity: 'Rare',
      svgGroup: '<g transform="translate(180,100) rotate(20)"><rect x="-3" y="0" width="6" height="65" rx="2" fill="#455A64"/><rect x="-12" y="-8" width="8" height="25" rx="2" fill="#78909C"/><rect x="4" y="-8" width="8" height="25" rx="2" fill="#78909C"/><circle cx="0" cy="35" r="2" fill="#FFC107"/></g>',
      scale: 1.05, glowColor: '#3B82F6', animation: false,
    },
    Epic: {
      id: 'delver_wpn_e', icon: '⚡',name: 'Vein-Charged Drill', bloodline: 'Delver', rarity: 'Epic',
      svgGroup: '<g transform="translate(180,100) rotate(20)"><rect x="-3" y="0" width="6" height="60" rx="2" fill="#37474F"/><rect x="-15" y="-14" width="30" height="18" rx="4" fill="#546E7A"/><circle cx="0" cy="-8" r="5" fill="#00E5FF" opacity="0.7"><animate attributeName="opacity" values="0.7;1;0.7" dur="1s" repeatCount="indefinite"/></circle></g>',
      scale: 1.1, glowColor: '#A855F7', animation: true,
    },
    Legendary: {
      id: 'delver_wpn_l', icon: '💎',name: 'Heartvein Excavator', bloodline: 'Delver', rarity: 'Legendary',
      svgGroup: '<g transform="translate(180,100) rotate(20)"><rect x="-3" y="0" width="6" height="55" rx="2" fill="#1A1A2E"/><rect x="-18" y="-18" width="36" height="22" rx="5" fill="#FFC107"/><circle cx="0" cy="-6" r="6" fill="#00E5FF"><animate attributeName="r" values="6;10;6" dur="0.8s" repeatCount="indefinite"/></circle><path d="M -12 -18 L 12 -18" stroke="#FFF" stroke-width="1"/></g>',
      scale: 1.15, glowColor: '#FACC15', animation: true,
    },
  },

  // ⚔ IRONBLOOD — Swords
  Ironblood: {
    Common: {
      id: 'iron_wpn_c', icon: '⚔',name: 'Rusty Blade', bloodline: 'Ironblood', rarity: 'Common',
      svgGroup: '<g transform="translate(178,110) rotate(30)"><rect x="-4" y="0" width="8" height="55" fill="#795548"/><rect x="-6" y="-12" width="12" height="22" rx="2" fill="#9E9E9E"/></g>',
      scale: 1.0, glowColor: '#6B7280', animation: false,
    },
    Rare: {
      id: 'iron_wpn_r', icon: '⚔',name: 'Tempered Steel', bloodline: 'Ironblood', rarity: 'Rare',
      svgGroup: '<g transform="translate(180,110) rotate(30)"><rect x="-3" y="0" width="6" height="58" fill="#616161"/><rect x="-8" y="-14" width="16" height="22" rx="3" fill="#B0BEC5"/><circle cx="0" cy="35" r="2" fill="#D32F2F"/></g>',
      scale: 1.05, glowColor: '#3B82F6', animation: false,
    },
    Epic: {
      id: 'iron_wpn_e', icon: '🗡',name: 'Bloodletter', bloodline: 'Ironblood', rarity: 'Epic',
      svgGroup: '<g transform="translate(182,110) rotate(30)"><rect x="-3" y="0" width="6" height="55" fill="#212121"/><rect x="-10" y="-18" width="20" height="28" rx="4" fill="#D32F2F"/><path d="M 0 -18 L 0 -30" stroke="#FF1744" stroke-width="1.5"/><circle cx="0" cy="32" r="3" fill="#FF1744"><animate attributeName="opacity" values="1;0.4;1" dur="0.6s" repeatCount="indefinite"/></circle></g>',
      scale: 1.1, glowColor: '#A855F7', animation: true,
    },
    Legendary: {
      id: 'iron_wpn_l', icon: '🔥',name: 'Veinfury Greatsword', bloodline: 'Ironblood', rarity: 'Legendary',
      svgGroup: '<g transform="translate(184,108) rotate(30)"><rect x="-3" y="0" width="6" height="50" fill="#1A1A2E"/><rect x="-12" y="-22" width="24" height="32" rx="5" fill="#FF1744"/><path d="M 0 -22 L 0 -40" stroke="#FFC107" stroke-width="2"/><circle cx="0" cy="25" r="4" fill="#FFC107"><animate attributeName="r" values="4;7;4" dur="0.8s" repeatCount="indefinite"/></circle></g>',
      scale: 1.15, glowColor: '#FACC15', animation: true,
    },
  },

  // 🔥 FORGEBORN — Hammers
  Forgeborn: {
    Common: {
      id: 'forge_wpn_c', icon: '🔨',name: 'Rusty Hammer', bloodline: 'Forgeborn', rarity: 'Common',
      svgGroup: '<g transform="translate(175,95)"><rect x="-3" y="0" width="6" height="70" rx="3" fill="#5D4037"/><rect x="-10" y="-6" width="20" height="14" rx="3" fill="#78909C"/></g>',
      scale: 1.0, glowColor: '#6B7280', animation: false,
    },
    Rare: {
      id: 'forge_wpn_r', icon: '🔨',name: 'Steel Mallet', bloodline: 'Forgeborn', rarity: 'Rare',
      svgGroup: '<g transform="translate(175,92)"><rect x="-3" y="0" width="6" height="75" rx="3" fill="#37474F"/><rect x="-12" y="-6" width="24" height="16" rx="4" fill="#90A4AE"/><circle cx="0" cy="60" r="2" fill="#FF9800"/></g>',
      scale: 1.05, glowColor: '#3B82F6', animation: false,
    },
    Epic: {
      id: 'forge_wpn_e', icon: '🔥',name: 'Flame Maul', bloodline: 'Forgeborn', rarity: 'Epic',
      svgGroup: '<g transform="translate(175,88)"><rect x="-4" y="0" width="8" height="80" rx="3" fill="#212121"/><rect x="-16" y="-6" width="32" height="18" rx="5" fill="#FF5722"/><path d="M -12 -6 L 12 -6" stroke="#FFC107" stroke-width="1"/><circle cx="0" cy="65" r="3" fill="#FF9800"><animate attributeName="r" values="3;6;3" dur="1s" repeatCount="indefinite"/></circle></g>',
      scale: 1.1, glowColor: '#A855F7', animation: true,
    },
    Legendary: {
      id: 'forge_wpn_l', icon: '💣',name: 'Sunderforge', bloodline: 'Forgeborn', rarity: 'Legendary',
      svgGroup: '<g transform="translate(174,84)"><rect x="-4" y="0" width="8" height="85" rx="4" fill="#1A1A1A"/><rect x="-18" y="-8" width="36" height="22" rx="6" fill="#FF9800"/><path d="M -14 -8 L 14 -8 M -14 2 L 14 2" stroke="#FFC107" stroke-width="1"/><circle cx="0" cy="70" r="4" fill="#FF1744"><animate attributeName="r" values="4;8;4" dur="0.7s" repeatCount="indefinite"/></circle><path d="M -18 10 L -8 0 M 18 10 L 8 0" fill="#FFC107" opacity="0.5"/></g>',
      scale: 1.15, glowColor: '#FACC15', animation: true,
    },
  },

  // 🗡 SHADOWVEIN — Daggers / Blades
  Shadowvein: {
    Common: {
      id: 'shad_wpn_c', icon: '🗡',name: 'Rusty Dagger', bloodline: 'Shadowvein', rarity: 'Common',
      svgGroup: '<g transform="translate(175,135) rotate(-40)"><rect x="-3" y="0" width="6" height="30" rx="2" fill="#424242"/><circle cx="0" cy="-5" r="4" fill="#616161"/></g>',
      scale: 1.0, glowColor: '#6B7280', animation: false,
    },
    Rare: {
      id: 'shad_wpn_r', icon: '🗡',name: 'Shadow Fang', bloodline: 'Shadowvein', rarity: 'Rare',
      svgGroup: '<g transform="translate(178,135) rotate(-35)"><path d="M -5 35 L 25 5 L 15 -2 Z" fill="#311B92"/><circle cx="20" cy="5" r="4" fill="#7C4DFF"/></g>',
      scale: 1.05, glowColor: '#3B82F6', animation: false,
    },
    Epic: {
      id: 'shad_wpn_e', icon: '⚔',name: 'Voidforged Blade', bloodline: 'Shadowvein', rarity: 'Epic',
      svgGroup: '<g transform="translate(180,140) rotate(-30)"><path d="M -8 40 L 35 2 L 22 -5 Z" fill="#1A1A2E"/><path d="M -2 35 L 28 5" stroke="#7C4DFF" stroke-width="1"/><circle cx="28" cy="1" r="5" fill="#E040FB"><animate attributeName="r" values="5;8;5" dur="1.5s" repeatCount="indefinite"/></circle></g>',
      scale: 1.1, glowColor: '#A855F7', animation: true,
    },
    Legendary: {
      id: 'shad_wpn_l', icon: '💀',name: 'Duskreaper', bloodline: 'Shadowvein', rarity: 'Legendary',
      svgGroup: '<g transform="translate(182,142) rotate(-25)"><path d="M -12 45 L 45 -5 L 30 -12 Z" fill="#0A0A1E"/><path d="M -4 38 L 38 -2" stroke="#E040FB" stroke-width="1.5"/><circle cx="35" cy="-7" r="6" fill="#7C4DFF"><animate attributeName="r" values="6;10;6" dur="0.8s" repeatCount="indefinite"/></circle><path d="M -15 50 Q 0 65 -5 75" fill="none" stroke="#9C27B0" stroke-width="0.8" opacity="0.4"/></g>',
      scale: 1.15, glowColor: '#FACC15', animation: true,
    },
  },

  // 🛡 STONEWARDEN — Shields
  Stonewarden: {
    Common: {
      id: 'stone_wpn_c', icon: '🛡',name: 'Wooden Shield', bloodline: 'Stonewarden', rarity: 'Common',
      svgGroup: '<g transform="translate(185,145)"><ellipse cx="0" cy="0" rx="20" ry="24" fill="#5D4037"/><ellipse cx="0" cy="0" rx="12" ry="14" fill="#795548"/></g>',
      scale: 1.0, glowColor: '#6B7280', animation: false,
    },
    Rare: {
      id: 'stone_wpn_r', icon: '🛡',name: 'Iron Bulwark', bloodline: 'Stonewarden', rarity: 'Rare',
      svgGroup: '<g transform="translate(188,145)"><ellipse cx="0" cy="0" rx="22" ry="26" fill="#546E7A"/><ellipse cx="0" cy="0" rx="14" ry="16" fill="#78909C"/><circle cx="0" cy="0" r="6" fill="#00BCD4" opacity="0.4"/></g>',
      scale: 1.05, glowColor: '#3B82F6', animation: false,
    },
    Epic: {
      id: 'stone_wpn_e', icon: '💎',name: 'Crystal Aegis', bloodline: 'Stonewarden', rarity: 'Epic',
      svgGroup: '<g transform="translate(190,143)"><ellipse cx="0" cy="0" rx="24" ry="28" fill="#37474F"/><ellipse cx="0" cy="0" rx="16" ry="18" fill="#00BCD4" opacity="0.4"/><circle cx="0" cy="0" r="8" fill="#00E5FF" opacity="0.3"><animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite"/></circle></g>',
      scale: 1.1, glowColor: '#A855F7', animation: true,
    },
    Legendary: {
      id: 'stone_wpn_l', icon: '🏰', name: "Bastion's Wall", bloodline: 'Stonewarden', rarity: 'Legendary',
      svgGroup: '<g transform="translate(192,142)"><ellipse cx="0" cy="0" rx="28" ry="32" fill="#1C2833"/><ellipse cx="0" cy="0" rx="20" ry="22" fill="#00BCD4" opacity="0.3"/><circle cx="0" cy="0" r="10" fill="#00E5FF" opacity="0.4"><animate attributeName="r" values="10;15;10" dur="1.5s" repeatCount="indefinite"/></circle><path d="M -12 0 L 12 0 M 0 -15 L 0 15" stroke="#00E5FF" stroke-width="0.8" opacity="0.5"/></g>',
      scale: 1.15, glowColor: '#FACC15', animation: true,
    },
  },

  // 🧪 VEINBENDER — Vials / Potions
  Veinbender: {
    Common: {
      id: 'vein_wpn_c', icon: '🧪',name: 'Glass Vial', bloodline: 'Veinbender', rarity: 'Common',
      svgGroup: '<g transform="translate(180,110)"><rect x="-5" y="0" width="10" height="18" rx="3" fill="#B2EBF2" opacity="0.6"/><rect x="-2" y="-8" width="4" height="10" rx="2" fill="#B2EBF2" opacity="0.4"/><circle cx="0" cy="-10" r="2" fill="#00E676" opacity="0.4"/></g>',
      scale: 1.0, glowColor: '#6B7280', animation: false,
    },
    Rare: {
      id: 'vein_wpn_r', icon: '⚗',name: 'Crystal Flask', bloodline: 'Veinbender', rarity: 'Rare',
      svgGroup: '<g transform="translate(182,108)"><rect x="-6" y="0" width="12" height="22" rx="4" fill="#80CBC4" opacity="0.7"/><rect x="-3" y="-10" width="6" height="12" rx="3" fill="#80CBC4" opacity="0.5"/><circle cx="0" cy="-14" r="3" fill="#00E676"><animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite"/></circle></g>',
      scale: 1.05, glowColor: '#3B82F6', animation: true,
    },
    Epic: {
      id: 'vein_wpn_e', icon: '✨',name: 'Vein Elixir', bloodline: 'Veinbender', rarity: 'Epic',
      svgGroup: '<g transform="translate(184,105)"><rect x="-7" y="0" width="14" height="26" rx="5" fill="#4DB6AC" opacity="0.7"/><rect x="-4" y="-12" width="8" height="14" rx="4" fill="#4DB6AC" opacity="0.5"/><circle cx="0" cy="-17" r="4" fill="#00E5FF"><animate attributeName="r" values="4;7;4" dur="1.5s" repeatCount="indefinite"/></circle></g>',
      scale: 1.1, glowColor: '#A855F7', animation: true,
    },
    Legendary: {
      id: 'vein_wpn_l', icon: '💎',name: 'Heartvein Essence', bloodline: 'Veinbender', rarity: 'Legendary',
      svgGroup: '<g transform="translate(186,102)"><rect x="-8" y="0" width="16" height="30" rx="6" fill="#26A69A" opacity="0.75"/><rect x="-5" y="-12" width="10" height="14" rx="4" fill="#26A69A" opacity="0.55"/><circle cx="0" cy="-18" r="5" fill="#00E5FF"><animate attributeName="r" values="5;9;5" dur="1s" repeatCount="indefinite"/></circle><circle cx="0" cy="8" r="2" fill="#00E676" opacity="0.6"><animate attributeName="opacity" values="0.6;0.2;0.6" dur="1.5s" repeatCount="indefinite"/></circle></g>',
      scale: 1.15, glowColor: '#FACC15', animation: true,
    },
  },
};

// ============================================================
// GETTERS
// ============================================================

export function getWeapon(bloodline: Bloodline, rarity: Rarity): WeaponDef {
  return WEAPONS[bloodline][rarity];
}

export function getAllWeapons(): WeaponDef[] {
  return Object.values(WEAPONS).flatMap(bl => Object.values(bl));
}

export const RARITY_WEAPON_GLOW: Record<Rarity, string> = {
  Common: 'drop-shadow(0 0 2px #6B7280)',
  Rare: 'drop-shadow(0 0 4px #3B82F6)',
  Epic: 'drop-shadow(0 0 8px #A855F7)',
  Legendary: 'drop-shadow(0 0 14px #FACC15) drop-shadow(0 0 24px #FACC1566)',
};
