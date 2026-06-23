# MineLegends Discord Server Structure

**Server name:** MineLegends
**Description:** "Mine. Build. Battle. Earn. ⛏ | Web3 idle RPG on Solana | Testnet live"
**Region:** Singapore (closest to Indonesia + global)
**Verification level:** Medium

---

## Channel Structure

### 📢 INFORMATION
```
#welcome                  → Auto-greet, server rules, get started
#announcements            → Dev updates, launches, events (read-only for most)
#roadmap                  → Current phase + what's next
#whitepaper               → Link to docs, FAQ
#faq                      → Common questions
#team                     → Who's building MineLegends
```

### 💬 COMMUNITY
```
#general                  → Anything goes
#introductions            → New members say hi
#memes                    → Mine + crypto memes
#off-topic                → Non-crypto chat
#suggestions              → Feature requests, ideas
#polls                    → Community votes
```

### 🎮 GAMEPLAY
```
#gameplay                 → Tips, strategies, builds
#characters               → Show off your roster
#mining                   → Mining tips, math
#battles                  → PvP stories, replays
#tournaments              → Tournament discussion
#guilds                   → Find/create guilds
#trading                  → Marketplace, prices
```

### 🛠 DEVELOPMENT
```
#devlog                   → Daily/weekly dev updates
#github                   → Commits, PRs, releases
#bug-reports              → Report bugs (with template)
#feature-requests         → Suggest features
#smart-contract           → Anchor, security, audits
#frontend                 → Next.js, wallet, UI/UX
#api                      → Backend, indexing
```

### 💰 TOKEN
```
#tokenomics               → Discussion on $MNLG design
#trading                  → Charts, market talk
#burn-tracker             → Total burned (live)
#governance               → DAO proposals, votes
#treasury                 → Treasury transparency
```

### 🎁 AIRDROP
```
#airdrop-status           → Current status, criteria
#airdrop-faq              → Common airdrop questions
#sybil-report             → Report suspicious wallets
#airdrop-winners          → Show off (after distribution)
```

### 🤝 PARTNERS
```
#partners                 → Strategic partners chat
#guild-leaders            → Guild coordination
#kol                      → KOLs + influencers
#collab                   → Collab requests
```

### 🔒 STAFF
```
#staff-chat               → Internal team
#mod-mail                 → Mod discussions
#logs                     → Bot logs, mod actions
```

---

## Roles

### Auto Roles (based on wallet verification)
- 🟢 **Verified Miner** — connected Solana wallet
- 💎 **Legendary Holder** — owns 1+ legendary NFT
- 🏆 **Tournament Winner** — top 3 in any tournament
- 🛡 **Guild Leader** — leads a guild
- ⭐ **OG** — joined before mainnet

### Earned Roles (via activity)
- 🐛 **Bug Hunter** — reported 5+ valid bugs
- 🎨 **Artist** — created community art
- 📚 **Scholar** — wrote community guides
- 🎁 **Airdrop Hunter** — qualified for airdrop
- 💯 **Helper** — answered 50+ questions

### Staff Roles
- 👑 **Founder** — Riz (draycolix)
- 🛠 **Core Team** — developers, advisors
- ⚔️ **Moderator** — community mods
- 🤖 **Bot** — MineBot, Wallet Verifier

### Cosmetic
- 🌟 **Supporter** — donated to treasury
- 🚀 **Early Backer** — backed in pre-seed

---

## Bot Configuration

### MineBot (Custom)
**Purpose:** Game integration, wallet verification, airdrop tracking

**Commands:**
```
!balance              → Show $MNLG balance
!characters           → List owned characters
!mining               → Show mining status
!claim                → Remind to claim (if available)
!airdrop              → Check airdrop eligibility
!leaderboard          → Top miners/battlers
!help                 → List commands
!link-wallet          → Link Solana wallet to Discord
```

### Wallet Verifier (Custom)
**Purpose:** Verify wallet ownership for role assignment

**Flow:**
1. User runs `/verify`
2. Bot generates unique nonce
3. User signs message with Phantom
4. Bot verifies signature on-chain
5. Assigns Verified Miner role

### MEE6 (or similar)
**Purpose:** Auto-mod, welcome messages, level system

**Settings:**
- Welcome: "Welcome {user} to MineLegends! ⛏ Read #welcome to get started."
- Auto-mod: enabled (spam, profanity, link filtering)
- Level rewards: tied to engagement (no pay-to-win)

### Collab.Land (or similar)
**Purpose:** Token-gated channels

**Setup:**
- Hold 100+ $MNLG → access #whale-chat
- Hold 1+ Legendary NFT → access #legendary-lounge
- Hold 100K+ $MNLG → access #whale-lounge

---

## Moderation Rules

### Allowed
- Civil discussion
- Constructive criticism
- Memes (in #memes)
- Trading (in #trading, with disclaimer)
- Language: English primary, ID/ES/PT welcome

### Not Allowed
- Scam links / phishing
- Doxxing / personal attacks
- Spam / flooding
- Other token promotion (no shilling)
- NSFW content
- Impersonation
- "Guru" / "Signals" services

### Enforcement
1. **Warning** (1st offense, mod discretion)
2. **24h timeout** (2nd offense)
3. **7-day timeout** (3rd offense)
4. **Permanent ban** (4th offense or severe)

### Appeals
- DM @Moderator
- 48h response time
- Final decision by Founder

---

## Events Calendar

### Recurring
- **Weekly:** Dev Update (Friday 14:00 UTC)
- **Weekly:** Community Game Night (Saturday 18:00 UTC)
- **Bi-weekly:** Community Call (Sunday 16:00 UTC)
- **Monthly:** Town Hall (1st of month)

### One-time
- Testnet launch party
- Tournament finals
- Governance vote opening
- Mainnet launch

### Seasonal
- Season pass events
- Holiday specials
- Anniversary celebrations

---

## Onboarding Flow

### New Member Journey
1. **Join** → Welcome message with quick links
2. **Read #welcome** → Server rules, role info
3. **Run /verify** → Link wallet (auto)
4. **Get Verified Miner role** → Access to most channels
5. **Read #roadmap** → Know what's happening
6. **Introduce in #introductions** → Optional but encouraged
7. **Ask questions in #faq or #general** → Community helps

### First-time User Tips
- "Start with #welcome and #roadmap"
- "Verify your wallet to access game channels"
- "Ask anything in #general — no question is too basic"

---

## Integrations

### Twitter/X
- Auto-post #announcements to @minelegends
- Mirror milestones to #announcements

### GitHub
- Webhook for commits → #github
- Release notes → #announcements

### Notion / Google Docs
- Whitepaper, GDD, FAQ
- Embed in #whitepaper channel

### Calendar
- Google Calendar for events
- /events Discord bot

---

## Growth Strategy

### Month 1: 100 members
- Invite from X / Telegram
- Personal outreach to friends
- Airdrop waitlist incentive

### Month 2: 1,000 members
- KOL mentions
- Raid partnerships
- Beta tester invites

### Month 3: 5,000 members
- Testnet public launch
- Referral rewards
- Meme contest

### Month 4+: 10,000+ members
- Organic growth
- Tournament prizes
- Influencer partnerships

---

## Budget (Monthly)

| Item | Cost |
|---|---|
| MEE6 Premium | $15 |
| Better Uptime (bot monitoring) | $5 |
| Custom bot hosting (Vercel) | $0-20 |
| Raid incentives (rare NFTs) | $50-200 |
| Community giveaways | $100-500 |
| Mod stipends (5 mods x $50) | $250 |
| **Total** | **$420-990** |

---

## KPIs to Track

- **Member count:** target +100/week in Month 1
- **Active members:** target 30% of total
- **Messages/day:** target 100+
- **New verifications/week:** target 50+
- **Event attendance:** target 20% of members
- **Airdrop conversion:** target 80% of wallet verifiers

---

## Final Notes

This is a **living document**. Update monthly based on:
- Community feedback
- What channels are active vs dead
- Bot effectiveness
- Moderation issues
- New game features
