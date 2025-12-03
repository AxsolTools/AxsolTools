"use client"

import { useState } from "react"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { Transaction } from "@solana/web3.js"
import { createCloseAccountInstruction, TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { GlassCard } from "@/components/ui/glass-card"
import { GlassButton } from "@/components/ui/glass-button"
import { useEmptyAccounts } from "@/hooks/use-wallet-tokens"
import { useTransactionLog } from "@/hooks/use-transaction-log"
import { shortenAddress, lamportsToSol } from "@/lib/solana-utils"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// NO MOCK DATA - Real account closing

const RENT_EXEMPT_MINIMUM = 2039280

export function AccountCloser() {
  const { publicKey, signTransaction, connected } = useWallet()
  const { connection } = useConnection()
  const { emptyAccounts, isLoading, refresh } = useEmptyAccounts()
  const { addLog, updateLog } = useTransactionLog()
  const [selectedAccounts, setSelectedAccounts] = useState<Set<string>>(new Set())
  const [closing, setClosing] = useState(false)

  const reclaimableSOL = selectedAccounts.size * lamportsToSol(RENT_EXEMPT_MINIMUM)
  const totalReclaimable = emptyAccounts.length * lamportsToSol(RENT_EXEMPT_MINIMUM)

  const toggleAccount = (pubkey: string) => {
    const newSelected = new Set(selectedAccounts)
    if (newSelected.has(pubkey)) {
      newSelected.delete(pubkey)
    } else {
      newSelected.add(pubkey)
    }
    setSelectedAccounts(newSelected)
  }

  const selectAll = () => {
    if (selectedAccounts.size === emptyAccounts.length) {
      setSelectedAccounts(new Set())
    } else {
      setSelectedAccounts(new Set(emptyAccounts.map((a) => a.pubkey.toString())))
    }
  }

  const closeAccounts = async () => {
    if (!connected) {
      toast.error("Connect wallet to close accounts")
      return
    }
    if (!publicKey || !signTransaction || selectedAccounts.size === 0) return

    setClosing(true)
    const logId = addLog({
      type: "close",
      status: "pending",
      message: `Closing ${selectedAccounts.size} empty account(s)...`,
    })

    try {
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed")

      const accountsArray = Array.from(selectedAccounts)
      const batchSize = 10
      let totalClosed = 0

      for (let i = 0; i < accountsArray.length; i += batchSize) {
        const batch = accountsArray.slice(i, i + batchSize)
        const transaction = new Transaction()
        transaction.recentBlockhash = blockhash
        transaction.feePayer = publicKey

        for (const accountPubkey of batch) {
          const account = emptyAccounts.find((a) => a.pubkey.toString() === accountPubkey)
          if (account) {
            transaction.add(createCloseAccountInstruction(account.pubkey, publicKey, publicKey, [], TOKEN_PROGRAM_ID))
          }
        }

        const signed = await signTransaction(transaction)
        const signature = await connection.sendRawTransaction(signed.serialize(), {
          skipPreflight: false,
          preflightCommitment: "confirmed",
        })

        await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature }, "confirmed")

        totalClosed += batch.length
      }

      updateLog(logId.id, {
        status: "success",
        message: `Closed ${totalClosed} account(s), reclaimed ~${reclaimableSOL.toFixed(4)} SOL`,
      })

      toast.success(`Closed ${totalClosed} accounts, reclaimed ~${reclaimableSOL.toFixed(4)} SOL`)
      setSelectedAccounts(new Set())
      refresh()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error"
      updateLog(logId.id, {
        status: "error",
        message: `Failed to close accounts: ${message}`,
      })
      toast.error(`Failed to close accounts: ${message}`)
    } finally {
      setClosing(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <GlassCard className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Empty Accounts Found</p>
            <p className="text-2xl font-mono font-semibold">{connected ? emptyAccounts.length : "—"}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total Reclaimable</p>
            <p className="text-2xl font-mono font-semibold text-success">
              {connected ? `~${totalReclaimable.toFixed(4)} SOL` : "—"}
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Controls */}
      <GlassCard className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <GlassButton
              variant="outline"
              size="sm"
              onClick={selectAll}
              disabled={!connected || emptyAccounts.length === 0}
            >
              {selectedAccounts.size === emptyAccounts.length && emptyAccounts.length > 0
                ? "Deselect All"
                : "Select All"}
            </GlassButton>
            <span className="text-sm text-muted-foreground font-mono">{selectedAccounts.size} selected</span>
          </div>
          <GlassButton variant="outline" size="sm" onClick={refresh} disabled={!connected}>
            Scan
          </GlassButton>
        </div>

        {!connected ? (
          <div className="text-center py-12 border border-dashed border-border rounded-lg">
            <p className="text-sm text-muted-foreground font-mono mb-2">Wallet not connected</p>
            <p className="text-xs text-muted-foreground">Connect your wallet to scan for empty accounts</p>
          </div>
        ) : isLoading ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 rounded-md bg-secondary animate-pulse" />
            ))}
          </div>
        ) : emptyAccounts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground font-mono text-sm">No empty accounts found</p>
          </div>
        ) : (
          <div className="space-y-1 max-h-80 overflow-y-auto">
            {emptyAccounts.map((account) => (
              <button
                key={account.pubkey.toString()}
                onClick={() => toggleAccount(account.pubkey.toString())}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-md border transition-colors text-left",
                  selectedAccounts.has(account.pubkey.toString())
                    ? "border-primary bg-primary/10"
                    : "border-border hover:bg-secondary",
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-4 h-4 rounded border flex items-center justify-center",
                      selectedAccounts.has(account.pubkey.toString())
                        ? "bg-primary border-primary"
                        : "border-muted-foreground",
                    )}
                  >
                    {selectedAccounts.has(account.pubkey.toString()) && (
                      <svg
                        className="w-2.5 h-2.5 text-primary-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="font-mono text-sm">{shortenAddress(account.pubkey.toString(), 8)}</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      mint: {shortenAddress(account.mint.toString(), 6)}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-mono text-success">~{lamportsToSol(RENT_EXEMPT_MINIMUM).toFixed(4)}</span>
              </button>
            ))}
          </div>
        )}
      </GlassCard>

      {/* Action */}
      {selectedAccounts.size > 0 && (
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{selectedAccounts.size} account(s) selected</p>
              <p className="text-sm text-success font-mono">+{reclaimableSOL.toFixed(4)} SOL</p>
            </div>
            <GlassButton variant="primary" onClick={closeAccounts} loading={closing} disabled={closing}>
              Close Accounts
            </GlassButton>
          </div>
        </GlassCard>
      )}
    </div>
  )
}
