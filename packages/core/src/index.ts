/**
 * @z-payment/core
 *
 * Core SDK for Z-Payment - Framework-agnostic confidential token operations
 * Built on Zama's Fully Homomorphic Encryption (FHE) technology
 *
 * @example
 * ```typescript
 * import { ConfidentialTokenSDK } from '@z-payment/core'
 *
 * const sdk = new ConfidentialTokenSDK({
 *   tokenAddress: '0x...',
 *   provider: window.ethereum
 * })
 *
 * await sdk.init()
 * await sdk.wrap({ amount: 100n, to: userAddress })
 * ```
 *
 * @packageDocumentation
 */

// Export SDKs
export { ConfidentialTokenSDK } from './sdk'
export { ConfidentialTokenFactorySDK } from './factory-sdk'

// Export types
export type {
  // Configuration
  SDKConfig,
  FactorySDKConfig,

  // Operation parameters
  WrapParams,
  UnwrapParams,
  FinalizeUnwrapParams,
  TransferParams,
  CreateWrapperParams,

  // Operation results
  WrapResult,
  UnwrapResult,
  FinalizeUnwrapResult,
  TransferResult,
  CreateWrapperResult,

  // Data types
  EncryptedBalance,
  UnwrapRequest,
  TokenMetadata,

  // FHE types
  FhevmInstance,
} from './types'

// Export FHE utilities (for advanced use cases)
export {
  initializeFHE,
  createFHEInstance,
  encryptUint64,
  decryptPublicly,
  decryptForUser,
  formatTokenAmount,
  parseTokenAmount,
} from './fhe'
