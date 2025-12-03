"use client"

import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import useSWR from "swr"
import { PublicKey } from "@solana/web3.js"

// NO MOCK DATA - Real NFT fetching using Metaplex

export interface NFT {
  mint: string
  tokenAccount: string
  name: string
  symbol: string
  uri: string
  image?: string
}

const METADATA_PROGRAM = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s")
const TOKEN_PROGRAM = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")

async function fetchNFTMetadata(uri: string): Promise<{ name?: string; image?: string }> {
  try {
    // Handle IPFS URIs
    const url = uri.startsWith("ipfs://") ? uri.replace("ipfs://", "https://ipfs.io/ipfs/") : uri

    const response = await fetch(url, { signal: AbortSignal.timeout(5000) })
    if (!response.ok) return {}
    return await response.json()
  } catch {
    return {}
  }
}

export function useNFTs() {
  const { publicKey } = useWallet()
  const { connection } = useConnection()

  const {
    data: nfts,
    error,
    isLoading,
    mutate,
  } = useSWR(
    publicKey ? [`nfts-${publicKey.toString()}`] : null,
    async () => {
      if (!publicKey) return []

      // Fetch all token accounts with amount = 1 and decimals = 0 (NFTs)
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, { programId: TOKEN_PROGRAM })

      const nftAccounts = tokenAccounts.value.filter((acc) => {
        const amount = acc.account.data.parsed.info.tokenAmount
        return amount.uiAmount === 1 && amount.decimals === 0
      })

      const nfts: NFT[] = []

      // Process in batches of 10 to avoid rate limits
      for (let i = 0; i < Math.min(nftAccounts.length, 50); i += 10) {
        const batch = nftAccounts.slice(i, i + 10)

        const batchResults = await Promise.allSettled(
          batch.map(async (acc) => {
            const mint = acc.account.data.parsed.info.mint
            const tokenAccount = acc.pubkey.toString()

            // Derive metadata PDA
            const [metadataPDA] = PublicKey.findProgramAddressSync(
              [Buffer.from("metadata"), METADATA_PROGRAM.toBuffer(), new PublicKey(mint).toBuffer()],
              METADATA_PROGRAM,
            )

            const metadataAccount = await connection.getAccountInfo(metadataPDA)

            if (!metadataAccount) {
              return { mint, tokenAccount, name: "Unknown NFT", symbol: "???", uri: "" }
            }

            // Parse on-chain metadata
            const data = metadataAccount.data

            // Name starts at offset 65 (1 + 32 + 32)
            const nameLength = data.readUInt32LE(65)
            const name = data
              .slice(69, 69 + Math.min(nameLength, 32))
              .toString("utf8")
              .replace(/\0/g, "")
              .trim()

            // Symbol after name
            const symbolOffset = 69 + 32
            const symbolLength = data.readUInt32LE(symbolOffset)
            const symbol = data
              .slice(symbolOffset + 4, symbolOffset + 4 + Math.min(symbolLength, 10))
              .toString("utf8")
              .replace(/\0/g, "")
              .trim()

            // URI after symbol
            const uriOffset = symbolOffset + 4 + 14
            const uriLength = data.readUInt32LE(uriOffset)
            const uri = data
              .slice(uriOffset + 4, uriOffset + 4 + Math.min(uriLength, 200))
              .toString("utf8")
              .replace(/\0/g, "")
              .trim()

            // Fetch off-chain metadata for image
            let image: string | undefined
            if (uri) {
              const metadata = await fetchNFTMetadata(uri)
              image = metadata.image
            }

            return { mint, tokenAccount, name: name || "Unknown", symbol: symbol || "???", uri, image }
          }),
        )

        for (const result of batchResults) {
          if (result.status === "fulfilled") {
            nfts.push(result.value)
          }
        }
      }

      return nfts
    },
    {
      refreshInterval: 60000,
      revalidateOnFocus: false, // Don't refetch on every tab switch
      dedupingInterval: 10000,
    },
  )

  return {
    nfts: nfts || [],
    isLoading,
    error,
    refresh: mutate,
  }
}
