import { usePlaygroundConfig } from '../../config/usePlaygroundConfig'
import { useAccount, useConnect } from 'wagmi'
import { Send, Eye, EyeOff, Wallet, ArrowRight } from 'lucide-react'

export default function PaymentAppMock() {
  const { openWidget } = usePlaygroundConfig()
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-background via-background to-green-500/5">
      {/* Header */}
      <header className="border-b border-border/50 px-8 py-6 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <Send className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Privacy Pay</h1>
              <p className="text-xs text-muted-foreground">Send payments privately</p>
            </div>
          </div>

          {/* Wallet Connection */}
          {!isConnected ? (
            <button
              onClick={() => connectors[0] && connect({ connector: connectors[0] })}
              className="px-4 py-2 bg-secondary hover:bg-accent border border-border rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Wallet className="w-4 h-4" />
              Connect Wallet
            </button>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 bg-secondary/50 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm font-mono">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-3 py-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
              Private Payments Made Easy
            </h2>
            <p className="text-muted-foreground">
              Send money without revealing amounts to anyone
            </p>
          </div>

          {/* Payment Card */}
          <div className="p-6 bg-secondary/30 backdrop-blur-sm border border-border rounded-2xl space-y-6">
            {/* Privacy Benefits */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-3 bg-background/50 rounded-lg">
                <EyeOff className="w-4 h-4 text-green-500" />
                <span className="text-sm">Hidden Amounts</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-background/50 rounded-lg">
                <Eye className="w-4 h-4 text-green-500" />
                <span className="text-sm">Visible Recipients</span>
              </div>
            </div>

            {/* Payment Flow Illustration */}
            <div className="p-4 bg-background/50 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
                    <Wallet className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground">You</p>
                </div>

                <div className="flex-1 flex items-center justify-center">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-px bg-border" />
                    <div className="p-1.5 bg-green-500/20 rounded-full">
                      <ArrowRight className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="w-16 h-px bg-border" />
                  </div>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-2">
                    <Wallet className="w-6 h-6 text-green-500" />
                  </div>
                  <p className="text-xs text-muted-foreground">Recipient</p>
                </div>
              </div>
              <p className="text-xs text-center text-muted-foreground mt-3">
                Amount encrypted • Privacy guaranteed
              </p>
            </div>

            {/* CTA */}
            {isConnected ? (
              <button
                onClick={openWidget}
                className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-semibold transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Open Privacy Wallet
              </button>
            ) : (
              <button
                disabled
                className="w-full px-6 py-4 bg-muted text-muted-foreground rounded-xl font-semibold cursor-not-allowed"
              >
                Connect wallet to send payments
              </button>
            )}
          </div>

          {/* Use Cases */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground">Use Cases</h3>
            <div className="grid grid-cols-2 gap-3">
              <UseCaseCard emoji="💰" title="Salary Payments" />
              <UseCaseCard emoji="🎁" title="Gifts & Tips" />
              <UseCaseCard emoji="🤝" title="Business Deals" />
              <UseCaseCard emoji="🏦" title="Personal Transfers" />
            </div>
          </div>

          {/* Info */}
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
            <p className="text-sm text-green-600 dark:text-green-400">
              ℹ️ Click "Open Privacy Wallet" to access transfer features with encrypted amounts.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

interface UseCaseCardProps {
  emoji: string
  title: string
}

function UseCaseCard({ emoji, title }: UseCaseCardProps) {
  return (
    <div className="p-3 bg-secondary/30 border border-border rounded-lg text-center">
      <div className="text-2xl mb-1">{emoji}</div>
      <p className="text-xs font-medium">{title}</p>
    </div>
  )
}
