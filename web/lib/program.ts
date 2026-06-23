import { AnchorProvider, Program, web3, BN } from '@project-serum/anchor';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

// Program ID from Anchor.toml
export const PROGRAM_ID = new PublicKey('MNLG1111111111111111111111111111111111111111');

// Token mint - to be set after deployment
export const MNLG_MINT = new PublicKey(
  process.env.NEXT_PUBLIC_MNLG_MINT || 'MNLG1111111111111111111111111111111111111111'
);

// Seeds (must match program/src/constants.rs)
export const GAME_STATE_SEED = Buffer.from('game_state');
export const PLAYER_SEED = Buffer.from('player');
export const CHARACTER_SEED = Buffer.from('character');
export const TOURNAMENT_SEED = Buffer.from('tournament');
export const BATTLE_SEED = Buffer.from('battle');
export const MINT_AUTHORITY_SEED = Buffer.from('mint_authority');
export const POOL_AUTHORITY_SEED = Buffer.from('pool_authority');
export const TREASURY_SEED = Buffer.from('treasury');

export function getGameStatePDA(): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync([GAME_STATE_SEED], PROGRAM_ID);
  return pda;
}

export function getPlayerPDA(wallet: PublicKey): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [PLAYER_SEED, wallet.toBuffer()],
    PROGRAM_ID
  );
  return pda;
}

export function getMintAuthorityPDA(): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync([MINT_AUTHORITY_SEED], PROGRAM_ID);
  return pda;
}

export function getPoolAuthorityPDA(): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync([POOL_AUTHORITY_SEED], PROGRAM_ID);
  return pda;
}

export function getTreasuryPDA(): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync([TREASURY_SEED], PROGRAM_ID);
  return pda;
}

export const network =
  process.env.NEXT_PUBLIC_NETWORK === 'mainnet-beta' ? 'mainnet-beta' : 'devnet';

export const connection = new Connection(
  process.env.NEXT_PUBLIC_RPC_URL || clusterApiUrl(network as any),
  'confirmed'
);

// Token constants (with 9 decimals)
export const TOKEN_DECIMALS = 9;

export const toRawAmount = (human: number): BN =>
  new BN(Math.floor(human * 10 ** TOKEN_DECIMALS));

export const fromRawAmount = (raw: BN | number | bigint): number => {
  const n = typeof raw === 'bigint' ? Number(raw) : Number(raw);
  return n / 10 ** TOKEN_DECIMALS;
};

// Character costs (in $MNLG, human-readable)
export const CHARACTER_COSTS = {
  common: { miner: 1000, warrior: 1500, mage: 1200, engineer: 1100, alchemist: 1100 },
  rare: { miner: 10000, warrior: 15000, mage: 12000, engineer: 11000, alchemist: 11000 },
  legendary: {
    miner: 100000,
    warrior: 150000,
    mage: 120000,
    engineer: 110000,
    alchemist: 110000,
  },
};

export const CHARACTER_NAMES = ['Miner', 'Warrior', 'Mage', 'Engineer', 'Alchemist'];
export const RARITY_NAMES = ['Common', 'Rare', 'Legendary'];

// Format helpers
export const formatNumber = (n: number, decimals = 2): string => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(decimals)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(decimals)}K`;
  return n.toFixed(decimals);
};

export const shortenAddress = (addr: string | PublicKey, chars = 4): string => {
  const s = typeof addr === 'string' ? addr : addr.toBase58();
  return `${s.slice(0, chars)}...${s.slice(-chars)}`;
};
