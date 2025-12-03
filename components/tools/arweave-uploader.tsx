"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { GlassCard } from "@/components/ui/glass-card"
import { GlassButton } from "@/components/ui/glass-button"
import { GlassInput } from "@/components/ui/glass-input"
import { useTransactionLog } from "@/hooks/use-transaction-log"
import { toast } from "sonner"

// NO MOCK DATA - Real Arweave uploads via Irys (Bundlr)

export function ArweaveUploader() {
  const { connected } = useWallet()
  const { addLog, updateLog } = useTransactionLog()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [tags, setTags] = useState<Array<{ name: string; value: string }>>([{ name: "Content-Type", value: "" }])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const newTags = [...tags]
      const contentTypeIndex = newTags.findIndex((t) => t.name === "Content-Type")
      if (contentTypeIndex >= 0) {
        newTags[contentTypeIndex].value = file.type || "application/octet-stream"
      }
      setTags(newTags)
    }
  }

  const addTag = () => {
    setTags([...tags, { name: "", value: "" }])
  }

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index))
  }

  const updateTag = (index: number, field: "name" | "value", value: string) => {
    const newTags = [...tags]
    newTags[index][field] = value
    setTags(newTags)
  }

  const uploadToArweave = async () => {
    if (!connected) {
      toast.error("Connect wallet to upload")
      return
    }
    if (!selectedFile) return

    setUploading(true)
    const logId = addLog({
      type: "upload",
      status: "pending",
      message: `Uploading ${selectedFile.name} to Arweave...`,
    })

    try {
      const arrayBuffer = await selectedFile.arrayBuffer()
      const base64 = Buffer.from(arrayBuffer).toString("base64")

      const response = await fetch("/api/arweave/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: base64,
          contentType: selectedFile.type,
          tags: tags.filter((t) => t.name && t.value),
        }),
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const result = await response.json()
      const url = `https://arweave.net/${result.id}`
      setUploadedUrl(url)

      updateLog(logId.id, {
        status: "success",
        message: `Uploaded to Arweave: ${result.id}`,
      })

      toast.success("File uploaded to Arweave!")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error"
      updateLog(logId.id, {
        status: "error",
        message: `Failed to upload: ${message}`,
      })
      toast.error("Failed to upload to Arweave")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <GlassCard className="p-4">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Arweave Upload</h2>
          <p className="text-xs text-muted-foreground">Permanent decentralized file storage</p>
        </div>

        <div className="space-y-4">
          {/* File Selection */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
          >
            <input ref={fileInputRef} type="file" onChange={handleFileSelect} className="hidden" />
            {selectedFile ? (
              <div>
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(2)} KB - {selectedFile.type}
                </p>
              </div>
            ) : (
              <div>
                <svg
                  className="w-12 h-12 mx-auto text-muted-foreground mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="text-muted-foreground">Click or drag to select a file</p>
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Tags</label>
              <GlassButton variant="ghost" size="sm" onClick={addTag}>
                + Add Tag
              </GlassButton>
            </div>
            <div className="space-y-2">
              {tags.map((tag, index) => (
                <div key={index} className="flex gap-2">
                  <GlassInput
                    placeholder="Tag name"
                    value={tag.name}
                    onChange={(e) => updateTag(index, "name", e.target.value)}
                    className="flex-1"
                  />
                  <GlassInput
                    placeholder="Tag value"
                    value={tag.value}
                    onChange={(e) => updateTag(index, "value", e.target.value)}
                    className="flex-1"
                  />
                  {tags.length > 1 && (
                    <button
                      onClick={() => removeTag(index)}
                      className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <GlassButton
            variant="primary"
            onClick={uploadToArweave}
            loading={uploading}
            disabled={uploading || !selectedFile}
            className="w-full"
          >
            {connected ? "Upload to Arweave" : "Connect Wallet to Upload"}
          </GlassButton>
        </div>
      </GlassCard>

      {uploadedUrl && (
        <GlassCard className="p-4 border-green-500/30 bg-green-500/5">
          <h3 className="font-semibold text-green-400 mb-2">Upload Successful</h3>
          <div className="space-y-2">
            <div>
              <span className="text-sm text-muted-foreground">Arweave URL:</span>
              <code className="block text-sm font-mono bg-secondary px-2 py-1 rounded mt-1 break-all">
                {uploadedUrl}
              </code>
            </div>
            <div className="flex gap-2 mt-3">
              <GlassButton variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(uploadedUrl)}>
                Copy URL
              </GlassButton>
              <GlassButton variant="outline" size="sm" onClick={() => window.open(uploadedUrl, "_blank")}>
                View File
              </GlassButton>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  )
}
