/**
 * @shieldkit/react
 *
 * React hooks and providers for Z-Payment
 * Built on @shieldkit/core and wagmi
 *
 * @example
 * ```tsx
 * import { FHEProvider, useWrap } from '@shieldkit/react'
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

export { useAllowance } from './hooks/useAllowance'
export type { UseAllowanceParams, UseAllowanceReturn } from './hooks/useAllowance'

export { useApproval } from './hooks/useApproval'
export type { UseApprovalParams, UseApprovalReturn } from './hooks/useApproval'

export { useWrapFlow } from './hooks/useWrapFlow'
export type {
  UseWrapFlowParams,
  UseWrapFlowReturn,
  WrapFlowStep,
  TransactionState,
} from './hooks/useWrapFlow'

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

export {
  useConfidentialBalance,
  useConfidentialBalanceFor,
} from './hooks/useConfidentialBalance'
export type {
  UseConfidentialBalanceParams,
  UseConfidentialBalanceReturn,
  UseConfidentialBalanceForParams,
  UseConfidentialBalanceForReturn,
} from './hooks/useConfidentialBalance'

// Re-export core types for convenience
export type {
  WrapParams,
  UnwrapParams,
  TransferParams,
  EncryptedBalance,
  UnwrapRequest,
  FhevmInstance,
} from '@shieldkit/core'

// Export ABIs
export {
  ConfidentialTokenFactoryABI,
  ConfidentialERC20WrapperABI,
  ERC20ABI,
} from './abis'
export type {
  ConfidentialTokenFactoryABIType,
  ConfidentialERC20WrapperABIType,
  ERC20ABIType,
} from './abis'

// Export contract configuration
export {
  CHAIN_IDS,
  CONTRACT_ADDRESSES,
  getFactoryAddress,
} from './config/contracts'
export type { ChainId, ContractAddresses } from './config/contracts'

// Export utilities
export { getEthersSigner, clientToSigner } from './utils/client-to-signer'

// Export theme system
export {
  ThemeProvider,
  accentColors,
  themeColors,
  radiusSizes,
  DEFAULT_THEME,
  PRESET_THEMES,
} from './themes'
export type {
  ThemeProviderProps,
  ThemeType,
  AccentColor,
  RadiusSize,
  ThemeConfig,
} from './themes'

// Export UI Components
export { ConfidentialWidget } from './components/ConfidentialWidget'
export type {
  ConfidentialWidgetProps,
  TokenConfig,
  WidgetFeatures,
} from './components/types'

export { default as TokenSelector } from './components/TokenSelector'
export type { TokenSelectorProps } from './components/TokenSelector'

export { default as WrapStepIndicator } from './components/WrapStepIndicator'
export { default as QueueItem } from './components/QueueItem'
export { default as QueueItemSkeleton } from './components/QueueItemSkeleton'

// Export Panel components (for advanced customization)
export { default as WrapPanel } from './components/WrapPanel'
export { default as TransferPanel } from './components/TransferPanel'
export { default as UnwrapPanel } from './components/UnwrapPanel'

// Export utilities
export { getTokenPrefix, formatErrorMessage } from './utils/helpers'
export { useDecryptedAmounts } from './hooks/useDecryptedAmounts'

export const PACKAGE_VERSION = '0.1.0'
