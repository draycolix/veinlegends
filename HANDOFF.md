# MineLegends — Handoff

**Date:** June 23, 2026
**Status:** v0.1.0 (foundation complete)
**Repo:** https://github.com/draycolix/minelegends
**Live pages:** Pending deployment (Next.js build)

---

## ✅ Yang Sudah Selesai

### 📚 Documentation (7 files, ~70KB)
- `docs/whitepaper/WHITEPAPER.md` (12.4KB) — Full narrative
- `docs/tokenomics/TOKENOMICS.md` (8.6KB) — Supply, distribution, burn
- `docs/game-design/GDD.md` (12.7KB) — Mechanics, economy, progression
- `docs/roadmap/ROADMAP.md` (8.2KB) — 6-month plan
- `docs/marketing/twitter/CONTENT_CALENDAR.md` (8.3KB) — 30 days of X content
- `docs/marketing/discord/SERVER_STRUCTURE.md` (8KB) — 24 channels, 8 roles
- `docs/airdrop/AIRDROP_PLAN.md` (7.6KB) — 5 tiers, anti-sybil, Merkle

### 🔐 Smart Contract (6 files, Anchor + Rust)
- `programs/minelegends/src/lib.rs` — 6 instructions
- `programs/minelegends/src/state.rs` — 5 account types
- `programs/minelegends/src/instructions.rs` — Account constraints
- `programs/minelegends/src/constants.rs` — Tunables
- `programs/minelegends/src/errors.rs` — Error codes
- `programs/minelegends/Cargo.toml` — Rust deps
- `tests/minelegends.ts` — Anchor integration tests

### 🌐 Web App (Next.js 14 + TypeScript + Tailwind)
- `web/app/page.tsx` — Landing (8 sections)
- `web/app/dashboard/page.tsx` — Web app (post-wallet)
- `web/components/` — 9 components (Hero, Navbar, Stats, Gameplay, Characters, Tokenomics, Roadmap, CTA, Footer)
- `web/lib/wallet-provider.tsx` — Phantom + Solflare
- `web/lib/program.ts` — Solana program config
- `web/public/docs/` — All 4 docs copied for landing links
- `web/package.json` + `web/tsconfig.json` + `web/next.config.js` + `web/tailwind.config.ts` + `web/postcss.config.js`

### 🚀 Git
- ✅ Repo: https://github.com/draycolix/minelegends
- ✅ Commit: 79dd1c4
- ✅ 47 files pushed

---

## ⚠️ Yang Belum / Butuh User Action

### 1. Install Solana + Anchor tools (WAJIB)
Smart contract gak akan compile tanpa tools ini. Install di Windows:

```bash
# 1. Install Rust (✅ udah ada)
rustc --version  # should show 1.96.0

# 2. Install Solana CLI 1.18.x (Windows binary)
# Download dari: https://github.com/anza-xyz/agave/releases
# Cari: solana-release-x86_64-pc-windows-msvc.tar.bz2
# Extract ke: C:\Users\04riz\solana\
# Add to PATH: C:\Users\04riz\solana\bin

# 3. Install Anchor
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest

# 4. Verify
solana --version
anchor --version
```

### 2. Test smart contract locally
```bash
cd ~/projects/minelegends
solana-keygen new -o ~/.config/solana/id.json
solana airdrop 2 --url devnet
anchor build
anchor test --provider.cluster devnet
```

### 3. Deploy ke devnet
```bash
anchor deploy --provider.cluster devnet
# Note the program ID, update Anchor.toml
```

### 4. Install + build web app
```bash
cd ~/projects/minelegends/web
npm install
npm run build  # verify production build works
npm run dev    # http://localhost:3000
```

**Known issue:** Pakai `@coral-xyz/anchor` (bukan `anchor` — itu nama lama)

### 5. Deploy landing ke Vercel
- Sign in ke vercel.com pakai GitHub
- Import repo `draycolix/minelegends`
- Set root directory: `web`
- Set env: `NEXT_PUBLIC_NETWORK=devnet`
- Deploy
- Note: Vercel otomatis detect Next.js

### 6. Create social accounts
- Twitter/X: @minelegends (atau @draycolix_backup)
- Discord: setup pakai struktur di `docs/marketing/discord/SERVER_STRUCTURE.md`
- Telegram: opsional, untuk SEA community

### 7. Apply ke hackathon/grant
- **Solana Hyperdrive** (kalau masih buka): https://hyperdrive.superteam.fun
- **Solana Foundation Grant**: pakai `WHITEPAPER.md` + roadmap
- **Helius Builder Grant**: $5K + RPC credits
- **Bonk Ecosystem**: $5K-20K

### 8. Pre-testnet checklist
- [ ] Solana tools installed
- [ ] Anchor build successful
- [ ] Web app deployed ke Vercel
- [ ] Twitter + Discord live
- [ ] First thread: "Why I built MineLegends" (Day 1 content)
- [ ] Invite 10 friends ke Discord

---

## 🔄 Kalau Stuck

### Smart contract gak compile
1. Check Rust version: `rustc --version` (should be 1.96+)
2. Check Anchor version: `anchor --version` (should be 0.30+)
3. Check Solana version: `solana --version` (should be 1.18+)
4. Re-install Anchor: `avm install latest && avm use latest`
5. Clean: `anchor clean && anchor build`

### Web app gak build
1. Check Node version: `node --version` (should be 18+)
2. Check npm: `npm --version`
3. Delete lockfile: `rm package-lock.json && npm install`
4. Check TypeScript: `npx tsc --noEmit`
5. Re-install: `rm -rf node_modules && npm install`

### Push ke GitHub gagal
- Token mungkin expired, regenerate di https://github.com/settings/tokens
- Use fine-grained token dengan `contents: write`

---

## 📊 Quick Stats

| Metric | Value |
|---|---|
| Total files | 47 |
| Total LOC | ~3,500 (estimated) |
| Docs | 7 files, ~70KB |
| Smart contract | 6 Rust files, ~900 LOC |
| Web app | 13 files, ~1,500 LOC |
| Components | 9 React components |
| GitHub commit | 79dd1c4 |
| Repo URL | https://github.com/draycolix/minelegends |

---

## 🎯 Next 7 Days Action Plan

### Day 1 (today)
- [ ] Read `WHITEPAPER.md` (15 min)
- [ ] Read `TOKENOMICS.md` (10 min)
- [ ] Read `ROADMAP.md` (10 min)
- [ ] Install Solana + Anchor tools (1 hour)

### Day 2
- [ ] Run `anchor build` — fix any errors
- [ ] Run `anchor test` — verify tests pass
- [ ] Deploy to devnet
- [ ] Update program ID in `web/lib/program.ts`

### Day 3
- [ ] Run `npm install` di web/
- [ ] Run `npm run build` — fix any errors
- [ ] Run `npm run dev` — test landing di browser
- [ ] Connect wallet, test dashboard

### Day 4
- [ ] Deploy landing ke Vercel
- [ ] Buy domain `minelegends.xyz` (~$12)
- [ ] Setup Cloudflare (gratis)
- [ ] Connect domain ke Vercel

### Day 5
- [ ] Create Twitter account @minelegends
- [ ] Create Discord server pakai struktur di docs
- [ ] Tweet Day 1 thread (sudah ada di CONTENT_CALENDAR.md)
- [ ] Invite 10 friends

### Day 6
- [ ] Apply Solana Foundation Grant (copy dari WHITEPAPER.md)
- [ ] Apply Helius Builder Grant
- [ ] Apply Solana Hyperdrive hackathon (kalau masih buka)
- [ ] DM 5 KOLs (template di CONTENT_CALENDAR.md)

### Day 7
- [ ] Recap week 1, write status update
- [ ] Plan week 2
- [ ] Rest 😅

---

## 💡 Pro Tips

1. **Jangan polish landing page dulu.** Yang penting deployed & live. Polish nanti.
2. **Community > product di Week 1-2.** Twitter + Discord dulu, baru improve product.
3. **Testnet = sand box.** Gak perlu perfect. Yang penting ada player yang coba.
4. **Konsisten > viral.** 1 tweet/hari > 10 tweets terus stop.
5. **Jangan jualan di Twitter.** Bantu orang dulu, orang akan tanya sendiri.

---

## 📞 Butuh Bantuan?

Tanya gua kapan aja. Issues umum:
- Solana install: cek PATH, download binary manual
- Anchor build: cek Rust version
- npm install: pakai `--legacy-peer-deps` kalau error
- Deploy Vercel: pilih framework "Next.js" auto-detect

Good luck! ⛏
