/// MineLegends Program Constants
/// 
/// All magic numbers and tunables go here for easy adjustment.

/// Maximum $MNLG that can be claimed per single transaction (anti-drain)
pub const MAX_CLAIM_PER_TX: u64 = 10_000_000_000; // 10,000 $MNLG (with 9 decimals)

/// Base mining rate per hour (in $MNLG with 9 decimals)
/// 10 $MNLG per hour = 10_000_000_000 raw
pub const BASE_MINING_RATE_PER_HOUR: u64 = 10_000_000_000;

/// Minimum time between claim transactions (seconds)
pub const CLAIM_COOLDOWN_SECONDS: i64 = 3600; // 1 hour

/// Maximum offline mining accumulation (seconds)
/// 168 hours = 1 week
pub const MAX_OFFLINE_HOURS: i64 = 168;

/// Slippage allowed between expected and actual claim (raw amount)
pub const CLAIM_SLIPPAGE: u64 = 1_000_000_000; // 1 $MNLG

/// Maximum character level
pub const MAX_CHARACTER_LEVEL: u8 = 50;

/// Maximum player level
pub const MAX_PLAYER_LEVEL: u16 = 100;

/// XP per level (quadratic: 100 * level^2)
pub fn xp_required_for_level(level: u16) -> u64 {
    100u64.saturating_mul((level as u64).saturating_mul(level as u64))
}

/// Mining rate decay percentage every 3 months
pub const MINING_DECAY_PERCENT: u8 = 30;

/// Daily mint limit per wallet
pub const DAILY_MINT_LIMIT: u8 = 3;

/// Token decimals (matches SPL standard)
pub const TOKEN_DECIMALS: u8 = 9;

/// Total supply cap (1B $MNLG with 9 decimals)
pub const TOTAL_SUPPLY_CAP: u64 = 1_000_000_000_000_000_000;

/// Initial circulating supply (8% = 80M)
pub const INITIAL_CIRCULATING: u64 = 80_000_000_000_000_000;

/// Treasury seeds
pub const TREASURY_SEED: &[u8] = b"treasury";
pub const POOL_AUTHORITY_SEED: &[u8] = b"pool_authority";
pub const MINT_AUTHORITY_SEED: &[u8] = b"mint_authority";
pub const GAME_STATE_SEED: &[u8] = b"game_state";
pub const PLAYER_SEED: &[u8] = b"player";
pub const CHARACTER_SEED: &[u8] = b"character";
pub const TOURNAMENT_SEED: &[u8] = b"tournament";
pub const BATTLE_SEED: &[u8] = b"battle";
