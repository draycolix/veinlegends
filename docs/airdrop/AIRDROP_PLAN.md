# MineLegends Airdrop Plan

**Total allocation:** 5% of community rewards (17,500,000 $MNLG)
**Distribution target:** 50,000 wallets
**Average per wallet:** 350 $MNLG (with tier multipliers)
**Timeline:** Testnet snapshot (Month 3) → Mainnet distribution (Month 5)

---

## Airdrop Structure

### Tier 1: Testnet Heroes (60% = 10.5M $MNLG)
**For:** Active testnet players (Month 2-3)
**Allocation:** 210 $MNLG base + bonuses
**Wallet count:** ~10,000
**Criteria:**
- Connected Solana wallet
- Initialized player account
- Played at least 1 battle
- Minimum 5 total transactions (anti-spam)

**Bonuses:**
- +50% for playing 30+ days
- +100% for top 1,000 players (by mining + battle score)
- +200% for finding critical bugs (verified)
- +300% for first 100 players (OG bonus)

### Tier 2: Community Builders (15% = 2.625M $MNLG)
**For:** Discord moderators, content creators, KOLs
**Allocation:** 1,000-50,000 $MNLG per contributor
**Wallet count:** ~200
**Criteria:**
- 30+ days active in Discord
- 100+ messages or 10+ quality posts
- Community-vouched (mod/admin nomination)

### Tier 3: KOL & Partners (15% = 2.625M $MNLG)
**For:** Influencers, gaming guilds, partner projects
**Allocation:** 5,000-100,000 $MNLG
**Wallet count:** ~30
**Criteria:**
- Promoted MineLegends (thread, video, mention)
- Minimum 10K reach
- Genuine engagement (not paid spam)
- 6-month vesting (claim monthly)

### Tier 4: Bug Bounty (5% = 875K $MNLG)
**For:** Security researchers, bug reporters
**Allocation:** Based on severity
**Wallet count:** ~50

| Severity | Reward | Examples |
|---|---|---|
| Critical | 50,000 $MNLG | Drain contract, mint exploit |
| High | 10,000 $MNLG | Bypass burn, double spend |
| Medium | 2,000 $MNLG | Frontend XSS, broken state |
| Low | 500 $MNLG | UI bugs, typos |

### Tier 5: Retroactive (5% = 875K $MNLG)
**For:** Early GitHub contributors, design feedback
**Allocation:** 500-10,000 $MNLG
**Wallet count:** ~50

---

## Anti-Sybil Measures

### Wallet Verification
- 1 Discord = 1 wallet (linked via signature)
- 1 Twitter = 1 wallet (linked via OAuth + signature)
- 1 GitHub = 1 wallet (linked via OAuth + signature)
- Each wallet needs ≥2 of: Discord, Twitter, GitHub, .edu email

### Activity Thresholds
- **Discord:** Must have 14+ days account age, 100+ messages
- **Twitter:** Must have 30+ days account age, 100+ followers
- **GitHub:** Must have repo >30 days old, 10+ contributions

### Fingerprint Detection
- **IP tracking:** Flag if >3 wallets from same IP
- **Device fingerprint:** Flag if >3 wallets from same device
- **Behavioral:** Flag if mining pattern too regular (bot-like)

### Economic Anti-Sybil
- **Stake requirement:** Must hold 100+ $MNLG to claim (dust attack prevention)
- **Vesting:** 50% unlocked at TGE, 50% vested over 6 months
- **Activity decay:** Unclaimed after 12 months = sent to treasury

### Reporting
- Community can report sybils via #sybil-report
- 3+ reports = automatic review
- 50% slash if confirmed sybil
- Appeals via DAO vote (if >100K $MNLG)

---

## Distribution Schedule

### Phase 1: Snapshot (Testnet End - Month 3)
- Snapshot all testnet player accounts
- Score based on: level, mining, battles, bug reports
- Generate eligibility list (off-chain)
- Publish list publicly (community can review)

### Phase 2: Verification (Mainnet Pre-Launch - Month 4)
- Community review period (7 days)
- Sybil report window
- Final eligibility list published
- Distribution contract deployed

### Phase 3: TGE Distribution (Mainnet Launch - Month 5)
- 50% of airdrop distributed at TGE
- Distribution via Merkle tree (gas efficient)
- Claim window: 30 days

### Phase 4: Vesting (Months 5-11)
- Remaining 50% vested over 6 months
- Linear unlock (1/180 per day)
- Claim any time after unlock
- Unclaimed after Month 11 → treasury

---

## Technical Implementation

### Snapshot Tool
```bash
# Custom script using Solana RPC
# Queries all player accounts, scores them, exports CSV
# Off-chain computation (gas-free)
```

### Eligibility List
- CSV with columns: wallet, tier, base_amount, bonus_amount, total
- Public on IPFS (immutable)
- Mirrored on GitHub (verifiable)

### Distribution Contract (Anchor)
```rust
pub fn claim_airdrop(
    ctx: Context<ClaimAirdrop>,
    merkle_proof: Vec<[u8; 32]>,
    leaf: [u8; 32],
    amount: u64,
) -> Result<()> {
    // Verify merkle proof
    // Check leaf matches claimed wallet
    // Check not already claimed
    // Transfer $MNLG to user
    // Mark as claimed
}
```

### Merkle Tree
- Standard Merkle tree (OpenZeppelin-style)
- Leaves: hash(wallet + amount)
- Off-chain construction
- On-chain verification (gas-efficient)

---

## Claim Flow

### Step 1: User checks eligibility
- Visit https://minelegends.xyz/airdrop
- Connect wallet
- If eligible, show "Claim X $MNLG"

### Step 2: Sign message (anti-bot)
- Sign "I claim MineLegends airdrop for {wallet}"
- Bot verification
- 1-time per wallet

### Step 3: Claim transaction
- On-chain claim via merkle proof
- Pays gas (~0.001 SOL)
- 50% unlocked, 50% vesting

### Step 4: Optional - Stake $MNLG
- Recommended: stake 100+ $MNLG to keep anti-sybil
- Earn 5-10% APY
- Vote in governance

---

## Marketing the Airdrop

### Pre-Snapshot (Month 1-2)
- "Testnet = guaranteed airdrop" messaging
- "Free to play, free to earn"
- Influencer partnerships

### Post-Snapshot (Month 3-4)
- "Check your eligibility" campaigns
- Twitter verification tool
- Discord verification flow

### At TGE (Month 5)
- Big announcement thread
- Airdrop claim guide
- "First 100 claimers get bonus NFT"

---

## Risk Mitigation

### Risk: Sybil attacks
**Mitigation:** 2-of-3 social verification, IP/device fingerprinting, 100 $MNLG stake requirement

### Risk: Dust attack
**Mitigation:** Minimum claim 100 $MNLG, gas cost > dust value

### Risk: Bot farming
**Mitigation:** Behavioral analysis, captcha, time-on-task

### Risk: Distribution fails
**Mitigation:** Manual backup distribution, 30-day claim window, treasury recovery

### Risk: Regulatory (airdrop = security?)
**Mitigation:** No profit promise, framed as "thank you for testing", KYC for >$1K equivalent

---

## KYC for Large Claims

For claims >$1,000 equivalent (at TGE price):
- KYC via Persona or Sumsub
- Government ID
- Liveness check
- Wallet ownership proof

**Why:** Regulatory safety, Bappebti compliance, future-proofing

---

## Success Metrics

| Metric | Target |
|---|---|
| Snapshot accuracy | 100% (no false negatives) |
| Claim rate | 80% (within 30 days) |
| Sybil detection | 95%+ (1K wallets flagged, 50K clean) |
| Community satisfaction | 4.5/5 (post-airdrop survey) |
| Repeat engagement | 50%+ claimers play Month 6+ |

---

## Post-Airdrop

### After TGE (Month 6+)
- Second airdrop announcement (TBD)
- Loyalty rewards for claimers who hold
- Staking incentives
- Governance rights

### Long-term
- Quarterly community rewards (separate from airdrop)
- Staking yield
- Governance participation
- "OG" status preserved forever

---

## FAQ

**Q: When is the snapshot?**
A: End of Month 3 (testnet beta end)

**Q: How much will I get?**
A: Base 210 $MNLG, up to 2,000+ $MNLG with bonuses

**Q: Do I need KYC?**
A: Only if claiming >$1,000 equivalent

**Q: What if I don't claim?**
A: 50% unlocked → claimed or lost after 12 months
   50% vested → continues vesting, claimable anytime

**Q: Can I claim twice?**
A: No, 1 wallet = 1 claim (anti-sybil)

**Q: What if I'm flagged as sybil?**
A: 50% slash, DAO can review

---

## Contact

- Airdrop questions: #airdrop-faq in Discord
- Bug reports: #sybil-report
- Appeals: airdrop@minelegends.xyz (after mainnet)
