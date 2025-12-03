"use client"

export function AutoFrontRun() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Status Banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded px-4 py-3 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        <div>
          <span className="text-amber-400 text-sm font-medium uppercase tracking-wide">Heavy Beta</span>
          <span className="text-muted-foreground text-sm mx-2">|</span>
          <span className="text-muted-foreground text-sm">Private Release Coming Soon</span>
        </div>
      </div>

      {/* Main Title */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">Auto FrontRun</h1>
        <p className="text-muted-foreground text-sm">
          Automated bundle interception and liquidity extraction powered by our private validator infrastructure.
        </p>
      </div>

      {/* How It Works Section */}
      <div className="bg-card border border-border rounded p-5 space-y-4">
        <h2 className="text-sm font-medium text-foreground uppercase tracking-wide flex items-center gap-2">
          <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          How It Works
        </h2>

        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            Bundlers are everywhere on Solana. They coordinate wallet clusters to manipulate charts and extract value
            from traders. With Auto FrontRun, you turn the tables.
          </p>

          <p>
            We operate our own <span className="text-primary font-medium">private validator node</span> on Solana
            mainnet. This gives us direct access to the transaction mempool before blocks are finalized.
          </p>

          <p>
            Our infrastructure monitors pending transactions at the validator level using
            <span className="text-primary font-medium"> high-speed gRPC streams</span>. We detect bundler activity in
            real-time - wallet clusters, coordinated buys, and sell patterns.
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded p-5 space-y-4">
        <h2 className="text-sm font-medium text-foreground uppercase tracking-wide flex items-center gap-2">
          <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
            />
          </svg>
          System Architecture
        </h2>

        <div className="bg-background border border-border rounded p-4 overflow-x-auto">
          <svg viewBox="0 0 900 400" className="w-full h-auto min-w-[600px]" xmlns="http://www.w3.org/2000/svg">
            {/* Background Grid */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
              </pattern>
              <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0d9488" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="dangerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#dc2626" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="successGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#16a34a" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            <rect width="900" height="400" fill="url(#grid)" />

            {/* Bundler Wallets - Left Side */}
            <g transform="translate(30, 80)">
              <rect
                x="0"
                y="0"
                width="120"
                height="100"
                rx="4"
                fill="rgba(239,68,68,0.1)"
                stroke="#ef4444"
                strokeWidth="1"
              />
              <text x="60" y="-10" textAnchor="middle" fill="#ef4444" fontSize="11" fontWeight="500">
                BUNDLER WALLETS
              </text>

              {/* Wallet Icons */}
              <rect
                x="15"
                y="20"
                width="35"
                height="25"
                rx="2"
                fill="rgba(239,68,68,0.2)"
                stroke="#ef4444"
                strokeWidth="0.5"
              />
              <text x="32" y="37" textAnchor="middle" fill="#ef4444" fontSize="8">
                W1
              </text>

              <rect
                x="60"
                y="20"
                width="35"
                height="25"
                rx="2"
                fill="rgba(239,68,68,0.2)"
                stroke="#ef4444"
                strokeWidth="0.5"
              />
              <text x="77" y="37" textAnchor="middle" fill="#ef4444" fontSize="8">
                W2
              </text>

              <rect
                x="15"
                y="55"
                width="35"
                height="25"
                rx="2"
                fill="rgba(239,68,68,0.2)"
                stroke="#ef4444"
                strokeWidth="0.5"
              />
              <text x="32" y="72" textAnchor="middle" fill="#ef4444" fontSize="8">
                W3
              </text>

              <rect
                x="60"
                y="55"
                width="35"
                height="25"
                rx="2"
                fill="rgba(239,68,68,0.2)"
                stroke="#ef4444"
                strokeWidth="0.5"
              />
              <text x="77" y="72" textAnchor="middle" fill="#ef4444" fontSize="8">
                W4
              </text>

              <text x="105" y="50" fill="#ef4444" fontSize="10">
                ...
              </text>
            </g>

            {/* Arrow from Bundlers to Mempool */}
            <g>
              <path d="M 160 130 L 220 130" stroke="#ef4444" strokeWidth="2" fill="none" markerEnd="url(#arrowRed)" />
              <defs>
                <marker
                  id="arrowRed"
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="3"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <path d="M0,0 L0,6 L9,3 z" fill="#ef4444" />
                </marker>
              </defs>
            </g>

            {/* Mempool Cloud */}
            <g transform="translate(230, 70)">
              <ellipse cx="70" cy="60" rx="70" ry="50" fill="rgba(251,146,60,0.1)" stroke="#fb923c" strokeWidth="1" />
              <text x="70" y="50" textAnchor="middle" fill="#fb923c" fontSize="11" fontWeight="500">
                SOLANA
              </text>
              <text x="70" y="65" textAnchor="middle" fill="#fb923c" fontSize="11" fontWeight="500">
                MEMPOOL
              </text>
              <text x="70" y="85" textAnchor="middle" fill="rgba(251,146,60,0.6)" fontSize="9">
                Pending TXs
              </text>
            </g>

            {/* gRPC Stream Arrow */}
            <g>
              <path
                d="M 370 130 L 440 130"
                stroke="#14b8a6"
                strokeWidth="2"
                strokeDasharray="6,3"
                fill="none"
                markerEnd="url(#arrowPrimary)"
              />
              <text x="405" y="120" textAnchor="middle" fill="#14b8a6" fontSize="9" fontWeight="500">
                gRPC
              </text>
              <defs>
                <marker
                  id="arrowPrimary"
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="3"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <path d="M0,0 L0,6 L9,3 z" fill="#14b8a6" />
                </marker>
              </defs>
            </g>

            {/* AXSOL Validator Node */}
            <g transform="translate(450, 50)">
              <rect
                x="0"
                y="0"
                width="180"
                height="160"
                rx="4"
                fill="rgba(20,184,166,0.1)"
                stroke="#14b8a6"
                strokeWidth="1.5"
              />
              <text x="90" y="-10" textAnchor="middle" fill="#14b8a6" fontSize="11" fontWeight="600">
                AXSOL VALIDATOR NODE
              </text>

              {/* Pattern Detection Box */}
              <rect
                x="15"
                y="20"
                width="150"
                height="50"
                rx="3"
                fill="rgba(20,184,166,0.15)"
                stroke="#14b8a6"
                strokeWidth="0.5"
              />
              <text x="90" y="40" textAnchor="middle" fill="#14b8a6" fontSize="10" fontWeight="500">
                Pattern Detection
              </text>
              <text x="90" y="55" textAnchor="middle" fill="rgba(20,184,166,0.7)" fontSize="8">
                AI Cluster Analysis
              </text>

              {/* Auto Executor Box */}
              <rect
                x="15"
                y="85"
                width="150"
                height="50"
                rx="3"
                fill="rgba(20,184,166,0.15)"
                stroke="#14b8a6"
                strokeWidth="0.5"
              />
              <text x="90" y="105" textAnchor="middle" fill="#14b8a6" fontSize="10" fontWeight="500">
                Auto Executor
              </text>
              <text x="90" y="120" textAnchor="middle" fill="rgba(20,184,166,0.7)" fontSize="8">
                FrontRun Engine
              </text>
            </g>

            {/* Arrow to DEX */}
            <g>
              <path d="M 640 130 L 710 130" stroke="#22c55e" strokeWidth="2" fill="none" markerEnd="url(#arrowGreen)" />
              <text x="675" y="120" textAnchor="middle" fill="#22c55e" fontSize="9" fontWeight="500">
                T=0ms
              </text>
              <defs>
                <marker
                  id="arrowGreen"
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="3"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <path d="M0,0 L0,6 L9,3 z" fill="#22c55e" />
                </marker>
              </defs>
            </g>

            {/* DEX/Market */}
            <g transform="translate(720, 80)">
              <rect
                x="0"
                y="0"
                width="130"
                height="100"
                rx="4"
                fill="rgba(34,197,94,0.1)"
                stroke="#22c55e"
                strokeWidth="1"
              />
              <text x="65" y="-10" textAnchor="middle" fill="#22c55e" fontSize="11" fontWeight="500">
                DEX / MARKET
              </text>

              <text x="65" y="35" textAnchor="middle" fill="#22c55e" fontSize="10">
                AXSOL Executes
              </text>
              <text x="65" y="55" textAnchor="middle" fill="#22c55e" fontSize="18" fontWeight="600">
                FIRST
              </text>
              <text x="65" y="80" textAnchor="middle" fill="rgba(34,197,94,0.7)" fontSize="9">
                Profit Extracted
              </text>
            </g>

            {/* Bundler Late Arrow */}
            <g>
              <path
                d="M 160 200 Q 400 280 720 180"
                stroke="#ef4444"
                strokeWidth="1.5"
                strokeDasharray="4,4"
                fill="none"
                markerEnd="url(#arrowRedSmall)"
              />
              <text x="440" y="270" textAnchor="middle" fill="#ef4444" fontSize="9">
                Bundler TX (T=150ms) - TOO LATE
              </text>
              <defs>
                <marker
                  id="arrowRedSmall"
                  markerWidth="8"
                  markerHeight="8"
                  refX="7"
                  refY="2.5"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <path d="M0,0 L0,5 L7,2.5 z" fill="#ef4444" />
                </marker>
              </defs>
            </g>

            {/* Timing Comparison */}
            <g transform="translate(100, 320)">
              <text x="0" y="0" fill="rgba(255,255,255,0.5)" fontSize="10" fontWeight="500">
                LATENCY COMPARISON
              </text>

              {/* AXSOL Bar */}
              <rect
                x="0"
                y="15"
                width="250"
                height="20"
                rx="2"
                fill="rgba(20,184,166,0.2)"
                stroke="#14b8a6"
                strokeWidth="0.5"
              />
              <rect x="0" y="15" width="50" height="20" rx="2" fill="#14b8a6" />
              <text x="260" y="30" fill="#14b8a6" fontSize="10" fontWeight="500">
                AXSOL: ~50ms
              </text>

              {/* Bundler Bar */}
              <rect
                x="0"
                y="45"
                width="250"
                height="20"
                rx="2"
                fill="rgba(239,68,68,0.2)"
                stroke="#ef4444"
                strokeWidth="0.5"
              />
              <rect x="0" y="45" width="200" height="20" rx="2" fill="#ef4444" />
              <text x="260" y="60" fill="#ef4444" fontSize="10" fontWeight="500">
                Bundlers: 100-200ms
              </text>
            </g>

            {/* Profit Flow */}
            <g transform="translate(550, 320)">
              <rect
                x="0"
                y="5"
                width="200"
                height="50"
                rx="4"
                fill="rgba(34,197,94,0.1)"
                stroke="#22c55e"
                strokeWidth="1"
              />
              <text x="100" y="30" textAnchor="middle" fill="#22c55e" fontSize="11" fontWeight="500">
                PROFIT EXTRACTED
              </text>
              <text x="100" y="45" textAnchor="middle" fill="rgba(34,197,94,0.7)" fontSize="9">
                Liquidity from bundler trades
              </text>
            </g>
          </svg>
        </div>
      </div>

      {/* Technical Architecture */}
      <div className="bg-card border border-border rounded p-5 space-y-4">
        <h2 className="text-sm font-medium text-foreground uppercase tracking-wide flex items-center gap-2">
          <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z"
            />
          </svg>
          Technical Specs
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-background border border-border rounded p-3 space-y-1">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Validator</div>
            <div className="text-sm text-foreground font-mono">Private Node</div>
            <div className="text-xs text-muted-foreground">Direct mempool access</div>
          </div>
          <div className="bg-background border border-border rounded p-3 space-y-1">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Latency</div>
            <div className="text-sm text-foreground font-mono">&lt;50ms</div>
            <div className="text-xs text-muted-foreground">Transaction detection</div>
          </div>
          <div className="bg-background border border-border rounded p-3 space-y-1">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Protocol</div>
            <div className="text-sm text-foreground font-mono">High-Speed gRPC</div>
            <div className="text-xs text-muted-foreground">Real-time streaming</div>
          </div>
        </div>
      </div>

      {/* Extraction Strategy */}
      <div className="bg-card border border-border rounded p-5 space-y-4">
        <h2 className="text-sm font-medium text-foreground uppercase tracking-wide flex items-center gap-2">
          <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
            />
          </svg>
          Extraction Strategy
        </h2>

        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            When bundler activity is detected, Auto FrontRun executes
            <span className="text-primary font-medium"> randomized swing trades</span> - strategically timed buys and
            sells that intercept bundler transactions.
          </p>

          <p>
            The system extracts liquidity from coordinated wallet clusters by front-running their entries and exits.
            Randomization prevents pattern detection and ensures sustainable extraction.
          </p>
        </div>

        <div className="bg-background border border-border rounded p-3 space-y-2">
          <div className="text-xs text-muted-foreground uppercase tracking-wide">Execution Flow</div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="text-muted-foreground">Detect Bundle</span>
            <span className="text-muted-foreground">→</span>
            <span className="text-foreground">Analyze Wallets</span>
            <span className="text-muted-foreground">→</span>
            <span className="text-foreground">Calculate Entry</span>
            <span className="text-muted-foreground">→</span>
            <span className="text-primary">Execute FrontRun</span>
            <span className="text-muted-foreground">→</span>
            <span className="text-green-400">Extract Profit</span>
          </div>
        </div>
      </div>

      {/* Access Notice */}
      <div className="bg-card border border-primary/30 rounded p-5 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <h2 className="text-sm font-medium text-foreground uppercase tracking-wide">Private Access</h2>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          Auto FrontRun is currently in <span className="text-amber-400 font-medium">heavy beta</span> and not publicly
          available. A private release is scheduled for select users. Follow our X for announcements and early access
          opportunities.
        </p>

        <div className="flex items-center gap-4 pt-2">
          <a
            href="https://x.com/Axsoltools"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-xs font-medium uppercase tracking-wide px-4 py-2 rounded transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Follow @Axsoltools
          </a>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="text-[10px] text-muted-foreground uppercase tracking-wide text-center py-2">
        This tool is for educational and informational purposes. Use at your own risk.
      </div>
    </div>
  )
}
