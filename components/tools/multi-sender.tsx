"use client"

import { useState } from "react"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js"
import {
  createTransferCheckedInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  getAccount,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token"
import { GlassCard } from "@/components/ui/glass-card"
import { GlassButton } from "@/components/ui/glass-button"
import { GlassInput } from "@/components/ui/glass-input"
import { useWalletTokens } from "@/hooks/use-wallet-tokens"
import { useTransactionLog } from "@/hooks/use-transaction-log"
import { shortenAddress, isValidPublicKey } from "@/lib/solana-utils"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// NO MOCK DATA - Real multi-send functionality

type SendMode = "one-to-many" | "sol-to-many"

interface Recipient {
  address: string
  amount: string
}

export function MultiSender() {
  const { publicKey, signTransaction, connected } = useWallet()
  const { connection } = useConnection()
  const { tokens, solBalance, refresh } = useWalletTokens()
  const { addLog, updateLog } = useTransactionLog()
  const [mode, setMode] = useState<SendMode>("sol-to-many")
  const [selectedToken, setSelectedToken] = useState<string | null>(null)
  const [recipients, setRecipients] = useState<Recipient[]>([{ address: "", amount: "" }])
  const [csvInput, setCsvInput] = useState("")
  const [sending, setSending] = useState(false)

  const selectedTokenData = tokens.find((t) => t.mint.toString() === selectedToken)

  const addRecipient = () => {
    setRecipients([...recipients, { address: "", amount: "" }])
  }

  const removeRecipient = (index: number) => {
    setRecipients(recipients.filter((_, i) => i !== index))
  }

  const updateRecipient = (index: number, field: "address" | "amount", value: string) => {
    const newRecipients = [...recipients]
    newRecipients[index][field] = value
    setRecipients(newRecipients)
  }

  const parseCSV = () => {
    const lines = csvInput.trim().split("\n")
    const parsed: Recipient[] = []

    for (const line of lines) {
      const [address, amount] = line.split(",").map((s) => s.trim())
      if (address && amount && isValidPublicKey(address)) {
        parsed.push({ address, amount })
      }
    }

    if (parsed.length > 0) {
      setRecipients(parsed)
      toast.success(`Parsed ${parsed.length} recipients`)
    } else {
      toast.error("No valid recipients found")
    }
  }

  const getTotalAmount = () => {
    return recipients.reduce((sum, r) => sum + (Number.parseFloat(r.amount) || 0), 0)
  }

  const sendTokens = async () => {
    if (!connected) {
      toast.error("Connect wallet to send tokens")
      return
    }
    if (!publicKey || !signTransaction) return

    const validRecipients = recipients.filter((r) => isValidPublicKey(r.address) && Number.parseFloat(r.amount) > 0)
    if (validRecipients.length === 0) {
      toast.error("No valid recipients")
      return
    }

    const totalAmount = getTotalAmount()
    if (mode === "sol-to-many" && totalAmount > solBalance) {
      toast.error("Insufficient SOL balance")
      return
    }

    setSending(true)
    const logId = addLog({
      type: "transfer",
      status: "pending",
      message: `Sending to ${validRecipients.length} recipient(s)...`,
    })

    try {
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed")

      const batchSize = 5
      let totalSent = 0

      for (let i = 0; i < validRecipients.length; i += batchSize) {
        const batch = validRecipients.slice(i, i + batchSize)
        const transaction = new Transaction()
        transaction.recentBlockhash = blockhash
        transaction.feePayer = publicKey

        for (const recipient of batch) {
          const destPubkey = new PublicKey(recipient.address)
          const amount = Number.parseFloat(recipient.amount)

          if (mode === "sol-to-many") {
            transaction.add(
              SystemProgram.transfer({
                fromPubkey: publicKey,
                toPubkey: destPubkey,
                lamports: Math.floor(amount * LAMPORTS_PER_SOL),
              }),
            )
          } else if (selectedTokenData) {
            const sourceAta = await getAssociatedTokenAddress(selectedTokenData.mint, publicKey)
            const destAta = await getAssociatedTokenAddress(selectedTokenData.mint, destPubkey)

            try {
              await getAccount(connection, destAta)
            } catch {
              transaction.add(
                createAssociatedTokenAccountInstruction(publicKey, destAta, destPubkey, selectedTokenData.mint),
              )
            }

            const transferAmount = BigInt(Math.floor(amount * Math.pow(10, selectedTokenData.decimals)))
            transaction.add(
              createTransferCheckedInstruction(
                sourceAta,
                selectedTokenData.mint,
                destAta,
                publicKey,
                transferAmount,
                selectedTokenData.decimals,
                [],
                TOKEN_PROGRAM_ID,
              ),
            )
          }
        }

        const signed = await signTransaction(transaction)
        const signature = await connection.sendRawTransaction(signed.serialize(), {
          skipPreflight: false,
          preflightCommitment: "confirmed",
        })

        await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature }, "confirmed")

        totalSent += batch.length
      }

      updateLog(logId.id, {
        status: "success",
        message: `Sent to ${totalSent} recipient(s)`,
      })

      toast.success(`Sent to ${totalSent} recipients`)
      setRecipients([{ address: "", amount: "" }])
      refresh()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error"
      updateLog(logId.id, {
        status: "error",
        message: `Failed: ${message}`,
      })
      toast.error(`Failed to send: ${message}`)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Mode & Token Selection */}
      <GlassCard className="p-4">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setMode("sol-to-many")}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              mode === "sol-to-many"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-foreground hover:bg-muted",
            )}
          >
            SOL
          </button>
          <button
            onClick={() => setMode("one-to-many")}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              mode === "one-to-many"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-foreground hover:bg-muted",
            )}
          >
            SPL Token
          </button>
        </div>

        {mode === "one-to-many" && (
          <div className="mb-4">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
              Token
            </label>
            <select
              value={selectedToken || ""}
              onChange={(e) => setSelectedToken(e.target.value || null)}
              className="w-full h-9 px-3 rounded-md border border-border bg-input text-sm font-mono text-foreground"
              disabled={!connected}
            >
              <option value="">{connected ? "Select token" : "Connect wallet"}</option>
              {tokens
                .filter((t) => t.amount > BigInt(0))
                .map((token) => (
                  <option key={token.mint.toString()} value={token.mint.toString()}>
                    {shortenAddress(token.mint.toString(), 8)} -{" "}
                    {(Number(token.amount) / Math.pow(10, token.decimals)).toLocaleString()}
                  </option>
                ))}
            </select>
          </div>
        )}

        <div className="p-3 rounded-md bg-secondary">
          <p className="text-xs text-muted-foreground">Balance</p>
          <p className="font-mono text-lg">
            {!connected
              ? "Connect wallet"
              : mode === "sol-to-many"
                ? `${solBalance.toFixed(4)} SOL`
                : selectedTokenData
                  ? `${(Number(selectedTokenData.amount) / Math.pow(10, selectedTokenData.decimals)).toLocaleString()}`
                  : "Select token"}
          </p>
        </div>
      </GlassCard>

      {/* CSV Input */}
      <GlassCard className="p-4">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
          CSV Input (address,amount)
        </label>
        <textarea
          value={csvInput}
          onChange={(e) => setCsvInput(e.target.value)}
          placeholder="address,amount&#10;address,amount"
          className="w-full h-20 px-3 py-2 rounded-md border border-border bg-input text-sm font-mono text-foreground placeholder:text-muted-foreground resize-none"
        />
        <GlassButton variant="outline" size="sm" onClick={parseCSV} className="mt-2">
          Parse CSV
        </GlassButton>
      </GlassCard>

      {/* Recipients */}
      <GlassCard className="p-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Recipients ({recipients.length})
          </span>
          <GlassButton variant="ghost" size="sm" onClick={addRecipient}>
            + Add
          </GlassButton>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {recipients.map((recipient, index) => (
            <div key={index} className="flex gap-2 items-start">
              <div className="flex-1">
                <GlassInput
                  placeholder="Wallet Address"
                  value={recipient.address}
                  onChange={(e) => updateRecipient(index, "address", e.target.value)}
                  error={recipient.address && !isValidPublicKey(recipient.address) ? "Invalid" : undefined}
                />
              </div>
              <div className="w-28">
                <GlassInput
                  type="number"
                  placeholder="Amount"
                  value={recipient.amount}
                  onChange={(e) => updateRecipient(index, "amount", e.target.value)}
                  step="any"
                />
              </div>
              {recipients.length > 1 && (
                <button
                  onClick={() => removeRecipient(index)}
                  className="mt-2 p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Summary & Send */}
      <GlassCard className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="font-mono text-lg">
              {getTotalAmount().toLocaleString()} {mode === "sol-to-many" ? "SOL" : "tokens"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Recipients</p>
            <p className="font-mono text-lg">{recipients.filter((r) => isValidPublicKey(r.address)).length}</p>
          </div>
        </div>

        <GlassButton
          variant="primary"
          onClick={sendTokens}
          loading={sending}
          disabled={sending || (mode === "one-to-many" && !selectedToken)}
          className="w-full"
        >
          {connected ? "Send" : "Connect Wallet to Send"}
        </GlassButton>
      </GlassCard>
    </div>
  )
}
