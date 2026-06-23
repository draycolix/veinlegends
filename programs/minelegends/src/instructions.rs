use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};
use crate::state::*;

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = admin, space = 8 + GameState::SIZE, seeds = [b"game_state"], bump)]
    pub game_state: Account<'info, GameState>,
    
    /// CHECK: PDA used as mint authority
    #[account(seeds = [b"mint_authority"], bump)]
    pub mint_authority: AccountInfo<'info>,
    
    /// CHECK: PDA used as pool authority
    #[account(seeds = [b"pool_authority"], bump)]
    pub pool_authority: AccountInfo<'info>,
    
    #[account(mut)]
    pub admin: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitPlayer<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + Player::SIZE,
        seeds = [b"player", user.key().as_ref()],
        bump
    )]
    pub player: Account<'info, Player>,
    
    #[account(mut, seeds = [b"game_state"], bump)]
    pub game_state: Account<'info, GameState>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MintCharacter<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + Character::SIZE,
        seeds = [b"character", user.key().as_ref(), game_state.total_characters_minted.to_le_bytes().as_ref()],
        bump
    )]
    pub character: Account<'info, Character>,
    
    #[account(mut, seeds = [b"player", user.key().as_ref()], bump)]
    pub player: Account<'info, Player>,
    
    #[account(mut, seeds = [b"game_state"], bump)]
    pub game_state: Account<'info, GameState>,
    
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub treasury_token_account: Account<'info, TokenAccount>,
    
    /// CHECK: Treasury PDA
    pub treasury: AccountInfo<'info>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ClaimMining<'info> {
    #[account(mut, seeds = [b"player", user.key().as_ref()], bump)]
    pub player: Account<'info, Player>,
    
    #[account(mut, seeds = [b"game_state"], bump)]
    pub game_state: Account<'info, GameState>,
    
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    
    /// CHECK: PDA used as mint authority
    #[account(seeds = [b"mint_authority"], bump)]
    pub mint_authority: AccountInfo<'info>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct UpgradeCharacter<'info> {
    #[account(mut, seeds = [b"character", character.owner.as_ref(), &[character.created_at as u8]], bump)]
    pub character: Account<'info, Character>,
    
    #[account(mut, seeds = [b"player", user.key().as_ref()], bump)]
    pub player: Account<'info, Player>,
    
    #[account(mut, seeds = [b"game_state"], bump)]
    pub game_state: Account<'info, GameState>,
    
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub treasury_token_account: Account<'info, TokenAccount>,
    
    /// CHECK: Treasury PDA
    pub treasury: AccountInfo<'info>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
#[instruction(tournament_id: u32)]
pub struct EnterTournament<'info> {
    #[account(
        init_if_needed,
        payer = user,
        space = 8 + Tournament::SIZE,
        seeds = [b"tournament", tournament_id.to_le_bytes().as_ref()],
        bump
    )]
    pub tournament: Account<'info, Tournament>,
    
    #[account(mut, seeds = [b"player", user.key().as_ref()], bump)]
    pub player: Account<'info, Player>,
    
    #[account(mut, seeds = [b"game_state"], bump)]
    pub game_state: Account<'info, GameState>,
    
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub tournament_pool: Account<'info, TokenAccount>,
    
    /// CHECK: Pool authority PDA
    #[account(seeds = [b"pool_authority"], bump)]
    pub pool_authority: AccountInfo<'info>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(battle_id: u32)]
pub struct SettleBattle<'info> {
    #[account(
        init,
        payer = fee_payer,
        space = 8 + Battle::SIZE,
        seeds = [b"battle", battle_id.to_le_bytes().as_ref()],
        bump
    )]
    pub battle: Account<'info, Battle>,
    
    #[account(mut, seeds = [b"player", player1.key().as_ref()], bump)]
    pub player1: Account<'info, Player>,
    
    #[account(mut, seeds = [b"player", player2.key().as_ref()], bump)]
    pub player2: Account<'info, Player>,
    
    /// CHECK: Player1 character account
    pub player1_char: AccountInfo<'info>,
    
    /// CHECK: Player2 character account
    pub player2_char: AccountInfo<'info>,
    
    #[account(mut, seeds = [b"game_state"], bump)]
    pub game_state: Account<'info, GameState>,
    
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    
    #[account(mut)]
    pub battle_pool: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub player1_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub player2_token_account: Account<'info, TokenAccount>,
    
    /// CHECK: Pool authority PDA
    #[account(seeds = [b"pool_authority"], bump)]
    pub pool_authority: AccountInfo<'info>,
    
    #[account(mut)]
    pub fee_payer: Signer<'info>,
    
    /// CHECK: Player1
    pub player1: AccountInfo<'info>,
    
    /// CHECK: Player2
    pub player2: AccountInfo<'info>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}
