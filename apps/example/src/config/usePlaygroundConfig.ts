import { create } from 'zustand'
import { scenarios, defaultScenario, type ScenarioId, type ScenarioConfig } from './scenarios'
import { defaultTheme, type ThemeConfig, type ThemeType, type AccentColor, type RadiusSize } from './themes'

export interface PlaygroundState {
  // Scenario configuration
  currentScenario: ScenarioConfig
  customTokens: string[]
  defaultTab: 'wrap' | 'transfer' | 'unwrap'
  features: {
    wrap: boolean
    transfer: boolean
    unwrap: boolean
    autoDeploy: boolean
  }

  // Theme configuration
  theme: ThemeConfig

  // Widget state
  isWidgetOpen: boolean

  // Actions
  setScenario: (scenarioId: ScenarioId) => void
  setTokens: (tokens: string[]) => void
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
  customTokens: defaultScenario.tokens,
  defaultTab: defaultScenario.defaultTab,
  features: defaultScenario.features,
  theme: defaultTheme,
  isWidgetOpen: false,

  // Actions
  setScenario: (scenarioId) => {
    const scenario = scenarios[scenarioId]
    set({
      currentScenario: scenario,
      customTokens: scenario.tokens,
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
    const { customTokens, defaultTab, features, theme } = state

    // Generate imports
    const imports = `import { PrivacyWallet } from '@z-payment/react'\n`

    // Generate component code
    const tokensArray = customTokens.length > 0 ? `['${customTokens.join("', '")}']` : '[]'
    const featuresObj = `{
  wrap: ${features.wrap},
  transfer: ${features.transfer},
  unwrap: ${features.unwrap},
  autoDeploy: ${features.autoDeploy}
}`

    const componentCode = `<PrivacyWallet
  tokens={${tokensArray}}
  defaultTab="${defaultTab}"
  features={${featuresObj}}
  theme={{
    type: "${theme.type}",
    accent: "${theme.accent}",
    radius: "${theme.radius}"
  }}
/>`

    return `${imports}\n${componentCode}`
  },
}))
