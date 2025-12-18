/**
 * Contract Configuration
 *
 * This file contains contract addresses for Z-Payment infrastructure.
 * Only contains the Factory contract address - specific token addresses
 * should be configured at the application level.
 */

import type { Address } from 'viem'

/**
 * Supported chain IDs
 */
export const CHAIN_IDS = {
  SEPOLIA: 11155111,
  MAINNET: 1,
} as const

export type ChainId = typeof CHAIN_IDS[keyof typeof CHAIN_IDS]

/**
 * Contract addresses for Z-Payment infrastructure
 * Contains only the ConfidentialTokenFactory address
 */
export interface ContractAddresses {
  /** Factory contract for creating confidential token wrappers */
  ConfidentialTokenFactory: Address
}

/**
 * Deployed contract addresses by chain
 */
export const CONTRACT_ADDRESSES: Record<ChainId, ContractAddresses> = {
  [CHAIN_IDS.SEPOLIA]: {
    ConfidentialTokenFactory: '0x08B2616Eb8F33700014fd53f143aFcaD1d6e512c',
  },
  [CHAIN_IDS.MAINNET]: {
    // TODO: Deploy to mainnet
    ConfidentialTokenFactory: '0x0000000000000000000000000000000000000000',
  },
}

/**
 * Get factory address for a specific chain
 *
 * @param chainId - Chain ID
 * @returns Factory contract address
 *
 * @example
 * ```typescript
 * const factoryAddress = getFactoryAddress(CHAIN_IDS.SEPOLIA)
 * ```
 */
export function getFactoryAddress(chainId: ChainId): Address {
  const addresses = CONTRACT_ADDRESSES[chainId]
  if (!addresses) {
    throw new Error(`No contract addresses configured for chain ${chainId}`)
  }
  return addresses.ConfidentialTokenFactory
}
