/**
 * useApproval Hook
 *
 * React hook for approving ERC20 token spending
 */

import { useEffect, useRef, useCallback } from 'react'
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { parseUnits, type Address, type Hash } from 'viem'
import { ERC20ABI } from '../abis'

/**
 * Approval operation parameters
 */
export interface UseApprovalParams {
  /** Address of the ERC20 token to approve */
  tokenAddress?: Address
  /** Address of the spender (usually the wrapper contract) */
  spenderAddress?: Address
  /** Number of decimals for the token (default: 6) */
  decimals?: number
  /** Callback function to execute when approval succeeds */
  onSuccess?: () => void
}

/**
 * Approval operation return type
 */
export interface UseApprovalReturn {
  /** Function to approve tokens (pass amount as string, or 'max' for infinite approval) */
  approve: (amount: string | 'max') => Promise<void>
  /** Whether the approval operation is in progress */
  isLoading: boolean
  /** Whether the approval operation succeeded */
  isSuccess: boolean
  /** Error message if approval failed */
  error: string | null
  /** Transaction hash */
  txHash: Hash | undefined
  /** Reset the hook state */
  reset: () => void
}

/**
 * Hook for approving ERC20 token spending
 *
 * This hook handles the approval transaction that allows a spender
 * (typically a wrapper contract) to spend tokens on behalf of the user.
 *
 * @param params - Approval parameters
 * @returns Approval operation functions and state
 *
 * @example
 * ```tsx
 * const { approve, isLoading, isSuccess } = useApproval({
 *   tokenAddress: '0xToken...',
 *   spenderAddress: '0xWrapper...',
 *   decimals: 6,
 *   onSuccess: () => console.log('Approved!')
 * })
 *
 * // Approve specific amount
 * await approve('100')
 *
 * // Approve infinite amount
 * await approve('max')
 * ```
 */
export function useApproval(
  params: UseApprovalParams = {},
): UseApprovalReturn {
  const { tokenAddress, spenderAddress, decimals = 6, onSuccess } = params
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
   * Approve tokens for spending
   *
   * @param amount - Amount to approve (string like "100.5" or "max" for infinite)
   */
  const approve = useCallback(
    async (amount: string | 'max') => {
      // Validation
      if (!userAddress) {
        throw new Error('Wallet not connected')
      }
      if (!tokenAddress) {
        throw new Error('Token address not provided')
      }
      if (!spenderAddress) {
        throw new Error('Spender address not provided')
      }
      if (!amount) {
        throw new Error('Invalid amount')
      }

      // Reset previous state
      resetWrite()

      try {
        // Parse amount
        const approvalAmount = parseUnits(amount, decimals)

        // Call approve function on ERC20 token
        writeContract({
          address: tokenAddress,
          abi: ERC20ABI,
          functionName: 'approve',
          args: [spenderAddress, approvalAmount],
        })
      } catch (error) {
        console.error('Approval error:', error)
        throw error
      }
    },
    [userAddress, tokenAddress, spenderAddress, decimals, resetWrite, writeContract],
  )

  // Execute onSuccess callback when approval succeeds
  useEffect(() => {
    if (isSuccess) {
      onSuccessRef.current?.()
    }
  }, [isSuccess])

  // Parse error message
  const error = writeError?.message || confirmError?.message || null

  return {
    approve,
    isLoading: isWritePending || isConfirming,
    isSuccess,
    error,
    txHash,
    reset: resetWrite,
  }
}
