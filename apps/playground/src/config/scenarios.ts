import type { Address } from 'viem'

export type ScenarioId = 'lending' | 'payment' | 'defi'
export type DefaultTab = 'wrap' | 'transfer' | 'unwrap'

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
  defaultTab: DefaultTab
  features: {
    wrap: boolean
    transfer: boolean
    unwrap: boolean
  }
  mockApp: {
    title: string
    description: string
    type: 'lending' | 'payment' | 'defi'
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
  lending: {
    id: 'lending',
    name: 'Confidential Lending',
    description: 'Confidential asset deposit for lending protocols',
    defaultTab: 'wrap',
    features: {
      wrap: true,
      transfer: false,
      unwrap: true,
    },
    mockApp: {
      title: 'Confidential Lending Platform',
      description: 'Deposit your assets confidentially and earn yields',
      type: 'lending',
    },
  },
  payment: {
    id: 'payment',
    name: 'Confidential Payment',
    description: 'Confidential peer-to-peer transfers',
    defaultTab: 'transfer',
    features: {
      wrap: true,
      transfer: true,
      unwrap: true,
    },
    mockApp: {
      title: 'Confidential Payment App',
      description: 'Send payments with encrypted amounts',
      type: 'payment',
    },
  },
  defi: {
    id: 'defi',
    name: 'Confidential DeFi',
    description: 'Full-featured confidential balance demo',
    defaultTab: 'wrap',
    features: {
      wrap: true,
      transfer: true,
      unwrap: true,
    },
    mockApp: {
      title: 'Confidential DeFi Application',
      description: 'Complete confidential balance experience',
      type: 'defi',
    },
  },
}

export const defaultScenario: ScenarioConfig = scenarios.defi
