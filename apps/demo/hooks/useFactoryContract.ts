// Hook for interacting with ConfidentialTokenFactory contract

import { useCallback } from 'react'
import { useAccount, useWaitForTransactionReceipt, useWriteContract, useReadContract } from 'wagmi'
import { CONTRACTS } from '@/lib/contracts'
import type { Address } from 'viem'

/**
 * Hook for creating wrapped confidential tokens
 */
export function useCreateWrappedToken() {
  const { address } = useAccount()

  const {
    data: hash,
    writeContract,
    isPending,
    error: writeError,
    reset,
  } = useWriteContract()

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash,
  })

  const createWrapper = useCallback(
    async (erc20Address: Address) => {
      if (!address) {
        throw new Error('Wallet not connected')
      }

      try {
        writeContract({
          address: CONTRACTS.ConfidentialTokenFactory.address,
          abi: CONTRACTS.ConfidentialTokenFactory.abi,
          functionName: 'createConfidentialToken',
          args: [erc20Address],
        })
      } catch (error) {
        console.error('Create wrapper error:', error)
        throw error
      }
    },
    [address, writeContract]
  )

  const error = writeError || confirmError
  const isLoading = isPending || isConfirming

  return {
    createWrapper,
    isLoading,
    isConfirmed,
    error: error?.message,
    reset,
    txHash: hash,
  }
}

/**
 * Hook for reading wrapped token address for a given ERC20
 */
export function useWrappedTokenAddress(erc20Address: Address | null | undefined) {
  const { data: wrappedAddress, refetch, isLoading } = useReadContract({
    address: CONTRACTS.ConfidentialTokenFactory.address,
    abi: CONTRACTS.ConfidentialTokenFactory.abi,
    functionName: 'getConfidentialToken',
    args: erc20Address ? [erc20Address] : undefined,
    query: {
      enabled: !!erc20Address,
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
 * Combined hook for factory operations
 */
export function useFactoryContract() {
  const createHook = useCreateWrappedToken()

  return {
    ...createHook,
    useWrappedTokenAddress,
  }
}
