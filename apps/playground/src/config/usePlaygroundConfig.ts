import { create } from 'zustand'
import { scenarios, defaultScenario, TOKENS, type ScenarioId, type ScenarioConfig, type TokenConfig } from './scenarios'
import { defaultTheme, type ThemeConfig, type ThemeType, type AccentColor, type RadiusSize } from './themes'

// Helper function to generate dialog mode code
function generateDialogCode(
  customTokens: TokenConfig[],
  defaultTab: string,
  features: { wrap: boolean; transfer: boolean; unwrap: boolean },
  theme: ThemeConfig
): string {
  const imports = `import { useState } from 'react'
import { PrivacyWalletWidget } from '@shieldkit/react'
import { Dialog } from '@/components/ui/dialog' // Your dialog component`

  const tokenSymbols = customTokens.map(t => t.symbol)
  const tokensArray = tokenSymbols.length > 0 ? `['${tokenSymbols.join("', '")}']` : '[]'

  const componentCode = `function MyApp() {
  const [showWidget, setShowWidget] = useState(false)

  return (
    <>
      <button onClick={() => setShowWidget(true)}>
        Open Confidential Balance
      </button>

      {showWidget && (
        <Dialog onClose={() => setShowWidget(false)}>
          <PrivacyWalletWidget
            tokens={${tokensArray}}
            defaultTab="${defaultTab}"
            features={{
              wrap: ${features.wrap},
              transfer: ${features.transfer},
              unwrap: ${features.unwrap},
            }}
          />
        </Dialog>
      )}
    </>
  )
}`

  return `${imports}\n\n${componentCode}`
}

// Helper function to generate sidebar mode code
function generateSidebarCode(
  customTokens: TokenConfig[],
  defaultTab: string,
  features: { wrap: boolean; transfer: boolean; unwrap: boolean },
  theme: ThemeConfig
): string {
  const imports = `import { useState } from 'react'
import { PrivacyWalletWidget } from '@shieldkit/react'`

  const tokenSymbols = customTokens.map(t => t.symbol)
  const tokensArray = tokenSymbols.length > 0 ? `['${tokenSymbols.join("', '")}']` : '[]'

  const componentCode = `function MyApp() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen">
      {/* Main content */}
      <main className={\`flex-1 transition-all \${isSidebarOpen ? 'mr-96' : 'mr-0'}\`}>
        {/* Your app content */}
      </main>

      {/* Sidebar Widget */}
      <aside className={
        \`fixed right-0 top-0 h-full w-96 bg-background border-l
         transform transition-transform
         \${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}\`
      }>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -left-10 top-20"
        >
          {isSidebarOpen ? '→' : '←'}
        </button>

        <PrivacyWalletWidget
          tokens={${tokensArray}}
          defaultTab="${defaultTab}"
          features={{
            wrap: ${features.wrap},
            transfer: ${features.transfer},
            unwrap: ${features.unwrap},
          }}
        />
      </aside>
    </div>
  )
}`

  return `${imports}\n\n${componentCode}`
}

export interface PlaygroundState {
  // Scenario configuration
  currentScenario: ScenarioConfig
  customTokens: TokenConfig[]
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
  setDefaultTab: (tab: 'wrap' | 'transfer' | 'unwrap') => void
  toggleFeature: (feature: keyof PlaygroundState['features']) => void
  setThemeType: (type: ThemeType) => void
  setAccentColor: (color: AccentColor) => void
  setRadiusSize: (size: RadiusSize) => void
  openWidget: () => void
  closeWidget: () => void
  toggleWidget: () => void

  // Generate code snippet
  generateCode: () => string
}

export const usePlaygroundConfig = create<PlaygroundState>((set, get) => ({
  // Initial state
  currentScenario: defaultScenario,
  customTokens: TOKENS,
  defaultTab: defaultScenario.defaultTab,
  features: defaultScenario.features,
  theme: defaultTheme,
  isWidgetOpen: false,

  // Actions
  setScenario: (scenarioId) => {
    const scenario = scenarios[scenarioId]
    set({
      currentScenario: scenario,
      customTokens: TOKENS,
      defaultTab: scenario.defaultTab,
      features: scenario.features,
    })
  },

  setTokens: (tokens) => set({ customTokens: tokens }),

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
    const { currentScenario, customTokens, defaultTab, features, theme } = state

    // Generate different code based on integration mode
    if (currentScenario.integrationMode === 'sidebar') {
      return generateSidebarCode(customTokens, defaultTab, features, theme)
    } else {
      return generateDialogCode(customTokens, defaultTab, features, theme)
    }
  },
}))
