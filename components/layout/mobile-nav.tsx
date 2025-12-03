"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import type { ToolType } from "./sidebar"

interface Tool {
  id: ToolType
  label: string
  comingSoon?: boolean
}

const tools: Tool[] = [
  { id: "nft-burner", label: "NFT Burn" },
  { id: "token-burner", label: "Token Burn" },
  { id: "account-closer", label: "Close Accts" },
  { id: "multi-sender", label: "Multi Send" },
  { id: "token-creator", label: "Create" },
  { id: "arweave-uploader", label: "Upload" },
  { id: "metadata-updater", label: "Metadata" },
  { id: "nft-messenger", label: "Message" },
  { id: "auto-frontrun", label: "FrontRun", comingSoon: true },
  { id: "ai-money", label: "AI Money", comingSoon: true },
]

interface MobileNavProps {
  activeTool: ToolType
  onToolChange: (tool: ToolType) => void
}

export function MobileNav({ activeTool, onToolChange }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed bottom-4 right-4 z-50 w-12 h-12 rounded bg-primary text-primary-foreground shadow-lg flex items-center justify-center"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Bottom Sheet */}
      <div
        className={cn(
          "md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border rounded-t-lg transition-transform duration-200",
          isOpen ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="p-3">
          <div className="w-10 h-1 bg-border rounded-full mx-auto mb-3" />
          <div className="grid grid-cols-3 gap-1.5">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => {
                  onToolChange(tool.id)
                  setIsOpen(false)
                }}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1 p-2.5 rounded text-[10px] font-medium transition-all",
                  activeTool === tool.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                <span className="truncate w-full text-center">{tool.label}</span>
                {tool.comingSoon && (
                  <span className="absolute top-0.5 right-0.5 text-[7px] px-1 py-0.5 rounded bg-amber-500/20 text-amber-400 uppercase">
                    Soon
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
