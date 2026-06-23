# MineLegends Game Design Document v1.0

**Last updated:** June 23, 2026
**Genre:** Idle RPG + PvP Battle + Light Strategy
**Platforms:** Web (v1), Telegram mini app (v1.5), Mobile native (v2)
**Target audience:** 18-35, crypto-curious, casual-to-midcore gamers

---

## 1. Core Vision

A **bite-sized Web3 RPG** that respects player time. Sessions of 5-15 minutes feel meaningful, but the game also rewards 30-minute deep dives. The economy is real, but not predatory. The fun comes first; the tokenomics are an enabler, not a crutch.

**Player promise:** "5 minutes a day to progress. 30 minutes to compete. 1 hour to master."

---

## 2. Core Loop (One Sentence)

> Mine $MNLG with skill → burn $MNLG for characters → battle others → win bigger $MNLG pools → repeat.

### 2.1 Atomic Loop (60 seconds)
- Tap mine → earn micro-rewards
- Upgrade character → +power
- Win small PvP → +reward
- Spend on next upgrade

### 2.2 Daily Loop (5-15 minutes)
- Login → claim daily reward
- Run 1-3 Gem Rush mini-games
- Spend stamina on PvE dungeon
- Enter 1-2 PvP arena matches
- Upgrade 1-2 characters

### 2.3 Weekly Loop (30-60 minutes)
- Guild wars participation
- Tournament registration
- Marketplace trading
- Big character upgrade / buy

### 2.4 Monthly Loop (2-4 hours)
- Tournament finals
- Season pass progression
- Strategic planning (which characters to level)
- Big purchase / sale

---

## 3. Mining Mechanic

### 3.1 Idle Mining (Default)

**Formula:**
```
Mined per hour = Base × Character_Mining_Power × Player_Level_Modifier × Active_Bonus × Seasonal_Bonus
```

- Base = 10 $MNLG/hour
- Character_Mining_Power = 1.0 to 5.0 (depends on class/level/rarity)
- Player_Level_Modifier = 1 + (level × 0.05)
- Active_Bonus = 1.5 if logged in within 24h
- Seasonal_Bonus = 1.0 to 1.2 (event-driven)

**Cap:** 168 hours (1 week) of offline accumulation. Encourages regular check-in.

### 3.2 Active Mining: Gem Rush (Mini-Game)

**Type:** Match-3 puzzle (Bejeweled-style)
**Duration:** 60 seconds
**Frequency:** Every 4 hours (4 attempts per day max)
**Reward:** 10-50 $MNLG based on score

**Scoring:**
- 3-match: 10 points
- 4-match: 25 points
- 5-match: 50 points
- Combo: 2x multiplier
- Special gems: 3x multiplier

**Reward tiers:**
- 0-100 pts: 10 $MNLG
- 100-200 pts: 20 $MNLG
- 200-300 pts: 35 $MNLG
- 300+ pts: 50 $MNLG

**Anti-bot:** Mouse movement tracking, time-on-task validation, captcha for high scores.

### 3.3 Referral Mining

+20% mining rate for 30 days per active referral.
- Active = plays at least 1 game/week
- Self-referral banned
- Anti-sybil: 1 wallet = 1 referral link

---

## 4. Character System

### 4.1 Class Roster (5 Classes)

#### **Miner** (Common starter)
- Role: Pure mining
- Mining Power: ★★★★★
- Battle Power: ★★☆☆☆
- HP: 100
- Special: Auto-mine bonus +50%
- Lore: "Born in the depths, knows every vein of ore."

#### **Warrior** (Battle-focused)
- Role: PvP melee
- Mining Power: ★★☆☆☆
- Battle Power: ★★★★★
- HP: 200
- Special: First strike (always attacks first in PvP)
- Lore: "Forged in the arena, undefeated in 100 duels."

#### **Mage** (Battle, magic)
- Role: PvP ranged
- Mining Power: ★★☆☆☆
- Battle Power: ★★★★☆
- HP: 120
- Special: Mana shield (blocks 1 attack per battle)
- Lore: "Whispers to the gems, they answer."

#### **Engineer** (Crafting, support)
- Role: Item crafter
- Mining Power: ★★★☆☆
- Battle Power: ★★☆☆☆
- HP: 110
- Special: Repair cost -50%
- Lore: "If it can be built, it can be optimized."

#### **Alchemist** (Crafting, buff)
- Role: Potion brewer
- Mining Power: ★★☆☆☆
- Battle Power: ★★☆☆☆
- HP: 100
- Special: Buffs allies +25% mining
- Lore: "Transmutes dust into gold."

### 4.2 Rarity Tiers

| Rarity | Supply % | Cost | Stat Multiplier | Special |
|---|---|---|---|---|
| Common | 60% | 1,000 $MNLG | 1.0x | None |
| Rare | 30% | 10,000 $MNLG | 1.5x | 1 random ability |
| Legendary | 10% | 100,000 $MNLG | 2.5x | 2 abilities + unique art |

### 4.3 Character Progression

**Level:** 1-50
- XP earned via: battles, mining, quests
- Each level: +10% mining rate, +10% battle power
- XP curve: 100 × level² (so level 50 = 250,000 XP)

**Upgrade cost (per level):**
- Common: 10 × level $MNLG (e.g., level 10 = 100 $MNLG)
- Rare: 100 × level $MNLG
- Legendary: 1,000 × level $MNLG

**Burned:** 60% of upgrade cost

**Equipment Slots:** 3 (weapon, armor, accessory)
- Drops from PvE
- Tradeable on marketplace

### 4.4 Character Acquisition

**Methods:**
1. Buy from shop (burn $MNLG)
2. Win from PvE lootbox (10 $MNLG per attempt)
3. Achievement rewards
4. Seasonal events
5. Marketplace (secondary)

**Daily limit:** 3 character mints per wallet (anti-whale)

---

## 5. Battle System

### 5.1 PvP Arena (Auto-Battle)

**Format:** 1v1, async (no real-time)
**Stake:** 10-1000 $MNLG (choose tier)
**Matchmaking:** Similar stake tier, similar player level
**Resolution:** Calculated in <5 seconds

**Battle formula:**
```
Player1_Score = (Character_Stats × 0.5) + (Stake_Weight × 0.3) + (Random × 0.2)
Player2_Score = (Character_Stats × 0.5) + (Stake_Weight × 0.3) + (Random × 0.2)
Winner = highest score
```

**Outcome:**
- Winner: 90% of opponent's stake (minus burn)
- Loser: loses stake (50% burned, 50% to winner)
- Draw: both refunded (rare, 5%)

**Elo rating:** Tracked, affects matchmaking + visible rank.

### 5.2 PvE Dungeon

**Format:** Solo, 5 difficulty levels
**Stamina cost:** 10 $MNLG per attempt
**Boss HP:** Scales with difficulty
**Damage:** Character's Battle Power

**Rewards:**
- Lootbox (Common to Legendary based on difficulty + luck)
- XP for character
- 10-100 $MNLG

**Lootbox contents:**
- Common lootbox: 80% Common item, 15% Rare, 5% Legendary
- Legendary lootbox: 50% Rare, 40% Legendary, 10% Mythic (limited)

### 5.3 Tournaments

**Daily:**
- 100 players, top 10 share pool
- Entry: 10 $MNLG
- Pool: 900 $MNLG (90% × 1000 total entries)
- Top 3 split: 50%, 30%, 20%

**Weekly:**
- 500 players, top 50 share pool
- Entry: 50 $MNLG
- Pool: 22,500 $MNLG
- Distribution: Top 3 (50%), Top 4-10 (30%), Top 11-50 (20%)

**Monthly (Seasonal):**
- 5000 players, top 500 share pool
- Entry: 200 $MNLG
- Pool: 800,000 $MNLG
- Distribution: Top 3 (40%), Top 4-25 (35%), Top 26-500 (25%)

**Burn:** 50% of all entry fees (deflationary)

---

## 6. Progression Systems

### 6.1 Player Level (1-100)

**XP sources:**
- Battle wins: 50 XP
- Battle losses: 10 XP
- Mining (per 100 $MNLG mined): 5 XP
- Quests: 100-1000 XP
- Achievements: 500-5000 XP

**Perks per level:**
- +5% mining rate
- +5% battle power
- +1 daily stamina (max +10)
- Unlock new game modes at thresholds (10, 25, 50, 75, 100)

### 6.2 Achievements (200+)

**Categories:**
- Mining: "First 1K $MNLG", "100K Club", "1M Club"
- Battle: "First Win", "Win Streak 10", "Top 100"
- Character: "Max Level Character", "5 Legendary Characters"
- Social: "First Referral", "10 Referrals", "Guild Leader"
- Special: "OG Player" (testnet), "Bug Reporter" (helped fix bug)

**Rewards:** XP, $MNLG, character skins, titles.

### 6.3 Season Pass (3 months per season)

**Free tier:** Basic rewards, ~10% of total
**Premium tier (10 $MNLG or $5):** Full rewards, 100% of total

**Perks:**
- Exclusive character skin
- Bonus mining rate (+5%)
- Bonus XP (+10%)
- Cosmetic badges

---

## 7. Social Features

### 7.1 Guilds

- 10-50 members
- Guild XP unlocks guild perks
- Guild leader can set focus (mining, battle, or balanced)
- Guild chat
- Guild wars (5v5)
- Guild treasury (shared $MNLG pool)

**Perks:**
- Level 5: +5% mining for all members
- Level 10: Guild bank unlocks
- Level 20: Guild wars
- Level 30: Custom guild logo (NFT)

### 7.2 Friends

- Friend list (max 100)
- Send/receive $MNLG (small amounts, like tipping)
- Compare stats
- Refer-a-friend bonus

### 7.3 Chat

- Global chat (moderated)
- Guild chat
- Direct messages
- Anti-spam: rate limit, profanity filter

---

## 8. Economy (In-Game)

### 8.1 Sources of $MNLG

| Source | Rate | Notes |
|---|---|---|
| Idle mining | 10/hr (base) | Decay 30% every 3 months |
| Active mining | 10-50/4hr | Gem Rush mini-game |
| Battle wins | 90% of stake | PvP, tournaments |
| Daily login | 5/day | Streak bonus up to 50/day |
| Quests | 50-500 per quest | Daily + weekly |
| Achievements | 100-5000 per achievement | One-time |
| Airdrops | Variable | Community rewards |

### 8.2 Sinks of $MNLG

| Sink | Amount | Burn % |
|---|---|---|
| Buy character | 1K-100K | 80% |
| Upgrade character | 10-1000 per level | 60% |
| Tournament entry | 10-1000 | 50% |
| Repair equipment | 1-10 | 100% |
| Stamina refill | 10 | 100% |
| Fast-track queue | 50 | 100% |
| Custom name | 1000 | 100% |
| Respec stats | 200 | 100% |
| Marketplace fee | 2% | 100% |

**Net:** Designed to be deflationary at scale (50K+ MAU).

---

## 9. UI/UX Flow

### 9.1 First-Time User Experience (FTUE)

1. **Wallet connect** or **Guest mode** (email signup for onboarding)
2. **Tutorial: Mining** (2 minutes, earn first 10 $MNLG)
3. **Tutorial: First character** (get free Common Miner)
4. **Tutorial: First battle** (vs NPC, earn 50 $MNLG)
5. **Daily login streak** prompt
6. **Referral prompt** (optional)

**Goal:** Player has 100 $MNLG and 1 character within 5 minutes.

### 9.2 Main Dashboard

```
[Header: MNLG Balance | Player Level | Daily Streak | Notifications]
[Tab Bar: Mining | Characters | Battle | Tournaments | Market | Guild]
```

**Mining Tab:** Idle counter, Gem Rush button, stats
**Characters Tab:** Grid of owned characters, filters
**Battle Tab:** PvP, PvE, tournament list
**Tournaments Tab:** Active tournaments, results
**Market Tab:** Browse listings, my listings
**Guild Tab:** Guild dashboard, members, chat

### 9.3 Mobile Considerations

- Bottom tab bar (thumb-friendly)
- One-handed operation
- Reduced animations (battery)
- Telegram mini app (v1.5) — runs inside Telegram
- Native app (v2) — full features

---

## 10. Technical Requirements

### 10.1 Frontend

- Next.js 14 (App Router)
- TypeScript strict
- Tailwind CSS
- @solana/wallet-adapter-react
- Phaser.js (mini-games) or Pixi.js
- React Native (v2 mobile)

### 10.2 Smart Contract (Anchor, Rust)

- `token` program: SPL token management
- `game` program: PDAs for player, character, battle
- `marketplace` program: listings, trades
- `tournament` program: registration, payout
- `staking` program: stake $MNLG for perks

### 10.3 Backend (Optional, for off-chain state)

- Node.js + Fastify
- Supabase (Postgres) for indexing
- Redis for caching
- Helius RPC for chain data
- Arweave (via Irys) for large data (chat logs, etc.)

### 10.4 Indexing

- Helius webhooks for transaction monitoring
- Custom indexer for player state
- Real-time leaderboards

---

## 11. Anti-Cheat

### 11.1 Detection

- Mouse movement tracking (bot detection)
- Time-on-task validation
- IP rate limiting
- Device fingerprinting
- Pattern analysis (suspicious play patterns)

### 11.2 Penalties

- Warning (first offense)
- 24h ban (second)
- 7-day ban (third)
- Permanent ban + token blacklist (fourth)

### 11.3 Reporting

- In-game report button
- Community moderators
- Automated flagging (suspicious win rate > 80%)

---

## 12. Success Metrics

### 12.1 Acquisition

- DAU/MAU ratio: target 0.3 (sticky)
- K-factor (viral coefficient): target 1.2 (self-sustaining)
- Cost per install: target <$1
- Day 1 retention: target 50%
- Day 7 retention: target 30%
- Day 30 retention: target 20%

### 12.2 Engagement

- Sessions per day: target 2-3
- Avg session length: target 5-15 min
- Battles per session: target 1-3
- $MNLG burned per user per day: target 5-20

### 12.3 Economic

- Total $MNLG burned per month (Year 1): target 5M
- Total $MNLG burned per month (Year 2): target 50M
- Token velocity: target 60% (burned within 30 days)
- Liquidity depth: target $500K+

---

## 13. Future Roadmap (Beyond 6 Months)

### v1.5 (Month 7-9)
- Telegram mini app
- Mobile-optimized web
- Guild features expansion
- Marketplace enhancements

### v2 (Month 10-12)
- Native iOS + Android
- Real-time PvP (vs async)
- 3D character models
- Cross-chain bridge (Wormhole)

### v3 (Year 2)
- Esports mode (spectator, betting)
- Brand partnerships
- Custom game modes (player-created)
- DAO governance fully active

---

## 14. Open Questions

- Should we add a "casino" element (gacha, lottery)? (Regulatory risk)
- PvP should be async or real-time? (Async is more accessible, real-time is more exciting)
- Should we allow character rental? (NFT fractionalization complexity)
- What about players in regions with crypto restrictions? (Geo-blocking strategy)

These will be addressed in the v2 GDD after feedback from playtesting.
