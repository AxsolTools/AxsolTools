"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { useWalletTokens } from "@/hooks/use-wallet-tokens"
import { shortenAddress } from "@/lib/solana-utils"
import { getRPCStatus, testRPCHealth } from "@/lib/rpc-manager"
import { useState, useEffect } from "react"

export function Header() {
  const { connected, publicKey, disconnect } = useWallet()
  const { setVisible } = useWalletModal()
  const { solBalance } = useWalletTokens()
  const [rpcStatus, setRpcStatus] = useState({ ...getRPCStatus(), healthy: true })

  useEffect(() => {
    const checkHealth = async () => {
      await testRPCHealth()
      setRpcStatus(getRPCStatus())
    }

    checkHealth()

    const interval = setInterval(checkHealth, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="h-14 border-b border-[#1e1e1e] bg-[#0a0a0a] px-4 flex items-center justify-between">
      {/* Left: Logo + Status */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2.5">
          <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="2" fill="#14F195" />
            <path d="M8 22L16 10L24 22H19L16 17L13 22H8Z" fill="#0a0a0a" />
          </svg>
          <span className="text-base font-bold text-white tracking-tight">AXSOL</span>
        </div>

        {/* Status Indicators */}
        <div className="hidden md:flex items-center gap-1 text-[11px] font-mono">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#111] border border-[#1e1e1e] rounded-sm">
            <span
              className={`w-1.5 h-1.5 rounded-full ${rpcStatus.healthy ? "bg-[#14F195] shadow-[0_0_4px_#14F195]" : "bg-red-500 shadow-[0_0_4px_#ef4444]"}`}
            />
            <span className="text-[#666]">RPC</span>
            <span className="text-white">
              {rpcStatus.index + 1}/{rpcStatus.total}
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#111] border border-[#1e1e1e] rounded-sm">
            <span className="text-[#666]">NETWORK</span>
            <span className="text-[#14F195]">MAINNET</span>
          </div>
        </div>
      </div>

      {/* Right: Wallet + Actions */}
      <div className="flex items-center gap-3">
        {/* Balance Display */}
        {connected && publicKey && (
          <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 bg-[#111] border border-[#1e1e1e] rounded-sm text-[11px] font-mono">
            <div className="flex items-center gap-1.5">
              <span className="text-[#14F195] font-semibold">{solBalance.toFixed(4)}</span>
              <span className="text-[#666]">SOL</span>
            </div>
            <div className="w-px h-3 bg-[#1e1e1e]" />
            <span className="text-[#888]">{shortenAddress(publicKey.toString())}</span>
          </div>
        )}

        {/* X/Twitter */}
        <a
          href="https://x.com/Axsoltools"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-9 h-9 bg-[#111] border border-[#1e1e1e] rounded-sm hover:bg-[#1a1a1a] hover:border-[#333] transition-all duration-150"
          aria-label="Follow AXSOL on X"
        >
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>

        {/* Buy AXSOL */}
        <button
          onClick={() => window.open("https://raydium.io/swap/?inputCurrency=sol&outputCurrency=AXSOL", "_blank")}
          className="h-9 px-4 text-[11px] font-bold uppercase tracking-wider bg-[#14F195] text-[#0a0a0a] rounded-sm hover:bg-[#0fdb85] active:bg-[#0cc578] transition-all duration-150"
        >
          Buy AXSOL
        </button>

        {/* Wallet Connect - Custom button instead of WalletMultiButton */}
        {connected ? (
          <button
            onClick={() => disconnect()}
            className="h-9 px-4 text-[11px] font-bold uppercase tracking-wider bg-[#111] text-white border border-[#1e1e1e] rounded-sm hover:bg-[#1a1a1a] hover:border-[#333] active:bg-[#0a0a0a] transition-all duration-150"
          >
            Disconnect
          </button>
        ) : (
          <button
            onClick={() => setVisible(true)}
            className="h-9 px-4 text-[11px] font-bold uppercase tracking-wider bg-[#111] text-white border border-[#14F195] rounded-sm hover:bg-[#14F195] hover:text-[#0a0a0a] active:bg-[#0fdb85] transition-all duration-150"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </header>
  )
}
