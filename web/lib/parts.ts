// VeinLegends — Modular Part System
// Each character is composed of 5 part slots.
// Parts determine visual appearance AND character rarity.
// Supply-neutral breeding: 2 burned → 2 born (net zero)

export type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';
export type PartSlot = 'head' | 'body' | 'weapon' | 'accessory' | 'aura';
export type Bloodline = 'Delver' | 'Ironblood' | 'Forgeborn' | 'Shadowvein' | 'Stonewarden' | 'Veinbender';
export type BloodlineParts = Record<PartSlot, PartDef[]>;

export interface BloodlinePartSet {
  bloodline: Bloodline;
  slots: Partial<Record<PartSlot, PartDef[]>>;
}

export interface PartDef {
  id: string;
  slot: PartSlot;
  name: string;
  rarity: Rarity;
  // SVG rendering
  svgZIndex: number; // layer order
  svgGroup: string;  // <g> content for this part
  // For part evolution
  upgradeable: boolean; // can this part be upgraded via breeding?
}

// ============================================================
// RARITY CONFIG
// ============================================================

export const PART_RARITY: Record<Rarity, { 
  label: string; 
  color: string; 
  textColor: string; 
  weight: number;  // gacha pull chance
  glow: string;
}> = {
  Common:    { label: 'Common',    color: '#6B7280', textColor: 'text-gray-400',   weight: 50, glow: 'none' },
  Rare:      { label: 'Rare',      color: '#3B82F6', textColor: 'text-blue-400',   weight: 30, glow: '0 0 8px #3B82F688' },
  Epic:      { label: 'Epic',      color: '#A855F7', textColor: 'text-purple-400', weight: 15, glow: '0 0 12px #A855F788' },
  Legendary: { label: 'Legendary', color: '#FACC15', textColor: 'text-yellow-400', weight: 5,  glow: '0 0 20px #FACC15AA' },
};

// ============================================================
// PART POOLS — organized by bloodline × slot × rarity
// ============================================================

// DELVER PARTS — mining, exploration theme
export const DELVER_PARTS: Record<PartSlot, PartDef[]> = {
  head: [
    { id: 'delver_head_c', slot: 'head', name: 'Leather Hood', rarity: 'Common', svgZIndex: 5, svgGroup: '<path d="M 95 25 Q 120 0 145 25 L 150 55 Q 120 60 90 55 Z" fill="#795548" opacity="0.85"/><circle cx="120" cy="35" r="4" fill="#FFC107"/>', upgradeable: true },
    { id: 'delver_head_r', slot: 'head', name: 'Reinforced Helm', rarity: 'Rare', svgZIndex: 5, svgGroup: '<path d="M 90 20 Q 120 -5 150 20 L 155 55 L 85 55 Z" fill="#607D8B"/><rect x="82" y="40" width="76" height="18" rx="3" fill="#455A64"/><circle cx="120" cy="30" r="5" fill="#FFC107"/>', upgradeable: true },
    { id: 'delver_head_e', slot: 'head', name: 'Vein-Seeker Crown', rarity: 'Epic', svgZIndex: 5, svgGroup: '<path d="M 85 15 Q 120 -15 155 15 L 160 60 L 80 60 Z" fill="#37474F"/><path d="M 115 5 L 120 -20 L 125 5 Z" fill="#FFD54F"/><circle cx="120" cy="25" r="7" fill="#FFC107"/><circle cx="120" cy="25" r="12" fill="none" stroke="#FFC107" stroke-width="1.5" opacity="0.6"/>', upgradeable: true },
    { id: 'delver_head_l', slot: 'head', name: 'Heartvein Diadem', rarity: 'Legendary', svgZIndex: 5, svgGroup: '<path d="M 82 10 Q 120 -25 158 10 L 162 62 L 78 62 Z" fill="#212121"/><path d="M 110 -5 L 120 -35 L 130 -5 Z" fill="#FFD54F"/><circle cx="120" cy="18" r="10" fill="#FFC107"><animate attributeName="r" values="10;14;10" dur="2s" repeatCount="indefinite"/></circle><circle cx="100" cy="30" r="3" fill="#00E5FF"/><circle cx="140" cy="30" r="3" fill="#00E5FF"/>', upgradeable: false },
  ],
  body: [
    { id: 'delver_body_c', slot: 'body', name: 'Patchwork Tunic', rarity: 'Common', svgZIndex: 3, svgGroup: '<rect x="80" y="110" width="80" height="90" rx="18" fill="#6B705C"/><path d="M 100 110 L 100 200 M 140 110 L 140 200" stroke="#5D6358" stroke-width="1.5"/>', upgradeable: true },
    { id: 'delver_body_r', slot: 'body', name: 'Reinforced Leather', rarity: 'Rare', svgZIndex: 3, svgGroup: '<rect x="78" y="108" width="84" height="92" rx="18" fill="#5D4037"/><rect x="105" y="140" width="30" height="25" rx="4" fill="#795548"/><rect x="108" y="125" width="24" height="3" rx="1" fill="#8D6E63"/>', upgradeable: true },
    { id: 'delver_body_e', slot: 'body', name: 'Veinstone Breastplate', rarity: 'Epic', svgZIndex: 3, svgGroup: '<rect x="76" y="106" width="88" height="94" rx="18" fill="#37474F"/><path d="M 120 112 L 120 198" stroke="#546E7A" stroke-width="2"/><circle cx="105" cy="150" r="5" fill="#00E5FF" opacity="0.8"/><circle cx="135" cy="150" r="5" fill="#00E5FF" opacity="0.8"/><rect x="100" y="135" width="40" height="4" rx="2" fill="#FFC107" opacity="0.6"/>', upgradeable: true },
    { id: 'delver_body_l', slot: 'body', name: 'Heartvein Chainmail', rarity: 'Legendary', svgZIndex: 3, svgGroup: '<rect x="74" y="104" width="92" height="96" rx="20" fill="#1A1A2E"/><path d="M 120 110 L 120 198 M 90 130 L 150 130 M 88 155 L 152 155 M 90 180 L 150 180" stroke="#00E5FF" stroke-width="0.8" opacity="0.4"/><circle cx="120" cy="145" r="8" fill="#FFC107"><animate attributeName="r" values="8;11;8" dur="1.5s" repeatCount="indefinite"/></circle>', upgradeable: false },
  ],
  weapon: [
    { id: 'delver_wpn_c', slot: 'weapon', name: 'Rusty Pickaxe', rarity: 'Common', svgZIndex: 6, svgGroup: '<g transform="translate(165,100) rotate(25)"><rect x="-4" y="0" width="8" height="90" rx="3" fill="#795548"/><rect x="-14" y="-8" width="8" height="30" rx="2" fill="#9E9E9E"/><rect x="6" y="-8" width="8" height="30" rx="2" fill="#9E9E9E"/></g>', upgradeable: true },
    { id: 'delver_wpn_r', slot: 'weapon', name: 'Steel Pickaxe', rarity: 'Rare', svgZIndex: 6, svgGroup: '<g transform="translate(170,100) rotate(25)"><rect x="-4" y="0" width="8" height="90" rx="3" fill="#455A64"/><rect x="-16" y="-12" width="10" height="35" rx="2" fill="#78909C"/><rect x="6" y="-12" width="10" height="35" rx="2" fill="#78909C"/><circle cx="0" cy="50" r="3" fill="#FFC107"/></g>', upgradeable: true },
    { id: 'delver_wpn_e', slot: 'weapon', name: 'Vein-Charged Drill', rarity: 'Epic', svgZIndex: 6, svgGroup: '<g transform="translate(170,100) rotate(25)"><rect x="-4" y="0" width="8" height="80" rx="3" fill="#37474F"/><rect x="-20" y="-18" width="40" height="25" rx="5" fill="#546E7A"/><circle cx="0" cy="-10" r="6" fill="#00E5FF" opacity="0.6"><animate attributeName="opacity" values="0.6;1;0.6" dur="1s" repeatCount="indefinite"/></circle></g>', upgradeable: true },
    { id: 'delver_wpn_l', slot: 'weapon', name: 'Heartvein Excavator', rarity: 'Legendary', svgZIndex: 6, svgGroup: '<g transform="translate(170,100) rotate(25)"><rect x="-4" y="0" width="8" height="70" rx="3" fill="#1A1A2E"/><rect x="-22" y="-22" width="44" height="28" rx="6" fill="#FFC107"/><circle cx="0" cy="-8" r="8" fill="#00E5FF"><animate attributeName="r" values="8;12;8" dur="0.8s" repeatCount="indefinite"/></circle><path d="M -15 -22 L 15 -22" stroke="#FFF" stroke-width="1.5"/></g>', upgradeable: false },
  ],
  accessory: [
    { id: 'delver_acc_none', slot: 'accessory', name: 'None', rarity: 'Common', svgZIndex: 0, svgGroup: '', upgradeable: true },
    { id: 'delver_acc_r', slot: 'accessory', name: 'Vein Pouch', rarity: 'Rare', svgZIndex: 4, svgGroup: '<g transform="translate(95,145)"><rect x="0" y="0" width="18" height="22" rx="4" fill="#5D4037"/><path d="M 3 0 L 9 -8 L 15 0" fill="#795548"/><circle cx="9" cy="10" r="2" fill="#FFC107"/></g>', upgradeable: true },
    { id: 'delver_acc_e', slot: 'accessory', name: 'Cartographer\'s Belt', rarity: 'Epic', svgZIndex: 4, svgGroup: '<g transform="translate(88,140)"><rect x="0" y="0" width="64" height="8" rx="2" fill="#455A64"/><rect x="25" y="-10" width="14" height="14" rx="2" fill="#37474F"/><path d="M 32 -3 L 32 2" stroke="#FFC107" stroke-width="1"/></g>', upgradeable: true },
    { id: 'delver_acc_l', slot: 'accessory', name: 'Vein Compass', rarity: 'Legendary', svgZIndex: 4, svgGroup: '<g transform="translate(135,140)"><circle cx="14" cy="14" r="16" fill="#1A1A2E"/><circle cx="14" cy="14" r="12" fill="none" stroke="#FFC107" stroke-width="1.5"/><path d="M 14 4 L 18 20 L 14 16 L 10 20 Z" fill="#00E5FF"><animateTransform attributeName="transform" type="rotate" from="0 14 14" to="360 14 14" dur="3s" repeatCount="indefinite"/></path></g>', upgradeable: false },
  ],
  aura: [
    { id: 'delver_aura_none', slot: 'aura', name: 'None', rarity: 'Common', svgZIndex: 0, svgGroup: '', upgradeable: true },
    { id: 'delver_aura_r', slot: 'aura', name: 'Dust Cloud', rarity: 'Rare', svgZIndex: 2, svgGroup: '<ellipse cx="120" cy="215" rx="55" ry="10" fill="#795548" opacity="0.3"><animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite"/></ellipse>', upgradeable: true },
    { id: 'delver_aura_e', slot: 'aura', name: 'Vein Sparkles', rarity: 'Epic', svgZIndex: 7, svgGroup: '<circle cx="70" cy="180" r="2" fill="#FFC107"><animate attributeName="cy" values="180;160;180" dur="3s" repeatCount="indefinite"/></circle><circle cx="170" cy="170" r="2" fill="#00E5FF"><animate attributeName="cy" values="170;145;170" dur="2.5s" repeatCount="indefinite"/></circle><circle cx="100" cy="200" r="1.5" fill="#FFD54F"><animate attributeName="cy" values="200;185;200" dur="4s" repeatCount="indefinite"/></circle>', upgradeable: true },
    { id: 'delver_aura_l', slot: 'aura', name: 'Heartvein Radiance', rarity: 'Legendary', svgZIndex: 7, svgGroup: '<circle cx="120" cy="145" r="70" fill="none" stroke="#FFC107" stroke-width="0.5" opacity="0.3"><animate attributeName="r" values="70;80;70" dur="2s" repeatCount="indefinite"/></circle><circle cx="120" cy="145" r="90" fill="none" stroke="#00E5FF" stroke-width="0.3" opacity="0.2"><animate attributeName="r" values="90;100;90" dur="3s" repeatCount="indefinite"/></circle><circle cx="80" cy="170" r="2" fill="#FFF"><animate attributeName="cy" values="170;140;170" dur="1.5s" repeatCount="indefinite"/></circle><circle cx="160" cy="190" r="2" fill="#FFF"><animate attributeName="cy" values="190;155;190" dur="2s" repeatCount="indefinite"/></circle><circle cx="140" cy="180" r="1.5" fill="#FFD54F"><animate attributeName="cy" values="180;150;180" dur="1.8s" repeatCount="indefinite"/></circle>', upgradeable: false },
  ],
};

// IRONBLOOD PARTS — battle, berserker theme
export const IRONBLOOD_PARTS: Record<PartSlot, PartDef[]> = {
  head: [
    { id: 'iron_head_c', slot: 'head', name: 'Cloth Headband', rarity: 'Common', svgZIndex: 5, svgGroup: '<path d="M 65 45 Q 120 20 175 45 L 178 60 Q 120 70 62 60 Z" fill="#B71C1C"/><path d="M 50 50 Q 120 35 190 50" fill="none" stroke="#D32F2F" stroke-width="3"/>', upgradeable: true },
    { id: 'iron_head_r', slot: 'head', name: 'Iron Helm', rarity: 'Rare', svgZIndex: 5, svgGroup: '<path d="M 65 35 Q 120 5 175 35 L 180 65 L 60 65 Z" fill="#616161"/><rect x="58" y="50" width="124" height="18" fill="#424242"/><circle cx="120" cy="40" r="4" fill="#D32F2F"/>', upgradeable: true },
    { id: 'iron_head_e', slot: 'head', name: 'Bloodforged Helm', rarity: 'Epic', svgZIndex: 5, svgGroup: '<path d="M 60 30 Q 120 -10 180 30 L 185 68 L 55 68 Z" fill="#424242"/><path d="M 115 0 L 120 -25 L 125 0 Z" fill="#D32F2F"/><rect x="53" y="55" width="134" height="16" fill="#212121"/><circle cx="120" cy="35" r="5" fill="#FF1744"/>', upgradeable: true },
    { id: 'iron_head_l', slot: 'head', name: 'Crown of Fury', rarity: 'Legendary', svgZIndex: 5, svgGroup: '<path d="M 58 25 Q 120 -20 182 25 L 188 70 L 52 70 Z" fill="#1A1A2E"/><path d="M 110 -15 L 120 -50 L 130 -15 Z" fill="#FF1744"><animate attributeName="opacity" values="1;0.7;1" dur="0.5s" repeatCount="indefinite"/></path><path d="M 100 -5 L 140 -5" stroke="#FFF" stroke-width="1"/><circle cx="80" cy="40" r="3" fill="#FFC107"/><circle cx="160" cy="40" r="3" fill="#FFC107"/>', upgradeable: false },
  ],
  body: [
    { id: 'iron_body_c', slot: 'body', name: 'Leather Harness', rarity: 'Common', svgZIndex: 3, svgGroup: '<rect x="80" y="110" width="80" height="90" rx="18" fill="#B71C1C"/><path d="M 98 110 L 98 200 M 142 110 L 142 200" stroke="#8B0000" stroke-width="1"/>', upgradeable: true },
    { id: 'iron_body_r', slot: 'body', name: 'Iron Plate', rarity: 'Rare', svgZIndex: 3, svgGroup: '<rect x="78" y="108" width="84" height="92" rx="18" fill="#424242"/><path d="M 120 115 L 120 198" stroke="#616161" stroke-width="2"/><rect x="88" y="130" width="64" height="20" rx="3" fill="#212121"/>', upgradeable: true },
    { id: 'iron_body_e', slot: 'body', name: 'Bloodforged Armor', rarity: 'Epic', svgZIndex: 3, svgGroup: '<rect x="76" y="106" width="88" height="94" rx="18" fill="#212121"/><path d="M 120 112 L 120 198" stroke="#D32F2F" stroke-width="1.5"/><rect x="92" y="125" width="56" height="8" rx="2" fill="#D32F2F" opacity="0.8"/><circle cx="105" cy="160" r="4" fill="#FF1744"/><circle cx="135" cy="160" r="4" fill="#FF1744"/>', upgradeable: true },
    { id: 'iron_body_l', slot: 'body', name: 'Berserker\'s Plate', rarity: 'Legendary', svgZIndex: 3, svgGroup: '<rect x="74" y="104" width="92" height="96" rx="20" fill="#1A1A2E"/><path d="M 120 110 L 120 198 M 85 145 L 155 145" stroke="#FF1744" stroke-width="1" opacity="0.5"/><circle cx="120" cy="155" r="10" fill="#D32F2F"><animate attributeName="r" values="10;13;10" dur="1s" repeatCount="indefinite"/></circle><circle cx="95" cy="135" r="2" fill="#FFF" opacity="0.6"/><circle cx="145" cy="135" r="2" fill="#FFF" opacity="0.6"/>', upgradeable: false },
  ],
  weapon: [
    { id: 'iron_wpn_c', slot: 'weapon', name: 'Rusty Blade', rarity: 'Common', svgZIndex: 6, svgGroup: '<g transform="translate(168,115) rotate(35)"><rect x="-5" y="0" width="10" height="70" fill="#795548"/><rect x="-8" y="-15" width="16" height="30" rx="2" fill="#9E9E9E"/></g>', upgradeable: true },
    { id: 'iron_wpn_r', slot: 'weapon', name: 'Tempered Steel', rarity: 'Rare', svgZIndex: 6, svgGroup: '<g transform="translate(170,115) rotate(35)"><rect x="-4" y="0" width="8" height="75" fill="#616161"/><rect x="-10" y="-18" width="20" height="30" rx="3" fill="#B0BEC5"/><circle cx="0" cy="45" r="2" fill="#D32F2F"/></g>', upgradeable: true },
    { id: 'iron_wpn_e', slot: 'weapon', name: 'Bloodletter', rarity: 'Epic', svgZIndex: 6, svgGroup: '<g transform="translate(172,115) rotate(35)"><rect x="-4" y="0" width="8" height="70" fill="#212121"/><rect x="-12" y="-22" width="24" height="35" rx="4" fill="#D32F2F"/><path d="M 0 -22 L 0 -35" stroke="#FF1744" stroke-width="1.5"/><circle cx="0" cy="40" r="3" fill="#FF1744"><animate attributeName="opacity" values="1;0.4;1" dur="0.6s" repeatCount="indefinite"/></circle></g>', upgradeable: true },
    { id: 'iron_wpn_l', slot: 'weapon', name: 'Veinfury Greatsword', rarity: 'Legendary', svgZIndex: 6, svgGroup: '<g transform="translate(172,115) rotate(35)"><rect x="-4" y="0" width="8" height="60" fill="#1A1A2E"/><rect x="-14" y="-26" width="28" height="40" rx="5" fill="#FF1744"/><path d="M 0 -26 L 0 -45" stroke="#FFC107" stroke-width="2"/><circle cx="0" cy="30" r="5" fill="#FFC107"><animate attributeName="r" values="5;8;5" dur="0.8s" repeatCount="indefinite"/></circle></g>', upgradeable: false },
  ],
  accessory: [
    { id: 'iron_acc_none', slot: 'accessory', name: 'None', rarity: 'Common', svgZIndex: 0, svgGroup: '', upgradeable: true },
    { id: 'iron_acc_r', slot: 'accessory', name: 'Battle Scars', rarity: 'Rare', svgZIndex: 6, svgGroup: '<path d="M 95 155 L 105 160" stroke="#FFF" stroke-width="0.8" opacity="0.5"/><path d="M 130 150 L 140 148" stroke="#FFF" stroke-width="0.8" opacity="0.5"/><path d="M 110 170 L 118 172" stroke="#FFF" stroke-width="0.8" opacity="0.4"/>', upgradeable: true },
    { id: 'iron_acc_e', slot: 'accessory', name: 'War Trophy Belt', rarity: 'Epic', svgZIndex: 4, svgGroup: '<g transform="translate(86,145)"><rect x="0" y="0" width="68" height="6" rx="2" fill="#424242"/><circle cx="15" cy="-6" r="5" fill="#9E9E9E"/><circle cx="35" cy="-6" r="5" fill="#9E9E9E"/><circle cx="55" cy="-6" r="5" fill="#9E9E9E"/></g>', upgradeable: true },
    { id: 'iron_acc_l', slot: 'accessory', name: 'Bloodfury Mantle', rarity: 'Legendary', svgZIndex: 4, svgGroup: '<g><path d="M 75 120 Q 50 160 60 200" fill="#D32F2F" opacity="0.7"><animate attributeName="opacity" values="0.7;0.4;0.7" dur="1.5s" repeatCount="indefinite"/></path><path d="M 165 120 Q 190 160 180 200" fill="#D32F2F" opacity="0.7"><animate attributeName="opacity" values="0.7;0.4;0.7" dur="1.5s" repeatCount="indefinite"/></path></g>', upgradeable: false },
  ],
  aura: [
    { id: 'iron_aura_none', slot: 'aura', name: 'None', rarity: 'Common', svgZIndex: 0, svgGroup: '', upgradeable: true },
    { id: 'iron_aura_r', slot: 'aura', name: 'Battle Haze', rarity: 'Rare', svgZIndex: 2, svgGroup: '<ellipse cx="120" cy="200" rx="50" ry="15" fill="#D32F2F" opacity="0.2"><animate attributeName="opacity" values="0.2;0.05;0.2" dur="1.2s" repeatCount="indefinite"/></ellipse>', upgradeable: true },
    { id: 'iron_aura_e', slot: 'aura', name: 'Blood Rage', rarity: 'Epic', svgZIndex: 7, svgGroup: '<circle cx="120" cy="150" r="65" fill="none" stroke="#FF1744" stroke-width="0.5" opacity="0.3"><animate attributeName="r" values="65;75;65" dur="1s" repeatCount="indefinite"/></circle><path d="M 80 180 L 75 185 M 160 175 L 165 180 M 100 195 L 95 200" stroke="#FF1744" opacity="0.4"/>', upgradeable: true },
    { id: 'iron_aura_l', slot: 'aura', name: 'Berserker\'s Fury', rarity: 'Legendary', svgZIndex: 7, svgGroup: '<circle cx="120" cy="150" r="70" fill="none" stroke="#FF1744" stroke-width="0.8" opacity="0.4"><animate attributeName="r" values="70;85;70" dur="0.8s" repeatCount="indefinite"/></circle><circle cx="120" cy="150" r="90" fill="none" stroke="#FFC107" stroke-width="0.4" opacity="0.2"><animate attributeName="r" values="90;100;90" dur="1.5s" repeatCount="indefinite"/></circle>', upgradeable: false },
  ],
};

// ============================================================
// FORGEBORN PARTS — Fire, hammer, forge elements
// ============================================================

const FORGEBORN_PARTS: BloodlinePartSet = {
  bloodline: 'Forgeborn',
  slots: {
    head: [
      { id: 'forge_head_c', slot: 'head', name: 'Apprentice Goggles', rarity: 'Common', svgZIndex: 4, svgGroup: '<rect x="90" y="55" width="60" height="20" rx="5" fill="#5D4037"/><rect x="95" y="58" width="20" height="12" rx="3" fill="#FFF8E1" opacity="0.6"/>', upgradeable: true },
      { id: 'forge_head_r', slot: 'head', name: 'Smith\'s Mask', rarity: 'Rare', svgZIndex: 4, svgGroup: '<path d="M 85 55 Q 120 45 155 55 L 160 80 Q 120 90 80 80 Z" fill="#3E2723"/><path d="M 100 60 L 140 60" stroke="#FF8F00" stroke-width="1.5"/><rect x="95" y="58" width="15" height="10" rx="3" fill="#FF9800" opacity="0.7"/>', upgradeable: true },
      { id: 'forge_head_e', slot: 'head', name: 'Obsidian Visor', rarity: 'Epic', svgZIndex: 4, svgGroup: '<path d="M 80 50 Q 120 35 160 50 L 158 80 Q 120 88 82 80 Z" fill="#212121"/><rect x="95" y="55" width="50" height="15" rx="3" fill="#FF5722" opacity="0.8"><animate attributeName="opacity" values="0.8;0.4;0.8" dur="2s" repeatCount="indefinite"/></rect>', upgradeable: true },
      { id: 'forge_head_l', slot: 'head', name: 'Heartvein Crown', rarity: 'Legendary', svgZIndex: 5, svgGroup: '<path d="M 75 45 Q 120 20 165 45 L 170 75 Q 120 88 70 75 Z" fill="#212121"/><path d="M 85 38 Q 120 25 155 38" fill="none" stroke="#FF9800" stroke-width="2"/><circle cx="120" cy="32" r="6" fill="#FFC107" filter="url(#glow)"><animate attributeName="r" values="6;8;6" dur="1.5s" repeatCount="indefinite"/></circle>', upgradeable: false },
    ],
    body: [
      { id: 'forge_body_c', slot: 'body', name: 'Work Apron', rarity: 'Common', svgZIndex: 1, svgGroup: '<rect x="80" y="110" width="80" height="90" rx="20" fill="#6D4C41"/><rect x="100" y="130" width="40" height="20" rx="3" fill="#8D6E63"/>', upgradeable: true },
      { id: 'forge_body_r', slot: 'body', name: 'Chain Vest', rarity: 'Rare', svgZIndex: 1, svgGroup: '<rect x="78" y="108" width="84" height="92" rx="18" fill="#4E342E"/><path d="M 82 120 L 158 120 M 82 135 L 158 135 M 82 150 L 158 150" stroke="#795548" stroke-width="0.8"/><rect x="100" y="130" width="40" height="15" rx="3" fill="#FF8F00" opacity="0.5"/>', upgradeable: true },
      { id: 'forge_body_e', slot: 'body', name: 'Molten Plate', rarity: 'Epic', svgZIndex: 1, svgGroup: '<rect x="75" y="105" width="90" height="95" rx="18" fill="#3E2723"/><path d="M 80 115 L 160 115 M 80 130 L 160 130 M 80 155 L 160 155" stroke="#FF5722" stroke-width="1" opacity="0.6"><animate attributeName="opacity" values="0.6;0.2;0.6" dur="3s" repeatCount="indefinite"/></path><rect x="100" y="130" width="40" height="15" rx="3" fill="#FF9800"/>', upgradeable: true },
      { id: 'forge_body_l', slot: 'body', name: 'Veinfire Carapace', rarity: 'Legendary', svgZIndex: 1, svgGroup: '<rect x="72" y="102" width="96" height="98" rx="20" fill="#1A1A1A"/><path d="M 78 115 L 162 115 M 78 135 L 162 135 M 78 165 L 162 165" stroke="#FFC107" stroke-width="1.5" opacity="0.8"><animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite"/></path><circle cx="120" cy="145" r="10" fill="#FF9800" opacity="0.6"><animate attributeName="r" values="10;14;10" dur="2s" repeatCount="indefinite"/></circle>', upgradeable: false },
    ],
    weapon: [
      { id: 'forge_wpn_c', slot: 'weapon', name: 'Rusty Hammer', rarity: 'Common', svgZIndex: 6, svgGroup: '<rect x="165" y="85" width="8" height="90" rx="4" fill="#5D4037"/><rect x="155" y="80" width="28" height="18" rx="4" fill="#78909C"/>', upgradeable: true },
      { id: 'forge_wpn_r', slot: 'weapon', name: 'Steel Mallet', rarity: 'Rare', svgZIndex: 6, svgGroup: '<rect x="165" y="85" width="10" height="95" rx="4" fill="#37474F"/><rect x="153" y="78" width="34" height="20" rx="5" fill="#90A4AE"/><circle cx="170" cy="88" r="3" fill="#FF9800"/>', upgradeable: true },
      { id: 'forge_wpn_e', slot: 'weapon', name: 'Flame Maul', rarity: 'Epic', svgZIndex: 6, svgGroup: '<rect x="165" y="80" width="12" height="100" rx="4" fill="#212121"/><rect x="150" y="72" width="42" height="24" rx="6" fill="#FF5722"/><path d="M 158 75 L 184 75" stroke="#FFC107" stroke-width="1"/><circle cx="171" cy="95" r="4" fill="#FF9800" filter="url(#glow)"><animate attributeName="r" values="4;7;4" dur="1s" repeatCount="indefinite"/></circle>', upgradeable: true },
      { id: 'forge_wpn_l', slot: 'weapon', name: 'Sunderforge', rarity: 'Legendary', svgZIndex: 6, svgGroup: '<rect x="163" y="75" width="14" height="110" rx="5" fill="#1A1A1A"/><rect x="145" y="65" width="50" height="28" rx="7" fill="#FF9800"/><path d="M 152 72 L 188 72 M 152 82 L 188 82" stroke="#FFC107" stroke-width="1"/><circle cx="170" cy="100" r="5" fill="#FF1744" filter="url(#glow)"><animate attributeName="r" values="5;9;5" dur="0.7s" repeatCount="indefinite"/></circle><path d="M 150 65 L 160 45 L 170 65" fill="#FFC107" opacity="0.6"/>', upgradeable: false },
    ],
    aura: [
      { id: 'forge_aura_c', slot: 'aura', name: 'Sparks', rarity: 'Common', svgZIndex: 2, svgGroup: '<circle cx="100" cy="180" r="2" fill="#FF8F00" opacity="0.5"><animate attributeName="cy" values="180;160;180" dur="2s" repeatCount="indefinite"/></circle><circle cx="140" cy="170" r="1.5" fill="#FF9800" opacity="0.4"><animate attributeName="cy" values="170;155;170" dur="2.5s" repeatCount="indefinite"/></circle>', upgradeable: true },
      { id: 'forge_aura_r', slot: 'aura', name: 'Ember Halo', rarity: 'Rare', svgZIndex: 7, svgGroup: '<ellipse cx="120" cy="200" rx="45" ry="10" fill="#FF5722" opacity="0.15"><animate attributeName="opacity" values="0.15;0.05;0.15" dur="1.5s" repeatCount="indefinite"/></ellipse><circle cx="90" cy="185" r="3" fill="#FF9800" opacity="0.6"><animate attributeName="opacity" values="0.6;0;0.6" dur="1.8s" repeatCount="indefinite"/></circle>', upgradeable: true },
      { id: 'forge_aura_e', slot: 'aura', name: 'Vein-fire Mantle', rarity: 'Epic', svgZIndex: 7, svgGroup: '<ellipse cx="120" cy="200" rx="55" ry="12" fill="#FF5722" opacity="0.2"><animate attributeName="opacity" values="0.2;0.05;0.2" dur="1s" repeatCount="indefinite"/></ellipse><path d="M 80 190 Q 90 170 100 190 Q 110 170 120 190 Q 130 170 140 190 Q 150 170 160 190" fill="none" stroke="#FF9800" stroke-width="0.8" opacity="0.4"><animate attributeName="opacity" values="0.4;0.1;0.4" dur="2s" repeatCount="indefinite"/></path>', upgradeable: true },
      { id: 'forge_aura_l', slot: 'aura', name: 'Inferno Core', rarity: 'Legendary', svgZIndex: 7, svgGroup: '<circle cx="120" cy="150" r="60" fill="none" stroke="#FF9800" stroke-width="0.6" opacity="0.3"><animate attributeName="r" values="60;70;60" dur="1s" repeatCount="indefinite"/></circle><circle cx="120" cy="150" r="75" fill="none" stroke="#FF1744" stroke-width="0.4" opacity="0.15"><animate attributeName="r" values="75;88;75" dur="1.8s" repeatCount="indefinite"/></circle><path d="M 80 185 L 75 190 M 160 180 L 165 185 M 120 195 L 120 200" stroke="#FFC107" opacity="0.5"/>', upgradeable: false },
    ],
  },
};

// ============================================================
// SHADOWVEIN PARTS — Stealth, darkness, blades
// ============================================================

const SHADOWVEIN_PARTS: BloodlinePartSet = {
  bloodline: 'Shadowvein',
  slots: {
    head: [
      { id: 'shad_head_c', slot: 'head', name: 'Cloth Wrap', rarity: 'Common', svgZIndex: 4, svgGroup: '<path d="M 80 65 Q 120 55 160 65 L 158 95 Q 120 100 82 95 Z" fill="#212121"/>', upgradeable: true },
      { id: 'shad_head_r', slot: 'head', name: 'Shadow Hood', rarity: 'Rare', svgZIndex: 4, svgGroup: '<path d="M 75 55 Q 120 40 165 55 L 170 100 Q 120 108 70 100 Z" fill="#1A1A2E"/><path d="M 80 60 Q 120 50 160 60" stroke="#7C4DFF" stroke-width="1" opacity="0.6"/>', upgradeable: true },
      { id: 'shad_head_e', slot: 'head', name: 'Veil of Dusk', rarity: 'Epic', svgZIndex: 4, svgGroup: '<path d="M 70 50 Q 120 30 170 50 L 175 105 Q 120 115 65 105 Z" fill="#12122A"/><circle cx="100" cy="75" r="8" fill="#7C4DFF" opacity="0.4" filter="url(#glow)"><animate attributeName="opacity" values="0.4;0.1;0.4" dur="3s" repeatCount="indefinite"/></circle><circle cx="140" cy="75" r="8" fill="#7C4DFF" opacity="0.4" filter="url(#glow)"><animate attributeName="opacity" values="0.4;0.1;0.4" dur="3s" repeatCount="indefinite"/></circle>', upgradeable: true },
      { id: 'shad_head_l', slot: 'head', name: 'Crown of Night', rarity: 'Legendary', svgZIndex: 5, svgGroup: '<path d="M 65 45 Q 120 20 175 45 L 180 105 Q 120 118 60 105 Z" fill="#0A0A1E"/><path d="M 75 38 Q 120 25 165 38" stroke="#9C27B0" stroke-width="2"/><circle cx="120" cy="85" r="12" fill="#7C4DFF" opacity="0.3" filter="url(#glow)"><animate attributeName="r" values="12;16;12" dur="2s" repeatCount="indefinite"/></circle><path d="M 80 50 Q 120 35 160 50" fill="none" stroke="#E040FB" stroke-width="0.8" opacity="0.6"/>', upgradeable: false },
    ],
    body: [
      { id: 'shad_body_c', slot: 'body', name: 'Dark Tunic', rarity: 'Common', svgZIndex: 1, svgGroup: '<rect x="80" y="110" width="80" height="90" rx="20" fill="#1A1A2E"/><path d="M 95 125 L 145 125" stroke="#2A2A4A" stroke-width="1"/>', upgradeable: true },
      { id: 'shad_body_r', slot: 'body', name: 'Shadow Leather', rarity: 'Rare', svgZIndex: 1, svgGroup: '<rect x="78" y="108" width="84" height="92" rx="18" fill="#15152A"/><path d="M 82 125 L 158 125 M 100 125 L 100 178" stroke="#7C4DFF" stroke-width="0.5" opacity="0.4"/>', upgradeable: true },
      { id: 'shad_body_e', slot: 'body', name: 'Void Weave', rarity: 'Epic', svgZIndex: 1, svgGroup: '<rect x="75" y="105" width="90" height="95" rx="18" fill="#0D0D22"/><path d="M 80 122 L 160 122 M 80 145 L 160 145" stroke="#7C4DFF" stroke-width="0.8" opacity="0.5"><animate attributeName="opacity" values="0.5;0.1;0.5" dur="4s" repeatCount="indefinite"/></path>', upgradeable: true },
      { id: 'shad_body_l', slot: 'body', name: 'Nightwhisper Mantle', rarity: 'Legendary', svgZIndex: 1, svgGroup: '<rect x="72" y="102" width="96" height="98" rx="20" fill="#07071A"/><path d="M 78 120 L 162 120 M 78 150 L 162 150" stroke="#E040FB" stroke-width="1" opacity="0.6"><animate attributeName="opacity" values="0.6;0.2;0.6" dur="2.5s" repeatCount="indefinite"/></path><circle cx="120" cy="145" r="8" fill="#7C4DFF" opacity="0.3"><animate attributeName="r" values="8;12;8" dur="3s" repeatCount="indefinite"/></circle>', upgradeable: false },
    ],
    weapon: [
      { id: 'shad_wpn_c', slot: 'weapon', name: 'Rusty Dagger', rarity: 'Common', svgZIndex: 6, svgGroup: '<rect x="170" y="130" width="6" height="35" rx="2" fill="#424242" transform="rotate(-45 170 130)"/><circle cx="174" cy="115" r="4" fill="#616161"/>', upgradeable: true },
      { id: 'shad_wpn_r', slot: 'weapon', name: 'Shadow Fang', rarity: 'Rare', svgZIndex: 6, svgGroup: '<path d="M 168 140 L 195 113 L 183 108 Z" fill="#311B92"/><circle cx="180" cy="112" r="5" fill="#7C4DFF"/>', upgradeable: true },
      { id: 'shad_wpn_e', slot: 'weapon', name: 'Voidforged Blade', rarity: 'Epic', svgZIndex: 6, svgGroup: '<path d="M 165 145 L 200 110 L 186 103 Z" fill="#1A1A2E"/><path d="M 170 140 L 193 113" stroke="#7C4DFF" stroke-width="1"/><circle cx="188" cy="108" r="6" fill="#E040FB" filter="url(#glow)"><animate attributeName="r" values="6;9;6" dur="1.5s" repeatCount="indefinite"/></circle>', upgradeable: true },
      { id: 'shad_wpn_l', slot: 'weapon', name: 'Duskreaper', rarity: 'Legendary', svgZIndex: 6, svgGroup: '<path d="M 160 150 L 205 105 L 188 95 Z" fill="#0A0A1E"/><path d="M 168 142 L 198 108" stroke="#E040FB" stroke-width="1.5"/><circle cx="192" cy="102" r="7" fill="#7C4DFF" filter="url(#glow)"><animate attributeName="r" values="7;11;7" dur="0.8s" repeatCount="indefinite"/></circle><path d="M 155 155 Q 170 170 165 180" fill="none" stroke="#9C27B0" stroke-width="0.8" opacity="0.4"/>', upgradeable: false },
    ],
    aura: [
      { id: 'shad_aura_c', slot: 'aura', name: 'Wisp', rarity: 'Common', svgZIndex: 2, svgGroup: '<circle cx="110" cy="200" r="3" fill="#7C4DFF" opacity="0.3"><animate attributeName="opacity" values="0.3;0;0.3" dur="3s" repeatCount="indefinite"/></circle>', upgradeable: true },
      { id: 'shad_aura_r', slot: 'aura', name: 'Shadow Trail', rarity: 'Rare', svgZIndex: 2, svgGroup: '<ellipse cx="120" cy="200" rx="35" ry="8" fill="#311B92" opacity="0.15"><animate attributeName="opacity" values="0.15;0.03;0.15" dur="2s" repeatCount="indefinite"/></ellipse>', upgradeable: true },
      { id: 'shad_aura_e', slot: 'aura', name: 'Void Tendrils', rarity: 'Epic', svgZIndex: 7, svgGroup: '<path d="M 85 190 Q 90 175 100 180 M 155 188 Q 150 170 140 178" stroke="#7C4DFF" stroke-width="0.8" opacity="0.4"><animate attributeName="opacity" values="0.4;0.1;0.4" dur="2.5s" repeatCount="indefinite"/></path>', upgradeable: true },
      { id: 'shad_aura_l', slot: 'aura', name: 'Abyssal Shroud', rarity: 'Legendary', svgZIndex: 7, svgGroup: '<circle cx="120" cy="150" r="55" fill="none" stroke="#7C4DFF" stroke-width="0.7" opacity="0.3"><animate attributeName="r" values="55;65;55" dur="1.5s" repeatCount="indefinite"/></circle><circle cx="120" cy="150" r="70" fill="none" stroke="#E040FB" stroke-width="0.5" opacity="0.2"><animate attributeName="r" values="70;85;70" dur="2.5s" repeatCount="indefinite"/></circle>', upgradeable: false },
    ],
  },
};

// ============================================================
// STONEWARDEN PARTS — Shield, stone, defense
// ============================================================

const STONEWARDEN_PARTS: BloodlinePartSet = {
  bloodline: 'Stonewarden',
  slots: {
    head: [
      { id: 'stone_head_c', slot: 'head', name: 'Leather Cap', rarity: 'Common', svgZIndex: 4, svgGroup: '<path d="M 82 60 Q 120 50 158 60 L 155 85 Q 120 90 85 85 Z" fill="#5D4037"/>', upgradeable: true },
      { id: 'stone_head_r', slot: 'head', name: 'Iron Helm', rarity: 'Rare', svgZIndex: 4, svgGroup: '<path d="M 78 55 Q 120 42 162 55 L 160 90 Q 120 96 80 90 Z" fill="#546E7A"/><rect x="95" y="48" width="50" height="8" rx="2" fill="#90A4AE"/>', upgradeable: true },
      { id: 'stone_head_e', slot: 'head', name: 'Granite Crown', rarity: 'Epic', svgZIndex: 4, svgGroup: '<path d="M 75 50 Q 120 35 165 50 L 168 92 Q 120 100 72 92 Z" fill="#37474F"/><path d="M 85 45 Q 120 35 155 45" stroke="#00BCD4" stroke-width="1.5"/><rect x="95" y="42" width="50" height="6" rx="2" fill="#00BCD4" opacity="0.5"/>', upgradeable: true },
      { id: 'stone_head_l', slot: 'head', name: 'Bastion Helm', rarity: 'Legendary', svgZIndex: 5, svgGroup: '<path d="M 70 45 Q 120 25 170 45 L 175 95 Q 120 105 65 95 Z" fill="#263238"/><path d="M 80 38 Q 120 28 160 38" stroke="#00E5FF" stroke-width="2.5"/><circle cx="120" cy="30" r="5" fill="#00E5FF" filter="url(#glow)"><animate attributeName="r" values="5;8;5" dur="2s" repeatCount="indefinite"/></circle><rect x="90" y="40" width="60" height="4" rx="2" fill="#00BCD4"/>', upgradeable: false },
    ],
    body: [
      { id: 'stone_body_c', slot: 'body', name: 'Leather Jerkin', rarity: 'Common', svgZIndex: 1, svgGroup: '<rect x="75" y="108" width="90" height="92" rx="18" fill="#5D4037"/>', upgradeable: true },
      { id: 'stone_body_r', slot: 'body', name: 'Scale Mail', rarity: 'Rare', svgZIndex: 1, svgGroup: '<rect x="73" y="105" width="94" height="95" rx="18" fill="#455A64"/><path d="M 78 120 L 162 120 M 78 135 L 162 135 M 78 150 L 162 150" stroke="#78909C" stroke-width="1"/>', upgradeable: true },
      { id: 'stone_body_e', slot: 'body', name: 'Vulkanite Plate', rarity: 'Epic', svgZIndex: 1, svgGroup: '<rect x="70" y="102" width="100" height="98" rx="20" fill="#37474F"/><path d="M 75 118 L 165 118 M 75 142 L 165 142 M 75 170 L 165 170" stroke="#00BCD4" stroke-width="0.8" opacity="0.5"><animate attributeName="opacity" values="0.5;0.2;0.5" dur="3s" repeatCount="indefinite"/></path>', upgradeable: true },
      { id: 'stone_body_l', slot: 'body', name: 'Aegis Prime', rarity: 'Legendary', svgZIndex: 1, svgGroup: '<rect x="68" y="100" width="104" height="100" rx="22" fill="#1C2833"/><path d="M 75 118 L 165 118 M 75 150 L 165 150 M 75 178 L 165 178" stroke="#00E5FF" stroke-width="1" opacity="0.7"><animate attributeName="opacity" values="0.7;0.3;0.7" dur="2s" repeatCount="indefinite"/></path><circle cx="120" cy="145" r="8" fill="#00BCD4" opacity="0.4"><animate attributeName="r" values="8;12;8" dur="3s" repeatCount="indefinite"/></circle>', upgradeable: false },
    ],
    weapon: [
      { id: 'stone_wpn_c', slot: 'weapon', name: 'Wooden Shield', rarity: 'Common', svgZIndex: 6, svgGroup: '<ellipse cx="160" cy="150" rx="25" ry="30" fill="#5D4037"/><ellipse cx="160" cy="150" rx="15" ry="18" fill="#795548"/>', upgradeable: true },
      { id: 'stone_wpn_r', slot: 'weapon', name: 'Iron Bulwark', rarity: 'Rare', svgZIndex: 6, svgGroup: '<ellipse cx="160" cy="150" rx="28" ry="33" fill="#546E7A"/><ellipse cx="160" cy="150" rx="18" ry="20" fill="#78909C"/><circle cx="160" cy="150" r="8" fill="#00BCD4" opacity="0.4"/>', upgradeable: true },
      { id: 'stone_wpn_e', slot: 'weapon', name: 'Crystal Aegis', rarity: 'Epic', svgZIndex: 6, svgGroup: '<ellipse cx="160" cy="148" rx="30" ry="36" fill="#37474F"/><ellipse cx="160" cy="148" rx="20" ry="24" fill="#00BCD4" opacity="0.4"/><circle cx="160" cy="148" r="10" fill="#00E5FF" opacity="0.3" filter="url(#glow)"><animate attributeName="r" values="10;14;10" dur="2s" repeatCount="indefinite"/></circle>', upgradeable: true },
      { id: 'stone_wpn_l', slot: 'weapon', name: "Bastion's Wall", rarity: 'Legendary', svgZIndex: 6, svgGroup: '<ellipse cx="160" cy="148" rx="34" ry="40" fill="#1C2833"/><ellipse cx="160" cy="148" rx="24" ry="28" fill="#00BCD4" opacity="0.3"/><circle cx="160" cy="148" r="12" fill="#00E5FF" opacity="0.4" filter="url(#glow)"><animate attributeName="r" values="12;17;12" dur="1.5s" repeatCount="indefinite"/></circle><path d="M 145 148 L 175 148 M 160 133 L 160 163" stroke="#00E5FF" stroke-width="0.8" opacity="0.5"/>', upgradeable: false },
    ],
    aura: [
      { id: 'stone_aura_c', slot: 'aura', name: 'Dust', rarity: 'Common', svgZIndex: 2, svgGroup: '<circle cx="100" cy="200" r="2" fill="#90A4AE" opacity="0.3"><animate attributeName="opacity" values="0.3;0;0.3" dur="3s" repeatCount="indefinite"/></circle>', upgradeable: true },
      { id: 'stone_aura_r', slot: 'aura', name: 'Stone Skin', rarity: 'Rare', svgZIndex: 2, svgGroup: '<ellipse cx="120" cy="200" rx="40" ry="8" fill="#78909C" opacity="0.12"><animate attributeName="opacity" values="0.12;0.03;0.12" dur="2s" repeatCount="indefinite"/></ellipse>', upgradeable: true },
      { id: 'stone_aura_e', slot: 'aura', name: "Guardian's Resolve", rarity: 'Epic', svgZIndex: 7, svgGroup: '<ellipse cx="120" cy="200" rx="50" ry="10" fill="#00BCD4" opacity="0.15"><animate attributeName="opacity" values="0.15;0.04;0.15" dur="1.5s" repeatCount="indefinite"/></ellipse><path d="M 80 195 L 75 198 M 160 195 L 165 198" stroke="#00E5FF" stroke-width="0.8" opacity="0.4"/>', upgradeable: true },
      { id: 'stone_aura_l', slot: 'aura', name: 'Indomitable', rarity: 'Legendary', svgZIndex: 7, svgGroup: '<circle cx="120" cy="150" r="65" fill="none" stroke="#00BCD4" stroke-width="0.6" opacity="0.25"><animate attributeName="r" values="65;75;65" dur="1.5s" repeatCount="indefinite"/></circle><circle cx="120" cy="150" r="85" fill="none" stroke="#00E5FF" stroke-width="0.4" opacity="0.15"><animate attributeName="r" values="85;100;85" dur="3s" repeatCount="indefinite"/></circle>', upgradeable: false },
    ],
  },
};

// ============================================================
// VEINBENDER PARTS — Crystal, alchemy, magic
// ============================================================

const VEINBENDER_PARTS: BloodlinePartSet = {
  bloodline: 'Veinbender',
  slots: {
    head: [
      { id: 'vein_head_c', slot: 'head', name: 'Cloth Hood', rarity: 'Common', svgZIndex: 4, svgGroup: '<path d="M 82 60 Q 120 50 158 60 L 160 90 Q 120 95 80 90 Z" fill="#004D40"/>', upgradeable: true },
      { id: 'vein_head_r', slot: 'head', name: 'Adept Cowl', rarity: 'Rare', svgZIndex: 4, svgGroup: '<path d="M 78 55 Q 120 42 162 55 L 165 92 Q 120 100 75 92 Z" fill="#00695C"/><path d="M 85 58 Q 120 48 155 58" stroke="#00E676" stroke-width="1"/>', upgradeable: true },
      { id: 'vein_head_e', slot: 'head', name: 'Crystal Circlet', rarity: 'Epic', svgZIndex: 4, svgGroup: '<path d="M 75 50 Q 120 32 165 50 L 168 95 Q 120 105 72 95 Z" fill="#004D40"/><circle cx="100" cy="70" r="6" fill="#00E676" opacity="0.5" filter="url(#glow)"><animate attributeName="r" values="6;9;6" dur="3s" repeatCount="indefinite"/></circle><circle cx="140" cy="70" r="6" fill="#00E676" opacity="0.5" filter="url(#glow)"><animate attributeName="r" values="6;9;6" dur="3s" repeatCount="indefinite"/></circle>', upgradeable: true },
      { id: 'vein_head_l', slot: 'head', name: 'Flux Crown', rarity: 'Legendary', svgZIndex: 5, svgGroup: '<path d="M 70 45 Q 120 22 170 45 L 175 98 Q 120 110 65 98 Z" fill="#00332E"/><path d="M 80 35 Q 120 25 160 35" stroke="#00E5FF" stroke-width="2"/><circle cx="120" cy="30" r="4" fill="#00E5FF" filter="url(#glow)"><animate attributeName="r" values="4;7;4" dur="1.5s" repeatCount="indefinite"/></circle><path d="M 90 50 Q 120 40 150 50" fill="none" stroke="#00E676" stroke-width="1" opacity="0.7"/>', upgradeable: false },
    ],
    body: [
      { id: 'vein_body_c', slot: 'body', name: 'Student Robes', rarity: 'Common', svgZIndex: 1, svgGroup: '<rect x="80" y="110" width="80" height="95" rx="20" fill="#00695C"/><path d="M 95 130 L 145 130" stroke="#00897B" stroke-width="1"/>', upgradeable: true },
      { id: 'vein_body_r', slot: 'body', name: 'Channeler Tunic', rarity: 'Rare', svgZIndex: 1, svgGroup: '<rect x="78" y="108" width="84" height="97" rx="18" fill="#004D40"/><path d="M 82 130 L 158 130" stroke="#00E676" stroke-width="0.8" opacity="0.5"/>', upgradeable: true },
      { id: 'vein_body_e', slot: 'body', name: 'Flux Weave', rarity: 'Epic', svgZIndex: 1, svgGroup: '<rect x="75" y="105" width="90" height="100" rx="18" fill="#00332E"/><path d="M 80 128 L 160 128 M 80 158 L 160 158" stroke="#00E676" stroke-width="0.6" opacity="0.4"><animate attributeName="opacity" values="0.4;0.1;0.4" dur="3s" repeatCount="indefinite"/></path>', upgradeable: true },
      { id: 'vein_body_l', slot: 'body', name: 'Aether Vestment', rarity: 'Legendary', svgZIndex: 1, svgGroup: '<rect x="72" y="102" width="96" height="103" rx="20" fill="#001F1A"/><path d="M 78 125 L 162 125 M 78 165 L 162 165" stroke="#00E5FF" stroke-width="0.8" opacity="0.5"><animate attributeName="opacity" values="0.5;0.15;0.5" dur="2.5s" repeatCount="indefinite"/></path><circle cx="120" cy="148" r="7" fill="#00E676" opacity="0.35"><animate attributeName="r" values="7;11;7" dur="2s" repeatCount="indefinite"/></circle>', upgradeable: false },
    ],
    weapon: [
      { id: 'vein_wpn_c', slot: 'weapon', name: 'Glass Vial', rarity: 'Common', svgZIndex: 6, svgGroup: '<rect x="155" y="105" width="14" height="22" rx="3" fill="#B2EBF2" opacity="0.6"/><rect x="158" y="95" width="8" height="12" rx="2" fill="#B2EBF2" opacity="0.4"/><circle cx="162" cy="90" r="3" fill="#00E676" opacity="0.4"/>', upgradeable: true },
      { id: 'vein_wpn_r', slot: 'weapon', name: 'Crystal Flask', rarity: 'Rare', svgZIndex: 6, svgGroup: '<rect x="153" y="100" width="18" height="28" rx="5" fill="#80CBC4" opacity="0.7"/><rect x="156" y="88" width="12" height="14" rx="3" fill="#80CBC4" opacity="0.5"/><circle cx="162" cy="82" r="4" fill="#00E676" filter="url(#glow)"><animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite"/></circle>', upgradeable: true },
      { id: 'vein_wpn_e', slot: 'weapon', name: 'Vein Elixir', rarity: 'Epic', svgZIndex: 6, svgGroup: '<rect x="150" y="95" width="22" height="32" rx="6" fill="#4DB6AC" opacity="0.7"/><rect x="154" y="82" width="14" height="16" rx="4" fill="#4DB6AC" opacity="0.5"/><circle cx="161" cy="75" r="5" fill="#00E5FF" filter="url(#glow)"><animate attributeName="r" values="5;8;5" dur="1.5s" repeatCount="indefinite"/></circle><path d="M 155 100 L 167 110" stroke="#00E676" stroke-width="0.6" opacity="0.5"/>', upgradeable: true },
      { id: 'vein_wpn_l', slot: 'weapon', name: 'Heartvein Essence', rarity: 'Legendary', svgZIndex: 6, svgGroup: '<rect x="148" y="90" width="26" height="38" rx="7" fill="#26A69A" opacity="0.75"/><rect x="152" y="78" width="18" height="16" rx="4" fill="#26A69A" opacity="0.55"/><circle cx="161" cy="70" r="6" fill="#00E5FF" filter="url(#glow)"><animate attributeName="r" values="6;10;6" dur="1s" repeatCount="indefinite"/></circle><circle cx="161" cy="98" r="3" fill="#00E676" opacity="0.6"><animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite"/></circle>', upgradeable: false },
    ],
    aura: [
      { id: 'vein_aura_c', slot: 'aura', name: 'Mist', rarity: 'Common', svgZIndex: 2, svgGroup: '<circle cx="120" cy="200" r="2" fill="#00E676" opacity="0.25"><animate attributeName="opacity" values="0.25;0;0.25" dur="3s" repeatCount="indefinite"/></circle>', upgradeable: true },
      { id: 'vein_aura_r', slot: 'aura', name: 'Crystal Dust', rarity: 'Rare', svgZIndex: 2, svgGroup: '<circle cx="100" cy="200" r="2.5" fill="#00E676" opacity="0.3"><animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite"/></circle><circle cx="140" cy="195" r="2" fill="#00E5FF" opacity="0.25"><animate attributeName="opacity" values="0.25;0;0.25" dur="2.8s" repeatCount="indefinite"/></circle>', upgradeable: true },
      { id: 'vein_aura_e', slot: 'aura', name: 'Flux Field', rarity: 'Epic', svgZIndex: 7, svgGroup: '<ellipse cx="120" cy="200" rx="45" ry="9" fill="#00E676" opacity="0.12"><animate attributeName="opacity" values="0.12;0.02;0.12" dur="1.8s" repeatCount="indefinite"/></ellipse><path d="M 85 195 Q 100 180 110 195" stroke="#00E5FF" stroke-width="0.6" opacity="0.35"/>', upgradeable: true },
      { id: 'vein_aura_l', slot: 'aura', name: 'Aether Storm', rarity: 'Legendary', svgZIndex: 7, svgGroup: '<circle cx="120" cy="150" r="55" fill="none" stroke="#00E676" stroke-width="0.6" opacity="0.25"><animate attributeName="r" values="55;65;55" dur="1.5s" repeatCount="indefinite"/></circle><circle cx="120" cy="150" r="70" fill="none" stroke="#00E5FF" stroke-width="0.4" opacity="0.18"><animate attributeName="r" values="70;85;70" dur="2.5s" repeatCount="indefinite"/></circle>', upgradeable: false },
    ],
  },
};

// ALL BLOODLINES
export const ALL_BLOODLINE_PARTS: Record<string, BloodlineParts | BloodlinePartSet> = {
  Delver: DELVER_PARTS,
  Ironblood: IRONBLOOD_PARTS,
  Forgeborn: FORGEBORN_PARTS,
  Shadowvein: SHADOWVEIN_PARTS,
  Stonewarden: STONEWARDEN_PARTS,
  Veinbender: VEINBENDER_PARTS,
};

// ============================================================
// RARITY ROLLER — weighted random based on gacha weights
// ============================================================

export function rollPartRarity(): Rarity {
  const roll = Math.random() * 100;
  let cumulative = 0;
  const tiers: Rarity[] = ['Common', 'Rare', 'Epic', 'Legendary'];
  for (const tier of tiers) {
    cumulative += PART_RARITY[tier].weight;
    if (roll < cumulative) return tier;
  }
  return 'Common';
}

// ============================================================
// PART BREEDING — mix parent parts to produce offspring parts
// ============================================================

export function breedParts(
  parentA: Record<PartSlot, PartDef>,
  parentB: Record<PartSlot, PartDef>,
): Record<PartSlot, PartDef> {
  const result: Record<string, PartDef> = {};
  const slots: PartSlot[] = ['head', 'body', 'weapon', 'accessory', 'aura'];

  for (const slot of slots) {
    // 60% inherit from one parent, 40% chance to mutate (reroll rarity tier)
    if (Math.random() < 0.6) {
      // Inherit: pick randomly from either parent
      result[slot] = Math.random() < 0.5 ? parentA[slot] : parentB[slot];
    } else {
      // Mutate: pick a random part of the same slot at rolled rarity
      result[slot] = parentA[slot]; // fallback — actual mutation would query part pool
    }
  }

  return result as Record<PartSlot, PartDef>;
}

// ============================================================
// CHARACTER RARITY from parts
// ============================================================

export function rarityFromParts(parts: Record<PartSlot, PartDef>): Rarity {
  const order: Rarity[] = ['Common', 'Rare', 'Epic', 'Legendary'];
  let highest = 0;
  for (const slot of ['head', 'body', 'weapon', 'accessory', 'aura'] as PartSlot[]) {
    const idx = order.indexOf(parts[slot].rarity);
    if (idx > highest) highest = idx;
  }
  return order[highest];
}

// ============================================================
// SVG RENDERER — compose character SVG from parts
// ============================================================

export function composeCharacterSVG(
  parts: Record<PartSlot, PartDef>,
  width: number = 240,
  height: number = 280,
): string {
  // Sort parts by z-index
  const sorted = Object.values(parts)
    .filter((p) => p.svgGroup)
    .sort((a, b) => a.svgZIndex - b.svgZIndex);

  const partsSvg = sorted.map((p) => {
    const glow = PART_RARITY[p.rarity].glow;
    return glow !== 'none'
      ? `<g filter="url(#partGlow)">${p.svgGroup}</g>`
      : p.svgGroup;
  }).join('\n    ');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%">
  <defs>
    <radialGradient id="skin" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFE0D2"/>
      <stop offset="100%" stop-color="#E2A78F"/>
    </radialGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="4" flood-color="#000" flood-opacity="0.3"/>
    </filter>
    <filter id="partGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <radialGradient id="floor" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#333" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#333" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="100%" height="100%" rx="16" fill="#1a1a2e"/>

  <!-- Floor shadow -->
  <ellipse cx="120" cy="215" rx="55" ry="12" fill="url(#floor)"/>

  <!-- Base body (skin) -->
  <g filter="url(#shadow)">
    <circle cx="120" cy="70" r="55" fill="url(#skin)"/>
    <rect x="85" y="180" width="25" height="50" rx="10" fill="#37474F"/>
    <rect x="130" y="180" width="25" height="50" rx="10" fill="#37474F"/>
  </g>

  <!-- Parts (sorted by z-index) -->
  ${partsSvg}

  <!-- Eyes (always on top) -->
  <circle cx="100" cy="75" r="9" fill="#212121"/>
  <circle cx="140" cy="75" r="9" fill="#212121"/>
</svg>`;
}
