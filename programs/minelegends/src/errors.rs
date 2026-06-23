use anchor_lang::prelude::*;

#[error_code]
pub enum GameError {
    #[msg("Username must be 32 characters or less")]
    UsernameTooLong,
    
    #[msg("Daily mint limit reached (3 per day)")]
    DailyMintLimitReached,
    
    #[msg("Claim amount exceeds maximum per transaction")]
    ClaimTooLarge,
    
    #[msg("Must wait at least 1 hour between claims")]
    TooEarlyToClaim,
    
    #[msg("Claim amount exceeds expected mining accumulation")]
    ExcessiveClaim,
    
    #[msg("Character has reached max level (50)")]
    MaxLevelReached,
    
    #[msg("You don't own this character")]
    NotCharacterOwner,
    
    #[msg("Tournament entry fee too low (min 10 $MNLG)")]
    EntryFeeTooLow,
    
    #[msg("Tournament entry fee too high (max 1000 $MNLG)")]
    EntryFeeTooHigh,
    
    #[msg("Battle has already been settled")]
    BattleAlreadySettled,
    
    #[msg("Insufficient token balance")]
    InsufficientBalance,
    
    #[msg("Invalid class or rarity combination")]
    InvalidCharacterSpec,
    
    #[msg("Player account already exists")]
    PlayerAlreadyExists,
    
    #[msg("Game state already initialized")]
    AlreadyInitialized,
    
    #[msg("Unauthorized access")]
    Unauthorized,
    
    #[msg("Tournament is full")]
    TournamentFull,
    
    #[msg("Invalid tournament state")]
    InvalidTournamentState,
}
