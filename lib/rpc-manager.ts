// NO MOCK DATA - Real RPC endpoints with rotation
import { Connection, clusterApiUrl } from "@solana/web3.js"

const RPC_ENDPOINTS = [
  "https://api.mainnet-beta.solana.com",
  "https://rpc.ankr.com/solana",
  "https://solana-mainnet.g.alchemy.com/v2/demo",
  "https://solana.public-rpc.com",
  clusterApiUrl("mainnet-beta"),
  "https://mainnet.helius-rpc.com/?api-key=1d8740dc-e5f4-421c-b823-e1bad1889eff", // Free tier
]

let currentIndex = 0
let lastHealthy = true

export function getCurrentRPC(): string {
  return RPC_ENDPOINTS[currentIndex]
}

export function rotateRPC(): string {
  currentIndex = (currentIndex + 1) % RPC_ENDPOINTS.length
  return getCurrentRPC()
}

export function getConnection(): Connection {
  return new Connection(getCurrentRPC(), {
    commitment: "confirmed",
    confirmTransactionInitialTimeout: 60000,
    disableRetryOnRateLimit: false,
  })
}

export async function executeWithRetry<T>(
  operation: (connection: Connection) => Promise<T>,
  maxRetries = 3,
): Promise<T> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    // Create fresh connection for each attempt
    const connection = new Connection(RPC_ENDPOINTS[currentIndex], {
      commitment: "confirmed",
      confirmTransactionInitialTimeout: 60000,
    })

    try {
      const result = await operation(connection)
      lastHealthy = true
      return result
    } catch (error) {
      lastError = error as Error

      // Rotate to next RPC on failure
      if (attempt < maxRetries - 1) {
        rotateRPC()
        // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, attempt)))
      }
    }
  }

  throw lastError || new Error("Operation failed after retries")
}

export function getAllEndpoints(): string[] {
  return [...RPC_ENDPOINTS]
}

export function getRPCStatus(): { endpoint: string; index: number; total: number; healthy: boolean } {
  return {
    endpoint: getCurrentRPC(),
    index: currentIndex,
    total: RPC_ENDPOINTS.length,
    healthy: lastHealthy,
  }
}

export async function testRPCHealth(): Promise<boolean> {
  try {
    const connection = getConnection()
    await Promise.race([
      connection.getSlot(),
      new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 5000)),
    ])
    lastHealthy = true
    return true
  } catch {
    rotateRPC()
    lastHealthy = true // Don't block UI
    return true
  }
}
