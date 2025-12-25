import type { Address } from 'viem'

export type ScenarioId = 'dialog' | 'sidebar'
export type DefaultTab = 'wrap' | 'transfer' | 'unwrap'
export type IntegrationMode = 'dialog' | 'sidebar'

export interface TokenConfig {
  symbol: string
  address: Address
  decimals: number
  name: string
}

export interface ScenarioConfig {
  id: ScenarioId
  name: string
  description: string
  integrationMode: IntegrationMode
  defaultTab: DefaultTab
  features: {
    wrap: boolean
    transfer: boolean
    unwrap: boolean
  }
  theme: {
    title: string
    description: string
    primaryColor: string
  }
}

export const TOKENS: TokenConfig[] = [
  {
    address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
    name: 'Sepolia USDC',
    symbol: 'USDC',
    decimals: 6,
  },
  {
    address: '0x7169D38820dfd117C3FA1f22a697dBA58d90BA06',
    name: 'Test Tether USD',
    symbol: 'USDT',
    decimals: 6,
  },
  {
    address: '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9',
    name: 'Wrapped Ether',
    symbol: 'WETH',
    decimals: 18,
  },
  {
    address: '0xb060796D171EeEdA5Fb99df6B2847DA6D4613CAd',
    name: 'wBTC',
    symbol: 'wBTC',
    decimals: 8,
  },
  // Add more Sepolia testnet tokens here as needed
]

export const scenarios: Record<ScenarioId, ScenarioConfig> = {
  dialog: {
    id: 'dialog',
    name: 'Dialog Mode',
    description: 'Widget as a popup - best for auxiliary features',
    integrationMode: 'dialog',
    defaultTab: 'wrap',
    features: {
      wrap: true,
      transfer: true,
      unwrap: true,
    },
    theme: {
      title: 'My DeFi Dashboard',
      description: 'Add confidential balance to your existing dApp',
      primaryColor: 'blue',
    },
  },
  sidebar: {
    id: 'sidebar',
    name: 'Sidebar Mode',
    description: 'Widget as a persistent sidebar - best for core features',
    integrationMode: 'sidebar',
    defaultTab: 'wrap',
    features: {
      wrap: true,
      transfer: true,
      unwrap: true,
    },
    theme: {
      title: 'Confidential Wallet',
      description: 'Privacy-first balance management',
      primaryColor: 'purple',
    },
  },
}

export const defaultScenario: ScenarioConfig = scenarios.dialog
