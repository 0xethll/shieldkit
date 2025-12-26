import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { scenarios, defaultScenario, TOKENS, type ScenarioId, type ScenarioConfig, type TokenConfig } from './scenarios'
import { defaultTheme, type ThemeConfig, type ThemeType, type AccentColor, type RadiusSize } from './themes'

// Code generation types
export interface CodeStep {
  title: string
  description: string
  code: string
  language: string
}

// Helper function to generate dialog mode code
function generateDialogCode(
  customTokens: TokenConfig[],
  defaultTab: string,
  features: { wrap: boolean; transfer: boolean; unwrap: boolean },
  theme: ThemeConfig
): CodeStep[] {
  const tokenSymbols = customTokens.map(t => t.symbol)
  const tokensArray = tokenSymbols.length > 0 ? `['${tokenSymbols.join("', '")}']` : '[]'

  return [
    {
      title: 'Install Dependencies',
      description: 'Install ShieldKit and required peer dependencies',
      language: 'bash',
      code: `npm install @shieldkit/react @shieldkit/core wagmi viem ethers connectkit`
    },
    {
      title: 'Setup Providers',
      description: 'Wrap your app with FHEProvider and WagmiProvider',
      language: 'tsx',
      code: `import { FHEProvider } from '@shieldkit/react'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConnectKitProvider, getDefaultConfig } from 'connectkit'

const config = createConfig(
  getDefaultConfig({
    appName: 'My App',
    walletConnectProjectId: 'YOUR_PROJECT_ID',
    chains: [sepolia],
    transports: { [sepolia.id]: http() },
  })
)

const queryClient = new QueryClient()

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
          <FHEProvider>
            <MyDashboard />
          </FHEProvider>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}`
    },
    {
      title: 'Create Dialog Component',
      description: 'Full implementation with Dialog pattern - copy this entire component',
      language: 'tsx',
      code: `import { useState } from 'react'
import { useAccount } from 'wagmi'
import { ConnectKitButton } from 'connectkit'
import { ConfidentialWidget } from '@shieldkit/react'
import { Shield, LayoutDashboard } from 'lucide-react'

export default function MyDashboard() {
  const [showWidget, setShowWidget] = useState(false)
  const { isConnected } = useAccount()

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8" />
            <h1 className="text-xl font-bold">My DeFi Dashboard</h1>
          </div>

          <div className="flex items-center gap-3">
            {isConnected && (
              <button
                onClick={() => setShowWidget(true)}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2"
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
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Your Dashboard</h2>
          <p className="text-gray-600">
            Click "Confidential Widget" to open privacy features
          </p>
        </div>
      </main>

      {/* Dialog Widget */}
      {showWidget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="w-full max-w-md h-[600px] relative rounded-xl overflow-hidden">
            <button
              onClick={() => setShowWidget(false)}
              className="absolute top-4 right-4 text-white bg-black/20 hover:bg-black/30 backdrop-blur-sm rounded-full p-2 z-50"
            >
              ✕
            </button>
            <ConfidentialWidget
              tokens={${tokensArray}}
              defaultTab="${defaultTab}"
              features={{
                wrap: ${features.wrap},
                transfer: ${features.transfer},
                unwrap: ${features.unwrap},
              }}
              theme={{ type: '${theme.type}', accent: '${theme.accent}', radius: '${theme.radius}' }}
            />
          </div>
        </div>
      )}
    </div>
  )
}`
    }
  ]
}

// Helper function to generate sidebar mode code
function generateSidebarCode(
  customTokens: TokenConfig[],
  defaultTab: string,
  features: { wrap: boolean; transfer: boolean; unwrap: boolean },
  theme: ThemeConfig
): CodeStep[] {
  const tokenSymbols = customTokens.map(t => t.symbol)
  const tokensArray = tokenSymbols.length > 0 ? `['${tokenSymbols.join("', '")}']` : '[]'

  return [
    {
      title: 'Install Dependencies',
      description: 'Install ShieldKit and required peer dependencies',
      language: 'bash',
      code: `npm install @shieldkit/react @shieldkit/core wagmi viem ethers connectkit`
    },
    {
      title: 'Setup Providers',
      description: 'Wrap your app with FHEProvider and WagmiProvider',
      language: 'tsx',
      code: `import { FHEProvider } from '@shieldkit/react'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConnectKitProvider, getDefaultConfig } from 'connectkit'

const config = createConfig(
  getDefaultConfig({
    appName: 'My App',
    walletConnectProjectId: 'YOUR_PROJECT_ID',
    chains: [sepolia],
    transports: { [sepolia.id]: http() },
  })
)

const queryClient = new QueryClient()

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
          <FHEProvider>
            <MyWalletApp />
          </FHEProvider>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}`
    },
    {
      title: 'Create Sidebar Component',
      description: 'Full implementation with Sidebar pattern - copy this entire component',
      language: 'tsx',
      code: `import { useState } from 'react'
import { useAccount } from 'wagmi'
import { ConnectKitButton } from 'connectkit'
import { ConfidentialWidget } from '@shieldkit/react'
import { Wallet, ChevronRight, ChevronLeft } from 'lucide-react'

export default function MyWalletApp() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const { isConnected } = useAccount()

  return (
    <div className="flex h-screen relative">
      {/* Main Content */}
      <div
        className={\`flex-1 flex flex-col transition-all duration-300 \${
          isSidebarOpen ? 'mr-[420px]' : 'mr-0'
        }\`}
      >
        {/* Header */}
        <header className="border-b px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Wallet className="w-8 h-8" />
              <h1 className="text-xl font-bold">Confidential Wallet</h1>
            </div>
            <ConnectKitButton />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">
              Privacy-First Wallet Experience
            </h2>
            <p className="text-gray-600">
              Use the sidebar on the right to manage your confidential assets
            </p>
          </div>
        </main>
      </div>

      {/* Sidebar Widget */}
      <aside
        className={\`absolute right-0 top-0 h-full w-[420px] bg-white border-l shadow-2xl transform transition-transform duration-300 z-10 \${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }\`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -left-10 top-20 w-10 h-16 bg-white border border-r-0 rounded-l-xl flex items-center justify-center hover:bg-gray-50"
        >
          {isSidebarOpen ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>

        {/* Widget Content */}
        <div className="h-full overflow-hidden">
          {isConnected ? (
            <ConfidentialWidget
              tokens={${tokensArray}}
              defaultTab="${defaultTab}"
              features={{
                wrap: ${features.wrap},
                transfer: ${features.transfer},
                unwrap: ${features.unwrap},
              }}
              theme={{ type: '${theme.type}', accent: '${theme.accent}', radius: '${theme.radius}' }}
            />
          ) : (
            <div className="h-full flex items-center justify-center p-6 bg-gray-50">
              <div className="text-center">
                <Wallet className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h4 className="font-semibold mb-2">Connect Your Wallet</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Connect to access confidential features
                </p>
                <ConnectKitButton />
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}`
    }
  ]
}

export interface PlaygroundState {
  // Scenario configuration
  currentScenario: ScenarioConfig
  selectedTokens: TokenConfig[] // User-selected tokens (mainstream + custom)
  customTokens: TokenConfig[] // User-added custom tokens (persisted)
  defaultTab: 'wrap' | 'transfer' | 'unwrap'
  features: {
    wrap: boolean
    transfer: boolean
    unwrap: boolean
  }

  // Theme configuration
  theme: ThemeConfig

  // Widget state
  isWidgetOpen: boolean

  // Actions
  setScenario: (scenarioId: ScenarioId) => void
  setTokens: (tokens: TokenConfig[]) => void
  addToken: (token: TokenConfig) => void
  removeToken: (tokenAddress: string) => void
  setDefaultTab: (tab: 'wrap' | 'transfer' | 'unwrap') => void
  toggleFeature: (feature: keyof PlaygroundState['features']) => void
  setThemeType: (type: ThemeType) => void
  setAccentColor: (color: AccentColor) => void
  setRadiusSize: (size: RadiusSize) => void
  openWidget: () => void
  closeWidget: () => void
  toggleWidget: () => void

  // Generate code snippet
  generateCode: () => CodeStep[]

  // Helper getters
  getAllTokens: () => TokenConfig[] // TOKENS + customTokens
}

export const usePlaygroundConfig = create<PlaygroundState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentScenario: defaultScenario,
      selectedTokens: TOKENS,
      customTokens: [], // Persisted custom tokens
      defaultTab: defaultScenario.defaultTab,
      features: defaultScenario.features,
      theme: defaultTheme,
      isWidgetOpen: false,

      // Actions
      setScenario: (scenarioId) => {
        const scenario = scenarios[scenarioId]
        set({
          currentScenario: scenario,
          defaultTab: scenario.defaultTab,
          features: scenario.features,
        })
      },

      setTokens: (tokens) => set({ selectedTokens: tokens }),

      addToken: (token) => {
        const state = get()
        const normalized = token.address.toLowerCase()

        // Check if token already exists in mainstream or custom
        const allTokens = [...TOKENS, ...state.customTokens]
        if (allTokens.some((t) => t.address.toLowerCase() === normalized)) {
          throw new Error('This token already exists in your list')
        }

        set((state) => ({
          customTokens: [...state.customTokens, { ...token, address: normalized as any }],
          selectedTokens: [...state.selectedTokens, { ...token, address: normalized as any }],
        }))
      },

      removeToken: (tokenAddress) => {
        const normalized = tokenAddress.toLowerCase()
        set((state) => ({
          customTokens: state.customTokens.filter(
            (t) => t.address.toLowerCase() !== normalized
          ),
          selectedTokens: state.selectedTokens.filter(
            (t) => t.address.toLowerCase() !== normalized
          ),
        }))
      },

      setDefaultTab: (tab) => set({ defaultTab: tab }),

      toggleFeature: (feature) =>
        set((state) => ({
          features: {
            ...state.features,
            [feature]: !state.features[feature],
          },
        })),

      setThemeType: (type) =>
        set((state) => ({
          theme: { ...state.theme, type },
        })),

      setAccentColor: (accent) =>
        set((state) => ({
          theme: { ...state.theme, accent },
        })),

      setRadiusSize: (radius) =>
        set((state) => ({
          theme: { ...state.theme, radius },
        })),

      openWidget: () => set({ isWidgetOpen: true }),

      closeWidget: () => set({ isWidgetOpen: false }),

      toggleWidget: () => set((state) => ({ isWidgetOpen: !state.isWidgetOpen })),

      generateCode: () => {
        const state = get()
        const { currentScenario, selectedTokens, defaultTab, features, theme } = state

        // Generate different code based on integration mode
        if (currentScenario.integrationMode === 'sidebar') {
          return generateSidebarCode(selectedTokens, defaultTab, features, theme)
        } else {
          return generateDialogCode(selectedTokens, defaultTab, features, theme)
        }
      },

      getAllTokens: () => {
        const state = get()
        return [...TOKENS, ...state.customTokens]
      },
    }),
    {
      name: 'playground-config',
      partialize: (state) => ({
        customTokens: state.customTokens,
        selectedTokens: state.selectedTokens,
        theme: state.theme,
      }),
    }
  )
)
