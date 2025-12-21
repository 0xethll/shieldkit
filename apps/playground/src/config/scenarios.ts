export type ScenarioId = 'lending' | 'payment' | 'quickstart'
export type DefaultTab = 'wrap' | 'transfer' | 'unwrap'

export interface ScenarioConfig {
  id: ScenarioId
  name: string
  description: string
  defaultTab: DefaultTab
  tokens: string[]
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
    tokens: ['USDC'],
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
    tokens: ['USDT', 'USDC'],
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
    tokens: ['USDC', 'USDT', 'DAI'],
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
