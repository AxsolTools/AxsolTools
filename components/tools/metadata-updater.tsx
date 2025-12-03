"use client"

import { useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { PublicKey, Transaction } from "@solana/web3.js"
import { GlassCard } from "@/components/ui/glass-card"
import { GlassButton } from "@/components/ui/glass-button"
import { GlassInput } from "@/components/ui/glass-input"
import { useNFTs, type NFT } from "@/hooks/use-nfts"
import { useTransactionLog } from "@/hooks/use-transaction-log"
import { getConnection } from "@/lib/rpc-manager"
import { shortenAddress } from "@/lib/solana-utils"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// NO MOCK DATA - Real NFT metadata updates

export function MetadataUpdater() {
  const { publicKey, signTransaction, connected } = useWallet()
  const { nfts, isLoading, refresh } = useNFTs()
  const { addLog, updateLog } = useTransactionLog()
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null)
  const [updating, setUpdating] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    uri: "",
    sellerFeeBasisPoints: "",
  })

  const selectNFT = (nft: NFT) => {
    setSelectedNFT(nft)
    setFormData({
      name: nft.name,
      symbol: nft.symbol,
      uri: nft.uri,
      sellerFeeBasisPoints: String(nft.sellerFeeBasisPoints || 0),
    })
  }

  const updateForm = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const updateMetadata = async () => {
    if (!connected) {
      toast.error("Connect wallet to update metadata")
      return
    }
    if (!publicKey || !signTransaction || !selectedNFT) return

    setUpdating(true)
    const logId = addLog({
      type: "update",
      status: "pending",
      message: `Updating metadata for ${selectedNFT.name}...`,
    })

    try {
      const connection = getConnection()
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash()

      const mint = new PublicKey(selectedNFT.mint)
      const METADATA_PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s")

      const [metadataPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("metadata"), METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()],
        METADATA_PROGRAM_ID,
      )

      const dataBuffer = Buffer.alloc(1000)
      let offset = 0

      dataBuffer.writeUInt8(15, offset)
      offset += 1

      dataBuffer.writeUInt8(1, offset)
      offset += 1

      const nameBytes = Buffer.from(formData.name)
      dataBuffer.writeUInt32LE(nameBytes.length, offset)
      offset += 4
      nameBytes.copy(dataBuffer, offset)
      offset += nameBytes.length

      const symbolBytes = Buffer.from(formData.symbol)
      dataBuffer.writeUInt32LE(symbolBytes.length, offset)
      offset += 4
      symbolBytes.copy(dataBuffer, offset)
      offset += symbolBytes.length

      const uriBytes = Buffer.from(formData.uri)
      dataBuffer.writeUInt32LE(uriBytes.length, offset)
      offset += 4
      uriBytes.copy(dataBuffer, offset)
      offset += uriBytes.length

      dataBuffer.writeUInt16LE(Number.parseInt(formData.sellerFeeBasisPoints) || 0, offset)
      offset += 2

      dataBuffer.writeUInt8(0, offset)
      offset += 1

      dataBuffer.writeUInt8(0, offset)
      offset += 1

      dataBuffer.writeUInt8(0, offset)
      offset += 1

      dataBuffer.writeUInt8(0, offset)
      offset += 1

      const transaction = new Transaction()
      transaction.recentBlockhash = blockhash
      transaction.feePayer = publicKey

      transaction.add({
        keys: [
          { pubkey: metadataPDA, isSigner: false, isWritable: true },
          { pubkey: publicKey, isSigner: true, isWritable: false },
        ],
        programId: METADATA_PROGRAM_ID,
        data: dataBuffer.slice(0, offset),
      })

      const signed = await signTransaction(transaction)
      const signature = await connection.sendRawTransaction(signed.serialize())

      await connection.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature,
      })

      updateLog(logId.id, {
        status: "success",
        message: `Updated metadata for ${formData.name}`,
        signature,
      })

      toast.success("Metadata updated!")
      refresh()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error"
      updateLog(logId.id, {
        status: "error",
        message: `Failed to update metadata: ${message}`,
      })
      toast.error("Failed to update metadata")
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* NFT Selection */}
      <GlassCard className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Select NFT</h2>
          <GlassButton variant="outline" size="sm" onClick={refresh} disabled={!connected}>
            Refresh
          </GlassButton>
        </div>

        {!connected ? (
          <div className="text-center py-12 border border-dashed border-border rounded-lg">
            <p className="text-sm text-muted-foreground font-mono mb-2">Wallet not connected</p>
            <p className="text-xs text-muted-foreground">Connect your wallet to view your NFTs</p>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-2 gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square rounded-lg bg-secondary animate-pulse" />
            ))}
          </div>
        ) : nfts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No NFTs found in your wallet</div>
        ) : (
          <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
            {nfts.map((nft) => (
              <button
                key={nft.mint}
                onClick={() => selectNFT(nft)}
                className={cn(
                  "relative aspect-square rounded-lg overflow-hidden border-2 transition-all",
                  selectedNFT?.mint === nft.mint
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-transparent hover:border-border",
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
                    <span className="text-xs text-muted-foreground">No Image</span>
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                  <p className="text-xs text-white truncate">{nft.name}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </GlassCard>

      {/* Metadata Editor */}
      <GlassCard className="p-4">
        <h2 className="text-lg font-semibold mb-4">Edit Metadata</h2>

        {selectedNFT ? (
          <div className="space-y-4">
            <div className="p-3 rounded-md bg-secondary">
              <p className="text-xs text-muted-foreground">Mint Address</p>
              <code className="text-sm font-mono">{shortenAddress(selectedNFT.mint, 8)}</code>
            </div>

            <GlassInput
              label="Name"
              value={formData.name}
              onChange={(e) => updateForm("name", e.target.value)}
              placeholder="NFT Name"
            />

            <GlassInput
              label="Symbol"
              value={formData.symbol}
              onChange={(e) => updateForm("symbol", e.target.value)}
              placeholder="SYMBOL"
            />

            <GlassInput
              label="Metadata URI"
              value={formData.uri}
              onChange={(e) => updateForm("uri", e.target.value)}
              placeholder="https://arweave.net/..."
            />

            <GlassInput
              label="Seller Fee (Basis Points)"
              type="number"
              value={formData.sellerFeeBasisPoints}
              onChange={(e) => updateForm("sellerFeeBasisPoints", e.target.value)}
              placeholder="500 = 5%"
              min={0}
              max={10000}
            />

            <GlassButton
              variant="primary"
              onClick={updateMetadata}
              loading={updating}
              disabled={updating}
              className="w-full"
            >
              {connected ? "Update Metadata" : "Connect Wallet"}
            </GlassButton>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-lg">
            Select an NFT to edit its metadata
          </div>
        )}
      </GlassCard>
    </div>
  )
}
