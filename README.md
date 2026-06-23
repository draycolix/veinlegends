# MineLegends ⛏

> **A Web3 idle RPG on Solana. Mine. Build. Battle. Earn.**

Mine the $MNLG token with skill-based mini-games, burn tokens to mint legendary character NFTs, and battle other players in PvP arenas for token prizes. Deflationary by design — 60% of every in-game action permanently burns $MNLG.

**Status:** v0.1.0 — Pre-devnet scaffolding
**TGE target:** Q4 2026
**Mainnet target:** Q4 2026

---

## 📁 Repository Structure

```
minelegends/
├── docs/                          # All documentation
│   ├── whitepaper/WHITEPAPER.md  # Foundational narrative
│   ├── tokenomics/TOKENOMICS.md  # Supply, distribution, burn
│   ├── game-design/GDD.md        # Mechanics, economy, progression
│   ├── roadmap/ROADMAP.md        # 6-month milestone plan
│   ├── marketing/                # Twitter & Discord strategy
│   └── airdrop/AIRDROP_PLAN.md   # Airdrop distribution plan
│
├── programs/                      # Anchor smart contracts
│   └── minelegends/
│       ├── Cargo.toml            # Rust deps
│       ├── src/
│       │   ├── lib.rs            # 6 instructions
│       │   ├── state.rs          # 5 account types
│       │   ├── instructions.rs   # Account constraints
│       │   ├── constants.rs      # Tunable parameters
│       │   └── errors.rs         # Error codes
│       └── README.md             # Build & deploy guide
│
├── web/                          # Next.js landing + web app
│   ├── app/
│   │   ├── page.tsx              # Landing page
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   └── dashboard/page.tsx    # Web app (post-wallet)
│   ├── components/               # 9 React components
│   ├── lib/                      # Wallet + program config
│   ├── public/docs/              # Copied docs for landing links
│   ├── package.json
│   └── README.md
│
├── tests/
│   └── minelegends.ts            # Anchor integration tests
│
├── Anchor.toml                   # Anchor workspace config
├── Cargo.toml                    # Rust workspace
└── README.md (this file)
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Rust 1.96+ (installed: ✅)
- Solana CLI 1.18+ ([install guide](https://docs.solana.com/cli/install-solana-cli-tools))
- Anchor 0.30+ ([install guide](https://www.anchor-lang.com/docs/installation))

### 1. Smart Contract (Anchor)

```bash
# Install deps
cargo build-bpf
# or
anchor build

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Test
anchor test
```

### 2. Web App (Next.js)

```bash
cd web
npm install
cp .env.example .env.local
npm run dev
# → http://localhost:3000
```

### 3. Build for Production

```bash
cd web
npm run build
npm start
```

---

## 📚 Documentation

| Doc | Purpose |
|---|---|
| [WHITEPAPER.md](./docs/whitepaper/WHITEPAPER.md) | Full whitepaper (12.4KB) |
| [TOKENOMICS.md](./docs/tokenomics/TOKENOMICS.md) | $MNLG supply, burn, vesting |
| [GDD.md](./docs/game-design/GDD.md) | Game design document (12.7KB) |
| [ROADMAP.md](./docs/roadmap/ROADMAP.md) | 6-month plan |
| [CONTENT_CALENDAR.md](./docs/marketing/twitter/CONTENT_CALENDAR.md) | 30-day X content |
| [SERVER_STRUCTURE.md](./docs/marketing/discord/SERVER_STRUCTURE.md) | Discord setup |
| [AIRDROP_PLAN.md](./docs/airdrop/AIRDROP_PLAN.md) | Airdrop distribution |

---

## 🎮 Game Overview

### Core Loop
> Mine $MNLG with skill → burn for character NFTs → battle PvP → win token pools → repeat

### 5 Character Classes
- **Miner** — Pure mining, +50% auto-mine
- **Warrior** — Melee PvP, first strike
- **Mage** — Ranged PvP, mana shield
- **Engineer** — Crafter, -50% repair
- **Alchemist** — Buffer, +25% ally mining

### 3 Rarities
- **Common** (60%) — 1,000 $MNLG
- **Rare** (30%) — 10,000 $MNLG
- **Legendary** (10%) — 100,000 $MNLG

### Game Modes
- **Idle Mining** — Auto-mine while offline (cap 168h)
- **Gem Rush** — Skill-based 60s puzzle, every 4h
- **PvP Arena** — Stake, match, winner takes 90%
- **PvE Dungeon** — Solo, 5 difficulty levels
- **Tournaments** — Daily/weekly/monthly prize pools

---

## 💰 Tokenomics Summary

| Allocation | % | Vesting |
|---|---|---|
| Community rewards | 35% | 4yr linear |
| Treasury DAO | 20% | 12mo cliff + 4yr |
| Public sale | 15% | unlocked at TGE |
| Team | 10% | 12mo cliff + 4yr |
| Initial liquidity | 10% | 24mo locked |
| Advisors/KOLs | 5% | 6mo cliff + 2yr |
| Partnerships | 5% | per agreement |

**Total Supply:** 1,000,000,000 $MNLG
**Decimals:** 9 (SPL standard)
**Initial Circulating:** ~80M (8%)

**Burn rate:** 50-100% per action (deflationary at scale)

---

## 🗓 Roadmap (6 months)

- **Month 1** — Devnet (internal alpha)
- **Month 2** — Testnet Alpha (100 users)
- **Month 3** — Testnet Beta (10K users, airdrop)
- **Month 4** — Mainnet pre-launch (audit)
- **Month 5** — Mainnet launch (TGE)
- **Month 6** — CEX listing, mobile, scale

---

## 🛠 Tech Stack

- **Blockchain:** Solana
- **Smart Contract:** Anchor 0.30 (Rust)
- **Token Standard:** SPL + Metaplex
- **Frontend:** Next.js 14, TypeScript, Tailwind
- **Wallet:** Phantom, Solflare
- **State:** On-chain PDAs + off-chain indexer (Supabase)
- **Game Engine:** Phaser.js (v1), R3F (v2)
- **Backend:** Node.js + Fastify

---

## 👤 Founder

**Riz (draycolix)** — Solo dev, full-stack
- GitHub: [@draycolix](https://github.com/draycolix)
- Twitter: [@draycolix](https://x.com/draycolix)
- Previous: SolReadLater MVP, 4 PRs in Solana ecosystem

---

## 📄 License

- **Code:** MIT
- **Documentation:** CC BY-SA 4.0
- **Token:** $MNLG is a utility token, not a security. Not financial advice.

---

## 🤝 Contributing

Currently solo dev. Open to:
- Bug reports (GitHub Issues)
- Feature requests (Discussions)
- PRs (after launch)

After launch:
- Smart contract audit collaboration
- Game art (pixel/low-poly)
- Community moderators

---

## 📞 Contact

- **Email:** draycolix@gmail.com
- **Twitter:** @draycolix
- **GitHub:** github.com/draycolix
- **Discord:** (TBD — see roadmap Month 1)

---

## ⚠️ Disclaimer

MineLegends is in early development. Nothing here is financial advice. $MNLG is a utility token for use within the MineLegends game. It is not a security, investment, or profit-sharing instrument. Token value may go to zero. Play responsibly.
