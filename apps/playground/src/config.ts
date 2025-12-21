/**
 * Application Configuration
 *
 * This file contains application-specific token addresses and configurations.
 * These are separate from the infrastructure contracts (Factory) which live
 * in the @shieldkit/react package.
 */

import type { Address } from 'viem'

/**
 * Test token addresses for the example application
 * These are deployed instances for testing and demonstration
 */
export interface TestTokens {
  /** ERC20 test token address */
  erc20: Address
  /** Confidential wrapper (ERC7984) for the test token */
  wrapper: Address
}

/**
 * Sepolia testnet token addresses
 * Update these with your deployed test token addresses
 */
export const SEPOLIA_TEST_TOKENS: TestTokens = {
  // Update these addresses with your actual deployed tokens
  erc20: '0x0000000000000000000000000000000000000000', // TODO: Add your test ERC20 address
  wrapper: '0x0000000000000000000000000000000000000000', // TODO: Add your test wrapper address
}

/**
 * Default test tokens by chain ID
 */
export const TEST_TOKENS_BY_CHAIN: Record<number, TestTokens> = {
  11155111: SEPOLIA_TEST_TOKENS, // Sepolia
}
