"use client"

import { useState } from "react"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { PublicKey, Transaction } from "@solana/web3.js"
import {
  createBurnCheckedInstruction,
  createCloseAccountInstruction,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token"
import { GlassCard } from "@/components/ui/glass-card"
import { GlassButton } from "@/components/ui/glass-button"
import { GlassInput } from "@/components/ui/glass-input"
import { useNFTs } from "@/hooks/use-nfts"
import { useTransactionLog } from "@/hooks/use-transaction-log"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// NO MOCK DATA - Real NFT burning

export function NFTBurner() {
  const { publicKey, signTransaction, connected } = useWallet()
  const { connection } = useConnection()
  const { nfts, isLoading, refresh } = useNFTs()
  const { addLog, updateLog } = useTransactionLog()
  const [selectedNFTs, setSelectedNFTs] = useState<Set<string>>(new Set())
  const [burning, setBurning] = useState(false)
  const [priorityFee, setPriorityFee] = useState("0.00001")

  const toggleNFT = (mint: string) => {
    const newSelected = new Set(selectedNFTs)
    if (newSelected.has(mint)) {
      newSelected.delete(mint)
    } else {
      newSelected.add(mint)
    }
    setSelectedNFTs(newSelected)
  }

  const selectAll = () => {
    if (selectedNFTs.size === nfts.length) {
      setSelectedNFTs(new Set())
    } else {
      setSelectedNFTs(new Set(nfts.map((n) => n.mint)))
    }
  }

  const burnSelected = async () => {
    if (!connected) {
      toast.error("Connect wallet to burn NFTs")
      return
    }
    if (!publicKey || !signTransaction || selectedNFTs.size === 0) return

    setBurning(true)
    const logId = addLog({
      type: "burn",
      status: "pending",
      message: `Burning ${selectedNFTs.size} NFT(s)...`,
    })

    try {
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed")

      const nftArray = Array.from(selectedNFTs)
      const batchSize = 5
      let totalBurned = 0

      for (let i = 0; i < nftArray.length; i += batchSize) {
        const batch = nftArray.slice(i, i + batchSize)
        const transaction = new Transaction()
        transaction.recentBlockhash = blockhash
        transaction.feePayer = publicKey

        for (const mint of batch) {
          const mintPubkey = new PublicKey(mint)
          const ata = await getAssociatedTokenAddress(mintPubkey, publicKey)

          transaction.add(createBurnCheckedInstruction(ata, mintPubkey, publicKey, 1, 0, [], TOKEN_PROGRAM_ID))
          transaction.add(createCloseAccountInstruction(ata, publicKey, publicKey, [], TOKEN_PROGRAM_ID))
        }

        const signed = await signTransaction(transaction)
        const signature = await connection.sendRawTransaction(signed.serialize(), {
          skipPreflight: false,
          preflightCommitment: "confirmed",
        })

        await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature }, "confirmed")

        totalBurned += batch.length
      }

      updateLog(logId.id, {
        status: "success",
        message: `Successfully burned ${totalBurned} NFT(s)`,
      })

      toast.success(`Burned ${totalBurned} NFT(s)`)
      setSelectedNFTs(new Set())
      refresh()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error"
      updateLog(logId.id, {
        status: "error",
        message: `Failed to burn NFTs: ${message}`,
      })
      toast.error(`Failed to burn NFTs: ${message}`)
    } finally {
      setBurning(false)
    }
  }

  return (
    <div className="space-y-3">
      {/* Controls Panel */}
      <GlassCard header={<span className="text-xs font-medium text-muted-foreground">CONTROLS</span>} className="p-0">
        <div className="p-3 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <GlassButton variant="outline" size="sm" onClick={selectAll} disabled={!connected || nfts.length === 0}>
              {selectedNFTs.size === nfts.length && nfts.length > 0 ? "Deselect All" : "Select All"}
            </GlassButton>
            <GlassButton variant="ghost" size="sm" onClick={refresh} disabled={!connected}>
              Refresh
            </GlassButton>
            <span className="text-xs text-muted-foreground font-mono px-2 py-1 bg-secondary rounded">
              {selectedNFTs.size}/{nfts.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <GlassInput
              type="text"
              value={priorityFee}
              onChange={(e) => setPriorityFee(e.target.value)}
              className="w-24"
              label="Priority Fee (SOL)"
              placeholder="0.00001"
            />
          </div>
        </div>
      </GlassCard>

      {/* NFT Grid */}
      <GlassCard header={<span className="text-xs font-medium text-muted-foreground">YOUR NFTs</span>} className="p-0">
        <div className="p-3">
          {!connected ? (
            <div className="text-center py-12 border border-dashed border-border rounded-lg">
              <p className="text-sm text-muted-foreground font-mono mb-2">Wallet not connected</p>
              <p className="text-xs text-muted-foreground">Connect your wallet to view and burn NFTs</p>
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2">
              {[...Array(16)].map((_, i) => (
                <div key={i} className="aspect-square rounded bg-secondary animate-pulse" />
              ))}
            </div>
          ) : nfts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-xs text-muted-foreground font-mono">No NFTs found in wallet</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2">
              {nfts.map((nft) => (
                <button
                  key={nft.mint}
                  onClick={() => toggleNFT(nft.mint)}
                  className={cn(
                    "relative aspect-square rounded overflow-hidden border transition-all group",
                    selectedNFTs.has(nft.mint)
                      ? "border-primary ring-1 ring-primary"
                      : "border-border hover:border-muted-foreground",
                  )}
                >
                  {nft.image ? (
                    <img
                      src={nft.image || "/placeholder.svg"}
                      alt={nft.name}
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <div className="w-full h-full bg-secondary flex items-center justify-center">
                      <span className="text-[8px] text-muted-foreground font-mono">NO IMG</span>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-1.5">
                    <p className="text-[9px] text-white truncate">{nft.name}</p>
                  </div>
                  {selectedNFTs.has(nft.mint) && (
                    <div className="absolute top-1 right-1 w-4 h-4 rounded-sm bg-primary flex items-center justify-center">
                      <svg
                        className="w-2.5 h-2.5 text-primary-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </GlassCard>

      {/* Burn Action */}
      {selectedNFTs.size > 0 && (
        <GlassCard className="p-3 border-destructive/50">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium">{selectedNFTs.size} NFT(s) selected</p>
              <p className="text-[10px] text-muted-foreground">This action is permanent and cannot be undone</p>
            </div>
            <GlassButton variant="destructive" size="sm" onClick={burnSelected} loading={burning} disabled={burning}>
              Burn Selected
            </GlassButton>
          </div>
        </GlassCard>
      )}
    </div>
  )
}
