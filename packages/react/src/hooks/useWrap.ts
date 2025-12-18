/**
 * useWrap Hook
 *
 * React hook for wrapping ERC20 tokens into confidential tokens
 */

import { useEffect, useRef, useCallback } from 'react'
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { parseUnits, type Address, type Hash } from 'viem'
import { ConfidentialERC20WrapperABI } from '../abis'

/**
 * Wrap operation parameters
 */
export interface UseWrapParams {
  /** Address of the confidential token wrapper */
  tokenAddress?: Address
  /** Number of decimals for the underlying ERC20 token (default: 6) */
  decimals?: number
  /** Callback function to execute when wrap succeeds */
  onSuccess?: () => void
}

/**
 * Wrap operation return type
 */
export interface UseWrapReturn {
  /** Function to wrap tokens */
  wrap: (amount: string) => Promise<void>
  /** Whether the wrap operation is in progress */
  isLoading: boolean
  /** Whether the wrap operation succeeded */
  isSuccess: boolean
  /** Error message if wrap failed */
  error: string | null
  /** Transaction hash */
  txHash: Hash | undefined
  /** Reset the hook state */
  reset: () => void
}

/**
 * Hook for wrapping ERC20 tokens into confidential tokens
 *
 * @param params - Wrap parameters
 * @returns Wrap operation functions and state
 *
 * @example
 * ```tsx
 * const { wrap, isLoading, isSuccess } = useWrap({
 *   tokenAddress: '0x...',
 *   decimals: 6,
 *   onSuccess: () => console.log('Wrapped!')
 * })
 *
 * // Wrap 100 tokens
 * await wrap('100')
 * ```
 */
export function useWrap(params: UseWrapParams = {}): UseWrapReturn {
  const { tokenAddress, decimals = 6, onSuccess } = params
  const { address: userAddress } = useAccount()

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
   * Wrap tokens
   *
   * @param amount - Amount of tokens to wrap (in human-readable format, e.g., "100.5")
   */
  const wrap = useCallback(
    async (amount: string) => {
      // Validation
      if (!userAddress) {
        throw new Error('Wallet not connected')
      }
      if (!amount || amount === '0') {
        throw new Error('Invalid amount')
      }
      if (!tokenAddress) {
        throw new Error('Token address not provided')
      }

      // Reset previous state
      resetWrite()

      try {
        // Convert to wei/smallest unit
        const amountWei = parseUnits(amount, decimals)

        // Call wrap function on the confidential token contract
        writeContract({
          address: tokenAddress,
          abi: ConfidentialERC20WrapperABI,
          functionName: 'wrap',
          args: [userAddress, amountWei],
        })
      } catch (error) {
        console.error('Wrap error:', error)
        throw error
      }
    },
    [userAddress, tokenAddress, decimals, resetWrite, writeContract],
  )

  // Execute onSuccess callback when wrap succeeds
  useEffect(() => {
    if (isSuccess) {
      onSuccessRef.current?.()
    }
  }, [isSuccess])

  // Parse error message
  const error = writeError?.message || confirmError?.message || null

  return {
    wrap,
    isLoading: isWritePending || isConfirming,
    isSuccess,
    error,
    txHash,
    reset: resetWrite,
  }
}
