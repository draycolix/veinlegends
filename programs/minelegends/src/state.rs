use anchor_lang::prelude::*;

#[account]
pub struct GameState {
    pub admin: Pubkey,                    // 32
    pub total_players: u64,               // 8
    pub total_characters_minted: u64,     // 8
    pub total_burned: u64,                // 8 - in raw $MNLG
    pub total_mined: u64,                 // 8 - in raw $MNLG
    pub mint_authority_bump: u8,          // 1
    pub pool_authority_bump: u8,          // 1
    pub bump: u8,                         // 1
    pub _reserved: [u8; 64],              // 64 - future use
}

impl GameState {
    pub const SIZE: usize = 32 + 8 + 8 + 8 + 8 + 1 + 1 + 1 + 64;
}

#[account]
pub struct Player {
    pub authority: Pubkey,                // 32
    pub username: String,                 // 4 + 32 (max 32 chars)
    pub level: u16,                       // 2
    pub xp: u64,                          // 8
    pub total_mined: u64,                 // 8
    pub total_burned: u64,                // 8
    pub last_claim_time: i64,             // 8
    pub last_mint_time: i64,              // 8
    pub daily_mint_count: u8,             // 1
    pub referral_count: u16,              // 2
    pub mining_rate_multiplier: u64,      // 8 - in percent (100 = 1x)
    pub bump: u8,                         // 1
    pub _reserved: [u8; 32],              // 32
}

impl Player {
    pub const SIZE: usize = 32 + (4 + 32) + 2 + 8 + 8 + 8 + 8 + 8 + 1 + 2 + 8 + 1 + 32;
}

#[account]
pub struct Character {
    pub owner: Pubkey,                    // 32
    pub class: CharacterClass,            // 1 (enum)
    pub rarity: Rarity,                   // 1 (enum)
    pub level: u8,                        // 1
    pub xp: u64,                          // 8
    pub mining_power: u32,                // 4
    pub battle_power: u32,                // 4
    pub created_at: i64,                  // 8
    pub last_battle_at: i64,              // 8
    pub bump: u8,                         // 1
    pub _reserved: [u8; 32],              // 32
}

impl Character {
    pub const SIZE: usize = 32 + 1 + 1 + 1 + 8 + 4 + 4 + 8 + 8 + 1 + 32;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, Debug, PartialEq, Eq)]
pub enum CharacterClass {
    Miner = 0,
    Warrior = 1,
    Mage = 2,
    Engineer = 3,
    Alchemist = 4,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, Debug, PartialEq, Eq)]
pub enum Rarity {
    Common = 0,
    Rare = 1,
    Legendary = 2,
}

#[account]
pub struct Tournament {
    pub id: u32,                          // 4
    pub entries: Vec<TournamentEntry>,    // 4 + 100 * (32 + 8 + 8 + 4) = 4 + 5200 (max 100)
    pub total_pool: u64,                  // 8
    pub start_time: i64,                  // 8
    pub end_time: i64,                    // 8
    pub settled: bool,                    // 1
    pub bump: u8,                         // 1
    pub _reserved: [u8; 32],              // 32
}

impl Tournament {
    pub const SIZE: usize = 4 + (4 + 100 * 52) + 8 + 8 + 8 + 1 + 1 + 32;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, Debug)]
pub struct TournamentEntry {
    pub player: Pubkey,                   // 32
    pub entry_fee: u64,                   // 8
    pub joined_at: i64,                   // 8
    pub rank: u16,                        // 2 (0 = unranked)
    pub _padding: [u8; 2],                // 2
}

#[account]
pub struct Battle {
    pub id: u32,                          // 4
    pub player1: Pubkey,                  // 32
    pub player2: Pubkey,                  // 32
    pub player1_char: Character,          // Character SIZE
    pub player2_char: Character,          // Character SIZE
    pub stake: u64,                       // 8
    pub winner: Option<Pubkey>,           // 1 + 32
    pub settled: bool,                    // 1
    pub created_at: i64,                  // 8
    pub bump: u8,                         // 1
}

impl Battle {
    // Use a smaller size — we'll pass character as separate accounts
    pub const SIZE: usize = 4 + 32 + 32 + 8 + 33 + 1 + 8 + 1;
}
