// NO MOCK DATA - Real transaction logging
export interface TransactionLog {
  id: string
  timestamp: Date
  type: "burn" | "close" | "transfer" | "create" | "upload" | "update" | "message" | "info" | "error"
  status: "pending" | "success" | "error"
  message: string
  signature?: string
  details?: Record<string, unknown>
}

type LogListener = (logs: TransactionLog[]) => void

class TransactionLogger {
  private logs: TransactionLog[] = []
  private listeners: Set<LogListener> = new Set()
  private maxLogs = 100

  addLog(log: Omit<TransactionLog, "id" | "timestamp">): TransactionLog {
    const newLog: TransactionLog = {
      ...log,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    }

    this.logs = [newLog, ...this.logs].slice(0, this.maxLogs)
    this.notifyListeners()
    return newLog
  }

  updateLog(id: string, updates: Partial<TransactionLog>): void {
    this.logs = this.logs.map((log) => (log.id === id ? { ...log, ...updates } : log))
    this.notifyListeners()
  }

  getLogs(): TransactionLog[] {
    return [...this.logs]
  }

  clearLogs(): void {
    this.logs = []
    this.notifyListeners()
  }

  subscribe(listener: LogListener): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.getLogs()))
  }

  exportToCSV(): string {
    const headers = ["Timestamp", "Type", "Status", "Message", "Signature"]
    const rows = this.logs.map((log) => [
      log.timestamp.toISOString(),
      log.type,
      log.status,
      log.message,
      log.signature || "",
    ])
    return [headers, ...rows].map((row) => row.join(",")).join("\n")
  }
}

export const txLogger = new TransactionLogger()
