// NO MOCK DATA - Real Arweave upload endpoint via Irys
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { data, contentType, tags } = await request.json()

    if (!data) {
      return NextResponse.json({ error: "No data provided" }, { status: 400 })
    }

    const buffer = Buffer.from(data, "base64")

    // Try multiple Irys nodes for reliability
    const irysNodes = ["https://node1.irys.xyz", "https://node2.irys.xyz", "https://arweave.net"]

    let lastError: Error | null = null

    for (const node of irysNodes) {
      try {
        // For free uploads, we use the Irys free tier which supports small files
        // Users need to fund their Irys account for larger uploads
        const uploadUrl = `${node}/tx/solana`

        const headers: Record<string, string> = {
          "Content-Type": contentType || "application/octet-stream",
        }

        // Add custom tags if provided
        if (tags && Array.isArray(tags)) {
          tags.forEach((tag: { name: string; value: string }, index: number) => {
            if (tag.name && tag.value) {
              headers[`x-tag-${index}-name`] = tag.name
              headers[`x-tag-${index}-value`] = tag.value
            }
          })
        }

        const response = await fetch(uploadUrl, {
          method: "POST",
          headers,
          body: buffer,
        })

        if (response.ok) {
          const result = await response.json()
          return NextResponse.json({
            id: result.id,
            url: `https://arweave.net/${result.id}`,
            node: node,
          })
        }
      } catch (error) {
        lastError = error as Error
        continue
      }
    }

    // If all nodes fail, provide instructions
    return NextResponse.json(
      {
        error: "Upload failed - Irys nodes unavailable",
        message: "For production use, fund your Irys account at https://irys.xyz",
        details: lastError?.message,
      },
      { status: 503 },
    )
  } catch (error) {
    console.error("Arweave upload error:", error)
    return NextResponse.json(
      {
        error: "Upload failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
