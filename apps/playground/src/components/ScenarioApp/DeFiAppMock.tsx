import { usePlaygroundConfig } from '../../config/usePlaygroundConfig'
import { useAccount, useConnect } from 'wagmi'
import { Wallet, Lock, Send, Download, Shield } from 'lucide-react'

export default function DeFiAppMock() {
  const { openWidget } = usePlaygroundConfig()
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-background via-background to-purple-500/5">
      {/* Header */}
      <header className="border-b border-border/50 px-8 py-6 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Confidential DeFi</h1>
              <p className="text-xs text-muted-foreground">Full-featured confidential protocol</p>
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
      <main className="flex-1 overflow-y-auto scrollbar-thin p-8">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Hero */}
          <div className="text-center space-y-3 py-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Complete Confidential DeFi Experience
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Wrap, transfer, and unwrap tokens with encrypted balances using FHE
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-3 gap-4">
            <FeatureCard
              icon={<Lock className="w-6 h-6" />}
              title="Wrap"
              description="Convert tokens to confidential assets"
              gradient="from-blue-500 to-blue-600"
            />
            <FeatureCard
              icon={<Send className="w-6 h-6" />}
              title="Transfer"
              description="Send private payments on-chain"
              gradient="from-green-500 to-green-600"
            />
            <FeatureCard
              icon={<Download className="w-6 h-6" />}
              title="Unwrap"
              description="Convert back to public tokens"
              gradient="from-purple-500 to-purple-600"
            />
          </div>

          {/* Main CTA */}
          <div className="p-6 bg-secondary/30 backdrop-blur-sm border border-border rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold mb-1">Confidential Balance Widget</h3>
                <p className="text-sm text-muted-foreground">
                  Access all confidential features in one place
                </p>
              </div>
              <div className="p-3 bg-primary/10 rounded-xl">
                <Shield className="w-8 h-8 text-primary" />
              </div>
            </div>

            {isConnected ? (
              <button
                onClick={openWidget}
                className="w-full px-6 py-4 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground rounded-xl font-semibold transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Wallet className="w-5 h-5" />
                Open Confidential Balance Widget
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

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <StatCard label="Supported Tokens" value="4" />
            <StatCard label="Privacy Level" value="100%" />
            <StatCard label="Gas Efficiency" value="High" />
          </div>

          {/* Benefits */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground">Key Benefits</h3>
            <div className="grid gap-3">
              <BenefitItem
                icon="🔒"
                title="Full Confidentiality"
                description="All balances and amounts are encrypted on-chain using FHE"
              />
              <BenefitItem
                icon="⚡"
                title="Automatic Deployment"
                description="Wrapper contracts deployed automatically when needed"
              />
              <BenefitItem
                icon="🔄"
                title="Seamless Integration"
                description="Easy one-line integration into any dApp"
              />
            </div>
          </div>

          {/* Info */}
          <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
            <p className="text-sm text-purple-600 dark:text-purple-400">
              ℹ️ This playground demonstrates all features. Adjust settings on the left to customize the widget.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  gradient: string
}

function FeatureCard({ icon, title, description, gradient }: FeatureCardProps) {
  return (
    <div className="p-4 bg-secondary/30 border border-border rounded-xl space-y-3">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white`}>
        {icon}
      </div>
      <div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

interface StatCardProps {
  label: string
  value: string
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="p-4 bg-secondary/30 border border-border rounded-xl text-center">
      <div className="text-2xl font-bold text-primary mb-1">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  )
}

interface BenefitItemProps {
  icon: string
  title: string
  description: string
}

function BenefitItem({ icon, title, description }: BenefitItemProps) {
  return (
    <div className="flex items-start gap-3 p-3 bg-secondary/20 border border-border/50 rounded-lg">
      <span className="text-2xl">{icon}</span>
      <div className="flex-1">
        <h4 className="font-semibold text-sm mb-0.5">{title}</h4>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
