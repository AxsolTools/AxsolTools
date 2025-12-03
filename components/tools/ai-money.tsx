"use client"

export function AIMoney() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Status Banner */}
      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <span className="text-emerald-400 text-sm font-medium uppercase tracking-wide">Private Beta</span>
            <span className="text-muted-foreground text-sm mx-2">|</span>
            <span className="text-muted-foreground text-sm">95% Complete - Public Beta Soon</span>
          </div>
        </div>
        <div className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">95%</div>
      </div>

      {/* Main Title */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">AI Money</h1>
        <p className="text-muted-foreground text-sm max-w-2xl">
          Autonomous liquidity pool powered by validator-level infrastructure. Deposit AXSOL, earn proportional returns
          from AI-executed blockchain opportunities.
        </p>
      </div>

      {/* Architecture Diagram */}
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

        {/* SVG Diagram */}
        <div className="bg-background border border-border rounded p-4 overflow-x-auto">
          <svg viewBox="0 0 900 400" className="w-full min-w-[700px] h-auto" style={{ maxHeight: "350px" }}>
            {/* Background Grid */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
              </pattern>
              <linearGradient id="poolGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(20,184,166,0.3)" />
                <stop offset="100%" stopColor="rgba(20,184,166,0.1)" />
              </linearGradient>
              <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#14b8a6" stopOpacity="0" />
                <stop offset="50%" stopColor="#14b8a6" stopOpacity="1" />
                <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
              </linearGradient>
            </defs>
            <rect width="900" height="400" fill="url(#grid)" />

            {/* User Deposits - Left Side */}
            <g transform="translate(50, 80)">
              <rect
                x="0"
                y="0"
                width="140"
                height="100"
                rx="4"
                fill="rgba(255,255,255,0.03)"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
              <text x="70" y="25" textAnchor="middle" fill="#a1a1aa" fontSize="10" fontFamily="monospace">
                DEPOSITORS
              </text>
              <rect
                x="15"
                y="40"
                width="50"
                height="20"
                rx="2"
                fill="rgba(20,184,166,0.2)"
                stroke="#14b8a6"
                strokeWidth="0.5"
              />
              <text x="40" y="54" textAnchor="middle" fill="#14b8a6" fontSize="9" fontFamily="monospace">
                User 1
              </text>
              <rect
                x="75"
                y="40"
                width="50"
                height="20"
                rx="2"
                fill="rgba(20,184,166,0.2)"
                stroke="#14b8a6"
                strokeWidth="0.5"
              />
              <text x="100" y="54" textAnchor="middle" fill="#14b8a6" fontSize="9" fontFamily="monospace">
                User 2
              </text>
              <rect
                x="15"
                y="68"
                width="50"
                height="20"
                rx="2"
                fill="rgba(20,184,166,0.2)"
                stroke="#14b8a6"
                strokeWidth="0.5"
              />
              <text x="40" y="82" textAnchor="middle" fill="#14b8a6" fontSize="9" fontFamily="monospace">
                User 3
              </text>
              <rect
                x="15"
                y="68"
                width="50"
                height="20"
                rx="2"
                fill="rgba(20,184,166,0.15)"
                stroke="#14b8a6"
                strokeWidth="0.5"
                strokeDasharray="2,2"
              />
              <text x="100" y="82" textAnchor="middle" fill="#14b8a6" fontSize="9" fontFamily="monospace" opacity="0.6">
                + more
              </text>
            </g>

            {/* Arrow 1: Deposits to Pool */}
            <g>
              <line x1="200" y1="130" x2="270" y2="130" stroke="url(#flowGradient)" strokeWidth="2" />
              <polygon points="270,126 280,130 270,134" fill="#14b8a6" />
              <text x="235" y="120" textAnchor="middle" fill="#a1a1aa" fontSize="8" fontFamily="monospace">
                AXSOL
              </text>
            </g>

            {/* Liquidity Pool - Center */}
            <g transform="translate(290, 60)">
              <rect
                x="0"
                y="0"
                width="160"
                height="140"
                rx="4"
                fill="url(#poolGradient)"
                stroke="#14b8a6"
                strokeWidth="1.5"
              />
              <text
                x="80"
                y="25"
                textAnchor="middle"
                fill="#14b8a6"
                fontSize="11"
                fontFamily="monospace"
                fontWeight="bold"
              >
                AXSOL POOL
              </text>
              <line x1="20" y1="40" x2="140" y2="40" stroke="rgba(20,184,166,0.3)" strokeWidth="0.5" />
              <text x="80" y="60" textAnchor="middle" fill="#e4e4e7" fontSize="10" fontFamily="monospace">
                Total Value Locked
              </text>
              <text
                x="80"
                y="80"
                textAnchor="middle"
                fill="#14b8a6"
                fontSize="14"
                fontFamily="monospace"
                fontWeight="bold"
              >
                ---,--- AXSOL
              </text>
              <text x="80" y="105" textAnchor="middle" fill="#a1a1aa" fontSize="9" fontFamily="monospace">
                Proportional Shares
              </text>
              <rect x="25" y="115" width="110" height="16" rx="2" fill="rgba(255,255,255,0.05)" />
              <rect x="25" y="115" width="75" height="16" rx="2" fill="rgba(20,184,166,0.3)" />
              <text x="80" y="127" textAnchor="middle" fill="#e4e4e7" fontSize="8" fontFamily="monospace">
                Your Share: --%
              </text>
            </g>

            {/* Arrow 2: Pool to AI Engine */}
            <g>
              <line x1="460" y1="130" x2="520" y2="130" stroke="url(#flowGradient)" strokeWidth="2" />
              <polygon points="520,126 530,130 520,134" fill="#14b8a6" />
              <text x="490" y="120" textAnchor="middle" fill="#a1a1aa" fontSize="8" fontFamily="monospace">
                FUND
              </text>
            </g>

            {/* AI Engine - Right */}
            <g transform="translate(540, 50)">
              <rect
                x="0"
                y="0"
                width="160"
                height="160"
                rx="4"
                fill="rgba(139,92,246,0.1)"
                stroke="rgba(139,92,246,0.4)"
                strokeWidth="1"
              />
              <text
                x="80"
                y="25"
                textAnchor="middle"
                fill="#a78bfa"
                fontSize="11"
                fontFamily="monospace"
                fontWeight="bold"
              >
                AI ENGINE
              </text>
              <line x1="15" y1="38" x2="145" y2="38" stroke="rgba(139,92,246,0.2)" strokeWidth="0.5" />

              {/* AI Components */}
              <rect
                x="15"
                y="50"
                width="130"
                height="24"
                rx="2"
                fill="rgba(139,92,246,0.1)"
                stroke="rgba(139,92,246,0.3)"
                strokeWidth="0.5"
              />
              <text x="80" y="66" textAnchor="middle" fill="#c4b5fd" fontSize="9" fontFamily="monospace">
                Mempool Scanner
              </text>

              <rect
                x="15"
                y="82"
                width="130"
                height="24"
                rx="2"
                fill="rgba(139,92,246,0.1)"
                stroke="rgba(139,92,246,0.3)"
                strokeWidth="0.5"
              />
              <text x="80" y="98" textAnchor="middle" fill="#c4b5fd" fontSize="9" fontFamily="monospace">
                Opportunity Detector
              </text>

              <rect
                x="15"
                y="114"
                width="130"
                height="24"
                rx="2"
                fill="rgba(139,92,246,0.1)"
                stroke="rgba(139,92,246,0.3)"
                strokeWidth="0.5"
              />
              <text x="80" y="130" textAnchor="middle" fill="#c4b5fd" fontSize="9" fontFamily="monospace">
                Auto Executor
              </text>
            </g>

            {/* Validator Node - Top Right */}
            <g transform="translate(720, 30)">
              <rect
                x="0"
                y="0"
                width="130"
                height="80"
                rx="4"
                fill="rgba(251,191,36,0.1)"
                stroke="rgba(251,191,36,0.4)"
                strokeWidth="1"
              />
              <text
                x="65"
                y="22"
                textAnchor="middle"
                fill="#fbbf24"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
              >
                VALIDATOR
              </text>
              <line x1="10" y1="32" x2="120" y2="32" stroke="rgba(251,191,36,0.2)" strokeWidth="0.5" />
              <text x="65" y="50" textAnchor="middle" fill="#fcd34d" fontSize="9" fontFamily="monospace">
                Private Node
              </text>
              <text x="65" y="66" textAnchor="middle" fill="#a1a1aa" fontSize="8" fontFamily="monospace">
                Priority Access
              </text>
            </g>

            {/* Connection: AI to Validator */}
            <g>
              <path
                d="M700 100 Q720 70 720 70"
                fill="none"
                stroke="rgba(251,191,36,0.4)"
                strokeWidth="1"
                strokeDasharray="4,2"
              />
            </g>

            {/* Blockchain/Mempool - Bottom Right */}
            <g transform="translate(720, 130)">
              <rect
                x="0"
                y="0"
                width="130"
                height="80"
                rx="4"
                fill="rgba(255,255,255,0.02)"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
              <text x="65" y="22" textAnchor="middle" fill="#a1a1aa" fontSize="10" fontFamily="monospace">
                SOLANA
              </text>
              <line x1="10" y1="32" x2="120" y2="32" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
              <text x="65" y="50" textAnchor="middle" fill="#71717a" fontSize="9" fontFamily="monospace">
                Mempool
              </text>
              <text x="65" y="66" textAnchor="middle" fill="#71717a" fontSize="8" fontFamily="monospace">
                Pending TXs
              </text>
            </g>

            {/* Connection: AI to Blockchain */}
            <g>
              <line
                x1="700"
                y1="150"
                x2="720"
                y2="160"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
                strokeDasharray="4,2"
              />
            </g>

            {/* Returns Flow - Bottom */}
            <g transform="translate(290, 230)">
              <rect
                x="0"
                y="0"
                width="160"
                height="50"
                rx="4"
                fill="rgba(34,197,94,0.1)"
                stroke="rgba(34,197,94,0.4)"
                strokeWidth="1"
              />
              <text
                x="80"
                y="20"
                textAnchor="middle"
                fill="#22c55e"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
              >
                PROFITS
              </text>
              <text x="80" y="38" textAnchor="middle" fill="#86efac" fontSize="9" fontFamily="monospace">
                Auto-distributed to Pool
              </text>
            </g>

            {/* Arrow: AI to Profits */}
            <g>
              <path d="M620 210 Q500 240 450 240" fill="none" stroke="rgba(34,197,94,0.4)" strokeWidth="1.5" />
              <polygon points="455,237 448,240 455,243" fill="#22c55e" />
            </g>

            {/* Arrow: Profits back to Pool */}
            <g>
              <line x1="370" y1="230" x2="370" y2="205" stroke="rgba(34,197,94,0.4)" strokeWidth="1.5" />
              <polygon points="367,208 370,200 373,208" fill="#22c55e" />
            </g>

            {/* Arrow: Pool to Users (Returns) */}
            <g>
              <path d="M290 170 Q200 200 150 200" fill="none" stroke="rgba(34,197,94,0.4)" strokeWidth="1.5" />
              <polygon points="155,197 145,200 155,203" fill="#22c55e" />
              <text x="220" y="195" textAnchor="middle" fill="#22c55e" fontSize="8" fontFamily="monospace">
                YIELD
              </text>
            </g>

            {/* User Returns */}
            <g transform="translate(50, 200)">
              <rect
                x="0"
                y="0"
                width="90"
                height="40"
                rx="4"
                fill="rgba(34,197,94,0.1)"
                stroke="rgba(34,197,94,0.3)"
                strokeWidth="1"
              />
              <text x="45" y="18" textAnchor="middle" fill="#22c55e" fontSize="9" fontFamily="monospace">
                Your Returns
              </text>
              <text x="45" y="32" textAnchor="middle" fill="#86efac" fontSize="8" fontFamily="monospace">
                Proportional %
              </text>
            </g>

            {/* Legend */}
            <g transform="translate(50, 320)">
              <text x="0" y="0" fill="#71717a" fontSize="9" fontFamily="monospace">
                FLOW:
              </text>
              <circle cx="60" cy="-3" r="4" fill="#14b8a6" />
              <text x="70" y="0" fill="#a1a1aa" fontSize="8" fontFamily="monospace">
                Deposits
              </text>
              <circle cx="140" cy="-3" r="4" fill="#a78bfa" />
              <text x="150" y="0" fill="#a1a1aa" fontSize="8" fontFamily="monospace">
                AI Processing
              </text>
              <circle cx="240" cy="-3" r="4" fill="#22c55e" />
              <text x="250" y="0" fill="#a1a1aa" fontSize="8" fontFamily="monospace">
                Returns
              </text>
            </g>
          </svg>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-card border border-border rounded p-5 space-y-4">
        <h2 className="text-sm font-medium text-foreground uppercase tracking-wide flex items-center gap-2">
          <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
            />
          </svg>
          How It Works
        </h2>

        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p>
            AI Money operates like a decentralized hedge fund. You deposit{" "}
            <span className="text-primary font-medium">AXSOL tokens</span> into the pool. The pool funds our AI-driven
            trading engine, which runs 24/7.
          </p>

          <p>
            Our <span className="text-primary font-medium">private validator node</span> gives us priority access to
            Solana's mempool. We see pending transactions before they're confirmed - faster than anyone using public
            RPCs.
          </p>

          <p>
            The AI continuously scans for profitable opportunities: arbitrage, liquidations, mispricings, and more. When
            it finds one, it executes automatically using pool funds. Profits flow back to the pool and are distributed
            proportionally to all depositors.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-card border border-border rounded p-4 space-y-1">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Pool Status</div>
          <div className="text-lg text-foreground font-mono">Private Beta</div>
        </div>
        <div className="bg-card border border-border rounded p-4 space-y-1">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Completion</div>
          <div className="text-lg text-emerald-400 font-mono">95%</div>
        </div>
        <div className="bg-card border border-border rounded p-4 space-y-1">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Min Deposit</div>
          <div className="text-lg text-foreground font-mono">TBA</div>
        </div>
        <div className="bg-card border border-border rounded p-4 space-y-1">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Withdrawals</div>
          <div className="text-lg text-foreground font-mono">Anytime</div>
        </div>
      </div>

      {/* Key Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded p-5 space-y-3">
          <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
            <svg
              className="w-4 h-4 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Proportional Returns
          </h3>
          <p className="text-sm text-muted-foreground">
            Your share of profits is proportional to your deposit. If you hold 5% of the pool, you receive 5% of all
            profits generated.
          </p>
        </div>

        <div className="bg-card border border-border rounded p-5 space-y-3">
          <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
            <svg
              className="w-4 h-4 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"
              />
            </svg>
            Real-Time Metrics
          </h3>
          <p className="text-sm text-muted-foreground">
            Monitor pool TVL, daily/weekly returns, your share percentage, and all executed trades in real-time.
          </p>
        </div>

        <div className="bg-card border border-border rounded p-5 space-y-3">
          <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
            <svg
              className="w-4 h-4 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
            Flexible Withdrawals
          </h3>
          <p className="text-sm text-muted-foreground">
            Withdraw your funds at any time. No lock-up periods. Early withdrawal penalties apply to maintain pool
            stability.
          </p>
        </div>

        <div className="bg-card border border-border rounded p-5 space-y-3">
          <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
            <svg
              className="w-4 h-4 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
              />
            </svg>
            Validator Priority
          </h3>
          <p className="text-sm text-muted-foreground">
            Our private validator sees transactions before public nodes. This edge is what makes consistent profit
            extraction possible.
          </p>
        </div>
      </div>

      {/* Withdrawal Penalties */}
      <div className="bg-card border border-amber-500/30 rounded p-5 space-y-4">
        <h2 className="text-sm font-medium text-foreground uppercase tracking-wide flex items-center gap-2">
          <svg
            className="w-4 h-4 text-amber-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
          Early Withdrawal Penalties
        </h2>

        <p className="text-sm text-muted-foreground">
          To ensure pool stability and optimal AI execution, early withdrawals incur a small penalty:
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-background border border-border rounded p-3 text-center">
            <div className="text-xs text-muted-foreground">0-7 days</div>
            <div className="text-lg text-amber-400 font-mono">5%</div>
          </div>
          <div className="bg-background border border-border rounded p-3 text-center">
            <div className="text-xs text-muted-foreground">7-14 days</div>
            <div className="text-lg text-amber-400 font-mono">3%</div>
          </div>
          <div className="bg-background border border-border rounded p-3 text-center">
            <div className="text-xs text-muted-foreground">14-30 days</div>
            <div className="text-lg text-amber-400 font-mono">1%</div>
          </div>
          <div className="bg-background border border-border rounded p-3 text-center">
            <div className="text-xs text-muted-foreground">30+ days</div>
            <div className="text-lg text-emerald-400 font-mono">0%</div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">Penalties are redistributed to remaining pool participants.</p>
      </div>

      {/* CTA */}
      <div className="bg-card border border-primary/30 rounded p-5 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <h2 className="text-sm font-medium text-foreground uppercase tracking-wide">Join Private Beta</h2>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          AI Money is <span className="text-emerald-400 font-medium">95% complete</span> and currently in private beta
          testing. Public beta will be announced on our X. Early depositors will receive priority access and reduced
          fees.
        </p>

        <div className="flex items-center gap-4 pt-2">
          <button
            disabled
            className="px-4 py-2 text-xs font-medium uppercase tracking-wide rounded bg-muted text-muted-foreground cursor-not-allowed"
          >
            Deposit Coming Soon
          </button>
          <a
            href="https://x.com/Axsoltools"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:text-primary/80 font-medium uppercase tracking-wide transition-colors"
          >
            Follow for Updates
          </a>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="text-[10px] text-muted-foreground uppercase tracking-wide text-center py-2">
        This is not financial advice. Participation involves risk. Only deposit what you can afford to lose.
      </div>
    </div>
  )
}
