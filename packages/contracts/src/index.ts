/**
 * @z-payment/contracts
 *
 * Contract ABIs and addresses for Z-Payment
 * Deploy addresses for Sepolia testnet
 *
 * @packageDocumentation
 */

// Re-export contract ABIs and addresses from demo app
// This allows the demo app and SDK packages to share the same contract definitions

// NOTE: In Phase 6, we will move the actual CONTRACTS object here
// For now, we export a placeholder that will be populated

export { CONTRACTS } from '../../../apps/demo/lib/contracts'

// Export chain IDs
export const CHAIN_IDS = {
  SEPOLIA: 11155111,
  MAINNET: 1,
} as const

export type ChainId = typeof CHAIN_IDS[keyof typeof CHAIN_IDS]

// Export contract addresses by chain
export const CONTRACT_ADDRESSES = {
  [CHAIN_IDS.SEPOLIA]: {
    ConfidentialTokenFactory: '0x08B2616Eb8F33700014fd53f143aFcaD1d6e512c' as const,
    cUSD_ERC7984: '0xdCE9Fa07b2ad32D2E6C8051A895262C9914E9445' as const,
    USD_ERC20: '0xA9062b4629bc8fB79cB4eE904C5c9E179e9F492a' as const,
  },
  // Mainnet addresses TBD
  [CHAIN_IDS.MAINNET]: {
    ConfidentialTokenFactory: '' as const,
    cUSD_ERC7984: '' as const,
    USD_ERC20: '' as const,
  },
} as const

export type ContractAddresses = typeof CONTRACT_ADDRESSES[ChainId]
