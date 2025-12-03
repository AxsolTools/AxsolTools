"use client"

import type React from "react"

import { cn } from "@/lib/utils"

export type ToolType =
  | "nft-burner"
  | "token-burner"
  | "account-closer"
  | "multi-sender"
  | "token-creator"
  | "arweave-uploader"
  | "metadata-updater"
  | "nft-messenger"
  | "auto-frontrun"
  | "ai-money"

interface Tool {
  id: ToolType
  label: string
  shortcut: string
  icon: React.ReactNode
  comingSoon?: boolean
}

const tools: Tool[] = [
  {
    id: "nft-burner",
    label: "NFT Burner",
    shortcut: "1",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z"
        />
      </svg>
    ),
  },
  {
    id: "token-burner",
    label: "Token Burner",
    shortcut: "2",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    id: "account-closer",
    label: "Close Accounts",
    shortcut: "3",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
        />
      </svg>
    ),
  },
  {
    id: "multi-sender",
    label: "Multi Sender",
    shortcut: "4",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
        />
      </svg>
    ),
  },
  {
    id: "token-creator",
    label: "Create Token",
    shortcut: "5",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    ),
  },
  {
    id: "arweave-uploader",
    label: "Arweave Upload",
    shortcut: "6",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
        />
      </svg>
    ),
  },
  {
    id: "metadata-updater",
    label: "Update Metadata",
    shortcut: "7",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
        />
      </svg>
    ),
  },
  {
    id: "nft-messenger",
    label: "NFT Messenger",
    shortcut: "8",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
        />
      </svg>
    ),
  },
  {
    id: "auto-frontrun",
    label: "Auto FrontRun",
    shortcut: "9",
    comingSoon: true,
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
        />
      </svg>
    ),
  },
  {
    id: "ai-money",
    label: "AI Money",
    shortcut: "0",
    comingSoon: true,
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
        />
      </svg>
    ),
  },
]

interface SidebarProps {
  activeTool: ToolType
  onToolChange: (tool: ToolType) => void
}

export function Sidebar({ activeTool, onToolChange }: SidebarProps) {
  return (
    <aside className="w-52 border-r border-border bg-sidebar flex-col h-full hidden md:flex">
      {/* Section Header */}
      <div className="h-10 px-3 flex items-center border-b border-border bg-panel-header">
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Toolkit</span>
      </div>

      {/* Tool List */}
      <nav className="flex-1 py-1 overflow-y-auto">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onToolChange(tool.id)}
            className={cn(
              "w-full flex items-center gap-2.5 px-3 py-2 text-xs transition-all",
              activeTool === tool.id
                ? "bg-primary/10 text-primary border-l-2 border-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50 border-l-2 border-transparent",
            )}
          >
            <span
              className={cn("transition-colors", activeTool === tool.id ? "text-primary" : "text-muted-foreground")}
            >
              {tool.icon}
            </span>
            <span className="flex-1 text-left">{tool.label}</span>
            {tool.comingSoon ? (
              <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 uppercase tracking-wide">
                Soon
              </span>
            ) : (
              <span
                className={cn(
                  "text-[10px] font-mono px-1 rounded",
                  activeTool === tool.id ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground",
                )}
              >
                {tool.shortcut}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="h-10 px-3 flex items-center justify-between border-t border-border bg-panel-header">
        <span className="text-[10px] text-muted-foreground font-mono">v1.0.0</span>
        <span className="text-[10px] text-muted-foreground">Solana Mainnet</span>
      </div>
    </aside>
  )
}
