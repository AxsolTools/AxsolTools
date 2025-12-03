import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface PanelProps {
  children: ReactNode
  className?: string
  variant?: "default" | "terminal" | "elevated"
  header?: ReactNode
}

export function GlassCard({ children, className, variant = "default", header }: PanelProps) {
  return (
    <div
      className={cn(
        "rounded border border-border overflow-hidden",
        variant === "default" && "bg-card",
        variant === "terminal" && "bg-terminal-bg font-mono",
        variant === "elevated" && "bg-panel shadow-lg",
        className,
      )}
    >
      {header && <div className="h-9 px-3 flex items-center border-b border-border bg-panel-header">{header}</div>}
      {children}
    </div>
  )
}

// Alias for cleaner naming
export const Panel = GlassCard
