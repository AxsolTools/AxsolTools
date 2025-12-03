"use client"

import { useTransactionLog } from "@/hooks/use-transaction-log"
import { cn } from "@/lib/utils"

// NO MOCK DATA - Real transaction logs only

export function TransactionLog() {
  const { logs, clearLogs, exportToCSV } = useTransactionLog()

  const handleExport = () => {
    const csv = exportToCSV()
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `axsol-transactions-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Terminal Header Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-panel-header">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-destructive/80" />
            <span className="w-2 h-2 rounded-full bg-warning/80" />
            <span className="w-2 h-2 rounded-full bg-success/80" />
          </div>
          <span className="text-[10px] text-muted-foreground font-mono uppercase">stdout</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="text-[10px] text-muted-foreground hover:text-primary transition-colors font-mono uppercase"
          >
            export
          </button>
          <button
            onClick={clearLogs}
            className="text-[10px] text-muted-foreground hover:text-primary transition-colors font-mono uppercase"
          >
            clear
          </button>
        </div>
      </div>

      {/* Log Content */}
      <div className="flex-1 overflow-y-auto p-2 font-mono text-[11px] leading-relaxed space-y-0.5">
        {logs.length === 0 ? (
          <div className="text-muted-foreground">
            <span className="text-primary">$</span> awaiting transactions...
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex items-start gap-2">
              <span className="text-muted-foreground shrink-0">
                [{log.timestamp.toLocaleTimeString("en-US", { hour12: false })}]
              </span>
              <span
                className={cn(
                  "shrink-0 uppercase w-12",
                  log.status === "success" && "text-success",
                  log.status === "error" && "text-destructive",
                  log.status === "pending" && "text-warning",
                )}
              >
                {log.status}
              </span>
              <span className="text-foreground flex-1">{log.message}</span>
              {log.signature && (
                <a
                  href={`https://solscan.io/tx/${log.signature}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline shrink-0"
                >
                  [view]
                </a>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
