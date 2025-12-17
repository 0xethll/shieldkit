/**
 * useFactory Hook
 *
 * React hook for interacting with the ConfidentialTokenFactory contract
 */

import { useCallback, useEffect, useRef } from 'react'
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from 'wagmi'
import { type Address, type Hash } from 'viem'
import { CONTRACTS, CONTRACT_ADDRESSES, CHAIN_IDS } from '@z-payment/contracts'

/**
 * Factory create wrapper parameters
 */
export interface UseFactoryParams {
  /** Callback function to execute when wrapper creation succeeds */
  onSuccess?: (wrapperAddress?: Address) => void
  /** Chain ID to use (defaults to Sepolia) */
  chainId?: number
}

/**
 * Factory create wrapper return type
 */
export interface UseFactoryReturn {
  /** Function to create a new wrapper for an ERC20 token */
  createWrapper: (erc20Address: Address) => Promise<void>
  /** Whether wrapper creation is in progress */
  isLoading: boolean
  /** Whether wrapper creation succeeded */
  isSuccess: boolean
  /** Error message if creation failed */
  error: string | undefined
  /** Transaction hash */
  txHash: Hash | undefined
  /** Reset the hook state */
  reset: () => void
  /** Factory contract address */
  factoryAddress: Address
}

/**
 * Hook for reading the wrapper address for a given ERC20 token
 *
 * @param erc20Address - Address of the ERC20 token
 * @param chainId - Chain ID (defaults to Sepolia)
 * @returns Wrapper address and query state
 */
export function useWrappedTokenAddress(
  erc20Address?: Address | null,
  chainId: number = CHAIN_IDS.SEPOLIA,
) {
  const factoryAddress =
    CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]
      ?.ConfidentialTokenFactory

  const {
    data: wrappedAddress,
    refetch,
    isLoading,
  } = useReadContract({
    address: factoryAddress,
    abi: CONTRACTS.ConfidentialTokenFactory.abi,
    functionName: 'getConfidentialToken',
    args: erc20Address ? [erc20Address] : undefined,
    query: {
      enabled: !!erc20Address && !!factoryAddress,
    },
  })

  // Check if the wrapped token exists (not 0x0)
  const hasWrappedToken =
    wrappedAddress &&
    wrappedAddress !== '0x0000000000000000000000000000000000000000'

  return {
    wrappedAddress: hasWrappedToken ? (wrappedAddress as Address) : null,
    refetch,
    isLoading,
  }
}

/**
 * Hook for creating new confidential token wrappers
 *
 * This hook allows you to create a new confidential ERC7984 wrapper
 * for any ERC20 token using the ConfidentialTokenFactory contract.
 *
 * @param params - Factory parameters
 * @returns Factory functions and state
 *
 * @example
 * ```tsx
 * const { createWrapper, isLoading, isSuccess } = useFactory({
 *   onSuccess: (wrapperAddress) => {
 *     console.log('Wrapper created at:', wrapperAddress)
 *   }
 * })
 *
 * // Create a wrapper for an ERC20 token
 * await createWrapper('0xERC20Address...')
 * ```
 *
 * @example Check if wrapper already exists
 * ```tsx
 * const { wrappedAddress, isLoading } = useWrappedTokenAddress('0xERC20...')
 *
 * if (wrappedAddress) {
 *   console.log('Wrapper already exists:', wrappedAddress)
 * } else {
 *   console.log('No wrapper found, create one first')
 * }
 * ```
 */
export function useFactory(params: UseFactoryParams = {}): UseFactoryReturn {
  const { onSuccess, chainId = CHAIN_IDS.SEPOLIA } = params
  const { address: userAddress } = useAccount()

  const factoryAddress =
    CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]
      ?.ConfidentialTokenFactory

  // Store onSuccess callback in ref to avoid re-renders
  const onSuccessRef = useRef(onSuccess)
  useEffect(() => {
    onSuccessRef.current = onSuccess
  }, [onSuccess])

  // Write contract hook
  const {
    writeContract,
    data: txHash,
    reset: resetWrite,
    isPending: isWritePending,
    error: writeError,
  } = useWriteContract()

  // Wait for transaction confirmation
  const {
    isLoading: isConfirming,
    isSuccess,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  })

  /**
   * Create a new confidential token wrapper
   *
   * @param erc20Address - Address of the ERC20 token to wrap
   */
  const createWrapper = useCallback(
    async (erc20Address: Address) => {
      // Validation
      if (!userAddress) {
        throw new Error('Wallet not connected')
      }

      if (!factoryAddress) {
        throw new Error(
          `Factory contract not deployed on chain ${chainId}`,
        )
      }

      // Reset previous state
      resetWrite()

      try {
        writeContract({
          address: factoryAddress,
          abi: CONTRACTS.ConfidentialTokenFactory.abi,
          functionName: 'createConfidentialToken',
          args: [erc20Address],
        })
      } catch (error) {
        console.error('Create wrapper error:', error)
        throw error
      }
    },
    [userAddress, factoryAddress, chainId, resetWrite, writeContract],
  )

  // Execute onSuccess callback when creation succeeds
  useEffect(() => {
    if (isSuccess) {
      // TODO: Extract wrapper address from transaction receipt logs
      // For now, just call the callback without the address
      onSuccessRef.current?.()
    }
  }, [isSuccess])

  return {
    createWrapper,
    isLoading: isWritePending || isConfirming,
    isSuccess,
    error: writeError?.message || confirmError?.message,
    txHash,
    reset: resetWrite,
    factoryAddress: factoryAddress as Address,
  }
}
