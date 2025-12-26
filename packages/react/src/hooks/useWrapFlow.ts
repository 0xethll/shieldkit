/**
 * useWrapFlow Hook
 *
 * Orchestrates the complete wrap flow: deploy → approve → wrap
 */

import { useEffect, useCallback, useState } from 'react'
import { useAccount } from 'wagmi'
import { parseUnits, type Address, type Hash } from 'viem'
import { useWrappedTokenAddress, useFactory } from './useFactory'
import { useAllowance } from './useAllowance'
import { useApproval } from './useApproval'
import { useWrap } from './useWrap'
import { CHAIN_IDS } from '../config/contracts'

/**
 * Wrap flow step type
 */
export type WrapFlowStep = 'idle' | 'deploy' | 'approve' | 'wrap' | 'complete'

/**
 * Transaction state for each step
 */
export interface TransactionState {
  /** Transaction hash */
  hash: Hash | undefined
  /** Whether transaction is in progress */
  isLoading: boolean
  /** Whether transaction succeeded */
  isSuccess: boolean
  /** Error message if failed */
  error: string | null | undefined
}

/**
 * Parameters for useWrapFlow
 */
export interface UseWrapFlowParams {
  /** Address of the ERC20 token to wrap */
  erc20Address?: Address
  /** Number of decimals for the token (default: 6) */
  decimals?: number
  /** Chain ID (defaults to Sepolia) */
  chainId?: number
  /** Callback when entire flow completes successfully */
  onSuccess?: () => void
  /** Callback when deploy step completes */
  onDeploySuccess?: () => void
  /** Callback when approve step completes */
  onApproveSuccess?: () => void
  /** Callback when wrap step completes */
  onWrapSuccess?: () => void
}

/**
 * Return type for useWrapFlow
 */
export interface UseWrapFlowReturn {
  /** Current step in the flow */
  currentStep: WrapFlowStep
  /** Whether wrapper exists for this token */
  hasWrapper: boolean
  /** Address of the wrapped token */
  wrappedAddress: Address | null
  /** Current allowance amount */
  allowance: bigint | undefined
  /** Whether allowance is sufficient for the amount */
  hasSufficientAllowance: (amount: string) => boolean
  /** Deploy wrapper contract */
  deploy: () => Promise<void>
  /** Approve tokens for wrapping */
  approve: (amount: string | 'max') => Promise<void>
  /** Wrap tokens */
  wrap: (amount: string) => Promise<void>
  /** Execute the next step automatically */
  executeNextStep: (amount: string) => Promise<void>
  /** Transaction state for deploy step */
  deployTx: TransactionState
  /** Transaction state for approve step */
  approveTx: TransactionState
  /** Transaction state for wrap step */
  wrapTx: TransactionState
  /** Whether any transaction is loading */
  isLoading: boolean
  /** Reset all states */
  reset: () => void
  /** Refetch wrapper address and allowance */
  refetch: () => void
}

/**
 * Hook for managing the complete wrap flow
 *
 * This hook orchestrates the entire process:
 * 1. Check if wrapper exists → deploy if needed
 * 2. Check allowance → approve if needed
 * 3. Wrap tokens
 *
 * @param params - Flow parameters
 * @returns Flow state and control functions
 *
 * @example Manual control
 * ```tsx
 * const {
 *   currentStep,
 *   hasWrapper,
 *   hasSufficientAllowance,
 *   deploy,
 *   approve,
 *   wrap,
 *   deployTx,
 *   approveTx,
 *   wrapTx
 * } = useWrapFlow({
 *   erc20Address: '0xToken...',
 *   decimals: 6
 * })
 *
 * // Step 1: Deploy if needed
 * {!hasWrapper && <button onClick={deploy}>Deploy Wrapper</button>}
 *
 * // Step 2: Approve if needed
 * {hasWrapper && !hasSufficientAllowance('100') && (
 *   <button onClick={() => approve('100')}>Approve</button>
 * )}
 *
 * // Step 3: Wrap
 * {hasWrapper && hasSufficientAllowance('100') && (
 *   <button onClick={() => wrap('100')}>Wrap</button>
 * )}
 * ```
 *
 * @example Automatic flow
 * ```tsx
 * const { executeNextStep, currentStep, isLoading } = useWrapFlow({
 *   erc20Address: '0xToken...',
 *   decimals: 6,
 *   onSuccess: () => console.log('All done!')
 * })
 *
 * <button onClick={() => executeNextStep('100')} disabled={isLoading}>
 *   {currentStep === 'deploy' && 'Deploy Wrapper'}
 *   {currentStep === 'approve' && 'Approve Tokens'}
 *   {currentStep === 'wrap' && 'Wrap to Private'}
 *   {currentStep === 'complete' && 'Complete!'}
 * </button>
 * ```
 */
export function useWrapFlow(params: UseWrapFlowParams = {}): UseWrapFlowReturn {
  const {
    erc20Address,
    decimals = 6,
    chainId = CHAIN_IDS.SEPOLIA,
    onSuccess,
    onDeploySuccess,
    onApproveSuccess,
    onWrapSuccess,
  } = params

  const { address: userAddress } = useAccount()

  // Track current step manually to handle transitions
  const [currentStep, setCurrentStep] = useState<WrapFlowStep>('idle')

  // 1. Check if wrapper exists
  const {
    wrappedAddress,
    isLoading: isLoadingWrapper,
    refetch: refetchWrapper,
  } = useWrappedTokenAddress(erc20Address, chainId)

  // 2. Factory hook for deploying wrapper
  const {
    createWrapper,
    isLoading: isDeployLoading,
    isSuccess: isDeploySuccess,
    error: deployError,
    txHash: deployHash,
    reset: resetDeploy,
  } = useFactory({
    chainId,
    onSuccess: () => {
      onDeploySuccess?.()
      refetchWrapper()
    },
  })

  // 3. Check allowance
  const {
    allowance,
    refetch: refetchAllowance,
  } = useAllowance({
    tokenAddress: erc20Address,
    spenderAddress: wrappedAddress || undefined,
    ownerAddress: userAddress,
  })

  // 4. Approval hook
  const {
    approve: approveTokens,
    isLoading: isApproveLoading,
    isSuccess: isApproveSuccess,
    error: approveError,
    txHash: approveHash,
    reset: resetApprove,
  } = useApproval({
    tokenAddress: erc20Address,
    spenderAddress: wrappedAddress || undefined,
    decimals,
    onSuccess: () => {
      onApproveSuccess?.()
      refetchAllowance()
    },
  })

  // 5. Wrap hook
  const {
    wrap: wrapTokens,
    isLoading: isWrapLoading,
    isSuccess: isWrapSuccess,
    error: wrapError,
    txHash: wrapHash,
    reset: resetWrap,
  } = useWrap({
    tokenAddress: wrappedAddress || undefined,
    decimals,
    onSuccess: () => {
      onWrapSuccess?.()
      setCurrentStep('complete')
    },
  })

  // Helper to check if allowance is sufficient
  const hasSufficientAllowance = useCallback(
    (amount: string) => {
      if (!allowance || !amount) return false
      try {
        const requiredAmount = parseUnits(amount, decimals)
        return allowance >= requiredAmount
      } catch {
        return false
      }
    },
    [allowance, decimals],
  )

  // Determine current step based on state
  useEffect(() => {
    if (currentStep === 'complete' || currentStep === 'idle') {
      // Don't auto-change from these states
      return
    }

    // Deploy step
    if (!wrappedAddress && !isDeployLoading && !isDeploySuccess) {
      setCurrentStep('deploy')
      return
    }

    // Approve step (after wrapper exists or deploys)
    if (wrappedAddress && !isApproveLoading && !isApproveSuccess) {
      setCurrentStep('approve')
      return
    }

    // Wrap step (after approval)
    if (wrappedAddress && isApproveSuccess && !isWrapLoading && !isWrapSuccess) {
      setCurrentStep('wrap')
      return
    }

    // Complete
    if (isWrapSuccess) {
      setCurrentStep('complete')
      onSuccess?.()
    }
  }, [
    wrappedAddress,
    isDeployLoading,
    isDeploySuccess,
    isApproveLoading,
    isApproveSuccess,
    isWrapLoading,
    isWrapSuccess,
    currentStep,
    onSuccess,
  ])

  // Deploy wrapper
  const deploy = useCallback(async () => {
    if (!erc20Address) {
      throw new Error('ERC20 address not provided')
    }
    setCurrentStep('deploy')
    await createWrapper(erc20Address)
  }, [erc20Address, createWrapper])

  // Approve tokens
  const approve = useCallback(
    async (amount: string | 'max') => {
      setCurrentStep('approve')
      await approveTokens(amount)
    },
    [approveTokens],
  )

  // Wrap tokens
  const wrap = useCallback(
    async (amount: string) => {
      setCurrentStep('wrap')
      await wrapTokens(amount)
    },
    [wrapTokens],
  )

  // Execute next step automatically
  const executeNextStep = useCallback(
    async (amount: string) => {
      // Step 1: Deploy wrapper if needed
      if (!wrappedAddress) {
        await deploy()
        return
      }

      // Step 2: Approve if insufficient allowance
      if (!hasSufficientAllowance(amount)) {
        await approve(amount)
        return
      }

      // Step 3: Wrap
      await wrap(amount)
    },
    [wrappedAddress, hasSufficientAllowance, deploy, approve, wrap],
  )

  // Reset all states
  const reset = useCallback(() => {
    resetDeploy()
    resetApprove()
    resetWrap()
    setCurrentStep('idle')
  }, [resetDeploy, resetApprove, resetWrap])

  // Refetch wrapper and allowance
  const refetch = useCallback(() => {
    refetchWrapper()
    refetchAllowance()
  }, [refetchWrapper, refetchAllowance])

  // Transaction states
  const deployTx: TransactionState = {
    hash: deployHash,
    isLoading: isDeployLoading,
    isSuccess: isDeploySuccess,
    error: deployError,
  }

  const approveTx: TransactionState = {
    hash: approveHash,
    isLoading: isApproveLoading,
    isSuccess: isApproveSuccess,
    error: approveError,
  }

  const wrapTx: TransactionState = {
    hash: wrapHash,
    isLoading: isWrapLoading,
    isSuccess: isWrapSuccess,
    error: wrapError,
  }

  const isLoading = isDeployLoading || isApproveLoading || isWrapLoading || isLoadingWrapper

  return {
    currentStep,
    hasWrapper: !!wrappedAddress,
    wrappedAddress,
    allowance,
    hasSufficientAllowance,
    deploy,
    approve,
    wrap,
    executeNextStep,
    deployTx,
    approveTx,
    wrapTx,
    isLoading,
    reset,
    refetch,
  }
}
