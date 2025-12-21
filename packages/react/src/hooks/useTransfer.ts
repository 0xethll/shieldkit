/**
 * useTransfer Hook
 *
 * React hook for transferring confidential tokens between addresses
 */

import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { isAddress, type Address, type Hash } from 'viem'
import { ConfidentialERC20WrapperABI } from '../abis'
import { useFHEContext } from '../context/FHEContext'

/**
 * Transfer operation parameters
 */
export interface UseTransferParams {
  /** Address of the confidential token */
  tokenAddress?: Address
  /** Number of decimals for the token (default: 6) */
  decimals?: number
  /** Callback function to execute when transfer succeeds */
  onSuccess?: () => void
}

/**
 * Transfer operation return type
 */
export interface UseTransferReturn {
  /** Function to transfer tokens */
  transfer: (recipient: Address, amount: string) => Promise<void>
  /** Whether the transfer operation is in progress (including encryption) */
  isLoading: boolean
  /** Whether the transfer succeeded */
  isSuccess: boolean
  /** Error message if transfer failed */
  error: string | null
  /** Transaction hash */
  txHash: Hash | undefined
  /** Whether user can transfer (wallet connected and FHE ready) */
  canTransfer: boolean
  /** Reset the hook state */
  reset: () => void
  /** Whether FHE is ready for encryption */
  isFHEReady: boolean
}

/**
 * Hook for transferring confidential tokens between addresses
 *
 * This hook handles encryption of the amount internally using FHE.
 * The transfer is confidential - the amount is never revealed on-chain.
 *
 * @param params - Transfer parameters
 * @returns Transfer operation functions and state
 *
 * @example
 * ```tsx
 * const { transfer, isLoading, canTransfer } = useTransfer({
 *   tokenAddress: '0x...',
 *   decimals: 6,
 *   onSuccess: () => console.log('Transfer complete!')
 * })
 *
 * // Transfer 100 tokens to recipient
 * if (canTransfer) {
 *   await transfer('0xRecipient...', '100')
 * }
 * ```
 */
export function useTransfer(params: UseTransferParams = {}): UseTransferReturn {
  const { tokenAddress, decimals = 6, onSuccess } = params
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
   * Transfer tokens to a recipient
   *
   * @param recipient - Recipient address
   * @param amount - Amount to transfer (in human-readable format, e.g., "100.5")
   */
  const transfer = useCallback(
    async (recipient: Address, amount: string) => {
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

      if (!recipient || !isAddress(recipient)) {
        const error = 'Please enter a valid recipient address'
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

        // Import functions from core
        const { encryptUint64, parseTokenAmount } = await import(
          '@shieldkit/core'
        )

        // Convert to smallest unit
        const amountWei = parseTokenAmount(amount, decimals)

        if (amountWei <= 0n) {
          throw new Error('Amount must be greater than 0')
        }

        // Encrypt the transfer amount
        const { handle, proof } = await encryptUint64(
          fheInstance,
          tokenAddress,
          userAddress,
          amountWei,
        )

        // Convert to hex strings
        const encryptedAmount = `0x${Buffer.from(handle).toString('hex')}` as `0x${string}`
        const inputProof = `0x${Buffer.from(proof).toString('hex')}` as `0x${string}`

        // Call the confidentialTransfer function
        writeContract({
          address: tokenAddress,
          abi: ConfidentialERC20WrapperABI,
          functionName: 'confidentialTransfer',
          args: [recipient, encryptedAmount, inputProof],
        })
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Transfer failed'
        setPreTxError(message)
        console.error('Transfer error:', error)
        throw error
      } finally {
        setIsEncrypting(false)
      }
    },
    [
      isConnected,
      userAddress,
      tokenAddress,
      decimals,
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
      return 'Insufficient balance to complete this transfer'
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

  // Execute onSuccess callback when transfer succeeds
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
    transfer,
    isLoading,
    isSuccess,
    error,
    txHash,
    canTransfer: isConnected && isFHEReady && !isLoading,
    reset: () => {
      setPreTxError(null)
      resetWrite()
    },
    isFHEReady,
  }
}
