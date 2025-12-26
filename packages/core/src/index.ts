/**
 * @shieldkit/core
 *
 * Core utilities and types for shieldkit - Framework-agnostic FHE operations
 * Built on Zama's Fully Homomorphic Encryption (FHE) technology
 *
 * @example
 * ```typescript
 * import { initializeFHE, createFHEInstance, encryptUint64 } from '@shieldkit/core'
 *
 * // Initialize FHE
 * await initializeFHE()
 * const fheInstance = await createFHEInstance()
 *
 * // Encrypt an amount
 * const { handle, proof } = await encryptUint64(
 *   fheInstance,
 *   contractAddress,
 *   userAddress,
 *   100n
 * )
 * ```
 *
 * @packageDocumentation
 */

// Export types
export type {
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
