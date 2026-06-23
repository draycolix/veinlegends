# MineLegends Landing & Web App

**Stack:** Next.js 14 · TypeScript · Tailwind CSS · Solana Wallet Adapter · Framer Motion

## What's Here

```
web/
├── app/
│   ├── layout.tsx       # Root layout, metadata, fonts
│   ├── page.tsx         # Landing page (marketing)
│   ├── globals.css      # Tailwind + custom CSS
│   └── dashboard/       # Web app (after wallet connect)
│       └── page.tsx
├── components/          # 9 components (Hero, Navbar, etc.)
├── lib/                 # Wallet provider + program config
├── public/
│   └── docs/            # Whitepaper, Tokenomics, GDD, Roadmap
└── package.json
```

## Pages

- **`/`** — Landing page (Hero, Stats, Gameplay, Characters, Tokenomics, Roadmap, CTA)
- **`/dashboard`** — Wallet-connected game dashboard (Idle Mining, Gem Rush, Character Shop)

## Local Development

```bash
# 1. Install
cd web
npm install

# 2. Set env (copy from .env.example)
cp .env.example .env.local

# 3. Run
npm run dev
# → http://localhost:3000
```

## Build

```bash
npm run build
npm start
```

## Sections (Landing Page)

1. **Hero** — Tagline, $MNLG ticker, CTA buttons
2. **Stats** — 4 key metrics (Supply, Burn, Classes, MAU target)
3. **Gameplay** — 6 feature cards (Mining, PvP, Tournaments, NFTs, Deflation, Guilds)
4. **Characters** — 5 character classes with stat bars
5. **Tokenomics** — Distribution chart + Burn mechanisms
6. **Roadmap** — 6-month phase timeline
7. **CTA** — Discord + Twitter + Testnet join
8. **Footer** — Links, disclaimer, social

## Tech Notes

- **Wallet:** Phantom + Solflare (extensible to Backpack, Glow, etc.)
- **Network:** Devnet default (set NEXT_PUBLIC_NETWORK=mainnet-beta for prod)
- **RPC:** Public devnet (set NEXT_PUBLIC_RPC_URL to Helius/QuickNode for production)
- **Animations:** Framer Motion (smooth, lightweight)
- **Styling:** Tailwind 3 + custom design tokens (gold/green mine theme)
- **Type-safe:** Full TypeScript strict mode
- **SSR-safe:** Client components gated by `mounted` flag

## Production Checklist

- [ ] Switch to mainnet-beta (NEXT_PUBLIC_NETWORK)
- [ ] Use Helius RPC (NEXT_PUBLIC_RPC_URL)
- [ ] Update $MNLG mint address (NEXT_PUBLIC_MNLG_MINT)
- [ ] Add real social links (X, Discord, Telegram)
- [ ] Add OG image (public/og.png)
- [ ] Add favicon
- [ ] Configure Vercel deployment
- [ ] Add Google Analytics / Plausible
- [ ] Setup error tracking (Sentry)
- [ ] Add CSP headers

## Deployment (Vercel recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Set environment variables in Vercel dashboard:
- `NEXT_PUBLIC_NETWORK` = mainnet-beta
- `NEXT_PUBLIC_RPC_URL` = https://mainnet.helius-rpc.com/?api-key=YOUR_KEY
- `NEXT_PUBLIC_MNLG_MINT` = <real mint address>
