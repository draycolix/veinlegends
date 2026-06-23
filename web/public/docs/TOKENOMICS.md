# $MNLG Tokenomics v1.0

**Last updated:** June 23, 2026

---

## 1. Token Specs

| Field | Value |
|---|---|
| Ticker | $MNLG |
| Network | Solana (SPL Token) |
| Decimals | 9 |
| Total Supply | 1,000,000,000 (1B) |
| Initial Circulating | ~80M (8%) |
| Mint Authority | DAO-controlled (multi-sig) post-launch |
| Freeze Authority | Disabled post-launch |
| Update Authority | DAO-controlled |

---

## 2. Supply Distribution

```
Community rewards:     35%  (350M)  → 4-year linear unlock
Treasury DAO:          20%  (200M)  → 12-month cliff + 48-month linear
Public sale:           15%  (150M)  → unlocked at TGE
Team:                  10%  (100M)  → 12-month cliff + 48-month linear
Initial liquidity:     10%  (100M)  → locked 24 months (Streamflow)
Advisors/KOLs:         5%   (50M)   → 6-month cliff + 24-month linear
Partnerships:          5%   (50M)   → per-agreement
```

**Visual:**
```
Community  ████████████████████████████████████  35%
Treasury   ████████████████████  20%
Public     ███████████████  15%
Team       ██████████  10%
Liquidity  ██████████  10%
Advisors   █████  5%
Partners   █████  5%
```

---

## 3. Vesting Schedule

| Allocation | Cliff | Vesting Period | Total Lock |
|---|---|---|---|
| Public sale | 0 months | 0 months | 0 |
| Liquidity | 0 months | 24 months (linear) | 24 months |
| Community | 6 months | 48 months (linear, starts at month 6) | 54 months |
| Treasury | 12 months | 48 months (linear, starts at month 12) | 60 months |
| Team | 12 months | 48 months (linear, starts at month 12) | 60 months |
| Advisors | 6 months | 24 months (linear, starts at month 6) | 30 months |

**Month-by-month emission (approximate):**
- Month 1 (TGE): ~80M (8%) circulating
- Month 6: ~120M (12%) circulating
- Month 12: ~180M (18%) circulating
- Month 24: ~340M (34%) circulating
- Month 60: 100% circulating (1B)

---

## 4. Burn Mechanisms

### 4.1 Burn Rate by Action

| Action | % Burned of Payment | Per-Use Cost (avg) | Annual Volume (est 50K MAU) |
|---|---|---|---|
| Buy character | 80% | 50,000 $MNLG | 25,000M (2.5B) burned |
| Upgrade character | 60% | 100 $MNLG | 5,000M (500M) burned |
| Tournament entry | 50% | 100 $MNLG | 1,000M (100M) burned |
| Repair equipment | 100% | 5 $MNLG | 50M (5M) burned |
| Fast-track queue | 100% | 50 $MNLG | 100M (10M) burned |
| Custom name | 100% | 1,000 $MNLG | 10M (1M) burned |
| Respec stats | 100% | 200 $MNLG | 20M (2M) burned |
| Marketplace fee | 100% | 2% of sale | 200M (20M) burned |

**Total annual burn target (Year 1, 50K MAU):** ~3.15B $MNLG burned

**But:** Only a fraction of burned tokens come from the circulating supply; the rest is "virtual burn" (from newly mined tokens, not from supply reduction).

**Net deflation calculation:**
- Annual emission: 60M $MNLG (5M/month × 12)
- Annual burn (real, from circulating): ~30% of emission
- Net result: **Net deflationary** if 50K+ MAU

### 4.2 Deflationary Pressure Formula

```
Net Supply Change = Monthly Emission - (Active Users × Avg Burn per User)
                  = 5M - (50,000 × X)
```

If avg burn per user per month is **> 0.1 $MNLG**, the economy is deflationary.

At 50K MAU: needs 5M / 50K = 100 $MNLG burned per user per month = 3 $MNLG/day.

**Estimated real burn per user per day:** 5-20 $MNLG (from tournament entries + repair + upgrades).

**Conclusion:** Deflationary at 50K+ MAU. Likely inflationary below 10K MAU (bootstrap phase).

---

## 5. Emission Schedule

### 5.1 Mining Pool (35% of total = 350M $MNLG)

| Year | Monthly Emission | Notes |
|---|---|---|
| Year 1 | 5,000,000 | Bootstrap, low competition |
| Year 2 | 3,500,000 | After 30% decay event |
| Year 3 | 2,500,000 | Second decay event |
| Year 4+ | 1,000,000 | Sustainable long-term rate |

**Decay events:** Every 3 months, base mining rate drops 30% (smooth, not cliff). This forces early participation.

### 5.2 Tournament Rewards (3% of treasury allocation, 60M $MNLG)

- Released quarterly, 15M per quarter
- Distributed: 60% to top 3, 30% to top 10, 10% to top 100
- Reset each season

### 5.3 Airdrops (5% of community allocation, 17.5M $MNLG)

- Testnet users: 10,000 $MNLG per active wallet (subject to anti-sybil)
- Community contributors: 1,000-50,000 $MNLG based on tier
- Marketing campaigns: variable, capped at 5% of total

---

## 6. Liquidity Strategy

### 6.1 Initial Liquidity (Month 5, TGE)

- **Source A:** 10% of supply (100M $MNLG)
- **Source B:** User-contributed SOL (~$50K-100K from community)
- **Total initial liquidity:** $200K-500K equivalent

**Deployment:**
- Raydium AMM pool (MNLG/SOL): 70% of liquidity
- OpenBook order book: 30% of liquidity (for price discovery)
- LP tokens locked 24 months via Streamflow

### 6.2 Post-Launch Liquidity Management

- 30% of in-game revenue → buy $MNLG from market → add to LP
- Treasury can add liquidity during low-volume periods
- Burn 50% of buyback $MNLG, keep 50% in LP

---

## 7. Treasury Management

**Treasury holdings:** 200M $MNLG (20% of supply)

**Vesting:** 12-month cliff, then 48-month linear (5M $MNLG per month starting month 13)

**Spending categories (DAO voted):**
- Development: 40% (audits, contractors, tools)
- Marketing: 30% (KOL, content, events)
- Operations: 15% (server, infrastructure)
- Legal: 10% (compliance, jurisdictions)
- Reserve: 5% (emergency fund)

**Multi-sig:** 5-of-9 Gnosis Safe (Solana Squads) with public addresses.

---

## 8. Governance

**Voting power:** 1 $MNLG = 1 vote (or quadratic option for anti-whale)

**Proposal threshold:** 100,000 $MNLG (to prevent spam)

**Quorum:** 4% of circulating supply

**Voting period:** 7 days

**Execution delay:** 48 hours after vote passes (security)

**Votable parameters (bounded):**
- New character class additions
- New battle mode additions
- Economic parameter tweaks (within ±30% of current)
- Treasury allocation (above $50K)
- Partnerships (above $100K value)

**Out of scope (founder veto, but DAO can override):**
- Smart contract upgrades
- Token supply changes
- Mint authority changes
- Emergency pause/unpause

---

## 9. Anti-Whale Mechanisms

To prevent whale dominance:
1. **Quadratic voting** option (cost: √votes instead of votes)
2. **Diminishing returns** in tournaments (top 100 share, but capped at $1M per wallet)
3. **Daily cap** on character purchases (max 3 per day per wallet)
4. **Marketplace cap** on character sales (max 10% of supply in single transaction)
5. **Sybil resistance** via airdrop (1 wallet = 1 airdrop, verified via signature)

---

## 10. Economic Sustainability Model

### 10.1 Revenue Streams

| Stream | Source | Token Flow |
|---|---|---|
| Tournament entry fees | 50% of entry | Burn 50%, keep 50% to prize pool |
| Marketplace fees | 2% of sale | 100% burn |
| Character sales (revenue share) | 5% of new character mint | 100% burn |
| Premium subscription | $5/month | Off-chain revenue, 30% buyback-and-burn |
| NFT character sales | 100% of mint | 80% burn, 20% to artist/team |

### 10.2 Buyback-and-Burn Trigger

Monthly revenue > $50K → trigger buyback-and-burn:
- Buy $MNLG from DEX up to 30% of monthly revenue
- Send 100% of bought $MNLG to burn address

**Target:** $1M+ burned via buyback in Year 1 (if successful).

### 10.3 Long-term Sustainability

- Year 1: Bootstrap, likely inflationary (focus on growth)
- Year 2: Deflationary at 50K+ MAU
- Year 3+: Sustainable at 100K+ MAU
- Year 5+: Mature economy, treasury self-sustaining

---

## 11. Comparison to Existing Models

| Project | Model | Inflation Risk | MineLegends Advantage |
|---|---|---|---|
| Notcoin | Tap only | High (35M users) | Skill-based + battle depth |
| Hamster Kombat | Tap + simple game | High (300M users) | True deflationary + NFT roster |
| Pixels | Farm + chat | Medium | Cleaner tokenomics, no P2E promise |
| Big Time | Play RPG | Medium | Solana (cheaper), lower barrier |
| STEPN | Move-to-earn | High (collapsed) | Multi-sink, not single-reward |

---

## 12. Conclusion

$MNLG is designed to be a **deflationary game utility token** with multiple burn sinks, governance, and treasury backing. The model is intentionally conservative to survive market downturns and provide a sustainable foundation for years, not months.

The key differentiator: **MNLG is needed for the game to function**, not just for speculation. This creates intrinsic demand independent of market sentiment.
