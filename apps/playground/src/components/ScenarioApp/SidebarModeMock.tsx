import { useState } from 'react'
import { usePlaygroundConfig } from '../../config/usePlaygroundConfig'
import { useAccount } from 'wagmi'
import { ConnectKitButton } from 'connectkit'
import { Wallet, ChevronRight, ChevronLeft, Shield, Lock, Send, Download } from 'lucide-react'
import PrivacyWalletWidget from '../Widget/PrivacyWalletWidget'
import ThemeProvider from '../Widget/ThemeProvider'

export default function SidebarModeMock() {
  const { currentScenario } = usePlaygroundConfig()
  const { isConnected } = useAccount()
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true)

  return (
    <div className="w-full h-full flex relative bg-gradient-to-br from-background via-background to-purple-500/5">
      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarExpanded ? 'mr-[420px]' : 'mr-0'
        }`}
      >
        {/* Header */}
        <header className="border-b border-border/50 px-8 py-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">{currentScenario.theme.title}</h1>
                <p className="text-xs text-muted-foreground">{currentScenario.theme.description}</p>
              </div>
            </div>

            <ConnectKitButton />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Hero */}
            <div className="text-center space-y-3 py-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">
                Privacy-First Wallet Experience
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                This demonstrates the sidebar integration mode - perfect when confidential is a
                core feature of your application. The widget stays accessible while users navigate your dApp.
              </p>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FeatureCard
                icon={<Lock className="w-6 h-6" />}
                title="Wrap Tokens"
                description="Convert public tokens to confidential assets with FHE encryption"
                gradient="from-blue-500 to-blue-600"
              />
              <FeatureCard
                icon={<Send className="w-6 h-6" />}
                title="Private Transfers"
                description="Send payments with encrypted amounts visible only to you"
                gradient="from-green-500 to-green-600"
              />
              <FeatureCard
                icon={<Download className="w-6 h-6" />}
                title="Unwrap Anytime"
                description="Convert back to public tokens using trustless decryption"
                gradient="from-purple-500 to-purple-600"
              />
            </div>

            {/* How It Works */}
            <div className="p-6 bg-secondary/30 border border-border rounded-2xl space-y-4">
              <h3 className="text-lg font-bold">How Sidebar Mode Works</h3>
              <div className="grid gap-3">
                <StepItem
                  number="1"
                  title="Always Accessible"
                  description="The confidential widget is embedded in a collapsible sidebar on the right"
                />
                <StepItem
                  number="2"
                  title="Persistent State"
                  description="Widget state is maintained as users navigate through your application"
                />
                <StepItem
                  number="3"
                  title="Space Efficient"
                  description="Toggle the sidebar open/closed to maximize screen space when needed"
                />
              </div>
            </div>

            {/* Benefits */}
            <div className="grid md:grid-cols-2 gap-4">
              <BenefitCard
                icon="🎯"
                title="Core Feature Integration"
                description="Ideal when privacy is central to your dApp's value proposition"
              />
              <BenefitCard
                icon="🚀"
                title="Better UX"
                description="Users don't need to repeatedly open/close dialogs"
              />
              <BenefitCard
                icon="📱"
                title="Responsive Design"
                description="Sidebar automatically adapts to different screen sizes"
              />
              <BenefitCard
                icon="⚡"
                title="Quick Actions"
                description="Perform confidential operations without interrupting workflow"
              />
            </div>

            {/* Info Banner */}
            <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="text-purple-500 mt-0.5">ℹ️</div>
                <div className="flex-1">
                  <p className="text-sm text-purple-600 dark:text-purple-400 font-medium mb-1">
                    Sidebar Mode Integration
                  </p>
                  <p className="text-xs text-purple-600/80 dark:text-purple-400/80">
                    The confidential widget is embedded as a persistent sidebar on the right side of the
                    screen. Click the toggle button on the sidebar to collapse/expand it. This pattern works best
                    for wallet apps, privacy-focused dApps, or when confidential operations are frequently used.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Sidebar Widget */}
      <aside
        className={`absolute right-0 top-0 h-full w-[420px] bg-background border-l border-border shadow-2xl transform transition-transform duration-300 z-10 ${
          isSidebarExpanded ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
          className={`absolute -left-10 top-20 w-10 h-16 bg-background border border-r-0 border-border rounded-l-xl flex items-center justify-center hover:bg-secondary transition-colors ${
            isSidebarExpanded ? '' : 'border-r'
          }`}
          aria-label={isSidebarExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isSidebarExpanded ? (
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          )}
        </button>

        {/* Widget Content */}
        <div className="h-full overflow-hidden">
          <ThemeProvider>
            {isConnected ? (
              <PrivacyWalletWidget />
            ) : (
              <div className="h-full flex items-center justify-center p-6">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                    <Wallet className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Connect Your Wallet</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Connect your wallet to access confidential features
                    </p>
                  </div>
                  <ConnectKitButton />
                </div>
              </div>
            )}
          </ThemeProvider>
        </div>
      </aside>
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
      <div
        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white`}
      >
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-sm mb-1">{title}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

interface StepItemProps {
  number: string
  title: string
  description: string
}

function StepItem({ number, title, description }: StepItemProps) {
  return (
    <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
        {number}
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-sm mb-0.5">{title}</h4>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

interface BenefitCardProps {
  icon: string
  title: string
  description: string
}

function BenefitCard({ icon, title, description }: BenefitCardProps) {
  return (
    <div className="flex items-start gap-3 p-4 bg-secondary/20 border border-border/50 rounded-xl">
      <span className="text-2xl">{icon}</span>
      <div className="flex-1">
        <h4 className="font-semibold text-sm mb-1">{title}</h4>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
