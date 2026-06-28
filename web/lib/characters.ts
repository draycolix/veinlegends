// VeinLegends Character System — Rarity, Bloodlines, Breeding

// ============================================================
// TYPES
// ============================================================

export type Bloodline =
  | 'Delver'
  | 'Ironblood'
  | 'Forgeborn'
  | 'Shadowvein'
  | 'Stonewarden'
  | 'Veinbender';

export type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';

export interface CharacterStats {
  mining: number; // 1-10
  battle: number; // 1-10
  hp: number; // 1-10
}

export interface Character {
  id: string;
  name: string;
  bloodline: Bloodline;
  rarity: Rarity;
  generation: number; // 0 = base, max 6 (7 sterile)
  stats: CharacterStats;
  breedCount: number; // how many times this character has been bred
  parentIds?: [string, string]; // for lineage tracking
  // Lore (for named heroes)
  title?: string; // e.g. "The Ashen Warden"
  appearance?: string; // visual description
  backstory?: string; // origin story
  personality?: string; // behavioral traits
  signature?: string; // unique ability name + description
}

export interface BreedResult {
  offsprings: [Character, Character]; // 2 born (supply-neutral)
  burnedParents: [Character, Character]; // both parents destroyed (burn-to-breed)
  cost: { vein: number; ore: number };
  burn: number; // $VEIN burned
  supplyChange: number; // 0 (2 burned, 2 born = net zero)
}

// ============================================================
// BLOODLINE BASE STATS (Generation 0, Common)
// ============================================================

export const BLOODLINES: Record<
  Bloodline,
  { baseStats: CharacterStats; icon: string; color: string }
> = {
  Delver: {
    baseStats: { mining: 5, battle: 2, hp: 3 },
    icon: '⛏',
    color: 'from-yellow-500 to-orange-600',
  },
  Ironblood: {
    baseStats: { mining: 2, battle: 5, hp: 5 },
    icon: '⚔',
    color: 'from-red-500 to-rose-600',
  },
  Forgeborn: {
    baseStats: { mining: 3, battle: 3, hp: 4 },
    icon: '🔥',
    color: 'from-amber-500 to-yellow-600',
  },
  Shadowvein: {
    baseStats: { mining: 2, battle: 4, hp: 2 },
    icon: '🗡',
    color: 'from-indigo-500 to-purple-600',
  },
  Stonewarden: {
    baseStats: { mining: 2, battle: 3, hp: 6 },
    icon: '🛡',
    color: 'from-slate-400 to-gray-600',
  },
  Veinbender: {
    baseStats: { mining: 3, battle: 2, hp: 3 },
    icon: '🧪',
    color: 'from-emerald-500 to-teal-600',
  },
};

// ============================================================
// RARITY SYSTEM
// ============================================================

export const RARITY_CONFIG: Record<
  Rarity,
  {
    label: string;
    color: string;
    textColor: string;
    glow: string;
    statMultiplier: number;
    breedLimit: number;
  }
> = {
  Common: {
    label: 'Common',
    color: 'bg-gray-600',
    textColor: 'text-gray-300',
    glow: 'shadow-gray-500/30',
    statMultiplier: 1.0,
    breedLimit: 7,
  },
  Rare: {
    label: 'Rare',
    color: 'bg-blue-500',
    textColor: 'text-blue-300',
    glow: 'shadow-blue-500/40',
    statMultiplier: 1.3,
    breedLimit: 5,
  },
  Epic: {
    label: 'Epic',
    color: 'bg-purple-500',
    textColor: 'text-purple-300',
    glow: 'shadow-purple-500/50',
    statMultiplier: 1.6,
    breedLimit: 4,
  },
  Legendary: {
    label: 'Legendary',
    color: 'bg-yellow-400',
    textColor: 'text-yellow-300',
    glow: 'shadow-yellow-500/60',
    statMultiplier: 2.0,
    breedLimit: 3,
  },
};

// ============================================================
// BREEDING — RARITY INHERITANCE TABLE
// ============================================================

// [parentA][parentB] → [Common%, Rare%, Epic%, Legendary%]
type RarityOdds = [number, number, number, number]; // sums to 100

const RARITY_INDEX: Record<Rarity, number> = {
  Common: 0,
  Rare: 1,
  Epic: 2,
  Legendary: 3,
};

const BREED_RARITY_TABLE: Record<string, RarityOdds> = {
  // Common × Common
  '0-0': [80, 18, 2, 0],
  // Common × Rare
  '0-1': [50, 40, 9, 1],
  // Common × Epic
  '0-2': [30, 40, 25, 5],
  // Common × Legendary
  '0-3': [15, 30, 40, 15],
  // Rare × Rare
  '1-1': [20, 50, 25, 5],
  // Rare × Epic
  '1-2': [10, 35, 40, 15],
  // Rare × Legendary
  '1-3': [5, 20, 45, 30],
  // Epic × Epic
  '2-2': [5, 20, 50, 25],
  // Epic × Legendary
  '2-3': [0, 10, 45, 45],
  // Legendary × Legendary
  '3-3': [0, 5, 35, 60],
};

function getRarityOdds(r1: Rarity, r2: Rarity): RarityOdds {
  const a = RARITY_INDEX[r1];
  const b = RARITY_INDEX[r2];
  // Normalize so lower index is always first
  const key = a <= b ? `${a}-${b}` : `${b}-${a}`;
  return BREED_RARITY_TABLE[key] || [100, 0, 0, 0];
}

function rollRarity(parentA: Character, parentB: Character): Rarity {
  const odds = getRarityOdds(parentA.rarity, parentB.rarity);
  const roll = Math.random() * 100;
  let cumulative = 0;
  const rarities: Rarity[] = ['Common', 'Rare', 'Epic', 'Legendary'];
  for (let i = 0; i < 4; i++) {
    cumulative += odds[i];
    if (roll < cumulative) return rarities[i];
  }
  return 'Common';
}

// ============================================================
// BREEDING — STAT INHERITANCE
// ============================================================

function inheritStats(
  parentA: Character,
  parentB: Character,
  bloodline: Bloodline,
  rarity: Rarity
): CharacterStats {
  // Average parent stats + variance ±15%
  const avgMining = (parentA.stats.mining + parentB.stats.mining) / 2;
  const avgBattle = (parentA.stats.battle + parentB.stats.battle) / 2;
  const avgHp = (parentA.stats.hp + parentB.stats.hp) / 2;

  const variance = () => 1 + (Math.random() - 0.5) * 0.3; // ±15%

  const multiplier = RARITY_CONFIG[rarity].statMultiplier;
  const base = BLOODLINES[bloodline].baseStats;

  // Blend: 60% parent average + 40% bloodline base, times rarity multiplier
  const mining = Math.round(
    Math.min(10, Math.max(1, (avgMining * 0.6 + base.mining * 0.4) * variance() * multiplier))
  );
  const battle = Math.round(
    Math.min(10, Math.max(1, (avgBattle * 0.6 + base.battle * 0.4) * variance() * multiplier))
  );
  const hp = Math.round(
    Math.min(10, Math.max(1, (avgHp * 0.6 + base.hp * 0.4) * variance() * multiplier))
  );

  return { mining, battle, hp };
}

// ============================================================
// BREEDING — COST CALCULATOR
// ============================================================

const BASE_BREED_COST_VEIN = 1000;
const BASE_BREED_COST_ORE = 500;
const BREED_BURN_RATE = 0.25; // 25%

function getBreedCost(generation: number): { vein: number; ore: number; burn: number } {
  const multiplier = Math.pow(1.5, generation);
  const vein = Math.round(BASE_BREED_COST_VEIN * multiplier);
  const ore = BASE_BREED_COST_ORE;
  const burn = Math.round(vein * BREED_BURN_RATE);
  return { vein, ore, burn };
}

// ============================================================
// BREEDING — MAX BREEDS PER CHARACTER
// ============================================================

const MAX_BREEDS_BY_GEN = [7, 5, 4, 3, 2, 1, 1]; // gen 0-6

function getMaxBreeds(char: Character): number {
  const rarityBonus = RARITY_CONFIG[char.rarity].breedLimit;
  const genLimit = MAX_BREEDS_BY_GEN[Math.min(char.generation, 6)];
  return Math.min(rarityBonus, genLimit);
}

// ============================================================
// MAIN BREED FUNCTION — BURN-TO-BREED (Destructive, Supply-Neutral)
// 2 parents BURNED → 2 offspring BORN (net supply: 0)
// Rarity: gacha roll for EACH offspring independently
// Bloodline: each offspring gets 50/50 from either parent
// ============================================================

let idCounter = Date.now();

export function breed(parentA: Character, parentB: Character): BreedResult | { error: string } {
  // Validation
  if (parentA.id === parentB.id) return { error: 'Cannot breed a character with itself.' };
  if (parentA.generation >= 7) return { error: `${parentA.name} is sterile (Gen 7+).` };
  if (parentB.generation >= 7) return { error: `${parentB.name} is sterile (Gen 7+).` };
  if (parentA.breedCount >= getMaxBreeds(parentA))
    return { error: `${parentA.name} has reached max breeds (${getMaxBreeds(parentA)}).` };
  if (parentB.breedCount >= getMaxBreeds(parentB))
    return { error: `${parentB.name} has reached max breeds (${getMaxBreeds(parentB)}).` };

  const generation = Math.max(parentA.generation, parentB.generation) + 1;
  const costGen = Math.max(parentA.generation, parentB.generation);
  const cost = getBreedCost(costGen);

  // Generate TWO offsprings (each with independent gacha rolls)
  const offsprings: [Character, Character] = [
    generateOffspring(parentA, parentB, generation),
    generateOffspring(parentA, parentB, generation),
  ];

  return {
    offsprings,
    burnedParents: [parentA, parentB],
    cost,
    burn: cost.burn,
    supplyChange: 0, // 2 burned — 2 born = net zero
  };
}

function generateOffspring(parentA: Character, parentB: Character, generation: number): Character {
  // Bloodline: 50/50 from either parent
  const bloodline: Bloodline =
    Math.random() < 0.5 ? parentA.bloodline : parentB.bloodline;

  // Gacha rarity roll
  const rarity = rollRarity(parentA, parentB);

  // Inherit stats
  const stats = inheritStats(parentA, parentB, bloodline, rarity);

  // Generate name
  const name = generateName(bloodline);

  return {
    id: `char_${++idCounter}`,
    name,
    bloodline,
    rarity,
    generation,
    stats,
    breedCount: 0,
    parentIds: [parentA.id, parentB.id],
  };
}

function generateName(bloodline: Bloodline): string {
  const bloodlinePrefixes: Record<Bloodline, string[]> = {
    Delver: ['Deep', 'Cave', 'Tunnel', 'Ore', 'Shaft'],
    Ironblood: ['Blade', 'Forge', 'Steel', 'Crimson', 'Molten'],
    Forgeborn: ['Ember', 'Flint', 'Cinder', 'Ash', 'Spark'],
    Shadowvein: ['Shade', 'Whisper', 'Dusk', 'Void', 'Gloom'],
    Stonewarden: ['Bastion', 'Granite', 'Shield', 'Bulwark', 'Atlas'],
    Veinbender: ['Crystal', 'Elixir', 'Flux', 'Aether', 'Phial'],
  };
  const suffixes = ['Warden', 'Seeker', 'Walker', 'Forge', 'Born', 'Weaver'];
  const prefix =
    bloodlinePrefixes[bloodline][Math.floor(Math.random() * bloodlinePrefixes[bloodline].length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  return `${prefix}${suffix}`;
}

// ============================================================
// HELPER: Generate sample character
// ============================================================

export function createCharacter(
  bloodline: Bloodline,
  rarity: Rarity,
  generation: number = 0
): Character {
  const base = BLOODLINES[bloodline].baseStats;
  const mult = RARITY_CONFIG[rarity].statMultiplier;
  const variance = () => 1 + (Math.random() - 0.5) * 0.2;

  const stats: CharacterStats = {
    mining: Math.round(Math.min(10, Math.max(1, base.mining * mult * variance()))),
    battle: Math.round(Math.min(10, Math.max(1, base.battle * mult * variance()))),
    hp: Math.round(Math.min(10, Math.max(1, base.hp * mult * variance()))),
  };

  const names = [
    'Ashforge', 'Glimmervein', 'Thornblood', 'Duskmantle',
    'Ironveil', 'Crystalmark', 'Emberlash', 'Stonewhisper',
  ];

  return {
    id: `char_${++idCounter}`,
    name: names[Math.floor(Math.random() * names.length)],
    bloodline,
    rarity,
    generation,
    stats,
    breedCount: 0,
  };
}

// ============================================================
// NAMED HEROES — 6 Legendary Warriors (Gen 0, one per Bloodline)
// ============================================================

export interface HeroLore {
  title: string;
  appearance: string;
  backstory: string;
  personality: string;
  signature: string;
}

export const NAMED_HEROES: (Character & Required<Pick<Character, 'title' | 'appearance' | 'backstory' | 'personality' | 'signature'>>)[] = [
  // ⛏ DELVER — Kael "Veinfinder"
  {
    id: 'hero_delver_kael',
    name: 'Kael',
    title: 'The Veinfinder',
    bloodline: 'Delver',
    rarity: 'Epic',
    generation: 0,
    stats: { mining: 9, battle: 4, hp: 5 },
    breedCount: 0,
    appearance: 'Tubuh kurus dibalut jubah kulit bertabur kristal Veinstone. Mata kirinya diganti lensa obsidian bercahaya kuning — hasil dari ritual Vein Sense. Rambut pirang kusam diikat ekor kuda, tangan kiri penuh tato peta gua.',
    backstory: 'Dulu budak tambang di Hollow Deeps milik Extraction Guild. Umur 14 tahun, Kael menemukan jalur Vein utama yang disembunyikan Guild selama 3 generasi. Alih-alih melapor, dia menandai seluruh tubuhnya dengan peta jalur Vein — lalu kabur. Sekarang dia satu-satunya manusia yang hafal seluruh jaringan Vein bawah tanah Gea Prime tanpa alat.',
    personality: 'Pendiam, paranoid, tidak percaya pada siapapun kecuali peta di lengannya sendiri. Bicara seperlunya, tapi kalau soal jalur tambang — matanya menyala.',
    signature: 'Vein Sense: Mendeteksi deposit Vein dalam radius 100m tanpa alat. Mining output 2× saat solo.',
  },
  // ⚔ IRONBLOOD — Veyra "Bloodfury"
  {
    id: 'hero_ironblood_veyra',
    name: 'Veyra',
    title: 'The Bloodfury',
    bloodline: 'Ironblood',
    rarity: 'Legendary',
    generation: 0,
    stats: { mining: 3, battle: 10, hp: 9 },
    breedCount: 0,
    appearance: 'Wanita tinggi tegap dengan rambut merah menyala dikepang samping — ujungnya dicelup darah musuh pertama yang dia kalahkan. Armor besi hitam penuh goresan, kedua lengan penuh bekas luka. Mata merah darah, selalu setengah menyeringai.',
    backstory: 'Veyra lahir di tengah perang Bloodline — ibunya tewas saat melahirkan di medan perang, ayahnya panglima Ironblood yang gugur 3 tahun kemudian. Umur 16 tahun dia sudah memimpin 200 prajurit. Umur 22, dia mengalahkan 50 Hollowed sendirian dalam Pertempuran Shattered Vein. Julukan "Bloodfury" diberikan lawan yang melihatnya bertarung — katanya dia semakin kuat setiap terluka.',
    personality: 'Agresif, lapar pertempuran, tapi loyalitasnya mutlak pada Ironblood. Tidak kenal takut — kadang terlalu berani. Di luar perang, dia diam dan menatap api unggun berjam-jam.',
    signature: 'First Strike: Darah Ironblood mendidih saat pertempuran dimulai. Selalu menyerang pertama. Setiap 10% HP hilang → +5% damage.',
  },
  // 🔥 FORGEBORN — Orin "Veinsmith"
  {
    id: 'hero_forgeborn_orin',
    name: 'Orin',
    title: 'The Veinsmith',
    bloodline: 'Forgeborn',
    rarity: 'Epic',
    generation: 0,
    stats: { mining: 6, battle: 7, hp: 6 },
    breedCount: 0,
    appearance: 'Pria setengah baya berotot dengan janggut pendek abu-abu. Kulitnya penuh bekas luka bakar — beberapa masih berpendar oranye seperti bara. Memakai apron kulit tebal bertulis "Heartvein Forge" dan kedua tangannya dibalut sarung besi yang menyala saat dia marah.',
    backstory: 'Orin adalah pandai besi terakhir Heartvein Forge — bengkel legendaris yang menempa senjata dengan Vein-fire. Saat Veinsbane Cult menghancurkan bengkelnya dan membunuh seluruh muridnya, Orin menelan sebongkah Veinstone mentah. Bukannya mati, dia malah bisa mengendalikan Vein-fire dari dalam tubuhnya sendiri. Sekarang dia menempa senjata dengan tangannya sendiri — tanpa alat.',
    personality: 'Kalem, sabar, filosofis. Suka ngomong pake metafora pandai besi. Tapi kalau ada yang ngancem orang tak bersalah, dia berubah jadi gunung berapi.',
    signature: 'Vein Burn: Menempa senjata langsung dengan Vein-fire dari tangannya. Serangan memberi efek BURN (DoT 3 turn). Musuh yang mati terbakar meledak — damage ke musuh sekitar.',
  },
  // 🗡 SHADOWVEIN — Nyx "Duskwalker"
  {
    id: 'hero_shadowvein_nyx',
    name: 'Nyx',
    title: 'The Duskwalker',
    bloodline: 'Shadowvein',
    rarity: 'Epic',
    generation: 0,
    stats: { mining: 3, battle: 8, hp: 4 },
    breedCount: 0,
    appearance: 'Sosok ramping berjubah hitam dengan tudung selalu menutupi setengah wajah. Yang terlihat hanya mata violet bercahaya — katanya bisa melihat dalam gelap total. Kedua belati di pinggangnya terbuat dari Shadowvein Crystal: hitam pekat, tidak memantulkan cahaya. Bergerak tanpa suara.',
    backstory: 'Nyx tidak pernah bicara tentang masa lalunya — bahkan nama "Nyx" adalah nama yang dia pilih sendiri. Yang diketahui: dia adalah satu-satunya yang selamat dari eksperimen Shadowvein pertama, di mana 12 anak dipaksa menyerap Vein murni. Dia kabur umur 11 tahun, membunuh 3 penyiksanya dalam kegelapan, dan menghilang ke Hollow Deeps. Sekarang dia bekerja sebagai pembunuh bayaran — tapi hanya membunuh mereka yang "layak mati".',
    personality: 'Hampir tidak pernah bicara. Kalau bicara, suaranya seperti bisikan angin. Misterius, menakutkan, tapi anehnya: dia tidak pernah melukai anak-anak. Beberapa saksi bilang dia pernah menyelamatkan desa dari Hollowed — tanpa pernah menampakkan diri.',
    signature: 'Veil Step: Teleport jarak pendek melalui bayangan. First strike selalu critical saat menyerang dari belakang. Tidak terdeteksi di area gelap.',
  },
  // 🛡 STONEWARDEN — Thara "Ironwall"
  {
    id: 'hero_stonewarden_thara',
    name: 'Thara',
    title: 'The Ironwall',
    bloodline: 'Stonewarden',
    rarity: 'Rare',
    generation: 0,
    stats: { mining: 4, battle: 4, hp: 10 },
    breedCount: 0,
    appearance: 'Wanita bertubuh kekar dengan tinggi hampir 2 meter. Armor batu Vulkanik menutupi seluruh tubuh — beratnya 80kg tapi dia bergerak seperti pakai baju biasa. Rambut hitam dipotong pendek ala prajurit. Wajahnya tenang, tanpa ekspresi — seperti tembok. Perisai raksasanya bertulis "Bastion" dalam aksara kuno.',
    backstory: 'Thara tumbuh di desa perbatasan yang selalu jadi korban perang Bloodline. Umur 17, saat Stonewarden menyerang desanya, dia berdiri di depan gerbang desa seorang diri — menahan 30 prajurit selama 4 jam sampai bala bantuan datang. Setelah itu, Stonewarden malah mengangkatnya jadi kapten. Dia tidak pernah kalah dalam perang bertahan.',
    personality: 'Tenang, tidak banyak bicara, selalu jadi yang terakhir mundur. Punya kode kehormatan ketat: tidak pernah menyerang duluan, tapi sekali diserang — dia jadi tembok yang tidak bisa ditembus. Ironisnya, di balik penampilan mengerikan, dia suka merawat hewan terluka.',
    signature: 'Bastion Aura: Semua ally dalam radius 10m dapat +30% DEF. Setiap kali Thara menerima damage, dia menyembuhkan 5% HP-nya sendiri.',
  },
  // 🧪 VEINBENDER — Mira "Fluxweaver"
  {
    id: 'hero_veinbender_mira',
    name: 'Mira',
    title: 'The Fluxweaver',
    bloodline: 'Veinbender',
    rarity: 'Legendary',
    generation: 0,
    stats: { mining: 5, battle: 6, hp: 5 },
    breedCount: 0,
    appearance: 'Gadis muda berusia sekitar 19 tahun dengan rambut platinum pendek yang melayang ringan — seolah ada angin yang hanya bertiup di sekitarnya. Matanya heterokrom: biru es (kiri) dan emas (kanan) — keduanya berpendar saat dia menggunakan kekuatan. Memakai jaket kulit pendek dan celana panjang praktis, dengan 5 vial Vein cair di sabuknya.',
    backstory: 'Mira tidak seharusnya lahir — ibunya seorang Veinbender yang divonis mati oleh Veinsbane Cult karena menolak bergabung. Ibunya kabur ke gua, melahirkan Mira sendirian, dan meninggal 3 hari kemudian. Bayi Mira ditemukan oleh sekelompok penambang Delver. Anehnya: di sekeliling bayi itu, Vein mati mulai mengalir lagi. Mira adalah "Fluxweaver" pertama dalam 200 tahun — mampu menghidupkan kembali Vein yang mati.',
    personality: 'Ceria, penasaran, kadang ceroboh karena terlalu bersemangat. Masih muda dan naif tentang dunia luar — tapi potensinya tidak terbatas. Semua Bloodline menginginkannya — dan itulah bahaya terbesarnya.',
    signature: 'Flux Surge: Menghidupkan Vein mati dalam radius 50m. Dalam pertempuran, bisa mencuri 15% stats musuh dan menambahkannya ke ally. Efek stack sampai 3×.',
  },
];

export function getNamedHeroes(): Character[] {
  return NAMED_HEROES.map((h) => ({ ...h }));
}

// ============================================================
// GENERIC WARRIORS — Common/Rare pool for gacha pulls
// Mass-produced miners, soldiers, scouts — no lore, just stats
// ============================================================

const BLOODLINE_NAMES: Record<Bloodline, { prefixes: string[]; titles: string[] }> = {
  Delver: {
    prefixes: ['Tunnel', 'Shaft', 'Cave', 'Deep', 'Ore', 'Pit', 'Drift'],
    titles: ['Digger', 'Scout', 'Prospector', 'Hauler', 'Rat', 'Mole'],
  },
  Ironblood: {
    prefixes: ['Blade', 'Steel', 'Crimson', 'Blood', 'War', 'Iron'],
    titles: ['Soldier', 'Brawler', 'Grunt', 'Veteran', 'Recruit', 'Mercenary'],
  },
  Forgeborn: {
    prefixes: ['Ash', 'Cinder', 'Flint', 'Spark', 'Ember', 'Coal'],
    titles: ['Smith', 'Apprentice', 'Stoker', 'Hammer', 'Anvil', 'Forger'],
  },
  Shadowvein: {
    prefixes: ['Shade', 'Dusk', 'Void', 'Gloom', 'Whisper', 'Dark'],
    titles: ['Stalker', 'Shadow', 'Rogue', 'Watcher', 'Runner', 'Thief'],
  },
  Stonewarden: {
    prefixes: ['Granite', 'Shield', 'Bastion', 'Wall', 'Boulder', 'Keep'],
    titles: ['Guard', 'Sentinel', 'Defender', 'Protector', 'Watch', 'Patrol'],
  },
  Veinbender: {
    prefixes: ['Crystal', 'Flux', 'Aether', 'Phial', 'Elixir', 'Essence'],
    titles: ['Adept', 'Student', 'Channeler', 'Mixer', 'Brewer', 'Novice'],
  },
};

const RARITY_DISTRIBUTION: { rarity: Rarity; weight: number; count: number }[] = [
  { rarity: 'Common', weight: 50, count: 8 },  // 50% pull
  { rarity: 'Rare',   weight: 30, count: 5 },  // 30% pull
  { rarity: 'Epic',   weight: 15, count: 3 },  // 15% pull
  { rarity: 'Legendary', weight: 5, count: 2 }, // 5% pull — very lucky!
];

let genericIdCounter = 5000;

function generateGenericCharacter(bloodline: Bloodline, rarity: Rarity): Character {
  const bl = BLOODLINES[bloodline];
  const names = BLOODLINE_NAMES[bloodline];
  const mult = RARITY_CONFIG[rarity].statMultiplier;
  const variance = () => 1 + (Math.random() - 0.5) * 0.3;

  const stats: CharacterStats = {
    mining: Math.round(Math.min(10, Math.max(1, bl.baseStats.mining * mult * variance()))),
    battle: Math.round(Math.min(10, Math.max(1, bl.baseStats.battle * mult * variance()))),
    hp: Math.round(Math.min(10, Math.max(1, bl.baseStats.hp * mult * variance()))),
  };

  const prefix = names.prefixes[Math.floor(Math.random() * names.prefixes.length)];
  const title = names.titles[Math.floor(Math.random() * names.titles.length)];

  return {
    id: `generic_${++genericIdCounter}`,
    name: `${prefix} ${title}`,
    bloodline,
    rarity,
    generation: 0,
    stats,
    breedCount: 0,
  };
}

export function generateGenericPool(): Character[] {
  const pool: Character[] = [];

  // Generate generic warriors following rarity distribution
  for (const tier of RARITY_DISTRIBUTION) {
    for (let i = 0; i < tier.count; i++) {
      // Cycle through bloodlines for variety
      const bloodlines: Bloodline[] = ['Delver', 'Ironblood', 'Forgeborn', 'Shadowvein', 'Stonewarden', 'Veinbender'];
      const bl = bloodlines[i % bloodlines.length];
      pool.push(generateGenericCharacter(bl, tier.rarity));
    }
  }

  // Shuffle so it's not grouped by rarity
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool;
}

// ============================================================
// GACHA PULL — simulate opening a pack
// ============================================================

export function gachaPull(): Character {
  const roll = Math.random() * 100;
  let cumulative = 0;

  for (const tier of RARITY_DISTRIBUTION) {
    cumulative += tier.weight;
    if (roll < cumulative) {
      const bloodlines: Bloodline[] = ['Delver', 'Ironblood', 'Forgeborn', 'Shadowvein', 'Stonewarden', 'Veinbender'];
      const bl = bloodlines[Math.floor(Math.random() * bloodlines.length)];
      return generateGenericCharacter(bl, tier.rarity);
    }
  }

  return generateGenericCharacter('Delver', 'Common');
}
