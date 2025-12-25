/**
 * useFinalizeUnwrap Hook
 *
 * React hook for finalizing unwrap requests with decryption
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { type Address, type Hash } from 'viem'
import { ConfidentialERC20WrapperABI } from '../abis'
import { useFHEContext } from '../context/FHEContext'

/**
 * Decryption result - successfully decrypted
 */
export interface DecryptedAmount {
  cleartextAmount: bigint
  proof: `0x${string}`
  status: 'success'
}

/**
 * Decryption result - loading or error
 */
export interface DecryptingAmount {
  status: 'loading' | 'error'
  error?: string
}

/**
 * Combined decryption result type
 */
export type DecryptionResult = DecryptedAmount | DecryptingAmount

/**
 * Finalize unwrap parameters
 */
export interface UseFinalizeUnwrapParams {
  /** Address of the confidential token */
  tokenAddress?: Address
  /** Callback function to execute when finalization succeeds */
  onSuccess?: () => void
}

/**
 * Finalize unwrap return type
 */
export interface UseFinalizeUnwrapReturn {
  /** Function to finalize an unwrap request */
  finalizeUnwrap: (burntAmount: `0x${string}`, decryptionResult?: DecryptionResult) => Promise<void>
  /** Whether finalization is in progress */
  isFinalizing: boolean
  /** Whether finalization succeeded */
  isSuccess: boolean
  /** Error message if finalization failed */
  error: string | undefined
  /** Transaction hash */
  txHash: Hash | undefined
  /** The burnt amount currently being finalized */
  pendingTx: string | null
  /** Whether FHE is ready for decryption */
  isFHEReady: boolean
}

/**
 * Hook for finalizing unwrap requests
 *
 * This hook handles the finalization of unwrap requests by:
 * 1. Decrypting the burnt amount (using cache if available)
 * 2. Calling finalizeUnwrap on the contract with the cleartext amount and proof
 *
 * @param params - Finalize unwrap parameters
 * @returns Finalize unwrap functions and state
 *
 * @example
 * ```tsx
 * const { finalizeUnwrap, isFinalizing, isFHEReady } = useFinalizeUnwrap({
 *   tokenAddress: '0x...',
 *   onSuccess: () => {
 *     console.log('Unwrap finalized!')
 *     refetchQueue()
 *   }
 * })
 *
 * // Finalize an unwrap request
 * if (isFHEReady) {
 *   await finalizeUnwrap('0xBurntAmountHandle...')
 * }
 * ```
 *
 * @example With pre-decryption for better performance
 * ```tsx
 * // Pre-decrypt amounts in the background
 * const decryptedCache = useDecryptedAmounts(unwrapRequests, fheInstance)
 *
 * // Pass decryption result directly to finalization
 * const { finalizeUnwrap } = useFinalizeUnwrap({
 *   tokenAddress: '0x...',
 * })
 *
 * // Get the decryption result for this specific request
 * const decryptionResult = decryptedCache.get(burntAmount)
 * await finalizeUnwrap(burntAmount, decryptionResult) // Instant if already decrypted
 * ```
 */
export function useFinalizeUnwrap(
  params: UseFinalizeUnwrapParams = {},
): UseFinalizeUnwrapReturn {
  const { tokenAddress, onSuccess } = params
  const { isFHEReady, fheInstance } = useFHEContext()

  const [isDecrypting, setIsDecrypting] = useState(false)
  // Track which transaction is currently pending
  const [pendingTx, setPendingTx] = useState<string | null>(null)

  // Store onSuccess callback in ref to avoid re-renders
  const onSuccessRef = useRef(onSuccess)
  useEffect(() => {
    onSuccessRef.current = onSuccess
  }, [onSuccess])

  // Write contract hook
  const {
    writeContract,
    data: txHash,
    isPending: isWritePending,
    error: writeError,
  } = useWriteContract()

  // Wait for transaction confirmation
  const {
    isLoading: isConfirming,
    isSuccess,
    isError: isConfirmError,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  })

  // Execute callback on successful finalization or clear pending on error
  useEffect(() => {
    if (isSuccess) {
      setPendingTx(null)
      onSuccessRef.current?.()
    } else if (isConfirmError || writeError) {
      setPendingTx(null)
    }
  }, [isSuccess, isConfirmError, writeError])

  /**
   * Finalize an unwrap request by providing the decrypted amount and proof
   *
   * @param burntAmount - The encrypted amount handle (bytes32)
   * @param decryptionResult - Optional pre-decrypted result for performance
   */
  const finalizeUnwrap = useCallback(
    async (burntAmount: `0x${string}`, decryptionResult?: DecryptionResult) => {
      setPendingTx(burntAmount)

      // Validation
      if (!fheInstance) {
        throw new Error('FHE instance not initialized')
      }
      if (!tokenAddress) {
        throw new Error('Token address not provided')
      }

      try {
        setIsDecrypting(true)
        let cleartextAmount: bigint
        let proof: `0x${string}`

        // Use provided decryption result if available
        if (decryptionResult && decryptionResult.status === 'success') {
          // Use pre-decrypted result
          cleartextAmount = decryptionResult.cleartextAmount
          proof = decryptionResult.proof
        } else {
          // Decrypt on-demand if no result provided
          const { decryptPublicly } = await import('@shieldkit/core')
          const [amount, decryptionProof] = await decryptPublicly(
            fheInstance,
            burntAmount,
          )
          cleartextAmount = amount
          proof = decryptionProof
        }

        // Call finalizeUnwrap on the contract
        writeContract({
          address: tokenAddress,
          abi: ConfidentialERC20WrapperABI,
          functionName: 'finalizeUnwrap',
          args: [burntAmount, cleartextAmount, proof],
        })
      } catch (error) {
        setPendingTx(null)
        console.error('Finalize unwrap error:', error)
        throw error
      } finally {
        setIsDecrypting(false)
      }
    },
    [fheInstance, tokenAddress, writeContract],
  )

  return {
    finalizeUnwrap,
    isFinalizing: isDecrypting || isWritePending || isConfirming,
    isSuccess,
    error: writeError?.message || confirmError?.message,
    txHash,
    pendingTx,
    isFHEReady,
  }
}
