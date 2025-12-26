// Wrap Tab Component with Auto Wrapper Creation

'use client'

import { useState, useEffect } from 'react'
import { Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { useAccount } from 'wagmi'
import { formatUnits, parseUnits } from 'viem'
import {
  useAllowance,
  useApproval,
  useWrap,
} from '@/hooks/useWrapUnwrap'
import { useConfidentialBalance } from '@/contexts/ConfidentialBalanceContext'
import { formatErrorMessage } from '@/lib/utils'
import { useCreateWrappedToken } from '@/hooks/useFactoryContract'
import { WrapProgressIndicator, type WrapStep } from '../WrapProgressIndicator'
import type { TabComponentProps } from './types'

export function WrapTab({
  tokenPair,
  onComplete,
}: TabComponentProps) {
  const { address } = useAccount()
  const { clearBalance } = useConfidentialBalance()
  const [wrapAmount, setWrapAmount] = useState('')
  const [currentStep, setCurrentStep] = useState<WrapStep | null>(null)
  const [completedSteps, setCompletedSteps] = useState<WrapStep[]>([])

  // Check if wrapper needs to be created
  const needsWrapperCreation = !tokenPair.wrappedAddress

  // Wrapper creation hook
  const {
    createWrapper,
    isLoading: isCreatingWrapper,
    isConfirmed: isWrapperCreated,
    error: wrapperError,
    reset: resetWrapper
  } = useCreateWrappedToken()

  const { allowance, refetchAllowance } = useAllowance(
    tokenPair.erc20Address,
    tokenPair.wrappedAddress || undefined,
  )
  const {
    approveTokens,
    isLoading: isApproving,
    isConfirmed: isApprovalConfirmed,
    error: approvalError,
    reset: resetApprove
  } = useApproval(
    tokenPair.erc20Address,
    tokenPair.wrappedAddress || undefined,
    tokenPair.erc20Decimals,
  )

  const {
    wrapTokens,
    isLoading: isWrapping,
    isConfirmed: isWrapConfirmed,
    error: wrapError,
    reset: resetWrap,
  } = useWrap(tokenPair.wrappedAddress || undefined, tokenPair.erc20Decimals)

  // Reset state when token pair changes
  useEffect(() => {
    setWrapAmount('')
    setCurrentStep(null)
    setCompletedSteps([])
    resetWrap()
  }, [tokenPair.erc20Address, resetWrap])

  // Handle wrapper creation completion and trigger refetch
  useEffect(() => {
    if (isWrapperCreated) {
      resetWrapper()
      setCompletedSteps((prev) => [...prev, 'create'])
      setCurrentStep(null)

      // Trigger refetch to get the new wrapper address
      // tokenPair.wrappedAddress will update in next render
      onComplete?.()
    }
  }, [isWrapperCreated, onComplete, resetWrapper])

  // Auto-continue when wrapper address appears after creation
  useEffect(() => {
    if (
      completedSteps.includes('create') &&
      !completedSteps.includes('approve') &&
      !completedSteps.includes('wrap') &&
      tokenPair.wrappedAddress &&
      wrapAmount &&
      !currentStep &&
      address
    ) {
      console.log('✅ Wrapper address detected, continuing to next step...')

      // Check if approval is needed
      const wrapAmountWei = parseUnits(wrapAmount, tokenPair.erc20Decimals)
      const needsApproval = allowance !== undefined && wrapAmountWei > allowance

      if (needsApproval) {
        setCurrentStep('approve')
        approveTokens(wrapAmount)
      } else {
        setCurrentStep('wrap')
        wrapTokens(wrapAmount)
      }
    }
  }, [
    tokenPair.wrappedAddress,
    completedSteps,
    wrapAmount,
    currentStep,
    address,
    tokenPair.erc20Decimals,
    allowance,
    approveTokens,
    wrapTokens,
  ])

  // Handle approval completion and refetch allowance
  useEffect(() => {
    if (isApprovalConfirmed) {
      resetApprove()
      setCompletedSteps((prev) => [...prev, 'approve'])
      setCurrentStep(null)

      // Refetch allowance - it will update in next render
      refetchAllowance()
    }
  }, [isApprovalConfirmed, resetApprove, refetchAllowance])

  // Auto-continue to wrap when allowance is sufficient after approval
  useEffect(() => {
    if (
      completedSteps.includes('approve') &&
      !completedSteps.includes('wrap') &&
      wrapAmount &&
      !currentStep &&
      allowance !== undefined
    ) {
      const wrapAmountWei = parseUnits(wrapAmount, tokenPair.erc20Decimals)

      // Check if allowance is now sufficient
      if (allowance >= wrapAmountWei) {
        console.log('✅ Allowance updated, auto-continuing to wrap...')
        setCurrentStep('wrap')
        wrapTokens(wrapAmount)
      }
    }
  }, [
    allowance,
    completedSteps,
    wrapAmount,
    currentStep,
    tokenPair.erc20Decimals,
    wrapTokens,
  ])

  // Trigger parent refetch after successful wrap
  useEffect(() => {
    if (isWrapConfirmed) {
      console.log("🚩 wrap confirmed, reftch token balance")
      resetWrap()

      setCompletedSteps((prev) => [...prev, 'wrap'])
      setCurrentStep(null)
      // Clear the decrypted balance cache after wrapping
      if (tokenPair.wrappedAddress) {
        clearBalance(tokenPair.wrappedAddress)
      }
      setTimeout(() => {
        onComplete?.()
        setWrapAmount('')
        setCompletedSteps([])
      }, 2000)
    }
  }, [isWrapConfirmed, onComplete, tokenPair.wrappedAddress, clearBalance, resetWrap])

  // Handle unified wrap action - simply initiate the appropriate step
  const handleWrapAction = () => {
    if (!wrapAmount || !address) return

    // Step 1: Create wrapper if needed
    if (!tokenPair.wrappedAddress) {
      setCurrentStep('create')
      createWrapper(tokenPair.erc20Address)
      return
    }

    // Step 2: Approve if needed
    const wrapAmountWei = parseUnits(wrapAmount, tokenPair.erc20Decimals)
    const needsApproval = allowance !== undefined && wrapAmountWei > allowance

    if (needsApproval) {
      setCurrentStep('approve')
      approveTokens(wrapAmount)
      return
    }

    // Step 3: Wrap
    setCurrentStep('wrap')
    wrapTokens(wrapAmount)
  }

  const maxWrapAmount = formatUnits(
    tokenPair.erc20Balance,
    tokenPair.erc20Decimals,
  )

  const canWrap =
    address &&
    wrapAmount &&
    parseFloat(wrapAmount) > 0 &&
    parseFloat(wrapAmount) <= parseFloat(maxWrapAmount)

  const isProcessing = isCreatingWrapper || isApproving || isWrapping

  // Determine button text
  const getButtonText = () => {
    if (isCreatingWrapper) return 'Creating Wrapper...'
    if (isApproving) return 'Approving...'
    if (isWrapping) return 'Wrapping...'
    return 'Wrap Tokens'
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Shield className="h-6 w-6 text-purple-600" />
        Wrap {tokenPair.erc20Symbol} Tokens
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Convert your {tokenPair.erc20Symbol} tokens to confidential{' '}
        {tokenPair.erc20Symbol} tokens
      </p>

      <div className="space-y-4">
        {/* Progress indicator */}
        <WrapProgressIndicator
          currentStep={currentStep}
          completedSteps={completedSteps}
          needsWrapperCreation={needsWrapperCreation}
        />

        <div>
          <label className="block text-sm font-medium mb-2">
            Amount to Wrap
          </label>
          <div className="relative">
            <input
              type="number"
              value={wrapAmount}
              onChange={(e) => setWrapAmount(e.target.value)}
              placeholder="0.0"
              disabled={isProcessing}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-lg disabled:opacity-50"
              max={maxWrapAmount}
              step="any"
            />
            <button
              onClick={() => setWrapAmount(maxWrapAmount)}
              disabled={isProcessing}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-purple-600 hover:text-purple-700 text-sm font-medium disabled:opacity-50"
            >
              MAX
            </button>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Balance: {maxWrapAmount} {tokenPair.erc20Symbol}
          </div>
        </div>

        <button
          onClick={handleWrapAction}
          disabled={!canWrap || isProcessing}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {getButtonText()}
            </>
          ) : (
            getButtonText()
          )}
        </button>

        {/* Error messages */}
        {(wrapperError || approvalError || wrapError) && (
          <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
            <AlertCircle className="h-4 w-4" />
            <span>
              {formatErrorMessage(wrapperError || approvalError || wrapError)}
            </span>
          </div>
        )}

        {/* Success message */}
        {isWrapConfirmed && (
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
            <CheckCircle className="h-4 w-4" />
            <span>Successfully wrapped tokens!</span>
          </div>
        )}
      </div>
    </div>
  )
}
