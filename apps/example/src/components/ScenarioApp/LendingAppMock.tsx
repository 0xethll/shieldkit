import { usePlaygroundConfig } from '../../config/usePlaygroundConfig'
import { useAccount, useConnect } from 'wagmi'
import { TrendingUp, Shield, DollarSign, Wallet } from 'lucide-react'

export default function LendingAppMock() {
  const { openWidget } = usePlaygroundConfig()
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b border-border/50 px-8 py-6 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Privacy Lending</h1>
              <p className="text-xs text-muted-foreground">Confidential DeFi Protocol</p>
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
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4">
            <StatCard
              icon={<TrendingUp className="w-5 h-5" />}
              label="APY"
              value="8.5%"
              color="text-green-500"
            />
            <StatCard
              icon={<DollarSign className="w-5 h-5" />}
              label="TVL"
              value="$2.5M"
              color="text-blue-500"
            />
            <StatCard
              icon={<Shield className="w-5 h-5" />}
              label="Privacy"
              value="100%"
              color="text-primary"
            />
          </div>

          {/* Deposit Section */}
          <div className="p-6 bg-secondary/30 backdrop-blur-sm border border-border rounded-2xl space-y-4">
            <div>
              <h2 className="text-lg font-bold mb-1">Deposit Assets</h2>
              <p className="text-sm text-muted-foreground">
                Deposit your assets privately and start earning yields
              </p>
            </div>

            {isConnected ? (
              <button
                onClick={openWidget}
                className="w-full px-6 py-4 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground rounded-xl font-semibold transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Shield className="w-5 h-5" />
                Connect Privacy Wallet
              </button>
            ) : (
              <button
                disabled
                className="w-full px-6 py-4 bg-muted text-muted-foreground rounded-xl font-semibold cursor-not-allowed"
              >
                Connect wallet to continue
              </button>
            )}
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4">
            <FeatureCard
              title="Private Balances"
              description="Your deposit amounts are encrypted on-chain"
            />
            <FeatureCard
              title="Confidential Yields"
              description="Earn interest without revealing your position"
            />
          </div>

          {/* Info */}
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <p className="text-sm text-blue-600 dark:text-blue-400">
              ℹ️ This is a demo interface. The Privacy Wallet widget will appear when you click the button above.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string
  color: string
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  return (
    <div className="p-4 bg-secondary/50 border border-border rounded-xl">
      <div className={`${color} mb-2`}>{icon}</div>
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  )
}

interface FeatureCardProps {
  title: string
  description: string
}

function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div className="p-4 bg-secondary/30 border border-border rounded-xl">
      <h3 className="font-semibold text-sm mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  )
}
