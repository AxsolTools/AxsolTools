"use client"

import { useState } from "react"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { Transaction } from "@solana/web3.js"
import { createBurnCheckedInstruction, createCloseAccountInstruction, TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { GlassCard } from "@/components/ui/glass-card"
import { GlassButton } from "@/components/ui/glass-button"
import { GlassInput } from "@/components/ui/glass-input"
import { useWalletTokens } from "@/hooks/use-wallet-tokens"
import { useTransactionLog } from "@/hooks/use-transaction-log"
import { shortenAddress } from "@/lib/solana-utils"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// NO MOCK DATA - Real token burning

export function TokenBurner() {
  const { publicKey, signTransaction, connected } = useWallet()
  const { connection } = useConnection()
  const { tokens, isLoading, refresh } = useWalletTokens()
  const { addLog, updateLog } = useTransactionLog()
  const [selectedToken, setSelectedToken] = useState<string | null>(null)
  const [burnAmount, setBurnAmount] = useState("")
  const [closeAccount, setCloseAccount] = useState(true)
  const [burning, setBurning] = useState(false)

  const selectedTokenData = tokens.find((t) => t.pubkey.toString() === selectedToken)
  const maxAmount = selectedTokenData ? Number(selectedTokenData.amount) / Math.pow(10, selectedTokenData.decimals) : 0

  const burnTokens = async () => {
    if (!connected) {
      toast.error("Connect wallet to burn tokens")
      return
    }
    if (!publicKey || !signTransaction || !selectedTokenData || !burnAmount) return

    const amount = Number.parseFloat(burnAmount)
    if (isNaN(amount) || amount <= 0 || amount > maxAmount) {
      toast.error("Invalid burn amount")
      return
    }

    setBurning(true)
    const logId = addLog({
      type: "burn",
      status: "pending",
      message: `Burning ${amount} tokens...`,
    })

    try {
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed")

      const transaction = new Transaction()
      transaction.recentBlockhash = blockhash
      transaction.feePayer = publicKey

      const burnAmountRaw = BigInt(Math.floor(amount * Math.pow(10, selectedTokenData.decimals)))

      transaction.add(
        createBurnCheckedInstruction(
          selectedTokenData.pubkey,
          selectedTokenData.mint,
          publicKey,
          burnAmountRaw,
          selectedTokenData.decimals,
          [],
          TOKEN_PROGRAM_ID,
        ),
      )

      if (closeAccount && burnAmountRaw === selectedTokenData.amount) {
        transaction.add(
          createCloseAccountInstruction(selectedTokenData.pubkey, publicKey, publicKey, [], TOKEN_PROGRAM_ID),
        )
      }

      const signed = await signTransaction(transaction)
      const signature = await connection.sendRawTransaction(signed.serialize(), {
        skipPreflight: false,
        preflightCommitment: "confirmed",
      })

      await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature }, "confirmed")

      updateLog(logId.id, {
        status: "success",
        message: `Successfully burned ${amount} tokens`,
        signature,
      })

      toast.success(`Burned ${amount} tokens`)
      setSelectedToken(null)
      setBurnAmount("")
      refresh()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error"
      updateLog(logId.id, {
        status: "error",
        message: `Failed to burn tokens: ${message}`,
      })
      toast.error(`Failed to burn tokens: ${message}`)
    } finally {
      setBurning(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Token Selection */}
      <GlassCard className="p-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Select Token</span>
          <GlassButton variant="outline" size="sm" onClick={refresh} disabled={!connected}>
            Refresh
          </GlassButton>
        </div>

        {!connected ? (
          <div className="text-center py-12 border border-dashed border-border rounded-lg">
            <p className="text-sm text-muted-foreground font-mono mb-2">Wallet not connected</p>
            <p className="text-xs text-muted-foreground">Connect your wallet to view and burn tokens</p>
          </div>
        ) : isLoading ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-14 rounded-md bg-secondary animate-pulse" />
            ))}
          </div>
        ) : tokens.filter((t) => t.amount > BigInt(0)).length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground font-mono text-sm">No tokens found</p>
          </div>
        ) : (
          <div className="space-y-1 max-h-72 overflow-y-auto">
            {tokens
              .filter((t) => t.amount > BigInt(0))
              .map((token) => (
                <button
                  key={token.pubkey.toString()}
                  onClick={() => setSelectedToken(token.pubkey.toString())}
                  className={cn(
                    "w-full flex items-center justify-between p-3 rounded-md border transition-colors text-left",
                    selectedToken === token.pubkey.toString()
                      ? "border-primary bg-primary/10"
                      : "border-border hover:bg-secondary",
                  )}
                >
                  <div>
                    <p className="font-mono text-sm">{shortenAddress(token.mint.toString(), 8)}</p>
                    <p className="text-xs text-muted-foreground">decimals: {token.decimals}</p>
                  </div>
                  <p className="font-mono text-sm">
                    {(Number(token.amount) / Math.pow(10, token.decimals)).toLocaleString()}
                  </p>
                </button>
              ))}
          </div>
        )}
      </GlassCard>

      {/* Burn Settings */}
      {selectedToken && selectedTokenData && (
        <GlassCard className="p-4">
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Burn Settings</span>

          <div className="mt-4 space-y-4">
            <div>
              <GlassInput
                type="number"
                value={burnAmount}
                onChange={(e) => setBurnAmount(e.target.value)}
                placeholder="0.00"
                label="Amount"
                max={maxAmount}
                step="any"
              />
              <div className="flex justify-between mt-1.5">
                <span className="text-xs text-muted-foreground font-mono">max: {maxAmount.toLocaleString()}</span>
                <button
                  onClick={() => setBurnAmount(maxAmount.toString())}
                  className="text-xs text-primary hover:underline font-mono"
                >
                  MAX
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={closeAccount}
                onChange={(e) => setCloseAccount(e.target.checked)}
                className="w-4 h-4 rounded border-border bg-input text-primary focus:ring-primary focus:ring-offset-background"
              />
              <span className="text-sm text-foreground">Close account after burning (reclaim ~0.002 SOL rent)</span>
            </label>

            <GlassButton
              variant="destructive"
              onClick={burnTokens}
              loading={burning}
              disabled={burning || !burnAmount}
              className="w-full"
            >
              Burn Tokens
            </GlassButton>
          </div>
        </GlassCard>
      )}
    </div>
  )
}
