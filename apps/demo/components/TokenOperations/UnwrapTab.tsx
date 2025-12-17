// Unwrap Tab Component

'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  DollarSign,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
} from 'lucide-react'
import { useAccount } from 'wagmi'
import { parseUnits } from 'viem'
import { toHex } from 'viem'
import { useUnwrap } from '@/hooks/useWrapUnwrap'
import { useFHEContext } from '@/contexts/FHEContext'
import { useConfidentialBalance } from '@/contexts/ConfidentialBalanceContext'
import { useSidebar } from '@/contexts/SidebarContext'
import { encryptUint64, formatTokenAmount } from '@/lib/fhe'
import { formatErrorMessage } from '@/lib/utils'
import { UnwrapRequestsList } from '@/components/UnwrapRequestsList'
import { useUnwrapRequests } from '@/hooks/useUnwrapRequests'
import type { TabComponentProps } from './types'

export function UnwrapTab({
  tokenPair,
  onTokenBalanceUpdate,
}: TabComponentProps) {
  const { address } = useAccount()
  const { isFHEReady, fheInstance, fheError } = useFHEContext()
  const { getBalanceState, clearBalance, getDecryptionRequirements } =
    useConfidentialBalance()
  const sidebar = useSidebar()
  const [unwrapAmount, setUnwrapAmount] = useState('')
  const [isPreparingUnwrap, setIsPreparingUnwrap] = useState(false)

  // Get balance state for this specific token
  const balanceState = tokenPair.wrappedAddress
    ? getBalanceState(tokenPair.wrappedAddress)
    : null

  const isBalanceVisible =
    balanceState?.decryptedBalance !== null &&
    balanceState?.decryptedBalance !== undefined &&
    !balanceState?.error

  // Check decryption requirements (needed for unwrap since we encrypt the amount)
  const decryptionStatus = getDecryptionRequirements()

  const {
    unwrapRequests,
    isLoading: isLoadingRequests,
    error: requestsError,
    refetch: refetchRequests,
  } = useUnwrapRequests(tokenPair.wrappedAddress as `0x${string}`)

  const {
    unwrapTokens,
    isLoading: isUnwrapping,
    isConfirmed: isUnwrapConfirmed,
    error: unwrapError,
  } = useUnwrap(tokenPair.wrappedAddress || undefined)

  // Callback when finalize unwrap succeeds
  const handleFinalizeSuccess = useCallback(async () => {
    // 1. Update ERC20 token balance (the unwrapped token)
    onTokenBalanceUpdate?.(tokenPair.erc20Address)

    // Wait for indexer to catch up with blockchain data
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // 2. Update unwrap requests list
    await refetchRequests()
  }, [refetchRequests, onTokenBalanceUpdate, tokenPair.erc20Address])

  useEffect(() => {
    if (isUnwrapConfirmed) {
      setIsPreparingUnwrap(false)
      setUnwrapAmount('')

      // Clear the decrypted balance cache after unwrapping
      if (tokenPair.wrappedAddress) {
        clearBalance(tokenPair.wrappedAddress)
      }

      // Refetch unwrap requests to update the list
      const refetch = async () => {
        // Initial delay to allow indexer to catch up
        await new Promise((resolve) => setTimeout(resolve, 3000))
        
        await refetchRequests()
      }
      refetch()
    } else if (unwrapError) {
      setIsPreparingUnwrap(false)
    }
  }, [
    isUnwrapConfirmed,
    unwrapError,
    tokenPair.wrappedAddress,
    clearBalance,
    refetchRequests,
  ])

  const handleUnwrap = async () => {
    if (!unwrapAmount || !address || !isFHEReady || !fheInstance) return

    setIsPreparingUnwrap(true)

    await new Promise(resolve => setTimeout(resolve, 0))

    try {
      const amountWei = parseUnits(unwrapAmount, tokenPair.erc20Decimals)
      const { handle, proof } = await encryptUint64(
        fheInstance,
        tokenPair.wrappedAddress!,
        address,
        amountWei,
      )

      unwrapTokens(
        toHex(handle) as `0x${string}`,
        toHex(proof) as `0x${string}`,
      )
      setIsPreparingUnwrap(false)
    } catch (error) {
      console.error('Unwrap error:', error)
      setIsPreparingUnwrap(false)
    }
  }

  const maxUnwrapAmount =
    balanceState?.decryptedBalance
      ? formatTokenAmount(balanceState.decryptedBalance)
      : '0'

  const canUnwrap =
    address &&
    isFHEReady &&
    unwrapAmount &&
    parseFloat(unwrapAmount) > 0 &&
    parseFloat(unwrapAmount) <= parseFloat(maxUnwrapAmount) &&
    tokenPair.wrappedBalance

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <DollarSign className="h-6 w-6 text-blue-600" />
          Unwrap to {tokenPair.erc20Symbol} Tokens
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Convert your wrapped Confidential {tokenPair.erc20Symbol} tokens back
          to regular {tokenPair.erc20Symbol} tokens
        </p>

        <div className="space-y-4">
          {/* Warning if confidential token doesn't exist */}
          {!tokenPair.wrappedAddress && (
            <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-1">
                  Confidential Token Not Created
                </h4>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  You need to wrap {tokenPair.erc20Symbol} tokens first to
                  create the confidential token wrapper. Go to the Wrap tab to
                  get started.
                </p>
              </div>
            </div>
          )}

          {/* Warning if system requirements not met */}
          {tokenPair.wrappedAddress && !decryptionStatus.canDecrypt && (
            <button
              onClick={() => sidebar.open()}
              className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg w-full text-left hover:bg-amber-100 dark:hover:bg-amber-900 transition-colors group"
            >
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-1 flex items-center gap-2">
                  System Requirements Not Met
                  <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h4>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  {decryptionStatus.missingMessage}. Click to view system
                  status details.
                </p>
              </div>
            </button>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">
              Amount to Unwrap
            </label>
            <div className="relative">
              <input
                type="number"
                value={unwrapAmount}
                onChange={(e) => setUnwrapAmount(e.target.value)}
                placeholder="0.0"
                disabled={!tokenPair.wrappedAddress}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-lg disabled:opacity-50"
                max={maxUnwrapAmount}
                step="any"
              />
              <button
                onClick={() => setUnwrapAmount(maxUnwrapAmount)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50"
                disabled={!isBalanceVisible || !tokenPair.wrappedAddress}
              >
                MAX
              </button>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {!tokenPair.wrappedAddress
                ? 'Confidential token not created yet'
                : isBalanceVisible
                ? `Balance: ${maxUnwrapAmount} c${tokenPair.erc20Symbol}`
                : 'Decrypt wrapped balance to view available amount'}
            </div>
          </div>

          {/* Warning if balance not decrypted */}
          {!isBalanceVisible && decryptionStatus.canDecrypt && unwrapAmount && (
            <div className="flex items-center justify-center gap-2 text-center text-sm text-blue-600 dark:text-blue-400">
              <AlertCircle className="h-4 w-4" />
              <span>
                Please decrypt your balance first. Click the eye icon on the
                Confidential Token balance card above.
              </span>
            </div>
          )}

          <button
            onClick={handleUnwrap}
            disabled={
              !canUnwrap ||
              isUnwrapping ||
              isPreparingUnwrap ||
              !tokenPair.wrappedAddress ||
              !decryptionStatus.canDecrypt
            }
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
            title={
              !decryptionStatus.canDecrypt
                ? decryptionStatus.missingMessage ||
                  'System requirements not met'
                : 'Unwrap tokens'
            }
          >
            {isPreparingUnwrap ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Preparing...
              </>
            ) : isUnwrapping ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Unwrapping...
              </>
            ) : (
              'Unwrap Tokens'
            )}
          </button>

          {!isFHEReady && !fheError && (
            <p className="text-center text-sm text-blue-600 dark:text-blue-400">
              Initializing FHE encryption... Please wait.
            </p>
          )}

          {fheError && (
            <div className="flex items-center justify-center gap-2 text-center text-sm text-red-600 dark:text-red-400">
              <AlertCircle className="h-4 w-4" />
              <span>FHE Error: {fheError}</span>
            </div>
          )}

          {unwrapError && (
            <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
              <AlertCircle className="h-4 w-4" />
              <span>{formatErrorMessage(unwrapError)}</span>
            </div>
          )}

          {isUnwrapConfirmed && (
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <CheckCircle className="h-4 w-4" />
              <span>Successfully unwrapped tokens!</span>
            </div>
          )}
        </div>
      </div>

      {/* Unwrap Requests List */}
      {address && (
        <UnwrapRequestsList
          requests={unwrapRequests}
          isLoading={isLoadingRequests}
          error={requestsError}
          refetch={refetchRequests}
          onFinalizeSuccess={handleFinalizeSuccess}
        />
      )}
    </div>
  )
}
