// Transfer Tab Component

'use client'

import { useState, useEffect } from 'react'
import {
  ArrowUpDown,
  Shield,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from 'lucide-react'
import { useAccount } from 'wagmi'
import { parseUnits } from 'viem'
import { useTransferContract } from '@/hooks/useTransferContract'
import { useFHEContext } from '@/contexts/FHEContext'
import { useConfidentialBalance } from '@/contexts/ConfidentialBalanceContext'
import { useSidebar } from '@/contexts/SidebarContext'
import { formatTokenAmount } from '@/lib/fhe'
import { formatErrorMessage } from '@/lib/utils'
import type { TabComponentProps } from './types'

export function TransferTab({
  tokenPair,
  onComplete,
}: TabComponentProps) {
  const { address } = useAccount()
  const { isFHEReady, fheError } = useFHEContext()
  const { getBalanceState, clearBalance, getDecryptionRequirements } =
    useConfidentialBalance()
  const sidebar = useSidebar()
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')

  // Get balance state for this specific token
  const balanceState = tokenPair.wrappedAddress
    ? getBalanceState(tokenPair.wrappedAddress)
    : null

  const isBalanceVisible =
    balanceState?.decryptedBalance !== null &&
    balanceState?.decryptedBalance !== undefined &&
    !balanceState?.error

  // Check decryption requirements (needed for transfer since we use FHE)
  const decryptionStatus = getDecryptionRequirements()

  const {
    transfer,
    isLoading: isTransferLoading,
    isConfirmed,
    error: transferError,
    canTransfer,
    txHash,
  } = useTransferContract(tokenPair.wrappedAddress || undefined)

  useEffect(() => {
    if (isConfirmed) {
      setRecipient('')
      setAmount('')
      clearBalance(tokenPair.wrappedAddress as `0x${string}`)
    }
  }, [isConfirmed, clearBalance, tokenPair.wrappedAddress])

  // Check if user has sufficient balance
  const hasInsufficientBalance = (() => {
    if (!isBalanceVisible || !balanceState?.decryptedBalance || !amount) {
      return false
    }
    try {
      const amountWei = parseUnits(amount, tokenPair.erc20Decimals)
      return amountWei > balanceState.decryptedBalance
    } catch {
      // Invalid amount format
      return false
    }
  })()

  const handleTransfer = async () => {
    try {
      const transferAmount = parseUnits(amount, tokenPair.erc20Decimals)
      await transfer(recipient, transferAmount)
    } catch (error) {
      console.error('Transfer error:', error)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <ArrowUpDown className="h-6 w-6 text-blue-600" />
        Confidential {tokenPair.erc20Symbol} Transfer
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Transfer tokens while keeping amounts completely private using FHE
      </p>

      <div className="space-y-6">
        {/* Warning if confidential token doesn't exist */}
        {!tokenPair.wrappedAddress && (
          <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-1">
                Confidential Token Not Created
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                You need to wrap {tokenPair.erc20Symbol} tokens first to create
                the confidential token wrapper. Go to the Wrap tab to get
                started.
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
                {decryptionStatus.missingMessage}. Click to view system status
                details.
              </p>
            </div>
          </button>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">
            Recipient Address
          </label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            disabled={!tokenPair.wrappedAddress}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Amount (will be encrypted)
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              disabled={!tokenPair.wrappedAddress}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
            <Shield className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {!tokenPair.wrappedAddress
              ? 'Confidential token not created yet'
              : isBalanceVisible && balanceState?.decryptedBalance
              ? `Available: ${formatTokenAmount(
                  balanceState.decryptedBalance,
                )} c${tokenPair.erc20Symbol}`
              : 'This amount will be encrypted and hidden from everyone except you and the recipient'}
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h4 className="font-semibold mb-2">Transaction Preview</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>From:</span>
              <span className="font-mono">
                {address
                  ? `${address.slice(0, 6)}...${address.slice(-4)}`
                  : 'Not connected'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>To:</span>
              <span className="font-mono">
                {recipient
                  ? `${recipient.slice(0, 6)}...${recipient.slice(-4)}`
                  : 'Enter address'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Amount:</span>
              <span className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                {amount || '0.0'} (encrypted)
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleTransfer}
          disabled={
            !address ||
            !recipient ||
            !amount ||
            isTransferLoading ||
            !canTransfer ||
            !tokenPair.wrappedAddress ||
            !decryptionStatus.canDecrypt ||
            !isBalanceVisible ||
            hasInsufficientBalance
          }
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md font-medium hover:opacity-90 active:scale-95 active:opacity-75 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200`}
          title={
            !decryptionStatus.canDecrypt
              ? decryptionStatus.missingMessage ||
                'System requirements not met'
              : !isBalanceVisible
              ? 'Please decrypt your balance first to verify available funds'
              : hasInsufficientBalance
              ? 'Insufficient balance'
              : 'Send confidential transfer'
          }
        >
          {!isFHEReady && !fheError
            ? 'Initializing FHE...'
            : isTransferLoading
            ? 'Processing Transfer...'
            : 'Send Confidential Transfer'}
        </button>

        {/* Warning if balance not decrypted */}
        {!isBalanceVisible && decryptionStatus.canDecrypt && amount && (
          <div className="flex items-center justify-center gap-2 text-center text-sm text-blue-600 dark:text-blue-400">
            <AlertCircle className="h-4 w-4" />
            <span>
              Please decrypt your balance first. Click the eye icon on the
              Confidential Token balance card above.
            </span>
          </div>
        )}

        {hasInsufficientBalance && (
          <div className="flex items-center justify-center gap-2 text-center text-sm text-red-600 dark:text-red-400">
            <AlertCircle className="h-4 w-4" />
            <span>
              Insufficient balance. Available:{' '}
              {balanceState && balanceState.decryptedBalance !== null &&
                formatTokenAmount(balanceState.decryptedBalance)}{' '}
              c{tokenPair.erc20Symbol}
            </span>
          </div>
        )}

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

        {transferError && (
          <div className="flex items-center justify-center gap-2 text-center text-sm text-red-600 dark:text-red-400">
            <AlertCircle className="h-4 w-4" />
            <span>{formatErrorMessage(transferError)}</span>
          </div>
        )}

        {isConfirmed && (
          <div className="flex items-center justify-center gap-2 text-center text-sm text-green-600 dark:text-green-400">
            <CheckCircle className="h-4 w-4" />
            <span>Transfer completed successfully!</span>
            {txHash && (
              <a
                href={`https://sepolia.etherscan.io/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:no-underline"
              >
                View transaction
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
