"use client"

import { useMemo, useState, useEffect, type ReactNode } from "react"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets"
import { getCurrentRPC } from "@/lib/rpc-manager"

import "@solana/wallet-adapter-react-ui/styles.css"

interface WalletProvidersProps {
  children: ReactNode
}

export function WalletProviders({ children }: WalletProvidersProps) {
  const [endpoint, setEndpoint] = useState(() => getCurrentRPC())

  useEffect(() => {
    const checkRPC = setInterval(() => {
      const current = getCurrentRPC()
      if (current !== endpoint) {
        setEndpoint(current)
      }
    }, 5000)

    return () => clearInterval(checkRPC)
  }, [endpoint])

  const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter()], [])

  return (
    <ConnectionProvider
      endpoint={endpoint}
      config={{
        commitment: "confirmed",
        confirmTransactionInitialTimeout: 60000,
      }}
    >
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
