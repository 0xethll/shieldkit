/**
 * @z-payment/react
 *
 * React hooks and providers for Z-Payment
 * Built on @z-payment/core and wagmi
 *
 * @example
 * ```tsx
 * import { FHEProvider, useWrap } from '@z-payment/react'
 *
 * function App() {
 *   return (
 *     <FHEProvider>
 *       <MyComponent />
 *     </FHEProvider>
 *   )
 * }
 *
 * function MyComponent() {
 *   const { wrap, isLoading } = useWrap({ tokenAddress: '0x...' })
 *   return (
 *     <button onClick={() => wrap('100')} disabled={isLoading}>
 *       Wrap 100 tokens
 *     </button>
 *   )
 * }
 * ```
 *
 * @packageDocumentation
 */

// Export FHE Context and Provider
export { FHEProvider, useFHEContext } from './context/FHEContext'
export type { FHEContextType, FHEProviderProps } from './context/FHEContext'

// Export Hooks
export { useWrap } from './hooks/useWrap'
export type { UseWrapParams, UseWrapReturn } from './hooks/useWrap'

export { useUnwrap } from './hooks/useUnwrap'
export type { UseUnwrapParams, UseUnwrapReturn } from './hooks/useUnwrap'

export { useTransfer } from './hooks/useTransfer'
export type { UseTransferParams, UseTransferReturn } from './hooks/useTransfer'

export { useUnwrapQueue } from './hooks/useUnwrapQueue'
export type {
  UseUnwrapQueueParams,
  UseUnwrapQueueReturn,
} from './hooks/useUnwrapQueue'
export { UNWRAP_REQUESTS_QUERY } from './hooks/useUnwrapQueue'

export { useFinalizeUnwrap } from './hooks/useFinalizeUnwrap'
export type {
  UseFinalizeUnwrapParams,
  UseFinalizeUnwrapReturn,
  DecryptionResult,
  DecryptedAmount,
  DecryptingAmount,
} from './hooks/useFinalizeUnwrap'

export { useFactory, useWrappedTokenAddress } from './hooks/useFactory'
export type { UseFactoryParams, UseFactoryReturn } from './hooks/useFactory'

// Re-export core types for convenience
export type {
  WrapParams,
  UnwrapParams,
  TransferParams,
  EncryptedBalance,
  UnwrapRequest,
  FhevmInstance,
} from '@z-payment/core'

// Re-export contracts for convenience
export { CONTRACTS, CONTRACT_ADDRESSES, CHAIN_IDS } from '@z-payment/contracts'
export type { ChainId, ContractAddresses } from '@z-payment/contracts'

// Export utilities
export { getEthersSigner, clientToSigner } from './utils/client-to-signer'

export const PACKAGE_VERSION = '0.1.0'
