"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Sidebar, type ToolType } from "@/components/layout/sidebar"
import { TransactionLog } from "@/components/layout/transaction-log"
import { NFTBurner } from "@/components/tools/nft-burner"
import { TokenBurner } from "@/components/tools/token-burner"
import { AccountCloser } from "@/components/tools/account-closer"
import { MultiSender } from "@/components/tools/multi-sender"
import { TokenCreator } from "@/components/tools/token-creator"
import { ArweaveUploader } from "@/components/tools/arweave-uploader"
import { MetadataUpdater } from "@/components/tools/metadata-updater"
import { NFTMessenger } from "@/components/tools/nft-messenger"
import { AutoFrontRun } from "@/components/tools/auto-frontrun"
import { AIMoney } from "@/components/tools/ai-money"
import { MobileNav } from "@/components/layout/mobile-nav"

// NO MOCK DATA - All components use real blockchain data

const toolComponents: Record<ToolType, React.ComponentType> = {
  "nft-burner": NFTBurner,
  "token-burner": TokenBurner,
  "account-closer": AccountCloser,
  "multi-sender": MultiSender,
  "token-creator": TokenCreator,
  "arweave-uploader": ArweaveUploader,
  "metadata-updater": MetadataUpdater,
  "nft-messenger": NFTMessenger,
  "auto-frontrun": AutoFrontRun,
  "ai-money": AIMoney,
}

const toolInfo: Record<ToolType, { title: string; desc: string }> = {
  "nft-burner": { title: "NFT Burner", desc: "Destroy NFTs and reclaim rent" },
  "token-burner": { title: "Token Burner", desc: "Burn SPL tokens permanently" },
  "account-closer": { title: "Close Accounts", desc: "Reclaim SOL from empty accounts" },
  "multi-sender": { title: "Multi Sender", desc: "Batch transfer tokens" },
  "token-creator": { title: "Create Token", desc: "Deploy new SPL tokens" },
  "arweave-uploader": { title: "Arweave Upload", desc: "Permanent file storage" },
  "metadata-updater": { title: "Update Metadata", desc: "Edit NFT metadata on-chain" },
  "nft-messenger": { title: "NFT Messenger", desc: "Message NFT/domain owners" },
  "auto-frontrun": { title: "Auto FrontRun", desc: "Bundle interception system" },
  "ai-money": { title: "AI Money", desc: "Autonomous liquidity pool" },
}

export default function Home() {
  const [activeTool, setActiveTool] = useState<ToolType>("nft-burner")
  const [logExpanded, setLogExpanded] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const ActiveToolComponent = toolComponents[activeTool]
  const info = toolInfo[activeTool]

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      const tools = Object.keys(toolComponents) as ToolType[]
      const num = Number.parseInt(e.key)
      if (num >= 1 && num <= 10) {
        setActiveTool(tools[num - 1])
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <Sidebar activeTool={activeTool} onToolChange={setActiveTool} />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Tool Panel Header */}
          <div className="h-10 px-4 flex items-center gap-3 bg-panel-header border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-sm font-medium text-foreground">{info.title}</span>
            </div>
            <span className="text-xs text-muted-foreground hidden sm:inline">—</span>
            <span className="text-xs text-muted-foreground hidden sm:inline">{info.desc}</span>
          </div>

          {/* Tool Content */}
          <div className="flex-1 overflow-auto p-4 md:p-6">
            <ActiveToolComponent />
          </div>

          {/* Transaction Log Panel */}
          <div
            className={`border-t border-border bg-terminal-bg transition-all duration-150 ${logExpanded ? "h-48" : "h-9"}`}
          >
            <button
              onClick={() => setLogExpanded(!logExpanded)}
              className="w-full h-9 px-4 flex items-center justify-between hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <svg
                  className="w-3.5 h-3.5 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-xs font-medium text-foreground">Transaction Log</span>
                <span className="text-[10px] text-muted-foreground font-mono ml-1">STDOUT</span>
              </div>
              <svg
                className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${logExpanded ? "" : "rotate-180"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {logExpanded && (
              <div className="h-[calc(100%-36px)] overflow-hidden">
                <TransactionLog />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Mobile Navigation */}
      {isMobile && <MobileNav activeTool={activeTool} onToolChange={setActiveTool} />}
    </div>
  )
}
