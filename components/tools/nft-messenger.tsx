"use client"

import { useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js"
import { GlassCard } from "@/components/ui/glass-card"
import { GlassButton } from "@/components/ui/glass-button"
import { GlassInput } from "@/components/ui/glass-input"
import { useTransactionLog } from "@/hooks/use-transaction-log"
import { getConnection, executeWithRetry } from "@/lib/rpc-manager"
import { isValidPublicKey, MEMO_PROGRAM_ID } from "@/lib/solana-utils"
import { toast } from "sonner"

// NO MOCK DATA - Real NFT messaging via memo

export function NFTMessenger() {
  const { publicKey, signTransaction, connected } = useWallet()
  const { addLog, updateLog } = useTransactionLog()
  const [sending, setSending] = useState(false)
  const [resolving, setResolving] = useState(false)

  const [formData, setFormData] = useState({
    target: "",
    targetType: "nft" as "nft" | "domain",
    message: "",
    resolvedOwner: "",
  })

  const updateForm = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const resolveOwner = async () => {
    if (!formData.target) return

    setResolving(true)
    try {
      if (formData.targetType === "nft") {
        if (!isValidPublicKey(formData.target)) {
          toast.error("Invalid NFT mint address")
          return
        }

        const owner = await executeWithRetry(async (connection) => {
          const mint = new PublicKey(formData.target)
          const largestAccounts = await connection.getTokenLargestAccounts(mint)

          if (largestAccounts.value.length === 0) {
            throw new Error("No token accounts found")
          }

          const largestAccount = largestAccounts.value[0]
          const accountInfo = await connection.getParsedAccountInfo(largestAccount.address)

          if (!accountInfo.value || !("parsed" in accountInfo.value.data)) {
            throw new Error("Could not parse account info")
          }

          return accountInfo.value.data.parsed.info.owner as string
        })

        setFormData((prev) => ({ ...prev, resolvedOwner: owner }))
        toast.success("Owner resolved!")
      } else {
        const domain = formData.target.replace(".sol", "")

        const owner = await executeWithRetry(async (connection) => {
          const NAME_PROGRAM_ID = new PublicKey("namesLPneVptA9Z5rqUDD9tMTWEJwofgaYwp8cawRkX")
          const SOL_TLD_AUTHORITY = new PublicKey("58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx")

          const hashedName = await hashDomainName(domain)
          const [domainKey] = PublicKey.findProgramAddressSync(
            [hashedName, SOL_TLD_AUTHORITY.toBuffer()],
            NAME_PROGRAM_ID,
          )

          const accountInfo = await connection.getAccountInfo(domainKey)
          if (!accountInfo) {
            throw new Error("Domain not found")
          }

          const ownerPubkey = new PublicKey(accountInfo.data.slice(32, 64))
          return ownerPubkey.toString()
        })

        setFormData((prev) => ({ ...prev, resolvedOwner: owner }))
        toast.success("Domain owner resolved!")
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error"
      toast.error(`Failed to resolve: ${message}`)
      setFormData((prev) => ({ ...prev, resolvedOwner: "" }))
    } finally {
      setResolving(false)
    }
  }

  const sendMessage = async () => {
    if (!connected) {
      toast.error("Connect wallet to send message")
      return
    }
    if (!publicKey || !signTransaction || !formData.resolvedOwner || !formData.message) return

    setSending(true)
    const logId = addLog({
      type: "message",
      status: "pending",
      message: `Sending message to ${formData.resolvedOwner.slice(0, 8)}...`,
    })

    try {
      const connection = getConnection()
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash()

      const transaction = new Transaction()
      transaction.recentBlockhash = blockhash
      transaction.feePayer = publicKey

      const memoInstruction = new TransactionInstruction({
        keys: [{ pubkey: publicKey, isSigner: true, isWritable: false }],
        programId: MEMO_PROGRAM_ID,
        data: Buffer.from(formData.message, "utf-8"),
      })

      transaction.add(memoInstruction)

      const signed = await signTransaction(transaction)
      const signature = await connection.sendRawTransaction(signed.serialize())

      await connection.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature,
      })

      updateLog(logId.id, {
        status: "success",
        message: `Message sent to ${formData.resolvedOwner.slice(0, 8)}...`,
        signature,
      })

      toast.success("Message sent!")
      setFormData((prev) => ({ ...prev, message: "" }))
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error"
      updateLog(logId.id, {
        status: "error",
        message: `Failed to send message: ${message}`,
      })
      toast.error("Failed to send message")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <GlassCard className="p-4">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">NFT Messenger</h2>
          <p className="text-xs text-muted-foreground">Send on-chain messages via Solana memo program</p>
        </div>

        <div className="space-y-4">
          {/* Target Type Selection */}
          <div className="flex gap-2">
            <button
              onClick={() => updateForm("targetType", "nft")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                formData.targetType === "nft"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-foreground hover:bg-muted"
              }`}
            >
              NFT Address
            </button>
            <button
              onClick={() => updateForm("targetType", "domain")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                formData.targetType === "domain"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-foreground hover:bg-muted"
              }`}
            >
              .sol Domain
            </button>
          </div>

          {/* Target Input */}
          <div className="flex gap-2">
            <div className="flex-1">
              <GlassInput
                label={formData.targetType === "nft" ? "NFT Mint Address" : "Solana Domain"}
                value={formData.target}
                onChange={(e) => updateForm("target", e.target.value)}
                placeholder={formData.targetType === "nft" ? "Enter NFT mint address" : "example.sol"}
              />
            </div>
            <div className="flex items-end">
              <GlassButton
                variant="outline"
                onClick={resolveOwner}
                loading={resolving}
                disabled={resolving || !formData.target}
              >
                Resolve
              </GlassButton>
            </div>
          </div>

          {/* Resolved Owner */}
          {formData.resolvedOwner && (
            <div className="p-3 rounded-md bg-green-500/10 border border-green-500/30">
              <p className="text-xs text-muted-foreground mb-1">Resolved Owner</p>
              <code className="text-sm font-mono text-green-400">{formData.resolvedOwner}</code>
            </div>
          )}

          {/* Message Input */}
          <div>
            <label className="text-sm font-medium mb-2 block">Message</label>
            <textarea
              value={formData.message}
              onChange={(e) => updateForm("message", e.target.value)}
              placeholder="Enter your message..."
              className="w-full h-32 px-3 py-2 rounded-md border border-border bg-input text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground mt-1">{formData.message.length}/500 characters</p>
          </div>

          <GlassButton
            variant="primary"
            onClick={sendMessage}
            loading={sending}
            disabled={sending || !formData.resolvedOwner || !formData.message}
            className="w-full"
          >
            {connected ? "Send Message" : "Connect Wallet to Send"}
          </GlassButton>
        </div>
      </GlassCard>
    </div>
  )
}

async function hashDomainName(name: string): Promise<Buffer> {
  const encoder = new TextEncoder()
  const data = encoder.encode(name)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  return Buffer.from(hashBuffer)
}
