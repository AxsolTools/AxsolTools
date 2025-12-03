"use client"

import { useState, useEffect } from "react"
import { txLogger, type TransactionLog } from "@/lib/transaction-logger"

export function useTransactionLog() {
  const [logs, setLogs] = useState<TransactionLog[]>([])

  useEffect(() => {
    setLogs(txLogger.getLogs())
    return txLogger.subscribe(setLogs)
  }, [])

  return {
    logs,
    addLog: txLogger.addLog.bind(txLogger),
    updateLog: txLogger.updateLog.bind(txLogger),
    clearLogs: txLogger.clearLogs.bind(txLogger),
    exportToCSV: txLogger.exportToCSV.bind(txLogger),
  }
}
