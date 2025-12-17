// React hooks for wrap/unwrap operations

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from 'wagmi'
import { CONTRACTS } from '@/lib/contracts'
import { parseUnits, type Address } from 'viem'

// Reusable standard ERC20 ABI from the contracts file
const erc20Abi = CONTRACTS.USD_ERC20.abi
// Reusable wrapper ABI from the contracts file
const wrapperAbi = CONTRACTS.cUSD_ERC7984.abi

/**
 * Generic hook to check token allowance for a spender.
 */
export function useAllowance(
  tokenAddress?: Address,
  spenderAddress?: Address,
) {
  const { address } = useAccount()

  const { data: allowance, refetch } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'allowance',
    args: address && spenderAddress ? [address, spenderAddress] : undefined,
    query: {
      enabled: !!address && !!tokenAddress && !!spenderAddress,
    },
  })

  return {
    allowance,
    refetchAllowance: refetch,
  }
}

/**
 * Generic hook to approve tokens for a spender.
 */
export function useApproval(
  tokenAddress?: Address,
  spenderAddress?: Address,
  decimals: number = 18,
) {
  const {
    writeContract,
    data: hash,
    reset,
    isPending,
    error: writeError,
  } = useWriteContract()

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash,
  })

  const approveTokens = useCallback(
    async (amount: string) => {
      if (!tokenAddress || !spenderAddress) {
        throw new Error('Token addresses not provided for approval.')
      }
      
      reset()

      const amountWei = parseUnits(amount, decimals)

      writeContract({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: 'approve',
        args: [spenderAddress, amountWei],
      })
    },
    [tokenAddress, spenderAddress, decimals, reset, writeContract],
  )

  const error = writeError?.message || confirmError?.message

  return {
    approveTokens,
    isLoading: isPending || isConfirming,
    isConfirmed,
    error,
    hash,
    reset,
  }
}

/**
 * Generic hook for wrapping tokens.
 */
export function useWrap(
  wrappedTokenAddress?: Address,
  decimals: number = 18,
  onSuccess?: () => void,
) {
  const { address } = useAccount()

  const onSuccessRef = useRef(onSuccess)
  useEffect(() => {
    onSuccessRef.current = onSuccess
  }, [onSuccess])

  const {
    writeContract,
    data: hash,
    reset,
    isPending,
    error: writeError,
  } = useWriteContract()

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash,
  })

  const wrapTokens = useCallback(
    async (amount: string) => {
      if (!address || !amount || !wrappedTokenAddress) return
      reset()

      const amountWei = parseUnits(amount, decimals)

      writeContract({
        address: wrappedTokenAddress,
        abi: wrapperAbi,
        functionName: 'wrap',
        args: [address, amountWei],
      })
    },
    [address, wrappedTokenAddress, decimals, reset, writeContract],
  )

  useEffect(() => {
    if (isConfirmed) {
      onSuccessRef.current?.()
    }
  }, [isConfirmed])

  const error = writeError || confirmError

  return {
    wrapTokens,
    isLoading: isPending || isConfirming,
    isConfirmed,
    error: error?.message || null,
    hash,
    reset,
  }
}

/**
 * Generic hook for unwrapping tokens.
 */
export function useUnwrap(
  wrappedTokenAddress?: Address,
  onSuccess?: () => void,
) {
  const { address } = useAccount()

  const onSuccessRef = useRef(onSuccess)
  useEffect(() => {
    onSuccessRef.current = onSuccess
  }, [onSuccess])

  const {
    writeContract,
    data: hash,
    reset,
    isPending,
    error: writeError,
  } = useWriteContract()

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash,
  })

  const unwrapTokens = useCallback(
    async (encryptedAmount: `0x${string}`, inputProof: `0x${string}`) => {
      if (!address || !encryptedAmount || !inputProof || !wrappedTokenAddress)
        return
      reset()

      writeContract({
        address: wrappedTokenAddress,
        abi: wrapperAbi,
        functionName: 'unwrap',
        args: [address, address, encryptedAmount, inputProof],
      })
    },
    [address, wrappedTokenAddress, reset, writeContract],
  )

  useEffect(() => {
    if (isConfirmed) {
      onSuccessRef.current?.()
    }
  }, [isConfirmed])

  const error = writeError || confirmError

  return {
    unwrapTokens,
    isLoading: isPending || isConfirming,
    isConfirmed,
    error: error?.message || null,
    hash,
    reset,
  }
}