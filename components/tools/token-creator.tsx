"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { Keypair, VersionedTransaction } from "@solana/web3.js"
import { GlassCard } from "@/components/ui/glass-card"
import { GlassButton } from "@/components/ui/glass-button"
import { GlassInput } from "@/components/ui/glass-input"
import { useTransactionLog } from "@/hooks/use-transaction-log"
import { shortenAddress } from "@/lib/solana-utils"
import { toast } from "sonner"

// NO MOCK DATA - Real token creation via PumpPortal

type LaunchPlatform = "pumpfun" | "bonk"

export function TokenCreator() {
  const { publicKey, signTransaction, connected } = useWallet()
  const { connection } = useConnection()
  const { addLog, updateLog } = useTransactionLog()
  const [creating, setCreating] = useState(false)
  const [createdMint, setCreatedMint] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    description: "",
    twitter: "",
    telegram: "",
    website: "",
    devBuyAmount: "0.1",
    slippage: "10",
    priorityFee: "0.0005",
    platform: "pumpfun" as LaunchPlatform,
    showName: true,
  })

  const [imageFile, setImageFile] = useState<File | null>(null)

  const updateForm = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB")
        return
      }
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const createToken = async () => {
    if (!connected) {
      toast.error("Connect wallet to create token")
      return
    }
    if (!publicKey || !signTransaction) return

    if (!formData.name || !formData.symbol) {
      toast.error("Name and symbol are required")
      return
    }

    if (!imageFile) {
      toast.error("Token image is required")
      return
    }

    const devBuy = Number.parseFloat(formData.devBuyAmount)
    if (isNaN(devBuy) || devBuy < 0) {
      toast.error("Invalid dev buy amount")
      return
    }

    setCreating(true)
    const logId = addLog({
      type: "create",
      status: "pending",
      message: `Creating token ${formData.symbol} on ${formData.platform === "pumpfun" ? "pump.fun" : "bonk.fun"}...`,
    })

    try {
      // Generate mint keypair
      const mintKeypair = Keypair.generate()
      const mintAddress = mintKeypair.publicKey.toBase58()

      // Step 1: Upload metadata to IPFS
      updateLog(logId.id, {
        status: "pending",
        message: "Uploading metadata to IPFS...",
      })

      const metadataFormData = new FormData()
      metadataFormData.append("file", imageFile)
      metadataFormData.append("name", formData.name)
      metadataFormData.append("symbol", formData.symbol)
      metadataFormData.append("description", formData.description || `${formData.name} token`)
      if (formData.twitter) metadataFormData.append("twitter", formData.twitter)
      if (formData.telegram) metadataFormData.append("telegram", formData.telegram)
      if (formData.website) metadataFormData.append("website", formData.website)
      metadataFormData.append("showName", formData.showName ? "true" : "false")

      let metadataUri: string
      let tokenMetadata: { name: string; symbol: string; uri: string }

      if (formData.platform === "pumpfun") {
        // Upload to pump.fun IPFS
        const ipfsResponse = await fetch("https://pump.fun/api/ipfs", {
          method: "POST",
          body: metadataFormData,
        })

        if (!ipfsResponse.ok) {
          throw new Error("Failed to upload metadata to IPFS")
        }

        const ipfsData = await ipfsResponse.json()
        metadataUri = ipfsData.metadataUri
        tokenMetadata = {
          name: ipfsData.metadata?.name || formData.name,
          symbol: ipfsData.metadata?.symbol || formData.symbol,
          uri: metadataUri,
        }
      } else {
        // Bonk.fun flow
        const imgFormData = new FormData()
        imgFormData.append("image", imageFile)

        const imgResponse = await fetch("https://nft-storage.letsbonk22.workers.dev/upload/img", {
          method: "POST",
          body: imgFormData,
        })

        if (!imgResponse.ok) {
          throw new Error("Failed to upload image")
        }

        const imgUri = await imgResponse.text()

        const metaResponse = await fetch("https://nft-storage.letsbonk22.workers.dev/upload/meta", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            createdOn: "https://bonk.fun",
            description: formData.description || `${formData.name} token`,
            image: imgUri,
            name: formData.name,
            symbol: formData.symbol,
            website: formData.website || "",
          }),
        })

        if (!metaResponse.ok) {
          throw new Error("Failed to upload metadata")
        }

        metadataUri = await metaResponse.text()
        tokenMetadata = {
          name: formData.name,
          symbol: formData.symbol,
          uri: metadataUri,
        }
      }

      // Step 2: Get transaction from PumpPortal
      updateLog(logId.id, {
        status: "pending",
        message: "Building transaction...",
      })

      const tradeResponse = await fetch("https://pumpportal.fun/api/trade-local", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicKey: publicKey.toBase58(),
          action: "create",
          tokenMetadata,
          mint: mintAddress,
          denominatedInSol: "true",
          amount: devBuy,
          slippage: Number.parseInt(formData.slippage),
          priorityFee: Number.parseFloat(formData.priorityFee),
          pool: formData.platform === "pumpfun" ? "pump" : "bonk",
        }),
      })

      if (!tradeResponse.ok) {
        const errorText = await tradeResponse.text()
        throw new Error(`PumpPortal error: ${errorText}`)
      }

      // Step 3: Sign and send transaction
      updateLog(logId.id, {
        status: "pending",
        message: "Awaiting signature...",
      })

      const txData = await tradeResponse.arrayBuffer()
      const tx = VersionedTransaction.deserialize(new Uint8Array(txData))

      // Sign with mint keypair first
      tx.sign([mintKeypair])

      // Then sign with user wallet
      const signedTx = await signTransaction(tx as any)

      updateLog(logId.id, {
        status: "pending",
        message: "Sending transaction...",
      })

      const signature = await connection.sendRawTransaction(signedTx.serialize(), {
        skipPreflight: false,
        preflightCommitment: "confirmed",
        maxRetries: 3,
      })

      // Wait for confirmation
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed")
      await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature }, "confirmed")

      setCreatedMint(mintAddress)

      updateLog(logId.id, {
        status: "success",
        message: `Created ${formData.symbol} on ${formData.platform === "pumpfun" ? "pump.fun" : "bonk.fun"}: ${shortenAddress(mintAddress)}`,
        signature,
      })

      toast.success("Token created successfully!")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error"
      updateLog(logId.id, {
        status: "error",
        message: `Failed to create token: ${message}`,
      })
      toast.error(`Failed to create token: ${message}`)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <GlassCard className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Create Token</h2>
            <p className="text-xs text-muted-foreground">Launch on pump.fun or bonk.fun via PumpPortal</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Platform</p>
            <p className="font-mono text-sm text-primary">
              {formData.platform === "pumpfun" ? "pump.fun" : "bonk.fun"}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Platform Selection */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => updateForm("platform", "pumpfun")}
              className={`flex-1 py-2 px-4 rounded text-sm font-medium transition-colors ${
                formData.platform === "pumpfun"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              pump.fun
            </button>
            <button
              type="button"
              onClick={() => updateForm("platform", "bonk")}
              className={`flex-1 py-2 px-4 rounded text-sm font-medium transition-colors ${
                formData.platform === "bonk"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              bonk.fun
            </button>
          </div>

          {/* Token Image */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Token Image *</label>
            <div
              className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <div className="flex flex-col items-center gap-2">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Token preview"
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <span className="text-xs text-muted-foreground">Click to change</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <span className="text-sm text-muted-foreground">Click to upload image</span>
                  <span className="text-xs text-muted-foreground">PNG, JPG, GIF up to 5MB</span>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <GlassInput
              label="Token Name *"
              placeholder="My Token"
              value={formData.name}
              onChange={(e) => updateForm("name", e.target.value)}
            />
            <GlassInput
              label="Symbol *"
              placeholder="MTK"
              value={formData.symbol}
              onChange={(e) => updateForm("symbol", e.target.value.toUpperCase())}
              maxLength={10}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Description</label>
            <textarea
              placeholder="Describe your token..."
              value={formData.description}
              onChange={(e) => updateForm("description", e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-sm resize-none h-20 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Social Links */}
          <div className="space-y-3 p-4 rounded-md bg-secondary/50">
            <h3 className="text-sm font-medium">Social Links (Optional)</h3>
            <div className="grid grid-cols-1 gap-3">
              <GlassInput
                label="Twitter/X"
                placeholder="https://x.com/yourtoken"
                value={formData.twitter}
                onChange={(e) => updateForm("twitter", e.target.value)}
              />
              <GlassInput
                label="Telegram"
                placeholder="https://t.me/yourtoken"
                value={formData.telegram}
                onChange={(e) => updateForm("telegram", e.target.value)}
              />
              <GlassInput
                label="Website"
                placeholder="https://yourtoken.com"
                value={formData.website}
                onChange={(e) => updateForm("website", e.target.value)}
              />
            </div>
          </div>

          {/* Launch Settings */}
          <div className="space-y-3 p-4 rounded-md bg-secondary/50">
            <h3 className="text-sm font-medium">Launch Settings</h3>
            <div className="grid grid-cols-3 gap-3">
              <GlassInput
                label="Dev Buy (SOL)"
                type="number"
                placeholder="0.1"
                value={formData.devBuyAmount}
                onChange={(e) => updateForm("devBuyAmount", e.target.value)}
                step="0.01"
                min="0"
              />
              <GlassInput
                label="Slippage %"
                type="number"
                placeholder="10"
                value={formData.slippage}
                onChange={(e) => updateForm("slippage", e.target.value)}
                min="1"
                max="50"
              />
              <GlassInput
                label="Priority Fee"
                type="number"
                placeholder="0.0005"
                value={formData.priorityFee}
                onChange={(e) => updateForm("priorityFee", e.target.value)}
                step="0.0001"
                min="0"
              />
            </div>
            <label className="flex items-center gap-3 cursor-pointer mt-2">
              <input
                type="checkbox"
                checked={formData.showName}
                onChange={(e) => updateForm("showName", e.target.checked)}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
              />
              <div>
                <span className="text-sm font-medium">Show Creator Name</span>
                <p className="text-xs text-muted-foreground">Display your wallet as creator on the token page</p>
              </div>
            </label>
          </div>

          {/* Info Box */}
          <div className="p-3 rounded-md bg-blue-500/10 border border-blue-500/20">
            <p className="text-xs text-blue-400">
              Tokens are created via PumpPortal API. Standard trading fees apply to the initial dev buy. No additional
              creation fee.
            </p>
          </div>

          <GlassButton
            variant="primary"
            onClick={createToken}
            loading={creating}
            disabled={creating || !formData.name || !formData.symbol || !imageFile}
            className="w-full"
          >
            {connected
              ? `Launch on ${formData.platform === "pumpfun" ? "pump.fun" : "bonk.fun"}`
              : "Connect Wallet to Create"}
          </GlassButton>
        </div>
      </GlassCard>

      {createdMint && (
        <GlassCard className="p-4 border-green-500/30 bg-green-500/5">
          <h3 className="font-semibold text-green-400 mb-2">Token Created Successfully</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Mint Address:</span>
              <code className="text-sm font-mono bg-secondary px-2 py-1 rounded">{shortenAddress(createdMint, 8)}</code>
            </div>
            <div className="flex gap-2 mt-3">
              <GlassButton variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(createdMint)}>
                Copy Address
              </GlassButton>
              <GlassButton
                variant="outline"
                size="sm"
                onClick={() =>
                  window.open(
                    formData.platform === "pumpfun"
                      ? `https://pump.fun/${createdMint}`
                      : `https://bonk.fun/token/${createdMint}`,
                    "_blank",
                  )
                }
              >
                View Token
              </GlassButton>
              <GlassButton
                variant="outline"
                size="sm"
                onClick={() => window.open(`https://solscan.io/token/${createdMint}`, "_blank")}
              >
                Solscan
              </GlassButton>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  )
}
