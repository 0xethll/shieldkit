// React hooks for Confidential USD transfers

import { useState, useMemo, useEffect, useCallback } from 'react'
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { CONTRACTS } from '@/lib/contracts'
import { useFHEContext } from '@/contexts/FHEContext'
import { encryptUint64 } from '@/lib/fhe'
import { toHex, isAddress, type Address } from 'viem'
import { useCUSDBalance } from './useTokenContract'

/**
 * Hook to transfer Confidential tokens
 */
export function useTransferContract(tokenAddress?: Address) {
  const { address, isConnected } = useAccount()
  const { isFHEReady, fheInstance } = useFHEContext()
  const { refetch: refetchBalance } = useCUSDBalance()
  const [isEncrypting, setIsEncrypting] = useState(false)
  const [preTxError, setPreTxError] = useState<string | null>(null)

  // Contract write hook
  const {
    writeContract: transferTokens,
    data: txHash,
    isPending: isWriting,
    error: writeError,
    reset: resetWrite,
  } = useWriteContract()

  // Wait for transaction confirmation
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  })

  const transfer = useCallback(
    async (recipient: string, amount: bigint): Promise<void> => {
      setPreTxError(null)

      if (!isConnected) {
        setPreTxError('Please connect your wallet first')
        return
      }

      if (!address) {
        setPreTxError('No wallet address found')
        return
      }

      if (!tokenAddress) {
        setPreTxError('Token address not provided')
        return
      }

      if (!isFHEReady || !fheInstance) {
        setPreTxError('FHE system is not ready. Please wait for initialization.')
        return
      }

      if (!recipient || !isAddress(recipient)) {
        setPreTxError('Please enter a valid recipient address')
        return
      }

      if (!amount || amount <= 0n) {
        setPreTxError('Please enter a valid amount')
        return
      }

      try {
        setIsEncrypting(true)
        resetWrite()

        // Encrypt the transfer amount
        const { handle, proof } = await encryptUint64(
          fheInstance,
          tokenAddress,
          address,
          amount,
        )

        // Call the transfer function
        transferTokens({
          address: tokenAddress,
          abi: CONTRACTS.cUSD_ERC7984.abi,
          functionName: 'confidentialTransfer',
          args: [recipient, toHex(handle), toHex(proof)],
        })
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Encryption failed.'
        setPreTxError(message)
        console.error('Error preparing transfer transaction:', error)
      } finally {
        setIsEncrypting(false)
      }
    },
    [
      isConnected,
      address,
      tokenAddress,
      isFHEReady,
      fheInstance,
      resetWrite,
      transferTokens,
    ],
  )

  // Parse contract errors for user-friendly messages
  const parsedContractError = useMemo(() => {
    const error = writeError || confirmError
    if (!error) return null

    const errorStr = error.toString()

    if (errorStr.includes('InsufficientBalance')) {
      return 'Insufficient balance to complete this transfer.'
    }

    if (errorStr.includes('rejected')) {
      return 'Transaction was rejected by user.'
    }

    if (errorStr.includes('insufficient funds')) {
      return 'Insufficient funds to pay for gas fees.'
    }

    if (errorStr.includes('InvalidProof')) {
      return 'Invalid encryption proof. Please try again.'
    }

    return 'Transaction failed. Please try again.'
  }, [writeError, confirmError])

  // Refetch balance after successful transfer
  useEffect(() => {
    if (isConfirmed) {
      refetchBalance()
    }
  }, [isConfirmed, refetchBalance])

  const isLoading = isEncrypting || isWriting || isConfirming
  const error = preTxError || parsedContractError

  return {
    transfer,
    isLoading,
    isConfirmed,
    txHash,
    error,
    canTransfer: isConnected && isFHEReady && !isLoading,
    reset: () => {
      setPreTxError(null)
      resetWrite()
    },
  }
}
