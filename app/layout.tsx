import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { WalletProviders } from "@/components/providers/wallet-providers"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" })

export const metadata: Metadata = {
  title: "AXSOL - Solana Toolkit",
  description:
    "Professional Solana utilities: burn NFTs, tokens, close accounts, multi-send, create tokens, upload to Arweave, update metadata, and send NFT messages.",
  keywords: ["Solana", "NFT", "SPL Token", "Burn", "Arweave", "Crypto", "Web3"],
  authors: [{ name: "AXSOL" }],
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#0d9488",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <WalletProviders>{children}</WalletProviders>
        <Toaster position="bottom-right" />
      </body>
    </html>
  )
}
