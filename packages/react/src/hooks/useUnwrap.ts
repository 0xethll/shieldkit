/**
 * useUnwrap Hook
 *
 * React hook for unwrapping confidential tokens back to ERC20 tokens
 */

import { useEffect, useRef, useCallback } from 'react'
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { type Address, type Hash } from 'viem'
import { CONTRACTS } from '@z-payment/contracts'
import { useFHEContext } from '../context/FHEContext'

/**
 * Unwrap operation parameters
 */
export interface UseUnwrapParams {
  /** Address of the confidential token wrapper */
  tokenAddress?: Address
  /** Callback function to execute when unwrap succeeds */
  onSuccess?: () => void
}

/**
 * Unwrap operation return type
 */
export interface UseUnwrapReturn {
  /** Function to unwrap tokens - takes amount in human-readable format and encrypts internally */
  unwrap: (amount: string) => Promise<void>
  /** Whether the unwrap operation is in progress */
  isLoading: boolean
  /** Whether the unwrap operation succeeded */
  isSuccess: boolean
  /** Error message if unwrap failed */
  error: string | null
  /** Transaction hash */
  txHash: Hash | undefined
  /** Reset the hook state */
  reset: () => void
  /** Whether FHE is ready for encryption */
  isFHEReady: boolean
}

/**
 * Hook for unwrapping confidential tokens back to ERC20 tokens
 *
 * This hook handles the encryption of the amount internally using FHE.
 * The unwrap process creates an unwrap request that must be finalized later.
 *
 * @param params - Unwrap parameters
 * @returns Unwrap operation functions and state
 *
 * @example
 * ```tsx
 * const { unwrap, isLoading, isSuccess, isFHEReady } = useUnwrap({
 *   tokenAddress: '0x...',
 *   onSuccess: () => console.log('Unwrap requested!')
 * })
 *
 * // Request to unwrap 100 tokens (requires FHE to be ready)
 * if (isFHEReady) {
 *   await unwrap('100')
 * }
 * ```
 */
export function useUnwrap(params: UseUnwrapParams = {}): UseUnwrapReturn {
  const { tokenAddress, onSuccess } = params
  const { address: userAddress } = useAccount()
  const { isFHEReady, fheInstance, signer } = useFHEContext()

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
   * Unwrap tokens
   *
   * @param amount - Amount of tokens to unwrap (in human-readable format, e.g., "100.5")
   */
  const unwrap = useCallback(
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
      if (!isFHEReady || !fheInstance || !signer) {
        throw new Error('FHE not ready. Please wait for initialization.')
      }

      // Reset previous state
      resetWrite()

      try {
        // Import encryption function from core
        const { encryptUint64, parseTokenAmount } = await import(
          '@z-payment/core'
        )

        // Convert to smallest unit (default 6 decimals for USD tokens)
        const amountWei = parseTokenAmount(amount, 6)

        // Encrypt the amount using FHE
        const { handle, proof } = await encryptUint64(
          fheInstance,
          tokenAddress,
          userAddress,
          amountWei,
        )

        // Convert to hex strings
        const encryptedAmount = `0x${Buffer.from(handle).toString('hex')}` as `0x${string}`
        const inputProof = `0x${Buffer.from(proof).toString('hex')}` as `0x${string}`

        // Call unwrap function on the confidential token contract
        writeContract({
          address: tokenAddress,
          abi: CONTRACTS.cUSD_ERC7984.abi,
          functionName: 'unwrap',
          args: [userAddress, userAddress, encryptedAmount, inputProof],
        })
      } catch (error) {
        console.error('Unwrap error:', error)
        throw error
      }
    },
    [
      userAddress,
      tokenAddress,
      isFHEReady,
      fheInstance,
      signer,
      resetWrite,
      writeContract,
    ],
  )

  // Execute onSuccess callback when unwrap succeeds
  useEffect(() => {
    if (isSuccess) {
      onSuccessRef.current?.()
    }
  }, [isSuccess])

  // Parse error message
  const error = writeError?.message || confirmError?.message || null

  return {
    unwrap,
    isLoading: isWritePending || isConfirming,
    isSuccess,
    error,
    txHash,
    reset: resetWrite,
    isFHEReady,
  }
}
