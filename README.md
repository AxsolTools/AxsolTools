<div align="center">

# AXSOL

### Validator-Powered Trading Infrastructure for Solana

[![Twitter Follow](https://img.shields.io/twitter/follow/Axsoltools?style=social)](https://x.com/Axsoltools)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16.0.7-black)](https://nextjs.org/)
[![Solana](https://img.shields.io/badge/Solana-Mainnet-14F195)](https://solana.com/)

[Website](https://axsol.tools) · [Twitter](https://x.com/Axsoltools) · [Documentation](#documentation)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
  - [AI Money](#ai-money)
  - [Auto FrontRun](#auto-frontrun)
  - [Utility Tools](#utility-tools)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
  - [Building for Production](#building-for-production)
- [Project Structure](#project-structure)
- [RPC Configuration](#rpc-configuration)
- [Tool Documentation](#tool-documentation)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [Security](#security)
- [License](#license)

---

## Overview

AXSOL is a professional-grade Solana toolkit that provides validator-level trading infrastructure and a comprehensive suite of wallet management utilities. Built for traders, developers, and power users who need reliable, high-performance tools for interacting with the Solana blockchain.

### Why AXSOL?

- **Validator-Level Access**: Private validator node provides priority mempool monitoring
- **Professional Infrastructure**: Auto-rotating RPC endpoints with failover protection
- **Complete Toolkit**: 8+ utilities for token management, NFT operations, and bulk transactions
- **No Mock Data**: Every feature connects to real Solana mainnet infrastructure
- **Open Source**: Full transparency on implementation and logic

---

## Architecture

### System Overview

\`\`\`
┌─────────────────────────────────────────────────────────────────────────────┐
│                              AXSOL PLATFORM                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │
│  │   AI Money      │    │  Auto FrontRun  │    │  Utility Tools  │         │
│  │                 │    │                 │    │                 │         │
│  │  • Pool Mgmt    │    │  • Mempool Scan │    │  • NFT Burner   │         │
│  │  • AI Engine    │    │  • Pattern Det. │    │  • Token Burner │         │
│  │  • Profit Dist  │    │  • Auto Execute │    │  • Multi Sender │         │
│  └────────┬────────┘    └────────┬────────┘    │  • Create Token │         │
│           │                      │             │  • And More...  │         │
│           │                      │             └────────┬────────┘         │
│           └──────────────────────┼──────────────────────┘                  │
│                                  │                                          │
│  ┌───────────────────────────────┴───────────────────────────────────────┐ │
│  │                        CORE INFRASTRUCTURE                             │ │
│  │                                                                        │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                │ │
│  │  │ RPC Manager  │  │ Wallet Adapt │  │ TX Logger    │                │ │
│  │  │              │  │              │  │              │                │ │
│  │  │ • Rotation   │  │ • Phantom    │  │ • Real-time  │                │ │
│  │  │ • Failover   │  │ • Solflare   │  │ • Export CSV │                │ │
│  │  │ • Health     │  │ • Backpack   │  │ • History    │                │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘                │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                  │                                          │
└──────────────────────────────────┼──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          SOLANA BLOCKCHAIN                                   │
│                                                                              │
│    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                   │
│    │  Mainnet    │    │  Validator  │    │   Mempool   │                   │
│    │   RPCs      │    │    Node     │    │   (gRPC)    │                   │
│    └─────────────┘    └─────────────┘    └─────────────┘                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
\`\`\`

### AI Money Flow

\`\`\`
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Depositors  │────▶│  AXSOL Pool  │────▶│  AI Engine   │────▶│  Validator   │
│              │     │              │     │              │     │    Node      │
│  Deposit     │     │  Aggregate   │     │  Scan        │     │  Execute     │
│  AXSOL       │     │  Liquidity   │     │  Mempool     │     │  Trades      │
└──────────────┘     └──────────────┘     └──────────────┘     └──────┬───────┘
       ▲                                                               │
       │                                                               │
       │                    ┌──────────────┐                          │
       │                    │   Profits    │                          │
       └────────────────────│  Distributed │◀─────────────────────────┘
                            │  Proportion- │
                            │    ally      │
                            └──────────────┘
\`\`\`

### Auto FrontRun Detection Flow

\`\`\`
                    ┌─────────────────────────────────────────┐
                    │           SOLANA MEMPOOL                 │
                    │                                         │
                    │   [Bundler TX] [Bundler TX] [Normal TX] │
                    └──────────────────┬──────────────────────┘
                                       │
                                       │ gRPC Stream (~50ms)
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        AXSOL VALIDATOR NODE                                  │
│  ┌─────────────────────┐         ┌─────────────────────┐                   │
│  │  Pattern Detection  │────────▶│   Auto Executor     │                   │
│  │                     │         │                     │                   │
│  │  • Cluster ID       │         │  • Build TX         │                   │
│  │  • Timing Analysis  │         │  • Sign & Send      │                   │
│  │  • Wallet Mapping   │         │  • Confirm          │                   │
│  └─────────────────────┘         └──────────┬──────────┘                   │
│                                              │                              │
└──────────────────────────────────────────────┼──────────────────────────────┘
                                               │
                        T = 0ms                │
                        AXSOL Executes         ▼
                    ┌──────────────────────────────────────┐
                    │            DEX / MARKET              │
                    │                                      │
                    │   AXSOL Trade ✓    Bundler Trade ✗   │
                    │   (Executed)       (Worse Price)     │
                    │                                      │
                    └──────────────────────────────────────┘
                                               ▲
                        T = 150ms              │
                        Bundlers Execute ──────┘
\`\`\`

---

## Features

### AI Money

Autonomous liquidity pool with AI-driven profit generation.

| Feature | Description |
|---------|-------------|
| **Proportional Returns** | Your pool share = your profit share |
| **Real-Time Metrics** | Monitor TVL, daily returns, executed trades |
| **Flexible Withdrawals** | Withdraw anytime with tiered penalties |
| **AI Execution** | Automated opportunity detection and execution |

**Withdrawal Penalty Tiers:**

| Duration | Penalty |
|----------|---------|
| 0-7 days | 5% |
| 7-14 days | 3% |
| 14-30 days | 1% |
| 30+ days | 0% |

**Status:** Private Beta (95% Complete)

### Auto FrontRun

Real-time bundler detection and counter-execution system.

| Feature | Description |
|---------|-------------|
| **Mempool Monitoring** | Direct gRPC stream via private validator |
| **Bundler Detection** | AI pattern recognition of coordinated clusters |
| **Auto Execution** | Front-run bundler trades automatically |
| **Speed Advantage** | ~50ms detection vs 100-200ms bundler latency |

**Status:** Private Beta (Coming Soon)

### Utility Tools

| Tool | Description | Status |
|------|-------------|--------|
| **NFT Burner** | Batch burn unwanted NFTs, reclaim rent | Live |
| **Token Burner** | Destroy SPL tokens with optional account close | Live |
| **Close Accounts** | Reclaim SOL from empty token accounts | Live |
| **Multi Sender** | Bulk transfers: 1-to-many or many-to-1 | Live |
| **Create Token** | Launch tokens via PumpPortal (pump.fun/bonk.fun) | Live |
| **Arweave Upload** | Permanent file storage on Arweave | Live |
| **Update Metadata** | Edit NFT metadata and attributes | Live |
| **NFT Messenger** | Send messages to NFT/domain owners | Live |

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.0.7 | React framework with App Router |
| React | 19.2.0 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Styling |
| Radix UI | Various | Accessible components |
| Lucide React | 0.454.0 | Icons |

### Blockchain

| Technology | Version | Purpose |
|------------|---------|---------|
| @solana/web3.js | 1.98.4 | Solana JavaScript SDK |
| @solana/spl-token | 0.4.14 | SPL Token operations |
| @solana/wallet-adapter | 0.15.39 | Wallet connections |

### State Management

| Technology | Version | Purpose |
|------------|---------|---------|
| SWR | 2.3.7 | Data fetching and caching |
| React Hook Form | 7.60.0 | Form state management |
| Zod | 3.25.76 | Schema validation |

---

## Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0 (recommended) or npm/yarn
- **Solana Wallet** (Phantom, Solflare, or Backpack)

### Installation

1. **Clone the repository**

\`\`\`bash
git clone https://github.com/axsoltools/axsol-toolkit.git
cd axsol-toolkit
\`\`\`

2. **Install dependencies**

\`\`\`bash
pnpm install
\`\`\`

Or with npm:

\`\`\`bash
npm install
\`\`\`

Or with yarn:

\`\`\`bash
yarn install
\`\`\`

### Environment Variables

Create a `.env.local` file in the root directory:

\`\`\`env
# Optional: Custom RPC endpoints (comma-separated)
NEXT_PUBLIC_CUSTOM_RPC_ENDPOINTS=https://your-rpc.com

# Optional: Arweave/Irys configuration
ARWEAVE_WALLET_KEY=your-arweave-wallet-json
\`\`\`

> **Note:** The application works without any environment variables by using public RPC endpoints with automatic rotation.

### Running Locally

**Development mode:**

\`\`\`bash
pnpm dev
\`\`\`

The application will be available at `http://localhost:3000`

**With turbopack (faster):**

\`\`\`bash
pnpm dev --turbo
\`\`\`

### Building for Production

1. **Build the application**

\`\`\`bash
pnpm build
\`\`\`

2. **Start production server**

\`\`\`bash
pnpm start
\`\`\`

### Deployment

**Vercel (Recommended):**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/axsoltools/axsol-toolkit)

**Docker:**

\`\`\`dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
\`\`\`

---

## Project Structure

\`\`\`
axsol-toolkit/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   └── arweave/
│   │       └── upload/
│   │           └── route.ts      # Arweave upload endpoint
│   ├── globals.css               # Global styles & theme
│   ├── layout.tsx                # Root layout with providers
│   └── page.tsx                  # Main application page
│
├── components/
│   ├── layout/                   # Layout components
│   │   ├── header.tsx            # Top navigation bar
│   │   ├── sidebar.tsx           # Tool selection sidebar
│   │   ├── mobile-nav.tsx        # Mobile navigation
│   │   └── transaction-log.tsx   # Transaction history panel
│   │
│   ├── providers/                # React context providers
│   │   └── wallet-providers.tsx  # Solana wallet adapter setup
│   │
│   ├── tools/                    # Tool implementations
│   │   ├── nft-burner.tsx        # NFT burning tool
│   │   ├── token-burner.tsx      # Token burning tool
│   │   ├── account-closer.tsx    # Empty account closer
│   │   ├── multi-sender.tsx      # Bulk transfer tool
│   │   ├── token-creator.tsx     # PumpPortal token launcher
│   │   ├── arweave-uploader.tsx  # Arweave file upload
│   │   ├── metadata-updater.tsx  # NFT metadata editor
│   │   ├── nft-messenger.tsx     # NFT/domain messaging
│   │   ├── ai-money.tsx          # AI Money pool interface
│   │   └── auto-frontrun.tsx     # Auto FrontRun interface
│   │
│   └── ui/                       # Reusable UI components
│       ├── glass-card.tsx        # Card component
│       ├── glass-button.tsx      # Button component
│       ├── glass-input.tsx       # Input component
│       └── ...                   # shadcn/ui components
│
├── hooks/                        # Custom React hooks
│   ├── use-nfts.ts               # NFT fetching hook
│   ├── use-wallet-tokens.ts      # Token balance hook
│   └── use-transaction-log.ts    # Transaction logging hook
│
├── lib/                          # Utility libraries
│   ├── rpc-manager.ts            # RPC rotation & health checks
│   ├── solana-utils.ts           # Solana helper functions
│   ├── transaction-logger.ts     # Transaction logging utility
│   └── utils.ts                  # General utilities
│
├── public/                       # Static assets
│   ├── logo.svg                  # AXSOL logo
│   └── favicon.svg               # Browser favicon
│
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript configuration
├── next.config.mjs               # Next.js configuration
└── README.md                     # This file
\`\`\`

---

## RPC Configuration

AXSOL uses automatic RPC rotation with health checks to ensure reliable connections.

### Default RPC Endpoints

\`\`\`typescript
const RPC_ENDPOINTS = [
  'https://api.mainnet-beta.solana.com',
  'https://solana-mainnet.g.alchemy.com/v2/demo',
  'https://rpc.ankr.com/solana',
  'https://solana.getblock.io/mainnet',
  'https://solana-api.projectserum.com',
];
\`\`\`

### RPC Manager Features

| Feature | Description |
|---------|-------------|
| **Auto Rotation** | Automatically switches to next endpoint on failure |
| **Health Checks** | Periodic connectivity verification (30s interval) |
| **Timeout Handling** | 5-second timeout per request |
| **Failover** | Cycles through all endpoints before failing |

### Custom RPC Configuration

To use your own RPC endpoint(s), set the environment variable:

\`\`\`env
NEXT_PUBLIC_CUSTOM_RPC_ENDPOINTS=https://your-premium-rpc.com,https://backup-rpc.com
\`\`\`

---

## Tool Documentation

### 1. NFT Burner

Permanently destroy NFTs and reclaim the rent SOL.

**Usage:**
1. Connect your wallet
2. Select NFTs to burn (batch selection supported)
3. Set priority fee (optional)
4. Click "Burn Selected NFTs"
5. Approve transaction in wallet

**Technical Details:**
- Uses `createBurnCheckedInstruction` from `@solana/spl-token`
- Automatically closes token account after burn
- Batch processing: 5 NFTs per transaction

---

### 2. Token Burner

Destroy SPL tokens from your wallet.

**Usage:**
1. Connect your wallet
2. Select token from dropdown
3. Enter amount to burn
4. Toggle "Close account after burn" (optional)
5. Click "Burn Tokens"

**Technical Details:**
- Supports both Token Program and Token-2022
- Optional account closure reclaims ~0.002 SOL rent

---

### 3. Close Accounts

Reclaim SOL from empty token accounts.

**Usage:**
1. Connect your wallet
2. Click "Scan for Empty Accounts"
3. Review accounts and reclaimable SOL
4. Click "Close All Empty Accounts"

**Technical Details:**
- Identifies accounts with 0 balance
- Batch processing: 10 accounts per transaction
- ~0.002 SOL reclaimed per account

---

### 4. Multi Sender

Send tokens to multiple addresses in one transaction.

**Modes:**
- **One to Many**: Same token to multiple recipients
- **Many to One**: Multiple tokens to single recipient

**Usage:**
1. Select mode and token
2. Add recipients (manual or CSV upload)
3. Set amounts for each recipient
4. Click "Send Tokens"

**CSV Format:**
\`\`\`csv
address,amount
RecipientAddress1,100
RecipientAddress2,50
\`\`\`

---

### 5. Create Token

Launch tokens on pump.fun or bonk.fun via PumpPortal API.

**Usage:**
1. Select platform (pump.fun or bonk.fun)
2. Upload token image
3. Fill token details (name, symbol, description)
4. Add social links (optional)
5. Set dev buy amount and slippage
6. Click "Create Token"

**Technical Details:**
- Uploads metadata to IPFS via pump.fun API
- Uses PumpPortal `/api/trade-local` for transaction building
- User signs with own wallet + generated mint keypair

---

### 6. Arweave Upload

Upload files to Arweave for permanent storage.

**Usage:**
1. Select file(s) to upload
2. Add custom tags (optional)
3. Click "Upload to Arweave"
4. Copy transaction ID

**Technical Details:**
- Uses Irys (Bundlr) network nodes
- Supports multiple file types
- Returns permanent Arweave transaction ID

---

### 7. Update Metadata

Edit NFT metadata and attributes.

**Usage:**
1. Connect wallet and select NFT
2. Edit name, symbol, or URI
3. Modify attributes
4. Click "Update Metadata"

**Technical Details:**
- Uses Metaplex Token Metadata program
- Requires update authority signature

---

### 8. NFT Messenger

Send on-chain messages to NFT or domain owners.

**Usage:**
1. Enter NFT address or .sol domain
2. Compose your message
3. Click "Send Message"

**Technical Details:**
- Uses Solana memo program
- Message stored permanently on-chain
- Resolves .sol domains via SNS

---

## API Reference

### Arweave Upload Endpoint

**POST** `/api/arweave/upload`

Upload files to Arweave network.

**Request:**
\`\`\`typescript
// FormData
{
  file: File,           // File to upload
  tags?: string         // JSON stringified tags array
}
\`\`\`

**Response:**
\`\`\`typescript
{
  success: boolean,
  id: string,           // Arweave transaction ID
  url: string           // Permanent Arweave URL
}
\`\`\`

---

## Contributing

We welcome contributions from the community.

### Development Workflow

1. **Fork the repository**

2. **Create a feature branch**
\`\`\`bash
git checkout -b feature/your-feature-name
\`\`\`

3. **Make your changes**

4. **Run linting**
\`\`\`bash
pnpm lint
\`\`\`

5. **Test locally**
\`\`\`bash
pnpm dev
\`\`\`

6. **Commit with conventional commits**
\`\`\`bash
git commit -m "feat: add new feature"
git commit -m "fix: resolve issue with X"
git commit -m "docs: update README"
\`\`\`

7. **Push and create PR**
\`\`\`bash
git push origin feature/your-feature-name
\`\`\`

### Code Style

- TypeScript strict mode enabled
- ESLint configuration enforced
- Prettier formatting (2 space indent)
- Conventional commit messages

### Pull Request Guidelines

- Clear description of changes
- Link to related issues
- Screenshots for UI changes
- Test coverage for new features

---

## Security

### Wallet Security

- **No Private Keys**: AXSOL never requests or stores private keys
- **Client-Side Signing**: All transactions signed locally in user's wallet
- **Open Source**: Full code transparency for audit

### Reporting Vulnerabilities

If you discover a security vulnerability, please email security@axsol.tools or DM [@Axsoltools](https://x.com/Axsoltools) on X.

**Do not open public issues for security vulnerabilities.**

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

\`\`\`
MIT License

Copyright (c) 2024 AXSOL

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
\`\`\`

---

<div align="center">

### Connect With Us

[![Twitter](https://img.shields.io/badge/Twitter-@Axsoltools-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://x.com/Axsoltools)
[![Website](https://img.shields.io/badge/Website-axsol.tools-14F195?style=for-the-badge&logo=vercel&logoColor=white)](https://axsol.tools)

**Built with validator-level infrastructure for Solana traders.**

</div>
