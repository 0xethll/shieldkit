import type { Address } from 'viem'

export type ScenarioId = 'lending' | 'payment' | 'quickstart'
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
  tokens: TokenConfig[]
  features: {
    wrap: boolean
    transfer: boolean
    unwrap: boolean
    autoDeploy: boolean
  }
  mockApp: {
    title: string
    description: string
    type: 'lending' | 'payment' | 'defi'
  }
}

export const scenarios: Record<ScenarioId, ScenarioConfig> = {
  lending: {
    id: 'lending',
    name: 'Privacy Lending',
    description: 'Private asset deposit for lending protocols',
    defaultTab: 'wrap',
    tokens: [
      {
        symbol: 'USDC',
        address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
        decimals: 6,
        name: 'Sepolia USDC',
      },
    ],
    features: {
      wrap: true,
      transfer: false,
      unwrap: true,
      autoDeploy: true,
    },
    mockApp: {
      title: 'Privacy Lending Platform',
      description: 'Deposit your assets privately and earn yields',
      type: 'lending',
    },
  },
  payment: {
    id: 'payment',
    name: 'P2P Payment',
    description: 'Private peer-to-peer transfers',
    defaultTab: 'transfer',
    tokens: [
      {
        symbol: 'USDT',
        address: '0x7169D38820dfd117C3FA1f22a697dBA58d90BA06',
        decimals: 6,
        name: 'Test Tether USD',
      },
      {
        symbol: 'USDC',
        address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
        decimals: 6,
        name: 'Sepolia USDC',
      },
    ],
    features: {
      wrap: true,
      transfer: true,
      unwrap: true,
      autoDeploy: true,
    },
    mockApp: {
      title: 'Privacy Payment App',
      description: 'Send payments without revealing amounts',
      type: 'payment',
    },
  },
  quickstart: {
    id: 'quickstart',
    name: 'Quick Start',
    description: 'Full-featured privacy wallet demo',
    defaultTab: 'wrap',
    tokens: [
      {
        symbol: 'USDC',
        address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
        decimals: 6,
        name: 'Sepolia USDC',
      },
      {
        symbol: 'USDT',
        address: '0x7169D38820dfd117C3FA1f22a697dBA58d90BA06',
        decimals: 6,
        name: 'Test Tether USD',
      },
      {
        symbol: 'USD',
        address: '0xA9062b4629bc8fB79cB4eE904C5c9E179e9F492a',
        decimals: 6,
        name: 'USD Token',
      },
    ],
    features: {
      wrap: true,
      transfer: true,
      unwrap: true,
      autoDeploy: true,
    },
    mockApp: {
      title: 'DeFi Application',
      description: 'Complete privacy-enabled DeFi experience',
      type: 'defi',
    },
  },
}

export const defaultScenario: ScenarioConfig = scenarios.quickstart
