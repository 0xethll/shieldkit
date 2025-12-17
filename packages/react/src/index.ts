/**
 * @z-payment/react
 *
 * React hooks and providers for Z-Payment
 * Built on @z-payment/core and wagmi
 *
 * @example
 * ```tsx
 * import { ConfidentialTokenProvider, useWrap } from '@z-payment/react'
 *
 * function App() {
 *   return (
 *     <ConfidentialTokenProvider tokenAddress="0x...">
 *       <MyComponent />
 *     </ConfidentialTokenProvider>
 *   )
 * }
 *
 * function MyComponent() {
 *   const { wrap, isLoading } = useWrap()
 *   return <button onClick={() => wrap(100n)}>Wrap</button>
 * }
 * ```
 *
 * @packageDocumentation
 */

// NOTE: Full implementation will be migrated from apps/demo in Phase 6
// This is a placeholder structure for now

// Export contexts (to be implemented)
// export { ConfidentialTokenProvider, useConfidentialTokenContext } from './context/ConfidentialTokenContext'
// export { FHEProvider, useFHEContext } from './context/FHEContext'

// Export hooks (to be implemented)
// export { useWrap } from './hooks/useWrap'
// export { useUnwrap } from './hooks/useUnwrap'
// export { useUnwrapQueue } from './hooks/useUnwrapQueue'
// export { useTransfer } from './hooks/useTransfer'
// export { useFactory } from './hooks/useFactory'
// export { useConfidentialToken } from './hooks/useConfidentialToken'

// Re-export core types for convenience
export type {
  WrapParams,
  UnwrapParams,
  TransferParams,
  EncryptedBalance,
  UnwrapRequest,
} from '@z-payment/core'

export const PACKAGE_VERSION = '0.1.0'
