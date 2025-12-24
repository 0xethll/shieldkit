/**
 * useUnwrap Hook
 *
 * React hook for unwrapping confidential tokens back to ERC20 tokens
 */

import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { toHex, type Address, type Hash } from 'viem'
import { ConfidentialERC20WrapperABI } from '../abis'
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
  /** Whether the unwrap operation is in progress (including encryption) */
  isLoading: boolean
  /** Whether the unwrap operation succeeded */
  isSuccess: boolean
  /** Error message if unwrap failed */
  error: string | null
  /** Transaction hash */
  txHash: Hash | undefined
  /** Whether user can unwrap (wallet connected and FHE ready) */
  canUnwrap: boolean
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
  const { address: userAddress, isConnected } = useAccount()
  const { isFHEReady, fheInstance } = useFHEContext()

  const [isEncrypting, setIsEncrypting] = useState(false)
  const [preTxError, setPreTxError] = useState<string | null>(null)

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
      setPreTxError(null)

      // Validation
      if (!isConnected) {
        const error = 'Please connect your wallet first'
        setPreTxError(error)
        throw new Error(error)
      }

      if (!userAddress) {
        const error = 'No wallet address found'
        setPreTxError(error)
        throw new Error(error)
      }

      if (!tokenAddress) {
        const error = 'Token address not provided'
        setPreTxError(error)
        throw new Error(error)
      }

      if (!isFHEReady || !fheInstance) {
        const error = 'FHE system is not ready. Please wait for initialization.'
        setPreTxError(error)
        throw new Error(error)
      }

      if (!amount || amount === '0') {
        const error = 'Please enter a valid amount'
        setPreTxError(error)
        throw new Error(error)
      }

      try {
        setIsEncrypting(true)
        resetWrite()

        // Import encryption function from core
        const { encryptUint64, parseTokenAmount } = await import(
          '@shieldkit/core'
        )

        // Convert to smallest unit (default 6 decimals for USD tokens)
        const amountWei = parseTokenAmount(amount, 6)

        if (amountWei <= 0n) {
          throw new Error('Amount must be greater than 0')
        }

        // Encrypt the amount using FHE
        console.log('Encrypting amount:', amountWei)
        const { handle, proof } = await encryptUint64(
          fheInstance,
          tokenAddress,
          userAddress,
          amountWei,
        )

        // Call unwrap function on the confidential token contract
        writeContract({
          address: tokenAddress,
          abi: ConfidentialERC20WrapperABI,
          functionName: 'unwrap',
          args: [userAddress, userAddress, toHex(handle), toHex(proof)],
        })
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Unwrap failed'
        setPreTxError(message)
        console.error('Unwrap error:', error)
        throw error
      } finally {
        setIsEncrypting(false)
      }
    },
    [
      isConnected,
      userAddress,
      tokenAddress,
      isFHEReady,
      fheInstance,
      resetWrite,
      writeContract,
    ],
  )

  // Parse contract errors for user-friendly messages
  const parsedContractError = useMemo(() => {
    const error = writeError || confirmError
    if (!error) return null

    const errorStr = error.toString()

    if (errorStr.includes('InsufficientBalance')) {
      return 'Insufficient balance to complete this unwrap'
    }

    if (errorStr.includes('rejected')) {
      return 'Transaction was rejected by user'
    }

    if (errorStr.includes('insufficient funds')) {
      return 'Insufficient funds to pay for gas fees'
    }

    if (errorStr.includes('InvalidProof')) {
      return 'Invalid encryption proof. Please try again'
    }

    return 'Transaction failed. Please try again'
  }, [writeError, confirmError])

  // Execute onSuccess callback when unwrap succeeds
  useEffect(() => {
    if (isSuccess) {
      onSuccessRef.current?.()
    }
  }, [isSuccess])

  // Reset pre-transaction error when starting new transaction
  useEffect(() => {
    if (isWritePending || isConfirming) {
      setPreTxError(null)
    }
  }, [isWritePending, isConfirming])

  const isLoading = isEncrypting || isWritePending || isConfirming
  const error = preTxError || parsedContractError

  return {
    unwrap,
    isLoading,
    isSuccess,
    error,
    txHash,
    canUnwrap: isConnected && isFHEReady && !isLoading,
    reset: () => {
      setPreTxError(null)
      resetWrite()
    },
    isFHEReady,
  }
}
