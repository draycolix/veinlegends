import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey, Keypair, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, createMint, getOrCreateAssociatedTokenAccount, mintTo, getAssociatedTokenAddress } from "@solana/spl-token";
import { assert } from "chai";
import { Minelegends } from "../target/types/minelegends";

describe("minelegends", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Minelegends as Program<Minelegends>;
  const wallet = provider.wallet as anchor.Wallet;

  let mint: PublicKey;
  let gameState: PublicKey;
  let mintAuthority: PublicKey;
  let poolAuthority: PublicKey;
  let treasury: PublicKey;
  let userTokenAccount: PublicKey;
  let treasuryTokenAccount: PublicKey;
  let player: PublicKey;
  let character: PublicKey;

  before(async () => {
    // Create test token mint
    mint = await createMint(
      provider.connection,
      wallet.payer,
      wallet.publicKey,
      null,
      9
    );

    [gameState] = PublicKey.findProgramAddressSync([Buffer.from("game_state")], program.programId);
    [mintAuthority] = PublicKey.findProgramAddressSync([Buffer.from("mint_authority")], program.programId);
    [poolAuthority] = PublicKey.findProgramAddressSync([Buffer.from("pool_authority")], program.programId);
    [treasury] = PublicKey.findProgramAddressSync([Buffer.from("treasury")], program.programId);
    [player] = PublicKey.findProgramAddressSync([Buffer.from("player"), wallet.publicKey.toBuffer()], program.programId);
    
    // Get or create user token account
    const userAta = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      wallet.payer,
      mint,
      wallet.publicKey
    );
    userTokenAccount = userAta.address;

    // Get or create treasury token account
    const treasuryAta = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      wallet.payer,
      mint,
      treasury,
      true // allowOwnerOffCurve
    );
    treasuryTokenAccount = treasuryAta.address;
  });

  it("Initializes the game state", async () => {
    const tx = await program.methods
      .initialize(0)
      .accounts({
        gameState,
        mintAuthority: mintAuthority,
        poolAuthority: poolAuthority,
        admin: wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
    console.log("Init tx:", tx);

    const state = await program.account.gameState.fetch(gameState);
    assert.ok(state.admin.equals(wallet.publicKey));
    assert.equal(state.totalPlayers.toNumber(), 0);
  });

  it("Initializes a player", async () => {
    const tx = await program.methods
      .initPlayer("riz_test")
      .accounts({
        player,
        gameState,
        user: wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
    console.log("Player init tx:", tx);

    const playerAccount = await program.account.player.fetch(player);
    assert.equal(playerAccount.username, "riz_test");
    assert.equal(playerAccount.level, 1);
  });

  it("Mints a Common Miner character", async () => {
    const [characterPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("character"), wallet.publicKey.toBuffer(), Buffer.from([0])],
      program.programId
    );
    character = characterPda;

    // Fund user with enough tokens
    await mintTo(
      provider.connection,
      wallet.payer,
      mint,
      userTokenAccount,
      wallet.payer,
      10_000_000_000_000 // 10K $MNLG
    );

    const tx = await program.methods
      .mintCharacter({ miner: {} }, { common: {} })
      .accounts({
        character,
        player,
        gameState,
        mint,
        userTokenAccount,
        treasuryTokenAccount,
        treasury,
        user: wallet.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
    console.log("Mint character tx:", tx);

    const char = await program.account.character.fetch(character);
    assert.deepEqual(char.class, { miner: {} });
    assert.deepEqual(char.rarity, { common: {} });
    assert.equal(char.level, 1);
    assert.ok(char.miningPower > 0);
  });

  it("Upgrades the character", async () => {
    const tx = await program.methods
      .upgradeCharacter()
      .accounts({
        character,
        player,
        gameState,
        mint,
        userTokenAccount,
        treasuryTokenAccount,
        treasury,
        user: wallet.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();
    console.log("Upgrade tx:", tx);

    const char = await program.account.character.fetch(character);
    assert.equal(char.level, 2);
  });
});
