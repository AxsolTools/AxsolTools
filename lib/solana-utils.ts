// NO MOCK DATA - Real Solana utilities
import { PublicKey, LAMPORTS_PER_SOL, TransactionInstruction } from "@solana/web3.js"
import {
  TOKEN_PROGRAM_ID,
  createBurnInstruction,
  createCloseAccountInstruction,
  getAssociatedTokenAddress,
  createTransferInstruction,
} from "@solana/spl-token"
import { executeWithRetry } from "./rpc-manager"

export const MEMO_PROGRAM_ID = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr")

export interface TokenAccount {
  pubkey: PublicKey
  mint: PublicKey
  owner: PublicKey
  amount: bigint
  decimals: number
}

export interface NFTMetadata {
  mint: string
  name: string
  symbol: string
  uri: string
  image?: string
}

export async function getTokenAccounts(owner: PublicKey): Promise<TokenAccount[]> {
  return executeWithRetry(async (connection) => {
    const response = await connection.getParsedTokenAccountsByOwner(owner, {
      programId: TOKEN_PROGRAM_ID,
    })

    return response.value.map((item) => {
      const info = item.account.data.parsed.info
      return {
        pubkey: item.pubkey,
        mint: new PublicKey(info.mint),
        owner: new PublicKey(info.owner),
        amount: BigInt(info.tokenAmount.amount),
        decimals: info.tokenAmount.decimals,
      }
    })
  })
}

export async function getEmptyTokenAccounts(owner: PublicKey): Promise<TokenAccount[]> {
  const accounts = await getTokenAccounts(owner)
  return accounts.filter((acc) => acc.amount === BigInt(0))
}

export async function getSolBalance(owner: PublicKey): Promise<number> {
  return executeWithRetry(async (connection) => {
    const balance = await connection.getBalance(owner)
    return balance / LAMPORTS_PER_SOL
  })
}

export function createBurnTokenInstruction(
  account: PublicKey,
  mint: PublicKey,
  owner: PublicKey,
  amount: bigint,
): TransactionInstruction {
  return createBurnInstruction(account, mint, owner, amount)
}

export function createCloseTokenAccountInstruction(
  account: PublicKey,
  destination: PublicKey,
  owner: PublicKey,
): TransactionInstruction {
  return createCloseAccountInstruction(account, destination, owner)
}

export async function createTransferTokenInstruction(
  source: PublicKey,
  mint: PublicKey,
  destination: PublicKey,
  owner: PublicKey,
  amount: bigint,
): Promise<TransactionInstruction> {
  const destinationAta = await getAssociatedTokenAddress(mint, destination)
  return createTransferInstruction(source, destinationAta, owner, amount)
}

export function createMemoInstruction(message: string, signer: PublicKey): TransactionInstruction {
  return new TransactionInstruction({
    keys: [{ pubkey: signer, isSigner: true, isWritable: false }],
    programId: MEMO_PROGRAM_ID,
    data: Buffer.from(message, "utf-8"),
  })
}

export async function getRecentBlockhash(): Promise<string> {
  return executeWithRetry(async (connection) => {
    const { blockhash } = await connection.getLatestBlockhash()
    return blockhash
  })
}

export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`
}

export function lamportsToSol(lamports: number | bigint): number {
  return Number(lamports) / LAMPORTS_PER_SOL
}

export function solToLamports(sol: number): number {
  return Math.floor(sol * LAMPORTS_PER_SOL)
}

export function isValidPublicKey(address: string): boolean {
  try {
    new PublicKey(address)
    return true
  } catch {
    return false
  }
}
