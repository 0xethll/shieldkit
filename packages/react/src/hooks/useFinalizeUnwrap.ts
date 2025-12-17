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
import { CONTRACTS } from '@z-payment/contracts'
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
  /** Optional cache of pre-decrypted amounts (for performance optimization) */
  decryptedCache?: Map<string, DecryptionResult>
}

/**
 * Finalize unwrap return type
 */
export interface UseFinalizeUnwrapReturn {
  /** Function to finalize an unwrap request */
  finalizeUnwrap: (burntAmount: `0x${string}`) => Promise<void>
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
 * @example With caching for better performance
 * ```tsx
 * // Pre-decrypt amounts in the background
 * const decryptedCache = useDecryptedAmounts(unwrapRequests, fheInstance)
 *
 * // Pass cache to finalization hook
 * const { finalizeUnwrap } = useFinalizeUnwrap({
 *   tokenAddress: '0x...',
 *   decryptedCache, // Instant finalization if already decrypted
 * })
 * ```
 */
export function useFinalizeUnwrap(
  params: UseFinalizeUnwrapParams = {},
): UseFinalizeUnwrapReturn {
  const { tokenAddress, onSuccess, decryptedCache } = params
  const { isFHEReady, fheInstance } = useFHEContext()

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
    } else if (isConfirmError) {
      setPendingTx(null)
    }
  }, [isSuccess, isConfirmError])

  /**
   * Finalize an unwrap request by providing the decrypted amount and proof
   *
   * @param burntAmount - The encrypted amount handle (bytes32)
   */
  const finalizeUnwrap = useCallback(
    async (burntAmount: `0x${string}`) => {
      setPendingTx(burntAmount)

      // Validation
      if (!fheInstance) {
        throw new Error('FHE instance not initialized')
      }
      if (!tokenAddress) {
        throw new Error('Token address not provided')
      }

      try {
        let cleartextAmount: bigint
        let proof: `0x${string}`

        // Try to use cached decryption result first
        const cached = decryptedCache?.get(burntAmount)
        if (cached && cached.status === 'success') {
          // Use cached result
          cleartextAmount = cached.cleartextAmount
          proof = cached.proof
        } else {
          // Decrypt on-demand if not in cache
          const { decryptPublicly } = await import('@z-payment/core')
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
          abi: CONTRACTS.cUSD_ERC7984.abi,
          functionName: 'finalizeUnwrap',
          args: [burntAmount, cleartextAmount, proof],
        })
      } catch (error) {
        setPendingTx(null)
        console.error('Finalize unwrap error:', error)
        throw error
      }
    },
    [fheInstance, tokenAddress, decryptedCache, writeContract],
  )

  return {
    finalizeUnwrap,
    isFinalizing: isWritePending || isConfirming,
    isSuccess,
    error: writeError?.message || confirmError?.message,
    txHash,
    pendingTx,
    isFHEReady,
  }
}
