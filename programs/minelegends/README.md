# MineLegends Anchor Program

**Status:** v0.1.0 (in development)
**Network:** Solana (devnet → mainnet)
**Framework:** Anchor 0.30.1
**Language:** Rust 1.96+

## What's Here

```
programs/minelegends/
├── Cargo.toml          # Rust dependencies
└── src/
    ├── lib.rs          # Program entry + 6 instructions
    ├── state.rs        # All account structs (GameState, Player, Character, Tournament, Battle)
    ├── instructions.rs # Account constraints for each instruction
    ├── constants.rs    # Tunable parameters
    └── errors.rs       # Custom error codes
```

## Instructions (6)

1. **initialize** — One-time game state setup by admin
2. **init_player** — Create player account (PDA per wallet)
3. **mint_character** — Buy character NFT (burn 80% of $MNLG)
4. **claim_mining** — Claim idle mining rewards (mints $MNLG)
5. **upgrade_character** — Level up character (burn 60% of $MNLG)
6. **enter_tournament** — Join tournament (burn 50% of $MNLG)
7. **settle_battle** — Auto-battle resolution (burn 10% to platform)

## State Accounts (5)

1. **GameState** (PDA) — Global state (admin, counters, bumps)
2. **Player** (PDA per wallet) — Username, level, XP, mining stats
3. **Character** (PDA) — Class, rarity, level, mining/battle power
4. **Tournament** (PDA per ID) — Entries, pool, time bounds
5. **Battle** (PDA per ID) — Players, stake, outcome

## Build & Deploy

```bash
# Build
anchor build

# Test (devnet)
anchor test

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Deploy to mainnet-beta
anchor deploy --provider.cluster mainnet
```

## Setup (Windows)

Install Rust, Solana CLI, Anchor:

```powershell
# 1. Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# 2. Install Solana CLI (use 1.18.x for stability)
curl -sSf https://release.anza.xyz/v1.18.26/install | sh

# 3. Add to PATH (add to .bashrc or restart terminal)
export PATH="$HOME/.cargo/bin:$HOME/.local/share/solana/install/active_release/bin:$PATH"

# 4. Install Anchor
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest

# 5. Verify
rustc --version
solana --version
anchor --version
```

## Testing

```bash
# Generate test keypair
solana-keygen new -o ~/.config/solana/id.json

# Airdrop devnet SOL
solana airdrop 2 --url devnet

# Build + test
anchor build
anchor test
```

## Security Notes

- **Audit pending:** Pre-mainnet, must be audited (OtterSec or Sec3)
- **Testnet phase:** Will run on devnet 2+ months before mainnet
- **Bug bounty:** $5K pool on testnet, $50K on Immunefi post-mainnet
- **Mint authority:** PDA-controlled, never admin key

## Token Economics (See TOKENOMICS.md)

- Total Supply: 1B $MNLG (9 decimals)
- Burn %: 50-100% per action (deflationary)
- Mining rate: 10 $MNLG/hour base, decays 30%/quarter
- Daily mint limit: 3 characters per wallet
- Max level: 50 (character), 100 (player)

## Roadmap

- [x] v0.1.0: Program scaffolding (current)
- [ ] v0.2.0: Full test coverage
- [ ] v0.3.0: Devnet deploy
- [ ] v0.4.0: Testnet stress test
- [ ] v0.5.0: Audit + fixes
- [ ] v1.0.0: Mainnet launch

## License

MIT
