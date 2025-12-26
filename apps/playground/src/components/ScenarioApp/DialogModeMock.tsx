import { usePlaygroundConfig } from '../../config/usePlaygroundConfig'
import { useAccount } from 'wagmi'
import { ConnectKitButton } from 'connectkit'
import { LayoutDashboard, TrendingUp, Wallet, Shield, Activity } from 'lucide-react'

export default function DialogModeMock() {
  const { openWidget, currentScenario } = usePlaygroundConfig()
  const { isConnected } = useAccount()

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-background via-background to-blue-500/5">
      {/* Header */}
      <header className="border-b border-border/50 px-8 py-6 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{currentScenario.theme.title}</h1>
              <p className="text-xs text-muted-foreground">{currentScenario.theme.description}</p>
            </div>
          </div>

          {/* Wallet Connection & Confidential Widget Button */}
          <div className="flex items-center gap-3">
            {isConnected && (
              <button
                onClick={openWidget}
                className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg font-medium transition-all flex items-center gap-2 border border-primary/20"
              >
                <Shield className="w-4 h-4" />
                Confidential Widget
              </button>
            )}
            <ConnectKitButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto scrollbar-thin p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-3 py-6">
            <h2 className="text-3xl font-bold">Your DeFi Dashboard</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              This demonstrates how to integrate the confidential widget as a dialog/popup -
              perfect for auxiliary features in your existing dApp.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              icon={<Wallet className="w-6 h-6" />}
              label="Total Balance"
              value="$12,450.00"
              change="+5.2%"
              color="text-blue-500"
              bgColor="bg-blue-500/10"
            />
            <StatCard
              icon={<TrendingUp className="w-6 h-6" />}
              label="Total Earnings"
              value="$1,234.56"
              change="+12.5%"
              color="text-green-500"
              bgColor="bg-green-500/10"
            />
            <StatCard
              icon={<Activity className="w-6 h-6" />}
              label="Active Positions"
              value="8"
              change="+2"
              color="text-purple-500"
              bgColor="bg-purple-500/10"
            />
          </div>

          {/* Main Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Feature 1 */}
            <div className="p-6 bg-secondary/30 border border-border rounded-2xl">
              <h3 className="text-lg font-bold mb-2">Your Assets</h3>
              <p className="text-sm text-muted-foreground mb-4">
                View and manage your token holdings
              </p>
              <div className="space-y-2">
                <AssetRow token="USDC" amount="5,000.00" value="$5,000.00" />
                <AssetRow token="USDT" amount="3,500.00" value="$3,500.00" />
                <AssetRow token="WETH" amount="2.5" value="$3,950.00" />
              </div>
            </div>

            {/* Feature 2 - Confidential Widget CTA */}
            <div className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold mb-2">Confidential Widget</h3>
                  <p className="text-sm text-muted-foreground">
                    Keep your balances private with FHE encryption
                  </p>
                </div>
                <div className="p-3 bg-primary/20 rounded-xl">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <FeatureItem text="Encrypted balances on-chain" />
                <FeatureItem text="Private transfers between wallets" />
                <FeatureItem text="Trustless public decryption" />
              </div>

              {isConnected ? (
                <button
                  onClick={openWidget}
                  className="w-full px-6 py-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground rounded-xl font-semibold transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Open Confidential Widget
                </button>
              ) : (
                <button
                  disabled
                  className="w-full px-6 py-3 bg-muted text-muted-foreground rounded-xl font-semibold cursor-not-allowed"
                >
                  Connect wallet to continue
                </button>
              )}
            </div>
          </div>

          {/* Info Banner */}
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="text-blue-500 mt-0.5">ℹ️</div>
              <div className="flex-1">
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">
                  Dialog Mode Integration
                </p>
                <p className="text-xs text-blue-600/80 dark:text-blue-400/80">
                  In this mode, the widget opens as a dialog/popup when users click the "Confidential Widget"
                  button. This is ideal when privacy features are complementary to your main dApp functionality.
                  The widget can be triggered from navigation bars, toolbars, or feature cards.
                </p>
              </div>
            </div>
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
  change: string
  color: string
  bgColor: string
}

function StatCard({ icon, label, value, change, color, bgColor }: StatCardProps) {
  return (
    <div className="p-6 bg-secondary/50 border border-border rounded-xl">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 ${bgColor} rounded-xl ${color}`}>
          {icon}
        </div>
        <span className="text-xs text-green-500 font-medium">{change}</span>
      </div>
      <div className="text-sm text-muted-foreground mb-1">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  )
}

interface AssetRowProps {
  token: string
  amount: string
  value: string
}

function AssetRow({ token, amount, value }: AssetRowProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="text-xs font-bold text-primary">{token[0]}</span>
        </div>
        <div>
          <div className="font-medium text-sm">{token}</div>
          <div className="text-xs text-muted-foreground">{amount}</div>
        </div>
      </div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  )
}

interface FeatureItemProps {
  text: string
}

function FeatureItem({ text }: FeatureItemProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
      <span className="text-sm">{text}</span>
    </div>
  )
}
