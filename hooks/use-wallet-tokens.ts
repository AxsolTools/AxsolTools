"use client"

import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import useSWR from "swr"
import { PublicKey } from "@solana/web3.js"

// NO MOCK DATA - Real wallet token fetching

const TOKEN_PROGRAM = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")

export interface TokenAccount {
  pubkey: PublicKey
  mint: PublicKey
  owner: PublicKey
  amount: bigint
  decimals: number
}

export function useWalletTokens() {
  const { publicKey } = useWallet()
  const { connection } = useConnection()

  const {
    data: tokens,
    error: tokensError,
    isLoading: tokensLoading,
    mutate: refreshTokens,
  } = useSWR(
    publicKey ? [`tokens-${publicKey.toString()}`] : null,
    async () => {
      if (!publicKey) return []

      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, { programId: TOKEN_PROGRAM })

      return tokenAccounts.value.map((acc) => {
        const info = acc.account.data.parsed.info
        return {
          pubkey: acc.pubkey,
          mint: new PublicKey(info.mint),
          owner: new PublicKey(info.owner),
          amount: BigInt(info.tokenAmount.amount),
          decimals: info.tokenAmount.decimals,
        } as TokenAccount
      })
    },
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
      dedupingInterval: 5000,
    },
  )

  const {
    data: solBalance,
    error: balanceError,
    isLoading: balanceLoading,
    mutate: refreshBalance,
  } = useSWR(
    publicKey ? [`sol-balance-${publicKey.toString()}`] : null,
    async () => {
      if (!publicKey) return 0
      const balance = await connection.getBalance(publicKey)
      return balance / 1e9
    },
    {
      refreshInterval: 15000,
      revalidateOnFocus: true,
    },
  )

  return {
    tokens: tokens || [],
    solBalance: solBalance || 0,
    isLoading: tokensLoading || balanceLoading,
    error: tokensError || balanceError,
    refresh: () => {
      refreshTokens()
      refreshBalance()
    },
  }
}

export function useEmptyAccounts() {
  const { publicKey } = useWallet()
  const { connection } = useConnection()

  const {
    data: emptyAccounts,
    error,
    isLoading,
    mutate,
  } = useSWR(
    publicKey ? [`empty-accounts-${publicKey.toString()}`] : null,
    async () => {
      if (!publicKey) return []

      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, { programId: TOKEN_PROGRAM })

      return tokenAccounts.value
        .filter((acc) => {
          const amount = acc.account.data.parsed.info.tokenAmount
          return amount.uiAmount === 0
        })
        .map((acc) => {
          const info = acc.account.data.parsed.info
          return {
            pubkey: acc.pubkey,
            mint: new PublicKey(info.mint),
            owner: new PublicKey(info.owner),
            amount: BigInt(0),
            decimals: info.tokenAmount.decimals,
          } as TokenAccount
        })
    },
    { refreshInterval: 60000 },
  )

  return {
    emptyAccounts: emptyAccounts || [],
    isLoading,
    error,
    refresh: mutate,
  }
}
